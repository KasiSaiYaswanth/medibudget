import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

/**
 * Handles Google OAuth sign-in across both Lovable domains and custom domains (e.g. Vercel).
 * On custom domains, bypasses the Lovable auth bridge and uses Supabase OAuth directly
 * with skipBrowserRedirect to avoid 404 errors.
 */
export async function signInWithGoogle(): Promise<{ error?: Error }> {
  const hostname = window.location.hostname;
  const isLovableDomain =
    hostname.includes("lovable.app") ||
    hostname.includes("lovableproject.com") ||
    hostname === "localhost";

  if (isLovableDomain) {
    // Use Lovable managed auth bridge
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result?.error) {
      return { error: result.error instanceof Error ? result.error : new Error(String(result.error)) };
    }
    return {};
  }

  // Custom domain: bypass auth bridge, use Supabase directly
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    return { error };
  }

  if (data?.url) {
    // Validate the OAuth URL before redirecting
    const oauthUrl = new URL(data.url);
    const allowedHosts = ["accounts.google.com"];
    if (!allowedHosts.some((host) => oauthUrl.hostname === host)) {
      return { error: new Error("Invalid OAuth redirect URL") };
    }
    window.location.href = data.url;
  }

  return {};
}
