import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, Loader2, Play, Eye, X } from 'lucide-react';
import { format } from 'date-fns';

interface Generation {
  id: number;
  shortId?: string;
  recipeTitle: string;
  prompt: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  imageUrl?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  resultUrl?: string;
  metadata?: any;
}

interface GenerationPreviewCardProps {
  generation: Generation;
  onView?: (generation: Generation) => void;
  showMetadata?: boolean;
  compact?: boolean;
}

export default function GenerationPreviewCard({ 
  generation, 
  onView, 
  showMetadata = true,
  compact = false 
}: GenerationPreviewCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "processing":
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleView = () => {
    if (onView) {
      onView(generation);
    } else if (generation.shortId) {
      // Default behavior - open in new tab
      const isAlphaSite = import.meta.env.VITE_SITE_DEPLOYMENT_TYPE === 'alpha';
      const route = isAlphaSite ? `/alpha/m/${generation.shortId}` : `/asset-viewer/${generation.id}`;
      window.open(route, '_blank');
    }
  };

  const previewSize = compact ? "w-24 h-24" : "w-32 h-32";
  const cardPadding = compact ? "p-3" : "p-6";
  const contentGap = compact ? "gap-3" : "gap-6";

  return (
    <Card className="bg-card-bg border-card-border overflow-hidden hover:border-blue-500/50 transition-colors">
      <CardContent className={cardPadding}>
        <div className={`flex items-start ${contentGap}`}>
          {/* Preview Section */}
          <div className="flex-shrink-0">
            {generation.status === "completed" && (generation.videoUrl || generation.imageUrl || generation.thumbnailUrl) ? (
              <div 
                className={`${previewSize} bg-gray-800 rounded-lg overflow-hidden relative cursor-pointer`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleView}
              >
                {(() => {
                  // For videos, prioritize thumbnailUrl over videoUrl to prevent memory issues
                  const isVideo = Boolean(generation.videoUrl);
                  const previewUrl = isVideo 
                    ? (generation.thumbnailUrl || generation.videoUrl || '/default-preview.png')
                    : (generation.thumbnailUrl || generation.imageUrl || '/default-preview.png');
                  
                  // If we have a thumbnail URL for a video, show it as an auto-playing GIF without play button
                  const isGifThumbnail = isVideo && generation.thumbnailUrl;
                  
                  return (
                    <>
                      <img
                        src={previewUrl}
                        alt={generation.recipeTitle || ''}
                        className="w-full h-full object-cover"
                      />
                      {/* Only show play button if it's a video without a GIF thumbnail */}
                      {isVideo && !isGifThumbnail && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play className="w-8 h-8 text-white/80" />
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            ) : generation.status === "failed" ? (
              <div className={`${previewSize} bg-red-900/20 border-2 border-red-600 rounded-lg flex items-center justify-center`}>
                <div className="text-center">
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-1">
                    <X className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-xs text-red-400 font-medium">Failed</p>
                </div>
              </div>
            ) : (
              <div className={`${previewSize} bg-gray-800 rounded-lg overflow-hidden relative`}>
                {/* TV Static Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800">
                  <div className="absolute inset-0 opacity-30">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 2}s`,
                          animationDuration: `${0.5 + Math.random() * 1}s`
                        }}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-600/20 to-transparent animate-pulse" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-1" />
                    <p className="text-xs text-gray-400">Processing...</p>
                  </div>
                </div>
              </div>
            )}

            {/* View Button for completed generations */}
            {generation.status === "completed" && (generation.videoUrl || generation.imageUrl || generation.thumbnailUrl) && !compact && (
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={handleView}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon(generation.status)}
              <h3 className={`font-semibold text-white ${compact ? 'text-sm' : 'text-lg'}`}>
                {generation.recipeTitle}
              </h3>
              <Badge className={getStatusColor(generation.status)}>
                {generation.status}
              </Badge>
            </div>

            {!compact && (
              <>
                <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                  {generation.prompt}
                </p>

                {showMetadata && generation.metadata?.extractedVariables && Object.keys(generation.metadata.extractedVariables).length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Variables:</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(generation.metadata.extractedVariables).slice(0, 3).map(([key, value]) => (
                        <Badge key={key} variant="outline" className="text-xs">
                          {key}: {value as string}
                        </Badge>
                      ))}
                      {Object.keys(generation.metadata.extractedVariables).length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{Object.keys(generation.metadata.extractedVariables).length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Recipe Option Tag Pills */}
                {showMetadata && generation.metadata?.formData && Object.keys(generation.metadata.formData).length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Form Data:</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(generation.metadata.formData).slice(0, 5).map(([key, value]) => (
                        <Badge key={key} variant="outline" className="text-xs bg-blue-900/20 border-blue-600/30 text-blue-300">
                          {key}: {value as string}
                        </Badge>
                      ))}
                      {Object.keys(generation.metadata.formData).length > 5 && (
                        <Badge variant="outline" className="text-xs bg-blue-900/20 border-blue-600/30 text-blue-300">
                          +{Object.keys(generation.metadata.formData).length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>ID: {generation.id}</span>
                  <span>{format(new Date(generation.createdAt), 'MMM d, yyyy h:mm a')}</span>
                </div>
              </>
            )}

            {compact && (
              <div className="text-xs text-gray-500">
                {format(new Date(generation.createdAt), 'MMM d, h:mm a')}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 