
import { Button } from "@/components/ui/button";

const InterviewPreparation = ({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) => {
  return (
    <div className="space-y-4">
      <p>Prepare for your interview and record a short video introducing yourself.</p>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>Previous</Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
};

export default InterviewPreparation;
