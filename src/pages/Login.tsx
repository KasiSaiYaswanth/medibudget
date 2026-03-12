import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Pill, Mail, Lock, ArrowRight, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { checkIsAdmin } from "@/lib/adminService";


const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

function getLoginState() {
  const stored = localStorage.getItem("login_rate_limit");
  if (!stored) return { attempts: 0, lockedUntil: 0 };
  try {
    return JSON.parse(stored);
  } catch {
    return { attempts: 0, lockedUntil: 0 };
  }
}

function setLoginState(attempts: number, lockedUntil: number) {
  localStorage.setItem("login_rate_limit", JSON.stringify({ attempts, lockedUntil }));
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const navigate = useNavigate();

  // Load persisted state on mount
  useEffect(() => {
    const state = getLoginState();
    setFailedAttempts(state.attempts);
    setLockedUntil(state.lockedUntil);
  }, []);

  // Countdown timer during lockout
  useEffect(() => {
    if (lockedUntil <= Date.now()) {
      setRemainingSeconds(0);
      return;
    }
    const update = () => {
      const diff = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));
      setRemainingSeconds(diff);
      if (diff <= 0) {
        setFailedAttempts(0);
        setLockedUntil(0);
        setLoginState(0, 0);
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [lockedUntil]);

  const isLocked = lockedUntil > Date.now();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) {
      toast.error(`Account locked. Try again in ${Math.ceil(remainingSeconds / 60)} minute(s).`);
      return;
    }
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        const lockTime = Date.now() + LOCKOUT_DURATION;
        setLockedUntil(lockTime);
        setLoginState(newAttempts, lockTime);
        toast.error(`Too many failed attempts. Account locked for 15 minutes.`);
      } else {
        setLoginState(newAttempts, 0);
        toast.error(`Invalid email or password. ${MAX_ATTEMPTS - newAttempts} attempt(s) remaining.`);
      }
      return;
    }

    // Success — reset rate limit
    setFailedAttempts(0);
    setLockedUntil(0);
    setLoginState(0, 0);

    // Check if MFA is enrolled
    const { data: factorsData } = await supabase.auth.mfa.listFactors();
    const hasVerifiedTotp = factorsData?.totp?.some((f) => f.status === "verified");

    if (hasVerifiedTotp) {
      setLoading(false);
      navigate("/mfa-verify");
      return;
    }

    const isAdmin = await checkIsAdmin();
    setLoading(false);

    if (isAdmin) {
      toast.success("Welcome, Admin!");
      navigate("/admin");
    } else {
      toast.success("Welcome back!");
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center">
          <Link to="/" className="flex items-center justify-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
              <Pill className="h-5 w-5 text-primary-foreground" />
            </div>
          </Link>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your MediBudget account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            {isLocked && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <ShieldAlert className="h-4 w-4 text-destructive shrink-0" />
                <p className="text-sm text-destructive">
                  Too many failed attempts. Try again in {Math.floor(remainingSeconds / 60)}:{String(remainingSeconds % 60).padStart(2, "0")}
                </p>
              </div>
            )}
            {!isLocked && failedAttempts > 0 && (
              <p className="text-sm text-destructive text-center">
                {MAX_ATTEMPTS - failedAttempts} attempt(s) remaining before lockout
              </p>
            )}
            <Button variant="hero" className="w-full" type="submit" disabled={loading || isLocked}>
              {loading ? "Signing in..." : isLocked ? "Account Locked" : "Sign In"} {!isLocked && <ArrowRight className="h-4 w-4 ml-1" />}
            </Button>
          </form>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border mt-2">
            <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground">
              Secure email-based authentication with encrypted sessions
            </p>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
