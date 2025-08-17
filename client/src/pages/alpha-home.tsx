import AlphaHeader from "@/components/alpha-header";
import AnimatedTaglines from "@/components/animated-taglines";
import CategorySection, { getCategoryIcon } from "@/components/category-section";
import ComingSoonRecipeCard from "@/components/coming-soon-recipe-card";
import { CreditCounter } from "@/components/credit-counter";
import DelulaDifferenceSection from "@/components/delula-difference-section";
import InstantMakeModal from "@/components/instant-make-modal";
import LaunchFeaturesSection from "@/components/launch-features-section";
import Metadata from "@/components/metadata";
import PreviewPill from "@/components/preview-pill";
import RecipeForm from "@/components/recipe-form";
import ServicePartnersSection from "@/components/service-partners-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ALPHA_CONFIG } from "@/config";
import { useRecipesByCategory } from "@/hooks/use-recipes-by-category";
import { useToast } from "@/hooks/use-toast";
import { useCreditRefreshCountdown } from "@/hooks/useCreditRefreshCountdown";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import type { Recipe } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Clock, CreditCard, Flame, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import foodEatingFoodPreview from "../assets/images/Carrot_Preview.png?url";
import delulaLogo from "../assets/images/delula-logo.svg?url";
import glassFruitCuttingPreview from "../assets/images/Plum_concept.png";
import reporterPreview from "../assets/images/Reporter_Preview.png?url";

interface GuestStats {
  used: number;
  remaining: number;
  refreshSecondsLeft?: number;
}

function AlphaHomeContent() {
  const { user: dynamicUser } = useDynamicContext();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showInstantMake, setShowInstantMake] = useState(false);
  const [showCreditsPopup, setShowCreditsPopup] = useState(false);
  const [showOnrampPopup, setShowOnrampPopup] = useState(false);
  const [onrampUrl, setOnrampUrl] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [instantMakeData, setInstantMakeData] = useState<{
    generationId: number;
    shortId?: string;
    videoUrl?: string;
    thumbnailUrl?: string;
  } | null>(null);
  const [instantButtonDisabled, setInstantButtonDisabled] = useState(false);
  const [instantButtonDisabledUntil, setInstantButtonDisabledUntil] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: userData, refetch: refetchUser } = useQuery({
    queryKey: ['/api/auth/user'],
    queryFn: async () => {
      if (!dynamicUser) return null;
      const response = await fetch('/api/auth/user', { credentials: 'include' });
      if (response.ok) return response.json();
      return null;
    },
    enabled: !!dynamicUser,
    refetchInterval: 30000,
  });

  const userCredits = userData?.credits || 0;

  const handleCreditPurchaseSuccess = async () => {
    await refetchUser();
    setShowCreditsPopup(false);
    toast({
      title: "Credits Purchased!",
      description: "Your credits have been added to your account.",
      variant: "default",
    });
  };

  const comingSoonRecipes = [
    {
      name: "Breaking News Parody",
      description: "A realistic news anchor struggles to stay professional as unexpected chaos unfolds in the background.",
      category: "Video",
      generationType: 'video' as const,
      videoDuration: 30,
      creditCost: 10,
      estimatedRelease: "SOON",
      previewImageUrl: reporterPreview
    },
    {
      name: "Food Eating Food",
      description: "Lifelike, hyper-detailed dishes come to life and slowly devour one another in a surreal, mesmerizing, and oddly satisfying display.",
      category: "Video",
      generationType: 'video' as const,
      videoDuration: 10,
      creditCost: 10,
      estimatedRelease: "SOON",
      previewImageUrl: foodEatingFoodPreview
    },
    {
      name: "Glass Fruit Cutting ASMR",
      description: "Delicate glass fruits are sliced cleanly in ultra-slow motion, producing crisp, soothing ASMR sounds with every sparkling cut.",
      category: "Video",
      generationType: 'video' as const,
      videoDuration: 15,
      creditCost: 10,
      estimatedRelease: "SOON",
      previewImageUrl: glassFruitCuttingPreview
    },
  ];

  // Temporary function for testing the instant generation modal
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

    checkButtonState();
    const interval = setInterval(checkButtonState, 1000);
    return () => clearInterval(interval);
  }, [instantButtonDisabledUntil, showInstantMake]);

  // Get guest recipes
  const { data: recipes, isLoading } = useQuery<Recipe[]>({
    queryKey: ["/api/alpha/recipes"],
    queryFn: async () => {
      const response = await fetch("/api/alpha/recipes");
      if (!response.ok) throw new Error("Failed to fetch recipes");
      return response.json();
    },
  });

  // Get guest stats with real-time polling
  const { data: guestStats } = useQuery<GuestStats>({
    queryKey: ["/api/alpha/guest-stats"],
    queryFn: async () => {
      const response = await fetch("/api/alpha/guest-stats");
      if (!response.ok) throw new Error("Failed to fetch guest stats");
      return response.json();
    },
    refetchInterval: 30000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 1000,
  });

  // Fetch recipes by category
  const { data: recipesByCategory, isLoading: categoriesLoading } = useRecipesByCategory();

  const countdown = useCreditRefreshCountdown(guestStats?.refreshSecondsLeft ?? 0);

  // Generate mutation
  const generateMutation = useMutation({
    mutationFn: async (data: {
      recipeId: number;
      formData: Record<string, string>;
    }) => {
      const response = await fetch("/api/alpha/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Generation failed");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Generation Started!",
        description: "Your creation is being made. Check 'My Makes' to see the result.",
      });
      setSelectedRecipe(null);
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGenerate = (formData: Record<string, string>) => {
    if (!selectedRecipe) return;
    generateMutation.mutate({
      recipeId: selectedRecipe.id,
      formData,
    });
  };

  const handleInstantGeneration = async (recipe: Recipe) => {
    console.log('🚀 Starting instant generation for recipe:', recipe.name);
    const timeoutUntil = Date.now() + 10000;
    setInstantButtonDisabledUntil(timeoutUntil);

    try {
      const response = await fetch('/api/generate/instant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId: recipe.id }),
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
        } else {
          setSelectedRecipe(recipe);
        }
      } else {
        const errorData = await response.json();
        if (errorData.fallbackToModal) {
          setSelectedRecipe(recipe);
        } else {
          setSelectedRecipe(recipe);
        }
      }
    } catch (error) {
      console.error('Instant generation failed:', error);
      setSelectedRecipe(recipe);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col">
        <section className="text-center pt-8 md:pt-16 pb-4 md:pb-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-4">
              <div className="h-16 md:h-24 w-48 bg-gray-700 rounded mx-auto animate-pulse" />
            </div>
            <div className="mb-8">
              <div className="h-8 w-2/3 bg-gray-700 rounded mx-auto animate-pulse" />
            </div>
          </div>
        </section>
        <section className="px-4 pb-8 flex-1">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Metadata
        title="Delula: One-Click Viral Hits"
        description="Delula creates one-click viral hits - no prompts, no hassle. Instantly generate videos and images you can customize with a friendly point-and-click interface."
        image="/delula-alpha-preview.png"
        canonicalUrl="https://delu.la/alpha"
        keywords="AI content creator, one-click viral videos, no-prompt image generator, text-free AI tool, generate images and videos, instant content creation, creator tools, customizable AI media"
        type="website"
        ogTitle="Delula: One-Click Viral Hits"
        ogDescription="No prompts. No waiting. Just scroll-stopping videos and images, generated instantly and customized your way."
      />

      <AlphaHeader
        rightContent={
          <div className="flex items-center gap-4">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => (window.location.href = "/alpha/my-makes")}
                className="text-white hover:bg-accent-blue/20 relative"
              >
                My Makes
                {guestStats && guestStats.used > 0 && (
                  <Badge className="ml-2 bg-accent-blue text-white text-xs px-1.5 py-0.5 animate-pulse">
                    {guestStats.used}
                  </Badge>
                )}
              </Button>

              {/* Credits Display */}
              <div className="relative">
                <button
                  onClick={() => setShowCreditsPopup(!showCreditsPopup)}
                  className="flex items-center space-x-2 text-white hover:text-orange-400 transition-colors cursor-pointer px-3 py-1 rounded-md hover:bg-white/10"
                >
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="font-medium text-sm">{userCredits} Credits</span>
                </button>

                {/* Credits Popup */}
                {showCreditsPopup && (
                  <>
                    {/* Mobile Overlay */}
                    <div
                      className="fixed inset-0 bg-black/50 z-[9998] md:hidden"
                      onClick={() => setShowCreditsPopup(false)}
                    />

                    {/* Popup */}
                    <div className="credits-popup absolute top-full right-0 mt-2 w-72 md:w-80 bg-card-bg border border-card-border rounded-lg shadow-xl z-[9999]">
                      {/* Popup Header */}
                      <div className="flex items-center justify-between p-3 border-b border-card-border">
                        <h3 className="text-white font-semibold text-base">Buy Credits</h3>
                        <button
                          onClick={() => setShowCreditsPopup(false)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Popup Content */}
                      <div className="p-3">
                        <div className="space-y-3">
                          {/* Current Credits Display */}
                          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                              <Flame className="w-5 h-5 text-orange-400" />
                              <div>
                                <p className="text-white font-medium text-sm">Current Balance</p>
                                <p className="text-orange-400 text-xl font-bold">{userCredits} Credits</p>
                              </div>
                            </div>
                          </div>

                          {/* Credit Package */}
                          <div className="relative bg-gray-800 border border-blue-500/30 rounded-lg p-3 group">
                            {/* Best Value Badge - Always Visible */}
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                              <div className="bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg">
                                Best Value
                              </div>
                            </div>
                            
                            <div className="text-center pt-3">
                               <div className="flex items-center justify-center space-x-3 mb-3">
                                 <div className="text-center">
                                   <div className="text-2xl font-bold text-white">50</div>
                                   <div className="text-sm text-slate-400">Credits</div>
                                 </div>
                                 <div className="text-slate-500 text-2xl font-light">=</div>
                                 <div className="text-center">
                                   <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">$5</div>
                                   <div className="text-sm text-slate-400">5 USDC</div>
                                 </div>
                               </div>

                              {/* Payment Method Selection */}
                              <div className="flex space-x-2 mb-0">
                                {/* Apple Pay Option */}
                                <button
                                  onClick={async () => {
                                    try {
                                      // First get a session token
                                      const sessionResponse = await fetch('/api/cdp/session-token', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                          walletAddress: '',
                                          asset: 'USDC'
                                        })
                                      });

                                      if (!sessionResponse.ok) {
                                        const errorData = await sessionResponse.json().catch(() => ({}));
                                        throw new Error(errorData.error_description || 'Failed to get session token');
                                      }

                                      const sessionData = await sessionResponse.json();
                                      const sessionToken = sessionData.sessionToken;

                                      if (!sessionToken) {
                                        throw new Error('No session token received');
                                      }

                                      // Now open the Coinbase onramp with the session token
                                      const onrampUrl = `https://pay.coinbase.com/buy/select-asset?sessionToken=${sessionToken}&defaultPaymentMethod=APPLE_PAY&skipPaymentMethodSelection=true&applePayEnabled=true&cardEnabled=true&paymentMethodPriority=APPLE_PAY`;
                                      
                                      const width = 600;
                                      const height = 700;
                                      const left = (window.screen.width - width) / 2;
                                      const top = (window.screen.height - height) / 2;
                                      const popupFeatures = `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes,status=yes`;
                                      
                                      window.open(onrampUrl, '_blank', popupFeatures);
                                      handleCreditPurchaseSuccess();
                                    } catch (error: any) {
                                      console.error('Error in onramp handler:', error);
                                      alert('Unable to open onramp. Please try again later.');
                                    }
                                  }}
                                  className="flex-1 bg-black hover:bg-gray-900 text-white px-3 py-3 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                                >
                                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                  </svg>
                                  <span className="font-semibold text-sm">Apple Pay</span>
                                </button>

                                {/* Credit Card Option */}
                                <button
                                  onClick={async () => {
                                    try {
                                      // First get a session token
                                      const sessionResponse = await fetch('/api/cdp/session-token', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                          walletAddress: '',
                                          asset: 'USDC'
                                        })
                                      });

                                      if (!sessionResponse.ok) {
                                        const errorData = await sessionResponse.json().catch(() => ({}));
                                        throw new Error(errorData.error_description || 'Failed to get session token');
                                      }

                                      const sessionData = await sessionResponse.json();
                                      const sessionToken = sessionData.sessionToken;

                                      if (!sessionToken) {
                                        throw new Error('No session token received');
                                      }

                                      // Now open the Coinbase onramp with the session token
                                      const onrampUrl = `https://pay.coinbase.com/buy/select-asset?sessionToken=${sessionToken}&defaultPaymentMethod=CREDIT_CARD&skipPaymentMethodSelection=true&applePayEnabled=true&cardEnabled=true&paymentMethodPriority=CREDIT_CARD`;
                                      
                                      const width = 600;
                                      const height = 700;
                                      const left = (window.screen.width - width) / 2;
                                      const top = (window.screen.height - height) / 2;
                                      const popupFeatures = `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes,status=yes`;
                                      
                                      window.open(onrampUrl, '_blank', popupFeatures);
                                      handleCreditPurchaseSuccess();
                                    } catch (error: any) {
                                      console.error('Error in onramp handler:', error);
                                      alert('Unable to open onramp. Please try again later.');
                                    }
                                  }}
                                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-0 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                                >
                                  <CreditCard className="w-6 h-6" />
                                  <span className="font-semibold text-sm">Credit Card</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden relative ml-auto">
              <button
                onClick={() => setShowCreditsPopup(true)}
                className="mobile-credits-button text-white hover:text-orange-400 transition-colors cursor-pointer mr-3"
              >
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="font-medium text-sm">{userCredits}</span>
              </button>

              <Button
                variant="ghost"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:bg-accent-blue/20 relative"
              >
                <Menu className="h-5 w-5" />
                {guestStats && guestStats.used > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
                    {guestStats.used}
                  </Badge>
                )}
              </Button>

              {/* Mobile Menu */}
              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 bg-black/50 z-[9998] md:hidden"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-card-bg border border-card-border rounded-lg shadow-lg z-[9999]">
                    <div className="p-3">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          window.location.href = "/alpha/my-makes";
                          setIsMenuOpen(false);
                        }}
                        className="w-full justify-start text-white hover:bg-accent-blue/20 mb-2"
                      >
                        My Makes
                        {guestStats && guestStats.used > 0 && (
                          <Badge className="ml-auto bg-accent-blue text-white text-xs px-1.5 py-0.5 animate-pulse">
                            {guestStats.used}
                          </Badge>
                        )}
                      </Button>
                      <button
                        onClick={() => {
                          setShowCreditsPopup(true);
                          setIsMenuOpen(false);
                        }}
                        className="w-full justify-start text-white hover:bg-accent-blue/20 flex items-center space-x-2 px-3 py-2 rounded-md"
                      >
                        <Flame className="w-4 h-4 text-orange-400" />
                        <span>{userCredits} Credits</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        }
      />

      {/* Hero Section */}
      <section className="text-center pt-8 md:pt-16 pb-4 md:pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <img src={delulaLogo} alt="delula" className="h-16 md:h-24 w-auto" />
              <PreviewPill />
            </div>
          </div>
          <div className="mb-8">
            <AnimatedTaglines />
          </div>
        </div>
      </section>

      {/* Recipe Cards Section - Organized by Category */}
      <section className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <TooltipProvider>
            {categoriesLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue mx-auto mb-4"></div>
                <p className="text-gray-400">Loading recipes...</p>
              </div>
            ) : recipesByCategory ? (
              <>
                {/* Videos Section */}
                {recipesByCategory.video && recipesByCategory.video.length > 0 && (
                  <CategorySection
                    title="Videos"
                    recipes={recipesByCategory.video}
                    icon={getCategoryIcon('video')}
                    onUseRecipe={(recipe) => setSelectedRecipe(recipe)}
                    onMediaClick={(recipe) => setSelectedRecipe(recipe)}
                    onInstantGeneration={handleInstantGeneration}
                    isInstantModalOpen={showInstantMake}
                    isInstantButtonDisabled={instantButtonDisabled}
                  />
                )}

                {/* Images Section */}
                {recipesByCategory.image && recipesByCategory.image.length > 0 && (
                  <CategorySection
                    title="Images"
                    recipes={recipesByCategory.image}
                    icon={getCategoryIcon('image')}
                    onUseRecipe={(recipe) => setSelectedRecipe(recipe)}
                    onMediaClick={(recipe) => setSelectedRecipe(recipe)}
                    onInstantGeneration={handleInstantGeneration}
                    isInstantModalOpen={showInstantMake}
                    isInstantButtonDisabled={instantButtonDisabled}
                  />
                )}

                {/* Tools Section */}
                {recipesByCategory.tool && recipesByCategory.tool.length > 0 && (
                  <CategorySection
                    title="Tools"
                    recipes={recipesByCategory.tool}
                    icon={getCategoryIcon('tool')}
                    onUseRecipe={(recipe) => setSelectedRecipe(recipe)}
                    onMediaClick={(recipe) => setSelectedRecipe(recipe)}
                    onInstantGeneration={handleInstantGeneration}
                    isInstantModalOpen={showInstantMake}
                    isInstantButtonDisabled={instantButtonDisabled}
                  />
                )}

                {/* Coming Soon Section */}
                <section className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <Clock className="h-6 w-6 text-accent-blue" />
                    <h2 className="text-2xl font-bold text-white">Coming Soon</h2>
                    <Badge variant="secondary" className="ml-2">
                      {comingSoonRecipes.length} {comingSoonRecipes.length === 1 ? 'recipe' : 'recipes'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {comingSoonRecipes.map((recipe, index) => (
                      <ComingSoonRecipeCard
                        key={`coming-soon-${index}`}
                        name={recipe.name}
                        description={recipe.description}
                        category={recipe.category}
                        generationType={recipe.generationType}
                        videoDuration={recipe.videoDuration}
                        creditCost={recipe.creditCost}
                        estimatedRelease={recipe.estimatedRelease}
                        previewImageUrl={recipe.previewImageUrl}
                      />
                    ))}
                  </div>
                </section>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">No recipes found.</p>
              </div>
            )}
          </TooltipProvider>
        </div>
      </section>

      {/* Credit Counter */}
      <section className="px-4 pb-8">
        {guestStats && (
          <CreditCounter
            count={guestStats.remaining}
            subtext={guestStats?.refreshSecondsLeft !== undefined ? countdown.display : undefined}
            msRemaining={guestStats?.refreshSecondsLeft !== undefined ? guestStats.refreshSecondsLeft * 1000 : undefined}
          />
        )}
      </section>

      {/* Sign Up Section */}
      <section className="px-4 pb-8">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-card-bg border-card-border">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Want more?</h2>
              <p className="text-gray-300 mb-6">
                Sign up for early access to <strong>delula</strong> and get bonus credits!
              </p>
              <Button
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 text-lg font-semibold"
                onClick={() => window.open(ALPHA_CONFIG.typeformUrl, "_blank")}
              >
                Get Early Access
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Launch Features Section */}
      <LaunchFeaturesSection />

      {/* Delula Difference Section */}
      <DelulaDifferenceSection />

      {/* Service Partners Section */}
      <ServicePartnersSection />

      {/* Footer */}
      <footer className="bg-dark border-t border-card-border py-6 px-4 mt-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            powered by <a href="https://scrypted.ai/">scrypted.ai</a> © 2025 all rights reserved
          </p>
        </div>
      </footer>

      {/* Recipe Modal */}
      <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
        <DialogContent className="bg-card-bg border-card-border max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white mb-2">{selectedRecipe?.name}</DialogTitle>
            <p className="text-gray-300 text-sm">{selectedRecipe?.instructions}</p>
          </DialogHeader>

          {selectedRecipe && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Sample Output</h3>
                <div className="aspect-video bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg overflow-hidden relative">
                  {selectedRecipe.previewImageUrl ? (
                    <img
                      src={selectedRecipe.previewImageUrl}
                      alt={`${selectedRecipe.name} sample`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <div className="text-center">
                        <div className="text-4xl mb-2">
                          {selectedRecipe.slug === "cat-olympic-diving" && "🏆"}
                          {selectedRecipe.slug === "lava-food-asmr" && "🌋"}
                          {selectedRecipe.slug === "based-ape-vlog" && "🦍"}
                        </div>
                        <p className="text-lg font-bold">{selectedRecipe.name}</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-accent-blue text-white text-xs px-2 py-1 rounded-full font-medium">Sample</span>
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg text-sm text-gray-300 w-full max-w-md">
                  <h4 className="text-white font-semibold mb-3">
                    What you'll get for {selectedRecipe.creditCost} Credits:
                  </h4>
                  <ul className="space-y-2 list-none">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 mt-1 bg-accent-blue rounded-full" />
                      <span>MP4 video: High-quality AI-generated HD (1080P)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 mt-1 bg-accent-blue rounded-full" />
                      <span>Vertical format for TikTok, YouTube Shorts and others.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 mt-1 bg-accent-blue rounded-full" />
                      <span>Audio: commentator (english) with sound effects</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 mt-1 bg-accent-blue rounded-full" />
                      <span>No Watermarks, no restrictions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 mt-1 bg-accent-blue rounded-full" />
                      <span>Full commercial rights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 mt-1 bg-accent-blue rounded-full" />
                      <span>8 second video</span>
                    </li>
                    <li className="text-xs text-gray-400 text-center mt-3 ml-4 italic">120 seconds generation time</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Customize Your Creation</h3>

                {guestStats && guestStats.remaining <= 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">You've used all your free creations!</p>
                    <Button
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      onClick={() => window.open(ALPHA_CONFIG.typeformUrl, "_blank")}
                    >
                      Get Unlimited Access
                    </Button>
                  </div>
                ) : (
                  <RecipeForm
                    recipe={selectedRecipe}
                    onGenerate={handleGenerate}
                    isGenerating={generateMutation.isPending}
                  />
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Instant Make Modal */}
      <InstantMakeModal
        isOpen={showInstantMake}
        onClose={() => {
          setShowInstantMake(false);
          setInstantMakeData(null);
        }}
        generationData={instantMakeData || undefined}
      />

      {/* Custom Onramp Popup */}
      {showOnrampPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-card-bg border border-card-border rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Flame className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Buy Credits with Coinbase</h2>
                    <p className="text-purple-100 text-sm">
                      {selectedPaymentMethod === 'APPLE_PAY' ? 'Apple Pay' : 'Credit Card'} • $5 for 50 Credits
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowOnrampPopup(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 relative">
              {onrampUrl && (
                <iframe
                  src={onrampUrl}
                  className="w-full h-[600px] border-0"
                  title="Coinbase Onramp"
                  allow="payment"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                />
              )}
            </div>

            <div className="bg-gray-900 p-4 border-t border-card-border">
              <div className="text-center text-gray-400 text-sm">
                <p>🔒 Your payment information is secure and encrypted</p>
                <p className="mt-1">Powered by Coinbase Developer Platform</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setIsMenuOpen(false)} />
      )}
    </div>
  );
}

// Main component
export default function AlphaHome() {
  return <AlphaHomeContent />;
}
