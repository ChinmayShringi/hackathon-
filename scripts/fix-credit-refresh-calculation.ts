#!/usr/bin/env tsx

import './_setup-env.ts';
import { storage } from '../server/storage.ts';
import { db } from '../server/db.ts';
import { users } from '../shared/schema.ts';
import { eq } from 'drizzle-orm';

async function fixCreditRefreshCalculation() {
  console.log('🔧 Fixing credit refresh calculation...\n');
  
  try {
    // Get all users to check their credit refresh state
    const allUsers = await db.select().from(users);
    
    console.log(`📊 Found ${allUsers.length} total users`);
    
    let fixedCount = 0;
    let skippedCount = 0;
    
    for (const user of allUsers) {
      console.log(`\n👤 User: ${user.id}`);
      console.log(`   Credits: ${user.credits}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log(`   Last refresh: ${user.lastCreditRefresh}`);
      
      const now = new Date();
      const createdAt = user.createdAt ? new Date(user.createdAt) : null;
      
      // Check if lastCreditRefresh is problematic
      let needsFix = false;
      let reason = '';
      
      if (!user.lastCreditRefresh) {
        // No lastCreditRefresh set - this is fine for new users
        console.log('   ✅ No lastCreditRefresh set (normal for new users)');
        skippedCount++;
        continue;
      }
      
      const lastRefresh = new Date(user.lastCreditRefresh);
      
      // Check if lastCreditRefresh is in the future (obviously wrong)
      if (lastRefresh > now) {
        needsFix = true;
        reason = 'lastCreditRefresh is in the future';
      }
      
      // Check if lastCreditRefresh is before account creation (impossible)
      if (createdAt && lastRefresh < createdAt) {
        needsFix = true;
        reason = 'lastCreditRefresh is before account creation';
      }
      
      // Check if lastCreditRefresh is more than 30 days old (suspicious for active users)
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      if (lastRefresh < thirtyDaysAgo && user.credits < 10) {
        needsFix = true;
        reason = 'lastCreditRefresh is very old and user has low credits';
      }
      
      if (needsFix) {
        console.log(`   ❌ Needs fix: ${reason}`);
        
        // Reset lastCreditRefresh to null so it will use createdAt as the base
        await storage.updateUser(user.id, {
          lastCreditRefresh: null,
          updatedAt: now
        });
        
        console.log('   ✅ Fixed: Reset lastCreditRefresh to null');
        fixedCount++;
        
        // Verify the fix
        const updatedUser = await storage.getUser(user.id);
        const refreshInfo = await storage.getCreditRefreshInfo(user.id);
        console.log(`   📊 After fix:`);
        console.log(`      Last refresh: ${updatedUser?.lastCreditRefresh}`);
        console.log(`      Can refresh: ${refreshInfo.canRefresh}`);
        console.log(`      Next refresh in seconds: ${refreshInfo.nextRefreshInSeconds}`);
      } else {
        console.log('   ✅ No fix needed');
        skippedCount++;
      }
    }
    
    console.log(`\n📈 Summary:`);
    console.log(`   Fixed: ${fixedCount} users`);
    console.log(`   Skipped: ${skippedCount} users`);
    console.log(`   Total: ${allUsers.length} users`);
    
    // Test the shared_guest_user specifically
    console.log('\n🧪 Testing shared_guest_user specifically:');
    const sharedGuest = await storage.getUser('shared_guest_user');
    if (sharedGuest) {
      const refreshInfo = await storage.getCreditRefreshInfo('shared_guest_user');
      console.log(`   Credits: ${sharedGuest.credits}`);
      console.log(`   Created: ${sharedGuest.createdAt}`);
      console.log(`   Last refresh: ${sharedGuest.lastCreditRefresh}`);
      console.log(`   Can refresh: ${refreshInfo.canRefresh}`);
      console.log(`   Next refresh in seconds: ${refreshInfo.nextRefreshInSeconds}`);
      
      // Convert seconds to human readable format
      if (refreshInfo.nextRefreshInSeconds > 0) {
        const hours = Math.floor(refreshInfo.nextRefreshInSeconds / 3600);
        const minutes = Math.floor((refreshInfo.nextRefreshInSeconds % 3600) / 60);
        const seconds = refreshInfo.nextRefreshInSeconds % 60;
        console.log(`   Time remaining: ${hours}h ${minutes}m ${seconds}s`);
      } else {
        console.log(`   Time remaining: 0s (can refresh now)`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error fixing credit refresh calculation:', error);
  }
}

fixCreditRefreshCalculation(); 