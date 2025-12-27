import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Heart, FileText, Lock, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error checking session:", error.message);
        return;
      }
      if (data.session) {
        navigate("/dashboard");
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-secondary text-white py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Health Kiosk NG – Digital Access to Essential Health Support
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-95 max-w-3xl mx-auto">
            A secure digital platform helping individuals access basic health information and services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/register")}
              className="bg-white text-primary hover:bg-white/90 font-semibold text-lg py-6 px-8 shadow-lg"
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              onClick={() => navigate("/login")}
              className="bg-secondary hover:bg-secondary/90 text-white font-semibold text-lg py-6 px-8 shadow-lg"
            >
              Access Health Services
            </Button>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-10 text-foreground">What We Do</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground text-xl mb-2">Health Information Access</h3>
                <p className="text-muted-foreground">
                  Access a wide range of health topics and information to stay informed about your well-being.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground text-xl mb-2">Digital Health Requests</h3>
                <p className="text-muted-foreground">
                  Request appointments, prescriptions, and lab tests through our secure digital platform.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground text-xl mb-2">Secure Data Handling</h3>
                <p className="text-muted-foreground">
                  Your health information is kept secure and private with our robust data protection measures.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Compliance Strip */}
      <section className="bg-muted/40 py-6 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>Secure Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <span>Privacy-Focused</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">Disclaimer:</span>
              <span>Not a Substitute for Professional Medical Advice</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (Simplified) */}
      <footer className="py-8 px-4 bg-gray-800 text-white">
        <div className="container mx-auto text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Health Kiosk NG. All rights reserved.</p>
          <div className="mt-4">
            <a href="/privacy-policy" className="hover:underline mx-2">Privacy Policy</a>
            <a href="/disclaimer" className="hover:underline mx-2">Health Disclaimer</a>
            <a href="/contact" className="hover:underline mx-2">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
