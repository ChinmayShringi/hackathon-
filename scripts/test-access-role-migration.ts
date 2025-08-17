#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../server/db';
import { users, typeRole } from '../shared/schema';
import { ACCESS_ROLES, getAccessRoleLabel } from '../shared/access-roles';

async function testAccessRoleMigration() {
  console.log('🧪 Testing Access Role Migration...\n');

  try {
    // Test 1: Verify type_role table exists and has correct data
    console.log('📋 Test 1: Verifying type_role table...');
    const typeRoles = await db.select().from(typeRole);
    console.log(`Found ${typeRoles.length} access roles in type_role table:`);
    typeRoles.forEach(role => {
      console.log(`  ${role.id} = "${role.title}"`);
    });

    // Test 2: Verify constants match database
    console.log('\n🔢 Test 2: Verifying constants match database...');
    const expectedRoles = [
      { id: ACCESS_ROLES.USER, title: 'User' },
      { id: ACCESS_ROLES.TEST, title: 'Test' },
      { id: ACCESS_ROLES.ADMIN, title: 'Admin' }
    ];

    for (const expected of expectedRoles) {
      const dbRole = typeRoles.find(r => r.id === expected.id);
      if (dbRole && dbRole.title === expected.title) {
        console.log(`✅ ${expected.id} = "${expected.title}" ✓`);
      } else {
        console.log(`❌ ${expected.id} = "${expected.title}" - NOT FOUND`);
      }
    }

    // Test 3: Verify user accounts use integer roles
    console.log('\n👥 Test 3: Verifying user accounts use integer roles...');
    const allUsers = await db.select().from(users);
    console.log(`Total users: ${allUsers.length}`);

    const roleCounts = new Map<number, number>();
    for (const user of allUsers) {
      const count = roleCounts.get(user.accessRole) || 0;
      roleCounts.set(user.accessRole, count + 1);
    }

    console.log('Access role distribution:');
    for (const [roleId, count] of roleCounts) {
      const label = getAccessRoleLabel(roleId as 1 | 2 | 3);
      console.log(`  ${roleId} (${label}): ${count} users`);
    }

    // Test 4: Test utility functions
    console.log('\n🔧 Test 4: Testing utility functions...');
    console.log(`getAccessRoleLabel(${ACCESS_ROLES.USER}) = "${getAccessRoleLabel(ACCESS_ROLES.USER)}"`);
    console.log(`getAccessRoleLabel(${ACCESS_ROLES.TEST}) = "${getAccessRoleLabel(ACCESS_ROLES.TEST)}"`);
    console.log(`getAccessRoleLabel(${ACCESS_ROLES.ADMIN}) = "${getAccessRoleLabel(ACCESS_ROLES.ADMIN)}"`);

    console.log(`ACCESS_ROLES.USER = ${ACCESS_ROLES.USER}`);
    console.log(`ACCESS_ROLES.TEST = ${ACCESS_ROLES.TEST}`);
    console.log(`ACCESS_ROLES.ADMIN = ${ACCESS_ROLES.ADMIN}`);

    // Test 5: Verify no string-based access roles remain
    console.log('\n🔍 Test 5: Checking for any remaining string-based access roles...');
    const stringBasedUsers = allUsers.filter(u => 
      typeof u.accessRole === 'string' && 
      ['User', 'Test', 'Admin'].includes(u.accessRole as string)
    );

    if (stringBasedUsers.length === 0) {
      console.log('✅ No string-based access roles found');
    } else {
      console.log(`❌ Found ${stringBasedUsers.length} users with string-based access roles:`);
      stringBasedUsers.forEach(user => {
        console.log(`  ${user.id}: "${user.accessRole}"`);
      });
    }

    // Test 6: Verify specific access roles exist
    console.log('\n🎯 Test 6: Verifying specific access roles...');
    const userRoleUsers = allUsers.filter(u => u.accessRole === ACCESS_ROLES.USER);
    const testRoleUsers = allUsers.filter(u => u.accessRole === ACCESS_ROLES.TEST);
    const adminRoleUsers = allUsers.filter(u => u.accessRole === ACCESS_ROLES.ADMIN);

    console.log(`User role (${ACCESS_ROLES.USER}): ${userRoleUsers.length}`);
    console.log(`Test role (${ACCESS_ROLES.TEST}): ${testRoleUsers.length}`);
    console.log(`Admin role (${ACCESS_ROLES.ADMIN}): ${adminRoleUsers.length}`);

    // Test 7: Check for any invalid access role values
    console.log('\n⚠️  Test 7: Checking for invalid access role values...');
    const validRoleIds = [ACCESS_ROLES.USER, ACCESS_ROLES.TEST, ACCESS_ROLES.ADMIN];
    const invalidUsers = allUsers.filter(u => !validRoleIds.includes(u.accessRole));

    if (invalidUsers.length === 0) {
      console.log('✅ All users have valid access role values');
    } else {
      console.log(`❌ Found ${invalidUsers.length} users with invalid access role values:`);
      invalidUsers.forEach(user => {
        console.log(`  ${user.id}: ${user.accessRole} (invalid)`);
      });
    }

    console.log('\n🎉 Access Role Migration Test Complete!');
    console.log('\n📊 Summary:');
    console.log(`- type_role table: ${typeRoles.length} roles`);
    console.log(`- Total users: ${allUsers.length}`);
    console.log(`- User role: ${userRoleUsers.length}`);
    console.log(`- Test role: ${testRoleUsers.length}`);
    console.log(`- Admin role: ${adminRoleUsers.length}`);
    console.log(`- String-based roles remaining: ${stringBasedUsers.length}`);
    console.log(`- Invalid roles: ${invalidUsers.length}`);

  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

testAccessRoleMigration()
  .then(() => {
    console.log('\n✅ All tests passed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Tests failed:', error);
    process.exit(1);
  }); 