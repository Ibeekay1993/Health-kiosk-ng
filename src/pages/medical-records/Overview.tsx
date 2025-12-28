import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

const Overview = () => {
  const { user, loading: authLoading } = useAuth();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientData = async () => {
      if (user) {
        try {
          const { data: patientData, error: patientError } = await supabase
            .from("patients")
            .select("*")
            .eq("user_id", user.id)
            .single();
          if (patientError && patientError.code !== 'PGRST116') {
            throw patientError;
          }
          setPatient(patientData);
        } catch (error: any) {
          toast({ title: "Error fetching patient data", description: error.message, variant: "destructive" });
        } finally {
          setLoading(false);
        }
      } else if (!authLoading) {
        setLoading(false);
      }
    };
    fetchPatientData();
  }, [user, authLoading, toast]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.from("patients").update(patient).eq("user_id", user.id).select();
      if (error) throw error;
      setPatient(data[0]);
      toast({ title: "Profile Updated", description: "Your information has been successfully updated." });
      setIsEditing(false);
    } catch (error: any) {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPatient({ ...patient, [id]: value });
  };

  const handleSelectChange = (id: string, value: string) => {
    setPatient({ ...patient, [id]: value });
  };

  if (loading || authLoading) return <div className="text-center p-4">Loading...</div>;

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Please Log In</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please log in to view your medical records.</p>
          <Button className="mt-4" onClick={() => navigate("/login")}>Login</Button>
        </CardContent>
      </Card>
    );
  }

  if (!patient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create Your Patient Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p>It looks like you haven't set up your patient profile yet. Please create one to manage your medical records.</p>
          <Button className="mt-4" onClick={() => navigate("/complete-profile")}>Create Profile</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Personal Information</CardTitle>
        <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>{isEditing ? "Cancel" : "Edit"}</Button>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Name</Label>
                <Input id="full_name" value={patient.full_name || ''} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user?.email || ''} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={patient.phone || ''} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input id="date_of_birth" type="date" value={patient.date_of_birth || ''} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={(value) => handleSelectChange('gender', value)} value={patient.gender || ''}>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input id="occupation" value={patient.occupation || ''} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input id="weight" type="number" value={patient.weight || ''} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input id="height" type="number" value={patient.height || ''} onChange_handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blood_type">Blood Type</Label>
                <Input id="blood_type" value={patient.blood_type || ''} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marital_status">Marital Status</Label>
                <Input id="marital_status" value={patient.marital_status || ''} onChange={handleInputChange} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={patient.address || ''} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency_contact">Emergency Contact</Label>
                <Input id="emergency_contact" value={patient.emergency_contact || ''} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="next_of_kin">Next of Kin</Label>
                <Input id="next_of_kin" value={patient.next_of_kin || ''} onChange={handleInputChange} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-sm">
            <p><strong>Name:</strong> {patient.full_name || "Not set"}</p>
            <p><strong>Email:</strong> {user?.email || "Not set"}</p>
            <p><strong>Phone Number:</strong> {patient.phone || '-'}</p>
            <p><strong>Date of Birth:</strong> {patient.date_of_birth || '-'}</p>
            <p><strong>Gender:</strong> {patient.gender || '-'}</p>
            <p><strong>Occupation:</strong> {patient.occupation || '-'}</p>
            <p><strong>Weight:</strong> {patient.weight ? `${patient.weight} kg` : '-'}</p>
            <p><strong>Height:</strong> {patient.height ? `${patient.height} cm` : '-'}</p>
            <p><strong>Blood Type:</strong> {patient.blood_type || '-'}</p>
            <p><strong>Marital Status:</strong> {patient.marital_status || '-'}</p>
            <p><strong>Address:</strong> {patient.address || '-'}</p>
            <p><strong>Emergency Contact:</strong> {patient.emergency_contact || '-'}</p>
            <p><strong>Next of Kin:</strong> {patient.next_of_kin || '-'}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Overview;
