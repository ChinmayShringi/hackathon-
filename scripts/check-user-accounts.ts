#!/usr/bin/env tsx

import 'dotenv/config';
import { storage } from '../server/storage';
import { db } from '../server/db';
import { users } from '../shared/schema';
import { USER_TYPES } from '../shared/user-types';

async function checkUserAccounts() {
  console.log('🔍 Checking user accounts in database...');
  
  try {
    // Get all users
    const allUsers = await db.select().from(users);
    
    console.log(`\n📊 Total users in database: ${allUsers.length}`);
    
    // Group users by account type
    const guestUsers = allUsers.filter(u => u.accountType === USER_TYPES.GUEST);
    const registeredUsers = allUsers.filter(u => u.accountType === USER_TYPES.REGISTERED);
    
    console.log(`👥 Guest users: ${guestUsers.length}`);
    console.log(`👤 Registered users: ${registeredUsers.length}`);
    
    // Check for shared_guest_user specifically
    const sharedGuestUsers = allUsers.filter(u => u.id === 'shared_guest_user');
    console.log(`\n🎯 Shared guest users (id = 'shared_guest_user'): ${sharedGuestUsers.length}`);
    
    if (sharedGuestUsers.length > 1) {
      console.log('❌ PROBLEM: Multiple shared_guest_user accounts found!');
      sharedGuestUsers.forEach((user, index) => {
        console.log(`  ${index + 1}. ID: ${user.id}, Credits: ${user.credits}, Created: ${user.createdAt}`);
      });
    } else if (sharedGuestUsers.length === 1) {
      console.log('✅ Single shared_guest_user account found');
      const user = sharedGuestUsers[0];
      console.log(`  ID: ${user.id}`);
      console.log(`  Credits: ${user.credits}`);
      console.log(`  Account Type: ${user.accountType}`);
      console.log(`  Session Token: ${user.sessionToken || 'None'}`);
      console.log(`  Created: ${user.createdAt}`);
      console.log(`  Last Seen: ${user.lastSeenAt}`);
    } else {
      console.log('⚠️  No shared_guest_user account found');
    }
    
    // Check for users with DEV_BOUND_GUEST_ID
    const devBoundId = process.env.DEV_BOUND_GUEST_ID;
    if (devBoundId) {
      console.log(`\n🔗 DEV_BOUND_GUEST_ID is set to: ${devBoundId}`);
      const boundUsers = allUsers.filter(u => u.id === devBoundId);
      console.log(`Users with DEV_BOUND_GUEST_ID: ${boundUsers.length}`);
      
      if (boundUsers.length > 0) {
        boundUsers.forEach(user => {
          console.log(`  ID: ${user.id}, Credits: ${user.credits}, Type: ${user.accountType}`);
        });
      }
    } else {
      console.log('\n🔗 DEV_BOUND_GUEST_ID is not set');
    }
    
    // Show all guest users with their credits
    console.log('\n📋 All guest users:');
    guestUsers.forEach(user => {
      console.log(`  ${user.id}: ${user.credits} credits (created: ${user.createdAt})`);
    });
    
    // Check for any users with high credit amounts (potential issues)
    const highCreditUsers = allUsers.filter(u => u.credits > 100);
    if (highCreditUsers.length > 0) {
      console.log('\n💰 Users with high credit amounts (>100):');
      highCreditUsers.forEach(user => {
        console.log(`  ${user.id}: ${user.credits} credits (${user.accountType})`);
      });
    }
    
    // Check for duplicate session tokens
    const sessionTokens = allUsers.map(u => u.sessionToken).filter(Boolean);
    const uniqueTokens = new Set(sessionTokens);
    if (sessionTokens.length !== uniqueTokens.size) {
      console.log('\n⚠️  WARNING: Duplicate session tokens found!');
      const duplicates = sessionTokens.filter((token, index) => sessionTokens.indexOf(token) !== index);
      console.log(`  Duplicate tokens: ${duplicates.length}`);
    } else {
      console.log('\n✅ No duplicate session tokens found');
    }
    
    // Summary
    console.log('\n📝 Summary:');
    console.log(`- Total users: ${allUsers.length}`);
    console.log(`- Guest users: ${guestUsers.length}`);
    console.log(`- Registered users: ${registeredUsers.length}`);
    console.log(`- Shared guest users: ${sharedGuestUsers.length}`);
    console.log(`- DEV_BOUND_GUEST_ID: ${devBoundId || 'NOT SET'}`);
    
    if (sharedGuestUsers.length > 1) {
      console.log('\n🚨 ACTION REQUIRED: Multiple shared_guest_user accounts detected!');
      console.log('   This will cause credit deduction issues. Need to clean up duplicates.');
    }
    
  } catch (error) {
    console.error('❌ Error checking user accounts:', error);
  }
}

checkUserAccounts().catch(console.error); 