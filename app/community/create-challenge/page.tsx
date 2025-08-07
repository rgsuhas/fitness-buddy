"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

const challengeFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  goal: z.string().min(1, "Goal is required"),
  goalType: z.string().min(1, "Goal type is required"),
  startDate: z.date(),
  endDate: z.date(),
  isPrivate: z.boolean(),
  inviteFriends: z.boolean(),
})

type ChallengeFormValues = z.infer<typeof challengeFormSchema>

export default function CreateChallengePage() {
  const router = useRouter()
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Default form values
  const defaultValues: ChallengeFormValues = {
    title: "",
    description: "",
    category: "",
    goal: "",
    goalType: "",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    isPrivate: false,
    inviteFriends: false,
  }

  const form = useForm<ChallengeFormValues>({
    resolver: zodResolver(challengeFormSchema),
    defaultValues,
  })

  async function onSubmit(data: ChallengeFormValues) {
    try {
      setIsSubmitting(true)

      // Remove artificial delay - submit immediately

      console.log("Challenge data:", data)

      toast.success("Challenge created", {
        description: "Your new challenge has been successfully created.",
      })

      router.push("/community?tab=challenges")
    } catch (error) {
      console.error("Failed to create challenge:", error)
      toast.error("Error creating challenge", {
        description: "Failed to create challenge. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Challenge</h1>
          <p className="text-muted-foreground">Start a new fitness challenge for the community</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Challenge Details</CardTitle>
          <CardDescription>Fill in the details for your new fitness challenge</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Challenge Title</Label>
                <Input
                  id="title"
                  placeholder="Enter challenge title"
                  {...form.register("title")}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => form.setValue("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strength">Strength Training</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="flexibility">Flexibility</SelectItem>
                    <SelectItem value="weight-loss">Weight Loss</SelectItem>
                    <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                    <SelectItem value="endurance">Endurance</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your challenge..."
                className="min-h-[100px]"
                {...form.register("description")}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="goal">Goal</Label>
                <Input
                  id="goal"
                  placeholder="e.g., 100 push-ups"
                  {...form.register("goal")}
                />
                {form.formState.errors.goal && (
                  <p className="text-sm text-red-500">{form.formState.errors.goal.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="goalType">Goal Type</Label>
                <Select onValueChange={(value) => form.setValue("goalType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reps">Repetitions</SelectItem>
                    <SelectItem value="distance">Distance</SelectItem>
                    <SelectItem value="time">Time</SelectItem>
                    <SelectItem value="weight">Weight</SelectItem>
                    <SelectItem value="streak">Streak</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.goalType && (
                  <p className="text-sm text-red-500">{form.formState.errors.goalType.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.watch("startDate") ? (
                        format(form.watch("startDate"), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={form.watch("startDate")}
                      onSelect={(date) => form.setValue("startDate", date || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.watch("endDate") ? (
                        format(form.watch("endDate"), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={form.watch("endDate")}
                      onSelect={(date) => form.setValue("endDate", date || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Private Challenge</Label>
                  <p className="text-sm text-muted-foreground">
                    Only invited friends can join this challenge
                  </p>
                </div>
                <Switch
                  checked={form.watch("isPrivate")}
                  onCheckedChange={(checked) => form.setValue("isPrivate", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Invite Friends</Label>
                  <p className="text-sm text-muted-foreground">
                    Send invitations to your friends
                  </p>
                </div>
                <Switch
                  checked={form.watch("inviteFriends")}
                  onCheckedChange={(checked) => form.setValue("inviteFriends", checked)}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Creating..." : "Create Challenge"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

