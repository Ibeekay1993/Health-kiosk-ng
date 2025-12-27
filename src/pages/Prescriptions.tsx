import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Clock,
  Pill,
  PlusCircle,
} from "lucide-react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Prescription {
  id: string;
  status: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string | null;
  created_at: string;
  doctor_name?: string;
}

const Prescriptions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { consultation_id, patient_id } = location.state || {};

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserDataAndPrescriptions = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setUserRole(profile.role);
      }

      fetchPrescriptions(session.user.id, profile?.role);
    };
    fetchUserDataAndPrescriptions();
  }, []);

  const fetchPrescriptions = async (userId: string, role: string | undefined) => {
    setLoading(true);
    try {
      let query = supabase.from("prescriptions").select(`
        *,
        doctors:doctor_id (full_name)
      `);

      if (consultation_id) {
        query = query.eq("consultation_id", consultation_id);
      } else if (role === 'patient') {
        const { data: patientData } = await supabase
          .from("patients")
          .select("id")
          .eq("user_id", userId)
          .single();
        if (patientData) {
          query = query.eq("patient_id", patientData.id);
        }
      }

      const { data, error } = await query.order("created_at", { ascending: false });

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
        return <Badge variant="outline">Pending</Badge>;
      case "filled":
        return <Badge variant="default">Filled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Prescriptions</h1>
            <p className="text-muted-foreground">View and manage prescriptions</p>
          </div>
          {userRole === 'doctor' && consultation_id && (
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Write Prescription
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Write a New Prescription</DialogTitle>
                </DialogHeader>
                <WritePrescriptionForm 
                  consultationId={consultation_id}
                  patientId={patient_id}
                  onPrescriptionCreated={() => {
                    setIsModalOpen(false);
                    fetchPrescriptions(patient_id, userRole);
                  }}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <PrescriptionCard
              key={prescription.id}
              prescription={prescription}
              getStatusBadge={getStatusBadge}
            />
          ))}
          {prescriptions.length === 0 && (
             <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No prescriptions found.</p>
                </CardContent>
              </Card>
          )}
        </div>

      </div>
    </div>
  );
};


interface PrescriptionCardProps {
  prescription: Prescription;
  getStatusBadge: (status: string) => React.ReactNode;
}

const PrescriptionCard = ({ prescription, getStatusBadge }: PrescriptionCardProps) => {
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
      <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Pill className="h-4 w-4" />
              Medication
            </h4>
            <div className="space-y-2 text-sm p-2 bg-muted rounded-lg">
              <p><strong>Medication:</strong> {prescription.medication}</p>
              <p><strong>Dosage:</strong> {prescription.dosage}</p>
              <p><strong>Frequency:</strong> {prescription.frequency}</p>
              <p><strong>Duration:</strong> {prescription.duration}</p>
            </div>
          </div>

          {prescription.notes && (
            <div>
              <h4 className="font-medium mb-2">Doctor's Notes</h4>
              <p className="text-sm text-muted-foreground">{prescription.notes}</p>
            </div>
          )}

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
      </CardContent>
    </Card>
  );
};

interface WritePrescriptionFormProps {
    consultationId: string;
    patientId: string;
    onPrescriptionCreated: () => void;
}

const WritePrescriptionForm = ({ consultationId, patientId, onPrescriptionCreated }: WritePrescriptionFormProps) => {
    const { toast } = useToast();
    const [medication, setMedication] = useState('');
    const [dosage, setDosage] = useState('');
    const [frequency, setFrequency] = useState('');
    const [duration, setDuration] = useState('');
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const { data: { session } } = await supabase.auth.getSession();
        if(!session) return;

        try {
            const { error } = await supabase.from('prescriptions').insert({
                consultation_id: consultationId,
                patient_id: patientId,
                doctor_id: session.user.id,
                medication,
                dosage,
                frequency,
                duration,
                notes,
                status: 'pending'
            });

            if (error) throw error;

            toast({ title: "Success", description: "Prescription created successfully." });
            onPrescriptionCreated();

        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: 'destructive' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Medication" value={medication} onChange={e => setMedication(e.target.value)} required />
            <Input placeholder="Dosage (e.g., 500mg)" value={dosage} onChange={e => setDosage(e.target.value)} required />
            <Input placeholder="Frequency (e.g., Twice a day)" value={frequency} onChange={e => setFrequency(e.target.value)} required />
            <Input placeholder="Duration (e.g., 7 days)" value={duration} onChange={e => setDuration(e.target.value)} required />
            <Textarea placeholder="Additional notes..." value={notes} onChange={e => setNotes(e.target.value)} />
            <div className="flex justify-end">
                <Button type="submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Prescription'}
                </Button>
            </div>
        </form>
    );
};

export default Prescriptions;
