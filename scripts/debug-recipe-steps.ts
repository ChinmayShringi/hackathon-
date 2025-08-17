#!/usr/bin/env tsx

import 'dotenv/config';
import { storage } from '../server/storage';
import { generateTagDisplayData } from '../server/recipe-processor';

async function debugRecipeSteps() {
  console.log('🔍 Debugging recipe steps for tagDisplayData generation...\n');

  try {
    // Check the three alpha recipes
    const recipeSlugs = ['cat-olympic-diving', 'lava-food-asmr', 'based-ape-vlog'];
    
    for (const slug of recipeSlugs) {
      console.log(`\n=== Recipe: ${slug} ===`);
      
      const recipe = await storage.getRecipeBySlug(slug);
      if (!recipe) {
        console.log(`❌ Recipe not found: ${slug}`);
        continue;
      }

      console.log(`✅ Recipe found: ${recipe.name} (ID: ${recipe.id})`);
      
      if (!recipe.recipeSteps) {
        console.log('❌ No recipeSteps found');
        continue;
      }

      if (!Array.isArray(recipe.recipeSteps)) {
        console.log('❌ recipeSteps is not an array');
        continue;
      }

      console.log(`✅ RecipeSteps found: ${recipe.recipeSteps.length} steps`);
      
      // Show the steps
      recipe.recipeSteps.forEach((step, index) => {
        console.log(`  ${index + 1}. ${step.label} (${step.id}) - type: ${step.type}`);
        if (step.options) {
          console.log(`     Options: ${step.options.length} available`);
        }
      });

      // Test generateTagDisplayData with sample data
      console.log('\n🧪 Testing generateTagDisplayData:');
      
      // Create sample form data based on the recipe
      let sampleFormData: any = {};
      
      if (slug === 'cat-olympic-diving') {
        sampleFormData = {
          age: '1',
          breed: 'bengal',
          weight: '3',
          attitude: 'sophisticated and poised',
          soundStyle: 'stadium cheering',
          divingStyle: 'twisting dive',
          waterEntryStyle: 'meteoric'
        };
      } else if (slug === 'lava-food-asmr') {
        sampleFormData = {
          age: '23',
          venue: 'home kitchen',
          gender: 'female',
          lavaFoodItem: 'lava plate of food',
          asmrSoundStyle: 'dripping',
          eatingExpression: 'sophisticated_enjoyment'
        };
      } else if (slug === 'based-ape-vlog') {
        sampleFormData = {
          propInHand: 'microphone',
          epicSetting: 'small_airplane',
          fashionStyle: 'blazer_gold_chains',
          vloggingTopic: 'burning_daddys_money'
        };
      }

      console.log('Sample formData:', sampleFormData);
      
      try {
        const tagDisplayData = await generateTagDisplayData(recipe, sampleFormData);
        console.log('✅ generateTagDisplayData result:');
        console.log(JSON.stringify(tagDisplayData, null, 2));
        
        if (Object.keys(tagDisplayData).length === 0) {
          console.log('⚠️ Warning: tagDisplayData is empty!');
        } else {
          console.log(`✅ Generated ${Object.keys(tagDisplayData).length} tags`);
        }
      } catch (error) {
        console.error('❌ Error in generateTagDisplayData:', error);
      }
    }

  } catch (error) {
    console.error('❌ Error debugging recipe steps:', error);
  }
}

debugRecipeSteps(); 