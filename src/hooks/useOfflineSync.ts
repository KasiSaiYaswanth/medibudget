import { useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { setCacheItem, getCacheItem } from "@/lib/offlineStorage";

const SYNC_KEYS = {
  hospitals: "offline_hospitals",
  schemes: "offline_schemes",
  medicines: "offline_medicines",
  lastSync: "offline_last_sync",
};

/**
 * Hook that syncs essential reference data to IndexedDB when online.
 * Call once from the DashboardLayout.
 */
export function useOfflineSync() {
  const syncing = useRef(false);

  const syncData = useCallback(async () => {
    if (syncing.current || !navigator.onLine) return;
    syncing.current = true;

    try {
      // Check if last sync was recent (< 6 hours ago)
      const lastSync = await getCacheItem<number>(SYNC_KEYS.lastSync);
      if (lastSync && !lastSync.expired && Date.now() - lastSync.data < 6 * 60 * 60 * 1000) {
        return;
      }

      // Fetch and cache hospitals
      const { data: hospitals } = await supabase
        .from("hospitals")
        .select("id,name,city,state,category,consultation_cost,pricing_tier,latitude,longitude,contact_phone")
        .limit(500);
      if (hospitals?.length) await setCacheItem(SYNC_KEYS.hospitals, hospitals);

      // Fetch and cache government schemes
      const { data: schemes } = await supabase
        .from("government_schemes")
        .select("id,name,description,eligibility_criteria,coverage_amount,state,is_active")
        .eq("is_active", true)
        .limit(200);
      if (schemes?.length) await setCacheItem(SYNC_KEYS.schemes, schemes);

      // Fetch and cache medicines
      const { data: medicines } = await supabase
        .from("medicines")
        .select("id,name,generic_name,category,price_range,uses,dosage")
        .limit(500);
      if (medicines?.length) await setCacheItem(SYNC_KEYS.medicines, medicines);

      await setCacheItem(SYNC_KEYS.lastSync, Date.now());
      console.log("[OfflineSync] Data cached successfully");
    } catch (err) {
      console.warn("[OfflineSync] Sync failed:", err);
    } finally {
      syncing.current = false;
    }
  }, []);

  // Sync on mount and when coming back online
  useEffect(() => {
    syncData();

    const handleOnline = () => {
      // Small delay to let connection stabilize
      setTimeout(syncData, 2000);
    };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [syncData]);

  return { syncNow: syncData };
}
