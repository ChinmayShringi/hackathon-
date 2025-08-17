import { ComponentRegistryService } from '../shared/component-registry-service';
import { GetFramesFromVideoComponent } from '../shared/components/get-frames-from-video-component';
import { ImageToVideoComponent } from '../shared/components/image-to-video-component';
import { AssetImageComponent } from '../shared/components/asset-image-component';
import { config } from 'dotenv';

config(); // Load environment variables

/**
 * Component Registration Script
 * 
 * This script registers all available components in the database registry
 * so they can be discovered by the future recipe editor.
 */
async function registerComponents() {
  console.log('🔧 Starting Component Registration...');
  console.log('=====================================');
  
  try {
    const registryService = new ComponentRegistryService();
    
    // List of components to register
    const components = [
      new GetFramesFromVideoComponent(),
      new ImageToVideoComponent(),
      new AssetImageComponent()
    ];
    
    console.log(`📋 Found ${components.length} components to register`);
    console.log('');
    
    for (const component of components) {
      console.log(`🔧 Registering component: ${component.name} (${component.id})`);
      
      try {
        await registryService.registerComponent(component);
        console.log(`✅ Successfully registered: ${component.name}`);
      } catch (error) {
        console.error(`❌ Failed to register ${component.name}:`, error);
      }
      
      console.log('');
    }
    
    // Verify registration by retrieving all components
    console.log('🔍 Verifying component registration...');
    const registeredComponents = await registryService.getAvailableComponents();
    
    console.log(`📊 Registry contains ${registeredComponents.length} components:`);
    registeredComponents.forEach(comp => {
      console.log(`  - ${comp.name} (${comp.id}) - ${comp.inputChannels.length} inputs, ${comp.outputChannels.length} outputs`);
    });
    
    console.log('');
    console.log('🎉 Component registration completed successfully!');
    
  } catch (error) {
    console.error('💥 Component registration failed:', error);
    process.exit(1);
  }
}

// Run registration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  registerComponents().catch(console.error);
}
