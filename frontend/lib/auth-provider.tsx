"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter, usePathname } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
  image?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  forgotPassword: (email: string) => Promise<boolean>
  resetPassword: (token: string, password: string) => Promise<boolean>
  setToken: (token: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("fitness_buddy_token")
        if (!token) {
          setLoading(false)
          return
        }

        // Verify token and get user data
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          localStorage.setItem("fitness_buddy_user", JSON.stringify(userData))
        } else {
          throw new Error('Invalid token')
        }
      } catch (error) {
        console.error("Authentication error:", error)
        // Clear invalid data
        localStorage.removeItem("fitness_buddy_user")
        localStorage.removeItem("fitness_buddy_token")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Redirect to login if accessing protected routes without authentication
  useEffect(() => {
    const protectedRoutes = [
      "/dashboard",
      "/my-workouts",
      "/progress",
      "/schedule",
      "/my-challenges",
      "/activity",
      "/settings",
    ]
    const adminRoutes = ["/admin"]

    if (!loading) {
      // If route is protected and user is not logged in
      if (protectedRoutes.some((route) => pathname?.startsWith(route)) && !user) {
        router.push("/auth/login")
        toast({
          title: "Authentication required",
          description: "Please log in to access this page.",
          variant: "destructive",
        })
      }

      // If route is admin-only and user is not admin
      if (adminRoutes.some((route) => pathname?.startsWith(route)) && (!user || user.role !== "admin")) {
        router.push("/")
        toast({
          title: "Access denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        })
      }
    }
  }, [loading, user, pathname, router, toast])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)

      // In a real app, this would be an API call
      // Simulating API request delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock login logic (replace with actual API call)
      if (email === "user@example.com" && password === "password") {
        const mockUser = {
          id: "1",
          name: "John Doe",
          email: "user@example.com",
          role: "user" as const,
          image: "/images/user-avatar.jpg",
        }

        // Store user and token
        localStorage.setItem("fitness_buddy_user", JSON.stringify(mockUser))
        localStorage.setItem("fitness_buddy_token", "mock_jwt_token")

        setUser(mockUser)
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        })

        return true
      } else if (email === "admin@example.com" && password === "password") {
        const mockAdmin = {
          id: "2",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin" as const,
          image: "/images/admin-avatar.jpg",
        }

        localStorage.setItem("fitness_buddy_user", JSON.stringify(mockAdmin))
        localStorage.setItem("fitness_buddy_token", "mock_admin_jwt_token")

        setUser(mockAdmin)
        toast({
          title: "Welcome back, Admin!",
          description: "You've successfully logged in.",
        })

        return true
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: "An error occurred. Please try again later.",
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)

      // In a real app, this would be an API call
      // Simulating API request delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock registration logic (replace with actual API call)
      if (email === "user@example.com") {
        toast({
          title: "Registration failed",
          description: "Email already exists. Please use a different email.",
          variant: "destructive",
        })
        return false
      }

      // Mock successful registration
      const newUser = {
        id: "new_user_id",
        name,
        email,
        role: "user" as const,
        image: "/images/default-avatar.jpg",
      }

      localStorage.setItem("fitness_buddy_user", JSON.stringify(newUser))
      localStorage.setItem("fitness_buddy_token", "mock_jwt_token")

      setUser(newUser)
      toast({
        title: "Registration successful!",
        description: "Your account has been created.",
      })

      return true
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration failed",
        description: "An error occurred. Please try again later.",
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("fitness_buddy_user")
    localStorage.removeItem("fitness_buddy_token")
    setUser(null)
    router.push("/")
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    })
  }

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      setLoading(true)

      // Simulating API request delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock forgot password logic
      if (email === "user@example.com" || email === "admin@example.com") {
        toast({
          title: "Reset email sent",
          description: "Check your inbox for password reset instructions.",
        })
        return true
      } else {
        toast({
          title: "Email not found",
          description: "No account found with that email address.",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      console.error("Forgot password error:", error)
      toast({
        title: "Request failed",
        description: "An error occurred. Please try again later.",
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (token: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)

      // Simulating API request delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock password reset logic
      if (token === "valid_token") {
        toast({
          title: "Password reset successful",
          description: "Your password has been updated. Please log in.",
        })
        return true
      } else {
        toast({
          title: "Invalid or expired token",
          description: "Please request a new password reset link.",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      console.error("Reset password error:", error)
      toast({
        title: "Reset failed",
        description: "An error occurred. Please try again later.",
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const setToken = async (token: string) => {
    try {
      localStorage.setItem("fitness_buddy_token", token)
      
      // Fetch user data using the token
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to get user data')

      const userData = await response.json()
      setUser(userData)
      localStorage.setItem("fitness_buddy_user", JSON.stringify(userData))
    } catch (error) {
      console.error('Error setting token:', error)
      toast({
        title: "Error",
        description: "Failed to authenticate. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    setToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

