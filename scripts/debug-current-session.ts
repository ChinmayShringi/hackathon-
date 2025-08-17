import { config } from 'dotenv';
import { Pool } from 'pg';

config(); // Load environment variables first

async function debugCurrentSession() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('🔍 Debugging current session...\\n');
    
    // Check what session tokens exist for guest users
    console.log('📊 Guest users and their session tokens:');
    const sessionResult = await pool.query(`
      SELECT 
        id,
        email,
        session_token,
        account_type,
        credits,
        created_at
      FROM users 
      WHERE id IN ('guest_user', 'shared_guest_user')
      ORDER BY id
    `);
    
    console.log('User ID\\t\\t| Email\\t| Session Token\\t\\t\\t\\t| Account Type | Credits');
    console.log('--------\\t\\t| -----\\t| ---------------\\t\\t\\t\\t| ------------ | -------');
    sessionResult.rows.forEach((row: any) => {
      const sessionToken = row.session_token ? row.session_token.substring(0, 20) + '...' : 'null';
      console.log(`${row.id}\\t| ${row.email || 'null'}\\t| ${sessionToken}\\t| ${row.account_type}\\t\\t\\t | ${row.credits}`);
    });
    
    // Check what the current guest stats endpoint should be doing
    console.log('\\n🔍 Simulating guest stats endpoint...');
    
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
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

debugCurrentSession(); 