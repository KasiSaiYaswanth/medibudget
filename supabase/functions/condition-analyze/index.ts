import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CONDITIONS = [
  "fever", "fracture", "cardiac", "bypass", "angioplasty", "dental", "eye",
  "maternity", "csection", "kidney", "transplant", "skin", "cancer",
  "appendix", "hernia", "knee", "spine", "diabetes", "thyroid", "neuro",
];

const SYSTEM_PROMPT = `You are a medical condition analyzer for a healthcare cost estimation platform called MediBudget.

Given a patient's description of their health problem, you MUST analyze their symptoms and map them to the most likely medical conditions from this exact list:

- fever: Fever / Common Cold
- fracture: Bone Fracture
- cardiac: Cardiac Check-up
- bypass: Heart Bypass Surgery
- angioplasty: Angioplasty / Stent
- dental: Dental Treatment
- eye: Eye Check-up / Cataract
- maternity: Normal Delivery
- csection: C-Section Delivery
- kidney: Kidney Treatment / Dialysis
- transplant: Kidney Transplant
- skin: Skin / Dermatology
- cancer: Cancer Treatment
- appendix: Appendicitis Surgery
- hernia: Hernia Surgery
- knee: Knee Replacement
- spine: Spine Surgery
- diabetes: Diabetes Management
- thyroid: Thyroid Treatment
- neuro: Neurological Consultation

IMPORTANT: You MUST call the "detect_conditions" tool with the results. Map each detected condition to one of the exact values from the list above. Assign a probability (0-100) based on how well the symptoms match. Only include conditions with probability >= 30.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description, chatbotCondition } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let userPrompt = "";
    if (description) {
      userPrompt = `Patient description: "${description}"`;
    }
    if (chatbotCondition) {
      userPrompt += `\n\nThe symptom chatbot has also predicted: ${chatbotCondition}. Factor this into your analysis with high weight.`;
    }

    if (!userPrompt.trim()) {
      return new Response(
        JSON.stringify({ error: "Please provide a description or chatbot condition." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "detect_conditions",
              description: "Return detected medical conditions with probabilities.",
              parameters: {
                type: "object",
                properties: {
                  conditions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        value: {
                          type: "string",
                          enum: CONDITIONS,
                          description: "The condition key from the allowed list",
                        },
                        label: { type: "string", description: "Human-readable condition name" },
                        probability: {
                          type: "number",
                          description: "Probability percentage 0-100",
                        },
                        reasoning: {
                          type: "string",
                          description: "Brief explanation of why this condition matches",
                        },
                      },
                      required: ["value", "label", "probability", "reasoning"],
                      additionalProperties: false,
                    },
                  },
                  extracted_symptoms: {
                    type: "array",
                    items: { type: "string" },
                    description: "Key symptoms extracted from the description",
                  },
                  severity: {
                    type: "string",
                    enum: ["low", "moderate", "high", "urgent"],
                    description: "Overall severity assessment",
                  },
                },
                required: ["conditions", "extracted_symptoms", "severity"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "detect_conditions" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please wait a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please try later." }),
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

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      return new Response(
        JSON.stringify({ error: "Failed to analyze condition." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = JSON.parse(toolCall.function.arguments);
    // Sort by probability descending
    result.conditions.sort((a: any, b: any) => b.probability - a.probability);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("condition-analyze error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
