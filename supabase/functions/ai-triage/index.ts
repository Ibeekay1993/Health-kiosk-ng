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
    const { message, conversationHistory } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    console.log("Received message:", message);
    console.log("Conversation history:", conversationHistory);
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a medical AI triage assistant for HC4A (Health Care for All), Nigeria's telemedicine platform.

Your role:
1. Ask clarifying questions about symptoms - be conversational and empathetic
2. Provide initial health education and home remedies for minor issues
3. Assess severity (low, medium, high)
4. NEVER prescribe medications - only doctors can do this
5. When severity is high or patient requests, recommend connecting to a doctor

Guidelines:
- Be warm, empathetic, and culturally aware for Nigerian context
- For minor issues: suggest evidence-based home remedies first
- For concerning symptoms: recommend doctor consultation
- Always ask follow-up questions to understand symptoms better
- If user says "connect me to a doctor" or similar, immediately offer to connect them

Severity assessment:
- LOW: Minor ailments (common cold, mild headache, mild fever under 38°C)
- MEDIUM: Concerning symptoms that need medical attention within 24 hours
- HIGH: Urgent symptoms requiring immediate medical attention

Always respond in a conversational manner. Include:
- An empathetic response to what they shared
- Follow-up questions OR home remedy suggestions
- Clear indication if they should see a doctor

IMPORTANT: If the user explicitly asks to speak with or connect to a doctor, set connectToDoctor to true.

Respond with JSON:
{
  "response": "your conversational message",
  "severity": "low|medium|high",
  "connectToDoctor": boolean,
  "homeRemedies": ["remedy1", "remedy2"] (optional, for low severity)
}`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(conversationHistory || []),
      { role: "user", content: message }
    ];

    console.log("Calling Lovable AI Gateway...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
      }),
    });

    console.log("AI Gateway response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
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
      throw new Error(`AI Gateway error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("AI Gateway response data:", JSON.stringify(data));
    
    const content = data.choices[0].message.content;
    console.log("AI content:", content);
    
    // Try to parse as JSON, fallback to plain text response
    let aiResponse;
    try {
      // Clean the content - remove markdown code blocks if present
      let cleanContent = content;
      if (content.includes("```json")) {
        cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      } else if (content.includes("```")) {
        cleanContent = content.replace(/```\n?/g, "");
      }
      aiResponse = JSON.parse(cleanContent.trim());
    } catch (parseError) {
      console.log("Could not parse as JSON, using plain text");
      aiResponse = {
        response: content,
        severity: "low",
        connectToDoctor: false
      };
    }

    console.log("Returning response:", JSON.stringify(aiResponse));

    return new Response(JSON.stringify(aiResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in ai-triage:", error);
    return new Response(
      JSON.stringify({ 
        response: "I'm having trouble processing your request. Please try again or contact support if the issue persists.",
        error: error instanceof Error ? error.message : "Unknown error occurred",
        severity: "low",
        connectToDoctor: false
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
