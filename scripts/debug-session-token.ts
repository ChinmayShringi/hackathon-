import { config } from 'dotenv';
import { Pool } from 'pg';

config(); // Load environment variables first

async function debugSessionToken() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('🔍 Debugging session token resolution...\\n');
    
    // Check what session tokens exist and what they map to
    console.log('📊 Session tokens and their user mappings:');
    const sessionResult = await pool.query(`
      SELECT 
        session_token,
        user_id,
        created_at,
        expires_at
      FROM user_sessions 
      WHERE user_id IN ('guest_user', 'shared_guest_user')
      ORDER BY created_at DESC
      LIMIT 10
    `);
    
    console.log('Session Token\\t\\t\\t\\t| User ID\\t\\t| Created At\\t\\t\\t| Expires At');
    console.log('----------------\\t\\t\\t\\t| --------\\t\\t| -----------\\t\\t\\t| -----------');
    sessionResult.rows.forEach((row: any) => {
      console.log(`${row.session_token}\\t| ${row.user_id}\\t\\t| ${row.created_at}\\t| ${row.expires_at}`);
    });
    
    // Check what the current guest user should be
    console.log('\\n🔍 Current guest user info:');
    const guestResult = await pool.query(`
      SELECT 
        id,
        email,
        account_type,
        credits,
        created_at
      FROM users 
      WHERE id = 'shared_guest_user'
    `);
    
    if (guestResult.rows.length > 0) {
      const user = guestResult.rows[0];
      console.log(`- ID: ${user.id}`);
      console.log(`- Email: ${user.email}`);
      console.log(`- Account Type: ${user.account_type}`);
      console.log(`- Credits: ${user.credits}`);
      console.log(`- Created: ${user.created_at}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

debugSessionToken(); 