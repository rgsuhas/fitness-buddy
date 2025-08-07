"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Bookmark, Share2, Play, Target, Zap, Clock } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface Exercise {
  id: string
  name: string
  muscleGroup: string
  equipment: string
  difficulty: string
  description: string
  instructions: string[]
  tips: string[]
  imageUrl?: string
}

export default function ExerciseDetailPage() {
  const params = useParams()
  const router = useRouter()
  
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [loading, setLoading] = useState(false) // Changed to false for immediate loading
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const fetchExerciseDetails = async () => {
      try {
        setLoading(true)
        // Remove artificial delay - load immediately

        // Mock data for demonstration
        const mockExercise: Exercise = {
          id: params.id as string,
          name:
            params.id === "ex1"
              ? "Barbell Bench Press"
              : params.id === "ex2"
                ? "Pull-ups"
                : params.id === "ex3"
                  ? "Squat"
                  : "Exercise",
          muscleGroup:
            params.id === "ex1" ? "Chest" : params.id === "ex2" ? "Back" : params.id === "ex3" ? "Legs" : "Full Body",
          equipment:
            params.id === "ex1"
              ? "Barbell"
              : params.id === "ex2"
                ? "Bodyweight"
                : params.id === "ex3"
                  ? "Barbell"
                  : "None",
          difficulty:
            params.id === "ex1"
              ? "intermediate"
              : params.id === "ex2"
                ? "intermediate"
                : params.id === "ex3"
                  ? "intermediate"
                  : "beginner",
          description:
            params.id === "ex1"
              ? "A compound exercise that primarily targets the chest muscles, with secondary involvement of the shoulders and triceps."
              : params.id === "ex2"
                ? "A bodyweight exercise that targets the back and biceps, requiring significant upper body strength."
                : params.id === "ex3"
                  ? "A fundamental lower body exercise that targets the quadriceps, hamstrings, and glutes."
                  : "A comprehensive exercise targeting multiple muscle groups.",
          instructions: [
            "Start with proper form and warm-up",
            "Maintain controlled movement throughout",
            "Focus on breathing and muscle engagement",
            "Complete the recommended sets and reps",
            "Allow adequate rest between sets",
          ],
          tips: [
            "Keep your core engaged throughout the movement",
            "Maintain proper form over heavy weight",
            "Listen to your body and adjust as needed",
            "Consider working with a spotter for safety",
          ],
          imageUrl: params.id === "ex1" ? "/images/workout-1.jpg" : params.id === "ex2" ? "/images/workout-2.jpg" : params.id === "ex3" ? "/images/workout-3.jpg" : "/images/workout-4.jpg",
        }

        setExercise(mockExercise)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch exercise details:", error)
        toast.error("Failed to load exercise details")
        setLoading(false)
      }
    }

    fetchExerciseDetails()
  }, [params.id])

  const handleSave = () => {
    setSaved(!saved)
    toast.success(saved ? "Removed from favorites" : "Added to favorites", {
      description: saved ? "Exercise removed from your favorites." : "Exercise added to your favorites.",
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Link copied to clipboard", {
      description: "Share this exercise with others!",
    })
  }

  if (loading) {
    return (
      <div className="container py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[400px] w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    )
  }

  if (!exercise) {
    return (
      <div className="container py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Exercise Not Found</h1>
          <p>The exercise you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Button onClick={() => router.push("/exercises")} className="mt-4">
            Back to Exercises
          </Button>
        </div>
      </div>
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{exercise.name}</h1>
          <p className="text-muted-foreground">{exercise.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleSave}>
            <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
          </Button>
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exercise Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Muscle Group</p>
                    <p className="text-sm text-muted-foreground">{exercise.muscleGroup}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Equipment</p>
                    <p className="text-sm text-muted-foreground">{exercise.equipment}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Difficulty</p>
                    <Badge className={`${getDifficultyColor(exercise.difficulty)} capitalize`}>
                      {exercise.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2">
                {exercise.instructions.map((instruction, index) => (
                  <li key={index} className="text-sm">{instruction}</li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {exercise.tips.map((tip, index) => (
                  <li key={index} className="text-sm">{tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exercise Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden relative group">
                <Image
                  src={exercise.imageUrl || "/placeholder.svg?height=400&width=600"}
                  alt={exercise.name}
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-[400px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Start Workout</CardTitle>
              <CardDescription>Begin your workout with this exercise</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg">
                <Play className="mr-2 h-4 w-4" />
                Start Exercise
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

