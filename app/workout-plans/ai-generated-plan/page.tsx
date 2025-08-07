"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Calendar, Clock, Target, Users, Zap } from "lucide-react"
import { toast } from "sonner"

interface WorkoutPlan {
  id: string
  title: string
  description: string
  level: string
  duration: string
  goal: string
  workouts: {
    [key: string]: {
      day: string
      focus: string
      exercises: Array<{
        name: string
        sets: number
        reps: string
        rest: string
        notes?: string
      }>
    }
  }
}

export default function AIGeneratedPlanPage() {
  const router = useRouter()
  
  const [loading, setLoading] = useState(false) // Changed to false for immediate loading
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null)
  const [activeDay, setActiveDay] = useState("day1")

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      try {
        setLoading(true)
        // Remove artificial delay - load immediately

        // Mock data
        const mockWorkoutPlan: WorkoutPlan = {
          id: "ai-plan-1",
          title: "Personalized Strength & Hypertrophy Program",
          description:
            "This AI-generated workout plan is designed to help you build muscle and strength with a focus on progressive overload. The plan includes a mix of compound and isolation exercises targeting your selected muscle groups.",
          level: "intermediate",
          duration: "8 weeks",
          goal: "Build Muscle & Strength",
          workouts: {
            day1: {
              day: "Day 1 - Push",
              focus: "Chest, Shoulders, Triceps",
              exercises: [
                { name: "Barbell Bench Press", sets: 4, reps: "8-10", rest: "2-3 min" },
                { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", rest: "2 min" },
                { name: "Military Press", sets: 3, reps: "8-10", rest: "2 min" },
                { name: "Dips", sets: 3, reps: "8-12", rest: "1.5 min" },
                { name: "Lateral Raises", sets: 3, reps: "12-15", rest: "1 min" },
                { name: "Tricep Extensions", sets: 3, reps: "12-15", rest: "1 min" },
              ],
            },
            day2: {
              day: "Day 2 - Pull",
              focus: "Back, Biceps",
              exercises: [
                { name: "Deadlifts", sets: 4, reps: "6-8", rest: "3-4 min" },
                { name: "Pull-ups", sets: 3, reps: "8-12", rest: "2 min" },
                { name: "Barbell Rows", sets: 3, reps: "10-12", rest: "2 min" },
                { name: "Lat Pulldowns", sets: 3, reps: "12-15", rest: "1.5 min" },
                { name: "Bicep Curls", sets: 3, reps: "12-15", rest: "1 min" },
                { name: "Hammer Curls", sets: 3, reps: "12-15", rest: "1 min" },
              ],
            },
            day3: {
              day: "Day 3 - Legs",
              focus: "Quadriceps, Hamstrings, Glutes",
              exercises: [
                { name: "Squats", sets: 4, reps: "8-10", rest: "3-4 min" },
                { name: "Romanian Deadlifts", sets: 3, reps: "10-12", rest: "2-3 min" },
                { name: "Leg Press", sets: 3, reps: "12-15", rest: "2 min" },
                { name: "Leg Extensions", sets: 3, reps: "12-15", rest: "1.5 min" },
                { name: "Leg Curls", sets: 3, reps: "12-15", rest: "1.5 min" },
                { name: "Calf Raises", sets: 4, reps: "15-20", rest: "1 min" },
              ],
            },
            day4: {
              day: "Day 4 - Rest",
              focus: "Active Recovery",
              exercises: [
                { name: "Light Stretching", sets: 1, reps: "10-15 min", rest: "N/A" },
                { name: "Foam Rolling", sets: 1, reps: "10-15 min", rest: "N/A" },
                { name: "Light Walking", sets: 1, reps: "20-30 min", rest: "N/A" },
              ],
            },
            day5: {
              day: "Day 5 - Upper Body",
              focus: "Chest, Back, Shoulders",
              exercises: [
                { name: "Incline Bench Press", sets: 4, reps: "8-10", rest: "2-3 min" },
                { name: "Overhead Press", sets: 3, reps: "8-10", rest: "2 min" },
                { name: "Dumbbell Rows", sets: 3, reps: "10-12", rest: "2 min" },
                { name: "Push-ups", sets: 3, reps: "12-20", rest: "1.5 min" },
                { name: "Face Pulls", sets: 3, reps: "12-15", rest: "1 min" },
                { name: "Planks", sets: 3, reps: "30-60 sec", rest: "1 min" },
              ],
            },
            day6: {
              day: "Day 6 - Lower Body",
              focus: "Legs, Core",
              exercises: [
                { name: "Front Squats", sets: 3, reps: "8-10", rest: "3 min" },
                { name: "Bulgarian Split Squats", sets: 3, reps: "10-12", rest: "2 min" },
                { name: "Hip Thrusts", sets: 3, reps: "12-15", rest: "2 min" },
                { name: "Lunges", sets: 3, reps: "12-15", rest: "1.5 min" },
                { name: "Russian Twists", sets: 3, reps: "20-30", rest: "1 min" },
                { name: "Mountain Climbers", sets: 3, reps: "30-45 sec", rest: "1 min" },
              ],
            },
            day7: {
              day: "Day 7 - Rest",
              focus: "Complete Rest",
              exercises: [
                { name: "Complete Rest Day", sets: 1, reps: "Full day", rest: "N/A" },
                { name: "Light Stretching (Optional)", sets: 1, reps: "10-15 min", rest: "N/A" },
              ],
            },
          },
        }

        setWorkoutPlan(mockWorkoutPlan)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch workout plan:", error)
        toast.error("Failed to load workout plan", {
          description: "The workout plan you&apos;re looking for doesn&apos;t exist or has been removed.",
        })
        setLoading(false)
      }
    }

    fetchWorkoutPlan()
  }, [])

  if (loading) {
    return (
      <div className="container py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-6 w-full" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (!workoutPlan) {
    return (
      <div className="container py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Workout Plan Not Found</h1>
          <p>The workout plan you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Button onClick={() => router.push("/workout-plans")} className="mt-4">
            Back to Workout Plans
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{workoutPlan.title}</h1>
          <p className="text-muted-foreground">{workoutPlan.description}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{workoutPlan.level}</div>
            <p className="text-xs text-muted-foreground">Difficulty level</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workoutPlan.duration}</div>
            <p className="text-xs text-muted-foreground">Program length</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goal</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workoutPlan.goal}</div>
            <p className="text-xs text-muted-foreground">Primary objective</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workouts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Days per week</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>Your personalized workout schedule for the week</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeDay} onValueChange={setActiveDay} className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              {Object.keys(workoutPlan.workouts).map((day) => (
                <TabsTrigger key={day} value={day} className="text-xs">
                  {workoutPlan.workouts[day].day.split(" - ")[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.keys(workoutPlan.workouts).map((day) => (
              <TabsContent key={day} value={day} className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{workoutPlan.workouts[day].day}</h3>
                      <p className="text-muted-foreground">Focus: {workoutPlan.workouts[day].focus}</p>
                    </div>
                    <Badge variant="secondary">
                      {workoutPlan.workouts[day].exercises.length} exercises
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {workoutPlan.workouts[day].exercises.map((exercise, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{exercise.name}</h4>
                          {exercise.notes && (
                            <p className="text-sm text-muted-foreground">{exercise.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{exercise.sets} sets</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <span>{exercise.reps}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{exercise.rest}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

