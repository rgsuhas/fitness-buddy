import { NextRequest, NextResponse } from 'next/server';
import Post from '@/lib/models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDB } from '@/lib/db';

// Update comment
export async function PUT(req: Request, { params }: { params: { id: string, commentId: string } }) {
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
    if (comment.author.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const { content } = await req.json();
    comment.content = content;
    await post.save();
    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating comment' }, { status: 500 });
  }
}

// Delete comment
export async function DELETE(req: Request, { params }: { params: { id: string, commentId: string } }) {
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
    if (comment.author.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    comment.deleteOne();
    await post.save();
    return NextResponse.json({ message: 'Comment deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting comment' }, { status: 500 });
  }
}
