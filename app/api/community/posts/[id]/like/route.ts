import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Post from '@/lib/models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Types } from 'mongoose';

// Toggle post like
export async function POST(req: Request, { params }: { params: { id: string } }) {
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

    const post = await Post.findById(params.id);
    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const userId = user._id.toString();
    const index = post.likes.findIndex((id: Types.ObjectId) => id.toString() === userId);
    
    if (index === -1) {
      post.likes.push(new Types.ObjectId(userId));
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    return NextResponse.json({ likes: post.likes });
  } catch (error) {
    return NextResponse.json({ message: 'Error toggling like' }, { status: 500 });
  }
}
