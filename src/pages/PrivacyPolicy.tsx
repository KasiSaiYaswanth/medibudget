import { Link } from "react-router-dom";
import { Pill, ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
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

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-10">Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="prose prose-sm max-w-none space-y-8 text-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">MediBudget ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our healthcare cost estimation platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Information Collected</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">We may collect the following types of information:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Symptoms and health-related queries entered by users</li>
              <li>Location data (with your explicit permission) to find nearby hospitals</li>
              <li>Insurance information provided for coverage estimation</li>
              <li>Account details such as email address and name</li>
              <li>Usage data including pages visited and features used</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. How Data is Used</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">Your data is used exclusively for:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Providing healthcare cost estimations and guidance</li>
              <li>Identifying nearby hospitals and relevant government schemes</li>
              <li>Improving the accuracy and quality of our services</li>
              <li>Communicating important updates about the platform</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-2">We do not sell, rent, or share your personal health data with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Data Protection Measures</h2>
            <p className="text-muted-foreground leading-relaxed">We implement industry-standard security measures including encryption in transit and at rest, secure authentication, and access controls to protect your sensitive health-related data.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. User Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">You have the right to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Access, update, or delete your personal data</li>
              <li>Opt out of optional data collection (such as location access)</li>
              <li>Request a copy of your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">We retain your data only as long as necessary to provide our services or as required by law. You may request deletion of your account and associated data at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">We may use third-party services for analytics, hosting, and AI-powered insights. These services are bound by their own privacy policies and are selected for their commitment to data security.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              For privacy-related inquiries, please contact us at{" "}
              <a href="mailto:privacy@medibudget.in" className="text-primary hover:underline">privacy@medibudget.in</a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
