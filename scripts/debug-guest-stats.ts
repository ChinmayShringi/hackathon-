import { config } from 'dotenv';
import { Pool } from 'pg';

config(); // Load environment variables first

async function debugGuestStats() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('🔍 Debugging guest stats...\\n');
    
    // Check what the current guest stats endpoint is actually doing
    console.log('📊 Current generations by user ID:');
    const statsResult = await pool.query(`
      SELECT 
        user_id,
        COUNT(*) FILTER (WHERE status = 'pending' OR status = 'processing') as pending,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'failed') as failed,
        COUNT(*) as total
      FROM generations 
      WHERE user_id IN ('guest_user', 'shared_guest_user', 'system_backlog')
      GROUP BY user_id
      ORDER BY user_id
    `);
    
    console.log('User ID\\t\\t| Pending | Completed | Failed | Total');
    console.log('--------\\t\\t| ------- | --------- | ------ | -----');
    statsResult.rows.forEach((row: any) => {
      console.log(`${row.user_id}\\t| ${row.pending}\\t | ${row.completed}\\t\\t | ${row.failed}\\t | ${row.total}`);
    });
    
    console.log('\\n🔍 Checking what user ID the current session is using...');
    
    // Check what user ID the current session would be using
    // This simulates what the guest stats endpoint does
    const sessionResult = await pool.query(`
      SELECT 
        u.id as user_id,
        u.email,
        u.account_type,
        u.credits
      FROM users u
      WHERE u.id = 'shared_guest_user'
    `);
    
    if (sessionResult.rows.length > 0) {
      const user = sessionResult.rows[0];
      console.log(`Current session user: ${user.user_id} (${user.email})`);
      console.log(`Account type: ${user.account_type}, Credits: ${user.credits}`);
      
      // Now check what the guest stats should show for this user
      const userStatsResult = await pool.query(`
        SELECT 
          COUNT(*) FILTER (WHERE status = 'pending' OR status = 'processing') as pending,
          COUNT(*) FILTER (WHERE status = 'completed') as completed,
          COUNT(*) FILTER (WHERE status = 'failed') as failed,
          COUNT(*) as total
        FROM generations 
        WHERE user_id = $1
      `, [user.user_id]);
      
      const stats = userStatsResult.rows[0];
      console.log(`\\n📊 Expected guest stats for ${user.user_id}:`);
      console.log(`- Pending: ${stats.pending}`);
      console.log(`- Completed: ${stats.completed}`);
      console.log(`- Failed: ${stats.failed}`);
      console.log(`- Total: ${stats.total}`);
      console.log(`- Remaining credits: ${user.credits}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

debugGuestStats(); 