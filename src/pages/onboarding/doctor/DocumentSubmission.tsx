
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DocumentSubmission = ({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="medical-license">Medical License</Label>
        <Input id="medical-license" type="file" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cv">CV/Resume</Label>
        <Input id="cv" type="file" />
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>Previous</Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
};

export default DocumentSubmission;
