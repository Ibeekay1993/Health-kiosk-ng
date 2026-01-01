
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Paperclip, File as FileIcon, UploadCloud, X } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  accept?: string[];
  maxSize?: number; // in bytes
  maxFiles?: number;
  label: string;
}

const FileUpload = ({ onFilesChange, accept, maxSize, maxFiles, label }: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    onFilesChange([...files, ...acceptedFiles]);

    // Simulate upload progress
    setUploadProgress(0);
    const timer = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null || prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

  }, [files, onFilesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? { 'application/pdf': ['.pdf'], 'image/*': ['.jpeg', '.png'] } : undefined,
    maxSize,
    maxFiles
  });

  const removeFile = (fileToRemove: File) => {
    const newFiles = files.filter(file => file !== fileToRemove);
    setFiles(newFiles);
    onFilesChange(newFiles);
  }

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <UploadCloud className="h-10 w-10" />
            {isDragActive ? (
            <p>Drop the files here ...</p>
            ) : (
            <p>Drag & drop some files here, or click to select files</p>
            )}
            <p className="text-xs">{accept?.join(', ')} up to {maxSize ? `${maxSize / 1024 / 1024}MB` : 'any size'}</p>
        </div>
      </div>
      
      {files.length > 0 && (
        <div className="space-y-2">
            <h4 className="font-medium">Uploaded Files:</h4>
            {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                    <FileIcon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">{file.name}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFile(file)}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
            ))}
        </div>
      )}

      {uploadProgress !== null && uploadProgress < 100 && (
          <Progress value={uploadProgress} className="h-2" />
      )}
    </div>
  );
};

export default FileUpload;
