import { Outlet } from "react-router-dom";
import BottomNav from "@/components/shared/BottomNav";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default DashboardLayout;
