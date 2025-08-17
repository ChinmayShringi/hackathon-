import { describe, it } from 'node:test';
import assert from 'node:assert';
import { handler } from './index.js';
import type { VideoToGIFRequest } from './types.js';

describe('VideoToGIF_Square Lambda', () => {
  describe('Input Validation', () => {
    it('should reject missing remote_url', async () => {
      const event: Partial<VideoToGIFRequest> = {
        bucket: 'test-bucket',
        key: 'test-key'
      };

      const result = await handler(event as VideoToGIFRequest);
      
      assert.strictEqual(result.statusCode, 400);
      assert.strictEqual(result.body, 'Missing required fields.');
    });

    it('should reject missing bucket', async () => {
      const event: Partial<VideoToGIFRequest> = {
        remote_url: 'https://example.com/video.mp4',
        key: 'test-key'
      };

      const result = await handler(event as VideoToGIFRequest);
      
      assert.strictEqual(result.statusCode, 400);
      assert.strictEqual(result.body, 'Missing required fields.');
    });

    it('should reject missing key', async () => {
      const event: Partial<VideoToGIFRequest> = {
        remote_url: 'https://example.com/video.mp4',
        bucket: 'test-bucket'
      };

      const result = await handler(event as VideoToGIFRequest);
      
      assert.strictEqual(result.statusCode, 400);
      assert.strictEqual(result.body, 'Missing required fields.');
    });

    it('should reject invalid video URL format', async () => {
      const event: VideoToGIFRequest = {
        remote_url: 'https://example.com/document.pdf',
        bucket: 'test-bucket',
        key: 'test-key'
      };

      const result = await handler(event);
      
      assert.strictEqual(result.statusCode, 400);
      assert(result.body.includes('Invalid video URL'));
    });

    it('should reject dimension too small', async () => {
      const event: VideoToGIFRequest = {
        remote_url: 'https://example.com/video.mp4',
        bucket: 'test-bucket',
        key: 'test-key',
        dimension: 8
      };

      const result = await handler(event);
      
      assert.strictEqual(result.statusCode, 400);
      assert(result.body.includes('Invalid dimension'));
    });

    it('should reject dimension too large', async () => {
      const event: VideoToGIFRequest = {
        remote_url: 'https://example.com/video.mp4',
        bucket: 'test-bucket',
        key: 'test-key',
        dimension: 1024
      };

      const result = await handler(event);
      
      assert.strictEqual(result.statusCode, 400);
      assert(result.body.includes('Invalid dimension'));
    });

    it('should accept valid MP4 URL with default dimension', async () => {
      const event: VideoToGIFRequest = {
        remote_url: 'https://example.com/video.mp4',
        bucket: 'test-bucket',
        key: 'test-key'
      };

      // This will fail due to network error, but we can verify it doesn't fail validation
      const result = await handler(event);
      
      // Should fail with network error, not validation error
      assert.strictEqual(result.statusCode, 500);
      assert(result.body.includes('Video conversion failed'));
    });

    it('should accept valid WebM URL with custom dimension', async () => {
      const event: VideoToGIFRequest = {
        remote_url: 'https://example.com/video.webm',
        bucket: 'test-bucket',
        key: 'test-key',
        dimension: 256
      };

      // This will fail due to network error, but we can verify it doesn't fail validation
      const result = await handler(event);
      
      // Should fail with network error, not validation error
      assert.strictEqual(result.statusCode, 500);
      assert(result.body.includes('Video conversion failed'));
    });

    it('should accept valid MOV URL with custom dimension', async () => {
      const event: VideoToGIFRequest = {
        remote_url: 'https://example.com/video.mov',
        bucket: 'test-bucket',
        key: 'test-key',
        dimension: 64
      };

      // This will fail due to network error, but we can verify it doesn't fail validation
      const result = await handler(event);
      
      // Should fail with network error, not validation error
      assert.strictEqual(result.statusCode, 500);
      assert(result.body.includes('Video conversion failed'));
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const event: VideoToGIFRequest = {
        remote_url: 'https://invalid-domain-that-does-not-exist-12345.com/video.mp4',
        bucket: 'test-bucket',
        key: 'test-key'
      };

      const result = await handler(event);
      
      assert.strictEqual(result.statusCode, 500);
      assert(result.body.includes('Video conversion failed'));
    });

    it('should handle invalid video format errors', async () => {
      const event: VideoToGIFRequest = {
        remote_url: 'https://httpbin.org/status/404', // Returns 404
        bucket: 'test-bucket',
        key: 'test-key'
      };

      const result = await handler(event);
      
      assert.strictEqual(result.statusCode, 500);
      assert(result.body.includes('Video conversion failed'));
    });
  });
}); 