
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";

interface Referee {
    name: string;
    email: string;
    phone: string;
}

interface RefereeSubmissionProps {
  data: {
    referees: Referee[];
  };
  updateData: (data: Partial<{ referees: Referee[] }>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const RefereeSubmission = ({ data, updateData, onNext, onPrev }: RefereeSubmissionProps) => {

  const handleRefereeChange = (index: number, field: keyof Referee, value: string) => {
    const newReferees = [...data.referees];
    newReferees[index] = { ...newReferees[index], [field]: value };
    updateData({ referees: newReferees });
  };

  const addReferee = () => {
    updateData({ referees: [...data.referees, { name: "", email: "", phone: "" }] });
  };

  const removeReferee = (index: number) => {
    const newReferees = data.referees.filter((_, i) => i !== index);
    updateData({ referees: newReferees });
  };

  return (
    <div className="space-y-6">
      {data.referees.map((referee, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-4 relative bg-muted/50">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeReferee(index)}>
                <X className="h-4 w-4" />
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor={`referee-name-${index}`}>Referee Name</Label>
                    <Input id={`referee-name-${index}`} value={referee.name} onChange={(e) => handleRefereeChange(index, 'name', e.target.value)} placeholder="Dr. Jane Doe" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`referee-email-${index}`}>Email</Label>
                    <Input id={`referee-email-${index}`} type="email" value={referee.email} onChange={(e) => handleRefereeChange(index, 'email', e.target.value)} placeholder="jane.doe@example.com" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`referee-phone-${index}`}>Phone</Label>
                    <Input id={`referee-phone-${index}`} type="tel" value={referee.phone} onChange={(e) => handleRefereeChange(index, 'phone', e.target.value)} placeholder="+1..." />
                </div>
            </div>
        </div>
      ))}

      <Button variant="outline" onClick={addReferee} className="w-full flex items-center gap-2">
        <Plus className="h-4 w-4" /> Add Another Referee
      </Button>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrev}>Previous</Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
};

export default RefereeSubmission;
