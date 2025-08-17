#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function migrateUserTypes() {
  console.log('🔄 Starting user type migration...\n');

  try {
    // Step 1: Create type_user table
    console.log('📋 Step 1: Creating type_user table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS type_user (
        id INTEGER PRIMARY KEY NOT NULL,
        title TEXT NOT NULL
      )
    `);
    console.log('✅ type_user table created');

    // Step 2: Seed type_user table
    console.log('\n🌱 Step 2: Seeding type_user table...');
    await db.execute(sql`
      INSERT INTO type_user (id, title) VALUES 
        (1, 'System'),
        (2, 'Guest'), 
        (3, 'Registered')
      ON CONFLICT (id) DO NOTHING
    `);
    console.log('✅ type_user table seeded');

    // Step 3: Add account_type_2 field
    console.log('\n🔧 Step 3: Adding account_type_2 field...');
    await db.execute(sql`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS account_type_2 INTEGER
    `);
    console.log('✅ account_type_2 field added');

    // Step 4: Populate account_type_2 based on existing account_type values
    console.log('\n🔄 Step 4: Populating account_type_2...');
    const updateResult = await db.execute(sql`
      UPDATE users 
      SET account_type_2 = CASE 
        WHEN account_type = 'Guest' THEN 2
        WHEN account_type = 'Registered' THEN 3
        ELSE NULL
      END
      WHERE account_type_2 IS NULL
    `);
    console.log(`✅ Updated ${updateResult.rowCount} users`);

    // Step 5: Verify the migration
    console.log('\n🔍 Step 5: Verifying migration...');
    const verification = await db.execute(sql`
      SELECT 
        account_type,
        account_type_2,
        COUNT(*) as count
      FROM users 
      GROUP BY account_type, account_type_2
      ORDER BY account_type_2
    `);
    
    console.log('Migration verification:');
    for (const row of verification.rows as any[]) {
      console.log(`  ${row.account_type} -> ${row.account_type_2}: ${row.count} users`);
    }

    // Step 6: Check for any unmapped values
    const unmapped = await db.execute(sql`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE account_type_2 IS NULL
    `);
    
    if (unmapped.rows[0].count > 0) {
      console.log(`⚠️  Warning: ${unmapped.rows[0].count} users have unmapped account types`);
    } else {
      console.log('✅ All users have been mapped successfully');
    }

    console.log('\n🎉 User type migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('  1. Drop indexes on account_type');
    console.log('  2. Drop account_type column');
    console.log('  3. Rename account_type_2 to account_type');
    console.log('  4. Restore indexes on account_type');
    console.log('  5. Update code to use integer-based types');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await db.$client.end();
  }
}

// Run the migration
migrateUserTypes().catch(console.error); 