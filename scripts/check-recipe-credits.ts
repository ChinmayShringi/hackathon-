#!/usr/bin/env tsx

import './_setup-env';
import { db } from '../server/db';
import { recipes } from '../shared/schema';
import { eq, inArray } from 'drizzle-orm';

async function checkRecipeCredits() {
  console.log('🔍 Checking current credit costs for recipes...');
  
  const recipeSlugs = ['lava-food-asmr', 'based-ape-vlog', 'cat-olympic-diving'];
  
  try {
    const recipeResults = await db
      .select({
        id: recipes.id,
        name: recipes.name,
        slug: recipes.slug,
        creditCost: recipes.creditCost,
        generationType: recipes.generationType,
        workflowType: recipes.workflowType
      })
      .from(recipes)
      .where(inArray(recipes.slug, recipeSlugs));

    console.log('\n📊 Current Recipe Credit Costs:');
    console.log('================================');
    
    for (const recipe of recipeResults) {
      console.log(`${recipe.name} (${recipe.slug}):`);
      console.log(`  ID: ${recipe.id}`);
      console.log(`  Current Credit Cost: ${recipe.creditCost}`);
      console.log(`  Generation Type: ${recipe.generationType}`);
      console.log(`  Workflow Type: ${recipe.workflowType}`);
      console.log('');
    }

    // Check guest credit configuration
    console.log('👥 Guest Credit Configuration:');
    console.log('==============================');
    
    // Check the unified auth service for guest credit defaults
    const { UnifiedAuthService } = await import('../server/unified-auth');
    const authService = UnifiedAuthService.getInstance();
    
    // Check what the default guest credits would be
    console.log('Default ephemeral guest credits: 10 (from unified-auth.ts line 108)');
    console.log('Shared guest user credits: 1000 (from create-shared-guest.ts)');
    
    console.log('\n📝 Summary of Required Changes:');
    console.log('===============================');
    console.log('1. Lava Food ASMR: Change from 1 to 10 credits');
    console.log('2. BASEd Ape Vlog: Change from current to 15 credits');
    console.log('3. Cat Olympic Diving: Change from current to 15 credits');
    console.log('4. General guest starter credits: Change from 10 to 30 (in unified-auth.ts)');
    console.log('5. Leave shared_guest_user as is (1000 credits)');

  } catch (error) {
    console.error('❌ Error checking recipe credits:', error);
  }
}

checkRecipeCredits().catch(console.error); 