#!/usr/bin/env tsx

import 'dotenv/config';
import { Pool } from 'pg';

async function checkAndFixIndexes() {
  console.log('🔍 Checking and fixing database indexes...\n');

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    // Check all indexes on the generations table
    console.log('1. Checking all indexes on generations table:');
    const indexResult = await pool.query(`
      SELECT 
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE tablename = 'generations'
      AND schemaname = 'public'
      ORDER BY indexname
    `);

    console.log(`   Found ${indexResult.rows.length} indexes:`);
    indexResult.rows.forEach((row: any) => {
      console.log(`   - ${row.indexname}: ${row.indexdef}`);
    });

    // Check for duplicate index names
    const duplicateNames = indexResult.rows
      .map((row: any) => row.indexname)
      .filter((name: string, index: number, arr: string[]) => arr.indexOf(name) !== index);

    if (duplicateNames.length > 0) {
      console.log(`\n⚠️  Found duplicate index names: ${duplicateNames.join(', ')}`);
    } else {
      console.log('\n✅ No duplicate index names found');
    }

    // Check for indexes that might conflict with our new names
    const existingIndexes = indexResult.rows.map((row: any) => row.indexname);
    const newIndexNames = ['idx_generations_user_pagination', 'idx_generations_user_stats'];
    
    const conflicts = newIndexNames.filter(name => existingIndexes.includes(name));
    
    if (conflicts.length > 0) {
      console.log(`\n⚠️  Found conflicting index names: ${conflicts.join(', ')}`);
      
      // Drop conflicting indexes
      console.log('\n2. Dropping conflicting indexes...');
      for (const indexName of conflicts) {
        try {
          await pool.query(`DROP INDEX IF EXISTS ${indexName}`);
          console.log(`   ✅ Dropped ${indexName}`);
        } catch (error) {
          console.log(`   ❌ Error dropping ${indexName}: ${error}`);
        }
      }
    }

    // Create new indexes with unique names
    console.log('\n3. Creating new indexes...');
    
    try {
      // Create generic user pagination index
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_generations_user_pagination_new 
        ON generations (user_id, created_at DESC)
      `);
      console.log('   ✅ Created idx_generations_user_pagination_new');

      // Create generic user stats index
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_generations_user_stats_new 
        ON generations (user_id, status, created_at DESC)
      `);
      console.log('   ✅ Created idx_generations_user_stats_new');

    } catch (error) {
      console.log(`   ❌ Error creating indexes: ${error}`);
    }

    // Verify final state
    console.log('\n4. Verifying final index state:');
    const finalIndexResult = await pool.query(`
      SELECT 
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE tablename = 'generations'
      AND schemaname = 'public'
      ORDER BY indexname
    `);

    console.log(`   Final index count: ${finalIndexResult.rows.length}`);
    finalIndexResult.rows.forEach((row: any) => {
      console.log(`   - ${row.indexname}`);
    });

    console.log('\n✅ Index check and fix completed!');

  } catch (error) {
    console.error('❌ Error checking indexes:', error);
  } finally {
    await pool.end();
  }
}

checkAndFixIndexes().catch(console.error); 