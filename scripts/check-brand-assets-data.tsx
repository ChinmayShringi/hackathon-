#!/usr/bin/env tsx

/**
 * Check Brand Assets Data
 * 
 * This script checks if there's any actual data in the brand_assets table
 * before we remove the entire system. This helps determine if we need
 * data migration or can safely drop the table.
 * 
 * Usage: npx tsx scripts/check-brand-assets-data.tsx
 */

import { config } from 'dotenv';
import { Pool } from 'pg';

// Load environment variables
config();

async function checkBrandAssetsData() {
  console.log('🔍 Checking brand_assets table for existing data...\n');
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    // Check if table exists and has data
    const tableExistsResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'brand_assets'
      );
    `);
    
    const tableExists = tableExistsResult.rows[0]?.exists;
    
    if (!tableExists) {
      console.log('❌ brand_assets table does not exist - safe to proceed with cleanup');
      return;
    }
    
    console.log('✅ brand_assets table exists');
    
    // Check row count
    const countResult = await pool.query('SELECT COUNT(*) FROM brand_assets');
    const rowCount = parseInt(countResult.rows[0]?.count || '0');
    
    console.log(`📊 Total rows in brand_assets: ${rowCount}`);
    
    if (rowCount === 0) {
      console.log('✅ Table is empty - safe to drop immediately');
      return;
    }
    
    // Show sample data structure
    console.log('\n📋 Sample data structure:');
    const sampleResult = await pool.query('SELECT * FROM brand_assets LIMIT 3');
    
    sampleResult.rows.forEach((row, index) => {
      console.log(`\n--- Row ${index + 1} ---`);
      console.log(`  ID: ${row.id}`);
      console.log(`  User ID: ${row.user_id}`);
      console.log(`  Name: ${row.name}`);
      console.log(`  File Name: ${row.file_name}`);
      console.log(`  File URL: ${row.file_url}`);
      console.log(`  File Size: ${row.file_size} bytes`);
      console.log(`  MIME Type: ${row.mime_type}`);
      console.log(`  Width: ${row.width}`);
      console.log(`  Height: ${row.height}`);
      console.log(`  Tags: ${row.tags ? JSON.stringify(row.tags) : 'null'}`);
      console.log(`  Is Transparent: ${row.is_transparent}`);
      console.log(`  Created: ${row.created_at}`);
      console.log(`  Updated: ${row.updated_at}`);
    });
    
    // Check for users who have brand assets
    const usersResult = await pool.query(`
      SELECT DISTINCT user_id, COUNT(*) as asset_count 
      FROM brand_assets 
      GROUP BY user_id 
      ORDER BY asset_count DESC
    `);
    
    console.log('\n👥 Users with brand assets:');
    usersResult.rows.forEach(row => {
      console.log(`  User ${row.user_id}: ${row.asset_count} assets`);
    });
    
    if (rowCount > 0) {
      console.log('\n⚠️  WARNING: Table contains data!');
      console.log('   Consider migrating this data to user_assets before dropping');
      console.log('   or ensure users are okay with losing this data');
    }
    
  } catch (error) {
    console.error('❌ Error checking brand_assets table:', error);
  } finally {
    await pool.end();
  }
  
  console.log('\n🏁 Brand assets data check completed');
}

// Run the check
if (import.meta.url === `file://${process.argv[1]}`) {
  checkBrandAssetsData().catch(console.error);
}
