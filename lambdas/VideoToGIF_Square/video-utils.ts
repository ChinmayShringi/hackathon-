import https from "https";
import { Readable } from "stream";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { exec } from "child_process";
import type { VideoMetadata, ConversionResult } from "./types";

// Get ffmpeg and ffprobe paths from Lambda layer
let ffmpegPath: string;
let ffprobePath: string;

// Try public layer paths first, then fallback
try {
  // Check if public layer binaries exist
  if (fs.existsSync('/opt/bin/ffmpeg') && fs.existsSync('/opt/bin/ffprobe')) {
    ffmpegPath = '/opt/bin/ffmpeg';
    ffprobePath = '/opt/bin/ffprobe';
  } else {
    // Fallback to local binaries for development
    ffmpegPath = '/usr/bin/ffmpeg';
    ffprobePath = '/usr/bin/ffprobe';
  }
} catch (error) {
  // Fallback to local binaries for development
  ffmpegPath = '/usr/bin/ffmpeg';
  ffprobePath = '/usr/bin/ffprobe';
}

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const stat = promisify(fs.stat);
const execAsync = promisify(exec);

// Supported video formats
const SUPPORTED_FORMATS = ['.mp4', '.webm', '.avi', '.mov', '.mkv', '.flv', '.wmv'];

export function validateVideoUrl(url: string): boolean {
  const urlLower = url.toLowerCase();
  return SUPPORTED_FORMATS.some(format => urlLower.includes(format)) || 
         urlLower.includes('video/');
}

export function getStreamFromUrl(url: string): Promise<Readable> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Bad status: ${res.statusCode}`));
      }
      resolve(res);
    }).on("error", reject);
  });
}

export async function downloadVideoToTemp(url: string): Promise<string> {
  const stream = await getStreamFromUrl(url);
  const tempFile = `/tmp/video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.mp4`;
  
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  
  const buffer = Buffer.concat(chunks);
  await writeFile(tempFile, buffer);
  
  return tempFile;
}

export async function getVideoMetadata(inputPath: string): Promise<VideoMetadata> {
  try {
    const { stdout } = await execAsync(`${ffprobePath} -v quiet -print_format json -show_format -show_streams "${inputPath}"`);
    const metadata = JSON.parse(stdout);
    
    const videoStream = metadata.streams.find((s: any) => s.codec_type === 'video');
    if (!videoStream) {
      throw new Error('No video stream found');
    }
    
    return {
      width: videoStream.width || 0,
      height: videoStream.height || 0,
      duration: metadata.format.duration || 0,
      format: metadata.format.format_name || 'unknown'
    };
  } catch (error) {
    throw new Error(`Failed to get video metadata: ${error}`);
  }
}

export async function cropToSquare(inputPath: string, outputPath: string, squareSize: number): Promise<string> {
  try {
    const metadata = await getVideoMetadata(inputPath);
    
    // Calculate crop dimensions for center square
    const cropSize = Math.min(metadata.width, metadata.height);
    const x = Math.floor((metadata.width - cropSize) / 2);
    const y = Math.floor((metadata.height - cropSize) / 2);
    
    console.log(`Original: ${metadata.width}x${metadata.height}, Crop: ${cropSize}x${cropSize}, Position: ${x},${y}`);
    
    const cropFilter = `crop=${cropSize}:${cropSize}:${x}:${y}`;
    const scaleFilter = `scale=${squareSize}:${squareSize}`;
    const filter = `${cropFilter},${scaleFilter}`;
    
    const command = `${ffmpegPath} -i "${inputPath}" -vf "${filter}" -y "${outputPath}"`;
    console.log("Cropping and resizing:", command);
    
    await execAsync(command);
    console.log("Crop and resize completed:", outputPath);
    return outputPath;
  } catch (error) {
    throw new Error(`Crop and resize failed: ${error}`);
  }
}

export async function videoToCompressedGif(inputPath: string, outputPath: string, dimension: number): Promise<string> {
  const paletteFile = '/tmp/temp-palette.png';
  
  try {
    console.log("Step 1: Generating optimized palette...");
    
    // Step 1: Generate palette with reduced colors and duration
    const paletteCommand = `${ffmpegPath} -i "${inputPath}" -vf "fps=15,scale=${dimension}:${dimension}:flags=fast_bilinear,palettegen=max_colors=48:reserve_transparent=0" -t 4 -y "${paletteFile}"`;
    console.log("Palette generation:", paletteCommand);
    await execAsync(paletteCommand);
    
    console.log("Step 2: Converting to compressed GIF...");
    
    // Step 2: Create GIF with high compression settings
    const gifCommand = `${ffmpegPath} -i "${inputPath}" -i "${paletteFile}" -filter_complex "fps=15,scale=${dimension}:${dimension}:flags=fast_bilinear[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle" -t 4 -loop 0 -compression_level 100 -y "${outputPath}"`;
    console.log("GIF creation:", gifCommand);
    await execAsync(gifCommand);
    
    // Clean up palette file
    try {
      await unlink(paletteFile);
      console.log("Palette file cleaned up");
    } catch (err) {
      console.log("Warning: Could not clean up palette file");
    }
    
    console.log("GIF conversion completed:", outputPath);
    return outputPath;
  } catch (error) {
    // Clean up palette file on error
    try {
      await unlink(paletteFile);
    } catch (cleanupErr) {
      // Ignore cleanup errors
    }
    throw new Error(`GIF conversion failed: ${error}`);
  }
}

export async function convertVideoToGif(inputPath: string, outputPath: string, dimension: number): Promise<ConversionResult> {
  const startTime = Date.now();
  
  try {
    // Get input file size
    const inputStats = await stat(inputPath);
    const inputSize = inputStats.size;
    
    // Step 1: Crop to square and resize
    const croppedFile = `/tmp/cropped-${Date.now()}.mp4`;
    await cropToSquare(inputPath, croppedFile, dimension);
    
    // Step 2: Convert to GIF
    await videoToCompressedGif(croppedFile, outputPath, dimension);
    
    // Get output file size
    const outputStats = await stat(outputPath);
    const outputSize = outputStats.size;
    
    // Calculate compression ratio
    const compressionRatio = ((inputSize - outputSize) / inputSize) * 100;
    
    // Clean up intermediate file
    try {
      await unlink(croppedFile);
    } catch (err) {
      console.log("Warning: Could not clean up cropped file");
    }
    
    const processingTime = Date.now() - startTime;
    
    return {
      success: true,
      outputPath,
      fileSize: outputSize,
      duration: processingTime,
      dimension,
      inputSize,
      outputSize,
      compressionRatio,
      processingTime
    };
  } catch (error) {
    const processingTime = Date.now() - startTime;
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      duration: processingTime,
      inputSize: 0,
      outputSize: 0,
      compressionRatio: 0,
      processingTime
    };
  }
}

export async function cleanupTempFiles(files: string[]): Promise<void> {
  for (const file of files) {
    try {
      await unlink(file);
      console.log(`Cleaned up: ${file}`);
    } catch (error) {
      console.log(`Warning: Could not clean up ${file}: ${error}`);
    }
  }
} 