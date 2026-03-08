/**
 * Offline Symptom → Condition → Cost Estimation Engine
 * Uses locally cached reference data when device is offline.
 */

export interface SymptomMapping {
  symptom: string;
  conditions: { name: string; conditionKey: string; confidence: number }[];
}

export interface OfflineCondition {
  key: string;
  label: string;
  baseCost: { consultation: number; tests: number; medicines: number; treatment: number };
}

export interface CityMultiplier {
  value: string;
  label: string;
  state: string;
  multiplier: number;
}

export interface HospitalTypeMultiplier {
  value: string;
  label: string;
  multiplier: number;
}

// Bundled offline symptom knowledge base
export const SYMPTOM_DB: SymptomMapping[] = [
  { symptom: "fever", conditions: [{ name: "Fever / Common Cold", conditionKey: "fever", confidence: 0.85 }, { name: "Dengue", conditionKey: "fever", confidence: 0.3 }] },
  { symptom: "headache", conditions: [{ name: "Tension Headache", conditionKey: "neuro", confidence: 0.7 }, { name: "Migraine", conditionKey: "neuro", confidence: 0.5 }] },
  { symptom: "chest pain", conditions: [{ name: "Cardiac Check-up", conditionKey: "cardiac", confidence: 0.75 }, { name: "Gastric reflux", conditionKey: "fever", confidence: 0.3 }] },
  { symptom: "stomach pain", conditions: [{ name: "Appendicitis", conditionKey: "appendix", confidence: 0.4 }, { name: "Gastritis", conditionKey: "fever", confidence: 0.5 }] },
  { symptom: "back pain", conditions: [{ name: "Spine Issue", conditionKey: "spine", confidence: 0.5 }, { name: "Muscle strain", conditionKey: "fracture", confidence: 0.4 }] },
  { symptom: "knee pain", conditions: [{ name: "Knee Arthritis", conditionKey: "knee", confidence: 0.6 }, { name: "Ligament Injury", conditionKey: "fracture", confidence: 0.4 }] },
  { symptom: "blurred vision", conditions: [{ name: "Eye / Cataract", conditionKey: "eye", confidence: 0.65 }, { name: "Diabetes", conditionKey: "diabetes", confidence: 0.3 }] },
  { symptom: "fatigue", conditions: [{ name: "Thyroid Disorder", conditionKey: "thyroid", confidence: 0.5 }, { name: "Diabetes", conditionKey: "diabetes", confidence: 0.4 }] },
  { symptom: "skin rash", conditions: [{ name: "Dermatology", conditionKey: "skin", confidence: 0.8 }] },
  { symptom: "tooth pain", conditions: [{ name: "Dental Treatment", conditionKey: "dental", confidence: 0.85 }] },
  { symptom: "frequent urination", conditions: [{ name: "Diabetes", conditionKey: "diabetes", confidence: 0.6 }, { name: "Kidney Issue", conditionKey: "kidney", confidence: 0.4 }] },
  { symptom: "weight gain", conditions: [{ name: "Thyroid Disorder", conditionKey: "thyroid", confidence: 0.55 }] },
  { symptom: "breathlessness", conditions: [{ name: "Cardiac Issue", conditionKey: "cardiac", confidence: 0.65 }] },
  { symptom: "cough", conditions: [{ name: "Common Cold", conditionKey: "fever", confidence: 0.7 }] },
  { symptom: "swelling", conditions: [{ name: "Kidney Issue", conditionKey: "kidney", confidence: 0.45 }, { name: "Fracture", conditionKey: "fracture", confidence: 0.35 }] },
];

export const OFFLINE_CONDITIONS: OfflineCondition[] = [
  { key: "fever", label: "Fever / Common Cold", baseCost: { consultation: 300, tests: 500, medicines: 200, treatment: 0 } },
  { key: "fracture", label: "Bone Fracture", baseCost: { consultation: 500, tests: 2000, medicines: 800, treatment: 15000 } },
  { key: "cardiac", label: "Cardiac Check-up", baseCost: { consultation: 800, tests: 5000, medicines: 1500, treatment: 0 } },
  { key: "dental", label: "Dental Treatment", baseCost: { consultation: 400, tests: 800, medicines: 300, treatment: 5000 } },
  { key: "eye", label: "Eye / Cataract", baseCost: { consultation: 500, tests: 1500, medicines: 600, treatment: 25000 } },
  { key: "skin", label: "Dermatology", baseCost: { consultation: 400, tests: 1000, medicines: 500, treatment: 2000 } },
  { key: "diabetes", label: "Diabetes Management", baseCost: { consultation: 500, tests: 2000, medicines: 1500, treatment: 0 } },
  { key: "thyroid", label: "Thyroid Treatment", baseCost: { consultation: 400, tests: 1500, medicines: 500, treatment: 0 } },
  { key: "neuro", label: "Neurological Consultation", baseCost: { consultation: 800, tests: 5000, medicines: 2000, treatment: 0 } },
  { key: "appendix", label: "Appendicitis Surgery", baseCost: { consultation: 500, tests: 3000, medicines: 1000, treatment: 30000 } },
  { key: "kidney", label: "Kidney Treatment", baseCost: { consultation: 800, tests: 8000, medicines: 3000, treatment: 50000 } },
  { key: "spine", label: "Spine Surgery", baseCost: { consultation: 1500, tests: 10000, medicines: 5000, treatment: 300000 } },
  { key: "knee", label: "Knee Replacement", baseCost: { consultation: 1000, tests: 8000, medicines: 3000, treatment: 200000 } },
];

export const HOSPITAL_TYPES: HospitalTypeMultiplier[] = [
  { value: "government", label: "Government Hospital", multiplier: 0.3 },
  { value: "private", label: "Private Hospital", multiplier: 1.0 },
  { value: "corporate", label: "Corporate Hospital", multiplier: 1.8 },
  { value: "trust", label: "Trust / Charitable", multiplier: 0.5 },
];

// Top city multipliers bundled for offline use
export const TOP_CITY_MULTIPLIERS: CityMultiplier[] = [
  { value: "mumbai", label: "Mumbai", state: "Maharashtra", multiplier: 1.6 },
  { value: "delhi", label: "New Delhi", state: "Delhi", multiplier: 1.5 },
  { value: "bangalore", label: "Bengaluru", state: "Karnataka", multiplier: 1.35 },
  { value: "chennai", label: "Chennai", state: "Tamil Nadu", multiplier: 1.3 },
  { value: "hyderabad", label: "Hyderabad", state: "Telangana", multiplier: 1.25 },
  { value: "pune", label: "Pune", state: "Maharashtra", multiplier: 1.25 },
  { value: "kolkata", label: "Kolkata", state: "West Bengal", multiplier: 1.15 },
  { value: "kochi", label: "Kochi", state: "Kerala", multiplier: 1.15 },
  { value: "ahmedabad", label: "Ahmedabad", state: "Gujarat", multiplier: 1.15 },
  { value: "jaipur", label: "Jaipur", state: "Rajasthan", multiplier: 1.05 },
  { value: "lucknow", label: "Lucknow", state: "Uttar Pradesh", multiplier: 0.95 },
  { value: "patna", label: "Patna", state: "Bihar", multiplier: 0.85 },
];

/** Match user text against symptom DB */
export function matchSymptoms(text: string) {
  const lower = text.toLowerCase();
  const matches: SymptomMapping["conditions"][0][] = [];

  for (const entry of SYMPTOM_DB) {
    if (lower.includes(entry.symptom)) {
      matches.push(...entry.conditions);
    }
  }

  // Deduplicate by conditionKey, keep highest confidence
  const seen = new Map<string, (typeof matches)[0]>();
  for (const m of matches) {
    const existing = seen.get(m.conditionKey);
    if (!existing || m.confidence > existing.confidence) {
      seen.set(m.conditionKey, m);
    }
  }

  return Array.from(seen.values()).sort((a, b) => b.confidence - a.confidence);
}

/** Calculate offline cost estimate */
export function calculateOfflineEstimate(
  conditionKey: string,
  cityValue: string,
  hospitalTypeValue: string
) {
  const condition = OFFLINE_CONDITIONS.find((c) => c.key === conditionKey);
  const city = TOP_CITY_MULTIPLIERS.find((c) => c.value === cityValue);
  const hospital = HOSPITAL_TYPES.find((h) => h.value === hospitalTypeValue);

  if (!condition) return null;

  const cm = city?.multiplier ?? 1.0;
  const hm = hospital?.multiplier ?? 1.0;

  const consultation = Math.round(condition.baseCost.consultation * cm * hm);
  const tests = Math.round(condition.baseCost.tests * cm * hm);
  const medicines = Math.round(condition.baseCost.medicines * cm * hm);
  const treatment = Math.round(condition.baseCost.treatment * cm * hm);

  return {
    condition: condition.label,
    city: city?.label ?? "Average",
    hospitalType: hospital?.label ?? "Private Hospital",
    consultation,
    tests,
    medicines,
    treatment,
    total: consultation + tests + medicines + treatment,
    cityMultiplier: cm,
    hospitalMultiplier: hm,
    isOfflineEstimate: true,
  };
}
