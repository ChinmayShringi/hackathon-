#!/usr/bin/env tsx

import 'dotenv/config';
import { Pool } from 'pg';
import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function fixGuestUserReferences() {
  console.log('🔧 Fixing hard-coded guest_user references...\n');

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    // Check current indexes that reference 'guest_user'
    console.log('1. Checking current indexes with guest_user references:');
    const indexResult = await pool.query(`
      SELECT 
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE indexdef LIKE '%guest_user%'
      AND schemaname = 'public'
    `);

    if (indexResult.rows.length === 0) {
      console.log('   ✅ No hard-coded guest_user indexes found');
    } else {
      console.log('   Found indexes with guest_user references:');
      indexResult.rows.forEach((row: any) => {
        console.log(`   - ${row.indexname}: ${row.indexdef}`);
      });
    }

    // Check for any remaining hard-coded guest_user references in generations
    console.log('\n2. Checking for hard-coded guest_user references in generations table:');
    const guestUserCount = await pool.query(`
      SELECT COUNT(*) as count
      FROM generations 
      WHERE user_id = 'guest_user'
    `);
    
    console.log(`   Generations with user_id = 'guest_user': ${guestUserCount.rows[0].count}`);

    if (guestUserCount.rows[0].count > 0) {
      console.log('   ⚠️  Found generations still using hard-coded guest_user');
      console.log('   💡 These should be migrated to use the actual user IDs');
    } else {
      console.log('   ✅ No hard-coded guest_user references found in generations');
    }

    // Check for any remaining hard-coded guest_user references in users
    console.log('\n3. Checking for hard-coded guest_user references in users table:');
    const userResult = await pool.query(`
      SELECT id, account_type, credits, created_at
      FROM users 
      WHERE id = 'guest_user'
    `);
    
    if (userResult.rows.length > 0) {
      console.log('   Found user with id = guest_user:');
      userResult.rows.forEach((row: any) => {
        console.log(`   - ID: ${row.id}, Type: ${row.account_type}, Credits: ${row.credits}, Created: ${row.created_at}`);
      });
    } else {
      console.log('   ✅ No hard-coded guest_user found in users table');
    }

    // Check DEV_BOUND_GUEST_ID configuration
    console.log('\n4. Checking DEV_BOUND_GUEST_ID configuration:');
    const devBoundId = process.env.DEV_BOUND_GUEST_ID;
    if (devBoundId) {
      console.log(`   DEV_BOUND_GUEST_ID is set to: ${devBoundId}`);
      
      const boundUserResult = await pool.query(`
        SELECT id, account_type, credits, created_at
        FROM users 
        WHERE id = $1
      `, [devBoundId]);
      
      if (boundUserResult.rows.length > 0) {
        console.log('   ✅ DEV_BOUND_GUEST_ID user exists:');
        boundUserResult.rows.forEach((row: any) => {
          console.log(`   - ID: ${row.id}, Type: ${row.account_type}, Credits: ${row.credits}, Created: ${row.created_at}`);
        });
      } else {
        console.log('   ❌ DEV_BOUND_GUEST_ID user does not exist');
      }
    } else {
      console.log('   DEV_BOUND_GUEST_ID is not set');
    }

    // Summary and recommendations
    console.log('\n📋 Summary:');
    console.log(`- Indexes with guest_user references: ${indexResult.rows.length}`);
    console.log(`- Generations with guest_user: ${guestUserCount.rows[0].count}`);
    console.log(`- Users with guest_user ID: ${userResult.rows.length}`);
    console.log(`- DEV_BOUND_GUEST_ID: ${devBoundId || 'NOT SET'}`);

    if (indexResult.rows.length > 0 || guestUserCount.rows[0].count > 0) {
      console.log('\n🚨 ACTION REQUIRED:');
      console.log('   The system still has hard-coded guest_user references that need to be cleaned up.');
      console.log('   Consider running migration scripts to:');
      console.log('   1. Drop hard-coded indexes');
      console.log('   2. Migrate any remaining guest_user generations');
      console.log('   3. Remove the guest_user account if no longer needed');
    } else {
      console.log('\n✅ All hard-coded guest_user references have been resolved!');
    }

  } catch (error) {
    console.error('❌ Error checking guest_user references:', error);
  } finally {
    await pool.end();
  }
}

fixGuestUserReferences().catch(console.error); 