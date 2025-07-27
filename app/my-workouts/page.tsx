"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/hooks/use-user"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { Clock, Dumbbell, Plus, Play, Edit, Trash2, BarChart3, Calendar } from "lucide-react"

// Define TypeScript interfaces for our data structures
interface Exercise {
  name: string;
  sets: number;
  reps: number | string;
  weight: string | number;
}

interface Workout {
  id: string;
  name: string;
  description: string;
  type: string;
  duration: number;
  exercises: Exercise[];
  createdAt: string;
}

// Sample workout data
const sampleWorkouts: Workout[] = [
  {
    id: "1",
    name: "Full Body Strength",
    description: "A complete full body workout targeting all major muscle groups",
    type: "strength",
    duration: 45,
    exercises: [
      { name: "Squats", sets: 3, reps: 12, weight: "Body weight" },
      { name: "Push-ups", sets: 3, reps: 15, weight: "Body weight" },
      { name: "Dumbbell Rows", sets: 3, reps: 12, weight: "20 lbs" },
      { name: "Lunges", sets: 3, reps: 10, weight: "Body weight" },
      { name: "Shoulder Press", sets: 3, reps: 12, weight: "15 lbs" },
    ],
    createdAt: "2025-03-15",
  },
  {
    id: "2",
    name: "HIIT Cardio",
    description: "High intensity interval training to boost cardio fitness and burn calories",
    type: "cardio",
    duration: 30,
    exercises: [
      { name: "Jumping Jacks", sets: 1, reps: "30 seconds", weight: "N/A" },
      { name: "Mountain Climbers", sets: 1, reps: "30 seconds", weight: "N/A" },
      { name: "Burpees", sets: 1, reps: "30 seconds", weight: "N/A" },
      { name: "High Knees", sets: 1, reps: "30 seconds", weight: "N/A" },
      { name: "Rest", sets: 1, reps: "15 seconds", weight: "N/A" },
      { name: "Repeat 4 times", sets: 4, reps: "Circuit", weight: "N/A" },
    ],
    createdAt: "2025-03-20",
  },
  {
    id: "3",
    name: "Core Crusher",
    description: "Focused abdominal and core workout to build strength and definition",
    type: "strength",
    duration: 20,
    exercises: [
      { name: "Plank", sets: 3, reps: "45 seconds", weight: "Body weight" },
      { name: "Crunches", sets: 3, reps: 20, weight: "Body weight" },
      { name: "Russian Twists", sets: 3, reps: 16, weight: "10 lbs" },
      { name: "Leg Raises", sets: 3, reps: 12, weight: "Body weight" },
      { name: "Mountain Climbers", sets: 3, reps: "30 seconds", weight: "Body weight" },
    ],
    createdAt: "2025-03-25",
  },
];

// Workout type options
const workoutTypes = [
  { value: "strength", label: "Strength" },
  { value: "cardio", label: "Cardio" },
  { value: "flexibility", label: "Flexibility" },
  { value: "hiit", label: "HIIT" },
  { value: "other", label: "Other" },
];

export default function MyWorkoutsPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  
  const [workouts, setWorkouts] = useState<Workout[]>(sampleWorkouts);
  const [activeTab, setActiveTab] = useState("all");
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [newWorkout, setNewWorkout] = useState<Omit<Workout, 'id' | 'createdAt'>>({
    name: "",
    description: "",
    type: "strength",
    duration: 30,
    exercises: [{ name: "", sets: 3, reps: 10, weight: "" }],
  });

  // Redirect if not logged in
  if (!loading && !user) {
    router.push("/auth/login");
    return null;
  }

  const handleCreateWorkout = () => {
    const workoutWithId = {
      ...newWorkout,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString().split("T")[0],
    };
    
    setWorkouts([workoutWithId, ...workouts]);
    setNewWorkout({
      name: "",
      description: "",
      type: "strength",
      duration: 30,
      exercises: [{ name: "", sets: 3, reps: 10, weight: "" }],
    });
    setIsCreating(false);
    
    toast.success("Workout created", {
        description: "Your new workout has been successfully added.",
      })
  };

  const handleDeleteWorkout = (id: string) => {
    setWorkouts(workouts.filter((workout) => workout.id !== id));
    toast.success("Workout Deleted", {
      description: "Your workout has been deleted.",
    })
  };

  const handleAddExercise = () => {
    setNewWorkout({
      ...newWorkout,
      exercises: [
        ...newWorkout.exercises,
        { name: "", sets: 3, reps: 10, weight: "" },
      ],
    });
  };

  const handleExerciseChange = (index: number, field: keyof Exercise, value: string | number) => {
    const updatedExercises = [...newWorkout.exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value,
    };
    
    setNewWorkout({
      ...newWorkout,
      exercises: updatedExercises,
    });
  };

  const handleRemoveExercise = (index: number) => {
    const updatedExercises = [...newWorkout.exercises];
    updatedExercises.splice(index, 1);
    
    setNewWorkout({
      ...newWorkout,
      exercises: updatedExercises,
    });
  };

  const filteredWorkouts = activeTab === "all" 
    ? workouts 
    : workouts.filter((workout) => workout.type === activeTab);

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Workouts</h1>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Workout</DialogTitle>
              <DialogDescription>
                Design your custom workout routine. Add exercises, sets, and reps.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-4">
                  <Label htmlFor="name">Workout Name</Label>
                  <Input
                    id="name"
                    value={newWorkout.name}
                    onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                    placeholder="e.g., Full Body Strength"
                  />
                </div>
                <div className="col-span-4">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newWorkout.description}
                    onChange={(e) => setNewWorkout({ ...newWorkout, description: e.target.value })}
                    placeholder="Brief description of the workout"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="type">Workout Type</Label>
                  <Select
                    value={newWorkout.type}
                    onValueChange={(value) => setNewWorkout({ ...newWorkout, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {workoutTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newWorkout.duration}
                    onChange={(e) => setNewWorkout({ ...newWorkout, duration: parseInt(e.target.value) })}
                    min={1}
                  />
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <Label>Exercises</Label>
                  <Button variant="outline" size="sm" onClick={handleAddExercise}>
                    <Plus className="h-4 w-4 mr-1" /> Add Exercise
                  </Button>
                </div>
                
                {newWorkout.exercises.map((exercise, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 mb-3 items-end">
                    <div className="col-span-4">
                      <Label htmlFor={`exercise-${index}`} className="text-xs">Exercise</Label>
                      <Input
                        id={`exercise-${index}`}
                        value={exercise.name}
                        onChange={(e) => handleExerciseChange(index, "name", e.target.value)}
                        placeholder="Exercise name"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`sets-${index}`} className="text-xs">Sets</Label>
                      <Input
                        id={`sets-${index}`}
                        type="number"
                        value={exercise.sets}
                        onChange={(e) => handleExerciseChange(index, "sets", parseInt(e.target.value))}
                        min={1}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`reps-${index}`} className="text-xs">Reps</Label>
                      <Input
                        id={`reps-${index}`}
                        value={exercise.reps}
                        onChange={(e) => handleExerciseChange(index, "reps", e.target.value)}
                        placeholder="10"
                      />
                    </div>
                    <div className="col-span-3">
                      <Label htmlFor={`weight-${index}`} className="text-xs">Weight</Label>
                      <Input
                        id={`weight-${index}`}
                        value={exercise.weight}
                        onChange={(e) => handleExerciseChange(index, "weight", e.target.value)}
                        placeholder="lbs or kg"
                      />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveExercise(index)}
                        disabled={newWorkout.exercises.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateWorkout} disabled={!newWorkout.name}>
                Create Workout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="strength">Strength</TabsTrigger>
          <TabsTrigger value="cardio">Cardio</TabsTrigger>
          <TabsTrigger value="flexibility">Flexibility</TabsTrigger>
          <TabsTrigger value="hiit">HIIT</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkouts.map((workout) => (
              <Card key={workout.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle>{workout.name}</CardTitle>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteWorkout(workout.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{workout.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Dumbbell className="mr-1 h-4 w-4" />
                    <span className="capitalize">{workout.type}</span>
                    <span className="mx-2">•</span>
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{workout.duration} min</span>
                  </div>
                  
                  <ScrollArea className="h-[120px] pr-4">
                    <div className="space-y-1">
                      {workout.exercises.map((exercise, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium">{exercise.name}</span>
                          <span className="text-muted-foreground"> - {exercise.sets} sets × {exercise.reps}</span>
                          {exercise.weight && (
                            <span className="text-muted-foreground"> ({exercise.weight})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="pt-3 flex justify-between">
                  <div className="text-xs text-muted-foreground">
                    Created: {workout.createdAt}
                  </div>
                  <Button size="sm">
                    <Play className="mr-2 h-3 w-3" />
                    Start
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredWorkouts.length === 0 && (
            <div className="text-center py-12">
              <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
              <h3 className="mt-4 text-lg font-medium">No workouts found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                You haven't created any {activeTab !== "all" ? activeTab : ""} workouts yet.
              </p>
              <Button className="mt-4" onClick={() => setIsCreating(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Workout
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
