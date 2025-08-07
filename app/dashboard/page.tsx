"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useUser } from "@/lib/hooks/use-user"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { CalendarRange, DumbbellIcon as DumbellIcon, Heart, TrendingUp, Users } from "lucide-react"
import { WorkoutRecommendations } from "@/components/workout-recommendations"
import { toast } from "sonner"

// Mock data
const progressData = [
  { date: "Mon", weight: 185, calories: 2200 },
  { date: "Tue", weight: 184, calories: 2100 },
  { date: "Wed", weight: 183.5, calories: 2050 },
  { date: "Thu", weight: 183, calories: 2150 },
  { date: "Fri", weight: 182, calories: 2000 },
  { date: "Sat", weight: 182.5, calories: 2300 },
  { date: "Sun", weight: 182, calories: 2100 },
]

const statsCards = [
  {
    title: "Weekly Workouts",
    value: "5/7",
    description: "days completed",
    icon: DumbellIcon,
    color: "text-blue-500",
    bgColor: "bg-blue-100",
  },
  {
    title: "Active Calories",
    value: "4,320",
    description: "weekly burned",
    icon: TrendingUp,
    color: "text-orange-500",
    bgColor: "bg-orange-100",
  },
  {
    title: "Avg. Heart Rate",
    value: "142",
    description: "BPM during exercise",
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-100",
  },
  {
    title: "Community",
    value: "8",
    description: "active buddies",
    icon: Users,
    color: "text-green-500",
    bgColor: "bg-green-100",
  },
]

export default function DashboardPage() {
  const { user, loading } = useUser()
  
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // If user is not logged in and not still loading, redirect to login
    if (!loading && !user) {
      redirect("/auth/login")
    }

    // Simulate loading dashboard data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [user, loading])

  if (loading) {
    return (
      <div className="container py-10">
        <Skeleton className="h-12 w-1/3 mb-6" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name?.split(" ")[0] || "User"}</h1>
        <p className="text-muted-foreground">Here&apos;s an overview of your fitness journey</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{card.title}</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold">{card.value}</h3>
                    <p className="ml-2 text-sm text-muted-foreground">{card.description}</p>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${card.bgColor} ${card.color}`}>
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Weekly Goal Progress</CardTitle>
            <CardDescription>Your progress towards your weekly fitness goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Workouts Completed</div>
                  <div className="text-sm text-muted-foreground">5/7 days</div>
                </div>
                <Progress value={71} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Calories Burned</div>
                  <div className="text-sm text-muted-foreground">4,320/5,000 kcal</div>
                </div>
                <Progress value={86} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Water Intake</div>
                  <div className="text-sm text-muted-foreground">2.4/3.0 L</div>
                </div>
                <Progress value={80} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Steps</div>
                  <div className="text-sm text-muted-foreground">8,456/10,000 steps</div>
                </div>
                <Progress value={85} />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              <CalendarRange className="mr-2 h-4 w-4" />
              View All Goals
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Progress Tracking</CardTitle>
            <CardDescription>Track your weekly progress</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="weight">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="weight">Weight</TabsTrigger>
                  <TabsTrigger value="calories">Calories</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="weight" className="mt-0">
              <ChartContainer
                config={{
                  weight: {
                    label: "Weight (lbs)",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[250px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="date" />
                    <YAxis domain={[180, 187]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="var(--color-weight)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
              </TabsContent>
              <TabsContent value="calories" className="mt-0">
              <ChartContainer
                config={{
                  calories: {
                    label: "Calories (kcal)",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[250px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="date" />
                    <YAxis domain={[1950, 2350]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="calories"
                      stroke="var(--color-calories)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" disabled>
              <TrendingUp className="mr-2 h-4 w-4" />
              Progress Tracking (Coming Soon)
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Workouts</CardTitle>
          <CardDescription>
            Personalized workout recommendations based on your fitness goals and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index}>
                  <Skeleton className="h-[200px] w-full rounded-t-lg" />
                  <CardHeader className="p-4">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </CardHeader>
                  <CardFooter className="p-4 pt-0">
                    <Skeleton className="h-9 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <WorkoutRecommendations />
          )}
        </CardContent>
        <CardFooter>
          <Link href="/workouts" className="w-full">
            <Button className="w-full">Browse All Workouts</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

