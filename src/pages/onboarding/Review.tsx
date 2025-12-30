
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Hourglass } from "lucide-react";

const Review = () => {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: doctor } = await supabase.from('doctors').select('status').eq('user_id', user.id).single();
      if (doctor) setStatus(doctor.status);
    };
    fetchStatus();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Review</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <Hourglass className="h-16 w-16 mx-auto text-primary" />
        <h2 className="text-2xl font-semibold mt-4">Your application is under review.</h2>
        <p className="text-muted-foreground mt-2">
          We will notify you once the review is complete. Current status: <span className="font-bold">{status}</span>
        </p>
      </CardContent>
    </Card>
  );
};

export default Review;
