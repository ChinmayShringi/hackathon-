import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { uploadService, UploadState, UploadOptions } from '@/lib/upload-service';

export interface UploadWidgetProps {
  // Core configuration
  assetType: number; // 1=image, 2=video, 3=audio, 4=document
  maxFileSize?: number; // Override default size limits
  acceptedTypes?: string[]; // Override accepted MIME types
  multiple?: boolean; // Allow multiple file selection
  
  // Recipe integration
  recipeId?: number; // Associate with specific recipe
  recipeVariable?: string; // Recipe variable name for this upload
  
  // UI customization
  variant?: 'default' | 'compact' | 'inline';
  placeholder?: string;
  className?: string;
  
  // Event handlers
  onUploadStart?: (file: File) => void;
  onUploadProgress?: (file: File, progress: number) => void;
  onUploadComplete?: (assetId: string) => void;
  onUploadError?: (file: File, error: string) => void;
  onUploadCancel?: (file: File) => void;
  
  // Validation
  validator?: (file: File) => string | null | Promise<string | null>; // Return error message or null
}

export interface UploadWidgetState {
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error' | 'canceled';
  progress: number;
  message?: string;
  assetId?: string;
  error?: string;
  file?: File;
}

export abstract class AbstractUploadWidget extends React.Component<UploadWidgetProps, UploadWidgetState> {
  protected uploadId: string;

  constructor(props: UploadWidgetProps) {
    super(props);
    this.uploadId = `upload-${Math.random().toString(36).substr(2, 9)}`;
    this.state = {
      status: 'idle',
      progress: 0,
      message: 'Drop files here or click to browse'
    };
  }

  protected abstract renderUploadArea(): React.ReactNode;
  protected abstract renderProgress(): React.ReactNode;
  protected abstract renderPreview(): React.ReactNode;

  protected handleFileSelect = async (files: File[]) => {
    if (files.length === 0) return;
    
    const file = files[0]; // For now, handle single file
    const { recipeId, recipeVariable, onUploadStart, validator } = this.props;

    // Validate file
    if (validator) {
      const validationError = await validator(file);
      if (validationError) {
        this.setState({ status: 'error', error: validationError, progress: 0 });
        this.props.onUploadError?.(file, validationError);
        return;
      }
    }

    // Update state
    this.setState({ 
      status: 'uploading', 
      progress: 0, 
      message: 'Preparing upload...',
      file,
      error: undefined 
    });

    onUploadStart?.(file);

    try {
      // Upload file using the service
      const assetId = await uploadService.uploadFile(file, {
        recipeId,
        recipeVariable,
        onProgress: (progress) => {
          this.setState({ progress: progress.percentage });
          this.props.onUploadProgress?.(file, progress.percentage);
        },
        onStateChange: (state) => {
          this.setState({
            status: state.status,
            progress: state.progress,
            message: state.message,
            assetId: state.assetId,
            error: state.error
          });
        }
      });

      // Success
      this.setState({ 
        status: 'complete', 
        progress: 100, 
        message: 'Upload complete!',
        assetId 
      });

      this.props.onUploadComplete?.(assetId);

    } catch (error: any) {
      const errorMessage = error?.message || 'Upload failed';
      this.setState({ 
        status: 'error', 
        error: errorMessage,
        message: errorMessage 
      });
      this.props.onUploadError?.(file, errorMessage);
    }
  };

  protected handleCancel = () => {
    const { assetId, file } = this.state;
    if (assetId && file) {
      uploadService.cancelUpload(assetId);
      this.setState({ 
        status: 'canceled', 
        message: 'Upload canceled',
        progress: 0 
      });
      this.props.onUploadCancel?.(file);
    }
  };

  protected handleRetry = () => {
    const { file } = this.state;
    if (file) {
      this.handleFileSelect([file]);
    }
  };

  protected handleDrop = useCallback((acceptedFiles: File[]) => {
    this.handleFileSelect(acceptedFiles);
  }, []);

  protected getAcceptedTypes(): string[] {
    const { assetType, acceptedTypes } = this.props;
    
    if (acceptedTypes) return acceptedTypes;
    
    // Default accepted types based on asset type
    switch (assetType) {
      case 1: // Image
        return ['image/jpeg', 'image/png', 'image/webp'];
      case 2: // Video
        return ['video/mp4', 'video/webm', 'video/quicktime'];
      case 3: // Audio
        return ['audio/mpeg', 'audio/wav'];
      case 4: // Document
        return ['application/pdf'];
      default:
        return ['image/*', 'video/*', 'audio/*', 'application/pdf'];
    }
  };

  protected getMaxFileSize(): number {
    const { assetType, maxFileSize } = this.props;
    
    if (maxFileSize) return maxFileSize;
    
    // Default file sizes based on asset type (in bytes)
    switch (assetType) {
      case 1: return 25 * 1024 * 1024; // 25MB for images
      case 2: return 500 * 1024 * 1024; // 500MB for videos
      case 3: return 50 * 1024 * 1024; // 50MB for audio
      case 4: return 25 * 1024 * 1024; // 25MB for documents
      default: return 100 * 1024 * 1024; // 100MB default
    }
  };

  render() {
    const { variant = 'default', className } = this.props;
    const { status, progress, message, error, file } = this.state;

    const baseClasses = cn(
      'transition-all duration-200',
      {
        'border-2 border-dashed border-gray-300 hover:border-gray-400': variant === 'default',
        'border border-gray-200 rounded-md p-2': variant === 'compact',
        'border-b border-gray-200 pb-2': variant === 'inline'
      },
      className
    );

    return (
      <div className={baseClasses}>
        {this.renderUploadArea()}
        {status !== 'idle' && this.renderProgress()}
        {file && this.renderPreview()}
      </div>
    );
  }
}

// Hook-based version for functional components
export function useUploadWidget(props: UploadWidgetProps) {
  const [state, setState] = useState<UploadWidgetState>({
    status: 'idle',
    progress: 0,
    message: 'Drop files here or click to browse'
  });

  const handleFileSelect = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    
    const file = files[0];
    const { recipeId, recipeVariable, onUploadStart, validator } = props;

          // Validate file
      if (validator) {
        const validationError = await validator(file);
        if (validationError) {
          setState({ status: 'error', error: validationError, progress: 0 });
          props.onUploadError?.(file, validationError);
          return;
        }
      }

    // Update state
    setState({ 
      status: 'uploading', 
      progress: 0, 
      message: 'Preparing upload...',
      file,
      error: undefined 
    });

    onUploadStart?.(file);

    try {
      // Upload file using the service
      const assetId = await uploadService.uploadFile(file, {
        recipeId,
        recipeVariable,
        onProgress: (progress) => {
          setState(prev => ({ ...prev, progress: progress.percentage }));
          props.onUploadProgress?.(file, progress.percentage);
        },
        onStateChange: (uploadState) => {
          setState({
            status: uploadState.status,
            progress: uploadState.progress,
            message: uploadState.message,
            assetId: uploadState.assetId,
            error: uploadState.error
          });
        }
      });

      // Success
      setState({ 
        status: 'complete', 
        progress: 100, 
        message: 'Upload complete!',
        assetId 
      });

      props.onUploadComplete?.(assetId);

    } catch (error: any) {
      const errorMessage = error?.message || 'Upload failed';
      setState({ 
        status: 'error', 
        error: errorMessage,
        message: errorMessage,
        progress: 0
      });
      props.onUploadError?.(file, errorMessage);
    }
  }, [props]);

  const handleCancel = useCallback(() => {
    const { assetId, file } = state;
    if (assetId && file) {
      uploadService.cancelUpload(assetId);
      setState({ 
        status: 'canceled', 
        message: 'Upload canceled',
        progress: 0 
      });
      props.onUploadCancel?.(file);
    }
  }, [state, props]);

  const handleRetry = useCallback(() => {
    const { file } = state;
    if (file) {
      handleFileSelect([file]);
    }
  }, [state, handleFileSelect]);

  const dropzone = useDropzone({
    onDrop: handleFileSelect,
    accept: props.acceptedTypes ? 
      Object.fromEntries(props.acceptedTypes.map(type => [type, []])) : 
      undefined,
    maxSize: props.maxFileSize || props.assetType === 2 ? 500 * 1024 * 1024 : 25 * 1024 * 1024,
    multiple: props.multiple || false
  });

  return {
    state,
    dropzone,
    handleFileSelect,
    handleCancel,
    handleRetry
  };
}
