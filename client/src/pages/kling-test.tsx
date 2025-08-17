import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, Download, Copy, Check, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DevAuth } from '@/components/dev-auth';

interface KlingGenerationResult {
    success: boolean;
    video?: {
        url?: string;
        duration?: number;
        size?: number;
        file_size?: number;
        file_name?: string;
        content_type?: string;
        video?: {
            url?: string;
            duration?: number;
            size?: number;
            file_size?: number;
            file_name?: string;
            content_type?: string;
        };
    };
    mmaudioVideo?: {
        url?: string;
        duration?: number;
        size?: number;
        file_size?: number;
        file_name?: string;
        content_type?: string;
    };
    baseImage?: {
        url: string;
    };
    workflow?: string;
    message?: string;
    error?: string;
    mmaudioUsed?: boolean;
}

interface Recipe {
    id: number;
    name: string;
    slug: string;
    description: string;
    prompt: string;
    recipeSteps: any[];
}

function KlingTestContent() {
    const [prompt, setPrompt] = useState('A majestic eagle soaring through mountain peaks at golden hour, cinematic lighting, smooth motion');
    const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1'>('9:16');
    const [duration, setDuration] = useState('8s');
    const [generateAudio, setGenerateAudio] = useState(true);
    const [useMMAudio, setUseMMAudio] = useState(true);
    const [seed, setSeed] = useState<number | undefined>(undefined);
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<KlingGenerationResult | null>(null);
    const [copied, setCopied] = useState(false);
    const [workflowType, setWorkflowType] = useState<'direct' | 'enhanced'>('direct');

    // Recipe testing
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [recipeFormData, setRecipeFormData] = useState<Record<string, any>>({});
    const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);

    const { toast } = useToast();

    // Load available recipes
    useEffect(() => {
        loadRecipes();
    }, []);

    const loadRecipes = async () => {
        setIsLoadingRecipes(true);
        try {
            const response = await fetch('/api/recipes');
            if (response.ok) {
                const data = await response.json();
                setRecipes(data);
            }
        } catch (error) {
            console.error('Failed to load recipes:', error);
        } finally {
            setIsLoadingRecipes(false);
        }
    };

    const handleRecipeSelect = (recipe: Recipe) => {
        setSelectedRecipe(recipe);
        setRecipeFormData({});

        // Initialize form data with default values
        const defaultData: Record<string, any> = {};
        if (recipe.recipeSteps) {
            recipe.recipeSteps.forEach((step: any) => {
                if (step.defaultValue) {
                    defaultData[step.id] = step.defaultValue;
                } else if (step.options && step.options.length > 0) {
                    defaultData[step.id] = step.options[0].value;
                }
            });
        }
        setRecipeFormData(defaultData);
    };

    const handleRecipeFormChange = (fieldId: string, value: any) => {
        setRecipeFormData(prev => ({
            ...prev,
            [fieldId]: value
        }));
    };

    const processRecipePrompt = async () => {
        if (!selectedRecipe) return;

        try {
            const response = await fetch('/api/recipes/process-prompt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recipeId: selectedRecipe.id,
                    formData: recipeFormData
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setPrompt(data.prompt);
                toast({
                    title: "Recipe Processed",
                    description: "Recipe prompt has been processed and loaded",
                });
            } else {
                toast({
                    title: "Error",
                    description: "Failed to process recipe prompt",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to process recipe prompt",
                variant: "destructive",
            });
        }
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            toast({
                title: "Error",
                description: "Please enter a prompt",
                variant: "destructive",
            });
            return;
        }

        setIsGenerating(true);
        setResult(null);

        try {
            let response;

            if (workflowType === 'enhanced') {
                // Use enhanced workflow: Flux Dev → Kling AI 2.1 → MMAudio
                response = await fetch('/api/video/enhanced-kling-generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        prompt: prompt.trim(),
                        style: "cinematic",
                        imageOptions: {},
                        useMMAudio: useMMAudio
                    }),
                });
            } else {
                // Use direct text-to-video with Kling AI 2.1
                response = await fetch('/api/video/kling-generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        prompt: prompt.trim(),
                        aspect_ratio: aspectRatio,
                        duration,
                        generate_audio: generateAudio,
                        seed: seed || undefined,
                    }),
                });
            }

            const data = await response.json();

            if (response.ok) {
                setResult(data);
                toast({
                    title: "Success",
                    description: `Video generated successfully using ${workflowType === 'enhanced' ? 'enhanced workflow' : 'direct Kling AI 2.1'}!`,
                });
            } else {
                setResult({
                    success: false,
                    error: data.message || 'Generation failed',
                });
                toast({
                    title: "Error",
                    description: data.message || 'Generation failed',
                    variant: "destructive",
                });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Network error';
            setResult({
                success: false,
                error: errorMessage,
            });
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleTestGenerate = async () => {
        setIsGenerating(true);
        setResult(null);

        try {
            let response;

            if (workflowType === 'enhanced') {
                response = await fetch('/api/video/test-enhanced-kling');
            } else {
                response = await fetch('/api/video/test-kling');
            }

            const data = await response.json();

            if (response.ok) {
                setResult(data);
                toast({
                    title: "Success",
                    description: `Test video generated successfully using ${workflowType === 'enhanced' ? 'enhanced workflow' : 'direct Kling AI 2.1'}!`,
                });
            } else {
                setResult({
                    success: false,
                    error: data.message || 'Test generation failed',
                });
                toast({
                    title: "Error",
                    description: data.message || 'Test generation failed',
                    variant: "destructive",
                });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Network error';
            setResult({
                success: false,
                error: errorMessage,
            });
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast({
                title: "Copied",
                description: "Prompt copied to clipboard",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to copy to clipboard",
                variant: "destructive",
            });
        }
    };

    const downloadVideo = async (url: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `kling-video-${Date.now()}.mp4`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(downloadUrl);
            toast({
                title: "Downloaded",
                description: "Video downloaded successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to download video",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Kling AI 2.1 Video Generation Test</h1>
                <p className="text-muted-foreground">
                    Test the latest Kling AI 2.1 model for text-to-video generation via FAL API
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recipe Selector */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Recipe Testing
                        </CardTitle>
                        <CardDescription>
                            Load and test existing recipes with Kling AI 2.1
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Select Recipe</Label>
                            <Select
                                value={selectedRecipe?.slug || ''}
                                onValueChange={(slug) => {
                                    const recipe = recipes.find(r => r.slug === slug);
                                    if (recipe) handleRecipeSelect(recipe);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a recipe..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {recipes.map((recipe) => (
                                        <SelectItem key={recipe.slug} value={recipe.slug}>
                                            {recipe.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedRecipe && (
                            <div className="space-y-4">
                                <div className="text-sm">
                                    <strong>{selectedRecipe.name}</strong>
                                    <p className="text-muted-foreground mt-1">{selectedRecipe.description}</p>
                                </div>

                                {/* Recipe Form Fields */}
                                {selectedRecipe.recipeSteps && selectedRecipe.recipeSteps.map((step: any) => (
                                    <div key={step.id} className="space-y-2">
                                        <Label>{step.label}</Label>

                                        {step.type === 'radio' && step.options && (
                                            <div className="space-y-2">
                                                {step.options.map((option: any) => (
                                                    <label key={option.value} className="flex items-center space-x-2">
                                                        <input
                                                            type="radio"
                                                            name={step.id}
                                                            value={option.value}
                                                            checked={recipeFormData[step.id] === option.value}
                                                            onChange={(e) => handleRecipeFormChange(step.id, e.target.value)}
                                                            className="text-blue-600"
                                                        />
                                                        <span className="text-sm">{option.label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}

                                        {step.type === 'dropdown' && step.options && (
                                            <Select
                                                value={recipeFormData[step.id] || ''}
                                                onValueChange={(value) => handleRecipeFormChange(step.id, value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder={`Select ${step.label}...`} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {step.options.map((option: any) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}

                                        {step.type === 'slider' && step.config && (
                                            <div className="space-y-2">
                                                <Slider
                                                    value={[parseInt(recipeFormData[step.id]) || step.config.min || 0]}
                                                    onValueChange={([value]) => handleRecipeFormChange(step.id, value.toString())}
                                                    min={step.config.min || 0}
                                                    max={step.config.max || 100}
                                                    step={step.config.step || 1}
                                                    className="w-full"
                                                />
                                                <div className="text-sm text-muted-foreground">
                                                    {recipeFormData[step.id] || step.config.min || 0}
                                                </div>
                                            </div>
                                        )}

                                        {step.type === 'emoji_button' && step.options && (
                                            <div className="grid grid-cols-2 gap-2">
                                                {step.options.map((option: any) => (
                                                    <button
                                                        key={option.value}
                                                        type="button"
                                                        onClick={() => handleRecipeFormChange(step.id, option.value)}
                                                        className={`p-2 text-center rounded border transition-colors ${recipeFormData[step.id] === option.value
                                                            ? 'bg-blue-600 text-white border-blue-600'
                                                            : 'bg-gray-800 border-gray-600 hover:border-gray-500'
                                                            }`}
                                                    >
                                                        <div className="text-lg">{option.emoji}</div>
                                                        <div className="text-xs mt-1">{option.label}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <Button
                                    onClick={processRecipePrompt}
                                    className="w-full"
                                    variant="outline"
                                >
                                    Process Recipe Prompt
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Generation Controls */}
                <Card>
                    <CardHeader>
                        <CardTitle>Generation Settings</CardTitle>
                        <CardDescription>
                            Configure video generation parameters
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Workflow Type Selection */}
                        <div className="space-y-2">
                            <Label>Workflow Type</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setWorkflowType('direct')}
                                    className={`p-3 text-center rounded border transition-colors ${workflowType === 'direct'
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-gray-800 border-gray-600 hover:border-gray-500'
                                        }`}
                                >
                                    <div className="font-semibold">Direct</div>
                                    <div className="text-xs mt-1">Text → Video (Kling AI 2.1)</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setWorkflowType('enhanced')}
                                    className={`p-3 text-center rounded border transition-colors ${workflowType === 'enhanced'
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-gray-800 border-gray-600 hover:border-gray-500'
                                        }`}
                                >
                                    <div className="font-semibold">Enhanced</div>
                                    <div className="text-xs mt-1">Flux Dev → Kling → MMAudio</div>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="prompt">Prompt</Label>
                            <div className="flex gap-2">
                                <Textarea
                                    id="prompt"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Describe the video you want to generate..."
                                    className="flex-1"
                                    rows={4}
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => copyToClipboard(prompt)}
                                    disabled={!prompt.trim()}
                                >
                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        {workflowType === 'direct' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="duration">Duration</Label>
                                        <Select value={duration} onValueChange={setDuration}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="5s">5 seconds</SelectItem>
                                                <SelectItem value="10s">10 seconds</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="seed">Seed (Optional)</Label>
                                        <Input
                                            id="seed"
                                            type="number"
                                            value={seed || ''}
                                            onChange={(e) => setSeed(e.target.value ? parseInt(e.target.value) : undefined)}
                                            placeholder="Random seed"
                                        />
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="audio"
                                            checked={generateAudio}
                                            onCheckedChange={setGenerateAudio}
                                        />
                                        <Label htmlFor="audio">Generate Audio</Label>
                                    </div>
                                </div>
                            </>
                        )}

                        {workflowType === 'enhanced' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="duration">Duration</Label>
                                        <Select value={duration} onValueChange={setDuration}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="5s">5 seconds</SelectItem>
                                                <SelectItem value="10s">10 seconds</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="seed">Seed (Optional)</Label>
                                        <Input
                                            id="seed"
                                            type="number"
                                            value={seed || ''}
                                            onChange={(e) => setSeed(e.target.value ? parseInt(e.target.value) : undefined)}
                                            placeholder="Random seed"
                                        />
                                    </div>

                                </div>


                            </>
                        )}

                        <div className="flex gap-2">
                            <Button
                                onClick={handleGenerate}
                                disabled={isGenerating || !prompt.trim()}
                                className="flex-1"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Play className="mr-2 h-4 w-4" />
                                        Generate Video
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
                <Card>
                    <CardHeader>
                        <CardTitle>Results</CardTitle>
                        <CardDescription>
                            Generated video and status information
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isGenerating && (
                            <div className="flex items-center justify-center p-8">
                                <div className="text-center">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                                    <p className="text-muted-foreground">
                                        {workflowType === 'enhanced'
                                            ? 'Generating video with enhanced workflow (Flux Dev → Kling AI 2.1 → MMAudio)...'
                                            : 'Generating video with Kling AI 2.1...'
                                        }
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        This may take 60-120 seconds
                                    </p>
                                </div>
                            </div>
                        )}

                        {result && (
                            <div className="space-y-4">
                                {result.success ? (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="default" className="bg-green-500">
                                                Success
                                            </Badge>
                                            <span className="text-sm text-muted-foreground">
                                                {result.message}
                                            </span>
                                        </div>

                                        {(result.video?.url || result.video?.video?.url) && (
                                            <div className="space-y-4">
                                                <video
                                                    controls
                                                    className="w-full rounded-lg border"
                                                    src={result.video?.url || result.video?.video?.url}
                                                >
                                                    Your browser does not support the video tag.
                                                </video>

                                                <div className="flex gap-2">
                                                    <Button
                                                        onClick={() => downloadVideo(result.video?.url || result.video?.video?.url || '')}
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Download
                                                    </Button>
                                                    <Button
                                                        onClick={() => copyToClipboard(result.video?.url || result.video?.video?.url || '')}
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <Copy className="mr-2 h-4 w-4" />
                                                        Copy URL
                                                    </Button>
                                                </div>

                                                <div className="text-sm space-y-1">
                                                    {(result.video?.duration || result.video?.video?.duration) && (
                                                        <p><strong>Duration:</strong> {result.video?.duration || result.video?.video?.duration}s</p>
                                                    )}
                                                    {(result.video?.size || result.video?.video?.size || result.video?.file_size) && (
                                                        <p><strong>Size:</strong> {(((result.video?.size || result.video?.video?.size || result.video?.file_size) || 0) / 1024 / 1024).toFixed(2)} MB</p>
                                                    )}
                                                    {result.workflow && (
                                                        <p><strong>Workflow:</strong> {result.workflow}</p>
                                                    )}
                                                    {result.mmaudioUsed && (
                                                        <p><strong>MMAudio:</strong> <span className="text-green-500">✓ Used (Video with audio attached)</span></p>
                                                    )}
                                                    {workflowType === 'enhanced' && !result.mmaudioUsed && (
                                                        <p><strong>MMAudio:</strong> <span className="text-yellow-500">⚠ Not used (Kling audio available)</span></p>
                                                    )}
                                                    {(result.video?.url || result.video?.video?.url) && (
                                                        <p><strong>Video URL:</strong> <span className="text-xs break-all">{result.video?.url || result.video?.video?.url}</span></p>
                                                    )}
                                                    {result.mmaudioVideo && (
                                                        <p><strong>MMAudio Video:</strong> <span className="text-xs break-all">{result.mmaudioVideo.url}</span></p>
                                                    )}
                                                </div>

                                                {/* Show base image for enhanced workflow */}
                                                {workflowType === 'enhanced' && result.baseImage?.url && (
                                                    <div className="space-y-2">
                                                        <Label>Base Image (Flux Dev)</Label>
                                                        <img
                                                            src={result.baseImage.url}
                                                            alt="Base image"
                                                            className="w-full rounded-lg border"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="space-y-2">
                                        <Badge variant="destructive">Error</Badge>
                                        <p className="text-sm text-red-600">{result.error}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {!isGenerating && !result && (
                            <div className="text-center p-8 text-muted-foreground">
                                <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No video generated yet</p>
                                <p className="text-sm">Enter a prompt and click Generate to start</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Information Panel */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>About Kling AI 2.1</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <h4 className="font-semibold mb-2">Model Information</h4>
                            <ul className="space-y-1 text-muted-foreground">
                                <li>• Latest text-to-video model from Kling AI</li>
                                <li>• High-quality video generation</li>
                                <li>• Supports audio generation</li>
                                <li>• Multiple aspect ratios</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Workflow Options</h4>
                            <ul className="space-y-1 text-muted-foreground">
                                <li>• <strong>Direct:</strong> Text → Video (faster, simpler)</li>
                                <li>• <strong>Enhanced:</strong> Flux Dev → Kling → MMAudio (highest quality)</li>
                                <li>• <strong>Default Settings:</strong> Veo 3 compatible</li>
                                <li>• <strong>Audio:</strong> Optional or MMAudio-generated</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function KlingTest() {
    return (
        <DevAuth>
            <KlingTestContent />
        </DevAuth>
    );
} 