#!/usr/bin/env tsx

import './_setup-env.ts';
import { db } from '../server/db.ts';
import { generations } from '../shared/schema.ts';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

async function testShortIdGeneration() {
  console.log('🧪 Testing short ID generation...\n');

  try {
    // Test 1: Check if existing generations have short IDs
    console.log('📊 Checking existing generations for short IDs...');
    const existingGenerations = await db
      .select({
        id: generations.id,
        shortId: generations.shortId,
        createdAt: generations.createdAt
      })
      .from(generations)
      .orderBy(generations.createdAt)
      .limit(10);

    console.log(`Found ${existingGenerations.length} recent generations:`);
    existingGenerations.forEach(gen => {
      console.log(`  ID: ${gen.id}, Short ID: ${gen.shortId || 'NULL'}, Created: ${gen.createdAt}`);
    });

    // Test 2: Check for duplicate short IDs
    console.log('\n🔍 Checking for duplicate short IDs...');
    const shortIdCounts = await db
      .select({
        shortId: generations.shortId,
        count: sql`count(*)`
      })
      .from(generations)
      .where(sql`short_id IS NOT NULL`)
      .groupBy(generations.shortId)
      .having(sql`count(*) > 1`);

    if (shortIdCounts.length > 0) {
      console.log('❌ Found duplicate short IDs:');
      shortIdCounts.forEach(item => {
        console.log(`  Short ID: ${item.shortId}, Count: ${item.count}`);
      });
    } else {
      console.log('✅ No duplicate short IDs found');
    }

    // Test 3: Check short ID format
    console.log('\n🔤 Checking short ID format...');
    const shortIds = await db
      .select({ shortId: generations.shortId })
      .from(generations)
      .where(sql`short_id IS NOT NULL`)
      .limit(20);

    const validFormat = /^[A-Za-z0-9_-]{11}$/;
    let allValid = true;

    shortIds.forEach(item => {
      if (item.shortId) {
        const isValid = validFormat.test(item.shortId);
        if (!isValid) {
          console.log(`❌ Invalid short ID format: ${item.shortId}`);
          allValid = false;
        }
      }
    });

    if (allValid) {
      console.log('✅ All short IDs have valid format (11 characters, A-Z, a-z, 0-9, -, _)');
    }

    // Test 4: Statistics
    console.log('\n📈 Short ID Statistics:');
    const totalGenerations = await db
      .select({ count: sql`count(*)` })
      .from(generations);
    
    const generationsWithShortId = await db
      .select({ count: sql`count(*)` })
      .from(generations)
      .where(sql`short_id IS NOT NULL`);

    console.log(`  Total generations: ${totalGenerations[0].count}`);
    console.log(`  Generations with short ID: ${generationsWithShortId[0].count}`);
    const totalCount = Number(totalGenerations[0].count);
    const shortIdCount = Number(generationsWithShortId[0].count);
    console.log(`  Coverage: ${((shortIdCount / totalCount) * 100).toFixed(1)}%`);

  } catch (error) {
    console.error('❌ Error testing short ID generation:', error);
  } finally {
    await db.$client.end();
  }
}

testShortIdGeneration(); 