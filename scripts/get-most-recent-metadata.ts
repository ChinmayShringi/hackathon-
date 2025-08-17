#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../server/db';
import { generations } from '../shared/schema';
import { desc } from 'drizzle-orm';

async function getMostRecentMetadata() {
  console.log('🔍 Finding Most Recent Generation Metadata\n');

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
        updatedAt: generations.updatedAt,
        type: generations.type,
        imageUrl: generations.imageUrl,
        videoUrl: generations.videoUrl,
        prompt: generations.prompt
      })
      .from(generations)
      .orderBy(desc(generations.createdAt))
      .limit(1);

    if (mostRecent.length === 0) {
      console.log('❌ No generations found');
      return;
    }

    const gen = mostRecent[0];
    console.log('📊 Most Recent Generation Details:');
    console.log(`  ID: ${gen.id}`);
    console.log(`  Short ID: ${gen.shortId}`);
    console.log(`  User ID: ${gen.userId}`);
    console.log(`  Status: ${gen.status}`);
    console.log(`  Type: ${gen.type}`);
    console.log(`  Recipe: ${gen.recipeTitle}`);
    console.log(`  Created: ${gen.createdAt}`);
    console.log(`  Updated: ${gen.updatedAt}`);
    console.log(`  Image URL: ${gen.imageUrl || 'N/A'}`);
    console.log(`  Video URL: ${gen.videoUrl || 'N/A'}`);
    console.log(`  Prompt: ${gen.prompt}`);

    // Display the metadata JSON object
    console.log('\n📋 Metadata JSON Object:');
    console.log('=' .repeat(80));
    
    if (gen.metadata) {
      console.log(JSON.stringify(gen.metadata, null, 2));
    } else {
      console.log('null');
    }
    
    console.log('=' .repeat(80));

    // Analyze metadata structure
    if (gen.metadata) {
      const metadata = gen.metadata as any;
      console.log('\n🔍 Metadata Analysis:');
      console.log(`  Total keys: ${Object.keys(metadata).length}`);
      console.log(`  Keys: ${Object.keys(metadata).join(', ')}`);
      
      // Check for common metadata fields
      const commonFields = [
        'formData', 'tagDisplayData', 'extractedVariables', 'generationType', 
        'workflowType', 'model', 'provider', 'sessionId', 'transferredToS3'
      ];
      
      console.log('\n📊 Common Fields Check:');
      commonFields.forEach(field => {
        const hasField = metadata.hasOwnProperty(field);
        const value = metadata[field];
        console.log(`  ${field}: ${hasField ? '✅' : '❌'} ${hasField ? `(${typeof value})` : ''}`);
        
        if (hasField && typeof value === 'object' && value !== null) {
          console.log(`    Keys: ${Object.keys(value).join(', ')}`);
        }
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await db.$client.end();
  }
}

// Run the script
getMostRecentMetadata().catch(console.error); 