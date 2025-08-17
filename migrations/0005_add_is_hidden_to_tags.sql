-- Migration: Add is_hidden field to tags table
-- This allows tags to be marked as internal/system-only and not displayed publicly

-- Add is_hidden column with default value false
ALTER TABLE tags ADD COLUMN is_hidden BOOLEAN NOT NULL DEFAULT false;

-- Create index for efficient filtering of hidden vs public tags
CREATE INDEX idx_tags_is_hidden ON tags (is_hidden);

-- Add comment explaining the purpose
COMMENT ON COLUMN tags.is_hidden IS 'When true, tag is only used internally and not displayed publicly. Useful for category organization and workflow classification.';
