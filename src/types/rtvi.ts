// RTVI Client Types and Interfaces

export interface RTVIConnectionState {
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  participantCount: number;
  sessionId?: string;
  error?: string;
}

export interface RTVIMessage {
  id: string;
  type: 'user' | 'bot' | 'system' | 'voice';
  content: string;
  timestamp: Date;
  sender?: string;
  metadata?: Record<string, any>;
}

export interface RTVIFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  uploadProgress?: number;
  processedAt?: Date;
  analysisResult?: string;
  error?: string;
}

export interface RTVIAnalytics {
  messagesCount: number;
  filesProcessed: number;
  connectionDuration: number;
  averageResponseTime: number;
  lastUpdated: Date;
}

export interface RTVIConfig {
  serverUrl: string;
  maxFileSize: number;
  supportedFileTypes: string[];
  enableVideo: boolean;
  enableAudio: boolean;
  enableScreenShare: boolean;
  enableChat: boolean;
}

export interface RTVIVideoState {
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
  isMuted: boolean;
  hasVideo: boolean;
}

export interface RTVITranscript {
  id: string;
  text: string;
  speaker: 'user' | 'bot';
  timestamp: Date;
  confidence?: number;
}

export type RTVIEventType = 
  | 'connection-status-changed'
  | 'message-received'
  | 'file-uploaded'
  | 'file-processed'
  | 'video-state-changed'
  | 'transcript-received'
  | 'error';

export interface RTVIEvent<T = any> {
  type: RTVIEventType;
  data: T;
  timestamp: Date;
}