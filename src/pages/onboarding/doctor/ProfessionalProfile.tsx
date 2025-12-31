
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ProfessionalProfile = ({ onNext }: { onNext: () => void }) => {
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState<number | "">("");
  const [fees, setFees] = useState<number | "">("");

  const handleNext = () => {
    // Add validation logic here if needed
    onNext();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="specialization">Specialization</Label>
        <Input
          id="specialization"
          type="text"
          placeholder="e.g., Cardiology, Pediatrics"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="experience">Years of Experience</Label>
        <Input
          id="experience"
          type="number"
          placeholder="e.g., 5"
          value={experience}
          onChange={(e) => setExperience(Number(e.target.value))}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fees">Consultation Fee (USD)</Label>
        <Input
          id="fees"
          type="number"
          placeholder="e.g., 150"
          value={fees}
          onChange={(e) => setFees(Number(e.target.value))}
          required
        />
      </div>
      <Button onClick={handleNext} className="w-full">Next</Button>
    </div>
  );
};

export default ProfessionalProfile;
