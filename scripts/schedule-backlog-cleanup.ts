#!/usr/bin/env tsx

import { config } from 'dotenv';
config();

import { Pool } from 'pg';

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('⏰ Setting up daily backlog cleanup cron job...');
    
    // Check if pg_cron extension is available
    const extensionCheck = await pool.query(`
      SELECT extname FROM pg_extension WHERE extname = 'cron';
    `);
    
    if (extensionCheck.rows.length === 0) {
      // Try to check if it's available in a different schema
      const schemaCheck = await pool.query(`
        SELECT schemaname, tablename 
        FROM pg_tables 
        WHERE tablename = 'job' 
        AND schemaname LIKE '%cron%';
      `);
      
      if (schemaCheck.rows.length === 0) {
        console.log('❌ pg_cron extension not found. Please install it first:');
        console.log('   CREATE EXTENSION IF NOT EXISTS cron;');
        console.log('');
        console.log('Note: pg_cron requires superuser privileges to install.');
        return;
      } else {
        console.log(`⚠️  Found cron tables in schema: ${schemaCheck.rows[0].schemaname}`);
        console.log('   This suggests pg_cron might be installed but not accessible.');
        console.log('   Please check your database user permissions.');
        return;
      }
    }
    
    console.log('✅ pg_cron extension found');
    
    // Check if the job already exists
    const existingJob = await pool.query(`
      SELECT jobid, jobname, schedule, command 
      FROM cron.job 
      WHERE jobname = 'backlog-cleanup-daily';
    `);
    
    if (existingJob.rows.length > 0) {
      console.log('⚠️  Backlog cleanup job already exists:');
      console.log(`   Job ID: ${existingJob.rows[0].jobid}`);
      console.log(`   Schedule: ${existingJob.rows[0].schedule}`);
      console.log(`   Command: ${existingJob.rows[0].command}`);
      
      const answer = await askQuestion('Do you want to remove the existing job and create a new one? (y/N): ');
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        await pool.query(`SELECT cron.unschedule('backlog-cleanup-daily');`);
        console.log('🗑️  Removed existing job');
      } else {
        console.log('✨ Keeping existing job');
        return;
      }
    }
    
    // Create the daily cleanup job
    // Run at 2:00 AM UTC every day (when traffic is typically low)
    const result = await pool.query(`
      SELECT cron.schedule(
        'backlog-cleanup-daily',
        '0 2 * * *',  -- Daily at 2:00 AM UTC
        'SELECT backlog_cleanup_failed_generations();'
      );
    `);
    
    console.log('✅ Daily backlog cleanup job scheduled successfully!');
    console.log(`   Job ID: ${result.rows[0].schedule}`);
    console.log(`   Schedule: Daily at 2:00 AM UTC`);
    console.log(`   Function: backlog_cleanup_failed_generations()`);
    
    // Create the cleanup function if it doesn't exist
    console.log('\n🔧 Creating cleanup function...');
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
          'Daily cleanup of failed generations', 
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
    
    // Show current cron jobs
    console.log('\n📋 Current cron jobs:');
    const jobs = await pool.query(`
      SELECT jobid, jobname, schedule, command, active 
      FROM cron.job 
      ORDER BY jobid;
    `);
    
    for (const job of jobs.rows) {
      const status = job.active ? '🟢 Active' : '🔴 Inactive';
      console.log(`   ${status} | ${job.jobname} | ${job.schedule} | ${job.command}`);
    }
    
    console.log('\n🎉 Setup complete! The backlog cleanup will run automatically every day at 2:00 AM UTC.');
    console.log('\n📚 Manual commands:');
    console.log('   Check status: npx tsx scripts/run-backlog-cleanup.ts status');
    console.log('   Manual cleanup: npx tsx scripts/run-backlog-cleanup.ts cleanup');
    console.log('   Emergency cleanup: npx tsx scripts/run-backlog-cleanup.ts emergency');
    
  } catch (error) {
    console.error('❌ Error setting up cron job:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Helper function to ask user questions
function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question(question, (answer: string) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Run the script
main().catch((error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});
