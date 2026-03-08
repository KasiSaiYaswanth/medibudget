import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ShieldCheck, CheckCircle2, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface SchemeResult {
  name: string;
  eligible: boolean;
  coverage: string;
  reason: string;
}

const schemes = [
  {
    name: "Ayushman Bharat (PM-JAY)",
    maxIncome: 300000,
    coverage: "₹5,00,000 per family per year",
    description: "Free secondary and tertiary care at empanelled hospitals",
  },
  {
    name: "ESI (Employee State Insurance)",
    maxIncome: 252000,
    coverage: "Full medical coverage",
    description: "For organized sector employees with salary up to ₹21,000/month",
  },
  {
    name: "CGHS (Central Gov Health Scheme)",
    maxIncome: 0,
    coverage: "Comprehensive healthcare",
    description: "For central government employees and pensioners",
  },
  {
    name: "State Health Insurance",
    maxIncome: 500000,
    coverage: "₹1,50,000 - ₹5,00,000",
    description: "Various state-sponsored health insurance programs",
  },
];

const SchemeChecker = () => {
  const [income, setIncome] = useState("");
  const [hasRationCard, setHasRationCard] = useState("");
  const [employment, setEmployment] = useState("");
  const [state, setState] = useState("");
  const [results, setResults] = useState<SchemeResult[] | null>(null);

  const checkEligibility = () => {
    const annualIncome = parseInt(income) || 0;
    const isGovEmployee = employment === "government";

    const eligibilityResults: SchemeResult[] = [
      {
        name: "Ayushman Bharat (PM-JAY)",
        eligible: annualIncome <= 300000 && hasRationCard === "yes",
        coverage: "₹5,00,000 per family/year",
        reason:
          annualIncome <= 300000 && hasRationCard === "yes"
            ? "Income below ₹3L and ration card holder"
            : annualIncome > 300000
            ? "Income exceeds ₹3,00,000 limit"
            : "Ration card required for eligibility",
      },
      {
        name: "ESI Scheme",
        eligible: employment === "private" && annualIncome <= 252000,
        coverage: "Full medical coverage",
        reason:
          employment === "private" && annualIncome <= 252000
            ? "Private sector employee with qualifying salary"
            : "Available for organized sector employees with salary ≤ ₹21,000/month",
      },
      {
        name: "CGHS",
        eligible: isGovEmployee,
        coverage: "Comprehensive healthcare",
        reason: isGovEmployee
          ? "Central government employee – eligible"
          : "Only for central government employees and pensioners",
      },
      {
        name: `${state || "State"} Health Insurance`,
        eligible: annualIncome <= 500000,
        coverage: "₹1,50,000 - ₹5,00,000",
        reason:
          annualIncome <= 500000
            ? "Income within state scheme threshold"
            : "Income exceeds state scheme limit",
      },
    ];

    setResults(eligibilityResults);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Link to="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Scheme Eligibility</h1>
          <p className="text-muted-foreground mt-1">
            Check your eligibility for government health schemes.
          </p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Your Information
            </CardTitle>
            <CardDescription>Fill in your details to check eligibility</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Annual Income (₹)</label>
              <Input
                type="number"
                placeholder="e.g. 250000"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Ration Card</label>
              <Select value={hasRationCard} onValueChange={setHasRationCard}>
                <SelectTrigger><SelectValue placeholder="Do you have a ration card?" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Employment Type</label>
              <Select value={employment} onValueChange={setEmployment}>
                <SelectTrigger><SelectValue placeholder="Select employment type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="government">Government Employee</SelectItem>
                  <SelectItem value="private">Private Sector</SelectItem>
                  <SelectItem value="self-employed">Self-Employed</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">State</label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                <SelectContent>
                  {["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Telangana", "West Bengal", "Rajasthan", "UP", "Gujarat", "Kerala"].map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button variant="hero" className="w-full" onClick={checkEligibility} disabled={!income || !employment}>
              Check Eligibility
            </Button>
          </CardContent>
        </Card>

        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <h2 className="text-lg font-semibold text-foreground">Results</h2>
              {results.map((r, i) => (
                <motion.div
                  key={r.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className={`shadow-card ${r.eligible ? "border-primary/30" : "border-border"}`}>
                    <CardContent className="p-4 flex items-start gap-3">
                      {r.eligible ? (
                        <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <h3 className="font-semibold text-foreground">{r.name}</h3>
                        <p className="text-sm text-muted-foreground">{r.reason}</p>
                        {r.eligible && (
                          <p className="text-sm font-medium text-primary mt-1">
                            Coverage: {r.coverage}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default SchemeChecker;
