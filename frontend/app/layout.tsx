import type React from "react"
import { Inter as FontSans } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { AuthProvider } from "@/lib/auth-provider"
import Header from "@/components/header"
import dynamic from 'next/dynamic'

import "./globals.css"

export const metadata = {
  title: "Fitness Buddy - Your Social Fitness Companion",
  description: "Connect with fitness buddies, get personalized workout plans, and track your progress",
}

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`font-sans antialiased ${fontSans.variable}`}>
        <AuthProvider>
          <ThemeProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1">{children}</main>
              </div>
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

