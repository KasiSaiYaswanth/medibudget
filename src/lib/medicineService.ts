import { supabase } from "@/integrations/supabase/client";

export interface MedicineInfo {
  id: string;
  name: string;
  generic_name: string;
  category: string;
  uses: string[];
  side_effects: string[];
  dosage: string;
  warnings: string[];
  price_range: string;
  prescription_required: boolean;
}

export async function searchMedicines(query: string): Promise<MedicineInfo[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const { data, error } = await supabase
    .from("medicines")
    .select("*")
    .or(`name.ilike.%${q}%,generic_name.ilike.%${q}%,category.ilike.%${q}%`)
    .limit(20);

  if (error) {
    console.error("Search error:", error);
    return [];
  }
  return (data as MedicineInfo[]) || [];
}

export async function getCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from("medicines")
    .select("category")
    .limit(1000);

  if (error) return [];
  const unique = [...new Set((data || []).map((d: any) => d.category))];
  return unique.sort();
}

export async function getMedicinesByCategory(category: string): Promise<MedicineInfo[]> {
  const { data, error } = await supabase
    .from("medicines")
    .select("*")
    .eq("category", category)
    .order("name");

  if (error) return [];
  return (data as MedicineInfo[]) || [];
}
