
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Stethoscope, Phone, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import VideoCall from "@/components/VideoCall";
import { useSearchParams, useNavigate } from "react-router-dom";

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

const Consultation = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const consultationIdFromUrl = searchParams.get('consultation_id');

  const [stage, setStage] = useState('ai_assistant'); // ai_assistant, doctor_chat, video_call
  const [videoRoomUrl, setVideoRoomUrl] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [doctor, setDoctor] = useState<{id: string, full_name: string} | null>(null);
  const [consultationId, setConsultationId] = useState<string | null>(consultationIdFromUrl);
  const [userId, setUserId] = useState<string | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);
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
    const setupConsultation = async () => {
      if (consultationIdFromUrl && userId) {
        // Doctor joining an existing consultation
        setStage('doctor_chat');
        const { data, error } = await supabase
          .from('consultations')
          .select(`
            status,
            patient_id,
            doctor:doctors(id, full_name),
            chat_messages(id, message, sender_type, created_at)
          `)
          .eq('id', consultationIdFromUrl)
          .single<{
            status: string;
            patient_id: string | null;
            doctor: { id: string; full_name: string } | null;
            chat_messages: {
              id: string;
              message: string;
              sender_type: 'patient' | 'doctor' | 'ai';
              created_at: string;
            }[];
          }>();

        if (error || !data) {
          toast({ title: 'Error fetching consultation', description: error?.message, variant: 'destructive' });
          return;
        }
        
        setPatientId(data.patient_id);
        setDoctor(data.doctor);

        const chatMessages = data.chat_messages.map((msg) => ({
            id: msg.id,
            text: msg.message,
            sender: msg.sender_type,
            timestamp: new Date(msg.created_at)
        }));

        setMessages(chatMessages);

        await supabase.from('consultations').update({ status: 'doctor_active' }).eq('id', consultationIdFromUrl);

      } else if (!consultationId && userId) {
        // Patient starting a new consultation
        const { data: patientData } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", userId)
          .single();

        const { data, error } = await supabase
          .from("consultations")
          .insert({
            status: "ai_active",
            patient_id: patientData?.id ?? null,
          })
          .select("id, patient_id")
          .single<{id: string; patient_id: string | null}>();

        if (!error && data) {
          setConsultationId(data.id);
          setPatientId(data.patient_id);
          setMessages([
            {
              id: "1",
              text: "Hello! I'm your AI health assistant. I'm here to help you understand your symptoms and connect you with the right care. How are you feeling today? Please describe your symptoms.",
              sender: "ai",
              timestamp: new Date(),
            },
          ]);
        }
      }
    };
    setupConsultation();
  }, [userId, consultationIdFromUrl]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "patient",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    
    const newConversationHistory = [
      ...conversationHistory,
      { role: "user" as const, content: input }
    ];
    setConversationHistory(newConversationHistory);
    
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    if (consultationId && userId) {
      await supabase.from("chat_messages").insert({
        consultation_id: consultationId,
        sender_id: userId,
        sender_type: "patient",
        message: currentInput,
      });
    }

    try {
      const { data, error } = await supabase.functions.invoke("ai-triage", {
        body: { 
          message: currentInput,
          conversationHistory: newConversationHistory
        },
      });

      if (error) {
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
      
      setConversationHistory(prev => [
        ...prev,
        { role: "assistant" as const, content: data.response }
      ]);

      if (data.connectToDoctor || data.severity === "high") {
        await handleDoctorHandoff();
      }

    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDoctorHandoff = async () => {
    if (!consultationId) return;

    // Find an available doctor
    const { data: doctors, error: doctorError } = await supabase
        .from('doctors')
        .select('id, full_name')
        .limit(1); // In a real scenario, you'd have a system to find an available doctor.

    if (doctorError || !doctors || doctors.length === 0) {
        toast({ title: 'Could not find an available doctor', variant: 'destructive' });
        return;
    }
    
    const assignedDoctor = doctors[0];
    setDoctor(assignedDoctor);

    await supabase.from('consultations').update({ 
        status: 'escalated',
        doctor_id: assignedDoctor.id
    }).eq('id', consultationId);
    
    const { data, error } = await supabase.functions.invoke('create-video-call', {
        body: { consultationId },
    });

    if (error) {
        toast({ title: 'Error creating video call', description: error.message, variant: 'destructive' });
        return;
    }
    
    setVideoRoomUrl(data.roomUrl);
    await supabase.from('consultations').update({ video_call_url: data.roomUrl }).eq('id', consultationId);

    const handoffMessage: Message = {
      id: (Date.now() + 2).toString(),
      text: `I’m connecting you with Dr. ${assignedDoctor.full_name} to assist further.`,
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, handoffMessage]);

    setTimeout(() => {
      setStage('doctor_chat');
      const doctorMessage: Message = {
        id: (Date.now() + 3).toString(),
        text: `Hello, I'm Dr. ${assignedDoctor.full_name}. I've reviewed your conversation with the AI assistant. How can I help you further?`,
        sender: "doctor",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, doctorMessage]);
    }, 3000);
  };

  const handleWritePrescription = () => {
    navigate("/prescriptions", { state: { consultation_id: consultationId, patient_id: patientId, doctor_id: doctor?.id } });
  };

  return (
    <div id="consultation-page" className="min-h-screen bg-muted/40 p-4">
      <div className="max-w-4xl mx-auto">
        <Card id="consultation-card" className="h-[80vh] flex flex-col">
          <div className="p-4 border-b bg-gradient-to-r from-primary to-secondary text-white rounded-t-lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {stage === 'ai_assistant' && <Bot id="ai-assistant-icon" className="h-6 w-6" />}
                  {stage === 'doctor_chat' && <Stethoscope id="doctor-icon" className="h-6 w-6" />}
                  {stage === 'video_call' && <Video id="video-icon" className="h-6 w-6" />}
                  <div>
                    <h2 id="consultation-header-title" className="text-lg font-semibold">
                      {stage === 'ai_assistant' && 'AI Health Assistant'}
                      {stage === 'doctor_chat' && (doctor ? `Dr. ${doctor.full_name}` : 'Connecting to doctor...')}
                      {stage === 'video_call' && (doctor ? `Video Call with Dr. ${doctor.full_name}` : 'Connecting to doctor...')}
                    </h2>
                    <p id="consultation-header-status" className="text-sm opacity-90">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {stage === 'doctor_chat' && (
                    <>
                      <Button 
                        id="start-video-call-button"
                        size="sm" 
                        variant="outline" 
                        className="bg-white text-primary hover:bg-white/90" 
                        onClick={() => setStage('video_call')}
                        disabled={!videoRoomUrl}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Start Video Call
                      </Button>
                      <Button 
                        id="write-prescription-button"
                        size="sm" 
                        variant="outline" 
                        className="bg-white text-primary hover:bg-white/90" 
                        onClick={handleWritePrescription}
                      >
                        Prescriptions
                      </Button>
                    </>
                  )}
                </div>
            </div>
          </div>

          <CardContent id="message-list-container" className="flex-1 overflow-y-auto p-4 space-y-4">
            {stage === 'video_call' && videoRoomUrl ? (
                <VideoCall roomUrl={videoRoomUrl} />
            ) : (
                <>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        id={`message-container-${message.id}`}
                        className={`flex ${
                          message.sender === "patient" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex gap-3 max-w-[80%] ${
                            message.sender === "patient" ? "flex-row-reverse" : "flex-row"
                          }`}
                        >
                          <div id={`message-avatar-${message.id}`} className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            message.sender === "patient" ? "bg-primary" : message.sender === 'doctor' ? 'bg-secondary' : "bg-muted"
                          }`}>
                            {message.sender === "patient" ? (
                              <User className="h-4 w-4 text-white" />
                            ) : message.sender === 'doctor' ? (
                              <Stethoscope className="h-4 w-4 text-white" />
                            ) : (
                              <Bot className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div
                            id={`message-content-${message.id}`}
                            className={`rounded-lg p-3 ${
                              message.sender === "patient"
                                ? "bg-primary text-white"
                                :  message.sender === "doctor"
                                ? "bg-secondary text-white"
                                : "bg-muted"
                            }`}
                          >
                            <p id={`message-text-${message.id}`} className="text-sm whitespace-pre-wrap">{message.text}</p>
                            <p id={`message-timestamp-${message.id}`} className={`text-xs mt-1 ${
                              message.sender === "patient" || message.sender === 'doctor'
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
                      <div id="loading-indicator" className="flex justify-start">
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
                </>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          <div id="chat-input-area" className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                id="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Describe your symptoms..."
                disabled={isLoading || stage === 'video_call'}
              />
              <Button id="send-message-button" onClick={handleSend} disabled={isLoading || stage === 'video_call'}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Consultation;
