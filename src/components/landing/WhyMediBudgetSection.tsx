import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  IndianRupee,
  Hospital,
  ShieldCheck,
  HeartPulse,
  Brain,
} from "lucide-react";

const benefits = [
  {
    icon: IndianRupee,
    title: "Understand Medical Costs",
    description:
      "Get transparent cost breakdowns before visiting a hospital — no more bill shocks.",
  },
  {
    icon: Hospital,
    title: "Discover Nearby Hospitals",
    description:
      "Find and compare hospitals near you — government, private, and corporate facilities.",
  },
  {
    icon: ShieldCheck,
    title: "Check Scheme Eligibility",
    description:
      "Instantly check if you qualify for Ayushman Bharat, ESI, CGHS, or state health programs.",
  },
  {
    icon: HeartPulse,
    title: "Estimate Insurance Coverage",
    description:
      "Calculate what your insurance covers and your actual out-of-pocket expense.",
  },
  {
    icon: Brain,
    title: "AI Symptom Insights",
    description:
      "Get intelligent symptom analysis and understand possible conditions before your consultation.",
  },
];

const WhyMediBudgetSection = () => {
  return (
    <section id="why-medibudget" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Why Use MediBudget?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Healthcare decisions shouldn't come with financial surprises. We empower you with the information you need.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full hover:shadow-elevated transition-all duration-300 border-border/50 bg-card group">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl gradient-hero flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow duration-300">
                    <benefit.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyMediBudgetSection;
