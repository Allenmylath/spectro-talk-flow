import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { RTVIVideoState } from "@/types/rtvi";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Settings,
  Maximize2,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import aiAvatarHero from "@/assets/ai-avatar-hero.jpg";

interface VideoInterfaceProps {
  videoState: RTVIVideoState;
  onVideoToggle: () => void;
  onAudioToggle: () => void;
  onSettingsClick: () => void;
  isRecording?: boolean;
  className?: string;
}

export function VideoInterface({
  videoState,
  onVideoToggle,
  onAudioToggle,
  onSettingsClick,
  isRecording = false,
  className
}: VideoInterfaceProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className={cn("video-container group", className)}>
      {/* User Video Feed */}
      <div className="relative w-full h-full">
        {videoState.isVideoEnabled && videoState.hasVideo ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover transform scale-x-[-1]"
            autoPlay
            playsInline
            muted
          />
        ) : (
          <div 
            className="w-full h-full bg-background-secondary flex items-center justify-center relative overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${aiAvatarHero})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="text-center space-y-6 z-10 animate-fade-in">
              <div className="space-y-2">
                <User className="h-16 w-16 mx-auto text-white/60" />
                <h3 className="text-2xl font-bold text-white">
                  {videoState.isVideoEnabled ? 'Camera Loading...' : 'Camera Off'}
                </h3>
                <p className="text-white/80">
                  {videoState.isVideoEnabled 
                    ? 'Connecting to your camera' 
                    : 'Enable camera to see yourself'
                  }
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-6 text-white/60">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    !videoState.isMuted ? "bg-success animate-pulse" : "bg-muted"
                  )} />
                  <span className="text-sm">
                    {!videoState.isMuted ? "Mic Ready" : "Mic Muted"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    videoState.isVideoEnabled ? "bg-success animate-pulse" : "bg-muted"
                  )} />
                  <span className="text-sm">
                    {videoState.isVideoEnabled ? "Camera Ready" : "Camera Off"}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Animated overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 animate-pulse-glow" />
          </div>
        )}

        {/* Video Controls Overlay */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/70 backdrop-blur-sm rounded-lg p-3 opacity-90 hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={onVideoToggle}
            className={cn(
              "h-10 w-10 p-0 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-200",
              videoState.isVideoEnabled 
                ? "text-white hover:text-white" 
                : "text-red-400 hover:text-red-300"
            )}
          >
            {videoState.isVideoEnabled ? (
              <Video className="h-4 w-4" />
            ) : (
              <VideoOff className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onAudioToggle}
            className={cn(
              "h-10 w-10 p-0 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-200",
              !videoState.isMuted 
                ? "text-white hover:text-white" 
                : "text-red-400 hover:text-red-300"
            )}
          >
            {!videoState.isMuted ? (
              <Mic className="h-4 w-4" />
            ) : (
              <MicOff className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="h-10 w-10 p-0 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white hover:text-white transition-all duration-200"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onSettingsClick}
            className="h-10 w-10 p-0 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white hover:text-white transition-all duration-200"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Status Indicators */}
        <div className="absolute top-4 left-4 flex gap-2">
          {videoState.isMuted && (
            <div className="glass-panel px-2 py-1 text-xs font-medium text-destructive-foreground bg-destructive/80">
              Muted
            </div>
          )}
          
          {!videoState.isVideoEnabled && (
            <div className="glass-panel px-2 py-1 text-xs font-medium text-muted-foreground bg-muted/80">
              Camera Off
            </div>
          )}
        </div>

        {/* Recording Indicator */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-2 glass-panel px-3 py-1">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isRecording ? "bg-destructive animate-pulse" : "bg-muted"
            )} />
            <span className="text-xs font-medium text-white">
              {isRecording ? "Recording" : "Ready"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}