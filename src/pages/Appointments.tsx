import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

const Appointments = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");

  const doctors = [
    { id: "1", name: "Dr. Adebayo Okafor", specialty: "General Practice" },
    { id: "2", name: "Dr. Chioma Nwankwo", specialty: "Pediatrics" },
    { id: "3", name: "Dr. Ibrahim Musa", specialty: "Cardiology" },
    { id: "4", name: "Dr. Ngozi Eze", specialty: "Dermatology" }
  ];

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ];

  const upcomingAppointments = [
    {
      id: "1",
      doctor: "Dr. Adebayo Okafor",
      date: "Today",
      time: "03:00 PM",
      type: "Follow-up"
    }
  ];

  const handleBookAppointment = () => {
    if (!date || !selectedTime || !selectedDoctor) {
      toast({
        title: "Missing Information",
        description: "Please select a doctor, date, and time.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Appointment Booked!",
      description: "You'll receive a confirmation email shortly.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Book Appointment</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Doctor</CardTitle>
              <CardDescription>Choose a specialist for your consultation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctors.map((doctor) => (
                  <Card
                    key={doctor.id}
                    className={`cursor-pointer transition-all ${
                      selectedDoctor === doctor.id
                        ? "border-primary border-2 bg-muted"
                        : "hover:border-primary"
                    }`}
                    onClick={() => setSelectedDoctor(doctor.id)}
                  >
                    <CardContent className="p-4">
                      <p className="font-medium">{doctor.name}</p>
                      <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Select Date & Time
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Date</Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  disabled={(date) => date < new Date()}
                />
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4" />
                  Available Time Slots
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => setSelectedTime(time)}
                      className="w-full"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <Button onClick={handleBookAppointment} className="w-full" size="lg">
                Book Appointment
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingAppointments.map((apt) => (
                <Card key={apt.id}>
                  <CardContent className="p-4">
                    <p className="font-medium">{apt.doctor}</p>
                    <p className="text-sm text-muted-foreground">{apt.type}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{apt.date}</span>
                      <Clock className="h-4 w-4 ml-2" />
                      <span>{apt.time}</span>
                    </div>
                    <Button variant="outline" className="w-full mt-3" size="sm">
                      Join Video Call
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
