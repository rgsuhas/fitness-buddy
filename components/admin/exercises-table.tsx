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
import { EditIcon, EyeIcon, MoreHorizontal, PlusCircleIcon, TrashIcon, VideoIcon } from "lucide-react"

interface Exercise {
  id: string
  name: string
  muscleGroup: string
  equipment: string
  difficulty: "beginner" | "intermediate" | "advanced"
  videoAvailable: boolean
  featured: boolean
}

export function ExercisesTable() {
  const { toast } = useToast()

  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: "ex1",
      name: "Barbell Bench Press",
      muscleGroup: "Chest",
      equipment: "Barbell",
      difficulty: "intermediate",
      videoAvailable: true,
      featured: true,
    },
    {
      id: "ex2",
      name: "Pull-ups",
      muscleGroup: "Back",
      equipment: "Bodyweight",
      difficulty: "intermediate",
      videoAvailable: true,
      featured: true,
    },
    {
      id: "ex3",
      name: "Squat",
      muscleGroup: "Legs",
      equipment: "Barbell",
      difficulty: "intermediate",
      videoAvailable: true,
      featured: true,
    },
    {
      id: "ex4",
      name: "Shoulder Press",
      muscleGroup: "Shoulders",
      equipment: "Dumbbells",
      difficulty: "intermediate",
      videoAvailable: false,
      featured: false,
    },
    {
      id: "ex5",
      name: "Bicep Curl",
      muscleGroup: "Arms",
      equipment: "Dumbbells",
      difficulty: "beginner",
      videoAvailable: true,
      featured: false,
    },
    {
      id: "ex6",
      name: "Plank",
      muscleGroup: "Abs",
      equipment: "Bodyweight",
      difficulty: "beginner",
      videoAvailable: true,
      featured: true,
    },
    {
      id: "ex7",
      name: "Deadlift",
      muscleGroup: "Back",
      equipment: "Barbell",
      difficulty: "advanced",
      videoAvailable: true,
      featured: true,
    },
  ])

  const handleToggleFeatured = (exerciseId: string) => {
    setExercises(
      exercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          const newFeatured = !exercise.featured

          toast({
            title: newFeatured ? "Added to featured" : "Removed from featured",
            description: `${exercise.name} has been ${newFeatured ? "added to" : "removed from"} featured exercises.`,
          })

          return {
            ...exercise,
            featured: newFeatured,
          }
        }
        return exercise
      }),
    )
  }

  const handleDeleteExercise = (exerciseId: string) => {
    const exercise = exercises.find((e) => e.id === exerciseId)

    if (exercise) {
      setExercises(exercises.filter((e) => e.id !== exerciseId))

      toast({
        title: "Exercise deleted",
        description: `${exercise.name} has been deleted from the library.`,
      })
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button>
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Add Exercise
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Exercise</TableHead>
              <TableHead>Muscle Group</TableHead>
              <TableHead>Equipment</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exercises.map((exercise) => (
              <TableRow key={exercise.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {exercise.name}
                    {exercise.videoAvailable && <VideoIcon className="h-4 w-4 text-blue-500" />}
                  </div>
                </TableCell>
                <TableCell>{exercise.muscleGroup}</TableCell>
                <TableCell>{exercise.equipment}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  {exercise.featured ? (
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    >
                      Featured
                    </Badge>
                  ) : (
                    <Badge variant="outline">Regular</Badge>
                  )}
                </TableCell>
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
                            title: "View exercise",
                            description: "Viewing exercise details (demo).",
                          })
                        }}
                      >
                        <EyeIcon className="mr-2 h-4 w-4" />
                        <span>View Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          toast({
                            title: "Edit exercise",
                            description: "Editing exercise details (demo).",
                          })
                        }}
                      >
                        <EditIcon className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleFeatured(exercise.id)}>
                        {exercise.featured ? (
                          <>
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
                              <circle cx="12" cy="12" r="10" />
                              <line x1="8" y1="12" x2="16" y2="12" />
                            </svg>
                            <span>Remove from Featured</span>
                          </>
                        ) : (
                          <>
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
                              <circle cx="12" cy="12" r="10" />
                              <line x1="12" y1="8" x2="12" y2="16" />
                              <line x1="8" y1="12" x2="16" y2="12" />
                            </svg>
                            <span>Add to Featured</span>
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteExercise(exercise.id)}
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

