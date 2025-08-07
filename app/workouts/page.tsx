"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Star, Clock, Target, Zap } from "lucide-react"
import { toast } from "sonner"

interface Workout {
  id: string
  title: string
  description: string
  level: string
  duration: string
  category: string
  imageUrl?: string
  rating?: number
}

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(false) // Changed to false for immediate loading
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true)
        // Remove artificial delay - load immediately
        
        // Fetch from exercises.json and transform to workouts
        const response = await fetch('/data/exercises.json')
        const data = await response.json()
        
        const transformedWorkouts = data.map((exercise: any) => ({
          id: exercise.id,
          title: exercise.title,
          description: exercise.description,
          level: exercise.level,
          duration: exercise.duration,
          category: exercise.category,
          imageUrl: exercise.imageUrl,
          rating: exercise.rating,
        }))
        
        setWorkouts(transformedWorkouts)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch workouts:", error)
        toast.error("Failed to load workouts")
        setLoading(false)
      }
    }

    fetchWorkouts()
  }, [])

  const filteredWorkouts = workouts.filter((workout) => {
    const matchesSearch = workout.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = selectedLevel === "All" || workout.level === selectedLevel
    const matchesCategory = selectedCategory === "All" || workout.category === selectedCategory

    return matchesSearch && matchesLevel && matchesCategory
  })

  const getLevelColor = (level: string) => {
    switch (level) {
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

  if (loading) {
    return (
      <div className="container py-6 space-y-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-64 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Workout Library</h1>
        <p className="text-muted-foreground">Discover and explore curated workout routines</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search workouts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            <SelectItem value="Strength">Strength</SelectItem>
            <SelectItem value="Cardio">Cardio</SelectItem>
            <SelectItem value="Flexibility">Flexibility</SelectItem>
            <SelectItem value="Core">Core</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredWorkouts.length} of {workouts.length} workouts
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredWorkouts.map((workout) => (
          <Link key={workout.id} href={`/workouts/${workout.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {workout.title}
                    </CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {workout.description}
                    </CardDescription>
                  </div>
                  <Badge className={`${getLevelColor(workout.level)} capitalize`}>
                    {workout.level}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{workout.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      <span>{workout.category}</span>
                    </div>
                  </div>
                  {workout.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{workout.rating}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredWorkouts.length === 0 && (
        <div className="text-center py-12">
          <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No workouts found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or filters to find what you&apos;re looking for.
          </p>
        </div>
      )}
    </div>
  )
} 