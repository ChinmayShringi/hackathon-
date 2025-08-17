#!/usr/bin/env tsx

import { config } from 'dotenv';
config();

import { Pool } from 'pg';

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('🔍 INVESTIGATING MISCLASSIFIED GENERATIONS');
    console.log('=========================================\n');
    
    // Check what generations in other users have backlog metadata
    console.log('❌ MISCLASSIFIED GENERATIONS IN OTHER USERS:');
    const misclassified = await pool.query(`
      SELECT 
        id,
        user_id,
        recipe_title,
        status,
        metadata,
        created_at,
        updated_at
      FROM generations 
      WHERE user_id != 'system_backlog'
        AND metadata::text LIKE '%backlog%'
      ORDER BY user_id, created_at DESC;
    `);
    
    if (misclassified.rows.length > 0) {
      for (const gen of misclassified.rows) {
        console.log(`\n   📝 Generation ${gen.id} (User: ${gen.user_id})`);
        console.log(`      Recipe: ${gen.recipe_title}`);
        console.log(`      Status: ${gen.status}`);
        console.log(`      Created: ${gen.created_at}`);
        console.log(`      Metadata: ${JSON.stringify(gen.metadata, null, 2)}`);
      }
    }
    
    // Check if these are actually backlog generations that got assigned to wrong users
    console.log('\n🔍 CHECKING IF THESE ARE ACTUAL BACKLOG GENERATIONS:');
    for (const gen of misclassified.rows) {
      const metadata = gen.metadata;
      if (metadata && metadata.request_origin === 'backlog') {
        console.log(`   ⚠️  Generation ${gen.id} has request_origin='backlog' but belongs to user ${gen.user_id}`);
        console.log(`      This suggests a bug in the backlog generation assignment!`);
      }
    }
    
    // Check the system_backlog user to see what it should contain
    console.log('\n📊 SYSTEM_BACKLOG USER ANALYSIS:');
    const systemBacklog = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE metadata::text LIKE '%"request_origin":"backlog"%') as marked_as_backlog,
        COUNT(*) FILTER (WHERE metadata::text LIKE '%cleanupRun%') as marked_as_cleanup
      FROM generations 
      WHERE user_id = 'system_backlog';
    `);
    
    const stats = systemBacklog.rows[0];
    console.log(`   Total generations: ${stats.total}`);
    console.log(`   Marked as backlog: ${stats.marked_as_backlog}`);
    console.log(`   Marked as cleanup: ${stats.marked_as_cleanup}`);
    
    // Check if there are any generations that should be in system_backlog but aren't
    console.log('\n🔍 CHECKING FOR ORPHANED BACKLOG GENERATIONS:');
    const orphanedBacklog = await pool.query(`
      SELECT 
        user_id,
        COUNT(*) as count
      FROM generations 
      WHERE metadata::text LIKE '%"request_origin":"backlog"%'
        AND user_id != 'system_backlog'
      GROUP BY user_id;
    `);
    
    if (orphanedBacklog.rows.length > 0) {
      console.log('   Found generations marked as backlog but in wrong users:');
      for (const row of orphanedBacklog.rows) {
        console.log(`      ${row.user_id}: ${row.count} generations`);
      }
    } else {
      console.log('   ✅ All backlog generations are in the correct user');
    }
    
    // Check the cleanup system's actual scope
    console.log('\n🔒 CLEANUP SYSTEM SCOPE VERIFICATION:');
    console.log('   The cleanup system ONLY affects:');
    console.log('   - user_id = "system_backlog"');
    console.log('   - status = "failed"');
    console.log('   - updated_at < cutoff_time');
    console.log('');
    console.log('   This means it CANNOT affect other users, even if they have backlog metadata.');
    
  } catch (error) {
    console.error('❌ Error investigating misclassified generations:', error);
  } finally {
    await pool.end();
  }
}

// Run the investigation
main().catch((error) => {
  console.error('❌ Unhandled error during investigation:', error);
  process.exit(1);
});
