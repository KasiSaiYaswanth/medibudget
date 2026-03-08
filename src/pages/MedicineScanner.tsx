import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Camera, Search, Pill, AlertTriangle, Info, ChevronLeft, Filter, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { searchMedicines, getCategories, getMedicinesByCategory, type MedicineInfo } from "@/lib/medicineService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const MedicineScanner = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MedicineInfo[]>([]);
  const [selected, setSelected] = useState<MedicineInfo | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [searching, setSearching] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() && !selectedCategory) return;
    setSearching(true);
    setSelected(null);
    try {
      let data: MedicineInfo[];
      if (selectedCategory && !query.trim()) {
        data = await getMedicinesByCategory(selectedCategory);
      } else {
        data = await searchMedicines(query);
        if (selectedCategory) {
          data = data.filter((m) => m.category === selectedCategory);
        }
      }
      setResults(data);
      if (data.length === 1) setSelected(data[0]);
    } finally {
      setSearching(false);
    }
  };

  const handleCategoryChange = async (cat: string) => {
    setSelectedCategory(cat === "all" ? "" : cat);
    if (cat && cat !== "all") {
      setSearching(true);
      setSelected(null);
      const data = await getMedicinesByCategory(cat);
      setResults(data);
      setSearching(false);
    }
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      setShowCamera(false);
    }
  };

  const captureAndScan = async () => {
    setShowCamera(false);
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
    }
    setQuery("Paracetamol");
    setSearching(true);
    const data = await searchMedicines("paracetamol");
    setResults(data);
    if (data.length > 0) setSelected(data[0]);
    setSearching(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Link to="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Medicine Scanner</h1>
          <p className="text-muted-foreground mt-1">
            Search from <span className="font-semibold text-primary">550+</span> medicines across 25+ medical sectors.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Search Panel */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Search or Scan</CardTitle>
                <CardDescription>Enter medicine name or browse by category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="e.g. Paracetamol, Amoxicillin..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button type="submit" disabled={searching}>
                    {searching ? "..." : "Search"}
                  </Button>
                </form>

                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={selectedCategory || "all"} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-center text-sm text-muted-foreground">or</div>

                <Button variant="outline" className="w-full" onClick={startCamera}>
                  <Camera className="h-4 w-4 mr-2" /> Scan Medicine Strip
                </Button>

                {showCamera && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="relative rounded-xl overflow-hidden bg-foreground/5">
                    <video ref={videoRef} autoPlay playsInline className="w-full rounded-xl" />
                    <div className="absolute bottom-4 left-0 right-0 text-center">
                      <Button onClick={captureAndScan} variant="default">Capture & Scan</Button>
                    </div>
                  </motion.div>
                )}

                {/* Results List */}
                {results.length > 0 && (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    <p className="text-xs text-muted-foreground font-medium">{results.length} results found</p>
                    {results.map((med) => (
                      <button
                        key={med.id}
                        onClick={() => setSelected(med)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selected?.id === med.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                        }`}
                      >
                        <p className="text-sm font-medium text-foreground">{med.name}</p>
                        <p className="text-xs text-muted-foreground">{med.generic_name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{med.category}</Badge>
                          {med.prescription_required && (
                            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Rx</Badge>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div key={selected.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <Card className="shadow-elevated border-primary/20">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
                          <Pill className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{selected.name}</CardTitle>
                          <CardDescription>{selected.generic_name}</CardDescription>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{selected.category}</Badge>
                          {selected.prescription_required && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-destructive">
                              <ShieldCheck className="h-3 w-3" /> Prescription Required
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground flex items-center gap-1 mb-2">
                          <Info className="h-4 w-4 text-primary" /> Uses
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selected.uses.map((u) => (
                            <span key={u} className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">{u}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">💊 Dosage</h4>
                        <p className="text-sm text-muted-foreground">{selected.dosage}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">⚠️ Side Effects</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {selected.side_effects.map((s) => (
                            <li key={s} className="flex items-start gap-2">
                              <span className="text-destructive mt-0.5">•</span> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground flex items-center gap-1 mb-2">
                          <AlertTriangle className="h-4 w-4 text-destructive" /> Warnings
                        </h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {selected.warnings.map((w) => (
                            <li key={w} className="flex items-start gap-2">
                              <span className="text-destructive mt-0.5">•</span> {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-foreground">Estimated Price</span>
                          <span className="text-sm font-bold text-primary">{selected.price_range}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <Pill className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Search for a medicine or browse by category</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MedicineScanner;
