import { exec } from 'child_process';
import { promisify } from 'util';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const execAsync = promisify(exec);

async function backupDatabase() {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL not found in environment variables');
    }

    // Allow output file name as a command-line argument
    const outputFile = process.argv[2] || '000_lkg_preview_base.sql';
    const backupPath = path.resolve(__dirname, `../database/backups/${outputFile}`);

    console.log('🔍 Starting database backup...');
    console.log('📊 Using DATABASE_URL from .env file');
    
    // Use pg_dump with the DATABASE_URL
    const command = `pg_dump "${databaseUrl}" --verbose --clean --if-exists --no-owner --no-privileges > "${backupPath}"`;
    
    console.log('🔄 Executing backup command...');
    console.log(`📁 Backup will be saved to: ${backupPath}`);
    
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr) {
      console.log('⚠️  Warnings/Info from pg_dump:', stderr);
    }
    
    if (stdout) {
      console.log('📤 pg_dump output:', stdout);
    }
    
    console.log('✅ Database backup completed successfully!');
    console.log(`📄 Backup file: ${backupPath}`);
    
    // Get file size
    const stats = fs.statSync(backupPath);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`📏 Backup file size: ${fileSizeInMB} MB`);
    
  } catch (error) {
    console.error('❌ Error during database backup:', error);
    process.exit(1);
  }
}

// Run the backup
backupDatabase(); 