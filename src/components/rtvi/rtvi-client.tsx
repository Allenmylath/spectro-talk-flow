import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { RTVIConnectionState, RTVIMessage, RTVIFile, RTVIAnalytics, RTVIVideoState } from "@/types/rtvi";
import { RTVIHeader } from "./header";
import { VideoInterface } from "./video-interface";
import { ChatPanel } from "./chat-panel";
import { FileManager } from "./file-manager";
import { AnalyticsDashboard } from "./analytics-dashboard";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";

interface RTVIClientProps {
  serverUrl?: string;
  className?: string;
}

export function RTVIClient({ 
  serverUrl = "ws://localhost:7860",
  className 
}: RTVIClientProps) {
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

  // Connection Handlers
  const handleConnect = useCallback(async () => {
    setConnectionState(prev => ({ ...prev, status: 'connecting' }));
    
    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setConnectionState({
        status: 'connected',
        participantCount: 2,
        sessionId: `session-${Date.now()}`
      });
      
      setVideoState(prev => ({ ...prev, hasVideo: true }));
      
      // Add welcome message
      const welcomeMessage: RTVIMessage = {
        id: `msg-${Date.now()}`,
        type: 'system',
        content: 'Connected to RTVI Assistant',
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
      
      toast({
        title: "Connected Successfully",
        description: "RTVI Assistant is ready to help you.",
      });
    } catch (error) {
      setConnectionState({
        status: 'error',
        participantCount: 0,
        error: 'Failed to connect to server'
      });
      
      toast({
        title: "Connection Failed",
        description: "Could not connect to the RTVI server.",
        variant: "destructive"
      });
    }
  }, []);

  const handleDisconnect = useCallback(() => {
    setConnectionState({
      status: 'disconnected',
      participantCount: 0
    });
    
    setVideoState(prev => ({ ...prev, hasVideo: false }));
    setMessages([]);
    setFiles([]);
    
    toast({
      title: "Disconnected",
      description: "Session ended successfully.",
    });
  }, []);

  // Video Handlers
  const handleVideoToggle = useCallback(() => {
    setVideoState(prev => ({ ...prev, isVideoEnabled: !prev.isVideoEnabled }));
  }, []);

  const handleAudioToggle = useCallback(() => {
    setVideoState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);

  const handleScreenShareToggle = useCallback(() => {
    setVideoState(prev => ({ ...prev, isScreenSharing: !prev.isScreenSharing }));
    
    if (!videoState.isScreenSharing) {
      toast({
        title: "Screen Sharing Started",
        description: "Your screen is now being shared with the AI.",
      });
    } else {
      toast({
        title: "Screen Sharing Stopped",
        description: "Screen sharing has been disabled.",
      });
    }
  }, [videoState.isScreenSharing]);

  // Chat Handlers
  const handleSendMessage = useCallback(async (content: string) => {
    const userMessage: RTVIMessage = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const botMessage: RTVIMessage = {
        id: `msg-${Date.now()}-bot`,
        type: 'bot',
        content: `I understand you said: "${content}". I'm here to help with your multi-modal AI needs. You can share files, ask questions, or start a video conversation!`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      
      // Update analytics
      setAnalytics(prev => ({
        ...prev,
        messagesCount: prev.messagesCount + 2,
        lastUpdated: new Date()
      }));
    }, 1500);
  }, []);

  // File Handlers
  const handleFileUpload = useCallback((uploadedFiles: File[]) => {
    const newFiles: RTVIFile[] = uploadedFiles.map(file => ({
      id: `file-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadProgress: 0
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // Simulate upload progress
    newFiles.forEach((file, index) => {
      const interval = setInterval(() => {
        setFiles(prev => 
          prev.map(f => {
            if (f.id === file.id) {
              const newProgress = (f.uploadProgress || 0) + 10;
              if (newProgress >= 100) {
                clearInterval(interval);
                return {
                  ...f,
                  uploadProgress: 100,
                  processedAt: new Date(),
                  analysisResult: `Analysis complete for ${f.name}`
                };
              }
              return { ...f, uploadProgress: newProgress };
            }
            return f;
          })
        );
      }, 200);
    });
    
    toast({
      title: "Files Uploaded",
      description: `${uploadedFiles.length} file(s) uploaded successfully.`,
    });
  }, []);

  const handleFileDelete = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    toast({
      title: "File Deleted",
      description: "File has been removed from the session.",
    });
  }, []);

  const handleFileAnalyze = useCallback((fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      toast({
        title: "File Analysis",
        description: `Analyzing ${file.name}...`,
      });
      
      // Simulate analysis
      setTimeout(() => {
        setAnalytics(prev => ({
          ...prev,
          filesProcessed: prev.filesProcessed + 1,
          lastUpdated: new Date()
        }));
        
        toast({
          title: "Analysis Complete",
          description: `${file.name} has been processed successfully.`,
        });
      }, 2000);
    }
  }, [files]);

  // Analytics Handlers
  const handleRefreshAnalytics = useCallback(() => {
    setAnalytics(prev => ({
      ...prev,
      lastUpdated: new Date()
    }));
    
    toast({
      title: "Analytics Refreshed",
      description: "Latest data has been loaded.",
    });
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

      <Toaster />
    </div>
  );
}