export interface MakeThumbnailsRequest {
  remote_url: string;        // Source image URL
  bucket: string;            // S3 bucket name  
  key: string;               // Base S3 key (e.g., "library/user/123/images/thumbnails")
  prefix_name: string;       // Image identifier (e.g., "asset_abc123")
  sizes: number[];           // Array of thumbnail sizes [32, 48, 72, 64, 96, 128, 160, 256, 320, 512]
}

export interface ThumbnailResult {
  size: number;
  width: number;
  height: number;
  s3Key: string;
  cdnUrl: string;
  fileSize: number;
}

export interface MakeThumbnailsResult {
  success: boolean;
  message: string;
  thumbnails: {
    [size: string]: ThumbnailResult;
  };
  processing: {
    time: string;
    timestamp: string;
    totalThumbnails: number;
  };
  error?: string;
}

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
  aspectRatio: number;
}
