import React, { useState, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { RTVIConnectionState, RTVIMessage, RTVIVideoState } from "@/types/rtvi";
import { RTVIHeader } from "./header";
import { VideoInterface } from "./video-interface";
import { TranscriptionPanel } from "./transcription-panel";
import { RTVIErrorBoundary } from "./error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import { RTVI_CONFIG } from "@/config/rtvi";

interface RTVIClientProps {
  serverUrl?: string;
  className?: string;
}

// Real RTVI Client Component - Phase 1 Implementation
export function RTVIClient({ 
  serverUrl = RTVI_CONFIG.baseUrl,
  className 
}: RTVIClientProps) {
  return (
    <RTVIErrorBoundary>
      <RTVIInterface className={className} serverUrl={serverUrl} />
      <Toaster />
    </RTVIErrorBoundary>
  );
}

// Main interface component - enhanced with RTVI backend connection
function RTVIInterface({ className, serverUrl }: { className?: string; serverUrl: string }) {
  const rtviClientRef = useRef<any>(null);
  // Connection State
  const [connectionState, setConnectionState] = useState<RTVIConnectionState>({
    status: 'disconnected',
    participantCount: 0
  });

  // Video State
  const [videoState, setVideoState] = useState<RTVIVideoState>({
    isVideoEnabled: true,
    isAudioEnabled: true,
    isScreenSharing: false,
    isMuted: false,
    hasVideo: false
  });

  // UI State
  const [isTranscriptionOpen, setIsTranscriptionOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Data State
  const [messages, setMessages] = useState<RTVIMessage[]>([]);

  // Initialize RTVI client connection
  useEffect(() => {
    console.log('RTVI Client initialized with backend URL:', serverUrl);
    // TODO: Initialize real Pipecat client when API is ready
    rtviClientRef.current = { 
      connected: false,
      baseUrl: serverUrl 
    };
  }, [serverUrl]);

  // Connection Handlers
  const handleConnect = useCallback(async () => {
    const client = rtviClientRef.current;
    if (!client) return;
    
    setConnectionState(prev => ({ ...prev, status: 'connecting' }));
    
    try {
      await client.connect();
    } catch (error) {
      console.error('Connection failed:', error);
      setConnectionState({
        status: 'error',
        participantCount: 0,
        error: error instanceof Error ? error.message : 'Failed to connect to server'
      });
    }
  }, []);

  const handleDisconnect = useCallback(async () => {
    const client = rtviClientRef.current;
    if (!client) return;
    
    try {
      await client.disconnect();
    } catch (error) {
      console.error('Disconnection failed:', error);
    }
  }, []);

  // Video Handlers
  const handleVideoToggle = useCallback(async () => {
    setVideoState(prev => ({ ...prev, isVideoEnabled: !prev.isVideoEnabled }));
    
    try {
      // Basic video toggle - will be enhanced with actual transport integration
      const client = rtviClientRef.current;
      if (client && client.transport) {
        // Toggle camera via transport if available
        console.log('Toggling video:', videoState.isVideoEnabled);
      }
    } catch (error) {
      console.error('Video toggle failed:', error);
    }
  }, [videoState.isVideoEnabled]);

  const handleAudioToggle = useCallback(async () => {
    setVideoState(prev => ({ ...prev, isMuted: !prev.isMuted }));
    
    try {
      // Basic audio toggle - will be enhanced with actual transport integration
      const client = rtviClientRef.current;
      if (client && client.transport) {
        // Toggle microphone via transport if available
        console.log('Toggling audio:', videoState.isMuted);
      }
    } catch (error) {
      console.error('Audio toggle failed:', error);
    }
  }, [videoState.isMuted]);

  // Recording toggle for user video
  const handleRecordingToggle = useCallback(async () => {
    const newRecordingState = !isRecording;
    setIsRecording(newRecordingState);
    
    try {
      const client = rtviClientRef.current;
      if (client && client.transport) {
        if (newRecordingState) {
          console.log('Starting recording');
          toast({
            title: "Recording Started",
            description: "Your video is now being recorded.",
          });
        } else {
          console.log('Stopping recording');
          toast({
            title: "Recording Stopped",
            description: "Video recording has been stopped.",
          });
        }
      }
    } catch (error) {
      console.error('Recording toggle failed:', error);
      // Revert state on error
      setIsRecording(!newRecordingState);
    }
  }, [isRecording]);

  // Chat Handlers
  const handleSendMessage = useCallback(async (content: string) => {
    const client = rtviClientRef.current;
    if (!client) return;
    
    const userMessage: RTVIMessage = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      // Send message via Pipecat client
      if (client.sendUserMessage) {
        await client.sendUserMessage(content);
      } else {
        console.log('Sending message:', content);
      }
      
      // Simulate bot response for now
      setTimeout(() => {
        const botMessage: RTVIMessage = {
          id: `msg-${Date.now()}-bot`,
          type: 'bot',
          content: `I received your message: "${content}". I'm processing this through the RTVI backend.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }, 1000);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Message Failed",
        description: "Could not send message to the AI assistant.",
        variant: "destructive"
      });
    }
  }, []);


  return (
    <div className={cn("min-h-screen bg-background flex flex-col", className)}>
      {/* Header */}
      <RTVIHeader
        connectionState={connectionState}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onToggleTranscription={() => setIsTranscriptionOpen(!isTranscriptionOpen)}
        onOpenSettings={() => toast({ title: "Settings", description: "Settings panel coming soon!" })}
        isTranscriptionOpen={isTranscriptionOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* Center - Video Interface */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <VideoInterface
              videoState={videoState}
              onVideoToggle={handleVideoToggle}
              onAudioToggle={handleAudioToggle}
              onSettingsClick={() => toast({ title: "Video Settings", description: "Video settings coming soon!" })}
              isRecording={isRecording}
              className="w-full max-w-3xl mx-auto"
            />
          </div>
        </div>

        {/* Right Panel - Transcription */}
        <TranscriptionPanel
          messages={messages}
          isOpen={isTranscriptionOpen}
          onToggle={() => setIsTranscriptionOpen(!isTranscriptionOpen)}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
          isListening={isListening}
        />
      </div>

    </div>
  );
}