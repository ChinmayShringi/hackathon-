#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../server/db';
import { generations } from '../shared/schema';
import { desc } from 'drizzle-orm';

async function checkAllGenerationsForTagDisplayData() {
  console.log('🔍 Checking ALL generations for tagDisplayData...\n');

  try {
    // Get ALL generations
    const allGenerations = await db
      .select({
        id: generations.id,
        shortId: generations.shortId,
        status: generations.status,
        recipeTitle: generations.recipeTitle,
        metadata: generations.metadata,
        createdAt: generations.createdAt
      })
      .from(generations)
      .orderBy(desc(generations.id));

    console.log(`📊 Found ${allGenerations.length} total generations`);

    // Filter for those with tagDisplayData
    const withTagDisplayData = allGenerations.filter(gen => {
      const metadata = gen.metadata as any;
      return metadata?.tagDisplayData && Object.keys(metadata.tagDisplayData).length > 0;
    });

    console.log(`\n✅ Generations WITH tagDisplayData: ${withTagDisplayData.length}`);

    if (withTagDisplayData.length > 0) {
      console.log('\n📋 Sample generations with tagDisplayData:');
      withTagDisplayData.slice(0, 3).forEach((gen, index) => {
        console.log(`\n=== Generation ${index + 1} ===`);
        console.log(`ID: ${gen.id}`);
        console.log(`Short ID: ${gen.shortId || 'N/A'}`);
        console.log(`Recipe: ${gen.recipeTitle || 'N/A'}`);
        console.log(`Created: ${gen.createdAt}`);
        
        const metadata = gen.metadata as any;
        console.log('TagDisplayData:');
        Object.entries(metadata.tagDisplayData).forEach(([key, data]) => {
          const tagData = data as any;
          console.log(`  ${key}:`);
          console.log(`    Value: ${tagData.value}`);
          console.log(`    Icon: ${tagData.icon || '❌ MISSING'}`);
          console.log(`    Color: ${tagData.color || '❌ MISSING'}`);
        });
      });

      // Find the newest generation with tagDisplayData
      const newestWithTagDisplayData = withTagDisplayData[0];
      console.log(`\n🕐 Newest generation with tagDisplayData: ID ${newestWithTagDisplayData.id} (${newestWithTagDisplayData.createdAt})`);
    }

    // Check for generations with formData
    const withFormData = allGenerations.filter(gen => {
      const metadata = gen.metadata as any;
      return metadata?.formData && Object.keys(metadata.formData).length > 0;
    });

    console.log(`\n📝 Generations with formData: ${withFormData.length}`);

    if (withFormData.length > 0) {
      // Find the oldest generation with formData
      const oldestWithFormData = withFormData[withFormData.length - 1];
      console.log(`🕐 Oldest generation with formData: ID ${oldestWithFormData.id} (${oldestWithFormData.createdAt})`);
    }

    // Check for generations with neither
    const withNeither = allGenerations.filter(gen => {
      const metadata = gen.metadata as any;
      return (!metadata?.tagDisplayData || Object.keys(metadata.tagDisplayData || {}).length === 0) &&
             (!metadata?.formData || Object.keys(metadata.formData || {}).length === 0);
    });

    console.log(`\n❌ Generations with neither tagDisplayData nor formData: ${withNeither.length}`);

    if (withNeither.length > 0) {
      console.log('\n📋 Sample generations with neither:');
      withNeither.slice(0, 3).forEach((gen, index) => {
        console.log(`\n=== Generation ${index + 1} ===`);
        console.log(`ID: ${gen.id}`);
        console.log(`Short ID: ${gen.shortId || 'N/A'}`);
        console.log(`Recipe: ${gen.recipeTitle || 'N/A'}`);
        console.log(`Created: ${gen.createdAt}`);
        console.log(`Status: ${gen.status}`);
        
        const metadata = gen.metadata as any;
        if (metadata) {
          console.log('Available metadata keys:', Object.keys(metadata));
        } else {
          console.log('No metadata at all');
        }
      });
    }

    // Summary
    console.log('\n📊 SUMMARY:');
    console.log(`Total generations: ${allGenerations.length}`);
    console.log(`With tagDisplayData: ${withTagDisplayData.length} (${((withTagDisplayData.length / allGenerations.length) * 100).toFixed(1)}%)`);
    console.log(`With formData: ${withFormData.length} (${((withFormData.length / allGenerations.length) * 100).toFixed(1)}%)`);
    console.log(`With neither: ${withNeither.length} (${((withNeither.length / allGenerations.length) * 100).toFixed(1)}%)`);

  } catch (error) {
    console.error('❌ Error checking all generations:', error);
  } finally {
    await db.$client.end();
  }
}

checkAllGenerationsForTagDisplayData(); 