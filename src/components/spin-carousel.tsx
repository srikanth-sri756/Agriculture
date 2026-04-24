"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sprout, Bug, Microscope, Leaf } from "lucide-react";

const seedSlides = [
  { title: "For Food", desc: "Seeds that feed nations — ensuring food security through organic, high-quality seed varieties.", color: "from-green-500 to-emerald-600" },
  { title: "For Life", desc: "Seeds that sustain ecosystems — preserving biodiversity and fostering life in every grain.", color: "from-amber-500 to-orange-600" },
  { title: "For Nutrition", desc: "Seeds rich in micro-nutrients — combating malnutrition with nature's own formulations.", color: "from-teal-500 to-cyan-600" },
  { title: "For Seed", desc: "Seeds that perpetuate — building self-reliant farming through indigenous seed banks.", color: "from-violet-500 to-purple-600" },
];

const spinItems = [
  {
    letter: "S",
    title: "Seed",
    icon: Sprout,
    desc: "The foundation of organic farming — choose the right seed for the right soil.",
    color: "bg-green-600",
    lightColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
    hasSlides: true,
  },
  {
    letter: "P",
    title: "Pests and Insects",
    icon: Bug,
    desc: "Natural pest management using biocontrol agents, neem-based solutions, and companion planting.",
    color: "bg-amber-600",
    lightColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    hasSlides: false,
  },
  {
    letter: "I",
    title: "Infections",
    icon: Microscope,
    desc: "Early detection and organic treatment of plant diseases through soil health and crop rotation.",
    color: "bg-red-600",
    lightColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
    hasSlides: false,
  },
  {
    letter: "N",
    title: "Nutrients",
    icon: Leaf,
    desc: "Organic carbon enrichment, vermicompost, and natural nutrient cycles for sustained soil fertility.",
    color: "bg-teal-600",
    lightColor: "bg-teal-50",
    borderColor: "border-teal-200",
    textColor: "text-teal-700",
    hasSlides: false,
  },
];

export default function SpinCarousel() {
  const [activeCard, setActiveCard] = useState(0);
  const [seedSlide, setSeedSlide] = useState(0);

  // Auto-rotate seed slides when Seed card is active
  useEffect(() => {
    if (activeCard !== 0) return;
    const timer = setInterval(() => {
      setSeedSlide((prev) => (prev + 1) % seedSlides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [activeCard]);

  return (
    <div className="space-y-10">
      {/* SPIN 4 Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {spinItems.map((item, idx) => (
          <button
            key={item.letter}
            onClick={() => setActiveCard(idx)}
            className={`text-left p-6 rounded-2xl border-2 transition-all duration-300 ${
              activeCard === idx
                ? `${item.lightColor} ${item.borderColor} shadow-lg scale-[1.02]`
                : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-md"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center shadow-md`}>
                <span className="text-white text-xl font-extrabold">{item.letter}</span>
              </div>
              <item.icon className={`w-6 h-6 ${activeCard === idx ? item.textColor : "text-gray-400"}`} />
            </div>
            <h3 className={`text-lg font-bold mb-2 ${activeCard === idx ? item.textColor : "text-gray-700"}`}>
              {item.title}
            </h3>
            <p className={`text-sm leading-relaxed ${activeCard === idx ? "text-gray-700" : "text-gray-500"}`}>
              {item.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Seed Slides (visible when Seed card is active) */}
      {activeCard === 0 && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-800 to-emerald-900 p-8 sm:p-12 shadow-2xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-40 h-40 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-4 left-4 w-32 h-32 bg-amber-300 rounded-full blur-3xl" />
          </div>

          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <span className="text-green-300 text-sm font-semibold uppercase tracking-wider">Seed — Slide {seedSlide + 1} of {seedSlides.length}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSeedSlide((prev) => (prev - 1 + seedSlides.length) % seedSlides.length)}
                  className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => setSeedSlide((prev) => (prev + 1) % seedSlides.length)}
                  className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="transition-all duration-500">
              <div className={`inline-block px-4 py-1.5 rounded-full bg-gradient-to-r ${seedSlides[seedSlide].color} text-white text-sm font-bold mb-4`}>
                {seedSlides[seedSlide].title}
              </div>
              <p className="text-white/90 text-lg sm:text-xl leading-relaxed max-w-2xl">
                {seedSlides[seedSlide].desc}
              </p>
            </div>

            {/* Slide indicators */}
            <div className="flex gap-2 mt-8">
              {seedSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSeedSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === seedSlide ? "w-8 bg-amber-400" : "w-2 bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
