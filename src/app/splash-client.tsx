"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

/*
  ANIMATION TIMELINE — Pictures are the STAR, text comes after:
  ─────────────────────────────────────────────────────────────
  Phase 1: "black"    (0 – 0.4s)   Pure black screen, suspense
  Phase 2: "emerge"   (0.4 – 2.2s) Both photos SCALE UP from darkness,
                                     side by side near center, NO text
  Phase 3: "split"    (2.2 – 4.0s) Photos glide apart — logo → left,
                                     founder → right, background brightens
  Phase 4: "text"     (4.0 – 5.0s) Labels fade in UNDER each photo
  Phase 5: "reveal"   (5.0+)       Tagline + CTA button rise from below
*/
type Phase = "black" | "emerge" | "split" | "text" | "reveal";

export default function SplashClient() {
  const [phase, setPhase] = useState<Phase>("black");

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("emerge"), 400),
      setTimeout(() => setPhase("split"), 2200),
      setTimeout(() => setPhase("text"), 4000),
      setTimeout(() => setPhase("reveal"), 5000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Smooth deceleration
  const ease = "cubic-bezier(0.16, 1, 0.3, 1)";

  // Phase checks
  const isPreSplit = phase === "black" || phase === "emerge";
  const showPhotos = phase !== "black";
  const showText = phase === "text" || phase === "reveal";
  const showBottom = phase === "reveal";

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#010a04] select-none">

      {/* ── Background image — blurred, fades in after split ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm scale-105"
        style={{
          backgroundImage: 'url("/images/crops-bg.jpg")',
          opacity: isPreSplit ? 0 : 0.45,
          transition: `opacity 2.5s ${ease}`,
        }}
      />

      {/* ── Light gradient overlay — fades in during split ── */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-amber-50/40 to-emerald-50/30"
        style={{
          opacity: isPreSplit ? 0 : 1,
          transition: `opacity 2s ${ease}`,
        }}
      />

      {/* ── Cinematic dark veil ── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 48%, rgba(5,46,22,0.7) 0%, rgba(1,10,4,0.98) 100%)",
          opacity: isPreSplit ? 1 : 0,
          transition: `opacity 1.8s ${ease}`,
        }}
      />

      {/* ── Ambient light ring behind photos (emerge phase) ── */}
      <div
        className="absolute z-[11] rounded-full pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          width: "600px",
          height: "600px",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(34,197,94,0.12) 0%, rgba(251,191,36,0.08) 40%, transparent 70%)",
          opacity: phase === "emerge" ? 1 : 0,
          transition: `opacity 1.5s ${ease}`,
        }}
      />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          LOGO PHOTO — the hero
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        className="absolute z-20 flex flex-col items-center will-change-transform"
        style={{
          top: isPreSplit ? "50%" : "42%",
          left: "50%",
          transform: isPreSplit
            // Near center, offset slightly left, BIG
            ? `translate(calc(-50% - 5.5rem), -50%) scale(${phase === "black" ? 0.3 : 1})`
            // Final position: left side
            : "translate(calc(-50% - 22vw), -50%) scale(0.82)",
          opacity: showPhotos ? 1 : 0,
          transition: phase === "emerge"
            // Slow dramatic scale-up for emergence
            ? `transform 1.6s ${ease}, opacity 1.2s ${ease}`
            // Smooth glide for split
            : `transform 1.6s ${ease}, opacity 0.6s ${ease}`,
        }}
      >
        {/* Photo circle */}
        <div
          className="w-44 h-44 sm:w-60 sm:h-60 lg:w-80 lg:h-80 xl:w-[22rem] xl:h-[22rem] rounded-full overflow-hidden"
          style={{
            border: isPreSplit ? "4px solid rgba(255,255,255,0.85)" : "5px solid rgba(255,255,255,0.15)",
            boxShadow: isPreSplit
              ? "0 0 30px rgba(34,197,94,0.25), 0 0 80px rgba(34,197,94,0.12), inset 0 0 30px rgba(0,0,0,0.2)"
              : "0 20px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.05)",
            transition: `border 1.6s ${ease}, box-shadow 1.6s ${ease}`,
          }}
        >
          <Image
            src="/images/ocf-logo.png"
            alt="OCF Logo"
            width={400}
            height={400}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        {/* Text — only after split completes */}
        <div
          style={{
            opacity: showText ? 1 : 0,
            transform: showText ? "translateY(0)" : "translateY(12px)",
            transition: `opacity 0.8s ${ease} 0.1s, transform 0.8s ${ease} 0.1s`,
          }}
        >
          <h1
            className="mt-5 font-extrabold tracking-tight text-center"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.8rem)",
              color: "#14532d",
            }}
          >
            OCF-SPIN
          </h1>
          <p
            className="font-medium text-center text-green-600"
            style={{ fontSize: "clamp(0.75rem, 1.2vw, 1rem)" }}
          >
            Organic Carbon Farming
          </p>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FOUNDER PHOTO — the hero
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        className="absolute z-20 flex flex-col items-center will-change-transform"
        style={{
          top: isPreSplit ? "50%" : "42%",
          left: "50%",
          transform: isPreSplit
            ? `translate(calc(-50% + 5.5rem), -50%) scale(${phase === "black" ? 0.3 : 1})`
            : "translate(calc(-50% + 22vw), -50%) scale(0.82)",
          opacity: showPhotos ? 1 : 0,
          transition: phase === "emerge"
            ? `transform 1.6s ${ease}, opacity 1.2s ${ease}`
            : `transform 1.6s ${ease}, opacity 0.6s ${ease}`,
        }}
      >
        {/* Photo circle */}
        <div
          className="w-44 h-44 sm:w-60 sm:h-60 lg:w-80 lg:h-80 xl:w-[22rem] xl:h-[22rem] rounded-full overflow-hidden"
          style={{
            border: isPreSplit ? "4px solid rgba(255,255,255,0.85)" : "5px solid rgba(255,255,255,0.15)",
            boxShadow: isPreSplit
              ? "0 0 30px rgba(251,191,36,0.25), 0 0 80px rgba(251,191,36,0.12), inset 0 0 30px rgba(0,0,0,0.2)"
              : "0 20px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.05)",
            transition: `border 1.6s ${ease}, box-shadow 1.6s ${ease}`,
          }}
        >
          <Image
            src="/images/founder.jpeg"
            alt="Founder"
            width={400}
            height={400}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        {/* Text — only after split completes */}
        <div
          style={{
            opacity: showText ? 1 : 0,
            transform: showText ? "translateY(0)" : "translateY(12px)",
            transition: `opacity 0.8s ${ease} 0.25s, transform 0.8s ${ease} 0.25s`,
          }}
        >
          <h2
            className="mt-5 font-bold tracking-tight text-center"
            style={{
              fontSize: "clamp(1.25rem, 2.5vw, 2.4rem)",
              color: "#14532d",
            }}
          >
            Founder
          </h2>
          <p
            className="font-semibold text-center text-amber-600"
            style={{ fontSize: "clamp(0.75rem, 1.2vw, 1rem)" }}
          >
            Organic Carbon Farming Visionary
          </p>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BOTTOM — tagline + CTA + footer
          Only after photos have settled & text is visible
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        className="absolute z-20 bottom-0 left-0 right-0 flex flex-col items-center will-change-transform px-4 pb-6 sm:pb-10"
        style={{
          opacity: showBottom ? 1 : 0,
          transform: showBottom ? "translateY(0)" : "translateY(40px)",
          transition: `opacity 1s ${ease} 0.15s, transform 1s ${ease} 0.15s`,
          pointerEvents: showBottom ? "auto" : "none",
        }}
      >
        <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-green-950 leading-snug text-center max-w-2xl">
          <span className="text-amber-600">Bhavishyath</span>{" "}
          <span className="bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
            Bharat
          </span>{" "}
          Is Organic Carbon Farming
        </p>
        <p className="text-green-700/70 mt-2 text-xs sm:text-sm lg:text-base text-center">
          Do <strong>Smart Farming</strong> for Guarantee Profits &mdash; nature is ultimate
        </p>

        <Link
          href="/login"
          className="mt-6 sm:mt-8 inline-flex items-center justify-center gap-3 px-10 py-4 bg-green-800 text-white rounded-2xl font-bold hover:bg-green-700 active:scale-[0.97] transition-all shadow-xl hover:shadow-2xl text-base sm:text-lg lg:text-xl"
        >
          Get Started
          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </Link>

        <p className="mt-6 text-[11px] text-green-600/50">
          &copy; 2026 OCF-SPIN &mdash; Organic Carbon Farming. All rights reserved.
        </p>
      </div>
    </div>
  );
}
