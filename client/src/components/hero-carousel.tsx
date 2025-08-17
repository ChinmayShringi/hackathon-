import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Play, Sparkles, Gamepad2, Users, Package, Megaphone, Heart } from "lucide-react";
import { Link } from "wouter";
import Autoplay from "embla-carousel-autoplay";

const heroSlides = [
  {
    id: 1,
    category: "Gaming",
    icon: Gamepad2,
    title: "Epic Gaming Character Art",
    subtitle: "Level up your game with stunning character designs",
    description: "Create professional gaming avatars, character portraits, and fantasy art that brings your virtual worlds to life. Perfect for streamers, game developers, and RPG enthusiasts.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop&crop=center",
    gradient: "from-purple-600 via-blue-600 to-cyan-500",
    recipeName: "Gaming Character Creator",
    credits: 5,
    tags: ["Fantasy", "Character Design", "Digital Art"]
  },
  {
    id: 2,
    category: "Influencer",
    icon: Users,
    title: "Social Media Magic",
    subtitle: "Content that goes viral starts here",
    description: "Generate scroll-stopping social media content, lifestyle photography, and brand-worthy visuals that captivate your audience and boost engagement across all platforms.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop&crop=center",
    gradient: "from-pink-500 via-rose-400 to-orange-400",
    recipeName: "Social Media Illusion",
    credits: 3,
    tags: ["Lifestyle", "Portrait", "Trendy"]
  },
  {
    id: 3,
    category: "Product Marketing",
    icon: Package,
    title: "Professional Product Showcase",
    subtitle: "E-commerce ready in seconds",
    description: "Transform any product into a professional marketing asset with studio-quality lighting, clean backgrounds, and commercial-grade photography that drives sales.",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center",
    gradient: "from-slate-600 via-gray-700 to-zinc-800",
    recipeName: "Product Showcase",
    credits: 6,
    tags: ["Commercial", "Clean", "Professional"]
  },
  {
    id: 4,
    category: "Promotional",
    icon: Megaphone,
    title: "Eye-Catching Promotions",
    subtitle: "Campaigns that convert customers",
    description: "Design compelling promotional materials, event banners, and marketing visuals that grab attention and drive action. Perfect for sales, launches, and special events.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop&crop=center",
    gradient: "from-emerald-500 via-teal-500 to-cyan-600",
    recipeName: "Promotion Designer",
    credits: 4,
    tags: ["Bold", "Marketing", "Eye-catching"]
  },
  {
    id: 5,
    category: "Fun",
    icon: Heart,
    title: "Creative & Whimsical Art",
    subtitle: "Where imagination comes to play",
    description: "Unleash your creativity with playful illustrations, abstract art, and imaginative scenes that bring joy and wonder to any project. Perfect for personal expression and artistic exploration.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=center",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    recipeName: "Abstract Art Generator",
    credits: 2,
    tags: ["Playful", "Creative", "Colorful"]
  }
];

export default function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const autoplay = Autoplay({
    delay: 5000,
    stopOnInteraction: true,
    stopOnMouseEnter: true,
  });

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="relative h-[85vh] min-h-[600px] overflow-hidden bg-dark">
      <Carousel
        setApi={setApi}
        className="w-full h-full"
        plugins={[autoplay]}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="h-[85vh] min-h-[600px] -ml-0">
          {heroSlides.map((slide) => (
            <CarouselItem key={slide.id} className="pl-0 h-[85vh] min-h-[600px]">
              <div className="relative w-full h-[85vh] min-h-[600px]">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-85`} />
                  <div className="absolute inset-0 bg-black/30" />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex items-center">
                  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="text-white space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                          <slide.icon className="h-6 w-6" />
                        </div>
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                          {slide.category}
                        </Badge>
                      </div>

                      <div className="space-y-4">
                        <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                          {slide.title}
                        </h1>
                        <p className="text-xl lg:text-2xl text-white/90 font-medium">
                          {slide.subtitle}
                        </p>
                        <p className="text-lg text-white/80 leading-relaxed max-w-xl">
                          {slide.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {slide.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link href={`/recipe/${slide.recipeName.toLowerCase().replace(/\s+/g, '-')}`}>
                          <Button size="lg" className="bg-white text-black hover:bg-white/90 font-semibold">
                            <Sparkles className="mr-2 h-5 w-5" />
                            Try This Recipe
                          </Button>
                        </Link>
                        <Link href="/gallery">
                          <Button 
                            size="lg" 
                            variant="outline" 
                            className="border-white/30 text-white hover:bg-white/10"
                          >
                            <Play className="mr-2 h-4 w-4" />
                            View Gallery
                          </Button>
                        </Link>
                      </div>

                      <div className="flex items-center gap-4 text-white/70">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                          <span className="text-sm">Only {slide.credits} {slide.credits === 1 ? 'credit' : 'credits'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                          <span className="text-sm">Generate in seconds</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Content - Preview Card */}
                    <div className="hidden lg:block">
                      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
                        <div className="aspect-[4/3] bg-white/5 rounded-xl mb-4 overflow-hidden">
                          <img
                            src={slide.image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-white font-semibold text-lg">{slide.recipeName}</h3>
                          <p className="text-white/70 text-sm">
                            Professional {slide.category.toLowerCase()} content generation with AI-powered precision
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge className="bg-white/20 text-white">
                              {slide.credits} {slide.credits === 1 ? 'Credit' : 'Credits'}
                            </Badge>
                            <span className="text-white/60 text-sm">Ready to use</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Custom Navigation Buttons */}
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 border-white/30 text-white backdrop-blur-sm h-12 w-12" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 border-white/30 text-white backdrop-blur-sm h-12 w-12" />
      </Carousel>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex gap-2">
          {Array.from({ length: count }, (_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index + 1 === current 
                  ? 'bg-white scale-125' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Auto-play indicator */}
      <div className="absolute top-4 right-4 z-20">
        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
          <div className="flex items-center gap-2 text-white text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Auto</span>
          </div>
        </div>
      </div>
    </div>
  );
}