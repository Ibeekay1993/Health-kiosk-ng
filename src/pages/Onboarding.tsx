
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import DoctorOnboarding from "@/pages/onboarding/DoctorOnboarding";
import PatientOnboarding from "@/pages/onboarding/PatientOnboarding";
import VendorOnboarding from "@/pages/onboarding/VendorOnboarding";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const OnboardingPage = () => {
  const { role, loading, is_onboarded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (is_onboarded) {
        navigate("/dashboard");
      } else if (!role) {
        toast({ title: "Role not found!", description: "Please register again to select a role.", variant: "destructive" });
        navigate("/register");
      }
    }
  }, [role, loading, is_onboarded, navigate]);

  const renderOnboardingForm = () => {
    switch (role) {
      case "doctor":
        return <DoctorOnboarding />;
      case "patient":
        return <PatientOnboarding />;
      case "vendor":
        return <VendorOnboarding />;
      default:
        return null; // The useEffect handles redirection
    }
  };

  const getTitleDescription = () => {
    switch (role) {
      case "doctor":
        return { title: "Doctor Onboarding", description: "Please complete your professional profile to get started." };
      case "patient":
        return { title: "Patient Onboarding", description: "Let's set up your personal health profile." };
      case "vendor":
        return { title: "Vendor Onboarding", description: "Complete your business profile to join our network." };
      default:
        return { title: "Completing Your Profile", description: "Please follow the steps to finish your account setup." };
    }
  };

  if (loading || !role) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Skeleton className="h-8 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto mt-2" />
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <div className="flex justify-end pt-4">
                  <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  const { title, description } = getTitleDescription();

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <Card className="shadow-lg">
            <CardHeader className="text-center bg-muted/50 rounded-t-lg p-8">
                <CardTitle className="text-2xl font-bold">{title}</CardTitle>
                <CardDescription className="text-md">{description}</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
                {renderOnboardingForm()}
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingPage;
