import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { getCostAnalytics } from "@/lib/adminService";

const COLORS = ["hsl(168, 80%, 36%)", "hsl(210, 90%, 55%)", "hsl(25, 95%, 53%)", "hsl(0, 72%, 51%)", "hsl(280, 60%, 50%)"];

const AdminCosts = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getCostAnalytics().then((d) => { setData(d); setLoading(false); }); }, []);

  const byCondition = data.reduce((acc: Record<string, { total: number; count: number }>, c: any) => {
    if (!acc[c.condition]) acc[c.condition] = { total: 0, count: 0 };
    acc[c.condition].total += Number(c.estimated_cost);
    acc[c.condition].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);
  const conditionData = Object.entries(byCondition).map(([name, v]) => ({
    name, avgCost: Math.round(v.total / v.count), totalCost: v.total
  })).sort((a, b) => b.avgCost - a.avgCost);

  const byCity = data.reduce((acc: Record<string, { total: number; count: number }>, c: any) => {
    const city = c.city || "Unknown";
    if (!acc[city]) acc[city] = { total: 0, count: 0 };
    acc[city].total += Number(c.estimated_cost);
    acc[city].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);
  const cityData = Object.entries(byCity).map(([name, v]) => ({
    name, avgCost: Math.round(v.total / v.count)
  }));

  const byType = data.reduce((acc: Record<string, number>, c) => {
    const t = c.hospital_type || "unknown";
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});
  const typeData = Object.entries(byType).map(([name, value]) => ({ name, value }));

  const totalCoverage = data.reduce((s, c) => s + Number(c.insurance_coverage || 0), 0);
  const totalCost = data.reduce((s, c) => s + Number(c.estimated_cost), 0);

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-accent" /> Cost Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          Total estimated: ₹{totalCost.toLocaleString()} | Insurance covered: ₹{totalCoverage.toLocaleString()}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Avg Cost by Condition (₹)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conditionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="avgCost" fill="hsl(210, 90%, 55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Avg Cost by City (₹)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="avgCost" fill="hsl(168, 80%, 36%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">Hospital Type Distribution</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={typeData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={5} dataKey="value" label>
                {typeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed table */}
      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">Recent Cost Estimations</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-muted-foreground font-medium">Condition</th>
                <th className="text-right py-2 text-muted-foreground font-medium">Est. Cost</th>
                <th className="text-left py-2 text-muted-foreground font-medium">City</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Type</th>
                <th className="text-right py-2 text-muted-foreground font-medium">Coverage</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 15).map((c, i) => (
                <tr key={c.id || i} className="border-b border-border/50">
                  <td className="py-2 font-medium text-foreground">{c.condition}</td>
                  <td className="py-2 text-right">₹{Number(c.estimated_cost).toLocaleString()}</td>
                  <td className="py-2">{c.city || "—"}</td>
                  <td className="py-2"><Badge variant="outline" className="text-xs capitalize">{c.hospital_type}</Badge></td>
                  <td className="py-2 text-right">{c.insurance_applied ? `₹${Number(c.insurance_coverage).toLocaleString()}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCosts;
