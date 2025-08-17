#!/usr/bin/env tsx

import 'dotenv/config';
import { generateTagDisplayData } from '../server/recipe-processor';
import { storage } from '../server/storage';

async function debugGenerateTagDisplayData() {
  console.log('🔍 Debugging generateTagDisplayData Function\n');

  try {
    // Get the recipe that's causing the issue (likely lava-food-asmr)
    const recipe = await storage.getRecipeBySlug('lava-food-asmr');
    if (!recipe) {
      console.log('❌ Recipe not found');
      return;
    }

    console.log('1. Recipe found:', {
      id: recipe.id,
      name: recipe.name,
      slug: recipe.slug
    });

    console.log('\n2. Recipe steps:');
    recipe.recipeSteps?.forEach((step, index) => {
      console.log(`  ${index + 1}. ${step.label} (${step.id}) - type: ${step.type}`);
    });

    // Create sample form data that would include Venue
    const sampleFormData = {
      venue: 'TV Tray Dinner on Couch',
      age: '70',
      gender: 'Female',
      lavaFoodItem: 'Lava Plate of Food',
      asmrSoundStyle: 'Bubbling',
      eatingExpression: '🧐 Sophisticated Enjoyment'
    };

    console.log('\n3. Sample form data:', sampleFormData);

    // Test generateTagDisplayData
    console.log('\n4. Testing generateTagDisplayData:');
    const tagDisplayData = await generateTagDisplayData(recipe, sampleFormData);
    
    console.log('Result tagDisplayData:');
    for (const [key, data] of Object.entries(tagDisplayData)) {
      console.log(`  ${key}:`, data);
    }

    // Check specifically for Venue
    console.log('\n5. Venue data specifically:');
    console.log('tagDisplayData.Venue:', tagDisplayData.Venue);

  } catch (error) {
    console.error('Error:', error);
  }
}

debugGenerateTagDisplayData(); 