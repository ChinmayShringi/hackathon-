-- Migration: Create stored procedure to get recipe IDs that need options summarization

CREATE OR REPLACE FUNCTION get_recipe_options_unsummarized_recipe_ids()
RETURNS TABLE(recipe_id integer) AS $$
DECLARE
    min_last_generation_id integer;
BEGIN
    -- Find the lowest last_generation_id in recipe_usage_options table
    SELECT COALESCE(MIN(last_generation_id), 0)
    INTO min_last_generation_id
    FROM recipe_usage_options;
    
    -- Return unique recipe_ids from generations > min_last_generation_id
    RETURN QUERY
    SELECT DISTINCT g.recipe_id
    FROM generations g
    JOIN users u ON g.user_id = u.id
    WHERE g.recipe_id IS NOT NULL
      AND g.status = 'completed'
      AND g.id > min_last_generation_id
      AND u.account_type IN (2, 3)  -- Guest (2) or Registered (3), not System (1)
      AND g.metadata IS NOT NULL
      AND g.metadata->>'formData' IS NOT NULL
      AND g.metadata->'formData' != '{}'
    ORDER BY g.recipe_id;
END;
$$ LANGUAGE plpgsql; 