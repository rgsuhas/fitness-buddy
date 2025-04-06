"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { ChartContainer } from "@/components/ui/chart"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Activity, Heart, Footprints, Flame, Moon, RefreshCw, Plus, Watch, Smartphone, ArrowRight } from "lucide-react"
import { handleApiError } from "@/lib/error-handler"
import Image from 'next/image';

interface WearableDevice {
  id: string
  name: string
  type: string
  brand: string
  lastSync: string
  connected: boolean
  batteryLevel?: number
  imageUrl?: string
}

interface HealthData {
  date: string
  steps: number
  caloriesBurned: number
  activeMinutes: number
  heartRate: number
  sleep: number
}

export default function WearablesPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [devices, setDevices] = useState<WearableDevice[]>([])
  const [healthData, setHealthData] = useState<HealthData[]>([])
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock devices data
        setDevices([
          {
            id: "device1",
            name: "Fitbit Charge 5",
            type: "Fitness Tracker",
            brand: "Fitbit",
            lastSync: "10 minutes ago",
            connected: true,
            batteryLevel: 72,
            imageUrl: "", // Simulate a missing image
          },
          {
            id: "device2",
            name: "Apple Watch Series 8",
            type: "Smartwatch",
            brand: "Apple",
            lastSync: "2 hours ago",
            connected: true,
            batteryLevel: 45,
            imageUrl: "https://placehold.co/300x200",
          },
          {
            id: "device3",
            name: "Garmin Forerunner 255",
            type: "GPS Watch",
            brand: "Garmin",
            lastSync: "Disconnected",
            connected: false,
            imageUrl: "https://placehold.co/300x200",
          },
        ])

        // Mock health data
        setHealthData([
          {
            date: "Mon",
            steps: 8432,
            caloriesBurned: 2145,
            activeMinutes: 42,
            heartRate: 68,
            sleep: 7.2,
          },
          {
            date: "Tue",
            steps: 10567,
            caloriesBurned: 2356,
            activeMinutes: 58,
            heartRate: 72,
            sleep: 6.8,
          },
          {
            date: "Wed",
            steps: 7890,
            caloriesBurned: 2089,
            activeMinutes: 38,
            heartRate: 70,
            sleep: 7.5,
          },
          {
            date: "Thu",
            steps: 12453,
            caloriesBurned: 2578,
            activeMinutes: 75,
            heartRate: 75,
            sleep: 6.5,
          },
          {
            date: "Fri",
            steps: 9876,
            caloriesBurned: 2245,
            activeMinutes: 52,
            heartRate: 71,
            sleep: 7.8,
          },
          {
            date: "Sat",
            steps: 6543,
            caloriesBurned: 1876,
            activeMinutes: 32,
            heartRate: 67,
            sleep: 8.2,
          },
          {
            date: "Sun",
            steps: 11234,
            caloriesBurned: 2467,
            activeMinutes: 65,
            heartRate: 73,
            sleep: 7.1,
          },
        ])

        setLoading(false)
      } catch (error) {
        handleApiError(error, toast, {
          title: "Error loading wearable data",
          fallbackMessage: "Failed to load your wearable data. Please try again later.",
        })
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleSyncDevices = () => {
    setLoading(true)

    // Simulate syncing
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Devices Synced",
        description: "Your wearable devices have been synced successfully.",
      })
    }, 2000)
  }

  const handleConnectDevice = () => {
    toast({
      title: "Connect New Device",
      description: "Redirecting to device connection page...",
    })
  }

  // Calculate today's stats
  const todayStats = {
    steps: 8432,
    caloriesBurned: 2145,
    activeMinutes: 42,
    heartRate: 68,
    sleep: 7.2,
  }

  // Calculate goals and progress
  const goals = {
    steps: 10000,
    caloriesBurned: 2500,
    activeMinutes: 60,
    sleep: 8,
  }

  const progress = {
    steps: Math.min(Math.round((todayStats.steps / goals.steps) * 100), 100),
    caloriesBurned: Math.min(Math.round((todayStats.caloriesBurned / goals.caloriesBurned) * 100), 100),
    activeMinutes: Math.min(Math.round((todayStats.activeMinutes / goals.activeMinutes) * 100), 100),
    sleep: Math.min(Math.round((todayStats.sleep / goals.sleep) * 100), 100),
  }

  if (loading) {
    return (
      <div className="container py-8 space-y-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>

        <Skeleton className="h-12 w-full" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Wearable Devices</h1>
        <p className="text-muted-foreground">Connect and manage your fitness trackers and smartwatches</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2">
          <Button onClick={handleSyncDevices} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Sync Devices
          </Button>
          <Button variant="outline" onClick={handleConnectDevice} className="gap-2">
            <Plus className="h-4 w-4" />
            Connect Device
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Activity className="h-3.5 w-3.5" />
            Last Updated: Just now
          </Badge>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="devices">My Devices</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
          <TabsTrigger value="heart-rate">Heart Rate</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Activity</CardTitle>
                <CardDescription>Your activity metrics for today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300">
                        <Footprints className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Steps</p>
                        <p className="text-2xl font-bold">{todayStats.steps.toLocaleString()}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{progress.steps}% of goal</p>
                  </div>
                  <Progress value={progress.steps} className="h-2" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-orange-100 text-orange-500 dark:bg-orange-900 dark:text-orange-300">
                        <Flame className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Calories Burned</p>
                        <p className="text-2xl font-bold">{todayStats.caloriesBurned.toLocaleString()}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{progress.caloriesBurned}% of goal</p>
                  </div>
                  <Progress value={progress.caloriesBurned} className="h-2" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-green-100 text-green-500 dark:bg-green-900 dark:text-green-300">
                        <Activity className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Active Minutes</p>
                        <p className="text-2xl font-bold">{todayStats.activeMinutes}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{progress.activeMinutes}% of goal</p>
                  </div>
                  <Progress value={progress.activeMinutes} className="h-2" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-purple-100 text-purple-500 dark:bg-purple-900 dark:text-purple-300">
                        <Moon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Sleep</p>
                        <p className="text-2xl font-bold">{todayStats.sleep} hrs</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{progress.sleep}% of goal</p>
                  </div>
                  <Progress value={progress.sleep} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Your activity trends for the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    steps: {
                      label: "Steps",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[250px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={healthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-steps)" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="var(--color-steps)" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="date" />
                      <YAxis />

                      <Area
                        type="monotone"
                        dataKey="steps"
                        stroke="var(--color-steps)"
                        fillOpacity={1}
                        fill="url(#colorSteps)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Heart Rate</CardTitle>
                  <Heart className="h-5 w-5 text-red-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-[150px]">
                  <div className="text-4xl font-bold">{todayStats.heartRate}</div>
                  <p className="text-sm text-muted-foreground">BPM (Average)</p>
                </div>
                <ChartContainer
                  config={{
                    heartRate: {
                      label: "Heart Rate",
                      color: "hsl(0, 100%, 65%)",
                    },
                  }}
                  className="h-[100px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={healthData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <Line
                        type="monotone"
                        dataKey="heartRate"
                        stroke="hsl(0, 100%, 65%)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" className="w-full gap-1">
                  View Details <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Sleep</CardTitle>
                  <Moon className="h-5 w-5 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-[150px]">
                  <div className="text-4xl font-bold">{todayStats.sleep}</div>
                  <p className="text-sm text-muted-foreground">Hours (Last Night)</p>
                </div>
                <ChartContainer
                  config={{
                    sleep: {
                      label: "Sleep",
                      color: "hsl(270, 70%, 65%)",
                    },
                  }}
                  className="h-[100px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={healthData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <Line type="monotone" dataKey="sleep" stroke="hsl(270, 70%, 65%)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" className="w-full gap-1">
                  View Details <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Calories</CardTitle>
                  <Flame className="h-5 w-5 text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-[150px]">
                  <div className="text-4xl font-bold">{todayStats.caloriesBurned}</div>
                  <p className="text-sm text-muted-foreground">Calories Burned (Today)</p>
                </div>
                <ChartContainer
                  config={{
                    calories: {
                      label: "Calories",
                      color: "hsl(30, 100%, 65%)",
                    },
                  }}
                  className="h-[100px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={healthData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <Line
                        type="monotone"
                        dataKey="caloriesBurned"
                        stroke="hsl(30, 100%, 65%)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" className="w-full gap-1">
                  View Details <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map((device) => (
              <Card key={device.id} className={device.connected ? "" : "opacity-70"}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{device.name}</CardTitle>
                    {device.connected ? (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      >
                        Connected
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                        Disconnected
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    {device.type} by {device.brand}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Synced</span>
                      <span className="text-sm">{device.lastSync}</span>
                    </div>

                    {device.batteryLevel && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Battery</span>
                          <span className="text-sm">{device.batteryLevel}%</span>
                        </div>
                        <Progress value={device.batteryLevel} className="h-1" />
                      </div>
                    )}
                  </div>
                  {device.imageUrl ? (
                    <Image
                      src={device.imageUrl}
                      alt={device.name}
                      width={300}
                      height={200}
                      className="rounded-md mb-2"
                    />
                  ) : (
                    <div className="bg-gray-200 rounded-md mb-2 flex items-center justify-center"
                         style={{ width: 300, height: 200 }}>
                      <p className="text-gray-500">Image not available</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    Settings
                  </Button>
                  {device.connected ? (
                    <Button variant="outline" size="sm">
                      Sync
                    </Button>
                  ) : (
                    <Button size="sm">Connect</Button>
                  )}
                </CardFooter>
              </Card>
            ))}

            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center h-[200px] p-6">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Connect New Device</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Add a new fitness tracker or smartwatch to your account
                </p>
                <Button onClick={handleConnectDevice} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Device
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Compatible Devices</CardTitle>
              <CardDescription>Fitness trackers and smartwatches that work with Fitness Buddy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-muted">
                    <Watch className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Smartwatches</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>Apple Watch (Series 3 and newer)</li>
                      <li>Samsung Galaxy Watch (All models)</li>
                      <li>Garmin Forerunner, Fenix, Venu series</li>
                      <li>Fitbit Sense, Versa series</li>
                      <li>Polar Vantage, Grit X series</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-muted">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Fitness Trackers</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>Fitbit Charge, Inspire, Luxe series</li>
                      <li>Garmin Vivosmart, Vivofit series</li>
                      <li>Xiaomi Mi Band (5 and newer)</li>
                      <li>Whoop Strap (3.0 and newer)</li>
                      <li>Amazon Halo Band</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Compatible Devices
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Trends</CardTitle>
              <CardDescription>Your activity metrics over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  steps: {
                    label: "Steps",
                    color: "hsl(var(--chart-1))",
                  },
                  activeMinutes: {
                    label: "Active Minutes",
                    color: "hsl(var(--chart-2))",
                  },
                  caloriesBurned: {
                    label: "Calories Burned",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[350px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={healthData} margin={{ top: 20, right: 20, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />

                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="steps"
                      stroke="var(--color-steps)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="activeMinutes"
                      stroke="var(--color-activeMinutes)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="caloriesBurned"
                      stroke="var(--color-caloriesBurned)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sleep" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Analysis</CardTitle>
              <CardDescription>Your sleep patterns over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  sleep: {
                    label: "Sleep Duration (hours)",
                    color: "hsl(270, 70%, 65%)",
                  },
                }}
                className="h-[350px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={healthData} margin={{ top: 20, right: 20, left: 20, bottom: 10 }}>
                    <defs>
                      <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(270, 70%, 65%)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(270, 70%, 65%)" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />

                    <Area
                      type="monotone"
                      dataKey="sleep"
                      stroke="hsl(270, 70%, 65%)"
                      fillOpacity={1}
                      fill="url(#colorSleep)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heart-rate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Heart Rate Monitoring</CardTitle>
              <CardDescription>Your heart rate patterns over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  heartRate: {
                    label: "Heart Rate (BPM)",
                    color: "hsl(0, 100%, 65%)",
                  },
                }}
                className="h-[350px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={healthData} margin={{ top: 20, right: 20, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis domain={[50, 100]} />

                    <Line
                      type="monotone"
                      dataKey="heartRate"
                      stroke="hsl(0, 100%, 65%)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
