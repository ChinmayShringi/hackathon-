#!/usr/bin/env tsx

import { config } from 'dotenv';
config();

import { Pool } from 'pg';

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('🔍 Checking for cleanup records in the database...\n');
    
    // Check for cleanup records
    const cleanupRecords = await pool.query(`
      SELECT 
        id,
        prompt,
        metadata,
        created_at,
        updated_at
      FROM generations 
      WHERE user_id = 'system_backlog' 
        AND metadata::text LIKE '%cleanupRun%'
        AND metadata::text LIKE '%"request_origin":"backlog"%'
      ORDER BY created_at DESC;
    `);
    
    if (cleanupRecords.rows.length > 0) {
      console.log('✅ Found cleanup records:');
      for (const record of cleanupRecords.rows) {
        console.log(`   📝 ${record.prompt}`);
        console.log(`      Created: ${record.created_at}`);
        console.log(`      Metadata: ${JSON.stringify(record.metadata)}`);
        console.log('');
      }
    } else {
      console.log('❌ No cleanup records found');
    }
    
    // Check for cleanup log records
    const cleanupLogs = await pool.query(`
      SELECT 
        id,
        prompt,
        metadata,
        created_at
      FROM generations 
      WHERE user_id = 'system_backlog' 
        AND metadata::text LIKE '%cleanupLog%'
      ORDER BY created_at DESC;
    `);
    
    if (cleanupLogs.rows.length > 0) {
      console.log('📋 Cleanup log records:');
      for (const record of cleanupLogs.rows) {
        console.log(`   📊 ${record.prompt}`);
        console.log(`      Created: ${record.created_at}`);
        console.log(`      Metadata: ${JSON.stringify(record.metadata)}`);
        console.log('');
      }
    } else {
      console.log('📋 No cleanup log records found');
    }
    
    // Check current backlog status
    console.log('📊 Current backlog status:');
    const status = await pool.query(`
      SELECT 
        COUNT(*) as total_generations,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'failed') as failed,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'processing') as processing
      FROM generations 
      WHERE user_id = 'system_backlog';
    `);
    
    const stats = status.rows[0];
    console.log(`   Total generations: ${stats.total_generations}`);
    console.log(`   Completed: ${stats.completed}`);
    console.log(`   Failed: ${stats.failed}`);
    console.log(`   Pending: ${stats.pending}`);
    console.log(`   Processing: ${stats.processing}`);
    
  } catch (error) {
    console.error('❌ Error checking cleanup records:', error);
  } finally {
    await pool.end();
  }
}

// Run the script
main().catch((error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});
