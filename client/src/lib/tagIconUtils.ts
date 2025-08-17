// Enterprise pattern for dynamic tag icon computation
// Fetches icon mappings from API and caches them for performance

interface TagIconMapping {
  icon: string;
  color?: string;
}

interface IconMappingsResponse {
  mappings: Record<string, TagIconMapping>;
}

class TagIconService {
  private static instance: TagIconService;
  private cache: Record<string, TagIconMapping> | null = null;
  private cacheExpiry: number | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private fetchPromise: Promise<Record<string, TagIconMapping>> | null = null;

  private constructor() {}

  static getInstance(): TagIconService {
    if (!TagIconService.instance) {
      TagIconService.instance = new TagIconService();
    }
    return TagIconService.instance;
  }

  /**
   * Get icon mappings with caching
   */
  async getIconMappings(): Promise<Record<string, TagIconMapping>> {
    // Return cached data if still valid
    if (this.cache && this.cacheExpiry && Date.now() < this.cacheExpiry) {
      return this.cache;
    }

    // If there's already a fetch in progress, wait for it
    if (this.fetchPromise) {
      return this.fetchPromise;
    }

    // Fetch new data
    this.fetchPromise = this.fetchIconMappings();
    try {
      this.cache = await this.fetchPromise;
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;
      return this.cache;
    } finally {
      this.fetchPromise = null;
    }
  }

  /**
   * Fetch icon mappings from API
   */
  private async fetchIconMappings(): Promise<Record<string, TagIconMapping>> {
    try {
      const response = await fetch('/api/tag-icon-mappings');
      if (!response.ok) {
        throw new Error(`Failed to fetch icon mappings: ${response.status}`);
      }
      
      const data: IconMappingsResponse = await response.json();
      return data.mappings;
    } catch (error) {
      console.error('Error fetching tag icon mappings:', error);
      return {};
    }
  }

  /**
   * Get icon for a specific tag label
   */
  async getTagIcon(tagLabel: string): Promise<string | null> {
    const mappings = await this.getIconMappings();
    return mappings[tagLabel]?.icon || null;
  }

  /**
   * Get color for a specific tag label
   */
  async getTagColor(tagLabel: string): Promise<string | null> {
    const mappings = await this.getIconMappings();
    return mappings[tagLabel]?.color || null;
  }

  /**
   * Enhance tagDisplayData with dynamic icon mappings
   */
  async enhanceTagDisplayDataWithIcons(tagDisplayData: Record<string, any>): Promise<Record<string, any>> {
    const mappings = await this.getIconMappings();
    const enhanced = { ...tagDisplayData };
    
    Object.keys(enhanced).forEach(tagLabel => {
      const tagData = enhanced[tagLabel];
      if (tagData && typeof tagData === 'object') {
        const mapping = mappings[tagLabel];
        if (mapping) {
          enhanced[tagLabel] = {
            ...tagData,
            icon: mapping.icon,
            ...(mapping.color && { color: mapping.color })
          };
        }
      }
    });
    
    return enhanced;
  }

  /**
   * Clear cache (useful for testing or manual refresh)
   */
  clearCache(): void {
    this.cache = null;
    this.cacheExpiry = null;
  }
}

// Export singleton instance
export const tagIconService = TagIconService.getInstance();

// Convenience functions for backward compatibility
export async function getTagIcon(tagLabel: string): Promise<string | null> {
  return tagIconService.getTagIcon(tagLabel);
}

export async function enhanceTagDisplayDataWithIcons(tagDisplayData: Record<string, any>): Promise<Record<string, any>> {
  return tagIconService.enhanceTagDisplayDataWithIcons(tagDisplayData);
} 