import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Message from '@/lib/models/Message';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Types } from 'mongoose';

// Send a message
export async function POST(req: Request) {
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

    const { receiverId, content } = await req.json();

    // Validate receiverId
    if (!Types.ObjectId.isValid(receiverId)) {
      return NextResponse.json({ message: 'Invalid receiver ID' }, { status: 400 });
    }

    // Create and save the message
    const message = await Message.create({
      sender: user._id,
      receiver: receiverId,
      content,
      timestamp: new Date(),
      read: false
    });

    // Populate sender and receiver
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar');

    return NextResponse.json(populatedMessage, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ message: 'Error sending message' }, { status: 500 });
  }
}
