"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/hooks/use-user"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { Send, Search, User, Users } from "lucide-react"
import { format } from "date-fns"
import axios from "axios"

interface Conversation {
  user: {
    id: string
    name: string
    avatar: string
  }
  lastMessage: {
    content: string
    timestamp: string
    unread: boolean
  }
}

interface Message {
  _id: string
  content: string
  timestamp: string
  sender: {
    _id: string
    name: string
    avatar: string
  }
  receiver: {
    _id: string
    name: string
    avatar: string
  }
  read: boolean
}

export default function MessagesPage() {
  const { user, loading } = useUser()
  const router = useRouter()
  
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [activeUser, setActiveUser] = useState<Conversation["user"] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagePollingInterval = useRef<NodeJS.Timeout>()
  const conversationPollingInterval = useRef<NodeJS.Timeout>()

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Poll for new messages
  useEffect(() => {
    if (activeConversation) {
      const pollMessages = async () => {
        try {
          const response = await axios.get(`/api/messages/${activeConversation}`)
          setMessages(response.data)
        } catch (error) {
          console.error("Error polling messages:", error)
        }
      }

      messagePollingInterval.current = setInterval(pollMessages, 5000)

      return () => {
        if (messagePollingInterval.current) {
          clearInterval(messagePollingInterval.current)
        }
      }
    }
  }, [activeConversation])

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user || !user.id) return;
      
      try {
        setIsLoading(true)
        const response = await axios.get(`/api/messages/conversations?userId=${user.id}`)
        setConversations(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching conversations:", error)
        toast.error("Error", {
          description: "Failed to load conversations",
        })
        setIsLoading(false)
      }
    }

    let intervalId: NodeJS.Timeout | null = null;

    if (user && user.id) {
      // Initial fetch
      fetchConversations()
      
      // Only set up polling if we're not already polling
      if (!conversationPollingInterval.current) {
        // Set up polling with a reasonable interval (every 30 seconds)
        intervalId = setInterval(fetchConversations, 30000)
        conversationPollingInterval.current = intervalId
      }
    }
    
    // Clean up function
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [user, toast]) // Only re-run when user or toast changes

  // Fetch messages when active conversation changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeConversation) return

      try {
        const response = await axios.get(`/api/messages/${activeConversation}`)
        setMessages(response.data)
        
        // Mark messages as read
        if (user) {
          await axios.put(`/api/messages/${activeConversation}/read?userId=${user.id}`)
          
          // Update unread status in conversations
          setConversations(prevConversations => 
            prevConversations.map(conv => 
              conv.user.id === activeUser?.id 
                ? { ...conv, lastMessage: { ...conv.lastMessage, unread: false } } 
                : conv
            )
          )
        }
      } catch (error) {
        console.error("Error fetching messages:", error)
        toast.error("Error", {
          description: "Failed to load messages",
        })
      }
    }

    fetchMessages()
  }, [activeConversation, toast, user, activeUser])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || !activeConversation) return
    
    try {
      const response = await axios.post("/api/messages", {
        receiverId: activeConversation,
        content: newMessage,
      })
      
      // Add new message to the list
      setMessages(prev => [...prev, response.data])
      
      // Update conversation list
      setConversations(prev => 
        prev.map(conv => 
          conv.user.id === activeConversation 
            ? { 
                ...conv, 
                lastMessage: { 
                  content: newMessage, 
                  timestamp: new Date().toISOString(), 
                  unread: false 
                } 
              } 
            : conv
        )
      )
      
      // Clear input
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Error", {
        description: "Failed to send message",
      })
    }
  }

  const selectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation.user.id)
    setActiveUser(conversation.user)
  }

  if (loading) {
    return (
      <div className="container py-10">
        <Skeleton className="h-12 w-1/3 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[600px] w-full" />
          <Skeleton className="h-[600px] w-full md:col-span-2" />
        </div>
      </div>
    )
  }

  // Use mock data for initial development
  const mockConversations: Conversation[] = [
    {
      user: {
        id: "1",
        name: "Emma Trainer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=EmmaTrainer",
      },
      lastMessage: {
        content: "Let's schedule a consultation to discuss your goals in detail.",
        timestamp: new Date(Date.now() - 3600000 * 23).toISOString(),
        unread: true,
      },
    },
    {
      user: {
        id: "2",
        name: "Mike Coach",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MikeCoach",
      },
      lastMessage: {
        content: "I noticed you've been consistent with your workouts. Great job!",
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
        unread: false,
      },
    },
  ]

  // Use mock data if API hasn't loaded yet
  const displayConversations = conversations.length > 0 ? conversations : mockConversations

  return (
    <div className="container py-8">
      <Card className="w-full h-[80vh]">
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex h-[calc(80vh-4rem)]">
          <div className="w-1/3 border-r h-full flex flex-col">
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="space-y-2 p-4">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[160px]" />
                      </div>
                    </div>
                  ))
                ) : (
                  conversations
                    .filter((conv) =>
                      conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((conversation) => (
                      <button
                        key={conversation.user.id}
                        onClick={() => {
                          setActiveConversation(conversation.user.id)
                          setActiveUser(conversation.user)
                        }}
                        className={`w-full flex items-center space-x-4 p-3 rounded-lg transition-colors ${
                          activeConversation === conversation.user.id
                            ? "bg-primary/10"
                            : "hover:bg-muted"
                        }`}
                      >
                        <Avatar>
                          <AvatarImage src={conversation.user.avatar} />
                          <AvatarFallback>
                            <User className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left">
                          <div className="flex justify-between">
                            <p className="font-medium">{conversation.user.name}</p>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(conversation.lastMessage.timestamp), "HH:mm")}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage.content}
                          </p>
                          {conversation.lastMessage.unread && (
                            <Badge variant="default" className="mt-1">New</Badge>
                          )}
                        </div>
                      </button>
                    ))
                )}
              </div>
            </ScrollArea>
          </div>
          <div className="flex-1 flex flex-col">
            {activeUser ? (
              <>
                <div className="p-4 border-b flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={activeUser.avatar} />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{activeUser.name}</p>
                  </div>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${
                          message.sender._id === user?.id ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.sender._id === user?.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {format(new Date(message.timestamp), "HH:mm")}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                <div className="p-4 border-t">
                  <form
                    onSubmit={handleSendMessage}
                    className="flex items-center space-x-2"
                  >
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button type="submit" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-4" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
