
import { Button } from "@/components/ui/button";

const HrReview = ({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) => {
  return (
    <div className="space-y-4">
      <p>Your documents and interview are being reviewed by our HR team. We will notify you once the review is complete.</p>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>Previous</Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
};

export default HrReview;
