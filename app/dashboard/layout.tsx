"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { ProfileProvider } from "@/contexts/ProfileContext"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [dbProfile, setDbProfile] = useState<any>(null)
  // Track whether the profile sync is still in-flight to prevent premature renders
  // and avoid triggering multiple sync calls
  const [isSyncing, setIsSyncing] = useState(true)
  const hasSynced = useRef(false)

  useEffect(() => {
    if (!isLoaded) return
    if (!user) {
      router.push("/login")
      return
    }
    // Prevent duplicate sync calls (e.g. on StrictMode double-invoke or re-renders)
    if (hasSynced.current) return
    hasSynced.current = true

    const primaryEmail = user.emailAddresses?.find(
      (e) => e.id === user.primaryEmailAddressId
    )?.emailAddress || user.emailAddresses?.[0]?.emailAddress || "no-email@example.com"

    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || primaryEmail.split('@')[0]

    fetch('/api/profile/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: user.id, email: primaryEmail, fullName }),
    })
      .then(res => {
        if (!res.ok) throw new Error(`Sync failed with status ${res.status}`)
        return res.json()
      })
      .then(data => {
        // Only redirect to onboarding when we have a definitive isOnboarded:false
        // from the database. If data.profile is missing or sync errored, stay put.
        if (data.profile && data.profile.isOnboarded === false) {
          // Use hard navigation to fully clear Next.js router cache
          // and prevent the layout from mounting again mid-redirect
          window.location.href = "/onboarding"
        } else if (data.profile?.role === "doctor") {
          window.location.href = "/doctor-dashboard"
        } else {
          setDbProfile(data.profile ?? null)
          setIsSyncing(false)
        }
      })
      .catch(err => {
        // On sync error, allow access to dashboard rather than redirect looping
        console.error("Failed to sync profile:", err)
        setIsSyncing(false)
      })
  }, [user, isLoaded]) // eslint-disable-line react-hooks/exhaustive-deps

  // Show nothing (or a loader) until Clerk session is ready
  if (!isLoaded || !user) return null

  // Show a loading spinner while the profile sync is in-flight
  // This prevents the dashboard UI from flashing before a potential redirect
  if (isSyncing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const primaryEmail = user.emailAddresses?.find(
    (e) => e.id === user.primaryEmailAddressId
  )?.emailAddress || user.emailAddresses?.[0]?.emailAddress || "no-email@example.com"

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar isAdmin={dbProfile?.role === "admin"} isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)} />
      <div className={cn("transition-all duration-300", isCollapsed ? "lg:pl-[70px]" : "lg:pl-64")}>
        <DashboardHeader user={{
          id: user.id,
          firstName: user.firstName ?? null,
          lastName: user.lastName ?? null,
          email: primaryEmail,
          imageUrl: user.imageUrl ?? null,
        }} />
        <ProfileProvider>
          <main className="container py-6">{children}</main>
        </ProfileProvider>
      </div>
    </div>
  )
}
