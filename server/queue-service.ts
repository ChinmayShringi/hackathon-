import { storage } from "./storage";
import { Generation, generations } from "@shared/schema";
import { processRecipePrompt } from "./recipe-processor";
import { mediaTransferService } from "./media-transfer-service";
import { imageRouter } from "./image-router";
import { gptImageService } from "./openai-gpt-image-service";
import { ErrorHandler } from "./error-handler";
import { db } from "./db";
import { eq, and, isNotNull } from "drizzle-orm";


interface QueueItem {
  id: number;
  userId: string;
  recipeId: number;
  formData: Record<string, string>;
  priority: number;
  createdAt: Date;
}

class GenerationQueue {
  private queue: QueueItem[] = [];
  private processing = false;
  private currentlyProcessing: QueueItem | null = null;
  private processingJobs = new Set<number>(); // Track jobs being processed to prevent duplicates
  private maxConcurrentJobs = 3; // Allow multiple jobs to process concurrently
  private asyncPollingInterval: NodeJS.Timeout | null = null;


  async addToQueue(generation: Generation, formData: Record<string, string>): Promise<void> {
    // Get recipe to track credit cost
    const recipe = await storage.getRecipeById(generation.recipeId!);
    if (!recipe) {
      await storage.failGeneration(
        generation.id,
        "Recipe not found. Please try again or contact support.",
        { error: "Recipe not found", recipeId: generation.recipeId },
        true
      );
      return;
    }

    // Update generation with credit cost tracking
    await storage.updateGenerationStatus(generation.id, "pending");

    const queueItem: QueueItem = {
      id: generation.id,
      userId: generation.userId,
      recipeId: generation.recipeId!,
      formData,
      priority: 1,
      createdAt: new Date(generation.createdAt!)
    };

    this.queue.push(queueItem);
    this.queue.sort((a, b) => a.priority - b.priority || a.createdAt.getTime() - b.createdAt.getTime());

    console.log(`Added generation ${generation.id} to queue (${recipe.creditCost} credits). Queue length: ${this.queue.length}`);

    // Broadcast queue update to user
    this.broadcastQueueUpdate(generation.userId);

    // Auto-processing enabled - queue will process when jobs are added
    if (!this.processing) {
      this.startProcessing();
    }
  }

  private async startProcessing(): Promise<void> {
    if (this.processing) return;

    this.processing = true;
    console.log("Starting queue processing...");

    // Process multiple jobs concurrently
    const activeJobs = new Map<number, Promise<void>>();

    while (this.queue.length > 0 || activeJobs.size > 0) {
      // Start new jobs if we have capacity
      while (this.queue.length > 0 && activeJobs.size < this.maxConcurrentJobs) {
        const item = this.queue.shift()!;
        
        // Check if job is already being processed (race condition protection)
        if (this.processingJobs.has(item.id)) {
          console.log(`Job ${item.id} is already being processed, skipping`);
          continue;
        }
        
        this.processingJobs.add(item.id);
        this.currentlyProcessing = item;
        
        const jobPromise = this.processJobWithTimeout(item).finally(() => {
          // Remove from active jobs when done
          activeJobs.delete(item.id);
        });
        
        activeJobs.set(item.id, jobPromise);
        
        // Broadcast processing status
        this.broadcastGenerationUpdate(item.userId, item.id, "processing");
      }
      
      // Wait for at least one job to complete
      if (activeJobs.size > 0) {
        try {
          await Promise.race(activeJobs.values());
        } catch (error) {
          console.error("One or more jobs failed:", error);
        }
      }
      
      // Small delay to prevent tight loop
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.processing = false;
    console.log("Queue processing completed");
  }

  private async processJobWithTimeout(item: QueueItem): Promise<void> {
    try {
      // Set timeout for generation processing (8 minutes max)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Generation timeout after 8 minutes')), 8 * 60 * 1000);
      });
      
      // Race between processing and timeout
      await Promise.race([
        this.processGeneration(item),
        timeoutPromise
      ]);
      
      // Broadcast completion
      this.broadcastGenerationUpdate(item.userId, item.id, "completed");
    } catch (error: any) {

      console.error(`Failed to process generation ${item.id}:`, error);
      await this.handleGenerationFailure(item, error);
      
      // Broadcast failure
      this.broadcastGenerationUpdate(item.userId, item.id, "failed");
    } finally {
      // Clean up
      this.processingJobs.delete(item.id);
      if (this.currentlyProcessing?.id === item.id) {
        this.currentlyProcessing = null;
      }
      
      // Broadcast queue update after processing
      this.broadcastQueueUpdate(item.userId);
    }
  }

  private async processGeneration(item: QueueItem): Promise<void> {
    console.log(`Processing generation ${item.id}...`);

    // Check if generation is still pending before processing
    const generation = await storage.getGenerationById(item.id);
    if (!generation) {
      console.log(`Generation ${item.id} not found, skipping...`);
      return;
    }

    if (generation.status !== 'pending') {
      console.log(`Generation ${item.id} is already ${generation.status}, skipping...`);
      return;
    }

    // Update status to processing
    await storage.updateGenerationStatus(item.id, "processing");

    try {
      // Get the recipe
      const recipe = await storage.getRecipeById(item.recipeId);
      if (!recipe) {
        throw new Error(`Recipe ${item.recipeId} not found`);
      }

      let result;

      // Get generation record to check workflow type
      const generation = await storage.getGenerationById(item.id);
      const isImageToVideo = recipe.workflowType === "image_to_video";

      // Check if recipe has workflow components (new component-based system)
      const workflowComponents = recipe.workflowComponents;
      if (workflowComponents && Array.isArray(workflowComponents)) {
        // New component-based workflow processing
        const processedResult = processRecipePrompt(recipe, item.formData);
        const processedPrompt = processedResult.prompt;
        console.log(`Processing workflow components for generation ${item.id}:`, workflowComponents);
        const { workflowProcessor } = await import("./workflow-processor");

        const workflowResult = await workflowProcessor.processWorkflow(workflowComponents, processedPrompt, item.id, recipe);
        
        // For asynchronous processing, register the job and update status
        if (workflowResult.metadata?.jobId) {
          await storage.registerFalJob(item.id, workflowResult.metadata.jobId);
          await storage.updateGenerationFalJobStatus(item.id, 'processing');
          
          // Update generation metadata with workflow information for proper polling
          const currentGeneration = await storage.getGenerationById(item.id);
          if (currentGeneration) {
            const updatedMetadata = {
              ...(currentGeneration.metadata as any || {}),
              ...workflowResult.metadata,
              formData: item.formData
            };
            
            // Update metadata directly in database
            await db
              .update(generations)
              .set({ metadata: updatedMetadata })
              .where(eq(generations.id, item.id));
          }
          
          console.log(`Registered job ${workflowResult.metadata.jobId} for polling with endpoint ${workflowResult.metadata.endpoint}`);
          
          // Job is now in processing state and will be polled by the queue
          return;
        }
        
        // If no job ID (synchronous processing), transfer media and complete
        const transferredResult = await workflowProcessor.transferGeneratedMedia(workflowResult);
        result = this.formatWorkflowResult(transferredResult, item.formData);
      } else if (isImageToVideo) {
        // Legacy enhanced video generation: image-to-video pipeline
        const processedResult = processRecipePrompt(recipe, item.formData);
        const processedPrompt = processedResult.prompt;
        const { falService } = await import("./fal-service");

        console.log(`Starting enhanced video generation for ${item.id}...`);

        const videoResult = await falService.generateEnhancedVideo(
          processedPrompt,
          recipe.style || "cinematic"
        );
        
        // Transfer video to S3
        let cdnUrl = videoResult.video?.url;
        let s3Key = videoResult.video?.url?.split('/').pop() || 'video_unknown';
        let assetId = videoResult.video?.url?.split('/').pop()?.split('.')[0] || 'video_unknown';
        let transferSuccess = false;
        
        if (videoResult.video?.url) {
          const transferResult = await mediaTransferService.transferMedia({
            remoteUrl: videoResult.video.url,
            mediaType: 'video'
          });
          
          if (transferResult.success) {
            cdnUrl = transferResult.cdnUrl;
            s3Key = transferResult.s3Key || s3Key;
            assetId = transferResult.assetId || assetId;
            transferSuccess = true;
          }
        }

        result = {
          videoUrl: cdnUrl || null,
          imageUrl: videoResult.baseImage?.url || null,
          s3Key: s3Key,
          assetId: assetId,
          metadata: {
            model: recipe.model,
            provider: "fal-minimax-hailuo-02-pro",
            prompt: processedPrompt,
            videoPrompt: videoResult.videoPrompt,
            originalPrompt: videoResult.originalPrompt,
            style: videoResult.style,
            baseImage: videoResult.baseImage,
            generationType: "enhanced_video",
            formData: item.formData,
            transferredToS3: transferSuccess
          }
        };
      } else if (recipe.model === "gpt-image-1") {
        // Use GPT Image service for gpt-image-1 model
        const processedResult = processRecipePrompt(recipe, item.formData);
        const processedPrompt = processedResult.prompt;
        const gptResult = await gptImageService.generateImage({
          prompt: processedPrompt,
          quality: "high",
          size: "1024x1024",
          format: "png"
        });
        
        // Add formData to the metadata
        result = {
          ...gptResult,
          metadata: {
            ...gptResult.metadata,
            formData: item.formData
          }
        };

      } else {
        // Use image router for other models (FAL, etc.)
        const processedResult = processRecipePrompt(recipe, item.formData);
        const processedPrompt = processedResult.prompt;
        const imageResult = await imageRouter.generateImage({
          prompt: processedPrompt,
          model: recipe.model,
          style: recipe.style,
          quality: "hd",
          imageSize: "square_hd",
          numImages: 1
        });

        if (imageResult.status === "failed") {
          throw new Error(imageResult.error || "Image generation failed");
        }

        // Convert imageRouter result to expected format
        const firstImage = imageResult.images[0];
        if (!firstImage || !firstImage.url) {
          throw new Error("No image generated");
        }
        
        // Transfer image to S3
        let cdnUrl = firstImage.url;
        let s3Key = firstImage.url.split('/').pop() || 'unknown';
        let assetId = firstImage.url.split('/').pop()?.split('.')[0] || 'unknown';
        let transferSuccess = false;
        
        const transferResult = await mediaTransferService.transferMedia({
          remoteUrl: firstImage.url,
          mediaType: 'image'
        });
        
        if (transferResult.success) {
          cdnUrl = transferResult.cdnUrl!;
          s3Key = transferResult.s3Key || s3Key;
          assetId = transferResult.assetId || assetId;
          transferSuccess = true;
        }

        result = {
          imageUrl: cdnUrl,
          s3Key: s3Key,
          assetId: assetId,
            metadata: {
              model: recipe.model,
              provider: imageResult.provider,
              prompt: processedPrompt,
              ...imageResult.metadata,
              formData: item.formData,
              transferredToS3: transferSuccess
            }
        };
      }

      // Store FAL job ID for recovery if available
      if (result.falJobId) {
        await storage.registerFalJob(item.id, result.falJobId);
        await storage.updateGenerationFalJobStatus(item.id, 'processing');
        console.log(`Stored FAL job ID: ${result.falJobId} for generation ${item.id}`);
      }

      // Update generation with results using secure asset method if available
      if (result.shortId && result.secureUrl) {
        await storage.updateGenerationWithSecureAsset(
          item.id,
          "completed",
          result.secureUrl,
          result.s3Key,
          result.assetId,
          result.shortId,
          result.metadata
        );
      } else {
        // Handle video vs image results
        const resultUrl = result.videoUrl || result.imageUrl;
        if (!resultUrl) {
          throw new Error("No video or image URL generated");
        }

        // Update with video or image result
        await storage.updateGenerationWithAsset(
          item.id,
          "completed",
          resultUrl,
          result.s3Key,
          result.assetId,
          result.metadata,
          result.videoUrl || null // Pass videoUrl if present, else null
        );

        // Generate thumbnail for videos asynchronously
        if (result.videoUrl) {
          console.log(`🎬 Starting async thumbnail generation for video generation ${item.id}`);
          const { thumbnailService } = await import('./thumbnail-service');
          
          thumbnailService.generateThumbnailAsync({
            generationId: item.id,
            videoUrl: result.videoUrl,
            s3Key: result.s3Key,
            assetId: result.assetId
          });
        }
      }

      console.log(`Generation ${item.id} completed successfully using ${recipe.model}`);

    } catch (error) {
      console.error(`Generation ${item.id} failed:`, error);
      await this.handleGenerationFailure(item, error);
      throw error;
    }
  }

  private async handleGenerationFailure(item: QueueItem, error: any): Promise<void> {
    const context = {
      generationId: item.id,
      userId: item.userId,
      recipeId: item.recipeId
    };

    // Analyze the error to determine appropriate response
    const userMessage = ErrorHandler.getUserFriendlyMessage(error, context);
    const shouldRefund = ErrorHandler.shouldRefundCredits(error, context);
    const shouldRetry = ErrorHandler.shouldRetry(error, context);
    const technicalDetails = ErrorHandler.formatTechnicalDetails(error);

    console.log(`Generation ${item.id} failure analysis:`, {
      userMessage,
      shouldRefund,
      shouldRetry,
      errorType: technicalDetails.type || 'unknown'
    });

    // Fail the generation with proper error handling
    await storage.failGeneration(item.id, userMessage, technicalDetails, shouldRefund);

    // Don't auto-retry to avoid queue conflicts with WebSocket updates
    // Manual retry can be implemented later if needed
  }

  getQueueStats() {
    return {
      totalInQueue: this.queue.length,
      currentlyProcessing: this.currentlyProcessing ? 1 : 0,
      averageWaitTime: this.queue.length * 30, // Estimate 30 seconds per generation
      completedToday: 0, // This would require database query
      systemLoad: this.processing ? "processing" : "idle"
    };
  }

  getCurrentPosition(generationId: number): number {
    const index = this.queue.findIndex(item => item.id === generationId);
    return index >= 0 ? index + 1 : 0;
  }

  async initializeFromDatabase(): Promise<void> {
    try {
      console.log("Initializing queue from database...");

      // First, expire old pending jobs (older than 1 hour)
      await this.expireOldPendingJobs();

      // Load pending generations into queue
      const pendingGenerations = await storage.getPendingGenerations();
      console.log(`Found ${pendingGenerations.length} pending generations in database`);

      for (const generation of pendingGenerations) {
        console.log(`Loading generation ${generation.id} (status: ${generation.status}) into queue`);

        if (generation.metadata) {
          const metadata = typeof generation.metadata === 'string'
            ? JSON.parse(generation.metadata)
            : generation.metadata;
          const formData = metadata?.formData || {};

          const queueItem: QueueItem = {
            id: generation.id,
            userId: generation.userId,
            recipeId: generation.recipeId!,
            formData: formData,
            priority: 1,
            createdAt: new Date(generation.createdAt!)
          };

          this.queue.push(queueItem);
          console.log(`Added generation ${generation.id} to queue`);
        } else {
          console.log(`Skipping generation ${generation.id} - no metadata`);
        }
      }

      this.queue.sort((a, b) => a.priority - b.priority || a.createdAt.getTime() - b.createdAt.getTime());
      console.log(`Queue initialized with ${this.queue.length} items`);

      // Start async job polling for processing jobs
      this.startAsyncJobPolling();

      // Start processing if we have items
      if (this.queue.length > 0 && !this.processing) {
        console.log("Queue has items, starting processing");
        this.startProcessing();
      } else {
        console.log("No items in queue or already processing");
      }
    } catch (error) {
      console.error("Error initializing queue from database:", error);
    }
  }

  /**
   * Expire old pending jobs that are older than 1 hour
   */
  private async expireOldPendingJobs(): Promise<void> {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago

      const oldPendingJobs = await storage.getOldPendingGenerations(oneHourAgo);

      console.log(`Found ${oldPendingJobs.length} old pending jobs to expire`);

      for (const job of oldPendingJobs) {
        console.log(`Expiring old pending job ${job.id} (created at ${job.createdAt})`);
        await storage.failGeneration(
          job.id,
          "Your request took too long to process and has been cancelled. Credits have been refunded.",
          {
            error: "Job expired",
            reason: "Job expired after 1 hour in pending status",
            expiredAt: new Date().toISOString()
          },
          true // Refund credits
        );
      }
    } catch (error) {
      console.error("Error expiring old pending jobs:", error);
    }
  }

  private broadcastQueueUpdate(userId: string): void {
    if (typeof (global as any).broadcastToUser === 'function') {
      (global as any).broadcastToUser(userId, {
        type: 'queue_update',
        data: {
          queueLength: this.queue.length,
          processing: this.processing,
          currentlyProcessing: this.currentlyProcessing?.id || null
        }
      });
    }
  }

  private async processWorkflowComponents(recipe: any, processedPrompt: string, components: any[]): Promise<any> {
    console.log("Processing workflow components:", components);
    const { falService } = await import("./fal-service");

    let imageResult: any = null;
    let videoResult: any = null;

    // Process each component in sequence
    for (const component of components) {
      if (component.type === 'image') {
        console.log(`Generating image with ${component.model} model...`);
        imageResult = await falService.generateImage(
          processedPrompt,
          component.model,
          recipe.style || "cinematic"
        );
      } else if (component.type === 'video' && imageResult) {
        console.log(`Generating video with ${component.model} using endpoint ${component.endpoint}...`);

        // Create enhanced video prompt
        const videoPrompt = `${processedPrompt}, ${recipe.style || "cinematic"} movement, dreamlike motion, otherworldly transitions, smooth motion, natural movement, high quality video animation`;

        // Use the specified endpoint from component configuration
        if (component.endpoint) {
          console.log(`Using specified endpoint: ${component.endpoint}`);
          videoResult = await falService.generateImageToVideo(
            imageResult.images[0].url,
            videoPrompt
          );
        } else {
          throw new Error(`No endpoint specified for video component: ${component.model}`);
        }

        // Structure the final result
        return {
          videoUrl: videoResult.video?.url || null,
          imageUrl: imageResult.images[0].url,
          s3Key: videoResult.video?.url?.split('/').pop() || 'video_unknown',
          assetId: videoResult.video?.url?.split('/').pop()?.split('.')[0] || 'video_unknown',
          metadata: {
            model: recipe.model,
            provider: `fal-${component.model}`,
            prompt: processedPrompt,
            videoPrompt: videoPrompt,
            originalPrompt: processedPrompt,
            style: recipe.style,
            baseImage: imageResult.images[0],
            generationType: "component_workflow",
            workflowComponents: components,
            formData: this.currentlyProcessing?.formData || {}
          }
        };
      }
    }

    // If only image component, return image result
    if (imageResult && !videoResult) {
      return {
        imageUrl: imageResult.images[0].url,
        s3Key: imageResult.images[0].url.split('/').pop() || 'image_unknown',
        assetId: imageResult.images[0].url.split('/').pop()?.split('.')[0] || 'image_unknown',
        metadata: {
          model: recipe.model,
          provider: "fal-flux",
          prompt: processedPrompt,
          generationType: "component_workflow",
          workflowComponents: components,
          formData: this.currentlyProcessing?.formData || {}
        }
      };
    }

    throw new Error("No valid workflow components processed");
  }

  private formatWorkflowResult(workflowResult: any, formData: Record<string, string> = {}): any {
    console.log("Formatting workflow result:", workflowResult);

    if (!workflowResult || !workflowResult.data) {
      throw new Error("Invalid workflow result");
    }

    const { type, data, metadata } = workflowResult;

    if (type === "video") {
      // Handle video results (including text-to-video)
      const videoUrl = data.video?.url || data.url || data.cdnUrl;
      if (!videoUrl) {
        throw new Error("No video URL found in workflow result");
      }

      return {
        videoUrl: videoUrl,
        s3Key: data.s3Key || metadata?.s3Key || videoUrl.split('/').pop() || 'video_unknown',
        assetId: data.assetId || metadata?.assetId || videoUrl.split('/').pop()?.split('.')[0] || 'video_unknown',
        falJobId: metadata?.jobId,
        metadata: {
          model: metadata?.model || "unknown",
          provider: metadata?.endpoint || "fal",
          prompt: metadata?.prompt || "",
          generationType: "text_to_video",
          serviceId: metadata?.serviceId,
          aspectRatio: metadata?.aspectRatio,
          duration: metadata?.duration,
          quality: metadata?.quality,
          workflowComponents: metadata?.workflowComponents,
          formData: formData,
          transferredToS3: metadata?.transferredToS3 || false,
          cdnUrl: metadata?.cdnUrl,
          originalUrl: data.video?.originalUrl || data.originalUrl
        }
      };
    } else if (type === "image") {
      // Handle image results
      const imageUrl = data.images?.[0]?.url || data.url || data.cdnUrl;
      if (!imageUrl) {
        throw new Error("No image URL found in workflow result");
      }

      return {
        imageUrl: imageUrl,
        s3Key: data.s3Key || metadata?.s3Key || imageUrl.split('/').pop() || 'image_unknown',
        assetId: data.assetId || metadata?.assetId || imageUrl.split('/').pop()?.split('.')[0] || 'image_unknown',
        falJobId: metadata?.jobId,
        metadata: {
          model: metadata?.model || "unknown",
          provider: metadata?.endpoint || "fal",
          prompt: metadata?.prompt || "",
          generationType: "image",
          workflowComponents: metadata?.workflowComponents,
          formData: formData,
          transferredToS3: metadata?.transferredToS3 || false,
          cdnUrl: metadata?.cdnUrl,
          originalUrl: data.images?.[0]?.originalUrl || data.originalUrl
        }
      };
    }

    throw new Error(`Unsupported workflow result type: ${type}`);
  }

  private broadcastGenerationUpdate(userId: string, generationId: number, status: string, data?: any): void {
    // Broadcast to WebSocket clients
    const message = {
      type: 'generation_update',
      userId,
      generationId,
      status,
      data
    };

    // This would be implemented with your WebSocket system
    console.log('Broadcasting generation update:', message);
  }

  /**
   * Start the sinusoidal polling for processing jobs
   * Schedule: 15s, 30s, 60s, 30s, 15s, repeat
   */
  private startAsyncJobPolling(): void {
    if (this.asyncPollingInterval) {
      clearInterval(this.asyncPollingInterval);
    }

    let checkCount = 0;
    const intervals = [15000, 30000, 60000, 30000, 15000]; // 15s, 30s, 60s, 30s, 15s

    this.asyncPollingInterval = setInterval(async () => {
      const interval = intervals[checkCount % intervals.length];
      console.log(`Processing job polling cycle ${checkCount + 1}, interval: ${interval}ms`);

      // Poll all processing jobs with FAL job IDs
      await this.pollProcessingJobs();

      checkCount++;
    }, 15000); // Start with 15s interval

    console.log("Started processing job polling with sinusoidal schedule");
  }

  /**
   * Poll all processing jobs for status updates
   */
  private async pollProcessingJobs(): Promise<void> {
    try {
      // Get all processing generations with FAL job IDs from database
      const processingGenerations = await db
        .select()
        .from(generations)
        .where(
          and(
            eq(generations.status, "processing"),
            isNotNull(generations.falJobId)
          )
        );

      if (processingGenerations.length === 0) {
        return; // No processing jobs to poll
      }

      console.log(`Polling ${processingGenerations.length} processing jobs...`);

      for (const generation of processingGenerations) {
        try {
          console.log(`Polling FAL job ${generation.falJobId} for generation ${generation.id}`);
          
          // Get job status from FAL using the same approach as job recovery service
          const jobStatus = await this.pollFalJobStatus(generation.falJobId!);
          
          if (jobStatus.status === 'completed') {
            console.log(`FAL job ${generation.falJobId} completed, processing result...`);
            await this.handleJobCompletion(generation.id, jobStatus.result);
          } else if (jobStatus.status === 'failed') {
            console.log(`FAL job ${generation.falJobId} failed`);
            await this.handleJobFailure(generation.id, generation.falJobId!);
          } else {
            console.log(`FAL job ${generation.falJobId} still processing`);
          }
        } catch (error) {
          console.error(`Error polling FAL job ${generation.falJobId}:`, error);
        }
      }
    } catch (error: any) {
      // Handle database connection errors specifically
      if (error.message?.includes("Connection terminated") || 
          error.message?.includes("connection timeout") ||
          error.message?.includes("EADDRNOTAVAIL") ||
          error.message?.includes("ECONNRESET") ||
          'code' in error && (error.code === 'EADDRNOTAVAIL' || error.code === 'ECONNRESET')) {
        console.log(`Database connectivity issue detected during job polling: ${error.message}`);
        // Don't throw, let the polling continue on next cycle
        return;
      }
      
      console.error("Error polling processing jobs:", error);
    }
  }

  /**
   * Poll FAL API for job status (same as job recovery service)
   */
  private async pollFalJobStatus(jobId: string): Promise<{ status: string; result?: any; error?: string }> {
    try {
      // Import FAL client directly for status checking
      const fal = await import("@fal-ai/serverless-client");
      
      // Get generation metadata to determine endpoint
      let generation;
      try {
        generation = await db
          .select({ metadata: generations.metadata })
          .from(generations)
          .where(eq(generations.falJobId, jobId))
          .limit(1);
      } catch (dbError: any) {
        // Handle database connection errors
        if (dbError.message?.includes("Connection terminated") || 
            dbError.message?.includes("connection timeout") ||
            dbError.message?.includes("EADDRNOTAVAIL") ||
            dbError.message?.includes("ECONNRESET") ||
            'code' in dbError && (dbError.code === 'EADDRNOTAVAIL' || dbError.code === 'ECONNRESET')) {
          console.log(`Database connectivity issue for job ${jobId}: ${dbError.message}`);
          return { status: "processing" }; // Continue polling
        }
        throw dbError;
      }

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
        return { status: "processing" }; // Continue polling for connectivity issues
      }
      
      if (error.message?.includes("IN_PROGRESS") || error.message?.includes("IN_QUEUE")) {
        return { status: "processing" };
      }
      
      console.error(`Error polling FAL job ${jobId}:`, error);
      return { status: "failed", error: error.message };
    }
  }

  /**
   * Handle completion of FAL job
   */
  private async handleJobCompletion(generationId: number, result: any): Promise<void> {
    try {
      // Process the result similar to recovered job completion
      await this.handleRecoveredJobCompletion(generationId, result);
      
      console.log(`Successfully completed FAL job for generation ${generationId}`);
    } catch (error) {
      console.error(`Error handling job completion for generation ${generationId}:`, error);
      await this.handleJobFailure(generationId, "");
    }
  }

  /**
   * Handle failure of FAL job
   */
  private async handleJobFailure(generationId: number, jobId: string): Promise<void> {
    try {
      await storage.failGeneration(
        generationId,
        "Your generation failed to complete. Credits have been refunded.",
        {
          error: "FAL job failed",
          jobId: jobId,
          failedAt: new Date().toISOString()
        },
        true // Refund credits
      );

      // Broadcast failure to user
      const generation = await storage.getGenerationById(generationId);
      if (generation) {
        this.broadcastGenerationUpdate(generation.userId, generationId, "failed");
      }
    } catch (error) {
      console.error(`Error handling job failure for generation ${generationId}:`, error);
    }
  }

  // Handle job completion from recovery service
  async handleRecoveredJobCompletion(generationId: number, result: any): Promise<void> {
    try {
      console.log(`Handling recovered job completion for generation ${generationId}`);
      console.log(`Raw FAL result:`, JSON.stringify(result, null, 2));
      
      // Get the generation metadata to understand the workflow type
      const generation = await storage.getGenerationById(generationId);
      if (!generation) {
        throw new Error(`Generation ${generationId} not found`);
      }
      
      const metadata = generation.metadata as any;
      const endpoint = metadata?.endpoint || "fal-ai/flux/dev";
      
      // Determine the result type based on the FAL result structure
      let workflowResult;
      if (result.video?.url) {
        // Video result
        workflowResult = {
          type: "video",
          data: {
            video: {
              url: result.video.url,
              content_type: result.video.content_type,
              file_name: result.video.file_name,
              file_size: result.video.file_size
            }
          },
          metadata: {
            model: metadata?.model || "unknown",
            endpoint: endpoint,
            jobId: generation.falJobId,
            prompt: metadata?.prompt || "",
            serviceId: metadata?.serviceId,
            finalJobId: generation.falJobId
          }
        };
      } else if (result.images?.[0]?.url) {
        // Image result
        workflowResult = {
          type: "image",
          data: {
            images: result.images
          },
          metadata: {
            model: metadata?.model || "unknown",
            endpoint: endpoint,
            jobId: generation.falJobId,
            prompt: metadata?.prompt || "",
            serviceId: metadata?.serviceId,
            finalJobId: generation.falJobId
          }
        };
      } else {
        throw new Error(`Unsupported FAL result structure: ${JSON.stringify(result)}`);
      }
      
      // Format the result similar to normal processing
      // Get formData from the original generation metadata
      const formData = metadata?.formData || {};
      const formattedResult = this.formatWorkflowResult(workflowResult, formData);
      
      // Transfer media to S3 if not already transferred
      if (!formattedResult.metadata.transferredToS3) {
        console.log(`Transferring media to S3 for recovered job ${generationId}...`);
        
        const mediaType = workflowResult.type === "video" ? "video" : "image";
        const remoteUrl = workflowResult.type === "video" 
          ? result.video.url 
          : result.images[0].url;
        
        const transferResult = await mediaTransferService.transferMedia({
          remoteUrl: remoteUrl,
          mediaType: mediaType
        });
        
        if (transferResult.success) {
          formattedResult.metadata.transferredToS3 = true;
          formattedResult.metadata.cdnUrl = transferResult.cdnUrl;
          formattedResult.metadata.s3Key = transferResult.s3Key;
          formattedResult.metadata.assetId = transferResult.assetId;
          
          // Update the result URL to use CDN
          if (workflowResult.type === "video") {
            formattedResult.videoUrl = transferResult.cdnUrl;
          } else {
            formattedResult.imageUrl = transferResult.cdnUrl;
          }
          
          console.log(`Media transfer successful: ${transferResult.cdnUrl}`);
        } else {
          console.error(`Media transfer failed:`, transferResult.error);
        }
      }
      
      // Update generation with results
      if (formattedResult.shortId && formattedResult.secureUrl) {
        await storage.updateGenerationWithSecureAsset(
          generationId,
          "completed",
          formattedResult.secureUrl,
          formattedResult.s3Key,
          formattedResult.assetId,
          formattedResult.shortId,
          formattedResult.metadata
        );
      } else {
        const resultUrl = formattedResult.videoUrl || formattedResult.imageUrl;
        if (!resultUrl) {
          throw new Error("No video or image URL in recovered result");
        }

        await storage.updateGenerationWithAsset(
          generationId,
          "completed",
          resultUrl,
          formattedResult.s3Key,
          formattedResult.assetId,
          formattedResult.metadata
        );
      }

      // --- PATCH: Generate thumbnail/GIF for recovered video jobs ---
      if (formattedResult.videoUrl) {
        console.log(`🎬 Starting async thumbnail generation for recovered video generation ${generationId}`);
        const { thumbnailService } = await import('./thumbnail-service');
        thumbnailService.generateThumbnailAsync({
          generationId: generationId,
          videoUrl: formattedResult.videoUrl,
          s3Key: formattedResult.s3Key,
          assetId: formattedResult.assetId
        });
      }
      // --- END PATCH ---

      console.log(`Successfully completed recovered generation ${generationId}`);
    } catch (error) {
      console.error(`Error handling recovered job completion for generation ${generationId}:`, error);
      throw error;
    }
  }
}

export const generationQueue = new GenerationQueue();

// Initialize queue on startup
generationQueue.initializeFromDatabase();