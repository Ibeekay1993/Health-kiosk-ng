
import { useMedicalRecords } from "@/hooks/use-medical-records";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ChevronRight, Loader2 } from "lucide-react";

const PatientProfileTab = () => {
  const { records, loading: recordsLoading } = useMedicalRecords();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Records</CardTitle>
        <CardDescription>View and manage your medical records.</CardDescription>
      </CardHeader>
      <CardContent>
        {recordsLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : records.length > 0 ? (
          <div className="space-y-2">
            {records.map((record) => (
              <Button key={record.id} variant="ghost" className="w-full justify-between h-auto py-3">
                <div className="flex items-center text-left">
                  <FileText className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                  <span className="flex-grow">{record.title}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-center text-muted-foreground py-8">No medical records found.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientProfileTab;
