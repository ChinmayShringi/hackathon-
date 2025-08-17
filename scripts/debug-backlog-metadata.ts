import { config } from 'dotenv';
config();

import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, and } from 'drizzle-orm';
import { generations } from '../shared/schema';

const SYSTEM_BACKLOG_USER_ID = 'system_backlog';

async function debugBacklogMetadata() {
  console.log('🔍 Debugging backlog generation metadata...\n');

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle({ client: pool });

  try {
    // Check current backlog generations and their metadata
    console.log('📊 Current backlog generations:');
    const backlogGenerations = await db
      .select({
        id: generations.id,
        shortId: generations.shortId,
        recipeTitle: generations.recipeTitle,
        status: generations.status,
        falJobId: generations.falJobId,
        metadata: generations.metadata,
        createdAt: generations.createdAt
      })
      .from(generations)
      .where(eq(generations.userId, SYSTEM_BACKLOG_USER_ID))
      .orderBy(generations.createdAt);

    if (backlogGenerations.length === 0) {
      console.log('No backlog generations found.');
      return;
    }

    for (const gen of backlogGenerations) {
      console.log(`\n🎬 Generation ${gen.id} (${gen.shortId}):`);
      console.log(`   Recipe: ${gen.recipeTitle}`);
      console.log(`   Status: ${gen.status}`);
      console.log(`   FAL Job ID: ${gen.falJobId || 'None'}`);
      console.log(`   Created: ${gen.createdAt}`);
      
      if (gen.metadata) {
        console.log(`   Metadata:`);
        console.log(`     Endpoint: ${(gen.metadata as any)?.endpoint || 'MISSING'}`);
        console.log(`     Model: ${(gen.metadata as any)?.model || 'MISSING'}`);
        console.log(`     Job ID: ${(gen.metadata as any)?.jobId || 'MISSING'}`);
        console.log(`     Service ID: ${(gen.metadata as any)?.serviceId || 'MISSING'}`);
        console.log(`     Form Data: ${(gen.metadata as any)?.formData ? 'Present' : 'Missing'}`);
      } else {
        console.log(`   Metadata: NULL/undefined`);
      }
    }

    // Check if any generations are missing the endpoint
    const missingEndpoint = backlogGenerations.filter(gen => 
      !gen.metadata || !(gen.metadata as any)?.endpoint
    );

    if (missingEndpoint.length > 0) {
      console.log(`\n❌ Found ${missingEndpoint.length} generations missing endpoint metadata:`);
      missingEndpoint.forEach(gen => {
        console.log(`   - Generation ${gen.id} (${gen.shortId})`);
      });
    } else {
      console.log(`\n✅ All backlog generations have endpoint metadata`);
    }

  } catch (error) {
    console.error('Error debugging backlog metadata:', error);
  } finally {
    await pool.end();
  }
}

debugBacklogMetadata().catch(console.error); 