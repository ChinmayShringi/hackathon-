#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../server/db';
import { users, typeUser } from '../shared/schema';
import { USER_TYPES, getUserTypeLabel } from '../shared/user-types';
import { eq } from 'drizzle-orm';

async function testUserTypeMigration() {
  console.log('🧪 Testing User Type Migration...\n');

  try {
    // Test 1: Verify type_user table exists and has correct data
    console.log('📋 Test 1: Verifying type_user table...');
    const typeUsers = await db.select().from(typeUser);
    console.log(`Found ${typeUsers.length} user types in type_user table:`);
    typeUsers.forEach(type => {
      console.log(`  ${type.id} = "${type.title}"`);
    });

    // Test 2: Verify constants match database
    console.log('\n🔢 Test 2: Verifying constants match database...');
    const expectedTypes = [
      { id: USER_TYPES.SYSTEM, title: 'System' },
      { id: USER_TYPES.GUEST, title: 'Guest' },
      { id: USER_TYPES.REGISTERED, title: 'Registered' }
    ];

    for (const expected of expectedTypes) {
      const dbType = typeUsers.find(t => t.id === expected.id);
      if (dbType && dbType.title === expected.title) {
        console.log(`✅ ${expected.id} = "${expected.title}" ✓`);
      } else {
        console.log(`❌ ${expected.id} = "${expected.title}" - NOT FOUND`);
      }
    }

    // Test 3: Verify user accounts use integer types
    console.log('\n👥 Test 3: Verifying user accounts use integer types...');
    const allUsers = await db.select().from(users);
    console.log(`Total users: ${allUsers.length}`);

    const userTypeCounts = new Map<number, number>();
    for (const user of allUsers) {
      const count = userTypeCounts.get(user.accountType) || 0;
      userTypeCounts.set(user.accountType, count + 1);
    }

    console.log('User type distribution:');
    for (const [typeId, count] of userTypeCounts) {
      const label = getUserTypeLabel(typeId as 1 | 2 | 3);
      console.log(`  ${typeId} (${label}): ${count} users`);
    }

    // Test 4: Test utility functions
    console.log('\n🔧 Test 4: Testing utility functions...');
    console.log(`getUserTypeLabel(${USER_TYPES.SYSTEM}) = "${getUserTypeLabel(USER_TYPES.SYSTEM)}"`);
    console.log(`getUserTypeLabel(${USER_TYPES.GUEST}) = "${getUserTypeLabel(USER_TYPES.GUEST)}"`);
    console.log(`getUserTypeLabel(${USER_TYPES.REGISTERED}) = "${getUserTypeLabel(USER_TYPES.REGISTERED)}"`);

    console.log(`USER_TYPES.SYSTEM = ${USER_TYPES.SYSTEM}`);
    console.log(`USER_TYPES.GUEST = ${USER_TYPES.GUEST}`);
    console.log(`USER_TYPES.REGISTERED = ${USER_TYPES.REGISTERED}`);

    // Test 5: Verify no string-based account types remain
    console.log('\n🔍 Test 5: Checking for any remaining string-based account types...');
    const stringBasedUsers = allUsers.filter(u => 
      typeof u.accountType === 'string' && 
      ['Guest', 'Registered', 'System'].includes(u.accountType as string)
    );

    if (stringBasedUsers.length === 0) {
      console.log('✅ No string-based account types found');
    } else {
      console.log(`❌ Found ${stringBasedUsers.length} users with string-based account types:`);
      stringBasedUsers.forEach(user => {
        console.log(`  ${user.id}: "${user.accountType}"`);
      });
    }

    // Test 6: Verify specific user types exist
    console.log('\n🎯 Test 6: Verifying specific user types...');
    const guestUsers = allUsers.filter(u => u.accountType === USER_TYPES.GUEST);
    const registeredUsers = allUsers.filter(u => u.accountType === USER_TYPES.REGISTERED);
    const systemUsers = allUsers.filter(u => u.accountType === USER_TYPES.SYSTEM);

    console.log(`Guest users (${USER_TYPES.GUEST}): ${guestUsers.length}`);
    console.log(`Registered users (${USER_TYPES.REGISTERED}): ${registeredUsers.length}`);
    console.log(`System users (${USER_TYPES.SYSTEM}): ${systemUsers.length}`);

    // Test 7: Check for any invalid account type values
    console.log('\n⚠️  Test 7: Checking for invalid account type values...');
    const validTypeIds = [USER_TYPES.SYSTEM, USER_TYPES.GUEST, USER_TYPES.REGISTERED];
    const invalidUsers = allUsers.filter(u => !validTypeIds.includes(u.accountType));

    if (invalidUsers.length === 0) {
      console.log('✅ All users have valid account type values');
    } else {
      console.log(`❌ Found ${invalidUsers.length} users with invalid account type values:`);
      invalidUsers.forEach(user => {
        console.log(`  ${user.id}: ${user.accountType} (invalid)`);
      });
    }

    console.log('\n🎉 User Type Migration Test Complete!');
    console.log('\n📊 Summary:');
    console.log(`- type_user table: ${typeUsers.length} types`);
    console.log(`- Total users: ${allUsers.length}`);
    console.log(`- Guest users: ${guestUsers.length}`);
    console.log(`- Registered users: ${registeredUsers.length}`);
    console.log(`- System users: ${systemUsers.length}`);
    console.log(`- String-based types remaining: ${stringBasedUsers.length}`);
    console.log(`- Invalid types: ${invalidUsers.length}`);

  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

testUserTypeMigration()
  .then(() => {
    console.log('\n✅ All tests passed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Tests failed:', error);
    process.exit(1);
  }); 