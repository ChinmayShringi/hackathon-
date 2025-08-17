import { config } from 'dotenv';
config();

import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { generations } from '../shared/schema';

const SYSTEM_BACKLOG_USER_ID = 'system_backlog';

async function cleanupBacklogGenerations() {
  console.log('🧹 Cleaning up backlog generations...\n');

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle({ client: pool });

  try {
    // First, let's see what we have
    console.log('📊 Current backlog generations:');
    const currentGenerations = await db
      .select({
        id: generations.id,
        shortId: generations.shortId,
        recipeTitle: generations.recipeTitle,
        status: generations.status,
        createdAt: generations.createdAt
      })
      .from(generations)
      .where(eq(generations.userId, SYSTEM_BACKLOG_USER_ID))
      .orderBy(generations.createdAt);

    console.log(`Found ${currentGenerations.length} backlog generations:`);
    currentGenerations.forEach(gen => {
      console.log(`  ID: ${gen.id}, Status: ${gen.status}, Recipe: ${gen.recipeTitle}, Created: ${gen.createdAt}`);
    });

    if (currentGenerations.length === 0) {
      console.log('✅ No backlog generations to clean up');
      return;
    }

    // Delete all backlog generations
    console.log('\n🗑️ Deleting all backlog generations...');
    const deleteResult = await db
      .delete(generations)
      .where(eq(generations.userId, SYSTEM_BACKLOG_USER_ID));

    console.log(`✅ Deleted ${currentGenerations.length} backlog generations`);

    // Verify deletion
    const remainingGenerations = await db
      .select()
      .from(generations)
      .where(eq(generations.userId, SYSTEM_BACKLOG_USER_ID));

    if (remainingGenerations.length === 0) {
      console.log('✅ All backlog generations successfully deleted');
    } else {
      console.log(`⚠️ Warning: ${remainingGenerations.length} generations still remain`);
    }

  } catch (error) {
    console.error('❌ Error cleaning up backlog generations:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

cleanupBacklogGenerations().catch(console.error); 