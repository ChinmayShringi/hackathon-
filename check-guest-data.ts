import { db } from './server/db';
import { generations } from './shared/schema';
import { eq } from 'drizzle-orm';

async function checkGuestData() {
  try {
    console.log('🔍 Checking for guest generations...');
    
    const allGuest = await db.select().from(generations).where(eq(generations.userId, 'guest_user'));
    
    console.log(`📊 Total guest generations: ${allGuest.length}`);
    
    if (allGuest.length > 0) {
      console.log('\n📋 Sample generations:');
      allGuest.slice(0, 5).forEach((gen, i) => {
        console.log(`  ${i + 1}. ID: ${gen.id}, Status: ${gen.status}, Title: ${gen.recipeTitle}, Created: ${gen.createdAt}`);
      });
      
      if (allGuest.length > 5) {
        console.log(`  ... and ${allGuest.length - 5} more`);
      }
    } else {
      console.log('❌ No guest generations found in database');
    }
    
    // Check if there are any generations at all
    const allGenerations = await db.select().from(generations);
    console.log(`\n📊 Total generations in database: ${allGenerations.length}`);
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  }
}

checkGuestData(); 