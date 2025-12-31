import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MessageSquare, Video, ArrowRight, ClipboardList, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const DoctorDashboard = () => {
  const { user, loading } = useAuth();

  // Mock data - in a real app, this would come from an API
  const upcomingAppointments = [
    { id: 1, patient: { name: "John Doe", avatar: "/placeholder.svg" }, time: "10:30 AM", type: "Video Call" },
    { id: 2, patient: { name: "Jane Smith", avatar: "/placeholder.svg" }, time: "11:00 AM", type: "In-Person" },
    { id: 3, patient: { name: "Peter Jones", avatar: "/placeholder.svg" }, time: "11:45 AM", type: "Video Call" },
  ];

  const triageQueue = [
    { id: 1, patient: { name: "Alice Johnson" }, reason: "Fever and cough", waitTime: "15m" },
    { id: 2, patient: { name: "Robert Brown" }, reason: "Follow-up consultation", waitTime: "25m" },
  ];

  const stats = [
    { title: "Today's Appointments", value: upcomingAppointments.length, icon: <Calendar className="w-6 h-6 text-muted-foreground" /> },
    { title: "New Messages", value: 5, icon: <MessageSquare className="w-6 h-6 text-muted-foreground" /> },
    { title: "Patients in Triage", value: triageQueue.length, icon: <ClipboardList className="w-6 h-6 text-muted-foreground" /> },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome, Dr. {user?.user_metadata.full_name || 'Doctor'}!</h1>
            <p className="text-muted-foreground">Here’s a snapshot of your day.</p>
          </div>
          <Button asChild>
            <Link to="/consultation">Start a New Consultation</Link>
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Upcoming Appointments */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>You have {upcomingAppointments.length} appointments scheduled for today.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appt) => (
                  <div key={appt.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={appt.patient.avatar} />
                        <AvatarFallback>{appt.patient.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{appt.patient.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Clock className="w-4 h-4 mr-1" /> {appt.time}
                        </p>
                      </div>
                    </div>
                    <Button variant={appt.type === 'Video Call' ? "default" : "outline"} size="sm" asChild>
                      <Link to={`/consultation/${appt.id}`}>
                        {appt.type === 'Video Call' ? <Video className="w-4 h-4 mr-2" /> : null}
                        Join Call
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="link" className="mt-4 w-full" asChild>
                <Link to="/appointments">View All Appointments <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </CardContent>
          </Card>

          {/* Patient Triage Queue */}
          <Card>
            <CardHeader>
              <CardTitle>Triage Queue</CardTitle>
              <CardDescription>Patients waiting for consultation.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {triageQueue.map((item) => (
                  <div key={item.id} className="flex flex-col p-3 bg-muted/50 rounded-lg">
                    <p className="font-semibold">{item.patient.name}</p>
                    <p className="text-sm text-muted-foreground mb-2">{item.reason}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">Waiting: {item.waitTime}</Badge>
                      <Button size="sm">Start Consultation</Button>
                    </div>
                  </div>
                ))}
                 {triageQueue.length === 0 && (
                   <p className="text-sm text-center text-muted-foreground py-4">The triage queue is currently empty.</p>
                 )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;