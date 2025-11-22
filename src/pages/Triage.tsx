import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Triage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    symptoms: "",
    duration: "",
    severity: ""
  });

  const handleSubmit = () => {
    // Simple AI-like triage logic
    const severity = formData.severity;
    
    toast({
      title: "Assessment Complete",
      description: "Analyzing your symptoms...",
    });

    setTimeout(() => {
      if (severity === "high") {
        toast({
          title: "Urgent Care Recommended",
          description: "We recommend immediate consultation with a doctor.",
          variant: "destructive"
        });
      }
      navigate("/chat", { state: { triageData: formData } });
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Health Assessment</h1>
        <p className="text-muted-foreground">
          Tell us about your symptoms and we'll help you understand what's happening
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Step {step} of 3</CardTitle>
          <CardDescription>
            {step === 1 && "Basic Information"}
            {step === 2 && "Symptom Details"}
            {step === 3 && "Severity Assessment"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Enter your age"
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="symptoms">What symptoms are you experiencing?</Label>
                <Textarea
                  id="symptoms"
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  placeholder="Describe your symptoms in detail..."
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">How long have you had these symptoms?</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 2 days, 1 week"
                />
              </div>
            </>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <Label>How would you rate the severity?</Label>
              <div className="grid gap-3">
                {[
                  { value: "low", label: "Mild", desc: "Minor discomfort", icon: CheckCircle, color: "border-green-500" },
                  { value: "medium", label: "Moderate", desc: "Noticeable discomfort", icon: AlertCircle, color: "border-yellow-500" },
                  { value: "high", label: "Severe", desc: "Significant pain/concern", icon: AlertCircle, color: "border-red-500" }
                ].map((option) => (
                  <Card
                    key={option.value}
                    className={`cursor-pointer transition-all ${
                      formData.severity === option.value
                        ? `${option.color} border-2 bg-muted`
                        : "hover:border-primary"
                    }`}
                    onClick={() => setFormData({ ...formData, severity: option.value })}
                  >
                    <CardContent className="flex items-center gap-3 p-4">
                      <option.icon className="h-5 w-5" />
                      <div className="flex-1">
                        <p className="font-medium">{option.label}</p>
                        <p className="text-sm text-muted-foreground">{option.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)} className="ml-auto gap-2">
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="ml-auto gap-2">
                Complete Assessment <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Triage;
