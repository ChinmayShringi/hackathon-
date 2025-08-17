import { config } from 'dotenv';
config();

import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { recipes } from '../shared/schema';

async function checkRecipeWorkflows() {
  console.log('🔍 Checking recipe workflow configurations...\n');

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle({ client: pool });

  try {
    // Get all active recipes
    const activeRecipes = await db
      .select()
      .from(recipes)
      .where(eq(recipes.isActive, true))
      .orderBy(recipes.id);

    console.log(`Found ${activeRecipes.length} active recipes:\n`);

    for (const recipe of activeRecipes) {
      console.log(`📋 Recipe: "${recipe.name}" (ID: ${recipe.id})`);
      console.log(`   Active: ${recipe.isActive}`);
      console.log(`   Model: ${recipe.model}`);
      console.log(`   Workflow Type: ${recipe.workflowType}`);
      console.log(`   Credit Cost: ${recipe.creditCost}`);
      
      if (recipe.workflowComponents) {
        console.log(`   Workflow Components: ${JSON.stringify(recipe.workflowComponents, null, 2)}`);
      } else {
        console.log(`   Workflow Components: NULL/undefined`);
      }
      
      console.log(`   Prompt: ${recipe.prompt?.substring(0, 100)}...`);
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error checking recipe workflows:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

checkRecipeWorkflows().catch(console.error); 