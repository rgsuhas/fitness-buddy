import type React from "react"
import { Inter as FontSans } from "next/font/google"
import { Toaster } from "sonner"
import { Sidebar } from "@/components/sidebar"
import Header from "@/components/header"
import { ErrorBoundary } from "@/components/error-boundary"
import dynamic from 'next/dynamic'
import { Providers } from "./providers"

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
        <Providers>
          <ErrorBoundary>
            <div className="min-h-screen flex flex-col">
              <Header />
              <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1">{children}</main>
              </div>
            </div>
          </ErrorBoundary>
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  )
}

