import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, RotateCcw, IndianRupee, FlaskConical, Pill } from "lucide-react";
import { toast } from "sonner";
import type { EstimationResult } from "@/pages/CostEstimation";

interface Props {
  result: EstimationResult;
  onReset: () => void;
}

const COLORS = ["hsl(168, 80%, 36%)", "hsl(210, 90%, 55%)", "hsl(25, 95%, 53%)", "hsl(280, 70%, 50%)"];

const CostResults = ({ result, onReset }: Props) => {
  const barData = [
    { name: "Consultation", cost: result.consultation },
    { name: "Tests", cost: result.tests },
    { name: "Medicines", cost: result.medicines },
    { name: "Treatment", cost: result.treatment },
  ];

  const pieData = barData.filter((d) => d.cost > 0);

  const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

  return (
    <div className="space-y-6">
      <Card className="shadow-elevated border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <IndianRupee className="h-5 w-5 text-primary" />
            Estimation Results
          </CardTitle>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="bg-secondary px-2 py-1 rounded-full">{result.condition}</span>
            <span className="bg-secondary px-2 py-1 rounded-full">{result.city}</span>
            <span className="bg-secondary px-2 py-1 rounded-full">{result.hospitalType}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground">Estimated Total Cost</p>
            <p className="text-4xl font-extrabold text-gradient">{formatCurrency(result.total)}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {barData.map((item, i) => (
              <div key={item.name} className="p-3 rounded-xl bg-secondary/50">
                <p className="text-xs text-muted-foreground">{item.name}</p>
                <p className="text-lg font-bold text-foreground" style={{ color: COLORS[i] }}>
                  {formatCurrency(item.cost)}
                </p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-64">
              <p className="text-sm font-semibold text-foreground mb-2">Cost Breakdown</p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(168, 15%, 90%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="cost" radius={[6, 6, 0, 0]}>
                    {barData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="h-64">
              <p className="text-sm font-semibold text-foreground mb-2">Cost Distribution</p>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="cost"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Tests */}
      {result.recommendedTests && result.recommendedTests.length > 0 && (
        <Card className="shadow-card border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-blue-500" />
              Recommended Tests
            </CardTitle>
            <p className="text-xs text-muted-foreground">Tests typically prescribed for {result.condition}</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {result.recommendedTests.map((test, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/10">
                  <div className="h-6 w-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-blue-600">{i + 1}</span>
                  </div>
                  <span className="text-sm text-foreground">{test}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommended Medicines */}
      {result.recommendedMedicines && result.recommendedMedicines.length > 0 && (
        <Card className="shadow-card border-orange-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Pill className="h-5 w-5 text-orange-500" />
              Medicines That May Be Prescribed
            </CardTitle>
            <p className="text-xs text-muted-foreground">Common medicines for {result.condition} (consult your doctor)</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {result.recommendedMedicines.map((med, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-orange-500/5 border border-orange-500/10">
                  <div className="h-6 w-6 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <Pill className="h-3 w-3 text-orange-600" />
                  </div>
                  <span className="text-sm text-foreground">{med}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 italic">
              ⚠️ Disclaimer: These are commonly prescribed medicines for reference only. Actual prescription may vary based on your specific condition. Always consult a qualified doctor.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onReset} className="flex-1">
          <RotateCcw className="h-4 w-4 mr-2" /> New Estimation
        </Button>
        <Button variant="hero" className="flex-1">
          <Download className="h-4 w-4 mr-2" /> Download Report
        </Button>
      </div>
    </div>
  );
};

export default CostResults;
