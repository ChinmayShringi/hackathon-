import './_setup-env.ts';
import { db } from '../server/db.ts';
import { generations } from '../shared/schema.ts';
import { inArray } from 'drizzle-orm';

async function checkQueueStatus() {
  console.log('🔍 Checking jobs with status "In Queue" or "processing"...\n');

  try {
    const jobs = await db.select({
      id: generations.id,
      status: generations.status,
      createdAt: generations.createdAt,
      recipeTitle: generations.recipeTitle,
      prompt: generations.prompt
    })
    .from(generations)
    .where(
      inArray(generations.status, ['In Queue', 'processing'])
    )
    .orderBy(generations.createdAt)
    .limit(5);

    if (jobs.length === 0) {
      console.log('✅ No jobs with status "In Queue" or "processing" found.');
    } else {
      jobs.forEach(job => {
        console.log(`Job ${job.id}: ${job.status} | Created: ${job.createdAt?.toISOString() || 'Unknown'}`);
        console.log(`  Title: ${job.recipeTitle || 'N/A'}`);
        console.log(`  Prompt: ${job.prompt?.slice(0, 80) || 'N/A'}`);
      });
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await db.$client.end();
  }
}

checkQueueStatus(); 