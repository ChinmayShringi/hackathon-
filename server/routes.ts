import type { Express } from "express";
import express from "express";
import session from "express-session";
import { createServer, type Server } from "http";
import path from "path";
import { WebSocket, WebSocketServer } from "ws";
import adminRouter from "./admin-router";
import cdpRouter from "./cdp-router";
import coinbaseOAuthRouter from "./coinbase-oauth-router";
import { ALPHA_CONFIG, SITE_DEPLOYMENT_TYPE, isAlphaSite } from "./config";
import { falService } from "./fal-service";
import { imageRouter } from "./image-router";
import openaiServiceRouter from "./openai-service-router";
import paymentRouter from "./payment-router";
import { initializePinecone, initializeRecipeEmbeddings, searchRecipesByVector } from "./pinecone-service";
import { generateTagDisplayData, processRecipePrompt, validateRecipeFormData } from "./recipe-processor";
import sampleGalleryRouter from "./sample-gallery-router";
import { storage } from "./storage";
import { UnifiedAuthService, getGenerationLimits, requireAuth, requireAuth as requireUnifiedAuth, unifiedAuthMiddleware } from "./unified-auth";
import unifiedAuthRouter from "./unified-auth-router";
import { videoRouter } from "./video-router";
import { Recipe, Tag, recipeOptionTagIcons, tags } from "@shared/schema";
import { and, eq, inArray, like } from "drizzle-orm";
import { db } from "./db";
import mediaLibraryRouter from "./media-library-router";

// Seed data for recipes
const INITIAL_RECIPES = [
  {
    name: "Futuristic AI Anatomy",
    slug: "futuristic-ai-anatomy",
    description: "Create glowing anatomical illustrations with digital highlight effects",
    prompt: "A digital illustration of a [SUBJECT], outlined with glowing blue lines that trace its anatomy. Set against a dark background, the contrast highlights the form and features. Emphasize [BODY_PART] with a red glow to indicate importance or interest. The style is sleek, educational, and visually striking—like advanced imaging technology.",
    instructions: "Perfect for medical illustrations, educational content, and futuristic design projects. Customize the subject and highlighted body parts for your specific needs. Works well with anatomical terms and scientific visualization.",
    category: "Digital Art",
    style: "futuristic",
    model: "gpt-image-1",
    creditCost: 6,
  },
  {
    name: "Cats in Video Games",
    slug: "cats-in-video-games",
    description: "Generate adorable cats in various video game worlds and styles",
    prompt: "A highly detailed video game screenshot showing [CAT_COUNT] [CAT_COLORS] cat characters in a [GAME_GENRE] game world. The setting features [SETTING_DESCRIPTION], and the cats are [ACTION_DESCRIPTION]. The image has a [CAMERA_STYLE] perspective with vibrant game-like lighting and textures. The art style should match the specified game genre with appropriate visual effects and atmosphere.",
    instructions: "Create charming feline characters in any video game style. Customize the number of cats, their colors and patterns, the game world environment, and camera perspective. Perfect for game concept art, character design, and whimsical digital illustrations.",
    category: "Gaming Art",
    style: "video-game",
    model: "flux-1",
    creditCost: 8,
    tokenDefinitions: {
      CAT_COUNT: {
        type: "dropdown",
        label: "Number of Cats",
        options: [
          { value: "one", label: "One Cat" },
          { value: "two", label: "Two Cats" },
          { value: "three", label: "Three Cats" },
          { value: "many", label: "Many Cats" }
        ],
        defaultValue: "one"
      },
      CAT_COLORS: {
        type: "color-picker",
        label: "Cat Colors & Patterns",
        presets: [
          { value: "orange tabby", color: "#FF8C42", label: "Orange Tabby" },
          { value: "black", color: "#2C2C2C", label: "Black" },
          { value: "white", color: "#F5F5F5", label: "White" },
          { value: "gray striped", color: "#8B8B8B", label: "Gray Striped" },
          { value: "calico", color: "gradient", label: "Calico" },
          { value: "siamese", color: "gradient", label: "Siamese" }
        ],
        allowCustom: true,
        defaultValue: "orange tabby"
      },
      GAME_GENRE: {
        type: "input",
        label: "Game Genre",
        placeholder: "e.g., platformer, RPG, retro pixel art, open-world adventure...",
        helpText: "Describe the style and genre of your video game world",
        required: true
      },
      SETTING_DESCRIPTION: {
        type: "textarea",
        label: "Setting & Environment",
        placeholder: "Describe the game world: floating islands, neon cyberpunk city, medieval castle, underwater kingdom...",
        rows: 3,
        required: false
      },
      ACTION_DESCRIPTION: {
        type: "input",
        label: "Cat Action",
        placeholder: "e.g., jumping across platforms, casting spells, racing through loops...",
        required: true
      },
      CAMERA_STYLE: {
        type: "dropdown",
        label: "Camera Style",
        options: [
          { value: "auto", label: "Auto (Based on Genre)" },
          { value: "side-scroller", label: "Side Scroller" },
          { value: "top-down", label: "Top-Down View" },
          { value: "first-person", label: "First Person" },
          { value: "third-person", label: "3D Third Person" },
          { value: "isometric", label: "Isometric" }
        ],
        defaultValue: "auto",
        autoDetect: true
      }
    }
  },
  {
    name: "Social Media Illusion",
    slug: "social-media-illusion",
    description: "Trompe-l'œil effect with subject stepping out of phone screen",
    prompt: "A trompe-l'œil illusion of a [PERSON] in [CLOTHING] appearing to step out of a giant smartphone displaying a social media interface ([SOCIAL_APP]). The screen shows a username '@[USERNAME]', 1K likes, and 12–20 comments, with floating emojis (heart eyes, smiley faces). Background of your choice.",
    instructions: "Creates viral-worthy social media content with eye-catching 3D illusion effects. Customize the person, clothing, social app, and username to match your brand or personal style. Great for Instagram, TikTok, and Facebook posts.",
    category: "Social Media",
    style: "illusion",
    model: "flux-1",
    creditCost: 7,
  },
  {
    name: "Product Showcase",
    slug: "product-showcase",
    description: "Professional product photography with studio lighting",
    prompt: "Professional product photography of [PRODUCT] with studio lighting setup. Clean white background, multiple light sources creating soft shadows, high-end commercial photography style. The product is positioned at the optimal angle showing its key features.",
    instructions: "Ideal for e-commerce listings, catalogs, and marketing materials. Replace [PRODUCT] with your specific item and describe any special features or angles you want highlighted. Produces commercial-quality results.",
    category: "Marketing",
    style: "commercial",
    model: "flux-1-pro",
    creditCost: 6,
  },
  {
    name: "Logo Text Overlay",
    slug: "logo-text-overlay",
    description: "Add professional text overlays and branding elements",
    prompt: "Add professional text overlay '[TEXT]' to the image with modern typography. The text should be well-integrated with appropriate contrast and positioning. Include subtle branding elements and maintain visual hierarchy.",
    instructions: "Enhance any image with professional text overlays. Replace [TEXT] with your specific message, brand name, or call-to-action. Perfect for social media posts, advertisements, and branded content.",
    category: "Marketing",
    style: "typography",
    model: "flux-1",
    creditCost: 2,
  },
  {
    name: "Abstract Art Generator",
    slug: "abstract-art-generator",
    description: "Generate flowing abstract compositions with color harmony",
    prompt: "Abstract art composition with flowing organic shapes in [COLOR_PALETTE] color palette. The design should have smooth gradients, dynamic movement, and balanced composition. Style: modern, minimalist, with subtle texture details.",
    instructions: "Create unique abstract artwork for galleries, prints, or digital displays. Specify your preferred color palette (e.g., warm tones, cool blues, monochrome) for personalized results. Great for interior design and artistic projects.",
    category: "Digital Art",
    style: "abstract",
    model: "flux-1",
    creditCost: 4,
  },
  {
    name: "Cyberpunk Portrait",
    slug: "cyberpunk-portrait",
    description: "Cyberpunk-style portraits with neon and digital effects",
    prompt: "Cyberpunk portrait of [SUBJECT] with neon lighting, digital glitch effects, and futuristic elements. Dark urban background with pink and blue neon lights. High contrast, dramatic lighting, detailed digital art style.",
    instructions: "Transform any subject into a stunning cyberpunk character. Describe the subject (person, character, or object) to customize the portrait. Perfect for gaming avatars, artistic projects, and futuristic design concepts.",
    category: "Digital Art",
    style: "cyberpunk",
    model: "flux-1-pro",
    creditCost: 6,
  },
  // Video Recipes
  {
    name: "Character Idle Animation",
    slug: "character-idle-animation",
    description: "Create subtle breathing and movement animations for character portraits",
    prompt: "Generate a 2-second looping idle animation of [CHARACTER]. The character should have subtle breathing movement, gentle eye blinks, and slight head movements. The animation should be smooth and natural, perfect for avatars, game characters, or digital portraits. Background remains static while only the character moves.",
    instructions: "Perfect for gaming avatars, digital characters, and interactive portraits. Specify character details and desired subtle movements. Best used for profile pictures and character showcases.",
    category: "Video Animation",
    style: "character",
    model: "runway-gen3",
    creditCost: 8,
    generationType: "video",
    videoDuration: 2,
  },
  {
    name: "Morph Between Videos",
    slug: "morph-between-videos",
    description: "Seamlessly transition between two different video clips or images",
    prompt: "Create a 5-second morphing transition from [SOURCE_VIDEO/IMAGE] to [TARGET_VIDEO/IMAGE]. The transformation should be smooth and visually appealing, with intermediate frames that blend the two sources naturally. Maintain consistent lighting and perspective throughout the morph.",
    instructions: "Great for before/after transformations, product variations, or creative transitions. Upload source and target content, specify transition style. Works with both videos and images.",
    category: "Video Transition",
    style: "morph",
    model: "runway-gen3",
    creditCost: 12,
    generationType: "video",
    videoDuration: 5,
  },
  {
    name: "Animate Video",
    slug: "animate-static-image",
    description: "Bring static images to life with natural movement and dynamics",
    prompt: "Animate this static image: [IMAGE_DESCRIPTION]. Add realistic movement such as [MOVEMENT_TYPE] over 10 seconds. The animation should feel natural and enhance the original image without distorting key elements. Maintain image quality while adding compelling motion.",
    instructions: "Transform static artwork, photos, or illustrations into dynamic videos. Specify movement type like flowing water, swaying trees, floating objects, or camera movements. Perfect for social media and presentations.",
    category: "Video Animation",
    style: "animation",
    model: "runway-gen3",
    creditCost: 15,
    generationType: "video",
    videoDuration: 10,
  },
  {
    name: "Zoom In",
    slug: "cinematic-zoom-in",
    description: "Create dramatic zoom-in effects with professional camera movement",
    prompt: "Generate a 2-second cinematic zoom-in shot starting from [WIDE_SHOT_DESCRIPTION] and smoothly zooming into [CLOSE_UP_TARGET]. The movement should be steady and professional, with slight easing at the beginning and end. Maintain focus and clarity throughout the zoom.",
    instructions: "Perfect for dramatic reveals, product showcases, or emphasis shots. Specify starting composition and zoom target. Great for marketing videos and storytelling.",
    category: "Video Camera Movement",
    style: "cinematic",
    model: "runway-gen3",
    creditCost: 6,
    generationType: "video",
    videoDuration: 2,
  },
  {
    name: "Product Rotation 360°",
    slug: "product-rotation-360",
    description: "Smooth 360-degree product rotation for e-commerce and showcases",
    prompt: "Create a 6-second smooth 360-degree rotation of [PRODUCT] on a clean background. The product should rotate at a consistent speed with professional lighting that highlights all angles. Background should be neutral and the product should remain in perfect focus throughout.",
    instructions: "Essential for e-commerce, product launches, and portfolio presentations. Specify product details and preferred background. Creates professional product showcase videos.",
    category: "Video Product",
    style: "rotation",
    model: "runway-gen3",
    creditCost: 10,
    generationType: "video",
    videoDuration: 6,
  },
  {
    name: "Text Reveal Animation",
    slug: "text-reveal-animation",
    description: "Dynamic text animations with engaging reveal effects",
    prompt: "Create a 3-second text reveal animation for '[TEXT_CONTENT]'. The text should appear with [ANIMATION_STYLE] effect against [BACKGROUND_DESCRIPTION]. Typography should be bold and readable, with smooth timing and professional presentation.",
    instructions: "Perfect for titles, quotes, announcements, and social media content. Specify text content, animation style (typewriter, fade, slide, etc.), and background preferences.",
    category: "Video Text",
    style: "typography",
    model: "runway-gen3",
    creditCost: 7,
    generationType: "video",
    videoDuration: 3,
  },
  {
    name: "Parallax Scroll Effect",
    slug: "parallax-scroll-effect",
    description: "Create depth with layered parallax scrolling animations",
    prompt: "Generate a 8-second parallax scrolling effect with [SCENE_DESCRIPTION]. Different layers should move at varying speeds to create depth - foreground elements move faster, background elements slower. The effect should be smooth and immersive.",
    instructions: "Great for website headers, storytelling, and immersive experiences. Describe scene layers and scrolling direction. Creates engaging depth and movement.",
    category: "Video Effect",
    style: "parallax",
    model: "runway-gen3",
    creditCost: 12,
    generationType: "video",
    videoDuration: 8,
  },
  {
    name: "Cinemagraph Loop",
    slug: "cinemagraph-loop",
    description: "Create mesmerizing cinemagraphs with selective motion",
    prompt: "Generate a 4-second seamless cinemagraph where [MOVING_ELEMENT] moves continuously while everything else remains perfectly still. The loop should be invisible and hypnotic, focusing attention on the single moving element against a static scene.",
    instructions: "Perfect for social media, web backgrounds, and artistic presentations. Specify which element should move (water, hair, smoke, etc.) while keeping the rest frozen in time.",
    category: "Video Cinemagraph",
    style: "loop",
    model: "runway-gen3",
    creditCost: 9,
    generationType: "video",
    videoDuration: 4,
  },
  {
    name: "Cats in Video Games",
    slug: "cats-in-video-games",
    description: "Generate imaginative video game scenes featuring cats in various gaming environments",
    prompt: "Create an imaginative video game scene featuring [CAT_COUNT] with the following color(s): [CAT_COLORS]. The setting should be inspired by a [GAME_GENRE] environment. Picture a world with [SETTING_DESCRIPTION], reminiscent of classic titles but entirely original. Think of the atmosphere and tone, not any specific characters or IP. The cats are engaged in the following activity: [ACTION_DESCRIPTION]. Their behavior should be dynamic, playful, or dramatic depending on the tone of the action. The game is viewed from a [CAMERA_STYLE] perspective, consistent with classic game design approaches such as side-scrollers, top-down adventures, or immersive open-world cameras. Ensure the scene captures the feel of a compelling, stylized video game moment — vibrant, expressive, and rich with environmental storytelling.",
    instructions: "Create unique video game-inspired artwork featuring cats in imaginative gaming environments. Customize the number of cats, their colors, game genre, setting atmosphere, actions, and camera perspective. Perfect for game concept art, character design, and whimsical gaming content.",
    category: "Gaming",
    style: "video-game",
    model: "flux-1",
    creditCost: 8,
  },
];

// Helper to expand tagHighlights to tag objects
async function expandTagHighlights(recipes: Recipe[]): Promise<(Recipe & { tagHighlightsDetailed: Tag[] })[]> {
  // Collect all unique tag IDs
  const allTagIds: number[] = Array.from(new Set(recipes.flatMap((r: Recipe) => r.tagHighlights || [])));
  if (allTagIds.length === 0) return recipes.map((r: Recipe) => ({ ...r, tagHighlightsDetailed: [] }));
  // Fetch all tag objects
  const tagRows: Tag[] = await db.select().from(tags).where(inArray(tags.id, allTagIds));
  // Map tag ID to tag object
  const tagMap: Record<number, Tag> = Object.fromEntries(tagRows.map((tag: Tag) => [tag.id, tag]));
  // Attach tag objects to each recipe, filtering out hidden tags for public display
  return recipes.map((r: Recipe) => ({
    ...r,
    tagHighlightsDetailed: (r.tagHighlights || [])
      .map((id: number) => tagMap[id])
      .filter(Boolean)
      .filter((tag: Tag) => !tag.isHidden) // Only show public tags
  }));
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static files from public directory
  app.use(express.static(path.join(process.cwd(), 'public')));
  // Configure session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-key',
    resave: true,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      sameSite: 'lax'
    }
  }));

  // Setup MagicVidio authentication system
  // Unified auth system is already initialized above

  // Apply unified auth middleware globally
  app.use(unifiedAuthMiddleware);

  // Initialize recipes if none exist
  const existingRecipes = await storage.getAllRecipes();
  if (existingRecipes.length === 0) {
    console.log("Seeding initial recipes...");
    for (const recipe of INITIAL_RECIPES) {
      await storage.createRecipe({
        name: recipe.name,
        slug: recipe.slug,
        description: recipe.description,
        prompt: recipe.prompt,
        instructions: recipe.instructions,
        category: recipe.category,
        style: recipe.style,
        model: recipe.model,
        creditCost: recipe.creditCost,
        usageCount: 0,
        isActive: true,
        recipeSteps: [{ id: '1', type: 'text_prompt', config: { prompt: recipe.prompt } }],
        generationType: (recipe as any).generationType || "image",
        videoDuration: (recipe as any).videoDuration || 10
      });
    }
    console.log("Recipes seeded successfully!");
  }

  // Initialize Pinecone and recipe embeddings
  const pinecone = await initializePinecone();
  const allRecipes = await storage.getAllRecipes();

  // Only initialize embeddings if not disabled via environment variable
  const disableEmbeddings = process.env.DISABLE_VECTOR_EMBEDDINGS === 'true';
  if (pinecone && allRecipes.length > 0 && !disableEmbeddings) {
    console.log('Initializing recipe embeddings...');
    await initializeRecipeEmbeddings(allRecipes);
  } else if (disableEmbeddings) {
    console.log('Vector embedding initialization disabled via DISABLE_VECTOR_EMBEDDINGS=true');
  }

  // Initialize unified auth service
  const authService = UnifiedAuthService.getInstance();
  await authService.initializeDebugUsers();

  // Unified auth routes
  app.use('/api/auth', unifiedAuthRouter);

  // Admin routes
  app.use('/api/admin', adminRouter);

  // Payment routes
  app.use('/api/payments', paymentRouter);

  // CDP (Coinbase Developer Platform) routes
  app.use('/api/cdp', cdpRouter);
  app.use('/api/coinbase-oauth', coinbaseOAuthRouter);

  // User routes


  // Brand asset routes
  

  // User media library routes
  app.use('/api/media-library', mediaLibraryRouter);

  // Sample gallery routes
  app.use('/api/samples', sampleGalleryRouter);

  // OpenAI service routes (GPT Image, DALL-E 2, DALL-E 3)
  app.use('/api/openai', openaiServiceRouter);

  // API Documentation endpoint for OpenAI Image Generator 1
  app.get('/api/openai/image-generator-1/docs', (req, res) => {
    res.json({
      service: "OpenAI Image Generator 1 (DALL-E 3)",
      version: "1.0.0",
      model: "dall-e-3",
      endpoints: {
        "POST /api/openai/image-generator-1/generate": {
          description: "Generate images using DALL-E 3",
          authentication: "Required",
          parameters: {
            prompt: { type: "string", required: true, maxLength: 4000 },
            size: { type: "enum", options: ["1024x1024", "1024x1792", "1792x1024"], default: "1024x1024" },
            quality: { type: "enum", options: ["standard", "hd"], default: "standard" },
            style: { type: "enum", options: ["vivid", "natural"], default: "vivid" },
            useCase: { type: "string", optional: true, description: "Auto-optimize settings for use case" },
            enhancePrompt: { type: "boolean", default: false, description: "Automatically enhance prompt" }
          },
          response: {
            success: "boolean",
            generation: {
              id: "number",
              imageUrl: "string",
              assetId: "string",
              metadata: "object"
            },
            creditsUsed: "number",
            remainingCredits: "number"
          }
        },
        "POST /api/openai/image-generator-1/validate-prompt": {
          description: "Validate prompt against DALL-E 3 constraints",
          parameters: { prompt: { type: "string", required: true } },
          response: { isValid: "boolean", error: "string?" }
        },
        "GET /api/openai/image-generator-1/optimal-settings/:useCase": {
          description: "Get optimal settings for specific use cases",
          useCases: ["portrait", "landscape", "social_media", "professional"],
          response: { useCase: "string", settings: "object", estimatedCredits: "number" }
        },
        "POST /api/openai/image-generator-1/enhance-prompt": {
          description: "Enhance prompt for better results",
          parameters: {
            prompt: { type: "string", required: true },
            style: { type: "string", optional: true }
          },
          response: { originalPrompt: "string", enhancedPrompt: "string", style: "string" }
        },
        "GET /api/openai/image-generator-1/pricing": {
          description: "Get pricing information and supported options",
          response: {
            model: "string",
            baseCredits: "number",
            pricing: "array",
            supportedSizes: "array",
            supportedQualities: "array",
            supportedStyles: "array"
          }
        },
        "GET /api/openai/image-generator-1/health": {
          description: "Check service health and configuration",
          response: {
            status: "string",
            service: "string",
            promptValidation: "boolean",
            apiKeyConfigured: "boolean",
            s3Configured: "boolean"
          }
        }
      },
      examples: {
        basicGeneration: {
          prompt: "A futuristic robot in a cyberpunk city with neon lights",
          size: "1024x1024",
          quality: "standard",
          style: "vivid"
        },
        portraitGeneration: {
          prompt: "Professional headshot of a confident businesswoman",
          useCase: "portrait",
          enhancePrompt: true
        },
        hdLandscape: {
          prompt: "Majestic mountain landscape at golden hour",
          size: "1792x1024",
          quality: "hd",
          style: "natural"
        }
      }
    });
  });

  // Static file serving for uploads
  app.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  }, express.static('uploads'));

  // Get recipes
  app.get('/api/recipes', async (req, res) => {
    try {
      const recipes = await storage.getAllRecipes();
      const recipesWithTags = await expandTagHighlights(recipes);
      res.json(recipesWithTags);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      res.status(500).json({ message: "Failed to fetch recipes" });
    }
  });

  // Get recipes grouped by category using hidden tags
  app.get('/api/recipes/by-category', async (req, res) => {
    try {
      console.log('🔍 Fetching recipes by category...');
      
      const recipes = await storage.getAllRecipes();
      console.log(`📊 Found ${recipes.length} recipes`);
      
      // Get all category tags
      const categoryTags = await db
        .select()
        .from(tags)
        .where(and(
          eq(tags.isHidden, true),
          like(tags.name, 'category:%')
        ))
        .orderBy(tags.name);
      
      console.log(`🏷️ Found ${categoryTags.length} category tags:`, categoryTags.map(t => t.name));

      // Group recipes by category
      const recipesByCategory: Record<string, any[]> = {};
      
      for (const categoryTag of categoryTags) {
        const categoryName = categoryTag.name.replace('category:', '');
        recipesByCategory[categoryName] = [];
        
        for (const recipe of recipes) {
          if (recipe.tagHighlights && recipe.tagHighlights.includes(categoryTag.id)) {
            recipesByCategory[categoryName].push(recipe);
          }
        }
        
        console.log(`📁 Category '${categoryName}': ${recipesByCategory[categoryName].length} recipes`);
      }

      // Add recipes without category tags to "uncategorized"
      const categorizedRecipeIds = new Set(
        Object.values(recipesByCategory).flat().map(r => r.id)
      );
      const uncategorizedRecipes = recipes.filter(r => !categorizedRecipeIds.has(r.id));
      
      if (uncategorizedRecipes.length > 0) {
        recipesByCategory['uncategorized'] = uncategorizedRecipes;
        console.log(`❓ Uncategorized: ${uncategorizedRecipes.length} recipes`);
      }

      console.log('✅ Sending response:', Object.keys(recipesByCategory));
      res.json(recipesByCategory);
    } catch (error) {
      console.error("❌ Error fetching recipes by category:", error);
      res.status(500).json({ error: "Failed to fetch recipes by category", details: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Test FAL API integration
  app.post("/api/test-generation", requireAuth, async (req, res) => {
    try {
      const { prompt = "a beautiful sunset over mountains" } = req.body;
      const result = await falService.generateImage(prompt, "flux-1-schnell", "photorealistic");
      res.json({ success: true, result });
    } catch (error) {
      console.error("FAL test error:", error);
      res.status(500).json({
        error: "FAL API test failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Recipe routes - REMOVED DUPLICATE (keeping the one with tag expansion above)

  // Search recipes with local and vector search
  app.post('/api/recipes/search', async (req, res) => {
    try {
      const { query, type } = req.body;

      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query is required' });
      }

      // Get all recipes for local filtering
      const allRecipes = await storage.getAllRecipes();

      // Local search - filter by title and description
      const localResults = allRecipes.filter(recipe => {
        const matchesType = !type ||
          (type === 'video' && recipe.category.toLowerCase().includes('video')) ||
          (type === 'image' && !recipe.category.toLowerCase().includes('video'));

        const matchesQuery =
          recipe.name.toLowerCase().includes(query.toLowerCase()) ||
          recipe.description.toLowerCase().includes(query.toLowerCase()) ||
          recipe.category.toLowerCase().includes(query.toLowerCase());

        return matchesType && matchesQuery;
      });

      // Vector search using Pinecone
      const vectorResults = await searchRecipesByVector(query, type, 10);

      // Combine and deduplicate results
      const combinedResults = new Map();

      // Add local results with higher priority
      localResults.forEach(recipe => {
        combinedResults.set(recipe.id, { ...recipe, score: 1.0, source: 'local' });
      });

      // Add vector results
      vectorResults.forEach(result => {
        const existingRecipe = allRecipes.find(r => r.id === result.recipeId);
        if (existingRecipe && !combinedResults.has(result.recipeId)) {
          combinedResults.set(result.recipeId, {
            ...existingRecipe,
            score: result.score,
            source: 'vector'
          });
        }
      });

      // Sort by score and return
      const finalResults = Array.from(combinedResults.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, 20);

      res.json(finalResults);
    } catch (error) {
      console.error("Error searching recipes:", error);
      res.status(500).json({ error: "Search failed" });
    }
  });

  app.get('/api/recipes/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const recipe = await storage.getRecipeById(id);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      res.json(recipe);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      res.status(500).json({ message: "Failed to fetch recipe" });
    }
  });

  app.get('/api/recipes/slug/:slug', async (req, res) => {
    try {
      const slug = req.params.slug;
      const recipe = await storage.getRecipeBySlug(slug);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      res.json(recipe);
    } catch (error) {
      console.error("Error fetching recipe by slug:", error);
      res.status(500).json({ message: "Failed to fetch recipe" });
    }
  });

  // Recipe management route for CLI operations
  app.put('/api/recipes/:id', async (req, res) => {
    try {
      const recipeId = parseInt(req.params.id);
      const updates = req.body;

      if (isNaN(recipeId)) {
        return res.status(400).json({ message: "Invalid recipe ID" });
      }

      const existingRecipe = await storage.getRecipeById(recipeId);
      if (!existingRecipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }

      const updatedRecipe = await storage.updateRecipe(recipeId, updates);
      res.json({
        message: "Recipe updated successfully",
        recipe: updatedRecipe
      });
    } catch (error) {
      console.error("Error updating recipe:", error);
      res.status(500).json({ message: "Failed to update recipe" });
    }
  });

  // Recipe management route by slug
  app.put('/api/recipes/slug/:slug', async (req, res) => {
    try {
      const slug = req.params.slug;
      const updates = req.body;

      const existingRecipe = await storage.getRecipeBySlug(slug);
      if (!existingRecipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }

      const updatedRecipe = await storage.updateRecipe(existingRecipe.id, updates);
      res.json({
        message: "Recipe updated successfully",
        recipe: updatedRecipe
      });
    } catch (error) {
      console.error("Error updating recipe:", error);
      res.status(500).json({ message: "Failed to update recipe" });
    }
  });

  // Create recipe route
  app.post('/api/recipes', requireAuth, async (req: any, res) => {
    try {
      const userId = req.userAccount.id;
      const {
        name,
        description,
        category,
        type,
        isPublic,
        hasContentRestrictions,
        steps
      } = req.body;

      // Generate slug from name
      const slug = name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();

      // Generate referral code if public and no content restrictions
      let referralCode = null;
      if (isPublic && !hasContentRestrictions) {
        referralCode = Math.random().toString(36).substring(2, 12).toUpperCase();
      }

      // Create recipe with revenue sharing enabled
      const recipe = await storage.createRecipe({
        name,
        slug,
        description,
        category,
        prompt: steps[0]?.config?.prompt || '',
        instructions: `User-created ${type} generation recipe`,
        style: 'custom',
        model: type === 'video' ? 'fal-video' : 'flux-pro',
        creditCost: type === 'video' ? 5 : 2,
        usageCount: 0,
        creatorId: userId,
        isPublic,
        hasContentRestrictions,
        revenueShareEnabled: true,
        revenueSharePercentage: 20,
        recipeSteps: steps,
        generationType: type,
        referralCode,
        isActive: true
      });

      res.json(recipe);
    } catch (error) {
      console.error("Error creating recipe:", error);
      res.status(500).json({ message: "Failed to create recipe" });
    }
  });

  // Generation routes
  app.post('/api/generate', requireUnifiedAuth, async (req: any, res) => {
    try {
      const userId = req.userAccount.id;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { recipeId, formData, isFlashRequest = false } = req.body;
      const recipe = await storage.getRecipeById(recipeId);

      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }

      // Check credits with allowDebit logic
      const { creditsRemaining, allowDebit } = getGenerationLimits(req.userAccount);
      if (creditsRemaining < recipe.creditCost && !allowDebit) {
        return res.status(400).json({ message: "Insufficient credits" });
      }

      // Import Smart Generator service
      const { SmartGenerator } = await import("./smart-generator");
      const smartGenerator = new SmartGenerator();

      let finalPrompt: string;
      let generationMetadata: any = {};

      if (isFlashRequest) {
        // Flash mode: Get random backlog video with synthetic variables
        const backlogVideo = await smartGenerator.getRandomBacklogVideo(recipeId);

        if (!backlogVideo) {
          console.log(`No backlog videos available for recipe ${recipeId} - should fallback to modal`);
          return res.status(404).json({
            message: "No backlog videos available for this recipe. Try Build mode instead.",
            shouldFallbackToModal: true
          });
        }

        // Use the variables from the backlog video to create synthetic prompt
        const backlogVariables = backlogVideo.recipeVariables as Record<string, any>;
        const processedResult = processRecipePrompt(recipe, backlogVariables);
        finalPrompt = processedResult.prompt;
        generationMetadata = {
          formData: backlogVariables,
          isFlashRequest: true,
          backlogVideoId: backlogVideo.id
        };

        // Mark backlog video as used (create a dummy smart request ID for tracking)
        const dummyRequestId = 0; // We'll handle this properly later
        await storage.markBacklogVideoAsUsed(backlogVideo.id, dummyRequestId);
      } else {
        // Build mode: Use provided form data
        if (formData) {
          // Validate form data against recipe structure
          const validation = validateRecipeFormData(recipe, formData);
          if (!validation.isValid) {
            return res.status(400).json({
              message: "Invalid form data",
              errors: validation.errors
            });
          }

          // Process the prompt with form data
          const processedResult = processRecipePrompt(recipe, formData);
          finalPrompt = processedResult.prompt;
          generationMetadata = { formData, isFlashRequest: false };
        } else {
          // Legacy parameter handling
          const { parameters } = req.body;
          finalPrompt = recipe.prompt;
          if (parameters) {
            Object.entries(parameters).forEach(([key, value]) => {
              finalPrompt = finalPrompt.replace(new RegExp(`\\[${key}\\]`, 'g'), value as string);
            });
          }
          generationMetadata = { originalParameters: parameters, isFlashRequest: false };
        }
      }

      const generation = await storage.createGeneration({
        userId,
        recipeId,
        prompt: finalPrompt,
        status: "pending",
        recipeTitle: recipe.name,
        creditsCost: recipe.creditCost,
        metadata: {
          ...generationMetadata,
          request_origin: "user"
        }
      }, req.userAccount.sessionToken);

      // Deduct credits
      const newCredits = user.credits - recipe.creditCost;
      await storage.updateUserCredits(userId, newCredits);

      // Create credit transaction
      await storage.createCreditTransaction({
        userId,
        amount: -recipe.creditCost,
        type: "usage",
        description: `Generated content using ${recipe.name}${isFlashRequest ? ' (Flash)' : ''}`,
      });

      // Increment recipe usage
      await storage.incrementRecipeUsage(recipeId);

      // Add to generation queue for processing with OpenAI
      const { generationQueue } = await import("./queue-service");
      await generationQueue.addToQueue(generation, generationMetadata.formData || {});

      res.json({
        message: isFlashRequest ? "Flash generation started" : "Generation started",
        generationId: generation.id,
        remainingCredits: newCredits,
        isFlashRequest
      });

    } catch (error) {
      console.error("Error starting generation:", error);
      res.status(500).json({ message: "Failed to start generation" });
    }
  });

  // Check generation availability for current variables
  app.get('/api/generate/availability', requireUnifiedAuth, async (req: any, res) => {
    try {
      const { recipeId, formData } = req.query;

      if (!recipeId) {
        return res.status(400).json({ message: "Recipe ID is required" });
      }

      const { SmartGenerator } = await import("./smart-generator");
      const smartGenerator = new SmartGenerator();

      // Parse formData if it's a string
      let parsedFormData: Record<string, any> = {};
      if (formData) {
        try {
          parsedFormData = typeof formData === 'string' ? JSON.parse(formData) : formData;
        } catch (e) {
          return res.status(400).json({ message: "Invalid formData format" });
        }
      }

      const availability = await smartGenerator.checkBacklogAvailability(
        parseInt(recipeId as string),
        parsedFormData
      );

      res.json({
        hasBacklog: availability.hasBacklogEntry,
        backlogCount: availability.hasBacklogEntry ? 1 : 0,
        canFlash: availability.hasBacklogEntry && !availability.isUsed
      });

    } catch (error) {
      console.error("Error checking availability:", error);
      res.status(500).json({ message: "Failed to check availability" });
    }
  });

  // User dashboard routes
  app.get('/api/user/generations', requireUnifiedAuth, async (req: any, res) => {
    try {
      const userId = req.userAccount.id;
      const generations = await storage.getUserGenerations(userId);
      res.json(generations.data);
    } catch (error) {
      console.error("Error fetching user generations:", error);
      res.status(500).json({ message: "Failed to fetch generations" });
    }
  });

  app.get('/api/generations', requireUnifiedAuth, async (req: any, res) => {
    try {
      const userId = req.userAccount.id;

      // Validate and sanitize pagination parameters
      // Support both 'per_page' (production standard) and 'limit' (backward compatibility)
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.per_page as string) || parseInt(req.query.limit as string) || 10));
      const offset = (page - 1) * limit;

      // Extract and validate status filter
      const status = req.query.status as string;
      const validStatuses = ['pending', 'completed', 'failed', 'processing'];
      const statusFilter = status && validStatuses.includes(status) ? status : undefined;

      const generations = await storage.getUserGenerations(userId, { page, limit, offset, status: statusFilter });

      // Add proper URLs for user's own content
      const generationsWithUrls = generations.data.map(gen => ({
        ...gen,
        // Always use user-bound URL for their own content
        viewUrl: gen.shortId ? `/m/${userId}/${gen.shortId}` : null,
        publicShareUrl: gen.shortId && gen.isPublic ? `/m/${gen.shortId}` : null,
        privateShareUrl: gen.shortId ? `/m/${userId}/${gen.shortId}` : null
      }));

      res.json({
        generations: generationsWithUrls,
        pagination: {
          page,
          limit,
          total: generations.total,
          totalPages: Math.ceil(generations.total / limit),
          hasNext: page < Math.ceil(generations.total / limit),
          hasPrevious: page > 1
        }
      });
    } catch (error) {
      console.error("Error fetching generations:", error);
      res.status(500).json({ message: "Failed to fetch generations" });
    }
  });

  // Retry failed generation
  app.post('/api/generations/:id/retry', requireAuth, async (req: any, res) => {
    try {
      const generationId = parseInt(req.params.id);
      const userId = req.userAccount.id;

      const generations = await storage.getUserGenerations(userId);
      const generation = generations.data.find(g => g.id === generationId);

      if (!generation) {
        return res.status(404).json({ error: "Generation not found" });
      }

      if (generation.status !== 'failed') {
        return res.status(400).json({ error: "Can only retry failed generations" });
      }

      if (generation.retryCount >= generation.maxRetries) {
        return res.status(400).json({ error: "Maximum retry attempts exceeded" });
      }

      const retryGeneration = await storage.retryGeneration(generationId);
      if (!retryGeneration) {
        return res.status(400).json({ error: "Failed to retry generation" });
      }

      const formData = (generation.metadata as any)?.formData || {};
      const { generationQueue } = await import("./queue-service");
      await generationQueue.addToQueue(retryGeneration, formData);

      res.json({
        message: "Generation retry initiated",
        generation: retryGeneration
      });
    } catch (error) {
      console.error("Error retrying generation:", error);
      res.status(500).json({ error: "Failed to retry generation" });
    }
  });

  // Get detailed failure information
  app.get('/api/generations/:id/failure-details', requireAuth, async (req: any, res) => {
    try {
      const generationId = parseInt(req.params.id);
      const userId = req.userAccount.id;

      const generations = await storage.getUserGenerations(userId);
      const generation = generations.data.find(g => g.id === generationId);

      if (!generation) {
        return res.status(404).json({ error: "Generation not found" });
      }

      res.json({
        id: generation.id,
        status: generation.status,
        failureReason: generation.failureReason,
        retryCount: generation.retryCount,
        maxRetries: generation.maxRetries,
        canRetry: generation.status === 'failed' && generation.retryCount < generation.maxRetries,
        creditsRefunded: generation.creditsRefunded,
        creditsCost: generation.creditsCost,
        createdAt: generation.createdAt,
        updatedAt: generation.updatedAt
      });
    } catch (error) {
      console.error("Error fetching failure details:", error);
      res.status(500).json({ error: "Failed to fetch failure details" });
    }
  });

  // Queue statistics
  app.get('/api/queue/stats', async (req, res) => {
    try {
      const stats = await storage.getQueueStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching queue stats:", error);
      res.status(500).json({ message: "Failed to fetch queue stats" });
    }
  });



  // Custom video creation
  app.post('/api/custom-video/create', requireAuth, async (req: any, res) => {
    try {
      const userId = req.userAccount.id;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Custom video costs more credits (e.g., 20 credits)
      const videoCost = 20;

      // Check credits with allowDebit logic
      const { creditsRemaining, allowDebit } = getGenerationLimits(req.userAccount);
      if (creditsRemaining < videoCost && !allowDebit) {
        return res.status(400).json({
          message: "Insufficient credits",
          required: videoCost,
          available: creditsRemaining
        });
      }

      const { prompt, duration = 10, type = 'custom_video' } = req.body;

      if (!prompt || prompt.trim().length === 0) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      // Create generation record
      const generation = await storage.createGeneration({
        userId,
        recipeId: 0, // Custom video doesn't use a recipe, using 0 as placeholder
        recipeTitle: "Custom Video",
        prompt,
        status: "queued",
        metadata: JSON.stringify({
          duration: parseInt(duration),
          type,
          isCustomVideo: true,
          request_origin: "user"
        })
      }, req.userAccount.sessionToken);

      // Deduct credits
      const newCredits = user.credits - videoCost;
      await storage.updateUserCredits(userId, newCredits);

      // Create credit transaction
      await storage.createCreditTransaction({
        userId,
        amount: -videoCost,
        type: "usage",
        description: `Custom video creation (${duration}s)`,
      });

      // Process video creation using video router
      setTimeout(async () => {
        try {
          await storage.updateGenerationStatus(generation.id, "processing");

          // Use video router to select appropriate provider
          const videoOptions = {
            prompt,
            duration: parseInt(duration),
            provider: "fal" as const, // Default for custom videos
            style: "cinematic",
            aspectRatio: "16:9" as const,
            quality: "hd" as const,
          };

          const videoResult = await videoRouter.generateVideo(videoOptions);

          if (videoResult.status === "completed" && videoResult.videoUrl) {
            await storage.updateGenerationStatus(generation.id, "completed", videoResult.videoUrl);
          } else {
            await storage.updateGenerationStatus(generation.id, "failed");
          }
        } catch (error) {
          console.error("Error processing custom video:", error);
          await storage.updateGenerationStatus(generation.id, "failed");
        }
      }, 2000);

      res.json({
        message: "Custom video creation started",
        id: generation.id,
        remainingCredits: newCredits,
        estimatedTime: "30-60 seconds"
      });

    } catch (error) {
      console.error("Error creating custom video:", error);
      res.status(500).json({ message: "Failed to create custom video" });
    }
  });

  // Recipe-based video generation
  app.post('/api/recipes/:id/generate-video', requireAuth, async (req: any, res) => {
    try {
      const userId = req.userAccount.id;
      const recipeId = parseInt(req.params.id);
      const { parameters, duration } = req.body;

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const recipe = await storage.getRecipeById(recipeId);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }

      // Video generation costs more credits
      const videoCreditCost = recipe.creditCost * 3;

      // Check credits with allowDebit logic
      const { creditsRemaining, allowDebit } = getGenerationLimits(req.userAccount);
      if (creditsRemaining < videoCreditCost && !allowDebit) {
        return res.status(400).json({
          message: "Insufficient credits for video generation",
          required: videoCreditCost,
          available: creditsRemaining
        });
      }

      // Replace parameters in prompt
      let prompt = recipe.prompt;
      if (parameters && typeof parameters === 'object') {
        Object.entries(parameters).forEach(([key, value]) => {
          prompt = prompt.replace(new RegExp(`\\[${key}\\]`, 'g'), value as string);
        });
      }

      const generation = await storage.createGeneration({
        userId,
        recipeId,
        prompt,
        status: "pending",
        recipeTitle: `${recipe.name} (Video)`,
        metadata: JSON.stringify({
          type: "video",
          duration: duration || recipe.videoDuration || 10,
          provider: recipe.videoProvider || "fal",
          request_origin: "user"
        })
      }, req.userAccount.sessionToken);

      // Deduct credits
      const newCredits = user.credits - videoCreditCost;
      await storage.updateUserCredits(userId, newCredits);

      // Create credit transaction
      await storage.createCreditTransaction({
        userId,
        amount: -videoCreditCost,
        type: "usage",
        description: `Generated video using ${recipe.name}`,
      });

      // Increment recipe usage
      await storage.incrementRecipeUsage(recipeId);

      // Process video generation using video router
      setTimeout(async () => {
        try {
          await storage.updateGenerationStatus(generation.id, "processing");

          const optimalSettings = videoRouter.getOptimalSettings(recipe.model, recipe.style);

          const videoOptions = {
            prompt,
            duration: duration || 10,
            provider: recipe.videoProvider as "fal" | "openai" || optimalSettings.provider || "fal",
            style: recipe.style,
            aspectRatio: recipe.videoAspectRatio as "16:9" | "9:16" | "1:1" || optimalSettings.aspectRatio || "16:9",
            quality: recipe.videoQuality as "standard" | "hd" | "4k" || optimalSettings.quality || "hd",
          };

          const videoResult = await videoRouter.generateVideo(videoOptions);

          if (videoResult.status === "completed" && videoResult.videoUrl) {
            await storage.updateGenerationStatus(generation.id, "completed", videoResult.videoUrl);
          } else {
            await storage.updateGenerationStatus(generation.id, "failed");
          }
        } catch (error) {
          console.error("Error generating video:", error);
          await storage.updateGenerationStatus(generation.id, "failed");
        }
      }, 2000);

      res.json({
        message: "Video generation started",
        generationId: generation.id,
        remainingCredits: newCredits,
        estimatedTime: "30-120 seconds",
        provider: recipe.videoProvider || "fal"
      });

    } catch (error) {
      console.error("Error starting video generation:", error);
      res.status(500).json({ message: "Failed to start video generation" });
    }
  });

  app.get('/api/user/transactions', requireAuth, async (req: any, res) => {
    try {
      const userId = req.userAccount.id;
      const transactions = await storage.getUserCreditTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Credit purchase route (mocked)
  app.post('/api/credits/purchase', requireAuth, async (req: any, res) => {
    try {
      const userId = req.userAccount.id;
      const { amount, package: packageType } = req.body;

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Mock successful payment
      const newCredits = user.credits + amount;
      await storage.updateUserCredits(userId, newCredits);

      await storage.createCreditTransaction({
        userId,
        amount,
        type: "purchase",
        description: `Purchased ${packageType} credit package`,
      });

      res.json({
        message: "Credits purchased successfully",
        newBalance: newCredits
      });

    } catch (error) {
      console.error("Error purchasing credits:", error);
      res.status(500).json({ message: "Failed to purchase credits" });
    }
  });

  // Image provider availability and features
  app.get('/api/image/providers', requireAuth, async (req, res) => {
    try {
      const providers = {
        fal: {
          available: await imageRouter.checkProviderAvailability("fal"),
          features: imageRouter.getSupportedFeatures("fal"),
        },
        openai: {
          available: await imageRouter.checkProviderAvailability("openai"),
          features: imageRouter.getSupportedFeatures("openai"),
        },
        midjourney: {
          available: await imageRouter.checkProviderAvailability("midjourney"),
          features: imageRouter.getSupportedFeatures("midjourney"),
        },
      };
      res.json(providers);
    } catch (error) {
      console.error("Error checking image provider availability:", error);
      res.status(500).json({ message: "Failed to check image provider availability" });
    }
  });

  // Video provider availability and features
  app.get('/api/video/providers', requireAuth, async (req, res) => {
    try {
      const providers = {
        fal: {
          available: await videoRouter.checkProviderAvailability("fal"),
          features: videoRouter.getSupportedFeatures("fal"),
        },
        openai: {
          available: await videoRouter.checkProviderAvailability("openai"),
          features: videoRouter.getSupportedFeatures("openai"),
        },
      };
      res.json(providers);
    } catch (error) {
      console.error("Error checking provider availability:", error);
      res.status(500).json({ message: "Failed to check provider availability" });
    }
  });

  // Test image generation with specific provider
  app.post('/api/image/test', requireAuth, async (req, res) => {
    try {
      const {
        prompt = "a beautiful landscape photograph",
        provider = "fal",
        style = "photorealistic",
        quality = "hd",
        imageSize = "landscape_4_3"
      } = req.body;

      const imageOptions = {
        prompt,
        provider: provider as "fal" | "openai" | "midjourney",
        style,
        quality: quality as "standard" | "hd" | "ultra",
        imageSize: imageSize as any,
        numImages: 1,
      };

      const result = await imageRouter.generateImage(imageOptions);
      res.json({ success: true, result });
    } catch (error) {
      console.error("Image test error:", error);
      res.status(500).json({
        error: "Image generation test failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Test video generation with specific provider
  app.post('/api/video/test', requireAuth, async (req, res) => {
    try {
      const { prompt = "a beautiful cinematic scene", provider = "fal", duration = 5 } = req.body;

      const videoOptions = {
        prompt,
        duration,
        provider: provider as "fal" | "openai",
        style: "cinematic",
        aspectRatio: "16:9" as const,
        quality: "hd" as const,
      };

      const result = await videoRouter.generateVideo(videoOptions);
      res.json({ success: true, result });
    } catch (error) {
      console.error("Video test error:", error);
      res.status(500).json({
        error: "Video generation test failed",
        details: error instanceof Error ? error.message : "Unknown error"
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
        seed
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
        seed
      });

      const result = await falService.generateTextToVideoWithKling({
        prompt,
        aspect_ratio,
        duration,
        generate_audio,
        seed
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
        generate_audio: true
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

  // Enhanced video generation with Kling AI 2.1 workflow: Flux Dev → Kling AI 2.1 → MMAudio
  app.post('/api/video/enhanced-kling-generate', requireAuth, async (req: any, res) => {
    try {
      const { prompt, style = "cinematic", imageOptions = {}, useMMAudio = true } = req.body;

      if (!prompt) {
        return res.status(400).json({
          message: "Prompt is required"
        });
      }

      console.log("Generating enhanced video with Kling AI 2.1 workflow:", { prompt, style, useMMAudio });

      const result = await falService.generateEnhancedVideoWithKling(prompt, style, imageOptions, useMMAudio);

      res.json({
        success: true,
        video: result,
        message: `Enhanced video with Kling AI 2.1 workflow generated successfully${result.mmaudioUsed ? ' (with MMAudio)' : ''}`
      });

    } catch (error) {
      console.error("Error in enhanced Kling AI 2.1 video generation:", error);
      res.status(500).json({
        message: "Failed to generate enhanced video with Kling AI 2.1 workflow",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Test endpoint for enhanced Kling AI 2.1 workflow
  app.get('/api/video/test-enhanced-kling', requireAuth, async (req: any, res) => {
    try {
      const testPrompt = "A majestic eagle soaring through mountain peaks at golden hour, cinematic lighting, smooth motion";

      console.log("Testing enhanced Kling AI 2.1 workflow with:", testPrompt);

      const result = await falService.generateEnhancedVideoWithKling(testPrompt, "cinematic");

      res.json({
        success: true,
        test: true,
        result: result,
        message: "Enhanced Kling AI 2.1 workflow test completed"
      });

    } catch (error) {
      console.error("Error in enhanced Kling AI 2.1 workflow test:", error);
      res.status(500).json({
        message: "Enhanced Kling AI 2.1 workflow test failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Process recipe prompt for Kling testing
  app.post('/api/recipes/process-prompt', requireAuth, async (req, res) => {
    try {
      const { recipeId, formData } = req.body;

      if (!recipeId || !formData) {
        return res.status(400).json({
          message: "Recipe ID and form data are required"
        });
      }

      const recipe = await storage.getRecipeById(recipeId);
      if (!recipe) {
        return res.status(404).json({
          message: "Recipe not found"
        });
      }

      // Process the recipe prompt using the existing processor
      const { processRecipePrompt } = await import('./recipe-processor');
      const processedResult = processRecipePrompt(recipe, formData);

      res.json({
        success: true,
        prompt: processedResult.prompt,
        extractedVariables: processedResult.extractedVariables
      });

    } catch (error) {
      console.error("Recipe prompt processing error:", error);
      res.status(500).json({
        error: "Recipe prompt processing failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Individual generation route - /api/generations/[id]
  app.get("/api/generations/:id", async (req: any, res) => {
    try {
      const generationId = parseInt(req.params.id);
      const userId = req.userAccount?.id || null; // Optional for public access

      const generation = await storage.getGenerationById(generationId);
      if (!generation) {
        return res.status(404).json({ message: "Generation not found" });
      }

      // Check access permissions: owner can always access, others can only access public content
      if (generation.userId !== userId && !generation.isPublic) {
        return res.status(403).json({ message: "Access denied" });
      }

      const recipe = generation.recipeId ? await storage.getRecipeById(generation.recipeId) : null;
      const creator = await storage.getUser(generation.userId);

      res.json({
        id: generation.id,
        assetId: generation.assetId,
        shortId: generation.shortId,
        imageUrl: generation.imageUrl || generation.secureUrl,
        secureUrl: generation.secureUrl,
        videoUrl: generation.videoUrl,
        type: generation.type,
        status: generation.status,
        prompt: generation.prompt,
        isPublic: generation.isPublic,
        metadata: generation.metadata,
        createdAt: generation.createdAt,
        creditsCost: generation.creditsCost,
        // For logged-in users viewing their own content, use private URL; for public access, use public URL if available
        viewUrl: generation.shortId ?
          (userId && userId !== 'undefined' ? `/m/${userId}/${generation.shortId}` : `/m/${generation.shortId}`) : null,
        publicShareUrl: generation.shortId && generation.isPublic ?
          `/m/${generation.shortId}` : null,
        privateShareUrl: generation.shortId && userId ?
          `/m/${userId}/${generation.shortId}` : null,
        recipe: recipe ? {
          id: recipe.id,
          name: recipe.name,
          slug: recipe.slug,
          category: recipe.category
        } : null,
        creator: creator ? {
          id: creator.id,
          handle: creator.handle,
          firstName: creator.firstName,
          lastName: creator.lastName
        } : null
      });
    } catch (error) {
      console.error("Error fetching generation:", error);
      res.status(500).json({ message: "Failed to fetch generation" });
    }
  });

  // Toggle generation privacy
  app.patch("/api/generations/:id/privacy", requireAuth, async (req: any, res) => {
    try {
      const generationId = parseInt(req.params.id);
      const userId = req.userAccount.id;
      const { isPublic } = req.body;

      const generation = await storage.getGenerationById(generationId);
      if (!generation) {
        return res.status(404).json({ message: "Generation not found" });
      }

      // Check if user owns this generation
      if (generation.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Update privacy setting using storage
      await storage.updateGenerationPrivacy(generationId, isPublic);

      res.json({
        message: "Privacy setting updated",
        isPublic,
        publicShareUrl: generation.shortId && isPublic ?
          `/m/${generation.shortId}` : null
      });
    } catch (error) {
      console.error("Error updating privacy:", error);
      res.status(500).json({ message: "Failed to update privacy setting" });
    }
  });

  // Secure media serving routes - /m/{shortId} and /m/{userId}/{shortId}
  app.get("/m/:shortId", async (req, res) => {
    try {
      const { shortId } = req.params;

      // Find generation by shortId
      const generation = await storage.getGenerationByShortId(shortId);
      if (!generation) {
        return res.status(404).json({ message: "Media not found" });
      }

      // Check if media is public
      if (!generation.isPublic) {
        return res.status(403).json({ message: "This media is private" });
      }

      // Redirect to secure URL
      const mediaUrl = generation.secureUrl || generation.imageUrl;
      if (mediaUrl && typeof mediaUrl === 'string') {
        return res.redirect(mediaUrl);
      }

      return res.status(404).json({ message: "Media file not available" });
    } catch (error) {
      console.error("Error serving public media:", error);
      res.status(500).json({ message: "Failed to serve media" });
    }
  });

  app.get("/m/:userId/:shortId", requireAuth, async (req: any, res) => {
    try {
      const { userId, shortId } = req.params;
      const requestingUserId = req.userAccount.id;

      // Find generation by shortId
      const generation = await storage.getGenerationByShortId(shortId);
      if (!generation) {
        return res.status(404).json({ message: "Media not found" });
      }

      // Check ownership
      if (generation.userId !== userId) {
        return res.status(404).json({ message: "Media not found" });
      }

      // Check access permission (owner or public)
      if (generation.userId !== requestingUserId && !generation.isPublic) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Redirect to secure URL
      const mediaUrl = generation.secureUrl || generation.imageUrl;
      if (mediaUrl && typeof mediaUrl === 'string') {
        return res.redirect(mediaUrl);
      }

      return res.status(404).json({ message: "Media file not available" });
    } catch (error) {
      console.error("Error serving private media:", error);
      res.status(500).json({ message: "Failed to serve media" });
    }
  });

  // Asset viewing routes - /api/assets/[assetId]
  app.get("/api/assets/:assetId", async (req, res) => {
    try {
      const { assetId } = req.params;

      const generation = await storage.getGenerationByAssetId(assetId);
      if (!generation) {
        return res.status(404).json({ message: "Asset not found" });
      }

      const recipe = generation.recipeId ? await storage.getRecipeById(generation.recipeId) : null;
      const user = await storage.getUser(generation.userId);

      res.json({
        id: generation.id,
        assetId: generation.assetId,
        imageUrl: generation.imageUrl,
        type: generation.type,
        status: generation.status,
        metadata: generation.metadata,
        createdAt: generation.createdAt,
        recipe: recipe ? {
          id: recipe.id,
          name: recipe.name,
          slug: recipe.slug,
          category: recipe.category
        } : null,
        creator: user ? {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName
        } : null
      });
    } catch (error) {
      console.error("Error fetching asset:", error);
      res.status(500).json({ message: "Failed to fetch asset" });
    }
  });

  // Video streaming endpoint
  app.get('/api/stream-video/:shortId', async (req, res) => {
    try {
      const shortId = req.params.shortId;

      // Only use short ID lookup
      const generation = await storage.getGenerationByShortId(shortId);

      if (!generation) {
        return res.status(404).json({ error: 'Video not found' });
      }

      // Determine the video URL - check multiple possible sources
      let videoUrl = generation.videoUrl;
      if (!videoUrl) {
        // Check if imageUrl is actually a video (common for legacy generations)
        if (generation.imageUrl && (generation.imageUrl.includes('.mp4') || generation.imageUrl.includes('.mov') || generation.imageUrl.includes('.webm'))) {
          videoUrl = generation.imageUrl;
        }
        // Check metadata for CDN URL
        else if (generation.metadata && (generation.metadata as any).cdnUrl) {
          videoUrl = (generation.metadata as any).cdnUrl;
        }
      }

      if (!videoUrl) {
        return res.status(404).json({ error: 'Video not found' });
      }

      // Handle range requests for video streaming
      const range = req.headers.range;
      const headers: Record<string, string> = {};
      if (range) {
        headers['Range'] = range;
      }

      // Set a timeout for the fetch request (10 seconds)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      // Fetch the video from the external URL with timeout
      const response = await fetch(videoUrl, {
        signal: controller.signal,
        headers
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return res.status(response.status).json({ error: 'Failed to fetch video' });
      }

      // Get video content type
      const contentType = response.headers.get('content-type') || 'video/mp4';

      // Set proper headers for streaming
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', 'inline');
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Range');

      // Handle range response headers
      const contentRange = response.headers.get('content-range');
      const contentLength = response.headers.get('content-length');
      if (contentRange) {
        res.setHeader('Content-Range', contentRange);
      }
      if (contentLength) {
        res.setHeader('Content-Length', contentLength);
      }
      // Set status code for range requests
      if (range && response.status === 206) {
        res.status(206);
      }

      // Stream the response body directly to the client
      if (response.body) {
        try {
          const { Readable } = await import('stream');
          let nodeStream;
          if (typeof Readable.fromWeb === 'function') {
            nodeStream = Readable.fromWeb(response.body as any);
          } else {
            // Fallback: read the entire response and send it
            const buffer = await response.arrayBuffer();
            res.send(Buffer.from(buffer));
            return;
          }
          nodeStream.pipe(res);
          nodeStream.on('end', () => res.end());
          nodeStream.on('error', (err: any) => {
            console.error('Stream error:', err);
            res.end();
          });
        } catch (streamError) {
          console.error('Error converting stream:', streamError);
          const buffer = await response.arrayBuffer();
          res.send(Buffer.from(buffer));
        }
      } else {
        // Fallback: read the entire response and send it
        const buffer = await response.arrayBuffer();
        res.send(Buffer.from(buffer));
      }

    } catch (error: any) {
      console.error('Error streaming video:', error);

      // Handle timeout errors
      if (error.name === 'AbortError') {
        return res.status(408).json({ error: 'Video request timeout' });
      }

      res.status(500).json({ error: 'Failed to stream video' });
    }
  });



  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Store authenticated connections with user IDs
  const authenticatedConnections = new Map<string, WebSocket[]>();

  wss.on('connection', (ws, req) => {
    console.log('WebSocket connection established');

    let userId: string | null = null;

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.type === 'auth' && data.userId && typeof data.userId === 'string') {
          const authUserId = data.userId as string;
          userId = authUserId;

          // Add connection to user's connection list
          if (!authenticatedConnections.has(authUserId)) {
            authenticatedConnections.set(authUserId, []);
          }
          authenticatedConnections.get(authUserId)?.push(ws);

          console.log(`WebSocket authenticated for user: ${authUserId}`);
          ws.send(JSON.stringify({ type: 'auth_success', userId: authUserId }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      if (userId && typeof userId === 'string') {
        // Remove connection from user's connection list
        const connections = authenticatedConnections.get(userId);
        if (connections) {
          const index = connections.indexOf(ws);
          if (index > -1) {
            connections.splice(index, 1);
          }
          if (connections.length === 0) {
            authenticatedConnections.delete(userId);
          }
        }
      }
      console.log('WebSocket connection closed');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  // Export broadcast function for use in other modules
  (global as any).broadcastToUser = (userId: string, data: any) => {
    const connections = authenticatedConnections.get(userId);
    if (connections) {
      connections.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      });
    }
  };

  // Test health endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      deploymentType: SITE_DEPLOYMENT_TYPE
    });
  });

  // Alpha site API routes
  if (isAlphaSite()) {


    // Get guest recipes
    app.get('/api/alpha/recipes', async (req, res) => {
      try {
        const allRecipes = await storage.getAllRecipes();
        const guestRecipes = allRecipes.filter(recipe =>
          ALPHA_CONFIG.guestRecipes.includes(recipe.slug)
        );
        const guestRecipesWithTags = await expandTagHighlights(guestRecipes);
        res.json(guestRecipesWithTags);
      } catch (error) {
        console.error("Error fetching guest recipes:", error);
        res.status(500).json({ message: "Failed to fetch recipes" });
      }
    });

    // Get guest stats - updated to use unified auth
    app.get('/api/alpha/guest-stats', async (req, res) => {
      try {
        if (!req.userAccount) {
          return res.status(400).json({ message: "Guest session not found" });
        }

        // Get credit refresh info efficiently (without triggering refresh)
        const refreshInfo = await storage.getCreditRefreshInfo(req.userAccount.id);

        // Only trigger refresh if user can actually refresh (time is up AND has <10 credits)
        let refreshResult = { refreshed: false, creditsAdded: 0, nextRefreshInSeconds: refreshInfo.nextRefreshInSeconds };
        if (refreshInfo.canRefresh) {
          refreshResult = await storage.checkAndRefreshDailyCredits(req.userAccount.id);
        }

        // Get fresh user data after potential refresh
        const freshUser = await storage.getUser(req.userAccount.id);
        if (!freshUser) {
          return res.status(400).json({ message: "User not found" });
        }

        // Get updated credit-based limits after potential refresh
        const { creditsRemaining } = getGenerationLimits({
          ...req.userAccount,
          credits: freshUser.credits
        });

        // Get actual generation count for the badge - use user ID instead of session token
        const generationStats = await storage.getGuestGenerationStats(req.userAccount.id);

        const stats = {
          used: generationStats.total, // Show actual number of generations made
          remaining: creditsRemaining,
          refreshSecondsLeft: Math.floor(refreshResult.nextRefreshInSeconds)
        };

        res.json(stats);
      } catch (error) {
        console.error("Error fetching guest stats:", error);
        res.status(500).json({ message: "Failed to fetch guest stats" });
      }
    });

    // Get guest generation stats (global) - updated to use unified auth
    app.get('/api/alpha/my-makes-stats', async (req, res) => {
      try {
        if (!req.userAccount) {
          return res.status(400).json({ message: "Guest session not found" });
        }
        const stats = await storage.getGuestGenerationStats(req.userAccount.id);
        res.json(stats);
      } catch (error: unknown) {
        console.error("Error fetching guest generation stats:", error);

        // FIXED: Better error handling with specific error messages
        if (error instanceof Error) {
          if (error.message.includes('ENOTFOUND') || error.message.includes('connection')) {
            return res.status(503).json({
              message: "Database temporarily unavailable. Please try again in a moment.",
              retryAfter: 5
            });
          }
        }

        res.status(500).json({
          message: "Failed to fetch guest generation stats",
          error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
        });
      }
    });

    // Guest generation - updated to use unified auth
    app.post('/api/alpha/generate', async (req, res) => {
      try {
        if (!req.userAccount) {
          return res.status(400).json({ message: "Guest session not found" });
        }

        // Get user's credit limits
        const { creditsRemaining } = getGenerationLimits(req.userAccount);

        const { recipeId, formData } = req.body;

        if (!recipeId) {
          return res.status(400).json({ message: "Recipe ID is required" });
        }

        const recipe = await storage.getRecipeById(recipeId);
        if (!recipe) {
          return res.status(404).json({ message: "Recipe not found" });
        }



        // Verify recipe is allowed for guests
        if (!ALPHA_CONFIG.guestRecipes.includes(recipe.slug)) {
          return res.status(403).json({ message: "Recipe not available for guests" });
        }

        // Check if user has enough credits for this recipe
        if (creditsRemaining < recipe.creditCost && !req.userAccount.allowDebit) {
          return res.status(400).json({
            title: "Insufficient Credits",
            message: `You need ${recipe.creditCost} credits to use this recipe. You have ${creditsRemaining} credits remaining.`,
            creditsRemaining: creditsRemaining,
            required: recipe.creditCost
          });
        }

        // Validate form data
        if (formData) {
          const validation = validateRecipeFormData(recipe, formData);
          if (!validation.isValid) {
            return res.status(400).json({
              message: "Invalid form data",
              errors: validation.errors
            });
          }
        }

        // Process the prompt
        let finalPrompt = recipe.prompt;
        let extractedVariables = {};
        if (formData) {
          const processedResult = processRecipePrompt(recipe, formData);
          finalPrompt = processedResult.prompt;
          extractedVariables = processedResult.extractedVariables;
        }

        // Generate tag display data for UI
        const tagDisplayData = await generateTagDisplayData(recipe, formData || {});

        // Create generation using unified auth user ID
        const generation = await storage.createGuestGeneration(req.userAccount.id, {
          recipeId,
          prompt: finalPrompt,
          status: "pending",
          recipeTitle: recipe.name,
          creditsCost: recipe.creditCost, // Use actual recipe cost
          type: (recipe.workflowType === "image_to_video" || recipe.workflowType === "text_to_video") ? "video" : "image",
          metadata: {
            formData: formData || {},
            tagDisplayData: tagDisplayData,
            extractedVariables: extractedVariables,
            workflowType: recipe.workflowType,
            videoGeneration: recipe.workflowType === "image_to_video" ? "minimax-hailuo-02-pro" : null
          }
        } as any);

        // Deduct credits from user account
        const newCredits = creditsRemaining - recipe.creditCost;
        await storage.updateUserCredits(req.userAccount.id, newCredits);

        // Create credit transaction record
        await storage.createCreditTransaction({
          userId: req.userAccount.id,
          amount: -recipe.creditCost,
          type: "usage",
          description: `Generated content using ${recipe.name}`,
        });

        // Add to generation queue
        const { generationQueue } = await import("./queue-service");
        await generationQueue.addToQueue(generation, formData || {});

        // Increment recipe usage
        await storage.incrementRecipeUsage(recipeId);

        res.json({
          message: "Generation started",
          generationId: generation.id
        });

      } catch (error) {
        console.error("Error starting guest generation:", error);
        res.status(500).json({ message: "Failed to start generation" });
      }
    });

    // Get guest generations - updated to use unified auth and userId with status filtering
    app.get('/api/alpha/my-makes', async (req, res) => {
      try {
        if (!req.userAccount) {
          return res.status(400).json({ message: "Guest session not found" });
        }

        // Validate and sanitize pagination parameters
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.per_page as string) || parseInt(req.query.limit as string) || 5));
        const offset = (page - 1) * limit;

        // Extract and validate status filter
        const status = req.query.status as string;
        const validStatuses = ['pending', 'completed', 'failed', 'processing'];
        const statusFilter = status && validStatuses.includes(status) ? status : undefined;

        // Use userId for all lookups with optional status filtering
        const generations = await storage.getUserGenerations(req.userAccount.id, {
          page,
          limit,
          offset,
          status: statusFilter
        });

        // Add recipe info - optimized with batch lookup
        const recipeIds = Array.from(new Set(generations.data.map(g => g.recipeId).filter(Boolean) as number[]));
        const recipes = recipeIds.length > 0 ? await storage.getRecipesByIds(recipeIds) : [];
        const recipeMap = new Map(recipes.map(r => [r.id, r]));

        const generationsWithRecipes = generations.data.map((gen) => {
          const recipe = gen.recipeId ? recipeMap.get(gen.recipeId) : null;
          return {
            ...gen,
            recipe: recipe ? {
              id: recipe.id,
              name: recipe.name,
              slug: recipe.slug,
              category: recipe.category
            } : null
          };
        });

        res.json({
          generations: generationsWithRecipes,
          pagination: {
            page,
            limit,
            total: generations.total,
            totalPages: Math.ceil(generations.total / limit),
            hasNext: page < Math.ceil(generations.total / limit),
            hasPrevious: page > 1
          }
        });
      } catch (error) {
        console.error("Error fetching guest generations:", error);
        res.status(500).json({ message: "Failed to fetch generations" });
      }
    });

    // Get guest generation by short ID - updated to use unified auth
    app.get('/api/alpha/generation/:shortId', async (req, res) => {
      try {
        if (!req.userAccount) {
          return res.status(400).json({ message: "Guest session not found" });
        }

        const { shortId } = req.params;

        // Find generation by short ID
        const generation = await storage.getGenerationByShortId(shortId);
        if (!generation) {
          return res.status(404).json({ message: "Generation not found" });
        }

        // Verify this generation belongs to the current user account
        if (generation.userId !== req.userAccount.id) {
          return res.status(403).json({ message: "Access denied" });
        }

        // Add recipe info
        const recipe = generation.recipeId ? await storage.getRecipeById(generation.recipeId) : null;
        const generationWithRecipe = {
          ...generation,
          recipe: recipe ? {
            id: recipe.id,
            name: recipe.name,
            slug: recipe.slug,
            category: recipe.category
          } : null
        };

        res.json(generationWithRecipe);
      } catch (error) {
        console.error("Error fetching generation by short ID:", error);
        res.status(500).json({ message: "Failed to fetch generation" });
      }
    });

  }

  // Get tag icon mappings for frontend dynamic icon computation
  app.get('/api/tag-icon-mappings', async (req, res) => {
    try {
      const iconMappings = await db.select({
        id: recipeOptionTagIcons.id,
        display: recipeOptionTagIcons.display,
        icon: recipeOptionTagIcons.icon,
        color: recipeOptionTagIcons.color
      }).from(recipeOptionTagIcons);

      // Convert to a simple key-value mapping for frontend use
      const mappings: Record<string, { icon: string; color?: string }> = {};
      iconMappings.forEach(mapping => {
        if (mapping.icon) {
          mappings[mapping.id] = {
            icon: mapping.icon,
            ...(mapping.color && { color: mapping.color })
          };
        }
      });

      res.json({ mappings });
    } catch (error) {
      console.error("Error fetching tag icon mappings:", error);
      res.status(500).json({ message: "Failed to fetch icon mappings" });
    }
  });

  // Instant generation endpoint - claims backlog generation atomically
  app.post('/api/generate/instant', requireUnifiedAuth, async (req: any, res) => {
    try {
      const userId = req.userAccount.id;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { recipeId } = req.body;
      const recipe = await storage.getRecipeById(recipeId);

      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }

      // Check credits with allowDebit logic
      const { creditsRemaining, allowDebit } = getGenerationLimits(req.userAccount);
      if (creditsRemaining < recipe.creditCost && !allowDebit) {
        return res.status(400).json({
          message: "Insufficient credits",
          required: recipe.creditCost,
          available: creditsRemaining
        });
      }

      // Check if backlog has available generations for this recipe
      const backlogCount = await storage.getBacklogGenerationCount(recipeId);
      if (backlogCount === 0) {
        return res.status(404).json({
          message: "No instant generation available",
          fallbackToModal: true
        });
      }

      const targetUserId = userId;

      // Atomically claim a backlog generation
      const claimedGeneration = await storage.claimBacklogGeneration(recipeId, targetUserId);

      if (!claimedGeneration) {
        return res.status(409).json({
          message: "No instant generation available (race condition)",
          fallbackToModal: true
        });
      }



      // Deduct credits (always use the actual user ID for credits)
      const newCredits = user.credits - recipe.creditCost;
      await storage.updateUserCredits(userId, newCredits);

      // Create credit transaction (always use the actual user ID for credits)
      await storage.createCreditTransaction({
        userId,
        amount: -recipe.creditCost,
        type: "usage",
        description: `Instant generation using ${recipe.name}`,
      });

      // Increment recipe usage
      await storage.incrementRecipeUsage(recipeId);

      res.json({
        success: true,
        message: "Instant generation claimed successfully",
        generationId: claimedGeneration.id,
        shortId: claimedGeneration.shortId,
        videoUrl: claimedGeneration.videoUrl,
        thumbnailUrl: claimedGeneration.thumbnailUrl,
        remainingCredits: newCredits,
        isInstant: true
      });

    } catch (error) {
      console.error("Error in instant generation:", error);
      res.status(500).json({ message: "Failed to claim instant generation" });
    }
  });

  return httpServer;
}
