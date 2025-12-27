
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/use-profile";
import { Bell, Calendar, FileText, Home, MessageSquare, PlusCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const MobileDashboard = () => {
  const navigate = useNavigate();
  const { profile, loading } = useProfile();
  const { toast } = useToast();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
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
              <AvatarFallback>{profile?.full_name?.charAt(0) || 'I'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-muted-foreground text-sm">Hello,</p>
              <h1 className="font-bold text-xl">{profile?.full_name || 'Ibukun Afolayan'}</h1>
            </div>
          </div>
          <Button variant="ghost" size="icon">
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
          <CardContent className="text-center flex flex-col items-center">
            <p className="text-muted-foreground mb-4">No upcoming appointments.</p>
            <Button onClick={() => navigate("/appointments")} className="bg-cyan-500 w-2/3 text-white hover:bg-cyan-600">
              View All
            </Button>
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
