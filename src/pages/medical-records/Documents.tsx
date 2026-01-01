
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import { UploadCloud, FileText, Download, Trash2, Loader2 } from "lucide-react";
import { BarLoader } from "react-spinners";

const Documents = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from("medical-documents")
        .list(user.id, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      toast.error("Error fetching documents", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const filePath = `${user.id}/${file.name}`;
      const { error } = await supabase.storage
        .from("medical-documents")
        .upload(filePath, file, { upsert: true }); // Using upsert to allow overwriting

      if (error) throw error;

      toast.success("Upload Successful", { description: `Successfully uploaded ${file.name}.` });
      await fetchDocuments(); // Refresh the list
    } catch (error: any) {
      toast.error("Upload Failed", { description: error.message });
    } finally {
      setUploading(false);
      // Reset file input
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDownload = async (fileName: string) => {
    if (!user) return;
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
      toast.error("Download Failed", { description: error.message });
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!user) return;
    try {
      const { error } = await supabase.storage
        .from("medical-documents")
        .remove([`${user.id}/${fileName}`]);

      if (error) throw error;

      setDocuments(documents.filter(doc => doc.name !== fileName));
      toast.success("Delete Successful", { description: `Successfully deleted ${fileName}.` });
    } catch (error: any) {
      toast.error("Delete Failed", { description: error.message });
    }
  };

  return (
    <Card>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>My Documents</CardTitle>
                <CardDescription>Upload and manage your medical documents.</CardDescription>
            </div>
            <Button onClick={handleUploadClick} disabled={uploading}>
                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4"/>}
                {uploading ? "Uploading..." : "Upload Document"}
            </Button>
        </CardHeader>
      <CardContent>
        {loading ? (
            <div className="flex justify-center items-center h-64">
                <BarLoader color="#36d7b7" />
            </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">
                        <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                            {doc.name}
                        </div>
                    </TableCell>
                    <TableCell>{new Date(doc.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleDownload(doc.name)}>
                            <Download className="h-4 w-4"/>
                            <span className="sr-only">Download</span>
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(doc.name)}>
                            <Trash2 className="h-4 w-4"/>
                            <span className="sr-only">Delete</span>
                        </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No documents found. Click "Upload Document" to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
      {documents.length > 10 && (
        <CardFooter className="flex justify-center">
            <Button variant="outline">Load More</Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default Documents;
