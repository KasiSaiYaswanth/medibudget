import { motion } from "framer-motion";
import { Search, ScanLine, Calculator, FileCheck } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Enter Symptoms or Scan",
    description: "Describe symptoms or scan a medicine strip using your camera.",
  },
  {
    icon: ScanLine,
    title: "Get Intelligent Insights",
    description: "Our system identifies conditions, medicines, and relevant treatments.",
  },
  {
    icon: Calculator,
    title: "Estimate Costs",
    description: "See cost breakdowns by city, hospital type, and treatment options.",
  },
  {
    icon: FileCheck,
    title: "Check Coverage",
    description: "Evaluate government scheme eligibility and insurance coverage instantly.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Four simple steps to understand your healthcare costs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center relative"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-border" />
              )}
              <div className="relative z-10 h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
                <step.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="text-xs font-bold text-primary mb-2">STEP {i + 1}</div>
              <h3 className="text-base font-semibold mb-2 text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
