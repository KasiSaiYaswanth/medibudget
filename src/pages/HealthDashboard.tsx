import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Activity,
  Calculator,
  Sparkles,
  Shield,
  ShieldCheck,
  TrendingUp,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CostChart from "@/components/health-dashboard/CostChart";
import InsurancePieChart from "@/components/health-dashboard/InsurancePieChart";
import SymptomHistory from "@/components/health-dashboard/SymptomHistory";
import ActivityTimeline, { type ActivityItem } from "@/components/health-dashboard/ActivityTimeline";
import { supabase } from "@/integrations/supabase/client";
import { getNotifications } from "@/lib/notificationService";

interface Estimation {
  id: string;
  date: string;
  condition: string;
  city: string;
  hospitalType: string;
  total: number;
}

interface SymptomRecord {
  id: string;
  date: string;
  symptoms: string;
  severity?: string;
}

const HealthDashboard = () => {
  const [userName, setUserName] = useState("there");
  const [estimations, setEstimations] = useState<Estimation[]>([]);
  const [symptomRecords, setSymptomRecords] = useState<SymptomRecord[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [insuranceData, setInsuranceData] = useState({ total: 0, coverage: 60 });

  useEffect(() => {
    // Get user name
    supabase.auth.getUser().then(({ data }) => {
      const name = data.user?.user_metadata?.full_name;
      if (name) setUserName(name.split(" ")[0]);
    });

    // Load estimation history
    try {
      const history: Estimation[] = JSON.parse(localStorage.getItem("estimationHistory") || "[]");
      setEstimations(history);

      // Derive insurance data from estimations
      const totalCost = history.reduce((s, e) => s + (e.total || 0), 0);
      const savedCoverage = localStorage.getItem("medibudget_insurance_coverage");
      setInsuranceData({
        total: totalCost,
        coverage: savedCoverage ? parseInt(savedCoverage) : 60,
      });
    } catch {
      setEstimations([]);
    }

    // Load symptom history
    try {
      const symptoms: SymptomRecord[] = JSON.parse(localStorage.getItem("medibudget_symptom_history") || "[]");
      setSymptomRecords(symptoms);
    } catch {
      setSymptomRecords([]);
    }

    // Build activity timeline from all sources
    buildActivityTimeline();
  }, []);

  const buildActivityTimeline = () => {
    const items: ActivityItem[] = [];

    // From estimations
    try {
      const history: Estimation[] = JSON.parse(localStorage.getItem("estimationHistory") || "[]");
      history.slice(0, 5).forEach((e) => {
        items.push({
          id: `est-${e.id}`,
          type: "estimation",
          title: `Cost estimate: ${e.condition}`,
          description: `₹${e.total?.toLocaleString("en-IN")} at ${e.hospitalType} hospital in ${e.city}`,
          timestamp: e.date,
        });
      });
    } catch {}

    // From symptom history
    try {
      const symptoms: SymptomRecord[] = JSON.parse(localStorage.getItem("medibudget_symptom_history") || "[]");
      symptoms.slice(0, 5).forEach((s) => {
        items.push({
          id: `sym-${s.id}`,
          type: "symptom",
          title: "Symptom consultation",
          description: s.symptoms,
          timestamp: s.date,
        });
      });
    } catch {}

    // From notifications (as proxy for other activities)
    const notifs = getNotifications();
    notifs.slice(0, 3).forEach((n) => {
      const type: ActivityItem["type"] =
        n.type === "cost_alert" ? "estimation" :
        n.type === "scheme_update" ? "scheme" :
        n.type === "medicine_reminder" ? "scan" : "symptom";
      items.push({
        id: `notif-${n.id}`,
        type,
        title: n.title.replace(/^[^\w]+/, "").trim(),
        description: n.message.slice(0, 80),
        timestamp: n.timestamp,
      });
    });

    // Sort by timestamp desc
    items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setActivities(items.slice(0, 15));
  };

  const totalEstimations = estimations.length;
  const totalSpent = estimations.reduce((s, e) => s + (e.total || 0), 0);
  const avgCost = totalEstimations > 0 ? Math.round(totalSpent / totalEstimations) : 0;

  const stats = [
    { label: "Estimations", value: totalEstimations.toString(), icon: Calculator, color: "bg-primary/10 text-primary" },
    { label: "Avg Cost", value: totalEstimations > 0 ? `₹${avgCost.toLocaleString("en-IN")}` : "—", icon: TrendingUp, color: "bg-accent/10 text-accent" },
    { label: "Consultations", value: symptomRecords.length.toString(), icon: Sparkles, color: "bg-primary/10 text-primary" },
    { label: "Health Score", value: "Good", icon: Heart, color: "bg-primary/10 text-primary" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-3"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Link>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl gradient-hero flex items-center justify-center">
                <Activity className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Health Dashboard</h1>
                <p className="text-xs text-muted-foreground">Your personal health insights & activity overview</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="shadow-card">
                <CardContent className="p-4">
                  <div className={`h-8 w-8 rounded-lg ${stat.color} flex items-center justify-center mb-2`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <CostChart estimations={estimations} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <InsurancePieChart
              totalEstimatedCost={insuranceData.total}
              coveragePercent={insuranceData.coverage}
            />
          </motion.div>
        </div>

        {/* Symptom History & Timeline */}
        <div className="grid lg:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <SymptomHistory records={symptomRecords} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <ActivityTimeline activities={activities} />
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <p className="text-sm font-semibold text-foreground mb-3">Quick Actions</p>
              <div className="flex flex-wrap gap-2">
                <Link to="/symptoms">
                  <Button variant="outline" size="sm">
                    <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Symptom Check
                  </Button>
                </Link>
                <Link to="/estimate">
                  <Button variant="outline" size="sm">
                    <Calculator className="h-3.5 w-3.5 mr-1.5" /> Cost Estimate
                  </Button>
                </Link>
                <Link to="/insurance">
                  <Button variant="outline" size="sm">
                    <Shield className="h-3.5 w-3.5 mr-1.5" /> Insurance
                  </Button>
                </Link>
                <Link to="/schemes">
                  <Button variant="outline" size="sm">
                    <ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> Schemes
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Disclaimer */}
        <Card className="border-primary/20 bg-secondary/30">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">
              ⚕️ This dashboard aggregates your activity within MediBudget. Data is stored locally on your device.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HealthDashboard;
