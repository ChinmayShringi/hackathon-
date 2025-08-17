#!/usr/bin/env tsx

import './_setup-env';
import { db } from '../server/db';
import { recipes } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function checkCatOlympicDiving() {
  console.log('🔍 Checking Cat Olympic Diving recipe configuration...');
  
  try {
    // Get the current recipe
    const [recipe] = await db
      .select()
      .from(recipes)
      .where(eq(recipes.slug, 'cat-olympic-diving'))
      .limit(1);

    if (!recipe) {
      console.error('❌ Cat Olympic Diving recipe not found');
      process.exit(1);
    }

    console.log(`📝 Recipe: ${recipe.name} (ID: ${recipe.id})`);
    console.log(`   Slug: ${recipe.slug}`);
    console.log(`   Generation Type: ${recipe.generationType}`);
    console.log(`   Workflow Type: ${recipe.workflowType}`);
    console.log(`   Video Duration: ${recipe.videoDuration}`);
    console.log(`   Video Aspect Ratio: ${recipe.videoAspectRatio}`);
    console.log(`   Video Quality: ${recipe.videoQuality}`);
    console.log(`   Category: ${recipe.category}`);
    console.log(`   Description: ${recipe.description}`);
    console.log(`   Instructions: ${recipe.instructions}`);
    console.log(`   Recipe Steps Count: ${Array.isArray(recipe.recipeSteps) ? recipe.recipeSteps.length : 'Not an array'}`);
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
      console.log('\n⚠️  Recipe needs updates for Veo 3 Fast!');
    } else {
      console.log('\n✅ Recipe is properly configured for Veo 3 Fast!');
    }

    // Check recipe steps structure
    if (Array.isArray(recipe.recipeSteps)) {
      console.log('\n📋 Recipe Steps:');
      recipe.recipeSteps.forEach((step, index) => {
        console.log(`   ${index + 1}. ${step.label} (${step.type}) - Required: ${step.required}`);
        if (step.type === 'slider' && step.config?.ticks) {
          console.log(`      Ticks: ${step.config.ticks.map(t => t.label).join(', ')}`);
        }
      });
    }

  } catch (error) {
    console.error('❌ Error checking recipe:', error);
    process.exit(1);
  }
}

checkCatOlympicDiving().catch(console.error); 