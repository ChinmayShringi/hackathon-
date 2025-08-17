-- Create recipe_usage table for optimized usage tracking
CREATE TABLE IF NOT EXISTS recipe_usage (
  recipe_id INTEGER PRIMARY KEY REFERENCES recipes(id) ON DELETE CASCADE,
  usage_count INTEGER NOT NULL DEFAULT 0,
  last_used_at TIMESTAMP DEFAULT NOW()
);

-- Index for popular recipes queries (usage count descending)
CREATE INDEX IF NOT EXISTS idx_recipe_usage_count_desc ON recipe_usage(usage_count DESC);

-- Index for recently used recipes
CREATE INDEX IF NOT EXISTS idx_recipe_usage_last_used_desc ON recipe_usage(last_used_at DESC);

-- Insert initial records for all existing recipes
INSERT INTO recipe_usage (recipe_id, usage_count, last_used_at)
SELECT 
  id as recipe_id,
  usage_count,
  COALESCE(
    (SELECT MAX(created_at) FROM generations WHERE recipe_id = recipes.id),
    NOW()
  ) as last_used_at
FROM recipes
ON CONFLICT (recipe_id) DO NOTHING; 