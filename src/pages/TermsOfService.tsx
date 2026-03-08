import { Link } from "react-router-dom";
import { Pill, ArrowLeft } from "lucide-react";

const TermsOfService = () => {
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

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-10">Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="prose prose-sm max-w-none space-y-8 text-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. User Responsibilities</h2>
            <p className="text-muted-foreground leading-relaxed">Users must provide accurate information when using MediBudget's estimation tools. You are responsible for the accuracy of symptoms, insurance details, and other data you enter into the platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Acceptable Use</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">You agree not to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Use the platform for any unlawful purpose</li>
              <li>Attempt to reverse-engineer or exploit the system</li>
              <li>Submit false or misleading information</li>
              <li>Interfere with the platform's operation or other users' access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Account Security</h2>
            <p className="text-muted-foreground leading-relaxed">You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately of any unauthorized access to your account.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Service Availability</h2>
            <p className="text-muted-foreground leading-relaxed">We strive to maintain high availability but do not guarantee uninterrupted access. The platform may undergo maintenance or updates that temporarily affect availability.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">MediBudget provides cost estimations for informational purposes only. All estimates are approximate and actual costs may vary. We are not liable for any financial decisions made based on our estimations.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">All content, features, and functionality of the MediBudget platform are owned by us and protected by applicable intellectual property laws.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Termination of Service</h2>
            <p className="text-muted-foreground leading-relaxed">We reserve the right to suspend or terminate your access if you violate these terms. You may also delete your account at any time through your account settings.</p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;
