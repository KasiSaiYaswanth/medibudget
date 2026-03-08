import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pill,
  AlertTriangle,
  Info,
  ShieldCheck,
  IndianRupee,
  Calculator,
  FlaskConical,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Eye,
  Layers,
  Factory,
  Calendar,
  Hash,
  Copy,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export interface ScannedMedicine {
  is_medicine: boolean;
  medicine_name: string;
  generic_name?: string;
  composition?: string;
  dosage?: string;
  manufacturer?: string;
  batch_number?: string;
  expiry_date?: string;
  mrp?: string;
  barcode_number?: string;
  prescription_required?: boolean;
  category?: string;
  uses?: string[];
  side_effects?: string[];
  warnings?: string[];
  cheaper_alternatives?: Array<{
    name: string;
    generic_name: string;
    estimated_price: string;
  }>;
  confidence: "high" | "medium" | "low";
  raw_text?: string;
}

interface Props {
  result: ScannedMedicine;
  capturedImage: string;
  onScanAgain: () => void;
  onSearchInDb: (name: string) => void;
}

const confidenceConfig = {
  high: { color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", label: "High Confidence" },
  medium: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", label: "Medium Confidence" },
  low: { color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", label: "Low Confidence" },
};

const ScanResultCard = ({ result, capturedImage, onScanAgain, onSearchInDb }: Props) => {
  const conf = confidenceConfig[result.confidence];

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Main Info Card */}
      <Card className="shadow-elevated border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            {/* Captured image thumbnail */}
            <div className="h-16 w-16 rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border">
              <img src={capturedImage} alt="Scanned" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-lg">{result.medicine_name}</CardTitle>
                <Badge className={`text-[10px] ${conf.color}`}>
                  {conf.label}
                </Badge>
              </div>
              {result.generic_name && (
                <CardDescription className="mt-0.5">{result.generic_name}</CardDescription>
              )}
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                {result.category && (
                  <Badge variant="outline" className="text-[10px]">{result.category}</Badge>
                )}
                {result.prescription_required && (
                  <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                    <ShieldCheck className="h-2.5 w-2.5 mr-0.5" /> Rx Required
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Composition */}
          {result.composition && (
            <div>
              <h4 className="text-xs font-semibold text-foreground flex items-center gap-1 mb-1.5">
                <FlaskConical className="h-3.5 w-3.5 text-primary" /> Composition
              </h4>
              <p className="text-sm text-muted-foreground bg-secondary/50 rounded-lg p-2.5">
                {result.composition}
              </p>
            </div>
          )}

          {/* Meta Grid */}
          <div className="grid grid-cols-2 gap-2">
            {result.manufacturer && (
              <div className="p-2.5 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-0.5">
                  <Factory className="h-3 w-3" /> Manufacturer
                </div>
                <p className="text-xs font-medium text-foreground">{result.manufacturer}</p>
              </div>
            )}
            {result.mrp && (
              <div className="p-2.5 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-0.5">
                  <IndianRupee className="h-3 w-3" /> MRP
                </div>
                <p className="text-xs font-medium text-primary">{result.mrp}</p>
              </div>
            )}
            {result.expiry_date && (
              <div className="p-2.5 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-0.5">
                  <Calendar className="h-3 w-3" /> Expiry
                </div>
                <p className="text-xs font-medium text-foreground">{result.expiry_date}</p>
              </div>
            )}
            {result.batch_number && (
              <div className="p-2.5 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-0.5">
                  <Hash className="h-3 w-3" /> Batch No.
                </div>
                <p className="text-xs font-medium text-foreground">{result.batch_number}</p>
              </div>
            )}
          </div>

          {/* Dosage */}
          {result.dosage && (
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-1.5">💊 Dosage</h4>
              <p className="text-sm text-muted-foreground">{result.dosage}</p>
            </div>
          )}

          {/* Uses */}
          {result.uses && result.uses.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-foreground flex items-center gap-1 mb-1.5">
                <Info className="h-3.5 w-3.5 text-primary" /> Uses
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {result.uses.map((u, i) => (
                  <span key={i} className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">
                    {u}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Side Effects */}
          {result.side_effects && result.side_effects.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-1.5">⚠️ Side Effects</h4>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                {result.side_effects.map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-destructive mt-0.5">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings */}
          {result.warnings && result.warnings.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-foreground flex items-center gap-1 mb-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-destructive" /> Warnings
              </h4>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                {result.warnings.map((w, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-destructive mt-0.5">•</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Barcode */}
          {result.barcode_number && (
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/50">
              <div>
                <p className="text-[10px] text-muted-foreground">Barcode</p>
                <p className="text-xs font-mono font-medium text-foreground">{result.barcode_number}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => copyText(result.barcode_number!)}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cheaper Alternatives */}
      {result.cheaper_alternatives && result.cheaper_alternatives.length > 0 && (
        <Card className="shadow-card border-green-500/20">
          <CardHeader className="pb-2 px-4 pt-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-green-500" />
              Cheaper Alternatives
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            {result.cheaper_alternatives.map((alt, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-lg bg-green-500/5 border border-green-500/10"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{alt.name}</p>
                  <p className="text-xs text-muted-foreground">{alt.generic_name}</p>
                </div>
                <span className="text-xs font-bold text-green-600">{alt.estimated_price}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={onScanAgain} className="text-xs">
          Scan Another
        </Button>
        <Button
          variant="outline"
          onClick={() => onSearchInDb(result.medicine_name)}
          className="text-xs"
        >
          <Eye className="h-3.5 w-3.5 mr-1" /> Find in Database
        </Button>
      </div>
      <Link to="/estimate" className="block">
        <Button variant="hero" className="w-full text-xs">
          <Calculator className="h-3.5 w-3.5 mr-1.5" />
          Estimate Treatment Cost
        </Button>
      </Link>

      {/* Disclaimer */}
      <p className="text-[10px] text-muted-foreground text-center italic px-4">
        ⚕️ Medicine information is for educational purposes only. Always consult a healthcare
        professional before taking medication.
      </p>
    </motion.div>
  );
};

export default ScanResultCard;
