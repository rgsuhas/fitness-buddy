"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

interface Workout {
  id: string
  title: string
  description: string
  level: "beginner" | "intermediate" | "advanced"
  duration: number
  category: string
  imageUrl: string
  rating: number
}

export function FeaturedWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch('/data/exercises.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setWorkouts(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch workouts:", err);
        setError(true);
        setLoading(false);
        toast.error("Error loading workouts", {
          description: "Please try again later.",
        });
      }
    };

    fetchWorkouts();
  }, [toast]);

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Unable to load workouts at this moment.</p>
        <button
          onClick={() => {
            setLoading(true)
            setError(false)
            // Retry logic would go here
          }}
          className="mt-4 text-primary hover:underline"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {loading
        ? Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-[200px] w-full" />
              <CardHeader className="p-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </CardFooter>
            </Card>
          ))
        : workouts.map((workout) => (
            <Link href={`/workouts/${workout.id}`} key={workout.id} className="group">
              <Card className="overflow-hidden transition-all duration-200 hover:shadow-md h-full flex flex-col">
                <div className="relative h-[200px] w-full">
                  <Image
                    src={workout.imageUrl || "/placeholder.svg"}
                    alt={workout.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-all duration-300 group-hover:scale-105"
                  />
                </div>
                <CardHeader className="p-4 flex-grow">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{workout.title}</CardTitle>
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
                  </div>
                  <CardDescription className="line-clamp-2">{workout.description}</CardDescription>
                </CardHeader>
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
                    {workout.rating}
                  </div>
                  <div className="text-muted-foreground">
                    {workout.duration} min · {workout.category}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
    </div>
  )
}

