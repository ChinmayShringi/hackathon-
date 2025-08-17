import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Coins, X, Palette, Video, Image, Clapperboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import RecipeForm from "./recipe-form";
import type { Recipe } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { getAudioTypeText } from "@/lib/utils";

interface RecipeModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RecipeModal({ recipe, isOpen, onClose }: RecipeModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  if (!recipe) return null;

  const isStructuredRecipe = Array.isArray(recipe.recipeSteps) && recipe.recipeSteps.length > 0;

  const handleGenerate = async (formData: Record<string, string>) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to generate content.",
        variant: "destructive",
      });
      return;
    }

    // Check credits with allowDebit logic
    const userAccount = user as any;
    if (userAccount.credits < recipe.creditCost && !userAccount.allowDebit) {
      toast({
        title: "Insufficient Credits",
        description: "You don't have enough credits for this generation.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeId: recipe.id,
          formData: formData
        }),
      });

      if (response.ok) {
        toast({
          title: "Generation Started",
          description: `Your ${recipe.generationType === 'video' ? 'video' : 'image'} is being generated!`,
        });
        onClose();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Generation failed');
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLegacyGenerate = () => {
    // Legacy generation for simple recipes
    handleGenerate({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              {recipe.generationType === 'video' ? (
                <Video className="h-6 w-6 text-accent-blue" />
              ) : (
                <Image className="h-6 w-6 text-accent-purple" />
              )}
              {recipe.name}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recipe Info */}
          <div className="space-y-6">
            {/* Preview Section */}
            <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
              {/* Duration Badge - Top Left for videos */}
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
                  <div className="absolute inset-0 rounded-full bg-black/25 backdrop-blur-md"></div>
                  <div className="relative px-3 py-1.5 rounded-full text-xs font-medium text-white border border-white/20 bg-white/5 backdrop-blur-md shadow-lg flex items-center gap-1">
                    <Coins className="h-3 w-3" />
                    {recipe.creditCost === 1 ? `${recipe.creditCost} credit` : `${recipe.creditCost} credits`}
                  </div>
                </div>
              </div>

              {/* Preview Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                {recipe.generationType === 'video' ? (
                  <div className="text-center">
                    <Video className="h-16 w-16 text-accent-blue mx-auto mb-2" />
                    <p className="text-sm text-gray-300">Video Preview</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Image className="h-16 w-16 text-accent-purple mx-auto mb-2" />
                    <p className="text-sm text-gray-300">Image Preview</p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
              <p className="text-gray-300">{recipe.description}</p>
            </div>

            {/* Instructions */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Instructions</h3>
              <p className="text-gray-300 text-sm">{recipe.instructions}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Palette className="w-3 h-3" />
                {recipe.category}
              </Badge>
              <Badge variant="secondary">
                {recipe.style}
              </Badge>
              <Badge variant="secondary">
                {recipe.model}
              </Badge>
            </div>
          </div>

          {/* Generation Form */}
          <div>
            {isStructuredRecipe ? (
              <RecipeForm
                recipe={recipe}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            ) : (
              <div className="bg-card-bg border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Palette className="h-5 w-5 text-accent-blue" />
                  Generate Content
                </h3>
                <p className="text-gray-300 mb-6">
                  This recipe will generate content using the pre-configured settings.
                </p>
                <Button
                  onClick={handleLegacyGenerate}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-accent-blue to-accent-purple hover:shadow-lg transition-all"
                >
                  {isGenerating ? 'Generating...' : `Generate (${recipe.creditCost} credits)`}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}