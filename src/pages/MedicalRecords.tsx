import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MedicalRecords = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Medical Records</h1>
      <div className="flex justify-between items-center mb-8">
        <p>View and manage your health records.</p>
        <Button>Upload Document</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No medical records found. Upload your first document to get started.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalRecords;
