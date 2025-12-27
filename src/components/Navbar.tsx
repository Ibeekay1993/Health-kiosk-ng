import { Stethoscope, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavLink } from "./NavLink";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";

const navLinks = [
  { to: "/", text: "Home" },
  { to: "/find-kiosk", text: "Find Kiosk" },
  { to: "/triage", text: "Consultation" },
];

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between"></div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Stethoscope className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">HealthKiosk NG</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to}>{link.text}</NavLink>
          ))}
          {user ? (
            <Button onClick={handleSignOut} variant="outline" size="sm">
              Logout
            </Button>
          ) : (
            <>
              <Button onClick={() => navigate("/login")} variant="ghost" size="sm">
                Sign In
              </Button>
              <Button onClick={() => navigate("/register")} size="sm">
                Get Started
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-4 py-6">
                <Link to="/" className="flex items-center gap-2 mb-4">
                  <Stethoscope className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold">HealthKiosk NG</span>
                </Link>
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.to}>
                    <Link
                      to={link.to}
                      className="text-lg font-medium text-muted-foreground hover:text-foreground"
                    >
                      {link.text}
                    </Link>
                  </SheetClose>
                ))}
                <div className="mt-6 border-t pt-6">
                  {user ? (
                    <Button onClick={handleSignOut} className="w-full">
                      Logout
                    </Button>
                  ) : (
                    <div className="grid gap-2">
                      <SheetClose asChild>
                        <Button onClick={() => navigate("/login")} variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button onClick={() => navigate("/register")} className="w-full">
                          Get Started
                        </Button>
                      </SheetClose>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
