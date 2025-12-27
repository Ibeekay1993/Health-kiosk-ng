
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Tables } from '@/types/supabase';

export type Profile = Tables<"profiles">;

/**
 * A reusable hook to fetch the authenticated user and their corresponding public profile.
 * It centralizes the data fetching logic and provides a consistent data contract.
 */
export const useProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileData = useCallback(async () => {
    setLoading(true);
    
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      setLoading(false);
      setUser(null);
      setProfile(null);
      return;
    }
    
    setUser(authUser);

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single<Profile>();

    if (profileError) {
      console.error('Error fetching profile:', profileError.message);
      setProfile(null);
    } else if (profileData) {
      setProfile(profileData);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProfileData();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
        fetchProfileData();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchProfileData]);

  return { user, profile, loading, refreshProfile: fetchProfileData };
};
