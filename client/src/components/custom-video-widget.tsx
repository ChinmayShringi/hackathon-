import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  FileVideo, 
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  RotateCcw
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface VideoCreationStep {
  id: number;
  description: string;
  timestamp: number;
  status: 'pending' | 'generating' | 'completed';
  keyframeUrl?: string;
}

interface VideoCreationState {
  phase: 'input' | 'script-generation' | 'approval' | 'keyframe-generation' | 'assembly' | 'complete';
  prompt: string;
  duration: number;
  uploadedFile?: File;
  autoApprove: boolean;
  script: VideoCreationStep[];
  progress: number;
  finalVideoUrl?: string;
  generationId?: string;
}

export default function CustomVideoWidget() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [state, setState] = useState<VideoCreationState>({
    phase: 'input',
    prompt: '',
    duration: 10,
    autoApprove: false,
    script: [],
    progress: 0
  });

  const createVideoMutation = useMutation({
    mutationFn: async (data: { prompt: string; duration: number; file?: File }) => {
      const formData = new FormData();
      formData.append('prompt', data.prompt);
      formData.append('duration', data.duration.toString());
      formData.append('type', 'custom_video');
      if (data.file) {
        formData.append('file', data.file);
      }
      
      const response = await fetch('/api/custom-video/create', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to create video');
      return await response.json();
    },
    onSuccess: (data: any) => {
      setState(prev => ({
        ...prev,
        phase: 'script-generation',
        generationId: data.id,
        progress: 10
      }));
      simulateScriptGeneration();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to start video creation",
        variant: "destructive",
      });
    },
  });

  const simulateScriptGeneration = () => {
    // Simulate AI script generation
    const mockSteps: VideoCreationStep[] = [
      { id: 1, description: "Opening scene: Establish setting and mood", timestamp: 0, status: 'pending' },
      { id: 2, description: "Character introduction and main action begins", timestamp: 2, status: 'pending' },
      { id: 3, description: "Dynamic movement and visual effects", timestamp: 5, status: 'pending' },
      { id: 4, description: "Climactic moment with dramatic lighting", timestamp: 8, status: 'pending' },
      { id: 5, description: "Resolution and final visual impact", timestamp: state.duration - 2, status: 'pending' }
    ];

    setState(prev => ({ ...prev, script: mockSteps, progress: 25 }));

    // Simulate progressive script generation
    mockSteps.forEach((step, index) => {
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          script: prev.script.map(s => 
            s.id === step.id ? { ...s, status: 'completed' } : s
          ),
          progress: 25 + (index + 1) * 10
        }));
        
        if (index === mockSteps.length - 1) {
          setTimeout(() => {
            setState(prev => ({
              ...prev,
              phase: state.autoApprove ? 'keyframe-generation' : 'approval',
              progress: 75
            }));
            
            if (state.autoApprove) {
              startKeyframeGeneration();
            }
          }, 1000);
        }
      }, (index + 1) * 1500);
    });
  };

  const approveScript = () => {
    setState(prev => ({ ...prev, phase: 'keyframe-generation', progress: 75 }));
    startKeyframeGeneration();
  };

  const startKeyframeGeneration = () => {
    // Simulate keyframe generation for each step
    state.script.forEach((step, index) => {
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          script: prev.script.map(s => 
            s.id === step.id 
              ? { ...s, status: 'generating', keyframeUrl: `https://picsum.photos/400/300?random=${s.id}` }
              : s
          ),
          progress: 75 + (index + 1) * 3
        }));

        setTimeout(() => {
          setState(prev => ({
            ...prev,
            script: prev.script.map(s => 
              s.id === step.id ? { ...s, status: 'completed' } : s
            )
          }));

          if (index === state.script.length - 1) {
            setTimeout(() => {
              setState(prev => ({ ...prev, phase: 'assembly', progress: 90 }));
              assembleVideo();
            }, 1000);
          }
        }, 2000);
      }, index * 3000);
    });
  };

  const assembleVideo = () => {
    // Simulate video assembly
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        phase: 'complete',
        progress: 100,
        finalVideoUrl: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`
      }));
    }, 3000);
  };

  const resetWidget = () => {
    setState({
      phase: 'input',
      prompt: '',
      duration: 10,
      autoApprove: false,
      script: [],
      progress: 0
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setState(prev => ({ ...prev, uploadedFile: file }));
    }
  };

  const handleSubmit = () => {
    if (!state.prompt.trim()) {
      toast({
        title: "Error",
        description: "Please provide a prompt for your video",
        variant: "destructive",
      });
      return;
    }

    createVideoMutation.mutate({
      prompt: state.prompt,
      duration: state.duration,
      file: state.uploadedFile
    });
  };

  if (state.phase === 'input') {
    return (
      <Card className="bg-card-bg border-card-border">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <FileVideo className="h-6 w-6" />
            Custom Video Creator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Describe your video
            </label>
            <Textarea
              placeholder="Describe the video you want to create. Be as detailed as possible about the scenes, actions, and visual style..."
              value={state.prompt}
              onChange={(e) => setState(prev => ({ ...prev, prompt: e.target.value }))}
              className="min-h-[100px] bg-bg-primary border-card-border text-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Upload reference image or video (optional)
            </label>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Choose File
              </Button>
              {state.uploadedFile && (
                <span className="text-sm text-gray-400">
                  {state.uploadedFile.name}
                </span>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Duration: {state.duration} seconds
            </label>
            <Slider
              value={[state.duration]}
              onValueChange={(value) => setState(prev => ({ ...prev, duration: value[0] }))}
              min={2}
              max={60}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>2s</span>
              <span>60s</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="auto-approve"
              checked={state.autoApprove}
              onCheckedChange={(checked) => 
                setState(prev => ({ ...prev, autoApprove: checked as boolean }))
              }
            />
            <label htmlFor="auto-approve" className="text-sm text-gray-300">
              Auto-approve generated script
            </label>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={createVideoMutation.isPending || !state.prompt.trim()}
            className="w-full bg-gradient-to-r from-accent-blue to-accent-purple hover:shadow-lg"
          >
            {createVideoMutation.isPending ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                🍳 Start Cooking
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (state.phase === 'script-generation') {
    return (
      <Card className="bg-card-bg border-card-border">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            Generating Video Script
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={state.progress} className="w-full" />
          
          <div className="space-y-3">
            {state.script.map((step) => (
              <div key={step.id} className="flex items-center gap-3 p-3 rounded-lg bg-bg-primary">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {step.status === 'pending' ? (
                    <Clock className="h-4 w-4 text-gray-500 animate-pulse" />
                  ) : step.status === 'generating' ? (
                    <Clock className="h-4 w-4 text-yellow-500 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {step.timestamp}s
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (state.phase === 'approval') {
    return (
      <Card className="bg-card-bg border-card-border">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <CheckCircle className="h-6 w-6" />
            Review & Approve Script
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {state.script.map((step) => (
              <div key={step.id} className="flex items-center gap-3 p-3 rounded-lg bg-bg-primary border border-green-500/20">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {step.timestamp}s
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={approveScript}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve & Continue
            </Button>
            <Button
              variant="outline"
              onClick={resetWidget}
              className="flex-1"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Start Over
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (state.phase === 'keyframe-generation') {
    return (
      <Card className="bg-card-bg border-card-border">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <ImageIcon className="h-6 w-6" />
            Generating Keyframes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={state.progress} className="w-full" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.script.map((step) => (
              <div key={step.id} className="p-3 rounded-lg bg-bg-primary border border-card-border">
                <div className="flex items-center gap-2 mb-2">
                  {step.status === 'generating' ? (
                    <Clock className="h-4 w-4 text-yellow-500 animate-spin" />
                  ) : step.status === 'completed' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Clock className="h-4 w-4 text-gray-500" />
                  )}
                  <Badge variant="outline" className="text-xs">
                    {step.timestamp}s
                  </Badge>
                </div>
                
                {step.keyframeUrl ? (
                  <img 
                    src={step.keyframeUrl} 
                    alt={`Keyframe ${step.id}`}
                    className="w-full h-24 object-cover rounded mb-2"
                  />
                ) : (
                  <div className="w-full h-24 bg-gray-700 rounded mb-2 flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-gray-500" />
                  </div>
                )}
                
                <p className="text-xs text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (state.phase === 'assembly') {
    return (
      <Card className="bg-card-bg border-card-border">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <FileVideo className="h-6 w-6" />
            Assembling Video
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent-blue border-t-transparent mx-auto mb-4"></div>
            <Progress value={state.progress} className="w-full mb-4" />
            <p className="text-gray-300">Combining keyframes into final video...</p>
            <p className="text-sm text-gray-500">This may take a few moments</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (state.phase === 'complete') {
    return (
      <Card className="bg-card-bg border-card-border">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            Video Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <video 
              controls 
              className="w-full max-w-md mx-auto rounded-lg"
              poster="https://picsum.photos/400/300?random=preview"
            >
              <source src={state.finalVideoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1 bg-green-600 hover:bg-green-700">
              <ArrowRight className="h-4 w-4 mr-2" />
              Save to Gallery
            </Button>
            <Button
              variant="outline"
              onClick={resetWidget}
              className="flex-1"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Create Another
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}