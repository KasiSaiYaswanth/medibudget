import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Pill, Search } from "lucide-react";
import { getMedicines } from "@/lib/adminService";

const AdminMedicines = () => {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { getMedicines().then((d) => { setMedicines(d); setLoading(false); }); }, []);

  const filtered = medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) || m.generic_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Pill className="h-6 w-6 text-primary" /> Medicine Database</h1>
        <p className="text-sm text-muted-foreground">{medicines.length} medicines</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search medicines..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="grid gap-3">
        {filtered.map((m) => (
          <Card key={m.id} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{m.name}</h3>
                  <p className="text-sm text-muted-foreground">{m.generic_name} • {m.category}</p>
                  <div className="flex gap-2 mt-1.5 flex-wrap">
                    <Badge variant="outline" className="text-xs">{m.dosage}</Badge>
                    <Badge variant="outline" className="text-xs">{m.price_range}</Badge>
                    {m.prescription_required && <Badge variant="destructive" className="text-xs">Rx Required</Badge>}
                  </div>
                  {m.uses?.length > 0 && (
                    <div className="mt-2 flex gap-1 flex-wrap">
                      {m.uses.slice(0, 3).map((u: string, i: number) => <Badge key={i} variant="secondary" className="text-xs">{u}</Badge>)}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-muted-foreground text-center py-8">No medicines found</p>}
      </div>
    </div>
  );
};

export default AdminMedicines;
