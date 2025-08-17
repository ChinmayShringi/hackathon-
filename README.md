# Coinbase CDP Integration Demo

A React TypeScript frontend application demonstrating Coinbase CDP (Coinbase Developer Platform) integration concepts for dynamic OAuth authentication and onramp functionality.

## Features

- **Modern React Frontend** - TypeScript, Vite, Tailwind CSS, shadcn/ui components
- **Coinbase Payment UI** - Interactive payment modals and pricing components
- **Authentication Flow** - OAuth login modals and wallet connection interfaces
- **Responsive Design** - Mobile-first design with modern UI patterns
- **TypeScript Safety** - Full type safety throughout the application

## Quick Start

### Prerequisites
- Node.js 22.12+
- npm 10+

### Installation
```bash
# Clone the repository
git clone https://github.com/scryptedai/hackathon-eth-global.git
cd hackathon-eth-global

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run check      # TypeScript type checking
```

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Reusable UI components (shadcn/ui)
│   │   │   ├── auth-modal-new.tsx       # Authentication modal
│   │   │   ├── coinbase-payment-modal.tsx  # Payment interface
│   │   │   ├── pricing-section.tsx      # Pricing with CDP integration
│   │   │   └── ...
│   │   ├── pages/               # Application pages
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Utility functions
│   │   └── contexts/            # React contexts
│   └── index.html
├── shared/                      # Shared types and schemas
├── scripts/                     # Development scripts
└── public/                      # Static assets
```

## Key Components

### Authentication & Payments
- **`auth-modal-new.tsx`** - Modern authentication modal with Coinbase integration
- **`coinbase-payment-modal.tsx`** - Payment interface for CDP onramp
- **`pricing-section.tsx`** - Credit packages with payment integration

### UI Components
- **`ui/`** - Complete shadcn/ui component library
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Modern Styling** - Dark/light mode support, animations, and interactions

## Coinbase Integration Concepts

This demo showcases the frontend patterns for:

1. **CDP Session Token Flow** - How to structure session token requests
2. **OAuth Integration** - User authentication and wallet connection flows  
3. **Payment Processing** - Onramp integration with multiple payment methods
4. **Error Handling** - User-friendly error states and loading indicators

## Environment Configuration

The application includes example configurations for:

- `coinbase.env.example` - Coinbase CDP credentials template
- `coinbase-oauth.env.example` - OAuth configuration template

## Documentation

- `CDP_SETUP_GUIDE.md` - Complete CDP integration setup guide
- `COINBASE_INTEGRATION.md` - Integration overview and concepts
- `COINBASE_OAUTH_SETUP.md` - OAuth configuration instructions
- `COINBASE_ONRAMP_SETUP.md` - Onramp setup documentation

## Development Scripts

```bash
npm run test:cdp          # Test CDP integration concepts
npm run test:oauth        # Test OAuth flow patterns  
npm run debug:auth        # Debug authentication flows
npm run debug:session     # Debug session management
npm run generate:webhook  # Generate webhook secrets
```

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components  
- **State Management**: React Context + hooks
- **Build Tool**: Vite with hot module replacement
- **Type Safety**: Full TypeScript coverage

## Architecture

This is a **frontend-only demonstration** that showcases:

- Modern React patterns for payment integrations
- TypeScript interfaces for Coinbase CDP APIs
- Responsive UI components for crypto payments
- Authentication flow implementations
- Error handling and loading states

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the frontend builds successfully
5. Submit a pull request

## License

MIT License

---

**Note**: This is a frontend demonstration project showcasing UI patterns and integration concepts for Coinbase CDP. For production implementation, you'll need to implement the corresponding backend services following Coinbase's API documentation.