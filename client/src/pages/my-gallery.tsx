import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Download, Share2, Trash2, Eye, Clock, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useEffect } from "react";
import { useLocation } from "wouter";
import GenerationFailureCard from "@/components/generation-failure-card";
import Navigation from "@/components/navigation";

export default function MyGallery() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

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
          <p className="mt-4 text-gray-400">Loading your gallery...</p>
        </div>
      </div>
    );
  }

  const completedGenerations = (generations as any[]).filter((g: any) => g.status === 'completed');
  const inProgressGenerations = (generations as any[]).filter((g: any) => g.status === 'processing');
  const failedGenerations = (generations as any[]).filter((g: any) => g.status === 'failed');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'processing':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Gallery</h1>
          <p className="text-gray-400">View and manage all your generated content</p>
        </div>

        <Tabs defaultValue="completed" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Completed ({completedGenerations.length})
            </TabsTrigger>
            <TabsTrigger value="processing" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              In Progress ({inProgressGenerations.length})
            </TabsTrigger>
            <TabsTrigger value="failed" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Failed ({failedGenerations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="completed">
            {completedGenerations.length === 0 ? (
              <Card className="bg-card-bg border-card-border">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Eye className="h-12 w-12 text-gray-500 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No completed generations yet</h3>
                  <p className="text-gray-400 text-center mb-6">
                    Start creating with our AI recipes to see your work here
                  </p>
                  <Button onClick={() => window.location.href = "/"}>
                    Browse Recipes
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedGenerations.map((generation: any) => (
                  <Card
                    key={generation.id}
                    className="bg-card-bg border-card-border hover:border-accent-blue/50 transition-colors cursor-pointer"
                    onClick={() => setLocation(`/asset-viewer/${generation.id}`)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant={getStatusBadgeVariant(generation.status)} className="flex items-center gap-1">
                          {getStatusIcon(generation.status)}
                          {generation.status}
                        </Badge>
                        <span className="text-sm text-gray-400">
                          {format(new Date(generation.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <CardTitle className="text-lg text-white">{generation.recipeTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {generation.imageUrl && (
                        <div className="mb-4">
                          <img
                            src={generation.imageUrl}
                            alt={generation.recipeTitle}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className="mb-4">
                        <p className="text-sm text-gray-400 mb-2">Prompt:</p>
                        <p className="text-sm text-gray-300 line-clamp-3">{generation.prompt}</p>
                      </div>

                      {/* Show extracted variables if available */}
                      {generation.metadata?.extractedVariables && Object.keys(generation.metadata.extractedVariables).length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-400 mb-2">Variables:</p>
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle download
                            }}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle share
                            }}
                          >
                            <Share2 className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle delete
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="processing">
            {inProgressGenerations.length === 0 ? (
              <Card className="bg-card-bg border-card-border">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-gray-500 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No generations in progress</h3>
                  <p className="text-gray-400 text-center">
                    Your completed and in-progress work will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inProgressGenerations.map((generation: any) => (
                  <Card key={generation.id} className="bg-card-bg border-card-border">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant={getStatusBadgeVariant(generation.status)} className="flex items-center gap-1">
                          {getStatusIcon(generation.status)}
                          {generation.status}
                        </Badge>
                        <span className="text-sm text-gray-400">
                          {format(new Date(generation.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <CardTitle className="text-lg text-white">{generation.recipeTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="animate-pulse bg-gray-700 h-48 rounded-lg mb-4"></div>
                        <p className="text-sm text-gray-400 mb-2">Prompt:</p>
                        <p className="text-sm text-gray-300 line-clamp-3">{generation.prompt}</p>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="flex items-center gap-2 text-yellow-500">
                          <Clock className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Processing...</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="failed">
            {failedGenerations.length === 0 ? (
              <Card className="bg-card-bg border-card-border">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No failed generations</h3>
                  <p className="text-gray-400 text-center">
                    Great! All your generations have been successful
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {failedGenerations.map((generation: any) => (
                  <GenerationFailureCard
                    key={generation.id}
                    generation={generation}
                    onRetrySuccess={() => {
                      toast({
                        title: "Generation Retrying",
                        description: "Your content is being processed again.",
                      });
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}