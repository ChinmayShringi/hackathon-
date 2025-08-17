#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../server/db';
import { generations } from '../shared/schema';
import { sql } from 'drizzle-orm';

async function listGuestUsersByGenerations() {
  console.log('🔍 Listing Guest Users by Generation Count\n');

  try {
    // Get all users with their generation counts, sorted by count descending
    const userCounts = await db
      .select({
        userId: generations.userId,
        generationCount: sql<number>`count(*)`,
        latestGeneration: sql<string>`max(${generations.createdAt})`,
        oldestGeneration: sql<string>`min(${generations.createdAt})`
      })
      .from(generations)
      .groupBy(generations.userId)
      .orderBy(sql`count(*) desc`);

    console.log('Guest users sorted by generation count:');
    console.log('┌─────────────────────┬─────────────────┬─────────────────────┬─────────────────────┐');
    console.log('│ userId              │ Generation Count│ Latest Generation   │ Oldest Generation   │');
    console.log('├─────────────────────┼─────────────────┼─────────────────────┼─────────────────────┤');

    for (const user of userCounts) {
      const latestDate = user.latestGeneration ? new Date(user.latestGeneration).toISOString().split('T')[0] : 'N/A';
      const oldestDate = user.oldestGeneration ? new Date(user.oldestGeneration).toISOString().split('T')[0] : 'N/A';
      
      console.log(`│ ${user.userId.padEnd(19)} │ ${user.generationCount.toString().padStart(15)} │ ${latestDate.padEnd(19)} │ ${oldestDate.padEnd(19)} │`);
    }
    
    console.log('└─────────────────────┴─────────────────┴─────────────────────┴─────────────────────┘');

    // Show total generations
    const totalGenerations = userCounts.reduce((sum, user) => sum + user.generationCount, 0);
    console.log(`\n📊 Total generations across all users: ${totalGenerations}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await db.$client.end();
  }
}

listGuestUsersByGenerations(); 