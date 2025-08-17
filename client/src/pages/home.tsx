import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthInterception } from "@/hooks/useAuthInterception";
import Navigation from "@/components/navigation";
import RecipeCard from "@/components/recipe-card";
import RecipeModal from "@/components/recipe-modal";
import BacklogWidget from "@/components/backlog-widget";
import CustomVideoWidget from "@/components/custom-video-widget";
import AuthSignupModal from "@/components/auth-signup-modal";
import InstantMakeModal from "@/components/instant-make-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Play, Pause, Image, Video } from "lucide-react";
import type { Recipe } from "@shared/schema";
import Metadata from "@/components/metadata";

export default function Home() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewRecipe, setPreviewRecipe] = useState<Recipe | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [instantMakeData, setInstantMakeData] = useState<{
    generationId: number;
    shortId?: string;
    videoUrl?: string;
    thumbnailUrl?: string;
  } | null>(null);
  const [showInstantMake, setShowInstantMake] = useState(false);
  const [instantButtonDisabled, setInstantButtonDisabled] = useState(false);
  const [instantButtonDisabledUntil, setInstantButtonDisabledUntil] = useState<number | null>(null);
  const { showSignupModal, recipeName, interceptAction, closeModal } = useAuthInterception();

  // Temporary function for testing the instant generation modal
  // This can be called from the browser console: window.testInstantModal()
  useEffect(() => {
    (window as any).testInstantModal = () => {
      const mockData = {
        generationId: 999,
        shortId: 'test123',
        videoUrl: 'https://example.com/test-video.mp4',
        thumbnailUrl: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Test+Thumbnail'
      };

      setInstantMakeData(mockData);
      setShowInstantMake(true);
    };

    (window as any).closeInstantModal = () => {
      setShowInstantMake(false);
      setInstantMakeData(null);
    };

    return () => {
      delete (window as any).testInstantModal;
      delete (window as any).closeInstantModal;
    };
  }, []);

  // Button disabling logic with 10-second timeout
  useEffect(() => {
    const checkButtonState = () => {
      const now = Date.now();
      const isDisabledByTimeout = instantButtonDisabledUntil && now < instantButtonDisabledUntil;
      const isDisabledByModal = showInstantMake;

      setInstantButtonDisabled(isDisabledByTimeout || isDisabledByModal);
    };

    // Check immediately
    checkButtonState();

    // Set up interval to check every second
    const interval = setInterval(checkButtonState, 1000);

    return () => clearInterval(interval);
  }, [instantButtonDisabledUntil, showInstantMake]);

  const { data: recipes, isLoading } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes"],
  });

  const filteredRecipes = recipes?.filter(recipe => {
    const matchesCategory = selectedCategory === "all" || recipe.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.style.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }) || [];

  const handleMediaClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag.toLowerCase());
  };

  const closePreview = () => {
    setPreviewRecipe(null);
    setIsVideoPlaying(false);
  };

  const handleInstantGeneration = async (recipe: Recipe) => {
    // Set 10-second timeout for button disabling
    const timeoutUntil = Date.now() + 10000; // 10 seconds
    setInstantButtonDisabledUntil(timeoutUntil);

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
          const modalData = {
            generationId: result.generationId,
            shortId: result.shortId,
            videoUrl: result.videoUrl,
            thumbnailUrl: result.thumbnailUrl
          };

          setInstantMakeData(modalData);
          setShowInstantMake(true);
        }
      } else {
        const errorData = await response.json();

        if (errorData.fallbackToModal) {
          setSelectedRecipe(recipe);
        } else {
          console.error('Instant generation error:', errorData);
          setSelectedRecipe(recipe);
        }
      }
    } catch (error) {
      console.error('Instant generation failed:', error);
      setSelectedRecipe(recipe);
    }
  };

  const categories = [
    { value: "all", label: "All Recipes" },
    { value: "Digital Art", label: "Digital Art" },
    { value: "Social Media", label: "Social Media" },
    { value: "Marketing", label: "Marketing" },
    { value: "Video", label: "Video" },
  ];

  return (
    <div className="min-h-screen bg-dark">
      <Metadata
        title="Delula: One-Click Viral Hits"
        description="Delula creates one-click viral hits - no prompts, no hassle. Instantly generate videos and images you can customize with a friendly point-and-click interface."
        image="/delula-alpha-preview.png"
        canonicalUrl="https://delu.la/home"
        keywords="AI content creator, one-click viral videos, no-prompt image generator, text-free AI tool, generate images and videos, instant content creation, creator tools, customizable AI media"
        type="website"
        ogTitle="Delula: One-Click Viral Hits"
        ogDescription="No prompts. No waiting. Just scroll-stopping videos and images, generated instantly and customized your way."
      />
      <Navigation />

      <main className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              AI Content Creation
              <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
                {" "}Made Simple
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Choose from professionally crafted recipes and customize them for your needs
            </p>
          </div>

          {/* Custom Video Creator */}
          <div className="mb-16">
            <div className="max-w-2xl mx-auto">
              <CustomVideoWidget />
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-12">
            {/* Search Input */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search recipes by name, category, or style..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card-bg border-gray-700 text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Category Filter */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-5 bg-card-bg">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.value}
                    value={category.value}
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent-blue data-[state=active]:to-accent-purple"
                  >
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Recipe Grid with Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-20">
            {/* Main Recipe Grid */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-card-bg rounded-xl p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-6" />
                    <div className="space-y-3 mb-6">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-24" />
                    </div>
                  </div>
                ))
              ) : filteredRecipes.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400 text-lg">No recipes found for this category.</p>
                </div>
              ) : (
                filteredRecipes.map((recipe) => {
                  return (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onUseRecipe={setSelectedRecipe}
                      onMediaClick={handleMediaClick}
                      onTagClick={handleTagClick}
                      interceptAction={interceptAction}
                      onInstantGeneration={handleInstantGeneration}
                      isInstantModalOpen={showInstantMake}
                      isInstantButtonDisabled={instantButtonDisabled}
                    />
                  );
                })
              )}
            </div>

            {/* Sidebar with Backlog Widget */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <BacklogWidget />
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center py-16 border-t border-gray-800">
            <h2 className="text-3xl font-bold mb-4">Ready to Create Amazing Content?</h2>
            <p className="text-gray-400 mb-8">
              Start with your free credits and see the magic happen
            </p>
            <Button
              onClick={() => window.location.href = "/dashboard"}
              className="bg-gradient-to-r from-accent-blue to-accent-purple px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </main>

      {/* Media Preview Overlay */}
      <Dialog open={!!previewRecipe} onOpenChange={closePreview}>
        <DialogContent className="max-w-4xl bg-card-bg border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              {previewRecipe?.name} Preview
            </DialogTitle>
          </DialogHeader>

          {previewRecipe && (
            <div className="space-y-4">
              {/* Media Preview Area */}
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                {previewRecipe.generationType === 'video' ? (
                  <div className="text-center">
                    <div className="mb-4">
                      <Button
                        onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                        className="bg-accent-blue/20 hover:bg-accent-blue/40 text-white border border-accent-blue/50 rounded-full p-4"
                      >
                        {isVideoPlaying ? (
                          <Pause className="h-8 w-8" />
                        ) : (
                          <Play className="h-8 w-8" />
                        )}
                      </Button>
                    </div>
                    <Video className="h-16 w-16 text-accent-blue mx-auto mb-2" />
                    <p className="text-gray-300">Video Recipe Preview</p>
                    <p className="text-sm text-gray-400">Sample video will play here</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Image className="h-16 w-16 text-accent-purple mx-auto mb-2" />
                    <p className="text-gray-300">Image Recipe Preview</p>
                    <p className="text-sm text-gray-400">Sample images will display here</p>
                  </div>
                )}

                {/* Sample overlay showing recipe details */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white font-medium">{previewRecipe.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-300">
                    <span>Style: {previewRecipe.style}</span>
                    <span>•</span>
                    <span>Category: {previewRecipe.category}</span>
                    <span>•</span>
                    <span className="text-success-green">{previewRecipe.creditCost} {previewRecipe.creditCost === 1 ? 'credit' : 'credits'}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="text-center">
                <Button
                  onClick={() => {
                    closePreview();
                    if (interceptAction) {
                      interceptAction(() => setSelectedRecipe(previewRecipe), previewRecipe.name);
                    } else {
                      setSelectedRecipe(previewRecipe);
                    }
                  }}
                  className="bg-gradient-to-r from-accent-blue to-accent-purple px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Use This Recipe
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <RecipeModal
        recipe={selectedRecipe}
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />

      {/* Instant Make Modal */}
      <InstantMakeModal
        isOpen={showInstantMake}
        onClose={() => {
          setShowInstantMake(false);
          setInstantMakeData(null);
        }}
        generationData={instantMakeData || undefined}
      />



      {/* Smart Sign-up Modal */}
      <AuthSignupModal
        isOpen={showSignupModal}
        onClose={closeModal}
        onSwitchToSignIn={() => { }}
        recipeName={recipeName}
      />
    </div>
  );
}
