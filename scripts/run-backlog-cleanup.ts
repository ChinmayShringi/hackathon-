#!/usr/bin/env tsx

import { config } from 'dotenv';
config();

import { backlogCleanupService } from '../server/service-backlog-cleanup';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log('🧹 Delula Backlog Cleanup Service');
  console.log('==================================\n');

  try {
    switch (command) {
      case 'cleanup':
        console.log('🔄 Running regular backlog cleanup...');
        const stats = await backlogCleanupService.cleanupFailedBacklogGenerations();
        
        console.log('\n📊 Cleanup Results:');
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
        break;

      case 'emergency':
        console.log('🚨 Running EMERGENCY backlog cleanup...');
        console.log('⚠️  This will remove ALL failed generations regardless of age!');
        
        const emergencyResult = await backlogCleanupService.emergencyCleanup();
        
        console.log('\n🚨 Emergency Cleanup Results:');
        console.log(`   Removed: ${emergencyResult.removedCount} failed generations`);
        console.log(`   Recipes affected: ${emergencyResult.recipesAffected}`);
        break;

      case 'status':
        console.log('📊 Getting backlog status...');
        const status = await backlogCleanupService.getBacklogStatus();
        
        console.log('\n📊 Backlog Status:');
        console.log(`   Total generations: ${status.totalGenerations}`);
        console.log(`   Completed: ${status.completedGenerations}`);
        console.log(`   Failed: ${status.failedGenerations}`);
        console.log(`   Pending: ${status.pendingGenerations}`);
        console.log(`   Processing: ${status.processingGenerations}`);
        
        if (status.recipesWithFailedGenerations.length > 0) {
          console.log('\n❌ Recipes with Failed Generations:');
          for (const recipe of status.recipesWithFailedGenerations) {
            console.log(`   ${recipe.recipeName} (ID: ${recipe.recipeId}):`);
            console.log(`     - Failed count: ${recipe.failedCount}`);
            console.log(`     - Oldest failed: ${recipe.oldestFailedAge}`);
          }
        } else {
          console.log('\n✨ No recipes have failed generations');
        }
        break;

      case 'help':
      default:
        console.log('Usage: npx tsx scripts/run-backlog-cleanup.ts <command>');
        console.log('');
        console.log('Commands:');
        console.log('  cleanup   - Run regular backlog cleanup (removes failed generations older than 24h)');
        console.log('  emergency - Run emergency cleanup (removes ALL failed generations)');
        console.log('  status    - Show current backlog status and failed generation counts');
        console.log('  help      - Show this help message');
        console.log('');
        console.log('Examples:');
        console.log('  npx tsx scripts/run-backlog-cleanup.ts cleanup');
        console.log('  npx tsx scripts/run-backlog-cleanup.ts emergency');
        console.log('  npx tsx scripts/run-backlog-cleanup.ts status');
        console.log('');
        console.log('Notes:');
        console.log('  - Regular cleanup preserves up to 10 failed generations per recipe');
        console.log('  - Emergency cleanup removes ALL failed generations (use with caution)');
        console.log('  - Both operations only affect the system_backlog user account');
        break;
    }
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});
