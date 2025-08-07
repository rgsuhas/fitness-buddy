"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { LoadingSpinner } from "./loading-spinner"

interface Workout {
  id: string
  title: string
  description: string
  level: "beginner" | "intermediate" | "advanced"
  duration: number
  category: string
  imageUrl: string
  aiGenerated?: boolean
}

export function WorkoutRecommendations() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Remove artificial delay for better UX
        
        // Mock data - in production, this would be an API call
        const mockWorkouts: Workout[] = [
          {
            id: "rec1",
            title: "Upper Body Focus",
            description: "Tailored for your strength goals with progressive resistance",
            level: "intermediate",
            duration: 45,
            category: "Strength",
            imageUrl: "/images/workout-1.jpg",
          },
          {
            id: "rec2",
            title: "HIIT Recovery",
            description: "Low-impact but effective high-intensity interval training",
            level: "beginner",
            duration: 30,
            category: "Cardio",
            imageUrl: "/images/workout-2.jpg",
            aiGenerated: true,
          },
          {
            id: "rec3",
            title: "Mobility & Flexibility",
            description: "Improve range of motion and prevent injuries",
            level: "beginner",
            duration: 25,
            category: "Recovery",
            imageUrl: "/images/workout-3.jpg",
          },
        ]
        
        setWorkouts(mockWorkouts)
      } catch (err) {
        console.error("Failed to fetch workout recommendations:", err)
        setError("Failed to load recommendations")
        toast.error("Failed to load workout recommendations")
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  const handleGenerateCustomWorkout = () => {
    toast.info("Custom workout generation", {
      description: "This feature will be available soon!",
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h3 className="text-lg font-medium">Personalized for your goals</h3>
            <p className="text-sm text-muted-foreground">Based on your activity level and preferences</p>
          </div>
          <Button disabled>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Custom Workout
          </Button>
        </div>
        <LoadingSpinner text="Loading recommendations..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h3 className="text-lg font-medium">Personalized for your goals</h3>
            <p className="text-sm text-muted-foreground">Based on your activity level and preferences</p>
          </div>
          <Button onClick={handleGenerateCustomWorkout}>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Custom Workout
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h3 className="text-lg font-medium">Personalized for your goals</h3>
          <p className="text-sm text-muted-foreground">Based on your activity level and preferences</p>
        </div>
        <Button onClick={handleGenerateCustomWorkout}>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Custom Workout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workouts.map((workout) => (
          <Link href={`/workouts/${workout.id}`} key={workout.id} className="group">
            <Card className="overflow-hidden transition-all duration-200 hover:shadow-md h-full flex flex-col">
              <div className="relative h-[200px] overflow-hidden">
                <Image
                  src={workout.imageUrl || "/placeholder.svg"}
                  alt={workout.title}
                  layout="fill"
                  objectFit="cover"
                  className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                />
                {workout.aiGenerated && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="gap-1 bg-primary/10 backdrop-blur-sm">
                      <Sparkles className="h-3 w-3" />
                      AI Generated
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4 flex-grow">
                <CardTitle className="text-lg mb-1">{workout.title}</CardTitle>
                <CardDescription className="line-clamp-2">{workout.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between text-sm">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-yellow-500 mr-1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                  4.8
                </div>
                <div className="text-muted-foreground">
                  {workout.duration} min · {workout.category}
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
