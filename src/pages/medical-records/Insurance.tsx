import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Insurance = () => {
  const [insurance, setInsurance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const [patientId, setPatientId] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsuranceDetails = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: patientData, error: patientError } = await supabase
            .from("patients")
            .select("id")
            .eq("user_id", session.user.id)
            .single();

          if (patientError) throw patientError;

          if (patientData) {
            setPatientId(patientData.id);
            const { data: insuranceData, error: insuranceError } = await supabase
              .from("insurance")
              .select("*")
              .eq("patient_id", patientData.id)
              .single();
            
            if (insuranceError && insuranceError.code !== 'PGRST116') {
              throw insuranceError;
            }
            setInsurance(insuranceData);
          }
        }
      } catch (error: any) {
        toast({ title: "Error fetching insurance details", description: error.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchInsuranceDetails();
  }, [toast]);

  const handleUpdateInsurance = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const upsertData = { ...insurance, patient_id: patientId };
      const { data, error } = await supabase.from("insurance").upsert(upsertData).select();
      
      if (error) throw error;
      
      setInsurance(data[0]);
      toast({ title: "Insurance Details Updated", description: "Your information has been successfully updated." });
      setIsEditing(false);
    } catch (error: any) {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setInsurance({ ...insurance, [id]: value });
  };
  
  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Insurance Details</CardTitle>
          <CardDescription>Manage your insurance information.</CardDescription>
        </div>
        <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : (insurance ? "Edit Details" : "Add Insurance")}
        </Button>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleUpdateInsurance} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Insurance Provider</Label>
                <Input id="provider" value={insurance?.provider || ''} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="policy_number">Policy Number</Label>
                <Input id="policy_number" value={insurance?.policy_number || ''} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="group_number">Group Number</Label>
                <Input id="group_number" value={insurance?.group_number || ''} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="policy_holder_name">Policy Holder's Name</Label>
                <Input id="policy_holder_name" value={insurance?.policy_holder_name || ''} onChange={handleInputChange} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Details"}</Button>
            </div>
          </form>
        ) : (
          insurance ? (
            <div className="space-y-4 text-sm">
              <p><strong>Provider:</strong> {insurance.provider}</p>
              <p><strong>Policy Number:</strong> {insurance.policy_number}</p>
              <p><strong>Group Number:</strong> {insurance.group_number || "N/A"}</p>
              <p><strong>Policy Holder's Name:</strong> {insurance.policy_holder_name}</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No insurance details found.</p>
              <p className="text-sm text-muted-foreground">Click "Add Insurance" to get started.</p>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default Insurance;
