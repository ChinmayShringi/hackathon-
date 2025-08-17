#!/usr/bin/env tsx

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testCoinbaseOAuth() {
    const baseUrl = 'http://localhost:3001';

    console.log('Testing Coinbase OAuth Configuration...\n');

    console.log('1. Checking Environment Variables:');
    const envVars = {
        'COINBASE_CLIENT_ID': process.env.COINBASE_CLIENT_ID,
        'COINBASE_CLIENT_SECRET': process.env.COINBASE_CLIENT_SECRET,
        'COINBASE_REDIRECT_URI': process.env.COINBASE_REDIRECT_URI,
        'COINBASE_PRIVATE_KEY_PEM': process.env.COINBASE_PRIVATE_KEY_PEM,
        'COINBASE_PRIVATE_KEY_PATH': process.env.COINBASE_PRIVATE_KEY_PATH
    };

    for (const [envVar, value] of Object.entries(envVars)) {
        if (value) {
            console.log(`   ${envVar}: ${value.substring(0, 10)}...`);
        } else {
            console.log(`   ${envVar}: NOT SET`);
        }
    }

    console.log('\n2. Checking Private Key Configuration:');
    const keyPath = join(__dirname, '..', 'coinbase-oauth.env');
    const privateKeyPath = process.env.COINBASE_PRIVATE_KEY_PATH || keyPath;

    try {
        if (existsSync(privateKeyPath)) {
            console.log(`   Private key file exists at: ${privateKeyPath}`);
        } else {
            console.log(`   Private key file not found at: ${privateKeyPath}`);
            console.log(`   Expected location: ${keyPath}`);
        }
    } catch (error) {
        console.log(`   Error checking private key file: ${error}`);
    }

    if (process.env.COINBASE_PRIVATE_KEY_PEM) {
        console.log('   Private key PEM is configured inline');
    } else {
        console.log('   No private key configuration found');
        console.log('   Set either COINBASE_PRIVATE_KEY_PATH or COINBASE_PRIVATE_KEY_PEM');
    }

    console.log('\n3. OAuth Configuration Summary:');
    const requiredVars = ['COINBASE_CLIENT_ID', 'COINBASE_CLIENT_SECRET', 'COINBASE_REDIRECT_URI'];
    const hasRequiredVars = requiredVars.every(varName => process.env[varName]);

    if (hasRequiredVars) {
        console.log('   All required environment variables are set');
        console.log('   Ready to test OAuth endpoints');
    } else {
        console.log('   Missing required environment variables');
        console.log('   Please check your .env file configuration');
    }

    console.log('\n4. OAuth Endpoint URLs:');
    if (hasRequiredVars) {
        console.log(`   Token Exchange: ${baseUrl}/api/coinbase-oauth/token`);
        console.log(`   Profile Fetch: ${baseUrl}/api/coinbase-oauth/profile`);
        console.log(`   Token Refresh: ${baseUrl}/api/coinbase-oauth/refresh`);
    }

    console.log('\n5. Coinbase OAuth URLs:');
    if (process.env.COINBASE_CLIENT_ID && process.env.COINBASE_REDIRECT_URI) {
        const authUrl = `https://login.coinbase.com/oauth2/authorize?client_id=${process.env.COINBASE_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.COINBASE_REDIRECT_URI)}&response_type=code&scope=wallet:accounts:read`;
        console.log(`   Authorization URL: ${authUrl}`);
    } else {
        console.log('   Cannot generate authorization URL - missing client_id or redirect_uri');
    }

    console.log('\nNext Steps:');
    console.log('   1. Ensure your server is running');
    console.log('   2. Test the /token endpoint with a valid authorization code');
    console.log('   3. Use the returned access token to test /profile endpoint');
    console.log('   4. Test token refresh with /refresh endpoint');
    console.log('\nFor testing, you can use tools like Postman or curl');
}

testCoinbaseOAuth().catch(console.error);
