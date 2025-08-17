import express from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as jose from 'jose';
import _sodium from 'libsodium-wrappers';
import base64url from 'base64url';
import { generateJwt } from '@coinbase/cdp-sdk/auth';

const router = express.Router();

// Coinbase OAuth Configuration
interface CoinbaseOAuthConfig {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    privateKeyPath?: string;
    privateKeyPem?: string;
}

// Get Coinbase OAuth configuration from environment
function getCoinbaseOAuthConfig(): CoinbaseOAuthConfig {
    const config: CoinbaseOAuthConfig = {
        clientId: process.env.COINBASE_CLIENT_ID || '',
        clientSecret: process.env.COINBASE_CLIENT_SECRET || '',
        redirectUri: process.env.COINBASE_REDIRECT_URI || '',
    };

    // Handle private key - prefer file path over inline PEM
    if (process.env.COINBASE_PRIVATE_KEY_PATH) {
        config.privateKeyPath = process.env.COINBASE_PRIVATE_KEY_PATH;
    } else if (process.env.COINBASE_PRIVATE_KEY_PEM) {
        config.privateKeyPem = process.env.COINBASE_PRIVATE_KEY_PEM;
    }

    return config;
}

// Read private key from file or environment
function getPrivateKey(): string {
    const config = getCoinbaseOAuthConfig();

    if (config.privateKeyPath) {
        try {
            // Resolve path relative to server directory
            const keyPath = join(__dirname, config.privateKeyPath);
            return readFileSync(keyPath, 'utf8');
        } catch (error) {
            console.error('Error reading private key file:', error);
            throw new Error('Unable to read private key file');
        }
    } else if (config.privateKeyPem) {
        // Handle inline PEM with escaped newlines
        return config.privateKeyPem.replace(/\\n/g, '\n');
    }

    throw new Error('No private key configured');
}

// Generate JWT for Coinbase API calls
async function generateJWT(payload: any, expiresIn: number = 300): Promise<string> {
    try {
        const privateKey = getPrivateKey();

        const now = Math.floor(Date.now() / 1000);
        const jwtPayload = {
            ...payload,
            iss: 'cdp',
            nbf: now,
            exp: now + expiresIn,
            sub: process.env.COINBASE_CLIENT_ID
        };

        // Wait for libsodium to be ready
        await _sodium.ready;
        const sodium = _sodium;

        // Create JWT header following Coinbase CDP format
        const header = {
            typ: "JWT",
            alg: "EdDSA",
            kid: process.env.COINBASE_CLIENT_ID,
            nonce: Buffer.from(sodium.randombytes_buf(16)).toString('hex')
        };

        // Encode header and payload
        const headerBase64URL = base64url(JSON.stringify(header));
        const payloadBase64URL = base64url(JSON.stringify(jwtPayload));
        const headerAndPayload = `${headerBase64URL}.${payloadBase64URL}`;

        let keyBuf: Uint8Array;

        if (privateKey.length === 64) {
            keyBuf = new Uint8Array(
                privateKey.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
            );
        } else if (privateKey.length === 44) {
            keyBuf = new Uint8Array(Buffer.from(privateKey, 'base64'));
        } else if (privateKey.length === 36) {
            let cleanKey = privateKey.replace(/-/g, '');
            if (cleanKey.length === 32) {
                keyBuf = new Uint8Array(
                    cleanKey.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
                );
            } else {
                try {
                    keyBuf = new Uint8Array(Buffer.from(privateKey, 'base64'));
                } catch (e) {
                    keyBuf = new Uint8Array(Buffer.from(privateKey, 'utf8'));
                }
            }
        } else {
            throw new Error(`Invalid Ed25519 private key format. Expected 64 hex chars, 44 base64 chars, or 36 chars, got ${privateKey.length}`);
        }

        if (keyBuf.length !== 32) {
            throw new Error(`Invalid Ed25519 key length. Expected 32 bytes, got ${keyBuf.length} bytes. Your key format may need adjustment.`);
        }

        // Sign the header and payload using libsodium
        const signature = sodium.crypto_sign_detached(headerAndPayload, keyBuf);
        const signatureBase64url = base64url(Buffer.from(signature));

        const jwt = `${headerAndPayload}.${signatureBase64url}`;

        return jwt;
    } catch (error: any) {
        console.error('Error generating JWT:', error);
        console.error('JWT generation error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        throw new Error(`Failed to generate JWT: ${error.message}`);
    }
}

// Exchange authorization code for access token
router.post('/token', async (req, res) => {
    try {
        const { grant_type, code, client_id, client_secret, redirect_uri } = req.body;

        // Validate required parameters
        if (!grant_type || !code || !client_id || !client_secret || !redirect_uri) {
            return res.status(400).json({
                error: 'missing_required_parameters',
                error_description: 'grant_type, code, client_id, client_secret, and redirect_uri are required'
            });
        }

        // Validate grant type
        if (grant_type !== 'authorization_code') {
            return res.status(400).json({
                error: 'unsupported_grant_type',
                error_description: 'Only authorization_code grant type is supported'
            });
        }

        // Validate client credentials
        const config = getCoinbaseOAuthConfig();
        if (client_id !== config.clientId || client_secret !== config.clientSecret) {
            return res.status(401).json({
                error: 'invalid_client',
                error_description: 'Invalid client credentials'
            });
        }

        // Validate redirect URI
        if (redirect_uri !== config.redirectUri) {
            return res.status(400).json({
                error: 'invalid_redirect_uri',
                error_description: 'Redirect URI does not match registered URI'
            });
        }



        // Generate JWT for Coinbase API call
        const jwt = await generateJWT({
            scope: 'wallet:accounts:read wallet:transactions:read',
            sub: client_id
        });

        // Call Coinbase OAuth token endpoint
        const tokenResponse = await fetch('https://login.coinbase.com/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify({
                grant_type: 'authorization_code',
                code: code,
                client_id: client_id,
                client_secret: client_secret,
                redirect_uri: redirect_uri
            })
        });

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json().catch(() => ({}));
            console.error('Coinbase OAuth error:', tokenResponse.status, errorData);

            return res.status(tokenResponse.status).json({
                error: 'token_exchange_failed',
                error_description: 'Failed to exchange authorization code for token',
                details: errorData
            });
        }

        const tokenData = await tokenResponse.json();


        // Return the token data
        res.json({
            access_token: tokenData.access_token,
            token_type: tokenData.token_type || 'Bearer',
            expires_in: tokenData.expires_in,
            refresh_token: tokenData.refresh_token,
            scope: tokenData.scope
        });

    } catch (error) {
        console.error('Error in token exchange:', error);
        res.status(500).json({
            error: 'internal_server_error',
            error_description: 'An internal server error occurred during token exchange'
        });
    }
});

// Get user profile using access token
router.get('/profile', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'invalid_token',
                error_description: 'Valid Bearer token is required'
            });
        }

        const accessToken = authHeader.substring(7);

        // Call Coinbase API to get user profile
        const profileResponse = await fetch('https://api.coinbase.com/v2/user', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'CB-VERSION': '2023-01-01'
            }
        });

        if (!profileResponse.ok) {
            const errorData = await profileResponse.json().catch(() => ({}));
            console.error('Coinbase API error:', profileResponse.status, errorData);

            return res.status(profileResponse.status).json({
                error: 'profile_fetch_failed',
                error_description: 'Failed to fetch user profile',
                details: errorData
            });
        }

        const profileData = await profileResponse.json();
        res.json(profileData);

    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({
            error: 'internal_server_error',
            error_description: 'An internal server error occurred while fetching profile'
        });
    }
});

// Refresh access token
router.post('/refresh', async (req, res) => {
    try {
        const { grant_type, refresh_token, client_id, client_secret } = req.body;

        // Validate required parameters
        if (!grant_type || !refresh_token || !client_id || !client_secret) {
            return res.status(400).json({
                error: 'missing_required_parameters',
                error_description: 'grant_type, refresh_token, client_id, and client_secret are required'
            });
        }

        // Validate grant type
        if (grant_type !== 'refresh_token') {
            return res.status(400).json({
                error: 'unsupported_grant_type',
                error_description: 'Only refresh_token grant type is supported'
            });
        }

        // Validate client credentials
        const config = getCoinbaseOAuthConfig();
        if (client_id !== config.clientId || client_secret !== config.clientSecret) {
            return res.status(401).json({
                error: 'invalid_client',
                error_description: 'Invalid client credentials'
            });
        }



        // Generate JWT for Coinbase API call
        const jwt = await generateJWT({
            scope: 'wallet:accounts:read wallet:transactions:read',
            sub: client_id
        });

        // Call Coinbase OAuth token endpoint for refresh
        const tokenResponse = await fetch('https://login.coinbase.com/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify({
                grant_type: 'refresh_token',
                refresh_token: refresh_token,
                client_id: client_id,
                client_secret: client_secret
            })
        });

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json().catch(() => ({}));
            console.error('Coinbase OAuth refresh error:', tokenResponse.status, errorData);

            return res.status(tokenResponse.status).json({
                error: 'token_refresh_failed',
                error_description: 'Failed to refresh access token',
                details: errorData
            });
        }

        const tokenData = await tokenResponse.json();


        // Return the new token data
        res.json({
            access_token: tokenData.access_token,
            token_type: tokenData.token_type || 'Bearer',
            expires_in: tokenData.expires_in,
            refresh_token: tokenData.refresh_token,
            scope: tokenData.scope
        });

    } catch (error) {
        console.error('Error in token refresh:', error);
        res.status(500).json({
            error: 'internal_server_error',
            error_description: 'An internal server error occurred during token refresh'
        });
    }
});

// Onramp functionality moved to CDP router
// This endpoint is no longer needed as onramp is handled by /api/cdp/onramp

// Get user's Coinbase wallet information
router.get('/wallet', async (req, res) => {
    try {
        const { access_token } = req.query;

        if (!access_token) {
            return res.status(401).json({
                error: 'missing_access_token',
                error_description: 'access_token query parameter is required'
            });
        }



        // Call Coinbase API to get wallet accounts
        const walletResponse = await fetch('https://api.coinbase.com/v2/accounts', {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Accept': 'application/json'
            }
        });

        if (!walletResponse.ok) {
            const errorData = await walletResponse.json().catch(() => ({}));
            console.error('Coinbase wallet API error:', walletResponse.status, errorData);

            return res.status(walletResponse.status).json({
                error: 'wallet_fetch_failed',
                error_description: 'Failed to fetch wallet information',
                details: errorData
            });
        }

        const walletData = await walletResponse.json();


        // Filter and format wallet data
        const accounts = walletData.data
            .filter((account: any) => account.type === 'wallet')
            .map((account: any) => ({
                id: account.id,
                name: account.name,
                currency: account.currency,
                balance: account.balance,
                address: account.address
            }));

        res.json({
            success: true,
            accounts: accounts
        });

    } catch (error) {
        console.error('Error fetching wallet information:', error);
        res.status(500).json({
            error: 'internal_server_error',
            error_description: 'An internal server error occurred while fetching wallet information'
        });
    }
});

export default router;
