import { config } from 'dotenv';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

config();

async function addMissingIndexesToSchema() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    console.log('🔍 Getting database indexes and constraints...\n');
    
    // Get all indexes from the database
    const dbIndexesResult = await pool.query(`
      SELECT 
        tablename,
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      ORDER BY tablename, indexname
    `);

    // Get all unique constraints from the database
    const uniqueConstraintsResult = await pool.query(`
      SELECT 
        tc.table_name,
        tc.constraint_name,
        kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.table_schema = 'public' 
        AND tc.constraint_type = 'UNIQUE'
      ORDER BY tc.table_name, tc.constraint_name
    `);

    // Group indexes by table
    const dbIndexes: Record<string, Array<{name: string, def: string}>> = {};
    dbIndexesResult.rows.forEach(row => {
      if (!dbIndexes[row.tablename]) {
        dbIndexes[row.tablename] = [];
      }
      dbIndexes[row.tablename].push({
        name: row.indexname,
        def: row.indexdef
      });
    });

    // Group unique constraints by table
    const dbUniqueConstraints: Record<string, Array<{name: string, column: string}>> = {};
    uniqueConstraintsResult.rows.forEach(row => {
      if (!dbUniqueConstraints[row.table_name]) {
        dbUniqueConstraints[row.table_name] = [];
      }
      dbUniqueConstraints[row.table_name].push({
        name: row.constraint_name,
        column: row.column_name
      });
    });

    console.log('📊 DATABASE INDEXES BY TABLE:');
    console.log('============================');
    for (const [tableName, indexes] of Object.entries(dbIndexes)) {
      console.log(`\n${tableName}:`);
      indexes.forEach(idx => {
        if (!idx.name.includes('_pkey')) { // Skip primary keys
          console.log(`  - ${idx.name}: ${idx.def}`);
        }
      });
    }

    console.log('\n🔒 DATABASE UNIQUE CONSTRAINTS BY TABLE:');
    console.log('=======================================');
    for (const [tableName, constraints] of Object.entries(dbUniqueConstraints)) {
      console.log(`\n${tableName}:`);
      constraints.forEach(constraint => {
        console.log(`  - ${constraint.name}: ${constraint.column}`);
      });
    }

    // Read the current schema file
    const schemaPath = path.join(process.cwd(), 'shared', 'schema.ts');
    let schemaContent = fs.readFileSync(schemaPath, 'utf8');

    console.log('\n📝 GENERATING SCHEMA UPDATES:');
    console.log('============================');

    // For each table, add the missing indexes
    for (const [tableName, indexes] of Object.entries(dbIndexes)) {
      const nonPkeyIndexes = indexes.filter(idx => !idx.name.includes('_pkey'));
      const uniqueConstraints = dbUniqueConstraints[tableName] || [];
      
      if (nonPkeyIndexes.length > 0 || uniqueConstraints.length > 0) {
        console.log(`\n${tableName}:`);
        
        // Find the table definition in the schema
        const tableRegex = new RegExp(`export const ${tableName}\\s*=\\s*pgTable\\([^)]+\\)`, 'g');
        const tableMatch = schemaContent.match(tableRegex);
        
        if (tableMatch) {
          console.log(`  Found table definition, adding indexes...`);
          
          // Generate the index array
          const indexArray: string[] = [];
          
          // Add unique constraints
          for (const constraint of uniqueConstraints) {
            indexArray.push(`unique("${constraint.name}", ["${constraint.column}"])`);
          }
          
          // Add regular indexes
          for (const index of nonPkeyIndexes) {
            // Parse the index definition to extract columns
            const columnMatch = index.def.match(/ON.*USING.*\(([^)]+)\)/);
            if (columnMatch) {
              const columns = columnMatch[1].split(',').map(col => col.trim().replace(/"/g, ''));
              const columnArray = columns.map(col => `"${col}"`).join(', ');
              indexArray.push(`index("${index.name}", [${columnArray}])`);
            }
          }
          
          if (indexArray.length > 0) {
            console.log(`  Adding indexes: ${indexArray.join(', ')}`);
            
            // Replace the table definition to include indexes
            const newTableDef = `export const ${tableName} = pgTable("${tableName}", (table) => ({
  // ... existing columns ...
}), (table) => ({
  ${indexArray.join(',\n  ')}
}))`;
            
            // This is a simplified approach - in practice, we'd need to be more careful
            // about preserving existing columns and structure
            console.log(`  ⚠️  Manual update needed for ${tableName}`);
          }
        } else {
          console.log(`  ❌ Table ${tableName} not found in schema`);
        }
      }
    }

    console.log('\n📋 MANUAL UPDATE REQUIRED:');
    console.log('=========================');
    console.log('The schema file needs to be manually updated to include the missing indexes.');
    console.log('For each table above, add the indexes array as the third argument to pgTable.');
    console.log('Example:');
    console.log('export const users = pgTable("users", (table) => ({');
    console.log('  // ... existing columns ...');
    console.log('}), (table) => ({');
    console.log('  unique("users_email_unique", ["email"]),');
    console.log('  unique("users_handle_unique", ["handle"]),');
    console.log('  index("IDX_users_access_role", ["access_role"]),');
    console.log('  index("IDX_users_account_type", ["account_type"])');
    console.log('}))');

  } catch (error) {
    console.error('Error analyzing indexes:', error);
  } finally {
    await pool.end();
  }
}

addMissingIndexesToSchema().catch(console.error); 