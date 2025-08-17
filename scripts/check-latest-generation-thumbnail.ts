#!/usr/bin/env tsx

import './_setup-env.ts';
import { db } from '../server/db.ts';
import { generations } from '../shared/schema.ts';
import { eq } from 'drizzle-orm';

const targetShortId = 'rDev0sA15CM';

async function fixTypeAndShow() {
  console.log(`🔧 Setting type to 'video' for generation with shortId ${targetShortId}...`);
  try {
    // Update type to 'video'
    await db.update(generations)
      .set({ type: 'video' })
      .where(eq(generations.shortId, targetShortId));
    console.log('✅ Type updated.');
  } catch (error) {
    console.error('❌ Error updating type:', error);
  }

  // Show the updated record
  try {
    const rows = await db
      .select({
        id: generations.id,
        shortId: generations.shortId,
        status: generations.status,
        type: generations.type,
        videoUrl: generations.videoUrl,
        thumbnailUrl: generations.thumbnailUrl,
        recipeTitle: generations.recipeTitle,
        createdAt: generations.createdAt,
        metadata: generations.metadata
      })
      .from(generations)
      .where(eq(generations.shortId, targetShortId));

    if (!rows.length) {
      console.log(`❌ Generation with shortId ${targetShortId} not found`);
      return;
    }

    const gen = rows[0];
    console.log(`📊 Updated Generation Details:`);
    console.log(`   ID: ${gen.id} (${gen.shortId})`);
    console.log(`   Status: ${gen.status}`);
    console.log(`   Type: ${gen.type}`);
    console.log(`   Recipe Title: ${gen.recipeTitle}`);
    console.log(`   Created: ${gen.createdAt}`);
    console.log(`   Video URL: ${gen.videoUrl || 'NULL'}`);
    console.log(`   Thumbnail URL: ${gen.thumbnailUrl || 'NULL'}`);
  } catch (error) {
    console.error('❌ Error fetching updated generation:', error);
  } finally {
    await db.$client.end();
  }
}

fixTypeAndShow(); 