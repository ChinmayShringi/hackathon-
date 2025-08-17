import express from 'express';
import { generateJwt } from '@coinbase/cdp-sdk/auth';

const router = express.Router();

// Session token endpoint - required first step for CDP onramp
router.post('/session-token', async (req, res) => {
    try {
        const {
            walletAddress,
            asset = 'USDC'
        } = req.body;

        const cdpKeyId = process.env.CDP_KEY_ID;
        const cdpKeySecret = process.env.CDP_KEY_SECRET;

        if (!cdpKeyId || !cdpKeySecret) {
            return res.status(500).json({
                error: 'CDP configuration incomplete. CDP_KEY_ID and CDP_KEY_SECRET are required.'
            });
        }

        const destinationAddress = process.env.CDP_DESTINATION_ADDRESS || walletAddress;
        const destinationNetwork = process.env.CDP_DESTINATION_NETWORK || 'base';

        if (!destinationAddress) {
            return res.status(400).json({
                error: 'missing_required_parameters',
                error_description: 'Either walletAddress in request body or CDP_DESTINATION_ADDRESS environment variable is required'
            });
        }

        const sessionTokenJwt = await generateJwt({
            apiKeyId: cdpKeyId,
            apiKeySecret: cdpKeySecret,
            requestMethod: 'POST',
            requestHost: 'api.developer.coinbase.com',
            requestPath: '/onramp/v1/token',
            expiresIn: 120
        });

        const sessionTokenRequestBody = {
            addresses: [{
                address: destinationAddress,
                blockchains: [destinationNetwork]
            }],
            assets: [asset]
        };

        const sessionTokenResponse = await fetch('https://api.developer.coinbase.com/onramp/v1/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionTokenJwt}`
            },
            body: JSON.stringify(sessionTokenRequestBody)
        });

        if (!sessionTokenResponse.ok) {
            const errorData = await sessionTokenResponse.json().catch(() => ({}));
            console.error('CDP session token API error:', sessionTokenResponse.status, errorData);
            return res.status(sessionTokenResponse.status).json({
                error: 'session_token_failed',
                error_description: 'Failed to get session token from CDP',
                details: errorData
            });
        }

        const sessionTokenData = await sessionTokenResponse.json();
        const sessionToken = sessionTokenData.sessionToken || sessionTokenData.token;

        if (!sessionToken) {
            console.error('CDP session token response missing token:', sessionTokenData);
            return res.status(500).json({
                error: 'session_token_missing',
                error_description: 'No session token received from CDP',
                details: sessionTokenData
            });
        }

        res.json({
            sessionToken: sessionToken,
            destinationAddress: destinationAddress,
            destinationNetwork: destinationNetwork,
            asset: asset
        });

    } catch (error) {
        console.error('CDP session token error:', error);
        res.status(500).json({
            error: 'internal_server_error',
            error_description: 'An internal server error occurred while generating session token'
        });
    }
});

router.post('/onramp', async (req, res) => {
    try {
        const {
            amount,
            currency = 'USD',
            asset = 'USDC',
            walletAddress,
            country = 'US',
            subdivision = 'CA',
            preferredPaymentMethod
        } = req.body;

        if (!amount) {
            return res.status(400).json({
                error: 'missing_required_parameters',
                error_description: 'amount is required'
            });
        }

        const hasWalletAddress = walletAddress && walletAddress.trim() !== '';
        const hasDestinationAddress = process.env.CDP_DESTINATION_ADDRESS;

        if (!hasWalletAddress && !hasDestinationAddress) {
            return res.status(400).json({
                error: 'missing_required_parameters',
                error_description: 'Either walletAddress or CDP_DESTINATION_ADDRESS environment variable is required'
            });
        }

        const cdpKeyId = process.env.CDP_KEY_ID;
        const cdpKeySecret = process.env.CDP_KEY_SECRET;
        const cdpEnv = process.env.CDP_ENV || 'sandbox';

        const destinationAddress = process.env.CDP_DESTINATION_ADDRESS || (walletAddress && walletAddress.trim() !== '' ? walletAddress : null);
        const destinationNetwork = process.env.CDP_DESTINATION_NETWORK || 'base';

        if (!cdpKeyId || !cdpKeySecret) {
            return res.status(500).json({
                error: 'CDP configuration incomplete. CDP_KEY_ID and CDP_KEY_SECRET are required.'
            });
        }

        const sessionTokenJwt = await generateJwt({
            apiKeyId: cdpKeyId,
            apiKeySecret: cdpKeySecret,
            requestMethod: 'POST',
            requestHost: 'api.developer.coinbase.com',
            requestPath: '/onramp/v1/token',
            expiresIn: 120
        });

        const sessionTokenRequestBody = {
            addresses: [{
                address: destinationAddress,
                blockchains: [destinationNetwork]
            }],
            assets: [asset]
        };

        const sessionTokenResponse = await fetch('https://api.developer.coinbase.com/onramp/v1/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionTokenJwt}`
            },
            body: JSON.stringify(sessionTokenRequestBody)
        });

        if (!sessionTokenResponse.ok) {
            const errorData = await sessionTokenResponse.json().catch(() => ({}));
            return res.status(sessionTokenResponse.status).json({
                error: 'session_token_failed',
                error_description: 'Failed to get session token from CDP',
                details: errorData
            });
        }

        const sessionTokenData = await sessionTokenResponse.json();
        const sessionToken = sessionTokenData.sessionToken || sessionTokenData.token;

        if (!sessionToken) {
            return res.status(500).json({
                error: 'session_token_missing',
                error_description: 'No session token received from CDP'
            });
        }

        let paymentMethod = preferredPaymentMethod;

        if (country === 'US' && !paymentMethod) {
            paymentMethod = 'APPLE_PAY';
        }

        const onrampUrl = new URL('https://pay.coinbase.com/buy/select-asset');
        onrampUrl.searchParams.set('appId', process.env.CDP_APP_ID || '');
        onrampUrl.searchParams.set('sessionToken', sessionToken);
        onrampUrl.searchParams.set('defaultPaymentMethod', paymentMethod);
        onrampUrl.searchParams.set('skipPaymentMethodSelection', 'true');
        onrampUrl.searchParams.set('applePayEnabled', 'true');
        onrampUrl.searchParams.set('cardEnabled', 'true');
        onrampUrl.searchParams.set('paymentMethodPriority', paymentMethod);

        res.json({
            onrampUrl: onrampUrl.toString(),
            sessionToken: sessionToken.substring(0, 20) + '...',
            paymentMethod: paymentMethod
        });

    } catch (error) {
        console.error('CDP onramp error:', error);
        res.status(500).json({
            error: 'internal_server_error',
            error_description: 'An internal server error occurred while processing the onramp request'
        });
    }
});

export default router;
