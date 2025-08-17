import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import { VideoPlayer } from "@/components/ui/video-player";
import {
  Download,
  Share2,
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  Play,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";

export default function AssetViewer() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Asset viewer is now public - no authentication required

  const { data: generation, isLoading: generationLoading, error } = useQuery({
    queryKey: ["/api/generations", id],
    queryFn: async () => {
      const response = await fetch(`/api/generations/${id}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch generation');
      }
      return response.json();
    },
    enabled: !!id,
    retry: false,
  });

  // Debug logging


  if (generationLoading) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Navigation />
        <div className="flex items-center justify-center pt-24 min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-blue"></div>
            <p className="mt-4 text-gray-400">Loading content...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !generation) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Navigation />
        <div className="flex items-center justify-center pt-24 min-h-screen">
          <Card className="bg-card-bg border-card-border max-w-md">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <ExternalLink className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Content Not Found</h3>
              <p className="text-gray-400 text-center mb-6">
                This generation doesn't exist or you don't have permission to view it.
              </p>
              <Button onClick={() => setLocation("/")}>
                Return Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const gen = generation as any;
  // Use the user-bound viewUrl for displaying the media - this will be /m/admin_debug/aBc123DeFg4
  const mediaUrl = gen.viewUrl || gen.imageUrl || gen.videoUrl || gen.secureUrl;
  const directImageUrl = gen.imageUrl || gen.secureUrl;
  const isVideo = !!gen.videoUrl;

  // For logged-in users viewing their own content, always use the secure media URL
  const displayMediaUrl = gen.viewUrl || directImageUrl;

  const handleDownload = async () => {
    if (!directImageUrl) return;

    try {
      const response = await fetch(directImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `generation-${gen.id}.${isVideo ? 'mp4' : 'png'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download Complete",
        description: "Asset has been downloaded to your device.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download the asset. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share && mediaUrl) {
      try {
        await navigator.share({
          title: gen.recipe?.name || 'AI Generated Content',
          text: gen.prompt || 'Check out this AI-generated content!',
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Link copied to clipboard for sharing.",
        });
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Link copied to clipboard for sharing.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation(isAuthenticated ? "/my-gallery" : "/")}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {isAuthenticated ? "Back to Gallery" : "Back to Home"}
          </Button>

          <div className="flex items-center gap-2 ml-auto">
            <Badge variant="outline" className="text-green-400">
              <CheckCircle className="h-3 w-3 mr-1" />
              {gen.isPublic ? 'Public' : 'Private'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Media Display */}
          <div className="lg:col-span-2">
            <Card className="bg-card-bg border-card-border overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-square bg-black/20 flex items-center justify-center">
                  {isVideo ? (
                    <VideoPlayer
                      url={displayMediaUrl}
                      poster={gen.imageUrl}
                      className="w-full h-full"
                    />
                  ) : (
                    <img
                      src={displayMediaUrl}
                      alt={gen.prompt || "Generated content"}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>

                <div className="p-6 border-t border-card-border">
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={handleDownload}
                      disabled={!mediaUrl}
                      className="bg-accent-blue hover:bg-accent-blue/80"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>

                    <Button
                      variant="outline"
                      onClick={handleShare}
                      className="border-card-border"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details Panel */}
          <div className="space-y-6">
            {/* Creator Information */}
            {gen.creator && (
              <Card className="bg-card-bg border-card-border">
                <CardHeader>
                  <CardTitle className="text-lg">Created By</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {gen.creator.firstName?.[0] || gen.creator.handle?.[1] || 'U'}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {gen.creator.firstName} {gen.creator.lastName}
                      </p>
                      <p className="text-blue-400 text-sm">{gen.creator.handle}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    <Calendar className="h-3 w-3 inline mr-1" />
                    Created {format(new Date(gen.createdAt), 'MMMM d, yyyy')} at {format(new Date(gen.createdAt), 'h:mm a')}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generation Details */}
            <Card className="bg-card-bg border-card-border">
              <CardHeader>
                <CardTitle className="text-lg">Generation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Recipe</label>
                  <p className="text-white mt-1">{gen.recipe?.name || 'Unknown Recipe'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-400">Prompt</label>
                  <p className="text-white mt-1 text-sm leading-relaxed">{gen.prompt || 'No prompt available'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-400">Status</label>
                  <div className="mt-1">
                    <Badge variant="outline" className="text-green-400">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {gen.status || 'completed'}
                    </Badge>
                  </div>
                </div>

                {gen.creditsCost && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Credits Used</label>
                    <p className="text-white mt-1">{gen.creditsCost}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card className="bg-card-bg border-card-border">
              <CardHeader>
                <CardTitle className="text-lg">Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Generation ID</span>
                  <span className="text-white">#{gen.id}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Created</span>
                  <span className="text-white">{format(new Date(gen.createdAt), 'MMM d, yyyy h:mm a')}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Type</span>
                  <span className="text-white capitalize">{gen.type || 'image'}</span>
                </div>

                {gen.metadata?.size && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Size</span>
                    <span className="text-white">{gen.metadata.size}</span>
                  </div>
                )}

                {gen.metadata?.model && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Model</span>
                    <span className="text-white">{gen.metadata.model}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-400">Media Type</span>
                  <div className="flex items-center gap-1">
                    {isVideo ? <Play className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                    <span className="text-white">{isVideo ? 'Video' : 'Image'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}