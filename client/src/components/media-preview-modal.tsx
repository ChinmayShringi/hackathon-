import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VideoPlayer } from "@/components/ui/video-player";
import { Download, Share2, ExternalLink, Calendar, Clock, CheckCircle, Play } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface Generation {
  id: number;
  shortId?: string;
  recipeTitle: string;
  imageUrl?: string;
  videoUrl?: string;
  secureUrl?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  viewUrl?: string;
  publicShareUrl?: string;
  privateShareUrl?: string;
}

interface MediaPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  generation: Generation | null;
}

export default function MediaPreviewModal({ isOpen, onClose, generation }: MediaPreviewModalProps) {
  const { toast } = useToast();

  if (!generation) return null;

  const mediaUrl = generation.imageUrl || generation.videoUrl || generation.secureUrl;
  const isVideo = !!generation.videoUrl;
  const directImageUrl = generation.imageUrl || generation.secureUrl;

  const handleDownload = async () => {
    if (!directImageUrl) return;
    
    try {
      const response = await fetch(directImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${generation.recipeTitle || 'generation'}-${generation.id}.${isVideo ? 'mp4' : 'png'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: "Your content is being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download the content.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    const shareUrl = generation.publicShareUrl || generation.viewUrl || window.location.href;
    
    if (navigator.share && mediaUrl) {
      try {
        await navigator.share({
          title: generation.recipeTitle || 'AI Generated Content',
          text: 'Check out this AI-generated content!',
          url: shareUrl,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied",
          description: "Link copied to clipboard for sharing.",
        });
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied",
        description: "Link copied to clipboard for sharing.",
      });
    }
  };

  const handleViewFull = () => {
    // Check if we're in alpha mode and use appropriate route
    const isAlphaSite = import.meta.env.VITE_SITE_DEPLOYMENT_TYPE === 'alpha';
    const route = isAlphaSite && generation.shortId ? `/alpha/m/${generation.shortId}` : `/asset-viewer/${generation.id}`;
    window.location.href = route;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-card-bg border-card-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-xl text-white">
                {generation.recipeTitle || 'Generated Content'}
              </DialogTitle>
              <Badge variant="outline" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Completed
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="h-4 w-4" />
              {format(new Date(generation.updatedAt || generation.createdAt), 'MMM d, yyyy')}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Media Display */}
          <div className="flex justify-center bg-gray-900 rounded-lg p-4">
            {mediaUrl ? (
              isVideo ? (
                <div className="w-full max-w-2xl aspect-video">
                  <VideoPlayer 
                    url={mediaUrl}
                    className="w-full h-full rounded-lg"
                  />
                </div>
              ) : (
                <img 
                  src={directImageUrl}
                  alt={generation.recipeTitle || 'Generated content'}
                  className="max-w-full max-h-[60vh] rounded-lg"
                  style={{ objectFit: 'contain' }}
                />
              )
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <div className="text-center">
                  <Play className="h-12 w-12 mx-auto mb-2" />
                  <p>Media content not available</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-3">
            <Button onClick={handleDownload} disabled={!mediaUrl} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={handleShare} variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button onClick={handleViewFull} variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Full Details
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}