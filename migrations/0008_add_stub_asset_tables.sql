-- Migration: Add stub tables for system_assets and market_assets
-- This migration creates placeholder tables that will be implemented later
-- for the AssetSourceType system to work properly

-- Create system_assets table
CREATE TABLE IF NOT EXISTS "system_assets" (
  "id" serial PRIMARY KEY NOT NULL,
  "system_id" varchar NOT NULL,
  "asset_id" varchar(64) NOT NULL,
  "name" varchar NOT NULL,
  "url" varchar NOT NULL,
  "mime_type" varchar NOT NULL,
  "file_size" integer NOT NULL,
  "dimensions" jsonb,
  "tags" text[],
  "metadata" jsonb,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Create unique constraint on asset_id for system_assets
CREATE UNIQUE INDEX IF NOT EXISTS "system_assets_asset_id_unique" ON "system_assets" ("asset_id");

-- Create index on system_id for system_assets
CREATE INDEX IF NOT EXISTS "idx_system_assets_system_id" ON "system_assets" ("system_id");

-- Create market_assets table
CREATE TABLE IF NOT EXISTS "market_assets" (
  "id" serial PRIMARY KEY NOT NULL,
  "creator_id" varchar NOT NULL,
  "asset_id" varchar(64) NOT NULL,
  "name" varchar NOT NULL,
  "url" varchar NOT NULL,
  "mime_type" varchar NOT NULL,
  "file_size" integer NOT NULL,
  "dimensions" jsonb,
  "tags" text[],
  "metadata" jsonb,
  "is_public" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Create unique constraint on asset_id for market_assets
CREATE UNIQUE INDEX IF NOT EXISTS "market_assets_asset_id_unique" ON "market_assets" ("asset_id");

-- Create index on creator_id for market_assets
CREATE INDEX IF NOT EXISTS "idx_market_assets_creator_id" ON "market_assets" ("creator_id");

-- Create index on is_public for market_assets
CREATE INDEX IF NOT EXISTS "idx_market_assets_is_public" ON "market_assets" ("is_public");

-- Add comments for documentation
COMMENT ON TABLE "system_assets" IS 'Stub table for system resources and built-in assets (to be implemented later)';
COMMENT ON TABLE "market_assets" IS 'Stub table for shared marketplace content (to be implemented later)';
