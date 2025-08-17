import { BaseComponent, InputChannel, OutputChannel } from '../component-system';
import { ComponentInputType } from '../component-types';
import { videoUrlValidator, validateFrameKeys } from '../validation-utils';

/**
 * GetFramesFromVideo Component
 * 
 * This component extracts specific frames from a video using the GetFramesFromVideo Lambda.
 * It provides a clean, type-safe interface to the existing lambda function while maintaining
 * all the benefits of the component architecture.
 * 
 * Input: Video URL and array of frame keys
 * Output: Dictionary of extracted frames with original keys as dictionary keys
 */
export class GetFramesFromVideoComponent extends BaseComponent {
  id = 'get-frames-from-video';
  name = 'Get Frames From Video';
  version = '1.0.0';
  description = 'Extracts specific frames from a video using the GetFramesFromVideo Lambda';
  category = 'video-processing';
  tags = ['video', 'frames', 'extraction', 'lambda'];
  creditCost = 2;
  estimatedProcessingTime = 10;
  
  inputChannels: InputChannel[] = [
    {
      id: 'videoUrl',
      type: ComponentInputType.VIDEO_URL,
      required: true,
      position: 0,
      description: 'URL of the source video to extract frames from',
      validation: videoUrlValidator
    },
    {
      id: 'frameKeys',
      type: ComponentInputType.JSON,
      required: true,
      position: 1,
      description: 'Array of frame keys to extract (e.g., ["0", "-1", "50%", "90%"])',
      validation: {
        customValidator: (value: any) => {
          if (!Array.isArray(value) || value.length === 0) {
            return 'Frame keys must be a non-empty array';
          }
          if (value.length > 10) {
            return 'Maximum 10 frame keys allowed per request';
          }
          return true;
        }
      }
    }
  ];
  
  outputChannels: OutputChannel[] = [
    {
      id: 'frames',
      type: ComponentInputType.JSON,
      description: 'Dictionary of extracted frames with original keys as dictionary keys',
      metadata: {
        format: 'json',
        structure: 'key-value pairs where keys are original frame keys and values are frame results'
      }
    }
  ];

  // Constants for hardcoded configuration
  private readonly DESTINATION_BUCKET = 'delula-media-prod';
  private readonly KEY_PREFIX = 'images/intermediaries';
  private readonly LAMBDA_FUNCTION_NAME = 'GetFramesFromVideo';

  /**
   * Process video frame extraction request
   */
  async process(inputs: any[]): Promise<any[]> {
    const [videoUrl, frameKeys] = inputs;
    
    // Validate frame keys format
    validateFrameKeys(frameKeys);
    
    // Prepare lambda payload
    const lambdaPayload = {
      video_url: videoUrl,
      frame_requests: frameKeys.join(', '),
      destination_bucket: this.DESTINATION_BUCKET,
      output_prefix: this.KEY_PREFIX,
      allow_partial_completion: true
    };

    try {
      console.log(`🎬 Starting frame extraction for video: ${videoUrl}`);
      console.log(`🖼️  Frame keys requested: ${frameKeys.join(', ')}`);
      
      // Invoke lambda function
      const lambdaResponse = await this.invokeLambda(lambdaPayload);
      
      // Transform response to component output format
      const framesOutput = this.transformLambdaResponse(frameKeys, lambdaResponse);
      
      console.log(`✅ Frame extraction completed successfully`);
      console.log(`📊 Extracted ${Object.keys(framesOutput).length} frames`);
      
      return [framesOutput];
    } catch (error) {
      console.error(`❌ Frame extraction failed:`, error);
      throw new Error(`Frame extraction failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Invoke AWS Lambda function
   */
  private async invokeLambda(payload: any): Promise<any> {
    const { LambdaClient, InvokeCommand } = await import('@aws-sdk/client-lambda');
    
    const lambdaClient = new LambdaClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_DELULA_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_DELULA_SECRET_ACCESS_KEY!,
      },
    });

    const command = new InvokeCommand({
      FunctionName: this.LAMBDA_FUNCTION_NAME,
      Payload: JSON.stringify(payload)
    });

    console.log(`🚀 Invoking Lambda function: ${this.LAMBDA_FUNCTION_NAME}`);
    console.log(`📦 Lambda payload:`, JSON.stringify(payload, null, 2));

    const response = await lambdaClient.send(command);
    
    if (!response.Payload) {
      throw new Error('No response payload from Lambda');
    }

    const result = JSON.parse(new TextDecoder().decode(response.Payload));
    
    // Lambda function returns response directly, not wrapped in API Gateway format
    console.log(`📥 Lambda response received:`, JSON.stringify(result, null, 2));

    return result;
  }

  /**
   * Transform lambda response to component output format
   * Output format: { "0": {frame_id: 0, bucket_key: "..."}, "-1": {...}, "50%": {...} }
   */
  private transformLambdaResponse(frameKeys: string[], lambdaResponse: any): Record<string, any> {
    const framesOutput: Record<string, any> = {};
    
    frameKeys.forEach(frameKey => {
      if (lambdaResponse.frames && lambdaResponse.frames[frameKey]) {
        const frameResult = lambdaResponse.frames[frameKey];
        framesOutput[frameKey] = {
          frame_id: frameResult.frame_id,
          bucket_key: frameResult.bucket_key
        };
      } else if (lambdaResponse.unfulfilled && lambdaResponse.unfulfilled[frameKey]) {
        // Handle unfulfilled frames with error information
        framesOutput[frameKey] = {
          error: lambdaResponse.unfulfilled[frameKey].reason,
          original_request: frameKey
        };
      } else {
        // Handle missing frames (shouldn't happen with proper lambda response)
        framesOutput[frameKey] = {
          error: 'Frame result not found in lambda response',
          original_request: frameKey
        };
      }
    });

    return framesOutput;
  }

  /**
   * Override validateInputs to add custom frame key validation
   */
  validateInputs(inputs: any[]): void {
    // Call parent validation first
    super.validateInputs(inputs);
    
    // Additional custom validation for frame keys
    const [, frameKeys] = inputs;
    if (frameKeys) {
      validateFrameKeys(frameKeys);
    }
  }
}

