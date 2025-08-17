import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AlphaHeader from "@/components/alpha-header";
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
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { getGenerationAspectRatioClass } from '@/lib/videoUtils';
import { LucideIcon } from '@/components/ui/LucideIcon';

// Format time ago function using date-fns
function formatTimeAgo(date: Date): string {
  try {
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Unknown';
  }
}

// Pre-fetch generation data on route access
async function preloadGenerationData(shortId: string) {
  try {
    const response = await fetch(`/api/alpha/generation/${shortId}`, {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch generation');
    }
    return response.json();
  } catch (error) {
    console.error('Error preloading generation data:', error);
    throw error;
  }
}

export default function AlphaAssetViewer() {
  const { shortId } = useParams<{ shortId: string }>();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [preloadedData, setPreloadedData] = useState<any>(null);
  const [isPreloading, setIsPreloading] = useState(true);
  const [streamingFailed, setStreamingFailed] = useState(false);

  // Pre-load generation data on component mount
  useEffect(() => {
    if (!shortId) return;

    const loadData = async () => {
      try {
        setIsPreloading(true);
        const data = await preloadGenerationData(shortId);
        setPreloadedData(data);
      } catch (error) {
        console.error('Failed to preload generation data:', error);
        setPreloadedData(null);
      } finally {
        setIsPreloading(false);
      }
    };

    loadData();
  }, [shortId]);

  // Use preloaded data if available, otherwise fall back to query (for error handling)
  const { data: fallbackData, error } = useQuery({
    queryKey: ["/api/alpha/generation", shortId],
    queryFn: async () => {
      const response = await fetch(`/api/alpha/generation/${shortId}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch generation');
      }
      return response.json();
    },
    enabled: !!shortId && !preloadedData && !isPreloading,
    retry: false,
  });

  // Get guest stats for the badge
  const { data: guestStats } = useQuery<{ used: number; remaining: number; refreshSecondsLeft?: number }>({
    queryKey: ["/api/alpha/guest-stats"],
    queryFn: async () => {
      const response = await fetch("/api/alpha/guest-stats");
      if (!response.ok) throw new Error("Failed to fetch guest stats");
      return response.json();
    },
    refetchInterval: 30000, // Poll every 30 seconds
  });

  // Use preloaded data if available, otherwise use fallback
  const generation = preloadedData || fallbackData;
  const isLoading = isPreloading || (!preloadedData && !fallbackData && !error);



  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <AlphaHeader
          rightContent={
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setLocation("/alpha/my-makes")}
                className="text-white hover:bg-accent-blue/20"
              >
                My Makes
                {guestStats && guestStats.used > 0 && (
                  <Badge className="ml-2 bg-accent-blue text-white text-xs px-1.5 py-0.5 animate-pulse">
                    {guestStats.used}
                  </Badge>
                )}
              </Button>
            </div>
          }
        />
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
        <AlphaHeader
          rightContent={
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setLocation("/alpha/my-makes")}
                className="text-white hover:bg-accent-blue/20"
              >
                My Makes
                {guestStats && guestStats.used > 0 && (
                  <Badge className="ml-2 bg-accent-blue text-white text-xs px-1.5 py-0.5 animate-pulse">
                    {guestStats.used}
                  </Badge>
                )}
              </Button>
            </div>
          }
        />
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
              <Button onClick={() => setLocation("/alpha/my-makes")}>
                Back to My Makes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const gen = generation as any;
  const metadata: any = gen.metadata || {};

  // Handle different URL structures for alpha system
  const mediaUrl = gen.videoUrl || gen.cdnUrl || gen.imageUrl || (gen as any).resultUrl;
  const isVideo = Boolean(
    (!!gen.videoUrl && gen.videoUrl.endsWith('.mp4')) ||
    (!!gen.cdnUrl && gen.cdnUrl.endsWith('.mp4')) ||
    (gen.type === 'video') ||
    (metadata.generationType === 'text_to_video') ||
    (mediaUrl && mediaUrl.includes('.mp4'))
  );

  // Use streaming endpoint for videos, direct URL for images
  // Fallback to direct URL if streaming fails
  const fallbackVideoUrl = isVideo ? mediaUrl : null;
  const displayMediaUrl = isVideo ? (streamingFailed ? fallbackVideoUrl : `/api/stream-video/${gen.shortId}`) : mediaUrl;

  // Validate the display URL
  const isValidVideoUrl = isVideo && displayMediaUrl &&
    !displayMediaUrl.includes('undefined') &&
    !displayMediaUrl.includes('null') &&
    !displayMediaUrl.includes('NaN');



  const handleDownload = async () => {
    if (!displayMediaUrl) return;

    try {
      const response = await fetch(displayMediaUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${gen.recipeTitle || 'generation'}-${gen.id}.${isVideo ? 'mp4' : 'png'}`;
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
    if (navigator.share && displayMediaUrl) {
      try {
        await navigator.share({
          title: gen.recipeTitle || 'AI Generated Content',
          text: 'Check out this AI-generated content!',
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
      <AlphaHeader
        rightContent={
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation("/alpha/my-makes")}
              className="text-white hover:bg-accent-blue/20"
            >
              My Makes
              {guestStats && guestStats.used > 0 && (
                <Badge className="ml-2 bg-accent-blue text-white text-xs px-1.5 py-0.5 animate-pulse">
                  {guestStats.used}
                </Badge>
              )}
            </Button>
          </div>
        }
      />

      <div className="max-w-2xl mx-auto px-4 py-8 pt-6">
        {/* Video Player & Social Icons Container */}
        <div className="bg-card-bg border border-card-border rounded-lg overflow-hidden mb-6">
          {/* Video Player */}
          <div className="relative bg-black flex items-center justify-center">
            {/* Title Overlay */}
            <div className="absolute top-4 left-4 z-10">
              <h1 className="text-white text-lg font-semibold drop-shadow-lg">
                {gen.recipeTitle || "Custom Generation"}
              </h1>
            </div>
            {isVideo ? (
              isValidVideoUrl ? (
                <VideoPlayer
                  url={displayMediaUrl}
                  className="max-h-[80vh] max-w-full"
                  autoPlay={true}
                  loop={true}
                  metadata={metadata}
                  aspectRatioClass={getGenerationAspectRatioClass(gen)}
                  onError={(error) => {
                    console.error('VideoPlayer error:', error);
                    if (!streamingFailed && fallbackVideoUrl) {
                      setStreamingFailed(true);
                      toast({
                        title: "Switching to Direct Video",
                        description: "Streaming failed, using direct video URL.",
                      });
                    } else {
                      toast({
                        title: "Video Playback Error",
                        description: "Unable to play video. Please try refreshing the page.",
                        variant: "destructive",
                      });
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-black/50 min-h-[400px]">
                  <div className="text-white text-center p-4">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                      <Play className="h-8 w-8 text-red-500" />
                    </div>
                    <p className="text-sm font-medium mb-2">Video Not Available</p>
                    <p className="text-xs text-gray-400 mb-4">Unable to load video content</p>
                  </div>
                </div>
              )
            ) : (
              <img
                src={displayMediaUrl}
                alt={gen.recipeTitle || "Generated content"}
                className="w-full h-full object-contain max-h-[80vh]"
              />
            )}
          </div>

          {/* Social Icons Container */}
          <div className="flex justify-center gap-6 p-6">
            {/* Download */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleDownload}
                disabled={!displayMediaUrl}
                className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <Download className="w-6 h-6 text-white" />
              </button>
              <span className="text-xs text-white">Download</span>
            </div>

            {/* Copy Link */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleShare}
                className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </button>
              <span className="text-xs text-white">Copy</span>
            </div>

            {/* TikTok */}
            <div className="flex flex-col items-center gap-2">
              <button className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </button>
              <span className="text-xs text-white">TikTok</span>
            </div>

            {/* Instagram */}
            <div className="flex flex-col items-center gap-2">
              <button className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </button>
              <span className="text-xs text-white">Instagram</span>
            </div>

            {/* YouTube */}
            <div className="flex flex-col items-center gap-2">
              <button className="w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </button>
              <span className="text-xs text-white">YouTube</span>
            </div>

            {/* X (Twitter) */}
            <div className="flex flex-col items-center gap-2">
              <button className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
              <span className="text-xs text-white">X</span>
            </div>
          </div>
        </div>

        {/* Generation Details */}
        <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl p-10">
          {/* Timestamp & ID */}
          <div className="flex items-center gap-4 text-sm mb-4">
            <span className="text-white" title={gen.createdAt ? format(parseISO(gen.createdAt + 'Z'), 'PPP p') : 'Unknown'}>
              {gen.createdAt ? formatTimeAgo(parseISO(gen.createdAt + 'Z')) : 'Unknown'}
            </span>
            <span className="text-white/70">
              Creation ID: {gen.shortId || gen.id}
            </span>
          </div>

          {/* Recipe Tags */}
          {metadata?.tagDisplayData && Object.keys(metadata.tagDisplayData).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(metadata.tagDisplayData).map(([key, tagData]) => {
                const data = tagData as any;
                const iconName = data.icon;
                const color = data.color;
                const value = data.value;
                const tooltipText = `${key}: ${value}`;

                return (
                  <Badge
                    key={key}
                    variant="outline"
                    className={`text-xs border-white/20 text-white flex items-center gap-1 ${color ? `text-[${color}]` : ''
                      }`}
                    title={tooltipText}
                  >
                    {iconName && (
                      <LucideIcon name={iconName} className="mr-1 w-3 h-3" />
                    )}
                    <span>{value}</span>
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 