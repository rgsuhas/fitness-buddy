"use client"

import { WorkoutRecommendations } from "@/components/workout-recommendations"

export default function WorkoutPage() {
  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Workout Plans</h1>
        <p className="text-muted-foreground mt-2">
          Discover personalized workout plans tailored to your goals
        </p>
      </div>
      <WorkoutRecommendations />
    </div>
  )
}
