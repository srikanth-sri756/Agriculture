"use client";

import { useLang } from "@/components/providers";
import { Languages } from "lucide-react";

export default function LanguageToggle() {
  const { lang, setLang } = useLang();

  return (
    <button
      onClick={() => setLang(lang === "en" ? "te" : "en")}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 border border-green-200 text-green-800 hover:bg-green-50 transition text-sm font-medium"
    >
      <Languages className="w-4 h-4" />
      {lang === "en" ? "తెలుగు" : "English"}
    </button>
  );
}
