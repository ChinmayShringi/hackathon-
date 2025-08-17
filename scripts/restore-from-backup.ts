import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function restoreFromBackup() {
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

    // Read the backup file
    const backupPath = path.resolve(__dirname, '../database/backups/001_lkg_post_fk.sql');
    
    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup file not found: ${backupPath}`);
    }

    console.log('📖 Reading backup file...');
    const backupSql = fs.readFileSync(backupPath, 'utf8');

    console.log('🔄 Restoring database from backup...');
    console.log('⚠️  This will DROP ALL TABLES and recreate them from the backup!');
    
    // Execute the backup SQL
    await client.query(backupSql);
    
    console.log('✅ Database restored successfully from backup');
    
    await client.end();
    
  } catch (error) {
    console.error('❌ Error restoring database:', error);
    process.exit(1);
  }
}

restoreFromBackup(); 