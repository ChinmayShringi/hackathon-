#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../server/db';
import { generations, recipeOptionTagIcons } from '../shared/schema';
import { eq, desc } from 'drizzle-orm';

async function checkGenerationDatesVsIcons() {
  console.log('🔍 Checking Generation Dates vs Icon Mappings\n');

  try {
    // Check when icon mappings were added
    console.log('1. Icon mapping creation dates:');
    const iconMappings = await db.select().from(recipeOptionTagIcons).orderBy(recipeOptionTagIcons.createdAt);
    iconMappings.forEach(mapping => {
      console.log(`  ${mapping.id}: ${mapping.createdAt?.toISOString()}`);
    });

    // Get recent generations and check their metadata
    console.log('\n2. Recent generations with tagDisplayData:');
    const recentGenerations = await db
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
      .orderBy(desc(generations.createdAt))
      .limit(10);

    for (const gen of recentGenerations) {
      const metadata = gen.metadata as any;
      const hasTagDisplayData = metadata?.tagDisplayData && Object.keys(metadata.tagDisplayData).length > 0;
      const venueData = metadata?.tagDisplayData?.Venue;
      const venueHasIcon = venueData?.icon;
      
      console.log(`\n  Generation ${gen.id} (${gen.shortId}):`);
      console.log(`    Created: ${gen.createdAt?.toISOString()}`);
      console.log(`    Recipe: ${gen.recipeTitle}`);
      console.log(`    Has tagDisplayData: ${hasTagDisplayData ? '✅' : '❌'}`);
      if (venueData) {
        console.log(`    Venue data:`, venueData);
        console.log(`    Venue has icon: ${venueHasIcon ? '✅' : '❌'}`);
      }
    }

    // Check if there's a pattern - are older generations missing tagDisplayData?
    console.log('\n3. Checking for patterns by creation date...');
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

    console.log(`Total guest generations: ${allGenerations.length}`);

    const withTagDisplayData = allGenerations.filter(gen => {
      const metadata = gen.metadata as any;
      return metadata?.tagDisplayData && Object.keys(metadata.tagDisplayData).length > 0;
    });

    const withoutTagDisplayData = allGenerations.filter(gen => {
      const metadata = gen.metadata as any;
      return !metadata?.tagDisplayData || Object.keys(metadata.tagDisplayData).length === 0;
    });

    console.log(`Generations with tagDisplayData: ${withTagDisplayData.length}`);
    console.log(`Generations without tagDisplayData: ${withoutTagDisplayData.length}`);

    if (withoutTagDisplayData.length > 0) {
      console.log('\n4. Sample generations without tagDisplayData:');
      withoutTagDisplayData.slice(0, 5).forEach(gen => {
        console.log(`  ${gen.createdAt?.toISOString().split('T')[0]} | ${gen.recipeTitle} | ${gen.shortId}`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await db.$client.end();
  }
}

checkGenerationDatesVsIcons(); 