import { config } from 'dotenv';
config();

import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, and, lt, or, isNull, sql } from 'drizzle-orm';
import { generations, users } from '@shared/schema';

// Constants
const SYSTEM_BACKLOG_USER_ID = 'system_backlog';
const CLEANUP_AGE_HOURS = 24; // Clean up failed generations older than 24 hours
const MAX_FAILED_GENERATIONS_PER_RECIPE = 10; // Maximum failed generations to keep per recipe

interface CleanupStats {
  totalFailedGenerations: number;
  cleanedUpGenerations: number;
  recipesAffected: number;
  cleanupDetails: {
    recipeId: number;
    recipeName: string;
    failedCount: number;
    cleanedCount: number;
    keptCount: number;
  }[];
}

export class BacklogCleanupService {
  private pool: Pool;
  private db: any;

  constructor() {
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.db = drizzle({ client: this.pool });
  }

  /**
   * Main cleanup method - removes failed generations from backlog account
   * This prevents accumulation of failed generations during service interruptions
   */
  async cleanupFailedBacklogGenerations(): Promise<CleanupStats> {
    console.log('🧹 Starting backlog cleanup service...');
    
    try {
      // Verify system_backlog user exists
      await this.verifySystemBacklogUser();
      
      // Get cleanup statistics before cleanup
      const stats = await this.getCleanupStats();
      
      // Perform the cleanup
      await this.performCleanup(stats);
      
      // Get final statistics
      const finalStats = await this.getCleanupStats();
      
      console.log('✅ Backlog cleanup completed');
      console.log(`📊 Cleanup Summary:`);
      console.log(`   - Total failed generations: ${stats.totalFailedGenerations}`);
      console.log(`   - Cleaned up: ${stats.cleanedUpGenerations}`);
      console.log(`   - Recipes affected: ${stats.recipesAffected}`);
      
      return finalStats;
    } catch (error) {
      console.error('❌ Error in backlog cleanup:', error);
      throw error;
    } finally {
      await this.pool.end();
    }
  }

  /**
   * Verify that the system_backlog user exists
   */
  private async verifySystemBacklogUser(): Promise<void> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, SYSTEM_BACKLOG_USER_ID));
    
    if (!user) {
      throw new Error(`System backlog user '${SYSTEM_BACKLOG_USER_ID}' not found. Please create this user first.`);
    }
    
    console.log(`✅ System backlog user verified: ${SYSTEM_BACKLOG_USER_ID}`);
  }

  /**
   * Get statistics about failed generations that need cleanup
   */
  private async getCleanupStats(): Promise<CleanupStats> {
    const cutoffTime = new Date(Date.now() - CLEANUP_AGE_HOURS * 60 * 60 * 1000);
    
    // Get failed generations grouped by recipe
    const failedGenerations = await this.db
      .select({
        recipeId: generations.recipeId,
        count: sql<number>`count(*)::int`,
        recipeName: sql<string>`(
          SELECT name FROM recipes WHERE id = generations.recipe_id
        )`
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

    let totalFailedGenerations = 0;
    let totalCleanedUpGenerations = 0;
    const cleanupDetails: CleanupStats['cleanupDetails'] = [];

    for (const recipe of failedGenerations) {
      const failedCount = recipe.count;
      totalFailedGenerations += failedCount;
      
      // Calculate how many to clean up vs keep
      const toCleanup = Math.max(0, failedCount - MAX_FAILED_GENERATIONS_PER_RECIPE);
      const toKeep = Math.min(failedCount, MAX_FAILED_GENERATIONS_PER_RECIPE);
      
      totalCleanedUpGenerations += toCleanup;
      
      cleanupDetails.push({
        recipeId: recipe.recipeId,
        recipeName: recipe.recipeName || 'Unknown Recipe',
        failedCount,
        cleanedCount: toCleanup,
        keptCount: toKeep
      });
    }

    return {
      totalFailedGenerations,
      cleanedUpGenerations: totalCleanedUpGenerations,
      recipesAffected: cleanupDetails.length,
      cleanupDetails
    };
  }

  /**
   * Perform the actual cleanup of failed generations
   */
  private async performCleanup(stats: CleanupStats): Promise<void> {
    if (stats.cleanedUpGenerations === 0) {
      console.log('✨ No failed generations to clean up');
      return;
    }

    const cutoffTime = new Date(Date.now() - CLEANUP_AGE_HOURS * 60 * 60 * 1000);
    
    console.log(`🧹 Cleaning up ${stats.cleanedUpGenerations} failed generations...`);

    // Clean up failed generations, keeping only the most recent ones per recipe
    for (const detail of stats.cleanupDetails) {
      if (detail.cleanedCount > 0) {
        await this.cleanupRecipeFailedGenerations(detail.recipeId, detail.cleanedCount, cutoffTime);
      }
    }
  }

  /**
   * Clean up failed generations for a specific recipe
   * Keeps the most recent failed generations and removes the oldest ones
   */
  private async cleanupRecipeFailedGenerations(
    recipeId: number, 
    countToRemove: number, 
    cutoffTime: Date
  ): Promise<void> {
    console.log(`   🧹 Cleaning up ${countToRemove} failed generations for recipe ${recipeId}`);
    
    // Delete the oldest failed generations for this recipe
    const result = await this.db
      .delete(generations)
      .where(
        and(
          eq(generations.recipeId, recipeId),
          eq(generations.userId, SYSTEM_BACKLOG_USER_ID),
          eq(generations.status, 'failed'),
          lt(generations.updatedAt, cutoffTime)
        )
      )
      .returning({ id: generations.id });

    console.log(`   ✅ Removed ${result.length} failed generations for recipe ${recipeId}`);
  }

  /**
   * Get current backlog status including failed generations
   */
  async getBacklogStatus(): Promise<{
    totalGenerations: number;
    completedGenerations: number;
    failedGenerations: number;
    pendingGenerations: number;
    processingGenerations: number;
    recipesWithFailedGenerations: Array<{
      recipeId: number;
      recipeName: string;
      failedCount: number;
      oldestFailedAge: string;
    }>;
  }> {
    // Get overall counts
    const [totalCount] = await this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(generations)
      .where(eq(generations.userId, SYSTEM_BACKLOG_USER_ID));

    const [completedCount] = await this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(generations)
      .where(
        and(
          eq(generations.userId, SYSTEM_BACKLOG_USER_ID),
          eq(generations.status, 'completed')
        )
      );

    const [failedCount] = await this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(generations)
      .where(
        and(
          eq(generations.userId, SYSTEM_BACKLOG_USER_ID),
          eq(generations.status, 'failed')
        )
      );

    const [pendingCount] = await this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(generations)
      .where(
        and(
          eq(generations.userId, SYSTEM_BACKLOG_USER_ID),
          eq(generations.status, 'pending')
        )
      );

    const [processingCount] = await this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(generations)
      .where(
        and(
          eq(generations.userId, SYSTEM_BACKLOG_USER_ID),
          eq(generations.status, 'processing')
        )
      );

    // Get recipes with failed generations
    const recipesWithFailed = await this.db
      .select({
        recipeId: generations.recipeId,
        recipeName: sql<string>`(
          SELECT name FROM recipes WHERE id = generations.recipe_id
        )`,
        failedCount: sql<number>`count(*)::int`,
        oldestFailedAge: sql<string>`(
          SELECT EXTRACT(EPOCH FROM (NOW() - updated_at))::int || ' seconds ago'
          FROM generations g2 
          WHERE g2.recipe_id = generations.recipe_id 
            AND g2.user_id = ${SYSTEM_BACKLOG_USER_ID}
            AND g2.status = 'failed'
          ORDER BY updated_at ASC 
          LIMIT 1
        )`
      })
      .from(generations)
      .where(
        and(
          eq(generations.userId, SYSTEM_BACKLOG_USER_ID),
          eq(generations.status, 'failed')
        )
      )
      .groupBy(generations.recipeId)
      .orderBy(sql`count(*) DESC`);

    return {
      totalGenerations: totalCount?.count || 0,
      completedGenerations: completedCount?.count || 0,
      failedGenerations: failedCount?.count || 0,
      pendingGenerations: pendingCount?.count || 0,
      processingGenerations: processingCount?.count || 0,
      recipesWithFailedGenerations: recipesWithFailed.map((r: any) => ({
        recipeId: r.recipeId,
        recipeName: r.recipeName || 'Unknown Recipe',
        failedCount: r.failedCount,
        oldestFailedAge: r.oldestFailedAge
      }))
    };
  }

  /**
   * Emergency cleanup - removes ALL failed generations regardless of age
   * Use this only when there's a critical accumulation of failed generations
   */
  async emergencyCleanup(): Promise<{
    removedCount: number;
    recipesAffected: number;
  }> {
    console.log('🚨 Starting EMERGENCY backlog cleanup...');
    
    try {
      await this.verifySystemBacklogUser();
      
      // Get count of all failed generations
      const [failedCount] = await this.db
        .select({ count: sql<number>`count(*)::int` })
        .from(generations)
        .where(
          and(
            eq(generations.userId, SYSTEM_BACKLOG_USER_ID),
            eq(generations.status, 'failed')
          )
        );

      if (failedCount?.count === 0) {
        console.log('✨ No failed generations to clean up');
        return { removedCount: 0, recipesAffected: 0 };
      }

      // Get unique recipes affected
      const [recipeCount] = await this.db
        .select({ count: sql<number>`count(DISTINCT recipe_id)::int` })
        .from(generations)
        .where(
          and(
            eq(generations.userId, SYSTEM_BACKLOG_USER_ID),
            eq(generations.status, 'failed')
          )
        );

      // Remove all failed generations
      const result = await this.db
        .delete(generations)
        .where(
          and(
            eq(generations.userId, SYSTEM_BACKLOG_USER_ID),
            eq(generations.status, 'failed')
          )
        )
        .returning({ id: generations.id });

      console.log(`🚨 Emergency cleanup completed: removed ${result.length} failed generations from ${recipeCount?.count || 0} recipes`);
      
      return {
        removedCount: result.length,
        recipesAffected: recipeCount?.count || 0
      };
    } catch (error) {
      console.error('❌ Error in emergency cleanup:', error);
      throw error;
    } finally {
      await this.pool.end();
    }
  }
}

// Export singleton instance
export const backlogCleanupService = new BacklogCleanupService();
