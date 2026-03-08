import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Activity, Building2, Shield, Pill, FileText,
  Users, ClipboardList, ChevronLeft, ChevronRight,
  LogOut, Pill as PillIcon, BarChart3, Menu, X, Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkIsAdmin } from "@/lib/adminService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { title: "Overview", path: "/admin", icon: LayoutDashboard },
  { title: "Health Dashboard", path: "/admin/health", icon: Heart },
  { title: "Symptom Analytics", path: "/admin/symptoms", icon: Activity },
  { title: "Cost Trends", path: "/admin/costs", icon: BarChart3 },
  { title: "Hospitals", path: "/admin/hospitals", icon: Building2 },
  { title: "Medicines", path: "/admin/medicines", icon: Pill },
  { title: "Schemes", path: "/admin/schemes", icon: Shield },
  { title: "Insurance", path: "/admin/insurance", icon: FileText },
  { title: "Users", path: "/admin/users", icon: Users },
  { title: "Audit Logs", path: "/admin/audit", icon: ClipboardList },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    navigate("/login");
  }, [navigate]);

  // Inactivity timeout
  useEffect(() => {
    const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        toast.error("Session expired due to inactivity.");
        handleLogout();
      }, INACTIVITY_TIMEOUT);
    };

    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [handleLogout]);

  useEffect(() => {
    checkIsAdmin().then((result) => {
      setIsAdmin(result);
      if (!result) {
        toast.error("Access denied. Admin privileges required.");
        navigate("/login");
      }
    });
  }, [navigate]);

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const isActive = (path: string) =>
    path === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.2 }}
        className="hidden lg:flex flex-col border-r border-border bg-sidebar-background h-screen sticky top-0 overflow-hidden"
      >
        <div className="p-4 flex items-center gap-3 border-b border-border">
          <div className="h-9 w-9 min-w-[36px] rounded-lg gradient-primary flex items-center justify-center">
            <PillIcon className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
              <h1 className="font-bold text-foreground text-sm">MediBudget</h1>
              <p className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">Admin Panel</p>
            </motion.div>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <motion.div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                whileHover={{ x: 2 }}
              >
                <item.icon className="h-4 w-4 min-w-[16px]" />
                {!collapsed && <span className="truncate">{item.title}</span>}
              </motion.div>
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-border space-y-1">
          <div className="flex items-center gap-3 px-3 py-1">
            <ThemeToggle />
            {!collapsed && <span className="text-sm text-muted-foreground">Theme</span>}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground w-full"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 w-full"
          >
            <LogOut className="h-4 w-4 min-w-[16px]" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile header */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-40 h-14 border-b border-border bg-background/95 backdrop-blur flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <PillIcon className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm">Admin</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>

        {/* Mobile nav drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden fixed inset-x-0 top-14 z-30 bg-background border-b border-border shadow-elevated p-4 space-y-1"
            >
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      isActive(item.path) ? "bg-primary/10 text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </div>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
