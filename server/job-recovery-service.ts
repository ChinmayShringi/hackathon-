import { db } from "./db";
import { generations } from "../shared/schema";
import { eq, and, isNotNull, lt } from "drizzle-orm";
import { falService } from "./fal-service";
import { storage } from "./storage";
import { thumbnailService } from "./thumbnail-service";

/**
 * Job Recovery Service
 * Handles recovery of stuck FAL jobs after app restarts
 * Implements sine wave backoff pattern: 15s → 30s → 60s → 30s → 15s
 * Includes continuous monitoring every 10 minutes for newly stuck jobs
 */
export class JobRecoveryService {
  private recoveryIntervals = new Map<number, NodeJS.Timeout>();
  private continuousMonitoringInterval?: NodeJS.Timeout;
  private dailyCreditRefreshInterval?: NodeJS.Timeout;
  private readonly BACKOFF_PATTERN = [15, 30, 60, 30, 15]; // Updated sine wave pattern in seconds
  private readonly MAX_RETRY_ATTEMPTS = 5;
  private readonly JOB_EXPIRY_HOURS = 1; // Jobs older than 1 hour should be expired
  private readonly CONTINUOUS_MONITORING_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds

  /**
   * Initialize job recovery on startup
   * Finds all stuck processing jobs and begins recovery
   * Starts continuous monitoring for newly stuck jobs
   */
  async initializeRecovery(): Promise<void> {
    console.log("🔄 Initializing job recovery system...");
    
    try {
      // First, expire old pending jobs (older than 1 hour)
      await this.expireOldPendingJobs();
      
      // Find all generations stuck in processing with FAL job IDs
      const stuckGenerations = await db
        .select()
        .from(generations)
        .where(
          and(
            eq(generations.status, "processing"),
            isNotNull(generations.falJobId)
          )
        );

      console.log(`Found ${stuckGenerations.length} stuck generations to recover`);

      // Start recovery for each stuck generation
      for (const generation of stuckGenerations) {
        console.log(`Starting recovery for generation ${generation.id} with FAL job ${generation.falJobId}`);
        this.startJobRecovery(generation.id, generation.falJobId!, 0);
      }

      // Find failed jobs that might be recoverable (network issues, timeouts, disconnects)
      const failedGenerations = await db
        .select()
        .from(generations)
        .where(
          and(
            eq(generations.status, "failed"),
            isNotNull(generations.falJobId),
            eq(generations.recoveryChecked, false)
          )
        );

      console.log(`Found ${failedGenerations.length} failed generations to check for recovery`);

      // Check each failed generation for recovery
      for (const generation of failedGenerations) {
        console.log(`Checking failed generation ${generation.id} with FAL job ${generation.falJobId} for recovery`);
        await this.checkFailedJobForRecovery(generation.id, generation.falJobId!);
      }

      // Start continuous monitoring for newly stuck jobs
      this.startContinuousMonitoring();
    } catch (error) {
      console.error("Error initializing job recovery:", error);
    }
  }

  /**
   * Start continuous monitoring for stuck jobs every 10 minutes
   */
  private startContinuousMonitoring(): void {
    console.log("🔄 Starting continuous job monitoring (every 10 minutes)");
    
    this.continuousMonitoringInterval = setInterval(async () => {
      try {
        await this.scanForStuckJobs();
      } catch (error) {
        console.error("Error in continuous monitoring scan:", error);
      }
    }, this.CONTINUOUS_MONITORING_INTERVAL);
  }

  /**
   * Scan for stuck jobs and start recovery for any found
   */
  private async scanForStuckJobs(): Promise<void> {
    console.log("🔍 Scanning for stuck jobs...");
    
    try {
      // Find all generations stuck in processing with FAL job IDs
      const stuckGenerations = await db
        .select()
        .from(generations)
        .where(
          and(
            eq(generations.status, "processing"),
            isNotNull(generations.falJobId)
          )
        );

      if (stuckGenerations.length === 0) {
        console.log("✅ No stuck jobs found in continuous scan");
      } else {
        console.log(`🔍 Found ${stuckGenerations.length} stuck jobs in continuous scan`);

        // Start recovery for each stuck generation that isn't already being recovered
        for (const generation of stuckGenerations) {
          if (!this.recoveryIntervals.has(generation.id)) {
            console.log(`🔄 Starting recovery for newly detected stuck generation ${generation.id} with FAL job ${generation.falJobId}`);
            this.startJobRecovery(generation.id, generation.falJobId!, 0);
          } else {
            console.log(`⏳ Generation ${generation.id} already being recovered, skipping`);
          }
        }
      }

      // Also scan for failed jobs that might be recoverable
      const failedGenerations = await db
        .select()
        .from(generations)
        .where(
          and(
            eq(generations.status, "failed"),
            isNotNull(generations.falJobId),
            eq(generations.recoveryChecked, false)
          )
        );

      if (failedGenerations.length === 0) {
        console.log("✅ No failed jobs to check for recovery in continuous scan");
      } else {
        console.log(`🔍 Found ${failedGenerations.length} failed jobs to check for recovery in continuous scan`);

        // Check each failed generation for recovery
        for (const generation of failedGenerations) {
          console.log(`Checking failed generation ${generation.id} with FAL job ${generation.falJobId} for recovery`);
          await this.checkFailedJobForRecovery(generation.id, generation.falJobId!);
        }
      }

      // Check for videos that need thumbnail generation
      await this.checkForMissingThumbnails();
    } catch (error) {
      console.error("Error scanning for stuck jobs:", error);
    }
  }

  /**
   * Expire old pending jobs that are older than 1 hour
   */
  private async expireOldPendingJobs(): Promise<void> {
    try {
      const oneHourAgo = new Date(Date.now() - this.JOB_EXPIRY_HOURS * 60 * 60 * 1000);
      
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

      for (const job of oldPendingJobs) {
        console.log(`Expiring old pending job ${job.id} (created at ${job.createdAt})`);
        await this.expireJob(job.id, "Job expired after 1 hour in pending status");
      }
    } catch (error) {
      console.error("Error expiring old pending jobs:", error);
    }
  }

  /**
   * Expire a job and refund credits if necessary
   */
  private async expireJob(generationId: number, reason: string): Promise<void> {
    try {
      const generation = await db
        .select()
        .from(generations)
        .where(eq(generations.id, generationId))
        .limit(1);

      if (!generation.length) {
        console.log(`Generation ${generationId} not found for expiration`);
        return;
      }

      const gen = generation[0];
      
      // Refund credits if not already refunded
      if (gen.creditsCost && !gen.creditsRefunded) {
        await storage.refundCreditsForGeneration(generationId, gen.userId, gen.creditsCost);
        console.log(`Refunded ${gen.creditsCost} credits for expired generation ${generationId}`);
      }

      // Mark as failed with expiration reason
      await storage.failGeneration(
        generationId,
        "Your request took too long to process and has been cancelled. Credits have been refunded.",
        { 
          error: "Job expired",
          reason,
          expiredAt: new Date().toISOString()
        },
        false // Don't refund again since we already did
      );

      console.log(`Successfully expired generation ${generationId}: ${reason}`);
    } catch (error) {
      console.error(`Error expiring generation ${generationId}:`, error);
    }
  }

  /**
   * Start recovery for a specific job
   * Uses sine wave backoff pattern for polling
   */
  private startJobRecovery(generationId: number, falJobId: string, attemptIndex: number): void {
    if (attemptIndex >= this.MAX_RETRY_ATTEMPTS) {
      console.log(`Max retry attempts reached for generation ${generationId}`);
      this.markGenerationFailed(generationId, "Max recovery attempts exceeded");
      return;
    }

    const delaySeconds = this.BACKOFF_PATTERN[attemptIndex % this.BACKOFF_PATTERN.length];
    const delayMs = delaySeconds * 1000;

    console.log(`Scheduling recovery check for generation ${generationId} in ${delaySeconds}s (attempt ${attemptIndex + 1})`);

    const timeoutId = setTimeout(async () => {
      try {
        await this.checkJobStatus(generationId, falJobId, attemptIndex);
      } catch (error) {
        console.error(`Recovery check failed for generation ${generationId}:`, error);
        // Continue with next attempt
        this.startJobRecovery(generationId, falJobId, attemptIndex + 1);
      }
    }, delayMs);

    this.recoveryIntervals.set(generationId, timeoutId);
  }

  /**
   * Check FAL job status and update generation accordingly
   */
  private async checkJobStatus(generationId: number, falJobId: string, attemptIndex: number): Promise<void> {
    console.log(`Checking FAL job status for generation ${generationId}, job ${falJobId}`);

    try {
      // Check if generation was completed by another process
      const currentGeneration = await db
        .select()
        .from(generations)
        .where(eq(generations.id, generationId))
        .limit(1);

      if (!currentGeneration.length || currentGeneration[0].status !== "processing") {
        console.log(`Generation ${generationId} no longer processing, stopping recovery`);
        this.clearRecoveryInterval(generationId);
        return;
      }

      // Poll FAL job status
      const jobStatus = await this.pollFalJobStatus(falJobId);
      
      if (jobStatus.status === "completed") {
        console.log(`✅ FAL job ${falJobId} completed, updating generation ${generationId}`);
        await this.handleJobCompletion(generationId, jobStatus.result);
        this.clearRecoveryInterval(generationId);
      } else if (jobStatus.status === "failed") {
        console.log(`❌ FAL job ${falJobId} failed, marking generation ${generationId} as failed`);
        await this.markGenerationFailed(generationId, jobStatus.error || "FAL job failed");
        this.clearRecoveryInterval(generationId);
      } else {
        console.log(`⏳ FAL job ${falJobId} still processing, continuing recovery`);
        // Continue with next attempt
        this.startJobRecovery(generationId, falJobId, attemptIndex + 1);
      }
    } catch (error) {
      console.error(`Error checking job status for generation ${generationId}:`, error);
      // Continue with next attempt
      this.startJobRecovery(generationId, falJobId, attemptIndex + 1);
    }
  }

  /**
   * Poll FAL API for job status with improved connectivity error handling
   */
  private async pollFalJobStatus(jobId: string): Promise<{ status: string; result?: any; error?: string }> {
    try {
      // Import FAL client directly for status checking
      const fal = await import("@fal-ai/serverless-client");
      
      // Try to get job status from FAL API
      // We'll need to determine the endpoint from the generation metadata
      const generation = await db
        .select({ metadata: generations.metadata })
        .from(generations)
        .where(eq(generations.falJobId, jobId))
        .limit(1);

      if (!generation.length) {
        console.log(`No generation found for FAL job ${jobId}`);
        return { status: "failed", error: "Generation not found" };
      }

      const metadata = generation[0].metadata as any;
      const endpoint = metadata?.endpoint || "fal-ai/flux/dev"; // Default fallback

      console.log(`Checking FAL job ${jobId} on endpoint ${endpoint}`);
      
      // Check job status using FAL API
      const status = await fal.queue.status(endpoint, { requestId: jobId });
      
      // Handle different possible status values
      const statusValue = status.status as string;
      
      if (statusValue === 'COMPLETED') {
        // Get the result
        const result = await fal.queue.result(endpoint, { requestId: jobId });
        return { status: "completed", result };
      } else if (statusValue === 'FAILED' || statusValue === 'ERROR') {
        return { status: "failed", error: JSON.stringify(status) };
      } else if (statusValue === 'IN_PROGRESS' || statusValue === 'IN_QUEUE') {
        return { status: "processing" };
      } else {
        // Handle any other status as still processing
        console.log(`Unknown FAL status for job ${jobId}: ${statusValue}`);
        return { status: "processing" };
      }
    } catch (error: any) {
      // Handle connectivity errors specifically
      if (error.message?.includes("connectivity") || 
          error.message?.includes("network") ||
          error.message?.includes("timeout") ||
          error.message?.includes("ECONNRESET") ||
          error.message?.includes("ENOTFOUND")) {
        console.log(`Connectivity issue detected for job ${jobId}: ${error.message}`);
        return { status: "processing" }; // Continue recovery for connectivity issues
      }
      
      if (error.message?.includes("IN_PROGRESS") || error.message?.includes("IN_QUEUE")) {
        return { status: "processing" };
      }
      
      console.error(`Error polling FAL job ${jobId}:`, error);
      return { status: "failed", error: error.message };
    }
  }

  /**
   * Handle successful job completion
   */
  private async handleJobCompletion(generationId: number, result: any): Promise<void> {
    try {
      // Update generation with completed result
      // This should use the same logic as the queue service
      const { generationQueue } = await import("./queue-service");
      await generationQueue.handleRecoveredJobCompletion(generationId, result);
    } catch (error) {
      console.error(`Error handling job completion for generation ${generationId}:`, error);
      await this.markGenerationFailed(generationId, "Failed to process completion result");
    }
  }

  /**
   * Mark generation as failed
   */
  private async markGenerationFailed(generationId: number, reason: string): Promise<void> {
    try {
      await storage.failGeneration(
        generationId,
        "There was a temporary connection issue. We're retrying your request automatically.",
        { 
          error: "Recovery failed",
          reason,
          failedAt: new Date().toISOString()
        },
        true // Refund credits for failed recovery
      );

      console.log(`Generation ${generationId} marked as failed: ${reason}`);
    } catch (error) {
      console.error(`Error marking generation ${generationId} as failed:`, error);
    }
  }

  /**
   * Clear recovery interval for a generation
   */
  private clearRecoveryInterval(generationId: number): void {
    const timeoutId = this.recoveryIntervals.get(generationId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.recoveryIntervals.delete(generationId);
    }
  }

  /**
   * Register a new FAL job for potential recovery
   */
  async registerFalJob(generationId: number, falJobId: string): Promise<void> {
    try {
      await db
        .update(generations)
        .set({
          falJobId,
          falJobStatus: "processing",
        })
        .where(eq(generations.id, generationId));

      console.log(`Registered FAL job ${falJobId} for generation ${generationId}`);
    } catch (error) {
      console.error(`Error registering FAL job for generation ${generationId}:`, error);
    }
  }

  /**
   * Check a failed job for recovery by polling the service provider
   * Only checks jobs that failed due to network issues, timeouts, or disconnects
   */
  private async checkFailedJobForRecovery(generationId: number, falJobId: string): Promise<void> {
    try {
      console.log(`Checking failed generation ${generationId} with FAL job ${falJobId} for recovery`);

      // Get the generation to check failure reason
      const generation = await db
        .select()
        .from(generations)
        .where(eq(generations.id, generationId))
        .limit(1);

      if (!generation.length) {
        console.log(`Generation ${generationId} not found for recovery check`);
        return;
      }

      const gen = generation[0];

      // Only attempt recovery for specific failure types (network issues, timeouts, disconnects)
      const failureReason = gen.failureReason?.toLowerCase() || '';
      const errorDetails = gen.errorDetails as any;
      const errorMessage = errorDetails?.error?.toLowerCase() || '';

      const isRecoverableFailure = 
        failureReason.includes('timeout') ||
        failureReason.includes('connection') ||
        failureReason.includes('network') ||
        failureReason.includes('disconnect') ||
        failureReason.includes('temporary') ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('connection') ||
        errorMessage.includes('network') ||
        errorMessage.includes('econnreset') ||
        errorMessage.includes('enotfound');

      if (!isRecoverableFailure) {
        console.log(`Generation ${generationId} failed for non-recoverable reason: ${failureReason}. Marking as checked.`);
        await this.markAsRecoveryChecked(generationId);
        return;
      }

      console.log(`Generation ${generationId} failed for recoverable reason: ${failureReason}. Checking provider status...`);

      // Poll FAL job status
      const jobStatus = await this.pollFalJobStatus(falJobId);
      
      if (jobStatus.status === "completed") {
        console.log(`✅ FAL job ${falJobId} completed, recovering generation ${generationId}`);
        await this.handleJobCompletion(generationId, jobStatus.result);
        await this.markAsRecoveryChecked(generationId);
      } else if (jobStatus.status === "failed") {
        console.log(`❌ FAL job ${falJobId} confirmed failed, leaving generation ${generationId} as failed`);
        await this.markAsRecoveryChecked(generationId);
      } else if (jobStatus.status === "processing") {
        console.log(`🔄 FAL job ${falJobId} still processing, resuming generation ${generationId}`);
        // Reset the generation to processing state and start normal recovery
        await db
          .update(generations)
          .set({
            status: "processing",
            failureReason: null,
            errorDetails: null,
            recoveryChecked: false
          })
          .where(eq(generations.id, generationId));

        // Start normal recovery process
        this.startJobRecovery(generationId, falJobId, 0);
      } else {
        console.log(`❓ Unknown FAL status for job ${falJobId}: ${jobStatus.status}. Marking as checked.`);
        await this.markAsRecoveryChecked(generationId);
      }
    } catch (error) {
      console.error(`Error checking failed job ${generationId} for recovery:`, error);
      // Mark as checked to avoid infinite retries
      await this.markAsRecoveryChecked(generationId);
    }
  }

  /**
   * Mark a generation as recovery checked to avoid infinite polling
   */
  private async markAsRecoveryChecked(generationId: number): Promise<void> {
    try {
      await db
        .update(generations)
        .set({
          recoveryChecked: true,
          updatedAt: new Date()
        })
        .where(eq(generations.id, generationId));

      console.log(`Marked generation ${generationId} as recovery checked`);
    } catch (error) {
      console.error(`Error marking generation ${generationId} as recovery checked:`, error);
    }
  }

  /**
   * Check for completed videos that are missing thumbnails and generate them
   */
  private async checkForMissingThumbnails(): Promise<void> {
    try {
      // Find completed video generations that have videoUrl but no thumbnailUrl
      const videosWithoutThumbnails = await db
        .select()
        .from(generations)
        .where(
          and(
            eq(generations.status, "completed"),
            eq(generations.type, "video"),
            isNotNull(generations.videoUrl)
          )
        );

      // Filter for those without thumbnails in JavaScript
      const videosNeedingThumbnails = videosWithoutThumbnails.filter(
        gen => !gen.thumbnailUrl || gen.thumbnailUrl === ""
      );

      if (videosNeedingThumbnails.length === 0) {
        console.log("✅ No videos missing thumbnails found");
        return;
      }

      console.log(`🎬 Found ${videosNeedingThumbnails.length} videos missing thumbnails, generating...`);

      for (const generation of videosNeedingThumbnails) {
        try {
          console.log(`🎬 Generating thumbnail for video generation ${generation.id}`);
          
          // Extract filename from videoUrl and create thumbnail key
          const videoUrl = generation.videoUrl!;
          const filename = videoUrl.split('/').pop()?.split('?')[0] || '';
          const thumbnailKey = `videos/thumbnails/${filename.replace('.mp4', '.gif')}`;
          
          // Generate thumbnail asynchronously
          thumbnailService.generateThumbnail({
            generationId: generation.id,
            videoUrl: videoUrl,
            s3Key: thumbnailKey,
            assetId: generation.assetId || ''
          }).catch(error => {
            console.error(`❌ Failed to generate thumbnail for generation ${generation.id}:`, error);
          });

        } catch (error) {
          console.error(`❌ Error processing thumbnail generation for generation ${generation.id}:`, error);
        }
      }
    } catch (error) {
      console.error("Error checking for missing thumbnails:", error);
    }
  }

  /**
   * Cleanup all recovery intervals
   */
  cleanup(): void {
    this.recoveryIntervals.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    this.recoveryIntervals.clear();

    if (this.continuousMonitoringInterval) {
      clearInterval(this.continuousMonitoringInterval);
      this.continuousMonitoringInterval = undefined;
    }
  }
}

export const jobRecoveryService = new JobRecoveryService();