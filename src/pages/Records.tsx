import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, Pill } from "lucide-react";

const Records = () => {
  const consultations = [
    {
      id: 1,
      date: "2025-11-18",
      doctor: "Dr. Adebayo Okafor",
      diagnosis: "Viral Infection",
      notes: "Patient presented with fever and body aches. Prescribed rest and fluids."
    },
    {
      id: 2,
      date: "2025-11-10",
      doctor: "Dr. Chioma Nwankwo",
      diagnosis: "Annual Checkup",
      notes: "All vitals normal. Recommended maintaining healthy lifestyle."
    }
  ];

  const prescriptions = [
    {
      id: 1,
      date: "2025-11-18",
      medication: "Paracetamol 500mg",
      dosage: "2 tablets, 3 times daily",
      duration: "5 days",
      status: "active"
    },
    {
      id: 2,
      date: "2025-10-15",
      medication: "Vitamin C 1000mg",
      dosage: "1 tablet daily",
      duration: "30 days",
      status: "completed"
    }
  ];

  const labResults = [
    {
      id: 1,
      date: "2025-11-05",
      test: "Complete Blood Count",
      result: "Normal",
      status: "completed"
    },
    {
      id: 2,
      date: "2025-10-20",
      test: "Lipid Profile",
      result: "Pending",
      status: "pending"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Medical Records</h1>
        <p className="text-muted-foreground">Access your complete health history</p>
      </div>

      <Tabs defaultValue="consultations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
        </TabsList>

        <TabsContent value="consultations" className="space-y-4">
          {consultations.map((consultation) => (
            <Card key={consultation.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{consultation.diagnosis}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      {consultation.date}
                      <span className="mx-2">•</span>
                      {consultation.doctor}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{consultation.notes}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="prescriptions" className="space-y-4">
          {prescriptions.map((prescription) => (
            <Card key={prescription.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Pill className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{prescription.medication}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        {prescription.date}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={prescription.status === "active" ? "default" : "secondary"}>
                    {prescription.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dosage:</span>
                  <span className="font-medium">{prescription.dosage}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{prescription.duration}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="lab-results" className="space-y-4">
          {labResults.map((result) => (
            <Card key={result.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{result.test}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        {result.date}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={result.status === "completed" ? "default" : "secondary"}>
                      {result.status}
                    </Badge>
                    {result.status === "completed" && (
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              {result.status === "completed" && (
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Result:</span>
                    <span className="font-medium text-green-600">{result.result}</span>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Records;
