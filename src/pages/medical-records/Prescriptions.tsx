
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import { BarLoader } from "react-spinners";
import { Badge } from "@/components/ui/badge";

const Prescriptions = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("prescriptions")
          .select(`
            id,
            created_at,
            medication,
            status,
            doctor:profiles(full_name)
          `)
          .eq("patient_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setPrescriptions(data);
      } catch (error: any) {
        toast.error("Error fetching prescriptions", { description: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [user]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Prescriptions</CardTitle>
          <CardDescription>A record of your current and past prescriptions.</CardDescription>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Request a Refill
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
                <TableHead>Date Issued</TableHead>
                <TableHead>Medication</TableHead>
                <TableHead>Prescribing Doctor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.length > 0 ? (
                prescriptions.map((prescription) => (
                  <TableRow key={prescription.id}>
                    <TableCell>{new Date(prescription.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{prescription.medication}</TableCell>
                    <TableCell>{prescription.doctor?.full_name || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={prescription.status === 'active' ? 'success' : 'outline'}>
                        {prescription.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No prescriptions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
      {prescriptions.length > 5 && (
        <CardFooter className="flex justify-center">
            <Button variant="outline">Load More</Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default Prescriptions;
