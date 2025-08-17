#!/usr/bin/env tsx

import './_setup-env';
import { processRecipePrompt } from '../server/recipe-processor';
import { db } from '../server/db';
import { recipes } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function debugGorillaPrompt() {
  console.log('🔍 Debugging BASEd Ape Vlog prompt processing...');
  
  try {
    // Get the updated recipe
    const [recipe] = await db
      .select()
      .from(recipes)
      .where(eq(recipes.slug, 'based-ape-vlog'))
      .limit(1);

    if (!recipe) {
      console.error('❌ BASEd Ape Vlog recipe not found');
      process.exit(1);
    }

    console.log(`📝 Recipe: ${recipe.name} (ID: ${recipe.id})`);

    // Test with simple form data
    const formData = {
      fashionStyle: "tracksuit",
      epicSetting: "mountain_peaks",
      propInHand: "none",
      vloggingTopic: "crypto_riches"
    };

    console.log('\n📋 Form Data:', JSON.stringify(formData, null, 2));

    // Process the recipe with form data
    const result = processRecipePrompt(recipe, formData);
    
    console.log('\n📄 Raw Processed Prompt:');
    console.log('='.repeat(50));
    console.log(result.prompt);
    console.log('='.repeat(50));

    // Try to parse the JSON
    try {
      const parsedPrompt = JSON.parse(result.prompt);
      console.log('\n✅ Successfully parsed JSON prompt');
      console.log('\n📋 Parsed Prompt Structure:');
      console.log(JSON.stringify(parsedPrompt, null, 2));
    } catch (error) {
      console.error('\n❌ JSON parsing failed:', error.message);
      
      // Try to identify the issue
      const lines = result.prompt.split('\n');
      console.log('\n🔍 Line-by-line analysis:');
      lines.forEach((line, index) => {
        console.log(`${index + 1}: ${line}`);
      });
    }

  } catch (error) {
    console.error('❌ Error debugging prompt:', error);
    process.exit(1);
  }
}

debugGorillaPrompt(); 