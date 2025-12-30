
import { Outlet, useNavigate } from "react-router-dom";
import BottomNav from "@/components/shared/BottomNav";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>
      </header>
      <main className="pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default DashboardLayout;
