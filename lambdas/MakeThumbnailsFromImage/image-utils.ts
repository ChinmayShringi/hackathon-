import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import type { ImageMetadata } from "./types";

const execAsync = promisify(exec);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

interface ThumbnailGenerationResult {
  size: number;
  width: number;
  height: number;
  tempPath: string;
}

/**
 * Download image from URL to temporary file
 */
export async function downloadImageToTemp(imageUrl: string): Promise<string> {
  const tempFile = `/tmp/image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
  
  try {
    // Use curl to download the image
    const { stdout, stderr } = await execAsync(`curl -L -o "${tempFile}" "${imageUrl}"`);
    
    if (stderr && !stderr.includes('curl: (23)')) {
      console.warn('curl stderr:', stderr);
    }
    
    // Verify file was downloaded and has content
    const stats = fs.statSync(tempFile);
    if (stats.size === 0) {
      throw new Error('Downloaded file is empty');
    }
    
    return tempFile;
  } catch (error) {
    throw new Error(`Failed to download image: ${error}`);
  }
}

/**
 * Get image metadata using ImageMagick identify command
 */
export async function getImageMetadata(imagePath: string): Promise<ImageMetadata> {
  try {
    const { stdout } = await execAsync(`identify -format "%w %h %m %b" "${imagePath}"`);
    const [width, height, format, size] = stdout.trim().split(' ');
    
    return {
      width: parseInt(width),
      height: parseInt(height),
      format: format.toLowerCase(),
      size: parseInt(size),
      aspectRatio: parseInt(width) / parseInt(height)
    };
  } catch (error) {
    throw new Error(`Failed to get image metadata: ${error}`);
  }
}

/**
 * Calculate thumbnail dimensions maintaining aspect ratio
 * Anchors to the smallest dimension as specified
 */
function calculateThumbnailDimensions(originalWidth: number, originalHeight: number, targetSize: number) {
  const isLandscape = originalWidth > originalHeight;
  const anchorDimension = isLandscape ? originalHeight : originalWidth;
  const reductionFactor = anchorDimension / targetSize;
  
  return {
    width: Math.round(originalWidth / reductionFactor),
    height: Math.round(originalHeight / reductionFactor)
  };
}

/**
 * Generate thumbnails for all specified sizes
 */
export async function generateThumbnails(
  imagePath: string, 
  sizes: number[], 
  metadata: ImageMetadata
): Promise<ThumbnailGenerationResult[]> {
  const results: ThumbnailGenerationResult[] = [];
  
  // Generate thumbnails in parallel for better performance
  const thumbnailPromises = sizes.map(async (size) => {
    const { width, height } = calculateThumbnailDimensions(metadata.width, metadata.height, size);
    const tempPath = `/tmp/thumb-${size}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.webp`;
    
    try {
      // Use ImageMagick convert command to generate WebP thumbnail
      const convertCommand = `convert "${imagePath}" -resize ${width}x${height} -quality 85 -define webp:lossless=false "${tempPath}"`;
      
      await execAsync(convertCommand);
      
      // Verify thumbnail was created
      const stats = fs.statSync(tempPath);
      if (stats.size === 0) {
        throw new Error(`Generated thumbnail for size ${size} is empty`);
      }
      
      results.push({
        size,
        width,
        height,
        tempPath
      });
      
      console.log(`✅ Generated ${size}px thumbnail: ${width}x${height}`);
      
    } catch (error) {
      console.error(`❌ Failed to generate ${size}px thumbnail:`, error);
      throw error;
    }
  });
  
  await Promise.all(thumbnailPromises);
  return results;
}

/**
 * Clean up temporary files
 */
export async function cleanupTempFiles(filePaths: string[]): Promise<void> {
  const cleanupPromises = filePaths.map(async (filePath) => {
    try {
      if (fs.existsSync(filePath)) {
        await unlink(filePath);
        console.log(`🗑️  Cleaned up: ${filePath}`);
      }
    } catch (error) {
      console.warn(`⚠️  Failed to clean up ${filePath}:`, error);
    }
  });
  
  await Promise.all(cleanupPromises);
}
