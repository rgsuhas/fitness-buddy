"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { SearchIcon, Filter, Play, Bookmark, Share2 } from "lucide-react"

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

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        
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

  if (loading) {
    return (
      <div className="container py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Workouts</h1>
          <p className="text-muted-foreground">Discover and explore workout routines</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Skeleton className="h-10 w-full pl-9" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[180px]" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-[200px] w-full" />
              <CardHeader className="p-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Workouts</h1>
        <p className="text-muted-foreground">Discover and explore workout routines</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workouts..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
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
              <SelectItem value="Core">Core</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredWorkouts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <SearchIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No workouts found</h3>
            <p className="text-sm">Try adjusting your search or filter criteria</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("")
              setSelectedLevel("All")
              setSelectedCategory("All")
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWorkouts.map((workout) => (
            <Card key={workout.id} className="overflow-hidden group">
              <div className="relative h-[200px] overflow-hidden">
                <Image
                  src={workout.imageUrl}
                  alt={workout.title}
                  width={300}
                  height={200}
                  className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button size="icon" variant="secondary" className="h-8 w-8">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="h-8 w-8">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardHeader className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg line-clamp-1">{workout.title}</CardTitle>
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
              <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {workout.duration} min • {workout.category}
                  </div>
                  <Button size="sm">
                    <Play className="mr-2 h-3 w-3" />
                    Start
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 