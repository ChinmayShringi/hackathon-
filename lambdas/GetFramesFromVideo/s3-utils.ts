import AWS from 'aws-sdk';
import fs from 'fs';
import { promisify } from 'util';
import type { S3UploadResult } from './types';

const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

// Initialize S3 client
const s3 = new AWS.S3();

export async function uploadFrameToS3(
  localFilePath: string,
  bucket: string,
  key: string
): Promise<S3UploadResult> {
  try {
    const fileBuffer = await readFile(localFilePath);
    
    const uploadParams = {
      Bucket: bucket,
      Key: key,
      Body: fileBuffer,
      ContentType: 'image/png'
      // Removed ACL as bucket doesn't allow it
    };
    
    console.log(`Uploading frame to S3: ${bucket}/${key}`);
    const result = await s3.upload(uploadParams).promise();
    
    // Generate S3 URL
    const s3Url = `https://${bucket}.s3.amazonaws.com/${key}`;
    
    return {
      success: true,
      bucket_key: key,
      s3_url: s3Url
    };
  } catch (error) {
    return {
      success: false,
      bucket_key: key,
      s3_url: '',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

export function generateFrameKey(
  outputPrefix: string,
  frameIndex: number,
  uuid: string
): string {
  // Ensure output prefix doesn't start with slash
  const cleanPrefix = outputPrefix.startsWith('/') ? outputPrefix.slice(1) : outputPrefix;
  
  // Generate key like: test/uuid123.png
  return `${cleanPrefix}/${uuid}.png`;
}

export function generateUUID(): string {
  // Simple UUID v4 generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export async function cleanupLocalFrame(localFilePath: string): Promise<void> {
  try {
    await unlink(localFilePath);
    console.log(`Cleaned up local frame: ${localFilePath}`);
  } catch (error) {
    console.log(`Warning: Could not clean up local frame ${localFilePath}: ${error}`);
  }
}
