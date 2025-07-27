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
} from "lucide-react"

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
      title: "AI Workout Plans",
      href: "/workout-plans/ai-generator",
      icon: Sparkles,
    },
   
    {
      title: "Progress",
      href: "/progress",
      icon: LineChart,
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
      href: "/my-challenges",
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
    <div
      className={`border-r h-full bg-muted/40 hidden md:block ${collapsed ? "w-16" : "w-64"} transition-all duration-300`}
    >
      <div className="h-full py-4 flex flex-col justify-between">
        <div className="space-y-1 px-3 overflow-y-auto">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                } ${collapsed ? "justify-center" : "justify-start"}`}
              >
                <item.icon className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`} />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            )
          })}

          {user?.role === "admin" && (
            <>
              <div className="border-t border-gray-700 my-4" />
              {adminItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    } ${collapsed ? "justify-center" : "justify-start"}`}
                  >
                    <item.icon className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`} />
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                )
              })}
            </>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mx-3 flex items-center justify-center p-2 rounded-md hover:bg-accent text-muted-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transform transition-transform ${collapsed ? "rotate-180" : ""}`}
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}

