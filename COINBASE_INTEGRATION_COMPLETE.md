# Complete Coinbase Commerce Integration

This document provides a comprehensive guide for the complete Coinbase Commerce integration in MagicVidCreator, including both frontend and backend components.

##  What's Been Implemented

### Backend (Server)
- **Payment Router** (`server/payment-router.ts`) - Complete Coinbase Commerce integration
- **User Router** (`server/user-router.ts`) - User credits and transaction management
- **Webhook Handling** - Secure payment confirmation processing
- **Credit Management** - Automatic credit allocation after successful payments

### Frontend (Client)
- **Payment Modal** (`components/coinbase-payment-modal.tsx`) - Interactive payment flow
- **Updated Pricing Section** (`components/pricing-section.tsx`) - Coinbase integration
- **Payment Success Page** (`pages/payment-success.tsx`) - Post-payment experience
- **Payment History** (`components/payment-history.tsx`) - Transaction tracking
- **Payment Hook** (`hooks/use-payment-status.ts`) - State management

## Setup Instructions

### 1. Environment Variables

Add these to your `.env` file:

```bash
# Coinbase Commerce Configuration
COINBASE_API_KEY=your_coinbase_commerce_api_key_here
COINBASE_WEBHOOK_SECRET=your_coinbase_webhook_secret_here
COINBASE_BASE_URL=https://api.commerce.coinbase.com

# For development/testing (optional)
COINBASE_BASE_URL=https://api-sandbox.commerce.coinbase.com
```

### 2. Coinbase Commerce Account Setup

1. **Create Account**: Go to [commerce.coinbase.com](https://commerce.coinbase.com/)
2. **Verify Account**: Complete the verification process
3. **Get API Key**: 
   - Go to Settings > API Keys
   - Create a new API key with appropriate permissions
   - Copy the API key to `COINBASE_API_KEY`
4. **Configure Webhooks**:
   - Go to Settings > Webhooks
   - Add webhook URL: `https://yourdomain.com/api/payments/webhook`
   - Select event: `charge:confirmed`
   - Copy webhook secret to `COINBASE_WEBHOOK_SECRET`

### 3. Database Schema

No changes required! The existing schema supports Coinbase integration:
- `credit_transactions` table stores all payment records
- `users.credits` field tracks available credits
- `payment_id` field stores Coinbase charge IDs

## How It Works

### 1. User Initiates Purchase
```
User clicks "Get Credits" → Frontend opens payment modal → Backend creates Coinbase charge
```

### 2. Payment Processing
```
User completes payment on Coinbase → Coinbase sends webhook → Backend verifies and allocates credits
```

### 3. Success Flow
```
User redirected to success page → Credits added to account → User can start creating content
```

## Frontend Components

### Payment Modal (`CoinbasePaymentModal`)
- **Features**: Plan summary, payment status, Coinbase checkout integration
- **States**: Loading, processing, success, failed
- **Actions**: Create checkout, retry on failure, external checkout

### Pricing Section (Updated)
- **Integration**: Seamless Coinbase payment flow
- **Plans**: Credit packages and subscription options
- **Payment Methods**: Crypto, cards, digital wallets

### Payment Success Page
- **Verification**: Confirms payment with Coinbase API
- **User Experience**: Clear success confirmation and next steps
- **Navigation**: Directs to dashboard or home

### Payment History
- **Transaction Display**: Complete payment and usage history
- **Credit Balance**: Real-time credit display
- **Status Tracking**: Payment status and transaction details

##  Backend API Endpoints

### Payment Endpoints
- `POST /api/payments/create-checkout` - Create Coinbase checkout session
- `POST /api/payments/webhook` - Handle Coinbase webhooks
- `GET /api/payments/success` - Payment success verification

### User Endpoints
- `GET /api/user/credits` - Get user credit balance
- `GET /api/user/transactions` - Get transaction history
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## Security Features

### Webhook Verification
- HMAC-SHA256 signature verification
- Environment variable configuration
- Secure payment processing

### Authentication
- All payment endpoints require user authentication
- Session-based security
- User-specific transaction tracking

### Data Protection
- No sensitive data stored in frontend
- Secure API communication
- Transaction metadata encryption

##  Testing

### Development Environment
```bash
# Use sandbox API
COINBASE_BASE_URL=https://api-sandbox.commerce.coinbase.com

# Test with sandbox webhooks
# Monitor server logs for payment events
```

### Testing Flow
1. **Create Test Account**: Use Coinbase Commerce sandbox
2. **Test Payments**: Use test payment methods
3. **Verify Webhooks**: Check webhook delivery in dashboard
4. **Monitor Credits**: Verify credit allocation

## Monitoring & Debugging

### Server Logs
```bash
# Payment processing
console.log(`Payment processed successfully for user ${userId}: ${credits} credits via Coinbase`);

# Webhook events
console.log('Webhook received:', event.type);

# Error handling
console.error('Payment error:', error);
```

### Frontend Debugging
- Browser console for payment flow
- Network tab for API calls
- React DevTools for component state

## Troubleshooting

### Common Issues

#### 1. Webhook Not Receiving
- **Check**: Webhook URL configuration
- **Verify**: Firewall and server settings
- **Test**: Use Coinbase webhook testing tool

#### 2. Payment Not Processing
- **Check**: API key permissions
- **Verify**: Webhook event types
- **Monitor**: Server logs for errors

#### 3. Credits Not Adding
- **Check**: Webhook signature verification
- **Verify**: Database transaction logs
- **Monitor**: Credit balance updates

### Debug Commands
```bash
# Check payment status
curl -X GET "https://api.commerce.coinbase.com/charges/{charge_id}" \
  -H "X-CC-Api-Key: {your_api_key}"

# Verify webhook signature
# Check server logs for signature verification
```

## Future Enhancements

### Planned Features
- **Subscription Management**: Automatic recurring payments
- **Payment Analytics**: Revenue tracking and reporting
- **Multi-Currency**: Support for different fiat currencies
- **Advanced Webhooks**: More payment event types

### Integration Options
- **Stripe**: Alternative payment processor
- **PayPal**: Additional payment method
- **Crypto Wallets**: Direct blockchain payments

## API Documentation

### Coinbase Commerce API
- **Base URL**: `https://api.commerce.coinbase.com`
- **Version**: `2018-03-22`
- **Authentication**: API Key in `X-CC-Api-Key` header

### Supported Payment Methods
- **Cryptocurrencies**: BTC, ETH, USDC, USDT, DAI
- **Traditional**: Credit cards, bank transfers
- **Digital Wallets**: Apple Pay, Google Pay

## Best Practices

### Development
- Always use environment variables for sensitive data
- Implement proper error handling and logging
- Test webhook signatures in production
- Monitor payment processing logs

### Production
- Use HTTPS for all webhook endpoints
- Implement rate limiting for payment APIs
- Set up monitoring and alerting
- Regular security audits

### User Experience
- Clear payment flow and status updates
- Helpful error messages and recovery options
- Seamless integration with existing UI
- Mobile-responsive payment forms

## Support

### Coinbase Commerce Support
- [Documentation](https://commerce.coinbase.com/docs)
- [API Reference](https://commerce.coinbase.com/docs/api)
- [Support Portal](https://help.coinbase.com/)

### MagicVidCreator Support
- Check server logs for detailed error information
- Verify environment variable configuration
- Test with sandbox environment first
- Monitor webhook delivery in Coinbase dashboard

---

**Status**:  Complete and Ready for Production
**Last Updated**: Current Date
**Version**: 1.0.0
