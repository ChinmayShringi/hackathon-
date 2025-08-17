#!/usr/bin/env tsx

import './_setup-env.ts';

async function testGuestStatsAPI() {
  console.log('🧪 Testing guest-stats API endpoint...\n');
  
  try {
    // Make a request to the guest-stats endpoint
    const response = await fetch('http://localhost:5232/api/alpha/guest-stats', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.error(`❌ API request failed: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('📊 Guest stats response:');
    console.log(`   Used: ${data.used}`);
    console.log(`   Remaining: ${data.remaining}`);
    console.log(`   Refresh seconds left: ${data.refreshSecondsLeft}`);
    
    // Convert seconds to human readable format
    if (data.refreshSecondsLeft !== undefined) {
      const hours = Math.floor(data.refreshSecondsLeft / 3600);
      const minutes = Math.floor((data.refreshSecondsLeft % 3600) / 60);
      const seconds = data.refreshSecondsLeft % 60;
      console.log(`   Time remaining: ${hours}h ${minutes}m ${seconds}s`);
    } else {
      console.log('   Time remaining: undefined (this is the bug!)');
    }
    
    // Test the countdown hook logic
    console.log('\n🔍 Testing countdown display logic:');
    if (data.refreshSecondsLeft !== undefined && data.refreshSecondsLeft >= 0) {
      console.log('✅ Countdown should be visible');
      console.log(`   msRemaining: ${data.refreshSecondsLeft * 1000}`);
      console.log(`   subtext: should show countdown`);
    } else {
      console.log('❌ Countdown will not be visible');
      console.log('   This means the "visit daily for free credits" message won\'t show');
    }
    
  } catch (error) {
    console.error('❌ Error testing guest-stats API:', error);
  }
}

testGuestStatsAPI(); 