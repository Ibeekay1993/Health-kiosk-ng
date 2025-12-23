import { Stethoscope, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavLink } from "./NavLink";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();
    
    if (data) {
      setUserRole(data.role);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getDashboardLink = () => {
    switch (userRole) {
      case "doctor": return "/doctor-portal";
      case "vendor": return "/vendor-portal";
      case "delivery_rider": return "/delivery-portal";
      case "kiosk_partner": return "/kiosk-portal";
      default: return "/dashboard";
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Stethoscope className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">HealthKiosk NG</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/">Home</NavLink>
          {user && <NavLink to={getDashboardLink()}>Dashboard</NavLink>}
          <NavLink to="/find-kiosk">Find Kiosk</NavLink>
          <NavLink to="/triage">Consultation</NavLink>
          {user ? (
            <Button onClick={handleSignOut} variant="outline" size="sm">
              Sign Out
            </Button>
          ) : (
            <Button onClick={() => navigate("/login")} size="sm">
              Login
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t bg-background p-4">
          <div className="flex flex-col gap-4">
            <NavLink to="/" onClick={() => setIsOpen(false)}>Home</NavLink>
            {user && <NavLink to={getDashboardLink()} onClick={() => setIsOpen(false)}>Dashboard</NavLink>}
            <NavLink to="/find-kiosk" onClick={() => setIsOpen(false)}>Find Kiosk</NavLink>
            <NavLink to="/triage" onClick={() => setIsOpen(false)}>Consultation</NavLink>
            {user ? (
              <Button onClick={() => { handleSignOut(); setIsOpen(false); }} variant="outline" size="sm">
                Sign Out
              </Button>
            ) : (
              <Button onClick={() => { navigate("/login"); setIsOpen(false); }} size="sm">
                Login
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
