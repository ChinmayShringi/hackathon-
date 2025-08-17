#!/usr/bin/env tsx

import './_setup-env.ts';
import { db } from '../server/db.ts';
import { generations } from '../shared/schema.ts';
import { eq } from 'drizzle-orm';

async function debugGeneration() {
  console.log('🔍 Debugging generation access...\n');

  try {
    // Check generation 82
    const generation = await db
      .select({
        id: generations.id,
        shortId: generations.shortId,
        metadata: generations.metadata,
        userId: generations.userId,
        createdAt: generations.createdAt
      })
      .from(generations)
      .where(eq(generations.id, 82))
      .limit(1);

    if (generation.length === 0) {
      console.log('❌ Generation 82 not found');
      return;
    }

    const gen = generation[0];
    console.log('📊 Generation 82 details:');
    console.log(`  ID: ${gen.id}`);
    console.log(`  Short ID: ${gen.shortId}`);
    console.log(`  User ID: ${gen.userId}`);
    console.log(`  Created: ${gen.createdAt}`);
    console.log(`  Metadata:`, gen.metadata);

    // Check by short ID
    const generationByShortId = await db
      .select({
        id: generations.id,
        shortId: generations.shortId,
        metadata: generations.metadata,
        userId: generations.userId
      })
      .from(generations)
      .where(eq(generations.shortId, 'eFiCy59_MVb'))
      .limit(1);

    if (generationByShortId.length === 0) {
      console.log('\n❌ Generation with short ID eFiCy59_MVb not found');
    } else {
      console.log('\n✅ Generation found by short ID:');
      console.log(`  ID: ${generationByShortId[0].id}`);
      console.log(`  Short ID: ${generationByShortId[0].shortId}`);
      console.log(`  User ID: ${generationByShortId[0].userId}`);
      console.log(`  Metadata:`, generationByShortId[0].metadata);
    }

    // Check all guest generations
    const guestGenerations = await db
      .select({
        id: generations.id,
        shortId: generations.shortId,
        metadata: generations.metadata
      })
      .from(generations)
      .where(eq(generations.userId, 'guest_user'))
      .limit(5);

    console.log('\n📋 Recent guest generations:');
    guestGenerations.forEach(gen => {
      const metadata = gen.metadata as any;
      console.log(`  ID: ${gen.id}, Short ID: ${gen.shortId}, Session ID: ${metadata?.sessionId || 'N/A'}`);
    });

  } catch (error) {
    console.error('❌ Error debugging generation:', error);
  } finally {
    await db.$client.end();
  }
}

debugGeneration(); 