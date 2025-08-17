#!/usr/bin/env tsx

import '../scripts/_setup-env';
import { storage } from '../server/storage';
import { USER_TYPES } from '../shared/user-types';
import { ACCESS_ROLES } from '../shared/access-roles';

async function createSystemBacklogUser() {
  const systemBacklogId = 'system_backlog';
  
  console.log(`Creating system backlog user with ID: ${systemBacklogId}`);
  
  try {
    // Check if system backlog user already exists
    const existingUser = await storage.getUser(systemBacklogId);
    
    if (existingUser) {
      console.log(`System backlog user already exists:`);
      console.log(`  ID: ${existingUser.id}`);
      console.log(`  Account Type: ${existingUser.accountType} (${USER_TYPES.SYSTEM === existingUser.accountType ? 'System' : 'Other'})`);
      console.log(`  Access Role: ${existingUser.accessRole} (${ACCESS_ROLES.USER === existingUser.accessRole ? 'User' : 'Other'})`);
      console.log(`  Credits: ${existingUser.credits}`);
      console.log(`  Created: ${existingUser.createdAt}`);
      console.log(`  Last Seen: ${existingUser.lastSeenAt}`);
      
      // Check if the user has the correct type and role
      if (existingUser.accountType !== USER_TYPES.SYSTEM) {
        console.log(`⚠️  Warning: User has account type ${existingUser.accountType}, expected ${USER_TYPES.SYSTEM} (System)`);
      }
      
      if (existingUser.accessRole !== ACCESS_ROLES.USER) {
        console.log(`⚠️  Warning: User has access role ${existingUser.accessRole}, expected ${ACCESS_ROLES.USER} (User)`);
      }
      
      // Update credits to 0 if not already
      if (existingUser.credits !== 0) {
        await storage.updateUser(existingUser.id, { credits: 0 });
        console.log('✅ Updated credits to 0');
      }
      return;
    }
    
    // Create new system backlog user
    const newUser = await storage.upsertUser({
      id: systemBacklogId,
      accountType: USER_TYPES.SYSTEM, // 1 = System
      accessRole: ACCESS_ROLES.USER,  // 1 = User
      sessionToken: null, // System users don't need session tokens
      isEphemeral: false, // System users are not ephemeral
      canUpgradeToRegistered: false, // System users cannot be upgraded
      credits: 0, // Set credits to 0 as requested
      createdAt: new Date(),
      lastSeenAt: new Date()
    });
    
    console.log(`✅ Created system backlog user successfully`);
    console.log('User details:', {
      id: newUser.id,
      accountType: newUser.accountType,
      accessRole: newUser.accessRole,
      credits: newUser.credits,
      createdAt: newUser.createdAt,
      lastSeenAt: newUser.lastSeenAt
    });
    
  } catch (error) {
    console.error('Error creating system backlog user:', error);
    throw error;
  }
}

// Run the function if this script is executed directly
createSystemBacklogUser()
  .then(() => {
    console.log('✅ System backlog user creation completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ System backlog user creation failed:', error);
    process.exit(1);
  }); 