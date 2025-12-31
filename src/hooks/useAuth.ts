
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

type AppUser = User & {
  user_metadata: {
    role?: "patient" | "doctor" | "vendor";
    is_onboarded?: boolean;
  };
};

const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [role, setRole] = useState<"patient" | "doctor" | "vendor" | null>(null);
  const [is_onboarded, setIsOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
      } else {
        setSession(data.session);
        const appUser = data.session?.user as AppUser | null;
        setUser(appUser);
        if (appUser) {
          setRole(appUser.user_metadata.role || null);
          setIsOnboarded(appUser.user_metadata.is_onboarded || false);
        }
      }
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      const appUser = session?.user as AppUser | null;
      setUser(appUser);
      if (appUser) {
        setRole(appUser.user_metadata.role || null);
        setIsOnboarded(appUser.user_metadata.is_onboarded || false);
      } else {
        setRole(null);
        setIsOnboarded(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { session, user, role, is_onboarded, loading };
};

export default useAuth;
