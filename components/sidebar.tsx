"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser } from "@/lib/hooks/use-user"
import {
  LineChart,
  DumbbellIcon as DumbellIcon,
  Home,
  Calendar,
  Users,
  Settings,
  Trophy,
  Activity,
  Sparkles,
  Apple,
  Heart,
  MessageSquare,
  Watch,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  const { user, loading } = useUser()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Add event listener
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true)
    }
  }, [isMobile])

  if (loading || !user) {
    return null
  }

  const items = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "My Workouts",
      href: "/my-workouts",
      icon: DumbellIcon,
    },
    {
      title: "Workouts",
      href: "/workouts",
      icon: DumbellIcon,
    },
    {
      title: "AI Workout Plans",
      href: "/workout-plans/ai-generator",
      icon: Sparkles,
    },
    {
      title: "Schedule",
      href: "/schedule",
      icon: Calendar,
    },
    {
      title: "Nutrition",
      href: "/nutrition",
      icon: Apple,
    },
    {
      title: "Challenges",
      href: "/challenges",
      icon: Trophy,
    },
    {
      title: "Community",
      href: "/community",
      icon: Users,
    },
    {
      title: "Messages",
      href: "/messages",
      icon: MessageSquare,
    },
    {
      title: "Wearables",
      href: "/wearables",
      icon: Watch,
    },
    {
      title: "Mindfulness",
      href: "/mindfulness",
      icon: Heart,
    },
    {
      title: "Activity",
      href: "/activity",
      icon: Activity,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

  const adminItems = [
    {
      title: "Admin Dashboard",
      href: "/admin/dashboard",
      icon: Home,
    },
  ]

  return (
    <aside
      className={`border-r bg-muted/40 transition-all duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-64"
      } ${isMobile ? "fixed left-0 top-16 h-full z-30" : "hidden md:block"}`}
      aria-label="Navigation sidebar"
    >
      <div className="h-full py-4 flex flex-col justify-between">
        <nav className="space-y-1 px-3 overflow-y-auto flex-1">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                } ${collapsed ? "justify-center" : "justify-start"}`}
                aria-current={isActive ? "page" : undefined}
                title={collapsed ? item.title : undefined}
              >
                <item.icon className={`h-5 w-5 flex-shrink-0 ${collapsed ? "" : "mr-3"}`} aria-hidden="true" />
                {!collapsed && <span className="truncate">{item.title}</span>}
              </Link>
            )
          })}

          {user?.role === "admin" && (
            <>
              <div className="border-t border-border/50 my-4" />
              {adminItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    } ${collapsed ? "justify-center" : "justify-start"}`}
                    aria-current={isActive ? "page" : undefined}
                    title={collapsed ? item.title : undefined}
                  >
                    <item.icon className={`h-5 w-5 flex-shrink-0 ${collapsed ? "" : "mr-3"}`} aria-hidden="true" />
                    {!collapsed && <span className="truncate">{item.title}</span>}
                  </Link>
                )
              })}
            </>
          )}
        </nav>

        <div className="px-3 pt-2 border-t border-border/50">
          <Button
            onClick={() => setCollapsed(!collapsed)}
            variant="ghost"
            size="sm"
            className="w-full justify-center h-8 px-2 text-muted-foreground hover:text-foreground"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setCollapsed(true)}
          aria-hidden="true"
        />
      )}
    </aside>
  )
}

