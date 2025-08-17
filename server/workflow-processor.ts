import * as fal from "@fal-ai/serverless-client";
import { mediaTransferService } from "./media-transfer-service";

// Configure FAL client once
fal.config({
  credentials: process.env.FAL_KEY,
});

export interface WorkflowComponent {
  type: "image" | "video" | "text" | "audio" | "text_to_video";
  model: string;
  endpoint?: string;
  provider?: string;
  serviceId?: number; // For service-based workflows
}

export interface WorkflowResult {
  type: string;
  data: any;
  metadata: {
    model: string;
    endpoint?: string;
    jobId?: string;
    prompt: string;
    baseImage?: any;
    serviceId?: number;
    finalJobId?: string; // For recovery tracking
    transferredToS3?: boolean;
    cdnUrl?: string;
    s3Key?: string;
    assetId?: string;
    status?: string; // Added for tracking job status
    aspectRatio?: string; // Video aspect ratio
    duration?: number; // Video duration in seconds
    quality?: string; // Video quality
  };
}

export class WorkflowProcessor {

  async processWorkflow(components: WorkflowComponent[], prompt: string, generationId: number, recipeConfig?: any): Promise<WorkflowResult> {
    let previousResult: WorkflowResult | null = null;
    let finalJobId: string | null = null;

    for (const component of components) {
      try {
        if (component.type === "image") {
          previousResult = await this.processImageComponent(component, prompt);
        } else if (component.type === "video") {
          if (!previousResult) {
            throw new Error("Video component requires image input from previous component");
          }
          previousResult = await this.processVideoComponent(component, previousResult, prompt);
        } else if (component.type === "text_to_video") {
          // Direct text-to-video generation (no image input required)
          previousResult = await this.processTextToVideoComponent(component, prompt, recipeConfig);
        } else {
          throw new Error(`Unsupported component type: ${component.type}`);
        }

        // Track the latest job ID for recovery
        if (previousResult.metadata?.jobId) {
          finalJobId = previousResult.metadata.jobId;
        }
      } catch (error) {
        console.error(`Error processing ${component.type} component:`, error);
        throw error;
      }
    }

    if (!previousResult) {
      throw new Error("Workflow processing failed - no results");
    }

    // Add final job ID to result for recovery tracking
    if (finalJobId) {
      previousResult.metadata.finalJobId = finalJobId;
    }

    return previousResult;
  }

  private async processImageComponent(component: WorkflowComponent, prompt: string): Promise<WorkflowResult> {
    const endpoint = this.getImageEndpoint(component.model);
    const options = this.getImageOptions(component.model, prompt);

    console.log(`Starting FAL API request to ${endpoint}...`);

    // Use fal.queue.submit to get immediate job ID
    const jobRequest = await fal.queue.submit(endpoint, { input: options });
    const jobId = jobRequest.request_id;

    console.log(`FAL job submitted with ID: ${jobId}`);

    // Return immediately with job ID - let recovery service handle polling
    return {
      type: "image",
      data: null, // Will be populated by recovery service
      metadata: {
        model: component.model,
        endpoint: endpoint,
        jobId: jobId,
        prompt: prompt,
        status: "submitted"
      }
    };
  }

  private async processVideoComponent(component: WorkflowComponent, imageInput: any, prompt: string): Promise<WorkflowResult> {
    if (!component.endpoint) {
      throw new Error(`Video component missing endpoint for model: ${component.model}`);
    }

    const imageUrl = imageInput.data.images?.[0]?.url || imageInput.data.url;
    if (!imageUrl) {
      throw new Error("No image URL found in input for video generation");
    }

    console.log(`Starting FAL API request to ${component.endpoint}...`);
    console.log(`Input image URL: ${imageUrl}`);

    const options = this.getVideoOptions(component.model, imageUrl, prompt);

    // Use fal.queue.submit to get immediate job ID
    const jobRequest = await fal.queue.submit(component.endpoint, { input: options });
    const jobId = jobRequest.request_id;

    console.log(`FAL job submitted with ID: ${jobId}`);

    // Return immediately with job ID - let recovery service handle polling
    return {
      type: "video",
      data: null, // Will be populated by recovery service
      metadata: {
        model: component.model,
        endpoint: component.endpoint,
        jobId: jobId,
        prompt: prompt,
        baseImage: imageInput,
        status: "submitted"
      }
    };
  }

  private async processTextToVideoComponent(component: WorkflowComponent, prompt: string, recipeConfig?: any): Promise<WorkflowResult> {


    // Read settings from recipe configuration, fallback to defaults
    const aspectRatio = recipeConfig?.videoAspectRatio || "9:16";
    const duration = recipeConfig?.videoDuration || 8;
    const quality = recipeConfig?.videoQuality || "hd";

    console.log(`Using settings: aspect_ratio=${aspectRatio}, duration=${duration}s, quality=${quality}`);

    let endpoint: string;
    let options: any;

    // Choose between Veo 3 Fast and Kling AI 2.1 based on model
    if (component.model === 'kling2.1' || component.model === 'kling-ai-2.1') {
      endpoint = "fal-ai/kling2.1";
      options = {
        prompt: prompt,
        aspect_ratio: aspectRatio,
        duration: `${duration}s`, // Convert to string format required by FAL
        generate_audio: true, // Enable audio by default
        motion_bucket_id: 127, // Default Kling motion setting
        cond_aug: 0.02, // Default Kling conditioning augmentation
      };
    } else {
      // Default to Veo 3 Fast
      endpoint = "fal-ai/veo3/fast";
      options = {
        prompt: prompt,
        aspect_ratio: aspectRatio,
        duration: `${duration}s`, // Convert to string format required by FAL
        generate_audio: true, // Enable audio by default
      };
    }

    // Use fal.queue.submit to get immediate job ID
    const jobRequest = await fal.queue.submit(endpoint, { input: options });
    const jobId = jobRequest.request_id;

    console.log(`FAL job submitted with ID: ${jobId}`);

    // Return immediately with job ID - let recovery service handle polling
    return {
      type: "video",
      data: null, // Will be populated by recovery service
      metadata: {
        model: component.model,
        endpoint: endpoint,
        jobId: jobId,
        prompt: prompt,
        status: "submitted",
        serviceId: component.serviceId,
        aspectRatio: aspectRatio,
        duration: duration,
        quality: quality
      }
    };
  }

  private getImageEndpoint(model: string): string {
    switch (model) {
      case "flux-1-dev":
        return "fal-ai/flux/dev";
      case "flux-1-schnell":
        return "fal-ai/flux/schnell";
      case "flux-1-pro":
        return "fal-ai/flux-pro";
      default:
        throw new Error(`Unsupported image model: ${model}`);
    }
  }

  private getImageOptions(model: string, prompt: string): any {
    const enhancedPrompt = this.enhancePromptForSurrealism(prompt);

    const baseOptions = {
      prompt: enhancedPrompt,
      image_size: "landscape_16_9",
      num_inference_steps: 28,
      guidance_scale: 3.5,
      num_images: 1,
      enable_safety_checker: true
    };

    switch (model) {
      case "flux-1-dev":
      case "flux-1-schnell":
        return baseOptions;
      case "flux-1-pro":
        return {
          ...baseOptions,
          guidance_scale: 4.0,
          num_inference_steps: 50
        };
      default:
        return baseOptions;
    }
  }

  private getVideoOptions(model: string, imageUrl: string, prompt: string): any {
    switch (model) {
      case "hailuo-02-pro":
        return {
          image_url: imageUrl,
          prompt: `Continue this scene: ${prompt}. Make it dynamic and engaging with smooth motion.`,
          duration: 5
        };
      default:
        return {
          image_url: imageUrl,
          prompt: prompt,
          duration: 3
        };
    }
  }

  private enhancePromptForSurrealism(prompt: string): string {
    if (prompt.includes("eating") && prompt.includes("lava")) {
      return `A surreal and humorous scene of ${prompt}. The molten lava glows bright orange and red with realistic heat shimmer effects. The person appears completely unaffected, showing no signs of pain or discomfort. The setting should be visually striking with excellent lighting and composition. The image should be both absurd and visually compelling.`;
    }
    return prompt;
  }

  /**
   * Transfer generated media to S3 and return CDN URLs
   */
  async transferGeneratedMedia(workflowResult: WorkflowResult): Promise<WorkflowResult> {
    try {
      console.log('Starting media transfer for workflow result:', workflowResult.type);

      if (workflowResult.type === 'image') {
        const imageUrl = workflowResult.data.images?.[0]?.url || workflowResult.data.url;
        if (!imageUrl) {
          throw new Error('No image URL found in workflow result');
        }

        const transferResult = await mediaTransferService.transferMedia({
          remoteUrl: imageUrl,
          mediaType: 'image'
        });

        if (!transferResult.success) {
          throw new Error(`Image transfer failed: ${transferResult.error}`);
        }

        // Update the result with CDN URL
        return {
          ...workflowResult,
          data: {
            ...workflowResult.data,
            images: [{
              ...workflowResult.data.images?.[0],
              url: transferResult.cdnUrl,
              originalUrl: imageUrl
            }],
            cdnUrl: transferResult.cdnUrl,
            s3Key: transferResult.s3Key,
            assetId: transferResult.assetId
          },
          metadata: {
            ...workflowResult.metadata,
            transferredToS3: true,
            cdnUrl: transferResult.cdnUrl,
            s3Key: transferResult.s3Key,
            assetId: transferResult.assetId
          }
        };

      } else if (workflowResult.type === 'video') {
        const videoUrl = workflowResult.data.video?.url || workflowResult.data.url;
        if (!videoUrl) {
          throw new Error('No video URL found in workflow result');
        }

        const transferResult = await mediaTransferService.transferMedia({
          remoteUrl: videoUrl,
          mediaType: 'video'
        });

        if (!transferResult.success) {
          throw new Error(`Video transfer failed: ${transferResult.error}`);
        }

        // Update the result with CDN URL
        return {
          ...workflowResult,
          data: {
            ...workflowResult.data,
            video: {
              ...workflowResult.data.video,
              url: transferResult.cdnUrl,
              originalUrl: videoUrl
            },
            cdnUrl: transferResult.cdnUrl,
            s3Key: transferResult.s3Key,
            assetId: transferResult.assetId
          },
          metadata: {
            ...workflowResult.metadata,
            transferredToS3: true,
            cdnUrl: transferResult.cdnUrl,
            s3Key: transferResult.s3Key,
            assetId: transferResult.assetId
          }
        };
      }

      return workflowResult;
    } catch (error) {
      console.error('Media transfer failed:', error);
      // Return original result if transfer fails
      return workflowResult;
    }
  }
}

export const workflowProcessor = new WorkflowProcessor();