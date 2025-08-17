import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Download, 
  Eye,
  Coins,
  TrendingUp,
  Image as ImageIcon,
  CreditCard
} from "lucide-react";
import type { Generation, CreditTransaction } from "@shared/schema";
import FalTestWidget from "@/components/fal-test-widget";


export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const { data: generations, isLoading: generationsLoading } = useQuery<Generation[]>({
    queryKey: ["/api/user/generations"],
    enabled: isAuthenticated,
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery<CreditTransaction[]>({
    queryKey: ["/api/user/transactions"],
    enabled: isAuthenticated,
  });

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
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
  }, [isAuthenticated, authLoading, toast]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-dark">
        <Navigation />
        <div className="pt-24 px-6">
          <div className="max-w-7xl mx-auto">
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400";
      case "failed":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-yellow-500/20 text-yellow-400";
    }
  };

  const completedGenerations = generations?.filter(g => g.status === "completed") || [];
  const totalSpent = transactions?.reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;

  return (
    <div className="min-h-screen bg-dark">
      <Navigation />
      
      <main className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-gray-400">
                Welcome back, {user?.firstName || user?.email}
              </p>
            </div>
            <Link href="/">
              <Button className="bg-gradient-to-r from-accent-blue to-accent-purple">
                Browse Recipes
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-card-bg border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Credits Balance</CardTitle>
                <Coins className="h-4 w-4 text-success-green" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user?.credits}</div>
                <p className="text-xs text-muted-foreground">Available credits</p>
              </CardContent>
            </Card>

            <Card className="bg-card-bg border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Generations</CardTitle>
                <ImageIcon className="h-4 w-4 text-accent-blue" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{generations?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Content created</p>
              </CardContent>
            </Card>

            <Card className="bg-card-bg border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedGenerations.length}</div>
                <p className="text-xs text-muted-foreground">Successful generations</p>
              </CardContent>
            </Card>

            <Card className="bg-card-bg border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Credits Spent</CardTitle>
                <TrendingUp className="h-4 w-4 text-accent-purple" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSpent}</div>
                <p className="text-xs text-muted-foreground">Total credits used</p>
              </CardContent>
            </Card>
          </div>

          {/* API Testing Section */}
          <div className="space-y-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FalTestWidget />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Generations */}
            <Card className="bg-card-bg border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ImageIcon className="mr-2 h-5 w-5" />
                  Recent Generations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generationsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-16 w-16 rounded" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-3/4 mb-2" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : generations?.length === 0 ? (
                  <div className="text-center py-8">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-400">No generations yet</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Create your first piece of content
                    </p>
                    <Link href="/">
                      <Button variant="outline" size="sm">
                        Browse Recipes
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {generations?.slice(0, 5).map((generation) => (
                      <div key={generation.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-700/50 transition-colors">
                        <div className="relative">
                          {generation.imageUrl ? (
                            <img
                              src={generation.imageUrl}
                              alt="Generated content"
                              className="h-16 w-16 rounded object-cover"
                            />
                          ) : (
                            <div className="h-16 w-16 rounded bg-gray-700 flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute -top-2 -right-2">
                            {getStatusIcon(generation.status)}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {generation.prompt.split('.')[0]}...
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={`text-xs ${getStatusColor(generation.status)}`}>
                              {generation.status}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {generation.creditsCost} credits
                            </span>
                          </div>
                        </div>

                        {generation.status === "completed" && generation.imageUrl && (
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Credit Transactions */}
            <Card className="bg-card-bg border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Credit History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {transactionsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div>
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                  </div>
                ) : transactions?.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-400">No transactions yet</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Purchase credits to get started
                    </p>
                    <Button variant="outline" size="sm">
                      Buy Credits
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions?.slice(0, 10).map((transaction) => (
                      <div key={transaction.id} className="flex justify-between items-center py-2">
                        <div>
                          <p className="text-sm font-medium">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.createdAt!).toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`text-sm font-semibold ${
                          transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
