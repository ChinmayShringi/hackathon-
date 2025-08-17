import { describe, it } from 'node:test';
import assert from 'node:assert';
import { handler } from './index.js';
import type { ExternalFileTransferRequest } from './types.js';

describe('ExternalFileTransferToS3 Integration Tests', () => {
  describe('Real HTTP URL Tests', () => {
    it('should handle a real HTTP URL (httpbin.org)', async () => {
      const event: ExternalFileTransferRequest = {
        remote_url: 'https://httpbin.org/image/jpeg',
        bucket: 'test-bucket',
        key: 'test-images/httpbin-test.jpg',
        mime_type: 'image/jpeg'
      };

      // This will fail due to S3 permissions, but we can verify the HTTP part works
      const result = await handler(event);
      
      // Should fail with S3 error, not HTTP error
      assert.strictEqual(result.statusCode, 500);
      assert(result.body.includes('Upload error:'));
      
      // The error should be related to S3, not HTTP
      assert(!result.body.includes('Bad status:'));
      assert(!result.body.includes('Network error'));
    });

    it('should handle a real HTTP URL without explicit mime_type', async () => {
      const event: ExternalFileTransferRequest = {
        remote_url: 'https://httpbin.org/image/png',
        bucket: 'test-bucket',
        key: 'test-images/httpbin-test.png'
      };

      // This will fail due to S3 permissions, but we can verify the HTTP part works
      const result = await handler(event);
      
      // Should fail with S3 error, not HTTP error
      assert.strictEqual(result.statusCode, 500);
      assert(result.body.includes('Upload error:'));
      
      // The error should be related to S3, not HTTP
      assert(!result.body.includes('Bad status:'));
      assert(!result.body.includes('Network error'));
    });

    it('should handle a real HTTP URL with JSON response', async () => {
      const event: ExternalFileTransferRequest = {
        remote_url: 'https://httpbin.org/json',
        bucket: 'test-bucket',
        key: 'test-data/sample.json',
        mime_type: 'application/json'
      };

      // This will fail due to S3 permissions, but we can verify the HTTP part works
      const result = await handler(event);
      
      // Should fail with S3 error, not HTTP error
      assert.strictEqual(result.statusCode, 500);
      assert(result.body.includes('Upload error:'));
      
      // The error should be related to S3, not HTTP
      assert(!result.body.includes('Bad status:'));
      assert(!result.body.includes('Network error'));
    });
  });

  describe('Error Handling Tests', () => {
    it('should handle 404 responses gracefully', async () => {
      const event: ExternalFileTransferRequest = {
        remote_url: 'https://httpbin.org/status/404',
        bucket: 'test-bucket',
        key: 'test-images/not-found.jpg'
      };

      const result = await handler(event);
      
      // Should fail with HTTP error
      assert.strictEqual(result.statusCode, 500);
      assert(result.body.includes('Upload error:'));
      assert(result.body.includes('Bad status: 404'));
    });

    it('should handle 500 responses gracefully', async () => {
      const event: ExternalFileTransferRequest = {
        remote_url: 'https://httpbin.org/status/500',
        bucket: 'test-bucket',
        key: 'test-images/server-error.jpg'
      };

      const result = await handler(event);
      
      // Should fail with HTTP error
      assert.strictEqual(result.statusCode, 500);
      assert(result.body.includes('Upload error:'));
      assert(result.body.includes('Bad status: 500'));
    });
  });
}); 