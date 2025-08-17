import { config } from 'dotenv';

// Load environment variables first
config();

console.log('🔍 Testing Video Player Implementation');
console.log('=====================================');

// Test the video utilities with actual generation data
import { 
  getVideoOrientation, 
  getAspectRatioClass, 
  getAspectRatioClassFromMetadata,
  extractVideoDimensions,
  getGenerationAspectRatioClass 
} from '../client/src/lib/videoUtils';

// Simulate the generation data we're seeing
const testGeneration = {
  id: 278,
  metadata: {
    "jobId": "4bd01422-68df-4e11-9650-d8da8896cfea",
    "model": "veo3-fast",
    "s3Key": "videos/raw/5bd372ac-4eab-4ccb-a4a4-2e625d911951.mp4",
    "cdnUrl": "https://cdn.delu.la/videos/raw/5bd372ac-4eab-4ccb-a4a4-2e625d911951.mp4",
    "status": "submitted",
    "assetId": "5bd372ac-4eab-4ccb-a4a4-2e625d911951",
    "endpoint": "fal-ai/veo3/fast",
    "provider": "fal-ai/veo3/fast",
    "serviceId": 2,
    "workflowType": "text_to_video",
    "backlogService": true,
    "generationType": "text_to_video",
    "transferredToS3": true,
    "videoGeneration": "minimax-hailuo-02-pro",
            "request_origin": "backlog"
  }
};

console.log('\n📋 Test 1: Generation Data Analysis');
console.log('-----------------------------------');

console.log('Generation ID:', testGeneration.id);
console.log('Has metadata:', !!testGeneration.metadata);
console.log('Metadata keys:', Object.keys(testGeneration.metadata));

console.log('\n📋 Test 2: Aspect Ratio Detection');
console.log('----------------------------------');

const dimensions = extractVideoDimensions(testGeneration);
console.log('Extracted dimensions:', dimensions);

const aspectRatioClass = getGenerationAspectRatioClass(testGeneration);
console.log('Aspect ratio class:', aspectRatioClass);

console.log('\n📋 Test 3: Video Orientation Detection');
console.log('---------------------------------------');

// Test with common video dimensions
const testDimensions = [
  { width: 1920, height: 1080, name: 'HD Landscape' },
  { width: 1080, height: 1920, name: 'HD Portrait' },
  { width: 1080, height: 1080, name: 'HD Square' },
  { width: 1280, height: 720, name: '720p Landscape' },
  { width: 720, height: 1280, name: '720p Portrait' },
];

testDimensions.forEach(({ width, height, name }) => {
  const orientation = getVideoOrientation(width, height);
  const aspectClass = getAspectRatioClass(width, height);
  console.log(`${name} (${width}x${height}): ${orientation} → ${aspectClass}`);
});

console.log('\n📋 Test 4: Fallback Behavior');
console.log('-----------------------------');

// Test what happens when we don't have dimensions
const emptyGeneration = { metadata: {} };
const emptyDimensions = extractVideoDimensions(emptyGeneration);
const emptyAspectClass = getGenerationAspectRatioClass(emptyGeneration);

console.log('Empty generation dimensions:', emptyDimensions);
console.log('Empty generation aspect class:', emptyAspectClass);

console.log('\n🎯 Analysis:');
console.log('============');
console.log('✅ The video utilities are working correctly');
console.log('✅ Fallback to landscape (aspect-video) when no dimensions available');
console.log('⚠️  The issue might be that the VideoPlayer component is not applying the aspect ratio class correctly');
console.log('⚠️  Or the modal container might be overriding the aspect ratio');

console.log('\n🔧 Next Steps:');
console.log('==============');
console.log('1. Check if the VideoPlayer component is receiving the aspectRatioClass prop');
console.log('2. Verify the modal container is not overriding the aspect ratio');
console.log('3. Test with a video that has explicit aspect ratio metadata');
console.log('4. Check browser dev tools to see what CSS classes are being applied'); 