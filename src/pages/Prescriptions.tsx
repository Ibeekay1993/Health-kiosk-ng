import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Clock, Pill, Store, Truck, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Prescription {
  id: string;
  status: string;
  medication_list: any;
  notes: string | null;
  created_at: string;
  doctor_name?: string;
}

const Prescriptions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      // Get patient record
      const { data: patientData } = await supabase
        .from("patients")
        .select("id")
        .eq("user_id", session.user.id)
        .single();

      if (!patientData) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("prescriptions")
        .select(`
          *,
          doctors (full_name)
        `)
        .eq("patient_id", patientData.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedPrescriptions = (data || []).map((p: any) => ({
        ...p,
        doctor_name: p.doctors?.full_name || "Unknown Doctor",
      }));

      setPrescriptions(formattedPrescriptions);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      toast({
        title: "Error",
        description: "Failed to load prescriptions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Pending</Badge>;
      case "ready":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Ready</Badge>;
      case "delivered":
        return <Badge variant="default" className="bg-green-500">Delivered</Badge>;
      case "picked_up":
        return <Badge variant="default" className="bg-green-500">Picked Up</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleSelectVendor = (prescriptionId: string) => {
    navigate("/vendor-selection", { state: { prescriptionId } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Prescriptions</h1>
          <p className="text-muted-foreground">View and manage your prescriptions</p>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {prescriptions
              .filter((p) => ["pending", "ready"].includes(p.status || ""))
              .map((prescription) => (
                <PrescriptionCard
                  key={prescription.id}
                  prescription={prescription}
                  getStatusBadge={getStatusBadge}
                  onSelectVendor={handleSelectVendor}
                />
              ))}
            {prescriptions.filter((p) => ["pending", "ready"].includes(p.status || "")).length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No active prescriptions</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {prescriptions
              .filter((p) => ["delivered", "picked_up"].includes(p.status || ""))
              .map((prescription) => (
                <PrescriptionCard
                  key={prescription.id}
                  prescription={prescription}
                  getStatusBadge={getStatusBadge}
                  onSelectVendor={handleSelectVendor}
                />
              ))}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {prescriptions.map((prescription) => (
              <PrescriptionCard
                key={prescription.id}
                prescription={prescription}
                getStatusBadge={getStatusBadge}
                onSelectVendor={handleSelectVendor}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface PrescriptionCardProps {
  prescription: Prescription;
  getStatusBadge: (status: string) => React.ReactNode;
  onSelectVendor: (id: string) => void;
}

const PrescriptionCard = ({ prescription, getStatusBadge, onSelectVendor }: PrescriptionCardProps) => {
  const medications = prescription.medication_list as any[] || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Prescription #{prescription.id.slice(0, 8)}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Prescribed by Dr. {prescription.doctor_name}
            </p>
          </div>
          {getStatusBadge(prescription.status || "pending")}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Medications */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Pill className="h-4 w-4" />
              Medications
            </h4>
            <div className="space-y-2">
              {medications.length > 0 ? (
                medications.map((med: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-muted rounded-lg">
                    <span>{med.name || "Medication"}</span>
                    <span className="text-sm text-muted-foreground">{med.dosage || ""}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No medications listed</p>
              )}
            </div>
          </div>

          {/* Notes */}
          {prescription.notes && (
            <div>
              <h4 className="font-medium mb-2">Doctor's Notes</h4>
              <p className="text-sm text-muted-foreground">{prescription.notes}</p>
            </div>
          )}

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {new Date(prescription.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Actions */}
          {prescription.status === "pending" && (
            <Button className="w-full" onClick={() => onSelectVendor(prescription.id)}>
              <Store className="h-4 w-4 mr-2" />
              Choose Pharmacy
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Prescriptions;
