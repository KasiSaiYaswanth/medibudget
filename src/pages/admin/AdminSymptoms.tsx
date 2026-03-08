import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { getSymptomAnalytics } from "@/lib/adminService";

const COLORS = ["hsl(168, 80%, 36%)", "hsl(210, 90%, 55%)", "hsl(25, 95%, 53%)", "hsl(0, 72%, 51%)", "hsl(280, 60%, 50%)", "hsl(45, 90%, 50%)", "hsl(320, 70%, 50%)", "hsl(140, 60%, 40%)"];

const AdminSymptoms = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSymptomAnalytics().then((d) => { setData(d); setLoading(false); });
  }, []);

  const symptomFreq = data.reduce((acc: Record<string, number>, s) => {
    acc[s.symptom] = (acc[s.symptom] || 0) + 1; return acc;
  }, {});
  const barData = (Object.entries(symptomFreq) as [string, number][]q) as [string, number][]).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);

  const conditionFreq = data.reduce((acc: Record<string, number>, s: any) => {
    if (s.predicted_condition) acc[s.predicted_condition] = (acc[s.predicted_condition] || 0) + 1; return acc;
  }, {} as Record<string, numb(Object.entries(conditionFreq) as [string, number][]ct.entries(conditionFreq).map(([name, value]) => ({ name, value }));

  const cityFreq = data.reduce((acc: Record<string, Record<string, number>>, s) => {
    if (s.city) {
      if (!acc[s.city]) acc[s.city] = {};
      acc[s.city][s.symptom] = (acc[s.city][s.symptom] || 0) + 1;
    }
    return acc;
  }, {});

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" /> Symptom Analytics
        </h1>
        <p className="text-sm text-muted-foreground">{data.length} total symptom searches analyzed</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Symptom Frequency</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="count" fill="hsl(168, 80%, 36%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Predicted Conditions</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Symptoms by City */}
      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">Symptoms by City</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(cityFreq).map(([city, symptoms]) => (
              <div key={city} className="p-4 rounded-lg bg-muted/50 border border-border">
                <h3 className="font-semibold text-foreground mb-2">{city}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(symptoms).sort(([, a], [, b]) => b - a).map(([symptom, count]) => (
                    <Badge key={symptom} variant="secondary" className="text-xs">
                      {symptom} ({count})
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSymptoms;
