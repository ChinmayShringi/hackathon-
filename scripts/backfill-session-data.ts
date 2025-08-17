#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../server/db';
import { generations, users } from '../shared/schema';
import { eq, isNull, not } from 'drizzle-orm';

async function backfillSessionData() {
  console.log('🔄 Starting session data backfill...');

  try {
    // Get all generations
    const allGenerations = await db
      .select({
        id: generations.id,
        userId: generations.userId,
        metadata: generations.metadata
      })
      .from(generations);

    // Filter to only those without sessionId in metadata
    const generationsWithoutSession = allGenerations.filter(gen => {
      if (!gen.metadata) return true;
      const metadata = gen.metadata as any;
      return !metadata.sessionId;
    });

    console.log(`📊 Found ${generationsWithoutSession.length} generations without session data`);

    if (generationsWithoutSession.length === 0) {
      console.log('✅ All generations already have session data!');
      return;
    }

    // Get all users with their session tokens
    const usersWithSessions = await db
      .select({
        id: users.id,
        sessionToken: users.sessionToken
      })
      .from(users)
      .where(not(isNull(users.sessionToken)));

    const sessionMap = new Map(usersWithSessions.map(u => [u.id, u.sessionToken]));

    console.log(`📋 Found ${sessionMap.size} users with session tokens`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const generation of generationsWithoutSession) {
      const sessionToken = sessionMap.get(generation.userId);
      
      if (!sessionToken) {
        console.log(`⚠️  No session token found for user ${generation.userId} (generation ${generation.id})`);
        skippedCount++;
        continue;
      }

      // Update the generation with session data
      const currentMetadata = generation.metadata as any || {};
      const updatedMetadata = {
        ...currentMetadata,
        sessionId: sessionToken
      };

      await db
        .update(generations)
        .set({
          metadata: updatedMetadata,
          updatedAt: new Date()
        })
        .where(eq(generations.id, generation.id));

      updatedCount++;
      
      if (updatedCount % 100 === 0) {
        console.log(`✅ Updated ${updatedCount} generations...`);
      }
    }

    console.log(`\n🎉 Session data backfill complete!`);
    console.log(`✅ Updated: ${updatedCount} generations`);
    console.log(`⚠️  Skipped: ${skippedCount} generations (no session token)`);

    // Verify the results
    const allGenerationsAfter = await db
      .select({
        id: generations.id,
        metadata: generations.metadata
      })
      .from(generations);

    const remainingWithoutSession = allGenerationsAfter.filter(gen => {
      if (!gen.metadata) return true;
      const metadata = gen.metadata as any;
      return !metadata.sessionId;
    });

    console.log(`📊 Remaining generations without session data: ${remainingWithoutSession.length}`);

  } catch (error) {
    console.error('❌ Error during session data backfill:', error);
    throw error;
  } finally {
    await db.$client.end();
  }
}

// Run the backfill
backfillSessionData().catch(console.error); 