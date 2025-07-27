import { NextRequest, NextResponse } from 'next/server';
import Post from '@/lib/models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Get single post
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDB();
    const post = await Post.findById(params.id)
      .populate('author', 'name avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name avatar'
        }
      });

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching post' }, { status: 500 });
  }
}

// Update post
export async function PUT(req: Request, { params }: { params: { id: string } }) {
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

    if (post.author.toString() !== user._id.toString()) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const { title, content, imageUrl, tags } = await req.json();
    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;
    post.tags = tags;

    await post.save();
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating post' }, { status: 500 });
  }
}

// Delete post
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
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

    if (post.author.toString() !== user._id.toString()) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    await post.deleteOne();
    return NextResponse.json({ message: 'Post deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting post' }, { status: 500 });
  }
}
