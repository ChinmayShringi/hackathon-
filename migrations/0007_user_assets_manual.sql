-- Manual production-safe migration for user media library
-- - Creates user_assets table if not exists
-- - Adds required indexes if not exists
-- - Adds helper columns used by code if missing

BEGIN;

-- 1) Ensure user_assets exists
CREATE TABLE IF NOT EXISTS public.user_assets (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    asset_id VARCHAR(64) NOT NULL,
    original_filename VARCHAR NOT NULL,
    display_name VARCHAR NOT NULL,
    normalized_name VARCHAR,
    s3_key VARCHAR NOT NULL,
    cdn_url VARCHAR NOT NULL,
    mime_type VARCHAR NOT NULL,
    file_size INTEGER NOT NULL,
    asset_type INTEGER NOT NULL,
    source INTEGER NOT NULL,
    dimensions JSONB,
    duration INTEGER,
    thumbnail_url VARCHAR,
    user_tags TEXT[],
    system_tags TEXT[],
    auto_classification JSONB,
    ai_classification JSONB,
    usage_count INTEGER DEFAULT 0 NOT NULL,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP
);

-- 2) Ensure uniqueness and indexes
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'user_assets_asset_id_unique' AND n.nspname = 'public'
    ) THEN
        CREATE UNIQUE INDEX user_assets_asset_id_unique ON public.user_assets (asset_id);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_user_assets_user_type_created
    ON public.user_assets (user_id, asset_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_assets_normalized_name
    ON public.user_assets (normalized_name);

-- 3) Ensure supportive columns exist on related tables
ALTER TABLE public.recipes
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS first_visit_at TIMESTAMP DEFAULT NOW();

COMMIT;


