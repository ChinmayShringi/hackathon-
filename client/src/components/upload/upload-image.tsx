import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Upload, 
  X, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Image as ImageIcon,
  FileImage
} from 'lucide-react';
import { useUploadWidget, UploadWidgetProps } from './abstract-upload-widget';

interface UploadImageProps extends Omit<UploadWidgetProps, 'assetType'> {
  // Image-specific options
  maxDimensions?: { width: number; height: number };
  aspectRatio?: 'free' | '1:1' | '16:9' | '4:3';
  quality?: 'low' | 'medium' | 'high';
  
  // Preview options
  showPreview?: boolean;
  previewSize?: 'sm' | 'md' | 'lg';
  
  // Recipe integration
  recipeVariable?: 'inputImage' | 'styleImage' | 'referenceImage' | string;
  
  // Replace mode - shows hover states for replacing existing images
  replaceMode?: boolean;
  existingImageUrl?: string;
  existingImageName?: string;
}

export function UploadImage({
  recipeId,
  recipeVariable,
  variant = 'default',
  placeholder,
  className,
  maxDimensions,
  aspectRatio = 'free',
  quality = 'medium',
  showPreview = true,
  previewSize = 'md',
  onUploadStart,
  onUploadProgress,
  onUploadComplete,
  onUploadError,
  onUploadCancel,
  validator,
  replaceMode = false,
  existingImageUrl,
  existingImageName,
  ...props
}: UploadImageProps) {
  
  const {
    state,
    dropzone,
    handleFileSelect,
    handleCancel,
    handleRetry
  } = useUploadWidget({
    ...props,
    assetType: 1, // Always image
    recipeId,
    recipeVariable,
    onUploadStart,
    onUploadProgress,
    onUploadComplete,
    onUploadError,
    onUploadCancel,
    validator: (file) => {
      // Custom image validation
      if (validator) {
        const customError = validator(file);
        if (customError) return customError;
      }
      
      // Image-specific validation
      if (!file.type.startsWith('image/')) {
        return 'File must be an image';
      }
      
      // Check dimensions if specified
      if (maxDimensions) {
        return new Promise<string | null>((resolve) => {
          const img = new Image();
          img.onload = () => {
            if (img.width > maxDimensions.width || img.height > maxDimensions.height) {
              resolve(`Image dimensions must be ${maxDimensions.width}x${maxDimensions.height} or smaller`);
            } else {
              resolve(null);
            }
          };
          img.onerror = () => resolve('Invalid image file');
          img.src = URL.createObjectURL(file);
        });
      }
      
      return null;
    }
  });

  const { status, progress, message, error, file, assetId } = state;
  const { getRootProps, getInputProps, isDragActive } = dropzone;

  const getPreviewSizeClasses = () => {
    switch (previewSize) {
      case 'sm': return 'w-16 h-16';
      case 'md': return 'w-24 h-24';
      case 'lg': return 'w-32 h-32';
      default: return 'w-24 h-24';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
        return <Upload className="h-4 w-4 animate-pulse" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'canceled':
        return <X className="h-4 w-4 text-gray-500" />;
      default:
        return <ImageIcon className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'uploading':
        return 'text-blue-600';
      case 'processing':
        return 'text-yellow-600';
      case 'complete':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'canceled':
        return 'text-gray-500';
      default:
        return 'text-gray-400';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'default':
        return cn(
          'border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200',
          isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 scale-105' 
            : 'border-gray-300 hover:border-gray-400 bg-gray-50 dark:bg-gray-900/50'
        );
      case 'compact':
        return cn(
          'border border-gray-200 rounded-md p-3 transition-all duration-200',
          isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
            : 'hover:border-gray-300'
        );
      case 'inline':
        return cn(
          'border-b border-gray-200 pb-3 transition-all duration-200',
          isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
            : 'hover:border-gray-300'
        );
      default:
        return '';
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={cn(
          'cursor-pointer transition-all duration-200',
          getVariantClasses()
        )}
      >
        <input {...getInputProps()} />
        
        {status === 'idle' && (
          <div className="flex flex-col items-center justify-center space-y-2">
            {replaceMode && existingImageUrl ? (
              <>
                {/* Show existing image in replace mode */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 mb-2">
                  <img
                    src={existingImageUrl}
                    alt={existingImageName || 'Existing image'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {placeholder || 'Drop new image to replace'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  Hover to replace • Supports JPG, PNG, WebP
                </div>
              </>
            ) : (
              <>
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                  <ImageIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {placeholder || 'Drop an image here or click to browse'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  Supports JPG, PNG, WebP • Max 25MB
                </div>
              </>
            )}
          </div>
        )}

        {status !== 'idle' && file && (
          <div className="flex items-center justify-center space-x-3">
            <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
              {getStatusIcon()}
            </div>
            <div className="text-sm">
              <div className="font-medium">{file.name}</div>
              <div className={cn('text-xs', getStatusColor())}>
                {message}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {status === 'uploading' && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>{Math.round(progress)}%</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-6 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-700 dark:text-red-400">
                  {error || 'Upload failed'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRetry}
                className="h-6 px-2 text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success State */}
      {status === 'complete' && (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-700 dark:text-green-400">
                  Upload complete!
                </span>
              </div>
              {assetId && (
                <div className="text-xs text-green-600 dark:text-green-400">
                  ID: {assetId.slice(0, 8)}...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      {showPreview && file && status !== 'idle' && (
        <div className="flex items-center space-x-3">
          <div className={cn(
            'rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center',
            getPreviewSizeClasses()
          )}>
            {file.type.startsWith('image/') ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <FileImage className="h-8 w-8 text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{file.name}</div>
            <div className="text-xs text-gray-500">
              {(file.size / 1024 / 1024).toFixed(1)} MB
            </div>
          </div>
        </div>
      )}

      {/* Recipe Integration Info */}
      {recipeId && recipeVariable && (
        <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded px-2 py-1">
          Will be used as: <span className="font-medium">{recipeVariable}</span>
        </div>
      )}
    </div>
  );
}

export default UploadImage;
