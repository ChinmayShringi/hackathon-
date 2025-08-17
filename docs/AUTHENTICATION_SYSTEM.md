# 🔐 Unified Authentication System

## Overview

Delula uses a **single, unified authentication system** that seamlessly handles both guest and registered users. This system eliminates the complexity of multiple competing auth systems and provides a consistent user experience.

## 🎯 Key Features

### ✅ Single Authentication Flow
- **One system** for all user types
- **Consistent API** across guest and registered users
- **Seamless transitions** between account types
- **Unified session management**

### ✅ Guest User Support
- **Immediate access** without registration
- **Automatic account creation** via session tokens
- **Credit-based limits** (10 free credits)
- **Upgrade path** to registered accounts

### ✅ Registered User Support
- **Persistent accounts** with email
- **Full feature access**
- **Credit management**
- **Profile customization**

## 🏗️ Architecture

### Core Components

#### 1. UnifiedAuthService (`server/unified-auth.ts`)
```typescript
class UnifiedAuthService {
  // Singleton pattern for consistent state
  static getInstance(): UnifiedAuthService
  
  // Guest account management
  async createOrRetrieveGuest(sessionId: string): Promise<UserAccount>
  
  // User account operations
  async getUserBySessionToken(sessionId: string): Promise<UserAccount | null>
  async upgradeGuestToRegistered(guestId: string, email: string): Promise<UserAccount>
  
  // Credit and limit management
  getGenerationLimits(userAccount: UserAccount): GenerationLimits
}
```

#### 2. Authentication Router (`server/unified-auth-router.ts`)
```typescript
// API endpoints for authentication
GET  /api/auth/user          // Get current user
POST /api/auth/upgrade       // Upgrade guest to registered
GET  /api/auth/limits        // Get generation limits
POST /api/auth/logout        // Logout
```

#### 3. Global Middleware (`server/routes.ts`)
```typescript
// Applied to all routes automatically
app.use(unifiedAuthMiddleware)
```

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  account_type INTEGER DEFAULT 2 NOT NULL,           -- 2=Guest, 3=Registered
  access_role INTEGER DEFAULT 1 NOT NULL,            -- 1=User, 2=Test, 3=Admin
  session_token VARCHAR UNIQUE,
  email VARCHAR UNIQUE,
  credits INTEGER DEFAULT 10 NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_seen_at TIMESTAMP DEFAULT NOW(),
  last_credit_refresh TIMESTAMP DEFAULT NOW(),
  
  -- Registered user fields
  password_hash VARCHAR,
  oauth_provider VARCHAR(20),
  first_name VARCHAR,
  last_name VARCHAR,
  handle VARCHAR UNIQUE,
  profile_image_url VARCHAR,
  
  -- Guest-specific metadata
  is_ephemeral BOOLEAN DEFAULT FALSE,
  can_upgrade_to_registered BOOLEAN DEFAULT TRUE
);
```

#### Type Tables (Documentation Only)
```sql
-- Maps integer IDs to human-readable names (no foreign keys)
CREATE TABLE type_user (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL
);

CREATE TABLE type_role (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL
);

-- Seed data
INSERT INTO type_user VALUES (1, 'System'), (2, 'Guest'), (3, 'Registered');
INSERT INTO type_role VALUES (1, 'User'), (2, 'Test'), (3, 'Admin');
```

## 🔄 Authentication Flow

### 1. Guest User Journey

```mermaid
graph TD
    A[User visits site] --> B[Session created]
    B --> C[Guest account auto-created]
    C --> D[10 credits assigned]
    D --> E[Start generating content]
    E --> F[Credits consumed]
    F --> G[Daily credit refresh]
```

### 2. Account Upgrade Flow

```mermaid
graph TD
    A[Guest user] --> B[Click upgrade]
    B --> C[OAuth authentication]
    C --> D[Account converted]
    D --> E[Credits preserved]
    E --> F[Full features unlocked]
```

## 🔧 Implementation Details

### Type Constants

#### User Types (`shared/user-types.ts`)
```typescript
export const USER_TYPES = {
  SYSTEM: 1,      // System accounts (e.g., system_backlog)
  GUEST: 2,       // Ephemeral guest accounts
  REGISTERED: 3   // Persistent registered accounts
} as const;

export type UserTypeId = typeof USER_TYPES[keyof typeof USER_TYPES];
```

#### Access Roles (`shared/access-roles.ts`)
```typescript
export const ACCESS_ROLES = {
  USER: 1,        // Standard user permissions
  TEST: 2,        // Testing and development access
  ADMIN: 3        // Administrative privileges
} as const;

export type AccessRoleId = typeof ACCESS_ROLES[keyof typeof ACCESS_ROLES];
```

### User Account Interface

```typescript
export interface UserAccount {
  id: string;
  accountType: UserTypeId;        // 1, 2, or 3
  accessRole: AccessRoleId;       // 1, 2, or 3
  
  // Common fields
  createdAt: Date;
  lastSeenAt: Date;
  sessionToken: string;
  
  // Registered-specific fields
  email?: string;
  passwordHash?: string;
  oauthProvider?: OAuthProvider;
  credits: number;
  
  // Guest-specific metadata
  isEphemeral?: boolean;
  canUpgradeToRegistered: boolean;
  
  // System-specific metadata
  allowDebit: boolean; // Allows negative credits for system users
}
```

### Authentication Middleware

```typescript
export const unifiedAuthMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const sessionId = req.sessionID;
    if (!sessionId) {
      return next();
    }

    const userAccount = await unifiedAuthService.getUserBySessionToken(sessionId);
    if (userAccount) {
      req.userAccount = userAccount;
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    next();
  }
};
```

## 🚀 API Endpoints

### Authentication Routes

#### Get Current User
```http
GET /api/auth/user
```

**Response:**
```json
{
  "id": "user_123",
  "accountType": 2,
  "accessRole": 1,
  "credits": 10,
  "canUpgradeToRegistered": true,
  "email": null,
  "isEphemeral": true
}
```

#### Upgrade Guest Account
```http
POST /api/auth/upgrade
Content-Type: application/json

{
  "email": "user@example.com",
  "oauthProvider": "google"
}
```

**Response:**
```json
{
  "id": "user_123",
  "accountType": 3,
  "accessRole": 1,
  "credits": 10,
  "canUpgradeToRegistered": false,
  "email": "user@example.com",
  "oauthProvider": "google"
}
```

#### Get Generation Limits
```http
GET /api/auth/limits
```

**Response:**
```json
{
  "maxGenerations": 10,
  "remainingGenerations": 7,
  "refreshSecondsLeft": 86400,
  "canGenerate": true
}
```

### Alpha Site Routes

#### Get Guest Stats
```http
GET /api/alpha/guest-stats
```

**Response:**
```json
{
  "used": 3,
  "max": 10,
  "remaining": 7,
  "refreshSecondsLeft": 0
}
```

## 🔒 Security Features

### Session Management
- **HTTP-only cookies** with secure flags
- **CSRF protection** via session validation
- **Automatic expiration** and cleanup
- **Rate limiting** on auth endpoints

### Data Protection
- **Input validation** with Zod schemas
- **SQL injection prevention** via Drizzle ORM
- **XSS protection** with proper escaping
- **Secure file uploads** with validation

### Access Control
- **Role-based permissions** via access roles
- **Account type restrictions** for certain features
- **Credit-based limits** to prevent abuse
- **Session hijacking protection**

## 🧪 Testing

### Unit Tests
```bash
# Test authentication service
npm test -- --testPathPattern=auth

# Test specific auth functions
npm test -- --testPathPattern=unified-auth
```

### Integration Tests
```bash
# Test auth endpoints
npm test -- --testPathPattern=api

# Test database operations
npm test -- --testPathPattern=storage
```

### Manual Testing
```bash
# Test guest account creation
curl -X GET http://localhost:5232/api/auth/user

# Test account upgrade
curl -X POST http://localhost:5232/api/auth/upgrade \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","oauthProvider":"google"}'
```

## 🔧 Development

### Environment Variables
```env
# Required
DATABASE_URL=postgresql://user:password@localhost:5432/delula
SESSION_SECRET=your-secure-session-secret

# Optional
DEV_BOUND_GUEST_ID=debug-test-123  # For development debugging
```

### Database Setup
```bash
# Run migrations
npm run db:push

# Seed type tables
npx tsx scripts/seed-type-tables.ts

# Verify setup
npx tsx scripts/verify-auth-setup.ts
```

### Debug Mode
When `DEV_BOUND_GUEST_ID` is set, all guest sessions use a shared guest user for testing:

```typescript
// All guest sessions use the same user ID
if (DEBUG_CONFIG.boundGuestId) {
  const sharedGuest = await storage.getUserById(DEBUG_CONFIG.boundGuestId);
  if (sharedGuest) {
    return this.mapUserToAccount(sharedGuest);
  }
}
```

## 📊 Monitoring

### Key Metrics
- **Active sessions** count
- **Guest to registered** conversion rate
- **Credit consumption** patterns
- **Authentication failures** rate

### Logging
```typescript
// Log authentication events
console.log('User authenticated:', {
  userId: userAccount.id,
  accountType: getUserTypeLabel(userAccount.accountType),
  accessRole: getAccessRoleLabel(userAccount.accessRole),
  timestamp: new Date().toISOString()
});
```

## 🚨 Troubleshooting

### Common Issues

#### Session Not Persisting
- Check `SESSION_SECRET` environment variable
- Verify cookie settings in production
- Check database connection for session storage

#### Guest Account Creation Fails
- Verify database permissions
- Check `type_user` table exists and seeded
- Verify session middleware is loaded

#### Type Mismatch Errors
- Ensure using integer constants, not strings
- Check `shared/user-types.ts` and `shared/access-roles.ts`
- Verify database schema matches code

### Debug Commands
```bash
# Check current auth state
npx tsx scripts/debug-auth.ts

# Verify user types in database
npx tsx scripts/check-user-types.ts

# Test authentication flow
npx tsx scripts/test-auth-flow.ts
```

## 🔮 Future Enhancements

### Planned Features
- **Multi-factor authentication** for registered users
- **Social login** integration (Google, Facebook, etc.)
- **Password reset** functionality
- **Account deletion** with data cleanup

### Performance Improvements
- **Redis caching** for user sessions
- **Connection pooling** optimization
- **Query optimization** for auth checks
- **Rate limiting** improvements

---

## Summary

The Delula unified authentication system provides a **seamless, secure, and scalable** solution for managing both guest and registered users. By using integer-based types and a single authentication flow, the system eliminates complexity while maintaining security and performance.

**Key Benefits:**
- ✅ **Single codebase** for all authentication needs
- ✅ **Type-safe** with integer-based constants
- ✅ **Secure** with proper session management
- ✅ **Scalable** with efficient database design
- ✅ **Maintainable** with clear separation of concerns 