"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { SearchIcon, Filter, ChevronRight } from "lucide-react"
import { PlaceholderImage } from "@/components/ui/placeholder-image"

interface Exercise {
  id: string
  name: string
  muscleGroup: string
  equipment: string
  difficulty: "beginner" | "intermediate" | "advanced"
  videoUrl?: string
  imageUrl: string
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
  const [loading, setLoading] = useState(true)
  const [exercises, setExercises] = useState<Exercise[]>([])

  useEffect(() => {
    // Fetch exercises from JSON file
    const fetchExercises = async () => {
      try {
        // Simulating network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

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
  }, [toast])

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesMuscle = selectedMuscleGroup === "All" || exercise.muscleGroup === selectedMuscleGroup
    const matchesEquipment = selectedEquipment === "All" || exercise.equipment === selectedEquipment
    const matchesDifficulty = selectedDifficulty === "All" || exercise.difficulty === selectedDifficulty.toLowerCase()
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "beginner" && exercise.difficulty === "beginner") ||
      (activeTab === "intermediate" && exercise.difficulty === "intermediate") ||
      (activeTab === "advanced" && exercise.difficulty === "advanced")

    return matchesSearch && matchesMuscle && matchesEquipment && matchesDifficulty && matchesTab
  })

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Exercise Library</h1>
        <p className="text-muted-foreground">
          Browse and discover exercises with detailed instructions and video demonstrations
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
            <SelectTrigger className="w-full sm:w-[180px]">
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
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Equipment" />
            </SelectTrigger>
            <SelectContent>
              {equipmentOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Levels</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Exercises</TabsTrigger>
          <TabsTrigger value="beginner">Beginner</TabsTrigger>
          <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {renderExercises(filteredExercises, loading)}
        </TabsContent>

        <TabsContent value="beginner" className="mt-6">
          {renderExercises(filteredExercises, loading)}
        </TabsContent>

        <TabsContent value="intermediate" className="mt-6">
          {renderExercises(filteredExercises, loading)}
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          {renderExercises(filteredExercises, loading)}
        </TabsContent>
      </Tabs>
    </div>
  )

  function renderExercises(exercises: Exercise[], loading: boolean) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="h-[200px] w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (exercises.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          <SearchIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No exercises found</h3>
          <p className="text-sm">Try adjusting your search or filter criteria</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setSearchQuery("")
            setSelectedMuscleGroup("All")
            setSelectedEquipment("All")
            setSelectedDifficulty("All")
            setActiveTab("all")
          }}
        >
          Clear Filters
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {exercises.map((exercise) => (
        <Link href={`/exercises/${exercise.id}`} key={exercise.id} className="group">
          <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="h-[200px] overflow-hidden">
              {exercise.imageUrl ? (
                <Image
                  src={exercise.imageUrl}
                  alt={exercise.name}
                  width={300}
                  height={200}
                  className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                />
              ) : (
                <PlaceholderImage width={300} height={200} className="group-hover:scale-105" />
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium group-hover:text-primary transition-colors">{exercise.name}</h3>
              <div className="flex items-center justify-between mt-2">
                <Badge variant="outline">{exercise.muscleGroup}</Badge>
                <Badge
                  variant={
                    exercise.difficulty === "beginner"
                      ? "secondary"
                      : exercise.difficulty === "intermediate"
                        ? "default"
                        : "destructive"
                  }
                  className="capitalize"
                >
                  {exercise.difficulty}
                </Badge>
              </div>
              <CardDescription className="mt-2 flex items-center justify-between">
                <span>{exercise.equipment}</span>
                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
}

