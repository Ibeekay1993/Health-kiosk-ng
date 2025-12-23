import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Video, Bot, User, Stethoscope, Phone } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: "patient" | "doctor" | "ai";
  timestamp: Date;
}

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const triageData = location.state?.triageData;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI health assistant. I'm here to help you understand your symptoms and connect you with the right care. How are you feeling today? Please describe your symptoms.",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [doctorConnected, setDoctorConnected] = useState(false);
  const [doctorName, setDoctorName] = useState("");
  const [consultationId, setConsultationId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const createConsultation = async () => {
      if (triageData && userId) {
        // Get patient record
        const { data: patientData } = await supabase
          .from("patients")
          .select("id")
          .eq("user_id", userId)
          .single();

        const { data, error } = await supabase
          .from("consultations")
          .insert({
            symptoms: triageData.symptoms,
            severity: triageData.severity,
            status: "pending",
            patient_id: patientData?.id,
          })
          .select()
          .single();

        if (!error && data) {
          setConsultationId(data.id);
        }
      }
    };
    createConsultation();
  }, [triageData, userId]);

  // Set up real-time subscription for doctor messages
  useEffect(() => {
    if (!consultationId) return;

    const channel = supabase
      .channel(`chat-${consultationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `consultation_id=eq.${consultationId}`
        },
        (payload) => {
          const newMessage = payload.new as any;
          if (newMessage.sender_type === 'doctor') {
            const doctorMessage: Message = {
              id: newMessage.id,
              text: newMessage.message,
              sender: "doctor",
              timestamp: new Date(newMessage.created_at),
            };
            setMessages(prev => [...prev, doctorMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [consultationId]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "patient",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    
    // Update conversation history for AI context
    const newConversationHistory = [
      ...conversationHistory,
      { role: "user" as const, content: input }
    ];
    setConversationHistory(newConversationHistory);
    
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    // Save message to database if we have a consultation
    if (consultationId && userId) {
      await supabase.from("chat_messages").insert({
        consultation_id: consultationId,
        sender_id: userId,
        sender_type: "patient",
        message: currentInput,
      });
    }

    try {
      console.log("Sending to AI triage:", { message: currentInput });
      
      const { data, error } = await supabase.functions.invoke("ai-triage", {
        body: { 
          message: currentInput,
          conversationHistory: newConversationHistory
        },
      });

      console.log("AI triage response:", data, error);

      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      
      // Update conversation history with AI response
      setConversationHistory(prev => [
        ...prev,
        { role: "assistant" as const, content: data.response }
      ]);

      // Check if we need to connect to a doctor
      if (data.connectToDoctor || data.severity === "high" || 
          currentInput.toLowerCase().includes("doctor") ||
          currentInput.toLowerCase().includes("speak to") ||
          currentInput.toLowerCase().includes("connect me")) {
        await handleDoctorHandoff(currentInput, data.severity || "medium");
      }

    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response. Please try again.",
        variant: "destructive",
      });
      
      // Add a fallback message
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, I'm having trouble processing your request. Would you like me to connect you to a doctor directly?",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDoctorHandoff = async (symptoms: string, severity: string) => {
    if (!consultationId) return;

    try {
      const { data: handoffData, error } = await supabase.functions.invoke("ai-doctor-handoff", {
        body: {
          consultationId,
          symptoms,
          severity,
        },
      });

      console.log("Doctor handoff response:", handoffData, error);

      if (error) throw error;

      if (handoffData?.doctorAssigned) {
        setDoctorConnected(true);
        setDoctorName(handoffData.doctorName || "Available");
        
        const handoffMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: `Great news! I've connected you with Dr. ${handoffData.doctorName || "Available"}. They will review your symptoms and join this chat shortly. You can also start a video call when you're ready.`,
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, handoffMessage]);

        toast({
          title: "Doctor Connected",
          description: `You've been connected to Dr. ${handoffData.doctorName || "Available"}`,
        });
      } else {
        const noDocMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: "I'm currently looking for an available doctor to assist you. Please wait a moment or you can try booking an appointment for a specific time.",
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, noDocMessage]);
      }
    } catch (error) {
      console.error("Doctor handoff error:", error);
    }
  };

  const handleConnectDoctor = () => {
    toast({
      title: "Connecting to doctor...",
      description: "You will be transferred to a video call shortly.",
    });
    setTimeout(() => {
      navigate("/video", { state: { consultationId, doctorName } });
    }, 1500);
  };

  const handleRequestDoctor = async () => {
    const requestMessage: Message = {
      id: Date.now().toString(),
      text: "I would like to speak with a doctor please.",
      sender: "patient",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, requestMessage]);
    
    setIsLoading(true);
    await handleDoctorHandoff("Patient requested doctor consultation", "medium");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-muted/40 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="h-[80vh] flex flex-col">
          <div className="p-4 border-b bg-gradient-to-r from-primary to-secondary text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {doctorConnected ? (
                  <>
                    <Stethoscope className="h-6 w-6" />
                    <div>
                      <h2 className="text-lg font-semibold">Dr. {doctorName}</h2>
                      <p className="text-sm opacity-90">Connected</p>
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
              <div className="flex gap-2">
                {!doctorConnected && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                    onClick={handleRequestDoctor}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Request Doctor
                  </Button>
                )}
                {doctorConnected && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-white text-primary hover:bg-white/90" 
                    onClick={handleConnectDoctor}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Video Call
                  </Button>
                )}
              </div>
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
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
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
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
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
