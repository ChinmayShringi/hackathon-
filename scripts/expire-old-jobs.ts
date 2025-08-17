#!/usr/bin/env tsx

import './_setup-env';

/**
 * Job Expiration Script
 * Expires pending jobs that are older than 1 hour and refunds credits
 * Run this script periodically (e.g., every 15 minutes) to clean up old jobs
 */

import { db } from "../server/db";
import { generations } from "../shared/schema";
import { eq, and, lt } from "drizzle-orm";
import { storage } from "../server/storage";

async function expireOldJobs() {
  console.log("🕐 Starting job expiration process...");
  
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
    
    // Find old pending jobs
    const oldPendingJobs = await db
      .select()
      .from(generations)
      .where(
        and(
          eq(generations.status, "pending"),
          lt(generations.createdAt, oneHourAgo)
        )
      );

    console.log(`Found ${oldPendingJobs.length} old pending jobs to expire`);

    let expiredCount = 0;
    let refundedCredits = 0;

    for (const job of oldPendingJobs) {
      try {
        console.log(`Expiring job ${job.id} (created at ${job.createdAt})`);
        
        // Refund credits if not already refunded
        if (job.creditsCost && !job.creditsRefunded) {
          await storage.refundCreditsForGeneration(job.id, job.userId, job.creditsCost);
          refundedCredits += job.creditsCost;
          console.log(`  Refunded ${job.creditsCost} credits`);
        }

        // Mark as failed with expiration reason
        await storage.failGeneration(
          job.id,
          "Your request took too long to process and has been cancelled. Credits have been refunded.",
          { 
            error: "Job expired",
            reason: "Job expired after 1 hour in pending status",
            expiredAt: new Date().toISOString(),
            script: "expire-old-jobs.ts"
          },
          false // Don't refund again since we already did
        );

        expiredCount++;
        console.log(`  Successfully expired job ${job.id}`);
      } catch (error) {
        console.error(`  Error expiring job ${job.id}:`, error);
      }
    }

    console.log(`✅ Job expiration completed:`);
    console.log(`  - Expired jobs: ${expiredCount}/${oldPendingJobs.length}`);
    console.log(`  - Total credits refunded: ${refundedCredits}`);
    
  } catch (error) {
    console.error("❌ Error during job expiration process:", error);
    process.exit(1);
  }
}

// Run the expiration process
expireOldJobs()
  .then(() => {
    console.log("🎉 Job expiration script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Job expiration script failed:", error);
    process.exit(1);
  }); 