
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/use-profile";
import { Bell, Calendar, FileText, Home, MessageSquare, PlusCircle, Search, Clock, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const MobileDashboard = () => {
  const navigate = useNavigate();
  const { profile, loading: profileLoading } = useProfile();
  const { toast } = useToast();
  const [greeting, setGreeting] = useState("");
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [hasNotifications, setHasNotifications] = useState(false); // Placeholder for notification state

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Good morning";
      if (hour < 18) return "Good afternoon";
      return "Good evening";
    };
    setGreeting(getGreeting());

    const fetchUpcomingAppointments = async () => {
      if (!profile) return;
      setAppointmentsLoading(true);
      try {
        const { data, error } = await supabase.rpc('get_upcoming_appointments', { p_patient_id: profile.id });
        if (error) throw error;
        setUpcomingAppointments(data || []);
      } catch (error: any) {
        // Silently fail is better than showing a toast here
        console.error("Error fetching upcoming appointments:", error);
      }
      finally {
        setAppointmentsLoading(false);
      }
    };

    if (profile) {
        fetchUpcomingAppointments();
        // In a real app, you would also fetch notification status
        // For now, we just simulate it
        setHasNotifications(true);
    }

  }, [profile]);

  if (profileLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  const isProfileComplete = profile && profile.full_name && profile.date_of_birth;

  const quickActions = [
    { label: "Appointments", icon: <Calendar className="h-7 w-7" />, path: "/appointments" },
    { label: "Medical Records", icon: <FileText className="h-7 w-7" />, path: "/medical-records" },
    { label: "Start Consultation", icon: <PlusCircle className="h-7 w-7" />, path: "/consultation" },
    { label: "Prescriptions", icon: <FileText className="h-7 w-7" />, path: "/medical-records/prescriptions" },
    { label: "Find Kiosk", icon: <Search className="h-7 w-7" />, path: "/find-kiosk" },
  ];

  const handleQuickActionClick = (path: string) => {
    if ((path === '/consultation' || path === '/appointments') && !isProfileComplete) {
      toast({
        title: 'Complete Your Profile',
        description: 'Please complete your profile to book appointments or start consultations.',
        variant: 'destructive',
      });
      navigate('/complete-profile');
    } else {
      navigate(path);
    }
  };

  return (
    <div className="bg-muted/40 min-h-screen">
      <div className="p-4 space-y-6 pb-24">
        {/* Header */}
        <header className="flex items-center justify-between bg-muted/40 pt-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-white">
              <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.full_name ?? "User avatar"} />
              <AvatarFallback>{profile?.full_name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-muted-foreground text-sm">{greeting},</p>
              <h1 className="font-bold text-xl">{profile?.full_name || 'User'}</h1>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="relative">
            {hasNotifications && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />} 
            <Bell className="h-6 w-6" />
          </Button>
        </header>

        {/* Complete Profile Prompt */}
        {!isProfileComplete && (
            <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                    <CardTitle className="text-blue-800">Complete Your Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-blue-700 mb-4">Please complete your profile to get the most out of our platform. Some features may be limited until your profile is complete.</p>
                    <Button onClick={() => navigate("/complete-profile")} className="bg-blue-500 text-white hover:bg-blue-600">
                        Complete Profile
                    </Button>
                </CardContent>
            </Card>
        )}

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-3 gap-x-2 gap-y-4 text-center pt-4">
          {quickActions.map((action) => (
            <div
              key={action.label}
              onClick={() => handleQuickActionClick(action.path)}
              className="flex flex-col items-center justify-center gap-2 cursor-pointer p-2 rounded-lg"
            >
              <div className="bg-cyan-100 text-cyan-600 rounded-full p-3.5 flex items-center justify-center">
                {action.icon}
              </div>
              <span className="text-xs font-medium">{action.label}</span>
            </div>
          ))}
        </div>

        {/* Upcoming Appointments */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
             {appointmentsLoading ? (
                <div className="flex justify-center items-center py-4"><Loader2 className="h-6 w-6 animate-spin" /></div>
            ) : upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={apt.doctor_avatar ?? undefined} />
                            <AvatarFallback>{apt.doctor_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">Dr. {apt.doctor_name}</p>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{new Date(apt.appointment_date).toLocaleDateString()} at {new Date(`1970-01-01T${apt.appointment_time}Z`).toLocaleTimeString([], {timeZone: 'UTC', hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => toast.info("Video call feature coming soon!")}>
                        <Video className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                 {upcomingAppointments.length > 0 &&
                    <Button onClick={() => navigate("/appointments")} className="w-full mt-2">
                        View All
                    </Button>}
              </div>
            ) : (
                <div className="text-center flex flex-col items-center py-4">
                    <p className="text-muted-foreground mb-4">No upcoming appointments.</p>
                    <Button onClick={() => navigate("/appointments")} className="w-2/3">
                        Book Now
                    </Button>
                </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-2 grid grid-cols-4 text-center max-w-lg mx-auto rounded-t-lg">
        <div onClick={() => navigate("/dashboard")} className="flex flex-col items-center gap-1 cursor-pointer text-cyan-600">
          <Home className="h-6 w-6" />
          <span className="text-xs font-semibold">Home</span>
        </div>
        <div onClick={() => navigate("/find-kiosk")} className="flex flex-col items-center gap-1 cursor-pointer text-muted-foreground">
          <Search className="h-6 w-6" />
          <span className="text-xs">Find Kiosk</span>
        </div>
        <div onClick={() => navigate("/appointments")} className="flex flex-col items-center gap-1 cursor-pointer text-muted-foreground">
          <Calendar className="h-6 w-6" />
          <span className="text-xs">Appointments</span>
        </div>
        <div onClick={() => navigate("/chats")} className="flex flex-col items-center gap-1 cursor-pointer text-muted-foreground">
          <MessageSquare className="h-6 w-6" />
          <span className="text-xs">Chats</span>
        </div>
      </div>
    </div>
  );
};

export default MobileDashboard;
