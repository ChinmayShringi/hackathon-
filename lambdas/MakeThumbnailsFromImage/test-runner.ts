#!/usr/bin/env node

import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables from root .env file
config({ path: join(process.cwd(), '../../.env') });

// Mock event for testing
const testEvent = {
  remote_url: 'https://picsum.photos/800/600', // Test image
  bucket: 'delula-media-prod',
  key: 'library/user/test/images/thumbnails',
  prefix_name: 'test_image',
  sizes: [32, 48, 72, 64, 96, 128, 160, 256, 320, 512]
};

async function testLambda() {
  console.log('🧪 Testing MakeThumbnailsFromImage Lambda locally...\n');
  
  try {
    // Import the handler
    const { handler } = await import('./dist/index.js');
    
    console.log('📥 Test Event:', JSON.stringify(testEvent, null, 2));
    console.log('\n🚀 Invoking handler...\n');
    
    // Call the handler
    const result = await handler(testEvent);
    
    console.log('\n📤 Handler Result:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('\n✅ Test completed successfully!');
      console.log(`📊 Generated ${result.processing.totalThumbnails} thumbnails`);
      console.log(`⏱️  Processing time: ${result.processing.time}`);
      
      // Show thumbnail details
      console.log('\n🖼️  Generated Thumbnails:');
      Object.entries(result.thumbnails).forEach(([size, thumb]) => {
        console.log(`  ${size}px: ${thumb.width}x${thumb.height} → ${thumb.s3Key}`);
      });
    } else {
      console.log('\n❌ Test failed:', result.error);
    }
    
  } catch (error) {
    console.error('\n💥 Test runner error:', error);
  }
}

if (require.main === module) {
  testLambda().catch(console.error);
}
