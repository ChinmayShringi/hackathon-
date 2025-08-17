import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Clock, AlertCircle, CheckCircle, XCircle, Pause, Play, X } from "lucide-react";
import { format } from "date-fns";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useEffect, useState } from "react";
import QueueStatusModal from "@/components/queue-status-modal";
import Navigation from "@/components/navigation";
import { useLocation } from "wouter";

export default function Queue() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { isConnected, subscribeToMessage } = useWebSocket();
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    status: "processing" | "completed" | "failed";
    title: string;
  }>({ isOpen: false, status: "processing", title: "" });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/auth/user";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Set up WebSocket event handlers for real-time updates
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribeGeneration = subscribeToMessage('generation_update', (data) => {
      // Optimistically update the cache instead of invalidating
      queryClient.setQueryData(["/api/generations"], (oldData: any[]) => {
        if (!oldData) return oldData;
        
        return oldData.map(gen => 
          gen.id === data.generationId 
            ? { ...gen, status: data.status }
            : gen
        );
      });
      
      // Also invalidate to ensure server state consistency
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/generations"] });
      }, 100);
      
      // Show toast notification for status changes
      if (data.status === 'completed') {
        toast({
          title: "Generation Completed",
          description: "Your content has been generated successfully!",
        });
      } else if (data.status === 'failed') {
        toast({
          title: "Generation Failed",
          description: "Something went wrong. Your credits have been refunded.",
          variant: "destructive",
        });
      }
    });

    const unsubscribeQueue = subscribeToMessage('queue_update', (data) => {
      // Delay the invalidation to avoid race conditions
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/generations"] });
      }, 50);
    });

    return () => {
      unsubscribeGeneration();
      unsubscribeQueue();
    };
  }, [isConnected, subscribeToMessage, queryClient, toast]);

  const { data: generations = [], isLoading: generationsLoading } = useQuery({
    queryKey: ["/api/generations"],
    retry: false,
    enabled: isAuthenticated,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-blue"></div>
          <p className="mt-4 text-gray-400">Loading your queue...</p>
        </div>
      </div>
    );
  }

  const queuedGenerations = (generations as any[]).filter((g: any) => 
    g.status === 'queued' || g.status === 'processing'
  );
  const completedGenerations = (generations as any[]).filter((g: any) => 
    g.status === 'completed'
  );
  const failedGenerations = (generations as any[]).filter((g: any) => 
    g.status === 'failed'
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'queued':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'processing':
        return <Play className="h-4 w-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'queued':
        return 'text-blue-400';
      case 'processing':
        return 'text-yellow-400';
      case 'completed':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getQueuePosition = (index: number) => {
    const processingCount = queuedGenerations.filter(g => g.status === 'processing').length;
    if (queuedGenerations[index].status === 'processing') return 'Processing';
    return `#${index - processingCount + 1} in queue`;
  };

  const estimatedTime = (position: number) => {
    if (position === 0) return 'Processing now';
    return `~${position * 2} minutes`;
  };

  const openModal = (status: "processing" | "completed" | "failed", title: string) => {
    setModalState({ isOpen: true, status, title });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, status: "processing", title: "" });
  };

  const getModalGenerations = () => {
    switch (modalState.status) {
      case 'processing':
        return (generations as any[]).filter(g => g.status === 'processing');
      case 'completed':
        return completedGenerations;
      case 'failed':
        return failedGenerations;
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Generation Queue</h1>
              <p className="text-gray-400">Track your active and pending AI generations</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-400">
                {isConnected ? 'Live updates' : 'Reconnecting...'}
              </span>
            </div>
          </div>
        </div>

        {/* Queue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-900/30 to-slate-800/40 border-blue-800/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-300">In Queue</CardTitle>
              <Clock className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{queuedGenerations.filter(g => g.status === 'queued').length}</div>
              <p className="text-xs text-blue-200/70">Waiting to process</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-card-bg border-card-border cursor-pointer hover:bg-gray-800/50 transition-colors"
            onClick={() => openModal("processing", "Processing Generations")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Processing</CardTitle>
              <Play className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{queuedGenerations.filter(g => g.status === 'processing').length}</div>
              <p className="text-xs text-gray-400">Currently generating</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-card-bg border-card-border cursor-pointer hover:bg-gray-800/50 transition-colors"
            onClick={() => openModal("completed", "Completed Generations")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{completedGenerations.length}</div>
              <p className="text-xs text-gray-400">Successfully generated</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-card-bg border-card-border cursor-pointer hover:bg-gray-800/50 transition-colors"
            onClick={() => openModal("failed", "Failed Generations")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Failed</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{failedGenerations.length}</div>
              <p className="text-xs text-gray-400">Generation errors</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Queue */}
        {queuedGenerations.length === 0 ? (
          <Card className="bg-gradient-to-br from-blue-900/30 to-slate-800/40 border-blue-800/30 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Queue is empty</h3>
              <p className="text-blue-200/70 text-center mb-6">
                No active generations. Start creating with our AI recipes!
              </p>
              <Button onClick={() => window.location.href = "/"} className="bg-blue-600 hover:bg-blue-700">
                Browse Recipes
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">Active Generations</h2>
            
            {queuedGenerations.map((generation: any, index: number) => (
              <Card key={generation.id} className="bg-gradient-to-br from-blue-900/30 to-slate-800/40 border-blue-800/30 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(generation.status)}
                      <div>
                        <CardTitle className="text-lg text-white">{generation.recipeTitle}</CardTitle>
                        <div className="flex items-center gap-4 mt-1">
                          <Badge variant="outline" className={getStatusColor(generation.status)}>
                            {generation.status === 'processing' ? 'Processing' : getQueuePosition(index)}
                          </Badge>
                          <span className="text-sm text-blue-200/70">
                            Started {format(new Date(generation.createdAt), 'MMM d, h:mm a')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {generation.status === 'queued' && (
                        <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-blue-200/70 mb-2">Prompt:</p>
                      <p className="text-sm text-blue-100">{generation.prompt}</p>
                    </div>
                    
                    {generation.status === 'processing' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-200/70">Progress</span>
                          <span className="text-blue-200/70">~2 minutes remaining</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                    )}
                    
                    {generation.status === 'queued' && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-200/70">
                          Estimated wait time: {estimatedTime(index)}
                        </span>
                        <span className="text-blue-300">
                          Position {getQueuePosition(index)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Recently Completed */}
        {completedGenerations.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Recent Completions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedGenerations.slice(0, 6).map((generation: any) => (
                <Card 
                  key={generation.id} 
                  className="bg-card-bg border-card-border cursor-pointer hover:border-accent-blue/50 transition-colors"
                  onClick={() => setLocation(`/asset-viewer/${generation.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-white">{generation.recipeTitle}</span>
                    </div>
                    {(generation.imageUrl || generation.secureUrl) && (
                      <img 
                        src={generation.imageUrl || generation.secureUrl} 
                        alt={generation.recipeTitle}
                        className="w-full h-32 object-cover rounded-md mb-2"
                      />
                    )}
                    <p className="text-xs text-gray-400">
                      Completed {format(new Date(generation.updatedAt || generation.createdAt), 'h:mm a')}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            {completedGenerations.length > 6 && (
              <div className="text-center mt-4">
                <Button variant="outline" onClick={() => window.location.href = "/my-gallery"}>
                  View All Completed
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Queue Status Modal */}
        <QueueStatusModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          status={modalState.status}
          generations={getModalGenerations()}
          title={modalState.title}
        />
      </div>
    </div>
  );
}