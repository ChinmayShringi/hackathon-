#!/usr/bin/env tsx

import { config } from 'dotenv';
config();

import { Pool } from 'pg';

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('🔍 Auditing Backlog User Account');
    console.log('================================\n');
    
    // Check what user accounts exist
    console.log('👥 User Accounts in Database:');
    const users = await pool.query(`
      SELECT 
        id,
        account_type,
        access_role,
        email,
        created_at,
        updated_at
      FROM users 
      ORDER BY created_at DESC
      LIMIT 10;
    `);
    
    for (const user of users.rows) {
      console.log(`   ${user.id} (Type: ${user.account_type}, Role: ${user.access_role})`);
    }
    
    // Check what user the backlog generations are actually connected to
    console.log('\n📊 Backlog Generations by User:');
    const backlogUsers = await pool.query(`
      SELECT 
        user_id,
        COUNT(*) as generation_count,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
        COUNT(*) FILTER (WHERE status = 'failed') as failed_count,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
        COUNT(*) FILTER (WHERE status = 'processing') as processing_count
      FROM generations 
      WHERE user_id LIKE '%backlog%' OR user_id LIKE '%system%'
      GROUP BY user_id
      ORDER BY generation_count DESC;
    `);
    
    if (backlogUsers.rows.length > 0) {
      for (const user of backlogUsers.rows) {
        console.log(`   ${user.user_id}:`);
        console.log(`     Total: ${user.generation_count}`);
        console.log(`     Completed: ${user.completed_count}`);
        console.log(`     Failed: ${user.failed_count}`);
        console.log(`     Pending: ${user.pending_count}`);
        console.log(`     Processing: ${user.processing_count}`);
      }
    } else {
      console.log('   No backlog-related users found');
    }
    
    // Check all users that have generations
    console.log('\n🔍 All Users with Generations:');
    const allUsersWithGenerations = await pool.query(`
      SELECT 
        user_id,
        COUNT(*) as total_generations
      FROM generations 
      GROUP BY user_id
      ORDER BY total_generations DESC
      LIMIT 10;
    `);
    
    for (const user of allUsersWithGenerations.rows) {
      console.log(`   ${user.user_id}: ${user.total_generations} generations`);
    }
    
    // Check if 'system_backlog' user exists
    console.log('\n❓ Does system_backlog user exist?');
    const systemBacklogUser = await pool.query(`
      SELECT id, account_type, access_role, created_at
      FROM users 
      WHERE id = 'system_backlog';
    `);
    
    if (systemBacklogUser.rows.length > 0) {
      const user = systemBacklogUser.rows[0];
      console.log(`   ✅ Yes: ${user.id} (Type: ${user.account_type}, Role: ${user.access_role})`);
    } else {
      console.log('   ❌ No: system_backlog user not found');
    }
    
    // Check what the actual backlog user ID is
    console.log('\n🎯 What is the actual backlog user ID?');
    const actualBacklogUser = await pool.query(`
      SELECT DISTINCT user_id
      FROM generations 
      WHERE metadata::text LIKE '%"request_origin":"backlog"%'
      LIMIT 5;
    `);
    
    if (actualBacklogUser.rows.length > 0) {
      console.log('   Backlog generations are connected to:');
      for (const row of actualBacklogUser.rows) {
        console.log(`     - ${row.user_id}`);
      }
    } else {
      console.log('   No backlog generations found');
    }
    
  } catch (error) {
    console.error('❌ Error auditing backlog user:', error);
  } finally {
    await pool.end();
  }
}

// Run the script
main().catch((error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});
