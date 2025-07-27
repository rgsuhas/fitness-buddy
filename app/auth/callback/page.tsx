"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@/lib/hooks/use-user'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setToken } = useUser()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      setToken(token)
      router.push('/dashboard')
    } else {
      router.push('/auth/login')
    }
  }, [searchParams, router, setToken])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Processing your login...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  )
}
