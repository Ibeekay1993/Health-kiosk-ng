
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error fetching session:", error);
        setLoading(false);
        return;
      }

      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: profile, error: roleError } = await supabase
          .from("profiles")
          .select("role")
          .eq("user_id", session.user.id)
          .single();

        if (roleError) {
          console.error("Error fetching user role:", roleError);
        } else {
          setRole(profile?.role || null);
        }
      }
      setLoading(false);
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          const { data: profile, error: roleError } = await supabase
            .from("profiles")
            .select("role")
            .eq("user_id", session.user.id)
            .single();
          
          if (roleError) {
            console.error("Error on auth state change:", roleError);
            setRole(null);
          } else {
            setRole(profile?.role || null);
          }
        } else {
          setRole(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, role, loading };
}
