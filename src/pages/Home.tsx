import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Activity, Video, Calendar, FileText, Heart, Users, Shield, Zap } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section with HC4A Gradient */}
      <section className="relative bg-gradient-to-r from-primary via-primary to-secondary text-primary-foreground py-12 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <Heart className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            HC4A – Health Care for All
          </h1>
          <p className="text-lg md:text-xl mb-2 font-semibold">
            Doctors on the Move – Chat with a Doctor
          </p>
          <p className="text-base mb-6 opacity-90 max-w-xl mx-auto">
            Transforming local chemist shops into digital health access points for every community in Nigeria
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/triage")}
              className="bg-white text-primary hover:bg-white/90 font-semibold px-6 py-5"
            >
              Start Consultation
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/login")}
              className="border-2 border-white text-white hover:bg-white/10 font-semibold px-6 py-5"
            >
              Register / Login
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-10 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">How HC4A Kiosks Work</h2>
            <p className="text-muted-foreground">
              Bringing healthcare to your doorstep through trusted community partners
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Activity className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-lg">Find a Kiosk</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Locate the nearest HC4A kiosk at your local chemist or community center
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mb-3">
                  <Video className="h-7 w-7 text-secondary" />
                </div>
                <CardTitle className="text-lg">Connect to a Doctor</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Video chat with licensed doctors using our secure platform
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mb-3">
                  <FileText className="h-7 w-7 text-accent" />
                </div>
                <CardTitle className="text-lg">Get Care</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Receive professional medical advice, prescriptions, and referrals
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-10 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Our Services</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Activity, title: "AI Health Check", desc: "Smart symptom assessment", path: "/triage" },
              { icon: Video, title: "Video Consultation", desc: "Connect with doctors", path: "/video" },
              { icon: Calendar, title: "Book Appointment", desc: "Schedule your visit", path: "/appointments" },
              { icon: FileText, title: "Medical Records", desc: "Access your health data", path: "/records" }
            ].map((service, i) => (
              <Card key={i} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(service.path)}>
                <CardHeader className="pb-3">
                  <service.icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-base">{service.title}</CardTitle>
                  <CardDescription className="text-sm">{service.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
            <div>
              <Users className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="text-3xl font-bold mb-1">10,000+</h3>
              <p className="text-muted-foreground text-sm">Patients Served</p>
            </div>
            <div>
              <Shield className="h-10 w-10 text-secondary mx-auto mb-3" />
              <h3 className="text-3xl font-bold mb-1">500+</h3>
              <p className="text-muted-foreground text-sm">Kiosk Partners</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <Zap className="h-10 w-10 text-accent mx-auto mb-3" />
              <h3 className="text-3xl font-bold mb-1">24/7</h3>
              <p className="text-muted-foreground text-sm">Available Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 px-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to Access Quality Healthcare?
          </h2>
          <p className="text-base mb-6 opacity-90">
            Join thousands of Nigerians getting affordable, accessible healthcare
          </p>
          <Button 
            size="lg"
            onClick={() => navigate("/triage")}
            className="bg-white text-primary hover:bg-white/90 font-semibold px-6 py-5"
          >
            Start Your Consultation Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
