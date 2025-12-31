import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";
import Stepper from "@/components/ui/stepper";
import ProfessionalProfile from "./doctor/ProfessionalProfile";
import DocumentSubmission from "./doctor/DocumentSubmission";
import RefereeSubmission from "./doctor/RefereeSubmission";
import InterviewPreparation from "./doctor/InterviewPreparation";
import HrReview from "./doctor/HrReview";
import DocumentSigning from "./doctor/DocumentSigning";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  "Professional Profile",
  "Document Submission",
  "Referee Submission",
  "Interview Preparation",
  "HR Review and Approval",
  "Document Signing",
];

const DoctorOnboarding = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

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

    // In a real application, you would gather all the data from the previous steps
    // and send it to your backend here.

    const { error } = await supabase.auth.updateUser({
      data: { is_onboarded: true }
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
        return <ProfessionalProfile onNext={handleNext} />;
      case 2:
        return <DocumentSubmission onNext={handleNext} onPrev={handlePrev} />;
      case 3:
        return <RefereeSubmission onNext={handleNext} onPrev={handlePrev} />;
      case 4:
        return <InterviewPreparation onNext={handleNext} onPrev={handlePrev} />;
      case 5:
        return <HrReview onNext={handleNext} onPrev={handlePrev} />;
      case 6:
        return <DocumentSigning onPrev={handlePrev} onSubmit={handleSubmit} />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">Doctor Onboarding</CardTitle>
        <Stepper currentStep={currentStep} steps={steps} />
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
};

export default DoctorOnboarding;
