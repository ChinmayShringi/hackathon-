#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../server/db';
import { recipeOptionTagIcons } from '../shared/schema';

const tagIconMappings = [
  { id: 'ASMR Sound Style', display: 'ASMR Sound Style', icon: 'waveform', color: null },
  { id: 'Age', display: 'Age', icon: 'baby', color: null },
  { id: 'Attitude', display: 'Attitude', icon: 'smile', color: null },
  { id: 'Cat Breed', display: 'Cat Breed', icon: 'cat', color: null },
  { id: 'Diving Style', display: 'Diving Style', icon: 'activity', color: null },
  { id: 'Eating Expression', display: 'Eating Expression', icon: 'utensils', color: null },
  { id: 'Epic Setting', display: 'Epic Setting', icon: 'mountains', color: null },
  { id: 'Fashion Style', display: 'Fashion Style', icon: 'shirt', color: null },
  { id: 'Food Type', display: 'Food Type', icon: 'pizza', color: null },
  { id: 'Gender', display: 'Gender', icon: 'venus', color: null }, // Lucide icon for gender
  { id: 'Lava Food Item', display: 'Lava Food Item', icon: 'flame', color: null }, // Lucide icon for lava/food
  { id: 'Prop in Hand', display: 'Prop in Hand', icon: 'hand', color: null },
  { id: 'Sound Style', display: 'Sound Style', icon: 'music', color: null }, // Lucide icon for sound/music
  { id: 'Venue', display: 'Venue', icon: 'building', color: null }, // Lucide icon for venue/building
  { id: 'Vlogging Topic', display: 'Vlogging Topic', icon: 'video', color: null },
  { id: 'Water Entry Style', display: 'Water Entry Style', icon: 'droplets', color: null },
  { id: 'Weight', display: 'Weight', icon: 'scale', color: null }
];

async function seedRecipeOptionTagIcons() {
  console.log('🌱 Seeding recipe option tag icons...');

  try {
    console.log('✅ Using Drizzle ORM to insert icon mappings...');

    // Insert or update icon mappings using Drizzle
    for (const mapping of tagIconMappings) {
      await db
        .insert(recipeOptionTagIcons)
        .values({
          id: mapping.id,
          display: mapping.display,
          icon: mapping.icon,
          color: mapping.color
        })
        .onConflictDoUpdate({
          target: recipeOptionTagIcons.id,
          set: {
            display: mapping.display,
            icon: mapping.icon,
            color: mapping.color,
            updatedAt: new Date()
          }
        });
      console.log(`Upserted: ${mapping.id} -> ${mapping.icon}`);
    }

    console.log(`✅ Successfully seeded ${tagIconMappings.length} icon mappings`);
  } catch (error) {
    console.error('❌ Error seeding recipe option tag icons:', error);
  } finally {
    await db.$client.end();
  }
}

seedRecipeOptionTagIcons().catch(console.error); 