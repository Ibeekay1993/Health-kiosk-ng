
import { Button } from "@/components/ui/button";

const DocumentSigning = ({ onPrev }: { onPrev: () => void }) => {
  return (
    <div className="space-y-4">
      <p>Please fill out the MOA, Eligibility, and Guarantor forms.</p>
      <Button variant="outline" onClick={onPrev}>Previous</Button>
      <Button>Submit</Button>
    </div>
  );
};

export default DocumentSigning;
