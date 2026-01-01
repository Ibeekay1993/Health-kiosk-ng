
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/use-profile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, PlusCircle } from 'lucide-react';
import BookAppointment from './BookAppointment'; // This will be the new component for the form
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


const Appointments = () => {
  const { profile, loading: profileLoading } = useProfile();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const fetchAppointments = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      let query = supabase.from('appointments').select(`
        id, 
        appointment_date, 
        appointment_time, 
        status,
        doctor:doctors(full_name),
        patient:patients(full_name)
      `);

      if (profile.role === 'patient') {
        query = query.eq('patient_id', profile.id);
      } else if (profile.role === 'doctor') {
        query = query.eq('doctor_id', profile.id);
      }

      const { data, error } = await query.order('appointment_date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (err: any) {
      toast.error('Failed to fetch appointments', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!profileLoading) {
      fetchAppointments();
    }
  }, [profile, profileLoading]);

  const appointmentsOnSelectedDate = appointments.filter(a => 
    new Date(a.appointment_date).toDateString() === date?.toDateString()
  );

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default';
      case 'completed': return 'success';
      case 'canceled': return 'destructive';
      default: return 'outline';
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
                    <p className="text-muted-foreground">View and manage your appointments.</p>
                </div>
                {profile?.role === 'patient' && (
                    <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                        <DialogTrigger asChild>
                             <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Book Appointment
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Book a New Appointment</DialogTitle>
                            </DialogHeader>
                            <BookAppointment setModalOpen={setIsBookingOpen} refreshAppointments={fetchAppointments}/>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

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
                            <CardTitle>Details for {date ? date.toLocaleDateString() : 'today'}</CardTitle>
                            <CardDescription>You have {appointmentsOnSelectedDate.length} appointments on this day.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex justify-center items-center py-8"><Loader2 className="h-8 w-8 animate-spin"/></div>
                            ) : appointmentsOnSelectedDate.length > 0 ? (
                                <div className="space-y-4">
                                    {appointmentsOnSelectedDate.map(apt => (
                                        <div key={apt.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                            <div>
                                                <p className="font-semibold">
                                                    {profile?.role === 'patient' ? `Dr. ${apt.doctor.full_name}` : apt.patient.full_name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">{new Date(`1970-01-01T${apt.appointment_time}Z`).toLocaleTimeString([], {timeZone: 'UTC', hour: '2-digit', minute:'2-digit'})}</p>
                                            </div>
                                            <Badge variant={getStatusBadgeVariant(apt.status)}>{apt.status}</Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-8">No appointments for this date.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Appointments;
