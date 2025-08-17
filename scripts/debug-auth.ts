import { config } from 'dotenv';
import { Pool } from 'pg';

// Load environment variables first
config();

async function debugAuth() {
  console.log('🔍 Debugging authentication system...\n');

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    // Test 1: Check if shared_guest_user exists
    console.log('1. Checking if shared_guest_user exists:');
    const sharedUserResult = await pool.query(`
      SELECT id, account_type, session_token, credits
      FROM users 
      WHERE id = 'shared_guest_user'
    `);
    
    if (sharedUserResult.rows.length > 0) {
      const user = sharedUserResult.rows[0];
      console.log('   ✅ shared_guest_user exists:');
      console.log('   - ID:', user.id);
      console.log('   - Account Type:', user.account_type);
      console.log('   - Session Token:', user.session_token);
      console.log('   - Credits:', user.credits);
    } else {
      console.log('   ❌ shared_guest_user not found');
    }

    // Test 2: Check environment config
    console.log('\n2. Environment configuration:');
    console.log('   DEV_BOUND_GUEST_ID:', process.env.DEV_BOUND_GUEST_ID);

    // Test 3: Check generations for shared_guest_user
    console.log('\n3. Checking generations for shared_guest_user:');
    const generationsResult = await pool.query(`
      SELECT id, recipe_title, status, created_at
      FROM generations 
      WHERE user_id = 'shared_guest_user'
      ORDER BY created_at DESC
      LIMIT 5
    `);
    
    console.log(`   Found ${generationsResult.rows.length} recent generations`);
    if (generationsResult.rows.length > 0) {
      console.log('   First generation:', {
        id: generationsResult.rows[0].id,
        recipeTitle: generationsResult.rows[0].recipe_title,
        status: generationsResult.rows[0].status,
        createdAt: generationsResult.rows[0].created_at
      });
    }

    // Test 4: Check total count of generations for shared_guest_user
    console.log('\n4. Total generations count:');
    const countResult = await pool.query(`
      SELECT COUNT(*) as total
      FROM generations 
      WHERE user_id = 'shared_guest_user'
    `);
    console.log(`   Total generations for shared_guest_user: ${countResult.rows[0].total}`);

    // Test 5: Check if any users have the dev_bound_session_token
    console.log('\n5. Checking for dev_bound_session_token:');
    const sessionResult = await pool.query(`
      SELECT id, account_type, session_token
      FROM users 
      WHERE session_token = 'dev_bound_session_token'
    `);
    
    if (sessionResult.rows.length > 0) {
      console.log('   Users with dev_bound_session_token:');
      sessionResult.rows.forEach((row: any) => {
        console.log(`   - ${row.id} (${row.account_type})`);
      });
    } else {
      console.log('   No users found with dev_bound_session_token');
    }

    console.log('\n🔍 Debug complete!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

debugAuth().catch(console.error); 