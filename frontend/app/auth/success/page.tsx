'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@/lib/hooks/use-user'
import { useToast } from '@/components/ui/use-toast'

export default function AuthSuccess() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setToken, user } = useUser()
  const { toast } = useToast()

  useEffect(() => {
    const processAuth = async () => {
      try {
        const token = searchParams.get('token')
        if (!token) {
          console.error('No token received')
          toast({
            title: 'Authentication Failed',
            description: 'No authentication token received',
            variant: 'destructive',
          })
          router.push('/auth/login')
          return
        }

        await setToken(token)
        // Wait for user data to be loaded
        const maxAttempts = 10
        let attempts = 0
        while (!user && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 500))
          attempts++
        }

        if (!user) {
          throw new Error('Failed to load user data')
        }

        toast({
          title: 'Welcome!',
          description: `Successfully logged in as ${user.name}`,
        })
        router.push('/dashboard')
      } catch (error) {
        console.error('Auth error:', error)
        toast({
          title: 'Authentication Failed',
          description: 'Failed to complete authentication',
          variant: 'destructive',
        })
        router.push('/auth/login')
      }
    }

    processAuth()
  }, [searchParams, router, setToken, user, toast])

  return null // No need for loading UI, reduces bundle size
}
