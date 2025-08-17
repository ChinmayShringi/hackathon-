# 🔐 Unified Authentication System Migration Guide

## Overview

This guide walks you through migrating your existing Delula application from the competing authentication systems to the new unified authentication system.

## 🚨 Pre-Migration Checklist

### 1. Database Backup
```bash
# Create a backup of your database before migration
pg_dump your_database_name > backup_before_unified_auth.sql
```

### 2. Environment Variables
Ensure these environment variables are set:
```env
DATABASE_URL=your_database_connection_string
SESSION_SECRET=your_session_secret
DEV_BOUND_GUEST_ID=debug-test-123  # Optional: for development debugging
```

### 3. Code Review
- Review the new unified auth system files
- Ensure no critical changes are pending
- Test in a staging environment first

## 📋 Migration Steps

### Step 1: Check Current Status
```bash
npm run migrate:auth:status
```

This will tell you if the migration has already been run or if it's needed.

### Step 2: Run the Migration
```bash
npm run migrate:auth
```

The migration script will:
1. ✅ Add new columns to the `users` table
2. ✅ Migrate existing users to the new schema
3. ✅ Handle guest user data
4. ✅ Create debug users
5. ✅ Update existing generations

### Step 3: Verify Migration
```bash
npm run migrate:auth:status
```

Should show "Migration appears to be complete"

## 🔄 What the Migration Does

### Database Schema Changes
The migration adds these new columns to the `users` table:

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `account_type` | varchar(20) | 'Guest' | 'Guest' or 'Registered' |
| `access_role` | varchar(20) | 'User' | 'User', 'Test', or 'Admin' |
| `session_token` | varchar | NULL | Unique session identifier |
| `last_seen_at` | timestamp | CURRENT_TIMESTAMP | Last activity timestamp |
| `password_hash` | varchar | NULL | Hashed password for registered users |
| `oauth_provider` | varchar(20) | NULL | OAuth provider (google, facebook) |
| `is_ephemeral` | boolean | false | True for guest accounts |
| `can_upgrade_to_registered` | boolean | true | Upgrade permission flag |

### User Migration Logic
- **Existing users with email**: Migrated to `Registered` account type
- **Existing users without email**: Migrated to `Guest` account type
- **Debug users**: Automatically assigned appropriate roles
- **Guest user**: Updated or created with proper guest settings

### Data Preservation
- ✅ All existing user data is preserved
- ✅ Generation history is maintained
- ✅ Credit balances are retained
- ✅ Session data is migrated

## 🧪 Testing the Migration

### 1. Test Guest Authentication
```bash
# Start the development server
npm run dev

# Visit the site and verify guest accounts work
# Check that new guest sessions are created properly
```

### 2. Test Debug Users
```bash
# In development, test debug user switching
curl -X POST http://localhost:3000/api/auth/debug/switch \
  -H "Content-Type: application/json" \
  -d '{"userId": "admin_debug"}'
```

### 3. Test Account Upgrade
```bash
# Test upgrading a guest account to registered
curl -X POST http://localhost:3000/api/auth/upgrade \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User"
  }'
```

## 🚨 Rollback Plan

If something goes wrong, you can rollback the migration:

```bash
npm run migrate:auth:rollback
```

**⚠️ WARNING**: This will remove the new columns and may cause data loss. Only use if absolutely necessary.

## 🔧 Post-Migration Tasks

### 1. Update Client-Side Code
Replace old authentication hooks with the new unified system:

```typescript
// Old: useAuth.ts
import { useAuth } from './hooks/useAuth';

// New: useUnifiedAuth.ts
import { useUnifiedAuth } from './hooks/useUnifiedAuth';
```

### 2. Update Route Handlers
Replace old auth middleware:

```typescript
// Old
import { guestAuth } from './guest-auth';
import { requireAuth } from './debug-auth';

// New
import { unifiedAuthMiddleware, requireAuth } from './unified-auth';
```

### 3. Remove Old Auth Files
After confirming everything works:
- `server/guest-auth.ts` (replaced by unified auth)
- `server/debug-auth.ts` (functionality moved to unified auth)
- Old auth hooks and components

### 4. Update Environment Configuration
```env
# Remove old auth-related environment variables
# Add new unified auth variables
DEV_BOUND_GUEST_ID=your-debug-guest-id  # Optional
```

## 📊 Migration Verification

### Database Verification
```sql
-- Check that new columns exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('account_type', 'access_role', 'session_token');

-- Check user migration
SELECT id, email, account_type, access_role, is_ephemeral 
FROM users 
LIMIT 10;
```

### API Verification
```bash
# Test unified auth endpoints
curl http://localhost:3000/api/auth/user
curl http://localhost:3000/api/auth/limits
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Migration Fails with Column Already Exists
```bash
# Check if migration was partially run
npm run migrate:auth:status

# If needed, manually drop columns and retry
```

#### 2. Session Issues After Migration
```bash
# Clear browser cookies and local storage
# Restart the server
npm run dev
```

#### 3. Debug Users Not Working
```bash
# Check if debug users were created
curl http://localhost:3000/api/auth/debug/users

# Reinitialize if needed
# The migration should handle this automatically
```

### Getting Help

If you encounter issues:
1. Check the migration logs for specific error messages
2. Verify your database connection and permissions
3. Ensure all environment variables are set correctly
4. Test in a clean development environment first

## 🎯 Success Criteria

The migration is successful when:
- ✅ All existing users are accessible
- ✅ Guest accounts work properly
- ✅ Debug users can be switched to
- ✅ Account upgrade flow works
- ✅ Generation limits are enforced correctly
- ✅ No data loss has occurred

## 📝 Post-Migration Checklist

- [ ] Database migration completed successfully
- [ ] All existing users can log in
- [ ] Guest authentication works
- [ ] Debug user switching works
- [ ] Account upgrade flow works
- [ ] Generation limits are enforced
- [ ] Old auth files removed
- [ ] Client-side code updated
- [ ] Environment variables updated
- [ ] Documentation updated

---

**Need Help?** If you encounter any issues during migration, please check the troubleshooting section or create an issue with detailed error messages. 