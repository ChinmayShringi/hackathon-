import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navigation from "@/components/navigation";
import { 
  Plus, 
  Trash2, 
  DollarSign, 
  Eye, 
  EyeOff, 
  Share2, 
  AlertTriangle,
  Wand2,
  Image,
  Video,
  Clock,

} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface RecipeStep {
  id: string;
  type: 'text_prompt' | 'image_generation' | 'video_generation';
  config: {
    prompt?: string;
    variables?: string[];
    imageSize?: string;
    videoDuration?: number;
    aspectRatio?: string;
  };
}

export default function CreateRecipe() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [recipeData, setRecipeData] = useState({
    name: '',
    description: '',
    category: '',
    creditCost: 5,
    isPublic: false,
    hasContentRestrictions: true,
    revenueShareEnabled: true,
    revenueSharePercentage: 20,
    generationType: 'image' as 'image' | 'video'
  });

  const [recipeSteps, setRecipeSteps] = useState<RecipeStep[]>([
    {
      id: '1',
      type: 'text_prompt',
      config: {
        prompt: '',
        variables: []
      }
    }
  ]);

  const [newVariable, setNewVariable] = useState('');

  const createRecipeMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Recipe Created",
        description: "Your recipe has been created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/recipes'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addStep = (type: RecipeStep['type']) => {
    const newStep: RecipeStep = {
      id: Date.now().toString(),
      type,
      config: type === 'video_generation' ? { videoDuration: 5 } : {}
    };
    setRecipeSteps([...recipeSteps, newStep]);
  };

  const removeStep = (id: string) => {
    setRecipeSteps(recipeSteps.filter(step => step.id !== id));
  };

  const updateStep = (id: string, config: Partial<RecipeStep['config']>) => {
    setRecipeSteps(recipeSteps.map(step => 
      step.id === id 
        ? { ...step, config: { ...step.config, ...config } }
        : step
    ));
  };

  const addVariable = (stepId: string) => {
    if (!newVariable.trim()) return;
    
    const step = recipeSteps.find(s => s.id === stepId);
    if (step) {
      const variables = step.config.variables || [];
      updateStep(stepId, { 
        variables: [...variables, newVariable.trim().toUpperCase()]
      });
    }
    setNewVariable('');
  };

  const removeVariable = (stepId: string, variable: string) => {
    const step = recipeSteps.find(s => s.id === stepId);
    if (step) {
      const variables = (step.config.variables || []).filter(v => v !== variable);
      updateStep(stepId, { variables });
    }
  };

  const handleSubmit = () => {
    if (!recipeData.name || !recipeData.description || recipeSteps.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and add at least one step.",
        variant: "destructive",
      });
      return;
    }

    // Generate slug from name
    const slug = recipeData.name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    // Create the final prompt from steps
    const textSteps = recipeSteps.filter(step => step.type === 'text_prompt');
    const prompt = textSteps.map(step => step.config.prompt).join('\n\n');

    const recipePayload = {
      ...recipeData,
      slug,
      prompt,
      instructions: `Recipe with ${recipeSteps.length} steps. Variables: ${
        recipeSteps.flatMap(s => s.config.variables || []).join(', ')
      }`,
      recipeSteps: recipeSteps,
      referralCode: Math.random().toString(36).substring(2, 12).toUpperCase()
    };

    createRecipeMutation.mutate(recipePayload);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark text-white flex items-center justify-center">
        <Card className="bg-gray-800 border-gray-700 p-8">
          <CardHeader className="text-center">
            <CardTitle>Sign In Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-400 mb-4">Please sign in to create recipes</p>
                            <Button onClick={() => window.location.href = '/api/auth/user'}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white">
      <Navigation />
      <div className="max-w-4xl mx-auto px-6 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Recipe</h1>
          <p className="text-gray-400">
            Build a step-by-step content generation recipe and earn 20% revenue share from paid usage
          </p>
        </div>

        {/* Revenue Share Info */}
        <Alert className="mb-6 bg-green-500/10 border-green-500/20">
          <DollarSign className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-400">
            <strong>Revenue Sharing:</strong> Earn 20% of credits when others use your recipe with paid credits. 
            Free daily credits don't generate revenue to prevent abuse.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recipe Configuration */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Recipe Name *</Label>
                  <Input
                    id="name"
                    value={recipeData.name}
                    onChange={(e) => setRecipeData({...recipeData, name: e.target.value})}
                    placeholder="Epic Fantasy Portrait"
                    className="bg-gray-900 border-gray-600"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={recipeData.description}
                    onChange={(e) => setRecipeData({...recipeData, description: e.target.value})}
                    placeholder="Create stunning fantasy portraits with magical lighting and ethereal effects"
                    className="bg-gray-900 border-gray-600"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={recipeData.category} onValueChange={(value) => setRecipeData({...recipeData, category: value})}>
                      <SelectTrigger className="bg-gray-900 border-gray-600">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Digital Art">Digital Art</SelectItem>
                        <SelectItem value="Photography">Photography</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Social Media">Social Media</SelectItem>
                        <SelectItem value="Video Animation">Video Animation</SelectItem>
                        <SelectItem value="Video Product">Video Product</SelectItem>
                        <SelectItem value="Video Text">Video Text</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="credits">Credit Cost</Label>
                    <Input
                      id="credits"
                      type="number"
                      min="1"
                      max="50"
                      value={recipeData.creditCost}
                      onChange={(e) => setRecipeData({...recipeData, creditCost: parseInt(e.target.value)})}
                      className="bg-gray-900 border-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <Label>Generation Type</Label>
                  <div className="flex gap-4 mt-2">
                    <Button
                      variant={recipeData.generationType === 'image' ? 'default' : 'outline'}
                      onClick={() => setRecipeData({...recipeData, generationType: 'image'})}
                      className="flex items-center gap-2"
                    >
                      <Image className="h-4 w-4" />
                      Image
                    </Button>
                    <Button
                      variant={recipeData.generationType === 'video' ? 'default' : 'outline'}
                      onClick={() => setRecipeData({...recipeData, generationType: 'video'})}
                      className="flex items-center gap-2"
                    >
                      <Video className="h-4 w-4" />
                      Video
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recipe Steps */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>Recipe Steps</CardTitle>
                <p className="text-sm text-gray-400">
                  Build your recipe step by step. Use variables like [SUBJECT], [STYLE], [COLOR] for customization.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {recipeSteps.map((step, index) => (
                  <div key={step.id} className="border border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Step {index + 1}</Badge>
                        <span className="text-sm text-gray-400 capitalize">
                          {step.type.replace('_', ' ')}
                        </span>
                      </div>
                      {recipeSteps.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStep(step.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {step.type === 'text_prompt' && (
                      <div className="space-y-3">
                        <div>
                          <Label>Prompt Text</Label>
                          <Textarea
                            value={step.config.prompt || ''}
                            onChange={(e) => updateStep(step.id, { prompt: e.target.value })}
                            placeholder="A [STYLE] portrait of [SUBJECT] with [LIGHTING] lighting..."
                            className="bg-gray-900 border-gray-600"
                            rows={3}
                          />
                        </div>

                        <div>
                          <Label>Variables</Label>
                          <div className="flex gap-2 mb-2">
                            <Input
                              value={newVariable}
                              onChange={(e) => setNewVariable(e.target.value)}
                              placeholder="SUBJECT"
                              className="bg-gray-900 border-gray-600"
                              onKeyPress={(e) => e.key === 'Enter' && addVariable(step.id)}
                            />
                            <Button onClick={() => addVariable(step.id)} size="sm">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {(step.config.variables || []).map((variable) => (
                              <Badge key={variable} variant="secondary" className="flex items-center gap-1">
                                [{variable}]
                                <button onClick={() => removeVariable(step.id, variable)}>
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {step.type === 'image_generation' && (
                      <div className="space-y-3">
                        <div>
                          <Label>Image Size</Label>
                          <Select 
                            value={step.config.imageSize || ''} 
                            onValueChange={(value) => updateStep(step.id, { imageSize: value })}
                          >
                            <SelectTrigger className="bg-gray-900 border-gray-600">
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="square_hd">Square HD (1024x1024)</SelectItem>
                              <SelectItem value="portrait_4_3">Portrait 4:3</SelectItem>
                              <SelectItem value="portrait_16_9">Portrait 16:9</SelectItem>
                              <SelectItem value="landscape_4_3">Landscape 4:3</SelectItem>
                              <SelectItem value="landscape_16_9">Landscape 16:9</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {step.type === 'video_generation' && (
                      <div className="space-y-3">
                        <div>
                          <Label>Duration (seconds)</Label>
                          <Input
                            type="number"
                            min="2"
                            max="30"
                            value={step.config.videoDuration || 5}
                            onChange={(e) => updateStep(step.id, { videoDuration: parseInt(e.target.value) })}
                            className="bg-gray-900 border-gray-600"
                          />
                        </div>
                        <div>
                          <Label>Aspect Ratio</Label>
                          <Select 
                            value={step.config.aspectRatio || '16:9'} 
                            onValueChange={(value) => updateStep(step.id, { aspectRatio: value })}
                          >
                            <SelectTrigger className="bg-gray-900 border-gray-600">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                              <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                              <SelectItem value="1:1">1:1 (Square)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex gap-2">
                  <Button onClick={() => addStep('text_prompt')} variant="outline" size="sm">
                    <Wand2 className="h-4 w-4 mr-2" />
                    Text Prompt
                  </Button>
                  <Button onClick={() => addStep('image_generation')} variant="outline" size="sm">
                    <Image className="h-4 w-4 mr-2" />
                    Image Step
                  </Button>
                  <Button onClick={() => addStep('video_generation')} variant="outline" size="sm">
                    <Video className="h-4 w-4 mr-2" />
                    Video Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>Visibility & Revenue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Public Recipe</Label>
                    <p className="text-xs text-gray-400">Visible in gallery</p>
                  </div>
                  <Switch
                    checked={recipeData.isPublic}
                    onCheckedChange={(checked) => setRecipeData({...recipeData, isPublic: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Revenue Share</Label>
                    <p className="text-xs text-gray-400">Earn 20% from paid usage</p>
                  </div>
                  <Switch
                    checked={recipeData.revenueShareEnabled}
                    onCheckedChange={(checked) => setRecipeData({...recipeData, revenueShareEnabled: checked})}
                  />
                </div>

                <Separator />

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <Label>Content Restrictions</Label>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="contentRestrictions"
                        checked={recipeData.hasContentRestrictions}
                        onChange={() => setRecipeData({...recipeData, hasContentRestrictions: true})}
                        className="text-blue-500"
                      />
                      <span className="text-sm">Safe Content Only</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="contentRestrictions"
                        checked={!recipeData.hasContentRestrictions}
                        onChange={() => setRecipeData({...recipeData, hasContentRestrictions: false, isPublic: false})}
                        className="text-blue-500"
                      />
                      <span className="text-sm">No Restrictions</span>
                    </label>
                  </div>
                  {!recipeData.hasContentRestrictions && (
                    <Alert className="mt-2 bg-yellow-500/10 border-yellow-500/20">
                      <AlertDescription className="text-xs text-yellow-400">
                        Unrestricted recipes cannot be made public and are only accessible via direct referral link.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleSubmit} 
              disabled={createRecipeMutation.isPending}
              className="w-full bg-gradient-to-r from-accent-blue to-accent-purple"
            >
              {createRecipeMutation.isPending ? 'Creating...' : 'Create Recipe'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}