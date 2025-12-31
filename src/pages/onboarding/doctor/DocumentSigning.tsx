
import { Button } from "@/components/ui/button";

const DocumentSigning = ({ onPrev, onSubmit }: { onPrev: () => void, onSubmit: () => Promise<void> }) => {
  return (
    <div className="space-y-4">
      <p>Please fill out the MOA, Eligibility, and Guarantor forms.</p>
      <Button variant="outline" onClick={onPrev}>Previous</Button>
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
};

export default DocumentSigning;
