export interface GenerativeProgressGIFRequest {
  remote_url: string;
  bucket: string;
  key: string;
  reveal_duration_ms?: number; // Default: 10000
  color_count?: number; // Default: 16
}

export interface GIFFrame {
  image: Buffer;
  duration: number;
}

export interface ImagePalette {
  colors: Array<[number, number, number]>; // RGB tuples
  count: number;
}

export interface ProcessingResult {
  success: boolean;
  outputPath?: string;
  frameCount?: number;
  totalDuration?: number;
  error?: string;
  processingTime: number;
} 