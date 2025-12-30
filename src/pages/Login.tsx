
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReloadIcon } from "@radix-ui/react-icons";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      navigate("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 rounded-2xl shadow-2xl overflow-hidden bg-card">
        
        {/* Left Side: Welcome Message & Image */}
        <div className="hidden md:flex flex-col justify-center items-center p-12 bg-primary/10 text-center">
          <img src="./img/illustrations/login-vector.svg" alt="Healthcare Illustration" className="w-full max-w-xs mx-auto mb-8" />
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back!</h2>
          <p className="text-muted-foreground">Log in to access your personalized health dashboard and services.</p>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 md:p-12">
          <Card className="border-0 shadow-none">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot Password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> : "Log In"}
                </Button>
              </form>
              <div className="mt-6 text-center text-sm">
                Don't have an account?{" "}
                <Link to="/register" className="font-semibold text-primary hover:underline">
                  Sign Up
                </Link>
              </div>
              <div className="mt-4 text-center text-sm">
                <Link to="/" className="text-muted-foreground hover:text-primary">
                  &larr; Back to Home
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
