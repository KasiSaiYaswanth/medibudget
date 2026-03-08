import { WifiOff, Wifi, RefreshCw, CloudOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface OfflineBannerProps {
  isOnline: boolean;
  wasOffline: boolean;
  onRefresh?: () => void;
}

export function OfflineBanner({ isOnline, wasOffline, onRefresh }: OfflineBannerProps) {
  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-amber-500/15 border-b border-amber-500/30 overflow-hidden"
        >
          <div className="flex items-center justify-center gap-2 py-2 px-4 text-sm">
            <WifiOff className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="text-amber-800 dark:text-amber-200">
              Offline Mode Active — Estimates are based on cached data and may be updated when connection is restored.
            </span>
          </div>
        </motion.div>
      )}

      {isOnline && wasOffline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-emerald-500/15 border-b border-emerald-500/30 overflow-hidden"
        >
          <div className="flex items-center justify-center gap-2 py-2 px-4 text-sm">
            <Wifi className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-emerald-800 dark:text-emerald-200">
              Back online — Syncing latest data...
            </span>
            {onRefresh && (
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={onRefresh}>
                <RefreshCw className="h-3 w-3 mr-1" /> Refresh
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function OfflineBadge() {
  return (
    <Badge variant="outline" className="text-[10px] border-amber-500/50 text-amber-600 dark:text-amber-400 gap-1">
      <CloudOff className="h-3 w-3" />
      Cached
    </Badge>
  );
}
