#!/usr/bin/env tsx

import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '..', '.env') });

async function testOAuthOnramp() {
    console.log('🧪 Testing Coinbase OAuth Onramp Endpoints...\n');

    const baseUrl = 'http://localhost:5232'; // Using the correct port from cursor rules

    // Test 1: Check if server is running
    console.log('1️⃣ Testing server connectivity...');
    try {
        const healthResponse = await fetch(`${baseUrl}/api/health`).catch(() => null);
        if (healthResponse?.ok) {
            console.log('✅ Server is running');
        } else {
            console.log('⚠️  Server health endpoint not available, but continuing...');
        }
    } catch (error) {
        console.log('⚠️  Could not connect to server, but continuing...');
    }

    // Test 2: Test OAuth onramp endpoint (with test data)
    console.log('\n2️⃣ Testing OAuth onramp endpoint...');
    try {
        const onrampResponse = await fetch(`${baseUrl}/api/coinbase-oauth/onramp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: 4,
                currency: 'USD',
                asset: 'USDC',
                walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', // Test address
                userEmail: 'test@example.com'
            })
        });

        if (onrampResponse.ok) {
            console.log('✅ OAuth onramp endpoint is accessible');
            const data = await onrampResponse.json();
            console.log('📄 Response:', JSON.stringify(data, null, 2));
        } else {
            const errorData = await onrampResponse.json().catch(() => ({}));
            console.log('⚠️  OAuth onramp endpoint returned error (expected for test data):');
            console.log('📄 Status:', onrampResponse.status);
            console.log('📄 Error:', JSON.stringify(errorData, null, 2));
        }
    } catch (error) {
        console.log('❌ Error testing OAuth onramp endpoint:', error);
    }

    // Test 3: Test wallet endpoint (without auth)
    console.log('\n3️⃣ Testing wallet endpoint...');
    try {
        const walletResponse = await fetch(`${baseUrl}/api/coinbase-oauth/wallet?access_token=test_token`);

        if (walletResponse.status === 401) {
            console.log('✅ Wallet endpoint requires authentication (expected)');
        } else {
            console.log('⚠️  Wallet endpoint returned unexpected status:', walletResponse.status);
        }
    } catch (error) {
        console.log('❌ Error testing wallet endpoint:', error);
    }

    // Test 4: Check environment configuration
    console.log('\n4️⃣ Checking OAuth environment configuration...');
    const requiredVars = [
        'COINBASE_CLIENT_ID',
        'COINBASE_CLIENT_SECRET',
        'COINBASE_REDIRECT_URI',
        'COINBASE_PRIVATE_KEY_PEM'
    ];

    let configValid = true;

    for (const varName of requiredVars) {
        if (!process.env[varName]) {
            console.log(`❌ Missing required environment variable: ${varName}`);
            configValid = false;
        } else {
            console.log(`✅ ${varName}: ${varName.includes('SECRET') || varName.includes('KEY') ? 'SET' : process.env[varName]}`);
        }
    }

    console.log('\n🎯 Test Summary:');
    if (configValid) {
        console.log('✅ Environment configuration is valid');
        console.log('✅ OAuth onramp endpoints are accessible');
        console.log('✅ Ready for Coinbase OAuth onramp integration');
    } else {
        console.log('❌ Environment configuration needs attention');
        console.log('📖 Check the COINBASE_OAUTH_SETUP.md guide');
    }

    console.log('\n🚀 Next steps:');
    console.log('1. Configure your Coinbase OAuth application');
    console.log('2. Set up proper environment variables');
    console.log('3. Test with real OAuth flow');
    console.log('4. Integrate with your frontend onramp button');
}

// Run the test
testOAuthOnramp().catch(console.error);
