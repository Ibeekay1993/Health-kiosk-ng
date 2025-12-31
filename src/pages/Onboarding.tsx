
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
        // If there's no role, they likely need to re-register or select one.
        navigate("/register");
      }
    }
  }, [role, loading, is_onboarded, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderOnboardingForm = () => {
    switch (role) {
      case "doctor":
        return <DoctorOnboarding />;
      case "patient":
        return <PatientOnboarding />;
      case "vendor":
        return <VendorOnboarding />;
      default:
        // This case is handled by the useEffect, but as a fallback:
        return (
          <div className="text-center">
            <p>No role found. Redirecting to registration...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        {renderOnboardingForm()}
      </div>
    </div>
  );
};

export default OnboardingPage;
