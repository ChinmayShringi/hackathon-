#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../server/db';
import { generations } from '../shared/schema';
import { eq, desc } from 'drizzle-orm';

async function checkLavaFoodGeneration() {
  console.log('🔍 Checking Lava Food ASMR generation metadata...\n');

  try {
    // Get the most recent Lava Food ASMR generation
    const lavaFoodGeneration = await db
      .select()
      .from(generations)
      .where(eq(generations.recipeTitle, 'Lava Food ASMR'))
      .orderBy(desc(generations.createdAt))
      .limit(1);

    if (lavaFoodGeneration.length === 0) {
      console.log('❌ No Lava Food ASMR generations found');
      return;
    }

    const generation = lavaFoodGeneration[0];
    const metadata = generation.metadata as any;

    console.log(`📊 Lava Food ASMR Generation:`);
    console.log(`   ID: ${generation.id}`);
    console.log(`   Short ID: ${generation.shortId}`);
    console.log(`   Status: ${generation.status}`);
    console.log(`   User ID: ${generation.userId}`);
    console.log(`   Created: ${generation.createdAt}`);

    console.log(`\n📋 Metadata Analysis:`);
    console.log(`   formData: ${metadata?.formData ? '✅ Present' : '❌ Missing'}`);
    console.log(`   tagDisplayData: ${metadata?.tagDisplayData ? '✅ Present' : '❌ Missing'}`);
    console.log(`   extractedVariables: ${metadata?.extractedVariables ? '✅ Present' : '❌ Missing'}`);

    if (metadata?.formData) {
      console.log(`\n📝 Form Data:`);
      console.log(JSON.stringify(metadata.formData, null, 2));
    }

    if (metadata?.tagDisplayData) {
      console.log(`\n🏷️  Tag Display Data:`);
      console.log(JSON.stringify(metadata.tagDisplayData, null, 2));
    }

    if (metadata?.extractedVariables) {
      console.log(`\n🔧 Extracted Variables:`);
      console.log(JSON.stringify(metadata.extractedVariables, null, 2));
    }

    // Check if this generation should have tagDisplayData
    if (metadata?.formData && (!metadata?.tagDisplayData || Object.keys(metadata.tagDisplayData).length === 0)) {
      console.log(`\n⚠️  This generation has formData but NO tagDisplayData!`);
      console.log(`   This is why the frontend is showing raw values.`);
    }

    // Check if tagDisplayData has pretty values
    if (metadata?.tagDisplayData) {
      console.log(`\n🔍 Tag Display Data Analysis:`);
      Object.entries(metadata.tagDisplayData).forEach(([key, data]) => {
        const tagData = data as any;
        console.log(`   ${key}: "${tagData.value}"`);
        
        // Check if this looks like a raw value or pretty name
        const isRawValue = tagData.value.includes('_') || 
                          tagData.value === tagData.value.toLowerCase() ||
                          /^\d+$/.test(tagData.value);
        
        if (isRawValue) {
          console.log(`     ⚠️  This looks like a raw value, not a pretty option name`);
        } else {
          console.log(`     ✅ This looks like a pretty option name`);
        }
      });
    }

  } catch (error) {
    console.error('❌ Error checking Lava Food generation:', error);
    throw error;
  } finally {
    await db.$client.end();
  }
}

checkLavaFoodGeneration().catch(console.error); 