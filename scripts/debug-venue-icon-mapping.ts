#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../server/db';
import { recipeOptionTagIcons, generations } from '../shared/schema';
import { eq, desc } from 'drizzle-orm';

async function debugVenueIconMapping() {
  console.log('🔍 Debugging Venue Icon Mapping Issue\n');

  try {
    // 1. Check the database directly for Venue mapping
    console.log('1. Checking database for Venue icon mapping:');
    const venueMapping = await db.select().from(recipeOptionTagIcons).where(eq(recipeOptionTagIcons.id, 'Venue'));
    console.log('Venue mapping from DB:', venueMapping);
    
    // Also check by display field
    const venueByDisplay = await db.select().from(recipeOptionTagIcons).where(eq(recipeOptionTagIcons.display, 'Venue'));
    console.log('Venue mapping by display field:', venueByDisplay);

    // 2. Get a recent generation with Venue tag to check what's in metadata
    console.log('\n2. Checking recent generations for Venue tag data:');
    const recentGenerations = await db.select().from(generations).where(eq(generations.userId, 'guest')).orderBy(desc(generations.createdAt)).limit(5);
    
    for (const gen of recentGenerations) {
      if (gen.metadata && typeof gen.metadata === 'object') {
        const metadata = gen.metadata as any;
        if (metadata.tagDisplayData && metadata.tagDisplayData.Venue) {
          console.log(`Generation ${gen.id} (${gen.shortId}):`);
          console.log('  tagDisplayData.Venue:', metadata.tagDisplayData.Venue);
          console.log('  formData:', metadata.formData);
          console.log('  recipeSteps:', metadata.recipeSteps);
        }
      }
    }

    // 3. Check what the API endpoint returns
    console.log('\n3. Checking API endpoint response:');
    const response = await fetch('http://localhost:5232/api/alpha/my-makes?page=1&per_page=5', {
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('API Response generations count:', data.generations?.length);
      
      for (const gen of data.generations || []) {
        if (gen.metadata?.tagDisplayData?.Venue) {
          console.log(`API Generation ${gen.id} (${gen.shortId}):`);
          console.log('  tagDisplayData.Venue:', gen.metadata.tagDisplayData.Venue);
        }
      }
    } else {
      console.log('API request failed:', response.status, response.statusText);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await db.$client.end();
  }
}

debugVenueIconMapping(); 