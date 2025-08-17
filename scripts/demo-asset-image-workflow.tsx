#!/usr/bin/env tsx

/**
 * Demo Script: Asset Image Workflow
 * 
 * This script demonstrates how the AssetImageComponent can be used in a workflow
 * for future image-to-video recipes. It shows:
 * 1. How to retrieve asset information
 * 2. How to use that information in processing decisions
 * 3. How components can be chained together
 * 
 * Usage: npx tsx scripts/demo-asset-image-workflow.tsx [assetId]
 */

import { config } from 'dotenv';
import { AssetImageComponent } from '../shared/components/asset-image-component';
import { WorkflowEngine, Workflow, ComponentConnection } from '../shared/workflow-engine';

// Load environment variables
config();

async function demoAssetImageWorkflow() {
  console.log('🎬 Demo: Asset Image Workflow for Image-to-Video Recipes\n');
  
  // Create component instances
  const assetImageComponent = new AssetImageComponent();
  
  console.log('📋 Available Components:');
  console.log(`  - ${assetImageComponent.name} (${assetImageComponent.id})`);
  console.log(`    Category: ${assetImageComponent.category}`);
  console.log(`    Description: ${assetImageComponent.description}\n`);
  
  // Test asset retrieval
  const testAssetId = process.argv[2] || 'demo-asset-456';
  console.log(`🎯 Testing asset retrieval for ID: ${testAssetId}\n`);
  
  try {
    // Get asset information
    console.log('📥 Retrieving asset information...');
    const assetOutputs = await assetImageComponent.process([testAssetId]);
    
    console.log('✅ Asset retrieved successfully!\n');
    
    // Extract key information for workflow decisions
    const assetMetadata = assetOutputs[0];
    const imageUrl = assetOutputs[1];
    const thumbnailUrl = assetOutputs[2];
    const dimensions = assetOutputs[3];
    const tags = assetOutputs[4];
    const classification = assetOutputs[5];
    
    console.log('📊 Asset Information for Workflow Decisions:');
    console.log(`  Display Name: ${assetMetadata?.displayName || 'Unknown'}`);
    console.log(`  MIME Type: ${assetMetadata?.mimeType || 'Unknown'}`);
    console.log(`  File Size: ${assetMetadata?.fileSize || 0} bytes`);
    console.log(`  Dimensions: ${dimensions ? `${dimensions.width}x${dimensions.height}` : 'Unknown'}`);
    console.log(`  Tags: ${tags?.length ? tags.join(', ') : 'None'}`);
    console.log(`  CDN URL: ${imageUrl}`);
    console.log(`  Thumbnail: ${thumbnailUrl || 'Not available'}\n`);
    
    // Simulate workflow decision making
    console.log('🤔 Workflow Decision Making:');
    
    // Check if asset is suitable for video generation
    const isSuitableForVideo = await analyzeAssetForVideo(assetMetadata, dimensions, tags);
    
    if (isSuitableForVideo.suitable) {
      console.log('✅ Asset is suitable for video generation');
      console.log(`   Reason: ${isSuitableForVideo.reason}`);
      
      // Simulate video generation parameters
      const videoParams = generateVideoParameters(assetMetadata, dimensions, tags);
      console.log('\n🎥 Suggested Video Parameters:');
      console.log(`   Duration: ${videoParams.duration}s`);
      console.log(`   Aspect Ratio: ${videoParams.aspectRatio}`);
      console.log(`   Style: ${videoParams.style}`);
      console.log(`   Quality: ${videoParams.quality}`);
      
    } else {
      console.log('❌ Asset is not suitable for video generation');
      console.log(`   Reason: ${isSuitableForVideo.reason}`);
    }
    
    // Show how this would integrate with other components
    console.log('\n🔗 Component Integration Example:');
    console.log('In a real workflow, this component would connect to:');
    console.log('  - Image Analysis Component (for content understanding)');
    console.log('  - Style Transfer Component (for visual effects)');
    console.log('  - Video Generation Component (for final output)');
    console.log('  - Quality Control Component (for validation)');
    
  } catch (error) {
    console.error('❌ Workflow demo failed:', error);
    
    if (error instanceof Error && error.message.includes('Asset not found')) {
      console.log('\n💡 This is expected for demo asset IDs. Try with a real asset ID:');
      console.log('   npx tsx scripts/demo-asset-image-workflow.tsx <real-asset-id>');
    }
  }
  
  console.log('\n🏁 Workflow demo completed');
}

/**
 * Analyze if an asset is suitable for video generation
 */
async function analyzeAssetForVideo(assetMetadata: any, dimensions: any, tags: string[]) {
  // Simulate analysis logic
  const analysis = {
    suitable: false,
    reason: '',
    confidence: 0
  };
  
  // Check file size (should be reasonable for processing)
  if (assetMetadata?.fileSize > 50 * 1024 * 1024) { // 50MB
    analysis.suitable = false;
    analysis.reason = 'File too large for efficient processing';
    analysis.confidence = 0.9;
    return analysis;
  }
  
  // Check dimensions (should have reasonable aspect ratio)
  if (dimensions) {
    const aspectRatio = dimensions.width / dimensions.height;
    if (aspectRatio < 0.5 || aspectRatio > 2.0) {
      analysis.suitable = false;
      analysis.reason = 'Aspect ratio not suitable for video (too extreme)';
      analysis.confidence = 0.8;
      return analysis;
    }
  }
  
  // Check tags for content suitability
  const videoFriendlyTags = ['landscape', 'portrait', 'nature', 'city', 'abstract', 'art'];
  const hasVideoFriendlyTags = tags.some(tag => videoFriendlyTags.includes(tag.toLowerCase()));
  
  if (hasVideoFriendlyTags) {
    analysis.suitable = true;
    analysis.reason = 'Content tags indicate video-friendly subject matter';
    analysis.confidence = 0.7;
  } else {
    analysis.suitable = true;
    analysis.reason = 'Asset meets basic technical requirements for video generation';
    analysis.confidence = 0.6;
  }
  
  return analysis;
}

/**
 * Generate video parameters based on asset analysis
 */
function generateVideoParameters(assetMetadata: any, dimensions: any, tags: string[]) {
  const params = {
    duration: 5,
    aspectRatio: '16:9',
    style: 'cinematic',
    quality: 'high'
  };
  
  // Adjust duration based on content type
  if (tags.some(tag => ['nature', 'landscape'].includes(tag.toLowerCase()))) {
    params.duration = 8;
    params.style = 'cinematic';
  } else if (tags.some(tag => ['abstract', 'art'].includes(tag.toLowerCase()))) {
    params.duration = 6;
    params.style = 'artistic';
  }
  
  // Adjust aspect ratio based on image dimensions
  if (dimensions) {
    const aspectRatio = dimensions.width / dimensions.height;
    if (aspectRatio > 1.5) {
      params.aspectRatio = '16:9';
    } else if (aspectRatio < 0.8) {
      params.aspectRatio = '9:16';
    } else {
      params.aspectRatio = '1:1';
    }
  }
  
  return params;
}

// Run the demo
if (import.meta.url === `file://${process.argv[1]}`) {
  demoAssetImageWorkflow().catch(console.error);
}
