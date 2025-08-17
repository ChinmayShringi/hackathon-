import { createHash } from 'crypto';
import { storage } from './storage';
import { type Recipe, type SmartGenerationRequest, type BacklogVideo, type InsertSmartGenerationRequest, type InsertBacklogVideo } from '@shared/schema';
import { processRecipePrompt } from './recipe-processor';

export interface SmartGenerationOptions {
  userId: string;
  recipeId: number;
  recipeVariables: Record<string, any>;
  creditsCost?: number;
  sessionToken?: string;
}

export interface SmartGenerationResult {
  success: boolean;
  requestId: number;
  generationId?: number;
  backlogVideoId?: number;
  videoUrl?: string;
  thumbnailUrl?: string;
  isFromBacklog: boolean;
  message: string;
}

export interface BacklogAvailabilityResult {
  hasBacklogEntry: boolean;
  backlogVideoId?: number;
  isUsed: boolean;
}

export class SmartGenerator {

  /**
   * Generate a hash for recipe variables to enable fast lookup
   */
  private generateVariablesHash(recipeVariables: Record<string, any>): string {
    // Sort keys to ensure consistent hashing
    const sortedVariables = Object.keys(recipeVariables)
      .sort()
      .reduce((obj, key) => {
        obj[key] = recipeVariables[key];
        return obj;
      }, {} as Record<string, any>);

    const jsonString = JSON.stringify(sortedVariables);
    return createHash('sha256').update(jsonString).digest('hex');
  }

  /**
   * Check if a specific recipe + variables combination has a backlog entry
   */
  async checkBacklogAvailability(recipeId: number, recipeVariables: Record<string, any>): Promise<BacklogAvailabilityResult> {
    const variablesHash = this.generateVariablesHash(recipeVariables);

    const backlogEntry = await storage.getBacklogVideoByRecipeAndHash(recipeId, variablesHash);

    if (!backlogEntry) {
      return {
        hasBacklogEntry: false,
        isUsed: false
      };
    }

    return {
      hasBacklogEntry: true,
      backlogVideoId: backlogEntry.id,
      isUsed: backlogEntry.isUsed
    };
  }

  /**
   * Get a random unused backlog video for a specific recipe (Flash generation)
   * This ensures the flash video is relevant to the recipe being used
   */
  async getRandomBacklogVideo(recipeId: number): Promise<BacklogVideo | null> {
    return await storage.getRandomUnusedBacklogVideo(recipeId);
  }

  /**
   * Main smart generation method - tries backlog first, falls back to normal generation
   */
  async generateSmart(options: SmartGenerationOptions): Promise<SmartGenerationResult> {
    const { userId, recipeId, recipeVariables, creditsCost } = options;

    // Get recipe to validate it exists
    const recipe = await storage.getRecipeById(recipeId);
    if (!recipe) {
      return {
        success: false,
        requestId: 0,
        isFromBacklog: false,
        message: "Recipe not found"
      };
    }

    // Generate hash for fast lookup
    const variablesHash = this.generateVariablesHash(recipeVariables);

    // Create smart generation request
    const smartRequest = await storage.createSmartGenerationRequest({
      creatorId: userId,
      recipeId,
      recipeVariables,
      recipeVariablesHash: variablesHash,
      status: "pending",
      creditsCost: creditsCost || recipe.creditCost
    });

    try {
      // Check if we have a matching backlog entry
      const backlogEntry = await storage.getBacklogVideoByRecipeAndHash(recipeId, variablesHash);

      if (backlogEntry && !backlogEntry.isUsed) {
        // Use existing backlog video
        await storage.markBacklogVideoAsUsed(backlogEntry.id, smartRequest.id);

        // Update smart request to mark it as completed with backlog video
        await storage.updateSmartGenerationRequest(smartRequest.id, {
          status: "completed",
          backlogVideoId: backlogEntry.id
        });

        return {
          success: true,
          requestId: smartRequest.id,
          backlogVideoId: backlogEntry.id,
          videoUrl: backlogEntry.videoUrl,
          thumbnailUrl: backlogEntry.thumbnailUrl || undefined,
          isFromBacklog: true,
          message: "Video generated instantly from backlog"
        };
      }

      // No backlog entry found, proceed with normal generation
      await storage.updateSmartGenerationRequest(smartRequest.id, {
        status: "processing"
      });

      // Process the prompt with form data
      const processedResult = processRecipePrompt(recipe, recipeVariables);
      const finalPrompt = processedResult.prompt;
     
      // Create actual generation record
      const generation = await storage.createGeneration({
        userId,
        recipeId,
        prompt: finalPrompt,
        status: "pending",
        recipeTitle: recipe.name,
        creditsCost: creditsCost || recipe.creditCost,
        metadata: {
          formData: recipeVariables,
          smartRequestId: smartRequest.id,
          isSmartGeneration: true
        }
      }, options.sessionToken);

      // Update smart request with generation ID
      await storage.updateSmartGenerationRequest(smartRequest.id, {
        generationId: generation.id
      });

      // Add to generation queue for processing
      const { generationQueue } = await import("./queue-service");
      await generationQueue.addToQueue(generation, recipeVariables);

      return {
        success: true,
        requestId: smartRequest.id,
        generationId: generation.id,
        isFromBacklog: false,
        message: "Generation started - will be processed in queue"
      };

    } catch (error) {
      console.error("Error in smart generation:", error);

      // Update smart request with failure
      await storage.updateSmartGenerationRequest(smartRequest.id, {
        status: "failed",
        failureReason: "Smart generation failed",
        errorDetails: { error: error instanceof Error ? error.message : "Unknown error" }
      });

      return {
        success: false,
        requestId: smartRequest.id,
        isFromBacklog: false,
        message: "Smart generation failed"
      };
    }
  }

  /**
   * Add a completed generation to the backlog for future reuse
   */
  async addToBacklog(generationId: number, recipeId: number, recipeVariables: Record<string, any>): Promise<void> {
    const generation = await storage.getGenerationById(generationId);
    if (!generation || generation.status !== "completed") {
      throw new Error("Generation not found or not completed");
    }

    const variablesHash = this.generateVariablesHash(recipeVariables);

    // Check if backlog entry already exists
    const existingEntry = await storage.getBacklogVideoByRecipeAndHash(recipeId, variablesHash);
    if (existingEntry) {
      console.log(`Backlog entry already exists for recipe ${recipeId} with hash ${variablesHash}`);
      return;
    }

    // Create backlog entry
    await storage.createBacklogVideo({
      recipeId,
      recipeVariables,
      recipeVariablesHash: variablesHash,
      generationId,
      videoUrl: generation.videoUrl || generation.secureUrl || "",
      thumbnailUrl: generation.thumbnailUrl,
      s3Key: generation.s3Key,
      assetId: generation.assetId,
      shortId: generation.shortId,
      secureUrl: generation.secureUrl,
      isUsed: false,
      metadata: generation.metadata
    });

    console.log(`Added generation ${generationId} to backlog for recipe ${recipeId}`);
  }

  /**
   * Background process to populate backlog with common recipe combinations
   */
  async populateBacklog(recipeId: number, commonCombinations: Record<string, any>[]): Promise<void> {
    const recipe = await storage.getRecipeById(recipeId);
    if (!recipe) {
      throw new Error(`Recipe ${recipeId} not found`);
    }

    console.log(`Starting backlog population for recipe ${recipeId} with ${commonCombinations.length} combinations`);

    for (const variables of commonCombinations) {
      try {
        // Check if already exists
        const variablesHash = this.generateVariablesHash(variables);
        const existingEntry = await storage.getBacklogVideoByRecipeAndHash(recipeId, variablesHash);

        if (existingEntry) {
          console.log(`Backlog entry already exists for combination:`, variables);
          continue;
        }

        // Process the prompt
        const processedResult = processRecipePrompt(recipe, variables);
        const finalPrompt = processedResult.prompt;
        console.log("[BACKLOG FINAL PROMPT]:", finalPrompt);

        // Create generation for backlog
        const generation = await storage.createGeneration({
          userId: "system", // System user for backlog generations
          recipeId,
          prompt: finalPrompt,
          status: "pending",
          recipeTitle: recipe.name,
          creditsCost: 0, // No credits for system generations
          metadata: {
            formData: variables,
            request_origin: "backlog"
          }
        }); // No session token for system generations

        // Add to queue for processing
        const { generationQueue } = await import("./queue-service");
        await generationQueue.addToQueue(generation, variables);

        console.log(`Queued backlog generation ${generation.id} for combination:`, variables);

        // Small delay to avoid overwhelming the queue
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Error queuing backlog generation for combination:`, variables, error);
      }
    }
  }
}

export const smartGenerator = new SmartGenerator(); 
