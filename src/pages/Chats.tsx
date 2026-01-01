
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Bot, Stethoscope } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface Conversation {
  id: string;
  last_message: string;
  last_message_at: string;
  other_party_name: string;
  other_party_avatar: string | null;
  other_party_role: 'ai' | 'doctor';
}

const Chats = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/login");
          return;
        }

        const { data: patientData } = await supabase
          .from("patients")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (!patientData) {
          setConversations([]);
          setLoading(false);
          return;
        }

        const { data: consultations, error } = await supabase
          .from("consultations")
          .select(`
            id,
            created_at,
            doctor:doctor_id ( full_name, avatar_url )
          `)
          .eq("patient_id", patientData.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const conversationsWithDetails = await Promise.all(
          consultations.map(async (convo) => {
            const { data: lastMessage } = await supabase
              .from("chat_messages")
              .select("message, created_at, sender_type")
              .eq("consultation_id", convo.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .single();

            const isDoctorAssigned = !!convo.doctor;

            return {
              id: convo.id,
              last_message: lastMessage?.message || "Consultation started.",
              last_message_at: lastMessage ? formatDistanceToNow(new Date(lastMessage.created_at), { addSuffix: true }) : formatDistanceToNow(new Date(convo.created_at), { addSuffix: true }),
              other_party_name: isDoctorAssigned ? convo.doctor.full_name : "AI Health Assistant",
              other_party_avatar: isDoctorAssigned ? convo.doctor.avatar_url : null,
              other_party_role: isDoctorAssigned ? 'doctor' : 'ai',
            };
          })
        );

        setConversations(conversationsWithDetails);

      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [navigate]);

 const handleConversationClick = (conversation: Conversation) => {
    // For AI conversations, navigate to the active consultation page
    // For doctor conversations, we assume there should be a page to view chat history.
    // The current Consultation page is for active chats, so we direct all clicks there for now.
    navigate(`/consultation?consultation_id=${conversation.id}`);
  };


  if (loading) {
    return (
        <div id="loading-spinner" className="flex h-full flex-1 items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );
  }

  return (
    <div id="chats-page" className="p-4 space-y-4">
      <CardHeader>
        <CardTitle id="chats-title">Conversations</CardTitle>
        <p id="chats-description" className="text-muted-foreground">View previous chats with our health assistant or doctors.</p>
      </CardHeader>

      {conversations.length === 0 ? (
        <CardContent id="no-conversations-message" className="text-center py-12">
            <p className="text-muted-foreground">No conversations yet. Start a consultation to begin.</p>
        </CardContent>
      ) : (
        <div id="conversation-list" className="space-y-2">
          {conversations.map((convo) => (
            <Card key={convo.id} id={`conversation-card-${convo.id}`} className="cursor-pointer hover:bg-muted/50" onClick={() => handleConversationClick(convo)}>
                <CardContent className="flex items-center gap-4 p-4">
                    <Avatar id={`conversation-avatar-${convo.id}`} className="h-12 w-12">
                        <AvatarImage src={convo.other_party_avatar || undefined} />
                        <AvatarFallback>
                            {convo.other_party_role === 'ai' ? <Bot className="h-6 w-6"/> : <Stethoscope className="h-6 w-6"/>}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex justify-between items-center">
                            <p id={`conversation-name-${convo.id}`} className="font-semibold text-base">{convo.other_party_name}</p>
                            <p id={`conversation-time-${convo.id}`} className="text-xs text-muted-foreground">{convo.last_message_at}</p>
                        </div>
                        <p id={`conversation-last-message-${convo.id}`} className="text-sm text-muted-foreground truncate">{convo.last_message}</p>
                    </div>
                </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Chats;
