import { config } from 'dotenv';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

config(); // Load environment variables first

async function fixSchemaIndexes() {
  console.log('🔧 Fixing schema indexes to match database...\n');

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    // Get all indexes from the database
    const dbIndexesResult = await pool.query(`
      SELECT 
        tablename,
        indexname
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      ORDER BY tablename, indexname
    `);

    const dbIndexes = dbIndexesResult.rows.map(idx => `${idx.tablename}.${idx.indexname}`);
    
    console.log('📊 Database indexes found:', dbIndexes.length);
    dbIndexes.forEach(idx => console.log(`  - ${idx}`));

    // Read the shared schema file
    const schemaPath = path.join(process.cwd(), 'shared', 'schema.ts');
    let schemaContent = fs.readFileSync(schemaPath, 'utf8');

    console.log('\n🔍 Analyzing shared schema...');

    // Define indexes that should be removed (missing from database)
    const indexesToRemove = [
      // brand_assets
      'idx_brand_assets_tags_gin',
      'idx_brand_assets_user_created',
      
      // credit_transactions
      'idx_credit_transactions_user_created',
      
      // recipe_samples
      'idx_recipe_samples_featured_likes',
      'idx_recipe_samples_recipe_status',
      
      // generations
      'idx_generations_asset_id',
      'idx_generations_created_at',
      'idx_generations_credits_refunded',
      'idx_generations_fal_job_id',
      'idx_generations_processing_started_at',
      'idx_generations_recipe',
      'idx_generations_status',
      'idx_generations_user_pagination',
      
      // recipes
      'idx_recipes_category',
      'idx_recipes_creator_id',
      'idx_recipes_generation_type',
      'idx_recipes_is_active',
      'idx_recipes_workflow_type',
      
      // users
      'idx_users_created_at',
      'idx_users_is_ephemeral',
      'idx_users_last_seen_at',
      
      // recipe_option_tag_icon
      'IDX_recipe_option_tag_icon_id',
      'IDX_recipe_option_tag_icon_icon'
    ];

    console.log('\n❌ Indexes to remove from shared schema:');
    indexesToRemove.forEach(idx => console.log(`  - ${idx}`));

    // Remove each index from the schema
    let removedCount = 0;
    
    for (const indexName of indexesToRemove) {
      // Pattern to match index definitions
      const indexPatterns = [
        // Standard index pattern
        new RegExp(`\\s*index\\(["']${indexName}["']\\)\\.using\\([^)]+\\)[^,]*,\\s*`, 'g'),
        // Index with .on() pattern
        new RegExp(`\\s*index\\(["']${indexName}["']\\)\\.on\\([^)]+\\)[^,]*,\\s*`, 'g'),
        // Index at end of array (no trailing comma)
        new RegExp(`\\s*index\\(["']${indexName}["']\\)\\.using\\([^)]+\\)[^,]*\\s*`, 'g'),
        new RegExp(`\\s*index\\(["']${indexName}["']\\)\\.on\\([^)]+\\)[^,]*\\s*`, 'g')
      ];

      for (const pattern of indexPatterns) {
        const beforeLength = schemaContent.length;
        schemaContent = schemaContent.replace(pattern, '');
        if (schemaContent.length !== beforeLength) {
          removedCount++;
          console.log(`  ✓ Removed: ${indexName}`);
          break;
        }
      }
    }

    // Clean up any trailing commas in index arrays
    schemaContent = schemaContent.replace(/,\s*\]/g, ']');
    schemaContent = schemaContent.replace(/,\s*\)/g, ')');

    // Write the updated schema back
    fs.writeFileSync(schemaPath, schemaContent, 'utf8');

    console.log(`\n✅ Successfully removed ${removedCount} indexes from shared schema`);
    console.log('📁 Updated file: shared/schema.ts');

    // Verify the changes
    console.log('\n🔍 Verifying changes...');
    
    // Check if any of the removed indexes still exist in the file
    let stillExists = 0;
    for (const indexName of indexesToRemove) {
      if (schemaContent.includes(indexName)) {
        console.log(`  ⚠️  Warning: ${indexName} still found in schema`);
        stillExists++;
      }
    }

    if (stillExists === 0) {
      console.log('✅ All specified indexes successfully removed');
    } else {
      console.log(`⚠️  ${stillExists} indexes may still need manual removal`);
    }

    console.log('\n🎉 Schema index cleanup complete!');

  } catch (error) {
    console.error('❌ Error during schema index fix:', error);
  } finally {
    await pool.end();
  }
}

fixSchemaIndexes().catch(console.error); 