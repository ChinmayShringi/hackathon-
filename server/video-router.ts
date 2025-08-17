import { falService } from "./fal-service";

export interface VideoGenerationOptions {
  prompt: string;
  duration: number;
  style?: string;
  model?: string;
  provider?: "fal" | "openai";
  customInstructions?: string;
  aspectRatio?: "16:9" | "9:16" | "1:1";
  quality?: "standard" | "hd" | "4k";
}

export interface VideoGenerationResult {
  videoUrl?: string;
  thumbnailUrl?: string;
  duration: number;
  status: "completed" | "processing" | "failed";
  provider: string;
  metadata?: any;
  error?: string;
}

export class VideoRouter {
  
  // Route video generation to the appropriate provider based on recipe configuration
  async generateVideo(options: VideoGenerationOptions): Promise<VideoGenerationResult> {
    const provider = options.provider || "fal"; // Default to FAL
    
    try {
      switch (provider) {
        case "fal":
          return await this.generateWithFAL(options);
        case "openai":
          return await this.generateWithOpenAI(options);
        default:
          throw new Error(`Unsupported video provider: ${provider}`);
      }
    } catch (error) {
      console.error(`Video generation failed with ${provider}:`, error);
      return {
        status: "failed",
        provider,
        duration: options.duration,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // FAL video generation implementation
  private async generateWithFAL(options: VideoGenerationOptions): Promise<VideoGenerationResult> {
    try {
      // Use the existing FAL service for video generation
      const result = await falService.generateVideo(options.prompt, options.duration);
      
      if (result?.video_url) {
        return {
          videoUrl: result.video_url,
          thumbnailUrl: result.thumbnail_url,
          duration: options.duration,
          status: "completed",
          provider: "fal",
          metadata: result,
        };
      } else {
        // FAL video generation is not yet available
        return {
          status: "failed",
          provider: "fal",
          duration: options.duration,
          error: "FAL video generation not yet available",
        };
      }
    } catch (error) {
      throw new Error(`FAL video generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  // OpenAI GPT-4o video generation implementation
  private async generateWithOpenAI(options: VideoGenerationOptions): Promise<VideoGenerationResult> {
    try {
      // For now, OpenAI doesn't have direct video generation
      // This could be expanded to use GPT-4o for script generation + other video tools
      // Or wait for OpenAI's video generation capabilities
      
      const enhancedPrompt = this.enhancePromptForVideo(options.prompt, options.style);
      
      // Placeholder for future OpenAI video generation
      // When OpenAI releases video generation, implement here
      return {
        status: "failed",
        provider: "openai",
        duration: options.duration,
        error: "OpenAI video generation not yet available - awaiting API release",
      };
    } catch (error) {
      throw new Error(`OpenAI video generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  // Enhanced prompt engineering for video generation
  private enhancePromptForVideo(prompt: string, style?: string): string {
    const styleEnhancements = {
      cinematic: "cinematic video, professional cinematography, smooth camera movements, film-like quality",
      commercial: "commercial video style, clean professional look, marketing-ready content",
      social: "social media optimized video, engaging and shareable content, modern style",
      artistic: "artistic video composition, creative visual storytelling, unique aesthetic",
      documentary: "documentary style video, realistic and informative presentation",
      animation: "animated video style, smooth motion graphics, vibrant visuals",
    };

    const baseEnhancement = "high quality video, smooth motion, professional production";
    const styleEnhancement = style && styleEnhancements[style as keyof typeof styleEnhancements] 
      ? styleEnhancements[style as keyof typeof styleEnhancements] 
      : "";

    return `${prompt}. ${baseEnhancement}${styleEnhancement ? `, ${styleEnhancement}` : ""}`;
  }

  // Get optimal settings based on recipe configuration
  getOptimalSettings(recipeModel?: string, recipeStyle?: string): Partial<VideoGenerationOptions> {
    // Provider selection logic based on recipe configuration
    let provider: "fal" | "openai" = "fal"; // Default to FAL
    let quality: "standard" | "hd" | "4k" = "hd";
    
    // Model-based provider selection
    if (recipeModel?.includes("openai") || recipeModel?.includes("gpt")) {
      provider = "openai";
    } else if (recipeModel?.includes("fal") || recipeModel?.includes("flux")) {
      provider = "fal";
    }

    // Style-based quality selection
    if (recipeStyle === "commercial" || recipeStyle === "cinematic") {
      quality = "4k";
    } else if (recipeStyle === "social") {
      quality = "hd";
    }

    // Aspect ratio based on style
    let aspectRatio: "16:9" | "9:16" | "1:1" = "16:9";
    if (recipeStyle === "social") {
      aspectRatio = "9:16"; // Vertical for social media
    } else if (recipeStyle === "square") {
      aspectRatio = "1:1";
    }

    return {
      provider,
      quality,
      aspectRatio,
    };
  }

  // Provider availability check
  async checkProviderAvailability(provider: "fal" | "openai"): Promise<boolean> {
    try {
      switch (provider) {
        case "fal":
          // Check if FAL API key is available and service is accessible
          return process.env.FAL_KEY !== undefined;
        case "openai":
          // Check if OpenAI API key is available
          return process.env.OPENAI_API_KEY !== undefined;
        default:
          return false;
      }
    } catch (error) {
      return false;
    }
  }

  // Get supported features for each provider
  getSupportedFeatures(provider: "fal" | "openai") {
    switch (provider) {
      case "fal":
        return {
          maxDuration: 20, // seconds
          supportedAspectRatios: ["16:9", "9:16", "1:1"],
          supportedQualities: ["standard", "hd"],
          features: ["text-to-video", "image-to-video"],
        };
      case "openai":
        return {
          maxDuration: 0, // Not yet available
          supportedAspectRatios: [],
          supportedQualities: [],
          features: ["script-generation"], // Currently only script generation
        };
      default:
        return null;
    }
  }
}

export const videoRouter = new VideoRouter();