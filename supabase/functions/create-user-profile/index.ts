import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  return new Promise(async (resolve) => {
    try {
      const {
        user_id,
        role,
        full_name,
        phone,
        location,
        specialization,
        license_number,
        pharmacy_name,
        vehicle_type,
        business_name
      } = await req.json();

      // The service_role key has super admin privileges and bypasses RLS.
      // Use it with extreme caution.
      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      let profileData = {};
      let tableName = "";

      // Determine the table and data based on the user's role
      switch (role) {
        case "patient":
          tableName = "patients";
          profileData = { user_id, full_name, phone, location };
          break;
        case "doctor":
          tableName = "doctors";
          profileData = { user_id, full_name, phone, location, specialization, license_number };
          break;
        case "vendor":
          tableName = "vendors";
          profileData = { user_id, pharmacy_name, owner_name: full_name, phone, location };
          break;
        case "delivery_rider":
          tableName = "delivery_riders";
          profileData = { user_id, full_name, phone, location, vehicle_type };
          break;
        case "kiosk_partner":
          tableName = "kiosk_partners";
          profileData = { user_id, business_name, owner_name: full_name, phone, location };
          break;
        default:
          return resolve(new Response(JSON.stringify({ error: "Invalid role specified" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }));
      }

      // Insert the data into the correct table.
      const { error: insertError } = await supabaseAdmin
        .from(tableName)
        .insert(profileData);

      if (insertError) {
        throw insertError;
      }

      return resolve(new Response(JSON.stringify({ message: `Profile created successfully for ${role}` }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }));

    } catch (err) {
      let errorMessage = "An unknown error occurred.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      return resolve(new Response(JSON.stringify({ error: errorMessage }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }));
    }
  });
});
