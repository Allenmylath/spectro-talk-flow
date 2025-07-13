import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { RTVIMessage } from "@/types/rtvi";
import { Send, MessageSquare, X, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingDots } from "@/components/ui/loading-spinner";

interface ChatPanelProps {
  messages: RTVIMessage[];
  isOpen: boolean;
  onToggle: () => void;
  onSendMessage: (message: string) => void;
  isTyping?: boolean;
  className?: string;
}

export function ChatPanel({
  messages,
  isOpen,
  onToggle,
  onSendMessage,
  isTyping = false,
  className
}: ChatPanelProps) {
  const [inputValue, setInputValue] = useState("");
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
      hour12: false
    }).format(date);
  };

  const MessageBubble = ({ message }: { message: RTVIMessage }) => {
    const isUser = message.type === 'user';
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
      <div className={cn(
        "flex gap-3 animate-fade-in",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          isUser ? "bg-primary" : "bg-secondary"
        )}>
          {isUser ? (
            <User className="h-4 w-4 text-primary-foreground" />
          ) : (
            <Bot className="h-4 w-4 text-secondary-foreground" />
          )}
        </div>

        <div className={cn(
          "flex flex-col gap-1 max-w-[80%]",
          isUser ? "items-end" : "items-start"
        )}>
          <div className={cn(
            "px-4 py-3 rounded-2xl shadow-md",
            isUser 
              ? "bg-primary text-primary-foreground rounded-br-md" 
              : "bg-card text-card-foreground rounded-bl-md border"
          )}>
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
          
          <span className="text-xs text-muted-foreground px-2">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={cn(
        "fixed right-0 top-0 h-full bg-background border-l border-border transition-all duration-300 z-50",
        isOpen ? "w-80 translate-x-0" : "w-0 translate-x-full",
        className
      )}>
        {/* Chat Header */}
        <div className="h-16 border-b border-border flex items-center justify-between px-4 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Chat</h3>
            {messages.length > 0 && (
              <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1">
                {messages.length}
              </span>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col h-[calc(100vh-8rem)]">
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-4 py-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No messages yet</p>
                  <p className="text-xs">Start a conversation with the AI</p>
                </div>
              ) : (
                messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))
              )}
              
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-secondary-foreground" />
                  </div>
                  <div className="bg-card border rounded-2xl rounded-bl-md px-4 py-3">
                    <LoadingDots />
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

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
}