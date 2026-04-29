// Maps for converting stored enum-like values into human readable labels.
// Used by the admin Farmer Detail modal (en/te) and the English PDF export.

import { t, type Language } from "./i18n";

type Map = Record<string, { en: string; te: string }>;

const yesNo: Map = {
  yes: { en: "Yes", te: "అవును" },
  no: { en: "No", te: "లేదు" },
  "": { en: "-", te: "-" },
};

const gender: Map = {
  male: { en: "Male", te: "పురుషుడు" },
  female: { en: "Female", te: "స్త్రీ" },
  other: { en: "Other", te: "ఇతర" },
};

const education: Map = {
  illiterate: { en: "Illiterate", te: "నిరక్షరాస్యుడు" },
  primary: { en: "Primary", te: "ప్రాథమిక" },
  secondary: { en: "Secondary", te: "మాధ్యమిక" },
  "higher-secondary": { en: "Higher Secondary", te: "ఉన్నత మాధ్యమిక" },
  graduate: { en: "Graduate", te: "గ్రాడ్యుయేట్" },
  "post-graduate": { en: "Post Graduate", te: "పోస్ట్ గ్రాడ్యుయేట్" },
};

const landType: Map = {
  dry: { en: "Dry", te: "పొడి" },
  wet: { en: "Wet", te: "తడి" },
  irrigated: { en: "Irrigated", te: "సాగునీటి" },
};

const soilType: Map = {
  red: { en: "Red Soil", te: "ఎర్ర మట్టి" },
  black: { en: "Black Soil", te: "నల్ల మట్టి" },
  alluvial: { en: "Alluvial", te: "ఒండ్రు" },
  sandy: { en: "Sandy", te: "ఇసుక" },
  clay: { en: "Clay", te: "బంక మట్టి" },
};

const waterSource: Map = {
  borewell: { en: "Borewell", te: "బోరుబావి" },
  well: { en: "Well / Pond", te: "బావి / చెరువు" },
  canal: { en: "Canal", te: "కాలువ" },
  tank: { en: "Tank", te: "ట్యాంక్" },
  rain: { en: "Rain-fed", te: "వర్షాధారం" },
  river: { en: "River", te: "నది" },
};

const irrigation: Map = {
  drip: { en: "Drip", te: "బిందు" },
  sprinkler: { en: "Sprinkler", te: "తుంపర" },
  rainhose: { en: "Rain Hose", te: "రెయిన్ హోస్" },
  flood: { en: "Flood", te: "ముంపు" },
  furrow: { en: "Furrow", te: "కాలువ" },
};

const season: Map = {
  kharif: { en: "Kharif", te: "ఖరీఫ్" },
  rabi: { en: "Rabi", te: "రబీ" },
  perennial: { en: "Perennial", te: "బహువార్షిక" },
};

const farmingType: Map = {
  natural: { en: "Natural Farming", te: "సహజ వ్యవసాయం" },
  chemical: { en: "Chemical Farming", te: "రసాయన వ్యవసాయం" },
  terrace: { en: "Terrace Gardening", te: "టెర్రస్ గార్డెనింగ్" },
  both: { en: "Both Natural & Chemical", te: "సహజ + రసాయన" },
  others: { en: "Others", te: "ఇతర" },
};

const variety: Map = {
  local: { en: "Local", te: "స్థానిక" },
  hybrid: { en: "Hybrid", te: "సంకరం" },
  "ht-bt": { en: "HT/BT", te: "HT/BT" },
  improved: { en: "Improved", te: "మెరుగైన" },
};

const dicts: Record<string, Map> = {
  yesNo, gender, education, landType, soilType, waterSource,
  irrigation, season, farmingType, variety,
};

/** Look up a known enum value in any dictionary. Falls back to the raw value. */
export function labelFor(dict: keyof typeof dicts, value: string, lang: Language): string {
  if (!value) return "-";
  return dicts[dict]?.[value]?.[lang] ?? value;
}

/** Translate a comma/semicolon separated list of enum values. */
export function listLabels(dict: keyof typeof dicts, value: string, lang: Language): string {
  if (!value) return "-";
  return value
    .split(/[,;]\s*/)
    .map((v) => labelFor(dict, v.trim(), lang))
    .join(", ");
}

/** Translate a crop value via i18n keys (crop.*). */
export function cropLabel(value: string, lang: Language): string {
  if (!value) return "-";
  const key = `crop.${value}`;
  const tr = t(key, lang);
  return tr === key ? value : tr;
}

/** Translate a weed value via i18n keys (weed.*). */
export function weedLabel(value: string, lang: Language): string {
  if (!value) return "-";
  const key = `weed.${value}`;
  const tr = t(key, lang);
  return tr === key ? value : tr;
}

/** Translate an equipment value via i18n keys (equip.*). */
export function equipLabel(value: string, lang: Language): string {
  if (!value) return "-";
  const key = `equip.${value}`;
  const tr = t(key, lang);
  return tr === key ? value : tr;
}

export function plain(value: unknown): string {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
}

