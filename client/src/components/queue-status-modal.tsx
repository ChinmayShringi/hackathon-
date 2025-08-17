import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Clock, 
  Play, 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  RefreshCw,
  AlertCircle,
  Eye
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import MediaPreviewModal from "@/components/media-preview-modal";

interface Generation {
  id: number;
  shortId?: string;
  status: string;
  recipeTitle: string;
  prompt: string;
  imageUrl?: string;
  videoUrl?: string;
  failureReason?: string;
  retryCount: number;
  maxRetries: number;
  creditsRefunded: boolean;
  creditsCost?: number;
  createdAt: string;
  updatedAt: string;
}

interface QueueStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: "processing" | "completed" | "failed";
  generations: Generation[];
  title: string;
}

export default function QueueStatusModal({ 
  isOpen, 
  onClose, 
  status, 
  generations, 
  title 
}: QueueStatusModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [previewModal, setPreviewModal] = useState<{ isOpen: boolean; generation: Generation | null }>({
    isOpen: false,
    generation: null
  });

  const retryMutation = useMutation({
    mutationFn: async (generationId: number) => {
      const response = await apiRequest("POST", `/api/generations/${generationId}/retry`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Retry Initiated",
        description: "Generation has been added back to the queue.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/generations"] });
    },
    onError: (error: any) => {
      toast({
        title: "Retry Failed",
        description: error.message || "Unable to retry generation.",
        variant: "destructive",
      });
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Play className="h-4 w-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatHumanDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else if (diffInHours < 24) {
      return format(date, 'h:mm a');
    } else if (diffInHours < 168) { // 7 days
      return format(date, 'EEE h:mm a');
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  };

  const getProgressEstimate = (generation: Generation) => {
    const timeElapsed = new Date().getTime() - new Date(generation.createdAt).getTime();
    const estimatedTotal = 120000; // 2 minutes in milliseconds
    const progress = Math.min((timeElapsed / estimatedTotal) * 100, 95);
    return Math.round(progress);
  };

  const renderProcessingCard = (generation: Generation) => {
    const progress = getProgressEstimate(generation);
    
    return (
      <Card key={generation.id} className="mb-3">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {getStatusIcon(generation.status)}
              <h4 className="font-medium text-white">{generation.recipeTitle}</h4>
            </div>
            <Badge variant="outline" className="text-yellow-400">
              Processing
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Progress</span>
              <span className="text-gray-400">{progress}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            
            <div className="text-sm text-gray-400">
              <div className="flex justify-between">
                <span>Started: {formatHumanDate(generation.createdAt)}</span>
                <span>~{Math.max(1, Math.round((100 - progress) * 0.02))} min remaining</span>
              </div>
            </div>
            
            <div className="pt-2 border-t border-gray-700">
              <p className="text-xs text-gray-500 line-clamp-2">{generation.prompt}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCompletedCard = (generation: Generation) => {
    const mediaUrl = generation.imageUrl || generation.videoUrl;
    const mediaId = generation.id;
    
    return (
      <Card key={generation.id} className="mb-3 hover:bg-gray-800/50 transition-colors">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Media Preview */}
            <div className="flex-shrink-0">
              {mediaUrl ? (
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700">
                  {generation.imageUrl ? (
                    <img 
                      src={generation.imageUrl} 
                      alt={generation.recipeTitle}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-700 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white truncate">{generation.recipeTitle}</h4>
                <Badge variant="outline" className="text-green-400 ml-2">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              </div>
              
              <p className="text-sm text-gray-400 mb-2">
                Completed {formatHumanDate(generation.updatedAt || generation.createdAt)}
              </p>
              
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="h-7 px-2 text-xs"
                  onClick={() => setPreviewModal({ isOpen: true, generation })}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="h-7 px-2 text-xs text-blue-400 hover:text-blue-300"
                  onClick={() => {
                    // Check if we're in alpha mode and use appropriate route
                    const isAlphaSite = import.meta.env.VITE_SITE_DEPLOYMENT_TYPE === 'alpha';
                    const route = isAlphaSite ? `/alpha/m/${generation.shortId}` : `/asset-viewer/${mediaId}`;
                    window.open(route, '_blank');
                  }}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Open
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderFailedCard = (generation: Generation) => {
    const canRetry = generation.retryCount < generation.maxRetries;
    
    return (
      <Card key={generation.id} className="mb-3 border-red-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {getStatusIcon(generation.status)}
              <h4 className="font-medium text-white">{generation.recipeTitle}</h4>
            </div>
            <Badge variant="destructive">
              Failed
            </Badge>
          </div>
          
          <div className="space-y-3">
            {/* Error Message */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-red-400 font-medium mb-1">Generation Failed</p>
                  <p className="text-xs text-red-300">
                    {generation.failureReason || "An unexpected error occurred during generation."}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Details */}
            <div className="text-sm text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>Failed:</span>
                <span>{formatHumanDate(generation.updatedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Attempts:</span>
                <span>{generation.retryCount}/{generation.maxRetries}</span>
              </div>
              {generation.creditsRefunded && (
                <div className="flex justify-between text-green-400">
                  <span>Credits:</span>
                  <span>Refunded ({generation.creditsCost})</span>
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-700">
              {canRetry ? (
                <Button
                  size="sm"
                  onClick={() => retryMutation.mutate(generation.id)}
                  disabled={retryMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {retryMutation.isPending ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Retry ({generation.maxRetries - generation.retryCount} left)
                    </>
                  )}
                </Button>
              ) : (
                <Badge variant="outline" className="text-gray-500">
                  Max retries exceeded
                </Badge>
              )}
              
              <span className="text-xs text-gray-500">
                ID: #{generation.id}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return generations.map(renderProcessingCard);
      case 'completed':
        return generations.map(renderCompletedCard);
      case 'failed':
        return generations.map(renderFailedCard);
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon(status)}
            {title} ({generations.length})
          </DialogTitle>
          <DialogDescription>
            View and manage your {status} generations. {status === 'failed' ? 'Retry failed generations or view error details.' : status === 'completed' ? 'Access your completed media assets.' : 'Monitor generation progress and estimated completion times.'}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          {generations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                {getStatusIcon(status)}
              </div>
              <p className="text-gray-400">No {status} generations found</p>
            </div>
          ) : (
            <div className="space-y-0">
              {renderContent()}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
      
      {/* Media Preview Modal */}
      <MediaPreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ isOpen: false, generation: null })}
        generation={previewModal.generation}
      />
    </Dialog>
  );
}