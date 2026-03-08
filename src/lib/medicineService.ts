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

  // Try exact ilike search first
  const { data, error } = await supabase
    .from("medicines")
    .select("*")
    .or(`name.ilike.%${q}%,generic_name.ilike.%${q}%,category.ilike.%${q}%`)
    .limit(20);

  if (error) {
    console.error("Search error:", error);
    return [];
  }

  // If no results, try fuzzy: search with shorter substrings (min 3 chars)
  if ((!data || data.length === 0) && q.length >= 3) {
    // Try progressively shorter prefixes for typo tolerance
    for (let len = q.length - 1; len >= 3; len--) {
      const prefix = q.slice(0, len);
      const { data: fuzzyData, error: fuzzyError } = await supabase
        .from("medicines")
        .select("*")
        .or(`name.ilike.%${prefix}%,generic_name.ilike.%${prefix}%`)
        .limit(20);

      if (!fuzzyError && fuzzyData && fuzzyData.length > 0) {
        return fuzzyData as MedicineInfo[];
      }
    }
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
