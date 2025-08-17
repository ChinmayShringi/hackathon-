#!/usr/bin/env tsx

import './_setup-env.ts';
import { db } from '../server/db.ts';
import { generations } from '../shared/schema.ts';
import { eq, desc } from 'drizzle-orm';

async function backfillVideoUrl() {
  console.log('🔧 Starting video URL backfill for last 20 completed generations...\n');

  try {
    // Get last 20 completed generations
    const rows = await db
      .select()
      .from(generations)
      .where(eq(generations.status, 'completed'))
      .orderBy(desc(generations.createdAt))
      .limit(20);

    console.log(`📊 Found ${rows.length} completed generations to check\n`);

    let updated = 0;
    for (const gen of rows) {
      const metadata = gen.metadata as any;
      const isVideo =
        gen.type === 'video' ||
        (metadata && (metadata.generationType === 'text_to_video' || metadata.workflowType === 'image_to_video'));
      
      if (
        isVideo &&
        !gen.videoUrl &&
        gen.imageUrl &&
        (gen.imageUrl.endsWith('.mp4') || gen.imageUrl.endsWith('.mov') || gen.imageUrl.endsWith('.webm'))
      ) {
        console.log(`🔄 Updating generation ${gen.id}:`);
        console.log(`   Short ID: ${gen.shortId}`);
        console.log(`   Type: ${gen.type}`);
        console.log(`   Current imageUrl: ${gen.imageUrl}`);
        console.log(`   Setting videoUrl = imageUrl`);
        
        await db
          .update(generations)
          .set({ videoUrl: gen.imageUrl })
          .where(eq(generations.id, gen.id));
        
        updated++;
        console.log(`   ✅ Updated successfully\n`);
      } else {
        console.log(`⏭️  Skipping generation ${gen.id}:`);
        console.log(`   Short ID: ${gen.shortId}`);
        console.log(`   Type: ${gen.type}`);
        console.log(`   videoUrl: ${gen.videoUrl || 'null'}`);
        console.log(`   imageUrl: ${gen.imageUrl || 'null'}`);
        console.log(`   Is video: ${isVideo}`);
        console.log(`   Has video file: ${gen.imageUrl && (gen.imageUrl.endsWith('.mp4') || gen.imageUrl.endsWith('.mov') || gen.imageUrl.endsWith('.webm'))}`);
        console.log(`   Reason: ${!isVideo ? 'Not a video generation' : gen.videoUrl ? 'Already has videoUrl' : !gen.imageUrl ? 'No imageUrl' : 'ImageUrl is not a video file'}\n`);
      }
    }

    console.log(`🎉 Backfill complete! Updated ${updated} out of ${rows.length} generations.`);
    
    if (updated > 0) {
      console.log(`\n📝 Summary:`);
      console.log(`   - Fixed ${updated} generations with video files in wrong field`);
      console.log(`   - These generations should now work properly with the video player`);
    } else {
      console.log(`\n📝 No generations needed updating.`);
    }

  } catch (error) {
    console.error('❌ Error during backfill:', error);
    throw error;
  } finally {
    await db.$client.end();
  }
}

backfillVideoUrl().then(() => {
  console.log('\n✅ Backfill script completed successfully');
  process.exit(0);
}).catch((error) => {
  console.error('\n❌ Backfill script failed:', error);
  process.exit(1);
}); 