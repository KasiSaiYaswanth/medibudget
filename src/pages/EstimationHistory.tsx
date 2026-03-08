import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, History as HistoryIcon } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";

const EstimationHistory = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Link to="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Estimation History</h1>
          <p className="text-muted-foreground mt-1">View and compare your past estimations.</p>
        </div>

        <Card className="shadow-card">
          <CardContent className="p-12 text-center">
            <HistoryIcon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No estimations yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your cost estimations will appear here after you complete your first one.
            </p>
            <Link to="/estimate" className="text-sm text-primary font-medium hover:underline">
              Create your first estimation →
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EstimationHistory;
