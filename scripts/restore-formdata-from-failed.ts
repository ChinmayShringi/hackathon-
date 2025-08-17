#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../server/db';
import { generations } from '../shared/schema';
import { eq, and, isNotNull } from 'drizzle-orm';

async function restoreFormDataFromFailed() {
  console.log('🔍 Restoring formData for completed generations from failed generations...');

  try {
    // Get all failed generations with formData
    const failedGenerations = await db
      .select({
        id: generations.id,
        recipeTitle: generations.recipeTitle,
        metadata: generations.metadata
      })
      .from(generations)
      .where(
        and(
          eq(generations.userId, 'guest_user'),
          eq(generations.status, 'failed'),
          isNotNull(generations.metadata)
        )
      );

    console.log(`📊 Found ${failedGenerations.length} failed generations with formData`);

    // Create a map of recipe titles to formData
    const formDataMap = new Map<string, any>();
    
    failedGenerations.forEach(gen => {
      const metadata = gen.metadata as any;
      if (metadata?.formData && Object.keys(metadata.formData).length > 0 && gen.recipeTitle) {
        formDataMap.set(gen.recipeTitle, metadata.formData);
        console.log(`📝 Found formData for "${gen.recipeTitle}":`, metadata.formData);
      }
    });

    // Get all completed generations with empty formData
    const completedGenerations = await db
      .select({
        id: generations.id,
        recipeTitle: generations.recipeTitle,
        metadata: generations.metadata
      })
      .from(generations)
      .where(
        and(
          eq(generations.userId, 'guest_user'),
          eq(generations.status, 'completed')
        )
      );

    console.log(`📊 Found ${completedGenerations.length} completed generations`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const generation of completedGenerations) {
      const metadata = generation.metadata as any;
      
      // Check if formData is already populated
      const hasFormData = metadata?.formData && Object.keys(metadata.formData).length > 0;
      
      if (hasFormData) {
        console.log(`✅ Generation ${generation.id} already has formData, skipping`);
        skippedCount++;
        continue;
      }

      // Try to find matching formData from failed generations
      if (!generation.recipeTitle) {
        console.log(`⚠️  No recipe title for generation ${generation.id}, skipping`);
        skippedCount++;
        continue;
      }
      
      const matchingFormData = formDataMap.get(generation.recipeTitle);
      
      if (!matchingFormData) {
        console.log(`⚠️  No formData found for "${generation.recipeTitle}", skipping generation ${generation.id}`);
        skippedCount++;
        continue;
      }

      // Update the generation with restored formData
      const updatedMetadata = {
        ...metadata,
        formData: matchingFormData
      };

      await db
        .update(generations)
        .set({
          metadata: updatedMetadata,
          updatedAt: new Date()
        })
        .where(eq(generations.id, generation.id));

      updatedCount++;
      console.log(`✅ Restored formData for generation ${generation.id} ("${generation.recipeTitle}"):`, matchingFormData);
    }

    console.log(`\n🎉 FormData restoration complete!`);
    console.log(`✅ Updated: ${updatedCount} generations`);
    console.log(`⚠️  Skipped: ${skippedCount} generations (already had formData or no matching failed generation)`);

    // Verify the results
    const allCompletedAfter = await db
      .select({
        id: generations.id,
        recipeTitle: generations.recipeTitle,
        metadata: generations.metadata
      })
      .from(generations)
      .where(
        and(
          eq(generations.userId, 'guest_user'),
          eq(generations.status, 'completed')
        )
      );

    const withFormData = allCompletedAfter.filter(gen => {
      const metadata = gen.metadata as any;
      return metadata?.formData && Object.keys(metadata.formData).length > 0;
    });

    const withoutFormData = allCompletedAfter.filter(gen => {
      const metadata = gen.metadata as any;
      return !metadata?.formData || Object.keys(metadata.formData).length === 0;
    });

    console.log(`\n📊 Final verification:`);
    console.log(`  ✅ With formData: ${withFormData.length}`);
    console.log(`  ❌ Without formData: ${withoutFormData.length}`);

    if (withFormData.length > 0) {
      console.log(`\n📝 Sample restored formData:`);
      withFormData.slice(0, 3).forEach(gen => {
        const metadata = gen.metadata as any;
        console.log(`  ${gen.recipeTitle}:`, metadata.formData);
      });
    }

  } catch (error) {
    console.error('❌ Error during formData restoration:', error);
  } finally {
    await db.$client.end();
  }
}

restoreFormDataFromFailed().catch(console.error); 