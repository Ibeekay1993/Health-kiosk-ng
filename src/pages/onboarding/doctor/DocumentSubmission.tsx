
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/FileUpload";

interface DocumentSubmissionProps {
  data: {
    medicalLicense: File[];
    cv: File[];
  };
  updateData: (data: Partial<DocumentSubmissionProps['data']>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const DocumentSubmission = ({ data, updateData, onNext, onPrev }: DocumentSubmissionProps) => {

  const handleFilesChange = (fileKey: keyof DocumentSubmissionProps['data']) => (files: File[]) => {
    updateData({ [fileKey]: files });
  };

  return (
    <div className="space-y-6">
        <FileUpload 
            label="Medical License" 
            onFilesChange={handleFilesChange('medicalLicense')} 
            accept={[".pdf, .png, .jpg"]}
            maxSize={5 * 1024 * 1024} // 5MB
        />

        <FileUpload 
            label="CV/Resume" 
            onFilesChange={handleFilesChange('cv')} 
            accept={[".pdf, .doc, .docx"]}
            maxSize={5 * 1024 * 1024} // 5MB
        />
        
        <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onPrev}>Previous</Button>
            <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
};

export default DocumentSubmission;
