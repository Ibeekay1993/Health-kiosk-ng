import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const DAILY_API_KEY = Deno.env.get("DAILY_API_KEY");
const DAILY_API_URL = "https://api.daily.co/v1/rooms";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey" } });
  }

  try {
    const { consultationId } = await req.json();

    const response = await fetch(DAILY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        properties: {
          exp: Math.floor(Date.now() / 1000) + 3600, // Room expires in 1 hour
          enable_chat: true,
          enable_screenshare: true,
          enable_recording: 'cloud',
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Daily.co API error: ${response.statusText}`);
    }

    const { url } = await response.json();

    return new Response(
      JSON.stringify({ roomUrl: url }),
      {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey" },
      status: 500,
    });
  }
});
