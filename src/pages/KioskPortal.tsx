import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Activity, Video, Calendar, CreditCard, FileText, Clock, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const KioskPortal = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-muted/40 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Kiosk Partner Dashboard</h1>
          <p className="text-muted-foreground text-lg">Assist patients with healthcare access</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-10 w-10 text-primary mx-auto mb-2" />
              <h3 className="text-2xl font-bold">24</h3>
              <p className="text-sm text-muted-foreground">Patients Today</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Video className="h-10 w-10 text-secondary mx-auto mb-2" />
              <h3 className="text-2xl font-bold">12</h3>
              <p className="text-sm text-muted-foreground">Active Consultations</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-10 w-10 text-primary mx-auto mb-2" />
              <h3 className="text-2xl font-bold">8</h3>
              <p className="text-sm text-muted-foreground">Insurance Enrolled</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-10 w-10 text-secondary mx-auto mb-2" />
              <h3 className="text-2xl font-bold">156</h3>
              <p className="text-sm text-muted-foreground">Total Records</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Action Grid - Large Buttons for Tablet */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary">
            <CardContent className="p-8 text-center">
              <UserPlus className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Quick Registration</h3>
              <p className="text-muted-foreground mb-4">Register new patient</p>
              <Button size="lg" className="w-full" onClick={() => navigate("/register")}>Register Patient</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary">
            <CardContent className="p-8 text-center">
              <Activity className="h-16 w-16 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Record Vitals</h3>
              <p className="text-muted-foreground mb-4">BP, Temp, SpO₂</p>
              <Button size="lg" className="w-full" variant="secondary" onClick={() => navigate("/vitals")}>Record Vitals</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary">
            <CardContent className="p-8 text-center">
              <Video className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Start Consultation</h3>
              <p className="text-muted-foreground mb-4">Connect to doctor</p>
              <Button size="lg" className="w-full" onClick={() => navigate("/triage")}>Start Now</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary">
            <CardContent className="p-8 text-center">
              <Calendar className="h-16 w-16 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Book Doctor</h3>
              <p className="text-muted-foreground mb-4">Schedule appointment</p>
              <Button size="lg" className="w-full" variant="secondary" onClick={() => navigate("/appointments")}>Book Appointment</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary">
            <CardContent className="p-8 text-center">
              <CreditCard className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Insurance Payments</h3>
              <p className="text-muted-foreground mb-4">Micro-contributions</p>
              <Button size="lg" className="w-full" onClick={() => navigate("/insurance")}>Manage Insurance</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary">
            <CardContent className="p-8 text-center">
              <FileText className="h-16 w-16 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Patient History</h3>
              <p className="text-muted-foreground mb-4">View medical records</p>
              <Button size="lg" className="w-full" variant="secondary" onClick={() => navigate("/records")}>View Records</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default KioskPortal;
