
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const DoctorProfileTab = ({ profile, refreshProfile }: { profile: any, refreshProfile: () => void }) => {
  const { toast } = useToast();
  const [specialization, setSpecialization] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState<number | string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile && profile.doctor_details) {
      setSpecialization(profile.doctor_details.specialization || "");
      setLicenseNumber(profile.doctor_details.license_number || "");
      setYearsOfExperience(profile.doctor_details.years_of_experience || "");
    }
  }, [profile]);

  const handleUpdateDoctorProfile = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('doctors').update({
        specialization,
        license_number: licenseNumber,
        years_of_experience: yearsOfExperience,
      }).eq('user_id', profile.id);

      if (error) throw error;

      toast({ description: "Professional profile updated successfully." });
      refreshProfile(); // This will re-fetch the profile with the nested doctor_details
    } catch (error: any) {
      toast({ variant: "destructive", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Profile</CardTitle>
        <CardDescription>Update your medical professional details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="specialization">Specialization</Label>
          <Input id="specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="licenseNumber">License Number</Label>
          <Input id="licenseNumber" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="yearsOfExperience">Years of Experience</Label>
          <Input id="yearsOfExperience" type="number" value={yearsOfExperience} onChange={(e) => setYearsOfExperience(e.target.value)} />
        </div>
        <div className="flex justify-end">
            <Button onClick={handleUpdateDoctorProfile} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Changes
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorProfileTab;
