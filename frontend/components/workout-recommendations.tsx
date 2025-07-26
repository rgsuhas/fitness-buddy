"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Sparkles } from "lucide-react"

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
  const { toast } = useToast()

  // TODO: Add API endpoint: GET /api/workouts/recommendations
  // Expected response: { workouts: Workout[] }
  // This should fetch personalized workout recommendations based on user preferences
  const [workouts, setWorkouts] = useState<Workout[]>([
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
  ])

  const handleGenerateCustomWorkout = async () => {
    try {
      toast({
        title: "Generating workout...",
        description: "Our AI is creating a personalized workout plan for you.",
        variant: "default",
      })

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/workouts/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPreferences: {
            fitnessLevel: 'intermediate',
            goals: ['strength', 'endurance'],
            equipment: ['dumbbells', 'bodyweight'],
            timeAvailable: 50
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate workout')
      }

      const data = await response.json()
      setWorkouts([data, ...workouts])

      toast({
        title: "Custom workout created!",
        description: "Your personalized workout plan is now ready.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error generating workout:", error)
      toast({
        title: "Generation failed",
        description: "We couldn't generate a custom workout. Please try again later.",
        variant: "destructive",
      })
    }
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
              <CardFooter className="p-4 pt-0 flex justify-between text-sm border-t">
                <Badge
                  variant={
                    workout.level === "beginner"
                      ? "secondary"
                      : workout.level === "intermediate"
                        ? "default"
                        : "destructive"
                  }
                >
                  {workout.level}
                </Badge>
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
