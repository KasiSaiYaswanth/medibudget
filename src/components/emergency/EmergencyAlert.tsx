import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Phone,
  MapPin,
  Navigation,
  X,
  Loader2,
  Building2,
  Siren,
  Heart,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getUserLocation,
  fetchNearbyHospitals,
  type NearbyHospital,
} from "@/lib/locationService";
import { toast } from "sonner";

interface EmergencyAlertProps {
  detectedSymptom: string;
  onDismiss: () => void;
}

const EMERGENCY_CONTACTS = [
  { label: "Emergency (India)", number: "112", icon: Siren },
  { label: "Ambulance", number: "108", icon: Heart },
  { label: "AIIMS Helpline", number: "1800-599-0019", icon: Phone },
];

const FIRST_AID_TIPS: Record<string, string[]> = {
  "chest pain": [
    "Sit down and rest in a comfortable position",
    "Chew an aspirin (300mg) if not allergic",
    "Loosen any tight clothing",
    "Do NOT exert yourself physically",
  ],
  "breathing difficulty": [
    "Sit upright — do not lie flat",
    "Loosen tight clothing around chest and neck",
    "Try pursed-lip breathing: inhale through nose, exhale slowly through pursed lips",
    "If you have an inhaler, use it now",
  ],
  "stroke": [
    "Note the time symptoms started — critical for treatment",
    "Use FAST: Face drooping, Arm weakness, Speech difficulty, Time to call emergency",
    "Do NOT give food, water, or medication",
    "Keep the person still and comfortable",
  ],
  "unconsciousness": [
    "Check for breathing and pulse",
    "Place the person in recovery position (on their side)",
    "Do NOT put anything in their mouth",
    "Clear the area of any hazards",
  ],
  default: [
    "Stay calm and call emergency services immediately",
    "Do not move unless in immediate danger",
    "If possible, have someone stay with you",
    "Keep airways clear and monitor breathing",
  ],
};

function getFirstAidTips(symptom: string): string[] {
  const s = symptom.toLowerCase();
  for (const key of Object.keys(FIRST_AID_TIPS)) {
    if (key !== "default" && s.includes(key)) return FIRST_AID_TIPS[key];
  }
  return FIRST_AID_TIPS.default;
}

const EmergencyAlert = ({ detectedSymptom, onDismiss }: EmergencyAlertProps) => {
  const [hospitals, setHospitals] = useState<NearbyHospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const pos = await getUserLocation();
        const hosp = await fetchNearbyHospitals(pos.coords.latitude, pos.coords.longitude, 5);
        setHospitals(hosp.slice(0, 5));
      } catch {
        setLocationError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openDirections = (lat: number, lon: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=driving`, "_blank");
  };

  const tips = getFirstAidTips(detectedSymptom);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-destructive/5 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 pt-8"
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        className="w-full max-w-lg space-y-4 pb-8"
      >
        {/* Header */}
        <Card className="border-2 border-destructive shadow-elevated bg-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="h-12 w-12 rounded-xl bg-destructive flex items-center justify-center flex-shrink-0"
                >
                  <AlertTriangle className="h-6 w-6 text-destructive-foreground" />
                </motion.div>
                <div>
                  <h2 className="text-lg font-bold text-destructive">Emergency Detected</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    High-risk symptom: <span className="font-semibold text-foreground">{detectedSymptom}</span>
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onDismiss} className="flex-shrink-0 -mt-1 -mr-1">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
              <p className="text-sm font-semibold text-destructive">
                ⚠️ Please seek immediate medical attention!
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Call emergency services or go to the nearest hospital immediately.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card className="shadow-card">
          <CardContent className="p-4 space-y-2">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Phone className="h-4 w-4 text-destructive" /> Emergency Contacts
            </h3>
            <div className="grid gap-2">
              {EMERGENCY_CONTACTS.map((contact) => (
                <a
                  key={contact.number}
                  href={`tel:${contact.number}`}
                  className="flex items-center justify-between p-3 rounded-xl border-2 border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-destructive flex items-center justify-center">
                      <contact.icon className="h-5 w-5 text-destructive-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{contact.label}</p>
                      <p className="text-lg font-bold text-destructive">{contact.number}</p>
                    </div>
                  </div>
                  <Button variant="destructive" size="sm">
                    <Phone className="h-4 w-4 mr-1" /> Call
                  </Button>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Nearest Hospitals */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
              <Building2 className="h-4 w-4 text-primary" /> Nearest Emergency Hospitals
            </h3>

            {loading ? (
              <div className="flex flex-col items-center gap-2 py-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-xs text-muted-foreground">Finding hospitals within 5 km...</p>
              </div>
            ) : locationError ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  Unable to access location. Please enable GPS and try again.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setLoading(true);
                    setLocationError(false);
                    getUserLocation()
                      .then((pos) => fetchNearbyHospitals(pos.coords.latitude, pos.coords.longitude, 5))
                      .then((h) => { setHospitals(h.slice(0, 5)); setLoading(false); })
                      .catch(() => { setLocationError(true); setLoading(false); });
                  }}
                >
                  <MapPin className="h-3.5 w-3.5 mr-1" /> Retry Location
                </Button>
              </div>
            ) : hospitals.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hospitals found within 5 km. Call emergency services for ambulance dispatch.
              </p>
            ) : (
              <div className="space-y-2">
                {hospitals.map((h, i) => (
                  <motion.div
                    key={h.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="text-sm font-semibold text-foreground truncate">{h.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {h.typeLabel}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <MapPin className="h-2.5 w-2.5" /> {h.distance} km
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-shrink-0 border-primary/30 text-primary hover:bg-primary/5"
                      onClick={() => openDirections(h.lat, h.lon)}
                    >
                      <Navigation className="h-3.5 w-3.5 mr-1" /> Navigate
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* First Aid Tips */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-accent" /> Emergency Guidance
            </h3>
            <div className="space-y-2">
              {tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="h-5 w-5 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-foreground">{tip}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl bg-secondary border border-border">
              <p className="text-xs text-muted-foreground">
                ⚕️ These are general first-aid suggestions only. Always follow instructions from emergency medical dispatchers.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Dismiss */}
        <div className="text-center">
          <Button variant="ghost" size="sm" onClick={onDismiss} className="text-muted-foreground">
            I understand — close emergency alert
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EmergencyAlert;

/**
 * Checks if text contains emergency-level symptoms.
 * Returns the matched symptom phrase or null.
 */
export function detectEmergencySymptom(text: string): string | null {
  const patterns = [
    { regex: /severe\s+chest\s+pain|chest\s+pain.*severe|crushing.*chest/i, label: "Severe Chest Pain" },
    { regex: /breathing\s+difficult|difficulty\s+breathing|can'?t\s+breathe|shortness\s+of\s+breath|breathless/i, label: "Breathing Difficulty" },
    { regex: /unconscious|loss\s+of\s+consciousness|faint(ed|ing)|passed?\s+out|unresponsive/i, label: "Unconsciousness" },
    { regex: /stroke|face\s+droop|slurred?\s+speech|sudden\s+numbness|paralysis/i, label: "Stroke Indicators" },
    { regex: /severe\s+(bleeding|hemorrhag|haemorrhag)|heavy\s+bleeding|blood\s+loss/i, label: "Severe Bleeding" },
    { regex: /heart\s+attack|cardiac\s+arrest/i, label: "Heart Attack" },
    { regex: /seizure|convulsion|epileptic/i, label: "Seizure" },
    { regex: /anaphyla|severe\s+allergic|throat\s+swell/i, label: "Severe Allergic Reaction" },
    { regex: /severe\s+burn|third\s+degree\s+burn/i, label: "Severe Burns" },
    { regex: /suicid|self[- ]harm|want\s+to\s+die/i, label: "Mental Health Emergency" },
  ];

  for (const { regex, label } of patterns) {
    if (regex.test(text)) return label;
  }
  return null;
}
