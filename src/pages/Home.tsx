import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Calendar, Video, FileText, Activity, Clock } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: MessageSquare,
      title: "AI Health Check",
      description: "Get instant symptom analysis and health recommendations",
      action: () => navigate("/triage"),
      color: "bg-primary/10 text-primary"
    },
    {
      icon: Video,
      title: "Video Consultation",
      description: "Connect with qualified doctors via video call",
      action: () => navigate("/video"),
      color: "bg-secondary/10 text-secondary"
    },
    {
      icon: Calendar,
      title: "Book Appointment",
      description: "Schedule a visit with specialist doctors",
      action: () => navigate("/appointments"),
      color: "bg-accent/10 text-accent-foreground"
    },
    {
      icon: FileText,
      title: "Medical Records",
      description: "Access your health history and prescriptions",
      action: () => navigate("/records"),
      color: "bg-muted text-muted-foreground"
    }
  ];

  const stats = [
    { label: "Doctors Available", value: "150+", icon: Activity },
    { label: "Avg Response Time", value: "< 5 min", icon: Clock },
    { label: "Consultations Today", value: "1,200+", icon: Video }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Healthcare At Your Fingertips
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Connect with qualified Nigerian doctors instantly. Get diagnosis, prescriptions, and expert medical advice from home.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" onClick={() => navigate("/triage")} className="gap-2">
            <MessageSquare className="h-5 w-5" />
            Start Health Check
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
            Doctor Login
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <Card key={idx} className="text-center">
              <CardContent className="pt-6">
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <Card 
              key={idx} 
              className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
              onClick={service.action}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${service.color} flex items-center justify-center mb-4`}>
                  <service.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 bg-muted/30 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto mb-4">
              1
            </div>
            <h3 className="font-semibold mb-2">Describe Your Symptoms</h3>
            <p className="text-muted-foreground">Tell us what's bothering you via chat or form</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto mb-4">
              2
            </div>
            <h3 className="font-semibold mb-2">Connect with a Doctor</h3>
            <p className="text-muted-foreground">Get matched with available specialists</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto mb-4">
              3
            </div>
            <h3 className="font-semibold mb-2">Receive Treatment Plan</h3>
            <p className="text-muted-foreground">Get diagnosis, prescription, and follow-up care</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
