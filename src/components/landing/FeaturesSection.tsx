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
  { icon: Scan },
  { icon: Calculator },
  { icon: BadgeIndianRupee },
  { icon: ShieldCheck },
  { icon: Hospital },
  { icon: History },
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
            MediBudget
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full hover:shadow-elevated transition-all duration-300 border-border/50 bg-card">
                <CardContent className="p-6 flex items-center justify-center">
                  <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
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
