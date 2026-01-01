
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

const Consultations = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultations = async () => {
      if (!user) return;

      try {
        setLoading(true);
        // We need to join with profiles to get the doctor's name
        const { data, error } = await supabase
          .from("consultations")
          .select(`
            id,
            created_at,
            diagnosis,
            status,
            doctor:profiles(full_name)
          `)
          .eq("patient_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setConsultations(data);
      } catch (error: any) {
        toast.error("Error fetching consultations", { description: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [user]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Consultations</CardTitle>
          <CardDescription>A record of all your past and upcoming consultations.</CardDescription>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Schedule New Consultation
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
                <TableHead>Date</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consultations.length > 0 ? (
                consultations.map((consultation) => (
                  <TableRow key={consultation.id}>
                    <TableCell>{new Date(consultation.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{consultation.doctor?.full_name || 'N/A'}</TableCell>
                    <TableCell>{consultation.diagnosis || 'Pending'}</TableCell>
                    <TableCell>
                        <Badge variant={consultation.status === 'completed' ? 'success' : 'secondary'}>{consultation.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No consultations found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
      {consultations.length > 5 && (
        <CardFooter className="flex justify-center">
            <Button variant="outline">Load More</Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default Consultations;
