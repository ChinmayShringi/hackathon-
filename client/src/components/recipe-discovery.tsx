import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Grid, 
  Play,
  Sparkles,
  Clock,
  Coins,
  X,
  Zap,
  Palette,
  Video,
  Clapperboard
} from "lucide-react";
import type { Recipe } from "@shared/schema";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getAudioTypeText } from "@/lib/utils";

// Simple debounce hook inline
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}



interface RecipeCardProps {
  recipe: Recipe;
  onUseRecipe: (recipe: Recipe) => void;
  onMediaClick?: (recipe: Recipe) => void;
  onTagClick?: (tag: string) => void;
  interceptAction?: (action: () => void, recipeName?: string) => void;
  onInstantGeneration?: (recipe: Recipe) => void;
  isInstantModalOpen?: boolean;
}

function RecipeCard({ recipe, onUseRecipe, onMediaClick, onTagClick, interceptAction, onInstantGeneration, isInstantModalOpen = false }: RecipeCardProps) {
  const isComingSoon = false; // No recipes are coming soon in discovery
  const handleTextClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-clickable="tag"]') || target.closest('[data-clickable="button"]')) {
      return;
    }
    

    if (interceptAction) {
      interceptAction(() => onUseRecipe(recipe), recipe.name);
    } else {
      onUseRecipe(recipe);
    }
  };

  const handleInstantGeneration = async () => {
    if (onInstantGeneration) {
      onInstantGeneration(recipe);
    } else {
      // Fallback to original behavior
      try {
        const response = await fetch('/api/generate/instant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipeId: recipe.id
          }),
        });

        if (response.ok) {
          const result = await response.json();
          
          if (result.isInstant) {
            if (result.shortId) {
              const isAlphaSite = import.meta.env.VITE_SITE_DEPLOYMENT_TYPE === 'alpha';
              const route = isAlphaSite ? `/alpha/m/${result.shortId}` : `/asset-viewer/${result.generationId}`;
              window.open(route, '_blank');
            }
          }
        } else {
          const errorData = await response.json();
          if (errorData.fallbackToModal) {
            if (interceptAction) {
              interceptAction(() => onUseRecipe(recipe), recipe.name);
            } else {
              onUseRecipe(recipe);
            }
          } else {
            console.error('Instant generation error:', errorData);
            if (interceptAction) {
              interceptAction(() => onUseRecipe(recipe), recipe.name);
            } else {
              onUseRecipe(recipe);
            }
          }
        }
      } catch (error) {
        console.error('Instant generation failed:', error);
        if (interceptAction) {
          interceptAction(() => onUseRecipe(recipe), recipe.name);
        } else {
          onUseRecipe(recipe);
        }
      }
    }
  };

  return (
    <div className="relative group">
      {/* Rainbow Border Animation */}
      <div className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div 
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-red-500"
          style={{
            backgroundSize: '400% 400%',
            animation: 'rainbow-shimmer 2s linear infinite',
          }}
        />
      </div>
      
      <Card className="relative min-w-[280px] bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-all duration-300 overflow-hidden">
        <CardContent className="p-0">
        {/* Media Preview Section - Clickable */}
        <div 
          className="relative aspect-video bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center cursor-pointer hover:brightness-110 transition-all"
          onClick={(e) => {
            e.stopPropagation();

            onMediaClick?.(recipe);
          }}
        >
          {recipe.generationType === 'video' ? (
            <Play className="h-12 w-12 text-white/60" />
          ) : (
            <Sparkles className="h-12 w-12 text-white/60" />
          )}
          
          {/* Duration Badge - Top Left */}
          {recipe.generationType === 'video' && recipe.videoDuration && recipe.videoDuration > 0 && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-black/70 text-white text-xs border-0 flex items-center gap-1">
                <Clapperboard className="h-3 w-3" />
                {recipe.videoDuration}s{getAudioTypeText(recipe.audioType || 0)}
              </Badge>
            </div>
          )}

          {/* Credit Cost Badge - Top Right */}
          <div className="absolute top-2 right-2">
            <div className="relative">
              {/* Glassmorphic background with 25% black layer */}
              <div className="absolute inset-0 rounded-full bg-black/25 backdrop-blur-md"></div>
              <div className="relative px-2 py-1 rounded-full text-xs font-medium text-white border border-white/20 bg-white/5 backdrop-blur-md shadow-lg flex items-center gap-1">
                <Coins className="h-3 w-3" />
                {recipe.creditCost === 1 ? `${recipe.creditCost} credit` : `${recipe.creditCost} credits`}
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Section - Clickable for auth */}
        <div className="p-4" onClick={handleTextClick}>
          <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2">
            {recipe.name}
          </h3>
          <p className="text-gray-400 text-xs mb-2 line-clamp-2">
            {recipe.description}
          </p>
          <div className="flex items-center justify-between">
            <Badge 
              variant="outline" 
              className="text-xs border-gray-600 text-gray-300 cursor-pointer hover:bg-accent-blue/20 transition-colors"
              data-clickable="tag"
              onClick={(e) => {
                e.stopPropagation();

                onTagClick?.(recipe.category);
              }}
            >
              {recipe.category}
            </Badge>
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();

                      handleInstantGeneration();
                    }}
                    disabled={isComingSoon || isInstantModalOpen}
                    data-clickable="button"
                    className={`text-xs h-6 px-2 ${
                      isComingSoon || isInstantModalOpen
                        ? 'opacity-50 cursor-not-allowed bg-gray-600'
                        : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                    }`}
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    Instant
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>No need to wait, we can make this faster than you can snap your fingers.</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();

                      if (interceptAction) {
                        interceptAction(() => onUseRecipe(recipe), recipe.name);
                      } else {
                        onUseRecipe(recipe);
                      }
                    }}
                    data-clickable="button"
                    className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-xs h-6 px-2 text-white"
                  >
                    <Palette className="h-3 w-3 mr-1" />
                    Build
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Customize to taste, with generation times between a few seconds to minutes.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}

interface RecipeSectionProps {
  title: string;
  type: 'image' | 'video';
  recipes: Recipe[];
  onUseRecipe: (recipe: Recipe) => void;
  onSeeAll: (type: 'image' | 'video') => void;
  onSearch: (query: string, type: 'image' | 'video') => void;
  onMediaClick?: (recipe: Recipe) => void;
  onTagClick?: (tag: string) => void;
  interceptAction?: (action: () => void, recipeName?: string) => void;
}

function RecipeSection({ title, type, recipes, onUseRecipe, onSeeAll, onSearch, onMediaClick, onTagClick, interceptAction }: RecipeSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);
  const scrollRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const handleLocalTagClick = (tag: string) => {

    setSearchQuery(tag);
  };

  useEffect(() => {
    setFilteredRecipes(recipes);
  }, [recipes]);

  useEffect(() => {
    if (debouncedSearch) {
      // Filter locally by category or name/description
      const filtered = recipes.filter(recipe => 
        recipe.category.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        recipe.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        recipe.description.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes(recipes);
    }
  }, [debouncedSearch, recipes]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const displayRecipes = searchQuery ? filteredRecipes : recipes;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {type === 'video' ? <Play className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
            {title}
          </h2>
          <Badge className="bg-gray-700 text-gray-300">
            {displayRecipes.length} recipes
          </Badge>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={`Search ${type} recipes...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 w-64 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-white"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <Button
            onClick={() => onSeeAll(type)}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Grid className="h-4 w-4 mr-2" />
            See All
          </Button>
        </div>
      </div>

      <div className="relative">
        {displayRecipes.length > 4 && (
          <>
            <Button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 border-0 rounded-full h-10 w-10 p-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 border-0 rounded-full h-10 w-10 p-0"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
        
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onUseRecipe={onUseRecipe}
              onMediaClick={onMediaClick}
              onTagClick={handleLocalTagClick}
              interceptAction={interceptAction}
            />
          ))}
        </div>
        
        {displayRecipes.length === 0 && searchQuery && (
          <div className="text-center py-8 text-gray-400">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No recipes found for "{searchQuery}"</p>
            <p className="text-sm">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface RecipeDiscoveryProps {
  onUseRecipe: (recipe: Recipe) => void;
  onSeeAll: (type: 'image' | 'video') => void;
  onMediaClick?: (recipe: Recipe) => void;
  onTagClick?: (tag: string) => void;
  interceptAction?: (action: () => void, recipeName?: string) => void;
}

export default function RecipeDiscovery({ onUseRecipe, onSeeAll, onMediaClick, onTagClick, interceptAction }: RecipeDiscoveryProps) {
  const [imageSearchResults, setImageSearchResults] = useState<Recipe[]>([]);
  const [videoSearchResults, setVideoSearchResults] = useState<Recipe[]>([]);

  // Fetch all recipes
  const { data: recipes = [] } = useQuery({
    queryKey: ['/api/recipes'],
  });

  // Separate recipes by type
  const imageRecipes = (recipes as any[]).filter((recipe: any) => 
    !recipe.category.toLowerCase().includes('video')
  ).map((recipe: any) => ({ ...recipe, type: 'image' as const }));

  const videoRecipes = (recipes as any[]).filter((recipe: any) => 
    recipe.category.toLowerCase().includes('video')
  ).map((recipe: any) => ({ ...recipe, type: 'video' as const }));

  const handleSearch = async (query: string, type: 'image' | 'video') => {
    if (!query.trim()) {
      if (type === 'image') setImageSearchResults([]);
      if (type === 'video') setVideoSearchResults([]);
      return;
    }

    try {
      const response = await fetch('/api/recipes/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, type }),
      });

      if (response.ok) {
        const results = await response.json();
        if (type === 'image') {
          setImageSearchResults(results);
        } else {
          setVideoSearchResults(results);
        }
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <div className="space-y-12 px-6">
      <RecipeSection
        title="Image Recipes"
        type="image"
        recipes={imageRecipes}
        onUseRecipe={onUseRecipe}
        onSeeAll={onSeeAll}
        onSearch={handleSearch}
        onMediaClick={onMediaClick}
        onTagClick={onTagClick}
        interceptAction={interceptAction}
      />
      
      <RecipeSection
        title="Video Recipes"
        type="video"
        recipes={videoRecipes}
        onUseRecipe={onUseRecipe}
        onSeeAll={onSeeAll}
        onSearch={handleSearch}
        onMediaClick={onMediaClick}
        onTagClick={onTagClick}
        interceptAction={interceptAction}
      />
    </div>
  );
}