import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { consultationId, symptoms, severity } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Determine if doctor is needed based on severity or keywords
    const needsDoctor = severity === "severe" || 
      symptoms.toLowerCase().includes("emergency") ||
      symptoms.toLowerCase().includes("urgent") ||
      symptoms.toLowerCase().includes("severe pain");

    if (needsDoctor) {
      // Auto-assign doctor based on symptoms
      const specialtyMap: Record<string, string> = {
        "heart|chest pain|cardiac": "Cardiology",
        "mental|depression|anxiety": "Psychiatry",
        "skin|rash|itch": "Dermatology",
        "bone|joint|fracture": "Orthopedics",
        "pregnancy|prenatal": "Obstetrics",
      };

      let requiredSpecialty = "General Practice";
      
      for (const [keywords, specialty] of Object.entries(specialtyMap)) {
        const regex = new RegExp(keywords, "i");
        if (regex.test(symptoms)) {
          requiredSpecialty = specialty;
          break;
        }
      }

      // Call the database function to assign doctor
      const { data: assignedDoctorId, error: assignError } = await supabase.rpc(
        "assign_doctor_by_specialty",
        {
          consultation_id: consultationId,
          required_specialty: requiredSpecialty,
        }
      );

      if (assignError) throw assignError;

      if (assignedDoctorId) {
        // Get doctor details
        const { data: doctor } = await supabase
          .from("doctors")
          .select("full_name, specialization")
          .eq("user_id", assignedDoctorId)
          .single();

        return new Response(
          JSON.stringify({
            needsDoctor: true,
            doctorAssigned: true,
            doctorId: assignedDoctorId,
            doctorName: doctor?.full_name,
            specialty: doctor?.specialization,
            message: `Based on your symptoms, I'm connecting you with Dr. ${doctor?.full_name} (${doctor?.specialization}). They will continue from here.`,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else {
        return new Response(
          JSON.stringify({
            needsDoctor: true,
            doctorAssigned: false,
            message: "I recommend speaking with a doctor. Unfortunately, no doctors are currently available. Please try booking an appointment.",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({
        needsDoctor: false,
        message: "I can continue to help you with this. Let me provide some guidance...",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
