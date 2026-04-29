"use client";

import { useState } from "react";
import { X, Download, Languages } from "lucide-react";
import { type Language, t } from "@/lib/i18n";
import { labelFor, cropLabel, weedLabel, equipLabel, plain } from "@/lib/farmer-labels";
import { downloadFarmerPdf, type FarmerLike } from "@/lib/farmer-pdf";

interface Props {
  farmer: FarmerLike;
  initialLang: Language;
  onClose: () => void;
}

export default function FarmerDetailModal({ farmer, initialLang, onClose }: Props) {
  // Per-modal language so admin can switch to understand a record
  // entered in a different language. Defaults to admin's current lang.
  const [lang, setLang] = useState<Language>(initialLang);

  const f = farmer;
  const e = f.economics || {};

  // Parse weeds JSON safely
  let weeds: Array<[string, string | number]> = [];
  try {
    const parsed: Record<string, string | number> = f.weedsData ? JSON.parse(f.weedsData) : {};
    weeds = Object.entries(parsed);
  } catch {
    /* ignore */
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="rounded-xl border border-green-200 overflow-hidden">
      <header className="bg-green-700 text-white px-3 py-2 text-sm font-semibold">
        {title}
      </header>
      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {children}
      </div>
    </section>
  );

  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-wide text-green-700 font-medium">{label}</span>
      <span className="text-green-950 break-words">{value || "-"}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-5xl max-h-[95vh] rounded-2xl shadow-2xl border border-green-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-green-100">
          <div>
            <h2 className="text-base font-bold text-green-900">
              {plain(f.name)}{" "}
              <span className="ml-1 font-mono text-xs text-green-700">{plain(f.farmerId)}</span>
            </h2>
            <p className="text-xs text-gray-500">
              {plain(f.village)}, {plain(f.mandal)}, {plain(f.district)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Per-modal language toggle */}
            <button
              onClick={() => setLang(lang === "en" ? "te" : "en")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-100 text-green-800 text-xs font-medium hover:bg-green-200 transition"
              title={lang === "en" ? "Switch to Telugu" : "Switch to English"}
            >
              <Languages className="w-3.5 h-3.5" />
              {lang === "en" ? "EN → TE" : "TE → EN"}
            </button>
            <button
              onClick={() => downloadFarmerPdf(f)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-500 transition"
            >
              <Download className="w-3.5 h-3.5" />
              {lang === "en" ? "Download PDF (English)" : "PDF డౌన్‌లోడ్ (ఇంగ్లీష్)"}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-4 space-y-4">
          <Section title={lang === "en" ? "Section 1: Personal Information" : "విభాగం 1: వ్యక్తిగత సమాచారం"}>
            <Row label={t("field.name", lang)} value={plain(f.name)} />
            <Row label={t("field.fatherName", lang)} value={plain(f.fatherName)} />
            <Row label={t("field.mobile", lang)} value={plain(f.mobile)} />
            <Row label={t("field.whatsapp", lang)} value={plain(f.whatsapp)} />
            <Row label={t("field.aadhar", lang)} value={plain(f.aadhar)} />
            <Row label={t("field.gender", lang)} value={labelFor("gender", f.gender || "", lang)} />
            <Row label={t("field.dob", lang)} value={plain(f.dob)} />
            <Row label={t("field.caste", lang)} value={plain(f.caste)} />
            <Row label={t("field.education", lang)} value={labelFor("education", f.education || "", lang)} />
            <Row label={t("farmingType.field", lang)} value={labelFor("farmingType", f.farmingType || "", lang)} />
          </Section>

          <Section title={lang === "en" ? "Section 2: Address" : "విభాగం 2: చిరునామా"}>
            <Row label={t("field.state", lang)} value={plain(f.state)} />
            <Row label={t("field.district", lang)} value={plain(f.district)} />
            <Row label={t("field.mandal", lang)} value={plain(f.mandal)} />
            <Row label={t("field.village", lang)} value={plain(f.village)} />
            <Row label={t("field.hamlet", lang)} value={plain(f.hamlet)} />
            <Row label={t("field.pincode", lang)} value={plain(f.pincode)} />
          </Section>

          <Section title={lang === "en" ? "Section 4: Farming Experience" : "విభాగం 4: వ్యవసాయ అనుభవం"}>
            <Row label={t("field.experience", lang)} value={plain(f.farmingExperienceYears)} />
            <Row label={t("field.organicFarmer", lang)} value={labelFor("yesNo", f.isOrganicFarmer || "no", lang)} />
            <Row label={t("field.organicSince", lang)} value={plain(f.organicSinceYears)} />
          </Section>

          <section className="rounded-xl border border-green-200 overflow-hidden">
            <header className="bg-green-700 text-white px-3 py-2 text-sm font-semibold">
              {lang === "en" ? "Section 5: Land Details" : "విభాగం 5: భూమి వివరాలు"}
            </header>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-2 py-1 text-left">#</th>
                    <th className="px-2 py-1 text-left">{t("field.surveyNo", lang)}</th>
                    <th className="px-2 py-1 text-left">{t("field.district", lang)}</th>
                    <th className="px-2 py-1 text-left">{t("field.village", lang)}</th>
                    <th className="px-2 py-1 text-left">{t("field.acreage", lang)}</th>
                    <th className="px-2 py-1 text-left">{t("field.landType", lang)}</th>
                    <th className="px-2 py-1 text-left">{t("field.soilType", lang)}</th>
                  </tr>
                </thead>
                <tbody>
                  {(f.lands ?? []).length === 0 ? (
                    <tr><td colSpan={7} className="px-2 py-3 text-center text-gray-400">-</td></tr>
                  ) : (f.lands ?? []).map((l, i) => (
                    <tr key={i} className="border-t border-green-100">
                      <td className="px-2 py-1">{i + 1}</td>
                      <td className="px-2 py-1">{plain(l.surveyNo)}</td>
                      <td className="px-2 py-1">{plain(l.district)}</td>
                      <td className="px-2 py-1">{plain(l.village)}</td>
                      <td className="px-2 py-1">{plain(l.acreage)}</td>
                      <td className="px-2 py-1">{labelFor("landType", l.landType || "", lang)}</td>
                      <td className="px-2 py-1">{labelFor("soilType", l.soilType || "", lang)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-xl border border-green-200 overflow-hidden">
            <header className="bg-green-700 text-white px-3 py-2 text-sm font-semibold">
              {lang === "en" ? "Section 6: Crops" : "విభాగం 6: పంటలు"}
            </header>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-2 py-1 text-left">#</th>
                    <th className="px-2 py-1 text-left">{t("field.season", lang)}</th>
                    <th className="px-2 py-1 text-left">{t("field.cropName", lang)}</th>
                    <th className="px-2 py-1 text-left">{t("field.acreage", lang)}</th>
                    <th className="px-2 py-1 text-left">{t("field.variety", lang)}</th>
                    <th className="px-2 py-1 text-left">{t("field.yearlyYield", lang)}</th>
                  </tr>
                </thead>
                <tbody>
                  {(f.crops ?? []).length === 0 ? (
                    <tr><td colSpan={6} className="px-2 py-3 text-center text-gray-400">-</td></tr>
                  ) : (f.crops ?? []).map((c, i) => (
                    <tr key={i} className="border-t border-green-100">
                      <td className="px-2 py-1">{i + 1}</td>
                      <td className="px-2 py-1">{labelFor("season", c.season || "", lang)}</td>
                      <td className="px-2 py-1">{cropLabel(c.cropName || "", lang)}</td>
                      <td className="px-2 py-1">{plain(c.acreage)}</td>
                      <td className="px-2 py-1">{labelFor("variety", c.variety || "", lang)}</td>
                      <td className="px-2 py-1">{plain(c.yearlyYield)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <Section title={lang === "en" ? "Section 7: Costs & Income" : "విభాగం 7: ఖర్చులు & ఆదాయం"}>
            <Row label={t("field.pesticideCost", lang)} value={plain(e.pesticideCostPerYear)} />
            <Row label={t("field.fertilizerCost", lang)} value={plain(e.fertilizerCostPerYear)} />
            <Row label={t("field.seedCost", lang)} value={plain(e.seedCostPerYear)} />
            <Row label={t("field.laborWages", lang)} value={plain(e.laborWagesPerYear)} />
            <Row label={t("field.totalIncome", lang)} value={plain(e.totalIncomePerYear)} />
            <Row label={t("field.marketDistance", lang)} value={plain(e.marketDistance)} />
          </Section>

          <Section title={lang === "en" ? "Section 8: Weeds Management" : "విభాగం 8: కలుపు నిర్వహణ"}>
            {weeds.length === 0 ? (
              <Row label="-" value="-" />
            ) : (
              weeds.map(([k, v]) => (
                <Row key={k} label={weedLabel(k, lang)} value={`${v}%`} />
              ))
            )}
          </Section>

          <Section title={lang === "en" ? "Section 9: Water & Irrigation" : "విభాగం 9: నీరు & నీటిపారుదల"}>
            <Row label={t("field.waterSource", lang)} value={labelFor("waterSource", f.waterSource || "", lang)} />
            <Row label={t("field.irrigationType", lang)} value={labelFor("irrigation", f.irrigationType || "", lang)} />
          </Section>

          <Section title={lang === "en" ? "Section 10: Equipment" : "విభాగం 10: పరికరాలు"}>
            <Row label={t("field.ownsEquipment", lang)} value={labelFor("yesNo", f.ownsEquipment || "no", lang)} />
            <Row
              label={t("field.equipmentDetails", lang)}
              value={(f.equipmentDetails || "")
                                .split(",").filter(Boolean).map((v) => equipLabel(v.trim(), lang)).join(", ") || "-"}
            />
            <Row label={t("field.nearestEquipment", lang)} value={plain(f.nearestEquipmentKm)} />
          </Section>

          <Section title={lang === "en" ? "Section 11: Banking" : "విభాగం 11: బ్యాంకింగ్"}>
            <Row label={t("field.bankName", lang)} value={plain(f.bankName)} />
            <Row label={t("field.branchName", lang)} value={plain(f.branchName)} />
            <Row label={t("field.accountNumber", lang)} value={plain(f.accountNumber)} />
            <Row label={t("field.ifscCode", lang)} value={plain(f.ifscCode)} />
            <Row label={t("field.upiId", lang)} value={plain(f.upiId)} />
          </Section>

          <Section title={lang === "en" ? "Section 13: Consent" : "విభాగం 13: సమ్మతి"}>
            <Row label={t("field.consent", lang)} value={labelFor("yesNo", f.consentGiven || "no", lang)} />
            <Row label={lang === "en" ? "Consent Date" : "సమ్మతి తేదీ"} value={plain(f.consentDate)} />
            <Row label={lang === "en" ? "Status" : "స్థితి"} value={plain(f.status)} />
            <Row
              label={lang === "en" ? "Registered" : "నమోదు తేదీ"}
              value={f.createdAt ? new Date(f.createdAt).toLocaleString() : "-"}
            />
          </Section>
        </div>
      </div>
    </div>
  );
}
