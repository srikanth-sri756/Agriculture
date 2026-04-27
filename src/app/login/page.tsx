"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginSchema, registerSchema } from "@/lib/schemas";
import { useLang } from "@/components/providers";
import { t } from "@/lib/i18n";
import LanguageToggle from "@/components/language-toggle";
import Image from "next/image";
import Link from "next/link";
import { Sprout, UserCircle, Phone, Lock, ArrowRight, Shield, Leaf } from "lucide-react";

type LoginForm = { mobile: string; password: string };
type RegisterForm = { name: string; mobile: string; password: string };

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const { lang } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAdminMode = searchParams.get("admin") === "1";

  const [mode, setMode] = useState<"login" | "register">("login");
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
    router.push(isAdminMode ? "/admin" : "/home");
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
        loginForm.setValue("mobile", data.mobile);
        setMode("login");
        setError(
          lang === "te"
            ? "మీరు ఇప్పటికే నమోదు చేసుకున్నారు. దయచేసి లాగిన్ చేయండి."
            : "You are already registered. Please login."
        );
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
    "w-full pl-11 pr-4 py-3 rounded-xl border border-green-200 bg-white text-green-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition";

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-10">
      {/* Background image + green gradient veil */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: 'url("/images/crops-bg.jpg")' }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/85 via-green-800/75 to-lime-700/70" />

      {/* Decorative floating blobs */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-emerald-400/30 blur-3xl animate-blob" />
      <div className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full bg-lime-300/20 blur-3xl animate-blob-delay-2" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-amber-300/15 blur-3xl animate-blob-delay-4" />

      {/* Top bar: language + admin link */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
        <Link
          href="/"
          className="text-white/90 hover:text-white text-sm font-medium flex items-center gap-1.5 transition"
        >
          <Leaf className="w-4 h-4" />
          OCF-SPIN
        </Link>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          {!isAdminMode ? (
            <Link
              href="/login?admin=1"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white px-3 py-1.5 rounded-full border border-white/20 hover:border-white/40 backdrop-blur-sm transition"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-white px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-sm transition"
            >
              <UserCircle className="w-3.5 h-3.5" />
              Farmer login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile-only admin link (bottom corner) */}
      {!isAdminMode && (
        <Link
          href="/login?admin=1"
          className="sm:hidden absolute bottom-4 right-4 z-20 text-xs text-white/80 hover:text-white px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center gap-1.5"
        >
          <Shield className="w-3.5 h-3.5" />
          Admin
        </Link>
      )}

      {/* Main 3-column area: logo · form · founder */}
      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-[1fr_minmax(0,28rem)_1fr] gap-10 items-center">
        {/* LEFT: Logo (desktop only) */}
        <div className="hidden lg:flex flex-col items-center text-center animate-fade-up">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-white/30 blur-3xl scale-110" />
            <div className="relative w-56 h-56 xl:w-64 xl:h-64 rounded-full overflow-hidden shadow-2xl border-4 border-white/90 ring-pulse">
              <Image
                src="/images/ocf-logo.png"
                alt="OCF-SPIN"
                width={300}
                height={300}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
          <h2 className="mt-5 text-3xl font-extrabold text-white tracking-tight drop-shadow-lg">
            OCF-SPIN
          </h2>
          <p className="mt-1 text-amber-300 font-semibold drop-shadow">
            Organic Carbon Farming
          </p>
          <p className="mt-2 text-sm text-white/80 max-w-[240px] leading-relaxed drop-shadow">
            Smart, regenerative farming for guaranteed profits.
          </p>
        </div>

        {/* CENTER: Form column */}
        <div className="w-full max-w-md mx-auto animate-fade-up">
          {/* Mobile: compact logo + founder row */}
          <div className="flex lg:hidden items-center justify-center gap-4 mb-5">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-white/30 blur-xl scale-110" />
              <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-xl border-2 border-white/90 ring-pulse">
                <Image
                  src="/images/ocf-logo.png"
                  alt="OCF-SPIN"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>
            <div className="text-white text-center drop-shadow">
              <p className="text-lg font-extrabold leading-tight">OCF-SPIN</p>
              <p className="text-xs text-amber-200 font-semibold">
                Organic Carbon Farming
              </p>
            </div>
            <div className="w-16 h-16 rounded-full overflow-hidden shadow-xl border-2 border-white/90">
              <Image
                src="/images/founder.jpeg"
                alt="Founder"
                width={80}
                height={80}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>

          {/* Desktop heading (logo lives in left column) */}
          <div className="hidden lg:block text-center mb-6">
            <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-lg">
              {isAdminMode ? "Admin Portal" : "Welcome back"}
            </h1>
            <p className="mt-1 text-sm text-white/85 drop-shadow">
              {isAdminMode
                ? "Sign in to manage farmer records"
                : lang === "te"
                ? "మీ ఖాతాకు సైన్ ఇన్ చేయండి"
                : "Sign in to your farmer account"}
            </p>
          </div>

          {/* Mobile heading */}
          <div className="lg:hidden text-center mb-5">
            <h1 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-lg">
              {isAdminMode ? "Admin Portal" : "Welcome back"}
            </h1>
            <p className="mt-1 text-xs text-white/85 drop-shadow">
              {isAdminMode
                ? "Sign in to manage farmer records"
                : lang === "te"
                ? "మీ ఖాతాకు సైన్ ఇన్ చేయండి"
                : "Sign in to your farmer account"}
            </p>
          </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-7">
          {/* Tabs (hidden in admin mode — admin only logs in) */}
          {!isAdminMode && (
            <div className="flex gap-1 mb-6 bg-green-50 p-1 rounded-2xl">
              <button
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${
                  mode === "login"
                    ? "bg-green-700 text-white shadow-md"
                    : "text-green-700 hover:bg-green-100"
                }`}
              >
                {t("auth.login", lang)}
              </button>
              <button
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${
                  mode === "register"
                    ? "bg-green-700 text-white shadow-md"
                    : "text-green-700 hover:bg-green-100"
                }`}
              >
                {t("auth.register", lang)}
              </button>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200 animate-fade-up">
              {error}
            </div>
          )}

          {/* Login form */}
          {(isAdminMode || mode === "login") && (
            <form
              onSubmit={loginForm.handleSubmit(handleLogin)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-green-900 mb-1.5">
                  {t("auth.mobile", lang)}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    {...loginForm.register("mobile")}
                    className={inputCls}
                  />
                </div>
                {loginForm.formState.errors.mobile && (
                  <p className="text-xs text-red-500 mt-1">
                    {loginForm.formState.errors.mobile.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-green-900 mb-1.5">
                  {t("auth.password", lang)}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                  <input
                    type="password"
                    placeholder="••••••"
                    {...loginForm.register("password")}
                    className={inputCls}
                  />
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="shimmer-btn hover-lift w-full py-3 mt-2 bg-gradient-to-r from-green-700 to-emerald-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  "..."
                ) : (
                  <>
                    {t("auth.login", lang)}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {!isAdminMode && (
                <p className="text-center text-sm text-gray-500 pt-2">
                  {lang === "te" ? "కొత్త వినియోగదారా?" : "New here?"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("register");
                      setError("");
                    }}
                    className="text-green-700 font-semibold hover:underline"
                  >
                    {lang === "te" ? "నమోదు చేసుకోండి" : "Create account"}
                  </button>
                </p>
              )}
            </form>
          )}

          {/* Register form */}
          {!isAdminMode && mode === "register" && (
            <form
              onSubmit={registerForm.handleSubmit(handleRegister)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-green-900 mb-1.5">
                  {t("field.name", lang)}
                </label>
                <div className="relative">
                  <UserCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                  <input
                    type="text"
                    placeholder={
                      lang === "en"
                        ? "Enter your name"
                        : "మీ పేరు నమోదు చేయండి"
                    }
                    {...registerForm.register("name")}
                    className={inputCls}
                  />
                </div>
                {registerForm.formState.errors.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {registerForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-green-900 mb-1.5">
                  {t("auth.mobile", lang)}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    {...registerForm.register("mobile")}
                    className={inputCls}
                  />
                </div>
                {registerForm.formState.errors.mobile && (
                  <p className="text-xs text-red-500 mt-1">
                    {registerForm.formState.errors.mobile.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-green-900 mb-1.5">
                  {t("auth.password", lang)}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                  <input
                    type="password"
                    placeholder={
                      lang === "en" ? "Min 4 characters" : "కనీసం 4 అక్షరాలు"
                    }
                    {...registerForm.register("password")}
                    className={inputCls}
                  />
                </div>
                {registerForm.formState.errors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="shimmer-btn hover-lift w-full py-3 mt-2 bg-gradient-to-r from-emerald-700 to-green-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  "..."
                ) : (
                  <>
                    <Sprout className="w-4 h-4" />
                    {t("auth.register", lang)}
                  </>
                )}
              </button>
              <p className="text-center text-sm text-gray-500 pt-2">
                {lang === "te"
                  ? "ఇప్పటికే నమోదు చేసుకున్నారా?"
                  : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                  className="text-green-700 font-semibold hover:underline"
                >
                  {lang === "te" ? "లాగిన్ చేయండి" : "Sign in"}
                </button>
              </p>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-white/85 mt-5 drop-shadow font-medium">
          Do <span className="text-amber-300 font-bold">Smart Farming</span> for{" "}
          <span className="text-amber-300 font-bold">Guaranteed Profits</span>
        </p>
        </div>

        {/* RIGHT: Founder (desktop only) */}
        <div className="hidden lg:flex flex-col items-center text-center animate-fade-up">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-amber-300/20 blur-3xl scale-110" />
            <div className="relative w-56 h-56 xl:w-64 xl:h-64 rounded-full overflow-hidden shadow-2xl border-4 border-white/90">
              <Image
                src="/images/founder.jpeg"
                alt="Founder"
                width={300}
                height={300}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
          <h2 className="mt-5 text-3xl font-extrabold text-white tracking-tight drop-shadow-lg">
            Founder
          </h2>
          <p className="mt-1 text-amber-300 font-semibold drop-shadow">
            Visionary
          </p>
          <p className="mt-2 text-sm text-white/80 max-w-[240px] leading-relaxed drop-shadow">
            Transforming Indian agriculture through sustainable, profitable organic practices.
          </p>
        </div>
      </div>
    </div>
  );
}
