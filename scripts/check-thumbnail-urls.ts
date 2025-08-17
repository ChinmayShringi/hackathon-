import { config } from 'dotenv';
import { Pool } from 'pg';

config(); // Load environment variables first

async function checkThumbnailUrls() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('Checking thumbnail URLs for video generations...\n');
    
    // Check if thumbnail_url column exists
    const columnCheck = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'generations' 
      AND column_name = 'thumbnail_url'
    `);
    
    if (columnCheck.rows.length > 0) {
      console.log('✅ thumbnail_url field exists in generations table:');
      console.log(columnCheck.rows[0]);
    } else {
      console.log('❌ thumbnail_url field does NOT exist in generations table');
      return;
    }
    
    // Check recent video generations for thumbnail URLs
    const videoGenerations = await pool.query(`
      SELECT 
        id, 
        short_id,
        video_url,
        thumbnail_url,
        status,
        created_at
      FROM generations 
      WHERE video_url IS NOT NULL 
      AND status = 'completed'
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    
    console.log(`\n📹 Found ${videoGenerations.rows.length} recent video generations:`);
    
    videoGenerations.rows.forEach((gen, index) => {
      console.log(`\n${index + 1}. Generation ${gen.id} (${gen.short_id}):`);
      console.log(`   Video URL: ${gen.video_url}`);
      console.log(`   Thumbnail URL: ${gen.thumbnail_url || 'NULL'}`);
      console.log(`   Status: ${gen.status}`);
      console.log(`   Created: ${gen.created_at}`);
    });
    
    // Count how many have thumbnails
    const withThumbnails = videoGenerations.rows.filter(gen => gen.thumbnail_url);
    console.log(`\n📊 Summary: ${withThumbnails.length}/${videoGenerations.rows.length} have thumbnail URLs`);
    
  } catch (error) {
    console.error('Error checking thumbnail URLs:', error);
  } finally {
    await pool.end();
  }
}

checkThumbnailUrls(); 