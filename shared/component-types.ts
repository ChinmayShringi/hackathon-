/**
 * Component Input/Output Type Constants
 * 
 * This system provides type-safe constants for defining component input and output channels.
 * It ensures consistency across the component system and enables proper validation.
 * 
 * @example
 * ```typescript
 * const channel: InputChannel = {
 *   id: 'baseImage',
 *   type: ComponentInputType.IMAGE_URL,
 *   required: true,
 *   position: 0
 * };
 * ```
 */
export class ComponentInputType {
  // Image types
  static readonly IMAGE = 1;
  static readonly IMAGE_URL = 2;
  static readonly IMAGE_BASE64 = 3;
  static readonly IMAGE_BLOB = 4;
  
  // Video types
  static readonly VIDEO = 5;
  static readonly VIDEO_URL = 6;
  static readonly VIDEO_BLOB = 7;
  static readonly VIDEO_FRAMES = 8;
  
  // Text types
  static readonly TEXT = 9;
  static readonly TEXT_PROMPT = 10;
  static readonly TEXT_INSTRUCTION = 11;
  static readonly TEXT_CONFIG = 12;
  
  // Audio types
  static readonly AUDIO = 13;
  static readonly AUDIO_URL = 14;
  static readonly AUDIO_BLOB = 15;
  static readonly AUDIO_WAVEFORM = 16;
  
  // Numeric types
  static readonly NUMBER = 17;
  static readonly INTEGER = 18;
  static readonly FLOAT = 19;
  static readonly PERCENTAGE = 20;
  
  // Boolean types
  static readonly BOOLEAN = 21;
  static readonly FLAG = 22;
  
  // Special types
  static readonly JSON = 23;
  static readonly METADATA = 24;
  static readonly CONFIG = 25;
  static readonly TEMPLATE = 26;
  
  /**
   * Validates if a given type constant is valid
   * @param type - The type constant to validate
   * @returns True if the type is valid, false otherwise
   */
  static isValidType(type: number): boolean {
    return Object.values(ComponentInputType)
      .filter(value => typeof value === 'number')
      .includes(type);
  }
  
  /**
   * Gets the human-readable name for a type constant
   * @param type - The type constant
   * @returns The type name as a string
   */
  static getTypeName(type: number): string {
    const typeMap: Record<number, string> = {
      [ComponentInputType.IMAGE]: 'IMAGE',
      [ComponentInputType.IMAGE_URL]: 'IMAGE_URL',
      [ComponentInputType.IMAGE_BASE64]: 'IMAGE_BASE64',
      [ComponentInputType.IMAGE_BLOB]: 'IMAGE_BLOB',
      [ComponentInputType.VIDEO]: 'VIDEO',
      [ComponentInputType.VIDEO_URL]: 'VIDEO_URL',
      [ComponentInputType.VIDEO_BLOB]: 'VIDEO_BLOB',
      [ComponentInputType.VIDEO_FRAMES]: 'VIDEO_FRAMES',
      [ComponentInputType.TEXT]: 'TEXT',
      [ComponentInputType.TEXT_PROMPT]: 'TEXT_PROMPT',
      [ComponentInputType.TEXT_INSTRUCTION]: 'TEXT_INSTRUCTION',
      [ComponentInputType.TEXT_CONFIG]: 'TEXT_CONFIG',
      [ComponentInputType.AUDIO]: 'AUDIO',
      [ComponentInputType.AUDIO_URL]: 'AUDIO_URL',
      [ComponentInputType.AUDIO_BLOB]: 'AUDIO_BLOB',
      [ComponentInputType.AUDIO_WAVEFORM]: 'AUDIO_WAVEFORM',
      [ComponentInputType.NUMBER]: 'NUMBER',
      [ComponentInputType.INTEGER]: 'INTEGER',
      [ComponentInputType.FLOAT]: 'FLOAT',
      [ComponentInputType.PERCENTAGE]: 'PERCENTAGE',
      [ComponentInputType.BOOLEAN]: 'BOOLEAN',
      [ComponentInputType.FLAG]: 'FLAG',
      [ComponentInputType.JSON]: 'JSON',
      [ComponentInputType.METADATA]: 'METADATA',
      [ComponentInputType.CONFIG]: 'CONFIG',
      [ComponentInputType.TEMPLATE]: 'TEMPLATE'
    };
    
    return typeMap[type] || 'UNKNOWN';
  }
  
  /**
   * Gets the category for a type constant
   * @param type - The type constant
   * @returns The category as a string
   */
  static getTypeCategory(type: number): string {
    if (type >= ComponentInputType.IMAGE && type <= ComponentInputType.IMAGE_BLOB) return 'IMAGE';
    if (type >= ComponentInputType.VIDEO && type <= ComponentInputType.VIDEO_FRAMES) return 'VIDEO';
    if (type >= ComponentInputType.TEXT && type <= ComponentInputType.TEXT_CONFIG) return 'TEXT';
    if (type >= ComponentInputType.AUDIO && type <= ComponentInputType.AUDIO_WAVEFORM) return 'AUDIO';
    if (type >= ComponentInputType.NUMBER && type <= ComponentInputType.PERCENTAGE) return 'NUMERIC';
    if (type >= ComponentInputType.BOOLEAN && type <= ComponentInputType.FLAG) return 'BOOLEAN';
    if (type >= ComponentInputType.JSON && type <= ComponentInputType.TEMPLATE) return 'SPECIAL';
    return 'UNKNOWN';
  }
  
  /**
   * Gets all types in a specific category
   * @param category - The category to filter by
   * @returns Array of type constants in the category
   */
  static getTypesByCategory(category: string): number[] {
    return Object.values(ComponentInputType)
      .filter(value => typeof value === 'number')
      .filter(type => ComponentInputType.getTypeCategory(type) === category);
  }
}
