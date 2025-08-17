#!/usr/bin/env tsx

/**
 * Test Script: AssetImageComponent
 * 
 * This script tests the new AssetImageComponent to ensure it can:
 * 1. Connect to the database
 * 2. Retrieve asset information
 * 3. Process inputs and generate outputs correctly
 * 4. Handle errors gracefully
 * 
 * Usage: npx tsx scripts/test-asset-image-component.tsx [assetId]
 */

import { config } from 'dotenv';
import { AssetImageComponent } from '../shared/components/asset-image-component';

// Load environment variables
config();

async function testAssetImageComponent() {
  console.log('🧪 Testing AssetImageComponent...\n');
  
  // Create component instance
  const component = new AssetImageComponent();
  
  console.log('📋 Component Information:');
  console.log(`  ID: ${component.id}`);
  console.log(`  Name: ${component.name}`);
  console.log(`  Version: ${component.version}`);
  console.log(`  Category: ${component.category}`);
  console.log(`  Credit Cost: ${component.creditCost}`);
  console.log(`  Estimated Time: ${component.estimatedProcessingTime}ms\n`);
  
  console.log('📥 Input Channels:');
  component.inputChannels.forEach(channel => {
    console.log(`  - ${channel.id}: ${channel.description} (${channel.required ? 'required' : 'optional'})`);
  });
  
  console.log('\n📤 Output Channels:');
  component.outputChannels.forEach(channel => {
    console.log(`  - ${channel.id}: ${channel.description}`);
  });
  
  console.log('\n🔧 Testing Component Functionality...\n');
  
  try {
    // Test with a sample asset ID (you can pass a real one as command line arg)
    const testAssetId = process.argv[2] || 'test-asset-123';
    
    console.log(`🎯 Testing with asset ID: ${testAssetId}`);
    
    // Test ordered input processing
    console.log('\n📥 Testing ordered input processing...');
    const orderedOutputs = await component.process([testAssetId]);
    
    console.log('✅ Ordered processing completed');
    console.log(`📊 Output count: ${orderedOutputs.length}`);
    
    // Test named input processing
    console.log('\n📥 Testing named input processing...');
    const namedOutputs = await component.processNamed({ assetId: testAssetId });
    
    console.log('✅ Named processing completed');
    console.log(`📊 Output count: ${Object.keys(namedOutputs).length}`);
    
    // Display outputs
    console.log('\n📤 Output Results:');
    console.log('Ordered Outputs:');
    orderedOutputs.forEach((output, index) => {
      const channel = component.outputChannels[index];
      console.log(`  ${channel.id}: ${JSON.stringify(output, null, 2)}`);
    });
    
    console.log('\nNamed Outputs:');
    Object.entries(namedOutputs).forEach(([key, value]) => {
      console.log(`  ${key}: ${JSON.stringify(value, null, 2)}`);
    });
    
  } catch (error) {
    console.error('❌ Component test failed:', error);
    
    if (error instanceof Error && error.message.includes('Asset not found')) {
      console.log('\n💡 This is expected for test asset IDs. Try with a real asset ID:');
      console.log('   npx tsx scripts/test-asset-image-component.tsx <real-asset-id>');
    }
  }
  
  console.log('\n🏁 Component test completed');
}

// Run the test
if (import.meta.url === `file://${process.argv[1]}`) {
  testAssetImageComponent().catch(console.error);
}
