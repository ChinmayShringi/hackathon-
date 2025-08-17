import { config } from 'dotenv';
import { Pool } from 'pg';

config(); // Load environment variables first

async function fixMissingThumbnails() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('Checking for video generations without thumbnails...\n');
    
    // Find video generations without thumbnails
    const missingThumbnails = await pool.query(`
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
      AND (thumbnail_url IS NULL OR thumbnail_url = '')
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    
    console.log(`Found ${missingThumbnails.rows.length} video generations without thumbnails:`);
    
    if (missingThumbnails.rows.length === 0) {
      console.log('✅ All video generations have thumbnails!');
      return;
    }
    
    missingThumbnails.rows.forEach((gen, index) => {
      console.log(`\n${index + 1}. Generation ${gen.id} (${gen.short_id}):`);
      console.log(`   Video URL: ${gen.video_url}`);
      console.log(`   Thumbnail URL: ${gen.thumbnail_url || 'NULL'}`);
      console.log(`   Status: ${gen.status}`);
      console.log(`   Created: ${gen.created_at}`);
    });
    
    console.log('\n🔧 To fix these, you can:');
    console.log('1. Manually trigger thumbnail generation for each generation');
    console.log('2. Or wait for the next video generation to complete (thumbnails are generated automatically)');
    
    // For the most recent one, let's try to trigger thumbnail generation
    if (missingThumbnails.rows.length > 0) {
      const mostRecent = missingThumbnails.rows[0];
      console.log(`\n🎬 Most recent generation without thumbnail: ${mostRecent.id}`);
      console.log(`   Video URL: ${mostRecent.video_url}`);
      
      // Extract asset ID from video URL
      const videoUrl = mostRecent.video_url;
      const assetId = videoUrl.split('/').pop()?.split('.')[0] || 'unknown';
      const s3Key = videoUrl.split('/').pop() || 'unknown';
      
      console.log(`   Extracted Asset ID: ${assetId}`);
      console.log(`   Extracted S3 Key: ${s3Key}`);
      
      console.log('\n💡 To manually trigger thumbnail generation, you can:');
      console.log(`   - Call the thumbnail service for generation ${mostRecent.id}`);
      console.log(`   - Or wait for the next video generation to complete`);
    }
    
  } catch (error) {
    console.error('Error checking missing thumbnails:', error);
  } finally {
    await pool.end();
  }
}

fixMissingThumbnails(); 