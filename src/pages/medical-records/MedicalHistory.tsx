
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import { BarLoader } from "react-spinners";

const MedicalHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data: historyData, error: historyError } = await supabase
          .from("medical_histories")
          .select("*")
          .eq("patient_id", user.id)
          .order("diagnosis_date", { ascending: false });

        if (historyError) throw historyError;
        setHistory(historyData);
      } catch (error: any) {
        toast.error("Error fetching medical history", { description: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalHistory();
  }, [user]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Medical History</CardTitle>
          <CardDescription>A record of your past and present health conditions.</CardDescription>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Record
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
                <TableHead>Condition</TableHead>
                <TableHead>Diagnosis Date</TableHead>
                <TableHead>Treatment</TableHead>
                <TableHead className="hidden md:table-cell">Notes</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length > 0 ? (
                history.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.condition}</TableCell>
                    <TableCell>{new Date(record.diagnosis_date).toLocaleDateString()}</TableCell>
                    <TableCell>{record.treatment || 'N/A'}</TableCell>
                    <TableCell className="hidden md:table-cell truncate max-w-xs">{record.notes || 'N/A'}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Details</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No medical history found. Click "Add Record" to start.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
      {history.length > 0 && (
        <CardFooter className="flex justify-center">
            <Button variant="outline">Load More</Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default MedicalHistory;
