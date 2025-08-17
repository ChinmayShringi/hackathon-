#!/usr/bin/env tsx

import './_setup-env';
import { db } from '../server/db';
import { recipes } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function updateCatOlympicDiving() {
  console.log('🔄 Updating Zoo Olympics to Cat Olympic Diving with new advanced variable architecture...');

  const newRecipeSteps = [
    {
      id: "breed",
      type: "dropdown",
      label: "Cat Breed",
      options: [
        { label: "Maine Coon", value: "maine coon" },
        { label: "Siamese", value: "siamese" },
        { label: "Black American Shorthair", value: "black american shorthair" },
        { label: "Orange Tabby", value: "orange tabby" },
        { label: "Calico", value: "calico" },
        { label: "Bengal", value: "bengal" },
        { label: "Russian Blue", value: "russian blue" }
      ],
      required: true,
      defaultValue: "black american shorthair"
    },
    {
      id: "age",
      type: "slider",
      label: "Age",
      config: {
        min: 0,
        max: 2,
        step: 1,
        showValue: true,
        ticks: [
          { value: 0, label: "Kitten" },
          { value: 1, label: "Adult Cat" },
          { value: 2, label: "Senior Citizen Cat" }
        ]
      },
      required: true,
      defaultValue: "1"
    },
    {
      id: "weight",
      type: "slider",
      label: "Weight",
      config: {
        min: 0,
        max: 3,
        step: 1,
        showValue: true,
        ticks: [
          { value: 0, label: "Athletic Build" },
          { value: 1, label: "Average Weight" },
          { value: 2, label: "Overweight" },
          { value: 3, label: "Obese" }
        ]
      },
      required: true,
      defaultValue: "0"
    },
    {
      id: "divingStyle",
      type: "dropdown",
      label: "Diving Style",
      options: [
        { label: "Backflip", value: "backflip" },
        { label: "Forward Somersault", value: "forward somersault" },
        { label: "Twisting Dive", value: "twisting dive" },
        { label: "Forward Dive", value: "forward dive" }
      ],
      required: true,
      defaultValue: "backflip"
    },
    {
      id: "attitude",
      type: "dropdown",
      label: "Attitude",
      options: [
        { label: "Professional Sports Athlete", value: "professional sports athlete" },
        { label: "Clumsy Amateur", value: "clumsy amateur" },
        { label: "Sophisticated & Poised", value: "sophisticated and poised" }
      ],
      required: true,
      defaultValue: "clumsy amateur"
    },
    {
      id: "waterEntryStyle",
      type: "emoji_button",
      label: "Water Entry Style",
      options: [
        {
          label: "Neat Dive",
          value: "neat dive",
          emoji: "💯",
          subtitle: "Clean entry"
        },
        {
          label: "Cannonball splash",
          value: "cannonball splash",
          emoji: "🌊",
          subtitle: "Big splash"
        },
        {
          label: "Meteoric",
          value: "meteoric",
          emoji: "💥",
          subtitle: "Explosive entry"
        }
      ],
      required: true,
      defaultValue: "cannonball splash"
    },
    {
      id: "soundStyle",
      type: "dropdown",
      label: "Sound Style",
      options: [
        { label: "Stadium cheering ambiance", value: "stadium cheering" },
        { label: "Hushed stadium", value: "hushed stadium" }
      ],
      required: true,
      defaultValue: "stadium cheering"
    }
  ];

  const newPrompt = `{
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
    "speed of action": "moving very quickly with a slow motion kicking in as they enter the water",
    "water interaction": "the subject should enter the water and not come out, end once the water entry animation is complete"
  }
}`;

  try {
    // Update the recipe
    const result = await db
      .update(recipes)
      .set({
        name: "Cat Olympic Diving",
        slug: "cat-olympic-diving",
        description: "Watch cats compete in Olympic diving with spectacular dives and dramatic water entries",
        prompt: newPrompt,
        instructions: "Create hilarious videos of cats performing Olympic diving feats. Choose the cat breed, age, weight, diving style, attitude, water entry style, and sound ambiance to create your perfect diving moment.",
        category: "Sports & Entertainment",
        recipeSteps: newRecipeSteps,
        generationType: "video",
        workflowType: "text_to_video",
        videoDuration: 8,
        videoAspectRatio: "9:16",
        videoQuality: "hd",
        workflow_components: [
          {
            type: "text_to_video",
            model: "veo3-fast",
            endpoint: "fal-ai/veo3/fast",
            serviceId: 2
          }
        ]
      })
      .where(eq(recipes.slug, 'zoo-olympics'))
      .returning();

    console.log('✅ Cat Olympic Diving recipe updated successfully!');
    console.log(`📝 Updated recipe: ${result[0].name} (ID: ${result[0].id})`);
    console.log(`   New slug: ${result[0].slug}`);
    console.log(`   Generation Type: ${result[0].generationType}`);
    console.log(`   Video Duration: ${result[0].videoDuration}`);
    console.log(`   Video Aspect Ratio: ${result[0].videoAspectRatio}`);

  } catch (error) {
    console.error('❌ Error updating recipe:', error);
    process.exit(1);
  }
}

updateCatOlympicDiving().catch(console.error); 