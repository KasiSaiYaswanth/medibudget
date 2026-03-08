import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList } from "lucide-react";
import { getAuditLogs } from "@/lib/adminService";
import { format } from "date-fns";

const AdminAudit = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getAuditLogs().then((d) => { setLogs(d); setLoading(false); }); }, []);

  const actionColor = (action: string) => {
    if (action === "created") return "default";
    if (action === "updated") return "secondary";
    if (action === "deleted") return "destructive";
    return "outline";
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-primary" /> Audit Logs
        </h1>
        <p className="text-sm text-muted-foreground">{logs.length} logged actions</p>
      </div>

      {logs.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="py-12 text-center text-muted-foreground">
            No audit logs yet. Actions will be recorded as you manage data.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <Card key={log.id} className="shadow-card">
              <CardContent className="p-4 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <Badge variant={actionColor(log.action) as any} className="text-xs capitalize">{log.action}</Badge>
                  <span className="text-sm text-foreground font-medium capitalize">{log.entity_type}</span>
                  {(log.details as any)?.name && (
                    <span className="text-sm text-muted-foreground">— {(log.details as any).name}</span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(log.created_at), "MMM d, yyyy HH:mm")}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAudit;
