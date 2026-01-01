
import { useProfile } from "@/hooks/use-profile";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, User, Lock, Briefcase, FileText } from "lucide-react";
import PersonalInfoTab from "@/components/profile/PersonalInfoTab";
import SecurityTab from "@/components/profile/SecurityTab";
import DoctorProfileTab from "@/components/profile/DoctorProfileTab";
import PatientProfileTab from "@/components/profile/PatientProfileTab";

const ProfilePage = () => {
  const { profile, loading: profileLoading, refreshProfile } = useProfile();

  if (profileLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  const renderRoleSpecificTab = () => {
    if (!profile) return null;

    switch (profile.role) {
      case 'doctor':
        return (
          <TabsContent value="professional">
            <DoctorProfileTab profile={profile} refreshProfile={refreshProfile} />
          </TabsContent>
        );
      case 'patient':
        return (
          <TabsContent value="medical">
            <PatientProfileTab />
          </TabsContent>
        );
      // Add cases for other roles like 'vendor', 'delivery_rider', etc.
      default:
        return null;
    }
  };

  const renderRoleSpecificTabTrigger = () => {
    if (!profile) return null;

    switch (profile.role) {
      case 'doctor':
        return <TabsTrigger value="professional"><Briefcase className="mr-2 h-4 w-4"/>Professional</TabsTrigger>;
      case 'patient':
        return <TabsTrigger value="medical"><FileText className="mr-2 h-4 w-4"/>Medical</TabsTrigger>;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
        </header>
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-auto">
            <TabsTrigger value="personal"><User className="mr-2 h-4 w-4"/>Personal Info</TabsTrigger>
            <TabsTrigger value="security"><Lock className="mr-2 h-4 w-4"/>Security</TabsTrigger>
            {renderRoleSpecificTabTrigger()}
          </TabsList>
          
          <TabsContent value="personal">
             <PersonalInfoTab profile={profile} refreshProfile={refreshProfile} />
          </TabsContent>
          
          <TabsContent value="security">
            <SecurityTab />
          </TabsContent>

          {renderRoleSpecificTab()}

        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
