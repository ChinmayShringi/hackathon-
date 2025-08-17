import { db } from './db';
import { recipeOptionTagIcons } from '../shared/schema';
import { eq, inArray } from 'drizzle-orm';

export interface TagIconData {
  id: string;
  display: string;
  icon: string | null;
  color: string | null;
}

class TagIconService {
  private iconCache: Map<string, TagIconData> = new Map();
  private cacheInitialized = false;

  /**
   * Initialize the icon cache by loading all mappings from the database
   */
  async initializeCache(): Promise<void> {
    if (this.cacheInitialized) return;

    try {
      const icons = await db
        .select({
          id: recipeOptionTagIcons.id,
          display: recipeOptionTagIcons.display,
          icon: recipeOptionTagIcons.icon,
          color: recipeOptionTagIcons.color
        })
        .from(recipeOptionTagIcons);

      // Clear existing cache and populate with fresh data
      this.iconCache.clear();
      icons.forEach(icon => {
        this.iconCache.set(icon.id, icon);
      });

      this.cacheInitialized = true;
      console.log(`📦 Tag icon cache initialized with ${icons.length} mappings`);
    } catch (error) {
      console.error('❌ Error initializing tag icon cache:', error);
      // Continue without cache - will fall back to database queries
    }
  }

  /**
   * Get icon data for a specific tag label
   */
  async getIconData(tagLabel: string): Promise<TagIconData | null> {
    await this.initializeCache();

    // Try cache first
    if (this.cacheInitialized) {
      return this.iconCache.get(tagLabel) || null;
    }

    // Fall back to database query
    try {
      const result = await db
        .select({
          id: recipeOptionTagIcons.id,
          display: recipeOptionTagIcons.display,
          icon: recipeOptionTagIcons.icon,
          color: recipeOptionTagIcons.color
        })
        .from(recipeOptionTagIcons)
        .where(eq(recipeOptionTagIcons.id, tagLabel))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      console.error(`❌ Error fetching icon data for "${tagLabel}":`, error);
      return null;
    }
  }

  /**
   * Get icon data for multiple tag labels efficiently
   */
  async getIconDataBatch(tagLabels: string[]): Promise<Map<string, TagIconData>> {
    await this.initializeCache();

    const result = new Map<string, TagIconData>();

    if (this.cacheInitialized) {
      // Use cache for batch lookups
      tagLabels.forEach(label => {
        const iconData = this.iconCache.get(label);
        if (iconData) {
          result.set(label, iconData);
        }
      });
      return result;
    }

    // Fall back to database query
    try {
      const icons = await db
        .select({
          id: recipeOptionTagIcons.id,
          display: recipeOptionTagIcons.display,
          icon: recipeOptionTagIcons.icon,
          color: recipeOptionTagIcons.color
        })
        .from(recipeOptionTagIcons)
        .where(inArray(recipeOptionTagIcons.id, tagLabels));

      icons.forEach(icon => {
        result.set(icon.id, icon);
      });

      return result;
    } catch (error) {
      console.error('❌ Error fetching batch icon data:', error);
      return result;
    }
  }

  /**
   * Clear the cache (useful for testing or when data changes)
   */
  clearCache(): void {
    this.iconCache.clear();
    this.cacheInitialized = false;
  }
}

// Export singleton instance
export const tagIconService = new TagIconService(); 