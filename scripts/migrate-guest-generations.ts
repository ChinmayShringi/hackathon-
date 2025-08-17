import { config } from 'dotenv';
import { Pool } from 'pg';

config(); // Load environment variables first

async function migrateGuestGenerations() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('🔍 Migrating guest generations...\\n');
    
    // First, let's see what we're working with
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
    
    // Check if there are any generations to migrate
    const guestUserCount = await pool.query(`
      SELECT COUNT(*) as count FROM generations WHERE user_id = 'guest_user'
    `);
    
    if (guestUserCount.rows[0].count === 0) {
      console.log('\\n✅ No generations to migrate from guest_user');
      return;
    }
    
    console.log(`\\n🔄 Found ${guestUserCount.rows[0].count} generations to migrate from guest_user to shared_guest_user`);
    
    // Confirm the migration
    console.log('\\n⚠️  This will transfer ownership of all generations from guest_user to shared_guest_user');
    console.log('This action cannot be undone. Proceeding in 5 seconds...');
    
    // Wait 5 seconds to give user time to cancel
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Start the migration
    console.log('\\n🚀 Starting migration...');
    
    const result = await pool.query(`
      UPDATE generations 
      SET user_id = 'shared_guest_user', 
          updated_at = NOW()
      WHERE user_id = 'guest_user'
    `);
    
    console.log(`✅ Successfully migrated ${result.rowCount} generations`);
    
    // Show the results after migration
    console.log('\\n📊 Generation ownership after migration:');
    const afterStats = await pool.query(`
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
    afterStats.rows.forEach((row: any) => {
      console.log(`${row.user_id}\\t| ${row.count}\\t | ${row.completed}\\t\\t | ${row.pending}\\t | ${row.failed}`);
    });
    
    // Verify the migration
    const remainingGuestUser = await pool.query(`
      SELECT COUNT(*) as count FROM generations WHERE user_id = 'guest_user'
    `);
    
    if (remainingGuestUser.rows[0].count === 0) {
      console.log('\\n✅ Migration completed successfully! No generations remain under guest_user');
    } else {
      console.log(`\\n⚠️  Warning: ${remainingGuestUser.rows[0].count} generations still remain under guest_user`);
    }
    
    console.log('\\n🎉 Migration complete! All guest generations are now consolidated under shared_guest_user');
    
  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

migrateGuestGenerations(); 