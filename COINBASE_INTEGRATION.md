# Coinbase Commerce Integration

This document explains how to set up and use Coinbase Commerce for credit purchases in MagicVidCreator.

## Environment Variables Required

Add these to your `.env` file:

```bash
# Coinbase Commerce Configuration
COINBASE_API_KEY=your_coinbase_commerce_api_key_here
COINBASE_WEBHOOK_SECRET=your_coinbase_webhook_secret_here
COINBASE_BASE_URL=https://api.commerce.coinbase.com
```

## Setup Steps

### 1. Create Coinbase Commerce Account
1. Go to [Coinbase Commerce](https://commerce.coinbase.com/)
2. Sign up for a merchant account
3. Complete the verification process

### 2. Get API Credentials
1. In your Coinbase Commerce dashboard, go to Settings > API Keys
2. Create a new API key with appropriate permissions
3. Copy the API key and add it to `COINBASE_API_KEY`

### 3. Configure Webhooks
1. In your Coinbase Commerce dashboard, go to Settings > Webhooks
2. Add a new webhook with URL: `https://yourdomain.com/api/payments/webhook`
3. Select the `charge:confirmed` event
4. Copy the webhook secret and add it to `COINBASE_WEBHOOK_SECRET`

### 4. Update Frontend
The frontend pricing component (`client/src/components/pricing-section.tsx`) already has the correct API endpoint (`/api/payments/create-checkout`), so no changes are needed there.

## How It Works

### 1. User Initiates Purchase
- User clicks "Get Credits" on pricing page
- Frontend calls `/api/payments/create-checkout`
- Backend creates a Coinbase Commerce charge
- User is redirected to Coinbase hosted checkout

### 2. Payment Processing
- User completes payment on Coinbase (crypto, cards, etc.)
- Coinbase sends webhook to `/api/payments/webhook`
- Backend verifies webhook signature
- Credits are added to user account

### 3. Success Handling
- User is redirected back to success page
- Backend verifies payment status with Coinbase
- User is redirected to dashboard with success message

## Supported Payment Methods

- **Cryptocurrencies**: BTC, ETH, USDC, USDT, DAI
- **Traditional**: Credit cards, bank transfers
- **Digital Wallets**: Apple Pay, Google Pay

## Security Features

- Webhook signature verification using HMAC-SHA256
- Environment variable configuration for sensitive data
- Proper error handling and logging
- Transaction metadata tracking

## Testing

For development/testing, you can use Coinbase Commerce's sandbox environment by setting:
```bash
COINBASE_BASE_URL=https://api-sandbox.commerce.coinbase.com
```

## Troubleshooting

### Common Issues:
1. **Webhook not receiving**: Check webhook URL and firewall settings
2. **Signature verification failed**: Verify webhook secret is correct
3. **API key errors**: Ensure API key has proper permissions
4. **Payment not processing**: Check webhook event types and metadata

### Logs to Monitor:
- Check server logs for payment processing errors
- Monitor webhook delivery in Coinbase dashboard
- Verify credit transactions in database

## API Endpoints

- `POST /api/payments/create-checkout` - Create checkout session
- `POST /api/payments/webhook` - Handle Coinbase webhooks
- `GET /api/payments/success` - Payment success page

## Database Changes

No database schema changes are required. The existing `credit_transactions` table with `payment_id` field will store Coinbase charge IDs.
