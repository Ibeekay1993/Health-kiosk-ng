
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { FC } from "react";

const PublicRoute: FC = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
