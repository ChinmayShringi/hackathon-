#!/usr/bin/env tsx

import 'dotenv/config';
import { tagIconService } from '../server/tag-icon-service';

async function debugTagIconService() {
  console.log('🔍 Debugging Tag Icon Service\n');

  try {
    // Test single lookup
    console.log('1. Testing single Venue lookup:');
    const venueIcon = await tagIconService.getIconData('Venue');
    console.log('Venue icon data:', venueIcon);

    // Test batch lookup
    console.log('\n2. Testing batch lookup with Venue:');
    const batchIcons = await tagIconService.getIconDataBatch(['Venue', 'Age', 'Gender']);
    console.log('Batch icon data:');
    for (const [label, data] of batchIcons.entries()) {
      console.log(`  ${label}:`, data);
    }

    // Test cache initialization
    console.log('\n3. Testing cache initialization:');
    await tagIconService.initializeCache();
    console.log('Cache initialized successfully');

    // Test cache lookup
    console.log('\n4. Testing cache lookup:');
    const cachedVenueIcon = await tagIconService.getIconData('Venue');
    console.log('Cached Venue icon data:', cachedVenueIcon);

  } catch (error) {
    console.error('Error:', error);
  }
}

debugTagIconService(); 