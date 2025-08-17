import { Router } from "express";
import { requireAuth } from "./unified-auth";
import { falService } from "./fal-service";

export function registerVideoGenerationEndpoints(app: Router) {
  // Direct image-to-video generation endpoint
  app.post('/api/video/image-to-video', requireAuth, async (req: any, res) => {
    try {
      const { imageUrl, prompt } = req.body;

      if (!imageUrl || !prompt) {
        return res.status(400).json({
          message: "Image URL and prompt are required"
        });
      }

      console.log("Generating image-to-video:", { imageUrl, prompt });

      const result = await falService.generateImageToVideo(imageUrl, prompt);

      res.json({
        success: true,
        video: result,
        message: "Video generated successfully"
      });

    } catch (error) {
      console.error("Error in image-to-video generation:", error);
      res.status(500).json({
        message: "Failed to generate video from image",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Enhanced video generation endpoint (image + video)
  app.post('/api/video/enhanced-generate', requireAuth, async (req: any, res) => {
    try {
      const { prompt, style = "cinematic", imageOptions = {} } = req.body;

      if (!prompt) {
        return res.status(400).json({
          message: "Prompt is required"
        });
      }

      console.log("Generating enhanced video:", { prompt, style });

      const result = await falService.generateEnhancedVideo(prompt, style, imageOptions);

      res.json({
        success: true,
        video: result,
        message: "Enhanced video generated successfully"
      });

    } catch (error) {
      console.error("Error in enhanced video generation:", error);
      res.status(500).json({
        message: "Failed to generate enhanced video",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Test endpoint for the complete image-to-video workflow
  app.get('/api/video/test-workflow', requireAuth, async (req: any, res) => {
    try {
      const testPrompt = "A majestic eagle soaring through mountain peaks at golden hour";

      console.log("Testing complete image-to-video workflow with:", testPrompt);

      const result = await falService.generateEnhancedVideo(testPrompt, "cinematic");

      res.json({
        success: true,
        workflow: "image_to_video",
        result: {
          originalPrompt: result.originalPrompt,
          videoPrompt: result.videoPrompt,
          baseImageUrl: result.baseImage?.url,
          videoUrl: result.video?.url,
          style: result.style
        },
        message: "Enhanced video workflow test completed"
      });

    } catch (error) {
      console.error("Error in enhanced video workflow test:", error);
      res.status(500).json({
        message: "Enhanced video workflow test failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Test endpoint for direct image-to-video (using example from your request)
  app.get('/api/video/test-direct', requireAuth, async (req: any, res) => {
    try {
      const testImageUrl = "https://storage.googleapis.com/falserverless/model_tests/minimax/1749891352437225630-389852416840474630_1749891352.png";
      const testPrompt = "Man walked into winter cave with polar bear";

      console.log("Testing direct image-to-video with:", { testImageUrl, testPrompt });

      const result = await falService.generateImageToVideo(testImageUrl, testPrompt);

      res.json({
        success: true,
        test: true,
        result: result,
        message: "Direct image-to-video test completed"
      });

    } catch (error) {
      console.error("Error in direct image-to-video test:", error);
      res.status(500).json({
        message: "Direct image-to-video test failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Kling AI 2.1 text-to-video generation endpoint
  app.post('/api/video/kling-generate', requireAuth, async (req: any, res) => {
    try {
      const {
        prompt,
        aspect_ratio = "9:16",
        duration = "8s",
        generate_audio = true,
        seed,
        motion_bucket_id = 127,
        cond_aug = 0.02
      } = req.body;

      if (!prompt) {
        return res.status(400).json({
          message: "Prompt is required"
        });
      }

      console.log("Generating video with Kling AI 2.1:", {
        prompt,
        aspect_ratio,
        duration,
        generate_audio,
        seed,
        motion_bucket_id,
        cond_aug
      });

      const result = await falService.generateTextToVideoWithKling({
        prompt,
        aspect_ratio,
        duration,
        generate_audio,
        seed,
        motion_bucket_id,
        cond_aug
      });

      res.json({
        success: true,
        video: result,
        message: "Kling AI 2.1 video generated successfully"
      });

    } catch (error) {
      console.error("Error in Kling AI 2.1 video generation:", error);
      res.status(500).json({
        message: "Failed to generate video with Kling AI 2.1",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Test endpoint for Kling AI 2.1 with sample prompt
  app.get('/api/video/test-kling', requireAuth, async (req: any, res) => {
    try {
      const testPrompt = "A majestic eagle soaring through mountain peaks at golden hour, cinematic lighting, smooth motion";

      console.log("Testing Kling AI 2.1 with:", testPrompt);

      const result = await falService.generateTextToVideoWithKling({
        prompt: testPrompt,
        aspect_ratio: "9:16",
        duration: "8s",
        generate_audio: true,
        motion_bucket_id: 127,
        cond_aug: 0.02
      });

      res.json({
        success: true,
        test: true,
        result: result,
        message: "Kling AI 2.1 test completed"
      });

    } catch (error) {
      console.error("Error in Kling AI 2.1 test:", error);
      res.status(500).json({
        message: "Kling AI 2.1 test failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
}