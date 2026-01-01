
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";
import { Loader2 } from "lucide-react";

const BookAppointment = ({ setModalOpen, refreshAppointments }: { setModalOpen: (isOpen: boolean) => void, refreshAppointments: () => void }) => {
  const { profile } = useProfile();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data, error } = await supabase
          .from('doctors')
          .select('id, full_name, specialization');
        if (error) throw error;
        setDoctors(data || []);
      } catch (error: any) {
        toast.error("Error fetching doctors", { description: error.message });
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) {
        toast.error("You must be logged in to book an appointment.");
        return;
    }
    setLoading(true);

    try {
      const { error } = await supabase.from("appointments").insert({
        doctor_id: selectedDoctor,
        patient_id: profile.id,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        reason: reason,
        status: "scheduled",
      });

      if (error) throw error;

      toast.success("Appointment Booked!", { description: "Your appointment has been successfully scheduled." });
      refreshAppointments();
      setModalOpen(false);
    } catch (error: any) {
      toast.error("Booking Failed", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleBooking} className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label htmlFor="doctor-select">Doctor</Label>
        <Select value={selectedDoctor} onValueChange={setSelectedDoctor} disabled={loadingDoctors} required>
          <SelectTrigger id="doctor-select">
            <SelectValue placeholder={loadingDoctors ? "Loading doctors..." : "Choose a doctor"} />
          </SelectTrigger>
          <SelectContent>
            {doctors.map((doctor) => (
              <SelectItem key={doctor.id} value={doctor.id}>
                {doctor.full_name} {doctor.specialization && `(${doctor.specialization})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
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

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={loading || loadingDoctors}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Booking..." : "Confirm Appointment"}
        </Button>
      </div>
    </form>
  );
};

export default BookAppointment;
