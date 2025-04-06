'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PlaceholderImage } from '@/components/ui/placeholder-image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChevronRight } from 'lucide-react'

interface Challenge {
  id: string
  title: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  participants: number
  imageUrl?: string
}

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: '30-Day Core Challenge',
    description: 'Build a stronger core with daily exercises',
    level: 'beginner',
    duration: '30 days',
    participants: 1245,
  },
  {
    id: '2',
    title: 'Full Body Transformation',
    description: 'Complete body workout program',
    level: 'intermediate',
    duration: '12 weeks',
    participants: 856,
  },
  {
    id: '3',
    title: 'Advanced Strength Training',
    description: 'Push your limits with intense workouts',
    level: 'advanced',
    duration: '8 weeks',
    participants: 432,
  },
]

export default function ChallengesPage() {
  const [activeTab, setActiveTab] = useState('all')

  const filteredChallenges = mockChallenges.filter(challenge => {
    if (activeTab === 'all') return true
    return challenge.level === activeTab
  })

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

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => (
              <Card key={challenge.id} className="group cursor-pointer hover:shadow-md transition-shadow">
                <div className="h-[200px] overflow-hidden">
                  {challenge.imageUrl ? (
                    <img
                      src={challenge.imageUrl}
                      alt={challenge.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
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
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="beginner" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => (
              <Card key={challenge.id} className="group cursor-pointer hover:shadow-md transition-shadow">
                <div className="h-[200px] overflow-hidden">
                  {challenge.imageUrl ? (
                    <img
                      src={challenge.imageUrl}
                      alt={challenge.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
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
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="intermediate" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => (
              <Card key={challenge.id} className="group cursor-pointer hover:shadow-md transition-shadow">
                <div className="h-[200px] overflow-hidden">
                  {challenge.imageUrl ? (
                    <img
                      src={challenge.imageUrl}
                      alt={challenge.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
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
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => (
              <Card key={challenge.id} className="group cursor-pointer hover:shadow-md transition-shadow">
                <div className="h-[200px] overflow-hidden">
                  {challenge.imageUrl ? (
                    <img
                      src={challenge.imageUrl}
                      alt={challenge.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
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
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
