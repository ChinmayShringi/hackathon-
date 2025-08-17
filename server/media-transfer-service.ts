import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Import environment variables
import './env.js';

// Initialize Lambda client lazily to ensure environment variables are loaded
let lambdaClient: LambdaClient | null = null;

function getLambdaClient(): LambdaClient {
  if (!lambdaClient) {
    lambdaClient = new LambdaClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_DELULA_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_DELULA_SECRET_ACCESS_KEY!,
      },
    });
  }
  return lambdaClient;
}

export interface MediaTransferRequest {
  remoteUrl: string;
  mediaType: 'image' | 'video' | 'audio';
  originalFilename?: string;
}

export interface MediaTransferResult {
  success: boolean;
  cdnUrl?: string;
  s3Key?: string;
  assetId?: string;
  error?: string;
}

export class MediaTransferService {
  private readonly BUCKET_NAME = 'delula-media-prod';
  private readonly CDN_BASE_URL = 'https://cdn.delu.la';

  /**
   * Transfer media from external URL to S3 and return CDN URL
   */
  async transferMedia(request: MediaTransferRequest): Promise<MediaTransferResult> {
    try {
      // Generate UUID and determine file extension
      const assetId = uuidv4();
      const fileExtension = this.extractFileExtension(request.remoteUrl, request.originalFilename);
      
      // Build S3 key: {mediaType}/raw/{UUID}.{extension}
      const s3Key = `${request.mediaType}s/raw/${assetId}.${fileExtension}`;
      
      // Prepare Lambda payload
      const lambdaPayload = {
        remote_url: request.remoteUrl,
        bucket: this.BUCKET_NAME,
        key: s3Key,
        mime_type: this.getMimeType(fileExtension)
      };

      // Invoke the Lambda function
      const command = new InvokeCommand({
        FunctionName: 'ExternalFileTransferToS3',
        Payload: JSON.stringify(lambdaPayload)
      });

      const response = await getLambdaClient().send(command);
      
      if (!response.Payload) {
        throw new Error('No response payload from Lambda');
      }

      const result = JSON.parse(new TextDecoder().decode(response.Payload));
      
      if (result.statusCode !== 200) {
        throw new Error(`Lambda execution failed: ${result.body}`);
      }

      // Build CDN URL
      const cdnUrl = `${this.CDN_BASE_URL}/${s3Key}`;

      return {
        success: true,
        cdnUrl,
        s3Key,
        assetId
      };

    } catch (error) {
      console.error('Media transfer failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Extract file extension from URL or filename
   */
  private extractFileExtension(url: string, originalFilename?: string): string {
    // Try to get extension from original filename first
    if (originalFilename) {
      const ext = path.extname(originalFilename).toLowerCase().replace('.', '');
      if (ext && ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'avi', 'mp3', 'wav', 'aac'].includes(ext)) {
        return ext;
      }
    }

    // Try to get extension from URL
    const urlExt = path.extname(url).toLowerCase().replace('.', '');
    if (urlExt && ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'avi', 'mp3', 'wav', 'aac'].includes(urlExt)) {
      return urlExt;
    }

    // Default extensions based on media type
    return 'mp4'; // Default for videos, will be overridden by MIME type detection
  }

  /**
   * Get MIME type based on file extension
   */
  private getMimeType(extension: string): string {
    const mimeTypes: Record<string, string> = {
      // Images
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      
      // Videos
      'mp4': 'video/mp4',
      'mov': 'video/quicktime',
      'avi': 'video/x-msvideo',
      'webm': 'video/webm',
      
      // Audio
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'aac': 'audio/aac',
      'ogg': 'audio/ogg'
    };

    return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
  }

  /**
   * Transfer multiple media files
   */
  async transferMultipleMedia(requests: MediaTransferRequest[]): Promise<MediaTransferResult[]> {
    const results: MediaTransferResult[] = [];
    
    for (const request of requests) {
      const result = await this.transferMedia(request);
      results.push(result);
      
      // Add small delay between transfers to avoid overwhelming the Lambda
      if (requests.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return results;
  }
}

// Export singleton instance
export const mediaTransferService = new MediaTransferService(); 