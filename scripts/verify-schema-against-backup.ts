import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function verifySchemaAgainstBackup() {
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
    const backupPath = path.resolve(__dirname, '../database/backups/000_lkg_preview_base.sql');
    
    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup file not found: ${backupPath}`);
    }

    console.log('📖 Reading backup file...');
    const backupContent = fs.readFileSync(backupPath, 'utf8');

    // Extract table definitions from backup
    const tableDefinitions = extractTableDefinitions(backupContent);
    
    console.log(`📋 Found ${Object.keys(tableDefinitions).length} tables in backup`);

    // Get current database schema
    const currentSchema = await getCurrentDatabaseSchema(client);
    
    console.log(`📋 Found ${Object.keys(currentSchema).length} tables in database`);

    // Compare each table
    const allTables = new Set([...Object.keys(tableDefinitions), ...Object.keys(currentSchema)]);
    
    let allCorrect = true;
    
    for (const tableName of allTables) {
      console.log(`\n🔍 Checking table: ${tableName}`);
      console.log('='.repeat(50));
      
      const backupTable = tableDefinitions[tableName];
      const currentTable = currentSchema[tableName];
      
      if (!backupTable) {
        console.log(`❌ Table ${tableName} exists in database but NOT in backup`);
        allCorrect = false;
        continue;
      }
      
      if (!currentTable) {
        console.log(`❌ Table ${tableName} exists in backup but NOT in database`);
        allCorrect = false;
        continue;
      }
      
      // Compare columns
      const columnComparison = compareColumns(backupTable.columns, currentTable.columns);
      
      if (!columnComparison.correct) {
        console.log('❌ Column mismatch:');
        console.log('Backup columns:', backupTable.columns.map(c => `${c.name}(${c.type})`).join(', '));
        console.log('Current columns:', currentTable.columns.map(c => `${c.name}(${c.type})`).join(', '));
        console.log('Differences:', columnComparison.differences);
        allCorrect = false;
      } else {
        console.log('✅ Columns match');
      }
      
      // Compare primary key
      if (backupTable.primaryKey !== currentTable.primaryKey) {
        console.log(`❌ Primary key mismatch: backup=${backupTable.primaryKey}, current=${currentTable.primaryKey}`);
        allCorrect = false;
      } else {
        console.log(`✅ Primary key matches: ${backupTable.primaryKey}`);
      }
      
      // Compare unique constraints
      const uniqueComparison = compareArrays(backupTable.uniqueConstraints, currentTable.uniqueConstraints);
      if (!uniqueComparison.correct) {
        console.log('❌ Unique constraints mismatch:', uniqueComparison.differences);
        allCorrect = false;
      } else {
        console.log('✅ Unique constraints match');
      }
    }
    
    if (allCorrect) {
      console.log('\n🎉 ALL TABLES MATCH THE BACKUP PERFECTLY!');
    } else {
      console.log('\n❌ SOME TABLES HAVE MISMATCHES');
    }
    
    await client.end();
    
  } catch (error) {
    console.error('❌ Error verifying schema:', error);
    process.exit(1);
  }
}

function extractTableDefinitions(backupContent: string) {
  const tables: Record<string, any> = {};
  
  // Extract CREATE TABLE statements
  const createTableRegex = /CREATE TABLE public\.(\w+)\s*\(([\s\S]*?)\);/g;
  let match;
  
  while ((match = createTableRegex.exec(backupContent)) !== null) {
    const tableName = match[1];
    const tableBody = match[2];
    
    const columns = extractColumns(tableBody);
    const primaryKey = extractPrimaryKey(tableBody);
    const uniqueConstraints = extractUniqueConstraints(tableBody);
    
    tables[tableName] = {
      columns,
      primaryKey,
      uniqueConstraints
    };
  }
  
  return tables;
}

function extractColumns(tableBody: string) {
  const columns: any[] = [];
  const lines = tableBody.split('\n').map(line => line.trim()).filter(line => line);
  
  for (const line of lines) {
    if (line.startsWith('--') || line.includes('CONSTRAINT') || line.includes('PRIMARY KEY')) {
      continue;
    }
    
    const columnMatch = line.match(/^(\w+)\s+([^,]+)(?:,|$)/);
    if (columnMatch) {
      const name = columnMatch[1];
      const type = columnMatch[2].trim();
      
      columns.push({ name, type });
    }
  }
  
  return columns;
}

function extractPrimaryKey(tableBody: string) {
  const pkMatch = tableBody.match(/PRIMARY KEY\s*\(([^)]+)\)/);
  return pkMatch ? pkMatch[1].trim() : null;
}

function extractUniqueConstraints(tableBody: string) {
  const constraints: string[] = [];
  const uniqueMatch = tableBody.match(/UNIQUE\s*\(([^)]+)\)/g);
  
  if (uniqueMatch) {
    for (const match of uniqueMatch) {
      const constraint = match.match(/UNIQUE\s*\(([^)]+)\)/);
      if (constraint) {
        constraints.push(constraint[1].trim());
      }
    }
  }
  
  return constraints;
}

async function getCurrentDatabaseSchema(client: any) {
  const tables: Record<string, any> = {};
  
  // Get all tables
  const tablesQuery = `
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `;
  
  const tablesResult = await client.query(tablesQuery);
  
  for (const tableRow of tablesResult.rows) {
    const tableName = tableRow.table_name;
    
    // Get columns
    const columnsQuery = `
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length
      FROM information_schema.columns 
      WHERE table_name = $1 
      ORDER BY ordinal_position;
    `;
    
    const columnsResult = await client.query(columnsQuery, [tableName]);
    const columns = columnsResult.rows.map((row: any) => ({
      name: row.column_name,
      type: row.data_type,
      nullable: row.is_nullable === 'YES',
      default: row.column_default
    }));
    
    // Get primary key
    const pkQuery = `
      SELECT kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.table_name = $1 
        AND tc.constraint_type = 'PRIMARY KEY';
    `;
    
    const pkResult = await client.query(pkQuery, [tableName]);
    const primaryKey = pkResult.rows.length > 0 ? pkResult.rows[0].column_name : null;
    
    // Get unique constraints
    const uniqueQuery = `
      SELECT kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.table_name = $1 
        AND tc.constraint_type = 'UNIQUE'
        AND tc.constraint_name NOT LIKE '%_pkey';
    `;
    
    const uniqueResult = await client.query(uniqueQuery, [tableName]);
    const uniqueConstraints = uniqueResult.rows.map((row: any) => row.column_name);
    
    tables[tableName] = {
      columns,
      primaryKey,
      uniqueConstraints
    };
  }
  
  return tables;
}

function compareColumns(backupColumns: any[], currentColumns: any[]) {
  const differences: string[] = [];
  
  if (backupColumns.length !== currentColumns.length) {
    differences.push(`Column count mismatch: backup=${backupColumns.length}, current=${currentColumns.length}`);
  }
  
  const backupColMap = new Map(backupColumns.map(c => [c.name, c]));
  const currentColMap = new Map(currentColumns.map(c => [c.name, c]));
  
  for (const [name, backupCol] of backupColMap) {
    const currentCol = currentColMap.get(name);
    if (!currentCol) {
      differences.push(`Column ${name} missing in current schema`);
    } else if (backupCol.type !== currentCol.type) {
      differences.push(`Column ${name} type mismatch: backup=${backupCol.type}, current=${currentCol.type}`);
    }
  }
  
  for (const [name, currentCol] of currentColMap) {
    if (!backupColMap.has(name)) {
      differences.push(`Column ${name} extra in current schema`);
    }
  }
  
  return {
    correct: differences.length === 0,
    differences
  };
}

function compareArrays(backup: string[], current: string[]) {
  const backupSet = new Set(backup);
  const currentSet = new Set(current);
  
  const missing = backup.filter(item => !currentSet.has(item));
  const extra = current.filter(item => !backupSet.has(item));
  
  const differences = [
    ...missing.map(item => `Missing: ${item}`),
    ...extra.map(item => `Extra: ${item}`)
  ];
  
  return {
    correct: differences.length === 0,
    differences
  };
}

verifySchemaAgainstBackup(); 