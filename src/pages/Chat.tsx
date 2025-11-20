import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Video, Phone } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface Message {
  id: string;
  text: string;
  sender: "patient" | "doctor" | "system";
  timestamp: Date;
}

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I've reviewed your symptoms. Can you tell me more about when the symptoms started?",
      sender: "doctor",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "patient",
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulate doctor response
    setTimeout(() => {
      const doctorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for that information. Based on what you've told me, I'd recommend we schedule a video consultation to examine this more closely.",
        sender: "doctor",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, doctorResponse]);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl h-[calc(100vh-8rem)]">
      <Card className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>Dr</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">Dr. Adebayo Okafor</h2>
              <p className="text-sm text-muted-foreground">General Practitioner</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="outline" onClick={() => navigate("/video")}>
              <Video className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline">
              <Phone className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "patient" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender === "patient"
                    ? "bg-primary text-primary-foreground"
                    : message.sender === "doctor"
                    ? "bg-muted"
                    : "bg-accent text-center w-full"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button onClick={handleSend} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Chat;
