import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Send, Bot, User, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestampStr: string;
}

export default function ChatPage() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your cheque assistant. You can ask me questions like:\n• Show me all cheques due by November 21st\n• What's the total amount of upcoming cheques?\n• List all cheques for John Smith\n\nHow can I help you today?",
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
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const queryMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest("POST", "/api/chat", { query });
      return await response.json();
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response || "No response received.",
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

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-sm px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="hover:bg-muted">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary p-2 shadow-sm">
                <Bot className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-card-foreground">
                Cheque Assistant
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Section */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-4xl mx-auto flex flex-col px-6 py-6">
          <Card className="flex-1 flex flex-col overflow-hidden shadow-sm border-border/70">
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex gap-4 ${
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="rounded-full bg-primary/90 p-2.5 h-10 w-10 flex items-center justify-center shadow-sm">
                        <Bot className="h-5 w-5 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-3 max-w-[70%] text-sm leading-relaxed shadow-sm ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-muted text-foreground rounded-bl-none"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-60 mt-2 text-right">
                        {message.timestampStr}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <div className="rounded-full bg-secondary p-2.5 h-10 w-10 flex items-center justify-center shadow-sm">
                        <User className="h-5 w-5 text-secondary-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {queryMutation.isPending && (
                  <div className="flex gap-4 justify-start">
                    <div className="rounded-full bg-primary/90 p-2.5 h-10 w-10 flex items-center justify-center shadow-sm">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="rounded-2xl px-4 py-3 bg-muted shadow-sm">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Bar */}
            <form
              onSubmit={handleSubmit}
              className="p-5 border-t border-border bg-card/90 backdrop-blur-sm"
            >
              <div className="flex gap-3 items-center">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your cheques..."
                  disabled={queryMutation.isPending}
                  className="flex-1 h-12 rounded-full px-5 text-base border-border focus-visible:ring-primary/40"
                  autoFocus
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={!input.trim() || queryMutation.isPending}
                  className="rounded-full px-6 h-12 shadow-sm hover:shadow-md transition-all"
                >
                  {queryMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
