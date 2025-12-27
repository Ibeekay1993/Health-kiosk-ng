
import { useMediaQuery } from "@/hooks/use-media-query";
import Dashboard from "./Dashboard";
import MobileDashboard from "./MobileDashboard";

const ResponsiveDashboard = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return isDesktop ? <Dashboard /> : <MobileDashboard />;
};

export default ResponsiveDashboard;
