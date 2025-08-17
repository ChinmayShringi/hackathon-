import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import { recipes } from '../migrations/schema';
import { eq, inArray } from 'drizzle-orm';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function verifyRecipeDescriptions() {
  const recipeSlugs = ['lava-food-asmr', 'based-ape-vlog', 'cat-olympic-diving'];
  
  try {
    console.log('🔍 Verifying updated recipe descriptions...\n');
    
    const result = await db
      .select({
        name: recipes.name,
        slug: recipes.slug,
        description: recipes.description
      })
      .from(recipes)
      .where(inArray(recipes.slug, recipeSlugs));

    if (result.length === 0) {
      console.log('❌ No recipes found');
      return;
    }

    result.forEach((recipe) => {
      console.log(`📝 ${recipe.name} (${recipe.slug}):`);
      console.log(`   "${recipe.description}"`);
      console.log('');
    });

    console.log('✅ Verification complete!');
  } catch (error) {
    console.error('❌ Error verifying recipes:', error);
  }
}

verifyRecipeDescriptions()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  }); 