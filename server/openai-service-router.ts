import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "./unified-auth";
import { getGenerationLimits } from './unified-auth';
import { storage } from "./storage";
import { gptImageService } from "./openai-gpt-image-service";
import { dalle2Service } from "./openai-dalle2-service";
import { dalle3Service } from "./openai-dalle3-service";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Validation schemas
const gptImageGenerationSchema = z.object({
  prompt: z.string().min(1).max(4000),
  size: z.enum(["1024x1024", "1536x1024", "1024x1536", "auto"]).optional(),
  quality: z.enum(["low", "medium", "high", "auto"]).optional(),
  format: z.enum(["png", "jpeg", "webp"]).optional(),
  background: z.enum(["transparent", "opaque", "auto"]).optional(),
  compression: z.number().min(0).max(100).optional(),
  moderation: z.enum(["auto", "low"]).optional()
});

const gptImageEditSchema = z.object({
  prompt: z.string().min(1).max(4000),
  inputImage: z.string().min(1),
  maskImage: z.string().optional(),
  size: z.enum(["1024x1024", "1536x1024", "1024x1536", "auto"]).optional(),
  quality: z.enum(["low", "medium", "high", "auto"]).optional(),
  format: z.enum(["png", "jpeg", "webp"]).optional(),
  background: z.enum(["transparent", "opaque", "auto"]).optional(),
  compression: z.number().min(0).max(100).optional()
});

const dalle2GenerationSchema = z.object({
  prompt: z.string().min(1).max(1000),
  n: z.number().min(1).max(10).optional(),
  size: z.enum(["256x256", "512x512", "1024x1024"]).optional(),
  response_format: z.enum(["url", "b64_json"]).optional()
});

const dalle3GenerationSchema = z.object({
  prompt: z.string().min(1).max(4000),
  size: z.enum(["1024x1024", "1024x1792", "1792x1024"]).optional(),
  quality: z.enum(["standard", "hd"]).optional(),
  style: z.enum(["vivid", "natural"]).optional(),
  response_format: z.enum(["url", "b64_json"]).optional()
});

// GPT Image endpoints
router.post("/gpt-image/generate", requireAuth, async (req: any, res) => {
  try {
    const userId = req.userAccount.id;
    const user = await storage.getUser(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const validation = gptImageGenerationSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Invalid parameters",
        details: validation.error.errors
      });
    }

    const options = validation.data;
    const requestValidation = gptImageService.validateRequest(options);
    if (!requestValidation.isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: requestValidation.errors
      });
    }

    const creditCost = gptImageService.calculateCreditCost(options);

    // Check credits with allowDebit logic
    const { creditsRemaining, allowDebit } = getGenerationLimits(req.userAccount);
    if (creditsRemaining < creditCost && !allowDebit) {
      return res.status(400).json({
        error: "Insufficient credits",
        required: creditCost,
        available: creditsRemaining
      });
    }

    const result = await gptImageService.generateImage(options);

    // Deduct credits and create records
    await storage.updateUserCredits(userId, user.credits - creditCost);
    await storage.createCreditTransaction({
      userId,
      amount: -creditCost,
      type: "usage",
      description: "GPT Image generation"
    });

    const generation = await storage.createGeneration({
      userId,
      recipeId: null,
      prompt: options.prompt,
      status: "completed",
      recipeTitle: "GPT Image",
      metadata: {
        request_origin: "user"
      }
    }, req.userAccount.sessionToken);

    await storage.updateGenerationWithAsset(
      generation.id,
      "completed",
      result.imageUrl,
      result.s3Key,
      result.assetId,
      result.metadata
    );

    res.json({
      success: true,
      result,
      creditsUsed: creditCost,
      remainingCredits: user.credits - creditCost
    });

  } catch (error: any) {
    console.error("GPT Image generation error:", error);
    res.status(500).json({
      error: "Generation failed",
      message: error?.message || 'Unknown error'
    });
  }
});

// GPT Image edit endpoint - not implemented yet
// router.post("/gpt-image/edit", requireAuth, async (req: any, res) => {
//   // TODO: Implement GPT Image editing functionality
//   res.status(501).json({ error: "GPT Image editing not implemented yet" });
// });

// DALL-E 2 endpoints
router.post("/dalle2/generate", requireAuth, async (req: any, res) => {
  try {
    const userId = req.userAccount.id;
    const user = await storage.getUser(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const validation = dalle2GenerationSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Invalid parameters",
        details: validation.error.errors
      });
    }

    const options = validation.data;
    const requestValidation = dalle2Service.validateRequest(options);
    if (!requestValidation.isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: requestValidation.errors
      });
    }

    const creditCost = dalle2Service.calculateCreditCost("generation", {
      size: options.size || "1024x1024",
      count: options.n || 1
    });

    // Check credits with allowDebit logic
    const { creditsRemaining, allowDebit } = getGenerationLimits(req.userAccount);
    if (creditsRemaining < creditCost && !allowDebit) {
      return res.status(400).json({
        error: "Insufficient credits",
        required: creditCost,
        available: creditsRemaining
      });
    }

    const result = await dalle2Service.generateImage(options);

    // Deduct credits and create records
    await storage.updateUserCredits(userId, user.credits - creditCost);
    await storage.createCreditTransaction({
      userId,
      amount: -creditCost,
      type: "usage",
      description: "DALL-E 2 generation"
    });

    // Create generation record for each image
    for (const image of result.images) {
      const generation = await storage.createGeneration({
        userId,
        recipeId: null,
        prompt: options.prompt,
        status: "completed",
        recipeTitle: "DALL-E 2",
        metadata: {
          request_origin: "user"
        }
      }, req.userAccount.sessionToken);

      await storage.updateGenerationWithAsset(
        generation.id,
        "completed",
        image.url,
        image.s3Key,
        image.assetId,
        result.metadata
      );
    }

    res.json({
      success: true,
      result,
      creditsUsed: creditCost,
      remainingCredits: user.credits - creditCost
    });

  } catch (error: any) {
    console.error("DALL-E 2 generation error:", error);
    res.status(500).json({
      error: "Generation failed",
      message: error?.message || 'Unknown error'
    });
  }
});

router.post("/dalle2/edit", requireAuth, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'mask', maxCount: 1 }
]), async (req: any, res) => {
  try {
    const userId = req.userAccount.id;
    const user = await storage.getUser(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!req.files?.image?.[0]) {
      return res.status(400).json({ error: "Image file required" });
    }

    const options = {
      imageBase64: req.files.image[0].buffer.toString('base64'),
      maskBase64: req.files.mask?.[0]?.buffer.toString('base64'),
      prompt: req.body.prompt,
      n: req.body.n ? parseInt(req.body.n) : 1,
      size: req.body.size || "1024x1024",
      response_format: req.body.response_format || "url"
    };

    const requestValidation = dalle2Service.validateRequest(options);
    if (!requestValidation.isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: requestValidation.errors
      });
    }

    const creditCost = dalle2Service.calculateCreditCost("edit", {
      size: options.size,
      count: options.n
    });

    if (user.credits < creditCost) {
      return res.status(400).json({
        error: "Insufficient credits",
        required: creditCost,
        available: user.credits
      });
    }

    const result = await dalle2Service.editImage(options);

    // Deduct credits and create records
    await storage.updateUserCredits(userId, user.credits - creditCost);
    await storage.createCreditTransaction({
      userId,
      amount: -creditCost,
      type: "usage",
      description: "DALL-E 2 editing"
    });

    // Create generation record for each image
    for (const image of result.images) {
      const generation = await storage.createGeneration({
        userId,
        recipeId: null,
        prompt: options.prompt,
        status: "completed",
        recipeTitle: "DALL-E 2 Edit",
        metadata: {
          request_origin: "user"
        }
      }, req.userAccount.sessionToken);

      await storage.updateGenerationWithAsset(
        generation.id,
        "completed",
        image.url,
        image.s3Key,
        image.assetId,
        result.metadata
      );
    }

    res.json({
      success: true,
      result,
      creditsUsed: creditCost,
      remainingCredits: user.credits - creditCost
    });

  } catch (error: any) {
    console.error("DALL-E 2 edit error:", error);
    res.status(500).json({
      error: "Edit failed",
      message: error?.message || 'Unknown error'
    });
  }
});

router.post("/dalle2/variations", requireAuth, upload.single('image'), async (req: any, res) => {
  try {
    const userId = req.userAccount.id;
    const user = await storage.getUser(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image file required" });
    }

    const options = {
      imageBase64: req.file.buffer.toString('base64'),
      n: req.body.n ? parseInt(req.body.n) : 1,
      size: req.body.size || "1024x1024",
      response_format: req.body.response_format || "url"
    };

    const requestValidation = dalle2Service.validateRequest(options);
    if (!requestValidation.isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: requestValidation.errors
      });
    }

    const creditCost = dalle2Service.calculateCreditCost("variation", {
      size: options.size,
      count: options.n
    });

    if (user.credits < creditCost) {
      return res.status(400).json({
        error: "Insufficient credits",
        required: creditCost,
        available: user.credits
      });
    }

    const result = await dalle2Service.createVariations(options);

    // Deduct credits and create records
    await storage.updateUserCredits(userId, user.credits - creditCost);
    await storage.createCreditTransaction({
      userId,
      amount: -creditCost,
      type: "usage",
      description: "DALL-E 2 variations"
    });

    // Create generation record for each image
    for (const image of result.images) {
      const generation = await storage.createGeneration({
        userId,
        recipeId: null,
        prompt: "Image variation",
        status: "completed",
        recipeTitle: "DALL-E 2 Variations",
        metadata: {
          request_origin: "user"
        }
      }, req.userAccount.sessionToken);

      await storage.updateGenerationWithAsset(
        generation.id,
        "completed",
        image.url,
        image.s3Key,
        image.assetId,
        result.metadata
      );
    }

    res.json({
      success: true,
      result,
      creditsUsed: creditCost,
      remainingCredits: user.credits - creditCost
    });

  } catch (error: any) {
    console.error("DALL-E 2 variations error:", error);
    res.status(500).json({
      error: "Variations failed",
      message: error?.message || 'Unknown error'
    });
  }
});

// DALL-E 3 endpoints
router.post("/dalle3/generate", requireAuth, async (req: any, res) => {
  try {
    const userId = req.userAccount.id;
    const user = await storage.getUser(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const validation = dalle3GenerationSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Invalid parameters",
        details: validation.error.errors
      });
    }

    const options = validation.data;
    const requestValidation = dalle3Service.validateRequest(options);
    if (!requestValidation.isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: requestValidation.errors
      });
    }

    const creditCost = dalle3Service.calculateCreditCost(options);

    // Check credits with allowDebit logic
    const { creditsRemaining, allowDebit } = getGenerationLimits(req.userAccount);
    if (creditsRemaining < creditCost && !allowDebit) {
      return res.status(400).json({
        error: "Insufficient credits",
        required: creditCost,
        available: creditsRemaining
      });
    }

    const result = await dalle3Service.generateImage(options);

    // Deduct credits and create records
    await storage.updateUserCredits(userId, user.credits - creditCost);
    await storage.createCreditTransaction({
      userId,
      amount: -creditCost,
      type: "usage",
      description: "DALL-E 3 generation"
    });

    const generation = await storage.createGeneration({
      userId,
      recipeId: null,
      prompt: options.prompt,
      status: "completed",
      recipeTitle: "DALL-E 3",
      metadata: {
        request_origin: "user"
      }
    }, req.userAccount.sessionToken);

    await storage.updateGenerationWithAsset(
      generation.id,
      "completed",
      result.imageUrl,
      result.s3Key,
      result.assetId,
      result.metadata
    );

    res.json({
      success: true,
      result,
      creditsUsed: creditCost,
      remainingCredits: user.credits - creditCost
    });

  } catch (error: any) {
    console.error("DALL-E 3 generation error:", error);
    res.status(500).json({
      error: "Generation failed",
      message: error?.message || 'Unknown error'
    });
  }
});

// Utility endpoints
router.get("/models", (req, res) => {
  res.json({
    models: [
      {
        id: "gpt-image-1",
        name: "GPT Image",
        description: "Latest multimodal model with superior instruction following and editing capabilities",
        capabilities: ["generation", "editing", "streaming"],
        maxPromptLength: 4000,
        supportedSizes: ["1024x1024", "1536x1024", "1024x1536", "auto"],
        supportedQualities: ["low", "medium", "high", "auto"],
        supportedFormats: ["png", "jpeg", "webp"],
        transparency: true
      },
      {
        id: "dall-e-3",
        name: "DALL-E 3",
        description: "High-quality image generation with detailed prompts",
        capabilities: ["generation"],
        maxPromptLength: 4000,
        supportedSizes: ["1024x1024", "1024x1792", "1792x1024"],
        supportedQualities: ["standard", "hd"],
        supportedStyles: ["vivid", "natural"],
        imagesPerRequest: 1
      },
      {
        id: "dall-e-2",
        name: "DALL-E 2",
        description: "Fast and cost-effective with editing capabilities",
        capabilities: ["generation", "editing", "variations"],
        maxPromptLength: 1000,
        supportedSizes: ["256x256", "512x512", "1024x1024"],
        imagesPerRequest: 10,
        concurrentRequests: true
      }
    ]
  });
});

router.get("/pricing", (req, res) => {
  res.json({
    "gpt-image-1": {
      baseCredits: 5,
      factors: {
        quality: { low: 0.5, medium: 1, high: 2, auto: 1 },
        transparency: 1,
        editing: 1.5
      }
    },
    "dall-e-3": dalle3Service.getPricingInfo(),
    "dall-e-2": {
      baseCredits: { "256x256": 1, "512x512": 2, "1024x1024": 3 },
      operations: { generation: 1, edit: 1.2, variation: 1.2 }
    }
  });
});

router.get("/health", async (req, res) => {
  try {
    res.json({
      status: "healthy",
      services: {
        "gpt-image": { available: true, model: "gpt-image-1" },
        "dall-e-3": { available: true, model: "dall-e-3" },
        "dall-e-2": { available: true, model: "dall-e-2" }
      },
      configuration: {
        apiKeyConfigured: !!process.env.OPENAI_API_KEY,
        s3Configured: !!(process.env.AWS_MAGICVIDIO_ACCESS_KEY_ID && process.env.AWS_MAGICVIDIO_SECRET_ACCESS_KEY)
      }
    });
  } catch (error: any) {
    res.status(500).json({
      status: "unhealthy",
      error: error?.message || 'Unknown error'
    });
  }
});

export default router;