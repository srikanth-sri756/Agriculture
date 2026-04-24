"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, createContext, useContext } from "react";
import { type Language } from "@/lib/i18n";

const LangContext = createContext<{
  lang: Language;
  setLang: (l: Language) => void;
}>({ lang: "en", setLang: () => {} });

export const useLang = () => useContext(LangContext);

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <LangContext.Provider value={{ lang, setLang }}>
          {children}
        </LangContext.Provider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
