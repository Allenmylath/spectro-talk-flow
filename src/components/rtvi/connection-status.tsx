import { cn } from "@/lib/utils";
import { RTVIConnectionState } from "@/types/rtvi";
import { Wifi, WifiOff, Users, AlertCircle } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ConnectionStatusProps {
  connectionState: RTVIConnectionState;
  className?: string;
}

export function ConnectionStatus({ connectionState, className }: ConnectionStatusProps) {
  const { status, participantCount, error } = connectionState;

  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: Wifi,
          text: 'Connected',
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          indicatorClass: 'connected'
        };
      case 'connecting':
        return {
          icon: null,
          text: 'Connecting...',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          indicatorClass: 'connecting'
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: error || 'Connection Error',
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive/20',
          indicatorClass: 'disconnected'
        };
      default:
        return {
          icon: WifiOff,
          text: 'Disconnected',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/10',
          borderColor: 'border-muted/20',
          indicatorClass: 'disconnected'
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <div className={cn(
      "glass-panel px-4 py-3 flex items-center justify-between",
      config.bgColor,
      config.borderColor,
      className
    )}>
      <div className="flex items-center gap-3">
        <div className={cn("status-indicator", config.indicatorClass)} />
        
        <div className="flex items-center gap-2">
          {status === 'connecting' ? (
            <LoadingSpinner size="sm" />
          ) : StatusIcon ? (
            <StatusIcon className={cn("h-4 w-4", config.color)} />
          ) : null}
          
          <span className={cn("font-medium text-sm", config.color)}>
            {config.text}
          </span>
        </div>
      </div>

      {status === 'connected' && (
        <div className="flex items-center gap-1 text-muted-foreground">
          <Users className="h-4 w-4" />
          <span className="text-sm font-medium">{participantCount}</span>
        </div>
      )}
    </div>
  );
}