import { exec } from 'child_process';
import { promisify } from 'util';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const execAsync = promisify(exec);

async function exportDatabase() {
  try {
    // Use the provided DATABASE_URL or fall back to environment variable
    const DATABASE_URL = process.env.DATABASE_URL;
    
    if (!DATABASE_URL) {
      console.error("❌ DATABASE_URL is not set. Please set it in your environment or .env file.");
      process.exit(1);
    }

    console.log("🔄 Exporting full PostgreSQL database to import_me.sql...");
    
    // Use pg_dump to export the entire database
    const command = `pg_dump --clean --if-exists --no-owner --no-privileges --format=plain --encoding=UTF8 "${DATABASE_URL}" > import_me.sql`;
    
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr) {
      console.warn("⚠️  Warnings during export:", stderr);
    }
    
    if (stdout) {
      console.log("📝 Export output:", stdout);
    }
    
    console.log("✅ Export complete: import_me.sql");
    console.log("📁 File location: ./import_me.sql");
    
  } catch (error) {
    console.error("❌ Export failed:", error);
    process.exit(1);
  }
}

// Run the export
exportDatabase(); 