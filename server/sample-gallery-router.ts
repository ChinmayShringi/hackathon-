import { Router } from "express";
import { storage } from "./storage";
import { requireAuth } from "./unified-auth";
import { z } from "zod";

// Zod schemas for validation
const insertRecipeSampleSchema = z.object({
  recipeId: z.number(),
  generationId: z.number(),
  userId: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  originalPrompt: z.string(),
  thumbnailUrl: z.string(),
  previewUrl: z.string(),
  highResUrl: z.string(),
  type: z.string(),
  fileSize: z.number(),
  dimensions: z.any().optional()
});

const insertExportTransactionSchema = z.object({
  sampleId: z.number(),
  buyerId: z.string(),
  creatorId: z.string(),
  exportFormat: z.string(),
  exportQuality: z.string(),
  priceCredits: z.number(),
  creatorEarnings: z.number(),
  downloadUrl: z.string(),
  expiresAt: z.string()
});

const router = Router();

// Get samples for a specific recipe
router.get("/recipe/:recipeId", async (req, res) => {
  try {
    const recipeId = parseInt(req.params.recipeId);
    const limit = parseInt(req.query.limit as string) || 12;
    
    if (isNaN(recipeId)) {
      return res.status(400).json({ error: "Invalid recipe ID" });
    }

    const samples = await storage.getRecipeSamples(recipeId, limit);
    res.json(samples);
  } catch (error) {
    console.error("Error fetching recipe samples:", error);
    res.status(500).json({ error: "Failed to fetch samples" });
  }
});

// Get featured samples across all recipes
router.get("/featured", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const samples = await storage.getFeaturedSamples(limit);
    res.json(samples);
  } catch (error) {
    console.error("Error fetching featured samples:", error);
    res.status(500).json({ error: "Failed to fetch featured samples" });
  }
});

// Create a new recipe sample (publish user generation)
router.post("/", requireAuth, async (req: any, res) => {
  try {
    const userId = req.userAccount.id;
    const sampleData = insertRecipeSampleSchema.parse({
      ...req.body,
      userId
    });

    const sample = await storage.createRecipeSample(sampleData);
    res.status(201).json(sample);
  } catch (error) {
    console.error("Error creating recipe sample:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid sample data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to create sample" });
  }
});

// Toggle like for a sample
router.post("/:sampleId/like", requireAuth, async (req: any, res) => {
  try {
    const userId = req.userAccount.id;
    const sampleId = parseInt(req.params.sampleId);
    
    if (isNaN(sampleId)) {
      return res.status(400).json({ error: "Invalid sample ID" });
    }

    const isLiked = await storage.toggleSampleLike(sampleId, userId);
    res.json({ liked: isLiked });
  } catch (error) {
    console.error("Error toggling sample like:", error);
    res.status(500).json({ error: "Failed to toggle like" });
  }
});

// Check if user has liked a sample
router.get("/:sampleId/like", requireAuth, async (req: any, res) => {
  try {
    const userId = req.userAccount.id;
    const sampleId = parseInt(req.params.sampleId);
    
    if (isNaN(sampleId)) {
      return res.status(400).json({ error: "Invalid sample ID" });
    }

    const like = await storage.getUserSampleLike(sampleId, userId);
    res.json({ liked: !!like });
  } catch (error) {
    console.error("Error checking sample like:", error);
    res.status(500).json({ error: "Failed to check like status" });
  }
});

// Export pricing tiers
const EXPORT_PRICING = {
  image: {
    png: { standard: 2, hd: 5, ultra: 10 },
    jpg: { standard: 1, hd: 3, ultra: 7 },
    webp: { standard: 1, hd: 3, ultra: 7 }
  },
  video: {
    mp4: { standard: 5, hd: 12, ultra: 25 },
    webm: { standard: 4, hd: 10, ultra: 20 },
    gif: { standard: 3, hd: 8, ultra: 15 }
  }
};

// Get export pricing
router.get("/export/pricing", (req, res) => {
  res.json(EXPORT_PRICING);
});

// Purchase export for a sample
router.post("/:sampleId/export", requireAuth, async (req: any, res) => {
  try {
    const userId = req.userAccount.id;
    const sampleId = parseInt(req.params.sampleId);
    const { format, quality } = req.body;
    
    if (isNaN(sampleId)) {
      return res.status(400).json({ error: "Invalid sample ID" });
    }

    // Validate format and quality
    const validFormats = ['png', 'jpg', 'webp', 'mp4', 'webm', 'gif'];
    const validQualities = ['standard', 'hd', 'ultra'];
    
    if (!validFormats.includes(format) || !validQualities.includes(quality)) {
      return res.status(400).json({ error: "Invalid format or quality" });
    }

    // Get sample details (would need to join with recipe samples table)
    // For now, determine pricing based on format type
    const isVideo = ['mp4', 'webm', 'gif'].includes(format);
    const formatType = isVideo ? 'video' : 'image';
    const priceCredits = (EXPORT_PRICING[formatType] as any)[format]?.[quality] || 5;
    
    // Calculate creator earnings (70% to creator, 30% platform fee)
    const creatorEarnings = Math.floor(priceCredits * 0.7);
    
    // Create export transaction
    const exportTransaction = await storage.createExportTransaction({
      sampleId,
      buyerId: userId,
      creatorId: "placeholder", // Would get from sample
      exportFormat: format,
      exportQuality: quality,
      priceCredits,
      creatorEarnings,
      downloadUrl: `https://example.com/exports/${sampleId}-${format}-${quality}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    res.status(201).json(exportTransaction);
  } catch (error) {
    console.error("Error creating export:", error);
    res.status(500).json({ error: "Failed to create export" });
  }
});

// Get user's export history
router.get("/exports", requireAuth, async (req: any, res) => {
  try {
    const userId = req.userAccount.id;
    const exports = await storage.getUserExports(userId);
    res.json(exports);
  } catch (error) {
    console.error("Error fetching user exports:", error);
    res.status(500).json({ error: "Failed to fetch exports" });
  }
});

// Download export (mark as downloaded)
router.post("/exports/:exportId/download", requireAuth, async (req: any, res) => {
  try {
    const userId = req.userAccount.id;
    const exportId = parseInt(req.params.exportId);
    
    if (isNaN(exportId)) {
      return res.status(400).json({ error: "Invalid export ID" });
    }

    const exportTransaction = await storage.getExportTransaction(exportId);
    
    if (!exportTransaction) {
      return res.status(404).json({ error: "Export not found" });
    }
    
    if (exportTransaction.buyerId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    
    if (new Date() > exportTransaction.expiresAt) {
      return res.status(410).json({ error: "Export has expired" });
    }

    // Mark as downloaded
    await storage.markExportDownloaded(exportId);
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error marking export as downloaded:", error);
    res.status(500).json({ error: "Failed to mark export as downloaded" });
  }
});

export default router;