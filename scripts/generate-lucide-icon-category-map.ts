import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATEGORIES_DIR = path.join(__dirname, '../client/src/lucide-categories');
const OUTPUT_PATH = path.join(CATEGORIES_DIR, 'iconCategoryMap.json');

// Simple heuristic mapping based on icon name patterns
const iconCategoryPatterns: Record<string, string[]> = {
  'Arrows': ['arrow', 'chevron', 'move', 'navigation', 'direction'],
  'Animals': ['cat', 'dog', 'bird', 'fish', 'animal', 'paw', 'bone'],
  'People': ['user', 'person', 'people', 'man', 'woman', 'child', 'baby'],
  'Home': ['home', 'house', 'building', 'room', 'furniture', 'bed', 'chair'],
  'Food & beverage': ['food', 'drink', 'coffee', 'pizza', 'utensils', 'fork', 'knife'],
  'Tools': ['tool', 'hammer', 'wrench', 'screwdriver', 'drill', 'saw'],
  'Devices': ['phone', 'computer', 'laptop', 'tablet', 'device', 'screen'],
  'Communication': ['mail', 'message', 'chat', 'phone', 'call', 'email'],
  'Finance': ['money', 'dollar', 'euro', 'bank', 'credit', 'payment'],
  'Weather': ['sun', 'cloud', 'rain', 'snow', 'wind', 'weather'],
  'Time & calendar': ['clock', 'time', 'calendar', 'date', 'schedule'],
  'Security': ['lock', 'key', 'shield', 'security', 'password'],
  'Transportation': ['car', 'bike', 'bus', 'train', 'plane', 'transport'],
  'Shopping': ['shopping', 'cart', 'bag', 'store', 'buy', 'purchase'],
  'Social': ['like', 'share', 'comment', 'social', 'network'],
  'Gaming': ['game', 'controller', 'joystick', 'play', 'gaming'],
  'Medical': ['heart', 'medical', 'health', 'hospital', 'doctor'],
  'Design': ['design', 'paint', 'brush', 'color', 'palette'],
  'Development': ['code', 'programming', 'developer', 'git', 'terminal'],
  'Files': ['file', 'folder', 'document', 'save', 'download'],
  'Multimedia': ['video', 'audio', 'music', 'play', 'pause', 'volume'],
  'Shapes': ['circle', 'square', 'triangle', 'star', 'heart', 'diamond'],
  'Brands': ['facebook', 'twitter', 'instagram', 'youtube', 'github'],
  'Accessibility': ['accessibility', 'wheelchair', 'eye', 'ear', 'hand'],
  'Buildings': ['building', 'office', 'school', 'hospital', 'church'],
  'Nature': ['tree', 'flower', 'leaf', 'mountain', 'ocean', 'forest'],
  'Sports': ['sport', 'ball', 'run', 'swim', 'bike', 'exercise'],
  'Travel': ['travel', 'passport', 'suitcase', 'map', 'compass'],
  'Layout': ['layout', 'grid', 'columns', 'rows', 'align'],
  'Charts': ['chart', 'graph', 'bar', 'line', 'pie', 'data'],
  'Notifications': ['bell', 'notification', 'alert', 'warning', 'info'],
  'Connectivity': ['wifi', 'bluetooth', 'signal', 'network', 'connection'],
  'Photography': ['camera', 'photo', 'image', 'picture', 'lens'],
  'Science': ['atom', 'molecule', 'lab', 'test', 'experiment'],
  'Mathematics': ['math', 'calculator', 'plus', 'minus', 'divide'],
  'Text formatting': ['text', 'font', 'bold', 'italic', 'underline'],
  'Cursors': ['cursor', 'pointer', 'mouse', 'click', 'select'],
  'Emoji': ['emoji', 'smile', 'laugh', 'cry', 'angry', 'love'],
  'Seasons': ['spring', 'summer', 'fall', 'winter', 'season'],
  'Sustainability': ['recycle', 'eco', 'green', 'environment', 'earth'],
  'Mail': ['mail', 'envelope', 'letter', 'post', 'send'],
  'Account': ['account', 'profile', 'settings', 'preferences', 'user'],
  'Navigation': ['navigation', 'menu', 'hamburger', 'breadcrumb', 'tabs'],
  'The rest': [] // Catch-all for unmatched icons
};

function getCategoryForIcon(iconName: string): string {
  const lowerIcon = iconName.toLowerCase();
  
  for (const [category, patterns] of Object.entries(iconCategoryPatterns)) {
    for (const pattern of patterns) {
      if (lowerIcon.includes(pattern.toLowerCase())) {
        return category;
      }
    }
  }
  
  return 'The rest';
}

async function main() {
  console.log('Building icon-to-category mapping...');
  
  // Get all icon names from lucide-react package
  const iconNames: string[] = [];
  
  try {
    // Read the lucide-react package to get icon names
    const lucideReactPath = path.join(__dirname, '../node_modules/lucide-react/dist/esm/icons');
    if (fs.existsSync(lucideReactPath)) {
      const files = fs.readdirSync(lucideReactPath);
      iconNames.push(...files
        .filter(file => file.endsWith('.js') && !file.endsWith('.js.map'))
        .map(file => file.replace('.js', ''))
        .filter(name => !name.endsWith('Icon') && name !== 'createLucideIcon')
      );
    }
  } catch (error) {
    console.log('Could not read lucide-react icons, using fallback list...');
    // Fallback: use a basic list of common icons
    iconNames.push(
      'heart', 'user', 'home', 'mail', 'phone', 'settings', 'search', 'menu',
      'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down', 'chevron-left', 'chevron-right',
      'plus', 'minus', 'x', 'check', 'star', 'eye', 'eye-off', 'lock', 'unlock',
      'download', 'upload', 'share', 'like', 'comment', 'bookmark', 'calendar',
      'clock', 'map', 'navigation', 'compass', 'camera', 'video', 'music', 'volume',
      'play', 'pause', 'stop', 'skip-back', 'skip-forward', 'repeat', 'shuffle',
      'wifi', 'bluetooth', 'battery', 'signal', 'sun', 'moon', 'cloud', 'rain',
      'snow', 'wind', 'thermometer', 'umbrella', 'coffee', 'pizza', 'utensils',
      'shopping-cart', 'credit-card', 'dollar-sign', 'euro', 'pound', 'yen',
      'facebook', 'twitter', 'instagram', 'youtube', 'github', 'linkedin',
      'file', 'folder', 'document', 'image', 'archive', 'trash', 'edit',
      'copy', 'paste', 'cut', 'save', 'print', 'send', 'receive', 'refresh',
      'rotate', 'zoom-in', 'zoom-out', 'maximize', 'minimize', 'close',
      'help', 'info', 'alert', 'warning', 'error', 'success', 'check-circle',
      'x-circle', 'alert-circle', 'alert-triangle', 'info-circle'
    );
  }
  
  // Build the mapping
  const iconToCategory: Record<string, string> = {};
  const categoryCounts: Record<string, number> = {};
  
  for (const iconName of iconNames) {
    const category = getCategoryForIcon(iconName);
    iconToCategory[iconName] = category;
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  }
  
  // Create category order (most populated first, then alphabetical)
  const categoryOrder = Object.entries(categoryCounts)
    .sort(([,a], [,b]) => b - a)
    .map(([category]) => category);
  
  // Write the mapping
  const output = {
    iconToCategory,
    categoryOrder,
    totalIcons: iconNames.length,
    categoryCounts
  };
  
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  
  console.log(`✅ Generated mapping for ${iconNames.length} icons`);
  console.log(`📁 Output: ${OUTPUT_PATH}`);
  console.log('\n📊 Category breakdown:');
  Object.entries(categoryCounts)
    .sort(([,a], [,b]) => b - a)
    .forEach(([category, count]) => {
      console.log(`  ${category}: ${count} icons`);
    });
}

main().catch(console.error); 