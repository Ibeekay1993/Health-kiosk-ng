
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

// Higher-Order Component to protect routes
const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const WithAuthComponent = (props: P) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [profileComplete, setProfileComplete] = useState(false);

    useEffect(() => {
      const checkUser = async () => {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          navigate('/login');
          return;
        }

        setUser(session.user);

        // Check if the user has a complete profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, phone, location')
          .eq('id', session.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') { // PGRST116: row not found
          console.error('Error fetching profile:', profileError);
          navigate('/login'); // Or an error page
          return;
        }

        if (profile && profile.full_name && profile.phone && profile.location) {
          setProfileComplete(true);
        } else {
          navigate('/complete-profile');
        }

        setLoading(false);
      };

      checkUser();
    }, [navigate]);

    if (loading) {
      return <div>Loading...</div>; // Or a spinner component
    }

    if (!user || !profileComplete) {
        // This will be handled by the redirect in useEffect, but as a fallback
        return null;
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent;
};

export default withAuth;
