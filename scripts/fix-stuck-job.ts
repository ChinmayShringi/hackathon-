#!/usr/bin/env tsx

import './_setup-env.ts';
import { db } from '../server/db.ts';
import { generations } from '../shared/schema.ts';
import { eq } from 'drizzle-orm';
import { jobRecoveryService } from '../server/job-recovery-service';

async function fixStuckJob() {
  const jobId = 82; // The stuck job from the logs
  
  console.log(`🔧 Fixing stuck job ${jobId}...`);
  
  try {
    // Get the current job status
    const job = await db.select({
      id: generations.id,
      status: generations.status,
      falJobId: generations.falJobId,
      metadata: generations.metadata,
      createdAt: generations.createdAt
    })
    .from(generations)
    .where(eq(generations.id, jobId))
    .limit(1);

    if (!job.length) {
      console.error(`❌ Job ${jobId} not found`);
      return;
    }

    const generation = job[0];
    console.log(`Current status: ${generation.status}`);
    console.log(`FAL Job ID: ${generation.falJobId}`);
    console.log(`Created: ${generation.createdAt}`);

    if (generation.falJobId) {
      console.log(`🔄 Starting recovery for FAL job ${generation.falJobId}...`);
      
      // Register the job with the recovery service
      await jobRecoveryService.registerFalJob(jobId, generation.falJobId);
      
      // Start recovery process
      jobRecoveryService['startJobRecovery'](jobId, generation.falJobId, 0);
      
      console.log(`✅ Recovery process started for job ${jobId}`);
      console.log(`📝 The job recovery service will now poll the FAL API to check completion status`);
    } else {
      console.error(`❌ No FAL job ID found for generation ${jobId}`);
    }
    
  } catch (error) {
    console.error(`❌ Error fixing stuck job ${jobId}:`, error);
  } finally {
    await db.$client.end();
  }
}

// Run the fix
fixStuckJob().catch(console.error); 