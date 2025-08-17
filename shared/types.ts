/**
 * Asset Request Origin Types
 * Defines the authoritative source of where a generation request originated
 */
export const AssetRequestOriginType = {
  BACKLOG: 'backlog',
  USER: 'user'
} as const;

export type AssetRequestOriginType = typeof AssetRequestOriginType[keyof typeof AssetRequestOriginType];

/**
 * Type guard to check if a value is a valid AssetRequestOriginType
 */
export function isValidAssetRequestOriginType(value: any): value is AssetRequestOriginType {
  return Object.values(AssetRequestOriginType).includes(value);
}

/**
 * Metadata interface for generations
 */
export interface GenerationMetadata {
  request_origin: AssetRequestOriginType;
  [key: string]: any;
}

/**
 * Backlog-specific metadata interface
 */
export interface BacklogGenerationMetadata extends GenerationMetadata {
  request_origin: typeof AssetRequestOriginType.BACKLOG;
  formData?: Record<string, any>;
  workflowType?: string;
  tagDisplayData?: Record<string, any>;
  extractedVariables?: Record<string, any>;
  [key: string]: any;
}

/**
 * User generation metadata interface
 */
export interface UserGenerationMetadata extends GenerationMetadata {
  request_origin: typeof AssetRequestOriginType.USER;
  [key: string]: any;
}

/**
 * Asset Source Type System
 * 
 * This system provides strong typing for different asset sources in the Delula platform.
 * It ensures type safety when working with assets from different tables and allows
 * for clear separation of concerns while maintaining extensibility.
 * 
 * Each source type represents a different database table or storage system:
 * - SYSTEM: System resources and built-in assets
 * - USER: User-uploaded library assets
 * - GENERATION: AI-generated content by users
 * - MARKET: Shared marketplace content
 */

/**
 * Enumeration of all available asset source types (integer-based for database efficiency)
 */
export enum AssetSource {
  SYSTEM = 1,
  USER = 2,
  GENERATION = 3,
  MARKET = 4
}

/**
 * Strong typing class for asset source types
 * Provides validation, metadata, and type safety for asset operations
 */
export class AssetSourceType {
  private readonly _source: AssetSource;
  private readonly _tableName: string;
  private readonly _requiresAuth: boolean;

  constructor(source: AssetSource) {
    this._source = source;
    
    // Configure source-specific properties
    switch (source) {
      case AssetSource.SYSTEM:
        this._tableName = 'system_assets';
        this._requiresAuth = false;
        break;
        
      case AssetSource.USER:
        this._tableName = 'user_assets';
        this._requiresAuth = true;
        break;
        
      case AssetSource.GENERATION:
        this._tableName = 'generations';
        this._requiresAuth = true;
        break;
        
      case AssetSource.MARKET:
        this._tableName = 'market_assets';
        this._requiresAuth = false;
        break;
        
      default:
        throw new Error(`Unknown asset source: ${source}`);
    }
  }

  // Getters for type-safe access
  get source(): AssetSource { return this._source; }
  get tableName(): string { return this._tableName; }
  get requiresAuth(): boolean { return this._requiresAuth; }

  /**
   * Get the string representation of the source type
   */
  toString(): string {
    switch (this._source) {
      case AssetSource.SYSTEM: return 'system';
      case AssetSource.USER: return 'user';
      case AssetSource.GENERATION: return 'generation';
      case AssetSource.MARKET: return 'market';
      default: return 'unknown';
    }
  }

  /**
   * Check if this source type equals another
   */
  equals(other: AssetSourceType | AssetSource): boolean {
    if (typeof other === 'number') {
      return this._source === other;
    }
    return this._source === other._source;
  }

  /**
   * Get validation rules for this source type
   */
  getValidationRules(): {
    requiresUserId: boolean;
    requiresAssetId: boolean;
  } {
    return {
      requiresUserId: this._requiresAuth,
      requiresAssetId: true // All sources require asset ID
    };
  }

  /**
   * Get the appropriate database schema for this source type
   */
  getSchemaInfo(): {
    tableName: string;
    primaryKey: string;
    userIdField: string;
    assetIdField: string;
    urlField: string;
    metadataField: string;
  } {
    switch (this._source) {
      case AssetSource.SYSTEM:
        return {
          tableName: 'system_assets',
          primaryKey: 'id',
          userIdField: 'system_id',
          assetIdField: 'asset_id',
          urlField: 'url',
          metadataField: 'metadata'
        };
        
      case AssetSource.USER:
        return {
          tableName: 'user_assets',
          primaryKey: 'id',
          userIdField: 'user_id',
          assetIdField: 'asset_id',
          urlField: 'cdn_url',
          metadataField: 'auto_classification'
        };
        
      case AssetSource.GENERATION:
        return {
          tableName: 'generations',
          primaryKey: 'id',
          userIdField: 'user_id',
          assetIdField: 'asset_id',
          urlField: 'image_url',
          metadataField: 'metadata'
        };
        
      case AssetSource.MARKET:
        return {
          tableName: 'market_assets',
          primaryKey: 'id',
          userIdField: 'creator_id',
          assetIdField: 'asset_id',
          urlField: 'url',
          metadataField: 'metadata'
        };
        
      default:
        throw new Error(`Unknown asset source: ${this._source}`);
    }
  }

  /**
   * Static factory methods for creating source types
   */
  static SYSTEM = new AssetSourceType(AssetSource.SYSTEM);
  static USER = new AssetSourceType(AssetSource.USER);
  static GENERATION = new AssetSourceType(AssetSource.GENERATION);
  static MARKET = new AssetSourceType(AssetSource.MARKET);

  /**
   * Get all available source types
   */
  static getAll(): AssetSourceType[] {
    return [
      AssetSourceType.SYSTEM,
      AssetSourceType.USER,
      AssetSourceType.GENERATION,
      AssetSourceType.MARKET
    ];
  }

  /**
   * Get source type by integer value
   */
  static fromNumber(source: number): AssetSourceType {
    switch (source) {
      case AssetSource.SYSTEM: return AssetSourceType.SYSTEM;
      case AssetSource.USER: return AssetSourceType.USER;
      case AssetSource.GENERATION: return AssetSourceType.GENERATION;
      case AssetSource.MARKET: return AssetSourceType.MARKET;
      default: throw new Error(`Invalid asset source: ${source}`);
    }
  }

  /**
   * Get source type by string value
   */
  static fromString(source: string): AssetSourceType {
    switch (source.toLowerCase()) {
      case 'system': return AssetSourceType.SYSTEM;
      case 'user': return AssetSourceType.USER;
      case 'generation': return AssetSourceType.GENERATION;
      case 'market': return AssetSourceType.MARKET;
      default: throw new Error(`Invalid asset source: ${source}`);
    }
  }

  /**
   * Check if a number is a valid asset source
   */
  static isValidNumber(source: number): boolean {
    try {
      AssetSourceType.fromNumber(source);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if a string is a valid asset source
   */
  static isValidString(source: string): boolean {
    try {
      AssetSourceType.fromString(source);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Type alias for asset source type instances
 */
export type AssetSourceInstance = AssetSourceType;

/**
 * Union type for all possible asset sources
 */
export type AssetSourceUnion = AssetSource;

/**
 * Helper function to create asset source type
 */
export function createAssetSource(source: AssetSource): AssetSourceType {
  return new AssetSourceType(source);
}

/**
 * Helper function to validate asset source number
 */
export function isValidAssetSourceNumber(source: any): source is AssetSource {
  return typeof source === 'number' && AssetSourceType.isValidNumber(source);
}

/**
 * Helper function to validate asset source string
 */
export function isValidAssetSourceString(source: any): source is string {
  return typeof source === 'string' && AssetSourceType.isValidString(source);
}
