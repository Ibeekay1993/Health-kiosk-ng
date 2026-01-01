
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, User, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const TriageTab = ({ doctorId }: { doctorId: string }) => {
  const [triageQueue, setTriageQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTriageQueue = async () => {
    if (!doctorId) return;
    setLoading(true);
    try {
      // This assumes a 'triage' table or a similar view/function exists.
      // For demo purposes, we can fetch patients who need attention.
      // The logic here would be specific to how triage is defined in your system.
      const { data, error } = await supabase
        .from('triage') // This is a hypothetical table for the queue
        .select(`
          id,
          created_at,
          symptoms,
          patient:profiles(full_name, avatar_url)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setTriageQueue(data || []);
    } catch (err: any) {
      toast.error('Failed to fetch triage queue', { description: err.message });
      // If the table doesn't exist, we'll just show an empty list
      setTriageQueue([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTriageQueue();
  }, [doctorId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Triage Queue</CardTitle>
        <CardDescription>{triageQueue.length} patients waiting for consultation.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8"><Loader2 className="h-8 w-8 animate-spin"/></div>
        ) : triageQueue.length > 0 ? (
          <div className="space-y-4">
            {triageQueue.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                    <User className="h-5 w-5"/>
                    <div>
                        <p className="font-semibold">{item.patient.full_name}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-sm">Symptoms: {item.symptoms || 'Not specified'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-4 w-4"/>
                        {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                    </div>
                    <Button asChild size="sm">
                        <Link to={`/consultation/triage/${item.id}`}>Start Consultation</Link>
                    </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">The triage queue is empty.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default TriageTab;
