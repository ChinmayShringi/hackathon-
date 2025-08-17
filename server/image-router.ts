import { falService } from "./fal-service";

export interface ImageGenerationOptions {
  prompt: string;
  style?: string;
  model?: string;
  provider?: "fal" | "openai" | "midjourney";
  imageSize?: "square_hd" | "square" | "portrait_4_3" | "portrait_16_9" | "landscape_4_3" | "landscape_16_9";
  quality?: "standard" | "hd" | "ultra";
  numImages?: number;
  seed?: number;
  customInstructions?: string;
}

export interface ImageGenerationResult {
  images: Array<{
    url: string;
    width: number;
    height: number;
    content_type?: string;
  }>;
  provider: string;
  model: string;
  metadata?: any;
  status: "completed" | "failed";
  error?: string;
}

export class ImageRouter {
  
  // Route image generation to the appropriate provider based on recipe configuration
  async generateImage(options: ImageGenerationOptions): Promise<ImageGenerationResult> {
    const provider = this.selectOptimalProvider(options);
    
    try {
      switch (provider) {
        case "fal":
          return await this.generateWithFAL(options);
        case "openai":
          return await this.generateWithOpenAI(options);
        case "midjourney":
          return await this.generateWithMidjourney(options);
        default:
          throw new Error(`Unsupported image provider: ${provider}`);
      }
    } catch (error) {
      console.error(`Image generation failed with ${provider}:`, error);
      return {
        images: [],
        provider,
        model: options.model || "unknown",
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Smart provider selection based on requirements
  private selectOptimalProvider(options: ImageGenerationOptions): "fal" | "openai" | "midjourney" {
    // If provider is explicitly specified, use it
    if (options.provider) {
      return options.provider;
    }

    // Model-based selection
    if (options.model?.includes("flux")) {
      return "fal";
    } else if (options.model?.includes("dall-e") || options.model?.includes("openai")) {
      return "openai";
    } else if (options.model?.includes("midjourney")) {
      return "midjourney";
    }

    // Style-based selection
    if (options.style === "photorealistic" || options.style === "commercial") {
      return "fal"; // Flux excels at photorealistic images
    } else if (options.style === "artistic" || options.style === "abstract") {
      return "openai"; // DALL-E good for artistic styles
    } else if (options.style === "cinematic" || options.style === "illustration") {
      return "midjourney"; // Midjourney excels at cinematic/artistic content
    }

    // Default to FAL for general use
    return "fal";
  }

  // FAL/Flux image generation implementation
  private async generateWithFAL(options: ImageGenerationOptions): Promise<ImageGenerationResult> {
    try {
      // Determine the best Flux model based on quality requirements
      let modelToUse = "flux-1-dev"; // Default
      
      if (options.quality === "ultra" || options.model?.includes("pro")) {
        modelToUse = "flux-1-pro";
      } else if (options.quality === "standard" || options.model?.includes("schnell")) {
        modelToUse = "flux-1-schnell";
      }

      const result = await falService.generateImage(
        options.prompt,
        modelToUse,
        options.style || "photorealistic",
        {
          image_size: options.imageSize || "landscape_4_3",
          num_images: options.numImages || 1,
          seed: options.seed,
        }
      );
      
      return {
        images: result.images || [],
        provider: "fal",
        model: modelToUse,
        metadata: result,
        status: "completed",
      };
    } catch (error) {
      throw new Error(`FAL image generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  // OpenAI DALL-E image generation implementation
  private async generateWithOpenAI(options: ImageGenerationOptions): Promise<ImageGenerationResult> {
    try {
      // Check if OpenAI API key is available
      if (!process.env.OPENAI_API_KEY) {
        throw new Error("OpenAI API key not configured");
      }

      // For now, placeholder - would implement actual OpenAI DALL-E integration
      // When implemented, this would use the OpenAI client to generate images
      return {
        images: [],
        provider: "openai",
        model: options.model || "dall-e-3",
        status: "failed",
        error: "OpenAI DALL-E integration not yet implemented",
      };
    } catch (error) {
      throw new Error(`OpenAI image generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  // Midjourney image generation implementation (placeholder)
  private async generateWithMidjourney(options: ImageGenerationOptions): Promise<ImageGenerationResult> {
    try {
      // Placeholder for future Midjourney API integration
      return {
        images: [],
        provider: "midjourney",
        model: options.model || "midjourney-v6",
        status: "failed",
        error: "Midjourney integration not yet available",
      };
    } catch (error) {
      throw new Error(`Midjourney image generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  // Get optimal settings based on recipe configuration
  getOptimalSettings(recipeModel?: string, recipeStyle?: string): Partial<ImageGenerationOptions> {
    const provider = this.selectOptimalProvider({ 
      prompt: "", // temporary placeholder for type checking
      model: recipeModel, 
      style: recipeStyle 
    });
    
    // Quality selection based on style and model
    let quality: "standard" | "hd" | "ultra" = "hd";
    if (recipeStyle === "commercial" || recipeStyle === "photorealistic") {
      quality = "ultra";
    } else if (recipeStyle === "social" || recipeModel?.includes("schnell")) {
      quality = "standard";
    }

    // Image size based on style
    let imageSize: ImageGenerationOptions["imageSize"] = "landscape_4_3";
    if (recipeStyle === "social") {
      imageSize = "square_hd";
    } else if (recipeStyle === "portrait") {
      imageSize = "portrait_4_3";
    } else if (recipeStyle === "cinematic") {
      imageSize = "landscape_16_9";
    }

    return {
      provider,
      quality,
      imageSize,
      numImages: 1,
    };
  }

  // Provider availability check
  async checkProviderAvailability(provider: "fal" | "openai" | "midjourney"): Promise<boolean> {
    try {
      switch (provider) {
        case "fal":
          return process.env.FAL_KEY !== undefined;
        case "openai":
          return process.env.OPENAI_API_KEY !== undefined;
        case "midjourney":
          return false; // Not yet implemented
        default:
          return false;
      }
    } catch (error) {
      return false;
    }
  }

  // Get supported features for each provider
  getSupportedFeatures(provider: "fal" | "openai" | "midjourney") {
    switch (provider) {
      case "fal":
        return {
          models: ["flux-1-pro", "flux-1-dev", "flux-1-schnell"],
          maxImages: 4,
          supportedSizes: ["square_hd", "square", "portrait_4_3", "portrait_16_9", "landscape_4_3", "landscape_16_9"],
          supportedStyles: ["photorealistic", "cinematic", "commercial", "artistic"],
          features: ["text-to-image", "style-transfer", "high-resolution"],
        };
      case "openai":
        return {
          models: ["dall-e-3", "dall-e-2"],
          maxImages: 1,
          supportedSizes: ["1024x1024", "1792x1024", "1024x1792"],
          supportedStyles: ["artistic", "photorealistic", "cartoon"],
          features: ["text-to-image", "image-editing"],
        };
      case "midjourney":
        return {
          models: ["midjourney-v6", "midjourney-v5"],
          maxImages: 4,
          supportedSizes: ["square", "portrait", "landscape"],
          supportedStyles: ["artistic", "cinematic", "illustration", "concept-art"],
          features: ["text-to-image", "style-variations", "upscaling"],
        };
      default:
        return null;
    }
  }

  // Enhanced prompt engineering for different providers
  enhancePromptForProvider(prompt: string, provider: "fal" | "openai" | "midjourney", style?: string): string {
    const basePrompt = prompt;
    
    switch (provider) {
      case "fal":
        // Flux models work well with detailed, technical descriptions
        const fluxEnhancements = {
          photorealistic: "photorealistic, high quality, detailed, professional photography, sharp focus",
          cinematic: "cinematic lighting, dramatic composition, film still, professional cinematography",
          commercial: "commercial photography, clean professional style, studio lighting, product shot",
          artistic: "artistic composition, creative interpretation, fine art photography",
        };
        const fluxEnhancement = style && fluxEnhancements[style as keyof typeof fluxEnhancements];
        return fluxEnhancement ? `${basePrompt}, ${fluxEnhancement}` : basePrompt;

      case "openai":
        // DALL-E works well with creative, descriptive language
        const dalleEnhancements = {
          artistic: "in the style of digital art, creative composition, vibrant colors",
          photorealistic: "photorealistic rendering, highly detailed, professional quality",
          cartoon: "cartoon style, animated, colorful illustration",
        };
        const dalleEnhancement = style && dalleEnhancements[style as keyof typeof dalleEnhancements];
        return dalleEnhancement ? `${basePrompt}, ${dalleEnhancement}` : basePrompt;

      case "midjourney":
        // Midjourney excels with artistic and stylistic keywords
        const mjEnhancements = {
          cinematic: "cinematic composition, dramatic lighting, film photography, --ar 16:9",
          artistic: "artistic masterpiece, beautiful composition, trending on artstation",
          illustration: "detailed illustration, concept art, digital painting",
        };
        const mjEnhancement = style && mjEnhancements[style as keyof typeof mjEnhancements];
        return mjEnhancement ? `${basePrompt} ${mjEnhancement}` : basePrompt;

      default:
        return basePrompt;
    }
  }

  // Cost calculation based on provider and settings
  calculateCreditCost(provider: "fal" | "openai" | "midjourney", options: ImageGenerationOptions): number {
    const baseCost = {
      fal: {
        "flux-1-schnell": 1,
        "flux-1-dev": 3,
        "flux-1-pro": 5,
      },
      openai: {
        "dall-e-2": 2,
        "dall-e-3": 4,
      },
      midjourney: {
        "midjourney-v5": 6,
        "midjourney-v6": 8,
      },
    };

    const modelCost = baseCost[provider]?.[options.model as keyof typeof baseCost[typeof provider]] || 3;
    const imageCost = modelCost * (options.numImages || 1);
    
    // Quality multiplier
    const qualityMultiplier = {
      standard: 1,
      hd: 1.5,
      ultra: 2,
    };
    
    return Math.ceil(imageCost * (qualityMultiplier[options.quality || "hd"]));
  }
}

export const imageRouter = new ImageRouter();