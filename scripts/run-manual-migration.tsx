#!/usr/bin/env tsx
import { config } from 'dotenv';
import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { resolve } from 'path';

config();

async function main() {
  const fileArg = process.argv[2] || 'migrations/0007_user_assets_manual.sql';
  const sqlPath = resolve(process.cwd(), fileArg);
  const sql = readFileSync(sqlPath, 'utf-8');

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL missing');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    console.log(`🔄 Running manual migration: ${sqlPath}`);
    await pool.query(sql);
    console.log('✅ Migration completed');
  } catch (e) {
    console.error('❌ Migration failed:', e);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();


