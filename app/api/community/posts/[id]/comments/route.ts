import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Post from '@/lib/models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Add comment
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

    const { content } = await req.json();
    const comment = {
      content,
      author: user._id
    };

    post.comments.push(comment);
    await post.save();

    const populatedPost = await post.populate({
      path: 'comments.author',
      select: 'name avatar'
    });

    return NextResponse.json(populatedPost.comments[populatedPost.comments.length - 1]);
  } catch (error) {
    return NextResponse.json({ message: 'Error adding comment' }, { status: 500 });
  }
}
