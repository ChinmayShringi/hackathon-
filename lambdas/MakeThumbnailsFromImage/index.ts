import AWS from "aws-sdk";
import fs from "fs";
import { promisify } from "util";
import type { MakeThumbnailsRequest, MakeThumbnailsResult, ThumbnailResult } from "./types";
import { 
  downloadImageToTemp, 
  generateThumbnails, 
  cleanupTempFiles,
  getImageMetadata
} from "./image-utils";

const s3 = new AWS.S3();
const readFile = promisify(fs.readFile);

export const handler = async (event: MakeThumbnailsRequest): Promise<MakeThumbnailsResult> => {
  const { remote_url, bucket, key, prefix_name, sizes } = event;
  let tempImageFile: string | null = null;
  const startTime = Date.now();

  // Validate required fields
  if (!remote_url || !bucket || !key || !prefix_name || !sizes || !Array.isArray(sizes)) {
    return {
      success: false,
      message: "Missing required fields: remote_url, bucket, key, prefix_name, sizes",
      thumbnails: {},
      processing: {
        time: "0ms",
        timestamp: new Date().toISOString(),
        totalThumbnails: 0
      },
      error: "Invalid request parameters"
    };
  }

  // Validate sizes array
  if (sizes.length === 0 || sizes.some(size => typeof size !== 'number' || size < 16 || size > 512)) {
    return {
      success: false,
      message: "Invalid sizes array. Must contain numbers between 16 and 512",
      thumbnails: {},
      processing: {
        time: "0ms",
        timestamp: new Date().toISOString(),
        totalThumbnails: 0
      },
      error: "Invalid thumbnail sizes"
    };
  }

  try {
    console.log("🖼️  Starting image thumbnail generation...");
    console.log(`📷 Image URL: ${remote_url}`);
    console.log(`🪣 S3 Bucket: ${bucket}`);
    console.log(`🔑 S3 Key: ${key}`);
    console.log(`🏷️  Prefix: ${prefix_name}`);
    console.log(`📏 Sizes: ${sizes.join(', ')}`);

    // Step 1: Download image to temporary file
    console.log("⬇️  Downloading image...");
    tempImageFile = await downloadImageToTemp(remote_url);
    console.log(`✅ Image downloaded to: ${tempImageFile}`);

    // Step 2: Get image metadata
    console.log("📊 Getting image metadata...");
    const metadata = await getImageMetadata(tempImageFile);
    console.log(`📐 Image dimensions: ${metadata.width}x${metadata.height}`);
    console.log(`📁 Format: ${metadata.format}`);
    console.log(`📏 Aspect ratio: ${metadata.aspectRatio.toFixed(2)}`);

    // Step 3: Generate thumbnails
    console.log("🔄 Generating thumbnails...");
    const thumbnailResults = await generateThumbnails(tempImageFile, sizes, metadata);
    console.log(`✅ Generated ${thumbnailResults.length} thumbnails`);

    // Step 4: Upload thumbnails to S3
    console.log("☁️  Uploading thumbnails to S3...");
    const thumbnails: { [size: string]: ThumbnailResult } = {};
    
    for (const result of thumbnailResults) {
      const thumbnailBuffer = await readFile(result.tempPath);
      const s3Key = `${key}/${prefix_name}_${result.size}.webp`;
      const cdnUrl = `https://cdn.delu.la/${s3Key}`;
      
      await s3.putObject({
        Bucket: bucket,
        Key: s3Key,
        Body: thumbnailBuffer,
        ContentType: 'image/webp',
        ContentLength: thumbnailBuffer.length,
        CacheControl: 'public, max-age=31536000' // 1 year cache
      }).promise();

      thumbnails[result.size.toString()] = {
        size: result.size,
        width: result.width,
        height: result.height,
        s3Key: s3Key,
        cdnUrl: cdnUrl,
        fileSize: thumbnailBuffer.length
      };

      console.log(`✅ Uploaded ${result.size}px thumbnail: ${s3Key}`);
    }

    // Step 5: Clean up temporary files
    const tempFiles = [tempImageFile, ...thumbnailResults.map(r => r.tempPath)].filter(Boolean) as string[];
    await cleanupTempFiles(tempFiles);

    const processingTime = Date.now() - startTime;

    console.log("✅ All thumbnails generated and uploaded successfully!");
    console.log(`⏱️  Total processing time: ${processingTime}ms`);

    return {
      success: true,
      message: "Image thumbnails generated and uploaded successfully",
      thumbnails,
      processing: {
        time: `${processingTime}ms`,
        timestamp: new Date().toISOString(),
        totalThumbnails: thumbnailResults.length
      }
    };

  } catch (err: any) {
    console.error("❌ Thumbnail generation failed:", err);
    
    // Clean up any temporary files
    if (tempImageFile) {
      await cleanupTempFiles([tempImageFile]).catch(() => {});
    }

    return {
      success: false,
      message: "Failed to generate thumbnails",
      thumbnails: {},
      processing: {
        time: `${Date.now() - startTime}ms`,
        timestamp: new Date().toISOString(),
        totalThumbnails: 0
      },
      error: err.message || 'Unknown error occurred'
    };
  }
};
