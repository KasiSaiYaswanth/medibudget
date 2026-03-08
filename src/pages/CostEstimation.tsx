import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, MapPin, Building2, Stethoscope, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CostResults from "@/components/estimation/CostResults";

const cities = [
  { value: "mumbai", label: "Mumbai", multiplier: 1.5 },
  { value: "delhi", label: "Delhi", multiplier: 1.4 },
  { value: "bangalore", label: "Bangalore", multiplier: 1.3 },
  { value: "chennai", label: "Chennai", multiplier: 1.2 },
  { value: "hyderabad", label: "Hyderabad", multiplier: 1.15 },
  { value: "kolkata", label: "Kolkata", multiplier: 1.1 },
  { value: "pune", label: "Pune", multiplier: 1.2 },
  { value: "jaipur", label: "Jaipur", multiplier: 1.0 },
  { value: "lucknow", label: "Lucknow", multiplier: 0.9 },
  { value: "ahmedabad", label: "Ahmedabad", multiplier: 1.1 },
];

const hospitalTypes = [
  { value: "government", label: "Government Hospital", multiplier: 0.3 },
  { value: "private", label: "Private Hospital", multiplier: 1.0 },
  { value: "corporate", label: "Corporate Hospital", multiplier: 1.8 },
];

const conditions = [
  { value: "fever", label: "Fever / Common Cold", baseCost: { consultation: 300, tests: 500, medicines: 200, treatment: 0 } },
  { value: "fracture", label: "Bone Fracture", baseCost: { consultation: 500, tests: 2000, medicines: 800, treatment: 15000 } },
  { value: "cardiac", label: "Cardiac Check-up", baseCost: { consultation: 800, tests: 5000, medicines: 1500, treatment: 0 } },
  { value: "dental", label: "Dental Treatment", baseCost: { consultation: 400, tests: 800, medicines: 300, treatment: 5000 } },
  { value: "eye", label: "Eye Check-up / Surgery", baseCost: { consultation: 500, tests: 1500, medicines: 600, treatment: 25000 } },
  { value: "maternity", label: "Maternity / Delivery", baseCost: { consultation: 1000, tests: 5000, medicines: 2000, treatment: 35000 } },
  { value: "kidney", label: "Kidney Treatment", baseCost: { consultation: 800, tests: 8000, medicines: 3000, treatment: 50000 } },
  { value: "skin", label: "Skin / Dermatology", baseCost: { consultation: 400, tests: 1000, medicines: 500, treatment: 2000 } },
];

export interface EstimationResult {
  condition: string;
  city: string;
  hospitalType: string;
  consultation: number;
  tests: number;
  medicines: number;
  treatment: number;
  total: number;
  cityMultiplier: number;
  hospitalMultiplier: number;
}

const CostEstimation = () => {
  const [step, setStep] = useState(1);
  const [city, setCity] = useState("");
  const [hospitalType, setHospitalType] = useState("");
  const [condition, setCondition] = useState("");
  const [locality, setLocality] = useState("");
  const [result, setResult] = useState<EstimationResult | null>(null);

  const totalSteps = 3;

  const calculate = () => {
    const c = cities.find((x) => x.value === city);
    const h = hospitalTypes.find((x) => x.value === hospitalType);
    const cond = conditions.find((x) => x.value === condition);

    if (!c || !h || !cond) return;

    const cm = c.multiplier;
    const hm = h.multiplier;

    const consultation = Math.round(cond.baseCost.consultation * cm * hm);
    const tests = Math.round(cond.baseCost.tests * cm * hm);
    const medicines = Math.round(cond.baseCost.medicines * cm * hm);
    const treatment = Math.round(cond.baseCost.treatment * cm * hm);
    const total = consultation + tests + medicines + treatment;

    setResult({
      condition: cond.label,
      city: c.label,
      hospitalType: h.label,
      consultation,
      tests,
      medicines,
      treatment,
      total,
      cityMultiplier: cm,
      hospitalMultiplier: hm,
    });
    setStep(4);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Link to="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Cost Estimation</h1>
          <p className="text-muted-foreground mt-1">Estimate your healthcare costs in 3 simple steps.</p>
        </div>

        {step <= totalSteps && (
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  s <= step ? "gradient-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Location</CardTitle>
                      <CardDescription>Select your city and locality</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                    <SelectContent>
                      {cities.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Locality (optional)"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                  />
                  <Button variant="hero" className="w-full" onClick={() => setStep(2)} disabled={!city}>
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Hospital Type</CardTitle>
                      <CardDescription>Choose the type of healthcare facility</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {hospitalTypes.map((h) => (
                    <button
                      key={h.value}
                      onClick={() => setHospitalType(h.value)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        hospitalType === h.value
                          ? "border-primary bg-secondary"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <span className="font-medium text-foreground">{h.label}</span>
                      <span className="block text-xs text-muted-foreground mt-0.5">
                        Cost multiplier: {h.multiplier}x
                      </span>
                    </button>
                  ))}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                    <Button variant="hero" onClick={() => setStep(3)} disabled={!hospitalType} className="flex-1">
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
                      <Stethoscope className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Condition / Treatment</CardTitle>
                      <CardDescription>What treatment are you looking for?</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Select value={condition} onValueChange={setCondition}>
                    <SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger>
                    <SelectContent>
                      {conditions.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
                    <Button variant="hero" onClick={calculate} disabled={!condition} className="flex-1">
                      <Calculator className="h-4 w-4 mr-1" /> Calculate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 4 && result && (
            <motion.div key="step4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <CostResults result={result} onReset={() => { setStep(1); setResult(null); }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default CostEstimation;
