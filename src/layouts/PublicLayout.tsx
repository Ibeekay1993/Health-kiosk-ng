
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";

const PublicLayout = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/health-education", label: "Health Education" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="text-2xl font-bold text-primary mr-6">
            HealthKiosk
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className="text-muted-foreground transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-1 items-center justify-end space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              {session ? (
                <Button onClick={handleLogout}>Logout</Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate("/login")}>Login</Button>
                  <Button onClick={() => navigate("/register")}>Sign Up</Button>
                </>
              )}
            </div>

            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 p-6">
                  <Link to="/" className="text-lg font-bold text-primary mb-4">HealthKiosk</Link>
                  {navLinks.map(link => (
                    <Link key={link.to} to={link.to} className="text-muted-foreground hover:text-foreground">
                      {link.label}
                    </Link>
                  ))}
                  <div className="border-t pt-4 mt-4 space-y-2">
                    {session ? (
                      <Button onClick={handleLogout} className="w-full">Logout</Button>
                    ) : (
                      <>
                        <Button variant="ghost" onClick={() => navigate("/login")} className="w-full justify-start">Login</Button>
                        <Button onClick={() => navigate("/register")} className="w-full">Sign Up</Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
