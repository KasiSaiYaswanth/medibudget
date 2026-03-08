import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Download, Pill, Smartphone, CheckCircle2, Share, MoreVertical } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Detect iOS
    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setIsInstalled(true));

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center">
              <Pill className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Install MediBudget</CardTitle>
          <CardDescription>
            Get the full app experience — works offline, launches instantly from your home screen.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {isInstalled ? (
            <div className="text-center space-y-3">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
              <p className="text-foreground font-medium">MediBudget is installed!</p>
              <p className="text-sm text-muted-foreground">
                You can find it on your home screen.
              </p>
              <Link to="/dashboard">
                <Button variant="hero" className="w-full mt-2">Open Dashboard</Button>
              </Link>
            </div>
          ) : deferredPrompt ? (
            <div className="space-y-4">
              <Button variant="hero" className="w-full gap-2" onClick={handleInstall}>
                <Download className="h-4 w-4" /> Install App
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Free • No app store needed • ~2MB
              </p>
            </div>
          ) : isIOS ? (
            <div className="space-y-4">
              <p className="text-sm text-foreground font-medium text-center">
                To install on iPhone/iPad:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary">
                  <Share className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">1. Tap Share</p>
                    <p className="text-xs text-muted-foreground">
                      Tap the Share icon at the bottom of Safari
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary">
                  <Smartphone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">2. Add to Home Screen</p>
                    <p className="text-xs text-muted-foreground">
                      Scroll down and tap "Add to Home Screen"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-foreground font-medium text-center">
                To install on Android:
              </p>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary">
                <MoreVertical className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Tap ⋮ → Install app</p>
                  <p className="text-xs text-muted-foreground">
                    Open the browser menu and select "Install app" or "Add to Home screen"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="border-t border-border pt-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Why install?</p>
            {[
              "Works offline with cached medical data",
              "Instant launch from home screen",
              "Get cost estimates without internet",
              "Secure & private — your data stays on device",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                {f}
              </div>
            ))}
          </div>

          <p className="text-center">
            <Link to="/" className="text-sm text-primary hover:underline">
              Continue in browser instead
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Install;
