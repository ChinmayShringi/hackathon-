import { eq, desc, and, sql, count } from "drizzle-orm";
import { generations } from "@shared/schema";
import { db } from "./db";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Cache key generators - Session-specific for future isolation support
  static guestGenerationsKey(sessionId: string, page: number, limit: number): string {
    return `guest_generations_${sessionId}_${page}_${limit}`;
  }

  static guestGenerationsStatsKey(userId: string): string {
    return `guest_generations_stats_${userId}`;
  }

  static queueStatsKey(): string {
    return 'queue_stats';
  }

  // Invalidate related cache entries - Session-specific for future isolation support
  invalidateGuestGenerations(sessionId?: string): void {
    const keysToDelete: string[] = [];
    this.cache.forEach((_, key) => {
      if (sessionId) {
        // Invalidate specific session's cache
        if (key.startsWith(`guest_generations_${sessionId}_`)) {
          keysToDelete.push(key);
        }
      } else {
        // Invalidate all guest generation caches (fallback)
        if (key.startsWith('guest_generations_')) {
          keysToDelete.push(key);
        }
      }
    });
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  invalidateStats(sessionId?: string): void {
    if (sessionId) {
      this.delete(CacheService.guestGenerationsStatsKey(sessionId));
    } else {
      // Invalidate all stats caches (fallback)
      const keysToDelete: string[] = [];
      this.cache.forEach((_, key) => {
        if (key.startsWith('guest_generations_stats_')) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach(key => this.cache.delete(key));
    }
    this.delete(CacheService.queueStatsKey());
  }
}

export const cacheService = new CacheService();
export { CacheService }; 