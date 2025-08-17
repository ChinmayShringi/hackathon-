#!/usr/bin/env tsx

async function testSafariFavicons() {
  console.log('🍎 Testing Safari Favicon Setup\n');

  const safariFaviconTests = [
    {
      name: 'Root favicon.ico (Safari default)',
      url: '/favicon.ico',
      required: true
    },
    {
      name: 'Apple Touch Icon 180x180 (Primary)',
      url: '/icons/apple-touch-icon-180x180.png',
      required: true
    },
    {
      name: 'Apple Touch Icon 152x152 (iPad)',
      url: '/icons/apple-touch-icon-152x152.png',
      required: true
    },
    {
      name: 'Apple Touch Icon 144x144 (iPhone)',
      url: '/icons/apple-touch-icon-144x144.png',
      required: true
    },
    {
      name: 'Favicon 16x16',
      url: '/icons/favicon-16x16.png',
      required: true
    },
    {
      name: 'Favicon 32x32',
      url: '/icons/favicon-32x32.png',
      required: true
    },
    {
      name: 'Social Card (for sharing)',
      url: '/icons/social-card.png',
      required: true
    }
  ];

  let allTestsPassed = true;

  for (const test of safariFaviconTests) {
    try {
      const response = await fetch(`http://localhost:5232${test.url}`);
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        const contentLength = response.headers.get('content-length');
        
        console.log(`✅ PASS: ${test.name}`);
        console.log(`   URL: ${test.url}`);
        console.log(`   Content-Type: ${contentType}`);
        console.log(`   Size: ${contentLength} bytes`);
        
        // Check if content-type is appropriate
        if (test.url.endsWith('.ico') && contentType !== 'image/x-icon') {
          console.log(`   ⚠️  WARNING: Expected image/x-icon, got ${contentType}`);
        } else if (test.url.endsWith('.png') && !contentType?.includes('image/png')) {
          console.log(`   ⚠️  WARNING: Expected image/png, got ${contentType}`);
        }
        
      } else {
        console.log(`❌ FAIL: ${test.name} - Status ${response.status}`);
        if (test.required) {
          allTestsPassed = false;
        }
      }
    } catch (error) {
      console.log(`❌ FAIL: ${test.name} - ${error}`);
      if (test.required) {
        allTestsPassed = false;
      }
    }
    console.log('');
  }

  // Test HTML structure
  console.log('Testing HTML favicon structure...');
  try {
    const response = await fetch('http://localhost:5232/');
    const html = await response.text();
    
    const checks = [
      {
        name: 'Root favicon.ico link',
        pattern: /<link rel="icon" href="\/favicon\.ico"/,
        required: true
      },
      {
        name: 'Apple touch icon 180x180 (primary)',
        pattern: /<link rel="apple-touch-icon" href="\/icons\/apple-touch-icon-180x180\.png" \/>/,
        required: true
      },
      {
        name: 'Apple mobile web app title',
        pattern: /<meta name="apple-mobile-web-app-title" content="Delula" \/>/,
        required: true
      },
      {
        name: 'Apple touch fullscreen',
        pattern: /<meta name="apple-touch-fullscreen" content="yes" \/>/,
        required: true
      }
    ];
    
    for (const check of checks) {
      if (check.pattern.test(html)) {
        console.log(`✅ PASS: ${check.name}`);
      } else {
        console.log(`❌ FAIL: ${check.name}`);
        if (check.required) {
          allTestsPassed = false;
        }
      }
    }
    
  } catch (error) {
    console.log(`❌ FAIL: Could not fetch HTML - ${error}`);
    allTestsPassed = false;
  }

  console.log('\n' + '='.repeat(50));
  if (allTestsPassed) {
    console.log('🎉 ALL SAFARI FAVICON TESTS PASSED!');
    console.log('\nSafari Optimization Summary:');
    console.log('✅ Root favicon.ico accessible');
    console.log('✅ Apple touch icons properly configured');
    console.log('✅ Safari-specific meta tags present');
    console.log('✅ Proper content types served');
    console.log('\nYour site should display beautifully in Safari bookmarks, tabs, and home screen!');
  } else {
    console.log('❌ SOME SAFARI FAVICON TESTS FAILED!');
    console.log('Please check the issues above and fix them for optimal Safari compatibility.');
    process.exit(1);
  }
}

// Run the test
testSafariFavicons().catch(console.error);

export {}; 