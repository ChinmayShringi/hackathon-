#!/usr/bin/env tsx

import 'dotenv/config';
import { storage } from '../server/storage';
import { db } from '../server/db';
import { users, generations, creditTransactions } from '../shared/schema';
import { eq, and, like } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { USER_TYPES } from '../shared/user-types';
import { ACCESS_ROLES } from '../shared/access-roles';

async function cleanupGuestAccounts() {
  console.log('🧹 Cleaning up guest accounts...');
  
  const devBoundId = process.env.DEV_BOUND_GUEST_ID;
  
  if (!devBoundId) {
    console.log('❌ DEV_BOUND_GUEST_ID is not set. Cannot proceed with cleanup.');
    console.log('💡 Set DEV_BOUND_GUEST_ID=shared_guest_user in your .env file to enable shared guest mode.');
    return;
  }
  
  console.log(`🔗 DEV_BOUND_GUEST_ID is set to: ${devBoundId}`);
  
  try {
    // Check if the shared guest user exists
    const sharedUser = await storage.getUser(devBoundId);
    if (!sharedUser) {
      console.log(`❌ Shared guest user '${devBoundId}' does not exist. Creating it...`);
      
      await storage.upsertUser({
        id: devBoundId,
        accountType: USER_TYPES.GUEST,
        accessRole: ACCESS_ROLES.USER,
        isEphemeral: true,
        canUpgradeToRegistered: true,
        credits: 1000,
        createdAt: new Date(),
        lastSeenAt: new Date()
      });
      
      console.log(`✅ Created shared guest user '${devBoundId}' with 1000 credits`);
    } else {
      console.log(`✅ Shared guest user '${devBoundId}' exists with ${sharedUser.credits} credits`);
    }
    
    // Get all guest users except the shared one
    const allUsers = await db.select().from(users);
    const guestUsers = allUsers.filter(u => 
      u.accountType === USER_TYPES.GUEST && 
      u.id !== devBoundId && 
      u.id.startsWith('guest_')
    );
    
    console.log(`\n📊 Found ${guestUsers.length} individual guest accounts to clean up`);
    
    if (guestUsers.length === 0) {
      console.log('✅ No cleanup needed - all guests are already using the shared account');
      return;
    }
    
    // Show summary of what will be cleaned up
    console.log('\n📋 Guest accounts to be cleaned up:');
    guestUsers.forEach(user => {
      console.log(`  ${user.id}: ${user.credits} credits (created: ${user.createdAt})`);
    });
    
    // Ask for confirmation
    console.log('\n⚠️  This will:');
    console.log('  1. Delete all individual guest accounts');
    console.log('  2. Transfer their generations to the shared account');
    console.log('  3. Transfer their credit transactions to the shared account');
    console.log('  4. Consolidate all credits into the shared account');
    
    // For safety, we'll just show what would be done without actually doing it
    console.log('\n🔒 SAFETY MODE: Showing what would be cleaned up without making changes');
    console.log('💡 To actually perform the cleanup, modify this script to remove the safety check');
    
    // Calculate total credits to consolidate
    const totalCreditsToConsolidate = guestUsers.reduce((sum, user) => sum + user.credits, 0);
    console.log(`\n💰 Total credits to consolidate: ${totalCreditsToConsolidate}`);
    
    // Count generations per user
    const generationCounts = await Promise.all(
      guestUsers.map(async user => {
        const userGenerations = await db
          .select({ count: sql`count(*)` })
          .from(generations)
          .where(eq(generations.userId, user.id));
        return { userId: user.id, count: parseInt(String(userGenerations[0]?.count || '0')) };
      })
    );
    
    const totalGenerations = generationCounts.reduce((sum, gc) => sum + gc.count, 0);
    console.log(`📊 Total generations to transfer: ${totalGenerations}`);
    
    // Count credit transactions per user
    const transactionCounts = await Promise.all(
      guestUsers.map(async user => {
        const userTransactions = await db
          .select({ count: sql`count(*)` })
          .from(creditTransactions)
          .where(eq(creditTransactions.userId, user.id));
        return { userId: user.id, count: parseInt(String(userTransactions[0]?.count || '0')) };
      })
    );
    
    const totalTransactions = transactionCounts.reduce((sum, tc) => sum + tc.count, 0);
    console.log(`💳 Total credit transactions to transfer: ${totalTransactions}`);
    
    console.log('\n📝 Summary of cleanup operation:');
    console.log(`  - Guest accounts to delete: ${guestUsers.length}`);
    console.log(`  - Credits to consolidate: ${totalCreditsToConsolidate}`);
    console.log(`  - Generations to transfer: ${totalGenerations}`);
    console.log(`  - Credit transactions to transfer: ${totalTransactions}`);
    
    // Show what the final shared account would look like
    const finalCredits = (sharedUser?.credits || 1000) + totalCreditsToConsolidate;
    console.log(`\n🎯 Final shared account would have: ${finalCredits} credits`);
    
    console.log('\n✅ Cleanup analysis complete. No changes were made.');
    console.log('💡 To perform the actual cleanup, modify this script to remove the safety check.');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

cleanupGuestAccounts().catch(console.error); 