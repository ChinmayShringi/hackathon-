import { BaseComponent, InputChannel, OutputChannel } from '../component-system';
import { ComponentInputType } from '../component-types';

/**
 * Example Image to Video Component
 * 
 * This component demonstrates how to implement the abstract Component interface.
 * It takes an image and text prompt to generate a video using AI services.
 * 
 * Note: This is a demonstration component and doesn't actually call AI services.
 * In a real implementation, you would integrate with FAL.ai, OpenAI, or other providers.
 */
export class ImageToVideoComponent extends BaseComponent {
  id = 'image-to-video';
  name = 'Image to Video';
  version = '1.0.0';
  description = 'Converts an image to video using AI text-to-video generation';
  category = 'video-generation';
  tags = ['ai', 'video', 'image-to-video', 'generation'];
  creditCost = 5;
  estimatedProcessingTime = 30;
  
  inputChannels: InputChannel[] = [
    {
      id: 'baseImage',
      type: ComponentInputType.IMAGE_URL,
      required: true,
      position: 0,
      description: 'Base image to animate into video',
      validation: {
        pattern: '^https?://.*\\.(jpg|jpeg|png|webp)$',
        customValidator: (value: string) => {
          if (value.length > 2048) {
            return 'Image URL must be less than 2048 characters';
          }
          return true;
        }
      }
    },
    {
      id: 'prompt',
      type: ComponentInputType.TEXT_PROMPT,
      required: true,
      position: 1,
      description: 'Text prompt describing the video to generate',
      validation: {
        min: 10,
        max: 1000,
        customValidator: (value: string) => {
          if (value.includes('inappropriate content')) {
            return 'Prompt contains inappropriate content';
          }
          return true;
        }
      }
    },
    {
      id: 'duration',
      type: ComponentInputType.INTEGER,
      required: false,
      position: 2,
      description: 'Video duration in seconds',
      defaultValue: 8,
      validation: {
        min: 1,
        max: 60
      }
    },
    {
      id: 'aspectRatio',
      type: ComponentInputType.TEXT,
      required: false,
      position: 3,
      description: 'Video aspect ratio (e.g., 16:9, 9:16, 1:1)',
      defaultValue: '16:9',
      validation: {
        allowedValues: ['16:9', '9:16', '1:1', '4:3', '3:4']
      }
    },
    {
      id: 'quality',
      type: ComponentInputType.TEXT,
      required: false,
      position: 4,
      description: 'Video quality setting',
      defaultValue: 'hd',
      validation: {
        allowedValues: ['sd', 'hd', '4k']
      }
    }
  ];
  
  outputChannels: OutputChannel[] = [
    {
      id: 'video',
      type: ComponentInputType.VIDEO_URL,
      description: 'Generated video URL',
      metadata: {
        format: 'mp4',
        quality: 'hd',
        encoding: 'h264'
      }
    },
    {
      id: 'thumbnail',
      type: ComponentInputType.IMAGE_URL,
      description: 'Video thumbnail image',
      metadata: {
        format: 'jpg',
        dimensions: '1280x720'
      }
    },
    {
      id: 'metadata',
      type: ComponentInputType.JSON,
      description: 'Generation metadata and settings'
    }
  ];
  
  /**
   * Main processing method - receives inputs in the same order as inputChannels
   */
  async process(inputs: any[]): Promise<any[]> {
    // Inputs array matches inputChannels order:
    // inputs[0] = baseImage, inputs[1] = prompt, inputs[2] = duration, etc.
    const [baseImage, prompt, duration = 8, aspectRatio = '16:9', quality = 'hd'] = inputs;
    
    console.log(`Processing image-to-video generation:`);
    console.log(`  Base Image: ${baseImage}`);
    console.log(`  Prompt: ${prompt}`);
    console.log(`  Duration: ${duration}s`);
    console.log(`  Aspect Ratio: ${aspectRatio}`);
    console.log(`  Quality: ${quality}`);
    
    // Simulate AI service call (replace with actual implementation)
    const result = await this.simulateAIGeneration(baseImage, prompt, duration, aspectRatio, quality);
    
    // Return outputs in the same order as outputChannels:
    // [video, thumbnail, metadata]
    return [
      result.videoUrl,
      result.thumbnailUrl,
      result.metadata
    ];
  }
  
  /**
   * Simulate AI generation (replace with actual AI service integration)
   */
  private async simulateAIGeneration(
    baseImage: string,
    prompt: string,
    duration: number,
    aspectRatio: string,
    quality: string
  ): Promise<{
    videoUrl: string;
    thumbnailUrl: string;
    metadata: any;
  }> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock results
    const videoId = `video_${Date.now()}`;
    const videoUrl = `https://cdn.example.com/videos/${videoId}.mp4`;
    const thumbnailUrl = `https://cdn.example.com/thumbnails/${videoId}.jpg`;
    
    const metadata = {
      generationId: videoId,
      model: 'veo3-fast',
      provider: 'fal-ai',
      prompt,
      baseImage,
      duration,
      aspectRatio,
      quality,
      timestamp: new Date().toISOString(),
      processingTime: 1.0,
      settings: {
        motionBucket: 127,
        condAug: 0.02,
        generateAudio: true
      }
    };
    
    return { videoUrl, thumbnailUrl, metadata };
  }
  
  /**
   * Override validateInputs to add custom validation logic
   */
  validateInputs(inputs: any[]): void {
    // Call parent validation first
    super.validateInputs(inputs);
    
    // Add custom validation logic
    const [baseImage, prompt] = inputs;
    
    // Check if image URL is accessible (in real implementation, you might validate this)
    if (baseImage && typeof baseImage === 'string') {
      if (!baseImage.includes('cdn.example.com') && !baseImage.includes('http')) {
        throw new Error('Base image must be a valid HTTP/HTTPS URL');
      }
    }
    
    // Check prompt length and content
    if (prompt && typeof prompt === 'string') {
      if (prompt.length < 10) {
        throw new Error('Prompt must be at least 10 characters long');
      }
      
      if (prompt.length > 1000) {
        throw new Error('Prompt must be less than 1000 characters');
      }
    }
  }
}
