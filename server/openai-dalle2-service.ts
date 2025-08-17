import OpenAI from "openai";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const s3Client = new S3Client({
  region: process.env.AWS_MAGICVIDIO_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_MAGICVIDIO_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_MAGICVIDIO_SECRET_ACCESS_KEY!,
  },
});

const S3_BUCKET = "avbxp-public";
const S3_PREFIX = "magicvidio";
const CDN_BASE_URL = "https://avbxp-public.s3.us-east-1.amazonaws.com/magicvidio";

export interface DALLE2GenerationOptions {
  prompt: string;
  n?: number; // 1-10 images
  size?: "256x256" | "512x512" | "1024x1024";
  response_format?: "url" | "b64_json";
}

export interface DALLE2EditOptions {
  imageBase64: string; // Original image as base64
  maskBase64?: string; // Mask for inpainting as base64
  prompt: string;
  n?: number;
  size?: "256x256" | "512x512" | "1024x1024";
  response_format?: "url" | "b64_json";
}

export interface DALLE2VariationOptions {
  imageBase64: string; // Input image as base64
  n?: number;
  size?: "256x256" | "512x512" | "1024x1024";
  response_format?: "url" | "b64_json";
}

export interface DALLE2Result {
  images: Array<{
    url: string;
    s3Key: string;
    assetId: string;
  }>;
  metadata: {
    model: string;
    prompt?: string;
    size: string;
    count: number;
    operation: "generation" | "edit" | "variation";
  };
}

function generateAssetId(length: number = 12): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function downloadAndUploadToS3(imageUrl: string, assetId: string): Promise<string> {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }
  
  const imageBuffer = Buffer.from(await response.arrayBuffer());
  const s3Key = `${S3_PREFIX}/${assetId}.png`;
  
  const uploadCommand = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: s3Key,
    Body: imageBuffer,
    ContentType: 'image/png',
    ACL: 'public-read'
  });
  
  await s3Client.send(uploadCommand);
  return s3Key;
}

async function uploadBase64ToS3(imageBase64: string, assetId: string): Promise<string> {
  const imageBuffer = Buffer.from(imageBase64, 'base64');
  const s3Key = `${S3_PREFIX}/${assetId}.png`;
  
  const uploadCommand = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: s3Key,
    Body: imageBuffer,
    ContentType: 'image/png',
    ACL: 'public-read'
  });
  
  await s3Client.send(uploadCommand);
  return s3Key;
}

export class DALLE2Service {
  /**
   * Generate images using DALL-E 2
   */
  async generateImage(options: DALLE2GenerationOptions): Promise<DALLE2Result> {
    const {
      prompt,
      n = 1,
      size = "1024x1024",
      response_format = "url"
    } = options;

    console.log(`Generating DALL-E 2 image: ${prompt.substring(0, 100)}...`);

    try {
      const response = await openai.images.generate({
        model: "dall-e-2",
        prompt,
        n,
        size,
        response_format
      });

      if (!response.data || response.data.length === 0) {
        throw new Error("No image data returned from OpenAI");
      }

      const results = [];
      for (const imageData of response.data) {
        const assetId = generateAssetId();
        let s3Key: string;

        if (response_format === "b64_json" && imageData.b64_json) {
          s3Key = await uploadBase64ToS3(imageData.b64_json, assetId);
        } else if (imageData.url) {
          s3Key = await downloadAndUploadToS3(imageData.url, assetId);
        } else {
          throw new Error("No image data received");
        }

        const imageUrl = `${CDN_BASE_URL}/${assetId}.png`;
        results.push({ url: imageUrl, s3Key, assetId });
      }

      return {
        images: results,
        metadata: {
          model: "dall-e-2",
          prompt,
          size,
          count: n,
          operation: "generation"
        }
      };

    } catch (error: any) {
      console.error("DALL-E 2 generation error:", error);
      throw new Error(`Image generation failed: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Edit images using DALL-E 2 (inpainting)
   */
  async editImage(options: DALLE2EditOptions): Promise<DALLE2Result> {
    const {
      imageBase64,
      maskBase64,
      prompt,
      n = 1,
      size = "1024x1024",
      response_format = "url"
    } = options;

    console.log(`Editing DALL-E 2 image: ${prompt.substring(0, 100)}...`);

    try {
      // Convert base64 to Buffer for OpenAI API
      const imageBuffer = Buffer.from(imageBase64, 'base64');
      const maskBuffer = maskBase64 ? Buffer.from(maskBase64, 'base64') : undefined;

      const response = await openai.images.edit({
        model: "dall-e-2",
        image: imageBuffer as any,
        mask: maskBuffer as any,
        prompt,
        n,
        size,
        response_format
      });

      if (!response.data || response.data.length === 0) {
        throw new Error("No image data returned from OpenAI");
      }

      const results = [];
      for (const imageData of response.data) {
        const assetId = generateAssetId();
        let s3Key: string;

        if (response_format === "b64_json" && imageData.b64_json) {
          s3Key = await uploadBase64ToS3(imageData.b64_json, assetId);
        } else if (imageData.url) {
          s3Key = await downloadAndUploadToS3(imageData.url, assetId);
        } else {
          throw new Error("No image data received");
        }

        const imageUrl = `${CDN_BASE_URL}/${assetId}.png`;
        results.push({ url: imageUrl, s3Key, assetId });
      }

      return {
        images: results,
        metadata: {
          model: "dall-e-2",
          prompt,
          size,
          count: n,
          operation: "edit"
        }
      };

    } catch (error: any) {
      console.error("DALL-E 2 edit error:", error);
      throw new Error(`Image editing failed: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Create variations of an image using DALL-E 2
   */
  async createVariations(options: DALLE2VariationOptions): Promise<DALLE2Result> {
    const {
      imageBase64,
      n = 1,
      size = "1024x1024",
      response_format = "url"
    } = options;

    console.log(`Creating DALL-E 2 variations...`);

    try {
      // Convert base64 to Buffer for OpenAI API
      const imageBuffer = Buffer.from(imageBase64, 'base64');

      const response = await openai.images.createVariation({
        model: "dall-e-2",
        image: imageBuffer as any,
        n,
        size,
        response_format
      });

      if (!response.data) {
        throw new Error("No image data returned from OpenAI");
      }

      const results = [];
      for (const imageData of response.data) {
        const assetId = generateAssetId();
        let s3Key: string;

        if (response_format === "b64_json" && imageData.b64_json) {
          s3Key = await uploadBase64ToS3(imageData.b64_json, assetId);
        } else if (imageData.url) {
          s3Key = await downloadAndUploadToS3(imageData.url, assetId);
        } else {
          throw new Error("No image data received");
        }

        const imageUrl = `${CDN_BASE_URL}/${assetId}.png`;
        results.push({ url: imageUrl, s3Key, assetId });
      }

      return {
        images: results,
        metadata: {
          model: "dall-e-2",
          size,
          count: n,
          operation: "variation"
        }
      };

    } catch (error: any) {
      console.error("DALL-E 2 variation error:", error);
      throw new Error(`Image variation failed: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Calculate credit cost for DALL-E 2
   */
  calculateCreditCost(operation: "generation" | "edit" | "variation", options: {
    size: string;
    count: number;
  }): number {
    const { size, count } = options;
    
    // Base costs per image
    const baseCosts: Record<string, number> = {
      "256x256": 1,
      "512x512": 2,
      "1024x1024": 3
    };

    const baseCredits = baseCosts[size] || 3;
    
    // Editing and variations cost slightly more
    const multiplier = operation === "generation" ? 1 : 1.2;
    
    return Math.ceil(baseCredits * count * multiplier);
  }

  /**
   * Validate request options
   */
  validateRequest(options: DALLE2GenerationOptions | DALLE2EditOptions | DALLE2VariationOptions): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if ('prompt' in options) {
      if (!options.prompt || options.prompt.trim().length === 0) {
        errors.push("Prompt is required");
      }
      if (options.prompt && options.prompt.length > 1000) {
        errors.push("Prompt must be 1000 characters or less for DALL-E 2");
      }
    }

    if (options.n && (options.n < 1 || options.n > 10)) {
      errors.push("Number of images must be between 1-10");
    }

    const validSizes = ["256x256", "512x512", "1024x1024"];
    if (options.size && !validSizes.includes(options.size)) {
      errors.push("Invalid size for DALL-E 2");
    }

    const validFormats = ["url", "b64_json"];
    if (options.response_format && !validFormats.includes(options.response_format)) {
      errors.push("Invalid response format");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get optimal settings for different use cases
   */
  getOptimalSettings(useCase: string): Partial<DALLE2GenerationOptions> {
    switch (useCase.toLowerCase()) {
      case "fast":
        return { size: "256x256", n: 1 };
      case "quality":
        return { size: "1024x1024", n: 1 };
      case "batch":
        return { size: "512x512", n: 4 };
      case "variations":
        return { size: "512x512", n: 3 };
      default:
        return { size: "512x512", n: 1 };
    }
  }
}

export const dalle2Service = new DALLE2Service();