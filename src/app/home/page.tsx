import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  Sprout, Leaf, ArrowRight, CheckCircle,
  Zap, TrendingUp, Sun, CloudRain, DollarSign,
  MapPin, Phone, Mail, ShieldCheck,
  Users, Globe, Award, ChevronRight,
  ClipboardList, BarChart3, Handshake,
} from "lucide-react";
import SpinCarousel from "@/components/spin-carousel";
import ScrollReveal from "@/components/scroll-reveal";
import AnimatedCounter from "@/components/animated-counter";
import HomeFeedSection from "@/components/home-feed-section";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { role?: string } | undefined;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ─── NAVIGATION ─── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-green-100/60 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[4.5rem]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl overflow-hidden shadow-md ring-1 ring-green-200/50">
                <Image
                  src="/images/ocf-logo.png"
                  alt="OCF-SPIN"
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-green-900 tracking-tight leading-none">OCF-SPIN</span>
                <span className="text-[10px] text-green-600 font-medium tracking-wider uppercase">Organic Carbon Farming</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-1 text-sm font-medium text-green-800">
              {[
                { href: "#spin", label: "SPIN" },
                { href: "#about", label: "About" },
                { href: "#how-it-works", label: "How It Works" },
                { href: "/feeds", label: "Feeds" },
                { href: "#contact", label: "Contact" },
              ].map(link => (
                <a key={link.href} href={link.href} className="nav-link px-4 py-2 rounded-lg hover:bg-green-50 transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              {session ? (
                <Link
                  href={user?.role === "admin" ? "/admin" : "/dashboard"}
                  className="px-5 py-2.5 bg-green-800 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  {user?.role === "admin" ? "Admin Dashboard" : "My Dashboard"}
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden sm:inline-flex px-4 py-2 text-green-800 font-medium hover:bg-green-50 rounded-xl transition"
                  >
                    Login
                  </Link>
                  <a
                    href="#spin"
                    className="px-5 py-2.5 bg-green-800 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Get Started
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden min-h-[calc(100vh-4.5rem)]">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/crops-bg.jpg"
            alt=""
            fill
            className="object-cover blur-[2px] scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-green-950/75 via-green-950/60 to-green-950/80" />
        </div>

        {/* Floating decorative shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-[10%] w-72 h-72 bg-green-400/10 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-amber-400/10 rounded-full blur-3xl animate-float-delay" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-400/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-16 lg:pb-28">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-10 items-center min-h-[calc(100vh-10rem)]">
            {/* LEFT: Logo circle */}
            <div className="flex flex-col items-center justify-center text-center animate-slide-up">
              <div className="relative group">
                <div className="absolute -inset-3 bg-gradient-to-br from-green-400/20 to-amber-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-700" />
                <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full overflow-hidden shadow-2xl border-4 border-white/20 ring-1 ring-white/10">
                  <Image
                    src="/images/ocf-logo.png"
                    alt="Organic Carbon Farming with SPIN"
                    width={224}
                    height={224}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-6 drop-shadow-lg">OCF-SPIN</h2>
              <p className="text-green-300/80 text-sm mt-1 font-medium">Organic Carbon Farming</p>
            </div>

            {/* MIDDLE: Main content */}
            <div className="space-y-7 text-center lg:text-left animate-slide-up-delay-2">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm text-green-200 rounded-full text-xs font-semibold uppercase tracking-widest border border-white/10">
                  <Sprout className="w-3.5 h-3.5" /> The Future of Farming
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.05] drop-shadow-lg">
                  <span className="text-amber-300 text-gradient-animated bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">Bhavishyath</span>{" "}
                  <span className="bg-gradient-to-r from-green-300 to-emerald-200 bg-clip-text text-transparent">Bharat</span>
                </h1>
                <p className="text-xl sm:text-2xl font-bold text-white/90">
                  Is <span className="text-amber-300">Organic Carbon Farming</span>
                </p>
                <p className="text-sm text-green-300/60 italic">(nature is ultimate)</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-lg">
                <p className="text-xl sm:text-2xl font-bold text-white mb-4">
                  Do <span className="text-amber-300">Smart Farming</span> for Guarantee Profits
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-2.5 text-sm font-medium">
                  {[
                    { icon: Zap, label: "Instant Growth", color: "text-amber-300" },
                    { icon: TrendingUp, label: "High Yield", color: "text-green-300" },
                    { icon: DollarSign, label: "Financial Freedom", color: "text-amber-300" },
                    { icon: CloudRain, label: "Climate Change", color: "text-blue-300" },
                  ].map(item => (
                    <span key={item.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-white/90 rounded-full border border-white/10">
                      <item.icon className={`w-4 h-4 ${item.color}`} /> {item.label}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-green-200/60 text-sm leading-relaxed">
                Farming Designed for <strong className="text-white/80">Instant Growth in Plants</strong>,{" "}
                <strong className="text-white/80">High Yield in Crops</strong>, <strong className="text-white/80">Financial Freedom</strong> &amp;{" "}
                <strong className="text-white/80">Climate Change</strong> solutions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="#spin"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-400 text-green-950 rounded-xl font-bold hover:bg-amber-300 transition-all shadow-lg hover:shadow-amber-400/25 hover:-translate-y-0.5 text-lg"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#spin"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/20 text-white rounded-xl font-semibold hover:bg-white/10 transition-all text-lg backdrop-blur-sm"
                >
                  Explore SPIN
                </a>
              </div>
            </div>

            {/* RIGHT: Founder card */}
            <div className="flex justify-center animate-slide-up-delay-4">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/15 p-6 sm:p-8 max-w-[320px] text-center">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-br from-amber-400/20 to-green-400/20 rounded-full blur-lg group-hover:blur-xl transition-all" />
                  <div className="relative w-32 h-32 mx-auto mb-5 rounded-full overflow-hidden border-4 border-white/20 shadow-lg">
                    <Image
                      src="/images/founder.jpeg"
                      alt="Founder"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">Founder</h3>
                <p className="text-amber-300 text-sm font-semibold mt-1">Organic Carbon Farming Visionary</p>
                <div className="mt-4 space-y-3 text-sm text-green-200/60 leading-relaxed text-left">
                  <p>
                    Passionate about transforming Indian agriculture through organic carbon farming, 
                    bringing sustainable, profitable solutions to every farmer.
                  </p>
                  <p>
                    With years of hands-on experience in organic practices, the mission is to make 
                    <strong className="text-white/80"> Bharat self-reliant</strong> through nature-first farming.
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap gap-2 justify-center">
                  {["Organic Advocate", "Carbon Farming", "Smart Agriculture"].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/10 text-green-200/80 rounded-full text-xs font-semibold border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ─── IMPACT STATS ─── */}
      <section className="relative -mt-12 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="bg-gradient-to-r from-green-800 via-green-900 to-emerald-900 rounded-3xl shadow-2xl p-8 sm:p-10 border border-green-700/30">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {[
                  { end: 5000, suffix: "+", label: "Farmers Enrolled", icon: Users },
                  { end: 12000, suffix: "+", label: "Acres Covered", icon: Globe },
                  { end: 850, suffix: "T", label: "Carbon Sequestered", icon: Leaf },
                  { end: 15, suffix: "+", label: "Years of Experience", icon: Award },
                ].map((stat, i) => (
                  <div key={stat.label} className="text-center">
                    <stat.icon className="w-6 h-6 text-amber-300/60 mx-auto mb-2" />
                    <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
                      <AnimatedCounter end={stat.end} suffix={stat.suffix} duration={2000 + i * 200} />
                    </div>
                    <div className="text-xs sm:text-sm text-green-300/60 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── TAGLINE BANNER ─── */}
      <section className="py-16">
        <ScrollReveal>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-lg sm:text-xl font-bold text-green-800">
              {[
                { icon: Zap, label: "Instant Growth in Plants" },
                { icon: TrendingUp, label: "High Yield in Crops" },
                { icon: DollarSign, label: "Financial Freedom" },
                { icon: CloudRain, label: "Climate Change" },
              ].map((item, i) => (
                <span key={item.label} className="flex items-center gap-2">
                  {i > 0 && <span className="text-amber-400 mr-6 hidden sm:inline">✦</span>}
                  <item.icon className="w-5 h-5 text-amber-500" />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── BANNER SHOWCASE ─── */}
      <section className="py-12">
        <ScrollReveal>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-green-200/50">
              <Image
                src="/images/banner.jpeg"
                alt="OCF.SPIN: Organic Carbon Farming. Seed, soil layers and roots"
                width={1200}
                height={500}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-950/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <p className="text-white font-bold text-lg sm:text-xl drop-shadow-lg">
                  Rooted in Science. Grown with Nature.
                </p>
                <p className="text-green-200/70 text-sm mt-1">
                  Carbon-rich soil layers powering the next generation of farming
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── ADMIN POSTS / NOTIFICATIONS (visible to logged-in farmers) ─── */}
      <HomeFeedSection />

      {/* ─── SPIN SECTION ─── */}
      <section id="spin" className="py-24 bg-gradient-to-b from-white via-green-50/40 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold uppercase tracking-widest mb-4">
                <Leaf className="w-3.5 h-3.5" /> Our Framework
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-green-950 mb-4">
                <span className="text-green-600">S</span>eed &middot;{" "}
                <span className="text-amber-600">P</span>ests and Insects &middot;{" "}
                <span className="text-red-600">I</span>nfections &middot;{" "}
                <span className="text-teal-600">N</span>utrients
              </h2>
              <p className="text-lg text-green-700/70 max-w-2xl mx-auto">
                The four pillars of <strong>SPIN</strong>: a comprehensive approach to organic carbon farming
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <SpinCarousel />
          </ScrollReveal>
        </div>
      </section>

      {/* ─── ABOUT: What is Organic Carbon Farming ─── */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold uppercase tracking-widest mb-4">
                  <Globe className="w-3.5 h-3.5" /> About
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-green-950 mb-6 leading-tight">
                  What is Organic<br />Carbon Farming?
                </h2>
                <div className="space-y-4 text-green-800/70 leading-relaxed">
                  <p>
                    <strong className="text-green-900">Organic Carbon Farming</strong> is a revolutionary 
                    approach that focuses on increasing the carbon content in soil through natural, organic 
                    methods. By building soil organic carbon, farmers can dramatically improve soil health, 
                    water retention, and crop productivity, all while fighting climate change.
                  </p>
                  <p>
                    Unlike conventional farming that depletes nutrients, carbon farming <strong className="text-green-900">
                    regenerates the soil ecosystem</strong>. Through practices like composting, cover cropping, 
                    mulching, and bio-inputs, carbon is sequestered from the atmosphere back into the earth, 
                    making every farm a carbon sink.
                  </p>
                  <p>
                    The <strong className="text-green-900">OCF-SPIN</strong> platform empowers farmers to track 
                    their organic practices, measure improvements, and connect with markets that value 
                    sustainably-grown produce. It&apos;s farming that&apos;s good for the planet, the soil, 
                    and the farmer&apos;s bottom line.
                  </p>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  {[
                    "Increases soil fertility naturally",
                    "Reduces dependency on chemicals",
                    "Sequesters atmospheric carbon",
                    "Boosts crop yield over time",
                    "Improves water retention in soil",
                    "Builds long-term farm profitability",
                  ].map(item => (
                    <div key={item} className="flex items-start gap-2.5 text-sm text-green-700">
                      <CheckCircle className="w-4.5 h-4.5 text-green-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Visual side */}
            <ScrollReveal direction="right" delay={150}>
              <div className="space-y-5">
                {/* Banner image with overlay */}
                <div className="relative rounded-3xl overflow-hidden shadow-xl">
                  <Image
                    src="/images/banner.jpeg"
                    alt="OCF.SPIN soil layers and carbon farming"
                    width={600}
                    height={280}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-950/70 via-green-950/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-white font-bold text-sm drop-shadow-lg">Deep-rooted science for carbon-rich soil</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-800 to-emerald-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-green-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                        <Leaf className="w-7 h-7 text-amber-300" />
                      </div>
                      <h3 className="text-2xl font-bold">Why Carbon Matters</h3>
                    </div>
                    <p className="text-green-200/70 leading-relaxed mb-8">
                      Soil with just 1% more organic carbon can hold 20,000 gallons more water per acre. 
                      Carbon-rich soil grows healthier plants, resists drought, and produces more nutritious food.
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      {[
                        { value: "3x", label: "Better Water Retention" },
                        { value: "40%", label: "More Nutrient Uptake" },
                        { value: "2x", label: "Profit Increase" },
                      ].map(stat => (
                        <div key={stat.label} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                          <div className="text-3xl font-extrabold text-amber-300">{stat.value}</div>
                          <div className="text-xs text-green-300/70 mt-1.5">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm card-glow">
                    <Sun className="w-9 h-9 text-amber-500 mb-3" />
                    <h4 className="font-bold text-green-900 mb-1">Nature First</h4>
                    <p className="text-sm text-green-700/70">Working with nature, not against it</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm card-glow">
                    <Sprout className="w-9 h-9 text-green-600 mb-3" />
                    <h4 className="font-bold text-green-900 mb-1">Sustainable</h4>
                    <p className="text-sm text-green-700/70">Farming that lasts for generations</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─── VISUAL STRIP ─── */}
      <section className="relative h-64 sm:h-80 overflow-hidden">
        <Image
          src="/images/crops-bg.jpg"
          alt="Organic farming fields"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/80 via-green-950/50 to-green-950/80" />
        <div className="relative h-full flex items-center justify-center">
          <ScrollReveal>
            <div className="text-center px-4">
              <div className="flex items-center justify-center gap-4 sm:gap-8 mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white/30 shadow-lg">
                  <Image src="/images/ocf-logo.png" alt="OCF Logo" width={80} height={80} className="w-full h-full object-cover" />
                </div>
                <div className="text-white text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight drop-shadow-lg leading-tight max-w-xl">
                  New era in natural <span className="text-amber-300">(organic)</span> farming
                </div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white/30 shadow-lg">
                  <Image src="/images/founder.jpeg" alt="Founder" width={80} height={80} className="w-full h-full object-cover" />
                </div>
              </div>
              <p className="text-green-200/70 text-sm sm:text-base font-medium">Empowering Indian farmers through organic carbon-based agriculture</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-24 bg-gradient-to-b from-green-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold uppercase tracking-widest mb-4">
                <ChevronRight className="w-3.5 h-3.5" /> How It Works
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-green-950 mb-4">
                Your Journey to Smart Farming
              </h2>
              <p className="text-lg text-green-700/70 max-w-2xl mx-auto">
                Get started in four simple steps and transform your farm with organic carbon methods
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-green-200 via-amber-200 to-emerald-200" />

            {[
              { step: "01", icon: ClipboardList, title: "Register", desc: "Enroll as a farmer on OCF-SPIN with your basic details and farm information.", color: "bg-green-600", ring: "ring-green-100" },
              { step: "02", icon: BarChart3, title: "Assess Your Farm", desc: "Complete the baseline assessment covering crops, soil health, and farming practices.", color: "bg-amber-500", ring: "ring-amber-100" },
              { step: "03", icon: Sprout, title: "Implement SPIN", desc: "Follow personalized organic carbon farming recommendations for your land.", color: "bg-emerald-600", ring: "ring-emerald-100" },
              { step: "04", icon: Handshake, title: "Grow & Profit", desc: "Track your progress, improve yields, and connect with organic produce markets.", color: "bg-teal-600", ring: "ring-teal-100" },
            ].map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 120}>
                <div className="relative text-center group">
                  <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg ring-4 ${item.ring} group-hover:-translate-y-1 transition-all duration-300 relative z-10`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-xs font-bold text-green-400 uppercase tracking-widest mb-2">Step {item.step}</div>
                  <h3 className="text-xl font-bold text-green-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-green-700/70 leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/crops-bg.jpg"
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-green-950/80 backdrop-blur-sm" />
        </div>

        <ScrollReveal>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 sm:p-16 shadow-2xl border border-white/15">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                  <Image src="/images/ocf-logo.png" alt="OCF" width={64} height={64} className="w-full h-full object-cover" />
                </div>
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/15 shadow-lg">
                  <Image src="/images/banner.jpeg" alt="OCF.SPIN" width={80} height={80} className="w-full h-full object-cover" />
                </div>
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                  <Image src="/images/founder.jpeg" alt="Founder" width={64} height={64} className="w-full h-full object-cover" />
                </div>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
                Ready to Start<br />Smart Farming?
              </h2>
              <p className="text-lg text-green-200/60 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join Bhavishyath Bharat&apos;s organic carbon farming revolution. Register today and 
                take the first step towards guaranteed profits, high yields, and a sustainable future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/login"
                  className="group inline-flex items-center justify-center gap-2 px-10 py-4 bg-amber-400 text-green-950 rounded-xl font-bold hover:bg-amber-300 transition-all shadow-lg hover:shadow-amber-400/25 hover:-translate-y-0.5 text-lg"
                >
                  <Sprout className="w-5 h-5" />
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-10 py-4 border-2 border-white/20 text-white rounded-xl font-semibold hover:bg-white/10 transition-all text-lg"
                >
                  Admin Login
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── CONTACT ─── */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold uppercase tracking-widest mb-4">
                <Mail className="w-3.5 h-3.5" /> Contact
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-green-950 mb-4">Get In Touch</h2>
              <p className="text-lg text-green-700/70 max-w-xl mx-auto">Have questions about OCF-SPIN? We&apos;re here to help.</p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: MapPin, title: "Office", detail: "Andhra Pradesh, India", delay: 0 },
              { icon: Phone, title: "Phone", detail: "+91 XXXXX XXXXX", delay: 120 },
              { icon: Mail, title: "Email", detail: "info@ocf-spin.org", delay: 240 },
            ].map(item => (
              <ScrollReveal key={item.title} delay={item.delay}>
                <div className="text-center p-8 bg-gradient-to-b from-green-50 to-white rounded-2xl border border-green-100 card-glow">
                  <div className="w-14 h-14 bg-green-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                    <item.icon className="w-7 h-7 text-amber-300" />
                  </div>
                  <h4 className="font-bold text-green-900 mb-1 text-lg">{item.title}</h4>
                  <p className="text-sm text-green-700/70">{item.detail}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-green-950 text-green-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-green-900/40 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl overflow-hidden shadow-md ring-1 ring-green-700/50">
                  <Image
                    src="/images/ocf-logo.png"
                    alt="OCF-SPIN"
                    width={44}
                    height={44}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xl font-extrabold text-white">OCF-SPIN</span>
              </div>
              <p className="text-green-400/50 text-sm leading-relaxed max-w-sm mb-6">
                Bhavishyath Bharat Is Organic Carbon Farming.
                Do Smart Farming for Guarantee Profits. Nature is ultimate.
              </p>
              <div className="flex items-center gap-2 text-xs text-green-500/70">
                <ShieldCheck className="w-4 h-4" />
                SPIN: Seed • Pests &amp; Insects • Infections • Nutrients
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
              <div className="space-y-3 text-sm">
                {[
                  { href: "/login", label: "Get Started" },
                  { href: "/login", label: "Farmer Login" },
                  { href: "/login", label: "Admin Dashboard" },
                  { href: "#about", label: "About OCF", isAnchor: true },
                  { href: "#spin", label: "SPIN Framework", isAnchor: true },
                  { href: "#contact", label: "Contact Us", isAnchor: true },
                ].map(link => (
                  <div key={link.label}>
                    {link.isAnchor ? (
                      <a href={link.href} className="hover:text-white transition-colors flex items-center gap-1.5 group">
                        <ChevronRight className="w-3.5 h-3.5 text-green-600 group-hover:text-amber-400 transition-colors" />
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="hover:text-white transition-colors flex items-center gap-1.5 group">
                        <ChevronRight className="w-3.5 h-3.5 text-green-600 group-hover:text-amber-400 transition-colors" />
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">SPIN Framework</h4>
              <div className="text-sm space-y-3 text-green-400/50">
                {[
                  { letter: "S", desc: "Seed (Food, Life, Nutrition, Seed)", color: "text-green-400" },
                  { letter: "P", desc: "Pests and Insects", color: "text-amber-400" },
                  { letter: "I", desc: "Infections", color: "text-red-400" },
                  { letter: "N", desc: "Nutrients", color: "text-teal-400" },
                ].map(item => (
                  <p key={item.letter} className="flex items-center gap-2">
                    <span className={`${item.color} font-extrabold text-lg w-6`}>{item.letter}</span>
                    <span className="text-green-500/50">:</span>
                    {item.desc}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-green-800/30 mt-14 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-green-500/50">
            <p>&copy; {new Date().getFullYear()} OCF-SPIN. Organic Carbon Farming. All rights reserved.</p>
            <p className="font-semibold text-green-400/60">Bhavishyath Bharat</p>
          </div>
        </div>
      </footer>
    </div>
  );
}