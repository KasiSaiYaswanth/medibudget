import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, Plus, Pencil, Trash2 } from "lucide-react";
import { getGovernmentSchemes, upsertScheme, deleteScheme, logAdminAction } from "@/lib/adminService";
import { toast } from "sonner";

const AdminSchemes = () => {
  const [schemes, setSchemes] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", description: "", eligibility_criteria: "", coverage_amount: "", state: "", is_active: true });

  const load = () => getGovernmentSchemes().then(setSchemes);
  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm({ name: "", description: "", eligibility_criteria: "", coverage_amount: "", state: "", is_active: true }); setEditing(null); };

  const openEdit = (s: any) => {
    setEditing(s);
    setForm({ name: s.name, description: s.description || "", eligibility_criteria: s.eligibility_criteria || "", coverage_amount: s.coverage_amount?.toString() || "", state: s.state || "", is_active: s.is_active });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    try {
      await upsertScheme({
        ...(editing?.id ? { id: editing.id } : {}),
        name: form.name.trim(), description: form.description.trim() || undefined,
        eligibility_criteria: form.eligibility_criteria.trim() || undefined,
        coverage_amount: form.coverage_amount ? Number(form.coverage_amount) : undefined,
        state: form.state.trim() || undefined, is_active: form.is_active,
      });
      await logAdminAction(editing ? "updated" : "created", "scheme", editing?.id, { name: form.name });
      toast.success(editing ? "Scheme updated" : "Scheme added");
      setDialogOpen(false); resetForm(); load();
    } catch (e: any) { toast.error(e.message); }
  };

  const handleDelete = async (s: any) => {
    if (!confirm(`Delete ${s.name}?`)) return;
    try { await deleteScheme(s.id); await logAdminAction("deleted", "scheme", s.id, { name: s.name }); toast.success("Deleted"); load(); }
    catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Shield className="h-6 w-6 text-primary" /> Government Schemes</h1>
          <p className="text-sm text-muted-foreground">{schemes.length} schemes registered</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild><Button className="gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-1" /> Add Scheme</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "Edit Scheme" : "Add Scheme"}</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <Input placeholder="Scheme name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <Textarea placeholder="Eligibility criteria" value={form.eligibility_criteria} onChange={(e) => setForm({ ...form, eligibility_criteria: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Coverage amount (₹)" type="number" value={form.coverage_amount} onChange={(e) => setForm({ ...form, coverage_amount: e.target.value })} />
                <Input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
              </div>
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
        {schemes.map((s) => (
          <Card key={s.id} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{s.name}</h3>
                    <Badge variant={s.is_active ? "default" : "secondary"} className="text-xs">{s.is_active ? "Active" : "Inactive"}</Badge>
                  </div>
                  {s.description && <p className="text-sm text-muted-foreground mb-1">{s.description}</p>}
                  <div className="flex gap-2 flex-wrap text-xs text-muted-foreground">
                    {s.state && <span>📍 {s.state}</span>}
                    {s.coverage_amount && <span>💰 ₹{Number(s.coverage_amount).toLocaleString()}</span>}
                  </div>
                  {s.eligibility_criteria && <p className="text-xs text-muted-foreground mt-1 italic">{s.eligibility_criteria}</p>}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(s)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminSchemes;
