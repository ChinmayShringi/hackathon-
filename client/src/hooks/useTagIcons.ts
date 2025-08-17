import { useState, useEffect, useCallback } from 'react';
import { tagIconService } from '@/lib/tagIconUtils';

interface TagIconMapping {
  icon: string;
  color?: string;
}

interface UseTagIconsReturn {
  getTagIcon: (tagLabel: string) => string | null;
  getTagColor: (tagLabel: string) => string | null;
  enhanceTagDisplayData: (tagDisplayData: Record<string, any>) => Record<string, any>;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useTagIcons(): UseTagIconsReturn {
  const [mappings, setMappings] = useState<Record<string, TagIconMapping>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMappings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const iconMappings = await tagIconService.getIconMappings();
      setMappings(iconMappings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load icon mappings');
      console.error('Error loading tag icon mappings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    tagIconService.clearCache();
    loadMappings();
  }, [loadMappings]);

  useEffect(() => {
    loadMappings();
  }, [loadMappings]);

  const getTagIcon = useCallback((tagLabel: string): string | null => {
    return mappings[tagLabel]?.icon || null;
  }, [mappings]);

  const getTagColor = useCallback((tagLabel: string): string | null => {
    return mappings[tagLabel]?.color || null;
  }, [mappings]);

  const enhanceTagDisplayData = useCallback((tagDisplayData: Record<string, any>): Record<string, any> => {
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
  }, [mappings]);

  return {
    getTagIcon,
    getTagColor,
    enhanceTagDisplayData,
    isLoading,
    error,
    refresh
  };
} 