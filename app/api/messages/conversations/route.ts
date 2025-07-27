import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Message from '@/lib/models/Message';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Get all conversations for the current user
export async function GET(req: Request) {
  try {
    await connectToDB();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const user = session.user;
    if (!user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    if (!session.user.id) {
      return NextResponse.json({ message: 'User ID not found in session' }, { status: 401 });
    }
    const userId = session.user.id;

    // Get all messages where the user is either the sender or receiver
    const messages = await Message.find({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })
      .sort({ timestamp: -1 })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar');

    // Group messages by conversation (unique sender-receiver pairs)
    const conversations = messages.reduce((acc, message) => {
      const senderIdStr = message.sender._id.toString();
      const receiverIdStr = message.receiver._id.toString();
      const userIdStr = userId.toString();
      
      // Determine if the current user is the sender or receiver
      const isUserSender = senderIdStr === userIdStr;
      
      // Get the other user in the conversation
      const otherUser = isUserSender ? message.receiver : message.sender;
      const otherUserId = otherUser._id.toString();
      
      // Only add this conversation if we haven't seen it before
      if (!acc[otherUserId]) {
        // Get the populated user fields
        const populatedUser = otherUser as any; // Type assertion to access populated fields
        
        acc[otherUserId] = {
          user: {
            id: otherUserId,
            name: populatedUser.name,
            avatar: populatedUser.avatar
          },
          lastMessage: {
            content: message.content,
            timestamp: message.timestamp,
            unread: !message.read && receiverIdStr === userIdStr
          }
        };
      }
      
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json(Object.values(conversations));
  } catch (error) {
    console.error('Error getting conversations:', error);
    return NextResponse.json({ message: 'Error getting conversations' }, { status: 500 });
  }
}
