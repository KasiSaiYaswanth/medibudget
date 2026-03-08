import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a pharmaceutical OCR and medicine identification expert for the MediBudget platform in India.

You will receive an image of a medicine strip, box, or packaging. Your job is to extract ALL visible pharmaceutical information.

IMPORTANT: Analyze the image carefully and extract:

1. **Medicine Name** - The brand name printed on the packaging
2. **Generic Name** - The active pharmaceutical ingredient(s)
3. **Composition** - Full drug composition with strengths (e.g., "Paracetamol 500mg + Caffeine 65mg")
4. **Dosage** - Any dosage instructions visible
5. **Manufacturer** - Company name if visible
6. **Batch/Lot Number** - If visible
7. **Expiry Date** - If visible
8. **MRP/Price** - If visible
9. **Barcode Number** - If any barcode number is readable
10. **Prescription Required** - Whether "Rx" symbol is visible
11. **Uses** - Common uses of the identified medicine (from your knowledge)
12. **Side Effects** - Common side effects (from your knowledge)
13. **Warnings** - Important warnings (from your knowledge)
14. **Category** - Medical category (e.g., Analgesic, Antibiotic, Antacid)
15. **Cheaper Alternatives** - 2-3 generic or cheaper alternatives available in India

If you cannot read something clearly, say "Not clearly visible" for that field.
If the image is not a medicine, indicate that clearly.

You MUST call the extract_medicine_info tool with your findings.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, scanMode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let userPrompt = "Analyze this medicine image and extract all pharmaceutical information.";
    if (scanMode === "back") {
      userPrompt = "This is the BACK SIDE of a medicine strip/box. Focus on extracting composition, ingredients, dosage instructions, warnings, and manufacturing details.";
    } else if (scanMode === "barcode") {
      userPrompt = "Focus on detecting any barcode or QR code numbers visible in this image, and also extract any medicine name or details visible.";
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: userPrompt },
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
              },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_medicine_info",
              description: "Return extracted medicine information from the scanned image.",
              parameters: {
                type: "object",
                properties: {
                  is_medicine: {
                    type: "boolean",
                    description: "Whether the image contains medicine packaging",
                  },
                  medicine_name: { type: "string", description: "Brand name of the medicine" },
                  generic_name: { type: "string", description: "Generic/active ingredient name" },
                  composition: { type: "string", description: "Full composition with strengths" },
                  dosage: { type: "string", description: "Dosage instructions" },
                  manufacturer: { type: "string", description: "Manufacturer company name" },
                  batch_number: { type: "string", description: "Batch or lot number" },
                  expiry_date: { type: "string", description: "Expiry date" },
                  mrp: { type: "string", description: "Maximum retail price" },
                  barcode_number: { type: "string", description: "Barcode or QR code number" },
                  prescription_required: {
                    type: "boolean",
                    description: "Whether prescription is required (Rx symbol visible)",
                  },
                  category: { type: "string", description: "Medical category" },
                  uses: {
                    type: "array",
                    items: { type: "string" },
                    description: "Common uses of this medicine",
                  },
                  side_effects: {
                    type: "array",
                    items: { type: "string" },
                    description: "Common side effects",
                  },
                  warnings: {
                    type: "array",
                    items: { type: "string" },
                    description: "Important warnings",
                  },
                  cheaper_alternatives: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        generic_name: { type: "string" },
                        estimated_price: { type: "string" },
                      },
                      required: ["name", "generic_name", "estimated_price"],
                      additionalProperties: false,
                    },
                    description: "Cheaper alternative medicines",
                  },
                  confidence: {
                    type: "string",
                    enum: ["high", "medium", "low"],
                    description: "Confidence level of the identification",
                  },
                  raw_text: { type: "string", description: "All raw text detected in the image" },
                },
                required: ["is_medicine", "medicine_name", "confidence"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_medicine_info" } },
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
        JSON.stringify({ error: "Failed to analyze image." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("medicine-scan error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
