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
import { nigeriaStates } from "@/lib/nigeria-states";

type Specialization = {
  name: string;
};

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string>("patient");
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [registered, setRegistered] = useState(false);
  const [selectedState, setSelectedState] = useState<string>("");
  const [lgas, setLgas] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    lga: "",
    specialization: "", // for doctors
    licenseNumber: "", // for doctors
    pharmacyName: "", // for vendors
    vehicleType: "", // for delivery riders
    businessName: "", // for kiosk partners
  });

  useEffect(() => {
    if (selectedState) {
      const state = nigeriaStates.find(state => state.state === selectedState);
      setLgas(state ? state.lgas : []);
      handleInputChange("lga", ""); // Reset LGA when state changes
    } else {
      setLgas([]);
    }
  }, [selectedState]);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const { data, error } = await supabase.rpc('get_doctor_specializations' as any);
        if (error) throw error;
        if (data && Array.isArray(data)) {
          setSpecializations(data.map((s: any) => ({ name: s })));
        } else {
          throw new Error("Invalid specialization data received");
        }
      } catch (error: any) {
        console.error("Error fetching specializations:", error.message);
        setSpecializations([
            { name: "General Medicine" }, { name: "Pediatrics" }, { name: "Cardiology" },
            { name: "Dermatology" }, { name: "Neurology" }, { name: "Orthopedics" },
            { name: "Oncology" }, { name: "Gastroenterology" }, { name: "Psychiatry" },
            { name: "Family Medicine" },
        ]);
        toast({
          title: "Could not fetch specializations",
          description: "Using a default list. Please try again later.",
          variant: "destructive"
        });
      }
    };

    if (role === 'doctor') {
      fetchSpecializations();
    }
  }, [role, toast]);


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { 
        email, password, firstName, lastName, phone, lga,
        specialization, licenseNumber, pharmacyName, vehicleType, businessName 
    } = formData;
    
    const fullName = `${firstName} ${lastName}`.trim();
    const location = selectedState && lga ? `${lga}, ${selectedState}` : "";

    if (!email || !password || !firstName || !lastName || !phone || !location) {
        toast({ title: "Registration Failed", description: "Please fill in all required fields, including state and LGA.", variant: "destructive" });
        setLoading(false);
        return;
    }

    try {
        const { data: { user }, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
              data: {
                fullName: fullName,
                phone: phone,
                location: location,
                role: role,
                specialization: specialization,
                licenseNumber: licenseNumber,
                pharmacyName: pharmacyName,
                vehicleType: vehicleType,
                businessName: businessName,
              }
            }
        });

        if (authError) throw authError;
        if (!user) throw new Error("Registration failed, user not created.");

        setRegistered(true);
        toast({
            title: "Registration Successful",
            description: "Please check your email to confirm your account.",
        });

    } catch (error: any) {
        let errorMessage = error.message || "An unexpected error occurred.";
        if (error.message && (error.message.includes("Database error saving new user") || error.message.includes("violates check constraint"))) {
            errorMessage = "A database error occurred. Please ensure all fields are correct and try again.";
        }

        toast({
            title: "Registration Failed",
            description: errorMessage,
            variant: "destructive",
        });
    } finally {
        setLoading(false);
    }
};

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Google Login Failed",
        description: error.message,
        variant: "destructive",
      });
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
          <p className="text-muted-foreground">Create your account to get started</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{registered ? "Check Your Email" : "Register"}</CardTitle>
            <CardDescription>{registered ? "We've sent a confirmation link to your email." : "Choose your role and fill in your details."}</CardDescription>
          </CardHeader>
          <CardContent>
            {registered ? (
              <div className="space-y-4 text-center">
                 <p>Your registration was successful! Please check your inbox and click the confirmation link to activate your account.</p>
                <Button onClick={() => navigate("/login")} className="w-full mt-4">Proceed to Login</Button>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">I am a</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient">Patient</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="vendor">Pharmacy/Vendor</SelectItem>
                      <SelectItem value="delivery_rider">Delivery Rider</SelectItem>
                      <SelectItem value="kiosk_partner">Kiosk Partner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-4">
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" required value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} />
                    </div>
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" required value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} />
                    </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" required value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
                </div>

                {/* Location fields - now visible for all roles */}
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

                {role === "doctor" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Select value={formData.specialization} onValueChange={(value) => handleInputChange('specialization', value)} required>
                        <SelectTrigger><SelectValue placeholder="Select a specialization" /></SelectTrigger>
                        <SelectContent>
                          {specializations.map((spec) => (<SelectItem key={spec.name} value={spec.name}>{spec.name}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">License Number</Label>
                      <Input id="licenseNumber" required value={formData.licenseNumber} onChange={(e) => handleInputChange('licenseNumber', e.target.value)} />
                    </div>
                  </>
                )}

                {role === "vendor" && (
                  <div className="space-y-2">
                    <Label htmlFor="pharmacyName">Pharmacy Name</Label>
                    <Input id="pharmacyName" required value={formData.pharmacyName} onChange={(e) => handleInputChange('pharmacyName', e.target.value)} />
                  </div>
                )}

                {role === "delivery_rider" && (
                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">Vehicle Type</Label>
                    <Select value={formData.vehicleType} onValueChange={(value) => handleInputChange('vehicleType', value)} required>
                      <SelectTrigger><SelectValue placeholder="Select vehicle type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="motorcycle">Motorcycle</SelectItem>
                        <SelectItem value="bicycle">Bicycle</SelectItem>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {role === "kiosk_partner" && (
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input id="businessName" required value={formData.businessName} onChange={(e) => handleInputChange('businessName', e.target.value)} />
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating Account..." : "Register"}
                </Button>
              </form>
            )}

            {!registered && (
                <>
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div>
                </div>

                <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                    <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-5.63 1.9-4.76 0-8.64-3.89-8.64-8.64s3.88-8.64 8.64-8.64c2.69 0 4.33 1.01 5.31 1.94l2.43-2.43C18.4 1.46 15.63 0 12.48 0 5.88 0 0 5.88 0 12.48s5.88 12.48 12.48 12.48c7.14 0 11.95-4.99 11.95-12.15 0-.79-.07-1.54-.19-2.28z"></path></svg>
                    Sign up with Google
                </Button>
                </>
            )}

            <div className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <button onClick={() => navigate("/login")} className="text-primary hover:underline font-medium">
                Sign in
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
