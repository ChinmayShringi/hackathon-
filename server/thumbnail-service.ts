import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
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

export interface ThumbnailGenerationRequest {
  generationId: number;
  videoUrl: string;
  s3Key: string;
  assetId: string;
}

export interface ThumbnailGenerationResult {
  success: boolean;
  thumbnailUrl?: string;
  error?: string;
}

export class ThumbnailService {
  private readonly BUCKET_NAME = 'delula-media-prod';
  private readonly CDN_BASE_URL = 'https://cdn.delu.la';

  /**
   * Update the database with the thumbnail URL
   */
  async updateThumbnailUrl(generationId: number, thumbnailUrl: string): Promise<void> {
    try {
      const { db } = await import('./db');
      const { generations } = await import('../shared/schema');
      const { eq } = await import('drizzle-orm');

      await db
        .update(generations)
        .set({
          thumbnailUrl: thumbnailUrl,
          updatedAt: new Date()
        })
        .where(eq(generations.id, generationId));

      console.log(`✅ Updated generation ${generationId} with thumbnail URL: ${thumbnailUrl}`);
    } catch (error) {
      console.error(`❌ Failed to update thumbnail URL for generation ${generationId}:`, error);
      throw error;
    }
  }

  /**
   * Generate a thumbnail for a video using the VideoToGIF_Square Lambda
   */
  async generateThumbnail(request: ThumbnailGenerationRequest): Promise<ThumbnailGenerationResult> {
    try {
      console.log(`🎬 Starting thumbnail generation for generation ${request.generationId}`);
      console.log(`📹 Video URL: ${request.videoUrl}`);
      console.log(`🆔 Asset ID: ${request.assetId}`);

      // Extract filename from video URL and create thumbnail key
      const videoUrl = request.videoUrl;
      const filename = videoUrl.split('/').pop()?.split('?')[0]?.replace('.mp4', '') || request.assetId;
      const thumbnailKey = `videos/thumbnails/${filename}.gif`;

      // Prepare Lambda payload
      const lambdaPayload = {
        remote_url: request.videoUrl,
        bucket: this.BUCKET_NAME,
        key: thumbnailKey,
        dimension: 128
      };

      console.log(`Invoking VideoToGIF_Square Lambda with payload:`, lambdaPayload);

      // Invoke the Lambda function
      const command = new InvokeCommand({
        FunctionName: 'VideoToGIF_Square',
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

      // Build CDN URL for thumbnail
      const thumbnailUrl = `${this.CDN_BASE_URL}/${thumbnailKey}`;

      console.log(`✅ Thumbnail generation completed successfully: ${thumbnailUrl}`);

      // Update the database with the thumbnail URL
      await this.updateThumbnailUrl(request.generationId, thumbnailUrl);

      return {
        success: true,
        thumbnailUrl
      };

    } catch (error) {
      console.error('Thumbnail generation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Generate thumbnail asynchronously (fire and forget)
   * This is used when we don't want to block the main generation process
   */
  async generateThumbnailAsync(request: ThumbnailGenerationRequest): Promise<void> {
    // Fire and forget - don't wait for result
    this.generateThumbnail(request).catch(error => {
      console.error(`Async thumbnail generation failed for generation ${request.generationId}:`, error);
    });
  }
}

export const thumbnailService = new ThumbnailService(); 