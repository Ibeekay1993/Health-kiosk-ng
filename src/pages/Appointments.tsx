import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Appointments = () => {
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // @ts-ignore
        const { data: doctorsData, error: doctorsError } = await supabase.rpc('get_doctors');
        if (doctorsError) throw doctorsError;
        if (Array.isArray(doctorsData)) {
          setDoctors(doctorsData);
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from("appointments")
          .select(`
            *,
            doctor:doctors(full_name)
          `)
          .eq("patient_id", user.id)
          .order("appointment_date", { ascending: false });

        if (appointmentsError) throw appointmentsError;
        setAppointments(appointmentsData || []);
      } catch (error: any) {
        toast({ title: "Error fetching data", description: error.message, variant: "destructive" });
      } finally {
        setLoadingAppointments(false);
      }
    };
    fetchInitialData();
  }, [toast]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        toast({ title: "You must be logged in to book an appointment.", variant: "destructive" });
        setLoading(false);
        return;
    }

    try {
      const { data: newAppointment, error } = await supabase.from("appointments").insert({
        doctor_id: selectedDoctor,
        patient_id: user.id,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        reason: reason,
        status: "scheduled",
      }).select(`
        *,
        doctor:doctors(full_name)
      `).single();

      if (error) throw error;

      toast({ title: "Appointment Booked!", description: "Your appointment has been successfully scheduled." });
      setAppointments([newAppointment, ...appointments]);
      // Reset form
      setSelectedDoctor("");
      setAppointmentDate("");
      setAppointmentTime("");
      setReason("");
    } catch (error: any) {
      toast({ title: "Booking Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="appointments-page" className="p-8">
      <h1 id="appointments-title" className="text-3xl font-bold mb-8">Appointments</h1>
      
      {/* Booking Form */}
      <Card id="schedule-appointment-card" className="mb-8">
        <CardHeader>
          <CardTitle>Schedule an Appointment</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="appointment-booking-form" onSubmit={handleBooking} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="doctor-select">Select Doctor</Label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger id="doctor-select">
                  <SelectValue placeholder="Choose a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id} id={`doctor-option-${doctor.id}`}>
                      {doctor.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="appointment-date">Date</Label>
                <Input id="appointment-date" type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="appointment-time">Time</Label>
                <Input id="appointment-time" type="time" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointment-reason">Reason for Visit</Label>
              <Textarea id="appointment-reason" placeholder="Briefly describe the reason for your appointment" value={reason} onChange={(e) => setReason(e.target.value)} required />
            </div>

            <Button id="book-appointment-button" type="submit" className="w-full" disabled={loading}>
              {loading ? "Booking..." : "Book Appointment"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Appointment History */}
      <Card id="appointment-history-card">
        <CardHeader>
          <CardTitle>Your Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingAppointments ? (
            <p id="loading-appointments-message">Loading appointments...</p>
          ) : appointments.length > 0 ? (
            <ul id="appointment-list" className="space-y-4">
              {appointments.map((apt) => (
                <li key={apt.id} id={`appointment-item-${apt.id}`} className="p-4 border rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Dr. {apt.doctor.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(apt.appointment_date).toLocaleDateString()} at {apt.appointment_time}
                    </p>
                    <p className="text-sm mt-1">Reason: {apt.reason}</p>
                  </div>
                  <span id={`appointment-status-${apt.id}`} className={`px-2 py-1 text-xs font-semibold rounded-full ${apt.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {apt.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p id="no-appointments-message" className="text-muted-foreground">You have no past or upcoming appointments.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Appointments;
