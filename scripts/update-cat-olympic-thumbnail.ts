#!/usr/bin/env tsx

import './_setup-env';
import { db } from '../server/db';
import { recipes } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function updateCatOlympicThumbnail() {
  console.log('🖼️  Restoring Cat Olympic Diving thumbnail path...');

  // Restore to the original path
  const originalThumbnailUrl = '/guest-olympics-preview-img.png';

  try {
    // Get the current recipe
    const [recipe] = await db
      .select()
      .from(recipes)
      .where(eq(recipes.slug, 'cat-olympic-diving'))
      .limit(1);

    if (!recipe) {
      console.error('❌ Cat Olympic Diving recipe not found');
      process.exit(1);
    }

    console.log(`📝 Recipe: ${recipe.name} (ID: ${recipe.id})`);
    console.log(`   Current Thumbnail: ${recipe.previewImageUrl || 'NOT SET'}`);
    console.log(`   Restoring Thumbnail: ${originalThumbnailUrl}`);

    // Update the recipe
    const updatedRecipe = await db
      .update(recipes)
      .set({
        previewImageUrl: originalThumbnailUrl
      })
      .where(eq(recipes.id, recipe.id))
      .returning();

    console.log('✅ Thumbnail path restored successfully!');
    console.log(`📸 Restored thumbnail URL: ${updatedRecipe[0].previewImageUrl}`);

  } catch (error) {
    console.error('❌ Error restoring thumbnail:', error);
    process.exit(1);
  }
}

updateCatOlympicThumbnail().catch(console.error); 