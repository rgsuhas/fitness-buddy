"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface WorkoutSession {
  id: string
  date: Date
  workout: string
  duration: string
  type: "strength" | "cardio" | "flexibility" | "other"
}

const workoutTypes = [
  { value: "strength", label: "Strength Training" },
  { value: "cardio", label: "Cardio" },
  { value: "flexibility", label: "Flexibility" },
  { value: "other", label: "Other" },
]

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [sessions, setSessions] = useState<WorkoutSession[]>([
    {
      id: "1",
      date: new Date(),
      workout: "Full Body Workout",
      duration: "60",
      type: "strength",
    },
    {
      id: "2",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      workout: "HIIT Cardio",
      duration: "30",
      type: "cardio",
    },
  ])
  const [isAddingSession, setIsAddingSession] = useState(false)
  const [editingSession, setEditingSession] = useState<WorkoutSession | null>(null)
  const [newSession, setNewSession] = useState<Partial<WorkoutSession>>({
    workout: "",
    duration: "",
    type: "strength",
  })
  

  const handleAddSession = () => {
    if (!newSession.workout || !newSession.duration || !newSession.type) {
      toast.error("Error", {
        description: "Please fill in all fields",
      })
      return
    }

    const session: WorkoutSession = {
      id: Math.random().toString(36).substring(7),
      date: selectedDate,
      workout: newSession.workout,
      duration: newSession.duration,
      type: newSession.type as "strength" | "cardio" | "flexibility" | "other",
    }

    setSessions([...sessions, session])
    setNewSession({ workout: "", duration: "", type: "strength" })
    setIsAddingSession(false)
    toast.success("Success", {
      description: "Workout session added",
    })
  }

  const handleEditSession = () => {
    if (!editingSession) return

    setSessions(
      sessions.map((session) =>
        session.id === editingSession.id ? editingSession : session
      )
    )
    setEditingSession(null)
    toast.success("Success", {
      description: "Workout session updated",
    })
  }

  const handleDeleteSession = (id: string) => {
    setSessions(sessions.filter((session) => session.id !== id))
    toast.success("Success", {
      description: "Workout session deleted",
    })
  }

  const getSessionsByDate = (date: Date) => {
    if (!date) return []
    return sessions.filter(
      (session) =>
        format(session.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    )
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "strength":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "cardio":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "flexibility":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date: Date | undefined) => date && setSelectedDate(date)}
              className="rounded-md border shadow"
              defaultMonth={new Date(2025, 3)} // April 2025 (months are 0-indexed)
              fromYear={2025}
              toYear={2026}
              captionLayout="dropdown"
              showOutsideDays={true}
              fixedWeeks={true}
              ISOWeek={false}
              classNames={{
                caption: "flex justify-center pt-1 relative items-center text-lg font-bold",
                month: "space-y-4",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-10 font-normal text-[0.8rem] flex-1 text-center",
                row: "flex w-full mt-2",
                cell: "h-10 w-10 text-center text-sm p-0 relative flex-1 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: cn(buttonVariants({ variant: "ghost" }), "h-10 w-10 p-0 font-normal aria-selected:opacity-100"),
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
              }}
            />
            <div className="mt-4">
              <Dialog open={isAddingSession} onOpenChange={setIsAddingSession}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Workout
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Workout Session</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label>Workout Name</label>
                      <Input
                        value={newSession.workout}
                        onChange={(e) =>
                          setNewSession({ ...newSession, workout: e.target.value })
                        }
                        placeholder="e.g., Full Body Workout"
                      />
                    </div>
                    <div className="space-y-2">
                      <label>Duration (minutes)</label>
                      <Input
                        type="number"
                        value={newSession.duration}
                        onChange={(e) =>
                          setNewSession({ ...newSession, duration: e.target.value })
                        }
                        placeholder="e.g., 60"
                      />
                    </div>
                    <div className="space-y-2">
                      <label>Type</label>
                      <Select
                        value={newSession.type}
                        onValueChange={(value) =>
                          setNewSession({ ...newSession, type: value as any })
                        }
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
                    <Button className="w-full" onClick={handleAddSession}>
                      Add Session
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              Workouts for {format(selectedDate, "MMMM d, yyyy")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getSessionsByDate(selectedDate).length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No workouts scheduled for this day
                </p>
              ) : (
                getSessionsByDate(selectedDate).map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{session.workout}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                            session.type
                          )}`}
                        >
                          {
                            workoutTypes.find((t) => t.value === session.type)
                              ?.label
                          }
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {session.duration} minutes
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Dialog
                        open={editingSession?.id === session.id}
                        onOpenChange={() =>
                          setEditingSession(
                            editingSession?.id === session.id ? null : session
                          )
                        }
                      >
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Workout Session</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <label>Workout Name</label>
                              <Input
                                value={editingSession?.workout}
                                onChange={(e) =>
                                  setEditingSession({
                                    ...editingSession!,
                                    workout: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <label>Duration (minutes)</label>
                              <Input
                                type="number"
                                value={editingSession?.duration}
                                onChange={(e) =>
                                  setEditingSession({
                                    ...editingSession!,
                                    duration: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <label>Type</label>
                              <Select
                                value={editingSession?.type}
                                onValueChange={(value) =>
                                  setEditingSession({
                                    ...editingSession!,
                                    type: value as any,
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
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
                            <Button
                              className="w-full"
                              onClick={handleEditSession}
                            >
                              Save Changes
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSession(session.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}