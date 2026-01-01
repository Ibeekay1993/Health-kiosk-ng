
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

const LabResults = () => {
  const { user } = useAuth();
  const [labResults, setLabResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLabResults = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("lab_results")
          .select("*")
          .eq("patient_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setLabResults(data);
      } catch (error: any) {
        toast.error("Error fetching lab results", { description: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchLabResults();
  }, [user]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Lab Results</CardTitle>
          <CardDescription>A record of your past and present lab results.</CardDescription>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Upload New Result
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
                <TableHead>Test Name</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {labResults.length > 0 ? (
                labResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>{new Date(result.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{result.test_name}</TableCell>
                    <TableCell>{result.result}</TableCell>
                    <TableCell>
                      <Badge variant={result.status === 'normal' ? 'success' : 'destructive'}>
                        {result.status}
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
                    No lab results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
      {labResults.length > 5 && (
        <CardFooter className="flex justify-center">
            <Button variant="outline">Load More</Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default LabResults;
