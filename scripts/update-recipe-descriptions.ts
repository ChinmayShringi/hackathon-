import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import { recipes } from '../migrations/schema';
import { eq } from 'drizzle-orm';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function updateRecipeDescriptions() {
  const updates = [
    {
      slug: 'lava-food-asmr',
      name: 'Lava Food ASMR',
      newDescription: 'Create bizarre, surreal, or funny scenes of people treating molten lava like everyday foods!'
    },
    {
      slug: 'based-ape-vlog',
      name: 'BASEd Ape Vlog',
      newDescription: 'Create a BASE-jumping Ape recording his Vlog & dropping social commentary as he parachutes over all sorts of terrain.'
    },
    {
      slug: 'cat-olympic-diving',
      name: 'Cat Olympic Diving',
      newDescription: 'Create thrilling or hilarious Olympic diving events featuring cats of every kind!'
    }
  ];

  for (const update of updates) {
    try {
      console.log(`🔄 Updating ${update.name} description...`);
      
      const result = await db
        .update(recipes)
        .set({
          description: update.newDescription
        })
        .where(eq(recipes.slug, update.slug))
        .returning();

      if (result.length > 0) {
        console.log(`✅ Successfully updated ${update.name}:`);
        console.log(`   Old: ${result[0].description}`);
        console.log(`   New: ${update.newDescription}`);
      } else {
        console.log(`❌ Recipe with slug '${update.slug}' not found`);
      }
    } catch (error) {
      console.error(`❌ Error updating ${update.name}:`, error);
    }
  }
}

updateRecipeDescriptions()
  .then(() => {
    console.log('\n🎉 Recipe description updates completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  }); 