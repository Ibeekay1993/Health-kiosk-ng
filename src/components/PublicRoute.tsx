
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { FC } from "react";

const PublicRoute: FC = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (user) {
    if (profile?.role === 'doctor') {
      return <Navigate to="/doctor-dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default PublicRoute;
