import { cn } from "@/lib/utils";
import { RTVIConnectionState } from "@/types/rtvi";
import { 
  Zap, 
  MessageSquare, 
  Upload, 
  BarChart3,
  Settings,
  Power,
  PowerOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectionStatus } from "./connection-status";

interface RTVIHeaderProps {
  connectionState: RTVIConnectionState;
  onConnect: () => void;
  onDisconnect: () => void;
  onToggleChat: () => void;
  onToggleFiles: () => void;
  onToggleAnalytics: () => void;
  onOpenSettings: () => void;
  isChatOpen?: boolean;
  isFilesOpen?: boolean;
  isAnalyticsOpen?: boolean;
  className?: string;
}

export function RTVIHeader({
  connectionState,
  onConnect,
  onDisconnect,
  onToggleChat,
  onToggleFiles,
  onToggleAnalytics,
  onOpenSettings,
  isChatOpen = false,
  isFilesOpen = false,
  isAnalyticsOpen = false,
  className
}: RTVIHeaderProps) {
  const isConnected = connectionState.status === 'connected';
  const isConnecting = connectionState.status === 'connecting';

  return (
    <header className={cn(
      "h-16 border-b border-border bg-background/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40",
      className
    )}>
      {/* Logo and Branding */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient-primary">RTVI Client</h1>
            <p className="text-xs text-muted-foreground">Real-Time Voice Intelligence</p>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="flex-1 max-w-md mx-8">
        <ConnectionStatus connectionState={connectionState} />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Panel Toggles */}
        <div className="flex items-center gap-1 mr-4">
          <Button
            variant={isChatOpen ? "default" : "ghost"}
            size="sm"
            onClick={onToggleChat}
            className="hover-scale"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
          </Button>
          
          <Button
            variant={isFilesOpen ? "default" : "ghost"}
            size="sm"
            onClick={onToggleFiles}
            className="hover-scale"
          >
            <Upload className="h-4 w-4 mr-2" />
            Files
          </Button>
          
          <Button
            variant={isAnalyticsOpen ? "default" : "ghost"}
            size="sm"
            onClick={onToggleAnalytics}
            className="hover-scale"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>

        {/* Settings */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenSettings}
          className="hover-scale"
        >
          <Settings className="h-4 w-4" />
        </Button>

        {/* Connection Control */}
        {isConnected ? (
          <Button
            variant="destructive"
            size="sm"
            onClick={onDisconnect}
            className="hover-scale ml-2"
          >
            <PowerOff className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={onConnect}
            disabled={isConnecting}
            className="btn-gradient-primary ml-2"
          >
            <Power className="h-4 w-4 mr-2" />
            {isConnecting ? 'Connecting...' : 'Connect'}
          </Button>
        )}
      </div>
    </header>
  );
}