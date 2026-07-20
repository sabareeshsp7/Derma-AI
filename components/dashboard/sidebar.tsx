"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Activity,
  Calendar,
  ChevronRight,
  Home,
  Menu,
  ShoppingBag,
  User,
  Microscope,
  ShieldCheck,
  Ticket,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/dashboard",
  },
  {
    title: "Skin Condition Analysis",
    icon: Microscope,
    href: "/dashboard/analysis",
  },
  {
    title: "My Skin Tickets",
    icon: Ticket,
    href: "/dashboard/skin-tickets",
  },
  {
    title: "Dermatologist Appointments",
    icon: Calendar,
    href: "/dashboard/appointments",
  },
  {
    title: "Medical Shop",
    icon: ShoppingBag,
    href: "/dashboard/shop",
  },
  {
    title: "Profile",
    icon: User,
    href: "/dashboard/profile",
  },
]

export function DashboardSidebar({ isAdmin = false, isCollapsed = false, onToggleCollapse }: { isAdmin?: boolean, isCollapsed?: boolean, onToggleCollapse?: () => void }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const SidebarContent = () => (
    <nav className="flex-1 space-y-1.5 p-4">
      {menuItems.map((item) => {
        const isActive = item.href === "/dashboard" 
          ? pathname === "/dashboard" 
          : (pathname === item.href || pathname.startsWith(item.href + "/"))
        return (
          <Link key={item.href} href={item.href}>
            <div
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-300 cursor-pointer",
                isActive 
                  ? "bg-gradient-to-r from-indigo-500 via-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/20" 
                  : "text-slate-600 hover:bg-slate-100/60 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800/40"
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
              {!isCollapsed && <span className="flex-1">{item.title}</span>}
              {isActive && !isCollapsed && <ChevronRight className="ml-auto h-4.5 w-4.5 animate-pulse" />}
            </div>
          </Link>
        )
      })}

      {/* Admin Panel Link — visible ONLY to specific admin role */}
      {isAdmin && (
        <Link href="/admin/doctors">
          <div className={cn(
            "mt-6 flex items-center gap-3 rounded-xl py-2.5 text-sm font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60 shadow-sm border border-indigo-100/50 dark:border-indigo-900/30 transition-all duration-300",
            isCollapsed ? "justify-center px-0" : "px-3"
          )}>
            <ShieldCheck className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>Admin Panel</span>}
          </div>
        </Link>
      )}
    </nav>
  )

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-850/50">
          <SheetHeader className="h-14 border-b border-slate-100 dark:border-slate-800/60 px-4 flex items-center">
            <SheetTitle className="flex items-center gap-2">
              <Link href="/dashboard" className="flex items-center gap-2.5 font-bold">
                <Activity className="h-6 w-6 text-indigo-600" />
                <span className="bg-gradient-to-r from-slate-900 to-indigo-950 bg-clip-text text-transparent">DermaAI</span>
              </Link>
            </SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex h-screen flex-col fixed left-0 top-0 border-r border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl shadow-[4px_0_24px_-10px_rgba(0,0,0,0.03)] transition-all duration-300 z-40",
        isCollapsed ? "w-[70px]" : "w-64"
      )}>
        <div className={cn("flex h-14 items-center border-b border-slate-100 dark:border-slate-800/60 px-4", isCollapsed ? "justify-center" : "justify-between")}>
          <Link href="/dashboard" className={cn("flex items-center gap-2 font-bold", isCollapsed && "hidden")}>
            <Activity className="h-6 w-6 text-indigo-600 shrink-0" />
            <span className="bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">DermaAI</span>
          </Link>
          {isCollapsed && (
             <Link href="/dashboard" className="flex items-center justify-center">
                <Activity className="h-6 w-6 text-indigo-600 shrink-0" />
             </Link>
          )}
          {onToggleCollapse && (
            <Button variant="ghost" size="icon" onClick={onToggleCollapse} className={cn("hidden lg:flex h-8 w-8 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-lg", isCollapsed ? "mt-4 mb-2" : "")}>
              {isCollapsed ? <PanelLeftOpen className="h-4 w-4 text-slate-500" /> : <PanelLeftClose className="h-4 w-4 text-slate-500" />}
            </Button>
          )}
        </div>
        <SidebarContent />
      </div>
    </>
  )
}
