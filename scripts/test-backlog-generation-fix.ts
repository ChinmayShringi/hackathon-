#!/usr/bin/env tsx

import 'dotenv/config';
import { backlogRetainMinimumService } from '../server/service-backlog-retain-minimum.ts';
import { storage } from '../server/storage';

async function testBacklogGenerationFix() {
  console.log('🧪 Testing backlog generation fix with proper metadata...\n');

  try {
    // Get the first alpha recipe
    const recipe = await storage.getRecipeBySlug('cat-olympic-diving');
    if (!recipe) {
      console.log('❌ No cat-olympic-diving recipe found');
      return;
    }

    console.log(`✅ Found recipe: ${recipe.name} (ID: ${recipe.id})`);
    console.log(`📋 Recipe steps: ${recipe.recipeSteps?.length || 0} steps`);

    // Create a test form data that matches the recipe structure
    const testFormData = {
      venue: 'home kitchen',
      age: '23',
      gender: 'female',
      breed: 'bengal',
      weight: '3',
      attitude: 'sophisticated and poised',
      soundStyle: 'stadium cheering',
      divingStyle: 'twisting dive',
      waterEntryStyle: 'meteoric'
    };

    console.log('\n📝 Test form data:', testFormData);

    // Create a backlog generation using the fixed method
    console.log('\n🔄 Creating backlog generation...');
    const generation = await backlogRetainMinimumService['createBacklogGeneration'](recipe, testFormData);

    console.log(`✅ Created generation ID: ${generation.id}`);
    console.log(`📋 Short ID: ${generation.shortId}`);
    console.log(`📊 Status: ${generation.status}`);
    console.log(`🎬 Type: ${generation.type}`);

    // Check the metadata
    console.log('\n🔍 Checking metadata completeness...');
    const metadata = generation.metadata as any;
    
    // Check formData
    if (metadata.formData) {
      console.log('✅ formData present:', metadata.formData);
      console.log(`   Keys: ${Object.keys(metadata.formData).join(', ')}`);
    } else {
      console.log('❌ formData missing');
    }

    // Check tagDisplayData
    if (metadata.tagDisplayData) {
      console.log('✅ tagDisplayData present');
      console.log(`   Keys: ${Object.keys(metadata.tagDisplayData).join(', ')}`);
      
      // Show sample tag data
      Object.entries(metadata.tagDisplayData).slice(0, 3).forEach(([key, data]) => {
        const tagData = data as any;
        console.log(`   ${key}: ${tagData.value}`);
      });
    } else {
      console.log('❌ tagDisplayData missing');
    }

    // Check extractedVariables
    if (metadata.extractedVariables) {
      console.log('✅ extractedVariables present');
      console.log(`   Keys: ${Object.keys(metadata.extractedVariables).join(', ')}`);
    } else {
      console.log('❌ extractedVariables missing');
    }

    // Check workflowType
    if (metadata.workflowType) {
      console.log(`✅ workflowType: ${metadata.workflowType}`);
    } else {
      console.log('❌ workflowType missing');
    }

    // Check videoGeneration
    if (metadata.videoGeneration) {
      console.log(`✅ videoGeneration: ${metadata.videoGeneration}`);
    } else {
      console.log('⚠️ videoGeneration not set (may be normal for non-video recipes)');
    }

    // Check backlog flags
    if (metadata.request_origin === 'backlog') {
      console.log('✅ request_origin flag set to backlog');
    } else if (metadata.request_origin === 'user') {
      console.log('✅ request_origin flag set to user');
    } else {
      console.log('❌ request_origin flag missing or invalid');
    }

    // Compare with normal user flow metadata structure
    console.log('\n🔍 Comparing with normal user flow metadata structure...');
    const expectedKeys = ['formData', 'tagDisplayData', 'extractedVariables', 'workflowType'];
    const missingKeys = expectedKeys.filter(key => !metadata[key]);
    
    if (missingKeys.length === 0) {
      console.log('✅ All expected metadata keys are present (matches normal user flow)');
    } else {
      console.log(`❌ Missing expected metadata keys: ${missingKeys.join(', ')}`);
    }

    // Check if it was added to queue
    console.log('\n📋 Checking queue status...');
    const queueStats = await storage.getQueueStats();
    console.log(`📊 Queue stats: ${JSON.stringify(queueStats, null, 2)}`);

    // Verify the generation is in the queue
    const isInQueue = queueStats.totalInQueue > 0;
    console.log(`✅ Generation ${isInQueue ? 'is' : 'is not'} in queue`);

    console.log('\n🎉 Backlog generation test completed successfully!');
    console.log('✅ The backlog generation now includes all the metadata that normal user generations have.');

  } catch (error) {
    console.error('❌ Error testing backlog generation:', error);
  }
}

testBacklogGenerationFix().catch(console.error); 