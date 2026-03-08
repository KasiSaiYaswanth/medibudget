import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Shield } from "lucide-react";

interface Props {
  totalEstimatedCost: number;
  coveragePercent: number; // 0-100
}

const InsurancePieChart = ({ totalEstimatedCost, coveragePercent }: Props) => {
  const covered = Math.round(totalEstimatedCost * (coveragePercent / 100));
  const outOfPocket = totalEstimatedCost - covered;

  const data = [
    { name: "Covered", value: covered || 1 },
    { name: "Out of Pocket", value: outOfPocket || 1 },
  ];

  const COLORS = ["hsl(168, 80%, 36%)", "hsl(25, 95%, 53%)"];

  if (totalEstimatedCost === 0) {
    return (
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" /> Insurance Coverage
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <p className="text-sm text-muted-foreground">Use the Insurance Calculator to see coverage breakdown.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" /> Insurance Coverage
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-card border border-border rounded-lg p-2 shadow-elevated text-xs">
                      <p className="font-semibold text-foreground">{d.name}</p>
                      <p className="text-primary font-bold">₹{d.value.toLocaleString("en-IN")}</p>
                    </div>
                  );
                }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                formatter={(value: string) => (
                  <span className="text-xs text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="text-center p-2 rounded-lg bg-primary/5">
            <p className="text-lg font-bold text-primary">₹{covered.toLocaleString("en-IN")}</p>
            <p className="text-[10px] text-muted-foreground">Estimated Covered</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-accent/5">
            <p className="text-lg font-bold text-accent">₹{outOfPocket.toLocaleString("en-IN")}</p>
            <p className="text-[10px] text-muted-foreground">Out of Pocket</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsurancePieChart;
