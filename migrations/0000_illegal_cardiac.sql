CREATE TABLE "backlog_videos" (
	"id" serial PRIMARY KEY NOT NULL,
	"recipe_id" integer NOT NULL,
	"recipe_variables" jsonb NOT NULL,
	"recipe_variables_hash" varchar(64) NOT NULL,
	"generation_id" integer NOT NULL,
	"video_url" text NOT NULL,
	"thumbnail_url" text,
	"s3_key" text,
	"asset_id" text,
	"short_id" varchar(11),
	"secure_url" text,
	"is_used" boolean DEFAULT false NOT NULL,
	"used_by_request_id" integer,
	"used_at" timestamp,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "brand_assets" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"file_name" varchar NOT NULL,
	"file_url" varchar NOT NULL,
	"file_size" integer NOT NULL,
	"mime_type" varchar NOT NULL,
	"width" integer,
	"height" integer,
	"tags" text[],
	"is_transparent" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "credit_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"amount" integer NOT NULL,
	"type" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"payment_id" varchar,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "export_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"sample_id" integer NOT NULL,
	"buyer_id" varchar NOT NULL,
	"creator_id" varchar NOT NULL,
	"export_format" varchar(20) NOT NULL,
	"export_quality" varchar(20) NOT NULL,
	"price_credits" integer NOT NULL,
	"creator_earnings" integer NOT NULL,
	"download_url" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"downloaded_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "generations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"recipe_id" integer,
	"recipe_title" text,
	"prompt" text NOT NULL,
	"image_url" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"video_url" text,
	"thumbnail_url" text,
	"s3_key" text,
	"asset_id" text,
	"queue_position" integer,
	"processing_started_at" timestamp,
	"type" varchar(20) DEFAULT 'image' NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"download_count" integer DEFAULT 0 NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"failure_reason" text,
	"error_details" jsonb,
	"credits_cost" integer,
	"credits_refunded" boolean DEFAULT false NOT NULL,
	"refunded_at" timestamp,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"max_retries" integer DEFAULT 2 NOT NULL,
	"short_id" varchar(11),
	"secure_url" text,
	"fal_job_id" text,
	"fal_job_status" text,
	"recovery_checked" boolean DEFAULT false NOT NULL,
	CONSTRAINT "generations_short_id_unique" UNIQUE("short_id")
);
--> statement-breakpoint
CREATE TABLE "providers" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" text,
	"num_slots" integer DEFAULT 1 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"config" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "providers_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "recipe_option_tag_icon" (
	"id" text PRIMARY KEY NOT NULL,
	"display" text NOT NULL,
	"icon" text,
	"color" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "recipe_samples" (
	"id" serial PRIMARY KEY NOT NULL,
	"recipe_id" integer NOT NULL,
	"generation_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"title" text,
	"description" text,
	"original_prompt" text NOT NULL,
	"thumbnail_url" text NOT NULL,
	"preview_url" text NOT NULL,
	"high_res_url" text NOT NULL,
	"type" varchar(20) NOT NULL,
	"file_size" integer NOT NULL,
	"dimensions" jsonb,
	"download_count" integer DEFAULT 0 NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_moderated" boolean DEFAULT true NOT NULL,
	"moderation_status" varchar(20) DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "recipe_usage" (
	"recipe_id" integer PRIMARY KEY NOT NULL,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"last_used_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"prompt" text NOT NULL,
	"instructions" text NOT NULL,
	"category" text NOT NULL,
	"style" varchar(100) DEFAULT 'photorealistic' NOT NULL,
	"model" varchar(100) DEFAULT 'flux-1' NOT NULL,
	"credit_cost" integer NOT NULL,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"creator_id" varchar,
	"video_provider" varchar(50),
	"video_duration" integer DEFAULT 10,
	"video_quality" varchar(20) DEFAULT 'hd',
	"video_aspect_ratio" varchar(10) DEFAULT '16:9',
	"image_provider" varchar(50),
	"image_quality" varchar(20) DEFAULT 'hd',
	"image_size" varchar(20) DEFAULT 'landscape_4_3',
	"num_images" integer DEFAULT 1,
	"is_public" boolean DEFAULT false NOT NULL,
	"has_content_restrictions" boolean DEFAULT true NOT NULL,
	"revenue_share_enabled" boolean DEFAULT false NOT NULL,
	"revenue_share_percentage" integer DEFAULT 20 NOT NULL,
	"recipe_steps" jsonb NOT NULL,
	"generation_type" varchar(20) DEFAULT 'image' NOT NULL,
	"referral_code" varchar(20),
	"preview_image_url" text,
	"workflow_type" varchar(50) DEFAULT 'image' NOT NULL,
	"workflow_components" jsonb,
	"tag_highlights" integer[],
	CONSTRAINT "recipes_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
CREATE TABLE "revenue_shares" (
	"id" serial PRIMARY KEY NOT NULL,
	"recipe_id" integer NOT NULL,
	"creator_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"generation_id" integer NOT NULL,
	"credits_used" integer NOT NULL,
	"revenue_amount" integer NOT NULL,
	"share_percentage" integer NOT NULL,
	"creator_earnings" integer NOT NULL,
	"is_paid_credits" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sample_likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"sample_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer,
	"provider_title" varchar(100),
	"type_id" integer NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"endpoint" text NOT NULL,
	"config" jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"base_cost" numeric(20, 16) DEFAULT '0.0000000000000000' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "smart_generation_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"creator_id" varchar NOT NULL,
	"recipe_id" integer NOT NULL,
	"recipe_variables" jsonb NOT NULL,
	"recipe_variables_hash" varchar(64) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"generation_id" integer,
	"backlog_video_id" integer,
	"credits_cost" integer,
	"failure_reason" text,
	"error_details" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" text,
	"color" varchar(20) DEFAULT 'gray',
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "type_audio" (
	"id" integer PRIMARY KEY NOT NULL,
	"title" varchar(50) NOT NULL,
	CONSTRAINT "type_audio_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "type_services" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "type_services_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"credits" integer DEFAULT 10 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"handle" varchar,
	"account_type" varchar(20) DEFAULT 'Guest' NOT NULL,
	"access_role" varchar(20) DEFAULT 'User' NOT NULL,
	"session_token" varchar,
	"last_seen_at" timestamp DEFAULT now(),
	"password_hash" varchar,
	"oauth_provider" varchar(20),
	"is_ephemeral" boolean DEFAULT false,
	"can_upgrade_to_registered" boolean DEFAULT true,
	"last_credit_refresh" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_handle_unique" UNIQUE("handle"),
	CONSTRAINT "users_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE INDEX "idx_brand_assets_tags_gin" ON "brand_assets" USING gin ("tags" array_ops);--> statement-breakpoint
CREATE INDEX "idx_brand_assets_user_created" ON "brand_assets" USING btree ("user_id" text_ops,"created_at" text_ops);--> statement-breakpoint
CREATE INDEX "idx_credit_transactions_user_created" ON "credit_transactions" USING btree ("user_id" text_ops,"created_at" text_ops);--> statement-breakpoint
CREATE INDEX "idx_generations_asset_id" ON "generations" USING btree ("asset_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_generations_created_at" ON "generations" USING btree ("created_at" timestamp_ops);--> statement-breakpoint
CREATE INDEX "idx_generations_credits_refunded" ON "generations" USING btree ("credits_refunded" bool_ops);--> statement-breakpoint
CREATE INDEX "idx_generations_fal_job_id" ON "generations" USING btree ("fal_job_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_generations_guest_pagination" ON "generations" USING btree ("user_id" timestamp_ops,"created_at" timestamp_ops) WHERE ((user_id)::text = 'guest_user'::text);--> statement-breakpoint
CREATE INDEX "idx_generations_guest_stats" ON "generations" USING btree ("user_id" text_ops,"status" timestamp_ops,"created_at" text_ops) WHERE ((user_id)::text = 'guest_user'::text);--> statement-breakpoint
CREATE INDEX "idx_generations_processing_started_at" ON "generations" USING btree ("processing_started_at" timestamp_ops);--> statement-breakpoint
CREATE INDEX "idx_generations_recipe" ON "generations" USING btree ("recipe_id" int4_ops,"created_at" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_generations_status" ON "generations" USING btree ("status" timestamp_ops,"created_at" timestamp_ops);--> statement-breakpoint
CREATE INDEX "idx_generations_user_pagination" ON "generations" USING btree ("user_id" timestamp_ops,"created_at" text_ops);--> statement-breakpoint
CREATE INDEX "IDX_recipe_option_tag_icon_id" ON "recipe_option_tag_icon" USING btree ("id" text_ops);--> statement-breakpoint
CREATE INDEX "IDX_recipe_option_tag_icon_icon" ON "recipe_option_tag_icon" USING btree ("icon" text_ops);--> statement-breakpoint
CREATE INDEX "idx_recipe_samples_featured_likes" ON "recipe_samples" USING btree ("is_featured" bool_ops,"like_count" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_recipe_samples_recipe_status" ON "recipe_samples" USING btree ("recipe_id" int4_ops,"moderation_status" text_ops);--> statement-breakpoint
CREATE INDEX "idx_recipes_category" ON "recipes" USING btree ("category" text_ops);--> statement-breakpoint
CREATE INDEX "idx_recipes_creator_id" ON "recipes" USING btree ("creator_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_recipes_generation_type" ON "recipes" USING btree ("generation_type" text_ops);--> statement-breakpoint
CREATE INDEX "idx_recipes_is_active" ON "recipes" USING btree ("is_active" bool_ops);--> statement-breakpoint
CREATE INDEX "idx_recipes_workflow_type" ON "recipes" USING btree ("workflow_type" text_ops);--> statement-breakpoint
CREATE INDEX "IDX_services_active" ON "services" USING btree ("is_active" bool_ops);--> statement-breakpoint
CREATE INDEX "IDX_services_provider_id" ON "services" USING btree ("provider_id" int4_ops);--> statement-breakpoint
CREATE INDEX "IDX_services_provider_title" ON "services" USING btree ("provider_title" text_ops);--> statement-breakpoint
CREATE INDEX "IDX_services_type_id" ON "services" USING btree ("type_id" int4_ops);--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire" timestamp_ops);--> statement-breakpoint
CREATE INDEX "IDX_users_access_role" ON "users" USING btree ("access_role" text_ops);--> statement-breakpoint
CREATE INDEX "IDX_users_account_type" ON "users" USING btree ("account_type" text_ops);--> statement-breakpoint
CREATE INDEX "IDX_users_email" ON "users" USING btree ("email" text_ops);--> statement-breakpoint
CREATE INDEX "IDX_users_session_token" ON "users" USING btree ("session_token" text_ops);--> statement-breakpoint
CREATE INDEX "idx_users_created_at" ON "users" USING btree ("created_at" timestamp_ops);--> statement-breakpoint
CREATE INDEX "idx_users_is_ephemeral" ON "users" USING btree ("is_ephemeral" bool_ops);--> statement-breakpoint
CREATE INDEX "idx_users_last_seen_at" ON "users" USING btree ("last_seen_at" timestamp_ops);