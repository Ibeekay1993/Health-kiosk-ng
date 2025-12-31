
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { FC } from "react";

const ProtectedRoute: FC = () => {
  const { user, role, is_onboarded, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if profile is incomplete
  if (!is_onboarded) {
    const onbardingPath = role === 'doctor' ? '/doctor-onboarding/profile' : '/onboarding';
    return <Navigate to={onbardingPath} replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
