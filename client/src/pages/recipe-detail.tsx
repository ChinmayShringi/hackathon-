import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useAuthInterception } from "@/hooks/useAuthInterception";
import Navigation from "@/components/navigation";
import SampleGallery from "@/components/sample-gallery";
import AuthSignupModal from "@/components/auth-signup-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecipeForm from "@/components/recipe-form";

import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  Users, 
  Coins,
  Play,
  Image as ImageIcon,
  Video,
  Share2,
  Download,
  Images,
  Wand2,
  Palette
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Recipe } from "@shared/schema";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function RecipeDetail() {
  const [, params] = useRoute("/recipe/:slug");
  const { user, isAuthenticated, isLoading } = useAuth();
  const { showSignupModal, recipeName, interceptAction, closeModal } = useAuthInterception();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  // Get recipe by slug
  const { data: recipe, isLoading: recipeLoading } = useQuery<Recipe>({
    queryKey: ["/api/recipes/slug", params?.slug],
    queryFn: async () => {
      const response = await fetch(`/api/recipes/slug/${params?.slug}`);
      if (!response.ok) throw new Error('Failed to fetch recipe');
      return response.json();
    },
    enabled: !!params?.slug,
  });

  const generateMutation = useMutation({
    mutationFn: async (data: { recipeId: number; prompt: string; formData?: Record<string, string>; isFlashRequest?: boolean }) => {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to generate content');
      return await response.json();
    },
    onSuccess: (data: any) => {
      if (data.isFlashRequest) {
        // Flash generation completed instantly
        toast({
          title: "Flash Generation Complete!",
          description: data.message || "Your content was generated instantly from backlog.",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/generations"] });
      } else {
        // Normal generation started
        toast({
          title: "Generation Started",
          description: `Your content is being created. ${data.remainingCredits} credits remaining.`,
        });
        setIsGenerating(true);
        setGenerationProgress(10);
        
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setGenerationProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 1000);

        // Complete generation after 10 seconds (mock)
        setTimeout(() => {
          setIsGenerating(false);
          setGenerationProgress(100);
          clearInterval(progressInterval);
          toast({
            title: "Generation Complete!",
            description: "Your content has been created and saved to your gallery.",
          });
          queryClient.invalidateQueries({ queryKey: ["/api/generations"] });
        }, 10000);
      }
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/auth/user";
        }, 500);
        return;
      }
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Recipe detail pages are publicly viewable - no authentication redirect needed

  if (isLoading || recipeLoading) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Navigation />
        <div className="pt-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-700 rounded w-1/3"></div>
              <div className="h-64 bg-gray-700 rounded"></div>
              <div className="h-32 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Navigation />
        <div className="pt-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Recipe Not Found</h1>
            <p className="text-gray-400 mb-8">The recipe you're looking for doesn't exist.</p>
            <Button onClick={() => window.location.href = "/"}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Recipes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleGenerate = () => {
    const performGeneration = () => {
      // Check credits with allowDebit logic
      const userAccount = user as any;
      if (userAccount.credits < recipe.creditCost && !userAccount.allowDebit) {
        toast({
          title: "Insufficient Credits",
          description: `You need ${recipe.creditCost} credits to use this recipe. You have ${userAccount.credits}.`,
          variant: "destructive",
        });
        return;
      }

      const finalPrompt = customPrompt.trim() || recipe.prompt;
      generateMutation.mutate({
        recipeId: recipe.id,
        prompt: finalPrompt
      });
    };

    interceptAction(performGeneration, recipe?.name);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Video':
        return <Video className="h-4 w-4" />;
      case 'Digital Art':
        return <ImageIcon className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const shareRecipe = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Recipe link copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      
      <main className="pt-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => window.location.href = "/"}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Recipes
            </Button>
            
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getCategoryIcon(recipe.category)}
                    {recipe.category}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Coins className="h-3 w-3" />
                    {recipe.creditCost} {recipe.creditCost === 1 ? 'credit' : 'credits'}
                  </Badge>
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">{recipe.name}</h1>
                <p className="text-xl text-gray-400 mb-6">{recipe.description}</p>
                
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {recipe.usageCount} uses
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    ~2 min
                  </div>
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={shareRecipe}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Tabbed Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-card-bg">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="gallery" className="flex items-center gap-2">
                <Images className="h-4 w-4" />
                Sample Gallery
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Create
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recipe Details */}
                <Card className="bg-card-bg border-card-border">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">Recipe Instructions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">How it works</h3>
                      <p className="text-gray-300">{recipe.instructions}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Default Prompt</h3>
                      <div className="bg-bg-primary p-4 rounded-lg">
                        <p className="text-gray-300 italic">"{recipe.prompt}"</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Parameters</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-bg-primary p-3 rounded">
                          <div className="text-sm text-gray-400">Style</div>
                          <div className="text-white">{recipe.style}</div>
                        </div>
                        <div className="bg-bg-primary p-3 rounded">
                          <div className="text-sm text-gray-400">Model</div>
                          <div className="text-white">{recipe.model}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Generation Panel */}
                <Card className="bg-card-bg border-card-border">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">Quick Generate</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isGenerating ? (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent-blue border-t-transparent mx-auto mb-4"></div>
                          <p className="text-white font-medium">Generating your content...</p>
                          <p className="text-sm text-gray-400">This may take a few moments</p>
                        </div>
                        <Progress value={generationProgress} className="w-full" />
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3">
                          <div className="text-sm text-gray-400">Generation Options:</div>
                          
                          {/* Flash Option - Instant */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                onClick={() => {
                                  generateMutation.mutate({
                                    recipeId: recipe.id,
                                    prompt: recipe.prompt,
                                    isFlashRequest: true
                                  });
                                }}
                                disabled={generateMutation.isPending}
                                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                              >
                                {generateMutation.isPending ? (
                                  <>
                                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                                    Flashing...
                                  </>
                                ) : (
                                  <>
                                    <Wand2 className="h-4 w-4 mr-2" />
                                    Instant
                                  </>
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>No need to wait, we can make this faster than you can snap your fingers.</p>
                            </TooltipContent>
                          </Tooltip>
                          <div className="text-xs text-gray-500 text-center">
                            Get random backlog video instantly
                          </div>

                          {/* Build Option - Custom */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                onClick={() => setActiveTab("create")}
                                disabled={generateMutation.isPending}
                                className="w-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white"
                              >
                                <Palette className="h-4 w-4 mr-2" />
                                Build
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Customize to taste, with generation times between a few seconds to minutes.</p>
                            </TooltipContent>
                          </Tooltip>
                          <div className="text-xs text-gray-500 text-center">
                            Customize options and generate new content
                          </div>
                        </div>

                        {user && (
                          <div className="bg-bg-primary p-3 rounded-lg mt-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Your Credits:</span>
                              <span className="text-accent-blue font-medium">{(user as any).credits}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Cost:</span>
                              <span className="text-white">{recipe.creditCost} {recipe.creditCost === 1 ? 'credit' : 'credits'}</span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Community Samples</h2>
                <p className="text-gray-400">Discover what others have created with this recipe</p>
              </div>
              <SampleGallery 
                recipeId={recipe.id} 
                recipeType={recipe.generationType as "image" | "video"}
              />
            </TabsContent>

            <TabsContent value="create" className="space-y-6">
              <div className="max-w-2xl mx-auto">
                <Card className="bg-card-bg border-card-border">
                  <CardHeader>
                    <CardTitle className="text-xl text-white text-center">Advanced Creation</CardTitle>
                    <p className="text-gray-400 text-center">Fine-tune your generation with advanced options</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isGenerating ? (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent-blue border-t-transparent mx-auto mb-4"></div>
                          <p className="text-white font-medium">Generating your content...</p>
                          <p className="text-sm text-gray-400">This may take a few moments</p>
                        </div>
                        <Progress value={generationProgress} className="w-full" />
                      </div>
                    ) : (
                      <>
                        {/* Data-driven Recipe Form */}
                        {recipe.recipeSteps && Array.isArray(recipe.recipeSteps) && recipe.recipeSteps.length > 0 ? (
                          <RecipeForm 
                            recipe={recipe} 
                            onGenerate={(formData) => {
                              generateMutation.mutate({
                                recipeId: recipe.id,
                                prompt: customPrompt.trim() || recipe.prompt,
                                formData
                              });
                            }}
                            isGenerating={generateMutation.isPending}
                          />
                        ) : (
                          <div>
                            <label className="text-sm font-medium text-gray-300 mb-2 block">
                              Custom Prompt
                            </label>
                            <Textarea
                              placeholder={`Enter your custom prompt or leave empty to use default...`}
                              value={customPrompt}
                              onChange={(e) => setCustomPrompt(e.target.value)}
                              className="bg-bg-primary border-card-border text-white"
                              rows={6}
                            />
                          </div>
                        )}

                        {user && (
                          <div className="bg-bg-primary p-4 rounded-lg space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Your Credits:</span>
                              <span className="text-accent-blue font-medium">{(user as any).credits}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Generation Cost:</span>
                              <span className="text-white">{recipe.creditCost} {recipe.creditCost === 1 ? 'credit' : 'credits'}</span>
                            </div>
                            <div className="flex justify-between text-sm border-t border-gray-600 pt-2">
                              <span className="text-gray-400">After Generation:</span>
                              <span className="text-accent-green font-medium">
                                {(user as any).credits - recipe.creditCost} {((user as any).credits - recipe.creditCost === 1) ? 'credit' : 'credits'}
                              </span>
                            </div>
                          </div>
                        )}

                        <Button
                          onClick={handleGenerate}
                          disabled={generateMutation.isPending || !user || (user as any).credits < recipe.creditCost}
                          className="w-full bg-gradient-to-r from-accent-blue to-accent-purple hover:shadow-lg transition-all py-3"
                        >
                          {generateMutation.isPending ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                              Generating...
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Generate Content ({recipe.creditCost} {recipe.creditCost === 1 ? 'credit' : 'credits'})
                            </>
                          )}
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Smart Sign-up Modal */}
      <AuthSignupModal
        isOpen={showSignupModal}
        onClose={closeModal}
        recipeName={recipeName}
        onSwitchToSignIn={() => {}}
      />
    </div>
  );
}