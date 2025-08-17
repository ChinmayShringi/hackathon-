-- Migration: Create stored procedure to update all recipe options summaries

CREATE OR REPLACE FUNCTION update_recipe_options_summaries()
RETURNS void AS $$
DECLARE
    recipe_record RECORD;
    current_last_generation_id integer;
BEGIN
    -- Iterate over all recipe IDs that need summarization
    FOR recipe_record IN 
        SELECT recipe_id FROM get_recipe_options_unsummarized_recipe_ids()
    LOOP
        -- Get the current last_generation_id for this recipe
        SELECT COALESCE(last_generation_id, 0)
        INTO current_last_generation_id
        FROM recipe_usage_options
        WHERE recipe_id = recipe_record.recipe_id;
        
        -- If no record exists, create one with last_generation_id = 0
        IF current_last_generation_id IS NULL THEN
            INSERT INTO recipe_usage_options (recipe_id, last_generation_id, summary)
            VALUES (recipe_record.recipe_id, 0, '{}')
            ON CONFLICT (recipe_id) DO NOTHING;
            current_last_generation_id := 0;
        END IF;
        
        -- Update the recipe options summary
        PERFORM update_recipe_options_summary_for_recipe(
            recipe_record.recipe_id, 
            current_last_generation_id
        );
        
        RAISE NOTICE 'Updated recipe options summary for recipe_id: %', recipe_record.recipe_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql; 