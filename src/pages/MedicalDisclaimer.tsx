import { Link } from "react-router-dom";
import { Pill, ArrowLeft, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const MedicalDisclaimer = () => {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
              <Pill className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">MediBudget</span>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Medical Disclaimer</h1>

        <Card className="border-destructive/30 bg-destructive/5 mb-10">
          <CardContent className="p-6 flex gap-4">
            <AlertTriangle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
            <p className="text-foreground leading-relaxed font-medium">
              The information provided by MediBudget is for educational and planning purposes only and should not replace professional medical advice, diagnosis, or treatment.
            </p>
          </CardContent>
        </Card>

        <div className="prose prose-sm max-w-none space-y-8 text-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Not a Medical Service</h2>
            <p className="text-muted-foreground leading-relaxed">MediBudget does not provide medical diagnosis, treatment recommendations, or clinical advice. Our platform is a healthcare cost estimation and information tool designed to help users make financially informed decisions.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Informational Insights Only</h2>
            <p className="text-muted-foreground leading-relaxed">The symptom analysis, condition predictions, and medicine information provided on this platform are generated using AI and publicly available data. These insights are informational only and may not be accurate for your specific medical situation.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Consult Healthcare Professionals</h2>
            <p className="text-muted-foreground leading-relaxed">Always consult a licensed healthcare professional for medical advice, diagnosis, and treatment decisions. Do not delay seeking medical attention based on information from this platform. In case of a medical emergency, contact your local emergency services immediately.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Cost Estimates Are Approximate</h2>
            <p className="text-muted-foreground leading-relaxed">All cost estimates provided are approximate and based on aggregated data. Actual medical costs may vary significantly depending on the hospital, physician, treatment complexity, and other factors. MediBudget is not responsible for discrepancies between estimated and actual costs.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">No Liability</h2>
            <p className="text-muted-foreground leading-relaxed">MediBudget, its developers, and affiliates shall not be held liable for any adverse outcomes, financial losses, or health consequences resulting from the use of information provided on this platform.</p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default MedicalDisclaimer;
