
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface InterviewPreparationProps {
  data: {
    videoIntroUrl: string;
  };
  updateData: (data: Partial<{ videoIntroUrl: string }>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const InterviewPreparation = ({ data, updateData, onNext, onPrev }: InterviewPreparationProps) => {
  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Prepare for Your Video Interview</AlertTitle>
        <AlertDescription>
          <p className="mb-2">
            Please record a short video (2-3 minutes) introducing yourself. This is a crucial part of our evaluation process.
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>State your name, specialty, and years of experience.</li>
            <li>Briefly describe your approach to patient care.</li>
            <li>Explain why you're interested in joining our platform.</li>
            <li>Ensure good lighting, clear audio, and a professional background.</li>
            <li>Upload your video to a private service like YouTube (unlisted) or Vimeo and paste the link below.</li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="video-intro-url">Video Introduction URL</Label>
        <Input 
          id="video-intro-url" 
          type="url" 
          placeholder="https://youtu.be/your-video-id" 
          value={data.videoIntroUrl || ''}
          onChange={(e) => updateData({ videoIntroUrl: e.target.value })}
        />
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrev}>Previous</Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
};

export default InterviewPreparation;
