-- Migration: Create stored procedure to update recipe options summary

CREATE OR REPLACE FUNCTION update_recipe_options_summary_for_recipe(
    p_recipe_id integer,
    p_last_generation_id integer
) RETURNS void AS $$
DECLARE
    old_summary jsonb;
    new_summary jsonb;
    merged_summary jsonb;
    max_generation_id integer;
    key text;
BEGIN
    -- Load the old summary
    SELECT summary INTO old_summary
    FROM recipe_usage_options
    WHERE recipe_id = p_recipe_id;

    IF old_summary IS NULL THEN
        old_summary := '{}'::jsonb;
    END IF;

    -- Compute the new summary for generations after last_generation_id
    WITH recipe_generations AS (
        SELECT 
            g.id,
            g.metadata,
            g.created_at
        FROM generations g
        JOIN users u ON g.user_id = u.id
        WHERE g.recipe_id = p_recipe_id
          AND g.status = 'completed'
          AND g.id > p_last_generation_id
          AND u.account_type IN (2, 3)
          AND g.metadata IS NOT NULL
          AND g.metadata->>'formData' IS NOT NULL
          AND g.metadata->'formData' != '{}'
        ORDER BY g.created_at DESC
    ),
    latest_generation AS (
        SELECT metadata->'formData' as latest_form_data
        FROM recipe_generations
        LIMIT 1
    ),
    value_counts AS (
        SELECT 
            fd.key,
            COALESCE(fd.value::text, 'null') as value_text,
            COUNT(*) as count
        FROM recipe_generations rg,
        jsonb_each(rg.metadata->'formData') as fd(key, value)
        GROUP BY fd.key, COALESCE(fd.value::text, 'null')
    ),
    summary AS (
        SELECT 
            vc.key,
            jsonb_object_agg(vc.value_text, vc.count) as value_counts
        FROM value_counts vc
        GROUP BY vc.key
    )
    SELECT COALESCE(jsonb_object_agg(s.key, s.value_counts), '{}'::jsonb)
    INTO new_summary
    FROM summary s;

    -- Merge summaries (new structure is canonical, but add old values not present in new)
    merged_summary := new_summary;

    -- For each key in old_summary not in new_summary, add it
    FOR key IN SELECT jsonb_object_keys(old_summary)
    LOOP
        IF NOT merged_summary ? key THEN
            merged_summary := merged_summary || jsonb_build_object(key, old_summary -> key);
        ELSE
            -- For each value in old_summary[key], if not in merged_summary[key], add it or sum counts
            merged_summary := jsonb_set(
                merged_summary,
                ARRAY[key],
                (
                    SELECT jsonb_object_agg(value, count)
                    FROM (
                        SELECT
                            value,
                            COALESCE(
                                (merged_summary -> key ->> value)::int,
                                0
                            ) + (old_summary -> key ->> value)::int AS count
                        FROM jsonb_each_text(old_summary -> key)
                        UNION
                        SELECT
                            value,
                            (merged_summary -> key ->> value)::int
                        FROM jsonb_each_text(merged_summary -> key)
                        WHERE NOT (old_summary -> key) ? value
                    ) t
                )
            );
        END IF;
    END LOOP;

    -- Find the new max generation id for this recipe
    SELECT COALESCE(MAX(g.id), 0)
    INTO max_generation_id
    FROM generations g
    JOIN users u ON g.user_id = u.id
    WHERE g.recipe_id = p_recipe_id
      AND g.status = 'completed'
      AND u.account_type IN (2, 3);

    -- Update the summary and last_generation_id
    UPDATE recipe_usage_options
    SET summary = merged_summary,
        last_generation_id = max_generation_id
    WHERE recipe_id = p_recipe_id;
END;
$$ LANGUAGE plpgsql; 