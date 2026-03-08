import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Thermometer,
  Brain,
  Wind,
  Droplets,
  Activity,
  Pill,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SymptomMedicine {
  name: string;
  generic: string;
  dosage: string;
  purpose: string;
  otc: boolean;
}

interface SymptomCategory {
  id: string;
  label: string;
  icon: any;
  color: string;
  medicines: SymptomMedicine[];
}

const symptomCategories: SymptomCategory[] = [
  {
    id: "cold",
    label: "Cold",
    icon: Wind,
    color: "text-blue-500",
    medicines: [
      { name: "Cetirizine 10mg", generic: "Cetirizine Hydrochloride", dosage: "10mg once daily", purpose: "Relieves sneezing, runny nose, and cold symptoms", otc: true },
      { name: "Levocetirizine 5mg", generic: "Levocetirizine", dosage: "5mg once daily at bedtime", purpose: "Antihistamine for cold and allergy relief", otc: true },
      { name: "Chlorpheniramine 4mg", generic: "Chlorpheniramine Maleate", dosage: "4mg every 4-6 hours", purpose: "Relieves cold, sneezing, and watery eyes", otc: true },
      { name: "Vicks VapoRub", generic: "Camphor + Menthol + Eucalyptus", dosage: "Apply on chest 2-3 times daily", purpose: "Topical relief for nasal congestion and cold", otc: true },
    ],
  },
  {
    id: "fever",
    label: "Fever",
    icon: Thermometer,
    color: "text-red-500",
    medicines: [
      { name: "Paracetamol 500mg", generic: "Acetaminophen", dosage: "500-650mg every 4-6 hours", purpose: "Reduces fever and relieves mild pain", otc: true },
      { name: "Disprin 350mg", generic: "Aspirin", dosage: "1-2 tablets in water, up to 3 times daily", purpose: "Fever reducer and mild pain relief", otc: true },
      { name: "Ibuprofen 400mg", generic: "Ibuprofen", dosage: "200-400mg every 6-8 hours", purpose: "Anti-inflammatory, fever reducer", otc: true },
      { name: "ORS Sachets", generic: "Oral Rehydration Salts", dosage: "1 sachet in 1L water, sip frequently", purpose: "Prevents dehydration during fever", otc: true },
    ],
  },
  {
    id: "headache",
    label: "Headache",
    icon: Brain,
    color: "text-purple-500",
    medicines: [
      { name: "Paracetamol 500mg", generic: "Acetaminophen", dosage: "500-1000mg every 4-6 hours", purpose: "First-line treatment for headache", otc: true },
      { name: "Ibuprofen 400mg", generic: "Ibuprofen", dosage: "200-400mg every 6-8 hours with food", purpose: "Pain relief with anti-inflammatory action", otc: true },
      { name: "Paracetamol + Caffeine", generic: "Paracetamol 500mg + Caffeine 65mg", dosage: "1-2 tablets every 6 hours", purpose: "Enhanced headache relief with caffeine", otc: true },
      { name: "Disprin 350mg", generic: "Aspirin", dosage: "1-2 tablets dissolved in water", purpose: "Fast-acting headache relief", otc: true },
    ],
  },
  {
    id: "cough",
    label: "Cough",
    icon: Wind,
    color: "text-teal-500",
    medicines: [
      { name: "Ambroxol 30mg", generic: "Ambroxol Hydrochloride", dosage: "30mg 2-3 times daily", purpose: "Loosens mucus for productive cough", otc: true },
      { name: "Dextromethorphan 15mg", generic: "Dextromethorphan", dosage: "15-30mg every 6-8 hours", purpose: "Cough suppressant", otc: true },
      { name: "Benadryl Cough Syrup", generic: "Diphenhydramine + Ammonium Chloride", dosage: "5-10ml every 4-6 hours", purpose: "Relieves cough and sore throat", otc: true },
    ],
  },
  {
    id: "dry-cough",
    label: "Dry Cough",
    icon: Droplets,
    color: "text-orange-500",
    medicines: [
      { name: "Dextromethorphan 15mg", generic: "Dextromethorphan HBr", dosage: "15-30mg every 6-8 hours", purpose: "Suppresses dry, non-productive cough", otc: true },
      { name: "Benzonatate 100mg", generic: "Benzonatate", dosage: "100mg three times daily", purpose: "Numbs cough reflex for dry cough", otc: false },
      { name: "Honey + Warm Water", generic: "Natural remedy", dosage: "1 tbsp honey in warm water, 2-3 times daily", purpose: "Soothes throat and reduces cough", otc: true },
    ],
  },
  {
    id: "sneezing",
    label: "Sneezing",
    icon: Wind,
    color: "text-cyan-500",
    medicines: [
      { name: "Cetirizine 10mg", generic: "Cetirizine Hydrochloride", dosage: "10mg once daily", purpose: "Antihistamine for allergic sneezing", otc: true },
      { name: "Loratadine 10mg", generic: "Loratadine", dosage: "10mg once daily", purpose: "Non-drowsy antihistamine for sneezing", otc: true },
      { name: "Chlorpheniramine 4mg", generic: "Chlorpheniramine Maleate", dosage: "4mg every 4-6 hours", purpose: "Relieves sneezing and runny nose", otc: true },
    ],
  },
  {
    id: "leg-pain",
    label: "Leg / Muscle Pain",
    icon: Activity,
    color: "text-amber-500",
    medicines: [
      { name: "Ibuprofen 400mg", generic: "Ibuprofen", dosage: "200-400mg every 6-8 hours with food", purpose: "Anti-inflammatory pain relief", otc: true },
      { name: "Diclofenac 50mg", generic: "Diclofenac Sodium", dosage: "50mg 2-3 times daily after food", purpose: "Strong pain relief for muscle and joint pain", otc: true },
      { name: "Volini Spray", generic: "Diclofenac Diethylamine", dosage: "Spray on affected area 3-4 times daily", purpose: "Topical pain relief for muscles", otc: true },
      { name: "Aceclofenac + Paracetamol", generic: "Aceclofenac 100mg + Paracetamol 325mg", dosage: "1 tablet twice daily after food", purpose: "Combination pain and inflammation relief", otc: true },
    ],
  },
  {
    id: "stomach-pain",
    label: "Stomach Pain",
    icon: Activity,
    color: "text-green-500",
    medicines: [
      { name: "Antacid Tablets", generic: "Aluminium Hydroxide + Magnesium Hydroxide", dosage: "1-2 tablets after meals", purpose: "Neutralizes stomach acid, relieves pain", otc: true },
      { name: "Pantoprazole 40mg", generic: "Pantoprazole Sodium", dosage: "40mg once daily before breakfast", purpose: "Reduces stomach acid production", otc: false },
      { name: "Dicyclomine 20mg", generic: "Dicyclomine Hydrochloride", dosage: "20mg 3-4 times daily", purpose: "Relieves stomach cramps and spasms", otc: false },
      { name: "ORS Sachets", generic: "Oral Rehydration Salts", dosage: "1 sachet in 1L water", purpose: "Rehydration for stomach upset and vomiting", otc: true },
    ],
  },
];

interface Props {
  onMedicineSearch: (name: string) => void;
}

const SymptomMedicineGuide = ({ onMedicineSearch }: Props) => {
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [expandedMedicine, setExpandedMedicine] = useState<string | null>(null);

  const selected = symptomCategories.find((s) => s.id === selectedSymptom);

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Pill className="h-4 w-4 text-primary" />
          Symptom-Based Medicine Guide
        </CardTitle>
        <CardDescription className="text-xs">
          Select a symptom to see commonly used medicines
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Symptom Chips */}
        <div className="flex flex-wrap gap-2">
          {symptomCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                setSelectedSymptom(selectedSymptom === cat.id ? null : cat.id)
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                selectedSymptom === cat.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-foreground border-border hover:border-primary/40"
              }`}
            >
              <cat.icon className={`h-3 w-3 ${selectedSymptom === cat.id ? "" : cat.color}`} />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Medicine List */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              <p className="text-xs font-semibold text-foreground">
                Common medicines for {selected.label}:
              </p>

              {selected.medicines.map((med, i) => (
                <motion.div
                  key={med.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <button
                    onClick={() =>
                      setExpandedMedicine(
                        expandedMedicine === med.name ? null : med.name
                      )
                    }
                    className="w-full text-left p-3 rounded-xl border border-border hover:border-primary/30 transition-all bg-background"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">
                            {med.name}
                          </span>
                          {med.otc ? (
                            <Badge
                              variant="secondary"
                              className="text-[9px] px-1.5 py-0 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            >
                              OTC
                            </Badge>
                          ) : (
                            <Badge
                              variant="destructive"
                              className="text-[9px] px-1.5 py-0"
                            >
                              Rx
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {med.generic}
                        </p>
                      </div>
                      {expandedMedicine === med.name ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>

                    <AnimatePresence>
                      {expandedMedicine === med.name && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 pt-2 border-t border-border space-y-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-start gap-1.5">
                            <Info className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-muted-foreground">
                              {med.purpose}
                            </p>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <Pill className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">Dosage:</span>{" "}
                              {med.dosage}
                            </p>
                          </div>
                          <button
                            onClick={() => onMedicineSearch(med.name.split(" ")[0])}
                            className="text-xs text-primary hover:underline mt-1"
                          >
                            Search in database →
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              ))}

              {/* Disclaimer */}
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-destructive/5 border border-destructive/10">
                <AlertTriangle className="h-3.5 w-3.5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground">
                  These medicines are commonly used for the listed symptoms.
                  Please consult a healthcare professional before taking any
                  medication. If symptoms persist beyond 3 days, seek medical
                  attention.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default SymptomMedicineGuide;
