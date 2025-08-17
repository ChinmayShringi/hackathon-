import { BaseComponent, InputChannel, OutputChannel } from '../component-system';
import { ComponentInputType } from '../component-types';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { userAssets, generations, systemAssets, marketAssets } from '../schema';
import { eq, and, or } from 'drizzle-orm';
import { AssetSourceType, AssetSource } from '../types';

/**
 * AssetImage Component
 * 
 * This component retrieves image asset information from multiple sources using
 * the AssetSourceType system for type-safe asset source handling.
 * 
 * Input: Asset ID (string) + Asset Source Type (AssetSourceType)
 * Output: Complete asset metadata including dimensions, URLs, tags, and source information
 * 
 * Note: This is a server-side only component, so we can expose full asset information
 * without worrying about over-exposing sensitive data to clients.
 */
export class AssetImageComponent extends BaseComponent {
  id = 'asset-image';
  name = 'Asset Image';
  version = '1.0.0';
  description = 'Retrieves complete image asset information from multiple sources using type-safe asset source handling';
  category = 'asset-management';
  tags = ['image', 'asset', 'metadata', 'database', 'workflow', 'type-safe', 'multi-source'];
  creditCost = 0;
  estimatedProcessingTime = 0;
  
  inputChannels: InputChannel[] = [
    {
      id: 'assetId',
      type: ComponentInputType.TEXT,
      required: true,
      position: 0,
      description: 'Asset ID to retrieve information for',
      validation: {
        pattern: '^[a-zA-Z0-9-_]+$',
        customValidator: (value: any) => {
          if (typeof value !== 'string' || value.length === 0) {
            return 'Asset ID must be a non-empty string';
          }
          if (value.length > 64) {
            return 'Asset ID must be 64 characters or less';
          }
          return true;
        }
      }
    },
    {
      id: 'assetSourceType',
      type: ComponentInputType.NUMBER,
      required: true,
      position: 1,
      description: 'Asset source type (1=SYSTEM, 2=USER, 3=GENERATION, 4=MARKET)',
      validation: {
        min: 1,
        max: 4,
        customValidator: (value: any) => {
          if (!AssetSourceType.isValidNumber(value)) {
            return 'Asset source type must be a valid integer between 1-4';
          }
          return true;
        }
      }
    }
  ];
  
  outputChannels: OutputChannel[] = [
    {
      id: 'assetMetadata',
      type: ComponentInputType.METADATA,
      description: 'Complete asset metadata including all database fields',
      metadata: {
        format: 'json',
        structure: 'Complete asset object with all fields from source table',
        includes: 'dimensions, URLs, tags, classifications, usage stats, source type'
      }
    },
    {
      id: 'imageUrl',
      type: ComponentInputType.IMAGE_URL,
      description: 'Direct URL to the image asset',
      metadata: {
        format: 'url',
        access: 'public endpoint (CDN or direct)'
      }
    },
    {
      id: 'thumbnailUrl',
      type: ComponentInputType.IMAGE_URL,
      description: 'Thumbnail URL if available, otherwise null',
      metadata: {
        format: 'url',
        access: 'public endpoint',
        optional: true
      }
    },
    {
      id: 'dimensions',
      type: ComponentInputType.JSON,
      description: 'Image dimensions (width, height) if available',
      metadata: {
        format: 'json',
        structure: '{ width: number, height: number }',
        optional: true
      }
    },
    {
      id: 'tags',
      type: ComponentInputType.JSON,
      description: 'Asset tags and metadata for content understanding',
      metadata: {
        format: 'json',
        structure: 'Array of tag strings or metadata objects',
        includes: 'user tags, system tags, or generation metadata'
      }
    },
    {
      id: 'sourceType',
      type: ComponentInputType.TEXT,
      description: 'Source of the asset (system, user, generation, market)',
      metadata: {
        format: 'text',
        values: 'system, user, generation, market'
      }
    },
    {
      id: 'assetType',
      type: ComponentInputType.TEXT,
      description: 'Type of asset (image, video, etc.)',
      metadata: {
        format: 'text',
        values: 'image, video, audio, document'
      }
    }
  ];

  /**
   * Process asset retrieval request
   */
  async process(inputs: any[]): Promise<any[]> {
    const [assetId, assetSourceTypeNumber] = inputs;
    
    try {
      console.log(`🖼️  Retrieving asset information for ID: ${assetId}`);
      
      // Convert number to AssetSourceType instance
      const assetSourceType = AssetSourceType.fromNumber(assetSourceTypeNumber);
      console.log(`📊 Asset source: ${assetSourceType.toString()} (${assetSourceType.source})`);
      
      // Get asset from the appropriate source
      const asset = await this.getAssetFromSource(assetId, assetSourceType);
      
      if (!asset) {
        throw new Error(`Asset not found with ID: ${assetId} in ${assetSourceType.toString()} source`);
      }
      
      // Prepare outputs based on source type
      const outputs = this.prepareOutputs(asset, assetSourceType);
      
      // Log success with appropriate property access
      const assetName = this.getAssetDisplayName(asset, assetSourceType);
      console.log(`✅ Asset retrieved successfully from ${assetSourceType.toString()}: ${assetName}`);
      
      return outputs;
      
    } catch (error) {
      console.error(`❌ Failed to retrieve asset ${assetId}:`, error);
      throw error;
    }
  }

  /**
   * Get asset from the specified source
   */
  private async getAssetFromSource(assetId: string, sourceType: AssetSourceType) {
    switch (sourceType.source) {
      case AssetSource.SYSTEM:
        return await this.getAssetFromSystemAssets(assetId);
      case AssetSource.USER:
        return await this.getAssetFromUserAssets(assetId);
      case AssetSource.GENERATION:
        return await this.getAssetFromGenerations(assetId);
      case AssetSource.MARKET:
        return await this.getAssetFromMarketAssets(assetId);
      default:
        throw new Error(`Unsupported asset source: ${sourceType.source}`);
    }
  }

  /**
   * Retrieve asset from system_assets table (stub implementation)
   */
  private async getAssetFromSystemAssets(assetId: string) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool, { schema: { systemAssets } });
    
    try {
      const [asset] = await db
        .select()
        .from(systemAssets)
        .where(eq(systemAssets.assetId, assetId));
      
      return asset;
    } finally {
      await pool.end();
    }
  }

  /**
   * Retrieve asset from user_assets table
   */
  private async getAssetFromUserAssets(assetId: string) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool, { schema: { userAssets } });
    
    try {
      const [asset] = await db
        .select()
        .from(userAssets)
        .where(
          and(
            eq(userAssets.assetId, assetId),
            eq(userAssets.isDeleted, false)
          )
        );
      
      return asset;
    } finally {
      await pool.end();
    }
  }

  /**
   * Retrieve asset from generations table
   */
  private async getAssetFromGenerations(assetId: string) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool, { schema: { generations } });
    
    try {
      const [asset] = await db
        .select()
        .from(generations)
        .where(
          and(
            eq(generations.assetId, assetId),
            or(
              eq(generations.status, 'completed'),
              eq(generations.status, 'success')
            )
          )
        );
      
      return asset;
    } finally {
      await pool.end();
    }
  }

  /**
   * Retrieve asset from market_assets table (stub implementation)
   */
  private async getAssetFromMarketAssets(assetId: string) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool, { schema: { marketAssets } });
    
    try {
      const [asset] = await db
        .select()
        .from(marketAssets)
        .where(
          and(
            eq(marketAssets.assetId, assetId),
            eq(marketAssets.isPublic, true)
          )
        );
      
      return asset;
    } finally {
      await pool.end();
    }
  }

  /**
   * Prepare outputs based on asset source type
   */
  private prepareOutputs(asset: any, sourceType: AssetSourceType) {
    return [
      asset, // assetMetadata
      this.getImageUrl(asset, sourceType), // imageUrl
      this.getThumbnailUrl(asset, sourceType), // thumbnailUrl
      this.getDimensions(asset, sourceType), // dimensions
      this.getTags(asset, sourceType), // tags
      sourceType.toString(), // sourceType
      this.getAssetType(asset, sourceType) // assetType
    ];
  }

  /**
   * Get image URL based on source type
   */
  private getImageUrl(asset: any, sourceType: AssetSourceType): string {
    switch (sourceType.source) {
      case AssetSource.USER:
        return asset.cdnUrl;
      case AssetSource.GENERATION:
        return asset.imageUrl || asset.videoUrl || '';
      case AssetSource.SYSTEM:
      case AssetSource.MARKET:
        return asset.url || asset.imageUrl || '';
      default:
        return '';
    }
  }

  /**
   * Get thumbnail URL based on source type
   */
  private getThumbnailUrl(asset: any, sourceType: AssetSourceType): string | null {
    switch (sourceType.source) {
      case AssetSource.USER:
      case AssetSource.GENERATION:
        return asset.thumbnailUrl || null;
      case AssetSource.SYSTEM:
      case AssetSource.MARKET:
        return asset.thumbnailUrl || asset.thumbnail || null;
      default:
        return null;
    }
  }

  /**
   * Get dimensions based on source type
   */
  private getDimensions(asset: any, sourceType: AssetSourceType): any {
    switch (sourceType.source) {
      case AssetSource.USER:
        return asset.dimensions;
      case AssetSource.GENERATION:
        return asset.metadata?.dimensions || null;
      case AssetSource.SYSTEM:
      case AssetSource.MARKET:
        return asset.dimensions || asset.metadata?.dimensions || null;
      default:
        return null;
    }
  }

  /**
   * Get tags based on source type
   */
  private getTags(asset: any, sourceType: AssetSourceType): string[] {
    switch (sourceType.source) {
      case AssetSource.USER:
        return this.combineTags(asset.userTags, asset.systemTags);
      case AssetSource.GENERATION:
        return this.extractGenerationTags(asset);
      case AssetSource.SYSTEM:
      case AssetSource.MARKET:
        return asset.tags || asset.metadata?.tags || [];
      default:
        return [];
    }
  }

  /**
   * Get asset type based on source type
   */
  private getAssetType(asset: any, sourceType: AssetSourceType): string {
    switch (sourceType.source) {
      case AssetSource.USER:
        return this.getAssetTypeFromMime(asset.mimeType);
      case AssetSource.GENERATION:
        return asset.type || 'image';
      case AssetSource.SYSTEM:
      case AssetSource.MARKET:
        return this.getAssetTypeFromMime(asset.mimeType) || asset.type || 'unknown';
      default:
        return 'unknown';
    }
  }

  /**
   * Get asset display name based on source type
   */
  private getAssetDisplayName(asset: any, sourceType: AssetSourceType): string {
    switch (sourceType.source) {
      case AssetSource.USER:
        return asset.displayName || 'Unknown';
      case AssetSource.GENERATION:
        return asset.prompt || asset.recipeTitle || 'Unknown';
      case AssetSource.SYSTEM:
      case AssetSource.MARKET:
        return asset.name || asset.title || 'Unknown';
      default:
        return 'Unknown';
    }
  }

  /**
   * Combine user and system tags into a single array
   */
  private combineTags(userTags: string[] | null, systemTags: string[] | null): string[] {
    const tags: string[] = [];
    
    if (userTags && Array.isArray(userTags)) {
      tags.push(...userTags);
    }
    
    if (systemTags && Array.isArray(systemTags)) {
      tags.push(...systemTags);
    }
    
    return tags;
  }

  /**
   * Extract tags and metadata from generation assets
   */
  private extractGenerationTags(asset: any): string[] {
    const tags: string[] = [];
    
    // Add generation type
    if (asset.type) {
      tags.push(asset.type);
    }
    
    // Add recipe information
    if (asset.recipeTitle) {
      tags.push(asset.recipeTitle);
    }
    
    // Add prompt keywords (first few words)
    if (asset.prompt) {
      const promptWords = asset.prompt.split(' ').slice(0, 5);
      tags.push(...promptWords);
    }
    
    // Add metadata tags if available
    if (asset.metadata && asset.metadata.tags) {
      if (Array.isArray(asset.metadata.tags)) {
        tags.push(...asset.metadata.tags);
      }
    }
    
    return tags;
  }

  /**
   * Get asset type from MIME type
   */
  private getAssetTypeFromMime(mimeType: string): string {
    if (!mimeType) return 'unknown';
    
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    
    return 'document';
  }

  /**
   * Process named inputs (alternative to ordered inputs)
   */
  async processNamed(inputs: Record<string, any>): Promise<Record<string, any>> {
    const assetId = inputs.assetId;
    const assetSourceType = inputs.assetSourceType;
    
    if (!assetId) {
      throw new Error('assetId is required');
    }
    
    if (!assetSourceType) {
      throw new Error('assetSourceType is required');
    }
    
    const outputs = await this.process([assetId, assetSourceType]);
    
    return {
      assetMetadata: outputs[0],
      imageUrl: outputs[1],
      thumbnailUrl: outputs[2],
      dimensions: outputs[3],
      tags: outputs[4],
      sourceType: outputs[5],
      assetType: outputs[6]
    };
  }
}
