"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { Play, Pause, SkipForward, Volume2, VolumeX } from "lucide-react"

interface MeditationSession {
  id: string
  title: string
  description: string
  duration: number
  category: "focus" | "calm" | "sleep" | "stress"
  audioUrl?: string
}

const mockSessions: MeditationSession[] = [
  {
    id: "1",
    title: "Morning Mindfulness",
    description: "Start your day with clarity and purpose",
    duration: 10,
    category: "focus",
  },
  {
    id: "2",
    title: "Stress Relief",
    description: "Release tension and find your center",
    duration: 15,
    category: "stress",
  },
  {
    id: "3",
    title: "Deep Sleep",
    description: "Prepare your mind and body for restful sleep",
    duration: 20,
    category: "sleep",
  },
  {
    id: "4",
    title: "Anxiety Reducer",
    description: "Calm your nervous system and reduce anxiety",
    duration: 12,
    category: "calm",
  },
  {
    id: "5",
    title: "Focus Booster",
    description: "Enhance concentration and mental clarity",
    duration: 8,
    category: "focus",
  },
  {
    id: "6",
    title: "Evening Wind Down",
    description: "Transition from day to evening with ease",
    duration: 15,
    category: "calm",
  },
]

const breathingExercises = [
  {
    id: "1",
    title: "4-7-8 Breathing",
    description: "Inhale for 4 seconds, hold for 7, exhale for 8",
    steps: [
      "Find a comfortable seated position",
      "Inhale quietly through your nose for 4 seconds",
      "Hold your breath for 7 seconds",
      "Exhale completely through your mouth for 8 seconds",
      "Repeat the cycle 3-4 times",
    ],
  },
  {
    id: "2",
    title: "Box Breathing",
    description: "Equal parts inhale, hold, exhale, and hold",
    steps: [
      "Sit upright with good posture",
      "Inhale through your nose for 4 seconds",
      "Hold your breath for 4 seconds",
      "Exhale through your mouth for 4 seconds",
      "Hold your breath for 4 seconds before inhaling again",
      "Repeat for 5-10 minutes",
    ],
  },
  {
    id: "3",
    title: "Diaphragmatic Breathing",
    description: "Deep belly breathing for relaxation",
    steps: [
      "Lie on your back with knees bent",
      "Place one hand on your chest and the other on your abdomen",
      "Breathe in slowly through your nose, feeling your abdomen rise",
      "Exhale slowly through pursed lips",
      "Focus on the movement of your abdomen rather than your chest",
      "Continue for 5-10 minutes",
    ],
  },
]

export default function MindfulnessPage() {
  const [activeTab, setActiveTab] = useState("meditation")
  const [activeSession, setActiveSession] = useState<MeditationSession | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const startSession = (session: MeditationSession) => {
    setActiveSession(session)
    setIsPlaying(true)
    setProgress(0)
    setTimeRemaining(session.duration * 60)
    
    toast.success("Meditation started", {
        description: "Enjoy your session.",
      })
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
    
    toast.info(isPlaying ? "Session Paused" : "Session Resumed")
  }

  const endSession = () => {
    setIsPlaying(false)
    setActiveSession(null)
    setProgress(0)
    
    toast.success("Session Completed", {
      description: "Great job completing your mindfulness practice!",
    })
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // Simulate progress updates when session is playing
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isPlaying && activeSession) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            endSession()
            if (interval) clearInterval(interval)
            return 0
          }
          return prev - 1
        })
        
        setProgress(prev => {
          const newProgress = prev + (100 / (activeSession.duration * 60))
          return Math.min(newProgress, 100)
        })
      }, 1000)
    } else if (interval) {
      clearInterval(interval)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, activeSession])

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Mindfulness</h1>
        <p className="text-muted-foreground">
          Cultivate awareness and reduce stress with guided practices
        </p>
      </div>

      <Tabs defaultValue="meditation" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="meditation">Meditation</TabsTrigger>
          <TabsTrigger value="breathing">Breathing Exercises</TabsTrigger>
        </TabsList>

        <TabsContent value="meditation" className="mt-6">
          {activeSession ? (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{activeSession.title}</CardTitle>
                <CardDescription>{activeSession.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{formatTime(timeRemaining)}</span>
                  </div>
                  <Progress value={progress} />
                </div>
                
                <div className="flex justify-center space-x-4">
                  <Button variant="outline" size="icon" onClick={toggleMute}>
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Button onClick={togglePlayPause}>
                    {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                    {isPlaying ? "Pause" : "Resume"}
                  </Button>
                  <Button variant="outline" onClick={endSession}>
                    <SkipForward className="mr-2 h-4 w-4" />
                    End
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSessions.map((session) => (
              <Card key={session.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{session.title}</CardTitle>
                  <CardDescription>{session.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-muted-foreground">{session.duration} minutes</span>
                    <span className="capitalize text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {session.category}
                    </span>
                  </div>
                  <Button className="w-full" onClick={() => startSession(session)}>
                    <Play className="mr-2 h-4 w-4" />
                    Start Session
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="breathing" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {breathingExercises.map((exercise) => (
              <Card key={exercise.id}>
                <CardHeader>
                  <CardTitle>{exercise.title}</CardTitle>
                  <CardDescription>{exercise.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Instructions:</h3>
                    <ol className="list-decimal pl-5 space-y-1">
                      {exercise.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
