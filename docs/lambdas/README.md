# Delula Lambda Functions Documentation

## Overview

This directory contains comprehensive documentation for all AWS Lambda functions in the Delula project. Lambda functions provide serverless processing capabilities for video, image, and file operations.

**Note**: FFmpeg integration uses **standardized AWS Lambda layers** rather than custom binary packages. This ensures consistency, security updates, and reduces maintenance overhead.

## 🚀 **Lambda Functions Status**

### **✅ Production Ready (Stable)**

#### **VideoToGIF_Square**
- **Status**: Production Ready ✅
- **Purpose**: Converts videos to square GIFs with FFmpeg
- **FFmpeg Integration**: Uses **standardized AWS Lambda layer** `arn:aws:lambda:us-east-1:175033217214:layer:ffmpeg:1`
- **Use Case**: Video thumbnail generation and GIF creation
- **Code Quality**: **RECOMMENDED** for code comparisons and analysis
- **Documentation**: Complete with deployment guides and troubleshooting

**Key Features:**
- Video cropping to square format
- GIF conversion with optimized compression
- S3 integration for input/output
- Comprehensive error handling
- Memory: 2048MB, Timeout: 300s

---

#### **GetFramesFromVideo**
- **Status**: Production Ready ✅
- **Purpose**: Extracts specific frames from videos using FFmpeg
- **FFmpeg Integration**: Uses **standardized AWS Lambda layer** `arn:aws:lambda:us-east-1:175033217214:layer:ffmpeg:1`
- **Use Case**: Frame extraction for thumbnails, previews, and analysis
- **Code Quality**: **RECOMMENDED** for code comparisons and analysis
- **Documentation**: Complete with comprehensive guides and examples

**Key Features:**
- Multiple frame selection methods (index, negative, percentage)
- Frame-accurate extraction using `select=eq(n,index)` filter
- S3 integration with UUID-based naming
- Partial completion support with detailed error reporting
- Video validation and metadata extraction
- Memory: 2048MB, Timeout: 300s

---

### **⚠️ Work in Progress (Unstable)**

#### **GenerativeProgressGIF**
- **Status**: Work in Progress ⚠️
- **Purpose**: Creates animated progress GIFs from static images
- **Technology**: Pure JavaScript (Jimp, gifwrap) - No FFmpeg
- **Use Case**: Loading animations and progress indicators
- **Code Quality**: **NOT RECOMMENDED** for code comparisons or analysis
- **Documentation**: Basic structure, needs completion

**⚠️ Important Warning:**
- **DO NOT** use this lambda as a reference for stable code patterns
- **DO NOT** copy implementation details for production use
- **Implementation is incomplete** and may contain bugs
- **Architecture may change** significantly before completion

**Current State:**
- Basic GIF manipulation functionality
- Canvas-based image processing
- Incomplete error handling
- Missing comprehensive testing
- Deployment configuration incomplete

---

### **📁 File Transfer (Stable)**

#### **ExternalFileTransferToS3**
- **Status**: Production Ready ✅
- **Purpose**: Transfers media files from external services to S3
- **Use Case**: Media file ingestion and storage
- **Code Quality**: **RECOMMENDED** for file handling patterns
- **Documentation**: Complete with integration guides

## 🔧 **Development Guidelines**

### **For New Lambda Development**

#### **1. Follow VideoToGIF_Square or GetFramesFromVideo Pattern** ✅
- **FFmpeg Integration**: Use the established Lambda layer approach
- **Binary Paths**: `/opt/bin/ffmpeg` and `/opt/bin/ffprobe`
- **Memory/Timeout**: 2048MB, 300s for video processing
- **Error Handling**: Comprehensive logging and error categorization
- **Testing**: Include local testing and comprehensive test coverage

#### **2. Avoid GenerativeProgressGIF Patterns** ❌
- **DO NOT** copy incomplete implementations
- **DO NOT** use untested error handling patterns
- **DO NOT** rely on incomplete documentation
- **DO NOT** assume the architecture is final

#### **3. Code Quality Standards**
- **TypeScript**: Use strict typing and proper interfaces
- **Error Handling**: Comprehensive try-catch with detailed logging
- **Testing**: Include unit tests and integration tests
- **Documentation**: Complete README, deployment guide, and troubleshooting
- **Environment**: Use root .env file for configuration

### **FFmpeg Integration Pattern**

#### **Binary Path Resolution**
```typescript
// Use this established pattern for FFmpeg lambdas
// Uses standardized AWS Lambda layer, not custom binaries
let ffmpegPath: string;
let ffprobePath: string;

try {
  if (fs.existsSync('/opt/bin/ffmpeg') && fs.existsSync('/opt/bin/ffprobe')) {
    ffmpegPath = '/opt/bin/ffmpeg';
    ffprobePath = '/opt/bin/ffprobe';
  } else {
    ffmpegPath = '/usr/bin/ffmpeg';
    ffprobePath = '/usr/bin/ffprobe';
  }
} catch (error) {
  ffmpegPath = '/usr/bin/ffprobe';
  ffprobePath = '/usr/bin/ffprobe';
}
```

#### **Frame Extraction Pattern (GetFramesFromVideo)**
```typescript
// Use execFile to avoid shell quoting issues with FFmpeg filters
const vfArg = `select=eq(n\\,${frameIndex})`;
const args = [
  '-hide_banner',
  '-loglevel', 'error',
  '-i', inputPath,
  '-vf', vfArg,
  '-vsync', '0',
  '-frames:v', '1',
  '-y',
  outputPath
];

await execFileAsync(ffmpegPath, args);
```

#### **Deployment Configuration**
```typescript
const deployCommand = [
  'aws lambda create-function',
  `--function-name ${config.functionName}`,
  `--runtime nodejs22.x`,
  `--role ${config.roleArn}`,
  `--handler index.handler`,
  `--zip-file fileb://${zipFile}`,
  `--region ${config.region}`,
  '--timeout 300', // 5 minutes for processing
  '--memory-size 2048', // 2GB for operations
  `--layers arn:aws:lambda:us-east-1:175033217214:layer:ffmpeg:1`
].join(' ');
```

## 📚 **Documentation Structure**

### **Each Lambda Should Include:**
1. **README.md** - Overview, purpose, and quick start
2. **QUICKSTART.md** - Step-by-step setup and testing
3. **IMPLEMENTATION_SUMMARY.md** - Technical details and architecture
4. **deploy.ts** - Deployment automation script
5. **index.test.ts** - Comprehensive test coverage
6. **types.ts** - TypeScript type definitions

### **Required Sections:**
- **Purpose and Use Cases**
- **Prerequisites and Dependencies**
- **Installation and Setup**
- **Configuration and Environment**
- **Testing and Validation**
- **Deployment and Monitoring**
- **Troubleshooting and Common Issues**
- **Performance and Limitations**

## 🚨 **Critical Warnings**

### **GenerativeProgressGIF Status**
- **NOT READY** for production use
- **NOT STABLE** for code reference
- **IMPLEMENTATION INCOMPLETE**
- **ARCHITECTURE SUBJECT TO CHANGE**

### **Safe References**
- **VideoToGIF_Square**: ✅ Safe for all code patterns
- **GetFramesFromVideo**: ✅ Safe for all code patterns
- **ExternalFileTransferToS3**: ✅ Safe for file handling patterns
- **General Lambda Structure**: ✅ Safe for project organization

## 🔍 **Getting Help**

### **For Stable Lambda Development:**
1. **Review VideoToGIF_Square** implementation for video processing patterns
2. **Review GetFramesFromVideo** implementation for frame extraction patterns
3. **Follow established patterns** in deployment and error handling
4. **Use the FFmpeg layer** for video processing needs
5. **Reference the comprehensive documentation**

### **For GenerativeProgressGIF Issues:**
1. **Do not rely on current implementation**
2. **Consider it experimental** and incomplete
3. **Wait for completion** before using as reference
4. **Report issues** but expect significant changes

---

**Last Updated**: Based on current project status
**Next Review**: After GenerativeProgressGIF completion
**Status**: Production Ready (3/4 lambdas stable)
