#!/usr/bin/env tsx

import './_setup-env';
import { db } from '../server/db';
import { recipes } from '../shared/schema';
import { eq } from 'drizzle-orm';

const ALPHA_RECIPE_IDS = [1, 15, 16, 17, 18];

const newWorkflowComponent = [
  {
    type: 'text_to_video',
    model: 'veo3-fast',
    endpoint: 'fal-ai/veo3/fast',
    serviceId: 2
  }
];

async function fixAlphaRecipes() {
  console.log('🔧 Updating alpha recipes...');
  for (const id of ALPHA_RECIPE_IDS) {
    try {
      const [recipe] = await db.select().from(recipes).where(eq(recipes.id, id)).limit(1);
      if (!recipe) {
        console.warn(`Recipe ${id} not found.`);
        continue;
      }
      await db.update(recipes)
        .set({
          generationType: 'video',
          workflowType: 'text_to_video',
          workflow_components: JSON.stringify(newWorkflowComponent)
        })
        .where(eq(recipes.id, id));
      console.log(`✅ Updated recipe ${id} (${recipe.name})`);
    } catch (error) {
      console.error(`❌ Error updating recipe ${id}:`, error);
    }
  }
  console.log('🎉 All alpha recipes updated.');
}

fixAlphaRecipes().then(() => process.exit(0)); 