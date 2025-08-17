import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function removeOnlyForeignKeys() {
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

    // First, let's see what foreign key constraints exist
    console.log('🔍 Finding all foreign key constraints...');
    
    const fkQuery = `
      SELECT 
        tc.table_name, 
        tc.constraint_name, 
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage ccu 
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public'
      ORDER BY tc.table_name, tc.constraint_name;
    `;
    
    const fkResult = await client.query(fkQuery);
    
    console.log(`📋 Found ${fkResult.rows.length} foreign key constraints:`);
    fkResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}.${row.column_name} -> ${row.foreign_table_name}.${row.foreign_column_name} (${row.constraint_name})`);
    });

    if (fkResult.rows.length === 0) {
      console.log('✅ No foreign key constraints found to remove');
      await client.end();
      return;
    }

    console.log('\n🔄 Removing foreign key constraints...');
    
    // Remove each foreign key constraint
    for (const row of fkResult.rows) {
      const dropConstraintSQL = `ALTER TABLE public.${row.table_name} DROP CONSTRAINT IF EXISTS ${row.constraint_name};`;
      
      console.log(`   Removing: ${row.constraint_name} from ${row.table_name}`);
      await client.query(dropConstraintSQL);
    }

    console.log('✅ All foreign key constraints removed!');
    
    // Verify that foreign keys are gone but other constraints remain
    console.log('\n🔍 Verifying constraint removal...');
    
    // Check that foreign keys are gone
    const remainingFkResult = await client.query(`
      SELECT COUNT(*) as count
      FROM information_schema.table_constraints tc
      WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public';
    `);
    
    if (remainingFkResult.rows[0].count === '0') {
      console.log('✅ All foreign key constraints successfully removed');
    } else {
      console.log(`⚠️  Warning: ${remainingFkResult.rows[0].count} foreign key constraints still remain`);
    }
    
    // Check that primary keys are still there
    const pkResult = await client.query(`
      SELECT COUNT(*) as count
      FROM information_schema.table_constraints tc
      WHERE tc.constraint_type = 'PRIMARY KEY'
      AND tc.table_schema = 'public';
    `);
    
    console.log(`✅ ${pkResult.rows[0].count} primary key constraints preserved`);
    
    // Check that unique constraints are still there
    const uniqueResult = await client.query(`
      SELECT COUNT(*) as count
      FROM information_schema.table_constraints tc
      WHERE tc.constraint_type = 'UNIQUE'
      AND tc.table_schema = 'public';
    `);
    
    console.log(`✅ ${uniqueResult.rows[0].count} unique constraints preserved`);
    
    // Check that NOT NULL constraints are still there
    const notNullResult = await client.query(`
      SELECT COUNT(*) as count
      FROM information_schema.columns c
      WHERE c.is_nullable = 'NO'
      AND c.table_schema = 'public';
    `);
    
    console.log(`✅ ${notNullResult.rows[0].count} NOT NULL constraints preserved`);
    
    await client.end();
    console.log('\n🎉 Foreign key removal completed successfully!');
    console.log('📝 Database now has no foreign keys but all other constraints are intact');
    
  } catch (error) {
    console.error('❌ Error removing foreign keys:', error);
    process.exit(1);
  }
}

removeOnlyForeignKeys(); 