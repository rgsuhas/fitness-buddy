"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts"
import { Battery, Bluetooth, BluetoothOff, RefreshCw, Watch } from "lucide-react"
import { toast } from "sonner"
import { handleApiError } from "@/lib/error-handler"

interface WearableDevice {
  id: string
  name: string
  type: string
  brand: string
  lastSync: string
  connected: boolean
  batteryLevel: number
  imageUrl: string
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
  
  const [loading, setLoading] = useState(false) // Changed to false for immediate loading
  const [devices, setDevices] = useState<WearableDevice[]>([])
  const [healthData, setHealthData] = useState<HealthData[]>([])
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Remove artificial delay - load immediately

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
            batteryLevel: 0,
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
  }, [])

  const handleSyncDevices = () => {
    setLoading(true)

    // Remove artificial delay - sync immediately
    setLoading(false)
    toast.success("Devices Synced", {
      description: "Your wearable devices have been synced successfully.",
    })
  }

  if (loading) {
    return (
      <div className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-48 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wearables</h1>
          <p className="text-muted-foreground">Connect and manage your fitness devices</p>
        </div>
        <Button onClick={handleSyncDevices} disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Sync Devices
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="health">Health Data</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Connected Devices</CardTitle>
                <Watch className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{devices.filter(d => d.connected).length}</div>
                <p className="text-xs text-muted-foreground">of {devices.length} total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today&apos;s Steps</CardTitle>
                <Watch className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthData[6]?.steps.toLocaleString() || "0"}</div>
                <p className="text-xs text-muted-foreground">+12% from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
                <Watch className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthData[6]?.caloriesBurned.toLocaleString() || "0"}</div>
                <p className="text-xs text-muted-foreground">+8% from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Minutes</CardTitle>
                <Watch className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthData[6]?.activeMinutes || "0"}</div>
                <p className="text-xs text-muted-foreground">Goal: 60 minutes</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Steps</CardTitle>
                <CardDescription>Your daily step count for the week</CardDescription>
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
                    <BarChart data={healthData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="steps" fill="var(--color-steps)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Heart Rate Trend</CardTitle>
                <CardDescription>Your resting heart rate over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    heartRate: {
                      label: "BPM",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[250px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={healthData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="heartRate"
                        stroke="var(--color-heartRate)"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {devices.map((device) => (
              <Card key={device.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{device.name}</CardTitle>
                      <CardDescription>{device.brand} • {device.type}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {device.connected ? (
                        <Bluetooth className="h-4 w-4 text-green-500" />
                      ) : (
                        <BluetoothOff className="h-4 w-4 text-red-500" />
                      )}
                      <Badge variant={device.connected ? "default" : "secondary"}>
                        {device.connected ? "Connected" : "Disconnected"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Battery</span>
                    <div className="flex items-center gap-2">
                      <Battery className="h-4 w-4" />
                      <span className="text-sm font-medium">{device.batteryLevel}%</span>
                    </div>
                  </div>
                  <Progress value={device.batteryLevel} className="h-2" />
                  <div className="text-sm text-muted-foreground">
                    Last sync: {device.lastSync}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Analysis</CardTitle>
              <CardDescription>Your sleep patterns and quality</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  sleep: {
                    label: "Hours",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[250px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={healthData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="sleep" fill="var(--color-sleep)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
