#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../server/db';
import { generations } from '../shared/schema';
import { eq, and, isNotNull } from 'drizzle-orm';

async function debugCompletedMetadata() {
  console.log('🔍 Debugging metadata in completed generations...');

  try {
    // Get all completed guest generations
    const completedGenerations = await db
      .select({
        id: generations.id,
        shortId: generations.shortId,
        recipeTitle: generations.recipeTitle,
        metadata: generations.metadata,
        createdAt: generations.createdAt
      })
      .from(generations)
      .where(
        and(
          eq(generations.userId, 'guest_user'),
          eq(generations.status, 'completed')
        )
      )
      .orderBy(generations.createdAt);

    console.log(`📊 Found ${completedGenerations.length} completed guest generations`);

    // Analyze the first few generations in detail
    const sampleGenerations = completedGenerations.slice(0, 3);
    
    sampleGenerations.forEach((gen, index) => {
      console.log(`\n📋 Generation ${index + 1} (ID: ${gen.id}):`);
      console.log(`  Title: ${gen.recipeTitle}`);
      console.log(`  Created: ${gen.createdAt}`);
      console.log(`  Metadata keys:`, Object.keys(gen.metadata as any || {}));
      console.log(`  Full metadata:`, JSON.stringify(gen.metadata, null, 2));
    });

    // Check if there are any patterns in the metadata
    console.log('\n🔍 Analyzing metadata patterns...');
    
    const allMetadataKeys = new Set<string>();
    const metadataPatterns: Record<string, number> = {};
    
    completedGenerations.forEach(gen => {
      const metadata = gen.metadata as any || {};
      const keys = Object.keys(metadata);
      
      keys.forEach(key => {
        allMetadataKeys.add(key);
        metadataPatterns[key] = (metadataPatterns[key] || 0) + 1;
      });
    });

    console.log('\n📊 Metadata field frequency:');
    Object.entries(metadataPatterns)
      .sort(([,a], [,b]) => b - a)
      .forEach(([key, count]) => {
        console.log(`  ${key}: ${count}/${completedGenerations.length} generations`);
      });

    // Check if any generations have formData-like information
    console.log('\n🔍 Checking for formData-like information...');
    
    const formDataLikeFields = ['formData', 'extractedVariables', 'originalParameters', 'variables', 'parameters'];
    
    completedGenerations.forEach(gen => {
      const metadata = gen.metadata as any || {};
      const hasFormDataLike = formDataLikeFields.some(field => 
        metadata[field] && Object.keys(metadata[field]).length > 0
      );
      
      if (hasFormDataLike) {
        console.log(`✅ Generation ${gen.id} has formData-like information:`);
        formDataLikeFields.forEach(field => {
          if (metadata[field] && Object.keys(metadata[field]).length > 0) {
            console.log(`  ${field}:`, metadata[field]);
          }
        });
      } else {
        console.log(`❌ Generation ${gen.id} has no formData-like information`);
      }
    });

  } catch (error) {
    console.error('❌ Error debugging metadata:', error);
  } finally {
    await db.$client.end();
  }
}

debugCompletedMetadata().catch(console.error); 