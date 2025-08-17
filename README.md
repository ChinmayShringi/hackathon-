# Coinbase CDP Integration Demo

A React TypeScript application demonstrating Coinbase CDP (Coinbase Developer Platform) integration with dynamic OAuth authentication and onramp functionality.

## Features

- **Coinbase CDP Onramp Integration** - Direct fiat-to-crypto onramp using Coinbase Pay
- **Dynamic OAuth Authentication** - Seamless Coinbase wallet connection
- **Session Token Management** - Secure JWT-based API authentication
- **Payment Processing** - Credit purchase system with multiple payment methods
- **Modern React Frontend** - TypeScript, Tailwind CSS, shadcn/ui components

## Quick Start

### Prerequisites
- Node.js 22.12+
- Coinbase Developer Platform account
- Environment variables configured

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd hackathon

# Install dependencies
npm install

# Set up environment variables
cp coinbase.env.example .env
# Edit .env with your CDP credentials

# Start development server
npm run dev
```

### Environment Setup

Configure these environment variables:

```bash
# Coinbase CDP Configuration
CDP_ENV=sandbox
CDP_KEY_ID=ak_sandbox_xxxxx
CDP_KEY_SECRET=your_private_key_here
CDP_DESTINATION_ADDRESS=your_wallet_address
CDP_DESTINATION_NETWORK=base

# Coinbase OAuth Configuration
COINBASE_CLIENT_ID=your_client_id
COINBASE_CLIENT_SECRET=your_client_secret
COINBASE_REDIRECT_URI=http://localhost:3000/auth/callback
```

## Core Components

### CDP Integration
- **Session Token Generation** - Creates secure session tokens for Coinbase Pay
- **Onramp Functionality** - Direct integration with Coinbase onramp services
- **Multi-Payment Support** - Apple Pay, Google Pay, credit cards, crypto

### OAuth Authentication
- **Wallet Connection** - Connect user's Coinbase wallet
- **Token Management** - Secure access token handling
- **Profile Access** - Read user wallet information

### Frontend Components
- `coinbase-payment-modal.tsx` - Payment interface
- `auth-modal-new.tsx` - Authentication modal
- `pricing-section.tsx` - Credit packages with CDP integration

## API Endpoints

```typescript
POST /api/cdp/session-token    # Generate CDP session token
POST /api/cdp/onramp          # Create onramp transaction
POST /api/oauth/token         # OAuth token exchange
GET  /api/oauth/profile       # Get user profile
```

## Documentation

- `CDP_SETUP_GUIDE.md` - Complete CDP setup instructions
- `COINBASE_INTEGRATION.md` - Integration overview
- `COINBASE_OAUTH_SETUP.md` - OAuth configuration guide

## Testing

```bash
# Test CDP integration
npm run test:cdp

# Test OAuth flow  
npm run test:oauth

# Run all tests
npm test
```

## Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components  
- **State Management**: React Context + hooks
- **Authentication**: Coinbase OAuth 2.0
- **Payments**: Coinbase CDP Onramp

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test CDP integration
5. Submit a pull request

## License

MIT License