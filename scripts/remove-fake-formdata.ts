#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../server/db';
import { generations } from '../shared/schema';
import { eq, and, isNotNull } from 'drizzle-orm';

async function removeFakeFormData() {
  console.log('🔍 Removing fake formData from completed guest generations...');

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

    // Build a map of recipeTitle -> Set of stringified formData from failed generations
    const failedFormDataMap = new Map<string, Set<string>>();
    failedGenerations.forEach(gen => {
      const metadata = gen.metadata as any;
      if (metadata?.formData && Object.keys(metadata.formData).length > 0 && gen.recipeTitle) {
        const key = gen.recipeTitle;
        const str = JSON.stringify(metadata.formData);
        if (!failedFormDataMap.has(key)) failedFormDataMap.set(key, new Set());
        failedFormDataMap.get(key)!.add(str);
      }
    });

    // Get all completed generations with non-empty formData
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
          eq(generations.status, 'completed'),
          isNotNull(generations.metadata)
        )
      );

    let updatedCount = 0;
    let skippedCount = 0;

    for (const gen of completedGenerations) {
      const metadata = gen.metadata as any;
      if (!metadata?.formData || Object.keys(metadata.formData).length === 0) {
        skippedCount++;
        continue;
      }
      if (!gen.recipeTitle) {
        skippedCount++;
        continue;
      }
      const strFormData = JSON.stringify(metadata.formData);
      const failedSet = failedFormDataMap.get(gen.recipeTitle);
      // If the formData matches any failed generation's formData for the same title, remove it
      if (failedSet && failedSet.has(strFormData)) {
        const updatedMetadata = { ...metadata, formData: {} };
        await db
          .update(generations)
          .set({ metadata: updatedMetadata, updatedAt: new Date() })
          .where(eq(generations.id, gen.id));
        updatedCount++;
        console.log(`🗑️ Removed fake formData from completed generation ${gen.id} (${gen.recipeTitle})`);
      } else {
        // Otherwise, keep it (could be real, but this is rare for this dataset)
        skippedCount++;
      }
    }

    console.log(`\n🎉 Removal complete!`);
    console.log(`🗑️ Updated: ${updatedCount} generations`);
    console.log(`✅ Skipped: ${skippedCount} generations (no formData or not matching failed)`);

    // Final verification
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
  } catch (error) {
    console.error('❌ Error during fake formData removal:', error);
  } finally {
    await db.$client.end();
  }
}

removeFakeFormData().catch(console.error); 