#!/usr/bin/env tsx

import './_setup-env.ts';
import { db } from '../server/db.ts';
import { generations } from '../shared/schema.ts';
import { eq } from 'drizzle-orm';
import { jobRecoveryService } from '../server/job-recovery-service';

async function triggerRecovery() {
  const jobId = 82;
  
  console.log(`🔧 Triggering recovery for job ${jobId}...`);
  
  try {
    // First, update the job status to "processing" so recovery service picks it up
    await db.update(generations)
      .set({
        status: 'processing',
        updatedAt: new Date()
      })
      .where(eq(generations.id, jobId));
    
    console.log(`✅ Updated job ${jobId} status to 'processing'`);
    
    // Get the job details
    const job = await db.select({
      id: generations.id,
      status: generations.status,
      falJobId: generations.falJobId,
      metadata: generations.metadata
    })
    .from(generations)
    .where(eq(generations.id, jobId))
    .limit(1);

    if (!job.length) {
      console.error(`❌ Job ${jobId} not found`);
      return;
    }

    const generation = job[0];
    console.log(`Job ${jobId} status: ${generation.status}`);
    console.log(`FAL Job ID: ${generation.falJobId}`);

    if (generation.falJobId) {
      // Manually trigger the recovery process
      console.log(`🔄 Manually triggering recovery for FAL job ${generation.falJobId}...`);
      
      // Register the job with the recovery service
      await jobRecoveryService.registerFalJob(jobId, generation.falJobId);
      
      // Start recovery process
      jobRecoveryService['startJobRecovery'](jobId, generation.falJobId, 0);
      
      console.log(`✅ Recovery process triggered for job ${jobId}`);
      console.log(`📝 The job recovery service will now poll the FAL API to check completion status`);
    } else {
      console.error(`❌ No FAL job ID found for generation ${jobId}`);
    }
    
  } catch (error) {
    console.error(`❌ Error triggering recovery:`, error);
  } finally {
    await db.$client.end();
  }
}

// Run the recovery trigger
triggerRecovery().catch(console.error); 