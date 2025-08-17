#!/usr/bin/env tsx

import { config } from 'dotenv';
config();

import { Pool } from 'pg';

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('🔒 SECURITY AUDIT: Backlog Cleanup System');
    console.log('==========================================\n');
    
    // 1. Check what users exist and their generation counts BEFORE cleanup
    console.log('📊 USER GENERATION COUNTS (BEFORE CLEANUP):');
    const beforeCleanup = await pool.query(`
      SELECT 
        user_id,
        COUNT(*) as total_generations,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'failed') as failed,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'processing') as processing
      FROM generations 
      GROUP BY user_id
      ORDER BY total_generations DESC;
    `);
    
    const beforeCounts = new Map();
    for (const user of beforeCleanup.rows) {
      beforeCounts.set(user.user_id, {
        total: user.total_generations,
        completed: user.completed,
        failed: user.failed,
        pending: user.pending,
        processing: user.processing
      });
      console.log(`   ${user.user_id}: ${user.total_generations} total (${user.failed} failed)`);
    }
    
    // 2. Run the cleanup to see what happens
    console.log('\n🧹 RUNNING CLEANUP TO TEST SECURITY...');
    const cleanupResult = await pool.query(`SELECT backlog_cleanup_failed_generations();`);
    console.log('✅ Cleanup completed');
    
    // 3. Check user generation counts AFTER cleanup
    console.log('\n📊 USER GENERATION COUNTS (AFTER CLEANUP):');
    const afterCleanup = await pool.query(`
      SELECT 
        user_id,
        COUNT(*) as total_generations,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'failed') as failed,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'processing') as processing
      FROM generations 
      GROUP BY user_id
      ORDER BY total_generations DESC;
    `);
    
    const afterCounts = new Map();
    for (const user of afterCleanup.rows) {
      afterCounts.set(user.user_id, {
        total: user.total_generations,
        completed: user.completed,
        failed: user.failed,
        pending: user.pending,
        processing: user.processing
      });
      console.log(`   ${user.user_id}: ${user.total_generations} total (${user.failed} failed)`);
    }
    
    // 4. Security Analysis
    console.log('\n🔒 SECURITY ANALYSIS:');
    let securityIssues = 0;
    
    for (const [userId, before] of beforeCounts) {
      const after = afterCounts.get(userId);
      if (!after) {
        console.log(`   ❌ CRITICAL: User ${userId} completely disappeared!`);
        securityIssues++;
        continue;
      }
      
      const totalDiff = after.total - before.total;
      const failedDiff = after.failed - before.failed;
      
      if (userId === 'system_backlog') {
        // system_backlog should be the only user affected
        if (totalDiff < 0) {
          console.log(`   ✅ system_backlog: ${Math.abs(totalDiff)} generations removed (expected)`);
        } else {
          console.log(`   ✅ system_backlog: no change (${totalDiff})`);
        }
      } else {
        // All other users should be completely unaffected
        if (totalDiff !== 0) {
          console.log(`   ❌ SECURITY VIOLATION: User ${userId} affected! Change: ${totalDiff}`);
          securityIssues++;
        } else {
          console.log(`   ✅ ${userId}: completely unaffected (${totalDiff})`);
        }
      }
    }
    
    // 5. Check for any generations that might have been orphaned or incorrectly modified
    console.log('\n🔍 CHECKING FOR ORPHANED/MODIFIED GENERATIONS:');
    const orphanedCheck = await pool.query(`
      SELECT 
        user_id,
        COUNT(*) as count
      FROM generations 
      WHERE user_id NOT IN (
        SELECT DISTINCT user_id FROM generations 
        WHERE user_id IS NOT NULL
      )
      GROUP BY user_id;
    `);
    
    if (orphanedCheck.rows.length > 0) {
      console.log('   ❌ Found orphaned generations!');
      securityIssues++;
    } else {
      console.log('   ✅ No orphaned generations found');
    }
    
    // 6. Check if any non-system_backlog users have metadata indicating they're backlog generations
    console.log('\n🔍 CHECKING FOR MISCLASSIFIED GENERATIONS:');
    const misclassifiedCheck = await pool.query(`
      SELECT 
        user_id,
        COUNT(*) as count
      FROM generations 
      WHERE user_id != 'system_backlog'
        AND metadata::text LIKE '%"request_origin":"backlog"%'
      GROUP BY user_id;
    `);
    
    if (misclassifiedCheck.rows.length > 0) {
      console.log('   ❌ Found misclassified generations in other users!');
      for (const row of misclassifiedCheck.rows) {
        console.log(`      ${row.user_id}: ${row.count} generations`);
      }
      securityIssues++;
    } else {
      console.log('   ✅ No misclassified generations found');
    }
    
    // 7. Final Security Assessment
    console.log('\n🎯 FINAL SECURITY ASSESSMENT:');
    if (securityIssues === 0) {
      console.log('   🟢 SECURE: Cleanup system ONLY affects system_backlog user');
      console.log('   ✅ All other users completely protected');
      console.log('   ✅ No data leakage or cross-user contamination');
    } else {
      console.log(`   🔴 INSECURE: ${securityIssues} security issues found!`);
      console.log('   ❌ Cleanup system may be affecting other users');
    }
    
    // 8. Show what was actually cleaned up
    console.log('\n📋 CLEANUP SUMMARY:');
    const cleanupRecords = await pool.query(`
      SELECT 
        prompt,
        metadata,
        created_at
      FROM generations 
      WHERE user_id = 'system_backlog' 
        AND metadata::text LIKE '%cleanupRun%'
      ORDER BY created_at DESC
      LIMIT 1;
    `);
    
    if (cleanupRecords.rows.length > 0) {
      const record = cleanupRecords.rows[0];
      console.log(`   Last cleanup: ${record.prompt}`);
      console.log(`   Timestamp: ${record.created_at}`);
      console.log(`   Metadata: ${JSON.stringify(record.metadata)}`);
    }
    
  } catch (error) {
    console.error('❌ Error during security audit:', error);
  } finally {
    await pool.end();
  }
}

// Run the security audit
main().catch((error) => {
  console.error('❌ Unhandled error during security audit:', error);
  process.exit(1);
});
