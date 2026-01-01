
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";
import Stepper from "@/components/ui/stepper";
import CompanyProfile from "./admin/CompanyProfile";
import SubscriptionAndBilling from "./admin/SubscriptionAndBilling";
import TermsOfService from "./admin/TermsOfService";
import PlatformSetup from "./admin/PlatformSetup";

const steps = [
  "Company Profile",
  "Subscription and Billing",
  "Terms of Service",
  "Platform Setup",
];

const AdminOnboarding = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  const updateFormData = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Authentication error", description: "Could not find user.", variant: "destructive" });
      return;
    }

    const { error } = await supabase.auth.updateUser({
      data: { 
          is_onboarded: true,
          onboarding_data: formData 
        }
    });

    if (error) {
      toast({ title: "Onboarding Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile Complete!", description: "Redirecting to your dashboard..." });
      navigate("/dashboard");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CompanyProfile data={formData} updateData={updateFormData} onNext={handleNext} />;
      case 2:
        return <SubscriptionAndBilling data={formData} updateData={updateFormData} onNext={handleNext} onPrev={handlePrev} />;
      case 3:
        return <TermsOfService data={formData} updateData={updateFormData} onNext={handleNext} onPrev={handlePrev} />;
      case 4:
        return <PlatformSetup onPrev={handlePrev} onSubmit={handleSubmit} />;
      default:
        return null;
    }
  };

  return (
    <>
        <Stepper currentStep={currentStep} steps={steps} className="mb-8" />
        {renderStep()}
    </>
  );
};

export default AdminOnboarding;
