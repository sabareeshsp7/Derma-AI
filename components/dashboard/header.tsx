"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Bell, Calendar, Info, CheckCircle2, Activity, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UserButton } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import { useProfile } from "@/contexts/ProfileContext"

interface PlainUser {
  id: string
  firstName: string | null
  lastName: string | null
  email: string
  imageUrl: string | null
}

interface PatientNotification {
  id: string
  title: string
  message: string
  type: string
  doctorName: string
  date: string
  link?: string
  read: boolean
}

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
  return ""
}

export function DashboardHeader({ user }: { user: PlainUser | null }) {
  const router = useRouter()
  const [notifications, setNotifications] = useState<PatientNotification[]>([])
  const [notifCount, setNotifCount] = useState(0)
  const [clockTime, setClockTime] = useState("")
  const [clockDate, setClockDate] = useState("")
  const { profile } = useProfile()

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/patient/notifications")
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications || [])
        setNotifCount(data.count || 0)
      }
    } catch {
      // silent fail
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  // Live clock — ticks every second, respects user country timezone
  useEffect(() => {
    const tz = getTimezoneByCountry(profile?.country || "")
    const tick = () => {
      const now = new Date()
      try {
        setClockTime(now.toLocaleTimeString("en-US", {
          hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
          ...(tz ? { timeZone: tz } : {})
        }))
        setClockDate(now.toLocaleDateString("en-US", {
          weekday: "short", month: "short", day: "numeric",
          ...(tz ? { timeZone: tz } : {})
        }))
      } catch {
        setClockTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }))
        setClockDate(now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }))
      }
    }
    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [profile?.country])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-14 items-center gap-4">

        {/* Spacer / Left layout aligner */}
        <div className="hidden lg:block w-6" />

        {/* Center — Live Clock Pill */}
        <div className="flex-1 flex justify-center">
          {clockTime && (
            <div className="inline-flex items-center gap-2.5 rounded-full bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 px-4 py-1.5 shadow-inner backdrop-blur-sm">
              <Clock className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
              <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-100 tabular-nums tracking-wide">
                {clockTime}
              </span>
              <span className="h-3.5 w-px bg-slate-300 dark:bg-slate-600 shrink-0" />
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:block">
                {clockDate}
              </span>
              {profile?.country && (
                <>
                  <span className="h-3.5 w-px bg-slate-300 dark:bg-slate-600 shrink-0 hidden sm:block" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 hidden md:block">
                    {profile.country}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right — Notifications + User */}
        <div className="flex items-center gap-2 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                <Bell className={cn("h-5 w-5", notifCount > 0 ? "text-indigo-500" : "text-slate-500")} />
                {notifCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-slate-950" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 sm:w-96 p-0 border-slate-200/60 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-3 flex items-center gap-2">
                <Bell className="h-4 w-4 text-indigo-500" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Notifications</h4>
                {notifCount > 0 && (
                  <span className="ml-auto text-xs font-bold bg-indigo-500 text-white px-2 py-0.5 rounded-full">{notifCount}</span>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-950">
                {notifications.length === 0 ? (
                  <div className="flex flex-col space-y-3 p-8 items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                    <p className="text-sm text-slate-500 font-semibold">You&apos;re all caught up!</p>
                  </div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={cn("p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-3", !n.read && "bg-indigo-50/50 dark:bg-indigo-900/10")}>
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5", n.type === "Appointment" ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-600")}>
                        {n.type === "Appointment" ? <Calendar className="h-4 w-4" /> : <Info className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-0.5">{n.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{n.message}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-2">{new Date(n.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <UserButton />
        </div>
      </div>
    </header>
  )
}
