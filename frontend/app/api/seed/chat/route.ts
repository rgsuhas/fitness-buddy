import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

// Generate a general chat conversation with messages
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("fitness-buddy");

    // Get all users
    const users = await db.collection("users").find({}).toArray();
    
    if (users.length < 2) {
      return NextResponse.json({ 
        success: false, 
        error: "Not enough users to create chat" 
      }, { status: 400 });
    }

    // Create a "General Chat" conversation with all users
    const generalChatId = new ObjectId();
    const generalChat = {
      _id: generalChatId,
      name: "General Chat",
      isGroupChat: true,
      participants: users.map(user => ({
        _id: user._id,
        name: user.name,
        avatar: user.avatar
      })),
      lastMessage: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Check if general chat already exists
    const existingChat = await db.collection("conversations").findOne({ name: "General Chat", isGroupChat: true });
    
    let chatId;
    if (existingChat) {
      chatId = existingChat._id;
      console.log("General chat already exists, using existing chat");
    } else {
      // Insert the general chat
      await db.collection("conversations").insertOne(generalChat);
      chatId = generalChatId;
      console.log("Created new general chat");
    }

    // Create messages for the general chat
    const messages = [
      {
        _id: new ObjectId(),
        conversationId: chatId,
        content: "Welcome to the FitnessBuddy General Chat! 👋",
        sender: {
          _id: users[0]._id,
          name: users[0].name,
          avatar: users[0].avatar
        },
        read: true,
        createdAt: new Date(Date.now() - 86400000 * 7) // 7 days ago
      },
      {
        _id: new ObjectId(),
        conversationId: chatId,
        content: "Hey everyone! Excited to be part of this fitness community!",
        sender: {
          _id: users[1]._id,
          name: users[1].name,
          avatar: users[1].avatar
        },
        read: true,
        createdAt: new Date(Date.now() - 86400000 * 6) // 6 days ago
      },
      {
        _id: new ObjectId(),
        conversationId: chatId,
        content: "Has anyone tried the new HIIT workout in the app?",
        sender: {
          _id: users[2]._id,
          name: users[2].name,
          avatar: users[2].avatar
        },
        read: true,
        createdAt: new Date(Date.now() - 86400000 * 5) // 5 days ago
      },
      {
        _id: new ObjectId(),
        conversationId: chatId,
        content: "I did! It was intense but really effective. Burned 300 calories in just 20 minutes! 🔥",
        sender: {
          _id: users[3]._id,
          name: users[3].name,
          avatar: users[3].avatar
        },
        read: true,
        createdAt: new Date(Date.now() - 86400000 * 4) // 4 days ago
      },
      {
        _id: new ObjectId(),
        conversationId: chatId,
        content: "I'm planning to start a 30-day challenge. Anyone want to join me?",
        sender: {
          _id: users[0]._id,
          name: users[0].name,
          avatar: users[0].avatar
        },
        read: true,
        createdAt: new Date(Date.now() - 86400000 * 3) // 3 days ago
      },
      {
        _id: new ObjectId(),
        conversationId: chatId,
        content: "Count me in! What type of challenge are you thinking?",
        sender: {
          _id: users[4]._id,
          name: users[4].name,
          avatar: users[4].avatar
        },
        read: true,
        createdAt: new Date(Date.now() - 86400000 * 2) // 2 days ago
      },
      {
        _id: new ObjectId(),
        conversationId: chatId,
        content: "I'm thinking a mix of strength training and cardio. We can track progress in the app!",
        sender: {
          _id: users[0]._id,
          name: users[0].name,
          avatar: users[0].avatar
        },
        read: true,
        createdAt: new Date(Date.now() - 86400000) // 1 day ago
      },
      {
        _id: new ObjectId(),
        conversationId: chatId,
        content: "Just finished my morning run. 5K in 25 minutes - new personal best! 🏃‍♂️",
        sender: {
          _id: users[1]._id,
          name: users[1].name,
          avatar: users[1].avatar
        },
        read: true,
        createdAt: new Date(Date.now() - 3600000 * 12) // 12 hours ago
      },
      {
        _id: new ObjectId(),
        conversationId: chatId,
        content: "That's impressive! What's your training routine?",
        sender: {
          _id: users[2]._id,
          name: users[2].name,
          avatar: users[2].avatar
        },
        read: true,
        createdAt: new Date(Date.now() - 3600000 * 6) // 6 hours ago
      },
      {
        _id: new ObjectId(),
        conversationId: chatId,
        content: "Has anyone tried the new mindfulness feature? The guided meditations are really helping with my recovery.",
        sender: {
          _id: users[3]._id,
          name: users[3].name,
          avatar: users[3].avatar
        },
        read: true,
        createdAt: new Date(Date.now() - 3600000 * 3) // 3 hours ago
      },
      {
        _id: new ObjectId(),
        conversationId: chatId,
        content: "Yes! I love the breathing exercises. Great for stress relief after a long day.",
        sender: {
          _id: users[4]._id,
          name: users[4].name,
          avatar: users[4].avatar
        },
        read: true,
        createdAt: new Date(Date.now() - 3600000) // 1 hour ago
      },
      {
        _id: new ObjectId(),
        conversationId: chatId,
        content: "Just checking in - how's everyone's fitness journey going today? 💪",
        sender: {
          _id: users[0]._id,
          name: users[0].name,
          avatar: users[0].avatar
        },
        read: false,
        createdAt: new Date() // Just now
      }
    ];

    // Check for existing messages to avoid duplicates
    const existingCount = await db.collection("messages").countDocuments({ conversationId: chatId });
    
    if (existingCount > 0) {
      // Delete existing messages for this conversation
      await db.collection("messages").deleteMany({ conversationId: chatId });
      console.log(`Deleted ${existingCount} existing messages`);
    }
    
    // Insert messages
    await db.collection("messages").insertMany(messages);

    // Update the last message in the conversation
    const lastMessage = messages[messages.length - 1];
    await db.collection("conversations").updateOne(
      { _id: chatId },
      { 
        $set: { 
          lastMessage: {
            content: lastMessage.content,
            timestamp: lastMessage.createdAt,
            sender: lastMessage.sender._id
          },
          updatedAt: new Date()
        } 
      }
    );

    return NextResponse.json({ 
      success: true, 
      message: "General chat seeded successfully", 
      data: {
        conversationId: chatId.toString(),
        messageCount: messages.length
      }
    });
  } catch (error) {
    console.error("Error seeding general chat:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to seed general chat" 
    }, { status: 500 });
  }
}
