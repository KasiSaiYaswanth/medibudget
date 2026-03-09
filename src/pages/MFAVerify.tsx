import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Pill, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/adminService";
import { toast } from "sonner";

interface MFAVerifyProps {
  onVerified?: () => void;
}

const MFAVerify = ({ onVerified }: MFAVerifyProps) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const getFactors = async () => {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (data?.totp && data.totp.length > 0) {
        const verifiedFactor = data.totp.find((f) => f.status === "verified");
        if (verifiedFactor) {
          setFactorId(verifiedFactor.id);
        }
      }
    };
    getFactors();
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || code.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }
    if (attempts >= 3) {
      toast.error("Too many failed attempts. Please sign in again.");
      await supabase.auth.signOut();
      navigate("/login");
      return;
    }
    if (!factorId) {
      toast.error("MFA factor not found");
      return;
    }

    setLoading(true);
    const { data: challengeData, error: challengeError } =
      await supabase.auth.mfa.challenge({ factorId });

    if (challengeError) {
      setLoading(false);
      toast.error(challengeError.message);
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code,
    });

    setLoading(false);

    if (verifyError) {
      setAttempts((a) => a + 1);
      const remaining = 3 - (attempts + 1);
      if (remaining <= 0) {
        toast.error("Too many failed attempts. Please sign in again.");
        await supabase.auth.signOut();
        navigate("/login");
      } else {
        toast.error(`Invalid code. ${remaining} attempt(s) remaining.`);
      }
      setCode("");
      return;
    }

    toast.success("Verification successful!");
    onVerified?.();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
          <CardDescription>
            Enter the 6-digit code from your authenticator app
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="text-center text-2xl tracking-[0.5em] font-mono"
              autoFocus
            />
            {attempts > 0 && attempts < 3 && (
              <p className="text-sm text-destructive text-center">
                {3 - attempts} attempt(s) remaining
              </p>
            )}
            <Button variant="hero" className="w-full" type="submit" disabled={loading || !factorId}>
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Open your authenticator app to find your verification code.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MFAVerify;
