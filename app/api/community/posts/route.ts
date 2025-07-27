import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Post from '@/lib/models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Get all posts with pagination
export async function GET(req: Request) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') as string) || 1;
    const limit = parseInt(searchParams.get('limit') as string) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name avatar'
        }
      });

    const total = await Post.countDocuments();

    return NextResponse.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching posts' }, { status: 500 });
  }
}

// Create post
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

    const { title, content, imageUrl, tags } = await req.json();
    if (!session.user.id) {
      return NextResponse.json({ message: 'User ID not found in session' }, { status: 401 });
    }
    const userId = session.user.id;
    const post = await Post.create({
      title,
      content,
      imageUrl,
      tags,
      author: userId
    });

    const populatedPost = await post.populate('author', 'name avatar');
    return NextResponse.json(populatedPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating post' }, { status: 500 });
  }
}
