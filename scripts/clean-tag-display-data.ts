import 'dotenv/config';
import { db } from '../server/db';
import { generations } from '../shared/schema';
import { eq, desc } from 'drizzle-orm';

async function cleanTagDisplayData() {
  console.log('🧹 Cleaning tagDisplayData in latest generation...\n');

  try {
    // Get the latest generation
    const latestGeneration = await db
      .select()
      .from(generations)
      .where(eq(generations.userId, 'guest_user'))
      .orderBy(desc(generations.id))
      .limit(1);

    if (latestGeneration.length === 0) {
      console.log('❌ No guest generations found');
      return;
    }

    const generation = latestGeneration[0];
    console.log(`📋 Found latest generation ID: ${generation.id}`);

    const metadata = generation.metadata as any;
    if (!metadata?.tagDisplayData) {
      console.log('❌ No tagDisplayData found in generation metadata');
      return;
    }

    console.log('\n🔍 Current tagDisplayData:');
    console.log(JSON.stringify(metadata.tagDisplayData, null, 2));

    // Clean the tagDisplayData by removing icon and color fields
    const cleanedTagDisplayData: Record<string, { value: string }> = {};
    
    Object.entries(metadata.tagDisplayData).forEach(([tagLabel, tagData]) => {
      const data = tagData as any;
      cleanedTagDisplayData[tagLabel] = {
        value: data.value
        // Remove icon and color fields - they will be computed dynamically
      };
    });

    console.log('\n🧹 Cleaned tagDisplayData:');
    console.log(JSON.stringify(cleanedTagDisplayData, null, 2));

    // Update the generation with cleaned tagDisplayData
    const updatedMetadata = {
      ...metadata,
      tagDisplayData: cleanedTagDisplayData
    };

    await db
      .update(generations)
      .set({
        metadata: updatedMetadata
      })
      .where(eq(generations.id, generation.id));

    console.log('\n✅ Successfully updated generation metadata');
    console.log(`📊 Removed icons from ${Object.keys(cleanedTagDisplayData).length} tags`);

    // Verify the update
    const updatedGeneration = await db
      .select()
      .from(generations)
      .where(eq(generations.id, generation.id))
      .limit(1);

    if (updatedGeneration.length > 0) {
      const updatedMetadata = updatedGeneration[0].metadata as any;
      console.log('\n🔍 Verification - Updated tagDisplayData:');
      console.log(JSON.stringify(updatedMetadata?.tagDisplayData, null, 2));
    }

    console.log('\n✅ TagDisplayData cleanup completed successfully!');

  } catch (error) {
    console.error('❌ Error cleaning tagDisplayData:', error);
  }
}

cleanTagDisplayData(); 