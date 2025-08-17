#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../server/db';
import { generations } from '../shared/schema';
import { eq, and, isNotNull } from 'drizzle-orm';

async function backfillFormData() {
  console.log('🔍 Backfilling formData for completed generations...');

  try {
    // Find all completed guest generations with empty formData
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
          eq(generations.status, 'completed'),
          isNotNull(generations.metadata)
        )
      )
      .orderBy(generations.createdAt);

    console.log(`📊 Found ${completedGenerations.length} completed guest generations`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const generation of completedGenerations) {
      const metadata = generation.metadata as any;
      
      // Check if formData is empty or missing
      const hasFormData = metadata?.formData && Object.keys(metadata.formData).length > 0;
      
      if (hasFormData) {
        console.log(`✅ Generation ${generation.id} already has formData, skipping`);
        skippedCount++;
        continue;
      }

      // Try to reconstruct formData from other metadata fields
      let reconstructedFormData = {};
      
      // Check for extractedVariables
      if (metadata?.extractedVariables && Object.keys(metadata.extractedVariables).length > 0) {
        reconstructedFormData = { ...metadata.extractedVariables };
        console.log(`📝 Reconstructing formData from extractedVariables for generation ${generation.id}`);
      }
      // Check for originalParameters (legacy field)
      else if (metadata?.originalParameters && Object.keys(metadata.originalParameters).length > 0) {
        reconstructedFormData = { ...metadata.originalParameters };
        console.log(`📝 Reconstructing formData from originalParameters for generation ${generation.id}`);
      }
      // Check for any other potential form data fields
      else if (metadata?.variables && Object.keys(metadata.variables).length > 0) {
        reconstructedFormData = { ...metadata.variables };
        console.log(`📝 Reconstructing formData from variables for generation ${generation.id}`);
      }
      else {
        console.log(`⚠️  No form data found for generation ${generation.id}, cannot reconstruct`);
        skippedCount++;
        continue;
      }

      // Update the generation with reconstructed formData
      const updatedMetadata = {
        ...metadata,
        formData: reconstructedFormData
      };

      await db
        .update(generations)
        .set({
          metadata: updatedMetadata,
          updatedAt: new Date()
        })
        .where(eq(generations.id, generation.id));

      updatedCount++;
      console.log(`✅ Updated generation ${generation.id} with reconstructed formData:`, reconstructedFormData);
    }

    console.log(`\n🎉 FormData backfill complete!`);
    console.log(`✅ Updated: ${updatedCount} generations`);
    console.log(`⚠️  Skipped: ${skippedCount} generations (already had formData or no data to reconstruct)`);

    // Verify the results
    const allCompletedAfter = await db
      .select({
        id: generations.id,
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
    console.error('❌ Error during formData backfill:', error);
  } finally {
    await db.$client.end();
  }
}

backfillFormData().catch(console.error); 