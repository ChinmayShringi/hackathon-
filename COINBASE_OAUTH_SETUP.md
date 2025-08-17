# Coinbase OAuth Integration Setup Guide

This guide walks you through setting up Coinbase OAuth 2.0 authentication for your application, including **onramp transaction processing**.

## 🎯 What This Integration Provides

- **OAuth 2.0 Authentication**: Secure user authentication with Coinbase
- **Wallet Integration**: Access user wallet information and balances
- **Onramp Processing**: Process fiat-to-crypto transactions directly through OAuth
- **Transaction Management**: Handle credit purchases and USDC conversions

## 🔐 OAuth Application Setup

### 1. Create Coinbase OAuth Application

1. Go to [Coinbase Developer Platform](https://www.coinbase.com/oauth/applications)
2. Click "Create Application"
3. Fill in the application details:
   - **Name**: Your app name (e.g., "Delula OAuth")
   - **Description**: Brief description of your app
   - **Redirect URI**: `https://yourdomain.com/auth/coinbase/callback`
   - **Scopes**: Select `wallet:accounts:read` and `wallet:transactions:read`
4. Save and note your `Client ID` and `Client Secret`

### 2. Generate Ed25519 Key Pair

**Important**: Use the raw Ed25519 private key format (NOT the EC PRIVATE KEY format).

```bash
# Generate Ed25519 key pair
openssl genpkey -algorithm ed25519 -out private_key.pem
openssl pkey -in private_key.pem -pubout -out public_key.pem

# Extract the raw private key (remove headers and newlines)
cat private_key.pem | grep -v "-----" | tr -d '\n'
```

## 🌍 Environment Configuration

Create or update your `.env` file in the project root:

```env
# Coinbase OAuth Configuration
COINBASE_CLIENT_ID=your_client_id_here
COINBASE_CLIENT_SECRET=your_client_secret_here
COINBASE_REDIRECT_URI=https://yourdomain.com/auth/coinbase/callback

# Private Key - Raw Ed25519 Key (no headers, no newlines)
COINBASE_PRIVATE_KEY_PEM=your_raw_ed25519_private_key_here

# OAuth Scopes
COINBASE_SCOPES=wallet:accounts:read,wallet:transactions:read

# Token Expiration (in seconds)
COINBASE_JWT_EXPIRES_IN=300
```

## 🚀 OAuth Flow Implementation

### Frontend OAuth Flow

1. **User clicks "Connect Coinbase Account"**
2. **Redirect to Coinbase authorization URL**:
   ```
   https://www.coinbase.com/oauth/authorize?
     client_id=YOUR_CLIENT_ID&
     redirect_uri=YOUR_REDIRECT_URI&
     response_type=code&
     scope=wallet:accounts:read wallet:transactions:read
   ```
3. **User authorizes your application**
4. **Coinbase redirects back with authorization code**
5. **Exchange code for access token** using `/api/coinbase-oauth/token`

### Backend Token Exchange

The backend handles the OAuth token exchange:

```typescript
// POST /api/coinbase-oauth/token
{
  "grant_type": "authorization_code",
  "code": "TEMPORARY_CODE",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "redirect_uri": "YOUR_REDIRECT_URI"
}
```

## 💰 Onramp Transaction Processing

### New OAuth Onramp Endpoint

**POST** `/api/coinbase-oauth/onramp`

This endpoint processes fiat-to-crypto transactions using OAuth authentication:

```typescript
// Request Body
{
  "amount": 4,                    // Fiat amount in USD
  "currency": "USD",              // Fiat currency
  "asset": "USDC",                // Crypto asset to purchase
  "walletAddress": "0x...",       // Destination wallet
  "userEmail": "user@example.com" // User's email
}

// Response
{
  "success": true,
  "orderId": "order_123",
  "paymentLink": "https://pay.coinbase.com/...",
  "status": "pending",
  "amount": 4,
  "currency": "USD",
  "asset": "USDC",
  "walletAddress": "0x..."
}
```

### How It Works

1. **JWT Generation**: Creates Ed25519-signed JWT for Coinbase API calls
2. **Order Creation**: Calls Coinbase onramp API to create purchase order
3. **Payment Link**: Returns payment link for user to complete transaction
4. **Credit Conversion**: Automatically converts USD to USDC (1 USD = 10 USDC)

### Frontend Integration

The account page now uses OAuth onramp instead of CDP:

```typescript
// Updated onramp button click handler
onClick: async ({ wallet }) => {
  const response = await fetch('/api/coinbase-oauth/onramp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: 4,                    // $4 for credits
      currency: 'USD',
      asset: 'USDC',
      walletAddress: wallet?.address || '',
      userEmail: user?.email || 'guest@example.com'
    })
  });
  
  const onrampData = await response.json();
  
  if (onrampData.paymentLink) {
    window.open(onrampData.paymentLink, '_blank');
  }
}
```

## 🔍 Testing Your Integration

### 1. Test Environment Configuration

```bash
npx tsx scripts/test-coinbase-oauth.ts
```

### 2. Test OAuth Onramp Endpoints

```bash
npx tsx scripts/test-oauth-onramp.ts
```

### 3. Test with Real OAuth Flow

1. Start your development server
2. Navigate to the account page
3. Click "Connect Coinbase Account"
4. Complete OAuth authorization
5. Test the onramp button for $4 credit purchase

## 📋 API Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/coinbase-oauth/token` | POST | Exchange auth code for access token |
| `/api/coinbase-oauth/profile` | GET | Get user profile information |
| `/api/coinbase-oauth/refresh` | POST | Refresh expired access token |
| `/api/coinbase-oauth/onramp` | POST | **Process onramp transactions** |
| `/api/coinbase-oauth/wallet` | GET | Get user wallet information |

## 🔒 Security Features

- **Ed25519 JWT Signing**: Cryptographically secure token generation
- **OAuth 2.0 Standard**: Industry-standard authentication flow
- **No Password Sharing**: Users never share credentials with your app
- **Scoped Access**: Limited permissions (wallet read only)
- **Secure Token Storage**: Access tokens stored securely on client side

## 🚨 Troubleshooting

### Common Issues

1. **"Private key format error"**
   - Ensure you're using raw Ed25519 key, not PEM format
   - Remove all headers and newlines

2. **"OAuth configuration incomplete"**
   - Check all required environment variables are set
   - Verify redirect URI matches exactly

3. **"JWT generation failed"**
   - Verify private key is correct Ed25519 format
   - Check `jose` library is installed

4. **"Onramp API error"**
   - Verify OAuth credentials are correct
   - Check Coinbase API rate limits
   - Ensure wallet address is valid

### Debug Mode

Enable detailed logging by setting:

```env
DEBUG=coinbase-oauth:*
```

## 📚 Additional Resources

- [Coinbase OAuth Documentation](https://docs.cloud.coinbase.com/advanced-trade-api/docs/oauth-overview)
- [Ed25519 Key Generation](https://ed25519.cr.yp.to/)
- [JWT.io](https://jwt.io/) - JWT debugging tool

## 🎉 Next Steps

1. **Complete OAuth setup** following this guide
2. **Test the integration** using provided test scripts
3. **Deploy to production** with proper environment variables
4. **Monitor transactions** through Coinbase dashboard
5. **Integrate with your credit system** to award credits after successful onramp

---

**Note**: This implementation replaces the previous CDP session token approach with a more secure and user-friendly OAuth flow that directly processes onramp transactions.
