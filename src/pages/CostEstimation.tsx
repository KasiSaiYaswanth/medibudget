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
  // Andhra Pradesh
  { value: "visakhapatnam", label: "Visakhapatnam", state: "Andhra Pradesh", multiplier: 1.05 },
  { value: "vijayawada", label: "Vijayawada", state: "Andhra Pradesh", multiplier: 1.0 },
  { value: "guntur", label: "Guntur", state: "Andhra Pradesh", multiplier: 0.9 },
  { value: "nellore", label: "Nellore", state: "Andhra Pradesh", multiplier: 0.85 },
  { value: "kurnool", label: "Kurnool", state: "Andhra Pradesh", multiplier: 0.85 },
  { value: "rajahmundry", label: "Rajahmundry", state: "Andhra Pradesh", multiplier: 0.9 },
  { value: "tirupati", label: "Tirupati", state: "Andhra Pradesh", multiplier: 0.95 },
  { value: "kakinada", label: "Kakinada", state: "Andhra Pradesh", multiplier: 0.85 },
  { value: "anantapur", label: "Anantapur", state: "Andhra Pradesh", multiplier: 0.8 },
  { value: "eluru", label: "Eluru", state: "Andhra Pradesh", multiplier: 0.8 },
  { value: "ongole", label: "Ongole", state: "Andhra Pradesh", multiplier: 0.8 },
  { value: "srikakulam", label: "Srikakulam", state: "Andhra Pradesh", multiplier: 0.8 },
  { value: "amaravati", label: "Amaravati", state: "Andhra Pradesh", multiplier: 0.95 },
  // Telangana
  { value: "hyderabad", label: "Hyderabad", state: "Telangana", multiplier: 1.25 },
  { value: "warangal", label: "Warangal", state: "Telangana", multiplier: 0.9 },
  { value: "nizamabad", label: "Nizamabad", state: "Telangana", multiplier: 0.85 },
  { value: "karimnagar", label: "Karimnagar", state: "Telangana", multiplier: 0.85 },
  { value: "khammam", label: "Khammam", state: "Telangana", multiplier: 0.85 },
  { value: "mahbubnagar", label: "Mahbubnagar", state: "Telangana", multiplier: 0.8 },
  { value: "nalgonda", label: "Nalgonda", state: "Telangana", multiplier: 0.8 },
  { value: "adilabad", label: "Adilabad", state: "Telangana", multiplier: 0.8 },
  { value: "secunderabad", label: "Secunderabad", state: "Telangana", multiplier: 1.2 },
  { value: "rangareddy", label: "Ranga Reddy", state: "Telangana", multiplier: 1.1 },
  // Tamil Nadu
  { value: "chennai", label: "Chennai", state: "Tamil Nadu", multiplier: 1.3 },
  { value: "coimbatore", label: "Coimbatore", state: "Tamil Nadu", multiplier: 1.1 },
  { value: "madurai", label: "Madurai", state: "Tamil Nadu", multiplier: 1.0 },
  { value: "tiruchirappalli", label: "Tiruchirappalli", state: "Tamil Nadu", multiplier: 0.95 },
  { value: "salem", label: "Salem", state: "Tamil Nadu", multiplier: 0.9 },
  { value: "tirunelveli", label: "Tirunelveli", state: "Tamil Nadu", multiplier: 0.9 },
  { value: "vellore", label: "Vellore", state: "Tamil Nadu", multiplier: 1.0 },
  // Karnataka
  { value: "bangalore", label: "Bengaluru", state: "Karnataka", multiplier: 1.35 },
  { value: "mysuru", label: "Mysuru", state: "Karnataka", multiplier: 1.0 },
  { value: "mangalore", label: "Mangaluru", state: "Karnataka", multiplier: 1.05 },
  { value: "hubli", label: "Hubli-Dharwad", state: "Karnataka", multiplier: 0.9 },
  { value: "belgaum", label: "Belagavi", state: "Karnataka", multiplier: 0.9 },
  // Kerala
  { value: "thiruvananthapuram", label: "Thiruvananthapuram", state: "Kerala", multiplier: 1.1 },
  { value: "kochi", label: "Kochi", state: "Kerala", multiplier: 1.15 },
  { value: "kozhikode", label: "Kozhikode", state: "Kerala", multiplier: 1.0 },
  { value: "thrissur", label: "Thrissur", state: "Kerala", multiplier: 0.95 },
  // Maharashtra
  { value: "mumbai", label: "Mumbai", state: "Maharashtra", multiplier: 1.6 },
  { value: "pune", label: "Pune", state: "Maharashtra", multiplier: 1.25 },
  { value: "nagpur", label: "Nagpur", state: "Maharashtra", multiplier: 1.0 },
  { value: "nashik", label: "Nashik", state: "Maharashtra", multiplier: 0.95 },
  { value: "aurangabad", label: "Chhatrapati Sambhajinagar", state: "Maharashtra", multiplier: 0.95 },
  // Delhi NCR
  { value: "delhi", label: "New Delhi", state: "Delhi", multiplier: 1.5 },
  { value: "noida", label: "Noida", state: "Uttar Pradesh", multiplier: 1.3 },
  { value: "gurgaon", label: "Gurugram", state: "Haryana", multiplier: 1.4 },
  { value: "faridabad", label: "Faridabad", state: "Haryana", multiplier: 1.1 },
  { value: "ghaziabad", label: "Ghaziabad", state: "Uttar Pradesh", multiplier: 1.15 },
  // Uttar Pradesh
  { value: "lucknow", label: "Lucknow", state: "Uttar Pradesh", multiplier: 0.95 },
  { value: "kanpur", label: "Kanpur", state: "Uttar Pradesh", multiplier: 0.9 },
  { value: "varanasi", label: "Varanasi", state: "Uttar Pradesh", multiplier: 0.9 },
  { value: "agra", label: "Agra", state: "Uttar Pradesh", multiplier: 0.9 },
  { value: "prayagraj", label: "Prayagraj", state: "Uttar Pradesh", multiplier: 0.85 },
  // West Bengal
  { value: "kolkata", label: "Kolkata", state: "West Bengal", multiplier: 1.15 },
  // Gujarat
  { value: "ahmedabad", label: "Ahmedabad", state: "Gujarat", multiplier: 1.15 },
  { value: "surat", label: "Surat", state: "Gujarat", multiplier: 1.1 },
  { value: "vadodara", label: "Vadodara", state: "Gujarat", multiplier: 1.0 },
  { value: "rajkot", label: "Rajkot", state: "Gujarat", multiplier: 0.95 },
  // Rajasthan
  { value: "jaipur", label: "Jaipur", state: "Rajasthan", multiplier: 1.05 },
  { value: "jodhpur", label: "Jodhpur", state: "Rajasthan", multiplier: 0.9 },
  { value: "udaipur", label: "Udaipur", state: "Rajasthan", multiplier: 0.9 },
  // Madhya Pradesh
  { value: "bhopal", label: "Bhopal", state: "Madhya Pradesh", multiplier: 0.95 },
  { value: "indore", label: "Indore", state: "Madhya Pradesh", multiplier: 1.0 },
  // Punjab & Haryana
  { value: "chandigarh", label: "Chandigarh", state: "Chandigarh", multiplier: 1.15 },
  { value: "ludhiana", label: "Ludhiana", state: "Punjab", multiplier: 1.0 },
  { value: "amritsar", label: "Amritsar", state: "Punjab", multiplier: 0.95 },
  // Others
  { value: "patna", label: "Patna", state: "Bihar", multiplier: 0.85 },
  { value: "ranchi", label: "Ranchi", state: "Jharkhand", multiplier: 0.85 },
  { value: "bhubaneswar", label: "Bhubaneswar", state: "Odisha", multiplier: 0.9 },
  { value: "guwahati", label: "Guwahati", state: "Assam", multiplier: 0.9 },
  { value: "dehradun", label: "Dehradun", state: "Uttarakhand", multiplier: 1.0 },
  { value: "shimla", label: "Shimla", state: "Himachal Pradesh", multiplier: 0.95 },
  { value: "raipur", label: "Raipur", state: "Chhattisgarh", multiplier: 0.85 },
  { value: "panaji", label: "Panaji", state: "Goa", multiplier: 1.1 },
  { value: "imphal", label: "Imphal", state: "Manipur", multiplier: 0.85 },
  { value: "shillong", label: "Shillong", state: "Meghalaya", multiplier: 0.85 },
  { value: "aizawl", label: "Aizawl", state: "Mizoram", multiplier: 0.85 },
  { value: "kohima", label: "Kohima", state: "Nagaland", multiplier: 0.85 },
  { value: "gangtok", label: "Gangtok", state: "Sikkim", multiplier: 0.9 },
  { value: "agartala", label: "Agartala", state: "Tripura", multiplier: 0.8 },
  { value: "itanagar", label: "Itanagar", state: "Arunachal Pradesh", multiplier: 0.85 },
  { value: "srinagar", label: "Srinagar", state: "Jammu & Kashmir", multiplier: 0.95 },
  { value: "jammu", label: "Jammu", state: "Jammu & Kashmir", multiplier: 0.9 },
];

// Group cities by state for better UX
const cityGroups = cities.reduce((acc, city) => {
  if (!acc[city.state]) acc[city.state] = [];
  acc[city.state].push(city);
  return acc;
}, {} as Record<string, typeof cities>);

const sortedStates = Object.keys(cityGroups).sort();

const hospitalTypes = [
  { value: "government", label: "Government Hospital", multiplier: 0.3 },
  { value: "private", label: "Private Hospital", multiplier: 1.0 },
  { value: "corporate", label: "Corporate Hospital", multiplier: 1.8 },
  { value: "trust", label: "Trust / Charitable Hospital", multiplier: 0.5 },
];

const conditions = [
  { value: "fever", label: "Fever / Common Cold", baseCost: { consultation: 300, tests: 500, medicines: 200, treatment: 0 } },
  { value: "fracture", label: "Bone Fracture", baseCost: { consultation: 500, tests: 2000, medicines: 800, treatment: 15000 } },
  { value: "cardiac", label: "Cardiac Check-up", baseCost: { consultation: 800, tests: 5000, medicines: 1500, treatment: 0 } },
  { value: "bypass", label: "Heart Bypass Surgery", baseCost: { consultation: 1500, tests: 15000, medicines: 5000, treatment: 200000 } },
  { value: "angioplasty", label: "Angioplasty / Stent", baseCost: { consultation: 1000, tests: 10000, medicines: 3000, treatment: 150000 } },
  { value: "dental", label: "Dental Treatment", baseCost: { consultation: 400, tests: 800, medicines: 300, treatment: 5000 } },
  { value: "eye", label: "Eye Check-up / Cataract", baseCost: { consultation: 500, tests: 1500, medicines: 600, treatment: 25000 } },
  { value: "maternity", label: "Normal Delivery", baseCost: { consultation: 1000, tests: 5000, medicines: 2000, treatment: 25000 } },
  { value: "csection", label: "C-Section Delivery", baseCost: { consultation: 1500, tests: 6000, medicines: 3000, treatment: 50000 } },
  { value: "kidney", label: "Kidney Treatment / Dialysis", baseCost: { consultation: 800, tests: 8000, medicines: 3000, treatment: 50000 } },
  { value: "transplant", label: "Kidney Transplant", baseCost: { consultation: 2000, tests: 25000, medicines: 10000, treatment: 500000 } },
  { value: "skin", label: "Skin / Dermatology", baseCost: { consultation: 400, tests: 1000, medicines: 500, treatment: 2000 } },
  { value: "cancer", label: "Cancer Treatment (per cycle)", baseCost: { consultation: 1500, tests: 15000, medicines: 20000, treatment: 50000 } },
  { value: "appendix", label: "Appendicitis Surgery", baseCost: { consultation: 500, tests: 3000, medicines: 1000, treatment: 30000 } },
  { value: "hernia", label: "Hernia Surgery", baseCost: { consultation: 500, tests: 3000, medicines: 1000, treatment: 35000 } },
  { value: "knee", label: "Knee Replacement", baseCost: { consultation: 1000, tests: 8000, medicines: 3000, treatment: 200000 } },
  { value: "spine", label: "Spine Surgery", baseCost: { consultation: 1500, tests: 10000, medicines: 5000, treatment: 300000 } },
  { value: "diabetes", label: "Diabetes Management (monthly)", baseCost: { consultation: 500, tests: 2000, medicines: 1500, treatment: 0 } },
  { value: "thyroid", label: "Thyroid Treatment", baseCost: { consultation: 400, tests: 1500, medicines: 500, treatment: 0 } },
  { value: "neuro", label: "Neurological Consultation", baseCost: { consultation: 800, tests: 5000, medicines: 2000, treatment: 0 } },
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
      city: `${c.label}, ${c.state}`,
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
                    <SelectContent className="max-h-80">
                      {sortedStates.map((state) => (
                        <div key={state}>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 sticky top-0">
                            {state}
                          </div>
                          {cityGroups[state].map((c) => (
                            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Locality (optional) e.g. Gachibowli, Banjara Hills..."
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
