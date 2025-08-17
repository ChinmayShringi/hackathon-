import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { getHeadMetadata, getStreamFromUrl, streamToBufferParts } from './stream-utils.js';
import { Readable } from 'stream';

describe('Stream Utils', () => {
  beforeEach(() => {
    // Setup test environment
  });

  afterEach(() => {
    // Cleanup if needed
  });

  describe('getHeadMetadata', () => {
    it('should handle network errors gracefully', async () => {
      // Test with an invalid URL to trigger network error
      const result = await getHeadMetadata('https://invalid-domain-that-does-not-exist-12345.com/test');

      assert.strictEqual(result.contentLength, null);
      assert.strictEqual(result.contentType, null);
    });
  });

  describe('getStreamFromUrl', () => {
    it('should reject for network errors', async () => {
      // Test with an invalid URL to trigger network error
      await assert.rejects(
        getStreamFromUrl('https://invalid-domain-that-does-not-exist-12345.com/test'),
        /Network error|ENOTFOUND|ECONNREFUSED/
      );
    });
  });

  describe('streamToBufferParts', () => {
    it('should split stream into correct sized parts', async () => {
      const testData = Buffer.from('Hello World! This is a test message.');
      const stream = new Readable({
        read() {
          this.push(testData);
          this.push(null);
        }
      });

      const parts = await streamToBufferParts(stream, 10);

      assert.strictEqual(parts.length, 4); // 40 bytes / 10 bytes per part
      assert.strictEqual(parts[0].toString(), 'Hello Worl');
      assert.strictEqual(parts[1].toString(), 'd! This is');
      assert.strictEqual(parts[2].toString(), ' a test me');
      assert.strictEqual(parts[3].toString(), 'ssage.');
    });

    it('should handle exact part size', async () => {
      const testData = Buffer.from('1234567890'); // Exactly 10 bytes
      const stream = new Readable({
        read() {
          this.push(testData);
          this.push(null);
        }
      });

      const parts = await streamToBufferParts(stream, 10);

      assert.strictEqual(parts.length, 1);
      assert.strictEqual(parts[0].toString(), '1234567890');
    });

    it('should handle small final part', async () => {
      const testData = Buffer.from('123456789'); // 9 bytes
      const stream = new Readable({
        read() {
          this.push(testData);
          this.push(null);
        }
      });

      const parts = await streamToBufferParts(stream, 10);

      assert.strictEqual(parts.length, 1);
      assert.strictEqual(parts[0].toString(), '123456789');
    });

    it('should handle empty stream', async () => {
      const stream = new Readable({
        read() {
          this.push(null);
        }
      });

      const parts = await streamToBufferParts(stream, 10);

      assert.strictEqual(parts.length, 0);
    });

    it('should handle multiple chunks', async () => {
      const stream = new Readable({
        read() {
          this.push(Buffer.from('Hello'));
          this.push(Buffer.from(' World'));
          this.push(Buffer.from('!'));
          this.push(null);
        }
      });

      const parts = await streamToBufferParts(stream, 5);

      assert.strictEqual(parts.length, 3);
      assert.strictEqual(parts[0].toString(), 'Hello');
      assert.strictEqual(parts[1].toString(), ' Worl');
      assert.strictEqual(parts[2].toString(), 'd!');
    });
  });
}); 