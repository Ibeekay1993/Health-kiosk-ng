
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "../../types/supabase";

// Define the shape of the profile data
interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  occupation?: string;
  address?: string;
  emergency_contact?: string;
  avatar_url?: string;
  role: string;
}

const MedicalRecordsLayout = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [patientProfile, setPatientProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (session) {
          const currentUser = session.user;
          setUser(currentUser);

          // Correctly query the 'profiles' table using the user's ID
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", currentUser.id)
            .single();

          if (profileError && profileError.code === 'PGRST116') { // 'PGRST116' means no rows found
            // Profile doesn't exist, create a new one in the 'profiles' table
            const { data: newProfile, error: insertError } = await supabase
              .from("profiles")
              .insert({
                id: currentUser.id, // Set the profile ID to match the auth user's ID
                email: currentUser.email!, // Email is a required field in the 'profiles' table
                full_name: currentUser.user_metadata.full_name || 'New User',
                phone: currentUser.user_metadata.phone,
                role: "patient", // Assign the 'patient' role
              })
              .select()
              .single();

            if (insertError) throw insertError;
            setPatientProfile(newProfile);
            toast({ title: "Profile Created", description: "Welcome! Your patient profile has been automatically set up." });
          } else if (profileError) {
            // Handle other errors that might occur when fetching the profile
            throw profileError;
          } else {
            // If the profile exists, set it
            setPatientProfile(profileData);
          }
        }
      } catch (error: any) {
        toast({
          title: "Error Loading Data",
          description: error.message || "There was a problem retrieving your profile.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  // Check if the patient's profile is complete
  const isProfileComplete = patientProfile &&
    patientProfile.date_of_birth &&
    patientProfile.gender &&
    patientProfile.occupation &&
    patientProfile.address &&
    patientProfile.emergency_contact;

  const getNavLinkClass = (path: string) => {
    const currentPath = location.pathname.split('/').pop();
    const isOverview = path === 'overview' && (currentPath === 'medical-records' || currentPath === '');
    return (currentPath === path || isOverview) ? "border-b-2 border-primary text-primary" : "text-muted-foreground";
  };

  if (loading) {
    return <div className="p-8 text-center">Loading medical records...</div>;
  }

  // Fallback for if user/profile data couldn't be loaded, though withAuth HOC should prevent this.
  if (!user || !patientProfile) {
    return <div className="p-8 text-center">Could not load your profile. Please try logging in again.</div>;
  }

  return (
    <div className="p-8">
      {!isProfileComplete && (
        <Card className="mb-8 bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800">Complete Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700 mb-4">
              Please complete your profile to get the most out of our platform. Some features may be limited until your profile is complete.
            </p>
            <NavLink to="/medical-records/overview">
              <Button>Complete Profile</Button>
            </NavLink>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-6 mb-8">
        <Avatar className="h-24 w-24">
          <AvatarImage src={patientProfile.avatar_url || user.user_metadata?.avatar_url} alt={patientProfile.full_name} />
          <AvatarFallback>{patientProfile.full_name?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{patientProfile.full_name}</h1>
          <p className="text-muted-foreground">ID: PAT-{user.id.substring(0, 8).toUpperCase()}</p>
          <Button variant="outline" size="sm" className="mt-2">Change Picture</Button>
        </div>
      </div>

      <div className="flex border-b mb-8 overflow-x-auto">
        <NavLink to="/medical-records" end className={`px-4 py-2 whitespace-nowrap ${getNavLinkClass('overview')}`}>Overview</NavLink>
        <NavLink to="/medical-records/history" className={`px-4 py-2 whitespace-nowrap ${getNavLinkClass('history')}`}>Medical History</NavLink>
        <NavLink to="/medical-records/documents" className={`px-4 py-2 whitespace-nowrap ${getNavLinkClass('documents')}`}>My Documents</NavLink>
        <NavLink to="/medical-records/insurance" className={`px-4 py-2 whitespace-nowrap ${getNavLinkClass('insurance')}`}>Insurance</NavLink>
        <NavLink to="/medical-records/consultations" className={`px-4 py-2 whitespace-nowrap ${getNavLinkClass('consultations')}`}>Consultations</NavLink>
        <NavLink to="/medical-records/prescriptions" className={`px-4 py-2 whitespace-nowrap ${getNavLinkClass('prescriptions')}`}>Prescriptions</NavLink>
        <NavLink to="/medical-records/lab-results" className={`px-4 py-2 whitespace-nowrap ${getNavLinkClass('lab-results')}`}>Lab Results</NavLink>
      </div>

      {children}
    </div>
  );
};

export default MedicalRecordsLayout;
