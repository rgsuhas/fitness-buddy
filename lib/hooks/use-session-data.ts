"use client"

import { useSession } from "next-auth/react"

export function useSessionData() {
  const { data: session, status } = useSession()

  return {
    session,
    loading: status === "loading",
    isAuthenticated: status === "authenticated",
  }
}

