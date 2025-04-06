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
import { useToast } from "@/components/ui/use-toast"
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
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("All")
  const [selectedEquipment, setSelectedEquipment] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(true)
  const [exercises, setExercises] = useState<Exercise[]>([])

  useEffect(() => {
    // Simulate API call to fetch exercises
    const fetchExercises = async () => {
      try {
        // Simulating network delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock data
        setExercises([
          {
            id: "ex1",
            name: "Barbell Bench Press",
            muscleGroup: "Chest",
            equipment: "Barbell",
            difficulty: "intermediate",
            imageUrl: "/placeholder.svg?height=200&width=300",
          },
          {
            id: "ex2",
            name: "Pull-ups",
            muscleGroup: "Back",
            equipment: "Bodyweight",
            difficulty: "intermediate",
            imageUrl: "/placeholder.svg?height=200&width=300",
          },
          {
            id: "ex3",
            name: "Squat",
            muscleGroup: "Legs",
            equipment: "Barbell",
            difficulty: "intermediate",
            imageUrl: "/placeholder.svg?height=200&width=300",
          },
          {
            id: "ex4",
            name: "Shoulder Press",
            muscleGroup: "Shoulders",
            equipment: "Dumbbells",
            difficulty: "intermediate",
            imageUrl: "/placeholder.svg?height=200&width=300",
          },
          {
            id: "ex5",
            name: "Bicep Curl",
            muscleGroup: "Arms",
            equipment: "Dumbbells",
            difficulty: "beginner",
            imageUrl: "/placeholder.svg?height=200&width=300",
          },
          {
            id: "ex6",
            name: "Plank",
            muscleGroup: "Abs",
            equipment: "Bodyweight",
            difficulty: "beginner",
            imageUrl: "/placeholder.svg?height=200&width=300",
          },
          {
            id: "ex7",
            name: "Deadlift",
            muscleGroup: "Back",
            equipment: "Barbell",
            difficulty: "advanced",
            imageUrl: "/placeholder.svg?height=200&width=300",
          },
          {
            id: "ex8",
            name: "Push-ups",
            muscleGroup: "Chest",
            equipment: "Bodyweight",
            difficulty: "beginner",
            imageUrl: "/placeholder.svg?height=200&width=300",
          },
          {
            id: "ex9",
            name: "Leg Press",
            muscleGroup: "Legs",
            equipment: "Machine",
            difficulty: "beginner",
            imageUrl: "/placeholder.svg?height=200&width=300",
          },
          {
            id: "ex10",
            name: "Tricep Dips",
            muscleGroup: "Arms",
            equipment: "Bodyweight",
            difficulty: "intermediate",
            imageUrl: "/placeholder.svg?height=200&width=300",
          },
          {
            id: "ex11",
            name: "Crunches",
            muscleGroup: "Abs",
            equipment: "Bodyweight",
            difficulty: "beginner",
            imageUrl: "/placeholder.svg?height=200&width=300",
          },
          {
            id: "ex12",
            name: "Lateral Raise",
            muscleGroup: "Shoulders",
            equipment: "Dumbbells",
            difficulty: "beginner",
            imageUrl: "/placeholder.svg?height=200&width=300",
          },
        ])
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch exercises:", error)
        toast({
          title: "Error loading exercises",
          description: "Please try again later.",
          variant: "destructive",
        })
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
}

function renderExercises(exercises: Exercise[], loading: boolean) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="h-[200px] w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (exercises.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No exercises found</h3>
        <p className="text-muted-foreground mt-1">Try adjusting your filters or search query</p>
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

