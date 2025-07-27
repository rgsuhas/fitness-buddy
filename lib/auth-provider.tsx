"use client"

import { createContext, type ReactNode } from "react"
import { SessionProvider, useSession, signOut } from "next-auth/react"
import { toast } from "sonner"
import { useRouter, usePathname } from "next/navigation"


declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: "user" | "admin";
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    role?: "user" | "admin";
  }
}

interface AuthContextType {
  user: Session["user"] | null;
  loading: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthContent>{children}</AuthContent>
    </SessionProvider>
  )
}

function AuthContent({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const user: Session["user"] | null = session?.user ? {
    id: session.user.id as string,
    name: session.user.name as string,
    email: session.user.email as string,
    role: (session.user.role || "user") as "user" | "admin",
    image: session.user.image as string,
  } : null
  const loading = status === "loading"
  
  const router = useRouter()
  const pathname = usePathname()

  // Redirect to login if accessing protected routes without authentication
  // useEffect(() => {
  //   const protectedRoutes = [
  //     "/dashboard",
  //     "/my-workouts",
  //     "/progress",
  //     "/schedule",
  //     "/my-challenges",
  //     "/activity",
  //     "/settings",
  //   ]
  //   const adminRoutes = ["/admin"]

  //   if (!loading) {
  //     // If route is protected and user is not logged in
  //     if (protectedRoutes.some((route) => pathname?.startsWith(route)) && !user) {
  //       router.push("/auth/login")
  //       toast.error("Authentication required", {
  //         description: "Please log in to access this page.",
  //       })
  //     }

  //     // If route is admin-only and user is not admin
  //     if (adminRoutes.some((route) => pathname?.startsWith(route)) && (!user || user.role !== "admin")) {
  //       router.push("/")
  //       toast.error("Access denied", {
  //         description: "You don't have permission to access this page.",
  //       })
  //     }
  //   }
  // }, [loading, user, pathname, router, toast])

  const logout = () => {
    // signOut()
    router.push("/")
    toast.info("Logged out", {
      description: "You've been successfully logged out.",
    })
  }

  const value = {
    user,
    loading,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
