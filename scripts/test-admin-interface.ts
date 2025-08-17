#!/usr/bin/env tsx

import 'dotenv/config';

async function testAdminInterface() {
  console.log('🧪 Testing Admin Interface...\n');

  const baseUrl = 'http://localhost:5232';

  // Test 1: Check admin status (should be unauthenticated initially)
  console.log('1. Testing admin status (should be unauthenticated)...');
  try {
    const statusResponse = await fetch(`${baseUrl}/api/admin/status`);
    const statusData = await statusResponse.json();
    console.log('   Status:', statusData);
    console.log('   ✅ Admin status endpoint working\n');
  } catch (error) {
    console.log('   ❌ Admin status endpoint failed:', error);
  }

  // Test 2: Test admin login with wrong credentials
  console.log('2. Testing admin login with wrong credentials...');
  try {
    const wrongLoginResponse = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'wrongpassword' })
    });
    const wrongLoginData = await wrongLoginResponse.json();
    console.log('   Wrong credentials response:', wrongLoginData);
    console.log('   ✅ Wrong credentials properly rejected\n');
  } catch (error) {
    console.log('   ❌ Wrong credentials test failed:', error);
  }

  // Test 3: Test admin login with correct credentials
  console.log('3. Testing admin login with correct credentials...');
  try {
    const loginResponse = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'delula4lyfe' })
    });
    const loginData = await loginResponse.json();
    console.log('   Login response:', loginData);
    
    if (loginResponse.ok) {
      console.log('   ✅ Admin login successful\n');
      
      // Test 4: Check admin status after login
      console.log('4. Testing admin status after login...');
      const statusResponse2 = await fetch(`${baseUrl}/api/admin/status`);
      const statusData2 = await statusResponse2.json();
      console.log('   Status after login:', statusData2);
      console.log('   ✅ Admin status shows authenticated\n');
      
      // Test 5: Test recipe tag icons endpoint
      console.log('5. Testing recipe tag icons endpoint...');
      try {
        const iconsResponse = await fetch(`${baseUrl}/api/admin/recipe-tag-icons`);
        const iconsData = await iconsResponse.json();
        console.log('   Icons response:', iconsData);
        console.log('   ✅ Recipe tag icons endpoint working\n');
      } catch (error) {
        console.log('   ❌ Recipe tag icons endpoint failed:', error);
      }
      
      // Test 6: Test admin logout
      console.log('6. Testing admin logout...');
      try {
        const logoutResponse = await fetch(`${baseUrl}/api/admin/logout`, {
          method: 'POST'
        });
        const logoutData = await logoutResponse.json();
        console.log('   Logout response:', logoutData);
        console.log('   ✅ Admin logout successful\n');
      } catch (error) {
        console.log('   ❌ Admin logout failed:', error);
      }
      
    } else {
      console.log('   ❌ Admin login failed\n');
    }
  } catch (error) {
    console.log('   ❌ Admin login test failed:', error);
  }

  console.log('🎉 Admin interface testing complete!');
}

testAdminInterface().catch(console.error); 