export interface FrameRequest {
  original: string;        // "0, -1, 50%"
  parsed: FrameSpec[];     // [{type: 'index', value: 0}, {type: 'percentage', value: 50}]
}

export interface FrameSpec {
  type: 'index' | 'percentage' | 'negative';
  value: number;
  original: string;        // "0", "50%", "-1"
}

export interface VideoMetadata {
  total_frames: number;
  dimensions: { width: number; height: number };
  duration: number;
  format: string;
  file_size: number;
}

export interface FrameResult {
  frame_id: number;
  bucket_key: string;
  s3_url: string;
  processing_time_ms: number;
  original_request: string;
}

export interface UnfulfilledFrame {
  original_request: string;
  reason: string;
  attempted_value?: number;
}

export interface GetFramesResponse {
  success: boolean;
  video_metadata: VideoMetadata;
  frames: {
    [request_key: string]: FrameResult;
  };
  unfulfilled?: {
    [request_key: string]: UnfulfilledFrame;
  };
  errors?: string[];
  summary: {
    total_requested: number;
    total_extracted: number;
    total_unfulfilled: number;
    total_processing_time_ms: number;
  };
}

export interface LambdaEvent {
  video_url: string;
  frame_requests: string;
  destination_bucket: string;
  output_prefix?: string;
  allow_partial_completion?: boolean;
}

export interface FrameExtractionResult {
  success: boolean;
  frame_id: number;
  output_path: string;
  processing_time_ms: number;
  error?: string;
}

export interface S3UploadResult {
  success: boolean;
  bucket_key: string;
  s3_url: string;
  error?: string;
}
