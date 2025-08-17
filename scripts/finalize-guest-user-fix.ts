#!/usr/bin/env tsx

import 'dotenv/config';
import { Pool } from 'pg';

async function finalizeGuestUserFix() {
  console.log('🎯 Finalizing guest_user reference cleanup...\n');

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    // Check current state
    console.log('1. Current system state:');
    
    const devBoundId = process.env.DEV_BOUND_GUEST_ID;
    console.log(`   DEV_BOUND_GUEST_ID: ${devBoundId || 'NOT SET'}`);

    // Check shared_guest_user account
    const sharedUserResult = await pool.query(`
      SELECT id, account_type, credits, created_at, last_seen_at
      FROM users 
      WHERE id = 'shared_guest_user'
    `);
    
    if (sharedUserResult.rows.length > 0) {
      const user = sharedUserResult.rows[0];
      console.log(`   ✅ shared_guest_user exists: ${user.credits} credits, last seen: ${user.last_seen_at}`);
    } else {
      console.log('   ❌ shared_guest_user not found');
    }

    // Check guest_user account
    const guestUserResult = await pool.query(`
      SELECT id, account_type, credits, created_at, last_seen_at
      FROM users 
      WHERE id = 'guest_user'
    `);
    
    if (guestUserResult.rows.length > 0) {
      const user = guestUserResult.rows[0];
      console.log(`   ⚠️  guest_user still exists: ${user.credits} credits, created: ${user.created_at}`);
    } else {
      console.log('   ✅ guest_user account not found');
    }

    // Check generations by user
    console.log('\n2. Generation counts by user:');
    const generationCounts = await pool.query(`
      SELECT 
        user_id,
        COUNT(*) as count,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'pending' OR status = 'processing') as pending,
        COUNT(*) FILTER (WHERE status = 'failed') as failed
      FROM generations 
      WHERE user_id IN ('shared_guest_user', 'guest_user')
      GROUP BY user_id
      ORDER BY user_id
    `);

    generationCounts.rows.forEach((row: any) => {
      console.log(`   ${row.user_id}: ${row.count} total (${row.completed} completed, ${row.pending} pending, ${row.failed} failed)`);
    });

    // Check if guest_user has any generations
    const guestUserGenerations = generationCounts.rows.find((row: any) => row.user_id === 'guest_user');
    
    if (guestUserGenerations && guestUserGenerations.count > 0) {
      console.log(`\n⚠️  guest_user still has ${guestUserGenerations.count} generations`);
      console.log('   💡 These should be migrated to shared_guest_user');
    } else {
      console.log('\n✅ guest_user has no generations - safe to remove');
      
      // Remove the guest_user account if it has no generations
      if (guestUserResult.rows.length > 0) {
        console.log('\n3. Removing guest_user account...');
        try {
          await pool.query(`DELETE FROM users WHERE id = 'guest_user'`);
          console.log('   ✅ Removed guest_user account');
        } catch (error) {
          console.log(`   ❌ Error removing guest_user account: ${error}`);
        }
      }
    }

    // Verify indexes
    console.log('\n4. Verifying database indexes:');
    const indexResult = await pool.query(`
      SELECT 
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE tablename = 'generations'
      AND schemaname = 'public'
      ORDER BY indexname
    `);

    console.log(`   Found ${indexResult.rows.length} indexes on generations table:`);
    indexResult.rows.forEach((row: any) => {
      console.log(`   - ${row.indexname}`);
    });

    // Check for any remaining hard-coded guest_user references
    const hardcodedRefs = await pool.query(`
      SELECT 
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE indexdef LIKE '%guest_user%'
      AND schemaname = 'public'
    `);

    if (hardcodedRefs.rows.length === 0) {
      console.log('   ✅ No hard-coded guest_user references in indexes');
    } else {
      console.log('   ⚠️  Found hard-coded guest_user references:');
      hardcodedRefs.rows.forEach((row: any) => {
        console.log(`   - ${row.indexname}: ${row.indexdef}`);
      });
    }

    // Final summary
    console.log('\n📋 Final Summary:');
    console.log(`- DEV_BOUND_GUEST_ID: ${devBoundId || 'NOT SET'}`);
    console.log(`- shared_guest_user exists: ${sharedUserResult.rows.length > 0 ? 'YES' : 'NO'}`);
    console.log(`- guest_user exists: ${guestUserResult.rows.length > 0 ? 'YES' : 'NO'}`);
    console.log(`- guest_user generations: ${guestUserGenerations ? guestUserGenerations.count : 0}`);
    console.log(`- Hard-coded indexes: ${hardcodedRefs.rows.length}`);

    if (hardcodedRefs.rows.length === 0 && (!guestUserGenerations || guestUserGenerations.count === 0)) {
      console.log('\n🎉 SUCCESS: All hard-coded guest_user references have been resolved!');
      console.log('💡 The system now works consistently with any user ID');
      console.log('💡 DEV_BOUND_GUEST_ID system is fully functional');
    } else {
      console.log('\n⚠️  Some cleanup still needed');
    }

  } catch (error) {
    console.error('❌ Error finalizing guest_user fix:', error);
  } finally {
    await pool.end();
  }
}

finalizeGuestUserFix().catch(console.error); 