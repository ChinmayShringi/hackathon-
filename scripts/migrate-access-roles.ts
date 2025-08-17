#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function migrateAccessRoles() {
  console.log('🔄 Starting access role migration...\n');

  try {
    // Step 1: Create type_role table
    console.log('📋 Step 1: Creating type_role table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS type_role (
        id INTEGER PRIMARY KEY NOT NULL,
        title TEXT NOT NULL
      )
    `);
    console.log('✅ type_role table created');

    // Step 2: Seed type_role table
    console.log('\n🌱 Step 2: Seeding type_role table...');
    await db.execute(sql`
      INSERT INTO type_role (id, title) VALUES 
        (1, 'User'),
        (2, 'Test'), 
        (3, 'Admin')
      ON CONFLICT (id) DO NOTHING
    `);
    console.log('✅ type_role table seeded');

    // Step 3: Add access_role_2 field
    console.log('\n🔧 Step 3: Adding access_role_2 field...');
    await db.execute(sql`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS access_role_2 INTEGER
    `);
    console.log('✅ access_role_2 field added');

    // Step 4: Populate access_role_2 based on existing access_role values
    console.log('\n🔄 Step 4: Populating access_role_2...');
    const updateResult = await db.execute(sql`
      UPDATE users 
      SET access_role_2 = CASE 
        WHEN access_role = 'User' THEN 1
        WHEN access_role = 'Test' THEN 2
        WHEN access_role = 'Admin' THEN 3
        ELSE NULL
      END
      WHERE access_role_2 IS NULL
    `);
    console.log(`✅ Updated ${updateResult.rowCount} users`);

    // Step 5: Verify the migration
    console.log('\n🔍 Step 5: Verifying migration...');
    const verification = await db.execute(sql`
      SELECT 
        access_role,
        access_role_2,
        COUNT(*) as count
      FROM users 
      GROUP BY access_role, access_role_2
      ORDER BY access_role_2
    `);
    
    console.log('Migration verification:');
    for (const row of verification.rows as any[]) {
      console.log(`  ${row.access_role} -> ${row.access_role_2}: ${row.count} users`);
    }

    // Step 6: Check for any unmapped users
    console.log('\n⚠️  Step 6: Checking for unmapped users...');
    const unmappedResult = await db.execute(sql`
      SELECT COUNT(*) as count
      FROM users 
      WHERE access_role_2 IS NULL
    `);
    
    const unmappedCount = parseInt(String(unmappedResult.rows[0]?.count || '0'));
    if (unmappedCount > 0) {
      console.log(`❌ Found ${unmappedCount} users with unmapped access roles`);
      console.log('Please check the data and run the migration again');
      return;
    } else {
      console.log('✅ All users have been mapped successfully');
    }

    console.log('\n🎉 Access role migration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Verify the migration results above');
    console.log('2. Run: npx tsx scripts/complete-access-role-migration.ts');
    console.log('3. Update code to use new integer-based constants');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await db.$client.end();
  }
}

migrateAccessRoles().catch(console.error); 