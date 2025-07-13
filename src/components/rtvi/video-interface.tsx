import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { RTVIVideoState } from "@/types/rtvi";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  MonitorSpeaker, 
  MonitorOff,
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
  onScreenShareToggle: () => void;
  onSettingsClick: () => void;
  className?: string;
}

export function VideoInterface({
  videoState,
  onVideoToggle,
  onAudioToggle,
  onScreenShareToggle,
  onSettingsClick,
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
      {/* Bot Video Feed */}
      <div className="relative w-full h-full">
        {videoState.hasVideo ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
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
                <h3 className="text-2xl font-bold text-white">RTVI Assistant</h3>
                <p className="text-white/80">Ready for multi-modal conversation</p>
              </div>
              
              <div className="flex items-center justify-center gap-6 text-white/60">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span className="text-sm">Voice Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span className="text-sm">Video Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span className="text-sm">Files Ready</span>
                </div>
              </div>
            </div>
            
            {/* Animated overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 animate-pulse-glow" />
          </div>
        )}

        {/* Video Controls Overlay */}
        <div className="video-controls opacity-25 group-hover:opacity-100 transition-all duration-300">
          <Button
            variant="ghost"
            size="sm"
            onClick={onVideoToggle}
            className={cn(
              "glass-panel p-2",
              videoState.isVideoEnabled 
                ? "text-white hover:bg-white/20" 
                : "text-destructive hover:bg-destructive/20"
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
              "glass-panel p-2",
              !videoState.isMuted 
                ? "text-white hover:bg-white/20" 
                : "text-destructive hover:bg-destructive/20"
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
            onClick={onScreenShareToggle}
            className={cn(
              "glass-panel p-2",
              videoState.isScreenSharing 
                ? "text-accent hover:bg-accent/20" 
                : "text-white hover:bg-white/20"
            )}
          >
            {videoState.isScreenSharing ? (
              <MonitorSpeaker className="h-4 w-4" />
            ) : (
              <MonitorOff className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="glass-panel p-2 text-white hover:bg-white/20"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onSettingsClick}
            className="glass-panel p-2 text-white hover:bg-white/20"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Status Indicators */}
        <div className="absolute top-4 left-4 flex gap-2">
          {videoState.isScreenSharing && (
            <div className="glass-panel px-2 py-1 text-xs font-medium text-accent-foreground bg-accent/80">
              Screen Sharing
            </div>
          )}
          
          {videoState.isMuted && (
            <div className="glass-panel px-2 py-1 text-xs font-medium text-destructive-foreground bg-destructive/80">
              Muted
            </div>
          )}
        </div>

        {/* Recording Indicator */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-2 glass-panel px-3 py-1">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
            <span className="text-xs font-medium text-white">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}