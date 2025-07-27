"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@/lib/hooks/use-user'
import { signIn } from 'next-auth/react'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useUser()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      // This page is likely for handling OAuth callbacks where NextAuth.js handles the session.
      // We can trigger a sign in here if needed, or simply redirect based on session status.
      // For now, we'll just redirect to dashboard if a token is present (assuming NextAuth.js processed it).
      router.push('/dashboard')
    } else if (!loading && !user) {
      // If no token and not loading, and no user, redirect to login
      router.push('/auth/login')
    }
  }, [searchParams, router, user, loading])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Processing your login...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  )
}
