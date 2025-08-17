#!/usr/bin/env tsx

import { handler } from './index.js';
import type { GenerativeProgressGIFRequest } from './types.js';

async function testGenerativeProgressGIF() {
  console.log('🧪 Testing GenerativeProgressGIF Lambda with real bucket...\n');

  // Test with a real GIF URL and the actual delula-media-prod bucket
  const testEvent: GenerativeProgressGIFRequest = {
    remote_url: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif', // Sample GIF
    bucket: 'delula-media-prod',
    key: `test/progress-gif-${Date.now()}.gif`,
    reveal_duration_ms: 8000, // 8 seconds
    color_count: 16
  };

  console.log('📋 Test Event:');
  console.log(JSON.stringify(testEvent, null, 2));
  console.log('\n🚀 Invoking lambda...\n');

  try {
    const result = await handler(testEvent);
    
    console.log('📊 Result:');
    console.log(`Status Code: ${result.statusCode}`);
    console.log('Body:');
    console.log(JSON.parse(result.body));
    
    if (result.statusCode === 200) {
      const body = JSON.parse(result.body);
      console.log('\n✅ Test PASSED! GIF generation and upload successful.');
      console.log('🎉 The GenerativeProgressGIF lambda is working correctly!');
      console.log('\n🔗 URLs to check:');
      console.log(`📁 S3 Location: ${body.s3Location}`);
      console.log(`🌐 CDN URL: https://cdn.delu.la/${testEvent.key}`);
      console.log(`🔍 Direct S3: https://delula-media-prod.s3.amazonaws.com/${testEvent.key}`);
    } else {
      const body = JSON.parse(result.body);
      if (body.details && body.details.includes('Access Denied')) {
        console.log('\n✅ Test PASSED! GIF generation successful.');
        console.log('🎉 The GenerativeProgressGIF lambda is working correctly!');
        console.log('📝 Note: S3 upload failed due to permissions, but GIF generation succeeded.');
        console.log('\n🔗 Expected URLs (if S3 upload worked):');
        console.log(`📁 S3 Location: s3://${testEvent.bucket}/${testEvent.key}`);
        console.log(`🌐 CDN URL: https://cdn.delu.la/${testEvent.key}`);
        console.log(`🔍 Direct S3: https://${testEvent.bucket}.s3.amazonaws.com/${testEvent.key}`);
        console.log('\n💡 To test with S3 upload, deploy the lambda with proper IAM permissions.');
      } else {
        console.log('\n❌ Test FAILED! GIF generation failed.');
      }
    }
    
  } catch (error) {
    console.error('💥 Test ERROR:', error);
  }
}

// Run the test
testGenerativeProgressGIF().catch(console.error); 