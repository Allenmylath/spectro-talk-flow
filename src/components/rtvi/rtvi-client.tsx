// src/components/rtvi/rtvi-client.tsx
import React, { useState, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { 
  RTVIEvent,
  TransportState,
  Participant,
  TranscriptData,
  BotLLMTextData
} from '@pipecat-ai/client-js';
import { RTVIProvider, usePipecat } from '@/providers/RTVIProvider';
import { RTVIConnectionState, RTVIMessage, RTVIVideoState, RTVIFile, RTVIAnalytics } from "@/types/rtvi";
import { RTVI_CONFIG } from '@/config/rtvi';
import { RTVIHeader } from "./header";
import { VideoInterface } from "./video-interface";
import { TranscriptionPanel } from "./transcription-panel";
import { FileManager } from "./file-manager";
import { AnalyticsDashboard } from "./analytics-dashboard";
import { RTVIErrorBoundary } from "./error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";

interface RTVIClientProps {
  serverUrl?: string;
  className?: string;
}

// Real RTVI Client Component - Connected to Pipecat
export function RTVIClient({ className }: RTVIClientProps) {
  return (
    <RTVIProvider>
      <RTVIErrorBoundary>
        <RTVIInterface className={className} />
        <Toaster />
      </RTVIErrorBoundary>
    </RTVIProvider>
  );
}

// Main interface component - enhanced with real RTVI backend connection
function RTVIInterface({ className }: { className?: string }) {
  const client = usePipecat();
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const audioElementRef = useRef<HTMLAudioElement>(null);

  // State management
  const [connectionState, setConnectionState] = useState<RTVIConnectionState>({
    status: 'disconnected',
    participantCount: 0
  });

  const [videoState, setVideoState] = useState<RTVIVideoState>({
    isVideoEnabled: true,
    isAudioEnabled: true,
    isScreenSharing: false,
    isMuted: false,
    hasVideo: false
  });

  const [isTranscriptionOpen, setIsTranscriptionOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
  
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const [messages, setMessages] = useState<RTVIMessage[]>([]);
  const [files, setFiles] = useState<RTVIFile[]>([]);
  const [analytics, setAnalytics] = useState<RTVIAnalytics>({
    messagesCount: 0,
    filesProcessed: 0,
    connectionDuration: 0,
    averageResponseTime: 0,
    lastUpdated: new Date()
  });

  // Convert transport state to connection state
  useEffect(() => {
    if (!client) return;

    const handleTransportStateChange = (state: TransportState) => {
      const statusMap: Record<TransportState, RTVIConnectionState['status']> = {
        'disconnected': 'disconnected',
        'initializing': 'connecting',
        'initialized': 'connecting',
        'authenticating': 'connecting',
        'connecting': 'connecting', 
        'connected': 'connected',
        'ready': 'connected',
        'disconnecting': 'disconnected',
        'error': 'error'
      };

      setConnectionState(prev => ({
        ...prev,
        status: statusMap[state] || 'disconnected'
      }));
    };

    client.on(RTVIEvent.TransportStateChanged, handleTransportStateChange);
    
    return () => {
      client.off(RTVIEvent.TransportStateChanged, handleTransportStateChange);
    };
  }, [client]);

  // Track and media handling
  useEffect(() => {
    if (!client) return;

    const handleTrackStarted = (track: MediaStreamTrack, participant: Participant) => {
      console.log('Track started:', track.kind, participant);
      
      if (track.kind === "audio" && !participant.local) {
        // Handle bot audio
        if (audioElementRef.current) {
          audioElementRef.current.srcObject = new MediaStream([track]);
        }
      }
      
      if (track.kind === "video" && !participant.local) {
        // Handle bot video
        if (videoContainerRef.current) {
          const video = document.createElement("video");
          video.srcObject = new MediaStream([track]);
          video.autoplay = true;
          video.style.width = "100%";
          video.style.height = "100%";
          video.style.objectFit = "cover";
          videoContainerRef.current.appendChild(video);
        }
      }

      // Update video state
      if (participant.local) {
        setVideoState(prev => ({
          ...prev,
          isVideoEnabled: track.kind === "video",
          isAudioEnabled: track.kind === "audio",
          isMuted: track.kind === "audio" ? !track.enabled : prev.isMuted
        }));
      } else {
        setVideoState(prev => ({
          ...prev,
          hasVideo: track.kind === "video" || prev.hasVideo
        }));
      }
    };

    const handleTrackStopped = (track: MediaStreamTrack, participant: Participant) => {
      console.log('Track stopped:', track.kind, participant);
      
      if (track.kind === "video" && !participant.local && videoContainerRef.current) {
        // Clean up bot video elements
        const videos = videoContainerRef.current.querySelectorAll('video');
        videos.forEach(video => video.remove());
      }
    };

    client.on(RTVIEvent.TrackStarted, handleTrackStarted);
    client.on(RTVIEvent.TrackStopped, handleTrackStopped);

    return () => {
      client.off(RTVIEvent.TrackStarted, handleTrackStarted);
      client.off(RTVIEvent.TrackStopped, handleTrackStopped);
    };
  }, [client]);

  // Message and bot event handling
  useEffect(() => {
    if (!client) return;

    const handleUserTranscript = (data: TranscriptData) => {
      if (data.final) {
        const userMessage: RTVIMessage = {
          id: `msg-${Date.now()}-user`,
          type: 'user',
          content: data.text,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setAnalytics(prev => ({ ...prev, messagesCount: prev.messagesCount + 1 }));
      }
    };

    const handleBotTranscript = (data: BotLLMTextData) => {
      const botMessage: RTVIMessage = {
        id: `msg-${Date.now()}-bot`,
        type: 'bot', 
        content: data.text,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setAnalytics(prev => ({ ...prev, messagesCount: prev.messagesCount + 1 }));
    };

    const handleUserStartedSpeaking = () => {
      setIsListening(true);
    };

    const handleUserStoppedSpeaking = () => {
      setIsListening(false);
    };

    const handleBotLlmStarted = () => {
      setIsTyping(true);
    };

    const handleBotLlmStopped = () => {
      setIsTyping(false);
    };

    const handleBotConnected = (participant?: Participant) => {
      console.log('Bot connected:', participant);
      setConnectionState(prev => ({
        ...prev,
        participantCount: prev.participantCount + 1
      }));
    };

    const handleBotDisconnected = (participant?: Participant) => {
      console.log('Bot disconnected:', participant);
      setConnectionState(prev => ({
        ...prev,
        participantCount: Math.max(0, prev.participantCount - 1)
      }));
    };

    // Add event listeners
    client.on(RTVIEvent.BotConnected, handleBotConnected);
    client.on(RTVIEvent.BotDisconnected, handleBotDisconnected);
    client.on(RTVIEvent.UserTranscript, handleUserTranscript);
    client.on(RTVIEvent.BotTranscript, handleBotTranscript);
    client.on(RTVIEvent.UserStartedSpeaking, handleUserStartedSpeaking);
    client.on(RTVIEvent.UserStoppedSpeaking, handleUserStoppedSpeaking);
    client.on(RTVIEvent.BotLlmStarted, handleBotLlmStarted);
    client.on(RTVIEvent.BotLlmStopped, handleBotLlmStopped);

    // Cleanup event listeners
    return () => {
      client.off(RTVIEvent.BotConnected, handleBotConnected);
      client.off(RTVIEvent.BotDisconnected, handleBotDisconnected);
      client.off(RTVIEvent.UserTranscript, handleUserTranscript);
      client.off(RTVIEvent.BotTranscript, handleBotTranscript);
      client.off(RTVIEvent.UserStartedSpeaking, handleUserStartedSpeaking);
      client.off(RTVIEvent.UserStoppedSpeaking, handleUserStoppedSpeaking);
      client.off(RTVIEvent.BotLlmStarted, handleBotLlmStarted);
      client.off(RTVIEvent.BotLlmStopped, handleBotLlmStopped);
    };
  }, [client]);

  // Connection Handlers
  const handleConnect = useCallback(async () => {
    if (!client) {
      console.error('RTVI client is not initialized');
      return;
    }

    try {
      await client.connect();
      toast({
        title: "Connected",
        description: "Successfully connected to the AI assistant.",
      });
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to the AI assistant.",
        variant: "destructive"
      });
    }
  }, [client]);

  const handleDisconnect = useCallback(async () => {
    if (!client) return;

    try {
      await client.disconnect();
      setMessages([]);
      setFiles([]);
      toast({
        title: "Disconnected",
        description: "Disconnected from the AI assistant.",
      });
    } catch (error) {
      console.error('Disconnection error:', error);
    }
  }, [client]);

  // Video/Audio Controls
  const handleVideoToggle = useCallback(async () => {
    if (!client) return;
    
    try {
      const isEnabled = client.isCamEnabled;
      client.enableCam(!isEnabled);
    } catch (error) {
      console.error('Video toggle failed:', error);
    }
  }, [client]);

  const handleAudioToggle = useCallback(async () => {
    if (!client) return;
    
    try {
      const isEnabled = client.isMicEnabled;
      client.enableMic(!isEnabled);
    } catch (error) {
      console.error('Audio toggle failed:', error);
    }
  }, [client]);

  // Chat Handler
  const handleSendMessage = useCallback(async (content: string) => {
    if (!client) return;

    const userMessage: RTVIMessage = {
      id: `msg-${Date.now()}-user-typed`,
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    try {
      // TODO: Send message to bot when the correct API is available
      console.log('Sending message to bot:', content);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Message Failed",
        description: "Could not send message to the AI assistant.",
        variant: "destructive"
      });
    }
  }, [client]);

  // File Handlers
  const handleFileUpload = useCallback(async (uploadFiles: File[]) => {
    const newFiles: RTVIFile[] = uploadFiles.map(file => ({
      id: `file-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadProgress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate file upload progress
    for (const rtviFile of newFiles) {
      try {
        // Update progress
        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setFiles(prev => prev.map(f => 
            f.id === rtviFile.id ? { ...f, uploadProgress: progress } : f
          ));
        }

        // Mark as processed
        setFiles(prev => prev.map(f => 
          f.id === rtviFile.id 
            ? { 
                ...f, 
                processedAt: new Date(), 
                analysisResult: `AI analysis of ${f.name}: This file contains valuable information.`,
                uploadProgress: undefined 
              } 
            : f
        ));

        setAnalytics(prev => ({ ...prev, filesProcessed: prev.filesProcessed + 1 }));

      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.id === rtviFile.id 
            ? { ...f, error: 'Upload failed', uploadProgress: undefined } 
            : f
        ));
      }
    }
  }, []);

  const handleFileDelete = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  const handleFileAnalyze = useCallback((fileId: string) => {
    toast({
      title: "File Analysis",
      description: "File analysis results would be downloaded here.",
    });
  }, []);

  const handleRefreshAnalytics = useCallback(() => {
    setAnalytics(prev => ({
      ...prev,
      lastUpdated: new Date(),
      connectionDuration: prev.connectionDuration + 1
    }));
  }, []);

  const isConnected = connectionState.status === 'connected';

  return (
    <div className={cn("min-h-screen bg-background flex flex-col", className)}>
      {/* Header */}
      <RTVIHeader
        connectionState={connectionState}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onToggleTranscription={() => setIsTranscriptionOpen(!isTranscriptionOpen)}
        onToggleAnalytics={() => setIsAnalyticsOpen(!isAnalyticsOpen)}
        onToggleFileManager={() => setIsFileManagerOpen(!isFileManagerOpen)}
        onOpenSettings={() => toast({ title: "Settings", description: "Settings panel coming soon!" })}
        isTranscriptionOpen={isTranscriptionOpen}
        isAnalyticsOpen={isAnalyticsOpen}
        isFileManagerOpen={isFileManagerOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* Center - Video Interface */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Manual Video Container for Bot Video */}
            <div className="relative">
              {isConnected ? (
                <div className="video-container" ref={videoContainerRef} style={{ width: '100%', height: '400px', backgroundColor: '#000' }}>
                  {/* Bot video will be inserted here by track handler */}
                  <VideoInterface
                    videoState={videoState}
                    onVideoToggle={handleVideoToggle}
                    onAudioToggle={handleAudioToggle}
                    onSettingsClick={() => toast({ title: "Video Settings", description: "Video settings panel coming soon!" })}
                    className="absolute inset-0"
                  />
                </div>
              ) : (
                <VideoInterface
                  videoState={videoState}
                  onVideoToggle={handleVideoToggle}
                  onAudioToggle={handleAudioToggle}
                  onSettingsClick={() => toast({ title: "Video Settings", description: "Video settings panel coming soon!" })}
                  className="w-full max-w-3xl mx-auto"
                />
              )}
            </div>

            {/* Analytics Dashboard */}
            {isAnalyticsOpen && (
              <div className="mt-6">
                <AnalyticsDashboard
                  analytics={analytics}
                  onRefresh={handleRefreshAnalytics}
                />
              </div>
            )}

            {/* File Manager */}
            {isFileManagerOpen && (
              <div className="mt-6">
                <FileManager
                  files={files}
                  onFileUpload={handleFileUpload}
                  onFileDelete={handleFileDelete}
                  onFileAnalyze={handleFileAnalyze}
                />
              </div>
            )}
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

      {/* Manual Audio Element for Bot Audio */}
      <audio ref={audioElementRef} autoPlay style={{ display: 'none' }} />
    </div>
  );
}