
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";
import { useMedicalRecords } from "@/hooks/use-medical-records";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Edit, LogOut, FileText, ChevronRight, Upload } from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, profile, loading: profileLoading, refreshProfile } = useProfile();
  const { records, loading: recordsLoading } = useMedicalRecords();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      setLocation(profile.location || "");
      setAvatarUrl(profile.avatar_url || null);
    }
  }, [profile]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: fullName,
        phone,
        location,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({ description: "Profile updated successfully." });
      setIsEditing(false);
      refreshProfile();
    } catch (error: any) {
      toast({ variant: "destructive", description: error.message });
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    if (!user) return;

    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    setUploading(true);

    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

      const { error: updateError } = await supabase.from('profiles').upsert({
        id: user.id,
        avatar_url: publicUrl,
      });

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      refreshProfile();
      toast({ description: "Avatar updated successfully." });
    } catch (error: any) {
      toast({ variant: "destructive", description: error.message });
    } finally {
      setUploading(false);
    }
  };

  if (profileLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto p-4 space-y-6">
        
        <Card className="border-0 shadow-none">
          <CardContent className="flex flex-col items-center text-center gap-2 pt-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl ?? ""} />
                <AvatarFallback>
                  {profile?.full_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="absolute bottom-0 right-0">
                  <Label htmlFor="avatar-upload" className="cursor-pointer bg-primary text-primary-foreground rounded-full p-2 inline-block">
                     <Upload className="h-4 w-4" />
                  </Label>
                  <Input id="avatar-upload" type="file" className="hidden" onChange={uploadAvatar} disabled={uploading} accept="image/*" />
                </div>
              )}
            </div>

            <h1 className="text-lg font-semibold">
              {profile?.full_name}
            </h1>

            <p className="text-sm text-muted-foreground">
              {user?.email}
            </p>
             <Button variant={isEditing ? "default" : "outline"} size="sm" className="mt-2" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="mr-2 h-4 w-4" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </CardContent>
        </Card>

        {isEditing ? (
          <Card className="border shadow-none">
            <CardHeader>
              <CardTitle>Edit Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
              <Button onClick={handleUpdateProfile} className="w-full">Save Changes</Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border shadow-none">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex justify-between gap-4 py-2 border-b">
                <span className="text-muted-foreground">Full Name</span>
                <span className="text-right">{profile?.full_name ?? "Not provided"}</span>
              </div>
              <div className="flex justify-between gap-4 py-2 border-b">
                <span className="text-muted-foreground">Email</span>
                <span className="text-right">{user?.email ?? "Not provided"}</span>
              </div>
              <div className="flex justify-between gap-4 py-2 border-b">
                <span className="text-muted-foreground">Phone</span>
                <span className="text-right">{profile?.phone ?? "Not provided"}</span>
              </div>
              <div className="flex justify-between gap-4 py-2">
                <span className="text-muted-foreground">Location</span>
                <span className="text-right">{profile?.location ?? "Not provided"}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border shadow-none">
            <CardHeader>
                <CardTitle>Medical Records</CardTitle>
            </CardHeader>
            <CardContent>
              {recordsLoading ? (
                <p>Loading records...</p>
              ) : records.length > 0 ? (
                <div className="space-y-2">
                  {records.map((record) => (
                    <Button key={record.id} variant="ghost" className="w-full justify-between h-auto py-3">
                      <div className="flex items-center text-left">
                        <FileText className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                        <span className="flex-grow">{record.title}</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No medical records found.</p>
              )}
            </CardContent>
        </Card>

        <div className="mt-6">
          <Button variant="destructive" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
