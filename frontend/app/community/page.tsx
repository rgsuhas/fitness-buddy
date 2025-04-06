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
import { communityService, type Post } from "@/lib/services/community"
import { PlaceholderImage } from "@/components/ui/placeholder-image"
import { formatTimeAgo } from "@/lib/utils/date"

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

interface PostWithMeta extends Post {
  timeAgo: string
  liked: boolean
}

export default function CommunityPage() {
  const { user } = useUser()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")

  // State management
  const [activeTab, setActiveTab] = useState<string>(tabParam || "feed")
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [posts, setPosts] = useState<PostWithMeta[]>([])
  const [buddies, setBuddies] = useState<FitnessBuddy[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    // Update the active tab when the URL parameter changes
    if (tabParam && ["feed", "buddies", "challenges"].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])



  useEffect(() => {
    const fetchData = async () => {
      if (activeTab !== 'feed') {
        setLoading(false)
        return
      }

      try {
        const response = await communityService.getPosts(page)
        const formattedPosts: PostWithMeta[] = response.posts.map((post: Post) => ({
          ...post,
          timeAgo: formatTimeAgo(new Date(post.createdAt)),
          liked: post.likes.includes(user?.id || '')
        }))

        if (page === 1) {
          setPosts(formattedPosts)
        } else {
          setPosts((prev: PostWithMeta[]) => [...prev, ...formattedPosts])
        }

        setTotal(response.total)
        setHasMore(page * 10 < response.total)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch posts:', error)
        toast({
          title: "Error",
          description: "Failed to fetch posts",
          variant: "destructive"
        })
        setLoading(false)
      }
    }

    fetchData()
  }, [page, user?.id, toast, activeTab])

  useEffect(() => {
    const fetchBuddiesAndChallenges = async () => {
      if (activeTab !== 'buddies' && activeTab !== 'challenges') return
      try {
        // Mock data for now - will be replaced with API calls later
        const mockBuddies: FitnessBuddy[] = [
          {
            id: "u1",
            name: "Sarah Johnson",
            image: "/images/user-avatar.jpg",
            fitnessGoal: "Weight Loss",
            activityLevel: "3-4 days/week",
            similarity: 85,
            isFollowing: true,
          },
          {
            id: "u2",
            name: "Mike Reynolds",
            image: "/images/admin-avatar.jpg",
            fitnessGoal: "Build Muscle",
            activityLevel: "5-6 days/week",
            similarity: 92,
            isFollowing: false,
          },
          {
            id: "u3",
            name: "Emma Chen",
            image: "/images/default-avatar.jpg",
            fitnessGoal: "Improve Endurance",
            activityLevel: "4-5 days/week",
            similarity: 78,
            isFollowing: false,
          },
        ]
        setBuddies(mockBuddies)

        // Mock challenges data
        const mockChallenges: Challenge[] = [
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
        ]
        setChallenges(mockChallenges)
        setLoading(false)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch community data",
          variant: "destructive"
        })
        setLoading(false)
      }
    }

    fetchBuddiesAndChallenges()
  }, [activeTab, toast])

  const handleFollowBuddy = async (buddyId: string) => {
    try {
      setBuddies(
        buddies.map((buddy: FitnessBuddy) => {
          if (buddy.id === buddyId) {
            return { ...buddy, isFollowing: !buddy.isFollowing }
          }
          return buddy
        })
      )
      toast({
        title: "Success",
        description: "Buddy follow status updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update buddy status",
        variant: "destructive"
      })
    }
  }

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      setChallenges(
        challenges.map((challenge: Challenge) => {
          if (challenge.id === challengeId) {
            return { ...challenge, joined: !challenge.joined }
          }
          return challenge
        })
      )
      toast({
        title: "Success",
        description: "Challenge join status updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update challenge status",
        variant: "destructive"
      })
    }
  }

  const filteredBuddies = buddies.filter((buddy: FitnessBuddy) => 
    buddy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    buddy.fitnessGoal.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/community?tab=${value}`)
  }

  const handleLikePost = async (postId: string) => {
    try {
      await communityService.togglePostLike(postId)
      setPosts(
        posts.map((post: PostWithMeta) => {
          if (post._id === postId) {
            const liked = !post.liked
            return {
              ...post,
              liked,
              likes: liked ? [...post.likes, user?.id || ''] : post.likes.filter((id: string) => id !== user?.id)
            }
          }
          return post
        })
      )
      toast({
        title: "Success",
        description: "Post like status updated",
      })
    } catch (error) {
      console.error('Failed to update post like:', error)
      toast({
        title: "Error",
        description: "Failed to update post like status",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="container py-6 space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="buddies">Find Buddies</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4">
          {/* Feed content */}
        </TabsContent>

        <TabsContent value="buddies" className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 opacity-50" />
            <Input
              placeholder="Search buddies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBuddies.map((buddy) => (
              <Card key={buddy.id}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar>
                    <AvatarImage src={buddy.image} alt={buddy.name} />
                    <AvatarFallback>{buddy.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <CardTitle>{buddy.name}</CardTitle>
                    <CardDescription>{buddy.fitnessGoal}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Activity Level</p>
                      <p className="text-sm text-muted-foreground">{buddy.activityLevel}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-sm font-medium">Match</p>
                      <p className="text-sm text-muted-foreground">{buddy.similarity}%</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={buddy.isFollowing ? "outline" : "default"}
                    className="w-full"
                    onClick={() => handleFollowBuddy(buddy.id)}
                  >
                    {buddy.isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {challenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardHeader>
                  <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden">
                    <PlaceholderImage
                      width={600}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardTitle>{challenge.title}</CardTitle>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Participants</p>
                      <p className="text-sm text-muted-foreground">{challenge.participants}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-sm font-medium">Status</p>
                      <p className="text-sm text-muted-foreground">{challenge.deadline}</p>
                    </div>
                  </div>
                  {challenge.progress !== undefined && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">Progress</p>
                        <p className="text-sm text-muted-foreground">{challenge.progress}%</p>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${challenge.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    variant={challenge.joined ? "outline" : "default"}
                    className="w-full"
                    onClick={() => handleJoinChallenge(challenge.id)}
                  >
                    {challenge.joined ? "Leave Challenge" : "Join Challenge"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
