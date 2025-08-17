import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function examineRecipeUsage() {
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

    // 1. Get table structure
    console.log('\n📋 TABLE STRUCTURE:');
    console.log('==================');
    
    const structureQuery = `
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length
      FROM information_schema.columns 
      WHERE table_name = 'recipe_usage' 
      ORDER BY ordinal_position;
    `;
    
    const structureResult = await client.query(structureQuery);
    
    if (structureResult.rows.length === 0) {
      console.log('❌ Table recipe_usage does not exist!');
      return;
    }
    
    console.table(structureResult.rows);

    // 2. Get primary key info
    console.log('\n🔑 PRIMARY KEY INFO:');
    console.log('==================');
    
    const pkQuery = `
      SELECT 
        tc.constraint_name,
        kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.table_name = 'recipe_usage' 
        AND tc.constraint_type = 'PRIMARY KEY';
    `;
    
    const pkResult = await client.query(pkQuery);
    console.table(pkResult.rows);

    // 3. Get row count
    console.log('\n📊 ROW COUNT:');
    console.log('============');
    
    const countQuery = 'SELECT COUNT(*) as total_rows FROM recipe_usage;';
    const countResult = await client.query(countQuery);
    console.log(`Total rows: ${countResult.rows[0].total_rows}`);

    // 4. Get sample data (first 10 rows)
    console.log('\n📄 SAMPLE DATA (first 10 rows):');
    console.log('===============================');
    
    const sampleQuery = 'SELECT * FROM recipe_usage LIMIT 10;';
    const sampleResult = await client.query(sampleQuery);
    
    if (sampleResult.rows.length === 0) {
      console.log('No data found in recipe_usage table');
    } else {
      console.table(sampleResult.rows);
    }

    // 5. Get data distribution for each column
    console.log('\n📈 DATA DISTRIBUTION:');
    console.log('=====================');
    
    const columns = structureResult.rows.map(row => row.column_name);
    
    for (const column of columns) {
      console.log(`\n--- ${column} ---`);
      
      // Count non-null values
      const nonNullQuery = `SELECT COUNT(*) as non_null_count FROM recipe_usage WHERE ${column} IS NOT NULL;`;
      const nonNullResult = await client.query(nonNullQuery);
      
      // Get unique values count
      const uniqueQuery = `SELECT COUNT(DISTINCT ${column}) as unique_count FROM recipe_usage;`;
      const uniqueResult = await client.query(uniqueQuery);
      
      // Get sample values
      const sampleValuesQuery = `SELECT DISTINCT ${column} FROM recipe_usage WHERE ${column} IS NOT NULL LIMIT 5;`;
      const sampleValuesResult = await client.query(sampleValuesQuery);
      
      console.log(`Non-null values: ${nonNullResult.rows[0].non_null_count}`);
      console.log(`Unique values: ${uniqueResult.rows[0].unique_count}`);
      console.log(`Sample values: ${sampleValuesResult.rows.map(row => row[column]).join(', ')}`);
    }

    await client.end();
    console.log('\n✅ Examination complete');
    
  } catch (error) {
    console.error('❌ Error examining recipe_usage table:', error);
    process.exit(1);
  }
}

examineRecipeUsage(); 