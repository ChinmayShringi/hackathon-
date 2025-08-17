#!/usr/bin/env tsx

// Load environment variables first
import dotenv from 'dotenv';
dotenv.config();

import { recipes } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

/**
 * Update video recipes to use the new simplified text-to-video workflow
 * This script updates recipes with generationType: "video" to use the new workflow
 */

async function updateVideoRecipes() {
  try {
    console.log('🔄 Updating video recipes to use simplified text-to-video workflow...');
    
    // Dynamically import database after environment is loaded
    const { db } = await import('../server/db.js');
    
    // Get all video recipes
    const videoRecipes = await db
      .select()
      .from(recipes)
      .where(eq(recipes.generationType, 'video'));
    
    console.log(`Found ${videoRecipes.length} video recipes to update`);
    
    const newWorkflowComponents = [
      {
        type: "text_to_video",
        model: "veo3-fast",
        serviceId: 2
      }
    ];
    
    let updatedCount = 0;
    
    for (const recipe of videoRecipes) {
      console.log(`\n📝 Updating recipe: ${recipe.name} (ID: ${recipe.id})`);
      
      // Update the recipe with new workflow configuration
      await db
        .update(recipes)
        .set({
          workflowType: 'video',
          workflow_components: newWorkflowComponents,
          model: 'veo3-fast' // Update model to match the new workflow
        })
        .where(eq(recipes.id, recipe.id));
      
      console.log(`✅ Updated recipe: ${recipe.name}`);
      updatedCount++;
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} video recipes!`);
    console.log('\nUpdated recipes now use:');
    console.log('- Workflow Type: video');
    console.log('- Model: veo3-fast');
    console.log('- Service ID: 2 (Veo 3 Fast)');
    console.log('- Direct text-to-video generation (no image step)');
    
  } catch (error) {
    console.error('❌ Error updating video recipes:', error);
    process.exit(1);
  }
}

// Run the update
updateVideoRecipes()
  .then(() => {
    console.log('\n✨ Video recipe update completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }); 