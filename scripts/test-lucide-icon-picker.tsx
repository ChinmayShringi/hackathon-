import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import LucideIconPicker from '../client/src/components/lucide-icon-picker';

// Simple test component to verify the icon picker
function TestIconPicker() {
  const [selectedIcon, setSelectedIcon] = useState<string>('');

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Lucide Icon Picker Test</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Test the Enhanced Icon Picker</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select an Icon:
              </label>
              <LucideIconPicker
                value={selectedIcon}
                onChange={setSelectedIcon}
                placeholder="Choose an icon..."
              />
            </div>
            
            <div className="mt-6 p-4 bg-gray-700 rounded border border-gray-600">
              <h3 className="text-lg font-medium text-white mb-2">Selected Icon:</h3>
              {selectedIcon ? (
                <div className="flex items-center space-x-3">
                  <span className="text-green-400 font-mono">{selectedIcon}</span>
                  <button
                    onClick={() => setSelectedIcon('')}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <span className="text-gray-400">No icon selected</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Features to Test:</h2>
          <ul className="text-gray-300 space-y-2">
            <li>✅ Click the button to open the icon picker modal</li>
            <li>✅ Search for icons using the search input</li>
            <li>✅ Browse all available Lucide icons in a grid</li>
            <li>✅ Select an icon to see it displayed in the button</li>
            <li>✅ Use the X button to clear the selection</li>
            <li>✅ Modal should be responsive and work on different screen sizes</li>
            <li>✅ Dark theme styling should match your admin interface</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Create a simple HTML page to test the component
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lucide Icon Picker Test</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {}
            }
        }
    </script>
</head>
<body class="dark">
    <div id="root"></div>
    <script type="module">
        import React from 'https://esm.sh/react@18';
        import { createRoot } from 'https://esm.sh/react-dom@18/client';
        import { TestIconPicker } from './test-lucide-icon-picker.tsx';
        
        const root = createRoot(document.getElementById('root'));
        root.render(React.createElement(TestIconPicker));
    </script>
</body>
</html>
`;

console.log('Lucide Icon Picker Test Component Created!');
console.log('Features enhanced:');
console.log('- Larger modal (max-w-6xl) for better icon browsing');
console.log('- Dark theme styling that matches your admin interface');
console.log('- Shows all icons by default (no more 100 icon limit)');
console.log('- Better search with improved placeholder text');
console.log('- Icon count display and search feedback');
console.log('- Responsive grid (8-12 columns depending on screen size)');
console.log('- Visual selection state with blue highlighting');
console.log('- Auto-focus on search input when modal opens');
console.log('- Better empty state with icon and helpful text');
console.log('- Improved hover states and transitions');

export { TestIconPicker }; 