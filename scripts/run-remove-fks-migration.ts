import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function runMigration() {
  try {
    const { Client } = await import('pg');
    
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL not found in environment variables');
    }

    console.log('🔍 Connecting to database...');
    
    const client = new Client({
      connectionString: databaseUrl,
    });

    await client.connect();
    console.log('✅ Connected to database');

    // Read the migration file
    const migrationPath = path.resolve(__dirname, '../migrations/0008_remove_all_foreign_keys.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('🔄 Running migration to remove all foreign key constraints...');
    console.log('📄 Migration file:', migrationPath);

    // Execute the migration
    await client.query(migrationSQL);

    console.log('✅ Migration completed successfully!');
    console.log('🗑️  All foreign key constraints have been removed');

    // Verify by checking if any foreign keys remain
    const result = await client.query(`
      SELECT 
        tc.table_name, 
        tc.constraint_name, 
        tc.constraint_type
      FROM information_schema.table_constraints tc
      WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public'
      ORDER BY tc.table_name, tc.constraint_name;
    `);

    if (result.rows.length === 0) {
      console.log('✅ Verification: No foreign key constraints remain in the database');
    } else {
      console.log('⚠️  Warning: Some foreign key constraints still exist:');
      result.rows.forEach(row => {
        console.log(`   - ${row.table_name}.${row.constraint_name}`);
      });
    }

    await client.end();
    console.log('🔌 Database connection closed');

  } catch (error) {
    console.error('❌ Error running migration:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration(); 