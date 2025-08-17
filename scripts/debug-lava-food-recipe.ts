#!/usr/bin/env tsx

import 'dotenv/config';
import { storage } from '../server/storage';
import { generateTagDisplayData } from '../server/recipe-processor';

async function debugLavaFoodRecipe() {
  console.log('🔍 Debugging Lava Food ASMR recipe options...\n');

  try {
    // Get the Lava Food ASMR recipe
    const recipe = await storage.getRecipeBySlug('lava-food-asmr');
    if (!recipe) {
      console.log('❌ Recipe not found');
      return;
    }

    console.log(`✅ Recipe found: ${recipe.name} (ID: ${recipe.id})`);
    
    if (!recipe.recipeSteps) {
      console.log('❌ No recipeSteps found');
      return;
    }

    console.log(`\n📋 Recipe Steps and Options:`);
    recipe.recipeSteps.forEach((step, index) => {
      console.log(`\n${index + 1}. ${step.label} (${step.id}) - type: ${step.type}`);
      
      if (step.options) {
        console.log(`   Options (${step.options.length}):`);
        step.options.forEach((option, optIndex) => {
          console.log(`     ${optIndex + 1}. value: "${option.value}" -> label: "${option.label}"`);
        });
      } else {
        console.log(`   No options defined`);
      }

      // Show config for slider fields
      if (step.type === 'slider' && step.config) {
        console.log(`   Config:`, JSON.stringify(step.config, null, 4));
        if (step.config.ticks) {
          console.log(`   Ticks (${step.config.ticks.length}):`);
          step.config.ticks.forEach((tick, tickIndex) => {
            console.log(`     ${tickIndex + 1}. value: "${tick.value}" -> label: "${tick.label}"`);
          });
        }
      }
    });

    // Test with the exact form data from the generation (but without extra quotes)
    const testFormData = {
      age: "23",
      venue: "home kitchen",
      gender: "female",
      lavaFoodItem: "lava spoonful of honey",
      asmrSoundStyle: "bubbling",
      eatingExpression: "absolutely_loving_it"
    };

    console.log(`\n🧪 Testing generateTagDisplayData with clean form data:`);
    console.log(JSON.stringify(testFormData, null, 2));

    const tagDisplayData = await generateTagDisplayData(recipe, testFormData);
    
    console.log(`\n📊 Result tagDisplayData:`);
    Object.entries(tagDisplayData).forEach(([key, data]) => {
      console.log(`  ${key}: "${data.value}"`);
    });

    // Test with the quoted form data to see what happens
    const quotedFormData = {
      age: "\"23\"",
      venue: "\"home kitchen\"",
      gender: "\"female\"",
      lavaFoodItem: "\"lava spoonful of honey\"",
      asmrSoundStyle: "\"bubbling\"",
      eatingExpression: "\"absolutely_loving_it\""
    };

    console.log(`\n🧪 Testing generateTagDisplayData with quoted form data:`);
    console.log(JSON.stringify(quotedFormData, null, 2));

    const quotedTagDisplayData = await generateTagDisplayData(recipe, quotedFormData);
    
    console.log(`\n📊 Result tagDisplayData (with quotes):`);
    Object.entries(quotedTagDisplayData).forEach(([key, data]) => {
      console.log(`  ${key}: "${data.value}"`);
    });

  } catch (error) {
    console.error('❌ Error debugging Lava Food recipe:', error);
  }
}

debugLavaFoodRecipe().catch(console.error); 