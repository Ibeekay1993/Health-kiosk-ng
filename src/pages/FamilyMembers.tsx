
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import useAuth from '@/hooks/useAuth';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  date_of_birth: string;
}

const FamilyMembers = () => {
  const { user } = useAuth();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('family_members')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        setFamilyMembers(data || []);
      } catch (error: any) {
        console.error('Error fetching family members:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyMembers();
  }, [user]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Family Members</h1>
      <div className="flex justify-between items-center mb-8">
        <p>Manage health records for your family members.</p>
        <Button>Add Family Member</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Family</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : familyMembers.length > 0 ? (
            <ul>
              {familyMembers.map((member) => (
                <li key={member.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.relationship}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{member.date_of_birth}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">You have not added any family members yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FamilyMembers;
