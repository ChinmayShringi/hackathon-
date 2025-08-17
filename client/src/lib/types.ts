// Shared types for the Delula client application

// CDN configuration
export const CDN_BASE_URL = 'https://cdn.delu.la';

// Universal Asset interface for all media library operations
export interface Asset {
  id: number;
  userId: string;
  assetId: string;
  displayName: string;
  originalFilename: string;
  normalizedName?: string;
  cdnUrl: string | undefined;
  s3Key: string;
  mimeType: string;
  assetType: number;
  fileSize: number;
  source: number;
  thumbnailUrl?: string;
  dimensions?: any;
  duration?: number;
  userTags?: string[];
  systemTags?: string[];
  autoClassification?: any;
  aiClassification?: any;
  usageCount: number;
  lastUsedAt?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt?: string;
}

// Helper function to construct proper CDN URLs
export const getCdnUrl = (cdnUrl: string | null | undefined, s3Key?: string): string => {
  if (cdnUrl && cdnUrl.startsWith('http')) {
    return cdnUrl; // Already a full URL
  }
  
  if (cdnUrl && !cdnUrl.startsWith('http')) {
    const constructedUrl = `${CDN_BASE_URL}${cdnUrl.startsWith('/') ? '' : '/'}${cdnUrl}`;
    return constructedUrl;
  }
  
  if (s3Key) {
    // Fallback to constructing from S3 key if available
    return `${CDN_BASE_URL}/${s3Key}`;
  }
  
  // Final fallback - return a placeholder data URL for broken images
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIjk5YWFhYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==';
};

// Asset type constants
export const ASSET_TYPES = {
  IMAGE: 1,
  VIDEO: 2,
  AUDIO: 3,
  DOCUMENT: 4,
} as const;

export type AssetType = typeof ASSET_TYPES[keyof typeof ASSET_TYPES];

// Asset source constants
export const ASSET_SOURCES = {
  UPLOADED: 1,
  GENERATED: 2,
  IMPORTED: 3,
} as const;

export type AssetSource = typeof ASSET_SOURCES[keyof typeof ASSET_SOURCES];

// Media library thumbnail sizes (shared between client and server)
export const MEDIA_LIBRARY_THUMBNAIL_SIZES = {
  // Collection & Category Icons
  icon32: 32,    // Tiny icons, list views
  icon48: 48,    // Collection thumbnails, folders
  icon72: 72,    // Category icons
  
  // Gallery Grid Views
  thumb64: 64,   // Compact grid
  thumb96: 96,   // Standard grid (most common)
  thumb128: 128, // Large grid
  thumb160: 160, // Gallery preview
  
  // Detail & Preview Views
  preview256: 256, // Medium preview
  preview320: 320, // Large preview
  preview512: 512, // Full preview
} as const;

export type ThumbnailSize = typeof MEDIA_LIBRARY_THUMBNAIL_SIZES[keyof typeof MEDIA_LIBRARY_THUMBNAIL_SIZES];

// Upload-related types
export interface UploadItem {
  file: File;
  status: 'queued' | 'uploading' | 'finalizing' | 'done' | 'error' | 'canceled';
  progress: number; // 0-100
  message?: string;
  xhr?: XMLHttpRequest | null;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadState {
  status: 'idle' | 'uploading' | 'done' | 'error';
  progress: number;
  message?: string;
  error?: string;
}

// Recipe-related types
export interface RecipeFormData {
  prompt: string;
  inputImage?: string; // Asset ID
  styleImage?: string; // Asset ID
  referenceImage?: string; // Asset ID
  [key: string]: string | undefined; // Allow string indexing
}
