import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import { useState } from "react";

const FindKiosk = () => {
  const [location, setLocation] = useState("");

  const kiosks = [
    {
      id: 1,
      name: "Mama Chidi Pharmacy",
      address: "15 Market Road, Surulere, Lagos",
      phone: "+234 803 123 4567",
      distance: "0.5 km",
      hours: "8:00 AM - 8:00 PM",
      status: "Open"
    },
    {
      id: 2,
      name: "Ola Chemist",
      address: "42 Allen Avenue, Ikeja, Lagos",
      phone: "+234 805 987 6543",
      distance: "1.2 km",
      hours: "7:00 AM - 9:00 PM",
      status: "Open"
    },
    {
      id: 3,
      name: "Unity Health Kiosk",
      address: "28 Awolowo Road, Ikoyi, Lagos",
      phone: "+234 807 456 7890",
      distance: "2.8 km",
      hours: "9:00 AM - 6:00 PM",
      status: "Closed"
    }
  ];

  return (
    <div className="min-h-screen bg-muted/40 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Find a Kiosk Near You</h1>
          <p className="text-muted-foreground">Locate the nearest HealthKiosk partner in your area</p>
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
              <Button className="gap-2">
                <Navigation className="h-4 w-4" />
                Use GPS
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {kiosks.map((kiosk) => (
            <Card key={kiosk.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg mb-1">{kiosk.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{kiosk.address}</span>
                    </div>
                  </div>
                  <Badge variant={kiosk.status === "Open" ? "default" : "secondary"}>
                    {kiosk.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>{kiosk.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{kiosk.hours}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Navigation className="h-4 w-4 text-primary" />
                    <span>{kiosk.distance} away</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">Get Directions</Button>
                  <Button variant="outline" className="flex-1">Call Now</Button>
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
