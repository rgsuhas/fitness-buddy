'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PlaceholderImage } from '@/components/ui/placeholder-image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChevronRight, Trophy, Users, Calendar } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { toast } from "sonner"

interface Challenge {
  id: string
  title: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  participants: number
  imageUrl?: string
  tasks: {
    id: string
    title: string
    completed: boolean
  }[]
  startDate?: string
  progress?: number
}

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: '30-Day Core Challenge',
    description: 'Build a stronger core with daily exercises. Complete daily tasks to strengthen your core muscles.',
    level: 'beginner',
    duration: '30 days',
    participants: 1245,
    tasks: [
      { id: '1-1', title: '20 Crunches', completed: false },
      { id: '1-2', title: '30-second Plank', completed: false },
      { id: '1-3', title: '15 Russian Twists', completed: false },
      { id: '1-4', title: '20 Mountain Climbers', completed: false },
    ],
  },
  {
    id: '2',
    title: 'Full Body Transformation',
    description: 'Complete body workout program designed to transform your physique over 12 weeks.',
    level: 'intermediate',
    duration: '12 weeks',
    participants: 856,
    tasks: [
      { id: '2-1', title: '3 sets of Push-ups', completed: false },
      { id: '2-2', title: '3 sets of Squats', completed: false },
      { id: '2-3', title: '2 sets of Pull-ups', completed: false },
      { id: '2-4', title: 'Core Circuit', completed: false },
    ],
  },
  {
    id: '3',
    title: 'Advanced Strength Training',
    description: 'Push your limits with intense workouts focusing on building maximum strength.',
    level: 'advanced',
    duration: '8 weeks',
    participants: 432,
    tasks: [
      { id: '3-1', title: 'Heavy Deadlifts', completed: false },
      { id: '3-2', title: 'Bench Press', completed: false },
      { id: '3-3', title: 'Power Cleans', completed: false },
      { id: '3-4', title: 'Olympic Lifts', completed: false },
    ],
  },
]

export default function ChallengesPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [enrolledChallenges, setEnrolledChallenges] = useState<string[]>([])
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [challenges, setChallenges] = useState(mockChallenges)
  

  const filteredChallenges = challenges.filter(challenge => {
    if (activeTab === 'all') return true
    return challenge.level === activeTab
  })

  const handleEnroll = (challenge: Challenge) => {
    if (enrolledChallenges.includes(challenge.id)) {
      toast.info("Already Enrolled", {
        description: "You are already participating in this challenge",
      })
      return
    }

    setEnrolledChallenges([...enrolledChallenges, challenge.id])
    const updatedChallenge = {
      ...challenge,
      participants: challenge.participants + 1,
      startDate: new Date().toISOString(),
      progress: 0,
    }
    setChallenges(challenges.map(c => c.id === challenge.id ? updatedChallenge : c))
    toast.success("Successfully Enrolled", {
      description: `You've joined the ${challenge.title} challenge!`,
    })
  }

  const toggleTask = (challengeId: string, taskId: string) => {
    setChallenges(challenges.map(challenge => {
      if (challenge.id === challengeId) {
        const updatedTasks = challenge.tasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
        const completedTasks = updatedTasks.filter(task => task.completed).length
        const progress = (completedTasks / updatedTasks.length) * 100
        return {
          ...challenge,
          tasks: updatedTasks,
          progress,
        }
      }
      return challenge
    }))
  }

  const ChallengeDetails = ({ challenge }: { challenge: Challenge }) => (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{challenge.title}</h2>
          <Badge variant={
            challenge.level === 'beginner' ? 'secondary' :
            challenge.level === 'intermediate' ? 'default' : 'destructive'
          } className="capitalize">
            {challenge.level}
          </Badge>
        </div>
        <p className="text-muted-foreground">{challenge.description}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>{challenge.duration}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span>{challenge.participants.toLocaleString()} participants</span>
        </div>
        <div className="flex items-center space-x-2">
          <Trophy className="h-4 w-4" />
          <span>{challenge.progress ? `${Math.round(challenge.progress)}% complete` : 'Not started'}</span>
        </div>
      </div>

      {enrolledChallenges.includes(challenge.id) ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{challenge.progress ? `${Math.round(challenge.progress)}%` : '0%'}</span>
            </div>
            <Progress value={challenge.progress || 0} />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Daily Tasks</h3>
            <div className="space-y-2">
              {challenge.tasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(challenge.id, task.id)}
                    className="h-4 w-4"
                  />
                  <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Button className="w-full" onClick={() => handleEnroll(challenge)}>
          Join Challenge
        </Button>
      )}
    </div>
  )

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Fitness Challenges</h1>
        <p className="text-muted-foreground">
          Join community challenges and track your progress together
        </p>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Challenges</TabsTrigger>
          <TabsTrigger value="beginner">Beginner</TabsTrigger>
          <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => (
              <Dialog key={challenge.id}>
                <DialogTrigger asChild>
                  <Card className="group cursor-pointer hover:shadow-md transition-shadow">
                    <div className="h-[200px] overflow-hidden">
                      {challenge.imageUrl ? (
                        <Image
                          src={challenge.imageUrl}
                          alt={challenge.title}
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <PlaceholderImage width={400} height={200} className="group-hover:scale-105" />
                      )}
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                          {challenge.title}
                        </h3>
                        <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <CardDescription className="mb-4">{challenge.description}</CardDescription>
                      <div className="flex items-center justify-between">
                        <div className="space-x-2">
                          <Badge variant="outline">{challenge.duration}</Badge>
                          <Badge
                            variant={
                              challenge.level === 'beginner'
                                ? 'secondary'
                                : challenge.level === 'intermediate'
                                ? 'default'
                                : 'destructive'
                            }
                            className="capitalize"
                          >
                            {challenge.level}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {challenge.participants.toLocaleString()} participants
                        </span>
                      </div>
                      {enrolledChallenges.includes(challenge.id) && (
                        <div className="mt-4">
                          <Progress value={challenge.progress || 0} />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Challenge Details</DialogTitle>
                  </DialogHeader>
                  <ChallengeDetails challenge={challenge} />
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
