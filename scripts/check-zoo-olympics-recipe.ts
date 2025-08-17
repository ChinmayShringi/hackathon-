#!/usr/bin/env tsx

import './_setup-env';
import { db } from '../server/db';
import { recipes } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function checkZooOlympicsRecipe() {
  console.log('🔍 Checking Zoo Olympics recipe configuration...');
  
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

    console.log(`📝 Recipe: ${recipe.name} (ID: ${recipe.id})`);
    console.log(`   Slug: ${recipe.slug}`);
    console.log(`   Generation Type: ${recipe.generationType}`);
    console.log(`   Workflow Type: ${recipe.workflowType}`);
    console.log(`   Video Duration: ${recipe.videoDuration}`);
    console.log(`   Video Aspect Ratio: ${recipe.videoAspectRatio}`);
    console.log(`   Video Quality: ${recipe.videoQuality}`);
    console.log(`   Workflow Components:`, JSON.stringify(recipe.workflow_components, null, 2));

    // Check if it needs to be updated for Veo 3 Fast
    const needsUpdate = 
      recipe.generationType !== 'video' ||
      recipe.workflowType !== 'text_to_video' ||
      recipe.videoDuration !== 8 ||
      recipe.videoAspectRatio !== '9:16' ||
      !recipe.workflow_components ||
      !Array.isArray(recipe.workflow_components) ||
      recipe.workflow_components.length === 0 ||
      recipe.workflow_components[0].serviceId !== 2;

    if (needsUpdate) {
      console.log('\n⚠️  Recipe needs to be updated for Veo 3 Fast!');
      console.log('Expected settings:');
      console.log('- Generation Type: video');
      console.log('- Workflow Type: text_to_video');
      console.log('- Video Duration: 8 seconds');
      console.log('- Video Aspect Ratio: 9:16');
      console.log('- Service ID: 2 (Veo 3 Fast)');
      console.log('- Endpoint: fal-ai/veo3/fast');
    } else {
      console.log('\n✅ Recipe is properly configured for Veo 3 Fast!');
    }

  } catch (error) {
    console.error('❌ Error checking recipe:', error);
    process.exit(1);
  }
}

checkZooOlympicsRecipe(); 