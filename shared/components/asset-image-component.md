# AssetImageComponent

## Overview

The `AssetImageComponent` is a server-side component that retrieves complete image asset information from the database. It's designed to be used in workflows where you need access to all internal asset metadata for processing decisions, particularly in future image-to-video recipes.

## Purpose

This component serves as a data retrieval layer that makes all internal asset information available through structured output channels. Since it's server-side only, it can expose full asset details without worrying about over-exposing sensitive information to clients.

## Use Cases

- **Image-to-Video Workflows**: Retrieve asset metadata to make processing decisions
- **Content Analysis**: Access tags, classifications, and dimensions for content understanding
- **Workflow Orchestration**: Use asset information to determine next processing steps
- **Quality Control**: Validate asset suitability for specific operations

## Component Details

### **ID**: `asset-image`
### **Category**: `asset-management`
### **Credit Cost**: 1
### **Estimated Processing Time**: 5ms

## Input Channels

### `assetId` (Required)
- **Type**: `TEXT`
- **Position**: 0
- **Description**: Asset ID to retrieve information for
- **Validation**: 
  - Must be a non-empty string
  - Maximum 64 characters
  - Pattern: `^[a-zA-Z0-9-_]+$`

## Output Channels

### `assetMetadata`
- **Type**: `METADATA`
- **Description**: Complete asset metadata including all database fields
- **Format**: JSON
- **Structure**: Complete UserAsset object with all fields
- **Includes**: dimensions, URLs, tags, classifications, usage stats

### `imageUrl`
- **Type**: `IMAGE_URL`
- **Description**: Direct CDN URL to the image asset
- **Format**: URL
- **Access**: Public CDN endpoint

### `thumbnailUrl`
- **Type**: `IMAGE_URL`
- **Description**: Thumbnail URL if available, otherwise null
- **Format**: URL
- **Access**: Public CDN endpoint
- **Optional**: Yes

### `dimensions`
- **Type**: `JSON`
- **Description**: Image dimensions (width, height) if available
- **Format**: JSON
- **Structure**: `{ width: number, height: number }`
- **Optional**: Yes

### `tags`
- **Type**: `JSON`
- **Description**: Combined user and system tags for the asset
- **Format**: JSON
- **Structure**: Array of tag strings
- **Includes**: User tags and system tags

### `classification`
- **Type**: `JSON`
- **Description**: AI and auto classification data if available
- **Format**: JSON
- **Structure**: `{ auto: object, ai: object }`
- **Optional**: Yes

## Usage Examples

### Basic Usage

```typescript
import { AssetImageComponent } from '../shared/components/asset-image-component';

const component = new AssetImageComponent();

// Process with ordered inputs
const outputs = await component.process(['asset-123']);
const [metadata, imageUrl, thumbnailUrl, dimensions, tags, classification] = outputs;

// Process with named inputs
const namedOutputs = await component.processNamed({ assetId: 'asset-123' });
const { assetMetadata, imageUrl, thumbnailUrl, dimensions, tags, classification } = namedOutputs;
```

### In a Workflow

```typescript
// Example workflow for image-to-video generation
const assetImageComponent = new AssetImageComponent();

// Get asset information
const assetOutputs = await assetImageComponent.process([assetId]);
const assetMetadata = assetOutputs[0];
const dimensions = assetOutputs[3];
const tags = assetOutputs[4];

// Make processing decisions based on asset properties
if (dimensions && dimensions.width > 1920) {
  // High-resolution image - use high-quality video settings
  videoParams.quality = 'ultra-hd';
  videoParams.duration = 8;
} else {
  // Standard resolution - use standard settings
  videoParams.quality = 'hd';
  videoParams.duration = 5;
}

// Use tags for style decisions
if (tags.includes('nature')) {
  videoParams.style = 'cinematic';
} else if (tags.includes('abstract')) {
  videoParams.style = 'artistic';
}
```

## Database Schema

The component works with the `user_assets` table and expects the following structure:

```sql
CREATE TABLE user_assets (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  asset_id VARCHAR(64) NOT NULL UNIQUE,
  original_filename VARCHAR NOT NULL,
  display_name VARCHAR NOT NULL,
  normalized_name VARCHAR,
  s3_key VARCHAR NOT NULL,
  cdn_url VARCHAR NOT NULL,
  mime_type VARCHAR NOT NULL,
  file_size INTEGER NOT NULL,
  asset_type INTEGER NOT NULL, -- 1 = image
  source INTEGER NOT NULL,
  dimensions JSONB,
  duration INTEGER,
  thumbnail_url VARCHAR,
  user_tags TEXT[],
  system_tags TEXT[],
  auto_classification JSONB,
  ai_classification JSONB,
  usage_count INTEGER DEFAULT 0 NOT NULL,
  last_used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP
);
```

## Error Handling

The component handles several error scenarios:

- **Asset Not Found**: Returns error if asset ID doesn't exist
- **Invalid Asset Type**: Validates that the asset is an image (assetType = 1)
- **Database Errors**: Gracefully handles database connection issues
- **Validation Errors**: Validates input format and requirements

## Integration with Other Components

This component is designed to work with:

- **Image Analysis Components**: Provide metadata for content understanding
- **Style Transfer Components**: Use tags and classifications for style decisions
- **Video Generation Components**: Provide dimensions and metadata for video creation
- **Quality Control Components**: Validate asset suitability for processing

## Testing

### Test Script
```bash
npx tsx scripts/test-asset-image-component.tsx [assetId]
```

### Demo Workflow
```bash
npx tsx scripts/demo-asset-image-workflow.tsx [assetId]
```

### Registration
```bash
npx tsx scripts/register-components.tsx
```

## Future Enhancements

- **Caching**: Add Redis caching for frequently accessed assets
- **Batch Processing**: Support retrieving multiple assets at once
- **Asset Validation**: Add more sophisticated asset quality checks
- **Permission Checking**: Add user permission validation for asset access
- **Audit Logging**: Track component usage for analytics

## Security Considerations

- **Server-Side Only**: This component is designed for server-side use only
- **Database Access**: Uses proper database connection pooling and cleanup
- **Input Validation**: Validates all input parameters before processing
- **Error Handling**: Does not expose sensitive database information in errors

## Performance

- **Connection Pooling**: Uses PostgreSQL connection pooling for efficiency
- **Minimal Processing**: Focuses on data retrieval with minimal transformation
- **Fast Response**: Typical response time under 10ms for existing assets
- **Resource Cleanup**: Properly closes database connections after use
