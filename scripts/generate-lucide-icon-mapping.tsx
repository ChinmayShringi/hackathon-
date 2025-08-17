// Load environment variables first (Delula rule)
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

// Utility to convert kebab-case to PascalCase
function kebabToPascal(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

// Read the kebab-case icon names
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const iconListPath = path.resolve(__dirname, 'lucide-icon-filenames.txt');
const iconNames = fs.readFileSync(iconListPath, 'utf-8')
  .split('\n')
  .map((name) => name.trim())
  .filter(Boolean);

// Generate mapping: kebab-case -> PascalCase
const kebabToPascalMap: Record<string, string> = {};
const pascalToKebabMap: Record<string, string> = {};

for (const kebab of iconNames) {
  const pascal = kebabToPascal(kebab);
  kebabToPascalMap[kebab] = pascal;
  pascalToKebabMap[pascal] = kebab;
}

// Output both mappings to a JSON file
const outputPath = path.resolve(__dirname, 'lucide-icon-mapping.json');
fs.writeFileSync(
  outputPath,
  JSON.stringify({ kebabToPascalMap, pascalToKebabMap, iconNames }, null, 2)
);

console.log(`Lucide icon mapping generated: ${outputPath}`); 