import { apiRequest } from './queryClient';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadState {
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error' | 'canceled';
  progress: number;
  message?: string;
  assetId?: string;
  error?: string;
}

export interface UploadOptions {
  recipeId?: number;
  recipeVariable?: string;
  onProgress?: (progress: UploadProgress) => void;
  onStateChange?: (state: UploadState) => void;
}

export interface PresignResponse {
  finalizeToken: string;
  s3KeyPlanned: string;
  assetId: string;
  presign: {
    url: string;
    headers: Record<string, string>;
  };
  cdnPreview: string;
}

export class UploadService {
  private static instance: UploadService;
  private activeUploads = new Map<string, XMLHttpRequest>();

  static getInstance(): UploadService {
    if (!UploadService.instance) {
      UploadService.instance = new UploadService();
    }
    return UploadService.instance;
  }

  async uploadFile(
    file: File,
    options: UploadOptions = {}
  ): Promise<string> {
    const { recipeId, recipeVariable, onProgress, onStateChange } = options;
    
    // Determine asset type based on MIME type
    const assetType = this.getAssetType(file.type);
    
    // Update state to uploading
    onStateChange?.({
      status: 'uploading',
      progress: 0,
      message: 'Preparing upload...'
    });

    try {
      // Step 1: Get presigned URL
      const presignRes = await apiRequest('POST', '/api/media-library/upload-url', {
        filename: file.name,
        mimeType: file.type,
        assetType,
        recipeId,
        recipeVariable
      });

      const presign: PresignResponse = await presignRes.json();
      
      onStateChange?.({
        status: 'uploading',
        progress: 5,
        message: 'Uploading to cloud...'
      });

      // Step 2: Upload to S3
      const assetId = await this.uploadToS3(file, presign, onProgress, onStateChange);
      
      // Step 3: Finalize asset
      onStateChange?.({
        status: 'processing',
        progress: 95,
        message: 'Processing asset...'
      });

      await this.finalizeAsset(presign, file, assetType);
      
      // Step 4: Associate with recipe if provided
      if (recipeId && recipeVariable) {
        await this.associateWithRecipe(recipeId, assetId, recipeVariable, assetType);
      }

      onStateChange?.({
        status: 'complete',
        progress: 100,
        message: 'Upload complete!',
        assetId
      });

      return assetId;

    } catch (error: any) {
      const errorMessage = error?.message || 'Upload failed';
      onStateChange?.({
        status: 'error',
        progress: 0,
        message: errorMessage,
        error: errorMessage
      });
      throw error;
    }
  }

  private async uploadToS3(
    file: File,
    presign: PresignResponse,
    onProgress?: (progress: UploadProgress) => void,
    onStateChange?: (state: UploadState) => void
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const uploadId = presign.assetId;
      
      // Store XHR for potential cancellation
      this.activeUploads.set(uploadId, xhr);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress: UploadProgress = {
            loaded: e.loaded,
            total: e.total,
            percentage: Math.round((e.loaded / e.total) * 100)
          };
          
          // Scale progress from 5% to 90% (reserving 5% for preparation and 5% for finalization)
          const scaledProgress = 5 + (progress.percentage * 0.85);
          
          onProgress?.(progress);
          onStateChange?.({
            status: 'uploading',
            progress: scaledProgress,
            message: `Uploading... ${progress.percentage}%`
          });
        }
      };

      xhr.onload = () => {
        this.activeUploads.delete(uploadId);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(presign.assetId);
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        this.activeUploads.delete(uploadId);
        reject(new Error('Network error during upload'));
      };

      xhr.onabort = () => {
        this.activeUploads.delete(uploadId);
        reject(new Error('Upload canceled'));
      };

      // Set up the request
      xhr.open('PUT', presign.presign.url, true);
      
      // Set headers
      Object.entries(presign.presign.headers || {}).forEach(([key, value]) => {
        xhr.setRequestHeader(key, String(value));
      });

      // Send the file
      xhr.send(file);
    });
  }

  private async finalizeAsset(
    presign: PresignResponse,
    file: File,
    assetType: number
  ): Promise<void> {
    await apiRequest('POST', '/api/media-library/finalize', {
      assetId: presign.assetId,
      s3Key: presign.s3KeyPlanned,
      originalFilename: file.name,
      fileSize: file.size,
      mimeType: file.type,
      assetType,
      cdnUrl: presign.cdnPreview
    });
  }

  private async associateWithRecipe(
    recipeId: number,
    assetId: string,
    recipeVariable: string,
    assetType: number
  ): Promise<void> {
    // For now, we'll use the existing media library structure
    // The asset is already stored in user_assets table
    // TODO: Implement recipe-asset association endpoint when needed
    console.log(`Asset ${assetId} uploaded and ready for recipe ${recipeId} as ${recipeVariable}`);
    
    // In the future, this could create a recipe_assets table or similar
    // to track which assets are used in which recipes
  }

  cancelUpload(assetId: string): boolean {
    const xhr = this.activeUploads.get(assetId);
    if (xhr) {
      xhr.abort();
      this.activeUploads.delete(assetId);
      return true;
    }
    return false;
  }

  private getAssetType(mimeType: string): number {
    if (mimeType.startsWith('image/')) return 1;
    if (mimeType.startsWith('video/')) return 2;
    if (mimeType.startsWith('audio/')) return 3;
    if (mimeType === 'application/pdf') return 4;
    return 1; // Default to image
  }

  // Clean up all active uploads
  cleanup(): void {
    this.activeUploads.forEach(xhr => xhr.abort());
    this.activeUploads.clear();
  }
}

export const uploadService = UploadService.getInstance();
