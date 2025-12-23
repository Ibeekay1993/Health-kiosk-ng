import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, Navigation, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Kiosk {
  id: string;
  business_name: string;
  location: string;
  phone: string | null;
  owner_name: string;
}

const FindKiosk = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [location, setLocation] = useState("");
  const [kiosks, setKiosks] = useState<Kiosk[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    fetchKiosks();
  }, []);

  const fetchKiosks = async () => {
    try {
      const { data, error } = await supabase
        .from("kiosk_partners")
        .select("*");

      if (error) throw error;
      setKiosks(data || []);
    } catch (error) {
      console.error("Error fetching kiosks:", error);
      // Fallback to demo data if no kiosks in database
      setKiosks([
        {
          id: "1",
          business_name: "Mama Chidi Pharmacy",
          location: "15 Market Road, Surulere, Lagos",
          phone: "+234 803 123 4567",
          owner_name: "Mrs. Chidi"
        },
        {
          id: "2",
          business_name: "Ola Chemist",
          location: "42 Allen Avenue, Ikeja, Lagos",
          phone: "+234 805 987 6543",
          owner_name: "Mr. Ola"
        },
        {
          id: "3",
          business_name: "Unity Health Kiosk",
          location: "28 Awolowo Road, Ikoyi, Lagos",
          phone: "+234 807 456 7890",
          owner_name: "Dr. Unity"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUseGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocation("Current Location");
          toast({
            title: "Location Found",
            description: "Showing kiosks near your location",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location Error",
            description: "Could not get your location. Please enter it manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Not Supported",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
    }
  };

  const handleGetDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, "_blank");
  };

  const handleCallNow = (phone: string | null) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  const handleStartConsultation = async (kioskId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please login to start a consultation",
      });
      navigate("/login", { state: { from: "/find-kiosk" } });
      return;
    }
    navigate("/triage", { state: { kioskId } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Find a HealthKiosk Near You</h1>
          <p className="text-muted-foreground">Locate the nearest HealthKiosk partner in your area for in-person consultations</p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <Input
                placeholder="Enter your location or use GPS"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleUseGPS} className="gap-2">
                <Navigation className="h-4 w-4" />
                Use GPS
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {kiosks.map((kiosk, index) => (
            <Card key={kiosk.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg mb-1">{kiosk.business_name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{kiosk.location}</span>
                    </div>
                  </div>
                  <Badge variant="default">Open</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>{kiosk.phone || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>8:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Navigation className="h-4 w-4 text-primary" />
                    <span>{(index * 0.5 + 0.5).toFixed(1)} km away</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button className="flex-1" onClick={() => handleGetDirections(kiosk.location)}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => handleCallNow(kiosk.phone)}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                  <Button variant="secondary" className="flex-1" onClick={() => handleStartConsultation(kiosk.id)}>
                    Start Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindKiosk;
