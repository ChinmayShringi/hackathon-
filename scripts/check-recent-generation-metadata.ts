#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../server/db';
import { generations } from '../shared/schema';
import { desc } from 'drizzle-orm';

async function checkRecentGenerationMetadata() {
  console.log('🔍 Fetching most recent generation metadata...\n');

  try {
    // Get the most recent generation
    const recentGeneration = await db
      .select()
      .from(generations)
      .orderBy(desc(generations.createdAt))
      .limit(1);

    if (recentGeneration.length === 0) {
      console.log('❌ No generations found');
      return;
    }

    const generation = recentGeneration[0];
    const metadata = generation.metadata as any;

    console.log(`📊 Most Recent Generation:`);
    console.log(`   ID: ${generation.id}`);
    console.log(`   Short ID: ${generation.shortId}`);
    console.log(`   Recipe: ${generation.recipeTitle}`);
    console.log(`   Status: ${generation.status}`);
    console.log(`   User ID: ${generation.userId}`);
    console.log(`   Created: ${generation.createdAt}`);
    console.log(`   Updated: ${generation.updatedAt}`);

    console.log(`\n📋 Metadata Analysis:`);
    console.log(`   formData: ${metadata?.formData ? '✅ Present' : '❌ Missing'}`);
    console.log(`   tagDisplayData: ${metadata?.tagDisplayData ? '✅ Present' : '❌ Missing'}`);
    console.log(`   extractedVariables: ${metadata?.extractedVariables ? '✅ Present' : '❌ Missing'}`);
    console.log(`   workflowType: ${metadata?.workflowType ? '✅ Present' : '❌ Missing'}`);
    console.log(`   videoGeneration: ${metadata?.videoGeneration ? '✅ Present' : '❌ Missing'}`);
    console.log(`   request_origin: ${metadata?.request_origin ? '✅ Present' : '❌ Missing'}`);

    console.log(`\n🔍 Complete Metadata:`);
    console.log(JSON.stringify(metadata, null, 2));

    // Check if this is a backlog generation
    if (metadata?.request_origin === 'backlog') {
      console.log(`\n🎯 This appears to be a backlog generation!`);
      
      if (metadata?.tagDisplayData) {
        console.log(`\n🏷️  Tag Display Data:`);
        console.log(JSON.stringify(metadata.tagDisplayData, null, 2));
      }
      
      if (metadata?.formData) {
        console.log(`\n📝 Form Data:`);
        console.log(JSON.stringify(metadata.formData, null, 2));
      }
      
      if (metadata?.extractedVariables) {
        console.log(`\n🔧 Extracted Variables:`);
        console.log(JSON.stringify(metadata.extractedVariables, null, 2));
      }
    }

  } catch (error) {
    console.error('❌ Error fetching recent generation:', error);
    throw error;
  } finally {
    await db.$client.end();
  }
}

checkRecentGenerationMetadata().catch(console.error); 