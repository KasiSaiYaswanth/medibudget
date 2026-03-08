import { ReactNode, useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Pill,
  LayoutDashboard,
  Scan,
  Calculator,
  ShieldCheck,
  History,
  LogOut,
  Menu,
  X,
  Sparkles,
  Shield,
  Bell,
  Activity,
  Settings,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import {
  getUnreadCount,
  generateDailyHealthTip,
  generateCheckupReminder,
} from "@/lib/notificationService";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useOfflineSync } from "@/hooks/useOfflineSync";
import { OfflineBanner } from "@/components/offline/OfflineBanner";

interface Props {
  children: ReactNode;
}

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Symptom Assistant", path: "/symptoms", icon: Sparkles },
  { label: "Medicine Scanner", path: "/scanner", icon: Scan },
  { label: "Cost Estimation", path: "/estimate", icon: Calculator },
  { label: "Insurance", path: "/insurance", icon: Shield },
  { label: "Scheme Checker", path: "/schemes", icon: ShieldCheck },
  { label: "History", path: "/history", icon: History },
  { label: "Settings", path: "/settings", icon: Settings },
];

const DashboardLayout = ({ children }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isOnline, wasOffline } = useNetworkStatus();
  const { syncNow } = useOfflineSync();

  // Generate daily tips & checkup reminders on mount
  useEffect(() => {
    generateDailyHealthTip();
    generateCheckupReminder();
    setUnreadCount(getUnreadCount());
  }, []);

  const handleUnreadChange = useCallback((count: number) => {
    setUnreadCount(count);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out");
    navigate("/");
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <Link to="/" className="flex items-center gap-2 p-6 pb-4">
        <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
          <Pill className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold text-foreground">MediBudget</span>
      </Link>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "gradient-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground relative"
          onClick={() => setNotifOpen(true)}
        >
          <Bell className="h-4 w-4 mr-2" /> Notifications
          {unreadCount > 0 && (
            <span className="ml-auto h-5 min-w-[1.25rem] rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center px-1">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" /> Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Notification Center */}
      <NotificationCenter
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        onUnreadChange={handleUnreadChange}
      />

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 border-r bg-card flex-col fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-foreground/20" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-card shadow-elevated z-50">
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b bg-card">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <Pill className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">MediBudget</span>
          </div>
          <button onClick={() => setNotifOpen(true)} className="relative">
            <Bell className="h-5 w-5 text-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-[1rem] rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center px-0.5">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        </header>

        <main className="p-4 md:p-8 max-w-5xl">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
