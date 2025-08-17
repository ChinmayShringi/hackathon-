#!/usr/bin/env tsx

import './_setup-env';
import { db } from '../server/db';
import { recipes } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function refactorGorillaRecipe() {
  console.log('🔧 Refactoring BASEd Ape Vlog recipe to remove dialogue.topic structure...');
  
  try {
    // Get the current recipe
    const [recipe] = await db
      .select()
      .from(recipes)
      .where(eq(recipes.slug, 'based-ape-vlog'))
      .limit(1);

    if (!recipe) {
      console.error('❌ BASEd Ape Vlog recipe not found');
      process.exit(1);
    }

    console.log(`📝 Current recipe: ${recipe.name} (ID: ${recipe.id})`);

    // Updated JSON prompt template - restored dialogue structure without topic
    const updatedPrompt = `{
  "shot": {
    "composition": "medium shot, vertical format, handheld camera, photo-realistic",
    "camera_motion": "shaky handcam",
    "frame_rate": "30fps",
    "film_grain": "none"
  },
  "subject": {
    "description": "a towering, photorealistic gorilla (inspired by the Bored Apes Yacht Club) with well groomed fur and expressive eyes",
    "wardrobe": "{{wardrobe_description}}"
  },
  "scene": {
    "location": "{{location_description}}",
    "time_of_day": "daytime outdoors",
    "environment": "{{environment_description}}"
  },
  "visual_details": {
    "action": "{{action_description}}",
    "props": "{{props_description}}"
  },
  "cinematography": {
    "lighting": "natural sunlight with soft shadows",
    "tone": "lighthearted and humorous"
  },
  "audio": {
    "ambient": "{{ambient_sounds}}",
    "dialogue": {
      "character": "Gorilla",
      "subtitles": false
    },
    "effects": "{{audio_effects}}"
  },
  "color_palette": "naturalistic with earthy greens and browns, whites and blues for snow",
  "additional_details": {
    "action": "{{additional_action_description}}",
    "parachute_type": "large glider-style parachute",
    "attitude": "gorilla is an apathetic thrill-seeker, effortlessly cool, low-key reckless, YOLO"
  }
}`;

    // Update the recipe
    const updatedRecipe = await db
      .update(recipes)
      .set({
        prompt: updatedPrompt,
        instructions: "Create a BASEd ape vlog with epic settings, fashion choices, and YOLO topics. The gorilla should be photorealistic and have an apathetic thrill-seeker attitude. The topic is now integrated into the action description."
      })
      .where(eq(recipes.id, recipe.id))
      .returning();

    console.log('✅ Recipe refactored successfully!');
    console.log('\nChanges made:');
    console.log('- Removed dialogue.topic structure from audio section');
    console.log('- Topic information is now integrated into additional_details.action');
    console.log('- Updated instructions to reflect the change');

  } catch (error) {
    console.error('❌ Error refactoring recipe:', error);
    process.exit(1);
  }
}

refactorGorillaRecipe(); 