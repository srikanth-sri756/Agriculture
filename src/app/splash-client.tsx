"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Volume2, VolumeX, Sprout, Check, X } from "lucide-react";
import { useLang } from "@/components/providers";
import { t } from "@/lib/i18n";

const FARMING_TYPE_KEY = "ocf-spin-farming-type";
type FarmingType = "natural" | "chemical" | "terrace" | "both" | "others";

/*
  ANIMATION TIMELINE
  ───────────────────────────────────────────────────────────────
  Phase 1: "black"        (0    – 0.4s)  blank
  Phase 2: "ganapati"     (0.4  – 3.0s)  Ganapati rises and fills page
  Phase 3: "scatter"      (3.0  – 4.5s)  Ganapati shrinks up; crops scatter in
  Phase 4: "form"         (4.5  – 9.5s)  Trishul (40°) formed + mantras up (~5s)
  Phase 5: "trishulFade"  (9.5  – 11.0s) Trishul + mantras fade out
  Phase 6: "expand"       (11.0 – 16.0s) Ganapati grows back to cover page (~5s)
  Phase 7: "flag"         (16.0+)        Ganapati fades; flag + title + points
*/
type Phase =
  | "black"
  | "ganapati"
  | "scatter"
  | "form"
  | "trishulFade"
  | "expand"
  | "flag";

type Item = {
  key: string;
  emoji: string;
  img: string; // /images/splash/<file>.jpg
  fx: number; // final x in % of viewport width
  fy: number; // final y in % of viewport height
  sx: number; // scatter offset x (px)
  sy: number; // scatter offset y (px)
  size: number; // photo diameter in px
  delay: number;
};

// Build the Trishul (त्रिशूल) shaped like a real metallic trident:
// - Center prong: tall, straight, vertical
// - Outer prongs: curved scimitar shape (sweep outward, tips point inward)
// - Crossguard: short horizontal handle joining the three prongs
// - Staff: long vertical pole below the crossguard ending at a garland base
const buildTrishul = (): Item[] => {
  const items: Item[] = [];
  const rand = (range: number) => (Math.random() - 0.5) * range;
  const I = (file: string) => `/images/splash/${file}`;

  // helper: arc-shaped curve. t in [0,1] from tip(top) → base(bottom).
  // bow is the maximum horizontal offset at t=0.5.
  const arcX = (baseX: number, t: number, bow: number, side: -1 | 1) =>
    baseX + side * Math.sin(t * Math.PI) * bow;

  // ── Left prong (curved scimitar) ──
  const leftDefs = [
    { e: "🌻", img: "sunflower.jpg" },
    { e: "🌾", img: "wheat.jpg" },
    { e: "🌿", img: "leaf.jpg" },
    { e: "🌱", img: "field.jpg" },
    { e: "🥬", img: "cabbage.jpg" },
  ];
  leftDefs.forEach((p, i) => {
    const t = i / (leftDefs.length - 1);
    items.push({
      key: `L${i}`,
      emoji: p.e,
      img: I(p.img),
      fx: arcX(48, t, 4, -1), // 48 → 44 (mid) → 48  (tight leaf shape)
      fy: 6 + t * 26, // 6% → 32%
      sx: rand(800),
      sy: rand(600),
      size: 70 - i * 2,
      delay: i * 70,
    });
  });

  // ── Center prong (tallest, dead straight) ──
  const centerDefs = [
    { e: "🌱", img: "paddy.jpg" },
    { e: "🌿", img: "bamboo.jpg" },
    { e: "🎋", img: "wheat.jpg" },
    { e: "🌾", img: "paddy.jpg" },
    { e: "🍃", img: "leaf.jpg" },
    { e: "🌾", img: "wheat.jpg" },
  ];
  centerDefs.forEach((p, i) => {
    const t = i / (centerDefs.length - 1);
    items.push({
      key: `C${i}`,
      emoji: p.e,
      img: I(p.img),
      fx: 50,
      fy: 1 + t * 31, // 1% (tip, taller than side prongs) → 32% (base)
      sx: rand(800),
      sy: rand(600),
      size: 80 - i * 2,
      delay: 40 + i * 70,
    });
  });

  // ── Right prong (mirror of left) ──
  const rightDefs = [
    { e: "🌼", img: "marigold.jpg" },
    { e: "🎋", img: "bamboo.jpg" },
    { e: "🌸", img: "rose.jpg" },
    { e: "🌿", img: "field.jpg" },
    { e: "🥒", img: "cucumber.jpg" },
  ];
  rightDefs.forEach((p, i) => {
    const t = i / (rightDefs.length - 1);
    items.push({
      key: `R${i}`,
      emoji: p.e,
      img: I(p.img),
      fx: arcX(52, t, 4, +1), // 52 → 56 (mid) → 52
      fy: 6 + t * 26,
      sx: rand(800),
      sy: rand(600),
      size: 70 - i * 2,
      delay: 80 + i * 70,
    });
  });

  // ── Crossguard (narrow bar joining the three prong bases) ──
  const crossDefs = [
    { e: "🥕", img: "carrot.jpg", x: 45 },
    { e: "🌽", img: "corn.jpg", x: 48.5 },
    { e: "🍅", img: "tomato.jpg", x: 51.5 },
    { e: "🌶\ufe0f", img: "chilli.jpg", x: 55 },
  ];
  crossDefs.forEach((p, i) =>
    items.push({
      key: `X${i}`,
      emoji: p.e,
      img: I(p.img),
      fx: p.x,
      fy: 35,
      sx: rand(900),
      sy: rand(700),
      size: 58,
      delay: 200 + i * 50,
    })
  );

  // ── Central staff (long handle going down from crossguard to base) ──
  const staffDefs = [
    { e: "🌾", img: "paddy.jpg", y: 41 },
    { e: "🌿", img: "bamboo.jpg", y: 48 },
    { e: "🌱", img: "field.jpg", y: 55 },
    { e: "🌾", img: "wheat.jpg", y: 62 },
    { e: "🌼", img: "marigold.jpg", y: 70 }, // garland at base
  ];
  staffDefs.forEach((p, i) =>
    items.push({
      key: `S${i}`,
      emoji: p.e,
      img: I(p.img),
      fx: 50,
      fy: p.y,
      sx: rand(900),
      sy: rand(700),
      size: i === staffDefs.length - 1 ? 84 : 64, // bigger garland
      delay: 320 + i * 70,
    })
  );

  return items;
};

// Renders a single Trishul item: circular photo with emoji fallback if image fails.
function TrishulItem({
  it,
  itemsFormed,
  scattering,
  showItems,
  ease,
}: {
  it: Item;
  itemsFormed: boolean;
  scattering: boolean;
  showItems: boolean;
  ease: string;
}) {
  const [broken, setBroken] = useState(false);
  return (
    <div
      className="absolute will-change-transform rounded-full overflow-hidden flex items-center justify-center"
      style={{
        left: `${it.fx}%`,
        top: `${it.fy}%`,
        width: `${it.size}px`,
        height: `${it.size}px`,
        transform: itemsFormed
          ? "translate(-50%, -50%) scale(1) rotate(0deg)"
          : scattering
          ? // spread across the whole page from their final spots
            `translate(calc(-50% + ${it.sx}px), calc(-50% + ${it.sy}px)) scale(0.85) rotate(${
              it.sx > 0 ? 18 : -18
            }deg)`
          : // initial state: hidden far above the screen
            `translate(calc(-50% + ${it.sx * 0.15}px), calc(-50% - 110vh)) scale(0.7) rotate(${
              it.sx > 0 ? 15 : -15
            }deg)`,
        opacity: showItems ? (itemsFormed ? 1 : 0.85) : 0,
        transition: `transform 1.8s cubic-bezier(0.22, 1, 0.36, 1) ${it.delay}ms, opacity 0.9s ${ease} ${it.delay}ms`,
        boxShadow: itemsFormed
          ? "0 6px 18px rgba(0,0,0,0.55), 0 0 0 2px rgba(253,230,138,0.55)"
          : "0 4px 10px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.15)",
        background:
          "radial-gradient(circle at 50% 40%, rgba(20,83,45,0.5), rgba(5,2,1,0.7))",
      }}
    >
      {!broken && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={it.img}
          alt=""
          width={it.size}
          height={it.size}
          loading="eager"
          className="w-full h-full object-cover"
          onError={() => setBroken(true)}
        />
      )}
      {broken && (
        <span
          aria-hidden
          style={{
            fontSize: `${Math.round(it.size * 0.55)}px`,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
          }}
        >
          {it.emoji}
        </span>
      )}
    </div>
  );
}

export default function SplashClient() {
  const [phase, setPhase] = useState<Phase>("black");
  const [items, setItems] = useState<Item[]>([]);
  const [audioOn, setAudioOn] = useState(true);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [ganapatiBroken, setGanapatiBroken] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedFt, setSelectedFt] = useState<FarmingType | "">("");
  const router = useRouter();
  const { lang } = useLang();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Build trishul on mount (random scatter offsets are stable per session)
  useEffect(() => {
    setItems(buildTrishul());
  }, []);

  // Phase timeline
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("ganapati"), 400),
      setTimeout(() => setPhase("scatter"), 3000),
      setTimeout(() => setPhase("form"), 4500),
      // Trishul + mantras stay ~5s, then fade out
      setTimeout(() => setPhase("trishulFade"), 9500),
      // Trishul fades for ~1.5s, then Ganapati grows back to fill page
      setTimeout(() => setPhase("expand"), 11000),
      // Ganapati covers the page for ~5s, then transition to Indian flag
      setTimeout(() => setPhase("flag"), 16000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Try to autoplay OM audio; fall back to mute hint if browser blocks
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.55;
    a.play()
      .then(() => setAudioBlocked(false))
      .catch(() => setAudioBlocked(true));
  }, []);

  // Fade OM audio out when entering the flag phase
  useEffect(() => {
    if (phase !== "flag") return;
    const a = audioRef.current;
    if (!a) return;
    const startVol = a.volume;
    const steps = 30;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      a.volume = Math.max(0, startVol * (1 - i / steps));
      if (i >= steps) {
        clearInterval(id);
        a.pause();
        setAudioOn(false);
      }
    }, 80);
    return () => clearInterval(id);
  }, [phase]);

  const toggleAudio = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play()
        .then(() => {
          setAudioOn(true);
          setAudioBlocked(false);
        })
        .catch(() => setAudioBlocked(true));
    } else {
      a.pause();
      setAudioOn(false);
    }
  };

  const ease = "cubic-bezier(0.16, 1, 0.3, 1)";
  const showGanapati = phase !== "black" && phase !== "flag";
  // Small Ganapati (top corner) while trishul is on screen
  const ganapatiSmall =
    phase === "scatter" || phase === "form" || phase === "trishulFade";
  // showItems drives opacity — we keep crops visible during scatter/form,
  // then let them fade out during trishulFade.
  const showItems = phase === "scatter" || phase === "form";
  // itemsFormed keeps the trishul shape locked while it's fading out
  const itemsFormed = phase === "form" || phase === "trishulFade";
  // Mantras come up with the trishul and fade out with it
  const showReveal = phase === "form" || phase === "trishulFade";
  const showFlag = phase === "flag";

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050201] select-none">
      {/* Background OM chant audio. Drop your file at /public/audio/om.mp3.
          Rendered only when the file is detected, to avoid a 404 in the console. */}
      <audio ref={audioRef} src="/audio/om.mp3" loop preload="auto" />

      {/* Audio toggle (top-right) — hidden once flag phase begins */}
      <button
        type="button"
        onClick={toggleAudio}
        aria-label={audioOn ? "Mute audio" : "Play OM chant"}
        className="absolute top-3 right-3 z-50 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border transition-all"
        style={{
          background: "rgba(20, 12, 4, 0.55)",
          borderColor: "rgba(253, 230, 138, 0.45)",
          color: "#fde68a",
          opacity: showFlag ? 0 : 1,
          pointerEvents: showFlag ? "none" : "auto",
          transition: `opacity 0.8s ${ease}`,
        }}
      >
        {audioOn && !audioBlocked ? (
          <Volume2 className="w-3.5 h-3.5" />
        ) : (
          <VolumeX className="w-3.5 h-3.5" />
        )}
        {audioBlocked ? "Tap for ॐ" : audioOn ? "ॐ On" : "ॐ Off"}
      </button>

      {/* Paddy + bamboo blurred photo background (animation phases) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/images/paddy-bamboo.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(14px) saturate(1.1) brightness(0.55)",
          transform: "scale(1.12)",
          opacity: phase === "black" ? 0 : showFlag ? 0 : 1,
          transition: `opacity 1.5s ${ease}`,
        }}
      />
      {/* Dark vignette overlay so Ganapati / mantras stay readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(26,15,4,0.55) 0%, rgba(10,5,2,0.78) 60%, rgba(0,0,0,0.92) 100%)",
          opacity: phase === "black" ? 0 : showFlag ? 0 : 1,
          transition: `opacity 1.5s ${ease}`,
        }}
      />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          INDIAN FLAG BACKGROUND (final phase)
          Drop your photo at /public/images/indian-flag.jpg
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        className="absolute inset-0 z-10"
        style={{
          opacity: showFlag ? 1 : 0,
          transition: `opacity 1.8s ${ease}`,
        }}
      >
        {/* Blurred flag photo with slow cinematic zoom */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/images/indian-flag.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(8px) saturate(1.15) brightness(0.85)",
            transform: showFlag ? "scale(1.18)" : "scale(1.06)",
            transition: `transform 8s ${ease}`,
          }}
        />
        {/* Vignette + gradient overlay so text/CTA stay readable */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 70%, rgba(0,0,0,0.75) 100%)",
          }}
        />
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          GANAPATI — rises slowly, fills the page, then fades away
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        className="absolute z-30 left-1/2 will-change-transform"
        style={{
          top: ganapatiSmall ? "48%" : "50%",
          transform:
            phase === "black"
              ? "translate(-50%, 90vh) scale(0.08)"
              : "translate(-50%, -50%) scale(1)",
          opacity: phase === "black" ? 0 : showFlag ? 0 : 1,
          transition:
            phase === "ganapati"
              ? `transform 2.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.2s ease-out, top 1.8s ${ease}`
              : `transform 1.6s ${ease}, opacity 1.6s ${ease}, top 1.8s ${ease}`,
          filter: showGanapati
            ? "drop-shadow(0 0 80px rgba(251,191,36,0.65))"
            : "none",
        }}
      >
        {/* Halo glow ring (only during the centered ganapati phase) */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            top: "50%",
            left: "50%",
            width: "min(95vw, 95vh)",
            height: "min(95vw, 95vh)",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(251,191,36,0.4) 0%, rgba(251,191,36,0.12) 40%, transparent 70%)",
            opacity: phase === "ganapati" ? 1 : 0,
            transition: `opacity 1.5s ${ease}`,
            animation: phase === "ganapati" ? "ganapatiPulse 2.2s ease-in-out infinite" : "none",
          }}
        />

        {/* Ganapati image. Drop file at /public/images/ganapati.png.
            If missing, the 🕉️ emoji fallback shows instead. */}
        <div
          className="relative rounded-full overflow-hidden flex items-center justify-center"
          style={{
            width: ganapatiSmall ? "clamp(140px, 22vmin, 240px)" : "min(78vw, 78vh)",
            height: ganapatiSmall ? "clamp(140px, 22vmin, 240px)" : "min(78vw, 78vh)",
            border: "4px solid rgba(253, 230, 138, 0.7)",
            boxShadow:
              "0 0 60px rgba(251,191,36,0.55), 0 0 160px rgba(251,191,36,0.35), inset 0 0 30px rgba(0,0,0,0.25)",
            background:
              "radial-gradient(circle at 50% 40%, rgba(180, 83, 9, 0.85), rgba(120, 53, 15, 0.95))",
            transition: `width 2s ${ease}, height 2s ${ease}`,
          }}
        >
          {!ganapatiBroken && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/images/ganapati.png"
              alt="Lord Ganapati"
              className="w-full h-full object-cover"
              onError={() => setGanapatiBroken(true)}
            />
          )}
          {ganapatiBroken && (
            <span
              className="flex items-center justify-center"
              style={{
                fontSize: "9rem",
                filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.5))",
              }}
              aria-hidden
            >
              🕉️
            </span>
          )}
        </div>

        {/* "ॐ" mantra under Ganapati while centered */}
        <p
          className="mt-3 text-center font-extrabold tracking-widest"
          style={{
            color: "#fde68a",
            fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
            textShadow: "0 2px 10px rgba(0,0,0,0.7)",
            opacity: phase === "ganapati" ? 1 : 0,
            transition: `opacity 0.8s ${ease}`,
          }}
        >
          ॐ
        </p>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          TRISHUL — crops, flowers, veggies form a trident
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          opacity: showItems ? 1 : 0,
          transform: itemsFormed
            ? "translate(0, 32%) rotate(40deg) scale(0.52)"
            : phase === "expand" || showFlag
            ? "translate(0, 32%) rotate(40deg) scale(0.52, 0)"
            : "rotate(0deg) scale(1)",
          transformOrigin: "50% 50%",
          transition: `opacity 1.4s ${ease}, transform 1.6s ${ease}`,
          filter: itemsFormed ? "none" : "blur(0px)",
        }}
      >
        {items.map((it) => (
          <TrishulItem
            key={it.key}
            it={it}
            itemsFormed={itemsFormed}
            scattering={phase === "scatter"}
            showItems={showItems}
            ease={ease}
          />
        ))}

        {/* Subtle golden trishul-shaped glow behind the crops once formed */}
        {/* Trishul-shaped guide lines removed for a cleaner look. */}
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SANSKRIT MANTRAS BANNER (top, after reveal)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        lang="sa"
        className="absolute z-40 top-12 sm:top-16 left-0 right-0 px-3 pointer-events-none"
        style={{
          opacity: showReveal ? 1 : 0,
          transform: showReveal
            ? "translateY(0) scale(1)"
            : showFlag
            ? "translateY(-30px) scale(0.96)"
            : "translateY(-20px) scale(0.94)",
          transition: `opacity 1.4s ${ease}, transform 1.4s ${ease}`,
          filter: showReveal ? "blur(0px)" : "blur(4px)",
        }}
      >
        <div
          className="mx-auto max-w-5xl rounded-2xl border px-5 py-4 sm:py-5 text-center backdrop-blur-md"
          style={{
            background:
              "linear-gradient(90deg, rgba(124, 45, 18, 0.55), rgba(180, 83, 9, 0.55), rgba(124, 45, 18, 0.55))",
            borderColor: "rgba(253, 230, 138, 0.55)",
            boxShadow:
              "0 6px 20px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,247,214,0.15)",
          }}
        >
          <p
            className="font-extrabold text-2xl sm:text-4xl lg:text-5xl leading-snug tracking-wide"
            style={{ color: "#fff7d6", textShadow: "0 3px 10px rgba(0,0,0,0.8)" }}
          >
            ॐ शिवकेशवाय नमः
          </p>
          <p
            className="mt-2 font-extrabold text-2xl sm:text-4xl lg:text-5xl leading-snug tracking-wide"
            style={{ color: "#fde68a", textShadow: "0 3px 10px rgba(0,0,0,0.8)" }}
          >
            ॐ श्री मात्रे नमः &nbsp;&nbsp;|&nbsp;&nbsp; ॐ गोमात्रे नमः
          </p>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FLAG PHASE CONTENT — title (top), points (mid), CTA (lower)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        className="absolute inset-0 z-30 will-change-transform"
        style={{
          opacity: showFlag ? 1 : 0,
          transition: `opacity 1.2s ${ease}`,
          pointerEvents: showFlag ? "auto" : "none",
        }}
      >
        {/* TITLE — anchored at ~22% from top */}
        <h1
          className="absolute left-1/2 w-full max-w-5xl px-4 font-extrabold text-center leading-[1.05] tracking-tight"
          style={{
            top: "22%",
            transform: showFlag
              ? "translate(-50%, -50%) scale(1)"
              : "translate(-50%, calc(-50% + 30px)) scale(0.96)",
            opacity: showFlag ? 1 : 0,
            transition: `opacity 1s ${ease} 0.4s, transform 1.1s ${ease} 0.4s`,
          }}
        >
          <span
            className="block text-2xl sm:text-4xl lg:text-5xl xl:text-6xl"
            style={{
              color: "#fff7d6",
              textShadow: "0 4px 18px rgba(0,0,0,0.85), 0 2px 6px rgba(0,0,0,0.9)",
              letterSpacing: "0.01em",
            }}
          >
            Bhavishyath Bharat
          </span>
          <span
            className="block my-2 text-base sm:text-xl lg:text-2xl font-semibold"
            style={{ color: "#fde68a", textShadow: "0 2px 8px rgba(0,0,0,0.85)" }}
          >
            Is
          </span>
          <span className="block text-2xl sm:text-4xl lg:text-5xl xl:text-6xl">
            <span style={{ color: "#fb923c", textShadow: "0 4px 14px rgba(0,0,0,0.85)" }}>
              Organic
            </span>{" "}
            <span style={{ color: "#ffffff", textShadow: "0 4px 14px rgba(0,0,0,0.9)" }}>
              Carbon
            </span>{" "}
            <span style={{ color: "#22c55e", textShadow: "0 4px 14px rgba(0,0,0,0.85)" }}>
              Farming
            </span>
          </span>
        </h1>

        {/* POINTS + tagline — anchored at ~58% from top, centered on its own height */}
        <div
          className="absolute left-1/2 w-full max-w-3xl px-4"
          style={{
            top: "58%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <ul className="grid gap-3 sm:gap-4 w-full text-center">
            {[
              "All new natural farming with renewable Energy sources",
              "Program designed by expert farmer with latest improved science & chemistry",
              "Describing the new definition for organic farming - a part of natural farming",
              "New era in natural (organic) farming",
            ].map((line, i) => (
              <li
                key={i}
                className="text-xs sm:text-sm lg:text-base font-semibold rounded-2xl px-4 py-2 border backdrop-blur-md"
                style={{
                  color: "#f8fafc",
                  background: "rgba(20, 83, 45, 0.55)",
                  borderColor: "rgba(253, 230, 138, 0.5)",
                  textShadow: "0 1px 3px rgba(0,0,0,0.7)",
                  opacity: showFlag ? 1 : 0,
                  transform: showFlag ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.7s ${ease} ${0.9 + i * 0.18}s, transform 0.7s ${ease} ${0.9 + i * 0.18}s`,
                }}
              >
                {line}
              </li>
            ))}
          </ul>

          <p
            className="text-amber-100 mt-4 sm:mt-5 text-xs sm:text-sm lg:text-base text-center font-medium"
            style={{
              textShadow: "0 1px 4px rgba(0,0,0,0.85)",
              opacity: showFlag ? 1 : 0,
              transform: showFlag ? "translateY(0)" : "translateY(16px)",
              transition: `opacity 0.7s ${ease} 1.65s, transform 0.7s ${ease} 1.65s`,
            }}
          >
            Do <strong className="mx-1">Smart Farming</strong> for Guarantee Profits. Nature is ultimate.
          </p>
        </div>

        {/* GET STARTED — anchored at ~88% from top, centered on its own box */}
        <button
          type="button"
          onClick={() => setShowOptions(true)}
          className="absolute left-1/2 inline-flex items-center justify-center gap-3 px-12 py-4 bg-green-800 text-white rounded-2xl font-bold hover:bg-green-700 active:scale-[0.97] shadow-xl hover:shadow-2xl text-lg sm:text-xl ring-2 ring-amber-300/60"
          style={{
            top: "88%",
            opacity: showFlag ? 1 : 0,
            transform: showFlag
              ? "translate(-50%, -50%) scale(1)"
              : "translate(-50%, calc(-50% + 20px)) scale(0.94)",
            transition: `opacity 0.8s ${ease} 1.85s, transform 0.8s ${ease} 1.85s, background-color 0.2s ${ease}, box-shadow 0.2s ${ease}`,
          }}
        >
          Get Started
          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* COPYRIGHT — pinned at bottom */}
        <p
          className="absolute bottom-3 left-0 right-0 text-center text-[11px] sm:text-[11px] text-amber-100/80"
          style={{
            textShadow: "0 1px 2px rgba(0,0,0,0.8)",
            opacity: showFlag ? 1 : 0,
            transition: `opacity 0.6s ${ease} 2.1s`,
          }}
        >
          &copy; 2026 OCF-SPIN. Organic Carbon Farming. All rights reserved.
        </p>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FARMING-TYPE CHOOSER MODAL (opened by Get Started)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {showOptions && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowOptions(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-emerald-500 via-green-500 to-amber-400" />
            <button
              type="button"
              onClick={() => setShowOptions(false)}
              aria-label="Close"
              className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="p-7">
              <div className="text-center mb-5">
                <div className="mx-auto mb-3 w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Sprout className="w-9 h-9 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-green-900">
                  {t("farmingType.title", lang)}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {t("farmingType.subtitle", lang)}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {(
                  [
                    { v: "natural", titleKey: "farmingType.natural", descKey: "farmingType.naturalDesc" },
                    { v: "chemical", titleKey: "farmingType.chemical", descKey: "farmingType.chemicalDesc" },
                    { v: "terrace", titleKey: "farmingType.terrace", descKey: "farmingType.terraceDesc" },
                    { v: "both", titleKey: "farmingType.both", descKey: "farmingType.bothDesc" },
                    { v: "others", titleKey: "farmingType.others", descKey: "farmingType.othersDesc" },
                  ] as const
                ).map((opt) => {
                  const selected = selectedFt === opt.v;
                  return (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => {
                        setSelectedFt(opt.v);
                        if (typeof window !== "undefined") {
                          localStorage.setItem(FARMING_TYPE_KEY, opt.v);
                        }
                        // Brief delay so the user sees the selected state
                        setTimeout(() => {
                          setShowOptions(false);
                          router.push("/login");
                        }, 250);
                      }}
                      className={`text-left p-3 rounded-xl border-2 transition-all active:scale-[0.98] ${
                        selected
                          ? "border-emerald-600 bg-emerald-50 shadow-sm"
                          : "border-green-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/50"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {selected && (
                          <Check className="w-4 h-4 mt-0.5 text-emerald-600 flex-shrink-0" />
                        )}
                        <div>
                          <div className="text-sm font-bold text-green-900 leading-tight">
                            {t(opt.titleKey, lang)}
                          </div>
                          <div className="text-xs text-green-700/70 mt-0.5">
                            {t(opt.descKey, lang)}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* keyframes for ganapati halo pulse */}
      <style jsx>{`
        @keyframes ganapatiPulse {
          0%,
          100% {
            opacity: 0.85;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.08);
          }
        }
      `}</style>
    </div>
  );
}
