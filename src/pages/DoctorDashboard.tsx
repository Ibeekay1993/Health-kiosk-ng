import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Consultation {
  id: string;
  status: string;
  patients: {
    full_name: string;
    date_of_birth: string;
  } | null;
}

const DoctorDashboard = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchConsultations = async () => {
      const { data, error } = await supabase
        .from('consultations')
        .select(`
          id,
          status,
          patients(full_name, date_of_birth)
        `)
        .eq('status', 'escalated');

      if (error) {
        console.error('Error fetching consultations:', error);
      } else if (data) {
        setConsultations(data as Consultation[]);
      }
      setLoading(false);
    };

    fetchConsultations();

    const subscription = supabase
      .channel('public:consultations')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'consultations', filter: 'status=eq.escalated' }, (payload) => {
        const newConsultation = payload.new as Consultation;
        setConsultations((prev) => [...prev, newConsultation]);
        toast({
          title: "New Patient Waiting",
          description: `${newConsultation.patients?.full_name} is waiting for a consultation.`,
        });
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const handleJoinConsultation = (consultationId: string) => {
    navigate(`/consultation?consultation_id=${consultationId}`);
  };

  return (
    <div className="min-h-screen bg-muted/40 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Waiting Patients</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : consultations.length === 0 ? (
              <p>No patients are currently waiting.</p>
            ) : (
              <ul className="space-y-4">
                {consultations.map((consultation) => (
                  <li key={consultation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{consultation.patients?.full_name}</p>
                      <p className="text-sm text-muted-foreground">
                        DOB: {consultation.patients?.date_of_birth ? new Date(consultation.patients.date_of_birth).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <Button onClick={() => handleJoinConsultation(consultation.id)}>Join</Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;
