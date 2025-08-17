import { config } from 'dotenv';
config();

import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, and } from 'drizzle-orm';
import { generations, recipes } from '../shared/schema';

const SYSTEM_BACKLOG_USER_ID = 'system_backlog';

async function fixBacklogMetadata() {
  console.log('🔧 Fixing backlog generation metadata...\n');

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle({ client: pool });

  try {
    // Get all backlog generations
    const backlogGenerations = await db
      .select({
        id: generations.id,
        shortId: generations.shortId,
        recipeId: generations.recipeId,
        recipeTitle: generations.recipeTitle,
        status: generations.status,
        falJobId: generations.falJobId,
        metadata: generations.metadata,
        createdAt: generations.createdAt
      })
      .from(generations)
      .where(eq(generations.userId, SYSTEM_BACKLOG_USER_ID))
      .orderBy(generations.createdAt);

    if (backlogGenerations.length === 0) {
      console.log('No backlog generations found.');
      return;
    }

    console.log(`Found ${backlogGenerations.length} backlog generations to fix.\n`);

    // Get all recipes to map recipe IDs to workflow components
    const allRecipes = await db
      .select({
        id: recipes.id,
        name: recipes.name,
        workflowComponents: recipes.workflowComponents,
        workflowType: recipes.workflowType
      })
      .from(recipes);

    const recipeMap = new Map(allRecipes.map(r => [r.id, r]));

    let fixedCount = 0;
    let skippedCount = 0;

    for (const gen of backlogGenerations) {
      console.log(`🎬 Processing generation ${gen.id} (${gen.shortId}):`);
      console.log(`   Recipe: ${gen.recipeTitle}`);
      console.log(`   Status: ${gen.status}`);
      console.log(`   FAL Job ID: ${gen.falJobId || 'None'}`);

      // Get the recipe for this generation
      const recipe = gen.recipeId ? recipeMap.get(gen.recipeId) : null;
      if (!recipe) {
        console.log(`   ❌ Recipe ${gen.recipeId} not found, skipping`);
        skippedCount++;
        continue;
      }

      // Check if recipe has workflow components
      if (!recipe.workflowComponents || !Array.isArray(recipe.workflowComponents)) {
        console.log(`   ⚠️  Recipe has no workflow components, skipping`);
        skippedCount++;
        continue;
      }

      // Find the endpoint from workflow components
      const textToVideoComponent = recipe.workflowComponents.find(
        (comp: any) => comp.type === 'text_to_video'
      );

      if (!textToVideoComponent || !textToVideoComponent.endpoint) {
        console.log(`   ⚠️  No text_to_video component found, skipping`);
        skippedCount++;
        continue;
      }

      const correctEndpoint = textToVideoComponent.endpoint;
      console.log(`   📍 Correct endpoint: ${correctEndpoint}`);

      // Check current metadata
      const currentMetadata = gen.metadata as any || {};
      const currentEndpoint = currentMetadata.endpoint;
      
      if (currentEndpoint === correctEndpoint) {
        console.log(`   ✅ Endpoint already correct: ${currentEndpoint}`);
        skippedCount++;
        continue;
      }

      console.log(`   🔄 Updating endpoint from "${currentEndpoint || 'MISSING'}" to "${correctEndpoint}"`);

      // Update the metadata with the correct endpoint
      const updatedMetadata = {
        ...currentMetadata,
        endpoint: correctEndpoint,
        model: textToVideoComponent.model || 'veo3-fast',
        serviceId: textToVideoComponent.serviceId
      };

      // Update the generation metadata
      await db
        .update(generations)
        .set({ metadata: updatedMetadata })
        .where(eq(generations.id, gen.id));

      console.log(`   ✅ Updated metadata for generation ${gen.id}`);
      fixedCount++;
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Fixed: ${fixedCount} generations`);
    console.log(`   Skipped: ${skippedCount} generations`);
    console.log(`   Total: ${backlogGenerations.length} generations`);

    if (fixedCount > 0) {
      console.log(`\n🎉 Successfully fixed ${fixedCount} backlog generation metadata!`);
      console.log(`   The polling system should now use the correct endpoints.`);
    } else {
      console.log(`\nℹ️  No generations needed fixing.`);
    }

  } catch (error) {
    console.error('Error fixing backlog metadata:', error);
  } finally {
    await pool.end();
  }
}

fixBacklogMetadata().catch(console.error); 