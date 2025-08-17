--
-- PostgreSQL database dump
--

-- Dumped from database version 14.15
-- Dumped by pg_dump version 17.5

-- Started on 2025-07-14 17:32:24 CDT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP INDEX IF EXISTS public.idx_recipe_usage_options_last_generation_id;
DROP INDEX IF EXISTS public."IDX_users_session_token";
DROP INDEX IF EXISTS public."IDX_users_email";
DROP INDEX IF EXISTS public."IDX_users_account_type";
DROP INDEX IF EXISTS public."IDX_users_access_role";
DROP INDEX IF EXISTS public."IDX_session_expire";
DROP INDEX IF EXISTS public."IDX_services_type_id";
DROP INDEX IF EXISTS public."IDX_services_provider_title";
DROP INDEX IF EXISTS public."IDX_services_provider_id";
DROP INDEX IF EXISTS public."IDX_services_active";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_session_token_unique;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_handle_unique;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_unique;
ALTER TABLE IF EXISTS ONLY public.type_user DROP CONSTRAINT IF EXISTS type_user_pkey;
ALTER TABLE IF EXISTS ONLY public.type_services DROP CONSTRAINT IF EXISTS type_services_title_unique;
ALTER TABLE IF EXISTS ONLY public.type_services DROP CONSTRAINT IF EXISTS type_services_pkey;
ALTER TABLE IF EXISTS ONLY public.type_role DROP CONSTRAINT IF EXISTS type_role_pkey;
ALTER TABLE IF EXISTS ONLY public.type_audio DROP CONSTRAINT IF EXISTS type_audio_title_unique;
ALTER TABLE IF EXISTS ONLY public.type_audio DROP CONSTRAINT IF EXISTS type_audio_pkey;
ALTER TABLE IF EXISTS ONLY public.tags DROP CONSTRAINT IF EXISTS tags_pkey;
ALTER TABLE IF EXISTS ONLY public.tags DROP CONSTRAINT IF EXISTS tags_name_unique;
ALTER TABLE IF EXISTS ONLY public.smart_generation_requests DROP CONSTRAINT IF EXISTS smart_generation_requests_pkey;
ALTER TABLE IF EXISTS ONLY public.sessions DROP CONSTRAINT IF EXISTS sessions_pkey;
ALTER TABLE IF EXISTS ONLY public.services DROP CONSTRAINT IF EXISTS services_pkey;
ALTER TABLE IF EXISTS ONLY public.sample_likes DROP CONSTRAINT IF EXISTS sample_likes_pkey;
ALTER TABLE IF EXISTS ONLY public.revenue_shares DROP CONSTRAINT IF EXISTS revenue_shares_pkey;
ALTER TABLE IF EXISTS ONLY public.recipes DROP CONSTRAINT IF EXISTS recipes_referral_code_unique;
ALTER TABLE IF EXISTS ONLY public.recipes DROP CONSTRAINT IF EXISTS recipes_pkey;
ALTER TABLE IF EXISTS ONLY public.recipe_usage DROP CONSTRAINT IF EXISTS recipe_usage_pkey;
ALTER TABLE IF EXISTS ONLY public.recipe_usage_options DROP CONSTRAINT IF EXISTS recipe_usage_options_pkey;
ALTER TABLE IF EXISTS ONLY public.recipe_samples DROP CONSTRAINT IF EXISTS recipe_samples_pkey;
ALTER TABLE IF EXISTS ONLY public.recipe_option_tag_icon DROP CONSTRAINT IF EXISTS recipe_option_tag_icon_pkey;
ALTER TABLE IF EXISTS ONLY public.providers DROP CONSTRAINT IF EXISTS providers_title_unique;
ALTER TABLE IF EXISTS ONLY public.providers DROP CONSTRAINT IF EXISTS providers_pkey;
ALTER TABLE IF EXISTS ONLY public.generations DROP CONSTRAINT IF EXISTS generations_short_id_unique;
ALTER TABLE IF EXISTS ONLY public.generations DROP CONSTRAINT IF EXISTS generations_pkey;
ALTER TABLE IF EXISTS ONLY public.export_transactions DROP CONSTRAINT IF EXISTS export_transactions_pkey;
ALTER TABLE IF EXISTS ONLY public.credit_transactions DROP CONSTRAINT IF EXISTS credit_transactions_pkey;
ALTER TABLE IF EXISTS ONLY public.brand_assets DROP CONSTRAINT IF EXISTS brand_assets_pkey;
ALTER TABLE IF EXISTS ONLY public.backlog_videos DROP CONSTRAINT IF EXISTS backlog_videos_pkey;
ALTER TABLE IF EXISTS ONLY drizzle.__drizzle_migrations DROP CONSTRAINT IF EXISTS __drizzle_migrations_pkey;
ALTER TABLE IF EXISTS public.type_services ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tags ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.smart_generation_requests ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.services ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.sample_likes ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.revenue_shares ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.recipes ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.recipe_samples ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.providers ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.generations ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.export_transactions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.credit_transactions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.brand_assets ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.backlog_videos ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS drizzle.__drizzle_migrations ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.type_user;
DROP SEQUENCE IF EXISTS public.type_services_id_seq;
DROP TABLE IF EXISTS public.type_services;
DROP TABLE IF EXISTS public.type_role;
DROP TABLE IF EXISTS public.type_audio;
DROP SEQUENCE IF EXISTS public.tags_id_seq;
DROP TABLE IF EXISTS public.tags;
DROP SEQUENCE IF EXISTS public.smart_generation_requests_id_seq;
DROP TABLE IF EXISTS public.smart_generation_requests;
DROP TABLE IF EXISTS public.sessions;
DROP SEQUENCE IF EXISTS public.services_id_seq;
DROP TABLE IF EXISTS public.services;
DROP SEQUENCE IF EXISTS public.sample_likes_id_seq;
DROP TABLE IF EXISTS public.sample_likes;
DROP SEQUENCE IF EXISTS public.revenue_shares_id_seq;
DROP TABLE IF EXISTS public.revenue_shares;
DROP SEQUENCE IF EXISTS public.recipes_id_seq;
DROP TABLE IF EXISTS public.recipes;
DROP TABLE IF EXISTS public.recipe_usage_options;
DROP TABLE IF EXISTS public.recipe_usage;
DROP SEQUENCE IF EXISTS public.recipe_samples_id_seq;
DROP TABLE IF EXISTS public.recipe_samples;
DROP TABLE IF EXISTS public.recipe_option_tag_icon;
DROP SEQUENCE IF EXISTS public.providers_id_seq;
DROP TABLE IF EXISTS public.providers;
DROP SEQUENCE IF EXISTS public.generations_id_seq;
DROP TABLE IF EXISTS public.generations;
DROP SEQUENCE IF EXISTS public.export_transactions_id_seq;
DROP TABLE IF EXISTS public.export_transactions;
DROP SEQUENCE IF EXISTS public.credit_transactions_id_seq;
DROP TABLE IF EXISTS public.credit_transactions;
DROP SEQUENCE IF EXISTS public.brand_assets_id_seq;
DROP TABLE IF EXISTS public.brand_assets;
DROP SEQUENCE IF EXISTS public.backlog_videos_id_seq;
DROP TABLE IF EXISTS public.backlog_videos;
DROP SEQUENCE IF EXISTS drizzle.__drizzle_migrations_id_seq;
DROP TABLE IF EXISTS drizzle.__drizzle_migrations;
DROP FUNCTION IF EXISTS public.update_recipe_options_summary_for_recipe(p_recipe_id integer, p_last_generation_id integer);
DROP FUNCTION IF EXISTS public.update_recipe_options_summaries();
DROP FUNCTION IF EXISTS public.get_recipe_options_unsummarized_recipe_ids();
-- *not* dropping schema, since initdb creates it
DROP SCHEMA IF EXISTS drizzle;
DROP EXTENSION IF EXISTS pg_cron;
--
-- TOC entry 2 (class 3079 OID 25458)
-- Name: pg_cron; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;


--
-- TOC entry 4614 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pg_cron; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_cron IS 'Job scheduler for PostgreSQL';


--
-- TOC entry 7 (class 2615 OID 21894)
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA drizzle;


--
-- TOC entry 6 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- TOC entry 272 (class 1255 OID 22441)
-- Name: get_recipe_options_unsummarized_recipe_ids(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_recipe_options_unsummarized_recipe_ids() RETURNS TABLE(recipe_id integer)
    LANGUAGE plpgsql
    AS $$
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
$$;


--
-- TOC entry 273 (class 1255 OID 22471)
-- Name: update_recipe_options_summaries(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_recipe_options_summaries() RETURNS void
    LANGUAGE plpgsql
    AS $$
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
$$;


--
-- TOC entry 263 (class 1255 OID 22437)
-- Name: update_recipe_options_summary_for_recipe(integer, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_recipe_options_summary_for_recipe(p_recipe_id integer, p_last_generation_id integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
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
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 212 (class 1259 OID 21895)
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: -
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


--
-- TOC entry 213 (class 1259 OID 21900)
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: -
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4615 (class 0 OID 0)
-- Dependencies: 213
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: -
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- TOC entry 214 (class 1259 OID 21901)
-- Name: backlog_videos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.backlog_videos (
    id integer NOT NULL,
    recipe_id integer NOT NULL,
    recipe_variables jsonb NOT NULL,
    recipe_variables_hash character varying(64) NOT NULL,
    generation_id integer NOT NULL,
    video_url text NOT NULL,
    thumbnail_url text,
    s3_key text,
    asset_id text,
    short_id character varying(11),
    secure_url text,
    is_used boolean DEFAULT false NOT NULL,
    used_by_request_id integer,
    used_at timestamp without time zone,
    metadata jsonb,
    created_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 215 (class 1259 OID 21908)
-- Name: backlog_videos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.backlog_videos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4616 (class 0 OID 0)
-- Dependencies: 215
-- Name: backlog_videos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.backlog_videos_id_seq OWNED BY public.backlog_videos.id;


--
-- TOC entry 216 (class 1259 OID 21909)
-- Name: brand_assets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brand_assets (
    id integer NOT NULL,
    user_id character varying NOT NULL,
    name character varying NOT NULL,
    file_name character varying NOT NULL,
    file_url character varying NOT NULL,
    file_size integer NOT NULL,
    mime_type character varying NOT NULL,
    width integer,
    height integer,
    tags text[],
    is_transparent boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 217 (class 1259 OID 21917)
-- Name: brand_assets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.brand_assets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4617 (class 0 OID 0)
-- Dependencies: 217
-- Name: brand_assets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.brand_assets_id_seq OWNED BY public.brand_assets.id;


--
-- TOC entry 218 (class 1259 OID 21918)
-- Name: credit_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.credit_transactions (
    id integer NOT NULL,
    user_id character varying NOT NULL,
    amount integer NOT NULL,
    type text NOT NULL,
    description text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    payment_id character varying,
    metadata jsonb
);


--
-- TOC entry 219 (class 1259 OID 21924)
-- Name: credit_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.credit_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4618 (class 0 OID 0)
-- Dependencies: 219
-- Name: credit_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.credit_transactions_id_seq OWNED BY public.credit_transactions.id;


--
-- TOC entry 220 (class 1259 OID 21925)
-- Name: export_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.export_transactions (
    id integer NOT NULL,
    sample_id integer NOT NULL,
    buyer_id character varying NOT NULL,
    creator_id character varying NOT NULL,
    export_format character varying(20) NOT NULL,
    export_quality character varying(20) NOT NULL,
    price_credits integer NOT NULL,
    creator_earnings integer NOT NULL,
    download_url text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    downloaded_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 221 (class 1259 OID 21931)
-- Name: export_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.export_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4619 (class 0 OID 0)
-- Dependencies: 221
-- Name: export_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.export_transactions_id_seq OWNED BY public.export_transactions.id;


--
-- TOC entry 222 (class 1259 OID 21932)
-- Name: generations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.generations (
    id integer NOT NULL,
    user_id character varying NOT NULL,
    recipe_id integer,
    recipe_title text,
    prompt text NOT NULL,
    image_url text,
    status text DEFAULT 'pending'::text NOT NULL,
    metadata jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    video_url text,
    thumbnail_url text,
    s3_key text,
    asset_id text,
    queue_position integer,
    processing_started_at timestamp without time zone,
    type character varying(20) DEFAULT 'image'::character varying NOT NULL,
    is_public boolean DEFAULT false NOT NULL,
    is_published boolean DEFAULT false NOT NULL,
    download_count integer DEFAULT 0 NOT NULL,
    like_count integer DEFAULT 0 NOT NULL,
    failure_reason text,
    error_details jsonb,
    credits_cost integer,
    credits_refunded boolean DEFAULT false NOT NULL,
    refunded_at timestamp without time zone,
    retry_count integer DEFAULT 0 NOT NULL,
    max_retries integer DEFAULT 2 NOT NULL,
    short_id character varying(11),
    secure_url text,
    fal_job_id text,
    fal_job_status text,
    recovery_checked boolean DEFAULT false NOT NULL
);


--
-- TOC entry 223 (class 1259 OID 21949)
-- Name: generations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.generations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4620 (class 0 OID 0)
-- Dependencies: 223
-- Name: generations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.generations_id_seq OWNED BY public.generations.id;


--
-- TOC entry 224 (class 1259 OID 21950)
-- Name: providers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.providers (
    id integer NOT NULL,
    title character varying(100) NOT NULL,
    description text,
    num_slots integer DEFAULT 1 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    config jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 225 (class 1259 OID 21959)
-- Name: providers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.providers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4621 (class 0 OID 0)
-- Dependencies: 225
-- Name: providers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.providers_id_seq OWNED BY public.providers.id;


--
-- TOC entry 226 (class 1259 OID 21960)
-- Name: recipe_option_tag_icon; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recipe_option_tag_icon (
    id text NOT NULL,
    display text NOT NULL,
    icon text,
    color text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 227 (class 1259 OID 21967)
-- Name: recipe_samples; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recipe_samples (
    id integer NOT NULL,
    recipe_id integer NOT NULL,
    generation_id integer NOT NULL,
    user_id character varying NOT NULL,
    title text,
    description text,
    original_prompt text NOT NULL,
    thumbnail_url text NOT NULL,
    preview_url text NOT NULL,
    high_res_url text NOT NULL,
    type character varying(20) NOT NULL,
    file_size integer NOT NULL,
    dimensions jsonb,
    download_count integer DEFAULT 0 NOT NULL,
    like_count integer DEFAULT 0 NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    is_moderated boolean DEFAULT true NOT NULL,
    moderation_status character varying(20) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 228 (class 1259 OID 21979)
-- Name: recipe_samples_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.recipe_samples_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4622 (class 0 OID 0)
-- Dependencies: 228
-- Name: recipe_samples_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.recipe_samples_id_seq OWNED BY public.recipe_samples.id;


--
-- TOC entry 229 (class 1259 OID 21980)
-- Name: recipe_usage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recipe_usage (
    recipe_id integer NOT NULL,
    usage_count integer DEFAULT 0 NOT NULL,
    last_used_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 249 (class 1259 OID 22416)
-- Name: recipe_usage_options; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recipe_usage_options (
    recipe_id integer NOT NULL,
    last_generation_id integer DEFAULT 0 NOT NULL,
    summary jsonb DEFAULT '{}'::jsonb NOT NULL
);


--
-- TOC entry 230 (class 1259 OID 21985)
-- Name: recipes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recipes (
    id integer NOT NULL,
    name text NOT NULL,
    slug character varying(255) NOT NULL,
    description text NOT NULL,
    prompt text NOT NULL,
    instructions text NOT NULL,
    category text NOT NULL,
    style character varying(100) DEFAULT 'photorealistic'::character varying NOT NULL,
    model character varying(100) DEFAULT 'flux-1'::character varying NOT NULL,
    credit_cost integer NOT NULL,
    usage_count integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    video_provider character varying(50),
    video_duration integer DEFAULT 10,
    video_quality character varying(20) DEFAULT 'hd'::character varying,
    video_aspect_ratio character varying(10) DEFAULT '16:9'::character varying,
    image_provider character varying(50),
    image_quality character varying(20) DEFAULT 'hd'::character varying,
    image_size character varying(20) DEFAULT 'landscape_4_3'::character varying,
    num_images integer DEFAULT 1,
    creator_id character varying,
    is_public boolean DEFAULT false NOT NULL,
    has_content_restrictions boolean DEFAULT true NOT NULL,
    revenue_share_enabled boolean DEFAULT false NOT NULL,
    revenue_share_percentage integer DEFAULT 20 NOT NULL,
    recipe_steps jsonb NOT NULL,
    generation_type character varying(20) DEFAULT 'image'::character varying NOT NULL,
    referral_code character varying(20),
    preview_image_url text,
    workflow_type character varying(50) DEFAULT 'image'::character varying NOT NULL,
    workflow_components jsonb,
    tag_highlights integer[],
    audio_type integer DEFAULT 0 NOT NULL
);


--
-- TOC entry 231 (class 1259 OID 22008)
-- Name: recipes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.recipes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4623 (class 0 OID 0)
-- Dependencies: 231
-- Name: recipes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.recipes_id_seq OWNED BY public.recipes.id;


--
-- TOC entry 232 (class 1259 OID 22009)
-- Name: revenue_shares; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.revenue_shares (
    id integer NOT NULL,
    recipe_id integer NOT NULL,
    creator_id character varying NOT NULL,
    user_id character varying NOT NULL,
    generation_id integer NOT NULL,
    credits_used integer NOT NULL,
    revenue_amount integer NOT NULL,
    share_percentage integer NOT NULL,
    creator_earnings integer NOT NULL,
    is_paid_credits boolean NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 233 (class 1259 OID 22015)
-- Name: revenue_shares_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.revenue_shares_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4624 (class 0 OID 0)
-- Dependencies: 233
-- Name: revenue_shares_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.revenue_shares_id_seq OWNED BY public.revenue_shares.id;


--
-- TOC entry 234 (class 1259 OID 22016)
-- Name: sample_likes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sample_likes (
    id integer NOT NULL,
    sample_id integer NOT NULL,
    user_id character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 235 (class 1259 OID 22022)
-- Name: sample_likes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sample_likes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4625 (class 0 OID 0)
-- Dependencies: 235
-- Name: sample_likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sample_likes_id_seq OWNED BY public.sample_likes.id;


--
-- TOC entry 236 (class 1259 OID 22023)
-- Name: services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services (
    id integer NOT NULL,
    provider_id integer,
    provider_title character varying(100),
    type_id integer NOT NULL,
    title character varying(100) NOT NULL,
    description text NOT NULL,
    endpoint text NOT NULL,
    config jsonb,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    base_cost numeric(20,16) DEFAULT 0.0000000000000000 NOT NULL
);


--
-- TOC entry 237 (class 1259 OID 22032)
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4626 (class 0 OID 0)
-- Dependencies: 237
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- TOC entry 238 (class 1259 OID 22033)
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


--
-- TOC entry 239 (class 1259 OID 22038)
-- Name: smart_generation_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.smart_generation_requests (
    id integer NOT NULL,
    creator_id character varying NOT NULL,
    recipe_id integer NOT NULL,
    recipe_variables jsonb NOT NULL,
    recipe_variables_hash character varying(64) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    generation_id integer,
    backlog_video_id integer,
    credits_cost integer,
    failure_reason text,
    error_details jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 240 (class 1259 OID 22046)
-- Name: smart_generation_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.smart_generation_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4627 (class 0 OID 0)
-- Dependencies: 240
-- Name: smart_generation_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.smart_generation_requests_id_seq OWNED BY public.smart_generation_requests.id;


--
-- TOC entry 241 (class 1259 OID 22047)
-- Name: tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    color character varying(20) DEFAULT 'gray'::character varying,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 242 (class 1259 OID 22055)
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4628 (class 0 OID 0)
-- Dependencies: 242
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- TOC entry 243 (class 1259 OID 22056)
-- Name: type_audio; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.type_audio (
    id integer NOT NULL,
    title character varying(50) NOT NULL
);


--
-- TOC entry 248 (class 1259 OID 22379)
-- Name: type_role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.type_role (
    id integer NOT NULL,
    title text NOT NULL
);


--
-- TOC entry 244 (class 1259 OID 22059)
-- Name: type_services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.type_services (
    id integer NOT NULL,
    title character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 245 (class 1259 OID 22063)
-- Name: type_services_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.type_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4629 (class 0 OID 0)
-- Dependencies: 245
-- Name: type_services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.type_services_id_seq OWNED BY public.type_services.id;


--
-- TOC entry 247 (class 1259 OID 22369)
-- Name: type_user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.type_user (
    id integer NOT NULL,
    title text NOT NULL
);


--
-- TOC entry 246 (class 1259 OID 22064)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id character varying NOT NULL,
    email character varying,
    first_name character varying,
    last_name character varying,
    profile_image_url character varying,
    credits integer DEFAULT 10 NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    handle character varying,
    session_token character varying,
    last_seen_at timestamp without time zone DEFAULT now(),
    password_hash character varying,
    oauth_provider character varying(20),
    is_ephemeral boolean DEFAULT false,
    can_upgrade_to_registered boolean DEFAULT true,
    last_credit_refresh timestamp without time zone DEFAULT now(),
    account_type integer,
    access_role integer
);


--
-- TOC entry 4256 (class 2604 OID 22078)
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: -
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- TOC entry 4257 (class 2604 OID 22079)
-- Name: backlog_videos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backlog_videos ALTER COLUMN id SET DEFAULT nextval('public.backlog_videos_id_seq'::regclass);


--
-- TOC entry 4260 (class 2604 OID 22080)
-- Name: brand_assets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_assets ALTER COLUMN id SET DEFAULT nextval('public.brand_assets_id_seq'::regclass);


--
-- TOC entry 4264 (class 2604 OID 22081)
-- Name: credit_transactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credit_transactions ALTER COLUMN id SET DEFAULT nextval('public.credit_transactions_id_seq'::regclass);


--
-- TOC entry 4266 (class 2604 OID 22082)
-- Name: export_transactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.export_transactions ALTER COLUMN id SET DEFAULT nextval('public.export_transactions_id_seq'::regclass);


--
-- TOC entry 4268 (class 2604 OID 22084)
-- Name: generations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.generations ALTER COLUMN id SET DEFAULT nextval('public.generations_id_seq'::regclass);


--
-- TOC entry 4281 (class 2604 OID 22085)
-- Name: providers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.providers ALTER COLUMN id SET DEFAULT nextval('public.providers_id_seq'::regclass);


--
-- TOC entry 4288 (class 2604 OID 22086)
-- Name: recipe_samples id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_samples ALTER COLUMN id SET DEFAULT nextval('public.recipe_samples_id_seq'::regclass);


--
-- TOC entry 4298 (class 2604 OID 22087)
-- Name: recipes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes ALTER COLUMN id SET DEFAULT nextval('public.recipes_id_seq'::regclass);


--
-- TOC entry 4317 (class 2604 OID 22088)
-- Name: revenue_shares id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.revenue_shares ALTER COLUMN id SET DEFAULT nextval('public.revenue_shares_id_seq'::regclass);


--
-- TOC entry 4319 (class 2604 OID 22089)
-- Name: sample_likes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sample_likes ALTER COLUMN id SET DEFAULT nextval('public.sample_likes_id_seq'::regclass);


--
-- TOC entry 4321 (class 2604 OID 22090)
-- Name: services id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- TOC entry 4326 (class 2604 OID 22091)
-- Name: smart_generation_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.smart_generation_requests ALTER COLUMN id SET DEFAULT nextval('public.smart_generation_requests_id_seq'::regclass);


--
-- TOC entry 4330 (class 2604 OID 22092)
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- TOC entry 4334 (class 2604 OID 22093)
-- Name: type_services id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type_services ALTER COLUMN id SET DEFAULT nextval('public.type_services_id_seq'::regclass);


--
-- TOC entry 4252 (class 0 OID 25461)
-- Dependencies: 251
-- Data for Name: job; Type: TABLE DATA; Schema: cron; Owner: -
--

COPY cron.job (jobid, schedule, command, nodename, nodeport, database, username, active, jobname) FROM stdin;
1	0 * * * *	SELECT update_recipe_options_summaries();	localhost	5432	postgres	delulaadmin	t	update-recipe-options-summaries
\.


--
-- TOC entry 4254 (class 0 OID 25481)
-- Dependencies: 253
-- Data for Name: job_run_details; Type: TABLE DATA; Schema: cron; Owner: -
--

COPY cron.job_run_details (jobid, runid, job_pid, database, username, command, status, return_message, start_time, end_time) FROM stdin;
1	1	2346	postgres	delulaadmin	SELECT update_recipe_options_summaries();	succeeded	SELECT 1	2025-07-14 19:00:00.029908+00	2025-07-14 19:00:00.227299+00
1	2	5420	postgres	delulaadmin	SELECT update_recipe_options_summaries();	succeeded	SELECT 1	2025-07-14 20:00:00.01287+00	2025-07-14 20:00:00.063416+00
1	3	8414	postgres	delulaadmin	SELECT update_recipe_options_summaries();	succeeded	SELECT 1	2025-07-14 21:00:00.012283+00	2025-07-14 21:00:00.112683+00
1	4	11513	postgres	delulaadmin	SELECT update_recipe_options_summaries();	failed	ERROR: column reference "key" is ambiguous\nDETAIL: It could refer to either a PL/pgSQL variable or a table column.\nCONTEXT: PL/pgSQL function update_recipe_options_summary_for_recipe(integer,integer) line 70 at assignment\nSQL statement "SELECT update_recipe_options_summary_for_recipe(\n            recipe_record.recipe_id, \n            current_last_generation_id\n        )"\nPL/pgSQL function update_recipe_options_summaries() line 25 at PERFORM	2025-07-14 22:00:00.020021+00	2025-07-14 22:00:00.073939+00
\.


--
-- TOC entry 4571 (class 0 OID 21895)
-- Dependencies: 212
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: -
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
\.


--
-- TOC entry 4573 (class 0 OID 21901)
-- Dependencies: 214
-- Data for Name: backlog_videos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.backlog_videos (id, recipe_id, recipe_variables, recipe_variables_hash, generation_id, video_url, thumbnail_url, s3_key, asset_id, short_id, secure_url, is_used, used_by_request_id, used_at, metadata, created_at) FROM stdin;
\.


--
-- TOC entry 4575 (class 0 OID 21909)
-- Dependencies: 216
-- Data for Name: brand_assets; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.brand_assets (id, user_id, name, file_name, file_url, file_size, mime_type, width, height, tags, is_transparent, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4577 (class 0 OID 21918)
-- Dependencies: 218
-- Data for Name: credit_transactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.credit_transactions (id, user_id, amount, type, description, created_at, payment_id, metadata) FROM stdin;
1	38298645	-2	usage	Generated content using Futuristic AI Anatomy	2025-06-15 11:42:26.029144	\N	\N
2	admin_debug	-2	usage	Generated content using Futuristic AI Anatomy	2025-06-15 23:58:18.328997	\N	\N
3	admin_debug	-2	usage	Generated content using Futuristic AI Anatomy	2025-06-16 04:03:51.199475	\N	\N
4	admin_debug	-6	usage	Generated content using Futuristic AI Anatomy	2025-06-16 12:59:36.11612	\N	\N
5	admin_debug	-6	usage	Generated content using Futuristic AI Anatomy	2025-06-16 15:01:22.665127	\N	\N
6	admin_debug	6	refund	Refund for failed generation #5	2025-06-16 15:01:27.808144	\N	{"reason": "generation_failed", "generationId": 5}
7	admin_debug	-6	usage	Generated content using Futuristic AI Anatomy	2025-06-16 15:21:08.468184	\N	\N
8	admin_debug	6	refund	Refund for failed generation #6	2025-06-16 15:21:11.582568	\N	{"reason": "generation_failed", "generationId": 6}
9	admin_debug	-6	usage	Generated content using Futuristic AI Anatomy	2025-06-16 15:39:03.296197	\N	\N
10	admin_debug	6	refund	Refund for failed generation #7	2025-06-16 15:39:37.626648	\N	{"reason": "generation_failed", "generationId": 7}
11	admin_debug	-6	usage	Generated content using Futuristic AI Anatomy	2025-06-16 15:42:45.103959	\N	\N
12	admin_debug	-6	usage	Generated content using Futuristic AI Anatomy	2025-06-16 18:28:40.835415	\N	\N
13	admin_debug	-6	usage	Generated content using Futuristic AI Anatomy	2025-06-16 23:40:33.192476	\N	\N
14	admin_debug	-6	usage	Generated content using Futuristic AI Anatomy	2025-06-17 01:57:06.784544	\N	\N
15	admin_debug	-6	usage	Generated content using Futuristic AI Anatomy	2025-06-17 17:24:09.472601	\N	\N
16	admin_debug	-6	usage	Generated content using Futuristic AI Anatomy	2025-06-18 16:16:17.295392	\N	\N
17	admin_debug	-6	usage	Generated content using Futuristic AI Anatomy	2025-06-22 13:24:36.812527	\N	\N
18	admin_debug	6	refund	Refund for failed generation #14	2025-06-22 13:24:41.099409	\N	{"reason": "generation_failed", "generationId": 14}
19	shared_guest_user	-1	usage	Generated content using Lava Food ASMR	2025-07-13 16:35:47.581346	\N	\N
20	shared_guest_user	-1	usage	Generated content using BASEd Ape Vlog	2025-07-13 17:04:42.000229	\N	\N
21	shared_guest_user	-15	usage	Generated content using Cat Olympic Diving	2025-07-13 20:36:34.104924	\N	\N
22	shared_guest_user	-15	usage	Generated content using Cat Olympic Diving	2025-07-13 21:16:30.535738	\N	\N
23	guest_user	15	refund	Refund for failed generation #201	2025-07-13 21:19:48.965359	\N	{"reason": "generation_failed", "generationId": 201}
24	shared_guest_user	-10	usage	Generated content using Lava Food ASMR	2025-07-13 21:35:07.910457	\N	\N
25	shared_guest_user	-10	usage	Generated content using Lava Food ASMR	2025-07-13 23:54:43.238159	\N	\N
26	shared_guest_user	-15	usage	Generated content using BASEd Ape Vlog	2025-07-14 05:28:31.85832	\N	\N
27	shared_guest_user	-15	usage	Generated content using Cat Olympic Diving	2025-07-14 16:22:29.047429	\N	\N
28	shared_guest_user	-15	usage	Generated content using Cat Olympic Diving	2025-07-14 16:43:46.238218	\N	\N
29	shared_guest_user	-15	usage	Generated content using BASEd Ape Vlog	2025-07-14 16:44:09.497415	\N	\N
30	shared_guest_user	-10	usage	Generated content using Lava Food ASMR	2025-07-14 17:44:49.125443	\N	\N
31	guest_user	10	refund	Refund for failed generation #208	2025-07-14 17:44:49.274489	\N	{"reason": "generation_failed", "generationId": 208}
32	shared_guest_user	-10	usage	Generated content using Lava Food ASMR	2025-07-14 17:49:05.894848	\N	\N
33	guest_user	10	refund	Refund for failed generation #209	2025-07-14 17:49:06.040043	\N	{"reason": "generation_failed", "generationId": 209}
34	shared_guest_user	-10	usage	Generated content using Lava Food ASMR	2025-07-14 17:49:38.322341	\N	\N
35	guest_user	10	refund	Refund for failed generation #210	2025-07-14 17:49:38.456372	\N	{"reason": "generation_failed", "generationId": 210}
36	shared_guest_user	-10	usage	Generated content using Lava Food ASMR	2025-07-14 17:50:02.59954	\N	\N
37	guest_user	10	refund	Refund for failed generation #211	2025-07-14 17:50:02.760595	\N	{"reason": "generation_failed", "generationId": 211}
38	shared_guest_user	-10	usage	Generated content using Lava Food ASMR	2025-07-14 17:50:18.075518	\N	\N
39	guest_user	10	refund	Refund for failed generation #212	2025-07-14 17:50:18.217349	\N	{"reason": "generation_failed", "generationId": 212}
40	shared_guest_user	-10	usage	Generated content using Lava Food ASMR	2025-07-14 17:50:43.388841	\N	\N
41	guest_user	10	refund	Refund for failed generation #213	2025-07-14 17:50:43.520139	\N	{"reason": "generation_failed", "generationId": 213}
42	shared_guest_user	-10	usage	Generated content using Lava Food ASMR	2025-07-14 17:54:36.522332	\N	\N
59	shared_guest_user	-10	usage	Instant generation using Lava Food ASMR	2025-07-14 21:21:27.994982	\N	\N
60	shared_guest_user	-10	usage	Instant generation using Lava Food ASMR	2025-07-14 21:21:41.188991	\N	\N
61	shared_guest_user	-10	usage	Instant generation using Lava Food ASMR	2025-07-14 21:21:41.925939	\N	\N
62	shared_guest_user	-15	usage	Instant generation using Cat Olympic Diving	2025-07-14 21:40:14.031123	\N	\N
63	shared_guest_user	-15	usage	Instant generation using BASEd Ape Vlog	2025-07-14 21:52:51.138668	\N	\N
64	shared_guest_user	-15	usage	Instant generation using BASEd Ape Vlog	2025-07-14 22:13:10.390593	\N	\N
65	shared_guest_user	-10	usage	Instant generation using Lava Food ASMR	2025-07-14 22:14:46.384608	\N	\N
66	shared_guest_user	-10	usage	Instant generation using Lava Food ASMR	2025-07-14 22:20:07.949633	\N	\N
\.


--
-- TOC entry 4579 (class 0 OID 21925)
-- Dependencies: 220
-- Data for Name: export_transactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.export_transactions (id, sample_id, buyer_id, creator_id, export_format, export_quality, price_credits, creator_earnings, download_url, expires_at, downloaded_at, created_at) FROM stdin;
\.


--
-- TOC entry 4581 (class 0 OID 21932)
-- Dependencies: 222
-- Data for Name: generations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.generations (id, user_id, recipe_id, recipe_title, prompt, image_url, status, metadata, created_at, updated_at, video_url, thumbnail_url, s3_key, asset_id, queue_position, processing_started_at, type, is_public, is_published, download_count, like_count, failure_reason, error_details, credits_cost, credits_refunded, refunded_at, retry_count, max_retries, short_id, secure_url, fal_job_id, fal_job_status, recovery_checked) FROM stdin;
1	38298645	1	Futuristic AI Anatomy	A digital illustration of a female adult's human body, outlined with glowing blue lines that trace its anatomy. Set against a dark background, the contrast highlights the form and features. Emphasize the heart with a red glow to indicate importance or interest. The style is sleek, educational, and visually striking—like advanced imaging technology. Show external outlines.	\N	failed	\N	2025-06-15 11:42:25.870118	2025-06-15 11:42:25.870118	\N	\N	\N	\N	\N	\N	image	f	f	0	0	\N	\N	\N	f	\N	0	2	d8tHnezC6YP	\N	\N	\N	f
2	admin_debug	1	Futuristic AI Anatomy	A digital illustration of a female adult's human body, outlined with glowing blue lines that trace its anatomy. Set against a dark background, the contrast highlights the form and features. Emphasize the heart with a red glow to indicate importance or interest. The style is sleek, educational, and visually striking—like advanced imaging technology. Show external outlines.	\N	failed	\N	2025-06-15 23:58:18.148358	2025-06-15 23:58:18.148358	\N	\N	\N	\N	\N	\N	image	f	f	0	0	\N	\N	\N	f	\N	0	2	JEcKlx1tcxc	\N	\N	\N	f
3	admin_debug	1	Futuristic AI Anatomy	A digital illustration of a female adult's human body, outlined with glowing blue lines that trace its anatomy. Set against a dark background, the contrast highlights the form and features. Emphasize the heart with a red glow to indicate importance or interest. The style is sleek, educational, and visually striking—like advanced imaging technology. Show external outlines.	\N	failed	\N	2025-06-16 04:03:51.031886	2025-06-16 04:03:51.031886	\N	\N	\N	\N	\N	\N	image	f	f	0	0	\N	\N	\N	f	\N	0	2	rDIYsCJChJQ	\N	\N	\N	f
4	admin_debug	1	Futuristic AI Anatomy	A digital illustration of a female adult's human body, outlined with glowing blue lines that trace its anatomy. Set against a dark background, the contrast highlights the form and features. Emphasize the heart with a red glow to indicate importance or interest. The style is sleek, educational, and visually striking—like advanced imaging technology. Show external outlines.	\N	failed	\N	2025-06-16 12:59:35.945883	2025-06-16 15:22:24.002	\N	\N	\N	\N	\N	\N	image	f	f	0	0	Something unexpected happened. We've been notified and are working on a fix. Your credits have been refunded.	{"code": null, "type": null, "stack": "Error: Image generation failed: No image data in response\\n    at GPTImageService.generateImage (/home/runner/workspace/server/openai-gpt-image-service.ts:176:13)\\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\\n    at async GenerationQueue.processGeneration (/home/runner/workspace/server/queue-service.ts:115:18)\\n    at async GenerationQueue.startProcessing (/home/runner/workspace/server/queue-service.ts:74:9)", "status": null, "message": "Image generation failed: No image data in response", "timestamp": "2025-06-16T15:22:23.926Z"}	6	t	2025-06-16 13:07:07.57701	2	2	30C6V3kiAif	\N	\N	\N	f
5	admin_debug	1	Futuristic AI Anatomy	A digital illustration of a female adult's human body, outlined with glowing blue lines that trace its anatomy. Set against a dark background, the contrast highlights the form and features. Emphasize the heart with a red glow to indicate importance or interest. The style is sleek, educational, and visually striking—like advanced imaging technology. Show external outlines.	\N	failed	{"formData": {"age": "adult", "gender": "female", "details": "external", "bodyPart": "heart", "orientation": "portrait"}}	2025-06-16 15:01:22.493614	2025-06-16 15:01:38.893	\N	\N	\N	\N	\N	\N	image	f	f	0	0	Something unexpected happened. We've been notified and are working on a fix. Your credits have been refunded.	{"code": null, "type": null, "stack": "Error: Image generation failed: No image data in response\\n    at GPTImageService.generateImage (/home/runner/workspace/server/openai-gpt-image-service.ts:176:13)\\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\\n    at async GenerationQueue.processGeneration (/home/runner/workspace/server/queue-service.ts:100:18)\\n    at async GenerationQueue.startProcessing (/home/runner/workspace/server/queue-service.ts:68:9)", "status": null, "message": "Image generation failed: No image data in response", "timestamp": "2025-06-16T15:01:38.812Z"}	6	t	2025-06-16 15:01:27.695	2	2	xy3PY1wSJ-u	\N	\N	\N	f
6	admin_debug	1	Futuristic AI Anatomy	A digital illustration of a female adult's human body, outlined with glowing blue lines that trace its anatomy. Set against a dark background, the contrast highlights the form and features. Emphasize the heart with a red glow to indicate importance or interest. The style is sleek, educational, and visually striking—like advanced imaging technology. Show external outlines.	\N	failed	{"formData": {"age": "adult", "gender": "female", "details": "external", "bodyPart": "heart", "orientation": "portrait"}}	2025-06-16 15:21:08.295361	2025-06-16 15:21:22.369	\N	\N	\N	\N	\N	\N	image	f	f	0	0	Something unexpected happened. We've been notified and are working on a fix. Your credits have been refunded.	{"code": null, "type": null, "stack": "Error: Image generation failed: No image data in response\\n    at GPTImageService.generateImage (/home/runner/workspace/server/openai-gpt-image-service.ts:176:13)\\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\\n    at async GenerationQueue.processGeneration (/home/runner/workspace/server/queue-service.ts:115:18)\\n    at async GenerationQueue.startProcessing (/home/runner/workspace/server/queue-service.ts:74:9)", "status": null, "message": "Image generation failed: No image data in response", "timestamp": "2025-06-16T15:21:22.294Z"}	6	t	2025-06-16 15:21:11.47	2	2	_YxeK8Y-WhN	\N	\N	\N	f
8	admin_debug	1	Futuristic AI Anatomy	A digital illustration of a female adult's human body, outlined with glowing blue lines that trace its anatomy. Set against a dark background, the contrast highlights the form and features. Emphasize the heart with a red glow to indicate importance or interest. The style is sleek, educational, and visually striking—like advanced imaging technology. Show external outlines.	https://avbxp-public.s3.us-east-1.amazonaws.com/magicvidio/i8uT1DXFf1XQ.png	completed	{"size": "1024x1024", "model": "gpt-image-1", "format": "png", "prompt": "A digital illustration of a female adult's human body, outlined with glowing blue lines that trace its anatomy. Set against a dark background, the contrast highlights the form and features. Emphasize the heart with a red glow to indicate importance or interest. The style is sleek, educational, and visually striking—like advanced imaging technology. Show external outlines.", "tokens": 6144, "quality": "hd", "background": "auto"}	2025-06-16 15:42:44.927588	2025-06-16 15:43:15.111	\N	\N	magicvidio/i8uT1DXFf1XQ.png	i8uT1DXFf1XQ	\N	\N	image	t	f	0	0	\N	\N	6	f	\N	0	2	aBc123DeFg4	https://avbxp-public.s3.us-east-1.amazonaws.com/magicvidio/i8uT1DXFf1XQ.png	\N	\N	f
9	admin_debug	1	Futuristic AI Anatomy	A digital illustration of a female adult's human body, outlined with glowing blue lines that trace its anatomy. Set against a dark background, the contrast highlights the form and features. Emphasize the heart with a red glow to indicate importance or interest. The style is sleek, educational, and visually striking—like advanced imaging technology. Show external outlines.	https://avbxp-public.s3.amazonaws.com/magicvidio/ys6wQRKRYGQlR2tnJps9k4NWzZ9YMbXT.png	completed	{"size": "1024x1024", "model": "gpt-image-1", "format": "png", "prompt": "A digital illustration of a female adult's human body, outlined with glowing blue lines that trace its anatomy. Set against a dark background, the contrast highlights the form and features. Emphasize the heart with a red glow to indicate importance or interest. The style is sleek, educational, and visually striking—like advanced imaging technology. Show external outlines.", "tokens": 6144, "quality": "hd", "background": "auto"}	2025-06-16 18:28:40.661474	2025-06-16 18:29:07.402	\N	\N	magicvidio/ys6wQRKRYGQlR2tnJps9k4NWzZ9YMbXT.png	ys6wQRKRYGQlR2tnJps9k4NWzZ9YMbXT	\N	\N	image	f	f	0	0	\N	\N	6	f	\N	0	2	RCNJh13UFRu	https://avbxp-public.s3.amazonaws.com/magicvidio/ys6wQRKRYGQlR2tnJps9k4NWzZ9YMbXT.png	\N	\N	f
10	admin_debug	1	Futuristic AI Anatomy	A digital illustration of a female child's human body, outlined with glowing blue lines that trace its anatomy. Set against a dark background, the contrast highlights the form and features. Emphasize the heart with a red glow to indicate importance or interest. The style is sleek, educational, and visually striking—like advanced imaging technology. Show external outlines.	https://avbxp-public.s3.amazonaws.com/magicvidio/1EXGBmbPtc1TtX3QKuQeb6U55JC1zyuA.png	completed	{"size": "1024x1024", "model": "gpt-image-1", "format": "png", "prompt": "A digital illustration of a female child's human body, outlined with glowing blue lines that trace its anatomy. Set against a dark background, the contrast highlights the form and features. Emphasize the heart with a red glow to indicate importance or interest. The style is sleek, educational, and visually striking—like advanced imaging technology. Show external outlines.", "tokens": 6144, "quality": "hd", "background": "auto"}	2025-06-16 23:40:32.961294	2025-06-16 23:41:04.845	\N	\N	magicvidio/1EXGBmbPtc1TtX3QKuQeb6U55JC1zyuA.png	1EXGBmbPtc1TtX3QKuQeb6U55JC1zyuA	\N	\N	image	f	f	0	0	\N	\N	6	f	\N	0	2	YTot3PHikNI	https://avbxp-public.s3.amazonaws.com/magicvidio/1EXGBmbPtc1TtX3QKuQeb6U55JC1zyuA.png	\N	\N	f
11	admin_debug	1	Futuristic AI Anatomy	A digital illustration of a male child's human body, outlined with glowing blue lines that trace its anatomy. Set against a dark background, the contrast highlights the form and features. Emphasize the heart with a red glow to indicate importance or interest. The style is sleek, educational, and visually striking—like advanced imaging technology. Include other organs & skeleton.	https://avbxp-public.s3.amazonaws.com/magicvidio/tTeBSY-gETr4x3dLNyqR_382M1Pv3ANf.png	completed	{"size": "1024x1024", "model": "gpt-image-1", "format": "png", "prompt": "A digital illustration of a male child's human body, outlined with glowing blue lines that trace its anatomy. Set against a dark background, the contrast highlights the form and features. Emphasize the heart with a red glow to indicate importance or interest. The style is sleek, educational, and visually striking—like advanced imaging technology. Include other organs & skeleton.", "tokens": 6144, "quality": "hd", "background": "auto"}	2025-06-17 01:57:06.602242	2025-06-17 01:57:33.886	\N	\N	magicvidio/tTeBSY-gETr4x3dLNyqR_382M1Pv3ANf.png	tTeBSY-gETr4x3dLNyqR_382M1Pv3ANf	\N	\N	image	f	f	0	0	\N	\N	6	f	\N	0	2	70PyCeDzi1K	https://avbxp-public.s3.amazonaws.com/magicvidio/tTeBSY-gETr4x3dLNyqR_382M1Pv3ANf.png	\N	\N	f
13	admin_debug	1	Futuristic AI Anatomy	A digital illustration of a male teenager's human body, outlined with glowing blue lines that trace its anatomy. Set against a dark background, the contrast highlights the form and features. Emphasize the stomach with a red glow to indicate importance or interest. The style is sleek, educational, and visually striking—like advanced imaging technology. Show external outlines.	https://avbxp-public.s3.amazonaws.com/magicvidio/6NFItXMkO_2pSLXOQ0blSozJzpOU4DfM.png	completed	{"size": "1024x1024", "model": "gpt-image-1", "format": "png", "prompt": "A digital illustration of a male teenager's human body, outlined with glowing blue lines that trace its anatomy. Set against a dark background, the contrast highlights the form and features. Emphasize the stomach with a red glow to indicate importance or interest. The style is sleek, educational, and visually striking—like advanced imaging technology. Show external outlines.", "tokens": 6144, "quality": "hd", "background": "auto"}	2025-06-18 16:16:17.12844	2025-06-18 16:16:35.709	\N	\N	magicvidio/6NFItXMkO_2pSLXOQ0blSozJzpOU4DfM.png	6NFItXMkO_2pSLXOQ0blSozJzpOU4DfM	\N	\N	image	f	f	0	0	\N	\N	6	f	\N	0	2	PLhLVXXSvQg	https://avbxp-public.s3.amazonaws.com/magicvidio/6NFItXMkO_2pSLXOQ0blSozJzpOU4DfM.png	\N	\N	f
12	admin_debug	1	Futuristic AI Anatomy	A digital illustration of a male elderly human body, outlined with glowing blue lines that trace its anatomy. Set against a dark background, the contrast highlights the form and features. Emphasize the intestines with a red glow to indicate importance or interest. The style is sleek, educational, and visually striking—like advanced imaging technology. Show external outlines.	https://avbxp-public.s3.amazonaws.com/magicvidio/bbBo9v4Rqz-rqKhgw2SjlT9Ee1-0b7Ql.png	completed	{"size": "1024x1024", "model": "gpt-image-1", "format": "png", "prompt": "A digital illustration of a male elderly human body, outlined with glowing blue lines that trace its anatomy. Set against a dark background, the contrast highlights the form and features. Emphasize the intestines with a red glow to indicate importance or interest. The style is sleek, educational, and visually striking—like advanced imaging technology. Show external outlines.", "tokens": 6144, "quality": "hd", "background": "auto"}	2025-06-17 17:24:09.298327	2025-06-17 17:24:29.742	\N	\N	magicvidio/bbBo9v4Rqz-rqKhgw2SjlT9Ee1-0b7Ql.png	bbBo9v4Rqz-rqKhgw2SjlT9Ee1-0b7Ql	\N	\N	image	f	f	0	0	\N	\N	6	f	\N	0	2	buN7u5XVTlj	https://avbxp-public.s3.amazonaws.com/magicvidio/bbBo9v4Rqz-rqKhgw2SjlT9Ee1-0b7Ql.png	\N	\N	f
14	admin_debug	1	Futuristic AI Anatomy	A digital illustration of a female teenager's human body, outlined with glowing blue lines that trace its anatomy. Set against a dark background, the contrast highlights the form and features. Emphasize the brain with a red glow to indicate importance or interest. The style is sleek, educational, and visually striking—like advanced imaging technology. Show external outlines.	\N	failed	{"formData": {"age": "teenager", "gender": "female", "details": "external", "bodyPart": "brain", "orientation": "portrait"}}	2025-06-22 13:24:36.643782	2025-06-22 13:24:41.215	\N	\N	\N	\N	\N	\N	image	f	f	0	0	Something unexpected happened. We've been notified and are working on a fix. Your credits have been refunded.	{"code": null, "type": null, "stack": "Error: Image generation failed: 400 {\\"message\\":null,\\"type\\":\\"image_generation_user_error\\",\\"param\\":null,\\"code\\":null}\\n    at GPTImageService.generateImage (/home/runner/workspace/server/openai-gpt-image-service.ts:151:13)\\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\\n    at async GenerationQueue.processGeneration (/home/runner/workspace/server/queue-service.ts:115:18)\\n    at async GenerationQueue.startProcessing (/home/runner/workspace/server/queue-service.ts:74:9)", "status": null, "message": "Image generation failed: 400 {\\"message\\":null,\\"type\\":\\"image_generation_user_error\\",\\"param\\":null,\\"code\\":null}", "timestamp": "2025-06-22T13:24:41.140Z"}	6	t	2025-06-22 13:24:40.99	0	2	rWOxGKU1zT5	\N	\N	\N	f
7	admin_debug	1	Futuristic AI Anatomy	A digital illustration of a female adult's human body, outlined with glowing blue lines that trace its anatomy. Set against a dark background, the contrast highlights the form and features. Emphasize the heart with a red glow to indicate importance or interest. The style is sleek, educational, and visually striking—like advanced imaging technology. Show external outlines.	\N	failed	{"formData": {"age": "adult", "gender": "female", "details": "external", "bodyPart": "heart", "orientation": "portrait"}}	2025-06-16 15:39:03.133399	2025-06-16 15:40:41.868	\N	\N	\N	\N	\N	\N	image	f	f	0	0	Something unexpected happened. We've been notified and are working on a fix. Your credits have been refunded.	{"code": null, "type": null, "stack": "Error: Image generation failed: The bucket does not allow ACLs\\n    at GPTImageService.generateImage (/home/runner/workspace/server/openai-gpt-image-service.ts:148:13)\\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\\n    at async GenerationQueue.processGeneration (/home/runner/workspace/server/queue-service.ts:115:18)\\n    at async GenerationQueue.startProcessing (/home/runner/workspace/server/queue-service.ts:74:9)", "status": null, "message": "Image generation failed: The bucket does not allow ACLs", "timestamp": "2025-06-16T15:40:41.795Z"}	6	t	2025-06-16 15:39:37.517	2	2	dpBlmM4j6IU	\N	\N	\N	f
200	shared_guest_user	16	Cat Olympic Diving	{\n  "shot": {\n    "composition": "medium shot, professional dolly cable rigged camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "smooth tracking",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "obese black american shorthair adult cat",\n    "wardrobe": "a random athletic swimming suit appropriate to the character and setting"\n  },\n  "scene": {\n    "location": "Packed Olympic Stadium surrounds the pool. The stadium has an open ceiling so the sky is visible above the pool. Every seat in the stadium is filled, the lights are bright and there are camera flashes in the background.",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem like an excited stadium, invoking the idea that the subject is an animal attempting to perform olympic feats in diving"\n  },\n  "visual_details": {\n    "action": "running down the diving board in a clumsy amateur style, performing a forward dive, and entering the water with a meteoric",\n    "props": "olympic swimming pool, diving board"\n  },\n  "cinematography": {\n    "lighting": "indoors bright natural lighting with soft shadows",\n    "tone": "focused"\n  },\n  "audio": {\n    "ambient": "lots of clapping and audience cheering and whistling in the background, with Olympic Sports Commentator narration about what they're seeing"\n  },\n  "special_effects": "explosive meteoric entry with massive water displacement",\n  "color_palette": "grays and blues for the stadium and water, and colorful for the audience",\n  "additional_details": {\n    "water interaction": "the subject should enter the water and not come out, end once the water entry animation is complete"\n  }\n}		completed	{"model": "unknown", "s3Key": "videos/raw/a74a113a-8f24-4625-ac34-0e80fc5c11af.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/a74a113a-8f24-4625-ac34-0e80fc5c11af.mp4", "prompt": "", "assetId": "a74a113a-8f24-4625-ac34-0e80fc5c11af", "formData": {"age": "1", "breed": "black american shorthair", "weight": "3", "attitude": "clumsy amateur", "soundStyle": "stadium cheering", "divingStyle": "forward dive", "waterEntryStyle": "meteoric"}, "provider": "fal-ai/flux/dev", "generationType": "text_to_video", "transferredToS3": true}	2025-07-13 20:36:33.926184	2025-07-14 22:11:10.263564	https://cdn.delu.la/videos/raw/a74a113a-8f24-4625-ac34-0e80fc5c11af.mp4	https://cdn.delu.la/videos/thumbnails/a74a113a-8f24-4625-ac34-0e80fc5c11af.gif	s-EKNk15BB_XjNZEAB_ic_tmplb61inwa-combined.mp4	s-EKNk15BB_XjNZEAB_ic_tmplb61inwa-combined	\N	\N	video	f	f	0	0	\N	\N	15	f	\N	0	2	wDmalt6YSop	\N	54dd2e8f-3ffe-4f12-bf35-f73a68ea235a	processing	f
204	shared_guest_user	18	BASEd Ape Vlog	{\n  "shot": {\n    "composition": "medium shot, vertical format, handheld camera, photo-realistic",\n    "camera_motion": "shaky handcam",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "a towering, photorealistic gorilla (inspired by the Bored Apes Yacht Club) with well groomed fur and expressive eyes",\n    "wardrobe": "Tracksuit with sleek lines and a sporty vibe. Over this are the straps from his parachute pack."\n  },\n  "scene": {\n    "location": "small airplane cockpit with controls and instruments visible",\n    "time_of_day": "daytime outdoors",\n    "environment": "confined airplane interior with engine sounds and wind rushing past"\n  },\n  "visual_details": {\n    "action": "Gorilla holds professional microphone for vlogging, speaking excitedly to the camera about bragging about luxury lifestyle and expensive possessions before letting out a dramatic scream",\n    "props": "professional microphone for vlogging"\n  },\n  "cinematography": {\n    "lighting": "natural sunlight with soft shadows",\n    "tone": "lighthearted and humorous"\n  },\n  "audio": {\n    "ambient": "airplane engine sounds with wind rushing past",\n    "dialogue": {\n      "character": "Gorilla",\n      "subtitles": false\n    },\n    "effects": "yells something like aaaaah or wooooo after he jumps off"\n  },\n  "color_palette": "naturalistic with earthy greens and browns, whites and blues for snow",\n  "additional_details": {\n    "action": "gorilla talks to the camera about luxury lifestyle and expensive possessions and then jumps off the edge and parachutes down and away",\n    "parachute_type": "large glider-style parachute",\n    "attitude": "gorilla is an apathetic thrill-seeker, effortlessly cool, low-key reckless, YOLO"\n  }\n}		completed	{"model": "unknown", "s3Key": "videos/raw/037e25e8-17ae-4259-9912-92d3f34d2730.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/037e25e8-17ae-4259-9912-92d3f34d2730.mp4", "prompt": "", "assetId": "037e25e8-17ae-4259-9912-92d3f34d2730", "isGuest": true, "formData": {"propInHand": "microphone", "epicSetting": "small_airplane", "fashionStyle": "tracksuit", "vloggingTopic": "boujee_bragging"}, "provider": "fal-ai/flux/dev", "workflowType": "text_to_video", "generationType": "text_to_video", "tagDisplayData": {"Epic Setting": {"value": "Small Airplane"}, "Prop in Hand": {"value": "Microphone"}, "Fashion Style": {"value": "Tracksuit"}, "Vlogging Topic": {"value": "📢 Boujee Bragging"}}, "transferredToS3": true, "videoGeneration": null, "extractedVariables": {"propInHand": "microphone", "epicSetting": "small_airplane", "fashionStyle": "tracksuit", "vloggingTopic": "boujee_bragging"}}	2025-07-14 05:28:31.583361	2025-07-14 22:11:10.263564	https://cdn.delu.la/videos/raw/037e25e8-17ae-4259-9912-92d3f34d2730.mp4	https://cdn.delu.la/videos/thumbnails/037e25e8-17ae-4259-9912-92d3f34d2730.gif	uoMJubmEtyE1t9YQ7Gdlp_tmp54tmhoxm-combined.mp4	uoMJubmEtyE1t9YQ7Gdlp_tmp54tmhoxm-combined	\N	\N	video	f	f	0	0	\N	\N	15	f	\N	0	2	zRHRmcUErcB	\N	e069fcdd-b4c5-4853-b590-c82487c04d71	processing	f
211	shared_guest_user	17	Lava Food ASMR	{\n  "shot": {\n    "composition": "close shot, handheld camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "slight natural shake",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "30 year old female",\n    "wardrobe": "a random outfit appropriate for the setting"\n  },\n  "scene": {\n    "location": "a cozy home kitchen with warm lighting",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem surreally hot, invoking the idea that the subject is eating food made of lava"\n  },\n  "visual_details": {\n    "action": "eating lava chocolate cake made out of lava with a absolutely loving every bite expression on their face",\n    "props": "using only one fork in one hand to lift and take a bite out of the lava chocolate cake made of real lava"\n  },\n  "cinematography": {\n    "lighting": "indoors warm lighting with vibrant, flickering shadows",\n    "tone": "lighthearted and surreal"\n  },\n  "audio": {\n    "ambient": "gentle sounds of a home kitchen with nothing much going on",\n    "asmr": "oozing"\n  },\n  "special_effects": "the food is actually made of lava/magma that drips, burns, and oozes across surfaces",\n  "color_palette": "the lava should be bright yellow and orange, glowing with heat and bright light, reflected on skin",\n  "additional_details": {\n    "speed of action": "slowly taking bites",\n    "lava food interaction": "start with nothing in mouth, use utensils and take a bite, should create trails of lava when eating"\n  }\n}	\N	failed	{"isGuest": true, "formData": {"age": "30", "venue": "home kitchen", "gender": "female", "lavaFoodItem": "lava chocolate cake", "asmrSoundStyle": "oozing", "eatingExpression": "absolutely_loving_it"}, "workflowType": "text_to_video", "tagDisplayData": {"Age": {"value": "30"}, "Venue": {"value": "Home Kitchen"}, "Gender": {"value": "Female"}, "Lava Food Item": {"value": "Lava Chocolate Cake"}, "ASMR Sound Style": {"value": "Oozing"}, "Eating Expression": {"value": "😍 Absolutely Loving It"}}, "videoGeneration": null, "extractedVariables": {"age": "30", "venue": "home kitchen", "gender": "female", "lavaFoodItem": "lava chocolate cake", "asmrSoundStyle": "oozing", "eatingExpression": "absolutely_loving_it"}}	2025-07-14 17:50:02.590627	2025-07-14 22:11:10.263564	\N	\N	\N	\N	\N	\N	video	f	f	0	0	Something unexpected happened. We've been notified and are working on a fix. Your credits have been refunded.	{"code": null, "type": null, "stack": "ApiError: Forbidden\\n    at <anonymous> (/home/app/app/libs/client/src/response.ts:64:13)\\n    at Generator.next (<anonymous>)\\n    at fulfilled (/home/app/app/node_modules/@fal-ai/serverless-client/src/response.js:5:58)\\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)", "status": 403, "message": "Forbidden", "timestamp": "2025-07-14T17:50:02.764Z"}	10	t	2025-07-14 17:50:02.754	0	2	CkykwevjwKL	\N	\N	\N	f
207	shared_guest_user	18	BASEd Ape Vlog	{\n  "shot": {\n    "composition": "medium shot, vertical format, handheld camera, photo-realistic",\n    "camera_motion": "shaky handcam",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "a towering, photorealistic gorilla (inspired by the Bored Apes Yacht Club) with well groomed fur and expressive eyes",\n    "wardrobe": "Blazer with gold chains, giving off luxury influencer vibes"\n  },\n  "scene": {\n    "location": "deep canyon with towering rock walls and dramatic shadows",\n    "time_of_day": "daytime outdoors",\n    "environment": "echoing canyon walls with natural rock formations and dramatic lighting"\n  },\n  "visual_details": {\n    "action": "Gorilla holds smartphone mounted on a selfie stick, speaking excitedly to the camera about talking about spending money recklessly before letting out a dramatic scream",\n    "props": "smartphone mounted on a selfie stick"\n  },\n  "cinematography": {\n    "lighting": "natural sunlight with soft shadows",\n    "tone": "lighthearted and humorous"\n  },\n  "audio": {\n    "ambient": "echoing canyon sounds with wind through rock formations",\n    "dialogue": {\n      "character": "Gorilla",\n      "subtitles": false\n    },\n    "effects": "yells something like aaaaah or wooooo after he jumps off"\n  },\n  "color_palette": "naturalistic with earthy greens and browns, whites and blues for snow",\n  "additional_details": {\n    "action": "gorilla talks to the camera about spending money recklessly and then jumps off the edge and parachutes down and away",\n    "parachute_type": "large glider-style parachute",\n    "attitude": "gorilla is an apathetic thrill-seeker, effortlessly cool, low-key reckless, YOLO"\n  }\n}		completed	{"model": "unknown", "s3Key": "videos/raw/19b0803c-645b-45d6-a13c-b0ed84b3beb3.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/19b0803c-645b-45d6-a13c-b0ed84b3beb3.mp4", "prompt": "", "assetId": "19b0803c-645b-45d6-a13c-b0ed84b3beb3", "isGuest": true, "formData": {"propInHand": "selfie_stick", "epicSetting": "canyon", "fashionStyle": "blazer_gold_chains", "vloggingTopic": "burning_daddys_money"}, "provider": "fal-ai/flux/dev", "workflowType": "text_to_video", "generationType": "text_to_video", "tagDisplayData": {"Epic Setting": {"value": "Canyon"}, "Prop in Hand": {"value": "Selfie Stick"}, "Fashion Style": {"value": "Blazer & Gold Chains"}, "Vlogging Topic": {"value": "🤑 Burning Daddy's Money"}}, "transferredToS3": true, "videoGeneration": null, "extractedVariables": {"propInHand": "selfie_stick", "epicSetting": "canyon", "fashionStyle": "blazer_gold_chains", "vloggingTopic": "burning_daddys_money"}}	2025-07-14 16:44:09.4884	2025-07-14 22:11:10.263564	https://cdn.delu.la/videos/raw/19b0803c-645b-45d6-a13c-b0ed84b3beb3.mp4	https://cdn.delu.la/videos/thumbnails/19b0803c-645b-45d6-a13c-b0ed84b3beb3.gif	WQ5p5xgVblwO2UUfXzVsG_tmppd04_g79-combined.mp4	WQ5p5xgVblwO2UUfXzVsG_tmppd04_g79-combined	\N	\N	video	f	f	0	0	\N	\N	15	f	\N	0	2	UlGJP-ASoN1	\N	a2d436cd-3d58-4971-b643-0694b5df4274	processing	f
266	system_backlog	18	BASEd Ape Vlog (Backlog)	{\n  "shot": {\n    "composition": "medium shot, vertical format, handheld camera, photo-realistic",\n    "camera_motion": "shaky handcam",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "a towering, photorealistic gorilla (inspired by the Bored Apes Yacht Club) with well groomed fur and expressive eyes",\n    "wardrobe": "Tracksuit with sleek lines and a sporty vibe. Over this are the straps from his parachute pack."\n  },\n  "scene": {\n    "location": "mountain peaks surrounded by swirling clouds, where crisp air and endless horizons set the stage for high-altitude vibes",\n    "time_of_day": "daytime outdoors",\n    "environment": "thin, crisp air swirling around jagged peaks, with sunlight glinting off snow-dusted stone and endless sky above"\n  },\n  "visual_details": {\n    "action": "Gorilla holds no props in hand, just pure YOLO energy, speaking excitedly to the camera about speaking about living a BASEd life before letting out a dramatic scream",\n    "props": "no props in hand, just pure YOLO energy"\n  },\n  "cinematography": {\n    "lighting": "natural sunlight with soft shadows",\n    "tone": "lighthearted and humorous"\n  },\n  "audio": {\n    "ambient": "steady wind with occasional sharp gusts",\n    "dialogue": {\n      "character": "Gorilla",\n      "subtitles": false\n    },\n    "effects": "yells something like aaaaah or wooooo after he jumps off"\n  },\n  "color_palette": "naturalistic with earthy greens and browns, whites and blues for snow",\n  "additional_details": {\n    "action": "gorilla talks to the camera about living a BASEd life and then jumps off the edge and parachutes down and away",\n    "parachute_type": "large glider-style parachute",\n    "attitude": "gorilla is an apathetic thrill-seeker, effortlessly cool, low-key reckless, YOLO"\n  }\n}		completed	{"model": "veo3-fast", "s3Key": "videos/raw/a786040d-e69b-4d9b-813a-76936aba46e1.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/a786040d-e69b-4d9b-813a-76936aba46e1.mp4", "prompt": "", "assetId": "a786040d-e69b-4d9b-813a-76936aba46e1", "endpoint": "fal-ai/veo3/fast", "formData": {"propInHand": "\\"microphone\\"", "epicSetting": "\\"small_airplane\\"", "fashionStyle": "\\"blazer_gold_chains\\"", "vloggingTopic": "\\"burning_daddys_money\\""}, "provider": "fal-ai/flux/dev", "serviceId": 2, "backlogService": true, "generationType": "text_to_video", "transferredToS3": true, "isBacklogGeneration": true}	2025-07-14 20:15:23.64445	2025-07-14 20:19:36.899	https://cdn.delu.la/videos/raw/a786040d-e69b-4d9b-813a-76936aba46e1.mp4	https://cdn.delu.la/videos/thumbnails/a786040d-e69b-4d9b-813a-76936aba46e1.gif	spV5eQD0dnO0djZmnHIVG_tmpo7tmlceg-combined.mp4	spV5eQD0dnO0djZmnHIVG_tmpo7tmlceg-combined	\N	\N	image	f	f	0	0	\N	\N	0	f	\N	0	2	blm44275zw	\N	8dde0976-42d4-4f8d-a07b-2986fab5f0cb	processing	f
205	shared_guest_user	16	Cat Olympic Diving	{\n  "shot": {\n    "composition": "medium shot, professional dolly cable rigged camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "smooth tracking",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "obese bengal adult cat",\n    "wardrobe": "a random athletic swimming suit appropriate to the character and setting"\n  },\n  "scene": {\n    "location": "Packed Olympic Stadium surrounds the pool. The stadium has an open ceiling so the sky is visible above the pool. Every seat in the stadium is filled, the lights are bright and there are camera flashes in the background.",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem like an excited stadium, invoking the idea that the subject is an animal attempting to perform olympic feats in diving"\n  },\n  "visual_details": {\n    "action": "running down the diving board in a sophisticated and poised style, performing a twisting dive, and entering the water with a meteoric",\n    "props": "olympic swimming pool, diving board"\n  },\n  "cinematography": {\n    "lighting": "indoors bright natural lighting with soft shadows",\n    "tone": "focused"\n  },\n  "audio": {\n    "ambient": "lots of clapping and audience cheering and whistling in the background, with Olympic Sports Commentator narration about what they're seeing"\n  },\n  "special_effects": "explosive meteoric entry with massive water displacement",\n  "color_palette": "grays and blues for the stadium and water, and colorful for the audience",\n  "additional_details": {\n    "water interaction": "the subject should enter the water and not come out, end once the water entry animation is complete"\n  }\n}		completed	{"model": "unknown", "s3Key": "videos/raw/e2a93f24-73e6-4d5c-87a9-2f3b72f5b3b4.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/e2a93f24-73e6-4d5c-87a9-2f3b72f5b3b4.mp4", "prompt": "", "assetId": "e2a93f24-73e6-4d5c-87a9-2f3b72f5b3b4", "isGuest": true, "formData": {"age": "1", "breed": "bengal", "weight": "3", "attitude": "sophisticated and poised", "soundStyle": "stadium cheering", "divingStyle": "twisting dive", "waterEntryStyle": "meteoric"}, "provider": "fal-ai/flux/dev", "workflowType": "text_to_video", "generationType": "text_to_video", "tagDisplayData": {"Age": {"value": "Adult Cat"}, "Weight": {"value": "Obese"}, "Attitude": {"value": "Sophisticated & Poised"}, "Cat Breed": {"value": "Bengal"}, "Sound Style": {"value": "Stadium cheering ambiance"}, "Diving Style": {"value": "Twisting Dive"}, "Water Entry Style": {"value": "💥 Meteoric"}}, "transferredToS3": true, "videoGeneration": null, "extractedVariables": {"age": "1", "breed": "bengal", "weight": "3", "attitude": "sophisticated and poised", "soundStyle": "stadium cheering", "divingStyle": "twisting dive", "waterEntryStyle": "meteoric"}}	2025-07-14 16:22:29.037911	2025-07-14 22:11:10.263564	https://cdn.delu.la/videos/raw/e2a93f24-73e6-4d5c-87a9-2f3b72f5b3b4.mp4	https://cdn.delu.la/videos/thumbnails/e2a93f24-73e6-4d5c-87a9-2f3b72f5b3b4.gif	bWPXBCoiRhuQyjC4IKFcp_tmpx786o4x2-combined.mp4	bWPXBCoiRhuQyjC4IKFcp_tmpx786o4x2-combined	\N	\N	video	f	f	0	0	\N	\N	15	f	\N	0	2	dcewrlQBfIT	\N	6f5dd6a4-87be-4af8-9621-ab787e313a0e	processing	f
210	shared_guest_user	17	Lava Food ASMR	{\n  "shot": {\n    "composition": "close shot, handheld camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "slight natural shake",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "30 year old female",\n    "wardrobe": "a random outfit appropriate for the setting"\n  },\n  "scene": {\n    "location": "a cozy home kitchen with warm lighting",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem surreally hot, invoking the idea that the subject is eating food made of lava"\n  },\n  "visual_details": {\n    "action": "eating lava spoonful of honey made out of lava with a sophisticated culinary appreciation expression on their face",\n    "props": "using a spoon to scoop up the lava honey from a bowl"\n  },\n  "cinematography": {\n    "lighting": "indoors warm lighting with vibrant, flickering shadows",\n    "tone": "lighthearted and surreal"\n  },\n  "audio": {\n    "ambient": "gentle sounds of a home kitchen with nothing much going on",\n    "asmr": "dripping"\n  },\n  "special_effects": "the food is actually made of lava/magma that drips, burns, and oozes across surfaces",\n  "color_palette": "the lava should be bright yellow and orange, glowing with heat and bright light, reflected on skin",\n  "additional_details": {\n    "speed of action": "slowly taking bites",\n    "lava food interaction": "start with nothing in mouth, use utensils and take a bite, should create trails of lava when eating"\n  }\n}	\N	failed	{"isGuest": true, "formData": {"age": "30", "venue": "home kitchen", "gender": "female", "lavaFoodItem": "lava spoonful of honey", "asmrSoundStyle": "dripping", "eatingExpression": "sophisticated_enjoyment"}, "workflowType": "text_to_video", "tagDisplayData": {"Age": {"value": "30"}, "Venue": {"value": "Home Kitchen"}, "Gender": {"value": "Female"}, "Lava Food Item": {"value": "Lava Spoonful of Honey"}, "ASMR Sound Style": {"value": "Dripping"}, "Eating Expression": {"value": "🧐 Sophisticated Enjoyment"}}, "videoGeneration": null, "extractedVariables": {"age": "30", "venue": "home kitchen", "gender": "female", "lavaFoodItem": "lava spoonful of honey", "asmrSoundStyle": "dripping", "eatingExpression": "sophisticated_enjoyment"}}	2025-07-14 17:49:38.313998	2025-07-14 22:11:10.263564	\N	\N	\N	\N	\N	\N	video	f	f	0	0	Something unexpected happened. We've been notified and are working on a fix. Your credits have been refunded.	{"code": null, "type": null, "stack": "ApiError: Forbidden\\n    at <anonymous> (/home/app/app/libs/client/src/response.ts:64:13)\\n    at Generator.next (<anonymous>)\\n    at fulfilled (/home/app/app/node_modules/@fal-ai/serverless-client/src/response.js:5:58)\\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)", "status": 403, "message": "Forbidden", "timestamp": "2025-07-14T17:49:38.459Z"}	10	t	2025-07-14 17:49:38.451	0	2	pydMfBNxvb3	\N	\N	\N	f
206	shared_guest_user	16	Cat Olympic Diving	{\n  "shot": {\n    "composition": "medium shot, professional dolly cable rigged camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "smooth tracking",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "average weight black american shorthair kitten cat",\n    "wardrobe": "a random athletic swimming suit appropriate to the character and setting"\n  },\n  "scene": {\n    "location": "Packed Olympic Stadium surrounds the pool. The stadium has an open ceiling so the sky is visible above the pool. Every seat in the stadium is filled, the lights are bright and there are camera flashes in the background.",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem like an excited stadium, invoking the idea that the subject is an animal attempting to perform olympic feats in diving"\n  },\n  "visual_details": {\n    "action": "running down the diving board in a sophisticated and poised style, performing a twisting dive, and entering the water with a meteoric",\n    "props": "olympic swimming pool, diving board"\n  },\n  "cinematography": {\n    "lighting": "indoors bright natural lighting with soft shadows",\n    "tone": "focused"\n  },\n  "audio": {\n    "ambient": "lots of clapping and audience cheering and whistling in the background, with Olympic Sports Commentator narration about what they're seeing"\n  },\n  "special_effects": "explosive meteoric entry with massive water displacement",\n  "color_palette": "grays and blues for the stadium and water, and colorful for the audience",\n  "additional_details": {\n    "water interaction": "the subject should enter the water and not come out, end once the water entry animation is complete"\n  }\n}		completed	{"model": "unknown", "s3Key": "videos/raw/db6e1f21-8036-4e05-aa2a-0d49eb7e238d.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/db6e1f21-8036-4e05-aa2a-0d49eb7e238d.mp4", "prompt": "", "assetId": "db6e1f21-8036-4e05-aa2a-0d49eb7e238d", "isGuest": true, "formData": {"age": "0", "breed": "black american shorthair", "weight": "1", "attitude": "sophisticated and poised", "soundStyle": "stadium cheering", "divingStyle": "twisting dive", "waterEntryStyle": "meteoric"}, "provider": "fal-ai/flux/dev", "workflowType": "text_to_video", "generationType": "text_to_video", "tagDisplayData": {"Age": {"value": "Kitten"}, "Weight": {"value": "Average Weight"}, "Attitude": {"value": "Sophisticated & Poised"}, "Cat Breed": {"value": "Black American Shorthair"}, "Sound Style": {"value": "Stadium cheering ambiance"}, "Diving Style": {"value": "Twisting Dive"}, "Water Entry Style": {"value": "💥 Meteoric"}}, "transferredToS3": true, "videoGeneration": null, "extractedVariables": {"age": "0", "breed": "black american shorthair", "weight": "1", "attitude": "sophisticated and poised", "soundStyle": "stadium cheering", "divingStyle": "twisting dive", "waterEntryStyle": "meteoric"}}	2025-07-14 16:43:46.22913	2025-07-14 22:11:10.263564	https://cdn.delu.la/videos/raw/db6e1f21-8036-4e05-aa2a-0d49eb7e238d.mp4	https://cdn.delu.la/videos/thumbnails/db6e1f21-8036-4e05-aa2a-0d49eb7e238d.gif	9ReFYvzDBzOyIgBlUCV2T_tmph_inr1qh-combined.mp4	9ReFYvzDBzOyIgBlUCV2T_tmph_inr1qh-combined	\N	\N	video	f	f	0	0	\N	\N	15	f	\N	0	2	X7Ws770tJUX	\N	5a108ba8-1ddc-47c0-9201-64a8f8104089	processing	f
208	shared_guest_user	17	Lava Food ASMR	{\n  "shot": {\n    "composition": "close shot, handheld camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "slight natural shake",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "23 year old female",\n    "wardrobe": "a random outfit appropriate for the setting"\n  },\n  "scene": {\n    "location": "a cozy home kitchen with warm lighting",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem surreally hot, invoking the idea that the subject is eating food made of lava"\n  },\n  "visual_details": {\n    "action": "eating lava spoonful of honey made out of lava with a absolutely loving every bite expression on their face",\n    "props": "using a spoon to scoop up the lava honey from a bowl"\n  },\n  "cinematography": {\n    "lighting": "indoors warm lighting with vibrant, flickering shadows",\n    "tone": "lighthearted and surreal"\n  },\n  "audio": {\n    "ambient": "gentle sounds of a home kitchen with nothing much going on",\n    "asmr": "dripping"\n  },\n  "special_effects": "the food is actually made of lava/magma that drips, burns, and oozes across surfaces",\n  "color_palette": "the lava should be bright yellow and orange, glowing with heat and bright light, reflected on skin",\n  "additional_details": {\n    "speed of action": "slowly taking bites",\n    "lava food interaction": "start with nothing in mouth, use utensils and take a bite, should create trails of lava when eating"\n  }\n}	\N	failed	{"isGuest": true, "formData": {"age": "23", "venue": "home kitchen", "gender": "female", "lavaFoodItem": "lava spoonful of honey", "asmrSoundStyle": "dripping", "eatingExpression": "absolutely_loving_it"}, "workflowType": "text_to_video", "tagDisplayData": {"Age": {"value": "23"}, "Venue": {"value": "Home Kitchen"}, "Gender": {"value": "Female"}, "Lava Food Item": {"value": "Lava Spoonful of Honey"}, "ASMR Sound Style": {"value": "Dripping"}, "Eating Expression": {"value": "😍 Absolutely Loving It"}}, "videoGeneration": null, "extractedVariables": {"age": "23", "venue": "home kitchen", "gender": "female", "lavaFoodItem": "lava spoonful of honey", "asmrSoundStyle": "dripping", "eatingExpression": "absolutely_loving_it"}}	2025-07-14 17:44:49.115079	2025-07-14 22:11:10.263564	\N	\N	\N	\N	\N	\N	video	f	f	0	0	Something unexpected happened. We've been notified and are working on a fix. Your credits have been refunded.	{"code": null, "type": null, "stack": "ApiError: Forbidden\\n    at <anonymous> (/home/app/app/libs/client/src/response.ts:64:13)\\n    at Generator.next (<anonymous>)\\n    at fulfilled (/home/app/app/node_modules/@fal-ai/serverless-client/src/response.js:5:58)\\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)", "status": 403, "message": "Forbidden", "timestamp": "2025-07-14T17:44:49.277Z"}	10	t	2025-07-14 17:44:49.269	0	2	kPQ9Nw2cWpp	\N	\N	\N	f
268	shared_guest_user	17	Lava Food ASMR (Backlog)	{\n  "shot": {\n    "composition": "close shot, handheld camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "slight natural shake",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": ""70" year old "female"",\n    "wardrobe": "a random outfit appropriate for the setting"\n  },\n  "scene": {\n    "location": "home kitchen",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem surreally hot, invoking the idea that the subject is eating food made of lava"\n  },\n  "visual_details": {\n    "action": "eating "lava plate of food" made out of lava with a joyful and delighted expression on their face",\n    "props": "using their bare hands to eat the lava pizza"\n  },\n  "cinematography": {\n    "lighting": "indoors warm lighting with vibrant, flickering shadows",\n    "tone": "lighthearted and surreal"\n  },\n  "audio": {\n    "ambient": "gentle sounds of a home kitchen with nothing much going on",\n    "asmr": ""dripping""\n  },\n  "special_effects": "the food is actually made of lava/magma that drips, burns, and oozes across surfaces",\n  "color_palette": "the lava should be bright yellow and orange, glowing with heat and bright light, reflected on skin",\n  "additional_details": {\n    "speed of action": "slowly taking bites",\n    "lava food interaction": "start with nothing in mouth, use utensils and take a bite, should create trails of lava when eating"\n  }\n}		completed	{"model": "veo3-fast", "s3Key": "videos/raw/f47f734e-2bd8-46e3-b19c-340a6307a0f2.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/f47f734e-2bd8-46e3-b19c-340a6307a0f2.mp4", "prompt": "", "assetId": "f47f734e-2bd8-46e3-b19c-340a6307a0f2", "endpoint": "fal-ai/veo3/fast", "formData": {"age": "\\"70\\"", "venue": "\\"home kitchen\\"", "gender": "\\"female\\"", "lavaFoodItem": "\\"lava plate of food\\"", "asmrSoundStyle": "\\"dripping\\"", "eatingExpression": "\\"absolutely_loving_it\\""}, "provider": "fal-ai/flux/dev", "serviceId": 2, "backlogService": true, "generationType": "text_to_video", "transferredToS3": true, "isBacklogGeneration": true}	2025-07-14 21:21:40.592999	2025-07-14 21:21:40.592999	https://cdn.delu.la/videos/raw/f47f734e-2bd8-46e3-b19c-340a6307a0f2.mp4	https://cdn.delu.la/videos/thumbnails/f47f734e-2bd8-46e3-b19c-340a6307a0f2.gif	BHFpWeE50nkiVsyWPZnTX_tmp7k_ek8vc-combined.mp4	BHFpWeE50nkiVsyWPZnTX_tmp7k_ek8vc-combined	\N	\N	image	f	f	0	0	\N	\N	0	f	\N	0	2	blm6ezl7kz	\N	f439c3dc-8fa6-4b42-9eb1-48afec7a6e2d	processing	f
209	shared_guest_user	17	Lava Food ASMR	{\n  "shot": {\n    "composition": "close shot, handheld camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "slight natural shake",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "30 year old female",\n    "wardrobe": "a random outfit appropriate for the setting"\n  },\n  "scene": {\n    "location": "a typical office cubicle with fluorescent lighting",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem surreally hot, invoking the idea that the subject is eating food made of lava"\n  },\n  "visual_details": {\n    "action": "eating lava spoonful of honey made out of lava with a absolutely loving every bite expression on their face",\n    "props": "using a spoon to scoop up the lava honey from a bowl"\n  },\n  "cinematography": {\n    "lighting": "indoors warm lighting with vibrant, flickering shadows",\n    "tone": "lighthearted and surreal"\n  },\n  "audio": {\n    "ambient": "office noise, phones ringing, typing on computers",\n    "asmr": "dripping"\n  },\n  "special_effects": "the food is actually made of lava/magma that drips, burns, and oozes across surfaces",\n  "color_palette": "the lava should be bright yellow and orange, glowing with heat and bright light, reflected on skin",\n  "additional_details": {\n    "speed of action": "slowly taking bites",\n    "lava food interaction": "start with nothing in mouth, use utensils and take a bite, should create trails of lava when eating"\n  }\n}	\N	failed	{"isGuest": true, "formData": {"age": "30", "venue": "office cubicle", "gender": "female", "lavaFoodItem": "lava spoonful of honey", "asmrSoundStyle": "dripping", "eatingExpression": "absolutely_loving_it"}, "workflowType": "text_to_video", "tagDisplayData": {"Age": {"value": "30"}, "Venue": {"value": "Office Cubicle"}, "Gender": {"value": "Female"}, "Lava Food Item": {"value": "Lava Spoonful of Honey"}, "ASMR Sound Style": {"value": "Dripping"}, "Eating Expression": {"value": "😍 Absolutely Loving It"}}, "videoGeneration": null, "extractedVariables": {"age": "30", "venue": "office cubicle", "gender": "female", "lavaFoodItem": "lava spoonful of honey", "asmrSoundStyle": "dripping", "eatingExpression": "absolutely_loving_it"}}	2025-07-14 17:49:05.886359	2025-07-14 22:11:10.263564	\N	\N	\N	\N	\N	\N	video	f	f	0	0	Something unexpected happened. We've been notified and are working on a fix. Your credits have been refunded.	{"code": null, "type": null, "stack": "ApiError: Forbidden\\n    at <anonymous> (/home/app/app/libs/client/src/response.ts:64:13)\\n    at Generator.next (<anonymous>)\\n    at fulfilled (/home/app/app/node_modules/@fal-ai/serverless-client/src/response.js:5:58)\\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)", "status": 403, "message": "Forbidden", "timestamp": "2025-07-14T17:49:06.043Z"}	10	t	2025-07-14 17:49:06.035	0	2	Kmm7BGqg8md	\N	\N	\N	f
212	shared_guest_user	17	Lava Food ASMR	{\n  "shot": {\n    "composition": "close shot, handheld camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "slight natural shake",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "30 year old female",\n    "wardrobe": "a random outfit appropriate for the setting"\n  },\n  "scene": {\n    "location": "a cozy home kitchen with warm lighting",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem surreally hot, invoking the idea that the subject is eating food made of lava"\n  },\n  "visual_details": {\n    "action": "eating lava pizza made out of lava with a completely bored and indifferent expression on their face",\n    "props": "using their bare hands to eat the lava pizza"\n  },\n  "cinematography": {\n    "lighting": "indoors warm lighting with vibrant, flickering shadows",\n    "tone": "lighthearted and surreal"\n  },\n  "audio": {\n    "ambient": "gentle sounds of a home kitchen with nothing much going on",\n    "asmr": "crunchy"\n  },\n  "special_effects": "the food is actually made of lava/magma that drips, burns, and oozes across surfaces",\n  "color_palette": "the lava should be bright yellow and orange, glowing with heat and bright light, reflected on skin",\n  "additional_details": {\n    "speed of action": "slowly taking bites",\n    "lava food interaction": "start with nothing in mouth, use utensils and take a bite, should create trails of lava when eating"\n  }\n}	\N	failed	{"isGuest": true, "formData": {"age": "30", "venue": "home kitchen", "gender": "female", "lavaFoodItem": "lava pizza", "asmrSoundStyle": "crunchy", "eatingExpression": "bored"}, "workflowType": "text_to_video", "tagDisplayData": {"Age": {"value": "30"}, "Venue": {"value": "Home Kitchen"}, "Gender": {"value": "Female"}, "Lava Food Item": {"value": "Lava Pizza"}, "ASMR Sound Style": {"value": "Crunchy"}, "Eating Expression": {"value": "🤭 Bored"}}, "videoGeneration": null, "extractedVariables": {"age": "30", "venue": "home kitchen", "gender": "female", "lavaFoodItem": "lava pizza", "asmrSoundStyle": "crunchy", "eatingExpression": "bored"}}	2025-07-14 17:50:18.066655	2025-07-14 22:11:10.263564	\N	\N	\N	\N	\N	\N	video	f	f	0	0	Something unexpected happened. We've been notified and are working on a fix. Your credits have been refunded.	{"code": null, "type": null, "stack": "ApiError: Forbidden\\n    at <anonymous> (/home/app/app/libs/client/src/response.ts:64:13)\\n    at Generator.next (<anonymous>)\\n    at fulfilled (/home/app/app/node_modules/@fal-ai/serverless-client/src/response.js:5:58)\\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)", "status": 403, "message": "Forbidden", "timestamp": "2025-07-14T17:50:18.220Z"}	10	t	2025-07-14 17:50:18.212	0	2	hdeGSE4ADPL	\N	\N	\N	f
202	shared_guest_user	17	Lava Food ASMR	{\n  "shot": {\n    "composition": "close shot, handheld camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "slight natural shake",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "30 year old female",\n    "wardrobe": "a random outfit appropriate for the setting"\n  },\n  "scene": {\n    "location": "a cozy home kitchen with warm lighting",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem surreally hot, invoking the idea that the subject is eating food made of lava"\n  },\n  "visual_details": {\n    "action": "eating lava pizza made out of lava with a joyful and delighted expression on their face",\n    "props": "using their bare hands to eat the lava pizza"\n  },\n  "cinematography": {\n    "lighting": "indoors warm lighting with vibrant, flickering shadows",\n    "tone": "lighthearted and surreal"\n  },\n  "audio": {\n    "ambient": "gentle sounds of a home kitchen with nothing much going on",\n    "asmr": "crunchy"\n  },\n  "special_effects": "the food is actually made of lava/magma that drips, burns, and oozes across surfaces",\n  "color_palette": "the lava should be bright yellow and orange, glowing with heat and bright light, reflected on skin",\n  "additional_details": {\n    "speed of action": "slowly taking bites",\n    "lava food interaction": "start with nothing in mouth, use utensils and take a bite, should create trails of lava when eating"\n  }\n}		completed	{"model": "unknown", "s3Key": "videos/raw/56c51374-bdc9-495a-847a-4ebac010abdf.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/56c51374-bdc9-495a-847a-4ebac010abdf.mp4", "prompt": "", "assetId": "56c51374-bdc9-495a-847a-4ebac010abdf", "formData": {}, "provider": "fal-ai/flux/dev", "generationType": "text_to_video", "transferredToS3": true}	2025-07-13 21:35:07.760449	2025-07-14 22:11:10.263564	https://cdn.delu.la/videos/raw/56c51374-bdc9-495a-847a-4ebac010abdf.mp4	https://cdn.delu.la/videos/thumbnails/56c51374-bdc9-495a-847a-4ebac010abdf.gif	23TxGOoazGSrPH2gOkKov_tmp_x99r4w1-combined.mp4	23TxGOoazGSrPH2gOkKov_tmp_x99r4w1-combined	\N	\N	video	f	f	0	0	\N	\N	10	f	\N	0	2	IwBByeZ6A-5	\N	48fdf6fe-b3bf-4139-aa02-6db5ddedc4bc	processing	f
203	shared_guest_user	17	Lava Food ASMR	{\n  "shot": {\n    "composition": "close shot, handheld camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "slight natural shake",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "70 year old female",\n    "wardrobe": "a random outfit appropriate for the setting"\n  },\n  "scene": {\n    "location": "a comfortable living room with a TV tray and couch",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem surreally hot, invoking the idea that the subject is eating food made of lava"\n  },\n  "visual_details": {\n    "action": "eating lava plate of food made out of lava with a sophisticated culinary appreciation expression on their face",\n    "props": "using a fork and knife in each hand to cut into a five course fine dining meal"\n  },\n  "cinematography": {\n    "lighting": "indoors warm lighting with vibrant, flickering shadows",\n    "tone": "lighthearted and surreal"\n  },\n  "audio": {\n    "ambient": "background television with a random daytime tv show barely audible",\n    "asmr": "bubbling"\n  },\n  "special_effects": "the food is actually made of lava/magma that drips, burns, and oozes across surfaces",\n  "color_palette": "the lava should be bright yellow and orange, glowing with heat and bright light, reflected on skin",\n  "additional_details": {\n    "speed of action": "slowly taking bites",\n    "lava food interaction": "start with nothing in mouth, use utensils and take a bite, should create trails of lava when eating"\n  }\n}		completed	{"model": "unknown", "s3Key": "videos/raw/20231304-de47-4805-8a9f-9df4381a9b5e.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/20231304-de47-4805-8a9f-9df4381a9b5e.mp4", "prompt": "", "assetId": "20231304-de47-4805-8a9f-9df4381a9b5e", "isGuest": true, "formData": {"age": "70", "venue": "tv tray dinner on couch", "gender": "female", "lavaFoodItem": "lava plate of food", "asmrSoundStyle": "bubbling", "eatingExpression": "sophisticated_enjoyment"}, "provider": "fal-ai/flux/dev", "workflowType": "text_to_video", "generationType": "text_to_video", "tagDisplayData": {"Age": {"value": "70"}, "Venue": {"value": "TV Tray Dinner on Couch"}, "Gender": {"value": "Female"}, "Lava Food Item": {"value": "Lava Plate of Food"}, "ASMR Sound Style": {"value": "Bubbling"}, "Eating Expression": {"value": "🧐 Sophisticated Enjoyment"}}, "transferredToS3": true, "videoGeneration": null, "extractedVariables": {"age": "70", "venue": "tv tray dinner on couch", "gender": "female", "lavaFoodItem": "lava plate of food", "asmrSoundStyle": "bubbling", "eatingExpression": "sophisticated_enjoyment"}}	2025-07-13 23:54:43.03822	2025-07-14 22:11:10.263564	https://cdn.delu.la/videos/raw/20231304-de47-4805-8a9f-9df4381a9b5e.mp4	https://cdn.delu.la/videos/thumbnails/20231304-de47-4805-8a9f-9df4381a9b5e.gif	SlhcpFeJLH-DrVo7jMzzR_tmpabauzvtl-combined.mp4	SlhcpFeJLH-DrVo7jMzzR_tmpabauzvtl-combined	\N	\N	video	f	f	0	0	\N	\N	10	f	\N	0	2	8n8-7AKsNHi	\N	69cfbc99-4b0c-47a6-983a-752a266a66ba	processing	f
213	shared_guest_user	17	Lava Food ASMR	{\n  "shot": {\n    "composition": "close shot, handheld camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "slight natural shake",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "30 year old male",\n    "wardrobe": "a random outfit appropriate for the setting"\n  },\n  "scene": {\n    "location": "a cozy home kitchen with warm lighting",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem surreally hot, invoking the idea that the subject is eating food made of lava"\n  },\n  "visual_details": {\n    "action": "eating lava pizza made out of lava with a joyful and delighted expression on their face",\n    "props": "using their bare hands to eat the lava pizza"\n  },\n  "cinematography": {\n    "lighting": "indoors warm lighting with vibrant, flickering shadows",\n    "tone": "lighthearted and surreal"\n  },\n  "audio": {\n    "ambient": "gentle sounds of a home kitchen with nothing much going on",\n    "asmr": "crunchy"\n  },\n  "special_effects": "the food is actually made of lava/magma that drips, burns, and oozes across surfaces",\n  "color_palette": "the lava should be bright yellow and orange, glowing with heat and bright light, reflected on skin",\n  "additional_details": {\n    "speed of action": "slowly taking bites",\n    "lava food interaction": "start with nothing in mouth, use utensils and take a bite, should create trails of lava when eating"\n  }\n}	\N	failed	{"isGuest": true, "formData": {"age": "30", "venue": "home kitchen", "gender": "male", "lavaFoodItem": "lava pizza", "asmrSoundStyle": "crunchy", "eatingExpression": "joyful"}, "workflowType": "text_to_video", "tagDisplayData": {"Age": {"value": "30"}, "Venue": {"value": "Home Kitchen"}, "Gender": {"value": "Male"}, "Lava Food Item": {"value": "Lava Pizza"}, "ASMR Sound Style": {"value": "Crunchy"}, "Eating Expression": {"value": "😀 Joyful"}}, "videoGeneration": null, "extractedVariables": {"age": "30", "venue": "home kitchen", "gender": "male", "lavaFoodItem": "lava pizza", "asmrSoundStyle": "crunchy", "eatingExpression": "joyful"}}	2025-07-14 17:50:43.380843	2025-07-14 22:11:10.263564	\N	\N	\N	\N	\N	\N	video	f	f	0	0	Something unexpected happened. We've been notified and are working on a fix. Your credits have been refunded.	{"code": null, "type": null, "stack": "ApiError: Forbidden\\n    at <anonymous> (/home/app/app/libs/client/src/response.ts:64:13)\\n    at Generator.next (<anonymous>)\\n    at fulfilled (/home/app/app/node_modules/@fal-ai/serverless-client/src/response.js:5:58)\\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)", "status": 403, "message": "Forbidden", "timestamp": "2025-07-14T17:50:43.523Z"}	10	t	2025-07-14 17:50:43.514	0	2	ITavgbRNXrQ	\N	\N	\N	f
214	shared_guest_user	17	Lava Food ASMR	{\n  "shot": {\n    "composition": "close shot, handheld camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "slight natural shake",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "23 year old female",\n    "wardrobe": "a random outfit appropriate for the setting"\n  },\n  "scene": {\n    "location": "a cozy home kitchen with warm lighting",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem surreally hot, invoking the idea that the subject is eating food made of lava"\n  },\n  "visual_details": {\n    "action": "eating lava spoonful of honey made out of lava with a absolutely loving every bite expression on their face",\n    "props": "using a spoon to scoop up the lava honey from a bowl"\n  },\n  "cinematography": {\n    "lighting": "indoors warm lighting with vibrant, flickering shadows",\n    "tone": "lighthearted and surreal"\n  },\n  "audio": {\n    "ambient": "gentle sounds of a home kitchen with nothing much going on",\n    "asmr": "dripping"\n  },\n  "special_effects": "the food is actually made of lava/magma that drips, burns, and oozes across surfaces",\n  "color_palette": "the lava should be bright yellow and orange, glowing with heat and bright light, reflected on skin",\n  "additional_details": {\n    "speed of action": "slowly taking bites",\n    "lava food interaction": "start with nothing in mouth, use utensils and take a bite, should create trails of lava when eating"\n  }\n}		completed	{"model": "unknown", "s3Key": "videos/raw/3f3bc476-89d2-41c4-9205-5dbf513d6850.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/3f3bc476-89d2-41c4-9205-5dbf513d6850.mp4", "prompt": "", "assetId": "3f3bc476-89d2-41c4-9205-5dbf513d6850", "isGuest": true, "formData": {"age": "23", "venue": "home kitchen", "gender": "female", "lavaFoodItem": "lava spoonful of honey", "asmrSoundStyle": "dripping", "eatingExpression": "absolutely_loving_it"}, "provider": "fal-ai/flux/dev", "workflowType": "text_to_video", "generationType": "text_to_video", "tagDisplayData": {"Age": {"value": "23"}, "Venue": {"value": "Home Kitchen"}, "Gender": {"value": "Female"}, "Lava Food Item": {"value": "Lava Spoonful of Honey"}, "ASMR Sound Style": {"value": "Dripping"}, "Eating Expression": {"value": "😍 Absolutely Loving It"}}, "transferredToS3": true, "videoGeneration": null, "extractedVariables": {"age": "23", "venue": "home kitchen", "gender": "female", "lavaFoodItem": "lava spoonful of honey", "asmrSoundStyle": "dripping", "eatingExpression": "absolutely_loving_it"}}	2025-07-14 17:54:36.513481	2025-07-14 22:11:10.263564	https://cdn.delu.la/videos/raw/3f3bc476-89d2-41c4-9205-5dbf513d6850.mp4	https://cdn.delu.la/videos/thumbnails/3f3bc476-89d2-41c4-9205-5dbf513d6850.gif	pPv6rjrI-Wj74Oq1OYAvp_tmpcj6de1sl-combined.mp4	pPv6rjrI-Wj74Oq1OYAvp_tmpcj6de1sl-combined	\N	\N	video	f	f	0	0	\N	\N	10	f	\N	0	2	4v7efLXPr9Q	\N	638d576f-420f-4db0-aa2e-4aab5b25a21f	processing	f
279	system_backlog	17	Lava Food ASMR (Backlog)	{\n  "shot": {\n    "composition": "close shot, handheld camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "slight natural shake",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": ""70" year old "female"",\n    "wardrobe": "a random outfit appropriate for the setting"\n  },\n  "scene": {\n    "location": "home kitchen",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem surreally hot, invoking the idea that the subject is eating food made of lava"\n  },\n  "visual_details": {\n    "action": "eating "lava plate of food" made out of lava with a joyful and delighted expression on their face",\n    "props": "using their bare hands to eat the lava pizza"\n  },\n  "cinematography": {\n    "lighting": "indoors warm lighting with vibrant, flickering shadows",\n    "tone": "lighthearted and surreal"\n  },\n  "audio": {\n    "ambient": "gentle sounds of a home kitchen with nothing much going on",\n    "asmr": ""dripping""\n  },\n  "special_effects": "the food is actually made of lava/magma that drips, burns, and oozes across surfaces",\n  "color_palette": "the lava should be bright yellow and orange, glowing with heat and bright light, reflected on skin",\n  "additional_details": {\n    "speed of action": "slowly taking bites",\n    "lava food interaction": "start with nothing in mouth, use utensils and take a bite, should create trails of lava when eating"\n  }\n}		failed	{"jobId": "a9b1a1ec-e502-4b82-8a34-194ecab30da5", "model": "veo3-fast", "s3Key": "videos/raw/fcc3ef42-01b7-4ccb-8fc9-a1de893bf5f0.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/fcc3ef42-01b7-4ccb-8fc9-a1de893bf5f0.mp4", "prompt": "{\\n  \\"shot\\": {\\n    \\"composition\\": \\"close shot, handheld camera\\",\\n    \\"aspect_ratio\\": \\"9:16\\",\\n    \\"camera_motion\\": \\"slight natural shake\\",\\n    \\"frame_rate\\": \\"30fps\\",\\n    \\"film_grain\\": \\"none\\"\\n  },\\n  \\"subject\\": {\\n    \\"description\\": \\"\\"70\\" year old \\"female\\"\\",\\n    \\"wardrobe\\": \\"a random outfit appropriate for the setting\\"\\n  },\\n  \\"scene\\": {\\n    \\"location\\": \\"home kitchen\\",\\n    \\"time_of_day\\": \\"daytime but indoors\\",\\n    \\"environment\\": \\"the environment should seem surreally hot, invoking the idea that the subject is eating food made of lava\\"\\n  },\\n  \\"visual_details\\": {\\n    \\"action\\": \\"eating \\"lava plate of food\\" made out of lava with a joyful and delighted expression on their face\\",\\n    \\"props\\": \\"using their bare hands to eat the lava pizza\\"\\n  },\\n  \\"cinematography\\": {\\n    \\"lighting\\": \\"indoors warm lighting with vibrant, flickering shadows\\",\\n    \\"tone\\": \\"lighthearted and surreal\\"\\n  },\\n  \\"audio\\": {\\n    \\"ambient\\": \\"gentle sounds of a home kitchen with nothing much going on\\",\\n    \\"asmr\\": \\"\\"dripping\\"\\"\\n  },\\n  \\"special_effects\\": \\"the food is actually made of lava/magma that drips, burns, and oozes across surfaces\\",\\n  \\"color_palette\\": \\"the lava should be bright yellow and orange, glowing with heat and bright light, reflected on skin\\",\\n  \\"additional_details\\": {\\n    \\"speed of action\\": \\"slowly taking bites\\",\\n    \\"lava food interaction\\": \\"start with nothing in mouth, use utensils and take a bite, should create trails of lava when eating\\"\\n  }\\n}", "status": "submitted", "assetId": "fcc3ef42-01b7-4ccb-8fc9-a1de893bf5f0", "endpoint": "fal-ai/veo3/fast", "formData": {"age": "\\"70\\"", "venue": "\\"home kitchen\\"", "gender": "\\"female\\"", "lavaFoodItem": "\\"lava plate of food\\"", "asmrSoundStyle": "\\"dripping\\"", "eatingExpression": "\\"absolutely_loving_it\\""}, "provider": "fal-ai/veo3/fast", "serviceId": 2, "finalJobId": "a9b1a1ec-e502-4b82-8a34-194ecab30da5", "backlogService": true, "generationType": "text_to_video", "transferredToS3": true, "isBacklogGeneration": true}	2025-07-14 22:17:59.874572	2025-07-14 22:31:15.879	https://cdn.delu.la/videos/raw/fcc3ef42-01b7-4ccb-8fc9-a1de893bf5f0.mp4	https://cdn.delu.la/videos/thumbnails/fcc3ef42-01b7-4ccb-8fc9-a1de893bf5f0.gif	05vv_gg6as1avf0UQ7iR7_tmp6ez7oyxz-combined.mp4	05vv_gg6as1avf0UQ7iR7_tmp6ez7oyxz-combined	\N	\N	image	f	f	0	0	Your generation failed to complete. Credits have been refunded.	{"error": "FAL job failed", "jobId": "a9b1a1ec-e502-4b82-8a34-194ecab30da5", "failedAt": "2025-07-14T22:30:49.891Z"}	0	f	\N	0	2	2j6Fjhi1Rwl	\N	a9b1a1ec-e502-4b82-8a34-194ecab30da5	processing	f
277	system_backlog	18	BASEd Ape Vlog (Backlog)	{\n  "shot": {\n    "composition": "medium shot, vertical format, handheld camera, photo-realistic",\n    "camera_motion": "shaky handcam",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "a towering, photorealistic gorilla (inspired by the Bored Apes Yacht Club) with well groomed fur and expressive eyes",\n    "wardrobe": "Tracksuit with sleek lines and a sporty vibe. Over this are the straps from his parachute pack."\n  },\n  "scene": {\n    "location": "mountain peaks surrounded by swirling clouds, where crisp air and endless horizons set the stage for high-altitude vibes",\n    "time_of_day": "daytime outdoors",\n    "environment": "thin, crisp air swirling around jagged peaks, with sunlight glinting off snow-dusted stone and endless sky above"\n  },\n  "visual_details": {\n    "action": "Gorilla holds no props in hand, just pure YOLO energy, speaking excitedly to the camera about speaking about living a BASEd life before letting out a dramatic scream",\n    "props": "no props in hand, just pure YOLO energy"\n  },\n  "cinematography": {\n    "lighting": "natural sunlight with soft shadows",\n    "tone": "lighthearted and humorous"\n  },\n  "audio": {\n    "ambient": "steady wind with occasional sharp gusts",\n    "dialogue": {\n      "character": "Gorilla",\n      "subtitles": false\n    },\n    "effects": "yells something like aaaaah or wooooo after he jumps off"\n  },\n  "color_palette": "naturalistic with earthy greens and browns, whites and blues for snow",\n  "additional_details": {\n    "action": "gorilla talks to the camera about living a BASEd life and then jumps off the edge and parachutes down and away",\n    "parachute_type": "large glider-style parachute",\n    "attitude": "gorilla is an apathetic thrill-seeker, effortlessly cool, low-key reckless, YOLO"\n  }\n}		completed	{"jobId": "469fb4fe-096b-4594-b0c1-f3dfe3c4f4b7", "model": "veo3-fast", "prompt": "{\\n  \\"shot\\": {\\n    \\"composition\\": \\"medium shot, vertical format, handheld camera, photo-realistic\\",\\n    \\"camera_motion\\": \\"shaky handcam\\",\\n    \\"frame_rate\\": \\"30fps\\",\\n    \\"film_grain\\": \\"none\\"\\n  },\\n  \\"subject\\": {\\n    \\"description\\": \\"a towering, photorealistic gorilla (inspired by the Bored Apes Yacht Club) with well groomed fur and expressive eyes\\",\\n    \\"wardrobe\\": \\"Tracksuit with sleek lines and a sporty vibe. Over this are the straps from his parachute pack.\\"\\n  },\\n  \\"scene\\": {\\n    \\"location\\": \\"mountain peaks surrounded by swirling clouds, where crisp air and endless horizons set the stage for high-altitude vibes\\",\\n    \\"time_of_day\\": \\"daytime outdoors\\",\\n    \\"environment\\": \\"thin, crisp air swirling around jagged peaks, with sunlight glinting off snow-dusted stone and endless sky above\\"\\n  },\\n  \\"visual_details\\": {\\n    \\"action\\": \\"Gorilla holds no props in hand, just pure YOLO energy, speaking excitedly to the camera about speaking about living a BASEd life before letting out a dramatic scream\\",\\n    \\"props\\": \\"no props in hand, just pure YOLO energy\\"\\n  },\\n  \\"cinematography\\": {\\n    \\"lighting\\": \\"natural sunlight with soft shadows\\",\\n    \\"tone\\": \\"lighthearted and humorous\\"\\n  },\\n  \\"audio\\": {\\n    \\"ambient\\": \\"steady wind with occasional sharp gusts\\",\\n    \\"dialogue\\": {\\n      \\"character\\": \\"Gorilla\\",\\n      \\"subtitles\\": false\\n    },\\n    \\"effects\\": \\"yells something like aaaaah or wooooo after he jumps off\\"\\n  },\\n  \\"color_palette\\": \\"naturalistic with earthy greens and browns, whites and blues for snow\\",\\n  \\"additional_details\\": {\\n    \\"action\\": \\"gorilla talks to the camera about living a BASEd life and then jumps off the edge and parachutes down and away\\",\\n    \\"parachute_type\\": \\"large glider-style parachute\\",\\n    \\"attitude\\": \\"gorilla is an apathetic thrill-seeker, effortlessly cool, low-key reckless, YOLO\\"\\n  }\\n}", "status": "submitted", "endpoint": "fal-ai/veo3/fast", "formData": {"propInHand": "\\"selfie_stick\\"", "epicSetting": "\\"small_airplane\\"", "fashionStyle": "\\"blazer_gold_chains\\"", "vloggingTopic": "\\"boujee_bragging\\""}, "provider": "fal-ai/veo3/fast", "serviceId": 2, "finalJobId": "469fb4fe-096b-4594-b0c1-f3dfe3c4f4b7", "backlogService": true, "generationType": "text_to_video", "transferredToS3": false, "isBacklogGeneration": true}	2025-07-14 21:53:34.199854	2025-07-14 17:58:34.715	https://v3.fal.media/files/penguin/6cPGFsEN5mDaB5hXE-DPs_tmp9vrmtl_s-combined.mp4	\N	6cPGFsEN5mDaB5hXE-DPs_tmp9vrmtl_s-combined.mp4	6cPGFsEN5mDaB5hXE-DPs_tmp9vrmtl_s-combined	\N	\N	image	f	f	0	0	There was a temporary connection issue. We're retrying your request automatically.	{"error": "Recovery failed", "reason": "Max recovery attempts exceeded", "failedAt": "2025-07-14T21:58:21.688Z"}	0	f	\N	0	2	EJ8TO3CRazq	\N	469fb4fe-096b-4594-b0c1-f3dfe3c4f4b7	processing	t
274	shared_guest_user	17	Lava Food ASMR (Backlog)	{\n  "shot": {\n    "composition": "close shot, handheld camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "slight natural shake",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": ""23" year old "female"",\n    "wardrobe": "a random outfit appropriate for the setting"\n  },\n  "scene": {\n    "location": "home kitchen",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem surreally hot, invoking the idea that the subject is eating food made of lava"\n  },\n  "visual_details": {\n    "action": "eating "lava plate of food" made out of lava with a joyful and delighted expression on their face",\n    "props": "using their bare hands to eat the lava pizza"\n  },\n  "cinematography": {\n    "lighting": "indoors warm lighting with vibrant, flickering shadows",\n    "tone": "lighthearted and surreal"\n  },\n  "audio": {\n    "ambient": "gentle sounds of a home kitchen with nothing much going on",\n    "asmr": ""bubbling""\n  },\n  "special_effects": "the food is actually made of lava/magma that drips, burns, and oozes across surfaces",\n  "color_palette": "the lava should be bright yellow and orange, glowing with heat and bright light, reflected on skin",\n  "additional_details": {\n    "speed of action": "slowly taking bites",\n    "lava food interaction": "start with nothing in mouth, use utensils and take a bite, should create trails of lava when eating"\n  }\n}		completed	{"jobId": "ac4b3191-530d-45aa-9413-80a4e2fe930c", "model": "veo3-fast", "s3Key": "videos/raw/24d4d98e-7dfe-45e9-b9ed-9bef0d9d6e06.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/24d4d98e-7dfe-45e9-b9ed-9bef0d9d6e06.mp4", "prompt": "{\\n  \\"shot\\": {\\n    \\"composition\\": \\"close shot, handheld camera\\",\\n    \\"aspect_ratio\\": \\"9:16\\",\\n    \\"camera_motion\\": \\"slight natural shake\\",\\n    \\"frame_rate\\": \\"30fps\\",\\n    \\"film_grain\\": \\"none\\"\\n  },\\n  \\"subject\\": {\\n    \\"description\\": \\"\\"23\\" year old \\"female\\"\\",\\n    \\"wardrobe\\": \\"a random outfit appropriate for the setting\\"\\n  },\\n  \\"scene\\": {\\n    \\"location\\": \\"home kitchen\\",\\n    \\"time_of_day\\": \\"daytime but indoors\\",\\n    \\"environment\\": \\"the environment should seem surreally hot, invoking the idea that the subject is eating food made of lava\\"\\n  },\\n  \\"visual_details\\": {\\n    \\"action\\": \\"eating \\"lava plate of food\\" made out of lava with a joyful and delighted expression on their face\\",\\n    \\"props\\": \\"using their bare hands to eat the lava pizza\\"\\n  },\\n  \\"cinematography\\": {\\n    \\"lighting\\": \\"indoors warm lighting with vibrant, flickering shadows\\",\\n    \\"tone\\": \\"lighthearted and surreal\\"\\n  },\\n  \\"audio\\": {\\n    \\"ambient\\": \\"gentle sounds of a home kitchen with nothing much going on\\",\\n    \\"asmr\\": \\"\\"bubbling\\"\\"\\n  },\\n  \\"special_effects\\": \\"the food is actually made of lava/magma that drips, burns, and oozes across surfaces\\",\\n  \\"color_palette\\": \\"the lava should be bright yellow and orange, glowing with heat and bright light, reflected on skin\\",\\n  \\"additional_details\\": {\\n    \\"speed of action\\": \\"slowly taking bites\\",\\n    \\"lava food interaction\\": \\"start with nothing in mouth, use utensils and take a bite, should create trails of lava when eating\\"\\n  }\\n}", "status": "submitted", "assetId": "24d4d98e-7dfe-45e9-b9ed-9bef0d9d6e06", "endpoint": "fal-ai/veo3/fast", "formData": {"age": "\\"23\\"", "venue": "\\"tv tray dinner on couch\\"", "gender": "\\"female\\"", "lavaFoodItem": "\\"lava plate of food\\"", "asmrSoundStyle": "\\"bubbling\\"", "eatingExpression": "\\"sophisticated_enjoyment\\""}, "provider": "fal-ai/veo3/fast", "serviceId": 2, "finalJobId": "ac4b3191-530d-45aa-9413-80a4e2fe930c", "backlogService": true, "generationType": "text_to_video", "transferredToS3": true, "isBacklogGeneration": true}	2025-07-14 22:20:07.73778	2025-07-14 22:20:07.73778	https://cdn.delu.la/videos/raw/24d4d98e-7dfe-45e9-b9ed-9bef0d9d6e06.mp4	https://cdn.delu.la/videos/thumbnails/24d4d98e-7dfe-45e9-b9ed-9bef0d9d6e06.gif	E2T8og3qyfAKSV21U30jf_tmpc_8lkgs8-combined.mp4	E2T8og3qyfAKSV21U30jf_tmpc_8lkgs8-combined	\N	\N	image	f	f	0	0	\N	\N	0	f	\N	0	2	-2YGcztQr-B	\N	ac4b3191-530d-45aa-9413-80a4e2fe930c	processing	f
271	system_backlog	16	Cat Olympic Diving (Backlog)	{\n  "shot": {\n    "composition": "medium shot, professional dolly cable rigged camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "smooth tracking",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "athletic build "black american shorthair" adult cat",\n    "wardrobe": "a random athletic swimming suit appropriate to the character and setting"\n  },\n  "scene": {\n    "location": "Packed Olympic Stadium surrounds the pool. The stadium has an open ceiling so the sky is visible above the pool. Every seat in the stadium is filled, the lights are bright and there are camera flashes in the background.",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem like an excited stadium, invoking the idea that the subject is an animal attempting to perform olympic feats in diving"\n  },\n  "visual_details": {\n    "action": "running down the diving board in a clumsy amateur style, performing a backflip, and entering the water with a "meteoric"",\n    "props": "olympic swimming pool, diving board"\n  },\n  "cinematography": {\n    "lighting": "indoors bright natural lighting with soft shadows",\n    "tone": "focused"\n  },\n  "audio": {\n    "ambient": "lots of clapping and audience cheering and whistling in the background, with Olympic Sports Commentator narration about what they're seeing"\n  },\n  "special_effects": "overexaggerated cannonball splash",\n  "color_palette": "grays and blues for the stadium and water, and colorful for the audience",\n  "additional_details": {\n    "water interaction": "the subject should enter the water and not come out, end once the water entry animation is complete"\n  }\n}		completed	{"model": "veo3-fast", "s3Key": "videos/raw/15d86892-fe82-4816-82e5-376b93378719.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/15d86892-fe82-4816-82e5-376b93378719.mp4", "prompt": "", "assetId": "15d86892-fe82-4816-82e5-376b93378719", "endpoint": "fal-ai/veo3/fast", "formData": {"age": "\\"0\\"", "breed": "\\"black american shorthair\\"", "weight": "\\"3\\"", "attitude": "\\"clumsy amateur\\"", "soundStyle": "\\"stadium cheering\\"", "divingStyle": "\\"twisting dive\\"", "waterEntryStyle": "\\"meteoric\\""}, "provider": "fal-ai/veo3/fast", "serviceId": 2, "backlogService": true, "generationType": "text_to_video", "transferredToS3": true, "isBacklogGeneration": true}	2025-07-14 20:15:32.700615	2025-07-14 20:27:22.004	https://cdn.delu.la/videos/raw/15d86892-fe82-4816-82e5-376b93378719.mp4	https://cdn.delu.la/videos/thumbnails/15d86892-fe82-4816-82e5-376b93378719.gif	xWDfxPKp1wL-YI3CSTm7C_tmpz9xw72_7-combined.mp4	xWDfxPKp1wL-YI3CSTm7C_tmpz9xw72_7-combined	\N	\N	image	f	f	0	0	There was a temporary connection issue. We're retrying your request automatically.	{"error": "Recovery failed", "reason": "Max recovery attempts exceeded", "failedAt": "2025-07-14T20:19:45.678Z"}	0	f	\N	0	2	blmb3hpiv1	\N	f6e63566-1b2b-43b5-9aea-44482c929104	processing	t
278	system_backlog	18	BASEd Ape Vlog (Backlog)	{\n  "shot": {\n    "composition": "medium shot, vertical format, handheld camera, photo-realistic",\n    "camera_motion": "shaky handcam",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "a towering, photorealistic gorilla (inspired by the Bored Apes Yacht Club) with well groomed fur and expressive eyes",\n    "wardrobe": "Tracksuit with sleek lines and a sporty vibe. Over this are the straps from his parachute pack."\n  },\n  "scene": {\n    "location": "mountain peaks surrounded by swirling clouds, where crisp air and endless horizons set the stage for high-altitude vibes",\n    "time_of_day": "daytime outdoors",\n    "environment": "thin, crisp air swirling around jagged peaks, with sunlight glinting off snow-dusted stone and endless sky above"\n  },\n  "visual_details": {\n    "action": "Gorilla holds no props in hand, just pure YOLO energy, speaking excitedly to the camera about speaking about living a BASEd life before letting out a dramatic scream",\n    "props": "no props in hand, just pure YOLO energy"\n  },\n  "cinematography": {\n    "lighting": "natural sunlight with soft shadows",\n    "tone": "lighthearted and humorous"\n  },\n  "audio": {\n    "ambient": "steady wind with occasional sharp gusts",\n    "dialogue": {\n      "character": "Gorilla",\n      "subtitles": false\n    },\n    "effects": "yells something like aaaaah or wooooo after he jumps off"\n  },\n  "color_palette": "naturalistic with earthy greens and browns, whites and blues for snow",\n  "additional_details": {\n    "action": "gorilla talks to the camera about living a BASEd life and then jumps off the edge and parachutes down and away",\n    "parachute_type": "large glider-style parachute",\n    "attitude": "gorilla is an apathetic thrill-seeker, effortlessly cool, low-key reckless, YOLO"\n  }\n}		completed	{"jobId": "4bd01422-68df-4e11-9650-d8da8896cfea", "model": "veo3-fast", "s3Key": "videos/raw/5bd372ac-4eab-4ccb-a4a4-2e625d911951.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/5bd372ac-4eab-4ccb-a4a4-2e625d911951.mp4", "prompt": "{\\n  \\"shot\\": {\\n    \\"composition\\": \\"medium shot, vertical format, handheld camera, photo-realistic\\",\\n    \\"camera_motion\\": \\"shaky handcam\\",\\n    \\"frame_rate\\": \\"30fps\\",\\n    \\"film_grain\\": \\"none\\"\\n  },\\n  \\"subject\\": {\\n    \\"description\\": \\"a towering, photorealistic gorilla (inspired by the Bored Apes Yacht Club) with well groomed fur and expressive eyes\\",\\n    \\"wardrobe\\": \\"Tracksuit with sleek lines and a sporty vibe. Over this are the straps from his parachute pack.\\"\\n  },\\n  \\"scene\\": {\\n    \\"location\\": \\"mountain peaks surrounded by swirling clouds, where crisp air and endless horizons set the stage for high-altitude vibes\\",\\n    \\"time_of_day\\": \\"daytime outdoors\\",\\n    \\"environment\\": \\"thin, crisp air swirling around jagged peaks, with sunlight glinting off snow-dusted stone and endless sky above\\"\\n  },\\n  \\"visual_details\\": {\\n    \\"action\\": \\"Gorilla holds no props in hand, just pure YOLO energy, speaking excitedly to the camera about speaking about living a BASEd life before letting out a dramatic scream\\",\\n    \\"props\\": \\"no props in hand, just pure YOLO energy\\"\\n  },\\n  \\"cinematography\\": {\\n    \\"lighting\\": \\"natural sunlight with soft shadows\\",\\n    \\"tone\\": \\"lighthearted and humorous\\"\\n  },\\n  \\"audio\\": {\\n    \\"ambient\\": \\"steady wind with occasional sharp gusts\\",\\n    \\"dialogue\\": {\\n      \\"character\\": \\"Gorilla\\",\\n      \\"subtitles\\": false\\n    },\\n    \\"effects\\": \\"yells something like aaaaah or wooooo after he jumps off\\"\\n  },\\n  \\"color_palette\\": \\"naturalistic with earthy greens and browns, whites and blues for snow\\",\\n  \\"additional_details\\": {\\n    \\"action\\": \\"gorilla talks to the camera about living a BASEd life and then jumps off the edge and parachutes down and away\\",\\n    \\"parachute_type\\": \\"large glider-style parachute\\",\\n    \\"attitude\\": \\"gorilla is an apathetic thrill-seeker, effortlessly cool, low-key reckless, YOLO\\"\\n  }\\n}", "status": "submitted", "assetId": "5bd372ac-4eab-4ccb-a4a4-2e625d911951", "endpoint": "fal-ai/veo3/fast", "formData": {"propInHand": "\\"microphone\\"", "epicSetting": "\\"canyon\\"", "fashionStyle": "\\"blazer_gold_chains\\"", "vloggingTopic": "\\"boujee_bragging\\""}, "provider": "fal-ai/veo3/fast", "serviceId": 2, "finalJobId": "4bd01422-68df-4e11-9650-d8da8896cfea", "backlogService": true, "generationType": "text_to_video", "transferredToS3": true, "isBacklogGeneration": true}	2025-07-14 21:55:29.525988	2025-07-14 17:01:32.628	https://cdn.delu.la/videos/raw/5bd372ac-4eab-4ccb-a4a4-2e625d911951.mp4	https://cdn.delu.la/videos/thumbnails/5bd372ac-4eab-4ccb-a4a4-2e625d911951.gif	rTuXMse4iIHPwufhBOcyt_tmpmwru4kwd-combined.mp4	rTuXMse4iIHPwufhBOcyt_tmpmwru4kwd-combined	\N	\N	image	f	f	0	0	Your generation failed to complete. Credits have been refunded.	{"error": "FAL job failed", "jobId": "4bd01422-68df-4e11-9650-d8da8896cfea", "failedAt": "2025-07-14T22:01:19.412Z"}	0	f	\N	0	2	TjlApG5XOyZ	\N	4bd01422-68df-4e11-9650-d8da8896cfea	processing	f
280	system_backlog	17	Lava Food ASMR (Backlog)	{\n  "shot": {\n    "composition": "close shot, handheld camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "slight natural shake",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": ""23" year old "female"",\n    "wardrobe": "a random outfit appropriate for the setting"\n  },\n  "scene": {\n    "location": "home kitchen",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem surreally hot, invoking the idea that the subject is eating food made of lava"\n  },\n  "visual_details": {\n    "action": "eating "lava spoonful of honey" made out of lava with a joyful and delighted expression on their face",\n    "props": "using their bare hands to eat the lava pizza"\n  },\n  "cinematography": {\n    "lighting": "indoors warm lighting with vibrant, flickering shadows",\n    "tone": "lighthearted and surreal"\n  },\n  "audio": {\n    "ambient": "gentle sounds of a home kitchen with nothing much going on",\n    "asmr": ""bubbling""\n  },\n  "special_effects": "the food is actually made of lava/magma that drips, burns, and oozes across surfaces",\n  "color_palette": "the lava should be bright yellow and orange, glowing with heat and bright light, reflected on skin",\n  "additional_details": {\n    "speed of action": "slowly taking bites",\n    "lava food interaction": "start with nothing in mouth, use utensils and take a bite, should create trails of lava when eating"\n  }\n}		completed	{"jobId": "a9d72369-d26a-4783-a0fc-896eaea67fe5", "model": "veo3-fast", "prompt": "{\\n  \\"shot\\": {\\n    \\"composition\\": \\"close shot, handheld camera\\",\\n    \\"aspect_ratio\\": \\"9:16\\",\\n    \\"camera_motion\\": \\"slight natural shake\\",\\n    \\"frame_rate\\": \\"30fps\\",\\n    \\"film_grain\\": \\"none\\"\\n  },\\n  \\"subject\\": {\\n    \\"description\\": \\"\\"23\\" year old \\"female\\"\\",\\n    \\"wardrobe\\": \\"a random outfit appropriate for the setting\\"\\n  },\\n  \\"scene\\": {\\n    \\"location\\": \\"home kitchen\\",\\n    \\"time_of_day\\": \\"daytime but indoors\\",\\n    \\"environment\\": \\"the environment should seem surreally hot, invoking the idea that the subject is eating food made of lava\\"\\n  },\\n  \\"visual_details\\": {\\n    \\"action\\": \\"eating \\"lava spoonful of honey\\" made out of lava with a joyful and delighted expression on their face\\",\\n    \\"props\\": \\"using their bare hands to eat the lava pizza\\"\\n  },\\n  \\"cinematography\\": {\\n    \\"lighting\\": \\"indoors warm lighting with vibrant, flickering shadows\\",\\n    \\"tone\\": \\"lighthearted and surreal\\"\\n  },\\n  \\"audio\\": {\\n    \\"ambient\\": \\"gentle sounds of a home kitchen with nothing much going on\\",\\n    \\"asmr\\": \\"\\"bubbling\\"\\"\\n  },\\n  \\"special_effects\\": \\"the food is actually made of lava/magma that drips, burns, and oozes across surfaces\\",\\n  \\"color_palette\\": \\"the lava should be bright yellow and orange, glowing with heat and bright light, reflected on skin\\",\\n  \\"additional_details\\": {\\n    \\"speed of action\\": \\"slowly taking bites\\",\\n    \\"lava food interaction\\": \\"start with nothing in mouth, use utensils and take a bite, should create trails of lava when eating\\"\\n  }\\n}", "status": "submitted", "endpoint": "fal-ai/veo3/fast", "formData": {"age": "\\"23\\"", "venue": "\\"home kitchen\\"", "gender": "\\"female\\"", "lavaFoodItem": "\\"lava spoonful of honey\\"", "asmrSoundStyle": "\\"bubbling\\"", "eatingExpression": "\\"absolutely_loving_it\\""}, "provider": "fal-ai/veo3/fast", "serviceId": 2, "finalJobId": "a9d72369-d26a-4783-a0fc-896eaea67fe5", "backlogService": true, "generationType": "text_to_video", "transferredToS3": false, "isBacklogGeneration": true}	2025-07-14 22:23:00.716856	2025-07-14 18:25:15.314	https://v3.fal.media/files/penguin/roH21EFXuWLGz4Y-Y75ak_tmpp1az1xwq-combined.mp4	\N	roH21EFXuWLGz4Y-Y75ak_tmpp1az1xwq-combined.mp4	roH21EFXuWLGz4Y-Y75ak_tmpp1az1xwq-combined	\N	\N	image	f	f	0	0	\N	\N	0	f	\N	0	2	rDev0sA15CM	\N	a9d72369-d26a-4783-a0fc-896eaea67fe5	processing	f
269	shared_guest_user	17	Lava Food ASMR (Backlog)	{\n  "shot": {\n    "composition": "close shot, handheld camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "slight natural shake",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": ""23" year old "female"",\n    "wardrobe": "a random outfit appropriate for the setting"\n  },\n  "scene": {\n    "location": "home kitchen",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem surreally hot, invoking the idea that the subject is eating food made of lava"\n  },\n  "visual_details": {\n    "action": "eating "lava spoonful of honey" made out of lava with a joyful and delighted expression on their face",\n    "props": "using their bare hands to eat the lava pizza"\n  },\n  "cinematography": {\n    "lighting": "indoors warm lighting with vibrant, flickering shadows",\n    "tone": "lighthearted and surreal"\n  },\n  "audio": {\n    "ambient": "gentle sounds of a home kitchen with nothing much going on",\n    "asmr": ""dripping""\n  },\n  "special_effects": "the food is actually made of lava/magma that drips, burns, and oozes across surfaces",\n  "color_palette": "the lava should be bright yellow and orange, glowing with heat and bright light, reflected on skin",\n  "additional_details": {\n    "speed of action": "slowly taking bites",\n    "lava food interaction": "start with nothing in mouth, use utensils and take a bite, should create trails of lava when eating"\n  }\n}		completed	{"model": "veo3-fast", "s3Key": "videos/raw/6b26a390-6511-43fa-a382-b769add8bad5.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/6b26a390-6511-43fa-a382-b769add8bad5.mp4", "prompt": "", "assetId": "6b26a390-6511-43fa-a382-b769add8bad5", "endpoint": "fal-ai/veo3/fast", "formData": {"age": "\\"23\\"", "venue": "\\"home kitchen\\"", "gender": "\\"female\\"", "lavaFoodItem": "\\"lava spoonful of honey\\"", "asmrSoundStyle": "\\"dripping\\"", "eatingExpression": "\\"absolutely_loving_it\\""}, "provider": "fal-ai/flux/dev", "serviceId": 2, "backlogService": true, "generationType": "text_to_video", "transferredToS3": true, "isBacklogGeneration": true}	2025-07-14 21:21:41.604054	2025-07-14 21:21:41.604054	https://cdn.delu.la/videos/raw/6b26a390-6511-43fa-a382-b769add8bad5.mp4	https://cdn.delu.la/videos/thumbnails/6b26a390-6511-43fa-a382-b769add8bad5.gif	NhrPZE1R5PF3Cs90bQA18_tmpgwe8zh13-combined.mp4	NhrPZE1R5PF3Cs90bQA18_tmpgwe8zh13-combined	\N	\N	image	f	f	0	0	\N	\N	0	f	\N	0	2	blm7g5ohbu	\N	b0749a65-98d0-4ee4-b5df-f37ec982348e	processing	f
193	shared_guest_user	18	BASEd Ape Vlog	{\n  "shot": {\n    "composition": "medium shot, vertical format, handheld camera, photo-realistic",\n    "camera_motion": "shaky handcam",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "a towering, photorealistic gorilla (inspired by the Bored Apes Yacht Club) with well groomed fur and expressive eyes",\n    "wardrobe": "Tracksuit with sleek lines and a sporty vibe. Over this are the straps from his parachute pack."\n  },\n  "scene": {\n    "location": "mountain peaks surrounded by swirling clouds, where crisp air and endless horizons set the stage for high-altitude vibes",\n    "time_of_day": "daytime outdoors",\n    "environment": "thin, crisp air swirling around jagged peaks, with sunlight glinting off snow-dusted stone and endless sky above"\n  },\n  "visual_details": {\n    "action": "Gorilla holds no props in hand, just pure YOLO energy, speaking excitedly to the camera about speaking about Crypto Riches before letting out a dramatic scream",\n    "props": "no props in hand, just pure YOLO energy"\n  },\n  "cinematography": {\n    "lighting": "natural sunlight with soft shadows",\n    "tone": "lighthearted and humorous"\n  },\n  "audio": {\n    "ambient": "steady wind with occasional sharp gusts",\n    "dialogue": {\n      "character": "Gorilla",\n      "subtitles": false\n    },\n    "effects": "yells something like aaaaah or wooooo after he jumps off"\n  },\n  "color_palette": "naturalistic with earthy greens and browns, whites and blues for snow",\n  "additional_details": {\n    "action": "gorilla talks to the camera about Crypto Riches and then jumps off the edge and parachutes down and away",\n    "parachute_type": "large glider-style parachute",\n    "attitude": "gorilla is an apathetic thrill-seeker, effortlessly cool, low-key reckless, YOLO"\n  }\n}	\N	failed	{"isGuest": true, "formData": {"propInHand": "none", "epicSetting": "mountain_peaks", "fashionStyle": "tracksuit", "vloggingTopic": "crypto_riches"}, "workflowType": "text_to_video", "videoGeneration": null, "extractedVariables": {"propInHand": "none", "epicSetting": "mountain_peaks", "fashionStyle": "tracksuit", "vloggingTopic": "crypto_riches"}}	2025-07-13 15:31:46.336322	2025-07-14 22:11:10.263564	\N	\N	\N	\N	\N	\N	video	f	f	0	0	Something unexpected happened. We've been notified and are working on a fix. Your credits have been refunded.	{"code": null, "type": null, "stack": "ApiError: Forbidden\\n    at <anonymous> (/Users/timcotten/Projects/delula/libs/client/src/response.ts:64:13)\\n    at Generator.next (<anonymous>)\\n    at fulfilled (/Users/timcotten/Projects/delula/node_modules/@fal-ai/serverless-client/src/response.js:5:58)\\n    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)", "status": 403, "message": "Forbidden", "timestamp": "2025-07-13T15:31:47.779Z"}	0	f	\N	0	2	UvUsVXoVTY0	\N	\N	\N	f
189	shared_guest_user	17	Lava Food ASMR	{\n  "shot": {\n    "composition": "close shot, handheld camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "slight natural shake",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "30 year old female",\n    "wardrobe": "a random outfit appropriate for the setting"\n  },\n  "scene": {\n    "location": "a cozy home kitchen with warm lighting",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem surreally hot, invoking the idea that the subject is eating food made of lava"\n  },\n  "visual_details": {\n    "action": "eating lava pizza made out of lava with a joyful and delighted expression on their face",\n    "props": "using their bare hands to eat the lava pizza"\n  },\n  "cinematography": {\n    "lighting": "indoors warm lighting with vibrant, flickering shadows",\n    "tone": "lighthearted and surreal"\n  },\n  "audio": {\n    "ambient": "gentle sounds of a home kitchen with nothing much going on",\n    "asmr": "crunchy"\n  },\n  "special_effects": "the food is actually made of lava/magma that drips, burns, and oozes across surfaces",\n  "color_palette": "the lava should be bright yellow and orange, glowing with heat and bright light, reflected on skin",\n  "additional_details": {\n    "speed of action": "slowly taking bites",\n    "lava food interaction": "start with nothing in mouth, use utensils and take a bite, should create trails of lava when eating"\n  }\n}		completed	{"model": "unknown", "s3Key": "videos/raw/22fabbaf-b94b-4e74-b2fa-3073fce92713.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/22fabbaf-b94b-4e74-b2fa-3073fce92713.mp4", "prompt": "", "assetId": "22fabbaf-b94b-4e74-b2fa-3073fce92713", "formData": {}, "provider": "fal-ai/flux/dev", "generationType": "text_to_video", "transferredToS3": true}	2025-07-13 02:16:04.8218	2025-07-14 22:11:10.263564	https://cdn.delu.la/videos/raw/22fabbaf-b94b-4e74-b2fa-3073fce92713.mp4	https://cdn.delu.la/videos/thumbnails/22fabbaf-b94b-4e74-b2fa-3073fce92713.gif	UJrYh_5tBzQlsSzl0DafO_tmp7acxafxj-combined.mp4	UJrYh_5tBzQlsSzl0DafO_tmp7acxafxj-combined	\N	\N	video	f	f	0	0	\N	\N	0	f	\N	0	2	Acxb5QhnsPC	\N	7b7e6286-2fb3-420e-92d3-1483bde800f9	processing	f
267	shared_guest_user	17	Lava Food ASMR (Backlog)	{\n  "shot": {\n    "composition": "close shot, handheld camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "slight natural shake",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": ""70" year old "female"",\n    "wardrobe": "a random outfit appropriate for the setting"\n  },\n  "scene": {\n    "location": "home kitchen",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem surreally hot, invoking the idea that the subject is eating food made of lava"\n  },\n  "visual_details": {\n    "action": "eating "lava plate of food" made out of lava with a joyful and delighted expression on their face",\n    "props": "using their bare hands to eat the lava pizza"\n  },\n  "cinematography": {\n    "lighting": "indoors warm lighting with vibrant, flickering shadows",\n    "tone": "lighthearted and surreal"\n  },\n  "audio": {\n    "ambient": "gentle sounds of a home kitchen with nothing much going on",\n    "asmr": ""dripping""\n  },\n  "special_effects": "the food is actually made of lava/magma that drips, burns, and oozes across surfaces",\n  "color_palette": "the lava should be bright yellow and orange, glowing with heat and bright light, reflected on skin",\n  "additional_details": {\n    "speed of action": "slowly taking bites",\n    "lava food interaction": "start with nothing in mouth, use utensils and take a bite, should create trails of lava when eating"\n  }\n}		completed	{"model": "veo3-fast", "s3Key": "videos/raw/631305a9-70e1-402c-be0f-21c0f2bb56f5.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/631305a9-70e1-402c-be0f-21c0f2bb56f5.mp4", "prompt": "", "assetId": "631305a9-70e1-402c-be0f-21c0f2bb56f5", "endpoint": "fal-ai/veo3/fast", "formData": {"age": "\\"70\\"", "venue": "\\"home kitchen\\"", "gender": "\\"female\\"", "lavaFoodItem": "\\"lava plate of food\\"", "asmrSoundStyle": "\\"dripping\\"", "eatingExpression": "\\"sophisticated_enjoyment\\""}, "provider": "fal-ai/veo3/fast", "serviceId": 2, "backlogService": true, "generationType": "text_to_video", "transferredToS3": true, "isBacklogGeneration": true}	2025-07-14 21:21:27.762053	2025-07-14 21:21:27.762053	https://cdn.delu.la/videos/raw/631305a9-70e1-402c-be0f-21c0f2bb56f5.mp4	https://cdn.delu.la/videos/thumbnails/631305a9-70e1-402c-be0f-21c0f2bb56f5.gif	Gd5gG-Zn6f1z4jv68O916_tmpqkn6drbt-combined.mp4	Gd5gG-Zn6f1z4jv68O916_tmpqkn6drbt-combined	\N	\N	image	f	f	0	0	There was a temporary connection issue. We're retrying your request automatically.	{"error": "Recovery failed", "reason": "Max recovery attempts exceeded", "failedAt": "2025-07-14T20:19:45.523Z"}	0	f	\N	0	2	blm59nu3zw	\N	b59a01f4-8415-4e99-b959-1b00df6dc111	processing	t
190	shared_guest_user	18	BASEd Ape Vlog	{\n  "shot": {\n    "composition": "medium shot, vertical format, handheld camera, photo-realistic",\n    "camera_motion": "shaky handcam",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "a towering, photorealistic gorilla (inspired by the Bored Apes Yacht Club) with well groomed fur and expressive eyes",\n    "wardrobe": "Tracksuit with sleek lines and a sporty vibe. Over this are the straps from his parachute pack."\n  },\n  "scene": {\n    "location": "mountain peaks surrounded by swirling clouds, where crisp air and endless horizons set the stage for high-altitude vibes",\n    "time_of_day": "daytime outdoors",\n    "environment": "thin, crisp air swirling around jagged peaks, with sunlight glinting off snow-dusted stone and endless sky above"\n  },\n  "visual_details": {\n    "action": "Gorilla holds no props in hand, just pure YOLO energy, speaking excitedly to the camera about speaking about living a BASEd life before letting out a dramatic scream",\n    "props": "no props in hand, just pure YOLO energy"\n  },\n  "cinematography": {\n    "lighting": "natural sunlight with soft shadows",\n    "tone": "lighthearted and humorous"\n  },\n  "audio": {\n    "ambient": "steady wind with occasional sharp gusts",\n    "dialogue": {\n      "character": "Gorilla",\n      "subtitles": false\n    },\n    "effects": "yells something like aaaaah or wooooo after he jumps off"\n  },\n  "color_palette": "naturalistic with earthy greens and browns, whites and blues for snow",\n  "additional_details": {\n    "action": "gorilla talks to the camera about living a BASEd life and then jumps off the edge and parachutes down and away",\n    "parachute_type": "large glider-style parachute",\n    "attitude": "gorilla is an apathetic thrill-seeker, effortlessly cool, low-key reckless, YOLO"\n  }\n}		completed	{"model": "unknown", "s3Key": "videos/raw/a323ca96-4b76-47d6-89cd-6802ccd2e1fa.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/a323ca96-4b76-47d6-89cd-6802ccd2e1fa.mp4", "prompt": "", "assetId": "a323ca96-4b76-47d6-89cd-6802ccd2e1fa", "formData": {}, "provider": "fal-ai/flux/dev", "generationType": "text_to_video", "transferredToS3": true}	2025-07-13 02:16:16.362449	2025-07-14 22:11:10.263564	https://cdn.delu.la/videos/raw/a323ca96-4b76-47d6-89cd-6802ccd2e1fa.mp4	https://cdn.delu.la/videos/thumbnails/a323ca96-4b76-47d6-89cd-6802ccd2e1fa.gif	KCMmEB9XK5VwizGNhcNKv_tmpkchwqppa-combined.mp4	KCMmEB9XK5VwizGNhcNKv_tmpkchwqppa-combined	\N	\N	video	f	f	0	0	\N	\N	0	f	\N	0	2	5JMWATVMoRa	\N	6b8ce796-6fdd-473a-9e8a-45eee58d00c7	processing	f
270	shared_guest_user	16	Cat Olympic Diving (Backlog)	{\n  "shot": {\n    "composition": "medium shot, professional dolly cable rigged camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "smooth tracking",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "athletic build "black american shorthair" adult cat",\n    "wardrobe": "a random athletic swimming suit appropriate to the character and setting"\n  },\n  "scene": {\n    "location": "Packed Olympic Stadium surrounds the pool. The stadium has an open ceiling so the sky is visible above the pool. Every seat in the stadium is filled, the lights are bright and there are camera flashes in the background.",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem like an excited stadium, invoking the idea that the subject is an animal attempting to perform olympic feats in diving"\n  },\n  "visual_details": {\n    "action": "running down the diving board in a clumsy amateur style, performing a backflip, and entering the water with a "meteoric"",\n    "props": "olympic swimming pool, diving board"\n  },\n  "cinematography": {\n    "lighting": "indoors bright natural lighting with soft shadows",\n    "tone": "focused"\n  },\n  "audio": {\n    "ambient": "lots of clapping and audience cheering and whistling in the background, with Olympic Sports Commentator narration about what they're seeing"\n  },\n  "special_effects": "overexaggerated cannonball splash",\n  "color_palette": "grays and blues for the stadium and water, and colorful for the audience",\n  "additional_details": {\n    "water interaction": "the subject should enter the water and not come out, end once the water entry animation is complete"\n  }\n}		completed	{"model": "veo3-fast", "s3Key": "videos/raw/6fdf3217-a119-430a-ac28-f8d699c669ad.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/6fdf3217-a119-430a-ac28-f8d699c669ad.mp4", "prompt": "", "assetId": "6fdf3217-a119-430a-ac28-f8d699c669ad", "endpoint": "fal-ai/veo3/fast", "formData": {"age": "\\"1\\"", "breed": "\\"black american shorthair\\"", "weight": "\\"1\\"", "attitude": "\\"sophisticated and poised\\"", "soundStyle": "\\"stadium cheering\\"", "divingStyle": "\\"forward dive\\"", "waterEntryStyle": "\\"meteoric\\""}, "provider": "fal-ai/veo3/fast", "serviceId": 2, "backlogService": true, "generationType": "text_to_video", "transferredToS3": true, "isBacklogGeneration": true}	2025-07-14 21:40:13.828136	2025-07-14 21:40:13.828136	https://cdn.delu.la/videos/raw/6fdf3217-a119-430a-ac28-f8d699c669ad.mp4	https://cdn.delu.la/videos/thumbnails/6fdf3217-a119-430a-ac28-f8d699c669ad.gif	qV1qMvi6vLHpbw7Cceclk_tmpt5bgnxp_-combined.mp4	qV1qMvi6vLHpbw7Cceclk_tmpt5bgnxp_-combined	\N	\N	image	f	f	0	0	There was a temporary connection issue. We're retrying your request automatically.	{"error": "Recovery failed", "reason": "Max recovery attempts exceeded", "failedAt": "2025-07-14T20:19:45.819Z"}	0	f	\N	0	2	blm8jvbo5m	\N	50bb6cd7-19c7-4216-92c5-1e10f3fe4df3	processing	t
272	system_backlog	16	Cat Olympic Diving (Backlog)	{\n  "shot": {\n    "composition": "medium shot, professional dolly cable rigged camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "smooth tracking",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "athletic build "black american shorthair" adult cat",\n    "wardrobe": "a random athletic swimming suit appropriate to the character and setting"\n  },\n  "scene": {\n    "location": "Packed Olympic Stadium surrounds the pool. The stadium has an open ceiling so the sky is visible above the pool. Every seat in the stadium is filled, the lights are bright and there are camera flashes in the background.",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem like an excited stadium, invoking the idea that the subject is an animal attempting to perform olympic feats in diving"\n  },\n  "visual_details": {\n    "action": "running down the diving board in a clumsy amateur style, performing a backflip, and entering the water with a "meteoric"",\n    "props": "olympic swimming pool, diving board"\n  },\n  "cinematography": {\n    "lighting": "indoors bright natural lighting with soft shadows",\n    "tone": "focused"\n  },\n  "audio": {\n    "ambient": "lots of clapping and audience cheering and whistling in the background, with Olympic Sports Commentator narration about what they're seeing"\n  },\n  "special_effects": "overexaggerated cannonball splash",\n  "color_palette": "grays and blues for the stadium and water, and colorful for the audience",\n  "additional_details": {\n    "water interaction": "the subject should enter the water and not come out, end once the water entry animation is complete"\n  }\n}		completed	{"model": "veo3-fast", "s3Key": "videos/raw/5712b522-8e1e-4121-a720-49e5d765c9fd.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/5712b522-8e1e-4121-a720-49e5d765c9fd.mp4", "prompt": "", "assetId": "5712b522-8e1e-4121-a720-49e5d765c9fd", "endpoint": "fal-ai/veo3/fast", "formData": {"age": "\\"0\\"", "breed": "\\"black american shorthair\\"", "weight": "\\"1\\"", "attitude": "\\"clumsy amateur\\"", "soundStyle": "\\"stadium cheering\\"", "divingStyle": "\\"forward dive\\"", "waterEntryStyle": "\\"meteoric\\""}, "provider": "fal-ai/veo3/fast", "serviceId": 2, "backlogService": true, "generationType": "text_to_video", "transferredToS3": true, "isBacklogGeneration": true}	2025-07-14 20:15:34.446445	2025-07-14 20:27:23.876	https://cdn.delu.la/videos/raw/5712b522-8e1e-4121-a720-49e5d765c9fd.mp4	https://cdn.delu.la/videos/thumbnails/5712b522-8e1e-4121-a720-49e5d765c9fd.gif	_6FqzTXNtlVTtojOOzW4H_tmpsuywbcvf-combined.mp4	_6FqzTXNtlVTtojOOzW4H_tmpsuywbcvf-combined	\N	\N	image	f	f	0	0	There was a temporary connection issue. We're retrying your request automatically.	{"error": "Recovery failed", "reason": "Max recovery attempts exceeded", "failedAt": "2025-07-14T20:19:45.748Z"}	0	f	\N	0	2	blmcfepv2j	\N	c6ab0bb4-a33c-47a6-8eff-db268198cc0d	processing	t
191	shared_guest_user	16	Cat Olympic Diving	{\n  "shot": {\n    "composition": "medium shot, professional dolly cable rigged camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "smooth tracking",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "athletic build black american shorthair adult cat",\n    "wardrobe": "a random athletic swimming suit appropriate to the character and setting"\n  },\n  "scene": {\n    "location": "Packed Olympic Stadium surrounds the pool. The stadium has an open ceiling so the sky is visible above the pool. Every seat in the stadium is filled, the lights are bright and there are camera flashes in the background.",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem like an excited stadium, invoking the idea that the subject is an animal attempting to perform olympic feats in diving"\n  },\n  "visual_details": {\n    "action": "running down the diving board in a clumsy amateur style, performing a backflip, and entering the water with a cannonball splash",\n    "props": "olympic swimming pool, diving board"\n  },\n  "cinematography": {\n    "lighting": "indoors bright natural lighting with soft shadows",\n    "tone": "focused"\n  },\n  "audio": {\n    "ambient": "lots of clapping and audience cheering and whistling in the background, with Olympic Sports Commentator narration about what they're seeing"\n  },\n  "special_effects": "overexaggerated cannonball splash",\n  "color_palette": "grays and blues for the stadium and water, and colorful for the audience",\n  "additional_details": {\n    "water interaction": "the subject should enter the water and not come out, end once the water entry animation is complete"\n  }\n}		completed	{"model": "unknown", "s3Key": "videos/raw/aa44ebcf-21e1-41da-b531-d0b0f5608255.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/aa44ebcf-21e1-41da-b531-d0b0f5608255.mp4", "prompt": "", "assetId": "aa44ebcf-21e1-41da-b531-d0b0f5608255", "formData": {}, "provider": "fal-ai/flux/dev", "generationType": "text_to_video", "transferredToS3": true}	2025-07-13 02:56:16.22327	2025-07-14 22:11:10.263564	https://cdn.delu.la/videos/raw/aa44ebcf-21e1-41da-b531-d0b0f5608255.mp4	https://cdn.delu.la/videos/thumbnails/aa44ebcf-21e1-41da-b531-d0b0f5608255.gif	4E0XTNVU9eGbVovoZ9n0P_tmptei2irpp-combined.mp4	4E0XTNVU9eGbVovoZ9n0P_tmptei2irpp-combined	\N	\N	video	f	f	0	0	\N	\N	0	f	\N	0	2	bM1VCUWGvQS	\N	ae1d20ea-a02a-4841-8ccc-d0216584c41a	processing	f
192	shared_guest_user	17	Lava Food ASMR	{\n  "shot": {\n    "composition": "close shot, handheld camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "slight natural shake",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "young year old male",\n    "wardrobe": "a random outfit appropriate for the setting"\n  },\n  "scene": {\n    "location": "home kitchen",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem surreally hot, invoking the idea that the subject is eating food made of lava"\n  },\n  "visual_details": {\n    "action": "eating pizza made out of lava with a joyful and delighted expression on their face",\n    "props": "using their bare hands to eat the lava pizza"\n  },\n  "cinematography": {\n    "lighting": "indoors warm lighting with vibrant, flickering shadows",\n    "tone": "lighthearted and surreal"\n  },\n  "audio": {\n    "ambient": "gentle sounds of a home kitchen with nothing much going on",\n    "asmr": "crunchy"\n  },\n  "special_effects": "the food is actually made of lava/magma that drips, burns, and oozes across surfaces",\n  "color_palette": "the lava should be bright yellow and orange, glowing with heat and bright light, reflected on skin",\n  "additional_details": {\n    "speed of action": "slowly taking bites",\n    "lava food interaction": "start with nothing in mouth, use utensils and take a bite, should create trails of lava when eating"\n  }\n}		completed	{"model": "unknown", "s3Key": "videos/raw/87464325-c9e9-4cd4-b18a-dd5f9da1e001.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/87464325-c9e9-4cd4-b18a-dd5f9da1e001.mp4", "prompt": "", "assetId": "87464325-c9e9-4cd4-b18a-dd5f9da1e001", "formData": {}, "provider": "fal-ai/flux/dev", "generationType": "text_to_video", "transferredToS3": true}	2025-07-13 04:10:14.603224	2025-07-14 22:11:10.263564	https://cdn.delu.la/videos/raw/87464325-c9e9-4cd4-b18a-dd5f9da1e001.mp4	https://cdn.delu.la/videos/thumbnails/87464325-c9e9-4cd4-b18a-dd5f9da1e001.gif	QA5pZWEd0f8AQcVEPjkjV_tmpv3fogxyu-combined.mp4	QA5pZWEd0f8AQcVEPjkjV_tmpv3fogxyu-combined	\N	\N	video	f	f	0	0	\N	\N	0	f	\N	0	2	QQXBR05090t	\N	c0e7a231-efa4-4683-b4fe-93400102f905	processing	f
194	shared_guest_user	16	Cat Olympic Diving	{\n  "shot": {\n    "composition": "medium shot, professional dolly cable rigged camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "smooth tracking",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "athletic build black american shorthair adult cat",\n    "wardrobe": "a random athletic swimming suit appropriate to the character and setting"\n  },\n  "scene": {\n    "location": "Packed Olympic Stadium surrounds the pool. The stadium has an open ceiling so the sky is visible above the pool. Every seat in the stadium is filled, the lights are bright and there are camera flashes in the background.",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem like an excited stadium, invoking the idea that the subject is an animal attempting to perform olympic feats in diving"\n  },\n  "visual_details": {\n    "action": "running down the diving board in a clumsy amateur style, performing a backflip, and entering the water with a cannonball splash",\n    "props": "olympic swimming pool, diving board"\n  },\n  "cinematography": {\n    "lighting": "indoors bright natural lighting with soft shadows",\n    "tone": "focused"\n  },\n  "audio": {\n    "ambient": "lots of clapping and audience cheering and whistling in the background, with Olympic Sports Commentator narration about what they're seeing"\n  },\n  "special_effects": "overexaggerated cannonball splash",\n  "color_palette": "grays and blues for the stadium and water, and colorful for the audience",\n  "additional_details": {\n    "water interaction": "the subject should enter the water and not come out, end once the water entry animation is complete"\n  }\n}	\N	failed	{"isGuest": true, "formData": {"age": "1", "breed": "black american shorthair", "weight": "0", "attitude": "clumsy amateur", "soundStyle": "stadium cheering", "divingStyle": "backflip", "waterEntryStyle": "cannonball splash"}, "workflowType": "text_to_video", "videoGeneration": null, "extractedVariables": {"age": "1", "breed": "black american shorthair", "weight": "0", "attitude": "clumsy amateur", "soundStyle": "stadium cheering", "divingStyle": "backflip", "waterEntryStyle": "cannonball splash"}}	2025-07-13 15:39:37.436224	2025-07-14 22:11:10.263564	\N	\N	\N	\N	\N	\N	video	f	f	0	0	Something unexpected happened. We've been notified and are working on a fix. Your credits have been refunded.	{"code": null, "type": null, "stack": "ApiError: Forbidden\\n    at <anonymous> (/Users/timcotten/Projects/delula/libs/client/src/response.ts:64:13)\\n    at Generator.next (<anonymous>)\\n    at fulfilled (/Users/timcotten/Projects/delula/node_modules/@fal-ai/serverless-client/src/response.js:5:58)\\n    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)", "status": 403, "message": "Forbidden", "timestamp": "2025-07-13T15:39:38.376Z"}	0	f	\N	0	2	dxPTcO86YHk	\N	\N	\N	f
273	shared_guest_user	17	Lava Food ASMR (Backlog)	{\n  "shot": {\n    "composition": "close shot, handheld camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "slight natural shake",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": ""70" year old "female"",\n    "wardrobe": "a random outfit appropriate for the setting"\n  },\n  "scene": {\n    "location": "home kitchen",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem surreally hot, invoking the idea that the subject is eating food made of lava"\n  },\n  "visual_details": {\n    "action": "eating "lava spoonful of honey" made out of lava with a joyful and delighted expression on their face",\n    "props": "using their bare hands to eat the lava pizza"\n  },\n  "cinematography": {\n    "lighting": "indoors warm lighting with vibrant, flickering shadows",\n    "tone": "lighthearted and surreal"\n  },\n  "audio": {\n    "ambient": "gentle sounds of a home kitchen with nothing much going on",\n    "asmr": ""bubbling""\n  },\n  "special_effects": "the food is actually made of lava/magma that drips, burns, and oozes across surfaces",\n  "color_palette": "the lava should be bright yellow and orange, glowing with heat and bright light, reflected on skin",\n  "additional_details": {\n    "speed of action": "slowly taking bites",\n    "lava food interaction": "start with nothing in mouth, use utensils and take a bite, should create trails of lava when eating"\n  }\n}		completed	{"jobId": "bc9afc89-725b-40a3-a13c-abbdbbfda2a7", "model": "veo3-fast", "s3Key": "videos/raw/87a5dfb3-2304-4c68-93ff-237410e98893.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/87a5dfb3-2304-4c68-93ff-237410e98893.mp4", "prompt": "{\\n  \\"shot\\": {\\n    \\"composition\\": \\"close shot, handheld camera\\",\\n    \\"aspect_ratio\\": \\"9:16\\",\\n    \\"camera_motion\\": \\"slight natural shake\\",\\n    \\"frame_rate\\": \\"30fps\\",\\n    \\"film_grain\\": \\"none\\"\\n  },\\n  \\"subject\\": {\\n    \\"description\\": \\"\\"70\\" year old \\"female\\"\\",\\n    \\"wardrobe\\": \\"a random outfit appropriate for the setting\\"\\n  },\\n  \\"scene\\": {\\n    \\"location\\": \\"home kitchen\\",\\n    \\"time_of_day\\": \\"daytime but indoors\\",\\n    \\"environment\\": \\"the environment should seem surreally hot, invoking the idea that the subject is eating food made of lava\\"\\n  },\\n  \\"visual_details\\": {\\n    \\"action\\": \\"eating \\"lava spoonful of honey\\" made out of lava with a joyful and delighted expression on their face\\",\\n    \\"props\\": \\"using their bare hands to eat the lava pizza\\"\\n  },\\n  \\"cinematography\\": {\\n    \\"lighting\\": \\"indoors warm lighting with vibrant, flickering shadows\\",\\n    \\"tone\\": \\"lighthearted and surreal\\"\\n  },\\n  \\"audio\\": {\\n    \\"ambient\\": \\"gentle sounds of a home kitchen with nothing much going on\\",\\n    \\"asmr\\": \\"\\"bubbling\\"\\"\\n  },\\n  \\"special_effects\\": \\"the food is actually made of lava/magma that drips, burns, and oozes across surfaces\\",\\n  \\"color_palette\\": \\"the lava should be bright yellow and orange, glowing with heat and bright light, reflected on skin\\",\\n  \\"additional_details\\": {\\n    \\"speed of action\\": \\"slowly taking bites\\",\\n    \\"lava food interaction\\": \\"start with nothing in mouth, use utensils and take a bite, should create trails of lava when eating\\"\\n  }\\n}", "status": "submitted", "assetId": "87a5dfb3-2304-4c68-93ff-237410e98893", "endpoint": "fal-ai/veo3/fast", "formData": {"age": "\\"70\\"", "venue": "\\"tv tray dinner on couch\\"", "gender": "\\"female\\"", "lavaFoodItem": "\\"lava spoonful of honey\\"", "asmrSoundStyle": "\\"bubbling\\"", "eatingExpression": "\\"sophisticated_enjoyment\\""}, "provider": "fal-ai/veo3/fast", "serviceId": 2, "finalJobId": "bc9afc89-725b-40a3-a13c-abbdbbfda2a7", "backlogService": true, "generationType": "text_to_video", "transferredToS3": true, "isBacklogGeneration": true}	2025-07-14 22:14:46.194559	2025-07-14 22:14:46.194559	https://cdn.delu.la/videos/raw/87a5dfb3-2304-4c68-93ff-237410e98893.mp4	https://cdn.delu.la/videos/thumbnails/87a5dfb3-2304-4c68-93ff-237410e98893.gif	6YbXRFfexeSlOuj37xRBN_tmpfycqf_8n-combined.mp4	6YbXRFfexeSlOuj37xRBN_tmpfycqf_8n-combined	\N	\N	image	f	f	0	0	\N	\N	0	f	\N	0	2	ARP8Zl9HbUL	\N	bc9afc89-725b-40a3-a13c-abbdbbfda2a7	processing	f
195	shared_guest_user	18	BASEd Ape Vlog	{\n  "shot": {\n    "composition": "medium shot, vertical format, handheld camera, photo-realistic",\n    "camera_motion": "shaky handcam",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "a towering, photorealistic gorilla (inspired by the Bored Apes Yacht Club) with well groomed fur and expressive eyes",\n    "wardrobe": "Tracksuit with sleek lines and a sporty vibe. Over this are the straps from his parachute pack."\n  },\n  "scene": {\n    "location": "mountain peaks surrounded by swirling clouds, where crisp air and endless horizons set the stage for high-altitude vibes",\n    "time_of_day": "daytime outdoors",\n    "environment": "thin, crisp air swirling around jagged peaks, with sunlight glinting off snow-dusted stone and endless sky above"\n  },\n  "visual_details": {\n    "action": "Gorilla holds no props in hand, just pure YOLO energy, speaking excitedly to the camera about talking about spending money recklessly before letting out a dramatic scream",\n    "props": "no props in hand, just pure YOLO energy"\n  },\n  "cinematography": {\n    "lighting": "natural sunlight with soft shadows",\n    "tone": "lighthearted and humorous"\n  },\n  "audio": {\n    "ambient": "steady wind with occasional sharp gusts",\n    "dialogue": {\n      "character": "Gorilla",\n      "subtitles": false\n    },\n    "effects": "yells something like aaaaah or wooooo after he jumps off"\n  },\n  "color_palette": "naturalistic with earthy greens and browns, whites and blues for snow",\n  "additional_details": {\n    "action": "gorilla talks to the camera about spending money recklessly and then jumps off the edge and parachutes down and away",\n    "parachute_type": "large glider-style parachute",\n    "attitude": "gorilla is an apathetic thrill-seeker, effortlessly cool, low-key reckless, YOLO"\n  }\n}		completed	{"model": "unknown", "s3Key": "videos/raw/8fa87017-a93b-4bbd-a7d6-de99a26d0b5d.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/8fa87017-a93b-4bbd-a7d6-de99a26d0b5d.mp4", "prompt": "", "assetId": "8fa87017-a93b-4bbd-a7d6-de99a26d0b5d", "formData": {}, "provider": "fal-ai/flux/dev", "generationType": "text_to_video", "transferredToS3": true}	2025-07-13 15:40:54.836487	2025-07-14 22:11:10.263564	https://cdn.delu.la/videos/raw/8fa87017-a93b-4bbd-a7d6-de99a26d0b5d.mp4	https://cdn.delu.la/videos/thumbnails/8fa87017-a93b-4bbd-a7d6-de99a26d0b5d.gif	j1nOR0szTnEVm1O3WJ5NQ_tmpjkj0qn5r-combined.mp4	j1nOR0szTnEVm1O3WJ5NQ_tmpjkj0qn5r-combined	\N	\N	video	f	f	0	0	\N	\N	0	f	\N	0	2	9tChbj7Phxb	\N	e66d405f-aca6-4a1f-9655-905f4d09762e	processing	f
275	system_backlog	17	Lava Food ASMR (Backlog)	{\n  "shot": {\n    "composition": "close shot, handheld camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "slight natural shake",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": ""70" year old "female"",\n    "wardrobe": "a random outfit appropriate for the setting"\n  },\n  "scene": {\n    "location": "home kitchen",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem surreally hot, invoking the idea that the subject is eating food made of lava"\n  },\n  "visual_details": {\n    "action": "eating "lava spoonful of honey" made out of lava with a joyful and delighted expression on their face",\n    "props": "using their bare hands to eat the lava pizza"\n  },\n  "cinematography": {\n    "lighting": "indoors warm lighting with vibrant, flickering shadows",\n    "tone": "lighthearted and surreal"\n  },\n  "audio": {\n    "ambient": "gentle sounds of a home kitchen with nothing much going on",\n    "asmr": ""bubbling""\n  },\n  "special_effects": "the food is actually made of lava/magma that drips, burns, and oozes across surfaces",\n  "color_palette": "the lava should be bright yellow and orange, glowing with heat and bright light, reflected on skin",\n  "additional_details": {\n    "speed of action": "slowly taking bites",\n    "lava food interaction": "start with nothing in mouth, use utensils and take a bite, should create trails of lava when eating"\n  }\n}		completed	{"jobId": "c8430690-2717-4b5d-8f80-62a62fa2b496", "model": "veo3-fast", "s3Key": "videos/raw/5509275b-c1dc-4ec7-bb5c-37615c913840.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/5509275b-c1dc-4ec7-bb5c-37615c913840.mp4", "prompt": "{\\n  \\"shot\\": {\\n    \\"composition\\": \\"close shot, handheld camera\\",\\n    \\"aspect_ratio\\": \\"9:16\\",\\n    \\"camera_motion\\": \\"slight natural shake\\",\\n    \\"frame_rate\\": \\"30fps\\",\\n    \\"film_grain\\": \\"none\\"\\n  },\\n  \\"subject\\": {\\n    \\"description\\": \\"\\"70\\" year old \\"female\\"\\",\\n    \\"wardrobe\\": \\"a random outfit appropriate for the setting\\"\\n  },\\n  \\"scene\\": {\\n    \\"location\\": \\"home kitchen\\",\\n    \\"time_of_day\\": \\"daytime but indoors\\",\\n    \\"environment\\": \\"the environment should seem surreally hot, invoking the idea that the subject is eating food made of lava\\"\\n  },\\n  \\"visual_details\\": {\\n    \\"action\\": \\"eating \\"lava spoonful of honey\\" made out of lava with a joyful and delighted expression on their face\\",\\n    \\"props\\": \\"using their bare hands to eat the lava pizza\\"\\n  },\\n  \\"cinematography\\": {\\n    \\"lighting\\": \\"indoors warm lighting with vibrant, flickering shadows\\",\\n    \\"tone\\": \\"lighthearted and surreal\\"\\n  },\\n  \\"audio\\": {\\n    \\"ambient\\": \\"gentle sounds of a home kitchen with nothing much going on\\",\\n    \\"asmr\\": \\"\\"bubbling\\"\\"\\n  },\\n  \\"special_effects\\": \\"the food is actually made of lava/magma that drips, burns, and oozes across surfaces\\",\\n  \\"color_palette\\": \\"the lava should be bright yellow and orange, glowing with heat and bright light, reflected on skin\\",\\n  \\"additional_details\\": {\\n    \\"speed of action\\": \\"slowly taking bites\\",\\n    \\"lava food interaction\\": \\"start with nothing in mouth, use utensils and take a bite, should create trails of lava when eating\\"\\n  }\\n}", "status": "submitted", "assetId": "5509275b-c1dc-4ec7-bb5c-37615c913840", "endpoint": "fal-ai/veo3/fast", "formData": {"age": "\\"70\\"", "venue": "\\"tv tray dinner on couch\\"", "gender": "\\"female\\"", "lavaFoodItem": "\\"lava spoonful of honey\\"", "asmrSoundStyle": "\\"bubbling\\"", "eatingExpression": "\\"sophisticated_enjoyment\\""}, "provider": "fal-ai/veo3/fast", "serviceId": 2, "finalJobId": "c8430690-2717-4b5d-8f80-62a62fa2b496", "backlogService": true, "generationType": "text_to_video", "transferredToS3": true, "isBacklogGeneration": true}	2025-07-14 21:30:12.071252	2025-07-14 16:33:30.478	https://cdn.delu.la/videos/raw/5509275b-c1dc-4ec7-bb5c-37615c913840.mp4	https://cdn.delu.la/videos/thumbnails/5509275b-c1dc-4ec7-bb5c-37615c913840.gif	gmrxo53ah-3xsTenfRHdU_tmpmdaqdth3-combined.mp4	gmrxo53ah-3xsTenfRHdU_tmpmdaqdth3-combined	\N	\N	image	f	f	0	0	\N	\N	0	f	\N	0	2	kmVY6pL4-4o	\N	c8430690-2717-4b5d-8f80-62a62fa2b496	processing	f
196	shared_guest_user	16	Cat Olympic Diving	{\n  "shot": {\n    "composition": "medium shot, professional dolly cable rigged camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "smooth tracking",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "athletic build black american shorthair adult cat",\n    "wardrobe": "a random athletic swimming suit appropriate to the character and setting"\n  },\n  "scene": {\n    "location": "Packed Olympic Stadium surrounds the pool. The stadium has an open ceiling so the sky is visible above the pool. Every seat in the stadium is filled, the lights are bright and there are camera flashes in the background.",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem like an excited stadium, invoking the idea that the subject is an animal attempting to perform olympic feats in diving"\n  },\n  "visual_details": {\n    "action": "running down the diving board in a clumsy amateur style, performing a backflip, and entering the water with a cannonball splash",\n    "props": "olympic swimming pool, diving board"\n  },\n  "cinematography": {\n    "lighting": "indoors bright natural lighting with soft shadows",\n    "tone": "focused"\n  },\n  "audio": {\n    "ambient": "lots of clapping and audience cheering and whistling in the background, with Olympic Sports Commentator narration about what they're seeing"\n  },\n  "special_effects": "overexaggerated cannonball splash",\n  "color_palette": "grays and blues for the stadium and water, and colorful for the audience",\n  "additional_details": {\n    "water interaction": "the subject should enter the water and not come out, end once the water entry animation is complete"\n  }\n}		completed	{"model": "unknown", "s3Key": "videos/raw/9333bb80-0d49-4de2-9a64-6eea7c58c47f.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/9333bb80-0d49-4de2-9a64-6eea7c58c47f.mp4", "prompt": "", "assetId": "9333bb80-0d49-4de2-9a64-6eea7c58c47f", "formData": {}, "provider": "fal-ai/flux/dev", "generationType": "text_to_video", "transferredToS3": true}	2025-07-13 15:48:41.191433	2025-07-14 22:11:10.263564	https://cdn.delu.la/videos/raw/9333bb80-0d49-4de2-9a64-6eea7c58c47f.mp4	https://cdn.delu.la/videos/thumbnails/9333bb80-0d49-4de2-9a64-6eea7c58c47f.gif	zlXyo9nYL2RFC-OSJU6wb_tmphi833vya-combined.mp4	zlXyo9nYL2RFC-OSJU6wb_tmphi833vya-combined	\N	\N	video	f	f	0	0	\N	\N	0	f	\N	0	2	GecwzsvJlXc	\N	151e340e-2b78-4a57-a284-0866d93f80b2	processing	f
276	system_backlog	16	Cat Olympic Diving (Backlog)	{\n  "shot": {\n    "composition": "medium shot, professional dolly cable rigged camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "smooth tracking",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "athletic build "black american shorthair" adult cat",\n    "wardrobe": "a random athletic swimming suit appropriate to the character and setting"\n  },\n  "scene": {\n    "location": "Packed Olympic Stadium surrounds the pool. The stadium has an open ceiling so the sky is visible above the pool. Every seat in the stadium is filled, the lights are bright and there are camera flashes in the background.",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem like an excited stadium, invoking the idea that the subject is an animal attempting to perform olympic feats in diving"\n  },\n  "visual_details": {\n    "action": "running down the diving board in a clumsy amateur style, performing a backflip, and entering the water with a "meteoric"",\n    "props": "olympic swimming pool, diving board"\n  },\n  "cinematography": {\n    "lighting": "indoors bright natural lighting with soft shadows",\n    "tone": "focused"\n  },\n  "audio": {\n    "ambient": "lots of clapping and audience cheering and whistling in the background, with Olympic Sports Commentator narration about what they're seeing"\n  },\n  "special_effects": "overexaggerated cannonball splash",\n  "color_palette": "grays and blues for the stadium and water, and colorful for the audience",\n  "additional_details": {\n    "water interaction": "the subject should enter the water and not come out, end once the water entry animation is complete"\n  }\n}		completed	{"jobId": "47368e6f-83b9-4ce4-ae49-db84e0c8df90", "model": "veo3-fast", "s3Key": "videos/raw/4569f569-11e7-446c-96a3-6034a4c0d6fa.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/4569f569-11e7-446c-96a3-6034a4c0d6fa.mp4", "prompt": "{\\n  \\"shot\\": {\\n    \\"composition\\": \\"medium shot, professional dolly cable rigged camera\\",\\n    \\"aspect_ratio\\": \\"9:16\\",\\n    \\"camera_motion\\": \\"smooth tracking\\",\\n    \\"frame_rate\\": \\"30fps\\",\\n    \\"film_grain\\": \\"none\\"\\n  },\\n  \\"subject\\": {\\n    \\"description\\": \\"athletic build \\"black american shorthair\\" adult cat\\",\\n    \\"wardrobe\\": \\"a random athletic swimming suit appropriate to the character and setting\\"\\n  },\\n  \\"scene\\": {\\n    \\"location\\": \\"Packed Olympic Stadium surrounds the pool. The stadium has an open ceiling so the sky is visible above the pool. Every seat in the stadium is filled, the lights are bright and there are camera flashes in the background.\\",\\n    \\"time_of_day\\": \\"daytime but indoors\\",\\n    \\"environment\\": \\"the environment should seem like an excited stadium, invoking the idea that the subject is an animal attempting to perform olympic feats in diving\\"\\n  },\\n  \\"visual_details\\": {\\n    \\"action\\": \\"running down the diving board in a clumsy amateur style, performing a backflip, and entering the water with a \\"meteoric\\"\\",\\n    \\"props\\": \\"olympic swimming pool, diving board\\"\\n  },\\n  \\"cinematography\\": {\\n    \\"lighting\\": \\"indoors bright natural lighting with soft shadows\\",\\n    \\"tone\\": \\"focused\\"\\n  },\\n  \\"audio\\": {\\n    \\"ambient\\": \\"lots of clapping and audience cheering and whistling in the background, with Olympic Sports Commentator narration about what they're seeing\\"\\n  },\\n  \\"special_effects\\": \\"overexaggerated cannonball splash\\",\\n  \\"color_palette\\": \\"grays and blues for the stadium and water, and colorful for the audience\\",\\n  \\"additional_details\\": {\\n    \\"water interaction\\": \\"the subject should enter the water and not come out, end once the water entry animation is complete\\"\\n  }\\n}", "status": "submitted", "assetId": "4569f569-11e7-446c-96a3-6034a4c0d6fa", "endpoint": "fal-ai/veo3/fast", "formData": {"age": "\\"0\\"", "breed": "\\"black american shorthair\\"", "weight": "\\"1\\"", "attitude": "\\"sophisticated and poised\\"", "soundStyle": "\\"stadium cheering\\"", "divingStyle": "\\"twisting dive\\"", "waterEntryStyle": "\\"meteoric\\""}, "provider": "fal-ai/veo3/fast", "serviceId": 2, "finalJobId": "47368e6f-83b9-4ce4-ae49-db84e0c8df90", "backlogService": true, "generationType": "text_to_video", "transferredToS3": true, "isBacklogGeneration": true}	2025-07-14 21:44:21.397818	2025-07-14 21:47:24.017	https://cdn.delu.la/videos/raw/4569f569-11e7-446c-96a3-6034a4c0d6fa.mp4	https://cdn.delu.la/videos/thumbnails/4569f569-11e7-446c-96a3-6034a4c0d6fa.gif	5PqeweEHs7EVzCW4uKr-O_tmp9wemn7f1-combined.mp4	5PqeweEHs7EVzCW4uKr-O_tmp9wemn7f1-combined	\N	\N	image	f	f	0	0	\N	\N	0	f	\N	0	2	AxCvrSSa1ne	\N	47368e6f-83b9-4ce4-ae49-db84e0c8df90	processing	f
197	shared_guest_user	16	Cat Olympic Diving	{\n  "shot": {\n    "composition": "medium shot, professional dolly cable rigged camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "smooth tracking",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "athletic build black american shorthair adult cat",\n    "wardrobe": "a random athletic swimming suit appropriate to the character and setting"\n  },\n  "scene": {\n    "location": "Packed Olympic Stadium surrounds the pool. The stadium has an open ceiling so the sky is visible above the pool. Every seat in the stadium is filled, the lights are bright and there are camera flashes in the background.",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem like an excited stadium, invoking the idea that the subject is an animal attempting to perform olympic feats in diving"\n  },\n  "visual_details": {\n    "action": "running down the diving board in a clumsy amateur style, performing a backflip, and entering the water with a cannonball splash",\n    "props": "olympic swimming pool, diving board"\n  },\n  "cinematography": {\n    "lighting": "indoors bright natural lighting with soft shadows",\n    "tone": "focused"\n  },\n  "audio": {\n    "ambient": "lots of clapping and audience cheering and whistling in the background, with Olympic Sports Commentator narration about what they're seeing"\n  },\n  "special_effects": "overexaggerated cannonball splash",\n  "color_palette": "grays and blues for the stadium and water, and colorful for the audience",\n  "additional_details": {\n    "water interaction": "the subject should enter the water and not come out, end once the water entry animation is complete"\n  }\n}		completed	{"model": "unknown", "s3Key": "videos/raw/b0ac3f9c-2275-4f64-86f8-d50596666831.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/b0ac3f9c-2275-4f64-86f8-d50596666831.mp4", "prompt": "", "assetId": "b0ac3f9c-2275-4f64-86f8-d50596666831", "formData": {}, "provider": "fal-ai/flux/dev", "generationType": "text_to_video", "transferredToS3": true}	2025-07-13 15:49:07.316416	2025-07-14 22:11:10.263564	https://cdn.delu.la/videos/raw/b0ac3f9c-2275-4f64-86f8-d50596666831.mp4	https://cdn.delu.la/videos/thumbnails/b0ac3f9c-2275-4f64-86f8-d50596666831.gif	hU9SCy0fWofcVmYes7pat_tmpp48j030g-combined.mp4	hU9SCy0fWofcVmYes7pat_tmpp48j030g-combined	\N	\N	video	f	f	0	0	\N	\N	0	f	\N	0	2	-FpcaXzWkou	\N	49e990f7-b20e-4f57-8520-7ee6966270ac	processing	f
198	shared_guest_user	17	Lava Food ASMR	{\n  "shot": {\n    "composition": "close shot, handheld camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "slight natural shake",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "50 year old female",\n    "wardrobe": "a random outfit appropriate for the setting"\n  },\n  "scene": {\n    "location": "a typical office cubicle with fluorescent lighting",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem surreally hot, invoking the idea that the subject is eating food made of lava"\n  },\n  "visual_details": {\n    "action": "eating lava pizza made out of lava with a sophisticated culinary appreciation expression on their face",\n    "props": "using their bare hands to eat the lava pizza"\n  },\n  "cinematography": {\n    "lighting": "indoors warm lighting with vibrant, flickering shadows",\n    "tone": "lighthearted and surreal"\n  },\n  "audio": {\n    "ambient": "office noise, phones ringing, typing on computers",\n    "asmr": "dripping"\n  },\n  "special_effects": "the food is actually made of lava/magma that drips, burns, and oozes across surfaces",\n  "color_palette": "the lava should be bright yellow and orange, glowing with heat and bright light, reflected on skin",\n  "additional_details": {\n    "speed of action": "slowly taking bites",\n    "lava food interaction": "start with nothing in mouth, use utensils and take a bite, should create trails of lava when eating"\n  }\n}		completed	{"model": "unknown", "s3Key": "videos/raw/b1ed4c6c-b9cd-4170-a69d-21714d6cf2b4.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/b1ed4c6c-b9cd-4170-a69d-21714d6cf2b4.mp4", "prompt": "", "assetId": "b1ed4c6c-b9cd-4170-a69d-21714d6cf2b4", "formData": {}, "provider": "fal-ai/flux/dev", "generationType": "text_to_video", "transferredToS3": true}	2025-07-13 16:35:47.376365	2025-07-14 22:11:10.263564	https://cdn.delu.la/videos/raw/b1ed4c6c-b9cd-4170-a69d-21714d6cf2b4.mp4	https://cdn.delu.la/videos/thumbnails/b1ed4c6c-b9cd-4170-a69d-21714d6cf2b4.gif	m9u6DQcQa-ImjdP0N3_JZ_tmp39escb47-combined.mp4	m9u6DQcQa-ImjdP0N3_JZ_tmp39escb47-combined	\N	\N	video	f	f	0	0	\N	\N	1	f	\N	0	2	4kZXJmQZpk7	\N	06f561e9-756d-4476-9365-4870afefbc82	processing	f
199	shared_guest_user	18	BASEd Ape Vlog	{\n  "shot": {\n    "composition": "medium shot, vertical format, handheld camera, photo-realistic",\n    "camera_motion": "shaky handcam",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "a towering, photorealistic gorilla (inspired by the Bored Apes Yacht Club) with well groomed fur and expressive eyes",\n    "wardrobe": "Retro 80s fashion with bright colors and bold patterns"\n  },\n  "scene": {\n    "location": "urban skyline with city lights and modern architecture",\n    "time_of_day": "daytime outdoors",\n    "environment": "urban environment with city sounds and modern architecture"\n  },\n  "visual_details": {\n    "action": "Gorilla holds smartphone mounted on a selfie stick, speaking excitedly to the camera about sharing survival tips and wilderness knowledge before letting out a dramatic scream",\n    "props": "smartphone mounted on a selfie stick"\n  },\n  "cinematography": {\n    "lighting": "natural sunlight with soft shadows",\n    "tone": "lighthearted and humorous"\n  },\n  "audio": {\n    "ambient": "city sounds with traffic and urban ambience",\n    "dialogue": {\n      "character": "Gorilla",\n      "subtitles": false\n    },\n    "effects": "yells something like aaaaah or wooooo after he jumps off"\n  },\n  "color_palette": "naturalistic with earthy greens and browns, whites and blues for snow",\n  "additional_details": {\n    "action": "gorilla talks to the camera about survival tips and wilderness knowledge and then jumps off the edge and parachutes down and away",\n    "parachute_type": "large glider-style parachute",\n    "attitude": "gorilla is an apathetic thrill-seeker, effortlessly cool, low-key reckless, YOLO"\n  }\n}		completed	{"model": "unknown", "s3Key": "videos/raw/8113a3d2-6b8c-46d8-b21a-0a4e9a4e2819.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/8113a3d2-6b8c-46d8-b21a-0a4e9a4e2819.mp4", "prompt": "", "assetId": "8113a3d2-6b8c-46d8-b21a-0a4e9a4e2819", "formData": {}, "provider": "fal-ai/flux/dev", "generationType": "text_to_video", "transferredToS3": true}	2025-07-13 17:04:41.59546	2025-07-14 22:11:10.263564	https://cdn.delu.la/videos/raw/8113a3d2-6b8c-46d8-b21a-0a4e9a4e2819.mp4	https://cdn.delu.la/videos/thumbnails/8113a3d2-6b8c-46d8-b21a-0a4e9a4e2819.gif	vnYjwfJ0gDI2bBd7S9L2k_tmpj4_i29sd-combined.mp4	vnYjwfJ0gDI2bBd7S9L2k_tmpj4_i29sd-combined	\N	\N	video	f	f	0	0	\N	\N	1	f	\N	0	2	bZ5w7M0GtIz	\N	b5e4c225-b3c9-421d-8b8b-973c87e82d52	processing	f
201	shared_guest_user	16	Cat Olympic Diving	{\n  "shot": {\n    "composition": "medium shot, professional dolly cable rigged camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "smooth tracking",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "athletic build black american shorthair adult cat",\n    "wardrobe": "a random athletic swimming suit appropriate to the character and setting"\n  },\n  "scene": {\n    "location": "Packed Olympic Stadium surrounds the pool. The stadium has an open ceiling so the sky is visible above the pool. Every seat in the stadium is filled, the lights are bright and there are camera flashes in the background.",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem like an excited stadium, invoking the idea that the subject is an animal attempting to perform olympic feats in diving"\n  },\n  "visual_details": {\n    "action": "running down the diving board in a professional sports athlete style, performing a backflip, and entering the water with a neat dive",\n    "props": "olympic swimming pool, diving board"\n  },\n  "cinematography": {\n    "lighting": "indoors bright natural lighting with soft shadows",\n    "tone": "focused"\n  },\n  "audio": {\n    "ambient": "lots of clapping and audience cheering and whistling in the background, with Olympic Sports Commentator narration about what they're seeing"\n  },\n  "special_effects": "clean, minimal splash entry",\n  "color_palette": "grays and blues for the stadium and water, and colorful for the audience",\n  "additional_details": {\n    "water interaction": "the subject should enter the water and not come out, end once the water entry animation is complete"\n  }\n}		completed	{"model": "unknown", "s3Key": "videos/raw/54765f56-57d6-4e5b-9fad-64306dfa36af.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/54765f56-57d6-4e5b-9fad-64306dfa36af.mp4", "prompt": "", "assetId": "54765f56-57d6-4e5b-9fad-64306dfa36af", "formData": {}, "provider": "fal-ai/flux/dev", "generationType": "text_to_video", "transferredToS3": true}	2025-07-13 21:16:30.355554	2025-07-14 22:11:10.263564	https://cdn.delu.la/videos/raw/54765f56-57d6-4e5b-9fad-64306dfa36af.mp4	https://cdn.delu.la/videos/thumbnails/54765f56-57d6-4e5b-9fad-64306dfa36af.gif	yXFFIVHMhWlpfCj4aCD0t_tmp0gowep__-combined.mp4	yXFFIVHMhWlpfCj4aCD0t_tmp0gowep__-combined	\N	\N	video	f	f	0	0	There was a temporary connection issue. We're retrying your request automatically.	{"error": "Recovery failed", "reason": "Max recovery attempts exceeded", "failedAt": "2025-07-13T21:19:48.942Z"}	15	t	2025-07-13 21:19:48.959	0	2	2CoIbt8q4YE	\N	844ff126-d6e3-47e5-81e8-e3a9ff7548df	processing	t
264	shared_guest_user	18	BASEd Ape Vlog (Backlog)	{\n  "shot": {\n    "composition": "medium shot, vertical format, handheld camera, photo-realistic",\n    "camera_motion": "shaky handcam",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "a towering, photorealistic gorilla (inspired by the Bored Apes Yacht Club) with well groomed fur and expressive eyes",\n    "wardrobe": "Tracksuit with sleek lines and a sporty vibe. Over this are the straps from his parachute pack."\n  },\n  "scene": {\n    "location": "mountain peaks surrounded by swirling clouds, where crisp air and endless horizons set the stage for high-altitude vibes",\n    "time_of_day": "daytime outdoors",\n    "environment": "thin, crisp air swirling around jagged peaks, with sunlight glinting off snow-dusted stone and endless sky above"\n  },\n  "visual_details": {\n    "action": "Gorilla holds no props in hand, just pure YOLO energy, speaking excitedly to the camera about speaking about living a BASEd life before letting out a dramatic scream",\n    "props": "no props in hand, just pure YOLO energy"\n  },\n  "cinematography": {\n    "lighting": "natural sunlight with soft shadows",\n    "tone": "lighthearted and humorous"\n  },\n  "audio": {\n    "ambient": "steady wind with occasional sharp gusts",\n    "dialogue": {\n      "character": "Gorilla",\n      "subtitles": false\n    },\n    "effects": "yells something like aaaaah or wooooo after he jumps off"\n  },\n  "color_palette": "naturalistic with earthy greens and browns, whites and blues for snow",\n  "additional_details": {\n    "action": "gorilla talks to the camera about living a BASEd life and then jumps off the edge and parachutes down and away",\n    "parachute_type": "large glider-style parachute",\n    "attitude": "gorilla is an apathetic thrill-seeker, effortlessly cool, low-key reckless, YOLO"\n  }\n}		completed	{"model": "veo3-fast", "s3Key": "videos/raw/011faaea-b52e-485d-af69-4c521e93018f.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/011faaea-b52e-485d-af69-4c521e93018f.mp4", "prompt": "", "assetId": "011faaea-b52e-485d-af69-4c521e93018f", "endpoint": "fal-ai/veo3/fast", "formData": {"propInHand": "\\"selfie_stick\\"", "epicSetting": "\\"canyon\\"", "fashionStyle": "\\"tracksuit\\"", "vloggingTopic": "\\"boujee_bragging\\""}, "provider": "fal-ai/flux/dev", "serviceId": 2, "backlogService": true, "generationType": "text_to_video", "transferredToS3": true, "isBacklogGeneration": true}	2025-07-14 21:52:50.940225	2025-07-14 21:52:50.940225	https://cdn.delu.la/videos/raw/011faaea-b52e-485d-af69-4c521e93018f.mp4	https://cdn.delu.la/videos/thumbnails/0764b736-095a-4aed-9e68-88e22eecf40c.gif	aqhKDcqA0WCAgkSjYl8C6_tmphr8kkg2c-combined.mp4	aqhKDcqA0WCAgkSjYl8C6_tmphr8kkg2c-combined	\N	\N	image	f	f	0	0	\N	\N	0	f	\N	0	2	blm1dom5wy	\N	174eeddb-387b-47bb-a070-f25ae2eb1844	processing	f
265	shared_guest_user	18	BASEd Ape Vlog (Backlog)	{\n  "shot": {\n    "composition": "medium shot, vertical format, handheld camera, photo-realistic",\n    "camera_motion": "shaky handcam",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "a towering, photorealistic gorilla (inspired by the Bored Apes Yacht Club) with well groomed fur and expressive eyes",\n    "wardrobe": "Tracksuit with sleek lines and a sporty vibe. Over this are the straps from his parachute pack."\n  },\n  "scene": {\n    "location": "mountain peaks surrounded by swirling clouds, where crisp air and endless horizons set the stage for high-altitude vibes",\n    "time_of_day": "daytime outdoors",\n    "environment": "thin, crisp air swirling around jagged peaks, with sunlight glinting off snow-dusted stone and endless sky above"\n  },\n  "visual_details": {\n    "action": "Gorilla holds no props in hand, just pure YOLO energy, speaking excitedly to the camera about speaking about living a BASEd life before letting out a dramatic scream",\n    "props": "no props in hand, just pure YOLO energy"\n  },\n  "cinematography": {\n    "lighting": "natural sunlight with soft shadows",\n    "tone": "lighthearted and humorous"\n  },\n  "audio": {\n    "ambient": "steady wind with occasional sharp gusts",\n    "dialogue": {\n      "character": "Gorilla",\n      "subtitles": false\n    },\n    "effects": "yells something like aaaaah or wooooo after he jumps off"\n  },\n  "color_palette": "naturalistic with earthy greens and browns, whites and blues for snow",\n  "additional_details": {\n    "action": "gorilla talks to the camera about living a BASEd life and then jumps off the edge and parachutes down and away",\n    "parachute_type": "large glider-style parachute",\n    "attitude": "gorilla is an apathetic thrill-seeker, effortlessly cool, low-key reckless, YOLO"\n  }\n}		completed	{"model": "veo3-fast", "s3Key": "videos/raw/a46da7d0-26d8-4b34-9c94-59191c6ec6b7.mp4", "cdnUrl": "https://cdn.delu.la/videos/raw/a46da7d0-26d8-4b34-9c94-59191c6ec6b7.mp4", "prompt": "", "assetId": "a46da7d0-26d8-4b34-9c94-59191c6ec6b7", "endpoint": "fal-ai/veo3/fast", "formData": {"propInHand": "\\"microphone\\"", "epicSetting": "\\"canyon\\"", "fashionStyle": "\\"blazer_gold_chains\\"", "vloggingTopic": "\\"boujee_bragging\\""}, "provider": "fal-ai/flux/dev", "serviceId": 2, "backlogService": true, "generationType": "text_to_video", "transferredToS3": true, "isBacklogGeneration": true}	2025-07-14 22:13:10.104664	2025-07-14 22:13:10.104664	https://cdn.delu.la/videos/raw/a46da7d0-26d8-4b34-9c94-59191c6ec6b7.mp4	https://cdn.delu.la/videos/thumbnails/a46da7d0-26d8-4b34-9c94-59191c6ec6b7.gif	pPvqum1nPmmLW75jXPuZc_tmpk85ff0ay-combined.mp4	pPvqum1nPmmLW75jXPuZc_tmpk85ff0ay-combined	\N	\N	image	f	f	0	0	\N	\N	0	f	\N	0	2	blm2x43vcj	\N	c969a3c6-9e2d-4a31-84fd-b748a73e93a6	processing	f
\.


--
-- TOC entry 4583 (class 0 OID 21950)
-- Dependencies: 224
-- Data for Name: providers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.providers (id, title, description, num_slots, is_active, config, created_at, updated_at) FROM stdin;
1	FAL Standard	features and labels, fal.ai, standard user api account	10	t	{}	2025-07-10 13:25:29.234211	2025-07-10 13:25:29.234211
\.


--
-- TOC entry 4585 (class 0 OID 21960)
-- Dependencies: 226
-- Data for Name: recipe_option_tag_icon; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recipe_option_tag_icon (id, display, icon, color, created_at, updated_at) FROM stdin;
Attitude	Attitude	smile	\N	2025-07-13 22:55:06.813522	2025-07-14 00:22:58.494
Cat Breed	Cat Breed	cat	\N	2025-07-13 22:55:06.911516	2025-07-14 00:22:58.552
Fashion Style	Fashion Style	shirt	\N	2025-07-13 22:55:07.296634	2025-07-14 00:22:58.889
Food Type	Food Type	pizza	\N	2025-07-13 22:55:07.395446	2025-07-14 00:22:58.973
Lava Food Item	Lava Food Item	flame	\N	2025-07-14 00:22:59.303335	2025-07-14 00:22:59.303335
Prop in Hand	Prop in Hand	hand	\N	2025-07-13 22:55:07.50073	2025-07-14 00:22:59.25
Weight	Weight	scale	\N	2025-07-13 22:55:07.782779	2025-07-14 00:22:59.623
Age	Age	baby	\N	2025-07-13 22:55:06.723673	2025-07-14 01:02:08.377
ASMR Sound Style	ASMR Sound Style	ear	\N	2025-07-13 22:55:06.633488	2025-07-14 02:08:02.048
Diving Style	Diving Style	waves-ladder	\N	2025-07-13 22:55:07.004654	2025-07-14 02:37:57.931
Eating Expression	Eating Expression	drama	\N	2025-07-13 22:55:07.103615	2025-07-14 02:40:48.289
Epic Setting	Epic Setting	mountain-snow	\N	2025-07-13 22:55:07.20581	2025-07-14 02:41:08.393
Gender	Gender	person-standing	\N	2025-07-14 00:22:59.213339	2025-07-14 02:47:07.929
Sound Style	Sound Style	volume-2	\N	2025-07-14 00:22:59.458345	2025-07-14 02:48:19.408
Venue	Venue	map-pin-house	\N	2025-07-14 00:22:59.538289	2025-07-14 02:49:33.007
Vlogging Topic	Vlogging Topic	scroll-text	\N	2025-07-13 22:55:07.589532	2025-07-14 02:50:07.445
Water Entry Style	Water Entry Style	waves	\N	2025-07-13 22:55:07.684764	2025-07-14 02:50:18.719
\.


--
-- TOC entry 4586 (class 0 OID 21967)
-- Dependencies: 227
-- Data for Name: recipe_samples; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recipe_samples (id, recipe_id, generation_id, user_id, title, description, original_prompt, thumbnail_url, preview_url, high_res_url, type, file_size, dimensions, download_count, like_count, is_featured, is_moderated, moderation_status, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4588 (class 0 OID 21980)
-- Dependencies: 229
-- Data for Name: recipe_usage; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recipe_usage (recipe_id, usage_count, last_used_at) FROM stdin;
16	9	2025-07-14 16:40:14.021
18	8	2025-07-14 17:13:10.4
17	17	2025-07-14 17:20:07.961
\.


--
-- TOC entry 4608 (class 0 OID 22416)
-- Dependencies: 249
-- Data for Name: recipe_usage_options; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recipe_usage_options (recipe_id, last_generation_id, summary) FROM stdin;
16	206	{"age": {"\\"0\\"": 1, "\\"1\\"": 2}, "breed": {"\\"bengal\\"": 1, "\\"black american shorthair\\"": 2}, "weight": {"\\"1\\"": 1, "\\"3\\"": 2}, "attitude": {"\\"clumsy amateur\\"": 1, "\\"sophisticated and poised\\"": 2}, "soundStyle": {"\\"stadium cheering\\"": 3}, "divingStyle": {"\\"forward dive\\"": 1, "\\"twisting dive\\"": 2}, "waterEntryStyle": {"\\"meteoric\\"": 3}}
17	214	{"age": {"\\"23\\"": 1, "\\"70\\"": 1}, "venue": {"\\"home kitchen\\"": 1, "\\"tv tray dinner on couch\\"": 1}, "gender": {"\\"female\\"": 2}, "lavaFoodItem": {"\\"lava plate of food\\"": 1, "\\"lava spoonful of honey\\"": 1}, "asmrSoundStyle": {"\\"bubbling\\"": 1, "\\"dripping\\"": 1}, "eatingExpression": {"\\"absolutely_loving_it\\"": 1, "\\"sophisticated_enjoyment\\"": 1}}
18	207	{"propInHand": {"\\"microphone\\"": 1, "\\"selfie_stick\\"": 1}, "epicSetting": {"\\"canyon\\"": 1, "\\"small_airplane\\"": 1}, "fashionStyle": {"\\"tracksuit\\"": 1, "\\"blazer_gold_chains\\"": 1}, "vloggingTopic": {"\\"boujee_bragging\\"": 1, "\\"burning_daddys_money\\"": 1}}
\.


--
-- TOC entry 4589 (class 0 OID 21985)
-- Dependencies: 230
-- Data for Name: recipes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recipes (id, name, slug, description, prompt, instructions, category, style, model, credit_cost, usage_count, is_active, created_at, video_provider, video_duration, video_quality, video_aspect_ratio, image_provider, image_quality, image_size, num_images, creator_id, is_public, has_content_restrictions, revenue_share_enabled, revenue_share_percentage, recipe_steps, generation_type, referral_code, preview_image_url, workflow_type, workflow_components, tag_highlights, audio_type) FROM stdin;
18	BASEd Ape Vlog	based-ape-vlog	Create a BASE-jumping Ape recording his Vlog & dropping social commentary as he parachutes over all sorts of terrain.	{\n  "shot": {\n    "composition": "medium shot, vertical format, handheld camera, photo-realistic",\n    "camera_motion": "shaky handcam",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "a towering, photorealistic gorilla (inspired by the Bored Apes Yacht Club) with well groomed fur and expressive eyes",\n    "wardrobe": "{{wardrobe_description}}"\n  },\n  "scene": {\n    "location": "{{location_description}}",\n    "time_of_day": "daytime outdoors",\n    "environment": "{{environment_description}}"\n  },\n  "visual_details": {\n    "action": "{{action_description}}",\n    "props": "{{props_description}}"\n  },\n  "cinematography": {\n    "lighting": "natural sunlight with soft shadows",\n    "tone": "lighthearted and humorous"\n  },\n  "audio": {\n    "ambient": "{{ambient_sounds}}",\n    "dialogue": {\n      "character": "Gorilla",\n      "subtitles": false\n    },\n    "effects": "{{audio_effects}}"\n  },\n  "color_palette": "naturalistic with earthy greens and browns, whites and blues for snow",\n  "additional_details": {\n    "action": "{{additional_action_description}}",\n    "parachute_type": "large glider-style parachute",\n    "attitude": "gorilla is an apathetic thrill-seeker, effortlessly cool, low-key reckless, YOLO"\n  }\n}	Create a BASEd ape vlog with epic settings, fashion choices, and YOLO topics. The gorilla should be photorealistic and have an apathetic thrill-seeker attitude. The topic is now integrated into the action description.	Social Media Comedy	modern-lifestyle	flux-1	15	0	t	2025-06-24 18:43:05.73696	\N	8	hd	9:16	\N	hd	landscape_4_3	1	\N	t	t	f	20	[{"id": "fashionStyle", "type": "dropdown", "label": "Fashion Style", "options": [{"label": "Tracksuit", "value": "tracksuit"}, {"label": "Neon Fur Coat", "value": "neon_fur_coat"}, {"label": "Casual Streetwear", "value": "casual_streetwear"}, {"label": "Blazer & Gold Chains", "value": "blazer_gold_chains"}, {"label": "Formal w/ Black Tie", "value": "formal_black_tie"}, {"label": "Safari", "value": "safari"}, {"label": "Retro 80s", "value": "retro_80s"}, {"label": "Rustic", "value": "rustic"}], "required": true, "defaultValue": "tracksuit"}, {"id": "epicSetting", "type": "dropdown", "label": "Epic Setting", "options": [{"label": "Mountain Peaks", "value": "mountain_peaks"}, {"label": "Canyon", "value": "canyon"}, {"label": "Urban Skyline", "value": "urban_skyline"}, {"label": "Small Airplane", "value": "small_airplane"}], "required": true, "defaultValue": "mountain_peaks"}, {"id": "propInHand", "type": "dropdown", "label": "Prop in Hand", "options": [{"label": "None", "value": "none"}, {"label": "Cellphone", "value": "cellphone"}, {"label": "Selfie Stick", "value": "selfie_stick"}, {"label": "Microphone", "value": "microphone"}], "required": true, "defaultValue": "none"}, {"id": "vloggingTopic", "type": "emoji_button", "label": "Vlogging Topic", "options": [{"emoji": "😎", "label": "Living a BASEd life", "value": "based_life", "subtitle": "Living a BASEd life"}, {"emoji": "🪂", "label": "Being extreme / YOLO", "value": "extreme_yolo", "subtitle": "Being extreme / YOLO"}, {"emoji": "🏕️", "label": "Survival tips", "value": "survival_tips", "subtitle": "Survival tips"}, {"emoji": "📢", "label": "Boujee Bragging", "value": "boujee_bragging", "subtitle": "Boujee Bragging"}, {"emoji": "🪙", "label": "Crypto Riches", "value": "crypto_riches", "subtitle": "Crypto Riches"}, {"emoji": "🤑", "label": "Burning Daddy's Money", "value": "burning_daddys_money", "subtitle": "Burning Daddy's Money"}], "required": true, "defaultValue": "based_life"}]	video	\N	/guest-boredape-preview-img.png	text_to_video	"[{\\"type\\":\\"text_to_video\\",\\"model\\":\\"veo3-fast\\",\\"endpoint\\":\\"fal-ai/veo3/fast\\",\\"serviceId\\":2}]"	{4,5,6}	2
17	Lava Food ASMR	lava-food-asmr	Create bizarre, surreal, or funny scenes of people treating molten lava like everyday foods!	{\n  "shot": {\n    "composition": "close shot, handheld camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "slight natural shake",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "{{age}} year old {{gender}}",\n    "wardrobe": "a random outfit appropriate for the setting"\n  },\n  "scene": {\n    "location": "{{venue}}",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem surreally hot, invoking the idea that the subject is eating food made of lava"\n  },\n  "visual_details": {\n    "action": "{{action_description}}",\n    "props": "{{props_description}}"\n  },\n  "cinematography": {\n    "lighting": "indoors warm lighting with vibrant, flickering shadows",\n    "tone": "lighthearted and surreal"\n  },\n  "audio": {\n    "ambient": "{{ambient_sounds}}",\n    "asmr": "{{asmr_sound_style}}"\n  },\n  "special_effects": "the food is actually made of lava/magma that drips, burns, and oozes across surfaces",\n  "color_palette": "the lava should be bright yellow and orange, glowing with heat and bright light, reflected on skin",\n  "additional_details": {\n    "speed of action": "slowly taking bites",\n    "lava food interaction": "start with nothing in mouth, use utensils and take a bite, should create trails of lava when eating"\n  }\n}	Create bizarre, funny scenes of people treating molten lava like an everyday snack with customizable characters, food items, expressions, venues, and ASMR sound styles using structured JSON prompting.	Surreal Comedy	surreal	flux-1	10	0	t	2025-06-24 18:43:05.73696	\N	8	hd	9:16	\N	hd	landscape_4_3	1	\N	t	t	f	20	[{"id": "gender", "type": "radio", "label": "Gender", "options": [{"label": "Male", "value": "male"}, {"label": "Female", "value": "female"}], "required": true, "defaultValue": "female"}, {"id": "age", "type": "slider", "label": "Age", "config": {"max": 100, "min": 18, "step": 1, "showValue": true}, "required": true, "defaultValue": "30"}, {"id": "lavaFoodItem", "type": "dropdown", "label": "Lava Food Item", "options": [{"label": "Lava Pizza", "value": "lava pizza"}, {"label": "Lava Spoonful of Honey", "value": "lava spoonful of honey"}, {"label": "Lava Chocolate Cake", "value": "lava chocolate cake"}, {"label": "Lava Plate of Food", "value": "lava plate of food"}], "required": true, "defaultValue": "lava pizza"}, {"id": "eatingExpression", "type": "emoji_button", "label": "Eating Expression", "options": [{"emoji": "😀", "label": "Joyful", "value": "joyful", "subtitle": "Joyful"}, {"emoji": "😎", "label": "Totally Cool", "value": "totally_cool", "subtitle": "Totally Cool"}, {"emoji": "🧐", "label": "Sophisticated Enjoyment", "value": "sophisticated_enjoyment", "subtitle": "Sophisticated"}, {"emoji": "😍", "label": "Absolutely Loving It", "value": "absolutely_loving_it", "subtitle": "Loving It"}, {"emoji": "🤭", "label": "Bored", "value": "bored", "subtitle": "Bored"}, {"emoji": "🥴", "label": "Confused... but OK?", "value": "confused_but_ok", "subtitle": "Confused"}], "required": true, "defaultValue": "joyful"}, {"id": "venue", "type": "dropdown", "label": "Venue", "options": [{"label": "Home Kitchen", "value": "home kitchen"}, {"label": "Japanese Hibachi", "value": "japanese hibachi"}, {"label": "Sports Grill", "value": "sports grill"}, {"label": "Science Lab Table", "value": "science lab table"}, {"label": "Office Cubicle", "value": "office cubicle"}, {"label": "TV Tray Dinner on Couch", "value": "tv tray dinner on couch"}], "required": true, "defaultValue": "home kitchen"}, {"id": "asmrSoundStyle", "type": "dropdown", "label": "ASMR Sound Style", "options": [{"label": "Crunchy", "value": "crunchy"}, {"label": "Oozing", "value": "oozing"}, {"label": "Dripping", "value": "dripping"}, {"label": "Bubbling", "value": "bubbling"}], "required": true, "defaultValue": "crunchy"}]	video	\N	/guest-pizza-preview-img.png	text_to_video	[{"type": "text_to_video", "model": "veo3-fast", "endpoint": "fal-ai/veo3/fast", "serviceId": 2}]	{1,2,3,11}	1
16	Cat Olympic Diving	cat-olympic-diving	Create thrilling or hilarious Olympic diving events featuring cats of every kind!	{\n  "shot": {\n    "composition": "medium shot, professional dolly cable rigged camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "smooth tracking",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "{{cat_description}}",\n    "wardrobe": "a random athletic swimming suit appropriate to the character and setting"\n  },\n  "scene": {\n    "location": "Packed Olympic Stadium surrounds the pool. The stadium has an open ceiling so the sky is visible above the pool. Every seat in the stadium is filled, the lights are bright and there are camera flashes in the background.",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem like an excited stadium, invoking the idea that the subject is an animal attempting to perform olympic feats in diving"\n  },\n  "visual_details": {\n    "action": "{{action_description}}",\n    "props": "olympic swimming pool, diving board"\n  },\n  "cinematography": {\n    "lighting": "indoors bright natural lighting with soft shadows",\n    "tone": "focused"\n  },\n  "audio": {\n    "ambient": "{{ambient_sounds}}"\n  },\n  "special_effects": "{{special_effects_description}}",\n  "color_palette": "grays and blues for the stadium and water, and colorful for the audience",\n  "additional_details": {\n    "water interaction": "the subject should enter the water and not come out, end once the water entry animation is complete"\n  }\n}	Create hilarious videos of cats performing Olympic diving feats. Choose the cat breed, age, weight, diving style, attitude, water entry style, and sound ambiance to create your perfect diving moment.	Sports & Entertainment	athletic	flux-1	15	0	t	2025-06-24 18:43:05.73696	\N	8	hd	9:16	\N	hd	landscape_4_3	1	\N	t	t	f	20	[{"id": "breed", "type": "dropdown", "label": "Cat Breed", "options": [{"label": "Maine Coon", "value": "maine coon"}, {"label": "Siamese", "value": "siamese"}, {"label": "Black American Shorthair", "value": "black american shorthair"}, {"label": "Orange Tabby", "value": "orange tabby"}, {"label": "Calico", "value": "calico"}, {"label": "Bengal", "value": "bengal"}, {"label": "Russian Blue", "value": "russian blue"}], "required": true, "defaultValue": "black american shorthair"}, {"id": "age", "type": "slider", "label": "Age", "config": {"max": 2, "min": 0, "step": 1, "ticks": [{"label": "Kitten", "value": 0}, {"label": "Adult Cat", "value": 1}, {"label": "Senior Citizen Cat", "value": 2}], "showValue": true}, "required": true, "defaultValue": "1"}, {"id": "weight", "type": "slider", "label": "Weight", "config": {"max": 3, "min": 0, "step": 1, "ticks": [{"label": "Athletic Build", "value": 0}, {"label": "Average Weight", "value": 1}, {"label": "Overweight", "value": 2}, {"label": "Obese", "value": 3}], "showValue": true}, "required": true, "defaultValue": "0"}, {"id": "divingStyle", "type": "dropdown", "label": "Diving Style", "options": [{"label": "Backflip", "value": "backflip"}, {"label": "Forward Somersault", "value": "forward somersault"}, {"label": "Twisting Dive", "value": "twisting dive"}, {"label": "Forward Dive", "value": "forward dive"}], "required": true, "defaultValue": "backflip"}, {"id": "attitude", "type": "dropdown", "label": "Attitude", "options": [{"label": "Professional Sports Athlete", "value": "professional sports athlete"}, {"label": "Clumsy Amateur", "value": "clumsy amateur"}, {"label": "Sophisticated & Poised", "value": "sophisticated and poised"}], "required": true, "defaultValue": "clumsy amateur"}, {"id": "waterEntryStyle", "type": "emoji_button", "label": "Water Entry Style", "options": [{"emoji": "💯", "label": "Neat Dive", "value": "neat dive", "subtitle": "Clean entry"}, {"emoji": "🌊", "label": "Cannonball splash", "value": "cannonball splash", "subtitle": "Big splash"}, {"emoji": "💥", "label": "Meteoric", "value": "meteoric", "subtitle": "Explosive entry"}], "required": true, "defaultValue": "cannonball splash"}, {"id": "soundStyle", "type": "dropdown", "label": "Sound Style", "options": [{"label": "Stadium cheering ambiance", "value": "stadium cheering"}, {"label": "Hushed stadium", "value": "hushed stadium"}], "required": true, "defaultValue": "stadium cheering"}]	video	\N	/guest-olympics-preview-img.png	text_to_video	[{"type": "text_to_video", "model": "veo3-fast", "endpoint": "fal-ai/veo3/fast", "serviceId": 2}]	{8,9,6}	2
\.


--
-- TOC entry 4591 (class 0 OID 22009)
-- Dependencies: 232
-- Data for Name: revenue_shares; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.revenue_shares (id, recipe_id, creator_id, user_id, generation_id, credits_used, revenue_amount, share_percentage, creator_earnings, is_paid_credits, created_at) FROM stdin;
\.


--
-- TOC entry 4593 (class 0 OID 22016)
-- Dependencies: 234
-- Data for Name: sample_likes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sample_likes (id, sample_id, user_id, created_at) FROM stdin;
\.


--
-- TOC entry 4595 (class 0 OID 22023)
-- Dependencies: 236
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.services (id, provider_id, provider_title, type_id, title, description, endpoint, config, is_active, created_at, updated_at, base_cost) FROM stdin;
1	1	\N	1	FLUX.1 [schnell]	12 billion parameter flow transformer that generates high-quality images from text in 1 to 4 steps, suitable for personal and commercial use.	fal-ai/flux/schnell	{}	t	2025-07-10 14:42:21.920347	2025-07-10 14:48:50.613	0.0030000000000000
2	1	\N	2	Veo 3 Fast	Faster and more cost effective version of Google's Veo 3	fal-ai/veo3/fast	{}	t	2025-07-10 15:37:53.617866	2025-07-10 15:37:53.617866	3.2000000000000002
\.


--
-- TOC entry 4597 (class 0 OID 22033)
-- Dependencies: 238
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (sid, sess, expire) FROM stdin;
mfgYNtVizyXCQjQrs2HxvmIRsTvk1YJL	{"cookie": {"path": "/", "secure": true, "expires": "2025-06-21T02:05:20.569Z", "httpOnly": true, "originalMaxAge": 604800000}, "replit.com": {"code_verifier": "2lHGGJf0v2kkPbNQN7e-Sq5Fas3SScgBA9YdxQ1ewXE"}}	2025-06-21 02:05:21
fQrzop-Qxx1fYywjXzdeI9_ttABcLGc4	{"cookie": {"path": "/", "secure": true, "expires": "2025-06-21T12:57:52.393Z", "httpOnly": true, "originalMaxAge": 604800000}, "walletNonce": {"nonce": "151415", "address": "0x1234567890123456789012345678901234567890", "timestamp": 1749905872392}}	2025-06-21 12:57:53
GzsdQc0lltBj7qoHFPWjYvnnt0YE6JHC	{"cookie": {"path": "/", "secure": true, "expires": "2025-06-22T11:12:51.641Z", "httpOnly": true, "originalMaxAge": 604800000}, "passport": {"user": {"claims": {"aud": "6a2f4fe9-aefd-4e53-9c42-dc84db18f876", "exp": 1749989571, "iat": 1749985971, "iss": "https://replit.com/oidc", "sub": "38298645", "email": "tcotten@scryptedinc.com", "at_hash": "T_t0W7W_hntd8L-fZDRhGQ", "username": "tcotten", "auth_time": 1749921921, "last_name": null, "first_name": null}, "expires_at": 1749989571, "access_token": "5kpSv60u1zMeiZzD12MWJfNeWy7mZsad_yzRrqHwHwa", "refresh_token": "ATrbtNCRjPL0jHXypBPfSpQG3akoMuQxuO9yWAo6UCu"}}, "replit.com": {"code_verifier": "e6vIm-IJR4ENxA5w1NlRkhYbTPmUkdCx_x81CnmeJWQ"}}	2025-06-22 11:51:13
\.


--
-- TOC entry 4598 (class 0 OID 22038)
-- Dependencies: 239
-- Data for Name: smart_generation_requests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.smart_generation_requests (id, creator_id, recipe_id, recipe_variables, recipe_variables_hash, status, generation_id, backlog_video_id, credits_cost, failure_reason, error_details, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4600 (class 0 OID 22047)
-- Dependencies: 241
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tags (id, name, description, color, is_active, created_at) FROM stdin;
1	surreal	Unexpected, impossible things done without a care in the world.	purple	t	2025-07-03 14:38:46.636265
2	comedy	There's no way this really happened?!	yellow	t	2025-07-03 14:38:46.776627
3	danger	Don't try this at home!	red	t	2025-07-03 14:38:46.968349
11	asmr	Autonomous Sensory Meridian Response (ASMR) - the tingling sensation caused by sounds alone	gray	t	2025-07-03 15:19:50.405025
4	speaking	Yapping about something, somewhere, somehow.	blue	t	2025-07-03 14:48:29.326549
5	lifestyle	From bourgeois to dirt poor, from medieval high-class nobility to sci-fi.	green	t	2025-07-03 14:48:29.441605
6	animal	Animals of every type doing things the humans do, or not.	orange	t	2025-07-03 14:48:29.547333
8	athletic	Sports, athletes, and exercise.	green	t	2025-07-03 14:55:43.013367
9	commentary	Announcers, analysts jabbering about what's going on.	blue	t	2025-07-03 14:55:43.125465
\.


--
-- TOC entry 4602 (class 0 OID 22056)
-- Dependencies: 243
-- Data for Name: type_audio; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.type_audio (id, title) FROM stdin;
0	No Sound
1	Sound
2	Speech
\.


--
-- TOC entry 4607 (class 0 OID 22379)
-- Dependencies: 248
-- Data for Name: type_role; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.type_role (id, title) FROM stdin;
1	User
2	Test
3	Admin
\.


--
-- TOC entry 4603 (class 0 OID 22059)
-- Dependencies: 244
-- Data for Name: type_services; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.type_services (id, title, created_at) FROM stdin;
1	Text-to-Image	2025-07-10 13:59:25.180692
2	Text-to-Video	2025-07-10 13:59:31.735088
3	Image-to-Video	2025-07-10 13:59:35.919781
\.


--
-- TOC entry 4606 (class 0 OID 22369)
-- Dependencies: 247
-- Data for Name: type_user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.type_user (id, title) FROM stdin;
1	System
2	Guest
3	Registered
\.


--
-- TOC entry 4605 (class 0 OID 22064)
-- Dependencies: 246
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, first_name, last_name, profile_image_url, credits, created_at, updated_at, handle, session_token, last_seen_at, password_hash, oauth_provider, is_ephemeral, can_upgrade_to_registered, last_credit_refresh, account_type, access_role) FROM stdin;
guest_IBUomKpDwnVe	\N	\N	\N	\N	10	2025-07-10 05:50:32.562	2025-07-10 05:50:32.597425	\N	-WZlMLYMrqaPgEGwTg6GhndVICgBOiix	2025-07-10 05:50:32.562	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ayKCcZkbqANG	\N	\N	\N	\N	10	2025-07-10 05:50:36.439	2025-07-10 05:50:36.473944	\N	iNKGUy0Qk_l-m3c6ULqQwlBxcDwlTZyr	2025-07-10 05:50:36.439	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_rNyCBgNngmg3	\N	\N	\N	\N	10	2025-07-10 03:08:05.188	2025-07-10 03:08:05.248454	\N	XFP5JIHU6AZEVUD-o6wJPZ7dMC5d-ggS	2025-07-10 03:08:05.188	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_r6j4wTlMdP51	\N	\N	\N	\N	10	2025-07-10 03:08:05.818	2025-07-10 03:08:05.958825	\N	uWdJ_4ixTkKoZNnOjYAJ_1dmS9AO8rAR	2025-07-10 03:08:05.818	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_lxkW_B4Q4fcE	\N	\N	\N	\N	10	2025-07-10 03:08:05.821	2025-07-10 03:08:05.959296	\N	OZ0wsIEYfhA1VrLXbpPROUJFMK43021P	2025-07-10 03:08:05.821	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ryMQDZg-OaTE	\N	\N	\N	\N	10	2025-07-10 03:08:05.819	2025-07-10 03:08:05.959582	\N	9H4QtH7HxcPe9Ps7poRvw_S0sTVukL_b	2025-07-10 03:08:05.819	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Mn0-y8nBtU_K	\N	\N	\N	\N	10	2025-07-10 03:08:05.821	2025-07-10 03:08:05.959852	\N	z4aaF661psMVDrE92rnxp69Ir3IzgN11	2025-07-10 03:08:05.821	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_kaMYNsmeasFY	\N	\N	\N	\N	10	2025-07-10 03:08:05.822	2025-07-10 03:08:05.960312	\N	kXEUdKtCiYqWvbQyPkh3qoKQLie5UDRX	2025-07-10 03:08:05.822	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_uWMZ7iz7UOwH	\N	\N	\N	\N	10	2025-07-10 05:39:23.24	2025-07-10 05:39:23.274778	\N	zynRmFGBG4J9wjHv8Tish8teVV3FQZxN	2025-07-10 05:39:23.24	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_rlG864M8XMai	\N	\N	\N	\N	10	2025-07-10 05:39:23.677	2025-07-10 05:39:23.712076	\N	it0ed_x9YVnsgk-ejU2msebGT0tDb5Ua	2025-07-10 05:39:23.677	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
user_debug	user@magicvidio.com	Test	User	\N	50	2025-06-15 11:52:49.112834	2025-07-09 23:57:38.124	@useruser_d	\N	2025-06-26 15:22:49.047284	\N	\N	f	f	2025-07-13 17:30:54.503155	3	1
premium_debug	premium@magicvidio.com	Premium	User	\N	500	2025-06-15 11:52:49.192743	2025-07-09 23:57:38.256	@userpremiu	\N	2025-06-26 15:22:49.047284	\N	\N	f	f	2025-07-13 17:30:54.503155	3	1
guest_OERp2jBl4Qbx	\N	\N	\N	\N	10	2025-07-10 02:54:34.228	2025-07-10 02:54:34.263205	\N	gqw-mh-BqEtW2RNPpUkyxLGCP4F0OddI	2025-07-10 03:17:12.109	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_qTQmoxRcutrz	\N	\N	\N	\N	10	2025-07-10 05:51:07.386	2025-07-10 05:51:07.422686	\N	NNGSyCH5ollahXr_9PMkjagmojIO3gJV	2025-07-10 05:51:07.386	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_UDXrKHarbr83	\N	\N	\N	\N	10	2025-07-10 02:55:00.717	2025-07-10 02:55:00.751964	\N	wqrI-BqjfT19QnMk_oUwyTrBZn1WtBId	2025-07-10 02:55:00.717	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_OlrjabEhr1mv	\N	\N	\N	\N	10	2025-07-10 03:08:05.184	2025-07-10 03:08:05.222667	\N	Esuf_IWh2Nk3WK_L6kI0QO19EEJDFOQ7	2025-07-10 03:11:16.587	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_z6XbtZB4qCLz	\N	\N	\N	\N	10	2025-07-10 02:20:12.764	2025-07-10 02:20:12.800023	\N	aGu4_gLpY_05J9VKbW-owuOKqdNEbB8W	2025-07-10 02:20:12.764	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_vh5jg_7m2P9c	\N	\N	\N	\N	10	2025-07-10 05:31:37.259	2025-07-10 05:31:37.295164	\N	ib9Bc0AoulyauaOg6fE_KN5R8OiYp7Fh	2025-07-10 05:50:15.868	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
38298645	tcotten@scryptedinc.com	\N	\N	\N	50	2025-06-14 17:25:10.758565	2025-06-26 15:24:43.542281	@user382986	\N	2025-06-26 15:22:49.047284	\N	\N	f	f	2025-07-13 17:30:54.503155	3	1
guest_au25oIKBchDx	\N	\N	\N	\N	10	2025-07-10 02:21:34.347	2025-07-10 02:21:34.38261	\N	NNUqpuDG17FXpZgQ6opacqa6D6UZvB6r	2025-07-10 02:21:34.347	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_b06Japp6A-cS	\N	\N	\N	\N	10	2025-07-10 02:21:36.331	2025-07-10 02:21:36.366625	\N	mJPSXGvwWiHqPZjh8sMU5oneoxNgrCwG	2025-07-10 02:21:36.331	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_8jGUQW3PVsul	\N	\N	\N	\N	10	2025-07-10 05:50:21.713	2025-07-10 05:50:21.748748	\N	mW1kp2KqYTsRT_VWUzU3f518pdMTkswb	2025-07-10 05:50:21.713	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_G1Ctdyj_DKCN	\N	\N	\N	\N	10	2025-07-10 02:33:05.099	2025-07-10 02:33:05.135641	\N	8SeE_ZpZRRSLEYaF9529eMZ0Ay2I2QDb	2025-07-10 02:33:05.099	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_S4mLTUeWTIEY	\N	\N	\N	\N	10	2025-07-10 02:39:55.68	2025-07-10 02:39:55.715113	\N	LtX63huBQqqcaD486R-EJj9U09Q0uLSm	2025-07-10 02:39:55.68	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_tZQEz2c8WsEO	\N	\N	\N	\N	10	2025-07-10 05:50:23.446	2025-07-10 05:50:23.483195	\N	gZ5NVkH8dBC1OuxiVJRLu_JzSSKhPO55	2025-07-10 05:50:23.446	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_klWk1VLTpSlN	\N	\N	\N	\N	10	2025-07-10 03:30:34.347	2025-07-10 03:30:34.381537	\N	iiEbRcVSV08MOd132C9Qe-_ITSkIq6dI	2025-07-10 03:30:52.055	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest__VVMx51FSJVB	\N	\N	\N	\N	10	2025-07-10 04:05:44.656	2025-07-10 04:05:44.690356	\N	9PXQxWJNoZanFTHKiqZcxx90uBBoNWdV	2025-07-10 04:05:44.656	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_3G2KhjdaMdHi	\N	\N	\N	\N	10	2025-07-10 04:05:44.742	2025-07-10 04:05:44.776439	\N	6Swhtvo07AyZAoU63-TgzN3KnRHsB91h	2025-07-10 04:05:44.742	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_lmLjPVbceaO3	\N	\N	\N	\N	10	2025-07-10 04:52:55.451	2025-07-10 04:52:55.486141	\N	QeJiZGsz8DEhmjtWqzUXV5s9U2D2pGrB	2025-07-10 04:52:55.451	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_024bFzqJlwY9	\N	\N	\N	\N	10	2025-07-10 05:05:17.294	2025-07-10 05:05:17.329982	\N	qN-3mnwvctfjRvPLh67VGopzY4v9bQNN	2025-07-10 05:05:17.294	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_qsL8QMbBrU73	\N	\N	\N	\N	10	2025-07-10 05:50:39.207	2025-07-10 05:50:39.241949	\N	_Wsc82AFZukg2OBt-Cs1cwnVCSdhY3CZ	2025-07-10 05:50:39.207	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Vrhfy_gfsT4S	\N	\N	\N	\N	10	2025-07-10 03:05:23.603	2025-07-10 03:05:23.637586	\N	eqpQUnaOdyo6B__k84EfWoW5OvAdykY2	2025-07-10 03:05:23.603	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_uKSmmLU1_3qE	\N	\N	\N	\N	10	2025-07-10 05:39:22.794	2025-07-10 05:39:22.829751	\N	-a1jqpYCoyYmCIipNi1e15x6ND4rfOtx	2025-07-10 05:39:22.794	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_34obOJtRamlL	\N	\N	\N	\N	10	2025-07-10 03:08:03.484	2025-07-10 03:08:03.708119	\N	4lQ-Xprjtoijr-92Vx9zkzMr-nVE0C12	2025-07-10 03:08:03.484	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_kH7DUzl_6bw2	\N	\N	\N	\N	10	2025-07-10 03:08:03.497	2025-07-10 03:08:03.729848	\N	xXPDetWeB3jFr7KSP1U-HUMBvtkDCzKp	2025-07-10 03:08:03.497	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_qAQJB_83YL_h	\N	\N	\N	\N	10	2025-07-10 03:08:03.527	2025-07-10 03:08:03.733941	\N	Tyv37S3ePTO9vGdQa9ENaJobhtOH9uG6	2025-07-10 03:08:03.527	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_K8w6XUQNAToL	\N	\N	\N	\N	10	2025-07-10 03:08:03.544	2025-07-10 03:08:03.742518	\N	dCPAhJqEFX6NMZDnAiBBQosb_34gqRb6	2025-07-10 03:08:03.544	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ol0KQTAqdT9c	\N	\N	\N	\N	10	2025-07-10 05:50:52.841	2025-07-10 05:50:52.877205	\N	TPrabhdEdFcelaX5Mdcb9x0wK5-pn-Cz	2025-07-10 05:50:52.841	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_aRyyU3GmiQhz	\N	\N	\N	\N	10	2025-07-13 03:21:56.143	2025-07-13 03:21:56.14477	\N	-yoQnBjjKgiRb0nTgH_ehtl_69a9GxmZ	2025-07-13 03:21:56.143	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_9Xu5Phxsyc07	\N	\N	\N	\N	10	2025-07-10 05:51:09.748	2025-07-10 05:51:09.783213	\N	5Jn9Lg2iBafE6K4t82uMi1YMlWfzn36C	2025-07-10 05:51:09.748	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Ds64h96DFnPv	\N	\N	\N	\N	10	2025-07-10 05:51:21.507	2025-07-10 05:51:21.542761	\N	x6nzjdLPt-pHarzgLQZ-iJT9n1ajmq0w	2025-07-10 05:51:21.507	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ztbtp28EtPHk	\N	\N	\N	\N	10	2025-07-10 05:51:23.149	2025-07-10 05:51:23.183389	\N	ULH1xjsCOePO8sUCV0M78kgGxnBReuVv	2025-07-10 05:51:23.149	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_98T1oesJm7Df	\N	\N	\N	\N	10	2025-07-10 05:51:27.99	2025-07-10 05:51:28.027363	\N	6lB6i-IgbNL6csz-mf_lAS__HLSCE9S0	2025-07-10 05:51:27.99	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_uiQbfnEo1Ri8	\N	\N	\N	\N	10	2025-07-13 03:21:56.287	2025-07-13 03:21:56.289002	\N	46Ye4mlNh70oNxyUv4r1kiE1NgQaU-IE	2025-07-13 03:21:56.287	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_EL8IrrpKZq3p	\N	\N	\N	\N	10	2025-07-10 05:51:29.612	2025-07-10 05:51:29.646003	\N	4NY7onIpBPOkU21N_FSr6BTcTM2cAZ98	2025-07-10 05:51:29.612	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_RxiiUwUiWc9r	\N	\N	\N	\N	10	2025-07-10 05:51:31.028	2025-07-10 05:51:31.065419	\N	MXi-Ghc2qWqD0uqUpjR0wrT47LzyoZNt	2025-07-10 05:51:31.028	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_L2JLWTY33unN	\N	\N	\N	\N	10	2025-07-10 05:51:42.711	2025-07-10 05:51:42.74655	\N	T2SDKj3Vu6MvkKu0_PWGYhTQp8LIHLlS	2025-07-10 05:51:42.711	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_jzL-E9FloZpc	\N	\N	\N	\N	10	2025-07-10 05:54:54.286	2025-07-10 05:54:54.321632	\N	36u5AWtXctO4KwM3uVgH5tWc8t-unLUR	2025-07-10 05:54:54.286	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest__DABmboLtrth	\N	\N	\N	\N	10	2025-07-10 05:52:00.966	2025-07-10 05:52:01.0113	\N	zIHC4f83pRb4WhCxcKXzAzB4Kb1NO0MA	2025-07-10 05:52:00.966	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_x_E3r7_cGsg9	\N	\N	\N	\N	10	2025-07-10 05:52:12.816	2025-07-10 05:52:12.85124	\N	bwhZhSlw2ZtJ1Z4QP2FWWa8X-nVS9-W8	2025-07-10 05:52:12.816	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_DTRSRpYOKAyo	\N	\N	\N	\N	10	2025-07-10 05:52:24.582	2025-07-10 05:52:24.617497	\N	K_881x21gRZn-tuUiQQavIllJnPGGgyp	2025-07-10 05:52:24.582	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_TCgsEu1xmjlD	\N	\N	\N	\N	10	2025-07-10 05:52:25.911	2025-07-10 05:52:25.945382	\N	gQHCRPos0HNQVOgzJS2X1BtUDn-xnp-v	2025-07-10 05:52:25.911	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_3d_EeeFebBM8	\N	\N	\N	\N	10	2025-07-10 05:52:27.348	2025-07-10 05:52:27.383529	\N	z2anKpjkQFOrEmXnoKL-JDv0CRPueukN	2025-07-10 05:52:27.348	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_y2bJtrhfpiT_	\N	\N	\N	\N	10	2025-07-10 05:52:28.795	2025-07-10 05:52:28.830653	\N	VjWwWs-3afnU_jmVbN_ODbCGYcH906eM	2025-07-10 05:52:28.795	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_C3uJpG_SwLzx	\N	\N	\N	\N	10	2025-07-10 05:52:30.11	2025-07-10 05:52:30.144931	\N	LcqTsX7PzB9kC_xmOh0lh3ikDFscsNPg	2025-07-10 05:52:30.11	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_5kK4NIfZHzKu	\N	\N	\N	\N	10	2025-07-10 05:52:31.621	2025-07-10 05:52:31.655976	\N	sSDL1XgNop_zQJL54vGyD3mrPXnDJe8u	2025-07-10 05:52:31.621	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_7XoLeL1f7vcV	\N	\N	\N	\N	10	2025-07-10 05:52:33.186	2025-07-10 05:52:33.221042	\N	uyq3-cwO3sNGPU6syEM4ERaVpn7_v4yJ	2025-07-10 05:52:33.186	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_549oUiznjbgM	\N	\N	\N	\N	10	2025-07-10 05:52:34.514	2025-07-10 05:52:34.549279	\N	MAGQdokNFUWSVx_wGgiXg4zPYtKlfx-v	2025-07-10 05:52:34.514	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_FQ_XW12rjBtI	\N	\N	\N	\N	10	2025-07-10 05:52:36.058	2025-07-10 05:52:36.093568	\N	f9LN-KUNbLAYDMRkMSMe8bKUqs2XsjBz	2025-07-10 05:52:36.058	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_DGlHTYXzfN3W	\N	\N	\N	\N	10	2025-07-10 05:52:37.707	2025-07-10 05:52:37.742621	\N	prUMpQXRjwHrBncOvuW5005wx0Dgqecj	2025-07-10 05:52:37.707	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_-nTDcJyto_k4	\N	\N	\N	\N	10	2025-07-10 05:52:39.327	2025-07-10 05:52:39.36235	\N	gRtgGXgAiapNRQLKCv0_rmkf1Ga3gGSv	2025-07-10 05:52:39.327	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_fHOTbzt7L3kf	\N	\N	\N	\N	10	2025-07-10 05:52:40.752	2025-07-10 05:52:40.786268	\N	yF0Gc-RotNTPbrRKgPMFpxUaCR5Eln2p	2025-07-10 05:52:40.752	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_1clLCcSUimPw	\N	\N	\N	\N	10	2025-07-10 05:52:44.868	2025-07-10 05:52:44.902997	\N	BUCv-0n6EcKcPHTSLw6qPd_kIAIWPRUL	2025-07-10 05:52:44.868	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_8rif-oAh0Axu	\N	\N	\N	\N	10	2025-07-10 05:54:26.352	2025-07-10 05:54:26.389792	\N	m67XvcXf_ksz2ZePvbCHpkdJnu8D7PTO	2025-07-10 05:54:26.352	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_P-YR_pjIXM5k	\N	\N	\N	\N	10	2025-07-10 05:52:50.611	2025-07-10 05:52:50.646612	\N	3M95x_SEKzBPA2rmmSqKznTUbrF_EQy6	2025-07-10 05:52:50.611	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_fwAdjoJ1Q6MW	\N	\N	\N	\N	10	2025-07-10 05:52:54.979	2025-07-10 05:52:55.016819	\N	AtVUgOEXfOpOam7jt40VxM3NyU7F_O7f	2025-07-10 05:52:54.979	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_j7nZAFpMPeqU	\N	\N	\N	\N	10	2025-07-10 05:52:56.649	2025-07-10 05:52:56.684498	\N	kYTJ1l9IuBRk9QoeSr979dzctXnJRm-_	2025-07-10 05:52:56.649	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_YStaNVIkW63q	\N	\N	\N	\N	10	2025-07-10 05:52:58.079	2025-07-10 05:52:58.11471	\N	bitFPI1HErOCWarzdF0QqW5MpazpOStx	2025-07-10 05:52:58.079	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_gWx4ekqnMyxt	\N	\N	\N	\N	10	2025-07-10 05:52:59.458	2025-07-10 05:52:59.493123	\N	enKM3NYAP92zaNKpodLKAKra0mMixxfS	2025-07-10 05:52:59.458	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ti9K1iXAYa12	\N	\N	\N	\N	10	2025-07-10 05:54:30.75	2025-07-10 05:54:31.022157	\N	XqsRxnUbphayV3Vu7GE9q9UzP5WW39MY	2025-07-10 05:54:30.75	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_cEGfcsfSfDzB	\N	\N	\N	\N	10	2025-07-10 05:53:12.626	2025-07-10 05:53:12.662019	\N	zunpZAaGz19OY1YizsbSTY4yraPE-Ijy	2025-07-10 05:53:12.626	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_1v60k01tri5J	\N	\N	\N	\N	10	2025-07-10 05:53:15.882	2025-07-10 05:53:15.916632	\N	ZiW6fG2G6ZRG14KYMsufsmM2_8WuCVX_	2025-07-10 05:53:15.882	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_cU0q6JN5g3KB	\N	\N	\N	\N	10	2025-07-10 05:53:18.685	2025-07-10 05:53:18.72128	\N	Kh_GZdpaLXIZGECR9_sNgvhn05SHaF_Z	2025-07-10 05:53:18.685	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_7v_UP4t65j4f	\N	\N	\N	\N	10	2025-07-10 05:53:20.088	2025-07-10 05:53:20.123231	\N	pTEUUesRpkB1AGEo-kE_GAiC59snp6Ik	2025-07-10 05:53:20.088	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_6iBbivrc97_W	\N	\N	\N	\N	10	2025-07-10 05:53:21.419	2025-07-10 05:53:21.455507	\N	yz8GgW_fgmFOGapm7hoRKPlJtRggzsTw	2025-07-10 05:53:21.419	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_VuCZcOGV159K	\N	\N	\N	\N	10	2025-07-10 05:53:23.069	2025-07-10 05:53:23.103871	\N	JJkhMDnA0GVVePBaYxXM0Xy61cXp86HO	2025-07-10 05:53:23.069	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_SF9BFL4c0Wju	\N	\N	\N	\N	10	2025-07-10 05:53:24.603	2025-07-10 05:53:24.637789	\N	yJwn_vyUofhLSrFbFtTFmLRyIZ9ge9ia	2025-07-10 05:53:24.603	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_jJtbQybhNn0p	\N	\N	\N	\N	10	2025-07-10 05:53:36.282	2025-07-10 05:53:36.316995	\N	4Qmh8VBOW33kDd76WVTx1OLKOz70why2	2025-07-10 05:53:36.282	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_iiFM2wwtQ9_a	\N	\N	\N	\N	10	2025-07-10 05:53:42.629	2025-07-10 05:53:42.66588	\N	673EvwFG2jUSh3at3huuYv_kZmoLw4rB	2025-07-10 05:53:42.629	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_oO-i6D80Iy7b	\N	\N	\N	\N	10	2025-07-10 05:53:44.162	2025-07-10 05:53:44.197492	\N	MjgALf8vRyN4NhxxGZCeDTmMe-yTtPUP	2025-07-10 05:53:44.162	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_SjvG__bxZgHC	\N	\N	\N	\N	10	2025-07-10 05:53:45.389	2025-07-10 05:53:45.424199	\N	dWuuVenG-Vd22mW1JAVJj0kirnaaEi2U	2025-07-10 05:53:45.389	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_MvM2mMg2Wia7	\N	\N	\N	\N	10	2025-07-10 05:53:46.812	2025-07-10 05:53:46.848048	\N	x8XyO6-G1yLFFEKFqhdxLzlS2a9HQRjy	2025-07-10 05:53:46.812	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_UqfqqBoYF97t	\N	\N	\N	\N	10	2025-07-10 05:55:25.833	2025-07-10 05:55:25.86857	\N	qeYfHtT2gZA0ehUfB-poZ70lOzp9gSWg	2025-07-10 05:55:25.833	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_pevIJYdv9n9v	\N	\N	\N	\N	10	2025-07-10 05:53:52.151	2025-07-10 05:53:52.185876	\N	cP6vn79MfU2u2VnTCcGgLu07c4zueITo	2025-07-10 05:53:52.151	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_OopeVSnjAzoU	\N	\N	\N	\N	10	2025-07-10 05:53:56.357	2025-07-10 05:53:56.779295	\N	1fkQJaVlkgp7tPvRgIk-NgP6kSEZ9780	2025-07-10 05:53:56.357	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_LCzOAQevZ7Ym	\N	\N	\N	\N	10	2025-07-10 05:54:36.578	2025-07-10 05:54:36.611528	\N	0cwpvLqBjAhyvQgNcnXLJXouMA5p7C2y	2025-07-10 05:54:36.578	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_-vLEx8JfemEt	\N	\N	\N	\N	10	2025-07-10 05:54:02.999	2025-07-10 05:54:03.041811	\N	1I_TT0xTvARG-8jcwR2-ZAq7BD_LA526	2025-07-10 05:54:02.999	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_m_B585CnL7p7	\N	\N	\N	\N	10	2025-07-10 05:55:00.1	2025-07-10 05:55:00.132356	\N	LEvkbxZ05rZ4t071iVkgkYgu1RJtpbUj	2025-07-10 05:55:00.1	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_V6d1a8W6JlIw	\N	\N	\N	\N	10	2025-07-10 05:54:10.358	2025-07-10 05:54:10.39297	\N	3gqqZUjzAJdToRK5qPQDsrcsuo57MVMP	2025-07-10 05:54:10.358	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_rdzZ-FRgklT6	\N	\N	\N	\N	10	2025-07-10 05:54:15.118	2025-07-10 05:54:15.165492	\N	NSZECUOl6lFYvQ5GpUSG3bn1l2vzlocF	2025-07-10 05:54:15.118	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_W9LY-xk21lAP	\N	\N	\N	\N	10	2025-07-10 05:55:05.338	2025-07-10 05:55:05.409661	\N	--dZkCs292MgNMzvnxAXICFn8mMm3ALr	2025-07-10 05:55:05.338	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_W6EytpDMoxXU	\N	\N	\N	\N	10	2025-07-10 05:54:20.924	2025-07-10 05:54:20.958157	\N	0yX8H6Klrk02bZlnqi4rg2_QvIlst6R0	2025-07-10 05:54:20.924	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_OeEdogAnufkV	\N	\N	\N	\N	10	2025-07-10 05:54:41.511	2025-07-10 05:54:41.5469	\N	L2oqshfe3Ns7rnX7ffWIRBYg0tW0A4oL	2025-07-10 05:54:41.511	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_DMviFwPI8lwp	\N	\N	\N	\N	10	2025-07-10 05:55:08.112	2025-07-10 05:55:08.145095	\N	sN8FLP7RCV_6gEe9GvPZjgw60xSNGl3S	2025-07-10 05:55:08.112	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_hpzeTSKjhKs-	\N	\N	\N	\N	10	2025-07-10 05:55:06.866	2025-07-10 05:55:06.90022	\N	y5VG483EVixK43vDSu3XpLNURsXHQKQK	2025-07-10 05:55:06.866	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_hwGUUtAtrHAQ	\N	\N	\N	\N	10	2025-07-10 05:55:09.255	2025-07-10 05:55:09.287565	\N	WXYMV_ZMXiSHl_cBPh9j3Reb0_kE0l3I	2025-07-10 05:55:09.255	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_sHvMiSfSns23	\N	\N	\N	\N	10	2025-07-10 05:55:10.449	2025-07-10 05:55:10.481055	\N	t5KQ7R2ylrzqqm9fqKwRPcouZiiFA905	2025-07-10 05:55:10.449	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_VJDFZiH0gvrK	\N	\N	\N	\N	10	2025-07-10 05:55:35.579	2025-07-10 05:55:35.614807	\N	USdtm80fFKLyznRjeVID6Vv2_dMByO4Z	2025-07-10 05:55:35.579	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_TuwfOvKaLfh0	\N	\N	\N	\N	10	2025-07-10 05:55:29.965	2025-07-10 05:55:30.001921	\N	sFQCbX_dKdSqbpJ_6cEVrprfJhdGcnV_	2025-07-10 05:55:29.965	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_9taigZJ52TiW	\N	\N	\N	\N	10	2025-07-10 05:55:39.607	2025-07-10 05:55:39.644752	\N	4rh0jrxv9xrz7723Gv_aZ1NVyAUatug8	2025-07-10 05:55:39.607	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_TPRBvrG2KrTS	\N	\N	\N	\N	10	2025-07-10 05:55:41.499	2025-07-10 05:55:41.534306	\N	WfqaOV1TnDjWvoSPl8BmgnNiFJCqSdwg	2025-07-10 05:55:41.499	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_O1GKAuA7Jife	\N	\N	\N	\N	10	2025-07-10 05:55:55.65	2025-07-10 05:55:55.686178	\N	VLLoX_WF4F5ZGHHGpBGYEVgeOdBvNJSd	2025-07-10 05:55:55.65	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_z6v28P2UFinb	\N	\N	\N	\N	10	2025-07-10 05:56:00.206	2025-07-10 05:56:00.398411	\N	806mTk1Kjc4ynFHZGqDfCl9GV2ClLFaj	2025-07-10 05:56:00.206	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_cniggim0VO0C	\N	\N	\N	\N	10	2025-07-10 06:06:25.537	2025-07-10 06:06:25.572289	\N	FiB6ZuWK43zIeQmJG3cyS_QnCGP4290F	2025-07-10 06:06:25.537	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_8ZPmaBDw9lbP	\N	\N	\N	\N	10	2025-07-10 05:56:06.622	2025-07-10 05:56:06.657548	\N	kPPx5z-9G_3xh8f2ByDy4hQ233gQxa8M	2025-07-10 05:56:06.622	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_nfySUXxkYXj8	\N	\N	\N	\N	10	2025-07-10 05:56:11.482	2025-07-10 05:56:11.53033	\N	eFpshNaezmcRpGG-9k_bR3aiQwefddhC	2025-07-10 05:56:11.482	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_UQ60oBlpsOkW	\N	\N	\N	\N	10	2025-07-10 05:56:13.019	2025-07-10 05:56:13.055776	\N	W-EpHyIVlFKuJxyHQq7YRUvsHV5EMhkq	2025-07-10 05:56:13.019	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_TYvazxFdPUbO	\N	\N	\N	\N	10	2025-07-10 05:56:14.211	2025-07-10 05:56:14.246881	\N	mRdTbvOtvtwjzcskSx5L9At7b4Gd-IWw	2025-07-10 05:56:14.211	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_dj3Nexo0r99Y	\N	\N	\N	\N	10	2025-07-10 05:56:15.464	2025-07-10 05:56:15.500414	\N	T0XTvWCFiCEVF8KpBaZC40lgTKcU1ayr	2025-07-10 05:56:15.464	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_5u0eKMeNEljO	\N	\N	\N	\N	10	2025-07-10 05:56:28.719	2025-07-10 05:56:28.755256	\N	KRW2G_2U9MvGysqeIjxU-U8-VxzVtZ8w	2025-07-10 05:56:28.719	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_OJrW_RkQueMs	\N	\N	\N	\N	10	2025-07-10 05:56:32.998	2025-07-10 05:56:33.138931	\N	oGQcYAifQ1mHF4zdi-zywKGxFGpsIl8f	2025-07-10 05:56:32.998	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_iBrSaP55QGzg	\N	\N	\N	\N	10	2025-07-10 05:56:45.425	2025-07-10 05:56:45.459747	\N	18AdSf_xchhtJS-iiDfoKXzH09SmWvjE	2025-07-10 05:56:45.425	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_UGjgx0KYpRlx	\N	\N	\N	\N	10	2025-07-10 05:56:46.846	2025-07-10 05:56:46.880721	\N	V4TeGzLj3VlwaVJj2Ayp9PBwXVGmVsXR	2025-07-10 05:56:46.846	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_cyIhvxlgqL5I	\N	\N	\N	\N	10	2025-07-10 05:56:48.167	2025-07-10 05:56:48.202083	\N	IWSZpHHbElYeA9Pqy3DrDC0Egw91vJT-	2025-07-10 05:56:48.167	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_0W1csXzMokOT	\N	\N	\N	\N	10	2025-07-10 06:06:11.344	2025-07-10 06:06:11.379179	\N	p5q1HuBTAEv8C-r9P9yar2lzICBnBOSr	2025-07-10 06:06:11.344	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_DwJuTt_Fx1c_	\N	\N	\N	\N	10	2025-07-10 05:56:53.308	2025-07-10 05:56:53.343193	\N	RXV409W6PTxvbNYqTGDGtOPaAOoLunp-	2025-07-10 05:56:53.308	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_P9MjQ6UnkEB_	\N	\N	\N	\N	10	2025-07-10 05:56:57.855	2025-07-10 05:56:57.902802	\N	T-_Rt1CA3IgVxVYwI2ezv6R2CDzA3zPf	2025-07-10 05:56:57.855	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_fEP0GYTr-AfX	\N	\N	\N	\N	10	2025-07-10 05:57:09.664	2025-07-10 05:57:09.699603	\N	Yg6HtAkGJ5vfWWWxtr66YovsfZ3nTIKt	2025-07-10 05:57:09.664	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_gqbYRB1P1auS	\N	\N	\N	\N	10	2025-07-10 05:57:31.594	2025-07-10 05:57:31.631449	\N	SNmsmHD8K5j3LoBaro8F2LtWTqK62Vww	2025-07-10 05:57:31.594	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_P4H9nAt3ImcB	\N	\N	\N	\N	10	2025-07-10 05:57:32.927	2025-07-10 05:57:32.965491	\N	R9D9q1sWmZZGxnPndn4bafpNpP_4M_wr	2025-07-10 05:57:32.927	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Fksb00xB7wBL	\N	\N	\N	\N	10	2025-07-10 05:57:44.701	2025-07-10 05:57:44.733263	\N	q_JXuTPQfagr1uRTHo_TCLt2wYLOFtNL	2025-07-10 05:57:44.701	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ujGrtxqei4VP	\N	\N	\N	\N	10	2025-07-10 06:06:13.099	2025-07-10 06:06:13.134752	\N	mzQZwtRDBU4lRHcBeEdmfUccftevsNzm	2025-07-10 06:06:13.099	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_P6FxVKTS2H6d	\N	\N	\N	\N	10	2025-07-10 05:57:50.074	2025-07-10 05:57:50.11038	\N	M0faAo_l7cAf5qZtRV96-deoPvnJN39w	2025-07-10 05:57:50.074	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_weSJptwM_HvQ	\N	\N	\N	\N	10	2025-07-10 06:06:14.102	2025-07-10 06:06:14.137666	\N	MakGR363ETjOQF6HbnblY5eYdy_NIe97	2025-07-10 06:06:14.102	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_tXPSwRO_KMk7	\N	\N	\N	\N	10	2025-07-10 05:57:55.811	2025-07-10 05:57:55.845905	\N	L8fATimnO1w8vOsNlaFBS2Pin0bmKpEK	2025-07-10 05:57:55.811	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_kIz5ERllFBZ5	\N	\N	\N	\N	10	2025-07-10 06:06:15.039	2025-07-10 06:06:15.074147	\N	vsETHwqKY3mJa8ka6QRtzrWjf0Ck74p3	2025-07-10 06:06:15.039	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Jc9Mt59o-FC6	\N	\N	\N	\N	10	2025-07-10 05:58:07.746	2025-07-10 05:58:07.782785	\N	j2SmD3dTmkiTajpJv0YCp7MnB0ZzSUjx	2025-07-10 05:58:07.746	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_YJ95z1AdhV5O	\N	\N	\N	\N	10	2025-07-10 06:06:16.184	2025-07-10 06:06:16.219607	\N	kMT8Em_4gGrYiTQINWCDqQGc71UgLTGJ	2025-07-10 06:06:16.184	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ideOA_AyucFi	\N	\N	\N	\N	10	2025-07-10 05:58:27.782	2025-07-10 05:58:27.815785	\N	XkVOQCpCBffKVj4Fgrd3KM996Bja7N-U	2025-07-10 05:58:27.782	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_6ZtSVX1DFxtR	\N	\N	\N	\N	10	2025-07-10 05:58:39.374	2025-07-10 05:58:39.409023	\N	wY8VEZoXKTVKRTf2rx5q8ihDiv361htG	2025-07-10 05:58:39.374	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_eRreCSvJOVuv	\N	\N	\N	\N	10	2025-07-10 05:58:40.606	2025-07-10 05:58:40.638419	\N	uEifrsgTmeuDhsillqI0JjGZb0qnaq2Y	2025-07-10 05:58:40.606	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_8POs1k9k8MDZ	\N	\N	\N	\N	10	2025-07-10 05:58:41.831	2025-07-10 05:58:41.864199	\N	FwtyB-7viKdWfwopGuut3xOe59u6MCdY	2025-07-10 05:58:41.831	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_6BwbE2G49VgX	\N	\N	\N	\N	10	2025-07-10 05:58:43.053	2025-07-10 05:58:43.085017	\N	aHzDVWxf3so4WQiRYcw5pADnge3_PXZh	2025-07-10 05:58:43.053	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Dx_cipO06AXp	\N	\N	\N	\N	10	2025-07-10 05:58:44.393	2025-07-10 05:58:44.423727	\N	JHsBqXRpGr95BswJ04VDy3gQYJZq4gjT	2025-07-10 05:58:44.393	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_iCh76VvLF9W7	\N	\N	\N	\N	10	2025-07-10 05:58:45.711	2025-07-10 05:58:45.743207	\N	riFOrIHaq5KGo-XY6L2Qp_aAz2GzzF9y	2025-07-10 05:58:45.711	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_6vJYOiCVheDJ	\N	\N	\N	\N	10	2025-07-10 05:58:47.262	2025-07-10 05:58:47.29574	\N	kagbvmz0rGLCDumjxA_QZVVWtuXXWg3K	2025-07-10 05:58:47.262	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_5EKBHWHIJ4Tq	\N	\N	\N	\N	10	2025-07-10 05:58:48.479	2025-07-10 05:58:48.512571	\N	rGYs2EUbxSW9JqWpHhfZcLnv289HMf3L	2025-07-10 05:58:48.479	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_HT6eok_ZGhie	\N	\N	\N	\N	10	2025-07-10 05:58:53.458	2025-07-10 05:58:53.49045	\N	Rqi1DG87gd_SiSdyMOZd3425iMbxFXUa	2025-07-10 05:58:53.458	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_dC1HN1bqbEfX	\N	\N	\N	\N	10	2025-07-10 05:58:58.038	2025-07-10 05:58:58.222076	\N	_oR7hwKHcf7pQhwM37xcU1vYkTPKrm5b	2025-07-10 05:58:58.038	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ARU_pYFbeDGG	\N	\N	\N	\N	10	2025-07-10 05:58:59.967	2025-07-10 05:59:00.000052	\N	F-B9421hW7ohTzdCYO0aJ4_05VoyuyVP	2025-07-10 05:58:59.967	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_wnIA8v206dJ8	\N	\N	\N	\N	10	2025-07-10 06:06:17.278	2025-07-10 06:06:17.313473	\N	giXH47a5lB3ijI47L5AYMSYqJiWt1tDz	2025-07-10 06:06:17.278	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_aaL_M4F43AST	\N	\N	\N	\N	10	2025-07-10 06:06:18.316	2025-07-10 06:06:18.351558	\N	7BMZjbFPBjZy-bU6hYXWvvQnbURtQ27s	2025-07-10 06:06:18.316	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_xikPCHZTSrjb	\N	\N	\N	\N	10	2025-07-10 06:06:19.387	2025-07-10 06:06:19.422414	\N	V1VbZDg1ic1X8SiKs3QtPdyFVSLs-Fn6	2025-07-10 06:06:19.387	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_P15GRwkOkYW4	\N	\N	\N	\N	10	2025-07-10 06:06:20.572	2025-07-10 06:06:20.606043	\N	x_mdVRz4g85k2DtSySFwV8J8XpFE9OgM	2025-07-10 06:06:20.572	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_4NsHmM1PHi5_	\N	\N	\N	\N	10	2025-07-10 06:06:21.493	2025-07-10 06:06:21.528287	\N	eUC7C4mbO104CusLMVhCUgLo4V5ctCQ6	2025-07-10 06:06:21.493	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_LSCvLMI53EDM	\N	\N	\N	\N	10	2025-07-10 06:06:22.471	2025-07-10 06:06:22.506321	\N	z16pDfMwK0mjZhH78SD3Krw6Roman3AD	2025-07-10 06:06:22.471	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_2rnRN6qkmOG_	\N	\N	\N	\N	10	2025-07-10 06:06:23.873	2025-07-10 06:06:23.90697	\N	2CFZMRs8RS0v4lUJNsT-YnOOyRh1Hiq2	2025-07-10 06:06:23.873	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_aNOgPS2b0w5M	\N	\N	\N	\N	10	2025-07-10 06:06:24.734	2025-07-10 06:06:24.770741	\N	Uf1mvxRlIF_j-d8hUFQcUvyCikELZ6zA	2025-07-10 06:06:24.734	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_R_TaVdU1kjoq	\N	\N	\N	\N	10	2025-07-10 06:06:26.203	2025-07-10 06:06:26.238483	\N	y15VEbV-UA_lyaEkNJ8t-dSfs3dwuE5p	2025-07-10 06:06:26.203	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_wG_cUVrjnlhH	\N	\N	\N	\N	10	2025-07-10 06:06:26.91	2025-07-10 06:06:26.945881	\N	DO8xY1K4r-wuUrwgUBUcZR-Yt8jGcTho	2025-07-10 06:06:26.91	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_B_-JtCnev4Nm	\N	\N	\N	\N	10	2025-07-10 06:06:27.624	2025-07-10 06:06:27.66218	\N	WUFRrmUOEoPOVOrF2q47Elc47Y0LRd92	2025-07-10 06:06:27.624	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_xRpGBCTe-pm4	\N	\N	\N	\N	10	2025-07-10 06:06:28.855	2025-07-10 06:06:28.890048	\N	wth8ANPI_qq-FhEf5EIQTyYQwwumc4ei	2025-07-10 06:06:28.855	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ZjclHrNddNmZ	\N	\N	\N	\N	10	2025-07-10 06:06:29.74	2025-07-10 06:06:29.776929	\N	MrrVN7VhYsGcpaQepdlUTQqDu9NM0W4u	2025-07-10 06:06:29.74	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_-_7oqzBVi2Yw	\N	\N	\N	\N	10	2025-07-10 06:06:30.617	2025-07-10 06:06:30.650939	\N	NDLtjfx0noB-5_qOT9VtFJBsnHDJwzQH	2025-07-10 06:06:30.617	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_9Zl9eLp3PRxk	\N	\N	\N	\N	10	2025-07-10 06:06:31.445	2025-07-10 06:06:31.47962	\N	qYYEGD2g4CA77RtGrksl6Li5cnc1blKX	2025-07-10 06:06:31.445	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_czp8rnYMRIh1	\N	\N	\N	\N	10	2025-07-10 06:06:32.294	2025-07-10 06:06:32.329752	\N	83goJoHGQ1BoBqxCnnYGtNXYvwKQK8i9	2025-07-10 06:06:32.294	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_jLhUijTaYIqF	\N	\N	\N	\N	10	2025-07-10 06:06:33.097	2025-07-10 06:06:33.133322	\N	FNELdc4m1Y4-uYnwEiJP_KWGwD7MXbe0	2025-07-10 06:06:33.097	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_3dMMJrOPYtva	\N	\N	\N	\N	10	2025-07-10 06:06:34.594	2025-07-10 06:06:34.628912	\N	8RZyRlMCqJTc4M2P9-UMhI-tr1NLRo7S	2025-07-10 06:06:34.594	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_yWTxUiTEmhUp	\N	\N	\N	\N	10	2025-07-13 14:03:24.273	2025-07-13 14:03:24.480921	\N	test_session_1752415403801	2025-07-13 14:03:24.471	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_K7jAc514iBTP	\N	\N	\N	\N	10	2025-07-13 14:03:24.718	2025-07-13 14:03:24.910947	\N	random_session_kwhepi	2025-07-13 14:03:24.718	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_yypIOL2mjlYc	\N	\N	\N	\N	10	2025-07-10 06:06:35.822	2025-07-10 06:06:35.856066	\N	WJoH1KSVzf6SgejxHbgTa-6CDWEPVKB6	2025-07-10 06:06:35.822	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_9Vm8MW-wKwdu	\N	\N	\N	\N	10	2025-07-10 06:06:36.832	2025-07-10 06:06:36.867566	\N	torZoW86WPgBOnpIvL4EY8DDk8C9bJNs	2025-07-10 06:06:36.832	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ENRnr5g3ahRv	\N	\N	\N	\N	10	2025-07-10 06:06:37.911	2025-07-10 06:06:37.946583	\N	sNkWmhCOTL6NAMjN4VV5YLe2XKNd6QHz	2025-07-10 06:06:37.911	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_z3z-Ef-VYTIm	\N	\N	\N	\N	10	2025-07-10 06:06:38.994	2025-07-10 06:06:39.033011	\N	YlCBl0icPL8ZSCHXF9pbqPRsRXu9IeR4	2025-07-10 06:06:38.994	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_p7ihHmxwnNg_	\N	\N	\N	\N	10	2025-07-10 06:06:39.921	2025-07-10 06:06:39.95612	\N	02VrtsfTNs8nWD3UbJ3co9Tszpm4VlEH	2025-07-10 06:06:39.921	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_bCJAtB2JAoc9	\N	\N	\N	\N	10	2025-07-10 06:06:40.798	2025-07-10 06:06:40.838925	\N	2ShwG9lFH2H1pyENmFZyzq6xb1ueN208	2025-07-10 06:06:40.798	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_4nw9PcVDxjz9	\N	\N	\N	\N	10	2025-07-10 06:06:41.627	2025-07-10 06:06:41.662676	\N	Klw3uHtMXGeAWgNzbPMW5_3dzo9f7tWT	2025-07-10 06:06:41.627	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_O2N-C0_nRXBC	\N	\N	\N	\N	10	2025-07-10 06:06:42.354	2025-07-10 06:06:42.390997	\N	xa02RZKwrgPXgUuqu9G2ejWISAb58ihP	2025-07-10 06:06:42.354	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_h7AYqdPtGLZC	\N	\N	\N	\N	10	2025-07-10 06:06:43.217	2025-07-10 06:06:43.250967	\N	mASTfMJ8CZbijTPzvC34J-XnEXAc-yCA	2025-07-10 06:06:43.217	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_SGrZqNHZ6R9M	\N	\N	\N	\N	10	2025-07-10 06:06:43.894	2025-07-10 06:06:43.929711	\N	RONYas1Mt22Q_g23SrMZ1yKvY5wyamrq	2025-07-10 06:06:43.894	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_x-d5CAKRB93q	\N	\N	\N	\N	10	2025-07-10 06:06:44.761	2025-07-10 06:06:44.795981	\N	RvGuDef8UjNGoJvJhFP4Jcb4Pf7GsOsj	2025-07-10 06:06:44.761	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_4WgTIHjiKxGo	\N	\N	\N	\N	10	2025-07-10 06:06:45.788	2025-07-10 06:06:45.824918	\N	BbMtOL1RE01ofIS7s7cJHDiSXLjKvsay	2025-07-10 06:06:45.788	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_XEMX-gqSjpLn	\N	\N	\N	\N	10	2025-07-10 06:06:46.504	2025-07-10 06:06:46.540406	\N	DHAQ7SNOeKMf8xQlCAVqmdwiAfoATOtJ	2025-07-10 06:06:46.504	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_j3H2tTPFiTY4	\N	\N	\N	\N	10	2025-07-10 06:06:47.618	2025-07-10 06:06:47.654558	\N	32vtBErXBc8f0SO72Im43OCAaPPhYz94	2025-07-10 06:06:47.618	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_kHitEsHXOsx3	\N	\N	\N	\N	10	2025-07-10 06:06:48.434	2025-07-10 06:06:48.469938	\N	oY6EOASPlxqg_6n5dA0xoLGnvYAR9BN0	2025-07-10 06:06:48.434	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_iQamebn7K03c	\N	\N	\N	\N	10	2025-07-10 06:06:49.238	2025-07-10 06:06:49.273812	\N	t7nDI_2yiIL3TVsSdo-Ew0KAGuCLB8NI	2025-07-10 06:06:49.238	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_wa1gGSs58xFa	\N	\N	\N	\N	10	2025-07-10 06:06:50.091	2025-07-10 06:06:50.12597	\N	U-Ej2utpOOBMLb4_REGZUaYDKvTA628l	2025-07-10 06:06:50.091	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_k-T6bEJ0gJoC	\N	\N	\N	\N	10	2025-07-10 06:06:51.098	2025-07-10 06:06:51.133214	\N	AmZtUFGr1xqsFVhssHALpAFGJjd8ptS0	2025-07-10 06:06:51.098	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_5t17EzJBsrpo	\N	\N	\N	\N	10	2025-07-10 06:06:52.04	2025-07-10 06:06:52.075112	\N	DPAPR-KNfjBq2xBPQTadw7Iy0LCzp-Ay	2025-07-10 06:06:52.04	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_GvzPu7RZ982P	\N	\N	\N	\N	10	2025-07-10 08:15:20.045	2025-07-10 08:15:20.080068	\N	Rw1nGclYHtc7ceUJ00z5DZ6k4KXMcigB	2025-07-10 08:15:20.045	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ggZHtxhpOlku	\N	\N	\N	\N	10	2025-07-10 08:24:09.424	2025-07-10 08:24:09.458524	\N	KOJujTkf7fn8UQIiWfgZMWYI9iPeGqHK	2025-07-10 08:24:09.424	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_5ftJoJYgAHUB	\N	\N	\N	\N	10	2025-07-10 08:27:01.579	2025-07-10 08:27:01.615685	\N	P1_LdgPbi93A_mJTjewUE3HMlVEI7hoz	2025-07-10 08:27:01.579	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_N40lHkcaJdve	\N	\N	\N	\N	10	2025-07-10 09:26:10.617	2025-07-10 09:26:10.652805	\N	36SDtlrU-USCJBf5cyXMYE-Qr5zQurA5	2025-07-10 09:26:10.617	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_SGTqm2GXnv76	\N	\N	\N	\N	10	2025-07-10 10:01:03.548	2025-07-10 10:01:03.582787	\N	nCvFetukphRplqwdtLJtFp4_GeG5jdzs	2025-07-10 10:01:03.548	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_cASqpMTmzDBy	\N	\N	\N	\N	10	2025-07-10 10:19:11.173	2025-07-10 10:19:11.207213	\N	-YEG5_JBh9XT4Wy0jS33dUJOnkf-quFk	2025-07-10 10:19:11.173	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_JcUUEr7ftG70	\N	\N	\N	\N	10	2025-07-10 10:21:43.32	2025-07-10 10:21:43.353492	\N	D_t2WPf8bbIwX7cCsUyx5Qj1d3KbWD8l	2025-07-10 10:21:43.32	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_EYSZ04dNidAc	\N	\N	\N	\N	10	2025-07-10 11:26:57.106	2025-07-10 11:26:57.141809	\N	KogIZpv6xW7jAfxsKioCjm5h_4e4KpIP	2025-07-10 11:26:57.106	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest__Q9vaWT0T0NT	\N	\N	\N	\N	10	2025-07-10 11:47:47.354	2025-07-10 11:47:47.389209	\N	hEvPrtfjhBvKCKtKfPs7-J8scpdcvQ_X	2025-07-10 11:47:47.354	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_-PJxID3dieWk	\N	\N	\N	\N	10	2025-07-10 11:56:07.984	2025-07-10 11:56:08.018932	\N	NA6dCFZFX_xrw5KDkqEn3uPHWbZyJxq9	2025-07-10 11:56:07.984	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_2Uly1e09WScq	\N	\N	\N	\N	10	2025-07-10 12:02:23.052	2025-07-10 12:02:23.086527	\N	FhVDxOOWJt6Us8Fupr3zNqCLDKAjeRS2	2025-07-10 12:02:23.052	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_TXAxT4qwEcnh	\N	\N	\N	\N	10	2025-07-10 10:42:40.408	2025-07-10 10:42:40.443721	\N	4KRoSmO5NwAjgiyneDGYT0l2vseYZWm0	2025-07-10 10:42:43.202	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest__DLaxuVvX_y2	\N	\N	\N	\N	10	2025-07-10 10:49:29.145	2025-07-10 10:49:29.180254	\N	tLbPAya58e3WDEugbHD72eNakk72Olzn	2025-07-10 10:49:29.145	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_GUQgmeVJ8SVy	\N	\N	\N	\N	10	2025-07-10 10:49:30.052	2025-07-10 10:49:30.086899	\N	YKETloq63Gq8k_amLx7xGGQ2h9X3iRvd	2025-07-10 10:49:30.052	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_jEu42hmaZ2jf	\N	\N	\N	\N	10	2025-07-10 05:59:07.347	2025-07-10 05:59:07.380023	\N	3F4V0HQFXLhF9dNdNFz9xqVw1XsCPZlT	2025-07-10 06:08:13.623	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_xdw5ZHpgrOfx	\N	\N	\N	\N	10	2025-07-10 07:14:36.073	2025-07-10 07:14:36.105419	\N	bstycTLulcVm_Jx3L5z07b_4Gb-ZrIme	2025-07-10 07:14:36.073	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_acNdlnAKVOr5	\N	\N	\N	\N	10	2025-07-10 10:49:30.306	2025-07-10 10:49:30.341968	\N	ISrplcPV5Mjw64ZEVK-NZuUpuDuvBMGs	2025-07-10 10:49:30.306	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_1W11w9xDGwYu	\N	\N	\N	\N	10	2025-07-10 10:49:32.683	2025-07-10 10:49:32.718605	\N	mqWIMV8go9P0yXPQb4uDXHuaS3QltGQ7	2025-07-10 10:49:32.683	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_uMGTn3d0ZfoZ	\N	\N	\N	\N	10	2025-07-10 10:49:36.171	2025-07-10 10:49:36.204644	\N	IANb0kUWwHX0DikdUuimieFZ6qAhi9gI	2025-07-10 10:49:36.171	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_RbqzBvQy_BG-	\N	\N	\N	\N	10	2025-07-10 10:49:37.077	2025-07-10 10:49:37.112214	\N	VDbR0UeXiIzjYu_Wvk9Q1I_oyxTwS4Aa	2025-07-10 10:49:37.077	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_nwAQ535eS--d	\N	\N	\N	\N	10	2025-07-10 10:49:38.676	2025-07-10 10:49:38.711188	\N	nKgna1Pq7NpUo-4JSCDKqViuS0SC8Q7b	2025-07-10 10:49:38.676	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_pk6gViq1si_O	\N	\N	\N	\N	10	2025-07-10 10:49:38.678	2025-07-10 10:49:38.712677	\N	lKEWja7UYHGlRIbBEe244PRJOpTDnBeq	2025-07-10 10:49:38.678	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_o3EFje0Ezja7	\N	\N	\N	\N	10	2025-07-10 08:30:34.092	2025-07-10 08:30:34.127659	\N	Ch1jh6ifsZLwGB-5uABZQrIQtk8EFUtF	2025-07-10 08:30:37.398	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_6TaaxEn4Wpe1	\N	\N	\N	\N	10	2025-07-10 08:51:40.509	2025-07-10 08:51:40.542246	\N	os5ogSIJVWYDRbJRxyUyJ-WPO1vmtIaS	2025-07-10 08:51:40.509	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_SBuwQ--_-Ljc	\N	\N	\N	\N	10	2025-07-10 07:27:20.682	2025-07-10 07:27:20.717445	\N	E1GYi-u29BhzcmCkh2p7YFypVeA0ceQ3	2025-07-10 07:27:28.839	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_8-WxaRMXk6M3	\N	\N	\N	\N	10	2025-07-10 09:04:58.117	2025-07-10 09:04:58.152749	\N	H99aSmRWT02XKFmEeEkmH96VcVE-sX1B	2025-07-10 09:04:58.117	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_iVZNKZiNh2VA	\N	\N	\N	\N	10	2025-07-10 09:12:27.704	2025-07-10 09:12:27.73876	\N	zD7SrxTo7EAowcJNkX9rSKpVjCtUK50D	2025-07-10 09:12:27.704	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_oaj8wfgmpk6U	\N	\N	\N	\N	10	2025-07-10 07:30:24.75	2025-07-10 07:30:24.785841	\N	vROeDJLejv_3Gpvwbec3y_bmORBzs_ZF	2025-07-10 07:30:24.75	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_8oWd0LFchX5q	\N	\N	\N	\N	10	2025-07-10 12:46:59.087	2025-07-10 12:46:59.121644	\N	R39qcWLuw41PVb-GuqHchraSSvAY-Dsb	2025-07-10 12:46:59.087	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_BoICCcpA90Rs	\N	\N	\N	\N	10	2025-07-10 11:12:55.531	2025-07-10 11:12:55.563691	\N	rQQLp7SV61Cs2bc95oMaX15TuZ6vSc_a	2025-07-10 11:12:55.531	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_NJsTIEiqpqUB	\N	\N	\N	\N	10	2025-07-10 12:46:59.471	2025-07-10 12:46:59.506356	\N	mgoegqOx56-nVWGiUL7QAYOaijF-Is-l	2025-07-10 12:46:59.471	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Fcln8MiWrIXn	\N	\N	\N	\N	10	2025-07-10 12:46:59.847	2025-07-10 12:46:59.880793	\N	sW1hm4igfJzDi3Iwk3uD1mUye1XCslpu	2025-07-10 12:46:59.847	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_xmFtWHknDIj7	\N	\N	\N	\N	10	2025-07-10 14:56:09.499	2025-07-10 14:56:09.53735	\N	FL-JiUiovk3uDE27479AS7Ot1ZqPF-CB	2025-07-10 14:56:09.499	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ae1LFzAAq8FQ	\N	\N	\N	\N	10	2025-07-10 15:14:04.342	2025-07-10 15:14:04.377353	\N	FVROsA0fqtHM1qxrvJgvED0i_rf40CCp	2025-07-10 15:14:04.342	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_3Bt232oK9V8N	\N	\N	\N	\N	10	2025-07-10 15:26:47.818	2025-07-10 15:26:47.851962	\N	rbI7CFvWpj_1b_8IZSV0lKSOwEjy357V	2025-07-10 15:26:47.818	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_N2bBcJur4tgV	\N	\N	\N	\N	10	2025-07-10 15:45:36.717	2025-07-10 15:45:36.751599	\N	vUYatmWykmyHzAmxof_3rcaYCyjFUsJY	2025-07-10 15:45:36.717	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_UOIJ21FQonSZ	\N	\N	\N	\N	10	2025-07-10 15:53:51.497	2025-07-10 15:53:51.531952	\N	M6Z_3jjvqreeqNMqSNEpeu7QdKtYZbHx	2025-07-10 15:53:51.497	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_J66s6tvaEBbD	\N	\N	\N	\N	10	2025-07-10 15:55:28.591	2025-07-10 15:55:28.625292	\N	cO3kJn19-ot8QM6RrBhAJLmnhIdh3RKx	2025-07-10 15:55:28.591	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_m3DnVlDdiB20	\N	\N	\N	\N	10	2025-07-10 16:28:01.238	2025-07-10 16:28:01.273565	\N	msi08Ac98l7CM2JjXO6hbNBC37fhajXY	2025-07-10 16:28:01.238	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_yQ4HGGLOIR4b	\N	\N	\N	\N	10	2025-07-10 16:28:08.887	2025-07-10 16:28:08.923306	\N	oo9TRNCGpwehOZmah6fdT0JMXTpTA4Kh	2025-07-10 16:28:08.887	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_dKynj-CiRHA9	\N	\N	\N	\N	10	2025-07-10 16:28:32.204	2025-07-10 16:28:32.238147	\N	dd5LtMIk5HWN-ID6ka04V-exkxfKx-sk	2025-07-10 16:28:32.204	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_1LtWALMbl2NO	\N	\N	\N	\N	10	2025-07-10 16:28:45.428	2025-07-10 16:28:45.463167	\N	grxkyrodsPXcpRg1r5emZ29mxAqLTtbk	2025-07-10 16:28:45.428	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_s3Co7LoYOgrh	\N	\N	\N	\N	10	2025-07-10 16:41:33.216	2025-07-10 16:41:33.251194	\N	xqDkjlw43U43BruBqJNXsQfOhR9v_CnO	2025-07-10 16:41:33.216	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_G7H0B6iXtouL	\N	\N	\N	\N	10	2025-07-10 16:41:49.436	2025-07-10 16:41:49.470511	\N	lzmGMNRfqXuTR76SX4ZEghDCXYlvydsh	2025-07-10 16:41:49.436	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_lDU7MCp8xMqy	\N	\N	\N	\N	10	2025-07-10 16:42:28.532	2025-07-10 16:42:28.566669	\N	kHkQU2HlqWcg-UPjT4Rmsbkj5Pyt8qTJ	2025-07-10 16:42:28.532	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_I0Q01yqsysTE	\N	\N	\N	\N	10	2025-07-10 16:42:46.314	2025-07-10 16:42:46.347894	\N	KylSfbhEtRWxRG0w71E8M4htKkKqCpoL	2025-07-10 16:42:46.314	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ZGmmTHQtHH5F	\N	\N	\N	\N	10	2025-07-10 17:47:54.731	2025-07-10 17:47:54.766343	\N	jAskDJWZifRzULJ2tTyL_8n2-9l-33st	2025-07-10 17:47:54.731	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_980awl0f5o3N	\N	\N	\N	\N	10	2025-07-10 17:47:56.982	2025-07-10 17:47:57.017764	\N	YAgdquSSgM9TqvS-3XKlbJZT1qv9un75	2025-07-10 17:47:56.982	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_HIvCSp9mb7ss	\N	\N	\N	\N	10	2025-07-10 17:43:30.666	2025-07-10 17:43:30.76936	\N	2pBGSwi-ErtJD9HiDmAdD4-EB575h-XH	2025-07-11 12:15:09.057	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_tdEwB-74O_4e	\N	\N	\N	\N	10	2025-07-10 17:48:15.28	2025-07-10 17:48:15.315758	\N	bvAHeqJYYLbG4ApXrcpzDL9Ytc4z3A2K	2025-07-10 17:48:15.28	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_KaIDPIrBwJ2z	\N	\N	\N	\N	10	2025-07-10 12:47:29.573	2025-07-10 12:47:29.60774	\N	D99biD9H4bOsllP9qnX2YNMdZletBX3-	2025-07-11 12:11:28.889	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_8FGZiViPqnHz	\N	\N	\N	\N	10	2025-07-10 17:30:08.273	2025-07-10 17:30:08.30762	\N	-32xQ4A6AyMymXKfLoBL7xOvjMExH7BE	2025-07-10 17:30:08.273	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_oTMQnOC8WENh	\N	\N	\N	\N	10	2025-07-10 17:43:31.388	2025-07-10 17:43:31.472813	\N	rD9Hm5x1lYtTLRchNgRd-wzEdEhLpodA	2025-07-10 17:43:31.388	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Co5mLICFcqJm	\N	\N	\N	\N	10	2025-07-10 17:48:20.983	2025-07-10 17:48:21.017728	\N	yLn6XUELZPbpban5o3mLRPL_mDjan0bd	2025-07-10 17:48:20.983	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_5NxB1FYaeFGC	\N	\N	\N	\N	10	2025-07-10 18:04:35.501	2025-07-10 18:04:35.536274	\N	m4l58fTT57vYCRnWWuIafKMPDjd5XKQ7	2025-07-11 01:11:10.044	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Ha4tQjmQbvpb	\N	\N	\N	\N	10	2025-07-10 17:47:00.375	2025-07-10 17:47:00.41036	\N	phOdzmNaWpDY8HLKfYWg5NLfTzYVqHP6	2025-07-10 17:47:00.375	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_zoyfZh04x7zd	\N	\N	\N	\N	10	2025-07-10 14:18:33.607	2025-07-10 14:18:33.640227	\N	FyBwzds5DOGZiCmM85Mreh_1Qmt01dJi	2025-07-10 14:18:33.607	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Nn5jCBhBiMHS	\N	\N	\N	\N	10	2025-07-10 14:18:35.337	2025-07-10 14:18:35.37046	\N	-A6nHMxVXadQkQVIxYDFeLzycC0nFE8B	2025-07-10 14:18:35.337	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_IbPYiD_U0htt	\N	\N	\N	\N	10	2025-07-10 14:18:49.434	2025-07-10 14:18:49.467669	\N	B6XcDQtfEuqOIvQmCrTwHVEa1ErqTvOe	2025-07-10 14:18:49.434	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_eQ32mr5PtR_W	\N	\N	\N	\N	10	2025-07-10 14:18:54.118	2025-07-10 14:18:54.153723	\N	7zHJAoOPXBSySJ7KFFGiO42AtqD026wL	2025-07-10 14:18:54.118	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_WF9kKWmb-D0A	\N	\N	\N	\N	10	2025-07-10 17:46:14.078	2025-07-10 17:46:14.112794	\N	gAzt2Lzt1EfoXppwfbMC7RYi0Od6KNbq	2025-07-10 17:46:14.078	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_fPoFwlB7UU1y	\N	\N	\N	\N	10	2025-07-10 14:42:57.632	2025-07-10 14:42:57.666448	\N	0hJxGEk91NrFrEf9F8PZgvf-OUq2_Skg	2025-07-10 14:42:57.632	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_4CdQgvv69_Ed	\N	\N	\N	\N	10	2025-07-10 12:54:41.038	2025-07-10 12:54:41.072878	\N	csCKdsH6ZCfcYbVFCVUTu3ZZjpfv1r48	2025-07-10 19:23:00.252	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_w_C9QOQrCSxV	\N	\N	\N	\N	10	2025-07-10 18:33:42.984	2025-07-10 18:33:43.018904	\N	7NpDIlQ-82MyCIuYEkHhzK6_yNPjASC9	2025-07-10 22:27:20.369	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Z1mZvvRwZZf1	\N	\N	\N	\N	10	2025-07-10 21:08:35.695	2025-07-10 21:08:35.730486	\N	62TUbYvoB66DMskhyQyJtuHkSzhu3r38	2025-07-10 21:08:35.695	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_vreRFaq0garl	\N	\N	\N	\N	10	2025-07-10 19:04:45.446	2025-07-10 19:04:45.48098	\N	4japaB6IOhI73dwhnW33ePVBjjS5qocB	2025-07-10 19:04:45.446	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_I9h7y95HvCSc	\N	\N	\N	\N	10	2025-07-10 19:04:45.757	2025-07-10 19:04:45.793236	\N	X88RFo-RpXEApb9LXits10qLHiEW4EaF	2025-07-10 19:04:45.757	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest__s8MfrWJfYcS	\N	\N	\N	\N	10	2025-07-10 19:09:19.972	2025-07-10 19:09:20.006516	\N	nyjsnBx7vzViKp9uQ1RejQZiCPT31jtU	2025-07-10 19:09:19.972	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Mas4Yn-j2JQj	\N	\N	\N	\N	10	2025-07-10 19:10:29.926	2025-07-10 19:10:29.958445	\N	uVNNx0C0NQrNoQxlN-wm1AoERMBeTzTl	2025-07-10 19:10:29.926	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_DRbGEW2Mmjlq	\N	\N	\N	\N	10	2025-07-10 19:13:18.803	2025-07-10 19:13:18.83425	\N	8MQEg5ljPYXoBpxjmyIayk_Tfb54vKQx	2025-07-10 19:13:18.803	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_zYsftr25IQVo	\N	\N	\N	\N	10	2025-07-10 19:37:29.523	2025-07-10 19:37:29.558635	\N	SO9YknBVyWLy_Wd_YciQB-iYZ4ECn66f	2025-07-10 19:37:29.523	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_2Qi-2KPrvfF4	\N	\N	\N	\N	10	2025-07-10 19:37:30.93	2025-07-10 19:37:30.965757	\N	cqiF7nBmoAC6m49T7qeU5X8AJjRHiTmM	2025-07-10 19:37:30.93	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_kwvG5S2hQxz9	\N	\N	\N	\N	10	2025-07-10 19:37:32.272	2025-07-10 19:37:32.307897	\N	S-Gi3rak6tfXNgdEX6W1EopXdtU3YuyU	2025-07-10 19:37:32.272	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_IYsHBF5FE3W2	\N	\N	\N	\N	10	2025-07-10 19:37:33.166	2025-07-10 19:37:33.202146	\N	k2-n8DmBvR52CJCY7460eOTLCPK6ZXaE	2025-07-10 19:37:33.166	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_200jZdYHwped	\N	\N	\N	\N	10	2025-07-10 19:37:34.416	2025-07-10 19:37:34.45018	\N	gOFK-l58ZwJAM83K0EA4oF5yXzvuwoOU	2025-07-10 19:37:34.416	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_DG6QXNSLyy9Q	\N	\N	\N	\N	10	2025-07-10 19:37:35.674	2025-07-10 19:37:35.708913	\N	nXCWqDkBvmsODvnDNHzfczt8ql2mP1G7	2025-07-10 19:37:35.674	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_-YPgLIelhApe	\N	\N	\N	\N	10	2025-07-10 19:37:51.601	2025-07-10 19:37:51.636802	\N	OlxVS5C2bOb3hoAn7dCsqnRqh1Dt0-W5	2025-07-10 19:37:51.601	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_iwO1A3GChPZ7	\N	\N	\N	\N	10	2025-07-10 19:37:56.276	2025-07-10 19:37:56.309975	\N	u9dm9wS23YNR2qR3g_ydMTUuKOUaXl6x	2025-07-10 19:37:56.276	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_b4f9nzoz7qJK	\N	\N	\N	\N	10	2025-07-10 19:37:57.198	2025-07-10 19:37:57.49343	\N	bcsLw7B4A_c7TfueV8y6azIXt9dRLKli	2025-07-10 19:37:57.198	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_0o0Fzd_-Lpo4	\N	\N	\N	\N	10	2025-07-10 19:37:58.292	2025-07-10 19:37:58.325773	\N	vHwdg8YeMM-aSHHCv3Yh7V04idQnb7wl	2025-07-10 19:37:58.292	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_YIjHorXHErzY	\N	\N	\N	\N	10	2025-07-10 19:37:59.382	2025-07-10 19:37:59.41453	\N	nD_ULcBbRaJyBaS1PaI-4eLMLZxakjIE	2025-07-10 19:37:59.382	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_SfHXoZozf7eu	\N	\N	\N	\N	10	2025-07-10 19:38:00.61	2025-07-10 19:38:00.644284	\N	h1p2ln5msL9WeEgMOPFpE93Hj7oPGcQY	2025-07-10 19:38:00.61	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_5WVicABbwf3H	\N	\N	\N	\N	10	2025-07-10 19:38:01.932	2025-07-10 19:38:01.974543	\N	8myNfXpo0T3fh88p0wmUmXSMLHWQ07fQ	2025-07-10 19:38:01.932	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_bGL_WBTZk7BA	\N	\N	\N	\N	10	2025-07-10 19:38:02.811	2025-07-10 19:38:02.846392	\N	EfjJoDU_Fw2O2pc4F2UFWpUOKOBrLv6X	2025-07-10 19:38:02.811	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_TKE5FZ07wD1G	\N	\N	\N	\N	10	2025-07-10 19:38:04.336	2025-07-10 19:38:04.370087	\N	Cg7C8xPBkyun_-4T-Wd7oD8U27FFdZW1	2025-07-10 19:38:04.336	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_YRyfG85G3KIx	\N	\N	\N	\N	10	2025-07-10 19:38:05.165	2025-07-10 19:38:05.199812	\N	9KtTnv6It_QUhcCpQ5LW3ouuyGbHFnSd	2025-07-10 19:38:05.165	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_hLJvbhw54DBo	\N	\N	\N	\N	10	2025-07-10 19:38:06.408	2025-07-10 19:38:06.442262	\N	ku8nHYV-mCvjytrrqp-03rvR2MS8sReB	2025-07-10 19:38:06.408	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_GA5btpMtx-cc	\N	\N	\N	\N	10	2025-07-10 19:38:07.25	2025-07-10 19:38:07.285051	\N	jtAH6vHSNsrX6_zWhuURjHRMRFOeNfs7	2025-07-10 19:38:07.25	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_SyhUlce8aMhP	\N	\N	\N	\N	10	2025-07-10 19:38:08.351	2025-07-10 19:38:08.383239	\N	IM1hfHk2GUNuePMDBTy0OFIqejjw6MAR	2025-07-10 19:38:08.351	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_u3tS0WG03mGC	\N	\N	\N	\N	10	2025-07-10 19:38:09.179	2025-07-10 19:38:09.211597	\N	DHK3jfZTF7GLbMS-EynBhbA_yAUF34LB	2025-07-10 19:38:09.179	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_HVECfr8bq39E	\N	\N	\N	\N	10	2025-07-10 19:38:10.318	2025-07-10 19:38:10.58291	\N	ZqemsiKM4agNBWRPGKa2uY5Lyj-tvCwP	2025-07-10 19:38:10.318	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_29lI5whxnZam	\N	\N	\N	\N	10	2025-07-10 19:38:11.804	2025-07-10 19:38:11.839332	\N	ivW6qOdFY4gRk3ALb5tmD53J9JyQURwl	2025-07-10 19:38:11.804	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_EYz5FPUEXf5K	\N	\N	\N	\N	10	2025-07-10 19:38:12.597	2025-07-10 19:38:12.632584	\N	8B5Kft6Zliu4J1wlJtOfB6HRVLj_2C-0	2025-07-10 19:38:12.597	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_LBfPt4Cj0rq3	\N	\N	\N	\N	10	2025-07-10 19:38:13.808	2025-07-10 19:38:13.842869	\N	HQBplT8LlFddqXE3uD0BiDK2mH2ng0_m	2025-07-10 19:38:13.808	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_-Lj6W7Seg1kC	\N	\N	\N	\N	10	2025-07-10 19:38:14.499	2025-07-10 19:38:14.533187	\N	Fv4k9TABXHKByhED9e9UHqJah816SIVQ	2025-07-10 19:38:14.499	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Y7vRESWBgzUZ	\N	\N	\N	\N	10	2025-07-10 19:38:15.304	2025-07-10 19:38:15.337826	\N	bzSUCvHGGurExTJpP6rjFBe-_52z1Cfi	2025-07-10 19:38:15.304	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_fU-xquhN28EO	\N	\N	\N	\N	10	2025-07-10 19:38:17.019	2025-07-10 19:38:17.071965	\N	zi6Fum43c8mN8Va7bDxcqL78XcI_fTqS	2025-07-10 19:38:17.019	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_PaAlGIBlSmqw	\N	\N	\N	\N	10	2025-07-10 19:38:18.712	2025-07-10 19:38:18.746854	\N	skDDyaAQbv67jw-snWNVfRCvX0gnJIMJ	2025-07-10 19:38:18.712	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_AsZ1oppsFnTJ	\N	\N	\N	\N	10	2025-07-10 19:38:19.759	2025-07-10 19:38:19.793094	\N	ifkuZJqhzUvCmyz3Vpfpn5cJoGwQ00Tk	2025-07-10 19:38:19.759	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_5EwEtKWAbolP	\N	\N	\N	\N	10	2025-07-10 19:38:33.595	2025-07-10 19:38:33.631374	\N	EslLqtidHf0OKFtQLyaBhD0T3KkQCibn	2025-07-10 19:38:33.595	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_r9jwWRpSosPa	\N	\N	\N	\N	10	2025-07-10 19:38:34.294	2025-07-10 19:38:34.328977	\N	ZLxwP2lG7sJVHKqI6VlYLVCKig_bOm0y	2025-07-10 19:38:34.294	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_qmJtCI0vgnVQ	\N	\N	\N	\N	10	2025-07-10 19:38:35.553	2025-07-10 19:38:35.587486	\N	tgrdaYf70aFnl_mLPh5K8PJjPusN1KDi	2025-07-10 19:38:35.553	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Y6BLrRKkVSO3	\N	\N	\N	\N	10	2025-07-10 19:38:36.782	2025-07-10 19:38:36.817991	\N	bJ3Qtzx8rY8f7VjVjgU5nuIunebEOwSI	2025-07-10 19:38:36.782	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_obBFw_EHNIxU	\N	\N	\N	\N	10	2025-07-10 19:38:37.85	2025-07-10 19:38:37.885796	\N	YOtZ05-AZ6pkeUjd0-7eNT84K6uFBEvO	2025-07-10 19:38:37.85	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_5vDEoQKl25T-	\N	\N	\N	\N	10	2025-07-10 19:38:38.681	2025-07-10 19:38:38.716661	\N	TxU-Tu8Sj9ao4hPkGcQoQ48qImYqv7sc	2025-07-10 19:38:38.681	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_BMHTLqOHH7EP	\N	\N	\N	\N	10	2025-07-10 19:38:39.548	2025-07-10 19:38:39.586092	\N	9jr8bKQ6-oLnkL599rdB5P3XO56Bgbsf	2025-07-10 19:38:39.548	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_t7yWhnKQkOgX	\N	\N	\N	\N	10	2025-07-10 19:38:40.824	2025-07-10 19:38:40.85913	\N	48V9X4bmYFk_TLjooLKThfERqvoUi7oJ	2025-07-10 19:38:40.824	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_x-8fjmA5UgjZ	\N	\N	\N	\N	10	2025-07-10 19:38:42.993	2025-07-10 19:38:43.028543	\N	n0gxFFMBMdaKOCkuVTXw-ltLNrIagVnn	2025-07-10 19:38:42.993	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_hjrJHLL7mmRb	\N	\N	\N	\N	10	2025-07-10 19:38:44.259	2025-07-10 19:38:44.294505	\N	Ke7qDr9cnDY81Z8kstZ6oZq2igBeTx6x	2025-07-10 19:38:44.259	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_XBim42dinSxD	\N	\N	\N	\N	10	2025-07-10 19:38:46.196	2025-07-10 19:38:46.231565	\N	KcM3_Md30CTLfO1W8LXTxO1lHYAJ-nyZ	2025-07-10 19:38:46.196	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_CCstzqEMvfCW	\N	\N	\N	\N	10	2025-07-10 19:38:47.832	2025-07-10 19:38:47.867552	\N	JGi4mUSJP6dbaRgzAVJMePsUBHGJduun	2025-07-10 19:38:47.832	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_7l2g6BNj6NIO	\N	\N	\N	\N	10	2025-07-10 19:38:49.065	2025-07-10 19:38:49.100199	\N	mJv_noWnjh4-kMGUzl150ENkZJZcT8ir	2025-07-10 19:38:49.065	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Q_0jebHWZcK9	\N	\N	\N	\N	10	2025-07-10 19:38:49.899	2025-07-10 19:38:49.934648	\N	9iQKaEAg4XNmYx9kj1PK1xgqePNtY-q6	2025-07-10 19:38:49.899	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_In-sNLh-wmbi	\N	\N	\N	\N	10	2025-07-10 20:16:56.202	2025-07-10 20:16:56.237094	\N	BISgQT5Iy3YWzRrmzLSgx-MkNP5vJuoD	2025-07-11 01:34:49.157	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_JuZWBppOCt2q	\N	\N	\N	\N	10	2025-07-10 21:17:20.255	2025-07-10 21:17:20.290933	\N	lAd8KE07z-7tQxUY9aHyk0VTACyFy1DI	2025-07-10 21:17:20.255	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_fsVzQ6RPe7RT	\N	\N	\N	\N	10	2025-07-10 20:39:22.596	2025-07-10 20:39:22.631441	\N	ZkP9H2RFdrtCOkGJKadwBzeLFBXI09HK	2025-07-10 20:39:22.596	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_oTzD9qkSfH3U	\N	\N	\N	\N	10	2025-07-10 21:50:55.507	2025-07-10 21:50:55.542313	\N	6dn1xr1DKtkj9_ysOjspW_GsefymelzI	2025-07-10 21:50:55.507	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_FpMlLzjwoxK4	\N	\N	\N	\N	10	2025-07-10 21:57:26.267	2025-07-10 21:57:26.302719	\N	iUFVsjtOpgQ0y1gOC--sziAe6fhliPtt	2025-07-10 21:57:26.267	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_M0A2TZxNVdb6	\N	\N	\N	\N	10	2025-07-11 03:29:14.856	2025-07-11 03:29:16.798564	\N	5uuMA7q9DfvGuWjxmlCznULUyguia3Hx	2025-07-11 03:31:55.699	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_enH30NTBJVH7	\N	\N	\N	\N	10	2025-07-10 22:42:09.922	2025-07-10 22:42:09.957332	\N	d5mDED6aSJqy-5gLMWkIFdKS-ATX_sng	2025-07-10 22:42:09.922	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Zy3hc8EMzFIM	\N	\N	\N	\N	10	2025-07-10 22:55:00.62	2025-07-10 22:55:00.655551	\N	mmPsOpwza36B0ncitVfQI6kJdRVBI_mG	2025-07-10 22:55:00.62	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_eQLUp6ahz4WZ	\N	\N	\N	\N	10	2025-07-10 22:56:40.271	2025-07-10 22:56:40.306262	\N	5rBb7z_b0L4IPe2cXQZUK2AMqG3OwRBU	2025-07-10 22:56:40.271	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_bKz2U8pJ-NQ4	\N	\N	\N	\N	10	2025-07-10 23:14:37.789	2025-07-10 23:14:37.823488	\N	pH0KmAlmEBpv6FJKwMLpeyFkKb6SxeZW	2025-07-10 23:14:37.79	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ZPBNwaWpKLfK	\N	\N	\N	\N	10	2025-07-10 23:27:24.402	2025-07-10 23:27:24.435604	\N	jrq78X6rCSylTD2pFwwfkriq7WwfBdFx	2025-07-10 23:27:24.402	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_rtxKJ9DUXCX4	\N	\N	\N	\N	10	2025-07-10 23:49:02.767	2025-07-10 23:49:02.803451	\N	vfhOmYGpYQT6mXeIkHbAJRsjP1n4r-wh	2025-07-10 23:49:02.767	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_i9XH5xAKBztY	\N	\N	\N	\N	10	2025-07-10 23:53:00.641	2025-07-10 23:53:00.674669	\N	yT-_RS2ciyGiyt0sF--SWzn328sbfutI	2025-07-10 23:53:00.641	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_IHxzlzvSzPFM	\N	\N	\N	\N	10	2025-07-11 01:04:04.342	2025-07-11 01:04:05.564138	\N	ImFFrZ5eZwPKjGGaJtHRTuYedC0XnA77	2025-07-11 01:42:45.421	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_CTx3cFALVZUc	\N	\N	\N	\N	10	2025-07-11 02:02:03.488	2025-07-11 02:02:03.523427	\N	be1ull1Xeu-bYlCLSDQSkT5NlJzJpMXM	2025-07-11 02:02:03.488	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_WI4ZkHtl3EZW	\N	\N	\N	\N	10	2025-07-11 02:15:46.464	2025-07-11 02:15:46.497708	\N	Ibsvzvs8aa9IuBwiQglN5UxUwgmMR68g	2025-07-11 02:15:46.464	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_YnTaHDB1BHB1	\N	\N	\N	\N	10	2025-07-11 02:17:57.035	2025-07-11 02:17:57.067752	\N	vL9Zrj245b-44iNHU7zuGEOa8fZf-Wqz	2025-07-11 02:17:57.035	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_9MHwP2k9M2JP	\N	\N	\N	\N	10	2025-07-11 02:17:57.494	2025-07-11 02:17:57.526734	\N	uwE6QO2e_pgBDABr5WG9s6j_7GOsd3ty	2025-07-11 02:17:57.494	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_4ighCSbKthpx	\N	\N	\N	\N	10	2025-07-11 05:18:43.625	2025-07-11 05:18:43.659968	\N	yqP7HAy3VyT-UuHHi1lypnljGINo3cFN	2025-07-11 05:18:43.625	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_lspqHCcv4nPS	\N	\N	\N	\N	10	2025-07-11 00:29:52.982	2025-07-11 00:29:53.017817	\N	gVMNhc5R8jNwb4CXHBXrICVGbuYhepK3	2025-07-11 02:58:34.572	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_cW19Pg12O8Cf	\N	\N	\N	\N	10	2025-07-11 01:40:27.358	2025-07-11 01:40:27.393251	\N	iJHgASsI2PzkVrXaqKQ4dwinq3w6I6T-	2025-07-11 03:02:45.575	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_KfGfHxxvt7tf	\N	\N	\N	\N	10	2025-07-11 03:22:03.419	2025-07-11 03:22:03.458145	\N	J1A_v0pSF9kGOTmp4kSBeRvJhm7uYWZH	2025-07-11 03:22:03.419	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_GC4P9I9eP6N-	\N	\N	\N	\N	10	2025-07-11 03:22:07.668	2025-07-11 03:22:07.702265	\N	VSGbtsnoZ2xQaA0uBFzhFJ1dfOhZ89aF	2025-07-11 03:22:07.668	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_haCFgArMrOC3	\N	\N	\N	\N	10	2025-07-11 03:25:14.848	2025-07-11 03:25:14.883898	\N	ZRQlKzIreIcO2a9odOHGL1LGw-6xlfvm	2025-07-11 03:25:14.848	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_0fIXsq84YIE9	\N	\N	\N	\N	10	2025-07-11 04:34:06.311	2025-07-11 04:34:08.295279	\N	MiTdMPBtOPE02P1pZrFfplGDzuhU8sqP	2025-07-11 04:38:07.496	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Kzv9gsMfWyP9	\N	\N	\N	\N	10	2025-07-11 04:38:31.92	2025-07-11 04:38:31.954271	\N	-QIjudPQWY4xPjQ95m1XD_KeVV1gmhuz	2025-07-11 04:38:31.92	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_dU_YqhJmboQE	\N	\N	\N	\N	10	2025-07-11 03:32:10.707	2025-07-11 03:32:12.66454	\N	vV6_mwZeHQKE66mHL2kSL-9fC_Kt8yBa	2025-07-11 03:47:54.596	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_bHZ5rk12Iiub	\N	\N	\N	\N	10	2025-07-11 01:34:43.997	2025-07-11 01:34:44.032339	\N	cyYqdbXYCy0ooV2YTCO29rkw8vjtE0Rc	2025-07-11 01:34:43.997	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Za8zf9iOK_ig	\N	\N	\N	\N	10	2025-07-11 03:57:57.238	2025-07-11 03:57:57.270542	\N	0oyciM9wkuEgexWaIsfChjqgcrI1oBMD	2025-07-11 03:57:57.238	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_2OaWPPASuOYK	\N	\N	\N	\N	10	2025-07-11 04:01:57.612	2025-07-11 04:01:57.647389	\N	hOPtshqqjDBe5YBbjX0mUP3F6Yok_QCe	2025-07-11 04:01:57.612	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ijzptVRj1Gq0	\N	\N	\N	\N	10	2025-07-11 04:13:08.795	2025-07-11 04:13:10.7508	\N	Msdx5fD_24XbNV4fXQILPEEzOvGhQtDz	2025-07-11 04:13:10.496	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_WCeElXIwuWcP	\N	\N	\N	\N	10	2025-07-10 22:18:02.337	2025-07-10 22:18:02.377385	\N	jsKa4m6lLiKw-YB9z9bcepzbCjMXC5cJ	2025-07-11 00:23:36.919	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_V0FfyffBXI72	\N	\N	\N	\N	10	2025-07-11 05:20:38.788	2025-07-11 05:20:40.75224	\N	K2f9_cIhYFd5BvoIBwa67vDnB5yZ4BSk	2025-07-11 05:20:45.972	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_QzFmzgt31f9K	\N	\N	\N	\N	10	2025-07-11 01:35:05.185	2025-07-11 01:35:05.219837	\N	36X3JRy2nDsG105XTg0L-b5PoenF1v5Q	2025-07-11 01:35:05.185	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_3lj4Wgq12H6x	\N	\N	\N	\N	10	2025-07-11 05:18:46.316	2025-07-11 05:18:46.350919	\N	VqY5oEyZoY1pSaOsJCbbDqIKKK6Gx9tw	2025-07-11 05:18:46.316	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_QyAv-QqP0wXS	\N	\N	\N	\N	10	2025-07-11 04:41:44.531	2025-07-11 04:41:46.488663	\N	la3nrhKN-7hnS8exF-AhUWZ9Bi2_a5Hr	2025-07-11 04:53:11.077	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_TTN46CEL0bMp	\N	\N	\N	\N	10	2025-07-11 04:13:09.148	2025-07-11 04:13:11.115617	\N	BCVzDB7RAUDHeqnEkRwsAzAQQEOWfo9K	2025-07-11 04:33:25.507	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_wDyQwANT4n3l	\N	\N	\N	\N	10	2025-07-11 04:34:04.8	2025-07-11 04:34:06.753428	\N	Ny5M4graXmbTcHV_d_2-q1zf9y36lBy-	2025-07-11 04:34:04.8	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_anmWCv18KpZu	\N	\N	\N	\N	10	2025-07-11 04:54:22.797	2025-07-11 04:54:24.764205	\N	iukFkJt0t0QYhsUvMAJtw16hO8qL7S9l	2025-07-11 05:18:55.798	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_R9Qsmm6p1dwF	\N	\N	\N	\N	10	2025-07-11 04:34:05.299	2025-07-11 04:34:08.043518	\N	ST7iQwn8mKkkE0Nobahx7dsMtBT9nfeu	2025-07-11 04:34:05.299	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_y-HEISVabx2R	\N	\N	\N	\N	10	2025-07-11 05:09:48.264	2025-07-11 05:09:48.298713	\N	JtPYnU76xeIhiBMPJIBv_SuzWcG2kCeM	2025-07-11 05:09:48.264	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_prHZjeem2uyl	\N	\N	\N	\N	10	2025-07-11 05:30:01.724	2025-07-11 05:30:03.701712	\N	vg0Ad1lNIWmssyQWBM7s5f2hPPqkYEyI	2025-07-11 05:30:27.621	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_PV2dq1FC51Fy	\N	\N	\N	\N	10	2025-07-11 05:33:18.636	2025-07-11 05:33:18.670658	\N	GZ8cRm1BXsRdxPPAsByL4fwYPF57x_08	2025-07-11 05:33:18.636	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_koC_nr_nzQVG	\N	\N	\N	\N	10	2025-07-11 05:33:20.099	2025-07-11 05:33:20.134223	\N	PFeFe-s2dcAAARJwmYi1Vdh5ZfweQfYy	2025-07-11 05:33:20.099	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_IOu8rBWWNl4A	\N	\N	\N	\N	10	2025-07-11 05:33:22.589	2025-07-11 05:33:22.62388	\N	0kMJQoi5xS_cKhFa6vC9xJ_OV9dCOa8z	2025-07-11 05:33:22.589	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_GxLzNabaNGhp	\N	\N	\N	\N	10	2025-07-11 05:26:24.339	2025-07-11 05:26:26.295914	\N	2W4MHi6cBpUGls9ys_Q1m9al0z2uzKXX	2025-07-11 05:27:01.166	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_NEYhb5m-_NOb	\N	\N	\N	\N	10	2025-07-11 05:30:01.409	2025-07-11 05:30:03.400765	\N	mGP3j3qkLmnZVdY2MCQmYdrEtATyQZkw	2025-07-11 05:30:03.131	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_5wRQyp3Td8zH	\N	\N	\N	\N	10	2025-07-11 05:33:24.967	2025-07-11 05:33:25.006928	\N	WsUKH-Fk11aU3wdeZoSy6Q6W3RVhq7xl	2025-07-11 05:33:24.967	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_sfX8G_Eo8W7N	\N	\N	\N	\N	10	2025-07-11 05:33:27.531	2025-07-11 05:33:27.566464	\N	iFiwe8F5Jt0olNPaYQc4xBGCmPWVQqKl	2025-07-11 05:33:27.531	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_zv85pJ5kHFv-	\N	\N	\N	\N	10	2025-07-11 05:33:30.1	2025-07-11 05:33:30.13567	\N	8YBUq131yFCeo6PUfHB_KYhsK4pVLFnd	2025-07-11 05:33:30.1	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_USha-EDmITTr	\N	\N	\N	\N	10	2025-07-11 05:33:32.513	2025-07-11 05:33:32.548338	\N	XDJ2YHlUonix059KNizhwdqQCud0tPco	2025-07-11 05:33:32.513	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_D0mWwigHgl7M	\N	\N	\N	\N	10	2025-07-11 05:33:34.937	2025-07-11 05:33:34.972268	\N	AAbAjQ5FcRmVEhhD3fTolscpERrdjCNN	2025-07-11 05:33:34.937	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_OdWCXTAcwqrp	\N	\N	\N	\N	10	2025-07-11 05:33:37.361	2025-07-11 05:33:37.396248	\N	zf31Eom6-SaYbm3_Qxh69bt0MxMnw_9A	2025-07-11 05:33:37.361	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_aCwx8h05su1Q	\N	\N	\N	\N	10	2025-07-11 05:33:39.739	2025-07-11 05:33:39.77306	\N	Fsg5QywtjxDDdd8aV6Cg6GUkJSB41ijG	2025-07-11 05:33:39.739	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_rX9MsUeMP3Ri	\N	\N	\N	\N	10	2025-07-11 05:33:42.231	2025-07-11 05:33:42.265948	\N	Nk3HXPZx6pZHsh7BH7RiTaiupdm9eC8W	2025-07-11 05:33:42.231	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_5NGH2Z1pHwRX	\N	\N	\N	\N	10	2025-07-11 05:33:44.528	2025-07-11 05:33:44.56322	\N	A6Bxrs9NiXuDsKWbBw138gQP_1qBDmTd	2025-07-11 05:33:44.528	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_IMR6coK4KRYA	\N	\N	\N	\N	10	2025-07-11 05:33:46.815	2025-07-11 05:33:46.849784	\N	1w26-su_vXnteSktyA6r4ZcxMdtzm0H7	2025-07-11 05:33:46.815	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_3tX7RiAGq2b6	\N	\N	\N	\N	10	2025-07-11 05:33:49.257	2025-07-11 05:33:49.291921	\N	d8q-IrkY_bKPiYDhUhwLDPrNoA2U6dey	2025-07-11 05:33:49.257	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_82Wg9IvgOyw5	\N	\N	\N	\N	10	2025-07-11 05:33:51.565	2025-07-11 05:33:51.603367	\N	V6F494kg5z7JWUgibwzTCseL9K_o3S0C	2025-07-11 05:33:51.565	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_lggSPRpZa3rv	\N	\N	\N	\N	10	2025-07-11 05:33:53.949	2025-07-11 05:33:53.983578	\N	3XVaNSfEM4fPFPUyau73dLPvFWSmwsOg	2025-07-11 05:33:53.949	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_SCbHAsqwYnyU	\N	\N	\N	\N	10	2025-07-11 05:33:56.302	2025-07-11 05:33:56.337908	\N	8rU4x0umOxau_LXpHj7qTmUJw0M_1xkt	2025-07-11 05:33:56.302	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ZC9QXZ8mZcGY	\N	\N	\N	\N	10	2025-07-11 05:33:58.77	2025-07-11 05:33:58.805818	\N	rrR6Z2mjs44HW944U2rEFHjzCugatZfD	2025-07-11 05:33:58.77	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ifS8Q3msh5NE	\N	\N	\N	\N	10	2025-07-11 05:20:41.542	2025-07-11 05:20:43.492861	\N	0CuMoKpKQA0T4Ds6g8EKF__LI10LMRL_	2025-07-11 05:21:12.824	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_9jl_oSdKXIw_	\N	\N	\N	\N	10	2025-07-11 05:26:22.94	2025-07-11 05:26:24.90088	\N	XKpQpOWwKrZrs_IxdGUnsB-ptgXAIJHF	2025-07-11 05:26:22.94	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_-nqc4q3F4aib	\N	\N	\N	\N	10	2025-07-11 05:26:22.616	2025-07-11 05:26:24.577608	\N	CNojQ_-KLtIA35NFUs2Qiu3eeq3Bsoo9	2025-07-11 05:26:24.339	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_6haKW0a4HrpP	\N	\N	\N	\N	10	2025-07-11 05:34:01.091	2025-07-11 05:34:01.12586	\N	O7HBQAc1wgKYfPr0pPDwTUM239p1Ykt_	2025-07-11 05:34:01.091	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_y5PzeHKlZGxf	\N	\N	\N	\N	10	2025-07-11 05:34:03.465	2025-07-11 05:34:03.499023	\N	p2jJXHZ0d_ktj7-ZzI1knVUOR0fNk2as	2025-07-11 05:34:03.465	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_cEDbR2fADvu6	\N	\N	\N	\N	10	2025-07-11 05:34:05.8	2025-07-11 05:34:05.835119	\N	dAdWXOQcAcVkFcCNCrzk3RZf7eV6y2Aa	2025-07-11 05:34:05.8	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_4W51GqEv3Pos	\N	\N	\N	\N	10	2025-07-11 05:34:08.334	2025-07-11 05:34:08.369702	\N	NTUAlCfh8UJb4DCQ3dhb4y3b2amLybhV	2025-07-11 05:34:08.334	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_4JEIr-V4-olD	\N	\N	\N	\N	10	2025-07-11 05:34:10.639	2025-07-11 05:34:10.672968	\N	yG9BYcDqWa2uOSEenePiPLaEuYl6rf65	2025-07-11 05:34:10.639	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_JJNkOusbf0vB	\N	\N	\N	\N	10	2025-07-11 05:34:12.983	2025-07-11 05:34:13.018456	\N	5so1zGXIA28Wgwt1ECx_LraXnG5CPNBA	2025-07-11 05:34:12.983	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_eDBbyOj-nXWt	\N	\N	\N	\N	10	2025-07-11 05:34:15.329	2025-07-11 05:34:15.363821	\N	f_EJZVIQs--IAmYlNVvHy5S9eesJMfxb	2025-07-11 05:34:15.329	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_yObz-q0CdIQx	\N	\N	\N	\N	10	2025-07-11 05:34:17.876	2025-07-11 05:34:17.910633	\N	kmVG6tFEPGJmyfXk_EfZKhkZz6zGGAgh	2025-07-11 05:34:17.876	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_qdBKQ3PeOeae	\N	\N	\N	\N	10	2025-07-11 05:34:20.239	2025-07-11 05:34:20.273858	\N	tQ0lCgPr5xy7-BhkLsT2Fud_zYmTd6je	2025-07-11 05:34:20.239	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_wfNFOw6gZFLb	\N	\N	\N	\N	10	2025-07-11 05:34:22.716	2025-07-11 05:34:22.750845	\N	98oNZlU58Ijpx0vGbUqTKKjxvfSomvpE	2025-07-11 05:34:22.716	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_nMDUWAWRmD69	\N	\N	\N	\N	10	2025-07-11 05:34:25.051	2025-07-11 05:34:25.085876	\N	IERSpfUvs-PXU96Dhk8IA4FPIR8RB67h	2025-07-11 05:34:25.051	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_iZ2gSseS1tK0	\N	\N	\N	\N	10	2025-07-11 05:34:27.217	2025-07-11 05:34:27.251981	\N	nSb6poyT9R-NefrT_fkPYSGdnOmmeIY8	2025-07-11 05:34:27.217	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_9ADzapIHAWTn	\N	\N	\N	\N	10	2025-07-11 05:34:29.814	2025-07-11 05:34:29.849668	\N	7QmltQjqMfs4Xp0hLprD8D6NXSWwuXU7	2025-07-11 05:34:29.814	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_fXQHB8K0i_l0	\N	\N	\N	\N	10	2025-07-11 05:34:32.286	2025-07-11 05:34:32.321431	\N	_n6Ni8v57PVPGx9HiNvLwO1RMkT_Gdd1	2025-07-11 05:34:32.286	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_7n3sgLMBnZ4h	\N	\N	\N	\N	10	2025-07-11 05:34:34.58	2025-07-11 05:34:34.615376	\N	3wVkJ363r4N622-aRpLX7ldwJg-jRlpC	2025-07-11 05:34:34.58	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ucHaSv1bCAnZ	\N	\N	\N	\N	10	2025-07-11 05:34:36.903	2025-07-11 05:34:36.938622	\N	DkM_1kye_kQuwPf1xESAU8vtnmKhXWM_	2025-07-11 05:34:36.903	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_7QheiJirGVMV	\N	\N	\N	\N	10	2025-07-11 05:34:39.295	2025-07-11 05:34:39.331585	\N	JUWKw6MXzECf9YTNrYqGpqjQdE2AGlVZ	2025-07-11 05:34:39.295	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_B8zDkNDuoES9	\N	\N	\N	\N	10	2025-07-11 05:34:41.623	2025-07-11 05:34:41.657847	\N	QLcKjyNj_4nI7dCpe-HFKU2iM71WmCzo	2025-07-11 05:34:41.623	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_tq577owtUvul	\N	\N	\N	\N	10	2025-07-11 05:34:43.882	2025-07-11 05:34:43.916834	\N	nQ5jkzC1w37ehQDmxm4QwvBkBuRxIovn	2025-07-11 05:34:43.882	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_zaiqvHe4SVyH	\N	\N	\N	\N	10	2025-07-11 05:34:46.218	2025-07-11 05:34:46.252631	\N	o5SujpUOMB3mb-b_1djmjLGzK7QzWLsi	2025-07-11 05:34:46.218	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_MgxtqDNd_Q7J	\N	\N	\N	\N	10	2025-07-11 05:34:48.602	2025-07-11 05:34:48.637561	\N	WS9Mdply-EGRovjjhXZCnmh-viPLgw8C	2025-07-11 05:34:48.602	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_kH7ze-XH05RD	\N	\N	\N	\N	10	2025-07-11 05:34:50.918	2025-07-11 05:34:50.952548	\N	-FeHqzmPcm_jinvZ-rFQJnDTZf0g_QK5	2025-07-11 05:34:50.918	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_g8NwBdht8SWT	\N	\N	\N	\N	10	2025-07-11 05:34:53.259	2025-07-11 05:34:53.294199	\N	LD9JYZojITZ_At-OlsCwd--wpnskBm1Q	2025-07-11 05:34:53.259	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_d4mqKGendtz0	\N	\N	\N	\N	10	2025-07-11 05:34:55.667	2025-07-11 05:34:55.700898	\N	QfLZTea-GZ2bj8y7gF1WmNub9HHGISYz	2025-07-11 05:34:55.667	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Wkt2XjomlLse	\N	\N	\N	\N	10	2025-07-11 05:35:32.615	2025-07-11 05:35:34.588499	\N	8MnaaLc4MtePIZ8_8cHnS9HvnAmWvwx-	2025-07-11 05:35:34.321	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_-1Ezn5xi50PZ	\N	\N	\N	\N	10	2025-07-11 05:35:32.943	2025-07-11 05:35:34.896576	\N	D2s0bG5pu6dwzq1bv7oL85pT8NtqoiFY	2025-07-11 05:36:00.399	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_eCG-wjwrrGbs	\N	\N	\N	\N	10	2025-07-11 05:38:42.353	2025-07-11 05:38:44.310124	\N	Tt1YRmBaSn5GA7iT1zAWzfp8Oa62eSyS	2025-07-11 05:38:43.956	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_1JGwm_j4nmBl	\N	\N	\N	\N	10	2025-07-11 05:38:44.686	2025-07-11 05:38:46.648473	\N	AJtf_WL83WL5YjU9tz4mb38gMRo8vuwO	2025-07-11 05:38:44.686	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_BlAlJ9UoSE-D	\N	\N	\N	\N	10	2025-07-11 05:57:16.236	2025-07-11 05:57:16.267337	\N	mKHcd2LrFYbuM2quQoDnm9ukCaC9G9v9	2025-07-11 05:57:16.236	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_sZrRAa6LeEz9	\N	\N	\N	\N	10	2025-07-11 05:39:33.704	2025-07-11 05:39:35.66786	\N	ceo_Z55zarXESh-V93u-BosUsRmJMXHr	2025-07-11 06:12:05.693	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_l3c6cFvPKe3O	\N	\N	\N	\N	10	2025-07-11 06:14:50.491	2025-07-11 06:14:52.464092	\N	cnV-Xgkxa7Jw3A1tLBFga8QoKh-LIicQ	2025-07-11 06:14:50.491	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_L7m8VHxIH4r2	\N	\N	\N	\N	10	2025-07-11 06:54:06.735	2025-07-11 06:54:08.691691	\N	qqGwjAA9s4oZWZj0s79wvOJ2jsqa5DE1	2025-07-11 06:54:06.735	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_jk_BmLc70wjJ	\N	\N	\N	\N	10	2025-07-11 06:21:01.126	2025-07-11 06:21:01.161467	\N	HxoViofKr9b2S0Y9wRY_Z7C7fj2bbCUM	2025-07-11 06:21:08.145	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_3LKWip79JXsd	\N	\N	\N	\N	10	2025-07-11 06:22:43.624	2025-07-11 06:22:43.655753	\N	K0ri34q21puow6pU19_9BekX7bujgTRL	2025-07-11 06:22:43.624	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_3FuI9pglHUj2	\N	\N	\N	\N	10	2025-07-11 07:16:38.615	2025-07-11 07:16:40.584993	\N	7CP7EfFUzv4F5AGyT8tYg5YzF-SPhAvy	2025-07-11 07:31:28.359	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_eqrEV8oThtO-	\N	\N	\N	\N	10	2025-07-11 07:33:55.332	2025-07-11 07:33:55.366353	\N	R9YZB2qFKPdlYN1ZqsVIMRCxVc0llv-i	2025-07-11 07:33:55.332	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ocC6jgnmMxNB	\N	\N	\N	\N	10	2025-07-11 07:33:56.168	2025-07-11 07:33:56.203177	\N	gczjVdDp5U5MHeq3PprvRkxEF3JtvKaQ	2025-07-11 07:33:56.168	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_uyUkzFmvFeki	\N	\N	\N	\N	10	2025-07-11 06:15:56.59	2025-07-11 06:15:56.624532	\N	cWTDEZnxrJ4plT-yZA1ooUPYxfkZ8pgS	2025-07-11 06:15:56.59	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_m0C347Wye7ZC	\N	\N	\N	\N	10	2025-07-11 08:25:11.29	2025-07-11 08:25:11.323454	\N	iMgw5e9BBDuAyrlVehk9VxNiMlTwsBTc	2025-07-11 08:25:11.29	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Wyh0GHAmYGE_	\N	\N	\N	\N	10	2025-07-11 08:28:09.169	2025-07-11 08:28:09.204597	\N	Hdj1eiUIdDJKzVFP7zn-Jrsz-Z2-8Co0	2025-07-11 08:28:09.169	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_0XbwNfF-SXjb	\N	\N	\N	\N	10	2025-07-11 06:54:04.173	2025-07-11 06:54:06.141116	\N	VtkMaAWvHwUzpmwDnRZQEskVTcBFquuG	2025-07-11 07:08:16.293	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_bF_UmZP-VfdT	\N	\N	\N	\N	10	2025-07-11 07:15:27.853	2025-07-11 07:15:29.828166	\N	yLkUSYASX4IAxL_4uu4gYMRbDt9tUEby	2025-07-11 07:15:29.637	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_e9cayCLGggdl	\N	\N	\N	\N	10	2025-07-11 08:28:59.753	2025-07-11 08:28:59.790254	\N	D6VnB2poa-PoA0xskydo_JAYKkJ5xwi2	2025-07-11 08:28:59.753	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_wZxjhKbHfjLz	\N	\N	\N	\N	10	2025-07-11 08:29:05.516	2025-07-11 08:29:05.55356	\N	Kr6xlf8ikFZbSQULZDuBCRP9W0seVV9N	2025-07-11 08:29:05.516	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Vt7ztv_eXEzE	\N	\N	\N	\N	10	2025-07-11 08:32:52.814	2025-07-11 08:32:52.849694	\N	IAoxHo5xd-KSdu-Txz5-hO_ZxjtsegAG	2025-07-11 08:32:52.814	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest__b-70ieme3P1	\N	\N	\N	\N	10	2025-07-11 08:32:53.636	2025-07-11 08:32:53.671128	\N	5MSUOYB3ecyiBwQxcg8ZCjdvpoyTRRIi	2025-07-11 08:32:53.636	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ZxQKv6zoohrw	\N	\N	\N	\N	10	2025-07-11 08:33:00.128	2025-07-11 08:33:00.163366	\N	Jh4DSP7DuTMeRCBTpid_EYYzP5U-Xjok	2025-07-11 08:33:00.128	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_MzWAew-ydveH	\N	\N	\N	\N	10	2025-07-11 08:33:08.634	2025-07-11 08:33:08.671346	\N	8Io_MccPw_j1M_iSTcAIjLob1j9oc3hY	2025-07-11 08:33:08.634	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_wHK_VG0iOIdn	\N	\N	\N	\N	10	2025-07-11 07:15:28.214	2025-07-11 07:15:30.19743	\N	opGFXKD60Rr-hLRdiIzU22ZOIV_meDVc	2025-07-11 07:16:07.333	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ZgRl2nNZJykb	\N	\N	\N	\N	10	2025-07-11 06:14:50.15	2025-07-11 06:14:52.116568	\N	GwCkeZTAnE3nZcpLh14axNbZTWyqO23w	2025-07-11 06:47:47.673	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Z6u266pUabac	\N	\N	\N	\N	10	2025-07-11 07:16:38.051	2025-07-11 07:16:40.020778	\N	-NPoWj-7xBqc1Jr5AWsqzYOocuyA800G	2025-07-11 07:16:39.963	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_EKztoIrpr8xO	\N	\N	\N	\N	10	2025-07-11 08:34:11.697	2025-07-11 08:34:11.732748	\N	i-zaRroDv4OPVNndfTHfvgPArMGtg3zu	2025-07-11 08:34:11.697	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_57l6Yg2b0h4h	\N	\N	\N	\N	10	2025-07-11 06:37:52.773	2025-07-11 06:37:52.808169	\N	PmBW5GNxWQJuP8NXAPOmfX5GPquKljqr	2025-07-11 06:37:52.773	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ECBlDK6vWygy	\N	\N	\N	\N	10	2025-07-11 06:10:29.098	2025-07-11 06:10:29.132432	\N	BO3vvVoKk7MM0KKzdrWzdrV_jp4k_zwc	2025-07-11 06:10:29.098	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_OJ8SmKHwXiHA	\N	\N	\N	\N	10	2025-07-11 08:37:03.576	2025-07-11 08:37:03.609877	\N	6NtsZcK0SlnbdSLSAmDrI-NSV1Slss6M	2025-07-11 08:37:03.576	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Cuv9dZWQwcsn	\N	\N	\N	\N	10	2025-07-11 08:37:54.527	2025-07-11 08:37:54.5625	\N	Z7KoWklcz9gWkM-DGWjlouQuaGsQcimJ	2025-07-11 08:37:54.527	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_BUeO_RBn2doE	\N	\N	\N	\N	10	2025-07-11 08:37:56.22	2025-07-11 08:37:56.25413	\N	JvYEHCiANJalMH_m0bqkJnEt5Vkd8fr5	2025-07-11 08:37:56.22	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_YF5Mpv9nlw-d	\N	\N	\N	\N	10	2025-07-11 08:38:05.743	2025-07-11 08:38:05.779733	\N	QhlWNwRk7wD-mgqVEYQk0bFTDF3_8hG3	2025-07-11 08:38:05.743	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_UJs82N2SlLxw	\N	\N	\N	\N	10	2025-07-11 08:39:13.891	2025-07-11 08:39:13.926113	\N	1BjW1TZxCTG3fyLU5TYGbJdDtB65oiGg	2025-07-11 08:39:13.891	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ppdggfVv8gvZ	\N	\N	\N	\N	10	2025-07-11 08:40:02.428	2025-07-11 08:40:02.463043	\N	LJoXT9RD9xkYoLECd-vmRmFhlgITVcKW	2025-07-11 08:40:02.428	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_7LVPBZ85e1v7	\N	\N	\N	\N	10	2025-07-11 08:40:27.422	2025-07-11 08:40:27.460436	\N	EGR5LeB6bBnNXMdoxts0dam5JrLAEjGH	2025-07-11 08:40:27.422	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_vJ4lh3LdY2ZU	\N	\N	\N	\N	10	2025-07-11 08:41:13.547	2025-07-11 08:41:13.58047	\N	gF9DlLt4nCHRoMEJut4bnbnSSegZ4aSx	2025-07-11 08:41:13.547	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Pr0rFTYh5Kyb	\N	\N	\N	\N	10	2025-07-11 06:50:55.152	2025-07-11 06:50:55.186338	\N	WaVB8RkrXc1WJboe7TwEhZazpCziJNUk	2025-07-11 06:51:30.059	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_yAA0hucPJ2if	\N	\N	\N	\N	10	2025-07-11 08:42:01.129	2025-07-11 08:42:01.163616	\N	nN1Or6BInbysJ9xgmQA57JcPATD8P2hY	2025-07-11 08:42:01.129	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_gIR9ezGE87_O	\N	\N	\N	\N	10	2025-07-11 08:42:05.467	2025-07-11 08:42:05.503817	\N	YpDErl6xD7HmlCrMvfoeTjP7FhxfHD-G	2025-07-11 08:42:05.467	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_4Ot7ReAzlXl8	\N	\N	\N	\N	10	2025-07-11 08:42:12.456	2025-07-11 08:42:12.492572	\N	nrRbFVhFUeRI4XoglTOqKafhv_Zavs_s	2025-07-11 08:42:12.456	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_c0oCjDDS8aM8	\N	\N	\N	\N	10	2025-07-11 08:42:13.542	2025-07-11 08:42:13.576572	\N	oIWWYegXN3Fi16QBjXUaaHOSMhtXmXBj	2025-07-11 08:42:13.542	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest__kZMGKPc1TDp	\N	\N	\N	\N	10	2025-07-11 08:42:17.676	2025-07-11 08:42:17.71055	\N	ONerWFYnwYGuS2SvTQxdhWUKQjDhPR2J	2025-07-11 08:42:17.676	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Bc4ZZs8nbS73	\N	\N	\N	\N	10	2025-07-11 08:42:52.862	2025-07-11 08:42:52.898511	\N	JEXNcxdFcIziPNcVfZKZ3t0QDdILRxDc	2025-07-11 08:42:52.862	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Zy-naiE7QjJK	\N	\N	\N	\N	10	2025-07-11 08:43:35.422	2025-07-11 08:43:35.455693	\N	xmm2Z9jpVlDnFOQGZFijvvR0XJ8Slw-W	2025-07-11 08:43:35.422	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_-vRmVvgJwdWL	\N	\N	\N	\N	10	2025-07-11 08:43:56.87	2025-07-11 08:43:56.905695	\N	bMDfLTcqKiedMKGtCH62SK9TjRNUA0AZ	2025-07-11 08:43:56.87	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_b6v0QgolzpA6	\N	\N	\N	\N	10	2025-07-11 08:44:08.267	2025-07-11 08:44:08.383885	\N	Aa7zx6LE8TajgWMFkUBh09pYZODOvWs8	2025-07-11 08:44:08.267	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_QkeHRjdjDIIs	\N	\N	\N	\N	10	2025-07-11 08:44:08.628	2025-07-11 08:44:08.664394	\N	2vi8hbf65KddGRk_DmMwzeJklyiwHvnJ	2025-07-11 08:44:08.628	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_kQffNkQWsRWB	\N	\N	\N	\N	10	2025-07-11 08:44:31.487	2025-07-11 08:44:31.521792	\N	0oKEbxKFWHp99Et7kTjnLHvxw37BSGkw	2025-07-11 08:44:31.487	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_jad1EGhEmBuP	\N	\N	\N	\N	10	2025-07-11 09:30:44.598	2025-07-11 09:30:44.633589	\N	s17ZCFO5m49dS7xoUOwozXoFjNRYk6_u	2025-07-11 09:30:44.598	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_X7HxFlcNgwsi	\N	\N	\N	\N	10	2025-07-11 09:37:59.011	2025-07-11 09:37:59.045467	\N	Y15US7c0Msbmr2UOUvazLimR44uPQWcd	2025-07-11 09:37:59.011	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_sF9vH4xM5tBg	\N	\N	\N	\N	10	2025-07-11 10:28:35.351	2025-07-11 10:28:35.385088	\N	r2N7zhDTcXw54_KBVzlDmJpW797cj33g	2025-07-11 10:28:35.351	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_0hYE_yt3Kbzs	\N	\N	\N	\N	10	2025-07-11 10:28:40.222	2025-07-11 10:28:40.256693	\N	h92wHBtXV90M80b85cHERrVHl8YYBwfG	2025-07-11 10:28:40.222	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_WDSqon_wK1-3	\N	\N	\N	\N	10	2025-07-11 11:47:27.626	2025-07-11 11:47:27.662344	\N	sY3Lxi3ioD3iHLSl63U1Usx__VtAdOei	2025-07-11 11:47:27.626	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_tsVIKL7R398M	\N	\N	\N	\N	10	2025-07-11 12:04:06.868	2025-07-11 12:04:06.902258	\N	YAZvZBGIui-BHt4U8NwKDl4A9VfyuP5h	2025-07-11 12:04:06.868	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_GtQG7EV7g-KF	\N	\N	\N	\N	10	2025-07-11 15:49:36.467	2025-07-11 15:49:36.540407	\N	6-5cnr1-6O1HscAbJ5NkYdEqSjGh5P9l	2025-07-11 16:06:39.837	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_CbVREsrc9JrP	\N	\N	\N	\N	10	2025-07-11 16:20:43.102	2025-07-11 16:20:43.208609	\N	rCbtGFlQXE2Vidj_QhgWpQNB391lCw1w	2025-07-11 16:27:47.307	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_yxbuNMQQkzAq	\N	\N	\N	\N	10	2025-07-11 14:15:51.906	2025-07-11 14:15:51.940695	\N	1zaJkcsJdAH2q5MuA4NSNl1OsT96m1kb	2025-07-11 14:15:51.906	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_UwGE4lCWy9vp	\N	\N	\N	\N	10	2025-07-11 17:04:25.523	2025-07-11 17:04:25.633471	\N	nrsNUcBh5O7U2n1f_QgkwGXTa6Ot0D62	2025-07-11 17:13:22.571	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ktEZL5ah_FFq	\N	\N	\N	\N	10	2025-07-11 15:55:41.716	2025-07-11 15:55:41.751045	\N	VFW45l8yLwZvjA3EyYv7LD2ptK1ZLHJ7	2025-07-11 17:44:33.447	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_tM3qVa5Sscoz	\N	\N	\N	\N	10	2025-07-11 12:22:16.489	2025-07-11 12:22:19.180442	\N	_-cvrMuylCNn_7cNzCezJUib3YxkfKVh	2025-07-11 12:34:38.15	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_NNiaJinnO1QB	\N	\N	\N	\N	10	2025-07-11 17:16:24.373	2025-07-11 17:16:24.448937	\N	pwxQ7hFaZ40qjg0rAyohElzBl8MQitKV	2025-07-11 17:16:34.932	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_y1-6QGBVsmfB	\N	\N	\N	\N	10	2025-07-11 13:49:38.367	2025-07-11 13:49:38.399805	\N	zRrlosqH79dD0JDYIvSBtsanBR4MGaMI	2025-07-11 13:49:38.367	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_bj6WxoLt_Wl-	\N	\N	\N	\N	10	2025-07-11 14:29:06.688	2025-07-11 14:29:06.724029	\N	gZ4SbrBzc7LrixAqsFmUXHRgWErWJqSg	2025-07-11 14:29:06.688	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_7nL0WOL9VKGs	\N	\N	\N	\N	10	2025-07-11 16:34:33.004	2025-07-11 16:34:33.081394	\N	jj5LBad2nYaeNal3nfmPnHG7Cr_apTf5	2025-07-11 17:01:03.556	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_1k74cB7_4EJx	\N	\N	\N	\N	10	2025-07-11 12:27:16.06	2025-07-11 12:27:16.190505	\N	bbP9ESkEDz70NzcPbI5SpbxDw9MOEaN-	2025-07-11 12:27:16.06	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_LAs-PX7GYMWQ	\N	\N	\N	\N	10	2025-07-11 13:51:34.224	2025-07-11 13:51:34.259032	\N	8978BOGyQ57jiAof8mmN3IRTIqcgTEMH	2025-07-11 13:51:34.224	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_jUBCQjojl5JY	\N	\N	\N	\N	10	2025-07-11 12:29:13.942	2025-07-11 12:29:14.070907	\N	qqpwYntQI2turQXlCkKf0sNocSRCBQdY	2025-07-11 12:29:13.942	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_VpzLrWavCiD_	\N	\N	\N	\N	10	2025-07-11 12:17:08.666	2025-07-11 12:17:08.702361	\N	a4YV8RhOHUn5nBa_e7AWTcCiDiePPNTN	2025-07-11 12:17:08.666	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_9DoPfAP0dxxK	\N	\N	\N	\N	10	2025-07-11 16:28:12.496	2025-07-11 16:28:12.612818	\N	_LQPc9VICqsrgufUmcM7zDWNmtJoqdYn	2025-07-11 16:34:03.041	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_B4MpWP8EiLIf	\N	\N	\N	\N	10	2025-07-11 13:05:05.337	2025-07-11 13:05:05.378016	\N	NGqWj1f-16BIm1DtmQ1DDQ-u3VIieVJB	2025-07-11 13:05:05.337	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_fMnCvEjBd7yQ	\N	\N	\N	\N	10	2025-07-11 14:28:31.364	2025-07-11 14:28:31.441175	\N	jRkHuVQNkVkfVpP6yP6apWQG0XLgVbH6	2025-07-11 14:38:15.361	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_5mvTv-FCuBvZ	\N	\N	\N	\N	10	2025-07-11 12:58:58.058	2025-07-11 12:58:58.093035	\N	L2uA2jldhPQfKbAYaXgRXG7gQ17wr2z9	2025-07-11 14:02:43.615	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_s4n-ulwSoxpY	\N	\N	\N	\N	10	2025-07-11 16:52:29.258	2025-07-11 16:52:29.303756	\N	a3T79f5S6cb7RfcExTVc6PWLxR-Zjq5P	2025-07-11 16:52:29.258	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_QaDHXHraB4Rt	\N	\N	\N	\N	10	2025-07-11 16:35:45.783	2025-07-11 16:35:45.817891	\N	RYcdDaN2lk0a8dnfaUh5QOp6f5CXZOyF	2025-07-11 18:55:42.536	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_3OABMTMO_237	\N	\N	\N	\N	10	2025-07-11 16:07:21.041	2025-07-11 16:07:21.152652	\N	Gx30f-fi-4o5wr4QbjlHZcxVNKd_cdX3	2025-07-11 16:10:34.509	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_EFcEju7f0fRS	\N	\N	\N	\N	10	2025-07-11 12:10:56.12	2025-07-11 12:10:58.793696	\N	fEuNQ78P_BCkLZNYR4Olxyk18EiLdiQ2	2025-07-11 12:17:18.057	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_xz6caCYuoqSP	\N	\N	\N	\N	10	2025-07-11 12:22:16.257	2025-07-11 12:22:18.932306	\N	BoZxk2Idba-mhp7qq1Z02F3nPKpxF1az	2025-07-11 12:22:17.878	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_-0H6uOnrWBCx	\N	\N	\N	\N	10	2025-07-11 12:29:13.961	2025-07-11 12:29:14.089122	\N	_X2E8atSIWbkUpGPvdXnbkn4cHXz1hQV	2025-07-11 12:49:59.798	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_qYO8OQFa3NTN	\N	\N	\N	\N	10	2025-07-11 14:15:08.327	2025-07-11 14:15:08.363849	\N	EpqLEYpDHSHsRV_NI0wESg2V6eG9OIwE	2025-07-11 14:15:08.327	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_q_i4tUTIObpC	\N	\N	\N	\N	10	2025-07-11 14:15:08.621	2025-07-11 14:15:08.656909	\N	3qW4NduHPbHHHFFZOTtPWjF0QEOTtUt1	2025-07-11 14:15:08.621	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_tCQZ3szrV414	\N	\N	\N	\N	10	2025-07-11 15:42:14.099	2025-07-11 15:42:14.173345	\N	cSDI6y9acur8nFNe9_SmtjoJM6hhvDP-	2025-07-11 15:42:14.686	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_L7R68dcrcfU3	\N	\N	\N	\N	10	2025-07-11 14:42:00.622	2025-07-11 14:42:00.721517	\N	8aTgTn7fwOVv2v2yJ64oTJYw7YpA3zT0	2025-07-11 14:48:18.745	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_O_XI3vPZo3b6	\N	\N	\N	\N	10	2025-07-11 12:35:24.805	2025-07-11 12:35:27.479111	\N	NG8TdL7iTzcdX4tflp6fLY4e0zUlAd90	2025-07-11 12:37:14.776	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_te_7RV5yIpVL	\N	\N	\N	\N	10	2025-07-11 14:48:26.087	2025-07-11 14:48:26.841012	\N	2y4IxDnGnVjd7k9fS0_nQOHj2Rsd8-kY	2025-07-11 15:34:30.072	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_jJRUsB3HA7SR	\N	\N	\N	\N	10	2025-07-11 12:30:46.16	2025-07-11 12:30:46.193722	\N	SqzXrvLPcrRKSeN8tVuNXW8Eu5HGWilB	2025-07-11 12:30:46.16	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_qnpiLOvDjG_3	\N	\N	\N	\N	10	2025-07-11 12:41:00.673	2025-07-11 12:41:03.356415	\N	r3O4-bP-Lz2bm9YVfpHfcuAkSXiTBCOu	2025-07-11 12:41:00.673	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_NSgiI26tqYiU	\N	\N	\N	\N	10	2025-07-11 12:41:00.453	2025-07-11 12:41:03.130439	\N	BgwNj0VR7_49a3rhaYUIyyuKVuRP7x2G	2025-07-11 12:56:03.629	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_9k3N7i39gFKW	\N	\N	\N	\N	10	2025-07-11 16:10:45.486	2025-07-11 16:10:45.59188	\N	ICbsvtFFIc30B_WEGYoFxTgW4n4pCH7M	2025-07-11 16:14:23.63	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_p8_wNX9vak8J	\N	\N	\N	\N	10	2025-07-11 12:50:00.809	2025-07-11 12:50:00.845608	\N	uN8xUhWFIbvAqR0tN_Put-aG6msltcSI	2025-07-11 12:58:33.049	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_sBxVxS8ln-U8	\N	\N	\N	\N	10	2025-07-11 14:10:20.895	2025-07-11 14:10:20.929716	\N	KqNbG0jXX36M8ERoDmDJt0kBHjw90hNY	2025-07-11 14:17:21.807	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ZqgeH_k0-rXx	\N	\N	\N	\N	10	2025-07-11 15:38:29.281	2025-07-11 15:38:29.358186	\N	PdpTSQ9U80FSAuqQ9cC9hcGco2_hb1w-	2025-07-11 15:42:23.276	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_jMa6xeFCDgCC	\N	\N	\N	\N	10	2025-07-11 15:47:37.73	2025-07-11 15:47:37.764432	\N	-_EKGVD3IZaFpJV1KMyJ-McOyRQirZVo	2025-07-11 15:47:37.73	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_mdrlI7VGGDzl	\N	\N	\N	\N	10	2025-07-11 15:47:42.956	2025-07-11 15:47:42.992807	\N	7SsFzD1S1gbE3DYaKfnWWrBTgJWu7iq0	2025-07-11 15:47:42.956	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ZI0_QHRBPPst	\N	\N	\N	\N	10	2025-07-11 16:14:47.597	2025-07-11 16:14:47.704483	\N	AxCkfava2dt4Vq5S7DHghsoopnTHrS5Q	2025-07-11 16:20:27.957	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_I33ylCWOZtgu	\N	\N	\N	\N	10	2025-07-11 16:46:57.765	2025-07-11 16:46:57.798013	\N	OcGiikCK2-YSv5dgGuxuJwKKU73UzOaL	2025-07-11 16:48:10.183	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_cIyY9wvsCL0C	\N	\N	\N	\N	10	2025-07-11 16:51:56.002	2025-07-11 16:51:56.037615	\N	_NB-Tl7Y5dv0ZIcu9ssI0UsvI6vG_U-M	2025-07-11 18:37:42.174	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_sN_8fDGhBtis	\N	\N	\N	\N	10	2025-07-11 16:49:07.929	2025-07-11 16:49:08.004623	\N	U0jLIWP_q2ilBW-cLvcttBNN3sowoJ3B	2025-07-11 16:49:07.929	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_V6XLgMTPH9pm	\N	\N	\N	\N	10	2025-07-11 16:49:35.796	2025-07-11 16:49:35.830659	\N	7TmdVLuhzPNW3AIu_TOCCfBAGEe5pxEC	2025-07-11 16:49:35.796	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Cf_H4TdpXyhQ	\N	\N	\N	\N	10	2025-07-11 16:49:38.783	2025-07-11 16:49:38.861067	\N	5UcBQGO6AEPxpFIgQg6tUoMC75MuixM_	2025-07-11 16:49:38.783	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_KBr1sa4Vcy2-	\N	\N	\N	\N	10	2025-07-11 16:50:10.442	2025-07-11 16:50:10.537993	\N	0TuansrPEPGUJW_OYW9w0ksm6whannEO	2025-07-11 16:50:10.442	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_DufoSfvq_TTQ	\N	\N	\N	\N	10	2025-07-11 17:16:59.229	2025-07-11 17:16:59.304778	\N	iwINxb7HyoexFcLrPV_Z28zqtyUcQdDq	2025-07-11 17:16:59.229	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_N99rztbZnxKw	\N	\N	\N	\N	10	2025-07-11 18:25:38.95	2025-07-11 18:25:39.0184	\N	MPlqYEDH0uDs3RPy26Nbl9IflVfywkJ4	2025-07-11 18:25:38.95	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_qRhKMsiTnWik	\N	\N	\N	\N	10	2025-07-11 18:28:46.518	2025-07-11 18:28:46.613495	\N	jJ0rJ3wgssPafpSVLUDESHXvSMBvl8Pt	2025-07-11 18:28:46.518	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_oWv_BModVTkW	\N	\N	\N	\N	10	2025-07-11 18:22:09.67	2025-07-11 18:22:09.735992	\N	Nn1lDjsf0g0Cj3NtFzOdZybqPV8nThau	2025-07-11 18:22:09.67	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_swzebbbMainA	\N	\N	\N	\N	10	2025-07-11 18:23:10.475	2025-07-11 18:23:10.540999	\N	1QnzPgQy8cbNNqluwEpVPkxytKiOHWzz	2025-07-11 18:23:10.475	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_cC_RMeSCYRfZ	\N	\N	\N	\N	10	2025-07-11 17:17:08.509	2025-07-11 17:17:08.590044	\N	a47K0UC0zISG7UXwhLvwD2g_kNfoMTY2	2025-07-11 17:25:14.681	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_FTJGS-7tWrLd	\N	\N	\N	\N	10	2025-07-11 17:28:55.63	2025-07-11 17:28:55.666191	\N	8lOQuo1huOZzpJ_YGmxdCwvUgY5vkWFY	2025-07-11 17:28:55.63	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_w_djDFys8OlP	\N	\N	\N	\N	10	2025-07-11 17:28:57.028	2025-07-11 17:28:57.063558	\N	2kqs0T65vreh6Uw_neggKc2T7iy0tLbG	2025-07-11 17:28:57.028	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_thsgAut5lV7f	\N	\N	\N	\N	10	2025-07-11 19:40:40.569	2025-07-11 19:40:40.604446	\N	KFfG3ILNodUjEkzazoi-j1udceqGGT7p	2025-07-11 21:16:48.317	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_t1UbxT0yytqJ	\N	\N	\N	\N	10	2025-07-11 17:37:30.191	2025-07-11 17:37:30.261649	\N	CziyoNZALgK9C2YyTa6K1_foZqFuCzqK	2025-07-11 18:07:37.371	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_u8FIUX5nBbW_	\N	\N	\N	\N	10	2025-07-11 18:07:40.14	2025-07-11 18:07:40.175564	\N	jSt6Aboqqr2MiFuxgN6Mf3LnS7KGp4JK	2025-07-11 18:07:40.14	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_5dp_J7gDQX5T	\N	\N	\N	\N	10	2025-07-11 18:07:43.439	2025-07-11 18:07:43.474247	\N	QhZ8Q4NzGR65nqOVN-q8EPUpFAHuw7Rm	2025-07-11 18:07:43.439	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_8qMRBQZoxuK_	\N	\N	\N	\N	10	2025-07-11 17:30:04.148	2025-07-11 17:30:04.223494	\N	JuiYiycH2x_mN_PGAFDDH33mz1eJF6QL	2025-07-11 17:33:36.973	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_617yJH6lbBVg	\N	\N	\N	\N	10	2025-07-11 17:35:29.143	2025-07-11 17:35:29.216867	\N	XGIkTyaZO48h9n7MhVlLnTFOD73YZtRM	2025-07-11 17:35:29.143	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ybLg8usQ4Yvu	\N	\N	\N	\N	10	2025-07-11 17:37:30.169	2025-07-11 17:37:30.247726	\N	XDu_O7gZk9xRp-nqWEXDcHk7jxqS2yoq	2025-07-11 17:37:30.169	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_uZv9gKsPE6QB	\N	\N	\N	\N	10	2025-07-11 18:10:23.888	2025-07-11 18:10:23.986283	\N	BR7uIH046N1KJ1hwuKWacflYAVzmOM1C	2025-07-11 18:10:23.888	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_acfGS0tnEWwg	\N	\N	\N	\N	10	2025-07-11 18:10:53.405	2025-07-11 18:10:53.486185	\N	ui9JVDITP6S5cmgSaxJia1JRtk9lSF87	2025-07-11 18:10:53.406	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_GzZAnQyY677k	\N	\N	\N	\N	10	2025-07-11 18:26:14.975	2025-07-11 18:26:15.044259	\N	Bd7GNP8f5lB5l37RttLOMKHBXbM1FHyY	2025-07-11 18:28:19.14	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_BYNYNOFOLCHR	\N	\N	\N	\N	10	2025-07-11 18:28:27.414	2025-07-11 18:28:27.510164	\N	wswdPO8DpciyImxhFuJc7jFtkhPSkyYx	2025-07-11 18:28:27.414	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_c8lei1OpswEf	\N	\N	\N	\N	10	2025-07-11 18:21:47.282	2025-07-11 18:21:47.351158	\N	1uHAuem3k7jnmodJm_iq-Dmm8vNhdRDP	2025-07-11 18:21:47.282	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_7FLUPQUEa7Hw	\N	\N	\N	\N	10	2025-07-11 18:23:32.511	2025-07-11 18:23:32.584731	\N	AWyl1BI04FbSCE12nUQmF9F9PPJc6cjm	2025-07-11 18:23:32.511	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Qc9qFzouwDwx	\N	\N	\N	\N	10	2025-07-11 18:10:24.39	2025-07-11 18:10:24.444904	\N	7R4pheCfEuDSOCLqa2wMII38SFhexGIV	2025-07-11 18:10:24.39	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_RKtatuAA8Q9S	\N	\N	\N	\N	10	2025-07-11 17:30:49.785	2025-07-11 17:30:49.858738	\N	h8OeCxJM-SZlU7m2UQB8mY2pp7YvJzHd	2025-07-11 17:30:49.785	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_3rOuBXVLlOIh	\N	\N	\N	\N	10	2025-07-11 17:30:55.815	2025-07-11 17:30:55.885386	\N	BSZnEasUN0YOxCbiXJYcz0Epoy5eXIAa	2025-07-11 17:30:55.815	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_hzLU40tP4AqI	\N	\N	\N	\N	10	2025-07-11 17:31:30.573	2025-07-11 17:31:30.646928	\N	wgyC1SbqGpfNnEneS_sT1KBSs9i047WJ	2025-07-11 17:31:30.573	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_u23hTJkxCA0U	\N	\N	\N	\N	10	2025-07-11 18:14:32.497	2025-07-11 18:14:32.562118	\N	O8v5A90bamL6J36DdbkTPLF-QsSXuTyT	2025-07-11 18:14:32.497	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ahGkRYe5nWFk	\N	\N	\N	\N	10	2025-07-11 18:10:23.902	2025-07-11 18:10:23.982081	\N	RjAKu7zgWro1sGVOUEgCaQn_5WCGZTWj	2025-07-11 18:10:24.506	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_9_edYQAv5tvI	\N	\N	\N	\N	10	2025-07-11 18:10:24.397	2025-07-11 18:10:24.454311	\N	gYIYHoZ4ASLYmX5fXpC3rMOkpgI7aAzM	2025-07-11 18:10:24.545	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_BnYZ_f9yrbHG	\N	\N	\N	\N	10	2025-07-11 18:10:24.399	2025-07-11 18:10:24.453604	\N	n2O_K4P2-ShOaJragrDF2akAsPtQLUjh	2025-07-11 18:10:24.559	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_GTcIOq5N2lT8	\N	\N	\N	\N	10	2025-07-11 18:11:10.438	2025-07-11 18:11:10.502208	\N	zKVp6rglRoCSHu5FbaBxZ3ojjmv53F7X	2025-07-11 18:11:10.438	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ASZOket1aXvu	\N	\N	\N	\N	10	2025-07-11 18:26:47.545	2025-07-11 18:26:47.621924	\N	GP4ON2sI1wwR8Y39xAgVRskALK8w3qPB	2025-07-11 18:26:47.545	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_E2Ntb7ftuKRX	\N	\N	\N	\N	10	2025-07-11 18:58:54.517	2025-07-11 18:58:54.656527	\N	4Dnlmz-He4ne4KwnEsqnCmTefR5h7ky-	2025-07-11 18:58:56.495	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_cYXervu7U6eY	\N	\N	\N	\N	10	2025-07-11 18:40:58.957	2025-07-11 18:40:58.993638	\N	jti9bOw_YglWQ_scw_Jo1i5LK8R6a8WQ	2025-07-11 18:40:58.957	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Ey2jmf5jIHQa	\N	\N	\N	\N	10	2025-07-11 19:33:56.796	2025-07-11 19:33:56.832631	\N	ftqUznblQzUCQ3xCRphVNISzR9yd4G_a	2025-07-11 21:18:05.556	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_0xacz9ndHQsx	\N	\N	\N	\N	10	2025-07-11 18:21:56.941	2025-07-11 18:21:57.010928	\N	H7cq46pvQJUbk9AAxrlb7F3qDV3CCWLs	2025-07-11 18:21:56.941	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_edsuEAaIrgZL	\N	\N	\N	\N	10	2025-07-11 18:10:24.425	2025-07-11 18:10:24.484302	\N	q-PxK7lmS5jqBp8VmI5dTJ1hpDDp2fc5	2025-07-11 18:26:04.42	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_9JCT-8zgMXBL	\N	\N	\N	\N	10	2025-07-11 19:31:37.584	2025-07-11 19:31:37.619537	\N	nso56jjrQIwyu-8tq9t0dqrCubVTo3cQ	2025-07-11 19:32:19.922	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_GzawwlMnjhmr	\N	\N	\N	\N	10	2025-07-11 17:23:43.216	2025-07-11 17:23:43.374805	\N	SOzLefEy35mMdkYV8D_XNQYlZmh5EDT1	2025-07-11 17:23:50.746	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_hC8_xQbzkdwo	\N	\N	\N	\N	10	2025-07-11 17:24:04.223	2025-07-11 17:24:04.295662	\N	Ftfy4gRhi6UKLjbrtweXSFQc2K4A_UOh	2025-07-11 17:24:04.223	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_IcSqSIrfzCoU	\N	\N	\N	\N	10	2025-07-11 17:24:24.423	2025-07-11 17:24:24.49554	\N	Gw3oMQvkuztQr96csL9ASHt5qFhN1AQJ	2025-07-11 17:24:24.423	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_3qwMfzKrp-Yr	\N	\N	\N	\N	10	2025-07-11 17:24:43.509	2025-07-11 17:24:43.583138	\N	VWKCL1Q6OkHhUYJGpoVWSRA2s5FEmW5q	2025-07-11 17:24:43.509	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Ny1dpmDaYy91	\N	\N	\N	\N	10	2025-07-11 18:26:20.509	2025-07-11 18:26:20.974898	\N	GXtH1V_414d5PfCes7KOIV6bWcblmxAH	2025-07-11 18:26:20.509	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_P1MVLZed3wxl	\N	\N	\N	\N	10	2025-07-11 18:12:51.44	2025-07-11 18:12:51.509227	\N	MX-rRig6HlbMHwohZvHHFM66wn5cTeZj	2025-07-11 18:12:51.44	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest__N2zi6lhpyoN	\N	\N	\N	\N	10	2025-07-11 18:22:04.324	2025-07-11 18:22:04.392894	\N	pxZRjWAq8ayYnfuWEjgAUo8YLiHzpEQ_	2025-07-11 18:22:04.324	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_rygLryKLEF98	\N	\N	\N	\N	10	2025-07-11 18:40:28.362	2025-07-11 18:40:28.462686	\N	Rm_AFhOEyY8uX4AVVlH0MCYqamRxMPfz	2025-07-11 18:58:48.9	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_y4mVwGutXv6B	\N	\N	\N	\N	10	2025-07-11 18:55:49.647	2025-07-11 18:55:49.682067	\N	ifErpihem_4KSNabI28_q6Ha4LC1UDOa	2025-07-11 19:32:21.914	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_8fydHnunUDRH	\N	\N	\N	\N	10	2025-07-11 18:26:41.599	2025-07-11 18:26:41.668115	\N	AJEZsuq04MaiAtD_uq9oZD6PjPRCTeXn	2025-07-11 18:26:41.599	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_gHGTmPOm2dAc	\N	\N	\N	\N	10	2025-07-11 18:28:28.433	2025-07-11 18:28:28.529401	\N	riORnsxvULZjwyRQNHWIzBOQ7_k-CVlw	2025-07-11 18:33:09.93	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_1ewCEU2JRqRb	\N	\N	\N	\N	10	2025-07-11 19:28:07.605	2025-07-11 19:28:07.642112	\N	2UAM8HSWKaOEPaA0lArNj9yciUn_MFFR	2025-07-11 19:33:47.966	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_EF1tTCep-DOl	\N	\N	\N	\N	10	2025-07-11 19:40:33.767	2025-07-11 19:40:33.80162	\N	LitIh9oppPUJ73ZOSdw6IvZ4f52CERkP	2025-07-11 19:40:33.767	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_DXD9GLguNARK	\N	\N	\N	\N	10	2025-07-11 19:41:02.324	2025-07-11 19:41:02.359828	\N	XfIJ-XBMciJFDPKyn9dVrQyZIn6lVTiH	2025-07-11 19:41:02.324	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_11ZJTZvq0vqd	\N	\N	\N	\N	10	2025-07-11 19:55:53.051	2025-07-11 19:55:53.08616	\N	cHLzg8WBlEz49-w_RfNbqkI7CxJGkYdp	2025-07-11 19:55:53.051	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Rb7d2HFtxFQ-	\N	\N	\N	\N	10	2025-07-11 20:01:37.702	2025-07-11 20:01:37.736506	\N	Ep7-bAKpWQCBqPvP_715KHPbh5mhkpNh	2025-07-11 20:01:37.702	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_2RlmPetz9vkF	\N	\N	\N	\N	10	2025-07-11 20:12:25.964	2025-07-11 20:12:25.999425	\N	JbfAREx0ANZ1ioMXS1KuJ8XJ8ZYwIBlS	2025-07-11 20:12:25.964	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_7HnM5yorJ8Yu	\N	\N	\N	\N	10	2025-07-11 21:14:47.363	2025-07-11 21:14:47.398416	\N	uj3ycD77PkG6VPGDcd9SUNX3L83OsHa4	2025-07-11 21:14:47.363	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_sZmp13vNkVHf	\N	\N	\N	\N	10	2025-07-11 21:23:35.647	2025-07-11 21:23:35.76293	\N	tpCaFMx200PNstwJkKqJB3jt62M9ocFK	2025-07-11 21:23:35.647	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_8tO710_NgyhU	\N	\N	\N	\N	10	2025-07-11 19:41:02.326	2025-07-11 19:41:02.360779	\N	-mKC2ASI5QZvWdG9Ibry1FRKB4swU5xk	2025-07-11 21:23:36.747	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_eJRb4vVk8QaF	\N	\N	\N	\N	10	2025-07-11 21:23:39.139	2025-07-11 21:23:39.224343	\N	Lo-s35dRHVfVavFw0dMHBo-fShBEameS	2025-07-11 21:23:39.139	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_SqwfXdoyXgeB	\N	\N	\N	\N	10	2025-07-11 21:37:09.366	2025-07-11 21:37:09.398715	\N	fzFSUQyPBA0mADiizRU5-Jj8uCn2mD0m	2025-07-11 21:37:19.699	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_s2SWJp9b2pY-	\N	\N	\N	\N	10	2025-07-11 21:30:20.832	2025-07-11 21:30:20.913268	\N	sHI4jaEchIuuy9dHvSLDO25EMpz-0NQq	2025-07-11 21:30:20.832	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_A7kv2nePwIy5	\N	\N	\N	\N	10	2025-07-11 21:32:53.403	2025-07-11 21:32:53.484066	\N	rbbJKR94qAi7hPb_AXCxGQG6a9dfAhE-	2025-07-11 21:32:53.403	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_gZx_sqLIgHyM	\N	\N	\N	\N	10	2025-07-11 21:18:13.853	2025-07-11 21:18:13.888342	\N	x92N782qIJymOX7Zj4sKR1TV3Y7ze-Sx	2025-07-11 21:18:18.774	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_cdOMbuIAyAM7	\N	\N	\N	\N	10	2025-07-11 21:35:00.457	2025-07-11 21:35:00.497374	\N	eUOHviP_VvgaqPvaNqmdC2tPWpeDUqZv	2025-07-11 22:51:52.498	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_RnYWmrIiDJG4	\N	\N	\N	\N	10	2025-07-11 21:30:24.306	2025-07-11 21:30:24.386899	\N	Aj_fXpzGYKZE09c9wF1iESHuwrswg-lb	2025-07-11 21:30:24.306	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_hB3bnFD_aent	\N	\N	\N	\N	10	2025-07-11 18:58:55.086	2025-07-11 18:58:55.218102	\N	5cZ9RnlBGAJcAbNIfLjVNIdQPs9HiM9W	2025-07-11 21:09:26.347	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ZF8uJTvA1QIO	\N	\N	\N	\N	10	2025-07-11 21:31:16.638	2025-07-11 21:31:16.673187	\N	1BNfyw24Yz8KR2ExhTo1ZCfrfJ_MNrHT	2025-07-11 21:31:16.638	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_VHdAiP-XTDaf	\N	\N	\N	\N	10	2025-07-11 21:30:28.32	2025-07-11 21:30:28.402305	\N	yCQd1yoPLCGVTgG4NBLtRfROuziUGb9E	2025-07-11 21:30:28.32	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_THAFEtjD3us8	\N	\N	\N	\N	10	2025-07-11 22:11:15.198	2025-07-11 22:11:15.233822	\N	1PGBerCNwxBxoTjvaMGpQql9G0PoeSb4	2025-07-11 23:10:34.824	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_BzW6190iH331	\N	\N	\N	\N	10	2025-07-11 21:15:23.3	2025-07-11 21:15:23.334918	\N	-6iznSmsbBU-JJVDEtqzQUGrY5RqdlWV	2025-07-11 21:15:23.3	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_wnRjRmOnVOmY	\N	\N	\N	\N	10	2025-07-11 21:35:09.556	2025-07-11 21:35:09.595256	\N	rQdDw1Ejcys73yh5ptANq14EkUXTnFzh	2025-07-11 21:35:09.556	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_tfRMgHDjTP1q	\N	\N	\N	\N	10	2025-07-11 21:35:09.573	2025-07-11 21:35:09.608233	\N	N3sM2Rg3ptdwhBJh9Lf9KkUy9FlgzN5Y	2025-07-11 21:35:09.573	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_8lgNqSxfJoz0	\N	\N	\N	\N	10	2025-07-11 21:35:09.58	2025-07-11 21:35:09.615747	\N	6Vh6I-FzlVH8ycDE7nsn0Ngg7AhP0frj	2025-07-11 21:35:09.58	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_sWEn50BVqd-_	\N	\N	\N	\N	10	2025-07-11 22:15:08.045	2025-07-11 22:15:08.080976	\N	tO7Jyg1q6Xw8SjxMm9of3MdJ5-G6WQpq	2025-07-11 22:15:08.045	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_YgAp9iEReRwe	\N	\N	\N	\N	10	2025-07-11 21:24:19.082	2025-07-11 21:24:19.164295	\N	JQxCIeW2pJq9qElhmHWZVmD5he2n1z6u	2025-07-11 21:24:19.082	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_kJTkVy01zdKS	\N	\N	\N	\N	10	2025-07-11 21:24:22.752	2025-07-11 21:24:22.855162	\N	CHldGxrvKtzCgOI3vjDe7VkTJkl2_rOb	2025-07-11 21:24:22.752	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_9xE0NwuqKD7p	\N	\N	\N	\N	10	2025-07-11 21:27:17.806	2025-07-11 21:27:17.890247	\N	S0Ze4NU4UjYoQYVZhj1WlGnKyt2heYKm	2025-07-11 21:27:17.806	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_2bxwIsPUazu9	\N	\N	\N	\N	10	2025-07-11 21:35:46.927	2025-07-11 21:35:46.95843	\N	JIGQLbVe82PL9k1qbdacjRP8ewzMGL1n	2025-07-11 21:35:46.927	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_GIFwUH-QWGfT	\N	\N	\N	\N	10	2025-07-11 21:36:20.658	2025-07-11 21:36:20.689801	\N	HuhkbbNowxmc9lLlnu9VWfWD_xycVvVR	2025-07-11 21:36:20.658	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_oi-A2Qv7GvvV	\N	\N	\N	\N	10	2025-07-11 21:27:21.227	2025-07-11 21:27:21.307718	\N	DCOly32btfZg1r1d5vV6TWMSyftxq4s_	2025-07-11 21:27:21.227	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_adJubkzQEXZE	\N	\N	\N	\N	10	2025-07-11 21:09:33.006	2025-07-11 21:09:33.099507	\N	NRvNVF6Dz8Ew8E8wKUoVzjcqFZQkuLwj	2025-07-11 21:13:59.638	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_soc0By15y3lB	\N	\N	\N	\N	10	2025-07-11 21:15:50.384	2025-07-11 21:15:50.418362	\N	vMvVYsBtaOQWY8JWk5KkRZKYrgrGPPr0	2025-07-11 21:15:50.384	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_rRMsZqS1oYht	\N	\N	\N	\N	10	2025-07-11 21:23:45.648	2025-07-11 21:23:45.684224	\N	cTBP7-POHSwBffEg8c7D2-AcU-KB_tHu	2025-07-11 21:34:51.294	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_013lKfsa3vXY	\N	\N	\N	\N	10	2025-07-11 21:27:24.08	2025-07-11 21:27:24.162307	\N	qYqRH5oMS-WT7Y47VXrwfmO6xX_sQl0R	2025-07-11 21:27:24.08	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_YVyTkz8Aq4Yx	\N	\N	\N	\N	10	2025-07-11 21:30:50.072	2025-07-11 21:30:50.151886	\N	YmMYN-o9PUYzehY1-rJuHLV5O0IcJCa0	2025-07-11 21:30:50.072	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_JfrEqthAScYj	\N	\N	\N	\N	10	2025-07-11 21:27:26.738	2025-07-11 21:27:26.819004	\N	hazzwRQz4M_aht0dooeGvI3ZhHGsfCRo	2025-07-11 21:27:26.738	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest__hn-BgVRar9v	\N	\N	\N	\N	10	2025-07-11 21:24:42.865	2025-07-11 21:24:42.948664	\N	JdGB-Ue_BC929ZVuxgfgDeaYuiZsAhu3	2025-07-11 21:24:42.865	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_UdsRffjf3K_3	\N	\N	\N	\N	10	2025-07-11 21:27:31.703	2025-07-11 21:27:31.784721	\N	cy_GZNrx64lWr9JodjYqb2iLD0n1_RhA	2025-07-11 21:27:31.703	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_vSDIMa91U2ep	\N	\N	\N	\N	10	2025-07-11 21:35:00.107	2025-07-11 21:35:00.162715	\N	i8b0bfxa_zGNE0PYG9w-M5UZ1kTpdU_O	2025-07-11 21:35:00.107	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_SSwXGgozfQ-w	\N	\N	\N	\N	10	2025-07-11 21:26:20.272	2025-07-11 21:26:20.307546	\N	fRE8fxuaQnVDFcy3eH73jeENMOe9BxxI	2025-07-11 21:26:20.272	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_bD6uMsMV-1V_	\N	\N	\N	\N	10	2025-07-11 21:27:34.942	2025-07-11 21:27:35.023187	\N	LoCeYOdYC9VZ-K2m65Iw4JfSRHD5SbrG	2025-07-11 21:27:34.942	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_zkHmoNnMa59p	\N	\N	\N	\N	10	2025-07-11 21:30:56.315	2025-07-11 21:30:56.396198	\N	TVKcOw_BDPIGp9Un1qqiwevWmuY_KkyC	2025-07-11 21:30:56.315	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_kOri5UcI1BQX	\N	\N	\N	\N	10	2025-07-11 21:31:00.411	2025-07-11 21:31:00.493876	\N	KkTu4BlzPvqvEIKO6mwF84O2FP3mKzzO	2025-07-11 21:31:00.411	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_BnRMN2B3Nhmp	\N	\N	\N	\N	10	2025-07-11 21:23:24.339	2025-07-11 21:23:24.427457	\N	IxTkan3pt3vGNiTEupMyoAyLvJhbqm77	2025-07-11 21:23:24.339	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_VVBd_D0_uTXh	\N	\N	\N	\N	10	2025-07-11 21:28:55.753	2025-07-11 21:28:55.834959	\N	4QvVggsKxfaOx2__bpkgjHRfWzHVM7wg	2025-07-11 21:28:55.753	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_qlxul44hnSgQ	\N	\N	\N	\N	10	2025-07-11 21:36:20.709	2025-07-11 21:36:20.740744	\N	8Vz7_Cng8kk3wFIv-AkDBwnywYXTrFV7	2025-07-11 21:36:20.709	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_XgMV8nYfMEkF	\N	\N	\N	\N	10	2025-07-11 21:23:29.053	2025-07-11 21:23:29.136655	\N	E0UX3h85v2FzFx7v0qgMBGZ-WxLfrXNP	2025-07-11 21:23:29.053	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_uAXVH8PY05FT	\N	\N	\N	\N	10	2025-07-11 21:14:47.286	2025-07-11 21:14:47.321583	\N	EoTRpLCQoL7FrpJ67mKqWgCsJeyWzuKl	2025-07-11 21:14:47.286	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_FFT7fEJeKk6Z	\N	\N	\N	\N	10	2025-07-11 21:36:20.886	2025-07-11 21:36:20.916719	\N	lywe4ajzq8wFiXq3VISRMojeOULypJ1d	2025-07-11 21:36:20.886	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_qNe9_R2t2xPa	\N	\N	\N	\N	10	2025-07-11 21:14:47.288	2025-07-11 21:14:47.32458	\N	ol7n_lnr1wFZM9D1qcQuGUGSYYvurNwA	2025-07-11 21:14:47.288	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_G0j3Herg74l-	\N	\N	\N	\N	10	2025-07-11 21:34:59.696	2025-07-11 21:34:59.737785	\N	r6aFRq4peQF8x0dAyhBXC8nGvYd8df7t	2025-07-11 21:35:02.049	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Bo7ndocOnvQ_	\N	\N	\N	\N	10	2025-07-11 22:48:53.026	2025-07-11 22:48:53.06061	\N	o7bdLcGK7s3DNUS6U-e4Ksy6121pl4FW	2025-07-11 22:48:53.026	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_C3N5weXV8jaJ	\N	\N	\N	\N	10	2025-07-11 21:30:12.359	2025-07-11 21:30:12.441593	\N	DGRd5nK5wM389cOF0TwlaKlS9Yr9f4tV	2025-07-11 21:30:12.359	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ZU6OvkLWKPch	\N	\N	\N	\N	10	2025-07-11 21:38:01.432	2025-07-11 21:38:01.468344	\N	afUfW5e-_RBVPRkDDrrLsEJN_RXFsxK3	2025-07-11 21:38:01.432	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ImGVD_e5fps3	\N	\N	\N	\N	10	2025-07-11 21:36:20.926	2025-07-11 21:36:20.957775	\N	kCXLpI-7aaFSpzrp4EHLnlSHRChc1cA5	2025-07-11 21:36:20.926	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_qJddshaXdmIa	\N	\N	\N	\N	10	2025-07-11 21:36:21	2025-07-11 21:36:21.032671	\N	eIZLEU0bhFv2hLvLRD8LwBrDsaGAI_EM	2025-07-11 21:36:21	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_4Is_cC28uND5	\N	\N	\N	\N	10	2025-07-11 21:36:21.219	2025-07-11 21:36:21.251703	\N	XK9KRWJbbQVJDDfQ1mzXfbl85CehZjJb	2025-07-11 21:36:21.219	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Sx5MIPBlEgE3	\N	\N	\N	\N	10	2025-07-11 23:12:06.414	2025-07-11 23:12:06.448163	\N	NgBq0ivSwM4uH6CaTLT1fuV3YV3vPVJT	2025-07-11 23:12:06.414	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest__KmPnsFSTJCj	\N	\N	\N	\N	10	2025-07-11 23:12:08.379	2025-07-11 23:12:08.424455	\N	zOi5HSwhF2JsPSmhYsbO13PtUQK9wTpI	2025-07-11 23:12:45.125	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_8_YcncpjPQg2	\N	\N	\N	\N	10	2025-07-11 23:12:35.242	2025-07-11 23:12:35.285987	\N	T1hfjJEQ4btOKwlWDbnywVWf6tAsnEdG	2025-07-11 23:12:35.242	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_yhz2t5bGrJR1	\N	\N	\N	\N	10	2025-07-11 23:12:40.111	2025-07-11 23:12:40.155012	\N	95S4Xs-Nx6fBorUpi1g6uHWEIbNqGllP	2025-07-11 23:12:40.111	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_FmJzWOolqYcY	\N	\N	\N	\N	10	2025-07-11 23:12:55.66	2025-07-11 23:12:55.706383	\N	KSlWiqRFaEkstH4Afnv_o-nEqbH4VM4u	2025-07-11 23:12:55.66	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_B6rvRsdCslG9	\N	\N	\N	\N	10	2025-07-11 23:50:07.089	2025-07-11 23:50:07.190769	\N	pMfplZgeXZHSkAAWJ2XV-pMXIdyRsp50	2025-07-11 23:50:07.541	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_gPbzBkG0g6hy	\N	\N	\N	\N	10	2025-07-11 23:24:58.094	2025-07-11 23:24:58.166716	\N	tpK8dkdEvwKhtr12iYKjfEzQe37_ipvG	2025-07-11 23:50:08.04	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Gs6leiWJVgQl	\N	\N	\N	\N	10	2025-07-11 21:34:59.976	2025-07-11 21:35:00.01288	\N	mxy6ECYLdK-9hUwHFcTxQmdXhZJegbbz	2025-07-11 23:24:28.869	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_SJyZdvHm8BqA	\N	\N	\N	\N	10	2025-07-11 23:39:20.5	2025-07-11 23:39:20.536411	\N	BDwBAH1ybz8cdKnYJM992osERYXDSEwt	2025-07-11 23:39:20.5	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_xKoESP7qPrLK	\N	\N	\N	\N	10	2025-07-11 23:39:22.528	2025-07-11 23:39:22.567964	\N	hrdQc2E6o3xzCNTr2I2jwf3bQxWGc0iT	2025-07-11 23:39:22.528	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_zX7dOF1QITbg	\N	\N	\N	\N	10	2025-07-11 23:41:07.56	2025-07-11 23:41:07.591926	\N	CezPn7NHFVCS90KnRg8Ef7hgRjiNS4SM	2025-07-11 23:41:07.56	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_nchK4xi-0zLX	\N	\N	\N	\N	10	2025-07-11 23:50:07.081	2025-07-11 23:50:07.184963	\N	_7pNjOa-nBK7w0gkuBV5TlbU2iy-wTQq	2025-07-11 23:50:07.081	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_xsda8TP5uWf_	\N	\N	\N	\N	10	2025-07-11 23:50:07.09	2025-07-11 23:50:07.193676	\N	YrC8G0Hd5Y6box68Fp6JTfKbnur3uhA7	2025-07-11 23:50:07.09	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_1Lp7zHA0T7CY	\N	\N	\N	\N	10	2025-07-11 23:50:07.088	2025-07-11 23:50:07.185516	\N	RCurJCwoup7FoLw0UtH-BVJ6AmwgmK0K	2025-07-11 23:50:07.088	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_fJpqRugosldp	\N	\N	\N	\N	10	2025-07-11 23:50:07.082	2025-07-11 23:50:07.186882	\N	ns0kMNLsqXCeJ-oyV_wm7rAliez-yliG	2025-07-11 23:50:07.082	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_BaYpGr0Dsbtt	\N	\N	\N	\N	10	2025-07-11 23:50:07.086	2025-07-11 23:50:07.188144	\N	7ThuijPLD4qT43pJI6XwpzYIHgWSAlOX	2025-07-11 23:50:07.086	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_jNwzTh6BW6aF	\N	\N	\N	\N	10	2025-07-11 23:50:07.091	2025-07-11 23:50:07.194732	\N	pqbYHt6rXdLBexdljTjxhV5eaZ9k7YX6	2025-07-11 23:50:07.091	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_JQZn6-AEM4pK	\N	\N	\N	\N	10	2025-07-11 23:50:07.092	2025-07-11 23:50:07.19441	\N	5Giqhkdv02AU3Lh2Ku0mRCF628HrBT4O	2025-07-11 23:50:07.092	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_wOq3fERU302d	\N	\N	\N	\N	10	2025-07-11 23:50:07.093	2025-07-11 23:50:07.240839	\N	evofos1pOEICfZ5H6xgTTQ-90NZQW_gW	2025-07-11 23:50:07.093	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_vGRsD9Mbw0oW	\N	\N	\N	\N	10	2025-07-11 23:12:53.644	2025-07-11 23:12:53.689925	\N	_bmoRv2GqPFx-K0C8EpSyDYt2VMLIELd	2025-07-11 23:16:31.752	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_cjy94w0v3X9y	\N	\N	\N	\N	10	2025-07-11 23:50:07.143	2025-07-11 23:50:07.245156	\N	RJ6bJc03b6eWHuH9tVZa9U77oubWH9Oh	2025-07-11 23:50:07.143	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_mIcq1sJOhA3t	\N	\N	\N	\N	10	2025-07-11 23:50:07.148	2025-07-11 23:50:07.268049	\N	Wjidy9gDFPPy6PYPEH2AAHRSRWjXmelM	2025-07-11 23:50:07.148	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_U8juq6haxYXk	\N	\N	\N	\N	10	2025-07-11 23:50:07.16	2025-07-11 23:50:07.279897	\N	P4TGwBkXzUL8Rs0QgdXOLOAy8VWpI1wq	2025-07-11 23:50:07.16	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest__6vZrN3gF3Of	\N	\N	\N	\N	10	2025-07-11 23:50:07.154	2025-07-11 23:50:07.282843	\N	gc-xijyoDg0294RtCyk-fe49A8yB63I5	2025-07-11 23:50:07.154	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_w1bdnL3mNFDV	\N	\N	\N	\N	10	2025-07-11 23:50:07.155	2025-07-11 23:50:07.28328	\N	7csRmx5bcE01aRQDrnpD5dYgWY3sKK40	2025-07-11 23:50:07.155	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_NPC7Lv-yAoTx	\N	\N	\N	\N	10	2025-07-11 23:50:07.153	2025-07-11 23:50:07.283544	\N	RFftwKQ16q1sYHpv_BK5s27v8l_0d4YQ	2025-07-11 23:50:07.153	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_zXYH7tKgLxG1	\N	\N	\N	\N	10	2025-07-11 23:50:07.151	2025-07-11 23:50:07.283876	\N	HjQ6_kyo9QvLMk9weoKjsBCRPorbOxuQ	2025-07-11 23:50:07.151	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_mAqRC0fkGOAD	\N	\N	\N	\N	10	2025-07-11 23:50:07.159	2025-07-11 23:50:07.284312	\N	J4BQZqGG5IuPUmT0nHq-EYoSRPcevCtd	2025-07-11 23:50:07.159	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_vshSK30tuKzT	\N	\N	\N	\N	10	2025-07-11 23:50:07.156	2025-07-11 23:50:07.284639	\N	ByDMF3E3MUdedHS9pwMjEaC_spDG7u7T	2025-07-11 23:50:07.156	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_iyfW-D6HzD-S	\N	\N	\N	\N	10	2025-07-11 23:50:07.161	2025-07-11 23:50:07.306711	\N	AKy5atC8na3mweAbIvgYuX4bvQlcJjUB	2025-07-11 23:50:07.698	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_FiyGoqDl5ASe	\N	\N	\N	\N	10	2025-07-11 23:50:07.208	2025-07-11 23:50:07.311352	\N	X8tFBpC7eSy_IqLX85UG1gLp2PuPR2Y1	2025-07-11 23:50:07.208	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_bRk6Nc0R_dv9	\N	\N	\N	\N	10	2025-07-12 02:28:26.456	2025-07-12 02:28:26.49579	\N	QKsMkN-NAX-2nBlbF5SQAee5AkCLSN1H	2025-07-12 16:14:01.475	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_rBUNQY4Lrk4I	\N	\N	\N	\N	10	2025-07-12 01:23:14.031	2025-07-12 01:23:14.292355	\N	TTh0SkhTfs0DFDN_cAp4j1rKtlNoEcdY	2025-07-12 02:21:59.127	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_i8CRDKz_iWoa	\N	\N	\N	\N	10	2025-07-12 02:22:36.456	2025-07-12 02:22:36.489458	\N	fKaKGu8pdSrp10pF59r37yAZaD9T9biJ	2025-07-12 02:22:36.456	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_JMmmLQZX9vNW	\N	\N	\N	\N	10	2025-07-12 00:51:04.756	2025-07-12 00:51:04.842309	\N	VawZeg1MjZsnIN4Ao9BcVHifgvEdoN5f	2025-07-12 00:56:22.999	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_n0GqSHyu0ZJW	\N	\N	\N	\N	10	2025-07-12 01:41:13.462	2025-07-12 01:41:13.507512	\N	NePEhZI77TdMuV7V9upNXOF3b_FeJIoP	2025-07-12 01:41:13.462	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_-OaJncagiVh_	\N	\N	\N	\N	10	2025-07-12 01:53:37.622	2025-07-12 01:53:37.660432	\N	eW2MzWR5ojLI8LgUYFVxDHCkIfWxk4xN	2025-07-12 01:53:37.622	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_SjwGUWbA1Pni	\N	\N	\N	\N	10	2025-07-11 23:50:07.212	2025-07-11 23:50:07.332833	\N	ZPdng7UXC-puL8BqS-1ZllwYMYl-fvQV	2025-07-11 23:50:08.498	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_9M0Vceh63zJv	\N	\N	\N	\N	10	2025-07-11 23:52:23.23	2025-07-11 23:52:23.32054	\N	UpjmJONp0K256sisw8uu1VjfYfZFCgI9	2025-07-11 23:52:23.23	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_9oDRFOa2OkF4	\N	\N	\N	\N	10	2025-07-12 01:03:29.27	2025-07-12 01:03:29.470345	\N	QzOpf7x37vCKPpFvr0aFQyL9QkiZhNsj	2025-07-12 01:13:45.374	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_zctpGqPR49RH	\N	\N	\N	\N	10	2025-07-12 01:13:51.505	2025-07-12 01:13:51.750811	\N	3BMA74F6_NcSU6IQGtz76DBuc0hvKLsC	2025-07-12 01:13:51.505	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_t1QgfyUuN_3B	\N	\N	\N	\N	10	2025-07-12 02:07:21.557	2025-07-12 02:07:21.600621	\N	XLZ2QM57Luo67Q64EzFzBrkVhHimWFna	2025-07-12 02:07:21.557	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_3OtpfLchqh90	\N	\N	\N	\N	10	2025-07-12 02:31:06.322	2025-07-12 02:31:06.366948	\N	NuWnhtg5dZV93QcfwdPwMTtU8ph_w2PF	2025-07-12 02:31:06.322	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_uJi95-2J3a62	\N	\N	\N	\N	10	2025-07-12 01:13:51.868	2025-07-12 01:13:52.110784	\N	Pa31wRgSvi8v2NM537ERDorqw89E4793	2025-07-12 01:14:00.004	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_nZv475QWhP6z	\N	\N	\N	\N	10	2025-07-12 01:31:33.655	2025-07-12 01:31:33.697837	\N	ffxbdeK8rer8d_0souHNw3thttDoKXZL	2025-07-12 02:27:41.351	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_XU7tqi2eXnwI	\N	\N	\N	\N	10	2025-07-12 02:28:26.191	2025-07-12 02:28:26.226568	\N	HVN34_V60FYf8poV_fHICZ1sgMptoYQn	2025-07-12 02:28:26.634	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_lpyC02NGjBse	\N	\N	\N	\N	10	2025-07-12 00:58:10.615	2025-07-12 00:58:10.777526	\N	be47t77gP8xAZl4FRIPXj8AiJSEYp2eL	2025-07-12 01:03:24.201	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_jqAQTtWPkoam	\N	\N	\N	\N	10	2025-07-12 01:03:28.564	2025-07-12 01:03:28.748502	\N	EdMEdVauYbdMs6wcf1y_K_XyqGF-Tdac	2025-07-12 01:03:28.564	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_HyBRKEOSdKNB	\N	\N	\N	\N	10	2025-07-12 00:56:29.577	2025-07-12 00:56:29.739221	\N	BisoyLmept67leQeh2bbVVSzG9GNzeGe	2025-07-12 00:58:04.034	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_2xsZgnQ70abv	\N	\N	\N	\N	10	2025-07-12 02:14:25.112	2025-07-12 02:14:25.149212	\N	D9_uzvb-SgOQPShX4WzOA3k86sHBiFri	2025-07-12 02:14:25.112	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_He0WXBlGsXfg	\N	\N	\N	\N	10	2025-07-12 01:24:04.518	2025-07-12 01:24:04.560195	\N	O-7iORD7n7ZFRS8X_LTlN6EKrcskG-5N	2025-07-12 01:24:04.518	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ib_MNWmYQm8K	\N	\N	\N	\N	10	2025-07-12 00:58:17.176	2025-07-12 00:58:17.341993	\N	SNoEZDg_0NLpKtBIwkm5P_-I2vzHl5yn	2025-07-12 00:58:17.176	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_TdXZUAL51F5Y	\N	\N	\N	\N	10	2025-07-12 01:15:06.401	2025-07-12 01:15:06.643766	\N	LQ-sBi_J6hsIXFWf4v16NlT6-YGcc6La	2025-07-12 01:20:44.4	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_oVVTJAQWBsN3	\N	\N	\N	\N	10	2025-07-12 02:30:39.275	2025-07-12 02:30:39.319632	\N	GsJClZsRUwuzSfu44w1AhvLIilyx5bLJ	2025-07-12 02:30:39.275	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_PRNl9AH8kMjw	\N	\N	\N	\N	10	2025-07-12 02:51:58.397	2025-07-12 02:51:58.442132	\N	zNC3CBQBs4meFrTnTdkYRS9avM3fStxq	2025-07-12 03:33:39.395	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_xe2QVRC2WurG	\N	\N	\N	\N	10	2025-07-12 03:44:55.029	2025-07-12 03:44:55.073752	\N	PjV7z9Sgp-SLwnyKAPppHAtLSfiFcHzZ	2025-07-12 03:44:55.029	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_qIpatKU11glc	\N	\N	\N	\N	10	2025-07-12 03:49:50.46	2025-07-12 03:49:50.497703	\N	y8kz6NI_Ux8D6vdkQaTDo6YWsY4QHDMc	2025-07-12 03:49:50.46	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_QZCgMH9OLBtT	\N	\N	\N	\N	10	2025-07-12 04:09:01.684	2025-07-12 04:09:01.720477	\N	1ngS1MdhcAosP5v0ZDUfQMb1lfBRDh5p	2025-07-12 04:09:01.684	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_RJvOuXeK0UVa	\N	\N	\N	\N	10	2025-07-12 04:09:23.397	2025-07-12 04:09:23.441659	\N	AhPTI906VHqu-708iahfvEWpWBQxjRuA	2025-07-12 04:09:23.397	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_yLMjajDrmRSC	\N	\N	\N	\N	10	2025-07-12 04:10:37.11	2025-07-12 04:10:37.152806	\N	1WvN_6FW99iFXwKbMewul3xmdSn5hzqs	2025-07-12 04:10:37.11	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_DIdVWXraWJ19	\N	\N	\N	\N	10	2025-07-12 04:37:41.95	2025-07-12 04:37:41.983353	\N	9lwLw1lUcUuamH0Bm-zjNKYot-p7gVtN	2025-07-12 04:37:41.95	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_4yI6K4mUlmGI	\N	\N	\N	\N	10	2025-07-12 05:18:06.417	2025-07-12 05:18:06.451312	\N	F0wJB9mbsdltSp0rTovp4nm__nqfa0DC	2025-07-12 05:18:06.417	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_sZBUDTNvoPgI	\N	\N	\N	\N	10	2025-07-12 05:26:52.519	2025-07-12 05:26:52.553787	\N	aZptyPNdDyN0atEJ9Hl-hXfoGVVZJFDT	2025-07-12 05:26:59.24	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_rY3EcbaGfM8l	\N	\N	\N	\N	10	2025-07-12 06:28:44.138	2025-07-12 06:28:44.173404	\N	WNzjiYcK9HffIIB38RelknGUP30b-D0m	2025-07-12 06:28:44.138	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_9CAVdzuTWVsl	\N	\N	\N	\N	10	2025-07-12 06:33:23.318	2025-07-12 06:33:23.350738	\N	bfiqoTh-aSysP-x3kcAIjHY8wrvhaj3g	2025-07-12 06:33:23.318	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_xot-N0OkPxSE	\N	\N	\N	\N	10	2025-07-12 06:46:52.484	2025-07-12 06:46:52.517255	\N	UGvZfnv957o1SkO1j8E44OA80RfxX8SQ	2025-07-12 06:46:52.484	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_de8hoKoY0IUT	\N	\N	\N	\N	10	2025-07-12 07:10:17.716	2025-07-12 07:10:17.751659	\N	WBYdV-ScgHVd1rw5nGFxNNYFp3k1Hk5T	2025-07-12 07:10:17.716	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_x2-e0p0kVhTy	\N	\N	\N	\N	10	2025-07-12 07:10:34.371	2025-07-12 07:10:34.408179	\N	Q3dBGgynpnRVIBjhDHoNHJLMxT3GUi0p	2025-07-12 07:10:34.371	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_4FiYTEst9Ouc	\N	\N	\N	\N	10	2025-07-12 07:11:00.574	2025-07-12 07:11:00.60889	\N	lB0NMNjCj-otf7hb9SSCQ5NRICkYuRdc	2025-07-12 07:11:00.574	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest__tjr9Vy99GLY	\N	\N	\N	\N	10	2025-07-12 07:23:15.375	2025-07-12 07:23:15.409499	\N	ZtQ1ZU7lCcQYehlQ4uBprmH-YTiOZzlj	2025-07-12 07:23:15.375	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_6e01cHoxUW2v	\N	\N	\N	\N	10	2025-07-12 07:32:47.473	2025-07-12 07:32:47.505929	\N	KAu2R2Szq5nTE20TuGYJNzLKZlyL1S3C	2025-07-12 07:32:47.473	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_uyqTwA_YNL_s	\N	\N	\N	\N	10	2025-07-12 07:32:47.709	2025-07-12 07:32:47.742147	\N	EIF2TRkUzNUjoMk8m164mcNxTovEq7tJ	2025-07-12 07:32:47.709	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_WKfC5eAjRHJX	\N	\N	\N	\N	10	2025-07-12 08:26:48.172	2025-07-12 08:26:48.204687	\N	mr-qUXwsDJeeafLhKAZsrio7Lt2hx-IK	2025-07-12 08:26:48.172	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_wBib5y_vWJFU	\N	\N	\N	\N	10	2025-07-12 08:27:48.453	2025-07-12 08:27:48.48405	\N	WlcEXzmg1nGrjSF7f9TRIVNWGTN7j6ML	2025-07-12 08:27:48.453	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_pt589tF4_z2C	\N	\N	\N	\N	10	2025-07-12 08:48:51.531	2025-07-12 08:48:51.56313	\N	LtE48ZqZJv14EWxWwOpeRmvShhifKVbc	2025-07-12 08:48:51.531	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_C0FHk_3IqcQf	\N	\N	\N	\N	10	2025-07-12 09:03:03.569	2025-07-12 09:03:03.601614	\N	MwoLktAW3HWrAyET2dIumrFfy2SFTy8U	2025-07-12 09:03:03.569	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_NAUKdQtwu4B9	\N	\N	\N	\N	10	2025-07-12 09:36:31.562	2025-07-12 09:36:31.596572	\N	7jxPozEhUe7mcP8yueics6mlTJZrxhNy	2025-07-12 09:36:31.562	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_lKq94nsQYUSl	\N	\N	\N	\N	10	2025-07-12 09:49:55.233	2025-07-12 09:49:55.268284	\N	c5kfsbJl10Wg5vbCP48-oi1RB0CJhld2	2025-07-12 09:49:55.233	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_1LwWPQI2EZGw	\N	\N	\N	\N	10	2025-07-12 10:29:39.648	2025-07-12 10:29:39.683124	\N	SjPQLieeFxX-iJO-RnfGHAUsipPPV-m5	2025-07-12 10:29:39.648	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_VST6XeeIL2bL	\N	\N	\N	\N	10	2025-07-12 10:29:40.454	2025-07-12 10:29:40.48882	\N	RzVYIfAYV_b7sv9eVfzaioqBFg3ZinPg	2025-07-12 10:29:40.454	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ceBA4H_Uy1kk	\N	\N	\N	\N	10	2025-07-12 10:49:40.663	2025-07-12 10:49:40.697031	\N	8WACUB_t1P8kmNGnnoKiXtIVBgamvM7X	2025-07-12 10:49:40.663	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_hke8Dupw6MnS	\N	\N	\N	\N	10	2025-07-12 11:06:54.031	2025-07-12 11:06:54.0633	\N	odaW9QNN6tV95Tfgu-RveRn_EZg7Xmms	2025-07-12 11:08:19.25	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_E6ssViNbdUST	\N	\N	\N	\N	10	2025-07-12 11:36:16.792	2025-07-12 11:36:16.826631	\N	bQxTe5_zIFHj4WQt9uv6bHINO1v7mop8	2025-07-12 11:36:16.792	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_zN-7i7qNxVu7	\N	\N	\N	\N	10	2025-07-12 12:05:52.299	2025-07-12 12:05:52.333647	\N	bwkwtl50HhrDwLfb3X3ogq1e3_A10PLB	2025-07-12 12:05:52.299	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_D9sTZ9_l7Mjf	\N	\N	\N	\N	10	2025-07-12 12:06:09.215	2025-07-12 12:06:09.24982	\N	Z34V5Y7-sPGRNmRhw06NZCsI0vYyfZ_y	2025-07-12 12:06:09.215	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_uX06CGd1dd3J	\N	\N	\N	\N	10	2025-07-12 12:32:52.365	2025-07-12 12:32:52.396191	\N	q42H9qx7avJWKHB7N9vJwVS44pvm09vk	2025-07-12 12:32:52.365	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_gdn90YeXEld4	\N	\N	\N	\N	10	2025-07-12 12:58:30.682	2025-07-12 12:58:30.714867	\N	tXLRoOAJQs2uWq7U-uCWEXkbgb1Elbot	2025-07-12 12:58:30.682	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_IMDJ6oRpbfc1	\N	\N	\N	\N	10	2025-07-12 13:02:48.355	2025-07-12 13:02:48.387629	\N	9Qtlgc7yC-B_pURSci9XqUJtf5NbUiP7	2025-07-12 13:02:48.355	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_1Kl9Fqx0rfjN	\N	\N	\N	\N	10	2025-07-12 13:02:48.647	2025-07-12 13:02:48.679883	\N	Ypsa8fFb39epvEClImZ_SQmJaxC4QJU8	2025-07-12 13:02:48.647	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_kncsEWNvhUEQ	\N	\N	\N	\N	10	2025-07-12 13:11:26.174	2025-07-12 13:11:26.209601	\N	3Z-ilemuu_HNoKwNMoD47Sap064hKRwi	2025-07-12 13:11:26.174	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_UAOztkbHcgc2	\N	\N	\N	\N	10	2025-07-12 13:47:26.534	2025-07-12 13:47:26.568163	\N	yaO4N7vPCgx33O6Wr28mOzhjUxOHtFlg	2025-07-12 13:47:26.534	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_nkhIRxMsSKk2	\N	\N	\N	\N	10	2025-07-12 14:00:56.754	2025-07-12 14:00:56.784916	\N	Ajht1nEG8kMeLppy7N8lZxl501E2yGVy	2025-07-12 14:00:56.754	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_oFO7m79uqLT_	\N	\N	\N	\N	10	2025-07-12 15:44:30.837	2025-07-12 15:44:30.871294	\N	1GC-OIpittUEa_pkbBHlnuPCTcNYMzf2	2025-07-12 15:44:30.837	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_PGiCIWjLuXB4	\N	\N	\N	\N	10	2025-07-12 15:45:45.511	2025-07-12 15:45:45.546587	\N	KH1tZZkN0q64_9N3wTygePuTU1qd44Fu	2025-07-12 15:45:45.511	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest__SEsdGVBJEiv	\N	\N	\N	\N	10	2025-07-12 15:51:36.068	2025-07-12 15:51:36.102367	\N	zrzkdUgwpx4hSZnMQf4YoXlLvBGm73BJ	2025-07-12 15:51:36.068	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_1jtnnRF7LaXr	\N	\N	\N	\N	10	2025-07-12 15:51:37.513	2025-07-12 15:51:37.549508	\N	ZxSrNb4yX7qjHLLyj5C6hEnsGZHAou-c	2025-07-12 15:51:37.513	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_yoGjPPQplcTd	\N	\N	\N	\N	10	2025-07-12 15:57:37.152	2025-07-12 15:57:37.185068	\N	fZnDhuNu0uy5Fbz5actFRVTcl7qqfZMW	2025-07-12 15:57:37.152	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_EGdDJ5RLhMo1	\N	\N	\N	\N	10	2025-07-12 16:11:05.144	2025-07-12 16:11:05.177692	\N	HzklI_ISDzef3rB6cfMh6CglKglwElMy	2025-07-12 16:11:05.144	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Wi28NNog6nLp	\N	\N	\N	\N	10	2025-07-12 16:12:48.018	2025-07-12 16:12:48.048702	\N	NKy5eBhYRhzv0ANXTO4rLw9SYBduzwJc	2025-07-12 16:12:48.018	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_3-yrRroTIdlN	\N	\N	\N	\N	10	2025-07-12 16:12:48.256	2025-07-12 16:12:48.287203	\N	BOxQ4BCPNpqGQWRk7vp9AGBIK-R1siIb	2025-07-12 16:12:48.256	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_78X3PYhTxcug	\N	\N	\N	\N	10	2025-07-12 16:12:48.493	2025-07-12 16:12:48.524925	\N	GiOz_GA8nFE1FVoV37UloiI2kB1UuqRP	2025-07-12 16:12:48.493	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_rFDGRdF4J7oL	\N	\N	\N	\N	10	2025-07-12 16:12:48.733	2025-07-12 16:12:48.763583	\N	UEmX8z0ryo4O20evCPHX-O_WHJMQePJp	2025-07-12 16:12:48.733	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_QUCwv5ytk0m7	\N	\N	\N	\N	10	2025-07-12 16:12:48.971	2025-07-12 16:12:49.003183	\N	7U_5AeC2u1rx46eYZHQiHsJeDmTftfDB	2025-07-12 16:12:48.971	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_74R5gLwPaFyW	\N	\N	\N	\N	10	2025-07-12 16:12:49.211	2025-07-12 16:12:49.243053	\N	Pb9lxpNsIs4KwQRXxB7bGX_4oHkZD7oA	2025-07-12 16:12:49.211	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_B4EUWQs96m-F	\N	\N	\N	\N	10	2025-07-12 16:12:49.45	2025-07-12 16:12:49.482399	\N	ZceD7SGf25EkjhFv0mcO-sqQ_THs4W_N	2025-07-12 16:12:49.45	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_oI_eTHSqDf1t	\N	\N	\N	\N	10	2025-07-12 16:12:49.69	2025-07-12 16:12:49.723275	\N	M5Qrrlv4wc007bMf049ML5C8ZLVpWjpQ	2025-07-12 16:12:49.69	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_LYf6qPyIzk1d	\N	\N	\N	\N	10	2025-07-12 16:12:49.929	2025-07-12 16:12:49.960825	\N	R2cRQBCA--3kOzBr5_2uMUOfAt1KT0kz	2025-07-12 16:12:49.929	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Z9zv5kFId9XE	\N	\N	\N	\N	10	2025-07-12 16:12:50.17	2025-07-12 16:12:50.201552	\N	tJ9TeMPw0iswjqUhUop9Tlcy4at27C3t	2025-07-12 16:12:50.17	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_sdqHvKUfjMDk	\N	\N	\N	\N	10	2025-07-12 16:12:50.406	2025-07-12 16:12:50.438629	\N	8rfZX4UcgQ640-2bf5PkmmOWy3UgI63Z	2025-07-12 16:12:50.406	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_2cNBoYwAe2B8	\N	\N	\N	\N	10	2025-07-12 16:12:50.644	2025-07-12 16:12:50.676087	\N	79obG2LgOdBy2K2E-0cdeVpn42Q31RYA	2025-07-12 16:12:50.644	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_NRTuxauNoGwc	\N	\N	\N	\N	10	2025-07-12 16:12:50.88	2025-07-12 16:12:50.91235	\N	5-bCTB0uVYG80Qh1bjZaI6Xpl1IQvU-s	2025-07-12 16:12:50.88	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_8HRlZjYAsaMV	\N	\N	\N	\N	10	2025-07-12 16:12:51.116	2025-07-12 16:12:51.148704	\N	wnbrgYR-9bCrquVYEiNmWKqbIF3S69a3	2025-07-12 16:12:51.116	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_xOcCuJSefXjX	\N	\N	\N	\N	10	2025-07-12 16:12:51.352	2025-07-12 16:12:51.382681	\N	LulD0kViaRW1OC3tv-4zqSmotX5s8QCp	2025-07-12 16:12:51.352	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_n2Dprfosu0ad	\N	\N	\N	\N	10	2025-07-12 16:12:51.586	2025-07-12 16:12:51.616832	\N	1G7BtBzrt-xEwpZhAHdsOm8wYC21DW1Y	2025-07-12 16:12:51.586	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_7GwTWv3e2nSo	\N	\N	\N	\N	10	2025-07-12 16:12:51.821	2025-07-12 16:12:51.854225	\N	31h2bI9JxJENaKMRvRDhU_AkquE5NLkI	2025-07-12 16:12:51.821	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_PuOe7IfrfOVo	\N	\N	\N	\N	10	2025-07-12 16:12:52.059	2025-07-12 16:12:52.160979	\N	nziZaA1JUhJ9mGbraBocXVTdqTi08UTN	2025-07-12 16:12:52.059	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_SMA5rDvoDeR7	\N	\N	\N	\N	10	2025-07-12 16:12:52.365	2025-07-12 16:12:52.396438	\N	lYn6nevQey5UHfbwfTD7vFUMB2qqeQqm	2025-07-12 16:12:52.365	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_jRNIv0IXLA6c	\N	\N	\N	\N	10	2025-07-12 16:12:52.601	2025-07-12 16:12:52.632949	\N	YOJPB8hDmdN4JTuM8kw_8YZgBXtRLs3f	2025-07-12 16:12:52.601	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_BKcG1cFxLzl0	\N	\N	\N	\N	10	2025-07-12 16:12:52.85	2025-07-12 16:12:52.881965	\N	nRUbTlocdpPx14-NgwM-MdGAHDfzmeAK	2025-07-12 16:12:52.85	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_fhz12RKfOLOx	\N	\N	\N	\N	10	2025-07-12 16:12:53.085	2025-07-12 16:12:53.117265	\N	uoxP97xd_5G-YTTi458rY1F5fQvKXw07	2025-07-12 16:12:53.085	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_uYJRA-r4vibP	\N	\N	\N	\N	10	2025-07-12 16:12:53.33	2025-07-12 16:12:53.362116	\N	VY-XuGlFewNCAfVhIW0rAG8Rm86dq5HZ	2025-07-12 16:12:53.33	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_hTrx7f4qs9q9	\N	\N	\N	\N	10	2025-07-12 16:12:53.571	2025-07-12 16:12:53.60319	\N	cth6gYzNsf1zJMKZ_DMECLBWZT8IkbY-	2025-07-12 16:12:53.571	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_b6quTrSgW45A	\N	\N	\N	\N	10	2025-07-12 16:12:53.808	2025-07-12 16:12:53.83933	\N	Wl56pNF-oh_cNoa4gyF-93xCEzoOjGaQ	2025-07-12 16:12:53.808	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_TIsgj3WqOPCk	\N	\N	\N	\N	10	2025-07-12 16:12:54.047	2025-07-12 16:12:54.079173	\N	vsKOY2rde9sAqCcUc6llXInuxzbSQiu9	2025-07-12 16:12:54.047	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_8R-Pi9pyYVCT	\N	\N	\N	\N	10	2025-07-12 16:12:54.288	2025-07-12 16:12:54.32074	\N	LjLf6aQU5WIZt3y9EDxpLTxOJPMYiPrk	2025-07-12 16:12:54.288	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_T7rh-TxTclZK	\N	\N	\N	\N	10	2025-07-12 16:12:54.524	2025-07-12 16:12:54.555927	\N	PpGeApOt5kelB5wK8YfJU2WTX_BQnV1f	2025-07-12 16:12:54.524	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_B-oShJKKz8yO	\N	\N	\N	\N	10	2025-07-12 16:12:54.763	2025-07-12 16:12:54.795275	\N	TU94CpPcuPOu309yro0SXRywM4hLpndL	2025-07-12 16:12:54.763	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_kq7-Gw48_Cm-	\N	\N	\N	\N	10	2025-07-12 16:12:55.016	2025-07-12 16:12:55.04831	\N	yvdOYNdD8BGqhlbo_jO_Qr3ir2yvWTDp	2025-07-12 16:12:55.016	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_2kl0B6yHaCE7	\N	\N	\N	\N	10	2025-07-12 16:12:55.253	2025-07-12 16:12:55.284676	\N	4f_EH2MBMcte65Y50WsLghkoXnCMRAGX	2025-07-12 16:12:55.253	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ibKqE8Jri22c	\N	\N	\N	\N	10	2025-07-12 16:12:55.49	2025-07-12 16:12:55.521368	\N	zkfUqRCpg-ZuS2_60LqpVkogUEa5wQx_	2025-07-12 16:12:55.49	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest__gTMEiWCKXvu	\N	\N	\N	\N	10	2025-07-12 16:12:55.725	2025-07-12 16:12:55.756727	\N	ZfgSu_Uqr8MYNwrHg626aVv7e1yimRmE	2025-07-12 16:12:55.725	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_WuU0fsSV48Wd	\N	\N	\N	\N	10	2025-07-12 16:12:55.96	2025-07-12 16:12:55.992027	\N	P3dw2F4mu0D8MJ0HTmWCS30Cy7JIQERq	2025-07-12 16:12:55.96	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_XYq_oZV2JC6M	\N	\N	\N	\N	10	2025-07-12 16:12:56.198	2025-07-12 16:12:56.230313	\N	5M2_I1Bw5TBv1YhOWiFtdd6Gt4lt9dxR	2025-07-12 16:12:56.198	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_TYgL1pWmk_sx	\N	\N	\N	\N	10	2025-07-12 16:12:56.435	2025-07-12 16:12:56.467153	\N	jOA90bLzYuxxP-eBREGspd3EBgSHTd-z	2025-07-12 16:12:56.435	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_CFkBgQxJXGr7	\N	\N	\N	\N	10	2025-07-12 16:12:56.673	2025-07-12 16:12:56.705135	\N	H4pPMCyFKmQddqGHabdt526bgWLIGlV_	2025-07-12 16:12:56.673	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_juOje8NmjerK	\N	\N	\N	\N	10	2025-07-12 16:12:56.909	2025-07-12 16:12:56.999567	\N	_VpNlhfPxMA9UUCvdmGNaITBLWV0rYVB	2025-07-12 16:12:56.909	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_3-a58WG-DAfM	\N	\N	\N	\N	10	2025-07-12 16:12:57.206	2025-07-12 16:12:57.237724	\N	fs0DjXqw_iVD0SbhvsCxbyHVU16ZYVaz	2025-07-12 16:12:57.206	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_7hPKYWRom7kE	\N	\N	\N	\N	10	2025-07-12 16:12:57.442	2025-07-12 16:12:57.472891	\N	s852jI62sp-djvFX7WnHMjvGCKQU3jSe	2025-07-12 16:12:57.442	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_WjSFLnOXhZwc	\N	\N	\N	\N	10	2025-07-12 16:12:57.676	2025-07-12 16:12:57.707996	\N	7gQr9n2eqIyPJWeqItJzpkzTNW3OYl26	2025-07-12 16:12:57.676	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_yqM3EkiAVUkY	\N	\N	\N	\N	10	2025-07-12 16:12:57.912	2025-07-12 16:12:57.944109	\N	koh0zHrHIh42KfuchOqx7_WQOBuR67Zk	2025-07-12 16:12:57.912	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_kU2ZdAGvx7-e	\N	\N	\N	\N	10	2025-07-12 16:12:58.15	2025-07-12 16:12:58.181487	\N	vnAFqRUt0clov53o3W2BxkV_Ry-hd_wV	2025-07-12 16:12:58.15	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_BkAbGrC2k4tU	\N	\N	\N	\N	10	2025-07-12 16:12:58.386	2025-07-12 16:12:58.418348	\N	WLTE_VVvEXhTf5U7rThbz3Vh7Le3pVRx	2025-07-12 16:12:58.386	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_7QNWa8nICMG9	\N	\N	\N	\N	10	2025-07-12 16:12:58.628	2025-07-12 16:12:58.65998	\N	KtVe-PLqJU_qjGvuOhdaKLtg-N6JskMN	2025-07-12 16:12:58.628	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_9xxF9DN-TNNO	\N	\N	\N	\N	10	2025-07-12 16:12:58.865	2025-07-12 16:12:58.896038	\N	-Zlb6cRHvRpTtr5MaWgFgfdi3bSgSLRa	2025-07-12 16:12:58.865	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_XP4OOi6p9Bwa	\N	\N	\N	\N	10	2025-07-12 16:12:59.1	2025-07-12 16:12:59.131188	\N	dtVqhVXKCqIPxPh-qRNylPlTA4sjh93p	2025-07-12 16:12:59.1	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_WqqsraEhj5qv	\N	\N	\N	\N	10	2025-07-12 16:12:59.335	2025-07-12 16:12:59.367345	\N	Z4LLYOxY6KEMhCvfb0kMV1X6CHqRw12h	2025-07-12 16:12:59.335	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_vNxAbIuppcM3	\N	\N	\N	\N	10	2025-07-12 16:12:59.571	2025-07-12 16:12:59.603005	\N	bXiT3BCftCv5h7ydkiq8nO4Y1ifiLbKm	2025-07-12 16:12:59.571	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_zzsV0JYYFqSC	\N	\N	\N	\N	10	2025-07-12 16:12:59.808	2025-07-12 16:12:59.901573	\N	qVPTMmZM7D543_VIJlG6XrWjWa872roE	2025-07-12 16:12:59.808	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_7xtolZxu2ncm	\N	\N	\N	\N	10	2025-07-12 16:13:00.106	2025-07-12 16:13:00.13696	\N	2gi1Y0yn0fZCWJBzB8EKoejJ7e5z0xpM	2025-07-12 16:13:00.106	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ntD0K6eA7JJJ	\N	\N	\N	\N	10	2025-07-12 16:13:00.351	2025-07-12 16:13:00.383583	\N	qkBPRcdyYjtATXUHXtaWVrvN8YZBjXud	2025-07-12 16:13:00.351	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Yuyxl3ioO7j0	\N	\N	\N	\N	10	2025-07-12 16:13:00.591	2025-07-12 16:13:00.622569	\N	NMri3-n77cswWY41uRM002UNqmJc2dh8	2025-07-12 16:13:00.591	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_axOIphWxRPmh	\N	\N	\N	\N	10	2025-07-12 16:13:00.829	2025-07-12 16:13:00.860971	\N	XQJmE_D-uDl0CzdDJpZbW1kFv9ulw4Pd	2025-07-12 16:13:00.829	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_z0qN8brz5Lyy	\N	\N	\N	\N	10	2025-07-12 16:13:01.068	2025-07-12 16:13:01.100248	\N	ryHBCQFQluTxaPpNFwJzNJ5brgp1Jayn	2025-07-12 16:13:01.068	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_GHHS9Px-7c9H	\N	\N	\N	\N	10	2025-07-12 16:13:01.313	2025-07-12 16:13:01.345537	\N	23u_g3igPrIu3ceTXx11qnKoEImrZ0Ni	2025-07-12 16:13:01.313	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Blh8ofA5TOBT	\N	\N	\N	\N	10	2025-07-12 16:13:01.581	2025-07-12 16:13:01.613114	\N	vYP50uy63uR9dc60Yasgjbi0n69MrXXl	2025-07-12 16:13:01.581	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_d_onax0XxYwN	\N	\N	\N	\N	10	2025-07-12 16:13:01.835	2025-07-12 16:13:01.867837	\N	LIahESpIVpjrXIyWqVMhG9hV7sxjlqWt	2025-07-12 16:13:01.835	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_dyoFFsaW0khr	\N	\N	\N	\N	10	2025-07-12 16:13:02.092	2025-07-12 16:13:02.125169	\N	P92j69bgRXW76EfYJZqxBFvcg6wWnlwB	2025-07-12 16:13:02.092	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_PS2inCM8IoAo	\N	\N	\N	\N	10	2025-07-12 16:13:02.445	2025-07-12 16:13:02.476904	\N	Fqn4jBT9yA0uMUjL6LUkz0cpC61TTSq1	2025-07-12 16:13:02.445	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Sk3OlVaBDXFs	\N	\N	\N	\N	10	2025-07-12 16:13:02.697	2025-07-12 16:13:02.731268	\N	RgVSaF9dSwnRxfkbb-AR-uXlyo-AABaJ	2025-07-12 16:13:02.697	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_VvH2vyCOg6ne	\N	\N	\N	\N	10	2025-07-12 16:13:02.956	2025-07-12 16:13:02.988623	\N	sS8elAN4gGYAdf1rzhJm1hfxV0cxrzS7	2025-07-12 16:13:02.956	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_GbANcGO9iUJG	\N	\N	\N	\N	10	2025-07-12 16:13:03.206	2025-07-12 16:13:03.238242	\N	2-RhyH1RiD3X_1fZwprH0quiamzZJmwy	2025-07-12 16:13:03.206	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_E7VZx6xHZt0l	\N	\N	\N	\N	10	2025-07-12 16:13:03.453	2025-07-12 16:13:03.484331	\N	-TfNtqjmxMvuGmctI5_oM7ITENzPuujI	2025-07-12 16:13:03.453	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_SJ6HEwyrlRfU	\N	\N	\N	\N	10	2025-07-12 16:13:03.69	2025-07-12 16:13:03.722398	\N	8Q52FvUop0AOWA1P0fOHpquUCIsXkgK4	2025-07-12 16:13:03.69	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_SKCxLjal8g22	\N	\N	\N	\N	10	2025-07-12 16:13:03.926	2025-07-12 16:13:03.957691	\N	QihaGEpXCYqRUIpTntSyqWRHTqEUo_UG	2025-07-12 16:13:03.926	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_MDoIYpkfwKvm	\N	\N	\N	\N	10	2025-07-12 16:13:04.166	2025-07-12 16:13:04.198401	\N	mJpUtMXIzrlNLcGL0PJ_1WdRk0eMGesz	2025-07-12 16:13:04.166	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_yHPIwFjXz9Pr	\N	\N	\N	\N	10	2025-07-12 16:13:04.409	2025-07-12 16:13:04.44116	\N	lhV6NF__oXdznoQ_CIglj1tiaAiPILna	2025-07-12 16:13:04.409	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ybORg_6HXRPd	\N	\N	\N	\N	10	2025-07-12 16:13:04.652	2025-07-12 16:13:04.683247	\N	DCOPspzY7RkX1w40se3ea39rlxA9SOFP	2025-07-12 16:13:04.652	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Doix4Qh8e5Xp	\N	\N	\N	\N	10	2025-07-12 16:13:04.892	2025-07-12 16:13:04.940281	\N	4F2yMdWmnZ4cj0TkGqI3fsqiwtxA3INL	2025-07-12 16:13:04.892	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_y7jnULrpSvqc	\N	\N	\N	\N	10	2025-07-12 16:13:05.147	2025-07-12 16:13:05.178501	\N	j3EegKA7cscDn-2EFxwPfzF5VwhAdBMD	2025-07-12 16:13:05.147	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_mRi1n7J__noO	\N	\N	\N	\N	10	2025-07-12 16:13:05.408	2025-07-12 16:13:05.440087	\N	1o01U5p1bvwPf39mYYWY-ju6F2OLDS5v	2025-07-12 16:13:05.408	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_GyN3_ppuXvGK	\N	\N	\N	\N	10	2025-07-12 16:13:05.647	2025-07-12 16:13:05.679144	\N	jPtcy_fwO37WIbndsGPmhWISmDT-BMxV	2025-07-12 16:13:05.647	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_kz0TlGYHaOI4	\N	\N	\N	\N	10	2025-07-12 16:13:05.888	2025-07-12 16:13:05.919466	\N	_jJbKVDB8MQr7i8EdpIzQOA2mnnRPh4S	2025-07-12 16:13:05.888	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_NaaTbYQ0j7KA	\N	\N	\N	\N	10	2025-07-12 16:13:06.13	2025-07-12 16:13:06.162481	\N	-ZTPXDVqwmt2DD_RH3-eccinBfilfoMJ	2025-07-12 16:13:06.13	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_mLg1HoGzenN5	\N	\N	\N	\N	10	2025-07-12 16:13:06.369	2025-07-12 16:13:06.403096	\N	PWLx_9cHC4tZmeXsGUes6HJCRiBzTBGL	2025-07-12 16:13:06.369	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_TyiOlCR_Lr7d	\N	\N	\N	\N	10	2025-07-12 16:13:06.626	2025-07-12 16:13:06.658279	\N	0EcNcsEHZh6zveFSYFioRg5U3ta-PM78	2025-07-12 16:13:06.626	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_i0XZhZaaPC9-	\N	\N	\N	\N	10	2025-07-12 16:13:06.869	2025-07-12 16:13:06.901123	\N	Z439yRSucJdEkrN9kQ9DWsJpaPlSl4kW	2025-07-12 16:13:06.869	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_UZK5SUc5h7M5	\N	\N	\N	\N	10	2025-07-12 16:13:07.112	2025-07-12 16:13:07.142657	\N	J4iHK-nfjFuGWyZof1-fv89G1v1kPgLD	2025-07-12 16:13:07.112	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_qpSruJO8Aek3	\N	\N	\N	\N	10	2025-07-12 16:13:07.353	2025-07-12 16:13:07.384922	\N	sitaas7eEsKSwZ9LIIYLci5Ff36u236u	2025-07-12 16:13:07.353	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_G3WYr3FmAuId	\N	\N	\N	\N	10	2025-07-12 16:13:07.599	2025-07-12 16:13:07.63101	\N	geeED7isCZgrNxx4kfwVrYLjFQYLix7i	2025-07-12 16:13:07.599	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest__YZgrUaKBGCY	\N	\N	\N	\N	10	2025-07-12 16:13:07.839	2025-07-12 16:13:07.873146	\N	0mkPBfQSrqFWEerT2k3Y4WwONURYo7Kz	2025-07-12 16:13:07.839	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_UB5b84-O7Jhl	\N	\N	\N	\N	10	2025-07-12 16:13:08.089	2025-07-12 16:13:08.120293	\N	hwxKGjCmsgLLbX6nKQL61FK3gseZi3X4	2025-07-12 16:13:08.089	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_0JAxYkdFRmEK	\N	\N	\N	\N	10	2025-07-12 16:13:08.329	2025-07-12 16:13:08.360682	\N	Ch52hkAy4EmkNEHlJnwHTQD8tmGFJF3Z	2025-07-12 16:13:08.329	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_CUQ3MxK7l4lR	\N	\N	\N	\N	10	2025-07-12 16:13:08.569	2025-07-12 16:13:08.601039	\N	HiHYyJO6Z40WycG-ZvXv4y8Sa9FxEgPB	2025-07-12 16:13:08.569	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ECxvfEQ_ZGR7	\N	\N	\N	\N	10	2025-07-12 16:13:08.806	2025-07-12 16:13:08.838054	\N	LjyfUIXWDziRi4fqXmGEI1V4hF-zAIvK	2025-07-12 16:13:08.806	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_1yQN2I5BJ0pJ	\N	\N	\N	\N	10	2025-07-12 16:13:09.042	2025-07-12 16:13:09.073622	\N	f5RSEV8NTEAN19Weu5TOiUxK7Gud-0WQ	2025-07-12 16:13:09.042	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_C8aYvV2P2_Qp	\N	\N	\N	\N	10	2025-07-12 16:13:09.278	2025-07-12 16:13:09.309624	\N	ueIsCISHnB5jb4HYJ_xjrYYIjSxJVqEc	2025-07-12 16:13:09.278	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_X-1MmL_HGV4n	\N	\N	\N	\N	10	2025-07-12 16:13:09.513	2025-07-12 16:13:09.544899	\N	LGoUa6vlvzwWrq0Hw9hL6wCgwFhakIHN	2025-07-12 16:13:09.513	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_wIXg3zLYsie8	\N	\N	\N	\N	10	2025-07-12 16:13:09.759	2025-07-12 16:13:09.790497	\N	2nnLTfXh15jSvVWNW-J15hzEEisDgsPV	2025-07-12 16:13:09.759	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_hzrREous4yM9	\N	\N	\N	\N	10	2025-07-12 16:13:09.996	2025-07-12 16:13:10.027679	\N	oOU-c-0N7saFBrEVlUiY45lCBdwM8A9p	2025-07-12 16:13:09.996	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_hFqiAHISoZ9R	\N	\N	\N	\N	10	2025-07-12 16:13:10.233	2025-07-12 16:13:10.264939	\N	qRg3vWBGoDjEaP64mADPod_g_WnvX8-y	2025-07-12 16:13:10.233	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_OGTcwNJDkEzp	\N	\N	\N	\N	10	2025-07-12 16:13:10.477	2025-07-12 16:13:10.508653	\N	mswaq9q9_UMBD9RZkUyfkkZZKPiOkTKW	2025-07-12 16:13:10.477	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_z60zWNkfx7gV	\N	\N	\N	\N	10	2025-07-12 16:13:10.716	2025-07-12 16:13:10.747367	\N	0RWFl3w1fr_Wl8zYXOTS8mmLu-ABc89Y	2025-07-12 16:13:10.716	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_cR5iJJrjqLF7	\N	\N	\N	\N	10	2025-07-12 16:13:10.953	2025-07-12 16:13:10.984743	\N	dW49BmTcd3-U-5c7cmmQOIr3m3cDnvTp	2025-07-12 16:13:10.953	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_4VscO0BMU1XV	\N	\N	\N	\N	10	2025-07-12 16:13:11.191	2025-07-12 16:13:11.223027	\N	7VwwY1-uF0ebN60UWSszHKxJLG9tVsu4	2025-07-12 16:13:11.191	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Grfw-hYSAYyF	\N	\N	\N	\N	10	2025-07-12 16:13:11.433	2025-07-12 16:13:11.464999	\N	92mQULDg8RuUQ02JXAz9IgGfI_gRr3r_	2025-07-12 16:13:11.433	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_GUhvq0VHX8NU	\N	\N	\N	\N	10	2025-07-12 16:13:11.68	2025-07-12 16:13:11.715726	\N	e_O_mjdsuEwXuvy3xYjoOs4094LdBSA4	2025-07-12 16:13:11.68	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_gYcaFEGJsaDP	\N	\N	\N	\N	10	2025-07-12 16:13:11.928	2025-07-12 16:13:11.958619	\N	6lOsE4gkiW5bdd0_8BhXIfSjKfc1zWxj	2025-07-12 16:13:11.928	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_hwuVfC8MagU0	\N	\N	\N	\N	10	2025-07-12 16:13:12.163	2025-07-12 16:13:12.194946	\N	aDApKzbvI5xTuKnfDHQ6eXNs02w700y4	2025-07-12 16:13:12.163	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_18ugQOZWBq_M	\N	\N	\N	\N	10	2025-07-12 16:13:12.399	2025-07-12 16:13:12.429837	\N	9C0sxLXebrvLE_9HtUkTipcQ6iw6MYPy	2025-07-12 16:13:12.399	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_whw16IAT-POX	\N	\N	\N	\N	10	2025-07-12 16:13:12.637	2025-07-12 16:13:12.670309	\N	kam20odA3UjxLecEdt18f4B24P5rYFjM	2025-07-12 16:13:12.637	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_X3Igm6diAPVO	\N	\N	\N	\N	10	2025-07-12 16:13:12.876	2025-07-12 16:13:12.908222	\N	NZpi-ZieavgZ9vzjF2r5nbNtOWj2lNiA	2025-07-12 16:13:12.876	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_sZ2C1cKM1dfn	\N	\N	\N	\N	10	2025-07-12 16:13:13.115	2025-07-12 16:13:13.146585	\N	mPQOXdLtrXASH5oybeyU63jg0S8PkSSw	2025-07-12 16:13:13.115	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_LH23SYSYMn49	\N	\N	\N	\N	10	2025-07-12 16:13:13.351	2025-07-12 16:13:13.383102	\N	i2P5qMRizW4URS108Wa2WNDA1lM1tcXM	2025-07-12 16:13:13.351	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_rN-G1yM3sC1S	\N	\N	\N	\N	10	2025-07-12 16:13:13.594	2025-07-12 16:13:13.626113	\N	rIoES_89uzVlSTtt0Tca9fGbxSvVa86N	2025-07-12 16:13:13.594	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_QkjGc-e0kEz_	\N	\N	\N	\N	10	2025-07-12 16:13:13.833	2025-07-12 16:13:13.865024	\N	tHkq3DQDpvSD8LApOHRt9o3kE4l9Zpcr	2025-07-12 16:13:13.833	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_io-lo45_mIqN	\N	\N	\N	\N	10	2025-07-12 16:13:14.075	2025-07-12 16:13:14.108482	\N	wThV6pkrk3Ehw1WyTdnpmIONAxpyL25e	2025-07-12 16:13:14.075	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_DV8XIyDmNdl-	\N	\N	\N	\N	10	2025-07-12 16:13:14.315	2025-07-12 16:13:14.346693	\N	NltDkE11KmVCC5KtNen2xiiws6N6WiEC	2025-07-12 16:13:14.315	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_uxcEnWLxbS5l	\N	\N	\N	\N	10	2025-07-12 16:13:14.56	2025-07-12 16:13:14.59187	\N	xNZtMGvZh7QQLtAZ0fLYpVjk_2BzHVwZ	2025-07-12 16:13:14.56	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_GJLQ8OBMm7uy	\N	\N	\N	\N	10	2025-07-12 16:13:14.802	2025-07-12 16:13:14.833289	\N	sfVRXRJJU-1UDR3XUDWnegkrZbBSRE0Z	2025-07-12 16:13:14.802	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_w7jHA-uVch2P	\N	\N	\N	\N	10	2025-07-12 16:13:15.038	2025-07-12 16:13:15.06919	\N	Y59bYZTnxwtJfCsPA4zHWsPwnpVg6b19	2025-07-12 16:13:15.038	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_1nnM5G5aC4sD	\N	\N	\N	\N	10	2025-07-12 16:13:15.277	2025-07-12 16:13:15.30881	\N	QAP_DvOTlQw1ypY0iwGVccCLGjLphLRC	2025-07-12 16:13:15.277	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_3CDTZDJmnKzL	\N	\N	\N	\N	10	2025-07-12 16:13:15.535	2025-07-12 16:13:15.566872	\N	WYQJaB9xeufhMbZhcV_dRstJvZUk1KEU	2025-07-12 16:13:15.535	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_uR5RfVM8QxF_	\N	\N	\N	\N	10	2025-07-12 16:13:15.775	2025-07-12 16:13:15.805604	\N	iCuO74mXLlpOzMr2QDqO7lWedehsEuHP	2025-07-12 16:13:15.775	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_cSHGIgKmt-SA	\N	\N	\N	\N	10	2025-07-12 16:13:16.017	2025-07-12 16:13:16.049889	\N	q0jNPXJgbbFbDfSYFTCOSfRVMzmtnkO_	2025-07-12 16:13:16.017	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_TAViVBS6kT-7	\N	\N	\N	\N	10	2025-07-12 16:13:16.262	2025-07-12 16:13:16.294233	\N	oFCvWiS6xJZh65mPrzz98coUe47ITxy9	2025-07-12 16:13:16.262	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_gaMKK28o_o1X	\N	\N	\N	\N	10	2025-07-12 16:13:16.501	2025-07-12 16:13:16.532878	\N	-_8noZ2skH4BUN-M9D2Ff_haHl-z01zN	2025-07-12 16:13:16.501	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_9gcCiUXN9psf	\N	\N	\N	\N	10	2025-07-12 16:13:16.736	2025-07-12 16:13:16.767574	\N	hCoBUzLexdKUlHeb4f9DVBUPfGyFTEiY	2025-07-12 16:13:16.736	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_hmRZD1o41y0v	\N	\N	\N	\N	10	2025-07-12 16:13:16.984	2025-07-12 16:13:17.016091	\N	3lAwBzWz0m80TxKyVDtpkS4AcC4IWwOW	2025-07-12 16:13:16.984	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_bIIFT1QC6_Cc	\N	\N	\N	\N	10	2025-07-12 16:13:17.226	2025-07-12 16:13:17.258676	\N	9vE3m1xspXNit5fUcWEOGmryeNpsPGeK	2025-07-12 16:13:17.226	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_faEzvhoXY4fM	\N	\N	\N	\N	10	2025-07-12 16:13:17.466	2025-07-12 16:13:17.497529	\N	cV0t__QDItjblvrL8kmUUjXUlF5EKeGP	2025-07-12 16:13:17.466	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_sQYSEilSShMB	\N	\N	\N	\N	10	2025-07-12 16:13:17.712	2025-07-12 16:13:17.744311	\N	5wjLaAtCCuT9FgveOsyiCkJ3B1rE_sZm	2025-07-12 16:13:17.712	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ePNcjQ3lgPmx	\N	\N	\N	\N	10	2025-07-12 16:13:17.957	2025-07-12 16:13:17.990937	\N	_JlpE76fff4OTRBQSfcRX4Vz-j6M3OT9	2025-07-12 16:13:17.957	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_lzWHcrur4Yd4	\N	\N	\N	\N	10	2025-07-12 16:13:18.201	2025-07-12 16:13:18.232837	\N	YQIfi15lOvBAKytVwHVvGXAFyQ72NW9T	2025-07-12 16:13:18.201	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_rNnmxAzxewkz	\N	\N	\N	\N	10	2025-07-12 16:13:18.443	2025-07-12 16:13:18.475142	\N	IUNIWWrbUFG9AIypIX2pxlHW9__x2qOK	2025-07-12 16:13:18.443	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_UaP3t5eKzixj	\N	\N	\N	\N	10	2025-07-12 16:13:18.682	2025-07-12 16:13:18.714221	\N	DBqNaVR0bYEbiErj9eQU243ueBM5ywrw	2025-07-12 16:13:18.682	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_MJ73E1ad4If2	\N	\N	\N	\N	10	2025-07-12 19:57:19.383	2025-07-12 19:57:19.550686	\N	THYRa1FRbmY1mm2a-J2M5IR5U4KqN-Ag	2025-07-12 21:42:51.25	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_joK8DYGHRzpG	\N	\N	\N	\N	10	2025-07-12 19:50:24.796	2025-07-12 19:50:24.973298	\N	5lfdHz3Hrp1rIDLYZmvjxQoecpX8GTGw	2025-07-12 19:54:46.76	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_EFSPBqSoPc08	\N	\N	\N	\N	10	2025-07-12 16:14:02.969	2025-07-12 16:14:03.140395	\N	3HfFQrJhBIRiVlEW6tKXx418UKojNLLU	2025-07-12 18:11:18.736	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_kSwC8BgkvTi3	\N	\N	\N	\N	10	2025-07-12 17:58:08	2025-07-12 17:58:08.035785	\N	bSH13CtSFFbakMjiwkM7xwzYY0UqyH2P	2025-07-12 17:58:19.181	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_znd-NuncOgru	\N	\N	\N	\N	10	2025-07-12 18:23:16.757	2025-07-12 18:23:16.791585	\N	-vJH-i2k8gJMC0i6SbKVSo5ralphJ-Or	2025-07-12 18:23:20.897	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_0cX6Kh5DqXBi	\N	\N	\N	\N	10	2025-07-12 17:58:09.397	2025-07-12 17:58:09.43215	\N	sZMaLXoFaaiWBOMBpdw1VVpVUuIbdhSx	2025-07-12 17:58:23.347	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_qN8zPMkPFqNt	\N	\N	\N	\N	10	2025-07-12 17:58:25.456	2025-07-12 17:58:25.491309	\N	FCCzvB5rzocf7t7emS2EVrqxhNCHuPMx	2025-07-12 17:58:25.456	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_MnPYxr3-ldYm	\N	\N	\N	\N	10	2025-07-12 18:11:26.105	2025-07-12 18:11:26.162977	\N	WZNMUUg14I4HF18nbfZXf6chYMwnr-vD	2025-07-12 18:12:13.029	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_wEf2L6EIfBSb	\N	\N	\N	\N	10	2025-07-12 16:47:21.729	2025-07-12 16:47:21.764562	\N	90LiiZlWbHPu8Ix5-4Bi5TU32JcBNzo1	2025-07-12 16:47:21.729	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_KBDtMIr2C2od	\N	\N	\N	\N	10	2025-07-12 16:47:21.957	2025-07-12 16:47:21.991763	\N	4p5xfZvUnr3s2sygBdR5hUkwXx4w7OOO	2025-07-12 16:47:21.957	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_xYF28j7fH3hh	\N	\N	\N	\N	10	2025-07-12 16:47:24.901	2025-07-12 16:47:24.936381	\N	405_Krx1UukL_Ogv8DH9rnCT0K427e5H	2025-07-12 16:47:24.901	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_rmntDgoduxCv	\N	\N	\N	\N	10	2025-07-12 16:47:27.165	2025-07-12 16:47:27.199725	\N	5cWWGAsoEYEvOqB_nl1Enud4h6rgxRhv	2025-07-12 16:47:27.165	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_VoRRFTEx5M_R	\N	\N	\N	\N	10	2025-07-12 16:47:28.15	2025-07-12 16:47:28.186994	\N	FzKaHKJl_n1rU3eGIwrJAr1pY9RYZcsF	2025-07-12 16:47:28.15	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_D0sFbi2haz1N	\N	\N	\N	\N	10	2025-07-12 16:47:29.952	2025-07-12 16:47:29.986381	\N	zOsz5eE6Nj_bNEgdcLKxzuuioSCqUhCF	2025-07-12 16:47:29.952	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_V_fFEDRlUROZ	\N	\N	\N	\N	10	2025-07-12 16:47:29.952	2025-07-12 16:47:29.987516	\N	Z3Fe5bUsgU5y0-uGp87AQwdnveFg2StV	2025-07-12 16:47:29.952	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_pW4uy_qtsI-b	\N	\N	\N	\N	10	2025-07-12 16:54:23.764	2025-07-12 16:54:23.799693	\N	loOOGrfumO6nMVP11vJGdTRlgQzXSERT	2025-07-12 16:54:23.764	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_8lgJqIwLMutn	\N	\N	\N	\N	10	2025-07-12 16:56:19.671	2025-07-12 16:56:19.706171	\N	8lxUS2rTo8hkEXqf1jfWu09-wKz0btb4	2025-07-12 16:56:19.671	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_t5P6M8y861LW	\N	\N	\N	\N	10	2025-07-12 16:56:20.046	2025-07-12 16:56:20.077451	\N	rwNJ_az2mWodSHbLyn7VifD8VoArgE1C	2025-07-12 16:56:20.046	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_P60fXSWEoe5d	\N	\N	\N	\N	10	2025-07-12 16:56:21.065	2025-07-12 16:56:21.096932	\N	wZh2wFh-vISe215tIhBTLgaFZcjWvPwl	2025-07-12 16:56:21.065	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_-JWps09UXFAw	\N	\N	\N	\N	10	2025-07-12 16:56:21.084	2025-07-12 16:56:21.118932	\N	Kgvlqc094Jx_uFmF_JNWHOYfq01bH6cr	2025-07-12 16:56:21.084	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_KD9Ri7Dv_KYn	\N	\N	\N	\N	10	2025-07-12 17:57:47.759	2025-07-12 17:57:47.792326	\N	-FsIj022Ndngz121Wz9jux9qJTu7sPK8	2025-07-12 17:57:47.759	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_WgZLyJFCk6vp	\N	\N	\N	\N	10	2025-07-12 17:58:06.587	2025-07-12 17:58:06.621202	\N	y4Godip1EHludgM829hwPWRj4hqbpLie	2025-07-12 17:58:06.587	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_JZYhauRq9VZw	\N	\N	\N	\N	10	2025-07-12 17:58:07.769	2025-07-12 17:58:07.802416	\N	gjSL5jvBxLsAiPYn7VUgHEzb04ivwls6	2025-07-12 17:58:07.769	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_KiLvx476dhqh	\N	\N	\N	\N	10	2025-07-12 18:02:52.973	2025-07-12 18:02:53.006015	\N	1NW8_M8AnN_NRFWGjqtjvaPsZVuAHAHB	2025-07-12 18:02:52.973	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_5qKUl5Y4p5rO	\N	\N	\N	\N	10	2025-07-12 18:32:19.827	2025-07-12 18:32:19.860861	\N	76tHk0qtzxUD5t2glU5V5wKWrOKYZFvS	2025-07-12 18:32:19.827	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_wb9KNF3of7jz	\N	\N	\N	\N	10	2025-07-12 18:49:57.481	2025-07-12 18:49:57.515982	\N	XE0yfBhqqe3XOdKej_hCQgiFXn_c6R-i	2025-07-12 18:49:57.481	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_VC_AVvHRLFMk	\N	\N	\N	\N	10	2025-07-12 19:08:37.572	2025-07-12 19:08:37.721607	\N	wR85zuQ61eRCF1NAqb6uy2Ht--knA-Ww	2025-07-12 19:49:53.591	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest__bbLXeYQVTJL	\N	\N	\N	\N	10	2025-07-12 20:05:59.151	2025-07-12 20:05:59.184275	\N	jiEnCe4ioMIhMOlrMk3LR9c1U6A-hMhN	2025-07-12 20:06:06.795	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_MkEwuvv-klih	\N	\N	\N	\N	10	2025-07-12 19:55:02.732	2025-07-12 19:55:02.900734	\N	zbnkmnLNIqi26A_A1cbUFM9CoflocNUV	2025-07-12 19:56:45.784	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_rJYuQaJqAzmc	\N	\N	\N	\N	10	2025-07-12 19:53:47.585	2025-07-12 19:53:47.616833	\N	vGFOwkFZhlW-bsb86ZypM6XZXO8MK-Ol	2025-07-12 19:53:47.585	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_pD8eN8ETS9sT	\N	\N	\N	\N	10	2025-07-12 20:05:36.277	2025-07-12 20:05:36.312188	\N	_dLOk_D8qza4E1LSovtiX-m031UbcT3k	2025-07-12 20:05:36.277	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_JBT_NfI4mYvH	\N	\N	\N	\N	10	2025-07-12 20:05:30.275	2025-07-12 20:05:30.310791	\N	sekQPxbI4k0Km5amedurzEtHvShrjqpB	2025-07-12 20:05:30.275	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_pNclJfnl42FK	\N	\N	\N	\N	10	2025-07-12 20:05:36.698	2025-07-12 20:05:36.733751	\N	izq9XGpAPEioz9PgON3BkgkDLmpGnaF4	2025-07-12 20:05:36.698	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_pET0U4q8ASKg	\N	\N	\N	\N	10	2025-07-12 20:17:56.098	2025-07-12 20:17:56.131141	\N	FvXIbyj_rEBFcgckhJiiR7NuVHjWOK2V	2025-07-12 20:17:56.098	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_7c7QtMGUv1px	\N	\N	\N	\N	10	2025-07-12 20:17:56.962	2025-07-12 20:17:56.996778	\N	9f7v47fGfwNj8Q0u-_qDEhW_PHYLbvbR	2025-07-12 20:17:56.962	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_0eqehgHrRoBo	\N	\N	\N	\N	10	2025-07-12 20:15:29.635	2025-07-12 20:15:29.668597	\N	htrECkWr-qJQMzw2Ke1oFmftZqnVBiBJ	2025-07-12 21:41:52.495	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_A3BUNvnHkK8S	\N	\N	\N	\N	10	2025-07-12 21:19:08.345	2025-07-12 21:19:08.379885	\N	K3yla4zTNmNc9mkxEJMBnhhwrr2J-iX9	2025-07-12 21:19:13.017	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_LSP16bg1KpmI	\N	\N	\N	\N	10	2025-07-12 21:32:31.455	2025-07-12 21:32:31.48947	\N	4HyT0xaDbB05bOfOspa52sw1J-dvw-nJ	2025-07-12 21:32:31.455	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_tlwa6eHL3spP	\N	\N	\N	\N	10	2025-07-12 21:41:59.767	2025-07-12 21:41:59.805141	\N	Lgf6iF-GtGnLdGkkOJzLnkqVn5690G4A	2025-07-12 21:42:00.636	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_qNEa2LMtbXCn	\N	\N	\N	\N	10	2025-07-12 23:45:19.226	2025-07-12 23:45:19.263257	\N	EayU7wRb-sCUSvwpjrKnTvTXS2uZFgKD	2025-07-12 23:45:19.226	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_bzqlhUUvcTIF	\N	\N	\N	\N	10	2025-07-12 23:50:47.774	2025-07-12 23:50:47.808253	\N	UVvX8d-MdIZaOxmNDLP97X_K0kF6eAbv	2025-07-12 23:50:47.774	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_kSXXTuo-4eLN	\N	\N	\N	\N	10	2025-07-12 20:18:06.617	2025-07-12 20:18:06.649697	\N	NqhTHGX-s8_27oL7YhNEQXOLH-f9PA5A	2025-07-12 20:18:17.013	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_wzwNvji5TSOp	\N	\N	\N	\N	10	2025-07-13 00:05:24.46	2025-07-13 00:05:24.497826	\N	urFy4kKwpBLmanFXesppUIdvnGvH_Qcf	2025-07-13 00:05:24.46	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_c49SrJ9Pd28g	\N	\N	\N	\N	10	2025-07-12 23:28:28.724	2025-07-12 23:28:28.758295	\N	lvRj-rF9K-41CHLhHUIZGFlJyhghpJjl	2025-07-12 23:28:28.724	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_F1TeLfEB10KW	\N	\N	\N	\N	10	2025-07-12 22:06:49.474	2025-07-12 22:06:49.79296	\N	VMmKE_jz1ce7_S4GMicR44A5IgeOc1xA	2025-07-12 22:51:35.842	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_0ALCX8XYz83R	\N	\N	\N	\N	10	2025-07-13 00:25:25.371	2025-07-13 00:25:25.408018	\N	7vSJD-S_m09Lc-u8Ti7mSldC7-fIg8i2	2025-07-13 00:25:25.371	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_rCPoTCU_ozGp	\N	\N	\N	\N	10	2025-07-12 23:06:13.873	2025-07-12 23:06:13.908521	\N	EA-hrZBb4ahzoKbRnvU3dfQMywLBQjWw	2025-07-12 23:06:13.873	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_WyYEcdup6_LO	\N	\N	\N	\N	10	2025-07-12 22:15:07.733	2025-07-12 22:15:07.770383	\N	19jomLoWl-2jezc19k-I0GyL55GKOGeB	2025-07-12 22:15:07.733	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_CZtyfFzlpvn3	\N	\N	\N	\N	10	2025-07-12 21:42:00.356	2025-07-12 21:42:00.396874	\N	IrH4pifP1sRAbtD_wHKYiVPs1J5R2Hul	2025-07-12 21:42:31.701	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_x_Zvc0B74wKu	\N	\N	\N	\N	10	2025-07-12 21:45:54.561	2025-07-12 21:45:54.932595	\N	XUTnzgxPngTYbYZeGR2BP01-GZ169REr	2025-07-12 21:45:54.561	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_OdR6m6Qy_z9H	\N	\N	\N	\N	10	2025-07-12 21:45:54.865	2025-07-12 21:45:55.214704	\N	FxC6X5UbYBaU6rhTbbhrJMJTC5Ky0OOH	2025-07-12 21:45:54.865	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_CpaC8_FPe0PP	\N	\N	\N	\N	10	2025-07-13 00:32:36.77	2025-07-13 00:32:36.802609	\N	rif5rkNj4kSii79C62i7hIXZANrGX1SF	2025-07-13 00:32:36.77	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_F3u7eZ5S-Esl	\N	\N	\N	\N	10	2025-07-12 21:53:31.092	2025-07-12 21:53:31.130724	\N	dPGUcnYimVPgMwAPEuzQurS7S2GPOfk-	2025-07-12 21:53:31.092	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Gew3Px2zsbzo	\N	\N	\N	\N	10	2025-07-12 20:57:17.708	2025-07-12 20:57:17.744082	\N	3kECVkqVVq3uftylMLrWYLAybrDVoUn8	2025-07-12 20:57:17.708	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_NcJgUUv-6AKn	\N	\N	\N	\N	10	2025-07-12 21:14:50.09	2025-07-12 21:14:50.125005	\N	tQKksVvwotuVSMY_wSO64Rk2Nr9y5mXn	2025-07-12 21:14:50.09	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Uh8QtfiRX3Dv	\N	\N	\N	\N	10	2025-07-12 21:17:25.42	2025-07-12 21:17:25.455384	\N	EQtt3BNYiBVzmMXCeTutSTzSTEMNiIJP	2025-07-12 21:17:25.42	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_rNGKw-egcHfB	\N	\N	\N	\N	10	2025-07-12 21:47:30.758	2025-07-12 21:47:30.791729	\N	WhPbVJNoPFiA2g5UsXTIM5x6Sgs8erRw	2025-07-12 21:47:30.758	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_inM0VXGWDOa5	\N	\N	\N	\N	10	2025-07-12 21:53:31.809	2025-07-12 21:53:31.844991	\N	ek3j3qqoqkWsZAEF0DfpkX8c2axrvWgX	2025-07-12 21:53:31.809	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_tct2EAUS4nGM	\N	\N	\N	\N	10	2025-07-13 00:26:49.252	2025-07-13 00:26:49.334535	\N	ockKvMWfvEYSjkvRj_oRbosaivUFUgHy	2025-07-13 00:38:33.604	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_w2uwFDuQ4JLD	\N	\N	\N	\N	10	2025-07-12 22:51:45.255	2025-07-12 22:51:45.539853	\N	SuM1DF5oEIvginJb_2JpPZe3-hEkWYvn	2025-07-13 00:18:53.802	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_glAl3Ht2I7Rx	\N	\N	\N	\N	10	2025-07-13 00:18:59.163	2025-07-13 00:18:59.25095	\N	GM9siSq4NjsoBayo02OPOhq--L8c09W-	2025-07-13 00:18:59.163	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_WTFSzdPaGDAm	\N	\N	\N	\N	10	2025-07-12 21:45:54.246	2025-07-12 21:45:54.616114	\N	PmqWRIXqAH_wPp2A6EbXo68BcyEv9v3a	2025-07-12 21:58:53.627	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_FiyLbQC-yt31	\N	\N	\N	\N	10	2025-07-12 21:58:59.276	2025-07-12 21:58:59.65753	\N	D46fOfDHf7UrVT4cKTEsdBxwWlUjQs8b	2025-07-12 22:06:42.557	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_p8pXPUN1epGW	\N	\N	\N	\N	10	2025-07-12 22:06:48.112	2025-07-12 22:06:48.433037	\N	8pbbiFgS-moGfoIRFVFP3h87QbP_erZw	2025-07-12 22:06:48.112	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_wXMFaoG-uiQ0	\N	\N	\N	\N	10	2025-07-12 22:06:48.592	2025-07-12 22:06:48.92792	\N	OjSs90yBcOSmoCxuf2qF3JtuxqDfrOLA	2025-07-12 22:06:48.592	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_QwxkjEdM6Fu3	\N	\N	\N	\N	10	2025-07-12 22:01:01.669	2025-07-12 22:01:01.727051	\N	fwoH3N8wcrEAkjJ21wU77hs1bozeo7oD	2025-07-12 22:01:01.669	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_5o7YAyWQ2Ei0	\N	\N	\N	\N	10	2025-07-13 00:18:59.683	2025-07-13 00:18:59.77097	\N	w9Hv3lxGA7eC4avFUgO16l_9Kgj4ff68	2025-07-13 00:20:45.161	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_6NAPM6WzO9qh	\N	\N	\N	\N	10	2025-07-13 00:20:59.765	2025-07-13 00:20:59.850797	\N	vhSkZPObejHeEoU3h1ALgtjEz-JS7QXb	2025-07-13 00:26:42.766	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Msu6blQoloda	\N	\N	\N	\N	10	2025-07-13 03:21:56.29	2025-07-13 03:21:56.292405	\N	Rrmmp92pDnLDRMGFsw4cMFWhAyV07i4Q	2025-07-13 03:21:56.29	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_pB132CxUSdK1	\N	\N	\N	\N	10	2025-07-13 03:21:56.3	2025-07-13 03:21:56.301774	\N	LR2ewTdTl2wzGHK1UwblaEvFoQektTpV	2025-07-13 03:21:56.3	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_B2pJiTz1V38f	\N	\N	\N	\N	10	2025-07-13 03:21:40.809	2025-07-13 03:21:40.811521	\N	Ik6UzfjPa8Lb8w9HyXnnYOVKvOFdVkHM	2025-07-13 03:21:40.809	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_n7m3HGmzp9-_	\N	\N	\N	\N	10	2025-07-13 03:21:40.969	2025-07-13 03:21:40.970375	\N	vV_sWlxnb-6JTrCeOxB2voNmsWyqmKaz	2025-07-13 03:21:40.969	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_pidOg3jJ4WuW	\N	\N	\N	\N	10	2025-07-13 03:21:56.308	2025-07-13 03:21:56.310491	\N	VWBK2Hp2qjTNp3YZ3r8piSO9zz3LMweU	2025-07-13 03:21:56.308	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_4JveGnxnYRdQ	\N	\N	\N	\N	10	2025-07-13 03:21:56.368	2025-07-13 03:21:56.369559	\N	cA5bhSZwIZ37dPC_p4-5H2BCU-ENZ34M	2025-07-13 03:21:56.368	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_7_6CKdCPFxLc	\N	\N	\N	\N	10	2025-07-13 03:21:56.369	2025-07-13 03:21:56.370411	\N	Bi5jGMHgseYSlYKeY9ZjXt3w450gsYAL	2025-07-13 03:21:56.369	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_U7pMWEqNfDRZ	\N	\N	\N	\N	10	2025-07-13 03:21:56.396	2025-07-13 03:21:56.398135	\N	XRH1i_mbIeZgMblZ1YChPVo2Ata27LEQ	2025-07-13 03:21:56.396	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_vK9G7nnSAlVg	\N	\N	\N	\N	10	2025-07-13 03:21:56.42	2025-07-13 03:21:56.421985	\N	GqZKZsd2emV82TRWKAQggvTXqlgBJFVX	2025-07-13 03:21:56.42	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_bn2q34gqNMct	\N	\N	\N	\N	10	2025-07-13 02:44:15.672	2025-07-13 02:44:15.673464	\N	uOGkXv4573u8iMqrgddZXclGN-W9PFA2	2025-07-13 03:00:59.672	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_B3xknnIiq2m1	\N	\N	\N	\N	10	2025-07-13 02:22:48.811	2025-07-13 02:22:49.020497	\N	C5UM1Kv6VPqmkk63AXV4Yigwqlm7RNZ0	2025-07-13 02:23:01.32	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_u_qjmXymyR53	\N	\N	\N	\N	10	2025-07-13 03:21:56.431	2025-07-13 03:21:56.432434	\N	4nBilJl3YTJIM-rQZfXnzRKmIOLYTGTc	2025-07-13 03:21:56.431	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_fXUtvqCNkNVk	\N	\N	\N	\N	10	2025-07-13 02:26:34.19	2025-07-13 02:26:34.192946	\N	ytNVxccLqbmN1Zn79CqWnK9VtP2Wg22y	2025-07-13 02:26:34.19	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_3mP3448TytLH	\N	\N	\N	\N	10	2025-07-13 03:21:56.442	2025-07-13 03:21:56.443963	\N	LRDxeuxSw0MOZpVqQaBHaYXGo-Skylyk	2025-07-13 03:21:56.442	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_kjz5EN1xwMOk	\N	\N	\N	\N	10	2025-07-13 03:21:56.453	2025-07-13 03:21:56.45792	\N	DIrsy4Rv4JYsVAyymxbFd3BUkpUUvQpH	2025-07-13 03:21:56.453	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_qUD_p1ROJg-o	\N	\N	\N	\N	10	2025-07-13 03:21:56.478	2025-07-13 03:21:56.524825	\N	HL6_AeeOFl6LZS0vKKj-bhQ0YPe2Ez5E	2025-07-13 03:21:56.478	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_RvffGLVuSQY1	\N	\N	\N	\N	10	2025-07-13 03:21:56.521	2025-07-13 03:21:56.531627	\N	2h5-ftxyYeOTGzjKhnm4coqKJr78GXkw	2025-07-13 03:21:56.521	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_1CNyZMjFsUBZ	\N	\N	\N	\N	10	2025-07-13 03:21:56.531	2025-07-13 03:21:56.54404	\N	6QivwqsTg7QPiV34qds3fzlXCMXTPXNb	2025-07-13 03:21:56.531	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_rpelYiZ_OExX	\N	\N	\N	\N	10	2025-07-13 03:21:56.533	2025-07-13 03:21:56.5461	\N	JWdYwhS8LwTDQAu-TAcbZDKJMXjTF5VY	2025-07-13 03:21:56.533	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_H36WtjU8VA5c	\N	\N	\N	\N	10	2025-07-13 03:21:56.54	2025-07-13 03:21:56.550017	\N	RWhGQpe2ckoLnsnNscFdO8ZCArNT52V2	2025-07-13 03:21:56.54	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_v_r9B6v0fot5	\N	\N	\N	\N	10	2025-07-13 03:21:56.543	2025-07-13 03:21:56.551939	\N	sHDnNmTfmufEKOEB8nQiAIqE5gr1fRpi	2025-07-13 03:21:56.543	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ixFRcjKZz730	\N	\N	\N	\N	10	2025-07-13 02:22:34.35	2025-07-13 02:22:34.5456	\N	kxaRU0ma0g1F7fJ1Z0G453U_h-XPPOrF	2025-07-13 02:22:34.35	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest__k7y_bEpC7MH	\N	\N	\N	\N	10	2025-07-13 03:21:56.549	2025-07-13 03:21:56.566526	\N	gPpOT8Yttb7jmzcAs8qVP78cvXaL7lU0	2025-07-13 03:21:56.549	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_qq9jWwAF5CNv	\N	\N	\N	\N	10	2025-07-13 03:21:56.665	2025-07-13 03:21:56.667408	\N	3VurMRuIhJ7Rl60J4P1TsP9i-nEuGxlh	2025-07-13 03:21:56.665	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_w5tKzH-N6cyx	\N	\N	\N	\N	10	2025-07-13 03:21:56.786	2025-07-13 03:21:56.78721	\N	f3SqhVucg9HQLbXvkKwJ2Z2RHT4ZUe_b	2025-07-13 03:21:56.786	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_EgbfMBm5cDZl	\N	\N	\N	\N	10	2025-07-13 03:21:56.798	2025-07-13 03:21:56.799179	\N	yZ__hwvuZV0Kr-ysMroIZ7dMOFcsR7VV	2025-07-13 03:21:56.798	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_VxXx2tF9UIba	\N	\N	\N	\N	10	2025-07-13 03:21:56.806	2025-07-13 03:21:56.807399	\N	QKr4efNKnpS8xDEd4v4cCgu0Qb2QIgxh	2025-07-13 03:21:56.806	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_eertntPj_YcE	\N	\N	\N	\N	10	2025-07-13 03:21:56.815	2025-07-13 03:21:56.816694	\N	DmxNYB3wkoJe5g-94Y4JSTbjseJMMUmU	2025-07-13 03:21:56.815	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_UTF4M8NTyvh6	\N	\N	\N	\N	10	2025-07-13 03:21:56.864	2025-07-13 03:21:56.865855	\N	0TiEMZF6vReJ6CmmF48mynMkFJ19Ig8z	2025-07-13 03:21:56.864	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_SC8gfw-45DhN	\N	\N	\N	\N	10	2025-07-13 03:21:56.29	2025-07-13 03:21:56.29317	\N	95CA6aclgDPZmwMwbZQbDO97i6_Gmb8J	2025-07-13 03:21:56.29	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ycUzdvlkDUau	\N	\N	\N	\N	10	2025-07-13 02:10:35.018	2025-07-13 02:10:35.020721	\N	bFRCtlLjVA91k7nuRaFesmLoHIS0xWD1	2025-07-13 03:20:21.488	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_sw-aSzuA1VVH	\N	\N	\N	\N	10	2025-07-13 03:21:56.304	2025-07-13 03:21:56.305429	\N	qPnAPHg-VHFn28qwD-ksxBtg5qlT77vg	2025-07-13 03:21:56.304	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_BR-Nolpfxk4S	\N	\N	\N	\N	10	2025-07-13 03:21:56.309	2025-07-13 03:21:56.311205	\N	-uHsIc8RDd_Bz7Uv80PpGizQJRjnSZTh	2025-07-13 03:21:56.309	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_bOesj_2BTJ8a	\N	\N	\N	\N	10	2025-07-13 03:21:56.317	2025-07-13 03:21:56.318995	\N	bTKIBQYO-HrIe3LgEQnceQbhHyrui1Bh	2025-07-13 03:21:56.317	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_YVrBm1G8FNqg	\N	\N	\N	\N	10	2025-07-13 02:56:47.361	2025-07-13 02:56:47.362648	\N	TF4HHUWiIHF1M1YFKMMoTgjRyTLrqJ8N	2025-07-13 02:56:47.361	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Ddsv_0TslP55	\N	\N	\N	\N	10	2025-07-13 02:56:15.737	2025-07-13 02:56:15.943305	\N	O4B4Fi50uHlTALFrsh7G-iPrJWsD9qRF	2025-07-13 02:56:15.737	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_izA7Sz0VTYLZ	\N	\N	\N	\N	10	2025-07-13 03:21:56.378	2025-07-13 03:21:56.379919	\N	T2blCT6x3fEaT6sNJIQDrbP7Za7tjss3	2025-07-13 03:21:56.378	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_2i6wgkgwNYSI	\N	\N	\N	\N	10	2025-07-13 03:21:56.387	2025-07-13 03:21:56.389006	\N	W_w3u6kivRTZrlmad-V4w_DQp1aXcnAc	2025-07-13 03:21:56.387	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Ghj0MneBijZK	\N	\N	\N	\N	10	2025-07-13 04:10:19.93	2025-07-13 04:10:20.006526	\N	JN0cnazz2BYzCKPJ4Bhb8T3d8Ff_P7Jx	2025-07-13 04:10:19.93	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ZcjvkzvPHXMr	\N	\N	\N	\N	10	2025-07-13 03:21:56.397	2025-07-13 03:21:56.400714	\N	sg53fhZO7dTm8uEoVrxI4PRKigesIbCw	2025-07-13 03:21:56.397	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_PcKZ_RQzKOlT	\N	\N	\N	\N	10	2025-07-13 03:21:56.404	2025-07-13 03:21:56.405459	\N	XH6vhaigk3kU3vKbWBjxSf-zwq_uGyd5	2025-07-13 03:21:56.404	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_4NIGOO-X96PU	\N	\N	\N	\N	10	2025-07-13 03:21:56.411	2025-07-13 03:21:56.412237	\N	jG7-1OAptlxYRUFWj2yoWA6w8oqAy2hL	2025-07-13 03:21:56.411	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_e-u6kxAuHLO6	\N	\N	\N	\N	10	2025-07-13 03:21:56.424	2025-07-13 03:21:56.42586	\N	wJ5yMVkkAXG1m5vI5mZ9cTH7v8o_-b4x	2025-07-13 03:21:56.424	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Nqv0AVUGvZ6_	\N	\N	\N	\N	10	2025-07-13 03:21:56.428	2025-07-13 03:21:56.429163	\N	EP8_WoffScVmnA7ne7VtIExlKIDQFprG	2025-07-13 03:21:56.428	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_hzdvBCLsIlFp	\N	\N	\N	\N	10	2025-07-13 02:48:06.897	2025-07-13 02:48:07.053241	\N	xM76IDIGCFT9pamsrINAy65gbBQS66Kl	2025-07-13 02:48:06.901	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ltmXHAZO8_Qx	\N	\N	\N	\N	10	2025-07-13 03:21:56.436	2025-07-13 03:21:56.437951	\N	RoP0AZsrdhH1kZrVRvDnOf9djgTCsLnf	2025-07-13 03:21:56.436	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_AlFECJ3W0RpL	\N	\N	\N	\N	10	2025-07-13 03:21:56.455	2025-07-13 03:21:56.457159	\N	feYHVcwt3A4HexYmUjf2ZtcysqHR-8Ba	2025-07-13 03:21:56.455	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_5vBtyfoyIIfL	\N	\N	\N	\N	10	2025-07-13 03:21:56.53	2025-07-13 03:21:56.542519	\N	U38Oqv6qJuCzbk_OV5JPV0EPJEsnjvxw	2025-07-13 03:21:56.53	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_NydWIv7k6ksb	\N	\N	\N	\N	10	2025-07-13 03:21:56.534	2025-07-13 03:21:56.549599	\N	z84mdHh-SqqTPG490DkSdzCdgDxYHf3p	2025-07-13 03:21:56.534	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
test_debug	test@magicvidio.com	Test	User	https://via.placeholder.com/150?text=T	100	2025-06-14 15:13:12.945243	2025-07-14 17:07:57.161	@usertest_d	\N	2025-07-14 22:07:57.161	\N	google	f	f	2025-07-13 17:30:54.503155	3	2
guest_user	guest@delula.com	Guest	User	\N	75	2025-06-24 19:09:39.451407	2025-07-14 17:50:43.511	\N	\N	2025-06-26 15:22:49.047284	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_SvfGUkmlgd_k	\N	\N	\N	\N	10	2025-07-13 03:21:56.536	2025-07-13 03:21:56.550249	\N	TMeUuMsnkZMgL0PL9GQFeTEnRazsRM2p	2025-07-13 03:21:56.536	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_5--mSSKdArdt	\N	\N	\N	\N	10	2025-07-13 03:21:56.548	2025-07-13 03:21:56.558582	\N	mU6_dMIliZS7I0qi6lM71vygbTTzU_2v	2025-07-13 03:21:56.548	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_D3ZikoSkA40M	\N	\N	\N	\N	10	2025-07-13 03:09:53.057	2025-07-13 03:09:53.058928	\N	3I4iZCbpAzf4cyQvlxzQEiib2mqgfTz5	2025-07-13 03:09:53.057	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_QP1yJ19UFw3C	\N	\N	\N	\N	10	2025-07-13 03:21:56.784	2025-07-13 03:21:56.786295	\N	FA2eC7xAg5anDfgiGOnB2ttSgcRLvAxQ	2025-07-13 03:21:56.784	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_4l26IOU8MnQ2	\N	\N	\N	\N	10	2025-07-13 03:21:56.788	2025-07-13 03:21:56.78909	\N	LJvT8XINY3FU-jfIQ37kVKDBBhKA8EMx	2025-07-13 03:21:56.788	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_LX_OrqU8hjOu	\N	\N	\N	\N	10	2025-07-13 03:21:56.789	2025-07-13 03:21:56.791663	\N	7T4PHO7UWAj3pHmKszC9qNIJEO25CilB	2025-07-13 03:21:56.789	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_K6OcRZfpEWIU	\N	\N	\N	\N	10	2025-07-13 03:21:56.805	2025-07-13 03:21:56.806354	\N	a9HZteussWm0yNjbKWUqB3kihPipYl3H	2025-07-13 03:21:56.805	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_y6D_NAWVLGBR	\N	\N	\N	\N	10	2025-07-13 02:48:11.975	2025-07-13 02:48:12.128172	\N	1iSaJxiv8x2abjCkQ7CfIk832oRLXya_	2025-07-13 02:48:28.737	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_mDZjnFZ_UPLl	\N	\N	\N	\N	10	2025-07-13 03:21:56.821	2025-07-13 03:21:56.822552	\N	cOQxlHJfYcPm7lOMmSLEiHQS5KSI45Bx	2025-07-13 03:21:56.821	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_exaH1kChwcyv	\N	\N	\N	\N	10	2025-07-13 03:21:56.825	2025-07-13 03:21:56.827803	\N	MWFY2EvZq3pzqnvd5n94_b2CKno4_oG9	2025-07-13 03:21:56.825	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_yzx7TnyFdZat	\N	\N	\N	\N	10	2025-07-13 03:21:56.877	2025-07-13 03:21:56.878405	\N	x_nCTUyJzE38ifLeroJpSuF4IqsEmH5J	2025-07-13 03:21:56.877	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Sa1Kh0wx-on6	\N	\N	\N	\N	10	2025-07-13 03:21:56.88	2025-07-13 03:21:56.881014	\N	1uPkCXqTuDVO9UNAQs4uB7fDaQnYZdA2	2025-07-13 03:21:56.88	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_fJR0jcOE4Jsx	\N	\N	\N	\N	10	2025-07-13 03:21:56.882	2025-07-13 03:21:56.883813	\N	rqjbSQuwR3OF5gyJILsQw4RcZIiQWsSi	2025-07-13 03:21:56.882	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ieDn3m_pOXcM	\N	\N	\N	\N	10	2025-07-13 03:08:16.086	2025-07-13 03:08:16.088859	\N	Fy8PJI_zf0XLpyG49T9JhKRuCsXk5s3J	2025-07-13 03:08:16.086	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_OQLQKFIjyHTF	\N	\N	\N	\N	10	2025-07-13 02:48:42.722	2025-07-13 02:48:42.878388	\N	Si3RtSGye2qCR83bu-XMKU4QwQEMR-8o	2025-07-13 02:48:42.722	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest__VV8H-MDTuUK	\N	\N	\N	\N	10	2025-07-13 03:21:56.894	2025-07-13 03:21:56.895478	\N	dBAdjzlBWje4feURrY3V7MQ9QsAeuTJM	2025-07-13 03:21:56.894	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_mFJ7_ZNqlkhh	\N	\N	\N	\N	10	2025-07-13 03:21:56.897	2025-07-13 03:21:56.898436	\N	2hFZddEhHQ7jlFMaLBoLRl8QjORtjUV3	2025-07-13 03:21:56.897	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Jh5YhsMoClR6	\N	\N	\N	\N	10	2025-07-13 03:21:56.899	2025-07-13 03:21:56.900842	\N	WchXI1TZyvv6QKfUEMHPYhD2M_8SsiUE	2025-07-13 03:21:56.899	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_HL9KWtL8Lsr-	\N	\N	\N	\N	10	2025-07-13 03:21:56.901	2025-07-13 03:21:56.902856	\N	UicigyDCJQ0PsHezICrQvAF6I4yTzXGC	2025-07-13 03:21:56.901	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_VZTpkQ2ApREW	\N	\N	\N	\N	10	2025-07-13 03:21:56.909	2025-07-13 03:21:56.911156	\N	nzardqXCDqxLzOzb7m-lsPHxgY2j_Mts	2025-07-13 03:21:56.909	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_zK0B4d-pRhOL	\N	\N	\N	\N	10	2025-07-13 03:21:56.92	2025-07-13 03:21:56.921112	\N	t2qYz6dNEz4TUVA8N4bDDcgzN6XZXbF2	2025-07-13 03:21:56.92	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_OCeO_iXtbWVZ	\N	\N	\N	\N	10	2025-07-13 03:21:56.936	2025-07-13 03:21:56.937761	\N	79YP1cfEp_C0e2g0IYpjzWxxLflQ6JMm	2025-07-13 03:21:56.936	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_22AuR4cmW1mj	\N	\N	\N	\N	10	2025-07-13 03:21:56.937	2025-07-13 03:21:56.939625	\N	UVuMoI9kbm1nR5MAhSYi1a-6g_DrBJjW	2025-07-13 03:21:56.937	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_mr9uF9zyPc32	\N	\N	\N	\N	10	2025-07-13 03:21:56.946	2025-07-13 03:21:56.948082	\N	wHcXQi7autUcCKdok37LhYMhktKbAf7_	2025-07-13 03:21:56.946	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_G3-LMdBaH7vk	\N	\N	\N	\N	10	2025-07-13 03:21:56.994	2025-07-13 03:21:56.995365	\N	TesNlmPJi2K9yre7XsEVjznoMC1hFvBy	2025-07-13 03:21:56.994	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_skdQxUEDpdhj	\N	\N	\N	\N	10	2025-07-13 03:21:57.004	2025-07-13 03:21:57.005204	\N	M1I8Vquz0mfrLE7lak5U6SNQfX3szOxn	2025-07-13 03:21:57.004	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_FsYJ3XJVFfOy	\N	\N	\N	\N	10	2025-07-13 03:21:57.009	2025-07-13 03:21:57.011426	\N	Vtl9cKtU_dOXoTBgjfV92rxJqqcKtETB	2025-07-13 03:21:57.009	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_zTAYYkUnlfNy	\N	\N	\N	\N	10	2025-07-13 03:21:57.012	2025-07-13 03:21:57.013576	\N	KbBkkYrtukoAHenB0o37T15pOVP13e3k	2025-07-13 03:21:57.012	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_lB92ZT699Efp	\N	\N	\N	\N	10	2025-07-13 03:21:57.022	2025-07-13 03:21:57.023648	\N	YIBl_Uu1PkO46LQD3GO5bqyux59nOZeV	2025-07-13 03:21:57.022	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_y9XCO6xIEQqa	\N	\N	\N	\N	10	2025-07-13 03:21:57.029	2025-07-13 03:21:57.031389	\N	7G2qNznGIaFIwygSaGM7aRKZApHMKvxX	2025-07-13 03:21:57.029	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest__gC9AgBYgFd6	\N	\N	\N	\N	10	2025-07-13 03:21:57.031	2025-07-13 03:21:57.032647	\N	LFSCxHgmJiMU75o4PKqPluZ-MrInspPo	2025-07-13 03:21:57.031	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_fjlGhvzEkMbS	\N	\N	\N	\N	10	2025-07-13 03:21:44.71	2025-07-13 03:21:44.711339	\N	5pEGJ3Z7gipgIAVoLY2-mUtP19xTWqvH	2025-07-13 03:22:06.029	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_uKbzhyjGOUfF	\N	\N	\N	\N	10	2025-07-13 03:22:20.686	2025-07-13 03:22:20.687914	\N	bch53yqdeaBxnwLF6Grp0OrKU0ggD-MZ	2025-07-13 03:22:20.686	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_BOSLWgHgASV-	\N	\N	\N	\N	10	2025-07-13 03:20:29.836	2025-07-13 03:20:29.838502	\N	7ecOlXgZt3Pb9gloJ8Dna3-GHaMIQ0SH	2025-07-13 04:12:24.982	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_62mJK5XU8NbZ	\N	\N	\N	\N	10	2025-07-13 03:21:56.292	2025-07-13 03:21:56.293529	\N	IcENTHPZW6fwK0HulR5h9Lxo2-Fj5XD2	2025-07-13 03:21:56.292	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest__OQW0A-Yc4RN	\N	\N	\N	\N	10	2025-07-13 03:21:56.305	2025-07-13 03:21:56.306089	\N	TMTrBxPTtwl_GXNf2UJICXxzeP2SfDIA	2025-07-13 03:21:56.305	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_vDHN_gm91Luq	\N	\N	\N	\N	10	2025-07-13 03:21:56.314	2025-07-13 03:21:56.315204	\N	CN-ma3Y5bmGAFxKmQul_HGKSO7takiHT	2025-07-13 03:21:56.314	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_V5YKJmAMfcKt	\N	\N	\N	\N	10	2025-07-13 03:21:56.363	2025-07-13 03:21:56.364569	\N	wA2hyHg3lW0EjGn3q2hiYHkHKAWMsSRj	2025-07-13 03:21:56.363	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_EAkgcopXNoIt	\N	\N	\N	\N	10	2025-07-13 03:21:56.383	2025-07-13 03:21:56.384844	\N	oC_BiOlsNFaROzlCwc-7pB_uu9FLE2cG	2025-07-13 03:21:56.383	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_TBCGr3h5p556	\N	\N	\N	\N	10	2025-07-13 03:21:56.391	2025-07-13 03:21:56.393017	\N	t6JY5FmaNLADfZ2FIbBE5VoFKEEqF3-0	2025-07-13 03:21:56.391	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_4D0ocPszIOJu	\N	\N	\N	\N	10	2025-07-13 03:21:56.407	2025-07-13 03:21:56.408912	\N	2rCy6Yqsh5OKy2ik1V14nR8_nVNW7hbD	2025-07-13 03:21:56.407	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Oyfbw4H9hwXV	\N	\N	\N	\N	10	2025-07-13 03:21:56.415	2025-07-13 03:21:56.417269	\N	j70Dj6yJaB8y9P81pB2pgCAV2G_qpOhI	2025-07-13 03:21:56.415	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_GYUHVqyfDDyj	\N	\N	\N	\N	10	2025-07-13 03:21:56.439	2025-07-13 03:21:56.441	\N	bLk3-nkCi9trKPfXMX18dTHyyb46AtCP	2025-07-13 03:21:56.439	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_rfdB2feL4aBp	\N	\N	\N	\N	10	2025-07-13 03:21:56.447	2025-07-13 03:21:56.448911	\N	yh9d3bGcHt9qn-PTlwS3slKu1aquCTnf	2025-07-13 03:21:56.447	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_iT_xa5TPFusG	\N	\N	\N	\N	10	2025-07-13 03:21:56.478	2025-07-13 03:21:56.527496	\N	G8b9yOjkE-0ehX7w67zmZ6jpUHkN1cP3	2025-07-13 03:21:56.478	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_d9kYFGd7e1d7	\N	\N	\N	\N	10	2025-07-13 03:21:56.48	2025-07-13 03:21:56.528117	\N	Kvu5RAYZgJeTFaNb2y58Wctb7naq36y2	2025-07-13 03:21:56.48	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_LiOAEd5CrkYU	\N	\N	\N	\N	10	2025-07-13 03:21:56.527	2025-07-13 03:21:56.535994	\N	ot17kIFoap9_0WlF06QNc3PDN4-gmDRE	2025-07-13 03:21:56.527	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ILMVw2xuvX21	\N	\N	\N	\N	10	2025-07-13 03:21:56.542	2025-07-13 03:21:56.551311	\N	dtZcSZyfO3N-9rNaxi9KrfD2CwaJgxhU	2025-07-13 03:21:56.542	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_YqcWVfPtrrEB	\N	\N	\N	\N	10	2025-07-13 03:21:56.545	2025-07-13 03:21:56.555349	\N	4m7sNC7BVebZ05RNSJioI04ERg0_cEu0	2025-07-13 03:21:56.545	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_DQM8EcyWCK-O	\N	\N	\N	\N	10	2025-07-13 03:21:56.546	2025-07-13 03:21:56.558237	\N	wXnyexqvfSrqvcjl0sCRwrQbp9oHtTaX	2025-07-13 03:21:56.546	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_7lBc0UAwUgsF	\N	\N	\N	\N	10	2025-07-13 03:21:56.786	2025-07-13 03:21:56.788554	\N	nWMDo76P3SDkT9AoqmknM5Ggfg4piHMl	2025-07-13 03:21:56.786	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_53AJgDwBEuaI	\N	\N	\N	\N	10	2025-07-13 03:21:56.792	2025-07-13 03:21:56.795531	\N	b8MfiVWCrwtG8SKLPO8bT3v5rDyb0R2w	2025-07-13 03:21:56.792	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ktL8h3L7L1fU	\N	\N	\N	\N	10	2025-07-13 03:21:56.8	2025-07-13 03:21:56.802025	\N	zjev8C0utmaVIyJZyi1_jtr-dXrFm6hn	2025-07-13 03:21:56.8	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_STUF5zQRakBc	\N	\N	\N	\N	10	2025-07-13 03:21:56.81	2025-07-13 03:21:56.811612	\N	LFSM1d8RJZxzX5ggWTfyWhDIbpSlywBh	2025-07-13 03:21:56.81	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_NhJD-pSEmd2Z	\N	\N	\N	\N	10	2025-07-13 03:21:56.865	2025-07-13 03:21:56.866481	\N	2M6_BJr6GQRAZqPy9WVghuW2H0NjTQ7w	2025-07-13 03:21:56.865	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_J0qf7ZJSG4Cn	\N	\N	\N	\N	10	2025-07-13 03:21:56.87	2025-07-13 03:21:56.871716	\N	H27rbkzUDqPDGMavvXrHT2NFnziEnTEO	2025-07-13 03:21:56.87	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_P8V3rmL3Hmk-	\N	\N	\N	\N	10	2025-07-13 03:21:56.885	2025-07-13 03:21:56.886789	\N	ZUUjehAy5GWa-cz0yFYadh9twzqA9hdj	2025-07-13 03:21:56.885	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest__ixj49-mvMci	\N	\N	\N	\N	10	2025-07-13 03:21:56.892	2025-07-13 03:21:56.893574	\N	eUDxAdu5S9TYdmIPf3_COetUXy2LfHB8	2025-07-13 03:21:56.892	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_0Gnjd9F69-f6	\N	\N	\N	\N	10	2025-07-13 03:21:56.895	2025-07-13 03:21:56.896105	\N	qV7QPyg9AmbbmitvzsWiHdNBdT0scl4u	2025-07-13 03:21:56.895	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_nI4RtVDDWmLz	\N	\N	\N	\N	10	2025-07-13 03:21:56.906	2025-07-13 03:21:56.907799	\N	t112rtIOV_ryO4XRo55jeVZRAvq6kaiv	2025-07-13 03:21:56.906	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_SRI5fytCOF7P	\N	\N	\N	\N	10	2025-07-13 03:21:56.908	2025-07-13 03:21:56.909946	\N	urdq35nOubp5WJQyij-_TwSIUe8eqFVG	2025-07-13 03:21:56.908	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_W5lcMJdwuki8	\N	\N	\N	\N	10	2025-07-13 03:21:56.911	2025-07-13 03:21:56.912972	\N	2-Vu9uAD-UZ6NEC-vmseFr9ermMBysp1	2025-07-13 03:21:56.911	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Yc_nsg9auo8V	\N	\N	\N	\N	10	2025-07-13 03:21:56.919	2025-07-13 03:21:56.920389	\N	9Zn5q61XJr8iStIopP032z3FrHpepsCk	2025-07-13 03:21:56.919	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_KUyyIvbmVjuY	\N	\N	\N	\N	10	2025-07-13 03:21:56.944	2025-07-13 03:21:56.945095	\N	z1E7yTSo4VdVLwrcO03-71mXG97Du_3I	2025-07-13 03:21:56.944	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_STtbDpzrj-9j	\N	\N	\N	\N	10	2025-07-13 03:21:56.992	2025-07-13 03:21:56.9935	\N	FiR_C9txMUuvmnWSbydGUugTuFefmeCJ	2025-07-13 03:21:56.992	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_tCMDmnmfqzsB	\N	\N	\N	\N	10	2025-07-13 03:21:56.993	2025-07-13 03:21:56.994357	\N	NFD9ZNvmAXFsah4FvvFujJPcP7lSj7up	2025-07-13 03:21:56.993	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_aEp4-ogXfUaA	\N	\N	\N	\N	10	2025-07-13 03:21:57.022	2025-07-13 03:21:57.023031	\N	QJbtZGRiZDIid5xtM8CcGQNHeLOGoS83	2025-07-13 03:21:57.022	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_vnRgbQMv234i	\N	\N	\N	\N	10	2025-07-13 03:21:57.027	2025-07-13 03:21:57.028576	\N	1sb9NK3GV4UfZgeNN6VSW_UFJ8Y5cBFZ	2025-07-13 03:21:57.027	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_rugp14FQKkTT	\N	\N	\N	\N	10	2025-07-13 03:21:57.028	2025-07-13 03:21:57.029455	\N	sMPUvzWTB6HS7ujnhOsNq9EhVaFzkDBM	2025-07-13 03:21:57.028	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Fjsg8Yhuew0G	\N	\N	\N	\N	10	2025-07-13 03:21:57.032	2025-07-13 03:21:57.034756	\N	3C9_v1cURF7_LcXoAJ8_FLwuPYCqemp9	2025-07-13 03:21:57.032	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_roxXYuqKoZsE	\N	\N	\N	\N	10	2025-07-13 03:21:57.033	2025-07-13 03:21:57.035297	\N	7dBDSTGpOcyOl4YKaFVfcISVR0OGtV7X	2025-07-13 03:21:57.033	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_tBmEgrx35u0U	\N	\N	\N	\N	10	2025-07-13 02:56:44.1	2025-07-13 02:56:44.29826	\N	4wmcDHOu0YImWlw700zcBheJLAAmyNVZ	2025-07-13 04:09:06.691	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_GylKKSe7J7p3	\N	\N	\N	\N	10	2025-07-13 04:09:57.544	2025-07-13 04:09:57.6132	\N	h9cEBzndhe6e18ts66DDEwUSn6Q0s-s6	2025-07-13 04:09:57.544	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_spmwOi8sBpLf	\N	\N	\N	\N	10	2025-07-13 04:10:02.098	2025-07-13 04:10:02.168232	\N	MFPQwv6AWulZDnYbomtgFJhVPe_n1XgT	2025-07-13 04:10:02.098	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ZPa9GI9IJBZN	\N	\N	\N	\N	10	2025-07-13 03:21:44.652	2025-07-13 03:21:44.658643	\N	S0V2-5O5oBGse-fWPxs5jZZoPX_-7ngB	2025-07-13 03:22:05.242	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_QDXZG2KjPpbb	\N	\N	\N	\N	10	2025-07-13 04:10:09.414	2025-07-13 04:10:09.483217	\N	aeUUGFeiSro9KI4xSxWFr5bukEBPJTp2	2025-07-13 04:10:09.414	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Ae-w4BtblurL	\N	\N	\N	\N	10	2025-07-13 04:10:14.374	2025-07-13 04:10:14.443202	\N	JUt-bTyKGTPpT9i6DOMAxtgI6vck7Y8b	2025-07-13 04:10:14.374	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_eHTPG3GLsdO4	\N	\N	\N	\N	10	2025-07-13 04:09:17.288	2025-07-13 04:09:17.363241	\N	csLysy-wbYMnR8iV0HlGLB6elNu34kxe	2025-07-13 11:53:22.181	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_HTMY47B9OLGx	\N	\N	\N	\N	10	2025-07-13 04:18:53.519	2025-07-13 04:18:53.521983	\N	6EtGwqJ2qDz-pNKu4AIkhmID9hOFvW7j	2025-07-13 04:18:53.519	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_bRgk9QWn0wh8	\N	\N	\N	\N	10	2025-07-13 04:20:05.132	2025-07-13 04:20:05.139534	\N	SUD4-7QOX7CTdlo-4sMiC3_7nr8wnYZc	2025-07-13 04:20:09.102	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_GcAI8dn8C89Y	\N	\N	\N	\N	10	2025-07-13 04:27:25.041	2025-07-13 04:27:25.042478	\N	wYW01eU_4ox7tUixeBrbIV-HhPyXQgBv	2025-07-13 04:27:25.041	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_rRcbJRw-k1cz	\N	\N	\N	\N	10	2025-07-13 04:48:55.975	2025-07-13 04:48:55.976942	\N	y1KmWxMKY8UvATwWMxETi3QcGf4fC-yQ	2025-07-13 04:48:55.975	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_xDvr8_ohPuTh	\N	\N	\N	\N	10	2025-07-13 05:02:23.273	2025-07-13 05:02:23.274483	\N	hfNwF2tgnPEjgD0THP5irBcpM7qeJHcB	2025-07-13 05:02:23.273	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_6U6d3GTB8sDp	\N	\N	\N	\N	10	2025-07-13 05:15:57.21	2025-07-13 05:15:57.212181	\N	sqOX1eAoO0GV34-gpp-dwx-BPTHUdrE7	2025-07-13 05:15:57.21	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_SOgtuKcp4498	\N	\N	\N	\N	10	2025-07-13 06:09:32.106	2025-07-13 06:09:32.107391	\N	NQKxwpY_JIllzwrvTEHB22rg_oAwoyN8	2025-07-13 06:09:32.106	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_sldl-5eRK-LB	\N	\N	\N	\N	10	2025-07-13 06:26:12.582	2025-07-13 06:26:12.584423	\N	rTUhoR6zhrUiTgBfxyDmC-fHM05vF5yO	2025-07-13 06:26:12.582	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ouD6Ngex4vVn	\N	\N	\N	\N	10	2025-07-13 07:04:06.997	2025-07-13 07:04:06.999177	\N	i57-Twf5ybbvLKjUC5Zw4ft2IJmc7FKo	2025-07-13 07:10:54.273	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_5VLLTnDlKvQ8	\N	\N	\N	\N	10	2025-07-13 07:23:43.93	2025-07-13 07:23:43.933419	\N	y-QvAzHdJLDxg6H3QQhw1erXf2ISj6fI	2025-07-13 07:23:43.93	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Aig-Hln1BGkE	\N	\N	\N	\N	10	2025-07-13 07:41:40.725	2025-07-13 07:41:40.72689	\N	rT7pjC4a1q-cPjVRBVO6PRl2Ni8QgpUA	2025-07-13 07:41:40.725	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_O3m-X5Eu5XWv	\N	\N	\N	\N	10	2025-07-13 07:56:08.549	2025-07-13 07:56:08.550743	\N	3gwWvOERVQkPwDdacIkqIfHQ3GwP8Bh_	2025-07-13 07:56:08.549	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_c4ZTwREeq0oq	\N	\N	\N	\N	10	2025-07-13 08:11:26.022	2025-07-13 08:11:26.024346	\N	NroGaIq5sv4Pw-rwZkh0ZLyYn_LqpSxR	2025-07-13 08:11:26.022	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_6oofwBdUMus8	\N	\N	\N	\N	10	2025-07-13 08:15:24.225	2025-07-13 08:15:24.22738	\N	LtcN4B4AJNo3WNB7jBRKr1HgHbtJAHLX	2025-07-13 08:15:24.225	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_OlW5-mP6uWn2	\N	\N	\N	\N	10	2025-07-13 08:29:46.883	2025-07-13 08:29:46.885018	\N	9TW6nZWV-rqcy8lPLpuHeIBkl8AYtapr	2025-07-13 08:29:46.883	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_mpDE-n43J2-O	\N	\N	\N	\N	10	2025-07-13 08:42:31.518	2025-07-13 08:42:31.519372	\N	LjzlU0TKLOdBCEmEr6rh5W75I7IoZWaH	2025-07-13 08:42:31.518	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Umgj-_Fx1QJp	\N	\N	\N	\N	10	2025-07-13 08:55:41.665	2025-07-13 08:55:41.667157	\N	q0qvZ1XzMFMiIGnZ9X_gj2-C6X2neJiJ	2025-07-13 08:55:41.665	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_XjZh4H--z7Q1	\N	\N	\N	\N	10	2025-07-13 08:55:42.573	2025-07-13 08:55:42.574536	\N	wo9Bbmp-b6SYiiO0N70V_C1MUv0QuFMw	2025-07-13 08:55:42.573	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Q1lzhgBCwC3s	\N	\N	\N	\N	10	2025-07-13 08:55:43.545	2025-07-13 08:55:43.546318	\N	GOstkoxeqABzbVkdKpJUX2N7ncC289ET	2025-07-13 08:55:43.545	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_IAUVgsuUNJxn	\N	\N	\N	\N	10	2025-07-13 08:55:47.078	2025-07-13 08:55:47.080141	\N	nuaOl95YlA-fnEVovgzgjyqiQACRh4Py	2025-07-13 08:55:47.078	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_IAYL2zF1vnqB	\N	\N	\N	\N	10	2025-07-13 08:55:47.999	2025-07-13 08:55:48.001748	\N	1aLXZHB7PRqBy1zTARmT7umIbjF8Ue-t	2025-07-13 08:55:47.999	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_SDvLEvN_8plW	\N	\N	\N	\N	10	2025-07-13 08:55:48.941	2025-07-13 08:55:48.942544	\N	jEtzEVokAJ_KtyZ_fD3HCcORm8SEdwx4	2025-07-13 08:55:48.941	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_FVq9uc7dHegb	\N	\N	\N	\N	10	2025-07-13 08:55:49.892	2025-07-13 08:55:49.894054	\N	J7oFkDPrIbCEceB8wkd8tWgq59NET1J3	2025-07-13 08:55:49.892	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_IseUhF2lDyWp	\N	\N	\N	\N	10	2025-07-13 08:55:50.811	2025-07-13 08:55:50.812493	\N	X_5RcAfgVn_jJHn3CUCsdl6TBBgueHbm	2025-07-13 08:55:50.811	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_1-E5gqo-XKL6	\N	\N	\N	\N	10	2025-07-13 08:55:51.748	2025-07-13 08:55:51.74922	\N	5AIsFvrGZGZNSqtYrRtkUnqfOC3vt_FT	2025-07-13 08:55:51.748	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_IOHLJr2LjpYs	\N	\N	\N	\N	10	2025-07-13 09:14:32.972	2025-07-13 09:14:32.973421	\N	sptEb49sYLCqQD1ZIJawdiv9aGqii4da	2025-07-13 09:14:32.972	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_lLxQQHJ4vsBI	\N	\N	\N	\N	10	2025-07-13 10:02:14.918	2025-07-13 10:02:14.920027	\N	PBpJ8bNPM0GkuGKjTR1QOxPPtNpi3Hhv	2025-07-13 10:02:14.918	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_7lzfs9zqpwSx	\N	\N	\N	\N	10	2025-07-13 15:49:17.559	2025-07-13 15:49:17.560702	\N	CVxzxaHBXJOD6B8wxB4_Eh_wo33QMNud	2025-07-13 15:49:17.559	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_azsazlT0bdwN	\N	\N	\N	\N	10	2025-07-13 16:01:07.454	2025-07-13 16:01:07.456434	\N	A6x1RsdxVGMTNy5bhOzgps3p0m8Pm_gx	2025-07-13 16:01:07.454	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_t_FnhK-WixCS	\N	\N	\N	\N	10	2025-07-13 16:01:18.135	2025-07-13 16:01:18.13684	\N	3yGY5Z-tlc0hLvL0aM4FtbGr6jXf8XIF	2025-07-13 16:01:18.135	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_3qUAwM2qbbxf	\N	\N	\N	\N	10	2025-07-13 16:35:20.129	2025-07-13 16:35:20.130969	\N	t3TZ14MMNVCae9g2HdQUpf296CihZ_MZ	2025-07-13 16:35:23.082	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_2sqFbWhISdRJ	\N	\N	\N	\N	10	2025-07-13 08:55:44.543	2025-07-13 08:55:44.544577	\N	-RE1r86tHEoRc5c3p0UtSF_zN-iE_8qE	2025-07-13 08:55:44.543	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_4gsEBlQDxL_f	\N	\N	\N	\N	10	2025-07-13 08:55:45.53	2025-07-13 08:55:45.532144	\N	LttG1OdcseUfkV3JDreerC3soy_3Q5Tp	2025-07-13 08:55:45.53	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_dvM9RkP1_GB3	\N	\N	\N	\N	10	2025-07-10 02:43:10.045	2025-07-10 02:43:10.080491	\N	C-25NisiNJgXPccDxcN-LCxIELy_zOtO	2025-07-10 02:43:10.045	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_nvH2O9f8Ls7t	\N	\N	\N	\N	10	2025-07-10 03:08:03.551	2025-07-10 03:08:03.803158	\N	z_rlrisLDfoCtNAWkQ8thLtzCv19mhxH	2025-07-10 03:08:03.551	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_VexOcNDj7hT5	\N	\N	\N	\N	10	2025-07-10 03:08:03.59	2025-07-10 03:08:03.804642	\N	Iz9Vvhw-APHkpur_mLs6RvSEsvx_voRh	2025-07-10 03:08:03.59	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_uhyZiCOM5kh0	\N	\N	\N	\N	10	2025-07-10 03:08:03.565	2025-07-10 03:08:03.805079	\N	CT4d4ifgunNSc9268z7RB0l3uBjl4SqX	2025-07-10 03:08:03.565	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_weO8oLBAGKap	\N	\N	\N	\N	10	2025-07-10 03:08:03.618	2025-07-10 03:08:04.926859	\N	kubduw5GHwd0a9Tsgz_J0rDqVbZ6zbhc	2025-07-10 03:08:03.618	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_I5SJBmtq2I67	\N	\N	\N	\N	10	2025-07-10 03:08:03.711	2025-07-10 03:08:04.92818	\N	aijxS_yBVx5iniqy4wYuozBIy55keONe	2025-07-10 03:08:03.711	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_M0MlNzGtjAlM	\N	\N	\N	\N	10	2025-07-10 03:08:03.675	2025-07-10 03:08:04.92875	\N	21zzDFuLxGwzXanz6JWf9rxb38ummVM3	2025-07-10 03:08:03.675	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_rjB6IN6tlcZP	\N	\N	\N	\N	10	2025-07-10 03:08:03.696	2025-07-10 03:08:04.929411	\N	6TaDjTdZkg0_bYvfVp-W9_9-Yab2mDmT	2025-07-10 03:08:03.696	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_wFM1SAZPdgJG	\N	\N	\N	\N	10	2025-07-10 03:08:03.651	2025-07-10 03:08:04.929977	\N	kmJBxl0WHdBElHW-9LdCyiDbIZe04hGf	2025-07-10 03:08:03.651	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_NT2bzWxpj53_	\N	\N	\N	\N	10	2025-07-10 03:08:03.633	2025-07-10 03:08:04.930277	\N	hy2nm3fwGrIlUKjkil2k33o1Es0gwcoH	2025-07-10 03:08:03.633	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_rlCSjwfH0mTX	\N	\N	\N	\N	10	2025-07-10 03:08:03.609	2025-07-10 03:08:04.930517	\N	-jTKCrBqrdvMl8MPfBVa7Eyz-ta8fOH9	2025-07-10 03:08:03.609	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ppNW64cvzgT0	\N	\N	\N	\N	10	2025-07-10 03:08:03.7	2025-07-10 03:08:04.930775	\N	m6ZG5JHbXHRLkr5ul3jH0DHCvKculWp0	2025-07-10 03:08:03.7	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_AKbztaTSf7Sk	\N	\N	\N	\N	10	2025-07-10 02:53:47.416	2025-07-10 02:53:47.452204	\N	_XMc7xwM16m8sZs0PQh1fQsTa7RH-ps9	2025-07-10 02:54:24.838	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
system_backlog	\N	\N	\N	\N	-10	2025-07-14 09:31:10.913	2025-07-14 09:51:52.609	\N	\N	2025-07-14 09:31:10.913	\N	\N	f	f	2025-07-14 14:31:11.068267	1	1
admin_debug	admin@magicvidio.com	Admin	User	https://via.placeholder.com/150?text=A	1000	2025-06-14 15:13:12.945243	2025-07-14 17:07:57.079	@magicvidio	\N	2025-07-14 22:07:57.078	\N	google	f	f	2025-07-13 17:30:54.503155	3	3
shared_guest_user	\N	\N	\N	\N	723	2025-07-13 14:41:51.752	2025-07-14 17:20:07.771	\N	fW3xNWp5F2MOMROzthvtFnbbXIvkpvSz	2025-07-14 22:32:26.305	\N	\N	t	t	2025-07-13 17:30:54.503	2	1
guest_MwNoPO11i-t5	\N	\N	\N	\N	10	2025-07-13 11:30:31.513	2025-07-13 11:30:31.51512	\N	YzhwFsfvbog2n3geYSWJOYCBXu4qdfo0	2025-07-13 11:30:31.513	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_OQ0LhHvNIwIs	\N	\N	\N	\N	10	2025-07-13 11:47:25.072	2025-07-13 11:47:25.073495	\N	ZwJOFDiQ87SBTdp1PwyODv80nEiv1dSK	2025-07-13 11:47:25.072	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_Ec06vOSwNBOq	\N	\N	\N	\N	10	2025-07-13 11:59:08.29	2025-07-13 11:59:08.292318	\N	fuoDNy1Ps4cX-a5XKsayIKqQLamnhPyQ	2025-07-13 11:59:08.29	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_hEza6xJO--LP	\N	\N	\N	\N	10	2025-07-13 12:00:52.21	2025-07-13 12:00:52.212299	\N	yMTXjVphKQd9HegXBZWWg8pbOE6bsxpz	2025-07-13 12:00:52.21	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_aklHGyUndLDi	\N	\N	\N	\N	10	2025-07-13 12:01:17.981	2025-07-13 12:01:17.98241	\N	rh78hVyX5jLlja0l1qwqzpaVePUSzYyp	2025-07-13 12:01:17.981	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_emRqRPrm3Vkl	\N	\N	\N	\N	10	2025-07-13 12:11:56.563	2025-07-13 12:11:56.565146	\N	xvWG8t7Og2R0jZMWKwGoViOiXuvuucVO	2025-07-13 12:11:56.563	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_kpE9RlicJrzi	\N	\N	\N	\N	10	2025-07-13 12:33:06.217	2025-07-13 12:33:06.219045	\N	9IFLcCM_VPLuLl7Fr6rfpE0JV_oQKGp4	2025-07-13 12:33:06.217	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_MMm3ONGodZFS	\N	\N	\N	\N	10	2025-07-13 12:43:26.838	2025-07-13 12:43:26.839315	\N	sTA13LyPODnLLoxt-eDd9v_WFQ4CiQ99	2025-07-13 12:43:26.838	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_JsctA47z4q_k	\N	\N	\N	\N	10	2025-07-13 12:49:41.681	2025-07-13 12:49:41.682522	\N	86jVJ2JxyiBrix5_UV1OFsxGHlcq8gD2	2025-07-13 12:49:41.681	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_vUIFoqL0WE0-	\N	\N	\N	\N	10	2025-07-13 12:55:20.061	2025-07-13 12:55:20.063243	\N	axQD1y2V5VwNYuAhaKhdeSzuFn2ng9eH	2025-07-13 12:55:20.061	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_fAIEXqQ1WN1j	\N	\N	\N	\N	10	2025-07-13 12:55:21.008	2025-07-13 12:55:21.010087	\N	ozt8BuVjw_LNfu3t7PtkZGfpMJcFtV0A	2025-07-13 12:55:21.008	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_OH7Tmkgixe24	\N	\N	\N	\N	10	2025-07-13 12:55:44.66	2025-07-13 12:55:44.661248	\N	auhqBXjVbT7X99Jq3iPeLt54qHer3syU	2025-07-13 12:55:44.66	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_ZS-xQD3Y6NZ2	\N	\N	\N	\N	10	2025-07-13 14:15:22.368	2025-07-13 14:15:22.574244	\N	8um7cqXu5zW8Z10PG_5l8FfvGDiqwth2	2025-07-13 14:15:22.368	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_p0VEYGB-tZhI	\N	\N	\N	\N	10	2025-07-13 14:15:36.306	2025-07-13 14:15:36.535792	\N	dSmrQ_nQcOTUZlWfbq76VSjLc4_TtCU3	2025-07-13 14:15:36.306	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_kzhFALP0-4pf	\N	\N	\N	\N	10	2025-07-13 14:15:41.366	2025-07-13 14:15:41.5808	\N	btUHHSzLYGRFhjPguZsl-8pOa9sC8D1N	2025-07-13 14:15:41.366	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_F2rDU0ACVDnw	\N	\N	\N	\N	10	2025-07-13 14:19:24.199	2025-07-13 14:19:24.423933	\N	FduW7MMoSXuLKmavQBUVXvSl3KQYHyJ4	2025-07-13 14:43:48.527	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_KayemUHz8VUD	\N	\N	\N	\N	10	2025-07-13 14:40:31.682	2025-07-13 14:40:31.856524	\N	test_session_1752417631256	2025-07-13 14:40:31.854	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_MhwzLJr7fbf_	\N	\N	\N	\N	10	2025-07-13 14:40:32.003	2025-07-13 14:40:32.176467	\N	different_session_1752417631929	2025-07-13 14:40:32.003	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_m35fEq_iQ9m8	\N	\N	\N	\N	10	2025-07-13 14:51:39.001	2025-07-13 14:51:39.003053	\N	k8_l9tisfdMT1izVNNcKn_wuUBZfUouC	2025-07-13 14:51:39.001	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_I0ZNvFeJ9v8i	\N	\N	\N	\N	10	2025-07-13 15:04:31.915	2025-07-13 15:04:31.917191	\N	BXIeZ9nogIbcs6SRgIo2YEkI6_OabxTW	2025-07-13 15:04:31.915	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_FYWfqXu7MYu1	\N	\N	\N	\N	10	2025-07-13 15:45:48.054	2025-07-13 15:45:48.05738	\N	uu3RS8sr5KVd-mcfMR9Ta1d5f1zlyZHh	2025-07-13 15:45:48.054	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
guest_3ktGeHU518M5	\N	\N	\N	\N	10	2025-07-13 15:47:52.186	2025-07-13 15:47:52.188138	\N	bE-rtjdwh7V2P6p4VtSZIs6KB8pXqwT-	2025-07-13 15:47:52.186	\N	\N	t	t	2025-07-13 17:30:54.503155	2	1
\.


--
-- TOC entry 4630 (class 0 OID 0)
-- Dependencies: 250
-- Name: jobid_seq; Type: SEQUENCE SET; Schema: cron; Owner: -
--

SELECT pg_catalog.setval('cron.jobid_seq', 1, true);


--
-- TOC entry 4631 (class 0 OID 0)
-- Dependencies: 252
-- Name: runid_seq; Type: SEQUENCE SET; Schema: cron; Owner: -
--

SELECT pg_catalog.setval('cron.runid_seq', 4, true);


--
-- TOC entry 4632 (class 0 OID 0)
-- Dependencies: 213
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: -
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 1, false);


--
-- TOC entry 4633 (class 0 OID 0)
-- Dependencies: 215
-- Name: backlog_videos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.backlog_videos_id_seq', 1, false);


--
-- TOC entry 4634 (class 0 OID 0)
-- Dependencies: 217
-- Name: brand_assets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.brand_assets_id_seq', 1, false);


--
-- TOC entry 4635 (class 0 OID 0)
-- Dependencies: 219
-- Name: credit_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.credit_transactions_id_seq', 66, true);


--
-- TOC entry 4636 (class 0 OID 0)
-- Dependencies: 221
-- Name: export_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.export_transactions_id_seq', 1, false);


--
-- TOC entry 4637 (class 0 OID 0)
-- Dependencies: 223
-- Name: generations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.generations_id_seq', 280, true);


--
-- TOC entry 4638 (class 0 OID 0)
-- Dependencies: 225
-- Name: providers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.providers_id_seq', 1, true);


--
-- TOC entry 4639 (class 0 OID 0)
-- Dependencies: 228
-- Name: recipe_samples_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.recipe_samples_id_seq', 1, false);


--
-- TOC entry 4640 (class 0 OID 0)
-- Dependencies: 231
-- Name: recipes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.recipes_id_seq', 18, true);


--
-- TOC entry 4641 (class 0 OID 0)
-- Dependencies: 233
-- Name: revenue_shares_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.revenue_shares_id_seq', 1, false);


--
-- TOC entry 4642 (class 0 OID 0)
-- Dependencies: 235
-- Name: sample_likes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sample_likes_id_seq', 1, false);


--
-- TOC entry 4643 (class 0 OID 0)
-- Dependencies: 237
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.services_id_seq', 2, true);


--
-- TOC entry 4644 (class 0 OID 0)
-- Dependencies: 240
-- Name: smart_generation_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.smart_generation_requests_id_seq', 1, false);


--
-- TOC entry 4645 (class 0 OID 0)
-- Dependencies: 242
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tags_id_seq', 11, true);


--
-- TOC entry 4646 (class 0 OID 0)
-- Dependencies: 245
-- Name: type_services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.type_services_id_seq', 3, true);


--
-- TOC entry 4353 (class 2606 OID 22105)
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: -
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4355 (class 2606 OID 22107)
-- Name: backlog_videos backlog_videos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backlog_videos
    ADD CONSTRAINT backlog_videos_pkey PRIMARY KEY (id);


--
-- TOC entry 4357 (class 2606 OID 22109)
-- Name: brand_assets brand_assets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_assets
    ADD CONSTRAINT brand_assets_pkey PRIMARY KEY (id);


--
-- TOC entry 4359 (class 2606 OID 22111)
-- Name: credit_transactions credit_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credit_transactions
    ADD CONSTRAINT credit_transactions_pkey PRIMARY KEY (id);


--
-- TOC entry 4361 (class 2606 OID 22113)
-- Name: export_transactions export_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.export_transactions
    ADD CONSTRAINT export_transactions_pkey PRIMARY KEY (id);


--
-- TOC entry 4363 (class 2606 OID 22115)
-- Name: generations generations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.generations
    ADD CONSTRAINT generations_pkey PRIMARY KEY (id);


--
-- TOC entry 4365 (class 2606 OID 22118)
-- Name: generations generations_short_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.generations
    ADD CONSTRAINT generations_short_id_unique UNIQUE (short_id);


--
-- TOC entry 4367 (class 2606 OID 22120)
-- Name: providers providers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.providers
    ADD CONSTRAINT providers_pkey PRIMARY KEY (id);


--
-- TOC entry 4369 (class 2606 OID 22122)
-- Name: providers providers_title_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.providers
    ADD CONSTRAINT providers_title_unique UNIQUE (title);


--
-- TOC entry 4371 (class 2606 OID 22124)
-- Name: recipe_option_tag_icon recipe_option_tag_icon_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_option_tag_icon
    ADD CONSTRAINT recipe_option_tag_icon_pkey PRIMARY KEY (id);


--
-- TOC entry 4373 (class 2606 OID 22126)
-- Name: recipe_samples recipe_samples_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_samples
    ADD CONSTRAINT recipe_samples_pkey PRIMARY KEY (id);


--
-- TOC entry 4425 (class 2606 OID 22424)
-- Name: recipe_usage_options recipe_usage_options_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_usage_options
    ADD CONSTRAINT recipe_usage_options_pkey PRIMARY KEY (recipe_id);


--
-- TOC entry 4375 (class 2606 OID 22128)
-- Name: recipe_usage recipe_usage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_usage
    ADD CONSTRAINT recipe_usage_pkey PRIMARY KEY (recipe_id);


--
-- TOC entry 4377 (class 2606 OID 22130)
-- Name: recipes recipes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_pkey PRIMARY KEY (id);


--
-- TOC entry 4379 (class 2606 OID 22132)
-- Name: recipes recipes_referral_code_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_referral_code_unique UNIQUE (referral_code);


--
-- TOC entry 4381 (class 2606 OID 22134)
-- Name: revenue_shares revenue_shares_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.revenue_shares
    ADD CONSTRAINT revenue_shares_pkey PRIMARY KEY (id);


--
-- TOC entry 4383 (class 2606 OID 22136)
-- Name: sample_likes sample_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sample_likes
    ADD CONSTRAINT sample_likes_pkey PRIMARY KEY (id);


--
-- TOC entry 4389 (class 2606 OID 22138)
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- TOC entry 4392 (class 2606 OID 22140)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- TOC entry 4394 (class 2606 OID 22142)
-- Name: smart_generation_requests smart_generation_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.smart_generation_requests
    ADD CONSTRAINT smart_generation_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 4396 (class 2606 OID 22144)
-- Name: tags tags_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_name_unique UNIQUE (name);


--
-- TOC entry 4398 (class 2606 OID 22146)
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- TOC entry 4400 (class 2606 OID 22148)
-- Name: type_audio type_audio_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type_audio
    ADD CONSTRAINT type_audio_pkey PRIMARY KEY (id);


--
-- TOC entry 4402 (class 2606 OID 22150)
-- Name: type_audio type_audio_title_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type_audio
    ADD CONSTRAINT type_audio_title_unique UNIQUE (title);


--
-- TOC entry 4422 (class 2606 OID 22385)
-- Name: type_role type_role_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type_role
    ADD CONSTRAINT type_role_pkey PRIMARY KEY (id);


--
-- TOC entry 4404 (class 2606 OID 22152)
-- Name: type_services type_services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type_services
    ADD CONSTRAINT type_services_pkey PRIMARY KEY (id);


--
-- TOC entry 4406 (class 2606 OID 22154)
-- Name: type_services type_services_title_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type_services
    ADD CONSTRAINT type_services_title_unique UNIQUE (title);


--
-- TOC entry 4420 (class 2606 OID 22375)
-- Name: type_user type_user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type_user
    ADD CONSTRAINT type_user_pkey PRIMARY KEY (id);


--
-- TOC entry 4412 (class 2606 OID 22156)
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- TOC entry 4414 (class 2606 OID 22158)
-- Name: users users_handle_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_handle_unique UNIQUE (handle);


--
-- TOC entry 4416 (class 2606 OID 22160)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4418 (class 2606 OID 22162)
-- Name: users users_session_token_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_session_token_unique UNIQUE (session_token);


--
-- TOC entry 4384 (class 1259 OID 22163)
-- Name: IDX_services_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_services_active" ON public.services USING btree (is_active);


--
-- TOC entry 4385 (class 1259 OID 22164)
-- Name: IDX_services_provider_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_services_provider_id" ON public.services USING btree (provider_id);


--
-- TOC entry 4386 (class 1259 OID 22165)
-- Name: IDX_services_provider_title; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_services_provider_title" ON public.services USING btree (provider_title);


--
-- TOC entry 4387 (class 1259 OID 22166)
-- Name: IDX_services_type_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_services_type_id" ON public.services USING btree (type_id);


--
-- TOC entry 4390 (class 1259 OID 22167)
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- TOC entry 4407 (class 1259 OID 22387)
-- Name: IDX_users_access_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_users_access_role" ON public.users USING btree (access_role);


--
-- TOC entry 4408 (class 1259 OID 22377)
-- Name: IDX_users_account_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_users_account_type" ON public.users USING btree (account_type);


--
-- TOC entry 4409 (class 1259 OID 22170)
-- Name: IDX_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_users_email" ON public.users USING btree (email);


--
-- TOC entry 4410 (class 1259 OID 22171)
-- Name: IDX_users_session_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_users_session_token" ON public.users USING btree (session_token);


--
-- TOC entry 4423 (class 1259 OID 22425)
-- Name: idx_recipe_usage_options_last_generation_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_recipe_usage_options_last_generation_id ON public.recipe_usage_options USING btree (last_generation_id);


-- Completed on 2025-07-14 17:32:38 CDT

--
-- PostgreSQL database dump complete
--

