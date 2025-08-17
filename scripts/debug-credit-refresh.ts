#!/usr/bin/env tsx

import './_setup-env.ts';
import { storage } from '../server/storage.ts';

async function debugCreditRefresh() {
  console.log('🔍 Debugging credit refresh calculation...\n');
  
  try {
    const userId = 'shared_guest_user';
    const user = await storage.getUser(userId);
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('📊 User data:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Credits: ${user.credits}`);
    console.log(`   Created: ${user.createdAt}`);
    console.log(`   Last refresh: ${user.lastCreditRefresh}`);
    
    const now = new Date();
    const createdAt = user.createdAt ? new Date(user.createdAt) : now;
    
    console.log('\n🕐 Time calculations:');
    console.log(`   Now: ${now.toISOString()}`);
    console.log(`   Created: ${createdAt.toISOString()}`);
    
    // Calculate the next refresh time based on account creation
    const timeSinceCreation = now.getTime() - createdAt.getTime();
    const daysSinceCreation = Math.floor(timeSinceCreation / (24 * 60 * 60 * 1000));
    const nextRefreshTime = new Date(createdAt.getTime() + (daysSinceCreation + 1) * 24 * 60 * 60 * 1000);
    
    console.log(`   Time since creation: ${timeSinceCreation}ms`);
    console.log(`   Days since creation: ${daysSinceCreation}`);
    console.log(`   Next refresh time: ${nextRefreshTime.toISOString()}`);
    
    const secondsUntilNextRefresh = Math.max(0, (nextRefreshTime.getTime() - now.getTime()) / 1000);
    console.log(`   Seconds until next refresh: ${secondsUntilNextRefresh}`);
    
    // Convert to human readable
    const hours = Math.floor(secondsUntilNextRefresh / 3600);
    const minutes = Math.floor((secondsUntilNextRefresh % 3600) / 60);
    const seconds = secondsUntilNextRefresh % 60;
    console.log(`   Time remaining: ${hours}h ${minutes}m ${seconds}s`);
    
    // Test the storage methods
    console.log('\n🧪 Testing storage methods:');
    const refreshInfo = await storage.getCreditRefreshInfo(userId);
    console.log(`   getCreditRefreshInfo.nextRefreshInSeconds: ${refreshInfo.nextRefreshInSeconds}`);
    
    const refreshResult = await storage.checkAndRefreshDailyCredits(userId);
    console.log(`   checkAndRefreshDailyCredits.nextRefreshInSeconds: ${refreshResult.nextRefreshInSeconds}`);
    
    // Test with a low-credit user to see if refresh works
    console.log('\n🧪 Testing with low-credit scenario:');
    const lowCreditUserId = 'test_low_credit_debug';
    
    // Create a test user with low credits
    await storage.upsertUser({
      id: lowCreditUserId,
      email: 'lowcredit@example.com',
      credits: 3,
      lastCreditRefresh: null,
      createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), // 25 hours ago
      updatedAt: new Date().toISOString()
    });
    
    const lowCreditRefreshInfo = await storage.getCreditRefreshInfo(lowCreditUserId);
    console.log(`   Low credit user - Can refresh: ${lowCreditRefreshInfo.canRefresh}`);
    console.log(`   Low credit user - Next refresh in seconds: ${lowCreditRefreshInfo.nextRefreshInSeconds}`);
    
    // Clean up
    await storage.updateUser(lowCreditUserId, { credits: 0 });
    
  } catch (error) {
    console.error('❌ Error debugging credit refresh:', error);
  }
}

debugCreditRefresh(); 