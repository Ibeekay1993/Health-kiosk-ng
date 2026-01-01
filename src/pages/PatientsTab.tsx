
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

const PatientsTab = ({ doctorId }: { doctorId: string }) => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPatients = async () => {
    if (!doctorId) return;
    setLoading(true);
    try {
      // This is a hypothetical RPC function to get a doctor's patients.
      // You would need to define this based on your database schema, 
      // e.g., patients who have had an appointment with the doctor.
      const { data, error } = await supabase.rpc('get_doctor_patients', { p_doctor_id: doctorId });
      
      if (error) throw error;
      setPatients(data || []);
    } catch (err: any) {
      toast.error('Failed to fetch patients', { description: err.message });
      // If the RPC doesn't exist, we'll just show an empty list
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [doctorId]);

  const filteredPatients = patients.filter(p => 
    p.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Patients</CardTitle>
        <CardDescription>A list of patients you have consulted with.</CardDescription>
        <div className="pt-4">
            <Input 
                placeholder="Search patients..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8"><Loader2 className="h-8 w-8 animate-spin"/></div>
        ) : filteredPatients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="p-4 border rounded-lg bg-muted/25">
                <div className="flex items-center gap-4 mb-4">
                    <User className="h-8 w-8"/>
                    <div>
                        <p className="font-semibold text-lg">{patient.full_name}</p>
                        <p className="text-sm text-muted-foreground">Last visit: {patient.last_visit ? new Date(patient.last_visit).toLocaleDateString() : 'N/A'}</p>
                    </div>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4"/><span>{patient.email}</span></div>
                </div>
                <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                       <Link to={`/patients/${patient.id}`}><User className="w-4 h-4 mr-2"/>View Profile</Link>
                    </Button>
                    <Button variant="secondary" size="sm" asChild>
                       <Link to={`/messages/${patient.id}`}><MessageSquare className="w-4 h-4 mr-2"/>Message</Link>
                    </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">You have no patients yet or your search returned no results.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientsTab;
