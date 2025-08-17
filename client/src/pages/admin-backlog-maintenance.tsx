import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, LogOut, Search, Filter, Database, CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import GenerationPreviewCard from '@/components/generation-preview-card';

interface AdminStatus {
  isAuthenticated: boolean;
  username: string | null;
}

interface RecipeBacklogStatus {
  recipeId: number;
  recipeName: string;
  currentBacklogCount: number;
  requiredCount: number;
  needsGeneration: boolean;
  generationsToCreate: number;
}

interface BacklogStatistics {
  totalRecipes: number;
  recipesWithSufficientBacklog: number;
  recipesNeedingBacklog: number;
  totalBacklogVideos: number;
  totalNeeded: number;
  minimumRequired: number;
  recipeDetails: RecipeBacklogStatus[];
}

interface Generation {
  id: number;
  shortId?: string;
  recipeId?: number;
  recipeTitle: string;
  prompt: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  imageUrl?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  metadata?: any;
}

type SortOption = 'name-asc' | 'name-desc' | 'id-asc' | 'id-desc' | 'ready-asc' | 'ready-desc';

export default function AdminBacklogMaintenance() {
  const [, setLocation] = useLocation();
  const [adminStatus, setAdminStatus] = useState<AdminStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statistics, setStatistics] = useState<BacklogStatistics | null>(null);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [expandedRecipes, setExpandedRecipes] = useState<Set<number>>(new Set());

  useEffect(() => {
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (adminStatus?.isAuthenticated) {
      fetchBacklogData();
    }
  }, [adminStatus]);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/admin/status');
      const data = await response.json();
      
      if (response.ok) {
        setAdminStatus(data);
        if (!data.isAuthenticated) {
          setLocation('/admin/login');
        }
      } else {
        setLocation('/admin/login');
      }
    } catch (error) {
      setLocation('/admin/login');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBacklogData = async () => {
    try {
      // Fetch statistics
      const statsResponse = await fetch('/api/admin/backlog-maintenance');
      const statsData = await statsResponse.json();
      
      if (statsResponse.ok) {
        setStatistics(statsData);
      }

      // Fetch generations
      const gensResponse = await fetch('/api/admin/backlog-maintenance/generations');
      const gensData = await gensResponse.json();
      
      if (gensResponse.ok) {
        setGenerations(gensData.generations || []);
      }
    } catch (error) {
      console.error('Error fetching backlog data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setLocation('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleViewGeneration = (generation: Generation) => {
    if (generation.shortId) {
      const isAlphaSite = import.meta.env.VITE_SITE_DEPLOYMENT_TYPE === 'alpha';
      const route = isAlphaSite ? `/alpha/m/${generation.shortId}` : `/asset-viewer/${generation.id}`;
      window.open(route, '_blank');
    }
  };

  const toggleRecipeExpansion = (recipeId: number) => {
    setExpandedRecipes(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(recipeId)) {
        newExpanded.delete(recipeId);
      } else {
        newExpanded.add(recipeId);
      }
      return newExpanded;
    });
  };

  // Filter and sort recipes
  const filteredAndSortedRecipes = statistics?.recipeDetails
    ?.filter(recipe => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        recipe.recipeName.toLowerCase().includes(searchLower) ||
        recipe.recipeId.toString().includes(searchLower)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.recipeName.localeCompare(b.recipeName);
        case 'name-desc':
          return b.recipeName.localeCompare(a.recipeName);
        case 'id-asc':
          return a.recipeId - b.recipeId;
        case 'id-desc':
          return b.recipeId - a.recipeId;
        case 'ready-asc':
          return a.currentBacklogCount - b.currentBacklogCount;
        case 'ready-desc':
          return b.currentBacklogCount - a.currentBacklogCount;
        default:
          return 0;
      }
    }) || [];

  // Group generations by recipe
  const generationsByRecipe = generations.reduce((acc, gen) => {
    const recipeId = gen.recipeId || 0; // Use 0 as fallback for missing recipeId
    if (!acc[recipeId]) {
      acc[recipeId] = [];
    }
    acc[recipeId].push(gen);
    return acc;
  }, {} as Record<number, Generation[]>);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!adminStatus?.isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/admin')}
                className="text-gray-300 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
              <div className="flex items-center space-x-2">
                <Database className="w-6 h-6 text-blue-400" />
                <h1 className="text-xl font-bold text-white">Backlog Maintenance</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchBacklogData}
                className="text-gray-300 border-gray-600 hover:bg-gray-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <div className="text-sm text-gray-300">
                Logged in as <span className="font-semibold text-blue-400">{adminStatus.username}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-gray-300 border-gray-600 hover:bg-gray-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Overview */}
        {statistics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-400">{statistics.totalRecipes}</div>
                <div className="text-sm text-gray-400">Total Recipes</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-400">{statistics.recipesWithSufficientBacklog}</div>
                <div className="text-sm text-gray-400">Sufficient Backlog</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-400">{statistics.recipesNeedingBacklog}</div>
                <div className="text-sm text-gray-400">Need Backlog</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-400">{statistics.totalBacklogVideos}</div>
                <div className="text-sm text-gray-400">Total Backlog Videos</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by recipe name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="id-asc">ID (Low-High)</SelectItem>
                    <SelectItem value="id-desc">ID (High-Low)</SelectItem>
                    <SelectItem value="ready-asc">Ready (Low-High)</SelectItem>
                    <SelectItem value="ready-desc">Ready (High-Low)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recipe Fulfillment List */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recipe Fulfillment Status</CardTitle>
            <CardDescription className="text-gray-400">
              Shows current backlog status for each recipe. Minimum required: {statistics?.minimumRequired || 3}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="space-y-2">
              {filteredAndSortedRecipes.map((recipe) => {
                const recipeGenerations = generationsByRecipe[recipe.recipeId] || [];
                const isExpanded = expandedRecipes.has(recipe.recipeId);
                
                return (
                  <AccordionItem 
                    key={recipe.recipeId} 
                    value={recipe.recipeId.toString()}
                    className="border-gray-700 bg-gray-700/50 rounded-lg"
                  >
                    <AccordionTrigger 
                      className="px-4 py-3 hover:bg-gray-600/50 rounded-lg text-white"
                      onClick={() => toggleRecipeExpansion(recipe.recipeId)}
                    >
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {recipe.needsGeneration ? (
                              <AlertCircle className="w-5 h-5 text-yellow-500" />
                            ) : (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                            <span className="font-medium">{recipe.recipeName}</span>
                            <Badge variant="outline" className="text-xs">
                              ID: {recipe.recipeId}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge 
                            variant={recipe.needsGeneration ? "destructive" : "default"}
                            className="text-sm"
                          >
                            {recipe.currentBacklogCount}/{recipe.requiredCount} Ready
                          </Badge>
                          {recipe.needsGeneration && (
                            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                              Needs {recipe.generationsToCreate} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      {recipeGenerations.length > 0 ? (
                        <div className="space-y-3 mt-4">
                          <div className="text-sm text-gray-400 mb-2">
                            {recipeGenerations.length} generation{recipeGenerations.length !== 1 ? 's' : ''} in backlog
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recipeGenerations.map((generation) => (
                              <GenerationPreviewCard
                                key={generation.id}
                                generation={generation}
                                onView={handleViewGeneration}
                                compact={true}
                              />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No generations found for this recipe</p>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>

            {filteredAndSortedRecipes.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No recipes found</p>
                <p className="text-sm">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 