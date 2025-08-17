import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle, TrendingUp, Users } from "lucide-react";

export default function BacklogWidget() {
  // Get system-wide generation queue stats
  const { data: queueStats, isLoading } = useQuery({
    queryKey: ["/api/queue/stats"],
    retry: false,
  });

  if (isLoading) {
    return (
      <Card className="bg-card-bg border-card-border">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Clock className="h-5 w-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mock data for demonstration - in real app this would come from API
  const mockStats = {
    totalInQueue: 23,
    currentlyProcessing: 4,
    averageWaitTime: 3.5,
    completedToday: 187,
    systemLoad: "normal"
  };

  const stats = (queueStats as any) || mockStats;
  
  const getSystemLoadColor = (load: string) => {
    switch (load) {
      case 'low':
        return 'text-green-400';
      case 'normal':
        return 'text-blue-400';
      case 'high':
        return 'text-yellow-400';
      case 'critical':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getSystemLoadIcon = (load: string) => {
    switch (load) {
      case 'low':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'normal':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="bg-card-bg border-card-border">
      <CardHeader>
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <Clock className="h-5 w-5" />
          System Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{stats.totalInQueue}</div>
            <div className="text-sm text-gray-400">In Queue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats.currentlyProcessing}</div>
            <div className="text-sm text-gray-400">Processing</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Average Wait:</span>
            <span className="text-white">{stats.averageWaitTime} min</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Completed Today:</span>
            <span className="text-green-400">{stats.completedToday}</span>
          </div>
          <div className="flex justify-between text-sm items-center">
            <span className="text-gray-400">System Load:</span>
            <div className="flex items-center gap-1">
              {getSystemLoadIcon(stats.systemLoad)}
              <span className={getSystemLoadColor(stats.systemLoad)}>
                {stats.systemLoad}
              </span>
            </div>
          </div>
        </div>

        {stats.systemLoad === 'high' || stats.systemLoad === 'critical' ? (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-yellow-400 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>High demand - longer wait times expected</span>
            </div>
          </div>
        ) : (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>System running smoothly</span>
            </div>
          </div>
        )}

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => window.location.href = "/queue"}
        >
          <Users className="h-4 w-4 mr-2" />
          View My Queue
        </Button>
      </CardContent>
    </Card>
  );
}