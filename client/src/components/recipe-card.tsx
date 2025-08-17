import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Flame, Wand2, Palette, Image, Video, Crown, Zap, Box, FileType, ExternalLink, Clapperboard } from "lucide-react";
import type { Recipe } from "@shared/schema";
import { getAudioTypeText } from "@/lib/utils";

// Extended Recipe type with API-added properties
interface ExtendedRecipe extends Recipe {
  tagHighlightsDetailed?: Array<{
    id: number;
    name: string;
    description: string;
  }>;
}

interface RecipeCardProps {
  recipe: ExtendedRecipe;
  onUseRecipe: (recipe: ExtendedRecipe) => void;
  onMediaClick?: (recipe: ExtendedRecipe) => void;
  onTagClick?: (tag: string) => void;
  interceptAction?: (action: () => void, recipeName?: string) => void;
  onInstantGeneration?: (recipe: ExtendedRecipe) => void;
  isInstantModalOpen?: boolean;
  isInstantButtonDisabled?: boolean;
}

const categoryIcons = {
  "Digital Art": Palette,
  "Social Media": Image,
  "Marketing": Box,
  "Video": Video,
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Digital Art":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "Social Media":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Marketing":
      return "bg-green-100 text-green-800 border-green-200";
    case "Video":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getGenerationTypeColor = (type: string) => {
  switch (type) {
    case "fast":
      return "bg-green-100 text-green-800 border-green-200";
    case "premium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getGenerationTypeIcon = (type: string) => {
  switch (type) {
    case "fast":
      return Zap;
    case "premium":
      return Crown;
    default:
      return FileType;
  }
};

// Helper function for proper credit pluralization
const formatCredits = (credits: number): string => {
  return credits === 1 ? `${credits} credit` : `${credits} credits`;
};

export function RecipeCard({
  recipe,
  onUseRecipe,
  onMediaClick,
  onTagClick,
  interceptAction,
  onInstantGeneration,
  isInstantModalOpen = false,
  isInstantButtonDisabled = false,
}: RecipeCardProps) {
  const CategoryIcon = categoryIcons[recipe.category as keyof typeof categoryIcons] || Palette;
  const GenerationTypeIcon = getGenerationTypeIcon(recipe.generationType);
  const isComingSoon = recipe.name.includes("Premium Video");

  const handleUseRecipe = () => {
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
            handleUseRecipe();
          } else {
            console.error('Instant generation error:', errorData);
            handleUseRecipe();
          }
        }
      } catch (error) {
        console.error('Instant generation failed:', error);
        handleUseRecipe();
      }
    }
  };

  const handleMediaClick = () => {
    if (onMediaClick) {
      onMediaClick(recipe);
    }
  };

  const handleTagClick = (tag: string) => {
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  return (
    <div className="relative group h-full">
      {/* Rainbow Border Animation */}
      <div className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-red-500 bg-[length:400%_400%] animate-rainbow-shimmer"
          style={{
            backgroundSize: '400% 400%',
            animation: 'rainbow-shimmer 2s linear infinite',
          }}
        />
      </div>

      {/* Main Card Content */}
      <div className="relative bg-card-bg rounded-xl overflow-hidden hover:bg-gray-800 transition-all h-full flex flex-col">
        {/* Media Preview Section - Clickable */}
        <div
          className="media-preview h-48 bg-gradient-to-br from-gray-800 to-gray-900 cursor-pointer relative overflow-hidden hover:brightness-110 transition-all flex-shrink-0"
          onClick={handleMediaClick}
        >
          {/* Duration Badge - Top Left */}
          {recipe.generationType === 'video' && recipe.videoDuration && recipe.videoDuration > 0 && (
            <div className="absolute top-3 left-3 z-10">
              <Badge className="bg-black/70 text-white text-xs border-0 flex items-center gap-1">
                <Clapperboard className="h-3 w-3" />
                {recipe.videoDuration}s{getAudioTypeText(recipe.audioType || 0)}
              </Badge>
            </div>
          )}

          {/* Credit Cost Badge - Top Right */}
          <div className="absolute top-3 right-3 z-10">
            <div className="relative">
              {/* Glassmorphic background with 25% black layer */}
              <div className="absolute inset-0 rounded-full bg-green-700/90 backdrop-blur-md"></div>
              <div className="relative px-3 py-1.5 rounded-full text-xs font-medium text-white border border-white/50 bg-white/5 backdrop-blur-md shadow-lg">
                {formatCredits(recipe.creditCost)}
              </div>
            </div>
          </div>

          {/* Media content based on recipe type */}
          <div className="absolute inset-0 flex items-center justify-center">
            {recipe.previewImageUrl ? (
              <img
                src={recipe.previewImageUrl}
                alt={`${recipe.name} preview`}
                className="w-full h-full object-cover"
              />
            ) : recipe.generationType === 'video' ? (
              <div className="text-center">
                <Video className="h-16 w-16 text-accent-blue mx-auto mb-2" />
                <p className="text-sm text-gray-300">Click to preview video</p>
              </div>
            ) : (
              <div className="text-center">
                <Image className="h-16 w-16 text-accent-purple mx-auto mb-2" />
                <p className="text-sm text-gray-300">Click to preview image</p>
              </div>
            )}
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Content Section - Clickable for auth */}
        <div className="p-6 flex-1 flex flex-col" onClick={handleUseRecipe}>
          <div className="mb-4 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold hover:text-accent-blue transition-colors cursor-pointer line-clamp-1">
                {recipe.name}
              </h3>
              <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
            <p className="text-gray-400 text-sm line-clamp-3 min-h-[4.5rem] mb-3">{recipe.description}</p>

            {/* Highlight Tags - Always reserve space, limit to 1 line */}
            <div className="flex flex-wrap gap-1 mb-3 min-h-[1.5rem] overflow-hidden">
              {recipe.tagHighlightsDetailed && recipe.tagHighlightsDetailed.length > 0 ? (
                recipe.tagHighlightsDetailed.slice(0, 4).map((tag) => (
                  <Tooltip key={tag.id}>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-accent text-xs px-2 py-1 rounded-full flex-shrink-0"
                        onClick={() => handleTagClick(tag.name)}
                      >
                        {tag.name}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{tag.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ))
              ) : (
                // Reserve space even when no tags
                <div className="h-6"></div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center space-x-2">
              <Flame className="h-4 w-4 text-orange-400" />
              <span className="text-sm text-gray-400">
                {recipe.usageCount >= 1000 ? `${(recipe.usageCount / 1000).toFixed(1)}K` : recipe.usageCount} uses
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Try Instant generation first, fallback to modal if no backlog
                      handleInstantGeneration();
                    }}
                    disabled={isComingSoon || isInstantButtonDisabled}
                    data-clickable="button"
                    className={`px-3 py-2 rounded-lg font-medium hover:shadow-lg transition-all ${isComingSoon || isInstantButtonDisabled
                      ? 'opacity-50 cursor-not-allowed bg-gray-600'
                      : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white'
                      }`}
                  >
                    <Zap className="h-4 w-4 mr-1" />
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUseRecipe();
                    }}
                    disabled={isComingSoon}
                    data-clickable="button"
                    className={`px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all ${isComingSoon
                      ? 'opacity-50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white'
                      }`}
                  >
                    {isComingSoon ? 'Coming Soon' : (
                      <>
                        <Palette className="h-4 w-4 mr-1" />
                        Build
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Customize to taste, with generation times between a few seconds to minutes.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;
