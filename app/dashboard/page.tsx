"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Activity,
  Calendar,
  ShoppingBag,
  User,
  Microscope,
  ChevronLeft,
  ChevronRight,
  Ticket,
  ShieldCheck,
  BrainCircuit,
  TrendingUp,
  CheckCircle2,
  Database,
  ArrowUpRight,
  Users,
  ArrowRightCircle,
  Sparkles,
  Zap,
  Star,
  Heart
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useProfile } from "@/contexts/ProfileContext"

// Banners — reliable Unsplash images, vibrant gradient overlays
const banners = [
  {
    title: "AI-Powered Skin Analysis",
    description: "Upload a photo and get instant AI-powered skin condition detection — accurate, fast, and clinical-grade.",
    gradient: "from-blue-600/95 via-indigo-600/90 to-violet-700/95",
    accentColor: "text-blue-200",
    tagBg: "bg-blue-400/20 border-blue-300/30 text-blue-100",
    href: "/dashboard/analysis",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80&auto=format&fit=crop",
    cta: "Run Analysis"
  },
  {
    title: "Connect with Expert Dermatologists",
    description: "Schedule consultations with qualified, board-certified specialists and get personalized treatment plans.",
    gradient: "from-emerald-600/95 via-teal-600/90 to-cyan-700/95",
    accentColor: "text-emerald-200",
    tagBg: "bg-emerald-400/20 border-emerald-300/30 text-emerald-100",
    href: "/dashboard/appointments",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80&auto=format&fit=crop",
    cta: "Book Now"
  },
  {
    title: "Track Your Skin Health Journey",
    description: "Review your analysis history, manage active support tickets, and monitor your progress over time.",
    gradient: "from-violet-600/95 via-purple-600/90 to-fuchsia-700/95",
    accentColor: "text-violet-200",
    tagBg: "bg-violet-400/20 border-violet-300/30 text-violet-100",
    href: "/dashboard/skin-tickets",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80&auto=format&fit=crop",
    cta: "View Tickets"
  },
  {
    title: "Comprehensive Medical Shop",
    description: "Access dermatologist-recommended skincare products, serums, and medical grade supplies — delivered fast.",
    gradient: "from-rose-600/95 via-pink-600/90 to-orange-600/95",
    accentColor: "text-rose-200",
    tagBg: "bg-rose-400/20 border-rose-300/30 text-rose-100",
    href: "/dashboard/shop",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80&auto=format&fit=crop",
    cta: "Shop Now"
  },
]

// Vivid, colorful glass feature cards
const features = [
  {
    title: "Skin Condition Analysis",
    description: "Upload images for AI-powered classification, diagnostics, and severity detection.",
    icon: Microscope,
    href: "/dashboard/analysis",
    cardGradient: "from-blue-500/10 via-indigo-500/5 to-blue-400/10",
    borderColor: "border-blue-200/60 hover:border-blue-400/60",
    iconGradient: "from-blue-500 to-indigo-600",
    shadowColor: "hover:shadow-blue-500/15",
    glowColor: "bg-blue-400/10",
    badgeText: "AI Neural Engine",
    badgeBg: "bg-blue-50 text-blue-700 border-blue-100",
    pulseColor: "bg-blue-500",
    textAccent: "group-hover:text-blue-600",
  },
  {
    title: "Dermatologist Appointments",
    description: "Book direct consultations with verified, board-certified skin cancer specialists.",
    icon: Calendar,
    href: "/dashboard/appointments",
    cardGradient: "from-emerald-500/10 via-teal-500/5 to-emerald-400/10",
    borderColor: "border-emerald-200/60 hover:border-emerald-400/60",
    iconGradient: "from-emerald-400 to-teal-600",
    shadowColor: "hover:shadow-emerald-500/15",
    glowColor: "bg-emerald-400/10",
    badgeText: "Book Specialist",
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-100",
    pulseColor: "bg-emerald-500",
    textAccent: "group-hover:text-emerald-600",
  },
  {
    title: "My Skin Tickets",
    description: "Track diagnostic inquiries, support threads, and doctor response history.",
    icon: Ticket,
    href: "/dashboard/skin-tickets",
    cardGradient: "from-violet-500/10 via-indigo-500/5 to-violet-400/10",
    borderColor: "border-violet-200/60 hover:border-violet-400/60",
    iconGradient: "from-violet-500 to-indigo-600",
    shadowColor: "hover:shadow-violet-500/15",
    glowColor: "bg-violet-400/10",
    badgeText: "Active Tickets",
    badgeBg: "bg-violet-50 text-violet-700 border-violet-100",
    pulseColor: "bg-violet-500",
    textAccent: "group-hover:text-violet-600",
  },
  {
    title: "Medical Shop",
    description: "Purchase dermatologist-recommended skincare products and medical grade supplies.",
    icon: ShoppingBag,
    href: "/dashboard/shop",
    cardGradient: "from-rose-500/10 via-pink-500/5 to-rose-400/10",
    borderColor: "border-rose-200/60 hover:border-rose-400/60",
    iconGradient: "from-rose-500 to-pink-600",
    shadowColor: "hover:shadow-rose-500/15",
    glowColor: "bg-rose-400/10",
    badgeText: "Verified Pharmacy",
    badgeBg: "bg-rose-50 text-rose-700 border-rose-100",
    pulseColor: "bg-rose-500",
    textAccent: "group-hover:text-rose-600",
  },
  {
    title: "Profile & History",
    description: "Manage biometric data, medical history, timezone, and account preferences.",
    icon: User,
    href: "/dashboard/profile",
    cardGradient: "from-amber-500/10 via-orange-500/5 to-amber-400/10",
    borderColor: "border-amber-200/60 hover:border-amber-400/60",
    iconGradient: "from-amber-500 to-orange-500",
    shadowColor: "hover:shadow-amber-500/15",
    glowColor: "bg-amber-400/10",
    badgeText: "Secure Profile",
    badgeBg: "bg-amber-50 text-amber-700 border-amber-100",
    pulseColor: "bg-amber-500",
    textAccent: "group-hover:text-amber-600",
  },
]

// Telemetry ribbon items
const telemetryItems = [
  { icon: BrainCircuit, label: "AI Analyzer", value: "v4.2.1 Live", color: "text-indigo-600", dotColor: "bg-indigo-500" },
  { icon: ShieldCheck, label: "HIPAA Standard", value: "Compliant", color: "text-emerald-600", dotColor: "bg-emerald-500" },
  { icon: Database, label: "Database", value: "Encrypted", color: "text-blue-600", dotColor: "bg-blue-500" },
  { icon: Activity, label: "System Status", value: "Nominal", color: "text-rose-600", dotColor: "bg-rose-500" },
]

export default function DashboardPage() {
  const [currentBanner, setCurrentBanner] = useState(0)
  const { profile } = useProfile()

  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % banners.length)
  const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)

  useEffect(() => {
    const timer = setInterval(nextBanner, 6000)
    return () => clearInterval(timer)
  }, [])

  const firstName = profile?.fullName?.split(' ')[0] || ""
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening"

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  } as const
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-7 max-w-7xl mx-auto pb-12"
    >

      {/* ═══════════════════════════════════════
          WELCOME BANNER — Rich Indigo Gradient
      ═══════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-teal-500 p-8 sm:p-10 text-white shadow-[0_16px_48px_rgba(79,70,229,0.25)]">

        {/* Animated glow blobs */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -left-8 -bottom-8 w-48 h-48 rounded-full bg-teal-300/20 blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-24 bg-white/5 blur-3xl pointer-events-none rounded-full" />

        {/* Subtle mesh grid */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-xs font-bold tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              DermaAI Clinical Suite — Active
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none">
              {greeting}{firstName ? `, ${firstName}` : "!"}
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-xl font-medium leading-relaxed">
              Your skin health dashboard is ready. Run a new AI analysis, connect with a specialist, or check your latest results.
            </p>
            <div className="flex gap-3 pt-1">
              <Link href="/dashboard/analysis">
                <Button size="sm" className="bg-white text-indigo-700 font-bold hover:bg-indigo-50 rounded-xl shadow-md shadow-black/10 transition-all hover:scale-105">
                  <Zap className="h-4 w-4 mr-1.5" /> Start Analysis
                </Button>
              </Link>
              <Link href="/dashboard/appointments">
                <Button size="sm" variant="ghost" className="text-white border border-white/30 hover:bg-white/10 rounded-xl font-semibold">
                  Book Doctor
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats cluster */}
          <div className="grid grid-cols-2 gap-3 md:shrink-0">
            {[
              { icon: Sparkles, label: "AI Analyses", value: "Real-Time", color: "bg-blue-400/20" },
              { icon: Star, label: "Specialists", value: "10+ Active", color: "bg-teal-400/20" },
              { icon: Heart, label: "Health Score", value: "Monitored", color: "bg-pink-400/20" },
              { icon: ShieldCheck, label: "Security", value: "HIPAA", color: "bg-emerald-400/20" },
            ].map((stat) => (
              <div key={stat.label} className={`flex items-center gap-2.5 ${stat.color} border border-white/10 rounded-2xl p-3 backdrop-blur-sm`}>
                <stat.icon className="h-4 w-4 text-white/90 shrink-0" />
                <div>
                  <p className="text-[9px] text-white/60 font-bold uppercase tracking-wider">{stat.label}</p>
                  <p className="text-xs font-black text-white">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Telemetry Ribbon */}
        <div className="relative z-10 mt-7 pt-5 border-t border-white/15 flex flex-wrap gap-x-6 gap-y-2">
          {telemetryItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${item.dotColor} animate-pulse`} />
              <item.icon className="h-3.5 w-3.5 text-white/70" />
              <span className="text-xs font-semibold text-white/70">
                {item.label}: <span className="text-white font-bold">{item.value}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          FEATURE BANNER CAROUSEL
      ═══════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 shadow-xl bg-white/40 backdrop-blur-sm">
        <div className="relative h-[360px] md:h-[280px] w-full">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                currentBanner === index ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <div className={`h-full w-full bg-gradient-to-r ${banner.gradient} flex flex-col md:flex-row items-center gap-6 p-6 sm:p-8 md:p-10`}>
                {/* Left: Text */}
                <div className="w-full md:w-1/2 text-white space-y-3">
                  <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase font-extrabold tracking-widest px-2.5 py-1 rounded-full border backdrop-blur-sm ${banner.tagBg}`}>
                    <Sparkles className="h-3 w-3" /> Clinical Suite
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">{banner.title}</h2>
                  <p className={`text-sm leading-relaxed ${banner.accentColor}`}>{banner.description}</p>
                  <Link href={banner.href}>
                    <Button variant="secondary" size="sm"
                      className="mt-1 font-bold bg-white/95 text-slate-900 hover:bg-white rounded-xl shadow-md transition-all hover:scale-105 group"
                    >
                      {banner.cta} <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Button>
                  </Link>
                </div>
                {/* Right: Image */}
                <div className="w-full md:w-1/2 h-[160px] md:h-[200px] overflow-hidden rounded-2xl border border-white/20 shadow-2xl">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 pointer-events-none rounded-2xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <div className="absolute right-4 bottom-4 flex gap-2 z-20">
          {[prevBanner, nextBanner].map((fn, i) => (
            <button key={i} onClick={fn}
              className="h-8 w-8 rounded-full bg-white/80 hover:bg-white border border-white/60 shadow flex items-center justify-center transition-all hover:scale-110"
            >
              {i === 0 ? <ChevronLeft className="h-4 w-4 text-slate-700" /> : <ChevronRight className="h-4 w-4 text-slate-700" />}
            </button>
          ))}
        </div>

        {/* Slide Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {banners.map((_, i) => (
            <button key={i} onClick={() => setCurrentBanner(i)} aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentBanner ? "w-6 bg-white" : "w-1.5 bg-white/40"}`}
            />
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          APPLICATION CONSOLE — Glass Cards
      ═══════════════════════════════════════ */}
      <div>
        <div className="mb-5">
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-500" />
            Application Console
          </h2>
          <p className="text-sm text-slate-500 font-semibold mt-0.5">Select a clinical module to open.</p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Link href={feature.href} className="group block h-full">
                <div className={`
                  relative h-full overflow-hidden rounded-3xl border bg-gradient-to-br ${feature.cardGradient}
                  ${feature.borderColor} ${feature.shadowColor}
                  bg-white/80 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)]
                  hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)] hover:-translate-y-1.5
                  transition-all duration-300 ease-out p-6 flex flex-col justify-between
                `}>
                  {/* Top-right shimmer glow */}
                  <div className={`absolute -top-8 -right-8 w-32 h-32 ${feature.glowColor} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

                  {/* Badge + Pulse */}
                  <div className="flex items-center justify-between mb-5">
                    {/* 3D Icon */}
                    <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${feature.iconGradient} flex items-center justify-center shadow-lg border border-white/40 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                      style={{ width: 52, height: 52 }}>
                      <feature.icon className="h-6 w-6 text-white drop-shadow" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border ${feature.badgeBg}`}>
                        {feature.badgeText}
                      </span>
                      <span className="relative flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${feature.pulseColor} opacity-60`} />
                        <span className={`relative inline-flex h-2 w-2 rounded-full ${feature.pulseColor}`} />
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <h3 className={`text-base font-black tracking-tight text-slate-900 dark:text-slate-100 transition-colors ${feature.textAccent}`}>
                      {feature.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 font-semibold">
                      {feature.description}
                    </p>
                  </div>

                  {/* Bottom CTA */}
                  <div className="mt-5 pt-4 border-t border-slate-100/60 dark:border-slate-800/60 flex items-center justify-between">
                    <span className={`text-xs font-bold transition-colors ${feature.textAccent} text-slate-600`}>Open Module</span>
                    <ArrowRightCircle className={`h-5 w-5 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110 ${feature.textAccent} text-slate-400`} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════
          BOTTOM INFO GRID — Mirror Glass Cards
      ═══════════════════════════════════════ */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* Why DermaAI */}
        <Card className="border border-slate-200/60 rounded-3xl shadow-md overflow-hidden bg-white/80 backdrop-blur-xl">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-indigo-50/60 to-blue-50/40">
            <CardTitle className="flex items-center gap-2.5 text-base font-black text-slate-900">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
              Why Choose DermaAI?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
            {[
              { icon: Microscope, color: "from-blue-500 to-indigo-600", shadow: "shadow-blue-500/20", title: "Advanced AI Diagnostics", desc: "State-of-the-art computer vision models trained to identify 30+ dermatological conditions within seconds." },
              { icon: BrainCircuit, color: "from-emerald-400 to-teal-600", shadow: "shadow-emerald-500/20", title: "Qualified Dermatologist Network", desc: "Direct digital appointments with licensed specialists for personalized treatment plans." },
              { icon: Users, color: "from-violet-500 to-indigo-600", shadow: "shadow-violet-500/20", title: "HIPAA-Secure Medical Records", desc: "All diagnostics, tickets, and receipts are encrypted and stored securely in MongoDB." },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 group">
                <div className={`h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md ${item.shadow} transition-transform duration-300 group-hover:scale-105`}>
                  <item.icon className="h-4.5 w-4.5 text-white" style={{ width: 18, height: 18 }} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{item.title}</h4>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System Updates */}
        <Card className="border border-slate-200/60 rounded-3xl shadow-md overflow-hidden bg-white/80 backdrop-blur-xl">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-indigo-50/60 to-blue-50/40">
            <CardTitle className="flex items-center gap-2.5 text-base font-black text-slate-900">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-md shadow-rose-500/20">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              System Updates & News
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-5">
            {[
              { dot: "bg-indigo-500", tag: "Model Update", tagBg: "bg-indigo-50 text-indigo-700 border-indigo-100", title: "New Diagnostic Model Live", desc: "Our latest neural network achieves a higher precision rate across major skin classifications." },
              { dot: "bg-emerald-500", tag: "Network Expansion", tagBg: "bg-emerald-50 text-emerald-700 border-emerald-100", title: "Expanded Doctor Network", desc: "10+ new specialized dermatologists across Indian metropolitan areas have joined the platform." },
              { dot: "bg-blue-500", tag: "Infrastructure", tagBg: "bg-blue-50 text-blue-700 border-blue-100", title: "Enhanced Telemedicine", desc: "Video consultations now use ultra-low latency WebRTC with improved audio and video quality." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 p-4 transition-all duration-200 group cursor-default">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`h-2 w-2 rounded-full ${item.dot} shrink-0`} />
                  <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border ${item.tagBg}`}>{item.tag}</span>
                </div>
                <p className="font-bold text-slate-900 text-sm pl-4 leading-snug">{item.title}</p>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-0.5 pl-4">{item.desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </motion.div>
  )
}
