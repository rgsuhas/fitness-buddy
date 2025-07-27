"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { signOut } from "next-auth/react";
import { useUser } from "@/lib/hooks/use-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const { user, loading } = useUser()

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">
              <span className="text-primary">Fitness</span>Buddy
            </span>
          </Link>

          <nav className="hidden md:ml-10 md:flex md:space-x-8">
            <Link href="/workouts" className="text-sm font-medium hover:text-primary">
              Workouts
            </Link>
            <Link href="/exercises" className="text-sm font-medium hover:text-primary">
              Exercises
            </Link>
            <Link href="/challenges" className="text-sm font-medium hover:text-primary">
              Challenges
            </Link>
            <Link href="/community" className="text-sm font-medium hover:text-primary">
              Community
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" aria-label="Notifications" className="relative rounded-full">
                    <Bell className="h-[1.2rem] w-[1.2rem]" />
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary"></span>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.image || ''} alt={user?.name ?? 'User avatar'} />
                          <AvatarFallback>{user?.name?.[0] ?? '?'}</AvatarFallback>
                        </Avatar>
                        <span className="sr-only">Open user menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                          <Link href="/profile" className="w-full flex">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard" className="w-full flex">Dashboard</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/settings" className="w-full flex">Settings</Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={(event) => {
                          event.preventDefault();
                          signOut();
                        }}
                        className="text-destructive focus:text-destructive cursor-pointer"
                      >
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="rounded-full" asChild>
                    <Link href="/auth/login">
                      Log In
                    </Link>
                  </Button>
                  <Button className="rounded-full" asChild>
                    <Link href="/auth/register" className="hidden sm:block">
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}
            </>
          )}

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 z-10 bg-background/95 backdrop-blur-md border-b">
          <div className="space-y-1 px-4 py-4">
            <Link
              href="/workouts"
              className="block py-2 text-base font-medium hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Workouts
            </Link>
            <Link
              href="/exercises"
              className="block py-2 text-base font-medium hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Exercises
            </Link>
            <Link
              href="/challenges"
              className="block py-2 text-base font-medium hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Challenges
            </Link>
            <Link
              href="/community"
              className="block py-2 text-base font-medium hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Community
            </Link>
            {!user && !loading && (
              <Link
                href="/auth/register"
                className="block py-2 text-base font-medium hover:text-primary sm:hidden"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

