"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { handleFormError } from "@/lib/error-handler"

const workoutPlanFormSchema = z.object({
  goal: z.string({
    required_error: "Please select a fitness goal.",
  }),
  fitnessLevel: z.string({
    required_error: "Please select your fitness level.",
  }),
  daysPerWeek: z
    .number({
      required_error: "Please select how many days per week you can workout.",
    })
    .min(1)
    .max(7),
  sessionDuration: z
    .number({
      required_error: "Please select your preferred workout duration.",
    })
    .min(15)
    .max(120),
  equipment: z.array(z.string()).optional(),
  focusAreas: z.array(z.string()).min(1, {
    message: "Please select at least one focus area.",
  }),
  injuries: z.string().optional(),
  preferences: z.string().optional(),
})

type WorkoutPlanFormValues = z.infer<typeof workoutPlanFormSchema>

export default function AIWorkoutGeneratorPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)

  const form = useForm<WorkoutPlanFormValues>({
    resolver: zodResolver(workoutPlanFormSchema),
    defaultValues: {
      goal: "",
      fitnessLevel: "",
      daysPerWeek: 3,
      sessionDuration: 45,
      equipment: [],
      focusAreas: [],
      injuries: "",
      preferences: "",
    },
  })

  const equipmentOptions = [
    { id: "none", label: "No Equipment (Bodyweight Only)" },
    { id: "dumbbells", label: "Dumbbells" },
    { id: "barbell", label: "Barbell" },
    { id: "kettlebell", label: "Kettlebell" },
    { id: "resistance-bands", label: "Resistance Bands" },
    { id: "pull-up-bar", label: "Pull-up Bar" },
    { id: "bench", label: "Bench" },
    { id: "cable-machine", label: "Cable Machine" },
    { id: "smith-machine", label: "Smith Machine" },
    { id: "full-gym", label: "Full Gym Access" },
  ]

  const focusAreaOptions = [
    { id: "full-body", label: "Full Body" },
    { id: "upper-body", label: "Upper Body" },
    { id: "lower-body", label: "Lower Body" },
    { id: "core", label: "Core" },
    { id: "chest", label: "Chest" },
    { id: "back", label: "Back" },
    { id: "shoulders", label: "Shoulders" },
    { id: "arms", label: "Arms" },
    { id: "legs", label: "Legs" },
    { id: "glutes", label: "Glutes" },
    { id: "cardio", label: "Cardio" },
  ]

  async function onSubmit(data: WorkoutPlanFormValues) {
    try {
      setIsGenerating(true)

      // Log the form data
      console.log("Workout Plan Form Data:", data)

      // Simulate API call to AI service
      await new Promise((resolve) => setTimeout(resolve, 3000))

      toast({
        title: "Workout Plan Generated!",
        description: "Your personalized AI workout plan is ready.",
      })

      // Navigate to the generated plan
      router.push("/workout-plans/ai-generated-plan")
    } catch (error) {
      handleFormError(error, toast, undefined, {
        title: "Generation Failed",
        fallbackMessage: "Failed to generate your workout plan. Please try again later.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">AI Workout Plan Generator</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>Create Your Personalized Workout Plan</CardTitle>
          </div>
          <CardDescription>
            Our AI will generate a custom workout plan based on your goals, fitness level, and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Fitness Goal</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your main goal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="build-muscle">Build Muscle</SelectItem>
                          <SelectItem value="lose-weight">Lose Weight</SelectItem>
                          <SelectItem value="increase-strength">Increase Strength</SelectItem>
                          <SelectItem value="improve-endurance">Improve Endurance</SelectItem>
                          <SelectItem value="enhance-flexibility">Enhance Flexibility</SelectItem>
                          <SelectItem value="general-fitness">General Fitness</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>This helps us tailor your workout plan to your specific goals.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fitnessLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fitness Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your fitness level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner (New to exercise)</SelectItem>
                          <SelectItem value="intermediate">Intermediate (Some experience)</SelectItem>
                          <SelectItem value="advanced">Advanced (Experienced)</SelectItem>
                          <SelectItem value="athlete">Athlete (Very experienced)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This helps us adjust the intensity and complexity of your workouts.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="daysPerWeek"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Days Per Week: {field.value}</FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={7}
                          step={1}
                          defaultValue={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                      <FormDescription>How many days per week can you commit to working out?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sessionDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Session Duration: {field.value} minutes</FormLabel>
                      <FormControl>
                        <Slider
                          min={15}
                          max={120}
                          step={5}
                          defaultValue={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                      <FormDescription>How long can you workout in a single session?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="equipment"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Available Equipment</FormLabel>
                      <FormDescription>Select the equipment you have access to for your workouts.</FormDescription>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {equipmentOptions.map((option) => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="equipment"
                          render={({ field }) => {
                            return (
                              <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), option.id])
                                        : field.onChange(field.value?.filter((value) => value !== option.id))
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{option.label}</FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="focusAreas"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Focus Areas</FormLabel>
                      <FormDescription>Select the areas you want to focus on in your workout plan.</FormDescription>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {focusAreaOptions.map((option) => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="focusAreas"
                          render={({ field }) => {
                            return (
                              <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), option.id])
                                        : field.onChange(field.value?.filter((value) => value !== option.id))
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{option.label}</FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="injuries"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Injuries or Limitations (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="E.g., lower back pain, shoulder injury, knee problems..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Let us know about any injuries or limitations so we can adapt your plan.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Preferences (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="E.g., prefer HIIT workouts, enjoy outdoor activities, dislike burpees..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Any other preferences you'd like us to consider when creating your plan.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isGenerating} className="gap-2">
                  {isGenerating ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Workout Plan
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

