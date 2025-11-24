import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Activity, Heart, Thermometer } from "lucide-react";

const Vitals = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [vitals, setVitals] = useState({
    patientId: "",
    bloodPressure: "",
    temperature: "",
    spo2: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to record vitals");
      }

      const { error } = await supabase.from("vitals").insert({
        patient_id: vitals.patientId,
        blood_pressure: vitals.bloodPressure,
        temperature: parseFloat(vitals.temperature),
        spo2: parseInt(vitals.spo2),
        recorded_by: user.id,
      });

      if (error) throw error;

      toast({
        title: "Vitals Recorded",
        description: "Patient vitals have been successfully recorded.",
      });

      setVitals({
        patientId: "",
        bloodPressure: "",
        temperature: "",
        spo2: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Record Patient Vitals</h1>
          <p className="text-muted-foreground">Measure and record vital signs</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vital Signs</CardTitle>
            <CardDescription>Enter patient vitals information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  placeholder="Enter patient ID or select patient"
                  required
                  value={vitals.patientId}
                  onChange={(e) => setVitals({ ...vitals, patientId: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodPressure" className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  Blood Pressure (mmHg)
                </Label>
                <Input
                  id="bloodPressure"
                  placeholder="e.g., 120/80"
                  required
                  value={vitals.bloodPressure}
                  onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Format: Systolic/Diastolic</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature" className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-primary" />
                  Temperature (°C)
                </Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 37.5"
                  required
                  value={vitals.temperature}
                  onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="spo2" className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  SpO₂ (%)
                </Label>
                <Input
                  id="spo2"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g., 98"
                  required
                  value={vitals.spo2}
                  onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Normal range: 95-100%</p>
              </div>

              <Button type="submit" className="w-full" disabled={loading} size="lg">
                {loading ? "Recording..." : "Record Vitals"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Reference</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Normal Blood Pressure:</span>
              <span className="font-medium">90/60 - 120/80 mmHg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Normal Temperature:</span>
              <span className="font-medium">36.1 - 37.2 °C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Normal SpO₂:</span>
              <span className="font-medium">95 - 100%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Vitals;
