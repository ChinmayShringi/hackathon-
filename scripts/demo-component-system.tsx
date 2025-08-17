#!/usr/bin/env tsx

import 'dotenv/config';
import { ComponentInputType } from '../shared/component-types';
import { ImageToVideoComponent } from '../shared/components/image-to-video-component';
import { WorkflowEngine, Workflow, ComponentConnection } from '../shared/workflow-engine';

/**
 * Demonstration of the new Abstract Component System
 * 
 * This script shows how to:
 * 1. Create components with typed inputs/outputs
 * 2. Build workflows by connecting components
 * 3. Execute workflows with proper input ordering
 * 4. Handle validation and error cases
 * 
 * Note: This is a demonstration system that doesn't interfere with existing production code.
 */

async function demonstrateComponentSystem() {
  console.log('🎯 Abstract Component System Demonstration\n');
  
  try {
    // Step 1: Create a component instance
    console.log('📦 Step 1: Creating ImageToVideoComponent...');
    const imageToVideoComponent = new ImageToVideoComponent();
    
    console.log(`   Component ID: ${imageToVideoComponent.id}`);
    console.log(`   Component Name: ${imageToVideoComponent.name}`);
    console.log(`   Input Channels: ${imageToVideoComponent.inputChannels.length}`);
    console.log(`   Output Channels: ${imageToVideoComponent.outputChannels.length}`);
    console.log(`   Credit Cost: ${imageToVideoComponent.creditCost}`);
    console.log(`   Estimated Time: ${imageToVideoComponent.estimatedProcessingTime}s`);
    
    // Step 2: Test component validation
    console.log('\n🔍 Step 2: Testing component validation...');
    
    // Test with valid inputs
    console.log('   Testing with valid inputs...');
    const validInputs = {
      baseImage: 'https://cdn.example.com/image.jpg',
      prompt: 'A majestic cat performing an Olympic diving routine with perfect form and grace',
      duration: 10,
      aspectRatio: '9:16',
      quality: 'hd'
    };
    
    try {
      const result = await imageToVideoComponent.processNamed(validInputs);
      console.log('   ✅ Valid inputs processed successfully');
      console.log(`   Outputs: ${Object.keys(result).length} channels`);
      console.log(`   Video URL: ${result.video}`);
      console.log(`   Thumbnail: ${result.thumbnail}`);
    } catch (error) {
      console.error('   ❌ Unexpected error with valid inputs:', error);
    }
    
    // Test with invalid inputs
    console.log('\n   Testing with invalid inputs...');
    const invalidInputs = {
      baseImage: 'not-a-url',
      prompt: 'too short'
    };
    
    try {
      await imageToVideoComponent.processNamed(invalidInputs);
      console.error('   ❌ Should have failed with invalid inputs');
    } catch (error) {
      console.log('   ✅ Correctly caught validation error:', error instanceof Error ? error.message : error);
    }
    
    // Step 3: Test ordered processing
    console.log('\n📋 Step 3: Testing ordered input processing...');
    
    // Create ordered inputs array (matching inputChannels order)
    const orderedInputs = [
      'https://cdn.example.com/cat.jpg',           // baseImage (position 0)
      'A cat doing a backflip into water',         // prompt (position 1)
      12,                                          // duration (position 2)
      '16:9',                                      // aspectRatio (position 3)
      '4k'                                         // quality (position 4)
    ];
    
    console.log('   Input order:', imageToVideoComponent.getInputOrder());
    console.log('   Ordered inputs:', orderedInputs);
    
    try {
      const orderedResult = await imageToVideoComponent.process(orderedInputs);
      console.log('   ✅ Ordered processing successful');
      console.log(`   Outputs: ${orderedResult.length} items`);
    } catch (error) {
      console.error('   ❌ Ordered processing failed:', error);
    }
    
    // Step 4: Test input order enforcement
    console.log('\n⚡ Step 4: Testing input order enforcement...');
    
    // Test with wrong order (should still work due to position field)
    const wrongOrderInputs = [
      'wrong-prompt',                              // This should go to position 1
      'https://cdn.example.com/cat.jpg',           // This should go to position 0
      8,                                           // This should go to position 2
      '9:16',                                      // This should go to position 3
      'hd'                                         // This should go to position 4
    ];
    
    console.log('   Testing with inputs in wrong order...');
    console.log('   Wrong order inputs:', wrongOrderInputs);
    
    try {
      const wrongOrderResult = await imageToVideoComponent.process(wrongOrderInputs);
      console.log('   ✅ Wrong order inputs processed successfully (position field handled it)');
      console.log(`   Outputs: ${wrongOrderResult.length} items`);
    } catch (error) {
      console.error('   ❌ Wrong order processing failed:', error);
    }
    
    // Step 5: Test workflow engine
    console.log('\n🚀 Step 5: Testing workflow engine...');
    
    // Create a simple workflow with two components
    const textToImageComponent = createTextToImageComponent();
    const imageToVideoComponent2 = new ImageToVideoComponent();
    
    const workflow: Workflow = {
      id: 'demo-workflow',
      name: 'Text to Video Pipeline',
      description: 'Generate image from text, then convert to video',
      components: [textToImageComponent, imageToVideoComponent2],
      connections: [
        {
          fromComponent: 'text-to-image',
          fromChannel: 'image',
          toComponent: 'image-to-video',
          toChannel: 'baseImage'
        }
      ],
      metadata: {
        version: '1.0.0',
        author: 'Demo System',
        tags: ['pipeline', 'text-to-video'],
        estimatedCost: 8,
        estimatedTime: 45
      }
    };
    
    console.log('   Created workflow:', workflow.name);
    console.log(`   Components: ${workflow.components.length}`);
    console.log(`   Connections: ${workflow.connections.length}`);
    
    // Execute workflow
    const workflowEngine = new WorkflowEngine();
    const initialInputs = {
      prompt: 'A majestic cat performing an Olympic diving routine',
      duration: 8,
      aspectRatio: '9:16',
      quality: 'hd'
    };
    
    console.log('   Executing workflow...');
    const workflowResult = await workflowEngine.executeWorkflow(workflow, initialInputs);
    
    console.log('   ✅ Workflow executed successfully');
    console.log(`   Execution ID: ${workflowResult.executionId}`);
    console.log(`   Status: ${workflowResult.status}`);
    console.log(`   Duration: ${workflowResult.metadata.duration}ms`);
    console.log(`   Total Cost: ${workflowResult.metadata.totalCost} credits`);
    console.log(`   Final Outputs: ${Object.keys(workflowResult.finalOutputs).length}`);
    
    // Step 6: Test error handling
    console.log('\n🚨 Step 6: Testing error handling...');
    
    // Create invalid workflow (cycle)
    const invalidWorkflow: Workflow = {
      id: 'invalid-workflow',
      name: 'Invalid Workflow with Cycle',
      components: [textToImageComponent, imageToVideoComponent2],
      connections: [
        {
          fromComponent: 'text-to-image',
          fromChannel: 'image',
          toComponent: 'image-to-video',
          toChannel: 'baseImage'
        },
        {
          fromComponent: 'image-to-video',
          fromChannel: 'video',
          toComponent: 'text-to-image',
          toChannel: 'prompt'
        }
      ]
    };
    
    console.log('   Testing invalid workflow with cycle...');
    
    try {
      await workflowEngine.executeWorkflow(invalidWorkflow, {});
      console.error('   ❌ Should have failed with cycle detection');
    } catch (error) {
      console.log('   ✅ Correctly caught cycle error:', error instanceof Error ? error.message : error);
    }
    
    console.log('\n🎉 Component System Demonstration Complete!');
    console.log('\n📚 Key Features Demonstrated:');
    console.log('   ✅ Type-safe input/output channels');
    console.log('   ✅ Input validation and constraints');
    console.log('   ✅ Position-based input ordering');
    console.log('   ✅ Dual processing methods (ordered and named)');
    console.log('   ✅ Workflow composition and execution');
    console.log('   ✅ Cycle detection and error handling');
    console.log('   ✅ Topological sorting for execution order');
    
  } catch (error) {
    console.error('❌ Demonstration failed:', error);
  }
}

/**
 * Create a simple text-to-image component for demonstration
 */
function createTextToImageComponent() {
  return {
    id: 'text-to-image',
    name: 'Text to Image',
    version: '1.0.0',
    description: 'Generate image from text prompt',
    category: 'image-generation',
    tags: ['ai', 'image', 'text-to-image'],
    creditCost: 3,
    estimatedProcessingTime: 15,
    
    inputChannels: [
      {
        id: 'prompt',
        type: ComponentInputType.TEXT_PROMPT,
        required: true,
        position: 0,
        description: 'Text prompt describing the image to generate'
      }
    ],
    
    outputChannels: [
      {
        id: 'image',
        type: ComponentInputType.IMAGE_URL,
        description: 'Generated image URL'
      }
    ],
    
    async process(inputs: any[]): Promise<any[]> {
      const [prompt] = inputs;
      console.log(`   🎨 Generating image from prompt: "${prompt}"`);
      
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock image URL
      const imageId = `img_${Date.now()}`;
      const imageUrl = `https://cdn.example.com/images/${imageId}.jpg`;
      
      return [imageUrl];
    },
    
    async processNamed(inputs: Record<string, any>): Promise<Record<string, any>> {
      const orderedInputs = [inputs.prompt];
      const outputs = await this.process(orderedInputs);
      return { image: outputs[0] };
    },
    
    validateInputs(inputs: any[]): void {
      if (!inputs[0] || typeof inputs[0] !== 'string' || inputs[0].trim().length === 0) {
        throw new Error('Prompt is required and must be a non-empty string');
      }
    },
    
    getInputOrder(): string[] {
      return ['prompt'];
    },
    
    hasRequiredInputs(inputs: Record<string, any>): boolean {
      return inputs.prompt != null;
    }
  };
}

// Run the demonstration
demonstrateComponentSystem().catch(console.error);
