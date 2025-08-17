-- Backfill recipe_usage table with actual generation counts
-- This will update the usage counts to reflect real generation data

UPDATE recipe_usage 
SET 
  usage_count = (
    SELECT COUNT(*) 
    FROM generations 
    WHERE generations.recipe_id = recipe_usage.recipe_id
  ),
  last_used_at = (
    SELECT MAX(created_at) 
    FROM generations 
    WHERE generations.recipe_id = recipe_usage.recipe_id
  )
WHERE recipe_id IN (
  SELECT DISTINCT recipe_id 
  FROM generations 
  WHERE recipe_id IS NOT NULL
);

-- Insert records for recipes that have generations but no usage record
INSERT INTO recipe_usage (recipe_id, usage_count, last_used_at)
SELECT 
  recipe_id,
  COUNT(*) as usage_count,
  MAX(created_at) as last_used_at
FROM generations 
WHERE recipe_id IS NOT NULL 
  AND recipe_id NOT IN (SELECT recipe_id FROM recipe_usage)
GROUP BY recipe_id
ON CONFLICT (recipe_id) DO NOTHING;

-- Show the results
SELECT 
  r.id,
  r.name,
  ru.usage_count,
  ru.last_used_at,
  (SELECT COUNT(*) FROM generations WHERE recipe_id = r.id) as actual_generations
FROM recipes r
LEFT JOIN recipe_usage ru ON r.id = ru.recipe_id
ORDER BY ru.usage_count DESC NULLS LAST; 