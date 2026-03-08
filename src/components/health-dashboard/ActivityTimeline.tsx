import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Sparkles,
  Calculator,
  Scan,
  Shield,
  ShieldCheck,
} from "lucide-react";

type ActivityType = "symptom" | "estimation" | "scan" | "insurance" | "scheme";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
}

interface Props {
  activities: ActivityItem[];
}

const typeConfig: Record<ActivityType, { icon: typeof Clock; color: string; label: string }> = {
  symptom: { icon: Sparkles, color: "bg-primary/10 text-primary", label: "Symptom" },
  estimation: { icon: Calculator, color: "bg-accent/10 text-accent", label: "Estimation" },
  scan: { icon: Scan, color: "bg-primary/10 text-primary", label: "Scan" },
  insurance: { icon: Shield, color: "bg-accent/10 text-accent", label: "Insurance" },
  scheme: { icon: ShieldCheck, color: "bg-primary/10 text-primary", label: "Scheme" },
};

const formatTime = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const ActivityTimeline = ({ activities }: Props) => {
  if (activities.length === 0) {
    return (
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" /> Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <p className="text-sm text-muted-foreground">No activity yet. Start using MediBudget features to see your timeline.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" /> Activity Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />

          <div className="space-y-4">
            {activities.map((activity) => {
              const config = typeConfig[activity.type];
              const Icon = config.icon;
              return (
                <div key={activity.id} className="flex items-start gap-3 relative">
                  <div className={`h-8 w-8 rounded-lg ${config.color} flex items-center justify-center flex-shrink-0 z-10`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{activity.description}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{formatTime(activity.timestamp)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
