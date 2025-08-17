import * as LucideIcons from 'lucide-react';
// Try importing from a path inside client/src if available, otherwise fallback to the scripts directory
// If your build system does not support importing JSON from outside src, you may need to copy or symlink the file
import lucideIconMappingJson from '@/lucide-categories/lucide-icon-mapping.json';
import { AlertCircle } from 'lucide-react';
import React from 'react';

// Type for the generated mapping JSON
interface LucideIconMapping {
  kebabToPascalMap: Record<string, string>;
  pascalToKebabMap: Record<string, string>;
  iconNames: string[];
}
const lucideIconMapping = lucideIconMappingJson as LucideIconMapping;
const { kebabToPascalMap } = lucideIconMapping;

interface LucideIconProps {
  name?: string; // kebab-case icon name
  className?: string;
  size?: number;
  fallbackIcon?: React.ComponentType<any>;
}

/**
 * Generic LucideIcon component for dynamic icon rendering by kebab-case name.
 * Falls back to AlertCircle if icon is missing.
 */
export const LucideIcon: React.FC<LucideIconProps> = ({ name, className = '', size = 16, fallbackIcon: FallbackIcon = AlertCircle }) => {
  if (!name) return <FallbackIcon className={className} size={size} />;
  const pascal = kebabToPascalMap[name];
  const IconComponent = pascal && (LucideIcons as any)[pascal] ? (LucideIcons as any)[pascal] : null;
  if (IconComponent) {
    return <IconComponent className={className} size={size} />;
  }
  // Fallback if icon not found
  return <FallbackIcon className={className} size={size} />;
};

export default LucideIcon; 