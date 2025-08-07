"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Filter, DumbbellIcon as DumbellIcon, Target, Zap } from "lucide-react"
import { toast } from "sonner"

interface Exercise {
  id: string
  name: string
  muscleGroup: string
  equipment: string
  difficulty: string
  imageUrl?: string
}

const muscleGroups = ["All", "Chest", "Back", "Shoulders", "Arms", "Abs", "Legs", "Full Body"]

const equipmentOptions = [
  "All",
  "Bodyweight",
  "Dumbbells",
  "Barbell",
  "Kettlebell",
  "Resistance Bands",
  "Machine",
  "Cable",
]

export default function ExercisesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("All")
  const [selectedEquipment, setSelectedEquipment] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(false) // Changed to false for immediate loading
  const [exercises, setExercises] = useState<Exercise[]>([])

  useEffect(() => {
    // Fetch exercises from JSON file
    const fetchExercises = async () => {
      try {
        setLoading(true)
        // Remove artificial delay - load immediately

        // Fetch from the JSON file
        const response = await fetch('/data/exercises.json')
        const data = await response.json()
        
        // Transform the data to match our interface
        const transformedExercises = data.map((exercise: any) => ({
          id: exercise.id,
          name: exercise.title,
          muscleGroup: exercise.category === "Core" ? "Abs" : exercise.category,
          equipment: exercise.category === "Strength" ? "Dumbbells" : "Bodyweight",
          difficulty: exercise.level,
          imageUrl: exercise.imageUrl,
        }))
        
        setExercises(transformedExercises)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch exercises:", error)
        toast.error("Failed to load exercises")
        setLoading(false)
      }
    }

    fetchExercises()
  }, [])

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesMuscleGroup = selectedMuscleGroup === "All" || exercise.muscleGroup === selectedMuscleGroup
    const matchesEquipment = selectedEquipment === "All" || exercise.equipment === selectedEquipment
    const matchesDifficulty = selectedDifficulty === "All" || exercise.difficulty === selectedDifficulty

    return matchesSearch && matchesMuscleGroup && matchesEquipment && matchesDifficulty
  })

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
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-48 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Exercise Library</h1>
        <p className="text-muted-foreground">Browse and discover exercises for your workouts</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Muscle Group" />
          </SelectTrigger>
          <SelectContent>
            {muscleGroups.map((group) => (
              <SelectItem key={group} value={group}>
                {group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Equipment" />
          </SelectTrigger>
          <SelectContent>
            {equipmentOptions.map((equipment) => (
              <SelectItem key={equipment} value={equipment}>
                {equipment}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Exercises</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="recent">Recently Viewed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredExercises.length} of {exercises.length} exercises
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredExercises.map((exercise) => (
              <Link key={exercise.id} href={`/exercises/${exercise.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {exercise.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {exercise.muscleGroup} • {exercise.equipment}
                        </CardDescription>
                      </div>
                      <Badge className={`${getDifficultyColor(exercise.difficulty)} capitalize`}>
                        {exercise.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Target className="h-4 w-4" />
                      <span>{exercise.muscleGroup}</span>
                      <DumbellIcon className="h-4 w-4 ml-2" />
                      <span>{exercise.equipment}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {filteredExercises.length === 0 && (
            <div className="text-center py-12">
              <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No exercises found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters to find what you&apos;re looking for.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="space-y-6">
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No favorite exercises yet</h3>
            <p className="text-muted-foreground">
              Start browsing exercises and add your favorites to see them here.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <div className="text-center py-12">
            <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No recently viewed exercises</h3>
            <p className="text-muted-foreground">
              Start exploring exercises to build your recent activity.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

