
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/types";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (user: User) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*, doctors(*)")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      if (profileData) {
        // Supabase can return 'doctors' as an array or an object. We handle both.
        const doctorInfo = Array.isArray(profileData.doctors)
          ? profileData.doctors[0]
          : profileData.doctors;

        // Combine data from both tables into a single Profile object
        const combinedProfile: Profile = {
          ...profileData,
          ...(doctorInfo || {}),
        };

        // The original 'doctors' property is redundant if its data is merged.
        delete combinedProfile.doctors;

        setProfile(combinedProfile);
      } else {
        // Handle case where no profile is found for the user
        setProfile(null);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        const currentUser = session?.user;
        setUser(currentUser ?? null);

        if (currentUser) {
          await fetchProfile(currentUser);
        } else {
            setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        setLoading(false);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user;
        setUser(currentUser ?? null);

        if (currentUser) {
          await fetchProfile(currentUser);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  return { user, profile, loading };
};
