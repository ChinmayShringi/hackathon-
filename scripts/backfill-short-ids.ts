#!/usr/bin/env tsx

import './_setup-env.ts';
import { db } from '../server/db.ts';
import { generations } from '../shared/schema.ts';
import { eq, isNull } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

class ShortIdGenerator {
  private static readonly ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  
  /**
   * Generate a unique short ID with collision handling
   */
  static async generateUniqueShortId(maxRetries: number = 10): Promise<string> {
    const { customAlphabet } = await import('nanoid');
    const generateYoutubeId = customAlphabet(this.ALPHABET, 11);
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const shortId = generateYoutubeId();
        
        // Check if this short ID already exists
        const existing = await db
          .select({ id: generations.id })
          .from(generations)
          .where(eq(generations.shortId, shortId))
          .limit(1);
        
        if (existing.length === 0) {
          return shortId;
        }
        
        console.log(`Short ID collision detected on attempt ${attempt + 1}, retrying...`);
      } catch (error) {
        console.error(`Error generating short ID on attempt ${attempt + 1}:`, error);
        if (attempt === maxRetries - 1) {
          throw new Error('Failed to generate unique short ID after maximum retries');
        }
      }
    }
    
    throw new Error('Failed to generate unique short ID after maximum retries');
  }
}

async function backfillShortIds() {
  console.log('🔄 Starting short ID backfill process...\n');

  try {
    // Find all generations without short IDs
    const generationsWithoutShortId = await db
      .select({
        id: generations.id,
        createdAt: generations.createdAt,
        recipeTitle: generations.recipeTitle
      })
      .from(generations)
      .where(isNull(generations.shortId))
      .orderBy(generations.createdAt);

    console.log(`Found ${generationsWithoutShortId.length} generations without short IDs`);

    if (generationsWithoutShortId.length === 0) {
      console.log('✅ All generations already have short IDs!');
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    for (const generation of generationsWithoutShortId) {
      try {
        console.log(`Processing generation ${generation.id} (${generation.recipeTitle || 'Untitled'})...`);
        
        const shortId = await ShortIdGenerator.generateUniqueShortId();
        
        await db
          .update(generations)
          .set({ shortId })
          .where(eq(generations.id, generation.id));

        console.log(`  ✅ Generated short ID: ${shortId}`);
        successCount++;
        
        // Small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`  ❌ Error processing generation ${generation.id}:`, error);
        errorCount++;
      }
    }

    console.log('\n📊 Backfill Summary:');
    console.log(`  ✅ Successfully processed: ${successCount}`);
    console.log(`  ❌ Errors: ${errorCount}`);
    console.log(`  📈 Success rate: ${((successCount / (successCount + errorCount)) * 100).toFixed(1)}%`);

    // Verify the results
    console.log('\n🔍 Verifying results...');
    const remainingWithoutShortId = await db
      .select({ count: sql`count(*)` })
      .from(generations)
      .where(isNull(generations.shortId));

    console.log(`  Generations still without short ID: ${remainingWithoutShortId[0].count}`);

    if (remainingWithoutShortId[0].count === 0) {
      console.log('🎉 All generations now have short IDs!');
    }

  } catch (error) {
    console.error('❌ Error during backfill process:', error);
  } finally {
    await db.$client.end();
  }
}

backfillShortIds(); 