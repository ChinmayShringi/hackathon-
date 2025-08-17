#!/usr/bin/env tsx

import './_setup-env';
import { db } from '../server/db';
import { recipes } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function removeSlowMotionFromCatDiving() {
  console.log('🔧 Removing slow motion reference from Cat Olympic Diving recipe...');
  
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

    console.log(`📝 Current recipe: ${recipe.name} (ID: ${recipe.id})`);

    // Updated JSON prompt template - removed slow motion reference
    const updatedPrompt = `{
  "shot": {
    "composition": "medium shot, professional dolly cable rigged camera",
    "aspect_ratio": "9:16",
    "camera_motion": "smooth tracking",
    "frame_rate": "30fps",
    "film_grain": "none"
  },
  "subject": {
    "description": "{{cat_description}}",
    "wardrobe": "a random athletic swimming suit appropriate to the character and setting"
  },
  "scene": {
    "location": "Packed Olympic Stadium surrounds the pool. The stadium has an open ceiling so the sky is visible above the pool. Every seat in the stadium is filled, the lights are bright and there are camera flashes in the background.",
    "time_of_day": "daytime but indoors",
    "environment": "the environment should seem like an excited stadium, invoking the idea that the subject is an animal attempting to perform olympic feats in diving"
  },
  "visual_details": {
    "action": "{{action_description}}",
    "props": "olympic swimming pool, diving board"
  },
  "cinematography": {
    "lighting": "indoors bright natural lighting with soft shadows",
    "tone": "focused"
  },
  "audio": {
    "ambient": "{{ambient_sounds}}"
  },
  "special_effects": "{{special_effects_description}}",
  "color_palette": "grays and blues for the stadium and water, and colorful for the audience",
  "additional_details": {
    "water interaction": "the subject should enter the water and not come out, end once the water entry animation is complete"
  }
}`;

    // Update the recipe
    const updatedRecipe = await db
      .update(recipes)
      .set({
        prompt: updatedPrompt,
        instructions: "Create hilarious videos of cats performing Olympic diving feats. Choose the cat breed, age, weight, diving style, attitude, water entry style, and sound ambiance to create your perfect diving moment."
      })
      .where(eq(recipes.id, recipe.id))
      .returning();

    console.log('✅ Recipe updated successfully!');
    console.log('\nChanges made:');
    console.log('- Removed slow motion reference from additional_details');
    console.log('- Simplified speed of action description');

  } catch (error) {
    console.error('❌ Error updating recipe:', error);
    process.exit(1);
  }
}

removeSlowMotionFromCatDiving(); 