
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export interface MedicalRecord {
  id: number;
  created_at: string;
  title: string;
  record_date: string;
  file_url: string | null;
}

export const useMedicalRecords = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecords = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("medical_records")
          .select("*")
          .eq("user_id", user.id)
          .order("record_date", { ascending: false });

        if (error) {
          throw error;
        }
        setRecords(data || []);
      } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching medical records:", error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [user]);

  return { records, loading };
};
