import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Building2, Pill, Users, TrendingUp, Shield, BarChart3, Heart } from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";
import { getSymptomAnalytics, getCostAnalytics, getHospitals, getMedicines, getGovernmentSchemes } from "@/lib/adminService";

const COLORS = ["hsl(168, 80%, 36%)", "hsl(210, 90%, 55%)", "hsl(25, 95%, 53%)", "hsl(0, 72%, 51%)", "hsl(280, 60%, 50%)", "hsl(45, 90%, 50%)"];

const AdminDashboard = () => {
  const [symptoms, setSymptoms] = useState<any[]>([]);
  const [costs, setCosts] = useState<any[]>([]);
  const [hospitalCount, setHospitalCount] = useState(0);
  const [medicineCount, setMedicineCount] = useState(0);
  const [schemeCount, setSchemeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getSymptomAnalytics(),
      getCostAnalytics(),
      getHospitals(),
      getMedicines(),
      getGovernmentSchemes(),
    ]).then(([s, c, h, m, sc]) => {
      setSymptoms(s);
      setCosts(c);
      setHospitalCount(h.length);
      setMedicineCount(m.length);
      setSchemeCount(sc.length);
      setLoading(false);
    });
  }, []);

  // Process symptom frequency
  const symptomFreq = symptoms.reduce((acc: Record<string, number>, s) => {
    acc[s.symptom] = (acc[s.symptom] || 0) + 1;
    return acc;
  }, {});
  const symptomChartData = Object.entries(symptomFreq)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Process cost by condition
  const costByCondition = costs.reduce((acc: Record<string, { total: number; count: number }>, c) => {
    if (!acc[c.condition]) acc[c.condition] = { total: 0, count: 0 };
    acc[c.condition].total += Number(c.estimated_cost);
    acc[c.condition].count += 1;
    return acc;
  }, {});
  const costChartData = Object.entries(costByCondition)
    .map(([name, { total, count }]) => ({ name, avgCost: Math.round(total / count) }))
    .sort((a, b) => b.avgCost - a.avgCost);

  // Insurance usage
  const insuredCount = costs.filter((c) => c.insurance_applied).length;
  const uninsuredCount = costs.length - insuredCount;
  const insurancePieData = [
    { name: "Insured", value: insuredCount },
    { name: "Uninsured", value: uninsuredCount },
  ];

  // City distribution
  const cityDist = symptoms.reduce((acc: Record<string, number>, s) => {
    if (s.city) acc[s.city] = (acc[s.city] || 0) + 1;
    return acc;
  }, {});
  const cityPieData = Object.entries(cityDist).map(([name, value]) => ({ name, value }));

  // AI confidence trend
  const confidenceData = symptoms
    .filter((s) => s.confidence_score)
    .map((s, i) => ({ index: i + 1, confidence: Number(s.confidence_score) }));

  const metrics = [
    { label: "Total Searches", value: symptoms.length, icon: Activity, color: "text-primary" },
    { label: "Cost Estimates", value: costs.length, icon: TrendingUp, color: "text-accent" },
    { label: "Hospitals", value: hospitalCount, icon: Building2, color: "text-primary" },
    { label: "Medicines", value: medicineCount, icon: Pill, color: "text-accent" },
    { label: "Govt Schemes", value: schemeCount, icon: Shield, color: "text-primary" },
    { label: "Avg Confidence", value: confidenceData.length ? `${(confidenceData.reduce((s, c) => s + c.confidence, 0) / confidenceData.length).toFixed(1)}%` : "N/A", icon: BarChart3, color: "text-accent" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm">Platform analytics & system overview</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <m.icon className={`h-4 w-4 ${m.color}`} />
                  <span className="text-xs text-muted-foreground">{m.label}</span>
                </div>
                <p className="text-xl font-bold text-foreground">{m.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Most Searched Symptoms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={symptomChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="count" fill="hsl(168, 80%, 36%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              Most Expensive Treatments (Avg ₹)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={100} />
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="avgCost" fill="hsl(210, 90%, 55%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Insurance Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={insurancePieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                  {insurancePieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Searches by City</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={cityPieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name }) => name}>
                  {cityPieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              AI Confidence Scores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={confidenceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="index" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Line type="monotone" dataKey="confidence" stroke="hsl(168, 80%, 36%)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Recent Symptom Searches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {symptoms.slice(0, 10).map((s, i) => (
              <div key={s.id || i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="capitalize">{s.symptom}</Badge>
                  <span className="text-sm text-muted-foreground">→ {s.predicted_condition || "Unknown"}</span>
                </div>
                <div className="flex items-center gap-2">
                  {s.city && <Badge variant="outline" className="text-xs">{s.city}</Badge>}
                  {s.confidence_score && (
                    <span className="text-xs font-medium text-primary">{s.confidence_score}%</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
