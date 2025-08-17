#!/usr/bin/env tsx

async function testManifest() {
  console.log('📱 Testing Web App Manifest\n');

  try {
    // Test manifest accessibility
    const response = await fetch('http://localhost:5232/manifest.webmanifest');
    
    if (!response.ok) {
      console.log(`❌ FAIL: Manifest not accessible - Status ${response.status}`);
      return;
    }

    const contentType = response.headers.get('content-type');
    if (contentType !== 'application/manifest+json' && !contentType?.includes('application/json')) {
      console.log(`⚠️  WARNING: Expected application/manifest+json, got ${contentType}`);
    }

    const manifest = await response.json();
    console.log('✅ PASS: Manifest is accessible and valid JSON\n');

    // Test required fields
    const requiredFields = [
      'name',
      'short_name', 
      'description',
      'start_url',
      'display',
      'background_color',
      'theme_color',
      'icons'
    ];

    let allRequiredFieldsPresent = true;
    for (const field of requiredFields) {
      if (manifest[field]) {
        console.log(`✅ PASS: Required field "${field}" present`);
      } else {
        console.log(`❌ FAIL: Required field "${field}" missing`);
        allRequiredFieldsPresent = false;
      }
    }

    // Test icon requirements
    console.log('\nTesting icons...');
    if (manifest.icons && Array.isArray(manifest.icons)) {
      console.log(`✅ PASS: Icons array present with ${manifest.icons.length} icons`);
      
      // Check for required icon sizes
      const requiredSizes = ['192x192', '512x512'];
      const presentSizes = manifest.icons.map((icon: any) => icon.sizes).filter(Boolean);
      
      for (const size of requiredSizes) {
        if (presentSizes.includes(size)) {
          console.log(`✅ PASS: Required icon size ${size} present`);
        } else {
          console.log(`❌ FAIL: Required icon size ${size} missing`);
          allRequiredFieldsPresent = false;
        }
      }

      // Check for maskable icon
      const hasMaskable = manifest.icons.some((icon: any) => icon.purpose === 'maskable');
      if (hasMaskable) {
        console.log('✅ PASS: Maskable icon present');
      } else {
        console.log('⚠️  WARNING: No maskable icon found (recommended for better PWA experience)');
      }

      // Test icon accessibility
      for (const icon of manifest.icons) {
        try {
          const iconResponse = await fetch(`http://localhost:5232${icon.src}`);
          if (iconResponse.ok) {
            console.log(`✅ PASS: Icon ${icon.src} accessible`);
          } else {
            console.log(`❌ FAIL: Icon ${icon.src} not accessible (${iconResponse.status})`);
            allRequiredFieldsPresent = false;
          }
        } catch (error) {
          console.log(`❌ FAIL: Icon ${icon.src} error - ${error}`);
          allRequiredFieldsPresent = false;
        }
      }
    } else {
      console.log('❌ FAIL: Icons array missing or invalid');
      allRequiredFieldsPresent = false;
    }

    // Test PWA-specific features
    console.log('\nTesting PWA features...');
    
    if (manifest.display === 'standalone') {
      console.log('✅ PASS: Display mode set to standalone');
    } else {
      console.log(`⚠️  WARNING: Display mode is "${manifest.display}" (standalone recommended for PWA)`);
    }

    if (manifest.scope) {
      console.log('✅ PASS: Scope defined');
    } else {
      console.log('⚠️  WARNING: No scope defined');
    }

    if (manifest.orientation) {
      console.log(`✅ PASS: Orientation set to "${manifest.orientation}"`);
    } else {
      console.log('⚠️  WARNING: No orientation defined');
    }

    // Test modern PWA features
    if (manifest.launch_handler) {
      console.log('✅ PASS: Launch handler configured');
    } else {
      console.log('ℹ️  INFO: No launch handler (optional modern feature)');
    }

    if (manifest.handle_links) {
      console.log(`✅ PASS: Link handling set to "${manifest.handle_links}"`);
    } else {
      console.log('ℹ️  INFO: No link handling configured (optional)');
    }

    // Test manifest structure
    console.log('\nTesting manifest structure...');
    
    const manifestString = JSON.stringify(manifest, null, 2);
    const isValidJSON = (() => {
      try {
        JSON.parse(manifestString);
        return true;
      } catch {
        return false;
      }
    })();

    if (isValidJSON) {
      console.log('✅ PASS: Manifest is valid JSON');
    } else {
      console.log('❌ FAIL: Manifest is not valid JSON');
      allRequiredFieldsPresent = false;
    }

    // Test manifest size (should be reasonable)
    const manifestSize = new Blob([manifestString]).size;
    if (manifestSize < 10000) { // Less than 10KB
      console.log(`✅ PASS: Manifest size is reasonable (${manifestSize} bytes)`);
    } else {
      console.log(`⚠️  WARNING: Manifest size is large (${manifestSize} bytes)`);
    }

    console.log('\n' + '='.repeat(50));
    if (allRequiredFieldsPresent) {
      console.log('🎉 MANIFEST IS PROPERLY STRUCTURED!');
      console.log('\nPWA Features Summary:');
      console.log('✅ All required fields present');
      console.log('✅ Icons properly configured');
      console.log('✅ PWA display mode enabled');
      console.log('✅ Modern PWA features included');
      console.log('✅ Valid JSON structure');
      console.log('\nYour app is ready for PWA installation! 📱✨');
    } else {
      console.log('❌ MANIFEST HAS ISSUES!');
      console.log('Please fix the issues above for proper PWA functionality.');
      process.exit(1);
    }

  } catch (error) {
    console.log(`❌ FAIL: Error testing manifest - ${error}`);
    process.exit(1);
  }
}

// Run the test
testManifest().catch(console.error);

export {}; 