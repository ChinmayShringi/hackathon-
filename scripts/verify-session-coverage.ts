#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../server/db';
import { generations, users } from '../shared/schema';

async function verifySessionCoverage() {
  console.log('🔍 Verifying session data coverage...');

  try {
    // Get all generations
    const allGenerations = await db
      .select({
        id: generations.id,
        userId: generations.userId,
        metadata: generations.metadata,
        createdAt: generations.createdAt
      })
      .from(generations);

    console.log(`📊 Total generations: ${allGenerations.length}`);

    // Categorize generations
    const withSessionData = allGenerations.filter(gen => {
      if (!gen.metadata) return false;
      const metadata = gen.metadata as any;
      return !!metadata.sessionId;
    });

    const withoutSessionData = allGenerations.filter(gen => {
      if (!gen.metadata) return true;
      const metadata = gen.metadata as any;
      return !metadata.sessionId;
    });

    console.log(`✅ With session data: ${withSessionData.length} (${((withSessionData.length / allGenerations.length) * 100).toFixed(1)}%)`);
    console.log(`⚠️  Without session data: ${withoutSessionData.length} (${((withoutSessionData.length / allGenerations.length) * 100).toFixed(1)}%)`);

    // Analyze users without session data
    const userStats = new Map<string, { total: number; withSession: number; withoutSession: number }>();
    
    for (const gen of allGenerations) {
      const hasSession = gen.metadata && (gen.metadata as any).sessionId;
      const stats = userStats.get(gen.userId) || { total: 0, withSession: 0, withoutSession: 0 };
      stats.total++;
      if (hasSession) {
        stats.withSession++;
      } else {
        stats.withoutSession++;
      }
      userStats.set(gen.userId, stats);
    }

    console.log('\n📋 User breakdown:');
    for (const [userId, stats] of userStats.entries()) {
      const sessionPercent = ((stats.withSession / stats.total) * 100).toFixed(1);
      console.log(`  ${userId}: ${stats.withSession}/${stats.total} (${sessionPercent}%)`);
    }

    // Check recent generations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentGenerations = allGenerations.filter(gen => 
      new Date(gen.createdAt!) > thirtyDaysAgo
    );

    const recentWithSession = recentGenerations.filter(gen => {
      if (!gen.metadata) return false;
      const metadata = gen.metadata as any;
      return !!metadata.sessionId;
    });

    console.log(`\n📅 Recent generations (last 30 days): ${recentGenerations.length}`);
    console.log(`✅ Recent with session data: ${recentWithSession.length} (${((recentWithSession.length / recentGenerations.length) * 100).toFixed(1)}%)`);

  } catch (error) {
    console.error('❌ Error during verification:', error);
    throw error;
  } finally {
    await db.$client.end();
  }
}

// Run the verification
verifySessionCoverage().catch(console.error); 