import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Camera, Search, Pill, AlertTriangle, Info, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface MedicineInfo {
  name: string;
  generic: string;
  uses: string[];
  sideEffects: string[];
  dosage: string;
  warnings: string[];
  price: string;
}

// Simulated medicine database
const medicineDB: Record<string, MedicineInfo> = {
  paracetamol: {
    name: "Paracetamol 500mg",
    generic: "Acetaminophen",
    uses: ["Fever", "Headache", "Body pain", "Common cold"],
    sideEffects: ["Nausea", "Allergic reactions (rare)", "Liver damage (overdose)"],
    dosage: "1-2 tablets every 4-6 hours. Max 8 tablets/day.",
    warnings: ["Do not exceed recommended dose", "Avoid with alcohol", "Consult doctor if symptoms persist beyond 3 days"],
    price: "₹15 - ₹30 per strip",
  },
  amoxicillin: {
    name: "Amoxicillin 500mg",
    generic: "Amoxicillin Trihydrate",
    uses: ["Bacterial infections", "Ear infections", "Throat infections", "UTI"],
    sideEffects: ["Diarrhea", "Nausea", "Skin rash", "Vomiting"],
    dosage: "1 capsule every 8 hours for 5-7 days",
    warnings: ["Complete full course", "Prescription required", "Avoid if allergic to penicillin"],
    price: "₹50 - ₹120 per strip",
  },
  omeprazole: {
    name: "Omeprazole 20mg",
    generic: "Omeprazole",
    uses: ["Acidity", "Gastric ulcers", "GERD", "Heartburn"],
    sideEffects: ["Headache", "Stomach pain", "Diarrhea", "Nausea"],
    dosage: "1 capsule daily before breakfast",
    warnings: ["Do not use long-term without supervision", "May interact with blood thinners"],
    price: "₹30 - ₹80 per strip",
  },
  metformin: {
    name: "Metformin 500mg",
    generic: "Metformin Hydrochloride",
    uses: ["Type 2 Diabetes", "PCOS", "Insulin resistance"],
    sideEffects: ["Nausea", "Diarrhea", "Metallic taste", "Vitamin B12 deficiency"],
    dosage: "1 tablet twice daily with meals",
    warnings: ["Prescription required", "Monitor kidney function", "Avoid alcohol"],
    price: "₹20 - ₹60 per strip",
  },
  azithromycin: {
    name: "Azithromycin 500mg",
    generic: "Azithromycin Dihydrate",
    uses: ["Respiratory infections", "Skin infections", "Ear infections", "STIs"],
    sideEffects: ["Diarrhea", "Nausea", "Abdominal pain", "Headache"],
    dosage: "1 tablet daily for 3 days",
    warnings: ["Prescription required", "Complete full course", "Avoid antacids within 2 hours"],
    price: "₹60 - ₹150 per strip",
  },
};

const MedicineScanner = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<MedicineInfo | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [searching, setSearching] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const searchMedicine = (q: string) => {
    setSearching(true);
    setTimeout(() => {
      const key = q.toLowerCase().trim();
      const found = Object.keys(medicineDB).find(
        (k) => key.includes(k) || medicineDB[k].name.toLowerCase().includes(key)
      );
      setResult(found ? medicineDB[found] : null);
      setSearching(false);
      if (!found) {
        // Show a default result for demo
        setResult({
          name: q,
          generic: "Not found in database",
          uses: ["Please consult a pharmacist"],
          sideEffects: ["Data not available"],
          dosage: "Consult doctor",
          warnings: ["Always verify with a healthcare professional"],
          price: "Price not available",
        });
      }
    }, 800);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) searchMedicine(query);
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setShowCamera(false);
    }
  };

  const captureAndScan = () => {
    // Simulate OCR scan result
    setShowCamera(false);
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
    }
    setQuery("Paracetamol 500mg");
    searchMedicine("paracetamol");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Link to="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Medicine Scanner</h1>
          <p className="text-muted-foreground mt-1">
            Search or scan any medicine to get detailed information and pricing.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Search or Scan</CardTitle>
              <CardDescription>Enter medicine name or use your camera to scan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="e.g. Paracetamol, Amoxicillin..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit" disabled={searching}>
                  {searching ? "..." : "Search"}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">or</div>

              <Button
                variant="outline"
                className="w-full"
                onClick={startCamera}
              >
                <Camera className="h-4 w-4 mr-2" />
                Scan Medicine Strip
              </Button>

              {showCamera && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="relative rounded-xl overflow-hidden bg-foreground/5"
                >
                  <video ref={videoRef} autoPlay playsInline className="w-full rounded-xl" />
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <Button onClick={captureAndScan} variant="hero">
                      Capture & Scan
                    </Button>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2">
                <p className="col-span-2 text-xs text-muted-foreground mb-1">Quick search:</p>
                {Object.keys(medicineDB).map((med) => (
                  <Button
                    key={med}
                    variant="secondary"
                    size="sm"
                    className="text-xs capitalize"
                    onClick={() => { setQuery(med); searchMedicine(med); }}
                  >
                    {med}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                key={result.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="shadow-elevated border-primary/20">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
                        <Pill className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{result.name}</CardTitle>
                        <CardDescription>{result.generic}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground flex items-center gap-1 mb-2">
                        <Info className="h-4 w-4 text-primary" /> Uses
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.uses.map((u) => (
                          <span key={u} className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">
                            {u}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">💊 Dosage</h4>
                      <p className="text-sm text-muted-foreground">{result.dosage}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">⚠️ Side Effects</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {result.sideEffects.map((s) => (
                          <li key={s} className="flex items-start gap-2">
                            <span className="text-destructive mt-0.5">•</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-foreground flex items-center gap-1 mb-2">
                        <AlertTriangle className="h-4 w-4 text-destructive" /> Warnings
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {result.warnings.map((w) => (
                          <li key={w} className="flex items-start gap-2">
                            <span className="text-destructive mt-0.5">•</span> {w}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">Estimated Price</span>
                        <span className="text-sm font-bold text-primary">{result.price}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MedicineScanner;
