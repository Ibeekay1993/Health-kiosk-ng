
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CompanyProfileProps {
  data: {
    companyName: string;
    companyWebsite: string;
    companyDescription: string;
  };
  updateData: (data: Partial<CompanyProfileProps['data']>) => void;
  onNext: () => void;
}

const CompanyProfile = ({ data, updateData, onNext }: CompanyProfileProps) => {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    updateData({ [id]: value });
  };

  return (
    <div className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input id="companyName" placeholder="e.g., Acme Inc." value={data.companyName} onChange={handleInputChange} required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="companyWebsite">Company Website</Label>
            <Input id="companyWebsite" placeholder="e.g., https://acme.com" value={data.companyWebsite} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="companyDescription">Company Description</Label>
            <Textarea id="companyDescription" placeholder="Briefly describe your company..." value={data.companyDescription} onChange={handleInputChange} rows={5} />
        </div>
        <div className="flex justify-end pt-4">
            <Button onClick={onNext}>Next</Button>
        </div>
    </div>
  );
};

export default CompanyProfile;
