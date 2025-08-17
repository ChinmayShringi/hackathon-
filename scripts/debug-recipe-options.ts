#!/usr/bin/env tsx

import 'dotenv/config';
import { storage } from '../server/storage';
import { generateTagDisplayData } from '../server/recipe-processor';

async function debugRecipeOptions() {
  console.log('🔍 Debugging recipe options for pretty names...\n');

  try {
    // Check the Cat Olympic Diving recipe specifically
    const recipe = await storage.getRecipeBySlug('cat-olympic-diving');
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

    // Test with the exact form data from the recent generation
    const testFormData = {
      age: "23",
      breed: "bengal",
      venue: "home kitchen",
      gender: "female",
      weight: "3",
      attitude: "sophisticated and poised",
      soundStyle: "stadium cheering",
      divingStyle: "twisting dive",
      waterEntryStyle: "meteoric"
    };

    console.log(`\n🧪 Testing generateTagDisplayData with form data:`);
    console.log(JSON.stringify(testFormData, null, 2));

    const tagDisplayData = await generateTagDisplayData(recipe, testFormData);
    
    console.log(`\n📊 Result tagDisplayData:`);
    Object.entries(tagDisplayData).forEach(([key, data]) => {
      console.log(`  ${key}: "${data.value}"`);
    });

    // Check specific fields that should have pretty names
    console.log(`\n🔍 Specific field analysis:`);
    
    // Find the weight step
    const weightStep = recipe.recipeSteps.find(step => step.id === 'weight');
    if (weightStep) {
      console.log(`Weight step: ${weightStep.label} (${weightStep.id})`);
      console.log(`Form value: "${testFormData.weight}"`);
      console.log(`Step type: ${weightStep.type}`);
      console.log(`Step config:`, JSON.stringify(weightStep.config, null, 2));
      
      if (weightStep.options) {
        const matchingOption = weightStep.options.find(opt => opt.value === testFormData.weight);
        if (matchingOption) {
          console.log(`✅ Found matching option: "${matchingOption.value}" -> "${matchingOption.label}"`);
        } else {
          console.log(`❌ No matching option found for value "${testFormData.weight}"`);
          console.log(`Available options:`);
          weightStep.options.forEach(opt => {
            console.log(`  "${opt.value}" -> "${opt.label}"`);
          });
        }
      }

      if (weightStep.config?.ticks) {
        const matchingTick = weightStep.config.ticks.find(tick => tick.value.toString() === testFormData.weight);
        if (matchingTick) {
          console.log(`✅ Found matching tick: "${matchingTick.value}" -> "${matchingTick.label}"`);
        } else {
          console.log(`❌ No matching tick found for value "${testFormData.weight}"`);
          console.log(`Available ticks:`);
          weightStep.config.ticks.forEach(tick => {
            console.log(`  "${tick.value}" -> "${tick.label}"`);
          });
        }
      }
    }

    // Find the attitude step
    const attitudeStep = recipe.recipeSteps.find(step => step.id === 'attitude');
    if (attitudeStep) {
      console.log(`\nAttitude step: ${attitudeStep.label} (${attitudeStep.id})`);
      console.log(`Form value: "${testFormData.attitude}"`);
      if (attitudeStep.options) {
        const matchingOption = attitudeStep.options.find(opt => opt.value === testFormData.attitude);
        if (matchingOption) {
          console.log(`✅ Found matching option: "${matchingOption.value}" -> "${matchingOption.label}"`);
        } else {
          console.log(`❌ No matching option found for value "${testFormData.attitude}"`);
          console.log(`Available options:`);
          attitudeStep.options.forEach(opt => {
            console.log(`  "${opt.value}" -> "${opt.label}"`);
          });
        }
      }
    }

  } catch (error) {
    console.error('❌ Error debugging recipe options:', error);
  }
}

debugRecipeOptions().catch(console.error); 