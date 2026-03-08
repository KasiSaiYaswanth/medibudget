import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  ChevronRight,
  X,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearNotifications,
  getUnreadCount,
  getPreferences,
  savePreferences,
  NOTIFICATION_TYPE_META,
  type AppNotification,
  type NotificationPreferences,
  type NotificationType,
} from "@/lib/notificationService";

interface NotificationCenterProps {
  open: boolean;
  onClose: () => void;
  onUnreadChange?: (count: number) => void;
}

const NotificationCenter = ({ open, onClose, onUnreadChange }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [prefs, setPrefs] = useState<NotificationPreferences>(getPreferences());
  const navigate = useNavigate();

  const refresh = useCallback(() => {
    const n = getNotifications();
    setNotifications(n);
    onUnreadChange?.(n.filter((x) => !x.read).length);
  }, [onUnreadChange]);

  useEffect(() => {
    if (open) refresh();
  }, [open, refresh]);

  const handleRead = (id: string) => {
    markAsRead(id);
    refresh();
  };

  const handleReadAll = () => {
    markAllAsRead();
    refresh();
  };

  const handleClear = () => {
    clearNotifications();
    refresh();
  };

  const handleNotificationClick = (notif: AppNotification) => {
    handleRead(notif.id);
    if (notif.actionPath) {
      onClose();
      navigate(notif.actionPath);
    }
  };

  const handlePrefChange = (type: NotificationType, enabled: boolean) => {
    const updated = { ...prefs, [type]: enabled };
    setPrefs(updated);
    savePreferences(updated);
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHrs = Math.floor(diffMin / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/10 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed right-4 top-16 lg:top-4 z-50 w-[calc(100vw-2rem)] max-w-sm"
          >
            <Card className="shadow-elevated border-border overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                {showSettings ? (
                  <button
                    onClick={() => setShowSettings(false)}
                    className="flex items-center gap-1.5 text-sm font-semibold text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" /> Preferences
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">Notifications</span>
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4">
                        {unreadCount}
                      </Badge>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  {!showSettings && (
                    <>
                      {unreadCount > 0 && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleReadAll} title="Mark all read">
                          <CheckCheck className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowSettings(true)} title="Settings">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                    <X className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              {showSettings ? (
                <div className="p-4 space-y-4">
                  <p className="text-xs text-muted-foreground">Choose which notifications you'd like to receive.</p>
                  {(Object.keys(NOTIFICATION_TYPE_META) as NotificationType[]).map((type) => {
                    const meta = NOTIFICATION_TYPE_META[type];
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{meta.emoji}</span>
                          <span className="text-sm text-foreground">{meta.label}</span>
                        </div>
                        <Switch checked={prefs[type]} onCheckedChange={(v) => handlePrefChange(type, v)} />
                      </div>
                    );
                  })}
                  {notifications.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4 text-destructive border-destructive/30 hover:bg-destructive/5"
                      onClick={handleClear}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Clear All Notifications
                    </Button>
                  )}
                </div>
              ) : (
                <ScrollArea className="max-h-[60vh]">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <BellOff className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No notifications yet</p>
                      <p className="text-xs text-muted-foreground mt-1">Health tips and reminders will appear here</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {notifications.map((notif, i) => {
                        const meta = NOTIFICATION_TYPE_META[notif.type];
                        return (
                          <motion.button
                            key={notif.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.02 }}
                            onClick={() => handleNotificationClick(notif)}
                            className={`w-full text-left p-3 hover:bg-secondary/50 transition-colors ${
                              !notif.read ? "bg-primary/5" : ""
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-lg flex-shrink-0 mt-0.5">{notif.icon || meta.emoji}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className={`text-sm font-semibold text-foreground truncate ${!notif.read ? "" : "opacity-70"}`}>
                                    {notif.title}
                                  </p>
                                  {!notif.read && (
                                    <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-[10px] text-muted-foreground">{formatTime(notif.timestamp)}</span>
                                  {notif.actionPath && (
                                    <span className="text-[10px] text-primary flex items-center gap-0.5">
                                      View <ChevronRight className="h-2.5 w-2.5" />
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              )}
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationCenter;
