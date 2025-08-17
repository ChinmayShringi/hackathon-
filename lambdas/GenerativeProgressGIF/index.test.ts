import { describe, it } from 'node:test';
import assert from 'node:assert';
import { handler } from './index.js';
import type { GenerativeProgressGIFRequest } from './types.js';

describe('GenerativeProgressGIF Lambda', () => {
  describe('Input Validation', () => {
    it('should reject missing remote_url', async () => {
      const event: Partial<GenerativeProgressGIFRequest> = {
        bucket: 'test-bucket',
        key: 'test-key'
      };

      const result = await handler(event as GenerativeProgressGIFRequest);
      
      assert.strictEqual(result.statusCode, 400);
      assert.strictEqual(result.body, 'Missing required fields.');
    });

    it('should reject missing bucket', async () => {
      const event: Partial<GenerativeProgressGIFRequest> = {
        remote_url: 'https://example.com/animation.gif',
        key: 'test-key'
      };

      const result = await handler(event as GenerativeProgressGIFRequest);
      
      assert.strictEqual(result.statusCode, 400);
      assert.strictEqual(result.body, 'Missing required fields.');
    });

    it('should reject missing key', async () => {
      const event: Partial<GenerativeProgressGIFRequest> = {
        remote_url: 'https://example.com/animation.gif',
        bucket: 'test-bucket'
      };

      const result = await handler(event as GenerativeProgressGIFRequest);
      
      assert.strictEqual(result.statusCode, 400);
      assert.strictEqual(result.body, 'Missing required fields.');
    });

    it('should reject reveal_duration_ms too small', async () => {
      const event: GenerativeProgressGIFRequest = {
        remote_url: 'https://example.com/animation.gif',
        bucket: 'test-bucket',
        key: 'test-key',
        reveal_duration_ms: 500
      };

      const result = await handler(event);
      
      assert.strictEqual(result.statusCode, 400);
      assert(result.body.includes('Invalid reveal_duration_ms'));
    });

    it('should reject reveal_duration_ms too large', async () => {
      const event: GenerativeProgressGIFRequest = {
        remote_url: 'https://example.com/animation.gif',
        bucket: 'test-bucket',
        key: 'test-key',
        reveal_duration_ms: 40000
      };

      const result = await handler(event);
      
      assert.strictEqual(result.statusCode, 400);
      assert(result.body.includes('Invalid reveal_duration_ms'));
    });

    it('should reject color_count too small', async () => {
      const event: GenerativeProgressGIFRequest = {
        remote_url: 'https://example.com/animation.gif',
        bucket: 'test-bucket',
        key: 'test-key',
        color_count: 4
      };

      const result = await handler(event);
      
      assert.strictEqual(result.statusCode, 400);
      assert(result.body.includes('Invalid color_count'));
    });

    it('should reject color_count too large', async () => {
      const event: GenerativeProgressGIFRequest = {
        remote_url: 'https://example.com/animation.gif',
        bucket: 'test-bucket',
        key: 'test-key',
        color_count: 64
      };

      const result = await handler(event);
      
      assert.strictEqual(result.statusCode, 400);
      assert(result.body.includes('Invalid color_count'));
    });

    it('should accept valid parameters with defaults', async () => {
      const event: GenerativeProgressGIFRequest = {
        remote_url: 'https://example.com/animation.gif',
        bucket: 'test-bucket',
        key: 'test-key'
      };

      // This will fail due to network error, but we can verify it doesn't fail validation
      const result = await handler(event);
      
      // Should fail with network error, not validation error
      assert.strictEqual(result.statusCode, 500);
      assert(result.body.includes('Generative progress GIF creation failed'));
    });

    it('should accept valid parameters with custom values', async () => {
      const event: GenerativeProgressGIFRequest = {
        remote_url: 'https://example.com/animation.gif',
        bucket: 'test-bucket',
        key: 'test-key',
        reveal_duration_ms: 15000,
        color_count: 24
      };

      // This will fail due to network error, but we can verify it doesn't fail validation
      const result = await handler(event);
      
      // Should fail with network error, not validation error
      assert.strictEqual(result.statusCode, 500);
      assert(result.body.includes('Generative progress GIF creation failed'));
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const event: GenerativeProgressGIFRequest = {
        remote_url: 'https://invalid-domain-that-does-not-exist-12345.com/animation.gif',
        bucket: 'test-bucket',
        key: 'test-key'
      };

      const result = await handler(event);
      
      assert.strictEqual(result.statusCode, 500);
      assert(result.body.includes('Generative progress GIF creation failed'));
    });

    it('should handle invalid GIF format errors', async () => {
      const event: GenerativeProgressGIFRequest = {
        remote_url: 'https://httpbin.org/status/404', // Returns 404
        bucket: 'test-bucket',
        key: 'test-key'
      };

      const result = await handler(event);
      
      assert.strictEqual(result.statusCode, 500);
      assert(result.body.includes('Generative progress GIF creation failed'));
    });
  });
}); 