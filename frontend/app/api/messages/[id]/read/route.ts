import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

// PUT /api/messages/[id]/read - Mark messages as read
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("fitness-buddy");
    
    // Mark all messages sent to this user in this conversation as read
    await db.collection("messages").updateMany(
      { 
        conversationId: new ObjectId(conversationId),
        "receiver._id": new ObjectId(userId),
        read: false
      },
      { $set: { read: true } }
    );
    
    // Update the conversation's last message read status if needed
    const conversation = await db.collection("conversations").findOne({ 
      _id: new ObjectId(conversationId) 
    });
    
    if (conversation && 
        conversation.lastMessage && 
        conversation.lastMessage.sender.toString() !== userId) {
      await db.collection("conversations").updateOne(
        { _id: new ObjectId(conversationId) },
        { $set: { "lastMessage.read": true } }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return NextResponse.json({ error: "Failed to mark messages as read" }, { status: 500 });
  }
}
