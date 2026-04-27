"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sprout,
  Bug,
  Microscope,
  Leaf,
  Wheat,
  HeartPulse,
  Apple,
  Recycle,
  ShieldCheck,
  Flower2,
  SprayCan,
  Droplets,
  Stethoscope,
  TestTube,
  FlaskConical,
  Worm,
  TreePine,
  Mountain,
} from "lucide-react";

type Slide = {
  title: string;
  tagline: string;
  desc: string;
  gradient: string;
  accent: string;
  icon: typeof Wheat;
};

const seedSlides: Slide[] = [
  {
    title: "For Food",
    tagline: "Nourishing the nation",
    desc: "Seeds that feed nations — ensuring food security through organic, high-quality seed varieties grown on regenerated soil.",
    gradient: "from-emerald-600 via-green-700 to-lime-700",
    accent: "text-lime-200",
    icon: Wheat,
  },
  {
    title: "For Life",
    tagline: "Biodiversity, restored",
    desc: "Seeds that sustain ecosystems — preserving biodiversity and fostering life in every grain we plant back into the earth.",
    gradient: "from-amber-500 via-orange-600 to-rose-600",
    accent: "text-amber-100",
    icon: HeartPulse,
  },
  {
    title: "For Nutrition",
    tagline: "Wellness, by design",
    desc: "Seeds rich in micro-nutrients — combating malnutrition with nature's own formulations and time-tested heirloom varieties.",
    gradient: "from-teal-500 via-cyan-600 to-sky-700",
    accent: "text-cyan-100",
    icon: Apple,
  },
  {
    title: "For Seed",
    tagline: "Self-reliant farming",
    desc: "Seeds that perpetuate — building self-reliant farming through indigenous seed banks owned by the community.",
    gradient: "from-violet-600 via-purple-700 to-fuchsia-700",
    accent: "text-violet-100",
    icon: Recycle,
  },
];

const pestSlides: Slide[] = [
  {
    title: "Biocontrol Agents",
    tagline: "Nature vs. nature",
    desc: "Release ladybugs, lacewings, and trichogramma to keep aphids and bollworms in check — no chemicals required.",
    gradient: "from-amber-500 via-orange-600 to-yellow-600",
    accent: "text-amber-100",
    icon: Bug,
  },
  {
    title: "Neem & Botanicals",
    tagline: "Ancient wisdom, modern fields",
    desc: "Neem oil, panchagavya, and herbal extracts disrupt pest life cycles while staying safe for pollinators and soil life.",
    gradient: "from-lime-600 via-amber-600 to-orange-600",
    accent: "text-lime-100",
    icon: SprayCan,
  },
  {
    title: "Companion Planting",
    tagline: "Diversity is defense",
    desc: "Marigolds, basil, and trap crops confuse pests and attract beneficial insects — turning your field into a balanced ecosystem.",
    gradient: "from-orange-500 via-rose-500 to-pink-600",
    accent: "text-rose-100",
    icon: Flower2,
  },
  {
    title: "Pheromone Traps",
    tagline: "Smart, targeted, organic",
    desc: "Species-specific lures detect outbreaks early so you intervene at the right moment with the lightest touch.",
    gradient: "from-yellow-500 via-amber-600 to-red-600",
    accent: "text-yellow-100",
    icon: ShieldCheck,
  },
];

const infectionSlides: Slide[] = [
  {
    title: "Early Detection",
    tagline: "Catch it before it spreads",
    desc: "Weekly scouting, leaf-pattern recognition, and field diagnostics flag fungal and bacterial threats before they take hold.",
    gradient: "from-rose-600 via-red-600 to-orange-600",
    accent: "text-rose-100",
    icon: Stethoscope,
  },
  {
    title: "Soil Health First",
    tagline: "Strong roots, strong defence",
    desc: "Living soil rich in mycorrhizae and humus builds plant immunity from the ground up — disease starts where soil ends.",
    gradient: "from-amber-700 via-orange-700 to-rose-700",
    accent: "text-amber-100",
    icon: Mountain,
  },
  {
    title: "Crop Rotation",
    tagline: "Break the cycle",
    desc: "Rotating legumes, cereals, and cover crops starves pathogens of their host and rebuilds nutrients naturally.",
    gradient: "from-red-600 via-pink-600 to-fuchsia-700",
    accent: "text-pink-100",
    icon: Recycle,
  },
  {
    title: "Organic Treatments",
    tagline: "Heal, don't harm",
    desc: "Trichoderma, jeevamrutham, and copper-based bio-fungicides treat outbreaks without poisoning soil microbes.",
    gradient: "from-rose-500 via-red-600 to-amber-700",
    accent: "text-rose-100",
    icon: TestTube,
  },
];

const nutrientSlides: Slide[] = [
  {
    title: "Organic Carbon",
    tagline: "The soul of soil",
    desc: "Building organic carbon through green manures and crop residues unlocks long-term fertility and water retention.",
    gradient: "from-teal-600 via-emerald-700 to-green-700",
    accent: "text-teal-100",
    icon: TreePine,
  },
  {
    title: "Vermicompost",
    tagline: "Worms write the soil's story",
    desc: "Earthworm-cast compost delivers slow-release NPK plus enzymes and microbes that supercharge plant uptake.",
    gradient: "from-emerald-600 via-teal-700 to-cyan-700",
    accent: "text-emerald-100",
    icon: Worm,
  },
  {
    title: "Bio-fertilizers",
    tagline: "Living nutrition",
    desc: "Azospirillum, rhizobium, and PSB inoculants fix nitrogen and solubilize phosphorus the way nature intended.",
    gradient: "from-cyan-600 via-teal-700 to-blue-700",
    accent: "text-cyan-100",
    icon: FlaskConical,
  },
  {
    title: "Water & Sun",
    tagline: "Balance is everything",
    desc: "Drip irrigation, mulching, and canopy management turn light and water into yield — without depleting the land.",
    gradient: "from-sky-600 via-cyan-600 to-amber-500",
    accent: "text-sky-100",
    icon: Droplets,
  },
];

const spinItems = [
  {
    letter: "S",
    title: "Seed",
    icon: Sprout,
    desc: "The foundation of organic farming — choose the right seed for the right soil.",
    color: "bg-green-600",
    lightColor: "bg-green-50",
    borderColor: "border-green-300",
    textColor: "text-green-700",
    glow: "shadow-green-400/40",
    slides: seedSlides,
  },
  {
    letter: "P",
    title: "Pests and Insects",
    icon: Bug,
    desc: "Natural pest management using biocontrol agents, neem-based solutions, and companion planting.",
    color: "bg-amber-600",
    lightColor: "bg-amber-50",
    borderColor: "border-amber-300",
    textColor: "text-amber-700",
    glow: "shadow-amber-400/40",
    slides: pestSlides,
  },
  {
    letter: "I",
    title: "Infections",
    icon: Microscope,
    desc: "Early detection and organic treatment of plant diseases through soil health and crop rotation.",
    color: "bg-red-600",
    lightColor: "bg-red-50",
    borderColor: "border-red-300",
    textColor: "text-red-700",
    glow: "shadow-red-400/40",
    slides: infectionSlides,
  },
  {
    letter: "N",
    title: "Nutrients",
    icon: Leaf,
    desc: "Organic carbon enrichment, vermicompost, and natural nutrient cycles for sustained soil fertility.",
    color: "bg-teal-600",
    lightColor: "bg-teal-50",
    borderColor: "border-teal-300",
    textColor: "text-teal-700",
    glow: "shadow-teal-400/40",
    slides: nutrientSlides,
  },
];

const AUTOPLAY_MS = 5000;

export default function SpinCarousel() {
  const [activeCard, setActiveCard] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const activeItem = spinItems[activeCard];
  const slides = activeItem.slides;
  const slideCount = slides.length;

  // Reset slide & progress whenever the user picks a different SPIN card
  useEffect(() => {
    setSlideIdx(0);
    setProgress(0);
  }, [activeCard]);

  // Auto-rotate slides for the active card
  useEffect(() => {
    if (paused) return;
    const tickMs = 50;
    const interval = window.setInterval(() => {
      setProgress((p) => {
        const nextP = p + (tickMs / AUTOPLAY_MS) * 100;
        return nextP >= 100 ? 100 : nextP;
      });
    }, tickMs);
    return () => window.clearInterval(interval);
  }, [paused, slideIdx, slideCount]);

  // Advance slide once progress fills (kept outside the updater so React 19
  // strict-mode double-invocation can't skip slides).
  useEffect(() => {
    if (progress >= 100) {
      setSlideIdx((s) => (s + 1) % slideCount);
      setProgress(0);
    }
  }, [progress, slideCount]);

  const goTo = (i: number) => {
    setSlideIdx(((i % slideCount) + slideCount) % slideCount);
    setProgress(0);
  };
  const next = () => goTo(slideIdx + 1);
  const prev = () => goTo(slideIdx - 1);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideIdx, slideCount]);

  const slide = slides[slideIdx];
  const SlideIcon = slide.icon;

  return (
    <div className="space-y-10">
      {/* SPIN 4 Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {spinItems.map((item, idx) => {
          const active = activeCard === idx;
          return (
            <button
              key={item.letter}
              onClick={() => setActiveCard(idx)}
              className={`group relative text-left p-6 rounded-2xl border-2 overflow-hidden transition-all duration-500 hover-lift ${
                active
                  ? `${item.lightColor} ${item.borderColor} shadow-2xl ${item.glow} scale-[1.03]`
                  : "bg-white border-gray-100 hover:border-gray-200"
              }`}
            >
              {/* Animated corner glow when active */}
              {active && (
                <span
                  aria-hidden
                  className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-50 ${item.color}`}
                />
              )}

              <div className="relative flex items-center gap-3 mb-4">
                <div
                  className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center shadow-md transition-transform duration-500 ${
                    active ? "rotate-[-6deg] scale-110" : "group-hover:scale-105"
                  }`}
                >
                  <span className="text-white text-2xl font-extrabold drop-shadow">
                    {item.letter}
                  </span>
                </div>
                <item.icon
                  className={`w-7 h-7 transition-colors duration-300 ${
                    active ? item.textColor : "text-gray-400 group-hover:text-gray-600"
                  } ${active ? "animate-float" : ""}`}
                />
              </div>
              <h3
                className={`relative text-lg font-bold mb-2 transition-colors ${
                  active ? item.textColor : "text-gray-700"
                }`}
              >
                {item.title}
                {active && (
                  <span
                    className={`block mt-1 h-0.5 w-12 ${item.color} rounded-full`}
                  />
                )}
              </h3>
              <p
                className={`relative text-sm leading-relaxed ${
                  active ? "text-gray-700" : "text-gray-500"
                }`}
              >
                {item.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Slides for the active SPIN card */}
      {(
        <div
          key={`panel-${activeCard}`}
          className="relative overflow-hidden rounded-3xl shadow-2xl animate-fade-up"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0]?.clientX ?? null;
            setPaused(true);
          }}
          onTouchEnd={(e) => {
            const start = touchStartX.current;
            const end = e.changedTouches[0]?.clientX ?? start ?? 0;
            if (start !== null && Math.abs(end - start) > 50) {
              if (end < start) next();
              else prev();
            }
            touchStartX.current = null;
            setPaused(false);
          }}
        >
          {/* Animated gradient background — swaps per slide */}
          <div
            key={`bg-${activeCard}-${slideIdx}`}
            className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} animate-fade-in`}
          />
          {/* Aurora wash + floating blobs */}
          <div className="absolute inset-0 bg-aurora opacity-20 mix-blend-overlay" />
          <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-white/20 blur-3xl animate-blob" />
          <div className="absolute bottom-[-4rem] left-[-3rem] w-72 h-72 rounded-full bg-amber-300/30 blur-3xl animate-blob-delay-2" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] rounded-full bg-white/5 blur-3xl" />

          {/* Decorative ghost letter */}
          <div
            className="absolute -right-6 -bottom-12 text-[18rem] font-extrabold text-white/5 leading-none select-none pointer-events-none"
            aria-hidden
          >
            {activeItem.letter}
          </div>

          <div className="relative grid md:grid-cols-[1fr_auto] gap-8 p-8 sm:p-12 min-h-[22rem]">
            {/* Left: text */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-white/70 text-xs font-semibold uppercase tracking-[0.2em]">
                  {activeItem.letter} · {activeItem.title}
                </span>
                <span className="h-px flex-1 bg-white/20" />
                <span className="text-white/60 text-xs font-mono">
                  {String(slideIdx + 1).padStart(2, "0")} / {String(slideCount).padStart(2, "0")}
                </span>
              </div>

              <div key={`copy-${activeCard}-${slideIdx}`} className="animate-fade-up">
                <p className={`text-sm font-semibold uppercase tracking-widest mb-3 ${slide.accent}`}>
                  {slide.tagline}
                </p>
                <h3 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-5 drop-shadow-sm">
                  {slide.title}
                </h3>
                <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-xl">
                  {slide.desc}
                </p>
              </div>

              {/* Controls + progress */}
              <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={prev}
                    aria-label="Previous slide"
                    className="w-11 h-11 bg-white/15 hover:bg-white/25 backdrop-blur rounded-full flex items-center justify-center transition active:scale-90"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next slide"
                    className="w-11 h-11 bg-white/15 hover:bg-white/25 backdrop-blur rounded-full flex items-center justify-center transition active:scale-90"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-1">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`relative h-1.5 rounded-full overflow-hidden transition-all duration-500 ${
                        i === slideIdx ? "flex-1 bg-white/30" : "w-6 bg-white/20 hover:bg-white/40"
                      }`}
                    >
                      {i === slideIdx && (
                        <span
                          className="absolute inset-y-0 left-0 bg-white rounded-full"
                          style={{ width: `${progress}%`, transition: "width 50ms linear" }}
                        />
                      )}
                      {i < slideIdx && (
                        <span className="absolute inset-0 bg-white/80 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: animated icon medallion */}
            <div className="hidden md:flex items-center justify-center">
              <div
                key={`icon-${activeCard}-${slideIdx}`}
                className="relative w-44 h-44 rounded-full bg-white/10 backdrop-blur-sm border border-white/25 flex items-center justify-center animate-pop-in ring-pulse"
              >
                <div className="absolute inset-3 rounded-full bg-white/10" />
                <SlideIcon className="relative w-20 h-20 text-white drop-shadow-lg animate-float" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
