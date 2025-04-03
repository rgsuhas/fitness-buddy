"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/lib/hooks/use-user"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { ChartContainer,  CustomTooltip } from "@/components/ui/chart"

//ChartTooltip, ChartTooltipContent,

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts"
import { UsersTable } from "@/components/admin/users-table"
import { ExercisesTable } from "@/components/admin/exercises-table"
import { WorkoutsTable } from "@/components/admin/workouts-table"
import {
  AlertCircle,
  UserPlus,
  ChevronUp,
  ChevronDown,
  DumbbellIcon as DumbellIcon,
  Users,
  Activity,
  Search,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock data for charts
const userGrowthData = [
  { month: "Jan", users: 1200 },
  { month: "Feb", users: 1900 },
  { month: "Mar", users: 3000 },
  { month: "Apr", users: 4780 },
  { month: "May", users: 5890 },
  { month: "Jun", users: 6390 },
  { month: "Jul", users: 7490 },
]

const activityData = [
  { day: "Mon", workouts: 2300, plans: 1200, challenges: 400 },
  { day: "Tue", workouts: 1890, plans: 1108, challenges: 380 },
  { day: "Wed", workouts: 2350, plans: 1380, challenges: 430 },
  { day: "Thu", workouts: 3490, plans: 1700, challenges: 590 },
  { day: "Fri", workouts: 2900, plans: 1400, challenges: 470 },
  { day: "Sat", workouts: 3200, plans: 1500, challenges: 520 },
  { day: "Sun", workouts: 2500, plans: 1300, challenges: 450 },
]

const usersByGoalData = [
  { name: "Weight Loss", value: 35 },
  { name: "Muscle Gain", value: 30 },
  { name: "Endurance", value: 15 },
  { name: "Flexibility", value: 10 },
  { name: "General Fitness", value: 10 },
]

const COLORS = ["#3b82f6", "#ef4444", "#22c55e", "#eab308", "#8b5cf6"]

export default function AdminDashboardPage() {
  const { user, loading } = useUser()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is admin, if not redirect
    if (!loading && (!user || user.role !== "admin")) {
      redirect("/auth/login")
    }

    // Simulate loading dashboard data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [user, loading])

  if (loading || isLoading) {
    return (
      <div className="container py-10 space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full" />
          ))}
        </div>
        <Skeleton className="h-[350px] w-full" />
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your platform, users, workouts, and gain insights</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Users</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">7,495</h3>
                  <Badge variant="secondary" className="gap-1">
                    <ChevronUp className="h-3.5 w-3.5" />
                    <span>12.5%</span>
                  </Badge>
                </div>
              </div>
              <div className="p-3 rounded-full bg-blue-100 text-blue-500">
                <UserPlus className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Active Workouts</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">12,453</h3>
                  <Badge variant="secondary" className="gap-1">
                    <ChevronUp className="h-3.5 w-3.5" />
                    <span>8.2%</span>
                  </Badge>
                </div>
              </div>
              <div className="p-3 rounded-full bg-green-100 text-green-500">
                <DumbellIcon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Active Challenges</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">45</h3>
                  <Badge variant="secondary" className="gap-1">
                    <ChevronUp className="h-3.5 w-3.5" />
                    <span>15.3%</span>
                  </Badge>
                </div>
              </div>
              <div className="p-3 rounded-full bg-orange-100 text-orange-500">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Weekly Engagement</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">68.7%</h3>
                  <Badge variant="destructive" className="gap-1">
                    <ChevronDown className="h-3.5 w-3.5" />
                    <span>3.2%</span>
                  </Badge>
                </div>
              </div>
              <div className="p-3 rounded-full bg-purple-100 text-purple-500">
                <Activity className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>System Alert</AlertTitle>
        <AlertDescription>
          There are 5 failed AI workout generation attempts in the last hour. The AI service might be experiencing
          issues.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly user registrations</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <ChartContainer
              config={{
                users: {
                  label: "User Registrations",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-users)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-users)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="var(--color-users)"
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Distribution by Fitness Goal</CardTitle>
            <CardDescription>Percentage of users for each fitness goal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={usersByGoalData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {usersByGoalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Percentage"]}
                    contentStyle={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Activity</CardTitle>
          <CardDescription>Daily usage across key features</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <ChartContainer
            config={{
              workouts: {
                label: "Workout Sessions",
                color: "hsl(var(--chart-1))",
              },
              plans: {
                label: "Workout Plans",
                color: "hsl(var(--chart-2))",
              },
              challenges: {
                label: "Challenges",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[350px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="workouts" fill="var(--color-workouts)" />
                <Bar dataKey="plans" fill="var(--color-plans)" />
                <Bar dataKey="challenges" fill="var(--color-challenges)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Tabs defaultValue="users" className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
          </TabsList>
          <div className="w-full sm:w-auto flex items-center relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9 w-full sm:w-[250px]" placeholder="Search..." />
          </div>
        </div>

        <TabsContent value="users" className="m-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users, review profiles, and adjust permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <UsersTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workouts" className="m-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workout Management</CardTitle>
              <CardDescription>Manage workout plans and user-created workouts</CardDescription>
            </CardHeader>
            <CardContent>
              <WorkoutsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exercises" className="m-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exercise Library</CardTitle>
              <CardDescription>Manage exercises, categories, and instructional content</CardDescription>
            </CardHeader>
            <CardContent>
              <ExercisesTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

