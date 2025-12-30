
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const requiredDocuments = [
  { id: "medical_license", name: "Medical License" },
  { id: "id_proof", name: "ID Proof (Passport, Driver's License)" },
  { id: "malpractice_insurance", name: "Malpractice Insurance" },
];

const DocumentSubmission = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [files, setFiles] = useState<Record<string, File>>({});

  const handleFileChange = (docId: string, file: File) => {
    setFiles(prev => ({ ...prev, [docId]: file }));
  };

  const handleUpload = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const allFilesUploaded = requiredDocuments.every(doc => files[doc.id]);
    if (!allFilesUploaded) {
      toast({ title: "Missing Documents", description: "Please upload all required documents.", variant: "destructive" });
      return;
    }

    try {
      for (const doc of requiredDocuments) {
        const file = files[doc.id];
        const filePath = `${user.id}/${doc.id}_${file.name}`;
        const { error: uploadError } = await supabase.storage.from('doctor_documents').upload(filePath, file);
        if (uploadError) throw uploadError;
      }

      await supabase.from('doctors').update({ status: 'pending_referees' }).eq('user_id', user.id);

      toast({ title: "Success", description: "Documents uploaded successfully." });
      navigate('/doctor-onboarding/referees');
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Submission</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {requiredDocuments.map(doc => (
          <div key={doc.id} className="flex items-center justify-between p-4 border rounded-md">
            <div>
              <p className="font-semibold">{doc.name}</p>
              <p className="text-sm text-muted-foreground">
                {files[doc.id] ? files[doc.id].name : "No file selected"}
              </p>
            </div>
            <Button asChild variant="outline">
              <label>
                <Upload className="mr-2 h-4 w-4" /> Upload
                <input type="file" className="hidden" onChange={(e) => e.target.files && handleFileChange(doc.id, e.target.files[0])} />
              </label>
            </Button>
          </div>
        ))}
        <Button onClick={handleUpload}>Submit Documents</Button>
      </CardContent>
    </Card>
  );
};

export default DocumentSubmission;
