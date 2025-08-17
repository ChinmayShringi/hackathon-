import * as dotenv from 'dotenv';
import { exec } from 'child_process';
import { promisify } from 'util';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

// Load environment variables FIRST, before any other imports
dotenv.config();

const execAsync = promisify(exec);

async function importAuroraDatabase() {
  try {
    // Check if import file exists
    const importFile = path.join(process.cwd(), 'import_me.sql');
    if (!existsSync(importFile)) {
      console.error("❌ import_me.sql not found in project root");
      console.error("   Please run the export script first: npx tsx scripts/export_neon_db_all.ts");
      process.exit(1);
    }

    // Get database connection details from environment
    const {
      DATABASE_URL,
      PGDATABASE,
      PGHOST,
      PGPORT,
      PGUSER,
      PGPASSWORD
    } = process.env;

    // Validate required environment variables
    if (!DATABASE_URL && (!PGHOST || !PGDATABASE || !PGUSER || !PGPASSWORD)) {
      console.error("❌ Missing required database connection variables");
      console.error("   Required: DATABASE_URL OR (PGHOST, PGDATABASE, PGUSER, PGPASSWORD)");
      process.exit(1);
    }

    console.log("🔄 Importing database from import_me.sql to Aurora...");
    console.log(`📁 Import file: ${importFile}`);
    console.log(`🗄️  Target database: ${PGDATABASE || 'from DATABASE_URL'}`);
    console.log(`🌐 Host: ${PGHOST || 'from DATABASE_URL'}`);

    // Use DATABASE_URL if available, otherwise construct from individual variables
    const connectionString = DATABASE_URL || `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT || '5432'}/${PGDATABASE}`;

    // Import using psql
    const command = `psql "${connectionString}" < "${importFile}"`;
    
    console.log("⏳ Running import command...");
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr) {
      console.warn("⚠️  Warnings during import:", stderr);
    }
    
    if (stdout) {
      console.log("📝 Import output:", stdout);
    }
    
    console.log("✅ Import complete!");
    console.log("🎉 Database successfully migrated to Aurora");
    
  } catch (error) {
    console.error("❌ Import failed:", error);
    console.error("   Make sure psql is installed and accessible");
    console.error("   Verify your Aurora database is accessible");
    process.exit(1);
  }
}

// Run the import
importAuroraDatabase(); 