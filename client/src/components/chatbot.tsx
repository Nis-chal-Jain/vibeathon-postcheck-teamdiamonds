import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Send, Bot, User, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestampStr: string;
}

interface ChatbotProps {
  onClose: () => void;
}

export function Chatbot({ onClose }: ChatbotProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your cheque assistant. You can ask me questions like:\n• 'Show me all cheques due by November 21st'\n• 'What's the total amount of upcoming cheques?'\n• 'List all cheques for John Smith'\n\nHow can I help you today?",
      timestampStr: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const queryMutation = useMutation({
    mutationFn: async (query: string) => {
      return await apiRequest("POST", "/api/chat", { query });
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          timestampStr: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to get response. Please try again.",
        variant: "destructive",
      });
      setMessages((prev) => prev.slice(0, -1));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || queryMutation.isPending) return;

    const userMessage = input.trim();
    const timestampStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
        timestampStr,
      },
    ]);
    setInput("");
    queryMutation.mutate(userMessage);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[600px] max-h-[calc(100vh-2rem)] flex flex-col shadow-xl z-50 border-border">
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary p-2">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">Cheque Assistant</h3>
            <p className="text-xs text-muted-foreground">Powered by Gemini AI</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          data-testid="button-close-chat"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              data-testid={`chat-message-${index}`}
            >
              {message.role === "assistant" && (
                <div className="rounded-full bg-primary p-2 h-8 w-8 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestampStr}
                </p>
              </div>
              {message.role === "user" && (
                <div className="rounded-full bg-secondary p-2 h-8 w-8 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}
          {queryMutation.isPending && (
            <div className="flex gap-3 justify-start">
              <div className="rounded-full bg-primary p-2 h-8 w-8 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="rounded-lg px-4 py-2 bg-muted">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your cheques..."
            disabled={queryMutation.isPending}
            className="flex-1"
            data-testid="input-chat-message"
            autoFocus
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || queryMutation.isPending}
            data-testid="button-send-message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
}
