"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Bell, Search } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { toast } from "@/components/ui/use-toast"
import { signOut } from "@/lib/auth"
import { Input } from "@/components/ui/input"

export function DashboardHeader({ user }: { user: { name?: string; email?: string; image?: string; user_metadata?: { avatar_url?: string } } | null }) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleLogout = async () => {
    try {
      await signOut()
      document.cookie = 'accessToken=; Max-Age=0; path=/'
      document.cookie = 'idToken=; Max-Age=0; path=/'
      document.cookie = 'refreshToken=; Max-Age=0; path=/'
      router.push("/login")
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Please try again.";
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to log out: ${errorMessage}`,
      })
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <form onSubmit={handleSearch} className="relative w-full max-w-sm lg:max-w-md">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search medical information..."
                className="w-full bg-background pl-8 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                size="sm"
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
              >
                <span className="sr-only">Search</span>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex flex-col space-y-4 p-4">
                <p className="text-sm text-muted-foreground text-center">No notifications at the moment</p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} alt={user?.email} />
                  <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/dashboard/medical-history")}>
                Medical History
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
