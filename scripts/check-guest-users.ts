import { config } from 'dotenv';
import { Pool } from 'pg';

config(); // Load environment variables first

async function checkGuestUsers() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('🔍 Checking guest user accounts in database...\n');
    
    // Check what guest users exist
    const usersResult = await pool.query(`
      SELECT 
        id,
        email,
        account_type,
        credits,
        created_at
      FROM users 
      WHERE id LIKE '%guest%' OR id LIKE '%shared%'
      ORDER BY id
    `);
    
    console.log('👥 Guest user accounts:');
    if (usersResult.rows.length === 0) {
      console.log('No guest user accounts found');
    } else {
      usersResult.rows.forEach((row: any) => {
        console.log(`- ID: ${row.id}`);
        console.log(`  Email: ${row.email || 'NULL'}`);
        console.log(`  Account Type: ${row.account_type}`);
        console.log(`  Credits: ${row.credits}`);
        console.log(`  Created: ${row.created_at}`);
        console.log('');
      });
    }
    
    console.log('📊 Generation assignments by user ID:');
    const generationResult = await pool.query(`
      SELECT 
        user_id,
        COUNT(*) as count,
        MIN(created_at) as first_generation,
        MAX(created_at) as last_generation
      FROM generations 
      WHERE user_id LIKE '%guest%' OR user_id LIKE '%shared%'
      GROUP BY user_id
      ORDER BY user_id
    `);
    
    generationResult.rows.forEach((row: any) => {
      console.log(`- ${row.user_id}: ${row.count} generations`);
      console.log(`  First: ${row.first_generation}`);
      console.log(`  Last: ${row.last_generation}`);
      console.log('');
    });
    
    console.log('🎯 Checking for specific user IDs:');
    const specificUsers = ['guest_user', 'shared_guest_user', 'boundGuestId'];
    
    for (const userId of specificUsers) {
      const userCheck = await pool.query(`
        SELECT COUNT(*) as exists
        FROM users 
        WHERE id = $1
      `, [userId]);
      
      console.log(`- ${userId}: ${userCheck.rows[0].exists > 0 ? 'EXISTS' : 'NOT FOUND'}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

checkGuestUsers().catch(console.error); 