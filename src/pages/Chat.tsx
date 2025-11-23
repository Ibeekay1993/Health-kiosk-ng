import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Video, Bot, User, Stethoscope } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const { toast } = useToast();
  const triageData = location.state?.triageData;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI health assistant. I'm here to help you understand your symptoms and connect you with the right care. How are you feeling today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [doctorConnected, setDoctorConnected] = useState(false);
  const [doctorName, setDoctorName] = useState("");
  const [consultationId, setConsultationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const createConsultation = async () => {
      if (triageData) {
        const { data, error } = await supabase
          .from("consultations")
          .insert({
            symptoms: triageData.symptoms,
            severity: triageData.severity,
            status: "pending",
          })
          .select()
          .single();

        if (!error && data) {
          setConsultationId(data.id);
        }
      }
    };
    createConsultation();
  }, [triageData]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "patient",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-triage", {
        body: { message: input },
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (consultationId && triageData?.severity) {
        const { data: handoffData } = await supabase.functions.invoke("ai-doctor-handoff", {
          body: {
            consultationId,
            symptoms: input,
            severity: triageData.severity,
          },
        });

        if (handoffData?.doctorAssigned) {
          setDoctorConnected(true);
          setDoctorName(handoffData.doctorName);
          
          const handoffMessage: Message = {
            id: (Date.now() + 2).toString(),
            text: handoffData.message,
            sender: "ai",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, handoffMessage]);

          toast({
            title: "Doctor Connected",
            description: `You've been connected to ${handoffData.doctorName}`,
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectDoctor = () => {
    toast({
      title: "Connecting to doctor...",
      description: "You will be transferred to a video call shortly.",
    });
    setTimeout(() => {
      navigate("/video");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-muted/40 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="h-[80vh] flex flex-col">
          <div className="p-4 border-b bg-gradient-to-r from-primary to-secondary text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {doctorConnected ? (
                  <>
                    <Stethoscope className="h-6 w-6" />
                    <div>
                      <h2 className="text-lg font-semibold">Dr. {doctorName}</h2>
                      <p className="text-sm opacity-90">Online</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Bot className="h-6 w-6" />
                    <div>
                      <h2 className="text-lg font-semibold">AI Health Assistant</h2>
                      <p className="text-sm opacity-90">Online</p>
                    </div>
                  </>
                )}
              </div>
              {doctorConnected && (
                <Button size="sm" variant="outline" className="bg-white text-primary hover:bg-white/90" onClick={handleConnectDoctor}>
                  <Video className="h-4 w-4 mr-2" />
                  Video Call
                </Button>
              )}
            </div>
          </div>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "patient" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    message.sender === "patient" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === "patient" ? "bg-primary" : message.sender === "doctor" ? "bg-secondary" : "bg-muted"
                  }`}>
                    {message.sender === "patient" ? (
                      <User className="h-4 w-4 text-white" />
                    ) : message.sender === "doctor" ? (
                      <Stethoscope className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.sender === "patient"
                        ? "bg-primary text-white"
                        : message.sender === "doctor"
                        ? "bg-secondary text-white"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === "patient" || message.sender === "doctor" 
                        ? "text-white/70" 
                        : "text-muted-foreground"
                    }`}>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Bot className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder={doctorConnected ? "Message the doctor..." : "Describe your symptoms..."}
                disabled={isLoading}
              />
              <Button onClick={handleSend} disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
