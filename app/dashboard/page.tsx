"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
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
  AlertCircle,
  HelpCircle,
  Database,
  ArrowUpRight,
  Users
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useProfile } from "@/contexts/ProfileContext"

// Banner data for the carousel
const banners = [
  {
    title: "AI-Powered Skin Analysis",
    description: "Get instant, accurate analysis of skin conditions using our advanced machine learning algorithms",
    color: "from-blue-600/90 via-indigo-600/90 to-blue-700/90",
    image: "https://firebasestorage.googleapis.com/v0/b/core-prd-frontend-images/o/skin-consultant%2F3302%2Fbranding%2F5b6072a9-7272-48b9-b4ea-e9ed2c539908.jpg?alt=media&token=6124daec-37bb-4316-8f5f-537874c2a315",
  },
  {
    title: "Connect with Expert Dermatologists",
    description: "Schedule consultations with qualified specialists for personalized care and treatment",
    color: "from-purple-600/90 via-fuchsia-600/90 to-purple-700/90",
    image: "https://buddycoins-rewards.medibuddy.in/rewards/Gold-Banner.png",
  },
  {
    title: "Track Your Skin Health Journey",
    description: "Monitor your progress, manage appointments, and access your complete medical history",
    color: "from-teal-600/90 via-emerald-600/90 to-teal-700/90",
    image: "https://imgs.search.brave.com/feKEI3pECVcNjrdeUF461HEasknCKgowyC5agCoczjI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cHJvZC53ZWJzaXRl/LWZpbGVzLmNvbS81/ZTliNTY3ODliYTU5/OWU2NzlmZTAyYWMv/NjI1NDMzNTM1NzMz/YzE1NWVlOTNhOTA4/X21vY2t1cC1vZi1h/LW1hbi11c2luZy1o/aXMtaXBob25lLTEx/LXByby1pbi1mcm9u/dC1vZi1oaXMtb2Zm/aWNlLWRlc2stMjE1/MS1lbDEtMy5wbmc",
  },
  {
    title: "Comprehensive Medical Shop",
    description: "Access recommended skincare products and medical supplies from trusted providers",
    color: "from-pink-600/90 via-rose-600/90 to-pink-700/90",
    image: "https://antdisplay.com/pub/media/magefan_blog/QZ__NFP_T0_J_RFTDRB1_W2.png",
  },
]

// Feature cards data
const features = [
  {
    title: "Skin Condition Analysis",
    description: "Upload images for AI-powered Skin Disease detection",
    icon: Microscope,
    href: "/dashboard/analysis",
    color: "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
    iconColor: "text-blue-600 dark:text-blue-400",
    badge: "AI Powered"
  },
  {
    title: "Dermatologist Appointments",
    description: "Schedule consultations with skin cancer specialists",
    icon: Calendar,
    href: "/dashboard/appointments",
    color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    badge: "Specialist Care"
  },
  {
    title: "My Skin Tickets",
    description: "View and manage your active support tickets",
    icon: Ticket,
    href: "/dashboard/skin-tickets",
    color: "bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    badge: "Support History"
  },
  {
    title: "Medical Shop",
    description: "Purchase recommended medical supplies and products",
    icon: ShoppingBag,
    href: "/dashboard/shop",
    color: "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400",
    iconColor: "text-rose-600 dark:text-rose-400",
    badge: "Skincare Store"
  },
  {
    title: "Profile & Settings",
    description: "Manage your account and preferences",
    icon: User,
    href: "/dashboard/profile",
    color: "bg-slate-500/10 border-slate-500/20 text-slate-600 dark:text-slate-400",
    iconColor: "text-slate-600 dark:text-slate-400",
    badge: "Preferences"
  },
]

export default function DashboardPage() {
  const [currentBanner, setCurrentBanner] = useState(0)
  const [currentDate, setCurrentDate] = useState("")

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length)
  }

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)
  }

  // Auto-advance banner every 6 seconds
  useEffect(() => {
    const timer = setInterval(nextBanner, 6000)
    return () => clearInterval(timer)
  }, [])

  // Safely get date client-side
  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }
    setCurrentDate(new Date().toLocaleDateString('en-US', options))
  }, [])

  const { profile } = useProfile()
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
      {/* Dynamic Header / Welcome Panel */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 p-8 sm:p-10 text-white shadow-2xl">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />
        
        {/* Abstract background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-semibold tracking-wide text-indigo-300 shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Clinical Intelligence Tunnel Active
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              {greeting}{firstName ? `, ${firstName}` : "!"}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-medium leading-relaxed">
              Your personalized clinical dashboard is online. Check conditions, book specialized dermatologists, and view analysis results in real-time.
            </p>
          </div>

          {/* Date Widget */}
          {currentDate && (
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-4 md:self-center shadow-lg">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-300 border border-indigo-500/20">
                <Clock className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <p className="text-xs text-indigo-300 font-bold uppercase tracking-wider">Current Session</p>
                <p className="text-sm font-semibold text-slate-100">{currentDate}</p>
              </div>
            </div>
          )}
        </div>

        {/* Telemetry Indicator Ribbon */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-2.5">
            <BrainCircuit className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-300">AI Analyzer: <span className="text-indigo-300">Online v4.2.1</span></span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-300">HIPAA Standard: <span className="text-emerald-400">Compliant</span></span>
          </div>
          <div className="flex items-center gap-2.5">
            <Database className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-semibold text-slate-300">Storage: <span className="text-blue-400">Encrypted</span></span>
          </div>
          <div className="flex items-center gap-2.5">
            <Activity className="h-4 w-4 text-rose-400" />
            <span className="text-xs font-semibold text-slate-300">Health Index: <span className="text-rose-400">Secured</span></span>
          </div>
        </div>
      </div>

      {/* Feature Banner Carousel */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xl bg-card">
        <div className="relative h-[420px] md:h-[300px] w-full">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                currentBanner === index ? "opacity-100 translate-x-0 z-10" : "opacity-0 translate-x-8 z-0 pointer-events-none"
              }`}
            >
              <div className={`h-full w-full bg-gradient-to-r ${banner.color} p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center gap-8`}>
                {/* Left Section - Text */}
                <div className="w-full md:w-1/2 text-white space-y-4 text-left">
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-white/70 bg-white/10 px-2 py-0.5 rounded">
                    Featured Service
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">{banner.title}</h2>
                  <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-md">
                    {banner.description}
                  </p>
                  <div className="pt-2">
                    <Button variant="secondary" size="sm" className="font-semibold bg-white text-slate-900 hover:bg-slate-100 rounded-xl transition-all shadow-md group">
                      Learn More 
                      <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Button>
                  </div>
                </div>

                {/* Right Section - Image */}
                <div className="w-full md:w-1/2 h-[180px] md:h-[220px] relative overflow-hidden rounded-2xl shadow-2xl border border-white/10">
                  <img
                    src={banner.image || "/placeholder.svg"}
                    alt={banner.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
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
            className="bg-white/10 hover:bg-white/20 text-white rounded-full h-9 w-9 border border-white/10 backdrop-blur-sm"
            onClick={prevBanner}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/10 hover:bg-white/20 text-white rounded-full h-9 w-9 border border-white/10 backdrop-blur-sm"
            onClick={nextBanner}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Indicators on bottom-left */}
        <div className="absolute bottom-6 left-6 flex gap-1.5 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                currentBanner === index ? "w-6 bg-white" : "w-1.5 bg-white/40"
              }`}
              onClick={() => setCurrentBanner(index)}
            />
          ))}
        </div>
      </div>

      {/* Launcher Grid Title */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="h-5 w-5 text-indigo-500" />
          Dashboard Applications
        </h2>
        <p className="text-sm text-muted-foreground">Select an application launcher from the clinical suite below.</p>
      </div>

      {/* Feature Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, idx) => (
          <Link key={feature.title} href={feature.href} className="group">
            <Card className="relative h-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-card hover:bg-accent/10 transition-all duration-300 hover:shadow-xl hover:border-indigo-500/30 group-hover:-translate-y-1 rounded-2xl flex flex-col justify-between">
              
              {/* Highlight backdrop */}
              <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-bl-full pointer-events-none group-hover:from-indigo-500/10 transition-all duration-300" />
              
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center border transition-all duration-300 group-hover:scale-110 shadow-sm`}>
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                    {feature.badge}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <CardTitle className="text-lg font-bold tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground/90">
                    {feature.description}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="w-full flex items-center justify-between text-sm font-semibold text-indigo-600 dark:text-indigo-400 border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-2">
                  <span>Open Suite</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Additional Features Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md overflow-hidden bg-card">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/20">
            <CardTitle className="flex items-center gap-2.5 text-lg font-bold">
              <CheckCircle2 className="h-5 w-5 text-indigo-500" />
              Why Choose DermaAI?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="flex gap-4">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-500/10">
                <Microscope className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Advanced AI Analysis</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  State-of-the-art machine learning algorithms built to identify potential skin conditions within seconds.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-500/10">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Qualified Dermatologists</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Book direct digital consultations with licensed dermatological specialists for definitive treatment plans.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-500/10">
                <Users className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Comprehensive Medical Records</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All diagnoses, support tickets, and shopping receipts are consolidated under a HIPAA-secure vault.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md overflow-hidden bg-card">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/20">
            <CardTitle className="flex items-center gap-2.5 text-lg font-bold">
              <TrendingUp className="h-5 w-5 text-indigo-500" />
              System Updates & News
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-all">
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                <p className="font-bold text-slate-900 dark:text-white text-sm">New Diagnostic Model Live</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-4">
                Our latest neural network model achieves a higher precision rate across major skin classifications.
              </p>
            </div>
            
            <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-all">
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <p className="font-bold text-slate-900 dark:text-white text-sm">Expanded Doctor Network</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-4">
                We have partnered with 10+ new specialized dermatologists across multiple Indian metropolitan areas.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-all">
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <p className="font-bold text-slate-900 dark:text-white text-sm">Enhanced Telemedicine Platform</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-4">
                Consultation connections are now backed by ultra-low latency WebRTC, improving video and audio quality.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
