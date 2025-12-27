
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Stethoscope } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { nigeriaStates } from "@/lib/nigeria-states";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [selectedState, setSelectedState] = useState<string>("");
  const [lgas, setLgas] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    lga: "",
  });

  useEffect(() => {
    const processSession = (session: any) => {
        if (session) {
            setUser(session.user);
            const fullName = session.user.user_metadata.fullName || "";
            const nameParts = fullName.split(' ');
            const firstName = nameParts.shift() || "";
            const lastName = nameParts.join(' ') || "";
            setFormData(prev => ({ ...prev, firstName, lastName }));
        } else {
            navigate("/login");
        }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        processSession(session)
      } else if (event === "SIGNED_OUT") {
        navigate("/login");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      processSession(session)
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    if (selectedState) {
      const state = nigeriaStates.find(state => state.state === selectedState);
      setLgas(state ? state.lgas : []);
      setFormData(prev => ({...prev, lga: ""}));
    } else {
      setLgas([]);
    }
  }, [selectedState]);

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!user) {
      toast({ title: "Error", description: "You must be logged in to complete your profile.", variant: "destructive" });
      setLoading(false);
      return;
    }

    const { firstName, lastName, phone, lga } = formData;
    const fullName = `${firstName} ${lastName}`.trim();
    const location = selectedState && lga ? `${lga}, ${selectedState}` : "";

    if (!firstName || !lastName || !phone || !location) {
      toast({ title: "Validation Error", description: "Please fill out all fields.", variant: "destructive" });
      setLoading(false);
      return;
    }

    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName, // Ensure snake_case for DB
          phone: phone,
          location: location,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (profileError) throw profileError;

      toast({
        title: "Profile Completed",
        description: "Your account is now fully set up.",
      });

      navigate("/dashboard");

    } catch (error: any) {
      toast({
        title: "Profile Completion Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Stethoscope className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">HealthKiosk NG</h1>
          </div>
          <p className="text-muted-foreground">Complete your profile</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>One Last Step</CardTitle>
            <CardDescription>Please provide these details to complete your registration.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCompleteProfile} className="space-y-4">
                <div className="flex gap-4">
                    <div className="space-y-2 flex-1">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                        id="firstName"
                        required
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2 flex-1">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                        id="lastName"
                        required
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        />
                    </div>
                </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select onValueChange={setSelectedState} required>
                  <SelectTrigger><SelectValue placeholder="Select a state" /></SelectTrigger>
                  <SelectContent>
                    {nigeriaStates.map((state) => (<SelectItem key={state.state} value={state.state}>{state.state}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>

              {selectedState && (
                <div className="space-y-2">
                  <Label htmlFor="lga">LGA</Label>
                  <Select value={formData.lga} onValueChange={(value) => handleInputChange("lga", value)} required>
                    <SelectTrigger><SelectValue placeholder="Select a LGA" /></SelectTrigger>
                    <SelectContent>
                      {lgas.map((lga) => (<SelectItem key={lga} value={lga}>{lga}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving..." : "Complete Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompleteProfile;
