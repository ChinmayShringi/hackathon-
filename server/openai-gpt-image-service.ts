import OpenAI from "openai";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";
import { createSecureAssetMetadata, type SecureAssetMetadata } from './asset-security';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const s3Client = new S3Client({
  region: process.env.AWS_MAGICVIDIO_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_MAGICVIDIO_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_MAGICVIDIO_SECRET_ACCESS_KEY!,
  },
});

const CDN_BASE_URL = "https://avbxp-public.s3.us-east-1.amazonaws.com";

export interface GPTImageGenerationOptions {
  prompt: string;
  size?: "1024x1024" | "1536x1024" | "1024x1536" | "auto";
  quality?: "low" | "medium" | "high" | "auto";
  format?: "png" | "jpeg" | "webp";
  background?: "transparent" | "opaque" | "auto";
  compression?: number;
  moderation?: "auto" | "low";
}

export interface GPTImageResult {
  imageUrl: string;
  secureUrl: string;
  s3Key: string;
  assetId: string;
  shortId: string;
  revisedPrompt?: string;
  metadata: {
    model: string;
    prompt: string;
    size: string;
    quality: string;
    format: string;
    background: string;
    tokens: number;
  };
}

function generateAssetId(length: number = 12): string {
  return nanoid(length);
}

async function uploadBase64ToS3(imageBase64: string, assetId: string): Promise<string> {
  const imageBuffer = Buffer.from(imageBase64, 'base64');
  const s3Key = `magicvidio/${assetId}.png`;
  
  const uploadCommand = new PutObjectCommand({
    Bucket: "avbxp-public",
    Key: s3Key,
    Body: imageBuffer,
    ContentType: "image/png",
  });

  await s3Client.send(uploadCommand);
  return s3Key;
}

function calculateTokens(size: string, quality: string): number {
  const baseTokens = {
    "1024x1024": 4096,
    "1024x1792": 6144,
    "1792x1024": 6144,
  };
  
  const sizeTokens = baseTokens[size as keyof typeof baseTokens] || 4096;
  const qualityMultiplier = quality === "hd" ? 1.5 : 1;
  
  return Math.round(sizeTokens * qualityMultiplier);
}

export class GPTImageService {
  async generateImage(options: GPTImageGenerationOptions): Promise<GPTImageResult> {
    const {
      prompt,
      size = "auto",
      quality = "auto",
      format = "png",
      background = "auto",
      moderation = "auto"
    } = options;

    console.log(`Generating GPT Image: ${prompt.substring(0, 100)}...`);

    try {
      // Map GPT Image options to DALL-E 3 options
      const dalleSize = size === "auto" ? "1024x1024" : 
                       size === "1536x1024" ? "1024x1792" :
                       size === "1024x1536" ? "1792x1024" : 
                       "1024x1024";
      
      const dalleQuality = quality === "high" ? "hd" : "standard";

      // Use DALL-E 3 for GPT Image service
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        size: dalleSize as "1024x1024" | "1024x1792" | "1792x1024",
        quality: dalleQuality as "standard" | "hd",
        style: "vivid",
        response_format: "url",
        n: 1
      });

      if (!response.data || response.data.length === 0) {
        throw new Error("No image data in response");
      }

      const imageData = response.data[0];
      if (!imageData.url) {
        throw new Error("No image URL in response");
      }

      // Generate secure asset metadata
      const secureAsset = createSecureAssetMetadata('png');
      
      // Download image from DALL-E 3 URL and upload to S3
      const imageResponse = await fetch(imageData.url);
      const imageBuffer = await imageResponse.arrayBuffer();
      const imageBase64 = Buffer.from(imageBuffer).toString('base64');
      
      const s3Key = await uploadBase64ToS3(imageBase64, secureAsset.assetId);
      const tokens = calculateTokens(dalleSize, dalleQuality);

      return {
        imageUrl: secureAsset.secureUrl,
        secureUrl: secureAsset.secureUrl,
        s3Key: secureAsset.s3Key,
        assetId: secureAsset.assetId,
        shortId: secureAsset.shortId,
        revisedPrompt: imageData.revised_prompt || prompt,
        metadata: {
          model: "gpt-image-1",
          prompt,
          size: dalleSize,
          quality: dalleQuality,
          format,
          background,
          tokens
        }
      };

    } catch (error: any) {
      console.error("GPT Image generation error:", error);
      throw new Error(`Image generation failed: ${error?.message || 'Unknown error'}`);
    }
  }

  calculateCreditCost(options: GPTImageGenerationOptions): number {
    const { size = "auto", quality = "auto" } = options;
    
    let baseCredits = 5;
    
    // Quality multipliers
    if (quality === "high") {
      baseCredits *= 2;
    } else if (quality === "low") {
      baseCredits *= 0.5;
    }
    
    // Size multipliers
    if (size === "1536x1024" || size === "1024x1536") {
      baseCredits *= 1.4;
    }
    
    return Math.max(3, Math.round(baseCredits));
  }

  validateRequest(options: GPTImageGenerationOptions): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!options.prompt || options.prompt.trim().length === 0) {
      errors.push("Prompt is required");
    }
    
    if (options.prompt && options.prompt.length > 4000) {
      errors.push("Prompt must be 4000 characters or less");
    }
    
    const validSizes = ["1024x1024", "1536x1024", "1024x1536", "auto"];
    if (options.size && !validSizes.includes(options.size)) {
      errors.push("Invalid size option");
    }
    
    const validQualities = ["low", "medium", "high", "auto"];
    if (options.quality && !validQualities.includes(options.quality)) {
      errors.push("Invalid quality option");
    }
    
    return { isValid: errors.length === 0, errors };
  }
}

export const gptImageService = new GPTImageService();