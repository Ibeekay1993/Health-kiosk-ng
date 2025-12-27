import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, FileText, Download, Trash2 } from "lucide-react";

const Documents = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserAndDocuments = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("User not authenticated");
        setUser(session.user);

        const { data, error } = await supabase.storage
          .from("medical-documents")
          .list(session.user.id, { limit: 100 });

        if (error) throw error;
        setDocuments(data || []);
      } catch (error: any) {
        toast({ title: "Error fetching documents", description: error.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndDocuments();
  }, [toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const filePath = `${user.id}/${file.name}`;
      const { error } = await supabase.storage
        .from("medical-documents")
        .upload(filePath, file);

      if (error) throw error;

      // Refresh the list of documents
      const { data, error: listError } = await supabase.storage
        .from("medical-documents")
        .list(user.id, { limit: 100 });
      
      if (listError) throw listError;

      setDocuments(data || []);
      toast({ title: "Upload Successful", description: `Successfully uploaded ${file.name}.` });
      setFile(null); // Clear the file input
    } catch (error: any) {
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("medical-documents")
        .download(`${user.id}/${fileName}`);

      if (error) throw error;
      
      const blob = new Blob([data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error: any) {
      toast({ title: "Download Failed", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (fileName: string) => {
    try {
      const { error } = await supabase.storage
        .from("medical-documents")
        .remove([`${user.id}/${fileName}`]);

      if (error) throw error;

      setDocuments(documents.filter(doc => doc.name !== fileName));
      toast({ title: "Delete Successful", description: `Successfully deleted ${fileName}.` });
    } catch (error: any) {
      toast({ title: "Delete Failed", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Documents</CardTitle>
        <CardDescription>Upload and manage your medical documents.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold">Upload New Document</h3>
            <div className="space-y-2">
                <Input id="document-upload" type="file" onChange={handleFileChange} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"/>
            </div>
            <Button onClick={handleUpload} disabled={!file || uploading}>
              {uploading ? "Uploading..." : <><UploadCloud className="mr-2 h-4 w-4"/> Upload Document</>}
            </Button>
          </div>
          <div className="space-y-4 p-4 border rounded-lg">
             <h3 className="text-lg font-semibold">Uploaded Documents</h3>
            {loading ? (
              <p>Loading documents...</p>
            ) : documents.length > 0 ? (
              <ul className="space-y-2">
                {documents.map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between p-2 rounded-md bg-muted">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                      <span className="font-medium">{doc.name}</span>
                    </div>
                    <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleDownload(doc.name)}><Download className="h-4 w-4"/></Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(doc.name)}><Trash2 className="h-4 w-4"/></Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-muted-foreground py-4">No documents found.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Documents;
