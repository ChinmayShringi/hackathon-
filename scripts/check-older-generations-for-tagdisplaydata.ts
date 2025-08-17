#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../server/db';
import { generations } from '../shared/schema';
import { desc, and, eq } from 'drizzle-orm';

async function checkOlderGenerationsForTagDisplayData() {
  console.log('🔍 Checking older generations for tagDisplayData...\n');

  try {
    // Get generations with tagDisplayData
    const generationsWithTagDisplayData = await db
      .select({
        id: generations.id,
        shortId: generations.shortId,
        status: generations.status,
        recipeTitle: generations.recipeTitle,
        metadata: generations.metadata,
        createdAt: generations.createdAt
      })
      .from(generations)
      .where(
        and(
          eq(generations.status, 'completed'),
          // Check if metadata contains tagDisplayData
          // This is a simplified check - we'll filter in JS
        )
      )
      .orderBy(desc(generations.id))
      .limit(20);

    console.log(`📊 Found ${generationsWithTagDisplayData.length} recent completed generations`);

    // Filter for those with tagDisplayData
    const withTagDisplayData = generationsWithTagDisplayData.filter(gen => {
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
    }

    // Check for generations with formData but no tagDisplayData
    const withFormDataOnly = generationsWithTagDisplayData.filter(gen => {
      const metadata = gen.metadata as any;
      return metadata?.formData && 
             Object.keys(metadata.formData).length > 0 && 
             (!metadata.tagDisplayData || Object.keys(metadata.tagDisplayData).length === 0);
    });

    console.log(`\n📝 Generations with formData only: ${withFormDataOnly.length}`);

    if (withFormDataOnly.length > 0) {
      console.log('\n📋 Sample generations with formData only:');
      withFormDataOnly.slice(0, 3).forEach((gen, index) => {
        console.log(`\n=== Generation ${index + 1} ===`);
        console.log(`ID: ${gen.id}`);
        console.log(`Short ID: ${gen.shortId || 'N/A'}`);
        console.log(`Recipe: ${gen.recipeTitle || 'N/A'}`);
        console.log(`Created: ${gen.createdAt}`);
        
        const metadata = gen.metadata as any;
        console.log('FormData:');
        Object.entries(metadata.formData).forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`);
        });
      });
    }

    // Find the transition point
    if (withTagDisplayData.length > 0 && withFormDataOnly.length > 0) {
      const oldestWithTagDisplayData = withTagDisplayData[withTagDisplayData.length - 1];
      const newestWithFormDataOnly = withFormDataOnly[0];
      
      console.log('\n🕐 Transition Analysis:');
      console.log(`Oldest generation with tagDisplayData: ID ${oldestWithTagDisplayData.id} (${oldestWithTagDisplayData.createdAt})`);
      console.log(`Newest generation with formData only: ID ${newestWithFormDataOnly.id} (${newestWithFormDataOnly.createdAt})`);
      
      if (oldestWithTagDisplayData.id > newestWithFormDataOnly.id) {
        console.log('✅ The transition appears to be recent - newer generations have tagDisplayData');
      } else {
        console.log('❌ The transition appears to be older - newer generations are missing tagDisplayData');
      }
    }

  } catch (error) {
    console.error('❌ Error checking older generations:', error);
  } finally {
    await db.$client.end();
  }
}

checkOlderGenerationsForTagDisplayData(); 