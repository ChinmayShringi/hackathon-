# Migration Historical Files

This directory contains migration files that were used to transition the Delula application from competing authentication systems to the unified authentication system.

## Files

- **`migrations/unified-auth-migration.ts`** - The main migration script that adds new columns to the users table and migrates existing data
- **`migrate-unified-auth.js`** - Migration runner script (ESM-compatible)
- **`MIGRATION_GUIDE.md`** - Comprehensive migration guide with step-by-step instructions

## Migration Details

### What was migrated:
- Added new columns to the `users` table:
  - `account_type` (Guest/Registered)
  - `access_role` (User/Test/Admin)
  - `session_token` (unique session identifier)
  - `last_seen_at` (last activity timestamp)
  - `password_hash` (for registered users)
  - `oauth_provider` (google/facebook)
  - `is_ephemeral` (true for guest accounts)
  - `can_upgrade_to_registered` (upgrade permission flag)

### Migration Date:
- Executed manually on June 26, 2024
- Used `node --loader ts-node/esm` to handle ESM TypeScript execution

### Status:
- Migration files moved here for archival reference
- No longer part of active project management
- Unified authentication system is now the primary auth system

## Usage (if needed for reference)

To run the migration manually (if needed for a fresh database):
```bash
node --loader ts-node/esm migrations-historical/migrations/unified-auth-migration.ts migrate
```

To check migration status:
```bash
node --loader ts-node/esm migrations-historical/migrations/unified-auth-migration.ts status
```

To rollback (DANGEROUS - only if absolutely necessary):
```bash
node --loader ts-node/esm migrations-historical/migrations/unified-auth-migration.ts rollback
```

## Notes

- These files are kept for reference and potential future use
- The migration was designed to be safe and reversible
- All existing user data was preserved during migration
- The unified auth system resolves the competing authentication systems issue documented in ISSUES.md 