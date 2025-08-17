#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../server/db';
import { generations } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function debugSpecificGeneration() {
  const shortId = 'eFiCy59_MVb';
  
  console.log(`🔍 Debugging generation with short ID: ${shortId}`);

  try {
    // Find the generation
    const generation = await db
      .select()
      .from(generations)
      .where(eq(generations.shortId, shortId))
      .limit(1);

    if (generation.length === 0) {
      console.log('❌ Generation not found');
      return;
    }

    const gen = generation[0];
    console.log('\n📋 Generation details:');
    console.log(`  ID: ${gen.id}`);
    console.log(`  Short ID: ${gen.shortId}`);
    console.log(`  User ID: ${gen.userId}`);
    console.log(`  Status: ${gen.status}`);
    console.log(`  Created: ${gen.createdAt}`);
    console.log(`  Metadata:`, gen.metadata);

    // Check if it's a guest generation
    if (gen.userId === 'guest_user') {
      console.log('\n👤 This is a guest generation');
      
      const metadata = gen.metadata as any;
      if (metadata && metadata.sessionId) {
        console.log(`  Session ID in metadata: ${metadata.sessionId}`);
        console.log(`  Current guest session: 9gmd7PSAXfxv (from logs)`);
        console.log(`  Sessions match: ${metadata.sessionId === '9gmd7PSAXfxv'}`);
        
        if (metadata.sessionId !== '9gmd7PSAXfxv') {
          console.log('❌ This is why you get 403 - session mismatch!');
        } else {
          console.log('✅ Sessions match - should work');
        }
      } else {
        console.log('  No session ID in metadata - should be allowed (legacy generation)');
      }
    } else {
      console.log('\n👤 This is not a guest generation');
      console.log(`  User ID: ${gen.userId}`);
    }

  } catch (error) {
    console.error('❌ Error debugging generation:', error);
  } finally {
    await db.$client.end();
  }
}

// Run the debug
debugSpecificGeneration().catch(console.error); 