import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Scan,
  Calculator,
  BadgeIndianRupee,
  ShieldCheck,
  Hospital,
  History,
} from "lucide-react";

const features = [
  {
    icon: Scan,
    title: "Medicine Scanner",
    description:
      "Scan any medicine strip or barcode to instantly get drug info, generics, side effects, and pricing.",
  },
  {
    icon: Calculator,
    title: "Cost Estimation",
    description:
      "Get accurate treatment cost estimates based on your city, locality, and hospital type.",
  },
  {
    icon: BadgeIndianRupee,
    title: "Scheme Eligibility",
    description:
      "Check eligibility for Ayushman Bharat, ESI, CGHS, and state health insurance programs.",
  },
  {
    icon: ShieldCheck,
    title: "Insurance Calculator",
    description:
      "Calculate insurance coverage, patient payable amount, and final out-of-pocket costs.",
  },
  {
    icon: Hospital,
    title: "Hospital Finder",
    description:
      "Discover nearby hospitals with cost comparisons across government, private, and corporate facilities.",
  },
  {
    icon: History,
    title: "Estimation History",
    description:
      "Track all your past estimations, download reports, and compare costs over time.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Everything You Need
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A comprehensive healthcare financial intelligence platform to help you make informed decisions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full hover:shadow-elevated transition-all duration-300 border-border/50 bg-card">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
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

export default FeaturesSection;
