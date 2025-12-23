import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Appointments = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Appointments</h1>
      <Card>
        <CardHeader>
          <CardTitle>Book an Appointment</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Select a doctor and a time that works for you.</p>
          <Button>View Available Doctors</Button>
        </CardContent>
      </Card>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Appointment History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">You have no past appointments.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Appointments;
