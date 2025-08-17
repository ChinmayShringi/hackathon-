import { pgTable, serial, varchar, text, integer, boolean, timestamp, jsonb, index, unique, numeric } from 'drizzle-orm/pg-core';

// # Last checked: 2025-07-15 03:35:09 UTC by tcotten

export const creditTransactions = pgTable("credit_transactions", {
	id: serial().primaryKey().notNull(),
	userId: varchar("user_id").notNull(),
	amount: integer().notNull(),
	type: text().notNull(),
	description: text().notNull(),
	createdAt: timestamp("created_at").defaultNow(),
	paymentId: varchar("payment_id"),
	metadata: jsonb(),
}, (table) => [
	index("idx_credit_transactions_user_created").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.createdAt.desc().nullsFirst().op("text_ops")),
]);

export const backlogVideos = pgTable("backlog_videos", {
	id: serial().primaryKey().notNull(),
	recipeId: integer("recipe_id").notNull(),
	recipeVariables: jsonb("recipe_variables").notNull(),
	recipeVariablesHash: varchar("recipe_variables_hash", { length: 64 }).notNull(),
	generationId: integer("generation_id").notNull(),
	videoUrl: text("video_url").notNull(),
	thumbnailUrl: text("thumbnail_url"),
	s3Key: text("s3_key"),
	assetId: text("asset_id"),
	shortId: varchar("short_id", { length: 11 }),
	secureUrl: text("secure_url"),
	isUsed: boolean("is_used").default(false).notNull(),
	usedByRequestId: integer("used_by_request_id"),
	usedAt: timestamp("used_at"),
	metadata: jsonb(),
	createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
]);

export const recipeSamples = pgTable("recipe_samples", {
	id: serial().primaryKey().notNull(),
	recipeId: integer("recipe_id").notNull(),
	generationId: integer("generation_id").notNull(),
	userId: varchar("user_id").notNull(),
	title: text(),
	description: text(),
	originalPrompt: text("original_prompt").notNull(),
	thumbnailUrl: text("thumbnail_url").notNull(),
	previewUrl: text("preview_url").notNull(),
	highResUrl: text("high_res_url").notNull(),
	type: varchar({ length: 20 }).notNull(),
	fileSize: integer("file_size").notNull(),
	dimensions: jsonb(),
	downloadCount: integer("download_count").default(0).notNull(),
	likeCount: integer("like_count").default(0).notNull(),
	isFeatured: boolean("is_featured").default(false).notNull(),
	isModerated: boolean("is_moderated").default(true).notNull(),
	moderationStatus: varchar("moderation_status", { length: 20 }).default('pending'),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
	index("idx_recipe_samples_featured_likes").using("btree", table.isFeatured.asc().nullsLast().op("bool_ops"), table.likeCount.desc().nullsFirst().op("int4_ops")),
	index("idx_recipe_samples_recipe_status").using("btree", table.recipeId.asc().nullsLast().op("int4_ops"), table.moderationStatus.asc().nullsLast().op("text_ops")),
]);

export const exportTransactions = pgTable("export_transactions", {
	id: serial().primaryKey().notNull(),
	sampleId: integer("sample_id").notNull(),
	buyerId: varchar("buyer_id").notNull(),
	creatorId: varchar("creator_id").notNull(),
	exportFormat: varchar("export_format", { length: 20 }).notNull(),
	exportQuality: varchar("export_quality", { length: 20 }).notNull(),
	priceCredits: integer("price_credits").notNull(),
	creatorEarnings: integer("creator_earnings").notNull(),
	downloadUrl: text("download_url").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	downloadedAt: timestamp("downloaded_at"),
	createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
]);

export const providers = pgTable("providers", {
	id: serial().primaryKey().notNull(),
	title: varchar({ length: 100 }).notNull(),
	description: text(),
	numSlots: integer("num_slots").default(1).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	config: jsonb(),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
	unique("providers_title_unique").on(table.title),
]);

export const generations = pgTable("generations", {
	id: serial().primaryKey().notNull(),
	userId: varchar("user_id").notNull(),
	recipeId: integer("recipe_id"),
	recipeTitle: text("recipe_title"),
	prompt: text().notNull(),
	imageUrl: text("image_url"),
	status: text().default('pending').notNull(),
	metadata: jsonb(),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
	videoUrl: text("video_url"),
	thumbnailUrl: text("thumbnail_url"),
	s3Key: text("s3_key"),
	assetId: text("asset_id"),
	queuePosition: integer("queue_position"),
	processingStartedAt: timestamp("processing_started_at"),
	type: varchar({ length: 20 }).default('image').notNull(),
	isPublic: boolean("is_public").default(false).notNull(),
	isPublished: boolean("is_published").default(false).notNull(),
	downloadCount: integer("download_count").default(0).notNull(),
	likeCount: integer("like_count").default(0).notNull(),
	failureReason: text("failure_reason"),
	errorDetails: jsonb("error_details"),
	creditsCost: integer("credits_cost"),
	creditsRefunded: boolean("credits_refunded").default(false).notNull(),
	refundedAt: timestamp("refunded_at"),
	retryCount: integer("retry_count").default(0).notNull(),
	maxRetries: integer("max_retries").default(2).notNull(),
	shortId: varchar("short_id", { length: 11 }),
	secureUrl: text("secure_url"),
	falJobId: text("fal_job_id"),
	falJobStatus: text("fal_job_status"),
	recoveryChecked: boolean("recovery_checked").default(false).notNull(),
}, (table) => [
	index("idx_generations_asset_id").using("btree", table.assetId.asc().nullsLast().op("text_ops")),
	index("idx_generations_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("idx_generations_credits_refunded").using("btree", table.creditsRefunded.asc().nullsLast().op("bool_ops")),
	index("idx_generations_fal_job_id").using("btree", table.falJobId.asc().nullsLast().op("text_ops")),
	index("idx_generations_user_pagination_new").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.createdAt.desc().nullsFirst().op("timestamp_ops")),
	index("idx_generations_user_stats_new").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.status.asc().nullsLast().op("text_ops"), table.createdAt.desc().nullsFirst().op("timestamp_ops")),
	index("idx_generations_processing_started_at").using("btree", table.processingStartedAt.asc().nullsLast().op("timestamp_ops")),
	index("idx_generations_recipe").using("btree", table.recipeId.asc().nullsLast().op("int4_ops"), table.createdAt.desc().nullsFirst().op("int4_ops")),
	index("idx_generations_status").using("btree", table.status.asc().nullsLast().op("timestamp_ops"), table.createdAt.desc().nullsFirst().op("timestamp_ops")),
	index("idx_generations_user_pagination").using("btree", table.userId.asc().nullsLast().op("timestamp_ops"), table.createdAt.desc().nullsFirst().op("text_ops")),
	unique("generations_short_id_unique").on(table.shortId),
]);

export const sampleLikes = pgTable("sample_likes", {
	id: serial().primaryKey().notNull(),
	sampleId: integer("sample_id").notNull(),
	userId: varchar("user_id").notNull(),
	createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
]);

export const services = pgTable("services", {
	id: serial().primaryKey().notNull(),
	providerId: integer("provider_id"),
	providerTitle: varchar("provider_title", { length: 100 }),
	typeId: integer("type_id").notNull(),
	title: varchar({ length: 100 }).notNull(),
	description: text().notNull(),
	endpoint: text().notNull(),
	config: jsonb(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
	baseCost: numeric("base_cost", { precision: 20, scale: 16 }).default('0.0000000000000000').notNull(),
}, (table) => [
	index("IDX_services_active").using("btree", table.isActive.asc().nullsLast().op("bool_ops")),
	index("IDX_services_provider_id").using("btree", table.providerId.asc().nullsLast().op("int4_ops")),
	index("IDX_services_provider_title").using("btree", table.providerTitle.asc().nullsLast().op("text_ops")),
	index("IDX_services_type_id").using("btree", table.typeId.asc().nullsLast().op("int4_ops")),
]);

export const typeServices = pgTable("type_services", {
	id: serial().primaryKey().notNull(),
	title: varchar({ length: 100 }).notNull(),
	createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
	unique("type_services_title_unique").on(table.title),
]);

export const sessions = pgTable("sessions", {
	sid: varchar().primaryKey().notNull(),
	sess: jsonb().notNull(),
	expire: timestamp().notNull(),
}, (table) => [
	index("IDX_session_expire").using("btree", table.expire.asc().nullsLast().op("timestamp_ops")),
]);

export const tags = pgTable("tags", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 50 }).notNull(),
	description: text(),
	color: varchar({ length: 20 }).default('gray'),
	isActive: boolean("is_active").default(true).notNull(),
	isHidden: boolean("is_hidden").default(false).notNull(),
	createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
	unique("tags_name_unique").on(table.name),
	index("idx_tags_is_hidden").using("btree", table.isHidden.asc().nullsLast().op("bool_ops")),
]);

export const recipes = pgTable("recipes", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	slug: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
	prompt: text().notNull(),
	instructions: text().notNull(),
	category: text().notNull(),
	style: varchar({ length: 100 }).default('photorealistic').notNull(),
	model: varchar({ length: 100 }).default('flux-1').notNull(),
	creditCost: integer("credit_cost").notNull(),
	usageCount: integer("usage_count").default(0).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at").defaultNow(),
	creatorId: varchar("creator_id"),
	videoProvider: varchar("video_provider", { length: 50 }),
	videoDuration: integer("video_duration").default(10),
	videoQuality: varchar("video_quality", { length: 20 }).default('hd'),
	videoAspectRatio: varchar("video_aspect_ratio", { length: 10 }).default('16:9'),
	imageProvider: varchar("image_provider", { length: 50 }),
	imageQuality: varchar("image_quality", { length: 20 }).default('hd'),
	imageSize: varchar("image_size", { length: 20 }).default('landscape_4_3'),
	numImages: integer("num_images").default(1),
	isPublic: boolean("is_public").default(false).notNull(),
	hasContentRestrictions: boolean("has_content_restrictions").default(true).notNull(),
	revenueShareEnabled: boolean("revenue_share_enabled").default(false).notNull(),
	revenueSharePercentage: integer("revenue_share_percentage").default(20).notNull(),
	recipeSteps: jsonb("recipe_steps").notNull(),
	generationType: varchar("generation_type", { length: 20 }).default('image').notNull(),
	referralCode: varchar("referral_code", { length: 20 }),
	previewImageUrl: text("preview_image_url"),
	workflowType: varchar("workflow_type", { length: 50 }).default('image').notNull(),
	workflowComponents: jsonb("workflow_components"),
	tagHighlights: integer("tag_highlights").array(),
	audioType: integer("audio_type").default(0).notNull()
}, (table) => [
	index("idx_recipes_category").using("btree", table.category.asc().nullsLast().op("text_ops")),
	index("idx_recipes_creator_id").using("btree", table.creatorId.asc().nullsLast().op("text_ops")),
	index("idx_recipes_generation_type").using("btree", table.generationType.asc().nullsLast().op("text_ops")),
	index("idx_recipes_is_active").using("btree", table.isActive.asc().nullsLast().op("bool_ops")),
	index("idx_recipes_workflow_type").using("btree", table.workflowType.asc().nullsLast().op("text_ops")),
	unique("recipes_referral_code_unique").on(table.referralCode),
]);

export const users = pgTable("users", {
	id: varchar().primaryKey().notNull(),
	email: varchar(),
	firstName: varchar("first_name"),
	lastName: varchar("last_name"),
	profileImageUrl: varchar("profile_image_url"),
	credits: integer().default(10).notNull(),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
	firstVisitAt: timestamp("first_visit_at").defaultNow(),
	handle: varchar(),
	accountType: integer("account_type").default(2).notNull(), // 1=System, 2=Guest, 3=Registered
	accessRole: integer("access_role").default(1).notNull(), // 1=User, 2=Test, 3=Admin
	sessionToken: varchar("session_token"),
	lastSeenAt: timestamp("last_seen_at").defaultNow(),
	passwordHash: varchar("password_hash"),
	oauthProvider: varchar("oauth_provider", { length: 20 }),
	isEphemeral: boolean("is_ephemeral").default(false),
	canUpgradeToRegistered: boolean("can_upgrade_to_registered").default(true),
	lastCreditRefresh: timestamp("last_credit_refresh").defaultNow(),
}, (table) => [
	index("IDX_users_access_role").using("btree", table.accessRole.asc().nullsLast().op("int4_ops")),
	index("IDX_users_account_type").using("btree", table.accountType.asc().nullsLast().op("int4_ops")),
	index("IDX_users_email").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("IDX_users_session_token").using("btree", table.sessionToken.asc().nullsLast().op("text_ops")),
	index("idx_users_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("idx_users_first_visit_at").using("btree", table.firstVisitAt.asc().nullsLast().op("timestamp_ops")),
	index("idx_users_is_ephemeral").using("btree", table.isEphemeral.asc().nullsLast().op("bool_ops")),
	index("idx_users_last_seen_at").using("btree", table.lastSeenAt.asc().nullsLast().op("timestamp_ops")),
	unique("users_email_unique").on(table.email),
	unique("users_handle_unique").on(table.handle),
	unique("users_session_token_unique").on(table.sessionToken),
]);

export const revenueShares = pgTable("revenue_shares", {
	id: serial().primaryKey().notNull(),
	recipeId: integer("recipe_id").notNull(),
	creatorId: varchar("creator_id").notNull(),
	userId: varchar("user_id").notNull(),
	generationId: integer("generation_id").notNull(),
	creditsUsed: integer("credits_used").notNull(),
	revenueAmount: integer("revenue_amount").notNull(),
	sharePercentage: integer("share_percentage").notNull(),
	creatorEarnings: integer("creator_earnings").notNull(),
	isPaidCredits: boolean("is_paid_credits").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
]);

export const smartGenerationRequests = pgTable("smart_generation_requests", {
	id: serial().primaryKey().notNull(),
	creatorId: varchar("creator_id").notNull(),
	recipeId: integer("recipe_id").notNull(),
	recipeVariables: jsonb("recipe_variables").notNull(),
	recipeVariablesHash: varchar("recipe_variables_hash", { length: 64 }).notNull(),
	status: varchar({ length: 20 }).default('pending').notNull(),
	generationId: integer("generation_id"),
	backlogVideoId: integer("backlog_video_id"),
	creditsCost: integer("credits_cost"),
	failureReason: text("failure_reason"),
	errorDetails: jsonb("error_details"),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
]);

export const recipeOptionTagIcons = pgTable("recipe_option_tag_icon", {
	id: text().primaryKey().notNull(),
	display: text().notNull(),
	icon: text(),
	color: text(),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
	index("IDX_recipe_option_tag_icon_id").using("btree", table.id.asc().nullsLast().op("text_ops")),
	index("IDX_recipe_option_tag_icon_icon").using("btree", table.icon.asc().nullsLast().op("text_ops")),
]);

export const recipeUsage = pgTable("recipe_usage", {
	recipeId: integer("recipe_id").primaryKey().notNull(),
	usageCount: integer("usage_count").default(0).notNull(),
	lastUsedAt: timestamp("last_used_at").defaultNow(),
});

export const recipeUsageOptions = pgTable("recipe_usage_options", {
	recipeId: integer("recipe_id").primaryKey().notNull(),
	lastGenerationId: integer("last_generation_id").default(0).notNull(),
	summary: jsonb("summary").default('{}').notNull(),
}, (table) => [
	index("idx_recipe_usage_options_last_generation_id").on(table.lastGenerationId),
]);

export const typeAudio = pgTable("type_audio", {
	id: integer().primaryKey().notNull(),
	title: varchar({ length: 50 }).notNull(),
}, (table) => [
	unique("type_audio_title_unique").on(table.title),
]);

export const typeUser = pgTable("type_user", {
	id: integer().primaryKey().notNull(),
	title: text().notNull(),
}, (table) => [
	unique("type_user_title_unique").on(table.title),
]);

export const typeRole = pgTable("type_role", {
	id: integer().primaryKey().notNull(),
	title: text().notNull(),
}, (table) => [
	unique("type_role_title_unique").on(table.title),
]);

// Component Registry System
export const componentRegistry = pgTable("component_registry", {
	id: serial().primaryKey().notNull(),
	componentId: varchar("component_id", { length: 100 }).unique().notNull(),
	name: varchar("name", { length: 200 }).notNull(),
	version: varchar("version", { length: 20 }).notNull().default("1.0.0"),
	description: text("description"),
	category: varchar("category", { length: 100 }),
	tags: text("tags").array(),
	creditCost: integer("credit_cost").default(0),
	estimatedProcessingTime: integer("estimated_processing_time"),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
	index("idx_component_registry_component_id").on(table.componentId),
	index("idx_component_registry_category").on(table.category),
	index("idx_component_registry_is_active").on(table.isActive),
]);

export const componentInputChannels = pgTable("component_input_channels", {
	id: serial().primaryKey().notNull(),
	componentId: varchar("component_id", { length: 100 }).notNull(),
	channelId: varchar("channel_id", { length: 100 }).notNull(),
	channelName: varchar("channel_name", { length: 200 }).notNull(),
	type: integer("type").notNull(),
	position: integer("position").notNull(),
	isRequired: boolean("is_required").default(false),
	description: text("description"),
	validationRules: jsonb("validation_rules"),
	defaultValue: text("default_value"),
	createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
	index("idx_component_input_channels_component_id").on(table.componentId),
	index("idx_component_input_channels_position").on(table.position),
	unique("component_input_channels_unique").on(table.componentId, table.channelId),
]);

export const componentOutputChannels = pgTable("component_output_channels", {
	id: serial().primaryKey().notNull(),
	componentId: varchar("component_id", { length: 100 }).notNull(),
	channelId: varchar("channel_id", { length: 100 }).notNull(),
	channelName: varchar("channel_name", { length: 200 }).notNull(),
	type: integer("type").notNull(),
	description: text("description"),
	metadata: jsonb("metadata"),
	createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
	index("idx_component_output_channels_component_id").on(table.componentId),
	unique("component_output_channels_unique").on(table.componentId, table.channelId),
]);

export const componentUsage = pgTable("component_usage", {
	id: serial().primaryKey().notNull(),
	componentId: varchar("component_id", { length: 100 }).notNull(),
	userId: varchar("user_id"),
	executionId: varchar("execution_id", { length: 100 }),
	inputData: jsonb("input_data"),
	outputData: jsonb("output_data"),
	processingTimeMs: integer("processing_time_ms"),
	creditCost: integer("credit_cost"),
	success: boolean("success"),
	errorMessage: text("error_message"),
	createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
	index("idx_component_usage_component_id").on(table.componentId),
	index("idx_component_usage_user_id").on(table.userId),
	index("idx_component_usage_execution_id").on(table.executionId),
	index("idx_component_usage_created_at").on(table.createdAt),
	index("idx_component_usage_success").on(table.success),
]);

export const componentDependencies = pgTable("component_dependencies", {
	id: serial().primaryKey().notNull(),
	componentId: varchar("component_id", { length: 100 }).notNull(),
	dependsOnComponentId: varchar("depends_on_component_id", { length: 100 }).notNull(),
	dependencyType: varchar("dependency_type", { length: 50 }),
	description: text("description"),
	createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
	index("idx_component_dependencies_component_id").on(table.componentId),
	index("idx_component_dependencies_depends_on").on(table.dependsOnComponentId),
]);

// User Media Library (canonical additions for user library feature)
export const userAssets = pgTable("user_assets", {
    id: serial().primaryKey().notNull(),
    userId: varchar("user_id").notNull(),
    assetId: varchar("asset_id", { length: 64 }).notNull(),
    originalFilename: varchar("original_filename").notNull(),
    displayName: varchar("display_name").notNull(),
    normalizedName: varchar("normalized_name"),
    s3Key: varchar("s3_key").notNull(),
    cdnUrl: varchar("cdn_url").notNull(),
    mimeType: varchar("mime_type").notNull(),
    fileSize: integer("file_size").notNull(),
    assetType: integer("asset_type").notNull(),
    source: integer("source").notNull(),
    dimensions: jsonb("dimensions"),
    duration: integer("duration"),
    thumbnailUrl: varchar("thumbnail_url"),
    userTags: text("user_tags").array(),
    systemTags: text("system_tags").array(),
    autoClassification: jsonb("auto_classification"),
    aiClassification: jsonb("ai_classification"),
    usageCount: integer("usage_count").default(0).notNull(),
    lastUsedAt: timestamp("last_used_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    isDeleted: boolean("is_deleted").default(false),
    deletedAt: timestamp("deleted_at"),
}, (table) => [
    unique("user_assets_asset_id_unique").on(table.assetId),
    index("idx_user_assets_user_type_created").using("btree",
        table.userId.asc().nullsLast().op("text_ops"),
        table.assetType.asc().nullsLast().op("int4_ops"),
        table.createdAt.desc().nullsFirst().op("timestamp_ops")
    ),
    index("idx_user_assets_normalized_name").using("btree", table.normalizedName.asc().nullsLast().op("text_ops")),
]);

// Stub table for system assets (to be implemented later)
export const systemAssets = pgTable("system_assets", {
  id: serial().primaryKey().notNull(),
  systemId: varchar("system_id").notNull(),
  assetId: varchar("asset_id", { length: 64 }).notNull(),
  name: varchar().notNull(),
  url: varchar().notNull(),
  mimeType: varchar("mime_type").notNull(),
  fileSize: integer("file_size").notNull(),
  dimensions: jsonb(),
  tags: text().array(),
  metadata: jsonb(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  unique("system_assets_asset_id_unique").on(table.assetId),
  index("idx_system_assets_system_id").on(table.systemId),
]);

// Stub table for market assets (to be implemented later)
export const marketAssets = pgTable("market_assets", {
  id: serial().primaryKey().notNull(),
  creatorId: varchar("creator_id").notNull(),
  assetId: varchar("asset_id", { length: 64 }).notNull(),
  name: varchar().notNull(),
  url: varchar().notNull(),
  mimeType: varchar("mime_type").notNull(),
  fileSize: integer("file_size").notNull(),
  dimensions: jsonb(),
  tags: text().array(),
  metadata: jsonb(),
  isPublic: boolean("is_public").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  unique("market_assets_asset_id_unique").on(table.assetId),
  index("idx_market_assets_creator_id").on(table.creatorId),
  index("idx_market_assets_is_public").on(table.isPublic),
]);

// Type exports for TypeScript
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = typeof recipes.$inferInsert;
export type Generation = typeof generations.$inferSelect;
export type InsertGeneration = typeof generations.$inferInsert;
export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type InsertCreditTransaction = typeof creditTransactions.$inferInsert;
export type RevenueShare = typeof revenueShares.$inferSelect;
export type InsertRevenueShare = typeof revenueShares.$inferInsert;
export type RecipeSample = typeof recipeSamples.$inferSelect;
export type InsertRecipeSample = typeof recipeSamples.$inferInsert;
export type ExportTransaction = typeof exportTransactions.$inferSelect;
export type InsertExportTransaction = typeof exportTransactions.$inferInsert;
export type SampleLike = typeof sampleLikes.$inferSelect;
export type InsertSampleLike = typeof sampleLikes.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type InsertTag = typeof tags.$inferInsert;
export type RecipeOptionTagIcon = typeof recipeOptionTagIcons.$inferSelect;
export type InsertRecipeOptionTagIcon = typeof recipeOptionTagIcons.$inferInsert;
export type SmartGenerationRequest = typeof smartGenerationRequests.$inferSelect;
export type InsertSmartGenerationRequest = typeof smartGenerationRequests.$inferInsert;
export type BacklogVideo = typeof backlogVideos.$inferSelect;
export type InsertBacklogVideo = typeof backlogVideos.$inferInsert;
export type Provider = typeof providers.$inferSelect;
export type InsertProvider = typeof providers.$inferInsert;
export type TypeService = typeof typeServices.$inferSelect;
export type InsertTypeService = typeof typeServices.$inferInsert;
export type TypeAudio = typeof typeAudio.$inferSelect;
export type InsertTypeAudio = typeof typeAudio.$inferInsert;
export type TypeUser = typeof typeUser.$inferSelect;
export type InsertTypeUser = typeof typeUser.$inferInsert;
export type TypeRole = typeof typeRole.$inferSelect;
export type InsertTypeRole = typeof typeRole.$inferInsert;
export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

// Component Registry Type Exports
export type ComponentRegistry = typeof componentRegistry.$inferSelect;
export type InsertComponentRegistry = typeof componentRegistry.$inferInsert;
export type ComponentInputChannel = typeof componentInputChannels.$inferSelect;
export type InsertComponentInputChannel = typeof componentInputChannels.$inferInsert;
export type ComponentOutputChannel = typeof componentOutputChannels.$inferSelect;
export type InsertComponentOutputChannel = typeof componentOutputChannels.$inferInsert;
export type ComponentUsage = typeof componentUsage.$inferSelect;
export type InsertComponentUsage = typeof componentUsage.$inferInsert;
export type ComponentDependency = typeof componentDependencies.$inferSelect;
export type InsertComponentDependency = typeof componentDependencies.$inferInsert;

// Asset table type exports
export type UserAsset = typeof userAssets.$inferSelect;
export type InsertUserAsset = typeof userAssets.$inferInsert;
export type SystemAsset = typeof systemAssets.$inferSelect;
export type InsertSystemAsset = typeof systemAssets.$inferInsert;
export type MarketAsset = typeof marketAssets.$inferSelect;
export type InsertMarketAsset = typeof marketAssets.$inferInsert;

// Insert schemas for validation
export const insertBrandAssetSchema = {
  userId: varchar("user_id").notNull(),
  name: varchar().notNull(),
  fileName: varchar("file_name").notNull(),
  fileUrl: varchar("file_url").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: varchar("mime_type").notNull(),
  width: integer(),
  height: integer(),
  tags: text().array(),
  isTransparent: boolean("is_transparent").default(false),
};
