#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function completeUserTypeMigration() {
  console.log('🔄 Completing user type migration...\n');

  try {
    // Step 1: Verify account_type_2 is populated
    console.log('🔍 Step 1: Verifying account_type_2 is populated...');
    const checkResult = await db.execute(sql`
      SELECT COUNT(*) as total, COUNT(account_type_2) as mapped
      FROM users
    `);
    
    const { total, mapped } = checkResult.rows[0] as any;
    console.log(`Total users: ${total}, Mapped users: ${mapped}`);
    
    if (total !== mapped) {
      throw new Error('Not all users have been mapped to account_type_2');
    }
    console.log('✅ All users are mapped');

    // Step 2: Drop indexes on account_type
    console.log('\n🗑️  Step 2: Dropping indexes on account_type...');
    try {
      await db.execute(sql`DROP INDEX IF EXISTS "IDX_users_account_type"`);
      console.log('✅ Dropped IDX_users_account_type');
    } catch (error) {
      console.log('⚠️  Index IDX_users_account_type not found or already dropped');
    }

    // Step 3: Drop account_type column
    console.log('\n🗑️  Step 3: Dropping account_type column...');
    await db.execute(sql`ALTER TABLE users DROP COLUMN account_type`);
    console.log('✅ Dropped account_type column');

    // Step 4: Rename account_type_2 to account_type
    console.log('\n🔄 Step 4: Renaming account_type_2 to account_type...');
    await db.execute(sql`ALTER TABLE users RENAME COLUMN account_type_2 TO account_type`)
    console.log('✅ Renamed account_type_2 to account_type');

    // Step 5: Restore indexes on account_type
    console.log('\n🔧 Step 5: Restoring indexes on account_type...');
    await db.execute(sql`
      CREATE INDEX "IDX_users_account_type" ON "users" USING btree ("account_type")
    `);
    console.log('✅ Restored IDX_users_account_type index');

    // Step 6: Verify final state
    console.log('\n🔍 Step 6: Verifying final state...');
    const finalVerification = await db.execute(sql`
      SELECT 
        account_type,
        COUNT(*) as count
      FROM users 
      GROUP BY account_type
      ORDER BY account_type
    `);
    
    console.log('Final verification:');
    for (const row of finalVerification.rows as any[]) {
      console.log(`  Type ${row.account_type}: ${row.count} users`);
    }

    // Step 7: Verify type_user table
    console.log('\n🔍 Step 7: Verifying type_user table...');
    const typeUserData = await db.execute(sql`
      SELECT * FROM type_user ORDER BY id
    `);
    
    console.log('type_user table contents:');
    for (const row of typeUserData.rows as any[]) {
      console.log(`  ${row.id}: ${row.title}`);
    }

    console.log('\n🎉 User type migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('  1. Update schema.ts to reflect new integer-based account_type');
    console.log('  2. Update unified-auth.ts to use integer constants');
    console.log('  3. Update all code references to use new integer types');
    console.log('  4. Test the system thoroughly');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await db.$client.end();
  }
}

// Run the migration
completeUserTypeMigration().catch(console.error); 