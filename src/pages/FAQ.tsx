import { Link } from "react-router-dom";
import { Pill, ArrowLeft } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What is MediBudget?",
    a: "MediBudget is a healthcare cost estimation platform that helps you understand medical expenses before visiting a hospital. It includes tools for cost estimation, medicine scanning, government scheme eligibility checks, insurance coverage calculations, and AI-powered symptom analysis.",
  },
  {
    q: "How accurate are the cost estimates?",
    a: "Our cost estimates are based on aggregated data from hospitals across India and are meant to provide an approximate range. Actual costs may vary depending on the specific hospital, physician, treatment complexity, and other factors. We recommend using estimates as a planning guide rather than a definitive price.",
  },
  {
    q: "Does MediBudget provide medical advice?",
    a: "No. MediBudget does not provide medical diagnosis, treatment recommendations, or clinical advice. Our symptom analysis and condition insights are AI-generated and for informational purposes only. Always consult a licensed healthcare professional for medical decisions.",
  },
  {
    q: "How is my data protected?",
    a: "We use industry-standard encryption and security measures to protect your data. Health-related information is stored securely and is never sold or shared with third parties for marketing. You can review our full Privacy Policy for more details.",
  },
  {
    q: "Can I use the platform without sharing my location?",
    a: "Yes, absolutely. Location access is entirely optional. If you share your location, we use it to find nearby hospitals and provide city-specific cost estimates. You can manually enter your city instead.",
  },
  {
    q: "How does the insurance estimator work?",
    a: "The insurance estimator calculates your potential out-of-pocket costs based on the insurance provider and plan type you enter. It factors in coverage percentages, claim limits, and the estimated treatment cost to show you what your insurance may cover and what you'd pay.",
  },
  {
    q: "Is MediBudget free to use?",
    a: "Yes, MediBudget is free for individual users. You can access all core features including cost estimation, medicine scanning, scheme eligibility checks, and symptom analysis at no cost.",
  },
  {
    q: "What government schemes can I check eligibility for?",
    a: "MediBudget covers major schemes including Ayushman Bharat (PMJAY), Employee State Insurance (ESI), Central Government Health Scheme (CGHS), and various state-level health insurance programs.",
  },
];

const FAQ = () => {
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

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h1>
        <p className="text-muted-foreground mb-10">Find answers to common questions about MediBudget.</p>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
    </div>
  );
};

export default FAQ;
