import type { 
  LambdaEvent, 
  GetFramesResponse, 
  FrameResult, 
  UnfulfilledFrame,
  VideoMetadata 
} from './types';
import {
  validateVideoUrl,
  downloadVideoToTemp,
  getVideoMetadata,
  getTotalFrames,
  parseFrameRequests,
  resolveFrameIndex,
  extractFrameByIndex,
  cleanupTempFiles
} from './video-utils';
import {
  uploadFrameToS3,
  generateFrameKey,
  generateUUID,
  cleanupLocalFrame
} from './s3-utils';
import { notifyServerThumbnailReady } from './video-utils';

// Environment variables are loaded by Lambda runtime

// Constants
const MAX_FRAMES_PER_REQUEST = 10;
const MAX_VIDEO_DURATION_SECONDS = 300; // 5 minutes
const MAX_VIDEO_SIZE_MB = 500; // 500MB

export async function handler(event: LambdaEvent): Promise<GetFramesResponse> {
  const startTime = Date.now();
  const tempFiles: string[] = [];
  
  try {
    console.log('🎬 GetFramesFromVideo Lambda Started');
    console.log('Event:', JSON.stringify(event, null, 2));
    
    // Validate input parameters
    if (!event.video_url || !event.frame_requests || !event.destination_bucket) {
      throw new Error('Missing required parameters: video_url, frame_requests, destination_bucket');
    }
    
    // Validate video URL
    if (!validateVideoUrl(event.video_url)) {
      throw new Error(`Invalid video URL or unsupported format: ${event.video_url}`);
    }
    
    // Parse frame requests
    const frameRequest = parseFrameRequests(event.frame_requests);
    
    // Validate frame count limit
    if (frameRequest.parsed.length > MAX_FRAMES_PER_REQUEST) {
      throw new Error(`Too many frame requests: ${frameRequest.parsed.length} (max: ${MAX_FRAMES_PER_REQUEST})`);
    }
    
    console.log(`📹 Processing ${frameRequest.parsed.length} frame requests`);
    
    // Download video to temp
    console.log('⬇️ Downloading video...');
    const videoPath = await downloadVideoToTemp(event.video_url);
    tempFiles.push(videoPath);
    
    // Get video metadata
    console.log('🔍 Analyzing video metadata...');
    const metadata = await getVideoMetadata(videoPath);
    const totalFrames = await getTotalFrames(videoPath);
    
    // Validate video constraints
    if (metadata.duration > MAX_VIDEO_DURATION_SECONDS) {
      throw new Error(`Video too long: ${metadata.duration}s (max: ${MAX_VIDEO_DURATION_SECONDS}s)`);
    }
    
    if (metadata.file_size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
      throw new Error(`Video too large: ${Math.round(metadata.file_size / 1024 / 1024)}MB (max: ${MAX_VIDEO_SIZE_MB}MB)`);
    }
    
    // Update metadata with total frames
    const videoMetadata: VideoMetadata = {
      ...metadata,
      total_frames: totalFrames
    };
    
    console.log(`📊 Video: ${totalFrames} frames, ${metadata.width}x${metadata.height}, ${metadata.duration}s`);
    
    // Process frame requests
    const frames: { [key: string]: FrameResult } = {};
    const unfulfilled: { [key: string]: UnfulfilledFrame } = {};
    let totalExtracted = 0;
    let totalUnfulfilled = 0;
    
    for (const frameSpec of frameRequest.parsed) {
      try {
        // Resolve frame index
        const frameIndex = resolveFrameIndex(frameSpec, totalFrames);
        
        // Generate output path
        const uuid = generateUUID();
        const localOutputPath = `/tmp/frame-${frameIndex}-${uuid}.png`;
        tempFiles.push(localOutputPath);
        
        // Extract frame
        console.log(`🎞️ Extracting frame ${frameIndex} (${frameSpec.original})...`);
        const extractionResult = await extractFrameByIndex(videoPath, frameIndex, localOutputPath);
        
        if (extractionResult.success) {
          // Upload to S3
          const outputPrefix = event.output_prefix || 'frames';
          const s3Key = generateFrameKey(outputPrefix, frameIndex, uuid);
          
          console.log(`☁️ Uploading frame to S3: ${s3Key}`);
          const uploadResult = await uploadFrameToS3(localOutputPath, event.destination_bucket, s3Key);
          
          if (uploadResult.success) {
            // Success - add to frames
            frames[frameSpec.original] = {
              frame_id: frameIndex,
              bucket_key: s3Key,
              s3_url: uploadResult.s3_url,
              processing_time_ms: extractionResult.processing_time_ms,
              original_request: frameSpec.original
            };
            totalExtracted++;
            
            // Clean up local frame
            await cleanupLocalFrame(localOutputPath);
          } else {
            // Upload failed
            const reason = `S3 upload failed: ${uploadResult.error}`;
            unfulfilled[frameSpec.original] = {
              original_request: frameSpec.original,
              reason,
              attempted_value: frameIndex
            };
            totalUnfulfilled++;
          }
        } else {
          // Extraction failed
          const reason = `Frame extraction failed: ${extractionResult.error}`;
          unfulfilled[frameSpec.original] = {
            original_request: frameSpec.original,
            reason,
            attempted_value: frameIndex
          };
          totalUnfulfilled++;
        }
      } catch (error) {
        // Frame processing failed
        const reason = `Frame processing error: ${error instanceof Error ? error.message : String(error)}`;
        unfulfilled[frameSpec.original] = {
          original_request: frameSpec.original,
          reason
        };
        totalUnfulfilled++;
      }
    }
    
    // Determine success/failure
    const allowPartial = event.allow_partial_completion || false;
    const hasErrors = totalUnfulfilled > 0;
    const success = allowPartial ? totalExtracted > 0 : !hasErrors;
    
    // Build response
    const totalProcessingTime = Date.now() - startTime;
    
    const response: GetFramesResponse = {
      success,
      video_metadata: videoMetadata,
      frames,
      summary: {
        total_requested: frameRequest.parsed.length,
        total_extracted: totalExtracted,
        total_unfulfilled: totalUnfulfilled,
        total_processing_time_ms: totalProcessingTime
      }
    };
    
    // Add unfulfilled frames if any
    if (totalUnfulfilled > 0) {
      response.unfulfilled = unfulfilled;
    }
    
    // Add errors if complete failure
    if (!success && totalExtracted === 0) {
      response.errors = ['All frame requests failed'];
    }
    
    console.log(`✅ Lambda completed: ${totalExtracted} frames extracted, ${totalUnfulfilled} failed`);
    console.log(`⏱️ Total processing time: ${totalProcessingTime}ms`);
    
    // Optional callback to server when first frame ready and metadata provided
    try {
      const webhookUrl = (event as any).server_base_url || process.env.SERVER_BASE_URL;
      const webhookSecret = process.env.MEDIA_WEBHOOK_SECRET;
      const userId = (event as any).user_id;
      const assetId = (event as any).asset_id;
      const firstFrame = frames[frameRequest.parsed[0].original];
      if (webhookUrl && webhookSecret && userId && assetId && firstFrame?.bucket_key) {
        const cdnBase = process.env.CDN_BASE_URL || 'https://cdn.delu.la';
        const thumbnailUrl = `${cdnBase}/${firstFrame.bucket_key}`;
        await notifyServerThumbnailReady(webhookUrl, webhookSecret, String(userId), String(assetId), thumbnailUrl);
      }
    } catch (cbErr) {
      console.log('Webhook notify error (non-fatal):', cbErr);
    }

    return response;
    
  } catch (error) {
    console.error('❌ Lambda failed:', error);
    
    const totalProcessingTime = Date.now() - startTime;
    
    return {
      success: false,
      video_metadata: {
        total_frames: 0,
        dimensions: { width: 0, height: 0 },
        duration: 0,
        format: 'unknown',
        file_size: 0
      },
      frames: {},
      errors: [error instanceof Error ? error.message : String(error)],
      summary: {
        total_requested: 0,
        total_extracted: 0,
        total_unfulfilled: 0,
        total_processing_time_ms: totalProcessingTime
      }
    };
  } finally {
    // Clean up temp files
    try {
      await cleanupTempFiles(tempFiles);
    } catch (error) {
      console.log('Warning: Could not clean up all temp files:', error);
    }
  }
}
