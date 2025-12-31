
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const RefereeSubmission = ({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="referee-name">Referee Name</Label>
        <Input id="referee-name" type="text" placeholder="Dr. Jane Doe" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="referee-email">Referee Email</Label>
        <Input id="referee-email" type="email" placeholder="jane.doe@example.com" />
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>Previous</Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
};

export default RefereeSubmission;
