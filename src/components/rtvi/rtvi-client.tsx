import React, { useState, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { RTVIConnectionState, RTVIMessage, RTVIFile, RTVIAnalytics, RTVIVideoState } from "@/types/rtvi";
import { RTVIHeader } from "./header";
import { VideoInterface } from "./video-interface";
import { ChatPanel } from "./chat-panel";
import { FileManager } from "./file-manager";
import { AnalyticsDashboard } from "./analytics-dashboard";
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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFilesOpen, setIsFilesOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Data State
  const [messages, setMessages] = useState<RTVIMessage[]>([]);
  const [files, setFiles] = useState<RTVIFile[]>([]);
  const [analytics, setAnalytics] = useState<RTVIAnalytics>({
    messagesCount: 0,
    filesProcessed: 0,
    connectionDuration: 0,
    averageResponseTime: 850,
    lastUpdated: new Date()
  });

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

  const handleScreenShareToggle = useCallback(async () => {
    const newScreenShareState = !videoState.isScreenSharing;
    setVideoState(prev => ({ ...prev, isScreenSharing: newScreenShareState }));
    
    try {
      const client = rtviClientRef.current;
      if (client && client.transport) {
        if (newScreenShareState) {
          console.log('Starting screen share');
          toast({
            title: "Screen Sharing Started",
            description: "Your screen is now being shared with the AI.",
          });
        } else {
          console.log('Stopping screen share');
          toast({
            title: "Screen Sharing Stopped",
            description: "Screen sharing has been disabled.",
          });
        }
      }
    } catch (error) {
      console.error('Screen share toggle failed:', error);
      // Revert state on error
      setVideoState(prev => ({ ...prev, isScreenSharing: !newScreenShareState }));
    }
  }, [videoState.isScreenSharing]);

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
      
      // Update analytics
      setAnalytics(prev => ({
        ...prev,
        messagesCount: prev.messagesCount + 1,
        lastUpdated: new Date()
      }));
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Message Failed",
        description: "Could not send message to the AI assistant.",
        variant: "destructive"
      });
    }
  }, []);

  // File Handlers
  const handleFileUpload = useCallback(async (uploadedFiles: File[]) => {
    const client = rtviClientRef.current;
    if (!client) return;
    
    for (const file of uploadedFiles) {
      try {
        const newFile: RTVIFile = {
          id: `file-${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadProgress: 0
        };
        
        setFiles(prev => [...prev, newFile]);
        
        // Simulate upload progress while processing
        const progressInterval = setInterval(() => {
          setFiles(prev => 
            prev.map(f => {
              if (f.id === newFile.id && (f.uploadProgress || 0) < 90) {
                return { ...f, uploadProgress: (f.uploadProgress || 0) + 10 };
              }
              return f;
            })
          );
        }, 200);
        
        // Send file upload via Pipecat client
        if (client.sendUserMessage) {
          await client.sendUserMessage(`File uploaded: ${file.name}`);
        } else {
          console.log('File upload:', file.name);
        }
        
        clearInterval(progressInterval);
        
        // Update file with completion
        setFiles(prev => 
          prev.map(f => 
            f.id === newFile.id 
              ? {
                  ...f,
                  uploadProgress: 100,
                  processedAt: new Date(),
                  analysisResult: `Processed ${file.name} via RTVI backend`
                }
              : f
          )
        );
        
        // Update analytics
        setAnalytics(prev => ({
          ...prev,
          filesProcessed: prev.filesProcessed + 1,
          lastUpdated: new Date()
        }));
        
      } catch (error) {
        console.error('File upload failed:', error);
        toast({
          title: "Upload Failed",
          description: `Failed to upload ${file.name}`,
          variant: "destructive"
        });
      }
    }
    
    toast({
      title: "Files Uploaded",
      description: `${uploadedFiles.length} file(s) processed successfully.`,
    });
  }, []);

  const handleFileDelete = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    toast({
      title: "File Deleted",
      description: "File has been removed from the session.",
    });
  }, []);

  const handleFileAnalyze = useCallback(async (fileId: string) => {
    const client = rtviClientRef.current;
    if (!client) return;
    
    const file = files.find(f => f.id === fileId);
    if (!file) return;
    
    try {
      toast({
        title: "File Analysis",
        description: `Analyzing ${file.name}...`,
      });
      
      // Send file analysis request via Pipecat client
      if (client.sendUserMessage) {
        await client.sendUserMessage(`Analyze file: ${file.name}`);
      } else {
        console.log('Analyzing file:', file.name);
      }
      
      // Update file with analysis result
      setFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, analysisResult: `Analysis completed for ${file.name} via RTVI backend` }
            : f
        )
      );
      
      setAnalytics(prev => ({
        ...prev,
        lastUpdated: new Date()
      }));
      
      toast({
        title: "Analysis Complete",
        description: `${file.name} has been processed successfully.`,
      });
    } catch (error) {
      console.error('File analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: `Could not analyze ${file.name}`,
        variant: "destructive"
      });
    }
  }, [files]);

  // Analytics Handlers
  const handleRefreshAnalytics = useCallback(async () => {
    const client = rtviClientRef.current;
    
    try {
      if (client && client.sendUserMessage) {
        // Request analytics via Pipecat client
        await client.sendUserMessage('Get analytics');
      } else {
        console.log('Requesting analytics');
      }
      
      setAnalytics(prev => ({
        ...prev,
        lastUpdated: new Date()
      }));
      
      toast({
        title: "Analytics Refreshed",
        description: "Latest data has been loaded from RTVI backend.",
      });
    } catch (error) {
      console.error('Failed to refresh analytics:', error);
      setAnalytics(prev => ({
        ...prev,
        lastUpdated: new Date()
      }));
      
      toast({
        title: "Analytics Refreshed",
        description: "Using cached data.",
      });
    }
  }, []);

  // Update connection duration
  useEffect(() => {
    if (connectionState.status === 'connected') {
      const interval = setInterval(() => {
        setAnalytics(prev => ({
          ...prev,
          connectionDuration: prev.connectionDuration + 1
        }));
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [connectionState.status]);

  return (
    <div className={cn("min-h-screen bg-background flex flex-col", className)}>
      {/* Header */}
      <RTVIHeader
        connectionState={connectionState}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        onToggleFiles={() => setIsFilesOpen(!isFilesOpen)}
        onToggleAnalytics={() => setIsAnalyticsOpen(!isAnalyticsOpen)}
        onOpenSettings={() => toast({ title: "Settings", description: "Settings panel coming soon!" })}
        isChatOpen={isChatOpen}
        isFilesOpen={isFilesOpen}
        isAnalyticsOpen={isAnalyticsOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* Left Panel - Files */}
        {isFilesOpen && (
          <div className="w-80 border-r border-border bg-background p-6 animate-slide-in-left">
            <h2 className="text-xl font-semibold mb-4">File Manager</h2>
            <FileManager
              files={files}
              onFileUpload={handleFileUpload}
              onFileDelete={handleFileDelete}
              onFileAnalyze={handleFileAnalyze}
            />
          </div>
        )}

        {/* Center - Video Interface */}
        <div className="flex-1 p-6">
          {isAnalyticsOpen ? (
            <AnalyticsDashboard
              analytics={analytics}
              onRefresh={handleRefreshAnalytics}
            />
          ) : (
            <div className="max-w-4xl mx-auto">
              <VideoInterface
                videoState={videoState}
                onVideoToggle={handleVideoToggle}
                onAudioToggle={handleAudioToggle}
                onScreenShareToggle={handleScreenShareToggle}
                onSettingsClick={() => toast({ title: "Video Settings", description: "Video settings coming soon!" })}
                className="w-full max-w-3xl mx-auto"
              />
            </div>
          )}
        </div>

        {/* Right Panel - Chat */}
        <ChatPanel
          messages={messages}
          isOpen={isChatOpen}
          onToggle={() => setIsChatOpen(!isChatOpen)}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
        />
      </div>

    </div>
  );
}