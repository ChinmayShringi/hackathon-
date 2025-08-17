#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../server/db';
import { generations } from '../shared/schema';
import { eq, and, isNotNull } from 'drizzle-orm';

async function verifyNoFormDataInCompleted() {
  console.log('🔍 Verifying that no completed guest generations have non-empty formData...');

  try {
    const completedWithFormData = await db
      .select({
        id: generations.id,
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
      );

    const withFormData = completedWithFormData.filter(gen => {
      const metadata = gen.metadata as any;
      return metadata?.formData && Object.keys(metadata.formData).length > 0;
    });

    if (withFormData.length === 0) {
      console.log('✅ No completed guest generations have non-empty formData.');
    } else {
      console.log(`❌ Found ${withFormData.length} completed guest generations with non-empty formData:`);
      withFormData.forEach(gen => {
        const metadata = gen.metadata as any;
        console.log(`  ID: ${gen.id}, Title: ${gen.recipeTitle}, Created: ${gen.createdAt}`);
        console.log(`    formData:`, metadata.formData);
      });
    }
  } catch (error) {
    console.error('❌ Error verifying completed generations:', error);
  } finally {
    await db.$client.end();
  }
}

verifyNoFormDataInCompleted().catch(console.error); 