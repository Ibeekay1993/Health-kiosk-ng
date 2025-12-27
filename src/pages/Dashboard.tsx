import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Calendar, FileText, Heart, MessageCircle, PlusCircle, Settings, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/use-profile";

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, loading } = useProfile();

  const userName = profile?.full_name?.split(" ")[0] || "User";
  const userInitial = profile?.full_name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-muted/40 p-4 sm:p-6 md:p-8">
      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Left Sidebar - Navigation */}
        <aside className="hidden lg:block bg-card p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <Avatar>
              <AvatarImage src={profile?.avatar_url || "/placeholder-user.jpg"} />
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
            </div>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Primary Actions */}
            <Card className="md:col-span-1 lg:col-span-1 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/triage')}>
              <CardHeader>
                <CardTitle>Start Consultation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Chat with our AI health assistant to get care now</p>
              </CardContent>
            </Card>

            <Card className="md:col-span-1 lg:col-span-1 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/book-appointment')}>
              <CardHeader>
                <CardTitle>Book Appointment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Schedule a visit with a healthcare professional</p>
              </CardContent>
            </Card>

            <Card className="md:col-span-1 lg:col-span-1 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/find-kiosk')}>
              <CardHeader>
                <CardTitle>Find a Kiosk</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Access nearby physical health services</p>
              </CardContent>
            </Card>
            
            {/* Upcoming Appointments */}
            <Card className="md:col-span-1 lg:col-span-1">
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">No appointments for December 23, 2025</p>
                <Button variant="outline" className="w-full" onClick={() => navigate('/book-appointment')}>Book an Appointment</Button>
              </CardContent>
            </Card>

            {/* Medical Records Card */}
            <Card className="md:col-span-1 lg:col-span-2 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/medical-records')}>
              <CardHeader>
                <CardTitle>Medical Records</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">View your medical history, prescriptions, and test results.</p>
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
