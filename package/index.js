var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/env.ts
import dotenv from "dotenv";
var init_env = __esm({
  "server/env.ts"() {
    "use strict";
    process.noDeprecation = true;
    dotenv.config();
  }
});

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  backlogVideos: () => backlogVideos,
  brandAssets: () => brandAssets,
  componentDependencies: () => componentDependencies,
  componentInputChannels: () => componentInputChannels,
  componentOutputChannels: () => componentOutputChannels,
  componentRegistry: () => componentRegistry,
  componentUsage: () => componentUsage,
  creditTransactions: () => creditTransactions,
  exportTransactions: () => exportTransactions,
  generations: () => generations,
  insertBrandAssetSchema: () => insertBrandAssetSchema,
  providers: () => providers,
  recipeOptionTagIcons: () => recipeOptionTagIcons,
  recipeSamples: () => recipeSamples,
  recipeUsage: () => recipeUsage,
  recipeUsageOptions: () => recipeUsageOptions,
  recipes: () => recipes,
  revenueShares: () => revenueShares,
  sampleLikes: () => sampleLikes,
  services: () => services,
  sessions: () => sessions,
  smartGenerationRequests: () => smartGenerationRequests,
  tags: () => tags,
  typeAudio: () => typeAudio,
  typeRole: () => typeRole,
  typeServices: () => typeServices,
  typeUser: () => typeUser,
  userAssets: () => userAssets,
  users: () => users
});
import { pgTable, index, serial, varchar, integer, text, boolean, timestamp, jsonb, unique, numeric } from "drizzle-orm/pg-core";
var brandAssets, creditTransactions, backlogVideos, recipeSamples, exportTransactions, providers, generations, sampleLikes, services, typeServices, sessions, tags, recipes, users, revenueShares, smartGenerationRequests, recipeOptionTagIcons, recipeUsage, recipeUsageOptions, typeAudio, typeUser, typeRole, componentRegistry, componentInputChannels, componentOutputChannels, componentUsage, componentDependencies, userAssets, insertBrandAssetSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    brandAssets = pgTable("brand_assets", {
      id: serial().primaryKey().notNull(),
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
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      index("idx_brand_assets_tags_gin").using("gin", table.tags.asc().nullsLast().op("array_ops")),
      index("idx_brand_assets_user_created").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.createdAt.desc().nullsFirst().op("text_ops"))
    ]);
    creditTransactions = pgTable("credit_transactions", {
      id: serial().primaryKey().notNull(),
      userId: varchar("user_id").notNull(),
      amount: integer().notNull(),
      type: text().notNull(),
      description: text().notNull(),
      createdAt: timestamp("created_at").defaultNow(),
      paymentId: varchar("payment_id"),
      metadata: jsonb()
    }, (table) => [
      index("idx_credit_transactions_user_created").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.createdAt.desc().nullsFirst().op("text_ops"))
    ]);
    backlogVideos = pgTable("backlog_videos", {
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
      createdAt: timestamp("created_at").defaultNow()
    }, (table) => []);
    recipeSamples = pgTable("recipe_samples", {
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
      moderationStatus: varchar("moderation_status", { length: 20 }).default("pending"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      index("idx_recipe_samples_featured_likes").using("btree", table.isFeatured.asc().nullsLast().op("bool_ops"), table.likeCount.desc().nullsFirst().op("int4_ops")),
      index("idx_recipe_samples_recipe_status").using("btree", table.recipeId.asc().nullsLast().op("int4_ops"), table.moderationStatus.asc().nullsLast().op("text_ops"))
    ]);
    exportTransactions = pgTable("export_transactions", {
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
      createdAt: timestamp("created_at").defaultNow()
    }, (table) => []);
    providers = pgTable("providers", {
      id: serial().primaryKey().notNull(),
      title: varchar({ length: 100 }).notNull(),
      description: text(),
      numSlots: integer("num_slots").default(1).notNull(),
      isActive: boolean("is_active").default(true).notNull(),
      config: jsonb(),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      unique("providers_title_unique").on(table.title)
    ]);
    generations = pgTable("generations", {
      id: serial().primaryKey().notNull(),
      userId: varchar("user_id").notNull(),
      recipeId: integer("recipe_id"),
      recipeTitle: text("recipe_title"),
      prompt: text().notNull(),
      imageUrl: text("image_url"),
      status: text().default("pending").notNull(),
      metadata: jsonb(),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow(),
      videoUrl: text("video_url"),
      thumbnailUrl: text("thumbnail_url"),
      s3Key: text("s3_key"),
      assetId: text("asset_id"),
      queuePosition: integer("queue_position"),
      processingStartedAt: timestamp("processing_started_at"),
      type: varchar({ length: 20 }).default("image").notNull(),
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
      recoveryChecked: boolean("recovery_checked").default(false).notNull()
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
      unique("generations_short_id_unique").on(table.shortId)
    ]);
    sampleLikes = pgTable("sample_likes", {
      id: serial().primaryKey().notNull(),
      sampleId: integer("sample_id").notNull(),
      userId: varchar("user_id").notNull(),
      createdAt: timestamp("created_at").defaultNow()
    }, (table) => []);
    services = pgTable("services", {
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
      baseCost: numeric("base_cost", { precision: 20, scale: 16 }).default("0.0000000000000000").notNull()
    }, (table) => [
      index("IDX_services_active").using("btree", table.isActive.asc().nullsLast().op("bool_ops")),
      index("IDX_services_provider_id").using("btree", table.providerId.asc().nullsLast().op("int4_ops")),
      index("IDX_services_provider_title").using("btree", table.providerTitle.asc().nullsLast().op("text_ops")),
      index("IDX_services_type_id").using("btree", table.typeId.asc().nullsLast().op("int4_ops"))
    ]);
    typeServices = pgTable("type_services", {
      id: serial().primaryKey().notNull(),
      title: varchar({ length: 100 }).notNull(),
      createdAt: timestamp("created_at").defaultNow()
    }, (table) => [
      unique("type_services_title_unique").on(table.title)
    ]);
    sessions = pgTable("sessions", {
      sid: varchar().primaryKey().notNull(),
      sess: jsonb().notNull(),
      expire: timestamp().notNull()
    }, (table) => [
      index("IDX_session_expire").using("btree", table.expire.asc().nullsLast().op("timestamp_ops"))
    ]);
    tags = pgTable("tags", {
      id: serial().primaryKey().notNull(),
      name: varchar({ length: 50 }).notNull(),
      description: text(),
      color: varchar({ length: 20 }).default("gray"),
      isActive: boolean("is_active").default(true).notNull(),
      isHidden: boolean("is_hidden").default(false).notNull(),
      createdAt: timestamp("created_at").defaultNow()
    }, (table) => [
      unique("tags_name_unique").on(table.name),
      index("idx_tags_is_hidden").using("btree", table.isHidden.asc().nullsLast().op("bool_ops"))
    ]);
    recipes = pgTable("recipes", {
      id: serial().primaryKey().notNull(),
      name: text().notNull(),
      slug: varchar({ length: 255 }).notNull(),
      description: text().notNull(),
      prompt: text().notNull(),
      instructions: text().notNull(),
      category: text().notNull(),
      style: varchar({ length: 100 }).default("photorealistic").notNull(),
      model: varchar({ length: 100 }).default("flux-1").notNull(),
      creditCost: integer("credit_cost").notNull(),
      usageCount: integer("usage_count").default(0).notNull(),
      isActive: boolean("is_active").default(true).notNull(),
      createdAt: timestamp("created_at").defaultNow(),
      creatorId: varchar("creator_id"),
      videoProvider: varchar("video_provider", { length: 50 }),
      videoDuration: integer("video_duration").default(10),
      videoQuality: varchar("video_quality", { length: 20 }).default("hd"),
      videoAspectRatio: varchar("video_aspect_ratio", { length: 10 }).default("16:9"),
      imageProvider: varchar("image_provider", { length: 50 }),
      imageQuality: varchar("image_quality", { length: 20 }).default("hd"),
      imageSize: varchar("image_size", { length: 20 }).default("landscape_4_3"),
      numImages: integer("num_images").default(1),
      isPublic: boolean("is_public").default(false).notNull(),
      hasContentRestrictions: boolean("has_content_restrictions").default(true).notNull(),
      revenueShareEnabled: boolean("revenue_share_enabled").default(false).notNull(),
      revenueSharePercentage: integer("revenue_share_percentage").default(20).notNull(),
      recipeSteps: jsonb("recipe_steps").notNull(),
      generationType: varchar("generation_type", { length: 20 }).default("image").notNull(),
      referralCode: varchar("referral_code", { length: 20 }),
      previewImageUrl: text("preview_image_url"),
      workflowType: varchar("workflow_type", { length: 50 }).default("image").notNull(),
      workflowComponents: jsonb("workflow_components"),
      tagHighlights: integer("tag_highlights").array(),
      audioType: integer("audio_type").default(0).notNull()
    }, (table) => [
      index("idx_recipes_category").using("btree", table.category.asc().nullsLast().op("text_ops")),
      index("idx_recipes_creator_id").using("btree", table.creatorId.asc().nullsLast().op("text_ops")),
      index("idx_recipes_generation_type").using("btree", table.generationType.asc().nullsLast().op("text_ops")),
      index("idx_recipes_is_active").using("btree", table.isActive.asc().nullsLast().op("bool_ops")),
      index("idx_recipes_workflow_type").using("btree", table.workflowType.asc().nullsLast().op("text_ops")),
      unique("recipes_referral_code_unique").on(table.referralCode)
    ]);
    users = pgTable("users", {
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
      accountType: integer("account_type").default(2).notNull(),
      // 1=System, 2=Guest, 3=Registered
      accessRole: integer("access_role").default(1).notNull(),
      // 1=User, 2=Test, 3=Admin
      sessionToken: varchar("session_token"),
      lastSeenAt: timestamp("last_seen_at").defaultNow(),
      passwordHash: varchar("password_hash"),
      oauthProvider: varchar("oauth_provider", { length: 20 }),
      isEphemeral: boolean("is_ephemeral").default(false),
      canUpgradeToRegistered: boolean("can_upgrade_to_registered").default(true),
      lastCreditRefresh: timestamp("last_credit_refresh").defaultNow()
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
      unique("users_session_token_unique").on(table.sessionToken)
    ]);
    revenueShares = pgTable("revenue_shares", {
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
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (table) => []);
    smartGenerationRequests = pgTable("smart_generation_requests", {
      id: serial().primaryKey().notNull(),
      creatorId: varchar("creator_id").notNull(),
      recipeId: integer("recipe_id").notNull(),
      recipeVariables: jsonb("recipe_variables").notNull(),
      recipeVariablesHash: varchar("recipe_variables_hash", { length: 64 }).notNull(),
      status: varchar({ length: 20 }).default("pending").notNull(),
      generationId: integer("generation_id"),
      backlogVideoId: integer("backlog_video_id"),
      creditsCost: integer("credits_cost"),
      failureReason: text("failure_reason"),
      errorDetails: jsonb("error_details"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => []);
    recipeOptionTagIcons = pgTable("recipe_option_tag_icon", {
      id: text().primaryKey().notNull(),
      display: text().notNull(),
      icon: text(),
      color: text(),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      index("IDX_recipe_option_tag_icon_id").using("btree", table.id.asc().nullsLast().op("text_ops")),
      index("IDX_recipe_option_tag_icon_icon").using("btree", table.icon.asc().nullsLast().op("text_ops"))
    ]);
    recipeUsage = pgTable("recipe_usage", {
      recipeId: integer("recipe_id").primaryKey().notNull(),
      usageCount: integer("usage_count").default(0).notNull(),
      lastUsedAt: timestamp("last_used_at").defaultNow()
    });
    recipeUsageOptions = pgTable("recipe_usage_options", {
      recipeId: integer("recipe_id").primaryKey().notNull(),
      lastGenerationId: integer("last_generation_id").default(0).notNull(),
      summary: jsonb("summary").default("{}").notNull()
    }, (table) => [
      index("idx_recipe_usage_options_last_generation_id").on(table.lastGenerationId)
    ]);
    typeAudio = pgTable("type_audio", {
      id: integer().primaryKey().notNull(),
      title: varchar({ length: 50 }).notNull()
    }, (table) => [
      unique("type_audio_title_unique").on(table.title)
    ]);
    typeUser = pgTable("type_user", {
      id: integer().primaryKey().notNull(),
      title: text().notNull()
    }, (table) => [
      unique("type_user_title_unique").on(table.title)
    ]);
    typeRole = pgTable("type_role", {
      id: integer().primaryKey().notNull(),
      title: text().notNull()
    }, (table) => [
      unique("type_role_title_unique").on(table.title)
    ]);
    componentRegistry = pgTable("component_registry", {
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
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      index("idx_component_registry_component_id").on(table.componentId),
      index("idx_component_registry_category").on(table.category),
      index("idx_component_registry_is_active").on(table.isActive)
    ]);
    componentInputChannels = pgTable("component_input_channels", {
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
      createdAt: timestamp("created_at").defaultNow()
    }, (table) => [
      index("idx_component_input_channels_component_id").on(table.componentId),
      index("idx_component_input_channels_position").on(table.position),
      unique("component_input_channels_unique").on(table.componentId, table.channelId)
    ]);
    componentOutputChannels = pgTable("component_output_channels", {
      id: serial().primaryKey().notNull(),
      componentId: varchar("component_id", { length: 100 }).notNull(),
      channelId: varchar("channel_id", { length: 100 }).notNull(),
      channelName: varchar("channel_name", { length: 200 }).notNull(),
      type: integer("type").notNull(),
      description: text("description"),
      metadata: jsonb("metadata"),
      createdAt: timestamp("created_at").defaultNow()
    }, (table) => [
      index("idx_component_output_channels_component_id").on(table.componentId),
      unique("component_output_channels_unique").on(table.componentId, table.channelId)
    ]);
    componentUsage = pgTable("component_usage", {
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
      createdAt: timestamp("created_at").defaultNow()
    }, (table) => [
      index("idx_component_usage_component_id").on(table.componentId),
      index("idx_component_usage_user_id").on(table.userId),
      index("idx_component_usage_execution_id").on(table.executionId),
      index("idx_component_usage_created_at").on(table.createdAt),
      index("idx_component_usage_success").on(table.success)
    ]);
    componentDependencies = pgTable("component_dependencies", {
      id: serial().primaryKey().notNull(),
      componentId: varchar("component_id", { length: 100 }).notNull(),
      dependsOnComponentId: varchar("depends_on_component_id", { length: 100 }).notNull(),
      dependencyType: varchar("dependency_type", { length: 50 }),
      description: text("description"),
      createdAt: timestamp("created_at").defaultNow()
    }, (table) => [
      index("idx_component_dependencies_component_id").on(table.componentId),
      index("idx_component_dependencies_depends_on").on(table.dependsOnComponentId)
    ]);
    userAssets = pgTable("user_assets", {
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
      deletedAt: timestamp("deleted_at")
    }, (table) => [
      unique("user_assets_asset_id_unique").on(table.assetId),
      index("idx_user_assets_user_type_created").using(
        "btree",
        table.userId.asc().nullsLast().op("text_ops"),
        table.assetType.asc().nullsLast().op("int4_ops"),
        table.createdAt.desc().nullsFirst().op("timestamp_ops")
      ),
      index("idx_user_assets_normalized_name").using("btree", table.normalizedName.asc().nullsLast().op("text_ops"))
    ]);
    insertBrandAssetSchema = {
      userId: varchar("user_id").notNull(),
      name: varchar().notNull(),
      fileName: varchar("file_name").notNull(),
      fileUrl: varchar("file_url").notNull(),
      fileSize: integer("file_size").notNull(),
      mimeType: varchar("mime_type").notNull(),
      width: integer(),
      height: integer(),
      tags: text().array(),
      isTransparent: boolean("is_transparent").default(false)
    };
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  db: () => db,
  getConnection: () => getConnection,
  pool: () => pool
});
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
var pool, getConnection, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?"
      );
    }
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,
      // Increased maximum number of connections
      idleTimeoutMillis: 6e4,
      // Close idle connections after 60 seconds (increased)
      connectionTimeoutMillis: 1e4,
      // Connection timeout of 10 seconds (increased for RDS)
      maxUses: 1e3,
      // Reduced to prevent stale connections more frequently
      // Add SSL configuration for RDS
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      // Add keep-alive settings
      keepAlive: true,
      keepAliveInitialDelayMillis: 1e4
    });
    pool.on("error", (err) => {
      console.error("Unexpected error on idle client", err);
      if ("code" in err && (err.code === "EADDRNOTAVAIL" || err.code === "ECONNRESET")) {
        console.log("Network error detected, will retry connection...");
      }
    });
    getConnection = async (retries = 3, delay = 1e3) => {
      for (let i = 0; i < retries; i++) {
        try {
          const client = await pool.connect();
          return client;
        } catch (error) {
          console.error(`Database connection attempt ${i + 1} failed:`, error);
          if (i === retries - 1) {
            throw error;
          }
          await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
        }
      }
    };
    db = drizzle({ client: pool, schema: schema_exports });
  }
});

// server/cache-service.ts
var CacheService, cacheService;
var init_cache_service = __esm({
  "server/cache-service.ts"() {
    "use strict";
    CacheService = class _CacheService {
      cache = /* @__PURE__ */ new Map();
      DEFAULT_TTL = 5 * 60 * 1e3;
      // 5 minutes
      set(key, data, ttl = this.DEFAULT_TTL) {
        this.cache.set(key, {
          data,
          timestamp: Date.now(),
          ttl
        });
      }
      get(key) {
        const entry = this.cache.get(key);
        if (!entry) return null;
        const isExpired = Date.now() - entry.timestamp > entry.ttl;
        if (isExpired) {
          this.cache.delete(key);
          return null;
        }
        return entry.data;
      }
      delete(key) {
        this.cache.delete(key);
      }
      clear() {
        this.cache.clear();
      }
      // Cache key generators - Session-specific for future isolation support
      static guestGenerationsKey(sessionId, page, limit) {
        return `guest_generations_${sessionId}_${page}_${limit}`;
      }
      static guestGenerationsStatsKey(userId) {
        return `guest_generations_stats_${userId}`;
      }
      static queueStatsKey() {
        return "queue_stats";
      }
      // Invalidate related cache entries - Session-specific for future isolation support
      invalidateGuestGenerations(sessionId) {
        const keysToDelete = [];
        this.cache.forEach((_, key) => {
          if (sessionId) {
            if (key.startsWith(`guest_generations_${sessionId}_`)) {
              keysToDelete.push(key);
            }
          } else {
            if (key.startsWith("guest_generations_")) {
              keysToDelete.push(key);
            }
          }
        });
        keysToDelete.forEach((key) => this.cache.delete(key));
      }
      invalidateStats(sessionId) {
        if (sessionId) {
          this.delete(_CacheService.guestGenerationsStatsKey(sessionId));
        } else {
          const keysToDelete = [];
          this.cache.forEach((_, key) => {
            if (key.startsWith("guest_generations_stats_")) {
              keysToDelete.push(key);
            }
          });
          keysToDelete.forEach((key) => this.cache.delete(key));
        }
        this.delete(_CacheService.queueStatsKey());
      }
    };
    cacheService = new CacheService();
  }
});

// server/storage.ts
var storage_exports = {};
__export(storage_exports, {
  DatabaseStorage: () => DatabaseStorage,
  storage: () => storage
});
import { eq, desc, and, sql, count, lt, inArray, isNull, or } from "drizzle-orm";
var DatabaseStorage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_db();
    init_cache_service();
    init_schema();
    DatabaseStorage = class {
      async getUser(id) {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user;
      }
      async getUserBySessionToken(sessionToken) {
        const [user] = await db.select().from(users).where(eq(users.sessionToken, sessionToken));
        return user;
      }
      async getUserByEmail(email) {
        const [user] = await db.select().from(users).where(eq(users.email, email));
        return user;
      }
      async upsertUser(userData) {
        const [user] = await db.insert(users).values({
          ...userData,
          credits: userData.credits ?? 10
          // Give new users 10 free credits
        }).onConflictDoUpdate({
          target: users.id,
          set: {
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            profileImageUrl: userData.profileImageUrl,
            accountType: userData.accountType,
            accessRole: userData.accessRole,
            sessionToken: userData.sessionToken,
            lastSeenAt: userData.lastSeenAt,
            passwordHash: userData.passwordHash,
            oauthProvider: userData.oauthProvider,
            isEphemeral: userData.isEphemeral,
            canUpgradeToRegistered: userData.canUpgradeToRegistered,
            updatedAt: /* @__PURE__ */ new Date()
          }
        }).returning();
        return user;
      }
      async updateUser(id, updates) {
        const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
        return user;
      }
      async updateUserCredits(id, credits) {
        const [user] = await db.update(users).set({ credits, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, id)).returning();
        return user;
      }
      async getAllRecipes() {
        const allRecipes = await db.select().from(recipes).where(eq(recipes.isActive, true));
        const usageCounts = await db.select({
          recipeId: recipeUsage.recipeId,
          usageCount: recipeUsage.usageCount
        }).from(recipeUsage);
        const usageMap = new Map(usageCounts.map((u) => [u.recipeId, u.usageCount]));
        return allRecipes.map((recipe) => ({
          ...recipe,
          usageCount: usageMap.get(recipe.id) || 0
        }));
      }
      async getRecipeById(id) {
        const cacheKey = `recipe_${id}`;
        const cached = cacheService.get(cacheKey);
        if (cached) {
          return cached;
        }
        const [recipe] = await db.select().from(recipes).where(eq(recipes.id, id));
        if (recipe) {
          cacheService.set(cacheKey, recipe, 10 * 60 * 1e3);
        }
        return recipe;
      }
      async getRecipesByIds(ids) {
        if (ids.length === 0) return [];
        const cachedRecipes = [];
        const uncachedIds = [];
        for (const id of ids) {
          const cacheKey = `recipe_${id}`;
          const cached = cacheService.get(cacheKey);
          if (cached) {
            cachedRecipes.push(cached);
          } else {
            uncachedIds.push(id);
          }
        }
        let dbRecipes = [];
        if (uncachedIds.length > 0) {
          dbRecipes = await db.select().from(recipes).where(inArray(recipes.id, uncachedIds));
          for (const recipe of dbRecipes) {
            const cacheKey = `recipe_${recipe.id}`;
            cacheService.set(cacheKey, recipe, 10 * 60 * 1e3);
          }
        }
        const allRecipes = [...cachedRecipes, ...dbRecipes];
        return allRecipes.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
      }
      async getRecipeBySlug(slug) {
        const [recipe] = await db.select().from(recipes).where(eq(recipes.slug, slug));
        return recipe;
      }
      async createRecipe(recipe) {
        const [newRecipe] = await db.insert(recipes).values(recipe).returning();
        return newRecipe;
      }
      async updateRecipe(id, updates) {
        const [updatedRecipe] = await db.update(recipes).set(updates).where(eq(recipes.id, id)).returning();
        return updatedRecipe;
      }
      async incrementRecipeUsage(id) {
        await db.insert(recipeUsage).values({
          recipeId: id,
          usageCount: 1,
          lastUsedAt: /* @__PURE__ */ new Date()
        }).onConflictDoUpdate({
          target: recipeUsage.recipeId,
          set: {
            usageCount: sql`${recipeUsage.usageCount} + 1`,
            lastUsedAt: /* @__PURE__ */ new Date()
          }
        });
      }
      async getRecipeUsageCount(id) {
        const result = await db.select({ usageCount: recipeUsage.usageCount }).from(recipeUsage).where(eq(recipeUsage.recipeId, id));
        return result[0]?.usageCount || 0;
      }
      async createGeneration(generation, sessionToken) {
        const shortId = await this.generateUniqueShortId();
        const metadata = {
          ...generation.metadata || {},
          ...sessionToken && { sessionId: sessionToken }
        };
        const [newGeneration] = await db.insert(generations).values({
          ...generation,
          shortId,
          metadata
        }).returning();
        return newGeneration;
      }
      /**
       * Generate a unique short ID with collision handling
       * Uses nanoid with custom alphabet for YouTube-style IDs
       */
      async generateUniqueShortId(maxRetries = 10) {
        const { customAlphabet } = await import("nanoid");
        const youtubeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
        const generateYoutubeId = customAlphabet(youtubeAlphabet, 11);
        for (let attempt = 0; attempt < maxRetries; attempt++) {
          try {
            const shortId = generateYoutubeId();
            const existing = await db.select({ id: generations.id }).from(generations).where(eq(generations.shortId, shortId)).limit(1);
            if (existing.length === 0) {
              return shortId;
            }
            console.log(`Short ID collision detected on attempt ${attempt + 1}, retrying...`);
          } catch (error) {
            console.error(`Error generating short ID on attempt ${attempt + 1}:`, error);
            if (attempt === maxRetries - 1) {
              throw new Error("Failed to generate unique short ID after maximum retries");
            }
          }
        }
        throw new Error("Failed to generate unique short ID after maximum retries");
      }
      async getUserGenerations(userId, pagination) {
        const page = pagination?.page || 1;
        const limit = pagination?.limit || 10;
        const offset = pagination?.offset || 0;
        const status = pagination?.status;
        const cacheKey = `user_generations_${userId}_${page}_${limit}_${status || "all"}`;
        const cached = cacheService.get(cacheKey);
        if (cached) {
          return cached;
        }
        const whereConditions = [eq(generations.userId, userId)];
        if (status && status !== "all") {
          whereConditions.push(eq(generations.status, status));
        }
        const [paginatedGenerations, totalCountResult] = await Promise.all([
          // Get paginated generations
          db.select().from(generations).where(and(...whereConditions)).orderBy(desc(generations.createdAt)).limit(limit).offset(offset),
          // Get total count for pagination metadata
          db.select({ count: count() }).from(generations).where(and(...whereConditions))
        ]);
        const total = totalCountResult[0]?.count || 0;
        const result = {
          data: paginatedGenerations,
          total
        };
        cacheService.set(cacheKey, result, 5 * 60 * 1e3);
        return result;
      }
      async getGenerationById(id) {
        const result = await db.select().from(generations).where(eq(generations.id, id)).limit(1);
        return result[0];
      }
      async updateGenerationStatus(id, status, imageUrl) {
        const updateData = { status };
        if (imageUrl) {
          updateData.imageUrl = imageUrl;
        }
        await db.update(generations).set(updateData).where(eq(generations.id, id));
      }
      async updateGenerationWithAsset(id, status, imageUrl, s3Key, assetId, metadata, videoUrl) {
        let finalVideoUrl = videoUrl;
        let finalImageUrl = imageUrl;
        const isVideo = metadata && (metadata.generationType === "text_to_video" || metadata.workflowType === "image_to_video");
        if (isVideo && !finalVideoUrl && finalImageUrl && (finalImageUrl.endsWith(".mp4") || finalImageUrl.endsWith(".mov") || finalImageUrl.endsWith(".webm"))) {
          finalVideoUrl = finalImageUrl;
          finalImageUrl = "";
        }
        const existingGeneration = await this.getGenerationById(id);
        const existingMetadata = existingGeneration?.metadata || {};
        const mergedMetadata = {
          ...existingMetadata,
          ...metadata,
          // Ensure formData is preserved from original metadata
          formData: existingMetadata.formData || metadata.formData || {}
        };
        await db.update(generations).set({
          status,
          imageUrl: finalImageUrl,
          videoUrl: finalVideoUrl || null,
          s3Key,
          assetId,
          metadata: mergedMetadata,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(generations.id, id));
      }
      async updateGenerationWithSecureAsset(id, status, secureUrl, s3Key, assetId, shortId, metadata) {
        const existingGeneration = await this.getGenerationById(id);
        const existingMetadata = existingGeneration?.metadata || {};
        const mergedMetadata = {
          ...existingMetadata,
          ...metadata,
          // Ensure formData is preserved from original metadata
          formData: existingMetadata.formData || metadata.formData || {}
        };
        await db.update(generations).set({
          status,
          secureUrl,
          imageUrl: secureUrl,
          // Keep backward compatibility
          s3Key,
          assetId,
          shortId,
          metadata: mergedMetadata,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(generations.id, id));
      }
      async getGenerationByShortId(shortId) {
        const result = await db.select().from(generations).where(eq(generations.shortId, shortId)).limit(1);
        return result[0];
      }
      async updateGenerationPrivacy(id, isPublic) {
        await db.update(generations).set({ isPublic, updatedAt: /* @__PURE__ */ new Date() }).where(eq(generations.id, id));
      }
      async getGenerationByAssetId(assetId) {
        const result = await db.select().from(generations).where(eq(generations.assetId, assetId)).limit(1);
        return result[0];
      }
      async getPendingGenerations() {
        try {
          const result = await db.select().from(generations).where(eq(generations.status, "pending")).orderBy(generations.createdAt);
          return result;
        } catch (error) {
          console.error("Error fetching pending generations:", error);
          throw new Error("Failed to fetch pending generations");
        }
      }
      async getOldPendingGenerations(beforeDate) {
        try {
          const result = await db.select().from(generations).where(
            and(
              eq(generations.status, "pending"),
              lt(generations.createdAt, beforeDate)
            )
          ).orderBy(generations.createdAt);
          return result;
        } catch (error) {
          console.error("Error fetching old pending generations:", error);
          throw new Error("Failed to fetch old pending generations");
        }
      }
      async failGeneration(id, failureReason, errorDetails, shouldRefund) {
        const generation = await db.select().from(generations).where(eq(generations.id, id)).limit(1);
        if (!generation[0]) return;
        await db.update(generations).set({
          status: "failed",
          failureReason,
          errorDetails,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(generations.id, id));
        if (shouldRefund && generation[0].creditsCost && !generation[0].creditsRefunded) {
          await this.refundCreditsForGeneration(id, generation[0].userId, generation[0].creditsCost);
        }
      }
      async refundCreditsForGeneration(generationId, userId, amount) {
        await db.update(users).set({
          credits: sql`${users.credits} + ${amount}`,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(users.id, userId));
        await db.update(generations).set({
          creditsRefunded: true,
          refundedAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(generations.id, generationId));
        await this.createCreditTransaction({
          userId,
          amount,
          type: "refund",
          description: `Refund for failed generation #${generationId}`,
          metadata: { generationId, reason: "generation_failed" }
        });
      }
      async retryGeneration(id) {
        const [generation] = await db.select().from(generations).where(eq(generations.id, id)).limit(1);
        if (!generation || generation.status !== "failed" || generation.retryCount >= generation.maxRetries) {
          return void 0;
        }
        await db.update(generations).set({
          status: "pending",
          retryCount: generation.retryCount + 1,
          failureReason: null,
          errorDetails: null,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(generations.id, id));
        return (await db.select().from(generations).where(eq(generations.id, id)).limit(1))[0];
      }
      async getFailedGenerationsForRetry() {
        return await db.select().from(generations).where(
          and(
            eq(generations.status, "failed"),
            sql`${generations.retryCount} < ${generations.maxRetries}`,
            sql`${generations.createdAt} > NOW() - INTERVAL '24 hours'`
            // Only retry recent failures
          )
        ).orderBy(generations.createdAt);
      }
      async createCreditTransaction(transaction) {
        const [newTransaction] = await db.insert(creditTransactions).values(transaction).returning();
        return newTransaction;
      }
      async getUserCreditTransactions(userId) {
        return await db.select().from(creditTransactions).where(eq(creditTransactions.userId, userId)).orderBy(desc(creditTransactions.createdAt));
      }
      // Guest user operations
      async getGuestGenerations(userId, pagination) {
        const page = Math.max(1, pagination?.page || 1);
        const limit = Math.min(50, Math.max(1, pagination?.limit || 5));
        const offset = Math.max(0, (page - 1) * limit);
        const cacheKey = CacheService.guestGenerationsKey(userId, page, limit);
        const cached = cacheService.get(cacheKey);
        if (cached) {
          return cached;
        }
        const whereConditions = [eq(generations.userId, userId)];
        const [paginatedGenerations, totalCountResult] = await Promise.all([
          // Get paginated generations
          db.select().from(generations).where(and(...whereConditions)).orderBy(desc(generations.createdAt)).limit(limit).offset(offset),
          // Get total count for pagination metadata
          db.select({ count: count() }).from(generations).where(and(...whereConditions))
        ]);
        const total = totalCountResult[0]?.count || 0;
        const generationsWithUrls = paginatedGenerations.map((gen) => ({
          ...gen,
          resultUrl: gen.imageUrl || gen.videoUrl || null,
          viewUrl: gen.imageUrl || gen.videoUrl || null
        }));
        const result = {
          data: generationsWithUrls,
          total
        };
        cacheService.set(cacheKey, result, 2 * 60 * 1e3);
        return result;
      }
      async getGuestGenerationsCursor(userId, options) {
        const { cursor, limit, direction } = options;
        const maxLimit = Math.min(limit, 100);
        const cacheKey = `guest_generations_cursor_${userId}_${cursor}_${maxLimit}_${direction}`;
        const cached = cacheService.get(cacheKey);
        if (cached) {
          return cached;
        }
        let whereConditions = [eq(generations.userId, userId)];
        if (cursor) {
          const cursorDate = new Date(cursor);
          if (direction === "forward") {
            whereConditions.push(lt(generations.createdAt, cursorDate));
          } else {
            whereConditions.push(sql`${generations.createdAt} > ${cursorDate}`);
          }
        }
        const results = await db.select().from(generations).where(and(...whereConditions)).orderBy(desc(generations.createdAt)).limit(maxLimit + 1);
        const hasMore = results.length > maxLimit;
        const data = results.slice(0, maxLimit);
        const generationsWithUrls = data.map((gen) => ({
          ...gen,
          resultUrl: gen.imageUrl || gen.videoUrl || null,
          viewUrl: gen.imageUrl || gen.videoUrl || null
        }));
        const nextCursor = hasMore && data.length > 0 ? data[data.length - 1].createdAt?.toISOString() : void 0;
        const prevCursor = data.length > 0 ? data[0].createdAt?.toISOString() : void 0;
        const result = {
          data: generationsWithUrls,
          nextCursor,
          prevCursor,
          hasMore
        };
        cacheService.set(cacheKey, result, 60 * 1e3);
        return result;
      }
      async getGuestGenerationStats(userId) {
        const cacheKey = CacheService.guestGenerationsStatsKey(userId);
        const cached = cacheService.get(cacheKey);
        if (cached) {
          return cached;
        }
        const baseConditions = [eq(generations.userId, userId)];
        const [pendingResult, completedResult, failedResult, totalResult] = await Promise.all([
          // Count pending/processing generations
          db.select({ count: count() }).from(generations).where(
            and(
              ...baseConditions,
              sql`${generations.status} IN ('pending', 'processing')`
            )
          ),
          // Count completed generations
          db.select({ count: count() }).from(generations).where(
            and(
              ...baseConditions,
              eq(generations.status, "completed")
            )
          ),
          // Count failed generations
          db.select({ count: count() }).from(generations).where(
            and(
              ...baseConditions,
              eq(generations.status, "failed")
            )
          ),
          // Count total generations
          db.select({ count: count() }).from(generations).where(and(...baseConditions))
        ]);
        const result = {
          pending: pendingResult[0]?.count || 0,
          completed: completedResult[0]?.count || 0,
          failed: failedResult[0]?.count || 0,
          total: totalResult[0]?.count || 0
        };
        cacheService.set(cacheKey, result, 60 * 1e3);
        return result;
      }
      async createGuestGeneration(userId, generation) {
        const shortId = await this.generateUniqueShortId();
        let videoUrl = generation.videoUrl;
        let imageUrl = generation.imageUrl;
        const metadata = generation.metadata;
        const isVideo = generation.type === "video" || metadata && (metadata.generationType === "text_to_video" || metadata.workflowType === "image_to_video");
        if (isVideo && !videoUrl && imageUrl && (imageUrl.endsWith(".mp4") || imageUrl.endsWith(".mov") || imageUrl.endsWith(".webm"))) {
          videoUrl = imageUrl;
          imageUrl = "";
        }
        const guestGeneration = {
          ...generation,
          userId,
          // Use the provided user ID
          shortId,
          videoUrl,
          imageUrl,
          metadata: {
            ...generation.metadata || {},
            isGuest: true
          }
        };
        const [newGeneration] = await db.insert(generations).values(guestGeneration).returning();
        cacheService.invalidateGuestGenerations(userId);
        cacheService.invalidateStats(userId);
        return newGeneration;
      }
      async getQueueStats() {
        const cacheKey = CacheService.queueStatsKey();
        const cached = cacheService.get(cacheKey);
        if (cached) {
          return cached;
        }
        const today = /* @__PURE__ */ new Date();
        today.setHours(0, 0, 0, 0);
        const [queuedResult, processingResult, completedTodayResult] = await Promise.all([
          // Count queued generations
          db.select({ count: count() }).from(generations).where(eq(generations.status, "queued")),
          // Count processing generations
          db.select({ count: count() }).from(generations).where(eq(generations.status, "processing")),
          // Count completed generations today
          db.select({ count: count() }).from(generations).where(
            and(
              eq(generations.status, "completed"),
              sql`${generations.createdAt} >= ${today}`
            )
          )
        ]);
        const totalInQueue = queuedResult[0]?.count || 0;
        const currentlyProcessing = processingResult[0]?.count || 0;
        const completedTodayCount = completedTodayResult[0]?.count || 0;
        let systemLoad = "normal";
        if (totalInQueue > 50) systemLoad = "critical";
        else if (totalInQueue > 20) systemLoad = "high";
        else if (totalInQueue < 5) systemLoad = "low";
        const result = {
          totalInQueue,
          currentlyProcessing,
          averageWaitTime: Math.round(totalInQueue * 2.5),
          // Estimate 2.5 minutes per generation
          completedToday: completedTodayCount,
          systemLoad
        };
        cacheService.set(cacheKey, result, 30 * 1e3);
        return result;
      }
      // Brand asset operations
      async createBrandAsset(asset) {
        const [brandAsset] = await db.insert(brandAssets).values(asset).returning();
        return brandAsset;
      }
      async getUserBrandAssets(userId) {
        return await db.select().from(brandAssets).where(eq(brandAssets.userId, userId)).orderBy(desc(brandAssets.createdAt));
      }
      async getBrandAssetById(id) {
        const [asset] = await db.select().from(brandAssets).where(eq(brandAssets.id, id));
        return asset;
      }
      async updateBrandAsset(id, updates) {
        const [asset] = await db.update(brandAssets).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(brandAssets.id, id)).returning();
        return asset;
      }
      async deleteBrandAsset(id) {
        await db.delete(brandAssets).where(eq(brandAssets.id, id));
      }
      async searchBrandAssets(userId, tags2) {
        if (tags2 && tags2.length > 0) {
          return await db.select().from(brandAssets).where(
            and(
              eq(brandAssets.userId, userId),
              sql`${brandAssets.tags} && ${tags2}`
            )
          ).orderBy(desc(brandAssets.createdAt));
        }
        return await db.select().from(brandAssets).where(eq(brandAssets.userId, userId)).orderBy(desc(brandAssets.createdAt));
      }
      // Recipe sample operations
      async getRecipeSamples(recipeId, limit = 12) {
        return await db.select().from(recipeSamples).where(and(
          eq(recipeSamples.recipeId, recipeId),
          eq(recipeSamples.moderationStatus, "approved")
        )).orderBy(desc(recipeSamples.isFeatured), desc(recipeSamples.likeCount), desc(recipeSamples.createdAt)).limit(limit);
      }
      async getFeaturedSamples(limit = 20) {
        return await db.select().from(recipeSamples).where(and(
          eq(recipeSamples.isFeatured, true),
          eq(recipeSamples.moderationStatus, "approved")
        )).orderBy(desc(recipeSamples.likeCount), desc(recipeSamples.createdAt)).limit(limit);
      }
      async createRecipeSample(sample) {
        const [newSample] = await db.insert(recipeSamples).values(sample).returning();
        return newSample;
      }
      async updateSampleLikes(sampleId, increment) {
        await db.update(recipeSamples).set({
          likeCount: sql`${recipeSamples.likeCount} + ${increment}`,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(recipeSamples.id, sampleId));
      }
      async getUserSampleLike(sampleId, userId) {
        const [like2] = await db.select().from(sampleLikes).where(and(
          eq(sampleLikes.sampleId, sampleId),
          eq(sampleLikes.userId, userId)
        ));
        return like2;
      }
      async toggleSampleLike(sampleId, userId) {
        const existingLike = await this.getUserSampleLike(sampleId, userId);
        if (existingLike) {
          await db.delete(sampleLikes).where(eq(sampleLikes.id, existingLike.id));
          await this.updateSampleLikes(sampleId, -1);
          return false;
        } else {
          await db.insert(sampleLikes).values({ sampleId, userId });
          await this.updateSampleLikes(sampleId, 1);
          return true;
        }
      }
      // Export operations
      async createExportTransaction(transaction) {
        const [newExport] = await db.insert(exportTransactions).values(transaction).returning();
        return newExport;
      }
      async getUserExports(userId) {
        return await db.select().from(exportTransactions).where(eq(exportTransactions.buyerId, userId)).orderBy(desc(exportTransactions.createdAt));
      }
      async getExportTransaction(id) {
        const [exportTransaction] = await db.select().from(exportTransactions).where(eq(exportTransactions.id, id));
        return exportTransaction;
      }
      async markExportDownloaded(id) {
        await db.update(exportTransactions).set({ downloadedAt: /* @__PURE__ */ new Date() }).where(eq(exportTransactions.id, id));
      }
      async updateGenerationFalJobStatus(id, status) {
        await db.update(generations).set({
          falJobStatus: status,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(generations.id, id));
      }
      async registerFalJob(id, falJobId) {
        await db.update(generations).set({
          falJobId,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(generations.id, id));
      }
      // Smart Generator operations
      async createSmartGenerationRequest(request) {
        const [newRequest] = await db.insert(smartGenerationRequests).values(request).returning();
        return newRequest;
      }
      async updateSmartGenerationRequest(id, updates) {
        const [updatedRequest] = await db.update(smartGenerationRequests).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(smartGenerationRequests.id, id)).returning();
        return updatedRequest;
      }
      async getSmartGenerationRequest(id) {
        const [request] = await db.select().from(smartGenerationRequests).where(eq(smartGenerationRequests.id, id));
        return request;
      }
      async createBacklogVideo(video) {
        const [newVideo] = await db.insert(backlogVideos).values(video).returning();
        return newVideo;
      }
      async getBacklogVideoByRecipeAndHash(recipeId, variablesHash) {
        const [video] = await db.select().from(backlogVideos).where(and(
          eq(backlogVideos.recipeId, recipeId),
          eq(backlogVideos.recipeVariablesHash, variablesHash)
        ));
        return video;
      }
      async getRandomUnusedBacklogVideo(recipeId) {
        const videos = await db.select().from(backlogVideos).where(and(
          eq(backlogVideos.recipeId, recipeId),
          eq(backlogVideos.isUsed, false)
        )).limit(1);
        return videos[0] || null;
      }
      async markBacklogVideoAsUsed(videoId, requestId) {
        await db.update(backlogVideos).set({
          isUsed: true,
          usedByRequestId: requestId,
          usedAt: /* @__PURE__ */ new Date()
        }).where(eq(backlogVideos.id, videoId));
      }
      // Credit refresh operations
      async checkAndRefreshDailyCredits(userId) {
        const user = await this.getUser(userId);
        if (!user) {
          return { refreshed: false, creditsAdded: 0, nextRefreshInSeconds: 0 };
        }
        const now = /* @__PURE__ */ new Date();
        const createdAt = user.createdAt ? new Date(user.createdAt) : now;
        const timeSinceCreation = now.getTime() - createdAt.getTime();
        const daysSinceCreation = Math.floor(timeSinceCreation / (24 * 60 * 60 * 1e3));
        const nextRefreshTime = new Date(createdAt.getTime() + (daysSinceCreation + 1) * 24 * 60 * 60 * 1e3);
        const secondsUntilNextRefresh = Math.max(0, (nextRefreshTime.getTime() - now.getTime()) / 1e3);
        if (secondsUntilNextRefresh === 0 && user.credits < 10) {
          const creditsToAdd = 10 - user.credits;
          await this.updateUser(userId, {
            credits: 10,
            lastCreditRefresh: now,
            updatedAt: now
          });
          await this.createCreditTransaction({
            userId,
            amount: creditsToAdd,
            type: "daily_refresh",
            description: "Daily credit refresh"
          });
          return { refreshed: true, creditsAdded: creditsToAdd, nextRefreshInSeconds: 24 * 60 * 60 };
        }
        return { refreshed: false, creditsAdded: 0, nextRefreshInSeconds: secondsUntilNextRefresh };
      }
      // Get credit refresh info without triggering refresh (for efficient polling)
      async getCreditRefreshInfo(userId) {
        const user = await this.getUser(userId);
        if (!user) {
          return {
            canRefresh: false,
            nextRefreshInSeconds: 0,
            currentCredits: 0,
            lastRefreshTime: null
          };
        }
        const now = /* @__PURE__ */ new Date();
        const createdAt = user.createdAt ? new Date(user.createdAt) : now;
        const timeSinceCreation = now.getTime() - createdAt.getTime();
        const daysSinceCreation = Math.floor(timeSinceCreation / (24 * 60 * 60 * 1e3));
        const nextRefreshTime = new Date(createdAt.getTime() + (daysSinceCreation + 1) * 24 * 60 * 60 * 1e3);
        const secondsUntilNextRefresh = Math.max(0, (nextRefreshTime.getTime() - now.getTime()) / 1e3);
        const canRefresh = secondsUntilNextRefresh === 0 && user.credits < 10;
        return {
          canRefresh,
          nextRefreshInSeconds: secondsUntilNextRefresh,
          currentCredits: user.credits,
          lastRefreshTime: user.lastCreditRefresh ? new Date(user.lastCreditRefresh) : null
        };
      }
      // Batch refresh credits for multiple users (for background job)
      async batchRefreshDailyCredits() {
        const now = /* @__PURE__ */ new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1e3);
        const eligibleUsers = await db.select().from(users).where(
          and(
            lt(users.credits, 10),
            // Less than 10 credits
            or(
              lt(users.lastCreditRefresh, twentyFourHoursAgo),
              // Last refresh was more than 24h ago
              isNull(users.lastCreditRefresh)
              // Never refreshed
            )
          )
        );
        let totalRefreshed = 0;
        let totalCreditsAdded = 0;
        const refreshedUsers = [];
        for (const user of eligibleUsers) {
          const creditsToAdd = 10 - user.credits;
          await this.updateUser(user.id, {
            credits: 10,
            lastCreditRefresh: now,
            updatedAt: now
          });
          await this.createCreditTransaction({
            userId: user.id,
            amount: creditsToAdd,
            type: "daily_refresh",
            description: "Daily credit refresh (batch)"
          });
          totalRefreshed++;
          totalCreditsAdded += creditsToAdd;
          refreshedUsers.push(user.id);
        }
        return { totalRefreshed, totalCreditsAdded, refreshedUsers };
      }
      async getNextCreditRefreshTime(userId) {
        const user = await this.getUser(userId);
        if (!user || !user.lastCreditRefresh) {
          return 0;
        }
        const lastRefresh = new Date(user.lastCreditRefresh);
        const nextRefresh = new Date(lastRefresh.getTime() + 24 * 60 * 60 * 1e3);
        const now = /* @__PURE__ */ new Date();
        return Math.max(0, nextRefresh.getTime() - now.getTime());
      }
      /**
       * Get count of available backlog generations for a recipe
       */
      async getBacklogGenerationCount(recipeId) {
        const result = await db.select({ count: count() }).from(generations).where(
          and(
            eq(generations.recipeId, recipeId),
            eq(generations.userId, "system_backlog"),
            eq(generations.status, "completed")
          )
        );
        return result[0]?.count || 0;
      }
      /**
       * Atomically claim a backlog generation and transfer ownership to user
       */
      async claimBacklogGeneration(recipeId, userId) {
        const result = await db.execute(sql`
      UPDATE generations 
      SET 
        user_id = ${userId},
        created_at = NOW(),
        updated_at = NOW()
      WHERE id IN (
        SELECT id 
        FROM generations 
        WHERE recipe_id = ${recipeId} 
          AND user_id = 'system_backlog' 
          AND status = 'completed'
        ORDER BY created_at ASC
        LIMIT 1
        FOR UPDATE SKIP LOCKED
      )
      RETURNING *
    `);
        return result.rows[0] || null;
      }
    };
    storage = new DatabaseStorage();
  }
});

// server/asset-security.ts
import { randomBytes, createHash } from "crypto";
import { nanoid as nanoid2 } from "nanoid";
function createSecureAssetMetadata(fileExtension = "png") {
  const assetId = AssetSecurityManager.generateSecureAssetId();
  const shortId = Base62Encoder.generateShortId();
  const s3Key = AssetSecurityManager.generateS3Key(assetId, fileExtension);
  const secureUrl = AssetSecurityManager.generateSecureUrl(s3Key);
  return {
    assetId,
    shortId,
    s3Key,
    secureUrl
  };
}
var Base62Encoder, AssetSecurityManager;
var init_asset_security = __esm({
  "server/asset-security.ts"() {
    "use strict";
    Base62Encoder = class {
      static ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      /**
       * Generate a secure 11-character Base62 ID for public URLs
       * Uses cryptographically secure random bytes
       */
      static generateShortId() {
        const bytes = randomBytes(8);
        let result = "";
        for (let i = 0; i < bytes.length; i++) {
          const byte = bytes[i];
          result += this.ALPHABET[byte % 62];
        }
        while (result.length < 11) {
          const randomByte = randomBytes(1)[0];
          result += this.ALPHABET[randomByte % 62];
        }
        return result.substring(0, 11);
      }
      /**
       * Encode a number to Base62
       */
      static encode(num) {
        if (num === 0) return "0";
        let result = "";
        while (num > 0) {
          result = this.ALPHABET[num % 62] + result;
          num = Math.floor(num / 62);
        }
        return result;
      }
      /**
       * Decode Base62 string to number
       */
      static decode(str) {
        let result = 0;
        for (let i = 0; i < str.length; i++) {
          const char = str[i];
          const index2 = this.ALPHABET.indexOf(char);
          if (index2 === -1) throw new Error(`Invalid Base62 character: ${char}`);
          result = result * 62 + index2;
        }
        return result;
      }
      /**
       * Validate Base62 string format
       */
      static isValid(str) {
        if (!/^[0-9A-Za-z]+$/.test(str)) return false;
        return str.split("").every((char) => this.ALPHABET.includes(char));
      }
    };
    AssetSecurityManager = class {
      /**
       * Generate a secure UUID for S3 storage (prevents discovery attacks)
       */
      static generateSecureAssetId() {
        return nanoid2(32);
      }
      /**
       * Generate S3 key with UUID to prevent discovery
       */
      static generateS3Key(assetId, fileExtension = "png") {
        return `magicvidio/${assetId}.${fileExtension}`;
      }
      /**
       * Generate full S3 URL for secure asset access
       */
      static generateSecureUrl(s3Key) {
        return `https://avbxp-public.s3.amazonaws.com/${s3Key}`;
      }
      /**
       * Create public media URL path
       * Format: /m/{shortId} for public assets
       * Format: /m/{userId}/{shortId} for private assets
       */
      static createPublicMediaPath(shortId) {
        return `/m/${shortId}`;
      }
      static createPrivateMediaPath(userId, shortId) {
        return `/m/${userId}/${shortId}`;
      }
      /**
       * Parse media path to extract components
       */
      static parseMediaPath(path6) {
        const pathParts = path6.split("/").filter((p) => p);
        if (pathParts.length === 2 && pathParts[0] === "m") {
          return {
            isPublic: true,
            shortId: pathParts[1]
          };
        } else if (pathParts.length === 3 && pathParts[0] === "m") {
          return {
            isPublic: false,
            userId: pathParts[1],
            shortId: pathParts[2]
          };
        }
        throw new Error("Invalid media path format");
      }
      /**
       * Validate short ID format (11 characters, Base62)
       */
      static validateShortId(shortId) {
        return shortId.length === 11 && Base62Encoder.isValid(shortId);
      }
      /**
       * Generate content hash for duplicate detection
       */
      static generateContentHash(content) {
        return createHash("sha256").update(content).digest("hex");
      }
    };
  }
});

// server/openai-gpt-image-service.ts
import OpenAI from "openai";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { nanoid as nanoid3 } from "nanoid";
async function uploadBase64ToS3(imageBase64, assetId) {
  const imageBuffer = Buffer.from(imageBase64, "base64");
  const s3Key = `magicvidio/${assetId}.png`;
  const uploadCommand = new PutObjectCommand({
    Bucket: "avbxp-public",
    Key: s3Key,
    Body: imageBuffer,
    ContentType: "image/png"
  });
  await s3Client.send(uploadCommand);
  return s3Key;
}
function calculateTokens(size, quality) {
  const baseTokens = {
    "1024x1024": 4096,
    "1024x1792": 6144,
    "1792x1024": 6144
  };
  const sizeTokens = baseTokens[size] || 4096;
  const qualityMultiplier = quality === "hd" ? 1.5 : 1;
  return Math.round(sizeTokens * qualityMultiplier);
}
var openai, s3Client, GPTImageService, gptImageService;
var init_openai_gpt_image_service = __esm({
  "server/openai-gpt-image-service.ts"() {
    "use strict";
    init_asset_security();
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    s3Client = new S3Client({
      region: process.env.AWS_MAGICVIDIO_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_MAGICVIDIO_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_MAGICVIDIO_SECRET_ACCESS_KEY
      }
    });
    GPTImageService = class {
      async generateImage(options) {
        const {
          prompt,
          size = "auto",
          quality = "auto",
          format = "png",
          background = "auto",
          moderation = "auto"
        } = options;
        console.log(`Generating GPT Image: ${prompt.substring(0, 100)}...`);
        try {
          const dalleSize = size === "auto" ? "1024x1024" : size === "1536x1024" ? "1024x1792" : size === "1024x1536" ? "1792x1024" : "1024x1024";
          const dalleQuality = quality === "high" ? "hd" : "standard";
          const response = await openai.images.generate({
            model: "dall-e-3",
            prompt,
            size: dalleSize,
            quality: dalleQuality,
            style: "vivid",
            response_format: "url",
            n: 1
          });
          if (!response.data || response.data.length === 0) {
            throw new Error("No image data in response");
          }
          const imageData = response.data[0];
          if (!imageData.url) {
            throw new Error("No image URL in response");
          }
          const secureAsset = createSecureAssetMetadata("png");
          const imageResponse = await fetch(imageData.url);
          const imageBuffer = await imageResponse.arrayBuffer();
          const imageBase64 = Buffer.from(imageBuffer).toString("base64");
          const s3Key = await uploadBase64ToS3(imageBase64, secureAsset.assetId);
          const tokens = calculateTokens(dalleSize, dalleQuality);
          return {
            imageUrl: secureAsset.secureUrl,
            secureUrl: secureAsset.secureUrl,
            s3Key: secureAsset.s3Key,
            assetId: secureAsset.assetId,
            shortId: secureAsset.shortId,
            revisedPrompt: imageData.revised_prompt || prompt,
            metadata: {
              model: "gpt-image-1",
              prompt,
              size: dalleSize,
              quality: dalleQuality,
              format,
              background,
              tokens
            }
          };
        } catch (error) {
          console.error("GPT Image generation error:", error);
          throw new Error(`Image generation failed: ${error?.message || "Unknown error"}`);
        }
      }
      calculateCreditCost(options) {
        const { size = "auto", quality = "auto" } = options;
        let baseCredits = 5;
        if (quality === "high") {
          baseCredits *= 2;
        } else if (quality === "low") {
          baseCredits *= 0.5;
        }
        if (size === "1536x1024" || size === "1024x1536") {
          baseCredits *= 1.4;
        }
        return Math.max(3, Math.round(baseCredits));
      }
      validateRequest(options) {
        const errors = [];
        if (!options.prompt || options.prompt.trim().length === 0) {
          errors.push("Prompt is required");
        }
        if (options.prompt && options.prompt.length > 4e3) {
          errors.push("Prompt must be 4000 characters or less");
        }
        const validSizes = ["1024x1024", "1536x1024", "1024x1536", "auto"];
        if (options.size && !validSizes.includes(options.size)) {
          errors.push("Invalid size option");
        }
        const validQualities = ["low", "medium", "high", "auto"];
        if (options.quality && !validQualities.includes(options.quality)) {
          errors.push("Invalid quality option");
        }
        return { isValid: errors.length === 0, errors };
      }
    };
    gptImageService = new GPTImageService();
  }
});

// shared/types.ts
var AssetRequestOriginType;
var init_types = __esm({
  "shared/types.ts"() {
    "use strict";
    AssetRequestOriginType = {
      BACKLOG: "backlog",
      USER: "user"
    };
  }
});

// server/recipe-processor.ts
var recipe_processor_exports = {};
__export(recipe_processor_exports, {
  generateTagDisplayData: () => generateTagDisplayData,
  getImageSizeFromOrientation: () => getImageSizeFromOrientation,
  processRecipePrompt: () => processRecipePrompt,
  validateRecipeFormData: () => validateRecipeFormData
});
function getAutoCameraStyle(gameGenre) {
  const lowerGenre = gameGenre.toLowerCase();
  if (lowerGenre.includes("platformer") || lowerGenre.includes("side-scroll")) {
    return "side scroller";
  } else if (lowerGenre.includes("rpg") || lowerGenre.includes("strategy") || lowerGenre.includes("tactical")) {
    return "top-down view";
  } else if (lowerGenre.includes("shooter") || lowerGenre.includes("fps")) {
    return "first-person";
  } else if (lowerGenre.includes("open-world") || lowerGenre.includes("adventure") || lowerGenre.includes("3d")) {
    return "3D third-person open-world";
  } else if (lowerGenre.includes("retro") || lowerGenre.includes("pixel") || lowerGenre.includes("8-bit")) {
    return "side scroller";
  } else {
    return "isometric";
  }
}
function processRecipePrompt(recipe, formData) {
  let prompt = recipe.prompt;
  if (recipe.slug === "futuristic-ai-anatomy") {
    const genderMap = {
      "female": "female",
      "male": "male"
    };
    const ageMap = {
      "child": "child's",
      "teenager": "teenager's",
      "adult": "adult's",
      "elderly": "elderly"
    };
    const detailsMap = {
      "external": "Show external outlines.",
      "internal": "Include other organs & skeleton."
    };
    prompt = prompt.replace("[GENDER]", genderMap[formData.gender] || "adult").replace("[AGE]", ageMap[formData.age] || "adult's").replace("[BODY_PART]", formData.bodyPart || "heart").replace("[DETAILS]", detailsMap[formData.details] || "Show external outlines.");
  }
  if (recipe.slug === "cats-in-video-games") {
    const catCountMap = {
      "one": "a cat",
      "two": "two cats",
      "three": "three cats",
      "many": "lots of cats"
    };
    const cameraStyleMap = {
      "auto": getAutoCameraStyle(formData.gameGenre || ""),
      "side-scroller": "side scroller",
      "top-down": "top-down view",
      "first-person": "first-person",
      "third-person": "3D third-person open-world",
      "isometric": "isometric"
    };
    prompt = prompt.replace("[CAT_COUNT]", catCountMap[formData.catCount] || "a cat").replace("[CAT_COLORS]", formData.catColors || "orange tabby").replace("[GAME_GENRE]", formData.gameGenre || "colorful platforming dreamscape").replace("[SETTING_DESCRIPTION]", formData.settingDescription || "bright blue sky, vanilla clouds, floating islands").replace("[ACTION_DESCRIPTION]", formData.actionDescription || "jumping across floating platforms").replace("[CAMERA_STYLE]", cameraStyleMap[formData.cameraStyle] || "side scroller");
  }
  if (recipe.slug === "cat-olympic-diving") {
    const ageMap = {
      "0": "kitten",
      "1": "adult",
      "2": "senior citizen"
    };
    const weightMap = {
      "0": "athletic build",
      "1": "average weight",
      "2": "overweight",
      "3": "obese"
    };
    const divingStyleMap = {
      "backflip": "performing a backflip",
      "forward somersault": "performing a forward somersault",
      "twisting dive": "performing a twisting dive",
      "forward dive": "performing a forward dive"
    };
    const attitudeMap = {
      "professional sports athlete": "in a professional sports athlete style",
      "clumsy amateur": "in a clumsy amateur style",
      "sophisticated and poised": "in a sophisticated and poised style"
    };
    const waterEntryMap = {
      "neat dive": "clean, minimal splash entry",
      "cannonball splash": "overexaggerated cannonball splash",
      "meteoric": "explosive meteoric entry with massive water displacement"
    };
    const ambientSoundsMap = {
      "stadium cheering": "lots of clapping and audience cheering and whistling in the background, with Olympic Sports Commentator narration about what they're seeing",
      "hushed stadium": "muffled clapping and whispers of anticipation, the splashing of water, with Olympic Sports Commentator narration about what they're seeing"
    };
    const catDescription = `${weightMap[formData.weight] || "athletic build"} ${formData.breed || "black american shorthair"} ${ageMap[formData.age] || "adult"} cat`;
    const actionDescription = `running down the diving board ${attitudeMap[formData.attitude] || "in a clumsy amateur style"}, ${divingStyleMap[formData.divingStyle] || "performing a backflip"}, and entering the water with a ${formData.waterEntryStyle || "cannonball splash"}`;
    prompt = prompt.replace("{{cat_description}}", catDescription).replace("{{action_description}}", actionDescription).replace("{{ambient_sounds}}", ambientSoundsMap[formData.soundStyle] || ambientSoundsMap["stadium cheering"]).replace("{{special_effects_description}}", waterEntryMap[formData.waterEntryStyle] || waterEntryMap["cannonball splash"]);
    const avoidSection = `,
  "Negative Prompt": "blurry, distorted, mutated, deformed, extra limbs, missing limbs, extra tails, fused body parts, blob shapes, non-realistic proportions, cartoonish, caricature, unrealistic eyes, unnatural colors, bad anatomy, disfigured, malformed, grotesque, low detail, unrealistic fur, doll-like, wax figure, plastic texture, poorly drawn paws, poorly drawn face, fused legs, broken spine, floating body parts, glitch, AI artifacts"`;
    const lastBraceIndex = prompt.lastIndexOf("}");
    prompt = prompt.slice(0, lastBraceIndex) + avoidSection + prompt.slice(lastBraceIndex);
  }
  if (recipe.slug === "lava-food-asmr") {
    const expressionMap = {
      "joyful": "joyful and delighted",
      "totally_cool": "completely cool and unfazed",
      "sophisticated_enjoyment": "sophisticated culinary appreciation",
      "absolutely_loving_it": "absolutely loving every bite",
      "bored": "completely bored and indifferent",
      "confused_but_ok": "confused but accepting the situation"
    };
    const actionMap = {
      "lava pizza": `eating ${formData.lavaFoodItem} made out of lava with a ${expressionMap[formData.eatingExpression] || "joyful and delighted"} expression on their face`,
      "lava spoonful of honey": `eating ${formData.lavaFoodItem} made out of lava with a ${expressionMap[formData.eatingExpression] || "joyful and delighted"} expression on their face`,
      "lava chocolate cake": `eating ${formData.lavaFoodItem} made out of lava with a ${expressionMap[formData.eatingExpression] || "joyful and delighted"} expression on their face`,
      "lava plate of food": `eating ${formData.lavaFoodItem} made out of lava with a ${expressionMap[formData.eatingExpression] || "joyful and delighted"} expression on their face`
    };
    const propsMap = {
      "lava pizza": "using their bare hands to eat the lava pizza",
      "lava spoonful of honey": "using a spoon to scoop up the lava honey from a bowl",
      "lava chocolate cake": "using only one fork in one hand to lift and take a bite out of the lava chocolate cake made of real lava",
      "lava plate of food": "using a fork and knife in each hand to cut into a five course fine dining meal"
    };
    const ambientSoundsMap = {
      "home kitchen": "gentle sounds of a home kitchen with nothing much going on",
      "japanese hibachi": "restaurant sounds, excited yells and oohs and aahs, whooshes of grill flames",
      "sports grill": "background sports on tv, fans cheering for their teams on occasion",
      "science lab table": "chemistry sounds of beakers and solutions",
      "office cubicle": "office noise, phones ringing, typing on computers",
      "tv tray dinner on couch": "background television with a random daytime tv show barely audible"
    };
    const venueDescriptionMap = {
      "home kitchen": "a cozy home kitchen with warm lighting",
      "japanese hibachi": "a lively Japanese hibachi restaurant with sizzling grills",
      "sports grill": "a bustling sports grill with multiple TVs showing games",
      "science lab table": "a sterile science laboratory with beakers and equipment",
      "office cubicle": "a typical office cubicle with fluorescent lighting",
      "tv tray dinner on couch": "a comfortable living room with a TV tray and couch"
    };
    prompt = prompt.replace("{{age}}", formData.age || "30").replace("{{gender}}", formData.gender || "female").replace("{{venue}}", venueDescriptionMap[formData.venue] || "home kitchen").replace("{{action_description}}", actionMap[formData.lavaFoodItem] || actionMap["lava pizza"]).replace("{{props_description}}", propsMap[formData.lavaFoodItem] || propsMap["lava pizza"]).replace("{{ambient_sounds}}", ambientSoundsMap[formData.venue] || ambientSoundsMap["home kitchen"]).replace("{{asmr_sound_style}}", formData.asmrSoundStyle || "crunchy");
  }
  if (recipe.slug === "based-ape-vlog") {
    const wardrobeMap = {
      "tracksuit": "Tracksuit with sleek lines and a sporty vibe. Over this are the straps from his parachute pack.",
      "neon_fur_coat": "Neon fur coat with vibrant colors that pop against the natural environment",
      "casual_streetwear": "Casual streetwear with a laid-back, urban aesthetic",
      "blazer_gold_chains": "Blazer with gold chains, giving off luxury influencer vibes",
      "formal_black_tie": "Formal black tie attire, completely out of place in the epic setting",
      "safari": "Safari gear with khaki colors and practical pockets",
      "retro_80s": "Retro 80s fashion with bright colors and bold patterns",
      "rustic": "Rustic, outdoorsy clothing that fits the natural environment"
    };
    const locationMap = {
      "mountain_peaks": "mountain peaks surrounded by swirling clouds, where crisp air and endless horizons set the stage for high-altitude vibes",
      "canyon": "deep canyon with towering rock walls and dramatic shadows",
      "urban_skyline": "urban skyline with city lights and modern architecture",
      "small_airplane": "small airplane cockpit with controls and instruments visible"
    };
    const environmentMap = {
      "mountain_peaks": "thin, crisp air swirling around jagged peaks, with sunlight glinting off snow-dusted stone and endless sky above",
      "canyon": "echoing canyon walls with natural rock formations and dramatic lighting",
      "urban_skyline": "urban environment with city sounds and modern architecture",
      "small_airplane": "confined airplane interior with engine sounds and wind rushing past"
    };
    const propsMap = {
      "none": "no props in hand, just pure YOLO energy",
      "cellphone": "smartphone mounted on a selfie stick",
      "selfie_stick": "smartphone mounted on a selfie stick",
      "microphone": "professional microphone for vlogging"
    };
    const topicMap = {
      "based_life": "speaking about living a BASEd life",
      "extreme_yolo": "discussing extreme YOLO activities",
      "survival_tips": "sharing survival tips and wilderness knowledge",
      "boujee_bragging": "bragging about luxury lifestyle and expensive possessions",
      "crypto_riches": "speaking about Crypto Riches",
      "burning_daddys_money": "talking about spending money recklessly"
    };
    const audioEffectsMap = {
      "based_life": "yells something like aaaaah or wooooo after he jumps off",
      "extreme_yolo": "yells something like aaaaah or wooooo after he jumps off",
      "survival_tips": "yells something like aaaaah or wooooo after he jumps off",
      "boujee_bragging": "yells something like aaaaah or wooooo after he jumps off",
      "crypto_riches": "yells something like aaaaah or wooooo after he jumps off",
      "burning_daddys_money": "yells something like aaaaah or wooooo after he jumps off"
    };
    const ambientSoundsMap = {
      "mountain_peaks": "steady wind with occasional sharp gusts",
      "canyon": "echoing canyon sounds with wind through rock formations",
      "urban_skyline": "city sounds with traffic and urban ambience",
      "small_airplane": "airplane engine sounds with wind rushing past"
    };
    const actionDescription = `Gorilla holds ${propsMap[formData.propInHand] || propsMap["none"]}, speaking excitedly to the camera about ${topicMap[formData.vloggingTopic] || topicMap["based_life"]} before letting out a dramatic scream`;
    const additionalActionMap = {
      "based_life": "gorilla talks to the camera about living a BASEd life and then jumps off the edge and parachutes down and away",
      "extreme_yolo": "gorilla talks to the camera about extreme YOLO activities and then jumps off the edge and parachutes down and away",
      "survival_tips": "gorilla talks to the camera about survival tips and wilderness knowledge and then jumps off the edge and parachutes down and away",
      "boujee_bragging": "gorilla talks to the camera about luxury lifestyle and expensive possessions and then jumps off the edge and parachutes down and away",
      "crypto_riches": "gorilla talks to the camera about Crypto Riches and then jumps off the edge and parachutes down and away",
      "burning_daddys_money": "gorilla talks to the camera about spending money recklessly and then jumps off the edge and parachutes down and away"
    };
    const additionalActionDescription = additionalActionMap[formData.vloggingTopic] || additionalActionMap["based_life"];
    prompt = prompt.replace("{{wardrobe_description}}", wardrobeMap[formData.fashionStyle] || wardrobeMap["tracksuit"]).replace("{{location_description}}", locationMap[formData.epicSetting] || locationMap["mountain_peaks"]).replace("{{environment_description}}", environmentMap[formData.epicSetting] || environmentMap["mountain_peaks"]).replace("{{action_description}}", actionDescription).replace("{{props_description}}", propsMap[formData.propInHand] || propsMap["none"]).replace("{{audio_effects}}", audioEffectsMap[formData.vloggingTopic] || audioEffectsMap["based_life"]).replace("{{ambient_sounds}}", ambientSoundsMap[formData.epicSetting] || ambientSoundsMap["mountain_peaks"]).replace("{{additional_action_description}}", additionalActionDescription);
  }
  return {
    prompt,
    extractedVariables: formData
  };
}
async function generateTagDisplayData(recipe, formData) {
  const tagDisplayData = {};
  if (!recipe.recipeSteps || !Array.isArray(recipe.recipeSteps)) {
    return tagDisplayData;
  }
  function transformLabel(recipeSlug, originalLabel) {
    if (recipeSlug === "cat-olympic-diving") {
      const labelMap = {
        "Attitude": "Cattitude"
      };
      return labelMap[originalLabel] || originalLabel;
    }
    return originalLabel;
  }
  function transformTickLabel(recipeSlug, originalLabel) {
    if (recipeSlug === "cat-olympic-diving") {
      if (originalLabel === "Athletic Build") return "SMOL";
      if (originalLabel === "Average Weight") return "Buff";
      if (originalLabel === "Overweight") return "Chonk";
      if (originalLabel === "Obese") return "Heck 'n Chonk";
      if (originalLabel === "Senior Citizen Cat") return "Senior Cat";
    }
    return originalLabel;
  }
  for (const step of recipe.recipeSteps) {
    const fieldValue = formData[step.id];
    if (!fieldValue) continue;
    let displayValue = fieldValue;
    switch (step.type) {
      case "radio":
      case "dropdown":
        const option = step.options?.find((opt) => opt.value === fieldValue);
        if (option) {
          displayValue = option.label;
        }
        break;
      case "slider":
        if (step.config?.ticks) {
          const tick = step.config.ticks.find((t) => t.value.toString() === fieldValue);
          if (tick) {
            displayValue = transformTickLabel(recipe.slug, tick.label);
          }
        }
        break;
      case "emoji_button":
        const emojiOption = step.options?.find((opt) => opt.value === fieldValue);
        if (emojiOption) {
          const emoji = emojiOption.emoji || "";
          displayValue = emoji ? `${emoji} ${emojiOption.label}` : emojiOption.label;
        }
        break;
      case "text":
      case "text_prompt":
        displayValue = fieldValue;
        break;
      default:
        displayValue = fieldValue;
        break;
    }
    const transformedLabel = transformLabel(recipe.slug, step.label);
    tagDisplayData[transformedLabel] = {
      value: displayValue
      // No icon or color fields - these will be computed dynamically
    };
  }
  return tagDisplayData;
}
function getImageSizeFromOrientation(orientation) {
  switch (orientation) {
    case "portrait":
      return "portrait_4_3";
    case "landscape":
      return "landscape_4_3";
    case "square":
      return "square_hd";
    default:
      return "portrait_4_3";
  }
}
function validateRecipeFormData(recipe, formData) {
  const errors = [];
  if (recipe.slug === "futuristic-ai-anatomy") {
    if (!formData.bodyPart || formData.bodyPart.trim().length === 0) {
      errors.push("Body part is required");
    }
  }
  if (recipe.slug === "cats-in-video-games") {
    if (!formData.catColors || formData.catColors.trim().length === 0) {
      errors.push("Cat colors are required");
    }
    if (!formData.gameGenre || formData.gameGenre.trim().length === 0) {
      errors.push("Game genre is required");
    }
    if (!formData.actionDescription || formData.actionDescription.trim().length === 0) {
      errors.push("Action description is required");
    }
  }
  if (recipe.slug === "cat-olympic-diving") {
    if (!formData.breed) {
      errors.push("Cat breed selection is required");
    }
    if (!formData.age) {
      errors.push("Age selection is required");
    }
    if (!formData.weight) {
      errors.push("Weight selection is required");
    }
    if (!formData.divingStyle) {
      errors.push("Diving style selection is required");
    }
    if (!formData.attitude) {
      errors.push("Attitude selection is required");
    }
    if (!formData.waterEntryStyle) {
      errors.push("Water entry style selection is required");
    }
    if (!formData.soundStyle) {
      errors.push("Sound style selection is required");
    }
  }
  if (recipe.slug === "lava-food-asmr") {
    if (!formData.gender) {
      errors.push("Gender selection is required");
    }
    if (!formData.age) {
      errors.push("Age selection is required");
    }
    if (!formData.lavaFoodItem) {
      errors.push("Lava food item selection is required");
    }
    if (!formData.eatingExpression) {
      errors.push("Eating expression selection is required");
    }
    if (!formData.venue) {
      errors.push("Venue selection is required");
    }
    if (!formData.asmrSoundStyle) {
      errors.push("ASMR sound style selection is required");
    }
  }
  if (recipe.slug === "based-ape-vlog") {
    if (!formData.fashionStyle) {
      errors.push("Fashion style selection is required");
    }
    if (!formData.epicSetting) {
      errors.push("Epic setting selection is required");
    }
    if (!formData.propInHand) {
      errors.push("Prop in hand selection is required");
    }
    if (!formData.vloggingTopic) {
      errors.push("Vlogging topic selection is required");
    }
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}
var init_recipe_processor = __esm({
  "server/recipe-processor.ts"() {
    "use strict";
  }
});

// server/media-transfer-service.ts
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { v4 as uuidv4 } from "uuid";
import path2 from "path";
function getLambdaClient() {
  if (!lambdaClient) {
    lambdaClient = new LambdaClient({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_DELULA_ACCESS_KEY,
        secretAccessKey: process.env.AWS_DELULA_SECRET_ACCESS_KEY
      }
    });
  }
  return lambdaClient;
}
var lambdaClient, MediaTransferService, mediaTransferService;
var init_media_transfer_service = __esm({
  "server/media-transfer-service.ts"() {
    "use strict";
    init_env();
    lambdaClient = null;
    MediaTransferService = class {
      BUCKET_NAME = "delula-media-prod";
      CDN_BASE_URL = "https://cdn.delu.la";
      /**
       * Transfer media from external URL to S3 and return CDN URL
       */
      async transferMedia(request) {
        try {
          const assetId = uuidv4();
          const fileExtension = this.extractFileExtension(request.remoteUrl, request.originalFilename);
          const s3Key = `${request.mediaType}s/raw/${assetId}.${fileExtension}`;
          const lambdaPayload = {
            remote_url: request.remoteUrl,
            bucket: this.BUCKET_NAME,
            key: s3Key,
            mime_type: this.getMimeType(fileExtension)
          };
          const command = new InvokeCommand({
            FunctionName: "ExternalFileTransferToS3",
            Payload: JSON.stringify(lambdaPayload)
          });
          const response = await getLambdaClient().send(command);
          if (!response.Payload) {
            throw new Error("No response payload from Lambda");
          }
          const result = JSON.parse(new TextDecoder().decode(response.Payload));
          if (result.statusCode !== 200) {
            throw new Error(`Lambda execution failed: ${result.body}`);
          }
          const cdnUrl = `${this.CDN_BASE_URL}/${s3Key}`;
          return {
            success: true,
            cdnUrl,
            s3Key,
            assetId
          };
        } catch (error) {
          console.error("Media transfer failed:", error);
          return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
          };
        }
      }
      /**
       * Extract file extension from URL or filename
       */
      extractFileExtension(url, originalFilename) {
        if (originalFilename) {
          const ext = path2.extname(originalFilename).toLowerCase().replace(".", "");
          if (ext && ["jpg", "jpeg", "png", "gif", "webp", "mp4", "mov", "avi", "mp3", "wav", "aac"].includes(ext)) {
            return ext;
          }
        }
        const urlExt = path2.extname(url).toLowerCase().replace(".", "");
        if (urlExt && ["jpg", "jpeg", "png", "gif", "webp", "mp4", "mov", "avi", "mp3", "wav", "aac"].includes(urlExt)) {
          return urlExt;
        }
        return "mp4";
      }
      /**
       * Get MIME type based on file extension
       */
      getMimeType(extension) {
        const mimeTypes = {
          // Images
          "jpg": "image/jpeg",
          "jpeg": "image/jpeg",
          "png": "image/png",
          "gif": "image/gif",
          "webp": "image/webp",
          // Videos
          "mp4": "video/mp4",
          "mov": "video/quicktime",
          "avi": "video/x-msvideo",
          "webm": "video/webm",
          // Audio
          "mp3": "audio/mpeg",
          "wav": "audio/wav",
          "aac": "audio/aac",
          "ogg": "audio/ogg"
        };
        return mimeTypes[extension.toLowerCase()] || "application/octet-stream";
      }
      /**
       * Transfer multiple media files
       */
      async transferMultipleMedia(requests) {
        const results = [];
        for (const request of requests) {
          const result = await this.transferMedia(request);
          results.push(result);
          if (requests.length > 1) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }
        return results;
      }
    };
    mediaTransferService = new MediaTransferService();
  }
});

// server/fal-service.ts
var fal_service_exports = {};
__export(fal_service_exports, {
  FalService: () => FalService,
  falService: () => falService
});
import * as fal from "@fal-ai/serverless-client";
var FalService, falService;
var init_fal_service = __esm({
  "server/fal-service.ts"() {
    "use strict";
    fal.config({
      credentials: process.env.FAL_KEY
    });
    FalService = class {
      // Flux.1 Pro model for high-quality generations
      async generateWithFluxPro(options) {
        try {
          const result = await fal.subscribe("fal-ai/flux-pro", {
            input: {
              prompt: options.prompt,
              image_size: options.image_size || "landscape_4_3",
              num_inference_steps: options.num_inference_steps || 28,
              guidance_scale: options.guidance_scale || 3.5,
              num_images: options.num_images || 1,
              enable_safety_checker: options.enable_safety_checker !== false,
              seed: options.seed
            }
          });
          return result.data;
        } catch (error) {
          console.error("Error generating with Flux Pro:", error);
          throw new Error("Failed to generate image with Flux Pro");
        }
      }
      // Flux.1 Dev model for faster generations
      async generateWithFluxDev(options) {
        try {
          const result = await fal.subscribe("fal-ai/flux/dev", {
            input: {
              prompt: options.prompt,
              image_size: options.image_size || "landscape_4_3",
              num_inference_steps: options.num_inference_steps || 28,
              guidance_scale: options.guidance_scale || 3.5,
              num_images: options.num_images || 1,
              enable_safety_checker: options.enable_safety_checker !== false,
              seed: options.seed
            }
          });
          if (result && result.data) {
            return result.data;
          } else if (result && result.images) {
            return result;
          } else {
            console.error("Unexpected FAL response structure:", result);
            throw new Error("Invalid response from FAL service");
          }
        } catch (error) {
          console.error("Error generating with Flux Dev:", error);
          throw new Error("Failed to generate image with Flux Dev");
        }
      }
      // Flux.1 Schnell model for ultra-fast generations
      async generateWithFluxSchnell(options) {
        try {
          const result = await fal.subscribe("fal-ai/flux/schnell", {
            input: {
              prompt: options.prompt,
              image_size: options.image_size || "landscape_4_3",
              num_inference_steps: Math.min(options.num_inference_steps || 4, 4),
              // Schnell is optimized for 1-4 steps
              num_images: options.num_images || 1,
              enable_safety_checker: options.enable_safety_checker !== false,
              seed: options.seed
            }
          });
          return result.data;
        } catch (error) {
          console.error("Error generating with Flux Schnell:", error);
          throw new Error("Failed to generate image with Flux Schnell");
        }
      }
      // Main generation method that selects the appropriate model based on recipe configuration
      async generateImage(prompt, model = "flux-1", style = "photorealistic", options = {}) {
        const enhancedPrompt = this.enhancePromptWithStyle(prompt, style);
        const generationOptions = {
          prompt: enhancedPrompt,
          image_size: this.getImageSize(style),
          ...options
        };
        switch (model) {
          case "flux-1-pro":
            return await this.generateWithFluxPro(generationOptions);
          case "flux-1-dev":
            return await this.generateWithFluxDev(generationOptions);
          case "flux-1-schnell":
            return await this.generateWithFluxSchnell(generationOptions);
          case "flux-1":
          default:
            return await this.generateWithFluxDev(generationOptions);
        }
      }
      // Enhance prompts based on style preferences
      enhancePromptWithStyle(prompt, style) {
        const styleEnhancements = {
          photorealistic: "photorealistic, high quality, detailed, professional photography",
          cinematic: "cinematic lighting, dramatic composition, film still, professional cinematography",
          artistic: "artistic composition, creative interpretation, fine art style",
          commercial: "commercial photography, clean professional style, studio lighting",
          abstract: "abstract art, creative composition, modern artistic interpretation",
          minimalist: "clean minimalist design, simple composition, elegant simplicity",
          cyberpunk: "cyberpunk aesthetic, neon lighting, futuristic elements, digital art",
          futuristic: "futuristic design, advanced technology, sci-fi elements",
          illusion: "optical illusion, 3D effect, trompe-l'oeil style, depth perception",
          typography: "clean typography, professional text design, graphic design elements"
        };
        const enhancement = styleEnhancements[style];
        if (enhancement) {
          return `${prompt}, ${enhancement}`;
        }
        return prompt;
      }
      // Get optimal image size based on style and use case
      getImageSize(style) {
        const sizeMapping = {
          social: "square_hd",
          // Social media posts work best as squares
          portrait: "portrait_4_3",
          // Portrait photography
          landscape: "landscape_4_3",
          // General landscape format
          cinematic: "landscape_16_9",
          // Cinematic aspect ratio
          commercial: "landscape_4_3",
          // Product photography
          abstract: "square_hd"
          // Abstract art often works well as squares
        };
        return sizeMapping[style] || "landscape_4_3";
      }
      // Direct text-to-video generation using Veo 3 Fast
      async generateTextToVideo(options) {
        try {
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("FAL API timeout after 8 minutes")), 8 * 60 * 1e3);
          });
          const falPromise = fal.subscribe("fal-ai/veo3/fast", {
            input: {
              prompt: options.prompt,
              aspect_ratio: options.aspect_ratio || "9:16",
              duration: options.duration || "8s",
              generate_audio: options.generate_audio !== false,
              // Default to true
              seed: options.seed
            }
          });
          const result = await Promise.race([falPromise, timeoutPromise]);
          const jobId = this.extractJobId(result);
          if (jobId) {
            result.falJobId = jobId;
          }
          return result;
        } catch (error) {
          console.error("Error generating video with Veo 3 Fast:", error);
          throw new Error(`Failed to generate text-to-video: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      }
      // Direct text-to-video generation using Kling AI 2.1
      async generateTextToVideoWithKling(options) {
        try {
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("FAL API timeout after 15 minutes")), 15 * 60 * 1e3);
          });
          const falPromise = fal.subscribe("fal-ai/kling-video/v2.1/master/text-to-video", {
            input: {
              prompt: options.prompt,
              mode: "pro",
              duration: "5",
              aspect_ratio: "16:9",
              generate_audio: true
            }
          });
          const result = await Promise.race([falPromise, timeoutPromise]);
          const jobId = this.extractJobId(result);
          if (jobId) {
            result.falJobId = jobId;
          }
          if (result.video && result.video.audio_url) {
            console.log("Audio URL found:", result.video.audio_url);
          } else {
            console.log("No audio URL found in result");
          }
          return result;
        } catch (error) {
          console.error("Error generating video with Kling AI 2.1:", error);
          if (error && typeof error === "object" && "body" in error) {
            console.error("Validation error details:", JSON.stringify(error.body, null, 2));
          }
          throw new Error(`Failed to generate text-to-video with Kling: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      }
      // Video generation for custom videos (future implementation)
      async generateVideo(prompt, duration = 3) {
        try {
          const result = await fal.subscribe("fal-ai/minimax/hailuo-01", {
            input: {
              prompt,
              duration
            }
          });
          return result.data;
        } catch (error) {
          console.error("Error generating video with Minimax:", error);
          throw new Error("Failed to generate video with Minimax");
        }
      }
      // Image-to-video generation using Minimax Hailuo-02 Pro
      async generateImageToVideo(imageUrl, prompt) {
        try {
          console.log("Starting image-to-video generation with FAL...");
          console.log("Image URL:", imageUrl);
          console.log("Prompt:", prompt);
          console.log("Using fal-ai/minimax/hailuo-02/pro/image-to-video model...");
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("FAL API timeout after 5 minutes")), 5 * 60 * 1e3);
          });
          const falPromise = fal.subscribe("fal-ai/minimax/hailuo-02/pro/image-to-video", {
            input: {
              image_url: imageUrl,
              prompt,
              duration: 3
            }
          });
          const result = await Promise.race([falPromise, timeoutPromise]);
          console.log("FAL video result:", JSON.stringify(result, null, 2));
          const jobId = this.extractJobId(result);
          if (jobId) {
            console.log(`Extracted FAL job ID: ${jobId}`);
            result.falJobId = jobId;
          } else {
            console.warn("No job ID found in FAL response");
          }
          return result;
        } catch (error) {
          console.error("Error generating video with Minimax:", error);
          console.error("Error details:", JSON.stringify(error, null, 2));
          throw new Error(`Failed to generate image-to-video: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      }
      // Enhanced video generation: first creates image, then animates it
      async generateEnhancedVideo(prompt, style = "cinematic", imageOptions = {}) {
        try {
          console.log("Generating base image for video...");
          const imageResult = await this.generateImage(prompt, "flux-1-dev", style, {
            image_size: "landscape_16_9",
            // Optimal for video
            ...imageOptions
          });
          if (!imageResult.images || imageResult.images.length === 0) {
            throw new Error("Failed to generate base image for video");
          }
          const imageUrl = imageResult.images[0].url;
          console.log("Base image generated:", imageUrl);
          const videoPrompt = this.createVideoPrompt(prompt, style);
          console.log("Video prompt:", videoPrompt);
          console.log("Generating video from image...");
          const videoResult = await this.generateImageToVideo(imageUrl, videoPrompt);
          if (!videoResult || !videoResult.video) {
            console.error("Video generation failed - no video in result:", videoResult);
            throw new Error("Video generation failed - no video URL returned");
          }
          return {
            ...videoResult,
            baseImage: imageResult.images[0],
            originalPrompt: prompt,
            videoPrompt,
            style
          };
        } catch (error) {
          console.error("Error in enhanced video generation:", error);
          throw error;
        }
      }
      // Enhanced video generation with Kling AI 2.1: Flux Dev → Kling AI 2.1 → MMAudio
      async generateEnhancedVideoWithKling(prompt, style = "cinematic", imageOptions = {}, useMMAudio = true) {
        try {
          console.log("Starting enhanced video generation with Kling AI 2.1 workflow...");
          console.log("Step 1: Text to Image with Flux Dev");
          const imageResult = await this.generateImage(prompt, "flux-1-dev", style, {
            image_size: "landscape_16_9",
            // Optimal for video
            ...imageOptions
          });
          if (!imageResult.images || imageResult.images.length === 0) {
            throw new Error("Failed to generate base image for video");
          }
          const imageUrl = imageResult.images[0].url;
          console.log("Base image generated:", imageUrl);
          const videoPrompt = this.createVideoPrompt(prompt, style);
          console.log("Step 2: Image to Video with Kling AI 2.1");
          console.log("Video prompt:", videoPrompt);
          const videoResult = await this.generateImageToVideoWithKling(imageUrl, videoPrompt, !useMMAudio);
          if (!videoResult || !videoResult.video) {
            console.error("Video generation failed - no video in result:", videoResult);
            throw new Error("Video generation failed - no video URL returned");
          }
          let finalVideoResult = videoResult;
          let mmaudioUsed = false;
          if (useMMAudio && !videoResult.video.audio_url) {
            console.log("Step 3: Video to Audio with MMAudio");
            try {
              const mmaudioResult = await this.generateAudioFromVideo(videoResult.video.url, prompt);
              console.log("Audio generated with MMAudio");
              if (mmaudioResult && mmaudioResult.video) {
                console.log("MMAudio returned video with audio:", mmaudioResult.video.url);
                finalVideoResult = {
                  ...videoResult,
                  video: mmaudioResult.video,
                  // Use the MMAudio video (with audio attached)
                  mmaudioVideo: mmaudioResult.video
                  // Keep reference to MMAudio result
                };
                mmaudioUsed = true;
              } else {
                console.warn("MMAudio result doesn't contain expected video structure:", mmaudioResult);
              }
            } catch (audioError) {
              console.warn("Audio generation failed, continuing without audio:", audioError);
            }
          } else if (useMMAudio && videoResult.video.audio_url) {
            console.log("Kling generated audio directly, MMAudio not needed");
          } else if (!useMMAudio) {
            console.log("MMAudio disabled, using Kling's built-in audio");
          }
          return {
            ...finalVideoResult,
            baseImage: imageResult.images[0],
            originalPrompt: prompt,
            videoPrompt,
            style,
            workflow: useMMAudio ? "flux-dev-kling-mmaudio" : "flux-dev-kling",
            mmaudioUsed
          };
        } catch (error) {
          console.error("Error in enhanced video generation with Kling:", error);
          throw error;
        }
      }
      // Generate audio from video using MMAudio
      async generateAudioFromVideo(videoUrl, prompt) {
        try {
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("FAL API timeout after 5 minutes")), 5 * 60 * 1e3);
          });
          const falPromise = fal.subscribe("fal-ai/mmaudio-v2", {
            input: {
              video_url: videoUrl,
              prompt
            },
            logs: true,
            onQueueUpdate: (update) => {
              if (update.status === "IN_PROGRESS") {
                update.logs?.map((log2) => log2.message).forEach((message) => {
                });
              } else if (update.status === "COMPLETED") {
              } else {
              }
            }
          });
          const result = await Promise.race([falPromise, timeoutPromise]);
          const jobId = this.extractJobId(result);
          if (jobId) {
            result.falJobId = jobId;
          }
          return result;
        } catch (error) {
          console.error("Error generating audio with MMAudio:", error);
          throw new Error(`Failed to generate audio: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      }
      // Generate image-to-video using Kling AI 2.1
      async generateImageToVideoWithKling(imageUrl, prompt, generateAudio = true) {
        try {
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("FAL API timeout after 15 minutes")), 15 * 60 * 1e3);
          });
          const falPromise = fal.subscribe("fal-ai/kling-video/v2.1/master/image-to-video", {
            input: {
              prompt,
              image_url: imageUrl,
              mode: "pro",
              duration: "5",
              aspect_ratio: "16:9",
              generate_audio: generateAudio
            }
          });
          const result = await Promise.race([falPromise, timeoutPromise]);
          const jobId = this.extractJobId(result);
          if (jobId) {
            result.falJobId = jobId;
          }
          if (result.video && result.video.audio_url) {
            console.log("Audio URL found:", result.video.audio_url);
          } else {
            console.log("No audio URL found in result");
          }
          return result;
        } catch (error) {
          console.error("Error generating image-to-video with Kling AI 2.1:", error);
          if (error && typeof error === "object" && "body" in error) {
            console.error("Validation error details:", JSON.stringify(error.body, null, 2));
          }
          throw new Error(`Failed to generate image-to-video with Kling: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      }
      // Create optimized prompts for video animation
      createVideoPrompt(originalPrompt, style) {
        const videoEnhancements = {
          cinematic: "smooth camera movement, cinematic motion, professional filming",
          dramatic: "dynamic movement, dramatic action, intense motion",
          peaceful: "gentle movement, serene motion, calm transitions",
          energetic: "fast-paced action, dynamic motion, high energy movement",
          artistic: "creative movement, artistic motion, flowing transitions",
          commercial: "professional movement, clean motion, commercial style",
          surreal: "surreal movement, dreamlike motion, otherworldly transitions"
        };
        const enhancement = videoEnhancements[style] || videoEnhancements.cinematic;
        return `${originalPrompt}, ${enhancement}, smooth motion, natural movement, high quality video animation`;
      }
      // Extract job ID from FAL response for recovery tracking
      extractJobId(result) {
        if (!result) return null;
        if (result.request_id) return result.request_id;
        if (result.job_id) return result.job_id;
        if (result.id) return result.id;
        if (result.data?.request_id) return result.data.request_id;
        if (result.data?.job_id) return result.data.job_id;
        if (result.data?.id) return result.data.id;
        return null;
      }
      // Check job status for recovery purposes
      async checkJobStatus(jobId) {
        try {
          console.log(`Checking status for FAL job ${jobId}`);
          throw new Error("Job status checking not yet implemented");
        } catch (error) {
          console.error(`Error checking job status for ${jobId}:`, error);
          throw error;
        }
      }
    };
    falService = new FalService();
  }
});

// server/image-router.ts
var ImageRouter, imageRouter;
var init_image_router = __esm({
  "server/image-router.ts"() {
    "use strict";
    init_fal_service();
    ImageRouter = class {
      // Route image generation to the appropriate provider based on recipe configuration
      async generateImage(options) {
        const provider = this.selectOptimalProvider(options);
        try {
          switch (provider) {
            case "fal":
              return await this.generateWithFAL(options);
            case "openai":
              return await this.generateWithOpenAI(options);
            case "midjourney":
              return await this.generateWithMidjourney(options);
            default:
              throw new Error(`Unsupported image provider: ${provider}`);
          }
        } catch (error) {
          console.error(`Image generation failed with ${provider}:`, error);
          return {
            images: [],
            provider,
            model: options.model || "unknown",
            status: "failed",
            error: error instanceof Error ? error.message : "Unknown error"
          };
        }
      }
      // Smart provider selection based on requirements
      selectOptimalProvider(options) {
        if (options.provider) {
          return options.provider;
        }
        if (options.model?.includes("flux")) {
          return "fal";
        } else if (options.model?.includes("dall-e") || options.model?.includes("openai")) {
          return "openai";
        } else if (options.model?.includes("midjourney")) {
          return "midjourney";
        }
        if (options.style === "photorealistic" || options.style === "commercial") {
          return "fal";
        } else if (options.style === "artistic" || options.style === "abstract") {
          return "openai";
        } else if (options.style === "cinematic" || options.style === "illustration") {
          return "midjourney";
        }
        return "fal";
      }
      // FAL/Flux image generation implementation
      async generateWithFAL(options) {
        try {
          let modelToUse = "flux-1-dev";
          if (options.quality === "ultra" || options.model?.includes("pro")) {
            modelToUse = "flux-1-pro";
          } else if (options.quality === "standard" || options.model?.includes("schnell")) {
            modelToUse = "flux-1-schnell";
          }
          const result = await falService.generateImage(
            options.prompt,
            modelToUse,
            options.style || "photorealistic",
            {
              image_size: options.imageSize || "landscape_4_3",
              num_images: options.numImages || 1,
              seed: options.seed
            }
          );
          return {
            images: result.images || [],
            provider: "fal",
            model: modelToUse,
            metadata: result,
            status: "completed"
          };
        } catch (error) {
          throw new Error(`FAL image generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      }
      // OpenAI DALL-E image generation implementation
      async generateWithOpenAI(options) {
        try {
          if (!process.env.OPENAI_API_KEY) {
            throw new Error("OpenAI API key not configured");
          }
          return {
            images: [],
            provider: "openai",
            model: options.model || "dall-e-3",
            status: "failed",
            error: "OpenAI DALL-E integration not yet implemented"
          };
        } catch (error) {
          throw new Error(`OpenAI image generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      }
      // Midjourney image generation implementation (placeholder)
      async generateWithMidjourney(options) {
        try {
          return {
            images: [],
            provider: "midjourney",
            model: options.model || "midjourney-v6",
            status: "failed",
            error: "Midjourney integration not yet available"
          };
        } catch (error) {
          throw new Error(`Midjourney image generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      }
      // Get optimal settings based on recipe configuration
      getOptimalSettings(recipeModel, recipeStyle) {
        const provider = this.selectOptimalProvider({
          prompt: "",
          // temporary placeholder for type checking
          model: recipeModel,
          style: recipeStyle
        });
        let quality = "hd";
        if (recipeStyle === "commercial" || recipeStyle === "photorealistic") {
          quality = "ultra";
        } else if (recipeStyle === "social" || recipeModel?.includes("schnell")) {
          quality = "standard";
        }
        let imageSize = "landscape_4_3";
        if (recipeStyle === "social") {
          imageSize = "square_hd";
        } else if (recipeStyle === "portrait") {
          imageSize = "portrait_4_3";
        } else if (recipeStyle === "cinematic") {
          imageSize = "landscape_16_9";
        }
        return {
          provider,
          quality,
          imageSize,
          numImages: 1
        };
      }
      // Provider availability check
      async checkProviderAvailability(provider) {
        try {
          switch (provider) {
            case "fal":
              return process.env.FAL_KEY !== void 0;
            case "openai":
              return process.env.OPENAI_API_KEY !== void 0;
            case "midjourney":
              return false;
            // Not yet implemented
            default:
              return false;
          }
        } catch (error) {
          return false;
        }
      }
      // Get supported features for each provider
      getSupportedFeatures(provider) {
        switch (provider) {
          case "fal":
            return {
              models: ["flux-1-pro", "flux-1-dev", "flux-1-schnell"],
              maxImages: 4,
              supportedSizes: ["square_hd", "square", "portrait_4_3", "portrait_16_9", "landscape_4_3", "landscape_16_9"],
              supportedStyles: ["photorealistic", "cinematic", "commercial", "artistic"],
              features: ["text-to-image", "style-transfer", "high-resolution"]
            };
          case "openai":
            return {
              models: ["dall-e-3", "dall-e-2"],
              maxImages: 1,
              supportedSizes: ["1024x1024", "1792x1024", "1024x1792"],
              supportedStyles: ["artistic", "photorealistic", "cartoon"],
              features: ["text-to-image", "image-editing"]
            };
          case "midjourney":
            return {
              models: ["midjourney-v6", "midjourney-v5"],
              maxImages: 4,
              supportedSizes: ["square", "portrait", "landscape"],
              supportedStyles: ["artistic", "cinematic", "illustration", "concept-art"],
              features: ["text-to-image", "style-variations", "upscaling"]
            };
          default:
            return null;
        }
      }
      // Enhanced prompt engineering for different providers
      enhancePromptForProvider(prompt, provider, style) {
        const basePrompt = prompt;
        switch (provider) {
          case "fal":
            const fluxEnhancements = {
              photorealistic: "photorealistic, high quality, detailed, professional photography, sharp focus",
              cinematic: "cinematic lighting, dramatic composition, film still, professional cinematography",
              commercial: "commercial photography, clean professional style, studio lighting, product shot",
              artistic: "artistic composition, creative interpretation, fine art photography"
            };
            const fluxEnhancement = style && fluxEnhancements[style];
            return fluxEnhancement ? `${basePrompt}, ${fluxEnhancement}` : basePrompt;
          case "openai":
            const dalleEnhancements = {
              artistic: "in the style of digital art, creative composition, vibrant colors",
              photorealistic: "photorealistic rendering, highly detailed, professional quality",
              cartoon: "cartoon style, animated, colorful illustration"
            };
            const dalleEnhancement = style && dalleEnhancements[style];
            return dalleEnhancement ? `${basePrompt}, ${dalleEnhancement}` : basePrompt;
          case "midjourney":
            const mjEnhancements = {
              cinematic: "cinematic composition, dramatic lighting, film photography, --ar 16:9",
              artistic: "artistic masterpiece, beautiful composition, trending on artstation",
              illustration: "detailed illustration, concept art, digital painting"
            };
            const mjEnhancement = style && mjEnhancements[style];
            return mjEnhancement ? `${basePrompt} ${mjEnhancement}` : basePrompt;
          default:
            return basePrompt;
        }
      }
      // Cost calculation based on provider and settings
      calculateCreditCost(provider, options) {
        const baseCost = {
          fal: {
            "flux-1-schnell": 1,
            "flux-1-dev": 3,
            "flux-1-pro": 5
          },
          openai: {
            "dall-e-2": 2,
            "dall-e-3": 4
          },
          midjourney: {
            "midjourney-v5": 6,
            "midjourney-v6": 8
          }
        };
        const modelCost = baseCost[provider]?.[options.model] || 3;
        const imageCost = modelCost * (options.numImages || 1);
        const qualityMultiplier = {
          standard: 1,
          hd: 1.5,
          ultra: 2
        };
        return Math.ceil(imageCost * qualityMultiplier[options.quality || "hd"]);
      }
    };
    imageRouter = new ImageRouter();
  }
});

// server/error-handler.ts
var ErrorHandler;
var init_error_handler = __esm({
  "server/error-handler.ts"() {
    "use strict";
    ErrorHandler = class {
      static errorCategories = {
        // API Key / Authentication Issues
        API_KEY_INVALID: {
          category: "authentication",
          userMessage: "There was an issue with our AI service connection. Our team has been notified and will resolve this quickly.",
          shouldRefund: true,
          shouldRetry: false,
          technicalMessage: "Invalid API key or authentication failed"
        },
        API_KEY_QUOTA: {
          category: "quota",
          userMessage: "Our AI service is temporarily at capacity. We've added your request to priority processing and will complete it soon.",
          shouldRefund: false,
          shouldRetry: true,
          technicalMessage: "API quota exceeded"
        },
        // Content Policy Issues
        CONTENT_POLICY: {
          category: "content",
          userMessage: "Your prompt couldn't be processed due to content guidelines. Please try rephrasing with different words.",
          shouldRefund: true,
          shouldRetry: false,
          technicalMessage: "Content violates AI service policies"
        },
        NSFW_CONTENT: {
          category: "content",
          userMessage: "Your request contains content that isn't supported. Please modify your prompt and try again.",
          shouldRefund: true,
          shouldRetry: false,
          technicalMessage: "NSFW or inappropriate content detected"
        },
        // Technical Issues
        NETWORK_ERROR: {
          category: "network",
          userMessage: "There was a temporary connection issue. We're retrying your request automatically.",
          shouldRefund: false,
          shouldRetry: true,
          technicalMessage: "Network connectivity problem"
        },
        SERVICE_UNAVAILABLE: {
          category: "service",
          userMessage: "Our AI service is temporarily unavailable. We'll process your request as soon as it's back online.",
          shouldRefund: false,
          shouldRetry: true,
          technicalMessage: "External service unavailable"
        },
        TIMEOUT: {
          category: "timeout",
          userMessage: "Your request took longer than expected to process. We're trying again with optimized settings.",
          shouldRefund: false,
          shouldRetry: true,
          technicalMessage: "Request timeout"
        },
        // Input Issues
        INVALID_PROMPT: {
          category: "input",
          userMessage: "There was an issue with your prompt format. Please try simplifying or rephrasing your request.",
          shouldRefund: true,
          shouldRetry: false,
          technicalMessage: "Invalid prompt or parameters"
        },
        PROMPT_TOO_LONG: {
          category: "input",
          userMessage: "Your prompt is too detailed. Please try shortening it and focus on the key elements you want.",
          shouldRefund: true,
          shouldRetry: false,
          technicalMessage: "Prompt exceeds length limits"
        },
        // System Issues
        STORAGE_ERROR: {
          category: "storage",
          userMessage: "There was an issue saving your generated content. Our team is looking into this and will resolve it quickly.",
          shouldRefund: true,
          shouldRetry: true,
          technicalMessage: "File storage or database error"
        },
        UNKNOWN_ERROR: {
          category: "unknown",
          userMessage: "Something unexpected happened. We've been notified and are working on a fix. Your credits have been refunded.",
          shouldRefund: true,
          shouldRetry: true,
          technicalMessage: "Unclassified error"
        }
      };
      static analyzeError(error, context) {
        const errorString = error?.message || error?.toString() || "";
        const errorCode = error?.code || error?.type || "";
        let category;
        if (errorString.includes("Missing required parameter") || errorString.includes("tools[0].function")) {
          category = this.errorCategories.INVALID_PROMPT;
        } else if (errorString.includes("Incorrect API key") || errorString.includes("invalid_api_key")) {
          category = this.errorCategories.API_KEY_INVALID;
        } else if (errorString.includes("quota") || errorString.includes("rate_limit") || errorCode === "rate_limit_exceeded") {
          category = this.errorCategories.API_KEY_QUOTA;
        } else if (errorString.includes("content_policy") || errorString.includes("safety") || errorString.includes("inappropriate")) {
          category = this.errorCategories.CONTENT_POLICY;
        } else if (errorString.includes("ECONNRESET") || errorString.includes("ENOTFOUND") || errorString.includes("timeout")) {
          category = this.errorCategories.NETWORK_ERROR;
        } else if (errorCode === "service_unavailable" || errorString.includes("503")) {
          category = this.errorCategories.SERVICE_UNAVAILABLE;
        } else {
          category = this.errorCategories.UNKNOWN_ERROR;
        }
        return {
          category,
          originalError: error,
          generationId: context?.generationId,
          userId: context?.userId
        };
      }
      static getUserFriendlyMessage(error, context) {
        const analysis = this.analyzeError(error, context);
        return analysis.category.userMessage;
      }
      static shouldRefundCredits(error, context) {
        const analysis = this.analyzeError(error, context);
        return analysis.category.shouldRefund;
      }
      static shouldRetry(error, context) {
        const analysis = this.analyzeError(error, context);
        return analysis.category.shouldRetry;
      }
      static formatTechnicalDetails(error) {
        return {
          message: error?.message || "Unknown error",
          code: error?.code || null,
          type: error?.type || null,
          status: error?.status || null,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          stack: error?.stack?.split("\n").slice(0, 5).join("\n") || null
          // First 5 lines only
        };
      }
    };
  }
});

// server/workflow-processor.ts
var workflow_processor_exports = {};
__export(workflow_processor_exports, {
  WorkflowProcessor: () => WorkflowProcessor,
  workflowProcessor: () => workflowProcessor
});
import * as fal2 from "@fal-ai/serverless-client";
var WorkflowProcessor, workflowProcessor;
var init_workflow_processor = __esm({
  "server/workflow-processor.ts"() {
    "use strict";
    init_media_transfer_service();
    fal2.config({
      credentials: process.env.FAL_KEY
    });
    WorkflowProcessor = class {
      async processWorkflow(components, prompt, generationId, recipeConfig) {
        let previousResult = null;
        let finalJobId = null;
        for (const component of components) {
          try {
            if (component.type === "image") {
              previousResult = await this.processImageComponent(component, prompt);
            } else if (component.type === "video") {
              if (!previousResult) {
                throw new Error("Video component requires image input from previous component");
              }
              previousResult = await this.processVideoComponent(component, previousResult, prompt);
            } else if (component.type === "text_to_video") {
              previousResult = await this.processTextToVideoComponent(component, prompt, recipeConfig);
            } else {
              throw new Error(`Unsupported component type: ${component.type}`);
            }
            if (previousResult.metadata?.jobId) {
              finalJobId = previousResult.metadata.jobId;
            }
          } catch (error) {
            console.error(`Error processing ${component.type} component:`, error);
            throw error;
          }
        }
        if (!previousResult) {
          throw new Error("Workflow processing failed - no results");
        }
        if (finalJobId) {
          previousResult.metadata.finalJobId = finalJobId;
        }
        return previousResult;
      }
      async processImageComponent(component, prompt) {
        const endpoint = this.getImageEndpoint(component.model);
        const options = this.getImageOptions(component.model, prompt);
        console.log(`Starting FAL API request to ${endpoint}...`);
        const jobRequest = await fal2.queue.submit(endpoint, { input: options });
        const jobId = jobRequest.request_id;
        console.log(`FAL job submitted with ID: ${jobId}`);
        return {
          type: "image",
          data: null,
          // Will be populated by recovery service
          metadata: {
            model: component.model,
            endpoint,
            jobId,
            prompt,
            status: "submitted"
          }
        };
      }
      async processVideoComponent(component, imageInput, prompt) {
        if (!component.endpoint) {
          throw new Error(`Video component missing endpoint for model: ${component.model}`);
        }
        const imageUrl = imageInput.data.images?.[0]?.url || imageInput.data.url;
        if (!imageUrl) {
          throw new Error("No image URL found in input for video generation");
        }
        console.log(`Starting FAL API request to ${component.endpoint}...`);
        console.log(`Input image URL: ${imageUrl}`);
        const options = this.getVideoOptions(component.model, imageUrl, prompt);
        const jobRequest = await fal2.queue.submit(component.endpoint, { input: options });
        const jobId = jobRequest.request_id;
        console.log(`FAL job submitted with ID: ${jobId}`);
        return {
          type: "video",
          data: null,
          // Will be populated by recovery service
          metadata: {
            model: component.model,
            endpoint: component.endpoint,
            jobId,
            prompt,
            baseImage: imageInput,
            status: "submitted"
          }
        };
      }
      async processTextToVideoComponent(component, prompt, recipeConfig) {
        const aspectRatio = recipeConfig?.videoAspectRatio || "9:16";
        const duration = recipeConfig?.videoDuration || 8;
        const quality = recipeConfig?.videoQuality || "hd";
        console.log(`Using settings: aspect_ratio=${aspectRatio}, duration=${duration}s, quality=${quality}`);
        let endpoint;
        let options;
        if (component.model === "kling2.1" || component.model === "kling-ai-2.1") {
          endpoint = "fal-ai/kling2.1";
          options = {
            prompt,
            aspect_ratio: aspectRatio,
            duration: `${duration}s`,
            // Convert to string format required by FAL
            generate_audio: true,
            // Enable audio by default
            motion_bucket_id: 127,
            // Default Kling motion setting
            cond_aug: 0.02
            // Default Kling conditioning augmentation
          };
        } else {
          endpoint = "fal-ai/veo3/fast";
          options = {
            prompt,
            aspect_ratio: aspectRatio,
            duration: `${duration}s`,
            // Convert to string format required by FAL
            generate_audio: true
            // Enable audio by default
          };
        }
        const jobRequest = await fal2.queue.submit(endpoint, { input: options });
        const jobId = jobRequest.request_id;
        console.log(`FAL job submitted with ID: ${jobId}`);
        return {
          type: "video",
          data: null,
          // Will be populated by recovery service
          metadata: {
            model: component.model,
            endpoint,
            jobId,
            prompt,
            status: "submitted",
            serviceId: component.serviceId,
            aspectRatio,
            duration,
            quality
          }
        };
      }
      getImageEndpoint(model) {
        switch (model) {
          case "flux-1-dev":
            return "fal-ai/flux/dev";
          case "flux-1-schnell":
            return "fal-ai/flux/schnell";
          case "flux-1-pro":
            return "fal-ai/flux-pro";
          default:
            throw new Error(`Unsupported image model: ${model}`);
        }
      }
      getImageOptions(model, prompt) {
        const enhancedPrompt = this.enhancePromptForSurrealism(prompt);
        const baseOptions = {
          prompt: enhancedPrompt,
          image_size: "landscape_16_9",
          num_inference_steps: 28,
          guidance_scale: 3.5,
          num_images: 1,
          enable_safety_checker: true
        };
        switch (model) {
          case "flux-1-dev":
          case "flux-1-schnell":
            return baseOptions;
          case "flux-1-pro":
            return {
              ...baseOptions,
              guidance_scale: 4,
              num_inference_steps: 50
            };
          default:
            return baseOptions;
        }
      }
      getVideoOptions(model, imageUrl, prompt) {
        switch (model) {
          case "hailuo-02-pro":
            return {
              image_url: imageUrl,
              prompt: `Continue this scene: ${prompt}. Make it dynamic and engaging with smooth motion.`,
              duration: 5
            };
          default:
            return {
              image_url: imageUrl,
              prompt,
              duration: 3
            };
        }
      }
      enhancePromptForSurrealism(prompt) {
        if (prompt.includes("eating") && prompt.includes("lava")) {
          return `A surreal and humorous scene of ${prompt}. The molten lava glows bright orange and red with realistic heat shimmer effects. The person appears completely unaffected, showing no signs of pain or discomfort. The setting should be visually striking with excellent lighting and composition. The image should be both absurd and visually compelling.`;
        }
        return prompt;
      }
      /**
       * Transfer generated media to S3 and return CDN URLs
       */
      async transferGeneratedMedia(workflowResult) {
        try {
          console.log("Starting media transfer for workflow result:", workflowResult.type);
          if (workflowResult.type === "image") {
            const imageUrl = workflowResult.data.images?.[0]?.url || workflowResult.data.url;
            if (!imageUrl) {
              throw new Error("No image URL found in workflow result");
            }
            const transferResult = await mediaTransferService.transferMedia({
              remoteUrl: imageUrl,
              mediaType: "image"
            });
            if (!transferResult.success) {
              throw new Error(`Image transfer failed: ${transferResult.error}`);
            }
            return {
              ...workflowResult,
              data: {
                ...workflowResult.data,
                images: [{
                  ...workflowResult.data.images?.[0],
                  url: transferResult.cdnUrl,
                  originalUrl: imageUrl
                }],
                cdnUrl: transferResult.cdnUrl,
                s3Key: transferResult.s3Key,
                assetId: transferResult.assetId
              },
              metadata: {
                ...workflowResult.metadata,
                transferredToS3: true,
                cdnUrl: transferResult.cdnUrl,
                s3Key: transferResult.s3Key,
                assetId: transferResult.assetId
              }
            };
          } else if (workflowResult.type === "video") {
            const videoUrl = workflowResult.data.video?.url || workflowResult.data.url;
            if (!videoUrl) {
              throw new Error("No video URL found in workflow result");
            }
            const transferResult = await mediaTransferService.transferMedia({
              remoteUrl: videoUrl,
              mediaType: "video"
            });
            if (!transferResult.success) {
              throw new Error(`Video transfer failed: ${transferResult.error}`);
            }
            return {
              ...workflowResult,
              data: {
                ...workflowResult.data,
                video: {
                  ...workflowResult.data.video,
                  url: transferResult.cdnUrl,
                  originalUrl: videoUrl
                },
                cdnUrl: transferResult.cdnUrl,
                s3Key: transferResult.s3Key,
                assetId: transferResult.assetId
              },
              metadata: {
                ...workflowResult.metadata,
                transferredToS3: true,
                cdnUrl: transferResult.cdnUrl,
                s3Key: transferResult.s3Key,
                assetId: transferResult.assetId
              }
            };
          }
          return workflowResult;
        } catch (error) {
          console.error("Media transfer failed:", error);
          return workflowResult;
        }
      }
    };
    workflowProcessor = new WorkflowProcessor();
  }
});

// server/thumbnail-service.ts
var thumbnail_service_exports = {};
__export(thumbnail_service_exports, {
  ThumbnailService: () => ThumbnailService,
  thumbnailService: () => thumbnailService
});
import { LambdaClient as LambdaClient2, InvokeCommand as InvokeCommand2 } from "@aws-sdk/client-lambda";
function getLambdaClient2() {
  if (!lambdaClient2) {
    lambdaClient2 = new LambdaClient2({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_DELULA_ACCESS_KEY,
        secretAccessKey: process.env.AWS_DELULA_SECRET_ACCESS_KEY
      }
    });
  }
  return lambdaClient2;
}
var lambdaClient2, ThumbnailService, thumbnailService;
var init_thumbnail_service = __esm({
  "server/thumbnail-service.ts"() {
    "use strict";
    init_env();
    lambdaClient2 = null;
    ThumbnailService = class {
      BUCKET_NAME = "delula-media-prod";
      CDN_BASE_URL = "https://cdn.delu.la";
      /**
       * Update the database with the thumbnail URL
       */
      async updateThumbnailUrl(generationId, thumbnailUrl) {
        try {
          const { db: db2 } = await Promise.resolve().then(() => (init_db(), db_exports));
          const { generations: generations3 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
          const { eq: eq9 } = await import("drizzle-orm");
          await db2.update(generations3).set({
            thumbnailUrl,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq9(generations3.id, generationId));
          console.log(`\u2705 Updated generation ${generationId} with thumbnail URL: ${thumbnailUrl}`);
        } catch (error) {
          console.error(`\u274C Failed to update thumbnail URL for generation ${generationId}:`, error);
          throw error;
        }
      }
      /**
       * Generate a thumbnail for a video using the VideoToGIF_Square Lambda
       */
      async generateThumbnail(request) {
        try {
          console.log(`\u{1F3AC} Starting thumbnail generation for generation ${request.generationId}`);
          console.log(`\u{1F4F9} Video URL: ${request.videoUrl}`);
          console.log(`\u{1F194} Asset ID: ${request.assetId}`);
          const videoUrl = request.videoUrl;
          const filename = videoUrl.split("/").pop()?.split("?")[0]?.replace(".mp4", "") || request.assetId;
          const thumbnailKey = `videos/thumbnails/${filename}.gif`;
          const lambdaPayload = {
            remote_url: request.videoUrl,
            bucket: this.BUCKET_NAME,
            key: thumbnailKey,
            dimension: 128
          };
          console.log(`Invoking VideoToGIF_Square Lambda with payload:`, lambdaPayload);
          const command = new InvokeCommand2({
            FunctionName: "VideoToGIF_Square",
            Payload: JSON.stringify(lambdaPayload)
          });
          const response = await getLambdaClient2().send(command);
          if (!response.Payload) {
            throw new Error("No response payload from Lambda");
          }
          const result = JSON.parse(new TextDecoder().decode(response.Payload));
          if (result.statusCode !== 200) {
            throw new Error(`Lambda execution failed: ${result.body}`);
          }
          const thumbnailUrl = `${this.CDN_BASE_URL}/${thumbnailKey}`;
          console.log(`\u2705 Thumbnail generation completed successfully: ${thumbnailUrl}`);
          await this.updateThumbnailUrl(request.generationId, thumbnailUrl);
          return {
            success: true,
            thumbnailUrl
          };
        } catch (error) {
          console.error("Thumbnail generation failed:", error);
          return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
          };
        }
      }
      /**
       * Generate thumbnail asynchronously (fire and forget)
       * This is used when we don't want to block the main generation process
       */
      async generateThumbnailAsync(request) {
        this.generateThumbnail(request).catch((error) => {
          console.error(`Async thumbnail generation failed for generation ${request.generationId}:`, error);
        });
      }
    };
    thumbnailService = new ThumbnailService();
  }
});

// server/queue-service.ts
var queue_service_exports = {};
__export(queue_service_exports, {
  generationQueue: () => generationQueue
});
import { eq as eq2, and as and2, isNotNull } from "drizzle-orm";
var GenerationQueue, generationQueue;
var init_queue_service = __esm({
  "server/queue-service.ts"() {
    "use strict";
    init_storage();
    init_schema();
    init_recipe_processor();
    init_media_transfer_service();
    init_image_router();
    init_openai_gpt_image_service();
    init_error_handler();
    init_db();
    GenerationQueue = class {
      queue = [];
      processing = false;
      currentlyProcessing = null;
      processingJobs = /* @__PURE__ */ new Set();
      // Track jobs being processed to prevent duplicates
      maxConcurrentJobs = 3;
      // Allow multiple jobs to process concurrently
      asyncPollingInterval = null;
      async addToQueue(generation, formData) {
        const recipe = await storage.getRecipeById(generation.recipeId);
        if (!recipe) {
          await storage.failGeneration(
            generation.id,
            "Recipe not found. Please try again or contact support.",
            { error: "Recipe not found", recipeId: generation.recipeId },
            true
          );
          return;
        }
        await storage.updateGenerationStatus(generation.id, "pending");
        const queueItem = {
          id: generation.id,
          userId: generation.userId,
          recipeId: generation.recipeId,
          formData,
          priority: 1,
          createdAt: new Date(generation.createdAt)
        };
        this.queue.push(queueItem);
        this.queue.sort((a, b) => a.priority - b.priority || a.createdAt.getTime() - b.createdAt.getTime());
        console.log(`Added generation ${generation.id} to queue (${recipe.creditCost} credits). Queue length: ${this.queue.length}`);
        this.broadcastQueueUpdate(generation.userId);
        if (!this.processing) {
          this.startProcessing();
        }
      }
      async startProcessing() {
        if (this.processing) return;
        this.processing = true;
        console.log("Starting queue processing...");
        const activeJobs = /* @__PURE__ */ new Map();
        while (this.queue.length > 0 || activeJobs.size > 0) {
          while (this.queue.length > 0 && activeJobs.size < this.maxConcurrentJobs) {
            const item = this.queue.shift();
            if (this.processingJobs.has(item.id)) {
              console.log(`Job ${item.id} is already being processed, skipping`);
              continue;
            }
            this.processingJobs.add(item.id);
            this.currentlyProcessing = item;
            const jobPromise = this.processJobWithTimeout(item).finally(() => {
              activeJobs.delete(item.id);
            });
            activeJobs.set(item.id, jobPromise);
            this.broadcastGenerationUpdate(item.userId, item.id, "processing");
          }
          if (activeJobs.size > 0) {
            try {
              await Promise.race(activeJobs.values());
            } catch (error) {
              console.error("One or more jobs failed:", error);
            }
          }
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        this.processing = false;
        console.log("Queue processing completed");
      }
      async processJobWithTimeout(item) {
        try {
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Generation timeout after 8 minutes")), 8 * 60 * 1e3);
          });
          await Promise.race([
            this.processGeneration(item),
            timeoutPromise
          ]);
          this.broadcastGenerationUpdate(item.userId, item.id, "completed");
        } catch (error) {
          console.error(`Failed to process generation ${item.id}:`, error);
          await this.handleGenerationFailure(item, error);
          this.broadcastGenerationUpdate(item.userId, item.id, "failed");
        } finally {
          this.processingJobs.delete(item.id);
          if (this.currentlyProcessing?.id === item.id) {
            this.currentlyProcessing = null;
          }
          this.broadcastQueueUpdate(item.userId);
        }
      }
      async processGeneration(item) {
        console.log(`Processing generation ${item.id}...`);
        const generation = await storage.getGenerationById(item.id);
        if (!generation) {
          console.log(`Generation ${item.id} not found, skipping...`);
          return;
        }
        if (generation.status !== "pending") {
          console.log(`Generation ${item.id} is already ${generation.status}, skipping...`);
          return;
        }
        await storage.updateGenerationStatus(item.id, "processing");
        try {
          const recipe = await storage.getRecipeById(item.recipeId);
          if (!recipe) {
            throw new Error(`Recipe ${item.recipeId} not found`);
          }
          let result;
          const generation2 = await storage.getGenerationById(item.id);
          const isImageToVideo = recipe.workflowType === "image_to_video";
          const workflowComponents = recipe.workflowComponents;
          if (workflowComponents && Array.isArray(workflowComponents)) {
            const processedResult = processRecipePrompt(recipe, item.formData);
            const processedPrompt = processedResult.prompt;
            console.log(`Processing workflow components for generation ${item.id}:`, workflowComponents);
            const { workflowProcessor: workflowProcessor2 } = await Promise.resolve().then(() => (init_workflow_processor(), workflow_processor_exports));
            const workflowResult = await workflowProcessor2.processWorkflow(workflowComponents, processedPrompt, item.id, recipe);
            if (workflowResult.metadata?.jobId) {
              await storage.registerFalJob(item.id, workflowResult.metadata.jobId);
              await storage.updateGenerationFalJobStatus(item.id, "processing");
              const currentGeneration = await storage.getGenerationById(item.id);
              if (currentGeneration) {
                const updatedMetadata = {
                  ...currentGeneration.metadata || {},
                  ...workflowResult.metadata,
                  formData: item.formData
                };
                await db.update(generations).set({ metadata: updatedMetadata }).where(eq2(generations.id, item.id));
              }
              console.log(`Registered job ${workflowResult.metadata.jobId} for polling with endpoint ${workflowResult.metadata.endpoint}`);
              return;
            }
            const transferredResult = await workflowProcessor2.transferGeneratedMedia(workflowResult);
            result = this.formatWorkflowResult(transferredResult, item.formData);
          } else if (isImageToVideo) {
            const processedResult = processRecipePrompt(recipe, item.formData);
            const processedPrompt = processedResult.prompt;
            const { falService: falService2 } = await Promise.resolve().then(() => (init_fal_service(), fal_service_exports));
            console.log(`Starting enhanced video generation for ${item.id}...`);
            const videoResult = await falService2.generateEnhancedVideo(
              processedPrompt,
              recipe.style || "cinematic"
            );
            let cdnUrl = videoResult.video?.url;
            let s3Key = videoResult.video?.url?.split("/").pop() || "video_unknown";
            let assetId = videoResult.video?.url?.split("/").pop()?.split(".")[0] || "video_unknown";
            let transferSuccess = false;
            if (videoResult.video?.url) {
              const transferResult = await mediaTransferService.transferMedia({
                remoteUrl: videoResult.video.url,
                mediaType: "video"
              });
              if (transferResult.success) {
                cdnUrl = transferResult.cdnUrl;
                s3Key = transferResult.s3Key || s3Key;
                assetId = transferResult.assetId || assetId;
                transferSuccess = true;
              }
            }
            result = {
              videoUrl: cdnUrl || null,
              imageUrl: videoResult.baseImage?.url || null,
              s3Key,
              assetId,
              metadata: {
                model: recipe.model,
                provider: "fal-minimax-hailuo-02-pro",
                prompt: processedPrompt,
                videoPrompt: videoResult.videoPrompt,
                originalPrompt: videoResult.originalPrompt,
                style: videoResult.style,
                baseImage: videoResult.baseImage,
                generationType: "enhanced_video",
                formData: item.formData,
                transferredToS3: transferSuccess
              }
            };
          } else if (recipe.model === "gpt-image-1") {
            const processedResult = processRecipePrompt(recipe, item.formData);
            const processedPrompt = processedResult.prompt;
            const gptResult = await gptImageService.generateImage({
              prompt: processedPrompt,
              quality: "high",
              size: "1024x1024",
              format: "png"
            });
            result = {
              ...gptResult,
              metadata: {
                ...gptResult.metadata,
                formData: item.formData
              }
            };
          } else {
            const processedResult = processRecipePrompt(recipe, item.formData);
            const processedPrompt = processedResult.prompt;
            const imageResult = await imageRouter.generateImage({
              prompt: processedPrompt,
              model: recipe.model,
              style: recipe.style,
              quality: "hd",
              imageSize: "square_hd",
              numImages: 1
            });
            if (imageResult.status === "failed") {
              throw new Error(imageResult.error || "Image generation failed");
            }
            const firstImage = imageResult.images[0];
            if (!firstImage || !firstImage.url) {
              throw new Error("No image generated");
            }
            let cdnUrl = firstImage.url;
            let s3Key = firstImage.url.split("/").pop() || "unknown";
            let assetId = firstImage.url.split("/").pop()?.split(".")[0] || "unknown";
            let transferSuccess = false;
            const transferResult = await mediaTransferService.transferMedia({
              remoteUrl: firstImage.url,
              mediaType: "image"
            });
            if (transferResult.success) {
              cdnUrl = transferResult.cdnUrl;
              s3Key = transferResult.s3Key || s3Key;
              assetId = transferResult.assetId || assetId;
              transferSuccess = true;
            }
            result = {
              imageUrl: cdnUrl,
              s3Key,
              assetId,
              metadata: {
                model: recipe.model,
                provider: imageResult.provider,
                prompt: processedPrompt,
                ...imageResult.metadata,
                formData: item.formData,
                transferredToS3: transferSuccess
              }
            };
          }
          if (result.falJobId) {
            await storage.registerFalJob(item.id, result.falJobId);
            await storage.updateGenerationFalJobStatus(item.id, "processing");
            console.log(`Stored FAL job ID: ${result.falJobId} for generation ${item.id}`);
          }
          if (result.shortId && result.secureUrl) {
            await storage.updateGenerationWithSecureAsset(
              item.id,
              "completed",
              result.secureUrl,
              result.s3Key,
              result.assetId,
              result.shortId,
              result.metadata
            );
          } else {
            const resultUrl = result.videoUrl || result.imageUrl;
            if (!resultUrl) {
              throw new Error("No video or image URL generated");
            }
            await storage.updateGenerationWithAsset(
              item.id,
              "completed",
              resultUrl,
              result.s3Key,
              result.assetId,
              result.metadata,
              result.videoUrl || null
              // Pass videoUrl if present, else null
            );
            if (result.videoUrl) {
              console.log(`\u{1F3AC} Starting async thumbnail generation for video generation ${item.id}`);
              const { thumbnailService: thumbnailService2 } = await Promise.resolve().then(() => (init_thumbnail_service(), thumbnail_service_exports));
              thumbnailService2.generateThumbnailAsync({
                generationId: item.id,
                videoUrl: result.videoUrl,
                s3Key: result.s3Key,
                assetId: result.assetId
              });
            }
          }
          console.log(`Generation ${item.id} completed successfully using ${recipe.model}`);
        } catch (error) {
          console.error(`Generation ${item.id} failed:`, error);
          await this.handleGenerationFailure(item, error);
          throw error;
        }
      }
      async handleGenerationFailure(item, error) {
        const context = {
          generationId: item.id,
          userId: item.userId,
          recipeId: item.recipeId
        };
        const userMessage = ErrorHandler.getUserFriendlyMessage(error, context);
        const shouldRefund = ErrorHandler.shouldRefundCredits(error, context);
        const shouldRetry = ErrorHandler.shouldRetry(error, context);
        const technicalDetails = ErrorHandler.formatTechnicalDetails(error);
        console.log(`Generation ${item.id} failure analysis:`, {
          userMessage,
          shouldRefund,
          shouldRetry,
          errorType: technicalDetails.type || "unknown"
        });
        await storage.failGeneration(item.id, userMessage, technicalDetails, shouldRefund);
      }
      getQueueStats() {
        return {
          totalInQueue: this.queue.length,
          currentlyProcessing: this.currentlyProcessing ? 1 : 0,
          averageWaitTime: this.queue.length * 30,
          // Estimate 30 seconds per generation
          completedToday: 0,
          // This would require database query
          systemLoad: this.processing ? "processing" : "idle"
        };
      }
      getCurrentPosition(generationId) {
        const index2 = this.queue.findIndex((item) => item.id === generationId);
        return index2 >= 0 ? index2 + 1 : 0;
      }
      async initializeFromDatabase() {
        try {
          console.log("Initializing queue from database...");
          await this.expireOldPendingJobs();
          const pendingGenerations = await storage.getPendingGenerations();
          console.log(`Found ${pendingGenerations.length} pending generations in database`);
          for (const generation of pendingGenerations) {
            console.log(`Loading generation ${generation.id} (status: ${generation.status}) into queue`);
            if (generation.metadata) {
              const metadata = typeof generation.metadata === "string" ? JSON.parse(generation.metadata) : generation.metadata;
              const formData = metadata?.formData || {};
              const queueItem = {
                id: generation.id,
                userId: generation.userId,
                recipeId: generation.recipeId,
                formData,
                priority: 1,
                createdAt: new Date(generation.createdAt)
              };
              this.queue.push(queueItem);
              console.log(`Added generation ${generation.id} to queue`);
            } else {
              console.log(`Skipping generation ${generation.id} - no metadata`);
            }
          }
          this.queue.sort((a, b) => a.priority - b.priority || a.createdAt.getTime() - b.createdAt.getTime());
          console.log(`Queue initialized with ${this.queue.length} items`);
          this.startAsyncJobPolling();
          if (this.queue.length > 0 && !this.processing) {
            console.log("Queue has items, starting processing");
            this.startProcessing();
          } else {
            console.log("No items in queue or already processing");
          }
        } catch (error) {
          console.error("Error initializing queue from database:", error);
        }
      }
      /**
       * Expire old pending jobs that are older than 1 hour
       */
      async expireOldPendingJobs() {
        try {
          const oneHourAgo = new Date(Date.now() - 60 * 60 * 1e3);
          const oldPendingJobs = await storage.getOldPendingGenerations(oneHourAgo);
          console.log(`Found ${oldPendingJobs.length} old pending jobs to expire`);
          for (const job of oldPendingJobs) {
            console.log(`Expiring old pending job ${job.id} (created at ${job.createdAt})`);
            await storage.failGeneration(
              job.id,
              "Your request took too long to process and has been cancelled. Credits have been refunded.",
              {
                error: "Job expired",
                reason: "Job expired after 1 hour in pending status",
                expiredAt: (/* @__PURE__ */ new Date()).toISOString()
              },
              true
              // Refund credits
            );
          }
        } catch (error) {
          console.error("Error expiring old pending jobs:", error);
        }
      }
      broadcastQueueUpdate(userId) {
        if (typeof global.broadcastToUser === "function") {
          global.broadcastToUser(userId, {
            type: "queue_update",
            data: {
              queueLength: this.queue.length,
              processing: this.processing,
              currentlyProcessing: this.currentlyProcessing?.id || null
            }
          });
        }
      }
      async processWorkflowComponents(recipe, processedPrompt, components) {
        console.log("Processing workflow components:", components);
        const { falService: falService2 } = await Promise.resolve().then(() => (init_fal_service(), fal_service_exports));
        let imageResult = null;
        let videoResult = null;
        for (const component of components) {
          if (component.type === "image") {
            console.log(`Generating image with ${component.model} model...`);
            imageResult = await falService2.generateImage(
              processedPrompt,
              component.model,
              recipe.style || "cinematic"
            );
          } else if (component.type === "video" && imageResult) {
            console.log(`Generating video with ${component.model} using endpoint ${component.endpoint}...`);
            const videoPrompt = `${processedPrompt}, ${recipe.style || "cinematic"} movement, dreamlike motion, otherworldly transitions, smooth motion, natural movement, high quality video animation`;
            if (component.endpoint) {
              console.log(`Using specified endpoint: ${component.endpoint}`);
              videoResult = await falService2.generateImageToVideo(
                imageResult.images[0].url,
                videoPrompt
              );
            } else {
              throw new Error(`No endpoint specified for video component: ${component.model}`);
            }
            return {
              videoUrl: videoResult.video?.url || null,
              imageUrl: imageResult.images[0].url,
              s3Key: videoResult.video?.url?.split("/").pop() || "video_unknown",
              assetId: videoResult.video?.url?.split("/").pop()?.split(".")[0] || "video_unknown",
              metadata: {
                model: recipe.model,
                provider: `fal-${component.model}`,
                prompt: processedPrompt,
                videoPrompt,
                originalPrompt: processedPrompt,
                style: recipe.style,
                baseImage: imageResult.images[0],
                generationType: "component_workflow",
                workflowComponents: components,
                formData: this.currentlyProcessing?.formData || {}
              }
            };
          }
        }
        if (imageResult && !videoResult) {
          return {
            imageUrl: imageResult.images[0].url,
            s3Key: imageResult.images[0].url.split("/").pop() || "image_unknown",
            assetId: imageResult.images[0].url.split("/").pop()?.split(".")[0] || "image_unknown",
            metadata: {
              model: recipe.model,
              provider: "fal-flux",
              prompt: processedPrompt,
              generationType: "component_workflow",
              workflowComponents: components,
              formData: this.currentlyProcessing?.formData || {}
            }
          };
        }
        throw new Error("No valid workflow components processed");
      }
      formatWorkflowResult(workflowResult, formData = {}) {
        console.log("Formatting workflow result:", workflowResult);
        if (!workflowResult || !workflowResult.data) {
          throw new Error("Invalid workflow result");
        }
        const { type, data, metadata } = workflowResult;
        if (type === "video") {
          const videoUrl = data.video?.url || data.url || data.cdnUrl;
          if (!videoUrl) {
            throw new Error("No video URL found in workflow result");
          }
          return {
            videoUrl,
            s3Key: data.s3Key || metadata?.s3Key || videoUrl.split("/").pop() || "video_unknown",
            assetId: data.assetId || metadata?.assetId || videoUrl.split("/").pop()?.split(".")[0] || "video_unknown",
            falJobId: metadata?.jobId,
            metadata: {
              model: metadata?.model || "unknown",
              provider: metadata?.endpoint || "fal",
              prompt: metadata?.prompt || "",
              generationType: "text_to_video",
              serviceId: metadata?.serviceId,
              aspectRatio: metadata?.aspectRatio,
              duration: metadata?.duration,
              quality: metadata?.quality,
              workflowComponents: metadata?.workflowComponents,
              formData,
              transferredToS3: metadata?.transferredToS3 || false,
              cdnUrl: metadata?.cdnUrl,
              originalUrl: data.video?.originalUrl || data.originalUrl
            }
          };
        } else if (type === "image") {
          const imageUrl = data.images?.[0]?.url || data.url || data.cdnUrl;
          if (!imageUrl) {
            throw new Error("No image URL found in workflow result");
          }
          return {
            imageUrl,
            s3Key: data.s3Key || metadata?.s3Key || imageUrl.split("/").pop() || "image_unknown",
            assetId: data.assetId || metadata?.assetId || imageUrl.split("/").pop()?.split(".")[0] || "image_unknown",
            falJobId: metadata?.jobId,
            metadata: {
              model: metadata?.model || "unknown",
              provider: metadata?.endpoint || "fal",
              prompt: metadata?.prompt || "",
              generationType: "image",
              workflowComponents: metadata?.workflowComponents,
              formData,
              transferredToS3: metadata?.transferredToS3 || false,
              cdnUrl: metadata?.cdnUrl,
              originalUrl: data.images?.[0]?.originalUrl || data.originalUrl
            }
          };
        }
        throw new Error(`Unsupported workflow result type: ${type}`);
      }
      broadcastGenerationUpdate(userId, generationId, status, data) {
        const message = {
          type: "generation_update",
          userId,
          generationId,
          status,
          data
        };
        console.log("Broadcasting generation update:", message);
      }
      /**
       * Start the sinusoidal polling for processing jobs
       * Schedule: 15s, 30s, 60s, 30s, 15s, repeat
       */
      startAsyncJobPolling() {
        if (this.asyncPollingInterval) {
          clearInterval(this.asyncPollingInterval);
        }
        let checkCount = 0;
        const intervals = [15e3, 3e4, 6e4, 3e4, 15e3];
        this.asyncPollingInterval = setInterval(async () => {
          const interval = intervals[checkCount % intervals.length];
          console.log(`Processing job polling cycle ${checkCount + 1}, interval: ${interval}ms`);
          await this.pollProcessingJobs();
          checkCount++;
        }, 15e3);
        console.log("Started processing job polling with sinusoidal schedule");
      }
      /**
       * Poll all processing jobs for status updates
       */
      async pollProcessingJobs() {
        try {
          const processingGenerations = await db.select().from(generations).where(
            and2(
              eq2(generations.status, "processing"),
              isNotNull(generations.falJobId)
            )
          );
          if (processingGenerations.length === 0) {
            return;
          }
          console.log(`Polling ${processingGenerations.length} processing jobs...`);
          for (const generation of processingGenerations) {
            try {
              console.log(`Polling FAL job ${generation.falJobId} for generation ${generation.id}`);
              const jobStatus = await this.pollFalJobStatus(generation.falJobId);
              if (jobStatus.status === "completed") {
                console.log(`FAL job ${generation.falJobId} completed, processing result...`);
                await this.handleJobCompletion(generation.id, jobStatus.result);
              } else if (jobStatus.status === "failed") {
                console.log(`FAL job ${generation.falJobId} failed`);
                await this.handleJobFailure(generation.id, generation.falJobId);
              } else {
                console.log(`FAL job ${generation.falJobId} still processing`);
              }
            } catch (error) {
              console.error(`Error polling FAL job ${generation.falJobId}:`, error);
            }
          }
        } catch (error) {
          if (error.message?.includes("Connection terminated") || error.message?.includes("connection timeout") || error.message?.includes("EADDRNOTAVAIL") || error.message?.includes("ECONNRESET") || "code" in error && (error.code === "EADDRNOTAVAIL" || error.code === "ECONNRESET")) {
            console.log(`Database connectivity issue detected during job polling: ${error.message}`);
            return;
          }
          console.error("Error polling processing jobs:", error);
        }
      }
      /**
       * Poll FAL API for job status (same as job recovery service)
       */
      async pollFalJobStatus(jobId) {
        try {
          const fal3 = await import("@fal-ai/serverless-client");
          let generation;
          try {
            generation = await db.select({ metadata: generations.metadata }).from(generations).where(eq2(generations.falJobId, jobId)).limit(1);
          } catch (dbError) {
            if (dbError.message?.includes("Connection terminated") || dbError.message?.includes("connection timeout") || dbError.message?.includes("EADDRNOTAVAIL") || dbError.message?.includes("ECONNRESET") || "code" in dbError && (dbError.code === "EADDRNOTAVAIL" || dbError.code === "ECONNRESET")) {
              console.log(`Database connectivity issue for job ${jobId}: ${dbError.message}`);
              return { status: "processing" };
            }
            throw dbError;
          }
          if (!generation.length) {
            console.log(`No generation found for FAL job ${jobId}`);
            return { status: "failed", error: "Generation not found" };
          }
          const metadata = generation[0].metadata;
          const endpoint = metadata?.endpoint || "fal-ai/flux/dev";
          console.log(`Checking FAL job ${jobId} on endpoint ${endpoint}`);
          const status = await fal3.queue.status(endpoint, { requestId: jobId });
          const statusValue = status.status;
          if (statusValue === "COMPLETED") {
            const result = await fal3.queue.result(endpoint, { requestId: jobId });
            return { status: "completed", result };
          } else if (statusValue === "FAILED" || statusValue === "ERROR") {
            return { status: "failed", error: JSON.stringify(status) };
          } else if (statusValue === "IN_PROGRESS" || statusValue === "IN_QUEUE") {
            return { status: "processing" };
          } else {
            console.log(`Unknown FAL status for job ${jobId}: ${statusValue}`);
            return { status: "processing" };
          }
        } catch (error) {
          if (error.message?.includes("connectivity") || error.message?.includes("network") || error.message?.includes("timeout") || error.message?.includes("ECONNRESET") || error.message?.includes("ENOTFOUND")) {
            console.log(`Connectivity issue detected for job ${jobId}: ${error.message}`);
            return { status: "processing" };
          }
          if (error.message?.includes("IN_PROGRESS") || error.message?.includes("IN_QUEUE")) {
            return { status: "processing" };
          }
          console.error(`Error polling FAL job ${jobId}:`, error);
          return { status: "failed", error: error.message };
        }
      }
      /**
       * Handle completion of FAL job
       */
      async handleJobCompletion(generationId, result) {
        try {
          await this.handleRecoveredJobCompletion(generationId, result);
          console.log(`Successfully completed FAL job for generation ${generationId}`);
        } catch (error) {
          console.error(`Error handling job completion for generation ${generationId}:`, error);
          await this.handleJobFailure(generationId, "");
        }
      }
      /**
       * Handle failure of FAL job
       */
      async handleJobFailure(generationId, jobId) {
        try {
          await storage.failGeneration(
            generationId,
            "Your generation failed to complete. Credits have been refunded.",
            {
              error: "FAL job failed",
              jobId,
              failedAt: (/* @__PURE__ */ new Date()).toISOString()
            },
            true
            // Refund credits
          );
          const generation = await storage.getGenerationById(generationId);
          if (generation) {
            this.broadcastGenerationUpdate(generation.userId, generationId, "failed");
          }
        } catch (error) {
          console.error(`Error handling job failure for generation ${generationId}:`, error);
        }
      }
      // Handle job completion from recovery service
      async handleRecoveredJobCompletion(generationId, result) {
        try {
          console.log(`Handling recovered job completion for generation ${generationId}`);
          console.log(`Raw FAL result:`, JSON.stringify(result, null, 2));
          const generation = await storage.getGenerationById(generationId);
          if (!generation) {
            throw new Error(`Generation ${generationId} not found`);
          }
          const metadata = generation.metadata;
          const endpoint = metadata?.endpoint || "fal-ai/flux/dev";
          let workflowResult;
          if (result.video?.url) {
            workflowResult = {
              type: "video",
              data: {
                video: {
                  url: result.video.url,
                  content_type: result.video.content_type,
                  file_name: result.video.file_name,
                  file_size: result.video.file_size
                }
              },
              metadata: {
                model: metadata?.model || "unknown",
                endpoint,
                jobId: generation.falJobId,
                prompt: metadata?.prompt || "",
                serviceId: metadata?.serviceId,
                finalJobId: generation.falJobId
              }
            };
          } else if (result.images?.[0]?.url) {
            workflowResult = {
              type: "image",
              data: {
                images: result.images
              },
              metadata: {
                model: metadata?.model || "unknown",
                endpoint,
                jobId: generation.falJobId,
                prompt: metadata?.prompt || "",
                serviceId: metadata?.serviceId,
                finalJobId: generation.falJobId
              }
            };
          } else {
            throw new Error(`Unsupported FAL result structure: ${JSON.stringify(result)}`);
          }
          const formData = metadata?.formData || {};
          const formattedResult = this.formatWorkflowResult(workflowResult, formData);
          if (!formattedResult.metadata.transferredToS3) {
            console.log(`Transferring media to S3 for recovered job ${generationId}...`);
            const mediaType = workflowResult.type === "video" ? "video" : "image";
            const remoteUrl = workflowResult.type === "video" ? result.video.url : result.images[0].url;
            const transferResult = await mediaTransferService.transferMedia({
              remoteUrl,
              mediaType
            });
            if (transferResult.success) {
              formattedResult.metadata.transferredToS3 = true;
              formattedResult.metadata.cdnUrl = transferResult.cdnUrl;
              formattedResult.metadata.s3Key = transferResult.s3Key;
              formattedResult.metadata.assetId = transferResult.assetId;
              if (workflowResult.type === "video") {
                formattedResult.videoUrl = transferResult.cdnUrl;
              } else {
                formattedResult.imageUrl = transferResult.cdnUrl;
              }
              console.log(`Media transfer successful: ${transferResult.cdnUrl}`);
            } else {
              console.error(`Media transfer failed:`, transferResult.error);
            }
          }
          if (formattedResult.shortId && formattedResult.secureUrl) {
            await storage.updateGenerationWithSecureAsset(
              generationId,
              "completed",
              formattedResult.secureUrl,
              formattedResult.s3Key,
              formattedResult.assetId,
              formattedResult.shortId,
              formattedResult.metadata
            );
          } else {
            const resultUrl = formattedResult.videoUrl || formattedResult.imageUrl;
            if (!resultUrl) {
              throw new Error("No video or image URL in recovered result");
            }
            await storage.updateGenerationWithAsset(
              generationId,
              "completed",
              resultUrl,
              formattedResult.s3Key,
              formattedResult.assetId,
              formattedResult.metadata
            );
          }
          if (formattedResult.videoUrl) {
            console.log(`\u{1F3AC} Starting async thumbnail generation for recovered video generation ${generationId}`);
            const { thumbnailService: thumbnailService2 } = await Promise.resolve().then(() => (init_thumbnail_service(), thumbnail_service_exports));
            thumbnailService2.generateThumbnailAsync({
              generationId,
              videoUrl: formattedResult.videoUrl,
              s3Key: formattedResult.s3Key,
              assetId: formattedResult.assetId
            });
          }
          console.log(`Successfully completed recovered generation ${generationId}`);
        } catch (error) {
          console.error(`Error handling recovered job completion for generation ${generationId}:`, error);
          throw error;
        }
      }
    };
    generationQueue = new GenerationQueue();
    generationQueue.initializeFromDatabase();
  }
});

// server/service-backlog-retain-minimum.ts
var service_backlog_retain_minimum_exports = {};
__export(service_backlog_retain_minimum_exports, {
  BacklogRetainMinimumService: () => BacklogRetainMinimumService,
  backlogRetainMinimumService: () => backlogRetainMinimumService
});
import { config as config3 } from "dotenv";
import { Pool as Pool2 } from "pg";
import { drizzle as drizzle2 } from "drizzle-orm/node-postgres";
import { eq as eq3, and as and3, sql as sql2, lt as lt2 } from "drizzle-orm";
var MINIMUM_REQUIRED_GENERATIONS, SYSTEM_BACKLOG_USER_ID, BacklogRetainMinimumService, backlogRetainMinimumService;
var init_service_backlog_retain_minimum = __esm({
  "server/service-backlog-retain-minimum.ts"() {
    "use strict";
    init_schema();
    init_types();
    config3();
    MINIMUM_REQUIRED_GENERATIONS = 3;
    SYSTEM_BACKLOG_USER_ID = "system_backlog";
    BacklogRetainMinimumService = class {
      pool;
      db;
      constructor() {
        this.pool = new Pool2({ connectionString: process.env.DATABASE_URL });
        this.db = drizzle2({ client: this.pool });
      }
      /**
       * Main service method to maintain minimum backlog for all active recipes
       */
      async maintainBacklog() {
        console.log("\u{1F504} Starting backlog maintenance service...");
        try {
          await this.checkAndRunCleanup();
          const activeRecipes = await this.getActiveRecipes();
          console.log(`\u{1F4CB} Found ${activeRecipes.length} active recipes`);
          const backlogStatuses = await this.checkBacklogStatus(activeRecipes);
          await this.generateMissingBacklogVideos(backlogStatuses);
          console.log("\u2705 Backlog maintenance completed");
        } catch (error) {
          console.error("\u274C Error in backlog maintenance:", error);
          throw error;
        }
      }
      /**
       * Initialize the service (run once on server start)
       */
      async initialize() {
        console.log("\u{1F680} Initializing backlog maintenance service...");
        try {
          await this.runInitialCleanup();
          console.log("\u2705 Backlog maintenance service initialized");
        } catch (error) {
          console.error("\u274C Error initializing backlog maintenance service:", error);
        }
      }
      /**
       * Get all active recipes from the database
       */
      async getActiveRecipes() {
        const result = await this.db.select().from(recipes).where(eq3(recipes.isActive, true));
        return result;
      }
      /**
       * Check the current backlog status for each recipe
       */
      async checkBacklogStatus(activeRecipes) {
        const statuses = [];
        for (const recipe of activeRecipes) {
          const currentBacklogCount = await this.getBacklogGenerationCount(recipe.id);
          const needsGeneration = currentBacklogCount < MINIMUM_REQUIRED_GENERATIONS;
          const generationsToCreate = needsGeneration ? MINIMUM_REQUIRED_GENERATIONS - currentBacklogCount : 0;
          statuses.push({
            recipeId: recipe.id,
            recipeName: recipe.name,
            currentBacklogCount,
            requiredCount: MINIMUM_REQUIRED_GENERATIONS,
            needsGeneration,
            generationsToCreate
          });
          console.log(`\u{1F4CA} Recipe "${recipe.name}" (ID: ${recipe.id}): ${currentBacklogCount}/${MINIMUM_REQUIRED_GENERATIONS} backlog videos`);
        }
        return statuses;
      }
      /**
       * Count completed backlog generations for a specific recipe
       */
      async getBacklogGenerationCount(recipeId) {
        const result = await this.db.select().from(generations).where(
          and3(
            eq3(generations.recipeId, recipeId),
            eq3(generations.userId, SYSTEM_BACKLOG_USER_ID),
            eq3(generations.status, "completed")
          )
        );
        return result.length;
      }
      /**
       * Generate missing backlog videos for recipes that need them
       */
      async generateMissingBacklogVideos(statuses) {
        const recipesNeedingGeneration = statuses.filter((s) => s.needsGeneration);
        if (recipesNeedingGeneration.length === 0) {
          console.log("\u2705 All recipes have sufficient backlog videos");
          return;
        }
        console.log(`\u{1F3AC} Generating backlog videos for ${recipesNeedingGeneration.length} recipes...`);
        for (const status of recipesNeedingGeneration) {
          console.log(`
\u{1F4DD} Processing recipe "${status.recipeName}" (ID: ${status.recipeId})`);
          console.log(`   Need to generate ${status.generationsToCreate} videos`);
          try {
            await this.generateBacklogVideosForRecipe(status);
            console.log(`   \u2705 Successfully queued ${status.generationsToCreate} backlog generations`);
          } catch (error) {
            console.error(`   \u274C Error generating backlog for recipe ${status.recipeId}:`, error);
          }
        }
      }
      /**
       * Generate backlog videos for a specific recipe
       */
      async generateBacklogVideosForRecipe(status) {
        const recipe = await this.getRecipeById(status.recipeId);
        if (!recipe) {
          throw new Error(`Recipe ${status.recipeId} not found`);
        }
        for (let i = 0; i < status.generationsToCreate; i++) {
          try {
            const formData = await this.generateWeightedFormData(recipe);
            const generation = await this.createBacklogGeneration(recipe, formData);
            console.log(`     Created backlog generation ${generation.id} with form data:`, formData);
            const { generationQueue: generationQueue2 } = await Promise.resolve().then(() => (init_queue_service(), queue_service_exports));
            await generationQueue2.addToQueue(generation, formData);
            console.log(`     \u2705 Added generation ${generation.id} to queue`);
            await new Promise((resolve) => setTimeout(resolve, 1e3));
          } catch (error) {
            console.error(`     \u274C Error creating backlog generation ${i + 1}:`, error);
          }
        }
      }
      /**
       * Generate weighted form data based on recipe usage summary
       */
      async generateWeightedFormData(recipe) {
        const summaryData = await this.getRecipeUsageSummary(recipe.id);
        if (!summaryData || Object.keys(summaryData).length === 0) {
          return this.generateRandomFormData(recipe);
        }
        const formData = {};
        for (const [fieldName, fieldData] of Object.entries(summaryData)) {
          if (typeof fieldData === "object" && fieldData !== null) {
            const options = this.extractOptionsFromSummary(fieldData);
            const selectedValue = this.selectWeightedOption(options);
            formData[fieldName] = selectedValue;
          }
        }
        return formData;
      }
      /**
       * Get recipe usage summary from database
       */
      async getRecipeUsageSummary(recipeId) {
        const result = await this.db.select().from(recipeUsageOptions).where(eq3(recipeUsageOptions.recipeId, recipeId)).limit(1);
        return result[0]?.summary || {};
      }
      /**
       * Extract options and their counts from summary data
       */
      extractOptionsFromSummary(fieldData) {
        const options = [];
        for (const [value, count2] of Object.entries(fieldData)) {
          if (value !== "total" && typeof count2 === "number") {
            options.push({
              value,
              weight: count2
            });
          }
        }
        return options;
      }
      /**
       * Select a value based on weighted probability distribution
       */
      selectWeightedOption(options) {
        if (options.length === 0) {
          return "default";
        }
        const totalWeight = options.reduce((sum, option) => sum + option.weight, 0);
        if (totalWeight === 0) {
          const randomIndex = Math.floor(Math.random() * options.length);
          return options[randomIndex].value;
        }
        const randomValue = Math.random() * totalWeight;
        let cumulativeWeight = 0;
        for (const option of options) {
          cumulativeWeight += option.weight;
          if (randomValue <= cumulativeWeight) {
            return option.value;
          }
        }
        return options[options.length - 1].value;
      }
      /**
       * Generate random form data when no summary data is available
       */
      generateRandomFormData(recipe) {
        const formData = {};
        const variableRegex = /\[([^\]]+)\]/g;
        const matches = recipe.prompt.match(variableRegex);
        if (matches) {
          for (const match of matches) {
            const variableName = match.slice(1, -1);
            const randomValue = this.generateRandomValueForVariable(variableName);
            formData[variableName] = randomValue;
          }
        }
        return formData;
      }
      /**
       * Generate a random value for a specific variable
       */
      generateRandomValueForVariable(variableName) {
        const lowerName = variableName.toLowerCase();
        if (lowerName.includes("style") || lowerName.includes("type")) {
          const styles = ["realistic", "cartoon", "anime", "photorealistic", "artistic"];
          return styles[Math.floor(Math.random() * styles.length)];
        }
        if (lowerName.includes("color") || lowerName.includes("colour")) {
          const colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "black", "white"];
          return colors[Math.floor(Math.random() * colors.length)];
        }
        if (lowerName.includes("size") || lowerName.includes("scale")) {
          const sizes = ["small", "medium", "large", "tiny", "huge"];
          return sizes[Math.floor(Math.random() * sizes.length)];
        }
        if (lowerName.includes("quality")) {
          const qualities = ["low", "medium", "high", "ultra"];
          return qualities[Math.floor(Math.random() * qualities.length)];
        }
        if (lowerName.includes("gender")) {
          const genders = ["male", "female", "neutral"];
          return genders[Math.floor(Math.random() * genders.length)];
        }
        if (lowerName.includes("age")) {
          const ages = ["young", "adult", "elderly", "child", "teen"];
          return ages[Math.floor(Math.random() * ages.length)];
        }
        return `option_${Math.floor(Math.random() * 10)}`;
      }
      /**
       * Verify that the system_backlog user exists
       */
      async verifySystemBacklogUser() {
        const result = await this.db.select().from(users).where(eq3(users.id, SYSTEM_BACKLOG_USER_ID)).limit(1);
        if (result.length === 0) {
          throw new Error(`System backlog user '${SYSTEM_BACKLOG_USER_ID}' not found. Please create this user first.`);
        }
        console.log(`\u2705 System backlog user verified: ${SYSTEM_BACKLOG_USER_ID}`);
      }
      /**
       * Get recipe by ID using direct database query
       */
      async getRecipeById(recipeId) {
        const result = await this.db.select().from(recipes).where(eq3(recipes.id, recipeId)).limit(1);
        return result[0];
      }
      /**
       * Create a backlog generation by routing through the normal build API flow
       */
      async createBacklogGeneration(recipe, formData) {
        console.log(`\u{1F504} Creating backlog generation for recipe ${recipe.id} using normal API flow`);
        console.log(`\u{1F4DD} Generated form data:`, formData);
        const { storage: storage2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
        const { processRecipePrompt: processRecipePrompt2 } = await Promise.resolve().then(() => (init_recipe_processor(), recipe_processor_exports));
        const { generateTagDisplayData: generateTagDisplayData2 } = await Promise.resolve().then(() => (init_recipe_processor(), recipe_processor_exports));
        const { validateRecipeFormData: validateRecipeFormData2 } = await Promise.resolve().then(() => (init_recipe_processor(), recipe_processor_exports));
        const validation = validateRecipeFormData2(recipe, formData);
        if (!validation.isValid) {
          throw new Error(`Invalid form data for backlog generation: ${JSON.stringify(validation.errors)}`);
        }
        const processedResult = processRecipePrompt2(recipe, formData);
        const finalPrompt = processedResult.prompt;
        const extractedVariables = processedResult.extractedVariables;
        const tagDisplayData = await generateTagDisplayData2(recipe, formData);
        console.log(`\u2705 Generated tagDisplayData:`, Object.keys(tagDisplayData));
        const generation = await storage2.createGeneration({
          userId: SYSTEM_BACKLOG_USER_ID,
          recipeId: recipe.id,
          prompt: finalPrompt,
          status: "pending",
          recipeTitle: recipe.name,
          creditsCost: 0,
          // No credits for system generations
          type: recipe.workflowType === "image_to_video" || recipe.workflowType === "text_to_video" ? "video" : "image",
          metadata: {
            formData,
            tagDisplayData,
            extractedVariables,
            workflowType: recipe.workflowType,
            videoGeneration: recipe.workflowType === "image_to_video" ? "minimax-hailuo-02-pro" : null,
            request_origin: AssetRequestOriginType.BACKLOG
          }
        }, void 0);
        console.log(`\u2705 Created backlog generation ${generation.id} with complete metadata`);
        return generation;
      }
      /**
       * Get current backlog statistics
       */
      async getBacklogStatistics() {
        const activeRecipes = await this.getActiveRecipes();
        const statuses = await this.checkBacklogStatus(activeRecipes);
        const totalRecipes = statuses.length;
        const recipesWithSufficientBacklog = statuses.filter((s) => !s.needsGeneration).length;
        const totalBacklogVideos = statuses.reduce((sum, s) => sum + s.currentBacklogCount, 0);
        const totalNeeded = statuses.reduce((sum, s) => sum + s.generationsToCreate, 0);
        return {
          totalRecipes,
          recipesWithSufficientBacklog,
          recipesNeedingBacklog: totalRecipes - recipesWithSufficientBacklog,
          totalBacklogVideos,
          totalNeeded,
          minimumRequired: MINIMUM_REQUIRED_GENERATIONS,
          recipeDetails: statuses
        };
      }
      /**
       * Get all backlog generations for admin panel
       */
      async getBacklogGenerations() {
        const result = await this.db.select({
          id: generations.id,
          shortId: generations.shortId,
          recipeId: generations.recipeId,
          recipeTitle: generations.recipeTitle,
          prompt: generations.prompt,
          status: generations.status,
          createdAt: generations.createdAt,
          updatedAt: generations.updatedAt,
          imageUrl: generations.imageUrl,
          videoUrl: generations.videoUrl,
          thumbnailUrl: generations.thumbnailUrl,
          metadata: generations.metadata
        }).from(generations).where(eq3(generations.userId, SYSTEM_BACKLOG_USER_ID)).orderBy(generations.createdAt);
        return result;
      }
      /**
       * Check if cleanup is needed and run it (on server start + every 24 hours)
       */
      async checkAndRunCleanup() {
        try {
          const lastCleanup = await this.getLastCleanupTime();
          const now = /* @__PURE__ */ new Date();
          const hoursSinceLastCleanup = (now.getTime() - lastCleanup.getTime()) / (1e3 * 60 * 60);
          if (hoursSinceLastCleanup >= 24) {
            console.log("\u{1F9F9} Running scheduled backlog cleanup...");
            await this.cleanupFailedGenerations();
            await this.updateLastCleanupTime();
          } else {
            const hoursRemaining = 24 - hoursSinceLastCleanup;
            console.log(`\u23F0 Next cleanup in ${hoursRemaining.toFixed(1)} hours`);
          }
        } catch (error) {
          console.error("\u274C Error checking cleanup schedule:", error);
        }
      }
      /**
       * Run cleanup immediately on server start (regardless of last cleanup time)
       */
      async runInitialCleanup() {
        try {
          console.log("\u{1F680} Running initial backlog cleanup on server start...");
          await this.cleanupFailedGenerations();
          await this.updateLastCleanupTime();
          console.log("\u2705 Initial cleanup completed");
        } catch (error) {
          console.error("\u274C Error during initial cleanup:", error);
        }
      }
      /**
       * Get the last time cleanup was run
       */
      async getLastCleanupTime() {
        try {
          const result = await this.db.select().from(generations).where(
            and3(
              eq3(generations.userId, SYSTEM_BACKLOG_USER_ID),
              eq3(generations.metadata, { request_origin: AssetRequestOriginType.BACKLOG, cleanupRun: true })
            )
          ).orderBy(generations.updatedAt).limit(1);
          if (result.length > 0) {
            return result[0].updatedAt;
          }
        } catch (error) {
          console.error("\u274C Error getting last cleanup time:", error);
        }
        return new Date(Date.now() - 25 * 60 * 60 * 1e3);
      }
      /**
       * Update the last cleanup time
       */
      async updateLastCleanupTime() {
        try {
          await this.db.insert(generations).values({
            userId: SYSTEM_BACKLOG_USER_ID,
            recipeId: 1,
            // Use a valid recipe ID (1 is usually the first recipe)
            prompt: "Backlog cleanup completed",
            status: "completed",
            recipeTitle: "System Maintenance",
            creditsCost: 0,
            type: "system",
            metadata: {
              request_origin: AssetRequestOriginType.BACKLOG,
              cleanupRun: true,
              cleanupTimestamp: (/* @__PURE__ */ new Date()).toISOString()
            },
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          });
        } catch (error) {
          console.error("\u274C Error updating cleanup time:", error);
        }
      }
      /**
       * Clean up failed generations from the backlog account
       */
      async cleanupFailedGenerations() {
        try {
          const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1e3);
          const maxFailedPerRecipe = 10;
          console.log(`\u{1F9F9} Cleaning up failed generations older than ${cutoffTime.toISOString()}`);
          const failedGenerations = await this.db.select({
            recipeId: generations.recipeId,
            count: sql2`count(*)::int`
          }).from(generations).where(
            and3(
              eq3(generations.userId, SYSTEM_BACKLOG_USER_ID),
              eq3(generations.status, "failed"),
              lt2(generations.updatedAt, cutoffTime)
            )
          ).groupBy(generations.recipeId);
          let totalRemoved = 0;
          for (const recipe of failedGenerations) {
            const failedCount = recipe.count;
            const toRemove = Math.max(0, failedCount - maxFailedPerRecipe);
            if (toRemove > 0) {
              console.log(`   \u{1F9F9} Recipe ${recipe.recipeId}: removing ${toRemove} old failed generations`);
              const result = await this.db.delete(generations).where(
                and3(
                  eq3(generations.recipeId, recipe.recipeId),
                  eq3(generations.userId, SYSTEM_BACKLOG_USER_ID),
                  eq3(generations.status, "failed"),
                  lt2(generations.updatedAt, cutoffTime)
                )
              ).returning({ id: generations.id });
              totalRemoved += result.length;
            }
          }
          if (totalRemoved > 0) {
            console.log(`\u2705 Cleanup completed: removed ${totalRemoved} failed generations`);
            await this.logCleanupOperation(totalRemoved);
          } else {
            console.log("\u2728 No failed generations to clean up");
          }
        } catch (error) {
          console.error("\u274C Error during cleanup:", error);
          throw error;
        }
      }
      /**
       * Log cleanup operation for audit purposes
       */
      async logCleanupOperation(removedCount) {
        try {
          await this.db.insert(generations).values({
            userId: SYSTEM_BACKLOG_USER_ID,
            recipeId: 1,
            // Use a valid recipe ID
            prompt: `Backlog cleanup: removed ${removedCount} failed generations`,
            status: "completed",
            recipeTitle: "System Maintenance",
            creditsCost: 0,
            type: "system",
            metadata: {
              request_origin: AssetRequestOriginType.BACKLOG,
              cleanupLog: true,
              removedCount,
              cleanupTimestamp: (/* @__PURE__ */ new Date()).toISOString()
            },
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          });
        } catch (error) {
          console.error("\u274C Error logging cleanup operation:", error);
        }
      }
    };
    backlogRetainMinimumService = new BacklogRetainMinimumService();
  }
});

// server/service-backlog-cleanup.ts
var service_backlog_cleanup_exports = {};
__export(service_backlog_cleanup_exports, {
  BacklogCleanupService: () => BacklogCleanupService,
  backlogCleanupService: () => backlogCleanupService
});
import { config as config4 } from "dotenv";
import { Pool as Pool3 } from "pg";
import { drizzle as drizzle3 } from "drizzle-orm/node-postgres";
import { eq as eq4, and as and4, lt as lt3, sql as sql3 } from "drizzle-orm";
var SYSTEM_BACKLOG_USER_ID2, CLEANUP_AGE_HOURS, MAX_FAILED_GENERATIONS_PER_RECIPE, BacklogCleanupService, backlogCleanupService;
var init_service_backlog_cleanup = __esm({
  "server/service-backlog-cleanup.ts"() {
    "use strict";
    init_schema();
    config4();
    SYSTEM_BACKLOG_USER_ID2 = "system_backlog";
    CLEANUP_AGE_HOURS = 24;
    MAX_FAILED_GENERATIONS_PER_RECIPE = 10;
    BacklogCleanupService = class {
      pool;
      db;
      constructor() {
        this.pool = new Pool3({ connectionString: process.env.DATABASE_URL });
        this.db = drizzle3({ client: this.pool });
      }
      /**
       * Main cleanup method - removes failed generations from backlog account
       * This prevents accumulation of failed generations during service interruptions
       */
      async cleanupFailedBacklogGenerations() {
        console.log("\u{1F9F9} Starting backlog cleanup service...");
        try {
          await this.verifySystemBacklogUser();
          const stats = await this.getCleanupStats();
          await this.performCleanup(stats);
          const finalStats = await this.getCleanupStats();
          console.log("\u2705 Backlog cleanup completed");
          console.log(`\u{1F4CA} Cleanup Summary:`);
          console.log(`   - Total failed generations: ${stats.totalFailedGenerations}`);
          console.log(`   - Cleaned up: ${stats.cleanedUpGenerations}`);
          console.log(`   - Recipes affected: ${stats.recipesAffected}`);
          return finalStats;
        } catch (error) {
          console.error("\u274C Error in backlog cleanup:", error);
          throw error;
        } finally {
          await this.pool.end();
        }
      }
      /**
       * Verify that the system_backlog user exists
       */
      async verifySystemBacklogUser() {
        const [user] = await this.db.select().from(users).where(eq4(users.id, SYSTEM_BACKLOG_USER_ID2));
        if (!user) {
          throw new Error(`System backlog user '${SYSTEM_BACKLOG_USER_ID2}' not found. Please create this user first.`);
        }
        console.log(`\u2705 System backlog user verified: ${SYSTEM_BACKLOG_USER_ID2}`);
      }
      /**
       * Get statistics about failed generations that need cleanup
       */
      async getCleanupStats() {
        const cutoffTime = new Date(Date.now() - CLEANUP_AGE_HOURS * 60 * 60 * 1e3);
        const failedGenerations = await this.db.select({
          recipeId: generations.recipeId,
          count: sql3`count(*)::int`,
          recipeName: sql3`(
          SELECT name FROM recipes WHERE id = generations.recipe_id
        )`
        }).from(generations).where(
          and4(
            eq4(generations.userId, SYSTEM_BACKLOG_USER_ID2),
            eq4(generations.status, "failed"),
            lt3(generations.updatedAt, cutoffTime)
          )
        ).groupBy(generations.recipeId);
        let totalFailedGenerations = 0;
        let totalCleanedUpGenerations = 0;
        const cleanupDetails = [];
        for (const recipe of failedGenerations) {
          const failedCount = recipe.count;
          totalFailedGenerations += failedCount;
          const toCleanup = Math.max(0, failedCount - MAX_FAILED_GENERATIONS_PER_RECIPE);
          const toKeep = Math.min(failedCount, MAX_FAILED_GENERATIONS_PER_RECIPE);
          totalCleanedUpGenerations += toCleanup;
          cleanupDetails.push({
            recipeId: recipe.recipeId,
            recipeName: recipe.recipeName || "Unknown Recipe",
            failedCount,
            cleanedCount: toCleanup,
            keptCount: toKeep
          });
        }
        return {
          totalFailedGenerations,
          cleanedUpGenerations: totalCleanedUpGenerations,
          recipesAffected: cleanupDetails.length,
          cleanupDetails
        };
      }
      /**
       * Perform the actual cleanup of failed generations
       */
      async performCleanup(stats) {
        if (stats.cleanedUpGenerations === 0) {
          console.log("\u2728 No failed generations to clean up");
          return;
        }
        const cutoffTime = new Date(Date.now() - CLEANUP_AGE_HOURS * 60 * 60 * 1e3);
        console.log(`\u{1F9F9} Cleaning up ${stats.cleanedUpGenerations} failed generations...`);
        for (const detail of stats.cleanupDetails) {
          if (detail.cleanedCount > 0) {
            await this.cleanupRecipeFailedGenerations(detail.recipeId, detail.cleanedCount, cutoffTime);
          }
        }
      }
      /**
       * Clean up failed generations for a specific recipe
       * Keeps the most recent failed generations and removes the oldest ones
       */
      async cleanupRecipeFailedGenerations(recipeId, countToRemove, cutoffTime) {
        console.log(`   \u{1F9F9} Cleaning up ${countToRemove} failed generations for recipe ${recipeId}`);
        const result = await this.db.delete(generations).where(
          and4(
            eq4(generations.recipeId, recipeId),
            eq4(generations.userId, SYSTEM_BACKLOG_USER_ID2),
            eq4(generations.status, "failed"),
            lt3(generations.updatedAt, cutoffTime)
          )
        ).returning({ id: generations.id });
        console.log(`   \u2705 Removed ${result.length} failed generations for recipe ${recipeId}`);
      }
      /**
       * Get current backlog status including failed generations
       */
      async getBacklogStatus() {
        const [totalCount] = await this.db.select({ count: sql3`count(*)::int` }).from(generations).where(eq4(generations.userId, SYSTEM_BACKLOG_USER_ID2));
        const [completedCount] = await this.db.select({ count: sql3`count(*)::int` }).from(generations).where(
          and4(
            eq4(generations.userId, SYSTEM_BACKLOG_USER_ID2),
            eq4(generations.status, "completed")
          )
        );
        const [failedCount] = await this.db.select({ count: sql3`count(*)::int` }).from(generations).where(
          and4(
            eq4(generations.userId, SYSTEM_BACKLOG_USER_ID2),
            eq4(generations.status, "failed")
          )
        );
        const [pendingCount] = await this.db.select({ count: sql3`count(*)::int` }).from(generations).where(
          and4(
            eq4(generations.userId, SYSTEM_BACKLOG_USER_ID2),
            eq4(generations.status, "pending")
          )
        );
        const [processingCount] = await this.db.select({ count: sql3`count(*)::int` }).from(generations).where(
          and4(
            eq4(generations.userId, SYSTEM_BACKLOG_USER_ID2),
            eq4(generations.status, "processing")
          )
        );
        const recipesWithFailed = await this.db.select({
          recipeId: generations.recipeId,
          recipeName: sql3`(
          SELECT name FROM recipes WHERE id = generations.recipe_id
        )`,
          failedCount: sql3`count(*)::int`,
          oldestFailedAge: sql3`(
          SELECT EXTRACT(EPOCH FROM (NOW() - updated_at))::int || ' seconds ago'
          FROM generations g2 
          WHERE g2.recipe_id = generations.recipe_id 
            AND g2.user_id = ${SYSTEM_BACKLOG_USER_ID2}
            AND g2.status = 'failed'
          ORDER BY updated_at ASC 
          LIMIT 1
        )`
        }).from(generations).where(
          and4(
            eq4(generations.userId, SYSTEM_BACKLOG_USER_ID2),
            eq4(generations.status, "failed")
          )
        ).groupBy(generations.recipeId).orderBy(sql3`count(*) DESC`);
        return {
          totalGenerations: totalCount?.count || 0,
          completedGenerations: completedCount?.count || 0,
          failedGenerations: failedCount?.count || 0,
          pendingGenerations: pendingCount?.count || 0,
          processingGenerations: processingCount?.count || 0,
          recipesWithFailedGenerations: recipesWithFailed.map((r) => ({
            recipeId: r.recipeId,
            recipeName: r.recipeName || "Unknown Recipe",
            failedCount: r.failedCount,
            oldestFailedAge: r.oldestFailedAge
          }))
        };
      }
      /**
       * Emergency cleanup - removes ALL failed generations regardless of age
       * Use this only when there's a critical accumulation of failed generations
       */
      async emergencyCleanup() {
        console.log("\u{1F6A8} Starting EMERGENCY backlog cleanup...");
        try {
          await this.verifySystemBacklogUser();
          const [failedCount] = await this.db.select({ count: sql3`count(*)::int` }).from(generations).where(
            and4(
              eq4(generations.userId, SYSTEM_BACKLOG_USER_ID2),
              eq4(generations.status, "failed")
            )
          );
          if (failedCount?.count === 0) {
            console.log("\u2728 No failed generations to clean up");
            return { removedCount: 0, recipesAffected: 0 };
          }
          const [recipeCount] = await this.db.select({ count: sql3`count(DISTINCT recipe_id)::int` }).from(generations).where(
            and4(
              eq4(generations.userId, SYSTEM_BACKLOG_USER_ID2),
              eq4(generations.status, "failed")
            )
          );
          const result = await this.db.delete(generations).where(
            and4(
              eq4(generations.userId, SYSTEM_BACKLOG_USER_ID2),
              eq4(generations.status, "failed")
            )
          ).returning({ id: generations.id });
          console.log(`\u{1F6A8} Emergency cleanup completed: removed ${result.length} failed generations from ${recipeCount?.count || 0} recipes`);
          return {
            removedCount: result.length,
            recipesAffected: recipeCount?.count || 0
          };
        } catch (error) {
          console.error("\u274C Error in emergency cleanup:", error);
          throw error;
        } finally {
          await this.pool.end();
        }
      }
    };
    backlogCleanupService = new BacklogCleanupService();
  }
});

// server/smart-generator.ts
var smart_generator_exports = {};
__export(smart_generator_exports, {
  SmartGenerator: () => SmartGenerator,
  smartGenerator: () => smartGenerator
});
import { createHash as createHash2 } from "crypto";
var SmartGenerator, smartGenerator;
var init_smart_generator = __esm({
  "server/smart-generator.ts"() {
    "use strict";
    init_storage();
    init_recipe_processor();
    SmartGenerator = class {
      /**
       * Generate a hash for recipe variables to enable fast lookup
       */
      generateVariablesHash(recipeVariables) {
        const sortedVariables = Object.keys(recipeVariables).sort().reduce((obj, key) => {
          obj[key] = recipeVariables[key];
          return obj;
        }, {});
        const jsonString = JSON.stringify(sortedVariables);
        return createHash2("sha256").update(jsonString).digest("hex");
      }
      /**
       * Check if a specific recipe + variables combination has a backlog entry
       */
      async checkBacklogAvailability(recipeId, recipeVariables) {
        const variablesHash = this.generateVariablesHash(recipeVariables);
        const backlogEntry = await storage.getBacklogVideoByRecipeAndHash(recipeId, variablesHash);
        if (!backlogEntry) {
          return {
            hasBacklogEntry: false,
            isUsed: false
          };
        }
        return {
          hasBacklogEntry: true,
          backlogVideoId: backlogEntry.id,
          isUsed: backlogEntry.isUsed
        };
      }
      /**
       * Get a random unused backlog video for a specific recipe (Flash generation)
       * This ensures the flash video is relevant to the recipe being used
       */
      async getRandomBacklogVideo(recipeId) {
        return await storage.getRandomUnusedBacklogVideo(recipeId);
      }
      /**
       * Main smart generation method - tries backlog first, falls back to normal generation
       */
      async generateSmart(options) {
        const { userId, recipeId, recipeVariables, creditsCost } = options;
        const recipe = await storage.getRecipeById(recipeId);
        if (!recipe) {
          return {
            success: false,
            requestId: 0,
            isFromBacklog: false,
            message: "Recipe not found"
          };
        }
        const variablesHash = this.generateVariablesHash(recipeVariables);
        const smartRequest = await storage.createSmartGenerationRequest({
          creatorId: userId,
          recipeId,
          recipeVariables,
          recipeVariablesHash: variablesHash,
          status: "pending",
          creditsCost: creditsCost || recipe.creditCost
        });
        try {
          const backlogEntry = await storage.getBacklogVideoByRecipeAndHash(recipeId, variablesHash);
          if (backlogEntry && !backlogEntry.isUsed) {
            await storage.markBacklogVideoAsUsed(backlogEntry.id, smartRequest.id);
            await storage.updateSmartGenerationRequest(smartRequest.id, {
              status: "completed",
              backlogVideoId: backlogEntry.id
            });
            return {
              success: true,
              requestId: smartRequest.id,
              backlogVideoId: backlogEntry.id,
              videoUrl: backlogEntry.videoUrl,
              thumbnailUrl: backlogEntry.thumbnailUrl || void 0,
              isFromBacklog: true,
              message: "Video generated instantly from backlog"
            };
          }
          await storage.updateSmartGenerationRequest(smartRequest.id, {
            status: "processing"
          });
          const processedResult = processRecipePrompt(recipe, recipeVariables);
          const finalPrompt = processedResult.prompt;
          const generation = await storage.createGeneration({
            userId,
            recipeId,
            prompt: finalPrompt,
            status: "pending",
            recipeTitle: recipe.name,
            creditsCost: creditsCost || recipe.creditCost,
            metadata: {
              formData: recipeVariables,
              smartRequestId: smartRequest.id,
              isSmartGeneration: true
            }
          }, options.sessionToken);
          await storage.updateSmartGenerationRequest(smartRequest.id, {
            generationId: generation.id
          });
          const { generationQueue: generationQueue2 } = await Promise.resolve().then(() => (init_queue_service(), queue_service_exports));
          await generationQueue2.addToQueue(generation, recipeVariables);
          return {
            success: true,
            requestId: smartRequest.id,
            generationId: generation.id,
            isFromBacklog: false,
            message: "Generation started - will be processed in queue"
          };
        } catch (error) {
          console.error("Error in smart generation:", error);
          await storage.updateSmartGenerationRequest(smartRequest.id, {
            status: "failed",
            failureReason: "Smart generation failed",
            errorDetails: { error: error instanceof Error ? error.message : "Unknown error" }
          });
          return {
            success: false,
            requestId: smartRequest.id,
            isFromBacklog: false,
            message: "Smart generation failed"
          };
        }
      }
      /**
       * Add a completed generation to the backlog for future reuse
       */
      async addToBacklog(generationId, recipeId, recipeVariables) {
        const generation = await storage.getGenerationById(generationId);
        if (!generation || generation.status !== "completed") {
          throw new Error("Generation not found or not completed");
        }
        const variablesHash = this.generateVariablesHash(recipeVariables);
        const existingEntry = await storage.getBacklogVideoByRecipeAndHash(recipeId, variablesHash);
        if (existingEntry) {
          console.log(`Backlog entry already exists for recipe ${recipeId} with hash ${variablesHash}`);
          return;
        }
        await storage.createBacklogVideo({
          recipeId,
          recipeVariables,
          recipeVariablesHash: variablesHash,
          generationId,
          videoUrl: generation.videoUrl || generation.secureUrl || "",
          thumbnailUrl: generation.thumbnailUrl,
          s3Key: generation.s3Key,
          assetId: generation.assetId,
          shortId: generation.shortId,
          secureUrl: generation.secureUrl,
          isUsed: false,
          metadata: generation.metadata
        });
        console.log(`Added generation ${generationId} to backlog for recipe ${recipeId}`);
      }
      /**
       * Background process to populate backlog with common recipe combinations
       */
      async populateBacklog(recipeId, commonCombinations) {
        const recipe = await storage.getRecipeById(recipeId);
        if (!recipe) {
          throw new Error(`Recipe ${recipeId} not found`);
        }
        console.log(`Starting backlog population for recipe ${recipeId} with ${commonCombinations.length} combinations`);
        for (const variables of commonCombinations) {
          try {
            const variablesHash = this.generateVariablesHash(variables);
            const existingEntry = await storage.getBacklogVideoByRecipeAndHash(recipeId, variablesHash);
            if (existingEntry) {
              console.log(`Backlog entry already exists for combination:`, variables);
              continue;
            }
            const processedResult = processRecipePrompt(recipe, variables);
            const finalPrompt = processedResult.prompt;
            console.log("[BACKLOG FINAL PROMPT]:", finalPrompt);
            const generation = await storage.createGeneration({
              userId: "system",
              // System user for backlog generations
              recipeId,
              prompt: finalPrompt,
              status: "pending",
              recipeTitle: recipe.name,
              creditsCost: 0,
              // No credits for system generations
              metadata: {
                formData: variables,
                request_origin: "backlog"
              }
            });
            const { generationQueue: generationQueue2 } = await Promise.resolve().then(() => (init_queue_service(), queue_service_exports));
            await generationQueue2.addToQueue(generation, variables);
            console.log(`Queued backlog generation ${generation.id} for combination:`, variables);
            await new Promise((resolve) => setTimeout(resolve, 1e3));
          } catch (error) {
            console.error(`Error queuing backlog generation for combination:`, variables, error);
          }
        }
      }
    };
    smartGenerator = new SmartGenerator();
  }
});

// server/index.ts
init_env();
import express4 from "express";

// server/routes.ts
init_storage();
import express2 from "express";
import session from "express-session";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import path3 from "path";

// server/unified-auth.ts
init_storage();
import { nanoid } from "nanoid";

// shared/user-types.ts
var USER_TYPES = {
  SYSTEM: 1,
  GUEST: 2,
  REGISTERED: 3
};
var USER_TYPE_LABELS = {
  [USER_TYPES.SYSTEM]: "System",
  [USER_TYPES.GUEST]: "Guest",
  [USER_TYPES.REGISTERED]: "Registered"
};

// shared/access-roles.ts
var ACCESS_ROLES = {
  USER: 1,
  TEST: 2,
  ADMIN: 3
};
var ACCESS_ROLE_LABELS = {
  [ACCESS_ROLES.USER]: "User",
  [ACCESS_ROLES.TEST]: "Test",
  [ACCESS_ROLES.ADMIN]: "Admin"
};

// server/unified-auth.ts
var DEBUG_CONFIG = {
  boundGuestId: process.env.DEV_BOUND_GUEST_ID,
  testUsers: [
    {
      id: "admin_debug",
      email: "admin@magicvidio.com",
      firstName: "Admin",
      lastName: "User",
      accountType: USER_TYPES.REGISTERED,
      accessRole: ACCESS_ROLES.ADMIN,
      credits: 1e3,
      oauthProvider: "google"
    },
    {
      id: "test_debug",
      email: "test@magicvidio.com",
      firstName: "Test",
      lastName: "User",
      accountType: USER_TYPES.REGISTERED,
      accessRole: ACCESS_ROLES.TEST,
      credits: 100,
      oauthProvider: "google"
    }
  ]
};
var UnifiedAuthService = class _UnifiedAuthService {
  static instance;
  static getInstance() {
    if (!_UnifiedAuthService.instance) {
      _UnifiedAuthService.instance = new _UnifiedAuthService();
    }
    return _UnifiedAuthService.instance;
  }
  /**
   * Create or retrieve a guest user account
   */
  async createOrRetrieveGuest(sessionId) {
    const existingUser = await storage.getUserBySessionToken(sessionId);
    if (existingUser && existingUser.accountType === USER_TYPES.GUEST) {
      await this.updateLastSeen(existingUser.id);
      return this.mapUserToAccount(existingUser);
    }
    if (DEBUG_CONFIG.boundGuestId) {
      const sharedGuestUser = await storage.getUser(DEBUG_CONFIG.boundGuestId);
      if (sharedGuestUser) {
        const fixedSessionToken = "dev_bound_session_token";
        await storage.updateUser(sharedGuestUser.id, {
          sessionToken: fixedSessionToken,
          lastSeenAt: /* @__PURE__ */ new Date()
        });
        return this.mapUserToAccount({
          ...sharedGuestUser,
          sessionToken: fixedSessionToken,
          lastSeenAt: /* @__PURE__ */ new Date()
        });
      }
    }
    const guestId = `guest_${nanoid(12)}`;
    const newUser = await storage.upsertUser({
      id: guestId,
      accountType: USER_TYPES.GUEST,
      accessRole: ACCESS_ROLES.USER,
      sessionToken: sessionId,
      // Use the session ID as the session token
      isEphemeral: true,
      canUpgradeToRegistered: true,
      credits: 30,
      // Ephemeral guests get 30 credits
      createdAt: /* @__PURE__ */ new Date(),
      lastSeenAt: /* @__PURE__ */ new Date()
    });
    return this.mapUserToAccount(newUser);
  }
  /**
   * Upgrade a guest account to registered
   */
  async upgradeGuestToRegistered(guestId, email, oauthProvider, passwordHash) {
    const guestUser = await storage.getUser(guestId);
    if (!guestUser || guestUser.accountType !== USER_TYPES.GUEST) {
      throw new Error("Invalid guest user for upgrade");
    }
    if (email) {
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser && existingUser.id !== guestId) {
        throw new Error("Email already registered");
      }
    }
    const upgradedUser = await storage.upsertUser({
      ...guestUser,
      accountType: USER_TYPES.REGISTERED,
      email,
      oauthProvider,
      passwordHash,
      isEphemeral: false,
      canUpgradeToRegistered: false,
      updatedAt: /* @__PURE__ */ new Date()
    });
    await this.tryCreditsUpgrade(upgradedUser.id, guestUser.credits);
    return this.mapUserToAccount(upgradedUser);
  }
  /**
   * Get user account by session token
   */
  async getUserBySessionToken(sessionToken) {
    const user = await storage.getUserBySessionToken(sessionToken);
    if (!user) return null;
    await this.updateLastSeen(user.id);
    return this.mapUserToAccount(user);
  }
  /**
   * Get user account by session token with fallback to shared guest user
   */
  async getUserBySessionTokenWithFallback(sessionToken) {
    if (DEBUG_CONFIG.boundGuestId) {
      const sharedGuestUser = await storage.getUser(DEBUG_CONFIG.boundGuestId);
      if (sharedGuestUser) {
        await this.updateLastSeen(sharedGuestUser.id);
        return this.mapUserToAccount({
          ...sharedGuestUser,
          sessionToken
          // just pass through whatever was provided
        });
      }
      return null;
    }
    const user = await storage.getUserBySessionToken(sessionToken);
    if (user) {
      await this.updateLastSeen(user.id);
      return this.mapUserToAccount(user);
    }
    return null;
  }
  /**
   * Get user account by ID
   */
  async getUserById(userId) {
    const user = await storage.getUser(userId);
    if (!user) return null;
    await this.updateLastSeen(user.id);
    return this.mapUserToAccount(user);
  }
  /**
   * Update user's last seen timestamp
   */
  async updateLastSeen(userId) {
    await storage.updateUser(userId, {
      lastSeenAt: /* @__PURE__ */ new Date()
    });
  }
  /**
   * Gift credits on account upgrade (stub for future implementation)
   */
  async tryCreditsUpgrade(userId, previousCredits) {
    console.log(`Credits upgrade stub: User ${userId} had ${previousCredits} credits as guest`);
  }
  /**
   * Map database user to UserAccount interface
   */
  mapUserToAccount(user) {
    return {
      id: user.id,
      accountType: user.accountType || USER_TYPES.GUEST,
      accessRole: user.accessRole || ACCESS_ROLES.USER,
      createdAt: user.createdAt || /* @__PURE__ */ new Date(),
      lastSeenAt: user.lastSeenAt || user.createdAt || /* @__PURE__ */ new Date(),
      sessionToken: user.sessionToken || "",
      email: user.email || void 0,
      passwordHash: user.passwordHash || void 0,
      oauthProvider: user.oauthProvider || void 0,
      credits: user.credits,
      isEphemeral: user.isEphemeral || false,
      canUpgradeToRegistered: user.canUpgradeToRegistered || false,
      allowDebit: user.accountType === USER_TYPES.SYSTEM,
      // Set allowDebit based on user type
      firstName: user.firstName || void 0,
      lastName: user.lastName || void 0,
      handle: user.handle || void 0,
      profileImageUrl: user.profileImageUrl || void 0
    };
  }
  /**
   * Initialize debug users in database
   */
  async initializeDebugUsers() {
    for (const debugUser of DEBUG_CONFIG.testUsers) {
      try {
        await storage.upsertUser({
          ...debugUser,
          createdAt: /* @__PURE__ */ new Date(),
          lastSeenAt: /* @__PURE__ */ new Date()
        });
      } catch (error) {
        console.error(`Failed to initialize debug user ${debugUser.id}:`, error);
      }
    }
  }
};
var unifiedAuthMiddleware = async (req, res, next) => {
  try {
    const authService = UnifiedAuthService.getInstance();
    let sessionId = req.session.unifiedSessionId;
    if (!sessionId) {
      sessionId = nanoid(32);
      req.session.unifiedSessionId = sessionId;
    }
    const userAccount = await authService.getUserBySessionTokenWithFallback(sessionId) || await authService.createOrRetrieveGuest(sessionId);
    req.userAccount = userAccount;
    next();
  } catch (error) {
    console.error("Unified auth error:", error);
    next();
  }
};
var requireAuth = (req, res, next) => {
  if (!req.userAccount) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};
var getGenerationLimits = (userAccount) => {
  return {
    creditsRemaining: userAccount.credits,
    allowDebit: userAccount.allowDebit
  };
};

// server/unified-auth-router.ts
import { Router } from "express";
init_storage();
import { z } from "zod";
var router = Router();
router.use(unifiedAuthMiddleware);
router.get("/user", (req, res) => {
  if (!req.userAccount) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  res.json(req.userAccount);
});
var upgradeSchema = z.object({
  email: z.string().email(),
  oauthProvider: z.enum(["google", "facebook"]).optional(),
  passwordHash: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional()
});
router.post("/upgrade", requireAuth, async (req, res) => {
  try {
    if (!req.userAccount) {
      return res.status(401).json({ error: "Authentication required" });
    }
    if (req.userAccount.accountType !== USER_TYPES.GUEST) {
      return res.status(400).json({ error: "Only guest accounts can be upgraded" });
    }
    const validation = upgradeSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Invalid request data",
        details: validation.error.errors
      });
    }
    const { email, oauthProvider, passwordHash, firstName, lastName } = validation.data;
    const authService = UnifiedAuthService.getInstance();
    const upgradedUser = await authService.upgradeGuestToRegistered(
      req.userAccount.id,
      email,
      oauthProvider,
      passwordHash
    );
    if (firstName || lastName) {
      await storage.updateUser(upgradedUser.id, {
        firstName: firstName || req.userAccount.firstName,
        lastName: lastName || req.userAccount.lastName
      });
    }
    const freshUser = await authService.getUserById(upgradedUser.id);
    res.json({
      success: true,
      user: freshUser,
      message: "Account upgraded successfully"
    });
  } catch (error) {
    console.error("Account upgrade error:", error);
    if (error instanceof Error && error.message.includes("Email already registered")) {
      return res.status(409).json({ error: "Email already registered" });
    }
    res.status(500).json({ error: "Failed to upgrade account" });
  }
});
router.get("/limits", (req, res) => {
  if (!req.userAccount) {
    return res.status(401).json({ error: "Authentication required" });
  }
  const { creditsRemaining } = getGenerationLimits(req.userAccount);
  res.json({
    creditsRemaining,
    accountType: req.userAccount.accountType,
    accessRole: req.userAccount.accessRole
  });
});
if (process.env.NODE_ENV === "development") {
  router.get("/debug/users", (req, res) => {
    const debugUsers = [
      {
        id: "admin_debug",
        email: "admin@magicvidio.com",
        firstName: "Admin",
        lastName: "User",
        accountType: USER_TYPES.REGISTERED,
        accessRole: ACCESS_ROLES.ADMIN,
        credits: 1e3
      },
      {
        id: "test_debug",
        email: "test@magicvidio.com",
        firstName: "Test",
        lastName: "User",
        accountType: USER_TYPES.REGISTERED,
        accessRole: ACCESS_ROLES.TEST,
        credits: 100
      }
    ];
    res.json({ users: debugUsers });
  });
  router.post("/debug/switch", async (req, res) => {
    const { userId } = req.body;
    if (!["admin_debug", "test_debug"].includes(userId)) {
      return res.status(400).json({ error: "Invalid debug user" });
    }
    const authService = UnifiedAuthService.getInstance();
    const debugUser = await authService.getUserById(userId);
    if (!debugUser) {
      return res.status(404).json({ error: "Debug user not found" });
    }
    req.session.unifiedSessionId = debugUser.sessionToken;
    req.userAccount = debugUser;
    res.json({ success: true, user: debugUser });
  });
}
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destruction error:", err);
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.json({ success: true });
  });
});
var unified_auth_router_default = router;

// server/payment-router.ts
import { Router as Router2 } from "express";
init_storage();
import { z as z2 } from "zod";
var router2 = Router2();
var createPaytweedInstance = () => {
  return {
    createCheckoutSession: async (data) => ({
      url: `https://checkout.paytweed.com/session_mock_${Date.now()}`,
      id: `cs_mock_${Date.now()}`
    }),
    constructEvent: (body, signature, secret) => ({
      type: "checkout.session.completed",
      data: { object: JSON.parse(body) }
    }),
    retrieveCheckoutSession: async (sessionId) => ({
      payment_status: "paid",
      metadata: {}
    })
  };
};
var createCheckoutSchema = z2.object({
  planId: z2.string(),
  planType: z2.enum(["credits", "subscription"]),
  amount: z2.number().positive(),
  currency: z2.string().default("USD"),
  description: z2.string(),
  credits: z2.number().positive()
});
var CREDIT_PACKAGES = {
  "starter": { credits: 50, price: 9.99 },
  "creator": { credits: 150, price: 24.99 },
  "pro": { credits: 400, price: 59.99 }
};
var SUBSCRIPTION_PLANS = {
  "monthly-basic": { monthlyCredits: 100, bonusCredits: 25, price: 19.99 },
  "monthly-pro": { monthlyCredits: 300, bonusCredits: 100, price: 49.99 },
  "monthly-studio": { monthlyCredits: 750, bonusCredits: 250, price: 99.99 }
};
router2.post("/create-checkout", requireAuth, async (req, res) => {
  try {
    const userId = req.userAccount.id;
    const validated = createCheckoutSchema.parse(req.body);
    const planConfig = validated.planType === "credits" ? CREDIT_PACKAGES[validated.planId] : SUBSCRIPTION_PLANS[validated.planId];
    if (!planConfig) {
      return res.status(400).json({ error: "Invalid plan ID" });
    }
    if (Math.round(planConfig.price * 100) !== validated.amount) {
      return res.status(400).json({ error: "Price mismatch" });
    }
    const paytweed = createPaytweedInstance();
    const checkoutSession = await paytweed.createCheckoutSession({
      amount: validated.amount,
      currency: validated.currency,
      description: validated.description,
      metadata: {
        userId,
        planId: validated.planId,
        planType: validated.planType,
        credits: validated.credits
      },
      successUrl: `${req.protocol}://${req.hostname}/payment/success?session={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${req.protocol}://${req.hostname}/pricing`,
      paymentMethods: ["card", "apple_pay", "google_pay", "crypto"]
    });
    res.json({
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id
    });
  } catch (error) {
    console.error("Create checkout error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});
router2.post("/webhook", async (req, res) => {
  try {
    const signature = req.headers["paytweed-signature"];
    const paytweed = createPaytweedInstance();
    const event = paytweed.constructEvent(
      req.body,
      signature || "",
      process.env.PAYTWEED_WEBHOOK_SECRET || ""
    );
    if (event.type === "checkout.session.completed") {
      const session2 = event.data.object;
      const { userId, planId, planType, credits } = session2.metadata;
      await processSuccessfulPayment(userId, planId, planType, credits, session2);
    }
    res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).json({ error: "Webhook processing failed" });
  }
});
router2.get("/success", async (req, res) => {
  const sessionId = req.query.session;
  if (!sessionId) {
    return res.redirect("/pricing?error=missing_session");
  }
  try {
    const paytweed = createPaytweedInstance();
    const session2 = await paytweed.retrieveCheckoutSession(sessionId);
    if (session2.payment_status === "paid") {
      res.redirect("/dashboard?payment=success");
    } else {
      res.redirect("/pricing?error=payment_failed");
    }
  } catch (error) {
    console.error("Payment success error:", error);
    res.redirect("/pricing?error=session_invalid");
  }
});
async function processSuccessfulPayment(userId, planId, planType, credits, session2) {
  try {
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (planType === "credits") {
      const newCredits = (user.credits || 0) + credits;
      await storage.updateUserCredits(userId, newCredits);
      await storage.createCreditTransaction({
        userId,
        amount: credits,
        type: "purchase",
        description: `Credit purchase: ${planId}`,
        paymentId: session2.id,
        metadata: { planId, sessionId: session2.id }
      });
    } else {
      const planConfig = SUBSCRIPTION_PLANS[planId];
      const totalCredits = planConfig.monthlyCredits + planConfig.bonusCredits;
      const newCredits = (user.credits || 0) + totalCredits;
      await storage.updateUserCredits(userId, newCredits);
      await storage.createCreditTransaction({
        userId,
        amount: totalCredits,
        type: "subscription",
        description: `Monthly subscription: ${planId}`,
        paymentId: session2.id,
        metadata: {
          planId,
          sessionId: session2.id,
          monthlyCredits: planConfig.monthlyCredits,
          bonusCredits: planConfig.bonusCredits
        }
      });
    }
    console.log(`Payment processed successfully for user ${userId}: ${credits} credits`);
  } catch (error) {
    console.error("Payment processing error:", error);
    throw error;
  }
}
var payment_router_default = router2;

// server/brand-asset-router.ts
import { Router as Router3 } from "express";
init_storage();
import multer from "multer";
import path from "path";
import fs from "fs";
var router3 = Router3();
var uploadDir = "./uploads/brand-assets";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
var upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024
    // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }
});
router3.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.userAccount.id;
    const assets = await storage.getUserBrandAssets(userId);
    res.json(assets);
  } catch (error) {
    console.error("Error fetching brand assets:", error);
    res.status(500).json({ error: "Failed to fetch brand assets" });
  }
});
router3.post("/upload", requireAuth, upload.single("file"), async (req, res) => {
  try {
    const userId = req.userAccount.id;
    const file = req.file;
    const { name } = req.body;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const getImageDimensions = async (filePath) => {
      return { width: 1e3, height: 1e3 };
    };
    const dimensions = await getImageDimensions(file.path);
    const isTransparent = file.mimetype === "image/png";
    const fileUrl = `/uploads/brand-assets/${file.filename}`;
    const assetData = {
      userId,
      name: name || file.originalname.replace(/\.[^/.]+$/, ""),
      fileName: file.filename,
      fileUrl,
      fileSize: file.size,
      mimeType: file.mimetype,
      width: dimensions.width,
      height: dimensions.height,
      tags: [],
      // Start with empty tags, user can add them later
      isTransparent
    };
    const asset = await storage.createBrandAsset(assetData);
    res.json(asset);
  } catch (error) {
    console.error("Error uploading brand asset:", error);
    res.status(500).json({ error: "Failed to upload brand asset" });
  }
});
router3.patch("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.userAccount.id;
    const assetId = parseInt(req.params.id);
    const { name, tags: tags2 } = req.body;
    const existingAsset = await storage.getBrandAssetById(assetId);
    if (!existingAsset || existingAsset.userId !== userId) {
      return res.status(404).json({ error: "Brand asset not found" });
    }
    const updates = {
      ...name && { name },
      ...tags2 && { tags: Array.isArray(tags2) ? tags2 : [] }
    };
    const updatedAsset = await storage.updateBrandAsset(assetId, updates);
    res.json(updatedAsset);
  } catch (error) {
    console.error("Error updating brand asset:", error);
    res.status(500).json({ error: "Failed to update brand asset" });
  }
});
router3.delete("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.userAccount.id;
    const assetId = parseInt(req.params.id);
    const existingAsset = await storage.getBrandAssetById(assetId);
    if (!existingAsset || existingAsset.userId !== userId) {
      return res.status(404).json({ error: "Brand asset not found" });
    }
    const filePath = path.join(uploadDir, existingAsset.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    await storage.deleteBrandAsset(assetId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting brand asset:", error);
    res.status(500).json({ error: "Failed to delete brand asset" });
  }
});
router3.get("/search", requireAuth, async (req, res) => {
  try {
    const userId = req.userAccount.id;
    const tags2 = req.query.tags ? req.query.tags.split(",") : void 0;
    const assets = await storage.searchBrandAssets(userId, tags2);
    res.json(assets);
  } catch (error) {
    console.error("Error searching brand assets:", error);
    res.status(500).json({ error: "Failed to search brand assets" });
  }
});
var brand_asset_router_default = router3;

// server/sample-gallery-router.ts
init_storage();
import { Router as Router4 } from "express";
import { z as z3 } from "zod";
var insertRecipeSampleSchema = z3.object({
  recipeId: z3.number(),
  generationId: z3.number(),
  userId: z3.string(),
  title: z3.string().optional(),
  description: z3.string().optional(),
  originalPrompt: z3.string(),
  thumbnailUrl: z3.string(),
  previewUrl: z3.string(),
  highResUrl: z3.string(),
  type: z3.string(),
  fileSize: z3.number(),
  dimensions: z3.any().optional()
});
var insertExportTransactionSchema = z3.object({
  sampleId: z3.number(),
  buyerId: z3.string(),
  creatorId: z3.string(),
  exportFormat: z3.string(),
  exportQuality: z3.string(),
  priceCredits: z3.number(),
  creatorEarnings: z3.number(),
  downloadUrl: z3.string(),
  expiresAt: z3.string()
});
var router4 = Router4();
router4.get("/recipe/:recipeId", async (req, res) => {
  try {
    const recipeId = parseInt(req.params.recipeId);
    const limit = parseInt(req.query.limit) || 12;
    if (isNaN(recipeId)) {
      return res.status(400).json({ error: "Invalid recipe ID" });
    }
    const samples = await storage.getRecipeSamples(recipeId, limit);
    res.json(samples);
  } catch (error) {
    console.error("Error fetching recipe samples:", error);
    res.status(500).json({ error: "Failed to fetch samples" });
  }
});
router4.get("/featured", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const samples = await storage.getFeaturedSamples(limit);
    res.json(samples);
  } catch (error) {
    console.error("Error fetching featured samples:", error);
    res.status(500).json({ error: "Failed to fetch featured samples" });
  }
});
router4.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.userAccount.id;
    const sampleData = insertRecipeSampleSchema.parse({
      ...req.body,
      userId
    });
    const sample = await storage.createRecipeSample(sampleData);
    res.status(201).json(sample);
  } catch (error) {
    console.error("Error creating recipe sample:", error);
    if (error instanceof z3.ZodError) {
      return res.status(400).json({ error: "Invalid sample data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to create sample" });
  }
});
router4.post("/:sampleId/like", requireAuth, async (req, res) => {
  try {
    const userId = req.userAccount.id;
    const sampleId = parseInt(req.params.sampleId);
    if (isNaN(sampleId)) {
      return res.status(400).json({ error: "Invalid sample ID" });
    }
    const isLiked = await storage.toggleSampleLike(sampleId, userId);
    res.json({ liked: isLiked });
  } catch (error) {
    console.error("Error toggling sample like:", error);
    res.status(500).json({ error: "Failed to toggle like" });
  }
});
router4.get("/:sampleId/like", requireAuth, async (req, res) => {
  try {
    const userId = req.userAccount.id;
    const sampleId = parseInt(req.params.sampleId);
    if (isNaN(sampleId)) {
      return res.status(400).json({ error: "Invalid sample ID" });
    }
    const like2 = await storage.getUserSampleLike(sampleId, userId);
    res.json({ liked: !!like2 });
  } catch (error) {
    console.error("Error checking sample like:", error);
    res.status(500).json({ error: "Failed to check like status" });
  }
});
var EXPORT_PRICING = {
  image: {
    png: { standard: 2, hd: 5, ultra: 10 },
    jpg: { standard: 1, hd: 3, ultra: 7 },
    webp: { standard: 1, hd: 3, ultra: 7 }
  },
  video: {
    mp4: { standard: 5, hd: 12, ultra: 25 },
    webm: { standard: 4, hd: 10, ultra: 20 },
    gif: { standard: 3, hd: 8, ultra: 15 }
  }
};
router4.get("/export/pricing", (req, res) => {
  res.json(EXPORT_PRICING);
});
router4.post("/:sampleId/export", requireAuth, async (req, res) => {
  try {
    const userId = req.userAccount.id;
    const sampleId = parseInt(req.params.sampleId);
    const { format, quality } = req.body;
    if (isNaN(sampleId)) {
      return res.status(400).json({ error: "Invalid sample ID" });
    }
    const validFormats = ["png", "jpg", "webp", "mp4", "webm", "gif"];
    const validQualities = ["standard", "hd", "ultra"];
    if (!validFormats.includes(format) || !validQualities.includes(quality)) {
      return res.status(400).json({ error: "Invalid format or quality" });
    }
    const isVideo = ["mp4", "webm", "gif"].includes(format);
    const formatType = isVideo ? "video" : "image";
    const priceCredits = EXPORT_PRICING[formatType][format]?.[quality] || 5;
    const creatorEarnings = Math.floor(priceCredits * 0.7);
    const exportTransaction = await storage.createExportTransaction({
      sampleId,
      buyerId: userId,
      creatorId: "placeholder",
      // Would get from sample
      exportFormat: format,
      exportQuality: quality,
      priceCredits,
      creatorEarnings,
      downloadUrl: `https://example.com/exports/${sampleId}-${format}-${quality}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3)
      // 7 days
    });
    res.status(201).json(exportTransaction);
  } catch (error) {
    console.error("Error creating export:", error);
    res.status(500).json({ error: "Failed to create export" });
  }
});
router4.get("/exports", requireAuth, async (req, res) => {
  try {
    const userId = req.userAccount.id;
    const exports = await storage.getUserExports(userId);
    res.json(exports);
  } catch (error) {
    console.error("Error fetching user exports:", error);
    res.status(500).json({ error: "Failed to fetch exports" });
  }
});
router4.post("/exports/:exportId/download", requireAuth, async (req, res) => {
  try {
    const userId = req.userAccount.id;
    const exportId = parseInt(req.params.exportId);
    if (isNaN(exportId)) {
      return res.status(400).json({ error: "Invalid export ID" });
    }
    const exportTransaction = await storage.getExportTransaction(exportId);
    if (!exportTransaction) {
      return res.status(404).json({ error: "Export not found" });
    }
    if (exportTransaction.buyerId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    if (/* @__PURE__ */ new Date() > exportTransaction.expiresAt) {
      return res.status(410).json({ error: "Export has expired" });
    }
    await storage.markExportDownloaded(exportId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error marking export as downloaded:", error);
    res.status(500).json({ error: "Failed to mark export as downloaded" });
  }
});
var sample_gallery_router_default = router4;

// server/openai-service-router.ts
import { Router as Router5 } from "express";
import { z as z4 } from "zod";
init_storage();
init_openai_gpt_image_service();

// server/openai-dalle2-service.ts
import OpenAI2 from "openai";
import { S3Client as S3Client2, PutObjectCommand as PutObjectCommand2 } from "@aws-sdk/client-s3";
var openai2 = new OpenAI2({ apiKey: process.env.OPENAI_API_KEY });
var s3Client2 = new S3Client2({
  region: process.env.AWS_MAGICVIDIO_REGION,
  credentials: {
    accessKeyId: process.env.AWS_MAGICVIDIO_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_MAGICVIDIO_SECRET_ACCESS_KEY
  }
});
var S3_BUCKET = "avbxp-public";
var S3_PREFIX = "magicvidio";
var CDN_BASE_URL = "https://avbxp-public.s3.us-east-1.amazonaws.com/magicvidio";
function generateAssetId(length = 12) {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
async function downloadAndUploadToS3(imageUrl, assetId) {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }
  const imageBuffer = Buffer.from(await response.arrayBuffer());
  const s3Key = `${S3_PREFIX}/${assetId}.png`;
  const uploadCommand = new PutObjectCommand2({
    Bucket: S3_BUCKET,
    Key: s3Key,
    Body: imageBuffer,
    ContentType: "image/png",
    ACL: "public-read"
  });
  await s3Client2.send(uploadCommand);
  return s3Key;
}
async function uploadBase64ToS32(imageBase64, assetId) {
  const imageBuffer = Buffer.from(imageBase64, "base64");
  const s3Key = `${S3_PREFIX}/${assetId}.png`;
  const uploadCommand = new PutObjectCommand2({
    Bucket: S3_BUCKET,
    Key: s3Key,
    Body: imageBuffer,
    ContentType: "image/png",
    ACL: "public-read"
  });
  await s3Client2.send(uploadCommand);
  return s3Key;
}
var DALLE2Service = class {
  /**
   * Generate images using DALL-E 2
   */
  async generateImage(options) {
    const {
      prompt,
      n = 1,
      size = "1024x1024",
      response_format = "url"
    } = options;
    console.log(`Generating DALL-E 2 image: ${prompt.substring(0, 100)}...`);
    try {
      const response = await openai2.images.generate({
        model: "dall-e-2",
        prompt,
        n,
        size,
        response_format
      });
      if (!response.data || response.data.length === 0) {
        throw new Error("No image data returned from OpenAI");
      }
      const results = [];
      for (const imageData of response.data) {
        const assetId = generateAssetId();
        let s3Key;
        if (response_format === "b64_json" && imageData.b64_json) {
          s3Key = await uploadBase64ToS32(imageData.b64_json, assetId);
        } else if (imageData.url) {
          s3Key = await downloadAndUploadToS3(imageData.url, assetId);
        } else {
          throw new Error("No image data received");
        }
        const imageUrl = `${CDN_BASE_URL}/${assetId}.png`;
        results.push({ url: imageUrl, s3Key, assetId });
      }
      return {
        images: results,
        metadata: {
          model: "dall-e-2",
          prompt,
          size,
          count: n,
          operation: "generation"
        }
      };
    } catch (error) {
      console.error("DALL-E 2 generation error:", error);
      throw new Error(`Image generation failed: ${error?.message || "Unknown error"}`);
    }
  }
  /**
   * Edit images using DALL-E 2 (inpainting)
   */
  async editImage(options) {
    const {
      imageBase64,
      maskBase64,
      prompt,
      n = 1,
      size = "1024x1024",
      response_format = "url"
    } = options;
    console.log(`Editing DALL-E 2 image: ${prompt.substring(0, 100)}...`);
    try {
      const imageBuffer = Buffer.from(imageBase64, "base64");
      const maskBuffer = maskBase64 ? Buffer.from(maskBase64, "base64") : void 0;
      const response = await openai2.images.edit({
        model: "dall-e-2",
        image: imageBuffer,
        mask: maskBuffer,
        prompt,
        n,
        size,
        response_format
      });
      if (!response.data || response.data.length === 0) {
        throw new Error("No image data returned from OpenAI");
      }
      const results = [];
      for (const imageData of response.data) {
        const assetId = generateAssetId();
        let s3Key;
        if (response_format === "b64_json" && imageData.b64_json) {
          s3Key = await uploadBase64ToS32(imageData.b64_json, assetId);
        } else if (imageData.url) {
          s3Key = await downloadAndUploadToS3(imageData.url, assetId);
        } else {
          throw new Error("No image data received");
        }
        const imageUrl = `${CDN_BASE_URL}/${assetId}.png`;
        results.push({ url: imageUrl, s3Key, assetId });
      }
      return {
        images: results,
        metadata: {
          model: "dall-e-2",
          prompt,
          size,
          count: n,
          operation: "edit"
        }
      };
    } catch (error) {
      console.error("DALL-E 2 edit error:", error);
      throw new Error(`Image editing failed: ${error?.message || "Unknown error"}`);
    }
  }
  /**
   * Create variations of an image using DALL-E 2
   */
  async createVariations(options) {
    const {
      imageBase64,
      n = 1,
      size = "1024x1024",
      response_format = "url"
    } = options;
    console.log(`Creating DALL-E 2 variations...`);
    try {
      const imageBuffer = Buffer.from(imageBase64, "base64");
      const response = await openai2.images.createVariation({
        model: "dall-e-2",
        image: imageBuffer,
        n,
        size,
        response_format
      });
      if (!response.data) {
        throw new Error("No image data returned from OpenAI");
      }
      const results = [];
      for (const imageData of response.data) {
        const assetId = generateAssetId();
        let s3Key;
        if (response_format === "b64_json" && imageData.b64_json) {
          s3Key = await uploadBase64ToS32(imageData.b64_json, assetId);
        } else if (imageData.url) {
          s3Key = await downloadAndUploadToS3(imageData.url, assetId);
        } else {
          throw new Error("No image data received");
        }
        const imageUrl = `${CDN_BASE_URL}/${assetId}.png`;
        results.push({ url: imageUrl, s3Key, assetId });
      }
      return {
        images: results,
        metadata: {
          model: "dall-e-2",
          size,
          count: n,
          operation: "variation"
        }
      };
    } catch (error) {
      console.error("DALL-E 2 variation error:", error);
      throw new Error(`Image variation failed: ${error?.message || "Unknown error"}`);
    }
  }
  /**
   * Calculate credit cost for DALL-E 2
   */
  calculateCreditCost(operation, options) {
    const { size, count: count2 } = options;
    const baseCosts = {
      "256x256": 1,
      "512x512": 2,
      "1024x1024": 3
    };
    const baseCredits = baseCosts[size] || 3;
    const multiplier = operation === "generation" ? 1 : 1.2;
    return Math.ceil(baseCredits * count2 * multiplier);
  }
  /**
   * Validate request options
   */
  validateRequest(options) {
    const errors = [];
    if ("prompt" in options) {
      if (!options.prompt || options.prompt.trim().length === 0) {
        errors.push("Prompt is required");
      }
      if (options.prompt && options.prompt.length > 1e3) {
        errors.push("Prompt must be 1000 characters or less for DALL-E 2");
      }
    }
    if (options.n && (options.n < 1 || options.n > 10)) {
      errors.push("Number of images must be between 1-10");
    }
    const validSizes = ["256x256", "512x512", "1024x1024"];
    if (options.size && !validSizes.includes(options.size)) {
      errors.push("Invalid size for DALL-E 2");
    }
    const validFormats = ["url", "b64_json"];
    if (options.response_format && !validFormats.includes(options.response_format)) {
      errors.push("Invalid response format");
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  /**
   * Get optimal settings for different use cases
   */
  getOptimalSettings(useCase) {
    switch (useCase.toLowerCase()) {
      case "fast":
        return { size: "256x256", n: 1 };
      case "quality":
        return { size: "1024x1024", n: 1 };
      case "batch":
        return { size: "512x512", n: 4 };
      case "variations":
        return { size: "512x512", n: 3 };
      default:
        return { size: "512x512", n: 1 };
    }
  }
};
var dalle2Service = new DALLE2Service();

// server/openai-dalle3-service.ts
import OpenAI3 from "openai";
import { S3Client as S3Client3, PutObjectCommand as PutObjectCommand3 } from "@aws-sdk/client-s3";
var openai3 = new OpenAI3({ apiKey: process.env.OPENAI_API_KEY });
var s3Client3 = new S3Client3({
  region: process.env.AWS_MAGICVIDIO_REGION,
  credentials: {
    accessKeyId: process.env.AWS_MAGICVIDIO_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_MAGICVIDIO_SECRET_ACCESS_KEY
  }
});
var S3_BUCKET2 = "avbxp-public";
var S3_PREFIX2 = "magicvidio";
var CDN_BASE_URL2 = "https://avbxp-public.s3.us-east-1.amazonaws.com/magicvidio";
function generateAssetId2(length = 12) {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
async function downloadAndUploadToS32(imageUrl, assetId) {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }
  const imageBuffer = Buffer.from(await response.arrayBuffer());
  const s3Key = `${S3_PREFIX2}/${assetId}.png`;
  const uploadCommand = new PutObjectCommand3({
    Bucket: S3_BUCKET2,
    Key: s3Key,
    Body: imageBuffer,
    ContentType: "image/png",
    ACL: "public-read"
  });
  await s3Client3.send(uploadCommand);
  return s3Key;
}
async function uploadBase64ToS33(imageBase64, assetId) {
  const imageBuffer = Buffer.from(imageBase64, "base64");
  const s3Key = `${S3_PREFIX2}/${assetId}.png`;
  const uploadCommand = new PutObjectCommand3({
    Bucket: S3_BUCKET2,
    Key: s3Key,
    Body: imageBuffer,
    ContentType: "image/png",
    ACL: "public-read"
  });
  await s3Client3.send(uploadCommand);
  return s3Key;
}
var DALLE3Service = class {
  /**
   * Generate images using DALL-E 3
   */
  async generateImage(options) {
    const {
      prompt,
      size = "1024x1024",
      quality = "standard",
      style = "vivid",
      response_format = "url"
    } = options;
    console.log(`Generating DALL-E 3 image: ${prompt.substring(0, 100)}...`);
    try {
      const response = await openai3.images.generate({
        model: "dall-e-3",
        prompt,
        size,
        quality,
        style,
        response_format,
        n: 1
        // DALL-E 3 only supports n=1
      });
      if (!response.data || response.data.length === 0) {
        throw new Error("No image data returned from OpenAI");
      }
      const imageData = response.data[0];
      const assetId = generateAssetId2();
      let s3Key;
      if (response_format === "b64_json" && imageData.b64_json) {
        s3Key = await uploadBase64ToS33(imageData.b64_json, assetId);
      } else if (imageData.url) {
        s3Key = await downloadAndUploadToS32(imageData.url, assetId);
      } else {
        throw new Error("No image URL or base64 data received");
      }
      const imageUrl = `${CDN_BASE_URL2}/${assetId}.png`;
      return {
        imageUrl,
        s3Key,
        assetId,
        revisedPrompt: imageData.revised_prompt || prompt,
        metadata: {
          model: "dall-e-3",
          prompt,
          revisedPrompt: imageData.revised_prompt || prompt,
          size,
          quality,
          style
        }
      };
    } catch (error) {
      console.error("DALL-E 3 generation error:", error);
      throw new Error(`Image generation failed: ${error?.message || "Unknown error"}`);
    }
  }
  /**
   * Calculate credit cost for DALL-E 3
   */
  calculateCreditCost(options) {
    const { size = "1024x1024", quality = "standard" } = options;
    let credits = 5;
    if (quality === "hd") {
      credits += 3;
    }
    if (size === "1024x1792" || size === "1792x1024") {
      credits += 2;
    }
    return credits;
  }
  /**
   * Validate request options
   */
  validateRequest(options) {
    const errors = [];
    if (!options.prompt || options.prompt.trim().length === 0) {
      errors.push("Prompt is required");
    }
    if (options.prompt && options.prompt.length > 4e3) {
      errors.push("Prompt must be 4000 characters or less");
    }
    const validSizes = ["1024x1024", "1024x1792", "1792x1024"];
    if (options.size && !validSizes.includes(options.size)) {
      errors.push("Invalid size for DALL-E 3");
    }
    const validQualities = ["standard", "hd"];
    if (options.quality && !validQualities.includes(options.quality)) {
      errors.push("Invalid quality for DALL-E 3");
    }
    const validStyles = ["vivid", "natural"];
    if (options.style && !validStyles.includes(options.style)) {
      errors.push("Invalid style for DALL-E 3");
    }
    const validFormats = ["url", "b64_json"];
    if (options.response_format && !validFormats.includes(options.response_format)) {
      errors.push("Invalid response format");
    }
    const prohibitedPatterns = [
      /\b(nude|naked|nsfw)\b/i,
      /\b(violence|gore|blood)\b/i,
      /\b(hate|racist|discrimination)\b/i
    ];
    for (const pattern of prohibitedPatterns) {
      if (pattern.test(options.prompt)) {
        errors.push("Prompt contains prohibited content");
      }
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  /**
   * Get optimal settings for different use cases
   */
  getOptimalSettings(useCase) {
    switch (useCase.toLowerCase()) {
      case "portrait":
        return {
          size: "1024x1792",
          quality: "hd",
          style: "vivid"
        };
      case "landscape":
        return {
          size: "1792x1024",
          quality: "hd",
          style: "natural"
        };
      case "social_media":
        return {
          size: "1024x1024",
          quality: "standard",
          style: "vivid"
        };
      case "professional":
        return {
          size: "1024x1024",
          quality: "hd",
          style: "natural"
        };
      case "artistic":
        return {
          size: "1024x1024",
          quality: "hd",
          style: "vivid"
        };
      default:
        return {
          size: "1024x1024",
          quality: "standard",
          style: "vivid"
        };
    }
  }
  /**
   * Enhance prompt for better DALL-E 3 results
   */
  enhancePrompt(basePrompt, style) {
    let enhancedPrompt = basePrompt;
    if (style) {
      switch (style.toLowerCase()) {
        case "photorealistic":
          enhancedPrompt += ", photorealistic, high resolution, professional photography";
          break;
        case "artistic":
          enhancedPrompt += ", artistic style, creative composition, detailed artwork";
          break;
        case "minimalist":
          enhancedPrompt += ", minimalist design, clean composition, simple elegant style";
          break;
        case "cyberpunk":
          enhancedPrompt += ", cyberpunk aesthetic, neon lighting, futuristic technology";
          break;
        case "vintage":
          enhancedPrompt += ", vintage style, retro aesthetic, classic composition";
          break;
        case "modern":
          enhancedPrompt += ", modern design, contemporary style, sleek and clean";
          break;
      }
    }
    return enhancedPrompt;
  }
  /**
   * Get pricing information
   */
  getPricingInfo() {
    return {
      model: "dall-e-3",
      baseCredits: 5,
      qualityMultipliers: {
        standard: 1,
        hd: 1.6
      },
      sizeMultipliers: {
        "1024x1024": 1,
        "1024x1792": 1.4,
        "1792x1024": 1.4
      },
      supportedSizes: ["1024x1024", "1024x1792", "1792x1024"],
      supportedQualities: ["standard", "hd"],
      supportedStyles: ["vivid", "natural"],
      maxPromptLength: 4e3,
      imagesPerRequest: 1
    };
  }
};
var dalle3Service = new DALLE3Service();

// server/openai-service-router.ts
import multer2 from "multer";
var router5 = Router5();
var upload2 = multer2({ storage: multer2.memoryStorage() });
var gptImageGenerationSchema = z4.object({
  prompt: z4.string().min(1).max(4e3),
  size: z4.enum(["1024x1024", "1536x1024", "1024x1536", "auto"]).optional(),
  quality: z4.enum(["low", "medium", "high", "auto"]).optional(),
  format: z4.enum(["png", "jpeg", "webp"]).optional(),
  background: z4.enum(["transparent", "opaque", "auto"]).optional(),
  compression: z4.number().min(0).max(100).optional(),
  moderation: z4.enum(["auto", "low"]).optional()
});
var gptImageEditSchema = z4.object({
  prompt: z4.string().min(1).max(4e3),
  inputImage: z4.string().min(1),
  maskImage: z4.string().optional(),
  size: z4.enum(["1024x1024", "1536x1024", "1024x1536", "auto"]).optional(),
  quality: z4.enum(["low", "medium", "high", "auto"]).optional(),
  format: z4.enum(["png", "jpeg", "webp"]).optional(),
  background: z4.enum(["transparent", "opaque", "auto"]).optional(),
  compression: z4.number().min(0).max(100).optional()
});
var dalle2GenerationSchema = z4.object({
  prompt: z4.string().min(1).max(1e3),
  n: z4.number().min(1).max(10).optional(),
  size: z4.enum(["256x256", "512x512", "1024x1024"]).optional(),
  response_format: z4.enum(["url", "b64_json"]).optional()
});
var dalle3GenerationSchema = z4.object({
  prompt: z4.string().min(1).max(4e3),
  size: z4.enum(["1024x1024", "1024x1792", "1792x1024"]).optional(),
  quality: z4.enum(["standard", "hd"]).optional(),
  style: z4.enum(["vivid", "natural"]).optional(),
  response_format: z4.enum(["url", "b64_json"]).optional()
});
router5.post("/gpt-image/generate", requireAuth, async (req, res) => {
  try {
    const userId = req.userAccount.id;
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const validation = gptImageGenerationSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Invalid parameters",
        details: validation.error.errors
      });
    }
    const options = validation.data;
    const requestValidation = gptImageService.validateRequest(options);
    if (!requestValidation.isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: requestValidation.errors
      });
    }
    const creditCost = gptImageService.calculateCreditCost(options);
    const { creditsRemaining, allowDebit } = getGenerationLimits(req.userAccount);
    if (creditsRemaining < creditCost && !allowDebit) {
      return res.status(400).json({
        error: "Insufficient credits",
        required: creditCost,
        available: creditsRemaining
      });
    }
    const result = await gptImageService.generateImage(options);
    await storage.updateUserCredits(userId, user.credits - creditCost);
    await storage.createCreditTransaction({
      userId,
      amount: -creditCost,
      type: "usage",
      description: "GPT Image generation"
    });
    const generation = await storage.createGeneration({
      userId,
      recipeId: null,
      prompt: options.prompt,
      status: "completed",
      recipeTitle: "GPT Image",
      metadata: {
        request_origin: "user"
      }
    }, req.userAccount.sessionToken);
    await storage.updateGenerationWithAsset(
      generation.id,
      "completed",
      result.imageUrl,
      result.s3Key,
      result.assetId,
      result.metadata
    );
    res.json({
      success: true,
      result,
      creditsUsed: creditCost,
      remainingCredits: user.credits - creditCost
    });
  } catch (error) {
    console.error("GPT Image generation error:", error);
    res.status(500).json({
      error: "Generation failed",
      message: error?.message || "Unknown error"
    });
  }
});
router5.post("/dalle2/generate", requireAuth, async (req, res) => {
  try {
    const userId = req.userAccount.id;
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const validation = dalle2GenerationSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Invalid parameters",
        details: validation.error.errors
      });
    }
    const options = validation.data;
    const requestValidation = dalle2Service.validateRequest(options);
    if (!requestValidation.isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: requestValidation.errors
      });
    }
    const creditCost = dalle2Service.calculateCreditCost("generation", {
      size: options.size || "1024x1024",
      count: options.n || 1
    });
    const { creditsRemaining, allowDebit } = getGenerationLimits(req.userAccount);
    if (creditsRemaining < creditCost && !allowDebit) {
      return res.status(400).json({
        error: "Insufficient credits",
        required: creditCost,
        available: creditsRemaining
      });
    }
    const result = await dalle2Service.generateImage(options);
    await storage.updateUserCredits(userId, user.credits - creditCost);
    await storage.createCreditTransaction({
      userId,
      amount: -creditCost,
      type: "usage",
      description: "DALL-E 2 generation"
    });
    for (const image of result.images) {
      const generation = await storage.createGeneration({
        userId,
        recipeId: null,
        prompt: options.prompt,
        status: "completed",
        recipeTitle: "DALL-E 2",
        metadata: {
          request_origin: "user"
        }
      }, req.userAccount.sessionToken);
      await storage.updateGenerationWithAsset(
        generation.id,
        "completed",
        image.url,
        image.s3Key,
        image.assetId,
        result.metadata
      );
    }
    res.json({
      success: true,
      result,
      creditsUsed: creditCost,
      remainingCredits: user.credits - creditCost
    });
  } catch (error) {
    console.error("DALL-E 2 generation error:", error);
    res.status(500).json({
      error: "Generation failed",
      message: error?.message || "Unknown error"
    });
  }
});
router5.post("/dalle2/edit", requireAuth, upload2.fields([
  { name: "image", maxCount: 1 },
  { name: "mask", maxCount: 1 }
]), async (req, res) => {
  try {
    const userId = req.userAccount.id;
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!req.files?.image?.[0]) {
      return res.status(400).json({ error: "Image file required" });
    }
    const options = {
      imageBase64: req.files.image[0].buffer.toString("base64"),
      maskBase64: req.files.mask?.[0]?.buffer.toString("base64"),
      prompt: req.body.prompt,
      n: req.body.n ? parseInt(req.body.n) : 1,
      size: req.body.size || "1024x1024",
      response_format: req.body.response_format || "url"
    };
    const requestValidation = dalle2Service.validateRequest(options);
    if (!requestValidation.isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: requestValidation.errors
      });
    }
    const creditCost = dalle2Service.calculateCreditCost("edit", {
      size: options.size,
      count: options.n
    });
    if (user.credits < creditCost) {
      return res.status(400).json({
        error: "Insufficient credits",
        required: creditCost,
        available: user.credits
      });
    }
    const result = await dalle2Service.editImage(options);
    await storage.updateUserCredits(userId, user.credits - creditCost);
    await storage.createCreditTransaction({
      userId,
      amount: -creditCost,
      type: "usage",
      description: "DALL-E 2 editing"
    });
    for (const image of result.images) {
      const generation = await storage.createGeneration({
        userId,
        recipeId: null,
        prompt: options.prompt,
        status: "completed",
        recipeTitle: "DALL-E 2 Edit",
        metadata: {
          request_origin: "user"
        }
      }, req.userAccount.sessionToken);
      await storage.updateGenerationWithAsset(
        generation.id,
        "completed",
        image.url,
        image.s3Key,
        image.assetId,
        result.metadata
      );
    }
    res.json({
      success: true,
      result,
      creditsUsed: creditCost,
      remainingCredits: user.credits - creditCost
    });
  } catch (error) {
    console.error("DALL-E 2 edit error:", error);
    res.status(500).json({
      error: "Edit failed",
      message: error?.message || "Unknown error"
    });
  }
});
router5.post("/dalle2/variations", requireAuth, upload2.single("image"), async (req, res) => {
  try {
    const userId = req.userAccount.id;
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Image file required" });
    }
    const options = {
      imageBase64: req.file.buffer.toString("base64"),
      n: req.body.n ? parseInt(req.body.n) : 1,
      size: req.body.size || "1024x1024",
      response_format: req.body.response_format || "url"
    };
    const requestValidation = dalle2Service.validateRequest(options);
    if (!requestValidation.isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: requestValidation.errors
      });
    }
    const creditCost = dalle2Service.calculateCreditCost("variation", {
      size: options.size,
      count: options.n
    });
    if (user.credits < creditCost) {
      return res.status(400).json({
        error: "Insufficient credits",
        required: creditCost,
        available: user.credits
      });
    }
    const result = await dalle2Service.createVariations(options);
    await storage.updateUserCredits(userId, user.credits - creditCost);
    await storage.createCreditTransaction({
      userId,
      amount: -creditCost,
      type: "usage",
      description: "DALL-E 2 variations"
    });
    for (const image of result.images) {
      const generation = await storage.createGeneration({
        userId,
        recipeId: null,
        prompt: "Image variation",
        status: "completed",
        recipeTitle: "DALL-E 2 Variations",
        metadata: {
          request_origin: "user"
        }
      }, req.userAccount.sessionToken);
      await storage.updateGenerationWithAsset(
        generation.id,
        "completed",
        image.url,
        image.s3Key,
        image.assetId,
        result.metadata
      );
    }
    res.json({
      success: true,
      result,
      creditsUsed: creditCost,
      remainingCredits: user.credits - creditCost
    });
  } catch (error) {
    console.error("DALL-E 2 variations error:", error);
    res.status(500).json({
      error: "Variations failed",
      message: error?.message || "Unknown error"
    });
  }
});
router5.post("/dalle3/generate", requireAuth, async (req, res) => {
  try {
    const userId = req.userAccount.id;
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const validation = dalle3GenerationSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Invalid parameters",
        details: validation.error.errors
      });
    }
    const options = validation.data;
    const requestValidation = dalle3Service.validateRequest(options);
    if (!requestValidation.isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: requestValidation.errors
      });
    }
    const creditCost = dalle3Service.calculateCreditCost(options);
    const { creditsRemaining, allowDebit } = getGenerationLimits(req.userAccount);
    if (creditsRemaining < creditCost && !allowDebit) {
      return res.status(400).json({
        error: "Insufficient credits",
        required: creditCost,
        available: creditsRemaining
      });
    }
    const result = await dalle3Service.generateImage(options);
    await storage.updateUserCredits(userId, user.credits - creditCost);
    await storage.createCreditTransaction({
      userId,
      amount: -creditCost,
      type: "usage",
      description: "DALL-E 3 generation"
    });
    const generation = await storage.createGeneration({
      userId,
      recipeId: null,
      prompt: options.prompt,
      status: "completed",
      recipeTitle: "DALL-E 3",
      metadata: {
        request_origin: "user"
      }
    }, req.userAccount.sessionToken);
    await storage.updateGenerationWithAsset(
      generation.id,
      "completed",
      result.imageUrl,
      result.s3Key,
      result.assetId,
      result.metadata
    );
    res.json({
      success: true,
      result,
      creditsUsed: creditCost,
      remainingCredits: user.credits - creditCost
    });
  } catch (error) {
    console.error("DALL-E 3 generation error:", error);
    res.status(500).json({
      error: "Generation failed",
      message: error?.message || "Unknown error"
    });
  }
});
router5.get("/models", (req, res) => {
  res.json({
    models: [
      {
        id: "gpt-image-1",
        name: "GPT Image",
        description: "Latest multimodal model with superior instruction following and editing capabilities",
        capabilities: ["generation", "editing", "streaming"],
        maxPromptLength: 4e3,
        supportedSizes: ["1024x1024", "1536x1024", "1024x1536", "auto"],
        supportedQualities: ["low", "medium", "high", "auto"],
        supportedFormats: ["png", "jpeg", "webp"],
        transparency: true
      },
      {
        id: "dall-e-3",
        name: "DALL-E 3",
        description: "High-quality image generation with detailed prompts",
        capabilities: ["generation"],
        maxPromptLength: 4e3,
        supportedSizes: ["1024x1024", "1024x1792", "1792x1024"],
        supportedQualities: ["standard", "hd"],
        supportedStyles: ["vivid", "natural"],
        imagesPerRequest: 1
      },
      {
        id: "dall-e-2",
        name: "DALL-E 2",
        description: "Fast and cost-effective with editing capabilities",
        capabilities: ["generation", "editing", "variations"],
        maxPromptLength: 1e3,
        supportedSizes: ["256x256", "512x512", "1024x1024"],
        imagesPerRequest: 10,
        concurrentRequests: true
      }
    ]
  });
});
router5.get("/pricing", (req, res) => {
  res.json({
    "gpt-image-1": {
      baseCredits: 5,
      factors: {
        quality: { low: 0.5, medium: 1, high: 2, auto: 1 },
        transparency: 1,
        editing: 1.5
      }
    },
    "dall-e-3": dalle3Service.getPricingInfo(),
    "dall-e-2": {
      baseCredits: { "256x256": 1, "512x512": 2, "1024x1024": 3 },
      operations: { generation: 1, edit: 1.2, variation: 1.2 }
    }
  });
});
router5.get("/health", async (req, res) => {
  try {
    res.json({
      status: "healthy",
      services: {
        "gpt-image": { available: true, model: "gpt-image-1" },
        "dall-e-3": { available: true, model: "dall-e-3" },
        "dall-e-2": { available: true, model: "dall-e-2" }
      },
      configuration: {
        apiKeyConfigured: !!process.env.OPENAI_API_KEY,
        s3Configured: !!(process.env.AWS_MAGICVIDIO_ACCESS_KEY_ID && process.env.AWS_MAGICVIDIO_SECRET_ACCESS_KEY)
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      error: error?.message || "Unknown error"
    });
  }
});
var openai_service_router_default = router5;

// server/admin-router.ts
import express from "express";

// server/admin-auth.ts
import bcrypt from "bcrypt";
var ADMIN_USERNAME = "admin";
var ADMIN_PASSWORD_HASH = "$2b$10$p8hl4O5v72Bj/AF8tEVla.kHG2bG9rcJQfL5Gl88Ta1LMx1qNeqKy";
var requireAdminAuth = (req, res, next) => {
  if (!req.session.admin?.isAdmin) {
    return res.status(401).json({ error: "Admin authentication required" });
  }
  next();
};
var adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }
    if (username !== ADMIN_USERNAME) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    req.session.admin = {
      isAdmin: true,
      username: ADMIN_USERNAME,
      loginTime: Date.now()
    };
    res.json({ success: true, message: "Admin login successful" });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};
var adminLogout = (req, res) => {
  req.session.admin = void 0;
  res.json({ success: true, message: "Admin logout successful" });
};
var checkAdminStatus = (req, res) => {
  const isAuthenticated = !!req.session.admin?.isAdmin;
  res.json({
    isAuthenticated,
    username: req.session.admin?.username || null
  });
};

// server/admin-router.ts
init_db();
init_schema();
import { eq as eq5 } from "drizzle-orm";
var router6 = express.Router();
router6.post("/login", adminLogin);
router6.post("/logout", adminLogout);
router6.get("/status", checkAdminStatus);
router6.get("/recipe-tag-icons", requireAdminAuth, async (req, res) => {
  try {
    const icons = await db.select({
      id: recipeOptionTagIcons.id,
      display: recipeOptionTagIcons.display,
      icon: recipeOptionTagIcons.icon,
      color: recipeOptionTagIcons.color,
      createdAt: recipeOptionTagIcons.createdAt,
      updatedAt: recipeOptionTagIcons.updatedAt
    }).from(recipeOptionTagIcons).orderBy(recipeOptionTagIcons.id);
    res.json({ success: true, icons });
  } catch (error) {
    console.error("Error fetching recipe tag icons:", error);
    res.status(500).json({ error: "Failed to fetch recipe tag icons" });
  }
});
router6.post("/recipe-tag-icons", requireAdminAuth, async (req, res) => {
  try {
    const { id, display, icon, color } = req.body;
    if (!id || !display) {
      return res.status(400).json({ error: "ID and display are required" });
    }
    await db.insert(recipeOptionTagIcons).values({
      id,
      display,
      icon: icon || null,
      color: color || null
    }).onConflictDoUpdate({
      target: recipeOptionTagIcons.id,
      set: {
        display,
        icon: icon || null,
        color: color || null,
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
    res.json({ success: true, message: "Recipe tag icon saved successfully" });
  } catch (error) {
    console.error("Error saving recipe tag icon:", error);
    res.status(500).json({ error: "Failed to save recipe tag icon" });
  }
});
router6.put("/recipe-tag-icons/:id", requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { display, icon, color } = req.body;
    if (!display) {
      return res.status(400).json({ error: "Display is required" });
    }
    await db.update(recipeOptionTagIcons).set({
      display,
      icon: icon || null,
      color: color || null,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq5(recipeOptionTagIcons.id, id));
    res.json({ success: true, message: "Recipe tag icon updated successfully" });
  } catch (error) {
    console.error("Error updating recipe tag icon:", error);
    res.status(500).json({ error: "Failed to update recipe tag icon" });
  }
});
router6.delete("/recipe-tag-icons/:id", requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(recipeOptionTagIcons).where(eq5(recipeOptionTagIcons.id, id));
    res.json({ success: true, message: "Recipe tag icon deleted successfully" });
  } catch (error) {
    console.error("Error deleting recipe tag icon:", error);
    res.status(500).json({ error: "Failed to delete recipe tag icon" });
  }
});
router6.get("/backlog-maintenance", requireAdminAuth, async (req, res) => {
  try {
    const { backlogRetainMinimumService: backlogRetainMinimumService2 } = await Promise.resolve().then(() => (init_service_backlog_retain_minimum(), service_backlog_retain_minimum_exports));
    const stats = await backlogRetainMinimumService2.getBacklogStatistics();
    res.json({ success: true, ...stats });
  } catch (error) {
    console.error("Error fetching backlog maintenance data:", error);
    res.status(500).json({ error: "Failed to fetch backlog maintenance data" });
  }
});
router6.get("/backlog-maintenance/generations", requireAdminAuth, async (req, res) => {
  try {
    const { backlogRetainMinimumService: backlogRetainMinimumService2 } = await Promise.resolve().then(() => (init_service_backlog_retain_minimum(), service_backlog_retain_minimum_exports));
    const generations3 = await backlogRetainMinimumService2.getBacklogGenerations();
    res.json({ success: true, generations: generations3 });
  } catch (error) {
    console.error("Error fetching backlog generations:", error);
    res.status(500).json({ error: "Failed to fetch backlog generations" });
  }
});
router6.get("/backlog-cleanup/status", requireAdminAuth, async (req, res) => {
  try {
    const { backlogCleanupService: backlogCleanupService2 } = await Promise.resolve().then(() => (init_service_backlog_cleanup(), service_backlog_cleanup_exports));
    const status = await backlogCleanupService2.getBacklogStatus();
    res.json({ success: true, ...status });
  } catch (error) {
    console.error("Error fetching backlog cleanup status:", error);
    res.status(500).json({ error: "Failed to fetch backlog cleanup status" });
  }
});
router6.post("/backlog-cleanup/run", requireAdminAuth, async (req, res) => {
  try {
    const { backlogCleanupService: backlogCleanupService2 } = await Promise.resolve().then(() => (init_service_backlog_cleanup(), service_backlog_cleanup_exports));
    const stats = await backlogCleanupService2.cleanupFailedBacklogGenerations();
    res.json({ success: true, message: "Backlog cleanup completed successfully", ...stats });
  } catch (error) {
    console.error("Error running backlog cleanup:", error);
    res.status(500).json({ error: "Failed to run backlog cleanup" });
  }
});
router6.post("/backlog-cleanup/emergency", requireAdminAuth, async (req, res) => {
  try {
    const { backlogCleanupService: backlogCleanupService2 } = await Promise.resolve().then(() => (init_service_backlog_cleanup(), service_backlog_cleanup_exports));
    const result = await backlogCleanupService2.emergencyCleanup();
    res.json({
      success: true,
      message: "Emergency backlog cleanup completed successfully",
      ...result
    });
  } catch (error) {
    console.error("Error running emergency backlog cleanup:", error);
    res.status(500).json({ error: "Failed to run emergency backlog cleanup" });
  }
});
var admin_router_default = router6;

// server/routes.ts
init_fal_service();

// server/video-router.ts
init_fal_service();
var VideoRouter = class {
  // Route video generation to the appropriate provider based on recipe configuration
  async generateVideo(options) {
    const provider = options.provider || "fal";
    try {
      switch (provider) {
        case "fal":
          return await this.generateWithFAL(options);
        case "openai":
          return await this.generateWithOpenAI(options);
        default:
          throw new Error(`Unsupported video provider: ${provider}`);
      }
    } catch (error) {
      console.error(`Video generation failed with ${provider}:`, error);
      return {
        status: "failed",
        provider,
        duration: options.duration,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
  // FAL video generation implementation
  async generateWithFAL(options) {
    try {
      const result = await falService.generateVideo(options.prompt, options.duration);
      if (result?.video_url) {
        return {
          videoUrl: result.video_url,
          thumbnailUrl: result.thumbnail_url,
          duration: options.duration,
          status: "completed",
          provider: "fal",
          metadata: result
        };
      } else {
        return {
          status: "failed",
          provider: "fal",
          duration: options.duration,
          error: "FAL video generation not yet available"
        };
      }
    } catch (error) {
      throw new Error(`FAL video generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  // OpenAI GPT-4o video generation implementation
  async generateWithOpenAI(options) {
    try {
      const enhancedPrompt = this.enhancePromptForVideo(options.prompt, options.style);
      return {
        status: "failed",
        provider: "openai",
        duration: options.duration,
        error: "OpenAI video generation not yet available - awaiting API release"
      };
    } catch (error) {
      throw new Error(`OpenAI video generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  // Enhanced prompt engineering for video generation
  enhancePromptForVideo(prompt, style) {
    const styleEnhancements = {
      cinematic: "cinematic video, professional cinematography, smooth camera movements, film-like quality",
      commercial: "commercial video style, clean professional look, marketing-ready content",
      social: "social media optimized video, engaging and shareable content, modern style",
      artistic: "artistic video composition, creative visual storytelling, unique aesthetic",
      documentary: "documentary style video, realistic and informative presentation",
      animation: "animated video style, smooth motion graphics, vibrant visuals"
    };
    const baseEnhancement = "high quality video, smooth motion, professional production";
    const styleEnhancement = style && styleEnhancements[style] ? styleEnhancements[style] : "";
    return `${prompt}. ${baseEnhancement}${styleEnhancement ? `, ${styleEnhancement}` : ""}`;
  }
  // Get optimal settings based on recipe configuration
  getOptimalSettings(recipeModel, recipeStyle) {
    let provider = "fal";
    let quality = "hd";
    if (recipeModel?.includes("openai") || recipeModel?.includes("gpt")) {
      provider = "openai";
    } else if (recipeModel?.includes("fal") || recipeModel?.includes("flux")) {
      provider = "fal";
    }
    if (recipeStyle === "commercial" || recipeStyle === "cinematic") {
      quality = "4k";
    } else if (recipeStyle === "social") {
      quality = "hd";
    }
    let aspectRatio = "16:9";
    if (recipeStyle === "social") {
      aspectRatio = "9:16";
    } else if (recipeStyle === "square") {
      aspectRatio = "1:1";
    }
    return {
      provider,
      quality,
      aspectRatio
    };
  }
  // Provider availability check
  async checkProviderAvailability(provider) {
    try {
      switch (provider) {
        case "fal":
          return process.env.FAL_KEY !== void 0;
        case "openai":
          return process.env.OPENAI_API_KEY !== void 0;
        default:
          return false;
      }
    } catch (error) {
      return false;
    }
  }
  // Get supported features for each provider
  getSupportedFeatures(provider) {
    switch (provider) {
      case "fal":
        return {
          maxDuration: 20,
          // seconds
          supportedAspectRatios: ["16:9", "9:16", "1:1"],
          supportedQualities: ["standard", "hd"],
          features: ["text-to-video", "image-to-video"]
        };
      case "openai":
        return {
          maxDuration: 0,
          // Not yet available
          supportedAspectRatios: [],
          supportedQualities: [],
          features: ["script-generation"]
          // Currently only script generation
        };
      default:
        return null;
    }
  }
};
var videoRouter = new VideoRouter();

// server/routes.ts
init_image_router();

// server/pinecone-service.ts
import { Pinecone } from "@pinecone-database/pinecone";
var pineconeApiKey = process.env.PINECONE_API_KEY || "";
var pineconeEnvironment = process.env.PINECONE_ENVIRONMENT || "us-east-1-aws";
var indexName = "magicvid-recipes";
var pinecone = null;
async function initializePinecone() {
  if (!pineconeApiKey) {
    console.warn("Pinecone API key not provided, vector search will be disabled");
    return null;
  }
  try {
    pinecone = new Pinecone({
      apiKey: pineconeApiKey
    });
    const indexList = await pinecone.listIndexes();
    const indexExists = indexList.indexes?.some((index2) => index2.name === indexName);
    if (!indexExists) {
      console.log("Creating Pinecone index for recipe embeddings...");
      await pinecone.createIndex({
        name: indexName,
        dimension: 1536,
        // OpenAI embedding dimension
        metric: "cosine",
        spec: {
          serverless: {
            cloud: "aws",
            region: "us-east-1"
          }
        }
      });
    }
    console.log("Pinecone initialized successfully");
    return pinecone;
  } catch (error) {
    console.error("Failed to initialize Pinecone:", error);
    return null;
  }
}
async function generateEmbedding(text2) {
  try {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        input: text2,
        model: "text-embedding-ada-002"
      })
    });
    if (!response.ok) {
      throw new Error("Failed to generate embedding");
    }
    const data = await response.json();
    return data.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    return null;
  }
}
async function upsertRecipeEmbedding(recipeId, title, description, category, type) {
  if (!pinecone) return;
  try {
    const index2 = pinecone.index(indexName);
    const text2 = `${title} ${description} ${category}`;
    const embedding = await generateEmbedding(text2);
    if (!embedding) return;
    await index2.upsert([
      {
        id: `recipe-${recipeId}`,
        values: embedding,
        metadata: {
          recipeId,
          title,
          description,
          category,
          type,
          text: text2
        }
      }
    ]);
    console.log(`Upserted embedding for recipe ${recipeId}`);
  } catch (error) {
    console.error("Error upserting recipe embedding:", error);
  }
}
async function searchRecipesByVector(query, type, limit = 10) {
  if (!pinecone) return [];
  try {
    const index2 = pinecone.index(indexName);
    const queryEmbedding = await generateEmbedding(query);
    if (!queryEmbedding) return [];
    const searchResults = await index2.query({
      vector: queryEmbedding,
      topK: limit,
      includeMetadata: true,
      filter: type ? { type: { $eq: type } } : void 0
    });
    return searchResults.matches?.map((match) => ({
      recipeId: match.metadata?.recipeId,
      title: match.metadata?.title,
      description: match.metadata?.description,
      category: match.metadata?.category,
      type: match.metadata?.type,
      score: match.score
    })) || [];
  } catch (error) {
    console.error("Error searching recipes by vector:", error);
    return [];
  }
}
async function initializeRecipeEmbeddings(recipes2) {
  if (!pinecone) {
    console.log("Pinecone not initialized, skipping recipe embeddings");
    return;
  }
  if (process.env.DISABLE_VECTOR_EMBEDDINGS === "true") {
    console.log("Vector embeddings disabled via environment variable");
    return;
  }
  console.log("Initializing recipe embeddings...");
  for (const recipe of recipes2) {
    await upsertRecipeEmbedding(
      recipe.id,
      recipe.name,
      recipe.description,
      recipe.category,
      recipe.category.toLowerCase().includes("video") ? "video" : "image"
    );
  }
  console.log("Recipe embeddings initialized");
}

// server/routes.ts
init_recipe_processor();

// server/config.ts
var SITE_DEPLOYMENT_TYPE = process.env.SITE_DEPLOYMENT_TYPE || "alpha";
var DATABASE_URL = process.env.DATABASE_URL;
var isAlphaSite = () => SITE_DEPLOYMENT_TYPE === "alpha";
var ALPHA_CONFIG = {
  guestRecipes: ["cat-olympic-diving", "lava-food-asmr", "based-ape-vlog"],
  typeformUrl: process.env.ALPHA_TYPEFORM_URL || "https://typeform.com/to/placeholder",
  siteName: "delula",
  logoUrl: process.env.ALPHA_LOGO_URL || "/delula-logo.svg"
};

// server/routes.ts
init_schema();
init_db();
init_schema();
import { inArray as inArray2, eq as eq7, and as and6, like } from "drizzle-orm";

// server/media-library-router.ts
import { Router as Router6 } from "express";
init_db();
init_schema();
import { and as and5, desc as desc2, eq as eq6, ilike, sql as sql4 } from "drizzle-orm";
import { v4 as uuidv42 } from "uuid";

// server/s3-presign-service.ts
init_env();
import { S3Client as S3Client4, PutObjectCommand as PutObjectCommand4 } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
var s3 = null;
function getS3() {
  if (!s3) {
    s3 = new S3Client4({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_DELULA_ACCESS_KEY,
        secretAccessKey: process.env.AWS_DELULA_SECRET_ACCESS_KEY
      }
    });
  }
  return s3;
}
async function presignPutObject(bucket, key, contentType, expiresSeconds = 900) {
  const command = new PutObjectCommand4({ Bucket: bucket, Key: key, ContentType: contentType });
  return getSignedUrl(getS3(), command, { expiresIn: expiresSeconds });
}

// server/derivative-service.ts
init_env();

// server/s3-utils.ts
init_env();
import { S3Client as S3Client5, GetObjectCommand, PutObjectCommand as PutObjectCommand5, HeadObjectCommand } from "@aws-sdk/client-s3";
var s32 = null;
function getS32() {
  if (!s32) {
    s32 = new S3Client5({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_DELULA_ACCESS_KEY,
        secretAccessKey: process.env.AWS_DELULA_SECRET_ACCESS_KEY
      }
    });
  }
  return s32;
}
async function getObjectBuffer(bucket, key) {
  const res = await getS32().send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const stream = res.Body;
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}
async function putObjectBuffer(bucket, key, body, contentType) {
  await getS32().send(new PutObjectCommand5({ Bucket: bucket, Key: key, Body: body, ContentType: contentType }));
}
async function headObject(bucket, key) {
  try {
    const res = await getS32().send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return {
      contentLength: typeof res.ContentLength === "number" ? res.ContentLength : res.ContentLength ? Number(res.ContentLength) : null,
      contentType: res.ContentType || null,
      exists: true
    };
  } catch (e) {
    if (e?.$metadata?.httpStatusCode === 404) {
      return { contentLength: null, contentType: null, exists: false };
    }
    throw e;
  }
}
async function getObjectRange(bucket, key, start, endInclusive) {
  const res = await getS32().send(new GetObjectCommand({ Bucket: bucket, Key: key, Range: `bytes=${start}-${endInclusive}` }));
  const stream = res.Body;
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

// server/derivative-service.ts
var sharp = null;
try {
  sharp = __require("sharp");
} catch (_) {
  sharp = null;
}
var BUCKET = "delula-media-prod";
var CDN = "https://cdn.delu.la";
var DerivativeService = class {
  async generateImageDerivatives(originalKey, uuid) {
    if (!sharp) {
      return {};
    }
    const buf = await getObjectBuffer(BUCKET, originalKey);
    const thumbBuf = await sharp(buf).resize(300, 300, { fit: "cover" }).jpeg({ quality: 82 }).toBuffer();
    const thumbKey = originalKey.replace("/originals/", "/thumbnails/").replace(/\.[A-Za-z0-9]+$/, ".jpg");
    await putObjectBuffer(BUCKET, thumbKey, thumbBuf, "image/jpeg");
    const previewBuf = await sharp(buf).resize(800, 800, { fit: "inside" }).jpeg({ quality: 88 }).toBuffer();
    const previewKey = originalKey.replace("/originals/", "/previews/").replace(/\.[A-Za-z0-9]+$/, ".jpg");
    await putObjectBuffer(BUCKET, previewKey, previewBuf, "image/jpeg");
    const webpBuf = await sharp(buf).resize(1600, 1600, { fit: "inside" }).webp({ quality: 82 }).toBuffer();
    const webpKey = originalKey.replace("/originals/", "/webp/").replace(/\.[A-Za-z0-9]+$/, ".webp");
    await putObjectBuffer(BUCKET, webpKey, webpBuf, "image/webp");
    return {
      thumbnailUrl: `${CDN}/${thumbKey}`,
      previewUrl: `${CDN}/${previewKey}`,
      webpUrl: `${CDN}/${webpKey}`
    };
  }
  async generateVideoDerivatives(_originalKey, _uuid) {
    return {};
  }
};
var derivativeService = new DerivativeService();

// server/media-library-router.ts
var router7 = Router6();
var CDN2 = "https://cdn.delu.la";
var BUCKET2 = "delula-media-prod";
var ALLOWED = {
  1: { exts: ["jpg", "jpeg", "png", "webp"], mimes: ["image/jpeg", "image/png", "image/webp"], maxBytes: 25 * 1024 * 1024, folder: "images" },
  2: { exts: ["mp4", "webm", "mov"], mimes: ["video/mp4", "video/webm", "video/quicktime"], maxBytes: 500 * 1024 * 1024, folder: "videos" },
  3: { exts: ["mp3", "wav"], mimes: ["audio/mpeg", "audio/wav"], maxBytes: 50 * 1024 * 1024, folder: "audio" },
  4: { exts: ["pdf"], mimes: ["application/pdf"], maxBytes: 25 * 1024 * 1024, folder: "documents" }
};
function getExtension(name) {
  const idx = name.lastIndexOf(".");
  return idx >= 0 ? name.slice(idx + 1).toLowerCase() : "";
}
function validatePlannedKey(userId, folder, assetId, ext, s3Key) {
  const expectedPrefix = `library/user/${userId}/${folder}/originals/`;
  if (!s3Key.startsWith(expectedPrefix)) return false;
  const expectedName = `${assetId}.${ext}`;
  return s3Key.endsWith(expectedName);
}
function sniffMagicBytes(buf, type) {
  if (type === 1) {
    if (buf.length >= 3 && buf[0] === 255 && buf[1] === 216 && buf[2] === 255) return true;
    if (buf.length >= 8 && buf[0] === 137 && buf[1] === 80 && buf[2] === 78 && buf[3] === 71 && buf[4] === 13 && buf[5] === 10 && buf[6] === 26 && buf[7] === 10) return true;
    if (buf.length >= 12 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return true;
    return false;
  }
  if (type === 2) {
    if (buf.length >= 12 && buf.toString("ascii", 4, 8) === "ftyp") return true;
    if (buf.length >= 4 && buf[0] === 26 && buf[1] === 69 && buf[2] === 223 && buf[3] === 163) return true;
    return false;
  }
  if (type === 3) {
    if (buf.length >= 3 && buf.toString("ascii", 0, 3) === "ID3") return true;
    if (buf.length >= 2 && buf[0] === 255 && (buf[1] & 224) === 224) return true;
    if (buf.length >= 12 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WAVE") return true;
    return false;
  }
  if (type === 4) {
    if (buf.length >= 5 && buf.toString("ascii", 0, 5) === "%PDF-") return true;
    return false;
  }
  return false;
}
function placeholderFor(type) {
  switch (type) {
    case 2:
      return `${CDN2}/static/placeholders/video.png`;
    case 3:
      return `${CDN2}/static/placeholders/audio.png`;
    case 4:
      return `${CDN2}/static/placeholders/document.png`;
    default:
      return `${CDN2}/static/placeholders/image.png`;
  }
}
function computeBaseUrl(req) {
  try {
    const proto = req.headers["x-forwarded-proto"] || req.protocol || "https";
    const host = req.headers["x-forwarded-host"] || req.get("host");
    if (!host) return null;
    return `${proto}://${host}`;
  } catch {
    return null;
  }
}
async function scheduleVideoFirstFrame(videoUrl, assetId, userId, serverBaseUrl) {
  try {
    const { LambdaClient: LambdaClient3, InvokeCommand: InvokeCommand3 } = await import("@aws-sdk/client-lambda");
    const client = new LambdaClient3({ region: process.env.AWS_REGION || "us-east-1", credentials: { accessKeyId: process.env.AWS_DELULA_ACCESS_KEY, secretAccessKey: process.env.AWS_DELULA_SECRET_ACCESS_KEY } });
    const key = `videos/thumbnails/${assetId}.jpg`;
    const payload = {
      video_url: videoUrl,
      frame_requests: "0",
      destination_bucket: BUCKET2,
      output_prefix: "videos/thumbnails",
      allow_partial_completion: true
    };
    if (userId) {
      payload.user_id = userId;
    }
    payload.asset_id = assetId;
    if (serverBaseUrl) {
      payload.server_base_url = serverBaseUrl;
    }
    const cmd = new InvokeCommand3({ FunctionName: "GetFramesFromVideo", Payload: JSON.stringify(payload) });
    client.send(cmd).then(async (resp) => {
      if (!resp.Payload) return;
      const result = JSON.parse(new TextDecoder().decode(resp.Payload));
      const frames = result?.body?.frames || result?.frames || {};
      const first = frames["0"] || Object.values(frames)[0];
      if (first?.s3_url || first?.bucket_key) {
        const thumbUrl = first.s3_url ? String(first.s3_url).replace(/^s3:\/\//, `${CDN2}/`) : `${CDN2}/${first.bucket_key}`;
      }
    }).catch(() => {
    });
  } catch (e) {
    console.error("scheduleVideoFirstFrame error", e);
  }
}
router7.get("/assets", requireAuth, async (req, res) => {
  try {
    const userId = req.userAccount.id;
    const type = req.query.type ? parseInt(String(req.query.type)) : void 0;
    const source = req.query.source ? parseInt(String(req.query.source)) : void 0;
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const sortBy = req.query.sortBy || "date";
    const sortOrder = (req.query.sortOrder || "desc").toLowerCase() === "asc" ? "asc" : "desc";
    const page = Math.max(1, parseInt(String(req.query.page || 1)) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit || 20)) || 20));
    const offset = (page - 1) * limit;
    const filters = [eq6(userAssets.userId, userId), eq6(userAssets.isDeleted, false)];
    if (type) filters.push(eq6(userAssets.assetType, type));
    if (source) filters.push(eq6(userAssets.source, source));
    const where = and5(
      ...filters,
      search ? sql4`(${userAssets.normalizedName} ILIKE ${"%" + search.toLowerCase() + "%"}) OR EXISTS (SELECT 1 FROM unnest(${userAssets.userTags}) t WHERE t ILIKE ${"%" + search.toLowerCase() + "%"})` : sql4`true`
    );
    const orderExpr = sortBy === "name" ? userAssets.normalizedName : sortBy === "size" ? userAssets.fileSize : sortBy === "usage" ? userAssets.usageCount : userAssets.createdAt;
    const orderer = sortOrder === "asc" ? orderExpr.asc() : desc2(orderExpr);
    const assets = await db.select().from(userAssets).where(where).orderBy(orderer).limit(limit).offset(offset);
    const totalRows = await db.select({ count: sql4`count(*)::int` }).from(userAssets).where(where);
    const typeCountsRows = await db.select({ assetType: userAssets.assetType, count: sql4`count(*)::int` }).from(userAssets).where(and5(eq6(userAssets.userId, userId), eq6(userAssets.isDeleted, false))).groupBy(userAssets.assetType);
    const typeCounts = {};
    typeCountsRows.forEach((r) => typeCounts[Number(r.assetType)] = r.count);
    res.json({
      assets,
      pagination: {
        currentPage: page,
        totalPages: Math.max(1, Math.ceil((totalRows[0]?.count || 0) / limit)),
        totalAssets: totalRows[0]?.count || 0,
        hasNextPage: page * limit < (totalRows[0]?.count || 0),
        hasPreviousPage: page > 1
      },
      typeCounts
    });
  } catch (error) {
    console.error("Failed to list media assets:", error);
    res.status(500).json({ error: "Failed to list media assets" });
  }
});
router7.get("/search-suggestions", requireAuth, async (req, res) => {
  try {
    const userId = req.userAccount.id;
    const q = req.query.q || "";
    if (q.length < 2) return res.json({ suggestions: [] });
    const query = "%" + q.toLowerCase() + "%";
    const nameRows = await db.select({ name: userAssets.displayName }).from(userAssets).where(and5(eq6(userAssets.userId, userId), ilike(userAssets.normalizedName, query))).limit(5);
    const tagRows = await db.select({ tag: sql4`unnest(${userAssets.userTags})` }).from(userAssets).where(and5(eq6(userAssets.userId, userId), sql4`EXISTS (SELECT 1 FROM unnest(${userAssets.userTags}) AS t WHERE t ILIKE ${query})`)).limit(5);
    const set = /* @__PURE__ */ new Set();
    nameRows.forEach((r) => r.name && set.add(r.name));
    tagRows.forEach((r) => r.tag && set.add(r.tag));
    res.json({ suggestions: Array.from(set).slice(0, 10) });
  } catch (error) {
    console.error("Failed to get search suggestions:", error);
    res.status(500).json({ error: "Failed to get suggestions" });
  }
});
router7.post("/upload-url", requireAuth, async (req, res) => {
  try {
    const userId = req.userAccount.id;
    const { filename, mimeType, assetType, fileSize } = req.body;
    if (!filename || !mimeType || !assetType) return res.status(400).json({ error: "Missing fields" });
    const typeNum = Number(assetType);
    const allow = ALLOWED[typeNum];
    if (!allow) return res.status(400).json({ error: "Unsupported asset type" });
    const ext = getExtension(filename);
    if (!allow.exts.includes(ext)) return res.status(400).json({ error: "File extension not allowed" });
    if (!allow.mimes.includes(mimeType)) return res.status(400).json({ error: "MIME type not allowed" });
    if (fileSize && Number(fileSize) > allow.maxBytes) return res.status(400).json({ error: "File too large" });
    const assetId = uuidv42();
    const typeFolder = allow.folder;
    const s3Key = `library/user/${userId}/${typeFolder}/originals/${assetId}.${ext}`;
    const bucket = "delula-media-prod";
    const url = await presignPutObject(bucket, s3Key, mimeType);
    res.json({
      finalizeToken: uuidv42(),
      s3KeyPlanned: s3Key,
      assetId,
      presign: { method: "PUT", url, headers: { "Content-Type": mimeType } },
      cdnPreview: `https://cdn.delu.la/${s3Key}`
    });
  } catch (error) {
    console.error("Failed to create upload URL:", error);
    res.status(500).json({ error: "Failed to create upload URL" });
  }
});
router7.post("/finalize", requireAuth, async (req, res) => {
  try {
    const userId = req.userAccount.id;
    const {
      assetId,
      s3Key,
      originalFilename,
      fileSize,
      mimeType,
      assetType,
      displayName,
      cdnUrl,
      dimensions,
      duration,
      thumbnailUrl,
      userTags
    } = req.body || {};
    if (!assetId || !s3Key || !originalFilename || !fileSize || !mimeType || !assetType) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const typeNum = Number(assetType);
    const allow = ALLOWED[typeNum];
    if (!allow) return res.status(400).json({ error: "Unsupported asset type" });
    const ext = getExtension(originalFilename);
    if (!validatePlannedKey(userId, allow.folder, assetId, ext, s3Key)) {
      return res.status(400).json({ error: "Invalid s3Key. Must end with /originals/{assetId}.{ext}" });
    }
    const head = await headObject(BUCKET2, s3Key);
    if (!head.exists) return res.status(400).json({ error: "Uploaded object not found" });
    if (head.contentLength && head.contentLength > allow.maxBytes) return res.status(400).json({ error: "File too large" });
    if (head.contentType && !allow.mimes.includes(head.contentType)) {
    }
    const firstBytes = await getObjectRange(BUCKET2, s3Key, 0, 4095);
    if (!sniffMagicBytes(firstBytes, typeNum)) {
      return res.status(400).json({ error: "File content does not match declared type" });
    }
    const normalizedName = (displayName || originalFilename).toLowerCase();
    const [row] = await db.insert(userAssets).values({
      userId,
      assetId,
      originalFilename,
      displayName: displayName || originalFilename.replace(/\.[^/.]+$/, ""),
      normalizedName,
      s3Key,
      cdnUrl: cdnUrl || `https://cdn.delu.la/${s3Key}`,
      mimeType,
      fileSize: Number(fileSize),
      assetType: Number(assetType),
      source: 1,
      dimensions: dimensions || null,
      duration: duration ? Number(duration) : null,
      thumbnailUrl: thumbnailUrl || placeholderFor(Number(assetType)),
      userTags: Array.isArray(userTags) ? userTags : [],
      systemTags: [],
      autoClassification: {
        mimeType,
        isImage: mimeType.startsWith("image/"),
        isVideo: mimeType.startsWith("video/"),
        isAudio: mimeType.startsWith("audio/"),
        size: Number(fileSize)
      }
    }).returning();
    if (typeNum === 1) {
      derivativeService.generateImageDerivatives(s3Key, assetId).then(async (d) => {
        if (d.thumbnailUrl) {
          await db.update(userAssets).set({ thumbnailUrl: d.thumbnailUrl, updatedAt: /* @__PURE__ */ new Date() }).where(and5(eq6(userAssets.userId, userId), eq6(userAssets.assetId, assetId)));
        }
      }).catch((e) => console.error("derivative error", e));
    } else if (typeNum === 2) {
      const serverBaseUrl = computeBaseUrl(req);
      scheduleVideoFirstFrame(cdnUrl || `${CDN2}/${s3Key}`, assetId, userId, serverBaseUrl).catch(() => {
      });
    }
    res.json({ success: true, asset: row });
  } catch (error) {
    console.error("Failed to finalize upload:", error);
    res.status(500).json({ error: "Failed to finalize upload" });
  }
});
router7.post("/import-delula", requireAuth, async (req, res) => {
  try {
    const userId = req.userAccount.id;
    const { generationId } = req.body;
    if (!generationId) return res.status(400).json({ error: "generationId required" });
    const { storage: storage2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
    const generation = await storage2.getGenerationById(Number(generationId));
    if (!generation) return res.status(404).json({ error: "Generation not found" });
    const assetId = uuidv42();
    const ext = (generation.secureUrl || generation.imageUrl || "").split(".").pop() || "bin";
    const type = generation.type === "video" ? 2 : 1;
    const s3Key = `library/user/${userId}/${type === 2 ? "videos" : "images"}/originals/${assetId}.${ext}`;
    const [row] = await db.insert(userAssets).values({
      userId,
      assetId,
      originalFilename: `delula-${generation.shortId || generation.id}.${ext}`,
      displayName: generation.recipeTitle || `Generated ${generation.type}`,
      normalizedName: (generation.recipeTitle || `generated ${generation.type}`).toLowerCase(),
      s3Key,
      cdnUrl: generation.secureUrl || generation.imageUrl || "",
      mimeType: type === 2 ? "video/mp4" : "image/jpeg",
      fileSize: 0,
      assetType: type,
      source: 2,
      dimensions: null,
      duration: null,
      thumbnailUrl: generation.thumbnailUrl || null,
      userTags: [],
      systemTags: ["delula"],
      autoClassification: { fromGenerationId: generation.id }
    }).returning();
    res.json({ success: true, asset: row });
  } catch (error) {
    console.error("Failed to import delula asset:", error);
    res.status(500).json({ error: "Failed to import asset" });
  }
});
router7.delete("/assets/:assetId", requireAuth, async (req, res) => {
  try {
    const userId = req.userAccount.id;
    const { assetId } = req.params;
    await db.update(userAssets).set({ isDeleted: true, updatedAt: /* @__PURE__ */ new Date() }).where(and5(eq6(userAssets.userId, userId), eq6(userAssets.assetId, assetId)));
    res.json({ success: true });
  } catch (error) {
    console.error("Failed to delete asset:", error);
    res.status(500).json({ error: "Failed to delete asset" });
  }
});
router7.patch("/assets/:assetId", requireAuth, async (req, res) => {
  try {
    const userId = req.userAccount.id;
    const { assetId } = req.params;
    const { displayName, userTags } = req.body || {};
    const updates = {};
    if (typeof displayName === "string" && displayName.trim().length > 0) {
      updates.displayName = displayName.trim();
      updates.normalizedName = displayName.trim().toLowerCase();
    }
    if (Array.isArray(userTags)) {
      updates.userTags = userTags;
    }
    if (Object.keys(updates).length === 0) return res.json({ success: true });
    const [row] = await db.update(userAssets).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(and5(eq6(userAssets.userId, userId), eq6(userAssets.assetId, assetId))).returning();
    res.json({ success: true, asset: row });
  } catch (error) {
    console.error("Failed to update asset:", error);
    res.status(500).json({ error: "Failed to update asset" });
  }
});
router7.post("/analyze/:assetId", requireAuth, async (req, res) => {
  try {
    res.json({ success: true, scheduled: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to schedule analysis" });
  }
});
var media_library_router_default = router7;
router7.post("/webhook/thumbnail-ready", async (req, res) => {
  try {
    const provided = req.header("x-webhook-secret");
    const expected = process.env.MEDIA_WEBHOOK_SECRET;
    if (!expected || provided !== expected) return res.status(401).json({ error: "Unauthorized" });
    const { userId, assetId, thumbnailUrl } = req.body || {};
    if (!userId || !assetId || !thumbnailUrl) return res.status(400).json({ error: "Missing fields" });
    const [row] = await db.update(userAssets).set({ thumbnailUrl, updatedAt: /* @__PURE__ */ new Date() }).where(and5(eq6(userAssets.userId, userId), eq6(userAssets.assetId, assetId))).returning();
    try {
      global.broadcastToUser?.(userId, { type: "thumbnail_ready", data: { assetId, thumbnailUrl } });
    } catch {
    }
    res.json({ success: true, asset: row });
  } catch (e) {
    console.error("thumbnail-ready webhook error", e);
    res.status(500).json({ error: "Failed to update thumbnail" });
  }
});
router7.get("/assets/:assetId", requireAuth, async (req, res) => {
  try {
    const userId = req.userAccount.id;
    const { assetId } = req.params;
    const rows = await db.select().from(userAssets).where(and5(eq6(userAssets.userId, userId), eq6(userAssets.assetId, assetId))).limit(1);
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch asset" });
  }
});

// server/routes.ts
var INITIAL_RECIPES = [
  {
    name: "Futuristic AI Anatomy",
    slug: "futuristic-ai-anatomy",
    description: "Create glowing anatomical illustrations with digital highlight effects",
    prompt: "A digital illustration of a [SUBJECT], outlined with glowing blue lines that trace its anatomy. Set against a dark background, the contrast highlights the form and features. Emphasize [BODY_PART] with a red glow to indicate importance or interest. The style is sleek, educational, and visually striking\u2014like advanced imaging technology.",
    instructions: "Perfect for medical illustrations, educational content, and futuristic design projects. Customize the subject and highlighted body parts for your specific needs. Works well with anatomical terms and scientific visualization.",
    category: "Digital Art",
    style: "futuristic",
    model: "gpt-image-1",
    creditCost: 6
  },
  {
    name: "Cats in Video Games",
    slug: "cats-in-video-games",
    description: "Generate adorable cats in various video game worlds and styles",
    prompt: "A highly detailed video game screenshot showing [CAT_COUNT] [CAT_COLORS] cat characters in a [GAME_GENRE] game world. The setting features [SETTING_DESCRIPTION], and the cats are [ACTION_DESCRIPTION]. The image has a [CAMERA_STYLE] perspective with vibrant game-like lighting and textures. The art style should match the specified game genre with appropriate visual effects and atmosphere.",
    instructions: "Create charming feline characters in any video game style. Customize the number of cats, their colors and patterns, the game world environment, and camera perspective. Perfect for game concept art, character design, and whimsical digital illustrations.",
    category: "Gaming Art",
    style: "video-game",
    model: "flux-1",
    creditCost: 8,
    tokenDefinitions: {
      CAT_COUNT: {
        type: "dropdown",
        label: "Number of Cats",
        options: [
          { value: "one", label: "One Cat" },
          { value: "two", label: "Two Cats" },
          { value: "three", label: "Three Cats" },
          { value: "many", label: "Many Cats" }
        ],
        defaultValue: "one"
      },
      CAT_COLORS: {
        type: "color-picker",
        label: "Cat Colors & Patterns",
        presets: [
          { value: "orange tabby", color: "#FF8C42", label: "Orange Tabby" },
          { value: "black", color: "#2C2C2C", label: "Black" },
          { value: "white", color: "#F5F5F5", label: "White" },
          { value: "gray striped", color: "#8B8B8B", label: "Gray Striped" },
          { value: "calico", color: "gradient", label: "Calico" },
          { value: "siamese", color: "gradient", label: "Siamese" }
        ],
        allowCustom: true,
        defaultValue: "orange tabby"
      },
      GAME_GENRE: {
        type: "input",
        label: "Game Genre",
        placeholder: "e.g., platformer, RPG, retro pixel art, open-world adventure...",
        helpText: "Describe the style and genre of your video game world",
        required: true
      },
      SETTING_DESCRIPTION: {
        type: "textarea",
        label: "Setting & Environment",
        placeholder: "Describe the game world: floating islands, neon cyberpunk city, medieval castle, underwater kingdom...",
        rows: 3,
        required: false
      },
      ACTION_DESCRIPTION: {
        type: "input",
        label: "Cat Action",
        placeholder: "e.g., jumping across platforms, casting spells, racing through loops...",
        required: true
      },
      CAMERA_STYLE: {
        type: "dropdown",
        label: "Camera Style",
        options: [
          { value: "auto", label: "Auto (Based on Genre)" },
          { value: "side-scroller", label: "Side Scroller" },
          { value: "top-down", label: "Top-Down View" },
          { value: "first-person", label: "First Person" },
          { value: "third-person", label: "3D Third Person" },
          { value: "isometric", label: "Isometric" }
        ],
        defaultValue: "auto",
        autoDetect: true
      }
    }
  },
  {
    name: "Social Media Illusion",
    slug: "social-media-illusion",
    description: "Trompe-l'\u0153il effect with subject stepping out of phone screen",
    prompt: "A trompe-l'\u0153il illusion of a [PERSON] in [CLOTHING] appearing to step out of a giant smartphone displaying a social media interface ([SOCIAL_APP]). The screen shows a username '@[USERNAME]', 1K likes, and 12\u201320 comments, with floating emojis (heart eyes, smiley faces). Background of your choice.",
    instructions: "Creates viral-worthy social media content with eye-catching 3D illusion effects. Customize the person, clothing, social app, and username to match your brand or personal style. Great for Instagram, TikTok, and Facebook posts.",
    category: "Social Media",
    style: "illusion",
    model: "flux-1",
    creditCost: 7
  },
  {
    name: "Product Showcase",
    slug: "product-showcase",
    description: "Professional product photography with studio lighting",
    prompt: "Professional product photography of [PRODUCT] with studio lighting setup. Clean white background, multiple light sources creating soft shadows, high-end commercial photography style. The product is positioned at the optimal angle showing its key features.",
    instructions: "Ideal for e-commerce listings, catalogs, and marketing materials. Replace [PRODUCT] with your specific item and describe any special features or angles you want highlighted. Produces commercial-quality results.",
    category: "Marketing",
    style: "commercial",
    model: "flux-1-pro",
    creditCost: 6
  },
  {
    name: "Logo Text Overlay",
    slug: "logo-text-overlay",
    description: "Add professional text overlays and branding elements",
    prompt: "Add professional text overlay '[TEXT]' to the image with modern typography. The text should be well-integrated with appropriate contrast and positioning. Include subtle branding elements and maintain visual hierarchy.",
    instructions: "Enhance any image with professional text overlays. Replace [TEXT] with your specific message, brand name, or call-to-action. Perfect for social media posts, advertisements, and branded content.",
    category: "Marketing",
    style: "typography",
    model: "flux-1",
    creditCost: 2
  },
  {
    name: "Abstract Art Generator",
    slug: "abstract-art-generator",
    description: "Generate flowing abstract compositions with color harmony",
    prompt: "Abstract art composition with flowing organic shapes in [COLOR_PALETTE] color palette. The design should have smooth gradients, dynamic movement, and balanced composition. Style: modern, minimalist, with subtle texture details.",
    instructions: "Create unique abstract artwork for galleries, prints, or digital displays. Specify your preferred color palette (e.g., warm tones, cool blues, monochrome) for personalized results. Great for interior design and artistic projects.",
    category: "Digital Art",
    style: "abstract",
    model: "flux-1",
    creditCost: 4
  },
  {
    name: "Cyberpunk Portrait",
    slug: "cyberpunk-portrait",
    description: "Cyberpunk-style portraits with neon and digital effects",
    prompt: "Cyberpunk portrait of [SUBJECT] with neon lighting, digital glitch effects, and futuristic elements. Dark urban background with pink and blue neon lights. High contrast, dramatic lighting, detailed digital art style.",
    instructions: "Transform any subject into a stunning cyberpunk character. Describe the subject (person, character, or object) to customize the portrait. Perfect for gaming avatars, artistic projects, and futuristic design concepts.",
    category: "Digital Art",
    style: "cyberpunk",
    model: "flux-1-pro",
    creditCost: 6
  },
  // Video Recipes
  {
    name: "Character Idle Animation",
    slug: "character-idle-animation",
    description: "Create subtle breathing and movement animations for character portraits",
    prompt: "Generate a 2-second looping idle animation of [CHARACTER]. The character should have subtle breathing movement, gentle eye blinks, and slight head movements. The animation should be smooth and natural, perfect for avatars, game characters, or digital portraits. Background remains static while only the character moves.",
    instructions: "Perfect for gaming avatars, digital characters, and interactive portraits. Specify character details and desired subtle movements. Best used for profile pictures and character showcases.",
    category: "Video Animation",
    style: "character",
    model: "runway-gen3",
    creditCost: 8,
    generationType: "video",
    videoDuration: 2
  },
  {
    name: "Morph Between Videos",
    slug: "morph-between-videos",
    description: "Seamlessly transition between two different video clips or images",
    prompt: "Create a 5-second morphing transition from [SOURCE_VIDEO/IMAGE] to [TARGET_VIDEO/IMAGE]. The transformation should be smooth and visually appealing, with intermediate frames that blend the two sources naturally. Maintain consistent lighting and perspective throughout the morph.",
    instructions: "Great for before/after transformations, product variations, or creative transitions. Upload source and target content, specify transition style. Works with both videos and images.",
    category: "Video Transition",
    style: "morph",
    model: "runway-gen3",
    creditCost: 12,
    generationType: "video",
    videoDuration: 5
  },
  {
    name: "Animate Video",
    slug: "animate-static-image",
    description: "Bring static images to life with natural movement and dynamics",
    prompt: "Animate this static image: [IMAGE_DESCRIPTION]. Add realistic movement such as [MOVEMENT_TYPE] over 10 seconds. The animation should feel natural and enhance the original image without distorting key elements. Maintain image quality while adding compelling motion.",
    instructions: "Transform static artwork, photos, or illustrations into dynamic videos. Specify movement type like flowing water, swaying trees, floating objects, or camera movements. Perfect for social media and presentations.",
    category: "Video Animation",
    style: "animation",
    model: "runway-gen3",
    creditCost: 15,
    generationType: "video",
    videoDuration: 10
  },
  {
    name: "Zoom In",
    slug: "cinematic-zoom-in",
    description: "Create dramatic zoom-in effects with professional camera movement",
    prompt: "Generate a 2-second cinematic zoom-in shot starting from [WIDE_SHOT_DESCRIPTION] and smoothly zooming into [CLOSE_UP_TARGET]. The movement should be steady and professional, with slight easing at the beginning and end. Maintain focus and clarity throughout the zoom.",
    instructions: "Perfect for dramatic reveals, product showcases, or emphasis shots. Specify starting composition and zoom target. Great for marketing videos and storytelling.",
    category: "Video Camera Movement",
    style: "cinematic",
    model: "runway-gen3",
    creditCost: 6,
    generationType: "video",
    videoDuration: 2
  },
  {
    name: "Product Rotation 360\xB0",
    slug: "product-rotation-360",
    description: "Smooth 360-degree product rotation for e-commerce and showcases",
    prompt: "Create a 6-second smooth 360-degree rotation of [PRODUCT] on a clean background. The product should rotate at a consistent speed with professional lighting that highlights all angles. Background should be neutral and the product should remain in perfect focus throughout.",
    instructions: "Essential for e-commerce, product launches, and portfolio presentations. Specify product details and preferred background. Creates professional product showcase videos.",
    category: "Video Product",
    style: "rotation",
    model: "runway-gen3",
    creditCost: 10,
    generationType: "video",
    videoDuration: 6
  },
  {
    name: "Text Reveal Animation",
    slug: "text-reveal-animation",
    description: "Dynamic text animations with engaging reveal effects",
    prompt: "Create a 3-second text reveal animation for '[TEXT_CONTENT]'. The text should appear with [ANIMATION_STYLE] effect against [BACKGROUND_DESCRIPTION]. Typography should be bold and readable, with smooth timing and professional presentation.",
    instructions: "Perfect for titles, quotes, announcements, and social media content. Specify text content, animation style (typewriter, fade, slide, etc.), and background preferences.",
    category: "Video Text",
    style: "typography",
    model: "runway-gen3",
    creditCost: 7,
    generationType: "video",
    videoDuration: 3
  },
  {
    name: "Parallax Scroll Effect",
    slug: "parallax-scroll-effect",
    description: "Create depth with layered parallax scrolling animations",
    prompt: "Generate a 8-second parallax scrolling effect with [SCENE_DESCRIPTION]. Different layers should move at varying speeds to create depth - foreground elements move faster, background elements slower. The effect should be smooth and immersive.",
    instructions: "Great for website headers, storytelling, and immersive experiences. Describe scene layers and scrolling direction. Creates engaging depth and movement.",
    category: "Video Effect",
    style: "parallax",
    model: "runway-gen3",
    creditCost: 12,
    generationType: "video",
    videoDuration: 8
  },
  {
    name: "Cinemagraph Loop",
    slug: "cinemagraph-loop",
    description: "Create mesmerizing cinemagraphs with selective motion",
    prompt: "Generate a 4-second seamless cinemagraph where [MOVING_ELEMENT] moves continuously while everything else remains perfectly still. The loop should be invisible and hypnotic, focusing attention on the single moving element against a static scene.",
    instructions: "Perfect for social media, web backgrounds, and artistic presentations. Specify which element should move (water, hair, smoke, etc.) while keeping the rest frozen in time.",
    category: "Video Cinemagraph",
    style: "loop",
    model: "runway-gen3",
    creditCost: 9,
    generationType: "video",
    videoDuration: 4
  },
  {
    name: "Cats in Video Games",
    slug: "cats-in-video-games",
    description: "Generate imaginative video game scenes featuring cats in various gaming environments",
    prompt: "Create an imaginative video game scene featuring [CAT_COUNT] with the following color(s): [CAT_COLORS]. The setting should be inspired by a [GAME_GENRE] environment. Picture a world with [SETTING_DESCRIPTION], reminiscent of classic titles but entirely original. Think of the atmosphere and tone, not any specific characters or IP. The cats are engaged in the following activity: [ACTION_DESCRIPTION]. Their behavior should be dynamic, playful, or dramatic depending on the tone of the action. The game is viewed from a [CAMERA_STYLE] perspective, consistent with classic game design approaches such as side-scrollers, top-down adventures, or immersive open-world cameras. Ensure the scene captures the feel of a compelling, stylized video game moment \u2014 vibrant, expressive, and rich with environmental storytelling.",
    instructions: "Create unique video game-inspired artwork featuring cats in imaginative gaming environments. Customize the number of cats, their colors, game genre, setting atmosphere, actions, and camera perspective. Perfect for game concept art, character design, and whimsical gaming content.",
    category: "Gaming",
    style: "video-game",
    model: "flux-1",
    creditCost: 8
  }
];
async function expandTagHighlights(recipes2) {
  const allTagIds = Array.from(new Set(recipes2.flatMap((r) => r.tagHighlights || [])));
  if (allTagIds.length === 0) return recipes2.map((r) => ({ ...r, tagHighlightsDetailed: [] }));
  const tagRows = await db.select().from(tags).where(inArray2(tags.id, allTagIds));
  const tagMap = Object.fromEntries(tagRows.map((tag) => [tag.id, tag]));
  return recipes2.map((r) => ({
    ...r,
    tagHighlightsDetailed: (r.tagHighlights || []).map((id) => tagMap[id]).filter(Boolean).filter((tag) => !tag.isHidden)
    // Only show public tags
  }));
}
async function registerRoutes(app2) {
  app2.use(express2.static(path3.join(process.cwd(), "public")));
  app2.use(session({
    secret: process.env.SESSION_SECRET || "dev-secret-key",
    resave: true,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1e3,
      // 24 hours
      httpOnly: true,
      sameSite: "lax"
    }
  }));
  app2.use(unifiedAuthMiddleware);
  const existingRecipes = await storage.getAllRecipes();
  if (existingRecipes.length === 0) {
    console.log("Seeding initial recipes...");
    for (const recipe of INITIAL_RECIPES) {
      await storage.createRecipe({
        name: recipe.name,
        slug: recipe.slug,
        description: recipe.description,
        prompt: recipe.prompt,
        instructions: recipe.instructions,
        category: recipe.category,
        style: recipe.style,
        model: recipe.model,
        creditCost: recipe.creditCost,
        usageCount: 0,
        isActive: true,
        recipeSteps: [{ id: "1", type: "text_prompt", config: { prompt: recipe.prompt } }],
        generationType: recipe.generationType || "image",
        videoDuration: recipe.videoDuration || 10
      });
    }
    console.log("Recipes seeded successfully!");
  }
  const pinecone2 = await initializePinecone();
  const allRecipes = await storage.getAllRecipes();
  const disableEmbeddings = process.env.DISABLE_VECTOR_EMBEDDINGS === "true";
  if (pinecone2 && allRecipes.length > 0 && !disableEmbeddings) {
    console.log("Initializing recipe embeddings...");
    await initializeRecipeEmbeddings(allRecipes);
  } else if (disableEmbeddings) {
    console.log("Vector embedding initialization disabled via DISABLE_VECTOR_EMBEDDINGS=true");
  }
  const authService = UnifiedAuthService.getInstance();
  await authService.initializeDebugUsers();
  app2.use("/api/auth", unified_auth_router_default);
  app2.use("/api/admin", admin_router_default);
  app2.use("/api/payments", payment_router_default);
  app2.use("/api/brand-assets", brand_asset_router_default);
  app2.use("/api/media-library", media_library_router_default);
  app2.use("/api/samples", sample_gallery_router_default);
  app2.use("/api/openai", openai_service_router_default);
  app2.get("/api/openai/image-generator-1/docs", (req, res) => {
    res.json({
      service: "OpenAI Image Generator 1 (DALL-E 3)",
      version: "1.0.0",
      model: "dall-e-3",
      endpoints: {
        "POST /api/openai/image-generator-1/generate": {
          description: "Generate images using DALL-E 3",
          authentication: "Required",
          parameters: {
            prompt: { type: "string", required: true, maxLength: 4e3 },
            size: { type: "enum", options: ["1024x1024", "1024x1792", "1792x1024"], default: "1024x1024" },
            quality: { type: "enum", options: ["standard", "hd"], default: "standard" },
            style: { type: "enum", options: ["vivid", "natural"], default: "vivid" },
            useCase: { type: "string", optional: true, description: "Auto-optimize settings for use case" },
            enhancePrompt: { type: "boolean", default: false, description: "Automatically enhance prompt" }
          },
          response: {
            success: "boolean",
            generation: {
              id: "number",
              imageUrl: "string",
              assetId: "string",
              metadata: "object"
            },
            creditsUsed: "number",
            remainingCredits: "number"
          }
        },
        "POST /api/openai/image-generator-1/validate-prompt": {
          description: "Validate prompt against DALL-E 3 constraints",
          parameters: { prompt: { type: "string", required: true } },
          response: { isValid: "boolean", error: "string?" }
        },
        "GET /api/openai/image-generator-1/optimal-settings/:useCase": {
          description: "Get optimal settings for specific use cases",
          useCases: ["portrait", "landscape", "social_media", "professional"],
          response: { useCase: "string", settings: "object", estimatedCredits: "number" }
        },
        "POST /api/openai/image-generator-1/enhance-prompt": {
          description: "Enhance prompt for better results",
          parameters: {
            prompt: { type: "string", required: true },
            style: { type: "string", optional: true }
          },
          response: { originalPrompt: "string", enhancedPrompt: "string", style: "string" }
        },
        "GET /api/openai/image-generator-1/pricing": {
          description: "Get pricing information and supported options",
          response: {
            model: "string",
            baseCredits: "number",
            pricing: "array",
            supportedSizes: "array",
            supportedQualities: "array",
            supportedStyles: "array"
          }
        },
        "GET /api/openai/image-generator-1/health": {
          description: "Check service health and configuration",
          response: {
            status: "string",
            service: "string",
            promptValidation: "boolean",
            apiKeyConfigured: "boolean",
            s3Configured: "boolean"
          }
        }
      },
      examples: {
        basicGeneration: {
          prompt: "A futuristic robot in a cyberpunk city with neon lights",
          size: "1024x1024",
          quality: "standard",
          style: "vivid"
        },
        portraitGeneration: {
          prompt: "Professional headshot of a confident businesswoman",
          useCase: "portrait",
          enhancePrompt: true
        },
        hdLandscape: {
          prompt: "Majestic mountain landscape at golden hour",
          size: "1792x1024",
          quality: "hd",
          style: "natural"
        }
      }
    });
  });
  app2.use("/uploads", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  }, express2.static("uploads"));
  app2.get("/api/recipes", async (req, res) => {
    try {
      const recipes2 = await storage.getAllRecipes();
      const recipesWithTags = await expandTagHighlights(recipes2);
      res.json(recipesWithTags);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      res.status(500).json({ message: "Failed to fetch recipes" });
    }
  });
  app2.get("/api/recipes/by-category", async (req, res) => {
    try {
      console.log("\u{1F50D} Fetching recipes by category...");
      const recipes2 = await storage.getAllRecipes();
      console.log(`\u{1F4CA} Found ${recipes2.length} recipes`);
      const categoryTags = await db.select().from(tags).where(and6(
        eq7(tags.isHidden, true),
        like(tags.name, "category:%")
      )).orderBy(tags.name);
      console.log(`\u{1F3F7}\uFE0F Found ${categoryTags.length} category tags:`, categoryTags.map((t) => t.name));
      const recipesByCategory = {};
      for (const categoryTag of categoryTags) {
        const categoryName = categoryTag.name.replace("category:", "");
        recipesByCategory[categoryName] = [];
        for (const recipe of recipes2) {
          if (recipe.tagHighlights && recipe.tagHighlights.includes(categoryTag.id)) {
            recipesByCategory[categoryName].push(recipe);
          }
        }
        console.log(`\u{1F4C1} Category '${categoryName}': ${recipesByCategory[categoryName].length} recipes`);
      }
      const categorizedRecipeIds = new Set(
        Object.values(recipesByCategory).flat().map((r) => r.id)
      );
      const uncategorizedRecipes = recipes2.filter((r) => !categorizedRecipeIds.has(r.id));
      if (uncategorizedRecipes.length > 0) {
        recipesByCategory["uncategorized"] = uncategorizedRecipes;
        console.log(`\u2753 Uncategorized: ${uncategorizedRecipes.length} recipes`);
      }
      console.log("\u2705 Sending response:", Object.keys(recipesByCategory));
      res.json(recipesByCategory);
    } catch (error) {
      console.error("\u274C Error fetching recipes by category:", error);
      res.status(500).json({ error: "Failed to fetch recipes by category", details: error instanceof Error ? error.message : "Unknown error" });
    }
  });
  app2.post("/api/test-generation", requireAuth, async (req, res) => {
    try {
      const { prompt = "a beautiful sunset over mountains" } = req.body;
      const result = await falService.generateImage(prompt, "flux-1-schnell", "photorealistic");
      res.json({ success: true, result });
    } catch (error) {
      console.error("FAL test error:", error);
      res.status(500).json({
        error: "FAL API test failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.post("/api/recipes/search", async (req, res) => {
    try {
      const { query, type } = req.body;
      if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Query is required" });
      }
      const allRecipes2 = await storage.getAllRecipes();
      const localResults = allRecipes2.filter((recipe) => {
        const matchesType = !type || type === "video" && recipe.category.toLowerCase().includes("video") || type === "image" && !recipe.category.toLowerCase().includes("video");
        const matchesQuery = recipe.name.toLowerCase().includes(query.toLowerCase()) || recipe.description.toLowerCase().includes(query.toLowerCase()) || recipe.category.toLowerCase().includes(query.toLowerCase());
        return matchesType && matchesQuery;
      });
      const vectorResults = await searchRecipesByVector(query, type, 10);
      const combinedResults = /* @__PURE__ */ new Map();
      localResults.forEach((recipe) => {
        combinedResults.set(recipe.id, { ...recipe, score: 1, source: "local" });
      });
      vectorResults.forEach((result) => {
        const existingRecipe = allRecipes2.find((r) => r.id === result.recipeId);
        if (existingRecipe && !combinedResults.has(result.recipeId)) {
          combinedResults.set(result.recipeId, {
            ...existingRecipe,
            score: result.score,
            source: "vector"
          });
        }
      });
      const finalResults = Array.from(combinedResults.values()).sort((a, b) => b.score - a.score).slice(0, 20);
      res.json(finalResults);
    } catch (error) {
      console.error("Error searching recipes:", error);
      res.status(500).json({ error: "Search failed" });
    }
  });
  app2.get("/api/recipes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const recipe = await storage.getRecipeById(id);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      res.json(recipe);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      res.status(500).json({ message: "Failed to fetch recipe" });
    }
  });
  app2.get("/api/recipes/slug/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const recipe = await storage.getRecipeBySlug(slug);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      res.json(recipe);
    } catch (error) {
      console.error("Error fetching recipe by slug:", error);
      res.status(500).json({ message: "Failed to fetch recipe" });
    }
  });
  app2.put("/api/recipes/:id", async (req, res) => {
    try {
      const recipeId = parseInt(req.params.id);
      const updates = req.body;
      if (isNaN(recipeId)) {
        return res.status(400).json({ message: "Invalid recipe ID" });
      }
      const existingRecipe = await storage.getRecipeById(recipeId);
      if (!existingRecipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      const updatedRecipe = await storage.updateRecipe(recipeId, updates);
      res.json({
        message: "Recipe updated successfully",
        recipe: updatedRecipe
      });
    } catch (error) {
      console.error("Error updating recipe:", error);
      res.status(500).json({ message: "Failed to update recipe" });
    }
  });
  app2.put("/api/recipes/slug/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const updates = req.body;
      const existingRecipe = await storage.getRecipeBySlug(slug);
      if (!existingRecipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      const updatedRecipe = await storage.updateRecipe(existingRecipe.id, updates);
      res.json({
        message: "Recipe updated successfully",
        recipe: updatedRecipe
      });
    } catch (error) {
      console.error("Error updating recipe:", error);
      res.status(500).json({ message: "Failed to update recipe" });
    }
  });
  app2.post("/api/recipes", requireAuth, async (req, res) => {
    try {
      const userId = req.userAccount.id;
      const {
        name,
        description,
        category,
        type,
        isPublic,
        hasContentRestrictions,
        steps
      } = req.body;
      const slug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").trim();
      let referralCode = null;
      if (isPublic && !hasContentRestrictions) {
        referralCode = Math.random().toString(36).substring(2, 12).toUpperCase();
      }
      const recipe = await storage.createRecipe({
        name,
        slug,
        description,
        category,
        prompt: steps[0]?.config?.prompt || "",
        instructions: `User-created ${type} generation recipe`,
        style: "custom",
        model: type === "video" ? "fal-video" : "flux-pro",
        creditCost: type === "video" ? 5 : 2,
        usageCount: 0,
        creatorId: userId,
        isPublic,
        hasContentRestrictions,
        revenueShareEnabled: true,
        revenueSharePercentage: 20,
        recipeSteps: steps,
        generationType: type,
        referralCode,
        isActive: true
      });
      res.json(recipe);
    } catch (error) {
      console.error("Error creating recipe:", error);
      res.status(500).json({ message: "Failed to create recipe" });
    }
  });
  app2.post("/api/generate", requireAuth, async (req, res) => {
    try {
      const userId = req.userAccount.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { recipeId, formData, isFlashRequest = false } = req.body;
      const recipe = await storage.getRecipeById(recipeId);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      const { creditsRemaining, allowDebit } = getGenerationLimits(req.userAccount);
      if (creditsRemaining < recipe.creditCost && !allowDebit) {
        return res.status(400).json({ message: "Insufficient credits" });
      }
      const { SmartGenerator: SmartGenerator2 } = await Promise.resolve().then(() => (init_smart_generator(), smart_generator_exports));
      const smartGenerator2 = new SmartGenerator2();
      let finalPrompt;
      let generationMetadata = {};
      if (isFlashRequest) {
        const backlogVideo = await smartGenerator2.getRandomBacklogVideo(recipeId);
        if (!backlogVideo) {
          console.log(`No backlog videos available for recipe ${recipeId} - should fallback to modal`);
          return res.status(404).json({
            message: "No backlog videos available for this recipe. Try Build mode instead.",
            shouldFallbackToModal: true
          });
        }
        const backlogVariables = backlogVideo.recipeVariables;
        const processedResult = processRecipePrompt(recipe, backlogVariables);
        finalPrompt = processedResult.prompt;
        generationMetadata = {
          formData: backlogVariables,
          isFlashRequest: true,
          backlogVideoId: backlogVideo.id
        };
        const dummyRequestId = 0;
        await storage.markBacklogVideoAsUsed(backlogVideo.id, dummyRequestId);
      } else {
        if (formData) {
          const validation = validateRecipeFormData(recipe, formData);
          if (!validation.isValid) {
            return res.status(400).json({
              message: "Invalid form data",
              errors: validation.errors
            });
          }
          const processedResult = processRecipePrompt(recipe, formData);
          finalPrompt = processedResult.prompt;
          generationMetadata = { formData, isFlashRequest: false };
        } else {
          const { parameters } = req.body;
          finalPrompt = recipe.prompt;
          if (parameters) {
            Object.entries(parameters).forEach(([key, value]) => {
              finalPrompt = finalPrompt.replace(new RegExp(`\\[${key}\\]`, "g"), value);
            });
          }
          generationMetadata = { originalParameters: parameters, isFlashRequest: false };
        }
      }
      const generation = await storage.createGeneration({
        userId,
        recipeId,
        prompt: finalPrompt,
        status: "pending",
        recipeTitle: recipe.name,
        creditsCost: recipe.creditCost,
        metadata: {
          ...generationMetadata,
          request_origin: "user"
        }
      }, req.userAccount.sessionToken);
      const newCredits = user.credits - recipe.creditCost;
      await storage.updateUserCredits(userId, newCredits);
      await storage.createCreditTransaction({
        userId,
        amount: -recipe.creditCost,
        type: "usage",
        description: `Generated content using ${recipe.name}${isFlashRequest ? " (Flash)" : ""}`
      });
      await storage.incrementRecipeUsage(recipeId);
      const { generationQueue: generationQueue2 } = await Promise.resolve().then(() => (init_queue_service(), queue_service_exports));
      await generationQueue2.addToQueue(generation, generationMetadata.formData || {});
      res.json({
        message: isFlashRequest ? "Flash generation started" : "Generation started",
        generationId: generation.id,
        remainingCredits: newCredits,
        isFlashRequest
      });
    } catch (error) {
      console.error("Error starting generation:", error);
      res.status(500).json({ message: "Failed to start generation" });
    }
  });
  app2.get("/api/generate/availability", requireAuth, async (req, res) => {
    try {
      const { recipeId, formData } = req.query;
      if (!recipeId) {
        return res.status(400).json({ message: "Recipe ID is required" });
      }
      const { SmartGenerator: SmartGenerator2 } = await Promise.resolve().then(() => (init_smart_generator(), smart_generator_exports));
      const smartGenerator2 = new SmartGenerator2();
      let parsedFormData = {};
      if (formData) {
        try {
          parsedFormData = typeof formData === "string" ? JSON.parse(formData) : formData;
        } catch (e) {
          return res.status(400).json({ message: "Invalid formData format" });
        }
      }
      const availability = await smartGenerator2.checkBacklogAvailability(
        parseInt(recipeId),
        parsedFormData
      );
      res.json({
        hasBacklog: availability.hasBacklogEntry,
        backlogCount: availability.hasBacklogEntry ? 1 : 0,
        canFlash: availability.hasBacklogEntry && !availability.isUsed
      });
    } catch (error) {
      console.error("Error checking availability:", error);
      res.status(500).json({ message: "Failed to check availability" });
    }
  });
  app2.get("/api/user/generations", requireAuth, async (req, res) => {
    try {
      const userId = req.userAccount.id;
      const generations3 = await storage.getUserGenerations(userId);
      res.json(generations3.data);
    } catch (error) {
      console.error("Error fetching user generations:", error);
      res.status(500).json({ message: "Failed to fetch generations" });
    }
  });
  app2.get("/api/generations", requireAuth, async (req, res) => {
    try {
      const userId = req.userAccount.id;
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.per_page) || parseInt(req.query.limit) || 10));
      const offset = (page - 1) * limit;
      const status = req.query.status;
      const validStatuses = ["pending", "completed", "failed", "processing"];
      const statusFilter = status && validStatuses.includes(status) ? status : void 0;
      const generations3 = await storage.getUserGenerations(userId, { page, limit, offset, status: statusFilter });
      const generationsWithUrls = generations3.data.map((gen) => ({
        ...gen,
        // Always use user-bound URL for their own content
        viewUrl: gen.shortId ? `/m/${userId}/${gen.shortId}` : null,
        publicShareUrl: gen.shortId && gen.isPublic ? `/m/${gen.shortId}` : null,
        privateShareUrl: gen.shortId ? `/m/${userId}/${gen.shortId}` : null
      }));
      res.json({
        generations: generationsWithUrls,
        pagination: {
          page,
          limit,
          total: generations3.total,
          totalPages: Math.ceil(generations3.total / limit),
          hasNext: page < Math.ceil(generations3.total / limit),
          hasPrevious: page > 1
        }
      });
    } catch (error) {
      console.error("Error fetching generations:", error);
      res.status(500).json({ message: "Failed to fetch generations" });
    }
  });
  app2.post("/api/generations/:id/retry", requireAuth, async (req, res) => {
    try {
      const generationId = parseInt(req.params.id);
      const userId = req.userAccount.id;
      const generations3 = await storage.getUserGenerations(userId);
      const generation = generations3.data.find((g) => g.id === generationId);
      if (!generation) {
        return res.status(404).json({ error: "Generation not found" });
      }
      if (generation.status !== "failed") {
        return res.status(400).json({ error: "Can only retry failed generations" });
      }
      if (generation.retryCount >= generation.maxRetries) {
        return res.status(400).json({ error: "Maximum retry attempts exceeded" });
      }
      const retryGeneration = await storage.retryGeneration(generationId);
      if (!retryGeneration) {
        return res.status(400).json({ error: "Failed to retry generation" });
      }
      const formData = generation.metadata?.formData || {};
      const { generationQueue: generationQueue2 } = await Promise.resolve().then(() => (init_queue_service(), queue_service_exports));
      await generationQueue2.addToQueue(retryGeneration, formData);
      res.json({
        message: "Generation retry initiated",
        generation: retryGeneration
      });
    } catch (error) {
      console.error("Error retrying generation:", error);
      res.status(500).json({ error: "Failed to retry generation" });
    }
  });
  app2.get("/api/generations/:id/failure-details", requireAuth, async (req, res) => {
    try {
      const generationId = parseInt(req.params.id);
      const userId = req.userAccount.id;
      const generations3 = await storage.getUserGenerations(userId);
      const generation = generations3.data.find((g) => g.id === generationId);
      if (!generation) {
        return res.status(404).json({ error: "Generation not found" });
      }
      res.json({
        id: generation.id,
        status: generation.status,
        failureReason: generation.failureReason,
        retryCount: generation.retryCount,
        maxRetries: generation.maxRetries,
        canRetry: generation.status === "failed" && generation.retryCount < generation.maxRetries,
        creditsRefunded: generation.creditsRefunded,
        creditsCost: generation.creditsCost,
        createdAt: generation.createdAt,
        updatedAt: generation.updatedAt
      });
    } catch (error) {
      console.error("Error fetching failure details:", error);
      res.status(500).json({ error: "Failed to fetch failure details" });
    }
  });
  app2.get("/api/queue/stats", async (req, res) => {
    try {
      const stats = await storage.getQueueStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching queue stats:", error);
      res.status(500).json({ message: "Failed to fetch queue stats" });
    }
  });
  app2.post("/api/custom-video/create", requireAuth, async (req, res) => {
    try {
      const userId = req.userAccount.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const videoCost = 20;
      const { creditsRemaining, allowDebit } = getGenerationLimits(req.userAccount);
      if (creditsRemaining < videoCost && !allowDebit) {
        return res.status(400).json({
          message: "Insufficient credits",
          required: videoCost,
          available: creditsRemaining
        });
      }
      const { prompt, duration = 10, type = "custom_video" } = req.body;
      if (!prompt || prompt.trim().length === 0) {
        return res.status(400).json({ message: "Prompt is required" });
      }
      const generation = await storage.createGeneration({
        userId,
        recipeId: 0,
        // Custom video doesn't use a recipe, using 0 as placeholder
        recipeTitle: "Custom Video",
        prompt,
        status: "queued",
        metadata: JSON.stringify({
          duration: parseInt(duration),
          type,
          isCustomVideo: true,
          request_origin: "user"
        })
      }, req.userAccount.sessionToken);
      const newCredits = user.credits - videoCost;
      await storage.updateUserCredits(userId, newCredits);
      await storage.createCreditTransaction({
        userId,
        amount: -videoCost,
        type: "usage",
        description: `Custom video creation (${duration}s)`
      });
      setTimeout(async () => {
        try {
          await storage.updateGenerationStatus(generation.id, "processing");
          const videoOptions = {
            prompt,
            duration: parseInt(duration),
            provider: "fal",
            // Default for custom videos
            style: "cinematic",
            aspectRatio: "16:9",
            quality: "hd"
          };
          const videoResult = await videoRouter.generateVideo(videoOptions);
          if (videoResult.status === "completed" && videoResult.videoUrl) {
            await storage.updateGenerationStatus(generation.id, "completed", videoResult.videoUrl);
          } else {
            await storage.updateGenerationStatus(generation.id, "failed");
          }
        } catch (error) {
          console.error("Error processing custom video:", error);
          await storage.updateGenerationStatus(generation.id, "failed");
        }
      }, 2e3);
      res.json({
        message: "Custom video creation started",
        id: generation.id,
        remainingCredits: newCredits,
        estimatedTime: "30-60 seconds"
      });
    } catch (error) {
      console.error("Error creating custom video:", error);
      res.status(500).json({ message: "Failed to create custom video" });
    }
  });
  app2.post("/api/recipes/:id/generate-video", requireAuth, async (req, res) => {
    try {
      const userId = req.userAccount.id;
      const recipeId = parseInt(req.params.id);
      const { parameters, duration } = req.body;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const recipe = await storage.getRecipeById(recipeId);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      const videoCreditCost = recipe.creditCost * 3;
      const { creditsRemaining, allowDebit } = getGenerationLimits(req.userAccount);
      if (creditsRemaining < videoCreditCost && !allowDebit) {
        return res.status(400).json({
          message: "Insufficient credits for video generation",
          required: videoCreditCost,
          available: creditsRemaining
        });
      }
      let prompt = recipe.prompt;
      if (parameters && typeof parameters === "object") {
        Object.entries(parameters).forEach(([key, value]) => {
          prompt = prompt.replace(new RegExp(`\\[${key}\\]`, "g"), value);
        });
      }
      const generation = await storage.createGeneration({
        userId,
        recipeId,
        prompt,
        status: "pending",
        recipeTitle: `${recipe.name} (Video)`,
        metadata: JSON.stringify({
          type: "video",
          duration: duration || recipe.videoDuration || 10,
          provider: recipe.videoProvider || "fal",
          request_origin: "user"
        })
      }, req.userAccount.sessionToken);
      const newCredits = user.credits - videoCreditCost;
      await storage.updateUserCredits(userId, newCredits);
      await storage.createCreditTransaction({
        userId,
        amount: -videoCreditCost,
        type: "usage",
        description: `Generated video using ${recipe.name}`
      });
      await storage.incrementRecipeUsage(recipeId);
      setTimeout(async () => {
        try {
          await storage.updateGenerationStatus(generation.id, "processing");
          const optimalSettings = videoRouter.getOptimalSettings(recipe.model, recipe.style);
          const videoOptions = {
            prompt,
            duration: duration || 10,
            provider: recipe.videoProvider || optimalSettings.provider || "fal",
            style: recipe.style,
            aspectRatio: recipe.videoAspectRatio || optimalSettings.aspectRatio || "16:9",
            quality: recipe.videoQuality || optimalSettings.quality || "hd"
          };
          const videoResult = await videoRouter.generateVideo(videoOptions);
          if (videoResult.status === "completed" && videoResult.videoUrl) {
            await storage.updateGenerationStatus(generation.id, "completed", videoResult.videoUrl);
          } else {
            await storage.updateGenerationStatus(generation.id, "failed");
          }
        } catch (error) {
          console.error("Error generating video:", error);
          await storage.updateGenerationStatus(generation.id, "failed");
        }
      }, 2e3);
      res.json({
        message: "Video generation started",
        generationId: generation.id,
        remainingCredits: newCredits,
        estimatedTime: "30-120 seconds",
        provider: recipe.videoProvider || "fal"
      });
    } catch (error) {
      console.error("Error starting video generation:", error);
      res.status(500).json({ message: "Failed to start video generation" });
    }
  });
  app2.get("/api/user/transactions", requireAuth, async (req, res) => {
    try {
      const userId = req.userAccount.id;
      const transactions = await storage.getUserCreditTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });
  app2.post("/api/credits/purchase", requireAuth, async (req, res) => {
    try {
      const userId = req.userAccount.id;
      const { amount, package: packageType } = req.body;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const newCredits = user.credits + amount;
      await storage.updateUserCredits(userId, newCredits);
      await storage.createCreditTransaction({
        userId,
        amount,
        type: "purchase",
        description: `Purchased ${packageType} credit package`
      });
      res.json({
        message: "Credits purchased successfully",
        newBalance: newCredits
      });
    } catch (error) {
      console.error("Error purchasing credits:", error);
      res.status(500).json({ message: "Failed to purchase credits" });
    }
  });
  app2.get("/api/image/providers", requireAuth, async (req, res) => {
    try {
      const providers2 = {
        fal: {
          available: await imageRouter.checkProviderAvailability("fal"),
          features: imageRouter.getSupportedFeatures("fal")
        },
        openai: {
          available: await imageRouter.checkProviderAvailability("openai"),
          features: imageRouter.getSupportedFeatures("openai")
        },
        midjourney: {
          available: await imageRouter.checkProviderAvailability("midjourney"),
          features: imageRouter.getSupportedFeatures("midjourney")
        }
      };
      res.json(providers2);
    } catch (error) {
      console.error("Error checking image provider availability:", error);
      res.status(500).json({ message: "Failed to check image provider availability" });
    }
  });
  app2.get("/api/video/providers", requireAuth, async (req, res) => {
    try {
      const providers2 = {
        fal: {
          available: await videoRouter.checkProviderAvailability("fal"),
          features: videoRouter.getSupportedFeatures("fal")
        },
        openai: {
          available: await videoRouter.checkProviderAvailability("openai"),
          features: videoRouter.getSupportedFeatures("openai")
        }
      };
      res.json(providers2);
    } catch (error) {
      console.error("Error checking provider availability:", error);
      res.status(500).json({ message: "Failed to check provider availability" });
    }
  });
  app2.post("/api/image/test", requireAuth, async (req, res) => {
    try {
      const {
        prompt = "a beautiful landscape photograph",
        provider = "fal",
        style = "photorealistic",
        quality = "hd",
        imageSize = "landscape_4_3"
      } = req.body;
      const imageOptions = {
        prompt,
        provider,
        style,
        quality,
        imageSize,
        numImages: 1
      };
      const result = await imageRouter.generateImage(imageOptions);
      res.json({ success: true, result });
    } catch (error) {
      console.error("Image test error:", error);
      res.status(500).json({
        error: "Image generation test failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.post("/api/video/test", requireAuth, async (req, res) => {
    try {
      const { prompt = "a beautiful cinematic scene", provider = "fal", duration = 5 } = req.body;
      const videoOptions = {
        prompt,
        duration,
        provider,
        style: "cinematic",
        aspectRatio: "16:9",
        quality: "hd"
      };
      const result = await videoRouter.generateVideo(videoOptions);
      res.json({ success: true, result });
    } catch (error) {
      console.error("Video test error:", error);
      res.status(500).json({
        error: "Video generation test failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.post("/api/video/kling-generate", requireAuth, async (req, res) => {
    try {
      const {
        prompt,
        aspect_ratio = "9:16",
        duration = "8s",
        generate_audio = true,
        seed
      } = req.body;
      if (!prompt) {
        return res.status(400).json({
          message: "Prompt is required"
        });
      }
      console.log("Generating video with Kling AI 2.1:", {
        prompt,
        aspect_ratio,
        duration,
        generate_audio,
        seed
      });
      const result = await falService.generateTextToVideoWithKling({
        prompt,
        aspect_ratio,
        duration,
        generate_audio,
        seed
      });
      res.json({
        success: true,
        video: result,
        message: "Kling AI 2.1 video generated successfully"
      });
    } catch (error) {
      console.error("Error in Kling AI 2.1 video generation:", error);
      res.status(500).json({
        message: "Failed to generate video with Kling AI 2.1",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/api/video/test-kling", requireAuth, async (req, res) => {
    try {
      const testPrompt = "A majestic eagle soaring through mountain peaks at golden hour, cinematic lighting, smooth motion";
      console.log("Testing Kling AI 2.1 with:", testPrompt);
      const result = await falService.generateTextToVideoWithKling({
        prompt: testPrompt,
        aspect_ratio: "9:16",
        duration: "8s",
        generate_audio: true
      });
      res.json({
        success: true,
        test: true,
        result,
        message: "Kling AI 2.1 test completed"
      });
    } catch (error) {
      console.error("Error in Kling AI 2.1 test:", error);
      res.status(500).json({
        message: "Kling AI 2.1 test failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.post("/api/video/enhanced-kling-generate", requireAuth, async (req, res) => {
    try {
      const { prompt, style = "cinematic", imageOptions = {}, useMMAudio = true } = req.body;
      if (!prompt) {
        return res.status(400).json({
          message: "Prompt is required"
        });
      }
      console.log("Generating enhanced video with Kling AI 2.1 workflow:", { prompt, style, useMMAudio });
      const result = await falService.generateEnhancedVideoWithKling(prompt, style, imageOptions, useMMAudio);
      res.json({
        success: true,
        video: result,
        message: `Enhanced video with Kling AI 2.1 workflow generated successfully${result.mmaudioUsed ? " (with MMAudio)" : ""}`
      });
    } catch (error) {
      console.error("Error in enhanced Kling AI 2.1 video generation:", error);
      res.status(500).json({
        message: "Failed to generate enhanced video with Kling AI 2.1 workflow",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/api/video/test-enhanced-kling", requireAuth, async (req, res) => {
    try {
      const testPrompt = "A majestic eagle soaring through mountain peaks at golden hour, cinematic lighting, smooth motion";
      console.log("Testing enhanced Kling AI 2.1 workflow with:", testPrompt);
      const result = await falService.generateEnhancedVideoWithKling(testPrompt, "cinematic");
      res.json({
        success: true,
        test: true,
        result,
        message: "Enhanced Kling AI 2.1 workflow test completed"
      });
    } catch (error) {
      console.error("Error in enhanced Kling AI 2.1 workflow test:", error);
      res.status(500).json({
        message: "Enhanced Kling AI 2.1 workflow test failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.post("/api/recipes/process-prompt", requireAuth, async (req, res) => {
    try {
      const { recipeId, formData } = req.body;
      if (!recipeId || !formData) {
        return res.status(400).json({
          message: "Recipe ID and form data are required"
        });
      }
      const recipe = await storage.getRecipeById(recipeId);
      if (!recipe) {
        return res.status(404).json({
          message: "Recipe not found"
        });
      }
      const { processRecipePrompt: processRecipePrompt2 } = await Promise.resolve().then(() => (init_recipe_processor(), recipe_processor_exports));
      const processedResult = processRecipePrompt2(recipe, formData);
      res.json({
        success: true,
        prompt: processedResult.prompt,
        extractedVariables: processedResult.extractedVariables
      });
    } catch (error) {
      console.error("Recipe prompt processing error:", error);
      res.status(500).json({
        error: "Recipe prompt processing failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/api/generations/:id", async (req, res) => {
    try {
      const generationId = parseInt(req.params.id);
      const userId = req.userAccount?.id || null;
      const generation = await storage.getGenerationById(generationId);
      if (!generation) {
        return res.status(404).json({ message: "Generation not found" });
      }
      if (generation.userId !== userId && !generation.isPublic) {
        return res.status(403).json({ message: "Access denied" });
      }
      const recipe = generation.recipeId ? await storage.getRecipeById(generation.recipeId) : null;
      const creator = await storage.getUser(generation.userId);
      res.json({
        id: generation.id,
        assetId: generation.assetId,
        shortId: generation.shortId,
        imageUrl: generation.imageUrl || generation.secureUrl,
        secureUrl: generation.secureUrl,
        videoUrl: generation.videoUrl,
        type: generation.type,
        status: generation.status,
        prompt: generation.prompt,
        isPublic: generation.isPublic,
        metadata: generation.metadata,
        createdAt: generation.createdAt,
        creditsCost: generation.creditsCost,
        // For logged-in users viewing their own content, use private URL; for public access, use public URL if available
        viewUrl: generation.shortId ? userId && userId !== "undefined" ? `/m/${userId}/${generation.shortId}` : `/m/${generation.shortId}` : null,
        publicShareUrl: generation.shortId && generation.isPublic ? `/m/${generation.shortId}` : null,
        privateShareUrl: generation.shortId && userId ? `/m/${userId}/${generation.shortId}` : null,
        recipe: recipe ? {
          id: recipe.id,
          name: recipe.name,
          slug: recipe.slug,
          category: recipe.category
        } : null,
        creator: creator ? {
          id: creator.id,
          handle: creator.handle,
          firstName: creator.firstName,
          lastName: creator.lastName
        } : null
      });
    } catch (error) {
      console.error("Error fetching generation:", error);
      res.status(500).json({ message: "Failed to fetch generation" });
    }
  });
  app2.patch("/api/generations/:id/privacy", requireAuth, async (req, res) => {
    try {
      const generationId = parseInt(req.params.id);
      const userId = req.userAccount.id;
      const { isPublic } = req.body;
      const generation = await storage.getGenerationById(generationId);
      if (!generation) {
        return res.status(404).json({ message: "Generation not found" });
      }
      if (generation.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      await storage.updateGenerationPrivacy(generationId, isPublic);
      res.json({
        message: "Privacy setting updated",
        isPublic,
        publicShareUrl: generation.shortId && isPublic ? `/m/${generation.shortId}` : null
      });
    } catch (error) {
      console.error("Error updating privacy:", error);
      res.status(500).json({ message: "Failed to update privacy setting" });
    }
  });
  app2.get("/m/:shortId", async (req, res) => {
    try {
      const { shortId } = req.params;
      const generation = await storage.getGenerationByShortId(shortId);
      if (!generation) {
        return res.status(404).json({ message: "Media not found" });
      }
      if (!generation.isPublic) {
        return res.status(403).json({ message: "This media is private" });
      }
      const mediaUrl = generation.secureUrl || generation.imageUrl;
      if (mediaUrl && typeof mediaUrl === "string") {
        return res.redirect(mediaUrl);
      }
      return res.status(404).json({ message: "Media file not available" });
    } catch (error) {
      console.error("Error serving public media:", error);
      res.status(500).json({ message: "Failed to serve media" });
    }
  });
  app2.get("/m/:userId/:shortId", requireAuth, async (req, res) => {
    try {
      const { userId, shortId } = req.params;
      const requestingUserId = req.userAccount.id;
      const generation = await storage.getGenerationByShortId(shortId);
      if (!generation) {
        return res.status(404).json({ message: "Media not found" });
      }
      if (generation.userId !== userId) {
        return res.status(404).json({ message: "Media not found" });
      }
      if (generation.userId !== requestingUserId && !generation.isPublic) {
        return res.status(403).json({ message: "Access denied" });
      }
      const mediaUrl = generation.secureUrl || generation.imageUrl;
      if (mediaUrl && typeof mediaUrl === "string") {
        return res.redirect(mediaUrl);
      }
      return res.status(404).json({ message: "Media file not available" });
    } catch (error) {
      console.error("Error serving private media:", error);
      res.status(500).json({ message: "Failed to serve media" });
    }
  });
  app2.get("/api/assets/:assetId", async (req, res) => {
    try {
      const { assetId } = req.params;
      const generation = await storage.getGenerationByAssetId(assetId);
      if (!generation) {
        return res.status(404).json({ message: "Asset not found" });
      }
      const recipe = generation.recipeId ? await storage.getRecipeById(generation.recipeId) : null;
      const user = await storage.getUser(generation.userId);
      res.json({
        id: generation.id,
        assetId: generation.assetId,
        imageUrl: generation.imageUrl,
        type: generation.type,
        status: generation.status,
        metadata: generation.metadata,
        createdAt: generation.createdAt,
        recipe: recipe ? {
          id: recipe.id,
          name: recipe.name,
          slug: recipe.slug,
          category: recipe.category
        } : null,
        creator: user ? {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName
        } : null
      });
    } catch (error) {
      console.error("Error fetching asset:", error);
      res.status(500).json({ message: "Failed to fetch asset" });
    }
  });
  app2.get("/api/stream-video/:shortId", async (req, res) => {
    try {
      const shortId = req.params.shortId;
      const generation = await storage.getGenerationByShortId(shortId);
      if (!generation) {
        return res.status(404).json({ error: "Video not found" });
      }
      let videoUrl = generation.videoUrl;
      if (!videoUrl) {
        if (generation.imageUrl && (generation.imageUrl.includes(".mp4") || generation.imageUrl.includes(".mov") || generation.imageUrl.includes(".webm"))) {
          videoUrl = generation.imageUrl;
        } else if (generation.metadata && generation.metadata.cdnUrl) {
          videoUrl = generation.metadata.cdnUrl;
        }
      }
      if (!videoUrl) {
        return res.status(404).json({ error: "Video not found" });
      }
      const range = req.headers.range;
      const headers = {};
      if (range) {
        headers["Range"] = range;
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1e4);
      const response = await fetch(videoUrl, {
        signal: controller.signal,
        headers
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        return res.status(response.status).json({ error: "Failed to fetch video" });
      }
      const contentType = response.headers.get("content-type") || "video/mp4";
      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Disposition", "inline");
      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Range, Content-Range");
      const contentRange = response.headers.get("content-range");
      const contentLength = response.headers.get("content-length");
      if (contentRange) {
        res.setHeader("Content-Range", contentRange);
      }
      if (contentLength) {
        res.setHeader("Content-Length", contentLength);
      }
      if (range && response.status === 206) {
        res.status(206);
      }
      if (response.body) {
        try {
          const { Readable } = await import("stream");
          let nodeStream;
          if (typeof Readable.fromWeb === "function") {
            nodeStream = Readable.fromWeb(response.body);
          } else {
            const buffer = await response.arrayBuffer();
            res.send(Buffer.from(buffer));
            return;
          }
          nodeStream.pipe(res);
          nodeStream.on("end", () => res.end());
          nodeStream.on("error", (err) => {
            console.error("Stream error:", err);
            res.end();
          });
        } catch (streamError) {
          console.error("Error converting stream:", streamError);
          const buffer = await response.arrayBuffer();
          res.send(Buffer.from(buffer));
        }
      } else {
        const buffer = await response.arrayBuffer();
        res.send(Buffer.from(buffer));
      }
    } catch (error) {
      console.error("Error streaming video:", error);
      if (error.name === "AbortError") {
        return res.status(408).json({ error: "Video request timeout" });
      }
      res.status(500).json({ error: "Failed to stream video" });
    }
  });
  const httpServer = createServer(app2);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  const authenticatedConnections = /* @__PURE__ */ new Map();
  wss.on("connection", (ws, req) => {
    console.log("WebSocket connection established");
    let userId = null;
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === "auth" && data.userId && typeof data.userId === "string") {
          const authUserId = data.userId;
          userId = authUserId;
          if (!authenticatedConnections.has(authUserId)) {
            authenticatedConnections.set(authUserId, []);
          }
          authenticatedConnections.get(authUserId)?.push(ws);
          console.log(`WebSocket authenticated for user: ${authUserId}`);
          ws.send(JSON.stringify({ type: "auth_success", userId: authUserId }));
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });
    ws.on("close", () => {
      if (userId && typeof userId === "string") {
        const connections = authenticatedConnections.get(userId);
        if (connections) {
          const index2 = connections.indexOf(ws);
          if (index2 > -1) {
            connections.splice(index2, 1);
          }
          if (connections.length === 0) {
            authenticatedConnections.delete(userId);
          }
        }
      }
      console.log("WebSocket connection closed");
    });
    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });
  global.broadcastToUser = (userId, data) => {
    const connections = authenticatedConnections.get(userId);
    if (connections) {
      connections.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      });
    }
  };
  app2.get("/api/health", (req, res) => {
    res.json({
      status: "healthy",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      environment: process.env.NODE_ENV || "development",
      deploymentType: SITE_DEPLOYMENT_TYPE
    });
  });
  if (isAlphaSite()) {
    console.log("DEBUG: Alpha site enabled, guest recipes:", ALPHA_CONFIG.guestRecipes);
    app2.get("/api/alpha/recipes", async (req, res) => {
      try {
        const allRecipes2 = await storage.getAllRecipes();
        const guestRecipes = allRecipes2.filter(
          (recipe) => ALPHA_CONFIG.guestRecipes.includes(recipe.slug)
        );
        const guestRecipesWithTags = await expandTagHighlights(guestRecipes);
        res.json(guestRecipesWithTags);
      } catch (error) {
        console.error("Error fetching guest recipes:", error);
        res.status(500).json({ message: "Failed to fetch recipes" });
      }
    });
    app2.get("/api/alpha/guest-stats", async (req, res) => {
      try {
        if (!req.userAccount) {
          return res.status(400).json({ message: "Guest session not found" });
        }
        const refreshInfo = await storage.getCreditRefreshInfo(req.userAccount.id);
        let refreshResult = { refreshed: false, creditsAdded: 0, nextRefreshInSeconds: refreshInfo.nextRefreshInSeconds };
        if (refreshInfo.canRefresh) {
          refreshResult = await storage.checkAndRefreshDailyCredits(req.userAccount.id);
        }
        const freshUser = await storage.getUser(req.userAccount.id);
        if (!freshUser) {
          return res.status(400).json({ message: "User not found" });
        }
        const { creditsRemaining } = getGenerationLimits({
          ...req.userAccount,
          credits: freshUser.credits
        });
        const generationStats = await storage.getGuestGenerationStats(req.userAccount.id);
        const stats = {
          used: generationStats.total,
          // Show actual number of generations made
          remaining: creditsRemaining,
          refreshSecondsLeft: Math.floor(refreshResult.nextRefreshInSeconds)
        };
        res.json(stats);
      } catch (error) {
        console.error("Error fetching guest stats:", error);
        res.status(500).json({ message: "Failed to fetch guest stats" });
      }
    });
    app2.get("/api/alpha/my-makes-stats", async (req, res) => {
      try {
        if (!req.userAccount) {
          return res.status(400).json({ message: "Guest session not found" });
        }
        const stats = await storage.getGuestGenerationStats(req.userAccount.id);
        res.json(stats);
      } catch (error) {
        console.error("Error fetching guest generation stats:", error);
        if (error instanceof Error) {
          if (error.message.includes("ENOTFOUND") || error.message.includes("connection")) {
            return res.status(503).json({
              message: "Database temporarily unavailable. Please try again in a moment.",
              retryAfter: 5
            });
          }
        }
        res.status(500).json({
          message: "Failed to fetch guest generation stats",
          error: process.env.NODE_ENV === "development" ? error instanceof Error ? error.message : String(error) : void 0
        });
      }
    });
    app2.post("/api/alpha/generate", async (req, res) => {
      try {
        if (!req.userAccount) {
          return res.status(400).json({ message: "Guest session not found" });
        }
        const { creditsRemaining } = getGenerationLimits(req.userAccount);
        const { recipeId, formData } = req.body;
        if (!recipeId) {
          return res.status(400).json({ message: "Recipe ID is required" });
        }
        const recipe = await storage.getRecipeById(recipeId);
        if (!recipe) {
          return res.status(404).json({ message: "Recipe not found" });
        }
        console.log("DEBUG: Recipe lookup result:", {
          recipeId,
          recipeSlug: recipe.slug,
          guestRecipes: ALPHA_CONFIG.guestRecipes,
          isIncluded: ALPHA_CONFIG.guestRecipes.includes(recipe.slug)
        });
        if (!ALPHA_CONFIG.guestRecipes.includes(recipe.slug)) {
          return res.status(403).json({ message: "Recipe not available for guests" });
        }
        if (creditsRemaining < recipe.creditCost && !req.userAccount.allowDebit) {
          return res.status(400).json({
            title: "Insufficient Credits",
            message: `You need ${recipe.creditCost} credits to use this recipe. You have ${creditsRemaining} credits remaining.`,
            creditsRemaining,
            required: recipe.creditCost
          });
        }
        if (formData) {
          const validation = validateRecipeFormData(recipe, formData);
          if (!validation.isValid) {
            return res.status(400).json({
              message: "Invalid form data",
              errors: validation.errors
            });
          }
        }
        let finalPrompt = recipe.prompt;
        let extractedVariables = {};
        if (formData) {
          const processedResult = processRecipePrompt(recipe, formData);
          finalPrompt = processedResult.prompt;
          extractedVariables = processedResult.extractedVariables;
        }
        const tagDisplayData = await generateTagDisplayData(recipe, formData || {});
        const generation = await storage.createGuestGeneration(req.userAccount.id, {
          recipeId,
          prompt: finalPrompt,
          status: "pending",
          recipeTitle: recipe.name,
          creditsCost: recipe.creditCost,
          // Use actual recipe cost
          type: recipe.workflowType === "image_to_video" || recipe.workflowType === "text_to_video" ? "video" : "image",
          metadata: {
            formData: formData || {},
            tagDisplayData,
            extractedVariables,
            workflowType: recipe.workflowType,
            videoGeneration: recipe.workflowType === "image_to_video" ? "minimax-hailuo-02-pro" : null
          }
        });
        const newCredits = creditsRemaining - recipe.creditCost;
        await storage.updateUserCredits(req.userAccount.id, newCredits);
        await storage.createCreditTransaction({
          userId: req.userAccount.id,
          amount: -recipe.creditCost,
          type: "usage",
          description: `Generated content using ${recipe.name}`
        });
        const { generationQueue: generationQueue2 } = await Promise.resolve().then(() => (init_queue_service(), queue_service_exports));
        await generationQueue2.addToQueue(generation, formData || {});
        await storage.incrementRecipeUsage(recipeId);
        res.json({
          message: "Generation started",
          generationId: generation.id
        });
      } catch (error) {
        console.error("Error starting guest generation:", error);
        res.status(500).json({ message: "Failed to start generation" });
      }
    });
    app2.get("/api/alpha/my-makes", async (req, res) => {
      try {
        if (!req.userAccount) {
          return res.status(400).json({ message: "Guest session not found" });
        }
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.per_page) || parseInt(req.query.limit) || 5));
        const offset = (page - 1) * limit;
        const status = req.query.status;
        const validStatuses = ["pending", "completed", "failed", "processing"];
        const statusFilter = status && validStatuses.includes(status) ? status : void 0;
        const generations3 = await storage.getUserGenerations(req.userAccount.id, {
          page,
          limit,
          offset,
          status: statusFilter
        });
        const recipeIds = Array.from(new Set(generations3.data.map((g) => g.recipeId).filter(Boolean)));
        const recipes2 = recipeIds.length > 0 ? await storage.getRecipesByIds(recipeIds) : [];
        const recipeMap = new Map(recipes2.map((r) => [r.id, r]));
        const generationsWithRecipes = generations3.data.map((gen) => {
          const recipe = gen.recipeId ? recipeMap.get(gen.recipeId) : null;
          return {
            ...gen,
            recipe: recipe ? {
              id: recipe.id,
              name: recipe.name,
              slug: recipe.slug,
              category: recipe.category
            } : null
          };
        });
        res.json({
          generations: generationsWithRecipes,
          pagination: {
            page,
            limit,
            total: generations3.total,
            totalPages: Math.ceil(generations3.total / limit),
            hasNext: page < Math.ceil(generations3.total / limit),
            hasPrevious: page > 1
          }
        });
      } catch (error) {
        console.error("Error fetching guest generations:", error);
        res.status(500).json({ message: "Failed to fetch generations" });
      }
    });
    app2.get("/api/alpha/generation/:shortId", async (req, res) => {
      try {
        if (!req.userAccount) {
          return res.status(400).json({ message: "Guest session not found" });
        }
        const { shortId } = req.params;
        const generation = await storage.getGenerationByShortId(shortId);
        if (!generation) {
          return res.status(404).json({ message: "Generation not found" });
        }
        if (generation.userId !== req.userAccount.id) {
          return res.status(403).json({ message: "Access denied" });
        }
        const recipe = generation.recipeId ? await storage.getRecipeById(generation.recipeId) : null;
        const generationWithRecipe = {
          ...generation,
          recipe: recipe ? {
            id: recipe.id,
            name: recipe.name,
            slug: recipe.slug,
            category: recipe.category
          } : null
        };
        res.json(generationWithRecipe);
      } catch (error) {
        console.error("Error fetching generation by short ID:", error);
        res.status(500).json({ message: "Failed to fetch generation" });
      }
    });
  }
  app2.get("/api/tag-icon-mappings", async (req, res) => {
    try {
      const iconMappings = await db.select({
        id: recipeOptionTagIcons.id,
        display: recipeOptionTagIcons.display,
        icon: recipeOptionTagIcons.icon,
        color: recipeOptionTagIcons.color
      }).from(recipeOptionTagIcons);
      const mappings = {};
      iconMappings.forEach((mapping) => {
        if (mapping.icon) {
          mappings[mapping.id] = {
            icon: mapping.icon,
            ...mapping.color && { color: mapping.color }
          };
        }
      });
      res.json({ mappings });
    } catch (error) {
      console.error("Error fetching tag icon mappings:", error);
      res.status(500).json({ message: "Failed to fetch icon mappings" });
    }
  });
  app2.post("/api/generate/instant", requireAuth, async (req, res) => {
    try {
      const userId = req.userAccount.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { recipeId } = req.body;
      const recipe = await storage.getRecipeById(recipeId);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      const { creditsRemaining, allowDebit } = getGenerationLimits(req.userAccount);
      if (creditsRemaining < recipe.creditCost && !allowDebit) {
        return res.status(400).json({
          message: "Insufficient credits",
          required: recipe.creditCost,
          available: creditsRemaining
        });
      }
      const backlogCount = await storage.getBacklogGenerationCount(recipeId);
      if (backlogCount === 0) {
        return res.status(404).json({
          message: "No instant generation available",
          fallbackToModal: true
        });
      }
      const targetUserId = userId;
      const claimedGeneration = await storage.claimBacklogGeneration(recipeId, targetUserId);
      if (!claimedGeneration) {
        return res.status(409).json({
          message: "No instant generation available (race condition)",
          fallbackToModal: true
        });
      }
      const newCredits = user.credits - recipe.creditCost;
      await storage.updateUserCredits(userId, newCredits);
      await storage.createCreditTransaction({
        userId,
        amount: -recipe.creditCost,
        type: "usage",
        description: `Instant generation using ${recipe.name}`
      });
      await storage.incrementRecipeUsage(recipeId);
      res.json({
        success: true,
        message: "Instant generation claimed successfully",
        generationId: claimedGeneration.id,
        shortId: claimedGeneration.shortId,
        videoUrl: claimedGeneration.videoUrl,
        thumbnailUrl: claimedGeneration.thumbnailUrl,
        remainingCredits: newCredits,
        isInstant: true
      });
    } catch (error) {
      console.error("Error in instant generation:", error);
      res.status(500).json({ message: "Failed to claim instant generation" });
    }
  });
  return httpServer;
}

// server/vite.ts
import express3 from "express";
import fs2 from "fs";
import path5 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path4 from "path";
var vite_config_default = defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      "@": path4.resolve(process.cwd(), "client", "src"),
      "@shared": path4.resolve(process.cwd(), "shared"),
      "@assets": path4.resolve(process.cwd(), "client", "src", "assets")
    }
  },
  root: path4.resolve(process.cwd(), "client"),
  build: {
    outDir: path4.resolve(process.cwd(), "dist/public"),
    emptyOutDir: true
  },
  define: {
    "import.meta.env.VITE_SITE_DEPLOYMENT_TYPE": JSON.stringify(process.env.SITE_DEPLOYMENT_TYPE),
    "import.meta.env.VITE_DEV_PASSWORD": JSON.stringify(process.env.VITE_DEV_PASSWORD)
  },
  // Server configuration for standalone development
  // When used with middleware mode, these settings are overridden
  server: {
    host: "0.0.0.0",
    // Listen on all interfaces, not just localhost
    port: 5232,
    strictPort: true,
    hmr: {
      port: 5232,
      host: "localhost"
    },
    fs: {
      strict: true,
      deny: ["**/.*"]
    },
    // Allow delu.la domain for production deployment
    allowedHosts: ["localhost", "127.0.0.1", "delu.la", "www.delu.la", ".delu.la"]
  }
});

// server/vite.ts
import { nanoid as nanoid4 } from "nanoid";

// server/metadata-config.ts
var DEFAULT_METADATA = {
  title: "Delula: One-Click Viral Hits",
  description: "Delula creates one-click viral hits - no prompts, no hassle. Instantly generate videos and images you can customize with a friendly point-and-click interface.",
  image: "/icons/social-card.png",
  canonicalUrl: "https://delu.la",
  keywords: "AI content creator, one-click viral videos, no-prompt image generator, text-free AI tool, generate images and videos, instant content creation, creator tools, customizable AI media",
  type: "website",
  ogTitle: "Delula: One-Click Viral Hits",
  ogDescription: "No prompts. No waiting. Just scroll-stopping videos and images, generated instantly and customized your way."
};
var ROUTE_METADATA = {
  "/": DEFAULT_METADATA,
  "/alpha": {
    title: "Delula Alpha: One-Click Viral Hits",
    description: "Delula creates one-click viral hits - no prompts, no hassle. Instantly generate videos and images you can customize with a friendly point-and-click interface.",
    image: "/delula-alpha-preview.png",
    canonicalUrl: "https://delu.la/alpha",
    keywords: "AI content creator, one-click viral videos, no-prompt image generator, text-free AI tool, generate images and videos, instant content creation, creator tools, customizable AI media",
    type: "website",
    ogTitle: "Delula: One-Click Viral Hits",
    ogDescription: "No prompts. No waiting. Just scroll-stopping videos and images, generated instantly and customized your way."
  },
  "/alpha/my-makes": {
    title: "My Makes - Delula Alpha",
    description: "View and manage your AI-generated content. See all your videos and images created with Delula's one-click viral content generator.",
    image: "/icons/social-card.png",
    canonicalUrl: "https://delu.la/alpha/my-makes",
    keywords: "my makes, AI content, generated videos, generated images, content gallery, delula creations",
    type: "website",
    ogTitle: "My Makes - Delula Alpha",
    ogDescription: "View and manage your AI-generated content. See all your videos and images created with Delula."
  },
  "/pricing": {
    title: "Pricing - Delula",
    description: "Choose the perfect plan for your AI content creation needs. From free trials to unlimited generation, find the right Delula plan for you.",
    image: "/icons/social-card.png",
    canonicalUrl: "https://delu.la/pricing",
    keywords: "delula pricing, AI content pricing, video generation cost, image generation cost, content creation plans",
    type: "website",
    ogTitle: "Pricing - Delula",
    ogDescription: "Choose the perfect plan for your AI content creation needs. From free trials to unlimited generation."
  },
  "/gallery": {
    title: "Gallery - Delula",
    description: "Explore amazing AI-generated content created with Delula. Discover viral videos, stunning images, and creative content from our community.",
    image: "/icons/social-card.png",
    canonicalUrl: "https://delu.la/gallery",
    keywords: "delula gallery, AI content gallery, generated videos, generated images, community content, viral content",
    type: "website",
    ogTitle: "Gallery - Delula",
    ogDescription: "Explore amazing AI-generated content created with Delula. Discover viral videos, stunning images, and creative content."
  },
  "/create": {
    title: "Create Content - Delula",
    description: "Start creating amazing AI content with Delula. Choose from proven recipes and generate viral videos and images instantly.",
    image: "/icons/social-card.png",
    canonicalUrl: "https://delu.la/create",
    keywords: "create AI content, generate videos, generate images, content creation, delula recipes",
    type: "website",
    ogTitle: "Create Content - Delula",
    ogDescription: "Start creating amazing AI content with Delula. Choose from proven recipes and generate viral videos and images instantly."
  },
  "/tutorials": {
    title: "Tutorials - Delula",
    description: "Learn how to create amazing AI content with Delula. Step-by-step tutorials, tips, and tricks for maximizing your content creation.",
    image: "/icons/social-card.png",
    canonicalUrl: "https://delu.la/tutorials",
    keywords: "delula tutorials, AI content tutorials, video creation guide, image generation guide, content creation tips",
    type: "website",
    ogTitle: "Tutorials - Delula",
    ogDescription: "Learn how to create amazing AI content with Delula. Step-by-step tutorials, tips, and tricks for maximizing your content creation."
  },
  "/privacy-policy": {
    title: "Privacy Policy - Delula",
    description: "Learn how Delula protects your privacy and handles your data. Our commitment to transparency and data security.",
    image: "/icons/social-card.png",
    canonicalUrl: "https://delu.la/privacy-policy",
    keywords: "delula privacy policy, data protection, privacy, security, user data",
    type: "website",
    ogTitle: "Privacy Policy - Delula",
    ogDescription: "Learn how Delula protects your privacy and handles your data. Our commitment to transparency and data security."
  },
  "/terms-of-service": {
    title: "Terms of Service - Delula",
    description: "Read Delula's terms of service and user agreement. Understand your rights and responsibilities when using our AI content creation platform.",
    image: "/icons/social-card.png",
    canonicalUrl: "https://delu.la/terms-of-service",
    keywords: "delula terms of service, user agreement, terms and conditions, legal",
    type: "website",
    ogTitle: "Terms of Service - Delula",
    ogDescription: "Read Delula's terms of service and user agreement. Understand your rights and responsibilities when using our platform."
  }
};
function getRouteMetadata(pathname) {
  const normalizedPath = pathname === "" ? "/" : pathname;
  if (ROUTE_METADATA[normalizedPath]) {
    return ROUTE_METADATA[normalizedPath];
  }
  if (normalizedPath.startsWith("/m/")) {
    return {
      title: "View Content - Delula",
      description: "View and share AI-generated content created with Delula. Discover amazing videos and images from our community.",
      image: "/icons/social-card.png",
      canonicalUrl: `https://delu.la${normalizedPath}`,
      keywords: "view content, AI content, generated videos, generated images, delula content",
      type: "website",
      ogTitle: "View Content - Delula",
      ogDescription: "View and share AI-generated content created with Delula. Discover amazing videos and images from our community."
    };
  }
  return DEFAULT_METADATA;
}
function generateMetaTags(metadata) {
  const {
    title,
    description,
    image = "/icons/social-card.png",
    canonicalUrl = "https://delu.la",
    keywords = "AI content creator, one-click viral videos, no-prompt image generator, text-free AI tool, generate images and videos, instant content creation, creator tools, customizable AI media",
    type = "website",
    ogTitle,
    ogDescription
  } = metadata;
  return `
    <!-- Primary Meta Tags -->
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="keywords" content="${keywords}" />
    <meta name="author" content="Scrypted" />
    <meta name="robots" content="index, follow" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#2c1e57" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:title" content="${ogTitle || title}" />
    <meta property="og:description" content="${ogDescription || description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:site_name" content="delula" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:site" content="@delula_ai" />
    
    <!-- Farcaster -->
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${image}" />
    <meta property="fc:frame:title" content="${title}" />
    <meta property="fc:frame:description" content="${description}" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${canonicalUrl}" />
    
    <!-- Favicon and App Icons -->
    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    <link rel="icon" href="/icons/favicon-16x16.png" type="image/png" sizes="16x16" />
    <link rel="icon" href="/icons/favicon-32x32.png" type="image/png" sizes="32x32" />
    <link rel="icon" href="/icons/favicon-48x48.png" type="image/png" sizes="48x48" />
    <link rel="icon" href="/icons/favicon-96x96.png" type="image/png" sizes="96x96" />
    
    <!-- Apple Touch Icons (Safari optimized) -->
    <link rel="apple-touch-icon" href="/icons/apple-touch-icon-180x180.png" />
    <link rel="apple-touch-icon" href="/icons/apple-touch-icon-152x152.png" sizes="152x152" />
    <link rel="apple-touch-icon" href="/icons/apple-touch-icon-144x144.png" sizes="144x144" />
    
    <!-- Safari-specific meta tags -->
    <meta name="apple-mobile-web-app-title" content="Delula" />
    <meta name="apple-touch-fullscreen" content="yes" />
    
    <!-- Android Chrome Icons -->
    <link rel="icon" href="/icons/android-chrome-192x192.png" type="image/png" sizes="192x192" />
    <link rel="icon" href="/icons/icon-256x256.png" type="image/png" sizes="256x256" />
    <link rel="icon" href="/icons/icon-512x512.png" type="image/png" sizes="512x512" />
    
    <!-- Web App Manifest -->
    <link rel="manifest" href="/manifest.webmanifest" />
    
    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "delula",
      "description": "${description}",
      "url": "${canonicalUrl}",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://delu.la/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
    </script>
  `.trim();
}

// server/vite.ts
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    allowedHosts: ["localhost", "127.0.0.1", "delu.la", "www.delu.la", ".delu.la"],
    middlewareMode: true,
    hmr: { server }
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    if (url.startsWith("/api/")) {
      return next();
    }
    try {
      const clientTemplate = path5.resolve(
        process.cwd(),
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      const routeMetadata = getRouteMetadata(url);
      const metaTags = generateMetaTags(routeMetadata);
      const charsetIndex = template.indexOf('<meta charset="UTF-8" />');
      if (charsetIndex !== -1) {
        const headEndIndex = template.indexOf("</head>");
        if (headEndIndex !== -1) {
          const beforeMetadata = template.substring(0, charsetIndex + '<meta charset="UTF-8" />'.length);
          const afterMetadata = template.substring(headEndIndex);
          template = beforeMetadata + "\n    " + metaTags + "\n  " + afterMetadata;
        }
      }
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid4()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path5.resolve(process.cwd(), "dist", "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express3.static(distPath));
  app2.use("*", async (req, res) => {
    try {
      const indexPath = path5.resolve(distPath, "index.html");
      let template = await fs2.promises.readFile(indexPath, "utf-8");
      const routeMetadata = getRouteMetadata(req.originalUrl);
      const metaTags = generateMetaTags(routeMetadata);
      const charsetIndex = template.indexOf('<meta charset="UTF-8" />');
      if (charsetIndex !== -1) {
        const headEndIndex = template.indexOf("</head>");
        if (headEndIndex !== -1) {
          const beforeMetadata = template.substring(0, charsetIndex + '<meta charset="UTF-8" />'.length);
          const afterMetadata = template.substring(headEndIndex);
          template = beforeMetadata + "\n    " + metaTags + "\n  " + afterMetadata;
        }
      }
      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (error) {
      res.sendFile(path5.resolve(distPath, "index.html"));
    }
  });
}

// server/job-recovery-service.ts
init_db();
init_schema();
init_storage();
init_thumbnail_service();
import { eq as eq8, and as and7, isNotNull as isNotNull3, lt as lt4 } from "drizzle-orm";
var JobRecoveryService = class {
  recoveryIntervals = /* @__PURE__ */ new Map();
  continuousMonitoringInterval;
  dailyCreditRefreshInterval;
  BACKOFF_PATTERN = [15, 30, 60, 30, 15];
  // Updated sine wave pattern in seconds
  MAX_RETRY_ATTEMPTS = 5;
  JOB_EXPIRY_HOURS = 1;
  // Jobs older than 1 hour should be expired
  CONTINUOUS_MONITORING_INTERVAL = 10 * 60 * 1e3;
  // 10 minutes in milliseconds
  /**
   * Initialize job recovery on startup
   * Finds all stuck processing jobs and begins recovery
   * Starts continuous monitoring for newly stuck jobs
   */
  async initializeRecovery() {
    console.log("\u{1F504} Initializing job recovery system...");
    try {
      await this.expireOldPendingJobs();
      const stuckGenerations = await db.select().from(generations).where(
        and7(
          eq8(generations.status, "processing"),
          isNotNull3(generations.falJobId)
        )
      );
      console.log(`Found ${stuckGenerations.length} stuck generations to recover`);
      for (const generation of stuckGenerations) {
        console.log(`Starting recovery for generation ${generation.id} with FAL job ${generation.falJobId}`);
        this.startJobRecovery(generation.id, generation.falJobId, 0);
      }
      const failedGenerations = await db.select().from(generations).where(
        and7(
          eq8(generations.status, "failed"),
          isNotNull3(generations.falJobId),
          eq8(generations.recoveryChecked, false)
        )
      );
      console.log(`Found ${failedGenerations.length} failed generations to check for recovery`);
      for (const generation of failedGenerations) {
        console.log(`Checking failed generation ${generation.id} with FAL job ${generation.falJobId} for recovery`);
        await this.checkFailedJobForRecovery(generation.id, generation.falJobId);
      }
      this.startContinuousMonitoring();
    } catch (error) {
      console.error("Error initializing job recovery:", error);
    }
  }
  /**
   * Start continuous monitoring for stuck jobs every 10 minutes
   */
  startContinuousMonitoring() {
    console.log("\u{1F504} Starting continuous job monitoring (every 10 minutes)");
    this.continuousMonitoringInterval = setInterval(async () => {
      try {
        await this.scanForStuckJobs();
      } catch (error) {
        console.error("Error in continuous monitoring scan:", error);
      }
    }, this.CONTINUOUS_MONITORING_INTERVAL);
  }
  /**
   * Scan for stuck jobs and start recovery for any found
   */
  async scanForStuckJobs() {
    console.log("\u{1F50D} Scanning for stuck jobs...");
    try {
      const stuckGenerations = await db.select().from(generations).where(
        and7(
          eq8(generations.status, "processing"),
          isNotNull3(generations.falJobId)
        )
      );
      if (stuckGenerations.length === 0) {
        console.log("\u2705 No stuck jobs found in continuous scan");
      } else {
        console.log(`\u{1F50D} Found ${stuckGenerations.length} stuck jobs in continuous scan`);
        for (const generation of stuckGenerations) {
          if (!this.recoveryIntervals.has(generation.id)) {
            console.log(`\u{1F504} Starting recovery for newly detected stuck generation ${generation.id} with FAL job ${generation.falJobId}`);
            this.startJobRecovery(generation.id, generation.falJobId, 0);
          } else {
            console.log(`\u23F3 Generation ${generation.id} already being recovered, skipping`);
          }
        }
      }
      const failedGenerations = await db.select().from(generations).where(
        and7(
          eq8(generations.status, "failed"),
          isNotNull3(generations.falJobId),
          eq8(generations.recoveryChecked, false)
        )
      );
      if (failedGenerations.length === 0) {
        console.log("\u2705 No failed jobs to check for recovery in continuous scan");
      } else {
        console.log(`\u{1F50D} Found ${failedGenerations.length} failed jobs to check for recovery in continuous scan`);
        for (const generation of failedGenerations) {
          console.log(`Checking failed generation ${generation.id} with FAL job ${generation.falJobId} for recovery`);
          await this.checkFailedJobForRecovery(generation.id, generation.falJobId);
        }
      }
      await this.checkForMissingThumbnails();
    } catch (error) {
      console.error("Error scanning for stuck jobs:", error);
    }
  }
  /**
   * Expire old pending jobs that are older than 1 hour
   */
  async expireOldPendingJobs() {
    try {
      const oneHourAgo = new Date(Date.now() - this.JOB_EXPIRY_HOURS * 60 * 60 * 1e3);
      const oldPendingJobs = await db.select().from(generations).where(
        and7(
          eq8(generations.status, "pending"),
          lt4(generations.createdAt, oneHourAgo)
        )
      );
      console.log(`Found ${oldPendingJobs.length} old pending jobs to expire`);
      for (const job of oldPendingJobs) {
        console.log(`Expiring old pending job ${job.id} (created at ${job.createdAt})`);
        await this.expireJob(job.id, "Job expired after 1 hour in pending status");
      }
    } catch (error) {
      console.error("Error expiring old pending jobs:", error);
    }
  }
  /**
   * Expire a job and refund credits if necessary
   */
  async expireJob(generationId, reason) {
    try {
      const generation = await db.select().from(generations).where(eq8(generations.id, generationId)).limit(1);
      if (!generation.length) {
        console.log(`Generation ${generationId} not found for expiration`);
        return;
      }
      const gen = generation[0];
      if (gen.creditsCost && !gen.creditsRefunded) {
        await storage.refundCreditsForGeneration(generationId, gen.userId, gen.creditsCost);
        console.log(`Refunded ${gen.creditsCost} credits for expired generation ${generationId}`);
      }
      await storage.failGeneration(
        generationId,
        "Your request took too long to process and has been cancelled. Credits have been refunded.",
        {
          error: "Job expired",
          reason,
          expiredAt: (/* @__PURE__ */ new Date()).toISOString()
        },
        false
        // Don't refund again since we already did
      );
      console.log(`Successfully expired generation ${generationId}: ${reason}`);
    } catch (error) {
      console.error(`Error expiring generation ${generationId}:`, error);
    }
  }
  /**
   * Start recovery for a specific job
   * Uses sine wave backoff pattern for polling
   */
  startJobRecovery(generationId, falJobId, attemptIndex) {
    if (attemptIndex >= this.MAX_RETRY_ATTEMPTS) {
      console.log(`Max retry attempts reached for generation ${generationId}`);
      this.markGenerationFailed(generationId, "Max recovery attempts exceeded");
      return;
    }
    const delaySeconds = this.BACKOFF_PATTERN[attemptIndex % this.BACKOFF_PATTERN.length];
    const delayMs = delaySeconds * 1e3;
    console.log(`Scheduling recovery check for generation ${generationId} in ${delaySeconds}s (attempt ${attemptIndex + 1})`);
    const timeoutId = setTimeout(async () => {
      try {
        await this.checkJobStatus(generationId, falJobId, attemptIndex);
      } catch (error) {
        console.error(`Recovery check failed for generation ${generationId}:`, error);
        this.startJobRecovery(generationId, falJobId, attemptIndex + 1);
      }
    }, delayMs);
    this.recoveryIntervals.set(generationId, timeoutId);
  }
  /**
   * Check FAL job status and update generation accordingly
   */
  async checkJobStatus(generationId, falJobId, attemptIndex) {
    console.log(`Checking FAL job status for generation ${generationId}, job ${falJobId}`);
    try {
      const currentGeneration = await db.select().from(generations).where(eq8(generations.id, generationId)).limit(1);
      if (!currentGeneration.length || currentGeneration[0].status !== "processing") {
        console.log(`Generation ${generationId} no longer processing, stopping recovery`);
        this.clearRecoveryInterval(generationId);
        return;
      }
      const jobStatus = await this.pollFalJobStatus(falJobId);
      if (jobStatus.status === "completed") {
        console.log(`\u2705 FAL job ${falJobId} completed, updating generation ${generationId}`);
        await this.handleJobCompletion(generationId, jobStatus.result);
        this.clearRecoveryInterval(generationId);
      } else if (jobStatus.status === "failed") {
        console.log(`\u274C FAL job ${falJobId} failed, marking generation ${generationId} as failed`);
        await this.markGenerationFailed(generationId, jobStatus.error || "FAL job failed");
        this.clearRecoveryInterval(generationId);
      } else {
        console.log(`\u23F3 FAL job ${falJobId} still processing, continuing recovery`);
        this.startJobRecovery(generationId, falJobId, attemptIndex + 1);
      }
    } catch (error) {
      console.error(`Error checking job status for generation ${generationId}:`, error);
      this.startJobRecovery(generationId, falJobId, attemptIndex + 1);
    }
  }
  /**
   * Poll FAL API for job status with improved connectivity error handling
   */
  async pollFalJobStatus(jobId) {
    try {
      const fal3 = await import("@fal-ai/serverless-client");
      const generation = await db.select({ metadata: generations.metadata }).from(generations).where(eq8(generations.falJobId, jobId)).limit(1);
      if (!generation.length) {
        console.log(`No generation found for FAL job ${jobId}`);
        return { status: "failed", error: "Generation not found" };
      }
      const metadata = generation[0].metadata;
      const endpoint = metadata?.endpoint || "fal-ai/flux/dev";
      console.log(`Checking FAL job ${jobId} on endpoint ${endpoint}`);
      const status = await fal3.queue.status(endpoint, { requestId: jobId });
      const statusValue = status.status;
      if (statusValue === "COMPLETED") {
        const result = await fal3.queue.result(endpoint, { requestId: jobId });
        return { status: "completed", result };
      } else if (statusValue === "FAILED" || statusValue === "ERROR") {
        return { status: "failed", error: JSON.stringify(status) };
      } else if (statusValue === "IN_PROGRESS" || statusValue === "IN_QUEUE") {
        return { status: "processing" };
      } else {
        console.log(`Unknown FAL status for job ${jobId}: ${statusValue}`);
        return { status: "processing" };
      }
    } catch (error) {
      if (error.message?.includes("connectivity") || error.message?.includes("network") || error.message?.includes("timeout") || error.message?.includes("ECONNRESET") || error.message?.includes("ENOTFOUND")) {
        console.log(`Connectivity issue detected for job ${jobId}: ${error.message}`);
        return { status: "processing" };
      }
      if (error.message?.includes("IN_PROGRESS") || error.message?.includes("IN_QUEUE")) {
        return { status: "processing" };
      }
      console.error(`Error polling FAL job ${jobId}:`, error);
      return { status: "failed", error: error.message };
    }
  }
  /**
   * Handle successful job completion
   */
  async handleJobCompletion(generationId, result) {
    try {
      const { generationQueue: generationQueue2 } = await Promise.resolve().then(() => (init_queue_service(), queue_service_exports));
      await generationQueue2.handleRecoveredJobCompletion(generationId, result);
    } catch (error) {
      console.error(`Error handling job completion for generation ${generationId}:`, error);
      await this.markGenerationFailed(generationId, "Failed to process completion result");
    }
  }
  /**
   * Mark generation as failed
   */
  async markGenerationFailed(generationId, reason) {
    try {
      await storage.failGeneration(
        generationId,
        "There was a temporary connection issue. We're retrying your request automatically.",
        {
          error: "Recovery failed",
          reason,
          failedAt: (/* @__PURE__ */ new Date()).toISOString()
        },
        true
        // Refund credits for failed recovery
      );
      console.log(`Generation ${generationId} marked as failed: ${reason}`);
    } catch (error) {
      console.error(`Error marking generation ${generationId} as failed:`, error);
    }
  }
  /**
   * Clear recovery interval for a generation
   */
  clearRecoveryInterval(generationId) {
    const timeoutId = this.recoveryIntervals.get(generationId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.recoveryIntervals.delete(generationId);
    }
  }
  /**
   * Register a new FAL job for potential recovery
   */
  async registerFalJob(generationId, falJobId) {
    try {
      await db.update(generations).set({
        falJobId,
        falJobStatus: "processing"
      }).where(eq8(generations.id, generationId));
      console.log(`Registered FAL job ${falJobId} for generation ${generationId}`);
    } catch (error) {
      console.error(`Error registering FAL job for generation ${generationId}:`, error);
    }
  }
  /**
   * Check a failed job for recovery by polling the service provider
   * Only checks jobs that failed due to network issues, timeouts, or disconnects
   */
  async checkFailedJobForRecovery(generationId, falJobId) {
    try {
      console.log(`Checking failed generation ${generationId} with FAL job ${falJobId} for recovery`);
      const generation = await db.select().from(generations).where(eq8(generations.id, generationId)).limit(1);
      if (!generation.length) {
        console.log(`Generation ${generationId} not found for recovery check`);
        return;
      }
      const gen = generation[0];
      const failureReason = gen.failureReason?.toLowerCase() || "";
      const errorDetails = gen.errorDetails;
      const errorMessage = errorDetails?.error?.toLowerCase() || "";
      const isRecoverableFailure = failureReason.includes("timeout") || failureReason.includes("connection") || failureReason.includes("network") || failureReason.includes("disconnect") || failureReason.includes("temporary") || errorMessage.includes("timeout") || errorMessage.includes("connection") || errorMessage.includes("network") || errorMessage.includes("econnreset") || errorMessage.includes("enotfound");
      if (!isRecoverableFailure) {
        console.log(`Generation ${generationId} failed for non-recoverable reason: ${failureReason}. Marking as checked.`);
        await this.markAsRecoveryChecked(generationId);
        return;
      }
      console.log(`Generation ${generationId} failed for recoverable reason: ${failureReason}. Checking provider status...`);
      const jobStatus = await this.pollFalJobStatus(falJobId);
      if (jobStatus.status === "completed") {
        console.log(`\u2705 FAL job ${falJobId} completed, recovering generation ${generationId}`);
        await this.handleJobCompletion(generationId, jobStatus.result);
        await this.markAsRecoveryChecked(generationId);
      } else if (jobStatus.status === "failed") {
        console.log(`\u274C FAL job ${falJobId} confirmed failed, leaving generation ${generationId} as failed`);
        await this.markAsRecoveryChecked(generationId);
      } else if (jobStatus.status === "processing") {
        console.log(`\u{1F504} FAL job ${falJobId} still processing, resuming generation ${generationId}`);
        await db.update(generations).set({
          status: "processing",
          failureReason: null,
          errorDetails: null,
          recoveryChecked: false
        }).where(eq8(generations.id, generationId));
        this.startJobRecovery(generationId, falJobId, 0);
      } else {
        console.log(`\u2753 Unknown FAL status for job ${falJobId}: ${jobStatus.status}. Marking as checked.`);
        await this.markAsRecoveryChecked(generationId);
      }
    } catch (error) {
      console.error(`Error checking failed job ${generationId} for recovery:`, error);
      await this.markAsRecoveryChecked(generationId);
    }
  }
  /**
   * Mark a generation as recovery checked to avoid infinite polling
   */
  async markAsRecoveryChecked(generationId) {
    try {
      await db.update(generations).set({
        recoveryChecked: true,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq8(generations.id, generationId));
      console.log(`Marked generation ${generationId} as recovery checked`);
    } catch (error) {
      console.error(`Error marking generation ${generationId} as recovery checked:`, error);
    }
  }
  /**
   * Check for completed videos that are missing thumbnails and generate them
   */
  async checkForMissingThumbnails() {
    try {
      const videosWithoutThumbnails = await db.select().from(generations).where(
        and7(
          eq8(generations.status, "completed"),
          eq8(generations.type, "video"),
          isNotNull3(generations.videoUrl)
        )
      );
      const videosNeedingThumbnails = videosWithoutThumbnails.filter(
        (gen) => !gen.thumbnailUrl || gen.thumbnailUrl === ""
      );
      if (videosNeedingThumbnails.length === 0) {
        console.log("\u2705 No videos missing thumbnails found");
        return;
      }
      console.log(`\u{1F3AC} Found ${videosNeedingThumbnails.length} videos missing thumbnails, generating...`);
      for (const generation of videosNeedingThumbnails) {
        try {
          console.log(`\u{1F3AC} Generating thumbnail for video generation ${generation.id}`);
          const videoUrl = generation.videoUrl;
          const filename = videoUrl.split("/").pop()?.split("?")[0] || "";
          const thumbnailKey = `videos/thumbnails/${filename.replace(".mp4", ".gif")}`;
          thumbnailService.generateThumbnail({
            generationId: generation.id,
            videoUrl,
            s3Key: thumbnailKey,
            assetId: generation.assetId || ""
          }).catch((error) => {
            console.error(`\u274C Failed to generate thumbnail for generation ${generation.id}:`, error);
          });
        } catch (error) {
          console.error(`\u274C Error processing thumbnail generation for generation ${generation.id}:`, error);
        }
      }
    } catch (error) {
      console.error("Error checking for missing thumbnails:", error);
    }
  }
  /**
   * Cleanup all recovery intervals
   */
  cleanup() {
    this.recoveryIntervals.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    this.recoveryIntervals.clear();
    if (this.continuousMonitoringInterval) {
      clearInterval(this.continuousMonitoringInterval);
      this.continuousMonitoringInterval = void 0;
    }
  }
};
var jobRecoveryService = new JobRecoveryService();

// server/index.ts
var app = express4();
app.use(express4.json());
app.use(express4.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path6 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path6.startsWith("/api")) {
      let logLine = `${req.method} ${path6} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  try {
    await jobRecoveryService.initializeRecovery();
    log("Job recovery service initialized successfully");
  } catch (error) {
    log(`Failed to initialize job recovery service: ${error}`);
  }
  try {
    const { backlogRetainMinimumService: backlogRetainMinimumService2 } = await Promise.resolve().then(() => (init_service_backlog_retain_minimum(), service_backlog_retain_minimum_exports));
    await backlogRetainMinimumService2.initialize();
    log("Backlog maintenance service initialized successfully");
  } catch (error) {
    log(`Failed to initialize backlog maintenance service: ${error}`);
  }
  try {
    const { backlogRetainMinimumService: backlogRetainMinimumService2 } = await Promise.resolve().then(() => (init_service_backlog_retain_minimum(), service_backlog_retain_minimum_exports));
    setInterval(async () => {
      try {
        log("\u{1F504} Running periodic backlog maintenance...");
        await backlogRetainMinimumService2.maintainBacklog();
        log("\u2705 Periodic backlog maintenance completed");
      } catch (error) {
        log(`\u274C Periodic backlog maintenance failed: ${error}`);
      }
    }, 5 * 60 * 1e3);
    log("Periodic backlog maintenance scheduled (every 5 minutes)");
  } catch (error) {
    log(`Failed to schedule periodic backlog maintenance: ${error}`);
  }
  const port = 5232;
  server.listen({
    port,
    host: "0.0.0.0"
    // reusePort: true,
  }, () => {
    log(`serving on port ${port} (${isAlphaSite() ? "alpha" : "production"} mode)`);
  });
})();
