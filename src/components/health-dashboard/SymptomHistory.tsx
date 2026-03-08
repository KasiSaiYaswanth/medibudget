import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MessageSquare, AlertTriangle } from "lucide-react";

interface SymptomRecord {
  id: string;
  date: string;
  symptoms: string;
  severity?: string;
}

interface Props {
  records: SymptomRecord[];
}

const severityColors: Record<string, string> = {
  low: "bg-primary/10 text-primary",
  moderate: "bg-accent/10 text-accent",
  high: "bg-destructive/10 text-destructive",
  urgent: "bg-destructive text-destructive-foreground",
};

const SymptomHistory = ({ records }: Props) => {
  if (records.length === 0) {
    return (
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> Symptom History
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <p className="text-sm text-muted-foreground">No symptom conversations yet. Use the Symptom Assistant to get started.</p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> Symptom History
        </CardTitle>
        <p className="text-xs text-muted-foreground">{records.length} conversation{records.length !== 1 ? "s" : ""} recorded</p>
      </CardHeader>
      <CardContent className="pt-2 space-y-2 max-h-64 overflow-y-auto">
        {records.map((record) => (
          <div
            key={record.id}
            className="flex items-start gap-3 p-3 rounded-xl border border-border hover:border-primary/20 transition-colors"
          >
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{record.symptoms}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-muted-foreground">{formatDate(record.date)}</span>
                {record.severity && (
                  <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${severityColors[record.severity] || ""}`}>
                    {record.severity === "urgent" && <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />}
                    {record.severity.charAt(0).toUpperCase() + record.severity.slice(1)}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SymptomHistory;
