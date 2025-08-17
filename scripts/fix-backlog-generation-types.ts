#!/usr/bin/env tsx

import './_setup-env.ts';
import { db } from '../server/db.ts';
import { generations } from '../shared/schema.ts';
import { eq, ne } from 'drizzle-orm';

async function fixBacklogGenerationTypes() {
  console.log('🔧 Fixing backlog generation types to "video"...\n');
  
  try {
    // Get all generations
    const allGenerations = await db
      .select({
        id: generations.id,
        shortId: generations.shortId,
        status: generations.status,
        type: generations.type,
        videoUrl: generations.videoUrl,
        recipeTitle: generations.recipeTitle,
        metadata: generations.metadata
      })
      .from(generations);

    // Filter for those with request_origin = 'backlog' in metadata
    const backlogGenerations = allGenerations.filter(gen => {
      if (!gen.metadata) return false;
      const metadata = gen.metadata as any;
      return metadata.request_origin === 'backlog';
    });

    console.log(`📊 Found ${backlogGenerations.length} generations with request_origin = 'backlog'`);

    // Filter for those that are not already type 'video'
    const generationsToUpdate = backlogGenerations.filter(gen => gen.type !== 'video');

    console.log(`📊 Found ${generationsToUpdate.length} backlog generations that need type update`);

    if (generationsToUpdate.length === 0) {
      console.log('✅ All backlog generations already have correct type');
      return;
    }

    // Show what we're going to update
    console.log('\n📋 Generations to update:');
    generationsToUpdate.forEach(gen => {
      console.log(`   ID ${gen.id} (${gen.shortId}): ${gen.recipeTitle} - ${gen.type} → video`);
    });

    // Update each generation
    let updated = 0;
    for (const gen of generationsToUpdate) {
      try {
        await db.update(generations)
          .set({ type: 'video' })
          .where(eq(generations.id, gen.id));
        
        console.log(`✅ Updated generation ${gen.id} (${gen.shortId}) type to video`);
        updated++;
      } catch (error) {
        console.error(`❌ Failed to update generation ${gen.id}:`, error);
      }
    }

    console.log(`\n✅ Successfully updated ${updated} out of ${generationsToUpdate.length} generations`);

    // Show summary of all backlog generations after update
    console.log('\n📊 Summary of all backlog generations:');
    const updatedBacklogGenerations = allGenerations.filter(gen => {
      if (!gen.metadata) return false;
      const metadata = gen.metadata as any;
      return metadata.request_origin === 'backlog';
    });

    updatedBacklogGenerations.forEach(gen => {
      const hasVideo = gen.videoUrl ? '✅' : '❌';
      console.log(`   ID ${gen.id} (${gen.shortId}): ${gen.recipeTitle} - type: ${gen.type} - video: ${hasVideo}`);
    });

  } catch (error) {
    console.error('❌ Error fixing backlog generation types:', error);
  } finally {
    await db.$client.end();
  }
}

fixBacklogGenerationTypes(); 