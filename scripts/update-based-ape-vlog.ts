#!/usr/bin/env tsx

import './_setup-env';
import { db } from '../server/db';
import { recipes } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function updateBasedApeVlog() {
  console.log('🔧 Updating Disinterested Apes Vlog to BASEd Ape Vlog...');
  
  try {
    // Get the current recipe
    const [recipe] = await db
      .select()
      .from(recipes)
      .where(eq(recipes.slug, 'disinterested-apes-vlog'))
      .limit(1);

    if (!recipe) {
      console.error('❌ Disinterested Apes Vlog recipe not found');
      process.exit(1);
    }

    console.log(`📝 Current recipe: ${recipe.name} (ID: ${recipe.id})`);

    // New recipe steps with compound variable system
    const newRecipeSteps = [
      {
        "id": "fashionStyle",
        "type": "dropdown",
        "label": "Fashion Style",
        "options": [
          { "label": "Tracksuit", "value": "tracksuit" },
          { "label": "Neon Fur Coat", "value": "neon_fur_coat" },
          { "label": "Casual Streetwear", "value": "casual_streetwear" },
          { "label": "Blazer & Gold Chains", "value": "blazer_gold_chains" },
          { "label": "Formal w/ Black Tie", "value": "formal_black_tie" },
          { "label": "Safari", "value": "safari" },
          { "label": "Retro 80s", "value": "retro_80s" },
          { "label": "Rustic", "value": "rustic" }
        ],
        "required": true,
        "defaultValue": "tracksuit"
      },
      {
        "id": "epicSetting",
        "type": "dropdown",
        "label": "Epic Setting",
        "options": [
          { "label": "Mountain Peaks", "value": "mountain_peaks" },
          { "label": "Canyon", "value": "canyon" },
          { "label": "Urban Skyline", "value": "urban_skyline" },
          { "label": "Small Airplane", "value": "small_airplane" }
        ],
        "required": true,
        "defaultValue": "mountain_peaks"
      },
      {
        "id": "propInHand",
        "type": "dropdown",
        "label": "Prop in Hand",
        "options": [
          { "label": "None", "value": "none" },
          { "label": "Cellphone", "value": "cellphone" },
          { "label": "Selfie Stick", "value": "selfie_stick" },
          { "label": "Microphone", "value": "microphone" }
        ],
        "required": true,
        "defaultValue": "none"
      },
      {
        "id": "vloggingTopic",
        "type": "emoji_button",
        "label": "Vlogging Topic",
        "options": [
          {
            "label": "Living a BASEd life",
            "value": "based_life",
            "emoji": "😎",
            "subtitle": "Living a BASEd life"
          },
          {
            "label": "Being extreme / YOLO",
            "value": "extreme_yolo",
            "emoji": "🪂",
            "subtitle": "Being extreme / YOLO"
          },
          {
            "label": "Survival tips",
            "value": "survival_tips",
            "emoji": "🏕️",
            "subtitle": "Survival tips"
          },
          {
            "label": "Boujee Bragging",
            "value": "boujee_bragging",
            "emoji": "📢",
            "subtitle": "Boujee Bragging"
          },
          {
            "label": "Crypto Riches",
            "value": "crypto_riches",
            "emoji": "🪙",
            "subtitle": "Crypto Riches"
          },
          {
            "label": "Burning Daddy's Money",
            "value": "burning_daddys_money",
            "emoji": "🤑",
            "subtitle": "Burning Daddy's Money"
          }
        ],
        "required": true,
        "defaultValue": "based_life"
      }
    ];

    // New JSON prompt template with compound variables
    const newPrompt = `{
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
      "topic": "{{vlogging_topic_description}}",
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
        name: "BASEd Ape Vlog",
        slug: "based-ape-vlog",
        description: "A photorealistic gorilla vlogger living the BASEd life with epic stunts and YOLO energy",
        prompt: newPrompt,
        instructions: "Create a BASEd ape vlog with epic settings, fashion choices, and YOLO topics. The gorilla should be photorealistic and have an apathetic thrill-seeker attitude.",
        recipeSteps: newRecipeSteps
      })
      .where(eq(recipes.id, recipe.id))
      .returning();

    console.log('✅ Recipe updated successfully!');
    console.log('\nUpdated to: BASEd Ape Vlog');
    console.log('New slug: based-ape-vlog');
    console.log('Added compound variable system with:');
    console.log('- Fashion Style dropdown (8 options)');
    console.log('- Epic Setting dropdown (4 options)');
    console.log('- Prop in Hand dropdown (4 options)');
    console.log('- Vlogging Topic emoji buttons (6 options)');
    console.log('- JSON prompt template with compound variables');

  } catch (error) {
    console.error('❌ Error updating recipe:', error);
    process.exit(1);
  }
}

updateBasedApeVlog(); 