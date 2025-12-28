import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { session, loading: authLoading, user } = useAuth();
  const [profile, setProfile] = useState<any | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (user) {
      const fetchUserProfile = async (userId: string) => {
        setProfileLoading(true);
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", userId)
            .single();
          if (error && error.code !== 'PGRST116') throw error; // Ignore no-rows error
          if (data) setProfile(data);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setProfile(null);
        } finally {
          setProfileLoading(false);
        }
      };
      fetchUserProfile(user.id);
    } else if (!authLoading) {
      // If no user and auth is not loading, we can stop the profile loading
      setProfileLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // if (profile && (!profile.full_name || !profile.phone || !profile.location)) {
  //   if (location.pathname !== "/complete-profile") {
  //     return <Navigate to="/complete-profile" state={{ from: location }} replace />;
  //   }
  // }

  if (allowedRoles && (!profile?.role || !allowedRoles.includes(profile.role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
