import { readFileSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { Client } from 'pg';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from root .env
dotenv.config({ path: resolve(__dirname, '../.env') });

async function runMigration() {
  const sqlPath = join(__dirname, '../migrations/0001_add_recipe_usage_options.sql');
  const sql = readFileSync(sqlPath, 'utf8');
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL not found in environment variables');
  }

  const client = new Client({ connectionString: databaseUrl });
  try {
    await client.connect();
    console.log('✅ Connected to database');
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('✅ Migration applied successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration(); 