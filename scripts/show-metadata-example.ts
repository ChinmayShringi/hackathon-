#!/usr/bin/env tsx

import { config } from 'dotenv';
config();

import { Pool } from 'pg';

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('📋 METADATA EXAMPLE: Misclassified Generation');
    console.log('==============================================\n');
    
    // Get a specific example of a misclassified generation
    const example = await pool.query(`
      SELECT 
        id,
        user_id,
        recipe_title,
        status,
        metadata,
        created_at,
        updated_at,
        prompt
      FROM generations 
      WHERE user_id != 'system_backlog'
        AND metadata::text LIKE '%"request_origin":"backlog"%'
      ORDER BY created_at DESC
      LIMIT 1;
    `);
    
    if (example.rows.length > 0) {
      const gen = example.rows[0];
      console.log(`🔍 Generation ID: ${gen.id}`);
      console.log(`👤 Current Owner: ${gen.user_id}`);
      console.log(`📹 Recipe: ${gen.recipe_title}`);
      console.log(`📊 Status: ${gen.status}`);
      console.log(`📅 Created: ${gen.created_at}`);
      console.log(`🔄 Updated: ${gen.updated_at}`);
      console.log(`📝 Prompt: ${gen.prompt || 'N/A'}`);
      
      console.log('\n📋 FULL METADATA:');
      console.log('================');
      console.log(JSON.stringify(gen.metadata, null, 2));
      
      // Highlight the problematic fields
      console.log('\n🚨 PROBLEMATIC METADATA FIELDS:');
      console.log('================================');
      const metadata = gen.metadata;
      
      if (metadata.request_origin === 'backlog') {
        console.log(`   ❌ request_origin: ${metadata.request_origin} (should be 'user' after reassignment)`);
      }
      
      if (metadata.isGuest !== undefined) {
        console.log(`   ℹ️  isGuest: ${metadata.isGuest}`);
      }
      
      if (metadata.workflowType) {
        console.log(`   ℹ️  workflowType: ${metadata.workflowType}`);
      }
      
      if (metadata.formData) {
        console.log(`   ℹ️  Has formData: ${Object.keys(metadata.formData).length} fields`);
      }
      
      // Show what this generation should look like after proper reassignment
      console.log('\n✅ WHAT THIS METADATA SHOULD LOOK LIKE:');
      console.log('========================================');
      console.log('   After Instant reassignment, this field should be:');
      console.log('   - request_origin: "user" (changed from "backlog")');
      console.log('   - Should retain: isGuest, workflowType, formData, etc.');
      console.log('   - Should reflect the new owner, not the original backlog status');
      
    } else {
      console.log('❌ No misclassified generations found');
    }
    
  } catch (error) {
    console.error('❌ Error showing metadata example:', error);
  } finally {
    await pool.end();
  }
}

// Run the script
main().catch((error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});
