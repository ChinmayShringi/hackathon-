import { config } from 'dotenv';
import { Pool } from 'pg';

config(); // Load environment variables first

async function checkRecentGenerations() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('🔍 Checking last 10 generations...\n');
    
    const result = await pool.query(`
      SELECT 
        id,
        user_id,
        recipe_id,
        status,
        created_at,
        short_id,
        metadata->>'sessionId' as session_id
      FROM generations 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    
    console.log('📊 Last 10 generations:');
    console.log('ID\t| User ID\t\t| Recipe ID\t| Status\t\t| Created At\t\t| Short ID\t| Session ID');
    console.log('---\t| --------\t\t| ---------\t| ------\t\t| ----------\t\t| --------\t| ----------');
    
    result.rows.forEach((row: any) => {
      console.log(
        `${row.id}\t| ${row.user_id?.padEnd(16) || 'NULL'.padEnd(16)}\t| ${row.recipe_id}\t\t| ${row.status?.padEnd(12) || 'NULL'.padEnd(12)}\t| ${row.created_at?.toISOString().slice(0, 19) || 'NULL'}\t| ${row.short_id?.padEnd(8) || 'NULL'.padEnd(8)}\t| ${row.session_id || 'NULL'}`
      );
    });
    
    console.log('\n📈 Summary:');
    const userCounts = result.rows.reduce((acc: any, row: any) => {
      acc[row.user_id || 'NULL'] = (acc[row.user_id || 'NULL'] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(userCounts).forEach(([userId, count]) => {
      console.log(`- ${userId}: ${count} generations`);
    });
    
    console.log('\n🎯 Instant generation test:');
    console.log('Looking for generations with user_id = "guest_user"...');
    
    const guestResult = await pool.query(`
      SELECT COUNT(*) as count
      FROM generations 
      WHERE user_id = 'guest_user'
    `);
    
    console.log(`Total generations assigned to 'guest_user': ${guestResult.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error querying database:', error);
  } finally {
    await pool.end();
  }
}

checkRecentGenerations().catch(console.error); 