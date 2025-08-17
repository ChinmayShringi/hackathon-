import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, Download, Eye, Heart, Share2, Wand2 } from "lucide-react";
import type { Generation, Recipe } from "@shared/schema";

const SAMPLE_GALLERY = [
  {
    id: 1,
    title: "Futuristic AI Anatomy",
    description: "Digital illustration with glowing neural pathways",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Digital Art",
    likes: 2847,
    downloads: 1293,
    userName: "Alex Chen",
    userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    recipe: "Futuristic AI Anatomy",
    featured: true
  },
  {
    id: 2,
    title: "Social Media Trompe-l'œil",
    description: "Person stepping out of smartphone screen",
    imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Social Media",
    likes: 3421,
    downloads: 1876,
    userName: "Sofia Rodriguez",
    userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b37c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    recipe: "Social Media Illusion",
    featured: true
  },
  {
    id: 3,
    title: "Cyberpunk Neon Portrait",
    description: "Portrait with neon lighting and digital effects",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Digital Art",
    likes: 1967,
    downloads: 845,
    userName: "Marcus Kim",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    recipe: "Cyberpunk Portrait",
    featured: false
  },
  {
    id: 4,
    title: "Liquid Metal Texture",
    description: "Abstract flowing metallic composition",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Digital Art",
    likes: 1456,
    downloads: 672,
    userName: "Emma Thompson",
    userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    recipe: "Abstract Art Generator",
    featured: false
  },
  {
    id: 5,
    title: "Geometric Architecture",
    description: "Modern architectural visualization",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Marketing",
    likes: 2134,
    downloads: 987,
    userName: "David Park",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    recipe: "Product Showcase",
    featured: false
  },
  {
    id: 6,
    title: "Surreal Dreamscape",
    description: "Otherworldly landscape with floating elements",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Digital Art",
    likes: 3892,
    downloads: 2145,
    userName: "Luna Zhang",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    recipe: "Abstract Art Generator",
    featured: true
  }
];

export default function Gallery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<typeof SAMPLE_GALLERY[0] | null>(null);

  const { data: recipes } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes"],
  });

  const categories = [
    { value: "all", label: "All" },
    { value: "featured", label: "Featured" },
    { value: "Digital Art", label: "Digital Art" },
    { value: "Social Media", label: "Social Media" },
    { value: "Marketing", label: "Marketing" },
  ];

  const filteredGallery = SAMPLE_GALLERY.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
                           (selectedCategory === "featured" && item.featured) ||
                           item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleUseRecipe = (recipeName: string) => {
    // Find recipe and redirect to home with selection
    window.location.href = `/?recipe=${encodeURIComponent(recipeName)}`;
  };

  return (
    <div className="min-h-screen bg-dark">
      <Navigation />
      
      <main className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Community
              <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
                {" "}Gallery
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover amazing content created by our community using MagicVidio recipes. Get inspired and use the same recipes for your projects.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search by title, description, or creator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card-bg border-gray-600 focus:border-accent-blue"
              />
            </div>
            <Button variant="outline" className="border-gray-600 hover:bg-gray-800">
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
            </Button>
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
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

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredGallery.map((item) => (
              <Card key={item.id} className="bg-card-bg border-gray-700 overflow-hidden group hover:border-gray-600 transition-all">
                <div className="relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.featured && (
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-accent-blue to-accent-purple">
                      Featured
                    </Badge>
                  )}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={item.userAvatar}
                      alt={item.userName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium">{item.userName}</p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{item.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{item.likes.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="h-4 w-4" />
                        <span>{item.downloads.toLocaleString()}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {item.recipe}
                    </Badge>
                    <Button
                      onClick={() => handleUseRecipe(item.recipe)}
                      size="sm"
                      className="bg-gradient-to-r from-accent-blue to-accent-purple hover:shadow-lg transition-all"
                    >
                      <Wand2 className="mr-2 h-3 w-3" />
                      Use Recipe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredGallery.length === 0 && (
            <div className="text-center py-16">
              <Search className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search terms or category filter
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                variant="outline"
                className="border-gray-600"
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Community Stats */}
          <div className="bg-card-bg rounded-xl p-8 mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Community Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-blue mb-2">12,847</div>
                <p className="text-gray-400">Content Created</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-purple mb-2">2,384</div>
                <p className="text-gray-400">Active Creators</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-success-green mb-2">89,234</div>
                <p className="text-gray-400">Downloads</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">156,789</div>
                <p className="text-gray-400">Community Likes</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center py-16 border-t border-gray-800">
            <h2 className="text-3xl font-bold mb-4">Join Our Creative Community</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Start creating amazing content today and share it with thousands of other creators
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.location.href = "/"}
                className="bg-gradient-to-r from-accent-blue to-accent-purple px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all"
              >
                Start Creating
              </Button>
              <Button
                onClick={() => window.location.href = "/dashboard"}
                variant="outline"
                className="border-gray-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all"
              >
                View My Work
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}