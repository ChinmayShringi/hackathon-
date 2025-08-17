# Media Library (User + Generated Assets)

This document describes the media library feature that unifies user uploads and Delula-generated assets. It includes storage layout, API endpoints, client behaviors, and security controls.

## Overview
- Universal access (alpha + prod): route `/library`
- Supports images, videos, audio, and documents
- Drag-and-drop multi-upload with progress, cancel, retry
- Paginated grid with type tabs, search with suggestions, rename, bulk delete
- Placeholders for all types; videos highlighted with blue border
- Thumbnails:
  - Images: Sharp derivatives (thumbnails, previews, webp)
  - Videos: first frame via `GetFramesFromVideo` Lambda (secure webhook callback)

## Storage Structure (S3)
All files are stored under user-specific prefixes and UUID filenames:
```
library/user/{userId}/{type}/
  originals/{assetId}.{ext}
  thumbnails/{assetId}.jpg
  previews/{assetId}.jpg
  webp/{assetId}.webp
```
Where `{type}` is one of `images | videos | audio | documents`.

- Filenames are server-assigned UUIDs. The client never controls final object keys.
- CDN base defaults to `https://cdn.delu.la`.

## Database Schema: `user_assets`
Columns include: `user_id, asset_id (unique), original_filename, display_name, normalized_name, s3_key, cdn_url, mime_type, file_size, asset_type, source, dimensions, duration, thumbnail_url, user_tags, system_tags, auto_classification, ai_classification, usage_count, created_at, updated_at, is_deleted`.

Indexes:
- `user_id, asset_type, created_at` (desc)
- `normalized_name`
- `asset_id` unique

A manual, idempotent migration is provided at `migrations/0007_user_assets_manual.sql`.

## API Endpoints (server)
Base path: `/api/media-library`

- `GET /assets` — list with pagination and filters
  - Query: `type?, page, limit?, search?, sortBy?, sortOrder?`
- `GET /search-suggestions?q` — returns display name and tag suggestions
- `POST /upload-url` — presign S3 PUT (server generates key)
  - Body: `{ filename, mimeType, assetType, fileSize? }`
  - Returns: `{ finalizeToken, s3KeyPlanned, assetId, presign, cdnPreview }`
- `POST /finalize` — record after successful S3 upload; triggers derivatives
  - Enforces s3Key prefix, UUID.ext, size caps, MIME whitelist, magic-byte sniffing
- `PATCH /assets/:assetId` — rename or update tags
- `DELETE /assets/:assetId` — soft delete
- `POST /analyze/:assetId` — basic label derivation (name tokens + MIME major type)
- `POST /webhook/thumbnail-ready` — secure webhook for video first frame
  - Header: `X-Webhook-Secret: $MEDIA_WEBHOOK_SECRET`
  - Body: `{ userId, assetId, thumbnailUrl }`

## Lambda: GetFramesFromVideo
- Accepts additional payload fields:
  - `user_id`, `asset_id`, `server_base_url` (computed by server per-request)
- On success posts to `POST /api/media-library/webhook/thumbnail-ready` with header secret
- Environment variables:
  - `MEDIA_WEBHOOK_SECRET` (required, must match server)
  - `CDN_BASE_URL` (optional, defaults to `https://cdn.delu.la`)

## Client Behaviors
- Page: `/library` (alpha + prod)
- Multi-upload with XHR progress; server presign + finalize
- Suggestions dropdown for search
- Bulk select + delete
- WebSocket live updates for thumbnail-ready; 5s polling fallback for videos

## Security Controls
- Server-only naming of S3 keys
- MIME + extension whitelist and per-type size caps
  - images (jpg/jpeg/png/webp, ≤25MB)
  - videos (mp4/webm/mov, ≤500MB)
  - audio (mp3/wav, ≤50MB)
  - documents (pdf, ≤25MB)
- S3 HEAD verification
- Magic-byte sniff (first 4–12 bytes per type)
- Secure webhook with shared secret; in-memory idempotency
- Basic per-user rate limiting on `/upload-url` and `/finalize`

## Testing
- Start server (`npm run dev`) and open `http://localhost:5232/library`
- Upload an image and a video; expect immediate placeholders and eventual thumbnails
- Check `/api/health` for server status

## Notes
- Sharing is not integrated yet (deferred)
- Future: collections/folders, cursor-based pagination, antivirus scanning, audio waveforms, video proxy
