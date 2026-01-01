
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Doctor {
  id: string;
  full_name: string;
  specialization: string;
  avatar_url: string;
}

const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('doctors').select('*');
        if (error) throw error;
        setDoctors(data || []);
      } catch (error: any) {  
        toast.error('Failed to fetch doctors', { description: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Our Doctors</h1>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <Card key={doctor.id}>
              <CardHeader className="flex flex-col items-center text-center gap-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={doctor.avatar_url} alt={`Dr. ${doctor.full_name}`}/>
                  <AvatarFallback>{doctor.full_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">Dr. {doctor.full_name}</CardTitle>
                  <p className="text-muted-foreground">{doctor.specialization}</p>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button className="w-full">Book Appointment</Button>
                <Button variant="outline" className="w-full">View Profile</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctors;
