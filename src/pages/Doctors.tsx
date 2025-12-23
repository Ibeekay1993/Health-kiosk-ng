import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Doctors = () => {
  const doctors = [
    { name: "Dr. Adeola Williams", specialization: "General Practitioner" },
    { name: "Dr. Chinedu Okoro", specialization: "Pediatrician" },
    { name: "Dr. Fatima Bello", specialization: "Cardiologist" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Doctors</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.map((doctor, index) => (
          <Card key={index}>
            <CardHeader className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={`/placeholder-doctor-${index}.jpg`} />
                <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{doctor.name}</CardTitle>
                <p className="text-muted-foreground">{doctor.specialization}</p>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Book Appointment</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Doctors;
