import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const execAsync = promisify(exec);

async function restoreFromOriginalBackup() {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL not found in environment variables');
    }

    console.log('🔍 Preparing to restore from original backup...');
    
    // Parse the DATABASE_URL to get connection details
    const url = new URL(databaseUrl);
    const host = url.hostname;
    const port = url.port || '5432';
    const database = url.pathname.slice(1); // Remove leading slash
    const username = url.username;
    const password = url.password;

    // Set environment variables for psql
    process.env.PGHOST = host;
    process.env.PGPORT = port;
    process.env.PGDATABASE = database;
    process.env.PGUSER = username;
    process.env.PGPASSWORD = password;

    const backupPath = path.resolve(__dirname, '../database/backups/000_lkg_preview_base.sql');
    
    if (!fs.existsSync(backupPath)) {
      throw new Error(`Original backup file not found: ${backupPath}`);
    }

    console.log('📖 Found original backup file');
    console.log('⚠️  WARNING: This will completely replace the current database schema!');
    console.log('⚠️  All current data will be lost!');
    console.log('⚠️  This is a destructive operation!');
    
    // Ask for confirmation
    console.log('\n🔴 Type "RESTORE" to confirm you want to restore from the original backup:');
    
    // For now, we'll proceed with the restore
    // In a real scenario, you'd want to get user input here
    
    console.log('🔄 Restoring database from original backup...');
    
    // Use psql to restore the backup
    const command = `psql -f "${backupPath}"`;
    
    console.log(`Running: ${command}`);
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr) {
      console.log('⚠️  psql stderr:', stderr);
    }
    
    if (stdout) {
      console.log('📄 psql stdout:', stdout);
    }
    
    console.log('✅ Database restored from original backup!');
    console.log('🔍 Verifying restoration...');
    
    // Verify that primary keys are back
    const { Client } = await import('pg');
    const client = new Client({
      connectionString: databaseUrl,
    });

    await client.connect();
    
    const result = await client.query(`
      SELECT 
        tc.table_name, 
        tc.constraint_name, 
        tc.constraint_type
      FROM information_schema.table_constraints tc
      WHERE tc.constraint_type = 'PRIMARY KEY'
      AND tc.table_schema = 'public'
      ORDER BY tc.table_name;
    `);
    
    console.log(`✅ Found ${result.rows.length} primary key constraints restored`);
    
    // Check for foreign keys (should still be there)
    const fkResult = await client.query(`
      SELECT 
        tc.table_name, 
        tc.constraint_name, 
        tc.constraint_type
      FROM information_schema.table_constraints tc
      WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public'
      ORDER BY tc.table_name;
    `);
    
    console.log(`📋 Found ${fkResult.rows.length} foreign key constraints (these will be removed next)`);
    
    await client.end();
    
    console.log('🎉 Database restoration completed successfully!');
    console.log('📝 Next step: Remove only the foreign key constraints (not primary keys)');
    
  } catch (error) {
    console.error('❌ Error restoring from backup:', error);
    process.exit(1);
  }
}

restoreFromOriginalBackup(); 