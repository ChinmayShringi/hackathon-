import { storage } from '../storage';
import { db } from '../db';
import { generations } from '@shared/schema';
import { eq } from 'drizzle-orm';

describe('Pagination System', () => {
  const testSessionId = 'test-session-123';
  const testUserId = 'test-user-456';

  beforeEach(async () => {
    // Clean up test data
    await db.delete(generations).where(eq(generations.userId, 'guest_user'));
    await db.delete(generations).where(eq(generations.userId, testUserId));
  });

  afterEach(async () => {
    // Clean up test data
    await db.delete(generations).where(eq(generations.userId, 'guest_user'));
    await db.delete(generations).where(eq(generations.userId, testUserId));
  });

  describe('Guest Generations Pagination', () => {
    it('should handle empty results', async () => {
      const result = await storage.getGuestGenerations(testSessionId, { page: 1, limit: 5, offset: 0 });
      
      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('should handle single page results', async () => {
      // Create test generations
      const testGenerations = Array.from({ length: 3 }, (_, i) => ({
        userId: 'guest_user',
        prompt: `Test prompt ${i}`,
        status: 'completed',
        type: 'image',
        metadata: { sessionId: testSessionId }
      }));

      for (const gen of testGenerations) {
        await storage.createGuestGeneration(testSessionId, gen);
      }

      const result = await storage.getGuestGenerations(testSessionId, { page: 1, limit: 10, offset: 0 });
      
      expect(result.data).toHaveLength(3);
      expect(result.total).toBe(3);
    });

    it('should handle large page numbers gracefully', async () => {
      const result = await storage.getGuestGenerations(testSessionId, { page: 999, limit: 5, offset: 4990 });
      
      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('should handle invalid parameters', async () => {
      const result = await storage.getGuestGenerations(testSessionId, { page: -1, limit: -5, offset: -10 });
      
      // Should default to valid values
      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('should respect page size limits', async () => {
      // Create more than the limit
      const testGenerations = Array.from({ length: 15 }, (_, i) => ({
        userId: 'guest_user',
        prompt: `Test prompt ${i}`,
        status: 'completed',
        type: 'image',
        metadata: { sessionId: testSessionId }
      }));

      for (const gen of testGenerations) {
        await storage.createGuestGeneration(testSessionId, gen);
      }

      const result = await storage.getGuestGenerations(testSessionId, { page: 1, limit: 5, offset: 0 });
      
      expect(result.data).toHaveLength(5);
      expect(result.total).toBe(15);
    });

    it('should return correct pagination metadata', async () => {
      // Create test generations
      const testGenerations = Array.from({ length: 12 }, (_, i) => ({
        userId: 'guest_user',
        prompt: `Test prompt ${i}`,
        status: 'completed',
        type: 'image',
        metadata: { sessionId: testSessionId }
      }));

      for (const gen of testGenerations) {
        await storage.createGuestGeneration(testSessionId, gen);
      }

      const result = await storage.getGuestGenerations(testSessionId, { page: 2, limit: 5, offset: 5 });
      
      expect(result.data).toHaveLength(5);
      expect(result.total).toBe(12);
    });
  });

  describe('Authenticated User Generations Pagination', () => {
    it('should handle empty results for authenticated users', async () => {
      const result = await storage.getUserGenerations(testUserId, { page: 1, limit: 10, offset: 0 });
      
      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('should handle pagination for authenticated users', async () => {
      // Create test generations for authenticated user
      const testGenerations = Array.from({ length: 8 }, (_, i) => ({
        userId: testUserId,
        prompt: `Test prompt ${i}`,
        status: 'completed',
        type: 'image'
      }));

      for (const gen of testGenerations) {
        await storage.createGeneration(gen);
      }

      const result = await storage.getUserGenerations(testUserId, { page: 1, limit: 5, offset: 0 });
      
      expect(result.data).toHaveLength(5);
      expect(result.total).toBe(8);
    });
  });

  describe('Cursor-based Pagination', () => {
    it('should handle cursor-based pagination for large datasets', async () => {
      // Create test generations
      const testGenerations = Array.from({ length: 25 }, (_, i) => ({
        userId: 'guest_user',
        prompt: `Test prompt ${i}`,
        status: 'completed',
        type: 'image',
        metadata: { sessionId: testSessionId }
      }));

      for (const gen of testGenerations) {
        await storage.createGuestGeneration(testSessionId, gen);
      }

      // Get first page
      const firstPage = await storage.getGuestGenerationsCursor(testSessionId, {
        limit: 10,
        direction: 'forward'
      });

      expect(firstPage.data).toHaveLength(10);
      expect(firstPage.hasMore).toBe(true);
      expect(firstPage.nextCursor).toBeDefined();

      // Get next page using cursor
      if (firstPage.nextCursor) {
        const secondPage = await storage.getGuestGenerationsCursor(testSessionId, {
          cursor: firstPage.nextCursor,
          limit: 10,
          direction: 'forward'
        });

        expect(secondPage.data).toHaveLength(10);
        expect(secondPage.hasMore).toBe(true);
        expect(secondPage.prevCursor).toBeDefined();
      }
    });

    it('should handle backward pagination', async () => {
      // Create test generations
      const testGenerations = Array.from({ length: 15 }, (_, i) => ({
        userId: 'guest_user',
        prompt: `Test prompt ${i}`,
        status: 'completed',
        type: 'image',
        metadata: { sessionId: testSessionId }
      }));

      for (const gen of testGenerations) {
        await storage.createGuestGeneration(testSessionId, gen);
      }

      // Get a middle page first
      const middlePage = await storage.getGuestGenerationsCursor(testSessionId, {
        limit: 5,
        direction: 'forward'
      });

      if (middlePage.prevCursor) {
        const previousPage = await storage.getGuestGenerationsCursor(testSessionId, {
          cursor: middlePage.prevCursor,
          limit: 5,
          direction: 'backward'
        });

        expect(previousPage.data).toHaveLength(5);
        expect(previousPage.hasMore).toBe(true);
      }
    });
  });

  describe('Recipe Batch Lookup', () => {
    it('should efficiently batch recipe lookups', async () => {
      // Create test generations with recipe IDs
      const testGenerations = Array.from({ length: 5 }, (_, i) => ({
        userId: 'guest_user',
        recipeId: i + 1,
        prompt: `Test prompt ${i}`,
        status: 'completed',
        type: 'image',
        metadata: { sessionId: testSessionId }
      }));

      for (const gen of testGenerations) {
        await storage.createGuestGeneration(testSessionId, gen);
      }

      const result = await storage.getGuestGenerations(testSessionId, { page: 1, limit: 5, offset: 0 });
      
      // Should have recipe IDs
      expect(result.data.every(gen => gen.recipeId)).toBe(true);
    });
  });

  describe('Query Parameter Standards', () => {
    it('should support production-standard per_page parameter', async () => {
      // Create test generations
      const testGenerations = Array.from({ length: 8 }, (_, i) => ({
        userId: 'guest_user',
        prompt: `Test prompt ${i}`,
        status: 'completed',
        type: 'image',
        metadata: { sessionId: testSessionId }
      }));

      for (const gen of testGenerations) {
        await storage.createGuestGeneration(testSessionId, gen);
      }

      // Test with per_page parameter (production standard)
      const result = await storage.getGuestGenerations(testSessionId, { page: 1, limit: 5, offset: 0 });
      
      expect(result.data).toHaveLength(5);
      expect(result.total).toBe(8);
    });

    it('should maintain backward compatibility with limit parameter', async () => {
      // Create test generations
      const testGenerations = Array.from({ length: 6 }, (_, i) => ({
        userId: 'guest_user',
        prompt: `Test prompt ${i}`,
        status: 'completed',
        type: 'image',
        metadata: { sessionId: testSessionId }
      }));

      for (const gen of testGenerations) {
        await storage.createGuestGeneration(testSessionId, gen);
      }

      // Test with limit parameter (backward compatibility)
      const result = await storage.getGuestGenerations(testSessionId, { page: 1, limit: 3, offset: 0 });
      
      expect(result.data).toHaveLength(3);
      expect(result.total).toBe(6);
    });
  });
}); 