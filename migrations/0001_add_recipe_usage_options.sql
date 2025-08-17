-- Migration: Add recipe_usage_options table

CREATE TABLE "recipe_usage_options" (
  "recipe_id" integer PRIMARY KEY NOT NULL,
  "last_generation_id" integer DEFAULT 0 NOT NULL,
  "summary" jsonb DEFAULT '{}'::jsonb NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_recipe_usage_options_last_generation_id ON "recipe_usage_options" ("last_generation_id"); 