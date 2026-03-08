import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { IndianRupee } from "lucide-react";

interface Estimation {
  id: string;
  date: string;
  condition: string;
  city: string;
  hospitalType: string;
  total: number;
}

interface Props {
  estimations: Estimation[];
}

const COLORS = [
  "hsl(168, 80%, 36%)",
  "hsl(210, 90%, 55%)",
  "hsl(25, 95%, 53%)",
  "hsl(280, 60%, 50%)",
  "hsl(340, 70%, 50%)",
];

const CostChart = ({ estimations }: Props) => {
  if (estimations.length === 0) {
    return (
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-primary" /> Cost Estimation History
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <p className="text-sm text-muted-foreground">No cost estimations yet. Use the Cost Estimation tool to get started.</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = estimations.slice(0, 8).reverse().map((e) => ({
    name: e.condition.length > 15 ? e.condition.slice(0, 15) + "…" : e.condition,
    cost: e.total,
    fullName: e.condition,
    city: e.city,
    type: e.hospitalType,
  }));

  const totalSpent = estimations.reduce((s, e) => s + (e.total || 0), 0);
  const avg = estimations.length > 0 ? Math.round(totalSpent / estimations.length) : 0;

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <IndianRupee className="h-4 w-4 text-primary" /> Cost Estimation History
        </CardTitle>
        <div className="flex gap-4 mt-1">
          <span className="text-xs text-muted-foreground">
            Total: <span className="font-semibold text-foreground">₹{totalSpent.toLocaleString("en-IN")}</span>
          </span>
          <span className="text-xs text-muted-foreground">
            Avg: <span className="font-semibold text-foreground">₹{avg.toLocaleString("en-IN")}</span>
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(168, 15%, 90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-card border border-border rounded-lg p-2 shadow-elevated text-xs">
                      <p className="font-semibold text-foreground">{d.fullName}</p>
                      <p className="text-muted-foreground">{d.city} • {d.type}</p>
                      <p className="text-primary font-bold mt-1">₹{d.cost.toLocaleString("en-IN")}</p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="cost" radius={[6, 6, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostChart;
