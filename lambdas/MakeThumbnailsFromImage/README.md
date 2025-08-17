# MakeThumbnailsFromImage Lambda

Generates multiple thumbnail sizes from uploaded images while maintaining aspect ratio using smart dimension anchoring.

## 🎯 Purpose

This Lambda function creates thumbnails for user-uploaded images in the Delula media library system. It generates multiple sizes optimized for different use cases (UI icons, gallery grids, previews) while preserving the original image's aspect ratio.

## 🏗️ Architecture

### **Smart Aspect Ratio Preservation**
- **Anchors to smallest dimension**: For a 1920x1080 image, a 32px thumbnail becomes 57x32 (maintains 16:9)
- **No cropping or distortion**: Images are scaled proportionally
- **Efficient storage**: No wasted space from forced square thumbnails

### **Thumbnail Size Strategy**
```typescript
const MEDIA_LIBRARY_THUMBNAIL_SIZES = {
  // Collection & Category Icons
  icon32: 32,    // Tiny icons, list views
  icon48: 48,    // Collection thumbnails, folders
  icon72: 72,    // Category icons
  
  // Gallery Grid Views
  thumb64: 64,   // Compact grid
  thumb96: 96,   // Standard grid (most common)
  thumb128: 128, // Large grid
  thumb160: 160, // Gallery preview
  
  // Detail & Preview Views
  preview256: 256, // Medium preview
  preview320: 320, // Large preview
  preview512: 512, // Full preview
};
```

## 📥 Input

```typescript
interface MakeThumbnailsRequest {
  remote_url: string;        // Source image URL
  bucket: string;            // S3 bucket name  
  key: string;               // Base S3 key (e.g., "library/user/123/images/thumbnails")
  prefix_name: string;       // Image identifier (e.g., "asset_abc123")
  sizes: number[];           // Array of thumbnail sizes [32, 48, 72, 64, 96, 128, 160, 256, 320, 512]
}
```

## 📤 Output

```typescript
interface MakeThumbnailsResult {
  success: boolean;
  message: string;
  thumbnails: {
    [size: string]: ThumbnailResult;
  };
  processing: {
    time: string;
    timestamp: string;
    totalThumbnails: number;
  };
}
```

## 🗂️ File Structure

Generated thumbnails follow this S3 key pattern:
```
bucket_key/[prefix_name]_[size].webp

Examples:
- library/user/123/images/thumbnails/asset_abc123_32.webp
- library/user/123/images/thumbnails/asset_abc123_48.webp
- library/user/123/images/thumbnails/asset_abc123_72.webp
```

## 🚀 Performance Features

- **Parallel processing**: All thumbnails generated simultaneously
- **WebP format**: Best compression/quality ratio
- **Memory efficient**: Stream processing, minimal memory usage
- **Fast execution**: Optimized for Lambda cold starts

## 🔧 Technical Implementation

### **Dependencies**
- **ImageMagick**: For image processing and WebP generation
- **AWS SDK**: For S3 operations
- **Node.js 22.x**: Modern runtime for performance

### **AWS Layer**
- Uses public ImageMagick layer: `arn:aws:lambda:us-east-1:175033217214:layer:imagemagick:1`

### **IAM Permissions**
- **S3**: `GetObject`, `PutObject`, multipart upload operations
- **CloudWatch**: Log creation and writing
- **Lambda**: Basic execution permissions

## 🧪 Testing

```bash
# Build the project
npm run build

# Run tests
npm test

# Test locally
npm run test:local

# Deploy to AWS
npm run deploy
```

## 📊 Example Usage

```typescript
// Call the Lambda
const result = await lambda.invoke({
  FunctionName: 'MakeThumbnailsFromImage',
  Payload: JSON.stringify({
    remote_url: 'https://example.com/image.jpg',
    bucket: 'delula-media-prod',
    key: 'library/user/123/images/thumbnails',
    prefix_name: 'vacation_photo_2024',
    sizes: [32, 48, 72, 64, 96, 128, 160, 256, 320, 512]
  })
});

// Result includes all thumbnail URLs and metadata
console.log(result.thumbnails['32'].cdnUrl); // https://cdn.delu.la/...
```

## 🔄 Integration

This Lambda integrates with:
- **Media Library Upload System**: Called after image uploads
- **Derivative Service**: Replaces the old Sharp-based processing
- **CDN System**: Generates proper CDN URLs for thumbnails
- **Database Updates**: Updates `thumbnailUrl` fields in `userAssets` table

## 🚨 Error Handling

- **Input validation**: Checks all required fields and size constraints
- **Download failures**: Graceful handling of network issues
- **Processing errors**: Individual thumbnail failures don't stop the batch
- **Cleanup**: Temporary files always cleaned up, even on failure
- **Logging**: Comprehensive logging for debugging and monitoring
