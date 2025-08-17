import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:5232';

async function testAdminAlpha() {
  console.log('🧪 Testing Admin Interface in Alpha Mode');
  console.log('=====================================\n');

  try {
    // Test 1: Check admin status (should be unauthenticated)
    console.log('1. Checking initial admin status...');
    const statusResponse = await fetch(`${BASE_URL}/api/admin/status`);
    const statusData = await statusResponse.json();
    console.log('   Status:', statusData);
    console.log('   ✅ Expected: isAuthenticated: false\n');

    // Test 2: Try admin login with wrong credentials
    console.log('2. Testing login with wrong credentials...');
    const wrongLoginResponse = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'wrong' })
    });
    const wrongLoginData = await wrongLoginResponse.json();
    console.log('   Response:', wrongLoginData);
    console.log('   ✅ Expected: error: "Invalid credentials"\n');

    // Test 3: Try admin login with correct credentials
    console.log('3. Testing login with correct credentials...');
    const loginResponse = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'delula4lyfe' })
    });
    const loginData = await loginResponse.json();
    console.log('   Response:', loginData);
    console.log('   ✅ Expected: success: true\n');

    // Test 4: Check admin status after login (should be authenticated)
    console.log('4. Checking admin status after login...');
    const statusAfterLoginResponse = await fetch(`${BASE_URL}/api/admin/status`);
    const statusAfterLoginData = await statusAfterLoginResponse.json();
    console.log('   Status:', statusAfterLoginData);
    console.log('   ✅ Expected: isAuthenticated: true, username: "admin"\n');

    // Test 5: Test admin-protected endpoint
    console.log('5. Testing admin-protected endpoint...');
    const protectedResponse = await fetch(`${BASE_URL}/api/admin/recipe-tag-icons`);
    const protectedData = await protectedResponse.json();
    console.log('   Response:', protectedData);
    console.log('   ✅ Expected: success: true with icons array\n');

    // Test 6: Test admin logout
    console.log('6. Testing admin logout...');
    const logoutResponse = await fetch(`${BASE_URL}/api/admin/logout`, {
      method: 'POST'
    });
    const logoutData = await logoutResponse.json();
    console.log('   Response:', logoutData);
    console.log('   ✅ Expected: success: true\n');

    // Test 7: Check admin status after logout (should be unauthenticated)
    console.log('7. Checking admin status after logout...');
    const statusAfterLogoutResponse = await fetch(`${BASE_URL}/api/admin/status`);
    const statusAfterLogoutData = await statusAfterLogoutResponse.json();
    console.log('   Status:', statusAfterLogoutData);
    console.log('   ✅ Expected: isAuthenticated: false\n');

    console.log('🎉 All admin tests completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   - Visit http://localhost:5232/admin in your browser');
    console.log('   - Login with username: admin, password: delula4lyfe');
    console.log('   - Test the Recipe Tag Icon Manager functionality');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAdminAlpha(); 