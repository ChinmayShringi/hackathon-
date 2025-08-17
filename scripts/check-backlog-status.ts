import { config } from 'dotenv';
config();

import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { generations } from '../shared/schema';

const SYSTEM_BACKLOG_USER_ID = 'system_backlog';

async function checkBacklogStatus() {
  console.log('🔍 Checking backlog generation status...\n');

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle({ client: pool });

  try {
    // Get all backlog generations with their current status
    const backlogGenerations = await db
      .select({
        id: generations.id,
        shortId: generations.shortId,
        recipeTitle: generations.recipeTitle,
        status: generations.status,
        falJobId: generations.falJobId,
        imageUrl: generations.imageUrl,
        videoUrl: generations.videoUrl,
        thumbnailUrl: generations.thumbnailUrl,
        metadata: generations.metadata,
        createdAt: generations.createdAt,
        updatedAt: generations.updatedAt
      })
      .from(generations)
      .where(eq(generations.userId, SYSTEM_BACKLOG_USER_ID))
      .orderBy(generations.createdAt);

    if (backlogGenerations.length === 0) {
      console.log('No backlog generations found.');
      return;
    }

    console.log(`Found ${backlogGenerations.length} backlog generations:\n`);

    // Group by status
    const statusCounts = backlogGenerations.reduce((acc, gen) => {
      acc[gen.status] = (acc[gen.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('📊 Status Summary:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   ${status}: ${count} generations`);
    });

    console.log('\n🎬 Detailed Status:');
    for (const gen of backlogGenerations) {
      console.log(`\n   Generation ${gen.id} (${gen.shortId}):`);
      console.log(`     Recipe: ${gen.recipeTitle}`);
      console.log(`     Status: ${gen.status}`);
      console.log(`     FAL Job ID: ${gen.falJobId || 'None'}`);
      
      if (gen.videoUrl) {
        console.log(`     ✅ Video URL: ${gen.videoUrl}`);
      }
      if (gen.thumbnailUrl) {
        console.log(`     ✅ Thumbnail URL: ${gen.thumbnailUrl}`);
      }
      if (gen.imageUrl) {
        console.log(`     ✅ Image URL: ${gen.imageUrl}`);
      }
      
      if (gen.metadata) {
        const metadata = gen.metadata as any;
        if (metadata.endpoint) {
          console.log(`     📍 Endpoint: ${metadata.endpoint}`);
        }
        if (metadata.formData) {
          console.log(`     📝 Form Data: ${Object.keys(metadata.formData).length} variables`);
        }
      }
      
      console.log(`     Created: ${gen.createdAt}`);
      if (gen.updatedAt) {
        console.log(`     Updated: ${gen.updatedAt}`);
      }
    }

    // Check for completed generations that might be missing URLs
    const completedWithoutUrls = backlogGenerations.filter(gen => 
      gen.status === 'completed' && !gen.videoUrl && !gen.imageUrl && !gen.thumbnailUrl
    );

    if (completedWithoutUrls.length > 0) {
      console.log(`\n⚠️  Found ${completedWithoutUrls.length} completed generations without URLs:`);
      completedWithoutUrls.forEach(gen => {
        console.log(`   - Generation ${gen.id} (${gen.shortId}): ${gen.recipeTitle}`);
      });
    }

    // Check for processing generations
    const processingGenerations = backlogGenerations.filter(gen => 
      gen.status === 'processing'
    );

    if (processingGenerations.length > 0) {
      console.log(`\n⏳ Found ${processingGenerations.length} generations still processing:`);
      processingGenerations.forEach(gen => {
        console.log(`   - Generation ${gen.id} (${gen.shortId}): ${gen.recipeTitle} (FAL Job: ${gen.falJobId})`);
      });
    }

  } catch (error) {
    console.error('Error checking backlog status:', error);
  } finally {
    await pool.end();
  }
}

checkBacklogStatus().catch(console.error); 