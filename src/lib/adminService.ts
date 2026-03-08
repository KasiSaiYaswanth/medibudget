import { supabase } from "@/integrations/supabase/client";

// Check if current user is admin
export async function checkIsAdmin(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  return !!data;
}

// Analytics queries
export async function getSymptomAnalytics() {
  const { data, error } = await supabase
    .from("symptom_searches")
    .select("symptom, predicted_condition, confidence_score, city, created_at");
  if (error) throw error;
  return data || [];
}

export async function getCostAnalytics() {
  const { data, error } = await supabase
    .from("cost_estimation_logs")
    .select("*");
  if (error) throw error;
  return data || [];
}

export async function getHospitals() {
  const { data, error } = await supabase
    .from("hospitals")
    .select("*")
    .order("name");
  if (error) throw error;
  return data || [];
}

export async function getGovernmentSchemes() {
  const { data, error } = await supabase
    .from("government_schemes")
    .select("*")
    .order("name");
  if (error) throw error;
  return data || [];
}

export async function getInsuranceProviders() {
  const { data, error } = await supabase
    .from("insurance_providers")
    .select("*")
    .order("name");
  if (error) throw error;
  return data || [];
}

export async function getMedicines() {
  const { data, error } = await supabase
    .from("medicines")
    .select("*")
    .order("name");
  if (error) throw error;
  return data || [];
}

export async function getAuditLogs() {
  const { data, error } = await supabase
    .from("admin_audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return data || [];
}

export async function logAdminAction(action: string, entityType: string, entityId?: string, details?: Record<string, unknown>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("admin_audit_logs").insert([{
    admin_id: user.id,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details: (details || {}) as any,
  }] as any);
}

// CRUD operations
export async function upsertHospital(hospital: {
  id?: string;
  name: string;
  city: string;
  state?: string;
  category: string;
  pricing_tier?: string;
  consultation_cost?: number;
  latitude?: number;
  longitude?: number;
  contact_phone?: string;
}) {
  const { data, error } = await supabase
    .from("hospitals")
    .upsert(hospital)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteHospital(id: string) {
  const { error } = await supabase.from("hospitals").delete().eq("id", id);
  if (error) throw error;
}

export async function upsertScheme(scheme: {
  id?: string;
  name: string;
  description?: string;
  eligibility_criteria?: string;
  coverage_amount?: number;
  state?: string;
  is_active?: boolean;
}) {
  const { data, error } = await supabase
    .from("government_schemes")
    .upsert(scheme)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteScheme(id: string) {
  const { error } = await supabase.from("government_schemes").delete().eq("id", id);
  if (error) throw error;
}

export async function upsertInsuranceProvider(provider: {
  id?: string;
  name: string;
  coverage_percentage?: number;
  claim_limit?: number;
  plan_types?: string[];
  is_active?: boolean;
}) {
  const { data, error } = await supabase
    .from("insurance_providers")
    .upsert(provider)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteInsuranceProvider(id: string) {
  const { error } = await supabase.from("insurance_providers").delete().eq("id", id);
  if (error) throw error;
}
