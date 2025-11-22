import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Video, Phone, Bot, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: "patient" | "doctor" | "ai";
  timestamp: Date;
}

const Chat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI health assistant. I'll help assess your symptoms and provide initial guidance. Tell me what brings you here today?",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectToDoctor, setConnectToDoctor] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "patient",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Call AI triage function
      const { data, error } = await supabase.functions.invoke('ai-triage', {
        body: {
          symptoms: inputValue,
          conversationHistory: messages.map(m => ({
            role: m.sender === "patient" ? "user" : "assistant",
            content: m.text
          }))
        }
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.message,
        sender: "ai",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Check if doctor consultation is recommended
      if (data.recommendDoctor) {
        setConnectToDoctor(true);
        setTimeout(() => {
          const doctorSuggestion: Message = {
            id: (Date.now() + 2).toString(),
            text: "Based on your symptoms, I recommend speaking with a doctor. Would you like me to connect you now?",
            sender: "ai",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, doctorSuggestion]);
        }, 1000);
      }

    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectDoctor = () => {
    toast({
      title: "Connecting to doctor",
      description: "Transferring you to a licensed physician..."
    });
    setTimeout(() => navigate("/video"), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl h-[calc(100vh-8rem)]">
      <Card className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b p-4 flex items-center justify-between bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center gap-3">
            <Avatar className="bg-primary">
              <AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">HC4A Health Assistant</h2>
              <p className="text-sm text-muted-foreground">AI-powered medical triage</p>
            </div>
          </div>
          {connectToDoctor && (
            <div className="flex gap-2">
              <Button size="sm" onClick={handleConnectDoctor} className="gap-2">
                <Video className="h-4 w-4" />
                Connect to Doctor
              </Button>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "patient" ? "justify-end" : "justify-start"}`}
            >
              {message.sender !== "patient" && (
                <Avatar className="mr-2 h-8 w-8 bg-primary/10">
                  <AvatarFallback><Bot className="h-4 w-4 text-primary" /></AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender === "patient"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {message.sender === "patient" && (
                <Avatar className="ml-2 h-8 w-8 bg-secondary/10">
                  <AvatarFallback><User className="h-4 w-4 text-secondary" /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4 bg-muted/30">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Describe your symptoms..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button onClick={handleSend} size="icon" disabled={isLoading || !inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Chat;