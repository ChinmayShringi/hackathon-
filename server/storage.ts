import { eq, desc, and, sql, count, lt, inArray, asc, isNull, or } from "drizzle-orm";
import { db } from "./db";
import { cacheService, CacheService } from "./cache-service";
import {
  users,
  recipes,
  generations,
  creditTransactions,
  recipeSamples,
  sampleLikes,
  exportTransactions,
  smartGenerationRequests,
  backlogVideos,
  recipeUsage,
  type User,
  type Recipe,
  type Generation,
  type CreditTransaction,
  type RecipeSample,
  type SampleLike,
  type ExportTransaction,
  type SmartGenerationRequest,
  type BacklogVideo,
  type UpsertUser,
  type InsertRecipe,
  type InsertGeneration,
  type InsertCreditTransaction,
  type InsertRecipeSample,
  type InsertExportTransaction,
  type InsertSmartGenerationRequest,
  type InsertBacklogVideo,
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserBySessionToken(sessionToken: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<UpsertUser>): Promise<User>;
  updateUserCredits(id: string, credits: number): Promise<User>;

  // Recipe operations
  getAllRecipes(): Promise<Recipe[]>;
  getRecipeById(id: number): Promise<Recipe | undefined>;
  getRecipesByIds(ids: number[]): Promise<Recipe[]>;
  getRecipeBySlug(slug: string): Promise<Recipe | undefined>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  updateRecipe(id: number, updates: Partial<InsertRecipe>): Promise<Recipe>;
  incrementRecipeUsage(id: number): Promise<void>;
  getRecipeUsageCount(id: number): Promise<number>;

  // Generation operations
  createGeneration(generation: InsertGeneration, sessionToken?: string): Promise<Generation>;
  getUserGenerations(userId: string, pagination?: { page: number; limit: number; offset: number; status?: string }): Promise<{ data: Generation[]; total: number }>;
  getGenerationById(id: number): Promise<Generation | undefined>;
  updateGenerationStatus(id: number, status: string, imageUrl?: string): Promise<void>;
  updateGenerationWithAsset(id: number, status: string, imageUrl: string, s3Key: string, assetId: string, metadata: any, videoUrl?: string): Promise<void>;
  updateGenerationWithSecureAsset(id: number, status: string, secureUrl: string, s3Key: string, assetId: string, shortId: string, metadata: any): Promise<void>;
  getGenerationByShortId(shortId: string): Promise<Generation | undefined>;
  updateGenerationFalJobStatus(id: number, status: string): Promise<void>;
  registerFalJob(id: number, falJobId: string): Promise<void>;
  updateGenerationPrivacy(id: number, isPublic: boolean): Promise<void>;
  getGenerationByAssetId(assetId: string): Promise<Generation | undefined>;
  getPendingGenerations(): Promise<Generation[]>;
  getOldPendingGenerations(beforeDate: Date): Promise<Generation[]>;
  failGeneration(id: number, failureReason: string, errorDetails: any, shouldRefund: boolean): Promise<void>;
  refundCreditsForGeneration(generationId: number, userId: string, amount: number): Promise<void>;
  retryGeneration(id: number): Promise<Generation | undefined>;
  getFailedGenerationsForRetry(): Promise<Generation[]>;

  // Credit transaction operations
  createCreditTransaction(transaction: InsertCreditTransaction): Promise<CreditTransaction>;
  getUserCreditTransactions(userId: string): Promise<CreditTransaction[]>;

  // Queue statistics
  getQueueStats(): Promise<{
    totalInQueue: number;
    currentlyProcessing: number;
    averageWaitTime: number;
    completedToday: number;
    systemLoad: string;
  }>;



  // Recipe sample operations
  getRecipeSamples(recipeId: number, limit?: number): Promise<RecipeSample[]>;
  getFeaturedSamples(limit?: number): Promise<RecipeSample[]>;
  createRecipeSample(sample: InsertRecipeSample): Promise<RecipeSample>;
  updateSampleLikes(sampleId: number, increment: number): Promise<void>;
  getUserSampleLike(sampleId: number, userId: string): Promise<SampleLike | undefined>;
  toggleSampleLike(sampleId: number, userId: string): Promise<boolean>;

  // Export operations
  createExportTransaction(transaction: InsertExportTransaction): Promise<ExportTransaction>;
  getUserExports(userId: string): Promise<ExportTransaction[]>;
  getExportTransaction(id: number): Promise<ExportTransaction | undefined>;
  markExportDownloaded(id: number): Promise<void>;

  // Smart Generator operations
  createSmartGenerationRequest(request: InsertSmartGenerationRequest): Promise<SmartGenerationRequest>;
  updateSmartGenerationRequest(id: number, updates: Partial<InsertSmartGenerationRequest>): Promise<SmartGenerationRequest>;
  getSmartGenerationRequest(id: number): Promise<SmartGenerationRequest | undefined>;
  createBacklogVideo(video: InsertBacklogVideo): Promise<BacklogVideo>;
  getBacklogVideoByRecipeAndHash(recipeId: number, variablesHash: string): Promise<BacklogVideo | undefined>;
  getRandomUnusedBacklogVideo(recipeId: number): Promise<BacklogVideo | null>;
  markBacklogVideoAsUsed(videoId: number, requestId: number): Promise<void>;

  // Guest user operations
  getGuestGenerations(userId: string, pagination?: { page: number; limit: number; offset: number }): Promise<{ data: Generation[]; total: number }>;
  getGuestGenerationsCursor(userId: string, options: { cursor?: string; limit: number; direction: 'forward' | 'backward' }): Promise<{ data: Generation[]; nextCursor?: string; prevCursor?: string; hasMore: boolean }>;
  getGuestGenerationStats(userId: string): Promise<{ pending: number; completed: number; failed: number; total: number }>;
  createGuestGeneration(userId: string, generation: InsertGeneration): Promise<Generation>;

  // Credit refresh operations
  checkAndRefreshDailyCredits(userId: string): Promise<{ refreshed: boolean; creditsAdded: number; nextRefreshInSeconds: number }>;
  getCreditRefreshInfo(userId: string): Promise<{
    canRefresh: boolean;
    nextRefreshInSeconds: number;
    currentCredits: number;
    lastRefreshTime: Date | null;
  }>;
  batchRefreshDailyCredits(): Promise<{
    totalRefreshed: number;
    totalCreditsAdded: number;
    refreshedUsers: string[]
  }>;
  getNextCreditRefreshTime(userId: string): Promise<number>;

  /**
   * Get count of available backlog generations for a recipe
   */
  getBacklogGenerationCount(recipeId: number): Promise<number>;

  /**
   * Atomically claim a backlog generation and transfer ownership to user
   */
  claimBacklogGeneration(recipeId: number, userId: string): Promise<Generation | null>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserBySessionToken(sessionToken: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.sessionToken, sessionToken));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        credits: userData.credits ?? 10, // Give new users 10 free credits
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          accountType: userData.accountType,
          accessRole: userData.accessRole,
          sessionToken: userData.sessionToken,
          lastSeenAt: userData.lastSeenAt,
          passwordHash: userData.passwordHash,
          oauthProvider: userData.oauthProvider,
          isEphemeral: userData.isEphemeral,
          canUpgradeToRegistered: userData.canUpgradeToRegistered,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<UpsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserCredits(id: string, credits: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ credits, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllRecipes(): Promise<Recipe[]> {
    // Get basic recipes first
    const allRecipes = await db.select().from(recipes).where(eq(recipes.isActive, true));

    // Get usage counts from the optimized table
    const usageCounts = await db
      .select({
        recipeId: recipeUsage.recipeId,
        usageCount: recipeUsage.usageCount
      })
      .from(recipeUsage);

    // Create a map for quick lookup
    const usageMap = new Map(usageCounts.map(u => [u.recipeId, u.usageCount]));

    // Merge usage counts with recipes
    return allRecipes.map(recipe => ({
      ...recipe,
      usageCount: usageMap.get(recipe.id) || 0
    }));
  }

  async getRecipeById(id: number): Promise<Recipe | undefined> {
    // Check cache first
    const cacheKey = `recipe_${id}`;
    const cached = cacheService.get<Recipe>(cacheKey);
    if (cached) {
      return cached;
    }

    const [recipe] = await db.select().from(recipes).where(eq(recipes.id, id));

    if (recipe) {
      // Cache recipe for 10 minutes (recipes don't change often)
      cacheService.set(cacheKey, recipe, 10 * 60 * 1000);
    }

    return recipe;
  }

  async getRecipesByIds(ids: number[]): Promise<Recipe[]> {
    if (ids.length === 0) return [];

    // Check cache first for each recipe
    const cachedRecipes: Recipe[] = [];
    const uncachedIds: number[] = [];

    for (const id of ids) {
      const cacheKey = `recipe_${id}`;
      const cached = cacheService.get<Recipe>(cacheKey);
      if (cached) {
        cachedRecipes.push(cached);
      } else {
        uncachedIds.push(id);
      }
    }

    // Fetch uncached recipes from database
    let dbRecipes: Recipe[] = [];
    if (uncachedIds.length > 0) {
      dbRecipes = await db
        .select()
        .from(recipes)
        .where(inArray(recipes.id, uncachedIds));

      // Cache the fetched recipes
      for (const recipe of dbRecipes) {
        const cacheKey = `recipe_${recipe.id}`;
        cacheService.set(cacheKey, recipe, 10 * 60 * 1000);
      }
    }

    // Combine cached and database recipes, maintaining order
    const allRecipes = [...cachedRecipes, ...dbRecipes];
    return allRecipes.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
  }

  async getRecipeBySlug(slug: string): Promise<Recipe | undefined> {
    const [recipe] = await db.select().from(recipes).where(eq(recipes.slug, slug));
    return recipe;
  }

  async createRecipe(recipe: InsertRecipe): Promise<Recipe> {
    const [newRecipe] = await db
      .insert(recipes)
      .values(recipe)
      .returning();
    return newRecipe;
  }

  async updateRecipe(id: number, updates: Partial<InsertRecipe>): Promise<Recipe> {
    const [updatedRecipe] = await db
      .update(recipes)
      .set(updates)
      .where(eq(recipes.id, id))
      .returning();
    return updatedRecipe;
  }

  async incrementRecipeUsage(id: number): Promise<void> {
    // Use the new optimized recipe_usage table
    await db
      .insert(recipeUsage)
      .values({
        recipeId: id,
        usageCount: 1,
        lastUsedAt: new Date()
      })
      .onConflictDoUpdate({
        target: recipeUsage.recipeId,
        set: {
          usageCount: sql`${recipeUsage.usageCount} + 1`,
          lastUsedAt: new Date()
        }
      });
  }

  async getRecipeUsageCount(id: number): Promise<number> {
    const result = await db
      .select({ usageCount: recipeUsage.usageCount })
      .from(recipeUsage)
      .where(eq(recipeUsage.recipeId, id));

    return result[0]?.usageCount || 0;
  }

  async createGeneration(generation: InsertGeneration, sessionToken?: string): Promise<Generation> {
    // Generate a unique short ID for this generation
    const shortId = await this.generateUniqueShortId();

    // Include session data in metadata if provided
    const metadata = {
      ...(generation.metadata || {}),
      ...(sessionToken && { sessionId: sessionToken })
    };

    const [newGeneration] = await db
      .insert(generations)
      .values({
        ...generation,
        shortId,
        metadata
      })
      .returning();
    return newGeneration;
  }

  /**
   * Generate a unique short ID with collision handling
   * Uses nanoid with custom alphabet for YouTube-style IDs
   */
  private async generateUniqueShortId(maxRetries: number = 10): Promise<string> {
    const { customAlphabet } = await import('nanoid');

    // YouTube-style alphabet: A-Z, a-z, 0-9, -, _
    const youtubeAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    const generateYoutubeId = customAlphabet(youtubeAlphabet, 11);

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const shortId = generateYoutubeId();

        // Check if this short ID already exists
        const existing = await db
          .select({ id: generations.id })
          .from(generations)
          .where(eq(generations.shortId, shortId))
          .limit(1);

        if (existing.length === 0) {
          return shortId;
        }

        console.log(`Short ID collision detected on attempt ${attempt + 1}, retrying...`);
      } catch (error) {
        console.error(`Error generating short ID on attempt ${attempt + 1}:`, error);
        if (attempt === maxRetries - 1) {
          throw new Error('Failed to generate unique short ID after maximum retries');
        }
      }
    }

    throw new Error('Failed to generate unique short ID after maximum retries');
  }

  async getUserGenerations(userId: string, pagination?: { page: number; limit: number; offset: number; status?: string }): Promise<{ data: Generation[]; total: number }> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const offset = pagination?.offset || 0;
    const status = pagination?.status;

    // Include status in cache key
    const cacheKey = `user_generations_${userId}_${page}_${limit}_${status || 'all'}`;
    const cached = cacheService.get<{ data: Generation[]; total: number }>(cacheKey);
    if (cached) {
      return cached;
    }

    // Build where conditions
    const whereConditions = [eq(generations.userId, userId)];
    if (status && status !== 'all') {
      whereConditions.push(eq(generations.status, status));
    }

    // Use proper database pagination with LIMIT and OFFSET
    const [paginatedGenerations, totalCountResult] = await Promise.all([
      // Get paginated generations
      db
        .select()
        .from(generations)
        .where(and(...whereConditions))
        .orderBy(desc(generations.createdAt))
        .limit(limit)
        .offset(offset),

      // Get total count for pagination metadata
      db
        .select({ count: count() })
        .from(generations)
        .where(and(...whereConditions))
    ]);

    const total = totalCountResult[0]?.count || 0;

    const result = {
      data: paginatedGenerations,
      total
    };

    // Cache the result for 5 minutes
    cacheService.set(cacheKey, result, 5 * 60 * 1000);

    return result;
  }

  async getGenerationById(id: number): Promise<Generation | undefined> {
    const result = await db
      .select()
      .from(generations)
      .where(eq(generations.id, id))
      .limit(1);
    return result[0];
  }

  async updateGenerationStatus(id: number, status: string, imageUrl?: string): Promise<void> {
    const updateData: any = { status };
    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    await db
      .update(generations)
      .set(updateData)
      .where(eq(generations.id, id));
  }

  async updateGenerationWithAsset(id: number, status: string, imageUrl: string, s3Key: string, assetId: string, metadata: any, videoUrl?: string): Promise<void> {
    // --- PATCH: Ensure videoUrl is set for video generations ---
    let finalVideoUrl = videoUrl;
    let finalImageUrl = imageUrl;
    const isVideo = metadata && (metadata.generationType === 'text_to_video' || metadata.workflowType === 'image_to_video');

    if (
      isVideo &&
      !finalVideoUrl &&
      finalImageUrl &&
      (finalImageUrl.endsWith('.mp4') || finalImageUrl.endsWith('.mov') || finalImageUrl.endsWith('.webm'))
    ) {
      finalVideoUrl = finalImageUrl;
      finalImageUrl = ''; // Clear imageUrl for video generations
    }
    // ----------------------------------------------------------

    // Get existing generation to preserve original metadata (including formData)
    const existingGeneration = await this.getGenerationById(id);
    const existingMetadata = existingGeneration?.metadata as any || {};

    // Merge metadata: preserve existing formData and other fields, add new completion data
    const mergedMetadata = {
      ...existingMetadata,
      ...metadata,
      // Ensure formData is preserved from original metadata
      formData: existingMetadata.formData || metadata.formData || {}
    };

    await db
      .update(generations)
      .set({
        status,
        imageUrl: finalImageUrl,
        videoUrl: finalVideoUrl || null,
        s3Key,
        assetId,
        metadata: mergedMetadata,
        updatedAt: new Date()
      })
      .where(eq(generations.id, id));
  }

  async updateGenerationWithSecureAsset(id: number, status: string, secureUrl: string, s3Key: string, assetId: string, shortId: string, metadata: any): Promise<void> {
    // Get existing generation to preserve original metadata (including formData)
    const existingGeneration = await this.getGenerationById(id);
    const existingMetadata = existingGeneration?.metadata as any || {};

    // Merge metadata: preserve existing formData and other fields, add new completion data
    const mergedMetadata = {
      ...existingMetadata,
      ...metadata,
      // Ensure formData is preserved from original metadata
      formData: existingMetadata.formData || metadata.formData || {}
    };

    await db
      .update(generations)
      .set({
        status,
        secureUrl,
        imageUrl: secureUrl, // Keep backward compatibility
        s3Key,
        assetId,
        shortId,
        metadata: mergedMetadata,
        updatedAt: new Date()
      })
      .where(eq(generations.id, id));
  }

  async getGenerationByShortId(shortId: string): Promise<Generation | undefined> {
    const result = await db
      .select()
      .from(generations)
      .where(eq(generations.shortId, shortId))
      .limit(1);
    return result[0];
  }

  async updateGenerationPrivacy(id: number, isPublic: boolean): Promise<void> {
    await db
      .update(generations)
      .set({ isPublic, updatedAt: new Date() })
      .where(eq(generations.id, id));
  }

  async getGenerationByAssetId(assetId: string): Promise<Generation | undefined> {
    const result = await db
      .select()
      .from(generations)
      .where(eq(generations.assetId, assetId))
      .limit(1);

    return result[0];
  }

  async getPendingGenerations(): Promise<Generation[]> {
    try {
      const result = await db
        .select()
        .from(generations)
        .where(eq(generations.status, 'pending'))
        .orderBy(generations.createdAt);

      return result;
    } catch (error) {
      console.error("Error fetching pending generations:", error);
      throw new Error("Failed to fetch pending generations");
    }
  }

  async getOldPendingGenerations(beforeDate: Date): Promise<Generation[]> {
    try {
      const result = await db
        .select()
        .from(generations)
        .where(
          and(
            eq(generations.status, 'pending'),
            lt(generations.createdAt, beforeDate)
          )
        )
        .orderBy(generations.createdAt);

      return result;
    } catch (error) {
      console.error("Error fetching old pending generations:", error);
      throw new Error("Failed to fetch old pending generations");
    }
  }

  async failGeneration(id: number, failureReason: string, errorDetails: any, shouldRefund: boolean): Promise<void> {
    const generation = await db.select().from(generations).where(eq(generations.id, id)).limit(1);
    if (!generation[0]) return;

    await db
      .update(generations)
      .set({
        status: 'failed',
        failureReason,
        errorDetails,
        updatedAt: new Date()
      })
      .where(eq(generations.id, id));

    // Refund credits if requested and not already refunded
    if (shouldRefund && generation[0].creditsCost && !generation[0].creditsRefunded) {
      await this.refundCreditsForGeneration(id, generation[0].userId, generation[0].creditsCost);
    }
  }

  async refundCreditsForGeneration(generationId: number, userId: string, amount: number): Promise<void> {
    // Update user credits
    await db
      .update(users)
      .set({
        credits: sql`${users.credits} + ${amount}`,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    // Mark generation as refunded
    await db
      .update(generations)
      .set({
        creditsRefunded: true,
        refundedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(generations.id, generationId));

    // Create credit transaction record
    await this.createCreditTransaction({
      userId,
      amount,
      type: 'refund',
      description: `Refund for failed generation #${generationId}`,
      metadata: { generationId, reason: 'generation_failed' }
    });
  }

  async retryGeneration(id: number): Promise<Generation | undefined> {
    const [generation] = await db.select().from(generations).where(eq(generations.id, id)).limit(1);
    if (!generation || generation.status !== 'failed' || generation.retryCount >= generation.maxRetries) {
      return undefined;
    }

    await db
      .update(generations)
      .set({
        status: 'pending',
        retryCount: generation.retryCount + 1,
        failureReason: null,
        errorDetails: null,
        updatedAt: new Date()
      })
      .where(eq(generations.id, id));

    return (await db.select().from(generations).where(eq(generations.id, id)).limit(1))[0];
  }

  async getFailedGenerationsForRetry(): Promise<Generation[]> {
    return await db
      .select()
      .from(generations)
      .where(
        and(
          eq(generations.status, 'failed'),
          sql`${generations.retryCount} < ${generations.maxRetries}`,
          sql`${generations.createdAt} > NOW() - INTERVAL '24 hours'` // Only retry recent failures
        )
      )
      .orderBy(generations.createdAt);
  }

  async createCreditTransaction(transaction: InsertCreditTransaction): Promise<CreditTransaction> {
    const [newTransaction] = await db
      .insert(creditTransactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  async getUserCreditTransactions(userId: string): Promise<CreditTransaction[]> {
    return await db
      .select()
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, userId))
      .orderBy(desc(creditTransactions.createdAt));
  }

  // Guest user operations
  async getGuestGenerations(userId: string, pagination?: { page: number; limit: number; offset: number }): Promise<{ data: Generation[]; total: number }> {
    // Validate and sanitize pagination parameters
    const page = Math.max(1, pagination?.page || 1);
    const limit = Math.min(50, Math.max(1, pagination?.limit || 5));
    const offset = Math.max(0, (page - 1) * limit); // Ensure offset is never negative

    // Check cache first
    const cacheKey = CacheService.guestGenerationsKey(userId, page, limit);
    const cached = cacheService.get<{ data: Generation[]; total: number }>(cacheKey);
    if (cached) {
      return cached;
    }

    // Use proper database pagination with LIMIT and OFFSET
    // Filter by the actual user account ID
    const whereConditions = [eq(generations.userId, userId)];

    const [paginatedGenerations, totalCountResult] = await Promise.all([
      // Get paginated generations
      db
        .select()
        .from(generations)
        .where(and(...whereConditions))
        .orderBy(desc(generations.createdAt))
        .limit(limit)
        .offset(offset),

      // Get total count for pagination metadata
      db
        .select({ count: count() })
        .from(generations)
        .where(and(...whereConditions))
    ]);

    const total = totalCountResult[0]?.count || 0;

    // Add proper URLs for generations
    const generationsWithUrls = paginatedGenerations.map(gen => ({
      ...gen,
      resultUrl: gen.imageUrl || gen.videoUrl || null,
      viewUrl: gen.imageUrl || gen.videoUrl || null,
    }));

    const result = {
      data: generationsWithUrls,
      total
    };

    // Cache the result for 2 minutes (shorter TTL for real-time data)
    cacheService.set(cacheKey, result, 2 * 60 * 1000);

    return result;
  }

  async getGuestGenerationsCursor(userId: string, options: { cursor?: string; limit: number; direction: 'forward' | 'backward' }): Promise<{ data: Generation[]; nextCursor?: string; prevCursor?: string; hasMore: boolean }> {
    const { cursor, limit, direction } = options;
    const maxLimit = Math.min(limit, 100); // Cap at 100 items per request

    // Check cache first
    const cacheKey = `guest_generations_cursor_${userId}_${cursor}_${maxLimit}_${direction}`;
    const cached = cacheService.get<{
      data: Generation[];
      nextCursor?: string;
      prevCursor?: string;
      hasMore: boolean
    }>(cacheKey);
    if (cached) {
      return cached;
    }

    // Build the where conditions
    let whereConditions = [eq(generations.userId, userId)];

    if (cursor) {
      const cursorDate = new Date(cursor);
      if (direction === 'forward') {
        whereConditions.push(lt(generations.createdAt, cursorDate));
      } else {
        whereConditions.push(sql`${generations.createdAt} > ${cursorDate}`);
      }
    }

    const results = await db
      .select()
      .from(generations)
      .where(and(...whereConditions))
      .orderBy(desc(generations.createdAt))
      .limit(maxLimit + 1); // Get one extra to determine if there are more

    const hasMore = results.length > maxLimit;
    const data = results.slice(0, maxLimit);

    // Add proper URLs for generations
    const generationsWithUrls = data.map(gen => ({
      ...gen,
      resultUrl: gen.imageUrl || gen.videoUrl || null,
      viewUrl: gen.imageUrl || gen.videoUrl || null,
    }));

    // Calculate cursors
    const nextCursor = hasMore && data.length > 0 ? data[data.length - 1].createdAt?.toISOString() : undefined;
    const prevCursor = data.length > 0 ? data[0].createdAt?.toISOString() : undefined;

    const result = {
      data: generationsWithUrls,
      nextCursor,
      prevCursor,
      hasMore
    };

    // Cache the result for 1 minute (shorter TTL for cursor-based pagination)
    cacheService.set(cacheKey, result, 60 * 1000);

    return result;
  }

  async getGuestGenerationStats(userId: string): Promise<{ pending: number; completed: number; failed: number; total: number }> {
    // Check cache first
    const cacheKey = CacheService.guestGenerationsStatsKey(userId);
    const cached = cacheService.get<{ pending: number; completed: number; failed: number; total: number }>(cacheKey);
    if (cached) {
      return cached;
    }

    // Build base where conditions - filter by the actual user account ID
    const baseConditions = [eq(generations.userId, userId)];

    // Use optimized database queries with proper indexing
    const [pendingResult, completedResult, failedResult, totalResult] = await Promise.all([
      // Count pending/processing generations
      db
        .select({ count: count() })
        .from(generations)
        .where(
          and(
            ...baseConditions,
            sql`${generations.status} IN ('pending', 'processing')`
          )
        ),

      // Count completed generations
      db
        .select({ count: count() })
        .from(generations)
        .where(
          and(
            ...baseConditions,
            eq(generations.status, 'completed')
          )
        ),

      // Count failed generations
      db
        .select({ count: count() })
        .from(generations)
        .where(
          and(
            ...baseConditions,
            eq(generations.status, 'failed')
          )
        ),

      // Count total generations
      db
        .select({ count: count() })
        .from(generations)
        .where(and(...baseConditions))
    ]);

    const result = {
      pending: pendingResult[0]?.count || 0,
      completed: completedResult[0]?.count || 0,
      failed: failedResult[0]?.count || 0,
      total: totalResult[0]?.count || 0
    };

    // Cache the result for 1 minute (shorter TTL for stats)
    cacheService.set(cacheKey, result, 60 * 1000);

    return result;
  }

  async createGuestGeneration(userId: string, generation: InsertGeneration): Promise<Generation> {
    // Generate a unique short ID for this guest generation
    const shortId = await this.generateUniqueShortId();

    // --- PATCH: Ensure videoUrl is set for video generations ---
    let videoUrl = generation.videoUrl;
    let imageUrl = generation.imageUrl;
    const metadata = generation.metadata as any;
    const isVideo =
      generation.type === 'video' ||
      (metadata && (metadata.generationType === 'text_to_video' || metadata.workflowType === 'image_to_video'));

    if (
      isVideo &&
      !videoUrl &&
      imageUrl &&
      (imageUrl.endsWith('.mp4') || imageUrl.endsWith('.mov') || imageUrl.endsWith('.webm'))
    ) {
      videoUrl = imageUrl;
      imageUrl = ''; // Clear imageUrl for video generations
    }
    // ----------------------------------------------------------

    const guestGeneration = {
      ...generation,
      userId: userId, // Use the provided user ID
      shortId,
      videoUrl,
      imageUrl,
      metadata: {
        ...(generation.metadata || {}),
        isGuest: true
      }
    };

    const [newGeneration] = await db
      .insert(generations)
      .values(guestGeneration)
      .returning();

    // Invalidate cache when new generation is created - use actual user ID
    cacheService.invalidateGuestGenerations(userId);
    cacheService.invalidateStats(userId);

    return newGeneration;
  }

  async getQueueStats(): Promise<{
    totalInQueue: number;
    currentlyProcessing: number;
    averageWaitTime: number;
    completedToday: number;
    systemLoad: string;
  }> {
    // Check cache first
    const cacheKey = CacheService.queueStatsKey();
    const cached = cacheService.get<{
      totalInQueue: number;
      currentlyProcessing: number;
      averageWaitTime: number;
      completedToday: number;
      systemLoad: string;
    }>(cacheKey);
    if (cached) {
      return cached;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Use optimized database queries with proper indexing
    const [queuedResult, processingResult, completedTodayResult] = await Promise.all([
      // Count queued generations
      db
        .select({ count: count() })
        .from(generations)
        .where(eq(generations.status, 'queued')),

      // Count processing generations
      db
        .select({ count: count() })
        .from(generations)
        .where(eq(generations.status, 'processing')),

      // Count completed generations today
      db
        .select({ count: count() })
        .from(generations)
        .where(
          and(
            eq(generations.status, 'completed'),
            sql`${generations.createdAt} >= ${today}`
          )
        )
    ]);

    const totalInQueue = queuedResult[0]?.count || 0;
    const currentlyProcessing = processingResult[0]?.count || 0;
    const completedTodayCount = completedTodayResult[0]?.count || 0;

    // Calculate system load based on queue size
    let systemLoad = 'normal';
    if (totalInQueue > 50) systemLoad = 'critical';
    else if (totalInQueue > 20) systemLoad = 'high';
    else if (totalInQueue < 5) systemLoad = 'low';

    const result = {
      totalInQueue,
      currentlyProcessing,
      averageWaitTime: Math.round(totalInQueue * 2.5), // Estimate 2.5 minutes per generation
      completedToday: completedTodayCount,
      systemLoad
    };

    // Cache the result for 30 seconds (very short TTL for queue stats)
    cacheService.set(cacheKey, result, 30 * 1000);

    return result;
  }



  // Recipe sample operations
  async getRecipeSamples(recipeId: number, limit: number = 12): Promise<RecipeSample[]> {
    return await db
      .select()
      .from(recipeSamples)
      .where(and(
        eq(recipeSamples.recipeId, recipeId),
        eq(recipeSamples.moderationStatus, "approved")
      ))
      .orderBy(desc(recipeSamples.isFeatured), desc(recipeSamples.likeCount), desc(recipeSamples.createdAt))
      .limit(limit);
  }

  async getFeaturedSamples(limit: number = 20): Promise<RecipeSample[]> {
    return await db
      .select()
      .from(recipeSamples)
      .where(and(
        eq(recipeSamples.isFeatured, true),
        eq(recipeSamples.moderationStatus, "approved")
      ))
      .orderBy(desc(recipeSamples.likeCount), desc(recipeSamples.createdAt))
      .limit(limit);
  }

  async createRecipeSample(sample: InsertRecipeSample): Promise<RecipeSample> {
    const [newSample] = await db
      .insert(recipeSamples)
      .values(sample)
      .returning();
    return newSample;
  }

  async updateSampleLikes(sampleId: number, increment: number): Promise<void> {
    await db
      .update(recipeSamples)
      .set({
        likeCount: sql`${recipeSamples.likeCount} + ${increment}`,
        updatedAt: new Date()
      })
      .where(eq(recipeSamples.id, sampleId));
  }

  async getUserSampleLike(sampleId: number, userId: string): Promise<SampleLike | undefined> {
    const [like] = await db
      .select()
      .from(sampleLikes)
      .where(and(
        eq(sampleLikes.sampleId, sampleId),
        eq(sampleLikes.userId, userId)
      ));
    return like;
  }

  async toggleSampleLike(sampleId: number, userId: string): Promise<boolean> {
    const existingLike = await this.getUserSampleLike(sampleId, userId);

    if (existingLike) {
      // Remove like
      await db
        .delete(sampleLikes)
        .where(eq(sampleLikes.id, existingLike.id));
      await this.updateSampleLikes(sampleId, -1);
      return false;
    } else {
      // Add like
      await db
        .insert(sampleLikes)
        .values({ sampleId, userId });
      await this.updateSampleLikes(sampleId, 1);
      return true;
    }
  }

  // Export operations
  async createExportTransaction(transaction: InsertExportTransaction): Promise<ExportTransaction> {
    const [newExport] = await db
      .insert(exportTransactions)
      .values(transaction)
      .returning();
    return newExport;
  }

  async getUserExports(userId: string): Promise<ExportTransaction[]> {
    return await db
      .select()
      .from(exportTransactions)
      .where(eq(exportTransactions.buyerId, userId))
      .orderBy(desc(exportTransactions.createdAt));
  }

  async getExportTransaction(id: number): Promise<ExportTransaction | undefined> {
    const [exportTransaction] = await db
      .select()
      .from(exportTransactions)
      .where(eq(exportTransactions.id, id));
    return exportTransaction;
  }

  async markExportDownloaded(id: number): Promise<void> {
    await db
      .update(exportTransactions)
      .set({ downloadedAt: new Date() })
      .where(eq(exportTransactions.id, id));
  }

  async updateGenerationFalJobStatus(id: number, status: string): Promise<void> {
    await db
      .update(generations)
      .set({
        falJobStatus: status,
        updatedAt: new Date()
      })
      .where(eq(generations.id, id));
  }

  async registerFalJob(id: number, falJobId: string): Promise<void> {
    await db
      .update(generations)
      .set({
        falJobId,
        updatedAt: new Date()
      })
      .where(eq(generations.id, id));
  }

  // Smart Generator operations
  async createSmartGenerationRequest(request: InsertSmartGenerationRequest): Promise<SmartGenerationRequest> {
    const [newRequest] = await db
      .insert(smartGenerationRequests)
      .values(request)
      .returning();
    return newRequest;
  }

  async updateSmartGenerationRequest(id: number, updates: Partial<InsertSmartGenerationRequest>): Promise<SmartGenerationRequest> {
    const [updatedRequest] = await db
      .update(smartGenerationRequests)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(smartGenerationRequests.id, id))
      .returning();
    return updatedRequest;
  }

  async getSmartGenerationRequest(id: number): Promise<SmartGenerationRequest | undefined> {
    const [request] = await db
      .select()
      .from(smartGenerationRequests)
      .where(eq(smartGenerationRequests.id, id));
    return request;
  }

  async createBacklogVideo(video: InsertBacklogVideo): Promise<BacklogVideo> {
    const [newVideo] = await db
      .insert(backlogVideos)
      .values(video)
      .returning();
    return newVideo;
  }

  async getBacklogVideoByRecipeAndHash(recipeId: number, variablesHash: string): Promise<BacklogVideo | undefined> {
    const [video] = await db
      .select()
      .from(backlogVideos)
      .where(and(
        eq(backlogVideos.recipeId, recipeId),
        eq(backlogVideos.recipeVariablesHash, variablesHash)
      ));
    return video;
  }

  async getRandomUnusedBacklogVideo(recipeId: number): Promise<BacklogVideo | null> {
    // Get a random unused backlog video for the specific recipe
    // This ensures Flash generation returns relevant content
    const videos = await db
      .select()
      .from(backlogVideos)
      .where(and(
        eq(backlogVideos.recipeId, recipeId),
        eq(backlogVideos.isUsed, false)
      ))
      .limit(1);

    return videos[0] || null;
  }

  async markBacklogVideoAsUsed(videoId: number, requestId: number): Promise<void> {
    await db
      .update(backlogVideos)
      .set({
        isUsed: true,
        usedByRequestId: requestId,
        usedAt: new Date()
      })
      .where(eq(backlogVideos.id, videoId));
  }

  // Credit refresh operations
  async checkAndRefreshDailyCredits(userId: string): Promise<{ refreshed: boolean; creditsAdded: number; nextRefreshInSeconds: number }> {
    const user = await this.getUser(userId);
    if (!user) {
      return { refreshed: false, creditsAdded: 0, nextRefreshInSeconds: 0 };
    }

    const now = new Date();
    const createdAt = user.createdAt ? new Date(user.createdAt) : now;

    // Calculate the next refresh time based on account creation
    // Each 24-hour period from account creation is a refresh opportunity
    const timeSinceCreation = now.getTime() - createdAt.getTime();
    const daysSinceCreation = Math.floor(timeSinceCreation / (24 * 60 * 60 * 1000));
    const nextRefreshTime = new Date(createdAt.getTime() + (daysSinceCreation + 1) * 24 * 60 * 60 * 1000);

    const secondsUntilNextRefresh = Math.max(0, (nextRefreshTime.getTime() - now.getTime()) / 1000);

    // Check if it's time for a refresh and user has less than 10 credits
    if (secondsUntilNextRefresh === 0 && user.credits < 10) {
      const creditsToAdd = 10 - user.credits; // Add enough to reach 10 credits

      await this.updateUser(userId, {
        credits: 10,
        lastCreditRefresh: now,
        updatedAt: now
      });

      // Create credit transaction record
      await this.createCreditTransaction({
        userId,
        amount: creditsToAdd,
        type: "daily_refresh",
        description: "Daily credit refresh",
      });

      return { refreshed: true, creditsAdded: creditsToAdd, nextRefreshInSeconds: 24 * 60 * 60 }; // 24 hours
    }

    return { refreshed: false, creditsAdded: 0, nextRefreshInSeconds: secondsUntilNextRefresh };
  }

  // Get credit refresh info without triggering refresh (for efficient polling)
  async getCreditRefreshInfo(userId: string): Promise<{
    canRefresh: boolean;
    nextRefreshInSeconds: number;
    currentCredits: number;
    lastRefreshTime: Date | null;
  }> {
    const user = await this.getUser(userId);
    if (!user) {
      return {
        canRefresh: false,
        nextRefreshInSeconds: 0,
        currentCredits: 0,
        lastRefreshTime: null
      };
    }

    const now = new Date();
    const createdAt = user.createdAt ? new Date(user.createdAt) : now;

    // Calculate the next refresh time based on account creation
    // Each 24-hour period from account creation is a refresh opportunity
    const timeSinceCreation = now.getTime() - createdAt.getTime();
    const daysSinceCreation = Math.floor(timeSinceCreation / (24 * 60 * 60 * 1000));
    const nextRefreshTime = new Date(createdAt.getTime() + (daysSinceCreation + 1) * 24 * 60 * 60 * 1000);

    const secondsUntilNextRefresh = Math.max(0, (nextRefreshTime.getTime() - now.getTime()) / 1000);

    // Can refresh if time is up AND user has less than 10 credits
    const canRefresh = secondsUntilNextRefresh === 0 && user.credits < 10;

    return {
      canRefresh,
      nextRefreshInSeconds: secondsUntilNextRefresh,
      currentCredits: user.credits,
      lastRefreshTime: user.lastCreditRefresh ? new Date(user.lastCreditRefresh) : null
    };
  }

  // Batch refresh credits for multiple users (for background job)
  async batchRefreshDailyCredits(): Promise<{
    totalRefreshed: number;
    totalCreditsAdded: number;
    refreshedUsers: string[]
  }> {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Find users who are eligible for refresh
    const eligibleUsers = await db
      .select()
      .from(users)
      .where(
        and(
          lt(users.credits, 10), // Less than 10 credits
          or(
            lt(users.lastCreditRefresh, twentyFourHoursAgo), // Last refresh was more than 24h ago
            isNull(users.lastCreditRefresh) // Never refreshed
          )
        )
      );

    let totalRefreshed = 0;
    let totalCreditsAdded = 0;
    const refreshedUsers: string[] = [];

    for (const user of eligibleUsers) {
      const creditsToAdd = 10 - user.credits;

      await this.updateUser(user.id, {
        credits: 10,
        lastCreditRefresh: now,
        updatedAt: now
      });

      // Create credit transaction record
      await this.createCreditTransaction({
        userId: user.id,
        amount: creditsToAdd,
        type: "daily_refresh",
        description: "Daily credit refresh (batch)",
      });

      totalRefreshed++;
      totalCreditsAdded += creditsToAdd;
      refreshedUsers.push(user.id);
    }

    return { totalRefreshed, totalCreditsAdded, refreshedUsers };
  }

  async getNextCreditRefreshTime(userId: string): Promise<number> {
    const user = await this.getUser(userId);
    if (!user || !user.lastCreditRefresh) {
      return 0; // Can refresh immediately
    }

    const lastRefresh = new Date(user.lastCreditRefresh);
    const nextRefresh = new Date(lastRefresh.getTime() + 24 * 60 * 60 * 1000); // 24 hours from last refresh
    const now = new Date();

    return Math.max(0, nextRefresh.getTime() - now.getTime());
  }

  /**
   * Get count of available backlog generations for a recipe
   */
  async getBacklogGenerationCount(recipeId: number): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(generations)
      .where(
        and(
          eq(generations.recipeId, recipeId),
          eq(generations.userId, 'system_backlog'),
          eq(generations.status, 'completed')
        )
      );

    return result[0]?.count || 0;
  }

  /**
   * Atomically claim a backlog generation and transfer ownership to user
   */
  async claimBacklogGeneration(recipeId: number, userId: string): Promise<Generation | null> {
    // Use raw SQL to make the claim atomic in a single operation
    // This allows multiple concurrent claims when multiple backlog records exist
    const result = await db.execute(sql`
      UPDATE generations 
      SET 
        user_id = ${userId},
        created_at = NOW(),
        updated_at = NOW()
      WHERE id IN (
        SELECT id 
        FROM generations 
        WHERE recipe_id = ${recipeId} 
          AND user_id = 'system_backlog' 
          AND status = 'completed'
        ORDER BY created_at ASC
        LIMIT 1
        FOR UPDATE SKIP LOCKED
      )
      RETURNING *
    `);

    return result.rows[0] as Generation || null;
  }
}

export const storage = new DatabaseStorage();