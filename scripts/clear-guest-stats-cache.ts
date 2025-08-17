import { config } from 'dotenv';
import { Pool } from 'pg';

config(); // Load environment variables first

async function clearGuestStatsCache() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('🔍 Clearing guest stats cache...\\n');
    
    // Check if there's a cache service that needs to be cleared
    // The cache key format is: guestGenerationsStatsKey(userId)
    console.log('📊 Current cache keys that might be affecting guest stats:');
    
    // Check what the cache key would be for shared_guest_user
    const cacheKey = `guestGenerationsStats_shared_guest_user`;
    console.log(`Cache key for shared_guest_user: ${cacheKey}`);
    
    // Since we can't directly access the cache service from here,
    // let's check if the server needs to be restarted
    console.log('\\n🔄 The guest stats endpoint might be cached.');
    console.log('Try restarting the server to clear any in-memory caches.');
    
    // Let's also test the actual query that should be used
    console.log('\\n🔍 Testing the actual query that should be used:');
    
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'pending' OR status = 'processing') as pending,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'failed') as failed,
        COUNT(*) as total
      FROM generations 
      WHERE user_id = 'shared_guest_user'
    `);
    
    const stats = statsResult.rows[0];
    console.log(`📊 Direct database query result for shared_guest_user:`);
    console.log(`- Pending: ${stats.pending}`);
    console.log(`- Completed: ${stats.completed}`);
    console.log(`- Failed: ${stats.failed}`);
    console.log(`- Total: ${stats.total}`);
    
    console.log('\\n✅ This should be what the guest stats endpoint returns after cache is cleared.');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

clearGuestStatsCache(); 