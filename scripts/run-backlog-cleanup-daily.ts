#!/usr/bin/env tsx

import { config } from 'dotenv';
config();

import { backlogCleanupService } from '../server/service-backlog-cleanup';

async function main() {
  console.log('🧹 Delula Daily Backlog Cleanup');
  console.log('================================');
  console.log(`Started at: ${new Date().toISOString()}\n`);

  try {
    // Run the daily cleanup
    const stats = await backlogCleanupService.cleanupFailedBacklogGenerations();
    
    console.log('\n📊 Daily Cleanup Results:');
    console.log(`   Total failed generations: ${stats.totalFailedGenerations}`);
    console.log(`   Cleaned up: ${stats.cleanedUpGenerations}`);
    console.log(`   Recipes affected: ${stats.recipesAffected}`);
    
    if (stats.cleanupDetails.length > 0) {
      console.log('\n📋 Recipe Details:');
      for (const detail of stats.cleanupDetails) {
        console.log(`   ${detail.recipeName} (ID: ${detail.recipeId}):`);
        console.log(`     - Failed: ${detail.failedCount}`);
        console.log(`     - Cleaned: ${detail.cleanedCount}`);
        console.log(`     - Kept: ${detail.keptCount}`);
      }
    }
    
    console.log(`\n✅ Daily cleanup completed at: ${new Date().toISOString()}`);
    
    // Exit with success code
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error during daily cleanup:', error);
    
    // Exit with error code for system cron to detect failures
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});
