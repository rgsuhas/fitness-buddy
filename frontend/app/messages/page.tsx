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
import { useToast } from "@/components/ui/use-toast"
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
  const { toast } = useToast()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [activeUser, setActiveUser] = useState<Conversation["user"] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get("/api/messages/conversations")
        setConversations(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching conversations:", error)
        toast({
          title: "Error",
          description: "Failed to load conversations",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    if (user) {
      fetchConversations()
    }
  }, [user, toast])

  // Fetch messages when active conversation changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeConversation) return

      try {
        const response = await axios.get(`/api/messages/${activeConversation}`)
        setMessages(response.data)
        
        // Mark messages as read
        await axios.put(`/api/messages/${activeConversation}/read`)
        
        // Update unread status in conversations
        setConversations(prevConversations => 
          prevConversations.map(conv => 
            conv.user.id === activeConversation 
              ? { ...conv, lastMessage: { ...conv.lastMessage, unread: false } } 
              : conv
          )
        )
      } catch (error) {
        console.error("Error fetching messages:", error)
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        })
      }
    }

    fetchMessages()
  }, [activeConversation, toast])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
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
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              <span>Conversations</span>
              <Button variant="ghost" size="icon">
                <Users className="h-4 w-4" />
              </Button>
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-8" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {isLoading ? (
                <div className="p-4 space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y">
                  {displayConversations.map((conversation) => (
                    <div
                      key={conversation.user.id}
                      className={`p-4 cursor-pointer hover:bg-accent transition-colors ${
                        activeConversation === conversation.user.id ? "bg-accent" : ""
                      }`}
                      onClick={() => selectConversation(conversation)}
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
                          <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{conversation.user.name}</p>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(conversation.lastMessage.timestamp), "h:mm a")}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage.content}
                          </p>
                        </div>
                        {conversation.lastMessage.unread && (
                          <Badge className="ml-auto" variant="default">
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="md:col-span-2">
          {activeConversation ? (
            <>
              <CardHeader className="pb-2 border-b">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={activeUser?.avatar} alt={activeUser?.name} />
                    <AvatarFallback>{activeUser?.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{activeUser?.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">Online</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px] p-4">
                  <div className="space-y-4">
                    {messages.length > 0 ? (
                      messages.map((message) => {
                        const isCurrentUser = message.sender._id === user?.id
                        return (
                          <div
                            key={message._id}
                            className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                          >
                            <div className="flex items-end gap-2">
                              {!isCurrentUser && (
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                                  <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
                                </Avatar>
                              )}
                              <div
                                className={`max-w-md rounded-lg p-3 ${
                                  isCurrentUser
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                                }`}
                              >
                                <p>{message.content}</p>
                                <p className="text-xs mt-1 opacity-70">
                                  {format(new Date(message.timestamp), "h:mm a")}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                <form onSubmit={handleSendMessage} className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[500px] text-center p-4">
              <User className="h-16 w-16 mb-4 text-muted-foreground" />
              <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
              <p className="text-muted-foreground max-w-md">
                Choose a conversation from the list to start chatting
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
