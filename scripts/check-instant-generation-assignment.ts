import { config } from 'dotenv';
import { Pool } from 'pg';

config(); // Load environment variables first

async function checkInstantGenerationAssignment() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('🔍 Checking instant generation assignment...\n');
    
    // First, let's see what the instant generation endpoint should be doing
    console.log('📋 Current backlog generations available:');
    const backlogResult = await pool.query(`
      SELECT 
        id,
        user_id,
        recipe_id,
        status,
        created_at
      FROM generations 
      WHERE user_id = 'system_backlog' 
        AND status = 'completed'
      ORDER BY created_at ASC
      LIMIT 5
    `);
    
    console.log('Backlog generations:');
    backlogResult.rows.forEach((row: any) => {
      console.log(`- ID: ${row.id}, Recipe: ${row.recipe_id}, Status: ${row.status}, Created: ${row.created_at}`);
    });
    
    console.log('\n🎯 Testing instant generation claim...');
    
    // Simulate what the claimBacklogGeneration function does
    const claimResult = await pool.query(`
      UPDATE generations 
      SET 
        user_id = 'guest_user',
        created_at = NOW(),
        updated_at = NOW()
      WHERE id IN (
        SELECT id 
        FROM generations 
        WHERE recipe_id = 18 
          AND user_id = 'system_backlog' 
          AND status = 'completed'
        ORDER BY created_at ASC
        LIMIT 1
        FOR UPDATE SKIP LOCKED
      )
      RETURNING id, user_id, recipe_id, status
    `);
    
    if (claimResult.rows.length > 0) {
      console.log('✅ Successfully claimed generation:');
      console.log(`- ID: ${claimResult.rows[0].id}`);
      console.log(`- User ID: ${claimResult.rows[0].user_id}`);
      console.log(`- Recipe ID: ${claimResult.rows[0].recipe_id}`);
      console.log(`- Status: ${claimResult.rows[0].status}`);
    } else {
      console.log('❌ No generation was claimed');
    }
    
    console.log('\n📊 Current guest user assignments:');
    const guestResult = await pool.query(`
      SELECT 
        user_id,
        COUNT(*) as count
      FROM generations 
      WHERE user_id IN ('guest_user', 'shared_guest_user')
      GROUP BY user_id
      ORDER BY user_id
    `);
    
    guestResult.rows.forEach((row: any) => {
      console.log(`- ${row.user_id}: ${row.count} generations`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

checkInstantGenerationAssignment().catch(console.error); 