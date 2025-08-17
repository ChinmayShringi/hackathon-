#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../server/db';
import { recipeOptionTagIcons } from '../shared/schema';

async function verifyTagIcons() {
  console.log('🔍 Verifying recipe_option_tag_icon table contents...');

  try {
    // Check if table exists and get all records using Drizzle
    const results = await db
      .select({
        id: recipeOptionTagIcons.id,
        display: recipeOptionTagIcons.display,
        icon: recipeOptionTagIcons.icon,
        color: recipeOptionTagIcons.color
      })
      .from(recipeOptionTagIcons)
      .orderBy(recipeOptionTagIcons.id);

    if (results.length === 0) {
      console.log('❌ No records found in recipe_option_tag_icon table');
      return;
    }

    console.log(`✅ Found ${results.length} icon mappings:`);
    console.log('');

    results.forEach((row) => {
      const colorText = row.color ? ` (color: ${row.color})` : ' (no color override)';
      console.log(`  ${row.id} -> ${row.icon}${colorText}`);
    });

    console.log('');
    console.log('📋 Summary:');
    console.log(`  Total mappings: ${results.length}`);
    console.log(`  With color override: ${results.filter((r) => r.color).length}`);
    console.log(`  Without color override: ${results.filter((r) => !r.color).length}`);

  } catch (error) {
    console.error('❌ Error verifying tag icons:', error);
    
    // Check if table doesn't exist
    if (error instanceof Error && error.message.includes('relation "recipe_option_tag_icon" does not exist')) {
      console.log('');
      console.log('💡 The table does not exist yet. You may need to:');
      console.log('   1. Create the table schema');
      console.log('   2. Run the migration');
      console.log('   3. Then run the seed script again');
    }
  } finally {
    await db.$client.end();
  }
}

verifyTagIcons().catch(console.error); 