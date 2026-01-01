
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ClipboardList, Users } from "lucide-react";
import AppointmentsTab from "./AppointmentsTab"; // New component
import TriageTab from "./TriageTab"; // New component
import PatientsTab from "./PatientsTab"; // New component
import useAuth from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const DoctorDashboard = () => {
  const { profile, loading: authLoading } = useAuth();

  if (authLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, Dr. {profile?.full_name || 'Doctor'}!</h1>
          <p className="text-muted-foreground">Here’s your dashboard for today.</p>
        </div>

        <Tabs defaultValue="appointments">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appointments">
              <Calendar className="mr-2 h-4 w-4" /> Appointments
            </TabsTrigger>
            <TabsTrigger value="triage">
              <ClipboardList className="mr-2 h-4 w-4" /> Triage Queue
            </TabsTrigger>
            <TabsTrigger value="patients">
              <Users className="mr-2 h-4 w-4" /> Patients
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="mt-6">
            <AppointmentsTab doctorId={profile?.id} />
          </TabsContent>

          <TabsContent value="triage" className="mt-6">
            <TriageTab doctorId={profile?.id} />
          </TabsContent>

          <TabsContent value="patients" className="mt-6">
            <PatientsTab doctorId={profile?.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorDashboard;
