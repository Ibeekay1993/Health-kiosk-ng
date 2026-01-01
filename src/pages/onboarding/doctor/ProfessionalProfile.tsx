
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProfessionalProfileProps {
  data: {
    specialty: string;
    licenseNumber: string;
    experience: number;
    fees: number;
    bio: string;
  };
  updateData: (data: Partial<ProfessionalProfileProps['data']>) => void;
  onNext: () => void;
}

const ProfessionalProfile = ({ data, updateData, onNext }: ProfessionalProfileProps) => {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    updateData({ [id]: id === 'experience' || id === 'fees' ? Number(value) : value });
  };

  const handleNext = () => {
    // Add validation logic here
    if (!data.specialty || !data.licenseNumber || data.experience <= 0) {
        // Example validation
        alert("Please fill all required fields.");
        return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Input id="specialty" placeholder="e.g., Cardiology" value={data.specialty} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input id="licenseNumber" placeholder="e.g., 123456789" value={data.licenseNumber} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input id="experience" type="number" placeholder="e.g., 10" value={data.experience || ''} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="fees">Consultation Fee (USD)</Label>
                <Input id="fees" type="number" placeholder="e.g., 200" value={data.fees || ''} onChange={handleInputChange} required />
            </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea id="bio" placeholder="Share a brief summary of your professional background, expertise, and philosophy of care..." value={data.bio} onChange={handleInputChange} rows={5} />
        </div>
        <div className="flex justify-end pt-4">
            <Button onClick={handleNext}>Next</Button>
        </div>
    </div>
  );
};

export default ProfessionalProfile;
