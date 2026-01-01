
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { User, Stethoscope, Store, ShieldCheck, Check, Eye, EyeOff, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks/useAuth";

type Role = "patient" | "doctor" | "vendor" | "admin";

const RoleCard = ({ role, icon, description, selectedRole, onSelect }: { role: Role, icon: React.ReactNode, description: string, selectedRole: Role | "", onSelect: (role: Role) => void }) => (
  <div
    className={cn(
      "p-6 rounded-lg border-2 cursor-pointer transition-all duration-200",
      selectedRole === role ? "border-primary bg-primary/10 shadow-lg" : "border-border hover:border-primary/50 hover:bg-muted/50"
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
      {selectedRole === role && <Check className="h-6 w-6 text-primary" />}
    </div>
  </div>
);

const PasswordStrength = ({ password }: { password: string }) => {
  const getStrength = () => {
    let score = 0;
    if (password.length > 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();
  const strengthText = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColor = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500", "bg-green-700"];

  return (
    <div className="space-y-2">
      <Progress value={(strength / 5) * 100} className={cn("h-2", strengthColor[strength])} />
      <p className="text-xs text-muted-foreground">Password Strength: {strengthText[strength]}</p>
    </div>
  );
};

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role | "">("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (session) navigate("/dashboard");
  }, [session, navigate]);

  const handleNextStep = () => {
    if (step === 1 && !role) {
      toast.error("Please select a role");
      return;
    }
    if (step === 2) {
        if(password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => setStep(step - 1);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone, role },
      },
    });

    if (signUpError) {
      toast.error("Registration Failed", { description: signUpError.message });
      setLoading(false);
      return;
    }

    if (signUpData.user) {
      toast.success("Registration Successful", { description: "Please check your email to verify your account." });
      navigate("/login");
    }

    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    if (!role) {
      toast.error("Please select a role first");
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { queryParams: { role: role } } });
    if (error) toast.error("Google Sign-up Failed", { description: error.message });
  };

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 rounded-2xl shadow-xl overflow-hidden bg-card">
        <div className="hidden md:flex flex-col justify-center items-center p-12 bg-primary/10 text-center border-r border-border">
          <img src="/img/illustrations/register-vector.svg" alt="Person signing up" className="w-full max-w-sm mx-auto mb-8" />
          <h2 className="text-3xl font-bold text-foreground mb-2">Create Your Account</h2>
          <p className="text-muted-foreground">Join our platform to take control of your health journey.</p>
        </div>

        <div className="p-8 md:p-12">
          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="text-center px-0">
              <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
              <CardDescription>Follow the steps to set up your profile.</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <div className="mb-6 space-y-2">
                <Progress value={(step / 3) * 100} className="w-full" />
                <p className="text-sm text-muted-foreground text-center">Step {step} of 3</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                {step === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-center">What is your role?</h3>
                    <RoleCard role="patient" icon={<User className="h-8 w-8 text-primary" />} description="Manage your health records and appointments." selectedRole={role} onSelect={setRole} />
                    <RoleCard role="doctor" icon={<Stethoscope className="h-8 w-8 text-sky-500" />} description="Provide consultations and manage patient care." selectedRole={role} onSelect={setRole} />
                    <RoleCard role="vendor" icon={<Store className="h-8 w-8 text-amber-500" />} description="Offer pharmacy or lab services." selectedRole={role} onSelect={setRole} />
                    <RoleCard role="admin" icon={<ShieldCheck className="h-8 w-8 text-red-500" />} description="Manage your organization and platform settings." selectedRole={role} onSelect={setRole} />
                    <Button type="button" className="w-full !mt-6" onClick={handleNextStep}>Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                      <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or sign up with</span></div>
                    </div>
                    <Button variant="outline" className="w-full" onClick={handleGoogleSignUp} disabled={!role}><FcGoogle className="mr-2 h-5 w-5" />Google</Button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-muted/50 focus:bg-background" />
                    </div>
                    <div className="space-y-2 relative">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-muted/50 focus:bg-background pr-10" />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-8 h-7 w-7 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                    </div>
                    <PasswordStrength password={password} />
                    <div className="flex gap-4 !mt-6">
                      <Button type="button" variant="outline" className="w-full" onClick={handlePrevStep}><ArrowLeft className="mr-2 h-4 w-4" /> Previous</Button>
                      <Button type="button" className="w-full" onClick={handleNextStep}>Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="full-name">Full Name</Label>
                      <Input id="full-name" type="text" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="bg-muted/50 focus:bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" value={phone} onChange={(e) => setPhone(e.target.value)} required className="bg-muted/50 focus:bg-background" />
                    </div>
                    <div className="flex gap-4 !mt-6">
                      <Button type="button" variant="outline" className="w-full" onClick={handlePrevStep}><ArrowLeft className="mr-2 h-4 w-4" /> Previous</Button>
                      <Button type="submit" className="w-full" disabled={loading}>{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}</Button>
                    </div>
                  </div>
                )}

                <div className="mt-6 text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="font-semibold text-primary hover:underline">Log In</Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
