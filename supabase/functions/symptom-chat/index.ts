import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are MediBudget's Symptom Intelligence Assistant — a calm, empathetic, and thoughtful healthcare triage chatbot. You help users understand their symptoms before visiting a hospital.

## Your Personality
- Warm, reassuring, and professional
- Use simple language — avoid medical jargon unless you explain it
- Never alarmist, but honest when symptoms may be serious
- Behave like a skilled medical triage nurse, not a generic AI

## Conversation Flow
For every user message about symptoms, follow this structure:

1. **Acknowledge** — Show empathy ("I understand that must be uncomfortable...")
2. **Clarify** — Ask 2-3 focused follow-up questions to understand better (duration, severity, associated symptoms, history)
3. **Analyze** — Once you have enough info, analyze the symptoms
4. **Recommend** — Suggest probable conditions, severity, doctor type, and next steps

## Symptom Analysis
When you have enough information, provide a structured summary:

**🔍 Symptom Analysis**
- List the key symptoms identified

**🩺 Possible Conditions**
- List 2-3 probable conditions with brief explanations

**⚠️ Severity Level**
- Low / Moderate / High / Urgent

**👨‍⚕️ Recommended Doctor**
- Specific specialist type (e.g., "General Physician", "Cardiologist", "Neurologist")

**📋 Suggested Next Steps**
- Actionable advice (monitor, home remedies, visit doctor, seek emergency care)

## Integration Hints
When recommending a doctor or condition, mention that the user can use MediBudget's Cost Estimation tool to estimate treatment costs for the identified condition.

## Safety Rules (CRITICAL)
- NEVER provide a final diagnosis — always say "possible" or "may indicate"
- NEVER prescribe specific medication dosages
- NEVER tell someone they don't need medical attention if symptoms sound serious
- For chest pain, breathing difficulty, stroke symptoms, severe bleeding, or loss of consciousness: immediately recommend emergency medical attention
- Always include this at the end of analysis responses: "⚕️ *This is for guidance only and does not replace professional medical advice. Please consult a qualified healthcare professional.*"

## Response Style
- Keep responses concise (under 300 words unless detailed analysis)
- Use markdown formatting for readability
- Use emojis sparingly for warmth (🩺 ⚕️ 💊)
- Ask only 2-3 questions at a time, not a long list`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GEMINI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gemini-2.5-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("symptom-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
