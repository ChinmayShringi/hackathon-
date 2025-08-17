#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function completeAccessRoleMigration() {
  console.log('🔄 Completing access role migration...\n');

  try {
    // Step 1: Verify access_role_2 is populated
    console.log('🔍 Step 1: Verifying access_role_2 is populated...');
    const checkResult = await db.execute(sql`
      SELECT COUNT(*) as total, COUNT(access_role_2) as mapped
      FROM users
    `);
    
    const { total, mapped } = checkResult.rows[0] as any;
    console.log(`Total users: ${total}, Mapped users: ${mapped}`);
    
    if (total !== mapped) {
      throw new Error('Not all users have been mapped to access_role_2');
    }
    console.log('✅ All users are mapped');

    // Step 2: Drop indexes on access_role
    console.log('\n🗑️  Step 2: Dropping indexes on access_role...');
    try {
      await db.execute(sql`DROP INDEX IF EXISTS "IDX_users_access_role"`);
      console.log('✅ Dropped IDX_users_access_role');
    } catch (error) {
      console.log('⚠️  Index IDX_users_access_role not found or already dropped');
    }

    // Step 3: Drop access_role column
    console.log('\n🗑️  Step 3: Dropping access_role column...');
    await db.execute(sql`ALTER TABLE users DROP COLUMN access_role`);
    console.log('✅ Dropped access_role column');

    // Step 4: Rename access_role_2 to access_role
    console.log('\n🔄 Step 4: Renaming access_role_2 to access_role...');
    await db.execute(sql`ALTER TABLE users RENAME COLUMN access_role_2 TO access_role`)
    console.log('✅ Renamed access_role_2 to access_role');

    // Step 5: Restore indexes on access_role
    console.log('\n🔧 Step 5: Restoring indexes on access_role...');
    await db.execute(sql`
      CREATE INDEX "IDX_users_access_role" ON "users" USING btree ("access_role")
    `);
    console.log('✅ Restored IDX_users_access_role index');

    // Step 6: Verify final state
    console.log('\n🔍 Step 6: Verifying final state...');
    const finalCheck = await db.execute(sql`
      SELECT 
        access_role,
        COUNT(*) as count
      FROM users 
      GROUP BY access_role
      ORDER BY access_role
    `);
    
    console.log('Final access role distribution:');
    for (const row of finalCheck.rows as any[]) {
      console.log(`  ${row.access_role}: ${row.count} users`);
    }

    console.log('\n🎉 Access role migration completed successfully!');
    console.log('\n📋 Migration Summary:');
    console.log('- ✅ type_role table created and seeded');
    console.log('- ✅ users.access_role converted to integer');
    console.log('- ✅ All users migrated successfully');
    console.log('- ✅ Indexes restored');
    console.log('\n💡 Next: Update code to use new integer-based constants');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await db.$client.end();
  }
}

completeAccessRoleMigration().catch(console.error); 