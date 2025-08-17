import { describe, it } from 'node:test';
import assert from 'node:assert';
import { handler } from './index.js';
import type { ExternalFileTransferRequest } from './types.js';

describe('ExternalFileTransferToS3 Lambda', () => {
  describe('Input Validation', () => {
    it('should reject missing remote_url', async () => {
      const event: Partial<ExternalFileTransferRequest> = {
        bucket: 'test-bucket',
        key: 'test-key'
      };

      const result = await handler(event as ExternalFileTransferRequest);
      
      assert.strictEqual(result.statusCode, 400);
      assert.strictEqual(result.body, 'Missing required fields.');
    });

    it('should reject missing bucket', async () => {
      const event: Partial<ExternalFileTransferRequest> = {
        remote_url: 'https://example.com/file.jpg',
        key: 'test-key'
      };

      const result = await handler(event as ExternalFileTransferRequest);
      
      assert.strictEqual(result.statusCode, 400);
      assert.strictEqual(result.body, 'Missing required fields.');
    });

    it('should reject missing key', async () => {
      const event: Partial<ExternalFileTransferRequest> = {
        remote_url: 'https://example.com/file.jpg',
        bucket: 'test-bucket'
      };

      const result = await handler(event as ExternalFileTransferRequest);
      
      assert.strictEqual(result.statusCode, 400);
      assert.strictEqual(result.body, 'Missing required fields.');
    });

    it('should accept valid input with all required fields', async () => {
      const event: ExternalFileTransferRequest = {
        remote_url: 'https://example.com/file.jpg',
        bucket: 'test-bucket',
        key: 'test-key'
      };

      // This will fail due to network error, but we can verify it doesn't fail validation
      const result = await handler(event);
      
      // Should fail with network error, not validation error
      assert.strictEqual(result.statusCode, 500);
      assert(result.body.includes('Upload error:'));
    });

    it('should accept valid input with optional mime_type', async () => {
      const event: ExternalFileTransferRequest = {
        remote_url: 'https://example.com/file.jpg',
        bucket: 'test-bucket',
        key: 'test-key',
        mime_type: 'image/jpeg'
      };

      // This will fail due to network error, but we can verify it doesn't fail validation
      const result = await handler(event);
      
      // Should fail with network error, not validation error
      assert.strictEqual(result.statusCode, 500);
      assert(result.body.includes('Upload error:'));
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const event: ExternalFileTransferRequest = {
        remote_url: 'https://invalid-domain-that-does-not-exist-12345.com/test',
        bucket: 'test-bucket',
        key: 'test-key'
      };

      const result = await handler(event);
      
      assert.strictEqual(result.statusCode, 500);
      assert(result.body.includes('Upload error:'));
    });
  });
}); 