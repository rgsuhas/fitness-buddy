"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { ArrowLeft, Play, Bookmark, Share2, ThumbsUp } from "lucide-react"

interface Exercise {
  id: string
  name: string
  muscleGroup: string
  equipment: string
  difficulty: "beginner" | "intermediate" | "advanced"
  description: string
  instructions: string[]
  videoUrl?: string
  imageUrl: string
  relatedExercises: {
    id: string
    name: string
    imageUrl: string
  }[]
}

export default function ExerciseDetailPage() {
  const params = useParams()
  const router = useRouter()
  
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const fetchExerciseDetails = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

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
            "This exercise is a compound movement that targets multiple muscle groups and is essential for building strength and muscle mass.",
          instructions: [
            "Start by positioning yourself correctly with proper form",
            "Engage your core and maintain a neutral spine throughout the movement",
            "Perform the movement with controlled tempo, focusing on the muscle contraction",
            "Exhale during the exertion phase and inhale during the return phase",
            "Complete the recommended number of repetitions while maintaining proper form",
          ],
          videoUrl: "https://example.com/video.mp4",
          imageUrl: "/images/workout-" + ((Number.parseInt(params.id as string, 10) % 4) + 1) + ".jpg",
          relatedExercises: [
            {
              id: "ex4",
              name: "Shoulder Press",
              imageUrl: "/images/workout-1.jpg",
            },
            {
              id: "ex5",
              name: "Bicep Curl",
              imageUrl: "/images/workout-2.jpg",
            },
            {
              id: "ex6",
              name: "Plank",
              imageUrl: "/images/workout-3.jpg",
            },
          ],
        }

        setExercise(mockExercise)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch exercise details:", error)
        toast.error("Failed to add exercise", {
        description: "There was an error adding the exercise. Please try again.",
      })
        setLoading(false)
      }
    }

    if (params.id) {
      fetchExerciseDetails()
    }
  }, [params.id, toast])

  const handleSaveExercise = () => {
    setSaved(!saved)
    toast({
      title: saved ? "Exercise removed" : "Exercise saved",
      description: saved ? "Exercise removed from your saved list" : "Exercise added to your saved list",
    })
  }

  const handleAddToWorkout = () => {
    toast.success("Exercise added", {
        description: "This exercise has been added to your workout plan.",
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>

        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!exercise) {
    return (
      <div className="container py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Exercise Not Found</h1>
        </div>
        <p>The exercise you're looking for doesn't exist or has been removed.</p>
        <Button className="mt-4" onClick={() => router.push("/exercises")}>
          Back to Exercises
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Go back">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{exercise.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-lg overflow-hidden relative group">
          <img
            src={exercise.imageUrl || "/placeholder.svg?height=400&width=600"}
            alt={exercise.name}
            className="w-full h-[400px] object-cover"
          />
          {exercise.videoUrl && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
              <Button size="lg" className="gap-2">
                <Play className="h-5 w-5" />
                Watch Video
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-sm">
              {exercise.muscleGroup}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {exercise.equipment}
            </Badge>
            <Badge
              variant={
                exercise.difficulty === "beginner"
                  ? "secondary"
                  : exercise.difficulty === "intermediate"
                    ? "default"
                    : "destructive"
              }
              className="text-sm capitalize"
            >
              {exercise.difficulty}
            </Badge>
          </div>

          <p className="text-muted-foreground">{exercise.description}</p>

          <div className="flex flex-wrap gap-2 pt-4">
            <Button onClick={handleAddToWorkout} className="gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                <line x1="6" y1="1" x2="6" y2="4"></line>
                <line x1="10" y1="1" x2="10" y2="4"></line>
                <line x1="14" y1="1" x2="14" y2="4"></line>
              </svg>
              Add to Workout
            </Button>

            <Button variant="outline" onClick={handleSaveExercise} className="gap-2">
              <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
              {saved ? "Saved" : "Save"}
            </Button>

            <Button variant="ghost" size="icon" aria-label="Share exercise">
              <Share2 className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon" aria-label="Like exercise">
              <ThumbsUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="instructions" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
          <TabsTrigger value="related">Related Exercises</TabsTrigger>
        </TabsList>

        <TabsContent value="instructions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Step-by-Step Instructions</CardTitle>
              <CardDescription>Follow these steps to perform the exercise correctly</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4 list-decimal list-inside">
                {exercise.instructions.map((instruction, index) => (
                  <li key={index} className="pl-2">
                    <span className="font-medium text-lg mr-2">{index + 1}.</span>
                    {instruction}
                  </li>
                ))}
              </ol>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Always consult with a fitness professional if you're unsure about proper form.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="related" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {exercise.relatedExercises.map((relatedExercise) => (
              <Card key={relatedExercise.id} className="overflow-hidden">
                <div className="h-[200px] overflow-hidden">
                  <img
                    src={relatedExercise.imageUrl || "/placeholder.svg?height=200&width=300"}
                    alt={relatedExercise.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{relatedExercise.name}</CardTitle>
                </CardHeader>
                <CardFooter className="p-4 pt-0">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push(`/exercises/${relatedExercise.id}`)}
                  >
                    View Exercise
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

