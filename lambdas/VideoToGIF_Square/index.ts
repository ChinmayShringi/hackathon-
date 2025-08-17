import AWS from "aws-sdk";
import fs from "fs";
import { promisify } from "util";
import type { VideoToGIFRequest } from "./types";
import { 
  validateVideoUrl, 
  downloadVideoToTemp, 
  convertVideoToGif, 
  cleanupTempFiles 
} from "./video-utils";

const s3 = new AWS.S3();
const readFile = promisify(fs.readFile);

export const handler = async (event: VideoToGIFRequest) => {
  const { remote_url, bucket, key, dimension = 128 } = event;
  let tempVideoFile: string | null = null;
  let tempGifFile: string | null = null;

  if (!remote_url || !bucket || !key) {
    return { statusCode: 400, body: "Missing required fields." };
  }

  // Validate dimension parameter
  if (dimension && (dimension < 16 || dimension > 512)) {
    return { 
      statusCode: 400, 
      body: "Invalid dimension. Must be between 16 and 512 pixels." 
    };
  }

  // Validate that the URL points to a video file
  if (!validateVideoUrl(remote_url)) {
    return { 
      statusCode: 400, 
      body: "Invalid video URL. Supported formats: mp4, webm, avi, mov, mkv, flv, wmv" 
    };
  }

  try {
    console.log("🎬 Starting video-to-GIF conversion...");
    console.log(`📹 Video URL: ${remote_url}`);
    console.log(`🪣 S3 Bucket: ${bucket}`);
    console.log(`🔑 S3 Key: ${key}`);
    console.log(`📐 Dimension: ${dimension}x${dimension}`);

    // Step 1: Download video to temporary file
    console.log("⬇️  Downloading video...");
    tempVideoFile = await downloadVideoToTemp(remote_url);
    console.log(`✅ Video downloaded to: ${tempVideoFile}`);

    // Step 2: Convert video to compressed GIF
    tempGifFile = `/tmp/gif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.gif`;
    console.log("🔄 Converting video to GIF...");
    
    const conversionResult = await convertVideoToGif(tempVideoFile, tempGifFile, dimension);
    
    console.log("✅ GIF conversion completed!");
    console.log(`📊 Compression: ${conversionResult.compressionRatio.toFixed(1)}% size reduction`);
    console.log(`⏱️  Processing time: ${conversionResult.processingTime}ms`);

    // Step 3: Upload GIF to S3
    console.log("☁️  Uploading GIF to S3...");
    const gifBuffer = await readFile(tempGifFile);
    
    await s3.putObject({
      Bucket: bucket,
      Key: key,
      Body: gifBuffer,
      ContentType: 'image/gif',
      ContentLength: gifBuffer.length,
      CacheControl: 'public, max-age=31536000' // 1 year cache
    }).promise();

    console.log("✅ GIF uploaded to S3 successfully!");

    // Step 4: Clean up temporary files
    const tempFiles = [tempVideoFile, tempGifFile].filter(Boolean) as string[];
    await cleanupTempFiles(tempFiles);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Video converted to GIF and uploaded successfully",
        s3Location: `s3://${bucket}/${key}`,
        dimension: `${dimension}x${dimension}`,
        compression: {
          originalSize: conversionResult.inputSize,
          compressedSize: conversionResult.outputSize,
          ratio: `${conversionResult.compressionRatio.toFixed(1)}%`
        },
        processing: {
          time: `${conversionResult.processingTime}ms`,
          timestamp: new Date().toISOString()
        }
      })
    };

  } catch (err: any) {
    console.error("❌ Error in video-to-GIF conversion:", err);
    
    // Clean up temporary files on error
    const tempFiles = [tempVideoFile, tempGifFile].filter(Boolean) as string[];
    await cleanupTempFiles(tempFiles);

    return { 
      statusCode: 500, 
      body: JSON.stringify({
        success: false,
        error: "Video conversion failed",
        details: err.message
      })
    };
  }
}; 