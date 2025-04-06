import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/messages/conversations - Get all conversations for a user
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
