"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { loginSchema, registerSchema } from "@/lib/schemas";
import { useLang } from "@/components/providers";
import { t } from "@/lib/i18n";
import LanguageToggle from "@/components/language-toggle";
import Image from "next/image";
import { Sprout, UserCircle, Shield } from "lucide-react";

type LoginForm = { mobile: string; password: string };
type RegisterForm = { name: string; mobile: string; password: string };

export default function LoginPage() {
  const { lang } = useLang();
  const router = useRouter();
  const [mode, setMode] = useState<"farmer-login" | "admin-login" | "register">(
    "farmer-login"
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const handleLogin = async (data: LoginForm) => {
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      mobile: data.mobile,
      password: data.password,
      redirect: false,
    });
    if (result?.error) {
      setError(t("otp.invalidCredentials", lang));
      setLoading(false);
      return;
    }
    router.push(mode === "admin-login" ? "/admin" : "/home");
    router.refresh();
  };

  const handleRegister = async (data: RegisterForm) => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      if (res.status === 409) {
        // Already registered — switch to login and pre-fill mobile
        loginForm.setValue("mobile", data.mobile);
        setMode("farmer-login");
        setError(lang === "te" ? "మీరు ఇప్పటికే నమోదు చేసుకున్నారు. దయచేసి లాగిన్ చేయండి." : "You are already registered. Please login.");
        setLoading(false);
        return;
      }
      setError(result.error || t("otp.registerFailed", lang));
      setLoading(false);
      return;
    }
    await signIn("credentials", {
      mobile: data.mobile,
      password: data.password,
      redirect: false,
    });
    router.push("/home");
    router.refresh();
  };

  const inputCls =
    "w-full px-4 py-2.5 rounded-lg border border-green-200 bg-green-50/50 text-green-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600";

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm scale-105"
        style={{ backgroundImage: 'url("/images/crops-bg.jpg")' }}
      />
      <div className="absolute inset-0 bg-black/35" />

      {/* 3-Column Layout — items-stretch keeps left/right at same height so photos align */}
      <div className="relative min-h-screen flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-6 lg:gap-0 px-4 py-8 lg:py-0">

        {/* LEFT: Logo */}
        <div className="hidden lg:flex flex-1 flex-col items-center justify-center animate-slide-up">
          <div className="w-56 h-56 xl:w-72 xl:h-72 rounded-full overflow-hidden shadow-2xl border-4 border-white/80">
            <Image
              src="/images/ocf-logo.png"
              alt="Organic Carbon Farming with SPIN"
              width={288}
              height={288}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <h2 className="mt-5 text-3xl xl:text-4xl font-extrabold text-white tracking-tight text-center drop-shadow-lg">
            OCF-SPIN
          </h2>
          <p className="text-white/90 font-semibold mt-2 text-base text-center drop-shadow-lg">
            Organic Carbon Farming
          </p>
        </div>

        {/* CENTER: Form */}
        <div className="w-full max-w-md lg:max-w-sm xl:max-w-md flex-shrink-0 animate-slide-up-delay-1">
          {/* Mobile header row */}
          <div className="flex lg:hidden items-center justify-center gap-5 mb-5 bg-white/30 backdrop-blur-md rounded-2xl p-4">
            <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg border-2 border-white/80">
              <Image src="/images/ocf-logo.png" alt="OCF Logo" width={80} height={80} className="w-full h-full object-cover" priority />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-green-900">OCF-SPIN</h1>
              <p className="text-green-700 text-xs">{t("app.subtitle", lang)}</p>
            </div>
            <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg border-2 border-white/80">
              <Image src="/images/founder.jpeg" alt="Founder" width={80} height={80} className="w-full h-full object-cover" priority />
            </div>
          </div>

          {/* Desktop banner + tagline */}
          <div className="hidden lg:block text-center mb-5">
            <div className="flex justify-center mb-3">
              <Image src="/images/banner.jpeg" alt="OCF.SPIN" width={200} height={112} className="rounded-xl shadow-md" priority />
            </div>
            <h1 className="text-2xl font-extrabold text-white leading-snug drop-shadow-lg">
              <span className="text-amber-300">Bhavishyath</span>{" "}
              <span className="text-white">Bharat</span>
            </h1>
            <p className="text-lg font-bold text-white/90 mt-1 drop-shadow-lg">Is</p>
            <p className="text-xl font-extrabold text-amber-300 mt-1 drop-shadow-lg">Organic Carbon Farming</p>
            <p className="text-sm text-white/70 italic mt-1 drop-shadow">(nature is ultimate)</p>
            <div className="flex justify-center mt-2">
              <LanguageToggle />
            </div>
          </div>

          {/* Mobile banner + tagline */}
          <div className="flex lg:hidden flex-col items-center mb-4">
            <Image src="/images/banner.jpeg" alt="OCF.SPIN" width={160} height={90} className="rounded-lg shadow-md mb-2" priority />
            <p className="text-lg font-extrabold text-white drop-shadow-lg">
              <span className="text-amber-300">Bhavishyath</span>{" "}
              <span className="text-white">Bharat</span>
            </p>
            <p className="text-sm font-bold text-white/90 mt-0.5 drop-shadow">Is</p>
            <p className="text-base font-extrabold text-amber-300 mt-0.5 drop-shadow-lg">Organic Carbon Farming</p>
            <p className="text-xs text-white/60 italic mt-0.5 drop-shadow">(nature is ultimate)</p>
            <div className="mt-2">
              <LanguageToggle />
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-6">
            {/* Mode Tabs */}
            <div className="flex gap-1 mb-6 bg-green-50 p-1 rounded-xl">
              <button
                onClick={() => { setMode("farmer-login"); setError(""); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition ${
                  mode === "farmer-login" ? "bg-green-800 text-white shadow" : "text-green-700 hover:bg-green-100"
                }`}
              >
                <UserCircle className="w-4 h-4" />
                {t("auth.farmer", lang)}
              </button>
              <button
                onClick={() => { setMode("admin-login"); setError(""); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition ${
                  mode === "admin-login" ? "bg-green-800 text-white shadow" : "text-green-700 hover:bg-green-100"
                }`}
              >
                <Shield className="w-4 h-4" />
                {t("auth.admin", lang)}
              </button>
              <button
                onClick={() => { setMode("register"); setError(""); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition ${
                  mode === "register" ? "bg-green-800 text-white shadow" : "text-green-700 hover:bg-green-100"
                }`}
              >
                <Sprout className="w-4 h-4" />
                {t("auth.register", lang)}
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
                {error}
              </div>
            )}

            {/* Login Form */}
            {(mode === "farmer-login" || mode === "admin-login") && (
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">{t("auth.mobile", lang)}</label>
                  <input type="tel" maxLength={10} placeholder="9876543210" {...loginForm.register("mobile")} className={inputCls} />
                  {loginForm.formState.errors.mobile && <p className="text-xs text-red-500 mt-1">{loginForm.formState.errors.mobile.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">{t("auth.password", lang)}</label>
                  <input type="password" placeholder="••••••" {...loginForm.register("password")} className={inputCls} />
                  {loginForm.formState.errors.password && <p className="text-xs text-red-500 mt-1">{loginForm.formState.errors.password.message}</p>}
                </div>
                <button type="submit" disabled={loading} className="w-full py-2.5 bg-green-800 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50">
                  {loading ? "..." : t("auth.login", lang)}
                </button>
                <p className="text-center text-sm text-gray-500 mt-3">
                  {lang === "te" ? "కొత్త వినియోగదారా?" : "New here?"}{" "}
                  <button type="button" onClick={() => { setMode("register"); setError(""); }} className="text-green-700 font-medium hover:underline">
                    {lang === "te" ? "నమోదు చేసుకోండి" : "Register"}
                  </button>
                </p>
              </form>
            )}

            {/* Register Form */}
            {mode === "register" && (
              <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">{t("field.name", lang)} *</label>
                  <input type="text" placeholder={lang === "en" ? "Enter your name" : "మీ పేరు నమోదు చేయండి"} {...registerForm.register("name")} className={inputCls} />
                  {registerForm.formState.errors.name && <p className="text-xs text-red-500 mt-1">{registerForm.formState.errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">{t("auth.mobile", lang)} *</label>
                  <input type="tel" maxLength={10} placeholder="9876543210" {...registerForm.register("mobile")} className={inputCls} />
                  {registerForm.formState.errors.mobile && <p className="text-xs text-red-500 mt-1">{registerForm.formState.errors.mobile.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">{t("auth.password", lang)} *</label>
                  <input type="password" placeholder={lang === "en" ? "Min 4 characters" : "కనీసం 4 అక్షరాలు"} {...registerForm.register("password")} className={inputCls} />
                  {registerForm.formState.errors.password && <p className="text-xs text-red-500 mt-1">{registerForm.formState.errors.password.message}</p>}
                </div>
                <button type="submit" disabled={loading} className="w-full py-2.5 bg-emerald-700 text-white rounded-lg font-medium hover:bg-emerald-600 transition disabled:opacity-50">
                  {loading ? "..." : t("auth.register", lang)}
                </button>
                <p className="text-center text-sm text-gray-500 mt-3">
                  {lang === "te" ? "ఇప్పటికే నమోదు చేసుకున్నారా?" : "Already registered?"}{" "}
                  <button type="button" onClick={() => { setMode("farmer-login"); setError(""); }} className="text-green-700 font-medium hover:underline">
                    {lang === "te" ? "లాగిన్ చేయండి" : "Login here"}
                  </button>
                </p>
              </form>
            )}
          </div>

          <p className="text-center text-base text-white/80 mt-4 drop-shadow-lg font-semibold">
            Do <strong className="text-amber-300">Smart Farming</strong> for Guarantee Profits
          </p>
        </div>

        {/* RIGHT: Founder — same image size as left for horizontal alignment */}
        <div className="hidden lg:flex flex-1 flex-col items-center justify-center animate-slide-up-delay-2">
          <div className="w-56 h-56 xl:w-72 xl:h-72 rounded-full overflow-hidden shadow-2xl border-4 border-white/80">
            <Image
              src="/images/founder.jpeg"
              alt="Founder"
              width={288}
              height={288}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <h2 className="mt-5 text-3xl xl:text-4xl font-bold text-white tracking-tight text-center drop-shadow-lg">
            Founder
          </h2>
          <p className="text-amber-300 font-semibold mt-2 text-base text-center drop-shadow-lg">
            Organic Carbon Farming Visionary
          </p>
          <p className="mt-3 text-base text-white/80 max-w-[240px] text-center leading-relaxed drop-shadow-lg">
            Transforming Indian agriculture through sustainable, profitable organic practices.
          </p>
        </div>
      </div>
    </div>
  );
}
