import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ShieldCheck, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AdminUsers = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" /> User Management
        </h1>
        <p className="text-sm text-muted-foreground">Manage platform users and roles</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          User management is handled through the authentication system. User data is anonymized in analytics to comply with healthcare privacy standards.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" /> Role-Based Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div>
                <p className="font-medium text-foreground">Admin</p>
                <p className="text-xs text-muted-foreground">Full platform access, data management, analytics</p>
              </div>
              <Badge className="text-xs">Full Access</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div>
                <p className="font-medium text-foreground">Moderator</p>
                <p className="text-xs text-muted-foreground">Content review, limited data access</p>
              </div>
              <Badge variant="secondary" className="text-xs">Limited</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">User</p>
                <p className="text-xs text-muted-foreground">Standard platform usage</p>
              </div>
              <Badge variant="outline" className="text-xs">Standard</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Security Policies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>✅ Row-Level Security on all tables</p>
            <p>✅ Admin-only access to analytics data</p>
            <p>✅ Audit logging for all admin actions</p>
            <p>✅ User data anonymized in reports</p>
            <p>✅ Role-based authentication via secure functions</p>
            <p>✅ SECURITY DEFINER functions prevent RLS recursion</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUsers;
