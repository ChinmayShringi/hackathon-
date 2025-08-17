#!/usr/bin/env tsx

import './_setup-env';
import { db } from '../server/db';
import { recipes } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function checkDbSchema() {
  console.log('🔍 Checking database schema for Lava Food ASMR recipe...');
  
  try {
    // Get the recipe from database
    const [recipe] = await db
      .select()
      .from(recipes)
      .where(eq(recipes.slug, 'lava-food-asmr'))
      .limit(1);

    if (!recipe) {
      console.error('❌ Lava Food ASMR recipe not found');
      process.exit(1);
    }

    console.log('📝 Recipe fields in database:');
    console.log(JSON.stringify(recipe, null, 2));

    // Check for video duration fields
    console.log('\n🔍 Checking for video duration fields:');
    console.log(`videoDuration: ${(recipe as any).videoDuration}`);
    console.log(`videoDuration2: ${(recipe as any).videoDuration2}`);
    
    // Check all fields that might be related to video
    const videoFields = Object.keys(recipe).filter(key => key.toLowerCase().includes('video'));
    console.log('\n📹 Video-related fields:', videoFields);

  } catch (error) {
    console.error('❌ Error checking database schema:', error);
    process.exit(1);
  }
}

checkDbSchema(); 