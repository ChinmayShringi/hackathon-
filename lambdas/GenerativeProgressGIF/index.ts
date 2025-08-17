import { config } from 'dotenv';
import { join } from 'path';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import { promisify } from "util";
import type { GenerativeProgressGIFRequest } from "./types";
import { 
  downloadGIFToTemp, 
  createFrozenRevealGIF, 
  cleanupTempFiles 
} from "./gif-utils";

// Load environment variables from root .env file
config({ path: join(process.cwd(), '../../.env') });

// Use AWS_DELULA credentials if available, otherwise fall back to default
const s3Config: any = {};
if (process.env.AWS_DELULA_ACCESS_KEY && process.env.AWS_DELULA_SECRET_ACCESS_KEY) {
  s3Config.credentials = {
    accessKeyId: process.env.AWS_DELULA_ACCESS_KEY,
    secretAccessKey: process.env.AWS_DELULA_SECRET_ACCESS_KEY
  };
  console.log("🔑 Using AWS_DELULA credentials for S3");
} else {
  console.log("⚠️  Using default AWS credentials for S3");
}

const s3 = new S3Client(s3Config);
const readFile = promisify(fs.readFile);

export const handler = async (event: GenerativeProgressGIFRequest) => {
  const { remote_url, bucket, key, reveal_duration_ms = 10000, color_count = 16 } = event;
  let tempInputFile: string | null = null;
  let tempOutputFile: string | null = null;

  if (!remote_url || !bucket || !key) {
    return { statusCode: 400, body: "Missing required fields." };
  }

  // Validate reveal duration parameter
  if (reveal_duration_ms && (reveal_duration_ms < 1000 || reveal_duration_ms > 30000)) {
    return { 
      statusCode: 400, 
      body: "Invalid reveal_duration_ms. Must be between 1000 and 30000 milliseconds." 
    };
  }

  // Validate color count parameter
  if (color_count && (color_count < 8 || color_count > 32)) {
    return { 
      statusCode: 400, 
      body: "Invalid color_count. Must be between 8 and 32 colors." 
    };
  }

  try {
    console.log("🎬 Starting generative progress GIF creation...");
    console.log(`📹 GIF URL: ${remote_url}`);
    console.log(`🪣 S3 Bucket: ${bucket}`);
    console.log(`🔑 S3 Key: ${key}`);
    console.log(`⏱️  Reveal duration: ${reveal_duration_ms}ms`);
    console.log(`🎨 Color count: ${color_count}`);

    // Step 1: Download input GIF to temporary file
    console.log("⬇️  Downloading input GIF...");
    tempInputFile = await downloadGIFToTemp(remote_url);
    console.log(`✅ Input GIF downloaded to: ${tempInputFile}`);

    // Step 2: Create frozen reveal GIF
    tempOutputFile = `/tmp/progress-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.gif`;
    console.log("🔄 Creating frozen reveal GIF...");
    
    const processingResult = await createFrozenRevealGIF(
      tempInputFile, 
      tempOutputFile, 
      reveal_duration_ms, 
      color_count
    );
    
    if (!processingResult.success) {
      throw new Error(processingResult.error || 'GIF processing failed');
    }
    
    console.log("✅ Frozen reveal GIF creation completed!");
    console.log(`📊 Frame count: ${processingResult.frameCount}`);
    console.log(`⏱️  Total duration: ${processingResult.totalDuration?.toFixed(2)}s`);
    console.log(`⏱️  Processing time: ${processingResult.processingTime}ms`);

    // Step 3: Upload result GIF to S3
    console.log("☁️  Uploading result GIF to S3...");
    const gifBuffer = await readFile(tempOutputFile);
    
    await s3.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: gifBuffer,
      ContentType: 'image/gif',
      ContentLength: gifBuffer.length,
      CacheControl: 'public, max-age=31536000' // 1 year cache
    }));

    console.log("✅ Result GIF uploaded to S3 successfully!");

    // Step 4: Clean up temporary files
    const tempFiles = [tempInputFile, tempOutputFile].filter(Boolean) as string[];
    await cleanupTempFiles(tempFiles);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Generative progress GIF created and uploaded successfully",
        s3Location: `s3://${bucket}/${key}`,
        processing: {
          revealDurationMs: reveal_duration_ms,
          colorCount: color_count,
          frameCount: processingResult.frameCount,
          totalDuration: processingResult.totalDuration,
          processingTime: `${processingResult.processingTime}ms`,
          timestamp: new Date().toISOString()
        }
      })
    };

  } catch (err: any) {
    console.error("❌ Error in generative progress GIF creation:", err);
    
    // Clean up temporary files on error
    const tempFiles = [tempInputFile, tempOutputFile].filter(Boolean) as string[];
    await cleanupTempFiles(tempFiles);

    return { 
      statusCode: 500, 
      body: JSON.stringify({
        success: false,
        error: "Generative progress GIF creation failed",
        details: err.message
      })
    };
  }
}; 