
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText, ShieldCheck } from "lucide-react";

interface DocumentSigningProps {
  onPrev: () => void;
  onSubmit: () => Promise<void>;
  isApproved?: boolean; // This would be passed down from a parent component in a real app
}

const DocumentSigning = ({ onPrev, onSubmit, isApproved = false }: DocumentSigningProps) => {
  const [hasAgreed, setHasAgreed] = useState(false);

  return (
    <div className="space-y-6">
      {!isApproved && (
        <Alert variant="destructive">
          <ShieldCheck className="h-4 w-4" />
          <AlertTitle>Approval Pending</AlertTitle>
          <AlertDescription>
            You can review the documents below, but you will not be able to formally sign and complete your onboarding until our team has approved your application.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Required Documents</h3>
        <p className="text-muted-foreground text-sm">
          Please carefully review the following documents before proceeding. You will be asked to digitally sign these upon approval.
        </p>
        <ul className="space-y-2">
          <li className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <a href="/docs/memorandum-of-agreement.pdf" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
              Memorandum of Agreement (MOA)
            </a>
          </li>
          <li className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <a href="/docs/eligibility-form.pdf" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
              Eligibility Form
            </a>
          </li>
          <li className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <a href="/docs/guarantor-form.pdf" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
              Guarantor Form
            </a>
          </li>
        </ul>
      </div>

      <div className="flex items-center space-x-2 pt-4">
        <Checkbox id="agreement" checked={hasAgreed} onCheckedChange={(checked) => setHasAgreed(checked as boolean)} disabled={!isApproved} />
        <Label htmlFor="agreement" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            I have reviewed and agree to the terms and conditions outlined in the documents above.
        </Label>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev}>Previous</Button>
        <Button onClick={onSubmit} disabled={!hasAgreed || !isApproved}>Submit and Complete Onboarding</Button>
      </div>
    </div>
  );
};

export default DocumentSigning;
