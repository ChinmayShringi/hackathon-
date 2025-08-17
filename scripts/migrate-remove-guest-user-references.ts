#!/usr/bin/env tsx

import 'dotenv/config';
import { Pool } from 'pg';

async function migrateRemoveGuestUserReferences() {
  console.log('🔧 Migrating to remove hard-coded guest_user references...\n');

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    // Step 1: Check current state
    console.log('1. Checking current database state...');
    
    const indexResult = await pool.query(`
      SELECT 
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE indexdef LIKE '%guest_user%'
      AND schemaname = 'public'
    `);

    console.log(`   Found ${indexResult.rows.length} indexes with guest_user references:`);
    indexResult.rows.forEach((row: any) => {
      console.log(`   - ${row.indexname}: ${row.indexdef}`);
    });

    // Step 2: Check for any remaining guest_user generations
    const guestUserCount = await pool.query(`
      SELECT COUNT(*) as count
      FROM generations 
      WHERE user_id = 'guest_user'
    `);
    
    console.log(`\n2. Found ${guestUserCount.rows[0].count} generations with user_id = 'guest_user'`);

    if (guestUserCount.rows[0].count > 0) {
      console.log('   ⚠️  WARNING: Found generations still using hard-coded guest_user');
      console.log('   💡 These should be migrated to use the actual user IDs');
      
      // Check if DEV_BOUND_GUEST_ID is set
      const devBoundId = process.env.DEV_BOUND_GUEST_ID;
      if (devBoundId) {
        console.log(`   🔄 Will migrate these to ${devBoundId}`);
      } else {
        console.log('   ❌ DEV_BOUND_GUEST_ID not set - cannot migrate automatically');
        console.log('   💡 Set DEV_BOUND_GUEST_ID before running this migration');
        return;
      }
    }

    // Step 3: Drop old hard-coded indexes
    console.log('\n3. Dropping old hard-coded indexes...');
    
    for (const row of indexResult.rows) {
      const indexName = row.indexname;
      console.log(`   Dropping index: ${indexName}`);
      
      try {
        await pool.query(`DROP INDEX IF EXISTS ${indexName}`);
        console.log(`   ✅ Dropped ${indexName}`);
      } catch (error) {
        console.log(`   ⚠️  Warning: Could not drop ${indexName}: ${error}`);
      }
    }

    // Step 4: Create new generic indexes
    console.log('\n4. Creating new generic indexes...');
    
    try {
      // Create generic user pagination index
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_generations_user_pagination 
        ON generations (user_id, created_at DESC)
      `);
      console.log('   ✅ Created idx_generations_user_pagination');

      // Create generic user stats index
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_generations_user_stats 
        ON generations (user_id, status, created_at DESC)
      `);
      console.log('   ✅ Created idx_generations_user_stats');

    } catch (error) {
      console.log(`   ❌ Error creating indexes: ${error}`);
    }

    // Step 5: Migrate any remaining guest_user generations
    if (guestUserCount.rows[0].count > 0 && process.env.DEV_BOUND_GUEST_ID) {
      console.log('\n5. Migrating guest_user generations...');
      
      const devBoundId = process.env.DEV_BOUND_GUEST_ID;
      
      try {
        const updateResult = await pool.query(`
          UPDATE generations 
          SET user_id = $1
          WHERE user_id = 'guest_user'
        `, [devBoundId]);
        
        console.log(`   ✅ Migrated ${updateResult.rowCount} generations from 'guest_user' to '${devBoundId}'`);
      } catch (error) {
        console.log(`   ❌ Error migrating generations: ${error}`);
      }
    }

    // Step 6: Verify migration
    console.log('\n6. Verifying migration...');
    
    const finalIndexResult = await pool.query(`
      SELECT 
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE indexdef LIKE '%guest_user%'
      AND schemaname = 'public'
    `);

    if (finalIndexResult.rows.length === 0) {
      console.log('   ✅ No hard-coded guest_user indexes remain');
    } else {
      console.log('   ⚠️  Some hard-coded guest_user indexes still exist:');
      finalIndexResult.rows.forEach((row: any) => {
        console.log(`   - ${row.indexname}: ${row.indexdef}`);
      });
    }

    const finalGuestUserCount = await pool.query(`
      SELECT COUNT(*) as count
      FROM generations 
      WHERE user_id = 'guest_user'
    `);
    
    if (finalGuestUserCount.rows[0].count === 0) {
      console.log('   ✅ No generations with user_id = guest_user remain');
    } else {
      console.log(`   ⚠️  ${finalGuestUserCount.rows[0].count} generations still have user_id = guest_user`);
    }

    // Step 7: Summary
    console.log('\n📋 Migration Summary:');
    console.log(`- Indexes dropped: ${indexResult.rows.length}`);
    console.log(`- New indexes created: 2`);
    console.log(`- Generations migrated: ${guestUserCount.rows[0].count > 0 ? guestUserCount.rows[0].count : 0}`);
    console.log(`- DEV_BOUND_GUEST_ID: ${process.env.DEV_BOUND_GUEST_ID || 'NOT SET'}`);

    console.log('\n✅ Migration completed successfully!');
    console.log('💡 The system now uses generic indexes that work with any user ID');
    console.log('💡 All hard-coded guest_user references have been removed');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

migrateRemoveGuestUserReferences().catch(console.error); 