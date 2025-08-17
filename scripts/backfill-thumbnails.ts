#!/usr/bin/env tsx

import '../server/env.js';
import { db } from '../server/db';
import { generations } from '../shared/schema';
import { eq, and } from 'drizzle-orm';
import { thumbnailService } from '../server/thumbnail-service';

// Accept an optional generation ID from the command line
const targetId = process.argv[2] ? parseInt(process.argv[2], 10) : null;

async function backfillThumbnails() {
  console.log('🔧 Starting GIF thumbnail backfill for completed video generations...\n');

  let rows;
  if (targetId) {
    // Only process the specified generation
    rows = await db
      .select()
      .from(generations)
      .where(and(
        eq(generations.id, targetId),
        eq(generations.status, 'completed'),
        eq(generations.type, 'video')
      ));
  } else {
    // Find all completed video generations (filter for videoUrl in JS)
    rows = await db
      .select()
      .from(generations)
      .where(and(
        eq(generations.status, 'completed'),
        eq(generations.type, 'video')
      ));
  }

  // Only process those with a videoUrl
  const filteredRows = rows.filter(gen => !!gen.videoUrl);

  if (targetId) {
    console.log(`📊 Found ${filteredRows.length} completed video generation(s) to process for ID ${targetId}\n`);
  } else {
    console.log(`📊 Found ${filteredRows.length} completed video generations to process\n`);
  }

  let updated = 0;
  let failed = 0;
  for (const gen of filteredRows) {
    try {
      const videoUrl = gen.videoUrl;
      const s3Key = gen.s3Key || (videoUrl ? videoUrl.split('/').slice(-2).join('/') : '');
      const assetId = gen.assetId || gen.id.toString();
      if (!videoUrl || !s3Key) {
        console.warn(`⚠️  Skipping generation ${gen.id}: missing videoUrl or s3Key`);
        continue;
      }
      console.log(`▶️  Processing generation ${gen.id}: ${videoUrl}`);
      await thumbnailService.generateThumbnail({
        generationId: gen.id,
        videoUrl,
        s3Key,
        assetId
      });
      updated++;
    } catch (error) {
      console.error(`❌ Failed to process generation ${gen.id}:`, error);
      failed++;
    }
  }

  console.log(`\n✅ Backfill complete. Updated: ${updated}, Failed: ${failed}`);
}

backfillThumbnails(); 