import { config } from 'dotenv';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../shared/schema';

// Load environment variables first
config();

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  character_maximum_length: number | null;
  numeric_precision: number | null;
  numeric_scale: number | null;
}

interface IndexInfo {
  index_name: string;
  index_definition: string;
}

interface ConstraintInfo {
  constraint_name: string;
  constraint_type: string;
  column_name: string;
  referenced_table_name?: string;
  referenced_column_name?: string;
}

async function compareSchemaToDatabase() {
  console.log('🔍 Comparing shared/schema.ts with actual database structure...\n');
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle({ client: pool, schema });
  
  try {
    // Get all tables from the schema
    const schemaTables = Object.entries(schema)
      .filter(([key, value]) => {
        return typeof value === 'object' && 
               value !== null && 
               'name' in value && 
               typeof (value as any).name === 'string';
      })
      .map(([key, value]) => ({
        name: (value as any).name,
        key,
        table: value
      }));

    console.log('📋 Tables defined in shared/schema.ts:');
    schemaTables.forEach(({ name, key }) => console.log(`  - ${name} (${key})`));
    console.log();

    // Get actual tables from database
    const actualTablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    const actualTables = actualTablesResult.rows.map(row => row.table_name);
    console.log('🗄️ Tables in database:');
    actualTables.forEach(table => console.log(`  - ${table}`));
    console.log();

    // Find missing tables
    const missingInDb = schemaTables.filter(({ name }) => !actualTables.includes(name));
    const extraInDb = actualTables.filter(table => !schemaTables.some(s => s.name === table));

    if (missingInDb.length > 0) {
      console.log('❌ Tables missing in database:');
      missingInDb.forEach(({ name, key }) => console.log(`  - ${name} (${key})`));
      console.log();
    }

    if (extraInDb.length > 0) {
      console.log('⚠️ Extra tables in database (not in schema):');
      extraInDb.forEach(table => console.log(`  - ${table}`));
      console.log();
    }

    // Compare table structures for tables that exist in both
    console.log('🔍 Comparing table structures...\n');
    
    for (const { name: tableName, table: schemaTable } of schemaTables) {
      if (!actualTables.includes(tableName)) {
        console.log(`⏭️ Skipping ${tableName} - not in database`);
        continue;
      }

      console.log(`📊 Table: ${tableName}`);
      
      // Get actual columns from database
      const columnsResult = await pool.query(`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default,
          character_maximum_length,
          numeric_precision,
          numeric_scale
        FROM information_schema.columns 
        WHERE table_name = $1 
        AND table_schema = 'public'
        ORDER BY ordinal_position
      `, [tableName]);

      const actualColumns = columnsResult.rows as ColumnInfo[];
      const schemaColumns = Object.keys((schemaTable as any).columns || {});
      
      console.log(`  Schema columns: ${schemaColumns.length}`);
      console.log(`  Database columns: ${actualColumns.length}`);

      // Find missing columns
      const missingInDb = schemaColumns.filter(col => 
        !actualColumns.some(actual => actual.column_name === col)
      );
      
      const extraInDb = actualColumns.filter(actual => 
        !schemaColumns.includes(actual.column_name)
      );

      if (missingInDb.length > 0) {
        console.log(`  ❌ Missing columns in database:`);
        missingInDb.forEach(col => console.log(`    - ${col}`));
      }

      if (extraInDb.length > 0) {
        console.log(`  ⚠️ Extra columns in database:`);
        extraInDb.forEach(col => console.log(`    - ${col.column_name} (${col.data_type})`));
      }

      if (missingInDb.length === 0 && extraInDb.length === 0) {
        console.log(`  ✅ Columns match`);
      }
      
      console.log();
    }

    // Compare indexes
    console.log('🔍 Comparing indexes...\n');
    
    for (const { name: tableName, table: schemaTable } of schemaTables) {
      if (!actualTables.includes(tableName)) continue;

      console.log(`📊 Indexes for: ${tableName}`);
      
      // Get actual indexes from database
      const indexesResult = await pool.query(`
        SELECT 
          indexname as index_name,
          indexdef as index_definition
        FROM pg_indexes 
        WHERE tablename = $1 
        AND schemaname = 'public'
        ORDER BY indexname
      `, [tableName]);

      const actualIndexes = indexesResult.rows as IndexInfo[];
      
      // Get schema indexes
      const schemaIndexes = (schemaTable as any).indexes?.map((idx: any) => {
        if (typeof idx === 'string') return idx;
        if (idx && typeof idx === 'object' && 'name' in idx) return idx.name;
        return 'unnamed_index';
      }) || [];
      
      console.log(`  Schema indexes: ${schemaIndexes.length}`);
      console.log(`  Database indexes: ${actualIndexes.length}`);

      // Find missing indexes
      const missingInDb = schemaIndexes.filter(idx => 
        !actualIndexes.some(actual => actual.index_name === idx)
      );
      
      const extraInDb = actualIndexes.filter(actual => 
        !schemaIndexes.includes(actual.index_name)
      );

      if (missingInDb.length > 0) {
        console.log(`  ❌ Missing indexes in database:`);
        missingInDb.forEach(idx => console.log(`    - ${idx}`));
      }

      if (extraInDb.length > 0) {
        console.log(`  ⚠️ Extra indexes in database:`);
        extraInDb.forEach(idx => console.log(`    - ${idx.index_name}`));
      }

      if (missingInDb.length === 0 && extraInDb.length === 0) {
        console.log(`  ✅ Indexes match`);
      }
      
      console.log();
    }

    // Compare constraints
    console.log('🔍 Comparing constraints...\n');
    
    for (const { name: tableName, table: schemaTable } of schemaTables) {
      if (!actualTables.includes(tableName)) continue;

      console.log(`📊 Constraints for: ${tableName}`);
      
      // Get actual constraints from database
      const constraintsResult = await pool.query(`
        SELECT 
          tc.constraint_name,
          tc.constraint_type,
          kcu.column_name,
          ccu.table_name AS referenced_table_name,
          ccu.column_name AS referenced_column_name
        FROM information_schema.table_constraints tc
        LEFT JOIN information_schema.key_column_usage kcu 
          ON tc.constraint_name = kcu.constraint_name
        LEFT JOIN information_schema.constraint_column_usage ccu 
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.table_name = $1 
        AND tc.table_schema = 'public'
        ORDER BY tc.constraint_name
      `, [tableName]);

      const actualConstraints = constraintsResult.rows as ConstraintInfo[];
      
      // Extract constraints from schema (primary keys, unique constraints, etc.)
      const schemaConstraints: string[] = [];
      
      // Check for primary keys
      Object.entries((schemaTable as any).columns || {}).forEach(([colName, colDef]: [string, any]) => {
        if (colDef.primaryKey) {
          schemaConstraints.push(`PRIMARY KEY (${colName})`);
        }
      });

      // Check for unique constraints
      if ((schemaTable as any).indexes) {
        (schemaTable as any).indexes.forEach((idx: any) => {
          if (idx.unique) {
            schemaConstraints.push(`UNIQUE (${idx.columns?.join(', ') || 'unknown'})`);
          }
        });
      }

      console.log(`  Schema constraints: ${schemaConstraints.length}`);
      console.log(`  Database constraints: ${actualConstraints.length}`);

      if (schemaConstraints.length === 0 && actualConstraints.length === 0) {
        console.log(`  ℹ️ No constraints defined`);
      } else {
        console.log(`  Schema constraints:`);
        schemaConstraints.forEach(con => console.log(`    - ${con}`));
        
        console.log(`  Database constraints:`);
        actualConstraints.forEach(con => console.log(`    - ${con.constraint_type}: ${con.constraint_name}`));
      }
      
      console.log();
    }

    console.log('✅ Schema comparison complete!');

  } catch (error) {
    console.error('❌ Error comparing schema:', error);
  } finally {
    await pool.end();
  }
}

// Run the comparison
compareSchemaToDatabase().catch(console.error); 