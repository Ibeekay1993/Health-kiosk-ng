import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";
// Assuming you will create a dialog for adding new history
// import AddHistoryDialog from "./AddHistoryDialog";

const MedicalHistory = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  // const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: historyData, error: historyError } = await supabase
            .from("medical_histories") // Corrected table name
            .select("*")
            .eq("patient_id", session.user.id)
            .order("diagnosis_date", { ascending: false });

          if (historyError) throw historyError;
          setHistory(historyData);
        }
      } catch (error: any) {
        toast({ title: "Error fetching medical history", description: error.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalHistory();
  }, [toast]);

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Medical History</CardTitle>
          <CardDescription>A record of your past and present health conditions.</CardDescription>
        </div>
        <Button /*onClick={() => setIsAddDialogOpen(true)}*/>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Record
        </Button>
      </CardHeader>
      <CardContent>
        {history.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {history.map((record) => (
              <Card key={record.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{record.condition}</CardTitle>
                  <CardDescription>Diagnosed on: {new Date(record.diagnosis_date).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  {record.treatment && <p><strong>Treatment:</strong> {record.treatment}</p>}
                  {record.notes && <p className="text-sm text-muted-foreground mt-2"><strong>Notes:</strong> {record.notes}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No medical history found.</p>
            <p className="text-sm text-muted-foreground">Click "Add Record" to start building your history.</p>
          </div>
        )}
      </CardContent>
      {/* <AddHistoryDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={() => {
          // Refetch logic here
          setIsAddDialogOpen(false);
        }}
      /> */}
    </Card>
  );
};

export default MedicalHistory;
