import { useState } from "react";
import { Link } from "react-router-dom";
import { Pill, ArrowLeft, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().trim().email("Invalid email address").max(255, "Email is too long"),
  subject: z.string().trim().min(1, "Subject is required").max(200, "Subject is too long"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000, "Message is too long"),
});

const ContactUs = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [lastSubmit, setLastSubmit] = useState(0);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rate limiting - 30 second cooldown
    const now = Date.now();
    if (now - lastSubmit < 30000) {
      toast.error("Please wait before sending another message.");
      return;
    }

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setLastSubmit(Date.now());
    setForm({ name: "", email: "", subject: "", message: "" });
    toast.success("Message sent! We'll get back to you within 24–48 hours.");
  };

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

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Contact Us</h1>
        <p className="text-muted-foreground mb-10">Have a question or need help? We're here for you.</p>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Card>
            <CardContent className="p-5 flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-foreground">Email</h3>
                <a href="mailto:support@medibudget.in" className="text-sm text-muted-foreground hover:text-primary">support@medibudget.in</a>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-foreground">Response Time</h3>
                <p className="text-sm text-muted-foreground">24–48 hours</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-start gap-3">
              <Send className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-foreground">Support</h3>
                <p className="text-sm text-muted-foreground">Mon–Sat, 9am–6pm IST</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6 md:p-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Name</label>
                  <Input placeholder="Your name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                  <Input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Subject</label>
                <Input placeholder="What's this about?" value={form.subject} onChange={(e) => handleChange("subject", e.target.value)} />
                {errors.subject && <p className="text-xs text-destructive mt-1">{errors.subject}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Message</label>
                <Textarea placeholder="Tell us more..." rows={5} value={form.message} onChange={(e) => handleChange("message", e.target.value)} />
                {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
              </div>
              <Button type="submit" disabled={loading} className="w-full md:w-auto">
                {loading ? "Sending..." : "Send Message"} <Send className="h-4 w-4 ml-1" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ContactUs;
