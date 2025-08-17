import { randomBytes, createHash } from 'crypto';
import { nanoid } from 'nanoid';

/**
 * Base62 encoding for secure short IDs (YouTube-style)
 * Uses alphanumeric characters: 0-9, A-Z, a-z
 */
export class Base62Encoder {
  private static readonly ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  
  /**
   * Generate a secure 11-character Base62 ID for public URLs
   * Uses cryptographically secure random bytes
   */
  static generateShortId(): string {
    const bytes = randomBytes(8);
    let result = '';
    
    // Convert bytes to Base62 using simple arithmetic
    for (let i = 0; i < bytes.length; i++) {
      const byte = bytes[i];
      result += this.ALPHABET[byte % 62];
    }
    
    // Pad with additional random characters to reach 11 characters
    while (result.length < 11) {
      const randomByte = randomBytes(1)[0];
      result += this.ALPHABET[randomByte % 62];
    }
    
    return result.substring(0, 11);
  }
  
  /**
   * Encode a number to Base62
   */
  static encode(num: number): string {
    if (num === 0) return '0';
    
    let result = '';
    while (num > 0) {
      result = this.ALPHABET[num % 62] + result;
      num = Math.floor(num / 62);
    }
    return result;
  }
  
  /**
   * Decode Base62 string to number
   */
  static decode(str: string): number {
    let result = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      const index = this.ALPHABET.indexOf(char);
      if (index === -1) throw new Error(`Invalid Base62 character: ${char}`);
      result = result * 62 + index;
    }
    return result;
  }
  
  /**
   * Validate Base62 string format
   */
  static isValid(str: string): boolean {
    if (!/^[0-9A-Za-z]+$/.test(str)) return false;
    return str.split('').every(char => this.ALPHABET.includes(char));
  }
}

/**
 * Secure asset management with UUID-based storage and Base62 public IDs
 */
export class AssetSecurityManager {
  /**
   * Generate a secure UUID for S3 storage (prevents discovery attacks)
   */
  static generateSecureAssetId(): string {
    return nanoid(32); // 32-character secure random string
  }
  
  /**
   * Generate S3 key with UUID to prevent discovery
   */
  static generateS3Key(assetId: string, fileExtension: string = 'png'): string {
    return `magicvidio/${assetId}.${fileExtension}`;
  }
  
  /**
   * Generate full S3 URL for secure asset access
   */
  static generateSecureUrl(s3Key: string): string {
    return `https://avbxp-public.s3.amazonaws.com/${s3Key}`;
  }
  
  /**
   * Create public media URL path
   * Format: /m/{shortId} for public assets
   * Format: /m/{userId}/{shortId} for private assets
   */
  static createPublicMediaPath(shortId: string): string {
    return `/m/${shortId}`;
  }
  
  static createPrivateMediaPath(userId: string, shortId: string): string {
    return `/m/${userId}/${shortId}`;
  }
  
  /**
   * Parse media path to extract components
   */
  static parseMediaPath(path: string): { isPublic: boolean; userId?: string; shortId: string } {
    const pathParts = path.split('/').filter(p => p);
    
    if (pathParts.length === 2 && pathParts[0] === 'm') {
      // Public: /m/{shortId}
      return {
        isPublic: true,
        shortId: pathParts[1]
      };
    } else if (pathParts.length === 3 && pathParts[0] === 'm') {
      // Private: /m/{userId}/{shortId}
      return {
        isPublic: false,
        userId: pathParts[1],
        shortId: pathParts[2]
      };
    }
    
    throw new Error('Invalid media path format');
  }
  
  /**
   * Validate short ID format (11 characters, Base62)
   */
  static validateShortId(shortId: string): boolean {
    return shortId.length === 11 && Base62Encoder.isValid(shortId);
  }
  
  /**
   * Generate content hash for duplicate detection
   */
  static generateContentHash(content: Buffer): string {
    return createHash('sha256').update(content).digest('hex');
  }
}

/**
 * Asset generation metadata for secure tracking
 */
export interface SecureAssetMetadata {
  assetId: string;      // UUID for S3 storage
  shortId: string;      // Base62 public identifier
  s3Key: string;        // S3 object key
  secureUrl: string;    // Full S3 URL
  contentHash?: string; // SHA256 hash of content
  fileSize?: number;    // File size in bytes
  mimeType?: string;    // MIME type
  dimensions?: {
    width: number;
    height: number;
    duration?: number;  // For videos
  };
}

/**
 * Create complete secure asset metadata
 */
export function createSecureAssetMetadata(fileExtension: string = 'png'): SecureAssetMetadata {
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