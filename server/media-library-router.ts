import { Router } from "express";
import { requireAuth } from "./unified-auth";
import { db } from "./db";
import { userAssets } from "@shared/schema";
import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { presignPutObject } from "./s3-presign-service";
import { derivativeService } from "./derivative-service";
import { headObject, getObjectRange } from "./s3-utils";

const router = Router();

const CDN = 'https://cdn.delu.la';
const BUCKET = 'delula-media-prod';
// Simple in-memory rate limiter per user and action
type RateRecord = { count: number; resetAt: number };
const rateMap: Map<string, RateRecord> = new Map();
function checkRateLimit(userId: string, action: string, limit: number, windowMs: number): boolean {
  const key = `${userId}:${action}`;
  const now = Date.now();
  const rec = rateMap.get(key);
  if (!rec || rec.resetAt < now) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (rec.count < limit) {
    rec.count += 1;
    return true;
  }
  return false;
}

// Idempotency memory for webhook processing
const processedWebhooks: Set<string> = new Set();
function webhookAlreadyProcessed(userId: string, assetId: string, thumbnailUrl: string): boolean {
  const key = `${userId}:${assetId}:${thumbnailUrl}`;
  if (processedWebhooks.has(key)) return true;
  processedWebhooks.add(key);
  // Best-effort cleanup after ~15 minutes
  setTimeout(() => processedWebhooks.delete(key), 15 * 60 * 1000).unref?.();
  return false;
}


// Whitelists and size caps (bytes)
const ALLOWED: Record<number, { exts: string[]; mimes: string[]; maxBytes: number; folder: string }> = {
  1: { exts: ["jpg", "jpeg", "png", "webp"], mimes: ["image/jpeg", "image/png", "image/webp"], maxBytes: 25 * 1024 * 1024, folder: "images" },
  2: { exts: ["mp4", "webm", "mov"], mimes: ["video/mp4", "video/webm", "video/quicktime"], maxBytes: 500 * 1024 * 1024, folder: "videos" },
  3: { exts: ["mp3", "wav"], mimes: ["audio/mpeg", "audio/wav"], maxBytes: 50 * 1024 * 1024, folder: "audio" },
  4: { exts: ["pdf"], mimes: ["application/pdf"], maxBytes: 25 * 1024 * 1024, folder: "documents" },
};

function getExtension(name: string): string {
  const idx = name.lastIndexOf('.');
  return idx >= 0 ? name.slice(idx + 1).toLowerCase() : '';
}

function validatePlannedKey(userId: string, folder: string, assetId: string, ext: string, s3Key: string) {
  const expectedPrefix = `library/user/${userId}/${folder}/originals/`;
  if (!s3Key.startsWith(expectedPrefix)) return false;
  const expectedName = `${assetId}.${ext}`;
  return s3Key.endsWith(expectedName);
}

function sniffMagicBytes(buf: Buffer, type: number): boolean {
  // Minimal signatures
  if (type === 1) {
    // JPEG FF D8 FF
    if (buf.length >= 3 && buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return true;
    // PNG 89 50 4E 47 0D 0A 1A 0A
    if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47 && buf[4] === 0x0D && buf[5] === 0x0A && buf[6] === 0x1A && buf[7] === 0x0A) return true;
    // WEBP RIFF....WEBP
    if (buf.length >= 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return true;
    return false;
  }
  if (type === 2) {
    // MP4 ftyp
    if (buf.length >= 12 && buf.toString('ascii', 4, 8) === 'ftyp') return true;
    // WEBM 1A 45 DF A3 (Matroska EBML)
    if (buf.length >= 4 && buf[0] === 0x1A && buf[1] === 0x45 && buf[2] === 0xDF && buf[3] === 0xA3) return true;
    return false;
  }
  if (type === 3) {
    // MP3: ID3 or frame sync 0xFF Ex
    if (buf.length >= 3 && buf.toString('ascii', 0, 3) === 'ID3') return true;
    if (buf.length >= 2 && buf[0] === 0xFF && (buf[1] & 0xE0) === 0xE0) return true;
    // WAV: RIFF....WAVE
    if (buf.length >= 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WAVE') return true;
    return false;
  }
  if (type === 4) {
    // PDF %PDF-
    if (buf.length >= 5 && buf.toString('ascii', 0, 5) === '%PDF-') return true;
    return false;
  }
  return false;
}

function placeholderFor(type: number): string {
  // Use simple public placeholders; can be replaced with actual icons later
  switch (type) {
    case 2: return `${CDN}/static/placeholders/video.png`;
    case 3: return `${CDN}/static/placeholders/audio.png`;
    case 4: return `${CDN}/static/placeholders/document.png`;
    default: return `${CDN}/static/placeholders/image.png`;
  }
}

function computeBaseUrl(req: any): string | null {
  try {
    const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
    const host = (req.headers['x-forwarded-host'] as string) || req.get('host');
    if (!host) return null;
    return `${proto}://${host}`;
  } catch {
    return null;
  }
}

async function scheduleVideoFirstFrame(videoUrl: string, assetId: string, userId?: string, serverBaseUrl?: string | null): Promise<void> {
  try {
    const { LambdaClient, InvokeCommand } = await import('@aws-sdk/client-lambda');
    const client = new LambdaClient({ region: process.env.AWS_REGION || 'us-east-1', credentials: { accessKeyId: process.env.AWS_DELULA_ACCESS_KEY!, secretAccessKey: process.env.AWS_DELULA_SECRET_ACCESS_KEY! } });
    const key = `videos/thumbnails/${assetId}.jpg`;
    const payload: Record<string, any> = {
      video_url: videoUrl,
      frame_requests: '0',
      destination_bucket: BUCKET,
      output_prefix: 'videos/thumbnails',
      allow_partial_completion: true,
    };
    if (userId) {
      payload.user_id = userId;
    }
    payload.asset_id = assetId;
    if (serverBaseUrl) {
      payload.server_base_url = serverBaseUrl;
    }
    const cmd = new InvokeCommand({ FunctionName: 'GetFramesFromVideo', Payload: JSON.stringify(payload) });
    client.send(cmd).then(async (resp) => {
      if (!resp.Payload) return;
      const result = JSON.parse(new TextDecoder().decode(resp.Payload));
      const frames = result?.body?.frames || result?.frames || {};
      const first = frames['0'] || Object.values(frames)[0];
      if (first?.s3_url || first?.bucket_key) {
        const thumbUrl = first.s3_url ? String(first.s3_url).replace(/^s3:\/\//, `${CDN}/`) : `${CDN}/${first.bucket_key}`;
        // caller is responsible for updating DB
      }
    }).catch(() => {});
  } catch (e) {
    console.error('scheduleVideoFirstFrame error', e);
  }
}

// GET /api/media-library/assets
router.get("/assets", requireAuth, async (req: any, res) => {
  try {
    const userId = req.userAccount.id;
    const type = req.query.type ? parseInt(String(req.query.type)) : undefined;
    const source = req.query.source ? parseInt(String(req.query.source)) : undefined;
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const sortBy = (req.query.sortBy as string) || "date";
    const sortOrder = ((req.query.sortOrder as string) || "desc").toLowerCase() === "asc" ? "asc" : "desc";
    const page = Math.max(1, parseInt(String(req.query.page || 1)) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit || 20)) || 20));
    const offset = (page - 1) * limit;

    // Base filter: user + not deleted
    const filters = [eq(userAssets.userId, userId), eq(userAssets.isDeleted, false)];
    if (type) filters.push(eq(userAssets.assetType, type));
    if (source) filters.push(eq(userAssets.source, source));

    // Search by normalized name or tags
    const where = and(
      ...filters,
      search
        ? sql`(${userAssets.normalizedName} ILIKE ${"%" + search.toLowerCase() + "%"}) OR EXISTS (SELECT 1 FROM unnest(${userAssets.userTags}) t WHERE t ILIKE ${"%" + search.toLowerCase() + "%"})`
        : sql`true`
    );

    // Sort
    const orderExpr = sortBy === "name"
      ? userAssets.displayName
      : sortBy === "size"
      ? userAssets.fileSize
      : sortBy === "usage"
      ? userAssets.usageCount
      : userAssets.createdAt;

    const orderer = sortOrder === "asc" ? orderExpr : desc(orderExpr);

    // Query assets
    const assets = await db
      .select()
      .from(userAssets)
      .where(where)
      .orderBy(orderer)
      .limit(limit)
      .offset(offset);

    // Total count
    const totalRows = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(userAssets)
      .where(where);

    // Type counts (all types for the user, not just search)
    const typeCountsRows = await db
      .select({ assetType: userAssets.assetType, count: sql<number>`count(*)::int` })
      .from(userAssets)
      .where(and(eq(userAssets.userId, userId), eq(userAssets.isDeleted, false)))
      .groupBy(userAssets.assetType);

    const typeCounts: Record<number, number> = {} as any;
    typeCountsRows.forEach((r) => (typeCounts[Number(r.assetType)] = r.count));

    res.json({
      assets,
      pagination: {
        currentPage: page,
        totalPages: Math.max(1, Math.ceil((totalRows[0]?.count || 0) / limit)),
        totalAssets: totalRows[0]?.count || 0,
        hasNextPage: page * limit < (totalRows[0]?.count || 0),
        hasPreviousPage: page > 1,
      },
      typeCounts,
    });
  } catch (error) {
    console.error("Failed to list media assets:", error);
    res.status(500).json({ error: "Failed to list media assets" });
  }
});

// GET /api/media-library/search-suggestions
router.get("/search-suggestions", requireAuth, async (req: any, res) => {
  try {
    const userId = req.userAccount.id;
    const q = (req.query.q as string) || "";
    if (q.length < 2) return res.json({ suggestions: [] });
    const query = "%" + q.toLowerCase() + "%";

    const nameRows = await db
      .select({ name: userAssets.displayName })
      .from(userAssets)
      .where(and(eq(userAssets.userId, userId), ilike(userAssets.normalizedName, query)))
      .limit(5);

    const tagRows = await db
      .select({ tag: sql<string>`unnest(${userAssets.userTags})` })
      .from(userAssets)
      .where(and(eq(userAssets.userId, userId), sql`EXISTS (SELECT 1 FROM unnest(${userAssets.userTags}) AS t WHERE t ILIKE ${query})`))
      .limit(5);

    const set = new Set<string>();
    nameRows.forEach((r) => r.name && set.add(r.name));
    tagRows.forEach((r: any) => r.tag && set.add(r.tag));

    res.json({ suggestions: Array.from(set).slice(0, 10) });
  } catch (error) {
    console.error("Failed to get search suggestions:", error);
    res.status(500).json({ error: "Failed to get suggestions" });
  }
});

// POST /api/media-library/upload-url (presign placeholder)
router.post("/upload-url", requireAuth, async (req: any, res) => {
  try {
    const userId = req.userAccount.id;
    if (!checkRateLimit(userId, 'upload-url', 60, 60_000)) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    const { filename, mimeType, assetType, fileSize } = req.body;
    if (!filename || !mimeType || !assetType) return res.status(400).json({ error: "Missing fields" });

    const typeNum = Number(assetType);
    const allow = ALLOWED[typeNum];
    if (!allow) return res.status(400).json({ error: "Unsupported asset type" });
    const ext = getExtension(filename);
    if (!allow.exts.includes(ext)) return res.status(400).json({ error: "File extension not allowed" });
    if (!allow.mimes.includes(mimeType)) return res.status(400).json({ error: "MIME type not allowed" });
    if (fileSize && Number(fileSize) > allow.maxBytes) return res.status(400).json({ error: "File too large" });

    const assetId = uuidv4();
    const typeFolder = allow.folder;
    const s3Key = `library/user/${userId}/${typeFolder}/originals/${assetId}.${ext}`;

    const bucket = 'delula-media-prod';
    const url = await presignPutObject(bucket, s3Key, mimeType);

    res.json({
      finalizeToken: uuidv4(),
      s3KeyPlanned: s3Key,
      assetId,
      presign: { method: "PUT", url, headers: { "Content-Type": mimeType } },
      cdnPreview: `https://cdn.delu.la/${s3Key}`
    });
  } catch (error) {
    console.error("Failed to create upload URL:", error);
    res.status(500).json({ error: "Failed to create upload URL" });
  }
});

// POST /api/media-library/finalize
router.post("/finalize", requireAuth, async (req: any, res) => {
  try {
    const userId = req.userAccount.id;
    if (!checkRateLimit(userId, 'finalize', 90, 60_000)) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    const {
      assetId,
      s3Key,
      originalFilename,
      fileSize,
      mimeType,
      assetType,
      displayName,
      cdnUrl,
      dimensions,
      duration,
      thumbnailUrl,
      userTags,
    } = req.body || {};

    if (!assetId || !s3Key || !originalFilename || !fileSize || !mimeType || !assetType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Enforce server-generated location: correct prefix, user scope, and UUID.ext
    const typeNum = Number(assetType);
    const allow = ALLOWED[typeNum];
    if (!allow) return res.status(400).json({ error: "Unsupported asset type" });
    const ext = getExtension(originalFilename);
    if (!validatePlannedKey(userId, allow.folder, assetId, ext, s3Key)) {
      return res.status(400).json({ error: "Invalid s3Key. Must end with /originals/{assetId}.{ext}" });
    }

    // S3 HEAD verification and size/mime checks
    const head = await headObject(BUCKET, s3Key);
    if (!head.exists) return res.status(400).json({ error: "Uploaded object not found" });
    if (head.contentLength && head.contentLength > allow.maxBytes) return res.status(400).json({ error: "File too large" });
    if (head.contentType && !allow.mimes.includes(head.contentType)) {
      // We still continue to magic sniff; if mismatch, reject
    }

    // Magic bytes sniff
    const firstBytes = await getObjectRange(BUCKET, s3Key, 0, 4095);
    if (!sniffMagicBytes(firstBytes, typeNum)) {
      return res.status(400).json({ error: "File content does not match declared type" });
    }

    const normalizedName = (displayName || originalFilename).toLowerCase();

    const [row] = await db
      .insert(userAssets)
      .values({
        userId,
        assetId,
        originalFilename,
        displayName: displayName || originalFilename.replace(/\.[^/.]+$/, ""),
        normalizedName,
        s3Key,
        cdnUrl: cdnUrl || `https://cdn.delu.la/${s3Key}`,
        mimeType,
        fileSize: Number(fileSize),
        assetType: Number(assetType),
        source: 1,
        dimensions: dimensions || null,
        duration: duration ? Number(duration) : null,
        thumbnailUrl: thumbnailUrl || placeholderFor(Number(assetType)),
        userTags: Array.isArray(userTags) ? userTags : [],
        systemTags: [],
        autoClassification: {
          mimeType,
          isImage: mimeType.startsWith("image/"),
          isVideo: mimeType.startsWith("video/"),
          isAudio: mimeType.startsWith("audio/"),
          size: Number(fileSize)
        },
      })
      .returning();

    // Generate derivatives asynchronously for images
    if (typeNum === 1) {
      derivativeService
        .generateImageDerivatives(s3Key, assetId)
        .then(async (d) => {
          if (d.thumbnailUrl) {
            await db.update(userAssets).set({ thumbnailUrl: d.thumbnailUrl, updatedAt: new Date() as any }).where(and(eq(userAssets.userId, userId), eq(userAssets.assetId, assetId)));
          }
        })
        .catch((e) => console.error('derivative error', e));
    } else if (typeNum === 2) {
      // Fire-and-forget: request first-frame extraction via existing Lambda
      const serverBaseUrl = computeBaseUrl(req);
      scheduleVideoFirstFrame(cdnUrl || `${CDN}/${s3Key}`, assetId, userId, serverBaseUrl).catch(() => {});
    }

    res.json({ success: true, asset: row });
  } catch (error) {
    console.error("Failed to finalize upload:", error);
    res.status(500).json({ error: "Failed to finalize upload" });
  }
});

// POST /api/media-library/import-delula
router.post("/import-delula", requireAuth, async (req: any, res) => {
  try {
    const userId = req.userAccount.id;
    const { generationId } = req.body;
    if (!generationId) return res.status(400).json({ error: "generationId required" });

    const { storage } = await import("./storage");
    const generation = await storage.getGenerationById(Number(generationId));
    if (!generation) return res.status(404).json({ error: "Generation not found" });

    const assetId = uuidv4();
    const ext = (generation.secureUrl || generation.imageUrl || "").split(".").pop() || "bin";
    const type = generation.type === "video" ? 2 : 1;
    const s3Key = `library/user/${userId}/${type === 2 ? "videos" : "images"}/originals/${assetId}.${ext}`;

    // Record only; actual S3 copy can be done by a background worker later
    const [row] = await db
      .insert(userAssets)
      .values({
        userId,
        assetId,
        originalFilename: `delula-${generation.shortId || generation.id}.${ext}`,
        displayName: generation.recipeTitle || `Generated ${generation.type}`,
        normalizedName: (generation.recipeTitle || `generated ${generation.type}`).toLowerCase(),
        s3Key,
        cdnUrl: generation.secureUrl || generation.imageUrl || "",
        mimeType: type === 2 ? "video/mp4" : "image/jpeg",
        fileSize: 0,
        assetType: type,
        source: 2,
        dimensions: null,
        duration: null,
        thumbnailUrl: generation.thumbnailUrl || null,
        userTags: [],
        systemTags: ["delula"],
        autoClassification: { fromGenerationId: generation.id },
      })
      .returning();

    res.json({ success: true, asset: row });
  } catch (error) {
    console.error("Failed to import delula asset:", error);
    res.status(500).json({ error: "Failed to import asset" });
  }
});

// DELETE /api/media-library/assets/:assetId (soft delete)
router.delete("/assets/:assetId", requireAuth, async (req: any, res) => {
  try {
    const userId = req.userAccount.id;
    const { assetId } = req.params;

    await db
      .update(userAssets)
      .set({ isDeleted: true, updatedAt: new Date() as any })
      .where(and(eq(userAssets.userId, userId), eq(userAssets.assetId, assetId)));

    res.json({ success: true });
  } catch (error) {
    console.error("Failed to delete asset:", error);
    res.status(500).json({ error: "Failed to delete asset" });
  }
});

// PATCH /api/media-library/assets/:assetId (rename, retag)
router.patch("/assets/:assetId", requireAuth, async (req: any, res) => {
  try {
    const userId = req.userAccount.id;
    const { assetId } = req.params;
    const { displayName, userTags } = req.body || {};

    const updates: any = {};
    if (typeof displayName === 'string' && displayName.trim().length > 0) {
      updates.displayName = displayName.trim();
      updates.normalizedName = displayName.trim().toLowerCase();
    }
    if (Array.isArray(userTags)) {
      updates.userTags = userTags;
    }
    if (Object.keys(updates).length === 0) return res.json({ success: true });

    const [row] = await db
      .update(userAssets)
      .set({ ...updates, updatedAt: new Date() as any })
      .where(and(eq(userAssets.userId, userId), eq(userAssets.assetId, assetId)))
      .returning();

    res.json({ success: true, asset: row });
  } catch (error) {
    console.error("Failed to update asset:", error);
    res.status(500).json({ error: "Failed to update asset" });
  }
});

// POST /api/media-library/analyze/:assetId (stub)
router.post("/analyze/:assetId", requireAuth, async (req: any, res) => {
  try {
    const userId = req.userAccount.id;
    const { assetId } = req.params;
    const rows = await db.select().from(userAssets).where(and(eq(userAssets.userId, userId), eq(userAssets.assetId, assetId))).limit(1);
    const asset = rows[0];
    if (!asset) return res.status(404).json({ error: 'Not found' });

    // Very basic classifier: derive candidate tags from display name and mime
    const nameTags = String(asset.displayName || '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).slice(0, 5);
    const mimeTag = String(asset.mimeType || '').split('/')[0];
    const labels = Array.from(new Set([mimeTag, ...nameTags]));

    const [updated] = await db.update(userAssets)
      .set({
        aiClassification: { analyzedAt: new Date().toISOString(), labels },
        systemTags: Array.isArray(asset.systemTags) ? Array.from(new Set([...(asset.systemTags as any[]), ...labels])) : labels,
        updatedAt: new Date() as any,
      })
      .where(and(eq(userAssets.userId, userId), eq(userAssets.assetId, assetId)))
      .returning();

    res.json({ success: true, asset: updated });
  } catch (error) {
    console.error('analyze error', error);
    res.status(500).json({ error: "Failed to analyze asset" });
  }
});

export default router;

// --- Webhook and polling endpoints (registered in routes.ts via app.use('/api/media-library', router)) ---

// Webhook: POST /api/media-library/webhook/thumbnail-ready
// Body: { userId, assetId, thumbnailUrl }
router.post('/webhook/thumbnail-ready', async (req: any, res) => {
  try {
    const provided = req.header('x-webhook-secret');
    const expected = process.env.MEDIA_WEBHOOK_SECRET;
    if (!expected || provided !== expected) return res.status(401).json({ error: 'Unauthorized' });
    const { userId, assetId, thumbnailUrl } = req.body || {};
    if (!userId || !assetId || !thumbnailUrl) return res.status(400).json({ error: 'Missing fields' });

    if (webhookAlreadyProcessed(userId, assetId, thumbnailUrl)) {
      return res.json({ success: true, idempotent: true });
    }

    const [row] = await db
      .update(userAssets)
      .set({ thumbnailUrl, updatedAt: new Date() as any })
      .where(and(eq(userAssets.userId, userId), eq(userAssets.assetId, assetId)))
      .returning();

    // Broadcast over WS if available
    try {
      (global as any).broadcastToUser?.(userId, { type: 'thumbnail_ready', data: { assetId, thumbnailUrl } });
    } catch {}

    res.json({ success: true, asset: row });
  } catch (e) {
    console.error('thumbnail-ready webhook error', e);
    res.status(500).json({ error: 'Failed to update thumbnail' });
  }
});

// Polling fallback: GET /api/media-library/assets/:assetId
router.get('/assets/:assetId', requireAuth, async (req: any, res) => {
  try {
    const userId = req.userAccount.id;
    const { assetId } = req.params;
    const rows = await db.select().from(userAssets).where(and(eq(userAssets.userId, userId), eq(userAssets.assetId, assetId))).limit(1);
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch asset' });
  }
});
