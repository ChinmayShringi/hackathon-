# Database Migrations

> **Note:** The `DATABASE_URL` environment variable is always set in `.env` and loaded for all scripts. Migration scripts can and should rely on `process.env.DATABASE_URL` being available. If it is missing, throw a clear error.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up your database URL in `.env`:**
   ```env
   DATABASE_URL=postgresql://username:password@host:port/database
   ```

3. **Run migrations:**
   ```bash
   npm run db:push
   ```

## Migration Scripts

### Example Migration Script

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

// Your migration logic here
```

## Schema Changes

When making schema changes:

1. **Update the schema** in `shared/schema.ts`
2. **Run the migration** with `npm run db:push`
3. **Test the changes** thoroughly

## Troubleshooting

### Common Issues

1. **Connection errors:** Ensure your `DATABASE_URL` is correct
2. **Permission errors:** Check database user permissions
3. **Schema conflicts:** Drop and recreate tables if needed

### Reset Database

To completely reset your database:

```bash
# Drop all tables (WARNING: This will delete all data!)
npm run db:drop

# Recreate schema
npm run db:push
```

## Best Practices

1. **Always backup** before running migrations
2. **Test migrations** in development first
3. **Use transactions** for complex migrations
4. **Document changes** in commit messages 

## Production Migration Policy

- Do not run `db:push` directly against production. It may attempt destructive or reorder-dependent changes (e.g., dropping unique indexes with dependent FKs) and can prompt for truncation.
- Always:
  1) Take a backup (see `scripts/backup-database.ts`).
  2) Write a targeted SQL migration in `migrations/` that is idempotent:
     - Use `CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`, and `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`.
     - Avoid dropping constraints/indexes that have dependencies unless carefully sequenced.
  3) Apply using: `npx tsx scripts/run-manual-migration.tsx migrations/NNNN_description.sql`
  4) Validate with read-only checks.
- For schema areas with existing dependencies (e.g., component registry with FKs), prepare ordered steps (drop FKs → change constraint/index → recreate FKs) and test on a staging DB first. 