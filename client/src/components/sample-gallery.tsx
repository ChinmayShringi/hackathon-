import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Download, Play, Pause, Eye, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useAuthInterception } from "@/hooks/useAuthInterception";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AuthSignupModal from "@/components/auth-signup-modal";
import { getAspectRatioClass } from '@/lib/videoUtils';

interface SampleGalleryProps {
  recipeId: number;
  recipeType: "image" | "video";
}

interface RecipeSample {
  id: number;
  title?: string;
  description?: string;
  originalPrompt: string;
  thumbnailUrl: string;
  previewUrl: string;
  highResUrl: string;
  type: "image" | "video";
  fileSize: number;
  dimensions: { width: number; height: number; duration?: number };
  downloadCount: number;
  likeCount: number;
  isFeatured: boolean;
  userId: string;
  createdAt: string;
}

interface ExportPricing {
  image: {
    png: { standard: number; hd: number; ultra: number };
    jpg: { standard: number; hd: number; ultra: number };
    webp: { standard: number; hd: number; ultra: number };
  };
  video: {
    mp4: { standard: number; hd: number; ultra: number };
    webm: { standard: number; hd: number; ultra: number };
    gif: { standard: number; hd: number; ultra: number };
  };
}

export default function SampleGallery({ recipeId, recipeType }: SampleGalleryProps) {
  const { user, isAuthenticated } = useAuth();
  const { showSignupModal, recipeName, interceptAction, closeModal } = useAuthInterception();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedSample, setSelectedSample] = useState<RecipeSample | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string>("");
  const [selectedQuality, setSelectedQuality] = useState<string>("hd");
  const [videoPlaying, setVideoPlaying] = useState<Record<number, boolean>>({});

  // Fetch recipe samples
  const { data: samples = [], isLoading } = useQuery({
    queryKey: ["/api/samples/recipe", recipeId],
    queryFn: async () => {
      const response = await fetch(`/api/samples/recipe/${recipeId}`);
      return response.json();
    },
  });

  // Fetch export pricing
  const { data: pricing } = useQuery<ExportPricing>({
    queryKey: ["/api/samples/export/pricing"],
    queryFn: async () => {
      const response = await fetch("/api/samples/export/pricing");
      return response.json();
    },
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: async (sampleId: number) => {
      const response = await fetch(`/api/samples/${sampleId}/like`, { method: "POST" });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/samples/recipe", recipeId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to like sample",
        variant: "destructive",
      });
    }
  });

  // Export purchase mutation
  const exportMutation = useMutation({
    mutationFn: async ({ sampleId, format, quality }: { sampleId: number; format: string; quality: string }) => {
      const response = await fetch(`/api/samples/${sampleId}/export`, {
        method: "POST",
        body: JSON.stringify({ format, quality }),
        headers: { "Content-Type": "application/json" }
      });
      return response.json();
    },
    onSuccess: () => {
      setShowExportDialog(false);
      toast({
        title: "Export Purchased",
        description: "Check your exports in your profile to download.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Export Failed",
        description: "Failed to purchase export. Check your credits.",
        variant: "destructive",
      });
    }
  });

  const handleLike = (sampleId: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to like samples",
        variant: "destructive",
      });
      return;
    }
    likeMutation.mutate(sampleId);
  };

  const handleExport = () => {
    if (!selectedSample || !selectedFormat) return;
    
    const performExport = () => {
      exportMutation.mutate({
        sampleId: selectedSample.id,
        format: selectedFormat,
        quality: selectedQuality
      });
    };

    interceptAction(performExport, `${selectedSample.title || 'sample'} export`);
  };

  const toggleVideoPlayback = (sampleId: number) => {
    setVideoPlaying(prev => ({
      ...prev,
      [sampleId]: !prev[sampleId]
    }));
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFormatOptions = () => {
    if (!pricing) return [];
    return recipeType === "video" 
      ? Object.keys(pricing.video)
      : Object.keys(pricing.image);
  };

  const getPrice = (format: string, quality: string) => {
    if (!pricing) return 0;
    const formatType = recipeType === "video" ? "video" : "image";
    const formatPricing = pricing[formatType] as any;
    return formatPricing[format]?.[quality] || 0;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-card-bg border-gray-700">
            <CardContent className="p-0">
              <div className="aspect-square bg-gray-800 animate-pulse rounded-t-lg" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-700 rounded animate-pulse" />
                <div className="h-3 bg-gray-700 rounded w-2/3 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (samples.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">No samples available yet</div>
        <p className="text-sm text-gray-500">
          Be the first to create and share a sample with this recipe!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {samples.map((sample: RecipeSample) => (
          <Card key={sample.id} className="bg-card-bg border-gray-700 overflow-hidden group hover:border-accent-blue/50 transition-colors">
            <CardContent className="p-0">
              {/* Thumbnail/Preview */}
              <div className={`relative overflow-hidden ${getAspectRatioClass(sample.dimensions.width, sample.dimensions.height)}`}>
                {sample.type === "video" ? (
                  <div className="relative">
                    <video
                      src={sample.previewUrl}
                      poster={sample.thumbnailUrl}
                      className="w-full h-full object-cover"
                      loop
                      onMouseEnter={() => toggleVideoPlayback(sample.id)}
                      onMouseLeave={() => setVideoPlaying(prev => ({ ...prev, [sample.id]: false }))}
                      autoPlay={videoPlaying[sample.id]}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      {videoPlaying[sample.id] ? (
                        <Pause className="h-8 w-8 text-white" />
                      ) : (
                        <Play className="h-8 w-8 text-white" />
                      )}
                    </div>
                  </div>
                ) : (
                  <img
                    src={sample.previewUrl}
                    alt={sample.title || "Sample"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                
                {/* Featured badge */}
                {sample.isFeatured && (
                  <Badge className="absolute top-2 left-2 bg-accent-purple text-white">
                    Featured
                  </Badge>
                )}

                {/* View overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedSample(sample)}
                    className="mr-2"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const performExportDialog = () => {
                        setSelectedSample(sample);
                        setShowExportDialog(true);
                      };
                      interceptAction(performExportDialog, `${sample.title || 'sample'} export`);
                    }}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Sample info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">
                      {sample.title || "Untitled"}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                      {sample.originalPrompt}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleLike(sample.id)}
                      className="flex items-center space-x-1 hover:text-red-400 transition-colors"
                      disabled={!isAuthenticated}
                    >
                      <Heart className={`h-3 w-3 ${sample.likeCount > 0 ? 'fill-red-400 text-red-400' : ''}`} />
                      <span>{sample.likeCount}</span>
                    </button>
                    <div className="flex items-center space-x-1">
                      <Download className="h-3 w-3" />
                      <span>{sample.downloadCount}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatFileSize(sample.fileSize)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sample Detail Modal */}
      <Dialog open={!!selectedSample && !showExportDialog} onOpenChange={() => setSelectedSample(null)}>
        <DialogContent className="max-w-4xl bg-card-bg border-gray-700">
          {selectedSample && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white">
                  {selectedSample.title || "Sample Preview"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={getAspectRatioClass(selectedSample.dimensions.width, selectedSample.dimensions.height)}>
                  {selectedSample.type === "video" ? (
                    <video
                      src={selectedSample.previewUrl}
                      poster={selectedSample.thumbnailUrl}
                      className="w-full h-full object-cover rounded-lg"
                      controls
                      autoPlay
                      loop
                    />
                  ) : (
                    <img
                      src={selectedSample.highResUrl}
                      alt={selectedSample.title || "Sample"}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {selectedSample.title || "Untitled Sample"}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4">
                      {selectedSample.description || selectedSample.originalPrompt}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Dimensions:</span>
                      <div className="text-white">
                        {selectedSample.dimensions.width} × {selectedSample.dimensions.height}
                        {selectedSample.dimensions.duration && ` (${selectedSample.dimensions.duration}s)`}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">File Size:</span>
                      <div className="text-white">{formatFileSize(selectedSample.fileSize)}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Likes:</span>
                      <div className="text-white">{selectedSample.likeCount}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Downloads:</span>
                      <div className="text-white">{selectedSample.downloadCount}</div>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button
                      onClick={() => handleLike(selectedSample.id)}
                      variant="outline"
                      className="flex-1"
                      disabled={!isAuthenticated}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Like
                    </Button>
                    <Button
                      onClick={() => setShowExportDialog(true)}
                      className="flex-1 bg-gradient-to-r from-accent-blue to-accent-purple"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="bg-card-bg border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Export Sample</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Format
              </label>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {getFormatOptions().map(format => (
                    <SelectItem key={format} value={format}>
                      {format.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Quality
              </label>
              <Select value={selectedQuality} onValueChange={setSelectedQuality}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="hd">HD</SelectItem>
                  <SelectItem value="ultra">Ultra</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedFormat && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Price:</span>
                  <span className="text-accent-blue font-semibold">
                    {getPrice(selectedFormat, selectedQuality)} Credits
                  </span>
                </div>
              </div>
            )}

            <div className="flex space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowExportDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                disabled={!selectedFormat || exportMutation.isPending}
                className="flex-1 bg-gradient-to-r from-accent-blue to-accent-purple"
              >
                {exportMutation.isPending ? "Processing..." : "Purchase Export"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Smart Sign-up Modal */}
      <AuthSignupModal
        isOpen={showSignupModal}
        onClose={closeModal}
        onSwitchToSignIn={closeModal}
        recipeName={recipeName}
      />
    </>
  );
}