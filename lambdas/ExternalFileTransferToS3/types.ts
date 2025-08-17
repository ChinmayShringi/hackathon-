export interface ExternalFileTransferRequest {
  remote_url: string;
  bucket: string;
  key: string;
  mime_type?: string;
} 