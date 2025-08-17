#!/usr/bin/env node

import { handler } from './index.js';
import type { ExternalFileTransferRequest } from './types.js';

// Test cases for local testing
const testCases: Array<{
  name: string;
  event: ExternalFileTransferRequest;
  expectedStatus?: number;
}> = [
  {
    name: 'Missing remote_url',
    event: {
      bucket: 'test-bucket',
      key: 'test-key'
    } as ExternalFileTransferRequest,
    expectedStatus: 400
  },
  {
    name: 'Missing bucket',
    event: {
      remote_url: 'https://example.com/file.jpg',
      key: 'test-key'
    } as ExternalFileTransferRequest,
    expectedStatus: 400
  },
  {
    name: 'Missing key',
    event: {
      remote_url: 'https://example.com/file.jpg',
      bucket: 'test-bucket'
    } as ExternalFileTransferRequest,
    expectedStatus: 400
  },
  {
    name: 'Valid input (will fail due to network)',
    event: {
      remote_url: 'https://example.com/file.jpg',
      bucket: 'test-bucket',
      key: 'test-key'
    },
    expectedStatus: 500
  },
  {
    name: 'Valid input with mime_type (will fail due to network)',
    event: {
      remote_url: 'https://example.com/file.jpg',
      bucket: 'test-bucket',
      key: 'test-key',
      mime_type: 'image/jpeg'
    },
    expectedStatus: 500
  }
];

async function runTests() {
  console.log('🧪 Running ExternalFileTransferToS3 Lambda Tests\n');

  for (const testCase of testCases) {
    console.log(`📋 Test: ${testCase.name}`);
    
    try {
      const result = await handler(testCase.event);
      
      if (testCase.expectedStatus) {
        if (result.statusCode === testCase.expectedStatus) {
          console.log(`✅ PASS - Status: ${result.statusCode}, Body: ${result.body}`);
        } else {
          console.log(`❌ FAIL - Expected: ${testCase.expectedStatus}, Got: ${result.statusCode}`);
          console.log(`   Body: ${result.body}`);
        }
      } else {
        console.log(`ℹ️  Result - Status: ${result.statusCode}, Body: ${result.body}`);
      }
    } catch (error) {
      console.log(`💥 ERROR - ${error instanceof Error ? error.message : String(error)}`);
    }
    
    console.log('');
  }

  console.log('🏁 Test run completed');
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { runTests }; 