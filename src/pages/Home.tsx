import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Activity, Video, Calendar, FileText, Heart, Users, Shield, Zap } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section - Compact */}
      <section className="relative bg-gradient-to-r from-primary to-secondary text-white py-12 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full">
              <Heart className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            Healthcare At Your Fingertips
          </h1>
          <p className="text-base md:text-lg mb-6 opacity-95 max-w-2xl mx-auto">
            Connect with qualified Nigerian doctors instantly. Get diagnosis, prescriptions, and expert medical advice from home.
          </p>
          <div className="flex flex-col gap-3 max-w-lg mx-auto">
            <Button 
              size="lg" 
              onClick={() => navigate("/triage")}
              className="w-full bg-white text-primary hover:bg-white/90 font-semibold text-base py-6 shadow-lg"
            >
              Start Consultation
            </Button>
            <Button 
              size="lg" 
              onClick={() => navigate("/login")}
              className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold text-base py-6 shadow-lg"
            >
              Register / Login
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works - Horizontal */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">How It Works</h2>
          <div className="flex flex-row justify-center items-center gap-4 md:gap-8 max-w-5xl mx-auto flex-wrap">
            <div className="flex items-center gap-3 min-w-[200px]">
              <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 flex-shrink-0 bg-primary/10 rounded-full">
                <Activity className="h-8 w-8 md:h-12 md:w-12 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm md:text-lg">Find a Kiosk</h3>
            </div>
            <div className="hidden md:block text-primary text-2xl">→</div>
            <div className="flex items-center gap-3 min-w-[200px]">
              <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 flex-shrink-0 bg-secondary/10 rounded-full">
                <Video className="h-8 w-8 md:h-12 md:w-12 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm md:text-lg">Connect to Doctor</h3>
            </div>
            <div className="hidden md:block text-primary text-2xl">→</div>
            <div className="flex items-center gap-3 min-w-[200px]">
              <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 flex-shrink-0 bg-secondary/10 rounded-full">
                <FileText className="h-8 w-8 md:h-12 md:w-12 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm md:text-lg">Get Care</h3>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer - Card Grid */}
      <section className="py-12 px-4 bg-muted/40">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">What we Offer</h2>
          <div className="grid gap-4">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all bg-card border-border hover:border-primary" 
              onClick={() => navigate("/find-kiosk")}
            >
              <CardContent className="flex items-center gap-4 p-5">
                <Activity className="h-10 w-10 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground text-lg">Find a Kiosk</h3>
                  <p className="text-sm text-muted-foreground">Locate nearest healthcare kiosk</p>
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all bg-card border-border hover:border-primary" 
              onClick={() => navigate("/triage")}
            >
              <CardContent className="flex items-center gap-4 p-5">
                <Video className="h-10 w-10 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground text-lg">Connect to Doctor</h3>
                  <p className="text-sm text-muted-foreground">Chat with AI or speak to a doctor</p>
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all bg-card border-border hover:border-primary" 
              onClick={() => navigate("/appointments")}
            >
              <CardContent className="flex items-center gap-4 p-5">
                <Calendar className="h-10 w-10 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground text-lg">Get Care</h3>
                  <p className="text-sm text-muted-foreground">Book appointments and consultations</p>
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all bg-card border-border hover:border-primary" 
              onClick={() => navigate("/records")}
            >
              <CardContent className="flex items-center gap-4 p-5">
                <FileText className="h-10 w-10 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground text-lg">Health Records</h3>
                  <p className="text-sm text-muted-foreground">Access your medical history</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Impact - Stats */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">Our Impact</h2>
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            <div className="text-center">
              <Users className="h-10 w-10 md:h-12 md:w-12 text-primary mx-auto mb-2" />
              <h3 className="text-2xl md:text-4xl font-bold mb-1 text-foreground">10,000+</h3>
              <p className="text-xs md:text-sm text-muted-foreground">Patients Served</p>
            </div>
            <div className="text-center">
              <Shield className="h-10 w-10 md:h-12 md:w-12 text-secondary mx-auto mb-2" />
              <h3 className="text-2xl md:text-4xl font-bold mb-1 text-foreground">500+</h3>
              <p className="text-xs md:text-sm text-muted-foreground">Kiosk Partners</p>
            </div>
            <div className="text-center">
              <Zap className="h-10 w-10 md:h-12 md:w-12 text-secondary mx-auto mb-2" />
              <h3 className="text-2xl md:text-4xl font-bold mb-1 text-foreground">24/7</h3>
              <p className="text-xs md:text-sm text-muted-foreground">Available Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to Access Quality Healthcare?
          </h2>
          <p className="text-base md:text-lg mb-6 opacity-95">
            Join thousands of Nigerians getting affordable, accessible healthcare
          </p>
          <Button 
            size="lg"
            onClick={() => navigate("/triage")}
            className="bg-white text-primary hover:bg-white/90 font-semibold text-base md:text-lg px-8 py-6 shadow-lg"
          >
            Start Your Consultation Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
