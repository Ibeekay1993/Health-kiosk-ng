import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptoms, patientHistory, conversationHistory } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a medical AI triage assistant for HC4A (Health Care for All), Nigeria's telemedicine platform.

Your role:
1. Ask clarifying questions about symptoms
2. Provide initial health education and home remedies for minor issues
3. Assess severity (low, medium, high)
4. Only recommend doctor consultation for:
   - Chronic conditions requiring ongoing care
   - Symptoms indicating serious illness
   - Patient insists after trying home remedies
   - Moderate to high severity cases

For minor issues (fever, headache, common cold):
- Suggest evidence-based home remedies
- Provide health education
- Recommend when to seek doctor if symptoms worsen

Always be empathetic, professional, and culturally aware for Nigerian context.

Severity levels:
- LOW: Minor ailments (common cold, headache, mild fever) - recommend home remedies
- MEDIUM: Concerning symptoms needing medical advice - may recommend doctor
- HIGH: Urgent symptoms - immediately recommend doctor

Response format:
{
  "message": "your conversational response",
  "severity": "low|medium|high",
  "recommendDoctor": boolean,
  "homeRemedies": ["remedy1", "remedy2"],
  "requiresFollowup": boolean
}`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(conversationHistory || []),
      { role: "user", content: `Symptoms: ${symptoms}\nMedical History: ${patientHistory || "None provided"}` }
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service credits exhausted. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(aiResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in ai-triage:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});