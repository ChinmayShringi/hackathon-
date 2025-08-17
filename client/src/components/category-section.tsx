import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, Image, Wrench, Clock } from 'lucide-react';
import type { Recipe } from '@shared/schema';
import RecipeCard from './recipe-card';

interface CategorySectionProps {
  title: string;
  recipes: Recipe[];
  icon: React.ComponentType<{ className?: string }>;
  onUseRecipe: (recipe: Recipe) => void;
  onMediaClick?: (recipe: Recipe) => void;
  onInstantGeneration?: (recipe: Recipe) => void;
  isInstantModalOpen?: boolean;
  isInstantButtonDisabled?: boolean;
}

export default function CategorySection({
  title,
  recipes,
  icon: Icon,
  onUseRecipe,
  onMediaClick,
  onInstantGeneration,
  isInstantModalOpen = false,
  isInstantButtonDisabled = false,
}: CategorySectionProps) {
  if (recipes.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <Icon className="h-6 w-6 text-accent-blue" />
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <Badge variant="secondary" className="ml-2">
          {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onUseRecipe={onUseRecipe}
            onMediaClick={onMediaClick}
            onInstantGeneration={onInstantGeneration}
            isInstantModalOpen={isInstantModalOpen}
            isInstantButtonDisabled={isInstantButtonDisabled}
          />
        ))}
      </div>
    </section>
  );
}

// Category icon mapping
export const getCategoryIcon = (categoryName: string) => {
  switch (categoryName.toLowerCase()) {
    case 'video':
      return Video;
    case 'image':
      return Image;
    case 'tool':
      return Wrench;
    case 'coming_soon':
      return Clock;
    default:
      return Video;
  }
};

// Category title formatting
export const formatCategoryTitle = (categoryName: string) => {
  switch (categoryName.toLowerCase()) {
    case 'video':
      return 'Videos';
    case 'image':
      return 'Images';
    case 'tool':
      return 'Tools';
    case 'coming_soon':
      return 'Coming Soon';
    default:
      return categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  }
};
