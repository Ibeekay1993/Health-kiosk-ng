
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ReloadIcon } from "@radix-ui/react-icons";
import useAuth from "@/hooks/useAuth";

const VendorOnboarding = () => {
  const { user } = useAuth();
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Authentication error", description: "Could not find user.", variant: "destructive" });
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        business_name: businessName,
        business_address: businessAddress,
        business_license_number: licenseNumber,
        is_onboarded: true,
      })
      .eq("id", user.id);

    if (error) {
      toast({ title: "Onboarding Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile Complete!", description: "Redirecting to your dashboard..." });
      navigate("/dashboard");
    }

    setLoading(false);
  };

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardHeader className="text-center">
        <CardTitle>Complete Your Vendor Profile</CardTitle>
        <CardDescription>Please provide your business details to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="business-name">Business Name</Label>
            <Input
              id="business-name"
              type="text"
              placeholder="e.g., City Pharmacy"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="business-address">Business Address</Label>
            <Input
              id="business-address"
              type="text"
              placeholder="456 Oak Ave, Anytown USA"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="license-number">Business License Number</Label>
            <Input
              id="license-number"
              type="text"
              placeholder="e.g., 123-ABC-789"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> : "Complete Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VendorOnboarding;
