
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsOfServiceProps {
  data: { hasAgreedToTerms: boolean };
  updateData: (data: Partial<{ hasAgreedToTerms: boolean }>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const TermsOfService = ({ data, updateData, onNext, onPrev }: TermsOfServiceProps) => {

  const handleAgreementChange = (checked: boolean) => {
    updateData({ hasAgreedToTerms: checked });
  }

  return (
    <div className="space-y-6">
        <div className="text-center">
            <h2 className="text-2xl font-semibold">Terms of Service</h2>
            <p className="text-muted-foreground">Please read and agree to our terms of service before continuing.</p>
        </div>

      <ScrollArea className="h-72 w-full rounded-md border p-4">
        <h3 className="font-bold">1. Introduction</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Welcome to our platform. By using our service, you are agreeing to these terms. Please read them carefully.
        </p>
        <h3 className="font-bold">2. Using our Services</h3>
        <p className="text-sm text-muted-foreground mb-4">
            You must follow any policies made available to you within the Services. Don't misuse our Services. For example, don't interfere with our Services or try to access them using a method other than the interface and the instructions that we provide.
        </p>
        <h3 className="font-bold">3. Privacy and Copyright Protection</h3>
        <p className="text-sm text-muted-foreground mb-4">
            Our privacy policies explain how we treat your personal data and protect your privacy when you use our Services. By using our Services, you agree that we can use such data in accordance with our privacy policies.
        </p>
        <h3 className="font-bold">4. Your Content in our Services</h3>
        <p className="text-sm text-muted-foreground mb-4">
            You retain ownership of any intellectual property rights that you hold in that content. In short, what belongs to you stays yours.
        </p>
         <h3 className="font-bold">5. About Software in our Services</h3>
        <p className="text-sm text-muted-foreground mb-4">
            When a Service requires or includes downloadable software, this software may update automatically on your device once a new version or feature is available.
        </p>
      </ScrollArea>

      <div className="flex items-center space-x-2">
        <Checkbox id="terms" checked={data.hasAgreedToTerms} onCheckedChange={(checked) => handleAgreementChange(checked as boolean)} />
        <Label htmlFor="terms" className="font-medium">I have read and agree to the Terms of Service.</Label>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrev}>Previous</Button>
        <Button onClick={onNext} disabled={!data.hasAgreedToTerms}>Next</Button>
      </div>
    </div>
  );
};

export default TermsOfService;
