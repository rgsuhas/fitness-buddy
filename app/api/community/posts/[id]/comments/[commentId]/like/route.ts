import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Post from '@/lib/models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Types } from 'mongoose';

// Toggle comment like
export async function POST(req: Request, { params }: { params: { id: string, commentId: string } }) {
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

    const comment = post.comments.id(params.commentId);
    if (!comment) {
      return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
    }

    if (!session.user.id) {
      return NextResponse.json({ message: 'User ID not found in session' }, { status: 401 });
    }
    const userId = session.user.id;
    const index = comment.likes.findIndex((id: Types.ObjectId) => id.toString() === userId);

    if (index === -1) {
      comment.likes.push(new Types.ObjectId(userId));
    } else {
      comment.likes.splice(index, 1);
    }

    await post.save();
    return NextResponse.json({ likes: comment.likes });
  } catch (error) {
    return NextResponse.json({ message: 'Error toggling comment like' }, { status: 500 });
  }
}
