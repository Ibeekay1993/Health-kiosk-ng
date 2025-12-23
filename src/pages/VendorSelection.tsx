import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Clock, Navigation, Star, Truck, Store } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Vendor {
  id: string;
  pharmacy_name: string;
  location: string;
  phone: string;
  status: string;
  latitude: number | null;
  longitude: number | null;
}

const VendorSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const prescriptionId = location.state?.prescriptionId;

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    fetchVendors();
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .eq("status", "active");

      if (error) throw error;
      setVendors(data || []);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast({
        title: "Error",
        description: "Failed to load vendors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (vendorLat: number | null, vendorLng: number | null) => {
    if (!userLocation || !vendorLat || !vendorLng) return "N/A";
    
    const R = 6371; // Radius of the Earth in km
    const dLat = (vendorLat - userLocation.lat) * Math.PI / 180;
    const dLon = (vendorLng - userLocation.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(vendorLat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return `${distance.toFixed(1)} km`;
  };

  const handleSelectVendor = async (vendorId: string) => {
    setSelectedVendor(vendorId);
  };

  const handleConfirmOrder = async () => {
    if (!selectedVendor) {
      toast({
        title: "Select a vendor",
        description: "Please select a pharmacy to continue",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create order
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      // Get patient record
      const { data: patientData } = await supabase
        .from("patients")
        .select("id")
        .eq("user_id", session.user.id)
        .single();

      const { error } = await supabase.from("orders").insert({
        prescription_id: prescriptionId,
        patient_id: patientData?.id,
        vendor_id: selectedVendor,
        delivery_type: deliveryType,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Order Placed!",
        description: `Your ${deliveryType === "delivery" ? "delivery" : "pickup"} order has been placed.`,
      });

      navigate("/records");
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive",
      });
    }
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Choose a Pharmacy</h1>
          <p className="text-muted-foreground">Select a pharmacy to fulfill your prescription</p>
        </div>

        {/* Delivery Type Selection */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">How would you like to receive your medication?</h3>
            <div className="flex gap-4">
              <Button
                variant={deliveryType === "delivery" ? "default" : "outline"}
                className="flex-1 h-20 flex-col gap-2"
                onClick={() => setDeliveryType("delivery")}
              >
                <Truck className="h-6 w-6" />
                <span>Home Delivery</span>
              </Button>
              <Button
                variant={deliveryType === "pickup" ? "default" : "outline"}
                className="flex-1 h-20 flex-col gap-2"
                onClick={() => setDeliveryType("pickup")}
              >
                <Store className="h-6 w-6" />
                <span>Pickup</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <Input
                placeholder="Search by location..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="flex-1"
              />
              <Button onClick={getUserLocation} variant="outline" className="gap-2">
                <Navigation className="h-4 w-4" />
                Use GPS
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Vendors List */}
        <div className="space-y-4">
          {vendors.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No pharmacies available in your area</p>
              </CardContent>
            </Card>
          ) : (
            vendors.map((vendor) => (
              <Card 
                key={vendor.id} 
                className={`hover:shadow-lg transition-all cursor-pointer ${
                  selectedVendor === vendor.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => handleSelectVendor(vendor.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg mb-1">{vendor.pharmacy_name}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4" />
                        <span>{vendor.location}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="default">Open</Badge>
                      {selectedVendor === vendor.id && (
                        <Badge variant="secondary">Selected</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{vendor.phone || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>8:00 AM - 8:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Navigation className="h-4 w-4 text-primary" />
                      <span>{calculateDistance(vendor.latitude, vendor.longitude)} away</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">(48 reviews)</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Confirm Button */}
        {selectedVendor && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
            <div className="max-w-4xl mx-auto">
              <Button className="w-full h-12 text-lg" onClick={handleConfirmOrder}>
                Confirm {deliveryType === "delivery" ? "Delivery" : "Pickup"} Order
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorSelection;
