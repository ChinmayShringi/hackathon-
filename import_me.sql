--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.smart_generation_requests DROP CONSTRAINT IF EXISTS smart_generation_requests_recipe_id_recipes_id_fk;
ALTER TABLE IF EXISTS ONLY public.smart_generation_requests DROP CONSTRAINT IF EXISTS smart_generation_requests_generation_id_generations_id_fk;
ALTER TABLE IF EXISTS ONLY public.smart_generation_requests DROP CONSTRAINT IF EXISTS smart_generation_requests_creator_id_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.services DROP CONSTRAINT IF EXISTS services_type_id_type_services_id_fk;
ALTER TABLE IF EXISTS ONLY public.services DROP CONSTRAINT IF EXISTS services_provider_title_providers_title_fk;
ALTER TABLE IF EXISTS ONLY public.services DROP CONSTRAINT IF EXISTS services_provider_id_providers_id_fk;
ALTER TABLE IF EXISTS ONLY public.sample_likes DROP CONSTRAINT IF EXISTS sample_likes_user_id_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.sample_likes DROP CONSTRAINT IF EXISTS sample_likes_sample_id_recipe_samples_id_fk;
ALTER TABLE IF EXISTS ONLY public.revenue_shares DROP CONSTRAINT IF EXISTS revenue_shares_user_id_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.revenue_shares DROP CONSTRAINT IF EXISTS revenue_shares_recipe_id_recipes_id_fk;
ALTER TABLE IF EXISTS ONLY public.revenue_shares DROP CONSTRAINT IF EXISTS revenue_shares_generation_id_generations_id_fk;
ALTER TABLE IF EXISTS ONLY public.revenue_shares DROP CONSTRAINT IF EXISTS revenue_shares_creator_id_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.recipes DROP CONSTRAINT IF EXISTS recipes_creator_id_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.recipe_samples DROP CONSTRAINT IF EXISTS recipe_samples_user_id_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.recipe_samples DROP CONSTRAINT IF EXISTS recipe_samples_recipe_id_recipes_id_fk;
ALTER TABLE IF EXISTS ONLY public.recipe_samples DROP CONSTRAINT IF EXISTS recipe_samples_generation_id_generations_id_fk;
ALTER TABLE IF EXISTS ONLY public.generations DROP CONSTRAINT IF EXISTS generations_user_id_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.generations DROP CONSTRAINT IF EXISTS generations_recipe_id_recipes_id_fk;
ALTER TABLE IF EXISTS ONLY public.export_transactions DROP CONSTRAINT IF EXISTS export_transactions_sample_id_recipe_samples_id_fk;
ALTER TABLE IF EXISTS ONLY public.export_transactions DROP CONSTRAINT IF EXISTS export_transactions_creator_id_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.export_transactions DROP CONSTRAINT IF EXISTS export_transactions_buyer_id_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.credit_transactions DROP CONSTRAINT IF EXISTS credit_transactions_user_id_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.brand_assets DROP CONSTRAINT IF EXISTS brand_assets_user_id_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.backlog_videos DROP CONSTRAINT IF EXISTS backlog_videos_recipe_id_recipes_id_fk;
ALTER TABLE IF EXISTS ONLY public.backlog_videos DROP CONSTRAINT IF EXISTS backlog_videos_generation_id_generations_id_fk;
DROP INDEX IF EXISTS public.idx_generations_user_pagination;
DROP INDEX IF EXISTS public.idx_generations_status;
DROP INDEX IF EXISTS public.idx_generations_recipe;
DROP INDEX IF EXISTS public.idx_generations_guest_stats;
DROP INDEX IF EXISTS public.idx_generations_guest_pagination;
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
ALTER TABLE IF EXISTS ONLY public.type_services DROP CONSTRAINT IF EXISTS type_services_title_unique;
ALTER TABLE IF EXISTS ONLY public.type_services DROP CONSTRAINT IF EXISTS type_services_pkey;
ALTER TABLE IF EXISTS ONLY public.tags DROP CONSTRAINT IF EXISTS tags_pkey;
ALTER TABLE IF EXISTS ONLY public.tags DROP CONSTRAINT IF EXISTS tags_name_unique;
ALTER TABLE IF EXISTS ONLY public.smart_generation_requests DROP CONSTRAINT IF EXISTS smart_generation_requests_pkey;
ALTER TABLE IF EXISTS ONLY public.sessions DROP CONSTRAINT IF EXISTS sessions_pkey;
ALTER TABLE IF EXISTS ONLY public.services DROP CONSTRAINT IF EXISTS services_pkey;
ALTER TABLE IF EXISTS ONLY public.sample_likes DROP CONSTRAINT IF EXISTS sample_likes_pkey;
ALTER TABLE IF EXISTS ONLY public.revenue_shares DROP CONSTRAINT IF EXISTS revenue_shares_pkey;
ALTER TABLE IF EXISTS ONLY public.recipes DROP CONSTRAINT IF EXISTS recipes_slug_unique;
ALTER TABLE IF EXISTS ONLY public.recipes DROP CONSTRAINT IF EXISTS recipes_referral_code_unique;
ALTER TABLE IF EXISTS ONLY public.recipes DROP CONSTRAINT IF EXISTS recipes_pkey;
ALTER TABLE IF EXISTS ONLY public.recipe_samples DROP CONSTRAINT IF EXISTS recipe_samples_pkey;
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
DROP SEQUENCE IF EXISTS public.type_services_id_seq;
DROP TABLE IF EXISTS public.type_services;
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
DROP SEQUENCE IF EXISTS public.recipe_samples_id_seq;
DROP TABLE IF EXISTS public.recipe_samples;
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
DROP SCHEMA IF EXISTS drizzle;
--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA drizzle;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: -
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


--
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
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: -
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
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
-- Name: backlog_videos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.backlog_videos_id_seq OWNED BY public.backlog_videos.id;


--
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
-- Name: brand_assets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.brand_assets_id_seq OWNED BY public.brand_assets.id;


--
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
-- Name: credit_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.credit_transactions_id_seq OWNED BY public.credit_transactions.id;


--
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
-- Name: export_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.export_transactions_id_seq OWNED BY public.export_transactions.id;


--
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
-- Name: generations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.generations_id_seq OWNED BY public.generations.id;


--
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
-- Name: providers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.providers_id_seq OWNED BY public.providers.id;


--
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
-- Name: recipe_samples_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.recipe_samples_id_seq OWNED BY public.recipe_samples.id;


--
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
    tag_highlights integer[]
);


--
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
-- Name: recipes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.recipes_id_seq OWNED BY public.recipes.id;


--
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
-- Name: revenue_shares_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.revenue_shares_id_seq OWNED BY public.revenue_shares.id;


--
-- Name: sample_likes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sample_likes (
    id integer NOT NULL,
    sample_id integer NOT NULL,
    user_id character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
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
-- Name: sample_likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sample_likes_id_seq OWNED BY public.sample_likes.id;


--
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
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


--
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
-- Name: smart_generation_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.smart_generation_requests_id_seq OWNED BY public.smart_generation_requests.id;


--
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
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- Name: type_services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.type_services (
    id integer NOT NULL,
    title character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
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
-- Name: type_services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.type_services_id_seq OWNED BY public.type_services.id;


--
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
    account_type character varying(20) DEFAULT 'Guest'::character varying NOT NULL,
    access_role character varying(20) DEFAULT 'User'::character varying NOT NULL,
    session_token character varying,
    last_seen_at timestamp without time zone DEFAULT now(),
    password_hash character varying,
    oauth_provider character varying(20),
    is_ephemeral boolean DEFAULT false,
    can_upgrade_to_registered boolean DEFAULT true
);


--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: -
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Name: backlog_videos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backlog_videos ALTER COLUMN id SET DEFAULT nextval('public.backlog_videos_id_seq'::regclass);


--
-- Name: brand_assets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_assets ALTER COLUMN id SET DEFAULT nextval('public.brand_assets_id_seq'::regclass);


--
-- Name: credit_transactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credit_transactions ALTER COLUMN id SET DEFAULT nextval('public.credit_transactions_id_seq'::regclass);


--
-- Name: export_transactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.export_transactions ALTER COLUMN id SET DEFAULT nextval('public.export_transactions_id_seq'::regclass);


--
-- Name: generations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.generations ALTER COLUMN id SET DEFAULT nextval('public.generations_id_seq'::regclass);


--
-- Name: providers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.providers ALTER COLUMN id SET DEFAULT nextval('public.providers_id_seq'::regclass);


--
-- Name: recipe_samples id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_samples ALTER COLUMN id SET DEFAULT nextval('public.recipe_samples_id_seq'::regclass);


--
-- Name: recipes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes ALTER COLUMN id SET DEFAULT nextval('public.recipes_id_seq'::regclass);


--
-- Name: revenue_shares id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.revenue_shares ALTER COLUMN id SET DEFAULT nextval('public.revenue_shares_id_seq'::regclass);


--
-- Name: sample_likes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sample_likes ALTER COLUMN id SET DEFAULT nextval('public.sample_likes_id_seq'::regclass);


--
-- Name: services id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- Name: smart_generation_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.smart_generation_requests ALTER COLUMN id SET DEFAULT nextval('public.smart_generation_requests_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Name: type_services id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type_services ALTER COLUMN id SET DEFAULT nextval('public.type_services_id_seq'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: -
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
\.


--
-- Data for Name: backlog_videos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.backlog_videos (id, recipe_id, recipe_variables, recipe_variables_hash, generation_id, video_url, thumbnail_url, s3_key, asset_id, short_id, secure_url, is_used, used_by_request_id, used_at, metadata, created_at) FROM stdin;
\.


--
-- Data for Name: brand_assets; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.brand_assets (id, user_id, name, file_name, file_url, file_size, mime_type, width, height, tags, is_transparent, created_at, updated_at) FROM stdin;
\.


--
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
\.


--
-- Data for Name: export_transactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.export_transactions (id, sample_id, buyer_id, creator_id, export_format, export_quality, price_credits, creator_earnings, download_url, expires_at, downloaded_at, created_at) FROM stdin;
\.


--
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
\.


--
-- Data for Name: providers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.providers (id, title, description, num_slots, is_active, config, created_at, updated_at) FROM stdin;
1	FAL Standard	features and labels, fal.ai, standard user api account	10	t	{}	2025-07-10 13:25:29.234211	2025-07-10 13:25:29.234211
\.


--
-- Data for Name: recipe_samples; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recipe_samples (id, recipe_id, generation_id, user_id, title, description, original_prompt, thumbnail_url, preview_url, high_res_url, type, file_size, dimensions, download_count, like_count, is_featured, is_moderated, moderation_status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: recipes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recipes (id, name, slug, description, prompt, instructions, category, style, model, credit_cost, usage_count, is_active, created_at, video_provider, video_duration, video_quality, video_aspect_ratio, image_provider, image_quality, image_size, num_images, creator_id, is_public, has_content_restrictions, revenue_share_enabled, revenue_share_percentage, recipe_steps, generation_type, referral_code, preview_image_url, workflow_type, workflow_components, tag_highlights) FROM stdin;
2	Social Media Illusion	social-media-illusion	Trompe-l'œil effect with subject stepping out of phone screen	A trompe-l'œil illusion of a [PERSON] in [CLOTHING] appearing to step out of a giant smartphone displaying a social media interface ([SOCIAL_APP]). The screen shows a username '@[USERNAME]', 1K likes, and 12–20 comments, with floating emojis (heart eyes, smiley faces). Background of your choice.	Creates viral-worthy social media content with eye-catching 3D illusion effects. Customize the person, clothing, social app, and username to match your brand or personal style. Great for Instagram, TikTok, and Facebook posts.	Social Media	illusion	flux-1	7	0	t	2025-06-14 02:49:09.278171	\N	10	hd	16:9	\N	hd	landscape_4_3	1	\N	f	t	f	20	[{"id": "1", "type": "text_prompt", "config": {"prompt": "A trompe-l'œil illusion of a [PERSON] in [CLOTHING] appearing to step out of a giant smartphone displaying a social media interface ([SOCIAL_APP]). The screen shows a username '@[USERNAME]', 1K likes, and 12–20 comments, with floating emojis (heart eyes, smiley faces). Background of your choice."}}]	image	\N	\N	image	\N	\N
3	Product Showcase	product-showcase	Professional product photography with studio lighting	Professional product photography of [PRODUCT] with studio lighting setup. Clean white background, multiple light sources creating soft shadows, high-end commercial photography style. The product is positioned at the optimal angle showing its key features.	Ideal for e-commerce listings, catalogs, and marketing materials. Replace [PRODUCT] with your specific item and describe any special features or angles you want highlighted. Produces commercial-quality results.	Marketing	commercial	flux-1-pro	6	0	t	2025-06-14 02:49:09.355346	\N	10	hd	16:9	\N	hd	landscape_4_3	1	\N	f	t	f	20	[{"id": "1", "type": "text_prompt", "config": {"prompt": "Professional product photography of [PRODUCT] with studio lighting setup. Clean white background, multiple light sources creating soft shadows, high-end commercial photography style. The product is positioned at the optimal angle showing its key features."}}]	image	\N	\N	image	\N	\N
4	Logo Text Overlay	logo-text-overlay	Add professional text overlays and branding elements	Add professional text overlay '[TEXT]' to the image with modern typography. The text should be well-integrated with appropriate contrast and positioning. Include subtle branding elements and maintain visual hierarchy.	Enhance any image with professional text overlays. Replace [TEXT] with your specific message, brand name, or call-to-action. Perfect for social media posts, advertisements, and branded content.	Marketing	typography	flux-1	2	0	t	2025-06-14 02:49:09.431362	\N	10	hd	16:9	\N	hd	landscape_4_3	1	\N	f	t	f	20	[{"id": "1", "type": "text_prompt", "config": {"prompt": "Add professional text overlay '[TEXT]' to the image with modern typography. The text should be well-integrated with appropriate contrast and positioning. Include subtle branding elements and maintain visual hierarchy."}}]	image	\N	\N	image	\N	\N
5	Abstract Art Generator	abstract-art-generator	Generate flowing abstract compositions with color harmony	Abstract art composition with flowing organic shapes in [COLOR_PALETTE] color palette. The design should have smooth gradients, dynamic movement, and balanced composition. Style: modern, minimalist, with subtle texture details.	Create unique abstract artwork for galleries, prints, or digital displays. Specify your preferred color palette (e.g., warm tones, cool blues, monochrome) for personalized results. Great for interior design and artistic projects.	Digital Art	abstract	flux-1	4	0	t	2025-06-14 02:49:09.507249	\N	10	hd	16:9	\N	hd	landscape_4_3	1	\N	f	t	f	20	[{"id": "1", "type": "text_prompt", "config": {"prompt": "Abstract art composition with flowing organic shapes in [COLOR_PALETTE] color palette. The design should have smooth gradients, dynamic movement, and balanced composition. Style: modern, minimalist, with subtle texture details."}}]	image	\N	\N	image	\N	\N
6	Cyberpunk Portrait	cyberpunk-portrait	Cyberpunk-style portraits with neon and digital effects	Cyberpunk portrait of [SUBJECT] with neon lighting, digital glitch effects, and futuristic elements. Dark urban background with pink and blue neon lights. High contrast, dramatic lighting, detailed digital art style.	Transform any subject into a stunning cyberpunk character. Describe the subject (person, character, or object) to customize the portrait. Perfect for gaming avatars, artistic projects, and futuristic design concepts.	Digital Art	cyberpunk	flux-1-pro	6	0	t	2025-06-14 02:49:09.583291	\N	10	hd	16:9	\N	hd	landscape_4_3	1	\N	f	t	f	20	[{"id": "1", "type": "text_prompt", "config": {"prompt": "Cyberpunk portrait of [SUBJECT] with neon lighting, digital glitch effects, and futuristic elements. Dark urban background with pink and blue neon lights. High contrast, dramatic lighting, detailed digital art style."}}]	image	\N	\N	image	\N	\N
8	Morph Between Videos	morph-between-videos	Seamlessly transition between two different video clips or images	Create a 5-second morphing transition from [SOURCE_VIDEO/IMAGE] to [TARGET_VIDEO/IMAGE]. The transformation should be smooth and visually appealing, with intermediate frames that blend the two sources naturally. Maintain consistent lighting and perspective throughout the morph.	Great for before/after transformations, product variations, or creative transitions. Upload source and target content, specify transition style. Works with both videos and images.	Video Transition	morph	veo3-fast	12	0	t	2025-06-14 14:01:01.536035	\N	5	hd	16:9	\N	hd	landscape_4_3	1	\N	f	t	f	20	[{"id": "1", "type": "text_prompt", "config": {"prompt": "Create a 5-second morphing transition from [SOURCE_VIDEO/IMAGE] to [TARGET_VIDEO/IMAGE]. The transformation should be smooth and visually appealing, with intermediate frames that blend the two sources naturally. Maintain consistent lighting and perspective throughout the morph."}}]	video	\N	\N	video	[{"type": "text_to_video", "model": "veo3-fast", "serviceId": 2}]	\N
7	Character Idle Animation	character-idle-animation	Create subtle breathing and movement animations for character portraits	Generate a 2-second looping idle animation of [CHARACTER]. The character should have subtle breathing movement, gentle eye blinks, and slight head movements. The animation should be smooth and natural, perfect for avatars, game characters, or digital portraits. Background remains static while only the character moves.	Perfect for gaming avatars, digital characters, and interactive portraits. Specify character details and desired subtle movements. Best used for profile pictures and character showcases.	Video Animation	character	veo3-fast	8	0	t	2025-06-14 14:01:01.536035	\N	2	hd	16:9	\N	hd	landscape_4_3	1	\N	f	t	f	20	[{"id": "1", "type": "text_prompt", "config": {"prompt": "Generate a 2-second looping idle animation of [CHARACTER]. The character should have subtle breathing movement, gentle eye blinks, and slight head movements. The animation should be smooth and natural, perfect for avatars, game characters, or digital portraits. Background remains static while only the character moves."}}]	video	\N	\N	video	[{"type": "text_to_video", "model": "veo3-fast", "serviceId": 2}]	\N
9	Animate Video	animate-static-image	Bring static images to life with natural movement and dynamics	Animate this static image: [IMAGE_DESCRIPTION]. Add realistic movement such as [MOVEMENT_TYPE] over 10 seconds. The animation should feel natural and enhance the original image without distorting key elements. Maintain image quality while adding compelling motion.	Transform static artwork, photos, or illustrations into dynamic videos. Specify movement type like flowing water, swaying trees, floating objects, or camera movements. Perfect for social media and presentations.	Video Animation	animation	veo3-fast	15	0	t	2025-06-14 14:01:01.536035	\N	10	hd	16:9	\N	hd	landscape_4_3	1	\N	f	t	f	20	[{"id": "1", "type": "text_prompt", "config": {"prompt": "Animate this static image: [IMAGE_DESCRIPTION]. Add realistic movement such as [MOVEMENT_TYPE] over 10 seconds. The animation should feel natural and enhance the original image without distorting key elements. Maintain image quality while adding compelling motion."}}]	video	\N	\N	video	[{"type": "text_to_video", "model": "veo3-fast", "serviceId": 2}]	\N
10	Zoom In	cinematic-zoom-in	Create dramatic zoom-in effects with professional camera movement	Generate a 2-second cinematic zoom-in shot starting from [WIDE_SHOT_DESCRIPTION] and smoothly zooming into [CLOSE_UP_TARGET]. The movement should be steady and professional, with slight easing at the beginning and end. Maintain focus and clarity throughout the zoom.	Perfect for dramatic reveals, product showcases, or emphasis shots. Specify starting composition and zoom target. Great for marketing videos and storytelling.	Video Camera Movement	cinematic	veo3-fast	6	0	t	2025-06-14 14:01:01.536035	\N	2	hd	16:9	\N	hd	landscape_4_3	1	\N	f	t	f	20	[{"id": "1", "type": "text_prompt", "config": {"prompt": "Generate a 2-second cinematic zoom-in shot starting from [WIDE_SHOT_DESCRIPTION] and smoothly zooming into [CLOSE_UP_TARGET]. The movement should be steady and professional, with slight easing at the beginning and end. Maintain focus and clarity throughout the zoom."}}]	video	\N	\N	video	[{"type": "text_to_video", "model": "veo3-fast", "serviceId": 2}]	\N
11	Product Rotation 360°	product-rotation-360	Smooth 360-degree product rotation for e-commerce and showcases	Create a 6-second smooth 360-degree rotation of [PRODUCT] on a clean background. The product should rotate at a consistent speed with professional lighting that highlights all angles. Background should be neutral and the product should remain in perfect focus throughout.	Essential for e-commerce, product launches, and portfolio presentations. Specify product details and preferred background. Creates professional product showcase videos.	Video Product	rotation	veo3-fast	10	0	t	2025-06-14 14:01:01.536035	\N	6	hd	16:9	\N	hd	landscape_4_3	1	\N	f	t	f	20	[{"id": "1", "type": "text_prompt", "config": {"prompt": "Create a 6-second smooth 360-degree rotation of [PRODUCT] on a clean background. The product should rotate at a consistent speed with professional lighting that highlights all angles. Background should be neutral and the product should remain in perfect focus throughout."}}]	video	\N	\N	video	[{"type": "text_to_video", "model": "veo3-fast", "serviceId": 2}]	\N
12	Text Reveal Animation	text-reveal-animation	Dynamic text animations with engaging reveal effects	Create a 3-second text reveal animation for '[TEXT_CONTENT]'. The text should appear with [ANIMATION_STYLE] effect against [BACKGROUND_DESCRIPTION]. Typography should be bold and readable, with smooth timing and professional presentation.	Perfect for titles, quotes, announcements, and social media content. Specify text content, animation style (typewriter, fade, slide, etc.), and background preferences.	Video Text	typography	veo3-fast	7	0	t	2025-06-14 14:01:01.536035	\N	3	hd	16:9	\N	hd	landscape_4_3	1	\N	f	t	f	20	[{"id": "1", "type": "text_prompt", "config": {"prompt": "Create a 3-second text reveal animation for '[TEXT_CONTENT]'. The text should appear with [ANIMATION_STYLE] effect against [BACKGROUND_DESCRIPTION]. Typography should be bold and readable, with smooth timing and professional presentation."}}]	video	\N	\N	video	[{"type": "text_to_video", "model": "veo3-fast", "serviceId": 2}]	\N
13	Parallax Scroll Effect	parallax-scroll-effect	Create depth with layered parallax scrolling animations	Generate a 8-second parallax scrolling effect with [SCENE_DESCRIPTION]. Different layers should move at varying speeds to create depth - foreground elements move faster, background elements slower. The effect should be smooth and immersive.	Great for website headers, storytelling, and immersive experiences. Describe scene layers and scrolling direction. Creates engaging depth and movement.	Video Effect	parallax	veo3-fast	12	0	t	2025-06-14 14:01:01.536035	\N	8	hd	16:9	\N	hd	landscape_4_3	1	\N	f	t	f	20	[{"id": "1", "type": "text_prompt", "config": {"prompt": "Generate a 8-second parallax scrolling effect with [SCENE_DESCRIPTION]. Different layers should move at varying speeds to create depth - foreground elements move faster, background elements slower. The effect should be smooth and immersive."}}]	video	\N	\N	video	[{"type": "text_to_video", "model": "veo3-fast", "serviceId": 2}]	\N
14	Cinemagraph Loop	cinemagraph-loop	Create mesmerizing cinemagraphs with selective motion	Generate a 4-second seamless cinemagraph where [MOVING_ELEMENT] moves continuously while everything else remains perfectly still. The loop should be invisible and hypnotic, focusing attention on the single moving element against a static scene.	Perfect for social media, web backgrounds, and artistic presentations. Specify which element should move (water, hair, smoke, etc.) while keeping the rest frozen in time.	Video Cinemagraph	loop	veo3-fast	9	0	t	2025-06-14 14:01:01.536035	\N	4	hd	16:9	\N	hd	landscape_4_3	1	\N	f	t	f	20	[{"id": "1", "type": "text_prompt", "config": {"prompt": "Generate a 4-second seamless cinemagraph where [MOVING_ELEMENT] moves continuously while everything else remains perfectly still. The loop should be invisible and hypnotic, focusing attention on the single moving element against a static scene."}}]	video	\N	\N	video	[{"type": "text_to_video", "model": "veo3-fast", "serviceId": 2}]	\N
1	Futuristic AI Anatomy	futuristic-ai-anatomy	Create glowing anatomical illustrations with digital highlight effects	A digital illustration of a [GENDER] [AGE] human body, outlined with glowing blue lines that trace its anatomy. Set against a dark background, the contrast highlights the form and features. Emphasize the [BODY_PART] with a red glow to indicate importance or interest. The style is sleek, educational, and visually striking—like advanced imaging technology. [DETAILS]	Perfect for medical illustrations, educational content, and futuristic design projects. Customize the subject and highlighted body parts for your specific needs. Works well with anatomical terms and scientific visualization.	Digital Art	futuristic	gpt-image-1	6	14	t	2025-06-14 02:49:09.192378	\N	10	hd	16:9	\N	hd	landscape_4_3	1	\N	f	t	f	20	[{"id": "gender", "type": "radio", "label": "Gender", "options": [{"label": "Female", "value": "female"}, {"label": "Male", "value": "male"}], "required": true, "defaultValue": "female"}, {"id": "age", "type": "radio", "label": "Age Group", "options": [{"label": "Child", "value": "child"}, {"label": "Teenager", "value": "teenager"}, {"label": "Adult", "value": "adult"}, {"label": "Elderly", "value": "elderly"}], "required": true, "defaultValue": "adult"}, {"id": "bodyPart", "type": "dropdown", "label": "Body Part to Highlight", "options": [{"label": "Brain", "value": "brain"}, {"label": "Heart", "value": "heart"}, {"label": "Lungs", "value": "lungs"}, {"label": "Stomach", "value": "stomach"}, {"label": "Intestines", "value": "intestines"}], "required": true, "defaultValue": "heart"}, {"id": "details", "type": "radio", "label": "Detail Level", "options": [{"label": "External outlines", "value": "external"}, {"label": "Internal details - other organs & skeleton", "value": "internal"}], "required": true, "defaultValue": "external"}, {"id": "orientation", "type": "radio", "label": "Image Orientation", "options": [{"label": "Portrait", "value": "portrait"}, {"label": "Landscape", "value": "landscape"}, {"label": "Square", "value": "square"}], "required": true, "defaultValue": "portrait"}]	video	\N	\N	text_to_video	"[{\\"type\\":\\"text_to_video\\",\\"model\\":\\"veo3-fast\\",\\"endpoint\\":\\"fal-ai/veo3/fast\\",\\"serviceId\\":2}]"	\N
15	Cats in Video Games	cats-in-video-games	Generate adorable cats in various video game worlds and styles	A highly detailed video game screenshot showing [CAT_COUNT] [CAT_COLORS] cat characters in a [GAME_GENRE] game world. The setting features [SETTING_DESCRIPTION], and the cats are [ACTION_DESCRIPTION]. The image has a [CAMERA_STYLE] perspective with vibrant game-like lighting and textures. The art style should match the specified game genre with appropriate visual effects and atmosphere.	Create charming feline characters in any video game style. Customize the number of cats, their colors and patterns, the game world environment, and camera perspective. Perfect for game concept art, character design, and whimsical digital illustrations.	Gaming Art	video-game	flux-1	8	0	t	2025-06-16 23:32:00.092219	\N	10	hd	16:9	\N	hd	landscape_4_3	1	\N	f	t	f	20	[{"id": "catCount", "type": "dropdown", "label": "Number of Cats", "options": [{"label": "One Cat", "value": "one"}, {"label": "Two Cats", "value": "two"}, {"label": "Three Cats", "value": "three"}, {"label": "Many Cats", "value": "many"}], "required": true, "defaultValue": "one"}, {"id": "catColors", "type": "text", "label": "Cat Colors & Patterns", "required": true, "placeholder": "e.g., orange tabby, black, white, calico, siamese...", "defaultValue": "orange tabby"}, {"id": "gameGenre", "type": "text", "label": "Game Genre", "required": true, "placeholder": "e.g., platformer, RPG, retro pixel art, open-world adventure...", "defaultValue": ""}, {"id": "settingDescription", "type": "text", "label": "Setting & Environment", "required": false, "placeholder": "Describe the game world: floating islands, neon cyberpunk city, medieval castle...", "defaultValue": ""}, {"id": "actionDescription", "type": "text", "label": "Cat Action", "required": true, "placeholder": "e.g., jumping across platforms, casting spells, racing through loops...", "defaultValue": ""}, {"id": "cameraStyle", "type": "dropdown", "label": "Camera Style", "options": [{"label": "Auto (Based on Genre)", "value": "auto"}, {"label": "Side Scroller", "value": "side-scroller"}, {"label": "Top-Down View", "value": "top-down"}, {"label": "First Person", "value": "first-person"}, {"label": "3D Third Person", "value": "third-person"}, {"label": "Isometric", "value": "isometric"}], "required": true, "defaultValue": "auto"}, {"id": "orientation", "type": "radio", "label": "Image Orientation", "options": [{"label": "Portrait", "value": "portrait"}, {"label": "Landscape", "value": "landscape"}, {"label": "Square", "value": "square"}], "required": true, "defaultValue": "portrait"}]	video	\N	\N	text_to_video	"[{\\"type\\":\\"text_to_video\\",\\"model\\":\\"veo3-fast\\",\\"endpoint\\":\\"fal-ai/veo3/fast\\",\\"serviceId\\":2}]"	\N
17	Lava Food ASMR	lava-food-asmr	Create bizarre, surreal, or funny scenes of people treating molten lava like everyday foods!	{\n  "shot": {\n    "composition": "close shot, handheld camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "slight natural shake",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "{{age}} year old {{gender}}",\n    "wardrobe": "a random outfit appropriate for the setting"\n  },\n  "scene": {\n    "location": "{{venue}}",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem surreally hot, invoking the idea that the subject is eating food made of lava"\n  },\n  "visual_details": {\n    "action": "{{action_description}}",\n    "props": "{{props_description}}"\n  },\n  "cinematography": {\n    "lighting": "indoors warm lighting with vibrant, flickering shadows",\n    "tone": "lighthearted and surreal"\n  },\n  "audio": {\n    "ambient": "{{ambient_sounds}}",\n    "asmr": "{{asmr_sound_style}}"\n  },\n  "special_effects": "the food is actually made of lava/magma that drips, burns, and oozes across surfaces",\n  "color_palette": "the lava should be bright yellow and orange, glowing with heat and bright light, reflected on skin",\n  "additional_details": {\n    "speed of action": "slowly taking bites",\n    "lava food interaction": "start with nothing in mouth, use utensils and take a bite, should create trails of lava when eating"\n  }\n}	Create bizarre, funny scenes of people treating molten lava like an everyday snack with customizable characters, food items, expressions, venues, and ASMR sound styles using structured JSON prompting.	Surreal Comedy	surreal	flux-1	1	0	t	2025-06-24 18:43:05.73696	\N	8	hd	9:16	\N	hd	landscape_4_3	1	\N	t	t	f	20	[{"id": "gender", "type": "radio", "label": "Gender", "options": [{"label": "Male", "value": "male"}, {"label": "Female", "value": "female"}], "required": true, "defaultValue": "female"}, {"id": "age", "type": "slider", "label": "Age", "config": {"max": 100, "min": 18, "step": 1, "showValue": true}, "required": true, "defaultValue": "30"}, {"id": "lavaFoodItem", "type": "dropdown", "label": "Lava Food Item", "options": [{"label": "Lava Pizza", "value": "lava pizza"}, {"label": "Lava Spoonful of Honey", "value": "lava spoonful of honey"}, {"label": "Lava Chocolate Cake", "value": "lava chocolate cake"}, {"label": "Lava Plate of Food", "value": "lava plate of food"}], "required": true, "defaultValue": "lava pizza"}, {"id": "eatingExpression", "type": "emoji_button", "label": "Eating Expression", "options": [{"emoji": "😀", "label": "Joyful", "value": "joyful", "subtitle": "Joyful"}, {"emoji": "😎", "label": "Totally Cool", "value": "totally_cool", "subtitle": "Totally Cool"}, {"emoji": "🧐", "label": "Sophisticated Enjoyment", "value": "sophisticated_enjoyment", "subtitle": "Sophisticated"}, {"emoji": "😍", "label": "Absolutely Loving It", "value": "absolutely_loving_it", "subtitle": "Loving It"}, {"emoji": "🤭", "label": "Bored", "value": "bored", "subtitle": "Bored"}, {"emoji": "🥴", "label": "Confused... but OK?", "value": "confused_but_ok", "subtitle": "Confused"}], "required": true, "defaultValue": "joyful"}, {"id": "venue", "type": "dropdown", "label": "Venue", "options": [{"label": "Home Kitchen", "value": "home kitchen"}, {"label": "Japanese Hibachi", "value": "japanese hibachi"}, {"label": "Sports Grill", "value": "sports grill"}, {"label": "Science Lab Table", "value": "science lab table"}, {"label": "Office Cubicle", "value": "office cubicle"}, {"label": "TV Tray Dinner on Couch", "value": "tv tray dinner on couch"}], "required": true, "defaultValue": "home kitchen"}, {"id": "asmrSoundStyle", "type": "dropdown", "label": "ASMR Sound Style", "options": [{"label": "Crunchy", "value": "crunchy"}, {"label": "Oozing", "value": "oozing"}, {"label": "Dripping", "value": "dripping"}, {"label": "Bubbling", "value": "bubbling"}], "required": true, "defaultValue": "crunchy"}]	video	\N	/guest-pizza-preview-img.png	text_to_video	[{"type": "text_to_video", "model": "veo3-fast", "endpoint": "fal-ai/veo3/fast", "serviceId": 2}]	{1,2,3,11}
18	BASEd Ape Vlog	based-ape-vlog	Create a BASE-jumping Ape recording his Vlog & dropping social commentary as he parachutes over all sorts of terrain.	{\n  "shot": {\n    "composition": "medium shot, vertical format, handheld camera, photo-realistic",\n    "camera_motion": "shaky handcam",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "a towering, photorealistic gorilla (inspired by the Bored Apes Yacht Club) with well groomed fur and expressive eyes",\n    "wardrobe": "{{wardrobe_description}}"\n  },\n  "scene": {\n    "location": "{{location_description}}",\n    "time_of_day": "daytime outdoors",\n    "environment": "{{environment_description}}"\n  },\n  "visual_details": {\n    "action": "{{action_description}}",\n    "props": "{{props_description}}"\n  },\n  "cinematography": {\n    "lighting": "natural sunlight with soft shadows",\n    "tone": "lighthearted and humorous"\n  },\n  "audio": {\n    "ambient": "{{ambient_sounds}}",\n    "dialogue": {\n      "character": "Gorilla",\n      "subtitles": false\n    },\n    "effects": "{{audio_effects}}"\n  },\n  "color_palette": "naturalistic with earthy greens and browns, whites and blues for snow",\n  "additional_details": {\n    "action": "{{additional_action_description}}",\n    "parachute_type": "large glider-style parachute",\n    "attitude": "gorilla is an apathetic thrill-seeker, effortlessly cool, low-key reckless, YOLO"\n  }\n}	Create a BASEd ape vlog with epic settings, fashion choices, and YOLO topics. The gorilla should be photorealistic and have an apathetic thrill-seeker attitude. The topic is now integrated into the action description.	Social Media Comedy	modern-lifestyle	flux-1	1	0	t	2025-06-24 18:43:05.73696	\N	8	hd	9:16	\N	hd	landscape_4_3	1	\N	t	t	f	20	[{"id": "fashionStyle", "type": "dropdown", "label": "Fashion Style", "options": [{"label": "Tracksuit", "value": "tracksuit"}, {"label": "Neon Fur Coat", "value": "neon_fur_coat"}, {"label": "Casual Streetwear", "value": "casual_streetwear"}, {"label": "Blazer & Gold Chains", "value": "blazer_gold_chains"}, {"label": "Formal w/ Black Tie", "value": "formal_black_tie"}, {"label": "Safari", "value": "safari"}, {"label": "Retro 80s", "value": "retro_80s"}, {"label": "Rustic", "value": "rustic"}], "required": true, "defaultValue": "tracksuit"}, {"id": "epicSetting", "type": "dropdown", "label": "Epic Setting", "options": [{"label": "Mountain Peaks", "value": "mountain_peaks"}, {"label": "Canyon", "value": "canyon"}, {"label": "Urban Skyline", "value": "urban_skyline"}, {"label": "Small Airplane", "value": "small_airplane"}], "required": true, "defaultValue": "mountain_peaks"}, {"id": "propInHand", "type": "dropdown", "label": "Prop in Hand", "options": [{"label": "None", "value": "none"}, {"label": "Cellphone", "value": "cellphone"}, {"label": "Selfie Stick", "value": "selfie_stick"}, {"label": "Microphone", "value": "microphone"}], "required": true, "defaultValue": "none"}, {"id": "vloggingTopic", "type": "emoji_button", "label": "Vlogging Topic", "options": [{"emoji": "😎", "label": "Living a BASEd life", "value": "based_life", "subtitle": "Living a BASEd life"}, {"emoji": "🪂", "label": "Being extreme / YOLO", "value": "extreme_yolo", "subtitle": "Being extreme / YOLO"}, {"emoji": "🏕️", "label": "Survival tips", "value": "survival_tips", "subtitle": "Survival tips"}, {"emoji": "📢", "label": "Boujee Bragging", "value": "boujee_bragging", "subtitle": "Boujee Bragging"}, {"emoji": "🪙", "label": "Crypto Riches", "value": "crypto_riches", "subtitle": "Crypto Riches"}, {"emoji": "🤑", "label": "Burning Daddy's Money", "value": "burning_daddys_money", "subtitle": "Burning Daddy's Money"}], "required": true, "defaultValue": "based_life"}]	video	\N	/guest-boredape-preview-img.png	text_to_video	"[{\\"type\\":\\"text_to_video\\",\\"model\\":\\"veo3-fast\\",\\"endpoint\\":\\"fal-ai/veo3/fast\\",\\"serviceId\\":2}]"	{4,5,6}
16	Cat Olympic Diving	cat-olympic-diving	Create thrilling or hilarious Olympic diving events featuring cats of every kind!	{\n  "shot": {\n    "composition": "medium shot, professional dolly cable rigged camera",\n    "aspect_ratio": "9:16",\n    "camera_motion": "smooth tracking",\n    "frame_rate": "30fps",\n    "film_grain": "none"\n  },\n  "subject": {\n    "description": "{{cat_description}}",\n    "wardrobe": "a random athletic swimming suit appropriate to the character and setting"\n  },\n  "scene": {\n    "location": "Packed Olympic Stadium surrounds the pool. The stadium has an open ceiling so the sky is visible above the pool. Every seat in the stadium is filled, the lights are bright and there are camera flashes in the background.",\n    "time_of_day": "daytime but indoors",\n    "environment": "the environment should seem like an excited stadium, invoking the idea that the subject is an animal attempting to perform olympic feats in diving"\n  },\n  "visual_details": {\n    "action": "{{action_description}}",\n    "props": "olympic swimming pool, diving board"\n  },\n  "cinematography": {\n    "lighting": "indoors bright natural lighting with soft shadows",\n    "tone": "focused"\n  },\n  "audio": {\n    "ambient": "{{ambient_sounds}}"\n  },\n  "special_effects": "{{special_effects_description}}",\n  "color_palette": "grays and blues for the stadium and water, and colorful for the audience",\n  "additional_details": {\n    "water interaction": "the subject should enter the water and not come out, end once the water entry animation is complete"\n  }\n}	Create hilarious videos of cats performing Olympic diving feats. Choose the cat breed, age, weight, diving style, attitude, water entry style, and sound ambiance to create your perfect diving moment.	Sports & Entertainment	athletic	flux-1	1	0	t	2025-06-24 18:43:05.73696	\N	8	hd	9:16	\N	hd	landscape_4_3	1	\N	t	t	f	20	[{"id": "breed", "type": "dropdown", "label": "Cat Breed", "options": [{"label": "Maine Coon", "value": "maine coon"}, {"label": "Siamese", "value": "siamese"}, {"label": "Black American Shorthair", "value": "black american shorthair"}, {"label": "Orange Tabby", "value": "orange tabby"}, {"label": "Calico", "value": "calico"}, {"label": "Bengal", "value": "bengal"}, {"label": "Russian Blue", "value": "russian blue"}], "required": true, "defaultValue": "black american shorthair"}, {"id": "age", "type": "slider", "label": "Age", "config": {"max": 2, "min": 0, "step": 1, "ticks": [{"label": "Kitten", "value": 0}, {"label": "Adult Cat", "value": 1}, {"label": "Senior Citizen Cat", "value": 2}], "showValue": true}, "required": true, "defaultValue": "1"}, {"id": "weight", "type": "slider", "label": "Weight", "config": {"max": 3, "min": 0, "step": 1, "ticks": [{"label": "Athletic Build", "value": 0}, {"label": "Average Weight", "value": 1}, {"label": "Overweight", "value": 2}, {"label": "Obese", "value": 3}], "showValue": true}, "required": true, "defaultValue": "0"}, {"id": "divingStyle", "type": "dropdown", "label": "Diving Style", "options": [{"label": "Backflip", "value": "backflip"}, {"label": "Forward Somersault", "value": "forward somersault"}, {"label": "Twisting Dive", "value": "twisting dive"}, {"label": "Forward Dive", "value": "forward dive"}], "required": true, "defaultValue": "backflip"}, {"id": "attitude", "type": "dropdown", "label": "Attitude", "options": [{"label": "Professional Sports Athlete", "value": "professional sports athlete"}, {"label": "Clumsy Amateur", "value": "clumsy amateur"}, {"label": "Sophisticated & Poised", "value": "sophisticated and poised"}], "required": true, "defaultValue": "clumsy amateur"}, {"id": "waterEntryStyle", "type": "emoji_button", "label": "Water Entry Style", "options": [{"emoji": "💯", "label": "Neat Dive", "value": "neat dive", "subtitle": "Clean entry"}, {"emoji": "🌊", "label": "Cannonball splash", "value": "cannonball splash", "subtitle": "Big splash"}, {"emoji": "💥", "label": "Meteoric", "value": "meteoric", "subtitle": "Explosive entry"}], "required": true, "defaultValue": "cannonball splash"}, {"id": "soundStyle", "type": "dropdown", "label": "Sound Style", "options": [{"label": "Stadium cheering ambiance", "value": "stadium cheering"}, {"label": "Hushed stadium", "value": "hushed stadium"}], "required": true, "defaultValue": "stadium cheering"}]	video	\N	/guest-olympics-preview-img.png	text_to_video	[{"type": "text_to_video", "model": "veo3-fast", "endpoint": "fal-ai/veo3/fast", "serviceId": 2}]	{8,9,6}
\.


--
-- Data for Name: revenue_shares; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.revenue_shares (id, recipe_id, creator_id, user_id, generation_id, credits_used, revenue_amount, share_percentage, creator_earnings, is_paid_credits, created_at) FROM stdin;
\.


--
-- Data for Name: sample_likes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sample_likes (id, sample_id, user_id, created_at) FROM stdin;
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.services (id, provider_id, provider_title, type_id, title, description, endpoint, config, is_active, created_at, updated_at, base_cost) FROM stdin;
1	1	\N	1	FLUX.1 [schnell]	12 billion parameter flow transformer that generates high-quality images from text in 1 to 4 steps, suitable for personal and commercial use.	fal-ai/flux/schnell	{}	t	2025-07-10 14:42:21.920347	2025-07-10 14:48:50.613	0.0030000000000000
2	1	\N	2	Veo 3 Fast	Faster and more cost effective version of Google's Veo 3	fal-ai/veo3/fast	{}	t	2025-07-10 15:37:53.617866	2025-07-10 15:37:53.617866	3.2000000000000002
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (sid, sess, expire) FROM stdin;
mfgYNtVizyXCQjQrs2HxvmIRsTvk1YJL	{"cookie": {"path": "/", "secure": true, "expires": "2025-06-21T02:05:20.569Z", "httpOnly": true, "originalMaxAge": 604800000}, "replit.com": {"code_verifier": "2lHGGJf0v2kkPbNQN7e-Sq5Fas3SScgBA9YdxQ1ewXE"}}	2025-06-21 02:05:21
fQrzop-Qxx1fYywjXzdeI9_ttABcLGc4	{"cookie": {"path": "/", "secure": true, "expires": "2025-06-21T12:57:52.393Z", "httpOnly": true, "originalMaxAge": 604800000}, "walletNonce": {"nonce": "151415", "address": "0x1234567890123456789012345678901234567890", "timestamp": 1749905872392}}	2025-06-21 12:57:53
GzsdQc0lltBj7qoHFPWjYvnnt0YE6JHC	{"cookie": {"path": "/", "secure": true, "expires": "2025-06-22T11:12:51.641Z", "httpOnly": true, "originalMaxAge": 604800000}, "passport": {"user": {"claims": {"aud": "6a2f4fe9-aefd-4e53-9c42-dc84db18f876", "exp": 1749989571, "iat": 1749985971, "iss": "https://replit.com/oidc", "sub": "38298645", "email": "tcotten@scryptedinc.com", "at_hash": "T_t0W7W_hntd8L-fZDRhGQ", "username": "tcotten", "auth_time": 1749921921, "last_name": null, "first_name": null}, "expires_at": 1749989571, "access_token": "5kpSv60u1zMeiZzD12MWJfNeWy7mZsad_yzRrqHwHwa", "refresh_token": "ATrbtNCRjPL0jHXypBPfSpQG3akoMuQxuO9yWAo6UCu"}}, "replit.com": {"code_verifier": "e6vIm-IJR4ENxA5w1NlRkhYbTPmUkdCx_x81CnmeJWQ"}}	2025-06-22 11:51:13
\.


--
-- Data for Name: smart_generation_requests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.smart_generation_requests (id, creator_id, recipe_id, recipe_variables, recipe_variables_hash, status, generation_id, backlog_video_id, credits_cost, failure_reason, error_details, created_at, updated_at) FROM stdin;
\.


--
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
-- Data for Name: type_services; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.type_services (id, title, created_at) FROM stdin;
1	Text-to-Image	2025-07-10 13:59:25.180692
2	Text-to-Video	2025-07-10 13:59:31.735088
3	Image-to-Video	2025-07-10 13:59:35.919781
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, first_name, last_name, profile_image_url, credits, created_at, updated_at, handle, account_type, access_role, session_token, last_seen_at, password_hash, oauth_provider, is_ephemeral, can_upgrade_to_registered) FROM stdin;
guest_dvM9RkP1_GB3	\N	\N	\N	\N	10	2025-07-10 02:43:10.045	2025-07-10 02:43:10.080491	\N	Guest	User	C-25NisiNJgXPccDxcN-LCxIELy_zOtO	2025-07-10 02:43:10.045	\N	\N	t	t
guest_nvH2O9f8Ls7t	\N	\N	\N	\N	10	2025-07-10 03:08:03.551	2025-07-10 03:08:03.803158	\N	Guest	User	z_rlrisLDfoCtNAWkQ8thLtzCv19mhxH	2025-07-10 03:08:03.551	\N	\N	t	t
guest_VexOcNDj7hT5	\N	\N	\N	\N	10	2025-07-10 03:08:03.59	2025-07-10 03:08:03.804642	\N	Guest	User	Iz9Vvhw-APHkpur_mLs6RvSEsvx_voRh	2025-07-10 03:08:03.59	\N	\N	t	t
guest_uhyZiCOM5kh0	\N	\N	\N	\N	10	2025-07-10 03:08:03.565	2025-07-10 03:08:03.805079	\N	Guest	User	CT4d4ifgunNSc9268z7RB0l3uBjl4SqX	2025-07-10 03:08:03.565	\N	\N	t	t
guest_weO8oLBAGKap	\N	\N	\N	\N	10	2025-07-10 03:08:03.618	2025-07-10 03:08:04.926859	\N	Guest	User	kubduw5GHwd0a9Tsgz_J0rDqVbZ6zbhc	2025-07-10 03:08:03.618	\N	\N	t	t
guest_I5SJBmtq2I67	\N	\N	\N	\N	10	2025-07-10 03:08:03.711	2025-07-10 03:08:04.92818	\N	Guest	User	aijxS_yBVx5iniqy4wYuozBIy55keONe	2025-07-10 03:08:03.711	\N	\N	t	t
guest_M0MlNzGtjAlM	\N	\N	\N	\N	10	2025-07-10 03:08:03.675	2025-07-10 03:08:04.92875	\N	Guest	User	21zzDFuLxGwzXanz6JWf9rxb38ummVM3	2025-07-10 03:08:03.675	\N	\N	t	t
guest_rjB6IN6tlcZP	\N	\N	\N	\N	10	2025-07-10 03:08:03.696	2025-07-10 03:08:04.929411	\N	Guest	User	6TaDjTdZkg0_bYvfVp-W9_9-Yab2mDmT	2025-07-10 03:08:03.696	\N	\N	t	t
guest_wFM1SAZPdgJG	\N	\N	\N	\N	10	2025-07-10 03:08:03.651	2025-07-10 03:08:04.929977	\N	Guest	User	kmJBxl0WHdBElHW-9LdCyiDbIZe04hGf	2025-07-10 03:08:03.651	\N	\N	t	t
guest_NT2bzWxpj53_	\N	\N	\N	\N	10	2025-07-10 03:08:03.633	2025-07-10 03:08:04.930277	\N	Guest	User	hy2nm3fwGrIlUKjkil2k33o1Es0gwcoH	2025-07-10 03:08:03.633	\N	\N	t	t
guest_rlCSjwfH0mTX	\N	\N	\N	\N	10	2025-07-10 03:08:03.609	2025-07-10 03:08:04.930517	\N	Guest	User	-jTKCrBqrdvMl8MPfBVa7Eyz-ta8fOH9	2025-07-10 03:08:03.609	\N	\N	t	t
guest_ppNW64cvzgT0	\N	\N	\N	\N	10	2025-07-10 03:08:03.7	2025-07-10 03:08:04.930775	\N	Guest	User	m6ZG5JHbXHRLkr5ul3jH0DHCvKculWp0	2025-07-10 03:08:03.7	\N	\N	t	t
guest_AKbztaTSf7Sk	\N	\N	\N	\N	10	2025-07-10 02:53:47.416	2025-07-10 02:53:47.452204	\N	Guest	User	_XMc7xwM16m8sZs0PQh1fQsTa7RH-ps9	2025-07-10 02:54:24.838	\N	\N	t	t
guest_IBUomKpDwnVe	\N	\N	\N	\N	10	2025-07-10 05:50:32.562	2025-07-10 05:50:32.597425	\N	Guest	User	-WZlMLYMrqaPgEGwTg6GhndVICgBOiix	2025-07-10 05:50:32.562	\N	\N	t	t
guest_ayKCcZkbqANG	\N	\N	\N	\N	10	2025-07-10 05:50:36.439	2025-07-10 05:50:36.473944	\N	Guest	User	iNKGUy0Qk_l-m3c6ULqQwlBxcDwlTZyr	2025-07-10 05:50:36.439	\N	\N	t	t
guest_rNyCBgNngmg3	\N	\N	\N	\N	10	2025-07-10 03:08:05.188	2025-07-10 03:08:05.248454	\N	Guest	User	XFP5JIHU6AZEVUD-o6wJPZ7dMC5d-ggS	2025-07-10 03:08:05.188	\N	\N	t	t
guest_r6j4wTlMdP51	\N	\N	\N	\N	10	2025-07-10 03:08:05.818	2025-07-10 03:08:05.958825	\N	Guest	User	uWdJ_4ixTkKoZNnOjYAJ_1dmS9AO8rAR	2025-07-10 03:08:05.818	\N	\N	t	t
guest_lxkW_B4Q4fcE	\N	\N	\N	\N	10	2025-07-10 03:08:05.821	2025-07-10 03:08:05.959296	\N	Guest	User	OZ0wsIEYfhA1VrLXbpPROUJFMK43021P	2025-07-10 03:08:05.821	\N	\N	t	t
guest_ryMQDZg-OaTE	\N	\N	\N	\N	10	2025-07-10 03:08:05.819	2025-07-10 03:08:05.959582	\N	Guest	User	9H4QtH7HxcPe9Ps7poRvw_S0sTVukL_b	2025-07-10 03:08:05.819	\N	\N	t	t
guest_Mn0-y8nBtU_K	\N	\N	\N	\N	10	2025-07-10 03:08:05.821	2025-07-10 03:08:05.959852	\N	Guest	User	z4aaF661psMVDrE92rnxp69Ir3IzgN11	2025-07-10 03:08:05.821	\N	\N	t	t
guest_kaMYNsmeasFY	\N	\N	\N	\N	10	2025-07-10 03:08:05.822	2025-07-10 03:08:05.960312	\N	Guest	User	kXEUdKtCiYqWvbQyPkh3qoKQLie5UDRX	2025-07-10 03:08:05.822	\N	\N	t	t
guest_uWMZ7iz7UOwH	\N	\N	\N	\N	10	2025-07-10 05:39:23.24	2025-07-10 05:39:23.274778	\N	Guest	User	zynRmFGBG4J9wjHv8Tish8teVV3FQZxN	2025-07-10 05:39:23.24	\N	\N	t	t
guest_rlG864M8XMai	\N	\N	\N	\N	10	2025-07-10 05:39:23.677	2025-07-10 05:39:23.712076	\N	Guest	User	it0ed_x9YVnsgk-ejU2msebGT0tDb5Ua	2025-07-10 05:39:23.677	\N	\N	t	t
user_debug	user@magicvidio.com	Test	User	\N	50	2025-06-15 11:52:49.112834	2025-07-09 23:57:38.124	@useruser_d	Registered	User	\N	2025-06-26 15:22:49.047284	\N	\N	f	f
premium_debug	premium@magicvidio.com	Premium	User	\N	500	2025-06-15 11:52:49.192743	2025-07-09 23:57:38.256	@userpremiu	Registered	User	\N	2025-06-26 15:22:49.047284	\N	\N	f	f
guest_OERp2jBl4Qbx	\N	\N	\N	\N	10	2025-07-10 02:54:34.228	2025-07-10 02:54:34.263205	\N	Guest	User	gqw-mh-BqEtW2RNPpUkyxLGCP4F0OddI	2025-07-10 03:17:12.109	\N	\N	t	t
guest_qTQmoxRcutrz	\N	\N	\N	\N	10	2025-07-10 05:51:07.386	2025-07-10 05:51:07.422686	\N	Guest	User	NNGSyCH5ollahXr_9PMkjagmojIO3gJV	2025-07-10 05:51:07.386	\N	\N	t	t
guest_UDXrKHarbr83	\N	\N	\N	\N	10	2025-07-10 02:55:00.717	2025-07-10 02:55:00.751964	\N	Guest	User	wqrI-BqjfT19QnMk_oUwyTrBZn1WtBId	2025-07-10 02:55:00.717	\N	\N	t	t
guest_OlrjabEhr1mv	\N	\N	\N	\N	10	2025-07-10 03:08:05.184	2025-07-10 03:08:05.222667	\N	Guest	User	Esuf_IWh2Nk3WK_L6kI0QO19EEJDFOQ7	2025-07-10 03:11:16.587	\N	\N	t	t
guest_z6XbtZB4qCLz	\N	\N	\N	\N	10	2025-07-10 02:20:12.764	2025-07-10 02:20:12.800023	\N	Guest	User	aGu4_gLpY_05J9VKbW-owuOKqdNEbB8W	2025-07-10 02:20:12.764	\N	\N	t	t
guest_vh5jg_7m2P9c	\N	\N	\N	\N	10	2025-07-10 05:31:37.259	2025-07-10 05:31:37.295164	\N	Guest	User	ib9Bc0AoulyauaOg6fE_KN5R8OiYp7Fh	2025-07-10 05:50:15.868	\N	\N	t	t
38298645	tcotten@scryptedinc.com	\N	\N	\N	50	2025-06-14 17:25:10.758565	2025-06-26 15:24:43.542281	@user382986	Registered	User	\N	2025-06-26 15:22:49.047284	\N	\N	f	f
guest_user	guest@delula.com	Guest	User	\N	0	2025-06-24 19:09:39.451407	2025-06-26 15:24:43.732994	\N	Guest	User	\N	2025-06-26 15:22:49.047284	\N	\N	t	t
guest_au25oIKBchDx	\N	\N	\N	\N	10	2025-07-10 02:21:34.347	2025-07-10 02:21:34.38261	\N	Guest	User	NNUqpuDG17FXpZgQ6opacqa6D6UZvB6r	2025-07-10 02:21:34.347	\N	\N	t	t
guest_b06Japp6A-cS	\N	\N	\N	\N	10	2025-07-10 02:21:36.331	2025-07-10 02:21:36.366625	\N	Guest	User	mJPSXGvwWiHqPZjh8sMU5oneoxNgrCwG	2025-07-10 02:21:36.331	\N	\N	t	t
guest_8jGUQW3PVsul	\N	\N	\N	\N	10	2025-07-10 05:50:21.713	2025-07-10 05:50:21.748748	\N	Guest	User	mW1kp2KqYTsRT_VWUzU3f518pdMTkswb	2025-07-10 05:50:21.713	\N	\N	t	t
guest_G1Ctdyj_DKCN	\N	\N	\N	\N	10	2025-07-10 02:33:05.099	2025-07-10 02:33:05.135641	\N	Guest	User	8SeE_ZpZRRSLEYaF9529eMZ0Ay2I2QDb	2025-07-10 02:33:05.099	\N	\N	t	t
guest_S4mLTUeWTIEY	\N	\N	\N	\N	10	2025-07-10 02:39:55.68	2025-07-10 02:39:55.715113	\N	Guest	User	LtX63huBQqqcaD486R-EJj9U09Q0uLSm	2025-07-10 02:39:55.68	\N	\N	t	t
guest_tZQEz2c8WsEO	\N	\N	\N	\N	10	2025-07-10 05:50:23.446	2025-07-10 05:50:23.483195	\N	Guest	User	gZ5NVkH8dBC1OuxiVJRLu_JzSSKhPO55	2025-07-10 05:50:23.446	\N	\N	t	t
guest_klWk1VLTpSlN	\N	\N	\N	\N	10	2025-07-10 03:30:34.347	2025-07-10 03:30:34.381537	\N	Guest	User	iiEbRcVSV08MOd132C9Qe-_ITSkIq6dI	2025-07-10 03:30:52.055	\N	\N	t	t
guest__VVMx51FSJVB	\N	\N	\N	\N	10	2025-07-10 04:05:44.656	2025-07-10 04:05:44.690356	\N	Guest	User	9PXQxWJNoZanFTHKiqZcxx90uBBoNWdV	2025-07-10 04:05:44.656	\N	\N	t	t
guest_3G2KhjdaMdHi	\N	\N	\N	\N	10	2025-07-10 04:05:44.742	2025-07-10 04:05:44.776439	\N	Guest	User	6Swhtvo07AyZAoU63-TgzN3KnRHsB91h	2025-07-10 04:05:44.742	\N	\N	t	t
guest_lmLjPVbceaO3	\N	\N	\N	\N	10	2025-07-10 04:52:55.451	2025-07-10 04:52:55.486141	\N	Guest	User	QeJiZGsz8DEhmjtWqzUXV5s9U2D2pGrB	2025-07-10 04:52:55.451	\N	\N	t	t
guest_024bFzqJlwY9	\N	\N	\N	\N	10	2025-07-10 05:05:17.294	2025-07-10 05:05:17.329982	\N	Guest	User	qN-3mnwvctfjRvPLh67VGopzY4v9bQNN	2025-07-10 05:05:17.294	\N	\N	t	t
guest_qsL8QMbBrU73	\N	\N	\N	\N	10	2025-07-10 05:50:39.207	2025-07-10 05:50:39.241949	\N	Guest	User	_Wsc82AFZukg2OBt-Cs1cwnVCSdhY3CZ	2025-07-10 05:50:39.207	\N	\N	t	t
guest_Vrhfy_gfsT4S	\N	\N	\N	\N	10	2025-07-10 03:05:23.603	2025-07-10 03:05:23.637586	\N	Guest	User	eqpQUnaOdyo6B__k84EfWoW5OvAdykY2	2025-07-10 03:05:23.603	\N	\N	t	t
guest_uKSmmLU1_3qE	\N	\N	\N	\N	10	2025-07-10 05:39:22.794	2025-07-10 05:39:22.829751	\N	Guest	User	-a1jqpYCoyYmCIipNi1e15x6ND4rfOtx	2025-07-10 05:39:22.794	\N	\N	t	t
guest_34obOJtRamlL	\N	\N	\N	\N	10	2025-07-10 03:08:03.484	2025-07-10 03:08:03.708119	\N	Guest	User	4lQ-Xprjtoijr-92Vx9zkzMr-nVE0C12	2025-07-10 03:08:03.484	\N	\N	t	t
guest_kH7DUzl_6bw2	\N	\N	\N	\N	10	2025-07-10 03:08:03.497	2025-07-10 03:08:03.729848	\N	Guest	User	xXPDetWeB3jFr7KSP1U-HUMBvtkDCzKp	2025-07-10 03:08:03.497	\N	\N	t	t
guest_qAQJB_83YL_h	\N	\N	\N	\N	10	2025-07-10 03:08:03.527	2025-07-10 03:08:03.733941	\N	Guest	User	Tyv37S3ePTO9vGdQa9ENaJobhtOH9uG6	2025-07-10 03:08:03.527	\N	\N	t	t
guest_K8w6XUQNAToL	\N	\N	\N	\N	10	2025-07-10 03:08:03.544	2025-07-10 03:08:03.742518	\N	Guest	User	dCPAhJqEFX6NMZDnAiBBQosb_34gqRb6	2025-07-10 03:08:03.544	\N	\N	t	t
guest_ol0KQTAqdT9c	\N	\N	\N	\N	10	2025-07-10 05:50:52.841	2025-07-10 05:50:52.877205	\N	Guest	User	TPrabhdEdFcelaX5Mdcb9x0wK5-pn-Cz	2025-07-10 05:50:52.841	\N	\N	t	t
test_debug	test@magicvidio.com	Test	User	https://via.placeholder.com/150?text=T	100	2025-06-14 15:13:12.945243	2025-07-13 00:26:46.405	@usertest_d	Registered	Test	\N	2025-07-13 00:26:46.405	\N	google	f	f
guest_9Xu5Phxsyc07	\N	\N	\N	\N	10	2025-07-10 05:51:09.748	2025-07-10 05:51:09.783213	\N	Guest	User	5Jn9Lg2iBafE6K4t82uMi1YMlWfzn36C	2025-07-10 05:51:09.748	\N	\N	t	t
guest_Ds64h96DFnPv	\N	\N	\N	\N	10	2025-07-10 05:51:21.507	2025-07-10 05:51:21.542761	\N	Guest	User	x6nzjdLPt-pHarzgLQZ-iJT9n1ajmq0w	2025-07-10 05:51:21.507	\N	\N	t	t
guest_ztbtp28EtPHk	\N	\N	\N	\N	10	2025-07-10 05:51:23.149	2025-07-10 05:51:23.183389	\N	Guest	User	ULH1xjsCOePO8sUCV0M78kgGxnBReuVv	2025-07-10 05:51:23.149	\N	\N	t	t
guest_98T1oesJm7Df	\N	\N	\N	\N	10	2025-07-10 05:51:27.99	2025-07-10 05:51:28.027363	\N	Guest	User	6lB6i-IgbNL6csz-mf_lAS__HLSCE9S0	2025-07-10 05:51:27.99	\N	\N	t	t
guest_EL8IrrpKZq3p	\N	\N	\N	\N	10	2025-07-10 05:51:29.612	2025-07-10 05:51:29.646003	\N	Guest	User	4NY7onIpBPOkU21N_FSr6BTcTM2cAZ98	2025-07-10 05:51:29.612	\N	\N	t	t
guest_RxiiUwUiWc9r	\N	\N	\N	\N	10	2025-07-10 05:51:31.028	2025-07-10 05:51:31.065419	\N	Guest	User	MXi-Ghc2qWqD0uqUpjR0wrT47LzyoZNt	2025-07-10 05:51:31.028	\N	\N	t	t
guest_L2JLWTY33unN	\N	\N	\N	\N	10	2025-07-10 05:51:42.711	2025-07-10 05:51:42.74655	\N	Guest	User	T2SDKj3Vu6MvkKu0_PWGYhTQp8LIHLlS	2025-07-10 05:51:42.711	\N	\N	t	t
guest_jzL-E9FloZpc	\N	\N	\N	\N	10	2025-07-10 05:54:54.286	2025-07-10 05:54:54.321632	\N	Guest	User	36u5AWtXctO4KwM3uVgH5tWc8t-unLUR	2025-07-10 05:54:54.286	\N	\N	t	t
guest__DABmboLtrth	\N	\N	\N	\N	10	2025-07-10 05:52:00.966	2025-07-10 05:52:01.0113	\N	Guest	User	zIHC4f83pRb4WhCxcKXzAzB4Kb1NO0MA	2025-07-10 05:52:00.966	\N	\N	t	t
guest_x_E3r7_cGsg9	\N	\N	\N	\N	10	2025-07-10 05:52:12.816	2025-07-10 05:52:12.85124	\N	Guest	User	bwhZhSlw2ZtJ1Z4QP2FWWa8X-nVS9-W8	2025-07-10 05:52:12.816	\N	\N	t	t
guest_DTRSRpYOKAyo	\N	\N	\N	\N	10	2025-07-10 05:52:24.582	2025-07-10 05:52:24.617497	\N	Guest	User	K_881x21gRZn-tuUiQQavIllJnPGGgyp	2025-07-10 05:52:24.582	\N	\N	t	t
guest_TCgsEu1xmjlD	\N	\N	\N	\N	10	2025-07-10 05:52:25.911	2025-07-10 05:52:25.945382	\N	Guest	User	gQHCRPos0HNQVOgzJS2X1BtUDn-xnp-v	2025-07-10 05:52:25.911	\N	\N	t	t
guest_3d_EeeFebBM8	\N	\N	\N	\N	10	2025-07-10 05:52:27.348	2025-07-10 05:52:27.383529	\N	Guest	User	z2anKpjkQFOrEmXnoKL-JDv0CRPueukN	2025-07-10 05:52:27.348	\N	\N	t	t
guest_y2bJtrhfpiT_	\N	\N	\N	\N	10	2025-07-10 05:52:28.795	2025-07-10 05:52:28.830653	\N	Guest	User	VjWwWs-3afnU_jmVbN_ODbCGYcH906eM	2025-07-10 05:52:28.795	\N	\N	t	t
guest_C3uJpG_SwLzx	\N	\N	\N	\N	10	2025-07-10 05:52:30.11	2025-07-10 05:52:30.144931	\N	Guest	User	LcqTsX7PzB9kC_xmOh0lh3ikDFscsNPg	2025-07-10 05:52:30.11	\N	\N	t	t
guest_5kK4NIfZHzKu	\N	\N	\N	\N	10	2025-07-10 05:52:31.621	2025-07-10 05:52:31.655976	\N	Guest	User	sSDL1XgNop_zQJL54vGyD3mrPXnDJe8u	2025-07-10 05:52:31.621	\N	\N	t	t
guest_7XoLeL1f7vcV	\N	\N	\N	\N	10	2025-07-10 05:52:33.186	2025-07-10 05:52:33.221042	\N	Guest	User	uyq3-cwO3sNGPU6syEM4ERaVpn7_v4yJ	2025-07-10 05:52:33.186	\N	\N	t	t
guest_549oUiznjbgM	\N	\N	\N	\N	10	2025-07-10 05:52:34.514	2025-07-10 05:52:34.549279	\N	Guest	User	MAGQdokNFUWSVx_wGgiXg4zPYtKlfx-v	2025-07-10 05:52:34.514	\N	\N	t	t
guest_FQ_XW12rjBtI	\N	\N	\N	\N	10	2025-07-10 05:52:36.058	2025-07-10 05:52:36.093568	\N	Guest	User	f9LN-KUNbLAYDMRkMSMe8bKUqs2XsjBz	2025-07-10 05:52:36.058	\N	\N	t	t
guest_DGlHTYXzfN3W	\N	\N	\N	\N	10	2025-07-10 05:52:37.707	2025-07-10 05:52:37.742621	\N	Guest	User	prUMpQXRjwHrBncOvuW5005wx0Dgqecj	2025-07-10 05:52:37.707	\N	\N	t	t
guest_-nTDcJyto_k4	\N	\N	\N	\N	10	2025-07-10 05:52:39.327	2025-07-10 05:52:39.36235	\N	Guest	User	gRtgGXgAiapNRQLKCv0_rmkf1Ga3gGSv	2025-07-10 05:52:39.327	\N	\N	t	t
guest_fHOTbzt7L3kf	\N	\N	\N	\N	10	2025-07-10 05:52:40.752	2025-07-10 05:52:40.786268	\N	Guest	User	yF0Gc-RotNTPbrRKgPMFpxUaCR5Eln2p	2025-07-10 05:52:40.752	\N	\N	t	t
guest_1clLCcSUimPw	\N	\N	\N	\N	10	2025-07-10 05:52:44.868	2025-07-10 05:52:44.902997	\N	Guest	User	BUCv-0n6EcKcPHTSLw6qPd_kIAIWPRUL	2025-07-10 05:52:44.868	\N	\N	t	t
guest_8rif-oAh0Axu	\N	\N	\N	\N	10	2025-07-10 05:54:26.352	2025-07-10 05:54:26.389792	\N	Guest	User	m67XvcXf_ksz2ZePvbCHpkdJnu8D7PTO	2025-07-10 05:54:26.352	\N	\N	t	t
guest_P-YR_pjIXM5k	\N	\N	\N	\N	10	2025-07-10 05:52:50.611	2025-07-10 05:52:50.646612	\N	Guest	User	3M95x_SEKzBPA2rmmSqKznTUbrF_EQy6	2025-07-10 05:52:50.611	\N	\N	t	t
guest_fwAdjoJ1Q6MW	\N	\N	\N	\N	10	2025-07-10 05:52:54.979	2025-07-10 05:52:55.016819	\N	Guest	User	AtVUgOEXfOpOam7jt40VxM3NyU7F_O7f	2025-07-10 05:52:54.979	\N	\N	t	t
guest_j7nZAFpMPeqU	\N	\N	\N	\N	10	2025-07-10 05:52:56.649	2025-07-10 05:52:56.684498	\N	Guest	User	kYTJ1l9IuBRk9QoeSr979dzctXnJRm-_	2025-07-10 05:52:56.649	\N	\N	t	t
guest_YStaNVIkW63q	\N	\N	\N	\N	10	2025-07-10 05:52:58.079	2025-07-10 05:52:58.11471	\N	Guest	User	bitFPI1HErOCWarzdF0QqW5MpazpOStx	2025-07-10 05:52:58.079	\N	\N	t	t
guest_gWx4ekqnMyxt	\N	\N	\N	\N	10	2025-07-10 05:52:59.458	2025-07-10 05:52:59.493123	\N	Guest	User	enKM3NYAP92zaNKpodLKAKra0mMixxfS	2025-07-10 05:52:59.458	\N	\N	t	t
guest_ti9K1iXAYa12	\N	\N	\N	\N	10	2025-07-10 05:54:30.75	2025-07-10 05:54:31.022157	\N	Guest	User	XqsRxnUbphayV3Vu7GE9q9UzP5WW39MY	2025-07-10 05:54:30.75	\N	\N	t	t
guest_cEGfcsfSfDzB	\N	\N	\N	\N	10	2025-07-10 05:53:12.626	2025-07-10 05:53:12.662019	\N	Guest	User	zunpZAaGz19OY1YizsbSTY4yraPE-Ijy	2025-07-10 05:53:12.626	\N	\N	t	t
guest_1v60k01tri5J	\N	\N	\N	\N	10	2025-07-10 05:53:15.882	2025-07-10 05:53:15.916632	\N	Guest	User	ZiW6fG2G6ZRG14KYMsufsmM2_8WuCVX_	2025-07-10 05:53:15.882	\N	\N	t	t
guest_cU0q6JN5g3KB	\N	\N	\N	\N	10	2025-07-10 05:53:18.685	2025-07-10 05:53:18.72128	\N	Guest	User	Kh_GZdpaLXIZGECR9_sNgvhn05SHaF_Z	2025-07-10 05:53:18.685	\N	\N	t	t
guest_7v_UP4t65j4f	\N	\N	\N	\N	10	2025-07-10 05:53:20.088	2025-07-10 05:53:20.123231	\N	Guest	User	pTEUUesRpkB1AGEo-kE_GAiC59snp6Ik	2025-07-10 05:53:20.088	\N	\N	t	t
guest_6iBbivrc97_W	\N	\N	\N	\N	10	2025-07-10 05:53:21.419	2025-07-10 05:53:21.455507	\N	Guest	User	yz8GgW_fgmFOGapm7hoRKPlJtRggzsTw	2025-07-10 05:53:21.419	\N	\N	t	t
guest_VuCZcOGV159K	\N	\N	\N	\N	10	2025-07-10 05:53:23.069	2025-07-10 05:53:23.103871	\N	Guest	User	JJkhMDnA0GVVePBaYxXM0Xy61cXp86HO	2025-07-10 05:53:23.069	\N	\N	t	t
guest_SF9BFL4c0Wju	\N	\N	\N	\N	10	2025-07-10 05:53:24.603	2025-07-10 05:53:24.637789	\N	Guest	User	yJwn_vyUofhLSrFbFtTFmLRyIZ9ge9ia	2025-07-10 05:53:24.603	\N	\N	t	t
guest_jJtbQybhNn0p	\N	\N	\N	\N	10	2025-07-10 05:53:36.282	2025-07-10 05:53:36.316995	\N	Guest	User	4Qmh8VBOW33kDd76WVTx1OLKOz70why2	2025-07-10 05:53:36.282	\N	\N	t	t
guest_iiFM2wwtQ9_a	\N	\N	\N	\N	10	2025-07-10 05:53:42.629	2025-07-10 05:53:42.66588	\N	Guest	User	673EvwFG2jUSh3at3huuYv_kZmoLw4rB	2025-07-10 05:53:42.629	\N	\N	t	t
guest_oO-i6D80Iy7b	\N	\N	\N	\N	10	2025-07-10 05:53:44.162	2025-07-10 05:53:44.197492	\N	Guest	User	MjgALf8vRyN4NhxxGZCeDTmMe-yTtPUP	2025-07-10 05:53:44.162	\N	\N	t	t
guest_SjvG__bxZgHC	\N	\N	\N	\N	10	2025-07-10 05:53:45.389	2025-07-10 05:53:45.424199	\N	Guest	User	dWuuVenG-Vd22mW1JAVJj0kirnaaEi2U	2025-07-10 05:53:45.389	\N	\N	t	t
guest_MvM2mMg2Wia7	\N	\N	\N	\N	10	2025-07-10 05:53:46.812	2025-07-10 05:53:46.848048	\N	Guest	User	x8XyO6-G1yLFFEKFqhdxLzlS2a9HQRjy	2025-07-10 05:53:46.812	\N	\N	t	t
guest_UqfqqBoYF97t	\N	\N	\N	\N	10	2025-07-10 05:55:25.833	2025-07-10 05:55:25.86857	\N	Guest	User	qeYfHtT2gZA0ehUfB-poZ70lOzp9gSWg	2025-07-10 05:55:25.833	\N	\N	t	t
guest_pevIJYdv9n9v	\N	\N	\N	\N	10	2025-07-10 05:53:52.151	2025-07-10 05:53:52.185876	\N	Guest	User	cP6vn79MfU2u2VnTCcGgLu07c4zueITo	2025-07-10 05:53:52.151	\N	\N	t	t
guest_OopeVSnjAzoU	\N	\N	\N	\N	10	2025-07-10 05:53:56.357	2025-07-10 05:53:56.779295	\N	Guest	User	1fkQJaVlkgp7tPvRgIk-NgP6kSEZ9780	2025-07-10 05:53:56.357	\N	\N	t	t
guest_LCzOAQevZ7Ym	\N	\N	\N	\N	10	2025-07-10 05:54:36.578	2025-07-10 05:54:36.611528	\N	Guest	User	0cwpvLqBjAhyvQgNcnXLJXouMA5p7C2y	2025-07-10 05:54:36.578	\N	\N	t	t
guest_-vLEx8JfemEt	\N	\N	\N	\N	10	2025-07-10 05:54:02.999	2025-07-10 05:54:03.041811	\N	Guest	User	1I_TT0xTvARG-8jcwR2-ZAq7BD_LA526	2025-07-10 05:54:02.999	\N	\N	t	t
guest_m_B585CnL7p7	\N	\N	\N	\N	10	2025-07-10 05:55:00.1	2025-07-10 05:55:00.132356	\N	Guest	User	LEvkbxZ05rZ4t071iVkgkYgu1RJtpbUj	2025-07-10 05:55:00.1	\N	\N	t	t
guest_V6d1a8W6JlIw	\N	\N	\N	\N	10	2025-07-10 05:54:10.358	2025-07-10 05:54:10.39297	\N	Guest	User	3gqqZUjzAJdToRK5qPQDsrcsuo57MVMP	2025-07-10 05:54:10.358	\N	\N	t	t
guest_rdzZ-FRgklT6	\N	\N	\N	\N	10	2025-07-10 05:54:15.118	2025-07-10 05:54:15.165492	\N	Guest	User	NSZECUOl6lFYvQ5GpUSG3bn1l2vzlocF	2025-07-10 05:54:15.118	\N	\N	t	t
guest_W9LY-xk21lAP	\N	\N	\N	\N	10	2025-07-10 05:55:05.338	2025-07-10 05:55:05.409661	\N	Guest	User	--dZkCs292MgNMzvnxAXICFn8mMm3ALr	2025-07-10 05:55:05.338	\N	\N	t	t
guest_W6EytpDMoxXU	\N	\N	\N	\N	10	2025-07-10 05:54:20.924	2025-07-10 05:54:20.958157	\N	Guest	User	0yX8H6Klrk02bZlnqi4rg2_QvIlst6R0	2025-07-10 05:54:20.924	\N	\N	t	t
guest_OeEdogAnufkV	\N	\N	\N	\N	10	2025-07-10 05:54:41.511	2025-07-10 05:54:41.5469	\N	Guest	User	L2oqshfe3Ns7rnX7ffWIRBYg0tW0A4oL	2025-07-10 05:54:41.511	\N	\N	t	t
guest_DMviFwPI8lwp	\N	\N	\N	\N	10	2025-07-10 05:55:08.112	2025-07-10 05:55:08.145095	\N	Guest	User	sN8FLP7RCV_6gEe9GvPZjgw60xSNGl3S	2025-07-10 05:55:08.112	\N	\N	t	t
guest_hpzeTSKjhKs-	\N	\N	\N	\N	10	2025-07-10 05:55:06.866	2025-07-10 05:55:06.90022	\N	Guest	User	y5VG483EVixK43vDSu3XpLNURsXHQKQK	2025-07-10 05:55:06.866	\N	\N	t	t
guest_hwGUUtAtrHAQ	\N	\N	\N	\N	10	2025-07-10 05:55:09.255	2025-07-10 05:55:09.287565	\N	Guest	User	WXYMV_ZMXiSHl_cBPh9j3Reb0_kE0l3I	2025-07-10 05:55:09.255	\N	\N	t	t
guest_sHvMiSfSns23	\N	\N	\N	\N	10	2025-07-10 05:55:10.449	2025-07-10 05:55:10.481055	\N	Guest	User	t5KQ7R2ylrzqqm9fqKwRPcouZiiFA905	2025-07-10 05:55:10.449	\N	\N	t	t
guest_VJDFZiH0gvrK	\N	\N	\N	\N	10	2025-07-10 05:55:35.579	2025-07-10 05:55:35.614807	\N	Guest	User	USdtm80fFKLyznRjeVID6Vv2_dMByO4Z	2025-07-10 05:55:35.579	\N	\N	t	t
guest_TuwfOvKaLfh0	\N	\N	\N	\N	10	2025-07-10 05:55:29.965	2025-07-10 05:55:30.001921	\N	Guest	User	sFQCbX_dKdSqbpJ_6cEVrprfJhdGcnV_	2025-07-10 05:55:29.965	\N	\N	t	t
guest_9taigZJ52TiW	\N	\N	\N	\N	10	2025-07-10 05:55:39.607	2025-07-10 05:55:39.644752	\N	Guest	User	4rh0jrxv9xrz7723Gv_aZ1NVyAUatug8	2025-07-10 05:55:39.607	\N	\N	t	t
guest_TPRBvrG2KrTS	\N	\N	\N	\N	10	2025-07-10 05:55:41.499	2025-07-10 05:55:41.534306	\N	Guest	User	WfqaOV1TnDjWvoSPl8BmgnNiFJCqSdwg	2025-07-10 05:55:41.499	\N	\N	t	t
guest_O1GKAuA7Jife	\N	\N	\N	\N	10	2025-07-10 05:55:55.65	2025-07-10 05:55:55.686178	\N	Guest	User	VLLoX_WF4F5ZGHHGpBGYEVgeOdBvNJSd	2025-07-10 05:55:55.65	\N	\N	t	t
guest_z6v28P2UFinb	\N	\N	\N	\N	10	2025-07-10 05:56:00.206	2025-07-10 05:56:00.398411	\N	Guest	User	806mTk1Kjc4ynFHZGqDfCl9GV2ClLFaj	2025-07-10 05:56:00.206	\N	\N	t	t
guest_cniggim0VO0C	\N	\N	\N	\N	10	2025-07-10 06:06:25.537	2025-07-10 06:06:25.572289	\N	Guest	User	FiB6ZuWK43zIeQmJG3cyS_QnCGP4290F	2025-07-10 06:06:25.537	\N	\N	t	t
guest_8ZPmaBDw9lbP	\N	\N	\N	\N	10	2025-07-10 05:56:06.622	2025-07-10 05:56:06.657548	\N	Guest	User	kPPx5z-9G_3xh8f2ByDy4hQ233gQxa8M	2025-07-10 05:56:06.622	\N	\N	t	t
guest_nfySUXxkYXj8	\N	\N	\N	\N	10	2025-07-10 05:56:11.482	2025-07-10 05:56:11.53033	\N	Guest	User	eFpshNaezmcRpGG-9k_bR3aiQwefddhC	2025-07-10 05:56:11.482	\N	\N	t	t
guest_UQ60oBlpsOkW	\N	\N	\N	\N	10	2025-07-10 05:56:13.019	2025-07-10 05:56:13.055776	\N	Guest	User	W-EpHyIVlFKuJxyHQq7YRUvsHV5EMhkq	2025-07-10 05:56:13.019	\N	\N	t	t
guest_TYvazxFdPUbO	\N	\N	\N	\N	10	2025-07-10 05:56:14.211	2025-07-10 05:56:14.246881	\N	Guest	User	mRdTbvOtvtwjzcskSx5L9At7b4Gd-IWw	2025-07-10 05:56:14.211	\N	\N	t	t
guest_dj3Nexo0r99Y	\N	\N	\N	\N	10	2025-07-10 05:56:15.464	2025-07-10 05:56:15.500414	\N	Guest	User	T0XTvWCFiCEVF8KpBaZC40lgTKcU1ayr	2025-07-10 05:56:15.464	\N	\N	t	t
admin_debug	admin@magicvidio.com	Admin	User	https://via.placeholder.com/150?text=A	1000	2025-06-14 15:13:12.945243	2025-07-13 00:26:46.306	@magicvidio	Registered	Admin	\N	2025-07-13 00:26:46.305	\N	google	f	f
guest_5u0eKMeNEljO	\N	\N	\N	\N	10	2025-07-10 05:56:28.719	2025-07-10 05:56:28.755256	\N	Guest	User	KRW2G_2U9MvGysqeIjxU-U8-VxzVtZ8w	2025-07-10 05:56:28.719	\N	\N	t	t
guest_OJrW_RkQueMs	\N	\N	\N	\N	10	2025-07-10 05:56:32.998	2025-07-10 05:56:33.138931	\N	Guest	User	oGQcYAifQ1mHF4zdi-zywKGxFGpsIl8f	2025-07-10 05:56:32.998	\N	\N	t	t
guest_iBrSaP55QGzg	\N	\N	\N	\N	10	2025-07-10 05:56:45.425	2025-07-10 05:56:45.459747	\N	Guest	User	18AdSf_xchhtJS-iiDfoKXzH09SmWvjE	2025-07-10 05:56:45.425	\N	\N	t	t
guest_UGjgx0KYpRlx	\N	\N	\N	\N	10	2025-07-10 05:56:46.846	2025-07-10 05:56:46.880721	\N	Guest	User	V4TeGzLj3VlwaVJj2Ayp9PBwXVGmVsXR	2025-07-10 05:56:46.846	\N	\N	t	t
guest_cyIhvxlgqL5I	\N	\N	\N	\N	10	2025-07-10 05:56:48.167	2025-07-10 05:56:48.202083	\N	Guest	User	IWSZpHHbElYeA9Pqy3DrDC0Egw91vJT-	2025-07-10 05:56:48.167	\N	\N	t	t
guest_0W1csXzMokOT	\N	\N	\N	\N	10	2025-07-10 06:06:11.344	2025-07-10 06:06:11.379179	\N	Guest	User	p5q1HuBTAEv8C-r9P9yar2lzICBnBOSr	2025-07-10 06:06:11.344	\N	\N	t	t
guest_DwJuTt_Fx1c_	\N	\N	\N	\N	10	2025-07-10 05:56:53.308	2025-07-10 05:56:53.343193	\N	Guest	User	RXV409W6PTxvbNYqTGDGtOPaAOoLunp-	2025-07-10 05:56:53.308	\N	\N	t	t
guest_P9MjQ6UnkEB_	\N	\N	\N	\N	10	2025-07-10 05:56:57.855	2025-07-10 05:56:57.902802	\N	Guest	User	T-_Rt1CA3IgVxVYwI2ezv6R2CDzA3zPf	2025-07-10 05:56:57.855	\N	\N	t	t
guest_fEP0GYTr-AfX	\N	\N	\N	\N	10	2025-07-10 05:57:09.664	2025-07-10 05:57:09.699603	\N	Guest	User	Yg6HtAkGJ5vfWWWxtr66YovsfZ3nTIKt	2025-07-10 05:57:09.664	\N	\N	t	t
guest_gqbYRB1P1auS	\N	\N	\N	\N	10	2025-07-10 05:57:31.594	2025-07-10 05:57:31.631449	\N	Guest	User	SNmsmHD8K5j3LoBaro8F2LtWTqK62Vww	2025-07-10 05:57:31.594	\N	\N	t	t
guest_P4H9nAt3ImcB	\N	\N	\N	\N	10	2025-07-10 05:57:32.927	2025-07-10 05:57:32.965491	\N	Guest	User	R9D9q1sWmZZGxnPndn4bafpNpP_4M_wr	2025-07-10 05:57:32.927	\N	\N	t	t
guest_Fksb00xB7wBL	\N	\N	\N	\N	10	2025-07-10 05:57:44.701	2025-07-10 05:57:44.733263	\N	Guest	User	q_JXuTPQfagr1uRTHo_TCLt2wYLOFtNL	2025-07-10 05:57:44.701	\N	\N	t	t
guest_ujGrtxqei4VP	\N	\N	\N	\N	10	2025-07-10 06:06:13.099	2025-07-10 06:06:13.134752	\N	Guest	User	mzQZwtRDBU4lRHcBeEdmfUccftevsNzm	2025-07-10 06:06:13.099	\N	\N	t	t
guest_P6FxVKTS2H6d	\N	\N	\N	\N	10	2025-07-10 05:57:50.074	2025-07-10 05:57:50.11038	\N	Guest	User	M0faAo_l7cAf5qZtRV96-deoPvnJN39w	2025-07-10 05:57:50.074	\N	\N	t	t
guest_weSJptwM_HvQ	\N	\N	\N	\N	10	2025-07-10 06:06:14.102	2025-07-10 06:06:14.137666	\N	Guest	User	MakGR363ETjOQF6HbnblY5eYdy_NIe97	2025-07-10 06:06:14.102	\N	\N	t	t
guest_tXPSwRO_KMk7	\N	\N	\N	\N	10	2025-07-10 05:57:55.811	2025-07-10 05:57:55.845905	\N	Guest	User	L8fATimnO1w8vOsNlaFBS2Pin0bmKpEK	2025-07-10 05:57:55.811	\N	\N	t	t
guest_kIz5ERllFBZ5	\N	\N	\N	\N	10	2025-07-10 06:06:15.039	2025-07-10 06:06:15.074147	\N	Guest	User	vsETHwqKY3mJa8ka6QRtzrWjf0Ck74p3	2025-07-10 06:06:15.039	\N	\N	t	t
guest_Jc9Mt59o-FC6	\N	\N	\N	\N	10	2025-07-10 05:58:07.746	2025-07-10 05:58:07.782785	\N	Guest	User	j2SmD3dTmkiTajpJv0YCp7MnB0ZzSUjx	2025-07-10 05:58:07.746	\N	\N	t	t
guest_YJ95z1AdhV5O	\N	\N	\N	\N	10	2025-07-10 06:06:16.184	2025-07-10 06:06:16.219607	\N	Guest	User	kMT8Em_4gGrYiTQINWCDqQGc71UgLTGJ	2025-07-10 06:06:16.184	\N	\N	t	t
guest_ideOA_AyucFi	\N	\N	\N	\N	10	2025-07-10 05:58:27.782	2025-07-10 05:58:27.815785	\N	Guest	User	XkVOQCpCBffKVj4Fgrd3KM996Bja7N-U	2025-07-10 05:58:27.782	\N	\N	t	t
guest_6ZtSVX1DFxtR	\N	\N	\N	\N	10	2025-07-10 05:58:39.374	2025-07-10 05:58:39.409023	\N	Guest	User	wY8VEZoXKTVKRTf2rx5q8ihDiv361htG	2025-07-10 05:58:39.374	\N	\N	t	t
guest_eRreCSvJOVuv	\N	\N	\N	\N	10	2025-07-10 05:58:40.606	2025-07-10 05:58:40.638419	\N	Guest	User	uEifrsgTmeuDhsillqI0JjGZb0qnaq2Y	2025-07-10 05:58:40.606	\N	\N	t	t
guest_8POs1k9k8MDZ	\N	\N	\N	\N	10	2025-07-10 05:58:41.831	2025-07-10 05:58:41.864199	\N	Guest	User	FwtyB-7viKdWfwopGuut3xOe59u6MCdY	2025-07-10 05:58:41.831	\N	\N	t	t
guest_6BwbE2G49VgX	\N	\N	\N	\N	10	2025-07-10 05:58:43.053	2025-07-10 05:58:43.085017	\N	Guest	User	aHzDVWxf3so4WQiRYcw5pADnge3_PXZh	2025-07-10 05:58:43.053	\N	\N	t	t
guest_Dx_cipO06AXp	\N	\N	\N	\N	10	2025-07-10 05:58:44.393	2025-07-10 05:58:44.423727	\N	Guest	User	JHsBqXRpGr95BswJ04VDy3gQYJZq4gjT	2025-07-10 05:58:44.393	\N	\N	t	t
guest_iCh76VvLF9W7	\N	\N	\N	\N	10	2025-07-10 05:58:45.711	2025-07-10 05:58:45.743207	\N	Guest	User	riFOrIHaq5KGo-XY6L2Qp_aAz2GzzF9y	2025-07-10 05:58:45.711	\N	\N	t	t
guest_6vJYOiCVheDJ	\N	\N	\N	\N	10	2025-07-10 05:58:47.262	2025-07-10 05:58:47.29574	\N	Guest	User	kagbvmz0rGLCDumjxA_QZVVWtuXXWg3K	2025-07-10 05:58:47.262	\N	\N	t	t
guest_5EKBHWHIJ4Tq	\N	\N	\N	\N	10	2025-07-10 05:58:48.479	2025-07-10 05:58:48.512571	\N	Guest	User	rGYs2EUbxSW9JqWpHhfZcLnv289HMf3L	2025-07-10 05:58:48.479	\N	\N	t	t
guest_HT6eok_ZGhie	\N	\N	\N	\N	10	2025-07-10 05:58:53.458	2025-07-10 05:58:53.49045	\N	Guest	User	Rqi1DG87gd_SiSdyMOZd3425iMbxFXUa	2025-07-10 05:58:53.458	\N	\N	t	t
guest_dC1HN1bqbEfX	\N	\N	\N	\N	10	2025-07-10 05:58:58.038	2025-07-10 05:58:58.222076	\N	Guest	User	_oR7hwKHcf7pQhwM37xcU1vYkTPKrm5b	2025-07-10 05:58:58.038	\N	\N	t	t
guest_ARU_pYFbeDGG	\N	\N	\N	\N	10	2025-07-10 05:58:59.967	2025-07-10 05:59:00.000052	\N	Guest	User	F-B9421hW7ohTzdCYO0aJ4_05VoyuyVP	2025-07-10 05:58:59.967	\N	\N	t	t
guest_wnIA8v206dJ8	\N	\N	\N	\N	10	2025-07-10 06:06:17.278	2025-07-10 06:06:17.313473	\N	Guest	User	giXH47a5lB3ijI47L5AYMSYqJiWt1tDz	2025-07-10 06:06:17.278	\N	\N	t	t
guest_aaL_M4F43AST	\N	\N	\N	\N	10	2025-07-10 06:06:18.316	2025-07-10 06:06:18.351558	\N	Guest	User	7BMZjbFPBjZy-bU6hYXWvvQnbURtQ27s	2025-07-10 06:06:18.316	\N	\N	t	t
guest_xikPCHZTSrjb	\N	\N	\N	\N	10	2025-07-10 06:06:19.387	2025-07-10 06:06:19.422414	\N	Guest	User	V1VbZDg1ic1X8SiKs3QtPdyFVSLs-Fn6	2025-07-10 06:06:19.387	\N	\N	t	t
guest_P15GRwkOkYW4	\N	\N	\N	\N	10	2025-07-10 06:06:20.572	2025-07-10 06:06:20.606043	\N	Guest	User	x_mdVRz4g85k2DtSySFwV8J8XpFE9OgM	2025-07-10 06:06:20.572	\N	\N	t	t
guest_4NsHmM1PHi5_	\N	\N	\N	\N	10	2025-07-10 06:06:21.493	2025-07-10 06:06:21.528287	\N	Guest	User	eUC7C4mbO104CusLMVhCUgLo4V5ctCQ6	2025-07-10 06:06:21.493	\N	\N	t	t
guest_LSCvLMI53EDM	\N	\N	\N	\N	10	2025-07-10 06:06:22.471	2025-07-10 06:06:22.506321	\N	Guest	User	z16pDfMwK0mjZhH78SD3Krw6Roman3AD	2025-07-10 06:06:22.471	\N	\N	t	t
guest_2rnRN6qkmOG_	\N	\N	\N	\N	10	2025-07-10 06:06:23.873	2025-07-10 06:06:23.90697	\N	Guest	User	2CFZMRs8RS0v4lUJNsT-YnOOyRh1Hiq2	2025-07-10 06:06:23.873	\N	\N	t	t
guest_aNOgPS2b0w5M	\N	\N	\N	\N	10	2025-07-10 06:06:24.734	2025-07-10 06:06:24.770741	\N	Guest	User	Uf1mvxRlIF_j-d8hUFQcUvyCikELZ6zA	2025-07-10 06:06:24.734	\N	\N	t	t
guest_R_TaVdU1kjoq	\N	\N	\N	\N	10	2025-07-10 06:06:26.203	2025-07-10 06:06:26.238483	\N	Guest	User	y15VEbV-UA_lyaEkNJ8t-dSfs3dwuE5p	2025-07-10 06:06:26.203	\N	\N	t	t
guest_wG_cUVrjnlhH	\N	\N	\N	\N	10	2025-07-10 06:06:26.91	2025-07-10 06:06:26.945881	\N	Guest	User	DO8xY1K4r-wuUrwgUBUcZR-Yt8jGcTho	2025-07-10 06:06:26.91	\N	\N	t	t
guest_B_-JtCnev4Nm	\N	\N	\N	\N	10	2025-07-10 06:06:27.624	2025-07-10 06:06:27.66218	\N	Guest	User	WUFRrmUOEoPOVOrF2q47Elc47Y0LRd92	2025-07-10 06:06:27.624	\N	\N	t	t
guest_xRpGBCTe-pm4	\N	\N	\N	\N	10	2025-07-10 06:06:28.855	2025-07-10 06:06:28.890048	\N	Guest	User	wth8ANPI_qq-FhEf5EIQTyYQwwumc4ei	2025-07-10 06:06:28.855	\N	\N	t	t
guest_ZjclHrNddNmZ	\N	\N	\N	\N	10	2025-07-10 06:06:29.74	2025-07-10 06:06:29.776929	\N	Guest	User	MrrVN7VhYsGcpaQepdlUTQqDu9NM0W4u	2025-07-10 06:06:29.74	\N	\N	t	t
guest_-_7oqzBVi2Yw	\N	\N	\N	\N	10	2025-07-10 06:06:30.617	2025-07-10 06:06:30.650939	\N	Guest	User	NDLtjfx0noB-5_qOT9VtFJBsnHDJwzQH	2025-07-10 06:06:30.617	\N	\N	t	t
guest_9Zl9eLp3PRxk	\N	\N	\N	\N	10	2025-07-10 06:06:31.445	2025-07-10 06:06:31.47962	\N	Guest	User	qYYEGD2g4CA77RtGrksl6Li5cnc1blKX	2025-07-10 06:06:31.445	\N	\N	t	t
guest_czp8rnYMRIh1	\N	\N	\N	\N	10	2025-07-10 06:06:32.294	2025-07-10 06:06:32.329752	\N	Guest	User	83goJoHGQ1BoBqxCnnYGtNXYvwKQK8i9	2025-07-10 06:06:32.294	\N	\N	t	t
guest_jLhUijTaYIqF	\N	\N	\N	\N	10	2025-07-10 06:06:33.097	2025-07-10 06:06:33.133322	\N	Guest	User	FNELdc4m1Y4-uYnwEiJP_KWGwD7MXbe0	2025-07-10 06:06:33.097	\N	\N	t	t
guest_3dMMJrOPYtva	\N	\N	\N	\N	10	2025-07-10 06:06:34.594	2025-07-10 06:06:34.628912	\N	Guest	User	8RZyRlMCqJTc4M2P9-UMhI-tr1NLRo7S	2025-07-10 06:06:34.594	\N	\N	t	t
guest_yypIOL2mjlYc	\N	\N	\N	\N	10	2025-07-10 06:06:35.822	2025-07-10 06:06:35.856066	\N	Guest	User	WJoH1KSVzf6SgejxHbgTa-6CDWEPVKB6	2025-07-10 06:06:35.822	\N	\N	t	t
guest_9Vm8MW-wKwdu	\N	\N	\N	\N	10	2025-07-10 06:06:36.832	2025-07-10 06:06:36.867566	\N	Guest	User	torZoW86WPgBOnpIvL4EY8DDk8C9bJNs	2025-07-10 06:06:36.832	\N	\N	t	t
guest_ENRnr5g3ahRv	\N	\N	\N	\N	10	2025-07-10 06:06:37.911	2025-07-10 06:06:37.946583	\N	Guest	User	sNkWmhCOTL6NAMjN4VV5YLe2XKNd6QHz	2025-07-10 06:06:37.911	\N	\N	t	t
guest_z3z-Ef-VYTIm	\N	\N	\N	\N	10	2025-07-10 06:06:38.994	2025-07-10 06:06:39.033011	\N	Guest	User	YlCBl0icPL8ZSCHXF9pbqPRsRXu9IeR4	2025-07-10 06:06:38.994	\N	\N	t	t
guest_p7ihHmxwnNg_	\N	\N	\N	\N	10	2025-07-10 06:06:39.921	2025-07-10 06:06:39.95612	\N	Guest	User	02VrtsfTNs8nWD3UbJ3co9Tszpm4VlEH	2025-07-10 06:06:39.921	\N	\N	t	t
guest_bCJAtB2JAoc9	\N	\N	\N	\N	10	2025-07-10 06:06:40.798	2025-07-10 06:06:40.838925	\N	Guest	User	2ShwG9lFH2H1pyENmFZyzq6xb1ueN208	2025-07-10 06:06:40.798	\N	\N	t	t
guest_4nw9PcVDxjz9	\N	\N	\N	\N	10	2025-07-10 06:06:41.627	2025-07-10 06:06:41.662676	\N	Guest	User	Klw3uHtMXGeAWgNzbPMW5_3dzo9f7tWT	2025-07-10 06:06:41.627	\N	\N	t	t
guest_O2N-C0_nRXBC	\N	\N	\N	\N	10	2025-07-10 06:06:42.354	2025-07-10 06:06:42.390997	\N	Guest	User	xa02RZKwrgPXgUuqu9G2ejWISAb58ihP	2025-07-10 06:06:42.354	\N	\N	t	t
guest_h7AYqdPtGLZC	\N	\N	\N	\N	10	2025-07-10 06:06:43.217	2025-07-10 06:06:43.250967	\N	Guest	User	mASTfMJ8CZbijTPzvC34J-XnEXAc-yCA	2025-07-10 06:06:43.217	\N	\N	t	t
guest_SGrZqNHZ6R9M	\N	\N	\N	\N	10	2025-07-10 06:06:43.894	2025-07-10 06:06:43.929711	\N	Guest	User	RONYas1Mt22Q_g23SrMZ1yKvY5wyamrq	2025-07-10 06:06:43.894	\N	\N	t	t
guest_x-d5CAKRB93q	\N	\N	\N	\N	10	2025-07-10 06:06:44.761	2025-07-10 06:06:44.795981	\N	Guest	User	RvGuDef8UjNGoJvJhFP4Jcb4Pf7GsOsj	2025-07-10 06:06:44.761	\N	\N	t	t
guest_4WgTIHjiKxGo	\N	\N	\N	\N	10	2025-07-10 06:06:45.788	2025-07-10 06:06:45.824918	\N	Guest	User	BbMtOL1RE01ofIS7s7cJHDiSXLjKvsay	2025-07-10 06:06:45.788	\N	\N	t	t
guest_XEMX-gqSjpLn	\N	\N	\N	\N	10	2025-07-10 06:06:46.504	2025-07-10 06:06:46.540406	\N	Guest	User	DHAQ7SNOeKMf8xQlCAVqmdwiAfoATOtJ	2025-07-10 06:06:46.504	\N	\N	t	t
guest_j3H2tTPFiTY4	\N	\N	\N	\N	10	2025-07-10 06:06:47.618	2025-07-10 06:06:47.654558	\N	Guest	User	32vtBErXBc8f0SO72Im43OCAaPPhYz94	2025-07-10 06:06:47.618	\N	\N	t	t
guest_kHitEsHXOsx3	\N	\N	\N	\N	10	2025-07-10 06:06:48.434	2025-07-10 06:06:48.469938	\N	Guest	User	oY6EOASPlxqg_6n5dA0xoLGnvYAR9BN0	2025-07-10 06:06:48.434	\N	\N	t	t
guest_iQamebn7K03c	\N	\N	\N	\N	10	2025-07-10 06:06:49.238	2025-07-10 06:06:49.273812	\N	Guest	User	t7nDI_2yiIL3TVsSdo-Ew0KAGuCLB8NI	2025-07-10 06:06:49.238	\N	\N	t	t
guest_wa1gGSs58xFa	\N	\N	\N	\N	10	2025-07-10 06:06:50.091	2025-07-10 06:06:50.12597	\N	Guest	User	U-Ej2utpOOBMLb4_REGZUaYDKvTA628l	2025-07-10 06:06:50.091	\N	\N	t	t
guest_k-T6bEJ0gJoC	\N	\N	\N	\N	10	2025-07-10 06:06:51.098	2025-07-10 06:06:51.133214	\N	Guest	User	AmZtUFGr1xqsFVhssHALpAFGJjd8ptS0	2025-07-10 06:06:51.098	\N	\N	t	t
guest_5t17EzJBsrpo	\N	\N	\N	\N	10	2025-07-10 06:06:52.04	2025-07-10 06:06:52.075112	\N	Guest	User	DPAPR-KNfjBq2xBPQTadw7Iy0LCzp-Ay	2025-07-10 06:06:52.04	\N	\N	t	t
guest_GvzPu7RZ982P	\N	\N	\N	\N	10	2025-07-10 08:15:20.045	2025-07-10 08:15:20.080068	\N	Guest	User	Rw1nGclYHtc7ceUJ00z5DZ6k4KXMcigB	2025-07-10 08:15:20.045	\N	\N	t	t
guest_ggZHtxhpOlku	\N	\N	\N	\N	10	2025-07-10 08:24:09.424	2025-07-10 08:24:09.458524	\N	Guest	User	KOJujTkf7fn8UQIiWfgZMWYI9iPeGqHK	2025-07-10 08:24:09.424	\N	\N	t	t
guest_5ftJoJYgAHUB	\N	\N	\N	\N	10	2025-07-10 08:27:01.579	2025-07-10 08:27:01.615685	\N	Guest	User	P1_LdgPbi93A_mJTjewUE3HMlVEI7hoz	2025-07-10 08:27:01.579	\N	\N	t	t
guest_N40lHkcaJdve	\N	\N	\N	\N	10	2025-07-10 09:26:10.617	2025-07-10 09:26:10.652805	\N	Guest	User	36SDtlrU-USCJBf5cyXMYE-Qr5zQurA5	2025-07-10 09:26:10.617	\N	\N	t	t
guest_SGTqm2GXnv76	\N	\N	\N	\N	10	2025-07-10 10:01:03.548	2025-07-10 10:01:03.582787	\N	Guest	User	nCvFetukphRplqwdtLJtFp4_GeG5jdzs	2025-07-10 10:01:03.548	\N	\N	t	t
guest_cASqpMTmzDBy	\N	\N	\N	\N	10	2025-07-10 10:19:11.173	2025-07-10 10:19:11.207213	\N	Guest	User	-YEG5_JBh9XT4Wy0jS33dUJOnkf-quFk	2025-07-10 10:19:11.173	\N	\N	t	t
guest_JcUUEr7ftG70	\N	\N	\N	\N	10	2025-07-10 10:21:43.32	2025-07-10 10:21:43.353492	\N	Guest	User	D_t2WPf8bbIwX7cCsUyx5Qj1d3KbWD8l	2025-07-10 10:21:43.32	\N	\N	t	t
guest_EYSZ04dNidAc	\N	\N	\N	\N	10	2025-07-10 11:26:57.106	2025-07-10 11:26:57.141809	\N	Guest	User	KogIZpv6xW7jAfxsKioCjm5h_4e4KpIP	2025-07-10 11:26:57.106	\N	\N	t	t
guest__Q9vaWT0T0NT	\N	\N	\N	\N	10	2025-07-10 11:47:47.354	2025-07-10 11:47:47.389209	\N	Guest	User	hEvPrtfjhBvKCKtKfPs7-J8scpdcvQ_X	2025-07-10 11:47:47.354	\N	\N	t	t
guest_-PJxID3dieWk	\N	\N	\N	\N	10	2025-07-10 11:56:07.984	2025-07-10 11:56:08.018932	\N	Guest	User	NA6dCFZFX_xrw5KDkqEn3uPHWbZyJxq9	2025-07-10 11:56:07.984	\N	\N	t	t
guest_2Uly1e09WScq	\N	\N	\N	\N	10	2025-07-10 12:02:23.052	2025-07-10 12:02:23.086527	\N	Guest	User	FhVDxOOWJt6Us8Fupr3zNqCLDKAjeRS2	2025-07-10 12:02:23.052	\N	\N	t	t
guest_TXAxT4qwEcnh	\N	\N	\N	\N	10	2025-07-10 10:42:40.408	2025-07-10 10:42:40.443721	\N	Guest	User	4KRoSmO5NwAjgiyneDGYT0l2vseYZWm0	2025-07-10 10:42:43.202	\N	\N	t	t
guest__DLaxuVvX_y2	\N	\N	\N	\N	10	2025-07-10 10:49:29.145	2025-07-10 10:49:29.180254	\N	Guest	User	tLbPAya58e3WDEugbHD72eNakk72Olzn	2025-07-10 10:49:29.145	\N	\N	t	t
guest_GUQgmeVJ8SVy	\N	\N	\N	\N	10	2025-07-10 10:49:30.052	2025-07-10 10:49:30.086899	\N	Guest	User	YKETloq63Gq8k_amLx7xGGQ2h9X3iRvd	2025-07-10 10:49:30.052	\N	\N	t	t
guest_jEu42hmaZ2jf	\N	\N	\N	\N	10	2025-07-10 05:59:07.347	2025-07-10 05:59:07.380023	\N	Guest	User	3F4V0HQFXLhF9dNdNFz9xqVw1XsCPZlT	2025-07-10 06:08:13.623	\N	\N	t	t
guest_xdw5ZHpgrOfx	\N	\N	\N	\N	10	2025-07-10 07:14:36.073	2025-07-10 07:14:36.105419	\N	Guest	User	bstycTLulcVm_Jx3L5z07b_4Gb-ZrIme	2025-07-10 07:14:36.073	\N	\N	t	t
guest_acNdlnAKVOr5	\N	\N	\N	\N	10	2025-07-10 10:49:30.306	2025-07-10 10:49:30.341968	\N	Guest	User	ISrplcPV5Mjw64ZEVK-NZuUpuDuvBMGs	2025-07-10 10:49:30.306	\N	\N	t	t
guest_1W11w9xDGwYu	\N	\N	\N	\N	10	2025-07-10 10:49:32.683	2025-07-10 10:49:32.718605	\N	Guest	User	mqWIMV8go9P0yXPQb4uDXHuaS3QltGQ7	2025-07-10 10:49:32.683	\N	\N	t	t
guest_uMGTn3d0ZfoZ	\N	\N	\N	\N	10	2025-07-10 10:49:36.171	2025-07-10 10:49:36.204644	\N	Guest	User	IANb0kUWwHX0DikdUuimieFZ6qAhi9gI	2025-07-10 10:49:36.171	\N	\N	t	t
guest_RbqzBvQy_BG-	\N	\N	\N	\N	10	2025-07-10 10:49:37.077	2025-07-10 10:49:37.112214	\N	Guest	User	VDbR0UeXiIzjYu_Wvk9Q1I_oyxTwS4Aa	2025-07-10 10:49:37.077	\N	\N	t	t
guest_nwAQ535eS--d	\N	\N	\N	\N	10	2025-07-10 10:49:38.676	2025-07-10 10:49:38.711188	\N	Guest	User	nKgna1Pq7NpUo-4JSCDKqViuS0SC8Q7b	2025-07-10 10:49:38.676	\N	\N	t	t
guest_pk6gViq1si_O	\N	\N	\N	\N	10	2025-07-10 10:49:38.678	2025-07-10 10:49:38.712677	\N	Guest	User	lKEWja7UYHGlRIbBEe244PRJOpTDnBeq	2025-07-10 10:49:38.678	\N	\N	t	t
guest_o3EFje0Ezja7	\N	\N	\N	\N	10	2025-07-10 08:30:34.092	2025-07-10 08:30:34.127659	\N	Guest	User	Ch1jh6ifsZLwGB-5uABZQrIQtk8EFUtF	2025-07-10 08:30:37.398	\N	\N	t	t
guest_6TaaxEn4Wpe1	\N	\N	\N	\N	10	2025-07-10 08:51:40.509	2025-07-10 08:51:40.542246	\N	Guest	User	os5ogSIJVWYDRbJRxyUyJ-WPO1vmtIaS	2025-07-10 08:51:40.509	\N	\N	t	t
guest_SBuwQ--_-Ljc	\N	\N	\N	\N	10	2025-07-10 07:27:20.682	2025-07-10 07:27:20.717445	\N	Guest	User	E1GYi-u29BhzcmCkh2p7YFypVeA0ceQ3	2025-07-10 07:27:28.839	\N	\N	t	t
guest_8-WxaRMXk6M3	\N	\N	\N	\N	10	2025-07-10 09:04:58.117	2025-07-10 09:04:58.152749	\N	Guest	User	H99aSmRWT02XKFmEeEkmH96VcVE-sX1B	2025-07-10 09:04:58.117	\N	\N	t	t
guest_iVZNKZiNh2VA	\N	\N	\N	\N	10	2025-07-10 09:12:27.704	2025-07-10 09:12:27.73876	\N	Guest	User	zD7SrxTo7EAowcJNkX9rSKpVjCtUK50D	2025-07-10 09:12:27.704	\N	\N	t	t
guest_oaj8wfgmpk6U	\N	\N	\N	\N	10	2025-07-10 07:30:24.75	2025-07-10 07:30:24.785841	\N	Guest	User	vROeDJLejv_3Gpvwbec3y_bmORBzs_ZF	2025-07-10 07:30:24.75	\N	\N	t	t
guest_8oWd0LFchX5q	\N	\N	\N	\N	10	2025-07-10 12:46:59.087	2025-07-10 12:46:59.121644	\N	Guest	User	R39qcWLuw41PVb-GuqHchraSSvAY-Dsb	2025-07-10 12:46:59.087	\N	\N	t	t
guest_BoICCcpA90Rs	\N	\N	\N	\N	10	2025-07-10 11:12:55.531	2025-07-10 11:12:55.563691	\N	Guest	User	rQQLp7SV61Cs2bc95oMaX15TuZ6vSc_a	2025-07-10 11:12:55.531	\N	\N	t	t
guest_NJsTIEiqpqUB	\N	\N	\N	\N	10	2025-07-10 12:46:59.471	2025-07-10 12:46:59.506356	\N	Guest	User	mgoegqOx56-nVWGiUL7QAYOaijF-Is-l	2025-07-10 12:46:59.471	\N	\N	t	t
guest_Fcln8MiWrIXn	\N	\N	\N	\N	10	2025-07-10 12:46:59.847	2025-07-10 12:46:59.880793	\N	Guest	User	sW1hm4igfJzDi3Iwk3uD1mUye1XCslpu	2025-07-10 12:46:59.847	\N	\N	t	t
guest_xmFtWHknDIj7	\N	\N	\N	\N	10	2025-07-10 14:56:09.499	2025-07-10 14:56:09.53735	\N	Guest	User	FL-JiUiovk3uDE27479AS7Ot1ZqPF-CB	2025-07-10 14:56:09.499	\N	\N	t	t
guest_ae1LFzAAq8FQ	\N	\N	\N	\N	10	2025-07-10 15:14:04.342	2025-07-10 15:14:04.377353	\N	Guest	User	FVROsA0fqtHM1qxrvJgvED0i_rf40CCp	2025-07-10 15:14:04.342	\N	\N	t	t
guest_3Bt232oK9V8N	\N	\N	\N	\N	10	2025-07-10 15:26:47.818	2025-07-10 15:26:47.851962	\N	Guest	User	rbI7CFvWpj_1b_8IZSV0lKSOwEjy357V	2025-07-10 15:26:47.818	\N	\N	t	t
guest_N2bBcJur4tgV	\N	\N	\N	\N	10	2025-07-10 15:45:36.717	2025-07-10 15:45:36.751599	\N	Guest	User	vUYatmWykmyHzAmxof_3rcaYCyjFUsJY	2025-07-10 15:45:36.717	\N	\N	t	t
guest_UOIJ21FQonSZ	\N	\N	\N	\N	10	2025-07-10 15:53:51.497	2025-07-10 15:53:51.531952	\N	Guest	User	M6Z_3jjvqreeqNMqSNEpeu7QdKtYZbHx	2025-07-10 15:53:51.497	\N	\N	t	t
guest_J66s6tvaEBbD	\N	\N	\N	\N	10	2025-07-10 15:55:28.591	2025-07-10 15:55:28.625292	\N	Guest	User	cO3kJn19-ot8QM6RrBhAJLmnhIdh3RKx	2025-07-10 15:55:28.591	\N	\N	t	t
guest_m3DnVlDdiB20	\N	\N	\N	\N	10	2025-07-10 16:28:01.238	2025-07-10 16:28:01.273565	\N	Guest	User	msi08Ac98l7CM2JjXO6hbNBC37fhajXY	2025-07-10 16:28:01.238	\N	\N	t	t
guest_yQ4HGGLOIR4b	\N	\N	\N	\N	10	2025-07-10 16:28:08.887	2025-07-10 16:28:08.923306	\N	Guest	User	oo9TRNCGpwehOZmah6fdT0JMXTpTA4Kh	2025-07-10 16:28:08.887	\N	\N	t	t
guest_dKynj-CiRHA9	\N	\N	\N	\N	10	2025-07-10 16:28:32.204	2025-07-10 16:28:32.238147	\N	Guest	User	dd5LtMIk5HWN-ID6ka04V-exkxfKx-sk	2025-07-10 16:28:32.204	\N	\N	t	t
guest_1LtWALMbl2NO	\N	\N	\N	\N	10	2025-07-10 16:28:45.428	2025-07-10 16:28:45.463167	\N	Guest	User	grxkyrodsPXcpRg1r5emZ29mxAqLTtbk	2025-07-10 16:28:45.428	\N	\N	t	t
guest_s3Co7LoYOgrh	\N	\N	\N	\N	10	2025-07-10 16:41:33.216	2025-07-10 16:41:33.251194	\N	Guest	User	xqDkjlw43U43BruBqJNXsQfOhR9v_CnO	2025-07-10 16:41:33.216	\N	\N	t	t
guest_G7H0B6iXtouL	\N	\N	\N	\N	10	2025-07-10 16:41:49.436	2025-07-10 16:41:49.470511	\N	Guest	User	lzmGMNRfqXuTR76SX4ZEghDCXYlvydsh	2025-07-10 16:41:49.436	\N	\N	t	t
guest_lDU7MCp8xMqy	\N	\N	\N	\N	10	2025-07-10 16:42:28.532	2025-07-10 16:42:28.566669	\N	Guest	User	kHkQU2HlqWcg-UPjT4Rmsbkj5Pyt8qTJ	2025-07-10 16:42:28.532	\N	\N	t	t
guest_I0Q01yqsysTE	\N	\N	\N	\N	10	2025-07-10 16:42:46.314	2025-07-10 16:42:46.347894	\N	Guest	User	KylSfbhEtRWxRG0w71E8M4htKkKqCpoL	2025-07-10 16:42:46.314	\N	\N	t	t
guest_ZGmmTHQtHH5F	\N	\N	\N	\N	10	2025-07-10 17:47:54.731	2025-07-10 17:47:54.766343	\N	Guest	User	jAskDJWZifRzULJ2tTyL_8n2-9l-33st	2025-07-10 17:47:54.731	\N	\N	t	t
guest_980awl0f5o3N	\N	\N	\N	\N	10	2025-07-10 17:47:56.982	2025-07-10 17:47:57.017764	\N	Guest	User	YAgdquSSgM9TqvS-3XKlbJZT1qv9un75	2025-07-10 17:47:56.982	\N	\N	t	t
guest_HIvCSp9mb7ss	\N	\N	\N	\N	10	2025-07-10 17:43:30.666	2025-07-10 17:43:30.76936	\N	Guest	User	2pBGSwi-ErtJD9HiDmAdD4-EB575h-XH	2025-07-11 12:15:09.057	\N	\N	t	t
guest_tdEwB-74O_4e	\N	\N	\N	\N	10	2025-07-10 17:48:15.28	2025-07-10 17:48:15.315758	\N	Guest	User	bvAHeqJYYLbG4ApXrcpzDL9Ytc4z3A2K	2025-07-10 17:48:15.28	\N	\N	t	t
guest_KaIDPIrBwJ2z	\N	\N	\N	\N	10	2025-07-10 12:47:29.573	2025-07-10 12:47:29.60774	\N	Guest	User	D99biD9H4bOsllP9qnX2YNMdZletBX3-	2025-07-11 12:11:28.889	\N	\N	t	t
guest_8FGZiViPqnHz	\N	\N	\N	\N	10	2025-07-10 17:30:08.273	2025-07-10 17:30:08.30762	\N	Guest	User	-32xQ4A6AyMymXKfLoBL7xOvjMExH7BE	2025-07-10 17:30:08.273	\N	\N	t	t
guest_oTMQnOC8WENh	\N	\N	\N	\N	10	2025-07-10 17:43:31.388	2025-07-10 17:43:31.472813	\N	Guest	User	rD9Hm5x1lYtTLRchNgRd-wzEdEhLpodA	2025-07-10 17:43:31.388	\N	\N	t	t
guest_Co5mLICFcqJm	\N	\N	\N	\N	10	2025-07-10 17:48:20.983	2025-07-10 17:48:21.017728	\N	Guest	User	yLn6XUELZPbpban5o3mLRPL_mDjan0bd	2025-07-10 17:48:20.983	\N	\N	t	t
guest_5NxB1FYaeFGC	\N	\N	\N	\N	10	2025-07-10 18:04:35.501	2025-07-10 18:04:35.536274	\N	Guest	User	m4l58fTT57vYCRnWWuIafKMPDjd5XKQ7	2025-07-11 01:11:10.044	\N	\N	t	t
guest_Ha4tQjmQbvpb	\N	\N	\N	\N	10	2025-07-10 17:47:00.375	2025-07-10 17:47:00.41036	\N	Guest	User	phOdzmNaWpDY8HLKfYWg5NLfTzYVqHP6	2025-07-10 17:47:00.375	\N	\N	t	t
guest_zoyfZh04x7zd	\N	\N	\N	\N	10	2025-07-10 14:18:33.607	2025-07-10 14:18:33.640227	\N	Guest	User	FyBwzds5DOGZiCmM85Mreh_1Qmt01dJi	2025-07-10 14:18:33.607	\N	\N	t	t
guest_Nn5jCBhBiMHS	\N	\N	\N	\N	10	2025-07-10 14:18:35.337	2025-07-10 14:18:35.37046	\N	Guest	User	-A6nHMxVXadQkQVIxYDFeLzycC0nFE8B	2025-07-10 14:18:35.337	\N	\N	t	t
guest_IbPYiD_U0htt	\N	\N	\N	\N	10	2025-07-10 14:18:49.434	2025-07-10 14:18:49.467669	\N	Guest	User	B6XcDQtfEuqOIvQmCrTwHVEa1ErqTvOe	2025-07-10 14:18:49.434	\N	\N	t	t
guest_eQ32mr5PtR_W	\N	\N	\N	\N	10	2025-07-10 14:18:54.118	2025-07-10 14:18:54.153723	\N	Guest	User	7zHJAoOPXBSySJ7KFFGiO42AtqD026wL	2025-07-10 14:18:54.118	\N	\N	t	t
guest_WF9kKWmb-D0A	\N	\N	\N	\N	10	2025-07-10 17:46:14.078	2025-07-10 17:46:14.112794	\N	Guest	User	gAzt2Lzt1EfoXppwfbMC7RYi0Od6KNbq	2025-07-10 17:46:14.078	\N	\N	t	t
guest_fPoFwlB7UU1y	\N	\N	\N	\N	10	2025-07-10 14:42:57.632	2025-07-10 14:42:57.666448	\N	Guest	User	0hJxGEk91NrFrEf9F8PZgvf-OUq2_Skg	2025-07-10 14:42:57.632	\N	\N	t	t
guest_4CdQgvv69_Ed	\N	\N	\N	\N	10	2025-07-10 12:54:41.038	2025-07-10 12:54:41.072878	\N	Guest	User	csCKdsH6ZCfcYbVFCVUTu3ZZjpfv1r48	2025-07-10 19:23:00.252	\N	\N	t	t
guest_w_C9QOQrCSxV	\N	\N	\N	\N	10	2025-07-10 18:33:42.984	2025-07-10 18:33:43.018904	\N	Guest	User	7NpDIlQ-82MyCIuYEkHhzK6_yNPjASC9	2025-07-10 22:27:20.369	\N	\N	t	t
guest_Z1mZvvRwZZf1	\N	\N	\N	\N	10	2025-07-10 21:08:35.695	2025-07-10 21:08:35.730486	\N	Guest	User	62TUbYvoB66DMskhyQyJtuHkSzhu3r38	2025-07-10 21:08:35.695	\N	\N	t	t
guest_vreRFaq0garl	\N	\N	\N	\N	10	2025-07-10 19:04:45.446	2025-07-10 19:04:45.48098	\N	Guest	User	4japaB6IOhI73dwhnW33ePVBjjS5qocB	2025-07-10 19:04:45.446	\N	\N	t	t
guest_I9h7y95HvCSc	\N	\N	\N	\N	10	2025-07-10 19:04:45.757	2025-07-10 19:04:45.793236	\N	Guest	User	X88RFo-RpXEApb9LXits10qLHiEW4EaF	2025-07-10 19:04:45.757	\N	\N	t	t
guest__s8MfrWJfYcS	\N	\N	\N	\N	10	2025-07-10 19:09:19.972	2025-07-10 19:09:20.006516	\N	Guest	User	nyjsnBx7vzViKp9uQ1RejQZiCPT31jtU	2025-07-10 19:09:19.972	\N	\N	t	t
guest_Mas4Yn-j2JQj	\N	\N	\N	\N	10	2025-07-10 19:10:29.926	2025-07-10 19:10:29.958445	\N	Guest	User	uVNNx0C0NQrNoQxlN-wm1AoERMBeTzTl	2025-07-10 19:10:29.926	\N	\N	t	t
guest_DRbGEW2Mmjlq	\N	\N	\N	\N	10	2025-07-10 19:13:18.803	2025-07-10 19:13:18.83425	\N	Guest	User	8MQEg5ljPYXoBpxjmyIayk_Tfb54vKQx	2025-07-10 19:13:18.803	\N	\N	t	t
guest_zYsftr25IQVo	\N	\N	\N	\N	10	2025-07-10 19:37:29.523	2025-07-10 19:37:29.558635	\N	Guest	User	SO9YknBVyWLy_Wd_YciQB-iYZ4ECn66f	2025-07-10 19:37:29.523	\N	\N	t	t
guest_2Qi-2KPrvfF4	\N	\N	\N	\N	10	2025-07-10 19:37:30.93	2025-07-10 19:37:30.965757	\N	Guest	User	cqiF7nBmoAC6m49T7qeU5X8AJjRHiTmM	2025-07-10 19:37:30.93	\N	\N	t	t
guest_kwvG5S2hQxz9	\N	\N	\N	\N	10	2025-07-10 19:37:32.272	2025-07-10 19:37:32.307897	\N	Guest	User	S-Gi3rak6tfXNgdEX6W1EopXdtU3YuyU	2025-07-10 19:37:32.272	\N	\N	t	t
guest_IYsHBF5FE3W2	\N	\N	\N	\N	10	2025-07-10 19:37:33.166	2025-07-10 19:37:33.202146	\N	Guest	User	k2-n8DmBvR52CJCY7460eOTLCPK6ZXaE	2025-07-10 19:37:33.166	\N	\N	t	t
guest_200jZdYHwped	\N	\N	\N	\N	10	2025-07-10 19:37:34.416	2025-07-10 19:37:34.45018	\N	Guest	User	gOFK-l58ZwJAM83K0EA4oF5yXzvuwoOU	2025-07-10 19:37:34.416	\N	\N	t	t
guest_DG6QXNSLyy9Q	\N	\N	\N	\N	10	2025-07-10 19:37:35.674	2025-07-10 19:37:35.708913	\N	Guest	User	nXCWqDkBvmsODvnDNHzfczt8ql2mP1G7	2025-07-10 19:37:35.674	\N	\N	t	t
guest_-YPgLIelhApe	\N	\N	\N	\N	10	2025-07-10 19:37:51.601	2025-07-10 19:37:51.636802	\N	Guest	User	OlxVS5C2bOb3hoAn7dCsqnRqh1Dt0-W5	2025-07-10 19:37:51.601	\N	\N	t	t
guest_iwO1A3GChPZ7	\N	\N	\N	\N	10	2025-07-10 19:37:56.276	2025-07-10 19:37:56.309975	\N	Guest	User	u9dm9wS23YNR2qR3g_ydMTUuKOUaXl6x	2025-07-10 19:37:56.276	\N	\N	t	t
guest_b4f9nzoz7qJK	\N	\N	\N	\N	10	2025-07-10 19:37:57.198	2025-07-10 19:37:57.49343	\N	Guest	User	bcsLw7B4A_c7TfueV8y6azIXt9dRLKli	2025-07-10 19:37:57.198	\N	\N	t	t
guest_0o0Fzd_-Lpo4	\N	\N	\N	\N	10	2025-07-10 19:37:58.292	2025-07-10 19:37:58.325773	\N	Guest	User	vHwdg8YeMM-aSHHCv3Yh7V04idQnb7wl	2025-07-10 19:37:58.292	\N	\N	t	t
guest_YIjHorXHErzY	\N	\N	\N	\N	10	2025-07-10 19:37:59.382	2025-07-10 19:37:59.41453	\N	Guest	User	nD_ULcBbRaJyBaS1PaI-4eLMLZxakjIE	2025-07-10 19:37:59.382	\N	\N	t	t
guest_SfHXoZozf7eu	\N	\N	\N	\N	10	2025-07-10 19:38:00.61	2025-07-10 19:38:00.644284	\N	Guest	User	h1p2ln5msL9WeEgMOPFpE93Hj7oPGcQY	2025-07-10 19:38:00.61	\N	\N	t	t
guest_5WVicABbwf3H	\N	\N	\N	\N	10	2025-07-10 19:38:01.932	2025-07-10 19:38:01.974543	\N	Guest	User	8myNfXpo0T3fh88p0wmUmXSMLHWQ07fQ	2025-07-10 19:38:01.932	\N	\N	t	t
guest_bGL_WBTZk7BA	\N	\N	\N	\N	10	2025-07-10 19:38:02.811	2025-07-10 19:38:02.846392	\N	Guest	User	EfjJoDU_Fw2O2pc4F2UFWpUOKOBrLv6X	2025-07-10 19:38:02.811	\N	\N	t	t
guest_TKE5FZ07wD1G	\N	\N	\N	\N	10	2025-07-10 19:38:04.336	2025-07-10 19:38:04.370087	\N	Guest	User	Cg7C8xPBkyun_-4T-Wd7oD8U27FFdZW1	2025-07-10 19:38:04.336	\N	\N	t	t
guest_YRyfG85G3KIx	\N	\N	\N	\N	10	2025-07-10 19:38:05.165	2025-07-10 19:38:05.199812	\N	Guest	User	9KtTnv6It_QUhcCpQ5LW3ouuyGbHFnSd	2025-07-10 19:38:05.165	\N	\N	t	t
guest_hLJvbhw54DBo	\N	\N	\N	\N	10	2025-07-10 19:38:06.408	2025-07-10 19:38:06.442262	\N	Guest	User	ku8nHYV-mCvjytrrqp-03rvR2MS8sReB	2025-07-10 19:38:06.408	\N	\N	t	t
guest_GA5btpMtx-cc	\N	\N	\N	\N	10	2025-07-10 19:38:07.25	2025-07-10 19:38:07.285051	\N	Guest	User	jtAH6vHSNsrX6_zWhuURjHRMRFOeNfs7	2025-07-10 19:38:07.25	\N	\N	t	t
guest_SyhUlce8aMhP	\N	\N	\N	\N	10	2025-07-10 19:38:08.351	2025-07-10 19:38:08.383239	\N	Guest	User	IM1hfHk2GUNuePMDBTy0OFIqejjw6MAR	2025-07-10 19:38:08.351	\N	\N	t	t
guest_u3tS0WG03mGC	\N	\N	\N	\N	10	2025-07-10 19:38:09.179	2025-07-10 19:38:09.211597	\N	Guest	User	DHK3jfZTF7GLbMS-EynBhbA_yAUF34LB	2025-07-10 19:38:09.179	\N	\N	t	t
guest_HVECfr8bq39E	\N	\N	\N	\N	10	2025-07-10 19:38:10.318	2025-07-10 19:38:10.58291	\N	Guest	User	ZqemsiKM4agNBWRPGKa2uY5Lyj-tvCwP	2025-07-10 19:38:10.318	\N	\N	t	t
guest_29lI5whxnZam	\N	\N	\N	\N	10	2025-07-10 19:38:11.804	2025-07-10 19:38:11.839332	\N	Guest	User	ivW6qOdFY4gRk3ALb5tmD53J9JyQURwl	2025-07-10 19:38:11.804	\N	\N	t	t
guest_EYz5FPUEXf5K	\N	\N	\N	\N	10	2025-07-10 19:38:12.597	2025-07-10 19:38:12.632584	\N	Guest	User	8B5Kft6Zliu4J1wlJtOfB6HRVLj_2C-0	2025-07-10 19:38:12.597	\N	\N	t	t
guest_LBfPt4Cj0rq3	\N	\N	\N	\N	10	2025-07-10 19:38:13.808	2025-07-10 19:38:13.842869	\N	Guest	User	HQBplT8LlFddqXE3uD0BiDK2mH2ng0_m	2025-07-10 19:38:13.808	\N	\N	t	t
guest_-Lj6W7Seg1kC	\N	\N	\N	\N	10	2025-07-10 19:38:14.499	2025-07-10 19:38:14.533187	\N	Guest	User	Fv4k9TABXHKByhED9e9UHqJah816SIVQ	2025-07-10 19:38:14.499	\N	\N	t	t
guest_Y7vRESWBgzUZ	\N	\N	\N	\N	10	2025-07-10 19:38:15.304	2025-07-10 19:38:15.337826	\N	Guest	User	bzSUCvHGGurExTJpP6rjFBe-_52z1Cfi	2025-07-10 19:38:15.304	\N	\N	t	t
guest_fU-xquhN28EO	\N	\N	\N	\N	10	2025-07-10 19:38:17.019	2025-07-10 19:38:17.071965	\N	Guest	User	zi6Fum43c8mN8Va7bDxcqL78XcI_fTqS	2025-07-10 19:38:17.019	\N	\N	t	t
guest_PaAlGIBlSmqw	\N	\N	\N	\N	10	2025-07-10 19:38:18.712	2025-07-10 19:38:18.746854	\N	Guest	User	skDDyaAQbv67jw-snWNVfRCvX0gnJIMJ	2025-07-10 19:38:18.712	\N	\N	t	t
guest_AsZ1oppsFnTJ	\N	\N	\N	\N	10	2025-07-10 19:38:19.759	2025-07-10 19:38:19.793094	\N	Guest	User	ifkuZJqhzUvCmyz3Vpfpn5cJoGwQ00Tk	2025-07-10 19:38:19.759	\N	\N	t	t
guest_5EwEtKWAbolP	\N	\N	\N	\N	10	2025-07-10 19:38:33.595	2025-07-10 19:38:33.631374	\N	Guest	User	EslLqtidHf0OKFtQLyaBhD0T3KkQCibn	2025-07-10 19:38:33.595	\N	\N	t	t
guest_r9jwWRpSosPa	\N	\N	\N	\N	10	2025-07-10 19:38:34.294	2025-07-10 19:38:34.328977	\N	Guest	User	ZLxwP2lG7sJVHKqI6VlYLVCKig_bOm0y	2025-07-10 19:38:34.294	\N	\N	t	t
guest_qmJtCI0vgnVQ	\N	\N	\N	\N	10	2025-07-10 19:38:35.553	2025-07-10 19:38:35.587486	\N	Guest	User	tgrdaYf70aFnl_mLPh5K8PJjPusN1KDi	2025-07-10 19:38:35.553	\N	\N	t	t
guest_Y6BLrRKkVSO3	\N	\N	\N	\N	10	2025-07-10 19:38:36.782	2025-07-10 19:38:36.817991	\N	Guest	User	bJ3Qtzx8rY8f7VjVjgU5nuIunebEOwSI	2025-07-10 19:38:36.782	\N	\N	t	t
guest_obBFw_EHNIxU	\N	\N	\N	\N	10	2025-07-10 19:38:37.85	2025-07-10 19:38:37.885796	\N	Guest	User	YOtZ05-AZ6pkeUjd0-7eNT84K6uFBEvO	2025-07-10 19:38:37.85	\N	\N	t	t
guest_5vDEoQKl25T-	\N	\N	\N	\N	10	2025-07-10 19:38:38.681	2025-07-10 19:38:38.716661	\N	Guest	User	TxU-Tu8Sj9ao4hPkGcQoQ48qImYqv7sc	2025-07-10 19:38:38.681	\N	\N	t	t
guest_BMHTLqOHH7EP	\N	\N	\N	\N	10	2025-07-10 19:38:39.548	2025-07-10 19:38:39.586092	\N	Guest	User	9jr8bKQ6-oLnkL599rdB5P3XO56Bgbsf	2025-07-10 19:38:39.548	\N	\N	t	t
guest_t7yWhnKQkOgX	\N	\N	\N	\N	10	2025-07-10 19:38:40.824	2025-07-10 19:38:40.85913	\N	Guest	User	48V9X4bmYFk_TLjooLKThfERqvoUi7oJ	2025-07-10 19:38:40.824	\N	\N	t	t
guest_x-8fjmA5UgjZ	\N	\N	\N	\N	10	2025-07-10 19:38:42.993	2025-07-10 19:38:43.028543	\N	Guest	User	n0gxFFMBMdaKOCkuVTXw-ltLNrIagVnn	2025-07-10 19:38:42.993	\N	\N	t	t
guest_hjrJHLL7mmRb	\N	\N	\N	\N	10	2025-07-10 19:38:44.259	2025-07-10 19:38:44.294505	\N	Guest	User	Ke7qDr9cnDY81Z8kstZ6oZq2igBeTx6x	2025-07-10 19:38:44.259	\N	\N	t	t
guest_XBim42dinSxD	\N	\N	\N	\N	10	2025-07-10 19:38:46.196	2025-07-10 19:38:46.231565	\N	Guest	User	KcM3_Md30CTLfO1W8LXTxO1lHYAJ-nyZ	2025-07-10 19:38:46.196	\N	\N	t	t
guest_CCstzqEMvfCW	\N	\N	\N	\N	10	2025-07-10 19:38:47.832	2025-07-10 19:38:47.867552	\N	Guest	User	JGi4mUSJP6dbaRgzAVJMePsUBHGJduun	2025-07-10 19:38:47.832	\N	\N	t	t
guest_7l2g6BNj6NIO	\N	\N	\N	\N	10	2025-07-10 19:38:49.065	2025-07-10 19:38:49.100199	\N	Guest	User	mJv_noWnjh4-kMGUzl150ENkZJZcT8ir	2025-07-10 19:38:49.065	\N	\N	t	t
guest_Q_0jebHWZcK9	\N	\N	\N	\N	10	2025-07-10 19:38:49.899	2025-07-10 19:38:49.934648	\N	Guest	User	9iQKaEAg4XNmYx9kj1PK1xgqePNtY-q6	2025-07-10 19:38:49.899	\N	\N	t	t
guest_In-sNLh-wmbi	\N	\N	\N	\N	10	2025-07-10 20:16:56.202	2025-07-10 20:16:56.237094	\N	Guest	User	BISgQT5Iy3YWzRrmzLSgx-MkNP5vJuoD	2025-07-11 01:34:49.157	\N	\N	t	t
guest_JuZWBppOCt2q	\N	\N	\N	\N	10	2025-07-10 21:17:20.255	2025-07-10 21:17:20.290933	\N	Guest	User	lAd8KE07z-7tQxUY9aHyk0VTACyFy1DI	2025-07-10 21:17:20.255	\N	\N	t	t
guest_fsVzQ6RPe7RT	\N	\N	\N	\N	10	2025-07-10 20:39:22.596	2025-07-10 20:39:22.631441	\N	Guest	User	ZkP9H2RFdrtCOkGJKadwBzeLFBXI09HK	2025-07-10 20:39:22.596	\N	\N	t	t
guest_oTzD9qkSfH3U	\N	\N	\N	\N	10	2025-07-10 21:50:55.507	2025-07-10 21:50:55.542313	\N	Guest	User	6dn1xr1DKtkj9_ysOjspW_GsefymelzI	2025-07-10 21:50:55.507	\N	\N	t	t
guest_FpMlLzjwoxK4	\N	\N	\N	\N	10	2025-07-10 21:57:26.267	2025-07-10 21:57:26.302719	\N	Guest	User	iUFVsjtOpgQ0y1gOC--sziAe6fhliPtt	2025-07-10 21:57:26.267	\N	\N	t	t
guest_M0A2TZxNVdb6	\N	\N	\N	\N	10	2025-07-11 03:29:14.856	2025-07-11 03:29:16.798564	\N	Guest	User	5uuMA7q9DfvGuWjxmlCznULUyguia3Hx	2025-07-11 03:31:55.699	\N	\N	t	t
guest_enH30NTBJVH7	\N	\N	\N	\N	10	2025-07-10 22:42:09.922	2025-07-10 22:42:09.957332	\N	Guest	User	d5mDED6aSJqy-5gLMWkIFdKS-ATX_sng	2025-07-10 22:42:09.922	\N	\N	t	t
guest_Zy3hc8EMzFIM	\N	\N	\N	\N	10	2025-07-10 22:55:00.62	2025-07-10 22:55:00.655551	\N	Guest	User	mmPsOpwza36B0ncitVfQI6kJdRVBI_mG	2025-07-10 22:55:00.62	\N	\N	t	t
guest_eQLUp6ahz4WZ	\N	\N	\N	\N	10	2025-07-10 22:56:40.271	2025-07-10 22:56:40.306262	\N	Guest	User	5rBb7z_b0L4IPe2cXQZUK2AMqG3OwRBU	2025-07-10 22:56:40.271	\N	\N	t	t
guest_bKz2U8pJ-NQ4	\N	\N	\N	\N	10	2025-07-10 23:14:37.789	2025-07-10 23:14:37.823488	\N	Guest	User	pH0KmAlmEBpv6FJKwMLpeyFkKb6SxeZW	2025-07-10 23:14:37.79	\N	\N	t	t
guest_ZPBNwaWpKLfK	\N	\N	\N	\N	10	2025-07-10 23:27:24.402	2025-07-10 23:27:24.435604	\N	Guest	User	jrq78X6rCSylTD2pFwwfkriq7WwfBdFx	2025-07-10 23:27:24.402	\N	\N	t	t
guest_rtxKJ9DUXCX4	\N	\N	\N	\N	10	2025-07-10 23:49:02.767	2025-07-10 23:49:02.803451	\N	Guest	User	vfhOmYGpYQT6mXeIkHbAJRsjP1n4r-wh	2025-07-10 23:49:02.767	\N	\N	t	t
guest_i9XH5xAKBztY	\N	\N	\N	\N	10	2025-07-10 23:53:00.641	2025-07-10 23:53:00.674669	\N	Guest	User	yT-_RS2ciyGiyt0sF--SWzn328sbfutI	2025-07-10 23:53:00.641	\N	\N	t	t
guest_IHxzlzvSzPFM	\N	\N	\N	\N	10	2025-07-11 01:04:04.342	2025-07-11 01:04:05.564138	\N	Guest	User	ImFFrZ5eZwPKjGGaJtHRTuYedC0XnA77	2025-07-11 01:42:45.421	\N	\N	t	t
guest_CTx3cFALVZUc	\N	\N	\N	\N	10	2025-07-11 02:02:03.488	2025-07-11 02:02:03.523427	\N	Guest	User	be1ull1Xeu-bYlCLSDQSkT5NlJzJpMXM	2025-07-11 02:02:03.488	\N	\N	t	t
guest_WI4ZkHtl3EZW	\N	\N	\N	\N	10	2025-07-11 02:15:46.464	2025-07-11 02:15:46.497708	\N	Guest	User	Ibsvzvs8aa9IuBwiQglN5UxUwgmMR68g	2025-07-11 02:15:46.464	\N	\N	t	t
guest_YnTaHDB1BHB1	\N	\N	\N	\N	10	2025-07-11 02:17:57.035	2025-07-11 02:17:57.067752	\N	Guest	User	vL9Zrj245b-44iNHU7zuGEOa8fZf-Wqz	2025-07-11 02:17:57.035	\N	\N	t	t
guest_9MHwP2k9M2JP	\N	\N	\N	\N	10	2025-07-11 02:17:57.494	2025-07-11 02:17:57.526734	\N	Guest	User	uwE6QO2e_pgBDABr5WG9s6j_7GOsd3ty	2025-07-11 02:17:57.494	\N	\N	t	t
guest_4ighCSbKthpx	\N	\N	\N	\N	10	2025-07-11 05:18:43.625	2025-07-11 05:18:43.659968	\N	Guest	User	yqP7HAy3VyT-UuHHi1lypnljGINo3cFN	2025-07-11 05:18:43.625	\N	\N	t	t
guest_lspqHCcv4nPS	\N	\N	\N	\N	10	2025-07-11 00:29:52.982	2025-07-11 00:29:53.017817	\N	Guest	User	gVMNhc5R8jNwb4CXHBXrICVGbuYhepK3	2025-07-11 02:58:34.572	\N	\N	t	t
guest_cW19Pg12O8Cf	\N	\N	\N	\N	10	2025-07-11 01:40:27.358	2025-07-11 01:40:27.393251	\N	Guest	User	iJHgASsI2PzkVrXaqKQ4dwinq3w6I6T-	2025-07-11 03:02:45.575	\N	\N	t	t
guest_KfGfHxxvt7tf	\N	\N	\N	\N	10	2025-07-11 03:22:03.419	2025-07-11 03:22:03.458145	\N	Guest	User	J1A_v0pSF9kGOTmp4kSBeRvJhm7uYWZH	2025-07-11 03:22:03.419	\N	\N	t	t
guest_GC4P9I9eP6N-	\N	\N	\N	\N	10	2025-07-11 03:22:07.668	2025-07-11 03:22:07.702265	\N	Guest	User	VSGbtsnoZ2xQaA0uBFzhFJ1dfOhZ89aF	2025-07-11 03:22:07.668	\N	\N	t	t
guest_haCFgArMrOC3	\N	\N	\N	\N	10	2025-07-11 03:25:14.848	2025-07-11 03:25:14.883898	\N	Guest	User	ZRQlKzIreIcO2a9odOHGL1LGw-6xlfvm	2025-07-11 03:25:14.848	\N	\N	t	t
guest_0fIXsq84YIE9	\N	\N	\N	\N	10	2025-07-11 04:34:06.311	2025-07-11 04:34:08.295279	\N	Guest	User	MiTdMPBtOPE02P1pZrFfplGDzuhU8sqP	2025-07-11 04:38:07.496	\N	\N	t	t
guest_Kzv9gsMfWyP9	\N	\N	\N	\N	10	2025-07-11 04:38:31.92	2025-07-11 04:38:31.954271	\N	Guest	User	-QIjudPQWY4xPjQ95m1XD_KeVV1gmhuz	2025-07-11 04:38:31.92	\N	\N	t	t
guest_dU_YqhJmboQE	\N	\N	\N	\N	10	2025-07-11 03:32:10.707	2025-07-11 03:32:12.66454	\N	Guest	User	vV6_mwZeHQKE66mHL2kSL-9fC_Kt8yBa	2025-07-11 03:47:54.596	\N	\N	t	t
guest_bHZ5rk12Iiub	\N	\N	\N	\N	10	2025-07-11 01:34:43.997	2025-07-11 01:34:44.032339	\N	Guest	User	cyYqdbXYCy0ooV2YTCO29rkw8vjtE0Rc	2025-07-11 01:34:43.997	\N	\N	t	t
guest_Za8zf9iOK_ig	\N	\N	\N	\N	10	2025-07-11 03:57:57.238	2025-07-11 03:57:57.270542	\N	Guest	User	0oyciM9wkuEgexWaIsfChjqgcrI1oBMD	2025-07-11 03:57:57.238	\N	\N	t	t
guest_2OaWPPASuOYK	\N	\N	\N	\N	10	2025-07-11 04:01:57.612	2025-07-11 04:01:57.647389	\N	Guest	User	hOPtshqqjDBe5YBbjX0mUP3F6Yok_QCe	2025-07-11 04:01:57.612	\N	\N	t	t
guest_ijzptVRj1Gq0	\N	\N	\N	\N	10	2025-07-11 04:13:08.795	2025-07-11 04:13:10.7508	\N	Guest	User	Msdx5fD_24XbNV4fXQILPEEzOvGhQtDz	2025-07-11 04:13:10.496	\N	\N	t	t
guest_WCeElXIwuWcP	\N	\N	\N	\N	10	2025-07-10 22:18:02.337	2025-07-10 22:18:02.377385	\N	Guest	User	jsKa4m6lLiKw-YB9z9bcepzbCjMXC5cJ	2025-07-11 00:23:36.919	\N	\N	t	t
guest_V0FfyffBXI72	\N	\N	\N	\N	10	2025-07-11 05:20:38.788	2025-07-11 05:20:40.75224	\N	Guest	User	K2f9_cIhYFd5BvoIBwa67vDnB5yZ4BSk	2025-07-11 05:20:45.972	\N	\N	t	t
guest_QzFmzgt31f9K	\N	\N	\N	\N	10	2025-07-11 01:35:05.185	2025-07-11 01:35:05.219837	\N	Guest	User	36X3JRy2nDsG105XTg0L-b5PoenF1v5Q	2025-07-11 01:35:05.185	\N	\N	t	t
guest_3lj4Wgq12H6x	\N	\N	\N	\N	10	2025-07-11 05:18:46.316	2025-07-11 05:18:46.350919	\N	Guest	User	VqY5oEyZoY1pSaOsJCbbDqIKKK6Gx9tw	2025-07-11 05:18:46.316	\N	\N	t	t
guest_QyAv-QqP0wXS	\N	\N	\N	\N	10	2025-07-11 04:41:44.531	2025-07-11 04:41:46.488663	\N	Guest	User	la3nrhKN-7hnS8exF-AhUWZ9Bi2_a5Hr	2025-07-11 04:53:11.077	\N	\N	t	t
guest_TTN46CEL0bMp	\N	\N	\N	\N	10	2025-07-11 04:13:09.148	2025-07-11 04:13:11.115617	\N	Guest	User	BCVzDB7RAUDHeqnEkRwsAzAQQEOWfo9K	2025-07-11 04:33:25.507	\N	\N	t	t
guest_wDyQwANT4n3l	\N	\N	\N	\N	10	2025-07-11 04:34:04.8	2025-07-11 04:34:06.753428	\N	Guest	User	Ny5M4graXmbTcHV_d_2-q1zf9y36lBy-	2025-07-11 04:34:04.8	\N	\N	t	t
guest_anmWCv18KpZu	\N	\N	\N	\N	10	2025-07-11 04:54:22.797	2025-07-11 04:54:24.764205	\N	Guest	User	iukFkJt0t0QYhsUvMAJtw16hO8qL7S9l	2025-07-11 05:18:55.798	\N	\N	t	t
guest_R9Qsmm6p1dwF	\N	\N	\N	\N	10	2025-07-11 04:34:05.299	2025-07-11 04:34:08.043518	\N	Guest	User	ST7iQwn8mKkkE0Nobahx7dsMtBT9nfeu	2025-07-11 04:34:05.299	\N	\N	t	t
guest_y-HEISVabx2R	\N	\N	\N	\N	10	2025-07-11 05:09:48.264	2025-07-11 05:09:48.298713	\N	Guest	User	JtPYnU76xeIhiBMPJIBv_SuzWcG2kCeM	2025-07-11 05:09:48.264	\N	\N	t	t
guest_prHZjeem2uyl	\N	\N	\N	\N	10	2025-07-11 05:30:01.724	2025-07-11 05:30:03.701712	\N	Guest	User	vg0Ad1lNIWmssyQWBM7s5f2hPPqkYEyI	2025-07-11 05:30:27.621	\N	\N	t	t
guest_PV2dq1FC51Fy	\N	\N	\N	\N	10	2025-07-11 05:33:18.636	2025-07-11 05:33:18.670658	\N	Guest	User	GZ8cRm1BXsRdxPPAsByL4fwYPF57x_08	2025-07-11 05:33:18.636	\N	\N	t	t
guest_koC_nr_nzQVG	\N	\N	\N	\N	10	2025-07-11 05:33:20.099	2025-07-11 05:33:20.134223	\N	Guest	User	PFeFe-s2dcAAARJwmYi1Vdh5ZfweQfYy	2025-07-11 05:33:20.099	\N	\N	t	t
guest_IOu8rBWWNl4A	\N	\N	\N	\N	10	2025-07-11 05:33:22.589	2025-07-11 05:33:22.62388	\N	Guest	User	0kMJQoi5xS_cKhFa6vC9xJ_OV9dCOa8z	2025-07-11 05:33:22.589	\N	\N	t	t
guest_GxLzNabaNGhp	\N	\N	\N	\N	10	2025-07-11 05:26:24.339	2025-07-11 05:26:26.295914	\N	Guest	User	2W4MHi6cBpUGls9ys_Q1m9al0z2uzKXX	2025-07-11 05:27:01.166	\N	\N	t	t
guest_NEYhb5m-_NOb	\N	\N	\N	\N	10	2025-07-11 05:30:01.409	2025-07-11 05:30:03.400765	\N	Guest	User	mGP3j3qkLmnZVdY2MCQmYdrEtATyQZkw	2025-07-11 05:30:03.131	\N	\N	t	t
guest_5wRQyp3Td8zH	\N	\N	\N	\N	10	2025-07-11 05:33:24.967	2025-07-11 05:33:25.006928	\N	Guest	User	WsUKH-Fk11aU3wdeZoSy6Q6W3RVhq7xl	2025-07-11 05:33:24.967	\N	\N	t	t
guest_sfX8G_Eo8W7N	\N	\N	\N	\N	10	2025-07-11 05:33:27.531	2025-07-11 05:33:27.566464	\N	Guest	User	iFiwe8F5Jt0olNPaYQc4xBGCmPWVQqKl	2025-07-11 05:33:27.531	\N	\N	t	t
guest_zv85pJ5kHFv-	\N	\N	\N	\N	10	2025-07-11 05:33:30.1	2025-07-11 05:33:30.13567	\N	Guest	User	8YBUq131yFCeo6PUfHB_KYhsK4pVLFnd	2025-07-11 05:33:30.1	\N	\N	t	t
guest_USha-EDmITTr	\N	\N	\N	\N	10	2025-07-11 05:33:32.513	2025-07-11 05:33:32.548338	\N	Guest	User	XDJ2YHlUonix059KNizhwdqQCud0tPco	2025-07-11 05:33:32.513	\N	\N	t	t
guest_D0mWwigHgl7M	\N	\N	\N	\N	10	2025-07-11 05:33:34.937	2025-07-11 05:33:34.972268	\N	Guest	User	AAbAjQ5FcRmVEhhD3fTolscpERrdjCNN	2025-07-11 05:33:34.937	\N	\N	t	t
guest_OdWCXTAcwqrp	\N	\N	\N	\N	10	2025-07-11 05:33:37.361	2025-07-11 05:33:37.396248	\N	Guest	User	zf31Eom6-SaYbm3_Qxh69bt0MxMnw_9A	2025-07-11 05:33:37.361	\N	\N	t	t
guest_aCwx8h05su1Q	\N	\N	\N	\N	10	2025-07-11 05:33:39.739	2025-07-11 05:33:39.77306	\N	Guest	User	Fsg5QywtjxDDdd8aV6Cg6GUkJSB41ijG	2025-07-11 05:33:39.739	\N	\N	t	t
guest_rX9MsUeMP3Ri	\N	\N	\N	\N	10	2025-07-11 05:33:42.231	2025-07-11 05:33:42.265948	\N	Guest	User	Nk3HXPZx6pZHsh7BH7RiTaiupdm9eC8W	2025-07-11 05:33:42.231	\N	\N	t	t
guest_5NGH2Z1pHwRX	\N	\N	\N	\N	10	2025-07-11 05:33:44.528	2025-07-11 05:33:44.56322	\N	Guest	User	A6Bxrs9NiXuDsKWbBw138gQP_1qBDmTd	2025-07-11 05:33:44.528	\N	\N	t	t
guest_IMR6coK4KRYA	\N	\N	\N	\N	10	2025-07-11 05:33:46.815	2025-07-11 05:33:46.849784	\N	Guest	User	1w26-su_vXnteSktyA6r4ZcxMdtzm0H7	2025-07-11 05:33:46.815	\N	\N	t	t
guest_3tX7RiAGq2b6	\N	\N	\N	\N	10	2025-07-11 05:33:49.257	2025-07-11 05:33:49.291921	\N	Guest	User	d8q-IrkY_bKPiYDhUhwLDPrNoA2U6dey	2025-07-11 05:33:49.257	\N	\N	t	t
guest_82Wg9IvgOyw5	\N	\N	\N	\N	10	2025-07-11 05:33:51.565	2025-07-11 05:33:51.603367	\N	Guest	User	V6F494kg5z7JWUgibwzTCseL9K_o3S0C	2025-07-11 05:33:51.565	\N	\N	t	t
guest_lggSPRpZa3rv	\N	\N	\N	\N	10	2025-07-11 05:33:53.949	2025-07-11 05:33:53.983578	\N	Guest	User	3XVaNSfEM4fPFPUyau73dLPvFWSmwsOg	2025-07-11 05:33:53.949	\N	\N	t	t
guest_SCbHAsqwYnyU	\N	\N	\N	\N	10	2025-07-11 05:33:56.302	2025-07-11 05:33:56.337908	\N	Guest	User	8rU4x0umOxau_LXpHj7qTmUJw0M_1xkt	2025-07-11 05:33:56.302	\N	\N	t	t
guest_ZC9QXZ8mZcGY	\N	\N	\N	\N	10	2025-07-11 05:33:58.77	2025-07-11 05:33:58.805818	\N	Guest	User	rrR6Z2mjs44HW944U2rEFHjzCugatZfD	2025-07-11 05:33:58.77	\N	\N	t	t
guest_ifS8Q3msh5NE	\N	\N	\N	\N	10	2025-07-11 05:20:41.542	2025-07-11 05:20:43.492861	\N	Guest	User	0CuMoKpKQA0T4Ds6g8EKF__LI10LMRL_	2025-07-11 05:21:12.824	\N	\N	t	t
guest_9jl_oSdKXIw_	\N	\N	\N	\N	10	2025-07-11 05:26:22.94	2025-07-11 05:26:24.90088	\N	Guest	User	XKpQpOWwKrZrs_IxdGUnsB-ptgXAIJHF	2025-07-11 05:26:22.94	\N	\N	t	t
guest_-nqc4q3F4aib	\N	\N	\N	\N	10	2025-07-11 05:26:22.616	2025-07-11 05:26:24.577608	\N	Guest	User	CNojQ_-KLtIA35NFUs2Qiu3eeq3Bsoo9	2025-07-11 05:26:24.339	\N	\N	t	t
guest_6haKW0a4HrpP	\N	\N	\N	\N	10	2025-07-11 05:34:01.091	2025-07-11 05:34:01.12586	\N	Guest	User	O7HBQAc1wgKYfPr0pPDwTUM239p1Ykt_	2025-07-11 05:34:01.091	\N	\N	t	t
guest_y5PzeHKlZGxf	\N	\N	\N	\N	10	2025-07-11 05:34:03.465	2025-07-11 05:34:03.499023	\N	Guest	User	p2jJXHZ0d_ktj7-ZzI1knVUOR0fNk2as	2025-07-11 05:34:03.465	\N	\N	t	t
guest_cEDbR2fADvu6	\N	\N	\N	\N	10	2025-07-11 05:34:05.8	2025-07-11 05:34:05.835119	\N	Guest	User	dAdWXOQcAcVkFcCNCrzk3RZf7eV6y2Aa	2025-07-11 05:34:05.8	\N	\N	t	t
guest_4W51GqEv3Pos	\N	\N	\N	\N	10	2025-07-11 05:34:08.334	2025-07-11 05:34:08.369702	\N	Guest	User	NTUAlCfh8UJb4DCQ3dhb4y3b2amLybhV	2025-07-11 05:34:08.334	\N	\N	t	t
guest_4JEIr-V4-olD	\N	\N	\N	\N	10	2025-07-11 05:34:10.639	2025-07-11 05:34:10.672968	\N	Guest	User	yG9BYcDqWa2uOSEenePiPLaEuYl6rf65	2025-07-11 05:34:10.639	\N	\N	t	t
guest_JJNkOusbf0vB	\N	\N	\N	\N	10	2025-07-11 05:34:12.983	2025-07-11 05:34:13.018456	\N	Guest	User	5so1zGXIA28Wgwt1ECx_LraXnG5CPNBA	2025-07-11 05:34:12.983	\N	\N	t	t
guest_eDBbyOj-nXWt	\N	\N	\N	\N	10	2025-07-11 05:34:15.329	2025-07-11 05:34:15.363821	\N	Guest	User	f_EJZVIQs--IAmYlNVvHy5S9eesJMfxb	2025-07-11 05:34:15.329	\N	\N	t	t
guest_yObz-q0CdIQx	\N	\N	\N	\N	10	2025-07-11 05:34:17.876	2025-07-11 05:34:17.910633	\N	Guest	User	kmVG6tFEPGJmyfXk_EfZKhkZz6zGGAgh	2025-07-11 05:34:17.876	\N	\N	t	t
guest_qdBKQ3PeOeae	\N	\N	\N	\N	10	2025-07-11 05:34:20.239	2025-07-11 05:34:20.273858	\N	Guest	User	tQ0lCgPr5xy7-BhkLsT2Fud_zYmTd6je	2025-07-11 05:34:20.239	\N	\N	t	t
guest_wfNFOw6gZFLb	\N	\N	\N	\N	10	2025-07-11 05:34:22.716	2025-07-11 05:34:22.750845	\N	Guest	User	98oNZlU58Ijpx0vGbUqTKKjxvfSomvpE	2025-07-11 05:34:22.716	\N	\N	t	t
guest_nMDUWAWRmD69	\N	\N	\N	\N	10	2025-07-11 05:34:25.051	2025-07-11 05:34:25.085876	\N	Guest	User	IERSpfUvs-PXU96Dhk8IA4FPIR8RB67h	2025-07-11 05:34:25.051	\N	\N	t	t
guest_iZ2gSseS1tK0	\N	\N	\N	\N	10	2025-07-11 05:34:27.217	2025-07-11 05:34:27.251981	\N	Guest	User	nSb6poyT9R-NefrT_fkPYSGdnOmmeIY8	2025-07-11 05:34:27.217	\N	\N	t	t
guest_9ADzapIHAWTn	\N	\N	\N	\N	10	2025-07-11 05:34:29.814	2025-07-11 05:34:29.849668	\N	Guest	User	7QmltQjqMfs4Xp0hLprD8D6NXSWwuXU7	2025-07-11 05:34:29.814	\N	\N	t	t
guest_fXQHB8K0i_l0	\N	\N	\N	\N	10	2025-07-11 05:34:32.286	2025-07-11 05:34:32.321431	\N	Guest	User	_n6Ni8v57PVPGx9HiNvLwO1RMkT_Gdd1	2025-07-11 05:34:32.286	\N	\N	t	t
guest_7n3sgLMBnZ4h	\N	\N	\N	\N	10	2025-07-11 05:34:34.58	2025-07-11 05:34:34.615376	\N	Guest	User	3wVkJ363r4N622-aRpLX7ldwJg-jRlpC	2025-07-11 05:34:34.58	\N	\N	t	t
guest_ucHaSv1bCAnZ	\N	\N	\N	\N	10	2025-07-11 05:34:36.903	2025-07-11 05:34:36.938622	\N	Guest	User	DkM_1kye_kQuwPf1xESAU8vtnmKhXWM_	2025-07-11 05:34:36.903	\N	\N	t	t
guest_7QheiJirGVMV	\N	\N	\N	\N	10	2025-07-11 05:34:39.295	2025-07-11 05:34:39.331585	\N	Guest	User	JUWKw6MXzECf9YTNrYqGpqjQdE2AGlVZ	2025-07-11 05:34:39.295	\N	\N	t	t
guest_B8zDkNDuoES9	\N	\N	\N	\N	10	2025-07-11 05:34:41.623	2025-07-11 05:34:41.657847	\N	Guest	User	QLcKjyNj_4nI7dCpe-HFKU2iM71WmCzo	2025-07-11 05:34:41.623	\N	\N	t	t
guest_tq577owtUvul	\N	\N	\N	\N	10	2025-07-11 05:34:43.882	2025-07-11 05:34:43.916834	\N	Guest	User	nQ5jkzC1w37ehQDmxm4QwvBkBuRxIovn	2025-07-11 05:34:43.882	\N	\N	t	t
guest_zaiqvHe4SVyH	\N	\N	\N	\N	10	2025-07-11 05:34:46.218	2025-07-11 05:34:46.252631	\N	Guest	User	o5SujpUOMB3mb-b_1djmjLGzK7QzWLsi	2025-07-11 05:34:46.218	\N	\N	t	t
guest_MgxtqDNd_Q7J	\N	\N	\N	\N	10	2025-07-11 05:34:48.602	2025-07-11 05:34:48.637561	\N	Guest	User	WS9Mdply-EGRovjjhXZCnmh-viPLgw8C	2025-07-11 05:34:48.602	\N	\N	t	t
guest_kH7ze-XH05RD	\N	\N	\N	\N	10	2025-07-11 05:34:50.918	2025-07-11 05:34:50.952548	\N	Guest	User	-FeHqzmPcm_jinvZ-rFQJnDTZf0g_QK5	2025-07-11 05:34:50.918	\N	\N	t	t
guest_g8NwBdht8SWT	\N	\N	\N	\N	10	2025-07-11 05:34:53.259	2025-07-11 05:34:53.294199	\N	Guest	User	LD9JYZojITZ_At-OlsCwd--wpnskBm1Q	2025-07-11 05:34:53.259	\N	\N	t	t
guest_d4mqKGendtz0	\N	\N	\N	\N	10	2025-07-11 05:34:55.667	2025-07-11 05:34:55.700898	\N	Guest	User	QfLZTea-GZ2bj8y7gF1WmNub9HHGISYz	2025-07-11 05:34:55.667	\N	\N	t	t
guest_Wkt2XjomlLse	\N	\N	\N	\N	10	2025-07-11 05:35:32.615	2025-07-11 05:35:34.588499	\N	Guest	User	8MnaaLc4MtePIZ8_8cHnS9HvnAmWvwx-	2025-07-11 05:35:34.321	\N	\N	t	t
guest_-1Ezn5xi50PZ	\N	\N	\N	\N	10	2025-07-11 05:35:32.943	2025-07-11 05:35:34.896576	\N	Guest	User	D2s0bG5pu6dwzq1bv7oL85pT8NtqoiFY	2025-07-11 05:36:00.399	\N	\N	t	t
guest_eCG-wjwrrGbs	\N	\N	\N	\N	10	2025-07-11 05:38:42.353	2025-07-11 05:38:44.310124	\N	Guest	User	Tt1YRmBaSn5GA7iT1zAWzfp8Oa62eSyS	2025-07-11 05:38:43.956	\N	\N	t	t
guest_1JGwm_j4nmBl	\N	\N	\N	\N	10	2025-07-11 05:38:44.686	2025-07-11 05:38:46.648473	\N	Guest	User	AJtf_WL83WL5YjU9tz4mb38gMRo8vuwO	2025-07-11 05:38:44.686	\N	\N	t	t
guest_BlAlJ9UoSE-D	\N	\N	\N	\N	10	2025-07-11 05:57:16.236	2025-07-11 05:57:16.267337	\N	Guest	User	mKHcd2LrFYbuM2quQoDnm9ukCaC9G9v9	2025-07-11 05:57:16.236	\N	\N	t	t
guest_sZrRAa6LeEz9	\N	\N	\N	\N	10	2025-07-11 05:39:33.704	2025-07-11 05:39:35.66786	\N	Guest	User	ceo_Z55zarXESh-V93u-BosUsRmJMXHr	2025-07-11 06:12:05.693	\N	\N	t	t
guest_l3c6cFvPKe3O	\N	\N	\N	\N	10	2025-07-11 06:14:50.491	2025-07-11 06:14:52.464092	\N	Guest	User	cnV-Xgkxa7Jw3A1tLBFga8QoKh-LIicQ	2025-07-11 06:14:50.491	\N	\N	t	t
guest_L7m8VHxIH4r2	\N	\N	\N	\N	10	2025-07-11 06:54:06.735	2025-07-11 06:54:08.691691	\N	Guest	User	qqGwjAA9s4oZWZj0s79wvOJ2jsqa5DE1	2025-07-11 06:54:06.735	\N	\N	t	t
guest_jk_BmLc70wjJ	\N	\N	\N	\N	10	2025-07-11 06:21:01.126	2025-07-11 06:21:01.161467	\N	Guest	User	HxoViofKr9b2S0Y9wRY_Z7C7fj2bbCUM	2025-07-11 06:21:08.145	\N	\N	t	t
guest_3LKWip79JXsd	\N	\N	\N	\N	10	2025-07-11 06:22:43.624	2025-07-11 06:22:43.655753	\N	Guest	User	K0ri34q21puow6pU19_9BekX7bujgTRL	2025-07-11 06:22:43.624	\N	\N	t	t
guest_3FuI9pglHUj2	\N	\N	\N	\N	10	2025-07-11 07:16:38.615	2025-07-11 07:16:40.584993	\N	Guest	User	7CP7EfFUzv4F5AGyT8tYg5YzF-SPhAvy	2025-07-11 07:31:28.359	\N	\N	t	t
guest_eqrEV8oThtO-	\N	\N	\N	\N	10	2025-07-11 07:33:55.332	2025-07-11 07:33:55.366353	\N	Guest	User	R9YZB2qFKPdlYN1ZqsVIMRCxVc0llv-i	2025-07-11 07:33:55.332	\N	\N	t	t
guest_ocC6jgnmMxNB	\N	\N	\N	\N	10	2025-07-11 07:33:56.168	2025-07-11 07:33:56.203177	\N	Guest	User	gczjVdDp5U5MHeq3PprvRkxEF3JtvKaQ	2025-07-11 07:33:56.168	\N	\N	t	t
guest_uyUkzFmvFeki	\N	\N	\N	\N	10	2025-07-11 06:15:56.59	2025-07-11 06:15:56.624532	\N	Guest	User	cWTDEZnxrJ4plT-yZA1ooUPYxfkZ8pgS	2025-07-11 06:15:56.59	\N	\N	t	t
guest_m0C347Wye7ZC	\N	\N	\N	\N	10	2025-07-11 08:25:11.29	2025-07-11 08:25:11.323454	\N	Guest	User	iMgw5e9BBDuAyrlVehk9VxNiMlTwsBTc	2025-07-11 08:25:11.29	\N	\N	t	t
guest_Wyh0GHAmYGE_	\N	\N	\N	\N	10	2025-07-11 08:28:09.169	2025-07-11 08:28:09.204597	\N	Guest	User	Hdj1eiUIdDJKzVFP7zn-Jrsz-Z2-8Co0	2025-07-11 08:28:09.169	\N	\N	t	t
guest_0XbwNfF-SXjb	\N	\N	\N	\N	10	2025-07-11 06:54:04.173	2025-07-11 06:54:06.141116	\N	Guest	User	VtkMaAWvHwUzpmwDnRZQEskVTcBFquuG	2025-07-11 07:08:16.293	\N	\N	t	t
guest_bF_UmZP-VfdT	\N	\N	\N	\N	10	2025-07-11 07:15:27.853	2025-07-11 07:15:29.828166	\N	Guest	User	yLkUSYASX4IAxL_4uu4gYMRbDt9tUEby	2025-07-11 07:15:29.637	\N	\N	t	t
guest_e9cayCLGggdl	\N	\N	\N	\N	10	2025-07-11 08:28:59.753	2025-07-11 08:28:59.790254	\N	Guest	User	D6VnB2poa-PoA0xskydo_JAYKkJ5xwi2	2025-07-11 08:28:59.753	\N	\N	t	t
guest_wZxjhKbHfjLz	\N	\N	\N	\N	10	2025-07-11 08:29:05.516	2025-07-11 08:29:05.55356	\N	Guest	User	Kr6xlf8ikFZbSQULZDuBCRP9W0seVV9N	2025-07-11 08:29:05.516	\N	\N	t	t
guest_Vt7ztv_eXEzE	\N	\N	\N	\N	10	2025-07-11 08:32:52.814	2025-07-11 08:32:52.849694	\N	Guest	User	IAoxHo5xd-KSdu-Txz5-hO_ZxjtsegAG	2025-07-11 08:32:52.814	\N	\N	t	t
guest__b-70ieme3P1	\N	\N	\N	\N	10	2025-07-11 08:32:53.636	2025-07-11 08:32:53.671128	\N	Guest	User	5MSUOYB3ecyiBwQxcg8ZCjdvpoyTRRIi	2025-07-11 08:32:53.636	\N	\N	t	t
guest_ZxQKv6zoohrw	\N	\N	\N	\N	10	2025-07-11 08:33:00.128	2025-07-11 08:33:00.163366	\N	Guest	User	Jh4DSP7DuTMeRCBTpid_EYYzP5U-Xjok	2025-07-11 08:33:00.128	\N	\N	t	t
guest_MzWAew-ydveH	\N	\N	\N	\N	10	2025-07-11 08:33:08.634	2025-07-11 08:33:08.671346	\N	Guest	User	8Io_MccPw_j1M_iSTcAIjLob1j9oc3hY	2025-07-11 08:33:08.634	\N	\N	t	t
guest_wHK_VG0iOIdn	\N	\N	\N	\N	10	2025-07-11 07:15:28.214	2025-07-11 07:15:30.19743	\N	Guest	User	opGFXKD60Rr-hLRdiIzU22ZOIV_meDVc	2025-07-11 07:16:07.333	\N	\N	t	t
guest_ZgRl2nNZJykb	\N	\N	\N	\N	10	2025-07-11 06:14:50.15	2025-07-11 06:14:52.116568	\N	Guest	User	GwCkeZTAnE3nZcpLh14axNbZTWyqO23w	2025-07-11 06:47:47.673	\N	\N	t	t
guest_Z6u266pUabac	\N	\N	\N	\N	10	2025-07-11 07:16:38.051	2025-07-11 07:16:40.020778	\N	Guest	User	-NPoWj-7xBqc1Jr5AWsqzYOocuyA800G	2025-07-11 07:16:39.963	\N	\N	t	t
guest_EKztoIrpr8xO	\N	\N	\N	\N	10	2025-07-11 08:34:11.697	2025-07-11 08:34:11.732748	\N	Guest	User	i-zaRroDv4OPVNndfTHfvgPArMGtg3zu	2025-07-11 08:34:11.697	\N	\N	t	t
guest_57l6Yg2b0h4h	\N	\N	\N	\N	10	2025-07-11 06:37:52.773	2025-07-11 06:37:52.808169	\N	Guest	User	PmBW5GNxWQJuP8NXAPOmfX5GPquKljqr	2025-07-11 06:37:52.773	\N	\N	t	t
guest_ECBlDK6vWygy	\N	\N	\N	\N	10	2025-07-11 06:10:29.098	2025-07-11 06:10:29.132432	\N	Guest	User	BO3vvVoKk7MM0KKzdrWzdrV_jp4k_zwc	2025-07-11 06:10:29.098	\N	\N	t	t
guest_OJ8SmKHwXiHA	\N	\N	\N	\N	10	2025-07-11 08:37:03.576	2025-07-11 08:37:03.609877	\N	Guest	User	6NtsZcK0SlnbdSLSAmDrI-NSV1Slss6M	2025-07-11 08:37:03.576	\N	\N	t	t
guest_Cuv9dZWQwcsn	\N	\N	\N	\N	10	2025-07-11 08:37:54.527	2025-07-11 08:37:54.5625	\N	Guest	User	Z7KoWklcz9gWkM-DGWjlouQuaGsQcimJ	2025-07-11 08:37:54.527	\N	\N	t	t
guest_BUeO_RBn2doE	\N	\N	\N	\N	10	2025-07-11 08:37:56.22	2025-07-11 08:37:56.25413	\N	Guest	User	JvYEHCiANJalMH_m0bqkJnEt5Vkd8fr5	2025-07-11 08:37:56.22	\N	\N	t	t
guest_YF5Mpv9nlw-d	\N	\N	\N	\N	10	2025-07-11 08:38:05.743	2025-07-11 08:38:05.779733	\N	Guest	User	QhlWNwRk7wD-mgqVEYQk0bFTDF3_8hG3	2025-07-11 08:38:05.743	\N	\N	t	t
guest_UJs82N2SlLxw	\N	\N	\N	\N	10	2025-07-11 08:39:13.891	2025-07-11 08:39:13.926113	\N	Guest	User	1BjW1TZxCTG3fyLU5TYGbJdDtB65oiGg	2025-07-11 08:39:13.891	\N	\N	t	t
guest_ppdggfVv8gvZ	\N	\N	\N	\N	10	2025-07-11 08:40:02.428	2025-07-11 08:40:02.463043	\N	Guest	User	LJoXT9RD9xkYoLECd-vmRmFhlgITVcKW	2025-07-11 08:40:02.428	\N	\N	t	t
guest_7LVPBZ85e1v7	\N	\N	\N	\N	10	2025-07-11 08:40:27.422	2025-07-11 08:40:27.460436	\N	Guest	User	EGR5LeB6bBnNXMdoxts0dam5JrLAEjGH	2025-07-11 08:40:27.422	\N	\N	t	t
guest_vJ4lh3LdY2ZU	\N	\N	\N	\N	10	2025-07-11 08:41:13.547	2025-07-11 08:41:13.58047	\N	Guest	User	gF9DlLt4nCHRoMEJut4bnbnSSegZ4aSx	2025-07-11 08:41:13.547	\N	\N	t	t
guest_Pr0rFTYh5Kyb	\N	\N	\N	\N	10	2025-07-11 06:50:55.152	2025-07-11 06:50:55.186338	\N	Guest	User	WaVB8RkrXc1WJboe7TwEhZazpCziJNUk	2025-07-11 06:51:30.059	\N	\N	t	t
guest_yAA0hucPJ2if	\N	\N	\N	\N	10	2025-07-11 08:42:01.129	2025-07-11 08:42:01.163616	\N	Guest	User	nN1Or6BInbysJ9xgmQA57JcPATD8P2hY	2025-07-11 08:42:01.129	\N	\N	t	t
guest_gIR9ezGE87_O	\N	\N	\N	\N	10	2025-07-11 08:42:05.467	2025-07-11 08:42:05.503817	\N	Guest	User	YpDErl6xD7HmlCrMvfoeTjP7FhxfHD-G	2025-07-11 08:42:05.467	\N	\N	t	t
guest_4Ot7ReAzlXl8	\N	\N	\N	\N	10	2025-07-11 08:42:12.456	2025-07-11 08:42:12.492572	\N	Guest	User	nrRbFVhFUeRI4XoglTOqKafhv_Zavs_s	2025-07-11 08:42:12.456	\N	\N	t	t
guest_c0oCjDDS8aM8	\N	\N	\N	\N	10	2025-07-11 08:42:13.542	2025-07-11 08:42:13.576572	\N	Guest	User	oIWWYegXN3Fi16QBjXUaaHOSMhtXmXBj	2025-07-11 08:42:13.542	\N	\N	t	t
guest__kZMGKPc1TDp	\N	\N	\N	\N	10	2025-07-11 08:42:17.676	2025-07-11 08:42:17.71055	\N	Guest	User	ONerWFYnwYGuS2SvTQxdhWUKQjDhPR2J	2025-07-11 08:42:17.676	\N	\N	t	t
guest_Bc4ZZs8nbS73	\N	\N	\N	\N	10	2025-07-11 08:42:52.862	2025-07-11 08:42:52.898511	\N	Guest	User	JEXNcxdFcIziPNcVfZKZ3t0QDdILRxDc	2025-07-11 08:42:52.862	\N	\N	t	t
guest_Zy-naiE7QjJK	\N	\N	\N	\N	10	2025-07-11 08:43:35.422	2025-07-11 08:43:35.455693	\N	Guest	User	xmm2Z9jpVlDnFOQGZFijvvR0XJ8Slw-W	2025-07-11 08:43:35.422	\N	\N	t	t
guest_-vRmVvgJwdWL	\N	\N	\N	\N	10	2025-07-11 08:43:56.87	2025-07-11 08:43:56.905695	\N	Guest	User	bMDfLTcqKiedMKGtCH62SK9TjRNUA0AZ	2025-07-11 08:43:56.87	\N	\N	t	t
guest_b6v0QgolzpA6	\N	\N	\N	\N	10	2025-07-11 08:44:08.267	2025-07-11 08:44:08.383885	\N	Guest	User	Aa7zx6LE8TajgWMFkUBh09pYZODOvWs8	2025-07-11 08:44:08.267	\N	\N	t	t
guest_QkeHRjdjDIIs	\N	\N	\N	\N	10	2025-07-11 08:44:08.628	2025-07-11 08:44:08.664394	\N	Guest	User	2vi8hbf65KddGRk_DmMwzeJklyiwHvnJ	2025-07-11 08:44:08.628	\N	\N	t	t
guest_kQffNkQWsRWB	\N	\N	\N	\N	10	2025-07-11 08:44:31.487	2025-07-11 08:44:31.521792	\N	Guest	User	0oKEbxKFWHp99Et7kTjnLHvxw37BSGkw	2025-07-11 08:44:31.487	\N	\N	t	t
guest_jad1EGhEmBuP	\N	\N	\N	\N	10	2025-07-11 09:30:44.598	2025-07-11 09:30:44.633589	\N	Guest	User	s17ZCFO5m49dS7xoUOwozXoFjNRYk6_u	2025-07-11 09:30:44.598	\N	\N	t	t
guest_X7HxFlcNgwsi	\N	\N	\N	\N	10	2025-07-11 09:37:59.011	2025-07-11 09:37:59.045467	\N	Guest	User	Y15US7c0Msbmr2UOUvazLimR44uPQWcd	2025-07-11 09:37:59.011	\N	\N	t	t
guest_sF9vH4xM5tBg	\N	\N	\N	\N	10	2025-07-11 10:28:35.351	2025-07-11 10:28:35.385088	\N	Guest	User	r2N7zhDTcXw54_KBVzlDmJpW797cj33g	2025-07-11 10:28:35.351	\N	\N	t	t
guest_0hYE_yt3Kbzs	\N	\N	\N	\N	10	2025-07-11 10:28:40.222	2025-07-11 10:28:40.256693	\N	Guest	User	h92wHBtXV90M80b85cHERrVHl8YYBwfG	2025-07-11 10:28:40.222	\N	\N	t	t
guest_WDSqon_wK1-3	\N	\N	\N	\N	10	2025-07-11 11:47:27.626	2025-07-11 11:47:27.662344	\N	Guest	User	sY3Lxi3ioD3iHLSl63U1Usx__VtAdOei	2025-07-11 11:47:27.626	\N	\N	t	t
guest_tsVIKL7R398M	\N	\N	\N	\N	10	2025-07-11 12:04:06.868	2025-07-11 12:04:06.902258	\N	Guest	User	YAZvZBGIui-BHt4U8NwKDl4A9VfyuP5h	2025-07-11 12:04:06.868	\N	\N	t	t
guest_GtQG7EV7g-KF	\N	\N	\N	\N	10	2025-07-11 15:49:36.467	2025-07-11 15:49:36.540407	\N	Guest	User	6-5cnr1-6O1HscAbJ5NkYdEqSjGh5P9l	2025-07-11 16:06:39.837	\N	\N	t	t
guest_CbVREsrc9JrP	\N	\N	\N	\N	10	2025-07-11 16:20:43.102	2025-07-11 16:20:43.208609	\N	Guest	User	rCbtGFlQXE2Vidj_QhgWpQNB391lCw1w	2025-07-11 16:27:47.307	\N	\N	t	t
guest_yxbuNMQQkzAq	\N	\N	\N	\N	10	2025-07-11 14:15:51.906	2025-07-11 14:15:51.940695	\N	Guest	User	1zaJkcsJdAH2q5MuA4NSNl1OsT96m1kb	2025-07-11 14:15:51.906	\N	\N	t	t
guest_UwGE4lCWy9vp	\N	\N	\N	\N	10	2025-07-11 17:04:25.523	2025-07-11 17:04:25.633471	\N	Guest	User	nrsNUcBh5O7U2n1f_QgkwGXTa6Ot0D62	2025-07-11 17:13:22.571	\N	\N	t	t
guest_ktEZL5ah_FFq	\N	\N	\N	\N	10	2025-07-11 15:55:41.716	2025-07-11 15:55:41.751045	\N	Guest	User	VFW45l8yLwZvjA3EyYv7LD2ptK1ZLHJ7	2025-07-11 17:44:33.447	\N	\N	t	t
guest_tM3qVa5Sscoz	\N	\N	\N	\N	10	2025-07-11 12:22:16.489	2025-07-11 12:22:19.180442	\N	Guest	User	_-cvrMuylCNn_7cNzCezJUib3YxkfKVh	2025-07-11 12:34:38.15	\N	\N	t	t
guest_NNiaJinnO1QB	\N	\N	\N	\N	10	2025-07-11 17:16:24.373	2025-07-11 17:16:24.448937	\N	Guest	User	pwxQ7hFaZ40qjg0rAyohElzBl8MQitKV	2025-07-11 17:16:34.932	\N	\N	t	t
guest_y1-6QGBVsmfB	\N	\N	\N	\N	10	2025-07-11 13:49:38.367	2025-07-11 13:49:38.399805	\N	Guest	User	zRrlosqH79dD0JDYIvSBtsanBR4MGaMI	2025-07-11 13:49:38.367	\N	\N	t	t
guest_bj6WxoLt_Wl-	\N	\N	\N	\N	10	2025-07-11 14:29:06.688	2025-07-11 14:29:06.724029	\N	Guest	User	gZ4SbrBzc7LrixAqsFmUXHRgWErWJqSg	2025-07-11 14:29:06.688	\N	\N	t	t
guest_7nL0WOL9VKGs	\N	\N	\N	\N	10	2025-07-11 16:34:33.004	2025-07-11 16:34:33.081394	\N	Guest	User	jj5LBad2nYaeNal3nfmPnHG7Cr_apTf5	2025-07-11 17:01:03.556	\N	\N	t	t
guest_1k74cB7_4EJx	\N	\N	\N	\N	10	2025-07-11 12:27:16.06	2025-07-11 12:27:16.190505	\N	Guest	User	bbP9ESkEDz70NzcPbI5SpbxDw9MOEaN-	2025-07-11 12:27:16.06	\N	\N	t	t
guest_LAs-PX7GYMWQ	\N	\N	\N	\N	10	2025-07-11 13:51:34.224	2025-07-11 13:51:34.259032	\N	Guest	User	8978BOGyQ57jiAof8mmN3IRTIqcgTEMH	2025-07-11 13:51:34.224	\N	\N	t	t
guest_jUBCQjojl5JY	\N	\N	\N	\N	10	2025-07-11 12:29:13.942	2025-07-11 12:29:14.070907	\N	Guest	User	qqpwYntQI2turQXlCkKf0sNocSRCBQdY	2025-07-11 12:29:13.942	\N	\N	t	t
guest_VpzLrWavCiD_	\N	\N	\N	\N	10	2025-07-11 12:17:08.666	2025-07-11 12:17:08.702361	\N	Guest	User	a4YV8RhOHUn5nBa_e7AWTcCiDiePPNTN	2025-07-11 12:17:08.666	\N	\N	t	t
guest_9DoPfAP0dxxK	\N	\N	\N	\N	10	2025-07-11 16:28:12.496	2025-07-11 16:28:12.612818	\N	Guest	User	_LQPc9VICqsrgufUmcM7zDWNmtJoqdYn	2025-07-11 16:34:03.041	\N	\N	t	t
guest_B4MpWP8EiLIf	\N	\N	\N	\N	10	2025-07-11 13:05:05.337	2025-07-11 13:05:05.378016	\N	Guest	User	NGqWj1f-16BIm1DtmQ1DDQ-u3VIieVJB	2025-07-11 13:05:05.337	\N	\N	t	t
guest_fMnCvEjBd7yQ	\N	\N	\N	\N	10	2025-07-11 14:28:31.364	2025-07-11 14:28:31.441175	\N	Guest	User	jRkHuVQNkVkfVpP6yP6apWQG0XLgVbH6	2025-07-11 14:38:15.361	\N	\N	t	t
guest_5mvTv-FCuBvZ	\N	\N	\N	\N	10	2025-07-11 12:58:58.058	2025-07-11 12:58:58.093035	\N	Guest	User	L2uA2jldhPQfKbAYaXgRXG7gQ17wr2z9	2025-07-11 14:02:43.615	\N	\N	t	t
guest_s4n-ulwSoxpY	\N	\N	\N	\N	10	2025-07-11 16:52:29.258	2025-07-11 16:52:29.303756	\N	Guest	User	a3T79f5S6cb7RfcExTVc6PWLxR-Zjq5P	2025-07-11 16:52:29.258	\N	\N	t	t
guest_QaDHXHraB4Rt	\N	\N	\N	\N	10	2025-07-11 16:35:45.783	2025-07-11 16:35:45.817891	\N	Guest	User	RYcdDaN2lk0a8dnfaUh5QOp6f5CXZOyF	2025-07-11 18:55:42.536	\N	\N	t	t
guest_3OABMTMO_237	\N	\N	\N	\N	10	2025-07-11 16:07:21.041	2025-07-11 16:07:21.152652	\N	Guest	User	Gx30f-fi-4o5wr4QbjlHZcxVNKd_cdX3	2025-07-11 16:10:34.509	\N	\N	t	t
guest_EFcEju7f0fRS	\N	\N	\N	\N	10	2025-07-11 12:10:56.12	2025-07-11 12:10:58.793696	\N	Guest	User	fEuNQ78P_BCkLZNYR4Olxyk18EiLdiQ2	2025-07-11 12:17:18.057	\N	\N	t	t
guest_xz6caCYuoqSP	\N	\N	\N	\N	10	2025-07-11 12:22:16.257	2025-07-11 12:22:18.932306	\N	Guest	User	BoZxk2Idba-mhp7qq1Z02F3nPKpxF1az	2025-07-11 12:22:17.878	\N	\N	t	t
guest_-0H6uOnrWBCx	\N	\N	\N	\N	10	2025-07-11 12:29:13.961	2025-07-11 12:29:14.089122	\N	Guest	User	_X2E8atSIWbkUpGPvdXnbkn4cHXz1hQV	2025-07-11 12:49:59.798	\N	\N	t	t
guest_qYO8OQFa3NTN	\N	\N	\N	\N	10	2025-07-11 14:15:08.327	2025-07-11 14:15:08.363849	\N	Guest	User	EpqLEYpDHSHsRV_NI0wESg2V6eG9OIwE	2025-07-11 14:15:08.327	\N	\N	t	t
guest_q_i4tUTIObpC	\N	\N	\N	\N	10	2025-07-11 14:15:08.621	2025-07-11 14:15:08.656909	\N	Guest	User	3qW4NduHPbHHHFFZOTtPWjF0QEOTtUt1	2025-07-11 14:15:08.621	\N	\N	t	t
guest_tCQZ3szrV414	\N	\N	\N	\N	10	2025-07-11 15:42:14.099	2025-07-11 15:42:14.173345	\N	Guest	User	cSDI6y9acur8nFNe9_SmtjoJM6hhvDP-	2025-07-11 15:42:14.686	\N	\N	t	t
guest_L7R68dcrcfU3	\N	\N	\N	\N	10	2025-07-11 14:42:00.622	2025-07-11 14:42:00.721517	\N	Guest	User	8aTgTn7fwOVv2v2yJ64oTJYw7YpA3zT0	2025-07-11 14:48:18.745	\N	\N	t	t
guest_O_XI3vPZo3b6	\N	\N	\N	\N	10	2025-07-11 12:35:24.805	2025-07-11 12:35:27.479111	\N	Guest	User	NG8TdL7iTzcdX4tflp6fLY4e0zUlAd90	2025-07-11 12:37:14.776	\N	\N	t	t
guest_te_7RV5yIpVL	\N	\N	\N	\N	10	2025-07-11 14:48:26.087	2025-07-11 14:48:26.841012	\N	Guest	User	2y4IxDnGnVjd7k9fS0_nQOHj2Rsd8-kY	2025-07-11 15:34:30.072	\N	\N	t	t
guest_jJRUsB3HA7SR	\N	\N	\N	\N	10	2025-07-11 12:30:46.16	2025-07-11 12:30:46.193722	\N	Guest	User	SqzXrvLPcrRKSeN8tVuNXW8Eu5HGWilB	2025-07-11 12:30:46.16	\N	\N	t	t
guest_qnpiLOvDjG_3	\N	\N	\N	\N	10	2025-07-11 12:41:00.673	2025-07-11 12:41:03.356415	\N	Guest	User	r3O4-bP-Lz2bm9YVfpHfcuAkSXiTBCOu	2025-07-11 12:41:00.673	\N	\N	t	t
guest_NSgiI26tqYiU	\N	\N	\N	\N	10	2025-07-11 12:41:00.453	2025-07-11 12:41:03.130439	\N	Guest	User	BgwNj0VR7_49a3rhaYUIyyuKVuRP7x2G	2025-07-11 12:56:03.629	\N	\N	t	t
guest_9k3N7i39gFKW	\N	\N	\N	\N	10	2025-07-11 16:10:45.486	2025-07-11 16:10:45.59188	\N	Guest	User	ICbsvtFFIc30B_WEGYoFxTgW4n4pCH7M	2025-07-11 16:14:23.63	\N	\N	t	t
guest_p8_wNX9vak8J	\N	\N	\N	\N	10	2025-07-11 12:50:00.809	2025-07-11 12:50:00.845608	\N	Guest	User	uN8xUhWFIbvAqR0tN_Put-aG6msltcSI	2025-07-11 12:58:33.049	\N	\N	t	t
guest_sBxVxS8ln-U8	\N	\N	\N	\N	10	2025-07-11 14:10:20.895	2025-07-11 14:10:20.929716	\N	Guest	User	KqNbG0jXX36M8ERoDmDJt0kBHjw90hNY	2025-07-11 14:17:21.807	\N	\N	t	t
guest_ZqgeH_k0-rXx	\N	\N	\N	\N	10	2025-07-11 15:38:29.281	2025-07-11 15:38:29.358186	\N	Guest	User	PdpTSQ9U80FSAuqQ9cC9hcGco2_hb1w-	2025-07-11 15:42:23.276	\N	\N	t	t
guest_jMa6xeFCDgCC	\N	\N	\N	\N	10	2025-07-11 15:47:37.73	2025-07-11 15:47:37.764432	\N	Guest	User	-_EKGVD3IZaFpJV1KMyJ-McOyRQirZVo	2025-07-11 15:47:37.73	\N	\N	t	t
guest_mdrlI7VGGDzl	\N	\N	\N	\N	10	2025-07-11 15:47:42.956	2025-07-11 15:47:42.992807	\N	Guest	User	7SsFzD1S1gbE3DYaKfnWWrBTgJWu7iq0	2025-07-11 15:47:42.956	\N	\N	t	t
guest_ZI0_QHRBPPst	\N	\N	\N	\N	10	2025-07-11 16:14:47.597	2025-07-11 16:14:47.704483	\N	Guest	User	AxCkfava2dt4Vq5S7DHghsoopnTHrS5Q	2025-07-11 16:20:27.957	\N	\N	t	t
guest_I33ylCWOZtgu	\N	\N	\N	\N	10	2025-07-11 16:46:57.765	2025-07-11 16:46:57.798013	\N	Guest	User	OcGiikCK2-YSv5dgGuxuJwKKU73UzOaL	2025-07-11 16:48:10.183	\N	\N	t	t
guest_cIyY9wvsCL0C	\N	\N	\N	\N	10	2025-07-11 16:51:56.002	2025-07-11 16:51:56.037615	\N	Guest	User	_NB-Tl7Y5dv0ZIcu9ssI0UsvI6vG_U-M	2025-07-11 18:37:42.174	\N	\N	t	t
guest_sN_8fDGhBtis	\N	\N	\N	\N	10	2025-07-11 16:49:07.929	2025-07-11 16:49:08.004623	\N	Guest	User	U0jLIWP_q2ilBW-cLvcttBNN3sowoJ3B	2025-07-11 16:49:07.929	\N	\N	t	t
guest_V6XLgMTPH9pm	\N	\N	\N	\N	10	2025-07-11 16:49:35.796	2025-07-11 16:49:35.830659	\N	Guest	User	7TmdVLuhzPNW3AIu_TOCCfBAGEe5pxEC	2025-07-11 16:49:35.796	\N	\N	t	t
guest_Cf_H4TdpXyhQ	\N	\N	\N	\N	10	2025-07-11 16:49:38.783	2025-07-11 16:49:38.861067	\N	Guest	User	5UcBQGO6AEPxpFIgQg6tUoMC75MuixM_	2025-07-11 16:49:38.783	\N	\N	t	t
guest_KBr1sa4Vcy2-	\N	\N	\N	\N	10	2025-07-11 16:50:10.442	2025-07-11 16:50:10.537993	\N	Guest	User	0TuansrPEPGUJW_OYW9w0ksm6whannEO	2025-07-11 16:50:10.442	\N	\N	t	t
guest_DufoSfvq_TTQ	\N	\N	\N	\N	10	2025-07-11 17:16:59.229	2025-07-11 17:16:59.304778	\N	Guest	User	iwINxb7HyoexFcLrPV_Z28zqtyUcQdDq	2025-07-11 17:16:59.229	\N	\N	t	t
guest_N99rztbZnxKw	\N	\N	\N	\N	10	2025-07-11 18:25:38.95	2025-07-11 18:25:39.0184	\N	Guest	User	MPlqYEDH0uDs3RPy26Nbl9IflVfywkJ4	2025-07-11 18:25:38.95	\N	\N	t	t
guest_qRhKMsiTnWik	\N	\N	\N	\N	10	2025-07-11 18:28:46.518	2025-07-11 18:28:46.613495	\N	Guest	User	jJ0rJ3wgssPafpSVLUDESHXvSMBvl8Pt	2025-07-11 18:28:46.518	\N	\N	t	t
guest_oWv_BModVTkW	\N	\N	\N	\N	10	2025-07-11 18:22:09.67	2025-07-11 18:22:09.735992	\N	Guest	User	Nn1lDjsf0g0Cj3NtFzOdZybqPV8nThau	2025-07-11 18:22:09.67	\N	\N	t	t
guest_swzebbbMainA	\N	\N	\N	\N	10	2025-07-11 18:23:10.475	2025-07-11 18:23:10.540999	\N	Guest	User	1QnzPgQy8cbNNqluwEpVPkxytKiOHWzz	2025-07-11 18:23:10.475	\N	\N	t	t
guest_cC_RMeSCYRfZ	\N	\N	\N	\N	10	2025-07-11 17:17:08.509	2025-07-11 17:17:08.590044	\N	Guest	User	a47K0UC0zISG7UXwhLvwD2g_kNfoMTY2	2025-07-11 17:25:14.681	\N	\N	t	t
guest_FTJGS-7tWrLd	\N	\N	\N	\N	10	2025-07-11 17:28:55.63	2025-07-11 17:28:55.666191	\N	Guest	User	8lOQuo1huOZzpJ_YGmxdCwvUgY5vkWFY	2025-07-11 17:28:55.63	\N	\N	t	t
guest_w_djDFys8OlP	\N	\N	\N	\N	10	2025-07-11 17:28:57.028	2025-07-11 17:28:57.063558	\N	Guest	User	2kqs0T65vreh6Uw_neggKc2T7iy0tLbG	2025-07-11 17:28:57.028	\N	\N	t	t
guest_thsgAut5lV7f	\N	\N	\N	\N	10	2025-07-11 19:40:40.569	2025-07-11 19:40:40.604446	\N	Guest	User	KFfG3ILNodUjEkzazoi-j1udceqGGT7p	2025-07-11 21:16:48.317	\N	\N	t	t
guest_t1UbxT0yytqJ	\N	\N	\N	\N	10	2025-07-11 17:37:30.191	2025-07-11 17:37:30.261649	\N	Guest	User	CziyoNZALgK9C2YyTa6K1_foZqFuCzqK	2025-07-11 18:07:37.371	\N	\N	t	t
guest_u8FIUX5nBbW_	\N	\N	\N	\N	10	2025-07-11 18:07:40.14	2025-07-11 18:07:40.175564	\N	Guest	User	jSt6Aboqqr2MiFuxgN6Mf3LnS7KGp4JK	2025-07-11 18:07:40.14	\N	\N	t	t
guest_5dp_J7gDQX5T	\N	\N	\N	\N	10	2025-07-11 18:07:43.439	2025-07-11 18:07:43.474247	\N	Guest	User	QhZ8Q4NzGR65nqOVN-q8EPUpFAHuw7Rm	2025-07-11 18:07:43.439	\N	\N	t	t
guest_8qMRBQZoxuK_	\N	\N	\N	\N	10	2025-07-11 17:30:04.148	2025-07-11 17:30:04.223494	\N	Guest	User	JuiYiycH2x_mN_PGAFDDH33mz1eJF6QL	2025-07-11 17:33:36.973	\N	\N	t	t
guest_617yJH6lbBVg	\N	\N	\N	\N	10	2025-07-11 17:35:29.143	2025-07-11 17:35:29.216867	\N	Guest	User	XGIkTyaZO48h9n7MhVlLnTFOD73YZtRM	2025-07-11 17:35:29.143	\N	\N	t	t
guest_ybLg8usQ4Yvu	\N	\N	\N	\N	10	2025-07-11 17:37:30.169	2025-07-11 17:37:30.247726	\N	Guest	User	XDu_O7gZk9xRp-nqWEXDcHk7jxqS2yoq	2025-07-11 17:37:30.169	\N	\N	t	t
guest_uZv9gKsPE6QB	\N	\N	\N	\N	10	2025-07-11 18:10:23.888	2025-07-11 18:10:23.986283	\N	Guest	User	BR7uIH046N1KJ1hwuKWacflYAVzmOM1C	2025-07-11 18:10:23.888	\N	\N	t	t
guest_acfGS0tnEWwg	\N	\N	\N	\N	10	2025-07-11 18:10:53.405	2025-07-11 18:10:53.486185	\N	Guest	User	ui9JVDITP6S5cmgSaxJia1JRtk9lSF87	2025-07-11 18:10:53.406	\N	\N	t	t
guest_GzZAnQyY677k	\N	\N	\N	\N	10	2025-07-11 18:26:14.975	2025-07-11 18:26:15.044259	\N	Guest	User	Bd7GNP8f5lB5l37RttLOMKHBXbM1FHyY	2025-07-11 18:28:19.14	\N	\N	t	t
guest_BYNYNOFOLCHR	\N	\N	\N	\N	10	2025-07-11 18:28:27.414	2025-07-11 18:28:27.510164	\N	Guest	User	wswdPO8DpciyImxhFuJc7jFtkhPSkyYx	2025-07-11 18:28:27.414	\N	\N	t	t
guest_c8lei1OpswEf	\N	\N	\N	\N	10	2025-07-11 18:21:47.282	2025-07-11 18:21:47.351158	\N	Guest	User	1uHAuem3k7jnmodJm_iq-Dmm8vNhdRDP	2025-07-11 18:21:47.282	\N	\N	t	t
guest_7FLUPQUEa7Hw	\N	\N	\N	\N	10	2025-07-11 18:23:32.511	2025-07-11 18:23:32.584731	\N	Guest	User	AWyl1BI04FbSCE12nUQmF9F9PPJc6cjm	2025-07-11 18:23:32.511	\N	\N	t	t
guest_Qc9qFzouwDwx	\N	\N	\N	\N	10	2025-07-11 18:10:24.39	2025-07-11 18:10:24.444904	\N	Guest	User	7R4pheCfEuDSOCLqa2wMII38SFhexGIV	2025-07-11 18:10:24.39	\N	\N	t	t
guest_RKtatuAA8Q9S	\N	\N	\N	\N	10	2025-07-11 17:30:49.785	2025-07-11 17:30:49.858738	\N	Guest	User	h8OeCxJM-SZlU7m2UQB8mY2pp7YvJzHd	2025-07-11 17:30:49.785	\N	\N	t	t
guest_3rOuBXVLlOIh	\N	\N	\N	\N	10	2025-07-11 17:30:55.815	2025-07-11 17:30:55.885386	\N	Guest	User	BSZnEasUN0YOxCbiXJYcz0Epoy5eXIAa	2025-07-11 17:30:55.815	\N	\N	t	t
guest_hzLU40tP4AqI	\N	\N	\N	\N	10	2025-07-11 17:31:30.573	2025-07-11 17:31:30.646928	\N	Guest	User	wgyC1SbqGpfNnEneS_sT1KBSs9i047WJ	2025-07-11 17:31:30.573	\N	\N	t	t
guest_u23hTJkxCA0U	\N	\N	\N	\N	10	2025-07-11 18:14:32.497	2025-07-11 18:14:32.562118	\N	Guest	User	O8v5A90bamL6J36DdbkTPLF-QsSXuTyT	2025-07-11 18:14:32.497	\N	\N	t	t
guest_ahGkRYe5nWFk	\N	\N	\N	\N	10	2025-07-11 18:10:23.902	2025-07-11 18:10:23.982081	\N	Guest	User	RjAKu7zgWro1sGVOUEgCaQn_5WCGZTWj	2025-07-11 18:10:24.506	\N	\N	t	t
guest_9_edYQAv5tvI	\N	\N	\N	\N	10	2025-07-11 18:10:24.397	2025-07-11 18:10:24.454311	\N	Guest	User	gYIYHoZ4ASLYmX5fXpC3rMOkpgI7aAzM	2025-07-11 18:10:24.545	\N	\N	t	t
guest_BnYZ_f9yrbHG	\N	\N	\N	\N	10	2025-07-11 18:10:24.399	2025-07-11 18:10:24.453604	\N	Guest	User	n2O_K4P2-ShOaJragrDF2akAsPtQLUjh	2025-07-11 18:10:24.559	\N	\N	t	t
guest_GTcIOq5N2lT8	\N	\N	\N	\N	10	2025-07-11 18:11:10.438	2025-07-11 18:11:10.502208	\N	Guest	User	zKVp6rglRoCSHu5FbaBxZ3ojjmv53F7X	2025-07-11 18:11:10.438	\N	\N	t	t
guest_ASZOket1aXvu	\N	\N	\N	\N	10	2025-07-11 18:26:47.545	2025-07-11 18:26:47.621924	\N	Guest	User	GP4ON2sI1wwR8Y39xAgVRskALK8w3qPB	2025-07-11 18:26:47.545	\N	\N	t	t
guest_E2Ntb7ftuKRX	\N	\N	\N	\N	10	2025-07-11 18:58:54.517	2025-07-11 18:58:54.656527	\N	Guest	User	4Dnlmz-He4ne4KwnEsqnCmTefR5h7ky-	2025-07-11 18:58:56.495	\N	\N	t	t
guest_cYXervu7U6eY	\N	\N	\N	\N	10	2025-07-11 18:40:58.957	2025-07-11 18:40:58.993638	\N	Guest	User	jti9bOw_YglWQ_scw_Jo1i5LK8R6a8WQ	2025-07-11 18:40:58.957	\N	\N	t	t
guest_Ey2jmf5jIHQa	\N	\N	\N	\N	10	2025-07-11 19:33:56.796	2025-07-11 19:33:56.832631	\N	Guest	User	ftqUznblQzUCQ3xCRphVNISzR9yd4G_a	2025-07-11 21:18:05.556	\N	\N	t	t
guest_0xacz9ndHQsx	\N	\N	\N	\N	10	2025-07-11 18:21:56.941	2025-07-11 18:21:57.010928	\N	Guest	User	H7cq46pvQJUbk9AAxrlb7F3qDV3CCWLs	2025-07-11 18:21:56.941	\N	\N	t	t
guest_edsuEAaIrgZL	\N	\N	\N	\N	10	2025-07-11 18:10:24.425	2025-07-11 18:10:24.484302	\N	Guest	User	q-PxK7lmS5jqBp8VmI5dTJ1hpDDp2fc5	2025-07-11 18:26:04.42	\N	\N	t	t
guest_9JCT-8zgMXBL	\N	\N	\N	\N	10	2025-07-11 19:31:37.584	2025-07-11 19:31:37.619537	\N	Guest	User	nso56jjrQIwyu-8tq9t0dqrCubVTo3cQ	2025-07-11 19:32:19.922	\N	\N	t	t
guest_GzawwlMnjhmr	\N	\N	\N	\N	10	2025-07-11 17:23:43.216	2025-07-11 17:23:43.374805	\N	Guest	User	SOzLefEy35mMdkYV8D_XNQYlZmh5EDT1	2025-07-11 17:23:50.746	\N	\N	t	t
guest_hC8_xQbzkdwo	\N	\N	\N	\N	10	2025-07-11 17:24:04.223	2025-07-11 17:24:04.295662	\N	Guest	User	Ftfy4gRhi6UKLjbrtweXSFQc2K4A_UOh	2025-07-11 17:24:04.223	\N	\N	t	t
guest_IcSqSIrfzCoU	\N	\N	\N	\N	10	2025-07-11 17:24:24.423	2025-07-11 17:24:24.49554	\N	Guest	User	Gw3oMQvkuztQr96csL9ASHt5qFhN1AQJ	2025-07-11 17:24:24.423	\N	\N	t	t
guest_3qwMfzKrp-Yr	\N	\N	\N	\N	10	2025-07-11 17:24:43.509	2025-07-11 17:24:43.583138	\N	Guest	User	VWKCL1Q6OkHhUYJGpoVWSRA2s5FEmW5q	2025-07-11 17:24:43.509	\N	\N	t	t
guest_Ny1dpmDaYy91	\N	\N	\N	\N	10	2025-07-11 18:26:20.509	2025-07-11 18:26:20.974898	\N	Guest	User	GXtH1V_414d5PfCes7KOIV6bWcblmxAH	2025-07-11 18:26:20.509	\N	\N	t	t
guest_P1MVLZed3wxl	\N	\N	\N	\N	10	2025-07-11 18:12:51.44	2025-07-11 18:12:51.509227	\N	Guest	User	MX-rRig6HlbMHwohZvHHFM66wn5cTeZj	2025-07-11 18:12:51.44	\N	\N	t	t
guest__N2zi6lhpyoN	\N	\N	\N	\N	10	2025-07-11 18:22:04.324	2025-07-11 18:22:04.392894	\N	Guest	User	pxZRjWAq8ayYnfuWEjgAUo8YLiHzpEQ_	2025-07-11 18:22:04.324	\N	\N	t	t
guest_rygLryKLEF98	\N	\N	\N	\N	10	2025-07-11 18:40:28.362	2025-07-11 18:40:28.462686	\N	Guest	User	Rm_AFhOEyY8uX4AVVlH0MCYqamRxMPfz	2025-07-11 18:58:48.9	\N	\N	t	t
guest_y4mVwGutXv6B	\N	\N	\N	\N	10	2025-07-11 18:55:49.647	2025-07-11 18:55:49.682067	\N	Guest	User	ifErpihem_4KSNabI28_q6Ha4LC1UDOa	2025-07-11 19:32:21.914	\N	\N	t	t
guest_8fydHnunUDRH	\N	\N	\N	\N	10	2025-07-11 18:26:41.599	2025-07-11 18:26:41.668115	\N	Guest	User	AJEZsuq04MaiAtD_uq9oZD6PjPRCTeXn	2025-07-11 18:26:41.599	\N	\N	t	t
guest_gHGTmPOm2dAc	\N	\N	\N	\N	10	2025-07-11 18:28:28.433	2025-07-11 18:28:28.529401	\N	Guest	User	riORnsxvULZjwyRQNHWIzBOQ7_k-CVlw	2025-07-11 18:33:09.93	\N	\N	t	t
guest_1ewCEU2JRqRb	\N	\N	\N	\N	10	2025-07-11 19:28:07.605	2025-07-11 19:28:07.642112	\N	Guest	User	2UAM8HSWKaOEPaA0lArNj9yciUn_MFFR	2025-07-11 19:33:47.966	\N	\N	t	t
guest_EF1tTCep-DOl	\N	\N	\N	\N	10	2025-07-11 19:40:33.767	2025-07-11 19:40:33.80162	\N	Guest	User	LitIh9oppPUJ73ZOSdw6IvZ4f52CERkP	2025-07-11 19:40:33.767	\N	\N	t	t
guest_DXD9GLguNARK	\N	\N	\N	\N	10	2025-07-11 19:41:02.324	2025-07-11 19:41:02.359828	\N	Guest	User	XfIJ-XBMciJFDPKyn9dVrQyZIn6lVTiH	2025-07-11 19:41:02.324	\N	\N	t	t
guest_11ZJTZvq0vqd	\N	\N	\N	\N	10	2025-07-11 19:55:53.051	2025-07-11 19:55:53.08616	\N	Guest	User	cHLzg8WBlEz49-w_RfNbqkI7CxJGkYdp	2025-07-11 19:55:53.051	\N	\N	t	t
guest_Rb7d2HFtxFQ-	\N	\N	\N	\N	10	2025-07-11 20:01:37.702	2025-07-11 20:01:37.736506	\N	Guest	User	Ep7-bAKpWQCBqPvP_715KHPbh5mhkpNh	2025-07-11 20:01:37.702	\N	\N	t	t
guest_2RlmPetz9vkF	\N	\N	\N	\N	10	2025-07-11 20:12:25.964	2025-07-11 20:12:25.999425	\N	Guest	User	JbfAREx0ANZ1ioMXS1KuJ8XJ8ZYwIBlS	2025-07-11 20:12:25.964	\N	\N	t	t
guest_7HnM5yorJ8Yu	\N	\N	\N	\N	10	2025-07-11 21:14:47.363	2025-07-11 21:14:47.398416	\N	Guest	User	uj3ycD77PkG6VPGDcd9SUNX3L83OsHa4	2025-07-11 21:14:47.363	\N	\N	t	t
guest_sZmp13vNkVHf	\N	\N	\N	\N	10	2025-07-11 21:23:35.647	2025-07-11 21:23:35.76293	\N	Guest	User	tpCaFMx200PNstwJkKqJB3jt62M9ocFK	2025-07-11 21:23:35.647	\N	\N	t	t
guest_8tO710_NgyhU	\N	\N	\N	\N	10	2025-07-11 19:41:02.326	2025-07-11 19:41:02.360779	\N	Guest	User	-mKC2ASI5QZvWdG9Ibry1FRKB4swU5xk	2025-07-11 21:23:36.747	\N	\N	t	t
guest_eJRb4vVk8QaF	\N	\N	\N	\N	10	2025-07-11 21:23:39.139	2025-07-11 21:23:39.224343	\N	Guest	User	Lo-s35dRHVfVavFw0dMHBo-fShBEameS	2025-07-11 21:23:39.139	\N	\N	t	t
guest_SqwfXdoyXgeB	\N	\N	\N	\N	10	2025-07-11 21:37:09.366	2025-07-11 21:37:09.398715	\N	Guest	User	fzFSUQyPBA0mADiizRU5-Jj8uCn2mD0m	2025-07-11 21:37:19.699	\N	\N	t	t
guest_s2SWJp9b2pY-	\N	\N	\N	\N	10	2025-07-11 21:30:20.832	2025-07-11 21:30:20.913268	\N	Guest	User	sHI4jaEchIuuy9dHvSLDO25EMpz-0NQq	2025-07-11 21:30:20.832	\N	\N	t	t
guest_A7kv2nePwIy5	\N	\N	\N	\N	10	2025-07-11 21:32:53.403	2025-07-11 21:32:53.484066	\N	Guest	User	rbbJKR94qAi7hPb_AXCxGQG6a9dfAhE-	2025-07-11 21:32:53.403	\N	\N	t	t
guest_gZx_sqLIgHyM	\N	\N	\N	\N	10	2025-07-11 21:18:13.853	2025-07-11 21:18:13.888342	\N	Guest	User	x92N782qIJymOX7Zj4sKR1TV3Y7ze-Sx	2025-07-11 21:18:18.774	\N	\N	t	t
guest_cdOMbuIAyAM7	\N	\N	\N	\N	10	2025-07-11 21:35:00.457	2025-07-11 21:35:00.497374	\N	Guest	User	eUOHviP_VvgaqPvaNqmdC2tPWpeDUqZv	2025-07-11 22:51:52.498	\N	\N	t	t
guest_RnYWmrIiDJG4	\N	\N	\N	\N	10	2025-07-11 21:30:24.306	2025-07-11 21:30:24.386899	\N	Guest	User	Aj_fXpzGYKZE09c9wF1iESHuwrswg-lb	2025-07-11 21:30:24.306	\N	\N	t	t
guest_hB3bnFD_aent	\N	\N	\N	\N	10	2025-07-11 18:58:55.086	2025-07-11 18:58:55.218102	\N	Guest	User	5cZ9RnlBGAJcAbNIfLjVNIdQPs9HiM9W	2025-07-11 21:09:26.347	\N	\N	t	t
guest_ZF8uJTvA1QIO	\N	\N	\N	\N	10	2025-07-11 21:31:16.638	2025-07-11 21:31:16.673187	\N	Guest	User	1BNfyw24Yz8KR2ExhTo1ZCfrfJ_MNrHT	2025-07-11 21:31:16.638	\N	\N	t	t
guest_VHdAiP-XTDaf	\N	\N	\N	\N	10	2025-07-11 21:30:28.32	2025-07-11 21:30:28.402305	\N	Guest	User	yCQd1yoPLCGVTgG4NBLtRfROuziUGb9E	2025-07-11 21:30:28.32	\N	\N	t	t
guest_THAFEtjD3us8	\N	\N	\N	\N	10	2025-07-11 22:11:15.198	2025-07-11 22:11:15.233822	\N	Guest	User	1PGBerCNwxBxoTjvaMGpQql9G0PoeSb4	2025-07-11 23:10:34.824	\N	\N	t	t
guest_BzW6190iH331	\N	\N	\N	\N	10	2025-07-11 21:15:23.3	2025-07-11 21:15:23.334918	\N	Guest	User	-6iznSmsbBU-JJVDEtqzQUGrY5RqdlWV	2025-07-11 21:15:23.3	\N	\N	t	t
guest_wnRjRmOnVOmY	\N	\N	\N	\N	10	2025-07-11 21:35:09.556	2025-07-11 21:35:09.595256	\N	Guest	User	rQdDw1Ejcys73yh5ptANq14EkUXTnFzh	2025-07-11 21:35:09.556	\N	\N	t	t
guest_tfRMgHDjTP1q	\N	\N	\N	\N	10	2025-07-11 21:35:09.573	2025-07-11 21:35:09.608233	\N	Guest	User	N3sM2Rg3ptdwhBJh9Lf9KkUy9FlgzN5Y	2025-07-11 21:35:09.573	\N	\N	t	t
guest_8lgNqSxfJoz0	\N	\N	\N	\N	10	2025-07-11 21:35:09.58	2025-07-11 21:35:09.615747	\N	Guest	User	6Vh6I-FzlVH8ycDE7nsn0Ngg7AhP0frj	2025-07-11 21:35:09.58	\N	\N	t	t
guest_sWEn50BVqd-_	\N	\N	\N	\N	10	2025-07-11 22:15:08.045	2025-07-11 22:15:08.080976	\N	Guest	User	tO7Jyg1q6Xw8SjxMm9of3MdJ5-G6WQpq	2025-07-11 22:15:08.045	\N	\N	t	t
guest_YgAp9iEReRwe	\N	\N	\N	\N	10	2025-07-11 21:24:19.082	2025-07-11 21:24:19.164295	\N	Guest	User	JQxCIeW2pJq9qElhmHWZVmD5he2n1z6u	2025-07-11 21:24:19.082	\N	\N	t	t
guest_kJTkVy01zdKS	\N	\N	\N	\N	10	2025-07-11 21:24:22.752	2025-07-11 21:24:22.855162	\N	Guest	User	CHldGxrvKtzCgOI3vjDe7VkTJkl2_rOb	2025-07-11 21:24:22.752	\N	\N	t	t
guest_9xE0NwuqKD7p	\N	\N	\N	\N	10	2025-07-11 21:27:17.806	2025-07-11 21:27:17.890247	\N	Guest	User	S0Ze4NU4UjYoQYVZhj1WlGnKyt2heYKm	2025-07-11 21:27:17.806	\N	\N	t	t
guest_2bxwIsPUazu9	\N	\N	\N	\N	10	2025-07-11 21:35:46.927	2025-07-11 21:35:46.95843	\N	Guest	User	JIGQLbVe82PL9k1qbdacjRP8ewzMGL1n	2025-07-11 21:35:46.927	\N	\N	t	t
guest_GIFwUH-QWGfT	\N	\N	\N	\N	10	2025-07-11 21:36:20.658	2025-07-11 21:36:20.689801	\N	Guest	User	HuhkbbNowxmc9lLlnu9VWfWD_xycVvVR	2025-07-11 21:36:20.658	\N	\N	t	t
guest_oi-A2Qv7GvvV	\N	\N	\N	\N	10	2025-07-11 21:27:21.227	2025-07-11 21:27:21.307718	\N	Guest	User	DCOly32btfZg1r1d5vV6TWMSyftxq4s_	2025-07-11 21:27:21.227	\N	\N	t	t
guest_adJubkzQEXZE	\N	\N	\N	\N	10	2025-07-11 21:09:33.006	2025-07-11 21:09:33.099507	\N	Guest	User	NRvNVF6Dz8Ew8E8wKUoVzjcqFZQkuLwj	2025-07-11 21:13:59.638	\N	\N	t	t
guest_soc0By15y3lB	\N	\N	\N	\N	10	2025-07-11 21:15:50.384	2025-07-11 21:15:50.418362	\N	Guest	User	vMvVYsBtaOQWY8JWk5KkRZKYrgrGPPr0	2025-07-11 21:15:50.384	\N	\N	t	t
guest_rRMsZqS1oYht	\N	\N	\N	\N	10	2025-07-11 21:23:45.648	2025-07-11 21:23:45.684224	\N	Guest	User	cTBP7-POHSwBffEg8c7D2-AcU-KB_tHu	2025-07-11 21:34:51.294	\N	\N	t	t
guest_013lKfsa3vXY	\N	\N	\N	\N	10	2025-07-11 21:27:24.08	2025-07-11 21:27:24.162307	\N	Guest	User	qYqRH5oMS-WT7Y47VXrwfmO6xX_sQl0R	2025-07-11 21:27:24.08	\N	\N	t	t
guest_YVyTkz8Aq4Yx	\N	\N	\N	\N	10	2025-07-11 21:30:50.072	2025-07-11 21:30:50.151886	\N	Guest	User	YmMYN-o9PUYzehY1-rJuHLV5O0IcJCa0	2025-07-11 21:30:50.072	\N	\N	t	t
guest_JfrEqthAScYj	\N	\N	\N	\N	10	2025-07-11 21:27:26.738	2025-07-11 21:27:26.819004	\N	Guest	User	hazzwRQz4M_aht0dooeGvI3ZhHGsfCRo	2025-07-11 21:27:26.738	\N	\N	t	t
guest__hn-BgVRar9v	\N	\N	\N	\N	10	2025-07-11 21:24:42.865	2025-07-11 21:24:42.948664	\N	Guest	User	JdGB-Ue_BC929ZVuxgfgDeaYuiZsAhu3	2025-07-11 21:24:42.865	\N	\N	t	t
guest_UdsRffjf3K_3	\N	\N	\N	\N	10	2025-07-11 21:27:31.703	2025-07-11 21:27:31.784721	\N	Guest	User	cy_GZNrx64lWr9JodjYqb2iLD0n1_RhA	2025-07-11 21:27:31.703	\N	\N	t	t
guest_vSDIMa91U2ep	\N	\N	\N	\N	10	2025-07-11 21:35:00.107	2025-07-11 21:35:00.162715	\N	Guest	User	i8b0bfxa_zGNE0PYG9w-M5UZ1kTpdU_O	2025-07-11 21:35:00.107	\N	\N	t	t
guest_SSwXGgozfQ-w	\N	\N	\N	\N	10	2025-07-11 21:26:20.272	2025-07-11 21:26:20.307546	\N	Guest	User	fRE8fxuaQnVDFcy3eH73jeENMOe9BxxI	2025-07-11 21:26:20.272	\N	\N	t	t
guest_bD6uMsMV-1V_	\N	\N	\N	\N	10	2025-07-11 21:27:34.942	2025-07-11 21:27:35.023187	\N	Guest	User	LoCeYOdYC9VZ-K2m65Iw4JfSRHD5SbrG	2025-07-11 21:27:34.942	\N	\N	t	t
guest_zkHmoNnMa59p	\N	\N	\N	\N	10	2025-07-11 21:30:56.315	2025-07-11 21:30:56.396198	\N	Guest	User	TVKcOw_BDPIGp9Un1qqiwevWmuY_KkyC	2025-07-11 21:30:56.315	\N	\N	t	t
guest_kOri5UcI1BQX	\N	\N	\N	\N	10	2025-07-11 21:31:00.411	2025-07-11 21:31:00.493876	\N	Guest	User	KkTu4BlzPvqvEIKO6mwF84O2FP3mKzzO	2025-07-11 21:31:00.411	\N	\N	t	t
guest_BnRMN2B3Nhmp	\N	\N	\N	\N	10	2025-07-11 21:23:24.339	2025-07-11 21:23:24.427457	\N	Guest	User	IxTkan3pt3vGNiTEupMyoAyLvJhbqm77	2025-07-11 21:23:24.339	\N	\N	t	t
guest_VVBd_D0_uTXh	\N	\N	\N	\N	10	2025-07-11 21:28:55.753	2025-07-11 21:28:55.834959	\N	Guest	User	4QvVggsKxfaOx2__bpkgjHRfWzHVM7wg	2025-07-11 21:28:55.753	\N	\N	t	t
guest_qlxul44hnSgQ	\N	\N	\N	\N	10	2025-07-11 21:36:20.709	2025-07-11 21:36:20.740744	\N	Guest	User	8Vz7_Cng8kk3wFIv-AkDBwnywYXTrFV7	2025-07-11 21:36:20.709	\N	\N	t	t
guest_XgMV8nYfMEkF	\N	\N	\N	\N	10	2025-07-11 21:23:29.053	2025-07-11 21:23:29.136655	\N	Guest	User	E0UX3h85v2FzFx7v0qgMBGZ-WxLfrXNP	2025-07-11 21:23:29.053	\N	\N	t	t
guest_uAXVH8PY05FT	\N	\N	\N	\N	10	2025-07-11 21:14:47.286	2025-07-11 21:14:47.321583	\N	Guest	User	EoTRpLCQoL7FrpJ67mKqWgCsJeyWzuKl	2025-07-11 21:14:47.286	\N	\N	t	t
guest_FFT7fEJeKk6Z	\N	\N	\N	\N	10	2025-07-11 21:36:20.886	2025-07-11 21:36:20.916719	\N	Guest	User	lywe4ajzq8wFiXq3VISRMojeOULypJ1d	2025-07-11 21:36:20.886	\N	\N	t	t
guest_qNe9_R2t2xPa	\N	\N	\N	\N	10	2025-07-11 21:14:47.288	2025-07-11 21:14:47.32458	\N	Guest	User	ol7n_lnr1wFZM9D1qcQuGUGSYYvurNwA	2025-07-11 21:14:47.288	\N	\N	t	t
guest_G0j3Herg74l-	\N	\N	\N	\N	10	2025-07-11 21:34:59.696	2025-07-11 21:34:59.737785	\N	Guest	User	r6aFRq4peQF8x0dAyhBXC8nGvYd8df7t	2025-07-11 21:35:02.049	\N	\N	t	t
guest_Bo7ndocOnvQ_	\N	\N	\N	\N	10	2025-07-11 22:48:53.026	2025-07-11 22:48:53.06061	\N	Guest	User	o7bdLcGK7s3DNUS6U-e4Ksy6121pl4FW	2025-07-11 22:48:53.026	\N	\N	t	t
guest_C3N5weXV8jaJ	\N	\N	\N	\N	10	2025-07-11 21:30:12.359	2025-07-11 21:30:12.441593	\N	Guest	User	DGRd5nK5wM389cOF0TwlaKlS9Yr9f4tV	2025-07-11 21:30:12.359	\N	\N	t	t
guest_ZU6OvkLWKPch	\N	\N	\N	\N	10	2025-07-11 21:38:01.432	2025-07-11 21:38:01.468344	\N	Guest	User	afUfW5e-_RBVPRkDDrrLsEJN_RXFsxK3	2025-07-11 21:38:01.432	\N	\N	t	t
guest_ImGVD_e5fps3	\N	\N	\N	\N	10	2025-07-11 21:36:20.926	2025-07-11 21:36:20.957775	\N	Guest	User	kCXLpI-7aaFSpzrp4EHLnlSHRChc1cA5	2025-07-11 21:36:20.926	\N	\N	t	t
guest_qJddshaXdmIa	\N	\N	\N	\N	10	2025-07-11 21:36:21	2025-07-11 21:36:21.032671	\N	Guest	User	eIZLEU0bhFv2hLvLRD8LwBrDsaGAI_EM	2025-07-11 21:36:21	\N	\N	t	t
guest_4Is_cC28uND5	\N	\N	\N	\N	10	2025-07-11 21:36:21.219	2025-07-11 21:36:21.251703	\N	Guest	User	XK9KRWJbbQVJDDfQ1mzXfbl85CehZjJb	2025-07-11 21:36:21.219	\N	\N	t	t
guest_Sx5MIPBlEgE3	\N	\N	\N	\N	10	2025-07-11 23:12:06.414	2025-07-11 23:12:06.448163	\N	Guest	User	NgBq0ivSwM4uH6CaTLT1fuV3YV3vPVJT	2025-07-11 23:12:06.414	\N	\N	t	t
guest__KmPnsFSTJCj	\N	\N	\N	\N	10	2025-07-11 23:12:08.379	2025-07-11 23:12:08.424455	\N	Guest	User	zOi5HSwhF2JsPSmhYsbO13PtUQK9wTpI	2025-07-11 23:12:45.125	\N	\N	t	t
guest_8_YcncpjPQg2	\N	\N	\N	\N	10	2025-07-11 23:12:35.242	2025-07-11 23:12:35.285987	\N	Guest	User	T1hfjJEQ4btOKwlWDbnywVWf6tAsnEdG	2025-07-11 23:12:35.242	\N	\N	t	t
guest_yhz2t5bGrJR1	\N	\N	\N	\N	10	2025-07-11 23:12:40.111	2025-07-11 23:12:40.155012	\N	Guest	User	95S4Xs-Nx6fBorUpi1g6uHWEIbNqGllP	2025-07-11 23:12:40.111	\N	\N	t	t
guest_FmJzWOolqYcY	\N	\N	\N	\N	10	2025-07-11 23:12:55.66	2025-07-11 23:12:55.706383	\N	Guest	User	KSlWiqRFaEkstH4Afnv_o-nEqbH4VM4u	2025-07-11 23:12:55.66	\N	\N	t	t
guest_B6rvRsdCslG9	\N	\N	\N	\N	10	2025-07-11 23:50:07.089	2025-07-11 23:50:07.190769	\N	Guest	User	pMfplZgeXZHSkAAWJ2XV-pMXIdyRsp50	2025-07-11 23:50:07.541	\N	\N	t	t
guest_gPbzBkG0g6hy	\N	\N	\N	\N	10	2025-07-11 23:24:58.094	2025-07-11 23:24:58.166716	\N	Guest	User	tpK8dkdEvwKhtr12iYKjfEzQe37_ipvG	2025-07-11 23:50:08.04	\N	\N	t	t
guest_Gs6leiWJVgQl	\N	\N	\N	\N	10	2025-07-11 21:34:59.976	2025-07-11 21:35:00.01288	\N	Guest	User	mxy6ECYLdK-9hUwHFcTxQmdXhZJegbbz	2025-07-11 23:24:28.869	\N	\N	t	t
guest_SJyZdvHm8BqA	\N	\N	\N	\N	10	2025-07-11 23:39:20.5	2025-07-11 23:39:20.536411	\N	Guest	User	BDwBAH1ybz8cdKnYJM992osERYXDSEwt	2025-07-11 23:39:20.5	\N	\N	t	t
guest_xKoESP7qPrLK	\N	\N	\N	\N	10	2025-07-11 23:39:22.528	2025-07-11 23:39:22.567964	\N	Guest	User	hrdQc2E6o3xzCNTr2I2jwf3bQxWGc0iT	2025-07-11 23:39:22.528	\N	\N	t	t
guest_zX7dOF1QITbg	\N	\N	\N	\N	10	2025-07-11 23:41:07.56	2025-07-11 23:41:07.591926	\N	Guest	User	CezPn7NHFVCS90KnRg8Ef7hgRjiNS4SM	2025-07-11 23:41:07.56	\N	\N	t	t
guest_nchK4xi-0zLX	\N	\N	\N	\N	10	2025-07-11 23:50:07.081	2025-07-11 23:50:07.184963	\N	Guest	User	_7pNjOa-nBK7w0gkuBV5TlbU2iy-wTQq	2025-07-11 23:50:07.081	\N	\N	t	t
guest_xsda8TP5uWf_	\N	\N	\N	\N	10	2025-07-11 23:50:07.09	2025-07-11 23:50:07.193676	\N	Guest	User	YrC8G0Hd5Y6box68Fp6JTfKbnur3uhA7	2025-07-11 23:50:07.09	\N	\N	t	t
guest_1Lp7zHA0T7CY	\N	\N	\N	\N	10	2025-07-11 23:50:07.088	2025-07-11 23:50:07.185516	\N	Guest	User	RCurJCwoup7FoLw0UtH-BVJ6AmwgmK0K	2025-07-11 23:50:07.088	\N	\N	t	t
guest_fJpqRugosldp	\N	\N	\N	\N	10	2025-07-11 23:50:07.082	2025-07-11 23:50:07.186882	\N	Guest	User	ns0kMNLsqXCeJ-oyV_wm7rAliez-yliG	2025-07-11 23:50:07.082	\N	\N	t	t
guest_BaYpGr0Dsbtt	\N	\N	\N	\N	10	2025-07-11 23:50:07.086	2025-07-11 23:50:07.188144	\N	Guest	User	7ThuijPLD4qT43pJI6XwpzYIHgWSAlOX	2025-07-11 23:50:07.086	\N	\N	t	t
guest_jNwzTh6BW6aF	\N	\N	\N	\N	10	2025-07-11 23:50:07.091	2025-07-11 23:50:07.194732	\N	Guest	User	pqbYHt6rXdLBexdljTjxhV5eaZ9k7YX6	2025-07-11 23:50:07.091	\N	\N	t	t
guest_JQZn6-AEM4pK	\N	\N	\N	\N	10	2025-07-11 23:50:07.092	2025-07-11 23:50:07.19441	\N	Guest	User	5Giqhkdv02AU3Lh2Ku0mRCF628HrBT4O	2025-07-11 23:50:07.092	\N	\N	t	t
guest_wOq3fERU302d	\N	\N	\N	\N	10	2025-07-11 23:50:07.093	2025-07-11 23:50:07.240839	\N	Guest	User	evofos1pOEICfZ5H6xgTTQ-90NZQW_gW	2025-07-11 23:50:07.093	\N	\N	t	t
guest_vGRsD9Mbw0oW	\N	\N	\N	\N	10	2025-07-11 23:12:53.644	2025-07-11 23:12:53.689925	\N	Guest	User	_bmoRv2GqPFx-K0C8EpSyDYt2VMLIELd	2025-07-11 23:16:31.752	\N	\N	t	t
guest_cjy94w0v3X9y	\N	\N	\N	\N	10	2025-07-11 23:50:07.143	2025-07-11 23:50:07.245156	\N	Guest	User	RJ6bJc03b6eWHuH9tVZa9U77oubWH9Oh	2025-07-11 23:50:07.143	\N	\N	t	t
guest_mIcq1sJOhA3t	\N	\N	\N	\N	10	2025-07-11 23:50:07.148	2025-07-11 23:50:07.268049	\N	Guest	User	Wjidy9gDFPPy6PYPEH2AAHRSRWjXmelM	2025-07-11 23:50:07.148	\N	\N	t	t
guest_U8juq6haxYXk	\N	\N	\N	\N	10	2025-07-11 23:50:07.16	2025-07-11 23:50:07.279897	\N	Guest	User	P4TGwBkXzUL8Rs0QgdXOLOAy8VWpI1wq	2025-07-11 23:50:07.16	\N	\N	t	t
guest__6vZrN3gF3Of	\N	\N	\N	\N	10	2025-07-11 23:50:07.154	2025-07-11 23:50:07.282843	\N	Guest	User	gc-xijyoDg0294RtCyk-fe49A8yB63I5	2025-07-11 23:50:07.154	\N	\N	t	t
guest_w1bdnL3mNFDV	\N	\N	\N	\N	10	2025-07-11 23:50:07.155	2025-07-11 23:50:07.28328	\N	Guest	User	7csRmx5bcE01aRQDrnpD5dYgWY3sKK40	2025-07-11 23:50:07.155	\N	\N	t	t
guest_NPC7Lv-yAoTx	\N	\N	\N	\N	10	2025-07-11 23:50:07.153	2025-07-11 23:50:07.283544	\N	Guest	User	RFftwKQ16q1sYHpv_BK5s27v8l_0d4YQ	2025-07-11 23:50:07.153	\N	\N	t	t
guest_zXYH7tKgLxG1	\N	\N	\N	\N	10	2025-07-11 23:50:07.151	2025-07-11 23:50:07.283876	\N	Guest	User	HjQ6_kyo9QvLMk9weoKjsBCRPorbOxuQ	2025-07-11 23:50:07.151	\N	\N	t	t
guest_mAqRC0fkGOAD	\N	\N	\N	\N	10	2025-07-11 23:50:07.159	2025-07-11 23:50:07.284312	\N	Guest	User	J4BQZqGG5IuPUmT0nHq-EYoSRPcevCtd	2025-07-11 23:50:07.159	\N	\N	t	t
guest_vshSK30tuKzT	\N	\N	\N	\N	10	2025-07-11 23:50:07.156	2025-07-11 23:50:07.284639	\N	Guest	User	ByDMF3E3MUdedHS9pwMjEaC_spDG7u7T	2025-07-11 23:50:07.156	\N	\N	t	t
guest_iyfW-D6HzD-S	\N	\N	\N	\N	10	2025-07-11 23:50:07.161	2025-07-11 23:50:07.306711	\N	Guest	User	AKy5atC8na3mweAbIvgYuX4bvQlcJjUB	2025-07-11 23:50:07.698	\N	\N	t	t
guest_FiyGoqDl5ASe	\N	\N	\N	\N	10	2025-07-11 23:50:07.208	2025-07-11 23:50:07.311352	\N	Guest	User	X8tFBpC7eSy_IqLX85UG1gLp2PuPR2Y1	2025-07-11 23:50:07.208	\N	\N	t	t
guest_bRk6Nc0R_dv9	\N	\N	\N	\N	10	2025-07-12 02:28:26.456	2025-07-12 02:28:26.49579	\N	Guest	User	QKsMkN-NAX-2nBlbF5SQAee5AkCLSN1H	2025-07-12 16:14:01.475	\N	\N	t	t
guest_rBUNQY4Lrk4I	\N	\N	\N	\N	10	2025-07-12 01:23:14.031	2025-07-12 01:23:14.292355	\N	Guest	User	TTh0SkhTfs0DFDN_cAp4j1rKtlNoEcdY	2025-07-12 02:21:59.127	\N	\N	t	t
guest_i8CRDKz_iWoa	\N	\N	\N	\N	10	2025-07-12 02:22:36.456	2025-07-12 02:22:36.489458	\N	Guest	User	fKaKGu8pdSrp10pF59r37yAZaD9T9biJ	2025-07-12 02:22:36.456	\N	\N	t	t
guest_JMmmLQZX9vNW	\N	\N	\N	\N	10	2025-07-12 00:51:04.756	2025-07-12 00:51:04.842309	\N	Guest	User	VawZeg1MjZsnIN4Ao9BcVHifgvEdoN5f	2025-07-12 00:56:22.999	\N	\N	t	t
guest_n0GqSHyu0ZJW	\N	\N	\N	\N	10	2025-07-12 01:41:13.462	2025-07-12 01:41:13.507512	\N	Guest	User	NePEhZI77TdMuV7V9upNXOF3b_FeJIoP	2025-07-12 01:41:13.462	\N	\N	t	t
guest_-OaJncagiVh_	\N	\N	\N	\N	10	2025-07-12 01:53:37.622	2025-07-12 01:53:37.660432	\N	Guest	User	eW2MzWR5ojLI8LgUYFVxDHCkIfWxk4xN	2025-07-12 01:53:37.622	\N	\N	t	t
guest_SjwGUWbA1Pni	\N	\N	\N	\N	10	2025-07-11 23:50:07.212	2025-07-11 23:50:07.332833	\N	Guest	User	ZPdng7UXC-puL8BqS-1ZllwYMYl-fvQV	2025-07-11 23:50:08.498	\N	\N	t	t
guest_9M0Vceh63zJv	\N	\N	\N	\N	10	2025-07-11 23:52:23.23	2025-07-11 23:52:23.32054	\N	Guest	User	UpjmJONp0K256sisw8uu1VjfYfZFCgI9	2025-07-11 23:52:23.23	\N	\N	t	t
guest_9oDRFOa2OkF4	\N	\N	\N	\N	10	2025-07-12 01:03:29.27	2025-07-12 01:03:29.470345	\N	Guest	User	QzOpf7x37vCKPpFvr0aFQyL9QkiZhNsj	2025-07-12 01:13:45.374	\N	\N	t	t
guest_zctpGqPR49RH	\N	\N	\N	\N	10	2025-07-12 01:13:51.505	2025-07-12 01:13:51.750811	\N	Guest	User	3BMA74F6_NcSU6IQGtz76DBuc0hvKLsC	2025-07-12 01:13:51.505	\N	\N	t	t
guest_t1QgfyUuN_3B	\N	\N	\N	\N	10	2025-07-12 02:07:21.557	2025-07-12 02:07:21.600621	\N	Guest	User	XLZ2QM57Luo67Q64EzFzBrkVhHimWFna	2025-07-12 02:07:21.557	\N	\N	t	t
guest_3OtpfLchqh90	\N	\N	\N	\N	10	2025-07-12 02:31:06.322	2025-07-12 02:31:06.366948	\N	Guest	User	NuWnhtg5dZV93QcfwdPwMTtU8ph_w2PF	2025-07-12 02:31:06.322	\N	\N	t	t
guest_uJi95-2J3a62	\N	\N	\N	\N	10	2025-07-12 01:13:51.868	2025-07-12 01:13:52.110784	\N	Guest	User	Pa31wRgSvi8v2NM537ERDorqw89E4793	2025-07-12 01:14:00.004	\N	\N	t	t
guest_nZv475QWhP6z	\N	\N	\N	\N	10	2025-07-12 01:31:33.655	2025-07-12 01:31:33.697837	\N	Guest	User	ffxbdeK8rer8d_0souHNw3thttDoKXZL	2025-07-12 02:27:41.351	\N	\N	t	t
guest_XU7tqi2eXnwI	\N	\N	\N	\N	10	2025-07-12 02:28:26.191	2025-07-12 02:28:26.226568	\N	Guest	User	HVN34_V60FYf8poV_fHICZ1sgMptoYQn	2025-07-12 02:28:26.634	\N	\N	t	t
guest_lpyC02NGjBse	\N	\N	\N	\N	10	2025-07-12 00:58:10.615	2025-07-12 00:58:10.777526	\N	Guest	User	be47t77gP8xAZl4FRIPXj8AiJSEYp2eL	2025-07-12 01:03:24.201	\N	\N	t	t
guest_jqAQTtWPkoam	\N	\N	\N	\N	10	2025-07-12 01:03:28.564	2025-07-12 01:03:28.748502	\N	Guest	User	EdMEdVauYbdMs6wcf1y_K_XyqGF-Tdac	2025-07-12 01:03:28.564	\N	\N	t	t
guest_HyBRKEOSdKNB	\N	\N	\N	\N	10	2025-07-12 00:56:29.577	2025-07-12 00:56:29.739221	\N	Guest	User	BisoyLmept67leQeh2bbVVSzG9GNzeGe	2025-07-12 00:58:04.034	\N	\N	t	t
guest_2xsZgnQ70abv	\N	\N	\N	\N	10	2025-07-12 02:14:25.112	2025-07-12 02:14:25.149212	\N	Guest	User	D9_uzvb-SgOQPShX4WzOA3k86sHBiFri	2025-07-12 02:14:25.112	\N	\N	t	t
guest_He0WXBlGsXfg	\N	\N	\N	\N	10	2025-07-12 01:24:04.518	2025-07-12 01:24:04.560195	\N	Guest	User	O-7iORD7n7ZFRS8X_LTlN6EKrcskG-5N	2025-07-12 01:24:04.518	\N	\N	t	t
guest_ib_MNWmYQm8K	\N	\N	\N	\N	10	2025-07-12 00:58:17.176	2025-07-12 00:58:17.341993	\N	Guest	User	SNoEZDg_0NLpKtBIwkm5P_-I2vzHl5yn	2025-07-12 00:58:17.176	\N	\N	t	t
guest_TdXZUAL51F5Y	\N	\N	\N	\N	10	2025-07-12 01:15:06.401	2025-07-12 01:15:06.643766	\N	Guest	User	LQ-sBi_J6hsIXFWf4v16NlT6-YGcc6La	2025-07-12 01:20:44.4	\N	\N	t	t
guest_oVVTJAQWBsN3	\N	\N	\N	\N	10	2025-07-12 02:30:39.275	2025-07-12 02:30:39.319632	\N	Guest	User	GsJClZsRUwuzSfu44w1AhvLIilyx5bLJ	2025-07-12 02:30:39.275	\N	\N	t	t
guest_PRNl9AH8kMjw	\N	\N	\N	\N	10	2025-07-12 02:51:58.397	2025-07-12 02:51:58.442132	\N	Guest	User	zNC3CBQBs4meFrTnTdkYRS9avM3fStxq	2025-07-12 03:33:39.395	\N	\N	t	t
guest_xe2QVRC2WurG	\N	\N	\N	\N	10	2025-07-12 03:44:55.029	2025-07-12 03:44:55.073752	\N	Guest	User	PjV7z9Sgp-SLwnyKAPppHAtLSfiFcHzZ	2025-07-12 03:44:55.029	\N	\N	t	t
guest_qIpatKU11glc	\N	\N	\N	\N	10	2025-07-12 03:49:50.46	2025-07-12 03:49:50.497703	\N	Guest	User	y8kz6NI_Ux8D6vdkQaTDo6YWsY4QHDMc	2025-07-12 03:49:50.46	\N	\N	t	t
guest_QZCgMH9OLBtT	\N	\N	\N	\N	10	2025-07-12 04:09:01.684	2025-07-12 04:09:01.720477	\N	Guest	User	1ngS1MdhcAosP5v0ZDUfQMb1lfBRDh5p	2025-07-12 04:09:01.684	\N	\N	t	t
guest_RJvOuXeK0UVa	\N	\N	\N	\N	10	2025-07-12 04:09:23.397	2025-07-12 04:09:23.441659	\N	Guest	User	AhPTI906VHqu-708iahfvEWpWBQxjRuA	2025-07-12 04:09:23.397	\N	\N	t	t
guest_yLMjajDrmRSC	\N	\N	\N	\N	10	2025-07-12 04:10:37.11	2025-07-12 04:10:37.152806	\N	Guest	User	1WvN_6FW99iFXwKbMewul3xmdSn5hzqs	2025-07-12 04:10:37.11	\N	\N	t	t
guest_DIdVWXraWJ19	\N	\N	\N	\N	10	2025-07-12 04:37:41.95	2025-07-12 04:37:41.983353	\N	Guest	User	9lwLw1lUcUuamH0Bm-zjNKYot-p7gVtN	2025-07-12 04:37:41.95	\N	\N	t	t
guest_4yI6K4mUlmGI	\N	\N	\N	\N	10	2025-07-12 05:18:06.417	2025-07-12 05:18:06.451312	\N	Guest	User	F0wJB9mbsdltSp0rTovp4nm__nqfa0DC	2025-07-12 05:18:06.417	\N	\N	t	t
guest_sZBUDTNvoPgI	\N	\N	\N	\N	10	2025-07-12 05:26:52.519	2025-07-12 05:26:52.553787	\N	Guest	User	aZptyPNdDyN0atEJ9Hl-hXfoGVVZJFDT	2025-07-12 05:26:59.24	\N	\N	t	t
guest_rY3EcbaGfM8l	\N	\N	\N	\N	10	2025-07-12 06:28:44.138	2025-07-12 06:28:44.173404	\N	Guest	User	WNzjiYcK9HffIIB38RelknGUP30b-D0m	2025-07-12 06:28:44.138	\N	\N	t	t
guest_9CAVdzuTWVsl	\N	\N	\N	\N	10	2025-07-12 06:33:23.318	2025-07-12 06:33:23.350738	\N	Guest	User	bfiqoTh-aSysP-x3kcAIjHY8wrvhaj3g	2025-07-12 06:33:23.318	\N	\N	t	t
guest_xot-N0OkPxSE	\N	\N	\N	\N	10	2025-07-12 06:46:52.484	2025-07-12 06:46:52.517255	\N	Guest	User	UGvZfnv957o1SkO1j8E44OA80RfxX8SQ	2025-07-12 06:46:52.484	\N	\N	t	t
guest_de8hoKoY0IUT	\N	\N	\N	\N	10	2025-07-12 07:10:17.716	2025-07-12 07:10:17.751659	\N	Guest	User	WBYdV-ScgHVd1rw5nGFxNNYFp3k1Hk5T	2025-07-12 07:10:17.716	\N	\N	t	t
guest_x2-e0p0kVhTy	\N	\N	\N	\N	10	2025-07-12 07:10:34.371	2025-07-12 07:10:34.408179	\N	Guest	User	Q3dBGgynpnRVIBjhDHoNHJLMxT3GUi0p	2025-07-12 07:10:34.371	\N	\N	t	t
guest_4FiYTEst9Ouc	\N	\N	\N	\N	10	2025-07-12 07:11:00.574	2025-07-12 07:11:00.60889	\N	Guest	User	lB0NMNjCj-otf7hb9SSCQ5NRICkYuRdc	2025-07-12 07:11:00.574	\N	\N	t	t
guest__tjr9Vy99GLY	\N	\N	\N	\N	10	2025-07-12 07:23:15.375	2025-07-12 07:23:15.409499	\N	Guest	User	ZtQ1ZU7lCcQYehlQ4uBprmH-YTiOZzlj	2025-07-12 07:23:15.375	\N	\N	t	t
guest_6e01cHoxUW2v	\N	\N	\N	\N	10	2025-07-12 07:32:47.473	2025-07-12 07:32:47.505929	\N	Guest	User	KAu2R2Szq5nTE20TuGYJNzLKZlyL1S3C	2025-07-12 07:32:47.473	\N	\N	t	t
guest_uyqTwA_YNL_s	\N	\N	\N	\N	10	2025-07-12 07:32:47.709	2025-07-12 07:32:47.742147	\N	Guest	User	EIF2TRkUzNUjoMk8m164mcNxTovEq7tJ	2025-07-12 07:32:47.709	\N	\N	t	t
guest_WKfC5eAjRHJX	\N	\N	\N	\N	10	2025-07-12 08:26:48.172	2025-07-12 08:26:48.204687	\N	Guest	User	mr-qUXwsDJeeafLhKAZsrio7Lt2hx-IK	2025-07-12 08:26:48.172	\N	\N	t	t
guest_wBib5y_vWJFU	\N	\N	\N	\N	10	2025-07-12 08:27:48.453	2025-07-12 08:27:48.48405	\N	Guest	User	WlcEXzmg1nGrjSF7f9TRIVNWGTN7j6ML	2025-07-12 08:27:48.453	\N	\N	t	t
guest_pt589tF4_z2C	\N	\N	\N	\N	10	2025-07-12 08:48:51.531	2025-07-12 08:48:51.56313	\N	Guest	User	LtE48ZqZJv14EWxWwOpeRmvShhifKVbc	2025-07-12 08:48:51.531	\N	\N	t	t
guest_C0FHk_3IqcQf	\N	\N	\N	\N	10	2025-07-12 09:03:03.569	2025-07-12 09:03:03.601614	\N	Guest	User	MwoLktAW3HWrAyET2dIumrFfy2SFTy8U	2025-07-12 09:03:03.569	\N	\N	t	t
guest_NAUKdQtwu4B9	\N	\N	\N	\N	10	2025-07-12 09:36:31.562	2025-07-12 09:36:31.596572	\N	Guest	User	7jxPozEhUe7mcP8yueics6mlTJZrxhNy	2025-07-12 09:36:31.562	\N	\N	t	t
guest_lKq94nsQYUSl	\N	\N	\N	\N	10	2025-07-12 09:49:55.233	2025-07-12 09:49:55.268284	\N	Guest	User	c5kfsbJl10Wg5vbCP48-oi1RB0CJhld2	2025-07-12 09:49:55.233	\N	\N	t	t
guest_1LwWPQI2EZGw	\N	\N	\N	\N	10	2025-07-12 10:29:39.648	2025-07-12 10:29:39.683124	\N	Guest	User	SjPQLieeFxX-iJO-RnfGHAUsipPPV-m5	2025-07-12 10:29:39.648	\N	\N	t	t
guest_VST6XeeIL2bL	\N	\N	\N	\N	10	2025-07-12 10:29:40.454	2025-07-12 10:29:40.48882	\N	Guest	User	RzVYIfAYV_b7sv9eVfzaioqBFg3ZinPg	2025-07-12 10:29:40.454	\N	\N	t	t
guest_ceBA4H_Uy1kk	\N	\N	\N	\N	10	2025-07-12 10:49:40.663	2025-07-12 10:49:40.697031	\N	Guest	User	8WACUB_t1P8kmNGnnoKiXtIVBgamvM7X	2025-07-12 10:49:40.663	\N	\N	t	t
guest_hke8Dupw6MnS	\N	\N	\N	\N	10	2025-07-12 11:06:54.031	2025-07-12 11:06:54.0633	\N	Guest	User	odaW9QNN6tV95Tfgu-RveRn_EZg7Xmms	2025-07-12 11:08:19.25	\N	\N	t	t
guest_E6ssViNbdUST	\N	\N	\N	\N	10	2025-07-12 11:36:16.792	2025-07-12 11:36:16.826631	\N	Guest	User	bQxTe5_zIFHj4WQt9uv6bHINO1v7mop8	2025-07-12 11:36:16.792	\N	\N	t	t
guest_zN-7i7qNxVu7	\N	\N	\N	\N	10	2025-07-12 12:05:52.299	2025-07-12 12:05:52.333647	\N	Guest	User	bwkwtl50HhrDwLfb3X3ogq1e3_A10PLB	2025-07-12 12:05:52.299	\N	\N	t	t
guest_D9sTZ9_l7Mjf	\N	\N	\N	\N	10	2025-07-12 12:06:09.215	2025-07-12 12:06:09.24982	\N	Guest	User	Z34V5Y7-sPGRNmRhw06NZCsI0vYyfZ_y	2025-07-12 12:06:09.215	\N	\N	t	t
guest_uX06CGd1dd3J	\N	\N	\N	\N	10	2025-07-12 12:32:52.365	2025-07-12 12:32:52.396191	\N	Guest	User	q42H9qx7avJWKHB7N9vJwVS44pvm09vk	2025-07-12 12:32:52.365	\N	\N	t	t
guest_gdn90YeXEld4	\N	\N	\N	\N	10	2025-07-12 12:58:30.682	2025-07-12 12:58:30.714867	\N	Guest	User	tXLRoOAJQs2uWq7U-uCWEXkbgb1Elbot	2025-07-12 12:58:30.682	\N	\N	t	t
guest_IMDJ6oRpbfc1	\N	\N	\N	\N	10	2025-07-12 13:02:48.355	2025-07-12 13:02:48.387629	\N	Guest	User	9Qtlgc7yC-B_pURSci9XqUJtf5NbUiP7	2025-07-12 13:02:48.355	\N	\N	t	t
guest_1Kl9Fqx0rfjN	\N	\N	\N	\N	10	2025-07-12 13:02:48.647	2025-07-12 13:02:48.679883	\N	Guest	User	Ypsa8fFb39epvEClImZ_SQmJaxC4QJU8	2025-07-12 13:02:48.647	\N	\N	t	t
guest_kncsEWNvhUEQ	\N	\N	\N	\N	10	2025-07-12 13:11:26.174	2025-07-12 13:11:26.209601	\N	Guest	User	3Z-ilemuu_HNoKwNMoD47Sap064hKRwi	2025-07-12 13:11:26.174	\N	\N	t	t
guest_UAOztkbHcgc2	\N	\N	\N	\N	10	2025-07-12 13:47:26.534	2025-07-12 13:47:26.568163	\N	Guest	User	yaO4N7vPCgx33O6Wr28mOzhjUxOHtFlg	2025-07-12 13:47:26.534	\N	\N	t	t
guest_nkhIRxMsSKk2	\N	\N	\N	\N	10	2025-07-12 14:00:56.754	2025-07-12 14:00:56.784916	\N	Guest	User	Ajht1nEG8kMeLppy7N8lZxl501E2yGVy	2025-07-12 14:00:56.754	\N	\N	t	t
guest_oFO7m79uqLT_	\N	\N	\N	\N	10	2025-07-12 15:44:30.837	2025-07-12 15:44:30.871294	\N	Guest	User	1GC-OIpittUEa_pkbBHlnuPCTcNYMzf2	2025-07-12 15:44:30.837	\N	\N	t	t
guest_PGiCIWjLuXB4	\N	\N	\N	\N	10	2025-07-12 15:45:45.511	2025-07-12 15:45:45.546587	\N	Guest	User	KH1tZZkN0q64_9N3wTygePuTU1qd44Fu	2025-07-12 15:45:45.511	\N	\N	t	t
guest__SEsdGVBJEiv	\N	\N	\N	\N	10	2025-07-12 15:51:36.068	2025-07-12 15:51:36.102367	\N	Guest	User	zrzkdUgwpx4hSZnMQf4YoXlLvBGm73BJ	2025-07-12 15:51:36.068	\N	\N	t	t
guest_1jtnnRF7LaXr	\N	\N	\N	\N	10	2025-07-12 15:51:37.513	2025-07-12 15:51:37.549508	\N	Guest	User	ZxSrNb4yX7qjHLLyj5C6hEnsGZHAou-c	2025-07-12 15:51:37.513	\N	\N	t	t
guest_yoGjPPQplcTd	\N	\N	\N	\N	10	2025-07-12 15:57:37.152	2025-07-12 15:57:37.185068	\N	Guest	User	fZnDhuNu0uy5Fbz5actFRVTcl7qqfZMW	2025-07-12 15:57:37.152	\N	\N	t	t
guest_EGdDJ5RLhMo1	\N	\N	\N	\N	10	2025-07-12 16:11:05.144	2025-07-12 16:11:05.177692	\N	Guest	User	HzklI_ISDzef3rB6cfMh6CglKglwElMy	2025-07-12 16:11:05.144	\N	\N	t	t
guest_Wi28NNog6nLp	\N	\N	\N	\N	10	2025-07-12 16:12:48.018	2025-07-12 16:12:48.048702	\N	Guest	User	NKy5eBhYRhzv0ANXTO4rLw9SYBduzwJc	2025-07-12 16:12:48.018	\N	\N	t	t
guest_3-yrRroTIdlN	\N	\N	\N	\N	10	2025-07-12 16:12:48.256	2025-07-12 16:12:48.287203	\N	Guest	User	BOxQ4BCPNpqGQWRk7vp9AGBIK-R1siIb	2025-07-12 16:12:48.256	\N	\N	t	t
guest_78X3PYhTxcug	\N	\N	\N	\N	10	2025-07-12 16:12:48.493	2025-07-12 16:12:48.524925	\N	Guest	User	GiOz_GA8nFE1FVoV37UloiI2kB1UuqRP	2025-07-12 16:12:48.493	\N	\N	t	t
guest_rFDGRdF4J7oL	\N	\N	\N	\N	10	2025-07-12 16:12:48.733	2025-07-12 16:12:48.763583	\N	Guest	User	UEmX8z0ryo4O20evCPHX-O_WHJMQePJp	2025-07-12 16:12:48.733	\N	\N	t	t
guest_QUCwv5ytk0m7	\N	\N	\N	\N	10	2025-07-12 16:12:48.971	2025-07-12 16:12:49.003183	\N	Guest	User	7U_5AeC2u1rx46eYZHQiHsJeDmTftfDB	2025-07-12 16:12:48.971	\N	\N	t	t
guest_74R5gLwPaFyW	\N	\N	\N	\N	10	2025-07-12 16:12:49.211	2025-07-12 16:12:49.243053	\N	Guest	User	Pb9lxpNsIs4KwQRXxB7bGX_4oHkZD7oA	2025-07-12 16:12:49.211	\N	\N	t	t
guest_B4EUWQs96m-F	\N	\N	\N	\N	10	2025-07-12 16:12:49.45	2025-07-12 16:12:49.482399	\N	Guest	User	ZceD7SGf25EkjhFv0mcO-sqQ_THs4W_N	2025-07-12 16:12:49.45	\N	\N	t	t
guest_oI_eTHSqDf1t	\N	\N	\N	\N	10	2025-07-12 16:12:49.69	2025-07-12 16:12:49.723275	\N	Guest	User	M5Qrrlv4wc007bMf049ML5C8ZLVpWjpQ	2025-07-12 16:12:49.69	\N	\N	t	t
guest_LYf6qPyIzk1d	\N	\N	\N	\N	10	2025-07-12 16:12:49.929	2025-07-12 16:12:49.960825	\N	Guest	User	R2cRQBCA--3kOzBr5_2uMUOfAt1KT0kz	2025-07-12 16:12:49.929	\N	\N	t	t
guest_Z9zv5kFId9XE	\N	\N	\N	\N	10	2025-07-12 16:12:50.17	2025-07-12 16:12:50.201552	\N	Guest	User	tJ9TeMPw0iswjqUhUop9Tlcy4at27C3t	2025-07-12 16:12:50.17	\N	\N	t	t
guest_sdqHvKUfjMDk	\N	\N	\N	\N	10	2025-07-12 16:12:50.406	2025-07-12 16:12:50.438629	\N	Guest	User	8rfZX4UcgQ640-2bf5PkmmOWy3UgI63Z	2025-07-12 16:12:50.406	\N	\N	t	t
guest_2cNBoYwAe2B8	\N	\N	\N	\N	10	2025-07-12 16:12:50.644	2025-07-12 16:12:50.676087	\N	Guest	User	79obG2LgOdBy2K2E-0cdeVpn42Q31RYA	2025-07-12 16:12:50.644	\N	\N	t	t
guest_NRTuxauNoGwc	\N	\N	\N	\N	10	2025-07-12 16:12:50.88	2025-07-12 16:12:50.91235	\N	Guest	User	5-bCTB0uVYG80Qh1bjZaI6Xpl1IQvU-s	2025-07-12 16:12:50.88	\N	\N	t	t
guest_8HRlZjYAsaMV	\N	\N	\N	\N	10	2025-07-12 16:12:51.116	2025-07-12 16:12:51.148704	\N	Guest	User	wnbrgYR-9bCrquVYEiNmWKqbIF3S69a3	2025-07-12 16:12:51.116	\N	\N	t	t
guest_xOcCuJSefXjX	\N	\N	\N	\N	10	2025-07-12 16:12:51.352	2025-07-12 16:12:51.382681	\N	Guest	User	LulD0kViaRW1OC3tv-4zqSmotX5s8QCp	2025-07-12 16:12:51.352	\N	\N	t	t
guest_n2Dprfosu0ad	\N	\N	\N	\N	10	2025-07-12 16:12:51.586	2025-07-12 16:12:51.616832	\N	Guest	User	1G7BtBzrt-xEwpZhAHdsOm8wYC21DW1Y	2025-07-12 16:12:51.586	\N	\N	t	t
guest_7GwTWv3e2nSo	\N	\N	\N	\N	10	2025-07-12 16:12:51.821	2025-07-12 16:12:51.854225	\N	Guest	User	31h2bI9JxJENaKMRvRDhU_AkquE5NLkI	2025-07-12 16:12:51.821	\N	\N	t	t
guest_PuOe7IfrfOVo	\N	\N	\N	\N	10	2025-07-12 16:12:52.059	2025-07-12 16:12:52.160979	\N	Guest	User	nziZaA1JUhJ9mGbraBocXVTdqTi08UTN	2025-07-12 16:12:52.059	\N	\N	t	t
guest_SMA5rDvoDeR7	\N	\N	\N	\N	10	2025-07-12 16:12:52.365	2025-07-12 16:12:52.396438	\N	Guest	User	lYn6nevQey5UHfbwfTD7vFUMB2qqeQqm	2025-07-12 16:12:52.365	\N	\N	t	t
guest_jRNIv0IXLA6c	\N	\N	\N	\N	10	2025-07-12 16:12:52.601	2025-07-12 16:12:52.632949	\N	Guest	User	YOJPB8hDmdN4JTuM8kw_8YZgBXtRLs3f	2025-07-12 16:12:52.601	\N	\N	t	t
guest_BKcG1cFxLzl0	\N	\N	\N	\N	10	2025-07-12 16:12:52.85	2025-07-12 16:12:52.881965	\N	Guest	User	nRUbTlocdpPx14-NgwM-MdGAHDfzmeAK	2025-07-12 16:12:52.85	\N	\N	t	t
guest_fhz12RKfOLOx	\N	\N	\N	\N	10	2025-07-12 16:12:53.085	2025-07-12 16:12:53.117265	\N	Guest	User	uoxP97xd_5G-YTTi458rY1F5fQvKXw07	2025-07-12 16:12:53.085	\N	\N	t	t
guest_uYJRA-r4vibP	\N	\N	\N	\N	10	2025-07-12 16:12:53.33	2025-07-12 16:12:53.362116	\N	Guest	User	VY-XuGlFewNCAfVhIW0rAG8Rm86dq5HZ	2025-07-12 16:12:53.33	\N	\N	t	t
guest_hTrx7f4qs9q9	\N	\N	\N	\N	10	2025-07-12 16:12:53.571	2025-07-12 16:12:53.60319	\N	Guest	User	cth6gYzNsf1zJMKZ_DMECLBWZT8IkbY-	2025-07-12 16:12:53.571	\N	\N	t	t
guest_b6quTrSgW45A	\N	\N	\N	\N	10	2025-07-12 16:12:53.808	2025-07-12 16:12:53.83933	\N	Guest	User	Wl56pNF-oh_cNoa4gyF-93xCEzoOjGaQ	2025-07-12 16:12:53.808	\N	\N	t	t
guest_TIsgj3WqOPCk	\N	\N	\N	\N	10	2025-07-12 16:12:54.047	2025-07-12 16:12:54.079173	\N	Guest	User	vsKOY2rde9sAqCcUc6llXInuxzbSQiu9	2025-07-12 16:12:54.047	\N	\N	t	t
guest_8R-Pi9pyYVCT	\N	\N	\N	\N	10	2025-07-12 16:12:54.288	2025-07-12 16:12:54.32074	\N	Guest	User	LjLf6aQU5WIZt3y9EDxpLTxOJPMYiPrk	2025-07-12 16:12:54.288	\N	\N	t	t
guest_T7rh-TxTclZK	\N	\N	\N	\N	10	2025-07-12 16:12:54.524	2025-07-12 16:12:54.555927	\N	Guest	User	PpGeApOt5kelB5wK8YfJU2WTX_BQnV1f	2025-07-12 16:12:54.524	\N	\N	t	t
guest_B-oShJKKz8yO	\N	\N	\N	\N	10	2025-07-12 16:12:54.763	2025-07-12 16:12:54.795275	\N	Guest	User	TU94CpPcuPOu309yro0SXRywM4hLpndL	2025-07-12 16:12:54.763	\N	\N	t	t
guest_kq7-Gw48_Cm-	\N	\N	\N	\N	10	2025-07-12 16:12:55.016	2025-07-12 16:12:55.04831	\N	Guest	User	yvdOYNdD8BGqhlbo_jO_Qr3ir2yvWTDp	2025-07-12 16:12:55.016	\N	\N	t	t
guest_2kl0B6yHaCE7	\N	\N	\N	\N	10	2025-07-12 16:12:55.253	2025-07-12 16:12:55.284676	\N	Guest	User	4f_EH2MBMcte65Y50WsLghkoXnCMRAGX	2025-07-12 16:12:55.253	\N	\N	t	t
guest_ibKqE8Jri22c	\N	\N	\N	\N	10	2025-07-12 16:12:55.49	2025-07-12 16:12:55.521368	\N	Guest	User	zkfUqRCpg-ZuS2_60LqpVkogUEa5wQx_	2025-07-12 16:12:55.49	\N	\N	t	t
guest__gTMEiWCKXvu	\N	\N	\N	\N	10	2025-07-12 16:12:55.725	2025-07-12 16:12:55.756727	\N	Guest	User	ZfgSu_Uqr8MYNwrHg626aVv7e1yimRmE	2025-07-12 16:12:55.725	\N	\N	t	t
guest_WuU0fsSV48Wd	\N	\N	\N	\N	10	2025-07-12 16:12:55.96	2025-07-12 16:12:55.992027	\N	Guest	User	P3dw2F4mu0D8MJ0HTmWCS30Cy7JIQERq	2025-07-12 16:12:55.96	\N	\N	t	t
guest_XYq_oZV2JC6M	\N	\N	\N	\N	10	2025-07-12 16:12:56.198	2025-07-12 16:12:56.230313	\N	Guest	User	5M2_I1Bw5TBv1YhOWiFtdd6Gt4lt9dxR	2025-07-12 16:12:56.198	\N	\N	t	t
guest_TYgL1pWmk_sx	\N	\N	\N	\N	10	2025-07-12 16:12:56.435	2025-07-12 16:12:56.467153	\N	Guest	User	jOA90bLzYuxxP-eBREGspd3EBgSHTd-z	2025-07-12 16:12:56.435	\N	\N	t	t
guest_CFkBgQxJXGr7	\N	\N	\N	\N	10	2025-07-12 16:12:56.673	2025-07-12 16:12:56.705135	\N	Guest	User	H4pPMCyFKmQddqGHabdt526bgWLIGlV_	2025-07-12 16:12:56.673	\N	\N	t	t
guest_juOje8NmjerK	\N	\N	\N	\N	10	2025-07-12 16:12:56.909	2025-07-12 16:12:56.999567	\N	Guest	User	_VpNlhfPxMA9UUCvdmGNaITBLWV0rYVB	2025-07-12 16:12:56.909	\N	\N	t	t
guest_3-a58WG-DAfM	\N	\N	\N	\N	10	2025-07-12 16:12:57.206	2025-07-12 16:12:57.237724	\N	Guest	User	fs0DjXqw_iVD0SbhvsCxbyHVU16ZYVaz	2025-07-12 16:12:57.206	\N	\N	t	t
guest_7hPKYWRom7kE	\N	\N	\N	\N	10	2025-07-12 16:12:57.442	2025-07-12 16:12:57.472891	\N	Guest	User	s852jI62sp-djvFX7WnHMjvGCKQU3jSe	2025-07-12 16:12:57.442	\N	\N	t	t
guest_WjSFLnOXhZwc	\N	\N	\N	\N	10	2025-07-12 16:12:57.676	2025-07-12 16:12:57.707996	\N	Guest	User	7gQr9n2eqIyPJWeqItJzpkzTNW3OYl26	2025-07-12 16:12:57.676	\N	\N	t	t
guest_yqM3EkiAVUkY	\N	\N	\N	\N	10	2025-07-12 16:12:57.912	2025-07-12 16:12:57.944109	\N	Guest	User	koh0zHrHIh42KfuchOqx7_WQOBuR67Zk	2025-07-12 16:12:57.912	\N	\N	t	t
guest_kU2ZdAGvx7-e	\N	\N	\N	\N	10	2025-07-12 16:12:58.15	2025-07-12 16:12:58.181487	\N	Guest	User	vnAFqRUt0clov53o3W2BxkV_Ry-hd_wV	2025-07-12 16:12:58.15	\N	\N	t	t
guest_BkAbGrC2k4tU	\N	\N	\N	\N	10	2025-07-12 16:12:58.386	2025-07-12 16:12:58.418348	\N	Guest	User	WLTE_VVvEXhTf5U7rThbz3Vh7Le3pVRx	2025-07-12 16:12:58.386	\N	\N	t	t
guest_7QNWa8nICMG9	\N	\N	\N	\N	10	2025-07-12 16:12:58.628	2025-07-12 16:12:58.65998	\N	Guest	User	KtVe-PLqJU_qjGvuOhdaKLtg-N6JskMN	2025-07-12 16:12:58.628	\N	\N	t	t
guest_9xxF9DN-TNNO	\N	\N	\N	\N	10	2025-07-12 16:12:58.865	2025-07-12 16:12:58.896038	\N	Guest	User	-Zlb6cRHvRpTtr5MaWgFgfdi3bSgSLRa	2025-07-12 16:12:58.865	\N	\N	t	t
guest_XP4OOi6p9Bwa	\N	\N	\N	\N	10	2025-07-12 16:12:59.1	2025-07-12 16:12:59.131188	\N	Guest	User	dtVqhVXKCqIPxPh-qRNylPlTA4sjh93p	2025-07-12 16:12:59.1	\N	\N	t	t
guest_WqqsraEhj5qv	\N	\N	\N	\N	10	2025-07-12 16:12:59.335	2025-07-12 16:12:59.367345	\N	Guest	User	Z4LLYOxY6KEMhCvfb0kMV1X6CHqRw12h	2025-07-12 16:12:59.335	\N	\N	t	t
guest_vNxAbIuppcM3	\N	\N	\N	\N	10	2025-07-12 16:12:59.571	2025-07-12 16:12:59.603005	\N	Guest	User	bXiT3BCftCv5h7ydkiq8nO4Y1ifiLbKm	2025-07-12 16:12:59.571	\N	\N	t	t
guest_zzsV0JYYFqSC	\N	\N	\N	\N	10	2025-07-12 16:12:59.808	2025-07-12 16:12:59.901573	\N	Guest	User	qVPTMmZM7D543_VIJlG6XrWjWa872roE	2025-07-12 16:12:59.808	\N	\N	t	t
guest_7xtolZxu2ncm	\N	\N	\N	\N	10	2025-07-12 16:13:00.106	2025-07-12 16:13:00.13696	\N	Guest	User	2gi1Y0yn0fZCWJBzB8EKoejJ7e5z0xpM	2025-07-12 16:13:00.106	\N	\N	t	t
guest_ntD0K6eA7JJJ	\N	\N	\N	\N	10	2025-07-12 16:13:00.351	2025-07-12 16:13:00.383583	\N	Guest	User	qkBPRcdyYjtATXUHXtaWVrvN8YZBjXud	2025-07-12 16:13:00.351	\N	\N	t	t
guest_Yuyxl3ioO7j0	\N	\N	\N	\N	10	2025-07-12 16:13:00.591	2025-07-12 16:13:00.622569	\N	Guest	User	NMri3-n77cswWY41uRM002UNqmJc2dh8	2025-07-12 16:13:00.591	\N	\N	t	t
guest_axOIphWxRPmh	\N	\N	\N	\N	10	2025-07-12 16:13:00.829	2025-07-12 16:13:00.860971	\N	Guest	User	XQJmE_D-uDl0CzdDJpZbW1kFv9ulw4Pd	2025-07-12 16:13:00.829	\N	\N	t	t
guest_z0qN8brz5Lyy	\N	\N	\N	\N	10	2025-07-12 16:13:01.068	2025-07-12 16:13:01.100248	\N	Guest	User	ryHBCQFQluTxaPpNFwJzNJ5brgp1Jayn	2025-07-12 16:13:01.068	\N	\N	t	t
guest_GHHS9Px-7c9H	\N	\N	\N	\N	10	2025-07-12 16:13:01.313	2025-07-12 16:13:01.345537	\N	Guest	User	23u_g3igPrIu3ceTXx11qnKoEImrZ0Ni	2025-07-12 16:13:01.313	\N	\N	t	t
guest_Blh8ofA5TOBT	\N	\N	\N	\N	10	2025-07-12 16:13:01.581	2025-07-12 16:13:01.613114	\N	Guest	User	vYP50uy63uR9dc60Yasgjbi0n69MrXXl	2025-07-12 16:13:01.581	\N	\N	t	t
guest_d_onax0XxYwN	\N	\N	\N	\N	10	2025-07-12 16:13:01.835	2025-07-12 16:13:01.867837	\N	Guest	User	LIahESpIVpjrXIyWqVMhG9hV7sxjlqWt	2025-07-12 16:13:01.835	\N	\N	t	t
guest_dyoFFsaW0khr	\N	\N	\N	\N	10	2025-07-12 16:13:02.092	2025-07-12 16:13:02.125169	\N	Guest	User	P92j69bgRXW76EfYJZqxBFvcg6wWnlwB	2025-07-12 16:13:02.092	\N	\N	t	t
guest_PS2inCM8IoAo	\N	\N	\N	\N	10	2025-07-12 16:13:02.445	2025-07-12 16:13:02.476904	\N	Guest	User	Fqn4jBT9yA0uMUjL6LUkz0cpC61TTSq1	2025-07-12 16:13:02.445	\N	\N	t	t
guest_Sk3OlVaBDXFs	\N	\N	\N	\N	10	2025-07-12 16:13:02.697	2025-07-12 16:13:02.731268	\N	Guest	User	RgVSaF9dSwnRxfkbb-AR-uXlyo-AABaJ	2025-07-12 16:13:02.697	\N	\N	t	t
guest_VvH2vyCOg6ne	\N	\N	\N	\N	10	2025-07-12 16:13:02.956	2025-07-12 16:13:02.988623	\N	Guest	User	sS8elAN4gGYAdf1rzhJm1hfxV0cxrzS7	2025-07-12 16:13:02.956	\N	\N	t	t
guest_GbANcGO9iUJG	\N	\N	\N	\N	10	2025-07-12 16:13:03.206	2025-07-12 16:13:03.238242	\N	Guest	User	2-RhyH1RiD3X_1fZwprH0quiamzZJmwy	2025-07-12 16:13:03.206	\N	\N	t	t
guest_E7VZx6xHZt0l	\N	\N	\N	\N	10	2025-07-12 16:13:03.453	2025-07-12 16:13:03.484331	\N	Guest	User	-TfNtqjmxMvuGmctI5_oM7ITENzPuujI	2025-07-12 16:13:03.453	\N	\N	t	t
guest_SJ6HEwyrlRfU	\N	\N	\N	\N	10	2025-07-12 16:13:03.69	2025-07-12 16:13:03.722398	\N	Guest	User	8Q52FvUop0AOWA1P0fOHpquUCIsXkgK4	2025-07-12 16:13:03.69	\N	\N	t	t
guest_SKCxLjal8g22	\N	\N	\N	\N	10	2025-07-12 16:13:03.926	2025-07-12 16:13:03.957691	\N	Guest	User	QihaGEpXCYqRUIpTntSyqWRHTqEUo_UG	2025-07-12 16:13:03.926	\N	\N	t	t
guest_MDoIYpkfwKvm	\N	\N	\N	\N	10	2025-07-12 16:13:04.166	2025-07-12 16:13:04.198401	\N	Guest	User	mJpUtMXIzrlNLcGL0PJ_1WdRk0eMGesz	2025-07-12 16:13:04.166	\N	\N	t	t
guest_yHPIwFjXz9Pr	\N	\N	\N	\N	10	2025-07-12 16:13:04.409	2025-07-12 16:13:04.44116	\N	Guest	User	lhV6NF__oXdznoQ_CIglj1tiaAiPILna	2025-07-12 16:13:04.409	\N	\N	t	t
guest_ybORg_6HXRPd	\N	\N	\N	\N	10	2025-07-12 16:13:04.652	2025-07-12 16:13:04.683247	\N	Guest	User	DCOPspzY7RkX1w40se3ea39rlxA9SOFP	2025-07-12 16:13:04.652	\N	\N	t	t
guest_Doix4Qh8e5Xp	\N	\N	\N	\N	10	2025-07-12 16:13:04.892	2025-07-12 16:13:04.940281	\N	Guest	User	4F2yMdWmnZ4cj0TkGqI3fsqiwtxA3INL	2025-07-12 16:13:04.892	\N	\N	t	t
guest_y7jnULrpSvqc	\N	\N	\N	\N	10	2025-07-12 16:13:05.147	2025-07-12 16:13:05.178501	\N	Guest	User	j3EegKA7cscDn-2EFxwPfzF5VwhAdBMD	2025-07-12 16:13:05.147	\N	\N	t	t
guest_mRi1n7J__noO	\N	\N	\N	\N	10	2025-07-12 16:13:05.408	2025-07-12 16:13:05.440087	\N	Guest	User	1o01U5p1bvwPf39mYYWY-ju6F2OLDS5v	2025-07-12 16:13:05.408	\N	\N	t	t
guest_GyN3_ppuXvGK	\N	\N	\N	\N	10	2025-07-12 16:13:05.647	2025-07-12 16:13:05.679144	\N	Guest	User	jPtcy_fwO37WIbndsGPmhWISmDT-BMxV	2025-07-12 16:13:05.647	\N	\N	t	t
guest_kz0TlGYHaOI4	\N	\N	\N	\N	10	2025-07-12 16:13:05.888	2025-07-12 16:13:05.919466	\N	Guest	User	_jJbKVDB8MQr7i8EdpIzQOA2mnnRPh4S	2025-07-12 16:13:05.888	\N	\N	t	t
guest_NaaTbYQ0j7KA	\N	\N	\N	\N	10	2025-07-12 16:13:06.13	2025-07-12 16:13:06.162481	\N	Guest	User	-ZTPXDVqwmt2DD_RH3-eccinBfilfoMJ	2025-07-12 16:13:06.13	\N	\N	t	t
guest_mLg1HoGzenN5	\N	\N	\N	\N	10	2025-07-12 16:13:06.369	2025-07-12 16:13:06.403096	\N	Guest	User	PWLx_9cHC4tZmeXsGUes6HJCRiBzTBGL	2025-07-12 16:13:06.369	\N	\N	t	t
guest_TyiOlCR_Lr7d	\N	\N	\N	\N	10	2025-07-12 16:13:06.626	2025-07-12 16:13:06.658279	\N	Guest	User	0EcNcsEHZh6zveFSYFioRg5U3ta-PM78	2025-07-12 16:13:06.626	\N	\N	t	t
guest_i0XZhZaaPC9-	\N	\N	\N	\N	10	2025-07-12 16:13:06.869	2025-07-12 16:13:06.901123	\N	Guest	User	Z439yRSucJdEkrN9kQ9DWsJpaPlSl4kW	2025-07-12 16:13:06.869	\N	\N	t	t
guest_UZK5SUc5h7M5	\N	\N	\N	\N	10	2025-07-12 16:13:07.112	2025-07-12 16:13:07.142657	\N	Guest	User	J4iHK-nfjFuGWyZof1-fv89G1v1kPgLD	2025-07-12 16:13:07.112	\N	\N	t	t
guest_qpSruJO8Aek3	\N	\N	\N	\N	10	2025-07-12 16:13:07.353	2025-07-12 16:13:07.384922	\N	Guest	User	sitaas7eEsKSwZ9LIIYLci5Ff36u236u	2025-07-12 16:13:07.353	\N	\N	t	t
guest_G3WYr3FmAuId	\N	\N	\N	\N	10	2025-07-12 16:13:07.599	2025-07-12 16:13:07.63101	\N	Guest	User	geeED7isCZgrNxx4kfwVrYLjFQYLix7i	2025-07-12 16:13:07.599	\N	\N	t	t
guest__YZgrUaKBGCY	\N	\N	\N	\N	10	2025-07-12 16:13:07.839	2025-07-12 16:13:07.873146	\N	Guest	User	0mkPBfQSrqFWEerT2k3Y4WwONURYo7Kz	2025-07-12 16:13:07.839	\N	\N	t	t
guest_UB5b84-O7Jhl	\N	\N	\N	\N	10	2025-07-12 16:13:08.089	2025-07-12 16:13:08.120293	\N	Guest	User	hwxKGjCmsgLLbX6nKQL61FK3gseZi3X4	2025-07-12 16:13:08.089	\N	\N	t	t
guest_0JAxYkdFRmEK	\N	\N	\N	\N	10	2025-07-12 16:13:08.329	2025-07-12 16:13:08.360682	\N	Guest	User	Ch52hkAy4EmkNEHlJnwHTQD8tmGFJF3Z	2025-07-12 16:13:08.329	\N	\N	t	t
guest_CUQ3MxK7l4lR	\N	\N	\N	\N	10	2025-07-12 16:13:08.569	2025-07-12 16:13:08.601039	\N	Guest	User	HiHYyJO6Z40WycG-ZvXv4y8Sa9FxEgPB	2025-07-12 16:13:08.569	\N	\N	t	t
guest_ECxvfEQ_ZGR7	\N	\N	\N	\N	10	2025-07-12 16:13:08.806	2025-07-12 16:13:08.838054	\N	Guest	User	LjyfUIXWDziRi4fqXmGEI1V4hF-zAIvK	2025-07-12 16:13:08.806	\N	\N	t	t
guest_1yQN2I5BJ0pJ	\N	\N	\N	\N	10	2025-07-12 16:13:09.042	2025-07-12 16:13:09.073622	\N	Guest	User	f5RSEV8NTEAN19Weu5TOiUxK7Gud-0WQ	2025-07-12 16:13:09.042	\N	\N	t	t
guest_C8aYvV2P2_Qp	\N	\N	\N	\N	10	2025-07-12 16:13:09.278	2025-07-12 16:13:09.309624	\N	Guest	User	ueIsCISHnB5jb4HYJ_xjrYYIjSxJVqEc	2025-07-12 16:13:09.278	\N	\N	t	t
guest_X-1MmL_HGV4n	\N	\N	\N	\N	10	2025-07-12 16:13:09.513	2025-07-12 16:13:09.544899	\N	Guest	User	LGoUa6vlvzwWrq0Hw9hL6wCgwFhakIHN	2025-07-12 16:13:09.513	\N	\N	t	t
guest_wIXg3zLYsie8	\N	\N	\N	\N	10	2025-07-12 16:13:09.759	2025-07-12 16:13:09.790497	\N	Guest	User	2nnLTfXh15jSvVWNW-J15hzEEisDgsPV	2025-07-12 16:13:09.759	\N	\N	t	t
guest_hzrREous4yM9	\N	\N	\N	\N	10	2025-07-12 16:13:09.996	2025-07-12 16:13:10.027679	\N	Guest	User	oOU-c-0N7saFBrEVlUiY45lCBdwM8A9p	2025-07-12 16:13:09.996	\N	\N	t	t
guest_hFqiAHISoZ9R	\N	\N	\N	\N	10	2025-07-12 16:13:10.233	2025-07-12 16:13:10.264939	\N	Guest	User	qRg3vWBGoDjEaP64mADPod_g_WnvX8-y	2025-07-12 16:13:10.233	\N	\N	t	t
guest_OGTcwNJDkEzp	\N	\N	\N	\N	10	2025-07-12 16:13:10.477	2025-07-12 16:13:10.508653	\N	Guest	User	mswaq9q9_UMBD9RZkUyfkkZZKPiOkTKW	2025-07-12 16:13:10.477	\N	\N	t	t
guest_z60zWNkfx7gV	\N	\N	\N	\N	10	2025-07-12 16:13:10.716	2025-07-12 16:13:10.747367	\N	Guest	User	0RWFl3w1fr_Wl8zYXOTS8mmLu-ABc89Y	2025-07-12 16:13:10.716	\N	\N	t	t
guest_cR5iJJrjqLF7	\N	\N	\N	\N	10	2025-07-12 16:13:10.953	2025-07-12 16:13:10.984743	\N	Guest	User	dW49BmTcd3-U-5c7cmmQOIr3m3cDnvTp	2025-07-12 16:13:10.953	\N	\N	t	t
guest_4VscO0BMU1XV	\N	\N	\N	\N	10	2025-07-12 16:13:11.191	2025-07-12 16:13:11.223027	\N	Guest	User	7VwwY1-uF0ebN60UWSszHKxJLG9tVsu4	2025-07-12 16:13:11.191	\N	\N	t	t
guest_Grfw-hYSAYyF	\N	\N	\N	\N	10	2025-07-12 16:13:11.433	2025-07-12 16:13:11.464999	\N	Guest	User	92mQULDg8RuUQ02JXAz9IgGfI_gRr3r_	2025-07-12 16:13:11.433	\N	\N	t	t
guest_GUhvq0VHX8NU	\N	\N	\N	\N	10	2025-07-12 16:13:11.68	2025-07-12 16:13:11.715726	\N	Guest	User	e_O_mjdsuEwXuvy3xYjoOs4094LdBSA4	2025-07-12 16:13:11.68	\N	\N	t	t
guest_gYcaFEGJsaDP	\N	\N	\N	\N	10	2025-07-12 16:13:11.928	2025-07-12 16:13:11.958619	\N	Guest	User	6lOsE4gkiW5bdd0_8BhXIfSjKfc1zWxj	2025-07-12 16:13:11.928	\N	\N	t	t
guest_hwuVfC8MagU0	\N	\N	\N	\N	10	2025-07-12 16:13:12.163	2025-07-12 16:13:12.194946	\N	Guest	User	aDApKzbvI5xTuKnfDHQ6eXNs02w700y4	2025-07-12 16:13:12.163	\N	\N	t	t
guest_18ugQOZWBq_M	\N	\N	\N	\N	10	2025-07-12 16:13:12.399	2025-07-12 16:13:12.429837	\N	Guest	User	9C0sxLXebrvLE_9HtUkTipcQ6iw6MYPy	2025-07-12 16:13:12.399	\N	\N	t	t
guest_whw16IAT-POX	\N	\N	\N	\N	10	2025-07-12 16:13:12.637	2025-07-12 16:13:12.670309	\N	Guest	User	kam20odA3UjxLecEdt18f4B24P5rYFjM	2025-07-12 16:13:12.637	\N	\N	t	t
guest_X3Igm6diAPVO	\N	\N	\N	\N	10	2025-07-12 16:13:12.876	2025-07-12 16:13:12.908222	\N	Guest	User	NZpi-ZieavgZ9vzjF2r5nbNtOWj2lNiA	2025-07-12 16:13:12.876	\N	\N	t	t
guest_sZ2C1cKM1dfn	\N	\N	\N	\N	10	2025-07-12 16:13:13.115	2025-07-12 16:13:13.146585	\N	Guest	User	mPQOXdLtrXASH5oybeyU63jg0S8PkSSw	2025-07-12 16:13:13.115	\N	\N	t	t
guest_LH23SYSYMn49	\N	\N	\N	\N	10	2025-07-12 16:13:13.351	2025-07-12 16:13:13.383102	\N	Guest	User	i2P5qMRizW4URS108Wa2WNDA1lM1tcXM	2025-07-12 16:13:13.351	\N	\N	t	t
guest_rN-G1yM3sC1S	\N	\N	\N	\N	10	2025-07-12 16:13:13.594	2025-07-12 16:13:13.626113	\N	Guest	User	rIoES_89uzVlSTtt0Tca9fGbxSvVa86N	2025-07-12 16:13:13.594	\N	\N	t	t
guest_QkjGc-e0kEz_	\N	\N	\N	\N	10	2025-07-12 16:13:13.833	2025-07-12 16:13:13.865024	\N	Guest	User	tHkq3DQDpvSD8LApOHRt9o3kE4l9Zpcr	2025-07-12 16:13:13.833	\N	\N	t	t
guest_io-lo45_mIqN	\N	\N	\N	\N	10	2025-07-12 16:13:14.075	2025-07-12 16:13:14.108482	\N	Guest	User	wThV6pkrk3Ehw1WyTdnpmIONAxpyL25e	2025-07-12 16:13:14.075	\N	\N	t	t
guest_DV8XIyDmNdl-	\N	\N	\N	\N	10	2025-07-12 16:13:14.315	2025-07-12 16:13:14.346693	\N	Guest	User	NltDkE11KmVCC5KtNen2xiiws6N6WiEC	2025-07-12 16:13:14.315	\N	\N	t	t
guest_uxcEnWLxbS5l	\N	\N	\N	\N	10	2025-07-12 16:13:14.56	2025-07-12 16:13:14.59187	\N	Guest	User	xNZtMGvZh7QQLtAZ0fLYpVjk_2BzHVwZ	2025-07-12 16:13:14.56	\N	\N	t	t
guest_GJLQ8OBMm7uy	\N	\N	\N	\N	10	2025-07-12 16:13:14.802	2025-07-12 16:13:14.833289	\N	Guest	User	sfVRXRJJU-1UDR3XUDWnegkrZbBSRE0Z	2025-07-12 16:13:14.802	\N	\N	t	t
guest_w7jHA-uVch2P	\N	\N	\N	\N	10	2025-07-12 16:13:15.038	2025-07-12 16:13:15.06919	\N	Guest	User	Y59bYZTnxwtJfCsPA4zHWsPwnpVg6b19	2025-07-12 16:13:15.038	\N	\N	t	t
guest_1nnM5G5aC4sD	\N	\N	\N	\N	10	2025-07-12 16:13:15.277	2025-07-12 16:13:15.30881	\N	Guest	User	QAP_DvOTlQw1ypY0iwGVccCLGjLphLRC	2025-07-12 16:13:15.277	\N	\N	t	t
guest_3CDTZDJmnKzL	\N	\N	\N	\N	10	2025-07-12 16:13:15.535	2025-07-12 16:13:15.566872	\N	Guest	User	WYQJaB9xeufhMbZhcV_dRstJvZUk1KEU	2025-07-12 16:13:15.535	\N	\N	t	t
guest_uR5RfVM8QxF_	\N	\N	\N	\N	10	2025-07-12 16:13:15.775	2025-07-12 16:13:15.805604	\N	Guest	User	iCuO74mXLlpOzMr2QDqO7lWedehsEuHP	2025-07-12 16:13:15.775	\N	\N	t	t
guest_cSHGIgKmt-SA	\N	\N	\N	\N	10	2025-07-12 16:13:16.017	2025-07-12 16:13:16.049889	\N	Guest	User	q0jNPXJgbbFbDfSYFTCOSfRVMzmtnkO_	2025-07-12 16:13:16.017	\N	\N	t	t
guest_TAViVBS6kT-7	\N	\N	\N	\N	10	2025-07-12 16:13:16.262	2025-07-12 16:13:16.294233	\N	Guest	User	oFCvWiS6xJZh65mPrzz98coUe47ITxy9	2025-07-12 16:13:16.262	\N	\N	t	t
guest_gaMKK28o_o1X	\N	\N	\N	\N	10	2025-07-12 16:13:16.501	2025-07-12 16:13:16.532878	\N	Guest	User	-_8noZ2skH4BUN-M9D2Ff_haHl-z01zN	2025-07-12 16:13:16.501	\N	\N	t	t
guest_9gcCiUXN9psf	\N	\N	\N	\N	10	2025-07-12 16:13:16.736	2025-07-12 16:13:16.767574	\N	Guest	User	hCoBUzLexdKUlHeb4f9DVBUPfGyFTEiY	2025-07-12 16:13:16.736	\N	\N	t	t
guest_hmRZD1o41y0v	\N	\N	\N	\N	10	2025-07-12 16:13:16.984	2025-07-12 16:13:17.016091	\N	Guest	User	3lAwBzWz0m80TxKyVDtpkS4AcC4IWwOW	2025-07-12 16:13:16.984	\N	\N	t	t
guest_bIIFT1QC6_Cc	\N	\N	\N	\N	10	2025-07-12 16:13:17.226	2025-07-12 16:13:17.258676	\N	Guest	User	9vE3m1xspXNit5fUcWEOGmryeNpsPGeK	2025-07-12 16:13:17.226	\N	\N	t	t
guest_faEzvhoXY4fM	\N	\N	\N	\N	10	2025-07-12 16:13:17.466	2025-07-12 16:13:17.497529	\N	Guest	User	cV0t__QDItjblvrL8kmUUjXUlF5EKeGP	2025-07-12 16:13:17.466	\N	\N	t	t
guest_sQYSEilSShMB	\N	\N	\N	\N	10	2025-07-12 16:13:17.712	2025-07-12 16:13:17.744311	\N	Guest	User	5wjLaAtCCuT9FgveOsyiCkJ3B1rE_sZm	2025-07-12 16:13:17.712	\N	\N	t	t
guest_ePNcjQ3lgPmx	\N	\N	\N	\N	10	2025-07-12 16:13:17.957	2025-07-12 16:13:17.990937	\N	Guest	User	_JlpE76fff4OTRBQSfcRX4Vz-j6M3OT9	2025-07-12 16:13:17.957	\N	\N	t	t
guest_lzWHcrur4Yd4	\N	\N	\N	\N	10	2025-07-12 16:13:18.201	2025-07-12 16:13:18.232837	\N	Guest	User	YQIfi15lOvBAKytVwHVvGXAFyQ72NW9T	2025-07-12 16:13:18.201	\N	\N	t	t
guest_rNnmxAzxewkz	\N	\N	\N	\N	10	2025-07-12 16:13:18.443	2025-07-12 16:13:18.475142	\N	Guest	User	IUNIWWrbUFG9AIypIX2pxlHW9__x2qOK	2025-07-12 16:13:18.443	\N	\N	t	t
guest_UaP3t5eKzixj	\N	\N	\N	\N	10	2025-07-12 16:13:18.682	2025-07-12 16:13:18.714221	\N	Guest	User	DBqNaVR0bYEbiErj9eQU243ueBM5ywrw	2025-07-12 16:13:18.682	\N	\N	t	t
guest_MJ73E1ad4If2	\N	\N	\N	\N	10	2025-07-12 19:57:19.383	2025-07-12 19:57:19.550686	\N	Guest	User	THYRa1FRbmY1mm2a-J2M5IR5U4KqN-Ag	2025-07-12 21:42:51.25	\N	\N	t	t
guest_joK8DYGHRzpG	\N	\N	\N	\N	10	2025-07-12 19:50:24.796	2025-07-12 19:50:24.973298	\N	Guest	User	5lfdHz3Hrp1rIDLYZmvjxQoecpX8GTGw	2025-07-12 19:54:46.76	\N	\N	t	t
guest_EFSPBqSoPc08	\N	\N	\N	\N	10	2025-07-12 16:14:02.969	2025-07-12 16:14:03.140395	\N	Guest	User	3HfFQrJhBIRiVlEW6tKXx418UKojNLLU	2025-07-12 18:11:18.736	\N	\N	t	t
guest_kSwC8BgkvTi3	\N	\N	\N	\N	10	2025-07-12 17:58:08	2025-07-12 17:58:08.035785	\N	Guest	User	bSH13CtSFFbakMjiwkM7xwzYY0UqyH2P	2025-07-12 17:58:19.181	\N	\N	t	t
guest_znd-NuncOgru	\N	\N	\N	\N	10	2025-07-12 18:23:16.757	2025-07-12 18:23:16.791585	\N	Guest	User	-vJH-i2k8gJMC0i6SbKVSo5ralphJ-Or	2025-07-12 18:23:20.897	\N	\N	t	t
guest_0cX6Kh5DqXBi	\N	\N	\N	\N	10	2025-07-12 17:58:09.397	2025-07-12 17:58:09.43215	\N	Guest	User	sZMaLXoFaaiWBOMBpdw1VVpVUuIbdhSx	2025-07-12 17:58:23.347	\N	\N	t	t
guest_qN8zPMkPFqNt	\N	\N	\N	\N	10	2025-07-12 17:58:25.456	2025-07-12 17:58:25.491309	\N	Guest	User	FCCzvB5rzocf7t7emS2EVrqxhNCHuPMx	2025-07-12 17:58:25.456	\N	\N	t	t
guest_MnPYxr3-ldYm	\N	\N	\N	\N	10	2025-07-12 18:11:26.105	2025-07-12 18:11:26.162977	\N	Guest	User	WZNMUUg14I4HF18nbfZXf6chYMwnr-vD	2025-07-12 18:12:13.029	\N	\N	t	t
guest_wEf2L6EIfBSb	\N	\N	\N	\N	10	2025-07-12 16:47:21.729	2025-07-12 16:47:21.764562	\N	Guest	User	90LiiZlWbHPu8Ix5-4Bi5TU32JcBNzo1	2025-07-12 16:47:21.729	\N	\N	t	t
guest_KBDtMIr2C2od	\N	\N	\N	\N	10	2025-07-12 16:47:21.957	2025-07-12 16:47:21.991763	\N	Guest	User	4p5xfZvUnr3s2sygBdR5hUkwXx4w7OOO	2025-07-12 16:47:21.957	\N	\N	t	t
guest_xYF28j7fH3hh	\N	\N	\N	\N	10	2025-07-12 16:47:24.901	2025-07-12 16:47:24.936381	\N	Guest	User	405_Krx1UukL_Ogv8DH9rnCT0K427e5H	2025-07-12 16:47:24.901	\N	\N	t	t
guest_rmntDgoduxCv	\N	\N	\N	\N	10	2025-07-12 16:47:27.165	2025-07-12 16:47:27.199725	\N	Guest	User	5cWWGAsoEYEvOqB_nl1Enud4h6rgxRhv	2025-07-12 16:47:27.165	\N	\N	t	t
guest_VoRRFTEx5M_R	\N	\N	\N	\N	10	2025-07-12 16:47:28.15	2025-07-12 16:47:28.186994	\N	Guest	User	FzKaHKJl_n1rU3eGIwrJAr1pY9RYZcsF	2025-07-12 16:47:28.15	\N	\N	t	t
guest_D0sFbi2haz1N	\N	\N	\N	\N	10	2025-07-12 16:47:29.952	2025-07-12 16:47:29.986381	\N	Guest	User	zOsz5eE6Nj_bNEgdcLKxzuuioSCqUhCF	2025-07-12 16:47:29.952	\N	\N	t	t
guest_V_fFEDRlUROZ	\N	\N	\N	\N	10	2025-07-12 16:47:29.952	2025-07-12 16:47:29.987516	\N	Guest	User	Z3Fe5bUsgU5y0-uGp87AQwdnveFg2StV	2025-07-12 16:47:29.952	\N	\N	t	t
guest_pW4uy_qtsI-b	\N	\N	\N	\N	10	2025-07-12 16:54:23.764	2025-07-12 16:54:23.799693	\N	Guest	User	loOOGrfumO6nMVP11vJGdTRlgQzXSERT	2025-07-12 16:54:23.764	\N	\N	t	t
guest_8lgJqIwLMutn	\N	\N	\N	\N	10	2025-07-12 16:56:19.671	2025-07-12 16:56:19.706171	\N	Guest	User	8lxUS2rTo8hkEXqf1jfWu09-wKz0btb4	2025-07-12 16:56:19.671	\N	\N	t	t
guest_t5P6M8y861LW	\N	\N	\N	\N	10	2025-07-12 16:56:20.046	2025-07-12 16:56:20.077451	\N	Guest	User	rwNJ_az2mWodSHbLyn7VifD8VoArgE1C	2025-07-12 16:56:20.046	\N	\N	t	t
guest_P60fXSWEoe5d	\N	\N	\N	\N	10	2025-07-12 16:56:21.065	2025-07-12 16:56:21.096932	\N	Guest	User	wZh2wFh-vISe215tIhBTLgaFZcjWvPwl	2025-07-12 16:56:21.065	\N	\N	t	t
guest_-JWps09UXFAw	\N	\N	\N	\N	10	2025-07-12 16:56:21.084	2025-07-12 16:56:21.118932	\N	Guest	User	Kgvlqc094Jx_uFmF_JNWHOYfq01bH6cr	2025-07-12 16:56:21.084	\N	\N	t	t
guest_KD9Ri7Dv_KYn	\N	\N	\N	\N	10	2025-07-12 17:57:47.759	2025-07-12 17:57:47.792326	\N	Guest	User	-FsIj022Ndngz121Wz9jux9qJTu7sPK8	2025-07-12 17:57:47.759	\N	\N	t	t
guest_WgZLyJFCk6vp	\N	\N	\N	\N	10	2025-07-12 17:58:06.587	2025-07-12 17:58:06.621202	\N	Guest	User	y4Godip1EHludgM829hwPWRj4hqbpLie	2025-07-12 17:58:06.587	\N	\N	t	t
guest_JZYhauRq9VZw	\N	\N	\N	\N	10	2025-07-12 17:58:07.769	2025-07-12 17:58:07.802416	\N	Guest	User	gjSL5jvBxLsAiPYn7VUgHEzb04ivwls6	2025-07-12 17:58:07.769	\N	\N	t	t
guest_KiLvx476dhqh	\N	\N	\N	\N	10	2025-07-12 18:02:52.973	2025-07-12 18:02:53.006015	\N	Guest	User	1NW8_M8AnN_NRFWGjqtjvaPsZVuAHAHB	2025-07-12 18:02:52.973	\N	\N	t	t
guest_5qKUl5Y4p5rO	\N	\N	\N	\N	10	2025-07-12 18:32:19.827	2025-07-12 18:32:19.860861	\N	Guest	User	76tHk0qtzxUD5t2glU5V5wKWrOKYZFvS	2025-07-12 18:32:19.827	\N	\N	t	t
guest_wb9KNF3of7jz	\N	\N	\N	\N	10	2025-07-12 18:49:57.481	2025-07-12 18:49:57.515982	\N	Guest	User	XE0yfBhqqe3XOdKej_hCQgiFXn_c6R-i	2025-07-12 18:49:57.481	\N	\N	t	t
guest_VC_AVvHRLFMk	\N	\N	\N	\N	10	2025-07-12 19:08:37.572	2025-07-12 19:08:37.721607	\N	Guest	User	wR85zuQ61eRCF1NAqb6uy2Ht--knA-Ww	2025-07-12 19:49:53.591	\N	\N	t	t
guest__bbLXeYQVTJL	\N	\N	\N	\N	10	2025-07-12 20:05:59.151	2025-07-12 20:05:59.184275	\N	Guest	User	jiEnCe4ioMIhMOlrMk3LR9c1U6A-hMhN	2025-07-12 20:06:06.795	\N	\N	t	t
guest_MkEwuvv-klih	\N	\N	\N	\N	10	2025-07-12 19:55:02.732	2025-07-12 19:55:02.900734	\N	Guest	User	zbnkmnLNIqi26A_A1cbUFM9CoflocNUV	2025-07-12 19:56:45.784	\N	\N	t	t
guest_rJYuQaJqAzmc	\N	\N	\N	\N	10	2025-07-12 19:53:47.585	2025-07-12 19:53:47.616833	\N	Guest	User	vGFOwkFZhlW-bsb86ZypM6XZXO8MK-Ol	2025-07-12 19:53:47.585	\N	\N	t	t
guest_pD8eN8ETS9sT	\N	\N	\N	\N	10	2025-07-12 20:05:36.277	2025-07-12 20:05:36.312188	\N	Guest	User	_dLOk_D8qza4E1LSovtiX-m031UbcT3k	2025-07-12 20:05:36.277	\N	\N	t	t
guest_JBT_NfI4mYvH	\N	\N	\N	\N	10	2025-07-12 20:05:30.275	2025-07-12 20:05:30.310791	\N	Guest	User	sekQPxbI4k0Km5amedurzEtHvShrjqpB	2025-07-12 20:05:30.275	\N	\N	t	t
guest_pNclJfnl42FK	\N	\N	\N	\N	10	2025-07-12 20:05:36.698	2025-07-12 20:05:36.733751	\N	Guest	User	izq9XGpAPEioz9PgON3BkgkDLmpGnaF4	2025-07-12 20:05:36.698	\N	\N	t	t
guest_pET0U4q8ASKg	\N	\N	\N	\N	10	2025-07-12 20:17:56.098	2025-07-12 20:17:56.131141	\N	Guest	User	FvXIbyj_rEBFcgckhJiiR7NuVHjWOK2V	2025-07-12 20:17:56.098	\N	\N	t	t
guest_7c7QtMGUv1px	\N	\N	\N	\N	10	2025-07-12 20:17:56.962	2025-07-12 20:17:56.996778	\N	Guest	User	9f7v47fGfwNj8Q0u-_qDEhW_PHYLbvbR	2025-07-12 20:17:56.962	\N	\N	t	t
guest_0eqehgHrRoBo	\N	\N	\N	\N	10	2025-07-12 20:15:29.635	2025-07-12 20:15:29.668597	\N	Guest	User	htrECkWr-qJQMzw2Ke1oFmftZqnVBiBJ	2025-07-12 21:41:52.495	\N	\N	t	t
guest_A3BUNvnHkK8S	\N	\N	\N	\N	10	2025-07-12 21:19:08.345	2025-07-12 21:19:08.379885	\N	Guest	User	K3yla4zTNmNc9mkxEJMBnhhwrr2J-iX9	2025-07-12 21:19:13.017	\N	\N	t	t
guest_LSP16bg1KpmI	\N	\N	\N	\N	10	2025-07-12 21:32:31.455	2025-07-12 21:32:31.48947	\N	Guest	User	4HyT0xaDbB05bOfOspa52sw1J-dvw-nJ	2025-07-12 21:32:31.455	\N	\N	t	t
guest_tlwa6eHL3spP	\N	\N	\N	\N	10	2025-07-12 21:41:59.767	2025-07-12 21:41:59.805141	\N	Guest	User	Lgf6iF-GtGnLdGkkOJzLnkqVn5690G4A	2025-07-12 21:42:00.636	\N	\N	t	t
guest_qNEa2LMtbXCn	\N	\N	\N	\N	10	2025-07-12 23:45:19.226	2025-07-12 23:45:19.263257	\N	Guest	User	EayU7wRb-sCUSvwpjrKnTvTXS2uZFgKD	2025-07-12 23:45:19.226	\N	\N	t	t
guest_bzqlhUUvcTIF	\N	\N	\N	\N	10	2025-07-12 23:50:47.774	2025-07-12 23:50:47.808253	\N	Guest	User	UVvX8d-MdIZaOxmNDLP97X_K0kF6eAbv	2025-07-12 23:50:47.774	\N	\N	t	t
guest_kSXXTuo-4eLN	\N	\N	\N	\N	10	2025-07-12 20:18:06.617	2025-07-12 20:18:06.649697	\N	Guest	User	NqhTHGX-s8_27oL7YhNEQXOLH-f9PA5A	2025-07-12 20:18:17.013	\N	\N	t	t
guest_wzwNvji5TSOp	\N	\N	\N	\N	10	2025-07-13 00:05:24.46	2025-07-13 00:05:24.497826	\N	Guest	User	urFy4kKwpBLmanFXesppUIdvnGvH_Qcf	2025-07-13 00:05:24.46	\N	\N	t	t
guest_c49SrJ9Pd28g	\N	\N	\N	\N	10	2025-07-12 23:28:28.724	2025-07-12 23:28:28.758295	\N	Guest	User	lvRj-rF9K-41CHLhHUIZGFlJyhghpJjl	2025-07-12 23:28:28.724	\N	\N	t	t
guest_F1TeLfEB10KW	\N	\N	\N	\N	10	2025-07-12 22:06:49.474	2025-07-12 22:06:49.79296	\N	Guest	User	VMmKE_jz1ce7_S4GMicR44A5IgeOc1xA	2025-07-12 22:51:35.842	\N	\N	t	t
guest_0ALCX8XYz83R	\N	\N	\N	\N	10	2025-07-13 00:25:25.371	2025-07-13 00:25:25.408018	\N	Guest	User	7vSJD-S_m09Lc-u8Ti7mSldC7-fIg8i2	2025-07-13 00:25:25.371	\N	\N	t	t
guest_rCPoTCU_ozGp	\N	\N	\N	\N	10	2025-07-12 23:06:13.873	2025-07-12 23:06:13.908521	\N	Guest	User	EA-hrZBb4ahzoKbRnvU3dfQMywLBQjWw	2025-07-12 23:06:13.873	\N	\N	t	t
guest_WyYEcdup6_LO	\N	\N	\N	\N	10	2025-07-12 22:15:07.733	2025-07-12 22:15:07.770383	\N	Guest	User	19jomLoWl-2jezc19k-I0GyL55GKOGeB	2025-07-12 22:15:07.733	\N	\N	t	t
guest_CZtyfFzlpvn3	\N	\N	\N	\N	10	2025-07-12 21:42:00.356	2025-07-12 21:42:00.396874	\N	Guest	User	IrH4pifP1sRAbtD_wHKYiVPs1J5R2Hul	2025-07-12 21:42:31.701	\N	\N	t	t
guest_x_Zvc0B74wKu	\N	\N	\N	\N	10	2025-07-12 21:45:54.561	2025-07-12 21:45:54.932595	\N	Guest	User	XUTnzgxPngTYbYZeGR2BP01-GZ169REr	2025-07-12 21:45:54.561	\N	\N	t	t
guest_OdR6m6Qy_z9H	\N	\N	\N	\N	10	2025-07-12 21:45:54.865	2025-07-12 21:45:55.214704	\N	Guest	User	FxC6X5UbYBaU6rhTbbhrJMJTC5Ky0OOH	2025-07-12 21:45:54.865	\N	\N	t	t
guest_CpaC8_FPe0PP	\N	\N	\N	\N	10	2025-07-13 00:32:36.77	2025-07-13 00:32:36.802609	\N	Guest	User	rif5rkNj4kSii79C62i7hIXZANrGX1SF	2025-07-13 00:32:36.77	\N	\N	t	t
guest_F3u7eZ5S-Esl	\N	\N	\N	\N	10	2025-07-12 21:53:31.092	2025-07-12 21:53:31.130724	\N	Guest	User	dPGUcnYimVPgMwAPEuzQurS7S2GPOfk-	2025-07-12 21:53:31.092	\N	\N	t	t
guest_Gew3Px2zsbzo	\N	\N	\N	\N	10	2025-07-12 20:57:17.708	2025-07-12 20:57:17.744082	\N	Guest	User	3kECVkqVVq3uftylMLrWYLAybrDVoUn8	2025-07-12 20:57:17.708	\N	\N	t	t
guest_NcJgUUv-6AKn	\N	\N	\N	\N	10	2025-07-12 21:14:50.09	2025-07-12 21:14:50.125005	\N	Guest	User	tQKksVvwotuVSMY_wSO64Rk2Nr9y5mXn	2025-07-12 21:14:50.09	\N	\N	t	t
guest_Uh8QtfiRX3Dv	\N	\N	\N	\N	10	2025-07-12 21:17:25.42	2025-07-12 21:17:25.455384	\N	Guest	User	EQtt3BNYiBVzmMXCeTutSTzSTEMNiIJP	2025-07-12 21:17:25.42	\N	\N	t	t
guest_rNGKw-egcHfB	\N	\N	\N	\N	10	2025-07-12 21:47:30.758	2025-07-12 21:47:30.791729	\N	Guest	User	WhPbVJNoPFiA2g5UsXTIM5x6Sgs8erRw	2025-07-12 21:47:30.758	\N	\N	t	t
guest_inM0VXGWDOa5	\N	\N	\N	\N	10	2025-07-12 21:53:31.809	2025-07-12 21:53:31.844991	\N	Guest	User	ek3j3qqoqkWsZAEF0DfpkX8c2axrvWgX	2025-07-12 21:53:31.809	\N	\N	t	t
guest_tct2EAUS4nGM	\N	\N	\N	\N	10	2025-07-13 00:26:49.252	2025-07-13 00:26:49.334535	\N	Guest	User	ockKvMWfvEYSjkvRj_oRbosaivUFUgHy	2025-07-13 00:38:33.604	\N	\N	t	t
guest_w2uwFDuQ4JLD	\N	\N	\N	\N	10	2025-07-12 22:51:45.255	2025-07-12 22:51:45.539853	\N	Guest	User	SuM1DF5oEIvginJb_2JpPZe3-hEkWYvn	2025-07-13 00:18:53.802	\N	\N	t	t
guest_glAl3Ht2I7Rx	\N	\N	\N	\N	10	2025-07-13 00:18:59.163	2025-07-13 00:18:59.25095	\N	Guest	User	GM9siSq4NjsoBayo02OPOhq--L8c09W-	2025-07-13 00:18:59.163	\N	\N	t	t
guest_WTFSzdPaGDAm	\N	\N	\N	\N	10	2025-07-12 21:45:54.246	2025-07-12 21:45:54.616114	\N	Guest	User	PmqWRIXqAH_wPp2A6EbXo68BcyEv9v3a	2025-07-12 21:58:53.627	\N	\N	t	t
guest_FiyLbQC-yt31	\N	\N	\N	\N	10	2025-07-12 21:58:59.276	2025-07-12 21:58:59.65753	\N	Guest	User	D46fOfDHf7UrVT4cKTEsdBxwWlUjQs8b	2025-07-12 22:06:42.557	\N	\N	t	t
guest_p8pXPUN1epGW	\N	\N	\N	\N	10	2025-07-12 22:06:48.112	2025-07-12 22:06:48.433037	\N	Guest	User	8pbbiFgS-moGfoIRFVFP3h87QbP_erZw	2025-07-12 22:06:48.112	\N	\N	t	t
guest_wXMFaoG-uiQ0	\N	\N	\N	\N	10	2025-07-12 22:06:48.592	2025-07-12 22:06:48.92792	\N	Guest	User	OjSs90yBcOSmoCxuf2qF3JtuxqDfrOLA	2025-07-12 22:06:48.592	\N	\N	t	t
guest_QwxkjEdM6Fu3	\N	\N	\N	\N	10	2025-07-12 22:01:01.669	2025-07-12 22:01:01.727051	\N	Guest	User	fwoH3N8wcrEAkjJ21wU77hs1bozeo7oD	2025-07-12 22:01:01.669	\N	\N	t	t
guest_5o7YAyWQ2Ei0	\N	\N	\N	\N	10	2025-07-13 00:18:59.683	2025-07-13 00:18:59.77097	\N	Guest	User	w9Hv3lxGA7eC4avFUgO16l_9Kgj4ff68	2025-07-13 00:20:45.161	\N	\N	t	t
guest_6NAPM6WzO9qh	\N	\N	\N	\N	10	2025-07-13 00:20:59.765	2025-07-13 00:20:59.850797	\N	Guest	User	vhSkZPObejHeEoU3h1ALgtjEz-JS7QXb	2025-07-13 00:26:42.766	\N	\N	t	t
\.


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: -
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 1, false);


--
-- Name: backlog_videos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.backlog_videos_id_seq', 1, false);


--
-- Name: brand_assets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.brand_assets_id_seq', 1, false);


--
-- Name: credit_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.credit_transactions_id_seq', 18, true);


--
-- Name: export_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.export_transactions_id_seq', 1, false);


--
-- Name: generations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.generations_id_seq', 188, true);


--
-- Name: providers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.providers_id_seq', 1, true);


--
-- Name: recipe_samples_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.recipe_samples_id_seq', 1, false);


--
-- Name: recipes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.recipes_id_seq', 18, true);


--
-- Name: revenue_shares_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.revenue_shares_id_seq', 1, false);


--
-- Name: sample_likes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sample_likes_id_seq', 1, false);


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.services_id_seq', 2, true);


--
-- Name: smart_generation_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.smart_generation_requests_id_seq', 1, false);


--
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tags_id_seq', 11, true);


--
-- Name: type_services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.type_services_id_seq', 3, true);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: -
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: backlog_videos backlog_videos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backlog_videos
    ADD CONSTRAINT backlog_videos_pkey PRIMARY KEY (id);


--
-- Name: brand_assets brand_assets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_assets
    ADD CONSTRAINT brand_assets_pkey PRIMARY KEY (id);


--
-- Name: credit_transactions credit_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credit_transactions
    ADD CONSTRAINT credit_transactions_pkey PRIMARY KEY (id);


--
-- Name: export_transactions export_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.export_transactions
    ADD CONSTRAINT export_transactions_pkey PRIMARY KEY (id);


--
-- Name: generations generations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.generations
    ADD CONSTRAINT generations_pkey PRIMARY KEY (id);


--
-- Name: generations generations_short_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.generations
    ADD CONSTRAINT generations_short_id_unique UNIQUE (short_id);


--
-- Name: providers providers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.providers
    ADD CONSTRAINT providers_pkey PRIMARY KEY (id);


--
-- Name: providers providers_title_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.providers
    ADD CONSTRAINT providers_title_unique UNIQUE (title);


--
-- Name: recipe_samples recipe_samples_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_samples
    ADD CONSTRAINT recipe_samples_pkey PRIMARY KEY (id);


--
-- Name: recipes recipes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_pkey PRIMARY KEY (id);


--
-- Name: recipes recipes_referral_code_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_referral_code_unique UNIQUE (referral_code);


--
-- Name: recipes recipes_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_slug_unique UNIQUE (slug);


--
-- Name: revenue_shares revenue_shares_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.revenue_shares
    ADD CONSTRAINT revenue_shares_pkey PRIMARY KEY (id);


--
-- Name: sample_likes sample_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sample_likes
    ADD CONSTRAINT sample_likes_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: smart_generation_requests smart_generation_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.smart_generation_requests
    ADD CONSTRAINT smart_generation_requests_pkey PRIMARY KEY (id);


--
-- Name: tags tags_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_name_unique UNIQUE (name);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: type_services type_services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type_services
    ADD CONSTRAINT type_services_pkey PRIMARY KEY (id);


--
-- Name: type_services type_services_title_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type_services
    ADD CONSTRAINT type_services_title_unique UNIQUE (title);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_handle_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_handle_unique UNIQUE (handle);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_session_token_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_session_token_unique UNIQUE (session_token);


--
-- Name: IDX_services_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_services_active" ON public.services USING btree (is_active);


--
-- Name: IDX_services_provider_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_services_provider_id" ON public.services USING btree (provider_id);


--
-- Name: IDX_services_provider_title; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_services_provider_title" ON public.services USING btree (provider_title);


--
-- Name: IDX_services_type_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_services_type_id" ON public.services USING btree (type_id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- Name: IDX_users_access_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_users_access_role" ON public.users USING btree (access_role);


--
-- Name: IDX_users_account_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_users_account_type" ON public.users USING btree (account_type);


--
-- Name: IDX_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_users_email" ON public.users USING btree (email);


--
-- Name: IDX_users_session_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_users_session_token" ON public.users USING btree (session_token);


--
-- Name: idx_generations_guest_pagination; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_generations_guest_pagination ON public.generations USING btree (user_id, created_at DESC) WHERE ((user_id)::text = 'guest_user'::text);


--
-- Name: idx_generations_guest_stats; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_generations_guest_stats ON public.generations USING btree (user_id, status, created_at DESC) WHERE ((user_id)::text = 'guest_user'::text);


--
-- Name: idx_generations_recipe; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_generations_recipe ON public.generations USING btree (recipe_id, created_at DESC);


--
-- Name: idx_generations_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_generations_status ON public.generations USING btree (status, created_at DESC);


--
-- Name: idx_generations_user_pagination; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_generations_user_pagination ON public.generations USING btree (user_id, created_at DESC);


--
-- Name: backlog_videos backlog_videos_generation_id_generations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backlog_videos
    ADD CONSTRAINT backlog_videos_generation_id_generations_id_fk FOREIGN KEY (generation_id) REFERENCES public.generations(id);


--
-- Name: backlog_videos backlog_videos_recipe_id_recipes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backlog_videos
    ADD CONSTRAINT backlog_videos_recipe_id_recipes_id_fk FOREIGN KEY (recipe_id) REFERENCES public.recipes(id);


--
-- Name: brand_assets brand_assets_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_assets
    ADD CONSTRAINT brand_assets_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: credit_transactions credit_transactions_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credit_transactions
    ADD CONSTRAINT credit_transactions_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: export_transactions export_transactions_buyer_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.export_transactions
    ADD CONSTRAINT export_transactions_buyer_id_users_id_fk FOREIGN KEY (buyer_id) REFERENCES public.users(id);


--
-- Name: export_transactions export_transactions_creator_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.export_transactions
    ADD CONSTRAINT export_transactions_creator_id_users_id_fk FOREIGN KEY (creator_id) REFERENCES public.users(id);


--
-- Name: export_transactions export_transactions_sample_id_recipe_samples_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.export_transactions
    ADD CONSTRAINT export_transactions_sample_id_recipe_samples_id_fk FOREIGN KEY (sample_id) REFERENCES public.recipe_samples(id);


--
-- Name: generations generations_recipe_id_recipes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.generations
    ADD CONSTRAINT generations_recipe_id_recipes_id_fk FOREIGN KEY (recipe_id) REFERENCES public.recipes(id);


--
-- Name: generations generations_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.generations
    ADD CONSTRAINT generations_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: recipe_samples recipe_samples_generation_id_generations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_samples
    ADD CONSTRAINT recipe_samples_generation_id_generations_id_fk FOREIGN KEY (generation_id) REFERENCES public.generations(id);


--
-- Name: recipe_samples recipe_samples_recipe_id_recipes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_samples
    ADD CONSTRAINT recipe_samples_recipe_id_recipes_id_fk FOREIGN KEY (recipe_id) REFERENCES public.recipes(id);


--
-- Name: recipe_samples recipe_samples_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_samples
    ADD CONSTRAINT recipe_samples_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: recipes recipes_creator_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_creator_id_users_id_fk FOREIGN KEY (creator_id) REFERENCES public.users(id);


--
-- Name: revenue_shares revenue_shares_creator_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.revenue_shares
    ADD CONSTRAINT revenue_shares_creator_id_users_id_fk FOREIGN KEY (creator_id) REFERENCES public.users(id);


--
-- Name: revenue_shares revenue_shares_generation_id_generations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.revenue_shares
    ADD CONSTRAINT revenue_shares_generation_id_generations_id_fk FOREIGN KEY (generation_id) REFERENCES public.generations(id);


--
-- Name: revenue_shares revenue_shares_recipe_id_recipes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.revenue_shares
    ADD CONSTRAINT revenue_shares_recipe_id_recipes_id_fk FOREIGN KEY (recipe_id) REFERENCES public.recipes(id);


--
-- Name: revenue_shares revenue_shares_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.revenue_shares
    ADD CONSTRAINT revenue_shares_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: sample_likes sample_likes_sample_id_recipe_samples_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sample_likes
    ADD CONSTRAINT sample_likes_sample_id_recipe_samples_id_fk FOREIGN KEY (sample_id) REFERENCES public.recipe_samples(id);


--
-- Name: sample_likes sample_likes_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sample_likes
    ADD CONSTRAINT sample_likes_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: services services_provider_id_providers_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_provider_id_providers_id_fk FOREIGN KEY (provider_id) REFERENCES public.providers(id) ON DELETE CASCADE;


--
-- Name: services services_provider_title_providers_title_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_provider_title_providers_title_fk FOREIGN KEY (provider_title) REFERENCES public.providers(title) ON DELETE CASCADE;


--
-- Name: services services_type_id_type_services_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_type_id_type_services_id_fk FOREIGN KEY (type_id) REFERENCES public.type_services(id) ON DELETE RESTRICT;


--
-- Name: smart_generation_requests smart_generation_requests_creator_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.smart_generation_requests
    ADD CONSTRAINT smart_generation_requests_creator_id_users_id_fk FOREIGN KEY (creator_id) REFERENCES public.users(id);


--
-- Name: smart_generation_requests smart_generation_requests_generation_id_generations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.smart_generation_requests
    ADD CONSTRAINT smart_generation_requests_generation_id_generations_id_fk FOREIGN KEY (generation_id) REFERENCES public.generations(id);


--
-- Name: smart_generation_requests smart_generation_requests_recipe_id_recipes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.smart_generation_requests
    ADD CONSTRAINT smart_generation_requests_recipe_id_recipes_id_fk FOREIGN KEY (recipe_id) REFERENCES public.recipes(id);


--
-- PostgreSQL database dump complete
--

