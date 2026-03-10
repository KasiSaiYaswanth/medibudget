import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseUser.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;
    const { action } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (action === "export") {
      // Export user data
      const [symptoms, costs, roles] = await Promise.all([
        supabaseAdmin.from("symptom_searches").select("*").eq("user_id", userId),
        supabaseAdmin.from("cost_estimation_logs").select("*").eq("user_id", userId),
        supabaseAdmin.from("user_roles").select("*").eq("user_id", userId),
      ]);

      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId);

      const exportData = {
        profile: {
          email: userData?.user?.email,
          created_at: userData?.user?.created_at,
        },
        symptom_searches: symptoms.data || [],
        cost_estimations: costs.data || [],
        roles: roles.data || [],
        exported_at: new Date().toISOString(),
      };

      return new Response(JSON.stringify(exportData, null, 2), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Content-Disposition": "attachment; filename=medibudget-data-export.json",
        },
      });
    }

    if (action === "delete") {
      // Delete all user data then the auth account
      await supabaseAdmin.from("symptom_searches").delete().eq("user_id", userId);
      await supabaseAdmin.from("cost_estimation_logs").delete().eq("user_id", userId);
      await supabaseAdmin.from("user_roles").delete().eq("user_id", userId);
      await supabaseAdmin.auth.admin.deleteUser(userId);

      return new Response(JSON.stringify({ success: true, message: "Account deleted" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
