import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Message from '@/lib/models/Message';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Types } from 'mongoose';

// Mark messages as read
export async function PUT(req: Request, { params }: { params: { userId: string } }) {
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
    const senderId = params.userId;

    // Validate senderId
    if (!Types.ObjectId.isValid(senderId)) {
      return NextResponse.json({ message: 'Invalid sender ID' }, { status: 400 });
    }

    // Mark all messages from sender to user as read
    await Message.updateMany(
      { sender: senderId, receiver: userId, read: false },
      { read: true }
    );

    return NextResponse.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json({ message: 'Error marking messages as read' }, { status: 500 });
  }
}
