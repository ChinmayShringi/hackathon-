#!/usr/bin/env tsx

import 'dotenv/config';
import { Pool } from 'pg';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from root .env
import * as dotenv from 'dotenv';
dotenv.config({ path: resolve(__dirname, '../.env') });

async function analyzeRecipeFormData() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL not found in environment variables');
  }

  const pool = new Pool({ connectionString: databaseUrl });
  
  try {
    console.log('🔍 Analyzing formData for recipe_id 16...\n');
    
    const startTime = Date.now();
    
    // Complex SQL query to analyze formData dynamically
    const summaryQuery = `
      WITH recipe_generations AS (
        SELECT 
          g.id,
          g.metadata,
          g.created_at
        FROM generations g
        JOIN users u ON g.user_id = u.id
        WHERE g.recipe_id = 16
          AND g.status = 'completed'
          AND g.id > 0
          AND u.account_type IN (2, 3)  -- Guest (2) or Registered (3), not System (1)
          AND g.metadata IS NOT NULL
          AND g.metadata->>'formData' IS NOT NULL
          AND g.metadata->'formData' != '{}'
        ORDER BY g.created_at DESC
      ),
      latest_generation AS (
        SELECT metadata->'formData' as latest_form_data
        FROM recipe_generations
        LIMIT 1
      ),
      form_data_keys AS (
        SELECT DISTINCT key
        FROM latest_generation,
        jsonb_object_keys(latest_generation.latest_form_data) as key
      ),
      value_counts AS (
        SELECT 
          fd.key,
          COALESCE(fd.value::text, 'null') as value_text,
          COUNT(*) as count
        FROM recipe_generations rg,
        jsonb_each(rg.metadata->'formData') as fd(key, value)
        GROUP BY fd.key, COALESCE(fd.value::text, 'null')
      ),
      summary AS (
        SELECT 
          vc.key,
          jsonb_object_agg(vc.value_text, vc.count) as value_counts
        FROM value_counts vc
        GROUP BY vc.key
      )
      SELECT 
        jsonb_object_agg(s.key, s.value_counts) as form_data_summary
      FROM summary s;
    `;
    
    // EXPLAIN ANALYZE for server-side timing
    console.log('\n🔬 Running EXPLAIN ANALYZE for server-side timing...');
    const explainResult = await pool.query('EXPLAIN ANALYZE ' + summaryQuery);
    console.log('--- EXPLAIN ANALYZE Output ---');
    explainResult.rows.forEach(row => console.log(row[Object.keys(row)[0]]));
    console.log('-----------------------------\n');
    
    console.log('⏱️  Executing SQL query...');
    const result = await pool.query(summaryQuery);
    const endTime = Date.now();
    const executionTime = endTime - startTime;
    
    console.log(`✅ Query executed in ${executionTime}ms\n`);
    
    if (result.rows.length > 0 && result.rows[0].form_data_summary) {
      const summary = result.rows[0].form_data_summary;
      
      console.log('📊 FormData Summary for Recipe ID 16:');
      console.log('=' .repeat(50));
      console.log(JSON.stringify(summary, null, 2));
      
      // Additional analysis
      console.log('\n📈 Summary Statistics:');
      console.log('=' .repeat(30));
      
      const totalGenerations = await pool.query(`
        SELECT COUNT(*) as total
        FROM generations g
        JOIN users u ON g.user_id = u.id
        WHERE g.recipe_id = 16
          AND g.status = 'completed'
          AND g.id > 0
          AND u.account_type IN (2, 3)
      `);
      
      const generationsWithFormData = await pool.query(`
        SELECT COUNT(*) as total
        FROM generations g
        JOIN users u ON g.user_id = u.id
        WHERE g.recipe_id = 16
          AND g.status = 'completed'
          AND g.id > 0
          AND u.account_type IN (2, 3)
          AND g.metadata IS NOT NULL
          AND g.metadata->>'formData' IS NOT NULL
          AND g.metadata->'formData' != '{}'
      `);
      
      console.log(`Total completed generations: ${totalGenerations.rows[0].total}`);
      console.log(`Generations with formData: ${generationsWithFormData.rows[0].total}`);
      console.log(`FormData fields analyzed: ${Object.keys(summary).length}`);
      
      // Show most common values for each field
      console.log('\n🏆 Most Common Values by Field:');
      console.log('=' .repeat(40));
      
      Object.entries(summary).forEach(([field, valueCounts]) => {
        const counts = valueCounts as Record<string, number>;
        const sortedValues = Object.entries(counts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3); // Top 3
        
        console.log(`\n${field}:`);
        sortedValues.forEach(([value, count]) => {
          console.log(`  "${value}": ${count} times`);
        });
      });
      
    } else {
      console.log('❌ No formData found for recipe_id 16');
    }
    
  } catch (error) {
    console.error('❌ Error analyzing formData:', error);
  } finally {
    await pool.end();
  }
}

analyzeRecipeFormData().catch(console.error); 