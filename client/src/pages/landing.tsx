import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Zap, ArrowRight, Star, Users, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import HeroCarousel from "@/components/hero-carousel";

import RecipeDiscovery from "@/components/recipe-discovery";
import GalleryItem from "@/components/gallery-item";
import MediaPreviewModal from "@/components/media-preview-modal";
import Metadata from "@/components/metadata";

const SAMPLE_GALLERY = [
  {
    title: "Futuristic AI Anatomy",
    usageCount: "3.2K",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    color: "blue"
  },
  {
    title: "Social Media Illusion",
    usageCount: "2.8K",
    imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    color: "purple"
  },
  {
    title: "Cyberpunk Portrait",
    usageCount: "4.1K",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    color: "cyan"
  },
  {
    title: "Product Photography",
    usageCount: "1.9K",
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    color: "orange"
  },
  {
    title: "Fantasy Landscape",
    usageCount: "2.3K",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    color: "green"
  },
  {
    title: "Surreal Dreamscape",
    usageCount: "3.7K",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    color: "indigo"
  }
];

export default function Landing() {
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  const handleUseRecipe = (recipe: any) => {
    // This will be handled by the auth system
  };

  const handleSeeAll = () => {
    // Navigate to full recipe gallery
  };

  const handleMediaClick = (media: any) => {
    setSelectedMedia(media);
  };

  const handleTagClick = (tag: string) => {
    // Handle tag filtering
  };

  const interceptAction = (action: () => void, recipeName?: string) => {
    // Auth system will handle intercepting actions
    action();
  };

  const handleClaimCredits = () => {
    // Handle credit claiming
  };

  const handleVisitRecipeFromModal = (recipe: any) => {
    window.location.href = `/recipe/${recipe.slug}`;
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      <Metadata
        title="Delula: One-Click Viral Hits"
        description="Delula creates one-click viral hits - no prompts, no hassle. Instantly generate videos and images you can customize with a friendly point-and-click interface."
        image="/delula-alpha-preview.png"
        canonicalUrl="https://delu.la"
        keywords="AI content creator, one-click viral videos, no-prompt image generator, text-free AI tool, generate images and videos, instant content creation, creator tools, customizable AI media"
        type="website"
        ogTitle="Delula: One-Click Viral Hits"
        ogDescription="No prompts. No waiting. Just scroll-stopping videos and images, generated instantly and customized your way."
      />
      <Navigation onClaimCreditsClick={handleClaimCredits} />

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Recipe Discovery Sections */}
      <section className="py-16 bg-gradient-to-b from-dark to-gray-900">
        <div className="max-w-7xl mx-auto">
          <RecipeDiscovery
            onUseRecipe={handleUseRecipe}
            onSeeAll={handleSeeAll}
            onMediaClick={handleMediaClick}
            onTagClick={handleTagClick}
            interceptAction={interceptAction}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-dark to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Creators Choose
              <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent"> Delula</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              No prompts. No waiting. Just scroll-stopping videos and images, generated instantly and customized your way.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-card-bg border-gray-800 hover:border-accent-blue/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-accent-blue/20 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-accent-blue" />
                </div>
                <CardTitle className="text-xl font-bold">Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Generate professional content in seconds with our optimized AI pipeline</p>
              </CardContent>
            </Card>

            <Card className="bg-card-bg border-gray-800 hover:border-accent-purple/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-accent-purple/20 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-accent-purple" />
                </div>
                <CardTitle className="text-xl font-bold">Community Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Access recipes created by top creators and share your own innovations</p>
              </CardContent>
            </Card>

            <Card className="bg-card-bg border-gray-800 hover:border-accent-green/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-accent-green/20 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-accent-green" />
                </div>
                <CardTitle className="text-xl font-bold">Premium Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Industry-leading AI models ensure professional-grade output every time</p>
              </CardContent>
            </Card>

            <Card className="bg-card-bg border-gray-800 hover:border-accent-orange/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-accent-orange/20 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-accent-orange" />
                </div>
                <CardTitle className="text-xl font-bold">Smart Routing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Intelligent provider selection optimizes cost, speed, and quality automatically</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-16">
            <Button size="lg" className="bg-gradient-to-r from-accent-blue to-accent-purple hover:from-accent-blue/80 hover:to-accent-purple/80">
              <Sparkles className="mr-2 h-5 w-5" />
              Start Creating Now
            </Button>
          </div>
        </div>
      </section>



      {/* Community Gallery */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-900 to-dark">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Community Showcase</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover amazing creations from our community of creators
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_GALLERY.map((item, index) => (
              <GalleryItem
                key={index}
                title={item.title}
                usageCount={item.usageCount}
                imageUrl={item.imageUrl}
                color={item.color}
                onUseRecipe={() => handleMediaClick(item)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent mb-4">
                Delula
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Create one-click viral hits - no prompts, no hassle. Instantly generate videos and images you can customize with a friendly point-and-click interface.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <div className="space-y-2">
                <Link href="/gallery" className="block text-gray-400 hover:text-white transition-colors">Gallery</Link>
                <Link href="/tutorials" className="block text-gray-400 hover:text-white transition-colors">Tutorials</Link>

              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <div className="space-y-2">
                <Link href="/terms-of-service" className="block text-gray-400 hover:text-white transition-colors">Terms</Link>
                <Link href="/privacy-policy" className="block text-gray-400 hover:text-white transition-colors">Privacy</Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Delula. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Media Preview Modal */}
      {selectedMedia && (
        <MediaPreviewModal
          isOpen={!!selectedMedia}
          onClose={() => setSelectedMedia(null)}
          generation={{
            id: 0,
            recipeTitle: selectedMedia.title,
            imageUrl: selectedMedia.imageUrl,
            status: 'completed',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }}
        />
      )}
    </div>
  );
}