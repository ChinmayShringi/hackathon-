#!/usr/bin/env tsx

import './_setup-env';
import { db } from '../server/db';
import { recipes } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function fixZooOlympicsRecipe() {
  console.log('🔧 Fixing Zoo Olympics recipe...');
  
  try {
    // Get the current recipe
    const [recipe] = await db
      .select()
      .from(recipes)
      .where(eq(recipes.slug, 'zoo-olympics'))
      .limit(1);

    if (!recipe) {
      console.error('❌ Zoo Olympics recipe not found');
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
        videoDuration: 8, // 8 seconds
        videoAspectRatio: '9:16', // Portrait aspect ratio
        videoQuality: 'hd'
      })
      .where(eq(recipes.id, recipe.id))
      .returning();

    console.log('✅ Recipe updated successfully!');
    console.log('\nUpdated settings:');
    console.log('- Video Duration: 8 seconds');
    console.log('- Video Aspect Ratio: 9:16');
    console.log('- Service ID: 2 (Veo 3 Fast)');
    console.log('- Endpoint: fal-ai/veo3/fast');

  } catch (error) {
    console.error('❌ Error updating recipe:', error);
    process.exit(1);
  }
}

fixZooOlympicsRecipe(); 