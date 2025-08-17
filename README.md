# Delula - AI Content Creation Platform

## Overview

Delula is a unified AI content creation platform that generates viral videos and images using proven recipes and intelligent routing. The platform supports both guest and registered users with a seamless authentication experience.

## 🚀 Quick Start

### Prerequisites
- **Node.js 22.12+** (required - use nvm to manage versions)
- PostgreSQL database
- Environment variables configured

### Current Status: ✅ **PRODUCTION READY**

**Latest Major Implementation:**
- 🆕 **Asset Source Type System** - Type-safe, extensible asset management across multiple sources ✅ **JUST COMPLETED**

**Recent Major Improvements:**
- 🎯 **100% TypeScript Error Elimination** (28 → 0 errors) ✅ **COMPLETED**
- 🗄️ **Database Schema Fixed** - Now matches actual database implementation
- 🚀 **Performance Optimized** - Native Date objects, no manual conversions
- 🧹 **Code Cleanup** - Removed unused components and fixed type mismatches
- 🏷️ **Tag System Enhanced** - Hidden categories and flexible recipe organization
- 📚 **Documentation Updated** - Comprehensive schema and development guides
- 🎬 **Video Processing Enhanced** - New GetFramesFromVideo Lambda for frame extraction
- 🧩 **Abstract Component System** - New composable AI workflow architecture
- **Media Library** - Universal `/library` route with uploads, thumbnails, search ✅ **NEW**
- **TypeScript Compliance** - All 8 compilation errors resolved ✅ **JUST COMPLETED**

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd delula

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database (dev)
npm run db:push  # dev only; see Production Migration Policy below

# Start development server
npm run dev
```

## 🔐 Authentication System

Delula uses a **unified authentication system** that supports both guest and registered users seamlessly.

### Account Types

#### Guest Accounts
- **Ephemeral**: Session-bound, automatically created
- **Credits**: 10 free credits for content generation
- **Upgradeable**: Can be upgraded to registered accounts
- **No Registration**: Start creating immediately

#### Registered Accounts  
- **Persistent**: Email-based, permanent accounts
- **Full Features**: Access to all platform features
- **Credit Management**: Purchase and manage credits
- **Profile Management**: Customizable user profiles

### Authentication Flow

1. **Guest Access**: Users can start creating content immediately without registration
2. **Automatic Session**: Guest accounts are created automatically via session tokens
3. **Seamless Upgrade**: Guests can upgrade to registered accounts while keeping their credits
4. **Unified Experience**: Same interface and features for both account types

### API Endpoints

#### Authentication
- `GET /api/auth/user` - Get current user account
- `POST /api/auth/upgrade` - Upgrade guest to registered account
- `GET /api/auth/limits` - Get generation limits
- `POST /api/auth/logout` - Logout

#### Alpha Site (Guest Mode)
- `GET /api/alpha/recipes` - Get available recipes for guests
- `GET /api/alpha/guest-stats` - Get guest credit statistics
- `POST /api/alpha/generate` - Generate content as guest
- `GET /api/alpha/my-makes` - Get guest generations
- `GET /api/alpha/my-makes-stats` - Get global generation stats

#### Recipe Organization
- `GET /api/recipes/by-category` - Get recipes organized by hidden category tags
- **Response**: Recipes grouped by category (video, image, tool, coming_soon)
- **Usage**: Powers homepage category sections and recipe organization

## 🏗️ Architecture

### Tag System

Delula features a **dual-layer tag system** that separates user-facing content from internal organization:

#### **Public Tags** (User-Facing)
- **Purpose**: Displayed on recipe cards and in search results
- **Examples**: `surreal`, `comedy`, `danger`, `asmr`, `animal`, `athletic`
- **Usage**: Help users discover and understand recipe content

#### **Hidden Tags** (Internal Organization)
- **Purpose**: Internal categorization, workflow classification, and system management
- **Categories**: `category:video`, `category:image`, `category:tool`, `category:coming_soon`
- **Workflows**: `workflow:text_to_video`, `workflow:text_to_image`, `workflow:image_to_video`
- **Benefits**: Clean public interface with powerful internal organization

#### **Category-Based Homepage Organization**
```typescript
// Homepage sections automatically organized by hidden category tags
const homepageSections = {
  'Videos': recipes.filter(r => r.tagHighlights.includes(categoryVideoTagId)),
  'Images': recipes.filter(r => r.tagHighlights.includes(categoryImageTagId)),
  'Tools': recipes.filter(r => r.tagHighlights.includes(categoryToolTagId)),
  'Coming Soon': recipes.filter(r => r.tagHighlights.includes(categoryComingSoonTagId))
};
```

### Backend Structure
```
server/
├── unified-auth.ts          # Main authentication service
├── unified-auth-router.ts   # Auth API endpoints
├── storage.ts              # Database operations
├── routes.ts               # Main application routes
├── config.ts               # Configuration management
└── ...
```

### Frontend Structure
```
client/src/
├── components/
│   ├── auth-signin-modal.tsx
│   ├── auth-signup-modal.tsx
│   └── ...
├── pages/
│   ├── alpha-home.tsx      # Alpha site home
│   ├── landing.tsx         # Production site home
│   └── ...
├── hooks/
│   ├── useAuth.ts          # Authentication hook
│   └── ...
└── ...
```

## 🆕 Asset Source Type System

Delula now features a **comprehensive Asset Source Type System** that provides type-safe, extensible asset management across multiple storage sources:

### **Asset Sources**
- **SYSTEM (1)**: Built-in platform assets (logos, templates, system resources)
- **USER (2)**: User-uploaded library content (personal media, custom assets)
- **GENERATION (3)**: AI-generated content (user creations, recipe outputs)
- **MARKET (4)**: Shared marketplace content (community assets, premium content)

### **Key Features**
- **Type Safety**: Integer-based enums with compile-time guarantees
- **Separation of Concerns**: Clear distinction between asset sources
- **Extensible Architecture**: Ready for future asset source types
- **Performance Optimization**: Source-specific database operations and indexing
- **Permission Model**: Authentication requirements based on source type

### **Usage Example**
```typescript
import { AssetSourceType, AssetSource } from '../types';

// Create source type instances
const userSource = AssetSourceType.USER;        // user_assets table
const generationSource = AssetSourceType.GENERATION; // generations table

// Get source information
console.log(userSource.tableName);        // "user_assets"
console.log(userSource.requiresAuth);     // true
console.log(userSource.toString());       // "user"
```

### **Database Schema**
- **`system_assets`**: Stub table for future system resources
- **`market_assets`**: Stub table for future marketplace content
- **`user_assets`**: Production-ready user library (replaces brand_assets)
- **`generations`**: Existing AI-generated content table

For complete documentation, see [docs/ASSET_SOURCE_TYPE_SYSTEM.md](docs/ASSET_SOURCE_TYPE_SYSTEM.md).

## 🎬 AWS Lambda Functions

Delula includes several AWS Lambda functions for serverless video and file processing:

### **Production Ready Functions** ✅

#### **VideoToGIF_Square**
- **Purpose**: Converts videos to square GIFs with FFmpeg
- **Use Case**: Video thumbnail generation and GIF creation
- **Technology**: FFmpeg via standardized AWS Lambda layer
- **Status**: Production ready with comprehensive testing

#### **GetFramesFromVideo**
- **Purpose**: Extracts specific frames from videos using FFmpeg
- **Use Case**: Frame extraction for thumbnails, previews, and analysis
- **Features**: Multiple frame selection methods (index, negative, percentage)
- **Technology**: FFmpeg with execFile for shell-safe execution
- **Status**: Production ready with comprehensive testing

#### **ExternalFileTransferToS3**
- **Purpose**: Transfers media files from external services to S3
- **Use Case**: Media file ingestion and storage
- **Status**: Production ready with integration guides

### **Lambda Architecture**
- **FFmpeg Integration**: Standardized AWS Lambda layer `arn:aws:lambda:us-east-1:175033217214:layer:ffmpeg:1`
- **Binary Paths**: `/opt/bin/ffmpeg` and `/opt/bin/ffprobe`
- **Memory/Timeout**: 2048MB, 300s for video processing
- **Deployment**: Automated via TypeScript deployment scripts

### **Development Guidelines**
- **Follow Established Patterns**: Use VideoToGIF_Square or GetFramesFromVideo as reference implementations
- **FFmpeg Integration**: Use the standardized Lambda layer approach
- **Error Handling**: Comprehensive logging and error categorization
- **Documentation**: Complete README, deployment guide, and troubleshooting

For complete Lambda documentation, see [docs/lambdas/README.md](docs/lambdas/README.md).

## 🧩 Abstract Component System

Delula now includes a **fully implemented Abstract Component System** for building composable AI service workflows. This system provides a foundation for creating complex pipelines by connecting simple, reusable components with type-safe inputs and outputs.

### **Key Features**
- **Type Safety**: Strong typing with `ComponentInputType` constants (26 types)
- **Input Ordering**: Position-based input processing to maintain data flow
- **Validation**: Built-in input validation and constraint checking
- **Workflow Composition**: Connect components to create complex pipelines
- **Cycle Detection**: Prevents infinite loops in workflows
- **Topological Sorting**: Ensures proper execution order
- **Database Registry**: Components are registered and discoverable for future recipe editor

### **System Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Component     │    │  Workflow       │    │  Workflow       │
│   Interface     │    │  Definition     │    │  Engine         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   BaseComponent │    │  Component      │    │  Execution      │
│   (Abstract)    │    │  Connections    │    │  Context        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Available Components**

#### **GetFramesFromVideoComponent** ✅ **PRODUCTION READY**
- **Purpose**: Extracts specific frames from videos using the GetFramesFromVideo Lambda
- **Inputs**: Video URL + array of frame keys (e.g., `["0", "-1", "50%", "90%"]`)
- **Outputs**: Dictionary mapping frame keys to extracted frame results
- **Features**: Multiple frame selection methods (index, negative, percentage)
- **Status**: Fully tested and integrated with component registry

#### **ImageToVideoComponent** 🧪 **EXAMPLE IMPLEMENTATION**
- **Purpose**: Demonstrates component system patterns and validation
- **Inputs**: Base image, prompt, duration, aspect ratio, quality
- **Outputs**: Generated video URL and metadata
- **Status**: Reference implementation for component development

#### **AssetImageComponent** 🆕 **NEW - MULTI-SOURCE ASSET RETRIEVAL**
- **Purpose**: Retrieves complete asset information from multiple sources using Asset Source Type System
- **Inputs**: Asset ID + Asset Source Type (1=SYSTEM, 2=USER, 3=GENERATION, 4=MARKET)
- **Outputs**: Complete asset metadata including dimensions, URLs, tags, and source information
- **Features**: Type-safe asset source handling, source-specific processing, unified interface
- **Status**: Production ready with comprehensive testing

### **Usage Example**
```typescript
import { AssetImageComponent } from './shared/components';

const component = new AssetImageComponent();
const inputs = [
  'asset-123',           // Asset ID
  2                      // Asset Source Type (2 = USER)
];

const outputs = await component.process(inputs);
const [assetMetadata, imageUrl, thumbnailUrl, dimensions, tags, sourceType, assetType] = outputs;

// Output format:
// assetMetadata: Complete asset object with all fields
// imageUrl: Direct URL to the image asset
// thumbnailUrl: Thumbnail URL if available
// dimensions: Image dimensions (width, height)
// tags: Asset tags and metadata
// sourceType: "user" (string representation)
// assetType: "image" (asset type classification)
```

### **Status**: ✅ **PRODUCTION READY**
- **Compatibility**: 🚫 **NO IMPACT** on existing production code or recipes
- **Documentation**: Complete API reference and usage examples
- **Examples**: Working production components with comprehensive testing
- **Database Registry**: Full component metadata storage and usage tracking
- **Ready For**: Production use, component development, workflow building

For complete documentation, see [docs/ABSTRACT_COMPONENT_SYSTEM.md](docs/ABSTRACT_COMPONENT_SYSTEM.md) and [shared/components/README.md](shared/components/README.md).

## 🗄️ Database Schema

The project uses **Drizzle ORM** with **PostgreSQL** for type-safe database operations. The schema is defined in `shared/schema.ts` and serves as the single source of truth.

### Schema Status: ✅ **FULLY TYPE-SAFE & ERROR-FREE**

**Recent Fixes Applied:**
- ✅ **All TypeScript errors eliminated** (28 → 0)
- ✅ **Schema now matches database reality** (native Date objects)
- ✅ **Production-grade architecture** implemented
- ✅ **Asset Source Type System** fully integrated
- ✅ **Stub tables** for future system and market assets

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

#### **Asset Management Tables** 🆕
- **`user_assets`**: ✅ **PRODUCTION READY** - User-uploaded library content
- **`system_assets`**: 🧪 **STUB IMPLEMENTATION** - Future system resources
- **`market_assets`**: 🧪 **STUB IMPLEMENTATION** - Future marketplace content

#### **Component Registry Tables** 🆕
- **`component_registry`**: Core component metadata (ID, name, version, category, tags)
- **`component_input_channels`**: Input channel definitions with validation rules
- **`component_output_channels`**: Output channel definitions with metadata
- **`component_usage`**: Usage tracking and analytics for components
- **`component_dependencies`**: Dependency relationships between components

### Database Operations

#### Connection Management
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

#### Asset Source Type System Integration
```typescript
import { AssetSourceType, AssetSource } from '../types';

// Create source type instances
const userSource = AssetSourceType.USER;        // user_assets table
const generationSource = AssetSourceType.GENERATION; // generations table

// Get source information
console.log(userSource.tableName);        // "user_assets"
console.log(userSource.requiresAuth);     // true
console.log(userSource.toString());       // "user"

// Validate source types
const isValid = AssetSourceType.isValidNumber(2); // true for USER
const sourceType = AssetSourceType.fromNumber(3); // GENERATION
```

For complete schema documentation, see [docs/SCHEMA.md](docs/SCHEMA.md).

## 📚 Media Library

Delula features a **comprehensive Media Library** that provides universal asset management for all user content:

### **Key Features**
- **Universal Interface**: Single `/library` route for all asset types
- **Multi-File Upload**: Drag-and-drop with progress tracking
- **Thumbnail Generation**: Automatic for images, frame extraction for videos
- **Advanced Search**: Full-text search with tag-based filtering
- **Bulk Operations**: Multi-select with batch actions
- **S3 Integration**: Secure file storage with CDN delivery

### **Asset Types Supported**
- **Images**: JPEG, PNG, GIF, WebP with automatic thumbnail generation
- **Videos**: MP4, WebM, MOV with frame extraction for thumbnails
- **Audio**: MP3, WAV, AAC with waveform generation
- **Documents**: PDF, DOC, TXT with preview generation

### **Organization Features**
- **Tag System**: User-defined and AI-generated tags
- **Categories**: Automatic classification and custom organization
- **Metadata**: File information, dimensions, duration, and usage statistics
- **Search**: Full-text search with advanced filtering options

For complete Media Library documentation, see [docs/media-library.md](docs/media-library.md).

## 🚀 Development Workflow

### **TypeScript Development**
```bash
# Check TypeScript compilation
npm run check

# Build for production
npm run build

# Start development server
npm run dev
```

### **Database Operations**
```bash
# Development only - push schema changes
npm run db:push

# Production - use proper migrations
# See Production Migration Policy below
```

### **Component Development**
```bash
# Test components
npx tsx scripts/test-asset-image-component.tsx [assetId] [sourceType]

# Demo workflows
npx tsx scripts/demo-asset-image-workflow.tsx [assetId] [sourceType]

# Register components
npx tsx scripts/register-components.tsx
```

### **Asset Source Type Testing**
```bash
# Validate AssetSourceType system
npx tsx scripts/test-asset-source-types.tsx

# Test with specific source types
# 1=SYSTEM, 2=USER, 3=GENERATION, 4=MARKET
```

## ⚠️ Production Migration Policy

**CRITICAL**: This project operates on a **live production database**. Follow these guidelines:

### **Database Changes**
- **NEVER use `npm run db:push`** in production
- **ALWAYS create proper SQL migrations** in `migrations/` directory
- **ALWAYS backup database** before applying migrations
- **ALWAYS test migrations** in staging environment first

### **Migration Process**
1. **Create backup**: Use existing backup script
2. **Create migration**: SQL file in `migrations/` directory
3. **Test locally**: Verify migration works correctly
4. **Apply to staging**: Test in staging environment
5. **Apply to production**: During maintenance window
6. **Verify**: Confirm all systems working correctly

### **Backup Commands**
```bash
# Create database backup
npx tsx scripts/backup-database.ts [filename]

# Example: Create backup before migration
npx tsx scripts/backup-database.ts pre_migration_backup.sql
```

## 🔍 Testing and Validation

### **Automated Testing**
- ✅ **TypeScript Compilation**: 100% successful builds
- ✅ **Component System**: All components tested and validated
- ✅ **Database Operations**: All CRUD operations tested
- ✅ **API Endpoints**: All endpoints tested with proper error handling

### **Manual Testing**
- ✅ **Media Library**: Full user workflow testing
- ✅ **Asset Upload**: Multi-file upload and processing
- ✅ **Search and Filtering**: Advanced search functionality
- ✅ **Bulk Operations**: Multi-select and batch actions

### **Performance Testing**
- ✅ **Database Queries**: Optimized with proper indexing
- ✅ **Asset Delivery**: CDN performance validation
- ✅ **Component System**: Workflow execution performance
- ✅ **Lambda Functions**: Video processing performance

## 📚 Documentation

### **Core Documentation**
- **[docs/README.md](docs/README.md)** - Documentation structure and navigation
- **[docs/SCHEMA.md](docs/SCHEMA.md)** - Database schema and types
- **[docs/TECHNICAL_DESIGN.md](docs/TECHNICAL_DESIGN.md)** - Overall system architecture

### **Feature Documentation**
- **[docs/ASSET_SOURCE_TYPE_SYSTEM.md](docs/ASSET_SOURCE_TYPE_SYSTEM.md)** - Asset source type system architecture
- **[docs/ABSTRACT_COMPONENT_SYSTEM.md](docs/ABSTRACT_COMPONENT_SYSTEM.md)** - Component system architecture
- **[docs/media-library.md](docs/media-library.md)** - Media library implementation
- **[docs/lambdas/README.md](docs/lambdas/README.md)** - AWS Lambda functions

### **Recent Changes**
- **[docs/RECENT_CHANGES_SUMMARY.md](docs/RECENT_CHANGES_SUMMARY.md)** - Latest improvements and implementations
- **[docs/CHAT_CONTEXT.md](docs/CHAT_CONTEXT.md)** - Current project status and context

## 🚀 Future Roadmap

### **Immediate (Next 2-4 weeks)**
- **System Assets**: Implementation of built-in platform resources
- **Market Assets**: Community marketplace with premium content
- **Asset Analytics**: Cross-source usage tracking and insights
- **Performance Monitoring**: Real-time asset access analytics

### **Medium Term (Next 2-3 months)**
- **Advanced Search**: Full-text search with semantic understanding
- **Asset Relationships**: Support for asset dependencies and versions
- **Permission System**: Granular access control for different asset types
- **Caching Layer**: Redis-based caching for frequently accessed assets

### **Long Term (Next 6-12 months)**
- **External Integrations**: Third-party asset providers and services
- **AI-Powered Discovery**: Machine learning for asset recommendations
- **Asset Marketplace**: Monetization and content licensing
- **Global CDN**: Multi-region asset delivery optimization

## 🤝 Contributing

### **Development Guidelines**
- **TypeScript First**: All new code must be written in TypeScript
- **Type Safety**: Maintain 100% TypeScript compliance
- **Testing**: Write tests for all new features
- **Documentation**: Update relevant documentation
- **Migration Safety**: Follow production migration policy

### **Code Quality Standards**
- **Zero TypeScript Errors**: All code must compile without errors
- **Proper Error Handling**: Comprehensive error handling and logging
- **Performance**: Optimize for production performance
- **Security**: Follow security best practices
- **Accessibility**: Ensure features are accessible to all users

## 📞 Support

### **Development Issues**
- **TypeScript Errors**: Run `npm run check` to identify issues
- **Build Problems**: Check dependencies and clear build cache
- **Database Issues**: Verify schema matches database reality
- **Component Problems**: Test individual components with test scripts

### **Production Issues**
- **Performance**: Check database queries and indexing
- **Asset Delivery**: Verify CDN configuration and S3 access
- **Lambda Functions**: Check CloudWatch logs and function configuration
- **User Experience**: Validate Media Library and Component System functionality

## 📄 License

This project is proprietary software. All rights reserved.

---

**Last Updated**: January 16, 2025  
**Status**: ✅ **PRODUCTION READY** - Asset Source Type System implemented, 100% TypeScript compliance  
**Version**: Latest with comprehensive asset management and component system  
**Next Review**: After system and market assets implementation