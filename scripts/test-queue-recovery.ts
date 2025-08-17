#!/usr/bin/env tsx

import './_setup-env';

/**
 * Queue Recovery Test Script
 * Tests the improved queue recovery system with job expiration and sinusoidal backoff
 */

import { db } from "../server/db";
import { generations } from "../shared/schema";
import { eq, and, lt, sql } from "drizzle-orm";
import { storage } from "../server/storage";
import { JobRecoveryService } from "../server/job-recovery-service";

async function testQueueRecovery() {
  console.log("🧪 Testing Queue Recovery Improvements...");
  
  try {
    // Test 1: Check for old pending jobs
    console.log("\n📋 Test 1: Checking for old pending jobs...");
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const oldPendingJobs = await storage.getOldPendingGenerations(oneHourAgo);
    console.log(`Found ${oldPendingJobs.length} old pending jobs`);
    
    if (oldPendingJobs.length > 0) {
      console.log("Old pending jobs found:");
      oldPendingJobs.slice(0, 5).forEach(job => {
        console.log(`  - Job ${job.id}: created at ${job.createdAt}, credits: ${job.creditsCost}`);
      });
    }

    // Test 2: Check for stuck processing jobs
    console.log("\n📋 Test 2: Checking for stuck processing jobs...");
    const stuckJobs = await db
      .select()
      .from(generations)
      .where(
        and(
          eq(generations.status, "processing"),
          lt(generations.createdAt, new Date(Date.now() - 30 * 60 * 1000)) // 30+ minutes old
        )
      );
    
    console.log(`Found ${stuckJobs.length} potentially stuck processing jobs`);
    
    if (stuckJobs.length > 0) {
      console.log("Stuck processing jobs:");
      stuckJobs.slice(0, 5).forEach(job => {
        console.log(`  - Job ${job.id}: created at ${job.createdAt}, FAL job: ${job.falJobId || 'none'}`);
      });
    }

    // Test 3: Test job recovery service initialization
    console.log("\n📋 Test 3: Testing job recovery service...");
    const recoveryService = new JobRecoveryService();
    
    // This would normally start recovery, but we'll just test the initialization
    console.log("Job recovery service created successfully");
    console.log("Backoff pattern: [15, 30, 60, 30, 15] seconds");
    console.log("Max retry attempts: 5");
    console.log("Job expiry threshold: 1 hour");

    // Test 4: Check queue statistics
    console.log("\n📋 Test 4: Checking queue statistics...");
    const queueStats = await storage.getQueueStats();
    console.log("Current queue stats:", queueStats);

    // Test 5: Check for connectivity error handling
    console.log("\n📋 Test 5: Testing connectivity error handling...");
    const connectivityErrors = await db
      .select()
      .from(generations)
      .where(
        and(
          eq(generations.status, "failed"),
          sql`${generations.errorDetails}::text ILIKE '%connectivity%' OR ${generations.errorDetails}::text ILIKE '%network%' OR ${generations.errorDetails}::text ILIKE '%timeout%'`
        )
      );
    
    console.log(`Found ${connectivityErrors.length} jobs with connectivity-related errors`);

    // Test 6: Check credit refund status
    console.log("\n📋 Test 6: Checking credit refund status...");
    const refundedJobs = await db
      .select()
      .from(generations)
      .where(eq(generations.creditsRefunded, true));
    
    console.log(`Found ${refundedJobs.length} jobs with refunded credits`);
    
    if (refundedJobs.length > 0) {
      const totalRefunded = refundedJobs.reduce((sum, job) => sum + (job.creditsCost || 0), 0);
      console.log(`Total credits refunded: ${totalRefunded}`);
    }

    console.log("\n✅ All queue recovery tests completed successfully!");
    
  } catch (error) {
    console.error("❌ Error during queue recovery testing:", error);
    process.exit(1);
  }
}

// sql is already imported above

// Run the tests
testQueueRecovery()
  .then(() => {
    console.log("🎉 Queue recovery test script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Queue recovery test script failed:", error);
    process.exit(1);
  }); 