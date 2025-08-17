import { useQuery } from '@tanstack/react-query';
import type { Recipe } from '@shared/schema';

interface RecipesByCategory {
  [category: string]: Recipe[];
}

export function useRecipesByCategory() {
  return useQuery<RecipesByCategory>({
    queryKey: ['recipes', 'by-category'],
    queryFn: async () => {
      const response = await fetch('/api/recipes/by-category');
      if (!response.ok) {
        throw new Error('Failed to fetch recipes by category');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Helper function to get recipes for a specific category
export function useRecipesForCategory(category: string) {
  const { data: recipesByCategory, ...queryInfo } = useRecipesByCategory();
  
  const recipes = recipesByCategory?.[category] || [];
  
  return {
    recipes,
    ...queryInfo,
  };
}

// Helper function to get all categories
export function useCategories() {
  const { data: recipesByCategory, ...queryInfo } = useRecipesByCategory();
  
  const categories = recipesByCategory ? Object.keys(recipesByCategory) : [];
  
  return {
    categories,
    ...queryInfo,
  };
}
