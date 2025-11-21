import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Activity, Video, Calendar, FileText, Heart, Users, Shield, Zap } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section with HC4A Gradient */}
      <section className="relative bg-gradient-to-r from-primary via-primary to-secondary text-primary-foreground py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Heart className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            HC4A – Health Care for All
          </h1>
          <p className="text-xl md:text-2xl mb-2 font-semibold">
            Doctors on the Move – Chat with a Doctor
          </p>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Transforming local chemist shops into digital health access points for every community in Nigeria
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/triage")}
              className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-8 py-6"
            >
              Start Consultation
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/login")}
              className="border-2 border-white text-white hover:bg-white/10 font-semibold text-lg px-8 py-6"
            >
              Register / Login
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How HC4A Kiosks Work</h2>
            <p className="text-muted-foreground text-lg">
              Bringing healthcare to your doorstep through trusted community partners
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Activity className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Find a Kiosk</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Locate the nearest HC4A kiosk at your local chemist or community center
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <Video className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle>Connect to a Doctor</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Video chat with licensed doctors using our secure platform
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-accent" />
                </div>
                <CardTitle>Get Care</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Receive professional medical advice, prescriptions, and referrals
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Activity, title: "AI Health Check", desc: "Smart symptom assessment", path: "/triage" },
              { icon: Video, title: "Video Consultation", desc: "Connect with doctors", path: "/video" },
              { icon: Calendar, title: "Book Appointment", desc: "Schedule your visit", path: "/appointments" },
              { icon: FileText, title: "Medical Records", desc: "Access your health data", path: "/records" }
            ].map((service, i) => (
              <Card key={i} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(service.path)}>
                <CardHeader>
                  <service.icon className="h-10 w-10 text-primary mb-2" />
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription>{service.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-4xl font-bold mb-2">10,000+</h3>
              <p className="text-muted-foreground">Patients Served</p>
            </div>
            <div>
              <Shield className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="text-4xl font-bold mb-2">500+</h3>
              <p className="text-muted-foreground">Kiosk Partners</p>
            </div>
            <div>
              <Zap className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-4xl font-bold mb-2">24/7</h3>
              <p className="text-muted-foreground">Available Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Access Quality Healthcare?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of Nigerians getting affordable, accessible healthcare
          </p>
          <Button 
            size="lg"
            onClick={() => navigate("/triage")}
            className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-8 py-6"
          >
            Start Your Consultation Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
