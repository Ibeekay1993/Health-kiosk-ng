
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Video, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const AppointmentsTab = ({ doctorId }: { doctorId: string }) => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    if (!doctorId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id, 
          appointment_date, 
          appointment_time, 
          status,
          patient:profiles!appointments_patient_id_fkey(full_name, avatar_url)
        `)
        .eq('doctor_id', doctorId)
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (err: any) {
      toast.error('Failed to fetch appointments', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [doctorId]);

  const appointmentsOnSelectedDate = appointments.filter(a => 
    new Date(a.appointment_date).toDateString() === date?.toDateString()
  );

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <Card>
          <CardContent className="p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="p-3"
              modifiers={{ 
                hasAppointment: appointments.map(a => new Date(a.appointment_date))
              }}
              modifiersClassNames={{
                hasAppointment: 'bg-primary/20 text-primary-foreground rounded-md'
              }}
            />
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Appointments for {date ? date.toLocaleDateString() : 'today'}</CardTitle>
            <CardDescription>You have {appointmentsOnSelectedDate.length} appointments scheduled for this day.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8"><Loader2 className="h-8 w-8 animate-spin"/></div>
            ) : appointmentsOnSelectedDate.length > 0 ? (
              <div className="space-y-4">
                {appointmentsOnSelectedDate.map(apt => (
                  <div key={apt.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                        <User className="h-5 w-5"/>
                        <div>
                            <p className="font-semibold">{apt.patient.full_name}</p>
                            <p className="text-sm text-muted-foreground">{new Date(`1970-01-01T${apt.appointment_time}Z`).toLocaleTimeString([], {timeZone: 'UTC', hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={apt.status === 'scheduled' ? 'default' : 'outline'}>{apt.status}</Badge>
                        <Button size="sm" asChild>
                            <Link to={`/consultation/${apt.id}`}><Video className="w-4 h-4 mr-2"/> Join Call</Link>
                        </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No appointments scheduled for this date.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppointmentsTab;
