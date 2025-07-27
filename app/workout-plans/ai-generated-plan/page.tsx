"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Calendar, Download, Edit, Printer, Save, Share2, Sparkles } from "lucide-react"
import { handleApiError } from "@/lib/error-handler"

interface WorkoutPlan {
  id: string
  title: string
  description: string
  level: "beginner" | "intermediate" | "advanced"
  duration: string
  goal: string
  schedule: {
    day: string
    title: string
    description: string
    warmup: string[]
    exercises: { name: string; reps: number; sets: number }[]
    cooldown: string[]
  }[]
  notes: string
  aiGenerated: boolean
}

export default function AIGeneratedPlanPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null)
  const [activeDay, setActiveDay] = useState("day1")

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock data
        const mockWorkoutPlan: WorkoutPlan = {
          id: "ai-plan-1",
          title: "Personalized Strength & Hypertrophy Program",
          description:
            "This AI-generated workout plan is designed to help you build muscle and strength with a focus on progressive overload. The plan includes a mix of compound and isolation exercises targeting your selected muscle groups.",
          level: "intermediate",
          duration: "8 weeks",
          goal: "Build Muscle & Strength",
          schedule: [
            {
              day: "day1",
              title: "Day 1: Upper Body Push",
              description: "Focus on chest, shoulders, and triceps with compound movements and isolation exercises.",
              warmup: [
                "5 minutes of light cardio (jogging, jumping jacks, etc.)",
                "Arm circles and shoulder rotations",
                "Push-up progression (5-10 reps)",
              ],
              exercises: [
                {
                  name: "Barbell Bench Press",
                  sets: 4,
                  reps: 6,
                },
                {
                  name: "Seated Dumbbell Shoulder Press",
                  sets: 3,
                  reps: 8,
                },
                {
                  name: "Incline Dumbbell Press",
                  sets: 3,
                  reps: 8,
                },
                {
                  name: "Cable Tricep Pushdown",
                  sets: 3,
                  reps: 10,
                },
                {
                  name: "Lateral Raises",
                  sets: 3,
                  reps: 12,
                },
              ],
              cooldown: [
                "Chest stretch (30 seconds per side)",
                "Tricep stretch (30 seconds per arm)",
                "Shoulder stretch (30 seconds per side)",
              ],
            },
            {
              day: "day2",
              title: "Day 2: Lower Body",
              description: "Focus on quadriceps, hamstrings, glutes and calves with compound movements.",
              warmup: [
                "5 minutes of light cardio (stationary bike, elliptical, etc.)",
                "Bodyweight squats (10-15 reps)",
                "Walking lunges (10 steps each leg)",
              ],
              exercises: [
                {
                  name: "Barbell Back Squat",
                  sets: 4,
                  reps: 6,
                },
                {
                  name: "Romanian Deadlift",
                  sets: 3,
                  reps: 8,
                },
                {
                  name: "Leg Press",
                  sets: 3,
                  reps: 10,
                },
                {
                  name: "Walking Lunges",
                  sets: 3,
                  reps: 12,
                },
                {
                  name: "Standing Calf Raises",
                  sets: 4,
                  reps: 15,
                },
              ],
              cooldown: [
                "Quad stretch (30 seconds per leg)",
                "Hamstring stretch (30 seconds per leg)",
                "Calf stretch (30 seconds per leg)",
              ],
            },
            {
              day: "day3",
              title: "Day 3: Rest or Active Recovery",
              description: "Take a complete rest day or engage in light activities like walking, swimming, or yoga.",
              warmup: [],
              exercises: [],
              cooldown: [],
            },
            {
              day: "day4",
              title: "Day 4: Upper Body Pull",
              description: "Focus on back and biceps with a mix of vertical and horizontal pulling movements.",
              warmup: [
                "5 minutes of light cardio",
                "Arm circles and scapular retractions",
                "Band pull-aparts (10-15 reps)",
              ],
              exercises: [
                {
                  name: "Pull-ups or Assisted Pull-ups",
                  sets: 4,
                  reps: 6,
                },
                {
                  name: "Seated Cable Row",
                  sets: 3,
                  reps: 8,
                },
                {
                  name: "Single-Arm Dumbbell Row",
                  sets: 3,
                  reps: 10,
                },
                {
                  name: "Barbell or Dumbbell Bicep Curls",
                  sets: 3,
                  reps: 10,
                },
                {
                  name: "Face Pulls",
                  sets: 3,
                  reps: 12,
                },
              ],
              cooldown: [
                "Lat stretch (30 seconds per side)",
                "Bicep stretch (30 seconds per arm)",
                "Upper back stretch (30 seconds)",
              ],
            },
            {
              day: "day5",
              title: "Day 5: Lower Body & Core",
              description: "Second lower body day with a focus on different movement patterns and core strength.",
              warmup: [
                "5 minutes of light cardio",
                "Glute bridges (10-15 reps)",
                "Bodyweight lunges (10 reps each leg)",
              ],
              exercises: [
                {
                  name: "Deadlift",
                  sets: 4,
                  reps: 5,
                },
                {
                  name: "Bulgarian Split Squats",
                  sets: 3,
                  reps: 8,
                },
                {
                  name: "Leg Curls",
                  sets: 3,
                  reps: 10,
                },
                {
                  name: "Hanging Leg Raises",
                  sets: 3,
                  reps: 10,
                },
                {
                  name: "Plank",
                  sets: 3,
                  reps: 30,
                },
              ],
              cooldown: [
                "Hip flexor stretch (30 seconds per side)",
                "Lower back stretch (30 seconds)",
                "Full body stretch (1-2 minutes)",
              ],
            },
          ],
          notes:
            "Progressive overload is key to success with this program. Aim to increase weight or reps each week. Make sure to track your workouts and adjust as needed based on your recovery. Ensure you're consuming adequate protein (1.6-2.2g per kg of bodyweight) and calories to support muscle growth. Get 7-9 hours of quality sleep each night for optimal recovery.",
          aiGenerated: true,
        }

        setWorkoutPlan(mockWorkoutPlan)
        setLoading(false)
      } catch (error) {
        handleApiError(error, toast, {
          title: "Error loading workout plan",
          fallbackMessage: "Failed to load your workout plan. Please try again later.",
        })
        setLoading(false)
      }
    }

    fetchWorkoutPlan()
  }, [toast])

  const handleSaveWorkout = () => {
    toast({
      title: "Workout Plan Saved",
      description: "Your workout plan has been saved to your account.",
    })
  }

  const handlePrintWorkout = () => {
    window.print()
  }

  const handleDownloadWorkout = () => {
    toast({
      title: "Workout Plan Downloaded",
      description: "Your workout plan has been downloaded as a PDF.",
    })
  }

  const handleShareWorkout = () => {
    toast({
      title: "Share Link Created",
      description: "A shareable link has been copied to your clipboard.",
    })
  }

  if (loading) {
    return (
      <div className="container py-8 space-y-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Skeleton className="h-8 w-1/3" />
        </div>

        <div className="space-y-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>

          <Skeleton className="h-[500px] w-full" />
        </div>
      </div>
    )
  }

  if (!workoutPlan) {
    return (
      <div className="container py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Workout Plan Not Found</h1>
        </div>
        <p>The workout plan you're looking for doesn't exist or has been removed.</p>
        <Button className="mt-4" onClick={() => router.push("/workout-plans")}>
          Back to Workout Plans
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{workoutPlan.title}</h1>
        {workoutPlan.aiGenerated && (
          <Badge variant="secondary" className="ml-2 gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            AI Generated
          </Badge>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{workoutPlan.goal}</Badge>
            <Badge
              variant={
                workoutPlan.level === "beginner"
                  ? "secondary"
                  : workoutPlan.level === "intermediate"
                    ? "default"
                    : "destructive"
              }
              className="capitalize"
            >
              {workoutPlan.level}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {workoutPlan.duration}
            </Badge>
          </div>
          <p className="text-muted-foreground">{workoutPlan.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-1" onClick={handleSaveWorkout}>
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button variant="outline" size="sm" className="gap-1" onClick={handlePrintWorkout}>
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" className="gap-1" onClick={handleDownloadWorkout}>
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" size="sm" className="gap-1" onClick={handleShareWorkout}>
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="gap-1" onClick={() => router.push("/workout-plans/edit")}>
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeDay} onValueChange={setActiveDay} className="space-y-4">
        <div className="overflow-x-auto pb-2">
          <TabsList className="inline-flex w-auto">
            {workoutPlan.schedule.map((day) => (
              <TabsTrigger key={day.day} value={day.day}>
                {day.title.split(":")[0]}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {workoutPlan.schedule.map((day) => (
          <TabsContent key={day.day} value={day.day} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{day.title}</CardTitle>
                <CardDescription>{day.description}</CardDescription>
              </CardHeader>

              {day.exercises.length > 0 ? (
                <CardContent className="space-y-6">
                  {day.warmup.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Warm-up</h3>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {day.warmup.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Main Workout</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-4">Exercise</th>
                            <th className="text-center py-2 px-4">Sets</th>
                            <th className="text-center py-2 px-4">Reps</th>
                          </tr>
                        </thead>
                        <tbody>
                          {day.exercises.map((exercise, index) => (
                            <tr key={index} className="border-b">
                              <td className="py-3 px-4 font-medium">{exercise.name}</td>
                              <td className="py-3 px-4 text-center">{exercise.sets}</td>
                              <td className="py-3 px-4 text-center">{exercise.reps}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {day.cooldown.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Cool-down</h3>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {day.cooldown.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              ) : (
                <CardContent>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-medium mb-2">Rest Day</h3>
                    <p className="text-muted-foreground">{day.description}</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Program Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{workoutPlan.notes}</p>
        </CardContent>
      </Card>
    </div>
  )
}

