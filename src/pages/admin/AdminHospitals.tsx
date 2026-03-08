import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Plus, Pencil, Trash2, Search } from "lucide-react";
import { getHospitals, upsertHospital, deleteHospital, logAdminAction } from "@/lib/adminService";
import { toast } from "sonner";

const AdminHospitals = () => {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    name: "", city: "", state: "", category: "general", pricing_tier: "standard",
    consultation_cost: "", contact_phone: "", latitude: "", longitude: ""
  });

  const load = () => getHospitals().then(setHospitals);
  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm({ name: "", city: "", state: "", category: "general", pricing_tier: "standard", consultation_cost: "", contact_phone: "", latitude: "", longitude: "" });
    setEditing(null);
  };

  const openEdit = (h: any) => {
    setEditing(h);
    setForm({
      name: h.name, city: h.city, state: h.state || "", category: h.category,
      pricing_tier: h.pricing_tier || "standard", consultation_cost: h.consultation_cost?.toString() || "",
      contact_phone: h.contact_phone || "", latitude: h.latitude?.toString() || "", longitude: h.longitude?.toString() || ""
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.city.trim()) { toast.error("Name and city are required"); return; }
    try {
      await upsertHospital({
        ...(editing?.id ? { id: editing.id } : {}),
        name: form.name.trim(), city: form.city.trim(), state: form.state.trim() || undefined,
        category: form.category, pricing_tier: form.pricing_tier,
        consultation_cost: form.consultation_cost ? Number(form.consultation_cost) : undefined,
        contact_phone: form.contact_phone.trim() || undefined,
        latitude: form.latitude ? Number(form.latitude) : undefined,
        longitude: form.longitude ? Number(form.longitude) : undefined,
      });
      await logAdminAction(editing ? "updated" : "created", "hospital", editing?.id, { name: form.name });
      toast.success(editing ? "Hospital updated" : "Hospital added");
      setDialogOpen(false);
      resetForm();
      load();
    } catch (e: any) { toast.error(e.message); }
  };

  const handleDelete = async (h: any) => {
    if (!confirm(`Delete ${h.name}?`)) return;
    try {
      await deleteHospital(h.id);
      await logAdminAction("deleted", "hospital", h.id, { name: h.name });
      toast.success("Hospital deleted");
      load();
    } catch (e: any) { toast.error(e.message); }
  };

  const filtered = hospitals.filter((h) =>
    h.name.toLowerCase().includes(search.toLowerCase()) || h.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" /> Hospitals
          </h1>
          <p className="text-sm text-muted-foreground">{hospitals.length} hospitals registered</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-1" /> Add Hospital</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "Edit Hospital" : "Add Hospital"}</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <Input placeholder="Hospital name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="City *" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                <Input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="multi-specialty">Multi-Specialty</SelectItem>
                    <SelectItem value="super-specialty">Super-Specialty</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={form.pricing_tier} onValueChange={(v) => setForm({ ...form, pricing_tier: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input placeholder="Consultation cost (₹)" type="number" value={form.consultation_cost} onChange={(e) => setForm({ ...form, consultation_cost: e.target.value })} />
              <Input placeholder="Contact phone" value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Latitude" type="number" step="any" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} />
                <Input placeholder="Longitude" type="number" step="any" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} />
              </div>
              <Button onClick={handleSave} className="gradient-primary text-primary-foreground">{editing ? "Update" : "Add"} Hospital</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search hospitals..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="grid gap-3">
        {filtered.map((h) => (
          <Card key={h.id} className="shadow-card">
            <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{h.name}</h3>
                <p className="text-sm text-muted-foreground">{h.city}{h.state ? `, ${h.state}` : ""}</p>
                <div className="flex gap-2 mt-1.5 flex-wrap">
                  <Badge variant="secondary" className="text-xs capitalize">{h.category}</Badge>
                  <Badge variant="outline" className="text-xs capitalize">{h.pricing_tier}</Badge>
                  {h.consultation_cost && <Badge variant="outline" className="text-xs">₹{h.consultation_cost}</Badge>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEdit(h)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(h)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-muted-foreground text-center py-8">No hospitals found</p>}
      </div>
    </div>
  );
};

export default AdminHospitals;
