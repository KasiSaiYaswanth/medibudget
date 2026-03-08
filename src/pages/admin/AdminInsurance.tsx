import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Plus, Pencil, Trash2 } from "lucide-react";
import { getInsuranceProviders, upsertInsuranceProvider, deleteInsuranceProvider, logAdminAction } from "@/lib/adminService";
import { toast } from "sonner";

const AdminInsurance = () => {
  const [providers, setProviders] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", coverage_percentage: "", claim_limit: "", plan_types: "", is_active: true });

  const load = () => getInsuranceProviders().then(setProviders);
  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm({ name: "", coverage_percentage: "", claim_limit: "", plan_types: "", is_active: true }); setEditing(null); };

  const openEdit = (p: any) => {
    setEditing(p);
    setForm({ name: p.name, coverage_percentage: p.coverage_percentage?.toString() || "", claim_limit: p.claim_limit?.toString() || "", plan_types: (p.plan_types || []).join(", "), is_active: p.is_active });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    try {
      await upsertInsuranceProvider({
        ...(editing?.id ? { id: editing.id } : {}),
        name: form.name.trim(),
        coverage_percentage: form.coverage_percentage ? Number(form.coverage_percentage) : undefined,
        claim_limit: form.claim_limit ? Number(form.claim_limit) : undefined,
        plan_types: form.plan_types ? form.plan_types.split(",").map((s) => s.trim()).filter(Boolean) : [],
        is_active: form.is_active,
      });
      await logAdminAction(editing ? "updated" : "created", "insurance_provider", editing?.id, { name: form.name });
      toast.success(editing ? "Provider updated" : "Provider added");
      setDialogOpen(false); resetForm(); load();
    } catch (e: any) { toast.error(e.message); }
  };

  const handleDelete = async (p: any) => {
    if (!confirm(`Delete ${p.name}?`)) return;
    try { await deleteInsuranceProvider(p.id); await logAdminAction("deleted", "insurance_provider", p.id, { name: p.name }); toast.success("Deleted"); load(); }
    catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><FileText className="h-6 w-6 text-accent" /> Insurance Providers</h1>
          <p className="text-sm text-muted-foreground">{providers.length} providers</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild><Button className="gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-1" /> Add Provider</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit Provider" : "Add Provider"}</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <Input placeholder="Provider name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Coverage %" type="number" value={form.coverage_percentage} onChange={(e) => setForm({ ...form, coverage_percentage: e.target.value })} />
                <Input placeholder="Claim limit (₹)" type="number" value={form.claim_limit} onChange={(e) => setForm({ ...form, claim_limit: e.target.value })} />
              </div>
              <Input placeholder="Plan types (comma-separated)" value={form.plan_types} onChange={(e) => setForm({ ...form, plan_types: e.target.value })} />
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
                <span className="text-sm text-muted-foreground">Active</span>
              </div>
              <Button onClick={handleSave} className="gradient-primary text-primary-foreground">{editing ? "Update" : "Add"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3">
        {providers.map((p) => (
          <Card key={p.id} className="shadow-card">
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{p.name}</h3>
                  <Badge variant={p.is_active ? "default" : "secondary"} className="text-xs">{p.is_active ? "Active" : "Inactive"}</Badge>
                </div>
                <div className="flex gap-3 flex-wrap text-sm text-muted-foreground">
                  {p.coverage_percentage && <span>Coverage: {p.coverage_percentage}%</span>}
                  {p.claim_limit && <span>Limit: ₹{Number(p.claim_limit).toLocaleString()}</span>}
                </div>
                {p.plan_types?.length > 0 && (
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {p.plan_types.map((t: string) => <Badge key={t} variant="outline" className="text-xs capitalize">{t}</Badge>)}
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(p)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminInsurance;
