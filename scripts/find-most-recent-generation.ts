#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../server/db';
import { generations } from '../shared/schema';
import { desc } from 'drizzle-orm';

async function findMostRecentGeneration() {
  console.log('🔍 Finding Most Recent Generation\n');

  try {
    // Get the most recent generation
    const mostRecent = await db
      .select({
        id: generations.id,
        shortId: generations.shortId,
        userId: generations.userId,
        status: generations.status,
        recipeTitle: generations.recipeTitle,
        metadata: generations.metadata,
        createdAt: generations.createdAt,
        updatedAt: generations.updatedAt
      })
      .from(generations)
      .orderBy(desc(generations.createdAt))
      .limit(1);

    if (mostRecent.length === 0) {
      console.log('❌ No generations found');
      return;
    }

    const gen = mostRecent[0];
    console.log('📊 Most Recent Generation:');
    console.log(`  ID: ${gen.id}`);
    console.log(`  Short ID: ${gen.shortId}`);
    console.log(`  User ID: ${gen.userId}`);
    console.log(`  Status: ${gen.status}`);
    console.log(`  Recipe: ${gen.recipeTitle}`);
    console.log(`  Created: ${gen.createdAt?.toISOString()}`);
    console.log(`  Updated: ${gen.updatedAt?.toISOString()}`);

    // Analyze metadata
    const metadata = gen.metadata as any;
    console.log('\n📋 Metadata Analysis:');
    
    if (metadata?.tagDisplayData) {
      console.log('  ✅ Has tagDisplayData');
      console.log('  TagDisplayData keys:', Object.keys(metadata.tagDisplayData));
      
      // Check each tag for icon data
      for (const [key, data] of Object.entries(metadata.tagDisplayData)) {
        const tagData = data as any;
        console.log(`    ${key}:`);
        console.log(`      Value: ${tagData.value}`);
        console.log(`      Icon: ${tagData.icon || '❌ MISSING'}`);
        console.log(`      Color: ${tagData.color || '❌ MISSING'}`);
      }
    } else {
      console.log('  ❌ No tagDisplayData');
    }

    if (metadata?.formData) {
      console.log('  ✅ Has formData');
      console.log('  FormData:', metadata.formData);
    } else {
      console.log('  ❌ No formData');
    }

    if (metadata?.extractedVariables) {
      console.log('  ✅ Has extractedVariables');
      console.log('  ExtractedVariables:', metadata.extractedVariables);
    } else {
      console.log('  ❌ No extractedVariables');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await db.$client.end();
  }
}

findMostRecentGeneration(); 