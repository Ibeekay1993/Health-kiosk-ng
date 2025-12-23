import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Calendar, FileText, Heart, MessageCircle, PlusCircle, Settings, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [userInitial, setUserInitial] = useState("U");

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else if (data.user) {
        const fullName = data.user.user_metadata?.full_name || data.user.email;
        setUserName(fullName.split(" ")[0]);
        setUserInitial(fullName.charAt(0).toUpperCase());
      }
    };

    fetchUser();
  }, []);

  const stats = {
    consultations: 0,
    prescriptions: 0,
  };

  return (
    <div className="min-h-screen bg-muted/40 p-4 sm:p-6 md:p-8">
      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Left Sidebar - Navigation */}
        <aside className="hidden lg:block bg-card p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-lg">{userName}</p>
              <p className="text-sm text-green-500">Online</p>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            <Button variant="ghost" className="justify-start gap-3 text-base" onClick={() => navigate('/dashboard')}><Heart className="h-5 w-5" /> Dashboard</Button>
            <Button variant="ghost" className="justify-start gap-3 text-base" onClick={() => navigate('/appointments')}><Calendar className="h-5 w-5" /> Appointments</Button>
            <Button variant="ghost" className="justify-start gap-3 text-base" onClick={() => navigate('/doctors')}><Users className="h-5 w-5" /> Doctors</Button>
            <Button variant="ghost" className="justify-start gap-3 text-base" onClick={() => navigate('/chats')}><MessageCircle className="h-5 w-5" /> Chats</Button>
            <Button variant="ghost" className="justify-start gap-3 text-base" onClick={() => navigate('/prescriptions')}><FileText className="h-5 w-5" /> Prescription</Button>
            <Button variant="ghost" className="justify-start gap-3 text-base" onClick={() => navigate('/lab-requests')}><PlusCircle className="h-5 w-5" /> Laboratory Requests</Button>
            <Button variant="ghost" className="justify-start gap-3 text-base" onClick={() => navigate('/medical-records')}><FileText className="h-5 w-5" /> Medical Records</Button>
            <Button variant="ghost" className="justify-start gap-3 text-base" onClick={() => navigate('/subscription')}><Settings className="h-5 w-5" /> Subscription</Button>
            <Button variant="ghost" className="justify-start gap-3 text-base" onClick={() => navigate('/family-members')}><Users className="h-5 w-5" /> Family Members</Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main>
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Good Afternoon, {userName}</h1>
              <p className="text-muted-foreground">Manage your health and access care easily.</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon"><Bell className="h-5 w-5" /></Button>
              <Button onClick={() => navigate('/book-appointment')}>Book an Appointment</Button>
            </div>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Consultation & Prescription Cards */}
            <Card>
              <CardHeader>
                <CardTitle>Out of consultations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold">{stats.consultations}</p>
                <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/subscription')}>Subscribe to a plan &rarr;</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total number of prescriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold">{stats.prescriptions}</p>
                <p className="text-sm text-muted-foreground">ongoing prescription</p>
                <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/prescriptions')}>View prescription &rarr;</Button>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">No appointments for December 23, 2025</p>
                {/* Calendar placeholder */}
              </CardContent>
            </Card>
            
            {/* Medication Card */}
            <Card className="md:col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Medication</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">No medications available. Your prescribed medications will appear here</p>
              </CardContent>
            </Card>

            {/* Health Tips Card */}
            <Card>
              <CardHeader>
                <CardTitle>Health Tips</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full"><Heart className="h-4 w-4 text-blue-600"/></div>
                  <div>
                    <p className="font-semibold">General Wellness</p>
                    <p className="text-sm text-muted-foreground">Avoid smoking or being around smokers to protect your lungs.</p>
                  </div>
                </div>
                 <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full"><Heart className="h-4 w-4 text-green-600"/></div>
                  <div>
                    <p className="font-semibold">Hygiene</p>
                    <p className="text-sm text-muted-foreground">Keep your environment clean to avoid infections.</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">Get New Tips</Button>
              </CardContent>
            </Card>

            {/* Test Reports Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Test Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">No test reports available. Your test results will appear here once uploaded.</p>
              </CardContent>
            </Card>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
