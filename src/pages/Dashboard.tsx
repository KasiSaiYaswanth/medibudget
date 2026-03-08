import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scan, Calculator, ShieldCheck, History, ArrowRight, TrendingDown, Users, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Dashboard = () => {
  const [userName, setUserName] = useState("there");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const name = data.user?.user_metadata?.full_name;
      if (name) setUserName(name.split(" ")[0]);
    });
  }, []);

  const quickActions = [
    {
      icon: Sparkles,
      title: "Symptom Assistant",
      description: "AI-powered symptom analysis & guidance",
      path: "/symptoms",
      color: "gradient-hero",
    },
    {
      icon: Scan,
      title: "Medicine Scanner",
      description: "Scan or search any medicine",
      path: "/scanner",
      color: "gradient-primary",
    },
    {
      icon: Calculator,
      title: "Cost Estimation",
      description: "Estimate treatment costs",
      path: "/estimate",
      color: "gradient-accent",
    },
    {
      icon: ShieldCheck,
      title: "Scheme Checker",
      description: "Check government scheme eligibility",
      path: "/schemes",
      color: "gradient-warm",
    },
    {
      icon: History,
      title: "History",
      description: "View past estimations",
      path: "/history",
      color: "gradient-primary",
    },
  ];

  const stats = [
    { label: "Estimations Made", value: "0", icon: Calculator },
    { label: "Potential Savings", value: "₹0", icon: TrendingDown },
    { label: "Schemes Checked", value: "0", icon: Users },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground">Hello, {userName} 👋</h1>
          <p className="text-muted-foreground mt-1">What would you like to estimate today?</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="shadow-card">
                <CardContent className="p-4">
                  <stat.icon className="h-5 w-5 text-primary mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {quickActions.map((action, i) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <Link to={action.path}>
                  <Card className="shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer group">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-xl ${action.color} flex items-center justify-center flex-shrink-0`}>
                        <action.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Medical Disclaimer */}
        <Card className="border-primary/20 bg-secondary/30">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">
              ⚕️ MediBudget provides cost estimates only and does not constitute medical advice.
              Always consult a qualified healthcare professional for medical decisions.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
