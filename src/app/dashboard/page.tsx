"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLang } from "@/components/providers";
import { t } from "@/lib/i18n";
import LanguageToggle from "@/components/language-toggle";
import PageBackground from "@/components/page-background";
import {
  Sprout, LogOut, User, MapPin, Landmark, TrendingUp, Tractor, Droplets,
  Leaf, CreditCard, ClipboardCheck, Edit, Clock, CheckCircle, ArrowRight,
} from "lucide-react";

interface FarmerData {
  id: string;
  farmerId: string;
  name: string;
  fatherName: string;
  mobile: string;
  whatsapp: string;
  aadhar: string;
  gender: string;
  dob: string;
  caste: string;
  education: string;
  photoUrl: string;
  state: string;
  district: string;
  mandal: string;
  village: string;
  hamlet: string;
  pincode: string;
  farmingExperienceYears: number;
  isOrganicFarmer: string;
  organicSinceYears: number;
  weedsData: string;
  waterSource: string;
  irrigationType: string;
  ownsEquipment: string;
  equipmentDetails: string;
  nearestEquipmentKm: number;
  bankName: string;
  branchName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  consentGiven: string;
  status: string;
  lands: { surveyNo: string; acreage: number; landType: string; soilType: string; district: string; village: string; photoUrl?: string }[];
  crops: { season: string; cropName: string; acreage: number; variety: string; yearlyYield: string; photoUrl?: string }[];
  economics: {
    pesticideCostPerYear: number;
    fertilizerCostPerYear: number;
    seedCostPerYear: number;
    laborWagesPerYear: number;
    totalIncomePerYear: number;
    marketDistance: number;
  } | null;
}

async function fetchFarmer(): Promise<FarmerData | null> {
  const res = await fetch("/api/farmers");
  if (!res.ok) return null;
  const data = await res.json();
  return Array.isArray(data) ? data[0] || null : data;
}

function StatusBadge({ status, lang }: { status: string; lang: "en" | "te" }) {
  const config: Record<string, { bg: string; text: string; key: string; icon: typeof Clock }> = {
    draft: { bg: "bg-gray-100 text-gray-700", text: "dash.draft", key: "draft", icon: Edit },
    submitted: { bg: "bg-green-100 text-green-700", text: "dash.submitted", key: "submitted", icon: CheckCircle },
    edit_requested: { bg: "bg-amber-100 text-amber-700", text: "dash.editRequested", key: "edit_requested", icon: Clock },
    edit_approved: { bg: "bg-blue-100 text-blue-700", text: "dash.editApproved", key: "edit_approved", icon: Edit },
  };
  const c = config[status] || config.draft;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${c.bg}`}>
      <Icon className="w-3.5 h-3.5" />
      {t(c.text, lang)}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">{value || "—"}</span>
    </div>
  );
}

function Section({ icon: Icon, title, children, delay = 0 }: { icon: typeof User; title: string; children: React.ReactNode; delay?: number }) {
  return (
    <div
      className="glass-card rounded-xl overflow-hidden hover-lift animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2 px-5 py-3 bg-green-50/80 border-b border-green-100">
        <Icon className="w-5 h-5 text-green-700" />
        <h3 className="font-semibold text-green-900">{title}</h3>
      </div>
      <div className="px-5 py-3">{children}</div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const { lang } = useLang();
  const queryClient = useQueryClient();
  const [msg, setMsg] = useState("");

  const { data: farmer, isLoading } = useQuery({
    queryKey: ["farmer-profile"],
    queryFn: fetchFarmer,
    enabled: authStatus === "authenticated",
  });

  const requestEdit = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/farmers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request_edit" }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farmer-profile"] });
      setMsg(t("dash.editRequested", lang));
    },
  });

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/login");
  }, [authStatus, router]);

  // If farmer hasn't submitted yet (status=draft), redirect to wizard
  useEffect(() => {
    if (farmer && farmer.status === "draft") {
      router.push("/wizard");
    }
  }, [farmer, router]);

  if (authStatus === "loading" || isLoading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <PageBackground />
        <div className="text-green-800 text-lg animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!farmer || farmer.status === "draft") {
    return null;
  }

  const weeds = (() => {
    try { return typeof farmer.weedsData === "string" ? JSON.parse(farmer.weedsData) : farmer.weedsData; }
    catch { return []; }
  })();

  return (
    <div className="min-h-screen relative">
      <PageBackground />
      {/* Header */}
      <header className="sticky top-0 z-50 glass-header border-b border-green-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-800 rounded-xl flex items-center justify-center ring-pulse">
              <Sprout className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <span className="text-lg font-bold text-green-900">OCF-SPIN</span>
              <span className="hidden sm:inline text-xs text-green-600 ml-2">{t("dash.title", lang)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <button
              onClick={async () => {
                await signOut({ redirect: false });
                window.location.href = "/login";
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-sm transition"
            >
              <LogOut className="w-4 h-4" />
              {t("action.logout", lang)}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Profile Header Card */}
        <div className="glass-card rounded-2xl p-6 animate-fade-up">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 overflow-hidden flex items-center justify-center flex-shrink-0 ring-pulse">
                {farmer.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={farmer.photoUrl} alt={farmer.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-9 h-9 text-green-400" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-900">{farmer.name}</h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span>{t("dash.farmerId", lang)}: <strong className="text-green-800">{farmer.farmerId}</strong></span>
                  <StatusBadge status={farmer.status} lang={lang} />
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              {farmer.status === "submitted" && (
                <button
                  onClick={() => requestEdit.mutate()}
                  disabled={requestEdit.isPending}
                  className="shimmer-btn hover-lift flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-400 transition disabled:opacity-50"
                >
                  <Edit className="w-4 h-4" />
                  {requestEdit.isPending ? "..." : t("dash.requestEdit", lang)}
                </button>
              )}
              {farmer.status === "edit_approved" && (
                <button
                  onClick={() => router.push("/wizard")}
                  className="shimmer-btn hover-lift flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition"
                >
                  <ArrowRight className="w-4 h-4" />
                  {t("dash.editNow", lang)}
                </button>
              )}
              {farmer.status === "edit_requested" && (
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm border border-amber-200">
                  <Clock className="w-4 h-4" />
                  {t("dash.waitingApproval", lang)}
                </div>
              )}
            </div>
          </div>
          {msg && (
            <div className="mt-3 p-2 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200">{msg}</div>
          )}
          {farmer.status === "edit_approved" && (
            <div className="mt-3 p-2 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-200">
              {t("dash.editApprovedMsg", lang)}
            </div>
          )}
        </div>

        {/* Data Sections Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <Section icon={User} title={t("dash.personalInfo", lang)} delay={80}>
            <InfoRow label={t("field.name", lang)} value={farmer.name} />
            <InfoRow label={t("field.fatherName", lang)} value={farmer.fatherName} />
            <InfoRow label={t("field.mobile", lang)} value={farmer.mobile} />
            <InfoRow label={t("field.whatsapp", lang)} value={farmer.whatsapp} />
            <InfoRow label={t("field.aadhar", lang)} value={farmer.aadhar} />
            <InfoRow label={t("field.gender", lang)} value={farmer.gender} />
            <InfoRow label={t("field.dob", lang)} value={farmer.dob} />
            <InfoRow label={t("field.caste", lang)} value={farmer.caste} />
            <InfoRow label={t("field.education", lang)} value={farmer.education} />
          </Section>

          {/* Address */}
          <Section icon={MapPin} title={t("dash.addressInfo", lang)} delay={160}>
            <InfoRow label={t("field.state", lang)} value={farmer.state} />
            <InfoRow label={t("field.district", lang)} value={farmer.district} />
            <InfoRow label={t("field.mandal", lang)} value={farmer.mandal} />
            <InfoRow label={t("field.village", lang)} value={farmer.village} />
            <InfoRow label={t("field.hamlet", lang)} value={farmer.hamlet} />
            <InfoRow label={t("field.pincode", lang)} value={farmer.pincode} />
          </Section>

          {/* Farming Details */}
          <Section icon={Leaf} title={t("dash.farmingInfo", lang)} delay={240}>
            <InfoRow label={t("field.experience", lang)} value={farmer.farmingExperienceYears} />
            <InfoRow label={t("field.organicFarmer", lang)} value={farmer.isOrganicFarmer} />
            <InfoRow label={t("field.organicSince", lang)} value={farmer.organicSinceYears} />
            <InfoRow label={t("field.waterSource", lang)} value={farmer.waterSource} />
            <InfoRow label={t("field.irrigationType", lang)} value={farmer.irrigationType} />
            <InfoRow label={t("field.ownsEquipment", lang)} value={farmer.ownsEquipment} />
            <InfoRow label={t("field.equipmentDetails", lang)} value={farmer.equipmentDetails} />
            <InfoRow label={t("field.nearestEquipment", lang)} value={`${farmer.nearestEquipmentKm} km`} />
            {Array.isArray(weeds) && weeds.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-500 uppercase tracking-wide">{t("step.8", lang)}</span>
                {weeds.map((w: { weedType: string; percentage: number }, i: number) => (
                  <InfoRow key={i} label={w.weedType} value={`${w.percentage}%`} />
                ))}
              </div>
            )}
          </Section>

          {/* Banking */}
          <Section icon={CreditCard} title={t("dash.bankingInfo", lang)} delay={320}>
            <InfoRow label={t("field.bankName", lang)} value={farmer.bankName} />
            <InfoRow label={t("field.branchName", lang)} value={farmer.branchName} />
            <InfoRow label={t("field.accountNumber", lang)} value={farmer.accountNumber} />
            <InfoRow label={t("field.ifscCode", lang)} value={farmer.ifscCode} />
            <InfoRow label={t("field.upiId", lang)} value={farmer.upiId} />
          </Section>
        </div>

        {/* Land Details (full width) */}
        {farmer.lands.length > 0 && (
          <Section icon={Landmark} title={t("dash.landInfo", lang)} delay={400}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {farmer.lands.map((land, i) => (
                <div key={i} className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
                  <div className="aspect-video bg-emerald-100 flex items-center justify-center">
                    {land.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={land.photoUrl} alt={land.surveyNo} className="w-full h-full object-cover" />
                    ) : (
                      <Landmark className="w-10 h-10 text-emerald-300" />
                    )}
                  </div>
                  <div className="p-3 space-y-1 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-emerald-900">#{land.surveyNo || i + 1}</span>
                      <span className="text-xs uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{land.landType}</span>
                    </div>
                    <div className="text-gray-600">{t("field.acreage", lang)}: <span className="text-gray-900">{land.acreage}</span></div>
                    <div className="text-gray-600">{t("field.soilType", lang)}: <span className="text-gray-900">{land.soilType}</span></div>
                    <div className="text-gray-600">{t("field.district", lang)}: <span className="text-gray-900">{land.district}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Crop Details (full width) */}
        {farmer.crops.length > 0 && (
          <Section icon={Tractor} title={t("dash.cropInfo", lang)} delay={480}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {farmer.crops.map((crop, i) => (
                <div key={i} className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
                  <div className="aspect-video bg-green-100 flex items-center justify-center">
                    {crop.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={crop.photoUrl} alt={crop.cropName} className="w-full h-full object-cover" />
                    ) : (
                      <Leaf className="w-10 h-10 text-green-300" />
                    )}
                  </div>
                  <div className="p-3 space-y-1 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-green-900">{crop.cropName}</span>
                      <span className="text-xs uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">{crop.season}</span>
                    </div>
                    <div className="text-gray-600">{t("field.acreage", lang)}: <span className="text-gray-900">{crop.acreage}</span></div>
                    <div className="text-gray-600">{t("field.variety", lang)}: <span className="text-gray-900">{crop.variety}</span></div>
                    <div className="text-gray-600">{t("field.yearlyYield", lang)}: <span className="text-gray-900">{crop.yearlyYield}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Economics (full width) */}
        {farmer.economics && (
          <Section icon={TrendingUp} title={t("dash.economicsInfo", lang)} delay={560}>
            <div className="grid sm:grid-cols-2 gap-x-8">
              <InfoRow label={t("field.pesticideCost", lang)} value={`₹${farmer.economics.pesticideCostPerYear.toLocaleString()}`} />
              <InfoRow label={t("field.fertilizerCost", lang)} value={`₹${farmer.economics.fertilizerCostPerYear.toLocaleString()}`} />
              <InfoRow label={t("field.seedCost", lang)} value={`₹${farmer.economics.seedCostPerYear.toLocaleString()}`} />
              <InfoRow label={t("field.laborWages", lang)} value={`₹${farmer.economics.laborWagesPerYear.toLocaleString()}`} />
              <InfoRow label={t("field.totalIncome", lang)} value={`₹${farmer.economics.totalIncomePerYear.toLocaleString()}`} />
              <InfoRow label={t("field.marketDistance", lang)} value={`${farmer.economics.marketDistance} km`} />
            </div>
          </Section>
        )}

        {/* Consent */}
        <Section icon={ClipboardCheck} title={t("step.13", lang)} delay={640}>
          <div className="flex items-center gap-2">
            <CheckCircle className={`w-5 h-5 ${farmer.consentGiven === "yes" ? "text-green-600" : "text-gray-400"}`} />
            <span className={`text-sm font-medium ${farmer.consentGiven === "yes" ? "text-green-700" : "text-gray-500"}`}>
              {t("field.consent", lang)}
            </span>
          </div>
        </Section>
      </main>
    </div>
  );
}
