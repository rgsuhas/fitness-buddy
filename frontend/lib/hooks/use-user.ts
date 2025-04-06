"use client"

import { useContext } from "react"
import { AuthContext } from "@/lib/auth-provider"

export function useUser() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useUser must be used within an AuthProvider")
  }

  return context
}

