"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { EditIcon, EyeIcon, MoreHorizontal, PlusCircleIcon, SparklesIcon, TrashIcon } from "lucide-react"

interface Workout {
  id: string
  name: string
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  aiGenerated: boolean
  type: "system" | "community"
  createdBy: string
  exercises: number
  popularity: number
}

export function WorkoutsTable() {
  const { toast } = useToast()

  const [workouts, setWorkouts] = useState<Workout[]>([
    {
      id: "w1",
      name: "30-Day Strength Challenge",
      category: "Strength",
      difficulty: "intermediate",
      aiGenerated: false,
      type: "system",
      createdBy: "Fitness Buddy Team",
      exercises: 15,
      popularity: 4800,
    },
    {
      id: "w2",
      name: "HIIT Cardio Blast",
      category: "Cardio",
      difficulty: "advanced",
      aiGenerated: false,
      type: "system",
      createdBy: "Fitness Buddy Team",
      exercises: 12,
      popularity: 3750,
    },
    {
      id: "w3",
      name: "Yoga for Beginners",
      category: "Flexibility",
      difficulty: "beginner",
      aiGenerated: false,
      type: "system",
      createdBy: "Fitness Buddy Team",
      exercises: 10,
      popularity: 6200,
    },
    {
      id: "w4",
      name: "Core Crusher",
      category: "Core",
      difficulty: "intermediate",
      aiGenerated: false,
      type: "system",
      createdBy: "Fitness Buddy Team",
      exercises: 8,
      popularity: 2900,
    },
    {
      id: "w5",
      name: "Custom Full Body Routine",
      category: "Full Body",
      difficulty: "intermediate",
      aiGenerated: true,
      type: "community",
      createdBy: "John Doe",
      exercises: 12,
      popularity: 320,
    },
    {
      id: "w6",
      name: "Summer Shred Workout",
      category: "Weight Loss",
      difficulty: "advanced",
      aiGenerated: true,
      type: "community",
      createdBy: "Sarah Johnson",
      exercises: 10,
      popularity: 540,
    },
  ])

  const handleDeleteWorkout = (workoutId: string) => {
    const workout = workouts.find((w) => w.id === workoutId)

    if (workout) {
      setWorkouts(workouts.filter((w) => w.id !== workoutId))

      toast({
        title: "Workout deleted",
        description: `${workout.name} has been deleted.`,
      })
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button>
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Add Workout
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Workout</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Exercises</TableHead>
              <TableHead>Popularity</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workouts.map((workout) => (
              <TableRow key={workout.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {workout.name}
                    {workout.aiGenerated && <SparklesIcon className="h-4 w-4 text-amber-500" />}
                  </div>
                </TableCell>
                <TableCell>{workout.category}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      workout.difficulty === "beginner"
                        ? "secondary"
                        : workout.difficulty === "intermediate"
                          ? "default"
                          : "destructive"
                    }
                    className="capitalize"
                  >
                    {workout.difficulty}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={workout.type === "system" ? "default" : "outline"}>
                    {workout.type === "system" ? "System" : "Community"}
                  </Badge>
                </TableCell>
                <TableCell>{workout.exercises}</TableCell>
                <TableCell>{workout.popularity.toLocaleString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          toast({
                            title: "View workout",
                            description: "Viewing workout details (demo).",
                          })
                        }}
                      >
                        <EyeIcon className="mr-2 h-4 w-4" />
                        <span>View Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          toast({
                            title: "Edit workout",
                            description: "Editing workout details (demo).",
                          })
                        }}
                      >
                        <EditIcon className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          toast({
                            title: "Feature workout",
                            description: "Workout featured on homepage (demo).",
                          })
                        }}
                      >
                        <svg
                          className="mr-2 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <span>Feature on Homepage</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteWorkout(workout.id)}
                      >
                        <TrashIcon className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

