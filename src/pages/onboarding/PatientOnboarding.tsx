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

const PatientOnboarding = () => {
  const { user } = useAuth();
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
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
        date_of_birth: dateOfBirth,
        address,
        emergency_contact_name: emergencyContactName,
        emergency_contact_phone: emergencyContactPhone,
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
        <CardTitle>Complete Your Patient Profile</CardTitle>
        <CardDescription>Please provide your personal details to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              type="text"
              placeholder="123 Main St, Anytown USA"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergency-name">Emergency Contact Name</Label>
            <Input
              id="emergency-name"
              type="text"
              placeholder="Jane Doe"
              value={emergencyContactName}
              onChange={(e) => setEmergencyContactName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergency-phone">Emergency Contact Phone</Label>
            <Input
              id="emergency-phone"
              type="tel"
              placeholder="+1 (555) 987-6543"
              value={emergencyContactPhone}
              onChange={(e) => setEmergencyContactPhone(e.target.value)}
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

export default PatientOnboarding;
