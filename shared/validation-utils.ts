/**
 * Validation Utilities for Components
 * 
 * This file contains reusable validation functions that can be used across
 * different components in the Abstract Component System.
 */

/**
 * Video URL validation configuration
 */
export const videoUrlValidator = {
  pattern: '^https?://.*\\.(mp4|webm|avi|mov|mkv|flv|wmv)$',
  customValidator: (value: string) => {
    if (value.length > 2048) {
      return 'Video URL must be less than 2048 characters';
    }
    if (!value.startsWith('http')) {
      return 'Video URL must start with http:// or https://';
    }
    return true;
  }
};

/**
 * Image URL validation configuration
 */
export const imageUrlValidator = {
  pattern: '^https?://.*\\.(jpg|jpeg|png|webp|gif|bmp|svg)$',
  customValidator: (value: string) => {
    if (value.length > 2048) {
      return 'Image URL must be less than 2048 characters';
    }
    if (!value.startsWith('http')) {
      return 'Image URL must start with http:// or https://';
    }
    return true;
  }
};

/**
 * Frame key validation for video frame extraction
 * Supports: 0, 1, 2 (positive integers), -1, -2 (negative integers), 50%, 90% (percentages)
 */
export const frameKeyValidator = {
  pattern: '^(0|-?\\d+|\\d+%|-?\\d+%)$',
  customValidator: (value: string) => {
    // Additional validation for percentage format
    if (value.includes('%')) {
      const percentage = parseInt(value.replace('%', ''));
      if (percentage < 0 || percentage > 100) {
        return 'Percentage must be between 0% and 100%';
      }
    }
    return true;
  }
};

/**
 * Validate an array of frame keys
 * @param frameKeys - Array of frame key strings
 * @throws Error if validation fails
 */
export function validateFrameKeys(frameKeys: string[]): void {
  if (!Array.isArray(frameKeys) || frameKeys.length === 0) {
    throw new Error('Frame keys must be a non-empty array');
  }
  
  if (frameKeys.length > 10) {
    throw new Error('Maximum 10 frame keys allowed per request');
  }
  
  const frameKeyPattern = /^(0|-?\d+|\d+%|-?\d+%)$/;
  
  frameKeys.forEach((key, index) => {
    if (!frameKeyPattern.test(key)) {
      throw new Error(`Invalid frame key at index ${index}: "${key}". Must be format: 0, -1, 50%, or -50%`);
    }
    
    // Additional validation for percentage format
    if (key.includes('%')) {
      const percentage = parseInt(key.replace('%', ''));
      if (percentage < 0 || percentage > 100) {
        throw new Error(`Invalid percentage in frame key "${key}": must be 0-100%`);
      }
    }
  });
}

/**
 * Generic URL validation
 * @param url - URL to validate
 * @param allowedProtocols - Array of allowed protocols (default: ['http:', 'https:'])
 * @returns True if valid, throws Error if invalid
 */
export function validateUrl(url: string, allowedProtocols: string[] = ['http:', 'https:']): boolean {
  if (typeof url !== 'string') {
    throw new Error('URL must be a string');
  }
  
  if (url.length > 2048) {
    throw new Error('URL must be less than 2048 characters');
  }
  
  try {
    const urlObj = new URL(url);
    if (!allowedProtocols.includes(urlObj.protocol)) {
      throw new Error(`URL protocol must be one of: ${allowedProtocols.join(', ')}`);
    }
    return true;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Invalid URL format');
    }
    throw error;
  }
}

/**
 * Validate text length constraints
 * @param text - Text to validate
 * @param minLength - Minimum length (optional)
 * @param maxLength - Maximum length (optional)
 * @returns True if valid, throws Error if invalid
 */
export function validateTextLength(text: string, minLength?: number, maxLength?: number): boolean {
  if (typeof text !== 'string') {
    throw new Error('Text must be a string');
  }
  
  if (minLength !== undefined && text.length < minLength) {
    throw new Error(`Text must be at least ${minLength} characters long`);
  }
  
  if (maxLength !== undefined && text.length > maxLength) {
    throw new Error(`Text must be no more than ${maxLength} characters long`);
  }
  
  return true;
}

/**
 * Validate numeric constraints
 * @param value - Numeric value to validate
 * @param min - Minimum value (optional)
 * @param max - Maximum value (optional)
 * @param isInteger - Whether the value must be an integer (default: false)
 * @returns True if valid, throws Error if invalid
 */
export function validateNumeric(value: number, min?: number, max?: number, isInteger: boolean = false): boolean {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error('Value must be a valid number');
  }
  
  if (isInteger && !Number.isInteger(value)) {
    throw new Error('Value must be an integer');
  }
  
  if (min !== undefined && value < min) {
    throw new Error(`Value must be at least ${min}`);
  }
  
  if (max !== undefined && value > max) {
    throw new Error(`Value must be no more than ${max}`);
  }
  
  return true;
}

