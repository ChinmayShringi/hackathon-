#!/usr/bin/env tsx

import '../scripts/_setup-env';
import { db } from '../server/db';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';
import { USER_TYPES } from '../shared/user-types';
import { ACCESS_ROLES } from '../shared/access-roles';

async function createSharedGuestUser() {
  const sharedGuestId = process.env.DEV_BOUND_GUEST_ID || 'shared_guest_user';
  
  console.log(`Creating shared guest user with ID: ${sharedGuestId}`);
  
  try {
    // Check if shared guest user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, sharedGuestId)
    });
    
    if (existingUser) {
      console.log(`Shared guest user already exists with ${existingUser.credits} credits`);
      
      // Update credits to 1000 if needed
      if (existingUser.credits !== 1000) {
        await db
          .update(users)
          .set({ credits: 1000 })
          .where(eq(users.id, sharedGuestId));
        console.log('Updated credits to 1000');
      }
      
      return;
    }
    
    // Create new shared guest user
    const newUser = await db.insert(users).values({
      id: sharedGuestId,
      accountType: USER_TYPES.GUEST,
      accessRole: ACCESS_ROLES.USER,
      sessionToken: null, // Will be set when first used
      isEphemeral: false, // Not ephemeral since it's shared
      canUpgradeToRegistered: true,
      credits: 1000,
      createdAt: new Date(),
      lastSeenAt: new Date()
    }).returning();
    
    console.log(`Created shared guest user with 1000 credits`);
    console.log('User details:', newUser[0]);
    
  } catch (error) {
    console.error('Error creating shared guest user:', error);
    throw error;
  }
}

// Run the script
createSharedGuestUser()
  .then(() => {
    console.log('Shared guest user creation completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to create shared guest user:', error);
    process.exit(1);
  }); 