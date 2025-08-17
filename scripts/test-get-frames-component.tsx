import { GetFramesFromVideoComponent } from '../shared/components/get-frames-from-video-component';
import { ComponentRegistryService } from '../shared/component-registry-service';
import { config } from 'dotenv';

config(); // Load environment variables

/**
 * Test script for GetFramesFromVideo Component
 * 
 * This script tests the component with the specified test video and frame keys:
 * - Video: https://cdn.delu.la/test/xzdJXToBseHZj_HUw7szI_output.mp4
 * - Frame Keys: ["0", "-1", "50%", "90%"]
 */
async function testGetFramesComponent() {
  console.log('🧪 Testing GetFramesFromVideo Component...');
  console.log('==========================================');
  
  // Create component instance
  const component = new GetFramesFromVideoComponent();
  
  // Display component information
  console.log(`📋 Component ID: ${component.id}`);
  console.log(`📋 Component Name: ${component.name}`);
  console.log(`📋 Version: ${component.version}`);
  console.log(`📋 Category: ${component.category}`);
  console.log(`📋 Tags: ${component.tags?.join(', ')}`);
  console.log(`📋 Credit Cost: ${component.creditCost}`);
  console.log(`📋 Estimated Time: ${component.estimatedProcessingTime}s`);
  console.log('');
  
  // Display input channels
  console.log('📥 Input Channels:');
  component.inputChannels.forEach(channel => {
    console.log(`  - ${channel.id}: ${channel.description} (${channel.required ? 'required' : 'optional'})`);
  });
  console.log('');
  
  // Display output channels
  console.log('📤 Output Channels:');
  component.outputChannels.forEach(channel => {
    console.log(`  - ${channel.id}: ${channel.description}`);
  });
  console.log('');
  
  // Test inputs
  const testInputs = [
    'https://cdn.delu.la/test/xzdJXToBseHZj_HUw7szI_output.mp4',
    ['0', '-1', '50%', '90%']
  ];

  console.log('🎬 Test Configuration:');
  console.log(`📹 Video URL: ${testInputs[0]}`);
  console.log(`🖼️  Frame Keys: ${testInputs[1].join(', ')}`);
  console.log('');
  
  try {
    console.log('🚀 Starting component execution...');
    const startTime = Date.now();
    
    // Execute component
    const outputs = await component.process(testInputs);
    const framesOutput = outputs[0];
    
    const executionTime = Date.now() - startTime;
    
    console.log('✅ Component execution successful!');
    console.log(`⏱️  Execution time: ${executionTime}ms`);
    console.log('');
    
    // Display output structure
    console.log('📊 Output Structure:');
    console.log(JSON.stringify(framesOutput, null, 2));
    console.log('');
    
    // Validate output format
    console.log('🔍 Validating output format...');
    const expectedKeys = ['0', '-1', '50%', '90%'];
    let successCount = 0;
    let errorCount = 0;
    
    expectedKeys.forEach(key => {
      if (framesOutput[key]) {
        if (framesOutput[key].error) {
          console.log(`⚠️  Frame ${key}: ${framesOutput[key].error}`);
          errorCount++;
        } else {
          console.log(`✅ Frame ${key}: ID ${framesOutput[key].frame_id}, Bucket: ${framesOutput[key].bucket_key}`);
          successCount++;
        }
      } else {
        console.log(`❌ Frame ${key}: Missing from output`);
        errorCount++;
      }
    });
    
    console.log('');
    console.log(`📈 Summary: ${successCount} successful, ${errorCount} errors`);
    
    // Test component registry service
    console.log('');
    console.log('🗄️  Testing Component Registry Service...');
    
    try {
      const registryService = new ComponentRegistryService();
      
      // Register the component
      console.log('🔧 Registering component in database...');
      await registryService.registerComponent(component);
      
      // Retrieve component metadata
      console.log('📖 Retrieving component metadata...');
      const metadata = await registryService.getComponentById(component.id);
      
      if (metadata) {
        console.log('✅ Component metadata retrieved successfully');
        console.log(`📋 Database ID: ${metadata.id}`);
        console.log(`📋 Name: ${metadata.name}`);
        console.log(`📋 Input Channels: ${metadata.inputChannels.length}`);
        console.log(`📋 Output Channels: ${metadata.outputChannels.length}`);
      } else {
        console.log('❌ Failed to retrieve component metadata');
      }
      
      // Get all available components
      console.log('📚 Retrieving all available components...');
      const allComponents = await registryService.getAvailableComponents();
      console.log(`✅ Found ${allComponents.length} components in registry`);
      
      // Track usage
      console.log('📊 Tracking component usage...');
      await registryService.trackComponentUsage(
        component.id,
        null, // Use null for test user ID
        'test-execution-123',
        testInputs,
        outputs,
        executionTime,
        component.creditCost || 0,
        true
      );
      
      // Get usage stats
      console.log('📈 Retrieving usage statistics...');
      const stats = await registryService.getComponentUsageStats(component.id, 1);
      console.log(`📊 Usage stats: ${stats.totalExecutions} total executions`);
      
    } catch (registryError) {
      console.error('❌ Component registry service test failed:', registryError);
    }
    
  } catch (error) {
    console.error('❌ Component execution failed:', error);
    
    // Track failed usage
    try {
      const registryService = new ComponentRegistryService();
      await registryService.trackComponentUsage(
        component.id,
        null, // Use null for test user ID
        'test-execution-123',
        testInputs,
        [],
        0,
        component.creditCost || 0,
        false,
        error instanceof Error ? error.message : String(error)
      );
    } catch (trackingError) {
      console.error('❌ Failed to track failed usage:', trackingError);
    }
  }
}

/**
 * Test component validation
 */
async function testComponentValidation() {
  console.log('');
  console.log('🧪 Testing Component Validation...');
  console.log('==================================');
  
  const component = new GetFramesFromVideoComponent();
  
  // Test valid inputs
  console.log('✅ Testing valid inputs...');
  try {
    const validInputs = [
      'https://cdn.delu.la/test/valid.mp4',
      ['0', '1', '50%']
    ];
    component.validateInputs(validInputs);
    console.log('✅ Valid inputs passed validation');
  } catch (error) {
    console.error('❌ Valid inputs failed validation:', error);
  }
  
  // Test invalid video URL
  console.log('❌ Testing invalid video URL...');
  try {
    const invalidUrlInputs = [
      'not-a-url',
      ['0', '1']
    ];
    component.validateInputs(invalidUrlInputs);
    console.log('❌ Invalid URL should have failed validation');
  } catch (error) {
    console.log('✅ Invalid URL correctly rejected:', error instanceof Error ? error.message : String(error));
  }
  
  // Test invalid frame keys
  console.log('❌ Testing invalid frame keys...');
  try {
    const invalidFrameInputs = [
      'https://cdn.delu.la/test/valid.mp4',
      ['invalid', '150%', 'abc']
    ];
    component.validateInputs(invalidFrameInputs);
    console.log('❌ Invalid frame keys should have failed validation');
  } catch (error) {
    console.log('✅ Invalid frame keys correctly rejected:', error instanceof Error ? error.message : String(error));
  }
  
  // Test empty frame keys
  console.log('❌ Testing empty frame keys...');
  try {
    const emptyFrameInputs = [
      'https://cdn.delu.la/test/valid.mp4',
      []
    ];
    component.validateInputs(emptyFrameInputs);
    console.log('❌ Empty frame keys should have failed validation');
  } catch (error) {
    console.log('✅ Empty frame keys correctly rejected:', error instanceof Error ? error.message : String(error));
  }
}

/**
 * Main test execution
 */
async function main() {
  try {
    // Test component execution
    await testGetFramesComponent();
    
    // Test component validation
    await testComponentValidation();
    
    console.log('');
    console.log('🎉 All tests completed!');
    
  } catch (error) {
    console.error('💥 Test suite failed:', error);
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
