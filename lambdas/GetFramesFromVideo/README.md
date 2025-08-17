# GetFramesFromVideo Lambda

## Overview

The **GetFramesFromVideo** Lambda function extracts specific frames from video files using FFmpeg and uploads them to S3. It supports various frame selection methods including absolute indices, negative offsets, and percentage-based positioning.

## 🎯 **Features**

- **Multiple Frame Selection Methods**: Absolute indices (0, 1, 2...), negative offsets (-1, -2...), and percentages (50%, 90%)
- **FFmpeg Integration**: Uses standardized AWS Lambda layer for video processing
- **S3 Integration**: Automatic upload to specified S3 bucket with UUID naming
- **Flexible Error Handling**: Supports partial completion with detailed error reporting
- **Video Validation**: Checks video format, duration, and size constraints
- **Comprehensive Metadata**: Returns video information and processing statistics

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 22.12+
- AWS CLI configured with appropriate permissions
- FFmpeg Lambda layer access

### **Installation**
```bash
cd lambdas/GetFramesFromVideo
npm install
npm run build
```

### **Deployment**
```bash
npm run deploy
```

### **Testing**
```bash
# Test with live parameters
aws lambda invoke \
  --function-name GetFramesFromVideo \
  --region us-east-1 \
  --payload '{"video_url":"https://cdn.delu.la/test/xzdJXToBseHZj_HUw7szI_output.mp4","frame_requests":"0, -1, 50%, 90%","destination_bucket":"delula-media-prod","output_prefix":"test","allow_partial_completion":true}' \
  --cli-binary-format raw-in-base64-out \
  output.json
```

## 📋 **Input Parameters**

### **Required Parameters**
- **`video_url`** (string): URL to the source video file
- **`frame_requests`** (string): Comma-separated list of frame specifications
- **`destination_bucket`** (string): S3 bucket for output frames

### **Optional Parameters**
- **`output_prefix`** (string): S3 key prefix for organization (default: "frames")
- **`allow_partial_completion`** (boolean): Allow partial success if some frames fail

### **Frame Request Format**
```
"0, -1, 50%, 90%"
```
- **`0`**: First frame (index 0)
- **`-1`**: Last frame
- **`50%`**: Frame at 50% of video duration
- **`90%`**: Frame at 90% of video duration

## 📤 **Output Format**

### **Success Response**
```json
{
  "success": true,
  "video_metadata": {
    "total_frames": 1500,
    "dimensions": {"width": 1920, "height": 1080},
    "duration": 60.5,
    "format": "mp4",
    "file_size": 52428800
  },
  "frames": {
    "0": {
      "frame_id": 0,
      "bucket_key": "test/uuid1.png",
      "s3_url": "https://delula-media-prod.s3.amazonaws.com/test/uuid1.png",
      "processing_time_ms": 250,
      "original_request": "0"
    },
    "-1": {
      "frame_id": 1499,
      "bucket_key": "test/uuid2.png",
      "s3_url": "https://delula-media-prod.s3.amazonaws.com/test/uuid2.png",
      "processing_time_ms": 300,
      "original_request": "-1"
    }
  },
  "summary": {
    "total_requested": 4,
    "total_extracted": 2,
    "total_unfulfilled": 2,
    "total_processing_time_ms": 5000
  }
}
```

### **Partial Success Response**
```json
{
  "success": true,
  "video_metadata": {...},
  "frames": {...},
  "unfulfilled": {
    "50%": {
      "original_request": "50%",
      "reason": "Frame extraction failed: Invalid frame index",
      "attempted_value": 750
    }
  },
  "summary": {...}
}
```

### **Error Response**
```json
{
  "success": false,
  "video_metadata": {...},
  "frames": {},
  "errors": ["All frame requests failed"],
  "summary": {...}
}
```

## 🔧 **Technical Implementation**

### **FFmpeg Integration**
- **Layer**: Uses standardized AWS Lambda layer `arn:aws:lambda:us-east-1:175033217214:layer:ffmpeg:1`
- **Binary Paths**: `/opt/bin/ffmpeg` and `/opt/bin/ffprobe`
- **Frame Extraction**: Uses `select=eq(n\,index)` filter for precise frame selection

### **Frame Index Resolution**
```typescript
function resolveFrameIndex(frameSpec: FrameSpec, totalFrames: number): number {
  switch (frameSpec.type) {
    case 'index':
      return Math.max(0, Math.min(frameSpec.value, totalFrames - 1));
    case 'percentage':
      return Math.floor((frameSpec.value / 100) * totalFrames);
    case 'negative':
      const resolved = totalFrames + frameSpec.value;
      if (resolved < 0) {
        throw new Error(`Negative index exceeds video length`);
      }
      return resolved;
  }
}
```

### **S3 Upload Process**
1. **Frame Extraction**: Extract frame using FFmpeg
2. **UUID Generation**: Generate unique identifier for each frame
3. **S3 Upload**: Upload PNG file with public-read ACL
4. **Cleanup**: Remove local temporary files

## ⚙️ **Configuration**

### **Lambda Settings**
- **Runtime**: Node.js 22.x
- **Memory**: 2048MB (2GB for FFmpeg operations)
- **Timeout**: 300 seconds (5 minutes)
- **FFmpeg Layer**: `arn:aws:lambda:us-east-1:175033217214:layer:ffmpeg:1`

### **Limits**
- **Max Frames Per Request**: 10 frames
- **Max Video Duration**: 300 seconds (5 minutes)
- **Max Video Size**: 500MB
- **Supported Formats**: MP4, WebM, AVI, MOV, MKV, FLV, WMV

### **Environment Variables**
- **`AWS_DELULA_ACCESS_KEY`**: AWS access key for deployment
- **`AWS_DELULA_SECRET_ACCESS_KEY`**: AWS secret key for deployment
- **`AWS_REGION`**: AWS region (default: us-east-1)

## 🧪 **Testing**

### **Local Testing**
```bash
npm run test:local
```

### **Unit Tests**
```bash
npm run test
```

### **Test Coverage**
```bash
npm run test:coverage
```

### **Sample Test Event**
```json
{
  "video_url": "https://cdn.delu.la/test/xzdJXToBseHZj_HUw7szI_output.mp4",
  "frame_requests": "0, -1, 50%, 90%",
  "destination_bucket": "delula-media-prod",
  "output_prefix": "test",
  "allow_partial_completion": true
}
```

## 🚨 **Error Handling**

### **Validation Errors**
- **Invalid Video URL**: Unsupported format or inaccessible URL
- **Invalid Frame Requests**: Malformed frame specifications
- **Exceeded Limits**: Too many frames, video too long/large

### **Processing Errors**
- **Frame Extraction**: FFmpeg failures or invalid frame indices
- **S3 Upload**: Network issues or permission problems
- **Partial Failures**: Some frames succeed, others fail

### **Recovery Strategies**
- **`allow_partial_completion: true`**: Return successful frames even if some fail
- **Detailed Error Reporting**: Specific reasons for each failure
- **Graceful Degradation**: Continue processing remaining frames

## 📊 **Performance**

### **Processing Times**
- **Frame Extraction**: 200-500ms per frame (depends on video complexity)
- **S3 Upload**: 100-300ms per frame (depends on file size and network)
- **Total Processing**: 1-3 seconds for typical 4-frame requests

### **Memory Usage**
- **Video Download**: Temporary storage in `/tmp`
- **Frame Processing**: FFmpeg memory allocation
- **S3 Upload**: Buffer management for file uploads

### **Optimization Tips**
- **Batch Processing**: Request multiple frames in single call
- **Output Prefix**: Use organized S3 key structure
- **Error Handling**: Set appropriate `allow_partial_completion` flag

## 🔍 **Monitoring & Debugging**

### **CloudWatch Logs**
- **Frame-by-frame processing details**
- **FFmpeg command execution logs**
- **S3 upload status and timing**
- **Error details and stack traces**

### **Key Metrics**
- **Processing time per frame**
- **Success/failure rates**
- **S3 upload performance**
- **Memory and CPU utilization**

### **Common Issues**
1. **FFmpeg Not Found**: Verify Lambda layer attachment
2. **S3 Permission Errors**: Check IAM role permissions
3. **Timeout Issues**: Monitor video size and processing time
4. **Memory Errors**: Ensure sufficient Lambda memory allocation

## 🔐 **Security**

### **IAM Permissions**
- **S3 Access**: PutObject, PutObjectAcl, GetObject, ListBucket
- **CloudWatch Logs**: CreateLogGroup, CreateLogStream, PutLogEvents
- **Lambda Execution**: Basic execution role

### **Data Handling**
- **Temporary Files**: Stored in `/tmp` with automatic cleanup
- **S3 ACL**: Frames uploaded with public-read access
- **Input Validation**: URL and format validation before processing

## 📚 **Related Documentation**

- **[VideoToGIF_Square](../VideoToGIF_Square/README.md)**: Reference implementation for FFmpeg integration
- **[Lambda Functions Overview](../../docs/lambdas/README.md)**: General lambda development guidelines
- **[FFmpeg Integration Pattern](../../docs/lambdas/README.md#ffmpeg-integration-pattern)**: Standardized FFmpeg approach

---

**Last Updated**: Based on current implementation
**Status**: Ready for deployment and testing
**Next Review**: After initial production testing
