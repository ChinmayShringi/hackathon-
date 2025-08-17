# Database Schema Documentation

## Overview

The Delula project uses **Drizzle ORM** with **PostgreSQL** as the database backend. The schema is defined in `shared/schema.ts` and serves as the single source of truth for all database operations.

## Schema Architecture

### Core Principles

1. **Schema-Driven Development**: All database operations must go through the Drizzle schema
2. **Type Safety**: Full TypeScript integration with generated types
3. **Database Reality**: Schema matches actual database implementation
4. **Consistent Patterns**: Standardized field naming and constraints

### File Structure

```
shared/
├── schema.ts          # Main schema definitions
├── access-roles.ts    # Access role constants (integer-based)
├── user-types.ts      # User type constants (integer-based)
└── config.ts          # Configuration constants

migrations/
├── schema.ts          # Migration-specific schema
└── meta/              # Migration metadata
```

## Table Definitions

### Core Tables

#### `users`
- **Primary Key**: `id` (varchar)
- **Account Types**: System (1), Guest (2), Registered (3)
- **Access Roles**: User (1), Test (2), Admin (3)
- **Timestamps**: `createdAt`, `updatedAt`, `lastSeenAt`, `lastCreditRefresh`
- **Credits**: Default 10, daily refresh system

#### `generations`
- **Primary Key**: `id` (serial)
- **Status Flow**: pending → processing → completed/failed
- **Media Types**: image, video
- **Timestamps**: `createdAt`, `updatedAt`, `processingStartedAt`, `refundedAt`
- **Short IDs**: YouTube-style 11-character identifiers

#### `recipes`
- **Primary Key**: `id` (serial)
- **Workflow Types**: image, video, hybrid
- **Credit Costs**: Configurable per recipe
- **Usage Tracking**: `usageCount` field with separate `recipe_usage` table
- **Tag System**: `tagHighlights` array references `tags.id`
- **Categories**: `category` field for high-level classification
- **Generation Types**: `generationType` (video/image) for content type

#### `tags`
- **Primary Key**: `id` (serial)
- **Public Interface**: `name`, `description`, `color`, `isActive`
- **Internal Organization**: `isHidden` field for system-only tags
- **Usage**: Public tags displayed on recipe cards, hidden tags for internal categorization
- **Categories**: Hidden tags use `category:*` naming convention (e.g., `category:video`, `category:image`)
- **Workflows**: Hidden tags use `workflow:*` naming convention (e.g., `workflow:text_to_video`)
- **Indexes**: Optimized with `idx_tags_is_hidden` for efficient filtering

#### `recipe_usage`
- **Primary Key**: `recipeId` (integer)
- **Usage Tracking**: `usageCount`, `lastUsedAt`
- **Optimized**: Separate table for performance

### Asset Management Tables 🆕

#### `user_assets` ✅ **PRODUCTION READY**
- **Primary Key**: `id` (serial)
- **Asset Identification**: `assetId` (varchar(64), unique), `originalFilename`, `displayName`
- **Storage**: `s3Key`, `cdnUrl` for S3 integration and CDN delivery
- **Metadata**: `mimeType`, `fileSize`, `assetType`, `source`, `dimensions`, `duration`
- **Organization**: `userTags`, `systemTags` arrays, `autoClassification`, `aiClassification` JSONB
- **Usage Tracking**: `usageCount`, `lastUsedAt`, `createdAt`, `updatedAt`
- **Soft Delete**: `isDeleted`, `deletedAt` for safe removal
- **Indexes**: Optimized for user queries, normalized name search, and type-based filtering

#### `system_assets` 🧪 **STUB IMPLEMENTATION**
- **Primary Key**: `id` (serial)
- **System Identification**: `systemId` (varchar), `assetId` (varchar(64), unique)
- **Content**: `name`, `url`, `mimeType`, `fileSize`
- **Metadata**: `dimensions` (JSONB), `tags` (text array), `metadata` (JSONB)
- **Timestamps**: `createdAt`, `updatedAt`
- **Purpose**: Future system resources and built-in assets
- **Status**: Table structure ready, implementation pending

#### `market_assets` 🧪 **STUB IMPLEMENTATION**
- **Primary Key**: `id` (serial)
- **Creator**: `creatorId` (varchar), `assetId` (varchar(64), unique)
- **Content**: `name`, `url`, `mimeType`, `fileSize`
- **Metadata**: `dimensions` (JSONB), `tags` (text array), `metadata` (JSONB)
- **Visibility**: `isPublic` (boolean, default true)
- **Timestamps**: `createdAt`, `updatedAt`
- **Purpose**: Future shared marketplace content
- **Status**: Table structure ready, implementation pending

### Supporting Tables

- **`credit_transactions`**: Credit usage and refund tracking
- **`backlog_videos`**: Pre-generated content for instant access
- **`recipe_samples`**: Example outputs for recipes
- **`providers`**: AI service provider configurations
- **`services`**: Individual AI service endpoints

### Component Registry Tables 🆕

#### `component_registry`
- **Primary Key**: `id` (serial)
- **Component ID**: `componentId` (varchar, unique) - e.g., "get-frames-from-video"
- **Metadata**: `name`, `version`, `description`, `category`, `tags`
- **Cost & Performance**: `creditCost`, `estimatedProcessingTime`
- **Status**: `isActive` boolean for enabling/disabling components
- **Indexes**: Optimized for `componentId`, `category`, and `isActive` lookups

#### `component_input_channels`
- **Primary Key**: `id` (serial)
- **Component Reference**: `componentId` → `component_registry.componentId`
- **Channel Definition**: `channelId`, `channelName`, `type`, `position`
- **Validation**: `validationRules` (JSONB), `defaultValue`, `isRequired`
- **Constraints**: Unique combination of `componentId` + `channelId`
- **Indexes**: Optimized for `componentId` and `position` ordering

#### `component_output_channels`
- **Primary Key**: `id` (serial)
- **Component Reference**: `componentId` → `component_registry.componentId`
- **Channel Definition**: `channelId`, `channelName`, `type`
- **Metadata**: `metadata` (JSONB) for output format and structure
- **Constraints**: Unique combination of `componentId` + `channelId`
- **Indexes**: Optimized for `componentId` lookups

#### `component_usage`
- **Primary Key**: `id` (serial)
- **Component Reference**: `componentId` → `component_registry.componentId`
- **User Tracking**: `userId` → `users.id`
- **Execution Data**: `executionId` (varchar), `inputData` (JSONB), `outputData` (JSONB)
- **Performance**: `success` (boolean), `executionTime` (integer), `createdAt`
- **Indexes**: Optimized for analytics and component performance tracking

#### `component_dependencies`
- **Primary Key**: `id` (serial)
- **Component Reference**: `componentId` → `component_registry.componentId`
- **Dependency**: `dependsOnComponentId` → `component_registry.componentId`
- **Metadata**: `dependencyType` (varchar), `description` (text)
- **Purpose**: Define component workflow dependencies and execution order
- **Indexes**: Optimized for dependency graph traversal

## Schema Changes History

### Recent Changes (Latest)

#### ✅ **Asset Source Type System Implementation**
- **Added**: `system_assets` table for future system resources
- **Added**: `market_assets` table for future marketplace content
- **Removed**: `brand_assets` table (replaced by universal user library)
- **Updated**: Asset management architecture for multi-source support

#### ✅ **Component System Integration**
- **Added**: Complete component registry tables
- **Added**: Component input/output channel definitions
- **Added**: Component usage tracking and analytics
- **Added**: Component dependency management

#### ✅ **Type Safety Improvements**
- **Fixed**: All TypeScript compilation errors
- **Updated**: Schema to match actual database implementation
- **Added**: Proper type exports for all new tables
- **Improved**: Database connection handling and error management

### Migration Status

- **Current Migration**: `0008_add_stub_asset_tables.sql`
- **Database Backup**: `database/backups/lkg.sql` (1.43 MB)
- **Schema Version**: Fully synchronized with database
- **Type Safety**: 100% TypeScript compliance

## Type Exports

### Core Types
```typescript
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = typeof recipes.$inferInsert;
export type Generation = typeof generations.$inferSelect;
export type InsertGeneration = typeof generations.$inferInsert;
```

### Asset Types 🆕
```typescript
export type UserAsset = typeof userAssets.$inferSelect;
export type InsertUserAsset = typeof userAssets.$inferInsert;
export type SystemAsset = typeof systemAssets.$inferSelect;
export type InsertSystemAsset = typeof systemAssets.$inferInsert;
export type MarketAsset = typeof marketAssets.$inferSelect;
export type InsertMarketAsset = typeof marketAssets.$inferInsert;
```

### Component Types 🆕
```typescript
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
```

## Database Operations

### Connection Management
```typescript
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { config } from 'dotenv';

config(); // Load environment variables first

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

// Use pool.query() for raw SQL queries
const result = await pool.query('SELECT * FROM users LIMIT 5');

// Use db.select() for Drizzle ORM queries
const users = await db.select().from(users).limit(5);

// Always close the pool when done
await pool.end();
```

### Asset Source Type System 🆕

The new asset source type system provides type-safe access to assets from different sources:

```typescript
import { AssetSourceType, AssetSource } from '../types';

// Create source type instances
const userSource = AssetSourceType.USER;        // user_assets table
const generationSource = AssetSourceType.GENERATION; // generations table
const systemSource = AssetSourceType.SYSTEM;    // system_assets table
const marketSource = AssetSourceType.MARKET;    // market_assets table

// Get source information
console.log(userSource.tableName);        // "user_assets"
console.log(userSource.requiresAuth);     // true
console.log(userSource.toString());       // "user"

// Validate source types
const isValid = AssetSourceType.isValidNumber(2); // true for USER
const sourceType = AssetSourceType.fromNumber(3); // GENERATION
```

## Performance Considerations

### Indexing Strategy
- **Primary Keys**: All tables use serial primary keys for efficient joins
- **Unique Constraints**: Asset IDs and component IDs have unique constraints
- **Composite Indexes**: User queries optimized with multi-column indexes
- **Hidden Tag Indexes**: System tags optimized for internal categorization

### Query Optimization
- **Connection Pooling**: Efficient database connection management
- **Batch Operations**: Support for bulk asset operations
- **Lazy Loading**: Metadata loaded only when needed
- **Soft Deletes**: Safe asset removal without data loss

## Security Features

### Access Control
- **User Isolation**: Assets properly scoped to user accounts
- **Authentication Required**: User and generation assets require authentication
- **Public Assets**: System and market assets can be publicly accessible
- **Soft Deletes**: Prevents accidental data loss

### Data Validation
- **Input Sanitization**: All user inputs validated and sanitized
- **Type Safety**: Full TypeScript integration prevents runtime errors
- **Constraint Enforcement**: Database-level constraints for data integrity
- **Error Handling**: Graceful error handling without information leakage

## Future Enhancements

### Planned Features
- **Asset Versioning**: Support for asset version history
- **Bulk Operations**: Efficient batch processing of multiple assets
- **Advanced Search**: Full-text search and semantic asset discovery
- **Asset Relationships**: Support for asset dependencies and relationships
- **Performance Monitoring**: Real-time asset access and usage analytics

### Migration Path
- **System Assets**: Implementation of built-in system resources
- **Market Assets**: Shared marketplace content system
- **Asset Analytics**: Advanced usage tracking and insights
- **Integration APIs**: External service integration for asset management
