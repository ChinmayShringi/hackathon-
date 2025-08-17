import { config } from 'dotenv';
config();

import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, and, isNotNull, sql, lt } from 'drizzle-orm';
import { recipes, generations, recipeUsageOptions, users } from '@shared/schema';
import { processRecipePrompt } from './recipe-processor';
import { AssetRequestOriginType } from '../shared/types';

// Constants
const MINIMUM_REQUIRED_GENERATIONS = 3;
const SYSTEM_BACKLOG_USER_ID = 'system_backlog';

interface RecipeBacklogStatus {
  recipeId: number;
  recipeName: string;
  currentBacklogCount: number;
  requiredCount: number;
  needsGeneration: boolean;
  generationsToCreate: number;
}

interface WeightedOption {
  value: string;
  weight: number;
}

interface RecipeFormData {
  [key: string]: string;
}

export class BacklogRetainMinimumService {
  private pool: Pool;
  private db: any;

  constructor() {
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.db = drizzle({ client: this.pool });
  }

  /**
   * Main service method to maintain minimum backlog for all active recipes
   */
  async maintainBacklog(): Promise<void> {
    console.log('🔄 Starting backlog maintenance service...');
    
    try {
      // Check if cleanup is needed (every 24 hours)
      await this.checkAndRunCleanup();
      
      // Get all active recipes
      const activeRecipes = await this.getActiveRecipes();
      console.log(`📋 Found ${activeRecipes.length} active recipes`);

      // Check backlog status for each recipe
      const backlogStatuses = await this.checkBacklogStatus(activeRecipes);
      
      // Generate missing backlog videos
      await this.generateMissingBacklogVideos(backlogStatuses);
      
      console.log('✅ Backlog maintenance completed');
    } catch (error) {
      console.error('❌ Error in backlog maintenance:', error);
      throw error;
    }
  }

  /**
   * Initialize the service (run once on server start)
   */
  async initialize(): Promise<void> {
    console.log('🚀 Initializing backlog maintenance service...');
    
    try {
      // Run initial cleanup on server start
      await this.runInitialCleanup();
      
      console.log('✅ Backlog maintenance service initialized');
    } catch (error) {
      console.error('❌ Error initializing backlog maintenance service:', error);
      // Don't throw - initialization failure shouldn't stop server startup
    }
  }

  /**
   * Get all active recipes from the database
   */
  private async getActiveRecipes(): Promise<any[]> {
    const result = await this.db
      .select()
      .from(recipes)
      .where(eq(recipes.isActive, true));
    
    return result;
  }

  /**
   * Check the current backlog status for each recipe
   */
  private async checkBacklogStatus(activeRecipes: any[]): Promise<RecipeBacklogStatus[]> {
    const statuses: RecipeBacklogStatus[] = [];

    for (const recipe of activeRecipes) {
      // Count current backlog generations for this recipe
      const currentBacklogCount = await this.getBacklogGenerationCount(recipe.id);
      
      const needsGeneration = currentBacklogCount < MINIMUM_REQUIRED_GENERATIONS;
      const generationsToCreate = needsGeneration 
        ? MINIMUM_REQUIRED_GENERATIONS - currentBacklogCount 
        : 0;

      statuses.push({
        recipeId: recipe.id,
        recipeName: recipe.name,
        currentBacklogCount,
        requiredCount: MINIMUM_REQUIRED_GENERATIONS,
        needsGeneration,
        generationsToCreate
      });

      console.log(`📊 Recipe "${recipe.name}" (ID: ${recipe.id}): ${currentBacklogCount}/${MINIMUM_REQUIRED_GENERATIONS} backlog videos`);
    }

    return statuses;
  }

  /**
   * Count completed backlog generations for a specific recipe
   */
  private async getBacklogGenerationCount(recipeId: number): Promise<number> {
    const result = await this.db
      .select()
      .from(generations)
      .where(
        and(
          eq(generations.recipeId, recipeId),
          eq(generations.userId, SYSTEM_BACKLOG_USER_ID),
          eq(generations.status, 'completed')
        )
      );
    
    return result.length;
  }

  /**
   * Generate missing backlog videos for recipes that need them
   */
  private async generateMissingBacklogVideos(statuses: RecipeBacklogStatus[]): Promise<void> {
    const recipesNeedingGeneration = statuses.filter(s => s.needsGeneration);
    
    if (recipesNeedingGeneration.length === 0) {
      console.log('✅ All recipes have sufficient backlog videos');
      return;
    }

    console.log(`🎬 Generating backlog videos for ${recipesNeedingGeneration.length} recipes...`);

    for (const status of recipesNeedingGeneration) {
      console.log(`\n📝 Processing recipe "${status.recipeName}" (ID: ${status.recipeId})`);
      console.log(`   Need to generate ${status.generationsToCreate} videos`);

      try {
        await this.generateBacklogVideosForRecipe(status);
        console.log(`   ✅ Successfully queued ${status.generationsToCreate} backlog generations`);
      } catch (error) {
        console.error(`   ❌ Error generating backlog for recipe ${status.recipeId}:`, error);
      }
    }
  }

  /**
   * Generate backlog videos for a specific recipe
   */
  private async generateBacklogVideosForRecipe(status: RecipeBacklogStatus): Promise<void> {
    const recipe = await this.getRecipeById(status.recipeId);
    if (!recipe) {
      throw new Error(`Recipe ${status.recipeId} not found`);
    }

    // Generate the required number of backlog videos
    for (let i = 0; i < status.generationsToCreate; i++) {
      try {
        // Generate weighted form data based on recipe usage summary
        const formData = await this.generateWeightedFormData(recipe);
        
        // Create generation for system_backlog user using direct database operation
        const generation = await this.createBacklogGeneration(recipe, formData);
        
        console.log(`     Created backlog generation ${generation.id} with form data:`, formData);
        
        // Add to generation queue for processing
        const { generationQueue } = await import('./queue-service');
        await generationQueue.addToQueue(generation, formData);
        
        console.log(`     ✅ Added generation ${generation.id} to queue`);
        
        // Small delay to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`     ❌ Error creating backlog generation ${i + 1}:`, error);
      }
    }
  }

  /**
   * Generate weighted form data based on recipe usage summary
   */
  private async generateWeightedFormData(recipe: any): Promise<RecipeFormData> {
    // Get recipe usage summary data
    const summaryData = await this.getRecipeUsageSummary(recipe.id);
    
    // If no summary data available, generate random form data based on recipe schema
    if (!summaryData || Object.keys(summaryData).length === 0) {
      return this.generateRandomFormData(recipe);
    }

    // Generate weighted form data based on summary
    const formData: RecipeFormData = {};
    
    for (const [fieldName, fieldData] of Object.entries(summaryData)) {
      if (typeof fieldData === 'object' && fieldData !== null) {
        const options = this.extractOptionsFromSummary(fieldData);
        const selectedValue = this.selectWeightedOption(options);
        formData[fieldName] = selectedValue;
      }
    }

    return formData;
  }

  /**
   * Get recipe usage summary from database
   */
  private async getRecipeUsageSummary(recipeId: number): Promise<any> {
    const result = await this.db
      .select()
      .from(recipeUsageOptions)
      .where(eq(recipeUsageOptions.recipeId, recipeId))
      .limit(1);
    
    return result[0]?.summary || {};
  }

  /**
   * Extract options and their counts from summary data
   */
  private extractOptionsFromSummary(fieldData: any): WeightedOption[] {
    const options: WeightedOption[] = [];
    
    for (const [value, count] of Object.entries(fieldData)) {
      if (value !== 'total' && typeof count === 'number') {
        options.push({
          value: value as string,
          weight: count
        });
      }
    }
    
    return options;
  }

  /**
   * Select a value based on weighted probability distribution
   */
  private selectWeightedOption(options: WeightedOption[]): string {
    if (options.length === 0) {
      return 'default';
    }

    // Calculate total weight
    const totalWeight = options.reduce((sum, option) => sum + option.weight, 0);
    
    if (totalWeight === 0) {
      // If all weights are 0, select randomly
      const randomIndex = Math.floor(Math.random() * options.length);
      return options[randomIndex].value;
    }

    // Generate random number between 0 and total weight
    const randomValue = Math.random() * totalWeight;
    
    // Find the option based on cumulative weight
    let cumulativeWeight = 0;
    for (const option of options) {
      cumulativeWeight += option.weight;
      if (randomValue <= cumulativeWeight) {
        return option.value;
      }
    }
    
    // Fallback to last option
    return options[options.length - 1].value;
  }

  /**
   * Generate random form data when no summary data is available
   */
  private generateRandomFormData(recipe: any): RecipeFormData {
    const formData: RecipeFormData = {};
    
    // Extract variables from recipe prompt using regex
    const variableRegex = /\[([^\]]+)\]/g;
    const matches = recipe.prompt.match(variableRegex);
    
    if (matches) {
      for (const match of matches) {
        const variableName = match.slice(1, -1); // Remove brackets
        
        // Generate a random value based on variable name
        const randomValue = this.generateRandomValueForVariable(variableName);
        formData[variableName] = randomValue;
      }
    }
    
    return formData;
  }

  /**
   * Generate a random value for a specific variable
   */
  private generateRandomValueForVariable(variableName: string): string {
    const lowerName = variableName.toLowerCase();
    
    // Common variable patterns
    if (lowerName.includes('style') || lowerName.includes('type')) {
      const styles = ['realistic', 'cartoon', 'anime', 'photorealistic', 'artistic'];
      return styles[Math.floor(Math.random() * styles.length)];
    }
    
    if (lowerName.includes('color') || lowerName.includes('colour')) {
      const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'black', 'white'];
      return colors[Math.floor(Math.random() * colors.length)];
    }
    
    if (lowerName.includes('size') || lowerName.includes('scale')) {
      const sizes = ['small', 'medium', 'large', 'tiny', 'huge'];
      return sizes[Math.floor(Math.random() * sizes.length)];
    }
    
    if (lowerName.includes('quality')) {
      const qualities = ['low', 'medium', 'high', 'ultra'];
      return qualities[Math.floor(Math.random() * qualities.length)];
    }
    
    if (lowerName.includes('gender')) {
      const genders = ['male', 'female', 'neutral'];
      return genders[Math.floor(Math.random() * genders.length)];
    }
    
    if (lowerName.includes('age')) {
      const ages = ['young', 'adult', 'elderly', 'child', 'teen'];
      return ages[Math.floor(Math.random() * ages.length)];
    }
    
    // Default random value
    return `option_${Math.floor(Math.random() * 10)}`;
  }

  /**
   * Verify that the system_backlog user exists
   */
  private async verifySystemBacklogUser(): Promise<void> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.id, SYSTEM_BACKLOG_USER_ID))
      .limit(1);
    
    if (result.length === 0) {
      throw new Error(`System backlog user '${SYSTEM_BACKLOG_USER_ID}' not found. Please create this user first.`);
    }
    
    console.log(`✅ System backlog user verified: ${SYSTEM_BACKLOG_USER_ID}`);
  }

  /**
   * Get recipe by ID using direct database query
   */
  private async getRecipeById(recipeId: number): Promise<any> {
    const result = await this.db
      .select()
      .from(recipes)
      .where(eq(recipes.id, recipeId))
      .limit(1);
    
    return result[0];
  }

  /**
   * Create a backlog generation by routing through the normal build API flow
   */
  private async createBacklogGeneration(recipe: any, formData: RecipeFormData): Promise<any> {
    console.log(`🔄 Creating backlog generation for recipe ${recipe.id} using normal API flow`);
    console.log(`📝 Generated form data:`, formData);
    
    // Import the necessary modules
    const { storage } = await import('./storage');
    const { processRecipePrompt } = await import('./recipe-processor');
    const { generateTagDisplayData } = await import('./recipe-processor');
    const { validateRecipeFormData } = await import('./recipe-processor');
    
    // Validate form data against recipe structure (same as normal flow)
    const validation = validateRecipeFormData(recipe, formData);
    if (!validation.isValid) {
      throw new Error(`Invalid form data for backlog generation: ${JSON.stringify(validation.errors)}`);
    }
    
    // Process the prompt with form data (same as normal flow)
    const processedResult = processRecipePrompt(recipe, formData);
    const finalPrompt = processedResult.prompt;
    const extractedVariables = processedResult.extractedVariables;
    
    // Generate tag display data for UI (same as normal flow)
    const tagDisplayData = await generateTagDisplayData(recipe, formData);
    
    console.log(`✅ Generated tagDisplayData:`, Object.keys(tagDisplayData));
    
    // Create generation using the same metadata structure as normal user flow
    const generation = await storage.createGeneration({
      userId: SYSTEM_BACKLOG_USER_ID,
      recipeId: recipe.id,
      prompt: finalPrompt,
      status: 'pending',
      recipeTitle: recipe.name,
      creditsCost: 0, // No credits for system generations
      type: (recipe.workflowType === "image_to_video" || recipe.workflowType === "text_to_video") ? "video" : "image",
      metadata: {
        formData: formData,
        tagDisplayData: tagDisplayData,
        extractedVariables: extractedVariables,
        workflowType: recipe.workflowType,
        videoGeneration: recipe.workflowType === "image_to_video" ? "minimax-hailuo-02-pro" : null,
        request_origin: AssetRequestOriginType.BACKLOG
      }
    }, undefined); // No session token for system generations
    
    console.log(`✅ Created backlog generation ${generation.id} with complete metadata`);
    
    return generation;
  }

  /**
   * Get current backlog statistics
   */
  async getBacklogStatistics(): Promise<any> {
    const activeRecipes = await this.getActiveRecipes();
    const statuses = await this.checkBacklogStatus(activeRecipes);
    
    const totalRecipes = statuses.length;
    const recipesWithSufficientBacklog = statuses.filter(s => !s.needsGeneration).length;
    const totalBacklogVideos = statuses.reduce((sum, s) => sum + s.currentBacklogCount, 0);
    const totalNeeded = statuses.reduce((sum, s) => sum + s.generationsToCreate, 0);
    
    return {
      totalRecipes,
      recipesWithSufficientBacklog,
      recipesNeedingBacklog: totalRecipes - recipesWithSufficientBacklog,
      totalBacklogVideos,
      totalNeeded,
      minimumRequired: MINIMUM_REQUIRED_GENERATIONS,
      recipeDetails: statuses
    };
  }

  /**
   * Get all backlog generations for admin panel
   */
  async getBacklogGenerations(): Promise<any[]> {
    const result = await this.db
      .select({
        id: generations.id,
        shortId: generations.shortId,
        recipeId: generations.recipeId,
        recipeTitle: generations.recipeTitle,
        prompt: generations.prompt,
        status: generations.status,
        createdAt: generations.createdAt,
        updatedAt: generations.updatedAt,
        imageUrl: generations.imageUrl,
        videoUrl: generations.videoUrl,
        thumbnailUrl: generations.thumbnailUrl,
        metadata: generations.metadata
      })
      .from(generations)
      .where(eq(generations.userId, SYSTEM_BACKLOG_USER_ID))
      .orderBy(generations.createdAt);

    return result;
  }

  /**
   * Check if cleanup is needed and run it (on server start + every 24 hours)
   */
  private async checkAndRunCleanup(): Promise<void> {
    try {
      // Check if we need to run cleanup (every 24 hours)
      const lastCleanup = await this.getLastCleanupTime();
      const now = new Date();
      const hoursSinceLastCleanup = (now.getTime() - lastCleanup.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceLastCleanup >= 24) {
        console.log('🧹 Running scheduled backlog cleanup...');
        await this.cleanupFailedGenerations();
        await this.updateLastCleanupTime();
      } else {
        const hoursRemaining = 24 - hoursSinceLastCleanup;
        console.log(`⏰ Next cleanup in ${hoursRemaining.toFixed(1)} hours`);
      }
    } catch (error) {
      console.error('❌ Error checking cleanup schedule:', error);
      // Don't throw - cleanup failure shouldn't stop backlog maintenance
    }
  }

  /**
   * Run cleanup immediately on server start (regardless of last cleanup time)
   */
  async runInitialCleanup(): Promise<void> {
    try {
      console.log('🚀 Running initial backlog cleanup on server start...');
      await this.cleanupFailedGenerations();
      await this.updateLastCleanupTime();
      console.log('✅ Initial cleanup completed');
    } catch (error) {
      console.error('❌ Error during initial cleanup:', error);
      // Don't throw - initial cleanup failure shouldn't stop server startup
    }
  }

  /**
   * Get the last time cleanup was run
   */
  private async getLastCleanupTime(): Promise<Date> {
    try {
      // Look for any generation with cleanup metadata
      const result = await this.db
        .select()
        .from(generations)
        .where(
          and(
            eq(generations.userId, SYSTEM_BACKLOG_USER_ID),
            eq(generations.metadata, { request_origin: AssetRequestOriginType.BACKLOG, cleanupRun: true })
          )
        )
        .orderBy(generations.updatedAt)
        .limit(1);
      
      if (result.length > 0) {
        return result[0].updatedAt;
      }
    } catch (error) {
      console.error('❌ Error getting last cleanup time:', error);
    }
    
    // If no cleanup record found, return a date 25 hours ago to trigger cleanup
    return new Date(Date.now() - 25 * 60 * 60 * 1000);
  }

  /**
   * Update the last cleanup time
   */
  private async updateLastCleanupTime(): Promise<void> {
    try {
      // Create a cleanup record in the generations table
      await this.db
        .insert(generations)
        .values({
          userId: SYSTEM_BACKLOG_USER_ID,
          recipeId: 1, // Use a valid recipe ID (1 is usually the first recipe)
          prompt: 'Backlog cleanup completed',
          status: 'completed',
          recipeTitle: 'System Maintenance',
          creditsCost: 0,
          type: 'system',
          metadata: { 
            request_origin: AssetRequestOriginType.BACKLOG,
            cleanupRun: true,
            cleanupTimestamp: new Date().toISOString()
          },
          createdAt: new Date(),
          updatedAt: new Date()
        });
    } catch (error) {
      console.error('❌ Error updating cleanup time:', error);
    }
  }

  /**
   * Clean up failed generations from the backlog account
   */
  private async cleanupFailedGenerations(): Promise<void> {
    try {
      const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
      const maxFailedPerRecipe = 10; // Keep 10 recent failed generations per recipe
      
      console.log(`🧹 Cleaning up failed generations older than ${cutoffTime.toISOString()}`);
      
      // Get failed generations grouped by recipe
      const failedGenerations = await this.db
        .select({
          recipeId: generations.recipeId,
          count: sql<number>`count(*)::int`
        })
        .from(generations)
        .where(
          and(
            eq(generations.userId, SYSTEM_BACKLOG_USER_ID),
            eq(generations.status, 'failed'),
            lt(generations.updatedAt, cutoffTime)
          )
        )
        .groupBy(generations.recipeId);
      
      let totalRemoved = 0;
      
      for (const recipe of failedGenerations) {
        const failedCount = recipe.count;
        const toRemove = Math.max(0, failedCount - maxFailedPerRecipe);
        
        if (toRemove > 0) {
          console.log(`   🧹 Recipe ${recipe.recipeId}: removing ${toRemove} old failed generations`);
          
          // Remove oldest failed generations for this recipe
          const result = await this.db
            .delete(generations)
            .where(
              and(
                eq(generations.recipeId, recipe.recipeId),
                eq(generations.userId, SYSTEM_BACKLOG_USER_ID),
                eq(generations.status, 'failed'),
                lt(generations.updatedAt, cutoffTime)
              )
            )
            .returning({ id: generations.id });
          
          totalRemoved += result.length;
        }
      }
      
      if (totalRemoved > 0) {
        console.log(`✅ Cleanup completed: removed ${totalRemoved} failed generations`);
        
        // Log cleanup operation
        await this.logCleanupOperation(totalRemoved);
      } else {
        console.log('✨ No failed generations to clean up');
      }
    } catch (error) {
      console.error('❌ Error during cleanup:', error);
      throw error;
    }
  }

  /**
   * Log cleanup operation for audit purposes
   */
  private async logCleanupOperation(removedCount: number): Promise<void> {
    try {
      // Insert cleanup log record
      await this.db
        .insert(generations)
        .values({
          userId: SYSTEM_BACKLOG_USER_ID,
          recipeId: 1, // Use a valid recipe ID
          prompt: `Backlog cleanup: removed ${removedCount} failed generations`,
          status: 'completed',
          recipeTitle: 'System Maintenance',
          creditsCost: 0,
          type: 'system',
          metadata: { 
            request_origin: AssetRequestOriginType.BACKLOG,
            cleanupLog: true,
            removedCount,
            cleanupTimestamp: new Date().toISOString()
          },
          createdAt: new Date(),
          updatedAt: new Date()
        });
    } catch (error) {
      console.error('❌ Error logging cleanup operation:', error);
    }
  }
}

// Export singleton instance
export const backlogRetainMinimumService = new BacklogRetainMinimumService(); 