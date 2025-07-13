import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { RTVIMessage } from "@/types/rtvi";
import { Send, FileText, X, User, Bot, Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingDots } from "@/components/ui/loading-spinner";

interface TranscriptionPanelProps {
  messages: RTVIMessage[];
  isOpen: boolean;
  onToggle: () => void;
  onSendMessage: (message: string) => void;
  isTyping?: boolean;
  isListening?: boolean;
  className?: string;
}

export function TranscriptionPanel({
  messages,
  isOpen,
  onToggle,
  onSendMessage,
  isTyping = false,
  isListening = false,
  className
}: TranscriptionPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date);
  };

  const exportTranscription = () => {
    const transcript = messages
      .map(msg => `[${formatTime(msg.timestamp)}] ${msg.type === 'user' ? 'User' : 'Bot'}: ${msg.content}`)
      .join('\n');
    
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcription-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredMessages = searchQuery 
    ? messages.filter(msg => 
        msg.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  const TranscriptionEntry = ({ message }: { message: RTVIMessage }) => {
    const isUser = message.type === 'user';
    const isVoiceTranscription = message.type === 'voice';
    const isSystem = message.type === 'system';

    if (isSystem) {
      return (
        <div className="flex justify-center my-2">
          <div className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs font-medium">
            {message.content}
          </div>
        </div>
      );
    }

    return (
      <div className="flex gap-3 animate-fade-in group hover:bg-muted/20 p-2 rounded-lg transition-colors">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          isUser || isVoiceTranscription ? "bg-primary" : "bg-secondary"
        )}>
          {isUser || isVoiceTranscription ? (
            <User className="h-4 w-4 text-primary-foreground" />
          ) : (
            <Bot className="h-4 w-4 text-secondary-foreground" />
          )}
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {isUser ? 'You (typed)' : isVoiceTranscription ? 'You (voice)' : 'AI Assistant'}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatTime(message.timestamp)}
            </span>
            {isVoiceTranscription && (
              <span className="text-xs bg-accent text-accent-foreground px-1.5 py-0.5 rounded">
                Voice
              </span>
            )}
          </div>
          
          <div className="text-sm leading-relaxed">
            {message.content}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={cn(
        "fixed right-0 top-0 h-full bg-background border-l border-border transition-all duration-300 z-50",
        isOpen ? "w-96 translate-x-0" : "w-0 translate-x-full",
        className
      )}>
        {/* Transcription Header */}
        <div className="h-16 border-b border-border flex items-center justify-between px-4 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Transcription</h3>
            {messages.length > 0 && (
              <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1">
                {messages.length}
              </span>
            )}
            {isListening && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground">Listening</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={exportTranscription}
                className="hover:bg-muted"
                title="Export transcription"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        {messages.length > 5 && (
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transcription..."
                className="pl-9"
              />
            </div>
          </div>
        )}

        {/* Transcription Content */}
        <div className="flex-1 flex flex-col h-[calc(100vh-12rem)]">
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-2 py-4">
              {filteredMessages.length === 0 && !searchQuery ? (
                <div className="text-center text-muted-foreground py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No transcription yet</p>
                  <p className="text-xs">Voice and text will appear here</p>
                </div>
              ) : filteredMessages.length === 0 && searchQuery ? (
                <div className="text-center text-muted-foreground py-8">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No matches found</p>
                  <p className="text-xs">Try a different search term</p>
                </div>
              ) : (
                filteredMessages.map((message) => (
                  <TranscriptionEntry key={message.id} message={message} />
                ))
              )}
              
              {isTyping && (
                <div className="flex gap-3 p-2">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-secondary-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">AI Assistant</span>
                      <span className="text-xs text-muted-foreground">typing...</span>
                    </div>
                    <div className="bg-card border rounded-lg px-3 py-2">
                      <LoadingDots />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t border-border p-4 bg-card/50 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button 
                type="submit" 
                size="sm"
                disabled={!inputValue.trim() || isTyping}
                className="px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}