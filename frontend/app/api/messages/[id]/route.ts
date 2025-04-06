import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/messages/[id] - Get messages for a specific conversation
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id;
    
    const client = await clientPromise;
    const db = client.db("fitness-buddy");
    
    // Get conversation
    const conversation = await db.collection("conversations").findOne({ 
      _id: new ObjectId(conversationId) 
    });
    
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }
    
    // Get messages
    const messages = await db.collection("messages")
      .find({ conversationId: new ObjectId(conversationId) })
      .sort({ createdAt: 1 })
      .toArray();
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

// POST /api/messages/[id] - Send a message in a conversation
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id;
    const { content, senderId, mediaUrl } = await request.json();
    
    if (!content || !senderId) {
      return NextResponse.json({ error: "Content and sender ID are required" }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("fitness-buddy");
    
    // Get conversation
    const conversation = await db.collection("conversations").findOne({ 
      _id: new ObjectId(conversationId) 
    });
    
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }
    
    // Verify sender is a participant
    const senderParticipant = conversation.participants.find(
      (p: any) => p._id.toString() === senderId
    );
    
    if (!senderParticipant) {
      return NextResponse.json({ error: "Sender is not a participant in this conversation" }, { status: 403 });
    }
    
    // Get receiver (the other participant)
    const receiverParticipant = conversation.participants.find(
      (p: any) => p._id.toString() !== senderId
    );
    
    // Create new message
    const newMessage = {
      _id: new ObjectId(),
      conversationId: new ObjectId(conversationId),
      content,
      mediaUrl,
      sender: {
        _id: senderParticipant._id,
        name: senderParticipant.name,
        avatar: senderParticipant.avatar
      },
      receiver: {
        _id: receiverParticipant._id,
        name: receiverParticipant.name,
        avatar: receiverParticipant.avatar
      },
      read: false,
      createdAt: new Date()
    };
    
    await db.collection("messages").insertOne(newMessage);
    
    // Update conversation with last message
    await db.collection("conversations").updateOne(
      { _id: new ObjectId(conversationId) },
      { 
        $set: { 
          lastMessage: {
            content,
            timestamp: newMessage.createdAt,
            sender: senderParticipant._id
          },
          updatedAt: newMessage.createdAt
        } 
      }
    );
    
    return NextResponse.json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
