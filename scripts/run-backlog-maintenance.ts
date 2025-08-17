import { config } from 'dotenv';
config();

import { backlogRetainMinimumService } from '../server/service-backlog-retain-minimum';

async function runBacklogMaintenance() {
  console.log('🚀 Starting Backlog Maintenance Service...\n');
  
  try {
    // Get initial statistics
    console.log('📊 Initial backlog statistics:');
    const initialStats = await backlogRetainMinimumService.getBacklogStatistics();
    
    console.log(`  Total Recipes: ${initialStats.totalRecipes}`);
    console.log(`  Recipes with Sufficient Backlog: ${initialStats.recipesWithSufficientBacklog}`);
    console.log(`  Recipes Needing Backlog: ${initialStats.recipesNeedingBacklog}`);
    console.log(`  Total Backlog Videos: ${initialStats.totalBacklogVideos}`);
    console.log(`  Total Needed: ${initialStats.totalNeeded}`);
    
    if (initialStats.totalNeeded === 0) {
      console.log('\n✅ All recipes already have sufficient backlog videos!');
      return;
    }
    
    console.log('\n🔄 Running backlog maintenance...');
    
    // Run the maintenance service
    await backlogRetainMinimumService.maintainBacklog();
    
    console.log('\n✅ Backlog maintenance completed successfully!');
    
    // Get final statistics
    console.log('\n📊 Final backlog statistics:');
    const finalStats = await backlogRetainMinimumService.getBacklogStatistics();
    
    console.log(`  Total Recipes: ${finalStats.totalRecipes}`);
    console.log(`  Recipes with Sufficient Backlog: ${finalStats.recipesWithSufficientBacklog}`);
    console.log(`  Recipes Needing Backlog: ${finalStats.recipesNeedingBacklog}`);
    console.log(`  Total Backlog Videos: ${finalStats.totalBacklogVideos}`);
    console.log(`  Total Needed: ${finalStats.totalNeeded}`);
    
    if (finalStats.totalNeeded === 0) {
      console.log('\n🎉 All recipes now have sufficient backlog videos!');
    } else {
      console.log(`\n⚠️  Still need ${finalStats.totalNeeded} more backlog videos.`);
    }
    
  } catch (error) {
    console.error('❌ Error running backlog maintenance:', error);
    process.exit(1);
  }
}

// Run the maintenance
runBacklogMaintenance().catch(console.error); 