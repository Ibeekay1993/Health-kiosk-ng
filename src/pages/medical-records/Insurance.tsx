
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import { PlusCircle, Edit, Loader2 } from "lucide-react";
import { BarLoader } from "react-spinners";

const Insurance = () => {
  const { user } = useAuth();
  const [insurance, setInsurance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchInsuranceDetails = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("insurance")
        .select("*")
        .eq("patient_id", user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // Ignore not found error
      setInsurance(data);
    } catch (error: any) {
      toast.error("Error fetching insurance details", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsuranceDetails();
  }, [user]);

  const handleUpdateInsurance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const upsertData = { id: insurance?.id, patient_id: user.id, ...insurance };
      const { data, error } = await supabase.from("insurance").upsert(upsertData).select().single();
      
      if (error) throw error;
      
      setInsurance(data);
      toast.success("Insurance Details Updated", { description: "Your information has been successfully saved." });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error("Update Failed", { description: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setInsurance({ ...insurance, [id]: value });
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Insurance Details</CardTitle>
          <CardDescription>View and manage your insurance information.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              {insurance ? <><Edit className="mr-2 h-4 w-4"/> Edit Details</> : <><PlusCircle className="mr-2 h-4 w-4"/> Add Insurance</>}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{insurance ? "Edit Insurance Details" : "Add Insurance"}</DialogTitle>
              <DialogDescription>Fill in your insurance details below. Click save when you're done.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateInsurance} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Insurance Provider</Label>
                <Input id="provider" value={insurance?.provider || ''} onChange={handleInputChange} placeholder="e.g., Blue Cross Blue Shield" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="policy_number">Policy Number</Label>
                <Input id="policy_number" value={insurance?.policy_number || ''} onChange={handleInputChange} placeholder="e.g., X123456789" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="group_number">Group Number</Label>
                <Input id="group_number" value={insurance?.group_number || ''} onChange={handleInputChange} placeholder="e.g., G98765"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="policy_holder_name">Policy Holder's Name</Label>
                <Input id="policy_holder_name" value={insurance?.policy_holder_name || user?.user_metadata?.full_name || ''} onChange={handleInputChange} />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isSaving ? "Saving..." : "Save Details"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <BarLoader color="#36d7b7" />
          </div>
        ) : insurance ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div><strong>Provider:</strong><p className="text-muted-foreground">{insurance.provider}</p></div>
            <div><strong>Policy Number:</strong><p className="text-muted-foreground">{insurance.policy_number}</p></div>
            <div><strong>Group Number:</strong><p className="text-muted-foreground">{insurance.group_number || "N/A"}</p></div>
            <div><strong>Policy Holder:</strong><p className="text-muted-foreground">{insurance.policy_holder_name}</p></div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No insurance details found.</p>
            <p className="text-sm text-muted-foreground">Click "Add Insurance" to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Insurance;
