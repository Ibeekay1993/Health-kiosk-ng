
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Rocket } from "lucide-react";

interface PlatformSetupProps {
  onPrev: () => void;
  onSubmit: () => Promise<void>;
}

const PlatformSetup = ({ onPrev, onSubmit }: PlatformSetupProps) => {
  return (
    <div className="space-y-6 text-center">
         <Alert className="max-w-lg mx-auto">
            <Rocket className="h-4 w-4" />
            <AlertTitle>Final Step: Platform Setup</AlertTitle>
            <AlertDescription>
                <p className="mb-2">
                    You're all set! By completing the onboarding, your platform will be provisioned.
                </p>
                <p className="text-sm text-muted-foreground">
                    This process may take a few minutes. You will be redirected to your dashboard once it's ready. 
                </p>
            </AlertDescription>
        </Alert>

      <div className="flex justify-between max-w-lg mx-auto pt-4">
        <Button variant="outline" onClick={onPrev}>Previous</Button>
        <Button onClick={onSubmit}>Complete Onboarding</Button>
      </div>
    </div>
  );
};

export default PlatformSetup;
