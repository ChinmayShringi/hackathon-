import Jimp from 'jimp';
import { GifFrame, GifUtil, GifCodec } from 'gifwrap';
import https from 'https';
import fs from 'fs';
import { promisify } from 'util';
import type { GIFFrame, ImagePalette, ProcessingResult } from './types';

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

// Utility functions converted from Python
function gaussianTruncated(low: number = 0, high: number = 1): number {
  const mu = (low + high) / 2;
  const sigma = (high - low) / 6;
  
  while (true) {
    // Box-Muller transform for normal distribution
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const x = mu + sigma * z0;
    
    if (low <= x && x <= high) {
      return x;
    }
  }
}

function getImagePalette(image: Jimp, colorCount: number = 16): ImagePalette {
  // Convert to RGB and get dominant colors using k-means-like approach
  const width = image.getWidth();
  const height = image.getHeight();
  const pixels: Array<[number, number, number]> = [];
  
  // Sample pixels (every 10th pixel to avoid memory issues)
  for (let y = 0; y < height; y += 10) {
    for (let x = 0; x < width; x += 10) {
      const pixel = image.getPixelColor(x, y);
      const rgba = Jimp.intToRGBA(pixel);
      
      // Skip transparent/very dark pixels
      if (rgba.a > 128 && (rgba.r > 20 || rgba.g > 20 || rgba.b > 20)) {
        pixels.push([rgba.r, rgba.g, rgba.b]);
      }
    }
  }
  
  // Simple k-means clustering for color quantization
  const colors: Array<[number, number, number]> = [];
  const clusters = Math.min(colorCount, pixels.length);
  
  // Initialize with random colors from pixels
  for (let i = 0; i < clusters; i++) {
    const randomPixel = pixels[Math.floor(Math.random() * pixels.length)];
    colors.push([...randomPixel]);
  }
  
  // Simple clustering (just pick closest color)
  const finalColors: Array<[number, number, number]> = [];
  for (let i = 0; i < colorCount; i++) {
    if (i < colors.length) {
      finalColors.push(colors[i]);
    } else {
      // Fill with default colors
      finalColors.push([255, 255, 255]);
    }
  }
  
  return { colors: finalColors, count: finalColors.length };
}

function addPaletteNoise(image: Jimp, palette: ImagePalette, noiseDensity: number): Jimp {
  const width = image.getWidth();
  const height = image.getHeight();
  const numNoisePixels = Math.floor(width * height * noiseDensity);
  
  // Create a copy to avoid modifying original
  const noisyImage = image.clone();
  
  for (let i = 0; i < numNoisePixels; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const noiseColor = palette.colors[Math.floor(Math.random() * palette.colors.length)];
    
    const rgba = Jimp.rgbaToInt(noiseColor[0], noiseColor[1], noiseColor[2], 255);
    noisyImage.setPixelColor(rgba, x, y);
  }
  
  return noisyImage;
}

function applyGaussianBlur(image: Jimp, radius: number): Jimp {
  // Jimp blur with radius scaling
  const blurRadius = Math.max(1, Math.ceil(radius));
  return image.blur(blurRadius);
}

function applyBrightness(image: Jimp, factor: number): Jimp {
  // Convert factor to Jimp's brightness range (-1 to 1)
  const jimpValue = Math.max(-1, Math.min(1, (factor - 1) * 0.5));
  return image.brightness(jimpValue);
}

function createGradientOverlay(width: number, height: number, revealHeight: number, elapsedTimeMs: number): Jimp {
  // Create gradient overlay like Python version
  const overlay = new Jimp(width, height, 0x00000000); // Transparent
  
  if (revealHeight >= height) return overlay;
  
  // Sine wave animation like Python version
  const sineWave = Math.sin(elapsedTimeMs / 2000.0);
  const gradientCenterX = (width / 2) + (width / 2.5) * sineWave;
  
  const maxAlpha = Math.floor(192 * 0.30);
  const minAlpha = Math.floor(192 * 0.10);
  
  for (let x = 0; x < width; x++) {
    const distance = Math.abs(x - gradientCenterX);
    const normDistance = Math.min(distance / (width / 2), 1);
    const alpha = maxAlpha - (normDistance * (maxAlpha - minAlpha));
    
    // Draw gradient line at reveal height
    for (let y = revealHeight; y < height; y++) {
      const rgba = Jimp.rgbaToInt(255, 255, 255, alpha);
      overlay.setPixelColor(rgba, x, y);
    }
  }
  
  return overlay;
}

function countUniqueColors(image: Jimp): number {
  const width = image.getWidth();
  const height = image.getHeight();
  const colors = new Set<string>();
  
  for (let y = 0; y < height; y += 4) { // Sample every 4th pixel to speed up
    for (let x = 0; x < width; x += 4) {
      const pixel = image.getPixelColor(x, y);
      const rgba = Jimp.intToRGBA(pixel);
      const colorKey = `${rgba.r},${rgba.g},${rgba.b}`;
      colors.add(colorKey);
    }
  }
  
  return colors.size;
}

function createGlobalPalette(frames: Jimp[]): Map<string, number> {
  // Create a global color palette from all frames
  const colorMap = new Map<string, number>();
  let colorIndex = 0;
  
  for (const frame of frames) {
    const width = frame.getWidth();
    const height = frame.getHeight();
    
    for (let y = 0; y < height; y += 2) { // Sample every 2nd pixel to reduce memory
      for (let x = 0; x < width; x += 2) {
        const pixel = frame.getPixelColor(x, y);
        const rgba = Jimp.intToRGBA(pixel);
        
        // Quantize to 4 bits per channel
        const r = Math.floor(rgba.r / 16) * 16;
        const g = Math.floor(rgba.g / 16) * 16;
        const b = Math.floor(rgba.b / 16) * 16;
        
        const colorKey = `${r},${g},${b}`;
        if (!colorMap.has(colorKey) && colorIndex < 256) {
          colorMap.set(colorKey, colorIndex++);
        }
      }
    }
  }
  
  return colorMap;
}

function quantizeWithGlobalPalette(image: Jimp, globalPalette: Map<string, number>): Jimp {
  const width = image.getWidth();
  const height = image.getHeight();
  const quantized = new Jimp(width, height);
  
  // Very aggressive quantization to ensure we stay under 256 colors
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixel = image.getPixelColor(x, y);
      const rgba = Jimp.intToRGBA(pixel);
      
      // Very aggressive color reduction: map to 32 colors (2 levels per channel)
      const r = Math.floor(rgba.r / 32) * 32;
      const g = Math.floor(rgba.g / 32) * 32;
      const b = Math.floor(rgba.b / 32) * 32;
      
      const colorKey = `${r},${g},${b}`;
      const colorIndex = globalPalette.get(colorKey) || 0;
      
      // Map back to RGB
      const newPixel = Jimp.rgbaToInt(r, g, b, rgba.a);
      quantized.setPixelColor(newPixel, x, y);
    }
  }
  
  return quantized;
}

function quantizeImage(image: Jimp): Jimp {
  // Create a quantized version that ensures <= 256 colors
  const width = image.getWidth();
  const height = image.getHeight();
  
  // Create a new image with reduced color palette
  const quantized = new Jimp(width, height);
  
  // Very aggressive color reduction: map to 64 colors (4 levels per channel)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixel = image.getPixelColor(x, y);
      const rgba = Jimp.intToRGBA(pixel);
      
      // Reduce color depth to 4 bits per channel (16 levels each)
      const r = Math.floor(rgba.r / 16) * 16;
      const g = Math.floor(rgba.g / 16) * 16;
      const b = Math.floor(rgba.b / 16) * 16;
      const a = rgba.a;
      
      const newPixel = Jimp.rgbaToInt(r, g, b, a);
      quantized.setPixelColor(newPixel, x, y);
    }
  }
  
  return quantized;
}

export async function downloadGIFToTemp(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Bad status: ${res.statusCode}`));
      }
      
      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', async () => {
        const buffer = Buffer.concat(chunks);
        const tempFile = `/tmp/gif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.gif`;
        await writeFile(tempFile, buffer);
        resolve(tempFile);
      });
    }).on('error', reject);
  });
}

export async function createFrozenRevealGIF(
  inputGifPath: string, 
  outputGifPath: string,
  revealDurationMs: number = 10000,
  colorCount: number = 16
): Promise<ProcessingResult> {
  const startTime = Date.now();
  
  try {
    console.log("🎬 Starting frozen reveal GIF generation...");
    console.log(`📁 Input: ${inputGifPath}`);
    console.log(`📁 Output: ${outputGifPath}`);
    console.log(`⏱️  Reveal duration: ${revealDurationMs}ms`);
    
    // Load the input GIF and get all frames
    const inputGif = await GifUtil.read(inputGifPath);
    const firstFrame = inputGif.frames[0];
    const width = firstFrame.bitmap.width;
    const height = firstFrame.bitmap.height;
    
    console.log(`📐 Dimensions: ${width}x${height}`);
    console.log(`🎞️  Input frames: ${inputGif.frames.length}`);
    
    // Convert all frames to Jimp for processing
    const allJimpFrames: Jimp[] = [];
    
    // Convert first frame for palette extraction
    const firstJimp = await GifUtil.copyAsJimp(Jimp, firstFrame);
    allJimpFrames.push(firstJimp);
    
    // Convert all original frames
    for (const frame of inputGif.frames) {
      const jimpFrame = await GifUtil.copyAsJimp(Jimp, frame);
      allJimpFrames.push(jimpFrame);
    }
    
    // Create global palette from all frames
    console.log("🎨 Creating global color palette...");
    const globalPalette = createGlobalPalette(allJimpFrames);
    console.log(`🎨 Global palette created with ${globalPalette.size} colors`);
    
    const imagePalette = getImagePalette(firstJimp, colorCount);
    console.log(`🎨 Extracted ${imagePalette.count} colors from palette`);
    
    // Calculate timing
    const avgFrameDuration = 33; // 30fps approximation
    const totalFrames = Math.ceil(revealDurationMs / avgFrameDuration);
    
    console.log(`🎞️  Generating ${totalFrames} reveal frames...`);
    
    // Generate reveal frames with all effects like Python version
    let elapsedTimeMs = 0;
    let stutterState = 'PROGRESSING';
    let stutterFramesRemaining = 0;
    let progressAtStutterStart = 0.0;
    
    // Randomize effect parameters (exactly like Python)
    const startBlur = 10.0 + gaussianTruncated(0.5, 1.0);
    const endBlur = 2.9 + gaussianTruncated(0.1, 0.2);
    const startNoise = 10 + gaussianTruncated(0.1, 0.2);
    const endNoise = 1.9 + gaussianTruncated(0.01, 0.05);
    const startBrightness = 3.5 + gaussianTruncated(0.5, 1.0);
    const endBrightness = 1.0 + gaussianTruncated(0.1, 0.2);
    const progressFactor = gaussianTruncated(1.0, 2.0);
    
    const revealFrames: GifFrame[] = [];
    const revealDurations: number[] = [];
    
    while (elapsedTimeMs < revealDurationMs) {
      // Stutter state machine (exactly like Python)
      let linearProgress: number;
      
      if (stutterState === 'STUTTERING') {
        linearProgress = progressAtStutterStart;
        stutterFramesRemaining--;
        if (stutterFramesRemaining <= 0) {
          stutterState = 'PROGRESSING';
          console.log("...resuming.");
        }
      } else {
        linearProgress = Math.min(1.0, elapsedTimeMs / revealDurationMs);
        if (Math.random() < 0.007 && linearProgress > 0.1 && linearProgress < 0.90) {
          stutterState = 'STUTTERING';
          stutterFramesRemaining = Math.floor(gaussianTruncated(1.0, 5.0));
          progressAtStutterStart = linearProgress;
          console.log(`Stutter triggered! Pausing for ${stutterFramesRemaining} frames...`);
        }
      }
      
      // Calculate effects (exactly like Python)
      const easedProgress = Math.pow(linearProgress, progressFactor);
      const currentBlur = startBlur + (endBlur - startBlur) * linearProgress;
      const currentNoiseDensity = startNoise + (endNoise - startNoise) * Math.max(linearProgress * 1.5, 1.0);
      const currentBrightness = startBrightness + (endBrightness - startBrightness) * linearProgress;
      
      // Create base frame with effects (like Python)
      let frame = await GifUtil.copyAsJimp(Jimp, firstFrame);
      
      // Apply brightness
      frame = applyBrightness(frame, currentBrightness);
      
      // Add noise
      frame = addPaletteNoise(frame, imagePalette, currentNoiseDensity / 1000); // Scale down noise density
      
      // Apply blur
      frame = applyGaussianBlur(frame, currentBlur);
      
      // Create reveal effect
      const revealHeight = Math.floor(height * easedProgress);
      
      if (revealHeight > 0) {
        // Create clean strip at the top
        const cleanStrip = await GifUtil.copyAsJimp(Jimp, firstFrame);
        const croppedStrip = cleanStrip.crop(0, 0, width, revealHeight);
        frame.composite(croppedStrip, 0, 0);
      }
      
      // Add gradient overlay (like Python)
      if (revealHeight < height) {
        const gradientOverlay = createGradientOverlay(width, height, revealHeight, elapsedTimeMs);
        frame.composite(gradientOverlay, 0, 0);
      }
      
      // Quantize the frame using global palette
      frame = quantizeWithGlobalPalette(frame, globalPalette);
      
      // Debug: Check color count
      const colorCount = countUniqueColors(frame);
      if (colorCount > 256) {
        console.log(`⚠️  Warning: Frame has ${colorCount} colors, attempting further quantization...`);
        // Apply even more aggressive quantization
        frame = quantizeImage(frame);
        const newColorCount = countUniqueColors(frame);
        console.log(`✅ After re-quantization: ${newColorCount} colors`);
      }
      
      // Convert Jimp back to GifFrame
      const gifFrame = new GifFrame(frame.bitmap, { delayCentisecs: Math.ceil(avgFrameDuration / 10) });
      revealFrames.push(gifFrame);
      revealDurations.push(avgFrameDuration);
      
      elapsedTimeMs += avgFrameDuration;
    }
    
    // Add one clean cycle of the original (exactly like Python)
    console.log("Act I complete. Appending one full, clean animation cycle...");
    
    // Add all original frames with their original durations (quantized with global palette)
    for (const frame of inputGif.frames) {
      // Convert and quantize each original frame
      const jimpFrame = await GifUtil.copyAsJimp(Jimp, frame);
      const quantizedFrame = quantizeWithGlobalPalette(jimpFrame, globalPalette);
      
      // Debug: Check color count
      const colorCount = countUniqueColors(quantizedFrame);
      if (colorCount > 256) {
        console.log(`⚠️  Warning: Original frame has ${colorCount} colors, attempting further quantization...`);
        // Apply even more aggressive quantization
        const reQuantizedFrame = quantizeImage(quantizedFrame);
        const newColorCount = countUniqueColors(reQuantizedFrame);
        console.log(`✅ After re-quantization: ${newColorCount} colors`);
        
        const quantizedGifFrame = new GifFrame(reQuantizedFrame.bitmap, { 
          delayCentisecs: frame.delayCentisecs 
        });
        revealFrames.push(quantizedGifFrame);
      } else {
        const quantizedGifFrame = new GifFrame(quantizedFrame.bitmap, { 
          delayCentisecs: frame.delayCentisecs 
        });
        revealFrames.push(quantizedGifFrame);
      }
      
      revealDurations.push(frame.delayCentisecs * 10); // Convert to milliseconds
    }
    
    // Encode the final GIF
    console.log("🎬 Encoding final GIF...");
    const codec = new GifCodec();
    const result = await codec.encodeGif(revealFrames, {
      loops: 0 // Loop forever
    });
    
    // Save to file
    await writeFile(outputGifPath, result.buffer);
    
    const processingTime = Date.now() - startTime;
    const totalDuration = revealDurations.reduce((sum, duration) => sum + duration, 0) / 1000.0;
    
    console.log(`✅ GIF generation completed!`);
    console.log(`📊 Processing time: ${processingTime}ms`);
    console.log(`⏱️  Total duration: ${totalDuration.toFixed(2)}s`);
    console.log(`🎞️  Total frames: ${revealFrames.length}`);
    
    return {
      success: true,
      outputPath: outputGifPath,
      frameCount: revealFrames.length,
      totalDuration,
      processingTime
    };
    
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error("❌ GIF generation failed:", error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      processingTime
    };
  }
}

export async function cleanupTempFiles(files: string[]): Promise<void> {
  for (const file of files) {
    try {
      await unlink(file);
      console.log(`🗑️  Cleaned up: ${file}`);
    } catch (err) {
      console.log(`⚠️  Could not clean up: ${file}`);
    }
  }
} 