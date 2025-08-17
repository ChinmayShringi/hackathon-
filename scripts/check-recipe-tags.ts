#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../server/db';
import { generations } from '../shared/schema';
import { eq, inArray } from 'drizzle-orm';

async function checkRecipeTags() {
  console.log('🔍 Checking recipe tags (formData) in generation metadata...');

  try {
    // Get all guest generations with different statuses
    const allGenerations = await db
      .select({
        id: generations.id,
        shortId: generations.shortId,
        status: generations.status,
        recipeTitle: generations.recipeTitle,
        metadata: generations.metadata,
        createdAt: generations.createdAt
      })
      .from(generations)
      .where(eq(generations.userId, 'guest_user'))
      .orderBy(generations.createdAt);

    console.log(`📊 Total guest generations found: ${allGenerations.length}`);

    // Group by status
    const byStatus = {
      pending: allGenerations.filter(g => g.status === 'pending'),
      processing: allGenerations.filter(g => g.status === 'processing'),
      completed: allGenerations.filter(g => g.status === 'completed'),
      failed: allGenerations.filter(g => g.status === 'failed')
    };

    console.log('\n📋 Generations by status:');
    Object.entries(byStatus).forEach(([status, gens]) => {
      console.log(`  ${status}: ${gens.length} generations`);
    });

    // Check metadata for each status
    console.log('\n🔍 Metadata analysis by status:');
    Object.entries(byStatus).forEach(([status, gens]) => {
      if (gens.length === 0) return;

      console.log(`\n${status.toUpperCase()} generations:`);
      
      const withFormData = gens.filter(gen => {
        const metadata = gen.metadata as any;
        return metadata && metadata.formData && Object.keys(metadata.formData).length > 0;
      });

      const withoutFormData = gens.filter(gen => {
        const metadata = gen.metadata as any;
        return !metadata || !metadata.formData || Object.keys(metadata.formData).length === 0;
      });

      console.log(`  ✅ With formData: ${withFormData.length}`);
      console.log(`  ❌ Without formData: ${withoutFormData.length}`);

      // Show sample metadata for each category
      if (withFormData.length > 0) {
        console.log(`  📝 Sample with formData:`);
        const sample = withFormData[0];
        const metadata = sample.metadata as any;
        console.log(`    ID: ${sample.id}, Title: ${sample.recipeTitle}`);
        console.log(`    formData:`, metadata.formData);
      }

      if (withoutFormData.length > 0) {
        console.log(`  📝 Sample without formData:`);
        const sample = withoutFormData[0];
        console.log(`    ID: ${sample.id}, Title: ${sample.recipeTitle}`);
        console.log(`    metadata:`, sample.metadata);
      }
    });

    // Check if there's a pattern - are older generations missing formData?
    console.log('\n📅 Checking for patterns by creation date...');
    const recentGenerations = allGenerations.slice(-10);
    console.log('Recent 10 generations:');
    recentGenerations.forEach(gen => {
      const metadata = gen.metadata as any;
      const hasFormData = metadata && metadata.formData && Object.keys(metadata.formData).length > 0;
      console.log(`  ${gen.createdAt?.toISOString().split('T')[0]} | ${gen.status} | ${gen.recipeTitle} | formData: ${hasFormData ? '✅' : '❌'}`);
    });

  } catch (error) {
    console.error('❌ Error checking recipe tags:', error);
  } finally {
    await db.$client.end();
  }
}

checkRecipeTags().catch(console.error); 