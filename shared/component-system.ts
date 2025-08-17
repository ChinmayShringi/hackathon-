import { ComponentInputType } from './component-types';

/**
 * Abstract Component System
 * 
 * This system provides a foundation for building composable AI service components
 * that can be chained together to create complex workflows. It's designed to be
 * completely separate from the existing recipe system and won't interfere with
 * current production code.
 * 
 * Key Features:
 * - Type-safe input/output channels with validation
 * - Ordered input processing to maintain data flow
 * - Dual processing methods (ordered and named)
 * - Extensible validation and metadata support
 */

/**
 * Input channel configuration for a component
 */
export interface InputChannel {
  /** Unique identifier for the input channel */
  id: string;
  
  /** Type constant from ComponentInputType */
  type: number;
  
  /** Whether this input is required for processing */
  required: boolean;
  
  /** Position in the input array (0-based, determines processing order) */
  position: number;
  
  /** Human-readable description of the input */
  description?: string;
  
  /** Validation rules for the input */
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    allowedValues?: any[];
    customValidator?: (value: any) => boolean | string;
  };
  
  /** Default value if not provided */
  defaultValue?: any;
  
  /** Additional metadata for the input */
  metadata?: Record<string, any>;
}

/**
 * Output channel configuration for a component
 */
export interface OutputChannel {
  /** Unique identifier for the output channel */
  id: string;
  
  /** Type constant from ComponentInputType */
  type: number;
  
  /** Human-readable description of the output */
  description?: string;
  
  /** Format and quality metadata */
  metadata?: {
    format?: string;
    quality?: string;
    dimensions?: string;
    encoding?: string;
    compression?: string;
    [key: string]: any;
  };
}

/**
 * Base interface for all components in the system
 */
export interface Component {
  /** Unique identifier for the component */
  id: string;
  
  /** Human-readable name for the component */
  name: string;
  
  /** Version of the component */
  version?: string;
  
  /** Description of what the component does */
  description?: string;
  
  /** Input channels configuration */
  inputChannels: InputChannel[];
  
  /** Output channels configuration */
  outputChannels: OutputChannel[];
  
  /** Component category for organization */
  category?: string;
  
  /** Tags for searching and filtering */
  tags?: string[];
  
  /** Credit cost for using this component */
  creditCost?: number;
  
  /** Estimated processing time in seconds */
  estimatedProcessingTime?: number;
  
  /**
   * Primary processing method - receives inputs in the same order as inputChannels
   * @param inputs - Array of inputs matching inputChannels order
   * @returns Promise resolving to array of outputs matching outputChannels order
   */
  process(inputs: any[]): Promise<any[]>;
  
  /**
   * Secondary processing method - receives inputs by channel ID
   * @param inputs - Record of input values keyed by channel ID
   * @returns Promise resolving to record of outputs keyed by channel ID
   */
  processNamed(inputs: Record<string, any>): Promise<Record<string, any>>;
  
  /**
   * Validate inputs before processing
   * @param inputs - Array of inputs to validate
   * @throws Error if validation fails
   */
  validateInputs?(inputs: any[]): void;
  
  /**
   * Get the processing order for inputs based on position
   * @returns Array of input channel IDs in processing order
   */
  getInputOrder?(): string[];
  
  /**
   * Check if all required inputs are provided
   * @param inputs - Record of input values keyed by channel ID
   * @returns True if all required inputs are present
   */
  hasRequiredInputs?(inputs: Record<string, any>): boolean;
}

/**
 * Base class for implementing components with common functionality
 */
export abstract class BaseComponent implements Component {
  abstract id: string;
  abstract name: string;
  abstract inputChannels: InputChannel[];
  abstract outputChannels: OutputChannel[];
  
  version?: string;
  description?: string;
  category?: string;
  tags?: string[];
  creditCost?: number;
  estimatedProcessingTime?: number;
  
  /**
   * Abstract method that must be implemented by subclasses
   */
  abstract process(inputs: any[]): Promise<any[]>;
  
  /**
   * Default implementation of processNamed that converts named inputs to ordered inputs
   */
  async processNamed(inputs: Record<string, any>): Promise<Record<string, any>> {
    // Validate inputs first
    if (this.validateInputs) {
      this.validateInputs(this.convertNamedToOrdered(inputs));
    }
    
    // Convert named inputs to ordered array
    const orderedInputs = this.convertNamedToOrdered(inputs);
    
    // Process using the ordered method
    const outputs = await this.process(orderedInputs);
    
    // Convert ordered outputs to named record
    return this.convertOrderedToNamed(outputs);
  }
  
  /**
   * Default input validation implementation
   */
  validateInputs(inputs: any[]): void {
    this.inputChannels.forEach((channel, index) => {
      const input = inputs[index];
      
      // Check required inputs
      if (channel.required && input == null) {
        throw new Error(`Required input '${channel.id}' at position ${index} is missing`);
      }
      
      // Skip validation for optional inputs that aren't provided
      if (input == null) return;
      
      // Validate type and constraints
      this.validateInputType(input, channel.type, channel.id);
      this.validateInputConstraints(input, channel.validation, channel.id);
    });
  }
  
  /**
   * Get input processing order based on position field
   */
  getInputOrder(): string[] {
    return [...this.inputChannels]
      .sort((a, b) => a.position - b.position)
      .map(channel => channel.id);
  }
  
  /**
   * Check if all required inputs are provided
   */
  hasRequiredInputs(inputs: Record<string, any>): boolean {
    return this.inputChannels
      .filter(channel => channel.required)
      .every(channel => inputs[channel.id] != null);
  }
  
  /**
   * Convert named inputs to ordered array based on inputChannels position
   */
  private convertNamedToOrdered(inputs: Record<string, any>): any[] {
    const orderedInputs = new Array(this.inputChannels.length);
    
    this.inputChannels.forEach((channel, index) => {
      const value = inputs[channel.id];
      if (value != null) {
        orderedInputs[channel.position] = value;
      } else if (channel.defaultValue != null) {
        orderedInputs[channel.position] = channel.defaultValue;
      }
    });
    
    return orderedInputs;
  }
  
  /**
   * Convert ordered outputs to named record based on outputChannels
   */
  private convertOrderedToNamed(outputs: any[]): Record<string, any> {
    const namedOutputs: Record<string, any> = {};
    
    this.outputChannels.forEach((channel, index) => {
      namedOutputs[channel.id] = outputs[index];
    });
    
    return namedOutputs;
  }
  
  /**
   * Validate input type against expected type
   */
  private validateInputType(input: any, expectedType: number, inputId: string): void {
    // Basic type validation based on ComponentInputType constants
    switch (expectedType) {
      case ComponentInputType.IMAGE_URL:
        if (typeof input !== 'string' || !input.startsWith('http')) {
          throw new Error(`Input '${inputId}' must be a valid image URL`);
        }
        break;
      case ComponentInputType.TEXT_PROMPT:
        if (typeof input !== 'string' || input.trim().length === 0) {
          throw new Error(`Input '${inputId}' must be a non-empty text prompt`);
        }
        break;
      case ComponentInputType.INTEGER:
        if (!Number.isInteger(input) || input < 0) {
          throw new Error(`Input '${inputId}' must be a positive integer`);
        }
        break;
      case ComponentInputType.FLOAT:
        if (typeof input !== 'number' || isNaN(input)) {
          throw new Error(`Input '${inputId}' must be a valid number`);
        }
        break;
      case ComponentInputType.BOOLEAN:
        if (typeof input !== 'boolean') {
          throw new Error(`Input '${inputId}' must be a boolean value`);
        }
        break;
      // Add more type validations as needed
    }
  }
  
  /**
   * Validate input constraints
   */
  private validateInputConstraints(input: any, validation: any, inputId: string): void {
    if (!validation) return;
    
    if (validation.min !== undefined && input < validation.min) {
      throw new Error(`Input '${inputId}' must be at least ${validation.min}`);
    }
    
    if (validation.max !== undefined && input > validation.max) {
      throw new Error(`Input '${inputId}' must be at most ${validation.max}`);
    }
    
    if (validation.pattern && typeof input === 'string') {
      const regex = new RegExp(validation.pattern);
      if (!regex.test(input)) {
        throw new Error(`Input '${inputId}' does not match required pattern`);
      }
    }
    
    if (validation.allowedValues && !validation.allowedValues.includes(input)) {
      throw new Error(`Input '${inputId}' must be one of: ${validation.allowedValues.join(', ')}`);
    }
    
    if (validation.customValidator) {
      const result = validation.customValidator(input);
      if (result !== true) {
        const message = typeof result === 'string' ? result : `Input '${inputId}' failed custom validation`;
        throw new Error(message);
      }
    }
  }
}
