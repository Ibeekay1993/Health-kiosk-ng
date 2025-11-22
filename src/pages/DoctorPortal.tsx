import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, Calendar, Video, MessageSquare, FileText, 
  Clock, TrendingUp, Activity 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DoctorPortal = () => {
  const navigate = useNavigate();

  const todayAppointments = [
    { id: 1, time: "09:00 AM", patient: "Chukwuemeka Obi", type: "Video", status: "upcoming" },
    { id: 2, time: "10:30 AM", patient: "Amina Mohammed", type: "Chat", status: "in-progress" },
    { id: 3, time: "02:00 PM", patient: "Tunde Adeyemi", type: "Video", status: "upcoming" },
  ];

  const recentPatients = [
    { id: 1, name: "Blessing Okoro", lastSeen: "2 hours ago", condition: "Migraine" },
    { id: 2, name: "Chioma Nwankwo", lastSeen: "1 day ago", condition: "Hypertension" },
    { id: 3, name: "Ibrahim Musa", lastSeen: "2 days ago", condition: "Diabetes" },
  ];

  const stats = [
    { label: "Today's Patients", value: "12", icon: Users, color: "text-blue-500" },
    { label: "Pending Consults", value: "5", icon: Clock, color: "text-yellow-500" },
    { label: "Completed Today", value: "7", icon: Activity, color: "text-green-500" },
    { label: "This Week", value: "45", icon: TrendingUp, color: "text-purple-500" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Doctor Portal</h1>
          <p className="text-muted-foreground">Welcome back, Dr. Adebayo</p>
        </div>
        <Button onClick={() => navigate("/patients")}>
          View All Patients
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Your appointments for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center justify-center w-16 h-16 bg-primary/10 rounded-lg">
                        <Clock className="h-5 w-5 text-primary mb-1" />
                        <span className="text-xs font-medium">{apt.time.split(' ')[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium">{apt.patient}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {apt.type === "Video" ? (
                            <Video className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="text-sm text-muted-foreground">{apt.type} Consultation</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={apt.status === "in-progress" ? "default" : "outline"}>
                        {apt.status === "in-progress" ? "In Progress" : "Upcoming"}
                      </Badge>
                      <Button size="sm" onClick={() => navigate(apt.type === "Video" ? "/video" : "/chat")}>
                        Join
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => navigate("/patients")}>
                  <Users className="h-6 w-6" />
                  <span className="text-xs">Patients</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => navigate("/appointments")}>
                  <Calendar className="h-6 w-6" />
                  <span className="text-xs">Schedule</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => navigate("/chat")}>
                  <MessageSquare className="h-6 w-6" />
                  <span className="text-xs">Messages</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  <span className="text-xs">Prescriptions</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPatients.map((patient) => (
                  <div key={patient.id} className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">{patient.condition}</p>
                      <p className="text-xs text-muted-foreground mt-1">{patient.lastSeen}</p>
                    </div>
                    <Button size="sm" variant="ghost">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Lab Results</span>
                  <Badge variant="secondary">3</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Prescriptions</span>
                  <Badge variant="secondary">5</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Follow-ups</span>
                  <Badge variant="secondary">2</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorPortal;
