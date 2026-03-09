import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ShieldCheck, ShieldOff, Key, QrCode } from "lucide-react";
import { passwordSchema } from "@/lib/passwordValidation";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const SecuritySettings = () => {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [unenrolling, setUnenrolling] = useState(false);

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    checkMfaStatus();
  }, []);

  const checkMfaStatus = async () => {
    const { data } = await supabase.auth.mfa.listFactors();
    const verified = data?.totp?.find((f) => f.status === "verified");
    setMfaEnabled(!!verified);
    if (verified) setFactorId(verified.id);
  };

  const handleEnrollMFA = async () => {
    setEnrolling(true);
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "MediBudget Authenticator",
    });
    setEnrolling(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setFactorId(data.id);
    setQrCode(data.totp.qr_code);
  };

  const handleVerifyEnrollment = async () => {
    if (!factorId || verifyCode.length !== 6) {
      toast.error("Enter a valid 6-digit code");
      return;
    }
    setVerifying(true);
    const { data: challengeData, error: challengeError } =
      await supabase.auth.mfa.challenge({ factorId });
    if (challengeError) {
      setVerifying(false);
      toast.error(challengeError.message);
      return;
    }
    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code: verifyCode,
    });
    setVerifying(false);
    if (verifyError) {
      toast.error("Invalid code. Please try again.");
      return;
    }
    toast.success("MFA enabled successfully!");
    setQrCode(null);
    setVerifyCode("");
    setMfaEnabled(true);
  };

  const handleUnenrollMFA = async () => {
    if (!factorId) return;
    setUnenrolling(true);
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    setUnenrolling(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("MFA disabled");
    setMfaEnabled(false);
    setFactorId(null);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = passwordSchema.safeParse(newPassword);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setChangingPassword(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    }
  };

  return (
    <div className="space-y-6">
      {/* MFA Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account using an authenticator app.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mfaEnabled ? (
            <div className="flex items-center justify-between p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-foreground">MFA is enabled</p>
                  <p className="text-sm text-muted-foreground">Your account is protected with 2FA</p>
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <ShieldOff className="h-4 w-4" /> Disable
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Disable Two-Factor Authentication?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will reduce your account security. You can re-enable it at any time.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleUnenrollMFA} disabled={unenrolling}>
                      {unenrolling ? "Disabling..." : "Disable MFA"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : qrCode ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-4 p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground text-center">
                  Scan this QR code with your authenticator app (Google Authenticator, Microsoft Authenticator, etc.)
                </p>
                <img src={qrCode} alt="MFA QR Code" className="w-48 h-48" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Enter the 6-digit code from your app:</p>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="000000"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="text-center text-xl tracking-[0.5em] font-mono"
                />
                <Button
                  variant="hero"
                  className="w-full"
                  onClick={handleVerifyEnrollment}
                  disabled={verifying || verifyCode.length !== 6}
                >
                  {verifying ? "Verifying..." : "Verify & Enable MFA"}
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => { setQrCode(null); setFactorId(null); }}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <QrCode className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Enable MFA</p>
                  <p className="text-sm text-muted-foreground">Set up authenticator app for 2FA</p>
                </div>
              </div>
              <Button variant="default" size="sm" onClick={handleEnrollMFA} disabled={enrolling} className="gap-1">
                {enrolling ? "Setting up..." : "Set Up"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            Change Password
          </CardTitle>
          <CardDescription>Update your password. Must meet security requirements.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <PasswordStrengthMeter password={newPassword} />
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <Button type="submit" disabled={changingPassword} className="w-full">
              {changingPassword ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
