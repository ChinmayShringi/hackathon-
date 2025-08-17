import { config } from 'dotenv';
import { Pool } from 'pg';

config(); // Load environment variables first

async function verifyMigration() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('🔍 Verifying migration results...\\n');
    
    // Check current generation ownership
    console.log('📊 Current generation ownership:');
    const currentStats = await pool.query(`
      SELECT 
        user_id,
        COUNT(*) as count,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'pending' OR status = 'processing') as pending,
        COUNT(*) FILTER (WHERE status = 'failed') as failed
      FROM generations 
      WHERE user_id IN ('guest_user', 'shared_guest_user', 'system_backlog')
      GROUP BY user_id
      ORDER BY user_id
    `);
    
    console.log('User ID\\t\\t| Total | Completed | Pending | Failed');
    console.log('--------\\t\\t| ----- | --------- | ------- | ------');
    currentStats.rows.forEach((row: any) => {
      console.log(`${row.user_id}\\t| ${row.count}\\t | ${row.completed}\\t\\t | ${row.pending}\\t | ${row.failed}`);
    });
    
    // Check what the guest stats should now show
    console.log('\\n🔍 Simulating guest stats endpoint for shared_guest_user:');
    
    // Get a session token from shared_guest_user
    const sharedGuestResult = await pool.query(`
      SELECT session_token FROM users WHERE id = 'shared_guest_user'
    `);
    
    if (sharedGuestResult.rows.length > 0 && sharedGuestResult.rows[0].session_token) {
      const sessionToken = sharedGuestResult.rows[0].session_token;
      console.log(`Using session token: ${sessionToken.substring(0, 20)}...`);
      
      // Simulate what getUserBySessionToken does
      const userResult = await pool.query(`
        SELECT id, email, account_type, credits FROM users WHERE session_token = $1
      `, [sessionToken]);
      
      if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        console.log(`Session token resolves to user: ${user.id} (${user.email})`);
        
        // Now simulate what getGuestGenerationStats does
        const statsResult = await pool.query(`
          SELECT 
            COUNT(*) FILTER (WHERE status = 'pending' OR status = 'processing') as pending,
            COUNT(*) FILTER (WHERE status = 'completed') as completed,
            COUNT(*) FILTER (WHERE status = 'failed') as failed,
            COUNT(*) as total
          FROM generations 
          WHERE user_id = $1
        `, [user.id]);
        
        const stats = statsResult.rows[0];
        console.log(`\\n📊 Expected guest stats for ${user.id}:`);
        console.log(`- Pending: ${stats.pending}`);
        console.log(`- Completed: ${stats.completed}`);
        console.log(`- Failed: ${stats.failed}`);
        console.log(`- Total: ${stats.total}`);
        console.log(`- Remaining credits: ${user.credits}`);
        
        // Check what My Makes should show
        const myMakesResult = await pool.query(`
          SELECT COUNT(*) as total FROM generations WHERE user_id = $1
        `, [user.id]);
        
        console.log(`\\n📱 Expected My Makes total: ${myMakesResult.rows[0].total}`);
        
        // Show a few recent generations
        console.log('\\n📋 Recent generations for shared_guest_user:');
        const recentGenerations = await pool.query(`
          SELECT 
            id,
            short_id,
            status,
            created_at,
            recipe_title
          FROM generations 
          WHERE user_id = $1
          ORDER BY created_at DESC
          LIMIT 5
        `, [user.id]);
        
        console.log('ID\\t| Short ID\\t| Status\\t\\t| Created At\\t\\t| Recipe');
        console.log('---\\t| --------\\t| -------\\t\\t| -----------\\t\\t| ------');
        recentGenerations.rows.forEach((row: any) => {
          console.log(`${row.id}\\t| ${row.short_id}\\t| ${row.status}\\t\\t| ${row.created_at}\\t| ${row.recipe_title}`);
        });
      }
    }
    
    console.log('\\n✅ Migration verification complete!');
    console.log('\\n🎯 Expected behavior after migration:');
    console.log('- Guest stats should show 31 total generations');
    console.log('- My Makes should show 31 total generations');
    console.log('- All guest generations are now under shared_guest_user');
    console.log('- No generations remain under guest_user');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

verifyMigration(); 