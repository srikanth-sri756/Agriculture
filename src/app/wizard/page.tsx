"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLang } from "@/components/providers";
import { t } from "@/lib/i18n";
import Stepper from "@/components/stepper";
import LanguageToggle from "@/components/language-toggle";
import PageBackground from "@/components/page-background";
import {
  personalInfoSchema,
  addressSchema,
  landSchema,
  cropSchema,
  experienceSchema,
  weedsSchema,
  waterSchema,
  equipmentSchema,
  economicsSchema,
  bankingSchema,
  consentSchema,
} from "@/lib/schemas";
import {
  Sprout, ChevronLeft, ChevronRight, Save, Send, Plus, Trash2, LogOut, AlertCircle, Check, MapPin, Camera, X, CheckCircle2, PartyPopper,
} from "lucide-react";
import { getStates, getDistricts, getMandals, getVillages } from "@/lib/area-data";

const TOTAL_STEPS = 13;
const STORAGE_KEY = "ocf-spin-wizard-data";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getStepSchema(step: number): any {
  const schemas = [
    personalInfoSchema,   // 1
    addressSchema,        // 2
    landSchema,           // 3
    cropSchema,           // 4: Kharif
    cropSchema,           // 5: Rabi
    cropSchema,           // 6: Perennial
    experienceSchema,     // 7
    weedsSchema,          // 8
    waterSchema,          // 9
    equipmentSchema,      // 10
    economicsSchema,      // 11
    bankingSchema,        // 12
    consentSchema,        // 13
  ];
  return schemas[step - 1];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getDefaultValues(step: number): any {
  switch (step) {
    case 1: return { name: "", fatherName: "", mobile: "", whatsapp: "", aadhar: "", gender: "", dob: "", caste: "", education: "", photoUrl: "" };
    case 2: return { state: "", district: "", mandal: "", village: "", hamlet: "", pincode: "" };
    case 3: return { lands: [{ surveyNo: "", state: "", district: "", mandal: "", village: "", acreage: "", landType: "", soilType: "", hasSoilReport: "no", photoUrl: "" }] };
    case 4: return { crops: [{ season: "kharif", cropName: "", acreage: "", variety: "", yearlyYield: "", photoUrl: "" }] };
    case 5: return { crops: [{ season: "rabi", cropName: "", acreage: "", variety: "", yearlyYield: "", photoUrl: "" }] };
    case 6: return { crops: [{ season: "perennial", cropName: "", acreage: "", variety: "", yearlyYield: "", photoUrl: "" }] };
    case 7: return { farmingExperienceYears: "", isOrganicFarmer: "", organicSinceYears: "" };
    case 8: return { weeds: [{ weedType: "", percentage: "" }] };
    case 9: return { waterSource: "", irrigationType: "" };
    case 10: return { ownsEquipment: "", equipmentList: [], nearestEquipmentKm: "" };
    case 11: return { pesticideCostPerYear: "", fertilizerCostPerYear: "", seedCostPerYear: "", laborWagesPerYear: "", totalIncomePerYear: "", marketDistance: "" };
    case 12: return { bankName: "", branchName: "", accountNumber: "", ifscCode: "", upiId: "" };
    case 13: return { consentGiven: "" };
    default: return {};
  }
}

export default function WizardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { lang } = useLang();
  const [step, setStep] = useState(1);
  const [allData, setAllData] = useState<Record<string, unknown>>({});
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [statusChecked, setStatusChecked] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Check farmer status — redirect to dashboard if not editable
  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/farmers")
      .then((r) => r.json())
      .then((data) => {
        const farmer = Array.isArray(data) ? data[0] : data;
        if (farmer && (farmer.status === "submitted" || farmer.status === "edit_requested")) {
          router.push("/dashboard");
        } else {
          setStatusChecked(true);
        }
      })
      .catch(() => setStatusChecked(true));
  }, [status, router]);

  // Load saved data from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAllData(parsed);
          // Restore completed steps from saved data
          const completed = new Set<number>();
          for (let i = 1; i <= TOTAL_STEPS; i++) {
            if (parsed[`step${i}`]) completed.add(i);
          }
          setCompletedSteps(completed);
        } catch { /* ignore */ }
      }
    }
  }, []);

  // Save to localStorage whenever allData changes
  const saveToStorage = useCallback((data: Record<string, unknown>) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading" || !statusChecked) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <PageBackground />
        <div className="text-green-800 text-lg animate-pulse">Loading...</div>
      </div>
    );
  }

  const farmerId = (session?.user as { farmerId?: string })?.farmerId ?? "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleStepSubmit = (data: any) => {
    const updated = { ...allData, [`step${step}`]: data };
    setAllData(updated);
    saveToStorage(updated);

    // Mark current step as completed
    setCompletedSteps(prev => new Set([...prev, step]));

    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      handleFinalSubmit(updated);
    }
  };

  const handleFinalSubmit = async (data: Record<string, unknown>) => {
    setSubmitting(true);
    setMessage("");

    try {
      // Flatten all step data into the API shape
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const s = (n: number) => (data[`step${n}`] || {}) as any;

      const payload = {
        // Personal info (step 1)
        ...s(1),
        // Address (step 2)
        ...s(2),
        // Farming experience (step 7)
        farmingExperienceYears: s(7).farmingExperienceYears,
        isOrganicFarmer: s(7).isOrganicFarmer,
        organicSinceYears: s(7).organicSinceYears,
        // Weeds (step 8)
        weedsData: s(8).weeds || [],
        // Water (step 9)
        waterSource: s(9).waterSource,
        irrigationType: s(9).irrigationType,
        // Equipment (step 10)
        ownsEquipment: s(10).ownsEquipment,
        equipmentDetails: (s(10).equipmentList || []).join(", "),
        nearestEquipmentKm: s(10).nearestEquipmentKm,
        // Banking (step 12)
        bankName: s(12).bankName,
        branchName: s(12).branchName,
        accountNumber: s(12).accountNumber,
        ifscCode: s(12).ifscCode,
        upiId: s(12).upiId,
        // Consent (step 13)
        consentGiven: s(13).consentGiven,
        consentDate: new Date().toISOString(),

        // Relations
        lands: s(3).lands || [],
        crops: [
          ...(s(4).crops || []),
          ...(s(5).crops || []),
          ...(s(6).crops || []),
        ],
        economics: s(11),
      };

      const res = await fetch("/api/farmers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        localStorage.removeItem(STORAGE_KEY);
        setShowSuccess(true);
      } else {
        const err = await res.json();
        setMessage(err.error || t("msg.error", lang));
      }
    } catch {
      setMessage(t("msg.error", lang));
    }
    setSubmitting(false);
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen relative">
      <PageBackground />
      {/* Header */}
      <header className="sticky top-0 z-50 glass-header border-b border-green-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-800 rounded-xl flex items-center justify-center ring-pulse">
              <Sprout className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-green-900">OCF-SPIN</h1>
              <p className="text-xs text-green-600">{farmerId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 text-sm"
            >
              <LogOut className="w-4 h-4" />
              {t("action.logout", lang)}
            </button>
          </div>
        </div>
      </header>

      {/* Stepper */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        <Stepper steps={TOTAL_STEPS} currentStep={step} completedSteps={completedSteps} onStepClick={(s) => { if (completedSteps.has(s) || s === step) setStep(s); }} />
      </div>

      {/* Form Area */}
      <div className="max-w-3xl mx-auto px-4 pb-8">
        <div key={step} className="glass-card rounded-2xl p-6 animate-fade-up">
          <h2 className="text-xl font-bold text-green-900 mb-1">{t(`step.${step}`, lang)}</h2>
          <p className="text-sm text-green-600 mb-6">{t("app.subtitle", lang)} — Step {step} of {TOTAL_STEPS}</p>

          {message && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm border border-emerald-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {message}
            </div>
          )}

          <StepForm
            step={step}
            lang={lang}
            defaultValues={allData[`step${step}`] || getDefaultValues(step)}
            onSubmit={handleStepSubmit}
            isLastStep={step === TOTAL_STEPS}
            submitting={submitting}
          />

          {/* Navigation */}
          <div className="flex justify-between mt-6 pt-4 border-t border-green-100">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-green-700 hover:bg-green-50 disabled:opacity-40 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              {t("action.previous", lang)}
            </button>
            <button
              onClick={() => {
                const updated = { ...allData };
                saveToStorage(updated);
                setMessage(t("msg.saved", lang));
                setTimeout(() => setMessage(""), 2000);
              }}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-amber-700 hover:bg-amber-50 transition"
            >
              <Save className="w-4 h-4" />
              {t("action.save", lang)}
            </button>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={closeSuccess}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden animate-pop-in"
          >
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-emerald-500 via-green-500 to-amber-400" />
            <button
              type="button"
              onClick={closeSuccess}
              aria-label="Close"
              className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="p-7 text-center">
              <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center ring-pulse">
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-900 flex items-center justify-center gap-2">
                <PartyPopper className="w-6 h-6 text-amber-500" />
                {lang === "en" ? "Submitted Successfully!" : "విజయవంతంగా సమర్పించబడింది!"}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {lang === "en"
                  ? "Thank you! Your details have been saved. Our team will review and get back to you."
                  : "ధన్యవాదాలు! మీ వివరాలు సేవ్ చేయబడ్డాయి. మా బృందం సమీక్షించి మిమ్మల్ని సంప్రదిస్తుంది."}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-800 text-xs font-medium">
                <Sprout className="w-3.5 h-3.5" />
                {lang === "en" ? "Farmer ID:" : "రైతు ID:"} <span className="font-bold">{farmerId}</span>
              </div>
              <button
                type="button"
                onClick={closeSuccess}
                className="mt-6 w-full shimmer-btn hover-lift bg-gradient-to-r from-emerald-600 to-green-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                {lang === "en" ? "Go to Dashboard" : "డాష్‌బోర్డ్‌కి వెళ్ళండి"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StepForm({ step, lang, defaultValues, onSubmit, isLastStep, submitting }: {
  step: number;
  lang: "en" | "te";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValues: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void;
  isLastStep: boolean;
  submitting: boolean;
}) {
  const schema = getStepSchema(step);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // Reset form when step changes
  useEffect(() => {
    form.reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const { register, handleSubmit, formState: { errors }, control, setValue, watch } = form;

  // Field array for lands (step 3)
  const landsArray = useFieldArray({ control, name: "lands" });
  // Field array for crops (steps 4-6)
  const cropsArray = useFieldArray({ control, name: "crops" });
  // Field array for weeds (step 8)
  const weedsArray = useFieldArray({ control, name: "weeds" });

  const inputCls = "w-full px-3 py-2 rounded-lg border border-green-200 bg-white text-green-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 transition text-sm";
  const labelCls = "block text-sm font-semibold text-green-900 mb-1";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errMsg = (path: string) => {
    const parts = path.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let err: any = errors;
    for (const p of parts) err = err?.[p];
    return err?.message ? <p className="text-xs text-red-500 mt-0.5">{String(err.message)}</p> : null;
  };

  // Chip helper — single-select chips inline
  const chipSelect = (name: string, options: { value: string; label: string }[], cols = 3) => {
    const current = watch(name);
    return (
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {options.map((opt) => {
          const selected = current === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setValue(name, opt.value, { shouldValidate: true })}
              className={`flex items-center justify-center gap-1.5 px-2 py-3 rounded-xl border-2 text-sm font-medium transition-all active:scale-95 ${
                selected
                  ? "border-green-600 bg-green-100 text-green-900 shadow-sm"
                  : "border-green-200 bg-white text-green-700 hover:border-green-400 hover:bg-green-50"
              }`}
            >
              {selected && <Check className="w-4 h-4 text-green-600 flex-shrink-0" />}
              <span className="leading-tight text-center">{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  };

  // Multi-select chips inline
  const chipMulti = (name: string, options: { value: string; label: string }[], cols = 3) => {
    const current: string[] = watch(name) || [];
    const toggle = (val: string) => {
      const next = current.includes(val) ? current.filter((v: string) => v !== val) : [...current, val];
      setValue(name, next, { shouldValidate: true });
    };
    return (
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {options.map((opt) => {
          const selected = current.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={`flex items-center justify-center gap-1.5 px-2 py-3 rounded-xl border-2 text-sm font-medium transition-all active:scale-95 ${
                selected
                  ? "border-green-600 bg-green-100 text-green-900 shadow-sm"
                  : "border-green-200 bg-white text-green-700 hover:border-green-400 hover:bg-green-50"
              }`}
            >
              {selected && <Check className="w-4 h-4 text-green-600 flex-shrink-0" />}
              <span className="leading-tight text-center">{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  };

  // Common option sets
  const genderOpts = [
    { value: "male", label: lang === "en" ? "👨 Male" : "👨 పురుషుడు" },
    { value: "female", label: lang === "en" ? "👩 Female" : "👩 స్త్రీ" },
    { value: "other", label: lang === "en" ? "🧑 Other" : "🧑 ఇతర" },
  ];
  const casteOpts = [
    { value: "OC", label: "OC" }, { value: "BC", label: "BC" },
    { value: "SC", label: "SC" }, { value: "ST", label: "ST" },
    { value: "other", label: lang === "en" ? "Other" : "ఇతర" },
  ];
  const educationOpts = [
    { value: "illiterate", label: lang === "en" ? "📝 Illiterate" : "📝 నిరక్షరాస్యుడు" },
    { value: "primary", label: lang === "en" ? "📚 Primary" : "📚 ప్రాథమిక" },
    { value: "secondary", label: lang === "en" ? "🎓 Secondary" : "🎓 మాధ్యమిక" },
    { value: "higher-secondary", label: lang === "en" ? "🎓 Higher Sec." : "🎓 ఉన్నత మాధ్యమిక" },
    { value: "graduate", label: lang === "en" ? "🎓 Graduate" : "🎓 గ్రాడ్యుయేట్" },
    { value: "post-graduate", label: lang === "en" ? "🎓 Post Grad." : "🎓 పోస్ట్ గ్రాడ్యుయేట్" },
  ];
  const yesNoOpts = [
    { value: "yes", label: lang === "en" ? "✅ Yes" : "✅ అవును" },
    { value: "no", label: lang === "en" ? "❌ No" : "❌ లేదు" },
  ];
  const landTypeOpts = [
    { value: "dry", label: lang === "en" ? "🌵 Dry" : "🌵 పొడి" },
    { value: "wet", label: lang === "en" ? "💧 Wet" : "💧 తడి" },
    { value: "irrigated", label: lang === "en" ? "🚿 Irrigated" : "🚿 సాగునీటి" },
  ];
  const soilTypeOpts = [
    { value: "red", label: lang === "en" ? "Red Soil" : "ఎర్ర మట్టి" },
    { value: "black", label: lang === "en" ? "Black Soil" : "నల్ల మట్టి" },
    { value: "alluvial", label: lang === "en" ? "Alluvial" : "ఒండ్రు" },
    { value: "sandy", label: lang === "en" ? "Sandy" : "ఇసుక" },
    { value: "clay", label: lang === "en" ? "Clay" : "బంక మట్టి" },
  ];
  const acreageOpts = [
    { value: "<1", label: t("acreage.verySmall", lang) },
    { value: "1-3", label: t("acreage.small", lang) },
    { value: "3-5", label: t("acreage.medium", lang) },
    { value: "5-10", label: t("acreage.large", lang) },
    { value: "10+", label: t("acreage.veryLarge", lang) },
  ];
  const cropOpts = [
    { value: "rice", label: t("crop.rice", lang) },
    { value: "cotton", label: t("crop.cotton", lang) },
    { value: "groundnut", label: t("crop.groundnut", lang) },
    { value: "maize", label: t("crop.maize", lang) },
    { value: "chilli", label: t("crop.chilli", lang) },
    { value: "turmeric", label: t("crop.turmeric", lang) },
    { value: "sugarcane", label: t("crop.sugarcane", lang) },
    { value: "tobacco", label: t("crop.tobacco", lang) },
    { value: "sunflower", label: t("crop.sunflower", lang) },
    { value: "jowar", label: t("crop.jowar", lang) },
    { value: "bajra", label: t("crop.bajra", lang) },
    { value: "redgram", label: t("crop.redgram", lang) },
    { value: "bengalgram", label: t("crop.bengalgram", lang) },
    { value: "blackgram", label: t("crop.blackgram", lang) },
    { value: "greengram", label: t("crop.greengram", lang) },
    { value: "sesame", label: t("crop.sesame", lang) },
    { value: "castor", label: t("crop.castor", lang) },
    { value: "mango", label: t("crop.mango", lang) },
    { value: "banana", label: t("crop.banana", lang) },
    { value: "coconut", label: t("crop.coconut", lang) },
    { value: "cashew", label: t("crop.cashew", lang) },
    { value: "oilpalm", label: t("crop.oilpalm", lang) },
    { value: "vegetables", label: t("crop.vegetables", lang) },
    { value: "other", label: t("crop.other", lang) },
  ];
  const varietyOpts = [
    { value: "local", label: t("variety.local", lang) },
    { value: "hybrid", label: t("variety.hybrid", lang) },
    { value: "ht-bt", label: t("variety.ht", lang) },
    { value: "improved", label: t("variety.improved", lang) },
  ];
  const yieldOpts = [
    { value: "<5", label: t("yield.low", lang) },
    { value: "5-15", label: t("yield.medium", lang) },
    { value: "15-30", label: t("yield.high", lang) },
    { value: "30+", label: t("yield.veryHigh", lang) },
  ];
  const expOpts = [
    { value: "0-5", label: t("exp.beginner", lang) },
    { value: "5-10", label: t("exp.intermediate", lang) },
    { value: "10-20", label: t("exp.experienced", lang) },
    { value: "20+", label: t("exp.expert", lang) },
  ];
  const weedTypeOpts = [
    { value: "grass", label: t("weed.grass", lang) },
    { value: "broadleaf", label: t("weed.broadleaf", lang) },
    { value: "sedge", label: t("weed.sedge", lang) },
    { value: "parasitic", label: t("weed.parasitic", lang) },
    { value: "none", label: t("weed.none", lang) },
  ];
  const weedCoverOpts = [
    { value: "<10", label: t("weedCover.low", lang) },
    { value: "10-30", label: t("weedCover.medium", lang) },
    { value: "30-50", label: t("weedCover.high", lang) },
    { value: "50+", label: t("weedCover.veryHigh", lang) },
  ];
  const waterSourceOpts = [
    { value: "borewell", label: lang === "en" ? "🔧 Borewell" : "🔧 బోరుబావి" },
    { value: "canal", label: lang === "en" ? "🏞️ Canal" : "🏞️ కాలువ" },
    { value: "tank", label: lang === "en" ? "💧 Tank" : "💧 చెరువు" },
    { value: "rain", label: lang === "en" ? "🌧️ Rain-fed" : "🌧️ వర్షాధారం" },
    { value: "river", label: lang === "en" ? "🌊 River" : "🌊 నది" },
  ];
  const irrigationOpts = [
    { value: "drip", label: lang === "en" ? "💧 Drip" : "💧 బిందు" },
    { value: "sprinkler", label: lang === "en" ? "🌧️ Sprinkler" : "🌧️ తుంపర" },
    { value: "flood", label: lang === "en" ? "🌊 Flood" : "🌊 ముంపు" },
    { value: "furrow", label: lang === "en" ? "〰️ Furrow" : "〰️ కాలువ" },
  ];
  const equipmentOpts = [
    { value: "tractor", label: t("equip.tractor", lang) },
    { value: "plough", label: t("equip.plough", lang) },
    { value: "sprayer", label: t("equip.sprayer", lang) },
    { value: "rotavator", label: t("equip.rotavator", lang) },
    { value: "harvester", label: t("equip.harvester", lang) },
    { value: "drillMachine", label: t("equip.drillMachine", lang) },
    { value: "pumpset", label: t("equip.pumpset", lang) },
    { value: "bullockcart", label: t("equip.bullockcart", lang) },
    { value: "none", label: t("equip.none", lang) },
  ];
  const distOpts = [
    { value: "<2", label: t("dist.veryNear", lang) },
    { value: "2-5", label: t("dist.near", lang) },
    { value: "5-10", label: t("dist.medium", lang) },
    { value: "10-20", label: t("dist.far", lang) },
    { value: "20+", label: t("dist.veryFar", lang) },
  ];
  const costOpts = [
    { value: "0", label: t("cost.none", lang) },
    { value: "<5000", label: t("cost.veryLow", lang) },
    { value: "5000-15000", label: t("cost.low", lang) },
    { value: "15000-30000", label: t("cost.medium", lang) },
    { value: "30000-50000", label: t("cost.high", lang) },
    { value: "50000-100000", label: t("cost.veryHigh", lang) },
    { value: "100000+", label: t("cost.extreme", lang) },
  ];
  const incomeOpts = [
    { value: "<50000", label: t("income.veryLow", lang) },
    { value: "50000-100000", label: t("income.low", lang) },
    { value: "100000-300000", label: t("income.medium", lang) },
    { value: "300000-500000", label: t("income.high", lang) },
    { value: "500000+", label: t("income.veryHigh", lang) },
  ];
  const bankOpts = [
    { value: "SBI", label: t("bank.sbi", lang) },
    { value: "Andhra Bank", label: t("bank.andhra", lang) },
    { value: "Canara Bank", label: t("bank.canara", lang) },
    { value: "Indian Bank", label: t("bank.indian", lang) },
    { value: "UCO Bank", label: t("bank.uco", lang) },
    { value: "Bank of Baroda", label: t("bank.bob", lang) },
    { value: "PNB", label: t("bank.pnb", lang) },
    { value: "Grameena Bank", label: t("bank.grameena", lang) },
    { value: "Co-operative", label: t("bank.cooperative", lang) },
    { value: "Other", label: t("bank.other", lang) },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Step 1: Personal Information */}
      {step === 1 && (
        <div className="space-y-4">
          <PhotoUploadField
            value={watch("photoUrl") || ""}
            onChange={(v) => setValue("photoUrl", v, { shouldValidate: true })}
            lang={lang}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>{t("field.name", lang)} *</label><input {...register("name")} className={inputCls} />{errMsg("name")}</div>
            <div><label className={labelCls}>{t("field.fatherName", lang)} *</label><input {...register("fatherName")} className={inputCls} />{errMsg("fatherName")}</div>
            <div><label className={labelCls}>{t("field.mobile", lang)} *</label><input type="tel" maxLength={10} {...register("mobile")} className={inputCls} />{errMsg("mobile")}</div>
            <div><label className={labelCls}>{t("field.whatsapp", lang)} *</label><input type="tel" maxLength={10} {...register("whatsapp")} className={inputCls} />{errMsg("whatsapp")}</div>
            <div><label className={labelCls}>{t("field.aadhar", lang)} *</label><input maxLength={12} {...register("aadhar")} className={inputCls} />{errMsg("aadhar")}</div>
            <div><label className={labelCls}>{t("field.dob", lang)} *</label><input type="date" {...register("dob")} className={inputCls} />{errMsg("dob")}</div>
          </div>
          <div>
            <label className={labelCls}>{t("field.gender", lang)} *</label>
            {chipSelect("gender", genderOpts, 3)}
            {errMsg("gender")}
          </div>
          <div>
            <label className={labelCls}>{t("field.caste", lang)} *</label>
            {chipSelect("caste", casteOpts, 5)}
            {errMsg("caste")}
          </div>
          <div>
            <label className={labelCls}>{t("field.education", lang)} *</label>
            {chipSelect("education", educationOpts, 3)}
            {errMsg("education")}
          </div>
        </div>
      )}

      {/* Step 2: Address — cascading area selectors */}
      {step === 2 && (() => {
        const selectedState = watch("state") || "";
        const selectedDistrict = watch("district") || "";
        const selectedMandal = watch("mandal") || "";

        const stateList = getStates().map((s) => ({ value: s.value, label: lang === "te" ? s.te : s.label }));
        const districtList = selectedState ? getDistricts(selectedState).map((d) => ({ value: d.value, label: lang === "te" ? d.te : d.label })) : [];
        const mandalList = selectedState && selectedDistrict ? getMandals(selectedState, selectedDistrict).map((m) => ({ value: m.value, label: lang === "te" ? m.te : m.label })) : [];
        const villageList = selectedState && selectedDistrict && selectedMandal ? getVillages(selectedState, selectedDistrict, selectedMandal).map((v) => ({ value: v.value, label: lang === "te" ? v.te : v.label })) : [];

        // Cascading reset: when state changes, clear children
        const onStateSelect = (val: string) => {
          setValue("state", val, { shouldValidate: true });
          setValue("district", "", { shouldValidate: false });
          setValue("mandal", "", { shouldValidate: false });
          setValue("village", "", { shouldValidate: false });
        };
        const onDistrictSelect = (val: string) => {
          setValue("district", val, { shouldValidate: true });
          setValue("mandal", "", { shouldValidate: false });
          setValue("village", "", { shouldValidate: false });
        };
        const onMandalSelect = (val: string) => {
          setValue("mandal", val, { shouldValidate: true });
          setValue("village", "", { shouldValidate: false });
        };
        const onVillageSelect = (val: string) => {
          setValue("village", val, { shouldValidate: true });
        };

        const chipGrid = (name: string, options: { value: string; label: string }[], onSelect: (v: string) => void, cols = 3) => {
          const current = watch(name);
          return (
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
              {options.map((opt) => {
                const selected = current === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onSelect(opt.value)}
                    className={`flex items-center justify-center gap-1.5 px-2 py-3 rounded-xl border-2 text-sm font-medium transition-all active:scale-95 ${
                      selected
                        ? "border-green-600 bg-green-100 text-green-900 shadow-sm"
                        : "border-green-200 bg-white text-green-700 hover:border-green-400 hover:bg-green-50"
                    }`}
                  >
                    {selected && <Check className="w-4 h-4 text-green-600 flex-shrink-0" />}
                    <span className="leading-tight text-center">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          );
        };

        return (
          <div className="space-y-5">
            {/* State */}
            <div>
              <label className={labelCls}><MapPin className="w-4 h-4 inline mr-1" />{t("field.state", lang)} *</label>
              {chipGrid("state", stateList, onStateSelect, 3)}
              {errMsg("state")}
            </div>

            {/* District — shown only after state is selected */}
            {selectedState && districtList.length > 0 && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className={labelCls}><MapPin className="w-4 h-4 inline mr-1" />{t("field.district", lang)} *</label>
                <p className="text-xs text-green-600 mb-2">{lang === "en" ? `Districts in ${selectedState}` : `${selectedState} జిల్లాలు`}</p>
                {chipGrid("district", districtList, onDistrictSelect, 3)}
                {errMsg("district")}
              </div>
            )}

            {/* Mandal — shown only after district is selected */}
            {selectedDistrict && mandalList.length > 0 && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className={labelCls}><MapPin className="w-4 h-4 inline mr-1" />{t("field.mandal", lang)} *</label>
                <p className="text-xs text-green-600 mb-2">{lang === "en" ? `Mandals in ${selectedDistrict}` : `${selectedDistrict} మండలాలు`}</p>
                {chipGrid("mandal", mandalList, onMandalSelect, 3)}
                {errMsg("mandal")}
              </div>
            )}

            {/* Village — shown only after mandal is selected */}
            {selectedMandal && villageList.length > 0 && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className={labelCls}><MapPin className="w-4 h-4 inline mr-1" />{t("field.village", lang)} *</label>
                <p className="text-xs text-green-600 mb-2">{lang === "en" ? `Villages in ${selectedMandal}` : `${selectedMandal} గ్రామాలు`}</p>
                {chipGrid("village", villageList, onVillageSelect, 2)}
                {errMsg("village")}
              </div>
            )}

            {/* Hamlet — always text input (too specific for predefined list) */}
            <div>
              <label className={labelCls}>{t("field.hamlet", lang)} *</label>
              <input {...register("hamlet")} className={inputCls} placeholder={lang === "en" ? "Enter hamlet name" : "మజ్రా పేరు నమోదు చేయండి"} />
              {errMsg("hamlet")}
            </div>

            {/* Pincode — text input */}
            <div>
              <label className={labelCls}>{t("field.pincode", lang)} *</label>
              <input maxLength={6} {...register("pincode")} className={inputCls} placeholder={lang === "en" ? "6-digit pincode" : "6-అంకెల పిన్‌కోడ్"} />
              {errMsg("pincode")}
            </div>

            {/* Summary badge when all 4 levels selected */}
            {selectedState && selectedDistrict && selectedMandal && watch("village") && (
              <div className="p-3 bg-green-50 rounded-xl border border-green-200 text-sm text-green-800">
                <MapPin className="w-4 h-4 inline mr-1" />
                {watch("village")}, {selectedMandal}, {selectedDistrict}, {selectedState}
              </div>
            )}
          </div>
        );
      })()}

      {/* Step 3: Land Details */}
      {step === 3 && (
        <div className="space-y-4">
          {landsArray.fields.map((field, idx) => (
            <div key={field.id} className="p-4 bg-green-50 rounded-xl border border-green-200 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-green-800">{lang === "en" ? `Land #${idx + 1}` : `భూమి #${idx + 1}`}</span>
                {idx > 0 && (
                  <button type="button" onClick={() => landsArray.remove(idx)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 className="w-4 h-4" /></button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className={labelCls}>{t("field.surveyNo", lang)} *</label><input {...register(`lands.${idx}.surveyNo`)} className={inputCls} />{errMsg(`lands.${idx}.surveyNo`)}</div>
                <div><label className={labelCls}>{t("field.state", lang)} *</label><input {...register(`lands.${idx}.state`)} className={inputCls} />{errMsg(`lands.${idx}.state`)}</div>
                <div><label className={labelCls}>{t("field.district", lang)} *</label><input {...register(`lands.${idx}.district`)} className={inputCls} />{errMsg(`lands.${idx}.district`)}</div>
                <div><label className={labelCls}>{t("field.mandal", lang)} *</label><input {...register(`lands.${idx}.mandal`)} className={inputCls} />{errMsg(`lands.${idx}.mandal`)}</div>
                <div><label className={labelCls}>{t("field.village", lang)} *</label><input {...register(`lands.${idx}.village`)} className={inputCls} />{errMsg(`lands.${idx}.village`)}</div>
              </div>
              <div>
                <label className={labelCls}>{t("field.acreage", lang)} *</label>
                {chipSelect(`lands.${idx}.acreage`, acreageOpts, 5)}
                {errMsg(`lands.${idx}.acreage`)}
              </div>
              <div>
                <label className={labelCls}>{t("field.landType", lang)} *</label>
                {chipSelect(`lands.${idx}.landType`, landTypeOpts, 3)}
                {errMsg(`lands.${idx}.landType`)}
              </div>
              <div>
                <label className={labelCls}>{t("field.soilType", lang)} *</label>
                {chipSelect(`lands.${idx}.soilType`, soilTypeOpts, 3)}
                {errMsg(`lands.${idx}.soilType`)}
              </div>
              <div>
                <label className={labelCls}>{t("field.soilReport", lang)}</label>
                {chipSelect(`lands.${idx}.hasSoilReport`, yesNoOpts, 2)}
              </div>
              <div className="pt-2 border-t border-green-200">
                <PhotoUploadField
                  value={watch(`lands.${idx}.photoUrl`) || ""}
                  onChange={(v) => setValue(`lands.${idx}.photoUrl`, v, { shouldValidate: false })}
                  lang={lang}
                  label={lang === "en" ? "Field Photo (optional)" : "పొలం ఫోటో (ఐచ్ఛికం)"}
                  shape="square"
                  capture="environment"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => landsArray.append({ surveyNo: "", state: "", district: "", mandal: "", village: "", acreage: "", landType: "", soilType: "", hasSoilReport: "no", photoUrl: "" })}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> {t("action.addLand", lang)}
          </button>
          {errors.lands && <p className="text-xs text-red-500">{String((errors.lands as { message?: string }).message || "")}</p>}
        </div>
      )}

      {/* Steps 4-6: Crops */}
      {(step === 4 || step === 5 || step === 6) && (() => {
        const season = step === 4 ? "kharif" : step === 5 ? "rabi" : "perennial";
        const seasonLabel = step === 4 ? (lang === "en" ? "Kharif" : "ఖరీఫ్") : step === 5 ? (lang === "en" ? "Rabi" : "రబీ") : (lang === "en" ? "Perennial" : "బహువార్షిక");
        return (
          <div className="space-y-4">
            <p className="text-sm text-green-700 font-medium">{lang === "en" ? `Select your ${seasonLabel} crops below` : `మీ ${seasonLabel} పంటలను ఎంచుకోండి`}</p>
            {cropsArray.fields.map((field, idx) => (
              <div key={field.id} className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-amber-800">{seasonLabel} {lang === "en" ? "Crop" : "పంట"} #{idx + 1}</span>
                  {idx > 0 && (
                    <button type="button" onClick={() => cropsArray.remove(idx)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 className="w-4 h-4" /></button>
                  )}
                </div>
                <input type="hidden" {...register(`crops.${idx}.season`)} value={season} />
                <div>
                  <label className={labelCls}>{t("field.cropName", lang)} *</label>
                  {chipSelect(`crops.${idx}.cropName`, cropOpts, 4)}
                  {errMsg(`crops.${idx}.cropName`)}
                </div>
                <div>
                  <label className={labelCls}>{t("field.acreage", lang)} *</label>
                  {chipSelect(`crops.${idx}.acreage`, acreageOpts, 5)}
                  {errMsg(`crops.${idx}.acreage`)}
                </div>
                <div>
                  <label className={labelCls}>{t("field.variety", lang)} *</label>
                  {chipSelect(`crops.${idx}.variety`, varietyOpts, 4)}
                  {errMsg(`crops.${idx}.variety`)}
                </div>
                <div>
                  <label className={labelCls}>{t("field.yearlyYield", lang)} *</label>
                  {chipSelect(`crops.${idx}.yearlyYield`, yieldOpts, 4)}
                  {errMsg(`crops.${idx}.yearlyYield`)}
                </div>
                <div className="pt-2 border-t border-amber-200">
                  <PhotoUploadField
                    value={watch(`crops.${idx}.photoUrl`) || ""}
                    onChange={(v) => setValue(`crops.${idx}.photoUrl`, v, { shouldValidate: false })}
                    lang={lang}
                    label={lang === "en" ? "Crop Photo (optional)" : "పంట ఫోటో (ఐచ్ఛికం)"}
                    shape="square"
                    capture="environment"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => cropsArray.append({ season, cropName: "", acreage: "", variety: "", yearlyYield: "", photoUrl: "" })}
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> {t("action.addCrop", lang)}
            </button>
          </div>
        );
      })()}

      {/* Step 7: Farming Experience */}
      {step === 7 && (
        <div className="space-y-5">
          <div>
            <label className={labelCls}>{t("field.experience", lang)} *</label>
            {chipSelect("farmingExperienceYears", expOpts, 4)}
            {errMsg("farmingExperienceYears")}
          </div>
          <div>
            <label className={labelCls}>{t("field.organicFarmer", lang)} *</label>
            {chipSelect("isOrganicFarmer", yesNoOpts, 2)}
            {errMsg("isOrganicFarmer")}
          </div>
          <div>
            <label className={labelCls}>{t("field.organicSince", lang)} *</label>
            {chipSelect("organicSinceYears", [
              { value: "0", label: lang === "en" ? "Not yet" : "ఇంకా లేదు" },
              { value: "0-2", label: lang === "en" ? "0-2 Years" : "0-2 సంవత్సరాలు" },
              { value: "2-5", label: lang === "en" ? "2-5 Years" : "2-5 సంవత్సరాలు" },
              { value: "5-10", label: lang === "en" ? "5-10 Years" : "5-10 సంవత్సరాలు" },
              { value: "10+", label: lang === "en" ? "10+ Years" : "10+ సంవత్సరాలు" },
            ], 5)}
            {errMsg("organicSinceYears")}
          </div>
        </div>
      )}

      {/* Step 8: Weeds */}
      {step === 8 && (
        <div className="space-y-4">
          {weedsArray.fields.map((field, idx) => (
            <div key={field.id} className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-amber-800">{lang === "en" ? `Weed #${idx + 1}` : `కలుపు #${idx + 1}`}</span>
                {idx > 0 && (
                  <button type="button" onClick={() => weedsArray.remove(idx)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 className="w-4 h-4" /></button>
                )}
              </div>
              <div>
                <label className={labelCls}>{t("field.weedType", lang)} *</label>
                {chipSelect(`weeds.${idx}.weedType`, weedTypeOpts, 3)}
                {errMsg(`weeds.${idx}.weedType`)}
              </div>
              <div>
                <label className={labelCls}>{t("field.weedPercentage", lang)} *</label>
                {chipSelect(`weeds.${idx}.percentage`, weedCoverOpts, 4)}
                {errMsg(`weeds.${idx}.percentage`)}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => weedsArray.append({ weedType: "", percentage: "" })}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> {t("action.addWeed", lang)}
          </button>
          {errors.weeds && <p className="text-xs text-red-500">{String((errors.weeds as { message?: string }).message || (errors.weeds as { root?: { message?: string } }).root?.message || "")}</p>}
        </div>
      )}

      {/* Step 9: Water Source */}
      {step === 9 && (
        <div className="space-y-5">
          <div>
            <label className={labelCls}>{t("field.waterSource", lang)} *</label>
            {chipSelect("waterSource", waterSourceOpts, 3)}
            {errMsg("waterSource")}
          </div>
          <div>
            <label className={labelCls}>{t("field.irrigationType", lang)} *</label>
            {chipSelect("irrigationType", irrigationOpts, 4)}
            {errMsg("irrigationType")}
          </div>
        </div>
      )}

      {/* Step 10: Equipment */}
      {step === 10 && (
        <div className="space-y-5">
          <div>
            <label className={labelCls}>{t("field.ownsEquipment", lang)} *</label>
            {chipSelect("ownsEquipment", yesNoOpts, 2)}
            {errMsg("ownsEquipment")}
          </div>
          <div>
            <label className={labelCls}>{t("field.equipmentDetails", lang)}</label>
            <p className="text-xs text-green-600 mb-2">{lang === "en" ? "Tap all equipment you own or use" : "మీకు ఉన్న లేదా వాడే పరికరాలన్నీ నొక్కండి"}</p>
            {chipMulti("equipmentList", equipmentOpts, 3)}
          </div>
          <div>
            <label className={labelCls}>{t("field.nearestEquipment", lang)} *</label>
            {chipSelect("nearestEquipmentKm", distOpts, 5)}
            {errMsg("nearestEquipmentKm")}
          </div>
        </div>
      )}

      {/* Step 11: Economics */}
      {step === 11 && (
        <div className="space-y-5">
          <div>
            <label className={labelCls}>{t("field.pesticideCost", lang)} *</label>
            {chipSelect("pesticideCostPerYear", costOpts, 4)}
            {errMsg("pesticideCostPerYear")}
          </div>
          <div>
            <label className={labelCls}>{t("field.fertilizerCost", lang)} *</label>
            {chipSelect("fertilizerCostPerYear", costOpts, 4)}
            {errMsg("fertilizerCostPerYear")}
          </div>
          <div>
            <label className={labelCls}>{t("field.seedCost", lang)} *</label>
            {chipSelect("seedCostPerYear", costOpts, 4)}
            {errMsg("seedCostPerYear")}
          </div>
          <div>
            <label className={labelCls}>{t("field.laborWages", lang)} *</label>
            {chipSelect("laborWagesPerYear", costOpts, 4)}
            {errMsg("laborWagesPerYear")}
          </div>
          <div>
            <label className={labelCls}>{t("field.totalIncome", lang)} *</label>
            {chipSelect("totalIncomePerYear", incomeOpts, 3)}
            {errMsg("totalIncomePerYear")}
          </div>
          <div>
            <label className={labelCls}>{t("field.marketDistance", lang)} *</label>
            {chipSelect("marketDistance", distOpts, 5)}
            {errMsg("marketDistance")}
          </div>
        </div>
      )}

      {/* Step 12: Banking */}
      {step === 12 && (
        <div className="space-y-4">
          <div>
            <label className={labelCls}>{t("field.bankName", lang)} *</label>
            {chipSelect("bankName", bankOpts, 3)}
            {errMsg("bankName")}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>{t("field.branchName", lang)} *</label><input {...register("branchName")} className={inputCls} />{errMsg("branchName")}</div>
            <div><label className={labelCls}>{t("field.accountNumber", lang)} *</label><input {...register("accountNumber")} className={inputCls} />{errMsg("accountNumber")}</div>
            <div><label className={labelCls}>{t("field.ifscCode", lang)} *</label><input {...register("ifscCode")} className={inputCls} placeholder="e.g., SBIN0001234" />{errMsg("ifscCode")}</div>
            <div><label className={labelCls}>{t("field.upiId", lang)} *</label><input {...register("upiId")} className={inputCls} />{errMsg("upiId")}</div>
          </div>
        </div>
      )}

      {/* Step 13: Consent & Review */}
      {step === 13 && (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-sm text-green-800 leading-relaxed">
            {lang === "en"
              ? "By checking below, you consent to share your farming data with OCF-SPIN for the purpose of organic carbon farming assessment and program enrollment. Your data will be used only for this purpose and handled as per applicable privacy regulations."
              : "క్రింద టిక్ చేయడం ద్వారా, సేంద్రీయ కార్బన్ వ్యవసాయ అంచనా మరియు ప్రోగ్రామ్ నమోదు కోసం మీ వ్యవసాయ డేటాను OCF-SPINతో పంచుకోవడానికి మీరు సమ్మతిస్తున్నారు."
            }
          </div>
          <div>
            {chipSelect("consentGiven", [
              { value: "yes", label: lang === "en" ? "✅ I consent to share my data" : "✅ నా డేటాను పంచుకోవడానికి సమ్మతిస్తున్నాను" },
            ], 1)}
            {errMsg("consentGiven")}
          </div>
        </div>
      )}

      {/* Submit button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className={`shimmer-btn flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-base transition disabled:opacity-50 ${
            isLastStep
              ? "bg-emerald-700 text-white hover:bg-emerald-600"
              : "bg-green-800 text-white hover:bg-green-700"
          }`}
        >
          {isLastStep ? (
            <>
              <Send className="w-5 h-5" />
              {submitting ? (lang === "en" ? "Submitting..." : "సమర్పిస్తోంది...") : t("action.submit", lang)}
            </>
          ) : (
            <>
              {t("action.next", lang)}
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// Profile photo upload — converts to a resized base64 data URL
function PhotoUploadField({
  value,
  onChange,
  lang,
  label,
  shape = "circle",
  capture = "user",
}: {
  value: string;
  onChange: (v: string) => void;
  lang: "en" | "te";
  label?: string;
  shape?: "circle" | "square";
  capture?: "user" | "environment";
}) {
  const [error, setError] = useState("");
  const fieldLabel = label ?? (lang === "en" ? "Profile Photo" : "ప్రొఫైల్ ఫోటో");
  const altText = label ?? "photo";
  const previewShape = shape === "circle" ? "rounded-full" : "rounded-xl";

  const handleFile = (file: File) => {
    setError("");
    if (!file.type.startsWith("image/")) {
      setError(lang === "en" ? "Please select an image file" : "దయచేసి ఇమేజ్ ఫైల్‌ని ఎంచుకోండి");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(lang === "en" ? "Image must be smaller than 5MB" : "ఇమేజ్ 5MB కంటే తక్కువ ఉండాలి");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // Resize to max 512px on the longer side, encode as JPEG quality 0.85
        const max = 512;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setError(lang === "en" ? "Could not process image" : "ఇమేజ్‌ని ప్రాసెస్ చేయలేకపోయాము");
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        onChange(dataUrl);
      };
      img.onerror = () => setError(lang === "en" ? "Invalid image" : "చెల్లని ఇమేజ్");
      img.src = reader.result as string;
    };
    reader.onerror = () => setError(lang === "en" ? "Could not read file" : "ఫైల్‌ని చదవలేకపోయాము");
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-4">
      <div className={`relative w-24 h-24 ${previewShape} bg-green-50 border-2 border-dashed border-green-300 flex items-center justify-center overflow-hidden flex-shrink-0`}>
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={altText} className="w-full h-full object-cover" />
        ) : (
          <Camera className="w-8 h-8 text-green-400" />
        )}
      </div>
      <div className="flex-1">
        <label className="block text-sm font-semibold text-green-900 mb-1">
          {fieldLabel}
        </label>
        <div className="flex items-center gap-2">
          <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-green-300 bg-white text-green-700 text-sm font-medium cursor-pointer hover:bg-green-50 transition">
            <Camera className="w-4 h-4" />
            {value
              ? (lang === "en" ? "Change" : "మార్చు")
              : (lang === "en" ? "Upload" : "అప్‌లోడ్")}
            <input
              type="file"
              accept="image/*"
              capture={capture}
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
            />
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-red-200 text-red-600 text-sm hover:bg-red-50 transition"
            >
              <X className="w-4 h-4" />
              {lang === "en" ? "Remove" : "తీసివేయి"}
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {lang === "en"
            ? "JPG/PNG up to 5MB. Image will be resized automatically."
            : "JPG/PNG, 5MB వరకు. ఇమేజ్ స్వయంచాలకంగా రీసైజ్ అవుతుంది."}
        </p>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    </div>
  );
}


