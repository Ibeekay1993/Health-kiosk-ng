
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Calendar, Users, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const DoctorDashboard = () => {
  const features = [
    {
      title: "Patient Records",
      description: "Access and manage patient health records.",
      icon: <Users className="w-8 h-8 text-primary" />,
      link: "/patients",
    },
    {
      title: "Appointments",
      description: "View and manage your upcoming appointments.",
      icon: <Calendar className="w-8 h-8 text-primary" />,
      link: "/appointments",
    },
    {
      title: "Consultations",
      description: "Start or join patient consultations.",
      icon: <Briefcase className="w-8 h-8 text-primary" />,
      link: "/consultation",
    },
    {
      title: "Messages",
      description: "Communicate with patients and other staff.",
      icon: <MessageSquare className="w-8 h-8 text-primary" />,
      link: "/messages",
    },
  ];

  return (
    <div className="min-h-screen bg-muted/40 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Doctor's Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Doctor. Here's your overview.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Link to={feature.link} key={index}>
              <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                  {feature.icon}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No recent activity to display.</p>
              {/* Placeholder for recent activities feed */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
