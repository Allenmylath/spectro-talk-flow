import { cn } from "@/lib/utils";
import { RTVIAnalytics } from "@/types/rtvi";
import { 
  BarChart3, 
  MessageSquare, 
  FileCheck, 
  Clock, 
  TrendingUp,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyticsDashboardProps {
  analytics: RTVIAnalytics;
  onRefresh: () => void;
  className?: string;
}

export function AnalyticsDashboard({
  analytics,
  onRefresh,
  className
}: AnalyticsDashboardProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const formatResponseTime = (ms: number) => {
    if (ms < 1000) {
      return `${ms}ms`;
    }
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const MetricCard = ({ 
    title, 
    value, 
    icon: Icon, 
    gradient,
    description 
  }: {
    title: string;
    value: string;
    icon: any;
    gradient: string;
    description?: string;
  }) => (
    <Card className="hover-scale transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", gradient)}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics</h2>
          <p className="text-muted-foreground text-sm">
            Last updated: {analytics.lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          className="hover-scale"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Messages"
          value={analytics.messagesCount.toString()}
          icon={MessageSquare}
          gradient="bg-gradient-primary"
          description="Total messages exchanged"
        />
        
        <MetricCard
          title="Files Processed"
          value={analytics.filesProcessed.toString()}
          icon={FileCheck}
          gradient="bg-gradient-secondary"
          description="Successfully analyzed files"
        />
        
        <MetricCard
          title="Session Duration"
          value={formatDuration(analytics.connectionDuration)}
          icon={Clock}
          gradient="bg-gradient-accent"
          description="Current session time"
        />
        
        <MetricCard
          title="Avg Response Time"
          value={formatResponseTime(analytics.averageResponseTime)}
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-orange-500 to-red-500"
          description="AI response latency"
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Performance Overview */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Connection Quality</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span className="text-sm font-medium">Excellent</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Audio Quality</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span className="text-sm font-medium">HD</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Video Quality</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-warning rounded-full" />
                  <span className="text-sm font-medium">Good</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              Activity Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Messages/min</span>
                <span className="text-sm font-medium">
                  {(analytics.messagesCount / Math.max(analytics.connectionDuration / 60, 1)).toFixed(1)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Files/session</span>
                <span className="text-sm font-medium">{analytics.filesProcessed}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Uptime</span>
                <span className="text-sm font-medium text-success">100%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}