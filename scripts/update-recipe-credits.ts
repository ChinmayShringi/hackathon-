#!/usr/bin/env tsx

import './_setup-env';
import { db } from '../server/db';
import { recipes } from '../shared/schema';
import { eq, inArray } from 'drizzle-orm';

async function updateRecipeCredits() {
  console.log('🔄 Updating recipe credit costs and guest starter credits...');
  
  try {
    // Update recipe credit costs
    const recipeUpdates = [
      { slug: 'lava-food-asmr', name: 'Lava Food ASMR', newCost: 10 },
      { slug: 'based-ape-vlog', name: 'BASEd Ape Vlog', newCost: 15 },
      { slug: 'cat-olympic-diving', name: 'Cat Olympic Diving', newCost: 15 }
    ];

    console.log('\n📝 Updating Recipe Credit Costs:');
    console.log('=================================');
    
    for (const update of recipeUpdates) {
      try {
        const result = await db
          .update(recipes)
          .set({ creditCost: update.newCost })
          .where(eq(recipes.slug, update.slug))
          .returning();

        if (result.length > 0) {
          console.log(`✅ ${update.name}: Updated to ${update.newCost} credits`);
        } else {
          console.log(`❌ ${update.name}: Recipe not found`);
        }
      } catch (error) {
        console.error(`❌ Error updating ${update.name}:`, error);
      }
    }

    // Update guest starter credits in unified-auth.ts
    console.log('\n👥 Updating Guest Starter Credits:');
    console.log('===================================');
    console.log('⚠️  Manual update required in server/unified-auth.ts');
    console.log('   Change line 108 from: credits: 10');
    console.log('   To: credits: 30');
    console.log('   (This requires a code edit, not a database update)');

    // Verify the changes
    console.log('\n🔍 Verifying Changes:');
    console.log('=====================');
    
    const recipeResults = await db
      .select({
        name: recipes.name,
        slug: recipes.slug,
        creditCost: recipes.creditCost
      })
      .from(recipes)
      .where(inArray(recipes.slug, ['lava-food-asmr', 'based-ape-vlog', 'cat-olympic-diving']));

    for (const recipe of recipeResults) {
      console.log(`${recipe.name}: ${recipe.creditCost} credits`);
    }

    console.log('\n✅ Recipe credit updates completed!');
    console.log('📝 Remember to manually update server/unified-auth.ts line 108 for guest starter credits');

  } catch (error) {
    console.error('❌ Error updating recipe credits:', error);
  }
}

updateRecipeCredits().catch(console.error); 