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
  ArrowRight,
  Sparkles,
  ShieldCheck,
  BrainCircuit,
  TrendingUp,
  Clock,
  CheckCircle2,
  Database,
  ArrowUpRight,
  Users,
  Compass,
  ArrowRightCircle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useProfile } from "@/contexts/ProfileContext"

// Banners for the carousel (light mode glass style colors)
const banners = [
  {
    title: "AI-Powered Skin Analysis",
    description: "Get instant, accurate analysis of skin conditions using our advanced machine learning algorithms.",
    color: "from-blue-50 to-indigo-100/60 border-blue-100",
    textColor: "text-slate-900",
    descColor: "text-slate-600",
    tagColor: "bg-blue-100/70 text-blue-700 border-blue-200/50",
    image: "https://firebasestorage.googleapis.com/v0/b/core-prd-frontend-images/o/skin-consultant%2F3302%2Fbranding%2F5b6072a9-7272-48b9-b4ea-e9ed2c539908.jpg?alt=media&token=6124daec-37bb-4316-8f5f-537874c2a315",
  },
  {
    title: "Connect with Expert Dermatologists",
    description: "Schedule consultations with qualified specialists for personalized care and treatment.",
    color: "from-purple-50 to-fuchsia-100/60 border-purple-100",
    textColor: "text-slate-900",
    descColor: "text-slate-600",
    tagColor: "bg-purple-100/70 text-purple-700 border-purple-200/50",
    image: "https://buddycoins-rewards.medibuddy.in/rewards/Gold-Banner.png",
  },
  {
    title: "Track Your Skin Health Journey",
    description: "Monitor your progress, manage appointments, and access your complete medical history.",
    color: "from-teal-50 to-emerald-100/60 border-teal-100",
    textColor: "text-slate-900",
    descColor: "text-slate-600",
    tagColor: "bg-teal-100/70 text-teal-700 border-teal-200/50",
    image: "https://imgs.search.brave.com/feKEI3pECVcNjrdeUF461HEasknCKgowyC5agCoczjI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cHJvZC53ZWJzaXRl/LWZpbGVzLmNvbS81/ZTliNTY3ODliYTU5/OWU2NzlmZTAyYWMv/NjI1NDMzNTM1NzMz/YzE1NWVlOTNhOTA4/X21vY2t1cC1vZi1h/LW1hbi11c2luZy1o/aXMtaXBob25lLTEx/LXByby1pbi1mcm9u/dC1vZi1oaXMtb2Zm/aWNlLWRlc2stMjE1/MS1lbDEtMy5wbmc",
  },
  {
    title: "Comprehensive Medical Shop",
    description: "Access recommended skincare products and medical supplies from trusted providers.",
    color: "from-pink-50 to-rose-100/60 border-pink-100",
    textColor: "text-slate-900",
    descColor: "text-slate-600",
    tagColor: "bg-pink-100/70 text-pink-700 border-pink-200/50",
    image: "https://antdisplay.com/pub/media/magefan_blog/QZ__NFP_T0_J_RFTDRB1_W2.png",
  },
]

// Ultra-modern feature cards data
const features = [
  {
    title: "Skin Condition Analysis",
    description: "Upload skin images for instant AI classification & diagnostics",
    icon: Microscope,
    href: "/dashboard/analysis",
    themeClass: "hover:shadow-blue-500/10 hover:border-blue-300/60",
    iconWrapperClass: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/20",
    badgeText: "AI Neural Engine",
    pulseColor: "bg-blue-500"
  },
  {
    title: "Dermatologist Appointments",
    description: "Schedule consultations with verified clinical skin cancer specialists",
    icon: Calendar,
    href: "/dashboard/appointments",
    themeClass: "hover:shadow-emerald-500/10 hover:border-emerald-300/60",
    iconWrapperClass: "bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-emerald-500/20",
    badgeText: "Direct Consultation",
    pulseColor: "bg-emerald-500"
  },
  {
    title: "My Skin Tickets",
    description: "Track diagnostic updates, inquiries, and doctor support history",
    icon: Ticket,
    href: "/dashboard/skin-tickets",
    themeClass: "hover:shadow-indigo-500/10 hover:border-indigo-300/60",
    iconWrapperClass: "bg-gradient-to-br from-indigo-400 to-violet-600 text-white shadow-indigo-500/20",
    badgeText: "Active Tickets",
    pulseColor: "bg-indigo-500"
  },
  {
    title: "Medical Shop",
    description: "Secure recommended skincare remedies and medical grade supplies",
    icon: ShoppingBag,
    href: "/dashboard/shop",
    themeClass: "hover:shadow-rose-500/10 hover:border-rose-300/60",
    iconWrapperClass: "bg-gradient-to-br from-rose-400 to-pink-600 text-white shadow-rose-500/20",
    badgeText: "Verified Pharmacy",
    pulseColor: "bg-rose-500"
  },
  {
    title: "Profile & History",
    description: "Update personal parameters, biometric telemetry, and preferences",
    icon: User,
    href: "/dashboard/profile",
    themeClass: "hover:shadow-slate-500/10 hover:border-slate-300/60",
    iconWrapperClass: "bg-gradient-to-br from-slate-400 to-slate-600 text-white shadow-slate-500/20",
    badgeText: "Secure Profile",
    pulseColor: "bg-slate-500"
  },
]

// Mapping country name to Timezone strings
function getTimezoneByCountry(country: string): string {
  const c = (country || "").trim().toLowerCase()
  if (c.includes("india")) return "Asia/Kolkata"
  if (c.includes("usa") || c.includes("united states") || c.includes("america")) return "America/New_York"
  if (c.includes("uk") || c.includes("united kingdom") || c.includes("london")) return "Europe/London"
  if (c.includes("germany")) return "Europe/Berlin"
  if (c.includes("france")) return "Europe/Paris"
  if (c.includes("australia") || c.includes("sydney")) return "Australia/Sydney"
  if (c.includes("singapore")) return "Asia/Singapore"
  if (c.includes("japan") || c.includes("tokyo")) return "Asia/Tokyo"
  if (c.includes("canada") || c.includes("toronto")) return "America/Toronto"
  if (c.includes("uae") || c.includes("dubai")) return "Asia/Dubai"
  return "" // default to local client time
}

export default function DashboardPage() {
  const [currentBanner, setCurrentBanner] = useState(0)
  const [timeString, setTimeString] = useState("")
  const [dateString, setDateString] = useState("")
  const { profile } = useProfile()

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length)
  }

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)
  }

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(nextBanner, 6000)
    return () => clearInterval(timer)
  }, [])

  // Real-time ticking clock aligned with user's country timezone
  useEffect(() => {
    const tz = getTimezoneByCountry(profile?.country || "")
    
    const formatTime = () => {
      const now = new Date()
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        ...(tz ? { timeZone: tz } : {})
      }
      const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        ...(tz ? { timeZone: tz } : {})
      }

      try {
        setTimeString(now.toLocaleTimeString('en-US', timeOptions))
        setDateString(now.toLocaleDateString('en-US', dateOptions))
      } catch {
        setTimeString(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }))
        setDateString(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }))
      }
    }

    formatTime()
    const timer = setInterval(formatTime, 1000)
    return () => clearInterval(timer)
  }, [profile?.country])

  const firstName = profile?.fullName?.split(' ')[0] || ""
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening"

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-8 max-w-7xl mx-auto pb-12"
    >
      {/* Light-Mode Glassmorphic Welcome Panel */}
      <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl p-8 sm:p-10 text-slate-800 dark:text-slate-100 shadow-[0_8px_32px_0_rgba(31,38,135,0.06)]">
        {/* Soft pastel blur nodes inside card background */}
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-indigo-200/40 dark:bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-teal-100/30 dark:bg-teal-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/5 border border-indigo-100/50 backdrop-blur-md text-xs font-bold tracking-wide text-indigo-700 dark:text-indigo-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Clinical System Connected
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              {greeting}{firstName ? `, ${firstName}` : "!"}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl font-medium leading-relaxed">
              Your secure client panel is synced. Track analysis history, schedule appointments with specialist dermatologists, and shop verified prescriptions.
            </p>
          </div>

          {/* Time & Timezone Widget */}
          {timeString && (
            <div className="flex items-center gap-3 bg-white/95 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-4 md:self-center shadow-md">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 border border-indigo-500/20">
                <Clock className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold uppercase tracking-widest flex items-center gap-1">
                  <Compass className="h-3 w-3 animate-spin-slow" />
                  {profile?.country ? `${profile.country} Time` : "Local Time"}
                </p>
                <p className="text-base font-black text-slate-900 dark:text-slate-100 leading-tight">{timeString}</p>
                <p className="text-[10px] text-slate-400 font-semibold">{dateString}</p>
              </div>
            </div>
          )}
        </div>

        {/* Telemetry Indicator Ribbon */}
        <div className="mt-8 pt-6 border-t border-slate-200/40 dark:border-slate-800/40 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-indigo-500" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Analyzer: <span className="text-indigo-600 dark:text-indigo-400">v4.2.1 Live</span></span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">HIPAA standard: <span className="text-emerald-600">Active</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Pipeline: <span className="text-blue-600 dark:text-blue-400">MongoDB Secure</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-rose-500" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Telemetry: <span className="text-rose-600 dark:text-rose-400">Nominal</span></span>
          </div>
        </div>
      </div>

      {/* Feature Banner Carousel (Glassmorphic Light Mode style) */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md shadow-lg">
        <div className="relative h-[420px] md:h-[300px] w-full">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                currentBanner === index ? "opacity-100 translate-x-0 z-10" : "opacity-0 translate-x-8 z-0 pointer-events-none"
              }`}
            >
              <div className={`h-full w-full bg-gradient-to-r ${banner.color} border-b p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center gap-8`}>
                {/* Left Section - Text */}
                <div className="w-full md:w-1/2 space-y-4 text-left">
                  <span className={`inline-flex items-center gap-1 text-[9px] uppercase font-extrabold tracking-widest px-2.5 py-1 rounded-full border ${banner.tagColor}`}>
                    Medical Suite
                  </span>
                  <h2 className={`text-3xl sm:text-4xl font-black tracking-tight leading-none ${banner.textColor}`}>{banner.title}</h2>
                  <p className={`text-sm sm:text-base leading-relaxed ${banner.descColor}`}>
                    {banner.description}
                  </p>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="font-bold border-slate-300 hover:border-slate-400 text-slate-800 dark:text-white bg-white/80 rounded-xl transition-all shadow-sm group">
                      Learn More 
                      <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Button>
                  </div>
                </div>

                {/* Right Section - Image with glass borders */}
                <div className="w-full md:w-1/2 h-[180px] md:h-[220px] relative overflow-hidden rounded-2xl shadow-xl border border-white/60 dark:border-slate-700/60 bg-white">
                  <img
                    src={banner.image || "/placeholder.svg"}
                    alt={banner.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="absolute right-4 bottom-4 flex gap-2 z-20">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/80 hover:bg-white border border-slate-200/80 shadow-sm rounded-full h-9 w-9"
            onClick={prevBanner}
          >
            <ChevronLeft className="h-5 w-5 text-slate-700" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/80 hover:bg-white border border-slate-200/80 shadow-sm rounded-full h-9 w-9"
            onClick={nextBanner}
          >
            <ChevronRight className="h-5 w-5 text-slate-700" />
          </Button>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-6 left-6 flex gap-1.5 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                currentBanner === index ? "w-6 bg-indigo-600" : "w-1.5 bg-slate-300"
              }`}
              onClick={() => setCurrentBanner(index)}
            />
          ))}
        </div>
      </div>

      {/* Grid Header */}
      <div className="space-y-1 text-left">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="h-5 w-5 text-indigo-600" />
          Application Console
        </h2>
        <p className="text-sm text-slate-500 font-semibold">Select and open a diagnostic or management module from the list below.</p>
      </div>

      {/* Futuristic Launcher Grid (Application Boxes) */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Link key={feature.title} href={feature.href} className="group">
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              className={`relative h-full overflow-hidden border border-slate-200/60 dark:border-slate-800 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl p-6 rounded-3xl flex flex-col justify-between transition-all duration-300 ${feature.themeClass} shadow-[0_4px_16px_rgba(0,0,0,0.02)]`}
            >
              {/* Highlight gradient glow spot inside card */}
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-bl-full pointer-events-none group-hover:from-indigo-500/10 transition-all duration-300" />
              
              {/* Pulse status indicator at top-left of each box */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400/80 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  {feature.badgeText}
                </span>
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${feature.pulseColor}`} />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${feature.pulseColor}`} />
                </span>
              </div>

              <div className="space-y-5 text-left">
                {/* 3D Gradient Icon Wrapper */}
                <div className={`w-12 h-12 rounded-2xl ${feature.iconWrapperClass} flex items-center justify-center transition-all duration-300 group-hover:rotate-6 shadow-md border border-white/20`}>
                  <feature.icon className="h-5.5 w-5.5 text-white" />
                </div>
                
                <div className="space-y-1.5">
                  <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400 font-semibold">
                    {feature.description}
                  </p>
                </div>
              </div>

              <div className="w-full flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 border-t border-slate-100 dark:border-slate-800/60 pt-4 mt-6">
                <span>Start Module</span>
                <ArrowRightCircle className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-105" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Additional Features Section (Light Mode glass design) */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-slate-200/60 dark:border-slate-850 rounded-3xl shadow-sm overflow-hidden bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/10">
            <CardTitle className="flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white text-left">
              <CheckCircle2 className="h-5 w-5 text-indigo-600" />
              Suite Architecture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6 text-left">
            <div className="flex gap-4">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-500/10">
                <Microscope className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-slate-950 dark:text-white text-sm">Advanced AI Diagnostics</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                  State-of-the-art computer vision models trained specifically to identify potential dermatological conditions.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-500/10">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-slate-950 dark:text-white text-sm">Doctor Consultation Network</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                  Direct digital appointment bookings with certified, board-registered dermatologists.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-500/10">
                <Users className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-slate-950 dark:text-white text-sm">HIPAA Secure Records</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                  Your biometric telemetry, scans, support logs, and pharmacy receipts are secured using end-to-end encryption.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/60 dark:border-slate-850 rounded-3xl shadow-sm overflow-hidden bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/10">
            <CardTitle className="flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white text-left">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              System Updates & News
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6 text-left">
            <div className="rounded-2xl border border-slate-200/40 dark:border-slate-800 p-4 hover:bg-slate-100/40 dark:hover:bg-slate-900/20 transition-all">
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                <p className="font-bold text-slate-950 dark:text-white text-sm">New Diagnostic Model Live</p>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed pl-4">
                Our latest neural network model achieves a higher precision rate across major skin classifications.
              </p>
            </div>
            
            <div className="rounded-2xl border border-slate-200/40 dark:border-slate-800 p-4 hover:bg-slate-100/40 dark:hover:bg-slate-900/20 transition-all">
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <p className="font-bold text-slate-950 dark:text-white text-sm">Expanded Doctor Network</p>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed pl-4">
                We have partnered with 10+ new specialized dermatologists across multiple Indian metropolitan areas.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/40 dark:border-slate-800 p-4 hover:bg-slate-100/40 dark:hover:bg-slate-900/20 transition-all">
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <p className="font-bold text-slate-950 dark:text-white text-sm">Enhanced Telemedicine Platform</p>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed pl-4">
                Consultation connections are now backed by ultra-low latency WebRTC, improving video and audio quality.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
