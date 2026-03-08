import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  SwitchCamera,
  X,
  Loader2,
  ScanLine,
  FlipHorizontal,
  Focus,
  Barcode,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export type ScanMode = "front" | "back" | "barcode";

interface Props {
  onScanResult: (result: any, capturedImage: string) => void;
  onClose: () => void;
}

const SCAN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/medicine-scan`;

const scanModeConfig: Record<ScanMode, { label: string; icon: any; hint: string }> = {
  front: {
    label: "Front Side",
    icon: FileText,
    hint: "Align the medicine name within the frame",
  },
  back: {
    label: "Back Side",
    icon: FlipHorizontal,
    hint: "Show the composition & dosage details",
  },
  barcode: {
    label: "Barcode / QR",
    icon: Barcode,
    hint: "Point at the barcode or QR code",
  },
};

const CameraScanner = ({ onScanResult, onClose }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<ScanMode>("front");
  const [isScanning, setIsScanning] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setCameraReady(true);
      }
    } catch (err) {
      toast.error("Camera access denied. Please allow camera permissions.");
      onClose();
    }
  }, [facingMode, onClose]);

  useEffect(() => {
    startCamera();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [startCamera]);

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsScanning(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw and apply basic image enhancement
    ctx.drawImage(video, 0, 0);

    // Increase contrast slightly for better OCR
    ctx.filter = "contrast(1.2) brightness(1.05)";
    ctx.drawImage(video, 0, 0);
    ctx.filter = "none";

    const imageBase64 = canvas.toDataURL("image/jpeg", 0.85).split(",")[1];
    const capturedImage = canvas.toDataURL("image/jpeg", 0.85);

    try {
      const resp = await fetch(SCAN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          imageBase64,
          scanMode: mode === "front" ? "front" : mode === "back" ? "back" : "barcode",
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Scan failed" }));
        if (resp.status === 429) toast.error("Too many requests. Please wait.");
        else if (resp.status === 402) toast.error("AI credits exhausted.");
        else toast.error(err.error || "Scan failed.");
        return;
      }

      const result = await resp.json();

      if (!result.is_medicine) {
        toast.error("No medicine detected in the image. Try again.");
        return;
      }

      toast.success(`Detected: ${result.medicine_name || "Medicine"}`);
      onScanResult(result, capturedImage);
    } catch (e) {
      console.error(e);
      toast.error("Scan failed. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const currentMode = scanModeConfig[mode];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-3"
    >
      <Card className="shadow-elevated overflow-hidden">
        <CardContent className="p-0 relative">
          {/* Camera View */}
          <div className="relative bg-black rounded-t-lg overflow-hidden" style={{ aspectRatio: "4/3" }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Scan Frame Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-[75%] h-[55%]">
                {/* Corner markers */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-3 border-l-3 border-primary rounded-tl-lg" style={{ borderWidth: "3px" }} />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-3 border-r-3 border-primary rounded-tr-lg" style={{ borderWidth: "3px" }} />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-3 border-l-3 border-primary rounded-bl-lg" style={{ borderWidth: "3px" }} />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-3 border-r-3 border-primary rounded-br-lg" style={{ borderWidth: "3px" }} />

                {/* Scanning line animation */}
                {isScanning && (
                  <motion.div
                    className="absolute left-0 right-0 h-0.5 bg-primary/80"
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
              </div>
            </div>

            {/* Hint text */}
            <div className="absolute bottom-3 left-0 right-0 text-center">
              <span className="bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                {isScanning ? "Analyzing image..." : currentMode.hint}
              </span>
            </div>

            {/* Top controls */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
              <Badge className="bg-black/40 text-white backdrop-blur-sm border-0 text-xs">
                <currentMode.icon className="h-3 w-3 mr-1" />
                {currentMode.label}
              </Badge>
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm"
                onClick={toggleCamera}
              >
                <SwitchCamera className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="p-4 space-y-3">
            {/* Mode Selection */}
            <div className="flex gap-2">
              {(Object.keys(scanModeConfig) as ScanMode[]).map((m) => {
                const cfg = scanModeConfig[m];
                return (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                      mode === m
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <cfg.icon className="h-3.5 w-3.5" />
                    {cfg.label}
                  </button>
                );
              })}
            </div>

            {/* Capture Button */}
            <Button
              variant="hero"
              className="w-full"
              onClick={captureAndScan}
              disabled={isScanning || !cameraReady}
            >
              {isScanning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Scanning & Analyzing...
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  Capture & Scan
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />
    </motion.div>
  );
};

export default CameraScanner;
