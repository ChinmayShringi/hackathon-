#!/usr/bin/env tsx

import { config } from 'dotenv';
config();

import { Pool } from 'pg';

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('🔧 Setting up backlog cleanup function manually...');
    console.log('   (pg_cron access is restricted, so we\'ll create the function for manual use)');
    console.log('');
    
    // Create the cleanup function
    console.log('📝 Creating cleanup function...');
    await pool.query(`
      CREATE OR REPLACE FUNCTION backlog_cleanup_failed_generations()
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      DECLARE
        cutoff_time TIMESTAMP;
        max_failed_per_recipe INTEGER := 10;
        recipe_record RECORD;
        generations_to_remove INTEGER;
        removed_count INTEGER;
        total_removed INTEGER := 0;
      BEGIN
        -- Set cutoff time to 24 hours ago
        cutoff_time := NOW() - INTERVAL '24 hours';
        
        -- Log start of cleanup
        RAISE NOTICE 'Starting backlog cleanup at %', NOW();
        
        -- Loop through each recipe that has failed generations
        FOR recipe_record IN
          SELECT 
            recipe_id,
            COUNT(*) as failed_count
          FROM generations 
          WHERE user_id = 'system_backlog' 
            AND status = 'failed'
            AND updated_at < cutoff_time
          GROUP BY recipe_id
        LOOP
          -- Calculate how many to remove (keep max_failed_per_recipe)
          generations_to_remove := GREATEST(0, recipe_record.failed_count - max_failed_per_recipe);
          
          IF generations_to_remove > 0 THEN
            -- Remove oldest failed generations for this recipe
            DELETE FROM generations 
            WHERE id IN (
              SELECT id 
              FROM generations 
              WHERE recipe_id = recipe_record.recipe_id
                AND user_id = 'system_backlog'
                AND status = 'failed'
                AND updated_at < cutoff_time
              ORDER BY updated_at ASC
              LIMIT generations_to_remove
            );
            
            GET DIAGNOSTICS removed_count = ROW_COUNT;
            total_removed := total_removed + removed_count;
            
            RAISE NOTICE 'Recipe %: removed % failed generations, kept %', 
              recipe_record.recipe_id, removed_count, 
              (recipe_record.failed_count - removed_count);
          END IF;
        END LOOP;
        
        -- Log completion
        RAISE NOTICE 'Backlog cleanup completed: removed % total failed generations', total_removed;
        
        -- Insert cleanup log record
        INSERT INTO credit_transactions (
          user_id, amount, type, description, created_at
        ) VALUES (
          'system_backlog', 
          total_removed, 
          'backlog_cleanup', 
          'Manual cleanup of failed generations', 
          NOW()
        );
        
      EXCEPTION
        WHEN OTHERS THEN
          RAISE NOTICE 'Error in backlog cleanup: %', SQLERRM;
          RAISE;
      END;
      $$;
    `);
    
    console.log('✅ Cleanup function created successfully');
    
    // Test the function
    console.log('\n🧪 Testing cleanup function...');
    const testResult = await pool.query(`SELECT backlog_cleanup_failed_generations();`);
    console.log('✅ Function test completed');
    
    // Show current backlog status
    console.log('\n📊 Current backlog status:');
    const status = await pool.query(`
      SELECT 
        COUNT(*) as total_generations,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'failed') as failed,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'processing') as processing
      FROM generations 
      WHERE user_id = 'system_backlog';
    `);
    
    const stats = status.rows[0];
    console.log(`   Total generations: ${stats.total_generations}`);
    console.log(`   Completed: ${stats.completed}`);
    console.log(`   Failed: ${stats.failed}`);
    console.log(`   Pending: ${stats.pending}`);
    console.log(`   Processing: ${stats.processing}`);
    
    // Show recipes with failed generations
    console.log('\n❌ Recipes with failed generations:');
    const recipesWithFailed = await pool.query(`
      SELECT 
        r.name as recipe_name,
        COUNT(g.id) as failed_count,
        MAX(g.updated_at) as latest_failure
      FROM generations g
      JOIN recipes r ON g.recipe_id = r.id
      WHERE g.user_id = 'system_backlog' 
        AND g.status = 'failed'
      GROUP BY r.id, r.name
      ORDER BY failed_count DESC;
    `);
    
    for (const recipe of recipesWithFailed.rows) {
      const ageSeconds = Math.floor((Date.now() - new Date(recipe.latest_failure).getTime()) / 1000);
      const ageFormatted = ageSeconds > 86400 
        ? `${Math.floor(ageSeconds / 86400)} days ago`
        : ageSeconds > 3600 
          ? `${Math.floor(ageSeconds / 3600)} hours ago`
          : `${Math.floor(ageSeconds / 60)} minutes ago`;
      
      console.log(`   ${recipe.recipe_name}: ${recipe.failed_count} failed (latest: ${ageFormatted})`);
    }
    
    console.log('\n🎉 Setup complete!');
    console.log('\n📚 Usage:');
    console.log('   Manual cleanup: npx tsx scripts/run-backlog-cleanup.ts cleanup');
    console.log('   Check status: npx tsx scripts/run-backlog-cleanup.ts status');
    console.log('   Emergency cleanup: npx tsx scripts/run-backlog-cleanup.ts emergency');
    console.log('');
    console.log('💡 To automate daily cleanup, you can:');
    console.log('   1. Add to your system cron: 0 2 * * * cd /path/to/delula && npm run backlog-cleanup cleanup');
    console.log('   2. Use a process manager like PM2 with cron scheduling');
    console.log('   3. Set up a GitHub Action with cron scheduling');
    console.log('   4. Use AWS EventBridge or similar cloud scheduling service');
    
  } catch (error) {
    console.error('❌ Error setting up cleanup function:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the script
main().catch((error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});
