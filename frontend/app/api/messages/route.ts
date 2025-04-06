import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/messages - Get all conversations for a user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("fitness-buddy");
    
    // Find all conversations where the user is a participant
    const conversations = await db.collection("conversations")
      .find({
        "participants._id": new ObjectId(userId)
      })
      .sort({ updatedAt: -1 })
      .toArray();
    
    // Format conversations for the client
    const formattedConversations = conversations.map(conversation => {
      // Find the other participant (not the current user)
      const otherParticipant = conversation.participants.find(
        (p: any) => p._id.toString() !== userId
      );
      
      return {
        id: conversation._id.toString(),
        user: {
          id: otherParticipant._id.toString(),
          name: otherParticipant.name,
          avatar: otherParticipant.avatar
        },
        lastMessage: conversation.lastMessage ? {
          content: conversation.lastMessage.content,
          timestamp: conversation.lastMessage.timestamp,
          unread: conversation.lastMessage.sender.toString() !== userId && 
                  !conversation.lastMessage.read
        } : null
      };
    });
    
    return NextResponse.json(formattedConversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}

// POST /api/messages - Create a new conversation
export async function POST(request: NextRequest) {
  try {
    const { senderId, receiverId } = await request.json();
    
    if (!senderId || !receiverId) {
      return NextResponse.json({ error: "Sender and receiver IDs are required" }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("fitness-buddy");
    
    // Check if both users exist
    const sender = await db.collection("users").findOne({ _id: new ObjectId(senderId) });
    const receiver = await db.collection("users").findOne({ _id: new ObjectId(receiverId) });
    
    if (!sender || !receiver) {
      return NextResponse.json({ error: "One or both users not found" }, { status: 404 });
    }
    
    // Check if conversation already exists
    const existingConversation = await db.collection("conversations").findOne({
      $and: [
        { "participants._id": new ObjectId(senderId) },
        { "participants._id": new ObjectId(receiverId) }
      ]
    });
    
    if (existingConversation) {
      return NextResponse.json({ 
        id: existingConversation._id.toString(),
        message: "Conversation already exists" 
      });
    }
    
    // Create new conversation
    const newConversation = {
      _id: new ObjectId(),
      participants: [
        {
          _id: sender._id,
          name: sender.name,
          avatar: sender.avatar
        },
        {
          _id: receiver._id,
          name: receiver.name,
          avatar: receiver.avatar
        }
      ],
      lastMessage: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection("conversations").insertOne(newConversation);
    
    return NextResponse.json({ 
      id: newConversation._id.toString(),
      message: "Conversation created successfully" 
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });
  }
}
