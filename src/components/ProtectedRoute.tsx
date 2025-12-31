
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { FC } from "react";

const ProtectedRoute: FC = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if profile is incomplete
  if (profile?.status === 'pending_profile') {
    const onbardingPath = profile.role === 'doctor' ? '/doctor-onboarding/profile' : '/onboarding';
    return <Navigate to={onbardingPath} replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
