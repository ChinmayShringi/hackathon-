import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertCircle, 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  CreditCard,
  Info
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Generation {
  id: number;
  status: string;
  failureReason?: string;
  retryCount: number;
  maxRetries: number;
  creditsRefunded: boolean;
  creditsCost?: number;
  recipeTitle?: string;
  createdAt: string;
  updatedAt: string;
}

interface GenerationFailureCardProps {
  generation: Generation;
  onRetrySuccess?: () => void;
}

export default function GenerationFailureCard({ generation, onRetrySuccess }: GenerationFailureCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const retryMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/generations/${generation.id}/retry`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Retry Initiated",
        description: "Your generation has been added back to the queue. We'll process it again shortly.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/generations"] });
      onRetrySuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Retry Failed",
        description: error.message || "Unable to retry generation at this time.",
        variant: "destructive",
      });
    },
  });

  const canRetry = generation.status === 'failed' && generation.retryCount < generation.maxRetries;
  const attemptsRemaining = generation.maxRetries - generation.retryCount;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'failed': return 'destructive';
      case 'pending': return 'secondary';
      case 'processing': return 'default';
      case 'completed': return 'default';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card className="w-full border-red-200 dark:border-red-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            {generation.recipeTitle || 'Generation'}
          </CardTitle>
          <Badge variant={getStatusColor(generation.status)} className="capitalize">
            {generation.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Failure Message */}
        <Alert className="border-red-200 dark:border-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {generation.failureReason || "Generation failed due to an unexpected issue."}
          </AlertDescription>
        </Alert>

        {/* Status Information */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">
                Failed: {formatDate(generation.updatedAt)}
              </span>
            </div>
            
            {generation.creditsCost && (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  {generation.creditsCost} credits
                  {generation.creditsRefunded && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Refunded
                    </Badge>
                  )}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="text-right">
              <span className="text-gray-600 dark:text-gray-400">
                Attempts: {generation.retryCount}/{generation.maxRetries}
              </span>
            </div>
            
            {canRetry && (
              <div className="text-right">
                <span className="text-sm text-green-600 dark:text-green-400">
                  {attemptsRemaining} retry{attemptsRemaining !== 1 ? 's' : ''} remaining
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Info className="h-4 w-4 mr-1" />
            {showDetails ? 'Hide' : 'Show'} Details
          </Button>

          {canRetry && (
            <Button
              onClick={() => retryMutation.mutate()}
              disabled={retryMutation.isPending}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {retryMutation.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Retry Generation
                </>
              )}
            </Button>
          )}

          {!canRetry && generation.retryCount >= generation.maxRetries && (
            <Badge variant="outline" className="text-gray-500">
              Max retries exceeded
            </Badge>
          )}
        </div>

        {/* Extended Details */}
        {showDetails && (
          <div className="pt-3 border-t space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <strong>Generation ID:</strong> #{generation.id}
            </div>
            <div>
              <strong>Created:</strong> {formatDate(generation.createdAt)}
            </div>
            <div>
              <strong>Last Updated:</strong> {formatDate(generation.updatedAt)}
            </div>
            {generation.creditsRefunded && (
              <div className="text-green-600 dark:text-green-400">
                <strong>Refund Status:</strong> Credits have been restored to your account
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}