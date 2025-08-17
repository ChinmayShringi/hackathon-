import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import { tags, recipes } from '../shared/schema';
import { eq, inArray, and } from 'drizzle-orm';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function addTags() {
  try {
    // Remove any 'animals' tag
    await db.delete(tags).where(eq(tags.name, 'animals'));
    console.log("Removed any tag named 'animals'.");

    // Find all 'animal' tags
    const animalTags = await db.select().from(tags).where(eq(tags.name, 'animal'));
    if (animalTags.length > 1) {
      // Keep the one with the lowest ID
      const sorted = animalTags.sort((a, b) => a.id - b.id);
      const keepId = sorted[0].id;
      const removeIds = sorted.slice(1).map(t => t.id);
      // Update all recipes to use keepId in tagHighlights
      const allRecipes = await db.select().from(recipes);
      for (const recipe of allRecipes) {
        if (Array.isArray(recipe.tagHighlights) && recipe.tagHighlights.some((id: number) => removeIds.includes(id))) {
          const newHighlights = recipe.tagHighlights.map((id: number) => removeIds.includes(id) ? keepId : id);
          await db.update(recipes).set({ tagHighlights: newHighlights }).where(eq(recipes.id, recipe.id));
        }
      }
      // Delete duplicate 'animal' tags
      await db.delete(tags).where(and(eq(tags.name, 'animal'), inArray(tags.id, removeIds)));
      console.log(`Removed duplicate 'animal' tags with IDs: [${removeIds.join(', ')}], kept ID: ${keepId}`);
    } else {
      console.log('No duplicate "animal" tags found.');
    }

    // Get correct tag IDs for 'animal', 'athletic', 'commentary'
    const zooTagNames = ['animal', 'athletic', 'commentary'];
    const zooTags = await db.select().from(tags).where(inArray(tags.name, zooTagNames));
    const zooTagIds = zooTags.map(t => t.id);
    // Update the Zoo Olympics recipe to use these tags
    const recipeSlug = 'cat-olympic-diving';
    await db.update(recipes)
      .set({ tagHighlights: zooTagIds })
      .where(eq(recipes.slug, recipeSlug));
    console.log(`Updated recipe '${recipeSlug}' with tag highlights: [${zooTagIds.join(', ')}]`);

    console.log('Cleanup and update completed successfully!');
  } catch (error) {
    console.error('Error during tag cleanup/update:', error);
  } finally {
    await pool.end();
  }
}

addTags(); 