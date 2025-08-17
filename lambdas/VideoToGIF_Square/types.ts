export interface VideoToGIFRequest {
  remote_url: string;
  bucket: string;
  key: string;
  dimension?: number; // Default: 128
}

export interface VideoMetadata {
  width: number;
  height: number;
  duration: number;
  format: string;
}

export interface ConversionResult {
  success: boolean;
  outputPath?: string;
  fileSize?: number;
  duration: number;
  dimension?: number;
  error?: string;
  inputSize: number;
  outputSize: number;
  compressionRatio: number;
  processingTime: number;
} 