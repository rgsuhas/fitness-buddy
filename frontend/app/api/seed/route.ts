import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

// Sample users for seeding
const users = [
  {
    _id: new ObjectId(),
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123', // In a real app, this would be hashed
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    fitnessGoal: 'Build muscle',
    activityLevel: 'moderate',
    bio: 'Fitness enthusiast looking to build strength and endurance.',
    createdAt: new Date(),
  },
  {
    _id: new ObjectId(),
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    fitnessGoal: 'Lose weight',
    activityLevel: 'light',
    bio: 'Starting my fitness journey to improve health and confidence.',
    createdAt: new Date(),
  },
  {
    _id: new ObjectId(),
    name: 'Mike Johnson',
    email: 'mike@example.com',
    password: 'password123',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    fitnessGoal: 'Increase endurance',
    activityLevel: 'very_active',
    bio: 'Marathon runner and fitness coach passionate about helping others.',
    createdAt: new Date(),
  },
  {
    _id: new ObjectId(),
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    password: 'password123',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    fitnessGoal: 'Maintain fitness',
    activityLevel: 'moderate',
    bio: 'Yoga instructor and wellness advocate focused on holistic health.',
    createdAt: new Date(),
  },
  {
    _id: new ObjectId(),
    name: 'Alex Chen',
    email: 'alex@example.com',
    password: 'password123',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    fitnessGoal: 'Build strength',
    activityLevel: 'extremely_active',
    bio: 'Competitive powerlifter with a passion for strength training.',
    createdAt: new Date(),
  }
];

// Sample posts for community feed
const generatePosts = (users: any[]) => {
  interface Comment {
    _id: ObjectId;
    content: string;
    author: {
      _id: ObjectId;
      name: string;
      avatar: string;
    };
    likes: string[];
    createdAt: Date;
  }

  interface Post {
    _id: ObjectId;
    title: string;
    content: string;
    author: {
      _id: ObjectId;
      name: string;
      avatar: string;
    };
    imageUrl?: string;
    tags: string[];
    likes: string[];
    comments: Comment[];
    createdAt: Date;
  }

  const posts: Post[] = [];
  const topics = [
    'Just completed a 5K run!',
    'New personal best on bench press today',
    'Looking for workout buddies in the downtown area',
    'My transformation journey - 3 months progress',
    'Favorite post-workout meals?',
    'Tips for improving squat form?',
    'Morning vs. evening workouts - what works best for you?',
    'Started a new yoga routine today',
    'How do you stay motivated during plateaus?',
    'Nutrition advice needed for muscle gain',
  ];

  const userIds = users.map(user => user._id);

  // Generate random likes for posts
  const generateRandomLikes = (userIds: ObjectId[], count: number) => {
    const randomLikes: string[] = [];
    const shuffled = [...userIds].sort(() => 0.5 - Math.random());
    for (let i = 0; i < Math.min(count, userIds.length); i++) {
      randomLikes.push(shuffled[i].toString());
    }
    return randomLikes;
  };

  for (let i = 0; i < 15; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    const post: Post = {
      _id: new ObjectId(),
      title: randomTopic,
      content: `${randomTopic} ${Math.random() > 0.7 ? 'Really excited about my progress!' : 'Would love to hear your thoughts.'}`,
      author: {
        _id: randomUser._id,
        name: randomUser.name,
        avatar: randomUser.avatar,
      },
      imageUrl: Math.random() > 0.6 ? `https://source.unsplash.com/random/800x600?fitness&sig=${i}` : undefined,
      tags: ['fitness', 'workout', 'health'],
      likes: [],
      comments: [],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 604800000)), // Random time in the last week
    };

    // Add random likes to posts
    const likeCount = Math.floor(Math.random() * 15);
    post.likes = generateRandomLikes(userIds, likeCount);

    // Generate random comments
    const commentCount = Math.floor(Math.random() * 3);
    for (let k = 0; k < commentCount; k++) {
      const commentUser = users[Math.floor(Math.random() * users.length)];
      post.comments.push({
        _id: new ObjectId(),
        content: `Great job! Keep up the good work!`,
        author: {
          _id: commentUser._id,
          name: commentUser.name,
          avatar: commentUser.avatar,
        },
        likes: [],
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 86400000)), // Random time in the last 24 hours
      });
    }

    posts.push(post);
  }

  return posts;
};

// Generate conversations and messages between users
const generateConversations = (users: any[]) => {
  interface Message {
    _id: ObjectId;
    conversationId: ObjectId;
    content: string;
    mediaUrl?: string;
    sender: {
      _id: ObjectId;
      name: string;
      avatar: string;
    };
    receiver: {
      _id: ObjectId;
      name: string;
      avatar: string;
    };
    read: boolean;
    createdAt: Date;
  }

  interface Conversation {
    _id: ObjectId;
    participants: {
      _id: ObjectId;
      name: string;
      avatar: string;
    }[];
    lastMessage: {
      content: string;
      timestamp: Date;
      sender: ObjectId;
    } | null;
    createdAt: Date;
    updatedAt: Date;
  }

  const conversations: Conversation[] = [];
  const messages: Message[] = [];

  // Create conversations between pairs of users
  for (let i = 0; i < users.length; i++) {
    for (let j = i + 1; j < users.length; j++) {
      const conversationId = new ObjectId();
      
      // Create conversation
      conversations.push({
        _id: conversationId,
        participants: [
          {
            _id: users[i]._id,
            name: users[i].name,
            avatar: users[i].avatar
          },
          {
            _id: users[j]._id,
            name: users[j].name,
            avatar: users[j].avatar
          }
        ],
        lastMessage: null,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 2592000000)), // Random time in the last month
        updatedAt: new Date()
      });

      // Generate 5-10 messages for each conversation
      const messageCount = 5 + Math.floor(Math.random() * 6);
      for (let k = 0; k < messageCount; k++) {
        const sender = Math.random() > 0.5 ? users[i] : users[j];
        const receiver = sender === users[i] ? users[j] : users[i];
        const messageTime = new Date(Date.now() - Math.floor(Math.random() * 604800000)); // Random time in the last week
        
        const message: Message = {
          _id: new ObjectId(),
          conversationId: conversationId,
          content: getRandomMessage(),
          mediaUrl: Math.random() > 0.8 ? `https://source.unsplash.com/random/800x600?fitness&sig=${i}-${j}-${k}` : undefined,
          sender: {
            _id: sender._id,
            name: sender.name,
            avatar: sender.avatar
          },
          receiver: {
            _id: receiver._id,
            name: receiver.name,
            avatar: receiver.avatar
          },
          read: Math.random() > 0.3, // 70% chance message is read
          createdAt: messageTime
        };
        
        messages.push(message);
        
        // Update last message in conversation
        if (k === messageCount - 1) {
          const conv = conversations.find(c => c._id.equals(conversationId));
          if (conv) {
            conv.lastMessage = {
              content: message.content,
              timestamp: messageTime,
              sender: message.sender._id
            };
            conv.updatedAt = messageTime;
          }
        }
      }
    }
  }

  return { conversations, messages };
};

function getRandomMessage() {
  const messages = [
    "Hey, how's your training going?",
    "Did you try that new workout I sent you?",
    "I'm planning to go to the gym tomorrow morning. Want to join?",
    "Just finished a great workout session!",
    "Have you tried the new protein shake at the gym?",
    "Can you recommend a good pre-workout supplement?",
    "I'm thinking of switching to a new training program",
    "How's your diet going? Any tips?",
    "Just hit a new personal record today!",
    "Do you want to meet up for a run this weekend?",
    "I found this great fitness app, you should check it out",
    "How are you recovering from yesterday's workout?",
    "I need some motivation to get back on track",
    "What's your favorite post-workout meal?",
    "Have you tried meditation for recovery?",
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("fitness-buddy");

    // Clear existing data
    await db.collection("users").deleteMany({});
    await db.collection("posts").deleteMany({});
    await db.collection("conversations").deleteMany({});
    await db.collection("messages").deleteMany({});

    // Insert users
    await db.collection("users").insertMany(users);

    // Generate and insert posts
    const posts = generatePosts(users);
    await db.collection("posts").insertMany(posts);

    // Generate and insert conversations and messages
    const { conversations, messages } = generateConversations(users);
    await db.collection("conversations").insertMany(conversations);
    await db.collection("messages").insertMany(messages);

    return NextResponse.json({ 
      success: true, 
      message: "Database seeded successfully",
      data: {
        users: users.length,
        posts: posts.length,
        conversations: conversations.length,
        messages: messages.length
      }
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json({ success: false, error: "Failed to seed database" }, { status: 500 });
  }
}
