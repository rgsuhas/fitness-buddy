"use client"

import { useState } from "react"

interface WorkoutSession {
  day: string
  workout: string
  duration: string
}

const initialSchedule: WorkoutSession[] = [
  { day: "Monday", workout: "Full Body Workout", duration: "60 minutes" },
  { day: "Wednesday", workout: "Upper Body Strength", duration: "45 minutes" },
  { day: "Friday", workout: "Cardio and Core", duration: "30 minutes" },
]

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<WorkoutSession[]>(initialSchedule)

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Workout Schedule</h1>
      <div className="space-y-4">
        {schedule.map((session, index) => (
          <div
            key={index}
            className="rounded-lg border p-4 shadow-sm bg-white"
          >
            <h2 className="text-xl font-semibold">{session.day}</h2>
            <p className="text-muted-foreground">{session.workout}</p>
            <p className="text-muted-foreground">{session.duration}</p>
          </div>
        ))}
      </div>
    </div>
  )
}