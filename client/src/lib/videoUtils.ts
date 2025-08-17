/**
 * Video orientation and aspect ratio utilities
 */

export interface VideoDimensions {
  width: number;
  height: number;
}

export interface VideoMetadata {
  dimensions?: VideoDimensions;
  aspectRatio?: string;
  width?: number;
  height?: number;
}

export type VideoOrientation = 'portrait' | 'landscape' | 'square';

/**
 * Determine video orientation from dimensions
 */
export function getVideoOrientation(width: number, height: number): VideoOrientation {
  if (!width || !height) return 'landscape'; // fallback
  
  if (width === height) return 'square';
  return width > height ? 'landscape' : 'portrait';
}

/**
 * Get Tailwind aspect ratio class based on video dimensions
 */
export function getAspectRatioClass(width: number, height: number): string {
  if (!width || !height) return 'aspect-video'; // fallback to 16:9
  
  const orientation = getVideoOrientation(width, height);
  
  switch (orientation) {
    case 'portrait':
      return 'aspect-[9/16]';
    case 'square':
      return 'aspect-square';
    case 'landscape':
    default:
      return 'aspect-video'; // 16:9
  }
}

/**
 * Get Tailwind aspect ratio class from metadata
 */
export function getAspectRatioClassFromMetadata(metadata: VideoMetadata): string {
  // Try dimensions first (most accurate)
  if (metadata.dimensions?.width && metadata.dimensions?.height) {
    return getAspectRatioClass(metadata.dimensions.width, metadata.dimensions.height);
  }
  
  // Try direct width/height
  if (metadata.width && metadata.height) {
    return getAspectRatioClass(metadata.width, metadata.height);
  }
  
  // Try aspectRatio string
  if (metadata.aspectRatio) {
    switch (metadata.aspectRatio) {
      case '9:16':
        return 'aspect-[9/16]';
      case '1:1':
        return 'aspect-square';
      case '16:9':
      default:
        return 'aspect-video';
    }
  }
  
  // Fallback to landscape
  return 'aspect-video';
}

/**
 * Get inline style for aspect ratio (fallback for custom ratios)
 */
export function getAspectRatioStyle(width: number, height: number): string {
  if (!width || !height) return '';
  
  const aspectRatio = width / height;
  return `aspect-ratio: ${aspectRatio};`;
}

/**
 * Extract video dimensions from generation metadata
 */
export function extractVideoDimensions(generation: any): VideoDimensions | null {
  // Try metadata.dimensions first
  if (generation.metadata?.dimensions?.width && generation.metadata?.dimensions?.height) {
    return {
      width: generation.metadata.dimensions.width,
      height: generation.metadata.dimensions.height
    };
  }
  
  // Try direct metadata width/height
  if (generation.metadata?.width && generation.metadata?.height) {
    return {
      width: generation.metadata.width,
      height: generation.metadata.height
    };
  }
  
  // Try to infer from aspectRatio
  if (generation.metadata?.aspectRatio) {
    const aspectRatio = generation.metadata.aspectRatio;
    if (aspectRatio === '9:16') {
      return { width: 9, height: 16 };
    } else if (aspectRatio === '16:9') {
      return { width: 16, height: 9 };
    } else if (aspectRatio === '1:1') {
      return { width: 1, height: 1 };
    }
  }
  
  // Try to extract from recipe prompt if available
  if (generation.metadata?.prompt) {
    try {
      const prompt = JSON.parse(generation.metadata.prompt);
      if (prompt.shot?.aspect_ratio) {
        const aspectRatio = prompt.shot.aspect_ratio;
        if (aspectRatio === '9:16') {
          return { width: 9, height: 16 };
        } else if (aspectRatio === '16:9') {
          return { width: 16, height: 9 };
        } else if (aspectRatio === '1:1') {
          return { width: 1, height: 1 };
        }
      }
      
      // Check for "vertical format" in composition
      if (prompt.shot?.composition && prompt.shot.composition.includes('vertical format')) {
        return { width: 9, height: 16 };
      }
    } catch (e) {
      // Ignore JSON parsing errors
    }
  }
  
  return null;
}

/**
 * Get the best aspect ratio class for a generation
 */
export function getGenerationAspectRatioClass(generation: any): string {
  const dimensions = extractVideoDimensions(generation);
  
  if (dimensions) {
    return getAspectRatioClass(dimensions.width, dimensions.height);
  }
  
  // Fallback based on type or metadata
  if (generation.type === 'video') {
    // For videos, check if we have any aspect ratio info
    if (generation.metadata?.aspectRatio) {
      return getAspectRatioClassFromMetadata(generation.metadata);
    }
  }
  
  // Default fallback
  return 'aspect-video';
} 