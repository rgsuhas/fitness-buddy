"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart, MessageSquare, Share2, ChevronUp, UserPlus, Trophy, Target, Search, Filter, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/lib/hooks/use-user"

interface Post {
  id: string
  user: {
    id: string
    name: string
    image?: string
  }
  content: string
  imageUrl?: string
  likes: number
  comments: number
  timeAgo: string
  liked: boolean
}

interface FitnessBuddy {
  id: string
  name: string
  image?: string
  fitnessGoal: string
  activityLevel: string
  similarity: number
  isFollowing: boolean
}

interface Challenge {
  id: string
  title: string
  description: string
  participants: number
  deadline: string
  imageUrl: string
  progress?: number
  joined: boolean
}

export default function CommunityPage() {
  const { user } = useUser()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")

  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<Post[]>([])
  const [buddies, setBuddies] = useState<FitnessBuddy[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState(tabParam || "feed")

  useEffect(() => {
    // Update the active tab when the URL parameter changes
    if (tabParam && ["feed", "buddies", "challenges"].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  useEffect(() => {
    // Simulate API call to fetch data
    const fetchData = async () => {
      try {
        // Simulating network delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock posts data
        setPosts([
          {
            id: "p1",
            user: {
              id: "u2",
              name: "Sarah Johnson",
              image: "/images/user-avatar.jpg",
            },
            content:
              "Just completed my first 10K run! So proud of my progress over the last 3 months. Started with barely being able to run 1K and now here we are! 🏃‍♀️💪 #FitnessJourney #Running",
            imageUrl: "/images/workout-1.jpg",
            likes: 42,
            comments: 8,
            timeAgo: "2h ago",
            liked: false,
          },
          {
            id: "p2",
            user: {
              id: "u3",
              name: "Mike Reynolds",
              image: "/images/admin-avatar.jpg",
            },
            content:
              "New personal record on bench press today: 225 lbs × 5 reps! The consistent training is finally paying off. Anyone else hitting PRs this week?",
            likes: 28,
            comments: 6,
            timeAgo: "5h ago",
            liked: true,
          },
          {
            id: "p3",
            user: {
              id: "u4",
              name: "Emma Chen",
              image: "/images/default-avatar.jpg",
            },
            content:
              "My transformation after 6 months of following the Strength Builder program on Fitness Buddy. Consistency is key! Thank you to everyone in this community for the constant motivation and support. Couldn't have done it without you all!",
            imageUrl: "/images/workout-2.jpg",
            likes: 137,
            comments: 24,
            timeAgo: "1d ago",
            liked: false,
          },
        ])

        // Mock buddies data
        setBuddies([
          {
            id: "u5",
            name: "David Lee",
            image: "/images/default-avatar.jpg",
            fitnessGoal: "Build Muscle",
            activityLevel: "4-5 days/week",
            similarity: 92,
            isFollowing: false,
          },
          {
            id: "u6",
            name: "Jessica Martinez",
            image: "/images/user-avatar.jpg",
            fitnessGoal: "Weight Loss",
            activityLevel: "3-4 days/week",
            similarity: 85,
            isFollowing: true,
          },
          {
            id: "u7",
            name: "Alex Thompson",
            image: "/images/admin-avatar.jpg",
            fitnessGoal: "Improve Endurance",
            activityLevel: "5-6 days/week",
            similarity: 78,
            isFollowing: false,
          },
          {
            id: "u8",
            name: "Priya Patel",
            image: "/images/default-avatar.jpg",
            fitnessGoal: "Build Strength",
            activityLevel: "3-4 days/week",
            similarity: 73,
            isFollowing: false,
          },
        ])

        // Mock challenges data
        setChallenges([
          {
            id: "c1",
            title: "30-Day Plank Challenge",
            description: "Improve your core strength with daily planks of increasing duration",
            participants: 842,
            deadline: "Ends in 12 days",
            imageUrl: "/images/workout-3.jpg",
            progress: 60,
            joined: true,
          },
          {
            id: "c2",
            title: "10K Steps Daily",
            description: "Walk at least 10,000 steps every day for 2 weeks",
            participants: 1247,
            deadline: "Ends in 8 days",
            imageUrl: "/images/workout-4.jpg",
            joined: false,
          },
          {
            id: "c3",
            title: "Summer Shred Challenge",
            description: "Join the community in a 6-week transformation challenge",
            participants: 658,
            deadline: "Starts in 3 days",
            imageUrl: "/images/workout-1.jpg",
            joined: false,
          },
        ])

        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch community data:", error)
        toast({
          title: "Error loading community data",
          description: "Please try again later.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleLikePost = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const liked = !post.liked
          return {
            ...post,
            liked,
            likes: liked ? post.likes + 1 : post.likes - 1,
          }
        }
        return post
      }),
    )
  }

  const handleFollowBuddy = (buddyId: string) => {
    setBuddies(
      buddies.map((buddy) => {
        if (buddy.id === buddyId) {
          return {
            ...buddy,
            isFollowing: !buddy.isFollowing,
          }
        }
        return buddy
      }),
    )

    toast({
      title: "Success!",
      description: buddies.find((b) => b.id === buddyId)?.isFollowing
        ? "You unfollowed this fitness buddy."
        : "You're now following this fitness buddy!",
    })
  }

  const handleJoinChallenge = (challengeId: string) => {
    setChallenges(
      challenges.map((challenge) => {
        if (challenge.id === challengeId) {
          return {
            ...challenge,
            joined: !challenge.joined,
            participants: challenge.joined ? challenge.participants - 1 : challenge.participants + 1,
          }
        }
        return challenge
      }),
    )

    toast({
      title: "Success!",
      description: challenges.find((c) => c.id === challengeId)?.joined
        ? "You left this challenge."
        : "You joined the challenge!",
    })
  }

  // Filter buddies based on search query
  const filteredBuddies = buddies.filter(
    (buddy) =>
      buddy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buddy.fitnessGoal.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/community?tab=${value}`, { scroll: false })
  }

  return (
    <div className="container py-6">
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Community</h1>
        <p className="text-muted-foreground">
          Connect with fitness buddies, share your journey, and participate in challenges
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="feed">Activity Feed</TabsTrigger>
          <TabsTrigger value="buddies">Find Buddies</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user?.image || "/images/default-avatar.jpg"} alt={user?.name || "User"} />
                  <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Input placeholder="Share your fitness journey..." className="mb-2" />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      Add Photo
                    </Button>
                    <Button size="sm">Post</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-24 w-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={post.user.image} alt={post.user.name} />
                        <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{post.user.name}</h3>
                            <p className="text-xs text-muted-foreground">{post.timeAgo}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="19" cy="12" r="1" />
                              <circle cx="5" cy="12" r="1" />
                            </svg>
                          </Button>
                        </div>
                        <p>{post.content}</p>
                        {post.imageUrl && (
                          <div className="my-2 rounded-md overflow-hidden">
                            <img
                              src={post.imageUrl || "/placeholder.svg"}
                              alt="Post"
                              className="w-full object-cover max-h-[400px]"
                            />
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-6">
                            <button
                              className={`flex items-center gap-1 text-sm ${post.liked ? "text-primary" : ""}`}
                              onClick={() => handleLikePost(post.id)}
                            >
                              <Heart className={`h-4 w-4 ${post.liked ? "fill-primary" : ""}`} />
                              <span>{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-1 text-sm">
                              <MessageSquare className="h-4 w-4" />
                              <span>{post.comments}</span>
                            </button>
                          </div>
                          <button className="flex items-center gap-1 text-sm">
                            <Share2 className="h-4 w-4" />
                            <span className="sr-only sm:not-sr-only sm:inline">Share</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="buddies">
          <Card>
            <CardHeader>
              <CardTitle>Find Fitness Buddies</CardTitle>
              <CardDescription>Connect with people who share similar fitness goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or fitness goal..."
                    className="pl-9 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              {loading ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <Skeleton className="w-12 h-12 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-1/3" />
                            <Skeleton className="h-4 w-2/3" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <>
                  {filteredBuddies.length === 0 ? (
                    <div className="text-center py-10">
                      <h3 className="text-lg font-medium">No buddies found</h3>
                      <p className="text-muted-foreground">Try adjusting your search query</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {filteredBuddies.map((buddy) => (
                        <Card key={buddy.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={buddy.image} alt={buddy.name} />
                                <AvatarFallback>{buddy.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium">{buddy.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      {buddy.fitnessGoal} • {buddy.activityLevel}
                                    </p>
                                  </div>
                                  <Badge variant="secondary" className="gap-1">
                                    <ChevronUp className="h-3.5 w-3.5" />
                                    {buddy.similarity}% Match
                                  </Badge>
                                </div>
                                <Button
                                  variant={buddy.isFollowing ? "secondary" : "default"}
                                  size="sm"
                                  className="mt-2"
                                  onClick={() => handleFollowBuddy(buddy.id)}
                                >
                                  <UserPlus className="mr-2 h-4 w-4" />
                                  {buddy.isFollowing ? "Following" : "Follow"}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Load More
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="challenges">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Fitness Challenges</CardTitle>
                  <CardDescription>Participate in community challenges to stay motivated</CardDescription>
                </div>
                <Button onClick={() => router.push("/community/create-challenge")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Challenge
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index}>
                      <Skeleton className="h-[150px] w-full rounded-t-lg" />
                      <CardHeader className="p-4">
                        <Skeleton className="h-5 w-2/3" />
                        <Skeleton className="h-4 w-full mt-2" />
                      </CardHeader>
                      <CardFooter className="p-4 pt-0">
                        <Skeleton className="h-9 w-full" />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {challenges.map((challenge) => (
                    <Card key={challenge.id} className="overflow-hidden">
                      <div className="relative h-[150px]">
                        <img
                          src={challenge.imageUrl || "/placeholder.svg"}
                          alt={challenge.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 right-2">
                          <Badge className="gap-1">
                            <Trophy className="h-3.5 w-3.5" />
                            {challenge.participants} Participants
                          </Badge>
                        </div>
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">{challenge.title}</CardTitle>
                        <CardDescription>{challenge.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="px-4 pb-0">
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Target className="h-4 w-4 mr-1" />
                            {challenge.deadline}
                          </div>
                          {challenge.progress && <div>{challenge.progress}% Complete</div>}
                        </div>
                        {challenge.progress && (
                          <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${challenge.progress}%` }}
                            />
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="p-4">
                        <Button
                          variant={challenge.joined ? "secondary" : "default"}
                          className="w-full"
                          onClick={() => handleJoinChallenge(challenge.id)}
                        >
                          {challenge.joined ? "Leave Challenge" : "Join Challenge"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

