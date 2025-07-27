"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart, MessageSquare, Share2, ChevronUp, UserPlus, Trophy, Target, Search, Filter, Plus, Image, Send } from "lucide-react"
import { toast } from "sonner"
import { useUser } from "@/lib/hooks/use-user"
import { communityService, type Post } from "@/lib/services/community"
import { PlaceholderImage } from "@/components/ui/placeholder-image"
import { formatTimeAgo } from "@/lib/utils/date"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

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
  const [isCreatingPost, setIsCreatingPost] = useState<boolean>(false)
  const [newPost, setNewPost] = useState({ title: "", content: "", image: null as File | null })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
        setLoading(true)
        const response = await fetch(`/api/community?page=${page}&limit=10`)
        if (!response.ok) throw new Error('Failed to fetch posts')
        
        const data = await response.json()
        
        const formattedPosts: PostWithMeta[] = data.posts.map((post: Post) => ({
          ...post,
          timeAgo: formatTimeAgo(new Date(post.createdAt)),
          liked: post.likes.includes(user?.id || '')
        }))

        if (page === 1) {
          setPosts(formattedPosts)
        } else {
          setPosts((prev: PostWithMeta[]) => [...prev, ...formattedPosts])
        }

        setTotal(data.total)
        setHasMore(page * 10 < data.total)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch posts:', error)
        toast.error("Error loading posts", {
          description: "Failed to load community posts. Please try again later.",
        })
        setLoading(false)
      }
    }

    fetchData()
  }, [activeTab, page, user?.id, toast])

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
        toast.error("Failed to fetch community data", {
          description: "Failed to fetch community data",
        })
        setLoading(false)
      }
    }

    fetchBuddiesAndChallenges()
  }, [activeTab, toast])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type", {
        description: "Only JPEG, PNG, GIF, and WebP images are allowed",
      })
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast.error("File too large", {
        description: "Image size must be less than 5MB",
      })
      return
    }

    setNewPost({ ...newPost, image: file })

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleCreatePost = async () => {
    if (!user) {
      toast.error("Authentication required", {
        description: "Please log in to create a post",
      })
      return
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error("Missing information", {
        description: "Please provide both a title and content for your post",
      })
      return
    }

    try {
      setIsSubmitting(true)

      let imageUrl = undefined

      // Upload image if present
      if (newPost.image) {
        const formData = new FormData()
        formData.append('file', newPost.image)

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image')
        }

        const uploadData = await uploadResponse.json()
        imageUrl = uploadData.url
      }

      // Create post
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newPost.title,
          content: newPost.content,
          imageUrl,
          userId: user.id,
          tags: ['fitness', 'community']
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create post')
      }

      const newPostData = await response.json()
      
      // Add to posts list
      const formattedNewPost: PostWithMeta = {
        ...newPostData,
        timeAgo: 'Just now',
        liked: false
      }

      setPosts([formattedNewPost, ...posts])
      
      // Reset form
      setNewPost({ title: "", content: "", image: null })
      setImagePreview(null)
      setIsCreatingPost(false)
      
      toast.success("Post created", {
        description: "Your post has been successfully published.",
      })
    } catch (error) {
      console.error('Failed to create post:', error)
      toast.error("Error creating post", {
        description: "Failed to publish your post. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikePost = async (postId: string) => {
    if (!user) {
      toast.error("Authentication required", {
        description: "Please log in to like posts",
      })
      return
    }

    try {
      const response = await fetch(`/api/community/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user.id })
      })

      if (!response.ok) {
        throw new Error('Failed to like post')
      }

      const data = await response.json()
      
      // Update posts state
      setPosts(posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            likes: data.likes,
            liked: data.likes.includes(user.id)
          }
        }
        return post
      }))
    } catch (error) {
      console.error('Failed to like post:', error)
      toast.error("Error", {
        description: "Failed to like post",
      })
    }
  }

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
      toast.success("Success", {
        description: "Buddy follow status updated",
      })
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update buddy status",
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
      toast.success("Success", {
        description: "Challenge join status updated",
      })
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update challenge status",
      })
    }
  }

  const filteredBuddies = buddies.filter((buddy: FitnessBuddy) => 
    buddy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    buddy.fitnessGoal.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/community?tab=${value}`, { scroll: false })
  }

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage(page + 1)
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
