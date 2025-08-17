#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../server/db';
import { generations } from '../shared/schema';
import { sql } from 'drizzle-orm';

async function checkActualUserIds() {
  console.log('🔍 Checking Actual User IDs in Generations Table\n');

  try {
    // Get all unique userId values
    const uniqueUserIds = await db
      .select({ userId: generations.userId })
      .from(generations)
      .groupBy(generations.userId);

    console.log('1. Unique userId values in generations table:');
    uniqueUserIds.forEach(({ userId }) => {
      console.log(`  "${userId}"`);
    });

    // Get count of generations for each userId
    console.log('\n2. Generation counts by userId:');
    for (const { userId } of uniqueUserIds) {
      const count = await db
        .select({ count: sql<number>`count(*)` })
        .from(generations)
        .where(sql`${generations.userId} = ${userId}`);
      
      console.log(`  "${userId}": ${count[0].count} generations`);
    }

    // Get a sample generation to see the structure
    console.log('\n3. Sample generation metadata:');
    const sampleGeneration = await db
      .select({
        id: generations.id,
        shortId: generations.shortId,
        userId: generations.userId,
        recipeTitle: generations.recipeTitle,
        metadata: generations.metadata,
        createdAt: generations.createdAt
      })
      .from(generations)
      .limit(1);

    if (sampleGeneration.length > 0) {
      const gen = sampleGeneration[0];
      console.log('  Sample generation:', {
        id: gen.id,
        shortId: gen.shortId,
        userId: gen.userId,
        recipeTitle: gen.recipeTitle,
        createdAt: gen.createdAt
      });
      
      const metadata = gen.metadata as any;
      if (metadata?.tagDisplayData) {
        console.log('  Has tagDisplayData:', Object.keys(metadata.tagDisplayData));
        if (metadata.tagDisplayData.Venue) {
          console.log('  Venue data:', metadata.tagDisplayData.Venue);
        }
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await db.$client.end();
  }
}

checkActualUserIds(); 