
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ReloadIcon, ArrowRightIcon, ArrowLeftIcon, PersonIcon, CheckIcon } from "@radix-ui/react-icons";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { FcGoogle } from "react-icons/fc";

// Define the available roles
type Role = "patient" | "doctor" | "vendor";

const RoleCard = ({ role, icon, description, selectedRole, onSelect }: { role: Role, icon: React.ReactNode, description: string, selectedRole: Role | "", onSelect: (role: Role) => void }) => (
  <div
    className={cn(
      "p-6 rounded-lg border-2 cursor-pointer transition-all duration-200",
      selectedRole === role
        ? "border-primary bg-primary/10 shadow-lg"
        : "border-border hover:border-primary/50 hover:bg-muted/50"
    )}
    onClick={() => onSelect(role)}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {icon}
        <div>
          <h3 className="font-bold text-lg">{role.charAt(0).toUpperCase() + role.slice(1)}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {selectedRole === role && <CheckIcon className="h-6 w-6 text-primary" />}
    </div>
  </div>
);

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role | "">("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleNextStep = () => {
    if (step === 1 && !role) {
      toast({ title: "Please select a role", variant: "destructive" });
      return;
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
          role: role,
        },
      },
    });

    if (error) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Registration Successful",
        description: "Please check your email to verify your account.",
      });
      navigate("/login");
    }

    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    if (!role) {
      toast({ title: "Please select a role first", variant: "destructive" });
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          role: role,
        },
      },
    });

    if (error) {
      toast({
        title: "Google Sign-up Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const progressValue = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 rounded-2xl shadow-xl overflow-hidden">
        
        {/* Left Side: Illustration and Welcome Message */}
        <div className="hidden md:flex flex-col justify-center items-center p-12 bg-primary/10 text-center">
          <img src="/img/illustrations/register-vector.svg" alt="A person signing up for a health service" className="w-full max-w-sm mx-auto mb-8" />
          <h2 className="text-3xl font-bold text-foreground mb-2">Create Your Account</h2>
          <p className="text-muted-foreground">Join our platform to take control of your health journey.</p>
        </div>

        {/* Right Side: Registration Form */}
        <div className="bg-card p-8 md:p-12">
          <Card className="border-0 shadow-none">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
              <CardDescription>Join us to manage your health efficiently.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Progress value={progressValue} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2 text-center">Step {step} of 3</p>
              </div>
              
              <form onSubmit={handleRegister} className="space-y-6">
                {step === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-center">What is your role?</h3>
                    <RoleCard role="patient" icon={<PersonIcon className="h-8 w-8 text-primary" />} description="Access health services and manage your records." selectedRole={role} onSelect={setRole} />
                    <RoleCard role="doctor" icon={<PersonIcon className="h-8 w-8 text-sky-500" />} description="Provide consultations and manage patient care." selectedRole={role} onSelect={setRole} />
                    <RoleCard role="vendor" icon={<PersonIcon className="h-8 w-8 text-amber-500" />} description="Manage pharmacy or lab services." selectedRole={role} onSelect={setRole} />
                    <Button type="button" className="w-full" onClick={handleNextStep}>
                      Next <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Button>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full" onClick={handleGoogleSignUp}>
                      <FcGoogle className="mr-2 h-5 w-5" />
                      Sign up with Google
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="flex gap-4">
                      <Button type="button" variant="outline" className="w-full" onClick={handlePrevStep}>
                        <ArrowLeftIcon className="mr-2 h-4 w-4" /> Previous
                      </Button>
                      <Button type="button" className="w-full" onClick={handleNextStep}>
                        Next <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="full-name">Full Name</Label>
                      <Input id="full-name" type="text" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                    <div className="flex gap-4">
                      <Button type="button" variant="outline" className="w-full" onClick={handlePrevStep}>
                        <ArrowLeftIcon className="mr-2 h-4 w-4" /> Previous
                      </Button>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
              
              <div className="mt-6 text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Log In
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
