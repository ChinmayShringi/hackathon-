import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, X, Grid3X3, ChevronDown, ChevronRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import iconCategoryMap from '@/lucide-categories/iconCategoryMap.json';
import lucideIconMappingJson from '../../../scripts/lucide-icon-mapping.json';

// Type for the generated mapping JSON
interface LucideIconMapping {
  kebabToPascalMap: Record<string, string>;
  pascalToKebabMap: Record<string, string>;
  iconNames: string[];
}
const lucideIconMapping = lucideIconMappingJson as LucideIconMapping;
const { kebabToPascalMap, pascalToKebabMap, iconNames } = lucideIconMapping;

// Type the category map
type IconCategoryMap = {
  iconToCategory: Record<string, string>;
  categoryOrder: string[];
  totalIcons: number;
  categoryCounts: Record<string, number>;
};

interface LucideIconPickerProps {
  value?: string;
  onChange: (iconName: string) => void;
  placeholder?: string;
}

export default function LucideIconPicker({ value, onChange, placeholder = "Select an icon..." }: LucideIconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(value || '');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Update selected icon when value prop changes
  useEffect(() => {
    setSelectedIcon(value || '');
  }, [value]);

  // Filter icons by kebab-case or PascalCase name, case-insensitive
  const filteredIcons = useMemo(() => {
    if (!searchTerm.trim()) return iconNames;
    const lower = searchTerm.trim().toLowerCase();
    return iconNames.filter((kebab) => kebab.includes(lower));
  }, [searchTerm]);

  // Group filtered icons by category, fallback to 'Uncategorized' if not found
  const groupedIcons = useMemo(() => {
    const groups: Record<string, string[]> = {};
    filteredIcons.forEach((kebab) => {
      const category = (iconCategoryMap as IconCategoryMap).iconToCategory[kebab] || 'Uncategorized';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(kebab);
    });
    return groups;
  }, [filteredIcons]);

  // Auto-expand categories with results on search, or first 3 by default
  useEffect(() => {
    const categoriesWithResults = Object.keys(groupedIcons).filter(cat => groupedIcons[cat].length > 0);
    if (searchTerm.trim()) {
      setExpandedCategories(new Set(categoriesWithResults));
    } else {
      setExpandedCategories(new Set(categoriesWithResults.slice(0, 3)));
    }
  }, [searchTerm, filteredIcons.length]);

  const handleIconSelect = (kebabName: string) => {
    setSelectedIcon(kebabName);
    onChange(kebabName);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    setSelectedIcon('');
    onChange('');
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(category)) {
        newExpanded.delete(category);
      } else {
        newExpanded.add(category);
      }
      return newExpanded;
    });
  };

  // Convert kebab-case to PascalCase for rendering
  const SelectedIconComponent =
    selectedIcon && kebabToPascalMap[selectedIcon] && LucideIcons[kebabToPascalMap[selectedIcon] as keyof typeof LucideIcons]
      ? (LucideIcons[kebabToPascalMap[selectedIcon] as keyof typeof LucideIcons] as React.ComponentType<any>)
      : null;

  return (
    <div className="w-full">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
          >
            <div className="flex items-center space-x-2">
              {SelectedIconComponent && <SelectedIconComponent className="w-4 h-4" />}
              <span className={selectedIcon ? 'text-white' : 'text-gray-400'}>
                {selectedIcon || placeholder}
              </span>
            </div>
            <Grid3X3 className="w-4 h-4 text-gray-400" />
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-6xl max-h-[90vh] bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center space-x-2">
              <Grid3X3 className="w-5 h-5" />
              <span>Select Lucide Icon</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search icons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Icon Grid */}
            <ScrollArea className="h-[60vh]">
              <div className="space-y-4">
                {Object.keys(groupedIcons).length === 0 || filteredIcons.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No icons found</p>
                    <p className="text-sm">Try a different search term</p>
                  </div>
                ) : (
                  Object.entries(groupedIcons).map(([category, icons]) => (
                    <div key={category} className="space-y-2">
                      <button
                        onClick={() => toggleCategory(category)}
                        className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors w-full text-left"
                      >
                        {expandedCategories.has(category) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                        <span className="font-medium">{category}</span>
                        <span className="text-gray-400 text-sm">({icons.length})</span>
                      </button>
                      {expandedCategories.has(category) && (
                        <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 pl-6">
                          {icons.map((kebab) => {
                            const pascal = kebabToPascalMap[kebab];
                            const IconComponent = pascal && LucideIcons[pascal as keyof typeof LucideIcons]
                              ? (LucideIcons[pascal as keyof typeof LucideIcons] as React.ComponentType<any>)
                              : null;
                            if (!IconComponent) return null;
                            return (
                              <button
                                key={kebab}
                                type="button"
                                className={`rounded p-1 border border-transparent hover:border-blue-400 focus:border-blue-500 ${selectedIcon === kebab ? 'bg-blue-100' : ''}`}
                                onClick={() => handleIconSelect(kebab)}
                                title={kebab}
                              >
                                <IconComponent size={24} />
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Clear Button */}
            {selectedIcon && (
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Selection
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 