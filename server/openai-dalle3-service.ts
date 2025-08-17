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

export interface DALLE3GenerationOptions {
  prompt: string;
  size?: "1024x1024" | "1024x1792" | "1792x1024";
  quality?: "standard" | "hd";
  style?: "vivid" | "natural";
  response_format?: "url" | "b64_json";
}

export interface DALLE3Result {
  imageUrl: string;
  s3Key: string;
  assetId: string;
  revisedPrompt: string;
  metadata: {
    model: string;
    prompt: string;
    revisedPrompt: string;
    size: string;
    quality: string;
    style: string;
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

export class DALLE3Service {
  /**
   * Generate images using DALL-E 3
   */
  async generateImage(options: DALLE3GenerationOptions): Promise<DALLE3Result> {
    const {
      prompt,
      size = "1024x1024",
      quality = "standard",
      style = "vivid",
      response_format = "url"
    } = options;

    console.log(`Generating DALL-E 3 image: ${prompt.substring(0, 100)}...`);

    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        size,
        quality,
        style,
        response_format,
        n: 1 // DALL-E 3 only supports n=1
      });

      if (!response.data || response.data.length === 0) {
        throw new Error("No image data returned from OpenAI");
      }

      const imageData = response.data[0];
      const assetId = generateAssetId();
      let s3Key: string;

      if (response_format === "b64_json" && imageData.b64_json) {
        s3Key = await uploadBase64ToS3(imageData.b64_json, assetId);
      } else if (imageData.url) {
        s3Key = await downloadAndUploadToS3(imageData.url, assetId);
      } else {
        throw new Error("No image URL or base64 data received");
      }

      const imageUrl = `${CDN_BASE_URL}/${assetId}.png`;

      return {
        imageUrl,
        s3Key,
        assetId,
        revisedPrompt: imageData.revised_prompt || prompt,
        metadata: {
          model: "dall-e-3",
          prompt,
          revisedPrompt: imageData.revised_prompt || prompt,
          size,
          quality,
          style
        }
      };

    } catch (error: any) {
      console.error("DALL-E 3 generation error:", error);
      throw new Error(`Image generation failed: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Calculate credit cost for DALL-E 3
   */
  calculateCreditCost(options: DALLE3GenerationOptions): number {
    const { size = "1024x1024", quality = "standard" } = options;
    
    // Base costs
    let credits = 5; // Base cost for DALL-E 3
    
    // HD quality costs more
    if (quality === "hd") {
      credits += 3;
    }
    
    // Larger sizes cost more
    if (size === "1024x1792" || size === "1792x1024") {
      credits += 2;
    }
    
    return credits;
  }

  /**
   * Validate request options
   */
  validateRequest(options: DALLE3GenerationOptions): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!options.prompt || options.prompt.trim().length === 0) {
      errors.push("Prompt is required");
    }

    if (options.prompt && options.prompt.length > 4000) {
      errors.push("Prompt must be 4000 characters or less");
    }

    const validSizes = ["1024x1024", "1024x1792", "1792x1024"];
    if (options.size && !validSizes.includes(options.size)) {
      errors.push("Invalid size for DALL-E 3");
    }

    const validQualities = ["standard", "hd"];
    if (options.quality && !validQualities.includes(options.quality)) {
      errors.push("Invalid quality for DALL-E 3");
    }

    const validStyles = ["vivid", "natural"];
    if (options.style && !validStyles.includes(options.style)) {
      errors.push("Invalid style for DALL-E 3");
    }

    const validFormats = ["url", "b64_json"];
    if (options.response_format && !validFormats.includes(options.response_format)) {
      errors.push("Invalid response format");
    }

    // Check for prohibited content patterns
    const prohibitedPatterns = [
      /\b(nude|naked|nsfw)\b/i,
      /\b(violence|gore|blood)\b/i,
      /\b(hate|racist|discrimination)\b/i,
    ];

    for (const pattern of prohibitedPatterns) {
      if (pattern.test(options.prompt)) {
        errors.push("Prompt contains prohibited content");
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get optimal settings for different use cases
   */
  getOptimalSettings(useCase: string): Partial<DALLE3GenerationOptions> {
    switch (useCase.toLowerCase()) {
      case "portrait":
        return {
          size: "1024x1792",
          quality: "hd",
          style: "vivid"
        };
      case "landscape":
        return {
          size: "1792x1024",
          quality: "hd",
          style: "natural"
        };
      case "social_media":
        return {
          size: "1024x1024",
          quality: "standard",
          style: "vivid"
        };
      case "professional":
        return {
          size: "1024x1024",
          quality: "hd",
          style: "natural"
        };
      case "artistic":
        return {
          size: "1024x1024",
          quality: "hd",
          style: "vivid"
        };
      default:
        return {
          size: "1024x1024",
          quality: "standard",
          style: "vivid"
        };
    }
  }

  /**
   * Enhance prompt for better DALL-E 3 results
   */
  enhancePrompt(basePrompt: string, style?: string): string {
    let enhancedPrompt = basePrompt;

    // Add style-specific enhancements
    if (style) {
      switch (style.toLowerCase()) {
        case "photorealistic":
          enhancedPrompt += ", photorealistic, high resolution, professional photography";
          break;
        case "artistic":
          enhancedPrompt += ", artistic style, creative composition, detailed artwork";
          break;
        case "minimalist":
          enhancedPrompt += ", minimalist design, clean composition, simple elegant style";
          break;
        case "cyberpunk":
          enhancedPrompt += ", cyberpunk aesthetic, neon lighting, futuristic technology";
          break;
        case "vintage":
          enhancedPrompt += ", vintage style, retro aesthetic, classic composition";
          break;
        case "modern":
          enhancedPrompt += ", modern design, contemporary style, sleek and clean";
          break;
      }
    }

    return enhancedPrompt;
  }

  /**
   * Get pricing information
   */
  getPricingInfo() {
    return {
      model: "dall-e-3",
      baseCredits: 5,
      qualityMultipliers: {
        standard: 1,
        hd: 1.6
      },
      sizeMultipliers: {
        "1024x1024": 1,
        "1024x1792": 1.4,
        "1792x1024": 1.4
      },
      supportedSizes: ["1024x1024", "1024x1792", "1792x1024"],
      supportedQualities: ["standard", "hd"],
      supportedStyles: ["vivid", "natural"],
      maxPromptLength: 4000,
      imagesPerRequest: 1
    };
  }
}

export const dalle3Service = new DALLE3Service();