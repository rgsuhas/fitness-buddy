import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Message from '@/lib/models/Message';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Types } from 'mongoose';

// Get messages between current user and another user
export async function GET(req: Request, { params }: { params: { userId: string } }) {
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

    const userId = user._id;
    const otherUserId = params.userId;

    // Validate otherUserId
    if (!Types.ObjectId.isValid(otherUserId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    // Get all messages between the two users
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    })
      .sort({ timestamp: 1 })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar');

    // Mark unread messages as read
    await Message.updateMany(
      { sender: otherUserId, receiver: userId, read: false },
      { read: true }
    );

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error getting messages:', error);
    return NextResponse.json({ message: 'Error getting messages' }, { status: 500 });
  }
}
