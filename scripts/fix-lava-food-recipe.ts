#!/usr/bin/env tsx

import './_setup-env';
import { db } from '../server/db';
import { recipes } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function fixLavaFoodRecipe() {
  console.log('🔧 Fixing Lava Food ASMR recipe...');
  
  try {
    // Get the current recipe
    const [recipe] = await db
      .select()
      .from(recipes)
      .where(eq(recipes.slug, 'lava-food-asmr'))
      .limit(1);

    if (!recipe) {
      console.error('❌ Lava Food ASMR recipe not found');
      process.exit(1);
    }

    console.log(`📝 Current recipe: ${recipe.name} (ID: ${recipe.id})`);
    console.log(`   Generation Type: ${recipe.generationType}`);
    console.log(`   Workflow Type: ${recipe.workflowType}`);
    console.log(`   Video Duration: ${recipe.videoDuration}`);
    console.log(`   Video Aspect Ratio: ${recipe.videoAspectRatio}`);

    // Update the recipe with correct settings
    const updatedRecipe = await db
      .update(recipes)
      .set({
        generationType: 'video',
        workflowType: 'text_to_video',
        videoDuration: 8, // 8 seconds
        videoAspectRatio: '9:16', // Portrait aspect ratio
        videoQuality: 'hd',
        workflow_components: [
          {
            type: "text_to_video",
            model: "veo3-fast",
            endpoint: "fal-ai/veo3/fast",
            serviceId: 2
          }
        ]
      })
      .where(eq(recipes.id, recipe.id))
      .returning();

    console.log('✅ Recipe updated successfully!');
    console.log('\nUpdated settings:');
    console.log('- Generation Type: video');
    console.log('- Workflow Type: text_to_video');
    console.log('- Video Duration: 8 seconds');
    console.log('- Video Aspect Ratio: 9:16');
    console.log('- Service ID: 2 (Veo 3 Fast)');
    console.log('- Endpoint: fal-ai/veo3/fast');

  } catch (error) {
    console.error('❌ Error updating recipe:', error);
    process.exit(1);
  }
}

fixLavaFoodRecipe(); 