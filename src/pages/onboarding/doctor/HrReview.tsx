
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock } from "lucide-react";

interface HrReviewProps {
  onNext: () => void;
  onPrev: () => void;
}

const HrReview = ({ onNext, onPrev }: HrReviewProps) => {
  return (
    <div className="space-y-6 flex flex-col items-center text-center">
      <Alert className="max-w-lg">
        <Clock className="h-4 w-4" />
        <AlertTitle>Application Under Review</AlertTitle>
        <AlertDescription>
          <p className="mb-2">
            Thank you for submitting your information. Our HR team is currently reviewing your profile, documents, and video introduction.
          </p>
          <p className="text-sm text-muted-foreground">
            This process typically takes 3-5 business days. We appreciate your patience and will notify you via email as soon as a decision is made.
          </p>
        </AlertDescription>
      </Alert>

      <p className="text-sm text-muted-foreground pt-4">
        You may proceed to the final step to prepare for document signing, but you will only be able to sign once your application is approved.
      </p>

      <div className="flex justify-between w-full max-w-lg pt-4">
        <Button variant="outline" onClick={onPrev}>Previous</Button>
        <Button onClick={onNext}>Continue to Final Step</Button>
      </div>
    </div>
  );
};

export default HrReview;
