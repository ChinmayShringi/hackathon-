#!/usr/bin/env tsx

import './_setup-env.ts';
import { db } from '../server/db.ts';
import { users } from '../shared/schema.ts';
import { eq } from 'drizzle-orm';
import { storage } from '../server/storage.ts';

async function testCreditRefresh() {
  console.log('🧪 Testing credit refresh functionality...\n');
  
  try {
    // Test with a guest user (assuming shared_guest_user exists)
    const testUserId = 'shared_guest_user';
    
    // Get current user info
    const user = await storage.getUser(testUserId);
    if (!user) {
      console.log('❌ Test user not found, creating one...');
      // Create a test user if it doesn't exist
      await storage.upsertUser({
        id: testUserId,
        email: 'test@example.com',
        credits: 5,
        lastCreditRefresh: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    console.log('📊 Current user state:');
    const currentUser = await storage.getUser(testUserId);
    console.log(`   Credits: ${currentUser?.credits}`);
    console.log(`   Last refresh: ${currentUser?.lastCreditRefresh}`);
    console.log(`   Created: ${currentUser?.createdAt}`);
    
    // Test getCreditRefreshInfo
    console.log('\n🔍 Testing getCreditRefreshInfo:');
    const refreshInfo = await storage.getCreditRefreshInfo(testUserId);
    console.log(`   Can refresh: ${refreshInfo.canRefresh}`);
    console.log(`   Next refresh in seconds: ${refreshInfo.nextRefreshInSeconds}`);
    console.log(`   Current credits: ${refreshInfo.currentCredits}`);
    console.log(`   Last refresh time: ${refreshInfo.lastRefreshTime}`);
    
    // Convert seconds to human readable format
    const hours = Math.floor(refreshInfo.nextRefreshInSeconds / 3600);
    const minutes = Math.floor((refreshInfo.nextRefreshInSeconds % 3600) / 60);
    const seconds = refreshInfo.nextRefreshInSeconds % 60;
    console.log(`   Time remaining: ${hours}h ${minutes}m ${seconds}s`);
    
    // Test checkAndRefreshDailyCredits if eligible
    if (refreshInfo.canRefresh) {
      console.log('\n🔄 Testing checkAndRefreshDailyCredits:');
      const refreshResult = await storage.checkAndRefreshDailyCredits(testUserId);
      console.log(`   Refreshed: ${refreshResult.refreshed}`);
      console.log(`   Credits added: ${refreshResult.creditsAdded}`);
      console.log(`   Next refresh in seconds: ${refreshResult.nextRefreshInSeconds}`);
      
      // Get updated info after refresh
      const updatedRefreshInfo = await storage.getCreditRefreshInfo(testUserId);
      console.log('\n📊 Updated state after refresh:');
      console.log(`   Can refresh: ${updatedRefreshInfo.canRefresh}`);
      console.log(`   Next refresh in seconds: ${updatedRefreshInfo.nextRefreshInSeconds}`);
      console.log(`   Current credits: ${updatedRefreshInfo.currentCredits}`);
    } else {
      console.log('\n⏳ User not eligible for refresh (time not up or already has 10+ credits)');
    }
    
    // Test with a low-credit user scenario
    console.log('\n🧪 Testing low-credit user scenario:');
    const lowCreditUserId = 'test_low_credit_user';
    
    // Create a test user with low credits and recent refresh
    await storage.upsertUser({
      id: lowCreditUserId,
      email: 'lowcredit@example.com',
      credits: 3,
      lastCreditRefresh: new Date(Date.now() - 25 * 60 * 60 * 1000), // 25 hours ago (past refresh time)
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const lowCreditRefreshInfo = await storage.getCreditRefreshInfo(lowCreditUserId);
    console.log(`   Low credit user - Can refresh: ${lowCreditRefreshInfo.canRefresh}`);
    console.log(`   Low credit user - Next refresh in seconds: ${lowCreditRefreshInfo.nextRefreshInSeconds}`);
    console.log(`   Low credit user - Current credits: ${lowCreditRefreshInfo.currentCredits}`);
    
    const lowCreditHours = Math.floor(lowCreditRefreshInfo.nextRefreshInSeconds / 3600);
    const lowCreditMinutes = Math.floor((lowCreditRefreshInfo.nextRefreshInSeconds % 3600) / 60);
    console.log(`   Low credit user - Time remaining: ${lowCreditHours}h ${lowCreditMinutes}m`);
    
    // Clean up test user
    await db.delete(users).where(eq(users.id, lowCreditUserId));
    console.log('\n🧹 Cleaned up test user');
    
  } catch (error) {
    console.error('❌ Error testing credit refresh:', error);
  } finally {
    await db.$client.end();
  }
}

testCreditRefresh(); 