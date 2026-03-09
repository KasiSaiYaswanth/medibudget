import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/adminService";
import { toast } from "sonner";

const PUBLIC_ROUTES = ["/", "/login", "/signup", "/privacy", "/terms", "/disclaimer", "/contact", "/faq", "/install"];

export const AuthRedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          // Only redirect if user is on a public/auth page
          if (PUBLIC_ROUTES.includes(location.pathname)) {
            try {
              const isAdmin = await checkIsAdmin();
              if (isAdmin) {
                toast.success("Welcome, Admin!");
                navigate("/admin", { replace: true });
              } else {
                toast.success("Welcome back!");
                navigate("/dashboard", { replace: true });
              }
            } catch {
              navigate("/dashboard", { replace: true });
            }
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  return null;
};
