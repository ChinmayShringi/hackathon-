import * as fal from "@fal-ai/serverless-client";

// Configure FAL client
fal.config({
  credentials: process.env.FAL_KEY,
});

export interface FluxGenerationOptions {
  prompt: string;
  image_size?: "square_hd" | "square" | "portrait_4_3" | "portrait_16_9" | "landscape_4_3" | "landscape_16_9";
  num_inference_steps?: number;
  guidance_scale?: number;
  num_images?: number;
  enable_safety_checker?: boolean;
  seed?: number;
}

export interface VeoGenerationOptions {
  prompt: string;
  aspect_ratio?: "9:16" | "16:9" | "1:1";
  duration?: string; // Must be string like "8s"
  generate_audio?: boolean; // Correct parameter name
  seed?: number;
}

export interface KlingGenerationOptions {
  prompt: string;
  aspect_ratio?: "9:16" | "16:9" | "1:1";
  duration?: string; // Must be string like "8s"
  generate_audio?: boolean;
  seed?: number;
  motion_bucket_id?: number; // Kling specific parameter
  cond_aug?: number; // Kling specific parameter
}

export interface GenerationResult {
  images: Array<{
    url: string;
    width: number;
    height: number;
    content_type: string;
  }>;
  timings: {
    inference: number;
  };
  seed: number;
  has_nsfw_concepts: boolean[];
  prompt: string;
}

export class FalService {
  // Flux.1 Pro model for high-quality generations
  async generateWithFluxPro(options: FluxGenerationOptions): Promise<any> {
    try {
      const result: any = await fal.subscribe("fal-ai/flux-pro", {
        input: {
          prompt: options.prompt,
          image_size: options.image_size || "landscape_4_3",
          num_inference_steps: options.num_inference_steps || 28,
          guidance_scale: options.guidance_scale || 3.5,
          num_images: options.num_images || 1,
          enable_safety_checker: options.enable_safety_checker !== false,
          seed: options.seed,
        },
      });

      return result.data;
    } catch (error) {
      console.error("Error generating with Flux Pro:", error);
      throw new Error("Failed to generate image with Flux Pro");
    }
  }

  // Flux.1 Dev model for faster generations
  async generateWithFluxDev(options: FluxGenerationOptions): Promise<any> {
    try {
      const result: any = await fal.subscribe("fal-ai/flux/dev", {
        input: {
          prompt: options.prompt,
          image_size: options.image_size || "landscape_4_3",
          num_inference_steps: options.num_inference_steps || 28,
          guidance_scale: options.guidance_scale || 3.5,
          num_images: options.num_images || 1,
          enable_safety_checker: options.enable_safety_checker !== false,
          seed: options.seed,
        },
      });

      // Handle different response structures
      if (result && result.data) {
        return result.data;
      } else if (result && result.images) {
        return result;
      } else {
        console.error("Unexpected FAL response structure:", result);
        throw new Error("Invalid response from FAL service");
      }
    } catch (error) {
      console.error("Error generating with Flux Dev:", error);
      throw new Error("Failed to generate image with Flux Dev");
    }
  }

  // Flux.1 Schnell model for ultra-fast generations
  async generateWithFluxSchnell(options: FluxGenerationOptions): Promise<any> {
    try {
      const result: any = await fal.subscribe("fal-ai/flux/schnell", {
        input: {
          prompt: options.prompt,
          image_size: options.image_size || "landscape_4_3",
          num_inference_steps: Math.min(options.num_inference_steps || 4, 4), // Schnell is optimized for 1-4 steps
          num_images: options.num_images || 1,
          enable_safety_checker: options.enable_safety_checker !== false,
          seed: options.seed,
        },
      });

      return result.data;
    } catch (error) {
      console.error("Error generating with Flux Schnell:", error);
      throw new Error("Failed to generate image with Flux Schnell");
    }
  }

  // Main generation method that selects the appropriate model based on recipe configuration
  async generateImage(
    prompt: string,
    model: string = "flux-1",
    style: string = "photorealistic",
    options: Partial<FluxGenerationOptions> = {}
  ): Promise<any> {
    // Enhance prompt based on style
    const enhancedPrompt = this.enhancePromptWithStyle(prompt, style);

    const generationOptions: FluxGenerationOptions = {
      prompt: enhancedPrompt,
      image_size: this.getImageSize(style),
      ...options,
    };

    // Select model based on configuration
    switch (model) {
      case "flux-1-pro":
        return await this.generateWithFluxPro(generationOptions);
      case "flux-1-dev":
        return await this.generateWithFluxDev(generationOptions);
      case "flux-1-schnell":
        return await this.generateWithFluxSchnell(generationOptions);
      case "flux-1":
      default:
        // Default to Dev model for balance of quality and speed
        return await this.generateWithFluxDev(generationOptions);
    }
  }

  // Enhance prompts based on style preferences
  private enhancePromptWithStyle(prompt: string, style: string): string {
    const styleEnhancements = {
      photorealistic: "photorealistic, high quality, detailed, professional photography",
      cinematic: "cinematic lighting, dramatic composition, film still, professional cinematography",
      artistic: "artistic composition, creative interpretation, fine art style",
      commercial: "commercial photography, clean professional style, studio lighting",
      abstract: "abstract art, creative composition, modern artistic interpretation",
      minimalist: "clean minimalist design, simple composition, elegant simplicity",
      cyberpunk: "cyberpunk aesthetic, neon lighting, futuristic elements, digital art",
      futuristic: "futuristic design, advanced technology, sci-fi elements",
      illusion: "optical illusion, 3D effect, trompe-l'oeil style, depth perception",
      typography: "clean typography, professional text design, graphic design elements",
    };

    const enhancement = styleEnhancements[style as keyof typeof styleEnhancements];
    if (enhancement) {
      return `${prompt}, ${enhancement}`;
    }
    return prompt;
  }

  // Get optimal image size based on style and use case
  private getImageSize(style: string): FluxGenerationOptions["image_size"] {
    const sizeMapping: Record<string, FluxGenerationOptions["image_size"]> = {
      social: "square_hd", // Social media posts work best as squares
      portrait: "portrait_4_3", // Portrait photography
      landscape: "landscape_4_3", // General landscape format
      cinematic: "landscape_16_9", // Cinematic aspect ratio
      commercial: "landscape_4_3", // Product photography
      abstract: "square_hd", // Abstract art often works well as squares
    };

    return sizeMapping[style] || "landscape_4_3";
  }

  // Direct text-to-video generation using Veo 3 Fast
  async generateTextToVideo(options: VeoGenerationOptions): Promise<any> {
    try {
      // Add timeout wrapper for FAL API call
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('FAL API timeout after 8 minutes')), 8 * 60 * 1000);
      });

      const falPromise = fal.subscribe("fal-ai/veo3/fast", {
        input: {
          prompt: options.prompt,
          aspect_ratio: options.aspect_ratio || "9:16",
          duration: options.duration || "8s",
          generate_audio: options.generate_audio !== false, // Default to true
          seed: options.seed,
        }
      });

      const result: any = await Promise.race([falPromise, timeoutPromise]);

      // Extract job ID for recovery tracking
      const jobId = this.extractJobId(result);
      if (jobId) {
        result.falJobId = jobId;
      }

      return result;
    } catch (error) {
      console.error("Error generating video with Veo 3 Fast:", error);
      throw new Error(`Failed to generate text-to-video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Direct text-to-video generation using Kling AI 2.1
  async generateTextToVideoWithKling(options: KlingGenerationOptions): Promise<any> {
    try {


      // Add timeout wrapper for FAL API call (increased for Kling AI 2.1)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('FAL API timeout after 15 minutes')), 15 * 60 * 1000);
      });

      const falPromise = fal.subscribe("fal-ai/kling-video/v2.1/master/text-to-video", {
        input: {
          prompt: options.prompt,
          mode: "pro",
          duration: "5",
          aspect_ratio: "16:9",
          generate_audio: true
        }
      });
      const result: any = await Promise.race([falPromise, timeoutPromise]);


      // Extract job ID for recovery tracking
      const jobId = this.extractJobId(result);
      if (jobId) {
        result.falJobId = jobId;

      }

      // Check for audio in the result
      if (result.video && result.video.audio_url) {
        console.log("Audio URL found:", result.video.audio_url);
      } else {
        console.log("No audio URL found in result");
      }

      return result;
    } catch (error) {
      console.error("Error generating video with Kling AI 2.1:", error);
      if (error && typeof error === 'object' && 'body' in error) {
        console.error("Validation error details:", JSON.stringify(error.body, null, 2));
      }
      throw new Error(`Failed to generate text-to-video with Kling: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Video generation for custom videos (future implementation)
  async generateVideo(prompt: string, duration: number = 3): Promise<any> {
    try {
      const result: any = await fal.subscribe("fal-ai/minimax/hailuo-01", {
        input: {
          prompt: prompt,
          duration: duration,
        },
      });

      return result.data;
    } catch (error) {
      console.error("Error generating video with Minimax:", error);
      throw new Error("Failed to generate video with Minimax");
    }
  }

  // Image-to-video generation using Minimax Hailuo-02 Pro
  async generateImageToVideo(imageUrl: string, prompt: string): Promise<any> {
    try {
      console.log("Starting image-to-video generation with FAL...");
      console.log("Image URL:", imageUrl);
      console.log("Prompt:", prompt);
      console.log("Using fal-ai/minimax/hailuo-02/pro/image-to-video model...");

      // Add timeout wrapper for FAL API call
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('FAL API timeout after 5 minutes')), 5 * 60 * 1000);
      });

      const falPromise = fal.subscribe("fal-ai/minimax/hailuo-02/pro/image-to-video", {
        input: {
          image_url: imageUrl,
          prompt: prompt,
          duration: 3,
        }
      });

      const result: any = await Promise.race([falPromise, timeoutPromise]);

      console.log("FAL video result:", JSON.stringify(result, null, 2));

      // Extract job ID for recovery tracking
      const jobId = this.extractJobId(result);
      if (jobId) {
        console.log(`Extracted FAL job ID: ${jobId}`);
        result.falJobId = jobId;
      } else {
        console.warn('No job ID found in FAL response');
      }

      return result;
    } catch (error) {
      console.error("Error generating video with Minimax:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      throw new Error(`Failed to generate image-to-video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Enhanced video generation: first creates image, then animates it
  async generateEnhancedVideo(
    prompt: string,
    style: string = "cinematic",
    imageOptions: Partial<FluxGenerationOptions> = {}
  ): Promise<any> {
    try {
      // Step 1: Generate the base image
      console.log("Generating base image for video...");
      const imageResult = await this.generateImage(prompt, "flux-1-dev", style, {
        image_size: "landscape_16_9", // Optimal for video
        ...imageOptions
      });

      if (!imageResult.images || imageResult.images.length === 0) {
        throw new Error("Failed to generate base image for video");
      }

      const imageUrl = imageResult.images[0].url;
      console.log("Base image generated:", imageUrl);

      // Step 2: Create video-optimized prompt that brings the image to life
      const videoPrompt = this.createVideoPrompt(prompt, style);
      console.log("Video prompt:", videoPrompt);

      // Step 3: Generate video from the image
      console.log("Generating video from image...");
      const videoResult = await this.generateImageToVideo(imageUrl, videoPrompt);

      if (!videoResult || !videoResult.video) {
        console.error("Video generation failed - no video in result:", videoResult);
        throw new Error("Video generation failed - no video URL returned");
      }

      return {
        ...videoResult,
        baseImage: imageResult.images[0],
        originalPrompt: prompt,
        videoPrompt: videoPrompt,
        style: style
      };
    } catch (error) {
      console.error("Error in enhanced video generation:", error);
      throw error;
    }
  }

  // Enhanced video generation with Kling AI 2.1: Flux Dev → Kling AI 2.1 → MMAudio
  async generateEnhancedVideoWithKling(
    prompt: string,
    style: string = "cinematic",
    imageOptions: Partial<FluxGenerationOptions> = {},
    useMMAudio: boolean = true // New parameter to control MMAudio usage
  ): Promise<any> {
    try {
      console.log("Starting enhanced video generation with Kling AI 2.1 workflow...");
      console.log("Step 1: Text to Image with Flux Dev");

      // Step 1: Generate the base image with Flux Dev
      const imageResult = await this.generateImage(prompt, "flux-1-dev", style, {
        image_size: "landscape_16_9", // Optimal for video
        ...imageOptions
      });

      if (!imageResult.images || imageResult.images.length === 0) {
        throw new Error("Failed to generate base image for video");
      }

      const imageUrl = imageResult.images[0].url;
      console.log("Base image generated:", imageUrl);

      // Step 2: Create video-optimized prompt that brings the image to life
      const videoPrompt = this.createVideoPrompt(prompt, style);
      console.log("Step 2: Image to Video with Kling AI 2.1");
      console.log("Video prompt:", videoPrompt);

      // Step 2: Generate video from the image using Kling AI 2.1
      const videoResult = await this.generateImageToVideoWithKling(imageUrl, videoPrompt, !useMMAudio);

      if (!videoResult || !videoResult.video) {
        console.error("Video generation failed - no video in result:", videoResult);
        throw new Error("Video generation failed - no video URL returned");
      }



      // Step 3: Generate audio with MMAudio (if enabled and video doesn't have audio)
      let finalVideoResult = videoResult;
      let mmaudioUsed = false;

      if (useMMAudio && !videoResult.video.audio_url) {
        console.log("Step 3: Video to Audio with MMAudio");
        try {
          const mmaudioResult = await this.generateAudioFromVideo(videoResult.video.url, prompt);
          console.log("Audio generated with MMAudio");

          // MMAudio returns a video file with audio attached
          if (mmaudioResult && mmaudioResult.video) {
            console.log("MMAudio returned video with audio:", mmaudioResult.video.url);
            finalVideoResult = {
              ...videoResult,
              video: mmaudioResult.video, // Use the MMAudio video (with audio attached)
              mmaudioVideo: mmaudioResult.video // Keep reference to MMAudio result
            };
            mmaudioUsed = true;
          } else {
            console.warn("MMAudio result doesn't contain expected video structure:", mmaudioResult);
          }
        } catch (audioError) {
          console.warn("Audio generation failed, continuing without audio:", audioError);
        }
      } else if (useMMAudio && videoResult.video.audio_url) {
        console.log("Kling generated audio directly, MMAudio not needed");
      } else if (!useMMAudio) {
        console.log("MMAudio disabled, using Kling's built-in audio");
      }

      return {
        ...finalVideoResult,
        baseImage: imageResult.images[0],
        originalPrompt: prompt,
        videoPrompt: videoPrompt,
        style: style,
        workflow: useMMAudio ? "flux-dev-kling-mmaudio" : "flux-dev-kling",
        mmaudioUsed: mmaudioUsed
      };
    } catch (error) {
      console.error("Error in enhanced video generation with Kling:", error);
      throw error;
    }
  }

  // Generate audio from video using MMAudio
  async generateAudioFromVideo(videoUrl: string, prompt: string): Promise<any> {
    try {


      // Add timeout wrapper for FAL API call
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('FAL API timeout after 5 minutes')), 5 * 60 * 1000);
      });

      const falPromise = fal.subscribe("fal-ai/mmaudio-v2", {
        input: {
          video_url: videoUrl,
          prompt: prompt
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {

            update.logs?.map((log) => log.message).forEach((message) => {
            });
          } else if (update.status === "COMPLETED") {
          } else {
          }
        }
      });

      const result: any = await Promise.race([falPromise, timeoutPromise]);


      // Extract job ID for recovery tracking
      const jobId = this.extractJobId(result);
      if (jobId) {
        result.falJobId = jobId;

      }

      return result;
    } catch (error) {
      console.error("Error generating audio with MMAudio:", error);
      throw new Error(`Failed to generate audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Generate image-to-video using Kling AI 2.1
  async generateImageToVideoWithKling(imageUrl: string, prompt: string, generateAudio: boolean = true): Promise<any> {
    try {


      // Add timeout wrapper for FAL API call (increased for Kling AI 2.1)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('FAL API timeout after 15 minutes')), 15 * 60 * 1000);
      });

      const falPromise = fal.subscribe("fal-ai/kling-video/v2.1/master/image-to-video", {
        input: {
          prompt: prompt,
          image_url: imageUrl,
          mode: "pro",
          duration: "5",
          aspect_ratio: "16:9",
          generate_audio: generateAudio
        }
      });


      const result: any = await Promise.race([falPromise, timeoutPromise]);


      // Extract job ID for recovery tracking
      const jobId = this.extractJobId(result);
      if (jobId) {
        result.falJobId = jobId;

      }

      // Check for audio in the result
      if (result.video && result.video.audio_url) {
        console.log("Audio URL found:", result.video.audio_url);
      } else {
        console.log("No audio URL found in result");
      }

      return result;
    } catch (error) {
      console.error("Error generating image-to-video with Kling AI 2.1:", error);
      if (error && typeof error === 'object' && 'body' in error) {
        console.error("Validation error details:", JSON.stringify(error.body, null, 2));
      }
      throw new Error(`Failed to generate image-to-video with Kling: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Create optimized prompts for video animation
  private createVideoPrompt(originalPrompt: string, style: string): string {
    const videoEnhancements = {
      cinematic: "smooth camera movement, cinematic motion, professional filming",
      dramatic: "dynamic movement, dramatic action, intense motion",
      peaceful: "gentle movement, serene motion, calm transitions",
      energetic: "fast-paced action, dynamic motion, high energy movement",
      artistic: "creative movement, artistic motion, flowing transitions",
      commercial: "professional movement, clean motion, commercial style",
      surreal: "surreal movement, dreamlike motion, otherworldly transitions"
    };

    const enhancement = videoEnhancements[style as keyof typeof videoEnhancements] || videoEnhancements.cinematic;

    // Extract key elements and add motion descriptors
    return `${originalPrompt}, ${enhancement}, smooth motion, natural movement, high quality video animation`;
  }

  // Extract job ID from FAL response for recovery tracking
  private extractJobId(result: any): string | null {
    if (!result) return null;

    // Try different possible locations for job ID
    if (result.request_id) return result.request_id;
    if (result.job_id) return result.job_id;
    if (result.id) return result.id;
    if (result.data?.request_id) return result.data.request_id;
    if (result.data?.job_id) return result.data.job_id;
    if (result.data?.id) return result.data.id;

    return null;
  }

  // Check job status for recovery purposes
  async checkJobStatus(jobId: string): Promise<any> {
    try {
      // For now, we'll use a simple approach since FAL doesn't have a direct status check
      // In a real implementation, you might need to use FAL's queue API or store job status locally
      console.log(`Checking status for FAL job ${jobId}`);

      // Since we don't have direct access to FAL job status, we'll assume it's completed
      // This is a placeholder - in production you'd implement proper job status checking
      throw new Error("Job status checking not yet implemented");
    } catch (error) {
      console.error(`Error checking job status for ${jobId}:`, error);
      throw error;
    }
  }
}

export const falService = new FalService();