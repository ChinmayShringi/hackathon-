#!/usr/bin/env tsx

import './_setup-env.ts';
import { db } from '../server/db.ts';
import { generations, users, recipes } from '../shared/schema.ts';
import { eq, inArray, desc, asc, and, not, sql, count } from 'drizzle-orm';
import * as fal from '@fal-ai/serverless-client';

interface QueueJob {
  id: number;
  userId: string;
  recipeTitle: string | null;
  prompt: string;
  status: string;
  createdAt: Date | null;
  processingStartedAt: Date | null;
  queuePosition: number | null;
  creditsCost: number | null;
  retryCount: number;
  maxRetries: number;
  failureReason: string | null;
}

class QueueManager {
  private activeStatuses = ['pending', 'processing', 'In Queue'];
  private completedStatuses = ['completed'];
  private failedStatuses = ['failed'];

  async listActiveJobs(limit: number = 50): Promise<QueueJob[]> {
    console.log(`🔍 Listing active jobs (status: ${this.activeStatuses.join(', ')})...\n`);

    try {
      const jobs = await db.select({
        id: generations.id,
        userId: generations.userId,
        recipeTitle: generations.recipeTitle,
        prompt: generations.prompt,
        status: generations.status,
        createdAt: generations.createdAt,
        processingStartedAt: generations.processingStartedAt,
        queuePosition: generations.queuePosition,
        creditsCost: generations.creditsCost,
        retryCount: generations.retryCount,
        maxRetries: generations.maxRetries,
        failureReason: generations.failureReason,
      })
      .from(generations)
      .where(
        inArray(generations.status, this.activeStatuses)
      )
      .orderBy(asc(generations.createdAt))
      .limit(limit);

      return jobs;
    } catch (error) {
      console.error('❌ Error fetching active jobs:', error);
      throw error;
    }
  }

  async listAllJobs(limit: number = 50): Promise<QueueJob[]> {
    console.log(`🔍 Listing all jobs...\n`);

    try {
      const jobs = await db.select({
        id: generations.id,
        userId: generations.userId,
        recipeTitle: generations.recipeTitle,
        prompt: generations.prompt,
        status: generations.status,
        createdAt: generations.createdAt,
        processingStartedAt: generations.processingStartedAt,
        queuePosition: generations.queuePosition,
        creditsCost: generations.creditsCost,
        retryCount: generations.retryCount,
        maxRetries: generations.maxRetries,
        failureReason: generations.failureReason,
      })
      .from(generations)
      .orderBy(desc(generations.createdAt))
      .limit(limit);

      return jobs;
    } catch (error) {
      console.error('❌ Error fetching all jobs:', error);
      throw error;
    }
  }

  async listFailedJobs(limit: number = 50): Promise<QueueJob[]> {
    console.log(`🔍 Listing failed jobs...\n`);

    try {
      const jobs = await db.select({
        id: generations.id,
        userId: generations.userId,
        recipeTitle: generations.recipeTitle,
        prompt: generations.prompt,
        status: generations.status,
        createdAt: generations.createdAt,
        processingStartedAt: generations.processingStartedAt,
        queuePosition: generations.queuePosition,
        creditsCost: generations.creditsCost,
        retryCount: generations.retryCount,
        maxRetries: generations.maxRetries,
        failureReason: generations.failureReason,
      })
      .from(generations)
      .where(
        inArray(generations.status, this.failedStatuses)
      )
      .orderBy(desc(generations.createdAt))
      .limit(limit);

      return jobs;
    } catch (error) {
      console.error('❌ Error fetching failed jobs:', error);
      throw error;
    }
  }

  async getQueueStats(): Promise<{
    active: number;
    completed: number;
    failed: number;
    total: number;
  }> {
    try {
      const [activeCount] = await db.select({ count: count() })
        .from(generations)
        .where(inArray(generations.status, this.activeStatuses));

      const [completedCount] = await db.select({ count: count() })
        .from(generations)
        .where(inArray(generations.status, this.completedStatuses));

      const [failedCount] = await db.select({ count: count() })
        .from(generations)
        .where(inArray(generations.status, this.failedStatuses));

      const [totalCount] = await db.select({ count: count() })
        .from(generations);

      return {
        active: Number(activeCount.count),
        completed: Number(completedCount.count),
        failed: Number(failedCount.count),
        total: Number(totalCount.count),
      };
    } catch (error) {
      console.error('❌ Error fetching queue stats:', error);
      throw error;
    }
  }

  async retryFailedJob(jobId: number): Promise<boolean> {
    try {
      const job = await db.select()
        .from(generations)
        .where(eq(generations.id, jobId))
        .limit(1);

      if (!job.length) {
        console.error(`❌ Job ${jobId} not found`);
        return false;
      }

      if (job[0].status !== 'failed') {
        console.error(`❌ Job ${jobId} is not failed (status: ${job[0].status})`);
        return false;
      }

      if (job[0].retryCount >= job[0].maxRetries) {
        console.error(`❌ Job ${jobId} has exceeded max retries (${job[0].retryCount}/${job[0].maxRetries})`);
        return false;
      }

      await db.update(generations)
        .set({
          status: 'pending',
          retryCount: job[0].retryCount + 1,
          failureReason: null,
          errorDetails: null,
          updatedAt: new Date(),
        })
        .where(eq(generations.id, jobId));

      console.log(`✅ Job ${jobId} retried successfully`);
      return true;
    } catch (error) {
      console.error(`❌ Error retrying job ${jobId}:`, error);
      return false;
    }
  }

  async cancelJob(jobId: number): Promise<boolean> {
    try {
      const job = await db.select()
        .from(generations)
        .where(eq(generations.id, jobId))
        .limit(1);

      if (!job.length) {
        console.error(`❌ Job ${jobId} not found`);
        return false;
      }

      if (!this.activeStatuses.includes(job[0].status as any)) {
        console.error(`❌ Job ${jobId} is not active (status: ${job[0].status})`);
        return false;
      }

      await db.update(generations)
        .set({
          status: 'failed',
          failureReason: 'Cancelled by admin',
          updatedAt: new Date(),
        })
        .where(eq(generations.id, jobId));

      console.log(`✅ Job ${jobId} cancelled successfully`);
      return true;
    } catch (error) {
      console.error(`❌ Error cancelling job ${jobId}:`, error);
      return false;
    }
  }

  async checkProviderStatus(jobId: number): Promise<boolean> {
    try {
      const job = await db.select({
        id: generations.id,
        status: generations.status,
        falJobId: generations.falJobId,
        falJobStatus: generations.falJobStatus,
        metadata: generations.metadata,
        recipeTitle: generations.recipeTitle,
        prompt: generations.prompt,
        createdAt: generations.createdAt,
      })
        .from(generations)
        .where(eq(generations.id, jobId))
        .limit(1);

      if (!job.length) {
        console.error(`❌ Job ${jobId} not found`);
        return false;
      }

      const generation = job[0];
      console.log(`🔍 Checking provider status for job ${jobId}...`);
      console.log(`  Local status: ${generation.status}`);
      console.log(`  FAL Job ID: ${generation.falJobId || 'None'}`);
      console.log(`  Recipe: ${generation.recipeTitle || 'N/A'}`);
      console.log(`  Created: ${this.getAgeString(generation.createdAt)}`);

      // Check if this is a FAL job
      if (generation.falJobId) {
        return await this.checkFalJobStatus(generation.falJobId, generation.metadata);
      }

      // Check metadata for other provider information
      if (generation.metadata) {
        const metadata = generation.metadata as any;
        if (metadata.jobId) {
          console.log(`  Provider Job ID: ${metadata.jobId}`);
          console.log(`  Endpoint: ${metadata.endpoint || 'Unknown'}`);
          
          // Try to check FAL status using metadata
          if (metadata.endpoint && metadata.jobId) {
            return await this.checkFalJobStatus(metadata.jobId, metadata, metadata.endpoint);
          }
        }
      }

      console.log(`❌ No provider job ID found for job ${jobId}`);
      console.log(`  This job may not have been submitted to a provider yet, or uses a different provider`);
      return false;
    } catch (error) {
      console.error(`❌ Error checking provider status for job ${jobId}:`, error);
      return false;
    }
  }

  private async checkFalJobStatus(jobId: string, metadata: any, endpoint?: string): Promise<boolean> {
    try {
      console.log(`🌐 Checking FAL API status for job ${jobId}...`);
      
      // Determine the endpoint to use
      let falEndpoint = endpoint;
      if (!falEndpoint && metadata) {
        falEndpoint = metadata.endpoint || 'fal-ai/flux/dev'; // Default fallback
      }
      
      console.log(`  Using endpoint: ${falEndpoint}`);
      
      // Check job status using FAL API
      const status = await fal.queue.status(falEndpoint!, { requestId: jobId });
      
      console.log(`  FAL Status: ${status.status}`);
      
      const statusStr = (status as any).status;
      
      if (statusStr === 'COMPLETED') {
        console.log(`  ✅ Job completed successfully`);
        console.log(`  📊 Status details:`, JSON.stringify(status, null, 2));
        
        // Try to get the result
        try {
          const result = await fal.queue.result(falEndpoint!, { requestId: jobId });
          console.log(`  📄 Result available: ${result ? 'Yes' : 'No'}`);
          if (result) {
            console.log(`  📄 Result preview:`, JSON.stringify(result, null, 2).slice(0, 500) + '...');
          }
        } catch (resultError) {
          console.log(`  ⚠️  Could not fetch result: ${resultError}`);
        }
        
      } else if (statusStr === 'FAILED' || statusStr === 'ERROR') {
        console.log(`  ❌ Job failed`);
        console.log(`  📊 Error details:`, JSON.stringify(status, null, 2));
        
      } else if (statusStr === 'IN_PROGRESS' || statusStr === 'IN_QUEUE') {
        console.log(`  🔄 Job is still processing`);
        console.log(`  📊 Progress details:`, JSON.stringify(status, null, 2));
        
      } else {
        console.log(`  ❓ Unknown status: ${statusStr}`);
        console.log(`  📊 Full status:`, JSON.stringify(status, null, 2));
      }
      
      return true;
    } catch (error: any) {
      console.error(`  ❌ Error checking FAL status:`, error.message);
      
      // Handle specific error cases
      if (error.message?.includes('not found') || error.message?.includes('404')) {
        console.log(`  📝 Job may have been completed and cleaned up, or the job ID is invalid`);
      } else if (error.message?.includes('timeout') || error.message?.includes('network')) {
        console.log(`  🌐 Network connectivity issue - job may still be processing`);
      }
      
      return false;
    }
  }

  displayJobs(jobs: QueueJob[], title: string): void {
    if (jobs.length === 0) {
      console.log(`✅ No jobs found for: ${title}`);
      return;
    }

    console.log(`📋 ${title} (${jobs.length} jobs):\n`);
    
    jobs.forEach(job => {
      const status = this.getStatusEmoji(job.status) + ' ' + job.status;
      const age = this.getAgeString(job.createdAt);
      const processingTime = job.processingStartedAt 
        ? ` (processing: ${this.getAgeString(job.processingStartedAt)})`
        : '';
      
      console.log(`Job ${job.id}: ${status} | Created: ${age}${processingTime}`);
      console.log(`  User: ${job.userId}`);
      console.log(`  Recipe: ${job.recipeTitle || 'N/A'}`);
      console.log(`  Credits: ${job.creditsCost || 'N/A'}`);
      console.log(`  Retries: ${job.retryCount}/${job.maxRetries}`);
      if (job.failureReason) {
        console.log(`  Failure: ${job.failureReason}`);
      }
      console.log(`  Prompt: ${job.prompt.slice(0, 80)}${job.prompt.length > 80 ? '...' : ''}`);
      console.log('');
    });
  }

  displayStats(stats: { active: number; completed: number; failed: number; total: number }): void {
    console.log('📊 Queue Statistics:\n');
    console.log(`  Active jobs: ${stats.active}`);
    console.log(`  Completed jobs: ${stats.completed}`);
    console.log(`  Failed jobs: ${stats.failed}`);
    console.log(`  Total jobs: ${stats.total}`);
    console.log('');
  }

  private getStatusEmoji(status: string): string {
    switch (status) {
      case 'pending': return '⏳';
      case 'processing': return '🔄';
      case 'completed': return '✅';
      case 'failed': return '❌';
      case 'In Queue': return '📋';
      default: return '❓';
    }
  }

  private getAgeString(date: Date | null): string {
    if (!date) return 'unknown';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else if (diffMins > 0) {
      return `${diffMins}m ago`;
    } else {
      return 'just now';
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'active';
  const limit = parseInt(args[1]) || 50;

  const queueManager = new QueueManager();

  try {
    switch (command) {
      case 'active':
      case 'list':
        const activeJobs = await queueManager.listActiveJobs(limit);
        queueManager.displayJobs(activeJobs, 'Active Jobs');
        break;

      case 'all':
        const allJobs = await queueManager.listAllJobs(limit);
        queueManager.displayJobs(allJobs, 'All Jobs');
        break;

      case 'failed':
        const failedJobs = await queueManager.listFailedJobs(limit);
        queueManager.displayJobs(failedJobs, 'Failed Jobs');
        break;

      case 'stats':
        const stats = await queueManager.getQueueStats();
        queueManager.displayStats(stats);
        break;

      case 'retry':
        const jobId = parseInt(args[1]);
        if (!jobId) {
          console.error('❌ Please provide a job ID: npm run queue-manager retry <jobId>');
          process.exit(1);
        }
        await queueManager.retryFailedJob(jobId);
        break;

      case 'cancel':
        const cancelJobId = parseInt(args[1]);
        if (!cancelJobId) {
          console.error('❌ Please provide a job ID: npm run queue-manager cancel <jobId>');
          process.exit(1);
        }
        await queueManager.cancelJob(cancelJobId);
        break;

      case 'provider-status':
        const providerJobId = parseInt(args[1]);
        if (!providerJobId) {
          console.error('❌ Please provide a job ID: npm run queue-manager provider-status <jobId>');
          process.exit(1);
        }
        await queueManager.checkProviderStatus(providerJobId);
        break;

      case 'help':
        console.log(`
🔧 Queue Manager Tool

Usage: npm run queue-manager <command> [options]

Commands:
  active, list    List active jobs (default)
  all             List all jobs
  failed          List failed jobs
  stats           Show queue statistics
  retry <jobId>   Retry a failed job
  cancel <jobId>  Cancel an active job
  provider-status <jobId>  Check provider API status for a job
  help            Show this help

Options:
  <limit>         Number of jobs to display (default: 50)

Examples:
  npm run queue-manager
  npm run queue-manager active 20
  npm run queue-manager failed
  npm run queue-manager stats
  npm run queue-manager retry 123
  npm run queue-manager cancel 456
  npm run queue-manager provider-status 123
        `);
        break;

      default:
        console.error(`❌ Unknown command: ${command}`);
        console.log('Run "npm run queue-manager help" for usage information');
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await db.$client.end();
  }
}

main(); 