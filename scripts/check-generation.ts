#!/usr/bin/env tsx

import './_setup-env';
import { db } from '../server/db';
import { generations } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function checkGeneration(generationId: number) {
  console.log(`🔍 Checking generation ${generationId}...`);
  
  try {
    // Get the generation from database
    const [generation] = await db
      .select()
      .from(generations)
      .where(eq(generations.id, generationId))
      .limit(1);

    if (!generation) {
      console.error(`❌ Generation ${generationId} not found in database`);
      return;
    }

    console.log('📝 Generation details:');
    console.log(JSON.stringify(generation, null, 2));

    // Check all generations for this user
    const allGenerations = await db
      .select()
      .from(generations)
      .where(eq(generations.userId, generation.userId))
      .orderBy(generations.createdAt);

    console.log(`\n📊 Total generations for user ${generation.userId}: ${allGenerations.length}`);
    console.log('Recent generations:');
    allGenerations.slice(-5).forEach(g => {
      console.log(`  ID: ${g.id}, Status: ${g.status}, Type: ${g.type}, Created: ${g.createdAt}`);
    });

  } catch (error) {
    console.error('❌ Error checking generation:', error);
  }
}

// Check the last few generations
const generationId = process.argv[2] ? parseInt(process.argv[2]) : 91;
checkGeneration(generationId); 